import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import SoundName from "../../enums/SoundName.js";
import { keys, sounds, stateStack, timer } from "../../globals.js";
import Tile from "../../services/Tile.js";

export default class PlayerWalkingState extends State {

	/**
	 * Base code is from PlayerWalkingState.js of Pokemon.
	 * Modified to detect map objects in front of the player and swing the sword.
	 * 
	 * In this state, the player can move around using the
	 * directional keys. From here, the player can go idle
	 * if no keys are being pressed. The player can also swing
	 * their sword if they press the spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.map = player.map
		this.player = player;
		this.bottomLayer = this.player.map.bottomLayer;
		this.collisionLayer = this.player.map.collisionLayer;
		this.objectsCollisionLayer = this.player.map.objectsCollisionLayer;
		this.animation = {
			[Direction.Up]: new Animation([16, 17, 18, 19], 0.2),
			[Direction.Down]: new Animation([0, 1, 2, 3], 0.2),
			[Direction.Left]: new Animation([24, 25, 26, 27], 0.2),
			[Direction.Right]: new Animation([8, 9, 10, 11], 0.2),
		};

		this.isMoving = false;

	}

	update(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];

		this.handleSwordSwing();
		this.handleMovement(dt);
	}

	handleSwordSwing() {
		if (keys[' ']) {
			this.player.changeState(PlayerStateName.SwordSwinging);
		}
	}

	handleMovement(dt) {
		/**
		 * Unlike Zelda, the Player's movement in Pokemon is locked to
		 * the grid. To restrict them from moving freely, we set a flag
		 * to track if they're currently moving from one tile to another,
		 * and reject input if so.
		 */
		if (this.isMoving) {
			return;
		}

		if (!keys.w && !keys.a && !keys.s && !keys.d) {
			this.player.changeState(PlayerStateName.Idling);
			return;
		}

		this.updateDirection();
		this.move(dt);
	}

	updateDirection() {
		if (keys.s) {
			this.player.direction = Direction.Down;
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
		}
	}

	move(dt) {
		let tileToFind = null;
		let x = this.player.position.x;
		let y = this.player.position.y;

		if (this.player.direction === Direction.Up) {
			tileToFind = this.objectsCollisionLayer.getTile(x, y - 1);
			y--;
		}
		else if (this.player.direction === Direction.Down) {
			tileToFind = this.objectsCollisionLayer.getTile(x, y + 1)
			y++;
		}
		else if (this.player.direction === Direction.Left) {
			tileToFind = this.objectsCollisionLayer.getTile(x - 1, y)
			x--;
		}
		else if (this.player.direction === Direction.Right) {
			tileToFind = this.objectsCollisionLayer.getTile(x + 1, y)
			x++;
		}

		if(tileToFind != null && keys.i){
			for(let i = 0; i < this.player.level.mapObjects.length; i++){
				let tiles = this.player.level.mapObjects[i].tiles

				const found = tiles.find((tile) => tile == tileToFind);

				if(found != null && keys.i){
					this.player.level.mapObjects[i].onCollision(this.player)
				}
			}
		}

	

		if (!this.isValidMove(x, y)) {
			return;
		}

		this.player.position.x = x;
		this.player.position.y = y;

		this.tweenMovement(x, y);

	}

	tweenMovement(x, y) {
		this.isMoving = true;

		timer.tween(
			this.player.canvasPosition,
			['x', 'y'],
			[x * Tile.SIZE - 2 - 16, y * Tile.SIZE - 6],
			0.25,
			() => {
				this.isMoving = false;

				this.updateDirection();
			}
		);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns Whether the player is going to move on to a non-collidable tile.
	 */
	isValidMove(x, y) {
		return this.collisionLayer.getTile(x, y) === null && this.objectsCollisionLayer.getTile(x, y) === null;
	}

	checkCollisionWithMapObjects(x, y){
		return this.objectsCollisionLayer.getTile(x, y) != null;
	}
}
