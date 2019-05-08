import { Entity } from "./entity";
import { LinkedList } from "./index";

export class Entity3D extends Entity {
	public transform: THREE.Object3D;
	public position: THREE.Vector3;
	public rotation: THREE.Quaternion;

	public parent: Entity3D = null;
	public children: LinkedList<Entity3D>;

	public prestart() {
		this.transform = new THREE.Object3D();
		this.transform.name = "Entity";
		this.position = this.transform.position;
		this.rotation = this.transform.quaternion;
		this.scene.scene.add(this.transform);
		this.children = new LinkedList();
	}

	/**
	 * Removes entity from scene.
	 */
	public remove() {
		if (this.parent === null) {
			this.scene.scene.remove(this.transform)
		} else {
			this.parent.children.remove(this)
			this.parent.transform.remove(this.transform)
		}
		super.remove()
	}

	/**
	 * Adds entity as child to this entity
	 * @param base
	 */
	public create<T extends Entity3D>(base: { new(...args: any[]): T }) {
		var instance = this.scene.create(base)

		this.children.push(instance)

		// Needed when removing child
		instance.parent = this
		// Remove from normal scene
		this.scene.scene.remove(instance.transform)
		// Add it to this entity
		this.transform.add(instance.transform)

		return instance;
	}
}

export default Entity3D
