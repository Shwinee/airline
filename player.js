function Player() {
    this.x = 100;
    this.y = 100;

    this.w = 32;
    this.h = 32;

    this.min_speed = 0.01;
    this.max_speed = 0.25;

    this.render = function() {
        fill(205, 10, 30);
        rect(this.x, this.y, this.w, this.h);
        
        if (this.shot == true) {
            if (keyIsDown(32)) {
                this.min_speed = 1;
                this.max_speed = 1;
            }else {
                this.min_speed = 0.01;
                this.max_speed = 0.25;
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

            if (this.x < this.shot_pos_x) {
                this.addForce(map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 1000, 500, this.min_speed, this.max_speed, true), 0);
            }
            if (this.x > this.shot_pos_x) {
                this.addForce(-map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 1000, 500, this.min_speed, this.max_speed, true), 0);
            }
            if (this.y > this.shot_pos_y) {
                this.addForce(0, -map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 1000, 500, this.min_speed, this.max_speed/1.5, true));
            }
            if (this.y < this.shot_pos_y) {
                this.addForce(0, map(dist(this.x+(this.w/2), this.y+(this.h/2), this.shot_pos_x, this.shot_pos_y), 1000, 500, this.min_speed, this.max_speed/1.5, true));
            }
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
        this.shot_pos_x = c.x;
        this.shot_pos_y = c.y;
        this.shot = true;
    }
}