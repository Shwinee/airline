const socket = io("https://bot-so-i-am-cool.herokuapp.com/", {
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

let o;
o = new Player();
o.ENGINE_INFO = scene.make_object_info(o);
o.ENGINE_INFO.id = "cohen";
o.ENGINE_INFO.components.add(new engine.comps.physics({friction: 0.995, gravity: 0.2, max_x_speed: 15, max_y_speed: 12}));
o.ENGINE_INFO.components.add(new engine.comps.collider({ignore_list: ['Rocket']}));
scene.add(o);

socket.on("connect", () => {
    let player = scene.data[scene.getFromId("cohen")];
    player.multiplayer_id = socket.id;
    console.log(socket.id);
});

socket.on("getPos", (data) => {
    if (data.id == socket.id) {
        return;
    }
    let enemys = scene.getAllObjects('Enemy');
    let newE = true;
    for (let i = 0; i < enemys.length; i++) {
        if (enemys[i].mutiplayer_id == data.id) {
            newE = false;
            enemys[i].x = data.x;
            enemys[i].y = data.y;
        }
    }
    if (newE == true) {
        scene.add(new Enemy(data.x, data.y, data.id));
    }
});

function sendPlayerData() {
    let player = scene.data[scene.getFromId("cohen")];

    socket.emit('sendPos', {x: player.x, y: player.y, id: socket.id, team: 1});
}