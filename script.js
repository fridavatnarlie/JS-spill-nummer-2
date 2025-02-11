document.addEventListener("DOMContentLoaded", function() {

    /* Definisjoner */
    const bakgrunnElm = document.getElementById("bakgrunn");
    const nautElm = document.getElementById("astronaut");

    /* Astronaut */
    let nautPosition = 180;
    let nautHastighet = 0;
    let steglengde = 10;
    let skjermbredde = window.innerWidth; 
    let nautbredde = nautElm.offsetWidth;

    let intFlytt = null;

    function startSpill() {
        if (intFlytt === null) {
            intFlytt = setInterval(flytt, 13);
            console.log("Spillet er startet");
        }
    }

    /* Kontroller astronauten */
    document.addEventListener('keydown', (event) => {
        startSpill();
        
        if (event.key === "ArrowLeft") {
            nautHastighet = -steglengde;
        } else if (event.key === "ArrowRight") {
            nautHastighet = steglengde;
        }
    });

    document.addEventListener('keyup', (event) => {
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

});
