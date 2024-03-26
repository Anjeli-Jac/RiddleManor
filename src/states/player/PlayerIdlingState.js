import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { keys,stateStack } from "../../globals.js";
import JournalState from "../game/JournalState.js";

export default class PlayerIdlingState extends State {
	/**
	 * Base code is from PlayerIdlingState.js of Pokemon.
	 * Modified to detect map objects in front of the player and swing the sword.
	 * 
	 * In this state, the player is stationary unless
	 * a directional key or the spacebar is pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.map = player.map
		this.player = player;
		this.objectsCollisionLayer = this.player.map.objectsCollisionLayer;
		this.animation = {
			[Direction.Up]: new Animation([16], 1),
			[Direction.Down]: new Animation([0], 1),
			[Direction.Left]: new Animation([24], 1),
			[Direction.Right]: new Animation([8], 1),
		};
	}

	enter() {
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update() {
		let tileToFind = null;

		if(this.player.direction == Direction.Down){
			tileToFind = this.objectsCollisionLayer.getTile(this.player.position.x, this.player.position.y + 1)
		}else if(this.player.direction == Direction.Right){
			tileToFind = this.objectsCollisionLayer.getTile(this.player.position.x + 1, this.player.position.y)
		}else if(this.player.direction == Direction.Up){
			tileToFind = this.objectsCollisionLayer.getTile(this.player.position.x, this.player.position.y - 1)
		}else if(this.player.direction == Direction.Left){
			tileToFind = this.objectsCollisionLayer.getTile(this.player.position.x - 1, this.player.position.y)
		}

		if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Walking);
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
		
		this.handleSwordSwing()
	}

	handleSwordSwing() {
		if (keys[' ']) {
			this.player.changeState(PlayerStateName.SwordSwinging);
		}
	}
}
