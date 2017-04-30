namespace ZEngine.Lib {
	export class LinkedList<T extends LinkedList.IItem> {
		protected static idCounter = 0;

		public id: number;
		public length: number = 0;
		public iter: LinkedList.Iterator<T>;

		protected start: LinkedList.InternalItem<T> = null;
		protected end: LinkedList.InternalItem<T> = null;

		public constructor() {
			this.id = LinkedList.idCounter++;
			this.iter = new LinkedList.Iterator<T>(this);
		}

		/**
		 * Checks if this list is empty.
		 */
		public empty() {
			return this.length == 0;
		}

		/**
		 * Pushes new item to end of list
		 *
		 * @param var content
		 * @return object list item, used for operation such as removing
		 */
		public push(obj: T) {
			var item = <LinkedList.InternalItem<T>>{
				previous: null,
				next: null,
				content: obj
			};
			
			if (!obj.__llReferences)
				obj.__llReferences = {};
			
			obj.__llReferences[this.id] = item;
			
			if (this.start == null) {
				this.start = item;
			}
			if (this.end == null) {
				this.end = item;
			} else {
				this.end.next = item;
				item.previous = this.end;
				item.next = null;
				this.end = item;
			}
			this.length++;
			return item;
		}

		/**
		 * Pops item from start
		 * @return object popped content
		 */
		public pop() {
			if (this.start == null)
				return null;
			
			var content = this.start.content;
			this.remove(this.start.content);
			return content;
		}

		/**
		 * Inserts content after specified item
		 *
		 * @param object after item to be inserted after
		 * @param var    obj   content to be inserted
		 * @return object list item
		 */
		public insert(after: T, obj: T) {	
			var item = {
				previous: null,
				next: null,
				content: obj
			};

			let af: LinkedList.InternalItem<T> = null;
			
			if (!obj.__llReferences)
				obj.__llReferences = {};
			
			obj.__llReferences[this.id] = item;
			
			if (after) {
				if (!after.__llReferences)
					after.__llReferences = {};
				af = after.__llReferences[this.id];
			}
			
			item.previous = af;
			item.next = af != null ? af.next : null;
			
			this.length++;
			
			//Insert at beginning
			if (after == null) {
				item.next = this.start;
				if (this.start != null)
					this.start.previous = item;
				this.start = item;
				if (this.end == null)
					this.end = this.start;
				return item;
			}
			
			//Update back reference
			if (af.next != null) {
				af.next.previous = item;
			}
			
			//Update next reference
			af.next = item;
			
			//Update ending reference
			if (af == this.end) {
				this.end = item;
			}
				
			return item;
		}

		/**
		 * Removes specified item from list
		 *
		 * @param object
		 * @return boolean true if item was removed, false if not
		 */
		public remove(obj: T) {
			var item = obj.__llReferences ? obj.__llReferences[this.id] : null;
			
			if (item === undefined || item == null)
				throw new Error("Item to be removed was not specified");
		
			delete(obj.__llReferences[this.id]);
		
			if (this.start == null || this.end == null)
				return false;
			
			this.length--;
			
			if (item == this.end && item == this.start) {
				this.end = null;
				this.start = null;
				return true;
			}
			
			if (item == this.end) {
				this.end = this.end.previous;
				if (this.end != null)
					this.end.next = null;
				return true;
			}
			
			if (item == this.start) {
				this.start = item.next;
				if (this.start != null)
					this.start.previous = null;
				return true;
			}
			
			item.previous.next = item.next;
			item.next.previous = item.previous;

			return true;
		}

		/**
		 * Checks if this list contains specified item.
		 */
		public contains(obj: T) {
			return !!obj.__llReferences && !!obj.__llReferences[this.id];
		}

		/**
		 * Cycles throught all items. Callback is called with following arguments:
		 *  item content
		 *  item
		 *  item index
		 *
		 * If callback returns anything considered as true, cycle will be stopped.
		 *
		 * @param function callback
		 */
		public each(callback: (value: T, item: LinkedList.InternalItem<T>, index: number) => boolean | void) {
			var current = this.start, index = 0;
			while(current != null) {
				if (callback(current.content, current, index))
					break;
				current = current.next;
				index++;
			}
		}
		
		public first() {
			return this.start != null ? this.start.content : null;
		}
		
		public last() {
			return this.end != null ? this.end.content : null;
		}
		
		public firstItem() {
			return this.start;
		}
		
		public lastItem() {
			return this.end;
		}
		
		public createIter() {
			return new LinkedList.Iterator<T>(this);
		}

		public toString() {
			var iter = new LinkedList.Iterator(this),
				str = "[",
				item = null;
			while(item = iter.next())
				str += item.toString() + ",";
			if (str.substr(str.length - 1, 1) == ",")
				str = str.substr(0, str.length - 1);
			str += "]";
			return str;
		}
	}

	export namespace LinkedList {
		export class InternalItem<T> {
			previous: InternalItem<T>;
			next: InternalItem<T>;
			content: T
		}

		export interface IItem {
			__llReferences: { [id: number]: InternalItem<any> };
		}

		export class Iterator<T extends LinkedList.IItem> {
			protected point: InternalItem<T> = null;
			
			constructor(public list: LinkedList<T>) {}

			public reset() {
				this.point = null;
			}

			public peek() {
				return this.point ? this.point.content : null;
			}

			public next() {
				if (this.point == null)
					this.point = this.list.firstItem();
				else
					this.point = this.point.next;
				return this.point ? this.point.content : null;
			}
		}
	}
}