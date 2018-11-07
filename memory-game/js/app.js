/*
 * Create a list that holds all of your cards
 */
let openCards = [];

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

function addMoves() {
    moveCounter += 1;
    const moveCounterText = document.querySelector('.moves').innerHTML = moveCounter;
}

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
            }
        }
    });
});

function flipCard(card) {
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