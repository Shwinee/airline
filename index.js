function setup() {
    createCanvas(innerWidth, innerHeight);
    let o;
    cam.controller = "wasd"
    o = new Player();
    o.ENGINE_INFO = scene.make_object_info(o);
    o.ENGINE_INFO.id = "cohen"
    o.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.995, gravity: 0.2}));
    o.ENGINE_INFO.components.add(new engine.comps.collider({}));
    scene.add(o);
    
    scene.add(new Empty(-(width*10), -height, width*20, 10));
    scene.add(new Empty(-(width*10), height*2, width*20, 10));
    for (let i = 0; i < 100; i++) {
        let h = random(50, 150);
        scene.add(new Empty(((i-50)+1)*(500), (height/2)-(h/2)+(random(-150, 150)), 300, h))
    }
    // for (let i = 0; i < 50; i++) {
    //     scene.add(new Empty(random(-(width*2), width*2), random(-(height*2), height*2), random(50, 200), random(50, 200)))
    // }
}

function draw() {
    background(100, 100, 100, 255);
    let player = scene.data[scene.getFromId("cohen")];

    if (player.shot == false) {
        cam.follow((player.x+cam.mx)/2, (player.y+cam.my)/2)
    }else {
        cam.follow((player.shot_pos_x+player.x)/2, (player.shot_pos_y+player.y)/2);
    }


    if (mouseIsPressed) {
        player.shoot(cam.mx, cam.my);
    }else {
        player.shot = false;
        if (player.grap_deployed == true) {
            player.grap_deployed = false;

            // add force that makes player go twards grap point fast 

            if (player.shot_time > 450) {
                let v1 = createVector(player.shot_pos_x, player.shot_pos_y);
                let v2 = createVector(player.x, player.y);
                let v3 = p5.Vector.sub(v1, v2);
    
                v3.normalize();
                
                console.log(player.shot_time);
                
                let val = map(player.shot_time, 450, 750, 0.1, 15, true);
    
                v3.mult(val);
                
                player.addForce(v3.x, v3.y*0.25)
            }
        }
    }
    
    engine.tick();
}

function mouseClicked() {
    let player = scene.data[scene.getFromId("cohen")];

    // scene.click();
}