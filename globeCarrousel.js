// ------------- Helper functions ------------------
async function render (globeObject) {
    const G = globeObject;
    G.satelites.forEach(s => {
        const Z = z(s.coordinates.phi, s.coordinates.theta, globeObject.depthSize); // current zIndex
        s.wrapper.style.zIndex = Z;
        s.wrapper.style.filter = `blur(${(1-Z/globeObject.depthSize) * G.blur}px)`;
        s.wrapper.style.width = `${G.elementSize * (1 - (1-Z/globeObject.depthSize) * G.depthScale)}px`;
        s.wrapper.style.height = s.wrapper.style.width;
        s.wrapper.style.fontSize = `${globeObject.fontSize*(1 - (1-Z/globeObject.depthSize) * G.depthScale)}rem`;
        s.wrapper.style.marginLeft = `${G.center[0] + (G.r + s.coordinates.radius_dev) * Math.sin(s.coordinates.theta) * Math.cos(s.coordinates.phi)}px`;
        s.wrapper.style.marginTop = `${G.center[1] + (G.r + s.coordinates.radius_dev) * Math.cos(s.coordinates.theta)}px`;
    });
}

async function drift (globeObject) {
    /* 
    This function simulates a smallest timestep 
    simulation called a drift. Note that T = 1/frequency(Hz)
    */
    const   T = 1 / globeObject.freq, s = globeObject.satelites;
    for (let i = 0; i < s.length; i++) {
        const sat = s[i];
        sat.coordinates.theta = (sat.coordinates.theta + globeObject.dt) % (2 * Math.PI);
        sat.coordinates.phi = (sat.coordinates.phi + globeObject.dp) % (2 * Math.PI);
    } await sleep (T);
    await render(globeObject);
}

async function sleep (seconds) {
    return new Promise(function(resolve){setTimeout(function(){resolve(0)},1000*seconds)});
}

function toArray (collection) {return Array.prototype.filter.call(collection, function(el) { return el })}

function u () {return Math.random()} // uniform samplers

function u_sign () {if (u() <= .5) {return 1} return -1}

async function update (globeObject) {
    var absVal;
    while (globeObject.active) {
        
        // *** apply exp. decay to velocities ***
        if (globeObject.decay != 0) {
            absVal = Math.abs(globeObject.dt);
            if (absVal > globeObject.minVelY) {
                globeObject.dt *= (1-globeObject.decay);
            } else if (absVal < globeObject.minVelY) {
                globeObject.dt = globeObject.minVelY;
            } absVal = Math.abs(globeObject.dp);
            if (absVal > globeObject.minVelX) {
                globeObject.dp *= (1-globeObject.decay);
            } else if (absVal < globeObject.minVelX) {
                globeObject.dp = globeObject.minVelX;
            } 
        }
        
        // compute new position and render
        await drift(globeObject);
    }
}

function z (phi, theta, depthSize=1000) {
    /* objects in front will have z=1000, in deepest back z=0
    i.e. 1000 (depthsize) layers of depth */
    const y = (1 - Math.sin(phi) * Math.sin(theta)); // between 1 and -1
    return Math.round(y * depthSize)
}
// -------------------------------------------------



// ---- main function ----
function globe (Element, attributes=null) {

    console.log('inserted', attributes, typeof(attributes))

    // get height and width
    const e = Element;
    var h = e.clientWidth,
        w = e.clientHeight;

    // ######## scaling & parameters ########
    // collect and override default options if provided
    const defaultAttributes = {
        "borders": true,
        "blurRadius": 10,
        "damping": .01, 
        "depthScale": 1.5,
        "depthSize": 5000,
        "fontSize": 0.8,
        "globeSize": 0.2,
        "hoverSmoothing": 0.2,
        "maxVel": .2,
        "minVelX": 0.01,
        "minVelY": 0.001,
        "radius": 0.8, // i.e. the diameter is 80% from total height 
        "radiusDev": 0.1, // i.e. the objects deviation from the mean radius
        "sensitivity": 20,
        "zoom": true,
    }; if (attributes != null) {
        const providedKeys = Object.keys(attributes);
        console.log('keys', providedKeys)
        console.log('overwrite attributes')
        for (let i = 0; i < providedKeys.length; i++) 
            {defaultAttributes[providedKeys[i]] = attributes[providedKeys[i]]}
    }
    console.log('attributes', defaultAttributes)
    
    // load variables from options
    const globeSize = defaultAttributes.globeSize;
    const depthScale = defaultAttributes.depthScale;
    const depthSize = defaultAttributes.depthSize;
    const blurRadius = defaultAttributes.blurRadius; // in px
    const borders = defaultAttributes.borders;
    const fontSize = defaultAttributes.fontSize; // in rem
    const hoverSmoothing = defaultAttributes.hoverSmoothing;
    const minVelX = defaultAttributes.minVelX;
    const minVelY = defaultAttributes.minVelY;
    const maxVel = defaultAttributes.maxVel; // in Hz
    const radius = defaultAttributes.radius;
    const radiusDev = defaultAttributes.radiusDev;
    const sensitivity = defaultAttributes.sensitivity; // px
    const damping = defaultAttributes.damping;
    const zoom = defaultAttributes.zoom;

    // **** convert parameters ****
    const size = Math.floor(Math.min.apply(Math, [h,w]) * globeSize); // percentage

    // time and frequency
    const freq = 30; // in Hertz
    
    // define radius
    const   r = radius * h / 2,
            r_dev = radiusDev;
    
            // starting increment (velocities)
    var     dt = minVelY * Math.PI, 
            dp = minVelX * Math.PI; // azimuthal

    // find center relative to parent element
    var c = [Math.floor(w/2), Math.floor(h/2)];

    // build satelite objects
    const   satelites = [],
            options = toArray(e.getElementsByTagName('option'));
    
    // iterate: each option specified will turn into a satelite
    for (let i = 0; i < options.length; i++) {
        const obj = options[i];
        var isSelected = false;

        // build object
        const object = {
            "content": obj.innerHTML, 
            "coordinates": {
                "radius_dev": u_sign()*u()*r_dev, 
                "phi": u()*2*Math.PI, 
                "theta": Math.PI*u()
            },
            "selected": isSelected, 
            "wrapper": document.createElement('div') 
        } 

        // ---- styling ---- 
        e.style.zIndex = depthSize + 1;
        object.wrapper.style.position = 'absolute';
        object.wrapper.style.display = 'block';
        object.wrapper.style.height = size;
        object.wrapper.style.width = size;
        if (borders) {object.wrapper.style.overflow = "hidden"}

        // add content to wrapper
        object.wrapper.innerHTML = object.content;

        // add wrapper to main element
        e.appendChild(object.wrapper)
        
        // add to satelites
        satelites.push(object)

        // forget option
        e.removeChild(obj)
    }

    // wrap into object which can be forwarded
    globeObject = {
        "active": true, // if disabled the animation will stop (closes the loop)
        "blur": blurRadius, // maximum blur radius in px
        "center": c, // array of center coordinates (cartesian within parent element)
        "decay": damping, // exponential angular velocity damping coefficient between 0 and 1
        "depthScale": depthScale, // max depth scale difference of satelites between front and back
        "depthSize": depthSize, // number of depth layers starting from 0 and ascending
        "dt": dt, // vertical angular increment in arcs/(s*frequency)=arcs this much arc (like 1.7pi) is added per timestep
        "dp": dp, // horizontal angular increment in arcs/(s*frequency)=arcs this much arc is added per timestep
        "element": e, // the main html element/target
        "elementSize": size, // size of satelite in px (will always build squared satelite wrappers)
        "fontSize": fontSize, // font size in rem
        "freq": freq, // simulation frequency in Hz
        "minVelX": minVelX, // minimal horizontal angular velocity
        "minVelY": minVelY, // minimal vertical angular velocity
        "maxVel": maxVel, // maximum velocity (both axes)
        "mouse": c, // array of last mouse position (will be saved in object itself)
        "r": r, // total radius in px
        "satelites": satelites // array of all satelite objects
    };

    // ---- append event listeners ----
    e['selected'] = false; // append a switch variable
    e.addEventListener('mousedown', event => {
        // slow down abruptly when clicked
        globeObject.dt = globeObject.dt/Math.abs(globeObject.dt)*minVelY;
        globeObject.dp = globeObject.dp/Math.abs(globeObject.dp)*minVelX;
        e.selected = false;
    });
    e.addEventListener('mouseover', event => {
        globeObject.mouse = [event.offsetX, event.offsetY];
        e.selected = true;
    });
    e.addEventListener('mouseup', event => {
        e.selected = false;
    });
    e.addEventListener('onfocusout', event => {
        e.selected = false;
    });
    e.addEventListener('mousemove', async function (event) {
        if (e.selected) {
            // measure time and cursor position
            dx = globeObject.mouse[0]-event.offsetX;
            dy = globeObject.mouse[1]-event.offsetY;
            
            // do something only if there is significant movement
            if (Math.abs(dx)+Math.abs(dy) > sensitivity) {
                await sleep(1/globeObject.freq)
                globeObject.mouse = [event.offsetX, event.offsetY];

                // override angular velocities
                omega_x = -dx/globeObject.r;
                omega_y = dy/globeObject.r;
                if (Math.abs(omega_x) > maxVel) {
                    omega_x = omega_x / Math.abs(omega_x) * maxVel
                } if (Math.abs(omega_y) > maxVel) {
                    omega_y = omega_y / Math.abs(omega_y) * maxVel
                } 

                // update new velocities with exponential smoothing method
                globeObject.dt = hoverSmoothing*omega_y + (1-hoverSmoothing)*globeObject.dt; // v/r = omega
                globeObject.dp = hoverSmoothing*omega_x + (1-hoverSmoothing)*globeObject.dp;
            }
        }
    }); 
    e.addEventListener("wheel", event => {
        if (zoom) {
            if (event.deltaY > 0) {
                globeObject.r *= .80;
            } else {
                globeObject.r *= 1.125;
            }
        }
            
    });

    // render once and then start update loop
    render(globeObject);
    update(globeObject);
}
// -----------------------


// ---- loader function ----
function load () {

    /*  Will load the globe on all tags with class "globe".
        This function will trigger when the document is loaded. */        
    document.addEventListener("DOMContentLoaded", function(event) { 

        const targets = document.getElementsByClassName("globe");
        var divs = toArray(targets);

        for (let i = 0; i < divs.length; i++) {

            const div = divs[i];

            // parse out attributes
            var att = div.querySelector('attributes'), json={};
            if (att != null) {
                
                // json parse (manually)
                /* unfortunately JSON.parse(JSON.stringify(..)) returned a string idk */
                json = {};
                jsonPrepare = att.innerHTML;
                jp = jsonPrepare
                    .replaceAll(' ', '')
                    .replaceAll('\n', '')
                    .replaceAll('"', '')
                    .replaceAll('{', '')
                    .replaceAll('}', '')
                    .split(',');
                    for (let i = 0; i < jp.length; i++) {
                        const el = jp[i].split(':');
                        try {
                            console.log(el)
                            if (el[0] != "") {
                                json[el[0]] = parseFloat(el[1])
                            }
                        } catch (e) {
                            json[el[0]] = el[1]
                        }
                    } console.log('json', json)
                if (Object.keys(json).length == 0) {json = null}
                div.removeChild(att); // remove attributes
            } else {
                json = null
            }
            
            // load the globe
            globe(div, json);
        }
    });
}
// -------------------------

/* load all globes */
load();