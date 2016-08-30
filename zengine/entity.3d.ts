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
	}
}