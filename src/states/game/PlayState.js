import State from "../../../lib/State.js";
import SoundName from "../../enums/SoundName.js";
import { keys, sounds, stateStack, mapList,context,CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";
import Map from "../../services/Map.js";
import DialogueState from "./DialogueState.js";
import Panel from "../../user-interface/elements/Panel.js";
import GameOverState from "./GameOverState.js";
import LevelMaker from "../../services/LevelMaker.js";
import Camera from "../../../lib/Camera.js";
import Player from "../../entities/Player.js";
import Vector from "../../../lib/Vector.js";
import Tile from "../../services/Tile.js";
import Colour from "../../enums/Colour.js";
import JournalState from "./JournalState.js";

export default class PlayState extends State {
	constructor(level) {
		super();
		this.level = level;
		this.player = null;
		this.camera=null;
	}

	
	enter(){
		sounds.play(SoundName.Music);
		this.level = LevelMaker.createLevel(this.level);

		stateStack.push(new DialogueState(
			this.level.welcomeText,
			Panel.TOP_DIALOGUE
		));

		this.player=this.level.player
		this.camera = new Camera(
			this.player,
			this.level.map.canvasDimensions,
			new Vector(CANVAS_WIDTH, CANVAS_HEIGHT)
		);
	}

	render() {
		this.renderViewport();
	}

	update(dt) {
		this.level.update(dt);
		this.camera.update(dt);

		if (keys.Escape) {
			keys.Escape = false;
			stateStack.push(new JournalState(this.player));
		}
	}

	renderViewport() {
		context.save();
		context.translate(-this.camera.position.x, this.camera.position.y);
		this.level.render();
		this.level.playerUI.render(this.camera.position);

		context.font = '15px Joystix';
		context.fillStyle = Colour.White;
		context.fillText(`LEVEL ${this.level.number}`, this.camera.position.x + Tile.SIZE, Tile.SIZE * 2);

		context.restore();
	}
	
}
