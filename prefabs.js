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

    sounds.flying.play();

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

                    sounds.locked.play();

                    return time;    
                })

                setTimeout(() => {
                //blow up 
                    sounds.flying.stop();
                    sounds.boom.play();
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

                    v3.mult(-10);

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
        this.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.5, max_x_speed: 15, max_y_speed: 12}));
    }
}
function Teammate(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.render = function() {
        fill(0, 255, 0);
        rect(this.x, this.y, this.w, this.h);
    }
    this.post_added = function() {
        this.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.995, gravity: 0.2, max_x_speed: 15, max_y_speed: 12}));
        this.ENGINE_INFO.id = "TEAM_"+this.name
    }
}
function Enemy(x, y, mi) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.mutiplayer_id = mi;
    this.render = function() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.w, this.h);
    }
    this.post_added = function() {
        this.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.995, gravity: 0.2, max_x_speed: 15, max_y_speed: 12}));
        this.ENGINE_INFO.id = "ENEMY_"+this.name
    }
}