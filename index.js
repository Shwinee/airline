function setup() {
    createCanvas(innerWidth, innerHeight);
    let o;
    cam.controller = "wasd"
    
    scene.add(new Enemy(51252461, 31463463463122345, 123192492521512358));
    
    scene.add(new Empty(-(width*15), -height-height, width*30, height));
    scene.add(new Empty(-(width*15), height*2, width*30, height));
    scene.add(new Empty(-18000-width, -height-height, width, height*4));
    scene.add(new Empty((((75-25)-((75-25)/2)))*(750)+(750/2), -height-height, width, height*5));
    for (let i = 0; i < 75-25; i++) {
        let orgx = ((i-((75-25)/2))+1)*(750);
        let h = random(50, 100);
        let orgy = (height/2)-(h/2)+(random(-500, 500))
        // scene.add(new Island_tile(orgx, orgy, 'grass_1'));
        // scene.add(new Island_tile(orgx+64, orgy, 'grass_2'));
        // scene.add(new Island_tile(orgx+(64*2), orgy, 'grass_2'));
        // scene.add(new Island_tile(orgx+(64*3), orgy, 'grass'));
        // scene.add(new Island_tile(orgx+(64*4), orgy, 'grass'));
        // scene.add(new Island_tile(orgx+(64*5), orgy, 'grass_3'));
        // scene.add(new Island_tile(orgx+(64*5), orgy+64, 'corner_rl'));
        // scene.add(new Island_tile(orgx+(64*4), orgy+64, 'bottom'));
        // scene.add(new Island_tile(orgx+(64*3), orgy+64, 'corner_lr'));
        o = new Island(orgx, orgy, Math.floor(random(4, 7)), Math.floor(random(2, 4)))
        o.ENGINE_INFO = scene.make_object_info(o);
        o.ENGINE_INFO.id = i.toString();
        scene.add(o);
    }
    // for (let i = 0; i < 50; i++) {
    //     scene.add(new Empty(random(-(width*2), width*2), random(-(height*2), height*2), random(50, 200), random(50, 200)))
    // }
}

function preload() {
    add_sprites(['/sprites/ground.png', '/sprites/grass.png', '/sprites/grass_4.png', '/sprites/bottom.png', '/sprites/grass_1.png', '/sprites/grass_2.png', '/sprites/grass_3.png', '/sprites/corner_lr.png', '/sprites/corner_rl.png'])
    add_sounds(['/sprites/boom.wav', '/sprites/locked.wav', '/sprites/flying.wav', '/sprites/grapple.wav', '/sprites/hurt.wav'])
}

function draw() {
    background(130, 181, 240, 255);
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

            if (player.shot_time > 450) {
                let v1 = createVector(player.shot_pos_x, player.shot_pos_y);
                let v2 = createVector(player.x, player.y);
                let v3 = p5.Vector.sub(v1, v2);
    
                v3.normalize();
                
                console.log(player.shot_time);
                
                let val = map(player.shot_time, 450, 750, 0.1, 5, true);
    
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

function keyPressed() {
    let k = key.toString();
    if (k == 'f') {
        scene.add(new Rocket(cam.mx, cam.my, Math.floor(random(0, 75-25)).toString()));
    }
}