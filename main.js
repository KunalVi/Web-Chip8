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

        for (let y = 0 ; y < 32; y++) {
            for(let x = 0 ; x < 64; x++) {
                let pixel = displayArray[y * 64 + x];
                if (pixel) {
                    this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
                }
            }
        }
    }
}
//qwerty to chip8 key map
const keyMap = {
    '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
    'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
    'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
    'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
};

//keypad layout :4X4 order
const keypadLayout = [
    { hex: 0x1, vipLabel: "1", qwertyLabel: "1"},
    { hex: 0x2, vipLabel: "2", qwertyLabel: "2"},
    { hex: 0x3, vipLabel: "3", qwertyLabel: "3"},    
    { hex: 0xC, vipLabel: "C", qwertyLabel: "4"},
    { hex: 0x4, vipLabel: "4", qwertyLabel: "Q"},
    { hex: 0x5, vipLabel: "5", qwertyLabel: "W"},
    { hex: 0x6, vipLabel: "6", qwertyLabel: "E"},
    { hex: 0xD, vipLabel: "D", qwertyLabel: "R"},
    { hex: 0x7, vipLabel: "7", qwertyLabel: "A"},    
    { hex: 0x8, vipLabel: "8", qwertyLabel: "S"},
    { hex: 0x9, vipLabel: "9", qwertyLabel: "D"},
    { hex: 0xE, vipLabel: "E", qwertyLabel: "F"},
    { hex: 0xA, vipLabel: "A", qwertyLabel: "Z"},    
    { hex: 0x0, vipLabel: "0", qwertyLabel: "X"},
    { hex: 0xB, vipLabel: "B", qwertyLabel: "C"},
    { hex: 0xF, vipLabel: "F", qwertyLabel: "V"}

]

const chip8 = new Chip8();
const renderer = new Renderer(10);
let romLoaded = false;
let currentLayoutMode = 'vip';

window.addEventListener('keydown', e => {
    const hex = keyMap[e.key.toLowerCase()];
    if (hex !== undefined) {
        chip8.keys[hex] = true;
        highlightKeyButton(hex, true);
    }
});


window.addEventListener('keyup',e => {
    const hex = keyMap[e.key.toLowerCase()] 
    if (hex !== undefined) {
        chip8.keys[hex] = false;
        highlightKeyButton(hex, false);
    }
});

function highlightKeyButton(hex, isPressed) {
    const btn = document.querySelector(`.key-btn[data-hex="${hex}"]`);
    if (btn) {
        if (isPressed) btn.classList.add('active');
        else btn.classList.remove('active');
    }
}


document.getElementById('rom-upload').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        chip8.loadRom(e.target.result);
        romLoaded = true;
        console.log(' ROM loaded sucessfully!!');
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('rom-select').addEventListener('change', async function(event) {
    const url = event.target.value;
    if (!url) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTPS error! status: ${response.status}`);
        const buffer = await response.arrayBuffer();

        chip8.loadRom(buffer);
        romLoaded = true;
        console.log(`Loaded test ROM: ${url}`);
    } catch (err) {
        console.error('Failed to fetch ROM:', err);

    }
});

function renderKeypad() {
    const grid = document.getElementById('keypad-grid');
    grid.innerHTML = '';

    keypadLayout.forEach(item => {
        const btn = document.createElement('button');
        btn.className ='key-btn';
        btn.dataset.hex = item.hex;

        if (currentLayoutMode === 'vip') {
            btn.innerHTML = `${item.vipLabel}`;
        } else {
            btn.innerHTML = `${item.qwertyLabel}<span class="sub-label">(0x${item.hex.toString(16).toUpperCase()})</span>`
        }

        const pressHandler = (e) => {
            e.preventDefault();
            chip8.keys[item.hex] = true;
            btn.classList.add('active');
        };

        const releaseHandler = (e) => {
            e.preventDefault();
            chip8.keys[item.hex] = false;
            btn.classList.remove('active');
        };

        btn.addEventListener('mousedown', pressHandler);
        btn.addEventListener('mouseup', releaseHandler);
        btn.addEventListener('mouseleave', releaseHandler);
        btn.addEventListener('touchstart', pressHandler);
        btn.addEventListener('touchend', releaseHandler);
        
        grid.appendChild(btn);
    });
}

document.getElementById('btn-vip').addEventListener('click', () => {
    currentLayoutMode = 'vip';
    document.getElementById('btn-vip').classList.add('active');
    document.getElementById('btn-qwerty').classList.remove('active');
    renderKeypad();
});

document.getElementById('btn-qwerty').addEventListener('click', () => {
    currentLayoutMode = 'qwerty';
    document.getElementById('btn-qwerty').classList.add('active');
    document.getElementById('btn-vip').classList.remove('active');
    renderKeypad();
});

renderKeypad();

let lastTime = 0;
let TIMER_INTERVAL = 1000 / 60;
let timerAccumulator = 0;



function mainLoop(timestamp) {
   if (!lastTime) lastTime = timestamp
   let deltaTime = timestamp - lastTime;
   lastTime = timestamp;
   if (romLoaded) {
       for (let i=0;i,10;i++) {
          chip8.tick();
        }
        timerAccumulator += deltaTime;
        if (timeAccumulator >= TIMER_INTERVAL) {
           chip8.updateTimers();
           timerAccumulator -= TIMER_INTERVAL;
        }

        if (chip8.drawFlag) {
            renderer.render(chip8.display);
            chip8.drawFlag = false;
        }
    }  
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);