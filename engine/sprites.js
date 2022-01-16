var sprites = {};
function add_sprites(arr) {
    for (let i = 0; i < arr.length; i++) {
        let arr_arr = arr[i].split('/');
        let name = arr_arr[arr_arr.length-1];
        name = name.split('.')[0];

        console.log(arr[i]);
        sprites[name] = loadImage(arr[i]);
    }
}
var sounds = {}
function add_sounds(arr) {
    for (let i = 0; i < arr.length; i++) {
        let arr_arr = arr[i].split('/');
        let name = arr_arr[arr_arr.length-1];
        name = name.split('.')[0];

        sounds[name] = loadSound(arr[i]);
    }
}
