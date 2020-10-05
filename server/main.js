import Empirica from "meteor/empirica:core";
import { Meteor } from 'meteor/meteor';
import "./bots.js";
import "./callbacks.js";

//Some tests with Meteor's ability to related to collections
import { TestCollection } from './db/Test';

Meteor.startup(() => {
	TestCollection.insert({ text: "hello", createdAt: new Date() });
});

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

//Importing the clues
import { cluesA } from "./stimuli/clues/cluesA";
import { cluesB } from "./stimuli/clues/cluesB";
import { cluesC } from "./stimuli/clues/cluesC";

/*----------
- Avatars: -
----------*/

//Importing the paths to the personalised avatar images
import { avatarPaths } from './avatars/avatarPaths';

/*-----------
- gameInit: -
-----------*/

Empirica.gameInit(game => {

	TestCollection.insert({ text: "hello" });

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
			player.set("independent-clues", cluesA);
		} else if (player.get("type") === "B") {
			player.set("independent-clues", cluesB);
		} else {
			player.set("independent-clues", cluesC);
		}

		player.set("whodunit", "");

	});

	/*----------------------------------
	- Setting up the round and stages: -
	----------------------------------*/

	//Setting up the round.
	const round = game.addRound({
		data: {
			messages: []
		}
	});

	round.addStage({
		name: "initials",
		displayName: "Initials",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "independent_investigation",
		displayName: "Independent Investigation",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "summary_clues",
		displayName: "Summary of Clues",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "intro_discussion",
		displayName: "Introducing the Discussion",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "incentives",
		displayName: "Incentives",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "pres_com_struct",
		displayName: "Presenting Communication Structure",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "discussion",
		displayName: "Discussion",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "final_quiz_question",
		displayName: "Quiz Question",
		durationInSeconds: 999999999999
	});

	round.addStage({
		name: "final_quiz_answer",
		displayName: "Quiz Answer",
		durationInSeconds: 999999999999
	});

});
