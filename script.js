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

// Get the player name and marker (X or O)
const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;

    // Switch between P1 and P2
    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    // Play a round of the game
    const playRound = (index) => {
        if (Gameboard.updateBoard(index, currentPlayer.marker)) {
            displayBoard();
            if (checkWinner()) {
                console.log(`${currentPlayer.name} wins!`);
            } else {
                switchTurn();
            }
        } else {
            console.log("Cell is already taken. Try again!");
        }
    };

    // Console output of the gameboard
    const displayBoard = () => {
        const board = Gameboard.getBoard();
        console.log(`${board[0] || '-'} | ${board[1] || '-'} | ${board[2] || '-'}`);
        console.log(`${board[3] || '-'} | ${board[4] || '-'} | ${board[5] || '-'}`);
        console.log(`${board[6] || '-'} | ${board[7] || '-'} | ${board[8] || '-'}`);
        console.log(''); // Add empty line for spacing
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
    };

    return { playRound, resetGame };
})();

// Console game test
GameController.playRound(0); // Player 1 places an X
GameController.playRound(1); // Player 2 places an O
GameController.playRound(3); // Player 1 places an X
GameController.playRound(2); // Player 2 places an O
GameController.playRound(6); // Player 1 places an X
