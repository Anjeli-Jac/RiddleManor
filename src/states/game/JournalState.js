
import State from "../../../lib/State.js";
import { keys, sounds, stateStack } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";
import Panel from "../../user-interface/elements/Panel.js";
import Textbox from "../../user-interface/elements/Textbox.js";

	/**
	 * 
	 * A UI element that created the journal to view the important
	 * information that the player get
	 *
	 * */
export default class JournalState extends State {
	constructor(player) {
		super();

		this.player=player
		this.text=null;
		this.panel = null;
	}

	enter() {
		sounds.play(SoundName.MenuOpen);
		
		for( let i=0; i<this.player.riddleCollected.length;i++){
			if(this.player.riddleCollected[i]!=null){
				if(this.text==null){
					this.text=this.player.riddleCollected[i]
				}
				else{
					this.text = this.text+"\n \n"+this.player.riddleCollected[i]
				}
				if(this.player.hintCollected[i]!=null){
					this.text = this.text+"\n \n"+this.player.hintCollected[i]
				}
				
			}
		}
		if(this.text ==null){
			this.text = "empty"
		}
		this.panel = new Textbox(
			Panel.NOTEBOOK_STATS.x,
			Panel.NOTEBOOK_STATS.y,
			Panel.NOTEBOOK_STATS.width,
			Panel.NOTEBOOK_STATS.height,
			this.text,
			{ isAdvanceable: true }
		);
	}

	update(dt) {
		this.panel.update();

		if (this.panel.isClosed) {
			stateStack.pop();
		}
		
	}

	render() {
		this.panel.render();
	}
}
