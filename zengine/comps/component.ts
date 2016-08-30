namespace ZEngine.Comps {
	export class Component {
		static name = "component";

		constructor(public entity: Entity, options?) {
			this.start(options);
		}

		protected start(options?) {

		}

		public tick(delta: number) {

		}
	}
}