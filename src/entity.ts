import { InternalItem, IItem } from "./lib/linked.list";
import { Scene } from "./scene";
import { Component } from "./component";

export class Entity implements IItem {
	public __llReferences: { [id: number]: InternalItem<any> };

	protected __removed = false;

	constructor(public scene: Scene) {
		this.prestart();
		this.start();
	}

	/**
	 * Adds component to this entity.
	 */
	protected addComponent<T extends Component>(cmp: { new(...args: any[]): T }, options?) {
		return new cmp(this, options);
	}

	public prestart() {

	}

	/**
	 * Called when entity is inicialized.
	 */
	public start() {

	}

	/**
	 * Removes entity from scene.
	 */
	public remove() {
		this.scene.remove(this);
	}

	/**
	 * Called when entity is removed from scene.
	 */
	public onRemove() {

	}

	public tick(delta: number) {

	}
}

export default Entity
