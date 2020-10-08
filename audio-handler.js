"use strict";

/**
 * AUDIO FOR EACH BUTTON
 */

// Audio Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Create an array of references to all audioElements
const audioElements = document.querySelectorAll('audio');
let tracks = [];
for (let i = 0; i < audioElements.length; i++) {
    tracks[i] = audioCtx.createMediaElementSource(audioElements[i]);
}

let playButtons = document.querySelector('.playbuttons').querySelectorAll('button');

for (let i = 0; i < playButtons.length; i++) {
    // Audio Toggle
    playButtons[i].addEventListener('click', function() {
        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (this.dataset.playing === 'false' || this.dataset.playing === undefined) { // Play
            audioElements[i].currentTime = (Math.random() * audioElements[i].duration);
            audioElements[i].play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') { // Pause
            audioElements[i].pause();
            this.dataset.playing = 'false';            
        }
    }, false);
}

for (let i = 0; i < audioElements.length; i++) {
    // if track ends
    audioElements[i].addEventListener('ended', () => {
    	playButtons[i].dataset.playing = 'false';
    	playButtons[i].setAttribute( "aria-checked", "false" );
    }, false);
}

let gainNodes = [];
for (let i = 0; i < audioElements.length; i++) {
    gainNodes[i] = audioCtx.createGain();
}

let volumeControls = document.querySelectorAll('.control-volume');
for (let i = 0; i < volumeControls.length; i++) {
    volumeControls[i].addEventListener('input', function() {
        gainNodes[i].gain.value = this.value;
    }, false);
}

// Master volume gain node
let uniNode = audioCtx.createGain();
let uniVol = document.querySelector('#uni-vol');
let volImg = document.querySelector('#speaker');
uniVol.addEventListener('input', function() {
    uniNode.gain.value = this.value;
    // Now, change the volume speaker's graphic based on the volume.
    if (uniNode.gain.value <= 0) {
        volImg.src = "img/vol_0.png";   
    } else if (uniNode.gain.value <= 0.33) {
        volImg.src = "img/vol_1.png";   
    } else if (uniNode.gain.value <= 0.67) {
        volImg.src = "img/vol_2.png";   
    } else {
        volImg.src = "img/vol_3.png";   
    }
}, false);

// Connect the whole audio graph together
for (let i = 0; i < tracks.length; i++) {
    tracks[i].connect(gainNodes[i]).connect(uniNode);
}

uniNode.connect(audioCtx.destination);

/** RANDOM BUTTON: 
 * When this button is clicked, pick six random games' audio to play.
 */
let randomButton = document.querySelector('#random');
randomButton.addEventListener('click', function(){
    
    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    // Part I: Select the six random games.
    let randomChoices = [];
    for (let i = 0; i < 6; i++) {
        let randInt = Math.floor(Math.random() * (audioElements.length - 3)); // Subtract 3 to avoid picking the noises.
        while (!duplicateCheck(randomChoices, randInt)) {
            randInt = Math.floor(Math.random() * (audioElements.length - 3));
        }
        randomChoices[i] = randInt;
    }
    
    // Part II: Turn off all games' audio.
    for (let i = 0; i < audioElements.length; i++) {
        if (playButtons[i].dataset.playing == 'true') {
            audioElements[i].pause();
            playButtons[i].dataset.playing = 'false';
        }
    }
    // Part III: Turn on the six selected ones.
    for (let i = 0; i < randomChoices.length; i++) {
        let randTime = Math.random() * audioElements[randomChoices[i]].duration;
        // console.log("Rand Time: " + randTime + " / " + audioElements[randomChoices[i]].duration);
        audioElements[randomChoices[i]].currentTime = randTime;
        audioElements[randomChoices[i]].play();
        playButtons[randomChoices[i]].dataset.playing = 'true';
    }
}, false);

// If pNum occurs in pArray, return false. Otherwise, return true.
function duplicateCheck(pArray, pNum) {
    for (let i = 0; i < pArray.length; i++) {
        if (pNum == pArray[i]) {
            return false;
        }
    }
    return true;
}

/** STOP ALL BUTTON: 
 * When this button is clicked, stop all audio.
 */
let stopButton = document.querySelector('#stop');
stopButton.addEventListener('click', function(){
    for (let i = 0; i < audioElements.length; i++) {
        if (playButtons[i].dataset.playing == 'true') {
            audioElements[i].pause();
            playButtons[i].dataset.playing = 'false';
        }
    }
}, false);