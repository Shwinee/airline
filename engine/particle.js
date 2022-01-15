function Particle(x, y, start, update_func) {
    this.x = x;
    this.y = y;

    this.dx = 0;
    this.dy = 0;

    this.size = 3;

    this.lifetime = 0;

    this.color = [255, 255, 255];

    this.update_func = update_func;

    this.start = start;

    this.start(this);

    this.friction = function(n) {
        this.dx *= n;
        this.dy *= n;
    }

    this.render = function() {
        if (this.update_func) {
            if (this.update_func(this) == false) {
                this.remove();
                return;
            }
        }
        this.lifetime++;

        this.x += this.dx;
        this.y += this.dy;

        fill(this.color);
        stroke(0, 0, 0, 0);
        rect(this.x+(this.size/2), this.y+(this.size/2), this.size, this.size);
    }

    this.remove = function() {
        scene.remove(this);
    }
}