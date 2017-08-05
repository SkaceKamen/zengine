var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ZEngine;
(function (ZEngine) {
    var Entity = (function () {
        function Entity(scene) {
            this.scene = scene;
            this.__removed = false;
            this.prestart();
            this.start();
        }
        /**
         * Adds component to this entity.
         */
        Entity.prototype.addComponent = function (cmp, options) {
            return new cmp(this, options);
        };
        Entity.prototype.prestart = function () {
        };
        /**
         * Called when entity is inicialized.
         */
        Entity.prototype.start = function () {
        };
        /**
         * Removes entity from scene.
         */
        Entity.prototype.remove = function () {
            this.scene.remove(this);
        };
        /**
         * Called when entity is removed from scene.
         */
        Entity.prototype.onRemove = function () {
        };
        Entity.prototype.tick = function (delta) {
        };
        return Entity;
    }());
    ZEngine.Entity = Entity;
})(ZEngine || (ZEngine = {}));
/// <reference path="./entity.ts" />
var ZEngine;
/// <reference path="./entity.ts" />
(function (ZEngine) {
    var Entity3D = (function (_super) {
        __extends(Entity3D, _super);
        function Entity3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Entity3D.prototype.prestart = function () {
            this.transform = new THREE.Object3D();
            this.transform.name = "Entity";
            this.position = this.transform.position;
            this.rotation = this.transform.quaternion;
            this.scene.scene.add(this.transform);
        };
        /**
         * Removes entity from scene.
         */
        Entity3D.prototype.remove = function () {
            if (this.parent === null) {
                this.scene.scene.remove(this.transform);
            }
            else {
                this.parent.transform.remove(this.transform);
            }
            _super.prototype.remove.call(this);
        };
        /**
         * Adds entity as child to this entity
         * @param base
         */
        Entity3D.prototype.create = function (base) {
            var instance = this.scene.create(base);
            // Needed when removing child
            instance.parent = this;
            // Remove from normal scene
            this.scene.scene.remove(instance.transform);
            // Add it to this entity
            this.transform.add(instance.transform);
            return instance;
        };
        return Entity3D;
    }(ZEngine.Entity));
    ZEngine.Entity3D = Entity3D;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    /**
     * Simple class for events
     */
    var Eventor = (function () {
        function Eventor() {
            this.listeners = [];
        }
        Eventor.prototype.on = function (callback) {
            this.listeners.push(callback);
        };
        Eventor.prototype.off = function (callback) {
            var index = this.listeners.indexOf(callback);
            if (index >= 0) {
                this.listeners.splice(index, 1);
            }
        };
        Eventor.prototype.trigger = function (value) {
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i].apply(this.listeners[i], [value]);
            }
        };
        Eventor.prototype.then = function (callback) {
            return this.on(callback);
        };
        Eventor.prototype.listen = function (callback) {
            return this.on(callback);
        };
        Eventor.prototype.remove = function (callback) {
            return this.remove(callback);
        };
        Eventor.prototype.stop = function (callback) {
            return this.remove(callback);
        };
        return Eventor;
    }());
    ZEngine.Eventor = Eventor;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    /**
     * Ugly hack to make sure we always have same floating point.
     */
    Number.prototype.fixed = function (n) {
        n = n || 3;
        var ex = Math.pow(10, n);
        return Math.round(this * ex) / ex;
    };
    var Game = (function () {
        function Game() {
            this.targetFps = 60;
            this.interval = 0;
            this.time = new ZEngine.Time();
            this.mouse = new ZEngine.Mouse();
            this.screen = new ZEngine.Screen(this);
            this.renderer = new ZEngine.Renderer(this);
            this.initTicker();
            this.start();
        }
        /**
         * Called when engine is inicialized.
         */
        Game.prototype.start = function () {
            this.tick(0);
        };
        Game.prototype.loadScene = function (scene) {
            this.scene = new scene(this);
            // For debuggers
            window['scene'] = this.scene.scene;
            return this.scene;
        };
        /**
         * Creates new instance of specified entity.
         */
        Game.prototype.create = function (base) {
            return this.scene.create(base);
        };
        /**
         * Creates appropriate frame update function
         * @source https://github.com/underscorediscovery/realtime-multiplayer-in-html5/blob/master/game.core.js
         */
        Game.prototype.initTicker = function () {
            this.time.sleep = 1000 / this.targetFps;
            var vendors = ['ms', 'moz', 'webkit', 'o'], frame_time = this.time.sleep;
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame || this.targetFps != 60) {
                var lastTime = 0;
                window.requestAnimationFrame = function (callback) {
                    var currTime = Date.now(), timeToCall = Math.max(0, frame_time - (currTime - lastTime));
                    var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) { clearTimeout(id); };
            }
        };
        Game.prototype.tick = function (t) {
            // Work out the delta time
            this.time.delta = this.time.lastframetime ? ((t - this.time.lastframetime) / 1000.0).fixed() : (this.time.sleep / 100);
            // Store the last frame time
            this.time.lastframetime = t;
            // Update real mouse position with view
            this.mouse.x = this.mouse.elementX;
            this.mouse.y = this.mouse.elementY;
            // Update the game specifics
            this.update(this.time.delta);
            this.render(this.time.delta);
            // Schedule the next update
            this.interval = window.requestAnimationFrame(this.tick.bind(this));
        };
        /**
         * Calls tick for every entity.
         */
        Game.prototype.update = function (delta) {
            this.scene.update(delta);
        };
        /**
         * Renders current scene.
         */
        Game.prototype.render = function (delta) {
            this.scene.render(delta);
        };
        return Game;
    }());
    ZEngine.Game = Game;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Mouse = (function () {
        function Mouse() {
        }
        return Mouse;
    }());
    ZEngine.Mouse = Mouse;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Renderer = (function () {
        function Renderer(game) {
            var _this = this;
            this.game = game;
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(game.screen.width, game.screen.height);
            document.getElementsByTagName("body")[0].appendChild(this.renderer.domElement);
            this.game.screen.onResize.then(function (size) { return _this.onResize(size); });
        }
        Renderer.prototype.onResize = function (size) {
            this.renderer.setSize(size.width, size.height);
            if (this.game.scene.camera instanceof THREE.PerspectiveCamera) {
                this.game.scene.camera.aspect = size.width / size.height;
                this.game.scene.camera.updateProjectionMatrix();
            }
        };
        Renderer.prototype.render = function (scene) {
            this.renderer.render(scene.scene, scene.camera);
        };
        return Renderer;
    }());
    ZEngine.Renderer = Renderer;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Scene = (function () {
        function Scene(game) {
            this.game = game;
            this.entities = new ZEngine.Lib.LinkedList();
            this.camera = this.createCamera();
            this.scene = this.createScene();
            this.scene.name = "Scene";
            this.camera.name = "Main camera";
            this.start();
        }
        /**
         * Called when scene is ready.
         */
        Scene.prototype.start = function () {
        };
        /**
         * Builds main camera used for this scene.
         */
        Scene.prototype.createCamera = function () {
            return new THREE.PerspectiveCamera(70, this.game.screen.width / this.game.screen.height, 0.1, 1E5);
        };
        /**
         * Builds main camera used for this scene.
         */
        Scene.prototype.createScene = function () {
            return new THREE.Scene();
        };
        /**
         * Creates new instance of specified entity.
         */
        Scene.prototype.create = function (base) {
            var instance = new base(this);
            this.entities.push(instance);
            return instance;
        };
        /**
         * Finally removes entity from scene
         */
        Scene.prototype.remove = function (entity) {
            entity.onRemove();
            entity.__removed = true;
            entity.scene = null;
            this.entities.remove(entity);
        };
        /**
         * Calls tick for every entity.
         */
        Scene.prototype.update = function (delta) {
            var item;
            this.entities.iter.reset();
            while (item = this.entities.iter.next()) {
                item.tick(delta);
            }
        };
        /**
         * Renders current scene.
         */
        Scene.prototype.render = function (delta) {
            this.game.renderer.render(this);
        };
        return Scene;
    }());
    ZEngine.Scene = Scene;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Screen = (function () {
        function Screen(game) {
            var _this = this;
            this.game = game;
            this.onResize = new ZEngine.Eventor();
            var size = this.viewport();
            this.width = size.width;
            this.height = size.height;
            window.addEventListener('resize', function () { return _this.resized(); }, false);
        }
        Screen.prototype.resized = function () {
            var size = this.viewport();
            this.width = size.width;
            this.height = size.height;
            this.onResize.trigger(size);
        };
        Screen.prototype.viewport = function () {
            var e = window, a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        };
        return Screen;
    }());
    ZEngine.Screen = Screen;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Time = (function () {
        function Time() {
        }
        return Time;
    }());
    ZEngine.Time = Time;
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Comps;
    (function (Comps) {
        var Component = (function () {
            function Component(entity, options) {
                this.entity = entity;
                this.start(options);
            }
            Component.prototype.start = function (options) {
            };
            Component.prototype.tick = function (delta) {
            };
            Component.name = "component";
            return Component;
        }());
        Comps.Component = Component;
    })(Comps = ZEngine.Comps || (ZEngine.Comps = {}));
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Comps;
    (function (Comps) {
        var Input = (function (_super) {
            __extends(Input, _super);
            function Input() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.mouseButtons = {};
                _this.mousePress = {};
                _this.keys = {};
                _this.press = {};
                _this.locked = false;
                _this.lockRequested = false;
                _this.mouse = {
                    x: 0,
                    y: 0,
                    movementX: 0,
                    movementY: 0
                };
                return _this;
            }
            Input.prototype.start = function () {
                var _this = this;
                window.addEventListener('keydown', function (e) { return _this.onKeyDown(e); });
                window.addEventListener('keyup', function (e) { return _this.onKeyUp(e); });
                window.addEventListener('click', function (e) { return _this.onClick(e); });
                window.addEventListener('mousedown', function (e) { return _this.onMouseDown(e); });
                window.addEventListener('mousemove', function (e) { return _this.onMouseMove(e); });
                window.addEventListener('mouseup', function (e) { return _this.onMouseUp(e); });
                window.addEventListener('contextmenu', function (e) { e.stopPropagation(); e.preventDefault(); });
                var handlers = ['pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockchange'];
                var errorHandlers = ['pointerlockerror', 'mozpointerlockerror', 'webkitpointerlockerror'];
                for (var i in handlers) {
                    document.addEventListener(handlers[i], function (event) {
                        _this.locked = _this.onPointerLockChange(event);
                    }, false);
                }
                for (var i in errorHandlers) {
                    document.addEventListener(errorHandlers[i], function (event) {
                        _this.locked = false;
                    }, false);
                }
            };
            Input.prototype.onClick = function (event) {
                if (this.lockRequested) {
                    this.lockRequested = false;
                    this.actuallyLockPointer();
                }
            };
            Input.prototype.onMouseMove = function (event) {
                var mouseX, mouseY;
                if (event.clientX) {
                    mouseX = event.clientX;
                    mouseY = event.clientY;
                }
                else if (event.layerX) {
                    mouseX = event.layerX;
                    mouseY = event.layerY;
                }
                this.mouse.x = mouseX;
                this.mouse.y = mouseY;
                this.mouse.movementX += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                this.mouse.movementY += event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            };
            Input.prototype.onMouseDown = function (e) {
                this.mouseButtons[e.button] = true;
                this.mousePress[e.button] = true;
            };
            Input.prototype.onMouseUp = function (e) {
                this.mouseButtons[e.button] = false;
            };
            Input.prototype.onKeyDown = function (e) {
                this.keys[e.keyCode] = true;
                this.press[e.keyCode] = true;
            };
            Input.prototype.onKeyUp = function (e) {
                this.keys[e.keyCode] = false;
            };
            Input.prototype.keyPressed = function (code) {
                return !!this.press[code];
            };
            Input.prototype.keyDown = function (code) {
                return !!this.keys[code];
            };
            Input.prototype.keyUp = function (code) {
                return !!!this.keys[code];
            };
            Input.prototype.mouseDown = function (code) {
                return !!this.mouseButtons[code];
            };
            Input.prototype.mousePressed = function (code) {
                return !!this.mousePress[code];
            };
            Input.prototype.tick = function (delta) {
                this.press = {};
                this.mousePress = {};
                this.mouse.movementX = 0;
                this.mouse.movementY = 0;
            };
            Input.prototype.lockPointer = function () {
                this.lockRequested = true;
            };
            Input.prototype.actuallyLockPointer = function () {
                document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
                document.body.requestPointerLock();
            };
            Input.prototype.onPointerLockChange = function (event) {
                return (document.pointerLockElement === document.body ||
                    document.mozPointerLockElement === document.body ||
                    document.webkitPointerLockElement === document.body);
            };
            Input.name = "input";
            return Input;
        }(Comps.Component));
        Comps.Input = Input;
    })(Comps = ZEngine.Comps || (ZEngine.Comps = {}));
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    ZEngine.Keys = {
        Backspace: 8,
        Tab: 9,
        Enter: 13,
        Shift: 16,
        Ctrl: 17,
        Alt: 18,
        Break: 19,
        CapsLock: 20,
        Escape: 27,
        Space: 32,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        Insert: 45,
        Delete: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        LeftWindows: 91,
        RightWindows: 92,
        Select: 93,
        Num0: 96,
        Num1: 97,
        Num2: 98,
        Num3: 99,
        Num4: 100,
        Num5: 101,
        Num6: 102,
        Num7: 103,
        Num8: 104,
        Num9: 105,
        NumMultiply: 106,
        NumPlus: 107,
        NumSubstract: 109,
        NumDecimal: 110,
        NumDivide: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NumLock: 144,
        ScrollLock: 145,
        SemiColon: 186,
        EqualSign: 187,
        Comma: 188,
        Dash: 189,
        Period: 190,
        FowardSlash: 191,
        Grave: 192
    };
    ZEngine.MouseButtons = {
        Left: 0,
        Right: 2,
        Middle: 1
    };
})(ZEngine || (ZEngine = {}));
var ZEngine;
(function (ZEngine) {
    var Lib;
    (function (Lib) {
        var LinkedList = (function () {
            function LinkedList() {
                this.length = 0;
                this.start = null;
                this.end = null;
                this.id = LinkedList.idCounter++;
                this.iter = new LinkedList.Iterator(this);
            }
            /**
             * Checks if this list is empty.
             */
            LinkedList.prototype.empty = function () {
                return this.length == 0;
            };
            /**
             * Pushes new item to end of list
             *
             * @param var content
             * @return object list item, used for operation such as removing
             */
            LinkedList.prototype.push = function (obj) {
                var item = {
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
                }
                else {
                    this.end.next = item;
                    item.previous = this.end;
                    item.next = null;
                    this.end = item;
                }
                this.length++;
                return item;
            };
            /**
             * Pops item from start
             * @return object popped content
             */
            LinkedList.prototype.pop = function () {
                if (this.start == null)
                    return null;
                var content = this.start.content;
                this.remove(this.start.content);
                return content;
            };
            /**
             * Inserts content after specified item
             *
             * @param object after item to be inserted after
             * @param var    obj   content to be inserted
             * @return object list item
             */
            LinkedList.prototype.insert = function (after, obj) {
                var item = {
                    previous: null,
                    next: null,
                    content: obj
                };
                var af = null;
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
            };
            /**
             * Removes specified item from list
             *
             * @param object
             * @return boolean true if item was removed, false if not
             */
            LinkedList.prototype.remove = function (obj) {
                var item = obj.__llReferences ? obj.__llReferences[this.id] : null;
                if (item === undefined || item == null)
                    throw new Error("Item to be removed was not specified");
                delete (obj.__llReferences[this.id]);
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
            };
            /**
             * Checks if this list contains specified item.
             */
            LinkedList.prototype.contains = function (obj) {
                return !!obj.__llReferences && !!obj.__llReferences[this.id];
            };
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
            LinkedList.prototype.each = function (callback) {
                var current = this.start, index = 0;
                while (current != null) {
                    if (callback(current.content, current, index))
                        break;
                    current = current.next;
                    index++;
                }
            };
            LinkedList.prototype.first = function () {
                return this.start != null ? this.start.content : null;
            };
            LinkedList.prototype.last = function () {
                return this.end != null ? this.end.content : null;
            };
            LinkedList.prototype.firstItem = function () {
                return this.start;
            };
            LinkedList.prototype.lastItem = function () {
                return this.end;
            };
            LinkedList.prototype.createIter = function () {
                return new LinkedList.Iterator(this);
            };
            LinkedList.prototype.toString = function () {
                var iter = new LinkedList.Iterator(this), str = "[", item = null;
                while (item = iter.next())
                    str += item.toString() + ",";
                if (str.substr(str.length - 1, 1) == ",")
                    str = str.substr(0, str.length - 1);
                str += "]";
                return str;
            };
            LinkedList.idCounter = 0;
            return LinkedList;
        }());
        Lib.LinkedList = LinkedList;
        (function (LinkedList) {
            var InternalItem = (function () {
                function InternalItem() {
                }
                return InternalItem;
            }());
            LinkedList.InternalItem = InternalItem;
            var Iterator = (function () {
                function Iterator(list) {
                    this.list = list;
                    this.point = null;
                }
                Iterator.prototype.reset = function () {
                    this.point = null;
                };
                Iterator.prototype.peek = function () {
                    return this.point ? this.point.content : null;
                };
                Iterator.prototype.next = function () {
                    if (this.point == null)
                        this.point = this.list.firstItem();
                    else
                        this.point = this.point.next;
                    return this.point ? this.point.content : null;
                };
                return Iterator;
            }());
            LinkedList.Iterator = Iterator;
        })(LinkedList = Lib.LinkedList || (Lib.LinkedList = {}));
    })(Lib = ZEngine.Lib || (ZEngine.Lib = {}));
})(ZEngine || (ZEngine = {}));
//# sourceMappingURL=zengine.js.map