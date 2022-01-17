function Player() {
    this.x = 6250;
    this.y = 6100;

    this.w = 32;
    this.h = 32;

    this.gliding = false;

    this.shot_time = 0;

    this.dashing = false;
    this.can_dash = true;

    this.team = 1;

    this.grap_deployed = false;

    this.can_fire = true;
    this.fire_cooldown = 100;

    this.graped_forces = [];

    this.range = 2000;

    this.multiplayer_id = undefined;

    this.hp = 100;

    this.speed1 = 0.5;
    this.speed2 = 0.1;

    this.hurt = function(dmg) {
        // this.hp -= dmg;
        play_sound(this.x, this.y, 'hurt');
    }

    this.render = function() {
        if (this.hp <= 0) {
            this.speed1 = 0;
            this.speed2 = 0;
        }

        if (this.dashing == false) {
            fill(0, 0, 0);
        }else {
            fill(255, 0, 0);
        }
        rect(this.x, this.y, this.w, this.h);
        fill(0, 255, 0);
        rect(this.x, this.y-20, map(this.hp, 0, 100, 0, this.w, true), 10);
        
        if (this.gliding == true) {
            fill(100, 100, 100);
            rect(this.x-50, this.y-50, this.w+100, 10);
            line(this.x, this.y, this.x-50, this.y-40);
            line(this.x+this.w, this.y, (this.x-50)+(this.w+100), this.y-40);
        }

        let bullets = scene.getAllObjects('Bullet');
        let emptys = scene.getAllObjects('Empty');
        let ignore_list = [this];
        let input = bullets.concat(ignore_list, emptys);

        let r = new Ray(this.x+(this.w/2), this.y+(this.h/2), true, ignore_list);
        r.setDir(cam.mx, cam.my);
        let c = r.sceneCheck();
        if (c != undefined) {
            if (dist(this.x, this.y, c.x, c.y) <= this.range) {
                fill(0, 255, 0);
            }else {
                fill(255, 0, 0);
            }
        }

        ellipse(cam.mx, cam.my, 10, 10);

        if (this.shot == true) {
            this.grap_deployed = true;
            
            stroke(255, 255, 255);
            line(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y)
            stroke(0, 0, 0);

            let v1 = createVector(this.shot_pos_x, this.shot_pos_y);
            let v2 = createVector(this.x, this.y);
            let v3 = p5.Vector.sub(v1, v2);

            v3.normalize();
            v3.mult(this.speed1);
         
            this.addForce(v3.x, v3.y*1.1)

            v1 = createVector(cam.mx, cam.my);
            v2 = createVector(this.x, this.y);
            v3 = p5.Vector.sub(v1, v2);

            v3.normalize();
            v3.mult(this.speed2);

            this.addForce(v3.x, v3.y*3);
        }
    }

    this.shot = false;
    this.shot_pos_x = undefined;
    this.shot_pos_y = undefined;
    this.mouse_pos_x = undefined;
    this.mouse_pos_y = undefined;
    this.shot_object_id = undefined;

    this.shoot = function(x, y) {
        if (this.shot == true) {
            let obj = scene.data[scene.getFromId(this.shot_object_id)];
            if (obj != undefined) {
                if (obj.addForce) {
                    this.shot_pos_x = obj.x;
                    this.shot_pos_y = obj.y;
                }
            }else {
                this.shot = false;
            }
            return;
        }
        let r = new Ray(this.x+(this.w/2), this.y+(this.h/2), true, [this]);
        r.setDir(x, y);
        let c = r.sceneCheck();
        if (c == undefined) {
            return;
        }
        if (dist(this.x, this.y, c.x, c.y) <= this.range) {
            if (scene.data[c.index].constructor.name.toString() == 'Rocket') {
                if (scene.data[c.index].target_id == "cohen") {
                    return;
                }
            }

            if (scene.data[c.index].constructor.name.toString() == 'Team_Chooser') {
                this.team = scene.data[c.index].team;
                cam.max_speed = 10;
                setTimeout(() => {
                    cam.max_speed = 2
                }, 3000)
                if (this.team == 1) {
                    this.x = -18000-100;
                    this.y = -16.117197513991584-100;
                }else if (this.team == 2) {
                    this.x = 18750+150;
                    this.y = -16.117197513991584-100;
                }else if (this.team == 0) {
                    cam.follow();
                }
            }

            // if (scene.data[c.index].constructor.name.toString() == 'Turret') {
            //     scene.data[c.index].hurt(5);
            //     play_sound(c.x, c.y, 'hurt');
            //     return;
            // }
            
            if (scene.data[c.index].constructor.name.toString() == 'Bullet') {
                return;
            }


            console.log(scene.data[c.index].constructor.name);
            play_sound(c.x, c.y, 'grapple');
            this.shot_pos_x = c.x;
            this.shot_pos_y = c.y;
            this.mouse_pos_x = cam.mx;
            this.mouse_pos_y = cam.my;
            this.shot_object_id = scene.data[c.index].ENGINE_INFO.id;
            this.shot = true;
            this.shot_time = 0;
            for (let i = 0; i < 3; i++) {
                scene.add(new Particle(this.shot_pos_x, this.shot_pos_y, (p) => {
                    p.dx += random(-0.3, 0.3);
                    p.dy += random(0, 1);
                    p.color = [165,42,42]
                }, (p) => {
                    if (p.lifetime >= 30) {
                        p.remove();
                    }
                }))
            }
        }
    }
}

setInterval(() => {
    let player = scene.data[scene.getFromId("cohen")];
    if (player.shot == true) {
        player.shot_time += 50;
    }else {
        player.shot_time = 0;
    }
}, 50);