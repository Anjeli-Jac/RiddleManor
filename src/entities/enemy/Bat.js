import Enemy from "./Enemy.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import Direction from "../../enums/Direction.js";
import Animation from "../../../lib/Animation.js";
import Hitbox from "../../../lib/Hitbox.js";
import Vector from "../../../lib/Vector.js";
import Tile from "../../services/Tile.js";
import { context } from "../../globals.js";

export default class Bat extends Enemy{
	static WIDTH = 16;
	static HEIGHT = 16;

	/**
	 * Creates a new instance of Bat enemy
	 * 
	 * @param {*} entityDefinition 
	 * @param {*} map 
	 */
	constructor(entityDefinition = {}, map) {
		super(entityDefinition);

		this.map = map;

		this.direction = Direction.Down;
		this.dimensions = new Vector(Bat.WIDTH, Bat.HEIGHT);
		this.hitboxOffsets = new Hitbox(3, -6, -6, -3);
		this.currentFrame = 52

		const animations = { 
			[EnemyStateName.Idle]: {
				[Direction.Up]: new Animation([88], 1),
				[Direction.Down]: new Animation([52], 1),
				[Direction.Left]: new Animation([64], 1),
				[Direction.Right]: new Animation([76], 1),
			},
			[EnemyStateName.Walking]: {
				[Direction.Up]: new Animation([87, 88, 89, 88], 0.2),
				[Direction.Down]: new Animation([51, 52, 53, 52], 0.2),
				[Direction.Left]: new Animation([63, 64, 65, 64], 0.2),
				[Direction.Right]: new Animation([75, 76, 77, 76], 0.2),
			}
		};

		this.stateMachine = this.initializeStateMachine(animations);
		this.canvasPosition = new Vector(Math.floor(this.position.x * Tile.SIZE), Math.floor(this.position.y * Tile.SIZE) + 13);
	
	}

	update(dt) {
		super.update(dt);
	}

	render(){
		const x = Math.floor(this.canvasPosition.x);

		/**
		 * Offset the Y coordinate to provide a more "accurate" visual.
		 * To see the difference, remove the offset and bump into something
		 * either above or below the character and you'll see why this is here.
		 */
		const y = Math.floor(this.canvasPosition.y - this.dimensions.y / 2);

		super.render(x , y);
	}

}