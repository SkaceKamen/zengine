namespace ZEngine.Comps {
	export class Input extends Component {
		static name = "input";

		protected mouseButtons: { [code: number]: boolean } = {};
		protected mousePress: { [code: number]: boolean } = {};

		protected keys: { [code: number]: boolean } = {};
		protected press: { [code: number]: boolean } = {};

		public locked = false;

		protected lockRequested = false;

		public mouse: {
			x: number;
			y: number;
			movementX: number;
			movementY: number;
		} = {
			x: 0,
			y: 0,
			movementX: 0,
			movementY: 0
		};

		protected start() {
			window.addEventListener('keydown', (e) => this.onKeyDown(e));
			window.addEventListener('keyup', (e) => this.onKeyUp(e));

			window.addEventListener('click', e => this.onClick(e))
			window.addEventListener('mousedown', (e) => this.onMouseDown(e));
			window.addEventListener('mousemove', (e) => this.onMouseMove(e));
			window.addEventListener('mouseup', (e) => this.onMouseUp(e));

			window.addEventListener('contextmenu', (e) => { e.stopPropagation(); e.preventDefault(); });

			let handlers = [ 'pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockchange' ];
			let errorHandlers = [ 'pointerlockerror', 'mozpointerlockerror', 'webkitpointerlockerror' ];

			for (var i in handlers) {
				document.addEventListener(handlers[i], (event) => {
					this.locked = this.onPointerLockChange(event);
				}, false);
			}

			for (var i in errorHandlers) {
				document.addEventListener(errorHandlers[i], (event) => {
					this.locked = false;
				}, false);
			}
		}

		protected onClick (event: MouseEvent) {
			if (this.lockRequested) {
				this.lockRequested = false;
				this.actuallyLockPointer();
			}
		}

		protected onMouseMove(event: MouseEvent) {
			var mouseX, mouseY;

			if (event.clientX) {
				mouseX = event.clientX;
				mouseY = event.clientY;
			}
			else if(event.layerX) {
				mouseX = event.layerX;
				mouseY = event.layerY;
			}

			this.mouse.x = mouseX;
			this.mouse.y = mouseY;

			this.mouse.movementX += event.movementX || (<any>event).mozMovementX || (<any>event).webkitMovementX || 0;
			this.mouse.movementY += event.movementY || (<any>event).mozMovementY || (<any>event).webkitMovementY || 0;
		}

		protected onMouseDown(e: MouseEvent) {
			this.mouseButtons[e.button] = true;
			this.mousePress[e.button] = true;
		}

		protected onMouseUp(e: MouseEvent) {
			this.mouseButtons[e.button] = false;
		}

		protected onKeyDown(e: KeyboardEvent) {
			this.keys[e.keyCode] = true;
			this.press[e.keyCode] = true;
		}

		protected onKeyUp(e: KeyboardEvent) {
			this.keys[e.keyCode] = false;
		}

		public keyPressed(code: number) {
			return !!this.press[code];
		}

		public keyDown(code: number) {
			return !!this.keys[code];
		}

		public keyUp(code: number) {
			return !!!this.keys[code];
		}

		public mouseDown(code: number) {
			return !!this.mouseButtons[code];
		}

		public mousePressed(code: number) {
			return !!this.mousePress[code];
		}

		public tick(delta: number) {
			this.press = {};
			this.mousePress = {};
			this.mouse.movementX = 0;
			this.mouse.movementY = 0;
		}

		public lockPointer() {
			this.lockRequested = true;
		}

		protected actuallyLockPointer() {
			document.body.requestPointerLock = document.body.requestPointerLock || (<any>document.body).mozRequestPointerLock || (<any>document.body).webkitRequestPointerLock;
			document.body.requestPointerLock();
		}

		private onPointerLockChange(event) {
			return (
				document.pointerLockElement === document.body ||
				(<any>document).mozPointerLockElement === document.body ||
				(<any>document).webkitPointerLockElement === document.body
			);
		}
	}
}