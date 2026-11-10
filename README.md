# CHIP-8 Emulator 🚀

Welcome to the CHIP-8 Emulator project! This is a lightweight, web-based emulator built with JavaScript and HTML5 Canvas, designed to faithfully execute classic CHIP-8 programs and test suites right inside your modern web browser.

---

## ✨ Features

* **Smooth 60Hz Timing Loop:** Uses a precise delta-time accumulator and `requestAnimationFrame` to keep CPU execution and timers running smoothly without choking your browser tab.
* **Dual Keypad Layouts:** Switch seamlessly between the classic **VIP** layout and a modern **QWERTY** mapping with on-screen visual feedback.
* **Responsive Rendering:** Built on an HTML5 Canvas renderer scaled cleanly for crisp graphics.
* **Flexible ROM Loading:** Load custom `.ch8` files locally via file upload or pick test suites straight from the selection menu.

---

## 🎮 Can It Run Games?

**Yes, absolutely!** While it is currently being put through its paces with rigorous diagnostic test suites (like Timendus's `1-chip8-logo.ch8`), a fully functioning CHIP-8 emulator is built to run classic retro games like **Pong, Space Invaders, Tetris, and Brix**. Once all instruction quirks and input handlers are completely dialed in, classic games will run like a charm.

---

## 📌 Current Capabilities & Limitations

* **What it can do:** 
  * Execute standard arithmetic, logical, and jump instructions.
  * Render graphics to a 64x32 monochrome display grid.
  * Handle delay and sound timers at the standard 60Hz rate.
  * Map keyboard inputs dynamically.

* **What it can't do (Yet!):** 
  * As of right now, advanced diagnostic suites like **Test 4 (Flags)** and **Test 5 (Quirks)** are still undergoing tuning and may not pass or complete their interactive menu prompts perfectly until all edge-case instruction quirks (like memory index register increments and shift behaviors) are fully settled.
  * It does not currently support SUPER-CHIP high-resolution modes or extended color palettes—sticking strictly to classic monochrome CHIP-8 specifications.