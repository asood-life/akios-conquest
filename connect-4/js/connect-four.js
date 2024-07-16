// Retrieve DOM elements
const winText = document.getElementById('win'),
    loseText = document.getElementById('lose'),
    resultBoxWin = document.querySelector("#result-win-div"),
    player = document.getElementById('container'),
    resultBoxLose = document.querySelector("#result-lose-div"),
    startBtn = document.getElementById('start-btn'),
    startBox = document.getElementById('start-box');

// Event listener for start button click
startBtn.onclick = () => {
    player.style.display = 'flex';  // Display the player container
    startBox.style.display = 'none';  // Hide the start box
}

// Game constructor
function Game() {
    this.rows = 6;  // Number of rows in the game board
    this.columns = 7;  // Number of columns in the game board
    this.status = 0;  // Game status: 0 (ongoing), 1 (win), 2 (lose), 3 (draw)
    this.depth = 4;  // Depth for the minimax algorithm
    this.score = 100000;  // Score value
    this.round = 0;  // Current round: 0 (human), 1 (computer)
    this.winning_array = [];  // Array to store winning combination
    this.iterations = 0;  // Iteration count for minimax algorithm

    that = this;  // Store the context of the game

    that.init();  // Initialize the game
}

// Initialize the game
Game.prototype.init = function () {
    // Create a 2D array representing the game board
    var game_board = new Array(that.rows);
    for (var i = 0; i < game_board.length; i++) {
        game_board[i] = new Array(that.columns);

        for (var j = 0; j < game_board[i].length; j++) {
            game_board[i][j] = null;  // Set all cells to null
        }
    }

    // Initialize the board object
    this.board = new Board(this, game_board, 0);

    // Create HTML for the game board
    var game_board = "<col/><col/><col/><col/><col/><col/><col/>";
    for (var i = 0; i < that.rows; i++) {
        game_board += "<tr>";
        for (var j = 0; j < that.columns; j++) {
            game_board += "<td class='empty'></td>";
        }
        game_board += "</tr>";
    }

    // Inject the game board HTML into the DOM
    document.getElementById('game_board').innerHTML = game_board;

    // Add click event listeners to each cell
    var td = document.getElementById('game_board').getElementsByTagName("td");
    for (var i = 0; i < td.length; i++) {
        if (td[i].addEventListener) {
            td[i].addEventListener('click', that.act, false);
        } else if (td[i].attachEvent) {
            td[i].attachEvent('click', that.act);
        }
    }
}

// On-click event handler
Game.prototype.act = function (e) {
    var element = e.target || window.event.srcElement;

    if (!($('#coin').is(":animated"))) {
        if (that.round == 0) {
            that.place(element.cellIndex);
        }
    }
}

// Place a coin in the specified column
Game.prototype.place = function (column) {
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        for (var y = that.rows - 1; y >= 0; y--) {
            if (document.getElementById('game_board').rows[y].cells[column].className == 'empty') {
                if (that.round == 1) {
                    var coin_x = column * 51;
                    var coin_y = y * 51;
                    $('#coin').attr('class', 'cpu-coin').css({ 'left': coin_x }).fadeIn('fast').animate({ 'top': coin_y + 'px' }, 700, 'easeOutBounce', function () {
                        document.getElementById('game_board').rows[y].cells[column].className = 'coin cpu-coin';
                        $('#coin').hide().css({ 'top': '0px' });

                        if (!that.board.place(column)) {
                            return alert("Invalid move!");
                        }

                        that.round = that.switchRound(that.round);
                        that.updateStatus();
                    });
                } else {
                    var coin_x = column * 51;
                    var coin_y = y * 51;
                    $('#coin').attr('class', 'human-coin').css({ 'left': coin_x }).fadeIn('fast').animate({ 'top': coin_y + 'px' }, 700, 'easeOutBounce', function () {
                        document.getElementById('game_board').rows[y].cells[column].className = 'coin human-coin';
                        $('#coin').hide().css({ 'top': '0px' });
                        that.generateComputerDecision();

                        if (!that.board.place(column)) {
                            return alert("Invalid Move!");
                        }

                        that.round = that.switchRound(that.round);
                        that.updateStatus();
                    });
                }
                break;
            }
        }
    }
}

// Generate computer's move
Game.prototype.generateComputerDecision = function () {
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        that.iterations = 0;
        document.getElementById('loading').style.display = "block";

        setTimeout(function () {
            var startzeit = new Date().getTime();

            var ai_move = that.maximizePlay(that.board, that.depth);

            var laufzeit = new Date().getTime() - startzeit;

            that.place(ai_move[0]);

            document.getElementById('loading').style.display = "none";
        }, 100);
    }
}

// Minimax algorithm - maximizing player
Game.prototype.maximizePlay = function (board, depth, alpha, beta) {
    var score = board.score();

    if (board.isFinished(depth, score)) return [null, score];

    var max = [null, -99999];

    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy();

        if (new_board.place(column)) {
            that.iterations++;

            var next_move = that.minimizePlay(new_board, depth - 1, alpha, beta);

            if (max[0] == null || next_move[1] > max[1]) {
                max[0] = column;
                max[1] = next_move[1];
                alpha = next_move[1];
            }

            if (alpha >= beta) return max;
        }
    }

    return max;
}

// Minimax algorithm - minimizing player
Game.prototype.minimizePlay = function (board, depth, alpha, beta) {
    var score = board.score();

    if (board.isFinished(depth, score)) return [null, score];

    var min = [null, 99999];

    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy();

        if (new_board.place(column)) {
            that.iterations++;

            var next_move = that.maximizePlay(new_board, depth - 1, alpha, beta);

            if (min[0] == null || next_move[1] < min[1]) {
                min[0] = column;
                min[1] = next_move[1];
                beta = next_move[1];
            }

            if (alpha >= beta) return min;
        }
    }
    return min;
}

// Switch the round
Game.prototype.switchRound = function (round) {
    if (round == 0) {
        return 1;
    } else {
        return 0;
    }
}

// Update the game status
Game.prototype.updateStatus = function () {
    if (that.board.score() == -that.score) {
        that.status = 1;
        that.markWin();
    }

    if (that.board.score() == that.score) {
        that.status = 2;
        that.markWin();
    }

    if (that.board.isFull()) {
        that.status = 3;
    }

    var html = document.getElementById('status');
    if (that.status == 1) {
        winText.innerHTML = 'You beat Galatron!';
        localStorage.setItem('third-level-completed', 'true');
        setTimeout(() => {
            resultBoxWin.classList.add("show");
            player.style.display = 'none';
        }, 700);
    }
    if (that.status == 2) {
        loseText.innerHTML = 'You LOST! <br> "You will never take these games back from me"';
        setTimeout(() => {
            resultBoxLose.classList.add("show");
            player.style.display = 'none';
        }, 700);
    }
    if (that.status == 3) {
        loseText.innerHTML = 'DRAW!';
        setTimeout(() => {
            resultBoxLose.classList.add("show");
            player.style.display = 'none';
        }, 700);
    }
}

// Highlight the winning combination
Game.prototype.markWin = function () {
    for (var i = 0; i < that.winning_array.length; i++) {
        var name = document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className;
        document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className = name + " win";
    }
}

// Restart the game
Game.prototype.restartGame = function () {
    that.status = 0;
    that.round = 0;
    that.init();
    resultBoxLose.classList.remove("show");
    player.marginTop = '10%';
    player.style.display = 'flex';
    player.style.flexDirection = 'column';
    player.style.justifyContent = 'center';
    player.style.alignItems = 'center';
    that.updateStatus();

    $('td').hover(function () {
        $(this).parents('table').find('col:eq(' + $(this).index() + ')').toggleClass('hover');
    });
}

// Start the game
function Start() {
    window.Game = new Game();

    $('td').hover(function () {
        $(this).parents('table').find('col:eq(' + $(this).index() + ')').toggleClass('hover');
    });
}

// Initialize the game when the window loads
window.onload = function () {
    Start();
};
