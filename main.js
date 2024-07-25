let console_history = "Welcome to the VCV-2000, if you are a new user, please type -help for system instructions.\n" +
                        "To print the CV to the screen, use the -print command.";
let username = "[guest-user]$ ";
let console_text = "";
let input_text = "";
let cursor_visible = false;

//Elements
let scene;
let screenContent = document.getElementById("screen-content");
let screen = document.getElementById("crt-screen");
let powerButton = document.getElementById("power-button");
let screenBackground;let currentScreen;



//State variables
let computerOn = false;
let musicOn = false;

const fontSize = 18;
const textSpacing = 1.2;
const lineSpacing = 1;

const rows = 100;
const columns = 100;

const rotation = 0.4;

//Music
let currentTrackIndex = 0;
let currentTrack;

//Sounds
const music = [];

document.addEventListener('DOMContentLoaded', function() {
    scene = document.getElementById("scene");
    screenContent = document.getElementById("screen-content");
    screenBackground = document.getElementById("screen-background");
    screen = document.getElementById("crt-screen");
    powerButton = document.getElementById("power-button");
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");
    const pauseButton = document.getElementById("pause-button");
    const radioScreen = document.getElementById("radio-screen");

    //Desktop shortcuts
    const aboutShortcut = document.getElementById("about-shortcut");

    //Computer screens
    const desktop = document.getElementById("desktop");
    currentScreen = desktop;
    const aboutScreen = document.getElementById("about-screen");

    aboutScreen.textContent = "Born in South Africa I have lived all over the world, primarily in Mozambique. My father started teaching me Visual Basic when I was 10 and then C#. Having developed a passion for programming and a problem solving mindset I continued learning on my own and never plan to stop. Current technology related interests include teaching myself Rust and web-development."; 

    music.push(document.getElementById('track-01'));
    music.push(document.getElementById('track-02'));
    music.push(document.getElementById('track-03'));
    music.push(document.getElementById('track-04'));
    music.push(document.getElementById('track-05'));
    music.push(document.getElementById('track-06'));
    music.push(document.getElementById('track-07'));

    currentTrack = music[currentTrackIndex];
    radioScreen.textContent = "Track: " + (currentTrackIndex + 1) + "\nPaused";

    //renderText();

    //Button clicks
    const teaMug = document.getElementById("tea-mug");

    powerButton.onclick = function() {
        computerOn = !computerOn;

        if (computerOn) {
            powerButton.style.backgroundImage = "url('./assets/power-button-on.png')";
            teaMug.style.left = 68.5 + '%';
        }
        else {
            powerButton.style.backgroundImage = "url('./assets/power-button.png')";
        }

        //Make computer fullscreen
        toggleComputer();
    }

    pauseButton.onclick = function() {
        if (musicOn) {
            currentTrack.pause();   
            radioScreen.textContent = "Track: " + (currentTrackIndex + 1) + "\nPaused";
        }
        else {
            currentTrack.play();
            radioScreen.textContent = "Track: " + (currentTrackIndex + 1);
        }

        musicOn = !musicOn;
    }

    nextButton.onclick = function() {
        currentTrack.pause();
        currentTrack.currentTime = 0;

        if (currentTrackIndex < music.length - 1) {
             currentTrackIndex++
        } 
        else { 
            currentTrackIndex = 0;
        }
        currentTrack = music[currentTrackIndex];
        currentTrack.play();

        musicOn = true;
        pauseButton.style.backgroundImage = "url('./assets/pause-button-off.png')"; 

        radioScreen.textContent = "Track: " + (currentTrackIndex + 1);
    }

    prevButton.onclick = function() {
        currentTrack.pause();
        currentTrack.currentTime = 0;

        if (currentTrackIndex > 0) {
            currentTrackIndex--
        } 
        else { 
            currentTrackIndex = music.length - 1;
        }

        currentTrack = music[currentTrackIndex];
        currentTrack.play();

        musicOn = true;
        pauseButton.style.backgroundImage = "url('./assets/pause-button-off.png')"; 

        radioScreen.textContent = "Track: " + (currentTrackIndex + 1);
    }

    powerButton.onmousedown = btnClickDownHeavy;
    powerButton.onmouseup = btnClickUpHeavy;

    nextButton.onmousedown = btnClickDownLight;
    nextButton.onmouseup = btnClickUpLight;

    prevButton.onmousedown = btnClickDownLight;
    prevButton.onmouseup = btnClickUpLight;

    pauseButton.onmousedown = btnClickDownLight;
    pauseButton.onmouseup = btnClickUpLight;

    //Hover effects
    powerButton.onmouseover = function() {
        if (computerOn) {
            powerButton.style.backgroundImage = "url('./assets/power-button-on-hover.png')";
        }
        else {
            powerButton.style.backgroundImage = "url('./assets/power-button-hover.png')";
        }
    }

    powerButton.onmouseout = function() {
        if (computerOn) {
            powerButton.style.backgroundImage = "url('./assets/power-button-on.png')";
        }
        else {
            powerButton.style.backgroundImage = "url('./assets/power-button.png')";
        }     
    }

    pauseButton.onmouseover = function() {
        if (musicOn) {
            pauseButton.style.backgroundImage = "url('./assets/pause-button-on.png')";
        }
    }

    pauseButton.onmouseout = function() {
        if (musicOn) {
            pauseButton.style.backgroundImage = "url('./assets/pause-button-off.png')"; 
        }
        else {
            pauseButton.style.backgroundImage = "url('./assets/pause-button-on.png')"; 
        }    
    }

    const mouse = document.querySelector('.mouse');

    document.onmousemove = function(e) {
        if (computerOn) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let mouseXPercent = (e.clientX / windowWidth) * 100;
            let mouseYPercent = (e.clientY / windowHeight) * 100;

            // Move virtual mouse
            mouse.style.left = (mouseXPercent / 2 - 20) + '%';
            mouse.style.top = (mouseYPercent / 2 - 30) + '%';

            let scale = 0.9 + (mouseYPercent / 200);  // Scale between 50% and 100%
            mouse.style.transform = `scale(${scale})`;
        }
        else {
            mouse.style.left = '0%';
            mouse.style.top = '0%';
            mouse.style.transform = `scale(${1})`;
        }
    }

    screenContent.onmousedown = function() {
        if (computerOn) {
           mouse.src = './assets/mouse-clicking.png';
           
           const sound = document.getElementById('click-sound-down');
           sound.currentTime = 0;
           sound.play();
        }
    }

    screenContent.onmouseup = function() {
        if (computerOn) {
            mouse.src = './assets/mouse.png'; 

            const sound = document.getElementById('click-sound-up');
           sound.currentTime = 0;
           sound.play();
        }
    }

    //Desktop behavior
    aboutShortcut.onclick = function() {
        currentScreen.style.display = "none";
        aboutScreen.style.display = "inline";
        currentScreen = aboutScreen;
    };
});


function animateCursor() {
    cursor_visible = !cursor_visible;
    renderText();
}


setInterval(animateCursor, 1000);

function renderText() {
    /*screenContent.innerHTML = ''; 

    screenContent.textContent = console_history + "\n" + username + input_text + (cursor_visible ? '_' : "");

    let xPos = 0;
    let yPos = 0;

    let lines = console_text.split('\n');*/


    /*for (let i = 0; i < lines.length && yPos < rows; i++) {
        let words = lines[i].split(' ');   

        for (let l = 0; l < words.length; l++) {
            let word = document.createElement("div");
            word.className = "console-word";

            const characters = words[l].split('');
            wordWidth = characters.length * textSpacing;

            if (xPos + wordWidth > columns) {
                xPos = 0;
                yPos += lineSpacing;
            }

            for (let k = 0; k < characters.length; k++) {
                let character = characters[k];

                const wrapper = document.createElement("div");

                wrapper.className = "text-wrapper";
                wrapper.textContent = character;

                const xPercent = (xPos + k + 0.5) / columns * 100;
                const yPercent = (yPos + 0.5) / rows * 100;
                const distanceFromCenter = Math.sqrt(Math.pow((xPercent - 50) / 50, 2) + Math.pow((yPercent - 50) / 50, 2));
                const scale = 1 - (distanceFromCenter * 0.3);

                const zTranslation = Math.pow(distanceFromCenter, 2) * 100;

                wrapper.style.left = `${xPercent}%`;
                wrapper.style.top = `${yPercent}%`;

                wrapper.style.transform = `
                translate(-40%, -90%)
                scale(${scale})
                rotateX(${(yPercent - 50) * rotation}deg)
                rotateY(${(xPercent - 50) * -rotation}deg)
                translateZ(${zTranslation}px)`;

                wrapper.style.fontSize = `${fontSize}px`;

                word.appendChild(wrapper);

                xPos += textSpacing;

            }
            
            screenContent.appendChild(word);

            xPos += wordWidth + textSpacing;
        }
        xPos = 0;
        yPos += lineSpacing;
    }*/
}


function handleKeyPress(event) {
    if (event.key === 'Enter') {
        //Process input
        console_history += '\n' + username + input_text;
        switch (input_text) {
            case "":           
                break;
            case "-help":
                console_history +=  "\nReturn to main menu: main-menu" + '\n' +
                                    "Change username: config username [new username]";
                break;
            case "-print":
                console_history += "\nI spent countless hours working on this fake terminal because I cannot sleep until I finish what I start.";
                break;
            default:
                console_history += '\n' + username + "command \"" + input_text + "\" not found";
                break;
        }
        input_text = "";
    } 
    else if (event.key === 'Backspace') {
        input_text = input_text.slice(0, -1);
    } 
    else if (event.key.length === 1) {
         input_text += event.key;

        if (input_text.length % (columns - 15) == 0) {
            input_text += '\n';
        }
    }
    renderText();
}

document.addEventListener('keydown', handleKeyPress);


function calculateFontSize() {
    return Math.max(8, Math.min(18, window.innerWidth / 100)); 
}


function calculateRows() {
    return Math.floor(screen.getBoundingClientRect().height / calculateFontSize());
}

function calculateColumns() {
    return Math.floor(screen.getBoundingClientRect().width / (calculateFontSize() * 0.6)); 
}



function toggleComputer() {
    if (computerOn) {
        scene.style.transform = 'translate(-30%,-20%) scale(2.5)';

        screenBackground.style.backgroundColor = 'blue';
        screenContent.style.opacity = '100%';
    }
    else {
        scene.style.transform = 'translate(0%,0%) scale(1)';

        screenBackground.style.backgroundColor = 'black';
        screenContent.style.opacity = '0%';
    }

}

function btnClickUpHeavy() {
    const sound = document.getElementById('power-button-sound-up');
    sound.currentTime = 0;
    sound.play();  
}

function btnClickDownHeavy() {
    const sound = document.getElementById('power-button-sound-down');
    sound.currentTime = 0;
    sound.play();
}

function btnClickUpLight() {
    const sound = document.getElementById('power-button-sound-up');
    sound.currentTime = 0;
    sound.play();  
}

function btnClickDownLight() {
    const sound = document.getElementById('power-button-sound-down');
    sound.currentTime = 0;
    sound.play();
}

