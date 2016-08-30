namespace ZEngine {
	export class Entity implements Lib.LinkedList.IItem {
		public __llReferences: { [id: number]: Lib.LinkedList.InternalItem<any> };

		constructor(public scene: Scene) {
			this.start(scene);
		}

		protected start(scene: Scene) {

		}

		public tick(delta: number) {}
	}
}