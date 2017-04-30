/// <reference path="./entity.ts" />

namespace ZEngine {
	export class Entity3D extends Entity {
		public transform: THREE.Object3D;
		public position: THREE.Vector3;
		public rotation: THREE.Quaternion;

		protected prestart() {	
			this.transform = new THREE.Object3D();
			this.transform.name = "Entity";
			this.position = this.transform.position;
			this.rotation = this.transform.quaternion;
			this.scene.scene.add(this.transform);
		}

		/**
		 * Removes entity from scene.
		 */
		public remove() {
			super.remove()
			this.scene.scene.remove(this.transform)
		}
	}
}