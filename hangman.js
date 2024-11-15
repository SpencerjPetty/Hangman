/*
Improvements made since last time (~2.5 hours of extra work)

1. Created an option to receive a random word from an API,
rather than from the word bank 
2. Made it so the random word is a certain number of letters which the user chooses
3. Modified the Play Again functionality to be in a button rather than an alert
4. Added the Hangman illustration and a limited number of guesses, so the player can lose
5. Improved some QoL changes (Enter key now working for input, focus goes to the input box automatically, box is cleared after invalid inputs)
6. Added a Quit button that redirects to Google rather than a confirm box which did the same thing
7. Added more visual features such as coloring and the background image
8. Full word shows after losing
*/

//This is a simple hangman game that displays in the web browser

//Here is the native bank of possible words to guess
const possibleWords = ["Candy", "Peanut", "Celebrate", "Circus", 
"Astonishment", "Elephant", "Congratulations", 
"JavaScript", "Coding", "Challenge"]; 

let magicWord; //Variable of the word being guessed

const guessDisplay = []; //This is the word that will be displayed to the user, updating when correct guesses are made

const wrongGuesses = []; //This is the bank of already guessed letters that weren't in the word

let numCorrectGuesses = 0; //These keep track of the number of correct and incorrect guesses
let numIncorrectGuesses = 0;
let lost = false;

// Making it possible for the user to hit enter instead of clicking on the guess button
window.onload=function(){
    let pInput = document.getElementById("playerInput");

pInput.addEventListener('keypress', function (e) { //Adding an event listener
    if (e.key === 'Enter') {
      playerGuess();
        }
    });
  };

function resetGame() {
    //These next 5 lines clear out the display for when the game is restarted by the user
    document.getElementById("numOfGuesses").innerHTML = ""; 
    document.getElementById("correctGuesses").innerHTML = "";
    document.getElementById("incorrectGuesses").innerHTML = "";
    guessDisplay.length = 0;
    document.getElementById("mainHeader").className = "";
    document.getElementById('hangImg').src = 'hangmanDrawing/h0.png';

    //clears out the wrong guesses array and the guess numbers
    wrongGuesses.length = 0;
    numCorrectGuesses = 0;
    numIncorrectGuesses = 0;
}

function gameStart(randFlag) { //This is the function that starts/restarts the game for the user
    resetGame();
    document.getElementById('playerInput').focus();
    if (randFlag) { //Checks if a random word is wanted and calls the API if so
        getNewWord().then(() => {
            magicWord = tempWord.toString();
            displayWord();
        });
    } else {
            //Here the word is chosen from the bank and stored in a variable
    magicWord = possibleWords[Math.floor(Math.random() * 10)].toLowerCase();
    displayWord();
    }

};
// Function for displaying the empty word spaces
function displayWord() {
        //Here the word is turned into an array
        magicWord = Array.from(magicWord);

        //This creates the blank display word that has the correct number of letters
        for (let i = 0; i < magicWord.length; i++) {
        guessDisplay.push("_");
    }

    //And here the blank display word is shown to the user
    document.getElementById("secondHeader").innerHTML = guessDisplay.join(" ");

    //This announces to the user the number of letters and shows that the game has begun
    document.getElementById("mainHeader").innerHTML = `The secret word has ${magicWord.length} letters.`;
    };

    // Function for calling the random word API
async function getNewWord() {
    let length = parseInt(prompt('How many letters should the random word be?')); // Asking for preferred length

    if (isNaN(length) || length > 15) { // Checking validity of length chosen
        alert('Invalid number chosen,  try again!')
        return;
    }

    const url = `https://random-word-api.herokuapp.com/word?length=${length}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      tempWord = await response.json(); // Storing the word in a temporary variable
    } catch (error) {
      console.error(error.message);
    }
  };


//This is the function for every time the player inputs a guess
function playerGuess() {

    //Checking to see if the game is started
    if (document.getElementById("mainHeader").innerHTML == "Welcome to Hangman!") {
        alert("Please press 'Start game' to start!");
        return;
    }

    let guess = document.getElementById("playerInput").value.toLowerCase(); //Grabs the value of the input box

    //Checking for repeat guesses
    if (wrongGuesses.includes(guess) || guessDisplay.includes(guess)) {
        alert("You've already guessed that letter!");
        document.getElementById('playerInput').value = '';
        return;
    }

    //Checking for guesses of more than 1 letter
    if (guess.length > 1) {
        alert("Please input only 1 letter!");
        document.getElementById('playerInput').value = '';
        return;
    }
    
    //Checking for guesses that aren't strings
    if (!isNaN(guess)) {
        alert("Please input a letter!");
        document.getElementById('playerInput').value = '';
        return;
    }

    //Checking for blank guesses
    if (guess == "" || guess == " ") {
        alert("You must input a guess!");
        document.getElementById('playerInput').value = '';
        return;
    }
    
    //Checking to see if the guess is in the real word
    if (magicWord.includes(guess)) {
    numCorrectGuesses++; //tracking number of correct guesses
      
    //Loop to put all occurences of the correct letter in the display for the user
    for (let i = 0; i < magicWord.length; i++) {
        if (guess == magicWord[i]) {
            guessDisplay[i] = guess;
            document.getElementById("secondHeader").innerHTML = guessDisplay.join(" ");
        };

        //Updating the number of correct guesses
        document.getElementById("correctGuesses").innerHTML = "Correct guesses: " + numCorrectGuesses;
    };  
    } else { //If the user guesses a letter not found in the word
        numIncorrectGuesses++ //updates incorrect guess number
        wrongGuesses.push(guess); //puts the incorrect guess in the bank

        // Increments the Hangman image
        document.getElementById('hangImg').src = `hangmanDrawing/h${numIncorrectGuesses}.png`;
        //Displays the number of incorrect guesses along with which letters have been guessed already 
        document.getElementById("incorrectGuesses").innerHTML = "Incorrect guesses: " + numIncorrectGuesses + "<br> Incorrect letters already guessed: " + wrongGuesses.join(" ");

        if (numIncorrectGuesses >= 9) {
            lost = true;
            playerLoses();
        }
    }

    //Clearing out the input box
    document.getElementById("playerInput").value = "";

    //Updating the total number of guesses to display
    document.getElementById("numOfGuesses").innerHTML = "Total guesses: " + (numCorrectGuesses + numIncorrectGuesses);

    //Checking if the player has guessed the entire word yet
    if (guessDisplay.toString() === magicWord.toString() && !lost) {
        playerWins();
    };
};

// Function for when the player runs out of guesses and the hangman dies
function playerLoses() {

    document.getElementById("mainHeader").innerHTML = "Aw man, you lost! Want to try again?"

    // Showing the word that they missed
    for (let i = 0; i < magicWord.length; i++) {
            guessDisplay[i] = magicWord[i];
            document.getElementById("secondHeader").innerHTML = guessDisplay.join(" ");
        };

    gameEnded();
}

//Every time the player makes a guess, the program checks to see if they've won yet. if so, it calls this function

function playerWins() { 
    document.getElementById("mainHeader").className = "text-rainbow-animation"; //Fun little animation

    //Victory message in the HTML
    document.getElementById("mainHeader").innerHTML = "Congratulations, you win!!! It took you " + (numCorrectGuesses + numIncorrectGuesses) + " guesses!";
    
    gameEnded();

};

function gameEnded() { // Function for hiding things when the game ends
    document.getElementById("playAgainBtn").hidden = false;
    document.getElementById("quitBtn").hidden = false;
    document.getElementById("guessBtn").hidden = true
    document.getElementById("playerInput").hidden = true;
    document.getElementById("gameStart").hidden = true;
    document.getElementById("randCheck").hidden = true;
    document.getElementById("randLabel").hidden = true;
}