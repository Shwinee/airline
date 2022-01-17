var cam = new Camera();

function Camera() {
    this.x = 0;
    this.y = 0;

    this.offx = 0;
    this.offy = 0;

    this.max_speed = 2;
    this.min_speed = 0.3;

    this.dx = 0;
    this.dy = 0;

    this.friction = 0.9;

    this.controller = "None"

    this.follow = function(x, y) {
        this.follow_object.x = x;
        this.follow_object.y = y;
    }
    
    this.follow_object = {x: 0, y: 0}
    
    this.addForce = function(x, y) {
        this.dx += x;
        this.dy += y;
    }

    this.update = function() {
        translate(this.x, this.y)

        this.dx *= this.friction;
        this.dy *= this.friction;

        this.x += this.dx;
        this.y += this.dy;

        this.cenx = (width/2) - this.x;
        this.ceny = (height/2) - this.y;
        
        this.mx = mouseX - this.x;
        this.my = mouseY - this.y;

        if (this.controller == "wasd") {
            if (keyIsDown(65)) {
                this.addForce(1, 0);
            }
        
            if (keyIsDown(68)) {
                this.addForce(-1, 0);
            }
        
            if (keyIsDown(87)) {
                this.addForce(0, 1);
            }
        
            if (keyIsDown(83)) {
                this.addForce(0, -1);
            }
        }

        if (this.follow_object.x == 0) {
            return 'No follow object';
        }
        
        // let wanted_x = (player.x+16) + (cam.mx) / 4;
        // let wanted_y = (player.y+16) + (cam.my) / 4;

        let wanted_x = (this.follow_object.x);
        let wanted_y = (this.follow_object.y);

        // MOVEMENT LAST
        this.speed = map(dist(this.cenx, this.ceny, wanted_x, wanted_y), 0, 700,  this.min_speed, this.max_speed, true);
        if (Math.abs(this.cenx - (wanted_x)) > 20) {
            if ((wanted_x) < this.cenx) {
                this.dx += this.speed;
            }
    
            if ((wanted_x) > this.cenx) {
                this.dx += -this.speed;
            }
        }

        if (Math.abs(this.ceny - (wanted_y)) > 20) {
            if ((wanted_y) < this.ceny) {
                this.dy += this.speed;
            }
            if ((wanted_y) > this.ceny) {
                this.dy -= this.speed;
            }
        }
    }
} 