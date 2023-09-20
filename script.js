const NUMBER_OF_CELLS = 9
const EMPTY = ""

// status display element
const statusDisplay = document.querySelector('.game--status')

// game dynamics variables
// initGame()
let isGameActive = true
let currentPlayer = "X"
let AIsymbol = ""
const gameState = new Array(NUMBER_OF_CELLS).fill("")
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

// function init game (replace restart function), choose ai or not, if AI choose x or o
// if AI is X make first move and wait for click

// game messages
const winningMessage = () => `Player ${currentPlayer} has won!`
const drawMessage = () => `Game ended in a draw!`
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`

initGame()

statusDisplay.innerHTML = currentPlayerTurn()

function occupyCell(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer
    // console.log(clickedCell);
    // console.log(clickedCell.innerHTML);
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
        let currWinngingCombination = winningCombinations[i]

        // cells to check the player symbols for a win 
        let a = gameState[currWinngingCombination[0]]
        let b = gameState[currWinngingCombination[1]]
        let c = gameState[currWinngingCombination[2]]

        if (a === b && b === c) {
            if (EMPTY === a) {
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
    // console.log(clickedCell)
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'))

    checkLegalMove(clickedCell, clickedCellIndex)
}

function checkLegalMove(clickedCell, clickedCellIndex) {
    // const clickedCell = clickedCellEvent.target
    // const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'))

    if (!isGameActive) {
        alert("The game is over, restart to play a new game")
        return
    }

    if ("" !== gameState[clickedCellIndex]) {
        alert("This cell is already taken")
        return
    }

    makeMove(clickedCell, clickedCellIndex)


    if ("" !== AIsymbol && isGameActive) {
        playAI()
    }
}

function playAI() {
    // get random unoccupied cell
    let randArr = [5, 7, 2, 6, 3, 1, 0, 8, 4]
    let unoccupiedCellIndex = -1

    for (let i = 0; i < gameState.length; i++) {
        if ("" == gameState[randArr[i]]) {
            unoccupiedCellIndex = randArr[i]
            break
        }
    }

    makeMove(document.querySelector(`[data-cell-index="${unoccupiedCellIndex}"]`), unoccupiedCellIndex)
}

function makeMove(clickedCell, clickedCellIndex) {
    occupyCell(clickedCell, clickedCellIndex)
    checkMatchOver()
    // changePlayer()
}

function restartGame() {
    currentPlayer = "X"
    isGameActive = true
    statusDisplay.innerHTML = currentPlayerTurn() // TODO displayPlayerTurn()
    // TODO clearBoard()
    gameState.fill("")
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "")
    initGame()
}

function initGame() {
    let isAgainstAI = ""
    // TODO checkGameMode()
    do {
        isAgainstAI = prompt("Play against the computer? Y for yes, N for no").toUpperCase()
    } while ("Y" != isAgainstAI && "N" != isAgainstAI);

    if ("N" === isAgainstAI) {
        AIsymbol = ""
        return
    }

    // TODO checkPlayerSymbol()
    let playerSymbol = ""

    do {
        playerSymbol = prompt("Choose your symbol, X or O").toUpperCase()
    } while ("X" != playerSymbol && "O" != playerSymbol);

    if ("X" === playerSymbol) {
        AIsymbol = "O"
        return
    }
    
    AIsymbol = "X"
    playAI()
}

function checkGameMode(params) {
    
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick))
document.querySelector('.game--restart').addEventListener('click', restartGame)