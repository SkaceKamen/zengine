import { Scene } from './scene';
import { Renderer } from './renderer';
import { Entity } from "./entity";
import { Time } from "./time";
import { Mouse } from "./mouse";
import { Screen } from "./screen";

export function fixed (input: number, n: number = 3) {
	var ex = Math.pow(10, n);
	return Math.round(input * ex) / ex;
}

export class Game {
	public scene: Scene;
	public renderer: Renderer;

	public time: Time;
	public mouse: Mouse;
	public screen: Screen;

	public targetFps = 60;

	public window: Window

	protected interval = 0;

	constructor(win?: Window) {
		this.window = win || window;

		this.time = new Time();
		this.mouse = new Mouse();
		this.screen = new Screen(this, this.window);
		this.renderer = new Renderer(this);

		this.initTicker();
		this.start();
	}

	/**
	 * Called when engine is inicialized.
	 */
	protected start() {
		this.tick(0);
	}

	public loadScene<T extends Scene>(scene: { new(...args: any[]): T }) {
		this.scene = new scene(this);

		// For debuggers
		window['scene'] = this.scene.scene;

		return this.scene;
	}

	/**
	 * Creates new instance of specified entity.
	 */
	public create<T extends Entity>(base: { new(...args: any[]): T }) {
		return this.scene.create(base);
	}

	/**
	 * Creates appropriate frame update function
	 * @source https://github.com/underscorediscovery/realtime-multiplayer-in-html5/blob/master/game.core.js
	 */
	protected initTicker() {
		this.time.sleep = 1000 / this.targetFps;

		var vendors = [ 'ms', 'moz', 'webkit', 'o' ],
			frame_time = this.time.sleep;
		var window = this.window;

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
		this.time.delta = this.time.lastframetime ? fixed((t - this.time.lastframetime)/1000.0) : (this.time.sleep / 100);

		// Store the last frame time
		this.time.lastframetime = t;

		// Update real mouse position with view
		this.mouse.x = this.mouse.elementX;
		this.mouse.y = this.mouse.elementY;

		// Update the game specifics
		this.update(this.time.delta);
		this.render(this.time.delta);

		// Schedule the next update
		this.interval = this.window.requestAnimationFrame(this.tick.bind(this));
	}

	/**
	 * Calls tick for every entity.
	 */
	protected update(delta: number) {
		this.scene.update(delta);
	}

	/**
	 * Renders current scene.
	 */
	protected render(delta: number) {
		this.scene.render(delta);
	}
}

export default Game
