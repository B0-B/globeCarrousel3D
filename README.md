<h1 align="center">🌐 Carrousel 3D</h1> 


<p class="text-gray mb-2" align="center">Handy & embeddable 3D engine script for rigid body simulations - orbiting HTML5 content in a carrousel container. </p>

<h3 align="center" > ◕‿◕ </h3>

<br>

<h3 align="center"> This project is also on <a href="https://codepen.io/">c◈depen</a>.</h3> 




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
Fetch the script directly from here (no need for download)
```html
<head>
    ...
    <script src="https://raw.github.com/B0-B/globeCarrousel3D/main/globeCaroussel.js"></script>
<head>
```

### II. Initiate Globe
The globe object will initialize itself relative to parent container hence it should contain fixed size values. In case of adjustments use the attributes tag. It allows to provide arguments as json.
```html
<body style="background:black">
    ...
    <div class="globe layout center">
        <!-- customize -->
        <attributes>
            optional (json-format)
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