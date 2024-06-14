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

// Function to initialize the game grid
function initializeGrid(gridSize) {
    let color1 = generateColor();
    let color4 = generateColor();
    let color3 = "rgb(255, 255, 255)";
    let color2 = "rgb(0, 0, 0)";

    let gradient1 = generateGradient(color1, color2, gridSize);
    let gradient2 = generateGradient(color3, color4, gridSize);

    let grid = [];
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            let color = j < gridSize / 2 ? gradient1[i] : gradient2[i];
            row.push(color);
        }
        grid.push(row);
    }

    // Shuffle the grid
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let i2 = Math.floor(Math.random() * gridSize);
            let j2 = Math.floor(Math.random() * gridSize);
            let temp = grid[i][j];
            grid[i][j] = grid[i2][j2];
            grid[i2][j2] = temp;
        }
    }

    return grid;
}

// Initialize the game grid
let gridSize = 10; // Change this to change the difficulty
let grid = initializeGrid(gridSize);

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
            cell.addEventListener('click', function() {
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
                    selectedCell.classList.remove('selected');
                    selectedCell = null;
                } else {
                    // Highlight the selected cell
                    cell.classList.add('selected');
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
style.innerHTML = `
  .selected {
    border: 2px solid yellow;
  }
`;
document.head.appendChild(style);

// Display the grid on the webpage
displayGrid(grid);