/**
 * Riddle Manor
 *
 * By Jean Rose Manigbas & Anjeli Mae Taruc
 * 
 * Game Programming Final Project
 *
 * In this game, you're an adventurer lost in a mysterious manor. 
 * A riddler knight appears, offering guidance but with a twist – 
 * you must solve his riddles to get hints for the final question. 
 * Answer it right to stay healthy and escape; otherwise, you lose 
 * health and the chance to break free. Watch out for lurking enemies! 
 * Beat the challenges, and you'll move on to the next stage, getting 
 * closer to leaving the manor.
 *
 * Asset sources
 * Character Folder: @see https://sagak-art-pururu.itch.io/24pxminicharacters
 * Enemies Folder:@see https://opengameart.org/comment/50905
 * Room Decor Folder: @see https://penzilla.itch.io/top-down-retro-interior
 * Room Walls And Floor Folder: @see https://deadmadman.itch.io/the-quaken-assets
 * 
 * Inspiration for the riddles
 * @see https://www.dndspeak.com/2018/11/28/100-riddles-and-their-answers/ 
 *  
 * Music
 * Background: @see https://freesound.org/people/Speedenza/sounds/251530/ 
 * Key: @see https://freesound.org/people/MATRIXXX_/sounds/459694/ 
 * menu-open.ogg, selection-choice.ogg, selection-move.ogg: @see https://reliccastle.com/essentials/ 
 * door.wav, hit_enemy.wav, hit_player.wav, door.wav, sword.wav are from the Zelda game
 * 
 */ 

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	keys,
	mapList,
	sounds,
	stateMachine,
	stateStack,
	timer,
} from "./globals.js";
import TitleScreenState from "./states/game/TitleScreenState.js";
import PlayState from "./states/game/PlayState.js";
import Player from "./entities/Player.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./src/config.json').then((response) => response.json());
const mapDefinition = await fetch('./maps/maplevel1.json').then((response) => response.json());
const mapDefinition2 = await fetch('./maps/maplevel2.json').then((response) => response.json());
mapList.push(mapDefinition);
mapList.push(mapDefinition2);


// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

stateStack.push(new TitleScreenState())

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

const game = new Game(stateStack, context, timer, CANVAS_WIDTH, CANVAS_HEIGHT);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
