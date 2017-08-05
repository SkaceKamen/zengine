import { Game } from "./game";
import { Eventor } from "./eventor";

export interface ScreenSize {
	width: number;
	height: number;
}

export class Screen {
	public width: number;
	public height: number;

	public onResize = new Eventor<ScreenSize>();

	public constructor(public game: Game, public window: Window) {
		var size = this.viewport();

		this.width = size.width;
		this.height = size.height;

		window.addEventListener('resize', () => this.resized(), false);
	}

	protected resized() {
		var size = this.viewport();

		this.width = size.width;
		this.height = size.height;

		this.onResize.trigger(size);
	}

	public viewport() {
		var e: any = this.window, a = 'inner';
		if (!('innerWidth' in this.window)) {
			a = 'client';
			e = this.window.document.documentElement || this.window.document.body;
		}
		return <ScreenSize>{
			width:  <number>e[a + 'Width'],
			height: <number>e[a + 'Height']
		}
	}
}

export default Screen
