//Spencer Petty 11/13/2023
//BYU OIT coding challenge

//This is a simple hangman game that displays in the web browser

//Here is the bank of possible words to guess
const possibleWords = ["Candy", "Peanut", "Celebrate", "Circus", 
"Astonishment", "Elephant", "Congratulations", 
"JavaScript", "Coding", "Challenge"]; 

let magicWord; //Variable of the word being guessed

const guessDisplay = []; //This is the word that will be displayed to the user, updating when correct guesses are made

const wrongGuesses = []; //This is the bank of already guessed letters that weren't in the word

let numCorrectGuesses = 0; //These keep track of the number of correct and incorrect guesses
let numIncorrectGuesses = 0;

function gameStart() { //This is the function that starts/restarts the game for the user
    //These next 5 lines clear out the display for when the game is restarted by the user
    document.getElementById("numOfGuesses").innerHTML = ""; 
    document.getElementById("correctGuesses").innerHTML = "";
    document.getElementById("incorrectGuesses").innerHTML = "";
    guessDisplay.length = 0;
    document.getElementById("mainHeader").className = "";

    //clears out the wrong guesses array and the guess numbers
    wrongGuesses.length = 0;
    numCorrectGuesses = 0;
    numIncorrectGuesses = 0;

    //Here the word is chosen and stored in a variable
    magicWord = possibleWords[Math.floor(Math.random() * 10)].toLowerCase();

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

//Every time the player makes a guess, the program checks to see if they've won yet.

    function playerWins() { 
    //This is the display message that determines whether to restart the game or quit
    if (confirm(`You won in ${(numCorrectGuesses + numIncorrectGuesses)} guesses! Would you like to play again? Press 'OK' to play again or 'cancel' to quit.`)) {
        gameStart(); //This restarts the game if they click OK
    } else {
       alert("Thanks for playing!"); //Thanks the player
       window.location.href = "http://www.google.com"; //Goes to google.com because they quit
    };
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
        return;
    }

    //Checking for guesses of more than 1 letter
    if (guess.length > 1) {
        alert("Please input only 1 letter!");
        return;
    }
    
    //Checking for guesses that aren't strings
    if (!isNaN(guess)) {
        alert("Please input a letter!");
        return;
    }

    //Checking for blank guesses
    if (guess == "" || guess == " ") {
        alert("You must input a guess!")
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
        //Displays the number of incorrect guesses along with which letters have been guessed already 
        document.getElementById("incorrectGuesses").innerHTML = "Incorrect guesses: " + numIncorrectGuesses + "<br> Letters already guessed: " + wrongGuesses.join(" ");
    }

    //Clearing out the input box
    document.getElementById("playerInput").value = "";

    //Updating the total number of guesses to display
    document.getElementById("numOfGuesses").innerHTML = "Total guesses: " + (numCorrectGuesses + numIncorrectGuesses);

    //Checking if the player has guessed the entire word yet
    if (guessDisplay.toString() === magicWord.toString()) {
        document.getElementById("mainHeader").className = "text-rainbow-animation"; //Fun little animation

        //Victory message in the HTML
        document.getElementById("mainHeader").innerHTML = "Congratulations, you win!!! It took you " + (numCorrectGuesses + numIncorrectGuesses) + " guesses!";
        
        //A 2 second timeout so that the HTML has time to load before the victory analog box and you can see the animation
        const myTimeout = setTimeout(playerWins, 2000);
    };
};