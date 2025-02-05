// Variables
let startTime;
let currentQuestion;
let questionCount = 0;
let correctAnswers = 0;
let timerInterval;
let timerStarted = false; // Flag to track if timer has started
let questionElement = document.getElementById("question");
let answerElement = document.getElementById("answer");
let resultElement = document.getElementById("result");
let submitButton = document.getElementById("submit");
let resetButton = document.getElementById("reset"); // Reset button
let finalResultElement = document.getElementById("finalResult");
let timerElement = document.getElementById("timer");
let timerDisplay = document.getElementById("timerDisplay");
let showTimerCheckbox = document.getElementById("showTimer");

//confetti
function fire(ratio, opt) {
    confetti(Object.assign({}, opt, {
        origin: {y: .6},
        particleCount: Math.floor(800 *
            ratio)
    }));
}

// Function to generate a random multiplication question
function generateQuestion() {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    questionElement.textContent = `${num1} x ${num2} = ?`;
    return { num1, num2 };
}

// Start the test
function startTest() {
    currentQuestion = generateQuestion();
    questionCount = 0;
    correctAnswers = 0;
    resultElement.innerHTML = "";
    finalResultElement.innerHTML = "";
    timerDisplay.textContent = "60.00";  // Set timer to 60 seconds initially
    
    // Reset and hide timer initially
    if (showTimerCheckbox.checked) {
        timerElement.style.display = "block";  // Show the timer
    } else {
        timerElement.style.display = "none";  // Hide the timer
    }

    // Disable the reset button while the game is in progress
    resetButton.disabled = false;
}

// Start the countdown timer
function startTimer() {
    if (timerStarted) return; // Prevent starting the timer multiple times

    // Mark timer as started
    timerStarted = true;

    // Start the countdown from 60 seconds
    let timeLeft = 60;

    // Update the timer every 100 milliseconds
    timerInterval = setInterval(function() {
        // Update the display
        timerDisplay.textContent = timeLeft.toFixed(2);

        // Decrease the time by 0.1 second
        timeLeft -= 0.1;

        // Stop the timer once it reaches 0
        if (timeLeft <= 0) {
            clearInterval(timerInterval);  // Stop the timer
            endTest();  // End the test and show the final result
        }
    }, 100);  // Update every 100 milliseconds
}

// Handle the submit action
function submitAnswer() {
    let userAnswer = parseInt(answerElement.value, 10);
    let correctAnswer = currentQuestion.num1 * currentQuestion.num2;

    if (userAnswer === correctAnswer) {
        questionCount++;
        correctAnswers++;

        // If this is the first correct answer, start the timer
        if (!timerStarted) {
            startTimer();
        }

        // Show the result for this question
        resultElement.innerHTML = `Correct!`;

        // Generate new question and reset input
        currentQuestion = generateQuestion();
        answerElement.value = "";
    } else {
        // If answer is incorrect, prompt user to try again
        resultElement.innerHTML = "Oops! That's not the correct answer. Try again!";
    }
}

// End the test and show the result
function endTest() {
    finalResultElement.innerHTML = `Time's up! You answered ${correctAnswers} questions correctly in 1 minute.`;
    submitButton.disabled = true;  // Disable the submit button
    answerElement.disabled = true;  // Disable the answer input

    fire(.25, {
        spread: 30,
        startVelocity: 30
    });
    fire(.2, {spread: 30});
    fire(.35, {
        spread: 100,
        decay: .9,
        scalar: 1
    });
    fire(.1, {
        spread: 140,
        startVelocity: 15,
        decay: .92,
        scalar: 1.2
    });
    fire(.2, {
        spread: 240,
        startVelocity: 45
    });
}

// Reset the game state
function resetGame() {
    clearInterval(timerInterval);  // Clear any existing timer
    timerStarted = false;  // Reset the timer start flag

    // Reset the display
    resultElement.innerHTML = "";
    finalResultElement.innerHTML = "";
    timerDisplay.textContent = "60.00";  // Set timer back to 60 seconds
    submitButton.disabled = false;  // Enable submit button
    answerElement.disabled = false;  // Enable answer input
    answerElement.value = "";  // Clear the answer input

    // Start a new game
    startTest();
}

// Handle the visibility toggle of the timer
showTimerCheckbox.addEventListener("change", function() {
    if (showTimerCheckbox.checked) {
        timerElement.style.display = "block";  // Show the timer
    } else {
        timerElement.style.display = "none";  // Hide the timer
        clearInterval(timerInterval);  // Stop the timer if it's hidden
    }
});

// Listen for the Enter key press to submit the answer
answerElement.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Prevent default action of form submission (if any)
        submitAnswer();  // Call the same function as clicking the submit button
    }
});

// Handle button click for submission
submitButton.addEventListener("click", submitAnswer);

// Handle reset button click
resetButton.addEventListener("click", resetGame);

// Start the test when the page loads
startTest();
