import State from "../../../lib/State.js";
import TitleScreenState from "./TitleScreenState.js";
import SoundName from "../../enums/SoundName.js";
import ImageName from "../../enums/ImageName.js";
import {
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateStack,
	timer,
} from "../../globals.js";
import TransitionState from "./TransitionState.js";
import Colour from "../../enums/Colour.js";

export default class GameOverState extends State {
	constructor() {
		super();

		this.titleScreen = new TitleScreenState();
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
		images.render(ImageName.GameOver, 0, 0);
		context.font = '38px Joystix';
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('Game Over', CANVAS_WIDTH / 2, 55);
	}

	renderText() {
		context.font = '10px Joystix';
		context.fillStyle = Colour.White;
		context.fillText('Press Enter To Go Back To Title Screen', CANVAS_WIDTH / 2, 155);
	}

	play() {
		TransitionState.fade(() => {
			stateStack.pop();
			stateStack.push(this.titleScreen);
		});
	}
}
