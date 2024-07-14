// Get references to various DOM elements
const startBox = document.querySelector("#start-box"),
    startButton = startBox.querySelector("#start-btn"),
    board = document.querySelector("#board"),
    players = document.querySelector("#details"),
    gridBox = document.querySelectorAll("section span"),
    resultBoxWin = document.querySelector("#result-div-one"),
    resultBoxLose = document.querySelector("#result-div-two"),
    winText = resultBoxWin.querySelector("#win"),
    loseText = resultBoxLose.querySelector("#lose"),
    nextStageBtn = resultBoxWin.querySelector("button"),
    retryBtn = resultBoxLose.querySelector("button");

let bwin = false;

// Initialize the game when the window loads
window.onload = () => {
    for (let i = 0; i < gridBox.length; i++) {
        gridBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

// Start the game when the start button is clicked
startButton.onclick = () => {
    startBox.classList.add("hide");
    board.classList.add("show");
}

// Define player icons and initial settings
let playerXIcon = "fas fa-times",
    playerOIcon = "far fa-circle",
    playerSign = "X",
    runBot = true;

// Function to handle a box being clicked
function clickedBox(element) {
    if (players.classList.contains("player")) {
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
        element.setAttribute("id", playerSign);
    } else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute("id", playerSign);
        players.classList.add("active");
    }

    selectWinner();  // Check if there's a winner
    element.style.pointerEvents = "none";
    board.style.pointerEvents = "none";

    // Delay the bot's move
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
    setTimeout(() => {
        performBotAction(runBot);
    }, randomTimeDelay);
}

// Function to simulate bot's move
function performBotAction() {
    let array = [];
    if (runBot) {
        playerSign = "O";
        for (let i = 0; i < gridBox.length; i++) {
            if (gridBox[i].childElementCount == 0) {
                array.push(i);
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)];
        if (array.length > 0) {
            if (players.classList.contains("player")) {
                playerSign = "X";
                gridBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;
                gridBox[randomBox].setAttribute("id", playerSign);
                players.classList.add("active");
            } else {
                gridBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
                gridBox[randomBox].setAttribute("id", playerSign);
            }
            selectWinner();  // Check if there's a winner after bot's move
        }
        gridBox[randomBox].style.pointerEvents = "none";
        board.style.pointerEvents = "auto";
        playerSign = "X";
    }
}

// Helper function to get the id of an element
function getIdVal(classname) {
    return document.querySelector(".b" + classname).id;
}

// Helper function to check if a player has won
function checkIdSign(val1, val2, val3, sign) {
    if (getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign) {
        return true;
    }
}

// Function to check if there's a winner or a draw
function selectWinner() {
    // Check all possible win conditions
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) || checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) || checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {

        runBot = false;
        performBotAction(runBot);

        if (playerSign == 'X') {
            localStorage.setItem('first-level-completed', 'true')
            winText.innerHTML = `You beat Galatron! <br>
            "I was just warming up, see if you can beat me in the next one"`;
            setTimeout(() => {
                resultBoxWin.classList.add("show");
                board.classList.remove("show");
            }, 700);
        } else {
            bwin = true;
            loseText.innerHTML = `You Lost!`;
            setTimeout(() => {
                resultBoxLose.classList.add("show");
                board.classList.remove("show");
            }, 700);
        }
    } else {
        // Check for a draw
        if (getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != "") {
            runBot = false;
            bwin = true;
            performBotAction(runBot);
            setTimeout(() => {
                resultBoxLose.classList.add("show");
                board.classList.remove("show");
            }, 700);
            loseText.textContent = "Match has been Drawn!";
        }
    }
}
