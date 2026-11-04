class Renderer {
    constructor(scale) {
        this.scale = scale;
        this.canvas = document.getElementById("chip8-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 64 * this.scale;
        this.canvas.height = 32 * this.scale;
    }

    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(displayArray) {
        this.clear();
        this.ctx.fillStyle = "#22c55e";

        for (let y = 0 ; y < 32; y++){
            for(let x = 0 ; x < 64; x++){
                let pixel = displayArray[y * 64 + x];
                if (pixel) {
                    this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
                }
            }
        }
    }
}

const keyMap = {
    '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
    'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
    'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
    'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
};

const chip8 = new Chip8();
const renderer = new Renderer(10);

window.addEventListener('keydown', e => {
    if (keyMap[e.key.toLowerCase()] !== undefined) {
        chip8.keys[keyMap[e.key.toLowerCase()]] = true;
    }
});

window.addEventListener('keyup',e => {
    if (keyMap[e.key.toLowerCase()] !== undefined) {
        chip8.keys[keyMap[e.key.toLowerCase()]] = false;
    }
});

document.getElementById('rom-upload').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        let buffer = e.target.result;
        chip8.loadRom(buffer);
        console.log(' ROM loaded sucessfully!!');
    };
    reader.readAsArrayBuffer(file);
});

function mainLoop() {
    for (let i = 0; i<10;i++) {
        chip8.tick();
    } 
    renderer.render(chip8.display);

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);