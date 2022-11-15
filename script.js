const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";


// general settings
let gamePlaying = false;
const gravity = .5; // gravité
const speed = 6.0; // vitesse de défilement
const size = [51, 36]; // taille de l'oiseau
const jump = -11; // saut de l'oiseau
const cTenth = (canvas.width / 10);

// pipe settings
const pipeWidth = 78;
const pipeGap = 275;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

let index = 0, // permet le défilement style paralax
    bestScore = 0,
    currentScore = 0,
    pipes = [],
    flight,
    flyHeight;

// Fonction qui met le setup en place au chargement
const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

// fonction qui permet l'animation
const render = () => {
    index++;

    // Affichage et defillement du background
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);

    if(gamePlaying) { // En jeu
        // Affichage et animation oiseau
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        
        // Permet de faire sauter l'oiseaux et de le soumettre a la gravité
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);


    } else { // Ecran de start
        // Affichage et animation oiseau
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);
    
        // Ecrire dans le canvas
        ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
        ctx.fillText(`Cliquez pour jouer`, 48, 535);
        ctx.font = "bold 30px courier";
    }

    // Affichage pipes
    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed;

            // Top pipe
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            // Bottom Pipe
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth,canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1]+ pipeGap);

            if (pipe[0] <= - pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);

                // remove pipe et creer un nouveau
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }
            // hit pipe and end
            if ([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)) {
                gamePlaying = false;
                setup();
            }
        })
    }
    document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById("currentScore").innerHTML = `Actuel : ${currentScore}`;

    window.requestAnimationFrame(render);
};
setup();
img.onload = render;
document.addEventListener("click", () => gamePlaying = true);
window.onclick = () => flight = jump;