declare namespace ZEngine.Comps {
    class Component {
        entity: Entity;
        static name: string;
        constructor(entity: Entity, options?: any);
        protected start(options?: any): void;
        tick(delta: number): void;
    }
}
declare namespace ZEngine.Comps {
    class Input extends Component {
        static name: string;
        protected mouseButtons: {
            [code: number]: boolean;
        };
        protected mousePress: {
            [code: number]: boolean;
        };
        protected keys: {
            [code: number]: boolean;
        };
        protected press: {
            [code: number]: boolean;
        };
        mouse: {
            x: number;
            y: number;
        };
        protected start(): void;
        protected onMouseMove(event: MouseEvent): void;
        protected onMouseDown(e: MouseEvent): void;
        protected onMouseUp(e: MouseEvent): void;
        protected onKeyDown(e: KeyboardEvent): void;
        protected onKeyUp(e: KeyboardEvent): void;
        keyPressed(code: number): boolean;
        keyDown(code: number): boolean;
        keyUp(code: number): boolean;
        mouseDown(code: number): boolean;
        mousePressed(code: number): boolean;
        tick(delta: number): void;
    }
}
declare namespace ZEngine {
}
declare namespace ZEngine {
    class Entity implements Lib.LinkedList.IItem {
        scene: Scene;
        __llReferences: {
            [id: number]: Lib.LinkedList.InternalItem<any>;
        };
        protected __removed: boolean;
        constructor(scene: Scene);
        /**
         * Adds component to this entity.
         */
        protected addComponent<T extends Comps.Component>(cmp: {
            new (...args: any[]): T;
        }, options?: any): T;
        protected prestart(): void;
        /**
         * Called when entity is inicialized.
         */
        protected start(): void;
        /**
         * Removes entity from scene.
         */
        remove(): void;
        /**
         * Called when entity is removed from scene.
         */
        onRemove(): void;
        tick(delta: number): void;
    }
}
declare namespace ZEngine {
    class Entity3D extends Entity {
        transform: THREE.Object3D;
        position: THREE.Vector3;
        rotation: THREE.Quaternion;
        protected prestart(): void;
        /**
         * Removes entity from scene.
         */
        remove(): void;
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
        scene: Scene;
        renderer: Renderer;
        time: Time;
        mouse: Mouse;
        screen: Screen;
        targetFps: number;
        protected interval: number;
        constructor();
        /**
         * Called when engine is inicialized.
         */
        protected start(): void;
        loadScene<T extends Scene>(scene: {
            new (...args: any[]): T;
        }): Scene;
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
    let Keys: {
        0: number;
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        Backspace: number;
        Tab: number;
        Enter: number;
        Shift: number;
        Ctrl: number;
        Alt: number;
        Break: number;
        CapsLock: number;
        Escape: number;
        Space: number;
        PageUp: number;
        PageDown: number;
        End: number;
        Home: number;
        Left: number;
        Up: number;
        Right: number;
        Down: number;
        Insert: number;
        Delete: number;
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
        F: number;
        G: number;
        H: number;
        I: number;
        J: number;
        K: number;
        L: number;
        M: number;
        N: number;
        O: number;
        P: number;
        Q: number;
        R: number;
        S: number;
        T: number;
        U: number;
        V: number;
        W: number;
        X: number;
        Y: number;
        Z: number;
        LeftWindows: number;
        RightWindows: number;
        Select: number;
        Num0: number;
        Num1: number;
        Num2: number;
        Num3: number;
        Num4: number;
        Num5: number;
        Num6: number;
        Num7: number;
        Num8: number;
        Num9: number;
        NumMultiply: number;
        NumPlus: number;
        NumSubstract: number;
        NumDecimal: number;
        NumDivide: number;
        F1: number;
        F2: number;
        F3: number;
        F4: number;
        F5: number;
        F6: number;
        F7: number;
        F8: number;
        F9: number;
        F10: number;
        F11: number;
        F12: number;
        NumLock: number;
        ScrollLock: number;
        SemiColon: number;
        EqualSign: number;
        Comma: number;
        Dash: number;
        Period: number;
        FowardSlash: number;
        Grave: number;
    };
    let MouseButtons: {
        Left: number;
        Right: number;
        Middle: number;
    };
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
        insert(after: T, obj: T): {
            previous: any;
            next: any;
            content: T;
        };
        /**
         * Removes specified item from list
         *
         * @param object
         * @return boolean true if item was removed, false if not
         */
        remove(obj: T): boolean;
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
        game: Game;
        entities: Lib.LinkedList<Entity>;
        scene: THREE.Scene;
        camera: THREE.Camera;
        constructor(game: Game);
        /**
         * Called when scene is ready.
         */
        protected start(): void;
        /**
         * Builds main camera used for this scene.
         */
        protected createCamera(): THREE.Camera;
        /**
         * Builds main camera used for this scene.
         */
        protected createScene(): THREE.Scene;
        /**
         * Creates new instance of specified entity.
         */
        create<T extends Entity>(base: {
            new (...args: any[]): T;
        }): T;
        /**
         * Finally removes entity from scene
         */
        remove(entity: Entity): void;
        /**
         * Calls tick for every entity.
         */
        update(delta: number): void;
        /**
         * Renders current scene.
         */
        render(delta: number): void;
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
