document.addEventListener("DOMContentLoaded", function () {

    /* Definisjoner */
    const bakgrunnElm = document.getElementById("bakgrunn");
    const nautElm = document.getElementById("astronaut");
    const poengtellerElm = document.getElementById("poengteller");
    const timerElm = document.getElementById("timer");
    const gameoverElm = document.getElementById("gameover");
    gameoverElm.style.display = "none";
    
    let poeng = 0;
    let gameover = false;
    let tid = 120;

    const ufoElms = [
        document.getElementById("ufo1"),
        document.getElementById("ufo2"),
        document.getElementById("ufo3")
    ];

    /* Musikk */ 
    const musikkBakgrunn = new Audio("musikk/bakgrunn.mp3")
    const musikkGameover = new Audio("musikk/gameover.mp3")

    const laserElm = document.createElement("div");
    laserElm.id = "laser";
    bakgrunnElm.appendChild(laserElm);


    /* Stoppeklokk/timer */
    let tidInterval = setInterval(function () {
        if (tid > 0) {
            tid--

            let minutter = Math.floor(tid / 60);
            let sekunder = tid % 60;

            let sekunderTekst = sekunder < 10 ? "0" + sekunder : sekunder; // Legger til 0 foran hvis sekunder er under 10
            timerElm.textContent = minutter + ":" + sekunderTekst;
        }
        else {
            clearInterval(tidInterval);  // Stopper tiden
            gameover = true;
            gameoverElm.style.display = "block"; // Note to self: block er å vise

            // Stopper astronauten og UFO spawning
            nautHastighet = 0;
            clearInterval(spawnUFOInterval)

            musikkBakgrunn.pause()
            musikkBakgrunn.currentTime = 0;
            musikkGameover.play()

            const tilbakeElm = document.getElementById("tilbake");
            tilbakeElm.textContent = "Tilbake til forsiden";

            tilbakeElm.addEventListener("click", function () {
                window.location.href = "index.html";
            });

        }
    }, 1000);

    /* Astronaut */
    let nautPosition = 180;
    let nautHastighet = 0;
    let steglengde = 10;
    let skjermbredde = window.innerWidth;
    let nautbredde = nautElm.offsetWidth;

    let intFlytt = null;

    function startSpill() {
        if (intFlytt === null && !gameover) { // hvis det er ingen "spillbevegelse" og det er ikke gameover (!) skjer:
            intFlytt = setInterval(flytt, 13);
            musikkBakgrunn.loop = true;
            musikkBakgrunn.play()
            console.log("Spillet er startet")
        }
    }

    /* Kontrollerer astronauten */
    document.addEventListener("keydown", function(event) {
        if (gameover) return;  // Hvis game over, stopp bevegelse
    
        startSpill()
    
        if (event.key === "ArrowLeft") {
            nautHastighet = -steglengde;
        } else if (event.key === "ArrowRight") {
            nautHastighet = steglengde;
        } else if (event.key === " ") {
            skyteLaser();
        }
    });
    
    // Ønsker ikke en konstant bevegelse på astronauten
    document.addEventListener("keyup", function (event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            nautHastighet = 0;
        }
    });

    function flytt() {
        nautPosition += nautHastighet;

        if (nautPosition < 0) {
            nautPosition = 0;
        } else if (nautPosition > skjermbredde - nautbredde) {
            nautPosition = skjermbredde - nautbredde;
        }

        nautElm.style.left = nautPosition + "px";
    }

    function skyteLaser() {
        laserElm.style.display = "block";
        laserElm.style.left = nautPosition + nautbredde / 2 - 2.5 + "px"; // Horisontal posisjon
        laserElm.style.top = nautElm.offsetTop - 20 + "px"; // Vertikal posisjon

        let laserTop = parseInt(laserElm.style.top); // Husk: spørre rasmus om parseInt!

        let laserInterval = setInterval(function () {
            laserTop -= 10;

            laserElm.style.top = laserTop + "px";

            if (laserTop <= 0) { // Er laseren utenfor skjermen:
                clearInterval(laserInterval);
                laserElm.style.display = "none";
            }
            else {
                sjekkKollisjon();
            }
        }, 10);
    }

    // Eventuell kollisjon mellom laser og UFO
    function sjekkKollisjon() {
        for (let i = 0; i < ufoElms.length; i++) {
            let ufo = ufoElms[i];

            // Posisjonen til UFO
            let ufoX = ufo.offsetLeft;
            let ufoY = ufo.offsetTop;
            let ufoBredde = ufo.offsetWidth;
            let ufoHoyde = ufo.offsetHeight;

            // Posisjon til laser
            let laserX = laserElm.offsetLeft;
            let laserY = laserElm.offsetTop;

            if (laserX > ufoX && 
                laserX < ufoX + ufoBredde && 
                laserY > ufoY && 
                laserY < ufoY + ufoHoyde) {

                ufo.style.display = "none";
                laserElm.style.display = "none";
                poeng++
                poengtellerElm.textContent = "Poeng:" + poeng;
            }
        }
    }

    let spawnUFOInterval

    function spawnUFO(ufoElm) {
        spawnUFOInterval = setInterval(function () {
            if (gameover) return; // Hvis game over, stopp spawning

            let randomX = Math.random() * (skjermbredde - 100);
            let randomY = Math.random() * (window.innerHeight / 2); // Halve skjermen så UFO ikke kommer oppå planeten

            ufoElm.style.left = randomX + "px";
            ufoElm.style.top = randomY + "px";
            ufoElm.style.display = "block"; // block = vises

            // Lengde UFO vises på skjermen før den forsvinner
            setTimeout(function () {
                ufoElm.style.display = "none"; // 10000 millisekunder = 10 sekunder
            }, 10000);
        }, Math.random() * 5000 + 2000); // Spawner på ish tilfeldige tidspunkter
    }

    spawnUFO(ufo1);
    spawnUFO(ufo2);
    spawnUFO(ufo3);

});
