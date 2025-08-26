const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let timeLeft = 60;
let timerInterval;
const timerDisplay = document.querySelector(".timer");
let timerStarted = false; // ✅ prevents multiple timers


fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });


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


function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}


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


function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;


  // Start timer only on the very first flip
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }


  this.classList.add("flipped");


  if (!firstCard) {
    firstCard = this;
    return;
  }


  secondCard = this;
  lockBoard = true;


  checkForMatch();
}


function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}


function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);


  resetBoard();


  // Check win condition AFTER the flip animation finishes        *&
  if (document.querySelectorAll(".flipped").length === cards.length) {
    setTimeout(() => {
      youWin();
    }, 500); // half a second delay so last flip is visible
  }
}


function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}


function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}


function gameOver() {
  clearInterval(timerInterval);
  timerStarted = false;
  resetBoard();


  document.querySelector(".game-over-popup").classList.remove("hidden");
}


function youWin() {
  clearInterval(timerInterval);
  timerStarted = false;
  resetBoard();


  document.querySelector(".win-popup").classList.remove("hidden");
}


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


document.querySelectorAll(".restart-btn").forEach(btn => {
  btn.addEventListener("click", restart);
});


function toggleInstructions() {
  const instructions = document.getElementById("instructions");
  instructions.classList.toggle("show");
}
