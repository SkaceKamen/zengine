var ZEngine;
(function (ZEngine) {
    var Entity = (function () {
        function Entity(scene) {
            this.scene = scene;
            this.start(scene);
        }
        Entity.prototype.start = function (scene) {
        };
        Entity.prototype.tick = function (delta) { };
        return Entity;
    }());
    ZEngine.Entity = Entity;
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
            this.entities = new ZEngine.Lib.LinkedList();
            this.targetFps = 60;
            this.interval = 0;
            this.time = new ZEngine.Time();
            this.mouse = new ZEngine.Mouse();
            this.screen = new ZEngine.Screen(this);
            this.renderer = new ZEngine.Renderer(this);
            this.initTicker();
        }
        /**
         * Creates new instance of specified entity.
         */
        Game.prototype.create = function (base) {
            var instance = new base(this.scene);
            this.entities.push(instance);
            return instance;
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
            var _this = this;
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
            this.interval = window.requestAnimationFrame(function () { return _this.tick; });
        };
        /**
         * Calls tick for every entity.
         */
        Game.prototype.update = function (delta) {
            var item;
            this.entities.iter.reset();
            while (item = this.entities.iter.next()) {
                item.tick(delta);
            }
        };
        /**
         * Renders current scene.
         */
        Game.prototype.render = function (delta) {
            this.renderer.render(this.scene);
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
        function Scene() {
        }
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
                if (!obj.__llReferences)
                    obj.__llReferences = {};
                obj.__llReferences[this.id] = item;
                if (after) {
                    if (!after.__llReferences)
                        after.__llReferences = {};
                    after = after.__llReferences[this.id];
                }
                item.previous = after;
                item.next = after != null ? after.next : null;
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
                if (after.next != null) {
                    after.next.previous = item;
                }
                //Update next reference
                after.next = item;
                //Update ending reference
                if (after == this.end) {
                    this.end = item;
                }
                return item;
            };
            /**
             * Removes specified item from list
             *
             * @param object item (not content!)
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
                return this.start.content;
            };
            LinkedList.prototype.last = function () {
                return this.end.content;
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
        var LinkedList;
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