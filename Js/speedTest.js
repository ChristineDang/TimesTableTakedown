// Variables
let startTime;
let currentQuestion;
let questionCount = 0;
let correctAnswers = 0;
let totalTime = 0;
let timerInterval;
let timerStarted = false; // Flag to track if timer has started
let questionElement = document.getElementById("question");
let answerElement = document.getElementById("answer");
let resultElement = document.getElementById("result");
let submitButton = document.getElementById("submit");
let finalResultElement = document.getElementById("finalResult");
let timerElement = document.getElementById("timer");
let timerDisplay = document.getElementById("timerDisplay");
let showTimerCheckbox = document.getElementById("showTimer");

// Function to generate a random multiplication question
function generateQuestion() {
    let num1 = Math.floor(Math.random() * 10) + 1;  // Random number between 1 and 10
    let num2 = Math.floor(Math.random() * 10) + 1;  // Random number between 1 and 10
    questionElement.textContent = `${num1} x ${num2} = ?`;
    return { num1, num2 };
}

// Start the test
function startTest() {
    currentQuestion = generateQuestion();
    questionCount = 0;
    correctAnswers = 0;
    totalTime = 0;
    resultElement.innerHTML = "";
    finalResultElement.innerHTML = "";
    timerDisplay.textContent = "0.00";
    
    // Reset and hide timer initially
    if (showTimerCheckbox.checked) {
        timerElement.style.display = "block";  // Show the timer
    } else {
        timerElement.style.display = "none";  // Hide the timer
    }
}

// Start the timer
function startTimer() {
    if (timerStarted) return; // Prevent starting the timer multiple times

    // Mark timer as started
    timerStarted = true;
    
    startTime = new Date().getTime();  // Initialize start time
    
    // Update the timer every 100 milliseconds
    timerInterval = setInterval(function() {
        let elapsedTime = (new Date().getTime() - startTime) / 1000;  // Time in seconds
        timerDisplay.textContent = elapsedTime.toFixed(2);
    }, 100);  // Update every 100 milliseconds
}

// Handle the submit action
function submitAnswer() {
    let userAnswer = parseInt(answerElement.value, 10);
    let correctAnswer = currentQuestion.num1 * currentQuestion.num2;

    if (userAnswer === correctAnswer) {
        let endTime = new Date().getTime();
        let timeTaken = (endTime - startTime) / 1000;  // Time in seconds
        questionCount++;
        correctAnswers++;

        // Show time taken for this question
        resultElement.innerHTML = `Correct! You took ${timeTaken.toFixed(2)} seconds.`;

        // If this is the first correct answer, start the timer
        if (!timerStarted) {
            startTimer();
        }

        // Check if all questions are answered correctly
        if (questionCount < 20) {
            // Generate new question and reset input
            currentQuestion = generateQuestion();
            answerElement.value = "";
        } else {
            // Show final result when all 20 questions are answered correctly
            finalResultElement.innerHTML = `Congratulations! You answered all 20 questions correctly in ${timeTaken.toFixed(2)} seconds!`;
            submitButton.disabled = true;  // Disable the submit button
            answerElement.disabled = true;  // Disable the answer input
            clearInterval(timerInterval);   // Stop the timer
        }
    } else {
        // If answer is incorrect, prompt user to try again
        resultElement.innerHTML = "Oops! That's not the correct answer. Try again!";
    }
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

// Start the test when the page loads
startTest();
