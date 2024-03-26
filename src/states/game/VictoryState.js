import State from "../../../lib/State.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
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
import PlayState from "./PlayState.js";

export default class VictoryState extends State {
	constructor(player, levelNum) {
		super();
		this.player = player;
		this.playstate = new PlayState(levelNum + 1);
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
		images.render(ImageName.Victory, 0, 0);
		context.font = '50px Joystix';
		context.textAlign = 'center';
		context.fillStyle = Colour.White;
		context.fillText('Victory', CANVAS_WIDTH / 2, 100);
	}

	renderText() {
		context.font = '12px Joystix';
		context.fillStyle = Colour.White;
		context.fillText('Press Enter To Go To The Next Level', CANVAS_WIDTH / 2, 155);
	}

	play() {
		TransitionState.fade(() => {
			stateStack.pop();
			stateStack.push(this.playstate);
		});
	}

}
