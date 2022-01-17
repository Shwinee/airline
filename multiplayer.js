// const io = require("socket.io-client");
const socket = io("https://bot-so-i-am-cool.herokuapp.com", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

let o;
o = new Player();
o.ENGINE_INFO = scene.make_object_info(o);
o.ENGINE_INFO.id = "cohen";
o.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.993, gravity: 0.01, max_x_speed: 15, max_y_speed: 12}));
o.ENGINE_INFO.components.add(new engine.comps.collider({ignore_list: ['Rocket', 'Bullet', 'Flyer'], on_collision: (data) => {
    let player = scene.data[scene.getFromId("cohen")];
    if (player.dashing == true) {
        if (data.object.hurt != undefined) {
            if (data.object.team == player.team) {
                return;
            }
            let v1 = createVector(player.x, player.y);
            let v2 = createVector(data.object.x+(data.object.w/2), data.object.y+(data.object.h/2));
            let v3 = p5.Vector.sub(v1, v2);

            v3.normalize();
            v3.mult(-10);

            player.addForce(v3.x, v3.y);

            scene.data[data.index].hurt(40);
        }
    }

}}));
scene.add(o);

var multi_flyers = []

function Flyer(x, y, id, team) {
    this.team = team;
    this.x = x;
    this.y = y;

    this.w = 32;
    this.h = 32;

    this.id = id; 
    
    this.render = function() {
        let player = scene.data[scene.getFromId("cohen")];

        if (this.team == player.team) {
            fill(100, 255, 100);
        }else {
            fill(255, 100, 100);
        }

        rect(this.x, this.y, this.w, this.h);
    }

    multi_flyers.push(this);
}

socket.on("connect", () => {
    let player = scene.data[scene.getFromId("cohen")];
    player.multiplayer_id = socket.id;
    console.log(socket.id);
});

socket.on("getPos", (data) => {
    if (data.id == socket.id) {
        return;
    }
    let newE = true;
    for (let i = 0; i < multi_flyers.length; i++) {
        if (multi_flyers[i].id == data.id) {
            newE = false;
            multi_flyers[i].x = data.x;
            multi_flyers[i].y = data.y;
            return;
        }
    }
    if (newE == true) {
        scene.add(new Flyer(data.x, data.y, data.id, data.team));
    }
});

function sendPlayerData() {
    let player = scene.data[scene.getFromId("cohen")];

    socket.emit('sendPos', {x: player.x, y: player.y, id: socket.id, team: player.team});
}

setInterval(() => {
    sendPlayerData();
}, 50);