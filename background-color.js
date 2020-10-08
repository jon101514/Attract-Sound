"use strict";

let colors = ['#E0508A', '#E06D50', '#E0B43C', '#5CE057', '#00E0E0', '#0070E0', '#5E7AE0', '#8A6DE0'];
let colorIndex = Math.floor(Math.random() * colors.length);
let colorTime = 30000; // 30000 ms = 30 seconds.

// Here, change the color of the background and control panel text at intervals of 30 seconds.
setInterval(function() {
    document.querySelector('body').style.background = colors[colorIndex];
    document.querySelector('#random').style.color = colors[colorIndex]; // Change the text of the two control panel buttons, too.
    document.querySelector('#stop').style.color = colors[colorIndex];
    colorIndex++;
    if (colorIndex == colors.length) { colorIndex = 0; } // Reset the color index to zero
}, colorTime);
