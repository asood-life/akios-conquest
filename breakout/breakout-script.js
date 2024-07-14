// Canvas and context setup
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const mainDiv = document.getElementById('mainDiv');

// UI Elements
const startBtn = document.getElementById('start-btn');
const startBox = document.getElementById('start-box');
const winText = document.getElementById('win');
const loseText = document.getElementById('lose');
const resultBoxWin = document.querySelector("#result-win-div");
const resultBoxLose = document.querySelector("#result-lose-div");
const nextStageBtn = resultBoxWin.querySelector("button");

// Game variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 50;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 5;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
let lives = 3;
let stopId = null;

const colors = ['#EA2014', '#4F6F23', '#FD7F19', '#FBB533', '#498CA4'];

// Bricks array
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

// Event listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
startBtn.onclick = startGame;
nextStageBtn.onclick = () => {
	window.location.href = '../utils/planets.html';
};

// Start game function
function startGame() {
	canvas.style.display = 'flex';
	startBox.style.display = 'none';
	setTimeout(draw, 100);
}

// Key handlers
function keyDownHandler(e) {
	if (e.keyCode == 39) rightPressed = true;
	else if (e.keyCode == 37) leftPressed = true;
}

function keyUpHandler(e) {
	if (e.keyCode == 39) rightPressed = false;
	else if (e.keyCode == 37) leftPressed = false;
}

// Mouse move handler
function mouseMoveHandler(e) {
	const relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

// Drawing functions
function drawBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status === 1) {
				const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = colors[r];
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#be2102";
	ctx.fill();
	ctx.closePath();
}

function drawScore() {
	ctx.font = "16px pixel";
	ctx.fillStyle = "black";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px pixel";
	ctx.fillStyle = "black";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Collision detection
function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			const b = bricks[c][r];
			if (b.status === 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score === brickRowCount * brickColumnCount) {
						gameWin();
					}
				}
			}
		}
	}
}

// Game win function
function gameWin() {
	mainDiv.style.display = 'none';
	localStorage.setItem('second-level-completed', 'true');
	winText.innerHTML = 'You beat Galatron! <br> "Looks like I must start taking you seriously"';
	setTimeout(() => {
		resultBoxWin.classList.add("show");
	}, 500);
}

// Game over function
function gameOver() {
	mainDiv.style.display = 'none';
	loseText.innerHTML = 'You lost!';
	setTimeout(() => {
		resultBoxLose.classList.add("show");
	}, 500);
}

// Main draw function
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	// Ball movement
	if (y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--;
			if (lives === 0) {
				gameOver();
			} else {
				resetBallAndPaddle();
			}
		}
	}

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 5;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 5;
	}

	x += dx;
	y += dy;

	if (lives !== 0 && score !== brickRowCount * brickColumnCount) {
		stopId = requestAnimationFrame(draw);
	}
}

// Reset ball and paddle position
function resetBallAndPaddle() {
	x = canvas.width / 2;
	y = canvas.height - 30;
	dx = 2;
	dy = -2;
	paddleX = (canvas.width - paddleWidth) / 2;
}
