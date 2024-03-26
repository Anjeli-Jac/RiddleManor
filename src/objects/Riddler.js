import MapObject from "./MapObjects.js";
import DialogueState from "../states/game/DialogueState.js";
import Panel from "../user-interface/elements/Panel.js";
import { stateStack } from "../globals.js";

export default class Riddler extends MapObject{

    /**
     * 
     * Special map object that serves as the knight who gives riddles to the player.
     * It has multiple texts that appear when interacted with, depending on the the progress of the player in the level.
     * 
     * @param {*} position 
     * @param {*} dimension 
     * @param {*} info 
     * @param {*} collisionObjectLayer 
     * @param {*} answer 
     * @param {*} revealHiddenExit 
     */
    constructor(position, dimension, info, collisionObjectLayer, answer, revealHiddenExit){
        super(position, dimension, info, collisionObjectLayer);
        this.info = info;
        this.addedToHintCollected = false;
        this.answer = answer;
        this.revealHiddenExit = revealHiddenExit;
    }

    onCollision(collider){
        if(collider.foundExit){
            stateStack.push(new DialogueState(
                this.revealHiddenExit,
                Panel.TOP_DIALOGUE
            ));
            return;
        }

        let doesPlayerHaveTheRiddle = collider.riddleCollected.find(h => h == this.info.riddleThatHasThisObjectAsTheAnswer)

        if(doesPlayerHaveTheRiddle == null){

            //Reveals the first riddle to the player
            stateStack.push(new DialogueState(
                this.info.defaultMessage + "\n" + this.info.revealRiddle,
                Panel.TOP_DIALOGUE
            ));
    
            if(!this.addedToHintCollected){
                collider.riddleCollected.push(this.info.revealRiddle)
                this.addedToHintCollected = true
            }
        }
        else{
            //When the player has collected all the riddles, the knight ask the final question that the player must answer
            //correctly to proceed to the next level.
            //If the player give the wrong answer, they lose one health point.
            //If it is correct, the knight reveals where the hidden exit is.
            stateStack.push(new DialogueState(
                this.info.revealHint,
                Panel.TOP_DIALOGUE, 
                () => {
                    let userInput = prompt("What is the secret Message?", "") 

                    if(userInput != this.answer){
                        stateStack.push(new DialogueState(
                            "Wrong! You lost 1 health point. Be careful in your next try.",
                            Panel.TOP_DIALOGUE,
                            () => {
                                collider.receiveDamage(1)
                            }
                        ));
        
                    }
                    else{
                        stateStack.push(new DialogueState(
                            this.revealHiddenExit,
                            Panel.TOP_DIALOGUE,
                            () => {
                                collider.foundExit = true;
                            }
                        ));        
                    }

                }

            ));

        }

    }
}

