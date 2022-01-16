function Player() {
    this.x = 100;
    this.y = 100;

    this.w = 32;
    this.h = 32;

    this.shot_time = 0;

    this.grap_deployed = false;

    this.graped_forces = [];

    this.range = 2000;

    this.multiplayer_id = undefined;

    this.render = function() {
        sendPlayerData();
        fill(0, 0, 0);
        rect(this.x, this.y, this.w, this.h);
        
        let r = new Ray(this.x+(this.w/2), this.y+(this.h/2), true, [this]);
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
            // if (keyIsDown(32)) { 
            //     v3.mult(1);
            // }else {
                v3.mult(0.5);
            // }

            this.addForce(v3.x, v3.y*1.1)
        }
    }

    this.shot = false;
    this.shot_pos_x = undefined;
    this.shot_pos_y = undefined;
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
            sounds.grapple.play();
            this.shot_pos_x = c.x;
            this.shot_pos_y = c.y;
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