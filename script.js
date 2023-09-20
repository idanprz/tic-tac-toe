const NUMBER_OF_CELLS = 9
const EMPTY_CELL = ""
const PLAYER_VS_PLAYER_MATCH = ""

// game dynamics variables
let g_isGameActive = true
let g_currentPlayer = "X"
let g_AIsymbol = PLAYER_VS_PLAYER_MATCH
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

// status display element
const g_statusDisplay = document.querySelector('.game--status')

// game status messages
const winningMessage = () => `Player ${g_currentPlayer} has won!`
const drawMessage = () => `Game ended in a draw!`
const currentPlayerTurn = () => `It's ${g_currentPlayer}'s turn`

initGame()

// #############################################################################

function initGame() {
    g_currentPlayer = "X"
    g_isGameActive = true
    displayStatus(currentPlayerTurn())

    let isAgainstAI = checkGameMode()

    if ("N" === isAgainstAI) {
        g_AIsymbol = PLAYER_VS_PLAYER_MATCH
        return
    }

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
    } while ("Y" != isAgainstAI && "N" != isAgainstAI)

    return isAgainstAI
}

function checkPlayerSymbol() {
    let playerSymbol = ""

    do {
        playerSymbol = prompt("Choose your symbol, X or O").toUpperCase()
    } while ("X" != playerSymbol && "O" != playerSymbol)

    return playerSymbol
}

function playAI() {
    // get random unoccupied cell
    let randArr = [5, 7, 2, 6, 3, 1, 0, 8, 4] // TODO randomize array
    let unoccupiedCellIndex = -1

    for (let i = 0; i < g_gameState.length; i++) {
        if (EMPTY_CELL == g_gameState[randArr[i]]) {
            unoccupiedCellIndex = randArr[i]
            break
        }
    }

    makeMove(document.querySelector(`[data-cell-index="${unoccupiedCellIndex}"]`),
        unoccupiedCellIndex)
}

function makeMove(clickedCell, clickedCellIndex) {
    occupyCell(clickedCell, clickedCellIndex)
    checkMatchOver()
}

function occupyCell(clickedCell, clickedCellIndex) {
    g_gameState[clickedCellIndex] = g_currentPlayer
    clickedCell.innerHTML = g_currentPlayer
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
    g_currentPlayer = g_currentPlayer === "X" ? "O" : "X"
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

    makeMove(clickedCell, clickedCellIndex)

    if (PLAYER_VS_PLAYER_MATCH !== g_AIsymbol && g_isGameActive) {
        playAI()
    }
}

function restartGame() {
    clearBoard()
    initGame()
}
function clearBoard() {
    g_gameState.fill(EMPTY_CELL)
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = EMPTY_CELL)
}

function displayStatus(status) {
    g_statusDisplay.innerHTML = status
}

// button event listeners
document.querySelectorAll('.cell').forEach(cell =>
    cell.addEventListener('click', handleCellClick))
document.querySelector('.game--restart').addEventListener('click', restartGame)