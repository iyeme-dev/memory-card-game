const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let timeLeft = 60;
let timerInterval;
const timerDisplay = document.querySelector(".timer");
let timerStarted = false;
