import Colour from "../enums/Colour.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import Tile from "./Tile.js";
import Layer from "./Layer.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	DEBUG,
	images,
} from "../globals.js";

export default class Map {
	/**
	 * Base code is from Map.js of Pokemon.
	 * Removed the player object, so that the class is only about the map layers.
	 * 
	 * The collection of layers, sprites,
	 * and characters that comprises the world.
	 *
	 * @param {object} mapDefinition JSON from Tiled map editor.
	 */
	constructor(mapDefinition, sprites) {		
		this.bottomLayer = new Layer(mapDefinition.layers[Layer.BOTTOM], sprites);
		this.middleBottomLayer = new Layer(mapDefinition.layers[Layer.MIDDLE_BOTTOM], sprites);
		this.topBottomLayer = new Layer(mapDefinition.layers[Layer.MIDDLE_TOP], sprites);
		this.collisionLayer = new Layer(mapDefinition.layers[Layer.COLLISION], sprites);
		this.objectsCollisionLayer = new Layer(mapDefinition.layers[Layer.OBJECTS_COLLISION], sprites);
		this.topLayer = new Layer(mapDefinition.layers[Layer.TOP], sprites);
		this.canvasDimensions = new Vector(mapDefinition.width * mapDefinition.tilewidth, mapDefinition.height * mapDefinition.tileheight);
	}


	update(dt) {

	}

	render() {
		this.bottomLayer.render();
		this.middleBottomLayer.render();
		this.topBottomLayer.render();
		this.collisionLayer.render();
		this.objectsCollisionLayer.render();
		this.topLayer.render();

		if (DEBUG) {
			//Map.renderGrid();
		}
	}

	/**
	 * Draws a grid of squares on the screen to help with debugging.
	 */
	static renderGrid() {
		context.save();
		context.strokeStyle = Colour.White;

		for (let y = 1; y < CANVAS_HEIGHT / Tile.SIZE; y++) {
			context.beginPath();
			context.moveTo(0, y * Tile.SIZE);
			context.lineTo(CANVAS_WIDTH, y * Tile.SIZE);
			context.closePath();
			context.stroke();

			for (let x = 1; x < CANVAS_WIDTH / Tile.SIZE; x++) {
				context.beginPath();
				context.moveTo(x * Tile.SIZE, 0);
				context.lineTo(x * Tile.SIZE, CANVAS_HEIGHT);
				context.closePath();
				context.stroke();
			}
		}

		context.restore();
	}
}
