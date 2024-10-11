// Gameboard created in singleton pattern.

const Gameboard = (() => {
    const board = Array(9).fill(null); // empty 3x3 grid

    // Get the current state of the board
    const getBoard = () => board;

    // Update a specific cell if its empty
    const updateBoard = (index, player) => {
        if (!board[index]) { 
            board[index] = player;
            return true;
        }
        return false;
    };

    // Reset the board
    const resetBoard = () => {
        board.fill(null);
    };

    return { getBoard, updateBoard, resetBoard };
})();


// Controls state of game
const GameController = (() => {
    const Player = (name, marker) => {
        return { name, marker };
    };
    
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;

    const getCurrentPlayer = () => currentPlayer;

    // Switch between P1 and P2
    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    // Play a round of the game
    const playRound = (index) => {
        if (Gameboard.updateBoard(index, currentPlayer.marker)) {
            ScreenController.updateBoard();
            if (checkWinner()) {
                ScreenController.displayWinner(currentPlayer.name); 
            } else {
                switchTurn();
                ScreenController.updateTurn(currentPlayer.name);
            }
        } else {
            alert("Cell is already taken. Try again!");
        }
    };

    // Check for winner
    const checkWinner = () => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return Gameboard.getBoard()[a] &&
                   Gameboard.getBoard()[a] === Gameboard.getBoard()[b] &&
                   Gameboard.getBoard()[a] === Gameboard.getBoard()[c];
        });
    };

    // Reset the game
    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        ScreenController.updateTurn(currentPlayer.name); 
        ScreenController.updateBoard(); 
    };

    return { playRound, resetGame, getCurrentPlayer };
})();

// Handles updates to the game UI
const ScreenController = (() => {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.gameboard');
    const resetButton = document.getElementById('reset-btn');

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = board[index] || '';
        });
    };

    const updateTurn = (playerName) => {
        playerTurnDiv.textContent = `${playerName}'s turn`;
    };

    const displayWinner = (playerName) => {
        playerTurnDiv.textContent = `${playerName} wins!`;
    };

    const clickHandlerBoard = (e) => {
        const index = e.target.dataset.index;
        if (index) {
            GameController.playRound(index);
        }
    };

    // Set Initial Display
    const init = () => {
        boardDiv.addEventListener('click', clickHandlerBoard);
        resetButton.addEventListener('click', GameController.resetGame);
        updateTurn(GameController.getCurrentPlayer().name); 
        updateBoard();
    };

    return { init, updateBoard, updateTurn, displayWinner };
})();

ScreenController.init();
