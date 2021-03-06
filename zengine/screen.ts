namespace ZEngine {
	export interface ScreenSize {
		width: number;
		height: number;
	}
	
	export class Screen {
		public width: number;
		public height: number;

		public onResize = new Eventor<ScreenSize>();

		public constructor(public game: Game) {
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
			var e: any = window, a = 'inner';
			if (!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return <ScreenSize>{
				width:  <number>e[a + 'Width'],
				height: <number>e[a + 'Height']
			}
		}
	}
}