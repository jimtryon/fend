/*
 * Create a list that holds all of your cards
 */
let openCards = [];

let timerEnabled = false;
let interval = 0;
let gameStars = 0;
let matchedCards = 0;
const TOTAL_MATCHES = 8;

const cardDeck = document.querySelector('.deck');

function shuffleCards() {
    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     */
    const oldCards = Array.from(document.querySelectorAll(".deck li"));
    const shuffledCards = shuffle(oldCards);
    /*   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     */
    for (let card of shuffledCards) {
        cardDeck.appendChild(card);
    }
}

// Shuffle cards before starting the game
shuffleCards();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(newCards) {
    var currentIndex = newCards.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = newCards[currentIndex];
        newCards[currentIndex] = newCards[randomIndex];
        newCards[randomIndex] = temporaryValue;
    }

    return newCards;
}

gameStars = 3;

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Initialize move tracker
let moveCounter = 0;

const cards = document.querySelectorAll('.card');

cards.forEach(function (card) {
    card.addEventListener('click', function () {

        // If the card is one of our cards, flip it over and 
        // add it to the array of open cards 
        if (card.classList.contains('card')) {

            // Only allow 2 cards to be flipped over
            // Don't allow flipping of the same card
            if (openCards.length < 2 && !openCards.includes(card)) {
                flipCard(card);
                addOpenCard(card);
            }
            if (openCards.length > 1) {
                checkCardMatch();
                addMoves();
                updateStars();
            }
        }
    });
});

function flipCard(card) {
    // Check if timer is running and start it
    if (timerEnabled === false) {
        startTimer();
    }

    card.classList.add('open', 'show');
}

function addOpenCard(card) {
    openCards.push(card);
}

function checkCardMatch() {
    // Check the card's symbols to see if the first two cards match and add class
    if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
        console.log("It's a match!");
        openCards[0].classList.add('match');
        openCards[1].classList.add('match');
        openCards = [];
        matchedCards++;

        if (matchedCards === TOTAL_MATCHES) {
            endGame();
        }
    } else {
        console.log("It's not a match!");
        hideCard();
    }
}

function hideCard() {
    setTimeout(() => {
        openCards.forEach(card => card.classList.remove('open', 'show'));
        openCards = [];
    }, 700);
}

function addMoves() {
    moveCounter += 1;
    document.querySelector('.moves').innerHTML = moveCounter;
}

function updateStars() {
    if (moveCounter === 10) {
        removeStar();
    } else if (moveCounter == 18) {
        removeStar();
    }
}

function removeStar() {
    // Similar to the cards, it returns a NodeList
    const stars = document.querySelectorAll(".stars li");
    // Remove the first star in the list 
    stars[0].parentNode.children[0].remove();
    gameStars--;
}


function startTimer() {
    let sec = 0;
    let min = 0;
    let hour = 0;
    const clockText = document.querySelector(".clock");


    timerEnabled = true;
    interval = setInterval(function () {
        clockText.innerHTML = hour + " hour " + min + " minutes " +
            sec + " seconds";
        sec++;

        // Add 1 minute after 60 seconds
        if (sec === 60) {
            min++;
        }
        // Add 1 hour after 60 minutes
        if (min === 60) {
            hour++;
        }
    }, 1000);
}

function stopTimer() {
    clearTimeout(interval);
}

function restartGame() {
    const restart = document.querySelector(".restart");

    shuffleCards();

    // Remove existing classes from cards
    for (let i = 0; i < cards.length; i++) {
        cardDeck.innerHTML = "";

        [].forEach.call(cards, function (item) {
            cardDeck.appendChild(item);
        });

        cards[i].classList.remove('show', 'open', 'match');
    }

    moveCounter = 0;
    const moves = document.querySelector(".moves");
    moves.innerHTML = moveCounter;

    const clockText = document.querySelector(".clock");
    let sec = 0;
    let min = 0;
    let hour = 0;

    clockText.innerHTML = hour + " hour " + min + " minutes " +
        sec + " seconds";
    clearInterval(interval);

    const restartButton = document.querySelector(".modal-play-again");
    restartButton.addEventListener("click", restartGame);
}

const stars = document.querySelectorAll(".stars li");

// Reset star rating to 3 stars
for (let i = 0; i < stars.length; i++) {
    stars[i].style.visibility = "visible";
}

const modal = document.querySelector(".modal");

function toggleModal() {
    modal.classList.toggle('show-modal');

    const modalTime = document.querySelector(".modal-time");
    const gameTime = document.querySelector(".clock").innerHTML;
    const modalMoves = document.querySelector(".modal-moves");
    const modalStars = document.querySelector(".modal-stars");

    modalTime.innerHTML = `Time: ${gameTime}`;
    modalMoves.innerHTML = `Moves: ${moveCounter}`;
    modalStars.innerHTML = `Stars: ${gameStars}`;
}

function onWindowClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

const cancelButton = document.querySelector(".modal-cancel");
const playButton = document.querySelector(".modal-play-again");

cancelButton.addEventListener("click", toggleModal);
playButton.addEventListener("click", function () {
    restartGame();
    toggleModal();
});
window.addEventListener("click", onWindowClick);

function endGame() {
    stopTimer();
    toggleModal();
}