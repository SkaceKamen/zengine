export class Component {
	constructor(public entity: Component, options?) {
		this.start(options);
	}

	protected start(options?) {

	}

	public tick(delta: number) {

	}
}
