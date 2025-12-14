 

 let gameSeq = [];
        let userSeq = [];
        const btns = ["grey", "red", "yellow", "blue"];
        let started = false;
        let level = 0;
        let highScore = 0;
        let streak = 0;
        let difficulty = "normal";
        let isPlayingSequence = false;

        const speeds = {
            normal: 600,
            hard: 400,
            extreme: 250
        };

        const sounds = {
            grey: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
            red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
            yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
            blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
            wrong: new Audio("https://www.soundjay.com/button/beep-10.mp3")
        };

        document.addEventListener("keypress", function(e) {
            if (e.code === "Space" && !started) {
                startGame();
            }
        });

        function changeDifficulty(newDifficulty) {
            if (started) return;
            difficulty = newDifficulty;
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-difficulty="${newDifficulty}"]`).classList.add('active');
        }

        function updateDisplay() {
            document.getElementById('levelDisplay').textContent = level;
            document.getElementById('highScoreDisplay').textContent = highScore;
            document.getElementById('streakDisplay').textContent = streak;
        }

        function startGame() {
            if (started) return;
            started = true;
            streak = 0;
            document.querySelector('.center-circle').textContent = level;
            levelUp();
        }

        async function gameFlash(btn) {
            btn.classList.add("flash");
            sounds[btn.id].play();
            await new Promise(resolve => setTimeout(resolve, 300));
            btn.classList.remove("flash");
        }

        function userFlash(btn) {
            btn.classList.add("userflash");
            sounds[btn.id].play();
            setTimeout(() => btn.classList.remove("userflash"), 250);
        }

        async function showSequence() {
            if (!started || isPlayingSequence || gameSeq.length === 0) return;
            isPlayingSequence = true;
            document.getElementById('statusText').textContent = "Replaying Sequence...";
            
            for (let color of gameSeq) {
                await new Promise(resolve => setTimeout(resolve, 200));
                let btn = document.getElementById(color);
                await gameFlash(btn);
            }
            
            document.getElementById('statusText').textContent = "Your Turn!";
            isPlayingSequence = false;
        }

        async function levelUp() {
            userSeq = [];
            level++;
            streak++;
            updateDisplay();
            document.getElementById('statusText').textContent = `Level ${level} - Watch Carefully!`;
            document.querySelector('.center-circle').textContent = level;

            let randColor = btns[Math.floor(Math.random() * 4)];
            gameSeq.push(randColor);

            isPlayingSequence = true;
            await new Promise(resolve => setTimeout(resolve, 800));

            for (let color of gameSeq) {
                let btn = document.getElementById(color);
                await gameFlash(btn);
                await new Promise(resolve => setTimeout(resolve, speeds[difficulty] - 300));
            }

            document.getElementById('statusText').textContent = "Your Turn!";
            isPlayingSequence = false;
        }

        function checkAns(idx) {
            if (userSeq[idx] === gameSeq[idx]) {
                if (userSeq.length === gameSeq.length) {
                    setTimeout(levelUp, 1000);
                }
            } else {
                sounds.wrong.play();
                document.body.style.background = "#ffcdd2";
                setTimeout(() => {
                    document.body.style.background = "#ffffff";
                }, 200);

                if (level > highScore) {
                    highScore = level;
                    document.getElementById('statusText').textContent = `New High Score: ${level}! Press START to play again`;
                } else {
                    document.getElementById('statusText').textContent = `Game Over! Score: ${level} | Press START to try again`;
                }

                reset();
            }
        }

        function btnPress() {
            if (!started || isPlayingSequence) return;
            
            let btn = this;
            userFlash(btn);
            userSeq.push(btn.id);
            checkAns(userSeq.length - 1);
        }

        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener("click", btnPress);
        });

        function reset() {
            started = false;
            gameSeq = [];
            userSeq = [];
            level = 0;
            streak = 0;
            document.querySelector('.center-circle').textContent = "START";
            updateDisplay();
        }

        function resetHighScore() {
            if (confirm("Are you sure you want to reset the high score?")) {
                highScore = 0;
                updateDisplay();
                alert("High Score has been reset!");
            }
        }

        updateDisplay();
