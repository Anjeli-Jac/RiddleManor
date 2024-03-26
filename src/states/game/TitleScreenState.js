import State from "../../../lib/State.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import Colour from "../../enums/Colour.js";
import PlayState from "./PlayState.js";
import TransitionState from "./TransitionState.js";
import {
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	context,
	images,
	keys,
	sounds,
	stateStack,
	timer,
} from "../../globals.js";

export default class TitleScreenState extends State {
	constructor() {
		super();

		this.playState = new PlayState(1);
	}

	
	enter() {
		sounds.play(SoundName.Music);
	}

	exit() {
		sounds.stop(SoundName.Music);
		this.timer?.clear();
	}

	update() {
	
		if (keys.Enter) {
			keys.Enter = false;
			this.play();
		}
		
	}

	render() {
		context.save();
		
		this.renderTitle();
		this.renderText();
		context.restore();
	}

	renderTitle() {
		images.render(ImageName.Title, 0, 0);
		context.font = '35px Joystix';
		context.textAlign = 'center';
		context.fillStyle = Colour.Black;
		context.fillText('Riddle Manor', CANVAS_WIDTH / 2, 100);
		context.fillStyle = Colour.White;
		context.fillText('Riddle Manor', CANVAS_WIDTH / 2+4, 99);
	}

	renderText() {
		context.font = '15px Monospace';
		context.fillStyle = Colour.White;
		context.fillText('Press Enter to Start', CANVAS_WIDTH / 2, 175);
	}

	play() {
		TransitionState.fade(() => {
			stateStack.pop();
			stateStack.push(this.playState);
		});
	}
}
