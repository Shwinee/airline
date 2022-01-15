function setup() {
    createCanvas(innerWidth, innerHeight);
    let o;
    cam.controller = "wasd"
    o = new Player();
    o.ENGINE_INFO = scene.make_object_info(o);
    o.ENGINE_INFO.id = "cohen"
    o.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.99, gravity: 0.1}));
    o.ENGINE_INFO.components.add(new engine.comps.collider({}));
    scene.add(o);
    
    scene.add(new Empty(-(width*10), 10, width*20, 10));
    scene.add(new Empty(-(width*10), height-10, width*20, 10));
    for (let i = 0; i < 30; i++) {
        let h = random(50, 150);
        scene.add(new Empty(((i-15)+1)*(500), (height/2)-(h/2), 300, h))
    }
}

function draw() {
    background(100, 100, 100, 255);
    let player = scene.data[scene.getFromId("cohen")];

    if (mouseIsPressed) {
        player.shoot(cam.mx, cam.my);
    }else {
        player.shot = false;
    }
    
    engine.tick();
}

function mouseClicked() {
    let player = scene.data[scene.getFromId("cohen")];

    // scene.click();
}