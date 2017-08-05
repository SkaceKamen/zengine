import { Entity } from "./entity";
import { Renderer } from "./renderer";
import { Screen } from "./screen";
import { Scene } from "./scene"
import { Game } from "./game";
import { Eventor } from "./eventor";

export class Debugger extends Game {
	camera: THREE.Camera
	screen: Screen

	helperScene: THREE.Scene

	game: Game

	onClose: Eventor<void> = new Eventor<void>()

	protected start() {
		this.open();
		super.start();
	}

	public open () {
		var left = localStorage.getItem('left') || 0
		var top = localStorage.getItem('top') || 0
		var width = localStorage.getItem('width') || 800
		var height = localStorage.getItem('height') || 640

		this.window = window.open("", "_blank", "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top);
		this.window.document.head.innerHTML += "<html><head><title>ZEngine Debug</title><style>*{padding:0;margin:0;}</style></head><body></body></html>";
		this.window.moveTo(parseFloat(left.toString()), parseFloat(top.toString()));

		this.screen = new Screen(null, this.window);
		this.renderer = new Renderer(this, this.window.document.getElementsByTagName('body')[0]);

		this.loadScene(HelperScene)

		this.window.onunload = () => {
			localStorage.setItem('width', this.window.innerWidth.toString());
			localStorage.setItem('height', this.window.innerHeight.toString());
			localStorage.setItem('left', this.window.screenLeft.toString());
			localStorage.setItem('top', this.window.screenTop.toString());

			this.onClose.trigger();
		}

		window.onunload = () => {
			this.window.close();
		}
	}

	public assign(game: Game) {
		this.game = game;
		(<HelperScene>this.scene).tracked = game
	}
}

class HelperScene extends Scene {
	public tracked: Game;
	public gameScene: Scene;
	public grid: THREE.Object3D

	protected start () {
		super.start();

		this.scene.add(this.grid = new THREE.GridHelper(1000, 100))

		this.camera.position.set(100,100,100)
		this.camera.lookAt(new THREE.Vector3())
	}

	update (delta: number) {
		super.update(delta);

		if (this.tracked) {
			if (this.gameScene != this.tracked.scene) {
				if (this.gameScene) {
					this.scene.remove(this.gameScene.scene);
				}
				this.gameScene = this.tracked.scene;
				this.scene.add(this.gameScene.scene);
			}
		}
	}
}