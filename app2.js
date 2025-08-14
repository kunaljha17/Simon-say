let name = localStorage.getItem("highScoreName") || "No Name";

let gameSeq = [];
let userSeq = [];

let btns = ["grey", "red", "yellow", "blue"];

let started = false;
let level = 0;

 
let highScore = localStorage.getItem("highScore") || 0;

let sounds = {
    grey: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    wrong: new Audio("https://www.soundjay.com/button/beep-10.mp3")
};

let h2 = document.querySelector('h2');
let h3 = document.querySelector('h3');
h3.innerHTML = `${name} High score : <b>${highScore}</b>`;

document.addEventListener("keypress", function () {
    if (!started) {
        started = true;
        levelup();
    }
});

function gameflash(btn) {
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), 250);
}

function userflash(btn) {
    btn.classList.add("userflash");
    setTimeout(() => btn.classList.remove("userflash"), 250);
}

function levelup() {
    userSeq = [];
    level++;
    h2.innerHTML = `Level ${level}`;

    let randidx = Math.floor(Math.random() * 4);
    let randColor = btns[randidx];
    let randBtn = document.querySelector(`.${randColor}`);

    gameSeq.push(randColor);
    console.log("Game Sequence:", gameSeq);

    gameflash(randBtn);
    sounds[randColor].play();
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelup, 1000);
        }
    } else {
        sounds["wrong"].play();

        if (level > highScore) {
            highScore = level;
            localStorage.setItem("highScore", highScore);

            name = prompt("🎉 New High Score! Enter your name:");
            if (!name) name = "Anonymous";
            localStorage.setItem("highScoreName", name);
        }

        h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br>Press any key to start`;
        h3.innerHTML = `${name} High score : <b>${highScore}</b>`;

        document.body.style.backgroundColor = "red";
        setTimeout(() => {
            document.body.style.backgroundColor = "white";
        }, 150);

        reset();
    }
}

function btnpress() {
    let btn = this;
    userflash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    sounds[userColor].play();

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll('.btn');
for (let btn of allBtns) {
    btn.addEventListener("click", btnpress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

 
window.resetHighScore = function (secret) {
    if (secret === "kunal@123") {
        localStorage.removeItem("highScore");
        localStorage.removeItem("highScoreName");
        highScore = 0;
        name = "No Name";
        alert("High Score has been reset via console!");
        h3.innerHTML = `${name} High score : <b>${highScore}</b>`;
    } else {
        alert("Invalid password. High Score not reset.");
    }
};
