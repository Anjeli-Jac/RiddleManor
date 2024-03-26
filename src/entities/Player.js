import GameEntity from "./GameEntity.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import Sprite from "../../lib/Sprite.js";
import Hitbox from "../../lib/Hitbox.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, context, DEBUG, sounds, timer, mapList } from "../globals.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import ImageName from "../enums/ImageName.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerIdlingState from "../states/player/PlayerIdlingState.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerSwordSwingingState from "../states/player/PlayerSwordSwingingState.js";
import Tile from "../services/Tile.js";
import SoundName from "../enums/SoundName.js";

export default class Player extends GameEntity{
    static WIDTH = 24;
    static HEIGHT = 24;
    static SPRITE_SIZE = 52

    static INVULNERABLE_DURATION = 1.5;
	static INVULNERABLE_FLASH_INTERVAL = 0.1;
	static MAX_SPEED = 100;
	static MAX_HEALTH = 6;

	/**
	 * Base code is from Player.js of Pokemon and Zelda.
	 * Modified to work with our game.
	 * 
	 * Creates an instance of a player
	 * 
	 * @param {*} entityDefinition 
	 * @param {*} map 
	 * @param {*} level 
	 */
    constructor(entityDefinition = {}, map, level){
        super(entityDefinition);

		this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.PlayerWalk),
			Player.SPRITE_SIZE,
			Player.SPRITE_SIZE
		);
		this.swordSwingingSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.PlayerSword),
			Player.SPRITE_SIZE,
			Player.SPRITE_SIZE
		);

        this.sprites = this.walkingSprites;

        this.swordHitbox = new Hitbox(0, 0, 0, 0, 'blue');

		this.direction = Direction.Down;

        this.map = map;
		this.level = level;
		this.dimensions = new Vector(Player.WIDTH, Player.HEIGHT);
		this.stateMachine = this.initializeStateMachine();
		this.currentAnimation = this.stateMachine.currentState.animation[this.direction];
    
        this.hitboxOffsets = new Hitbox(20, 2, -11, -1);

		this.totalHealth = Player.MAX_HEALTH;
		this.health = Player.MAX_HEALTH;
		this.isInvulnerable = false;
		this.alpha = 1;
		this.invulnerabilityTimer = null;
		this.canvasPosition = new Vector(Math.floor(this.position.x * Tile.SIZE) - 2 - 16, Math.floor(this.position.y * Tile.SIZE) - 6);
		this.riddleCollected = []
		this.hintCollected = []
		this.foundExit = false;
	}

    update(dt) {
		super.update(dt);
		this.currentAnimation.update(dt);
		this.currentFrame = this.currentAnimation.getCurrentFrame();
	}

	render() {
		context.save();

		const x = Math.floor(this.canvasPosition.x);

		/**
		 * Offset the Y coordinate to provide a more "accurate" visual.
		 * To see the difference, remove the offset and bump into something
		 * either above or below the character and you'll see why this is here.
		 */
		const y = Math.floor(this.canvasPosition.y - this.dimensions.y / 2);

		context.globalAlpha = this.alpha;

		super.render(x , y);

		context.restore();

		if (DEBUG) {
			this.swordHitbox.render(context);
		}
	}

    initializeStateMachine(){
		const stateMachine = new StateMachine();

		stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		stateMachine.add(PlayerStateName.Idling, new PlayerIdlingState(this));
		stateMachine.add(PlayerStateName.SwordSwinging, new PlayerSwordSwingingState(this));

		stateMachine.change(PlayerStateName.Idling);

		return stateMachine;
    }

	receiveDamage(damage) {
		this.health -= damage;
		sounds.play(SoundName.HitPlayer);
	}

	becomeInvulnerable() {
		this.isInvulnerable = true;
		this.invulnerabilityTimer = this.startInvulnerabilityTimer();
	}

	startInvulnerabilityTimer() {
		const action = () => {
			this.alpha = this.alpha === 1 ? 0.5 : 1;
		};
		const interval = Player.INVULNERABLE_FLASH_INTERVAL;
		const duration = Player.INVULNERABLE_DURATION;
		const callback = () => {
			this.alpha = 1;
			this.isInvulnerable = false;
		};

		return timer.addTask(action, interval, duration, callback);
	}

}