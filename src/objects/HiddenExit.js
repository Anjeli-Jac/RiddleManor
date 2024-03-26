import MapObject from "./MapObjects.js";
import DialogueState from "../states/game/DialogueState.js";
import Panel from "../user-interface/elements/Panel.js";
import { stateStack } from "../globals.js";
import VictoryState from "../states/game/VictoryState.js";
import TransitionState from "../states/game/TransitionState.js";

export default class HiddenExit extends MapObject{

    /**
     * 
     * Special map object that serves as the hidden exit for the level.
     * It has multiple texts that appear when interacted with, depending on the the progress of the player in the level.
     * 
     * @param {*} position 
     * @param {*} dimension 
     * @param {*} info 
     * @param {*} collisionObjectLayer 
     */
    constructor(position, dimension, info, collisionObjectLayer, level){
        super(position, dimension, info, collisionObjectLayer);
        this.info = info;
        this.level = level;
    }

    onCollision(collider){

        if(collider.foundExit){
            //If the player has successfully found this object which is the hidden exit after answering the riddler's question,
            //then they can leave to go to the victory state
            stateStack.push(new DialogueState(
                "Congrats...You are now closer to the real exit of the manor...",
                Panel.TOP_DIALOGUE,
                () => {
                    TransitionState.fade(() => {
                        stateStack.pop();
                        stateStack.push(new VictoryState(collider, this.level));
                    });
                }
            ));

        }
        else{
            //If not, show the default message
            stateStack.push(new DialogueState(
                this.info.defaultMessage,
                Panel.TOP_DIALOGUE
            ));
        }

    }
}