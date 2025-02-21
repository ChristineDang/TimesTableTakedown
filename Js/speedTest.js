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
let resetButton = document.getElementById("reset"); // Reset button
let finalResultElement = document.getElementById("finalResult");
let timerElement = document.getElementById("timer");
let timerDisplay = document.getElementById("timerDisplay");
let showTimerCheckbox = document.getElementById("showTimer");
let previousScore = 0; // Store the previous round's score
let currentScore = 0;

//confetti
function fire(ratio, opt) {
    confetti(Object.assign({}, opt, {
        origin: {y: .6},
        particleCount: Math.floor(800 *
            ratio)
    }));
}

function generateQuestion() {
    let num1 = Math.floor(Math.random() * 12) + 1;
    let num2 = Math.floor(Math.random() * 12) + 1; 
    questionElement.textContent = `${num1} x ${num2} = ?`;
    return { num1, num2 };
}

function startTest() {
    currentQuestion = generateQuestion();
    questionCount = 0;
    correctAnswers = 0;
    totalTime = 0;
    resultElement.innerHTML = "";
    finalResultElement.innerHTML = "";
    timerDisplay.textContent = "0.00";
    
    // Reset and hide timer initially
    // if (showTimerCheckbox.checked) {
    //     timerElement.style.display = "block";  // Show the timer
    // } else {
    //     timerElement.style.display = "none";  // Hide the timer
    // }
}

function startTimer() {
    if (timerStarted) return; // Prevent starting the timer multiple times

    // Mark timer as started
    timerStarted = true;
    
    // Show the timer if it's hidden
    document.getElementById("timer").style.display = "block";

    startTime = new Date().getTime();  // Initialize start time
    
    // Update the timer every 100 milliseconds
    timerInterval = setInterval(function() {
        let elapsedTime = (new Date().getTime() - startTime) / 1000;  // Time in seconds
        timerDisplay.textContent = elapsedTime.toFixed(2);
    }, 100);  // Update every 100 milliseconds
}

function submitAnswer() {
    let userAnswer = parseInt(answerElement.value, 10);
    let correctAnswer = currentQuestion.num1 * currentQuestion.num2;

    if (userAnswer === correctAnswer) {
        questionCount++;

        // Start the timer only on the first correct answer
        if (!timerStarted) {
            startTimer();
        }

        resultElement.innerHTML = `Correct!`;

        if (questionCount < 20) {
            // Generate a new question and clear input
            currentQuestion = generateQuestion();
            answerElement.value = "";
        } else {
            // Stop the timer and calculate total time taken
            clearInterval(timerInterval);
            let endTime = new Date().getTime();
            totalTime = (endTime - startTime) / 1000; // Convert to seconds
            
            // Display final result
            finalResultElement.innerHTML = `Congratulations! You answered all 20 questions correctly in ${totalTime.toFixed(2)} seconds!`;
            
            submitButton.disabled = true;
            answerElement.disabled = true;

            // Update the score display
            updateScoreDisplay();

            // Fire confetti 🎉
            fire(.25, { spread: 30, startVelocity: 30 });
            fire(.2, { spread: 30 });
            fire(.35, { spread: 100, decay: .9, scalar: 1 });
            fire(.1, { spread: 140, startVelocity: 15, decay: .92, scalar: 1.2 });
            fire(.2, { spread: 240, startVelocity: 45 });
        }
    } else {
        resultElement.innerHTML = "Oops! That's not the correct answer. Try again!";
    }
}

function updateScoreDisplay() {
    // Move the last round's score to the previous score card
    document.getElementById("previousScore").textContent = previousScore !== undefined ? previousScore.toFixed(2) + " sec" : "0 sec";

    // Display the current round's time as the score
    document.getElementById("currentScore").textContent = totalTime !== undefined ? totalTime.toFixed(2) + " sec" : "0 sec";
}

function resetGame() {
    clearInterval(timerInterval);  // Clear any existing timer
    timerStarted = false;  // Reset the timer flag

    // Move the last game's total time to previousScore
    if (totalTime > 0) {
        previousScore = totalTime;
    }

    // Reset the total time for the new game
    totalTime = 0;
    
    resultElement.innerHTML = "";
    finalResultElement.innerHTML = "";
    timerDisplay.textContent = "0.00";  // Reset timer display
    submitButton.disabled = false;
    answerElement.disabled = false;
    answerElement.value = "";

    questionCount = 0;
    
    updateScoreDisplay(); // Update the score display
    
    // Start a new game
    startTest();
}


// Handle the visibility toggle of the timer
// showTimerCheckbox.addEventListener("change", function() {
//     if (showTimerCheckbox.checked) {
//         timerElement.style.display = "block";  // Show the timer
//     } else {
//         timerElement.style.display = "none";  // Hide the timer
//         clearInterval(timerInterval);  // Stop the timer if it's hidden
//     }
// });

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
