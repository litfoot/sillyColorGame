let currentColor;

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function newColor() {
    currentColor = getRandomColor();
    document.getElementById('color-box').style.backgroundColor = currentColor;
    document.getElementById('message').textContent = '';
}

function checkGuess() {
    const guess = document.getElementById('guess').value.toUpperCase();
    if (guess === currentColor) {
        document.getElementById('message').textContent = 'Correct!';
    } else {
        document.getElementById('message').textContent = `Wrong! The correct color was ${currentColor}`;
    }
    newColor();
}

document.addEventListener('DOMContentLoaded', newColor);
