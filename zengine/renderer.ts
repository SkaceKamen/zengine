namespace ZEngine {
	export class Renderer {
		protected renderer: THREE.WebGLRenderer;

		constructor(public game: Game) {
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(game.screen.width, game.screen.height);

			this.game.screen.onResize.then((size) => this.onResize(size))
		}

		protected onResize(size: ScreenSize) {
			this.renderer.setSize(size.width, size.height);
			
			if (this.game.scene.camera instanceof THREE.PerspectiveCamera) {
				(<THREE.PerspectiveCamera>this.game.scene.camera).aspect = size.width / size.height;
				(<THREE.PerspectiveCamera>this.game.scene.camera).updateProjectionMatrix();
			}
		}

		public render(scene: Scene) {
			this.renderer.render(scene.scene, scene.camera);
		}
	}
}