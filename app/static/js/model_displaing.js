controlses = []
function makeScene(card, selector) {
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(60, 25/45, 0.1, 10000)
    camera.position.set(0, 0, 4)
    camera.layers.enable(1)
    const canvas = document.querySelector(selector)
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true})
    if (window.innerWidth <= 670) {
        renderer.setSize(200, 360)
    } else if (window.innerWidth >= 1700) {
        renderer.setSize(300, 550)
    } else {
        renderer.setSize(250, 450)
    }
    renderer.setPixelRatio( window.devicePixelRatio )
    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.maxPolarAngle = Math.PI / 2
    controls.minPolarAngle = Math.PI / 2
    controls.rotateSpeed = 0.5
    // controls.enableDamping = true
    // controls.dampingFactor = 0.05
    controlses.push(controls)
    const hemilight1 = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.4)
    hemilight1.position.set(0, 0, 1)
    scene.add(hemilight1)

    var light1 = new THREE.DirectionalLight(0xffffff, 0.2)
    light1.position.x = 0
    light1.position.y = 0
    light1.position.z = -5
    scene.add(light1)

    let glbModel = ""
    let model // ?
    const loader = new THREE.GLTFLoader();
    loader.load( `/static/js/models/${card}`, function ( glb ) {
        glbModel = glb.scene
        glbModel.traverse(model => {
            if (model.isMesh && model.name == "dimond_bottom" || model.isMesh && model.name == "dimond_top") {
                model.castShadow = true
                model.receiveShadow = true
                if(model.material.map) model.material.map.anisotropy = 16
                model.material = new THREE.MeshBasicMaterial({color: "rgb(127, 0, 255)", wireframe: false})
                model.layers.enable(1)
                model.layers.set(1);
                model.material.transparent = false
            } else {
                model.layers.set(0)
            }
        })
        scene.add( glb.scene )
        model = glb.scene // ?
    });

    /** COMPOSER */
    var renderScene = new THREE.RenderPass( scene, camera )
        
    var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader )
    effectFXAA.uniforms.resolution.value.set( 1 / window.innerWidth, 1 / window.innerHeight )
        
    var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    bloomPass.threshold = 0.1
    bloomPass.strength = 2.2
    bloomPass.radius = 0.5
    bloomPass.renderToScreen = true
        
    var composer = new THREE.EffectComposer( renderer )
    composer.setSize( window.innerWidth, window.innerHeight )
        
    composer.addPass( renderScene )
    composer.addPass( effectFXAA )
    composer.addPass( bloomPass )
        
    renderer.gammaInput = true
    renderer.gammaOutput = true
    renderer.toneMappingExposure = Math.pow( 0.9, 4.0 )
    renderer.render(scene, camera)
    function render() {
        renderer.autoClear = false;
        renderer.clear();
        //   camera.layers.set(1);
        composer.render();
        //   renderer.clearDepth();
        //   camera.layers.set(0);
    }
    return render
}
card_render = requestAnimationFrame(render)
let first_card = makeScene("card_first.glb", ".nft_first")
let second_card = makeScene("card_first.glb", ".nft_second")
let third_card = makeScene("card_first.glb", ".nft_third")
if (window.innerWidth <= 1000) {
    var fourth_card = makeScene("card_first.glb", ".nft_fourth")
}

// Render
$(".nfts_wrapper").mousedown(() => {
    card_render = requestAnimationFrame(render)
})

$(".nfts_wrapper").mouseup(() => {
    cancelAnimationFrame(card_render)
})


$(".nfts_wrapper").on("touchstart", function(){
    card_render = requestAnimationFrame(render)
})

$(".nfts_wrapper").on("touchend", function() {
    cancelAnimationFrame(card_render)
})

function render() {
    first_card()
    second_card()
    third_card()
    controlses.forEach((control) => {
        control.update()
    })
    if (window.innerWidth <= 1000) {
        fourth_card()
    }
    card_render = requestAnimationFrame(render)
}

// Observer\
flag = 0
let observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
            cancelAnimationFrame(card_render)
        } else {
            if (flag <= 1) {
                render()
                render()
                setTimeout(() => {
                    cancelAnimationFrame(card_render)
                }, 200)
                flag ++
            }
        }
    })
})
let el = document.querySelector('.nfts_wrapper')
observer.observe(el)

