/*
 * vue-smart-websocket v1.1.1
 * (c) 2018 xsdlr(xsdlr123@gmail.com)
 * Released under the MIT License.
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var SmartWebsocket = _interopDefault(require('smart-websocket'));
var lodash = require('lodash');
var Vue = _interopDefault(require('vue'));

function isVm(vm) {
    return !(!vm.$vnode);
}

var isDef = function (v) { return v !== undefined; };

function install(Vue$$1) {
    if (install.installed) 
        { return; }
    install.installed = true;
    Vue$$1.mixin({
        beforeCreate: function beforeCreate() {
            if (isDef(this.$options.ws)) {
                this.$_wsRoot = this;
                this._ws = this.$options.ws;
                this._ws.init();
            } else {
                this.$_wsRoot = this.$parent && this.$parent.$_wsRoot || this;
            }
        },
        destroyed: function destroyed() {
            var ws = this.$_wsRoot._ws;
            ws.off(this);
            if (isDef(this.$options.ws)) {
                ws.destroy();
            }
        }
    });
    Object.defineProperty(Vue$$1.prototype, '$ws', {
        get: function get() {
            var _this = this;
            return {
                on: function on(type, cb) {
                    var ws = _this.$_wsRoot._ws;
                    ws.on(_this, type, cb);
                },
                off: function off(type) {
                    var ws = _this.$_wsRoot._ws;
                    ws.off(_this, type);
                },
                send: function send(json) {
                    var ws = _this.$_wsRoot._ws;
                    ws.send(json);
                }
            };
        }
    });
}

var inBrowser = typeof window !== 'undefined';

function assert(codition, message) {
    if (!codition) 
        { throw new Error(message); }
}

var tryCatch = function (fn, message) { return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    try {
        return fn.apply(null, args);
    } catch (e) {
        throw Object.assign(e, {
            message: message || e.message
        });
    }
}; };

function defaultParse(data) {
    var ref = JSON.parse(data);
    var type = ref.type;
    var body = ref.body;
    return [type,body];
}

var WS = function WS(options) {
    this.bus = new Vue();
    this.listeners = [];
    var url = options.url;
    var debug = options.debug;
    var parse = options.parse; if ( parse === void 0 ) parse = defaultParse;
    this.parse = tryCatch(parse, '解析错误');
    this.debug = debug;
    this.socket = new SmartWebsocket(url, options);
};
WS.prototype.init = function init () {
        var this$1 = this;

    var ref = this;
        var debug = ref.debug;
        var socket = ref.socket;
    if (debug) {
        socket.addEventListener('connecting', function (ref) {
                var reconnectCount = ref.reconnectCount;

                return console.log('[ws] connecting', reconnectCount);
            });
        socket.addEventListener('open', function (ref) {
                var reconnectCount = ref.reconnectCount;

                return console.log('[ws] open', reconnectCount);
            });
        socket.addEventListener('close', function (ref) {
                var reconnectCount = ref.reconnectCount;

                return console.log('[ws] close', reconnectCount);
            });
        socket.addEventListener('error', function (ref) {
                var reconnectCount = ref.reconnectCount;

                return console.log('[ws] error', reconnectCount);
            });
    }
    socket.addEventListener('message', function (ref) {
            var reconnectCount = ref.reconnectCount;
            var data = ref.data;

        try {
            var ref$1 = this$1.parse(data);
                var type = ref$1[0];
                var body = ref$1[1];
            assert(type, '类型错误');
            this$1.emit(type, body);
        } catch (err) {
            console.error(err);
        }
    });
};
WS.prototype.destroy = function destroy () {
    var listeners = ['connecting','open','close','error','message'];
    this.bus.$off();
    listeners.forEach(this.socket.removeEventListener.bind(this.socket));
};
WS.prototype.genKey = function genKey (data) {
    var vnode = data.$vnode || {};
    return isVm(data) ? vnode.key || (vnode.isComment ? 'comment' : vnode.tag) : data;
};
WS.prototype.emit = function emit (type, payload) {
        var this$1 = this;

    this.listeners.filter(function (listener) {
        var listenerType = listener.type;
        return lodash.isRegExp(listenerType) ? listenerType.test(type) : listenerType === type;
    }).forEach(function (ref) {
            var event = ref.event;

        this$1.bus.$emit(event, payload);
    });
};
WS.prototype.on = function on (vm, type, cb) {
    var key = this.genKey(vm);
    var event = key + ":" + type;
    var listeners = this.listeners.concat({
        key: key,
        type: type,
        event: event
    });
    this.listeners = listeners;
    this.bus.$on(event, cb);
    this.debug && console.log('[ws] addListeners', listeners, this.listeners);
};
WS.prototype.off = function off (vm, type) {
        var this$1 = this;

    var key = this.genKey(vm);
    var listeners = lodash.groupBy(this.listeners, function (ref) {
            var lKey = ref.key;
            var lType = ref.type;

            return key === lKey && (!type || type === lType) ? 'filter' : 'remain';
        });
    var filter = listeners.filter; if ( filter === void 0 ) filter = [];
        var remain = listeners.remain; if ( remain === void 0 ) remain = [];
    this.listeners = remain;
    filter.forEach(function (ref) {
            var event = ref.event;

            return this$1.bus.$off(event);
        });
    this.debug && filter.length && console.log('[ws] removeListeners', filter, this.listeners);
};
WS.prototype.send = function send (json) {
    this.socket.send(JSON.stringify(json));
};

WS.install = install;
WS.version = '1.1.1';
if (inBrowser && window.Vue) {
    window.Vue.use(WS);
}

module.exports = WS;
