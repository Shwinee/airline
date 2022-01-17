var scene = new function Scene() {
    this.data = [];
    this.floors = [];
    this.particles = [];
    this.emitters = [];
    this.last_added_type = "none";

    this.clear = function() {
        this.data = [];
        this.floors = [];
        this.particles = [];
        this.emitters = [];
    }
  
    this.getFromId = function(id) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].ENGINE_INFO.id == id) {
          return i;
        }
      }
    }

    this.point_collide = function(x, y) {
        for (let i = 0; i < this.data.length; i++) {
            if (collidePointRect(x, y, this.data[i].x, this.data[i].y, this.data[i].w, this.data[i].h)) {
                return this.data[i];
            }
        }
    }

    this.remove_last = function() {
        if (this.last_added_type == "none") {
            return;
        }
        if (this.last_added_type == "Floor") {
            this.floors.pop();
        }
        if (this.last_added_type == "Particle") {
            this.particles.pop();
        }
        if (this.last_added_type == "Emitter") {
            this.emitters.pop();
        }
        if (this.last_added_type == "Data") {
            this.data.pop();
        }
    }

    this.add = function(obj) {
        if (obj.__proto__.constructor.name.toString() == "Floor") {
            this.floors.push(obj);
            this.last_added_type = "Floor";
            return true;
        }
        if (obj.__proto__.constructor.name.toString() == "Particle") {
            this.particles.push(obj);
            this.last_added_type = "Particle"
            return true;
        }
        if (obj.__proto__.constructor.name.toString() == "Emitter") {
            this.emitters.push(obj);
            this.last_added_type = "Emitter";
            return true;
        }
        if (obj.x) {
            if (obj.y) {
                if (obj.w) {
                    if (obj.h) {
                        if (obj.render) {
                            if (!obj.ENGINE_INFO) {
                                obj.ENGINE_INFO = this.make_object_info(obj);
                                if (obj.post_added) {
                                  obj.post_added();
                                }
                            }
                            this.data.push(obj);
                            this.last_added_type = "Data";
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    this.getAllObjects = function(constructor_name, ignore_list) {
        let out = [];

        if (ignore_list == undefined) {ignore_list = [undefined]};

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].constructor.name == constructor_name) {
                for (let x = 0; x < ignore_list.length; x++) {
                    if (ignore_list[x] != this.data[i]) {
                        out.push(this.data[i]);
                    }
                }
            }
        }

        return out;
    }

    this.highlighted = undefined;

    this.click = function() {
        for (let i = 0; i < this.data.length; i++) {
            if (collidePointRect(cam.mx, cam.my, this.data[i].x, this.data[i].y, this.data[i].w, this.data[i].h)) {
                this.highlighted = {object: this.data[i], index: i};
                this.hilight(this.highlighted);
                return;
            }
        }
        this.highlighted = undefined;
        this.hilight(this.highlighted);
    }

    this.update_hilight = function() {
        if (this.highlighted == undefined) {
            return;
        }
        let obj = {object: this.data[this.highlighted.index], index: this.highlighted.index};

        document.getElementById('properties').innerHTML = '';

        if (obj == undefined) {
            return;
        }

        let index = obj.index;
        let object = obj.object;

        let properties = Object.keys(object);
        for (let i = 0; i < properties.length; i++) {
            if (typeof object[properties[i]] == 'function'|| typeof object[properties[i]] == 'object') {
                add_property(`${properties[i]}`, null, typeof object[properties[i]]);
            }else {
                add_property(`${properties[i]}`, object[properties[i]], typeof object[properties[i]]);
            }
        }

        document.getElementById('constructor').innerText = object.constructor.name;
        
        function add_property(name, value, type) {
            let mainele = document.createElement('div');
            mainele.className = "property"

            let ele2 = undefined;

            let ele = document.createElement('t');
            ele.innerText = name+":";

            if (type != 'function' ||  type != 'object') {
                ele2 = document.createElement('input');
                ele2.value = value;
                ele2.className = 'property_value_'+type
            }
            
            let ele3 = document.createElement('t');
            ele3.className = 'property_type'
            ele3.innerText = type;

            if (ele2 != undefined) {
                mainele.append(ele, ele2, ele3);
            }else {
                mainele.append(ele, ele3);
                console.log('object or func');
            }

            // if (value == null) {
            //     document.getElementById('properties').append(ele, ele3, document.createElement('br'));
            // }
            document.getElementById('properties').append(mainele);
        }
    }

    this.hilight = function(obj) {
        document.getElementById('buttons').innerHTML = '';
        document.getElementById('properties').innerHTML = '';
        document.getElementById('constructor').innerHTML = '';

        if (obj == undefined) {
            return;
        }

        let index = obj.index;
        let object = obj.object;

        let properties = Object.keys(object);
        for (let i = 0; i < properties.length; i++) {
            if (typeof object[properties[i]] == 'function'|| typeof object[properties[i]] == 'object') {
                add_property(`${properties[i]}`, null, typeof object[properties[i]]);
            }else {
                add_property(`${properties[i]}`, object[properties[i]], typeof object[properties[i]]);
            }
        }

        document.getElementById('constructor').innerText = object.constructor.name;
        
        function add_property(name, value, type) {
            let mainele = document.createElement('div');
            mainele.className = "property"

            let ele2 = undefined;

            let ele = document.createElement('t');
            ele.innerText = name+":";

            if (type != 'function' ||  type != 'object') {
                ele2 = document.createElement('input');
                ele2.value = value;
                ele2.className = 'property_value_'+type
            }
            
            let ele3 = document.createElement('t');
            ele3.className = 'property_type'
            ele3.innerText = type;

            if (ele2 != undefined) {
                mainele.append(ele, ele2, ele3);
            }else {
                mainele.append(ele, ele3);
                console.log('object or func');
            }

            // if (value == null) {
            //     document.getElementById('properties').append(ele, ele3, document.createElement('br'));
            // }
            document.getElementById('properties').append(mainele);
        }
        let log_btn = document.createElement('btn');
        log_btn.className = 'dev_tools_log';
        log_btn.innerText = "Log";
        log_btn.onclick = () => {console.log(object)};

        let destroy_button = document.createElement('btn');
        destroy_button.className = 'dev_tools_destroy';
        destroy_button.innerText = "Destroy";
        destroy_button.onclick = () => {
          if (engine.confirm_destory == true) {
            if (confirm('Are you sure you want to Destroy that ' + object.constructor.name + '?')) {
                // yes
                this.remove(object);
                this.hilight();
            }
          }else {
              this.remove(object);
              this.hilight();
          }
        };

        document.getElementById('buttons').append(log_btn, destroy_button);
    }

    this.make_object_info = function(obj) {
        let o = {};
        o.cx = obj.x+(obj.w/2);
        o.cy = obj.y+(obj.h/2);
        o.c = {x: obj.x+(obj.w/2), y: obj.y+(obj.h/2)};
        o.id = Date.now();
        o.components = new engine.component_holder(obj);
        
        if (obj.friction) {
            o.friction = obj.friction;
        }else {
            o.firction = 0;
        }

        if (obj.dx || obj.dy) {
            o.static = false;
        }else {
            o.static = true;
        }

        return o;
    }

    this.validObject = function(obj) {
        if (obj.x) {
            if (obj.y) {
                if (obj.w) {
                    if (obj.h) {
                        return true;
                    }
                }
            }
        }
    }

    this.render = function() {
        fill(50, 50, 50, 255);
        stroke(0, 0, 0, 255);
        cam.update();

        this.update_hilight();

        for (let i = 0; i < this.floors.length; i++) {
            this.floors[i].render();
        }
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].render();
            if (this.data[i]) {
                this.data[i].ENGINE_INFO.components.update();
            }
    }
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].render();
        }

        for (let i = 0; i < this.emitters.length; i++) {
            this.emitters[i].render();
        }
    }

    this.remove = function(obj) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].x == obj.x) {
                if (this.data[i].y == obj.y) {
                    this.data.splice(i, 1);
                    return true;
                }
            }
        }

        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].x == obj.x) {
                if (this.particles[i].y == obj.y) {
                    this.particles.splice(i, 1);
                    return true;
                }
            }
        }

        for (let i = 0; i < this.floors.length; i++) {
            if (this.floors[i].x == obj.x) {
                if (this.floors[i].y == obj.y) {
                    this.floors.splice(i, 1);
                    return true;
                }
            }
        }
    }
    
    this.newEmpty = function(x, y, w, h) {
        return new Empty(x, y, w, h);
    }
}

function Empty(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.render = function() {
        fill(50, 50, 50, 0);
        rect(this.x, this.y, this.w, this.h);
    }
}

function MouseObj(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.w = w;
    this.h = h;
    this.render = function() {
        fill(50, 50, 50);
        this.dx *= 0.9;
        this.dy *= 0.9;

        this.x += this.dx;
        this.y += this.dy;
        rect(this.x, this.y, this.w, this.h);
    }
}

function Floor(points, color) {
    this.points = points;
    this.color = color;

    this.render = function() {
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0, 0, 0, 0);
        beginShape();
        for (let i = 0; i < this.points.length; i++) {
            vertex(this.points[i].x, this.points[i].y);
        }
        endShape(CLOSE);
        stroke(0, 0, 0, 255);
    }
}