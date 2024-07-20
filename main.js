let console_history = "Welcome to the VCV-2000, if you are a new user, please type --help for system instructions.\n";
let username = "[guest-user]$ ";
let console_text = "";
let input_text = "";
let cursor_visible = false;

let screenContent = document.getElementById("screen-content");

let screen = document.getElementById("crt-screen");

const fontSize = 18;

const rows = 100;
const columns = 100;

const rotation = 0.4;

document.addEventListener('DOMContentLoaded', function() {
    screenContent = document.getElementById("screen-content");
    screen = document.getElementById("crt-screen");
    renderText();
});


function animateCursor() {
    cursor_visible = !cursor_visible;
    renderText();
}


setInterval(animateCursor, 1000);

function renderText() {
    screenContent.innerHTML = ''; 

    console_text = console_history + username + input_text + (cursor_visible ? '_' : "");

    let xPos = 0;
    let yPos = 0;

    let lines = console_text.split('\n');

    for (let i = 0; i < lines.length && i < Math.round(screen.getBoundingClientRect().height / fontSize); i++) {
        let words = lines[i].split(' ');   

        for (let l = 0; l < words.length; l++) {
            let word = document.createElement("div");
            word.className = "console-word";

            const characters = words[l].split('');

            for (let k = 0; k < characters.length; k++) {
                let character = characters[k];

                const wrapper = document.createElement("div");

                wrapper.className = "text-wrapper";
                wrapper.textContent = character;

                const xPercent = (xPos + l + k + 0.5) / columns * 100;
                const yPercent = (yPos + i + 0.5) / rows * 100 + i;
                const distanceFromCenter = Math.sqrt(Math.pow((xPercent - 50) / 50, 2) + Math.pow((yPercent - 50) / 50, 2));
                const scale = 1 - (distanceFromCenter * 0.3);

                const zTranslation = Math.pow(distanceFromCenter, 2) * 100;

                wrapper.style.left = `${xPercent}%`;
                wrapper.style.top = `${yPercent}%`;

                wrapper.style.transform = `
                translate(-50%, -50%)
                scale(${scale})
                rotateX(${(yPercent - 50) * rotation}deg)
                rotateY(${(xPercent - 50) * -rotation}deg)
                translateZ(${zTranslation}px)`;

                wrapper.style.fontSize = fontSize;

                word.appendChild(wrapper);

                wordWidth = characters.length;
            }
            screenContent.appendChild(word);
            xPos += wordWidth;

            if (xPos > columns - 5) {
                xPos = 0;
                yPos++;
            }

            
        }
        xPos = 0;
        yPos++;
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        //Process input
        console_history += username + input_text + '\n';
        switch (input_text) {
            case "help":
                console_history +=  "Return to main menu: main-menu" + '\n' +
                                    "Change username: config username [new username]" + 
                                    '\n';
                break;
            default:
                console_history += username + "command \"" + input_text + "\" not found" + '\n';
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