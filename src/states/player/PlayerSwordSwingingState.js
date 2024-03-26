import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import SoundName from "../../enums/SoundName.js";
import { sounds } from "../../globals.js";

export default class PlayerSwordSwingingState extends State {
	/**
	 * Source: PlayerSwordSwingingState.js from Zelda
	 * Sword hit box modified to work with our player sprite.
	 * 
	 * In this state, the player swings their sword out in
	 * front of them. This creates a temporary hitbox that
	 * enemies can potentially collide into.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;

		this.animation = {
			[Direction.Up]: new Animation([16, 17, 18, 19], 0.1, 1),
			[Direction.Down]: new Animation([0, 1, 2, 3], 0.1, 1),
			[Direction.Left]: new Animation([24, 25, 26, 27], 0.1, 1),
			[Direction.Right]: new Animation([8, 9, 10, 11], 0.1, 1),
		};
	}

	enter() {
		sounds.play(SoundName.Sword);
		this.player.sprites = this.player.swordSwingingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	exit() {
		this.player.positionOffset = { x: 0, y: 0 };
		this.player.swordHitbox.set(0, 0, 0, 0);
	}

	update() {
		// Idle once one sword swing animation cycle has been played.
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			this.player.changeState(PlayerStateName.Idling);
			this.player.sprites = this.player.walkingSprites
		}

		/**
		 * Only set the sword's hitbox halfway through the animation.
		 * Otherwise, it will look like the enemy died as soon as the
		 * animation started which visually doesn't really make sense.
		 */
		if (this.player.currentAnimation.isHalfwayDone()) {
			this.setSwordHitbox();
		}
	}

	/**
	 * Creates a hitbox based the player's position and direction.
	 */
	setSwordHitbox() {
		let hitboxX, hitboxY, hitboxWidth, hitboxHeight;

		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.player.direction === Direction.Left) {
			hitboxWidth = 13;
			hitboxHeight = 20;
			hitboxX = this.player.canvasPosition.x;
			hitboxY = this.player.canvasPosition.y + 4;
		}
		else if (this.player.direction === Direction.Right) {
			hitboxWidth = 13;
			hitboxHeight = 20;
			hitboxX = this.player.canvasPosition.x + 40;
			hitboxY = this.player.canvasPosition.y + 4;
		}
		else if (this.player.direction === Direction.Up) {
			hitboxWidth = 13;
			hitboxHeight = 13;
			hitboxX = this.player.canvasPosition.x + 20;
			hitboxY = this.player.canvasPosition.y - 8;
		}
		else {
			hitboxWidth = 13;
			hitboxHeight = 13;
			hitboxX = this.player.canvasPosition.x + 20;
			hitboxY = this.player.canvasPosition.y + 28;
		}

		this.player.swordHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
	}
}
