var sprites = {};
function add_sprites(arr) {
    for (let i = 0; i < arr.length; i++) {
        let arr_arr = arr[i].split('/');
        let name = arr_arr[arr_arr.length-1];
        name = name.split('.')[0];

        sprites[name] = loadImage(arr[i]);
    }
}