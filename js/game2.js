function initializeGame() {
    let difficulty = document.getElementById('difficulty').value;
    let grid = initializeGrid(difficulty);
    displayGrid(grid);
}

// Initialize the game when the page loads
window.onload = initializeGame;

// Function to generate a random color
function generateColor() {
    let r = Math.floor(Math.random() * 206) + 50; // 50 to 255
    let g = Math.floor(Math.random() * 206) + 50; // 50 to 255
    let b = Math.floor(Math.random() * 206) + 50; // 50 to 255
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to generate a color gradient between two colors
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


// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
    let colorComponents1 = color1.match(/\d+/g).map(Number);
    let colorComponents2 = color2.match(/\d+/g).map(Number);
    let r = colorComponents1[0] + factor * (colorComponents2[0] - colorComponents1[0]);
    let g = colorComponents1[1] + factor * (colorComponents2[1] - colorComponents1[1]);
    let b = colorComponents1[2] + factor * (colorComponents2[2] - colorComponents1[2]);
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Function to initialize the game grid
function initializeGrid(gridSize) {
    let color1 = generateColor();
    let color2 = 'rgb(255, 255, 255)'; // White
    let color3 = 'rgb(0, 0, 0)'; // Black
    let color4 = generateColor();

    let grid = [];
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            let factor1 = i / (gridSize - 1);
            let factor2 = j / (gridSize - 1);
            let colorTop = interpolateColor(color1, color2, factor2);
            let colorBottom = interpolateColor(color3, color4, factor2);
            let color = interpolateColor(colorTop, colorBottom, factor1);
            row.push(color);
        }
        grid.push(row);
    }

    // Shuffle the grid
    // for (let i = 0; i < gridSize; i++) {
    //     for (let j = 0; j < gridSize; j++) {
    //         // Skip if the current piece is a corner piece
    //         if ((i == 0 && j == 0) || (i == gridSize - 1 && j == gridSize - 1) || (i == 0 && j == gridSize - 1) || (i == gridSize - 1 && j == 0)) {
    //             continue;
    //         }

    //         let i2, j2;
    //         do {
    //             i2 = Math.floor(Math.random() * gridSize);
    //             j2 = Math.floor(Math.random() * gridSize);
    //         } while ((i2 == 0 && j2 == 0) || (i2 == gridSize - 1 && j2 == gridSize - 1) || (i2 == 0 && j2 == gridSize - 1) || (i2 == gridSize - 1 && j2 == 0)); // Repeat until a non-corner piece is selected

    //         let temp = grid[i][j];
    //         grid[i][j] = grid[i2][j2];
    //         grid[i2][j2] = temp;
    //     }
    // }

    return grid;
}

// Initialize the game grid
let gridSize = 10; // Change this to change the difficulty
let grid = initializeGrid(gridSize);

// Function to convert RGB color to grayscale
function rgbToGrayscale(rgb) {
    let components = rgb.match(/\d+/g).map(Number);
    return 0.299 * components[0] + 0.587 * components[1] + 0.114 * components[2];
}

// Function to check if the game is won
function checkWin(grid) {
    let grayscaleGrid = grid.map(row => row.map(rgbToGrayscale));
    for (let i = 0; i < grayscaleGrid.length - 1; i++) {
        for (let j = 0; j < grayscaleGrid[i].length - 1; j++) {
            if (grayscaleGrid[i][j] > grayscaleGrid[i][j + 1] || grayscaleGrid[i][j] > grayscaleGrid[i + 1][j]) {
                return false;
            }
        }
        // Check if the last cell in the current row is greater than the first cell in the next row
        if (grayscaleGrid[i][grayscaleGrid[i].length - 1] > grayscaleGrid[i + 1][0]) {
            return false;
        }
    }
    // Check if the grayscale values in the last row are sorted in ascending order
    for (let j = 0; j < grayscaleGrid[grayscaleGrid.length - 1].length - 1; j++) {
        if (grayscaleGrid[grayscaleGrid.length - 1][j] > grayscaleGrid[grayscaleGrid.length - 1][j + 1]) {
            return false;
        }
    }
    return true;
}



// Function to display the grid on the webpage
function displayGrid(grid) {
    let gridElement = document.getElementById('game-grid');
    gridElement.innerHTML = ''; // Clear the existing grid

    let selectedCell = null;

    let table = document.createElement('table');
    for (let i = 0; i < grid.length; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < grid[i].length; j++) {
            let cell = document.createElement('td');
            cell.style.backgroundColor = grid[i][j];
            cell.addEventListener('click', function () {
                // If a cell is already selected, swap the colors
                if (selectedCell) {
                    let tempColor = selectedCell.style.backgroundColor;
                    selectedCell.style.backgroundColor = cell.style.backgroundColor;
                    cell.style.backgroundColor = tempColor;

                    // Update the colors in the grid
                    let tempColorGrid = grid[selectedCell.dataset.i][selectedCell.dataset.j];
                    grid[selectedCell.dataset.i][selectedCell.dataset.j] = grid[i][j];
                    grid[i][j] = tempColorGrid;

                    // Remove the highlight from the previously selected cell
                    // selectedCell.classList.remove('selected');
                    // selectedCell = null;
                    // changes
                    selectedCell.style.boxShadow = '';
                    selectedCell = null;
                    if (checkWin(grid)) {
                        alert('You win!');
                    }
                } else {
                    // Highlight the selected cell
                    // cell.classList.add('selected');
                    // selectedCell = cell;
                    //changed
                    cell.style.boxShadow = '0 0 10px 3px #FFD700';
                    selectedCell = cell;
                }
            });
            cell.dataset.i = i;
            cell.dataset.j = j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    gridElement.appendChild(table);
}

// Add some CSS to highlight the selected cell
let style = document.createElement('style');
style.innerHTML = ``;
document.head.appendChild(style);

// Display the grid on the webpage
displayGrid(grid);