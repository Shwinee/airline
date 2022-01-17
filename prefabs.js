var islands = [];

function Island_tile(x, y, t) {
    this.x = x;
    this.y = y;
    this.w = 64;
    this.h = 64;
    this.type = t;
    this.render = function() {
        image(sprites[this.type], this.x, this.y, this.w, this.h);
    }
}
function Island(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w*64;
    this.h = h*64;

    this.sw = w;
    this.sh = h;

    this.tiles = new Array(this.sw);

    for (let x = 0; x < this.sw; x++) {
        this.tiles[x] = Array(this.sh);
    }

    this.render = function() {
        fill(0, 0, 0, 0);
        for (let x = 0; x < this.sw; x++) {
            for (let y = 0; y < this.sh; y++) {
                if (y == this.sh-1) {
                    // this is bottom row
                    if (x == 0) {
                        image(sprites["corner_lr"], this.x+(x*64), this.y+(y*64), 64, 64)
                    }else if (x == this.sw-1) {
                        image(sprites["corner_rl"], this.x+(x*64), this.y+(y*64), 64, 64)
                    }else {
                        image(sprites["bottom"], this.x+(x*64), this.y+(y*64), 64, 64)
                    }
                }else if (y == 0) {
                    if (x == 0) {
                        image(sprites["grass_4"], this.x+(x*64), this.y+(y*64), 64, 64)
                    }else if (x == this.sw-1) {
                        image(sprites["grass_3"], this.x+(x*64), this.y+(y*64), 64, 64)
                    }else {
                        image(sprites["grass"], this.x+(x*64), this.y+(y*64), 64, 64)
                    }
                }else {
                    image(sprites["ground"], this.x+(x*64), this.y+(y*64), 64, 64)
                }
            }
            stroke(0, 0, 0);
        }
    }
}
function Rocket(x, y, target_id) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.r = 0;
    this.speed = 5;
    this.target_id = target_id;

    play_sound(this.x, this.y, 'flying');

    this.dentinated = false;

    this.render = function() {
        rect(this.x, this.y, this.w, this.h);

        let obj = scene.data[scene.getFromId(this.target_id)];
        let d = dist(this.x, this.y, obj.x, obj.y);
        this.r += map(d, 0, 4000, 0.5, 0.001, true);

        if (d <= 100) {
            if (this.dentinated == false) {
                this.dentinated = true;
                setFancyInterval((i) => {
                    let time = 400;

                    time -= i*75;

                    play_sound(this.x, this.y, 'locked');

                    return time;    
                })

                setTimeout(() => {
                    //blow up
                    sounds.flying.stop();
                    play_sound(this.x, this.y, 'boom');
                    scene.remove(this);

                    let player = scene.data[scene.getFromId("cohen")];

                    if (dist(this.x, this.y, player.x, player.y) <= width) {
                        cam.dx += random(-40, 40);
                        cam.dy += random(-40, 40);
                    }

                    let v1 = createVector(this.x, this.y);
                    let v2 = createVector(player.x, player.y);
                    let v3 = p5.Vector.sub(v1, v2);

                    v3.normalize();

                    v3.mult(-20);

                    player.addForce(v3.x, v3.y);
                }, 1000);
            }
        }

        let v1 = createVector(obj.x, obj.y);
        let v2 = createVector(this.x, this.y);
        let v3 = p5.Vector.sub(v1, v2);

        v3.normalize();
        v3.mult(this.speed);
        this.addForce(v3.x, v3.y);

        push();
        translate(this.x+(this.w/2), this.y+(this.h/2));
        rotate(this.r);
        rectMode(CENTER)
        rect(0, 0, this.w, this.h);
        rectMode(CORNER);
        pop();
    }

    this.post_added = function() {
        this.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.6, max_x_speed: 15, max_y_speed: 12}));
    }
}

function Turret(x, y, team) {
    this.x = x;
    this.y = y;
    this.team = team;
    this.w = 128;
    this.h = 128;
    
    this.near_obj = undefined;

    this.interval = setInterval(() => {
        let player = scene.data[scene.getFromId("cohen")];

        let flyers = scene.getAllObjects('Flyer');
        flyers.push(player);

        let cloesets = Infinity;
        let cloesets_index = undefined;

        for (let i = 0; i < flyers.length; i++) {
            if (flyers[i].team != this.team) {
                let d = dist(this.x, this.y, flyers[i].x, flyers[i].y) 
    
                if (d < cloesets) {
                    cloesets = d;
                    cloesets_index = i;
                }
            }
        }

        if (cloesets_index == undefined) {
            this.near_obj = undefined;
        }

        try {
            this.near_obj = scene.data[scene.getFromId(flyers[cloesets_index].ENGINE_INFO.id)]
        } 
        catch {
            this.near_obj = undefined;
        }
    }, 1000);
    
    this.hp = 100;

    this.rotation = 0;

    this.shot = false;
    this.can_shoot = true;

    this.fire_rate = 500;

    this.barrel_w = 100;

    this.hurt = function(dmg) {
        this.hp -= dmg;
    }

    this.render = function() {
        let player = scene.data[scene.getFromId("cohen")];

        if (this.hp <= 0) {
            clearInterval(this.interval);
            for (let i = 0; i < 10; i++) {
                scene.add(new Particle(this.x+(this.w/2), this.y+(this.h/2), (p) => {
                    p.color = [255, 100, 100];
                    p.dx += random(-10, 10);
                    p.dy += random(-10, 10);
                }, (p) => {
                    if (p.lifetime >= 15) {
                        p.remove();
                    }
                }))
            }
            play_sound(this.x, this.y, 'boom');
            scene.remove(this);
        }
        fill(75, 75, 75);
        rect(this.x, this.y+(this.h/2), this.w, this.h/2);

        if (this.team == player.team) {
            fill(0, 255, 100);
        }else {
            fill(255, 0, 100);
        }

        rect(this.x, this.y-20, map(this.hp, 0, 100, 0, this.w, true), 10);

        
        if (this.near_obj == undefined) {
            return;
        }
        
        let v1 = createVector(this.near_obj.x, this.near_obj.y);
        let v2 = createVector(this.x+(this.w/2), this.y+(this.h/2));
        let v3 = p5.Vector.sub(v1, v2);
        
        if (this.can_shoot == true) {
            if (dist(this.x, this.y, this.near_obj.x, this.near_obj.y) <= 2000) {
                this.can_shoot = false;
                setTimeout(() => {
                    this.can_shoot = true;
                }, this.fire_rate);
                v3.normalize();
                v3.mult(20);
                scene.add(new Bullet(this.x+(this.w/2), this.y+(this.h/2), v3.x, v3.y, this.team))
            }
        }
        
        
        
        push();
        translate(this.x+(this.w/2), this.y+(this.h/2));
        this.rotation = createVector(1, 0).angleBetween(v3);
        rotate(this.rotation);
        fill(200, 200, 200);
        rect(-15, -15, this.barrel_w, 30);
        pop();
    }
}

function Bullet(x, y, dx, dy, team) {
    play_sound(x, y, 'shoot');
    this.x = x;
    this.y = y;
    this.w = 8;
    this.h = 8;
    this.dx = dx;
    this.dy = dy;
    this.travel_time = 0;
    this.team = team;

    this.render = function() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.w, this.h);
        this.travel_time += 1;
        this.x += this.dx;
        this.y += this.dy;

        if (this.travel_time >= 300) {
            scene.remove(this);
        }
    }

    this.post_added = function() {
        this.ENGINE_INFO.components.add(new engine.comps.collider({on_collision: (data) => {
            if (data.object.constructor.name.toString() == "Player") {
                let player = scene.data[scene.getFromId("cohen")];
                if (player.team != this.team) {
                    player.hurt(10);
                    scene.remove(this);
                }
            }else if (data.object.constructor.name.toString() == "Island") {
                scene.remove(this);
            }else if (data.object.constructor.name.toString() == "Turret") {
                if (data.object.team != this.team) {
                    data.object.hurt(10);
                    scene.remove(this);
                }
            }
        }}));
    }
}

function SpawnWall(x, y, w, h) {
    this.x = x+6000;
    this.y = y+6000;
    this.w = w;
    this.h = h;
    this.render = function() {
        fill(0, 0, 0, 255);
        rect(this.x, this.y, this.w, this.h);
    }
}

function Team_Chooser(x, y, w, h, team) {
    this.x = x+6000;
    this.y = y+6000;
    this.team = team;
    this.w = w;
    this.h = h;

    this.render = function() {
        stroke(0, 0, 0, 255);
        if (this.team == 1) {
            fill(255, 100, 100, 100);
        }else if (this.team == 2) {
            fill(100, 255, 100, 100);
        }else if (this.team == 0){
            fill(255, 255, 100, 100);
        }
        rect(this.x, this.y, this.w, this.h);
        fill(0, 0, 0, 255);
        stroke(0, 0, 0, 255);
        strokeWeight(0.5)
        text('Join team '+this.team, this.x + (this.w/2)-50, this.y + (this.h/2))
        strokeWeight(1);
    }
}