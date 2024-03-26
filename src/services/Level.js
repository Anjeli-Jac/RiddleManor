import Map from "./Map.js";
import { mapList, images, stateStack } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Tile from "./Tile.js";
import EnemyType from "../enums/EnemyType.js";
import EnemyFactory from "../entities/enemy/EnemyFactory.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger, getRandomPositiveNumber, pickRandomElement } from "../../lib/RandomNumberHelpers.js";
import TopBarUI from "../user-interface/TopBarUI.js";
import GameOverState from "../states/game/GameOverState.js";
import Enemy from "../entities/enemy/Enemy.js";
import Player from "../entities/Player.js";
import TransitionState from "../states/game/TransitionState.js";

export default class Level{

	/**
	 * Base code is from Room.js of Zelda.
	 * Modified to include the map objects.
	 * 
	 * 
	 * This creates a new level with new enemies and new map objects to interact with.
	 * 
	 * @param {*} number 
	 * @param {*} map 
	 * @param {*} enemySpawnLocationLimiters 
	 * @param {*} welcomeText 
	 */
    constructor(number, map, enemySpawnLocationLimiters, welcomeText){
        this.number = number;
        this.enemySpawnLocationLimiters = enemySpawnLocationLimiters;
        this.map = map
        this.objects = [];
        this.mapObjects = [];
        this.player = new Player({position: new Vector(2, 9)}, this.map, this);
		this.entities = this.generateEntities()
        this.playerUI = new TopBarUI(this.player)
        this.welcomeText = welcomeText
    }

    generateEntities() {
		const entities = new Array();

		/**
		 * Choose a random enemy type and fill the room with only that type.
		 * This is more to make each room feel like a different room.
		 */
		const enemyType = EnemyType[pickRandomElement(Object.keys(EnemyType))];

		for (let i = 0; i < 7;) {
            let x = getRandomPositiveInteger(this.enemySpawnLocationLimiters.leftEdge, this.enemySpawnLocationLimiters.rightEdge);
            let y = getRandomPositiveInteger(this.enemySpawnLocationLimiters.topEdge, this.enemySpawnLocationLimiters.bottomEdge);
			
            if(this.isValidSpawnLocation(x, y)) {
                entities.push(EnemyFactory.createInstance(enemyType, {position: new Vector(x, y)}, this.map));
                i++;
            }
		}

		entities.push(this.player)

		return entities;
	}

    isValidSpawnLocation(x, y) {
		return this.map.collisionLayer.getTile(x, y) === null && this.map.objectsCollisionLayer.getTile(x, y) === null;
	}

    cleanUpEntities() {
		this.entities = this.entities.filter((entity) => !entity.isDead);
	}
	
	cleanUpObjects() {
		this.objects = this.objects.filter((object) => !object.cleanUp);
	}

    updateEntities(dt) {
		this.entities.forEach((entity) => {

			entity.update(dt);

			if (entity.health <= 0) {
				entity.isDead = true;

				//If an enemy dies, there is a chance that it drops a heart
				if(entity instanceof Enemy) {
					this.objects = entity.dropHeart(this.objects);
				}
			}

			this.objects.forEach((object) => {
				if (object.didCollideWithEntity(entity.hitbox)) {
					if (object.isCollidable) {
						object.onCollision(entity);
					}

					if(object.isConsumable) {
						object.onConsume(entity);
					}
				}
			});

			// Since the player is technically always colliding with itself, skip it.
			if (entity === this.player) {
				return;
			}

			if (entity.didCollideWithEntity(this.player.swordHitbox)) {
				entity.receiveDamage(this.player.damage);
			}

			if (!entity.isDead && this.player.didCollideWithEntity(entity.hitbox) && !this.player.isInvulnerable) {
				this.player.receiveDamage(entity.damage);
				this.player.becomeInvulnerable();
			}
		});
	}

    updateObjects(dt){
		this.objects.forEach((object) => {
			object.update(dt);
		});	
	}

    update(dt) {
		this.cleanUpEntities();
		this.cleanUpObjects();
		this.updateEntities(dt)
		this.updateObjects(dt);

        if (this.player.isDead) {
			TransitionState.fade(() => {
				stateStack.pop();
				stateStack.push(new GameOverState());
			});
		}
	}

    render(){
		this.map.bottomLayer.render();
		this.map.middleBottomLayer.render();
		this.map.collisionLayer.render();
		this.map.objectsCollisionLayer.render();
		this.map.topLayer.render();

		this.entities.forEach(e => {
			e.render()
		})
		this.objects.forEach(o => {
			o.render()
		})

		this.map.topBottomLayer.render();

    }

}