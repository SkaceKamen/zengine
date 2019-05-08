import { LinkedList } from "./lib/linked.list";
import { Entity } from "./entity";
import { Game } from "./game";

export class Scene {
	public entities = new LinkedList<Entity>();

	public scene: THREE.Scene;
	public camera: THREE.Camera;

	public constructor(public game: Game, protected startArg?: any) {
		this.camera = this.createCamera();
		this.scene = this.createScene();

		this.scene.name = "Scene";
		this.camera.name = "Main camera";

		this.start();
	}

	/**
	 * Called when scene is ready.
	 */
	protected start() {

	}

	/**
	 * Builds main camera used for this scene.
	 */
	protected createCamera(): THREE.Camera {
		return new THREE.PerspectiveCamera(70, this.game.screen.width / this.game.screen.height, 0.1, 1E5);
	}

	/**
	 * Builds main camera used for this scene.
	 */
	protected createScene(): THREE.Scene {
		return new THREE.Scene();
	}

	/**
	 * Creates new instance of specified entity.
	 */
	public create<T extends Entity>(base: { new(...args: any[]): T }) {
		var instance = new base(this);
		this.entities.push(instance);
		return instance;
	}

	/**
	 * Finally removes entity from scene
	 */
	public remove(entity: Entity) {
		entity.onRemove();
		(<any>entity).__removed = true;
		entity.scene = null;

		this.entities.remove(entity);
	}

	/**
	 * Calls tick for every entity.
	 */
	public update(delta: number) {
		var item;

		this.entities.iter.reset();
		while(item = this.entities.iter.next()) {
			item.tick(delta);
		}
	}

	/**
	 * Renders current scene.
	 */
	public render(delta: number) {
		this.game.renderer.render(this);
	}
}

export default Scene
