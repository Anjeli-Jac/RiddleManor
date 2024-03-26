import { stateStack } from "../globals.js";
import DialogueState from "../states/game/DialogueState.js"
import Panel from "../user-interface/elements/Panel.js";
import Player from "../entities/Player.js";

export default class MapObject{

    /**
     * 
     * This create an object from the map.
     * It saves all the tiles that make up that object in the map.
     * It can give a heart by random when interacting with.
     * 
     * @param {*} position 
     * @param {*} dimension 
     * @param {*} info 
     * @param {*} collisionObjectLayer 
     */
    constructor(position, dimension, info, collisionObjectLayer){
        this.position = position;
        this.dimension = dimension;
        this.info = info;
        this.collisionObjectLayer = collisionObjectLayer;
        this.tiles = this.getTiles();
        console.log(this.tiles)
		this.dropHeartChance = Math.random() < 0.25
        this.heartGained = false;

    }

    getTiles(){
        const tiles = []

        for(let x = this.position.x; x < this.position.x + this.dimension.x; x++){
            for(let y = this.position.y; y < this.position.y + this.dimension.y; y++){
                tiles.push(this.collisionObjectLayer.getTile(x, y));
            }
        }

        return tiles;
    }


    onCollision(collider){
        if(this.dropHeartChance && !this.heartGained){
            stateStack.push(new DialogueState(
                "You have found a heart. You gain two health points.",
                Panel.TOP_DIALOGUE,
                () => {            
                    collider.health = collider.health + 2 >= Player.MAX_HEALTH ? Player.MAX_HEALTH : collider.health + 2;
                }
            ));
            this.heartGained = true;
            return;
        }

        stateStack.push(new DialogueState(
            this.info.defaultMessage,
            Panel.TOP_DIALOGUE
        ));
    }

}