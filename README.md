<h1 align="center">🌐 Carrousel 3D</h1> 


<p class="text-gray mb-2" align="center"> 
<img src=demo.gif> </p>

<h3 align="center" > Handy embeddable 3D globe engine - orbiting HTML5 content in a carrousel container. </h3>

<h3 align="center"> See a live demo on <a href="https://codepen.io/b0-b/full/bGgxKPW">c◈depen</a>.</h3> 

<h3 align="center" > ◕‿◕ </h3>




### Features

- 🧊 optics
- embeddable
- vanilla.js
- no dependencies
- customizable

### Usecases
1. slider
2. content display 
3. adding visual depth
4. ♾️



<br>

<h2 align="center">Usage</h2> 

### I. Embed
A script tag in the documents header will load the globes. The script is sourced either locally (after cloning) or by fetching directly from repository
```html
<head>
    ...
    <script type="text/javascript" src="https://b0-b.github.io/globeCarrousel3D/globeCarrousel.js"></script>
<head>
```

### II. Initiate Globe
The globe object will initialize itself relative to its parent container which is the element of choice. The script will trigger automatically when the document is loaded and catch all globe instances within the DOM. In case of adjustments use the attributes tag. It allows to provide attribute args in json format but **note** ignoring specific attributes or the `<attributes>`-tag at all will fallback to default values presented in the example below.
```html
<body style="background:black">
    ...
    <div class="globe">

        <!-- customize (optional) -->
        <attributes>
        { <!--all default values listed-->
            "borders": true, <!-- globe overflow hidden -->
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
        }
        </attributes>

        <!-- satelites -->
        <option>js</option>
        <option>docker</option>
        <option>nodejs</option>
        <option>git</option>
        <option>c++</option>
        <option>python</option>
        <option>bash</option>
        <option>html</option>
        <option>css</option>
        <option>SQL</option>
        <option>nosql</option>
    </div>
</body>
```

### Custom Style
The default style is mostly blank as the focus lied on dynamical and interactive modelling simultaneously the carrousel was designed such that styling can be appended intuitively and easy.

- you may add global style attributes like ```font-family``` directly to the `globe` object
- create eventListeners which are intended to trace a sattelite and respond to it's depth. The depth is encoded in the `z-index` of the option-element and lies between 0 and the provided `depthScale` (default=10000). This allows to create depth dependent transitions etc.
- customize your satelite content by adding html instead of text 
    ```html
    <div class="globe custom-class ...">
        ...
        <option>
            <div class="another-custom-class">
                <img src="..">
            </div>
        </option>
    ```
    but note that the html content will always transform to a square shape to fit minimal client `viewport`.
