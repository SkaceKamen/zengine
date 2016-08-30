namespace ZEngine {
	export class Entity implements Lib.LinkedList.IItem {
		public __llReferences: { [id: number]: Lib.LinkedList.InternalItem<any> };
		
		protected __removed = false;

		constructor(public scene: Scene) {
			this.prestart();
			this.start(scene);
		}

		/**
		 * Adds component to this entity.
		 */
		protected addComponent<T extends Comps.Component>(cmp: { new(...args: any[]): T }, options?) {
			return new cmp(this, options);
		}

		protected prestart() {
			
		}

		/**
		 * Called when entity is inicialized.
		 */
		protected start(scene: Scene) {

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
}