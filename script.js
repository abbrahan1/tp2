document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let errors = 0;
    const totalCountries = 4; 
    const maxScore = 200;
    const totalTime = 35;
    let timeLeft = totalTime;
    const playerContainer = document.getElementById('Nombre_jugador');
    const optionsContainer = document.getElementById('options-container');
    const timerContainer = document.getElementById('Tiempo');
    const gameContainer = document.getElementById('game-container');
    const registerContainer = document.getElementById('register-container');
    const loginContainer = document.getElementById('login-container');
    const rankingButton = document.getElementById('ranking-button');
    const rankingContainer = document.getElementById('ranking-container');
    const rankingList = document.getElementById('ranking-list');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    let shownPlayers = [];

    function fetchPlayer() {
        return fetch('data.php')
            .then(response => response.json())
            .then(player => {
                while (shownPlayers.includes(player.nombre)) {
                    return fetchPlayer(); 
                }
                return player;
            });
    }

    function loadNewPlayer() {
        fetchPlayer().then(player => {
            shownPlayers.push(player.nombre); 
            if (shownPlayers.length > 25) {
                shownPlayers.shift(); 
            }

            if (player.nombre) {
                playerContainer.textContent = player.nombre;
                optionsContainer.innerHTML = '';
                const countries = generateCountryOptions(player.country);
                countries.forEach(country => {
                    const button = document.createElement('button');
                    const img = document.createElement('img');
                    img.src = `flags/${country}.png`;
                    img.alt = country;
                    button.appendChild(img);
                    button.addEventListener('click', () => checkAnswer(country, player.country));
                    optionsContainer.appendChild(button);
                });
            }
        });
    }



    function generateCountryOptions(correctCountry) {
        const allCountries = [
            'Argentina', 'Brasil', 'Uruguay', 'Chile',
            'Colombia', 'Peru', 'Ecuador', 'Paraguay',
            'Venezuela', 'Bolivia', 'Mexico', 'EEUU'
        ];
    
        const options = [correctCountry];
    

        const totalCountries = 12;//camtidad de banderas a,b,u,c,c,p.. 
    
        while (options.length < totalCountries) {
            const country = allCountries[Math.floor(Math.random() * allCountries.length)];
            if (!options.includes(country)) {
                options.push(country);
            }
        }
    
        return options.sort(() => Math.random() - 0.5);
    }
    

    function checkAnswer(selectedCountry, correctCountry) {
        if (selectedCountry === correctCountry) {
            score++;
        } else {
            errors++;
        }

        if (score >= maxScore || errors >= maxScore) {
            endGame();
        } else {
            loadNewPlayer();
        }
    }

    function endGame() {
        const userEmail = sessionStorage.getItem('userEmail'); 

        fetch('update_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail, score: score })
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                title: 'Juego terminado!',
                html: `<p>Puntaje: <strong>${score}</strong></p><p>Errores: <strong>${errors}</strong></p>`,
                icon: 'info',
                confirmButtonText: 'Volver a Jugar'
            }).then(() => {
                score = 0;
                errors = 0;
                timeLeft = totalTime;
                loadNewPlayer();
                startTimer();
            });
        });
    }

    function startTimer() {
        timerContainer.textContent = `Tiempo: ${timeLeft}s`;
        const timerInterval = setInterval(() => {
            timeLeft--;
            timerContainer.textContent = `Tiempo: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function showGame() {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        loadNewPlayer();
        startTimer();
    }

    function registerUser(event) {
        event.preventDefault();
        const formData = new FormData(registerForm);

        fetch('register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                sessionStorage.setItem('userEmail', formData.get('email'));
                showGame();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }

    function loginUser(event) {
        event.preventDefault();
        const formData = new FormData(loginForm);

        fetch('login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                sessionStorage.setItem('userEmail', formData.get('email'));
                showGame();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }

    registerForm.addEventListener('submit', registerUser);
    loginForm.addEventListener('submit', loginUser);

    loginButton.addEventListener('click', () => {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    registerButton.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    rankingButton.addEventListener('click', () => {
        const userEmail = sessionStorage.getItem('userEmail');

        fetch('ranking.php')
            .then(response => response.json())
            .then(data => {
                rankingList.innerHTML = '';
                let userScore = null;
                data.forEach(user => {
                    const userElement = document.createElement('p');
                    userElement.textContent = `${user.nombre}: ${user.puntos} puntos`;
                    rankingList.appendChild(userElement);

                    if (user.email === userEmail) {
                        userScore = user.puntos;
                    }
                });

                rankingContainer.style.display = 'block';

                if (userScore !== null) {
                    Swal.fire({
                        title: 'CARGANDO',
                        text: ``,
                        icon: 'info',
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    Swal.fire({
                        title: 'CARGANDO',
                        text: '',
                        icon: 'info',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
    });
});
