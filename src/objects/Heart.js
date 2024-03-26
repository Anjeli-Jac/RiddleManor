import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { images, timer, context, DEBUG } from "../globals.js"
import Tile from "../services/Tile.js";
import Hitbox from "../../lib/Hitbox.js";

export default class Heart extends GameObject{
    static HEART_WIDTH = Tile.SIZE / 2;
	static HEART_HEIGHT = Tile.SIZE / 2;
    static HEART_SPRITE_WIDTH = Tile.SIZE;
	static HEART_SPRITE_HEIGHT = Tile.SIZE;

	/**
	 * Source: Heart.js from Zelda Assignment
	 * 
	 * This creates the heart object that the player can pick up to increase health.
     * It disappears when the player does not pick it up after a number of seconds.
	 *
	 * @param {Vector} dimensions The height and width of the game object.
	 * @param {Vector} position The x and y coordinates of the game object.
	 */
    constructor(dimensions, position){
        super(dimensions, position);

        this.isCollidable = true
        this.isConsumable = true
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Hearts),
			Heart.HEART_SPRITE_WIDTH,
			Heart.HEART_SPRITE_HEIGHT,
		)
        this.currentFrame = 4
		this.hitboxOffsets = new Hitbox(0,-4, 0, 0);
        this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
    }

    update(dt){
        timer.addTask(() => {}, 10, 10, () => {
            if(!this.cleanUp)
                this.cleanUp = true
        })
    }

	render() {
		const x = Math.floor(this.position.x);

		/**
		 * Offset the Y coordinate to provide a more "accurate" visual.
		 * To see the difference, remove the offset and bump into something
		 * either above or below the character and you'll see why this is here.
		 */
		const y = Math.floor(this.position.y - this.dimensions.y / 2);

		this.sprites[this.currentFrame].render(x, y, { x: 0.5, y: 0.5 });

		if (DEBUG) {
			this.hitbox.render(context);
		}
    } 

    onConsume(collider){
        if (this.wasConsumed) {
            return;
        }

        if(collider instanceof Player){
            this.wasConsumed = true;
            super.onConsume(collider);
    
            collider.health = collider.health + 2 >= Player.MAX_HEALTH ? Player.MAX_HEALTH : collider.health + 2;
            this.cleanUp = true;
        }
    }
}