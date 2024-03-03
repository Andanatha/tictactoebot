var origBoard;
const huPlayer = "X";
const botPlayer = "O";
const winCombo = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

const cells = document.querySelectorAll(".cell");
var playerScore = 0;
var botScore = 0;
startGame();

function startGame() {
    document.querySelector(".endGame").style.display = "none"
    origBoard = Array.from(Array(9).keys())
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);

    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] === 'number') {
        turn(square.target.id, huPlayer)
        if (!chekTie()) turn(bestSpot(), botPlayer);
    }

}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = chekWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

function chekWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombo.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombo[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "blue" : "#ff2e63";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You Winn" : "You Losee.")
}

function declareWinner(who) {
    document.querySelector(".endGame").style.display = "block"
    document.querySelector(".endGame .teks").innerText= who;
    if (who.includes("You Win")) {
        playerScore++;
        document.querySelector(".score").innerText = "Score: " + playerScore;
        updateScoreInLocalStorage(playerScore, botScore);
    } else if (who.includes("You Lose")) {
        botScore++;
        document.querySelector(".score").innerText = "Score: Human " + playerScore + " - Bot " + botScore;
        updateScoreInLocalStorage(playerScore, botScore);
    }
}

function updateScoreInLocalStorage(playerScore, botScore) {
    localStorage.setItem('playerScore', playerScore);
    localStorage.setItem('botScore', botScore);
}

function emptySquare() {
    return origBoard.filter(s => typeof s == 'number')
}

function bestSpot() {
    return minimax(origBoard, botPlayer).index;

}

function chekTie() {
    if (emptySquare().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Draw Game");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquare(newBoard);

    if (chekWin(newBoard, player)) {
        return {score: -10};
    } else if (chekWin(newBoard, botPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == botPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, botPlayer);
            move.score = result.score
        }

        newBoard[availSpots[i]] = move.index

        moves.push(move);
    }

    var bestMove;
    if (player === botPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++){
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++){
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove]; 
}

window.onload = function() {
    var savedPlayerScore = localStorage.getItem('playerScore');
    var savedBotScore = localStorage.getItem('botScore');
    
    if (savedPlayerScore && savedBotScore) {
        playerScore = parseInt(savedPlayerScore);
        botScore = parseInt(savedBotScore);
        document.querySelector(".score").innerText = "";
};
}
