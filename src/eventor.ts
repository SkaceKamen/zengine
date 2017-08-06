/**
 * Simple class for events
 */
export class Eventor<T> {
	listeners = [];

	on(callback: (value?: T) => void) {
		this.listeners.push(callback);
	}

	off(callback) {
		let index = this.listeners.indexOf(callback);
		if (index >= 0) {
			this.listeners.splice(index, 1);
		}
	}

	trigger(value?: T) {
		for (let i = 0; i < this.listeners.length; i++) {
			this.listeners[i].apply(this.listeners[i], [value]);
		}
	}

	then(callback: (value?: T) => void) {
		return this.on(callback);
	}

	listen(callback) {
		return this.on(callback);
	}

	remove(callback) {
		return this.remove(callback);
	}

	stop(callback) {
		return this.remove(callback);
	}
}

export default Eventor
