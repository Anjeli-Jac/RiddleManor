import Level from "./Level.js";
import { mapList, images } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Tile from "./Tile.js";
import MapObject from "../objects/MapObjects.js";
import Map from "./Map.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import RiddleObject from "../objects/RiddleObject.js";
import Riddler from "../objects/Riddler.js";
import HiddenExit from "../objects/HiddenExit.js";

/**
 * Encapsulates all logic to create a level
 */
export default class LevelMaker {

	static createLevel(level = 1) {
		switch (level) {
			case 1:
				return LevelMaker.levelOne();
			case 2:
				return LevelMaker.levelTwo();
			default:
				return LevelMaker.levelTwo();			
		}
	}

	static levelOne() {
        let number = 1

		// These are the x and y coordinates where enemies can spawn.
		// Since each level is a different map, the values are map dependent
        let spawnLocation = {
            leftEdge: 2,
            rightEdge: 27,
            topEdge: 7,
            bottomEdge: 10
        }

		// Sprites for the specific map
        const sprites1 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.ManorTiles),
			Tile.SIZE,
			Tile.SIZE,
		);

		const sprites2 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.ManorTilesDeco),
			Tile.SIZE,
			Tile.SIZE,
		)

		const sprites3 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Knight),
			Tile.SIZE,
			Tile.SIZE
		);

		const sprites4 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.FloorsAndWalls),
			Tile.SIZE,
			Tile.SIZE
		);
		const sprites5 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.FurnitureState2),
			Tile.SIZE,
			Tile.SIZE
		);
		const sprites6 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.FurnitureState1),
			Tile.SIZE,
			Tile.SIZE
		);
		const sprites7 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.SmallItems),
			Tile.SIZE,
			Tile.SIZE
		);

		let sprites = sprites1.concat(sprites2);
		sprites = sprites.concat(sprites3);
		sprites=sprites.concat(sprites4);
		sprites=sprites.concat(sprites5);
		sprites=sprites.concat(sprites6);
		sprites=sprites.concat(sprites7);

        let map = new Map(mapList[number - 1], sprites);

		// Text that appears when the player just entered a new level.
        let welcomeText = `Welcome, traveler, to the Riddle Manor. You find yourself trapped within these ancient walls, a prisoner of both time and circumstance. To escape, you must prove your worth and face the challenges that lie ahead.\nPress \"i\" to interact with objects and the mysterious knight. Press spacebar to defend yourself from the enemies. Press Esc to view your journal. Now, let us discover if you possess the fortitude to navigate the challenges and escape this cryptic manor...`
        let level = new Level(number, map, spawnLocation, welcomeText);
        level.mapObjects = LevelMaker.generateObjectsForLevelOne(map, number);

        return level;
    }

	static generateObjectsForLevelOne(map, number){
		let decryptedText = "hello, world"
		let numShifts = 4;

		let lamp = new MapObject(new Vector(2, 5), new Vector(1, 2), new Information("", "This is a lamp.", "", ""), map.objectsCollisionLayer);
		let leftDrawer = new MapObject(new Vector(1, 7), new Vector(1, 2), new Information("", "This is a drawer.", "", ""), map.objectsCollisionLayer);
		let leftOldShelf = new MapObject(new Vector(1, 10), new Vector(1, 1), new Information("", "This is an old book shelf with webs.", "", ""), map.objectsCollisionLayer);
		let bigShelf = new HiddenExit(new Vector(7, 5), new Vector(6, 2), new Information("", "This is a big shelf.", "", ""), map.objectsCollisionLayer, number);
		let plant = new MapObject(new Vector(7, 10), new Vector(1, 1), new Information("", "This is a plant.", "", ""), map.objectsCollisionLayer);
		
		let bigSofa = new MapObject(new Vector(8, 10), new Vector(4, 1), new Information("", "This is a big sofa.", "", ""), map.objectsCollisionLayer);
		let smallSeat = new MapObject(new Vector(16, 10), new Vector(2, 1), new Information("", "This is a comfortable seat.", "", ""), map.objectsCollisionLayer);
		let mirror = new MapObject(new Vector(14, 5), new Vector(2, 2), new Information("", "This is a mirror.", "", ""), map.objectsCollisionLayer);
		let clock = new MapObject(new Vector(16, 5), new Vector(2, 2), new Information("", "This is a clock", "", ""), map.objectsCollisionLayer);

		let leftPainting = new MapObject(new Vector(4, 5), new Vector(3, 1), new Information("", "This is a big painting.", "", ""), map.objectsCollisionLayer);
		let middlePainting = new MapObject(new Vector(18, 5), new Vector(2, 1), new Information("", "This is a small painting", "", ""), map.objectsCollisionLayer);
		let rightPainting = new RiddleObject(new Vector(25, 5), new Vector(3, 1), new Information ("\"What kind of coat is always wet when you put it on?\"", "This is just another painting. Definitely not hiding something...", `There are ${numShifts} bookshelves in this room. Remember that number.`, "\"Empty with knowledge. Home to 8 legged creature.\""), map.objectsCollisionLayer);

		let phone = new MapObject(new Vector(20, 6), new Vector(1, 1), new Information("", "This is a phone.", "", ""), map.objectsCollisionLayer);
		let smallPlant = new MapObject(new Vector(21, 6), new Vector(1, 1), new Information("", "This is a small plant.", "", ""), map.objectsCollisionLayer);
		let orb = new MapObject(new Vector(22, 6), new Vector(1, 1), new Information("", "This is an orb.", "", ""), map.objectsCollisionLayer);
		let emptyCabinet = new MapObject(new Vector(23, 6), new Vector(1, 1), new Information("", "The top is empty.", "", ""), map.objectsCollisionLayer);
		let fishbowl = new MapObject(new Vector(24, 6), new Vector(1, 1), new Information("", "Look. It's a fish.", "", ""), map.objectsCollisionLayer);

		let topRightOldBookshelf = new MapObject(new Vector(28, 6), new Vector(1, 2), new Information("", "This is just another old bookshelf.", "", ""), map.objectsCollisionLayer);
		let bottomRightOldBookshelf = new RiddleObject(new Vector(28, 10), new Vector(1, 1),new Information("\"Empty with knowledge. Home to 8 legged creature.\"", "This is just another old bookshelf with spider webs?...", "What does \'" + caesarCipher(decryptedText, numShifts)+ "\' mean?", "Julius Caesar would know. Let's ask the knight."), map.objectsCollisionLayer);

		let riddler = new Riddler(new Vector(3, 6), new Vector(1, 1), new Information("Julius Caesar would know. Let's ask the knight.", "Find the answer to this riddle. You may find a secret around it.", "Let's test your knowledge.", "\"What kind of coat is always wet when you put it on?\""), map.objectsCollisionLayer, decryptedText, "Congrats! You may leave by the hidden exit behind the big bookshelf.");

		let obj = [lamp, leftDrawer, leftOldShelf, bigShelf, plant, bigSofa, smallSeat, mirror, 
					clock, leftPainting, middlePainting, rightPainting, phone, smallPlant, orb, 
					emptyCabinet, fishbowl, topRightOldBookshelf, bottomRightOldBookshelf, riddler]
		
		return obj;
	}

	static levelTwo() {
        let number = 2

		// These are the x and y coordinates where enemies can spawn.
		// Since each level is a different map, the values are map dependent
        let spawnLocation = {
            leftEdge: 2,
            rightEdge: 27,
            topEdge: 7,
            bottomEdge: 10
        }

		// Sprites for the specific map
        const sprites1 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.ManorTiles),
			Tile.SIZE,
			Tile.SIZE,
		);

		const sprites2 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.ManorTilesDeco),
			Tile.SIZE,
			Tile.SIZE,
		)

		const sprites3 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Knight),
			Tile.SIZE,
			Tile.SIZE
		);

		const sprites4 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.FloorsAndWalls),
			Tile.SIZE,
			Tile.SIZE
		);
		const sprites5 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.FurnitureState2),
			Tile.SIZE,
			Tile.SIZE
		);
		const sprites6 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.FurnitureState1),
			Tile.SIZE,
			Tile.SIZE
		);
		const sprites7 = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.SmallItems),
			Tile.SIZE,
			Tile.SIZE
		);

		let sprites = sprites1.concat(sprites2);
		sprites = sprites.concat(sprites3);
		sprites=sprites.concat(sprites4);
		sprites=sprites.concat(sprites5);
		sprites=sprites.concat(sprites6);
		sprites=sprites.concat(sprites7);

        let map = new Map(mapList[number - 1], sprites);

		// Text that appears when the player just entered a new level.
		let welcomeText = 'Huhh the exact room? Continue looking around...'
        let level = new Level(number, map, spawnLocation, welcomeText);
        level.mapObjects = LevelMaker.generateObjectsForLevelTwo(map, number);

        return level;
    }

	static generateObjectsForLevelTwo(map, number){
		let decryptedText = "Never Ending"
		let key = "TIME";

		let lamp = new MapObject(new Vector(2, 5), new Vector(1, 2), new Information("", "This is a lamp. The light is on. Why?", "", ""), map.objectsCollisionLayer);
		let leftDrawer = new MapObject(new Vector(1, 7), new Vector(1, 2), new Information("", "This is a drawer.", "", ""), map.objectsCollisionLayer);
		let leftOldShelf = new MapObject(new Vector(1, 10), new Vector(1, 1), new Information("", "This is an old book shelf with webs.", "", ""), map.objectsCollisionLayer);
		let bigShelf = new MapObject(new Vector(7, 5), new Vector(6, 2), new Information("", "This is a big shelf.", "", ""), map.objectsCollisionLayer);
		let plant = new MapObject(new Vector(7, 10), new Vector(1, 1), new Information("", "This is a plant.", "", ""), map.objectsCollisionLayer);
		
		let bigSofa = new MapObject(new Vector(8, 10), new Vector(4, 1), new Information("", "This is a big sofa, but how can I sit on it?", "", ""), map.objectsCollisionLayer);
		let smallSeat = new MapObject(new Vector(16, 10), new Vector(2, 1), new Information("", "This is a comfortable seat.", "", ""), map.objectsCollisionLayer);
		let mirror = new RiddleObject(new Vector(14, 5), new Vector(2, 2), new Information("\"There is two of me. Yet really only one.\"", "Just a mirror and nothing else.", `${vigenereCipher(decryptedText, key)}?`, "\"What has two hands on its face but no arms?\""), map.objectsCollisionLayer);
		let clock = new RiddleObject(new Vector(16, 5), new Vector(2, 2), new Information("\"What has two hands on its face but no arms?\"", "This is a clock.", `The important key in life is ${key}.`, "Blaise de Vigenère was a good cryptographer. Or was he? Let's ask the knight."), map.objectsCollisionLayer);

		let leftPainting = new MapObject(new Vector(4, 5), new Vector(3, 1), new Information("", "This is a big painting.", "", ""), map.objectsCollisionLayer);
		let middlePainting = new MapObject(new Vector(18, 5), new Vector(2, 1), new Information("", "This is a small painting", "", ""), map.objectsCollisionLayer);
		let rightPainting = new MapObject(new Vector(25, 5), new Vector(3, 1), new Information ("", "Should I pursue an art degree instead?", "", ""), map.objectsCollisionLayer);

		let cabinet1 = new MapObject(new Vector(20, 6), new Vector(1, 1), new Information("", "This is a duck.", "", ""), map.objectsCollisionLayer);
		let cabinet2 = new MapObject(new Vector(21, 6), new Vector(1, 1), new Information("", "Why is it empty?.", "", ""), map.objectsCollisionLayer);
		let cabinet3 = new MapObject(new Vector(22, 6), new Vector(1, 1), new Information("", "There is a book. It says \"ABCDEFGHIJKLMNOPQRSTUVWXYZ\".", "", ""), map.objectsCollisionLayer);
		let cabinet4 = new MapObject(new Vector(23, 6), new Vector(1, 1), new Information("", "Empty glass.", "", ""), map.objectsCollisionLayer);
		let cabinet5 = new MapObject(new Vector(24, 6), new Vector(1, 1), new Information("", "Where is the fish?.", "", ""), map.objectsCollisionLayer);

		let topRightOldBookshelf = new HiddenExit(new Vector(28, 6), new Vector(1, 2), new Information("", "Bookshelf at the far end of the room.", "", ""), map.objectsCollisionLayer, number);
		let bottomRightOldBookshelf = new MapObject(new Vector(28, 10), new Vector(1, 1),new Information("", "Spiderssss", "", ""), map.objectsCollisionLayer);

		let riddler = new Riddler(new Vector(3, 6), new Vector(1, 1), new Information("Blaise de Vigenère was a good cryptographer. Or was he? Let's ask the knight.", "Find the answer to this riddle. You may find a secret around it.", "Let's test your knowledge.", "\"There is two of me. Yet really only one.\""), map.objectsCollisionLayer, decryptedText, "Congrats! You may leave by the hidden exit behind the bookshelf in the far end of the room.");

		let obj = [lamp, leftDrawer, leftOldShelf, bigShelf, plant, bigSofa, smallSeat, mirror, 
					clock, leftPainting, middlePainting, rightPainting, cabinet1, cabinet2, cabinet3, 
					cabinet4, cabinet5, topRightOldBookshelf, bottomRightOldBookshelf, riddler]
		
		return obj;
	}
}

function caesarCipher(text, shift) {
    let newText = "";

    for (let i = 0; i < text.length; i++) {
        let c = text[i];

        if (c.match(/[a-zA-Z]/)) {
            let offset = c.toLowerCase() === c ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
            newText += String.fromCharCode((c.charCodeAt(0) - offset + shift) % 26 + offset);
        } else {
            newText += c;
        }
    }

    return newText;
}

function vigenereCipher(text, key, decrypt = false) {
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let newText = '';
    key = key.toUpperCase().replace(/ /g, '');
    let index = 0;

    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (c.match(/[a-zA-Z]/)) {
            let pos = ALPHABET.indexOf(c.toUpperCase());

            if (decrypt) {
                pos -= ALPHABET.indexOf(key[index]);
            } else {
                pos += ALPHABET.indexOf(key[index]);
            }

            pos = (pos + 26) % 26;

            newText += (c === c.toLowerCase()) ? ALPHABET[pos].toLowerCase() : ALPHABET[pos];

            index++;

            if (index === key.length) {
                index = 0;
            }
        } else {
            newText += c;
        }
    }

    return newText;
}

class Information{

	/**
	 * 
	 * This creates the object that holds the texts that get displayed in the dialogue state
	 * depending on the progress of the player in the level.
	 * 
	 * @param {*} riddleThatHasThisObjectAsTheAnswer 
	 * @param {*} defaultMessage 
	 * @param {*} revealHint 
	 * @param {*} revealRiddle 
	 */
	constructor(riddleThatHasThisObjectAsTheAnswer = "", defaultMessage = "", revealHint = "", revealRiddle = "") {
        this.riddleThatHasThisObjectAsTheAnswer = riddleThatHasThisObjectAsTheAnswer;
        this.defaultMessage = defaultMessage;
		this.revealHint = revealHint;
        this.revealRiddle = revealRiddle;
	}
}