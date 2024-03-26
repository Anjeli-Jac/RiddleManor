import Sprite from "../../lib/Sprite.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Tile from "../services/Tile.js";

export default class TopBarUI {
	static FULL_HEART = 4;
	static HALF_HEART = 2;
	static EMPTY_HEART = 0;
	static HEART_WIDTH = Tile.SIZE;
	static HEART_HEIGHT = Tile.SIZE;

	/**
	 * Source: UserInterface.js from Zelda
	 * 
	 * Displays the number of hearts in the top-left corner.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		this.player = player;
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Hearts),
			TopBarUI.HEART_WIDTH,
			TopBarUI.HEART_HEIGHT
		);
	}

	render(offset) {
		// Draw player hearts on the top of the screen.
		let healthLeft = this.player.health;
		let heartFrame = 0;

		for (let i = 0; i < this.player.totalHealth / 2; i++) {
			if (healthLeft > 1) {
				heartFrame = TopBarUI.FULL_HEART;
			}
			else if (healthLeft === 1) {
				heartFrame = TopBarUI.HALF_HEART;
			}
			else {
				heartFrame = TopBarUI.EMPTY_HEART;
			}

			this.sprites[heartFrame].render(Tile.SIZE + TopBarUI.HEART_WIDTH * i + offset.x, 3 * Tile.SIZE);


			healthLeft -= 2;
		}
	}
}
