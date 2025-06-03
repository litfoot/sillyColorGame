// Function to convert hexadecimal color to RGB format
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to generate a random color
function generateColor() {
    let r = Math.floor(Math.random() * 206) + 50; // 50 to 255
    let g = Math.floor(Math.random() * 206) + 50; // 50 to 255
    let b = Math.floor(Math.random() * 206) + 50; // 50 to 255
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
    let colorComponents1 = color1.match(/\d+/g).map(Number);
    let colorComponents2 = color2.match(/\d+/g).map(Number);
    let r = colorComponents1[0] + factor * (colorComponents2[0] - colorComponents1[0]);
    let g = colorComponents1[1] + factor * (colorComponents2[1] - colorComponents1[1]);
    let b = colorComponents1[2] + factor * (colorComponents2[2] - colorComponents1[2]);
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// (Optional) Function to generate a color gradient between two colors
// Not used in win-check logic, but retained in case you need it elsewhere.
function generateGradient(color1, color2, steps) {
    let gradient = [];
    let color1Components = color1.match(/\d+/g).map(Number);
    let color2Components = color2.match(/\d+/g).map(Number);

    for (let step = 0; step < steps; step++) {
        let r = color1Components[0] + (color2Components[0] - color1Components[0]) * (step / steps);
        let g = color1Components[1] + (color2Components[1] - color1Components[1]) * (step / steps);
        let b = color1Components[2] + (color2Components[2] - color1Components[2]) * (step / steps);
        gradient.push(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
    }

    return gradient;
}

// Global variables to hold the solved pattern (targetGrid) and the current shuffled pattern (currentGrid)
let targetGrid = [];
let currentGrid = [];

// Build a “pure” solved gradient, no shuffling.
// Takes the same parameters as initializeGrid would, but does NOT shuffle.
function buildSortedGrid(gridSize, color1, color4) {
    let grid = [];
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            let factor1 = i / (gridSize - 1);
            let factor2 = j / (gridSize - 1);

            // Top edge goes from color1 → white
            let colorTop = interpolateColor(color1, 'rgb(255,255,255)', factor2);
            // Bottom edge goes from black → color4
            let colorBottom = interpolateColor('rgb(0,0,0)', color4, factor2);
            // Interpolate vertically between those two
            let finalColor = interpolateColor(colorTop, colorBottom, factor1);

            row.push(finalColor);
        }
        grid.push(row);
    }
    return grid;
}

// Function to initialize the game: builds the target grid, shuffles a copy, and displays it.
function initializeGame() {
    let gridSizeInput = document.getElementById('difficulty').value;
    let gridSize = parseInt(gridSizeInput, 10);

    let color1Hex = document.getElementById('color1').value;
    let color4Hex = document.getElementById('color4').value;

    // Convert or generate color1
    if (color1Hex === '#000000') {
        color1Hex = generateColor();
    } else {
        color1Hex = hexToRgb(color1Hex);
    }

    // Convert or generate color4
    if (color4Hex === '#000000') {
        color4Hex = generateColor();
    } else {
        color4Hex = hexToRgb(color4Hex);
    }

    console.log(`color1Input: ${color1Hex}, color4Input: ${color4Hex}, gridSize: ${gridSize}`);

    // 1) Build & store the perfect, unshuffled gradient
    targetGrid = buildSortedGrid(gridSize, color1Hex, color4Hex);

    // 2) Make a deep copy to shuffle for the player
    currentGrid = targetGrid.map(row => row.slice());

    // 3) Shuffle only non-corner cells in place
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Skip corners
            if ((i === 0 && j === 0) ||
                (i === 0 && j === gridSize - 1) ||
                (i === gridSize - 1 && j === 0) ||
                (i === gridSize - 1 && j === gridSize - 1)) {
                continue;
            }

            let i2, j2;
            do {
                i2 = Math.floor(Math.random() * gridSize);
                j2 = Math.floor(Math.random() * gridSize);
            } while (
                (i2 === 0 && j2 === 0) ||
                (i2 === 0 && j2 === gridSize - 1) ||
                (i2 === gridSize - 1 && j2 === 0) ||
                (i2 === gridSize - 1 && j2 === gridSize - 1)
            );

            // Swap currentGrid[i][j] <-> currentGrid[i2][j2]
            let tmp = currentGrid[i][j];
            currentGrid[i][j] = currentGrid[i2][j2];
            currentGrid[i2][j2] = tmp;
        }
    }

    // 4) Render the shuffled grid
    displayGrid(currentGrid);
}

// Function to check if the game is won: compares currentGrid to targetGrid element-wise
function checkWin(grid) {
    let n = grid.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] !== targetGrid[i][j]) {
                return false;
            }
        }
    }
    return true;
}

// Function to display the grid on the webpage and set up click/swapping behavior
function displayGrid(grid) {
    let gridElement = document.getElementById('game-grid');
    gridElement.innerHTML = ''; // Clear any existing cells

    let selectedCell = null;

    let table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    for (let i = 0; i < grid.length; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < grid[i].length; j++) {
            let td = document.createElement('td');
            td.style.backgroundColor = grid[i][j];
            td.style.width = '30px';
            td.style.height = '30px';
            td.style.cursor = 'pointer';
            td.dataset.i = i;
            td.dataset.j = j;

            td.addEventListener('click', function () {
                let row = parseInt(this.dataset.i, 10);
                let col = parseInt(this.dataset.j, 10);

                // If clicked cell is a corner, ignore
                if ((row === 0 && col === 0) ||
                    (row === 0 && col === grid.length - 1) ||
                    (row === grid.length - 1 && col === 0) ||
                    (row === grid.length - 1 && col === grid.length - 1)) {
                    return;
                }

                if (selectedCell) {
                    // Swap the two selected cells
                    let prevRow = parseInt(selectedCell.dataset.i, 10);
                    let prevCol = parseInt(selectedCell.dataset.j, 10);

                    // Swap colors in DOM
                    let prevColor = selectedCell.style.backgroundColor;
                    selectedCell.style.backgroundColor = this.style.backgroundColor;
                    this.style.backgroundColor = prevColor;

                    // Update currentGrid array
                    let tempColorGrid = currentGrid[prevRow][prevCol];
                    currentGrid[prevRow][prevCol] = currentGrid[row][col];
                    currentGrid[row][col] = tempColorGrid;

                    // Remove highlight from previous cell
                    selectedCell.style.boxShadow = '';
                    selectedCell = null;

                    // Check for win after swap
                    if (checkWin(currentGrid)) {
                        alert('You win!');
                    }
                } else {
                    // Highlight this cell as selected
                    this.style.boxShadow = '0 0 10px 3px #FFD700';
                    selectedCell = this;
                }
            });

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    gridElement.appendChild(table);
}

// Set up window.onload to initialize the game and hook the win-button
window.onload = function () {
    // Initialize the game grid and display it
    initializeGame();

    // Hook up the win animation button (if it exists)
    let winButton = document.getElementById('win-button');
    let winMessage = document.getElementById('win-message');
    if (winButton && winMessage) {
        winButton.addEventListener('click', function () {
            winButton.textContent = 'You won!';
            winMessage.textContent = 'Congratulations, you won the game!';
            winMessage.style.fontSize = '2em';
            winMessage.style.color = 'green';

            let opacity = 0;
            let direction = 1;
            setInterval(function () {
                opacity += direction * 0.05;
                if (opacity <= 0 || opacity >= 1) {
                    direction *= -1;
                }
                winMessage.style.opacity = opacity;
            }, 50);
        });
    }
};

// (Optional) Add CSS rules if you want custom styling for selected cells, etc.
// Currently left empty, but you can add rules as needed.
let style = document.createElement('style');
style.innerHTML = ``;
document.head.appendChild(style);
