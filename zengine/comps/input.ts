namespace ZEngine.Comps {
	export class Input extends Component {
		static name = "input";

		protected mouseButtons: { [code: number]: boolean } = {};
		protected mousePress: { [code: number]: boolean } = {};

		protected keys: { [code: number]: boolean } = {};
		protected press: { [code: number]: boolean } = {};

		public mouse: {
			x: number;
			y: number;
		} = {
			x: 0,
			y: 0
		};
		
		protected start() {
			window.addEventListener('keydown', (e) => this.onKeyDown(e));
			window.addEventListener('keyup', (e) => this.onKeyUp(e));

			window.addEventListener('mousedown', (e) => this.onMouseDown(e));
			window.addEventListener('mousemove', (e) => this.onMouseMove(e));
			window.addEventListener('mouseup', (e) => this.onMouseUp(e));

			window.addEventListener('contextmenu', (e) => { e.stopPropagation(); e.preventDefault(); });
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
		}
	}
}