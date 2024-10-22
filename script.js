
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
    
    let player1, player2;
    let currentPlayer = player1;
    let gameWon = false;

    const setPlayers = (name1, name2) => {
        player1 = Player(name1, 'X');
        player2 = Player(name2, 'O');
        currentPlayer = player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    // Switch between P1 and P2
    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    // Play a round of the game
    const playRound = (index) => {
        if (!gameWon && Gameboard.updateBoard(index, currentPlayer.marker)) {
            ScreenController.updateBoard();
            if (checkWinner()) {
                gameWon = true;
                ScreenController.displayWinner(currentPlayer.name); 
            } else if (checkDraw()) {  
                gameWon = true;
                ScreenController.displayDraw();
            }else {
                switchTurn();
                ScreenController.updateTurn(currentPlayer.name);
            }
        } else if (gameWon){
            alert("Game is over! Reset to play again.")
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

    // checks for draw for when gameboard is full
    const checkDraw = () => {
        return Gameboard.getBoard().every(cell => cell !== null);
    };

    // Reset the game
    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameWon = false;
        ScreenController.updateTurn("[Select Player Names]"); 
        ScreenController.updateBoard(); 
        ScreenController.showPlayerModal(); 
    };

    return { playRound, resetGame, setPlayers, getCurrentPlayer };
})();

// Handles updates to the game UI
const ScreenController = (() => {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.gameboard');
    const resetButton = document.getElementById('reset-btn');
    const modal = document.getElementById('player-modal');
    const startButton = document.getElementById('start-game-btn');

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

    const displayDraw = () => {
        playerTurnDiv.textContent = "It's a draw!";
    };

    const showPlayerModal = () => {
        modal.style.display = 'flex'; 
        document.getElementById('player1-name').value = 'Player 1';
        document.getElementById('player2-name').value = 'Player 2'; 
    };

    const clickHandlerBoard = (e) => {
        const index = e.target.dataset.index;
        if (index) {
            GameController.playRound(index);
        }
    };

    // Set Initial Display
    const init = () => {

        // Start the game when player names are added
        startButton.addEventListener('click', () => {
            const player1Name = document.getElementById('player1-name').value;
            const player2Name = document.getElementById('player2-name').value;

            if (player1Name && player2Name) {
                GameController.setPlayers(player1Name, player2Name);
                updateTurn(GameController.getCurrentPlayer().name);
                modal.style.display = 'none'; 
            } else {
                alert('Please enter names for both players.');
            }
        });

        boardDiv.addEventListener('click', clickHandlerBoard);
        resetButton.addEventListener('click', GameController.resetGame);
        updateBoard();
    };

    return { init, updateBoard, updateTurn, displayWinner, displayDraw, showPlayerModal };
})();

ScreenController.init();
