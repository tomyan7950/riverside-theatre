import Empirica from "meteor/empirica:core";
import "./bots.js";
import "./callbacks.js";

/*-------------------
- Helper functions: -
-------------------*/

//Function to randomly choose an element from an array (but also removes it):
function popChoice(array) {
	var randomIndex = Math.floor(Math.random() * array.length);
	return array.splice(randomIndex, 1)[0];
}


//Function to randomly choose an element from an array:
function choice(array) {
	var randomIndex = Math.floor(Math.random() * array.length);
	var randomElement = array[randomIndex];
	return randomElement;
}

//shuffle(): Fisher-Yates shuffle from https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle(array) {
	var i = 0, j = 0, temp = null;
	//Start with i one less than the array size, and decrement i everytime
	for (i = array.length - 1; i > 0; i -= 1) {
		//Math.random() returns a random number between 0 (inclusive) and 1 (exclusive)
		//Math.floor() function returns the largest integer less than or equal to a given number.
		//This will return an integer that is a possible index of the array
		j = Math.floor(Math.random() * (i + 1));
		//Swap the last element of the array (index i) with the element at index j (randomly generated:
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	//return the shuffled array
	return array;
}

/*--------
- Clues: -
--------*/

//Importing the completed clues
import { clues_full } from "./stimuli/clues/clues_full";

//Importing the blanked clues
import { clues_blank } from "./stimuli/clues/clues_blank.js";

//Set starting clues for the different positions
const startingCluesA = [0, 1, 2];
const startingCluesB = [3, 4, 5];
const startingCluesC = [6, 7, 8];

/*----------
- Avatars: -
----------*/

//Importing the paths to the personalised avatar images
import { avatarPaths } from './avatars/avatarPaths';

/*-----------
- gameInit: -
-----------*/

//Setting a variable for whether this is development/testing or not
const isTest = true

//Running the gameInit
Empirica.gameInit(game => {

	/*-------------------------
	- Setting up the players: -
	-------------------------*/

	//Prepare the player types
	let playerTypes = ["A", "B", "C"];

	//Shuffle the player types
	playerTypes = shuffle(playerTypes);

	//Prepare elements for players to randomly draw an avatar:
	const avatarShapes = ["first", "second", "third"];
	const avatarColors = ["color1", "color2", "color3"];

	//Setting up the players
	game.players.forEach((player, i) => {

		//Record player id
		player.set("_id", player._id);

		//Getting condition information
		player.set("competition", game.treatment.competition)
		player.set("brokerage", game.treatment.brokerage)

		//Getting the avatar
		let shape = popChoice(avatarShapes);
		let color = popChoice(avatarColors);
		let avatar = avatarPaths[shape][color];
		player.set("avatar", avatar);

		//Prepare their initials
		player.set("initials", `NoInitials(${i})`);

		//Randomise which player type they are:
		player.set("type", playerTypes[i]);

		//Giving individual clues to the players (No counterbalancing)
		if (player.get("type") === "A") {
			player.set("independent-clues", startingCluesA);
		} else if (player.get("type") === "B") {
			player.set("independent-clues", startingCluesB);
		} else {
			player.set("independent-clues", startingCluesC);
		}

		//Set cluesCheck
		let cluesChecked = {};
		clues_full.clues.forEach(clue => {
			cluesChecked[clue.id] = false;
		});
		player.get("independent-clues").forEach(clue => {
			cluesChecked[clue] = true;
		});
		player.set("cluesChecked", cluesChecked);

		//Set chat messages
		player.set("chatAB", null);
		player.set("chatAC", null);
		player.set("chatBC", null);

		//Set measures
		player.set("initialWhodunit", "");
		player.set("whodunit", "");

	});

	/*----------------------------------
	- Setting up the round and stages: -
	----------------------------------*/

	//Setting up the round.
	const round = game.addRound({
		data: {
			messages: [],
			clues_full: clues_full,
			clues_blank: clues_blank,
			startingCluesA: startingCluesA,
			startingCluesB: startingCluesB,
			startingCluesC: startingCluesC,
		}
	});

	round.addStage({
		name: "initials",
		displayName: "Initials",
		durationInSeconds: isTest ? 999999999999 : 120,
	});

	round.addStage({
		name: "personalised_instructions",
		displayName: "Instructions",
		durationInSeconds: isTest ? 999999999999 : 600,
	});

	round.addStage({
		name: "discussion",
		displayName: "Discussion",
		durationInSeconds: isTest ? 999999999999 : 300,
	});

	round.addStage({
		name: "whodunit_questions",
		displayName: "Whodunit Question",
		durationInSeconds: isTest ? 999999999999 : 60,
	});

	round.addStage({
		name: "whodunit_answers",
		displayName: "Whodunit Answer",
		durationInSeconds: isTest ? 999999999999 : 60,
	});

});
