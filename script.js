document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const rollButton = document.getElementById('roll-button');
    const playerTurnDisplay = document.getElementById('player-turn');
    const diceElement = document.getElementById('dice');

    const players = [
        { id: 1, element: document.getElementById('player1'), position: 1 },
        { id: 2, element: document.getElementById('player2'), position: 1 }
    ];

    const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
    const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

    let currentPlayerIndex = 0;
    let isRolling = false;

    function createBoard() {
        for (let i = 100; i >= 1; i--) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.number = i;
            cell.textContent = i;
            board.appendChild(cell);

            if (snakes[i]) {
                const snakeImg = document.createElement('img');
                snakeImg.src = 'https://www.iconsdb.com/icons/preview/red/snake-2-xxl.png';
                snakeImg.classList.add('snake');
                cell.appendChild(snakeImg);
            } else if (ladders[i]) {
                const ladderImg = document.createElement('img');
                ladderImg.src = 'https://www.iconsdb.com/icons/preview/green/ladder-xxl.png';
                ladderImg.classList.add('ladder');
                cell.appendChild(ladderImg);
            }
        }
        updatePlayerTurnDisplay();
        updatePlayerPositions();
    }

    function updatePlayerTurnDisplay() {
        playerTurnDisplay.textContent = `Player ${players[currentPlayerIndex].id}'s Turn`;
    }

    function updatePlayerPosition(player) {
        const cell = document.querySelector(`.cell[data-number='${player.position}']`);
        if (cell) {
            const rect = cell.getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            player.element.style.left = `${rect.left - boardRect.left + (rect.width / 4)}px`;
            player.element.style.top = `${rect.top - boardRect.top + (rect.height / 4)}px`;
        }
    }
    
    function updatePlayerPositions() {
        players.forEach(updatePlayerPosition);
    }

    function rollDice() {
        if (isRolling) return;
        isRolling = true;
        rollButton.disabled = true;

        const roll = Math.floor(Math.random() * 6) + 1;
        const rotations = {
            1: 'rotateX(0deg) rotateY(0deg)',
            2: 'rotateX(-90deg)',
            3: 'rotateY(90deg)',
            4: 'rotateY(-90deg)',
            5: 'rotateX(90deg)',
            6: 'rotateX(180deg)'
        };
        diceElement.style.transform = rotations[roll];

        setTimeout(() => {
            movePlayer(roll);
            isRolling = false;
            rollButton.disabled = false;
        }, 1500);
    }

    function movePlayer(steps) {
        const player = players[currentPlayerIndex];
        player.position += steps;

        if (player.position > 100) {
            player.position = 100;
        }

        updatePlayerPosition(player);

        setTimeout(() => {
            if (snakes[player.position]) {
                player.position = snakes[player.position];
                updatePlayerPosition(player);
            } else if (ladders[player.position]) {
                player.position = ladders[player.position];
                updatePlayerPosition(player);
            }

            if (player.position === 100) {
                alert(`Player ${player.id} wins!`);
                resetGame();
                return;
            }

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            updatePlayerTurnDisplay();
        }, 1000);
    }

    function resetGame() {
        players.forEach(p => p.position = 1);
        currentPlayerIndex = 0;
        updatePlayerPositions();
        updatePlayerTurnDisplay();
    }

    rollButton.addEventListener('click', rollDice);

    createBoard();
    window.addEventListener('resize', updatePlayerPositions);
});