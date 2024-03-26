import Animation from "../../../lib/Animation.js";
import {didSucceedChance, getRandomPositiveInteger, pickRandomElement} from "../../../lib/RandomNumberHelpers.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import State from "../../../lib/State.js";
import Enemy from "../../entities/enemy/Enemy.js";
import Direction from "../../enums/Direction.js";
import { timer } from "../../globals.js";
import Tile from "../../services/Tile.js";

export default class EnemyWalkingState extends State {
	static IDLE_CHANCE = 0.5;
	static MOVE_DURATION_MIN = 2;
	static MOVE_DURATION_MAX = 4;

	/**
	 * Base code is from PlayerWalkingState.js of Pokemon and EnemyWalkingState.js from Zelda.
	 * Then, it is modified to work for our game.
	 * 
	 * In this state, the enemy moves around in random
	 * directions for a random period of time.
	 *
	 * @param {Enemy} enemy
	 * @param {Animation} animation
	 */
	constructor(enemy, animation) {
		super();

		this.enemy = enemy;
		this.bottomLayer = this.enemy.map.bottomLayer;
		this.collisionLayer = this.enemy.map.collisionLayer;
		this.objectsCollisionLayer = this.enemy.map.objectsCollisionLayer;
		this.animation = animation;
		this.isMoving = false;
	}

	enter() {
		this.enemy.currentAnimation = this.animation[this.enemy.direction];

		this.reset();
		this.startTimer();
	}

	update(dt) {
		this.handleMovement(dt);
	}

	startTimer() {
		this.timer = timer.wait(this.moveDuration, () => this.decideMovement());
	}

	/**
	 * 50% chance for the enemy to go idle for more dynamic movement.
	 * Otherwise, start the movement timer again.
	 */
	decideMovement() {
		if (didSucceedChance(EnemyWalkingState.IDLE_CHANCE)) {
			this.enemy.changeState(EnemyStateName.Idle);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	/**
	 * 25% chance for the enemy to move in any direction.
	 * Reset the movement timer to a random duration.
	 */
	reset() {
		this.enemy.direction = pickRandomElement([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);
		this.enemy.currentAnimation = this.animation[this.enemy.direction];
		this.moveDuration = getRandomPositiveInteger(EnemyWalkingState.MOVE_DURATION_MIN, EnemyWalkingState.MOVE_DURATION_MAX);
	}

	handleMovement(dt) {
		if (this.isMoving) {
			return;
		}

		this.move(dt);
	}


	move(dt) {
		let x = this.enemy.position.x;
		let y = this.enemy.position.y;

		if (this.enemy.direction === Direction.Up) {
			y--;
		}
		else if (this.enemy.direction === Direction.Down) {
			y++;
		}
		else if (this.enemy.direction === Direction.Left) {
			x--;
		}
		else if (this.enemy.direction === Direction.Right) {
			x++;
		}

		if (!this.isValidMove(x, y)) {
			this.reset();
			this.startTimer();
			return;
		}

		this.enemy.position.x = x;
		this.enemy.position.y = y;

		this.tweenMovement(x, y);
	}

	tweenMovement(x, y) {
		this.isMoving = true;

		timer.tween(
			this.enemy.canvasPosition,
			['x', 'y'],
			[x * Tile.SIZE, y * Tile.SIZE + 13],
			0.25,
			() => {
				this.isMoving = false;
			}
		);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns Whether the enemy is going to move on to a non-collidable tile.
	 */
	isValidMove(x, y) {
		return this.collisionLayer.getTile(x, y) === null && this.objectsCollisionLayer.getTile(x, y) === null;
	}
}
