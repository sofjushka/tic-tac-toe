const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const container = document.getElementById('fieldWrapper');
let currentPlayer = CROSS;
let frozen = false;
let isAIGame = true;
let field;
let freeCells;

startGame();
addResetListener();

function startGame() {
    let input = +document.getElementById('input').value;
    let checkBox = document.getElementById('check1').value === 'on' ? 1: 0;
    console.log(checkBox);
    renderGrid(input);
    initField(input, checkBox);
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function initField(dimension, checkBox) {
    freeCells = dimension * dimension;
    field = Array.from({ length: dimension }, () => Array(dimension).fill(-1));
    isAIGame = checkBox;
}


function cellClickHandler(row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (!isValidElement(row, col)) return;
    renderSymbolInCell(currentPlayer, row, col);
    if (checkWin(currentPlayer)) {
        frozen = true;
        alert(`Победил ${currentPlayer}`)
    }    
    changePlayer();
    freeCells--;
    if (freeCells == 0)
        alert('Победила дружба');
}

function checkWin(player) {
    let boardSize = field.length;
    for (let i = 0; i < boardSize; i++) {
        let win = true;
        for (let j = 0; j < boardSize; j++) {
            if (field[i][j] !== player) {
                win = false;
                break;
            }
        }
        if (win) {
            highlightWinningCells('row', i);
            return true;
        }
    }
    for (let j = 0; j < boardSize; j++) {
        let win = true;
        for (let i = 0; i < boardSize; i++) {
            if (field[i][j] !== player) {
                win = false;
                break;
            }
        }
        if (win) {
            highlightWinningCells('col', j);
            return true;
        }
    }
    let win = true;
    for (let i = 0; i < boardSize; i++) {
        if (field[i][i] !== player) {
            win = false;
            break;
        }
    }
    if (win) {
        highlightWinningCells('diag', 0);
        return true;
    }
    win = true;
    for (let i = 0; i < boardSize; i++) {
        if (field[i][boardSize - 1 - i] !== player) {
            win = false;
            break;
        }
    }
    if (win) {
        highlightWinningCells('diag', 1);
        return true;
    }
    return false;
}

function highlightWinningCells(axis, index){
    dimension = field.length;
    switch(axis)
    {
        case 'col':
            for (let i = 0; i < dimension; i++){
                renderSymbolInCell(currentPlayer, i, index, "#f00000aa")
            }
            break;
        case 'row':
            for (let i = 0; i < dimension; i++){
                renderSymbolInCell(currentPlayer, index, i, "#f00000aa")
            }
            break;
        case 'diag':
            for (let i = 0; i < dimension; i++){
                renderSymbolInCell(currentPlayer, i, index == 0 ? i : dimension - i - 1, "#f00000aa")
            }
            break;      
    }
}

function isValidElement(row, col){
    if (frozen){
        return false;
    }
    if (field[row][col] !== -1) return false;
    return true;
}

function changePlayer() {
    if (currentPlayer === ZERO)
        currentPlayer = CROSS
    else {
        currentPlayer = ZERO
        if (isAIGame)
            makeAiMove();
    }    
}

function makeAiMove(){
    let dimension = field.length;
    let cell = getRandomInt(freeCells);
    for (let i = 0; i < dimension; i++)
        for (let j = 0; j < dimension; j++)
        {
            if (field[i][j] == -1){
                cell--;
            };
            if (cell === 0) {
                cellClickHandler(i, j);
                return;
            }
        }
}

function getRandomInt(n) {
    return Math.floor(Math.random() * n) + 1;
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    field[row][col] = symbol;
    console.log(field);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    console.log('reset!');
    currentPlayer = CROSS;
    frozen = false;
    startGame();
    addResetListener();
}


/* Test Function */
/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
