class Ray {
    constructor(x, y, from_player, ignore_list) {
        if (from_player) {
            this.from_player = from_player;
        }else {
            this.from_player = false;
        }
        if (ignore_list) {
            this.ignore_list = ignore_list;
        }else {
            this.ignore_list = [];
        }
        this.pos = createVector(x, y);
        this.dir = createVector(1, 0);
    }

    setDir(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    show() {
        stroke(0);
        push();
        translate(this.pos.x, this.pos.y);
        line(0, 0, this.dir.x*20, this.dir.y*20);
        pop();
    }

    check(obj) {
        if (scene.validObject(obj) == false) { // checks if obj has x, y, w, h vars
            return false;
        }

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;
        

        // each thing is a box, the collisios system is built on lines. i need to split each box into 4 diffrent lines, see wich ones collied, then get the one that is closeset
        // return (line2line(obj.x, obj.y, obj.x+obj.w, obj.y, x3, y3, x4, y4) || line2line(obj.x+obj.w, obj.y, obj.x+obj.w, obj.y+obj.h, x3, y3, x4, y4) || line2line(obj.x, obj.y+obj.h, obj.x+obj.w, obj.y+obj.h, x3, y3, x4, y4) || line2line(obj.x, obj.y, obj.x, obj.y+obj.h, x3, y3, x4, y4))
        var results = [];
        results.push(line2line(obj.x, obj.y, obj.x+obj.w, obj.y, x3, y3, x4, y4));
        results.push(line2line(obj.x+obj.w, obj.y, obj.x+obj.w, obj.y+obj.h, x3, y3, x4, y4));
        results.push(line2line(obj.x, obj.y+obj.h, obj.x+obj.w, obj.y+obj.h, x3, y3, x4, y4));
        results.push(line2line(obj.x, obj.y, obj.x, obj.y+obj.h, x3, y3, x4, y4));

        for (let i = 0; i < results.length; i++) {
            if (results[i] == false) {
                results.splice(i, 1);
                i--;
            }
        }

        var closeest = Infinity;
        var closeest_index = 0;
        
        for (let i = 0; i < results.length; i++) {
            let d = dist(this.pos.x, this.pos.y, results[i].x, results[i].y);
            if (d < closeest) {
                closeest = d;
                closeest_index = i;
            }
        }
        if (results[closeest_index]) {
            return results[closeest_index];
        }else {
            return false;
        }
    }

    sceneCheck() {
        var closeest = Infinity;
        var closeest_index = null;

        if (this.from_player == false) {
            // check for player
            if (this.check(player) != false) {
                let d = dist(this.pos.x, this.pos.y, player.x+16, player.y+16);
                if (d < closeest) {
                    closeest = d;
                    closeest_index = "PLAYER";
                }
            }
        }

        for (let i = 0; i < scene.data.length; i++) {
                var ignore = false;
                for (let f = 0; f < this.ignore_list.length; f++) {
                    if (scene.data[i].x == this.ignore_list[f].x) {
                        if (scene.data[i].y == this.ignore_list[f].y) {
                            ignore = true;
                        }
                    }
                }
                if (ignore == false) {
                    if (scene.data[i] != undefined) {
                        if (this.check(scene.data[i]) != false) {
                            let d = dist(this.pos.x, this.pos.y, this.check(scene.data[i]).x, this.check(scene.data[i]).y);
                            if (d < closeest) {
                                closeest = d;
                                closeest_index = i;
                            }
                        }
                    }
                }
        }

        if (closeest != Infinity) {
            if (closeest_index == "PLAYER") {
                return {
                    player: true,
                    x: player.x,
                    y: player.y
                };
            }
            return {
                player: false,
                x: this.check(scene.data[closeest_index]).x,
                y: this.check(scene.data[closeest_index]).y,
                index: closeest_index
            };
        }
    }
}

function line2line(x1, y1, x2, y2, x3, y3, x4, y4) {
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
        return false;
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
        const pt = createVector();

        pt.x = x1 + t * (x2 - x1);
        pt.y = y1 + t * (y2 - y1);
        return pt;
    }else {
        return false;
    }
}