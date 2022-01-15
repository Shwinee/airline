function Player() {
    this.x = 100;
    this.y = 100;

    this.w = 32;
    this.h = 32;

    this.min_speed = 0.2;
    this.max_speed = 0.35;

    this.shot_time = 0;

    this.grap_deployed = false;

    this.graped_forces = [];

    this.range = 2000;

    this.render = function() {
        fill(205, 10, 30);
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
            if (keyIsDown(32)) {
                this.min_speed = 0.4;
                this.max_speed = 0.6;
            }else {
                this.min_speed = 0.2;
                this.max_speed = 0.35;
            }
            
            noFill();
            beginShape();
            curveVertex(this.x+(this.w/2), this.y+(this.h/2));
            curveVertex(this.shot_pos_x, this.shot_pos_y);
            endShape();
            
            stroke(255, 255, 255);
            line(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y)
            stroke(0, 0, 0);

            ellipse(this.shot_pos_x, this.shot_pos_y, 10, 10);

            let v1 = createVector(this.shot_pos_x, this.shot_pos_y);
            let v2 = createVector(this.x, this.y);
            let v3 = p5.Vector.sub(v1, v2);

            v3.normalize();
            
            v3.mult(0.5);

            this.addForce(v3.x, v3.y*1.5)

            // if (this.x < this.shot_pos_x) {
            //     this.addForce(map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 3000, 500, this.min_speed, this.max_speed, true), 0);
            // }
            // if (this.x > this.shot_pos_x) {
            //     this.addForce(-map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 3000, 500, this.min_speed, this.max_speed, true), 0);
            // }
            // if (Math.abs(this.y - this.shot_pos_y) >= 300) {
            //     if (this.y > this.shot_pos_y) {
            //         this.addForce(0, -map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 3000, 500, this.min_speed, this.max_speed*1.5, true));
            //     }
            //     if (this.y < this.shot_pos_y) {
            //         this.addForce(0, map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 3000, 500, this.min_speed, this.max_speed*1.5, true));
            //     }
            // }
        }
    }

    this.shot = false;
    this.shot_pos_x = undefined;
    this.shot_pos_y = undefined;

    this.shoot = function(x, y) {
        if (this.shot == true) {
            return;
        }
        let r = new Ray(this.x+(this.w/2), this.y+(this.h/2), true, [this]);
        r.setDir(x, y);
        let c = r.sceneCheck();
        if (c == undefined) {
            return;
        }
        if (dist(this.x, this.y, c.x, c.y) <= this.range) {
            this.shot_pos_x = c.x;
            this.shot_pos_y = c.y;
            this.shot = true;
            this.shot_time = 0;
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