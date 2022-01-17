function setup() {
    createCanvas(innerWidth, innerHeight);
    let o;
    cam.controller = "wasd"

    scene.add(new Flyer(342685723574389247, 3486572983756392867, '2385uidsjfa08', 1))

    scene.add(new Empty(-(width*15), -height-height, width*50, height));
    scene.add(new Empty(-(width*15), height*2, width*50, height));
    scene.add(new Empty(-18000-width, -height-height, width, height*4));
    scene.add(new Empty((((75-25)-((75-25)/2)))*(750)+(750/2), -height-height, width, height*5));
    for (let i = 0; i < 50; i++) {
        let orgx = ((i-((75-25)/2))+1)*(750);
        let orgy = (height/2)
        o = new Island(orgx, orgy, Math.floor(random(4, 7)), Math.floor(random(2, 4)))
        o.ENGINE_INFO = scene.make_object_info(o);
        o.ENGINE_INFO.id = i.toString();
        scene.add(o);
        if (i % 3 == 0) {
            if (i < 25) {
                scene.add(new Turret(orgx, orgy-128, 1));
            }else {
                scene.add(new Turret(orgx, orgy-128, 2));
            }
        }
    }
    scene.add(new Island(100-(5*64), (height/2), 10, 2));

    scene.add(new Team_Chooser(((470/3)*0)+30, 30, 470/3, 100, 1));
    scene.add(new Team_Chooser(((470/3)*1)+30, 30, 470/3, 100, 2));
    scene.add(new Team_Chooser(((470/3)*2)+30, 30, 470/3, 100, 0));

    scene.add(new SpawnWall(0, 0, 500, 30)); // top
    scene.add(new SpawnWall(0, 500, 500, 30)); // bottop
    scene.add(new SpawnWall(470, 0, 30, 500)); // right
    scene.add(new SpawnWall(0, 0, 30, 500)); // left


}

function preload() {
    add_sprites(['sprites/ground.png', 'sprites/grass.png', 'sprites/grass_4.png', 'sprites/bottom.png', 'sprites/grass_1.png', 'sprites/grass_2.png', 'sprites/grass_3.png', 'sprites/corner_lr.png', 'sprites/corner_rl.png'])
    add_sounds(['sprites/boom.wav', 'sprites/shoot.wav', 'sprites/locked.wav', 'sprites/flying.wav', 'sprites/grapple.wav', 'sprites/hurt.wav'])
}

function draw() {
    background(130, 181, 240, 255);
    let player = scene.data[scene.getFromId("cohen")];

    
    if (player.team != 0) {
        if (player.shot == false) {
            cam.follow((player.x+cam.mx)/2, (player.y+cam.my)/2)
        }else {
            cam.follow((player.shot_pos_x+player.x)/2, (player.shot_pos_y+player.y)/2);
        }
    }
    
    if (mouseIsPressed) {
        player.shoot(cam.mx, cam.my);
    }else {
        player.shot = false;
        if (player.grap_deployed == true) {
            player.grap_deployed = false;
        }
    }
    if (keyIsDown(32)) {
        player.gliding = true;
        let v1 = createVector(cam.mx, cam.my);
        let v2 = createVector(player.x, player.y);
        let v3 = p5.Vector.sub(v1, v2);

        v3.normalize();
        v3.mult(0.05);

        player.addForce(v3.x, 0);
    }else {
        player.gliding = false;
        player.addForce(0, 0.19);
    }

    if (keyIsDown(81)) {
        if (player.can_fire == true) {
            player.can_fire = false;

            let v1 = createVector(cam.mx, cam.my);
            let v2 = createVector(player.x, player.y);
            let v3 = p5.Vector.sub(v1, v2);
            
            v3.normalize();
            v3.mult(20);
            
            scene.add(new Bullet(player.x+16, player.y+16, v3.x, v3.y, player.team));
            
            setTimeout(() => {
                player.can_fire = true;
            }, player.fire_cooldown);
            
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
    // if (k == 'r') {
    //     // scene.add(new Rocket(cam.mx, cam.my, Math.floor(random(0, 75-25)).toString()));
    //     scene.add(new Rocket(cam.mx, cam.my, 'cohen'));
    // }
    if (k == 'e') {
        let player = scene.data[scene.getFromId("cohen")];
        
        if (player.can_dash == false) {
            return;
        }

        player.can_dash = false;
        player.dashing = true;
        setTimeout(() => {
            player.dashing = false;
            for (let i = 0; i < 100; i++) {
                player.addFriction();
            }
        }, 200);
        setTimeout(() => {
            player.can_dash = true;
        }, 4000);

        let v1 = createVector(cam.mx, cam.my);
        let v2 = createVector(player.x, player.y);
        let v3 = p5.Vector.sub(v1, v2);

        v3.normalize();
        v3.mult(20);

        player.addForce(v3.x, v3.y);
    }
    if (k == 'w') {
        // sheild but no swing
        let player = scene.data[scene.getFromId("cohen")];
    }
    if (k == 'r') {
        //rocket
    }
}