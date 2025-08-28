// container for all card elements
const gridContainer = document.querySelector(".grid-container");
// display element for countdown timer
const timerDisplay = document.querySelector(".timer");

//Game state variables
let cards = [];                // holds all card objects (duplicated & shuffled)
let firstCard; secondCard;     // tracks selected cards for matching
let lockBoard = false;         // prevents flipping during animations
let timeLeft = 60;             // initial countdown time in seconds
let timerInterval;             // reference to setInterval for timer
let timerStarted = false;      //prevents multiple timers

// Fetch card data from JSON file and initialize the game
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];   // duplicate cards (pairs)
    shuffleCards();               // randomize order
    generateCards();              // render cards on grid
  });

/**
 * Starts the countdown timer.
 * Clears any existing timer and begins a new 60s countdown.
 * Ends the game when time runs out.
 */
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

/**
 * Shuffles the cards array in place using Fisher–Yates algorithm.
 */
function shuffleCards() {
  let currentIndex = cards.length;
    randomIndex;
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // Swap
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

/**
 * Dynamically generates card elements and appends them to the grid.
 * Each card contains a front (image) and a back side.
 */
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);

    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" alt="${card.alt}"/>
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

/**
 * Handles flipping logic when a card is clicked.
 * Starts timer on the very first flip.
 */
function flipCard() {
  if (lockBoard) return;              // prevent clicks while board is locked
  if (this === firstCard) return;     // prevent double-clicking the same card

  // Start timer only on the very first flip
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this; // first card selected
    return;
  }

  // Second card selected
  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

/**
 * Checks if the two selected cards are a match.
 */
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

/**
 * Disables click events on matched cards and checks win condition.
 */
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();

// Check if all cards have been matched (win condition)
  if (document.querySelectorAll(".flipped").length === cards.length) {
    setTimeout(() => {
      youWin();
    }, 500); // half a second delay so last flip is visible
  }
}

/**
 * Unflips cards if they don't match.
 */
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

/**
 * Resets board state (selected cards and lock).
 */
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

/**
 * Ends the game when the timer reaches zero.
 * Displays "Game Over" popup.
 */
function gameOver() {
  clearInterval(timerInterval);
  timerStarted = false;
  resetBoard();

  document.querySelector(".game-over-popup").classList.remove("hidden");
}

/**
 * Triggers win state when all cards are matched.
 * Displays "You Win" popup.
 */
function youWin() {
  clearInterval(timerInterval);
  timerStarted = false;
  resetBoard();

  document.querySelector(".win-popup").classList.remove("hidden");
}

/**
 * Restarts the game:
 * - Resets board
 * - Shuffles and regenerates cards
 * - Resets timer and hides popups
 */
function restart() {
  resetBoard();
  shuffleCards();
  gridContainer.innerHTML = "";
  generateCards();

  clearInterval(timerInterval);
  timeLeft = 60;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  timerStarted = false;

  document.querySelector(".game-over-popup").classList.add("hidden");
  document.querySelector(".win-popup").classList.add("hidden");
}

// Attach restart logic to all restart buttons
document.querySelectorAll(".restart-btn").forEach(btn => {
  btn.addEventListener("click", restart);
});

/**
 * Toggles visibility of instruction panel.
 */
function toggleInstructions() {
  const instructions = document.getElementById("instructions");
  instructions.classList.toggle("show");
}
