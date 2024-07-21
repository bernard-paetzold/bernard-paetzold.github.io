let console_history = "Welcome to the VCV-2000, if you are a new user, please type -help for system instructions.\n" +
                        "To print the CV to the screen, use the -print command.";
let username = "[guest-user]$ ";
let console_text = "";
let input_text = "";
let cursor_visible = false;

let screenContent = document.getElementById("screen-content");

let screen = document.getElementById("crt-screen");

const fontSize = 18;
const textSpacing = 1.2;
const lineSpacing = 4;

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

    console_text = console_history + '\n' + username + input_text + (cursor_visible ? '_' : "");

    let xPos = 0;
    let yPos = 0;

    let lines = console_text.split('\n');


    for (let i = 0; i < lines.length && yPos < rows; i++) {
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
                translate(-50%, -50%)
                scale(${scale})
                rotateX(${(yPercent - 50) * rotation}deg)
                rotateY(${(xPercent - 50) * -rotation}deg)
                translateZ(${zTranslation}px)`;

                wrapper.style.fontSize = `${fontSize}px`;

                word.appendChild(wrapper);

                xPos += textSpacing;

                /*if (xPos > columns) {
                    xPos = 0;
                    yPos += lineSpacing;
                }*/
            }
            
            screenContent.appendChild(word);

            xPos += wordWidth + textSpacing;
        }
        xPos = 0;
        yPos += lineSpacing;
    }
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