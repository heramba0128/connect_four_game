document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart");
    const startGameButton = document.getElementById("start-game");
    const nameForm = document.getElementById("name-form");
    const gameBoard = document.getElementById("game-board");

    let player1 = "";
    let player2 = "";
    let currentPlayer = "red"; 
    const columns = 6;
    const rows = 3; 
    let grid = createGrid(columns, rows); 

    const placeSound = new Audio("sound(128k).mp3");

    function createGrid(columns, rows) {
        const grid = [];
        for (let row = 0; row < rows; row++) {
            const rowArray = [];
            for (let col = 0; col < columns; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", onCellClick);
                board.appendChild(cell);
                rowArray.push(null);
            }
            grid.push(rowArray);
        }
        return grid;
    }

    function onCellClick(event) {
        const col = event.target.dataset.col;
        const emptyRow = findEmptyRow(col);

        if (emptyRow !== -1) {
            grid[emptyRow][col] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row="${emptyRow}"][data-col="${col}"]`);
            cell.classList.add(currentPlayer);

            placeSound.play();

            if (checkWin(emptyRow, col)) {
                message.innerHTML = `${currentPlayer === "red" ? player1 : player2} wins!`;
                removeClickListeners();
            } else if (isDraw()) {
                message.textContent = "It's a draw!";
                removeClickListeners();
            } else {
                currentPlayer = currentPlayer === "red" ? "yellow" : "red";
                message.innerHTML = `${currentPlayer === "red" ? player1 : player2}'s turn!`;
            }
        }
    }

    function findEmptyRow(col) {
        for (let row = rows - 1; row >= 0; row--) {
            if (grid[row][col] === null) {
                return row;
            }
        }
        return -1;
    }

    function checkWin(row, col) {
        return checkDirection(row, col, 1, 0) || 
               checkDirection(row, col, 0, 1) || 
               checkDirection(row, col, 1, 1) ||
               checkDirection(row, col, 1, -1);  
    }

    function checkDirection(row, col, rowDir, colDir) {
        let count = 0;
        let r = row;
        let c = col;

        while (isInBounds(r, c) && grid[r][c] === currentPlayer) {
            count++;
            r += rowDir;
            c += colDir;
        }

        r = row - rowDir;
        c = col - colDir;

        while (isInBounds(r, c) && grid[r][c] === currentPlayer) {
            count++;
            r -= rowDir;
            c -= colDir;
        }

        return count >= 4;
    }

    function isInBounds(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < columns;
    }

    function isDraw() {
        return grid.every(row => row.every(cell => cell !== null));
    }

    function removeClickListeners() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.removeEventListener("click", onCellClick));
    }

    restartButton.addEventListener("click", () => {
        board.innerHTML = "";
        grid = createGrid(columns, rows); 
        currentPlayer = "red";
        message.innerHTML = `${player1}'s turn!`;
    });

    startGameButton.addEventListener("click", () => {
        const player1Name = document.getElementById("player1-name").value;
        const player2Name = document.getElementById("player2-name").value;

        player1 = player1Name ? player1Name : "Player 1";
        player2 = player2Name ? player2Name : "Player 2";

        nameForm.style.display = "none";
        gameBoard.style.display = "block";

        message.innerHTML = `${player1}'s turn!`;
    });

    createGrid(columns, rows);
});
