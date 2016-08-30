namespace ZEngine {
	/**
	 * Ugly hack to make sure we always have same floating point.
	 */
	Number.prototype.fixed = function(n) {
		n = n || 3;
		var ex = Math.pow(10, n);
		return Math.round(this * ex) / ex;
	};
	
	export class Game {
		public entities = new Lib.LinkedList<Entity>();

		public scene: Scene;
		public renderer: Renderer;

		public time: Time;
		public mouse: Mouse;
		public screen: Screen;

		public targetFps = 60;

		protected interval = 0;

		constructor() {
			this.time = new Time();
			this.mouse = new Mouse();
			this.screen = new Screen(this);
			this.renderer = new Renderer(this);

			this.initTicker();
		}

		/**
		 * Creates new instance of specified entity.
		 */
		public create<T extends Entity>(base: { new(...args: any[]): T }) {
			var instance = new base(this.scene);
			this.entities.push(instance);
			return instance;
		}

		/**
		 * Creates appropriate frame update function
		 * @source https://github.com/underscorediscovery/realtime-multiplayer-in-html5/blob/master/game.core.js
		 */
		protected initTicker() {
			this.time.sleep = 1000 / this.targetFps;
		
			var vendors = [ 'ms', 'moz', 'webkit', 'o' ],
				frame_time = this.time.sleep;

			for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x) {
				window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
				window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
			}

			if (!window.requestAnimationFrame || this.targetFps != 60) {
				var lastTime = 0;
				window.requestAnimationFrame = function ( callback ) {
					var currTime = Date.now(), timeToCall = Math.max( 0, frame_time - ( currTime - lastTime ) );
					var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
					lastTime = currTime + timeToCall;
					return id;
				};
			}

			if (!window.cancelAnimationFrame) {
				window.cancelAnimationFrame = function ( id ) { clearTimeout( id ); };
			}
		}

		protected tick(t: number) {
			// Work out the delta time
			this.time.delta = this.time.lastframetime ? ( (t - this.time.lastframetime)/1000.0).fixed() : (this.time.sleep / 100);

			// Store the last frame time
			this.time.lastframetime = t;

			// Update real mouse position with view
			this.mouse.x = this.mouse.elementX;
			this.mouse.y = this.mouse.elementY;

			// Update the game specifics
			this.update(this.time.delta);
			this.render(this.time.delta);

			// Schedule the next update
			this.interval = window.requestAnimationFrame(() => this.tick);
		}

		/**
		 * Calls tick for every entity.
		 */
		protected update(delta: number) {
			var item;

			this.entities.iter.reset();
			while(item = this.entities.iter.next()) {
				item.tick(delta);
			}
		}

		/**
		 * Renders current scene.
		 */
		protected render(delta: number) {
			this.renderer.render(this.scene);
		}
	}
}