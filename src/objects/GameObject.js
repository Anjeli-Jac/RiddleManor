import Vector from "../../lib/Vector.js";
import { getCollisionDirection } from "../../lib/CollisionHelpers.js";
import Hitbox from "../../lib/Hitbox.js";
import Direction from "../enums/Direction.js";
import { context, DEBUG } from "../globals.js";
import Tile from "../services/Tile.js";

export default class GameObject {
	/**
	 * Source: GameObject.js from Zelda
	 * 
	 * The base class to be extended by all game objects in the game.
	 *
	 * @param {Vector} dimensions The height and width of the game object.
	 * @param {Vector} position The x and y coordinates of the game object.
	 */
	constructor(dimensions, position) {
		this.dimensions = dimensions;
		this.position = position;
		this.hitboxOffsets = new Hitbox();
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
		this.sprites = [];
		this.currentFrame = 0;
		this.cleanUp = false;
		this.renderPriority = 0;

		// If an entity can overlap with this game object.
		this.isSolid = false;

		// If an entity should detect if it's overlapping this game object.
		this.isCollidable = false;

		// If the game object should disappear when collided with.
		this.isConsumable = false;

		// If the game object was collided with already.
		this.wasCollided = false;

		// If the game object was consumed already.
		this.wasConsumed = false;
	}

	update(dt) { }

	render(offset = { x: 0, y: 0 }) {
		const x = Math.floor(this.position.x);

		/**
		 * Offset the Y coordinate to provide a more "accurate" visual.
		 * To see the difference, remove the offset and bump into something
		 * either above or below the character and you'll see why this is here.
		 */
		const y = Math.floor(this.position.y - this.dimensions.y / 2);

		this.sprites[this.currentFrame].render(x, y);

		if (DEBUG) {
			this.hitbox.render(context);
		}
	}

	onConsume(consumer) {
		this.wasConsumed = true;
	}

	onCollision(collider) {
		/**
		 * If this object is solid, then set the
		 * collider's position relative to this object.
		 */
		if (this.isSolid) {
			const collisionDirection = this.getEntityCollisionDirection(collider.hitbox);

			switch (collisionDirection) {
				case Direction.Up:
					collider.canvasPosition.y = this.hitbox.position.y - Math.abs(collider.canvasPosition.y - collider.hitbox.position.y) - collider.hitbox.dimensions.y;
					break;
				case Direction.Down:
					collider.canvasPosition.y = this.hitbox.position.y + this.hitbox.dimensions.y - Math.abs(collider.canvasPosition.y - collider.hitbox.position.y);
					break;
				case Direction.Left:
					collider.canvasPosition.x = this.hitbox.position.x - Math.abs(collider.canvasPosition.x - collider.hitbox.position.x) - collider.hitbox.dimensions.x;
					break;
				case Direction.Right:
					collider.canvasPosition.x = this.hitbox.position.x + this.hitbox.dimensions.x - Math.abs(collider.canvasPosition.x - collider.hitbox.position.x);
					break;
			}
		}

		this.wasCollided = true;
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns Whether this game object collided with an hitbox using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox);
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns The direction that the hitbox collided with this game object.
	 */
	getEntityCollisionDirection(hitbox) {
		return this.hitbox.getCollisionDirection(hitbox);
	}
}
