import EnemyType from "../../enums/EnemyType.js";
import Ghost from "./Ghost.js";
import Bat from "./Bat.js";

/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class EnemyFactory {
	/**
	 * Source: EnemyFactory.js from Zelda
	 * 
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type, entityDefinition = {}, map) {
		switch (type) {
			case EnemyType.Ghost:
				return new Ghost(entityDefinition, map);
			case EnemyType.Bat:
				return new Bat(entityDefinition, map);
		}
	}
}
