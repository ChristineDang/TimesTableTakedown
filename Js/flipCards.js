let start = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');
let cardContainer = document.getElementById('card-container');

let minute = 0;
let second = 0;
let count = 0;
let flippedCount = 0; // Counter for flipped cards
const totalCards = 24; // Total number of cards
let timer = false; // Timer state

// Multiplication problem generator
function generateProblems(numProblems) {
    cardContainer.innerHTML = ''; // Clear previous cards
    flippedCount = 0; // Reset the flipped count for new game

    for (let i = 0; i < numProblems; i++) {
        const num1 = Math.floor(Math.random() * 12) + 1;
        const num2 = Math.floor(Math.random() * 12) + 1;
        const answer = num1 * num2;

        // Create card elements
        const card = document.createElement('div');
        card.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = `${num1} x ${num2}`;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = `${answer}`;

        // Append elements to card
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);

        // Add a flipped state to the cardInner
        let isFlipped = false;

        // Add click event to flip the card
        cardInner.addEventListener('click', () => {
            if (!isFlipped) { // Check if the card is already flipped
                cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' ? '' : 'rotateY(180deg)';
                isFlipped = true; // Mark the card as flipped
                flippedCount++; // Increment the flipped count

                // Start the timer only on the first card click
                if (!timer) {
                    timer = true; // Set timer state to true
                    stopWatch(); // Start the timer
                }

                // Stop the timer if all cards have been flipped
                if (flippedCount === totalCards) {
                    timer = false; // Stop the timer
                }
            }
        });
    }
}

start.addEventListener('click', function () {
    timer = true;
    stopWatch();
});

stopBtn.addEventListener('click', function () {
    timer = false;
});

resetBtn.addEventListener('click', function () {
    timer = false;
    minute = 0;
    second = 0;
    count = 0;
    flippedCount = 0; // Reset flipped count
    // document.getElementById('min').innerHTML = "00";
    // document.getElementById('sec').innerHTML = "00";
    // document.getElementById('count').innerHTML = "00";
    generateProblems(24); // Generate new problems
});

generateProblems(24);

function stopWatch() {
    if (timer) {
        count++;

        if (count == 100) {
            second++;
            count = 0;
        }

        if (second == 60) {
            minute++;
            second = 0;
        }

        let minString = minute;
        let secString = second;
        let countString = count;

        if (minute < 10) {
            minString = "0" + minString;
        }

        if (second < 10) {
            secString = "0" + secString;
        }

        if (count < 10) {
            countString = "0" + countString;
        }

        // document.getElementById('min').innerHTML = minString;
        // document.getElementById('sec').innerHTML = secString;
        // document.getElementById('count').innerHTML = countString;
        setTimeout(stopWatch, 10);
    }
}
