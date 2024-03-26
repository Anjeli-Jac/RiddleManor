import MapObject from "./MapObjects.js";
import DialogueState from "../states/game/DialogueState.js";
import Panel from "../user-interface/elements/Panel.js";
import StateStack from "../../lib/StateStack.js";
import { stateStack } from "../globals.js";

export default class RiddleObject extends MapObject{

    /**
     * 
     * Special map objects that are the answers to the riddle given to the player.
     * It has multiple texts that appear when interacted with, depending on the the progress of the player in the level.
     * 
     * @param {*} position 
     * @param {*} dimension 
     * @param {*} info 
     * @param {*} collisionObjectLayer 
     */
    constructor(position, dimension, info, collisionObjectLayer){
        super(position, dimension, info, collisionObjectLayer);
        this.info = info;
        this.addedToHintCollected = false;
    }

    onCollision(collider){
        let doesPlayerHaveTheRiddle = collider.riddleCollected.find(h => h == this.info.riddleThatHasThisObjectAsTheAnswer)

        if(doesPlayerHaveTheRiddle == null){

            //If the player has not obtained the riddle that has this object as the answer
            //then show the default message
            stateStack.push(new DialogueState(
                this.info.defaultMessage,
                Panel.TOP_DIALOGUE
            ));
        }
        else{

            //If the player has this object's riddle, 
            //let them know of the next riddle that they need to answer.
            stateStack.push(new DialogueState(
                this.info.revealHint + "\nListen carefully...\n" + this.info.revealRiddle,
                Panel.TOP_DIALOGUE,
                () => {
                    collider.hintCollected.push(this.info.revealHint);
                }
            ));

            //Add the hint to the player's hintCollected list
            if(!this.addedToHintCollected){
                collider.riddleCollected.push(this.info.revealRiddle)
                this.addedToHintCollected = true
            }
        }
    }
}

