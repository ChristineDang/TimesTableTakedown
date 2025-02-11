document.addEventListener("DOMContentLoaded", () => {
    const cardValues = [];
    let flippedCards = [];
    let matchedCards = 0;

    //confetti
    function fire(ratio, opt) {
        confetti(Object.assign({}, opt, {
            origin: {y: .6},
            particleCount: Math.floor(800 *
                ratio)
        }));
    }

    // Generate multiplication questions and answers
    function generateCards() {
        for (let i = 1; i <= 12; i++) {
            const SecNum = Math.floor(Math.random() * 12) + 1; // Generates a random number between 1 and 12
            const answer = i * SecNum;
            cardValues.push({ type: 'question', value: `${i} x ${SecNum}` });
            cardValues.push({ type: 'answer', value: answer.toString() });
        }
        shuffleCards();
    }

    // Shuffle the cards randomly
    function shuffleCards() {
        cardValues.sort(() => Math.random() - 0.5);
    }

    // Create the game board
    function createBoard() {
        const cardsContainer = document.getElementById("cards-container");
        cardsContainer.innerHTML = '';
    
        cardValues.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.dataset.index = index;
            cardElement.dataset.type = card.type;
            cardElement.dataset.value = card.value;
    
            // Create front and back sides
            const cardInner = document.createElement("div");
            cardInner.classList.add("card-inner");
    
            const cardFront = document.createElement("div");
            cardFront.classList.add("card-front");
            cardFront.textContent = card.value; // Show value initially
    
            const cardBack = document.createElement("div");
            cardBack.classList.add("card-back");
    
            // Append elements
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);
    
            // Add click event
            cardElement.addEventListener("click", flipCard);
            cardsContainer.appendChild(cardElement);
        });
    }

    // Handle card click to check for match
    function flipCard(event) {
        const clickedCard = event.currentTarget;
    
        // Prevent flipping back matched cards
        if (clickedCard.classList.contains("matched")) return;
    
        // If two cards are already flipped, do nothing
        if (flippedCards.length === 2) return;
    
        // If the clicked card is already flipped and not matched, unselect it
        if (flippedCards.includes(clickedCard)) {
            clickedCard.classList.remove("flipped");
            clickedCard.style.backgroundColor = "lightblue"; // Reset color
            flippedCards = flippedCards.filter(card => card !== clickedCard); // Remove from flippedCards array
            return;
        }
    
        // Otherwise, flip the card and add it to flippedCards
        clickedCard.classList.add("flipped");
        clickedCard.style.backgroundColor = "lightgreen";
    
        flippedCards.push(clickedCard);
    
        // Check for a match if two cards are flipped
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
    
    

    // Check if the two flipped cards match
    function checkMatch() {
        const [firstCard, secondCard] = flippedCards;
        const firstValue = parseInt(firstCard.dataset.value);
        const secondValue = parseInt(secondCard.dataset.value);
    
        const firstIsQuestion = firstCard.dataset.type === "question";
        const secondIsAnswer = secondCard.dataset.type === "answer";
        const firstIsAnswer = firstCard.dataset.type === "answer";
        const secondIsQuestion = secondCard.dataset.type === "question";
    
        // Extract the correct SecNum from the question card
        const firstQuestionMultiplier = firstIsQuestion ? parseInt(firstCard.dataset.value.split(' x ')[1]) : null;
        const secondQuestionMultiplier = secondIsQuestion ? parseInt(secondCard.dataset.value.split(' x ')[1]) : null;
    
        const firstQuestionValue = firstIsQuestion ? parseInt(firstCard.dataset.value.split(' x ')[0]) * firstQuestionMultiplier : firstValue;
        const secondQuestionValue = secondIsQuestion ? parseInt(secondCard.dataset.value.split(' x ')[0]) * secondQuestionMultiplier : secondValue;
    
        // Clear "Try again!" message when a new pair is being checked
        document.getElementById("message").textContent = "";
    
        if ((firstIsQuestion && secondIsAnswer && firstQuestionValue === secondValue) ||
            (firstIsAnswer && secondIsQuestion && secondQuestionValue === firstValue)) {
    
            // Matched!
            matchedCards += 2;

            // Mark cards as matched
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            flippedCards = [];
    
            if (matchedCards === cardValues.length) { 
                setTimeout(() => {
                    document.getElementById("message").textContent = "Congratulations! You've matched all the cards!";
                }, 500);
    
                // Fire confetti (optional)
                fire(.25, { spread: 30, startVelocity: 60 });
                fire(.2, { spread: 60 });
                fire(.35, { spread: 200, decay: .9, scalar: 1 });
                fire(.1, { spread: 260, startVelocity: 30, decay: .92, scalar: 1.2 });
                fire(.2, { spread: 240, startVelocity: 45 });
    
                // Show the win screen after a short delay
                setTimeout(() => {
                    document.getElementById("win-screen").classList.add("show");
                }, 800);
    
                document.getElementById("play-again-btn").addEventListener("click", () => {
                    document.getElementById("win-screen").classList.remove("show");
                    resetGame();
                });
            }
        } else {
            // No match, flip them back
            setTimeout(() => {
                firstCard.style.backgroundColor = "lightblue";
                secondCard.style.backgroundColor = "lightblue";
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                flippedCards = [];
                document.getElementById("message").textContent = "Try again!";
            }, 1000);
        }
    }
    


    // Reset the game
    function resetGame() {
        cardValues.length = 0;
        flippedCards = [];
        matchedCards = 0;
        document.getElementById("message").textContent = "";
        generateCards();
        createBoard();
    }

    // Initialize game
    generateCards();
    createBoard();

    // Reset button
    document.getElementById("reset-btn").addEventListener("click", resetGame);
});
