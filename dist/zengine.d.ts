declare namespace ZEngine {
    class Entity implements Lib.LinkedList.IItem {
        scene: Scene;
        __llReferences: {
            [id: number]: Lib.LinkedList.InternalItem<any>;
        };
        constructor(scene: Scene);
        protected start(scene: Scene): void;
        tick(delta: number): void;
    }
}
declare namespace ZEngine {
    /**
     * Simple class for events
     */
    class Eventor<T> {
        listeners: any[];
        on(callback: (value?: T) => void): void;
        off(callback: any): void;
        trigger(value?: T): void;
        then(callback: any): void;
        listen(callback: any): void;
        remove(callback: any): any;
        stop(callback: any): any;
    }
}
declare namespace ZEngine {
    class Game {
        entities: Lib.LinkedList<Entity>;
        scene: Scene;
        renderer: Renderer;
        time: Time;
        mouse: Mouse;
        screen: Screen;
        targetFps: number;
        protected interval: number;
        constructor();
        /**
         * Creates new instance of specified entity.
         */
        create<T extends Entity>(base: {
            new (...args: any[]): T;
        }): T;
        /**
         * Creates appropriate frame update function
         * @source https://github.com/underscorediscovery/realtime-multiplayer-in-html5/blob/master/game.core.js
         */
        protected initTicker(): void;
        protected tick(t: number): void;
        /**
         * Calls tick for every entity.
         */
        protected update(delta: number): void;
        /**
         * Renders current scene.
         */
        protected render(delta: number): void;
    }
}
declare namespace ZEngine {
    class Mouse {
        x: number;
        y: number;
        elementX: number;
        elementY: number;
    }
}
declare namespace ZEngine {
    class Renderer {
        game: Game;
        protected renderer: THREE.WebGLRenderer;
        constructor(game: Game);
        protected onResize(size: ScreenSize): void;
        render(scene: Scene): void;
    }
}
declare namespace ZEngine {
    class Scene {
        scene: THREE.Scene;
        camera: THREE.Camera;
    }
}
declare namespace ZEngine {
    interface ScreenSize {
        width: number;
        height: number;
    }
    class Screen {
        game: Game;
        width: number;
        height: number;
        onResize: Eventor<ScreenSize>;
        constructor(game: Game);
        protected resized(): void;
        viewport(): ScreenSize;
    }
}
declare namespace ZEngine {
    class Time {
        delta: number;
        sleep: number;
        lastframetime: number;
    }
}
declare namespace ZEngine.Lib {
    class LinkedList<T extends LinkedList.IItem> {
        protected static idCounter: number;
        id: number;
        length: number;
        iter: LinkedList.Iterator<T>;
        protected start: LinkedList.InternalItem<T>;
        protected end: LinkedList.InternalItem<T>;
        constructor();
        /**
         * Checks if this list is empty.
         */
        empty(): boolean;
        /**
         * Pushes new item to end of list
         *
         * @param var content
         * @return object list item, used for operation such as removing
         */
        push(obj: T): LinkedList.InternalItem<T>;
        /**
         * Pops item from start
         * @return object popped content
         */
        pop(): T;
        /**
         * Inserts content after specified item
         *
         * @param object after item to be inserted after
         * @param var    obj   content to be inserted
         * @return object list item
         */
        insert(after: any, obj: any): {
            previous: any;
            next: any;
            content: any;
        };
        /**
         * Removes specified item from list
         *
         * @param object item (not content!)
         * @return boolean true if item was removed, false if not
         */
        remove(obj: any): boolean;
        /**
         * Checks if this list contains specified item.
         */
        contains(obj: T): boolean;
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
        each(callback: (value: T, item: LinkedList.InternalItem<T>, index: number) => boolean | void): void;
        first(): T;
        last(): T;
        firstItem(): LinkedList.InternalItem<T>;
        lastItem(): LinkedList.InternalItem<T>;
        createIter(): LinkedList.Iterator<T>;
        toString(): string;
    }
    namespace LinkedList {
        class InternalItem<T> {
            previous: InternalItem<T>;
            next: InternalItem<T>;
            content: T;
        }
        interface IItem {
            __llReferences: {
                [id: number]: InternalItem<any>;
            };
        }
        class Iterator<T extends LinkedList.IItem> {
            list: LinkedList<T>;
            protected point: InternalItem<T>;
            constructor(list: LinkedList<T>);
            reset(): void;
            peek(): T;
            next(): T;
        }
    }
}
