//ASEGURARSE DE QUE SE CARGE EL DOCUMENTO ANTES DE EJECUTAR EL JUEGO

document.addEventListener("DOMContentLoaded", () => {
    const gridSize = 5; // DE MOMENTO EL TAMAÑO DE LA CUADRICULA ES (5x5)
    const grid = document.getElementById("grid"); // EN ESTE ELEMENTO SE RENDERIZA LA CUADRICULA
    const tiles = []; // ARRAY QUE ALMACENA LAS CASILLAS DE LA CUUDRICULA
    let lives = 3; // CONTADOR DE VIDAS DEL JUAGADOR MAS ADELANTE SE VA A INICIALIZAR CON MAS VIDAS
    let heroDamage = 3; // DAÑO BASE DEL HEROE
    let inCombat = false; // INDICADOR SI EL JUGADOR ESTA EN COMBATE

    // CREA Y MUESTRA EL CONTADOR DE VIDAS
    const livesDisplay = document.createElement("div");
    livesDisplay.id = "lives";
    livesDisplay.textContent = `Vidas: ${lives}`;
    document.body.insertBefore(livesDisplay, grid);


    //MOSTRAR EL NIVEL DEL JUEGO
    const levelDisplay = document.createElement("div");
    levelDisplay.id = "levelDisplay";
    levelDisplay.textContent = `Nivel: 0`;
    document.body.insertBefore(levelDisplay, grid);
    // ARRAY DE CONTENIDOS DE LAS CASILLAS 
    const CONTENTS = ["vacio", "enemigo", "tesoro", "trampa", "pocion", "escalera", "arma"]; // MAS ADELANTE VOY A AGREGAR MAS COTENIDOS

    // CREAR LAS CUADRICULAS CON EL CONTENIDO ALEATORIO
    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.content = CONTENTS[Math.floor(Math.random() * CONTENTS.length)];
        tile.addEventListener("click", () => revealTile(tile));
        grid.appendChild(tile);
        tiles.push(tile);
    }
    

    let currentLevel = parseInt(levelDisplay.textContent.split(" ")[1]);
    levelDisplay.textContent = `Nivel: ${currentLevel + 1}`;
    // FUNCION PARA REVELAR LAS CASILLAS Y VERIFICAR EL CONTENIDO DEPENDIENDO DE LAS CASILLAS SE VA A PRESENTAR UN EVENTO DISTINTO
    function revealTile(tile) {
        if (!tile.classList.contains("revealed") && !inCombat) {
            tile.classList.add("revealed");

            // VERFICA EL TIPO DE CONTENIDO ------- MAS ADELANTE VOY A AGREGAR ARMAS Y CAPAZ ARMADURAS
            if (tile.dataset.content === "pocion") {
                const img = document.createElement("img");
                img.src = "/assets/healingpotion.png";
                img.alt = "Poción";
                img.classList.add("potion-image");

                tile.textContent = ""; // LIMPIAR TEXTO
                tile.appendChild(img);

                // EVENTO PARA RECOPILAR LA POCION
                tile.addEventListener("click", () => collectPotion(tile));
                // ESTA VALIDACION SOLO LLAMA A LA FUNCION TEMPORALMENTE MAS ADELANTE VOY A EVALUAR AGREGAR UNA IMAGEN Y UNA INTERFAZ MEJOR
            }    else if (tile.dataset.content === "arma") {
                const img = document.createElement("img");
                img.src = "assets/sword.png"; 
                img.alt = "Espada";
                img.classList.add("weapon-image");
    
                tile.textContent = "";
                tile.appendChild(img);
                tile.addEventListener("click", () => collectWeapon(tile));
            }  else if (tile.dataset.content === "trampa") {
                activateTrap();

            } else if (tile.dataset.content === "escalera") {
                const img = document.createElement("img");
                img.src = "assets/stairs.png";
                img.alt = "Escaleras";
                img.classList.add("stairs-image");
                tile.textContent = "";
                tile.appendChild(img);
                tile.addEventListener("click", () => nextLevel(tile));
                
            } else {
                tile.textContent = tile.dataset.content;
                if (tile.dataset.content === "enemigo") {
                    startCombat();
                }
            }
        }
    }

    // FUNCION PARA RECOGER POCION (QUEDO OBSOLETA.... POR EL MOMENTO)
    // function gainLife() {
    //     lives++;
    //     livesDisplay.textContent = `Vidas: ${lives}`;
    //     alert("¡Has encontrado una poción! Ganas 1 vida.");
    // }

    //FUNCION PARA ACTIVAR TRAMPA
    function activateTrap() {
        tiles.innerHTML = ""; // BORRA EL CONTENIDO DE LA CASILLA
        alert("Has caído en una trampa! Pierdes 1 de vida.");
        lives--; // RESTA UNA VIDA
        livesDisplay.textContent = `Vidas: ${lives}`; // ACTUALIZA EL CONTADOR DE VIDAS
        // SI LA CANTIDAD DE VIDAS LLEGA A 0 LUEGO DE ACTIVAR LA TRAMPA EL JUEGO TERMINA
        if (lives == 0) {
            alert("Perdiste todas tus vidas! Fin del juego.");
            disableTiles(); // DESABILITA LAS CASILLAS
        }
    }


    // FUNCION PARA RECOGER POCION
    function collectPotion(tile) {
        tile.innerHTML = ""; // BORRA LA IMAGEN DE POCION
        alert("Has encontrado una poción! +1 Vida");
        lives++; // SUMA UNA VIDA
        livesDisplay.textContent = `Vidas: ${lives}`; // ACTUALIZA EL CONTADOR DE VIDAS
    }

    // FUNCION PARA RECOGER EL ARMA
    function collectWeapon(tile) {
        tile.innerHTML = ""; 
        alert("Has encontrado un arma! +1 de daño");
        heroDamage++; 
    }

    // FUNCION PARA PASAR AL SIGUIENTE NIVEL
    function nextLevel() {
        alert("Encontraste unas escaleras, subiendo al siguiente nivel!");
        grid.innerHTML = ""; // LIMPIA LA CUADRICULA
        tiles.length = 0; // LIMPIA EL ARRAY DE CASILLAS

        //CONSIDERE LA POSIBILIDAD DE AUMENTAR EL TAMAÑO DE LA CUADRICULA
        // gridSize++;

        //VUELVO A GENERAR EL TABLERO
        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.content = CONTENTS[Math.floor(Math.random() * CONTENTS.length)];
            tile.addEventListener("click", () => revealTile(tile));
            grid.appendChild(tile);
            tiles.push(tile);
        }

        // SE MUESTRA EL NIVEL
        const levelDisplay = document.getElementById("levelDisplay") || document.createElement("div");
        levelDisplay.id = "levelDisplay";
       // SI SE EMPIEZA EN 5X5  EL NIVEL ES 5-4 = 1
        levelDisplay.textContent = `Nivel: ${gridSize - 4}`; 
        document.body.insertBefore(levelDisplay, grid);
    }

    // FUNCION PARA INICIAR EL COMBATE
    function startCombat() {
        inCombat = true;
        let enemyHP = 3; // PUNTOS DE VIDA DEL ENEMIGO MAS ADELANTE VOY A AGREGAR DISTINTOS ENEMIGOS

        // CREA EL MODAL DE COMBATE
        const modal = document.createElement("div");
        modal.id = "combatModal";
        modal.innerHTML = `
            <div class="modal-content">
        <h2>¡Un enemigo apareció!</h2>
        <div class="battlefield">
            <div id="hero-container">
                <img id="hero" class="character" src="/assets/paladin.png" alt="Heroe">
            </div>
            <div id="enemy-container">
                <img id="enemy" class="character" src="/assets/troll.png" alt="Enemigo">
            </div>
        </div>
        <p>Vida del enemigo: <span id="enemyHP">${enemyHP}</span></p>
    </div>
        `;
        document.body.appendChild(modal);
        attackTurn();
    }

    // TURNOS DE ATAQUE DEL JUGADOR
    function attackTurn() {
        if (lives > 0) {
            animateAttack("hero", "enemy", () => {
                // EL DAÑO ESTA COMPRENDIDO ENTRE 1 Y 2
                let damage = Math.floor(Math.random() * 2) + 1; 
                let enemyHPElement = document.getElementById("enemyHP");
                let enemyHP = parseInt(enemyHPElement.textContent) - damage;
                enemyHPElement.textContent = enemyHP;

                if (enemyHP <= 0) {
                    setTimeout(() => {
                        alert("¡Has derrotado al enemigo!");
                        document.body.removeChild(document.getElementById("combatModal"));
                        inCombat = false;
                    }, 500);
                } else {
                    setTimeout(() => enemyAttack(), 500);
                }
            });
        }
    }

    // TURNO DE ATAQUE DEL ENEMIGO
    function enemyAttack() {
        if (lives > 0) {
            animateAttack("enemy", "hero", () => {
                if (Math.random() < 0.5) { // 50% DE POSIBILIDAD DE QUE EL ENEMIGO HAGA DAÑO
                    lives--;
                    livesDisplay.textContent = `Vidas: ${lives}`;
                    if (lives <= 0) {
                        setTimeout(() => {
                            alert("¡Has perdido todas tus vidas! Fin del juego.");
                            disableTiles(); // DESABILITA LAS CASILLAS
                            document.body.removeChild(document.getElementById("combatModal"));
                            inCombat = false;
                        }, 500);
                    } else {
                        setTimeout(() => attackTurn(), 500);
                    }
                } else {
                    setTimeout(() => attackTurn(), 500);
                }
            });
        }
    }

    // FUNCION PARA ANIMAR EL ATAQUE DE LOS PERSONAJES
    function animateAttack(attackerId, targetId, callback) {
        const attacker = document.getElementById(attackerId).parentElement; // ANIMAR EL CONTENEDOR DEL PERSONAJE
        const originalPos = attacker.style.transform || "translateX(0)";

        attacker.style.transition = "transform 0.3s ease";
        attacker.style.transform = attackerId === "hero" ? "translateX(80px)" : "translateX(-80px)";

        setTimeout(() => {
            attacker.style.transform = originalPos;
            setTimeout(callback, 300);
        }, 300);
    }

    // DESHABILITAR TODAS LAS CASILLAS CUANDO EL JUEGO TEMINA
    function disableTiles() {
        tiles.forEach(tile => tile.replaceWith(tile.cloneNode(true)));
    }
});
