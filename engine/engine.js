function Component_holder(object) {
  this.object = object;
  this.add = function(component) {
    if (component.constructor.name.includes('_component')) {
      this[component.constructor.name] = component;
      this[component.constructor.name].init(object);
      this[component.constructor.name].init = "Done";
    }
  }

  this.update = function() {
    let object = scene.data[scene.getFromId(this.object.ENGINE_INFO.id)];

    for (let property in this) {
      if (property.includes('_component')) {
        if (this[property].init != 'Done') {
          this[property].init(object);
          this[property].init = "Done";
        }

        this[property].update(object);
      }
    }
  }
}

var engine = new function Engine() {
  this.dev = true;
  this.confirm_destory = true;
  
  this.tick = function() {
    scene.render();
    cam.update();
    interval_check();
  }
  
  this.comps = {
    physics: function Physics_component(o) {
      this.dx = 0;
      this.dy = 0;

      this.ax = 0;
      this.ay = 0;

      if (!o.gravity) {
        this.gravity = 0;
      }else {
        this.gravity = o.gravity;
      }

      if (!o.friction) {
        this.friction = 0.99;
      }else {
        this.friction = o.friction;
      }
      
      this.update = function(obj) {
        obj.addForce(0, this.gravity);
        obj.x += this.dx;
        obj.y += this.dy;
        this.dx *= this.friction;
        this.dy *= this.friction;
      }
      
      this.init = function(obj) {
        obj.addForce = function(x, y) {
          obj.ENGINE_INFO.components.Physics_component.dx += x;
          obj.ENGINE_INFO.components.Physics_component.dy += y;
        }
        obj.addFriction = function() {
          this.dx *= obj.ENGINE_INFO.components.Physics_component.friction;
          this.dy *= obj.ENGINE_INFO.components.Physics_component.friction;
        }
      }
    },
    collider: function Collider_component(o) {
      if (o.ignore_list) {
        this.ignore_list = o.ignore_list;
      }else {
        this.ignore_list = [];
      }

      if (o.auto_resolve) {
        this.resolve = o.auto_resolve; 
      }else {
        this.resolve = true;
      }

      this.init = function(obj) {
        obj.collider = {}

        obj.collider.on_collision = function(obj) {
        }
      }

      this.update = function(obj) {
        for (let i = 0; i < scene.data.length; i++) {
          if (scene.data[i].ENGINE_INFO.id != obj.ENGINE_INFO.id) {
            let allowed = true;
  
            for (let x = 0; x < this.ignore_list.length; x++) {
              if (scene.data[i].constructor.name == this.ignore_list[x]) {
                let allowed = false;
              }
            }
            
            if (this.resolve == true) {
              if (collideRectRect(obj.x, obj.y, obj.w, obj.h, scene.data[i].x, scene.data[i].y, scene.data[i].w, scene.data[i].h)) {
                
                let nobj = scene.data[scene.getFromId(obj.ENGINE_INFO.id)];
                if (nobj.collider) {
                  nobj.collider.on_collision({index: i, object: scene.data[i]});
                }

                let res = resolve_rect(obj, scene.data[i]);
    
                obj.x = res.x;
                obj.y = res.y;
  
                // If object has physics collider
                if (obj.addFriction) {
                  obj.addForce(0, -obj.ENGINE_INFO.components.Physics_component.gravity);
                  obj.addFriction();
                }
              }
            }
          }
        }
      }
    }
  }
  
  this.component_holder = Component_holder;
}