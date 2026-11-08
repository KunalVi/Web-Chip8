const fontset = [
    0xF0, 0x90, 0x90, 0x90, 0xF0,                      //0
    0x20, 0x60, 0x20, 0x20, 0x70,                       //1
    0xF0, 0x10, 0xF0, 0x80, 0xF0,                              //2
    0xF0, 0x10, 0xF0, 0x10, 0xF0,                            //3
    0x90, 0x90, 0xF0, 0x10, 0x10,                                 //4
    0xF0, 0x80, 0xF0, 0x10, 0xF0,                                  //5
    0xF0, 0x80, 0xF0, 0x90, 0x90,                                 //6
    0xF0, 0x10, 0x20, 0x40, 0x40,                               //7
    0xF0, 0x90, 0xF0, 0x90, 0xF0,                               //8
    0xF0, 0x90, 0xF0, 0x10, 0xF0,                               //9
    0xF0, 0x90, 0xF0, 0x90, 0x90,                               //A
    0xE0, 0x90, 0xE0, 0x90, 0xE0,                               //B
    0xF0, 0x80, 0x80, 0x80, 0xF0,                               //C
    0xE0, 0x90, 0x90, 0x90, 0xE0,                               //D
    0xF0, 0x80, 0xF0, 0x80, 0xF0,                               //E
    0xF0, 0x80, 0xF0, 0x80, 0x80                               //F
];

class Chip8 {
    constructor() {
        this.memory = new Uint8Array(4096);
        this.v = new Uint8Array(16);
        this.i = 0;
        this.pc = 0x200;
        this.stack = new Uint16Array(16);
        this.sp = 0;
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.display = new Uint8Array(64 * 32);
        this.keys = new Array(16).fill(false);


        for (let i=0;i< fontset.length;i++) {
            this.memory[0x050 + i] = fontset[i]
        }
    }

    loadRom(romBuffer) {
        this.memory.fill(0);
        this.display.fill(0);
        this.v.fill(0);
        this.stack.fill(0);
        this.sp = 0;
        this.i = 0;

        for (let i=0;i<fontset.length;i++) {
            this.memory[0x050 + i] = fontset[i];
        }
        let romBytes = new Uint8Array(romBuffer);
        for (let i=0;i<romBytes.length;i++) {
            this.memory[0x200 + i] = romBytes[i];
        }
        this.pc = 0x200;
    }

    tick() {
        let opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        this.pc += 2;

         // to execute 
         console.log(`PC: 0x${this.pc.toString(16)}, Opcode: 0x${opcode.toString(16)}`);
        this.executeInstruction(opcode);
    }

    executeInstruction(opcode) {
        let nibble = (opcode & 0xF000)  >> 12;
        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;
        let n = opcode & 0x000F;
        let nn = opcode & 0x00FF;
        let nnn = opcode & 0x0FFF;
        
        switch (nibble) {
            case 0x0: 
                if (opcode == 0x00E0) {
                    this.display.fill(0);
                } else if (opcode == 0x00EE) {
                    this.sp--;
                    this.pc = this.stack[this.sp];
                }
                break;
            case 0x1: 
                this.pc = nnn;
                break;
            case 0x2:
                this.stack[this.sp] = this.pc;
                this.sp++;
                this.pc = nnn;
                break;
            case 0x3:
                if (this.v[x] === nn ) this.pc += 2;
                break;
            case 0x4:
                if (this.v[x] !== nn) this.pc += 2;
                break;
            case 0x6:
                this.v[x] = nn;
                break;
            case 0x7:
                this.v[x] =(this.v[x] + nn ) & 0xFF;
                break;
            case 0xA:
                this.i = nnn;
                break;
            case 0x8:
                let subOp = opcode & 0x000F;
                switch (subOp) {
                    case 0x0:this.v[x] = this.v[y];break;
                    case 0x1:this.v[x] = (this.v[x] | this.v[y]) & 0xFF;break;
                    case 0x2:this.v[x] = (this.v[x] & this.v[y]) & 0xFF;break;
                    case 0x3:this.v[x] = (this.v[x] ^ this.v[y]) & 0xFF;break;
                    case 0x4: {
                        let sum = this.v[x] + this.v[y];
                        this.v[0xF] = sum > 255 ? 1 : 0;
                        this.v[x] = sum & 0xFF;
                        break;
                    }
                    case 0x5: {
                        this.v[0xF] = this.v[x] >= this.v[y] ? 1 : 0;
                        this.v[x] = (this.v[x] - this.v[y]) & 0xFF;
                        break;
                    }
                    case 0x6: {
                        this.v[0xF] = this.v[x] & 0x1;
                        this.v[x] = (this.v[x] >> 1) & 0xFF;
                        break;
                    }
                    case 0x7: {
                        this.v[0xF] = this.v[y] >= this.v[x] ? 1 : 0;
                        this.v[x] = (this.v[y] - this.v[x]) & 0xFF;
                        break;
                    }
                    case 0xE: {
                        this.v[0xF] = (this.v[x] & 0x80) >> 7;
                        this.v[x] = (this.v[x] << 1) & 0xFF;
                        break;
                    }
                }
                break;
            case 0x9: {
                if (this.v[x] !== this.v[y]) this.pc += 2;
                break;
            }
            case 0xC: {
                let rand = Math.floor(Math.random() * 256);
                this.v[x] = (rand & nn) & 0xFF;
                break;
            }
            case 0xF: 
                if (nn === 0x07) {
                    this.v[x] = this.delayTimer;
                } else if (nn === 0x15) {
                    this.delayTimer = this.v[x];
                } else if (nn === 0x18) {
                    this.soundTimer = this.v[x];
                } else if (nn === 0x29) {
                    this.i  = 0x050 + (this.v[x] * 5);  
                } else if (nn === 0x55) {
                    for (let idx =0;idx <= x;idx++) {
                        this.memory[this.i + idx] = this.v[idx];
                    }
                } else if (nn === 0x65) {
                    for (let idx =0; idx <= x;idx++) {
                        this.v[idx] = this.memory[this.i + idx];
                    }
                }
                break;
            case 0xD:
                let xCoord = this.v[x] % 64;
                let yCoord = this.v[y] % 32;
                let n = opcode & 0x000F;
                this.v[0xF] = 0;

                for (let row = 0;row<n;row++) {
                    let spriteByte = this.memory[this.i + row];
                    for (let col=0;col<8;col++) {
                        let spritePixel = spriteByte & (0x80 >> col);
                        let screenX =(xCoord + col) % 64;
                        let screenY = (yCoord + row) % 32;
                        
                        if (screenX < 64 && screenY < 32) {
                            let index = screenY *64 + screenX;
                            if (spritePixel) {
                                if (this.display[index] === 1) {
                                    this.v[0xF] = 1; 
                                }
                                this.display[index] ^= 1;
                            }
                        }
                    }
                }
                break;
            default:
                console.log(`Unknown opcode: ${opcode.toString(16)}`);
                break;
        }
    }

    updateTimers() {
        if (this.delayTimer > 0) this.delayTimer--;
        if (this.soundTimer > 0) this.soundTimer--;
    }

}