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

    function colorDistance(color1, color2) {
        let r1 = parseInt(color1.substr(1, 2), 16);
        let g1 = parseInt(color1.substr(3, 2), 16);
        let b1 = parseInt(color1.substr(5, 2), 16);
        let r2 = parseInt(color2.substr(1, 2), 16);
        let g2 = parseInt(color2.substr(3, 2), 16);
        let b2 = parseInt(color2.substr(5, 2), 16);
        let dr = r1 - r2;
        let dg = g1 - g2;
        let db = b1 - b2;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    // Initialize the score
    let score = 0;


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

        // Calculate color distance
        let distance = colorDistance(userColor, targetColor);

        // Generate emoji feedback for each digit
        let feedback = '';
        for (let i = 1; i <= 6; i++) {
            if (userColor[i] === targetColor[i]) {
                feedback += '✅'; // Check emoji for correct digit
            } else if (userColor[i] < targetColor[i]) {
                feedback += '⬆️'; // Up arrow emoji for too low digit
            } else {
                feedback += '⬇️'; // Down arrow emoji for too high digit
            }
        }

        // Add the guess, the distance, and the feedback to the list of previous guesses
        const guessList = document.getElementById('guess-list');
        const listItem = document.createElement('li');
        listItem.style.display = 'flex';
        listItem.style.alignItems = 'center';
        const colorBox = document.createElement('span');
        colorBox.style.backgroundColor = userColor;
        colorBox.className = 'guess-color-box';
        listItem.appendChild(colorBox);
        listItem.appendChild(document.createTextNode(userColor + ' (Distance: ' + distance.toFixed(2) + ') ' + feedback));
        guessList.appendChild(listItem);

    // Check if the user's guess matches the target color
    if (userColor === targetColor) {
        alert('Congratulations!');
        score++; // Increase the score
        document.getElementById('score').textContent = 'Score: ' + score; // Update the score display
    }

        document.getElementById('color-input').value = '';

        // Update the color distance display
        document.getElementById('color-distance').textContent = 'Color distance: ' + distance.toFixed(2);
    }

    // Add 'Enter' keypress event listener to the color input field
    document.getElementById('color-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });
});