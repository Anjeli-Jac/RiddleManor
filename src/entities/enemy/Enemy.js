import GameEntity from "../GameEntity.js";
import StateMachine from "../../../lib/StateMachine.js";
import SoundName from "../../enums/SoundName.js";
import { sounds } from "../../globals.js";
import EnemyIdlingState from "../../states/enemy/EnemyIdlingState.js";
import EnemyWalkingState from "../../states/enemy/EnemyWalkingState.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import Sprite from "../../../lib/Sprite.js";
import { images } from "../../globals.js";
import ImageName from "../../enums/ImageName.js";
import Vector from "../../../lib/Vector.js";
import Heart from "../../objects/Heart.js";
export default class Enemy extends GameEntity{
	static WIDTH = 16;
	static HEIGHT = 16;

	/**
	 * Source: Enemy.js from Zelda
	 * 
	 * Creates an instance of an Enemy.
	 * Can drop a heart by random.
	 * 
	 * @param {*} entityDefinition 
	 */
	constructor(entityDefinition = {}){
		super(entityDefinition);

		this.dimensions.x = Enemy.WIDTH;
		this.dimensions.y = Enemy.HEIGHT;

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Enemy),
			Enemy.WIDTH,
			Enemy.HEIGHT
		);

		this.dropHeartChance = Math.random() < 0.25
	}
	
	update(dt){
		super.update(dt)
		this.currentAnimation.update(dt);
		this.currentFrame = this.currentAnimation.getCurrentFrame();
	}

	receiveDamage(damage) {
		this.health -= damage;
		sounds.play(SoundName.HitEnemy);
	}

	initializeStateMachine(animations) {
		const stateMachine = new StateMachine();

		stateMachine.add(EnemyStateName.Idle, new EnemyIdlingState(this, animations[EnemyStateName.Idle]));
		stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this, animations[EnemyStateName.Walking]));

		stateMachine.change(EnemyStateName.Idle);

		return stateMachine;
	}

	render(x, y){
		super.render(x , y);
	}

	dropHeart(objects){
		if(this.dropHeartChance){

			objects.push(new Heart (
				new Vector(
					Heart.HEART_WIDTH,
					Heart.HEART_HEIGHT,
				),
				new Vector(
					this.canvasPosition.x,
					this.canvasPosition.y,
				)) 
			)
		}
		return objects
	}
}