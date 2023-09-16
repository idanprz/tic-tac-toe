// status display element
const statusDisplay = document.querySelector('.game--status')

// game dynamics variables
let isGameActive = true
let currentPlayer = "X"
const gameState = new Array(9).fill("")

// game messages
const winningMessage = () => `Player ${currentPlayer} has won!`
const drawMessage = () => `Game ended in a draw!`
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`

// cell index combinations from which a win can occur
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

statusDisplay.innerHTML = currentPlayerTurn()

function occupyCell(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer
    clickedCell.innerHTML = currentPlayer
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X"
    statusDisplay.innerHTML = currentPlayerTurn()
}

function checkMatchOver() {
    if (checkWin()) {
        statusDisplay.innerHTML = winningMessage()
        isGameActive = false
        return
    }

    if (checkDraw()) {
        statusDisplay.innerHTML = drawMessage()
        isGameActive = false
        return
    }

    changePlayer()
}

function checkWin() {
    let isWin = false

    for (let i = 0; i < winningCombinations.length; i++) {
        const currWinngingCombination = winningCombinations[i]

        // cells to check the player symbols for a win 
        let a = gameState[currWinngingCombination[0]]
        let b = gameState[currWinngingCombination[1]]
        let c = gameState[currWinngingCombination[2]]

        if (a === b && b === c) {
            if (a === '') {
                continue
            }

            isWin = true
            break
        }
    }

    return isWin
}

function checkDraw() {
    return !gameState.includes("")
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'))

    if (!isGameActive) {
        alert("The game is over, restart to play a new game")
        return
    }
    
    if (gameState[clickedCellIndex] !== "") {
        alert("This cell is already taken")
        return
    }

    occupyCell(clickedCell, clickedCellIndex)
    checkMatchOver()
}

function restartGame() {
    isGameActive = true
    currentPlayer = "X"
    statusDisplay.innerHTML = currentPlayerTurn()
    gameState.fill("")
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "")
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick))
document.querySelector('.game--restart').addEventListener('click', restartGame)