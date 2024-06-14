document.addEventListener('DOMContentLoaded', function () {
    const targetColorDisplay = document.getElementById('target-color');
    const guessColorDisplay = document.getElementById('guess-color');

    // Function to generate a random hex color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Set the target color
    const targetColor = getRandomColor();
    targetColorDisplay.style.backgroundColor = targetColor;

    // Function to update the guessed color
// Function to update the guessed color
window.submitGuess = function () {
    let userColor = document.getElementById('color-input').value;
    if (!userColor.startsWith('#')) {
        userColor = '#' + userColor;
    }
    userColor = userColor.toUpperCase();

    // Validate the user's input
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(userColor)) {
        alert('Invalid input. 6 Digits, 0-9 and A-F.');
        return;
    }

    guessColorDisplay.style.backgroundColor = userColor;

    // Add the guess to the list of previous guesses
    const guessList = document.getElementById('guess-list');
    const listItem = document.createElement('li');
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';
    const colorBox = document.createElement('span');
    colorBox.style.backgroundColor = userColor;
    colorBox.className = 'guess-color-box';
    listItem.appendChild(colorBox);
    listItem.appendChild(document.createTextNode(userColor));
    guessList.appendChild(listItem);

    // Check if the user's guess matches the target color
    if (userColor === targetColor) {
        alert('Congratulations!');
    }

    document.getElementById('color-input').value = '';
}

    // Add 'Enter' keypress event listener to the color input field
    document.getElementById('color-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });
});