const NUMBER_OF_CELLS = 9
const EMPTY_CELL = ""
const NOT_AI = ""

// game dynamics variables
let g_isGameActive = true
let g_currentPlayerSymbol = "X"
let g_AIsymbol = NOT_AI
const g_gameState = new Array(NUMBER_OF_CELLS).fill(EMPTY_CELL)

// cell index combinations that result in a win
const g_winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// a randomized array that holds the next positions for the AI to play
let g_AImovesArr = null

// status display element
const g_statusDisplay = document.querySelector('.game--status')

// game status messages
const winningMessage = () => `Player ${g_currentPlayerSymbol} has won!`
const drawMessage = () => `Game ended in a draw!`
const currentPlayerTurn = () => `It's ${g_currentPlayerSymbol}'s turn`

initGame()

// #############################################################################

function initGame() {
    g_currentPlayerSymbol = "X"
    g_isGameActive = true
    displayStatus(currentPlayerTurn())

    let isAgainstAI = checkGameMode()

    if ("N" === isAgainstAI) {
        g_AIsymbol = NOT_AI
        return
    }

    g_AImovesArr = getRandUniqueArray(0, NUMBER_OF_CELLS - 1)

    if ("X" === checkPlayerSymbol()) {
        g_AIsymbol = "O"
    }
    else {
        g_AIsymbol = "X"
        playAI()
    }
}

function checkGameMode() {
    let isAgainstAI = ""

    do {
        isAgainstAI =
            prompt("Play against the computer? Y for yes, N for no").toUpperCase()
    } while ("Y" !== isAgainstAI && "N" !== isAgainstAI)

    return isAgainstAI
}

function checkPlayerSymbol() {
    let playerSymbol = ""

    do {
        playerSymbol = prompt("Choose your symbol, X or O").toUpperCase()
    } while ("X" !== playerSymbol && "O" !== playerSymbol)

    return playerSymbol
}

function playAI() {
    const EMPTY_CELL = ""
    
    // get a random unoccupied cell
    let emptyCellIndex = -1
    for (let i = 0; i < g_gameState.length; i++) {
        if (EMPTY_CELL === g_gameState[g_AImovesArr[i]]) {
            emptyCellIndex = g_AImovesArr[i]
            break
        }
    }

    occupyCell(document.querySelector(`[data-cell-index="${emptyCellIndex}"]`),
        emptyCellIndex)
}

function occupyCell(clickedCellElement, clickedCellIndex) {
    markOccupied(clickedCellElement, clickedCellIndex)
    checkMatchOver()
}

function markOccupied(clickedCellElement, clickedCellIndex) {
    g_gameState[clickedCellIndex] = g_currentPlayerSymbol
    clickedCellElement.innerHTML = g_currentPlayerSymbol
}

function checkMatchOver() {
    if (checkWin()) {
        displayStatus(winningMessage())
        g_isGameActive = false
        return
    }

    if (checkDraw()) {
        displayStatus(drawMessage())
        g_isGameActive = false
        return
    }

    changePlayer()
}

function checkWin() {
    let isWin = false

    for (let i = 0; i < g_winningCombinations.length; i++) {
        let currWinngingCombination = g_winningCombinations[i]

        // cells to check the player symbols for a win 
        let a = g_gameState[currWinngingCombination[0]]
        let b = g_gameState[currWinngingCombination[1]]
        let c = g_gameState[currWinngingCombination[2]]

        if (a === b && b === c) {
            if (EMPTY_CELL === a) {
                continue
            }

            isWin = true
            break
        }
    }

    return isWin
}

function checkDraw() {
    return !g_gameState.includes(EMPTY_CELL)
}

function changePlayer() {
    g_currentPlayerSymbol = g_currentPlayerSymbol === "X" ? "O" : "X"
    displayStatus(currentPlayerTurn())
}

function handleCellClick(clickedCellEvent) {
    const clickedCellElement = clickedCellEvent.target
    const clickedCellIndex =
        parseInt(clickedCellElement.getAttribute('data-cell-index'))

    checkLegalMove(clickedCellElement, clickedCellIndex)
}

function checkLegalMove(clickedCell, clickedCellIndex) {
    if (!g_isGameActive) {
        alert("The game is over, restart to play a new game")
        return
    }

    if (EMPTY_CELL !== g_gameState[clickedCellIndex]) {
        alert("This cell is already taken")
        return
    }

    occupyCell(clickedCell, clickedCellIndex)

    // check if against AI && game is active
    if (NOT_AI !== g_AIsymbol && g_isGameActive) {
        playAI()
    }
}

function restartGame() {
    clearBoard()
    initGame()
}
function clearBoard() {
    g_gameState.fill(EMPTY_CELL)
    document.querySelectorAll('.cell').forEach(cell => 
        cell.innerHTML = EMPTY_CELL)
}

function displayStatus(status) {
    g_statusDisplay.innerHTML = status
}

// ########################## button event listeners ###########################

document.querySelectorAll('.cell').forEach(cell =>
    cell.addEventListener('click', handleCellClick))
document.querySelector('.game--restart').addEventListener('click', restartGame)

// ############################# utility functions #############################

function getRandUniqueArray(min, max) {
    const len = max - min + 1
    const arr = new Array(0)

    for (let i = 0; i < len; ) {
        const randNum = getRandInteger(min, max)

        if (true !== arr.includes(randNum)) {
            arr.push(randNum)
            i++
        }
    }

    return arr
}

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}