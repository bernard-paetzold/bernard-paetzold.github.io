let console_history = "Welcome to the VCV-2000, if you are a new user, please type -help for system instructions.\n" +
                        "To print the CV to the screen, use the -print command.";
let username = "[guest-user]$ ";
let console_text = "";
let input_text = "";
let cursor_visible = false;

//Elements
let scene;
let computer;
let screenContent = document.getElementById("screen-content");
let screen = document.getElementById("crt-screen");
let powerButton = document.getElementById("power-button");
let screenBackground;
let currentScreen;
let screenBackdrop;
let nextButton;
let prevButton;
let pauseButton;
let radioScreen;

//Fullscreen computer
let fullscreenComputer;
let fullscreenPowerButton;
let fullscreenBackground;
let screenText;

//Desktop colours
const desktopColor = 'blue';
const aboutColor = 'blue';
const projectsColor = 'black';
const resumeColor = 'blue';
const skillsColor = 'blue';
const contactColor = 'blue';

//Welcome screen
let acceptButton;
let welcomeMessage;


//State variables
let computerOn = false;
let computerFullscreen = false;
let musicOn = false;
const zoomLevel = 2;
const zoomTransform = 'translate(-30%,-15%)'; 
const phoneZoomTransform = 'translate(-30%,-10%)'; 


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
    computer = document.getElementById("computer");
    screenContent = document.getElementById("screen-content");
    screenBackground = document.getElementById("screen-background");
    
    screenBackdrop = document.getElementById("backdrop");
    screen = document.getElementById("crt-screen");
    powerButton = document.getElementById("power-button");
    nextButton = document.getElementById("next-button");
    prevButton = document.getElementById("prev-button");
    pauseButton = document.getElementById("pause-button");
    radioScreen = document.getElementById("radio-screen");

    fullscreenComputer = document.getElementById("fullscreen-computer");

    fullscreenPowerButton = document.getElementById("fullscreen-power-button");
    fullscreenPowerButton.style.backgroundImage = "url('./assets/power-button-on.png')";
    fullscreenBackground = document.getElementById("fullscreen-background");
    screenText = document.getElementById("screen-text");

    //Preload images
    preload(
        "./assets/backdrop-2.png", 
        "./assets/backdrop.png", 
        "./assets/background.png", 
        "./assets/computer.png", 
        "./assets/folder-icon.png", 
        "./assets/mouse-clicking.png", 
        "./assets/mouse.png", 
        "./assets/next-button.png", 
        "./assets/pause-button-off.png", 
        "./assets/pause-button-on.png", 
        "./assets/plant-01.gif", 
        "./assets/poster.png", 
        "./assets/power-button-export.png", 
        "./assets/power-button-hover.png", 
        "./assets/power-button-on-hover.png", 
        "./assets/power-button-on.png", 
        "./assets/power-button-pressed.png", 
        "./assets/power-button.png", 
        "./assets/radio.png", 
        "./assets/tea.gif",
        "./assets/enter-button-clicked",
        "./assets/enter-button-hover",
        "./assets/enter-button",
    )

    //Desktop shortcuts
    const aboutShortcut = document.getElementById("about-shortcut");
    const resumeShortcut = document.getElementById("resume-shortcut");
    const projectsShortcut = document.getElementById("projects-shortcut");
    const skillsShortcut = document.getElementById("skills-shortcut");
    const contactShortcut = document.getElementById("contact-shortcut");

    //Computer screens
    const desktop = document.getElementById("desktop");
    currentScreen = desktop;
    const aboutScreen = document.getElementById("about-screen");
    const resumeScreen = document.getElementById("resume-screen");
    const projectsScreen = document.getElementById("projects-screen");
    const skillsScreen = document.getElementById("skills-screen");
    const contactScreen = document.getElementById("contact-screen");

    //Music

    music.push(document.getElementById('track-01'));
    music.push(document.getElementById('track-02'));
    music.push(document.getElementById('track-03'));
    music.push(document.getElementById('track-04'));
    music.push(document.getElementById('track-05'));
    music.push(document.getElementById('track-06'));
    music.push(document.getElementById('track-07'));

    //Sounds
    const breeze = document.getElementById("breeze");

    //Welcome screen and blur
    scene.classList.add("blur");
    acceptButton = document.getElementById("accept-button");
    welcomeMessage = document.getElementById("welcome-message");

    //Radio initialisation
    currentTrack = music[currentTrackIndex];
    radioScreen.textContent = "Track: " + (currentTrackIndex + 1) + "\nPaused";
    
    currentTrack.addEventListener('ended', function() {
        if (currentTrackIndex < music.length - 1) {
            currentTrackIndex++
       } 
       else { 
           currentTrackIndex = 0;
       }
        currentTrack = music[currentTrackIndex];
        currentTrack.play();
        musicOn = true;
        radioScreen.textContent = "Track: " + (currentTrackIndex + 1);
    });

    //renderText();

    //Button clicks
    const teaMug = document.getElementById("tea-mug");

    powerButton.onclick = function() {
        computerOn = !computerOn;

        if (computerOn) {
            powerButton.style.backgroundImage = "url('./assets/power-button-on.png')";
            fullscreenPowerButton.style.backgroundImage = "url('./assets/power-button-on.png')";
            teaMug.style.left = 68.5 + '%';
        }
        else {
            powerButton.style.backgroundImage = "url('./assets/power-button.png')";
        }

        //Make computer fullscreen
        toggleComputer();
    }

    fullscreenPowerButton.onclick = function() {
        computerOn = !computerOn;

        if (computerOn) {
            powerButton.style.backgroundImage = "url('./assets/power-button-on.png')";
            teaMug.style.left = 68.5 + '%';
        }
        else {
            powerButton.style.backgroundImage = "url('./assets/power-button.png')";
        }

        //Make computer fullscreen
        toggleFullscreenComputer();
        toggleComputer();
        resizeScene(false, 1);
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

        changeSong();
    }

    prevButton.onclick = function() {
        currentTrack.pause();
        currentTrack.currentTime = 0;

        if (currentTrackIndex > 0) {
            currentTrackIndex--;
        } 
        else { 
            currentTrackIndex = music.length - 1;
        }
        changeSong();
    }

    acceptButton.onclick = function() {
        welcomeMessage.style.display = 'none';
        scene.classList.remove("blur");
        breeze.play();
    }

    powerButton.onmousedown = btnClickDownHeavy;
    powerButton.onmouseup = btnClickUpHeavy;

    fullscreenPowerButton.onmousedown = btnClickDownHeavy;
    fullscreenPowerButton.onmouseup = btnClickUpHeavy;

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

    fullscreenPowerButton.onmouseover = function() {
        if (computerOn) {
            fullscreenPowerButton.style.backgroundImage = "url('./assets/power-button-on-hover.png')";
        }
        else {
            fullscreenPowerButton.style.backgroundImage = "url('./assets/power-button-hover.png')";
        }
    }
    
    fullscreenPowerButton.onmouseout = function() {
        if (computerOn) {
            fullscreenPowerButton.style.backgroundImage = "url('./assets/power-button-on.png')";
        }
        else {
            fullscreenPowerButton.style.backgroundImage = "url('./assets/power-button.png')";
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
        swapScreen(aboutScreen);

        fullscreenBackground.style.backgroundColor = aboutColor;
    };

    resumeShortcut.onclick = function() {
        swapScreen(resumeScreen);

        fullscreenBackground.style.backgroundColor = resumeColor;
    };

    projectsShortcut.onclick = function() {
        swapScreen(projectsScreen);

        fullscreenBackground.style.backgroundColor = projectsColor;
    };

    skillsShortcut.onclick = function() {
        swapScreen(skillsScreen);

        fullscreenBackground.style.backgroundColor = skillsColor;
    };

    contactShortcut.onclick = function() {
        swapScreen(contactScreen);

        fullscreenBackground.style.backgroundColor = contactColor;
    };

    window.addEventListener('resize', function() {
        if (computerOn) {
            resizeScene(true, zoomLevel); 
        }
        else {
            resizeScene(false, 1);     
        }
    }, true);

    resizeScene(false, 1); 
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
        resizeScene(true, zoomLevel);

        screenBackground.style.backgroundColor = desktopColor;
        fullscreenBackground.style.backgroundColor = desktopColor;
        screenContent.style.opacity = '100%';
    }
    else {
        resizeScene(false, 1);       
        screenBackground.style.backgroundColor = 'black';
        fullscreenBackground.style.backgroundColor = 'black';
        screenContent.style.opacity = '0%';

        currentScreen.style.opacity = "0%";
        //currentScreen.style.display = 'none';
        desktop.style.opacity = "100%";
        currentScreen = desktop;
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

function resizeScene(doTransform, offset) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const backdropWidth = screenBackdrop.offsetWidth;
    const backdropHeight = screenBackdrop.offsetHeight;

    let scale = offset * Math.max(windowWidth / backdropWidth, windowHeight / backdropHeight);
    let translate = zoomTransform;

    if (windowWidth / windowHeight < 0.7) {
        //Phone scaling
        translate = phoneZoomTransform;
        scale = offset * Math.max(windowWidth / backdropWidth, windowHeight / backdropHeight) / 2;
        welcomeMessage.style.fontSize = '100%';

        var elements = document.querySelectorAll('.shortcut-text');

        for (var i=0; i<elements.length; i++) {
            elements[i].style.fontSize = '100%'
        }

        var elements = document.querySelectorAll('.screen-text');

        for (var i=0; i<elements.length; i++) {
            elements[i].style.fontSize = '100%'
        }
    }
    else {
        welcomeMessage.style.fontSize = '200%';

        var elements = document.querySelectorAll('.shortcut-text');

        for (var i=0; i<elements.length; i++) {
            elements[i].style.fontSize = '400%'
        }

        var elements = document.querySelectorAll('.screen-text');

        for (var i=0; i<elements.length; i++) {
            elements[i].style.fontSize = '400%'
        }
    }

    if (!doTransform) {
        translate = 'translate(0%,0%)';
    }

    scene.style.transform =  `${translate} scale(${scale})`;
}

function changeSong() {
    currentTrack.pause();
    currentTrack.currentTime = 0;
    currentTrack = music[currentTrackIndex];
    currentTrack.play();

    musicOn = true;
    pauseButton.style.backgroundImage = "url('./assets/pause-button-off.png')"; 

    radioScreen.textContent = "Track: " + (currentTrackIndex + 1);

    currentTrack.addEventListener('ended', function() {
        if (currentTrackIndex < music.length - 1) {
            currentTrackIndex++
       } 
       else { 
           currentTrackIndex = 0;
       }
        currentTrack = music[currentTrackIndex];
        currentTrack.play();
        musicOn = true;
        radioScreen.textContent = "Track: " + (currentTrackIndex + 1);
    });

    currentTrack.play();
}

var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

function toggleFullscreenComputer() {
    //Make computer fullscreen
    computerFullscreen = !computerFullscreen;
    let fullscreenOffset = 10;

    if (computerFullscreen) {
        screenBackdrop.style.opacity = '0%';
        //screenBackdrop.style.visibility = 'hidden';
        computer.style.visibility = 'hidden';
        fullscreenComputer.style.visibility = 'visible';
        fullscreenComputer.style.width = '35%';

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (windowWidth / windowHeight < 0.7) {
            fullscreenComputer.style.top = (getElementPosition(fullscreenComputer).top - fullscreenOffset) + '%';
            fullscreenComputer.style.left = (getElementPosition(fullscreenComputer).left - fullscreenOffset * 1.1) + '%';
        }
        else {
            fullscreenComputer.style.top = (getElementPosition(fullscreenComputer).top - fullscreenOffset) + '%';
            fullscreenComputer.style.left = (getElementPosition(fullscreenComputer).left - fullscreenOffset / 2) + '%';
        }
        
        screenBackdrop.classList.add("blur");

        currentScreen.style.pointerEvents = 'all';
    }
    else {
        screenBackdrop.style.opacity = '100%';
        //screenBackdrop.style.visibility = 'visible';
        fullscreenComputer.style.visibility = 'hidden';
        fullscreenComputer.style.width = "";

        fullscreenComputer.style.top = (getElementPosition(fullscreenComputer).top + fullscreenOffset) + '%';
        fullscreenComputer.style.left = (getElementPosition(fullscreenComputer).left + fullscreenOffset / 2) + '%';



        computer.style.visibility = 'visible';
        screenBackdrop.classList.remove("blur");

        screenBackground.style.backgroundColor = desktopColor;
        fullscreenBackground.style.backgroundColor = desktopColor;

        desktop.style.visibility = 'visible';
        currentScreen.style.pointerEvents = 'none';
    }
}

function getElementPosition(element) {
    const parent = element.offsetParent || document.body;


    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const leftPercent = ((rect.left - parentRect.left) / parentRect.width) * 100;
    const topPercent = ((rect.top - parentRect.top) / parentRect.height) * 100;

    return {
        left: leftPercent,
        top: topPercent
    };
}

function swapScreen(newScreen) {
    currentScreen.style.opacity = "0%";
    currentScreen.style.visibility = 'hidden';

    currentScreen = newScreen;
    currentScreen.style.display = 'block';
    currentScreen.style.opacity = "100%";
    currentScreen.style.visibility = 'visible';

    toggleFullscreenComputer();
}