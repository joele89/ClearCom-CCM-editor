! function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
    else if ("function" == typeof define && define.amd) define([], a);
    else {
        var b;
        "undefined" != typeof window ? b = window : "undefined" != typeof global ? b = global : "undefined" != typeof self && (b = self), b.io = a()
    }
}(function() {
    var a;
    return function b(a, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!a[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    throw new Error("Cannot find module '" + g + "'")
                }
                var j = c[g] = {
                    exports: {}
                };
                a[g][0].call(j.exports, function(b) {
                    var c = a[g][1][b];
                    return e(c ? c : b)
                }, j, j.exports, b, a, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function(a, b, c) {
            b.exports = a("./lib/")
        }, {
            "./lib/": 2
        }],
        2: [function(a, b, c) {
            function d(a, b) {
                "object" == typeof a && (b = a, a = void 0), b = b || {};
                var c, d = e(a),
                    f = d.source,
                    j = d.id;
                return b.forceNew || b["force new connection"] || !1 === b.multiplex ? (h("ignoring socket cache for %s", f), c = g(f, b)) : (i[j] || (h("new io instance for %s", f), i[j] = g(f, b)), c = i[j]), c.socket(d.path)
            }
            var e = a("./url"),
                f = a("socket.io-parser"),
                g = a("./manager"),
                h = a("debug")("socket.io-client");
            b.exports = c = d;
            var i = c.managers = {};
            c.protocol = f.protocol, c.connect = d, c.Manager = a("./manager"), c.Socket = a("./socket")
        }, {
            "./manager": 3,
            "./socket": 5,
            "./url": 6,
            debug: 9,
            "socket.io-parser": 40
        }],
        3: [function(a, b, c) {
            function d(a, b) {
                return this instanceof d ? (a && "object" == typeof a && (b = a, a = void 0), b = b || {}, b.path = b.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = b, this.reconnection(b.reconnection !== !1), this.reconnectionAttempts(b.reconnectionAttempts || 1 / 0), this.reconnectionDelay(b.reconnectionDelay || 1e3), this.reconnectionDelayMax(b.reconnectionDelayMax || 5e3), this.timeout(null == b.timeout ? 2e4 : b.timeout), this.readyState = "closed", this.uri = a, this.connected = [], this.attempts = 0, this.encoding = !1, this.packetBuffer = [], this.encoder = new h.Encoder, this.decoder = new h.Decoder, this.autoConnect = b.autoConnect !== !1, void(this.autoConnect && this.open())) : new d(a, b)
            }
            var e = (a("./url"), a("engine.io-client")),
                f = a("./socket"),
                g = a("component-emitter"),
                h = a("socket.io-parser"),
                i = a("./on"),
                j = a("component-bind"),
                k = (a("object-component"), a("debug")("socket.io-client:manager")),
                l = a("indexof");
            b.exports = d, d.prototype.emitAll = function() {
                this.emit.apply(this, arguments);
                for (var a in this.nsps) this.nsps[a].emit.apply(this.nsps[a], arguments)
            }, g(d.prototype), d.prototype.reconnection = function(a) {
                return arguments.length ? (this._reconnection = !!a, this) : this._reconnection
            }, d.prototype.reconnectionAttempts = function(a) {
                return arguments.length ? (this._reconnectionAttempts = a, this) : this._reconnectionAttempts
            }, d.prototype.reconnectionDelay = function(a) {
                return arguments.length ? (this._reconnectionDelay = a, this) : this._reconnectionDelay
            }, d.prototype.reconnectionDelayMax = function(a) {
                return arguments.length ? (this._reconnectionDelayMax = a, this) : this._reconnectionDelayMax
            }, d.prototype.timeout = function(a) {
                return arguments.length ? (this._timeout = a, this) : this._timeout
            }, d.prototype.maybeReconnectOnOpen = function() {
                this.openReconnect || this.reconnecting || !this._reconnection || 0 !== this.attempts || (this.openReconnect = !0, this.reconnect())
            }, d.prototype.open = d.prototype.connect = function(a) {
                if (k("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
                k("opening %s", this.uri), this.engine = e(this.uri, this.opts);
                var b = this.engine,
                    c = this;
                this.readyState = "opening", this.skipReconnect = !1;
                var d = i(b, "open", function() {
                        c.onopen(), a && a()
                    }),
                    f = i(b, "error", function(b) {
                        if (k("connect_error"), c.cleanup(), c.readyState = "closed", c.emitAll("connect_error", b), a) {
                            var d = new Error("Connection error");
                            d.data = b, a(d)
                        }
                        c.maybeReconnectOnOpen()
                    });
                if (!1 !== this._timeout) {
                    var g = this._timeout;
                    k("connect attempt will timeout after %d", g);
                    var h = setTimeout(function() {
                        k("connect attempt timed out after %d", g), d.destroy(), b.close(), b.emit("error", "timeout"), c.emitAll("connect_timeout", g)
                    }, g);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(h)
                        }
                    })
                }
                return this.subs.push(d), this.subs.push(f), this
            }, d.prototype.onopen = function() {
                k("open"), this.cleanup(), this.readyState = "open", this.emit("open");
                var a = this.engine;
                this.subs.push(i(a, "data", j(this, "ondata"))), this.subs.push(i(this.decoder, "decoded", j(this, "ondecoded"))), this.subs.push(i(a, "error", j(this, "onerror"))), this.subs.push(i(a, "close", j(this, "onclose")))
            }, d.prototype.ondata = function(a) {
                this.decoder.add(a)
            }, d.prototype.ondecoded = function(a) {
                this.emit("packet", a)
            }, d.prototype.onerror = function(a) {
                k("error", a), this.emitAll("error", a)
            }, d.prototype.socket = function(a) {
                var b = this.nsps[a];
                if (!b) {
                    b = new f(this, a), this.nsps[a] = b;
                    var c = this;
                    b.on("connect", function() {
                        ~l(c.connected, b) || c.connected.push(b)
                    })
                }
                return b
            }, d.prototype.destroy = function(a) {
                var b = l(this.connected, a);
                ~b && this.connected.splice(b, 1), this.connected.length || this.close()
            }, d.prototype.packet = function(a) {
                k("writing packet %j", a);
                var b = this;
                b.encoding ? b.packetBuffer.push(a) : (b.encoding = !0, this.encoder.encode(a, function(a) {
                    for (var c = 0; c < a.length; c++) b.engine.write(a[c]);
                    b.encoding = !1, b.processPacketQueue()
                }))
            }, d.prototype.processPacketQueue = function() {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var a = this.packetBuffer.shift();
                    this.packet(a)
                }
            }, d.prototype.cleanup = function() {
                for (var a; a = this.subs.shift();) a.destroy();
                this.packetBuffer = [], this.encoding = !1, this.decoder.destroy()
            }, d.prototype.close = d.prototype.disconnect = function() {
                this.skipReconnect = !0, this.readyState = "closed", this.engine && this.engine.close()
            }, d.prototype.onclose = function(a) {
                k("close"), this.cleanup(), this.readyState = "closed", this.emit("close", a), this._reconnection && !this.skipReconnect && this.reconnect()
            }, d.prototype.reconnect = function() {
                if (this.reconnecting || this.skipReconnect) return this;
                var a = this;
                if (this.attempts++, this.attempts > this._reconnectionAttempts) k("reconnect failed"), this.emitAll("reconnect_failed"), this.reconnecting = !1;
                else {
                    var b = this.attempts * this.reconnectionDelay();
                    b = Math.min(b, this.reconnectionDelayMax()), k("will wait %dms before reconnect attempt", b), this.reconnecting = !0;
                    var c = setTimeout(function() {
                        a.skipReconnect || (k("attempting reconnect"), a.emitAll("reconnect_attempt", a.attempts), a.emitAll("reconnecting", a.attempts), a.skipReconnect || a.open(function(b) {
                            b ? (k("reconnect attempt error"), a.reconnecting = !1, a.reconnect(), a.emitAll("reconnect_error", b.data)) : (k("reconnect success"), a.onreconnect())
                        }))
                    }, b);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(c)
                        }
                    })
                }
            }, d.prototype.onreconnect = function() {
                var a = this.attempts;
                this.attempts = 0, this.reconnecting = !1, this.emitAll("reconnect", a)
            }
        }, {
            "./on": 4,
            "./socket": 5,
            "./url": 6,
            "component-bind": 7,
            "component-emitter": 8,
            debug: 9,
            "engine.io-client": 10,
            indexof: 36,
            "object-component": 37,
            "socket.io-parser": 40
        }],
        4: [function(a, b, c) {
            function d(a, b, c) {
                return a.on(b, c), {
                    destroy: function() {
                        a.removeListener(b, c)
                    }
                }
            }
            b.exports = d
        }, {}],
        5: [function(a, b, c) {
            function d(a, b) {
                this.io = a, this.nsp = b, this.json = this, this.ids = 0, this.acks = {}, this.io.autoConnect && this.open(), this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0
            }
            var e = a("socket.io-parser"),
                f = a("component-emitter"),
                g = a("to-array"),
                h = a("./on"),
                i = a("component-bind"),
                j = a("debug")("socket.io-client:socket"),
                k = a("has-binary");
            b.exports = c = d;
            var l = {
                    connect: 1,
                    connect_error: 1,
                    connect_timeout: 1,
                    disconnect: 1,
                    error: 1,
                    reconnect: 1,
                    reconnect_attempt: 1,
                    reconnect_failed: 1,
                    reconnect_error: 1,
                    reconnecting: 1
                },
                m = f.prototype.emit;
            f(d.prototype), d.prototype.subEvents = function() {
                if (!this.subs) {
                    var a = this.io;
                    this.subs = [h(a, "open", i(this, "onopen")), h(a, "packet", i(this, "onpacket")), h(a, "close", i(this, "onclose"))]
                }
            }, d.prototype.open = d.prototype.connect = function() {
                return this.connected ? this : (this.subEvents(), this.io.open(), "open" == this.io.readyState && this.onopen(), this)
            }, d.prototype.send = function() {
                var a = g(arguments);
                return a.unshift("message"), this.emit.apply(this, a), this
            }, d.prototype.emit = function(a) {
                if (l.hasOwnProperty(a)) return m.apply(this, arguments), this;
                var b = g(arguments),
                    c = e.EVENT;
                k(b) && (c = e.BINARY_EVENT);
                var d = {
                    type: c,
                    data: b
                };
                return "function" == typeof b[b.length - 1] && (j("emitting packet with ack id %d", this.ids), this.acks[this.ids] = b.pop(), d.id = this.ids++), this.connected ? this.packet(d) : this.sendBuffer.push(d), this
            }, d.prototype.packet = function(a) {
                a.nsp = this.nsp, this.io.packet(a)
            }, d.prototype.onopen = function() {
                j("transport is open - connecting"), "/" != this.nsp && this.packet({
                    type: e.CONNECT
                })
            }, d.prototype.onclose = function(a) {
                j("close (%s)", a), this.connected = !1, this.disconnected = !0, this.emit("disconnect", a)
            }, d.prototype.onpacket = function(a) {
                if (a.nsp == this.nsp) switch (a.type) {
                    case e.CONNECT:
                        this.onconnect();
                        break;
                    case e.EVENT:
                        this.onevent(a);
                        break;
                    case e.BINARY_EVENT:
                        this.onevent(a);
                        break;
                    case e.ACK:
                        this.onack(a);
                        break;
                    case e.BINARY_ACK:
                        this.onack(a);
                        break;
                    case e.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case e.ERROR:
                        this.emit("error", a.data)
                }
            }, d.prototype.onevent = function(a) {
                var b = a.data || [];
                j("emitting event %j", b), null != a.id && (j("attaching ack callback to event"), b.push(this.ack(a.id))), this.connected ? m.apply(this, b) : this.receiveBuffer.push(b)
            }, d.prototype.ack = function(a) {
                var b = this,
                    c = !1;
                return function() {
                    if (!c) {
                        c = !0;
                        var d = g(arguments);
                        j("sending ack %j", d);
                        var f = k(d) ? e.BINARY_ACK : e.ACK;
                        b.packet({
                            type: f,
                            id: a,
                            data: d
                        })
                    }
                }
            }, d.prototype.onack = function(a) {
                j("calling ack %s with %j", a.id, a.data);
                var b = this.acks[a.id];
                b.apply(this, a.data), delete this.acks[a.id]
            }, d.prototype.onconnect = function() {
                this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
            }, d.prototype.emitBuffered = function() {
                var a;
                for (a = 0; a < this.receiveBuffer.length; a++) m.apply(this, this.receiveBuffer[a]);
                for (this.receiveBuffer = [], a = 0; a < this.sendBuffer.length; a++) this.packet(this.sendBuffer[a]);
                this.sendBuffer = []
            }, d.prototype.ondisconnect = function() {
                j("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
            }, d.prototype.destroy = function() {
                if (this.subs) {
                    for (var a = 0; a < this.subs.length; a++) this.subs[a].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            }, d.prototype.close = d.prototype.disconnect = function() {
                return this.connected && (j("performing disconnect (%s)", this.nsp), this.packet({
                    type: e.DISCONNECT
                })), this.destroy(), this.connected && this.onclose("io client disconnect"), this
            }
        }, {
            "./on": 4,
            "component-bind": 7,
            "component-emitter": 8,
            debug: 9,
            "has-binary": 32,
            "socket.io-parser": 40,
            "to-array": 44
        }],
        6: [function(a, b, c) {
            (function(c) {
                function d(a, b) {
                    var d = a,
                        b = b || c.location;
                    return null == a && (a = b.protocol + "//" + b.hostname), "string" == typeof a && ("/" == a.charAt(0) && (a = "/" == a.charAt(1) ? b.protocol + a : b.hostname + a), /^(https?|wss?):\/\//.test(a) || (f("protocol-less url %s", a), a = "undefined" != typeof b ? b.protocol + "//" + a : "https://" + a), f("parse %s", a), d = e(a)), d.port || (/^(http|ws)$/.test(d.protocol) ? d.port = "80" : /^(http|ws)s$/.test(d.protocol) && (d.port = "443")), d.path = d.path || "/", d.id = d.protocol + "://" + d.host + ":" + d.port, d.href = d.protocol + "://" + d.host + (b && b.port == d.port ? "" : ":" + d.port), d
                }
                var e = a("parseuri"),
                    f = a("debug")("socket.io-client:url");
                b.exports = d
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            debug: 9,
            parseuri: 38
        }],
        7: [function(a, b, c) {
            var d = [].slice;
            b.exports = function(a, b) {
                if ("string" == typeof b && (b = a[b]), "function" != typeof b) throw new Error("bind() requires a function");
                var c = d.call(arguments, 2);
                return function() {
                    return b.apply(a, c.concat(d.call(arguments)))
                }
            }
        }, {}],
        8: [function(a, b, c) {
            function d(a) {
                if (a) return e(a)
            }

            function e(a) {
                for (var b in d.prototype) a[b] = d.prototype[b];
                return a
            }
            b.exports = d, d.prototype.on = d.prototype.addEventListener = function(a, b) {
                return this._callbacks = this._callbacks || {}, (this._callbacks[a] = this._callbacks[a] || []).push(b), this
            }, d.prototype.once = function(a, b) {
                function c() {
                    d.off(a, c), b.apply(this, arguments)
                }
                var d = this;
                return this._callbacks = this._callbacks || {}, c.fn = b, this.on(a, c), this
            }, d.prototype.off = d.prototype.removeListener = d.prototype.removeAllListeners = d.prototype.removeEventListener = function(a, b) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var c = this._callbacks[a];
                if (!c) return this;
                if (1 == arguments.length) return delete this._callbacks[a], this;
                for (var d, e = 0; e < c.length; e++)
                    if (d = c[e], d === b || d.fn === b) {
                        c.splice(e, 1);
                        break
                    } return this
            }, d.prototype.emit = function(a) {
                this._callbacks = this._callbacks || {};
                var b = [].slice.call(arguments, 1),
                    c = this._callbacks[a];
                if (c) {
                    c = c.slice(0);
                    for (var d = 0, e = c.length; d < e; ++d) c[d].apply(this, b)
                }
                return this
            }, d.prototype.listeners = function(a) {
                return this._callbacks = this._callbacks || {}, this._callbacks[a] || []
            }, d.prototype.hasListeners = function(a) {
                return !!this.listeners(a).length
            }
        }, {}],
        9: [function(a, b, c) {
            function d(a) {
                return d.enabled(a) ? function(b) {
                    b = e(b);
                    var c = new Date,
                        f = c - (d[a] || c);
                    d[a] = c, b = a + " " + b + " +" + d.humanize(f), window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                } : function() {}
            }

            function e(a) {
                return a instanceof Error ? a.stack || a.message : a
            }
            b.exports = d, d.names = [], d.skips = [], d.enable = function(a) {
                try {
                    localStorage.debug = a
                } catch (b) {}
                for (var c = (a || "").split(/[\s,]+/), e = c.length, f = 0; f < e; f++) a = c[f].replace("*", ".*?"), "-" === a[0] ? d.skips.push(new RegExp("^" + a.substr(1) + "$")) : d.names.push(new RegExp("^" + a + "$"))
            }, d.disable = function() {
                d.enable("")
            }, d.humanize = function(a) {
                var b = 1e3,
                    c = 6e4,
                    d = 60 * c;
                return a >= d ? (a / d).toFixed(1) + "h" : a >= c ? (a / c).toFixed(1) + "m" : a >= b ? (a / b | 0) + "s" : a + "ms"
            }, d.enabled = function(a) {
                for (var b = 0, c = d.skips.length; b < c; b++)
                    if (d.skips[b].test(a)) return !1;
                for (var b = 0, c = d.names.length; b < c; b++)
                    if (d.names[b].test(a)) return !0;
                return !1
            };
            try {
                window.localStorage && d.enable(localStorage.debug)
            } catch (f) {}
        }, {}],
        10: [function(a, b, c) {
            b.exports = a("./lib/")
        }, {
            "./lib/": 11
        }],
        11: [function(a, b, c) {
            b.exports = a("./socket"), b.exports.parser = a("engine.io-parser")
        }, {
            "./socket": 12,
            "engine.io-parser": 21
        }],
        12: [function(a, b, c) {
            (function(c) {
                function d(a, b) {
                    if (!(this instanceof d)) return new d(a, b);
                    if (b = b || {}, a && "object" == typeof a && (b = a, a = null), a && (a = k(a), b.host = a.host, b.secure = "https" == a.protocol || "wss" == a.protocol, b.port = a.port, a.query && (b.query = a.query)), this.secure = null != b.secure ? b.secure : c.location && "https:" == location.protocol, b.host) {
                        var e = b.host.split(":");
                        b.hostname = e.shift(), e.length && (b.port = e.pop())
                    }
                    this.agent = b.agent || !1, this.hostname = b.hostname || (c.location ? location.hostname : "localhost"), this.port = b.port || (c.location && location.port ? location.port : this.secure ? 443 : 80), this.query = b.query || {}, "string" == typeof this.query && (this.query = m.decode(this.query)), this.upgrade = !1 !== b.upgrade, this.path = (b.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!b.forceJSONP, this.jsonp = !1 !== b.jsonp, this.forceBase64 = !!b.forceBase64, this.enablesXDR = !!b.enablesXDR, this.timestampParam = b.timestampParam || "t", this.timestampRequests = b.timestampRequests, this.transports = b.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.callbackBuffer = [], this.policyPort = b.policyPort || 843, this.rememberUpgrade = b.rememberUpgrade || !1, this.open(), this.binaryType = null, this.onlyBinaryUpgrades = b.onlyBinaryUpgrades
                }

                function e(a) {
                    var b = {};
                    for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
                    return b
                }
                var f = a("./transports"),
                    g = a("component-emitter"),
                    h = a("debug")("engine.io-client:socket"),
                    i = a("indexof"),
                    j = a("engine.io-parser"),
                    k = a("parseuri"),
                    l = a("parsejson"),
                    m = a("parseqs");
                b.exports = d, d.priorWebsocketSuccess = !1, g(d.prototype), d.protocol = j.protocol, d.Socket = d, d.Transport = a("./transport"), d.transports = a("./transports"), d.parser = a("engine.io-parser"), d.prototype.createTransport = function(a) {
                    h('creating transport "%s"', a);
                    var b = e(this.query);
                    b.EIO = j.protocol, b.transport = a, this.id && (b.sid = this.id);
                    var c = new f[a]({
                        agent: this.agent,
                        hostname: this.hostname,
                        port: this.port,
                        secure: this.secure,
                        path: this.path,
                        query: b,
                        forceJSONP: this.forceJSONP,
                        jsonp: this.jsonp,
                        forceBase64: this.forceBase64,
                        enablesXDR: this.enablesXDR,
                        timestampRequests: this.timestampRequests,
                        timestampParam: this.timestampParam,
                        policyPort: this.policyPort,
                        socket: this
                    });
                    return c
                }, d.prototype.open = function() {
                    var a;
                    if (this.rememberUpgrade && d.priorWebsocketSuccess && this.transports.indexOf("websocket") != -1) a = "websocket";
                    else {
                        if (0 == this.transports.length) {
                            var b = this;
                            return void setTimeout(function() {
                                b.emit("error", "No transports available")
                            }, 0)
                        }
                        a = this.transports[0]
                    }
                    this.readyState = "opening";
                    var a;
                    try {
                        a = this.createTransport(a)
                    } catch (c) {
                        return this.transports.shift(), void this.open()
                    }
                    a.open(), this.setTransport(a)
                }, d.prototype.setTransport = function(a) {
                    h("setting transport %s", a.name);
                    var b = this;
                    this.transport && (h("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = a, a.on("drain", function() {
                        b.onDrain()
                    }).on("packet", function(a) {
                        b.onPacket(a)
                    }).on("error", function(a) {
                        b.onError(a)
                    }).on("close", function() {
                        b.onClose("transport close")
                    })
                }, d.prototype.probe = function(a) {
                    function b() {
                        if (m.onlyBinaryUpgrades) {
                            var b = !this.supportsBinary && m.transport.supportsBinary;
                            l = l || b
                        }
                        l || (h('probe transport "%s" opened', a), k.send([{
                            type: "ping",
                            data: "probe"
                        }]), k.once("packet", function(b) {
                            if (!l)
                                if ("pong" == b.type && "probe" == b.data) {
                                    if (h('probe transport "%s" pong', a), m.upgrading = !0, m.emit("upgrading", k), !k) return;
                                    d.priorWebsocketSuccess = "websocket" == k.name, h('pausing current transport "%s"', m.transport.name), m.transport.pause(function() {
                                        l || "closed" != m.readyState && (h("changing transport and sending upgrade packet"), j(), m.setTransport(k), k.send([{
                                            type: "upgrade"
                                        }]), m.emit("upgrade", k), k = null, m.upgrading = !1, m.flush())
                                    })
                                } else {
                                    h('probe transport "%s" failed', a);
                                    var c = new Error("probe error");
                                    c.transport = k.name, m.emit("upgradeError", c)
                                }
                        }))
                    }

                    function c() {
                        l || (l = !0, j(), k.close(), k = null)
                    }

                    function e(b) {
                        var d = new Error("probe error: " + b);
                        d.transport = k.name, c(), h('probe transport "%s" failed because of error: %s', a, b), m.emit("upgradeError", d)
                    }

                    function f() {
                        e("transport closed")
                    }

                    function g() {
                        e("socket closed")
                    }

                    function i(a) {
                        k && a.name != k.name && (h('"%s" works - aborting "%s"', a.name, k.name), c())
                    }

                    function j() {
                        k.removeListener("open", b), k.removeListener("error", e), k.removeListener("close", f), m.removeListener("close", g), m.removeListener("upgrading", i)
                    }
                    h('probing transport "%s"', a);
                    var k = this.createTransport(a, {
                            probe: 1
                        }),
                        l = !1,
                        m = this;
                    d.priorWebsocketSuccess = !1, k.once("open", b), k.once("error", e), k.once("close", f), this.once("close", g), this.once("upgrading", i), k.open()
                }, d.prototype.onOpen = function() {
                    if (h("socket open"), this.readyState = "open", d.priorWebsocketSuccess = "websocket" == this.transport.name, this.emit("open"), this.flush(), "open" == this.readyState && this.upgrade && this.transport.pause) {
                        h("starting upgrade probes");
                        for (var a = 0, b = this.upgrades.length; a < b; a++) this.probe(this.upgrades[a])
                    }
                }, d.prototype.onPacket = function(a) {
                    if ("opening" == this.readyState || "open" == this.readyState) switch (h('socket receive: type "%s", data "%s"', a.type, a.data), this.emit("packet", a), this.emit("heartbeat"), a.type) {
                        case "open":
                            this.onHandshake(l(a.data));
                            break;
                        case "pong":
                            this.setPing();
                            break;
                        case "error":
                            var b = new Error("server error");
                            b.code = a.data, this.emit("error", b);
                            break;
                        case "message":
                            this.emit("data", a.data), this.emit("message", a.data)
                    } else h('packet received with socket readyState "%s"', this.readyState)
                }, d.prototype.onHandshake = function(a) {
                    this.emit("handshake", a), this.id = a.sid, this.transport.query.sid = a.sid, this.upgrades = this.filterUpgrades(a.upgrades), this.pingInterval = a.pingInterval, this.pingTimeout = a.pingTimeout, this.onOpen(), "closed" != this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
                }, d.prototype.onHeartbeat = function(a) {
                    clearTimeout(this.pingTimeoutTimer);
                    var b = this;
                    b.pingTimeoutTimer = setTimeout(function() {
                        "closed" != b.readyState && b.onClose("ping timeout")
                    }, a || b.pingInterval + b.pingTimeout)
                }, d.prototype.setPing = function() {
                    var a = this;
                    clearTimeout(a.pingIntervalTimer), a.pingIntervalTimer = setTimeout(function() {
                        h("writing ping packet - expecting pong within %sms", a.pingTimeout), a.ping(), a.onHeartbeat(a.pingTimeout)
                    }, a.pingInterval)
                }, d.prototype.ping = function() {
                    this.sendPacket("ping")
                }, d.prototype.onDrain = function() {
                    for (var a = 0; a < this.prevBufferLen; a++) this.callbackBuffer[a] && this.callbackBuffer[a]();
                    this.writeBuffer.splice(0, this.prevBufferLen), this.callbackBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 == this.writeBuffer.length ? this.emit("drain") : this.flush()
                }, d.prototype.flush = function() {
                    "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (h("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
                }, d.prototype.write = d.prototype.send = function(a, b) {
                    return this.sendPacket("message", a, b), this
                }, d.prototype.sendPacket = function(a, b, c) {
                    if ("closing" != this.readyState && "closed" != this.readyState) {
                        var d = {
                            type: a,
                            data: b
                        };
                        this.emit("packetCreate", d), this.writeBuffer.push(d), this.callbackBuffer.push(c), this.flush()
                    }
                }, d.prototype.close = function() {
                    function a() {
                        d.onClose("forced close"), h("socket closing - telling transport to close"), d.transport.close()
                    }

                    function b() {
                        d.removeListener("upgrade", b), d.removeListener("upgradeError", b), a()
                    }

                    function c() {
                        d.once("upgrade", b), d.once("upgradeError", b)
                    }
                    if ("opening" == this.readyState || "open" == this.readyState) {
                        this.readyState = "closing";
                        var d = this;
                        this.writeBuffer.length ? this.once("drain", function() {
                            this.upgrading ? c() : a()
                        }) : this.upgrading ? c() : a()
                    }
                    return this
                }, d.prototype.onError = function(a) {
                    h("socket error %j", a), d.priorWebsocketSuccess = !1, this.emit("error", a), this.onClose("transport error", a)
                }, d.prototype.onClose = function(a, b) {
                    if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
                        h('socket close with reason: "%s"', a);
                        var c = this;
                        clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), setTimeout(function() {
                            c.writeBuffer = [], c.callbackBuffer = [], c.prevBufferLen = 0
                        }, 0), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", a, b)
                    }
                }, d.prototype.filterUpgrades = function(a) {
                    for (var b = [], c = 0, d = a.length; c < d; c++) ~i(this.transports, a[c]) && b.push(a[c]);
                    return b
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./transport": 13,
            "./transports": 14,
            "component-emitter": 8,
            debug: 9,
            "engine.io-parser": 21,
            indexof: 36,
            parsejson: 28,
            parseqs: 29,
            parseuri: 30
        }],
        13: [function(a, b, c) {
            function d(a) {
                this.path = a.path, this.hostname = a.hostname, this.port = a.port, this.secure = a.secure, this.query = a.query, this.timestampParam = a.timestampParam, this.timestampRequests = a.timestampRequests, this.readyState = "", this.agent = a.agent || !1, this.socket = a.socket, this.enablesXDR = a.enablesXDR
            }
            var e = a("engine.io-parser"),
                f = a("component-emitter");
            b.exports = d, f(d.prototype), d.timestamps = 0, d.prototype.onError = function(a, b) {
                var c = new Error(a);
                return c.type = "TransportError", c.description = b, this.emit("error", c), this
            }, d.prototype.open = function() {
                return "closed" != this.readyState && "" != this.readyState || (this.readyState = "opening", this.doOpen()), this
            }, d.prototype.close = function() {
                return "opening" != this.readyState && "open" != this.readyState || (this.doClose(), this.onClose()), this
            }, d.prototype.send = function(a) {
                if ("open" != this.readyState) throw new Error("Transport not open");
                this.write(a)
            }, d.prototype.onOpen = function() {
                this.readyState = "open", this.writable = !0, this.emit("open")
            }, d.prototype.onData = function(a) {
                var b = e.decodePacket(a, this.socket.binaryType);
                this.onPacket(b)
            }, d.prototype.onPacket = function(a) {
                this.emit("packet", a)
            }, d.prototype.onClose = function() {
                this.readyState = "closed", this.emit("close")
            }
        }, {
            "component-emitter": 8,
            "engine.io-parser": 21
        }],
        14: [function(a, b, c) {
            (function(b) {
                function d(a) {
                    var c, d = !1,
                        h = !1,
                        i = !1 !== a.jsonp;
                    if (b.location) {
                        var j = "https:" == location.protocol,
                            k = location.port;
                        k || (k = j ? 443 : 80), d = a.hostname != location.hostname || k != a.port, h = a.secure != j
                    }
                    if (a.xdomain = d, a.xscheme = h, c = new e(a), "open" in c && !a.forceJSONP) return new f(a);
                    if (!i) throw new Error("JSONP disabled");
                    return new g(a)
                }
                var e = a("xmlhttprequest"),
                    f = a("./polling-xhr"),
                    g = a("./polling-jsonp"),
                    h = a("./websocket");
                c.polling = d, c.websocket = h
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./polling-jsonp": 15,
            "./polling-xhr": 16,
            "./websocket": 18,
            xmlhttprequest: 19
        }],
        15: [function(a, b, c) {
            (function(c) {
                function d() {}

                function e(a) {
                    f.call(this, a), this.query = this.query || {}, h || (c.___eio || (c.___eio = []), h = c.___eio), this.index = h.length;
                    var b = this;
                    h.push(function(a) {
                        b.onData(a)
                    }), this.query.j = this.index, c.document && c.addEventListener && c.addEventListener("beforeunload", function() {
                        b.script && (b.script.onerror = d)
                    })
                }
                var f = a("./polling"),
                    g = a("component-inherit");
                b.exports = e;
                var h, i = /\n/g,
                    j = /\\n/g;
                g(e, f), e.prototype.supportsBinary = !1, e.prototype.doClose = function() {
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), f.prototype.doClose.call(this)
                }, e.prototype.doPoll = function() {
                    var a = this,
                        b = document.createElement("script");
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), b.async = !0, b.src = this.uri(), b.onerror = function(b) {
                        a.onError("jsonp poll error", b)
                    };
                    var c = document.getElementsByTagName("script")[0];
                    c.parentNode.insertBefore(b, c), this.script = b;
                    var d = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                    d && setTimeout(function() {
                        var a = document.createElement("iframe");
                        document.body.appendChild(a), document.body.removeChild(a)
                    }, 100)
                }, e.prototype.doWrite = function(a, b) {
                    function c() {
                        d(), b()
                    }

                    function d() {
                        if (e.iframe) try {
                            e.form.removeChild(e.iframe)
                        } catch (a) {
                            e.onError("jsonp polling iframe removal error", a)
                        }
                        try {
                            var b = '<iframe src="javascript:0" name="' + e.iframeId + '">';
                            f = document.createElement(b)
                        } catch (a) {
                            f = document.createElement("iframe"), f.name = e.iframeId, f.src = "javascript:0"
                        }
                        f.id = e.iframeId, e.form.appendChild(f), e.iframe = f
                    }
                    var e = this;
                    if (!this.form) {
                        var f, g = document.createElement("form"),
                            h = document.createElement("textarea"),
                            k = this.iframeId = "eio_iframe_" + this.index;
                        g.className = "socketio", g.style.position = "absolute", g.style.top = "-1000px", g.style.left = "-1000px", g.target = k, g.method = "POST", g.setAttribute("accept-charset", "utf-8"), h.name = "d", g.appendChild(h), document.body.appendChild(g), this.form = g, this.area = h
                    }
                    this.form.action = this.uri(), d(), a = a.replace(j, "\\\n"), this.area.value = a.replace(i, "\\n");
                    try {
                        this.form.submit()
                    } catch (l) {}
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                        "complete" == e.iframe.readyState && c()
                    } : this.iframe.onload = c
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./polling": 17,
            "component-inherit": 20
        }],
        16: [function(a, b, c) {
            (function(c) {
                function d() {}

                function e(a) {
                    if (i.call(this, a), c.location) {
                        var b = "https:" == location.protocol,
                            d = location.port;
                        d || (d = b ? 443 : 80), this.xd = a.hostname != c.location.hostname || d != a.port, this.xs = a.secure != b
                    }
                }

                function f(a) {
                    this.method = a.method || "GET", this.uri = a.uri, this.xd = !!a.xd, this.xs = !!a.xs, this.async = !1 !== a.async, this.data = void 0 != a.data ? a.data : null, this.agent = a.agent, this.isBinary = a.isBinary, this.supportsBinary = a.supportsBinary, this.enablesXDR = a.enablesXDR, this.create()
                }

                function g() {
                    for (var a in f.requests) f.requests.hasOwnProperty(a) && f.requests[a].abort()
                }
                var h = a("xmlhttprequest"),
                    i = a("./polling"),
                    j = a("component-emitter"),
                    k = a("component-inherit"),
                    l = a("debug")("engine.io-client:polling-xhr");
                b.exports = e, b.exports.Request = f, k(e, i), e.prototype.supportsBinary = !0, e.prototype.request = function(a) {
                    return a = a || {}, a.uri = this.uri(), a.xd = this.xd, a.xs = this.xs, a.agent = this.agent || !1, a.supportsBinary = this.supportsBinary, a.enablesXDR = this.enablesXDR, new f(a)
                }, e.prototype.doWrite = function(a, b) {
                    var c = "string" != typeof a && void 0 !== a,
                        d = this.request({
                            method: "POST",
                            data: a,
                            isBinary: c
                        }),
                        e = this;
                    d.on("success", b), d.on("error", function(a) {
                        e.onError("xhr post error", a)
                    }), this.sendXhr = d
                }, e.prototype.doPoll = function() {
                    l("xhr poll");
                    var a = this.request(),
                        b = this;
                    a.on("data", function(a) {
                        b.onData(a)
                    }), a.on("error", function(a) {
                        b.onError("xhr poll error", a)
                    }), this.pollXhr = a
                }, j(f.prototype), f.prototype.create = function() {
                    var a = this.xhr = new h({
                            agent: this.agent,
                            xdomain: this.xd,
                            xscheme: this.xs,
                            enablesXDR: this.enablesXDR
                        }),
                        b = this;
                    try {
                        if (l("xhr open %s: %s", this.method, this.uri), a.open(this.method, this.uri, this.async), this.supportsBinary && (a.responseType = "arraybuffer"), "POST" == this.method) try {
                            this.isBinary ? a.setRequestHeader("Content-type", "application/octet-stream") : a.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        } catch (d) {}
                        "withCredentials" in a && (a.withCredentials = !0), this.hasXDR() ? (a.onload = function() {
                            b.onLoad()
                        }, a.onerror = function() {
                            b.onError(a.responseText)
                        }) : a.onreadystatechange = function() {
                            4 == a.readyState && (200 == a.status || 1223 == a.status ? b.onLoad() : setTimeout(function() {
                                b.onError(a.status)
                            }, 0))
                        }, l("xhr data %s", this.data), a.send(this.data)
                    } catch (d) {
                        return void setTimeout(function() {
                            b.onError(d)
                        }, 0)
                    }
                    c.document && (this.index = f.requestsCount++, f.requests[this.index] = this)
                }, f.prototype.onSuccess = function() {
                    this.emit("success"), this.cleanup()
                }, f.prototype.onData = function(a) {
                    this.emit("data", a), this.onSuccess()
                }, f.prototype.onError = function(a) {
                    this.emit("error", a), this.cleanup()
                }, f.prototype.cleanup = function() {
                    if ("undefined" != typeof this.xhr && null !== this.xhr) {
                        this.hasXDR() ? this.xhr.onload = this.xhr.onerror = d : this.xhr.onreadystatechange = d;
                        try {
                            this.xhr.abort()
                        } catch (a) {}
                        c.document && delete f.requests[this.index], this.xhr = null
                    }
                }, f.prototype.onLoad = function() {
                    var a;
                    try {
                        var b;
                        try {
                            b = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                        } catch (c) {}
                        a = "application/octet-stream" === b ? this.xhr.response : this.supportsBinary ? "ok" : this.xhr.responseText
                    } catch (c) {
                        this.onError(c)
                    }
                    null != a && this.onData(a)
                }, f.prototype.hasXDR = function() {
                    return "undefined" != typeof c.XDomainRequest && !this.xs && this.enablesXDR
                }, f.prototype.abort = function() {
                    this.cleanup()
                }, c.document && (f.requestsCount = 0, f.requests = {}, c.attachEvent ? c.attachEvent("onunload", g) : c.addEventListener && c.addEventListener("beforeunload", g))
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./polling": 17,
            "component-emitter": 8,
            "component-inherit": 20,
            debug: 9,
            xmlhttprequest: 19
        }],
        17: [function(a, b, c) {
            function d(a) {
                var b = a && a.forceBase64;
                j && !b || (this.supportsBinary = !1), e.call(this, a)
            }
            var e = a("../transport"),
                f = a("parseqs"),
                g = a("engine.io-parser"),
                h = a("component-inherit"),
                i = a("debug")("engine.io-client:polling");
            b.exports = d;
            var j = function() {
                var b = a("xmlhttprequest"),
                    c = new b({
                        xdomain: !1
                    });
                return null != c.responseType
            }();
            h(d, e), d.prototype.name = "polling", d.prototype.doOpen = function() {
                this.poll()
            }, d.prototype.pause = function(a) {
                function b() {
                    i("paused"), c.readyState = "paused", a()
                }
                var c = this;
                if (this.readyState = "pausing", this.polling || !this.writable) {
                    var d = 0;
                    this.polling && (i("we are currently polling - waiting to pause"), d++, this.once("pollComplete", function() {
                        i("pre-pause polling complete"), --d || b()
                    })), this.writable || (i("we are currently writing - waiting to pause"), d++, this.once("drain", function() {
                        i("pre-pause writing complete"), --d || b()
                    }))
                } else b()
            }, d.prototype.poll = function() {
                i("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
            }, d.prototype.onData = function(a) {
                var b = this;
                i("polling got data %s", a);
                var c = function(a, c, d) {
                    return "opening" == b.readyState && b.onOpen(), "close" == a.type ? (b.onClose(), !1) : void b.onPacket(a)
                };
                g.decodePayload(a, this.socket.binaryType, c), "closed" != this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" == this.readyState ? this.poll() : i('ignoring poll - transport state "%s"', this.readyState))
            }, d.prototype.doClose = function() {
                function a() {
                    i("writing close packet"), b.write([{
                        type: "close"
                    }])
                }
                var b = this;
                "open" == this.readyState ? (i("transport open - closing"), a()) : (i("transport not open - deferring close"), this.once("open", a))
            }, d.prototype.write = function(a) {
                var b = this;
                this.writable = !1;
                var c = function() {
                        b.writable = !0, b.emit("drain")
                    },
                    b = this;
                g.encodePayload(a, this.supportsBinary, function(a) {
                    b.doWrite(a, c)
                })
            }, d.prototype.uri = function() {
                var a = this.query || {},
                    b = this.secure ? "https" : "http",
                    c = "";
                return !1 !== this.timestampRequests && (a[this.timestampParam] = +new Date + "-" + e.timestamps++), this.supportsBinary || a.sid || (a.b64 = 1), a = f.encode(a), this.port && ("https" == b && 443 != this.port || "http" == b && 80 != this.port) && (c = ":" + this.port), a.length && (a = "?" + a), b + "://" + this.hostname + c + this.path + a;
            }
        }, {
            "../transport": 13,
            "component-inherit": 20,
            debug: 9,
            "engine.io-parser": 21,
            parseqs: 29,
            xmlhttprequest: 19
        }],
        18: [function(a, b, c) {
            function d(a) {
                var b = a && a.forceBase64;
                b && (this.supportsBinary = !1), e.call(this, a)
            }
            var e = a("../transport"),
                f = a("engine.io-parser"),
                g = a("parseqs"),
                h = a("component-inherit"),
                i = a("debug")("engine.io-client:websocket"),
                j = a("ws");
            b.exports = d, h(d, e), d.prototype.name = "websocket", d.prototype.supportsBinary = !0, d.prototype.doOpen = function() {
                if (this.check()) {
                    var a = this.uri(),
                        b = void 0,
                        c = {
                            agent: this.agent
                        };
                    this.ws = new j(a, b, c), void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.binaryType = "arraybuffer", this.addEventListeners()
                }
            }, d.prototype.addEventListeners = function() {
                var a = this;
                this.ws.onopen = function() {
                    a.onOpen()
                }, this.ws.onclose = function() {
                    a.onClose()
                }, this.ws.onmessage = function(b) {
                    a.onData(b.data)
                }, this.ws.onerror = function(b) {
                    a.onError("websocket error", b)
                }
            }, "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (d.prototype.onData = function(a) {
                var b = this;
                setTimeout(function() {
                    e.prototype.onData.call(b, a)
                }, 0)
            }), d.prototype.write = function(a) {
                function b() {
                    c.writable = !0, c.emit("drain")
                }
                var c = this;
                this.writable = !1;
                for (var d = 0, e = a.length; d < e; d++) f.encodePacket(a[d], this.supportsBinary, function(a) {
                    try {
                        c.ws.send(a)
                    } catch (b) {
                        i("websocket closed before onclose event")
                    }
                });
                setTimeout(b, 0)
            }, d.prototype.onClose = function() {
                e.prototype.onClose.call(this)
            }, d.prototype.doClose = function() {
                "undefined" != typeof this.ws && this.ws.close()
            }, d.prototype.uri = function() {
                var a = this.query || {},
                    b = this.secure ? "wss" : "ws",
                    c = "";
                return this.port && ("wss" == b && 443 != this.port || "ws" == b && 80 != this.port) && (c = ":" + this.port), this.timestampRequests && (a[this.timestampParam] = +new Date), this.supportsBinary || (a.b64 = 1), a = g.encode(a), a.length && (a = "?" + a), b + "://" + this.hostname + c + this.path + a
            }, d.prototype.check = function() {
                return !(!j || "__initialize" in j && this.name === d.prototype.name)
            }
        }, {
            "../transport": 13,
            "component-inherit": 20,
            debug: 9,
            "engine.io-parser": 21,
            parseqs: 29,
            ws: 31
        }],
        19: [function(a, b, c) {
            var d = a("has-cors");
            b.exports = function(a) {
                var b = a.xdomain,
                    c = a.xscheme,
                    e = a.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!b || d)) return new XMLHttpRequest
                } catch (f) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !c && e) return new XDomainRequest
                } catch (f) {}
                if (!b) try {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                } catch (f) {}
            }
        }, {
            "has-cors": 34
        }],
        20: [function(a, b, c) {
            b.exports = function(a, b) {
                var c = function() {};
                c.prototype = b.prototype, a.prototype = new c, a.prototype.constructor = a
            }
        }, {}],
        21: [function(a, b, c) {
            (function(b) {
                function d(a, b, d) {
                    if (!b) return c.encodeBase64Packet(a, d);
                    var e = a.data,
                        f = new Uint8Array(e),
                        g = new Uint8Array(1 + e.byteLength);
                    g[0] = n[a.type];
                    for (var h = 0; h < f.length; h++) g[h + 1] = f[h];
                    return d(g.buffer)
                }

                function e(a, b, d) {
                    if (!b) return c.encodeBase64Packet(a, d);
                    var e = new FileReader;
                    return e.onload = function() {
                        a.data = e.result, c.encodePacket(a, b, !0, d)
                    }, e.readAsArrayBuffer(a.data)
                }

                function f(a, b, d) {
                    if (!b) return c.encodeBase64Packet(a, d);
                    if (m) return e(a, b, d);
                    var f = new Uint8Array(1);
                    f[0] = n[a.type];
                    var g = new q([f.buffer, a.data]);
                    return d(g)
                }

                function g(a, b, c) {
                    for (var d = new Array(a.length), e = k(a.length, c), f = function(a, c, e) {
                            b(c, function(b, c) {
                                d[a] = c, e(b, d)
                            })
                        }, g = 0; g < a.length; g++) f(g, a[g], e)
                }
                var h = a("./keys"),
                    i = a("arraybuffer.slice"),
                    j = a("base64-arraybuffer"),
                    k = a("after"),
                    l = a("utf8"),
                    m = navigator.userAgent.match(/Android/i);
                c.protocol = 3;
                var n = c.packets = {
                        open: 0,
                        close: 1,
                        ping: 2,
                        pong: 3,
                        message: 4,
                        upgrade: 5,
                        noop: 6
                    },
                    o = h(n),
                    p = {
                        type: "error",
                        data: "parser error"
                    },
                    q = a("blob");
                c.encodePacket = function(a, c, e, g) {
                    "function" == typeof c && (g = c, c = !1), "function" == typeof e && (g = e, e = null);
                    var h = void 0 === a.data ? void 0 : a.data.buffer || a.data;
                    if (b.ArrayBuffer && h instanceof ArrayBuffer) return d(a, c, g);
                    if (q && h instanceof b.Blob) return f(a, c, g);
                    var i = n[a.type];
                    return void 0 !== a.data && (i += e ? l.encode(String(a.data)) : String(a.data)), g("" + i)
                }, c.encodeBase64Packet = function(a, d) {
                    var e = "b" + c.packets[a.type];
                    if (q && a.data instanceof q) {
                        var f = new FileReader;
                        return f.onload = function() {
                            var a = f.result.split(",")[1];
                            d(e + a)
                        }, f.readAsDataURL(a.data)
                    }
                    var g;
                    try {
                        g = String.fromCharCode.apply(null, new Uint8Array(a.data))
                    } catch (h) {
                        for (var i = new Uint8Array(a.data), j = new Array(i.length), k = 0; k < i.length; k++) j[k] = i[k];
                        g = String.fromCharCode.apply(null, j)
                    }
                    return e += b.btoa(g), d(e)
                }, c.decodePacket = function(a, b, d) {
                    if ("string" == typeof a || void 0 === a) {
                        if ("b" == a.charAt(0)) return c.decodeBase64Packet(a.substr(1), b);
                        if (d) try {
                            a = l.decode(a)
                        } catch (e) {
                            return p
                        }
                        var f = a.charAt(0);
                        return Number(f) == f && o[f] ? a.length > 1 ? {
                            type: o[f],
                            data: a.substring(1)
                        } : {
                            type: o[f]
                        } : p
                    }
                    var g = new Uint8Array(a),
                        f = g[0],
                        h = i(a, 1);
                    return q && "blob" === b && (h = new q([h])), {
                        type: o[f],
                        data: h
                    }
                }, c.decodeBase64Packet = function(a, c) {
                    var d = o[a.charAt(0)];
                    if (!b.ArrayBuffer) return {
                        type: d,
                        data: {
                            base64: !0,
                            data: a.substr(1)
                        }
                    };
                    var e = j.decode(a.substr(1));
                    return "blob" === c && q && (e = new q([e])), {
                        type: d,
                        data: e
                    }
                }, c.encodePayload = function(a, b, d) {
                    function e(a) {
                        return a.length + ":" + a
                    }

                    function f(a, d) {
                        c.encodePacket(a, b, !0, function(a) {
                            d(null, e(a))
                        })
                    }
                    return "function" == typeof b && (d = b, b = null), b ? q && !m ? c.encodePayloadAsBlob(a, d) : c.encodePayloadAsArrayBuffer(a, d) : a.length ? void g(a, f, function(a, b) {
                        return d(b.join(""))
                    }) : d("0:")
                }, c.decodePayload = function(a, b, d) {
                    if ("string" != typeof a) return c.decodePayloadAsBinary(a, b, d);
                    "function" == typeof b && (d = b, b = null);
                    var e;
                    if ("" == a) return d(p, 0, 1);
                    for (var f, g, h = "", i = 0, j = a.length; i < j; i++) {
                        var k = a.charAt(i);
                        if (":" != k) h += k;
                        else {
                            if ("" == h || h != (f = Number(h))) return d(p, 0, 1);
                            if (g = a.substr(i + 1, f), h != g.length) return d(p, 0, 1);
                            if (g.length) {
                                if (e = c.decodePacket(g, b, !0), p.type == e.type && p.data == e.data) return d(p, 0, 1);
                                var l = d(e, i + f, j);
                                if (!1 === l) return
                            }
                            i += f, h = ""
                        }
                    }
                    return "" != h ? d(p, 0, 1) : void 0
                }, c.encodePayloadAsArrayBuffer = function(a, b) {
                    function d(a, b) {
                        c.encodePacket(a, !0, !0, function(a) {
                            return b(null, a)
                        })
                    }
                    return a.length ? void g(a, d, function(a, c) {
                        var d = c.reduce(function(a, b) {
                                var c;
                                return c = "string" == typeof b ? b.length : b.byteLength, a + c.toString().length + c + 2
                            }, 0),
                            e = new Uint8Array(d),
                            f = 0;
                        return c.forEach(function(a) {
                            var b = "string" == typeof a,
                                c = a;
                            if (b) {
                                for (var d = new Uint8Array(a.length), g = 0; g < a.length; g++) d[g] = a.charCodeAt(g);
                                c = d.buffer
                            }
                            b ? e[f++] = 0 : e[f++] = 1;
                            for (var h = c.byteLength.toString(), g = 0; g < h.length; g++) e[f++] = parseInt(h[g]);
                            e[f++] = 255;
                            for (var d = new Uint8Array(c), g = 0; g < d.length; g++) e[f++] = d[g]
                        }), b(e.buffer)
                    }) : b(new ArrayBuffer(0))
                }, c.encodePayloadAsBlob = function(a, b) {
                    function d(a, b) {
                        c.encodePacket(a, !0, !0, function(a) {
                            var c = new Uint8Array(1);
                            if (c[0] = 1, "string" == typeof a) {
                                for (var d = new Uint8Array(a.length), e = 0; e < a.length; e++) d[e] = a.charCodeAt(e);
                                a = d.buffer, c[0] = 0
                            }
                            for (var f = a instanceof ArrayBuffer ? a.byteLength : a.size, g = f.toString(), h = new Uint8Array(g.length + 1), e = 0; e < g.length; e++) h[e] = parseInt(g[e]);
                            if (h[g.length] = 255, q) {
                                var i = new q([c.buffer, h.buffer, a]);
                                b(null, i)
                            }
                        })
                    }
                    g(a, d, function(a, c) {
                        return b(new q(c))
                    })
                }, c.decodePayloadAsBinary = function(a, b, d) {
                    "function" == typeof b && (d = b, b = null);
                    for (var e = a, f = [], g = !1; e.byteLength > 0;) {
                        for (var h = new Uint8Array(e), j = 0 === h[0], k = "", l = 1; 255 != h[l]; l++) {
                            if (k.length > 310) {
                                g = !0;
                                break
                            }
                            k += h[l]
                        }
                        if (g) return d(p, 0, 1);
                        e = i(e, 2 + k.length), k = parseInt(k);
                        var m = i(e, 0, k);
                        if (j) try {
                            m = String.fromCharCode.apply(null, new Uint8Array(m))
                        } catch (n) {
                            var o = new Uint8Array(m);
                            m = "";
                            for (var l = 0; l < o.length; l++) m += String.fromCharCode(o[l])
                        }
                        f.push(m), e = i(e, k)
                    }
                    var q = f.length;
                    f.forEach(function(a, e) {
                        d(c.decodePacket(a, b, !0), e, q)
                    })
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./keys": 22,
            after: 23,
            "arraybuffer.slice": 24,
            "base64-arraybuffer": 25,
            blob: 26,
            utf8: 27
        }],
        22: [function(a, b, c) {
            b.exports = Object.keys || function(a) {
                var b = [],
                    c = Object.prototype.hasOwnProperty;
                for (var d in a) c.call(a, d) && b.push(d);
                return b
            }
        }, {}],
        23: [function(a, b, c) {
            function d(a, b, c) {
                function d(a, e) {
                    if (d.count <= 0) throw new Error("after called too many times");
                    --d.count, a ? (f = !0, b(a), b = c) : 0 !== d.count || f || b(null, e)
                }
                var f = !1;
                return c = c || e, d.count = a, 0 === a ? b() : d
            }

            function e() {}
            b.exports = d
        }, {}],
        24: [function(a, b, c) {
            b.exports = function(a, b, c) {
                var d = a.byteLength;
                if (b = b || 0, c = c || d, a.slice) return a.slice(b, c);
                if (b < 0 && (b += d), c < 0 && (c += d), c > d && (c = d), b >= d || b >= c || 0 === d) return new ArrayBuffer(0);
                for (var e = new Uint8Array(a), f = new Uint8Array(c - b), g = b, h = 0; g < c; g++, h++) f[h] = e[g];
                return f.buffer
            }
        }, {}],
        25: [function(a, b, c) {
            ! function(a) {
                "use strict";
                c.encode = function(b) {
                    var c, d = new Uint8Array(b),
                        e = d.length,
                        f = "";
                    for (c = 0; c < e; c += 3) f += a[d[c] >> 2], f += a[(3 & d[c]) << 4 | d[c + 1] >> 4], f += a[(15 & d[c + 1]) << 2 | d[c + 2] >> 6], f += a[63 & d[c + 2]];
                    return e % 3 === 2 ? f = f.substring(0, f.length - 1) + "=" : e % 3 === 1 && (f = f.substring(0, f.length - 2) + "=="), f
                }, c.decode = function(b) {
                    var c, d, e, f, g, h = .75 * b.length,
                        i = b.length,
                        j = 0;
                    "=" === b[b.length - 1] && (h--, "=" === b[b.length - 2] && h--);
                    var k = new ArrayBuffer(h),
                        l = new Uint8Array(k);
                    for (c = 0; c < i; c += 4) d = a.indexOf(b[c]), e = a.indexOf(b[c + 1]), f = a.indexOf(b[c + 2]), g = a.indexOf(b[c + 3]), l[j++] = d << 2 | e >> 4, l[j++] = (15 & e) << 4 | f >> 2, l[j++] = (3 & f) << 6 | 63 & g;
                    return k
                }
            }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
        }, {}],
        26: [function(a, b, c) {
            (function(a) {
                function c(a, b) {
                    b = b || {};
                    for (var c = new d, e = 0; e < a.length; e++) c.append(a[e]);
                    return b.type ? c.getBlob(b.type) : c.getBlob()
                }
                var d = a.BlobBuilder || a.WebKitBlobBuilder || a.MSBlobBuilder || a.MozBlobBuilder,
                    e = function() {
                        try {
                            var a = new Blob(["hi"]);
                            return 2 == a.size
                        } catch (b) {
                            return !1
                        }
                    }(),
                    f = d && d.prototype.append && d.prototype.getBlob;
                b.exports = function() {
                    return e ? a.Blob : f ? c : void 0
                }()
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        27: [function(b, c, d) {
            (function(b) {
                ! function(e) {
                    function f(a) {
                        for (var b, c, d = [], e = 0, f = a.length; e < f;) b = a.charCodeAt(e++), b >= 55296 && b <= 56319 && e < f ? (c = a.charCodeAt(e++), 56320 == (64512 & c) ? d.push(((1023 & b) << 10) + (1023 & c) + 65536) : (d.push(b), e--)) : d.push(b);
                        return d
                    }

                    function g(a) {
                        for (var b, c = a.length, d = -1, e = ""; ++d < c;) b = a[d], b > 65535 && (b -= 65536, e += t(b >>> 10 & 1023 | 55296), b = 56320 | 1023 & b), e += t(b);
                        return e
                    }

                    function h(a, b) {
                        return t(a >> b & 63 | 128)
                    }

                    function i(a) {
                        if (0 == (4294967168 & a)) return t(a);
                        var b = "";
                        return 0 == (4294965248 & a) ? b = t(a >> 6 & 31 | 192) : 0 == (4294901760 & a) ? (b = t(a >> 12 & 15 | 224), b += h(a, 6)) : 0 == (4292870144 & a) && (b = t(a >> 18 & 7 | 240), b += h(a, 12), b += h(a, 6)), b += t(63 & a | 128)
                    }

                    function j(a) {
                        for (var b, c = f(a), d = c.length, e = -1, g = ""; ++e < d;) b = c[e], g += i(b);
                        return g
                    }

                    function k() {
                        if (s >= r) throw Error("Invalid byte index");
                        var a = 255 & q[s];
                        if (s++, 128 == (192 & a)) return 63 & a;
                        throw Error("Invalid continuation byte")
                    }

                    function l() {
                        var a, b, c, d, e;
                        if (s > r) throw Error("Invalid byte index");
                        if (s == r) return !1;
                        if (a = 255 & q[s], s++, 0 == (128 & a)) return a;
                        if (192 == (224 & a)) {
                            var b = k();
                            if (e = (31 & a) << 6 | b, e >= 128) return e;
                            throw Error("Invalid continuation byte")
                        }
                        if (224 == (240 & a)) {
                            if (b = k(), c = k(), e = (15 & a) << 12 | b << 6 | c, e >= 2048) return e;
                            throw Error("Invalid continuation byte")
                        }
                        if (240 == (248 & a) && (b = k(), c = k(), d = k(), e = (15 & a) << 18 | b << 12 | c << 6 | d, e >= 65536 && e <= 1114111)) return e;
                        throw Error("Invalid UTF-8 detected")
                    }

                    function m(a) {
                        q = f(a), r = q.length, s = 0;
                        for (var b, c = [];
                            (b = l()) !== !1;) c.push(b);
                        return g(c)
                    }
                    var n = "object" == typeof d && d,
                        o = "object" == typeof c && c && c.exports == n && c,
                        p = "object" == typeof b && b;
                    p.global !== p && p.window !== p || (e = p);
                    var q, r, s, t = String.fromCharCode,
                        u = {
                            version: "2.0.0",
                            encode: j,
                            decode: m
                        };
                    if ("function" == typeof a && "object" == typeof a.amd && a.amd) a(function() {
                        return u
                    });
                    else if (n && !n.nodeType)
                        if (o) o.exports = u;
                        else {
                            var v = {},
                                w = v.hasOwnProperty;
                            for (var x in u) w.call(u, x) && (n[x] = u[x])
                        }
                    else e.utf8 = u
                }(this)
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        28: [function(a, b, c) {
            (function(a) {
                var c = /^[\],:{}\s]*$/,
                    d = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    e = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    f = /(?:^|:|,)(?:\s*\[)+/g,
                    g = /^\s+/,
                    h = /\s+$/;
                b.exports = function(b) {
                    return "string" == typeof b && b ? (b = b.replace(g, "").replace(h, ""), a.JSON && JSON.parse ? JSON.parse(b) : c.test(b.replace(d, "@").replace(e, "]").replace(f, "")) ? new Function("return " + b)() : void 0) : null
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        29: [function(a, b, c) {
            c.encode = function(a) {
                var b = "";
                for (var c in a) a.hasOwnProperty(c) && (b.length && (b += "&"), b += encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                return b
            }, c.decode = function(a) {
                for (var b = {}, c = a.split("&"), d = 0, e = c.length; d < e; d++) {
                    var f = c[d].split("=");
                    b[decodeURIComponent(f[0])] = decodeURIComponent(f[1])
                }
                return b
            }
        }, {}],
        30: [function(a, b, c) {
            var d = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                e = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            b.exports = function(a) {
                var b = a,
                    c = a.indexOf("["),
                    f = a.indexOf("]");
                c != -1 && f != -1 && (a = a.substring(0, c) + a.substring(c, f).replace(/:/g, ";") + a.substring(f, a.length));
                for (var g = d.exec(a || ""), h = {}, i = 14; i--;) h[e[i]] = g[i] || "";
                return c != -1 && f != -1 && (h.source = b, h.host = h.host.substring(1, h.host.length - 1).replace(/;/g, ":"), h.authority = h.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), h.ipv6uri = !0), h
            }
        }, {}],
        31: [function(a, b, c) {
            function d(a, b, c) {
                var d;
                return d = b ? new f(a, b) : new f(a)
            }
            var e = function() {
                    return this
                }(),
                f = e.WebSocket || e.MozWebSocket;
            b.exports = f ? d : null, f && (d.prototype = f.prototype)
        }, {}],
        32: [function(a, b, c) {
            (function(c) {
                function d(a) {
                    function b(a) {
                        if (!a) return !1;
                        if (c.Buffer && c.Buffer.isBuffer(a) || c.ArrayBuffer && a instanceof ArrayBuffer || c.Blob && a instanceof Blob || c.File && a instanceof File) return !0;
                        if (e(a)) {
                            for (var d = 0; d < a.length; d++)
                                if (b(a[d])) return !0
                        } else if (a && "object" == typeof a) {
                            a.toJSON && (a = a.toJSON());
                            for (var f in a)
                                if (a.hasOwnProperty(f) && b(a[f])) return !0
                        }
                        return !1
                    }
                    return b(a)
                }
                var e = a("isarray");
                b.exports = d
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            isarray: 33
        }],
        33: [function(a, b, c) {
            b.exports = Array.isArray || function(a) {
                return "[object Array]" == Object.prototype.toString.call(a)
            }
        }, {}],
        34: [function(a, b, c) {
            var d = a("global");
            try {
                b.exports = "XMLHttpRequest" in d && "withCredentials" in new d.XMLHttpRequest
            } catch (e) {
                b.exports = !1
            }
        }, {
            global: 35
        }],
        35: [function(a, b, c) {
            b.exports = function() {
                return this
            }()
        }, {}],
        36: [function(a, b, c) {
            var d = [].indexOf;
            b.exports = function(a, b) {
                if (d) return a.indexOf(b);
                for (var c = 0; c < a.length; ++c)
                    if (a[c] === b) return c;
                return -1
            }
        }, {}],
        37: [function(a, b, c) {
            var d = Object.prototype.hasOwnProperty;
            c.keys = Object.keys || function(a) {
                var b = [];
                for (var c in a) d.call(a, c) && b.push(c);
                return b
            }, c.values = function(a) {
                var b = [];
                for (var c in a) d.call(a, c) && b.push(a[c]);
                return b
            }, c.merge = function(a, b) {
                for (var c in b) d.call(b, c) && (a[c] = b[c]);
                return a
            }, c.length = function(a) {
                return c.keys(a).length
            }, c.isEmpty = function(a) {
                return 0 == c.length(a)
            }
        }, {}],
        38: [function(a, b, c) {
            var d = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                e = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            b.exports = function(a) {
                for (var b = d.exec(a || ""), c = {}, f = 14; f--;) c[e[f]] = b[f] || "";
                return c
            }
        }, {}],
        39: [function(a, b, c) {
            (function(b) {
                var d = a("isarray"),
                    e = a("./is-buffer");
                c.deconstructPacket = function(a) {
                    function b(a) {
                        if (!a) return a;
                        if (e(a)) {
                            var f = {
                                _placeholder: !0,
                                num: c.length
                            };
                            return c.push(a), f
                        }
                        if (d(a)) {
                            for (var g = new Array(a.length), h = 0; h < a.length; h++) g[h] = b(a[h]);
                            return g
                        }
                        if ("object" == typeof a && !(a instanceof Date)) {
                            var g = {};
                            for (var i in a) g[i] = b(a[i]);
                            return g
                        }
                        return a
                    }
                    var c = [],
                        f = a.data,
                        g = a;
                    return g.data = b(f), g.attachments = c.length, {
                        packet: g,
                        buffers: c
                    }
                }, c.reconstructPacket = function(a, b) {
                    function c(a) {
                        if (a && a._placeholder) {
                            var e = b[a.num];
                            return e
                        }
                        if (d(a)) {
                            for (var f = 0; f < a.length; f++) a[f] = c(a[f]);
                            return a
                        }
                        if (a && "object" == typeof a) {
                            for (var g in a) a[g] = c(a[g]);
                            return a
                        }
                        return a
                    }
                    return a.data = c(a.data), a.attachments = void 0, a
                }, c.removeBlobs = function(a, c) {
                    function f(a, i, j) {
                        if (!a) return a;
                        if (b.Blob && a instanceof Blob || b.File && a instanceof File) {
                            g++;
                            var k = new FileReader;
                            k.onload = function() {
                                j ? j[i] = this.result : h = this.result, --g || c(h)
                            }, k.readAsArrayBuffer(a)
                        } else if (d(a))
                            for (var l = 0; l < a.length; l++) f(a[l], l, a);
                        else if (a && "object" == typeof a && !e(a))
                            for (var m in a) f(a[m], m, a)
                    }
                    var g = 0,
                        h = a;
                    f(h), g || c(h)
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./is-buffer": 41,
            isarray: 42
        }],
        40: [function(a, b, c) {
            function d() {}

            function e(a) {
                var b = "",
                    d = !1;
                return b += a.type, c.BINARY_EVENT != a.type && c.BINARY_ACK != a.type || (b += a.attachments, b += "-"), a.nsp && "/" != a.nsp && (d = !0, b += a.nsp), null != a.id && (d && (b += ",", d = !1), b += a.id), null != a.data && (d && (b += ","), b += l.stringify(a.data)), k("encoded %j as %s", a, b), b
            }

            function f(a, b) {
                function c(a) {
                    var c = n.deconstructPacket(a),
                        d = e(c.packet),
                        f = c.buffers;
                    f.unshift(d), b(f)
                }
                n.removeBlobs(a, c)
            }

            function g() {
                this.reconstructor = null
            }

            function h(a) {
                var b = {},
                    d = 0;
                if (b.type = Number(a.charAt(0)), null == c.types[b.type]) return j();
                if (c.BINARY_EVENT == b.type || c.BINARY_ACK == b.type) {
                    for (b.attachments = "";
                        "-" != a.charAt(++d);) b.attachments += a.charAt(d);
                    b.attachments = Number(b.attachments)
                }
                if ("/" == a.charAt(d + 1))
                    for (b.nsp = ""; ++d;) {
                        var e = a.charAt(d);
                        if ("," == e) break;
                        if (b.nsp += e, d + 1 == a.length) break
                    } else b.nsp = "/";
                var f = a.charAt(d + 1);
                if ("" != f && Number(f) == f) {
                    for (b.id = ""; ++d;) {
                        var e = a.charAt(d);
                        if (null == e || Number(e) != e) {
                            --d;
                            break
                        }
                        if (b.id += a.charAt(d), d + 1 == a.length) break
                    }
                    b.id = Number(b.id)
                }
                if (a.charAt(++d)) try {
                    b.data = l.parse(a.substr(d))
                } catch (g) {
                    return j()
                }
                return k("decoded %s as %j", a, b), b
            }

            function i(a) {
                this.reconPack = a, this.buffers = []
            }

            function j(a) {
                return {
                    type: c.ERROR,
                    data: "parser error"
                }
            }
            var k = a("debug")("socket.io-parser"),
                l = a("json3"),
                m = (a("isarray"), a("component-emitter")),
                n = a("./binary"),
                o = a("./is-buffer");
            c.protocol = 4, c.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"], c.CONNECT = 0, c.DISCONNECT = 1, c.EVENT = 2, c.ACK = 3, c.ERROR = 4, c.BINARY_EVENT = 5, c.BINARY_ACK = 6, c.Encoder = d, c.Decoder = g, d.prototype.encode = function(a, b) {
                if (k("encoding packet %j", a), c.BINARY_EVENT == a.type || c.BINARY_ACK == a.type) f(a, b);
                else {
                    var d = e(a);
                    b([d])
                }
            }, m(g.prototype), g.prototype.add = function(a) {
                var b;
                if ("string" == typeof a) b = h(a), c.BINARY_EVENT == b.type || c.BINARY_ACK == b.type ? (this.reconstructor = new i(b), 0 == this.reconstructor.reconPack.attachments && this.emit("decoded", b)) : this.emit("decoded", b);
                else {
                    if (!o(a) && !a.base64) throw new Error("Unknown type: " + a);
                    if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                    b = this.reconstructor.takeBinaryData(a), b && (this.reconstructor = null, this.emit("decoded", b))
                }
            }, g.prototype.destroy = function() {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            }, i.prototype.takeBinaryData = function(a) {
                if (this.buffers.push(a), this.buffers.length == this.reconPack.attachments) {
                    var b = n.reconstructPacket(this.reconPack, this.buffers);
                    return this.finishedReconstruction(), b
                }
                return null
            }, i.prototype.finishedReconstruction = function() {
                this.reconPack = null, this.buffers = []
            }
        }, {
            "./binary": 39,
            "./is-buffer": 41,
            "component-emitter": 8,
            debug: 9,
            isarray: 42,
            json3: 43
        }],
        41: [function(a, b, c) {
            (function(a) {
                function c(b) {
                    return a.Buffer && a.Buffer.isBuffer(b) || a.ArrayBuffer && b instanceof ArrayBuffer
                }
                b.exports = c
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        42: [function(a, b, c) {
            b.exports = a(33)
        }, {}],
        43: [function(b, c, d) {
            ! function(b) {
                function c(a) {
                    if (c[a] !== g) return c[a];
                    var b;
                    if ("bug-string-char-index" == a) b = "a" != "a" [0];
                    else if ("json" == a) b = c("json-stringify") && c("json-parse");
                    else {
                        var d, e = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                        if ("json-stringify" == a) {
                            var f = k.stringify,
                                i = "function" == typeof f && l;
                            if (i) {
                                (d = function() {
                                    return 1
                                }).toJSON = d;
                                try {
                                    i = "0" === f(0) && "0" === f(new Number) && '""' == f(new String) && f(h) === g && f(g) === g && f() === g && "1" === f(d) && "[1]" == f([d]) && "[null]" == f([g]) && "null" == f(null) && "[null,null,null]" == f([g, h, null]) && f({
                                        a: [d, !0, !1, null, "\0\b\n\f\r\t"]
                                    }) == e && "1" === f(null, d) && "[\n 1,\n 2\n]" == f([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == f(new Date((-864e13))) && '"+275760-09-13T00:00:00.000Z"' == f(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == f(new Date((-621987552e5))) && '"1969-12-31T23:59:59.999Z"' == f(new Date((-1)))
                                } catch (j) {
                                    i = !1
                                }
                            }
                            b = i
                        }
                        if ("json-parse" == a) {
                            var m = k.parse;
                            if ("function" == typeof m) try {
                                if (0 === m("0") && !m(!1)) {
                                    d = m(e);
                                    var n = 5 == d.a.length && 1 === d.a[0];
                                    if (n) {
                                        try {
                                            n = !m('"\t"')
                                        } catch (j) {}
                                        if (n) try {
                                            n = 1 !== m("01")
                                        } catch (j) {}
                                        if (n) try {
                                            n = 1 !== m("1.")
                                        } catch (j) {}
                                    }
                                }
                            } catch (j) {
                                n = !1
                            }
                            b = n
                        }
                    }
                    return c[a] = !!b
                }
                var e, f, g, h = {}.toString,
                    i = "function" == typeof a && a.amd,
                    j = "object" == typeof JSON && JSON,
                    k = "object" == typeof d && d && !d.nodeType && d;
                k && j ? (k.stringify = j.stringify, k.parse = j.parse) : k = b.JSON = j || {};
                var l = new Date((-0xc782b5b800cec));
                try {
                    l = l.getUTCFullYear() == -109252 && 0 === l.getUTCMonth() && 1 === l.getUTCDate() && 10 == l.getUTCHours() && 37 == l.getUTCMinutes() && 6 == l.getUTCSeconds() && 708 == l.getUTCMilliseconds()
                } catch (m) {}
                if (!c("json")) {
                    var n = "[object Function]",
                        o = "[object Date]",
                        p = "[object Number]",
                        q = "[object String]",
                        r = "[object Array]",
                        s = "[object Boolean]",
                        t = c("bug-string-char-index");
                    if (!l) var u = Math.floor,
                        v = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                        w = function(a, b) {
                            return v[b] + 365 * (a - 1970) + u((a - 1969 + (b = +(b > 1))) / 4) - u((a - 1901 + b) / 100) + u((a - 1601 + b) / 400)
                        };
                    (e = {}.hasOwnProperty) || (e = function(a) {
                        var b, c = {};
                        return (c.__proto__ = null, c.__proto__ = {
                            toString: 1
                        }, c).toString != h ? e = function(a) {
                            var b = this.__proto__,
                                c = a in (this.__proto__ = null, this);
                            return this.__proto__ = b, c
                        } : (b = c.constructor, e = function(a) {
                            var c = (this.constructor || b).prototype;
                            return a in this && !(a in c && this[a] === c[a])
                        }), c = null, e.call(this, a)
                    });
                    var x = {
                            "boolean": 1,
                            number: 1,
                            string: 1,
                            undefined: 1
                        },
                        y = function(a, b) {
                            var c = typeof a[b];
                            return "object" == c ? !!a[b] : !x[c]
                        };
                    if (f = function(a, b) {
                            var c, d, g, i = 0;
                            (c = function() {
                                this.valueOf = 0
                            }).prototype.valueOf = 0, d = new c;
                            for (g in d) e.call(d, g) && i++;
                            return c = d = null, i ? f = 2 == i ? function(a, b) {
                                var c, d = {},
                                    f = h.call(a) == n;
                                for (c in a) f && "prototype" == c || e.call(d, c) || !(d[c] = 1) || !e.call(a, c) || b(c)
                            } : function(a, b) {
                                var c, d, f = h.call(a) == n;
                                for (c in a) f && "prototype" == c || !e.call(a, c) || (d = "constructor" === c) || b(c);
                                (d || e.call(a, c = "constructor")) && b(c)
                            } : (d = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], f = function(a, b) {
                                var c, f, g = h.call(a) == n,
                                    i = !g && "function" != typeof a.constructor && y(a, "hasOwnProperty") ? a.hasOwnProperty : e;
                                for (c in a) g && "prototype" == c || !i.call(a, c) || b(c);
                                for (f = d.length; c = d[--f]; i.call(a, c) && b(c));
                            }), f(a, b)
                        }, !c("json-stringify")) {
                        var z = {
                                92: "\\\\",
                                34: '\\"',
                                8: "\\b",
                                12: "\\f",
                                10: "\\n",
                                13: "\\r",
                                9: "\\t"
                            },
                            A = "000000",
                            B = function(a, b) {
                                return (A + (b || 0)).slice(-a)
                            },
                            C = "\\u00",
                            D = function(a) {
                                var b, c = '"',
                                    d = 0,
                                    e = a.length,
                                    f = e > 10 && t;
                                for (f && (b = a.split("")); d < e; d++) {
                                    var g = a.charCodeAt(d);
                                    switch (g) {
                                        case 8:
                                        case 9:
                                        case 10:
                                        case 12:
                                        case 13:
                                        case 34:
                                        case 92:
                                            c += z[g];
                                            break;
                                        default:
                                            if (g < 32) {
                                                c += C + B(2, g.toString(16));
                                                break
                                            }
                                            c += f ? b[d] : t ? a.charAt(d) : a[d]
                                    }
                                }
                                return c + '"'
                            },
                            E = function(a, b, c, d, i, j, k) {
                                var l, m, n, t, v, x, y, z, A, C, F, G, H, I, J, K;
                                try {
                                    l = b[a]
                                } catch (L) {}
                                if ("object" == typeof l && l)
                                    if (m = h.call(l), m != o || e.call(l, "toJSON")) "function" == typeof l.toJSON && (m != p && m != q && m != r || e.call(l, "toJSON")) && (l = l.toJSON(a));
                                    else if (l > -1 / 0 && l < 1 / 0) {
                                    if (w) {
                                        for (v = u(l / 864e5), n = u(v / 365.2425) + 1970 - 1; w(n + 1, 0) <= v; n++);
                                        for (t = u((v - w(n, 0)) / 30.42); w(n, t + 1) <= v; t++);
                                        v = 1 + v - w(n, t), x = (l % 864e5 + 864e5) % 864e5, y = u(x / 36e5) % 24, z = u(x / 6e4) % 60, A = u(x / 1e3) % 60, C = x % 1e3
                                    } else n = l.getUTCFullYear(), t = l.getUTCMonth(), v = l.getUTCDate(), y = l.getUTCHours(), z = l.getUTCMinutes(), A = l.getUTCSeconds(), C = l.getUTCMilliseconds();
                                    l = (n <= 0 || n >= 1e4 ? (n < 0 ? "-" : "+") + B(6, n < 0 ? -n : n) : B(4, n)) + "-" + B(2, t + 1) + "-" + B(2, v) + "T" + B(2, y) + ":" + B(2, z) + ":" + B(2, A) + "." + B(3, C) + "Z"
                                } else l = null;
                                if (c && (l = c.call(b, a, l)), null === l) return "null";
                                if (m = h.call(l), m == s) return "" + l;
                                if (m == p) return l > -1 / 0 && l < 1 / 0 ? "" + l : "null";
                                if (m == q) return D("" + l);
                                if ("object" == typeof l) {
                                    for (I = k.length; I--;)
                                        if (k[I] === l) throw TypeError();
                                    if (k.push(l), F = [], J = j, j += i, m == r) {
                                        for (H = 0, I = l.length; H < I; H++) G = E(H, l, c, d, i, j, k), F.push(G === g ? "null" : G);
                                        K = F.length ? i ? "[\n" + j + F.join(",\n" + j) + "\n" + J + "]" : "[" + F.join(",") + "]" : "[]"
                                    } else f(d || l, function(a) {
                                        var b = E(a, l, c, d, i, j, k);
                                        b !== g && F.push(D(a) + ":" + (i ? " " : "") + b)
                                    }), K = F.length ? i ? "{\n" + j + F.join(",\n" + j) + "\n" + J + "}" : "{" + F.join(",") + "}" : "{}";
                                    return k.pop(), K
                                }
                            };
                        k.stringify = function(a, b, c) {
                            var d, e, f, g;
                            if ("function" == typeof b || "object" == typeof b && b)
                                if ((g = h.call(b)) == n) e = b;
                                else if (g == r) {
                                f = {};
                                for (var i, j = 0, k = b.length; j < k; i = b[j++], g = h.call(i), (g == q || g == p) && (f[i] = 1));
                            }
                            if (c)
                                if ((g = h.call(c)) == p) {
                                    if ((c -= c % 1) > 0)
                                        for (d = "", c > 10 && (c = 10); d.length < c; d += " ");
                                } else g == q && (d = c.length <= 10 ? c : c.slice(0, 10));
                            return E("", (i = {}, i[""] = a, i), e, f, d, "", [])
                        }
                    }
                    if (!c("json-parse")) {
                        var F, G, H = String.fromCharCode,
                            I = {
                                92: "\\",
                                34: '"',
                                47: "/",
                                98: "\b",
                                116: "\t",
                                110: "\n",
                                102: "\f",
                                114: "\r"
                            },
                            J = function() {
                                throw F = G = null, SyntaxError()
                            },
                            K = function() {
                                for (var a, b, c, d, e, f = G, g = f.length; F < g;) switch (e = f.charCodeAt(F)) {
                                    case 9:
                                    case 10:
                                    case 13:
                                    case 32:
                                        F++;
                                        break;
                                    case 123:
                                    case 125:
                                    case 91:
                                    case 93:
                                    case 58:
                                    case 44:
                                        return a = t ? f.charAt(F) : f[F], F++, a;
                                    case 34:
                                        for (a = "@", F++; F < g;)
                                            if (e = f.charCodeAt(F), e < 32) J();
                                            else if (92 == e) switch (e = f.charCodeAt(++F)) {
                                            case 92:
                                            case 34:
                                            case 47:
                                            case 98:
                                            case 116:
                                            case 110:
                                            case 102:
                                            case 114:
                                                a += I[e], F++;
                                                break;
                                            case 117:
                                                for (b = ++F, c = F + 4; F < c; F++) e = f.charCodeAt(F), e >= 48 && e <= 57 || e >= 97 && e <= 102 || e >= 65 && e <= 70 || J();
                                                a += H("0x" + f.slice(b, F));
                                                break;
                                            default:
                                                J()
                                        } else {
                                            if (34 == e) break;
                                            for (e = f.charCodeAt(F), b = F; e >= 32 && 92 != e && 34 != e;) e = f.charCodeAt(++F);
                                            a += f.slice(b, F)
                                        }
                                        if (34 == f.charCodeAt(F)) return F++, a;
                                        J();
                                    default:
                                        if (b = F, 45 == e && (d = !0, e = f.charCodeAt(++F)), e >= 48 && e <= 57) {
                                            for (48 == e && (e = f.charCodeAt(F + 1), e >= 48 && e <= 57) && J(), d = !1; F < g && (e = f.charCodeAt(F), e >= 48 && e <= 57); F++);
                                            if (46 == f.charCodeAt(F)) {
                                                for (c = ++F; c < g && (e = f.charCodeAt(c), e >= 48 && e <= 57); c++);
                                                c == F && J(), F = c
                                            }
                                            if (e = f.charCodeAt(F), 101 == e || 69 == e) {
                                                for (e = f.charCodeAt(++F), 43 != e && 45 != e || F++, c = F; c < g && (e = f.charCodeAt(c), e >= 48 && e <= 57); c++);
                                                c == F && J(), F = c
                                            }
                                            return +f.slice(b, F)
                                        }
                                        if (d && J(), "true" == f.slice(F, F + 4)) return F += 4, !0;
                                        if ("false" == f.slice(F, F + 5)) return F += 5, !1;
                                        if ("null" == f.slice(F, F + 4)) return F += 4, null;
                                        J()
                                }
                                return "$"
                            },
                            L = function(a) {
                                var b, c;
                                if ("$" == a && J(), "string" == typeof a) {
                                    if ("@" == (t ? a.charAt(0) : a[0])) return a.slice(1);
                                    if ("[" == a) {
                                        for (b = []; a = K(), "]" != a; c || (c = !0)) c && ("," == a ? (a = K(), "]" == a && J()) : J()), "," == a && J(), b.push(L(a));
                                        return b
                                    }
                                    if ("{" == a) {
                                        for (b = {}; a = K(), "}" != a; c || (c = !0)) c && ("," == a ? (a = K(), "}" == a && J()) : J()), "," != a && "string" == typeof a && "@" == (t ? a.charAt(0) : a[0]) && ":" == K() || J(), b[a.slice(1)] = L(K());
                                        return b
                                    }
                                    J()
                                }
                                return a
                            },
                            M = function(a, b, c) {
                                var d = N(a, b, c);
                                d === g ? delete a[b] : a[b] = d
                            },
                            N = function(a, b, c) {
                                var d, e = a[b];
                                if ("object" == typeof e && e)
                                    if (h.call(e) == r)
                                        for (d = e.length; d--;) M(e, d, c);
                                    else f(e, function(a) {
                                        M(e, a, c)
                                    });
                                return c.call(a, b, e)
                            };
                        k.parse = function(a, b) {
                            var c, d;
                            return F = 0, G = "" + a, c = L(K()), "$" != K() && J(), F = G = null, b && h.call(b) == n ? N((d = {}, d[""] = c, d), "", b) : c
                        }
                    }
                }
                i && a(function() {
                    return k
                })
            }(this)
        }, {}],
        44: [function(a, b, c) {
            function d(a, b) {
                var c = [];
                b = b || 0;
                for (var d = b || 0; d < a.length; d++) c[d - b] = a[d];
                return c
            }
            b.exports = d
        }, {}]
    }, {}, [1])(1)
}),
function(a, b) {
    function c(a) {
        var b = a.length,
            c = fa.type(a);
        return !fa.isWindow(a) && (!(1 !== a.nodeType || !b) || ("array" === c || "function" !== c && (0 === b || "number" == typeof b && b > 0 && b - 1 in a)))
    }

    function d(a) {
        var b = oa[a] = {};
        return fa.each(a.match(ha) || [], function(a, c) {
            b[c] = !0
        }), b
    }

    function e() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {}
            }
        }), this.expando = fa.expando + Math.random()
    }

    function f(a, c, d) {
        var e;
        if (d === b && 1 === a.nodeType)
            if (e = "data-" + c.replace(sa, "-$1").toLowerCase(), d = a.getAttribute(e), "string" == typeof d) {
                try {
                    d = "true" === d || "false" !== d && ("null" === d ? null : +d + "" === d ? +d : ra.test(d) ? JSON.parse(d) : d)
                } catch (f) {}
                pa.set(a, c, d)
            } else d = b;
        return d
    }

    function g() {
        return !0
    }

    function h() {
        return !1
    }

    function i() {
        try {
            return T.activeElement
        } catch (a) {}
    }

    function j(a, b) {
        for (;
            (a = a[b]) && 1 !== a.nodeType;);
        return a
    }

    function k(a, b, c) {
        if (fa.isFunction(b)) return fa.grep(a, function(a, d) {
            return !!b.call(a, d, a) !== c
        });
        if (b.nodeType) return fa.grep(a, function(a) {
            return a === b !== c
        });
        if ("string" == typeof b) {
            if (Ca.test(b)) return fa.filter(b, a, c);
            b = fa.filter(b, a)
        }
        return fa.grep(a, function(a) {
            return ba.call(b, a) >= 0 !== c
        })
    }

    function l(a, b) {
        return fa.nodeName(a, "table") && fa.nodeName(1 === b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function m(a) {
        return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a
    }

    function n(a) {
        var b = Na.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }

    function o(a, b) {
        for (var c = a.length, d = 0; c > d; d++) qa.set(a[d], "globalEval", !b || qa.get(b[d], "globalEval"))
    }

    function p(a, b) {
        var c, d, e, f, g, h, i, j;
        if (1 === b.nodeType) {
            if (qa.hasData(a) && (f = qa.access(a), g = qa.set(b, f), j = f.events)) {
                delete g.handle, g.events = {};
                for (e in j)
                    for (c = 0, d = j[e].length; d > c; c++) fa.event.add(b, e, j[e][c])
            }
            pa.hasData(a) && (h = pa.access(a), i = fa.extend({}, h), pa.set(b, i))
        }
    }

    function q(a, c) {
        var d = a.getElementsByTagName ? a.getElementsByTagName(c || "*") : a.querySelectorAll ? a.querySelectorAll(c || "*") : [];
        return c === b || c && fa.nodeName(a, c) ? fa.merge([a], d) : d
    }

    function r(a, b) {
        var c = b.nodeName.toLowerCase();
        "input" === c && Ka.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
    }

    function s(a, b) {
        if (b in a) return b;
        for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = _a.length; e--;)
            if (b = _a[e] + c, b in a) return b;
        return d
    }

    function t(a, b) {
        return a = b || a, "none" === fa.css(a, "display") || !fa.contains(a.ownerDocument, a)
    }

    function u(b) {
        return a.getComputedStyle(b, null)
    }

    function v(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = qa.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && t(d) && (f[g] = qa.access(d, "olddisplay", z(d.nodeName)))) : f[g] || (e = t(d), (c && "none" !== c || !e) && qa.set(d, "olddisplay", e ? c : fa.css(d, "display"))));
        for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }

    function w(a, b, c) {
        var d = Ua.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function x(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += fa.css(a, c + $a[f], !0, e)), d ? ("content" === c && (g -= fa.css(a, "padding" + $a[f], !0, e)), "margin" !== c && (g -= fa.css(a, "border" + $a[f] + "Width", !0, e))) : (g += fa.css(a, "padding" + $a[f], !0, e), "padding" !== c && (g += fa.css(a, "border" + $a[f] + "Width", !0, e)));
        return g
    }

    function y(a, b, c) {
        var d = !0,
            e = "width" === b ? a.offsetWidth : a.offsetHeight,
            f = u(a),
            g = fa.support.boxSizing && "border-box" === fa.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Qa(a, b, f), (0 > e || null == e) && (e = a.style[b]), Va.test(e)) return e;
            d = g && (fa.support.boxSizingReliable || e === a.style[b]), e = parseFloat(e) || 0
        }
        return e + x(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }

    function z(a) {
        var b = T,
            c = Xa[a];
        return c || (c = A(a, b), "none" !== c && c || (Ra = (Ra || fa("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(b.documentElement), b = (Ra[0].contentWindow || Ra[0].contentDocument).document, b.write("<!doctype html><html><body>"), b.close(), c = A(a, b), Ra.detach()), Xa[a] = c), c
    }

    function A(a, b) {
        var c = fa(b.createElement(a)).appendTo(b.body),
            d = fa.css(c[0], "display");
        return c.remove(), d
    }

    function B(a, b, c, d) {
        var e;
        if (fa.isArray(b)) fa.each(b, function(b, e) {
            c || bb.test(a) ? d(a, e) : B(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
        });
        else if (c || "object" !== fa.type(b)) d(a, b);
        else
            for (e in b) B(a + "[" + e + "]", b[e], c, d)
    }

    function C(a) {
        return function(b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0,
                f = b.toLowerCase().match(ha) || [];
            if (fa.isFunction(c))
                for (; d = f[e++];) "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }

    function D(a, c, d, e) {
        function f(i) {
            var j;
            return g[i] = !0, fa.each(a[i] || [], function(a, i) {
                var k = i(c, d, e);
                return "string" != typeof k || h || g[k] ? h ? !(j = k) : b : (c.dataTypes.unshift(k), f(k), !1)
            }), j
        }
        var g = {},
            h = a === sb;
        return f(c.dataTypes[0]) || !g["*"] && f("*")
    }

    function E(a, c) {
        var d, e, f = fa.ajaxSettings.flatOptions || {};
        for (d in c) c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
        return e && fa.extend(!0, a, e), a
    }

    function F(a, c, d) {
        for (var e, f, g, h, i = a.contents, j = a.dataTypes;
            "*" === j[0];) j.shift(), e === b && (e = a.mimeType || c.getResponseHeader("Content-Type"));
        if (e)
            for (f in i)
                if (i[f] && i[f].test(e)) {
                    j.unshift(f);
                    break
                } if (j[0] in d) g = j[0];
        else {
            for (f in d) {
                if (!j[0] || a.converters[f + " " + j[0]]) {
                    g = f;
                    break
                }
                h || (h = f)
            }
            g = g || h
        }
        return g ? (g !== j[0] && j.unshift(g), d[g]) : b
    }

    function G(a, b, c, d) {
        var e, f, g, h, i, j = {},
            k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
        for (f = k.shift(); f;)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                if ("*" === f) f = i;
                else if ("*" !== i && i !== f) {
            if (g = j[i + " " + f] || j["* " + f], !g)
                for (e in j)
                    if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                        g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                        break
                    } if (g !== !0)
                if (g && a["throws"]) b = g(b);
                else try {
                    b = g(b)
                } catch (l) {
                    return {
                        state: "parsererror",
                        error: g ? l : "No conversion from " + i + " to " + f
                    }
                }
        }
        return {
            state: "success",
            data: b
        }
    }

    function H() {
        return setTimeout(function() {
            Bb = b
        }), Bb = fa.now()
    }

    function I(a, b, c) {
        for (var d, e = (Hb[b] || []).concat(Hb["*"]), f = 0, g = e.length; g > f; f++)
            if (d = e[f].call(c, b, a)) return d
    }

    function J(a, b, c) {
        var d, e, f = 0,
            g = Gb.length,
            h = fa.Deferred().always(function() {
                delete i.elem
            }),
            i = function() {
                if (e) return !1;
                for (var b = Bb || H(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
                return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
            },
            j = h.promise({
                elem: a,
                props: fa.extend({}, b),
                opts: fa.extend(!0, {
                    specialEasing: {}
                }, c),
                originalProperties: b,
                originalOptions: c,
                startTime: Bb || H(),
                duration: c.duration,
                tweens: [],
                createTween: function(b, c) {
                    var d = fa.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                    return j.tweens.push(d), d
                },
                stop: function(b) {
                    var c = 0,
                        d = b ? j.tweens.length : 0;
                    if (e) return this;
                    for (e = !0; d > c; c++) j.tweens[c].run(1);
                    return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                }
            }),
            k = j.props;
        for (K(k, j.opts.specialEasing); g > f; f++)
            if (d = Gb[f].call(j, a, k, j.opts)) return d;
        return fa.map(k, I, j), fa.isFunction(j.opts.start) && j.opts.start.call(a, j), fa.fx.timer(fa.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }

    function K(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = fa.camelCase(c), e = b[d], f = a[c], fa.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = fa.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f) c in a || (a[c] = f[c], b[c] = e)
            } else b[d] = e
    }

    function L(a, c, d) {
        var e, f, g, h, i, j, k = this,
            l = {},
            m = a.style,
            n = a.nodeType && t(a),
            o = qa.get(a, "fxshow");
        d.queue || (i = fa._queueHooks(a, "fx"), null == i.unqueued && (i.unqueued = 0, j = i.empty.fire, i.empty.fire = function() {
            i.unqueued || j()
        }), i.unqueued++, k.always(function() {
            k.always(function() {
                i.unqueued--, fa.queue(a, "fx").length || i.empty.fire()
            })
        })), 1 === a.nodeType && ("height" in c || "width" in c) && (d.overflow = [m.overflow, m.overflowX, m.overflowY], "inline" === fa.css(a, "display") && "none" === fa.css(a, "float") && (m.display = "inline-block")), d.overflow && (m.overflow = "hidden", k.always(function() {
            m.overflow = d.overflow[0], m.overflowX = d.overflow[1], m.overflowY = d.overflow[2]
        }));
        for (e in c)
            if (f = c[e], Db.exec(f)) {
                if (delete c[e], g = g || "toggle" === f, f === (n ? "hide" : "show")) {
                    if ("show" !== f || !o || o[e] === b) continue;
                    n = !0
                }
                l[e] = o && o[e] || fa.style(a, e)
            } if (!fa.isEmptyObject(l)) {
            o ? "hidden" in o && (n = o.hidden) : o = qa.access(a, "fxshow", {}), g && (o.hidden = !n), n ? fa(a).show() : k.done(function() {
                fa(a).hide()
            }), k.done(function() {
                var b;
                qa.remove(a, "fxshow");
                for (b in l) fa.style(a, b, l[b])
            });
            for (e in l) h = I(n ? o[e] : 0, e, k), e in o || (o[e] = h.start, n && (h.end = h.start, h.start = "width" === e || "height" === e ? 1 : 0))
        }
    }

    function M(a, b, c, d, e) {
        return new M.prototype.init(a, b, c, d, e)
    }

    function N(a, b) {
        var c, d = {
                height: a
            },
            e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = $a[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }

    function O(a) {
        return fa.isWindow(a) ? a : 9 === a.nodeType && a.defaultView
    }
    var P, Q, R = typeof b,
        S = a.location,
        T = a.document,
        U = T.documentElement,
        V = a.jQuery,
        W = a.$,
        X = {},
        Y = [],
        Z = "2.0.3",
        $ = Y.concat,
        _ = Y.push,
        aa = Y.slice,
        ba = Y.indexOf,
        ca = X.toString,
        da = X.hasOwnProperty,
        ea = Z.trim,
        fa = function(a, b) {
            return new fa.fn.init(a, b, P)
        },
        ga = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ha = /\S+/g,
        ia = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        ja = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        ka = /^-ms-/,
        la = /-([\da-z])/gi,
        ma = function(a, b) {
            return b.toUpperCase()
        },
        na = function() {
            T.removeEventListener("DOMContentLoaded", na, !1), a.removeEventListener("load", na, !1), fa.ready()
        };
    fa.fn = fa.prototype = {
            jquery: Z,
            constructor: fa,
            init: function(a, c, d) {
                var e, f;
                if (!a) return this;
                if ("string" == typeof a) {
                    if (e = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : ia.exec(a), !e || !e[1] && c) return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a);
                    if (e[1]) {
                        if (c = c instanceof fa ? c[0] : c, fa.merge(this, fa.parseHTML(e[1], c && c.nodeType ? c.ownerDocument || c : T, !0)), ja.test(e[1]) && fa.isPlainObject(c))
                            for (e in c) fa.isFunction(this[e]) ? this[e](c[e]) : this.attr(e, c[e]);
                        return this
                    }
                    return f = T.getElementById(e[2]), f && f.parentNode && (this.length = 1, this[0] = f), this.context = T, this.selector = a, this
                }
                return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : fa.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), fa.makeArray(a, this))
            },
            selector: "",
            length: 0,
            toArray: function() {
                return aa.call(this)
            },
            get: function(a) {
                return null == a ? this.toArray() : 0 > a ? this[this.length + a] : this[a]
            },
            pushStack: function(a) {
                var b = fa.merge(this.constructor(), a);
                return b.prevObject = this, b.context = this.context, b
            },
            each: function(a, b) {
                return fa.each(this, a, b)
            },
            ready: function(a) {
                return fa.ready.promise().done(a), this
            },
            slice: function() {
                return this.pushStack(aa.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(a) {
                var b = this.length,
                    c = +a + (0 > a ? b : 0);
                return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
            },
            map: function(a) {
                return this.pushStack(fa.map(this, function(b, c) {
                    return a.call(b, c, b)
                }))
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: _,
            sort: [].sort,
            splice: [].splice
        }, fa.fn.init.prototype = fa.fn, fa.extend = fa.fn.extend = function() {
            var a, c, d, e, f, g, h = arguments[0] || {},
                i = 1,
                j = arguments.length,
                k = !1;
            for ("boolean" == typeof h && (k = h, h = arguments[1] || {}, i = 2), "object" == typeof h || fa.isFunction(h) || (h = {}), j === i && (h = this, --i); j > i; i++)
                if (null != (a = arguments[i]))
                    for (c in a) d = h[c], e = a[c], h !== e && (k && e && (fa.isPlainObject(e) || (f = fa.isArray(e))) ? (f ? (f = !1, g = d && fa.isArray(d) ? d : []) : g = d && fa.isPlainObject(d) ? d : {}, h[c] = fa.extend(k, g, e)) : e !== b && (h[c] = e));
            return h
        }, fa.extend({
            expando: "jQuery" + (Z + Math.random()).replace(/\D/g, ""),
            noConflict: function(b) {
                return a.$ === fa && (a.$ = W), b && a.jQuery === fa && (a.jQuery = V), fa
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function(a) {
                a ? fa.readyWait++ : fa.ready(!0)
            },
            ready: function(a) {
                (a === !0 ? --fa.readyWait : fa.isReady) || (fa.isReady = !0, a !== !0 && --fa.readyWait > 0 || (Q.resolveWith(T, [fa]), fa.fn.trigger && fa(T).trigger("ready").off("ready")))
            },
            isFunction: function(a) {
                return "function" === fa.type(a)
            },
            isArray: Array.isArray,
            isWindow: function(a) {
                return null != a && a === a.window
            },
            isNumeric: function(a) {
                return !isNaN(parseFloat(a)) && isFinite(a)
            },
            type: function(a) {
                return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? X[ca.call(a)] || "object" : typeof a
            },
            isPlainObject: function(a) {
                if ("object" !== fa.type(a) || a.nodeType || fa.isWindow(a)) return !1;
                try {
                    if (a.constructor && !da.call(a.constructor.prototype, "isPrototypeOf")) return !1
                } catch (b) {
                    return !1
                }
                return !0
            },
            isEmptyObject: function(a) {
                var b;
                for (b in a) return !1;
                return !0
            },
            error: function(a) {
                throw Error(a)
            },
            parseHTML: function(a, b, c) {
                if (!a || "string" != typeof a) return null;
                "boolean" == typeof b && (c = b, b = !1), b = b || T;
                var d = ja.exec(a),
                    e = !c && [];
                return d ? [b.createElement(d[1])] : (d = fa.buildFragment([a], b, e), e && fa(e).remove(), fa.merge([], d.childNodes))
            },
            parseJSON: JSON.parse,
            parseXML: function(a) {
                var c, d;
                if (!a || "string" != typeof a) return null;
                try {
                    d = new DOMParser, c = d.parseFromString(a, "text/xml")
                } catch (e) {
                    c = b
                }
                return (!c || c.getElementsByTagName("parsererror").length) && fa.error("Invalid XML: " + a), c
            },
            noop: function() {},
            globalEval: function(a) {
                var b, c = eval;
                a = fa.trim(a), a && (1 === a.indexOf("use strict") ? (b = T.createElement("script"), b.text = a, T.head.appendChild(b).parentNode.removeChild(b)) : c(a))
            },
            camelCase: function(a) {
                return a.replace(ka, "ms-").replace(la, ma)
            },
            nodeName: function(a, b) {
                return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
            },
            each: function(a, b, d) {
                var e, f = 0,
                    g = a.length,
                    h = c(a);
                if (d) {
                    if (h)
                        for (; g > f && (e = b.apply(a[f], d), e !== !1); f++);
                    else
                        for (f in a)
                            if (e = b.apply(a[f], d), e === !1) break
                } else if (h)
                    for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++);
                else
                    for (f in a)
                        if (e = b.call(a[f], f, a[f]), e === !1) break;
                return a
            },
            trim: function(a) {
                return null == a ? "" : ea.call(a)
            },
            makeArray: function(a, b) {
                var d = b || [];
                return null != a && (c(Object(a)) ? fa.merge(d, "string" == typeof a ? [a] : a) : _.call(d, a)), d
            },
            inArray: function(a, b, c) {
                return null == b ? -1 : ba.call(b, a, c)
            },
            merge: function(a, c) {
                var d = c.length,
                    e = a.length,
                    f = 0;
                if ("number" == typeof d)
                    for (; d > f; f++) a[e++] = c[f];
                else
                    for (; c[f] !== b;) a[e++] = c[f++];
                return a.length = e, a
            },
            grep: function(a, b, c) {
                var d, e = [],
                    f = 0,
                    g = a.length;
                for (c = !!c; g > f; f++) d = !!b(a[f], f), c !== d && e.push(a[f]);
                return e
            },
            map: function(a, b, d) {
                var e, f = 0,
                    g = a.length,
                    h = c(a),
                    i = [];
                if (h)
                    for (; g > f; f++) e = b(a[f], f, d), null != e && (i[i.length] = e);
                else
                    for (f in a) e = b(a[f], f, d), null != e && (i[i.length] = e);
                return $.apply([], i)
            },
            guid: 1,
            proxy: function(a, c) {
                var d, e, f;
                return "string" == typeof c && (d = a[c], c = a, a = d), fa.isFunction(a) ? (e = aa.call(arguments, 2), f = function() {
                    return a.apply(c || this, e.concat(aa.call(arguments)))
                }, f.guid = a.guid = a.guid || fa.guid++, f) : b
            },
            access: function(a, c, d, e, f, g, h) {
                var i = 0,
                    j = a.length,
                    k = null == d;
                if ("object" === fa.type(d)) {
                    f = !0;
                    for (i in d) fa.access(a, c, i, d[i], !0, g, h)
                } else if (e !== b && (f = !0, fa.isFunction(e) || (h = !0), k && (h ? (c.call(a, e), c = null) : (k = c, c = function(a, b, c) {
                        return k.call(fa(a), c)
                    })), c))
                    for (; j > i; i++) c(a[i], d, h ? e : e.call(a[i], i, c(a[i], d)));
                return f ? a : k ? c.call(a) : j ? c(a[0], d) : g
            },
            now: Date.now,
            swap: function(a, b, c, d) {
                var e, f, g = {};
                for (f in b) g[f] = a.style[f], a.style[f] = b[f];
                e = c.apply(a, d || []);
                for (f in b) a.style[f] = g[f];
                return e
            }
        }), fa.ready.promise = function(b) {
            return Q || (Q = fa.Deferred(), "complete" === T.readyState ? setTimeout(fa.ready) : (T.addEventListener("DOMContentLoaded", na, !1), a.addEventListener("load", na, !1))), Q.promise(b)
        }, fa.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
            X["[object " + b + "]"] = b.toLowerCase()
        }), P = fa(T),
        function(a, b) {
            function c(a, b, c, d) {
                var e, f, g, h, i, j, k, l, o, p;
                if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], !a || "string" != typeof a) return c;
                if (1 !== (h = b.nodeType) && 9 !== h) return [];
                if (I && !d) {
                    if (e = ta.exec(a))
                        if (g = e[1]) {
                            if (9 === h) {
                                if (f = b.getElementById(g), !f || !f.parentNode) return c;
                                if (f.id === g) return c.push(f), c
                            } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g) return c.push(f), c
                        } else {
                            if (e[2]) return aa.apply(c, b.getElementsByTagName(a)), c;
                            if ((g = e[3]) && x.getElementsByClassName && b.getElementsByClassName) return aa.apply(c, b.getElementsByClassName(g)), c
                        } if (x.qsa && (!J || !J.test(a))) {
                        if (l = k = N, o = b, p = 9 === h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                            for (j = m(a), (k = b.getAttribute("id")) ? l = k.replace(wa, "\\$&") : b.setAttribute("id", l), l = "[id='" + l + "'] ", i = j.length; i--;) j[i] = l + n(j[i]);
                            o = na.test(a) && b.parentNode || b, p = j.join(",")
                        }
                        if (p) try {
                            return aa.apply(c, o.querySelectorAll(p)), c
                        } catch (q) {} finally {
                            k || b.removeAttribute("id")
                        }
                    }
                }
                return v(a.replace(ka, "$1"), b, c, d)
            }

            function d() {
                function a(c, d) {
                    return b.push(c += " ") > z.cacheLength && delete a[b.shift()], a[c] = d
                }
                var b = [];
                return a
            }

            function e(a) {
                return a[N] = !0, a
            }

            function f(a) {
                var b = G.createElement("div");
                try {
                    return !!a(b)
                } catch (c) {
                    return !1
                } finally {
                    b.parentNode && b.parentNode.removeChild(b), b = null
                }
            }

            function g(a, b) {
                for (var c = a.split("|"), d = a.length; d--;) z.attrHandle[c[d]] = b
            }

            function h(a, b) {
                var c = b && a,
                    d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || X) - (~a.sourceIndex || X);
                if (d) return d;
                if (c)
                    for (; c = c.nextSibling;)
                        if (c === b) return -1;
                return a ? 1 : -1
            }

            function i(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return "input" === c && b.type === a
                }
            }

            function j(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return ("input" === c || "button" === c) && b.type === a
                }
            }

            function k(a) {
                return e(function(b) {
                    return b = +b, e(function(c, d) {
                        for (var e, f = a([], c.length, b), g = f.length; g--;) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                    })
                })
            }

            function l() {}

            function m(a, b) {
                var d, e, f, g, h, i, j, k = S[a + " "];
                if (k) return b ? 0 : k.slice(0);
                for (h = a, i = [], j = z.preFilter; h;) {
                    (!d || (e = la.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ma.exec(h)) && (d = e.shift(), f.push({
                        value: d,
                        type: e[0].replace(ka, " ")
                    }), h = h.slice(d.length));
                    for (g in z.filter) !(e = ra[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                        value: d,
                        type: g,
                        matches: e
                    }), h = h.slice(d.length));
                    if (!d) break
                }
                return b ? h.length : h ? c.error(a) : S(a, i).slice(0)
            }

            function n(a) {
                for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
                return d
            }

            function o(a, b, c) {
                var d = b.dir,
                    e = c && "parentNode" === d,
                    f = Q++;
                return b.first ? function(b, c, f) {
                    for (; b = b[d];)
                        if (1 === b.nodeType || e) return a(b, c, f)
                } : function(b, c, g) {
                    var h, i, j, k = P + " " + f;
                    if (g) {
                        for (; b = b[d];)
                            if ((1 === b.nodeType || e) && a(b, c, g)) return !0
                    } else
                        for (; b = b[d];)
                            if (1 === b.nodeType || e)
                                if (j = b[N] || (b[N] = {}), (i = j[d]) && i[0] === k) {
                                    if ((h = i[1]) === !0 || h === y) return h === !0
                                } else if (i = j[d] = [k], i[1] = a(b, c, g) || y, i[1] === !0) return !0
                }
            }

            function p(a) {
                return a.length > 1 ? function(b, c, d) {
                    for (var e = a.length; e--;)
                        if (!a[e](b, c, d)) return !1;
                    return !0
                } : a[0]
            }

            function q(a, b, c, d, e) {
                for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
                return g
            }

            function r(a, b, c, d, f, g) {
                return d && !d[N] && (d = r(d)), f && !f[N] && (f = r(f, g)), e(function(e, g, h, i) {
                    var j, k, l, m = [],
                        n = [],
                        o = g.length,
                        p = e || u(b || "*", h.nodeType ? [h] : h, []),
                        r = !a || !e && b ? p : q(p, m, a, h, i),
                        s = c ? f || (e ? a : o || d) ? [] : g : r;
                    if (c && c(r, s, h, i), d)
                        for (j = q(s, n), d(j, [], h, i), k = j.length; k--;)(l = j[k]) && (s[n[k]] = !(r[n[k]] = l));
                    if (e) {
                        if (f || a) {
                            if (f) {
                                for (j = [], k = s.length; k--;)(l = s[k]) && j.push(r[k] = l);
                                f(null, s = [], j, i)
                            }
                            for (k = s.length; k--;)(l = s[k]) && (j = f ? ca.call(e, l) : m[k]) > -1 && (e[j] = !(g[j] = l))
                        }
                    } else s = q(s === g ? s.splice(o, s.length) : s), f ? f(null, g, s, i) : aa.apply(g, s)
                })
            }

            function s(a) {
                for (var b, c, d, e = a.length, f = z.relative[a[0].type], g = f || z.relative[" "], h = f ? 1 : 0, i = o(function(a) {
                        return a === b
                    }, g, !0), j = o(function(a) {
                        return ca.call(b, a) > -1
                    }, g, !0), k = [function(a, c, d) {
                        return !f && (d || c !== D) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d))
                    }]; e > h; h++)
                    if (c = z.relative[a[h].type]) k = [o(p(k), c)];
                    else {
                        if (c = z.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                            for (d = ++h; e > d && !z.relative[a[d].type]; d++);
                            return r(h > 1 && p(k), h > 1 && n(a.slice(0, h - 1).concat({
                                value: " " === a[h - 2].type ? "*" : ""
                            })).replace(ka, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && n(a))
                        }
                        k.push(c)
                    } return p(k)
            }

            function t(a, b) {
                var d = 0,
                    f = b.length > 0,
                    g = a.length > 0,
                    h = function(e, h, i, j, k) {
                        var l, m, n, o = [],
                            p = 0,
                            r = "0",
                            s = e && [],
                            t = null != k,
                            u = D,
                            v = e || g && z.find.TAG("*", k && h.parentNode || h),
                            w = P += null == u ? 1 : Math.random() || .1;
                        for (t && (D = h !== G && h, y = d); null != (l = v[r]); r++) {
                            if (g && l) {
                                for (m = 0; n = a[m++];)
                                    if (n(l, h, i)) {
                                        j.push(l);
                                        break
                                    } t && (P = w, y = ++d)
                            }
                            f && ((l = !n && l) && p--, e && s.push(l))
                        }
                        if (p += r, f && r !== p) {
                            for (m = 0; n = b[m++];) n(s, o, h, i);
                            if (e) {
                                if (p > 0)
                                    for (; r--;) s[r] || o[r] || (o[r] = $.call(j));
                                o = q(o)
                            }
                            aa.apply(j, o), t && !e && o.length > 0 && p + b.length > 1 && c.uniqueSort(j)
                        }
                        return t && (P = w, D = u), s
                    };
                return f ? e(h) : h
            }

            function u(a, b, d) {
                for (var e = 0, f = b.length; f > e; e++) c(a, b[e], d);
                return d
            }

            function v(a, b, c, d) {
                var e, f, g, h, i, j = m(a);
                if (!d && 1 === j.length) {
                    if (f = j[0] = j[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && x.getById && 9 === b.nodeType && I && z.relative[f[1].type]) {
                        if (b = (z.find.ID(g.matches[0].replace(xa, ya), b) || [])[0], !b) return c;
                        a = a.slice(f.shift().value.length)
                    }
                    for (e = ra.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !z.relative[h = g.type]);)
                        if ((i = z.find[h]) && (d = i(g.matches[0].replace(xa, ya), na.test(f[0].type) && b.parentNode || b))) {
                            if (f.splice(e, 1), a = d.length && n(f), !a) return aa.apply(c, d), c;
                            break
                        }
                }
                return C(a, j)(d, b, !I, c, na.test(a)), c
            }
            var w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + -new Date,
                O = a.document,
                P = 0,
                Q = 0,
                R = d(),
                S = d(),
                T = d(),
                U = !1,
                V = function(a, b) {
                    return a === b ? (U = !0, 0) : 0
                },
                W = typeof b,
                X = 1 << 31,
                Y = {}.hasOwnProperty,
                Z = [],
                $ = Z.pop,
                _ = Z.push,
                aa = Z.push,
                ba = Z.slice,
                ca = Z.indexOf || function(a) {
                    for (var b = 0, c = this.length; c > b; b++)
                        if (this[b] === a) return b;
                    return -1
                },
                da = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                ea = "[\\x20\\t\\r\\n\\f]",
                ga = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                ha = ga.replace("w", "w#"),
                ia = "\\[" + ea + "*(" + ga + ")" + ea + "*(?:([*^$|!~]?=)" + ea + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + ha + ")|)|)" + ea + "*\\]",
                ja = ":(" + ga + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ia.replace(3, 8) + ")*)|.*)\\)|)",
                ka = RegExp("^" + ea + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ea + "+$", "g"),
                la = RegExp("^" + ea + "*," + ea + "*"),
                ma = RegExp("^" + ea + "*([>+~]|" + ea + ")" + ea + "*"),
                na = RegExp(ea + "*[+~]"),
                oa = RegExp("=" + ea + "*([^\\]'\"]*)" + ea + "*\\]", "g"),
                pa = RegExp(ja),
                qa = RegExp("^" + ha + "$"),
                ra = {
                    ID: RegExp("^#(" + ga + ")"),
                    CLASS: RegExp("^\\.(" + ga + ")"),
                    TAG: RegExp("^(" + ga.replace("w", "w*") + ")"),
                    ATTR: RegExp("^" + ia),
                    PSEUDO: RegExp("^" + ja),
                    CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ea + "*(even|odd|(([+-]|)(\\d*)n|)" + ea + "*(?:([+-]|)" + ea + "*(\\d+)|))" + ea + "*\\)|)", "i"),
                    bool: RegExp("^(?:" + da + ")$", "i"),
                    needsContext: RegExp("^" + ea + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ea + "*((?:-\\d)?\\d*)" + ea + "*\\)|)(?=[^-]|$)", "i")
                },
                sa = /^[^{]+\{\s*\[native \w/,
                ta = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                ua = /^(?:input|select|textarea|button)$/i,
                va = /^h\d$/i,
                wa = /'|\\/g,
                xa = RegExp("\\\\([\\da-f]{1,6}" + ea + "?|(" + ea + ")|.)", "ig"),
                ya = function(a, b, c) {
                    var d = "0x" + b - 65536;
                    return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(55296 | d >> 10, 56320 | 1023 & d)
                };
            try {
                aa.apply(Z = ba.call(O.childNodes), O.childNodes), Z[O.childNodes.length].nodeType
            } catch (za) {
                aa = {
                    apply: Z.length ? function(a, b) {
                        _.apply(a, ba.call(b))
                    } : function(a, b) {
                        for (var c = a.length, d = 0; a[c++] = b[d++];);
                        a.length = c - 1
                    }
                }
            }
            B = c.isXML = function(a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return !!b && "HTML" !== b.nodeName
            }, x = c.support = {}, F = c.setDocument = function(a) {
                var c = a ? a.ownerDocument || a : O,
                    d = c.defaultView;
                return c !== G && 9 === c.nodeType && c.documentElement ? (G = c, H = c.documentElement, I = !B(c), d && d.attachEvent && d !== d.top && d.attachEvent("onbeforeunload", function() {
                    F()
                }), x.attributes = f(function(a) {
                    return a.className = "i", !a.getAttribute("className")
                }), x.getElementsByTagName = f(function(a) {
                    return a.appendChild(c.createComment("")), !a.getElementsByTagName("*").length
                }), x.getElementsByClassName = f(function(a) {
                    return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
                }), x.getById = f(function(a) {
                    return H.appendChild(a).id = N, !c.getElementsByName || !c.getElementsByName(N).length
                }), x.getById ? (z.find.ID = function(a, b) {
                    if (typeof b.getElementById !== W && I) {
                        var c = b.getElementById(a);
                        return c && c.parentNode ? [c] : []
                    }
                }, z.filter.ID = function(a) {
                    var b = a.replace(xa, ya);
                    return function(a) {
                        return a.getAttribute("id") === b
                    }
                }) : (delete z.find.ID, z.filter.ID = function(a) {
                    var b = a.replace(xa, ya);
                    return function(a) {
                        var c = typeof a.getAttributeNode !== W && a.getAttributeNode("id");
                        return c && c.value === b
                    }
                }), z.find.TAG = x.getElementsByTagName ? function(a, c) {
                    return typeof c.getElementsByTagName !== W ? c.getElementsByTagName(a) : b
                } : function(a, b) {
                    var c, d = [],
                        e = 0,
                        f = b.getElementsByTagName(a);
                    if ("*" === a) {
                        for (; c = f[e++];) 1 === c.nodeType && d.push(c);
                        return d
                    }
                    return f
                }, z.find.CLASS = x.getElementsByClassName && function(a, c) {
                    return typeof c.getElementsByClassName !== W && I ? c.getElementsByClassName(a) : b
                }, K = [], J = [], (x.qsa = sa.test(c.querySelectorAll)) && (f(function(a) {
                    a.innerHTML = "<select><option selected=''></option></select>", a.querySelectorAll("[selected]").length || J.push("\\[" + ea + "*(?:value|" + da + ")"), a.querySelectorAll(":checked").length || J.push(":checked")
                }), f(function(a) {
                    var b = c.createElement("input");
                    b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("t", ""), a.querySelectorAll("[t^='']").length && J.push("[*^$]=" + ea + "*(?:''|\"\")"), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
                })), (x.matchesSelector = sa.test(L = H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && f(function(a) {
                    x.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", ja)
                }), J = J.length && RegExp(J.join("|")), K = K.length && RegExp(K.join("|")), M = sa.test(H.contains) || H.compareDocumentPosition ? function(a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a,
                        d = b && b.parentNode;
                    return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                } : function(a, b) {
                    if (b)
                        for (; b = b.parentNode;)
                            if (b === a) return !0;
                    return !1
                }, V = H.compareDocumentPosition ? function(a, b) {
                    if (a === b) return U = !0, 0;
                    var d = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b);
                    return d ? 1 & d || !x.sortDetached && b.compareDocumentPosition(a) === d ? a === c || M(O, a) ? -1 : b === c || M(O, b) ? 1 : E ? ca.call(E, a) - ca.call(E, b) : 0 : 4 & d ? -1 : 1 : a.compareDocumentPosition ? -1 : 1
                } : function(a, b) {
                    var d, e = 0,
                        f = a.parentNode,
                        g = b.parentNode,
                        i = [a],
                        j = [b];
                    if (a === b) return U = !0, 0;
                    if (!f || !g) return a === c ? -1 : b === c ? 1 : f ? -1 : g ? 1 : E ? ca.call(E, a) - ca.call(E, b) : 0;
                    if (f === g) return h(a, b);
                    for (d = a; d = d.parentNode;) i.unshift(d);
                    for (d = b; d = d.parentNode;) j.unshift(d);
                    for (; i[e] === j[e];) e++;
                    return e ? h(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
                }, c) : G
            }, c.matches = function(a, b) {
                return c(a, null, null, b)
            }, c.matchesSelector = function(a, b) {
                if ((a.ownerDocument || a) !== G && F(a), b = b.replace(oa, "='$1']"), !(!x.matchesSelector || !I || K && K.test(b) || J && J.test(b))) try {
                    var d = L.call(a, b);
                    if (d || x.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
                } catch (e) {}
                return c(b, G, null, [a]).length > 0
            }, c.contains = function(a, b) {
                return (a.ownerDocument || a) !== G && F(a), M(a, b)
            }, c.attr = function(a, c) {
                (a.ownerDocument || a) !== G && F(a);
                var d = z.attrHandle[c.toLowerCase()],
                    e = d && Y.call(z.attrHandle, c.toLowerCase()) ? d(a, c, !I) : b;
                return e === b ? x.attributes || !I ? a.getAttribute(c) : (e = a.getAttributeNode(c)) && e.specified ? e.value : null : e
            }, c.error = function(a) {
                throw Error("Syntax error, unrecognized expression: " + a)
            }, c.uniqueSort = function(a) {
                var b, c = [],
                    d = 0,
                    e = 0;
                if (U = !x.detectDuplicates, E = !x.sortStable && a.slice(0), a.sort(V), U) {
                    for (; b = a[e++];) b === a[e] && (d = c.push(e));
                    for (; d--;) a.splice(c[d], 1)
                }
                return a
            }, A = c.getText = function(a) {
                var b, c = "",
                    d = 0,
                    e = a.nodeType;
                if (e) {
                    if (1 === e || 9 === e || 11 === e) {
                        if ("string" == typeof a.textContent) return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling) c += A(a)
                    } else if (3 === e || 4 === e) return a.nodeValue
                } else
                    for (; b = a[d]; d++) c += A(b);
                return c
            }, z = c.selectors = {
                cacheLength: 50,
                createPseudo: e,
                match: ra,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(a) {
                        return a[1] = a[1].replace(xa, ya), a[3] = (a[4] || a[5] || "").replace(xa, ya), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                    },
                    CHILD: function(a) {
                        return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || c.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && c.error(a[0]), a
                    },
                    PSEUDO: function(a) {
                        var c, d = !a[5] && a[2];
                        return ra.CHILD.test(a[0]) ? null : (a[3] && a[4] !== b ? a[2] = a[4] : d && pa.test(d) && (c = m(d, !0)) && (c = d.indexOf(")", d.length - c) - d.length) && (a[0] = a[0].slice(0, c), a[2] = d.slice(0, c)), a.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(a) {
                        var b = a.replace(xa, ya).toLowerCase();
                        return "*" === a ? function() {
                            return !0
                        } : function(a) {
                            return a.nodeName && a.nodeName.toLowerCase() === b
                        }
                    },
                    CLASS: function(a) {
                        var b = R[a + " "];
                        return b || (b = RegExp("(^|" + ea + ")" + a + "(" + ea + "|$)")) && R(a, function(a) {
                            return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== W && a.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(a, b, d) {
                        return function(e) {
                            var f = c.attr(e, a);
                            return null == f ? "!=" === b : !b || (f += "", "=" === b ? f === d : "!=" === b ? f !== d : "^=" === b ? d && 0 === f.indexOf(d) : "*=" === b ? d && f.indexOf(d) > -1 : "$=" === b ? d && f.slice(-d.length) === d : "~=" === b ? (" " + f + " ").indexOf(d) > -1 : "|=" === b && (f === d || f.slice(0, d.length + 1) === d + "-"))
                        }
                    },
                    CHILD: function(a, b, c, d, e) {
                        var f = "nth" !== a.slice(0, 3),
                            g = "last" !== a.slice(-4),
                            h = "of-type" === b;
                        return 1 === d && 0 === e ? function(a) {
                            return !!a.parentNode
                        } : function(b, c, i) {
                            var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                                q = b.parentNode,
                                r = h && b.nodeName.toLowerCase(),
                                s = !i && !h;
                            if (q) {
                                if (f) {
                                    for (; p;) {
                                        for (l = b; l = l[p];)
                                            if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                        o = p = "only" === a && !o && "nextSibling"
                                    }
                                    return !0
                                }
                                if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                    for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop();)
                                        if (1 === l.nodeType && ++m && l === b) {
                                            k[a] = [P, n, m];
                                            break
                                        }
                                } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P) m = j[1];
                                else
                                    for (;
                                        (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b)););
                                return m -= e, m === d || 0 === m % d && m / d >= 0
                            }
                        }
                    },
                    PSEUDO: function(a, b) {
                        var d, f = z.pseudos[a] || z.setFilters[a.toLowerCase()] || c.error("unsupported pseudo: " + a);
                        return f[N] ? f(b) : f.length > 1 ? (d = [a, a, "", b], z.setFilters.hasOwnProperty(a.toLowerCase()) ? e(function(a, c) {
                            for (var d, e = f(a, b), g = e.length; g--;) d = ca.call(a, e[g]), a[d] = !(c[d] = e[g])
                        }) : function(a) {
                            return f(a, 0, d)
                        }) : f
                    }
                },
                pseudos: {
                    not: e(function(a) {
                        var b = [],
                            c = [],
                            d = C(a.replace(ka, "$1"));
                        return d[N] ? e(function(a, b, c, e) {
                            for (var f, g = d(a, null, e, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                        }) : function(a, e, f) {
                            return b[0] = a, d(b, null, f, c), !c.pop()
                        }
                    }),
                    has: e(function(a) {
                        return function(b) {
                            return c(a, b).length > 0
                        }
                    }),
                    contains: e(function(a) {
                        return function(b) {
                            return (b.textContent || b.innerText || A(b)).indexOf(a) > -1
                        }
                    }),
                    lang: e(function(a) {
                        return qa.test(a || "") || c.error("unsupported lang: " + a), a = a.replace(xa, ya).toLowerCase(),
                            function(b) {
                                var c;
                                do
                                    if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                                return !1
                            }
                    }),
                    target: function(b) {
                        var c = a.location && a.location.hash;
                        return c && c.slice(1) === b.id
                    },
                    root: function(a) {
                        return a === H
                    },
                    focus: function(a) {
                        return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                    },
                    enabled: function(a) {
                        return a.disabled === !1
                    },
                    disabled: function(a) {
                        return a.disabled === !0
                    },
                    checked: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && !!a.checked || "option" === b && !!a.selected
                    },
                    selected: function(a) {
                        return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                    },
                    empty: function(a) {
                        for (a = a.firstChild; a; a = a.nextSibling)
                            if (a.nodeName > "@" || 3 === a.nodeType || 4 === a.nodeType) return !1;
                        return !0
                    },
                    parent: function(a) {
                        return !z.pseudos.empty(a)
                    },
                    header: function(a) {
                        return va.test(a.nodeName)
                    },
                    input: function(a) {
                        return ua.test(a.nodeName)
                    },
                    button: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && "button" === a.type || "button" === b
                    },
                    text: function(a) {
                        var b;
                        return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || b.toLowerCase() === a.type)
                    },
                    first: k(function() {
                        return [0]
                    }),
                    last: k(function(a, b) {
                        return [b - 1]
                    }),
                    eq: k(function(a, b, c) {
                        return [0 > c ? c + b : c]
                    }),
                    even: k(function(a, b) {
                        for (var c = 0; b > c; c += 2) a.push(c);
                        return a
                    }),
                    odd: k(function(a, b) {
                        for (var c = 1; b > c; c += 2) a.push(c);
                        return a
                    }),
                    lt: k(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                        return a
                    }),
                    gt: k(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; b > ++d;) a.push(d);
                        return a
                    })
                }
            }, z.pseudos.nth = z.pseudos.eq;
            for (w in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) z.pseudos[w] = i(w);
            for (w in {
                    submit: !0,
                    reset: !0
                }) z.pseudos[w] = j(w);
            l.prototype = z.filters = z.pseudos, z.setFilters = new l, C = c.compile = function(a, b) {
                var c, d = [],
                    e = [],
                    f = T[a + " "];
                if (!f) {
                    for (b || (b = m(a)), c = b.length; c--;) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                    f = T(a, t(e, d))
                }
                return f
            }, x.sortStable = N.split("").sort(V).join("") === N, x.detectDuplicates = U, F(), x.sortDetached = f(function(a) {
                return 1 & a.compareDocumentPosition(G.createElement("div"))
            }), f(function(a) {
                return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
            }) || g("type|href|height|width", function(a, c, d) {
                return d ? b : a.getAttribute(c, "type" === c.toLowerCase() ? 1 : 2)
            }), x.attributes && f(function(a) {
                return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
            }) || g("value", function(a, c, d) {
                return d || "input" !== a.nodeName.toLowerCase() ? b : a.defaultValue
            }), f(function(a) {
                return null == a.getAttribute("disabled")
            }) || g(da, function(a, c, d) {
                var e;
                return d ? b : (e = a.getAttributeNode(c)) && e.specified ? e.value : a[c] === !0 ? c.toLowerCase() : null
            }), fa.find = c, fa.expr = c.selectors, fa.expr[":"] = fa.expr.pseudos, fa.unique = c.uniqueSort, fa.text = c.getText, fa.isXMLDoc = c.isXML, fa.contains = c.contains
        }(a);
    var oa = {};
    fa.Callbacks = function(a) {
        a = "string" == typeof a ? oa[a] || d(a) : fa.extend({}, a);
        var c, e, f, g, h, i, j = [],
            k = !a.once && [],
            l = function(b) {
                for (c = a.memory && b, e = !0, i = g || 0, g = 0, h = j.length, f = !0; j && h > i; i++)
                    if (j[i].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
                        c = !1;
                        break
                    } f = !1, j && (k ? k.length && l(k.shift()) : c ? j = [] : m.disable())
            },
            m = {
                add: function() {
                    if (j) {
                        var b = j.length;
                        ! function d(b) {
                            fa.each(b, function(b, c) {
                                var e = fa.type(c);
                                "function" === e ? a.unique && m.has(c) || j.push(c) : c && c.length && "string" !== e && d(c)
                            })
                        }(arguments), f ? h = j.length : c && (g = b, l(c))
                    }
                    return this
                },
                remove: function() {
                    return j && fa.each(arguments, function(a, b) {
                        for (var c;
                            (c = fa.inArray(b, j, c)) > -1;) j.splice(c, 1), f && (h >= c && h--, i >= c && i--)
                    }), this
                },
                has: function(a) {
                    return a ? fa.inArray(a, j) > -1 : !(!j || !j.length)
                },
                empty: function() {
                    return j = [], h = 0, this
                },
                disable: function() {
                    return j = k = c = b, this
                },
                disabled: function() {
                    return !j
                },
                lock: function() {
                    return k = b, c || m.disable(), this
                },
                locked: function() {
                    return !k
                },
                fireWith: function(a, b) {
                    return !j || e && !k || (b = b || [], b = [a, b.slice ? b.slice() : b], f ? k.push(b) : l(b)), this
                },
                fire: function() {
                    return m.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!e
                }
            };
        return m
    }, fa.extend({
        Deferred: function(a) {
            var b = [
                    ["resolve", "done", fa.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", fa.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", fa.Callbacks("memory")]
                ],
                c = "pending",
                d = {
                    state: function() {
                        return c
                    },
                    always: function() {
                        return e.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var a = arguments;
                        return fa.Deferred(function(c) {
                            fa.each(b, function(b, f) {
                                var g = f[0],
                                    h = fa.isFunction(a[b]) && a[b];
                                e[f[1]](function() {
                                    var a = h && h.apply(this, arguments);
                                    a && fa.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[g + "With"](this === d ? c.promise() : this, h ? [a] : arguments)
                                })
                            }), a = null
                        }).promise()
                    },
                    promise: function(a) {
                        return null != a ? fa.extend(a, d) : d
                    }
                },
                e = {};
            return d.pipe = d.then, fa.each(b, function(a, f) {
                var g = f[2],
                    h = f[3];
                d[f[1]] = g.add, h && g.add(function() {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this
                }, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        },
        when: function(a) {
            var b, c, d, e = 0,
                f = aa.call(arguments),
                g = f.length,
                h = 1 !== g || a && fa.isFunction(a.promise) ? g : 0,
                i = 1 === h ? a : fa.Deferred(),
                j = function(a, c, d) {
                    return function(e) {
                        c[a] = this, d[a] = arguments.length > 1 ? aa.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                    }
                };
            if (g > 1)
                for (b = Array(g), c = Array(g), d = Array(g); g > e; e++) f[e] && fa.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
            return h || i.resolveWith(d, f), i.promise()
        }
    }), fa.support = function(b) {
        var c = T.createElement("input"),
            d = T.createDocumentFragment(),
            e = T.createElement("div"),
            f = T.createElement("select"),
            g = f.appendChild(T.createElement("option"));
        return c.type ? (c.type = "checkbox", b.checkOn = "" !== c.value, b.optSelected = g.selected, b.reliableMarginRight = !0, b.boxSizingReliable = !0, b.pixelPosition = !1, c.checked = !0, b.noCloneChecked = c.cloneNode(!0).checked, f.disabled = !0, b.optDisabled = !g.disabled, c = T.createElement("input"), c.value = "t", c.type = "radio", b.radioValue = "t" === c.value, c.setAttribute("checked", "t"), c.setAttribute("name", "t"), d.appendChild(c), b.checkClone = d.cloneNode(!0).cloneNode(!0).lastChild.checked, b.focusinBubbles = "onfocusin" in a, e.style.backgroundClip = "content-box", e.cloneNode(!0).style.backgroundClip = "", b.clearCloneStyle = "content-box" === e.style.backgroundClip, fa(function() {
            var c, d, f = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
                g = T.getElementsByTagName("body")[0];
            g && (c = T.createElement("div"), c.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", g.appendChild(c).appendChild(e), e.innerHTML = "", e.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%", fa.swap(g, null != g.style.zoom ? {
                zoom: 1
            } : {}, function() {
                b.boxSizing = 4 === e.offsetWidth
            }), a.getComputedStyle && (b.pixelPosition = "1%" !== (a.getComputedStyle(e, null) || {}).top, b.boxSizingReliable = "4px" === (a.getComputedStyle(e, null) || {
                    width: "4px"
                }).width, d = e.appendChild(T.createElement("div")), d.style.cssText = e.style.cssText = f, d.style.marginRight = d.style.width = "0", e.style.width = "1px",
                b.reliableMarginRight = !parseFloat((a.getComputedStyle(d, null) || {}).marginRight)), g.removeChild(c))
        }), b) : b
    }({});
    var pa, qa, ra = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        sa = /([A-Z])/g;
    e.uid = 1, e.accepts = function(a) {
        return !a.nodeType || (1 === a.nodeType || 9 === a.nodeType)
    }, e.prototype = {
        key: function(a) {
            if (!e.accepts(a)) return 0;
            var b = {},
                c = a[this.expando];
            if (!c) {
                c = e.uid++;
                try {
                    b[this.expando] = {
                        value: c
                    }, Object.defineProperties(a, b)
                } catch (d) {
                    b[this.expando] = c, fa.extend(a, b)
                }
            }
            return this.cache[c] || (this.cache[c] = {}), c
        },
        set: function(a, b, c) {
            var d, e = this.key(a),
                f = this.cache[e];
            if ("string" == typeof b) f[b] = c;
            else if (fa.isEmptyObject(f)) fa.extend(this.cache[e], b);
            else
                for (d in b) f[d] = b[d];
            return f
        },
        get: function(a, c) {
            var d = this.cache[this.key(a)];
            return c === b ? d : d[c]
        },
        access: function(a, c, d) {
            var e;
            return c === b || c && "string" == typeof c && d === b ? (e = this.get(a, c), e !== b ? e : this.get(a, fa.camelCase(c))) : (this.set(a, c, d), d !== b ? d : c)
        },
        remove: function(a, c) {
            var d, e, f, g = this.key(a),
                h = this.cache[g];
            if (c === b) this.cache[g] = {};
            else {
                fa.isArray(c) ? e = c.concat(c.map(fa.camelCase)) : (f = fa.camelCase(c), c in h ? e = [c, f] : (e = f, e = e in h ? [e] : e.match(ha) || [])), d = e.length;
                for (; d--;) delete h[e[d]]
            }
        },
        hasData: function(a) {
            return !fa.isEmptyObject(this.cache[a[this.expando]] || {})
        },
        discard: function(a) {
            a[this.expando] && delete this.cache[a[this.expando]]
        }
    }, pa = new e, qa = new e, fa.extend({
        acceptData: e.accepts,
        hasData: function(a) {
            return pa.hasData(a) || qa.hasData(a)
        },
        data: function(a, b, c) {
            return pa.access(a, b, c)
        },
        removeData: function(a, b) {
            pa.remove(a, b)
        },
        _data: function(a, b, c) {
            return qa.access(a, b, c)
        },
        _removeData: function(a, b) {
            qa.remove(a, b)
        }
    }), fa.fn.extend({
        data: function(a, c) {
            var d, e, g = this[0],
                h = 0,
                i = null;
            if (a === b) {
                if (this.length && (i = pa.get(g), 1 === g.nodeType && !qa.get(g, "hasDataAttrs"))) {
                    for (d = g.attributes; d.length > h; h++) e = d[h].name, 0 === e.indexOf("data-") && (e = fa.camelCase(e.slice(5)), f(g, e, i[e]));
                    qa.set(g, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof a ? this.each(function() {
                pa.set(this, a)
            }) : fa.access(this, function(c) {
                var d, e = fa.camelCase(a);
                if (g && c === b) {
                    if (d = pa.get(g, a), d !== b) return d;
                    if (d = pa.get(g, e), d !== b) return d;
                    if (d = f(g, e, b), d !== b) return d
                } else this.each(function() {
                    var d = pa.get(this, e);
                    pa.set(this, e, c), -1 !== a.indexOf("-") && d !== b && pa.set(this, a, c)
                })
            }, null, c, arguments.length > 1, null, !0)
        },
        removeData: function(a) {
            return this.each(function() {
                pa.remove(this, a)
            })
        }
    }), fa.extend({
        queue: function(a, c, d) {
            var e;
            return a ? (c = (c || "fx") + "queue", e = qa.get(a, c), d && (!e || fa.isArray(d) ? e = qa.access(a, c, fa.makeArray(d)) : e.push(d)), e || []) : b
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = fa.queue(a, b),
                d = c.length,
                e = c.shift(),
                f = fa._queueHooks(a, b),
                g = function() {
                    fa.dequeue(a, b)
                };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return qa.get(a, c) || qa.access(a, c, {
                empty: fa.Callbacks("once memory").add(function() {
                    qa.remove(a, [b + "queue", c])
                })
            })
        }
    }), fa.fn.extend({
        queue: function(a, c) {
            var d = 2;
            return "string" != typeof a && (c = a, a = "fx", d--), d > arguments.length ? fa.queue(this[0], a) : c === b ? this : this.each(function() {
                var b = fa.queue(this, a, c);
                fa._queueHooks(this, a), "fx" === a && "inprogress" !== b[0] && fa.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                fa.dequeue(this, a)
            })
        },
        delay: function(a, b) {
            return a = fa.fx ? fa.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d)
                }
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, c) {
            var d, e = 1,
                f = fa.Deferred(),
                g = this,
                h = this.length,
                i = function() {
                    --e || f.resolveWith(g, [g])
                };
            for ("string" != typeof a && (c = a, a = b), a = a || "fx"; h--;) d = qa.get(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
            return i(), f.promise(c)
        }
    });
    var ta, ua, va = /[\t\r\n\f]/g,
        wa = /\r/g,
        xa = /^(?:input|select|textarea|button)$/i;
    fa.fn.extend({
        attr: function(a, b) {
            return fa.access(this, fa.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                fa.removeAttr(this, a)
            })
        },
        prop: function(a, b) {
            return fa.access(this, fa.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return this.each(function() {
                delete this[fa.propFix[a] || a]
            })
        },
        addClass: function(a) {
            var b, c, d, e, f, g = 0,
                h = this.length,
                i = "string" == typeof a && a;
            if (fa.isFunction(a)) return this.each(function(b) {
                fa(this).addClass(a.call(this, b, this.className))
            });
            if (i)
                for (b = (a || "").match(ha) || []; h > g; g++)
                    if (c = this[g], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(va, " ") : " ")) {
                        for (f = 0; e = b[f++];) 0 > d.indexOf(" " + e + " ") && (d += e + " ");
                        c.className = fa.trim(d)
                    } return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g = 0,
                h = this.length,
                i = 0 === arguments.length || "string" == typeof a && a;
            if (fa.isFunction(a)) return this.each(function(b) {
                fa(this).removeClass(a.call(this, b, this.className))
            });
            if (i)
                for (b = (a || "").match(ha) || []; h > g; g++)
                    if (c = this[g], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(va, " ") : "")) {
                        for (f = 0; e = b[f++];)
                            for (; d.indexOf(" " + e + " ") >= 0;) d = d.replace(" " + e + " ", " ");
                        c.className = a ? fa.trim(d) : ""
                    } return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : fa.isFunction(a) ? this.each(function(c) {
                fa(this).toggleClass(a.call(this, c, this.className, b), b)
            }) : this.each(function() {
                if ("string" === c)
                    for (var b, d = 0, e = fa(this), f = a.match(ha) || []; b = f[d++];) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                else(c === R || "boolean" === c) && (this.className && qa.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : qa.get(this, "__className__") || "")
            })
        },
        hasClass: function(a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(va, " ").indexOf(b) >= 0) return !0;
            return !1
        },
        val: function(a) {
            var c, d, e, f = this[0];
            return arguments.length ? (e = fa.isFunction(a), this.each(function(d) {
                var f;
                1 === this.nodeType && (f = e ? a.call(this, d, fa(this).val()) : a, null == f ? f = "" : "number" == typeof f ? f += "" : fa.isArray(f) && (f = fa.map(f, function(a) {
                    return null == a ? "" : a + ""
                })), c = fa.valHooks[this.type] || fa.valHooks[this.nodeName.toLowerCase()], c && "set" in c && c.set(this, f, "value") !== b || (this.value = f))
            })) : f ? (c = fa.valHooks[f.type] || fa.valHooks[f.nodeName.toLowerCase()], c && "get" in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, "string" == typeof d ? d.replace(wa, "") : null == d ? "" : d)) : void 0
        }
    }), fa.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                        if (c = d[i], !(!c.selected && i !== e || (fa.support.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && fa.nodeName(c.parentNode, "optgroup"))) {
                            if (b = fa(c).val(), f) return b;
                            g.push(b)
                        } return g
                },
                set: function(a, b) {
                    for (var c, d, e = a.options, f = fa.makeArray(b), g = e.length; g--;) d = e[g], (d.selected = fa.inArray(fa(d).val(), f) >= 0) && (c = !0);
                    return c || (a.selectedIndex = -1), f
                }
            }
        },
        attr: function(a, c, d) {
            var e, f, g = a.nodeType;
            if (a && 3 !== g && 8 !== g && 2 !== g) return typeof a.getAttribute === R ? fa.prop(a, c, d) : (1 === g && fa.isXMLDoc(a) || (c = c.toLowerCase(), e = fa.attrHooks[c] || (fa.expr.match.bool.test(c) ? ua : ta)), d === b ? e && "get" in e && null !== (f = e.get(a, c)) ? f : (f = fa.find.attr(a, c), null == f ? b : f) : null !== d ? e && "set" in e && (f = e.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), d) : (fa.removeAttr(a, c), b))
        },
        removeAttr: function(a, b) {
            var c, d, e = 0,
                f = b && b.match(ha);
            if (f && 1 === a.nodeType)
                for (; c = f[e++];) d = fa.propFix[c] || c, fa.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c)
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!fa.support.radioValue && "radio" === b && fa.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(a, c, d) {
            var e, f, g, h = a.nodeType;
            if (a && 3 !== h && 8 !== h && 2 !== h) return g = 1 !== h || !fa.isXMLDoc(a), g && (c = fa.propFix[c] || c, f = fa.propHooks[c]), d !== b ? f && "set" in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get" in f && null !== (e = f.get(a, c)) ? e : a[c]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    return a.hasAttribute("tabindex") || xa.test(a.nodeName) || a.href ? a.tabIndex : -1
                }
            }
        }
    }), ua = {
        set: function(a, b, c) {
            return b === !1 ? fa.removeAttr(a, c) : a.setAttribute(c, c), c
        }
    }, fa.each(fa.expr.match.bool.source.match(/\w+/g), function(a, c) {
        var d = fa.expr.attrHandle[c] || fa.find.attr;
        fa.expr.attrHandle[c] = function(a, c, e) {
            var f = fa.expr.attrHandle[c],
                g = e ? b : (fa.expr.attrHandle[c] = b) != d(a, c, e) ? c.toLowerCase() : null;
            return fa.expr.attrHandle[c] = f, g
        }
    }), fa.support.optSelected || (fa.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && b.parentNode && b.parentNode.selectedIndex, null
        }
    }), fa.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        fa.propFix[this.toLowerCase()] = this
    }), fa.each(["radio", "checkbox"], function() {
        fa.valHooks[this] = {
            set: function(a, c) {
                return fa.isArray(c) ? a.checked = fa.inArray(fa(a).val(), c) >= 0 : b
            }
        }, fa.support.checkOn || (fa.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    });
    var ya = /^key/,
        za = /^(?:mouse|contextmenu)|click/,
        Aa = /^(?:focusinfocus|focusoutblur)$/,
        Ba = /^([^.]*)(?:\.(.+)|)$/;
    fa.event = {
        global: {},
        add: function(a, c, d, e, f) {
            var g, h, i, j, k, l, m, n, o, p, q, r = qa.get(a);
            if (r) {
                for (d.handler && (g = d, d = g.handler, f = g.selector), d.guid || (d.guid = fa.guid++), (j = r.events) || (j = r.events = {}), (h = r.handle) || (h = r.handle = function(a) {
                        return typeof fa === R || a && fa.event.triggered === a.type ? b : fa.event.dispatch.apply(h.elem, arguments)
                    }, h.elem = a), c = (c || "").match(ha) || [""], k = c.length; k--;) i = Ba.exec(c[k]) || [], o = q = i[1], p = (i[2] || "").split(".").sort(), o && (m = fa.event.special[o] || {}, o = (f ? m.delegateType : m.bindType) || o, m = fa.event.special[o] || {}, l = fa.extend({
                    type: o,
                    origType: q,
                    data: e,
                    handler: d,
                    guid: d.guid,
                    selector: f,
                    needsContext: f && fa.expr.match.needsContext.test(f),
                    namespace: p.join(".")
                }, g), (n = j[o]) || (n = j[o] = [], n.delegateCount = 0, m.setup && m.setup.call(a, e, p, h) !== !1 || a.addEventListener && a.addEventListener(o, h, !1)), m.add && (m.add.call(a, l), l.handler.guid || (l.handler.guid = d.guid)), f ? n.splice(n.delegateCount++, 0, l) : n.push(l), fa.event.global[o] = !0);
                a = null
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = qa.hasData(a) && qa.get(a);
            if (q && (i = q.events)) {
                for (b = (b || "").match(ha) || [""], j = b.length; j--;)
                    if (h = Ba.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                        for (l = fa.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = i[n] || [], h = h[2] && RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length; f--;) k = m[f], !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
                        g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || fa.removeEvent(a, n, q.handle), delete i[n])
                    } else
                        for (n in i) fa.event.remove(a, n + b[j], c, d, !0);
                fa.isEmptyObject(i) && (delete q.handle, qa.remove(a, "events"))
            }
        },
        trigger: function(c, d, e, f) {
            var g, h, i, j, k, l, m, n = [e || T],
                o = da.call(c, "type") ? c.type : c,
                p = da.call(c, "namespace") ? c.namespace.split(".") : [];
            if (h = i = e = e || T, 3 !== e.nodeType && 8 !== e.nodeType && !Aa.test(o + fa.event.triggered) && (o.indexOf(".") >= 0 && (p = o.split("."), o = p.shift(), p.sort()), k = 0 > o.indexOf(":") && "on" + o, c = c[fa.expando] ? c : new fa.Event(o, "object" == typeof c && c), c.isTrigger = f ? 2 : 3, c.namespace = p.join("."), c.namespace_re = c.namespace ? RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, c.result = b, c.target || (c.target = e), d = null == d ? [c] : fa.makeArray(d, [c]), m = fa.event.special[o] || {}, f || !m.trigger || m.trigger.apply(e, d) !== !1)) {
                if (!f && !m.noBubble && !fa.isWindow(e)) {
                    for (j = m.delegateType || o, Aa.test(j + o) || (h = h.parentNode); h; h = h.parentNode) n.push(h), i = h;
                    i === (e.ownerDocument || T) && n.push(i.defaultView || i.parentWindow || a)
                }
                for (g = 0;
                    (h = n[g++]) && !c.isPropagationStopped();) c.type = g > 1 ? j : m.bindType || o, l = (qa.get(h, "events") || {})[c.type] && qa.get(h, "handle"), l && l.apply(h, d), l = k && h[k], l && fa.acceptData(h) && l.apply && l.apply(h, d) === !1 && c.preventDefault();
                return c.type = o, f || c.isDefaultPrevented() || m._default && m._default.apply(n.pop(), d) !== !1 || !fa.acceptData(e) || k && fa.isFunction(e[o]) && !fa.isWindow(e) && (i = e[k], i && (e[k] = null), fa.event.triggered = o, e[o](), fa.event.triggered = b, i && (e[k] = i)), c.result
            }
        },
        dispatch: function(a) {
            a = fa.event.fix(a);
            var c, d, e, f, g, h = [],
                i = aa.call(arguments),
                j = (qa.get(this, "events") || {})[a.type] || [],
                k = fa.event.special[a.type] || {};
            if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                for (h = fa.event.handlers.call(this, a, j), c = 0;
                    (f = h[c++]) && !a.isPropagationStopped();)
                    for (a.currentTarget = f.elem, d = 0;
                        (g = f.handlers[d++]) && !a.isImmediatePropagationStopped();)(!a.namespace_re || a.namespace_re.test(g.namespace)) && (a.handleObj = g, a.data = g.data, e = ((fa.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), e !== b && (a.result = e) === !1 && (a.preventDefault(), a.stopPropagation()));
                return k.postDispatch && k.postDispatch.call(this, a), a.result
            }
        },
        handlers: function(a, c) {
            var d, e, f, g, h = [],
                i = c.delegateCount,
                j = a.target;
            if (i && j.nodeType && (!a.button || "click" !== a.type))
                for (; j !== this; j = j.parentNode || this)
                    if (j.disabled !== !0 || "click" !== a.type) {
                        for (e = [], d = 0; i > d; d++) g = c[d], f = g.selector + " ", e[f] === b && (e[f] = g.needsContext ? fa(f, this).index(j) >= 0 : fa.find(f, this, null, [j]).length), e[f] && e.push(g);
                        e.length && h.push({
                            elem: j,
                            handlers: e
                        })
                    } return c.length > i && h.push({
                elem: this,
                handlers: c.slice(i)
            }), h
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, c) {
                var d, e, f, g = c.button;
                return null == a.pageX && null != c.clientX && (d = a.target.ownerDocument || T, e = d.documentElement, f = d.body, a.pageX = c.clientX + (e && e.scrollLeft || f && f.scrollLeft || 0) - (e && e.clientLeft || f && f.clientLeft || 0), a.pageY = c.clientY + (e && e.scrollTop || f && f.scrollTop || 0) - (e && e.clientTop || f && f.clientTop || 0)), a.which || g === b || (a.which = 1 & g ? 1 : 2 & g ? 3 : 4 & g ? 2 : 0), a
            }
        },
        fix: function(a) {
            if (a[fa.expando]) return a;
            var b, c, d, e = a.type,
                f = a,
                g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = za.test(e) ? this.mouseHooks : ya.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new fa.Event(f), b = d.length; b--;) c = d[b], a[c] = f[c];
            return a.target || (a.target = T), 3 === a.target.nodeType && (a.target = a.target.parentNode), g.filter ? g.filter(a, f) : a
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    return this !== i() && this.focus ? (this.focus(), !1) : b
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === i() && this.blur ? (this.blur(), !1) : b
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return "checkbox" === this.type && this.click && fa.nodeName(this, "input") ? (this.click(), !1) : b
                },
                _default: function(a) {
                    return fa.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    a.result !== b && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = fa.extend(new fa.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? fa.event.trigger(e, null, b) : fa.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
    }, fa.removeEvent = function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    }, fa.Event = function(a, c) {
        return this instanceof fa.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.getPreventDefault && a.getPreventDefault() ? g : h) : this.type = a, c && fa.extend(this, c), this.timeStamp = a && a.timeStamp || fa.now(), this[fa.expando] = !0, b) : new fa.Event(a, c)
    }, fa.Event.prototype = {
        isDefaultPrevented: h,
        isPropagationStopped: h,
        isImmediatePropagationStopped: h,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = g, a && a.preventDefault && a.preventDefault()
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = g, a && a.stopPropagation && a.stopPropagation()
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = g, this.stopPropagation()
        }
    }, fa.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(a, b) {
        fa.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this,
                    e = a.relatedTarget,
                    f = a.handleObj;
                return (!e || e !== d && !fa.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }
        }
    }), fa.support.focusinBubbles || fa.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = 0,
            d = function(a) {
                fa.event.simulate(b, a.target, fa.event.fix(a), !0)
            };
        fa.event.special[b] = {
            setup: function() {
                0 === c++ && T.addEventListener(a, d, !0)
            },
            teardown: function() {
                0 === --c && T.removeEventListener(a, d, !0)
            }
        }
    }), fa.fn.extend({
        on: function(a, c, d, e, f) {
            var g, i;
            if ("object" == typeof a) {
                "string" != typeof c && (d = d || c, c = b);
                for (i in a) this.on(i, c, d, a[i], f);
                return this
            }
            if (null == d && null == e ? (e = c, d = c = b) : null == e && ("string" == typeof c ? (e = d, d = b) : (e = d, d = c, c = b)), e === !1) e = h;
            else if (!e) return this;
            return 1 === f && (g = e, e = function(a) {
                return fa().off(a), g.apply(this, arguments)
            }, e.guid = g.guid || (g.guid = fa.guid++)), this.each(function() {
                fa.event.add(this, a, e, d, c)
            })
        },
        one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1)
        },
        off: function(a, c, d) {
            var e, f;
            if (a && a.preventDefault && a.handleObj) return e = a.handleObj, fa(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
            if ("object" == typeof a) {
                for (f in a) this.off(f, c, a[f]);
                return this
            }
            return (c === !1 || "function" == typeof c) && (d = c, c = b), d === !1 && (d = h), this.each(function() {
                fa.event.remove(this, a, d, c)
            })
        },
        trigger: function(a, b) {
            return this.each(function() {
                fa.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, c) {
            var d = this[0];
            return d ? fa.event.trigger(a, c, d, !0) : b
        }
    });
    var Ca = /^.[^:#\[\.,]*$/,
        Da = /^(?:parents|prev(?:Until|All))/,
        Ea = fa.expr.match.needsContext,
        Fa = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    fa.fn.extend({
        find: function(a) {
            var b, c = [],
                d = this,
                e = d.length;
            if ("string" != typeof a) return this.pushStack(fa(a).filter(function() {
                for (b = 0; e > b; b++)
                    if (fa.contains(d[b], this)) return !0
            }));
            for (b = 0; e > b; b++) fa.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? fa.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
        },
        has: function(a) {
            var b = fa(a, this),
                c = b.length;
            return this.filter(function() {
                for (var a = 0; c > a; a++)
                    if (fa.contains(this, b[a])) return !0
            })
        },
        not: function(a) {
            return this.pushStack(k(this, a || [], !0))
        },
        filter: function(a) {
            return this.pushStack(k(this, a || [], !1))
        },
        is: function(a) {
            return !!k(this, "string" == typeof a && Ea.test(a) ? fa(a) : a || [], !1).length
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = Ea.test(a) || "string" != typeof a ? fa(a, b || this.context) : 0; e > d; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (11 > c.nodeType && (g ? g.index(c) > -1 : 1 === c.nodeType && fa.find.matchesSelector(c, a))) {
                        c = f.push(c);
                        break
                    } return this.pushStack(f.length > 1 ? fa.unique(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? ba.call(fa(a), this[0]) : ba.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            var c = "string" == typeof a ? fa(a, b) : fa.makeArray(a && a.nodeType ? [a] : a),
                d = fa.merge(this.get(), c);
            return this.pushStack(fa.unique(d))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    }), fa.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return fa.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return fa.dir(a, "parentNode", c)
        },
        next: function(a) {
            return j(a, "nextSibling")
        },
        prev: function(a) {
            return j(a, "previousSibling")
        },
        nextAll: function(a) {
            return fa.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return fa.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return fa.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return fa.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return fa.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return fa.sibling(a.firstChild)
        },
        contents: function(a) {
            return a.contentDocument || fa.merge([], a.childNodes)
        }
    }, function(a, b) {
        fa.fn[a] = function(c, d) {
            var e = fa.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = fa.filter(d, e)), this.length > 1 && (Fa[a] || fa.unique(e), Da.test(a) && e.reverse()), this.pushStack(e)
        }
    }), fa.extend({
        filter: function(a, b, c) {
            var d = b[0];
            return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? fa.find.matchesSelector(d, a) ? [d] : [] : fa.find.matches(a, fa.grep(b, function(a) {
                return 1 === a.nodeType
            }))
        },
        dir: function(a, c, d) {
            for (var e = [], f = d !== b;
                (a = a[c]) && 9 !== a.nodeType;)
                if (1 === a.nodeType) {
                    if (f && fa(a).is(d)) break;
                    e.push(a)
                } return e
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    });
    var Ga = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Ha = /<([\w:]+)/,
        Ia = /<|&#?\w+;/,
        Ja = /<(?:script|style|link)/i,
        Ka = /^(?:checkbox|radio)$/i,
        La = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Ma = /^$|\/(?:java|ecma)script/i,
        Na = /^true\/(.*)/,
        Oa = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Pa = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    Pa.optgroup = Pa.option, Pa.tbody = Pa.tfoot = Pa.colgroup = Pa.caption = Pa.thead, Pa.th = Pa.td, fa.fn.extend({
        text: function(a) {
            return fa.access(this, function(a) {
                return a === b ? fa.text(this) : this.empty().append((this[0] && this[0].ownerDocument || T).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = l(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = l(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        remove: function(a, b) {
            for (var c, d = a ? fa.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || fa.cleanData(q(c)), c.parentNode && (b && fa.contains(c.ownerDocument, c) && o(q(c, "script")), c.parentNode.removeChild(c));
            return this
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) 1 === a.nodeType && (fa.cleanData(q(a, !1)), a.textContent = "");
            return this
        },
        clone: function(a, b) {
            return a = null != a && a, b = null == b ? a : b, this.map(function() {
                return fa.clone(this, a, b)
            })
        },
        html: function(a) {
            return fa.access(this, function(a) {
                var c = this[0] || {},
                    d = 0,
                    e = this.length;
                if (a === b && 1 === c.nodeType) return c.innerHTML;
                if ("string" == typeof a && !Ja.test(a) && !Pa[(Ha.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(Ga, "<$1></$2>");
                    try {
                        for (; e > d; d++) c = this[d] || {}, 1 === c.nodeType && (fa.cleanData(q(c, !1)), c.innerHTML = a);
                        c = 0
                    } catch (f) {}
                }
                c && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = fa.map(this, function(a) {
                    return [a.nextSibling, a.parentNode]
                }),
                b = 0;
            return this.domManip(arguments, function(c) {
                var d = a[b++],
                    e = a[b++];
                e && (d && d.parentNode !== e && (d = this.nextSibling), fa(this).remove(), e.insertBefore(c, d))
            }, !0), b ? this : this.remove()
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, b, c) {
            a = $.apply([], a);
            var d, e, f, g, h, i, j = 0,
                k = this.length,
                l = this,
                o = k - 1,
                p = a[0],
                r = fa.isFunction(p);
            if (r || !(1 >= k || "string" != typeof p || fa.support.checkClone) && La.test(p)) return this.each(function(d) {
                var e = l.eq(d);
                r && (a[0] = p.call(this, d, e.html())), e.domManip(a, b, c)
            });
            if (k && (d = fa.buildFragment(a, this[0].ownerDocument, !1, !c && this), e = d.firstChild, 1 === d.childNodes.length && (d = e), e)) {
                for (f = fa.map(q(d, "script"), m), g = f.length; k > j; j++) h = d, j !== o && (h = fa.clone(h, !0, !0), g && fa.merge(f, q(h, "script"))), b.call(this[j], h, j);
                if (g)
                    for (i = f[f.length - 1].ownerDocument, fa.map(f, n), j = 0; g > j; j++) h = f[j], Ma.test(h.type || "") && !qa.access(h, "globalEval") && fa.contains(i, h) && (h.src ? fa._evalUrl(h.src) : fa.globalEval(h.textContent.replace(Oa, "")))
            }
            return this
        }
    }), fa.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        fa.fn[a] = function(a) {
            for (var c, d = [], e = fa(a), f = e.length - 1, g = 0; f >= g; g++) c = g === f ? this : this.clone(!0), fa(e[g])[b](c), _.apply(d, c.get());
            return this.pushStack(d)
        }
    }), fa.extend({
        clone: function(a, b, c) {
            var d, e, f, g, h = a.cloneNode(!0),
                i = fa.contains(a.ownerDocument, a);
            if (!(fa.support.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || fa.isXMLDoc(a)))
                for (g = q(h), f = q(a), d = 0, e = f.length; e > d; d++) r(f[d], g[d]);
            if (b)
                if (c)
                    for (f = f || q(a), g = g || q(h), d = 0, e = f.length; e > d; d++) p(f[d], g[d]);
                else p(a, h);
            return g = q(h, "script"), g.length > 0 && o(g, !i && q(a, "script")), h
        },
        buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, k = 0, l = a.length, m = b.createDocumentFragment(), n = []; l > k; k++)
                if (e = a[k], e || 0 === e)
                    if ("object" === fa.type(e)) fa.merge(n, e.nodeType ? [e] : e);
                    else if (Ia.test(e)) {
                for (f = f || m.appendChild(b.createElement("div")), g = (Ha.exec(e) || ["", ""])[1].toLowerCase(), h = Pa[g] || Pa._default, f.innerHTML = h[1] + e.replace(Ga, "<$1></$2>") + h[2], j = h[0]; j--;) f = f.lastChild;
                fa.merge(n, f.childNodes), f = m.firstChild, f.textContent = ""
            } else n.push(b.createTextNode(e));
            for (m.textContent = "", k = 0; e = n[k++];)
                if ((!d || -1 === fa.inArray(e, d)) && (i = fa.contains(e.ownerDocument, e), f = q(m.appendChild(e), "script"), i && o(f), c))
                    for (j = 0; e = f[j++];) Ma.test(e.type || "") && c.push(e);
            return m
        },
        cleanData: function(a) {
            for (var c, d, f, g, h, i, j = fa.event.special, k = 0;
                (d = a[k]) !== b; k++) {
                if (e.accepts(d) && (h = d[qa.expando], h && (c = qa.cache[h]))) {
                    if (f = Object.keys(c.events || {}), f.length)
                        for (i = 0;
                            (g = f[i]) !== b; i++) j[g] ? fa.event.remove(d, g) : fa.removeEvent(d, g, c.handle);
                    qa.cache[h] && delete qa.cache[h]
                }
                delete pa.cache[d[pa.expando]]
            }
        },
        _evalUrl: function(a) {
            return fa.ajax({
                url: a,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }
    }), fa.fn.extend({
        wrapAll: function(a) {
            var b;
            return fa.isFunction(a) ? this.each(function(b) {
                fa(this).wrapAll(a.call(this, b))
            }) : (this[0] && (b = fa(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                for (var a = this; a.firstElementChild;) a = a.firstElementChild;
                return a
            }).append(this)), this)
        },
        wrapInner: function(a) {
            return fa.isFunction(a) ? this.each(function(b) {
                fa(this).wrapInner(a.call(this, b))
            }) : this.each(function() {
                var b = fa(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = fa.isFunction(a);
            return this.each(function(c) {
                fa(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                fa.nodeName(this, "body") || fa(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    var Qa, Ra, Sa = /^(none|table(?!-c[ea]).+)/,
        Ta = /^margin/,
        Ua = RegExp("^(" + ga + ")(.*)$", "i"),
        Va = RegExp("^(" + ga + ")(?!px)[a-z%]+$", "i"),
        Wa = RegExp("^([+-])=(" + ga + ")", "i"),
        Xa = {
            BODY: "block"
        },
        Ya = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Za = {
            letterSpacing: 0,
            fontWeight: 400
        },
        $a = ["Top", "Right", "Bottom", "Left"],
        _a = ["Webkit", "O", "Moz", "ms"];
    fa.fn.extend({
        css: function(a, c) {
            return fa.access(this, function(a, c, d) {
                var e, f, g = {},
                    h = 0;
                if (fa.isArray(c)) {
                    for (e = u(a), f = c.length; f > h; h++) g[c[h]] = fa.css(a, c[h], !1, e);
                    return g
                }
                return d !== b ? fa.style(a, c, d) : fa.css(a, c)
            }, a, c, arguments.length > 1)
        },
        show: function() {
            return v(this, !0)
        },
        hide: function() {
            return v(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                t(this) ? fa(this).show() : fa(this).hide()
            })
        }
    }), fa.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Qa(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(a, c, d, e) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var f, g, h, i = fa.camelCase(c),
                    j = a.style;
                return c = fa.cssProps[i] || (fa.cssProps[i] = s(j, i)), h = fa.cssHooks[c] || fa.cssHooks[i], d === b ? h && "get" in h && (f = h.get(a, !1, e)) !== b ? f : j[c] : (g = typeof d, "string" === g && (f = Wa.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat(fa.css(a, c)), g = "number"), null == d || "number" === g && isNaN(d) || ("number" !== g || fa.cssNumber[i] || (d += "px"), fa.support.clearCloneStyle || "" !== d || 0 !== c.indexOf("background") || (j[c] = "inherit"), h && "set" in h && (d = h.set(a, d, e)) === b || (j[c] = d)), b)
            }
        },
        css: function(a, c, d, e) {
            var f, g, h, i = fa.camelCase(c);
            return c = fa.cssProps[i] || (fa.cssProps[i] = s(a.style, i)), h = fa.cssHooks[c] || fa.cssHooks[i], h && "get" in h && (f = h.get(a, !0, d)), f === b && (f = Qa(a, c, e)), "normal" === f && c in Za && (f = Za[c]), "" === d || d ? (g = parseFloat(f), d === !0 || fa.isNumeric(g) ? g || 0 : f) : f
        }
    }), Qa = function(a, c, d) {
        var e, f, g, h = d || u(a),
            i = h ? h.getPropertyValue(c) || h[c] : b,
            j = a.style;
        return h && ("" !== i || fa.contains(a.ownerDocument, a) || (i = fa.style(a, c)), Va.test(i) && Ta.test(c) && (e = j.width, f = j.minWidth, g = j.maxWidth, j.minWidth = j.maxWidth = j.width = i, i = h.width, j.width = e, j.minWidth = f, j.maxWidth = g)), i
    }, fa.each(["height", "width"], function(a, c) {
        fa.cssHooks[c] = {
            get: function(a, d, e) {
                return d ? 0 === a.offsetWidth && Sa.test(fa.css(a, "display")) ? fa.swap(a, Ya, function() {
                    return y(a, c, e)
                }) : y(a, c, e) : b
            },
            set: function(a, b, d) {
                var e = d && u(a);
                return w(a, b, d ? x(a, c, d, fa.support.boxSizing && "border-box" === fa.css(a, "boxSizing", !1, e), e) : 0)
            }
        }
    }), fa(function() {
        fa.support.reliableMarginRight || (fa.cssHooks.marginRight = {
            get: function(a, c) {
                return c ? fa.swap(a, {
                    display: "inline-block"
                }, Qa, [a, "marginRight"]) : b
            }
        }), !fa.support.pixelPosition && fa.fn.position && fa.each(["top", "left"], function(a, c) {
            fa.cssHooks[c] = {
                get: function(a, d) {
                    return d ? (d = Qa(a, c), Va.test(d) ? fa(a).position()[c] + "px" : d) : b
                }
            }
        })
    }), fa.expr && fa.expr.filters && (fa.expr.filters.hidden = function(a) {
        return 0 >= a.offsetWidth && 0 >= a.offsetHeight
    }, fa.expr.filters.visible = function(a) {
        return !fa.expr.filters.hidden(a)
    }), fa.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        fa.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + $a[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        }, Ta.test(a) || (fa.cssHooks[a + b].set = w)
    });
    var ab = /%20/g,
        bb = /\[\]$/,
        cb = /\r?\n/g,
        db = /^(?:submit|button|image|reset|file)$/i,
        eb = /^(?:input|select|textarea|keygen)/i;
    fa.fn.extend({
        serialize: function() {
            return fa.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = fa.prop(this, "elements");
                return a ? fa.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !fa(this).is(":disabled") && eb.test(this.nodeName) && !db.test(a) && (this.checked || !Ka.test(a))
            }).map(function(a, b) {
                var c = fa(this).val();
                return null == c ? null : fa.isArray(c) ? fa.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(cb, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(cb, "\r\n")
                }
            }).get()
        }
    }), fa.param = function(a, c) {
        var d, e = [],
            f = function(a, b) {
                b = fa.isFunction(b) ? b() : null == b ? "" : b, e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
        if (c === b && (c = fa.ajaxSettings && fa.ajaxSettings.traditional), fa.isArray(a) || a.jquery && !fa.isPlainObject(a)) fa.each(a, function() {
            f(this.name, this.value)
        });
        else
            for (d in a) B(d, a[d], c, f);
        return e.join("&").replace(ab, "+")
    }, fa.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        fa.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }), fa.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    });
    var fb, gb, hb = fa.now(),
        ib = /\?/,
        jb = /#.*$/,
        kb = /([?&])_=[^&]*/,
        lb = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        mb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        nb = /^(?:GET|HEAD)$/,
        ob = /^\/\//,
        pb = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        qb = fa.fn.load,
        rb = {},
        sb = {},
        tb = "*/".concat("*");
    try {
        gb = S.href
    } catch (ub) {
        gb = T.createElement("a"), gb.href = "", gb = gb.href
    }
    fb = pb.exec(gb.toLowerCase()) || [], fa.fn.load = function(a, c, d) {
        if ("string" != typeof a && qb) return qb.apply(this, arguments);
        var e, f, g, h = this,
            i = a.indexOf(" ");
        return i >= 0 && (e = a.slice(i), a = a.slice(0, i)), fa.isFunction(c) ? (d = c, c = b) : c && "object" == typeof c && (f = "POST"), h.length > 0 && fa.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: c
        }).done(function(a) {
            g = arguments, h.html(e ? fa("<div>").append(fa.parseHTML(a)).find(e) : a)
        }).complete(d && function(a, b) {
            h.each(d, g || [a.responseText, b, a])
        }), this
    }, fa.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
        fa.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), fa.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: gb,
            type: "GET",
            isLocal: mb.test(fb[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": tb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": fa.parseJSON,
                "text xml": fa.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? E(E(a, fa.ajaxSettings), b) : E(fa.ajaxSettings, a)
        },
        ajaxPrefilter: C(rb),
        ajaxTransport: C(sb),
        ajax: function(a, c) {
            function d(a, c, d, h) {
                var j, l, s, t, v, x = c;
                2 !== u && (u = 2, i && clearTimeout(i), e = b, g = h || "", w.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, d && (t = F(m, w, d)), t = G(m, t, w, j), j ? (m.ifModified && (v = w.getResponseHeader("Last-Modified"), v && (fa.lastModified[f] = v), v = w.getResponseHeader("etag"), v && (fa.etag[f] = v)), 204 === a || "HEAD" === m.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = t.state, l = t.data, s = t.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), w.status = a, w.statusText = (c || x) + "", j ? p.resolveWith(n, [l, x, w]) : p.rejectWith(n, [w, x, s]), w.statusCode(r), r = b, k && o.trigger(j ? "ajaxSuccess" : "ajaxError", [w, m, j ? l : s]), q.fireWith(n, [w, x]), k && (o.trigger("ajaxComplete", [w, m]), --fa.active || fa.event.trigger("ajaxStop")))
            }
            "object" == typeof a && (c = a, a = b), c = c || {};
            var e, f, g, h, i, j, k, l, m = fa.ajaxSetup({}, c),
                n = m.context || m,
                o = m.context && (n.nodeType || n.jquery) ? fa(n) : fa.event,
                p = fa.Deferred(),
                q = fa.Callbacks("once memory"),
                r = m.statusCode || {},
                s = {},
                t = {},
                u = 0,
                v = "canceled",
                w = {
                    readyState: 0,
                    getResponseHeader: function(a) {
                        var b;
                        if (2 === u) {
                            if (!h)
                                for (h = {}; b = lb.exec(g);) h[b[1].toLowerCase()] = b[2];
                            b = h[a.toLowerCase()]
                        }
                        return null == b ? null : b
                    },
                    getAllResponseHeaders: function() {
                        return 2 === u ? g : null
                    },
                    setRequestHeader: function(a, b) {
                        var c = a.toLowerCase();
                        return u || (a = t[c] = t[c] || a, s[a] = b), this
                    },
                    overrideMimeType: function(a) {
                        return u || (m.mimeType = a), this
                    },
                    statusCode: function(a) {
                        var b;
                        if (a)
                            if (2 > u)
                                for (b in a) r[b] = [r[b], a[b]];
                            else w.always(a[w.status]);
                        return this
                    },
                    abort: function(a) {
                        var b = a || v;
                        return e && e.abort(b), d(0, b), this
                    }
                };
            if (p.promise(w).complete = q.add, w.success = w.done, w.error = w.fail, m.url = ((a || m.url || gb) + "").replace(jb, "").replace(ob, fb[1] + "//"), m.type = c.method || c.type || m.method || m.type, m.dataTypes = fa.trim(m.dataType || "*").toLowerCase().match(ha) || [""], null == m.crossDomain && (j = pb.exec(m.url.toLowerCase()), m.crossDomain = !(!j || j[1] === fb[1] && j[2] === fb[2] && (j[3] || ("http:" === j[1] ? "80" : "443")) === (fb[3] || ("http:" === fb[1] ? "80" : "443")))), m.data && m.processData && "string" != typeof m.data && (m.data = fa.param(m.data, m.traditional)), D(rb, m, c, w), 2 === u) return w;
            k = m.global, k && 0 === fa.active++ && fa.event.trigger("ajaxStart"), m.type = m.type.toUpperCase(), m.hasContent = !nb.test(m.type), f = m.url, m.hasContent || (m.data && (f = m.url += (ib.test(f) ? "&" : "?") + m.data, delete m.data), m.cache === !1 && (m.url = kb.test(f) ? f.replace(kb, "$1_=" + hb++) : f + (ib.test(f) ? "&" : "?") + "_=" + hb++)), m.ifModified && (fa.lastModified[f] && w.setRequestHeader("If-Modified-Since", fa.lastModified[f]), fa.etag[f] && w.setRequestHeader("If-None-Match", fa.etag[f])), (m.data && m.hasContent && m.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", m.contentType), w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + tb + "; q=0.01" : "") : m.accepts["*"]);
            for (l in m.headers) w.setRequestHeader(l, m.headers[l]);
            if (m.beforeSend && (m.beforeSend.call(n, w, m) === !1 || 2 === u)) return w.abort();
            v = "abort";
            for (l in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) w[l](m[l]);
            if (e = D(sb, m, c, w)) {
                w.readyState = 1, k && o.trigger("ajaxSend", [w, m]), m.async && m.timeout > 0 && (i = setTimeout(function() {
                    w.abort("timeout")
                }, m.timeout));
                try {
                    u = 1, e.send(s, d)
                } catch (x) {
                    if (!(2 > u)) throw x;
                    d(-1, x)
                }
            } else d(-1, "No Transport");
            return w
        },
        getJSON: function(a, b, c) {
            return fa.get(a, b, c, "json")
        },
        getScript: function(a, c) {
            return fa.get(a, b, c, "script")
        }
    }), fa.each(["get", "post"], function(a, c) {
        fa[c] = function(a, d, e, f) {
            return fa.isFunction(d) && (f = f || e, e = d, d = b), fa.ajax({
                url: a,
                type: c,
                dataType: f,
                data: d,
                success: e
            })
        }
    }), fa.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return fa.globalEval(a), a
            }
        }
    }), fa.ajaxPrefilter("script", function(a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET")
    }), fa.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c;
            return {
                send: function(d, e) {
                    b = fa("<script>").prop({
                        async: !0,
                        charset: a.scriptCharset,
                        src: a.url
                    }).on("load error", c = function(a) {
                        b.remove(), c = null, a && e("error" === a.type ? 404 : 200, a.type)
                    }), T.head.appendChild(b[0])
                },
                abort: function() {
                    c && c()
                }
            }
        }
    });
    var vb = [],
        wb = /(=)\?(?=&|$)|\?\?/;
    fa.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = vb.pop() || fa.expando + "_" + hb++;
            return this[a] = !0, a
        }
    }), fa.ajaxPrefilter("json jsonp", function(c, d, e) {
        var f, g, h, i = c.jsonp !== !1 && (wb.test(c.url) ? "url" : "string" == typeof c.data && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && wb.test(c.data) && "data");
        return i || "jsonp" === c.dataTypes[0] ? (f = c.jsonpCallback = fa.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, i ? c[i] = c[i].replace(wb, "$1" + f) : c.jsonp !== !1 && (c.url += (ib.test(c.url) ? "&" : "?") + c.jsonp + "=" + f), c.converters["script json"] = function() {
            return h || fa.error(f + " was not called"), h[0]
        }, c.dataTypes[0] = "json", g = a[f], a[f] = function() {
            h = arguments
        }, e.always(function() {
            a[f] = g, c[f] && (c.jsonpCallback = d.jsonpCallback, vb.push(f)), h && fa.isFunction(g) && g(h[0]), h = g = b
        }), "script") : b
    }), fa.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest
        } catch (a) {}
    };
    var xb = fa.ajaxSettings.xhr(),
        yb = {
            0: 200,
            1223: 204
        },
        zb = 0,
        Ab = {};
    a.ActiveXObject && fa(a).on("unload", function() {
        for (var a in Ab) Ab[a]();
        Ab = b
    }), fa.support.cors = !!xb && "withCredentials" in xb, fa.support.ajax = xb = !!xb, fa.ajaxTransport(function(a) {
        var c;
        return fa.support.cors || xb && !a.crossDomain ? {
            send: function(d, e) {
                var f, g, h = a.xhr();
                if (h.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                    for (f in a.xhrFields) h[f] = a.xhrFields[f];
                a.mimeType && h.overrideMimeType && h.overrideMimeType(a.mimeType), a.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
                for (f in d) h.setRequestHeader(f, d[f]);
                c = function(a) {
                    return function() {
                        c && (delete Ab[g], c = h.onload = h.onerror = null, "abort" === a ? h.abort() : "error" === a ? e(h.status || 404, h.statusText) : e(yb[h.status] || h.status, h.statusText, "string" == typeof h.responseText ? {
                            text: h.responseText
                        } : b, h.getAllResponseHeaders()))
                    }
                }, h.onload = c(), h.onerror = c("error"), c = Ab[g = zb++] = c("abort"), h.send(a.hasContent && a.data || null)
            },
            abort: function() {
                c && c()
            }
        } : b
    });
    var Bb, Cb, Db = /^(?:toggle|show|hide)$/,
        Eb = RegExp("^(?:([+-])=|)(" + ga + ")([a-z%]*)$", "i"),
        Fb = /queueHooks$/,
        Gb = [L],
        Hb = {
            "*": [function(a, b) {
                var c = this.createTween(a, b),
                    d = c.cur(),
                    e = Eb.exec(b),
                    f = e && e[3] || (fa.cssNumber[a] ? "" : "px"),
                    g = (fa.cssNumber[a] || "px" !== f && +d) && Eb.exec(fa.css(c.elem, a)),
                    h = 1,
                    i = 20;
                if (g && g[3] !== f) {
                    f = f || g[3], e = e || [], g = +d || 1;
                    do h = h || ".5", g /= h, fa.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
                }
                return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
            }]
        };
    fa.Animation = fa.extend(J, {
        tweener: function(a, b) {
            fa.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++) c = a[d], Hb[c] = Hb[c] || [], Hb[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? Gb.unshift(a) : Gb.push(a)
        }
    }), fa.Tween = M, M.prototype = {
        constructor: M,
        init: function(a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (fa.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = M.propHooks[this.prop];
            return a && a.get ? a.get(this) : M.propHooks._default.get(this)
        },
        run: function(a) {
            var b, c = M.propHooks[this.prop];
            return this.pos = b = this.options.duration ? fa.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : M.propHooks._default.set(this), this
        }
    }, M.prototype.init.prototype = M.prototype, M.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = fa.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
            },
            set: function(a) {
                fa.fx.step[a.prop] ? fa.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[fa.cssProps[a.prop]] || fa.cssHooks[a.prop]) ? fa.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    }, M.propHooks.scrollTop = M.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    }, fa.each(["toggle", "show", "hide"], function(a, b) {
        var c = fa.fn[b];
        fa.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(N(b, !0), a, d, e)
        }
    }), fa.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(t).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = fa.isEmptyObject(a),
                f = fa.speed(b, c, d),
                g = function() {
                    var b = J(this, fa.extend({}, a), f);
                    (e || qa.get(this, "finish")) && b.stop(!0)
                };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, c, d) {
            var e = function(a) {
                var b = a.stop;
                delete a.stop, b(d)
            };
            return "string" != typeof a && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                var b = !0,
                    c = null != a && a + "queueHooks",
                    f = fa.timers,
                    g = qa.get(this);
                if (c) g[c] && g[c].stop && e(g[c]);
                else
                    for (c in g) g[c] && g[c].stop && Fb.test(c) && e(g[c]);
                for (c = f.length; c--;) f[c].elem !== this || null != a && f[c].queue !== a || (f[c].anim.stop(d), b = !1, f.splice(c, 1));
                (b || !d) && fa.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"), this.each(function() {
                var b, c = qa.get(this),
                    d = c[a + "queue"],
                    e = c[a + "queueHooks"],
                    f = fa.timers,
                    g = d ? d.length : 0;
                for (c.finish = !0, fa.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }), fa.each({
        slideDown: N("show"),
        slideUp: N("hide"),
        slideToggle: N("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        fa.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), fa.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? fa.extend({}, a) : {
            complete: c || !c && b || fa.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !fa.isFunction(b) && b
        };
        return d.duration = fa.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in fa.fx.speeds ? fa.fx.speeds[d.duration] : fa.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
            fa.isFunction(d.old) && d.old.call(this), d.queue && fa.dequeue(this, d.queue)
        }, d
    }, fa.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    }, fa.timers = [], fa.fx = M.prototype.init, fa.fx.tick = function() {
        var a, c = fa.timers,
            d = 0;
        for (Bb = fa.now(); c.length > d; d++) a = c[d], a() || c[d] !== a || c.splice(d--, 1);
        c.length || fa.fx.stop(), Bb = b
    }, fa.fx.timer = function(a) {
        a() && fa.timers.push(a) && fa.fx.start()
    }, fa.fx.interval = 13, fa.fx.start = function() {
        Cb || (Cb = setInterval(fa.fx.tick, fa.fx.interval))
    }, fa.fx.stop = function() {
        clearInterval(Cb), Cb = null
    }, fa.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, fa.fx.step = {}, fa.expr && fa.expr.filters && (fa.expr.filters.animated = function(a) {
        return fa.grep(fa.timers, function(b) {
            return a === b.elem
        }).length
    }), fa.fn.offset = function(a) {
        if (arguments.length) return a === b ? this : this.each(function(b) {
            fa.offset.setOffset(this, a, b)
        });
        var c, d, e = this[0],
            f = {
                top: 0,
                left: 0
            },
            g = e && e.ownerDocument;
        return g ? (c = g.documentElement, fa.contains(c, e) ? (typeof e.getBoundingClientRect !== R && (f = e.getBoundingClientRect()), d = O(g), {
            top: f.top + d.pageYOffset - c.clientTop,
            left: f.left + d.pageXOffset - c.clientLeft
        }) : f) : void 0
    }, fa.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = fa.css(a, "position"),
                l = fa(a),
                m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = fa.css(a, "top"), i = fa.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), fa.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
        }
    }, fa.fn.extend({
        position: function() {
            if (this[0]) {
                var a, b, c = this[0],
                    d = {
                        top: 0,
                        left: 0
                    };
                return "fixed" === fa.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), fa.nodeName(a[0], "html") || (d = a.offset()), d.top += fa.css(a[0], "borderTopWidth", !0), d.left += fa.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - d.top - fa.css(c, "marginTop", !0),
                    left: b.left - d.left - fa.css(c, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || U; a && !fa.nodeName(a, "html") && "static" === fa.css(a, "position");) a = a.offsetParent;
                return a || U
            })
        }
    }), fa.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(c, d) {
        var e = "pageYOffset" === d;
        fa.fn[c] = function(f) {
            return fa.access(this, function(c, f, g) {
                var h = O(c);
                return g === b ? h ? h[d] : c[f] : (h ? h.scrollTo(e ? a.pageXOffset : g, e ? g : a.pageYOffset) : c[f] = g, b)
            }, c, f, arguments.length, null)
        }
    }), fa.each({
        Height: "height",
        Width: "width"
    }, function(a, c) {
        fa.each({
            padding: "inner" + a,
            content: c,
            "": "outer" + a
        }, function(d, e) {
            fa.fn[e] = function(e, f) {
                var g = arguments.length && (d || "boolean" != typeof e),
                    h = d || (e === !0 || f === !0 ? "margin" : "border");
                return fa.access(this, function(c, d, e) {
                    var f;
                    return fa.isWindow(c) ? c.document.documentElement["client" + a] : 9 === c.nodeType ? (f = c.documentElement, Math.max(c.body["scroll" + a], f["scroll" + a], c.body["offset" + a], f["offset" + a], f["client" + a])) : e === b ? fa.css(c, d, h) : fa.style(c, d, e, h)
                }, c, g ? e : b, g, null)
            }
        })
    }), fa.fn.size = function() {
        return this.length
    }, fa.fn.andSelf = fa.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = fa : "function" == typeof define && define.amd && define("jquery", [], function() {
        return fa
    }), "object" == typeof a && "object" == typeof a.document && (a.jQuery = a.$ = fa)
}(window),
function(a) {
    "use strict";

    function b(a) {
        return function() {
            var b, c = arguments[0];
            for (b = "[" + (a ? a + ":" : "") + c + "] http://errors.angularjs.org/1.5.9/" + (a ? a + "/" : "") + c, c = 1; c < arguments.length; c++) {
                b = b + (1 == c ? "?" : "&") + "p" + (c - 1) + "=";
                var d, e = encodeURIComponent;
                d = arguments[c], d = "function" == typeof d ? d.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof d ? "undefined" : "string" != typeof d ? JSON.stringify(d) : d, b += e(d)
            }
            return Error(b)
        }
    }

    function c(a) {
        if (null == a || z(a)) return !1;
        if (jd(a) || u(a) || Vc && a instanceof Vc) return !0;
        var b = "length" in Object(a) && a.length;
        return v(b) && (0 <= b && (b - 1 in a || a instanceof Array) || "function" == typeof a.item)
    }

    function d(a, b, e) {
        var f, g;
        if (a)
            if (x(a))
                for (f in a) "prototype" === f || "length" === f || "name" === f || a.hasOwnProperty && !a.hasOwnProperty(f) || b.call(e, a[f], f, a);
            else if (jd(a) || c(a)) {
            var h = "object" != typeof a;
            for (f = 0, g = a.length; f < g; f++)(h || f in a) && b.call(e, a[f], f, a)
        } else if (a.forEach && a.forEach !== d) a.forEach(b, e, a);
        else if (t(a))
            for (f in a) b.call(e, a[f], f, a);
        else if ("function" == typeof a.hasOwnProperty)
            for (f in a) a.hasOwnProperty(f) && b.call(e, a[f], f, a);
        else
            for (f in a) Zc.call(a, f) && b.call(e, a[f], f, a);
        return a
    }

    function e(a, b, c) {
        for (var d = Object.keys(a).sort(), e = 0; e < d.length; e++) b.call(c, a[d[e]], d[e]);
        return d
    }

    function f(a) {
        return function(b, c) {
            a(c, b)
        }
    }

    function g() {
        return ++hd
    }

    function h(a, b, c) {
        for (var d = a.$$hashKey, e = 0, f = b.length; e < f; ++e) {
            var g = b[e];
            if (s(g) || x(g))
                for (var i = Object.keys(g), j = 0, k = i.length; j < k; j++) {
                    var l = i[j],
                        m = g[l];
                    c && s(m) ? w(m) ? a[l] = new Date(m.valueOf()) : y(m) ? a[l] = new RegExp(m) : m.nodeName ? a[l] = m.cloneNode(!0) : D(m) ? a[l] = m.clone() : (s(a[l]) || (a[l] = jd(m) ? [] : {}), h(a[l], [m], !0)) : a[l] = m
                }
        }
        return d ? a.$$hashKey = d : delete a.$$hashKey, a
    }

    function i(a) {
        return h(a, ad.call(arguments, 1), !1)
    }

    function j(a) {
        return h(a, ad.call(arguments, 1), !0)
    }

    function k(a) {
        return parseInt(a, 10)
    }

    function l(a, b) {
        return i(Object.create(a), b)
    }

    function m() {}

    function n(a) {
        return a
    }

    function o(a) {
        return function() {
            return a
        }
    }

    function p(a) {
        return x(a.toString) && a.toString !== dd
    }

    function q(a) {
        return "undefined" == typeof a
    }

    function r(a) {
        return "undefined" != typeof a
    }

    function s(a) {
        return null !== a && "object" == typeof a
    }

    function t(a) {
        return null !== a && "object" == typeof a && !ed(a)
    }

    function u(a) {
        return "string" == typeof a
    }

    function v(a) {
        return "number" == typeof a
    }

    function w(a) {
        return "[object Date]" === dd.call(a)
    }

    function x(a) {
        return "function" == typeof a
    }

    function y(a) {
        return "[object RegExp]" === dd.call(a)
    }

    function z(a) {
        return a && a.window === a
    }

    function A(a) {
        return a && a.$evalAsync && a.$watch
    }

    function B(a) {
        return "boolean" == typeof a
    }

    function C(a) {
        return a && v(a.length) && kd.test(dd.call(a))
    }

    function D(a) {
        return !(!a || !(a.nodeName || a.prop && a.attr && a.find))
    }

    function E(a) {
        var b = {};
        a = a.split(",");
        var c;
        for (c = 0; c < a.length; c++) b[a[c]] = !0;
        return b
    }

    function F(a) {
        return $c(a.nodeName || a[0] && a[0].nodeName)
    }

    function G(a, b) {
        var c = a.indexOf(b);
        return 0 <= c && a.splice(c, 1), c
    }

    function H(a, b) {
        function c(a, b) {
            var c, d = b.$$hashKey;
            if (jd(a)) {
                c = 0;
                for (var f = a.length; c < f; c++) b.push(e(a[c]))
            } else if (t(a))
                for (c in a) b[c] = e(a[c]);
            else if (a && "function" == typeof a.hasOwnProperty)
                for (c in a) a.hasOwnProperty(c) && (b[c] = e(a[c]));
            else
                for (c in a) Zc.call(a, c) && (b[c] = e(a[c]));
            return d ? b.$$hashKey = d : delete b.$$hashKey, b
        }

        function e(a) {
            if (!s(a)) return a;
            var b = g.indexOf(a);
            if (-1 !== b) return h[b];
            if (z(a) || A(a)) throw fd("cpws");
            var b = !1,
                d = f(a);
            return void 0 === d && (d = jd(a) ? [] : Object.create(ed(a)), b = !0), g.push(a), h.push(d), b ? c(a, d) : d
        }

        function f(a) {
            switch (dd.call(a)) {
                case "[object Int8Array]":
                case "[object Int16Array]":
                case "[object Int32Array]":
                case "[object Float32Array]":
                case "[object Float64Array]":
                case "[object Uint8Array]":
                case "[object Uint8ClampedArray]":
                case "[object Uint16Array]":
                case "[object Uint32Array]":
                    return new a.constructor(e(a.buffer), a.byteOffset, a.length);
                case "[object ArrayBuffer]":
                    if (!a.slice) {
                        var b = new ArrayBuffer(a.byteLength);
                        return new Uint8Array(b).set(new Uint8Array(a)), b
                    }
                    return a.slice(0);
                case "[object Boolean]":
                case "[object Number]":
                case "[object String]":
                case "[object Date]":
                    return new a.constructor(a.valueOf());
                case "[object RegExp]":
                    return b = new RegExp(a.source, a.toString().match(/[^\/]*$/)[0]), b.lastIndex = a.lastIndex, b;
                case "[object Blob]":
                    return new a.constructor([a], {
                        type: a.type
                    })
            }
            if (x(a.cloneNode)) return a.cloneNode(!0)
        }
        var g = [],
            h = [];
        if (b) {
            if (C(b) || "[object ArrayBuffer]" === dd.call(b)) throw fd("cpta");
            if (a === b) throw fd("cpi");
            return jd(b) ? b.length = 0 : d(b, function(a, c) {
                "$$hashKey" !== c && delete b[c]
            }), g.push(a), h.push(b), c(a, b)
        }
        return e(a)
    }

    function I(a, b) {
        if (a === b) return !0;
        if (null === a || null === b) return !1;
        if (a !== a && b !== b) return !0;
        var c, d = typeof a;
        if (d === typeof b && "object" === d) {
            if (!jd(a)) {
                if (w(a)) return !!w(b) && I(a.getTime(), b.getTime());
                if (y(a)) return !!y(b) && a.toString() === b.toString();
                if (A(a) || A(b) || z(a) || z(b) || jd(b) || w(b) || y(b)) return !1;
                d = ga();
                for (c in a)
                    if ("$" !== c.charAt(0) && !x(a[c])) {
                        if (!I(a[c], b[c])) return !1;
                        d[c] = !0
                    } for (c in b)
                    if (!(c in d) && "$" !== c.charAt(0) && r(b[c]) && !x(b[c])) return !1;
                return !0
            }
            if (!jd(b)) return !1;
            if ((d = a.length) === b.length) {
                for (c = 0; c < d; c++)
                    if (!I(a[c], b[c])) return !1;
                return !0
            }
        }
        return !1
    }

    function J(a, b, c) {
        return a.concat(ad.call(b, c))
    }

    function K(a, b) {
        var c = 2 < arguments.length ? ad.call(arguments, 2) : [];
        return !x(b) || b instanceof RegExp ? b : c.length ? function() {
            return arguments.length ? b.apply(a, J(c, arguments, 0)) : b.apply(a, c)
        } : function() {
            return arguments.length ? b.apply(a, arguments) : b.call(a)
        }
    }

    function L(b, c) {
        var d = c;
        return "string" == typeof b && "$" === b.charAt(0) && "$" === b.charAt(1) ? d = void 0 : z(c) ? d = "$WINDOW" : c && a.document === c ? d = "$DOCUMENT" : A(c) && (d = "$SCOPE"), d
    }

    function M(a, b) {
        if (!q(a)) return v(b) || (b = b ? 2 : null), JSON.stringify(a, L, b)
    }

    function N(a) {
        return u(a) ? JSON.parse(a) : a
    }

    function O(a, b) {
        a = a.replace(pd, "");
        var c = Date.parse("Jan 01, 1970 00:00:00 " + a) / 6e4;
        return id(c) ? b : c
    }

    function P(a, b, c) {
        c = c ? -1 : 1;
        var d = a.getTimezoneOffset();
        return b = O(b, d), c *= b - d, a = new Date(a.getTime()), a.setMinutes(a.getMinutes() + c), a
    }

    function Q(a) {
        a = Vc(a).clone();
        try {
            a.empty()
        } catch (b) {}
        var c = Vc("<div>").append(a).html();
        try {
            return a[0].nodeType === ud ? $c(c) : c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(a, b) {
                return "<" + $c(b)
            })
        } catch (d) {
            return $c(c)
        }
    }

    function R(a) {
        try {
            return decodeURIComponent(a)
        } catch (b) {}
    }

    function S(a) {
        var b = {};
        return d((a || "").split("&"), function(a) {
            var c, d, e;
            a && (d = a = a.replace(/\+/g, "%20"), c = a.indexOf("="), -1 !== c && (d = a.substring(0, c), e = a.substring(c + 1)), d = R(d), r(d) && (e = !r(e) || R(e), Zc.call(b, d) ? jd(b[d]) ? b[d].push(e) : b[d] = [b[d], e] : b[d] = e))
        }), b
    }

    function T(a) {
        var b = [];
        return d(a, function(a, c) {
            jd(a) ? d(a, function(a) {
                b.push(V(c, !0) + (!0 === a ? "" : "=" + V(a, !0)))
            }) : b.push(V(c, !0) + (!0 === a ? "" : "=" + V(a, !0)))
        }), b.length ? b.join("&") : ""
    }

    function U(a) {
        return V(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
    }

    function V(a, b) {
        return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, b ? "%20" : "+")
    }

    function W(a, b) {
        var c, d, e = qd.length;
        for (d = 0; d < e; ++d)
            if (c = qd[d] + b, u(c = a.getAttribute(c))) return c;
        return null
    }

    function X(b, c) {
        var e, f, g = {};
        d(qd, function(a) {
            a += "app", !e && b.hasAttribute && b.hasAttribute(a) && (e = b, f = b.getAttribute(a))
        }), d(qd, function(a) {
            a += "app";
            var c;
            !e && (c = b.querySelector("[" + a.replace(":", "\\:") + "]")) && (e = c, f = c.getAttribute(a))
        }), e && (rd ? (g.strictDi = null !== W(e, "strict-di"), c(e, f ? [f] : [], g)) : a.console.error("Angular: disabling automatic bootstrap. <script> protocol indicates an extension, document.location.href does not match."))
    }

    function Y(b, c, e) {
        s(e) || (e = {}), e = i({
            strictDi: !1
        }, e);
        var f = function() {
                if (b = Vc(b), b.injector()) {
                    var d = b[0] === a.document ? "document" : Q(b);
                    throw fd("btstrpd", d.replace(/</, "&lt;").replace(/>/, "&gt;"))
                }
                return c = c || [], c.unshift(["$provide", function(a) {
                    a.value("$rootElement", b)
                }]), e.debugInfoEnabled && c.push(["$compileProvider", function(a) {
                    a.debugInfoEnabled(!0)
                }]), c.unshift("ng"), d = Na(c, e.strictDi), d.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function(a, b, c, d) {
                    a.$apply(function() {
                        b.data("$injector", d), c(b)(a)
                    })
                }]), d
            },
            g = /^NG_ENABLE_DEBUG_INFO!/,
            h = /^NG_DEFER_BOOTSTRAP!/;
        return a && g.test(a.name) && (e.debugInfoEnabled = !0, a.name = a.name.replace(g, "")), a && !h.test(a.name) ? f() : (a.name = a.name.replace(h, ""), gd.resumeBootstrap = function(a) {
            return d(a, function(a) {
                c.push(a)
            }), f()
        }, void(x(gd.resumeDeferredBootstrap) && gd.resumeDeferredBootstrap()))
    }

    function Z() {
        a.name = "NG_ENABLE_DEBUG_INFO!" + a.name, a.location.reload()
    }

    function $(a) {
        if (a = gd.element(a).injector(), !a) throw fd("test");
        return a.get("$$testability")
    }

    function _(a, b) {
        return b = b || "_", a.replace(sd, function(a, c) {
            return (c ? b : "") + a.toLowerCase()
        })
    }

    function aa() {
        var b;
        if (!td) {
            var c = od();
            (Wc = q(c) ? a.jQuery : c ? a[c] : void 0) && Wc.fn.on ? (Vc = Wc, i(Wc.fn, {
                scope: Id.scope,
                isolateScope: Id.isolateScope,
                controller: Id.controller,
                injector: Id.injector,
                inheritedData: Id.inheritedData
            }), b = Wc.cleanData, Wc.cleanData = function(a) {
                for (var c, d, e = 0; null != (d = a[e]); e++)(c = Wc._data(d, "events")) && c.$destroy && Wc(d).triggerHandler("$destroy");
                b(a)
            }) : Vc = oa, gd.element = Vc, td = !0
        }
    }

    function ba(a, b, c) {
        if (!a) throw fd("areq", b || "?", c || "required");
        return a
    }

    function ca(a, b, c) {
        return c && jd(a) && (a = a[a.length - 1]), ba(x(a), b, "not a function, got " + (a && "object" == typeof a ? a.constructor.name || "Object" : typeof a)), a
    }

    function da(a, b) {
        if ("hasOwnProperty" === a) throw fd("badname", b)
    }

    function ea(a, b, c) {
        if (!b) return a;
        b = b.split(".");
        for (var d, e = a, f = b.length, g = 0; g < f; g++) d = b[g], a && (a = (e = a)[d]);
        return !c && x(a) ? K(e, a) : a
    }

    function fa(a) {
        for (var b, c = a[0], d = a[a.length - 1], e = 1; c !== d && (c = c.nextSibling); e++)(b || a[e] !== c) && (b || (b = Vc(ad.call(a, 0, e))), b.push(c));
        return b || a
    }

    function ga() {
        return Object.create(null)
    }

    function ha(a) {
        function c(a, b, c) {
            return a[b] || (a[b] = c())
        }
        var d = b("$injector"),
            e = b("ng");
        return a = c(a, "angular", Object), a.$$minErr = a.$$minErr || b, c(a, "module", function() {
            var a = {};
            return function(b, f, g) {
                if ("hasOwnProperty" === b) throw e("badname", "module");
                return f && a.hasOwnProperty(b) && (a[b] = null), c(a, b, function() {
                    function a(a, b, c, d) {
                        return d || (d = e),
                            function() {
                                return d[c || "push"]([a, b, arguments]), k
                            }
                    }

                    function c(a, c) {
                        return function(d, f) {
                            return f && x(f) && (f.$$moduleName = b), e.push([a, c, arguments]), k
                        }
                    }
                    if (!f) throw d("nomod", b);
                    var e = [],
                        h = [],
                        i = [],
                        j = a("$injector", "invoke", "push", h),
                        k = {
                            _invokeQueue: e,
                            _configBlocks: h,
                            _runBlocks: i,
                            requires: f,
                            name: b,
                            provider: c("$provide", "provider"),
                            factory: c("$provide", "factory"),
                            service: c("$provide", "service"),
                            value: a("$provide", "value"),
                            constant: a("$provide", "constant", "unshift"),
                            decorator: c("$provide", "decorator"),
                            animation: c("$animateProvider", "register"),
                            filter: c("$filterProvider", "register"),
                            controller: c("$controllerProvider", "register"),
                            directive: c("$compileProvider", "directive"),
                            component: c("$compileProvider", "component"),
                            config: j,
                            run: function(a) {
                                return i.push(a), this
                            }
                        };
                    return g && j(g), k
                })
            }
        })
    }

    function ia(a, b) {
        if (jd(a)) {
            b = b || [];
            for (var c = 0, d = a.length; c < d; c++) b[c] = a[c]
        } else if (s(a))
            for (c in b = b || {}, a) "$" === c.charAt(0) && "$" === c.charAt(1) || (b[c] = a[c]);
        return b || a
    }

    function ja(c) {
        i(c, {
            bootstrap: Y,
            copy: H,
            extend: i,
            merge: j,
            equals: I,
            element: Vc,
            forEach: d,
            injector: Na,
            noop: m,
            bind: K,
            toJson: M,
            fromJson: N,
            identity: n,
            isUndefined: q,
            isDefined: r,
            isString: u,
            isFunction: x,
            isObject: s,
            isNumber: v,
            isElement: D,
            isArray: jd,
            version: vd,
            isDate: w,
            lowercase: $c,
            uppercase: _c,
            callbacks: {
                $$counter: 0
            },
            getTestability: $,
            $$minErr: b,
            $$csp: nd,
            reloadWithDebugInfo: Z
        }), (Xc = ha(a))("ng", ["ngLocale"], ["$provide", function(a) {
            a.provider({
                $$sanitizeUri: Zb
            }), a.provider("$compile", Wa).directive({
                a: _e,
                input: rf,
                textarea: rf,
                form: df,
                script: gg,
                select: jg,
                option: kg,
                ngBind: uf,
                ngBindHtml: wf,
                ngBindTemplate: vf,
                ngClass: yf,
                ngClassEven: Af,
                ngClassOdd: zf,
                ngCloak: Bf,
                ngController: Cf,
                ngForm: ef,
                ngHide: _f,
                ngIf: Ff,
                ngInclude: Gf,
                ngInit: If,
                ngNonBindable: Uf,
                ngPluralize: Yf,
                ngRepeat: Zf,
                ngShow: $f,
                ngStyle: ag,
                ngSwitch: bg,
                ngSwitchWhen: cg,
                ngSwitchDefault: dg,
                ngOptions: Xf,
                ngTransclude: fg,
                ngModel: Rf,
                ngList: Jf,
                ngChange: xf,
                pattern: mg,
                ngPattern: mg,
                required: lg,
                ngRequired: lg,
                minlength: og,
                ngMinlength: og,
                maxlength: ng,
                ngMaxlength: ng,
                ngValue: tf,
                ngModelOptions: Tf
            }).directive({
                ngInclude: Hf
            }).directive(af).directive(Df), a.provider({
                $anchorScroll: Oa,
                $animate: Wd,
                $animateCss: Zd,
                $$animateJs: Ud,
                $$animateQueue: Vd,
                $$AnimateRunner: Yd,
                $$animateAsyncRun: Xd,
                $browser: Ta,
                $cacheFactory: Ua,
                $controller: ab,
                $document: bb,
                $exceptionHandler: cb,
                $filter: lc,
                $$forceReflow: de,
                $interpolate: ob,
                $interval: pb,
                $http: kb,
                $httpParamSerializer: eb,
                $httpParamSerializerJQLike: fb,
                $httpBackend: mb,
                $xhrFactory: lb,
                $jsonpCallbacks: me,
                $location: Bb,
                $log: Cb,
                $parse: Tb,
                $rootScope: Yb,
                $q: Ub,
                $$q: Vb,
                $sce: bc,
                $sceDelegate: ac,
                $sniffer: cc,
                $templateCache: Va,
                $templateRequest: dc,
                $$testability: ec,
                $timeout: fc,
                $window: ic,
                $$rAF: Xb,
                $$jqLite: Ia,
                $$HashMap: Md,
                $$cookieReader: kc
            })
        }])
    }

    function ka(a) {
        return a.replace(yd, function(a, b, c, d) {
            return d ? c.toUpperCase() : c
        }).replace(zd, "Moz$1")
    }

    function la(a) {
        return a = a.nodeType, 1 === a || !a || 9 === a
    }

    function ma(a, b) {
        var c, e, f = b.createDocumentFragment(),
            g = [];
        if (Dd.test(a)) {
            for (c = f.appendChild(b.createElement("div")), e = (Ed.exec(a) || ["", ""])[1].toLowerCase(), e = Gd[e] || Gd._default, c.innerHTML = e[1] + a.replace(Fd, "<$1></$2>") + e[2], e = e[0]; e--;) c = c.lastChild;
            g = J(g, c.childNodes), c = f.firstChild, c.textContent = ""
        } else g.push(b.createTextNode(a));
        return f.textContent = "", f.innerHTML = "", d(g, function(a) {
            f.appendChild(a)
        }), f
    }

    function na(a, b) {
        var c = a.parentNode;
        c && c.replaceChild(b, a), b.appendChild(a)
    }

    function oa(b) {
        if (b instanceof oa) return b;
        var c;
        if (u(b) && (b = ld(b), c = !0), !(this instanceof oa)) {
            if (c && "<" !== b.charAt(0)) throw Bd("nosel");
            return new oa(b)
        }
        if (c) {
            c = a.document;
            var d;
            b = (d = Cd.exec(b)) ? [c.createElement(d[1])] : (d = ma(b, c)) ? d.childNodes : []
        }
        ya(this, b)
    }

    function pa(a) {
        return a.cloneNode(!0)
    }

    function qa(a, b) {
        if (b || sa(a), a.querySelectorAll)
            for (var c = a.querySelectorAll("*"), d = 0, e = c.length; d < e; d++) sa(c[d])
    }

    function ra(a, b, c, e) {
        if (r(e)) throw Bd("offargs");
        var f = (e = ta(a)) && e.events,
            g = e && e.handle;
        if (g)
            if (b) {
                var h = function(b) {
                    var d = f[b];
                    r(c) && G(d || [], c), r(c) && d && 0 < d.length || (a.removeEventListener(b, g, !1), delete f[b])
                };
                d(b.split(" "), function(a) {
                    h(a), Ad[a] && h(Ad[a])
                })
            } else
                for (b in f) "$destroy" !== b && a.removeEventListener(b, g, !1), delete f[b]
    }

    function sa(a, b) {
        var c = a.ng339,
            d = c && wd[c];
        d && (b ? delete d.data[b] : (d.handle && (d.events.$destroy && d.handle({}, "$destroy"), ra(a)), delete wd[c], a.ng339 = void 0))
    }

    function ta(a, b) {
        var c = a.ng339,
            c = c && wd[c];
        return b && !c && (a.ng339 = c = ++xd, c = wd[c] = {
            events: {},
            data: {},
            handle: void 0
        }), c
    }

    function ua(a, b, c) {
        if (la(a)) {
            var d = r(c),
                e = !d && b && !s(b),
                f = !b;
            if (a = (a = ta(a, !e)) && a.data, d) a[b] = c;
            else {
                if (f) return a;
                if (e) return a && a[b];
                i(a, b)
            }
        }
    }

    function va(a, b) {
        return !!a.getAttribute && -1 < (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + b + " ")
    }

    function wa(a, b) {
        b && a.setAttribute && d(b.split(" "), function(b) {
            a.setAttribute("class", ld((" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + ld(b) + " ", " ")))
        })
    }

    function xa(a, b) {
        if (b && a.setAttribute) {
            var c = (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            d(b.split(" "), function(a) {
                a = ld(a), -1 === c.indexOf(" " + a + " ") && (c += a + " ")
            }), a.setAttribute("class", ld(c))
        }
    }

    function ya(a, b) {
        if (b)
            if (b.nodeType) a[a.length++] = b;
            else {
                var c = b.length;
                if ("number" == typeof c && b.window !== b) {
                    if (c)
                        for (var d = 0; d < c; d++) a[a.length++] = b[d]
                } else a[a.length++] = b
            }
    }

    function za(a, b) {
        return Aa(a, "$" + (b || "ngController") + "Controller")
    }

    function Aa(a, b, c) {
        for (9 === a.nodeType && (a = a.documentElement), b = jd(b) ? b : [b]; a;) {
            for (var d = 0, e = b.length; d < e; d++)
                if (r(c = Vc.data(a, b[d]))) return c;
            a = a.parentNode || 11 === a.nodeType && a.host
        }
    }

    function Ba(a) {
        for (qa(a, !0); a.firstChild;) a.removeChild(a.firstChild)
    }

    function Ca(a, b) {
        b || qa(a);
        var c = a.parentNode;
        c && c.removeChild(a)
    }

    function Da(b, c) {
        c = c || a, "complete" === c.document.readyState ? c.setTimeout(b) : Vc(c).on("load", b)
    }

    function Ea(a, b) {
        var c = Jd[b.toLowerCase()];
        return c && Kd[F(a)] && c
    }

    function Fa(a, b) {
        var c = function(c, d) {
            c.isDefaultPrevented = function() {
                return c.defaultPrevented
            };
            var e = b[d || c.type],
                f = e ? e.length : 0;
            if (f) {
                if (q(c.immediatePropagationStopped)) {
                    var g = c.stopImmediatePropagation;
                    c.stopImmediatePropagation = function() {
                        c.immediatePropagationStopped = !0, c.stopPropagation && c.stopPropagation(), g && g.call(c)
                    }
                }
                c.isImmediatePropagationStopped = function() {
                    return !0 === c.immediatePropagationStopped
                };
                var h = e.specialHandlerWrapper || Ga;
                1 < f && (e = ia(e));
                for (var i = 0; i < f; i++) c.isImmediatePropagationStopped() || h(a, c, e[i])
            }
        };
        return c.elem = a, c
    }

    function Ga(a, b, c) {
        c.call(a, b)
    }

    function Ha(a, b, c) {
        var d = b.relatedTarget;
        d && (d === a || Hd.call(a, d)) || c.call(a, b)
    }

    function Ia() {
        this.$get = function() {
            return i(oa, {
                hasClass: function(a, b) {
                    return a.attr && (a = a[0]), va(a, b)
                },
                addClass: function(a, b) {
                    return a.attr && (a = a[0]), xa(a, b)
                },
                removeClass: function(a, b) {
                    return a.attr && (a = a[0]), wa(a, b)
                }
            })
        }
    }

    function Ja(a, b) {
        var c = a && a.$$hashKey;
        return c ? ("function" == typeof c && (c = a.$$hashKey()), c) : (c = typeof a, c = "function" === c || "object" === c && null !== a ? a.$$hashKey = c + ":" + (b || g)() : c + ":" + a)
    }

    function Ka(a, b) {
        if (b) {
            var c = 0;
            this.nextUid = function() {
                return ++c
            }
        }
        d(a, this.put, this)
    }

    function La(a) {
        return a = (Function.prototype.toString.call(a) + " ").replace(Rd, ""), a.match(Nd) || a.match(Od)
    }

    function Ma(a) {
        return (a = La(a)) ? "function(" + (a[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn"
    }

    function Na(a, b) {
        function c(a) {
            return function(b, c) {
                return s(b) ? void d(b, f(a)) : a(b, c)
            }
        }

        function e(a, b) {
            if (da(a, "service"), (x(b) || jd(b)) && (b = p.instantiate(b)), !b.$get) throw Sd("pget", a);
            return n[a + "Provider"] = b
        }

        function g(a, b) {
            return function() {
                var c = v.invoke(b, this);
                if (q(c)) throw Sd("undef", a);
                return c
            }
        }

        function h(a, b, c) {
            return e(a, {
                $get: !1 !== c ? g(a, b) : b
            })
        }

        function i(a) {
            ba(q(a) || jd(a), "modulesToLoad", "not an array");
            var b, c = [];
            return d(a, function(a) {
                function d(a) {
                    var b, c;
                    for (b = 0, c = a.length; b < c; b++) {
                        var d = a[b],
                            e = p.get(d[0]);
                        e[d[1]].apply(e, d[2])
                    }
                }
                if (!m.get(a)) {
                    m.put(a, !0);
                    try {
                        u(a) ? (b = Xc(a), c = c.concat(i(b.requires)).concat(b._runBlocks), d(b._invokeQueue), d(b._configBlocks)) : x(a) ? c.push(p.invoke(a)) : jd(a) ? c.push(p.invoke(a)) : ca(a, "module")
                    } catch (e) {
                        throw jd(a) && (a = a[a.length - 1]), e.message && e.stack && -1 === e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), Sd("modulerr", a, e.stack || e.message || e)
                    }
                }
            }), c
        }

        function j(a, c) {
            function d(b, d) {
                if (a.hasOwnProperty(b)) {
                    if (a[b] === k) throw Sd("cdep", b + " <- " + l.join(" <- "));
                    return a[b]
                }
                try {
                    return l.unshift(b), a[b] = k, a[b] = c(b, d), a[b]
                } catch (e) {
                    throw a[b] === k && delete a[b], e
                } finally {
                    l.shift()
                }
            }

            function e(a, c, e) {
                var f = [];
                a = Na.$$annotate(a, b, e);
                for (var g = 0, h = a.length; g < h; g++) {
                    var i = a[g];
                    if ("string" != typeof i) throw Sd("itkn", i);
                    f.push(c && c.hasOwnProperty(i) ? c[i] : d(i, e))
                }
                return f
            }
            return {
                invoke: function(a, b, c, d) {
                    return "string" == typeof c && (d = c, c = null), c = e(a, c, d), jd(a) && (a = a[a.length - 1]),
                        d = !(11 >= Uc) && ("function" == typeof a && /^(?:class\b|constructor\()/.test(Function.prototype.toString.call(a) + " ")), d ? (c.unshift(null), new(Function.prototype.bind.apply(a, c))) : a.apply(b, c)
                },
                instantiate: function(a, b, c) {
                    var d = jd(a) ? a[a.length - 1] : a;
                    return a = e(a, b, c), a.unshift(null), new(Function.prototype.bind.apply(d, a))
                },
                get: d,
                annotate: Na.$$annotate,
                has: function(b) {
                    return n.hasOwnProperty(b + "Provider") || a.hasOwnProperty(b)
                }
            }
        }
        b = !0 === b;
        var k = {},
            l = [],
            m = new Ka([], (!0)),
            n = {
                $provide: {
                    provider: c(e),
                    factory: c(h),
                    service: c(function(a, b) {
                        return h(a, ["$injector", function(a) {
                            return a.instantiate(b)
                        }])
                    }),
                    value: c(function(a, b) {
                        return h(a, o(b), !1)
                    }),
                    constant: c(function(a, b) {
                        da(a, "constant"), n[a] = b, r[a] = b
                    }),
                    decorator: function(a, b) {
                        var c = p.get(a + "Provider"),
                            d = c.$get;
                        c.$get = function() {
                            var a = v.invoke(d, c);
                            return v.invoke(b, null, {
                                $delegate: a
                            })
                        }
                    }
                }
            },
            p = n.$injector = j(n, function(a, b) {
                throw gd.isString(b) && l.push(b), Sd("unpr", l.join(" <- "))
            }),
            r = {},
            t = j(r, function(a, b) {
                var c = p.get(a + "Provider", b);
                return v.invoke(c.$get, c, void 0, a)
            }),
            v = t;
        n.$injectorProvider = {
            $get: o(t)
        };
        var w = i(a),
            v = t.get("$injector");
        return v.strictDi = b, d(w, function(a) {
            a && v.invoke(a)
        }), v
    }

    function Oa() {
        var a = !0;
        this.disableAutoScrolling = function() {
            a = !1
        }, this.$get = ["$window", "$location", "$rootScope", function(b, c, d) {
            function e(a) {
                var b = null;
                return Array.prototype.some.call(a, function(a) {
                    if ("a" === F(a)) return b = a, !0
                }), b
            }

            function f(a) {
                if (a) {
                    a.scrollIntoView();
                    var c;
                    c = g.yOffset, x(c) ? c = c() : D(c) ? (c = c[0], c = "fixed" !== b.getComputedStyle(c).position ? 0 : c.getBoundingClientRect().bottom) : v(c) || (c = 0), c && (a = a.getBoundingClientRect().top, b.scrollBy(0, a - c))
                } else b.scrollTo(0, 0)
            }

            function g(a) {
                a = u(a) ? a : c.hash();
                var b;
                a ? (b = h.getElementById(a)) ? f(b) : (b = e(h.getElementsByName(a))) ? f(b) : "top" === a && f(null) : f(null)
            }
            var h = b.document;
            return a && d.$watch(function() {
                return c.hash()
            }, function(a, b) {
                a === b && "" === a || Da(function() {
                    d.$evalAsync(g)
                })
            }), g
        }]
    }

    function Pa(a, b) {
        return a || b ? a ? b ? (jd(a) && (a = a.join(" ")), jd(b) && (b = b.join(" ")), a + " " + b) : a : b : ""
    }

    function Qa(a) {
        u(a) && (a = a.split(" "));
        var b = ga();
        return d(a, function(a) {
            a.length && (b[a] = !0)
        }), b
    }

    function Ra(a) {
        return s(a) ? a : {}
    }

    function Sa(a, b, c, e) {
        function f(a) {
            try {
                a.apply(null, ad.call(arguments, 1))
            } finally {
                if (r--, 0 === r)
                    for (; s.length;) try {
                        s.pop()()
                    } catch (b) {
                        c.error(b)
                    }
            }
        }

        function g() {
            x = null, h(), i()
        }

        function h() {
            t = y(), t = q(t) ? null : t, I(t, B) && (t = B), B = t
        }

        function i() {
            v === j.url() && u === t || (v = j.url(), u = t, d(z, function(a) {
                a(j.url(), t)
            }))
        }
        var j = this,
            k = a.location,
            l = a.history,
            n = a.setTimeout,
            o = a.clearTimeout,
            p = {};
        j.isMock = !1;
        var r = 0,
            s = [];
        j.$$completeOutstandingRequest = f, j.$$incOutstandingRequestCount = function() {
            r++
        }, j.notifyWhenNoOutstandingRequests = function(a) {
            0 === r ? a() : s.push(a)
        };
        var t, u, v = k.href,
            w = b.find("base"),
            x = null,
            y = e.history ? function() {
                try {
                    return l.state
                } catch (a) {}
            } : m;
        h(), u = t, j.url = function(b, c, d) {
            if (q(d) && (d = null), k !== a.location && (k = a.location), l !== a.history && (l = a.history), b) {
                var f = u === d;
                if (v === b && (!e.history || f)) return j;
                var g = v && ub(v) === ub(b);
                return v = b, u = d, !e.history || g && f ? (g || (x = b), c ? k.replace(b) : g ? (c = k, d = b.indexOf("#"), d = -1 === d ? "" : b.substr(d), c.hash = d) : k.href = b, k.href !== b && (x = b)) : (l[c ? "replaceState" : "pushState"](d, "", b), h(), u = t), x && (x = b), j
            }
            return x || k.href.replace(/%27/g, "'")
        }, j.state = function() {
            return t
        };
        var z = [],
            A = !1,
            B = null;
        j.onUrlChange = function(b) {
            return A || (e.history && Vc(a).on("popstate", g), Vc(a).on("hashchange", g), A = !0), z.push(b), b
        }, j.$$applicationDestroyed = function() {
            Vc(a).off("hashchange popstate", g)
        }, j.$$checkUrlChange = i, j.baseHref = function() {
            var a = w.attr("href");
            return a ? a.replace(/^(https?:)?\/\/[^\/]*/, "") : ""
        }, j.defer = function(a, b) {
            var c;
            return r++, c = n(function() {
                delete p[c], f(a)
            }, b || 0), p[c] = !0, c
        }, j.defer.cancel = function(a) {
            return !!p[a] && (delete p[a], o(a), f(m), !0)
        }
    }

    function Ta() {
        this.$get = ["$window", "$log", "$sniffer", "$document", function(a, b, c, d) {
            return new Sa(a, d, b, c)
        }]
    }

    function Ua() {
        this.$get = function() {
            function a(a, d) {
                function e(a) {
                    a !== m && (n ? n === a && (n = a.n) : n = a, f(a.n, a.p), f(a, m), m = a, m.n = null)
                }

                function f(a, b) {
                    a !== b && (a && (a.p = b), b && (b.n = a))
                }
                if (a in c) throw b("$cacheFactory")("iid", a);
                var g = 0,
                    h = i({}, d, {
                        id: a
                    }),
                    j = ga(),
                    k = d && d.capacity || Number.MAX_VALUE,
                    l = ga(),
                    m = null,
                    n = null;
                return c[a] = {
                    put: function(a, b) {
                        if (!q(b)) {
                            if (k < Number.MAX_VALUE) {
                                var c = l[a] || (l[a] = {
                                    key: a
                                });
                                e(c)
                            }
                            return a in j || g++, j[a] = b, g > k && this.remove(n.key), b
                        }
                    },
                    get: function(a) {
                        if (k < Number.MAX_VALUE) {
                            var b = l[a];
                            if (!b) return;
                            e(b)
                        }
                        return j[a]
                    },
                    remove: function(a) {
                        if (k < Number.MAX_VALUE) {
                            var b = l[a];
                            if (!b) return;
                            b === m && (m = b.p), b === n && (n = b.n), f(b.n, b.p), delete l[a]
                        }
                        a in j && (delete j[a], g--)
                    },
                    removeAll: function() {
                        j = ga(), g = 0, l = ga(), m = n = null
                    },
                    destroy: function() {
                        l = h = j = null, delete c[a]
                    },
                    info: function() {
                        return i({}, h, {
                            size: g
                        })
                    }
                }
            }
            var c = {};
            return a.info = function() {
                var a = {};
                return d(c, function(b, c) {
                    a[c] = b.info()
                }), a
            }, a.get = function(a) {
                return c[a]
            }, a
        }
    }

    function Va() {
        this.$get = ["$cacheFactory", function(a) {
            return a("templates")
        }]
    }

    function Wa(b, c) {
        function e(a, b, c) {
            var e = /^\s*([@&<]|=(\*?))(\??)\s*(\w*)\s*$/,
                f = ga();
            return d(a, function(a, d) {
                if (a in y) f[d] = y[a];
                else {
                    var g = a.match(e);
                    if (!g) throw $d("iscp", b, d, a, c ? "controller bindings definition" : "isolate scope definition");
                    f[d] = {
                        mode: g[1][0],
                        collection: "*" === g[2],
                        optional: "?" === g[3],
                        attrName: g[4] || d
                    }, g[4] && (y[a] = f[d])
                }
            }), f
        }

        function g(a) {
            var b = a.charAt(0);
            if (!b || b !== $c(b)) throw $d("baddir", a);
            if (a !== a.trim()) throw $d("baddir", a)
        }

        function h(a) {
            var b = a.require || a.controller && a.name;
            return !jd(b) && s(b) && d(b, function(a, c) {
                var d = a.match(v);
                a.substring(d[0].length) || (b[c] = d[0] + c)
            }), b
        }
        var j = {},
            k = /^\s*directive:\s*([\w\-]+)\s+(.*)$/,
            p = /(([\w\-]+)(?::([^;]+))?;?)/,
            t = E("ngSrc,ngSrcset,src,srcset"),
            v = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/,
            w = /^(on[a-z]+|formaction)$/,
            y = ga();
        this.directive = function J(a, c) {
            return da(a, "directive"), u(a) ? (g(a), ba(c, "directiveFactory"), j.hasOwnProperty(a) || (j[a] = [], b.factory(a + "Directive", ["$injector", "$exceptionHandler", function(b, c) {
                var e = [];
                return d(j[a], function(d, f) {
                    try {
                        var g = b.invoke(d);
                        x(g) ? g = {
                            compile: o(g)
                        } : !g.compile && g.link && (g.compile = o(g.link)), g.priority = g.priority || 0, g.index = f, g.name = g.name || a, g.require = h(g), g.restrict = g.restrict || "EA", g.$$moduleName = d.$$moduleName, e.push(g)
                    } catch (i) {
                        c(i)
                    }
                }), e
            }])), j[a].push(c)) : d(a, f(J)), this
        }, this.component = function(a, b) {
            function c(a) {
                function c(b) {
                    return x(b) || jd(b) ? function(c, d) {
                        return a.invoke(b, this, {
                            $element: c,
                            $attrs: d
                        })
                    } : b
                }
                var f = b.template || b.templateUrl ? b.template : "",
                    g = {
                        controller: e,
                        controllerAs: _a(b.controller) || b.controllerAs || "$ctrl",
                        template: c(f),
                        templateUrl: c(b.templateUrl),
                        transclude: b.transclude,
                        scope: {},
                        bindToController: b.bindings || {},
                        restrict: "E",
                        require: b.require
                    };
                return d(b, function(a, b) {
                    "$" === b.charAt(0) && (g[b] = a)
                }), g
            }
            var e = b.controller || function() {};
            return d(b, function(a, b) {
                "$" === b.charAt(0) && (c[b] = a, x(e) && (e[b] = a))
            }), c.$inject = ["$injector"], this.directive(a, c)
        }, this.aHrefSanitizationWhitelist = function(a) {
            return r(a) ? (c.aHrefSanitizationWhitelist(a), this) : c.aHrefSanitizationWhitelist()
        }, this.imgSrcSanitizationWhitelist = function(a) {
            return r(a) ? (c.imgSrcSanitizationWhitelist(a), this) : c.imgSrcSanitizationWhitelist()
        };
        var z = !0;
        this.debugInfoEnabled = function(a) {
            return r(a) ? (z = a, this) : z
        };
        var C = 10;
        this.onChangesTtl = function(a) {
            return arguments.length ? (C = a, this) : C
        };
        var D = !0;
        this.commentDirectivesEnabled = function(a) {
            return arguments.length ? (D = a, this) : D
        };
        var H = !0;
        this.cssClassDirectivesEnabled = function(a) {
            return arguments.length ? (H = a, this) : H
        }, this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$sce", "$animate", "$$sanitizeUri", function(b, c, f, g, h, o, y, E, J, L) {
            function M() {
                try {
                    if (!--za) throw ua = void 0, $d("infchng", C);
                    y.$apply(function() {
                        for (var a = [], b = 0, c = ua.length; b < c; ++b) try {
                            ua[b]()
                        } catch (d) {
                            a.push(d)
                        }
                        if (ua = void 0, a.length) throw a
                    })
                } finally {
                    za++
                }
            }

            function N(a, b) {
                if (b) {
                    var c, d, e, f = Object.keys(b);
                    for (c = 0, d = f.length; c < d; c++) e = f[c], this[e] = b[e]
                } else this.$attr = {};
                this.$$element = a
            }

            function O(a, b, c) {
                wa.innerHTML = "<span " + b + ">", b = wa.firstChild.attributes;
                var d = b[0];
                b.removeNamedItem(d.name), d.value = c, a.attributes.setNamedItem(d)
            }

            function P(a, b) {
                try {
                    a.addClass(b)
                } catch (c) {}
            }

            function R(b, c, d, e, f) {
                b instanceof Vc || (b = Vc(b));
                for (var g = /\S+/, h = 0, i = b.length; h < i; h++) {
                    var j = b[h];
                    j.nodeType === ud && j.nodeValue.match(g) && na(j, b[h] = a.document.createElement("span"))
                }
                var k = S(b, c, b, d, e, f);
                R.$$addScopeClass(b);
                var l = null;
                return function(a, c, d) {
                    ba(a, "scope"), f && f.needsNewScope && (a = a.$parent.$new()), d = d || {};
                    var e = d.parentBoundTranscludeFn,
                        g = d.transcludeControllers;
                    if (d = d.futureParentElement, e && e.$$boundTransclude && (e = e.$$boundTransclude), l || (l = (d = d && d[0]) && "foreignobject" !== F(d) && dd.call(d).match(/SVG/) ? "svg" : "html"), d = "html" !== l ? Vc(la(l, Vc("<div>").append(b).html())) : c ? Id.clone.call(b) : b, g)
                        for (var h in g) d.data("$" + h + "Controller", g[h].instance);
                    return R.$$addScopeInfo(d, a), c && c(d, a), k && k(a, d, d, e), d
                }
            }

            function S(a, b, c, d, e, f) {
                function g(a, c, d, e) {
                    var f, g, h, i, j, k, n;
                    if (l)
                        for (n = Array(c.length), i = 0; i < m.length; i += 3) f = m[i], n[f] = c[f];
                    else n = c;
                    for (i = 0, j = m.length; i < j;) g = n[m[i++]], c = m[i++], f = m[i++], c ? (c.scope ? (h = a.$new(), R.$$addScopeInfo(Vc(g), h)) : h = a, k = c.transcludeOnThisElement ? T(a, c.transclude, e) : !c.templateOnThisElement && e ? e : !e && b ? T(a, b) : null, c(f, h, g, d, k)) : f && f(a, g.childNodes, void 0, e)
                }
                for (var h, i, j, k, l, m = [], n = 0; n < a.length; n++) h = new N, i = U(a[n], [], h, 0 === n ? d : void 0, e), (f = i.length ? Z(i, a[n], h, b, c, null, [], [], f) : null) && f.scope && R.$$addScopeClass(h.$$element), h = f && f.terminal || !(j = a[n].childNodes) || !j.length ? null : S(j, f ? (f.transcludeOnThisElement || !f.templateOnThisElement) && f.transclude : b), (f || h) && (m.push(n, f, h), k = !0, l = l || f), f = null;
                return k ? g : null
            }

            function T(a, b, c) {
                function d(d, e, f, g, h) {
                    return d || (d = a.$new(!1, h), d.$$transcluded = !0), b(d, e, {
                        parentBoundTranscludeFn: c,
                        transcludeControllers: f,
                        futureParentElement: g
                    })
                }
                var e, f = d.$$slots = ga();
                for (e in b.$$slots) f[e] = b.$$slots[e] ? T(a, b.$$slots[e], c) : null;
                return d
            }

            function U(a, b, c, d, e) {
                var f, g = c.$attr;
                switch (a.nodeType) {
                    case 1:
                        f = F(a), da(b, Ya(f), "E", d, e);
                        for (var h, i, j, k, l = a.attributes, m = 0, n = l && l.length; m < n; m++) {
                            var o = !1,
                                q = !1;
                            h = l[m], i = h.name, j = ld(h.value), h = Ya(i), (k = Da.test(h)) && (i = i.replace(ae, "").substr(8).replace(/_(.)/g, function(a, b) {
                                return b.toUpperCase()
                            })), (h = h.match(Fa)) && ea(h[1]) && (o = i, q = i.substr(0, i.length - 5) + "end", i = i.substr(0, i.length - 6)), h = Ya(i.toLowerCase()), g[h] = i, !k && c.hasOwnProperty(h) || (c[h] = j, Ea(a, h) && (c[h] = !0)), oa(a, b, j, h, k), da(b, h, "A", d, e, o, q)
                        }
                        if ("input" === f && "hidden" === a.getAttribute("type") && a.setAttribute("autocomplete", "off"), !ya) break;
                        if (g = a.className, s(g) && (g = g.animVal), u(g) && "" !== g)
                            for (; a = p.exec(g);) h = Ya(a[2]), da(b, h, "C", d, e) && (c[h] = ld(a[3])), g = g.substr(a.index + a[0].length);
                        break;
                    case ud:
                        if (11 === Uc)
                            for (; a.parentNode && a.nextSibling && a.nextSibling.nodeType === ud;) a.nodeValue += a.nextSibling.nodeValue, a.parentNode.removeChild(a.nextSibling);
                        ka(b, a.nodeValue);
                        break;
                    case 8:
                        if (!xa) break;
                        V(a, b, c, d, e)
                }
                return b.sort(ia), b
            }

            function V(a, b, c, d, e) {
                try {
                    var f = k.exec(a.nodeValue);
                    if (f) {
                        var g = Ya(f[1]);
                        da(b, g, "M", d, e) && (c[g] = ld(f[2]))
                    }
                } catch (h) {}
            }

            function W(a, b, c) {
                var d = [],
                    e = 0;
                if (b && a.hasAttribute && a.hasAttribute(b)) {
                    do {
                        if (!a) throw $d("uterdir", b, c);
                        1 === a.nodeType && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--), d.push(a), a = a.nextSibling
                    } while (0 < e)
                } else d.push(a);
                return Vc(d)
            }

            function X(a, b, c) {
                return function(d, e, f, g, h) {
                    return e = W(e[0], b, c), a(d, e, f, g, h)
                }
            }

            function Y(a, b, c, d, e, f) {
                var g;
                return a ? R(b, c, d, e, f) : function() {
                    return g || (g = R(b, c, d, e, f), b = c = f = null), g.apply(this, arguments)
                }
            }

            function Z(a, b, c, e, g, h, j, k, l) {
                function m(a, b, c, d) {
                    a && (c && (a = X(a, c, d)), a.require = o.require, a.directiveName = p, (z === o || o.$$isolateScope) && (a = ra(a, {
                        isolateScope: !0
                    })), j.push(a)), b && (c && (b = X(b, c, d)), b.require = o.require, b.directiveName = p, (z === o || o.$$isolateScope) && (b = ra(b, {
                        isolateScope: !0
                    })), k.push(b))
                }

                function n(a, e, g, h, l) {
                    function m(a, b, c, d) {
                        var e;
                        if (A(a) || (d = c, c = b, b = a, a = void 0), G && (e = u), c || (c = G ? C.parent() : C), !d) return l(a, b, e, c, F);
                        var f = l.$$slots[d];
                        if (f) return f(a, b, e, c, F);
                        if (q(f)) throw $d("noslot", d, Q(C))
                    }
                    var n, o, p, r, t, u, v, C;
                    b === g ? (h = c, C = c.$$element) : (C = Vc(g), h = new N(C, c)), t = e, z ? r = e.$new(!0) : w && (t = e.$parent), l && (v = m, v.$$boundTransclude = l, v.isSlotFilled = function(a) {
                        return !!l.$$slots[a]
                    }), y && (u = aa(C, h, v, y, r, e, z)), z && (R.$$addScopeInfo(C, r, !0, !(B && (B === z || B === z.$$originalDirective))), R.$$addScopeClass(C, !0), r.$$isolateBindings = z.$$isolateBindings, o = ta(e, h, r, r.$$isolateBindings, z), o.removeWatches && r.$on("$destroy", o.removeWatches));
                    for (n in u) {
                        o = y[n], p = u[n];
                        var D = o.$$bindings.bindToController;
                        p.bindingInfo = p.identifier && D ? ta(t, h, p.instance, D, o) : {};
                        var E = p();
                        E !== p.instance && (p.instance = E, C.data("$" + o.name + "Controller", E), p.bindingInfo.removeWatches && p.bindingInfo.removeWatches(), p.bindingInfo = ta(t, h, p.instance, D, o))
                    }
                    for (d(y, function(a, b) {
                            var c = a.require;
                            a.bindToController && !jd(c) && s(c) && i(u[b].instance, $(b, c, C, u))
                        }), d(u, function(a) {
                            var b = a.instance;
                            if (x(b.$onChanges)) try {
                                b.$onChanges(a.bindingInfo.initialChanges)
                            } catch (c) {
                                f(c)
                            }
                            if (x(b.$onInit)) try {
                                b.$onInit()
                            } catch (d) {
                                f(d)
                            }
                            x(b.$doCheck) && (t.$watch(function() {
                                b.$doCheck()
                            }), b.$doCheck()), x(b.$onDestroy) && t.$on("$destroy", function() {
                                b.$onDestroy()
                            })
                        }), n = 0, o = j.length; n < o; n++) p = j[n], sa(p, p.isolateScope ? r : e, C, h, p.require && $(p.directiveName, p.require, C, u), v);
                    var F = e;
                    for (z && (z.template || null === z.templateUrl) && (F = r), a && a(F, g.childNodes, void 0, l), n = k.length - 1; 0 <= n; n--) p = k[n], sa(p, p.isolateScope ? r : e, C, h, p.require && $(p.directiveName, p.require, C, u), v);
                    d(u, function(a) {
                        a = a.instance, x(a.$postLink) && a.$postLink()
                    })
                }
                l = l || {};
                for (var o, p, r, t, u, v = -Number.MAX_VALUE, w = l.newScopeDirective, y = l.controllerDirectives, z = l.newIsolateScopeDirective, B = l.templateDirective, C = l.nonTlbTranscludeDirective, D = !1, E = !1, G = l.hasElementTranscludeDirective, H = c.$$element = Vc(b), I = e, J = !1, L = !1, M = 0, O = a.length; M < O; M++) {
                    o = a[M];
                    var P = o.$$start,
                        S = o.$$end;
                    if (P && (H = W(b, P, S)), r = void 0, v > o.priority) break;
                    if ((u = o.scope) && (o.templateUrl || (s(u) ? (ja("new/isolated scope", z || w, o, H), z = o) : ja("new/isolated scope", z, o, H)), w = w || o), p = o.name, !J && (o.replace && (o.templateUrl || o.template) || o.transclude && !o.$$tlb)) {
                        for (u = M + 1; J = a[u++];)
                            if (J.transclude && !J.$$tlb || J.replace && (J.templateUrl || J.template)) {
                                L = !0;
                                break
                            } J = !0
                    }
                    if (!o.templateUrl && o.controller && (u = o.controller, y = y || ga(), ja("'" + p + "' controller", y[p], o, H), y[p] = o), u = o.transclude)
                        if (D = !0, o.$$tlb || (ja("transclusion", C, o, H), C = o), "element" === u) G = !0, v = o.priority, r = H, H = c.$$element = Vc(R.$$createComment(p, c[p])), b = H[0], qa(g, ad.call(r, 0), b), r[0].$$parentNode = r[0].parentNode, I = Y(L, r, e, v, h && h.name, {
                            nonTlbTranscludeDirective: C
                        });
                        else {
                            var T = ga();
                            if (r = Vc(pa(b)).contents(), s(u)) {
                                r = [];
                                var V = ga(),
                                    Z = ga();
                                d(u, function(a, b) {
                                    var c = "?" === a.charAt(0);
                                    a = c ? a.substring(1) : a, V[a] = b, T[b] = null, Z[b] = c
                                }), d(H.contents(), function(a) {
                                    var b = V[Ya(F(a))];
                                    b ? (Z[b] = !0, T[b] = T[b] || [], T[b].push(a)) : r.push(a)
                                }), d(Z, function(a, b) {
                                    if (!a) throw $d("reqslot", b)
                                });
                                for (var _ in T) T[_] && (T[_] = Y(L, T[_], e))
                            }
                            H.empty(), I = Y(L, r, e, void 0, void 0, {
                                needsNewScope: o.$$isolateScope || o.$$newScope
                            }), I.$$slots = T
                        } if (o.template)
                        if (E = !0, ja("template", B, o, H), B = o, u = x(o.template) ? o.template(H, c) : o.template, u = Ca(u), o.replace) {
                            if (h = o, r = Dd.test(u) ? $a(la(o.templateNamespace, ld(u))) : [], b = r[0], 1 !== r.length || 1 !== b.nodeType) throw $d("tplrt", p, "");
                            qa(g, H, b), O = {
                                $attr: {}
                            }, u = U(b, [], O);
                            var ba = a.splice(M + 1, a.length - (M + 1));
                            (z || w) && ca(u, z, w), a = a.concat(u).concat(ba), fa(c, O), O = a.length
                        } else H.html(u);
                    if (o.templateUrl) E = !0, ja("template", B, o, H), B = o, o.replace && (h = o), n = ha(a.splice(M, a.length - M), H, c, g, D && I, j, k, {
                        controllerDirectives: y,
                        newScopeDirective: w !== o && w,
                        newIsolateScopeDirective: z,
                        templateDirective: B,
                        nonTlbTranscludeDirective: C
                    }), O = a.length;
                    else if (o.compile) try {
                        t = o.compile(H, c, I);
                        var da = o.$$originalDirective || o;
                        x(t) ? m(null, K(da, t), P, S) : t && m(K(da, t.pre), K(da, t.post), P, S)
                    } catch (ea) {
                        f(ea, Q(H))
                    }
                    o.terminal && (n.terminal = !0, v = Math.max(v, o.priority))
                }
                return n.scope = w && !0 === w.scope, n.transcludeOnThisElement = D, n.templateOnThisElement = E, n.transclude = I, l.hasElementTranscludeDirective = G, n
            }

            function $(a, b, c, e) {
                var f;
                if (u(b)) {
                    var g = b.match(v);
                    b = b.substring(g[0].length);
                    var h = g[1] || g[3],
                        g = "?" === g[2];
                    if ("^^" === h ? c = c.parent() : f = (f = e && e[b]) && f.instance, !f) {
                        var i = "$" + b + "Controller";
                        f = h ? c.inheritedData(i) : c.data(i)
                    }
                    if (!f && !g) throw $d("ctreq", b, a)
                } else if (jd(b))
                    for (f = [], h = 0, g = b.length; h < g; h++) f[h] = $(a, b[h], c, e);
                else s(b) && (f = {}, d(b, function(b, d) {
                    f[d] = $(a, b, c, e)
                }));
                return f || null
            }

            function aa(a, b, c, d, e, f, g) {
                var h, i = ga();
                for (h in d) {
                    var j = d[h],
                        k = {
                            $scope: j === g || j.$$isolateScope ? e : f,
                            $element: a,
                            $attrs: b,
                            $transclude: c
                        },
                        l = j.controller;
                    "@" === l && (l = b[j.name]), k = o(l, k, !0, j.controllerAs), i[j.name] = k, a.data("$" + j.name + "Controller", k.instance)
                }
                return i
            }

            function ca(a, b, c) {
                for (var d = 0, e = a.length; d < e; d++) a[d] = l(a[d], {
                    $$isolateScope: b,
                    $$newScope: c
                })
            }

            function da(a, c, d, g, h, i, k) {
                if (c === h) return null;
                if (h = null, j.hasOwnProperty(c)) {
                    var m;
                    c = b.get(c + "Directive");
                    for (var n = 0, o = c.length; n < o; n++) try {
                        if (m = c[n], (q(g) || g > m.priority) && -1 !== m.restrict.indexOf(d)) {
                            if (i && (m = l(m, {
                                    $$start: i,
                                    $$end: k
                                })), !m.$$bindings) {
                                var p = m,
                                    r = m,
                                    t = m.name,
                                    u = {
                                        isolateScope: null,
                                        bindToController: null
                                    };
                                if (s(r.scope) && (!0 === r.bindToController ? (u.bindToController = e(r.scope, t, !0), u.isolateScope = {}) : u.isolateScope = e(r.scope, t, !1)), s(r.bindToController) && (u.bindToController = e(r.bindToController, t, !0)), s(u.bindToController)) {
                                    var v = r.controller,
                                        w = r.controllerAs;
                                    if (!v) throw $d("noctrl", t);
                                    if (!_a(v, w)) throw $d("noident", t)
                                }
                                var x = p.$$bindings = u;
                                s(x.isolateScope) && (m.$$isolateBindings = x.isolateScope)
                            }
                            a.push(m), h = m
                        }
                    } catch (y) {
                        f(y)
                    }
                }
                return h
            }

            function ea(a) {
                if (j.hasOwnProperty(a))
                    for (var c = b.get(a + "Directive"), d = 0, e = c.length; d < e; d++)
                        if (a = c[d], a.multiElement) return !0;
                return !1
            }

            function fa(a, b) {
                var c = b.$attr,
                    e = a.$attr;
                d(a, function(d, e) {
                    "$" !== e.charAt(0) && (b[e] && b[e] !== d && (d += ("style" === e ? ";" : " ") + b[e]), a.$set(e, d, !0, c[e]))
                }), d(b, function(b, d) {
                    a.hasOwnProperty(d) || "$" === d.charAt(0) || (a[d] = b, "class" !== d && "style" !== d && (e[d] = c[d]))
                })
            }

            function ha(a, b, c, e, f, h, i, j) {
                var k, m, n = [],
                    o = b[0],
                    p = a.shift(),
                    q = l(p, {
                        templateUrl: null,
                        transclude: null,
                        replace: null,
                        $$originalDirective: p
                    }),
                    r = x(p.templateUrl) ? p.templateUrl(b, c) : p.templateUrl,
                    t = p.templateNamespace;
                return b.empty(), g(r).then(function(g) {
                        var l, u;
                        if (g = Ca(g), p.replace) {
                            if (g = Dd.test(g) ? $a(la(t, ld(g))) : [], l = g[0], 1 !== g.length || 1 !== l.nodeType) throw $d("tplrt", p.name, r);
                            g = {
                                $attr: {}
                            }, qa(e, b, l);
                            var v = U(l, [], g);
                            s(p.scope) && ca(v, !0), a = v.concat(a), fa(c, g)
                        } else l = o, b.html(g);
                        for (a.unshift(q), k = Z(a, l, c, f, b, p, h, i, j), d(e, function(a, c) {
                                a === l && (e[c] = b[0])
                            }), m = S(b[0].childNodes, f); n.length;) {
                            g = n.shift(), u = n.shift();
                            var w = n.shift(),
                                x = n.shift(),
                                v = b[0];
                            if (!g.$$destroyed) {
                                if (u !== o) {
                                    var y = u.className;
                                    j.hasElementTranscludeDirective && p.replace || (v = pa(l)), qa(w, Vc(u), v), P(Vc(v), y)
                                }
                                u = k.transcludeOnThisElement ? T(g, k.transclude, x) : x, k(m, g, v, e, u)
                            }
                        }
                        n = null
                    }),
                    function(a, b, c, d, e) {
                        a = e, b.$$destroyed || (n ? n.push(b, c, d, a) : (k.transcludeOnThisElement && (a = T(b, k.transclude, e)), k(m, b, c, d, a)))
                    }
            }

            function ia(a, b) {
                var c = b.priority - a.priority;
                return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
            }

            function ja(a, b, c, d) {
                function e(a) {
                    return a ? " (module: " + a + ")" : ""
                }
                if (b) throw $d("multidir", b.name, e(b.$$moduleName), c.name, e(c.$$moduleName), a, Q(d))
            }

            function ka(a, b) {
                var d = c(b, !0);
                d && a.push({
                    priority: 0,
                    compile: function(a) {
                        a = a.parent();
                        var b = !!a.length;
                        return b && R.$$addBindingClass(a),
                            function(a, c) {
                                var e = c.parent();
                                b || R.$$addBindingClass(e), R.$$addBindingInfo(e, d.expressions), a.$watch(d, function(a) {
                                    c[0].nodeValue = a
                                })
                            }
                    }
                })
            }

            function la(b, c) {
                switch (b = $c(b || "html")) {
                    case "svg":
                    case "math":
                        var d = a.document.createElement("div");
                        return d.innerHTML = "<" + b + ">" + c + "</" + b + ">", d.childNodes[0].childNodes;
                    default:
                        return c
                }
            }

            function ma(a, b) {
                if ("srcdoc" === b) return E.HTML;
                var c = F(a);
                if ("src" === b || "ngSrc" === b) {
                    if (-1 === ["img", "video", "audio", "source", "track"].indexOf(c)) return E.RESOURCE_URL
                } else if ("xlinkHref" === b || "form" === c && "action" === b) return E.RESOURCE_URL
            }

            function oa(a, b, d, e, f) {
                var g = ma(a, e);
                f = t[e] || f;
                var h = c(d, !0, g, f);
                if (h) {
                    if ("multiple" === e && "select" === F(a)) throw $d("selmulti", Q(a));
                    b.push({
                        priority: 100,
                        compile: function() {
                            return {
                                pre: function(a, b, i) {
                                    if (b = i.$$observers || (i.$$observers = ga()), w.test(e)) throw $d("nodomevents");
                                    var j = i[e];
                                    j !== d && (h = j && c(j, !0, g, f), d = j), h && (i[e] = h(a), (b[e] || (b[e] = [])).$$inter = !0, (i.$$observers && i.$$observers[e].$$scope || a).$watch(h, function(a, b) {
                                        "class" === e && a !== b ? i.$updateClass(a, b) : i.$set(e, a)
                                    }))
                                }
                            }
                        }
                    })
                }
            }

            function qa(b, c, d) {
                var e, f, g = c[0],
                    h = c.length,
                    i = g.parentNode;
                if (b)
                    for (e = 0, f = b.length; e < f; e++)
                        if (b[e] === g) {
                            b[e++] = d, f = e + h - 1;
                            for (var j = b.length; e < j; e++, f++) f < j ? b[e] = b[f] : delete b[e];
                            b.length -= h - 1, b.context === g && (b.context = d);
                            break
                        } for (i && i.replaceChild(d, g), b = a.document.createDocumentFragment(), e = 0; e < h; e++) b.appendChild(c[e]);
                for (Vc.hasData(g) && (Vc.data(d, Vc.data(g)), Vc(g).off("$destroy")), Vc.cleanData(b.querySelectorAll("*")), e = 1; e < h; e++) delete c[e];
                c[0] = d, c.length = 1
            }

            function ra(a, b) {
                return i(function() {
                    return a.apply(null, arguments)
                }, a, b)
            }

            function sa(a, b, c, d, e, g) {
                try {
                    a(b, c, d, e, g)
                } catch (h) {
                    f(h, Q(c))
                }
            }

            function ta(a, b, e, f, g) {
                function i(b, c, d) {
                    x(e.$onChanges) && c !== d && (ua || (a.$$postDigest(M), ua = []), k || (k = {}, ua.push(j)), k[b] && (d = k[b].previousValue), k[b] = new Xa(d, c))
                }

                function j() {
                    e.$onChanges(k), k = void 0
                }
                var k, l = [],
                    n = {};
                return d(f, function(d, f) {
                    var j, k, o, p, q = d.attrName,
                        r = d.optional;
                    switch (d.mode) {
                        case "@":
                            r || Zc.call(b, q) || (e[f] = b[q] = void 0), b.$observe(q, function(a) {
                                (u(a) || B(a)) && (i(f, a, e[f]), e[f] = a)
                            }), b.$$observers[q].$$scope = a, j = b[q], u(j) ? e[f] = c(j)(a) : B(j) && (e[f] = j), n[f] = new Xa(_d, e[f]);
                            break;
                        case "=":
                            if (!Zc.call(b, q)) {
                                if (r) break;
                                b[q] = void 0
                            }
                            if (r && !b[q]) break;
                            k = h(b[q]), p = k.literal ? I : function(a, b) {
                                return a === b || a !== a && b !== b
                            }, o = k.assign || function() {
                                throw j = e[f] = k(a), $d("nonassign", b[q], q, g.name)
                            }, j = e[f] = k(a), r = function(b) {
                                return p(b, e[f]) || (p(b, j) ? o(a, b = e[f]) : e[f] = b), j = b
                            }, r.$stateful = !0, r = d.collection ? a.$watchCollection(b[q], r) : a.$watch(h(b[q], r), null, k.literal), l.push(r);
                            break;
                        case "<":
                            if (!Zc.call(b, q)) {
                                if (r) break;
                                b[q] = void 0
                            }
                            if (r && !b[q]) break;
                            k = h(b[q]);
                            var s = e[f] = k(a);
                            n[f] = new Xa(_d, e[f]), r = a.$watch(k, function(a, b) {
                                if (b === a) {
                                    if (b === s) return;
                                    b = s
                                }
                                i(f, a, b), e[f] = a
                            }, k.literal), l.push(r);
                            break;
                        case "&":
                            if (k = b.hasOwnProperty(q) ? h(b[q]) : m, k === m && r) break;
                            e[f] = function(b) {
                                return k(a, b)
                            }
                    }
                }), {
                    initialChanges: n,
                    removeWatches: l.length && function() {
                        for (var a = 0, b = l.length; a < b; ++a) l[a]()
                    }
                }
            }
            var ua, va = /^\w/,
                wa = a.document.createElement("div"),
                xa = D,
                ya = H,
                za = C;
            N.prototype = {
                $normalize: Ya,
                $addClass: function(a) {
                    a && 0 < a.length && J.addClass(this.$$element, a)
                },
                $removeClass: function(a) {
                    a && 0 < a.length && J.removeClass(this.$$element, a)
                },
                $updateClass: function(a, b) {
                    var c = Za(a, b);
                    c && c.length && J.addClass(this.$$element, c), (c = Za(b, a)) && c.length && J.removeClass(this.$$element, c)
                },
                $set: function(a, b, c, e) {
                    var g = Ea(this.$$element[0], a),
                        h = Ld[a],
                        i = a;
                    if (g ? (this.$$element.prop(a, b), e = g) : h && (this[h] = b, i = h), this[a] = b, e ? this.$attr[a] = e : (e = this.$attr[a]) || (this.$attr[a] = e = _(a, "-")), g = F(this.$$element), "a" === g && ("href" === a || "xlinkHref" === a) || "img" === g && "src" === a) this[a] = b = L(b, "src" === a);
                    else if ("img" === g && "srcset" === a && r(b)) {
                        for (var g = "", h = ld(b), j = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, j = /\s/.test(h) ? j : /(,)/, h = h.split(j), j = Math.floor(h.length / 2), k = 0; k < j; k++) var l = 2 * k,
                            g = g + L(ld(h[l]), !0),
                            g = g + (" " + ld(h[l + 1]));
                        h = ld(h[2 * k]).split(/\s/), g += L(ld(h[0]), !0), 2 === h.length && (g += " " + ld(h[1])), this[a] = b = g
                    }!1 !== c && (null === b || q(b) ? this.$$element.removeAttr(e) : va.test(e) ? this.$$element.attr(e, b) : O(this.$$element[0], e, b)), (a = this.$$observers) && d(a[i], function(a) {
                        try {
                            a(b)
                        } catch (c) {
                            f(c)
                        }
                    })
                },
                $observe: function(a, b) {
                    var c = this,
                        d = c.$$observers || (c.$$observers = ga()),
                        e = d[a] || (d[a] = []);
                    return e.push(b), y.$evalAsync(function() {
                            e.$$inter || !c.hasOwnProperty(a) || q(c[a]) || b(c[a])
                        }),
                        function() {
                            G(e, b)
                        }
                }
            };
            var Aa = c.startSymbol(),
                Ba = c.endSymbol(),
                Ca = "{{" === Aa && "}}" === Ba ? n : function(a) {
                    return a.replace(/\{\{/g, Aa).replace(/}}/g, Ba)
                },
                Da = /^ngAttr[A-Z]/,
                Fa = /^(.+)Start$/;
            return R.$$addBindingInfo = z ? function(a, b) {
                var c = a.data("$binding") || [];
                jd(b) ? c = c.concat(b) : c.push(b), a.data("$binding", c)
            } : m, R.$$addBindingClass = z ? function(a) {
                P(a, "ng-binding")
            } : m, R.$$addScopeInfo = z ? function(a, b, c, d) {
                a.data(c ? d ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope", b)
            } : m, R.$$addScopeClass = z ? function(a, b) {
                P(a, b ? "ng-isolate-scope" : "ng-scope")
            } : m, R.$$createComment = function(b, c) {
                var d = "";
                return z && (d = " " + (b || "") + ": ", c && (d += c + " ")), a.document.createComment(d)
            }, R
        }]
    }

    function Xa(a, b) {
        this.previousValue = a, this.currentValue = b
    }

    function Ya(a) {
        return ka(a.replace(ae, ""))
    }

    function Za(a, b) {
        var c = "",
            d = a.split(/\s+/),
            e = b.split(/\s+/),
            f = 0;
        a: for (; f < d.length; f++) {
            for (var g = d[f], h = 0; h < e.length; h++)
                if (g === e[h]) continue a;
            c += (0 < c.length ? " " : "") + g
        }
        return c
    }

    function $a(a) {
        a = Vc(a);
        var b = a.length;
        if (1 >= b) return a;
        for (; b--;) 8 === a[b].nodeType && bd.call(a, b, 1);
        return a
    }

    function _a(a, b) {
        if (b && u(b)) return b;
        if (u(a)) {
            var c = ce.exec(a);
            if (c) return c[3]
        }
    }

    function ab() {
        var a = {},
            c = !1;
        this.has = function(b) {
            return a.hasOwnProperty(b)
        }, this.register = function(b, c) {
            da(b, "controller"), s(b) ? i(a, b) : a[b] = c
        }, this.allowGlobals = function() {
            c = !0
        }, this.$get = ["$injector", "$window", function(d, e) {
            function f(a, c, d, e) {
                if (!a || !s(a.$scope)) throw b("$controller")("noscp", e, c);
                a.$scope[c] = d
            }
            return function(b, g, h, j) {
                var k, l, m;
                if (h = !0 === h, j && u(j) && (m = j), u(b)) {
                    if (j = b.match(ce), !j) throw be("ctrlfmt", b);
                    l = j[1], m = m || j[3], b = a.hasOwnProperty(l) ? a[l] : ea(g.$scope, l, !0) || (c ? ea(e, l, !0) : void 0), ca(b, l, !0)
                }
                return h ? (h = (jd(b) ? b[b.length - 1] : b).prototype, k = Object.create(h || null), m && f(g, m, k, l || b.name), i(function() {
                    var a = d.invoke(b, k, g, l);
                    return a !== k && (s(a) || x(a)) && (k = a, m && f(g, m, k, l || b.name)), k
                }, {
                    instance: k,
                    identifier: m
                })) : (k = d.instantiate(b, g, l), m && f(g, m, k, l || b.name), k)
            }
        }]
    }

    function bb() {
        this.$get = ["$window", function(a) {
            return Vc(a.document)
        }]
    }

    function cb() {
        this.$get = ["$log", function(a) {
            return function(b, c) {
                a.error.apply(a, arguments)
            }
        }]
    }

    function db(a) {
        return s(a) ? w(a) ? a.toISOString() : M(a) : a
    }

    function eb() {
        this.$get = function() {
            return function(a) {
                if (!a) return "";
                var b = [];
                return e(a, function(a, c) {
                    null === a || q(a) || (jd(a) ? d(a, function(a) {
                        b.push(V(c) + "=" + V(db(a)))
                    }) : b.push(V(c) + "=" + V(db(a))))
                }), b.join("&")
            }
        }
    }

    function fb() {
        this.$get = function() {
            return function(a) {
                function b(a, f, g) {
                    null === a || q(a) || (jd(a) ? d(a, function(a, c) {
                        b(a, f + "[" + (s(a) ? c : "") + "]")
                    }) : s(a) && !w(a) ? e(a, function(a, c) {
                        b(a, f + (g ? "" : "[") + c + (g ? "" : "]"))
                    }) : c.push(V(f) + "=" + V(db(a))))
                }
                if (!a) return "";
                var c = [];
                return b(a, "", !0), c.join("&")
            }
        }
    }

    function gb(a, b) {
        if (u(a)) {
            var c = a.replace(ie, "").trim();
            if (c) {
                var d = b("Content-Type");
                (d = d && 0 === d.indexOf(ee)) || (d = (d = c.match(ge)) && he[d[0]].test(c)), d && (a = N(c))
            }
        }
        return a
    }

    function hb(a) {
        var b, c = ga();
        return u(a) ? d(a.split("\n"), function(a) {
            b = a.indexOf(":");
            var d = $c(ld(a.substr(0, b)));
            a = ld(a.substr(b + 1)), d && (c[d] = c[d] ? c[d] + ", " + a : a)
        }) : s(a) && d(a, function(a, b) {
            var d = $c(b),
                e = ld(a);
            d && (c[d] = c[d] ? c[d] + ", " + e : e)
        }), c
    }

    function ib(a) {
        var b;
        return function(c) {
            return b || (b = hb(a)), c ? (c = b[$c(c)], void 0 === c && (c = null), c) : b
        }
    }

    function jb(a, b, c, e) {
        return x(e) ? e(a, b, c) : (d(e, function(d) {
            a = d(a, b, c)
        }), a)
    }

    function kb() {
        var a = this.defaults = {
                transformResponse: [gb],
                transformRequest: [function(a) {
                    return s(a) && "[object File]" !== dd.call(a) && "[object Blob]" !== dd.call(a) && "[object FormData]" !== dd.call(a) ? M(a) : a
                }],
                headers: {
                    common: {
                        Accept: "application/json, text/plain, */*"
                    },
                    post: ia(fe),
                    put: ia(fe),
                    patch: ia(fe)
                },
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                paramSerializer: "$httpParamSerializer"
            },
            c = !1;
        this.useApplyAsync = function(a) {
            return r(a) ? (c = !!a, this) : c
        };
        var e = !0;
        this.useLegacyPromiseExtensions = function(a) {
            return r(a) ? (e = !!a, this) : e
        };
        var f = this.interceptors = [];
        this.$get = ["$httpBackend", "$$cookieReader", "$cacheFactory", "$rootScope", "$q", "$injector", function(g, h, j, k, l, m) {
            function n(c) {
                function f(a, b) {
                    for (var c = 0, d = b.length; c < d;) {
                        var e = b[c++],
                            f = b[c++];
                        a = a.then(e, f)
                    }
                    return b.length = 0, a
                }

                function g(a, b) {
                    var c, e = {};
                    return d(a, function(a, d) {
                        x(a) ? (c = a(b), null != c && (e[d] = c)) : e[d] = a
                    }), e
                }

                function h(a) {
                    var b = i({}, a);
                    return b.data = jb(a.data, a.headers, a.status, j.transformResponse), a = a.status, 200 <= a && 300 > a ? b : l.reject(b)
                }
                if (!s(c)) throw b("$http")("badreq", c);
                if (!u(c.url)) throw b("$http")("badreq", c.url);
                var j = i({
                    method: "get",
                    transformRequest: a.transformRequest,
                    transformResponse: a.transformResponse,
                    paramSerializer: a.paramSerializer
                }, c);
                j.headers = function(b) {
                    var c, d, e, f = a.headers,
                        h = i({}, b.headers),
                        f = i({}, f.common, f[$c(b.method)]);
                    a: for (c in f) {
                        d = $c(c);
                        for (e in h)
                            if ($c(e) === d) continue a;
                        h[c] = f[c]
                    }
                    return g(h, ia(b))
                }(c), j.method = _c(j.method), j.paramSerializer = u(j.paramSerializer) ? m.get(j.paramSerializer) : j.paramSerializer;
                var k = [],
                    n = [],
                    p = l.when(j);
                return d(v, function(a) {
                    (a.request || a.requestError) && k.unshift(a.request, a.requestError), (a.response || a.responseError) && n.push(a.response, a.responseError)
                }), p = f(p, k), p = p.then(function(b) {
                    var c = b.headers,
                        e = jb(b.data, ib(c), void 0, b.transformRequest);
                    return q(e) && d(c, function(a, b) {
                        "content-type" === $c(b) && delete c[b]
                    }), q(b.withCredentials) && !q(a.withCredentials) && (b.withCredentials = a.withCredentials), o(b, e).then(h, h)
                }), p = f(p, n), e ? (p.success = function(a) {
                    return ca(a, "fn"), p.then(function(b) {
                        a(b.data, b.status, b.headers, j)
                    }), p
                }, p.error = function(a) {
                    return ca(a, "fn"), p.then(null, function(b) {
                        a(b.data, b.status, b.headers, j)
                    }), p
                }) : (p.success = ke("success"), p.error = ke("error")), p
            }

            function o(b, e) {
                function f(a) {
                    if (a) {
                        var b = {};
                        return d(a, function(a, d) {
                            b[d] = function(b) {
                                function d() {
                                    a(b)
                                }
                                c ? k.$applyAsync(d) : k.$$phase ? d() : k.$apply(d)
                            }
                        }), b
                    }
                }

                function i(a, b, d, e) {
                    function f() {
                        j(b, a, d, e)
                    }
                    u && (200 <= a && 300 > a ? u.put(A, [a, b, hb(d), e]) : u.remove(A)), c ? k.$applyAsync(f) : (f(), k.$$phase || k.$apply())
                }

                function j(a, c, d, e) {
                    c = -1 <= c ? c : 0, (200 <= c && 300 > c ? w.resolve : w.reject)({
                        data: a,
                        status: c,
                        headers: ib(d),
                        config: b,
                        statusText: e
                    })
                }

                function m(a) {
                    j(a.data, a.status, ia(a.headers()), a.statusText)
                }

                function o() {
                    var a = n.pendingRequests.indexOf(b); - 1 !== a && n.pendingRequests.splice(a, 1)
                }
                var u, v, w = l.defer(),
                    y = w.promise,
                    z = b.headers,
                    A = p(b.url, b.paramSerializer(b.params));
                return n.pendingRequests.push(b), y.then(o, o), !b.cache && !a.cache || !1 === b.cache || "GET" !== b.method && "JSONP" !== b.method || (u = s(b.cache) ? b.cache : s(a.cache) ? a.cache : t), u && (v = u.get(A), r(v) ? v && x(v.then) ? v.then(m, m) : jd(v) ? j(v[1], v[0], ia(v[2]), v[3]) : j(v, 200, {}, "OK") : u.put(A, y)), q(v) && ((v = hc(b.url) ? h()[b.xsrfCookieName || a.xsrfCookieName] : void 0) && (z[b.xsrfHeaderName || a.xsrfHeaderName] = v), g(b.method, A, e, i, z, b.timeout, b.withCredentials, b.responseType, f(b.eventHandlers), f(b.uploadEventHandlers))), y
            }

            function p(a, b) {
                return 0 < b.length && (a += (-1 === a.indexOf("?") ? "?" : "&") + b), a
            }
            var t = j("$http");
            a.paramSerializer = u(a.paramSerializer) ? m.get(a.paramSerializer) : a.paramSerializer;
            var v = [];
            return d(f, function(a) {
                    v.unshift(u(a) ? m.get(a) : m.invoke(a))
                }), n.pendingRequests = [],
                function(a) {
                    d(arguments, function(a) {
                        n[a] = function(b, c) {
                            return n(i({}, c || {}, {
                                method: a,
                                url: b
                            }))
                        }
                    })
                }("get", "delete", "head", "jsonp"),
                function(a) {
                    d(arguments, function(a) {
                        n[a] = function(b, c, d) {
                            return n(i({}, d || {}, {
                                method: a,
                                url: b,
                                data: c
                            }))
                        }
                    })
                }("post", "put", "patch"), n.defaults = a, n
        }]
    }

    function lb() {
        this.$get = function() {
            return function() {
                return new a.XMLHttpRequest
            }
        }
    }

    function mb() {
        this.$get = ["$browser", "$jsonpCallbacks", "$document", "$xhrFactory", function(a, b, c, d) {
            return nb(a, d, a.defer, b, c[0])
        }]
    }

    function nb(a, b, c, e, f) {
        function g(a, b, c) {
            a = a.replace("JSON_CALLBACK", b);
            var d = f.createElement("script"),
                g = null;
            return d.type = "text/javascript", d.src = a, d.async = !0, g = function(a) {
                d.removeEventListener("load", g, !1), d.removeEventListener("error", g, !1), f.body.removeChild(d), d = null;
                var h = -1,
                    i = "unknown";
                a && ("load" !== a.type || e.wasCalled(b) || (a = {
                    type: "error"
                }), i = a.type, h = "error" === a.type ? 404 : 200), c && c(h, i)
            }, d.addEventListener("load", g, !1), d.addEventListener("error", g, !1), f.body.appendChild(d), g
        }
        return function(f, h, i, j, k, l, n, o, p, s) {
            function t() {
                w && w(), y && y.abort()
            }

            function u(b, d, e, f, g) {
                r(A) && c.cancel(A), w = y = null, b(d, e, f, g), a.$$completeOutstandingRequest(m)
            }
            if (a.$$incOutstandingRequestCount(), h = h || a.url(), "jsonp" === $c(f)) var v = e.createCallback(h),
                w = g(h, v, function(a, b) {
                    var c = 200 === a && e.getResponse(v);
                    u(j, a, c, "", b), e.removeCallback(v)
                });
            else {
                var y = b(f, h);
                if (y.open(f, h, !0), d(k, function(a, b) {
                        r(a) && y.setRequestHeader(b, a)
                    }), y.onload = function() {
                        var a = y.statusText || "",
                            b = "response" in y ? y.response : y.responseText,
                            c = 1223 === y.status ? 204 : y.status;
                        0 === c && (c = b ? 200 : "file" === gc(h).protocol ? 404 : 0), u(j, c, b, y.getAllResponseHeaders(), a)
                    }, f = function() {
                        u(j, -1, null, null, "")
                    }, y.onerror = f, y.onabort = f, y.ontimeout = f, d(p, function(a, b) {
                        y.addEventListener(b, a)
                    }), d(s, function(a, b) {
                        y.upload.addEventListener(b, a)
                    }), n && (y.withCredentials = !0), o) try {
                    y.responseType = o
                } catch (z) {
                    if ("json" !== o) throw z
                }
                console.trace();
                y.send(q(i) ? null : i)
            }
            if (0 < l) var A = c(t, l);
            else l && x(l.then) && l.then(t)
        }
    }

    function ob() {
        var a = "{{",
            b = "}}";
        this.startSymbol = function(b) {
            return b ? (a = b, this) : a
        }, this.endSymbol = function(a) {
            return a ? (b = a, this) : b
        }, this.$get = ["$parse", "$exceptionHandler", "$sce", function(c, d, e) {
            function f(a) {
                return "\\\\\\" + a
            }

            function g(c) {
                return c.replace(m, a).replace(n, b)
            }

            function h(a, b, c, d) {
                var e = a.$watch(function(a) {
                    return e(), d(a)
                }, b, c);
                return e
            }

            function j(f, j, m, n) {
                function p(a) {
                    try {
                        var b = a;
                        a = m ? e.getTrusted(m, b) : e.valueOf(b);
                        var c;
                        if (n && !r(a)) c = a;
                        else if (null == a) c = "";
                        else {
                            switch (typeof a) {
                                case "string":
                                    break;
                                case "number":
                                    a = "" + a;
                                    break;
                                default:
                                    a = M(a)
                            }
                            c = a
                        }
                        return c
                    } catch (g) {
                        d(le.interr(f, g))
                    }
                }
                if (!f.length || -1 === f.indexOf(a)) {
                    var s;
                    return j || (j = g(f), s = o(j), s.exp = f, s.expressions = [], s.$$watchDelegate = h), s
                }
                n = !!n;
                var t, u, v = 0,
                    w = [],
                    y = [];
                s = f.length;
                for (var z = [], A = []; v < s;) {
                    if (-1 === (t = f.indexOf(a, v)) || -1 === (u = f.indexOf(b, t + k))) {
                        v !== s && z.push(g(f.substring(v)));
                        break
                    }
                    v !== t && z.push(g(f.substring(v, t))), v = f.substring(t + k, u), w.push(v), y.push(c(v, p)), v = u + l, A.push(z.length), z.push("")
                }
                if (m && 1 < z.length && le.throwNoconcat(f), !j || w.length) {
                    var B = function(a) {
                        for (var b = 0, c = w.length; b < c; b++) {
                            if (n && q(a[b])) return;
                            z[A[b]] = a[b]
                        }
                        return z.join("")
                    };
                    return i(function(a) {
                        var b = 0,
                            c = w.length,
                            e = Array(c);
                        try {
                            for (; b < c; b++) e[b] = y[b](a);
                            return B(e)
                        } catch (g) {
                            d(le.interr(f, g))
                        }
                    }, {
                        exp: f,
                        expressions: w,
                        $$watchDelegate: function(a, b) {
                            var c;
                            return a.$watchGroup(y, function(d, e) {
                                var f = B(d);
                                x(b) && b.call(this, f, d !== e ? c : f, a), c = f
                            })
                        }
                    })
                }
            }
            var k = a.length,
                l = b.length,
                m = new RegExp(a.replace(/./g, f), "g"),
                n = new RegExp(b.replace(/./g, f), "g");
            return j.startSymbol = function() {
                return a
            }, j.endSymbol = function() {
                return b
            }, j
        }]
    }

    function pb() {
        this.$get = ["$rootScope", "$window", "$q", "$$q", "$browser", function(a, b, c, d, e) {
            function f(f, h, i, j) {
                function k() {
                    l ? f.apply(null, m) : f(p)
                }
                var l = 4 < arguments.length,
                    m = l ? ad.call(arguments, 4) : [],
                    n = b.setInterval,
                    o = b.clearInterval,
                    p = 0,
                    q = r(j) && !j,
                    s = (q ? d : c).defer(),
                    t = s.promise;
                return i = r(i) ? i : 0, t.$$intervalId = n(function() {
                    q ? e.defer(k) : a.$evalAsync(k), s.notify(p++), 0 < i && p >= i && (s.resolve(p), o(t.$$intervalId), delete g[t.$$intervalId]), q || a.$apply()
                }, h), g[t.$$intervalId] = s, t
            }
            var g = {};
            return f.cancel = function(a) {
                return !!(a && a.$$intervalId in g) && (g[a.$$intervalId].reject("canceled"), b.clearInterval(a.$$intervalId), delete g[a.$$intervalId], !0)
            }, f
        }]
    }

    function qb(a) {
        a = a.split("/");
        for (var b = a.length; b--;) a[b] = U(a[b]);
        return a.join("/")
    }

    function rb(a, b) {
        var c = gc(a);
        b.$$protocol = c.protocol, b.$$host = c.hostname, b.$$port = k(c.port) || oe[c.protocol] || null
    }

    function sb(a, b) {
        if (qe.test(a)) throw pe("badpath", a);
        var c = "/" !== a.charAt(0);
        c && (a = "/" + a);
        var d = gc(a);
        b.$$path = decodeURIComponent(c && "/" === d.pathname.charAt(0) ? d.pathname.substring(1) : d.pathname), b.$$search = S(d.search), b.$$hash = decodeURIComponent(d.hash), b.$$path && "/" !== b.$$path.charAt(0) && (b.$$path = "/" + b.$$path)
    }

    function tb(a, b) {
        if (0 === b.lastIndexOf(a, 0)) return b.substr(a.length)
    }

    function ub(a) {
        var b = a.indexOf("#");
        return -1 === b ? a : a.substr(0, b)
    }

    function vb(a) {
        return a.replace(/(#.+)|#$/, "$1")
    }

    function wb(a, b, c) {
        this.$$html5 = !0, c = c || "", rb(a, this), this.$$parse = function(a) {
            var c = tb(b, a);
            if (!u(c)) throw pe("ipthprfx", a, b);
            sb(c, this), this.$$path || (this.$$path = "/"), this.$$compose()
        }, this.$$compose = function() {
            var a = T(this.$$search),
                c = this.$$hash ? "#" + U(this.$$hash) : "";
            this.$$url = qb(this.$$path) + (a ? "?" + a : "") + c, this.$$absUrl = b + this.$$url.substr(1)
        }, this.$$parseLinkUrl = function(d, e) {
            if (e && "#" === e[0]) return this.hash(e.slice(1)), !0;
            var f, g;
            return r(f = tb(a, d)) ? (g = f, g = c && r(f = tb(c, f)) ? b + (tb("/", f) || f) : a + g) : r(f = tb(b, d)) ? g = b + f : b === d + "/" && (g = b), g && this.$$parse(g), !!g
        }
    }

    function xb(a, b, c) {
        rb(a, this), this.$$parse = function(d) {
            var e, f = tb(a, d) || tb(b, d);
            q(f) || "#" !== f.charAt(0) ? this.$$html5 ? e = f : (e = "", q(f) && (a = d, this.replace())) : (e = tb(c, f), q(e) && (e = f)), sb(e, this), d = this.$$path;
            var f = a,
                g = /^\/[A-Z]:(\/.*)/;
            0 === e.lastIndexOf(f, 0) && (e = e.replace(f, "")), g.exec(e) || (d = (e = g.exec(d)) ? e[1] : d), this.$$path = d, this.$$compose()
        }, this.$$compose = function() {
            var b = T(this.$$search),
                d = this.$$hash ? "#" + U(this.$$hash) : "";
            this.$$url = qb(this.$$path) + (b ? "?" + b : "") + d, this.$$absUrl = a + (this.$$url ? c + this.$$url : "")
        }, this.$$parseLinkUrl = function(b, c) {
            return ub(a) === ub(b) && (this.$$parse(b), !0)
        }
    }

    function yb(a, b, c) {
        this.$$html5 = !0, xb.apply(this, arguments), this.$$parseLinkUrl = function(d, e) {
            if (e && "#" === e[0]) return this.hash(e.slice(1)), !0;
            var f, g;
            return a === ub(d) ? f = d : (g = tb(b, d)) ? f = a + c + g : b === d + "/" && (f = b), f && this.$$parse(f), !!f
        }, this.$$compose = function() {
            var b = T(this.$$search),
                d = this.$$hash ? "#" + U(this.$$hash) : "";
            this.$$url = qb(this.$$path) + (b ? "?" + b : "") + d, this.$$absUrl = a + c + this.$$url
        }
    }

    function zb(a) {
        return function() {
            return this[a]
        }
    }

    function Ab(a, b) {
        return function(c) {
            return q(c) ? this[a] : (this[a] = b(c), this.$$compose(), this)
        }
    }

    function Bb() {
        var a = "",
            b = {
                enabled: !1,
                requireBase: !0,
                rewriteLinks: !0
            };
        this.hashPrefix = function(b) {
            return r(b) ? (a = b, this) : a
        }, this.html5Mode = function(a) {
            return B(a) ? (b.enabled = a, this) : s(a) ? (B(a.enabled) && (b.enabled = a.enabled), B(a.requireBase) && (b.requireBase = a.requireBase), B(a.rewriteLinks) && (b.rewriteLinks = a.rewriteLinks), this) : b
        }, this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function(c, d, e, f, g) {
            function h(a, b, c) {
                var e = j.url(),
                    f = j.$$state;
                try {
                    d.url(a, b, c), j.$$state = d.state()
                } catch (g) {
                    throw j.url(e), j.$$state = f, g
                }
            }

            function i(a, b) {
                c.$broadcast("$locationChangeSuccess", j.absUrl(), a, j.$$state, b)
            }
            var j, k;
            k = d.baseHref();
            var l, m = d.url();
            if (b.enabled) {
                if (!k && b.requireBase) throw pe("nobase");
                l = m.substring(0, m.indexOf("/", m.indexOf("//") + 2)) + (k || "/"), k = e.history ? wb : yb
            } else l = ub(m), k = xb;
            var n = l.substr(0, ub(l).lastIndexOf("/") + 1);
            j = new k(l, n, "#" + a), j.$$parseLinkUrl(m, m), j.$$state = d.state();
            var o = /^\s*(javascript|mailto):/i;
            f.on("click", function(a) {
                if (b.rewriteLinks && !a.ctrlKey && !a.metaKey && !a.shiftKey && 2 !== a.which && 2 !== a.button) {
                    for (var e = Vc(a.target);
                        "a" !== F(e[0]);)
                        if (e[0] === f[0] || !(e = e.parent())[0]) return;
                    var h = e.prop("href"),
                        i = e.attr("href") || e.attr("xlink:href");
                    s(h) && "[object SVGAnimatedString]" === h.toString() && (h = gc(h.animVal).href), o.test(h) || !h || e.attr("target") || a.isDefaultPrevented() || !j.$$parseLinkUrl(h, i) || (a.preventDefault(), j.absUrl() !== d.url() && (c.$apply(), g.angular["ff-684208-preventDefault"] = !0))
                }
            }), vb(j.absUrl()) !== vb(m) && d.url(j.absUrl(), !0);
            var p = !0;
            return d.onUrlChange(function(a, b) {
                q(tb(n, a)) ? g.location.href = a : (c.$evalAsync(function() {
                    var d, e = j.absUrl(),
                        f = j.$$state;
                    a = vb(a), j.$$parse(a), j.$$state = b, d = c.$broadcast("$locationChangeStart", a, e, b, f).defaultPrevented, j.absUrl() === a && (d ? (j.$$parse(e), j.$$state = f, h(e, !1, f)) : (p = !1, i(e, f)))
                }), c.$$phase || c.$digest())
            }), c.$watch(function() {
                var a = vb(d.url()),
                    b = vb(j.absUrl()),
                    f = d.state(),
                    g = j.$$replace,
                    k = a !== b || j.$$html5 && e.history && f !== j.$$state;
                (p || k) && (p = !1, c.$evalAsync(function() {
                    var b = j.absUrl(),
                        d = c.$broadcast("$locationChangeStart", b, a, j.$$state, f).defaultPrevented;
                    j.absUrl() === b && (d ? (j.$$parse(a), j.$$state = f) : (k && h(b, g, f === j.$$state ? null : j.$$state), i(a, f)))
                })), j.$$replace = !1
            }), j
        }]
    }

    function Cb() {
        var a = !0,
            b = this;
        this.debugEnabled = function(b) {
            return r(b) ? (a = b, this) : a
        }, this.$get = ["$window", function(c) {
            function e(a) {
                return a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line)), a
            }

            function f(a) {
                var b = c.console || {},
                    f = b[a] || b.log || m;
                a = !1;
                try {
                    a = !!f.apply
                } catch (g) {}
                return a ? function() {
                    var a = [];
                    return d(arguments, function(b) {
                        a.push(e(b))
                    }), f.apply(b, a)
                } : function(a, b) {
                    f(a, null == b ? "" : b)
                }
            }
            return {
                log: f("log"),
                info: f("info"),
                warn: f("warn"),
                error: f("error"),
                debug: function() {
                    var c = f("debug");
                    return function() {
                        a && c.apply(b, arguments)
                    }
                }()
            }
        }]
    }

    function Db(a, b) {
        if ("__defineGetter__" === a || "__defineSetter__" === a || "__lookupGetter__" === a || "__lookupSetter__" === a || "__proto__" === a) throw se("isecfld", b);
        return a
    }

    function Eb(a) {
        return a + ""
    }

    function Fb(a, b) {
        if (a) {
            if (a.constructor === a) throw se("isecfn", b);
            if (a.window === a) throw se("isecwindow", b);
            if (a.children && (a.nodeName || a.prop && a.attr && a.find)) throw se("isecdom", b);
            if (a === Object) throw se("isecobj", b)
        }
        return a
    }

    function Gb(a, b) {
        if (a) {
            if (a.constructor === a) throw se("isecfn", b);
            if (a === Fe || a === Ge || a === He) throw se("isecff", b)
        }
    }

    function Hb(a, b) {
        if (a && (a === te || a === ue || a === ve || a === we || a === xe || a === ye || a === ze || a === Ae || a === Be || a === Ce || a === De || a === Ee)) throw se("isecaf", b)
    }

    function Ib(a, b) {
        return "undefined" != typeof a ? a : b
    }

    function Jb(a, b) {
        return "undefined" == typeof a ? b : "undefined" == typeof b ? a : a + b
    }

    function Kb(a, b) {
        var c, e, f;
        switch (a.type) {
            case Me.Program:
                c = !0, d(a.body, function(a) {
                    Kb(a.expression, b), c = c && a.expression.constant
                }), a.constant = c;
                break;
            case Me.Literal:
                a.constant = !0, a.toWatch = [];
                break;
            case Me.UnaryExpression:
                Kb(a.argument, b), a.constant = a.argument.constant, a.toWatch = a.argument.toWatch;
                break;
            case Me.BinaryExpression:
                Kb(a.left, b), Kb(a.right, b), a.constant = a.left.constant && a.right.constant, a.toWatch = a.left.toWatch.concat(a.right.toWatch);
                break;
            case Me.LogicalExpression:
                Kb(a.left, b), Kb(a.right, b), a.constant = a.left.constant && a.right.constant, a.toWatch = a.constant ? [] : [a];
                break;
            case Me.ConditionalExpression:
                Kb(a.test, b), Kb(a.alternate, b), Kb(a.consequent, b), a.constant = a.test.constant && a.alternate.constant && a.consequent.constant, a.toWatch = a.constant ? [] : [a];
                break;
            case Me.Identifier:
                a.constant = !1, a.toWatch = [a];
                break;
            case Me.MemberExpression:
                Kb(a.object, b), a.computed && Kb(a.property, b), a.constant = a.object.constant && (!a.computed || a.property.constant), a.toWatch = [a];
                break;
            case Me.CallExpression:
                c = f = !!a.filter && !b(a.callee.name).$stateful, e = [], d(a.arguments, function(a) {
                    Kb(a, b), c = c && a.constant, a.constant || e.push.apply(e, a.toWatch)
                }), a.constant = c, a.toWatch = f ? e : [a];
                break;
            case Me.AssignmentExpression:
                Kb(a.left, b), Kb(a.right, b), a.constant = a.left.constant && a.right.constant, a.toWatch = [a];
                break;
            case Me.ArrayExpression:
                c = !0, e = [], d(a.elements, function(a) {
                    Kb(a, b), c = c && a.constant, a.constant || e.push.apply(e, a.toWatch)
                }), a.constant = c, a.toWatch = e;
                break;
            case Me.ObjectExpression:
                c = !0, e = [], d(a.properties, function(a) {
                    Kb(a.value, b), c = c && a.value.constant && !a.computed, a.value.constant || e.push.apply(e, a.value.toWatch)
                }), a.constant = c, a.toWatch = e;
                break;
            case Me.ThisExpression:
                a.constant = !1, a.toWatch = [];
                break;
            case Me.LocalsExpression:
                a.constant = !1, a.toWatch = []
        }
    }

    function Lb(a) {
        if (1 === a.length) {
            a = a[0].expression;
            var b = a.toWatch;
            return 1 !== b.length ? b : b[0] !== a ? b : void 0
        }
    }

    function Mb(a) {
        return a.type === Me.Identifier || a.type === Me.MemberExpression
    }

    function Nb(a) {
        if (1 === a.body.length && Mb(a.body[0].expression)) return {
            type: Me.AssignmentExpression,
            left: a.body[0].expression,
            right: {
                type: Me.NGValueParameter
            },
            operator: "="
        }
    }

    function Ob(a) {
        return 0 === a.body.length || 1 === a.body.length && (a.body[0].expression.type === Me.Literal || a.body[0].expression.type === Me.ArrayExpression || a.body[0].expression.type === Me.ObjectExpression)
    }

    function Pb(a, b) {
        this.astBuilder = a, this.$filter = b
    }

    function Qb(a, b) {
        this.astBuilder = a, this.$filter = b
    }

    function Rb(a) {
        return "constructor" === a
    }

    function Sb(a) {
        return x(a.valueOf) ? a.valueOf() : Ie.call(a)
    }

    function Tb() {
        var a, b, c = ga(),
            e = ga(),
            f = {
                "true": !0,
                "false": !1,
                "null": null,
                undefined: void 0
            };
        this.addLiteral = function(a, b) {
            f[a] = b
        }, this.setIdentifierFns = function(c, d) {
            return a = c, b = d, this
        }, this.$get = ["$filter", function(g) {
            function h(a, b, d) {
                var f, h, j;
                switch (d = d || u, typeof a) {
                    case "string":
                        j = a = a.trim();
                        var q = d ? e : c;
                        if (f = q[j], !f) {
                            ":" === a.charAt(0) && ":" === a.charAt(1) && (h = !0, a = a.substring(2)), f = d ? t : s;
                            var r = new Le(f);
                            f = new Ne(r, g, f).parse(a), f.constant ? f.$$watchDelegate = o : h ? f.$$watchDelegate = f.literal ? n : l : f.inputs && (f.$$watchDelegate = k), d && (f = i(f)), q[j] = f
                        }
                        return p(f, b);
                    case "function":
                        return p(a, b);
                    default:
                        return p(m, b)
                }
            }

            function i(a) {
                function b(b, c, d, e) {
                    var f = u;
                    u = !0;
                    try {
                        return a(b, c, d, e)
                    } finally {
                        u = f
                    }
                }
                if (!a) return a;
                b.$$watchDelegate = a.$$watchDelegate, b.assign = i(a.assign), b.constant = a.constant, b.literal = a.literal;
                for (var c = 0; a.inputs && c < a.inputs.length; ++c) a.inputs[c] = i(a.inputs[c]);
                return b.inputs = a.inputs, b
            }

            function j(a, b) {
                return null == a || null == b ? a === b : ("object" != typeof a || (a = Sb(a), "object" != typeof a)) && (a === b || a !== a && b !== b)
            }

            function k(a, b, c, d, e) {
                var f, g = d.inputs;
                if (1 === g.length) {
                    var h = j,
                        g = g[0];
                    return a.$watch(function(a) {
                        var b = g(a);
                        return j(b, h) || (f = d(a, void 0, void 0, [b]), h = b && Sb(b)), f
                    }, b, c, e)
                }
                for (var i = [], k = [], l = 0, m = g.length; l < m; l++) i[l] = j, k[l] = null;
                return a.$watch(function(a) {
                    for (var b = !1, c = 0, e = g.length; c < e; c++) {
                        var h = g[c](a);
                        (b || (b = !j(h, i[c]))) && (k[c] = h, i[c] = h && Sb(h))
                    }
                    return b && (f = d(a, void 0, void 0, k)), f
                }, b, c, e)
            }

            function l(a, b, c, d) {
                var e, f;
                return e = a.$watch(function(a) {
                    return d(a)
                }, function(a, c, d) {
                    f = a, x(b) && b.apply(this, arguments), r(a) && d.$$postDigest(function() {
                        r(f) && e()
                    })
                }, c)
            }

            function n(a, b, c, e) {
                function f(a) {
                    var b = !0;
                    return d(a, function(a) {
                        r(a) || (b = !1)
                    }), b
                }
                var g, h;
                return g = a.$watch(function(a) {
                    return e(a)
                }, function(a, c, d) {
                    h = a, x(b) && b.call(this, a, c, d), f(a) && d.$$postDigest(function() {
                        f(h) && g()
                    })
                }, c)
            }

            function o(a, b, c, d) {
                var e = a.$watch(function(a) {
                    return e(), d(a)
                }, b, c);
                return e
            }

            function p(a, b) {
                if (!b) return a;
                var c = a.$$watchDelegate,
                    d = !1,
                    c = c !== n && c !== l ? function(c, e, f, g) {
                        return f = d && g ? g[0] : a(c, e, f, g), b(f, c, e)
                    } : function(c, d, e, f) {
                        return e = a(c, d, e, f), c = b(e, c, d), r(e) ? c : e
                    };
                return a.$$watchDelegate && a.$$watchDelegate !== k ? c.$$watchDelegate = a.$$watchDelegate : b.$stateful || (c.$$watchDelegate = k, d = !a.inputs, c.inputs = a.inputs ? a.inputs : [a]), c
            }
            var q = nd().noUnsafeEval,
                s = {
                    csp: q,
                    expensiveChecks: !1,
                    literals: H(f),
                    isIdentifierStart: x(a) && a,
                    isIdentifierContinue: x(b) && b
                },
                t = {
                    csp: q,
                    expensiveChecks: !0,
                    literals: H(f),
                    isIdentifierStart: x(a) && a,
                    isIdentifierContinue: x(b) && b
                },
                u = !1;
            return h.$$runningExpensiveChecks = function() {
                return u
            }, h
        }]
    }

    function Ub() {
        this.$get = ["$rootScope", "$exceptionHandler", function(a, b) {
            return Wb(function(b) {
                a.$evalAsync(b)
            }, b)
        }]
    }

    function Vb() {
        this.$get = ["$browser", "$exceptionHandler", function(a, b) {
            return Wb(function(b) {
                a.defer(b)
            }, b)
        }]
    }

    function Wb(a, c) {
        function e() {
            this.$$state = {
                status: 0
            }
        }

        function f(a, b) {
            return function(c) {
                b.call(a, c)
            }
        }

        function g(b) {
            !b.processScheduled && b.pending && (b.processScheduled = !0, a(function() {
                var a, d, e;
                e = b.pending, b.processScheduled = !1, b.pending = void 0;
                for (var f = 0, g = e.length; f < g; ++f) {
                    d = e[f][0], a = e[f][b.status];
                    try {
                        x(a) ? d.resolve(a(b.value)) : 1 === b.status ? d.resolve(b.value) : d.reject(b.value)
                    } catch (h) {
                        d.reject(h), c(h)
                    }
                }
            }))
        }

        function h() {
            this.promise = new e
        }
        var j = b("$q", TypeError),
            k = function() {
                var a = new h;
                return a.resolve = f(a, a.resolve), a.reject = f(a, a.reject), a.notify = f(a, a.notify), a
            };
        i(e.prototype, {
            then: function(a, b, c) {
                if (q(a) && q(b) && q(c)) return this;
                var d = new h;
                return this.$$state.pending = this.$$state.pending || [], this.$$state.pending.push([d, a, b, c]), 0 < this.$$state.status && g(this.$$state), d.promise
            },
            "catch": function(a) {
                return this.then(null, a)
            },
            "finally": function(a, b) {
                return this.then(function(b) {
                    return m(b, !0, a)
                }, function(b) {
                    return m(b, !1, a)
                }, b)
            }
        }), i(h.prototype, {
            resolve: function(a) {
                this.promise.$$state.status || (a === this.promise ? this.$$reject(j("qcycle", a)) : this.$$resolve(a))
            },
            $$resolve: function(a) {
                function b(a) {
                    i || (i = !0, h.$$resolve(a))
                }

                function d(a) {
                    i || (i = !0, h.$$reject(a))
                }
                var e, h = this,
                    i = !1;
                try {
                    (s(a) || x(a)) && (e = a && a.then), x(e) ? (this.promise.$$state.status = -1, e.call(a, b, d, f(this, this.notify))) : (this.promise.$$state.value = a, this.promise.$$state.status = 1, g(this.promise.$$state))
                } catch (j) {
                    d(j), c(j)
                }
            },
            reject: function(a) {
                this.promise.$$state.status || this.$$reject(a)
            },
            $$reject: function(a) {
                this.promise.$$state.value = a, this.promise.$$state.status = 2, g(this.promise.$$state)
            },
            notify: function(b) {
                var d = this.promise.$$state.pending;
                0 >= this.promise.$$state.status && d && d.length && a(function() {
                    for (var a, e, f = 0, g = d.length; f < g; f++) {
                        e = d[f][0], a = d[f][3];
                        try {
                            e.notify(x(a) ? a(b) : b)
                        } catch (h) {
                            c(h)
                        }
                    }
                })
            }
        });
        var l = function(a, b) {
                var c = new h;
                return b ? c.resolve(a) : c.reject(a), c.promise
            },
            m = function(a, b, c) {
                var d = null;
                try {
                    x(c) && (d = c())
                } catch (e) {
                    return l(e, !1)
                }
                return d && x(d.then) ? d.then(function() {
                    return l(a, b)
                }, function(a) {
                    return l(a, !1)
                }) : l(a, b)
            },
            n = function(a, b, c, d) {
                var e = new h;
                return e.resolve(a), e.promise.then(b, c, d)
            },
            o = function(a) {
                if (!x(a)) throw j("norslvr", a);
                var b = new h;
                return a(function(a) {
                    b.resolve(a)
                }, function(a) {
                    b.reject(a)
                }), b.promise
            };
        return o.prototype = e.prototype, o.defer = k, o.reject = function(a) {
            var b = new h;
            return b.reject(a), b.promise
        }, o.when = n, o.resolve = n, o.all = function(a) {
            var b = new h,
                c = 0,
                e = jd(a) ? [] : {};
            return d(a, function(a, d) {
                c++, n(a).then(function(a) {
                    e.hasOwnProperty(d) || (e[d] = a, --c || b.resolve(e))
                }, function(a) {
                    e.hasOwnProperty(d) || b.reject(a)
                })
            }), 0 === c && b.resolve(e), b.promise
        }, o.race = function(a) {
            var b = k();
            return d(a, function(a) {
                n(a).then(b.resolve, b.reject)
            }), b.promise
        }, o
    }

    function Xb() {
        this.$get = ["$window", "$timeout", function(a, b) {
            var c = a.requestAnimationFrame || a.webkitRequestAnimationFrame,
                d = a.cancelAnimationFrame || a.webkitCancelAnimationFrame || a.webkitCancelRequestAnimationFrame,
                e = !!c,
                f = e ? function(a) {
                    var b = c(a);
                    return function() {
                        d(b)
                    }
                } : function(a) {
                    var c = b(a, 16.66, !1);
                    return function() {
                        b.cancel(c)
                    }
                };
            return f.supported = e, f
        }]
    }

    function Yb() {
        function a(a) {
            function b() {
                this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null, this.$$listeners = {}, this.$$listenerCount = {}, this.$$watchersCount = 0, this.$id = ++hd, this.$$ChildScope = null
            }
            return b.prototype = a, b
        }
        var e = 10,
            f = b("$rootScope"),
            g = null,
            h = null;
        this.digestTtl = function(a) {
            return arguments.length && (e = a), e
        }, this.$get = ["$exceptionHandler", "$parse", "$browser", function(b, i, j) {
            function k(a) {
                a.currentScope.$$destroyed = !0
            }

            function l(a) {
                9 === Uc && (a.$$childHead && l(a.$$childHead), a.$$nextSibling && l(a.$$nextSibling)), a.$parent = a.$$nextSibling = a.$$prevSibling = a.$$childHead = a.$$childTail = a.$root = a.$$watchers = null
            }

            function n() {
                this.$id = ++hd, this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this.$root = this, this.$$destroyed = !1, this.$$listeners = {}, this.$$listenerCount = {}, this.$$watchersCount = 0, this.$$isolateBindings = null
            }

            function o(a) {
                if (w.$$phase) throw f("inprog", w.$$phase);
                w.$$phase = a
            }

            function p(a, b) {
                do a.$$watchersCount += b; while (a = a.$parent)
            }

            function r(a, b, c) {
                do a.$$listenerCount[c] -= b, 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c]; while (a = a.$parent)
            }

            function t() {}

            function u() {
                for (; A.length;) try {
                    A.shift()()
                } catch (a) {
                    b(a)
                }
                h = null
            }

            function v() {
                null === h && (h = j.defer(function() {
                    w.$apply(u)
                }))
            }
            n.prototype = {
                constructor: n,
                $new: function(b, c) {
                    var d;
                    return c = c || this, b ? (d = new n, d.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = a(this)), d = new this.$$ChildScope), d.$parent = c, d.$$prevSibling = c.$$childTail, c.$$childHead ? (c.$$childTail.$$nextSibling = d, c.$$childTail = d) : c.$$childHead = c.$$childTail = d, (b || c !== this) && d.$on("$destroy", k), d
                },
                $watch: function(a, b, c, d) {
                    var e = i(a);
                    if (e.$$watchDelegate) return e.$$watchDelegate(this, b, c, e, a);
                    var f = this,
                        h = f.$$watchers,
                        j = {
                            fn: b,
                            last: t,
                            get: e,
                            exp: d || a,
                            eq: !!c
                        };
                    return g = null, x(b) || (j.fn = m), h || (h = f.$$watchers = []), h.unshift(j), p(this, 1),
                        function() {
                            0 <= G(h, j) && p(f, -1), g = null
                        }
                },
                $watchGroup: function(a, b) {
                    function c() {
                        i = !1, j ? (j = !1, b(f, f, h)) : b(f, e, h)
                    }
                    var e = Array(a.length),
                        f = Array(a.length),
                        g = [],
                        h = this,
                        i = !1,
                        j = !0;
                    if (!a.length) {
                        var k = !0;
                        return h.$evalAsync(function() {
                                k && b(f, f, h)
                            }),
                            function() {
                                k = !1
                            }
                    }
                    return 1 === a.length ? this.$watch(a[0], function(a, c, d) {
                        f[0] = a, e[0] = c, b(f, a === c ? f : e, d)
                    }) : (d(a, function(a, b) {
                        var d = h.$watch(a, function(a, d) {
                            f[b] = a, e[b] = d, i || (i = !0, h.$evalAsync(c))
                        });
                        g.push(d)
                    }), function() {
                        for (; g.length;) g.shift()()
                    })
                },
                $watchCollection: function(a, b) {
                    function d(a) {
                        e = a;
                        var b, d, g, h;
                        if (!q(e)) {
                            if (s(e))
                                if (c(e))
                                    for (f !== m && (f = m, p = f.length = 0, k++), a = e.length, p !== a && (k++, f.length = p = a), b = 0; b < a; b++) h = f[b], g = e[b], d = h !== h && g !== g, d || h === g || (k++, f[b] = g);
                                else {
                                    f !== n && (f = n = {}, p = 0, k++), a = 0;
                                    for (b in e) Zc.call(e, b) && (a++, g = e[b], h = f[b], b in f ? (d = h !== h && g !== g, d || h === g || (k++, f[b] = g)) : (p++, f[b] = g, k++));
                                    if (p > a)
                                        for (b in k++, f) Zc.call(e, b) || (p--, delete f[b])
                                }
                            else f !== e && (f = e, k++);
                            return k
                        }
                    }
                    d.$stateful = !0;
                    var e, f, g, h = this,
                        j = 1 < b.length,
                        k = 0,
                        l = i(a, d),
                        m = [],
                        n = {},
                        o = !0,
                        p = 0;
                    return this.$watch(l, function() {
                        if (o ? (o = !1, b(e, e, h)) : b(e, g, h), j)
                            if (s(e))
                                if (c(e)) {
                                    g = Array(e.length);
                                    for (var a = 0; a < e.length; a++) g[a] = e[a]
                                } else
                                    for (a in g = {}, e) Zc.call(e, a) && (g[a] = e[a]);
                        else g = e
                    })
                },
                $digest: function() {
                    var a, c, d, i, k, l, m, n, p, q, r, s = e,
                        v = [];
                    o("$digest"), j.$$checkUrlChange(), this === w && null !== h && (j.defer.cancel(h), u()), g = null;
                    do {
                        for (n = !1, p = this, l = 0; l < y.length; l++) {
                            try {
                                r = y[l], r.scope.$eval(r.expression, r.locals)
                            } catch (A) {
                                b(A)
                            }
                            g = null
                        }
                        y.length = 0;
                        a: do {
                            if (l = p.$$watchers)
                                for (m = l.length; m--;) try {
                                    if (a = l[m])
                                        if (k = a.get, (c = k(p)) === (d = a.last) || (a.eq ? I(c, d) : id(c) && id(d))) {
                                            if (a === g) {
                                                n = !1;
                                                break a
                                            }
                                        } else n = !0, g = a, a.last = a.eq ? H(c, null) : c, i = a.fn, i(c, d === t ? c : d, p), 5 > s && (q = 4 - s, v[q] || (v[q] = []), v[q].push({
                                            msg: x(a.exp) ? "fn: " + (a.exp.name || a.exp.toString()) : a.exp,
                                            newVal: c,
                                            oldVal: d
                                        }))
                                } catch (C) {
                                    b(C)
                                }
                            if (!(l = p.$$watchersCount && p.$$childHead || p !== this && p.$$nextSibling))
                                for (; p !== this && !(l = p.$$nextSibling);) p = p.$parent
                        } while (p = l);
                        if ((n || y.length) && !s--) throw w.$$phase = null, f("infdig", e, v)
                    } while (n || y.length);
                    for (w.$$phase = null; B < z.length;) try {
                        z[B++]()
                    } catch (D) {
                        b(D)
                    }
                    z.length = B = 0
                },
                $destroy: function() {
                    if (!this.$$destroyed) {
                        var a = this.$parent;
                        this.$broadcast("$destroy"), this.$$destroyed = !0, this === w && j.$$applicationDestroyed(), p(this, -this.$$watchersCount);
                        for (var b in this.$$listenerCount) r(this, this.$$listenerCount[b], b);
                        a && a.$$childHead === this && (a.$$childHead = this.$$nextSibling), a && a.$$childTail === this && (a.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = m, this.$on = this.$watch = this.$watchGroup = function() {
                            return m
                        }, this.$$listeners = {}, this.$$nextSibling = null, l(this)
                    }
                },
                $eval: function(a, b) {
                    return i(a)(this, b)
                },
                $evalAsync: function(a, b) {
                    w.$$phase || y.length || j.defer(function() {
                        y.length && w.$digest()
                    }), y.push({
                        scope: this,
                        expression: i(a),
                        locals: b
                    })
                },
                $$postDigest: function(a) {
                    z.push(a)
                },
                $apply: function(a) {
                    try {
                        o("$apply");
                        try {
                            return this.$eval(a)
                        } finally {
                            w.$$phase = null
                        }
                    } catch (c) {
                        b(c)
                    } finally {
                        try {
                            w.$digest()
                        } catch (d) {
                            throw b(d), d
                        }
                    }
                },
                $applyAsync: function(a) {
                    function b() {
                        c.$eval(a)
                    }
                    var c = this;
                    a && A.push(b), a = i(a), v()
                },
                $on: function(a, b) {
                    var c = this.$$listeners[a];
                    c || (this.$$listeners[a] = c = []), c.push(b);
                    var d = this;
                    do d.$$listenerCount[a] || (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++; while (d = d.$parent);
                    var e = this;
                    return function() {
                        var d = c.indexOf(b); - 1 !== d && (c[d] = null, r(e, 1, a))
                    }
                },
                $emit: function(a, c) {
                    var d, e, f, g = [],
                        h = this,
                        i = !1,
                        j = {
                            name: a,
                            targetScope: h,
                            stopPropagation: function() {
                                i = !0
                            },
                            preventDefault: function() {
                                j.defaultPrevented = !0
                            },
                            defaultPrevented: !1
                        },
                        k = J([j], arguments, 1);
                    do {
                        for (d = h.$$listeners[a] || g, j.currentScope = h, e = 0, f = d.length; e < f; e++)
                            if (d[e]) try {
                                d[e].apply(null, k)
                            } catch (l) {
                                b(l)
                            } else d.splice(e, 1), e--, f--;
                        if (i) return j.currentScope = null, j;
                        h = h.$parent
                    } while (h);
                    return j.currentScope = null, j
                },
                $broadcast: function(a, c) {
                    var d = this,
                        e = this,
                        f = {
                            name: a,
                            targetScope: this,
                            preventDefault: function() {
                                f.defaultPrevented = !0
                            },
                            defaultPrevented: !1
                        };
                    if (!this.$$listenerCount[a]) return f;
                    for (var g, h, i = J([f], arguments, 1); d = e;) {
                        for (f.currentScope = d, e = d.$$listeners[a] || [], g = 0, h = e.length; g < h; g++)
                            if (e[g]) try {
                                e[g].apply(null, i)
                            } catch (j) {
                                b(j)
                            } else e.splice(g, 1), g--, h--;
                        if (!(e = d.$$listenerCount[a] && d.$$childHead || d !== this && d.$$nextSibling))
                            for (; d !== this && !(e = d.$$nextSibling);) d = d.$parent
                    }
                    return f.currentScope = null, f
                }
            };
            var w = new n,
                y = w.$$asyncQueue = [],
                z = w.$$postDigestQueue = [],
                A = w.$$applyAsyncQueue = [],
                B = 0;
            return w
        }]
    }

    function Zb() {
        var a = /^\s*(https?|ftp|mailto|tel|file):/,
            b = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function(b) {
            return r(b) ? (a = b, this) : a
        }, this.imgSrcSanitizationWhitelist = function(a) {
            return r(a) ? (b = a, this) : b
        }, this.$get = function() {
            return function(c, d) {
                var e, f = d ? b : a;
                return e = gc(c).href, "" === e || e.match(f) ? c : "unsafe:" + e
            }
        }
    }

    function $b(a) {
        if ("self" === a) return a;
        if (u(a)) {
            if (-1 < a.indexOf("***")) throw Oe("iwcard", a);
            return a = md(a).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), new RegExp("^" + a + "$")
        }
        if (y(a)) return new RegExp("^" + a.source + "$");
        throw Oe("imatcher")
    }

    function _b(a) {
        var b = [];
        return r(a) && d(a, function(a) {
            b.push($b(a))
        }), b
    }

    function ac() {
        this.SCE_CONTEXTS = Pe;
        var a = ["self"],
            b = [];
        this.resourceUrlWhitelist = function(b) {
            return arguments.length && (a = _b(b)), a
        }, this.resourceUrlBlacklist = function(a) {
            return arguments.length && (b = _b(a)), b
        }, this.$get = ["$injector", function(c) {
            function d(a, b) {
                return "self" === a ? hc(b) : !!a.exec(b.href)
            }

            function e(a) {
                var b = function(a) {
                    this.$$unwrapTrustedValue = function() {
                        return a
                    }
                };
                return a && (b.prototype = new a), b.prototype.valueOf = function() {
                    return this.$$unwrapTrustedValue()
                }, b.prototype.toString = function() {
                    return this.$$unwrapTrustedValue().toString()
                }, b
            }
            var f = function(a) {
                throw Oe("unsafe")
            };
            c.has("$sanitize") && (f = c.get("$sanitize"));
            var g = e(),
                h = {};
            return h[Pe.HTML] = e(g), h[Pe.CSS] = e(g), h[Pe.URL] = e(g), h[Pe.JS] = e(g), h[Pe.RESOURCE_URL] = e(h[Pe.URL]), {
                trustAs: function(a, b) {
                    var c = h.hasOwnProperty(a) ? h[a] : null;
                    if (!c) throw Oe("icontext", a, b);
                    if (null === b || q(b) || "" === b) return b;
                    if ("string" != typeof b) throw Oe("itype", a);
                    return new c(b)
                },
                getTrusted: function(c, e) {
                    if (null === e || q(e) || "" === e) return e;
                    var g = h.hasOwnProperty(c) ? h[c] : null;
                    if (g && e instanceof g) return e.$$unwrapTrustedValue();
                    if (c === Pe.RESOURCE_URL) {
                        var i, j, g = gc(e.toString()),
                            k = !1;
                        for (i = 0, j = a.length; i < j; i++)
                            if (d(a[i], g)) {
                                k = !0;
                                break
                            } if (k)
                            for (i = 0, j = b.length; i < j; i++)
                                if (d(b[i], g)) {
                                    k = !1;
                                    break
                                } if (k) return e;
                        throw Oe("insecurl", e.toString())
                    }
                    if (c === Pe.HTML) return f(e);
                    throw Oe("unsafe")
                },
                valueOf: function(a) {
                    return a instanceof g ? a.$$unwrapTrustedValue() : a
                }
            }
        }]
    }

    function bc() {
        var a = !0;
        this.enabled = function(b) {
            return arguments.length && (a = !!b), a
        }, this.$get = ["$parse", "$sceDelegate", function(b, c) {
            if (a && 8 > Uc) throw Oe("iequirks");
            var e = ia(Pe);
            e.isEnabled = function() {
                return a
            }, e.trustAs = c.trustAs, e.getTrusted = c.getTrusted, e.valueOf = c.valueOf, a || (e.trustAs = e.getTrusted = function(a, b) {
                return b
            }, e.valueOf = n), e.parseAs = function(a, c) {
                var d = b(c);
                return d.literal && d.constant ? d : b(c, function(b) {
                    return e.getTrusted(a, b)
                })
            };
            var f = e.parseAs,
                g = e.getTrusted,
                h = e.trustAs;
            return d(Pe, function(a, b) {
                var c = $c(b);
                e[ka("parse_as_" + c)] = function(b) {
                    return f(a, b)
                }, e[ka("get_trusted_" + c)] = function(b) {
                    return g(a, b)
                }, e[ka("trust_as_" + c)] = function(b) {
                    return h(a, b)
                }
            }), e
        }]
    }

    function cc() {
        this.$get = ["$window", "$document", function(a, b) {
            var c, d = {},
                e = !(a.chrome && (a.chrome.app && a.chrome.app.runtime || !a.chrome.app && a.chrome.runtime && a.chrome.runtime.id)) && a.history && a.history.pushState,
                f = k((/android (\d+)/.exec($c((a.navigator || {}).userAgent)) || [])[1]),
                g = /Boxee/i.test((a.navigator || {}).userAgent),
                h = b[0] || {},
                i = /^(Moz|webkit|ms)(?=[A-Z])/,
                j = h.body && h.body.style,
                l = !1,
                m = !1;
            if (j) {
                for (var n in j)
                    if (l = i.exec(n)) {
                        c = l[0], c = c[0].toUpperCase() + c.substr(1);
                        break
                    } c || (c = "WebkitOpacity" in j && "webkit"), l = !!("transition" in j || c + "Transition" in j), m = !!("animation" in j || c + "Animation" in j), !f || l && m || (l = u(j.webkitTransition), m = u(j.webkitAnimation))
            }
            return {
                history: !(!e || 4 > f || g),
                hasEvent: function(a) {
                    if ("input" === a && 11 >= Uc) return !1;
                    if (q(d[a])) {
                        var b = h.createElement("div");
                        d[a] = "on" + a in b
                    }
                    return d[a]
                },
                csp: nd(),
                vendorPrefix: c,
                transitions: l,
                animations: m,
                android: f
            }
        }]
    }

    function dc() {
        var a;
        this.httpOptions = function(b) {
            return b ? (a = b, this) : a
        }, this.$get = ["$templateCache", "$http", "$q", "$sce", function(b, c, d, e) {
            function f(g, h) {
                f.totalPendingRequests++, u(g) && !q(b.get(g)) || (g = e.getTrustedResourceUrl(g));
                var j = c.defaults && c.defaults.transformResponse;
                return jd(j) ? j = j.filter(function(a) {
                    return a !== gb
                }) : j === gb && (j = null), c.get(g, i({
                    cache: b,
                    transformResponse: j
                }, a))["finally"](function() {
                    f.totalPendingRequests--
                }).then(function(a) {
                    return b.put(g, a.data), a.data
                }, function(a) {
                    if (!h) throw Qe("tpload", g, a.status, a.statusText);
                    return d.reject(a)
                })
            }
            return f.totalPendingRequests = 0, f
        }]
    }

    function ec() {
        this.$get = ["$rootScope", "$browser", "$location", function(a, b, c) {
            return {
                findBindings: function(a, b, c) {
                    a = a.getElementsByClassName("ng-binding");
                    var e = [];
                    return d(a, function(a) {
                        var f = gd.element(a).data("$binding");
                        f && d(f, function(d) {
                            c ? new RegExp("(^|\\s)" + md(b) + "(\\s|\\||$)").test(d) && e.push(a) : -1 !== d.indexOf(b) && e.push(a)
                        })
                    }), e
                },
                findModels: function(a, b, c) {
                    for (var d = ["ng-", "data-ng-", "ng\\:"], e = 0; e < d.length; ++e) {
                        var f = a.querySelectorAll("[" + d[e] + "model" + (c ? "=" : "*=") + '"' + b + '"]');
                        if (f.length) return f
                    }
                },
                getLocation: function() {
                    return c.url()
                },
                setLocation: function(b) {
                    b !== c.url() && (c.url(b), a.$digest())
                },
                whenStable: function(a) {
                    b.notifyWhenNoOutstandingRequests(a)
                }
            }
        }]
    }

    function fc() {
        this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function(a, b, c, d, e) {
            function f(f, h, i) {
                x(f) || (i = h, h = f, f = m);
                var j, k = ad.call(arguments, 3),
                    l = r(i) && !i,
                    n = (l ? d : c).defer(),
                    o = n.promise;
                return j = b.defer(function() {
                    try {
                        n.resolve(f.apply(null, k))
                    } catch (b) {
                        n.reject(b), e(b)
                    } finally {
                        delete g[o.$$timeoutId]
                    }
                    l || a.$apply()
                }, h), o.$$timeoutId = j, g[j] = n, o
            }
            var g = {};
            return f.cancel = function(a) {
                return !!(a && a.$$timeoutId in g) && (g[a.$$timeoutId].reject("canceled"), delete g[a.$$timeoutId], b.defer.cancel(a.$$timeoutId))
            }, f
        }]
    }

    function gc(a) {
        return Uc && (Re.setAttribute("href", a), a = Re.href), Re.setAttribute("href", a), {
            href: Re.href,
            protocol: Re.protocol ? Re.protocol.replace(/:$/, "") : "",
            host: Re.host,
            search: Re.search ? Re.search.replace(/^\?/, "") : "",
            hash: Re.hash ? Re.hash.replace(/^#/, "") : "",
            hostname: Re.hostname,
            port: Re.port,
            pathname: "/" === Re.pathname.charAt(0) ? Re.pathname : "/" + Re.pathname
        }
    }

    function hc(a) {
        return a = u(a) ? gc(a) : a, a.protocol === Se.protocol && a.host === Se.host
    }

    function ic() {
        this.$get = o(a)
    }

    function jc(a) {
        function b(a) {
            try {
                return decodeURIComponent(a)
            } catch (b) {
                return a
            }
        }
        var c = a[0] || {},
            d = {},
            e = "";
        return function() {
            var a, f, g, h, i;
            if (a = c.cookie || "", a !== e)
                for (e = a, a = e.split("; "), d = {}, g = 0; g < a.length; g++) f = a[g], h = f.indexOf("="), 0 < h && (i = b(f.substring(0, h)), q(d[i]) && (d[i] = b(f.substring(h + 1))));
            return d
        }
    }

    function kc() {
        this.$get = jc
    }

    function lc(a) {
        function b(c, e) {
            if (s(c)) {
                var f = {};
                return d(c, function(a, c) {
                    f[c] = b(c, a)
                }), f
            }
            return a.factory(c + "Filter", e)
        }
        this.register = b, this.$get = ["$injector", function(a) {
            return function(b) {
                return a.get(b + "Filter")
            }
        }], b("currency", qc), b("date", Bc), b("filter", mc), b("json", Cc), b("limitTo", Dc), b("lowercase", Ze), b("number", rc), b("orderBy", Fc), b("uppercase", $e)
    }

    function mc() {
        return function(a, d, e, f) {
            if (!c(a)) {
                if (null == a) return a;
                throw b("filter")("notarray", a)
            }
            f = f || "$";
            var g;
            switch (pc(d)) {
                case "function":
                    break;
                case "boolean":
                case "null":
                case "number":
                case "string":
                    g = !0;
                case "object":
                    d = nc(d, e, f, g);
                    break;
                default:
                    return a
            }
            return Array.prototype.filter.call(a, d)
        }
    }

    function nc(a, b, c, d) {
        var e = s(a) && c in a;
        return !0 === b ? b = I : x(b) || (b = function(a, b) {
                return !q(a) && (null === a || null === b ? a === b : !(s(b) || s(a) && !p(a)) && (a = $c("" + a), b = $c("" + b), -1 !== a.indexOf(b)))
            }),
            function(f) {
                return e && !s(f) ? oc(f, a[c], b, c, !1) : oc(f, a, b, c, d)
            }
    }

    function oc(a, b, c, d, e, f) {
        var g = pc(a),
            h = pc(b);
        if ("string" === h && "!" === b.charAt(0)) return !oc(a, b.substring(1), c, d, e);
        if (jd(a)) return a.some(function(a) {
            return oc(a, b, c, d, e)
        });
        switch (g) {
            case "object":
                var i;
                if (e) {
                    for (i in a)
                        if ("$" !== i.charAt(0) && oc(a[i], b, c, d, !0)) return !0;
                    return !f && oc(a, b, c, d, !1)
                }
                if ("object" === h) {
                    for (i in b)
                        if (f = b[i], !x(f) && !q(f) && (g = i === d, !oc(g ? a : a[i], f, c, d, g, g))) return !1;
                    return !0
                }
                return c(a, b);
            case "function":
                return !1;
            default:
                return c(a, b)
        }
    }

    function pc(a) {
        return null === a ? "null" : typeof a
    }

    function qc(a) {
        var b = a.NUMBER_FORMATS;
        return function(a, c, d) {
            return q(c) && (c = b.CURRENCY_SYM), q(d) && (d = b.PATTERNS[1].maxFrac), null == a ? a : uc(a, b.PATTERNS[1], b.GROUP_SEP, b.DECIMAL_SEP, d).replace(/\u00A4/g, c)
        }
    }

    function rc(a) {
        var b = a.NUMBER_FORMATS;
        return function(a, c) {
            return null == a ? a : uc(a, b.PATTERNS[0], b.GROUP_SEP, b.DECIMAL_SEP, c)
        }
    }

    function sc(a) {
        var b, c, d, e, f, g = 0;
        for (-1 < (c = a.indexOf(Ue)) && (a = a.replace(Ue, "")), 0 < (d = a.search(/e/i)) ? (0 > c && (c = d), c += +a.slice(d + 1), a = a.substring(0, d)) : 0 > c && (c = a.length), d = 0; a.charAt(d) === Ve; d++);
        if (d === (f = a.length)) b = [0], c = 1;
        else {
            for (f--; a.charAt(f) === Ve;) f--;
            for (c -= d, b = [], e = 0; d <= f; d++, e++) b[e] = +a.charAt(d)
        }
        return c > Te && (b = b.splice(0, Te - 1), g = c - 1, c = 1), {
            d: b,
            e: g,
            i: c
        }
    }

    function tc(a, b, c, d) {
        var e = a.d,
            f = e.length - a.i;
        if (b = q(b) ? Math.min(Math.max(c, f), d) : +b, c = b + a.i, d = e[c], 0 < c) {
            e.splice(Math.max(a.i, c));
            for (var g = c; g < e.length; g++) e[g] = 0
        } else
            for (f = Math.max(0, f), a.i = 1, e.length = Math.max(1, c = b + 1), e[0] = 0, g = 1; g < c; g++) e[g] = 0;
        if (5 <= d)
            if (0 > c - 1) {
                for (d = 0; d > c; d--) e.unshift(0), a.i++;
                e.unshift(1), a.i++
            } else e[c - 1]++;
        for (; f < Math.max(0, b); f++) e.push(0);
        (b = e.reduceRight(function(a, b, c, d) {
            return b += a, d[c] = b % 10, Math.floor(b / 10)
        }, 0)) && (e.unshift(b), a.i++)
    }

    function uc(a, b, c, d, e) {
        if (!u(a) && !v(a) || isNaN(a)) return "";
        var f = !isFinite(a),
            g = !1,
            h = Math.abs(a) + "",
            i = "";
        if (f) i = "∞";
        else {
            for (g = sc(h), tc(g, e, b.minFrac, b.maxFrac),
                i = g.d, h = g.i, e = g.e, f = [], g = i.reduce(function(a, b) {
                    return a && !b
                }, !0); 0 > h;) i.unshift(0), h++;
            for (0 < h ? f = i.splice(h, i.length) : (f = i, i = [0]), h = [], i.length >= b.lgSize && h.unshift(i.splice(-b.lgSize, i.length).join("")); i.length > b.gSize;) h.unshift(i.splice(-b.gSize, i.length).join(""));
            i.length && h.unshift(i.join("")), i = h.join(c), f.length && (i += d + f.join("")), e && (i += "e+" + e)
        }
        return 0 > a && !g ? b.negPre + i + b.negSuf : b.posPre + i + b.posSuf
    }

    function vc(a, b, c, d) {
        var e = "";
        for ((0 > a || d && 0 >= a) && (d ? a = -a + 1 : (a = -a, e = "-")), a = "" + a; a.length < b;) a = Ve + a;
        return c && (a = a.substr(a.length - b)), e + a
    }

    function wc(a, b, c, d, e) {
        return c = c || 0,
            function(f) {
                return f = f["get" + a](), (0 < c || f > -c) && (f += c), 0 === f && -12 === c && (f = 12), vc(f, b, d, e)
            }
    }

    function xc(a, b, c) {
        return function(d, e) {
            var f = d["get" + a](),
                g = _c((c ? "STANDALONE" : "") + (b ? "SHORT" : "") + a);
            return e[g][f]
        }
    }

    function yc(a) {
        var b = new Date(a, 0, 1).getDay();
        return new Date(a, 0, (4 >= b ? 5 : 12) - b)
    }

    function zc(a) {
        return function(b) {
            var c = yc(b.getFullYear());
            return b = +new Date(b.getFullYear(), b.getMonth(), b.getDate() + (4 - b.getDay())) - +c, b = 1 + Math.round(b / 6048e5), vc(b, a)
        }
    }

    function Ac(a, b) {
        return 0 >= a.getFullYear() ? b.ERAS[0] : b.ERAS[1]
    }

    function Bc(a) {
        function b(a) {
            var b;
            if (b = a.match(c)) {
                a = new Date(0);
                var d = 0,
                    e = 0,
                    f = b[8] ? a.setUTCFullYear : a.setFullYear,
                    g = b[8] ? a.setUTCHours : a.setHours;
                b[9] && (d = k(b[9] + b[10]), e = k(b[9] + b[11])), f.call(a, k(b[1]), k(b[2]) - 1, k(b[3])), d = k(b[4] || 0) - d, e = k(b[5] || 0) - e, f = k(b[6] || 0), b = Math.round(1e3 * parseFloat("0." + (b[7] || 0))), g.call(a, d, e, f, b)
            }
            return a
        }
        var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(c, e, f) {
            var g, h, i = "",
                j = [];
            if (e = e || "mediumDate", e = a.DATETIME_FORMATS[e] || e, u(c) && (c = Ye.test(c) ? k(c) : b(c)), v(c) && (c = new Date(c)), !w(c) || !isFinite(c.getTime())) return c;
            for (; e;)(h = Xe.exec(e)) ? (j = J(j, h, 1), e = j.pop()) : (j.push(e), e = null);
            var l = c.getTimezoneOffset();
            return f && (l = O(f, l), c = P(c, f, !0)), d(j, function(b) {
                g = We[b], i += g ? g(c, a.DATETIME_FORMATS, l) : "''" === b ? "'" : b.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            }), i
        }
    }

    function Cc() {
        return function(a, b) {
            return q(b) && (b = 2), M(a, b)
        }
    }

    function Dc() {
        return function(a, b, d) {
            return b = 1 / 0 === Math.abs(Number(b)) ? Number(b) : k(b), id(b) ? a : (v(a) && (a = a.toString()), c(a) ? (d = !d || isNaN(d) ? 0 : k(d), d = 0 > d ? Math.max(0, a.length + d) : d, 0 <= b ? Ec(a, d, d + b) : 0 === d ? Ec(a, b, a.length) : Ec(a, Math.max(0, d + b), d)) : a)
        }
    }

    function Ec(a, b, c) {
        return u(a) ? a.slice(b, c) : ad.call(a, b, c)
    }

    function Fc(a) {
        function d(b) {
            return b.map(function(b) {
                var c = 1,
                    d = n;
                if (x(b)) d = b;
                else if (u(b) && ("+" !== b.charAt(0) && "-" !== b.charAt(0) || (c = "-" === b.charAt(0) ? -1 : 1, b = b.substring(1)), "" !== b && (d = a(b), d.constant))) var e = d(),
                    d = function(a) {
                        return a[e]
                    };
                return {
                    get: d,
                    descending: c
                }
            })
        }

        function e(a) {
            switch (typeof a) {
                case "number":
                case "boolean":
                case "string":
                    return !0;
                default:
                    return !1
            }
        }

        function f(a, b) {
            var c = 0,
                d = a.type,
                e = b.type;
            if (d === e) {
                var e = a.value,
                    f = b.value;
                "string" === d ? (e = e.toLowerCase(), f = f.toLowerCase()) : "object" === d && (s(e) && (e = a.index), s(f) && (f = b.index)), e !== f && (c = e < f ? -1 : 1)
            } else c = d < e ? -1 : 1;
            return c
        }
        return function(a, g, h, i) {
            if (null == a) return a;
            if (!c(a)) throw b("orderBy")("notarray", a);
            jd(g) || (g = [g]), 0 === g.length && (g = ["+"]);
            var j = d(g),
                k = h ? -1 : 1,
                l = x(i) ? i : f;
            return a = Array.prototype.map.call(a, function(a, b) {
                return {
                    value: a,
                    tieBreaker: {
                        value: b,
                        type: "number",
                        index: b
                    },
                    predicateValues: j.map(function(c) {
                        var d = c.get(a);
                        return c = typeof d, null === d ? (c = "string", d = "null") : "object" === c && (x(d.valueOf) && (d = d.valueOf(), e(d)) || p(d) && (d = d.toString(), e(d))), {
                            value: d,
                            type: c,
                            index: b
                        }
                    })
                }
            }), a.sort(function(a, b) {
                for (var c = 0, d = j.length; c < d; c++) {
                    var e = l(a.predicateValues[c], b.predicateValues[c]);
                    if (e) return e * j[c].descending * k
                }
                return l(a.tieBreaker, b.tieBreaker) * k
            }), a = a.map(function(a) {
                return a.value
            })
        }
    }

    function Gc(a) {
        return x(a) && (a = {
            link: a
        }), a.restrict = a.restrict || "AC", o(a)
    }

    function Hc(a, b, c, e, f) {
        var g = this,
            h = [];
        g.$error = {}, g.$$success = {}, g.$pending = void 0, g.$name = f(b.name || b.ngForm || "")(c), g.$dirty = !1, g.$pristine = !0, g.$valid = !0, g.$invalid = !1, g.$submitted = !1, g.$$parentForm = bf, g.$rollbackViewValue = function() {
            d(h, function(a) {
                a.$rollbackViewValue()
            })
        }, g.$commitViewValue = function() {
            d(h, function(a) {
                a.$commitViewValue()
            })
        }, g.$addControl = function(a) {
            da(a.$name, "input"), h.push(a), a.$name && (g[a.$name] = a), a.$$parentForm = g
        }, g.$$renameControl = function(a, b) {
            var c = a.$name;
            g[c] === a && delete g[c], g[b] = a, a.$name = b
        }, g.$removeControl = function(a) {
            a.$name && g[a.$name] === a && delete g[a.$name], d(g.$pending, function(b, c) {
                g.$setValidity(c, null, a)
            }), d(g.$error, function(b, c) {
                g.$setValidity(c, null, a)
            }), d(g.$$success, function(b, c) {
                g.$setValidity(c, null, a)
            }), G(h, a), a.$$parentForm = bf
        }, Sc({
            ctrl: this,
            $element: a,
            set: function(a, b, c) {
                var d = a[b];
                d ? -1 === d.indexOf(c) && d.push(c) : a[b] = [c]
            },
            unset: function(a, b, c) {
                var d = a[b];
                d && (G(d, c), 0 === d.length && delete a[b])
            },
            $animate: e
        }), g.$setDirty = function() {
            e.removeClass(a, Mf), e.addClass(a, Nf), g.$dirty = !0, g.$pristine = !1, g.$$parentForm.$setDirty()
        }, g.$setPristine = function() {
            e.setClass(a, Mf, Nf + " ng-submitted"), g.$dirty = !1, g.$pristine = !0, g.$submitted = !1, d(h, function(a) {
                a.$setPristine()
            })
        }, g.$setUntouched = function() {
            d(h, function(a) {
                a.$setUntouched()
            })
        }, g.$setSubmitted = function() {
            e.addClass(a, "ng-submitted"), g.$submitted = !0, g.$$parentForm.$setSubmitted()
        }
    }

    function Ic(a) {
        a.$formatters.push(function(b) {
            return a.$isEmpty(b) ? b : b.toString()
        })
    }

    function Jc(a, b, c, d, e, f) {
        var g = $c(b[0].type);
        if (!e.android) {
            var h = !1;
            b.on("compositionstart", function() {
                h = !0
            }), b.on("compositionend", function() {
                h = !1, j()
            })
        }
        var i, j = function(a) {
            if (i && (f.defer.cancel(i), i = null), !h) {
                var e = b.val();
                a = a && a.type, "password" === g || c.ngTrim && "false" === c.ngTrim || (e = ld(e)), (d.$viewValue !== e || "" === e && d.$$hasNativeValidators) && d.$setViewValue(e, a)
            }
        };
        if (e.hasEvent("input")) b.on("input", j);
        else {
            var k = function(a, b, c) {
                i || (i = f.defer(function() {
                    i = null, b && b.value === c || j(a)
                }))
            };
            b.on("keydown", function(a) {
                var b = a.keyCode;
                91 === b || 15 < b && 19 > b || 37 <= b && 40 >= b || k(a, this, this.value)
            }), e.hasEvent("paste") && b.on("paste cut", k)
        }
        b.on("change", j), pf[g] && d.$$hasNativeValidators && g === c.type && b.on("keydown wheel mousedown", function(a) {
            if (!i) {
                var b = this.validity,
                    c = b.badInput,
                    d = b.typeMismatch;
                i = f.defer(function() {
                    i = null, b.badInput === c && b.typeMismatch === d || j(a)
                })
            }
        }), d.$render = function() {
            var a = d.$isEmpty(d.$viewValue) ? "" : d.$viewValue;
            b.val() !== a && b.val(a)
        }
    }

    function Kc(a, b) {
        return function(c, e) {
            var f, g;
            if (w(c)) return c;
            if (u(c)) {
                if ('"' === c.charAt(0) && '"' === c.charAt(c.length - 1) && (c = c.substring(1, c.length - 1)), ff.test(c)) return new Date(c);
                if (a.lastIndex = 0, f = a.exec(c)) return f.shift(), g = e ? {
                    yyyy: e.getFullYear(),
                    MM: e.getMonth() + 1,
                    dd: e.getDate(),
                    HH: e.getHours(),
                    mm: e.getMinutes(),
                    ss: e.getSeconds(),
                    sss: e.getMilliseconds() / 1e3
                } : {
                    yyyy: 1970,
                    MM: 1,
                    dd: 1,
                    HH: 0,
                    mm: 0,
                    ss: 0,
                    sss: 0
                }, d(f, function(a, c) {
                    c < b.length && (g[b[c]] = +a)
                }), new Date(g.yyyy, g.MM - 1, g.dd, g.HH, g.mm, g.ss || 0, 1e3 * g.sss || 0)
            }
            return NaN
        }
    }

    function Lc(a, b, c, d) {
        return function(e, f, g, h, i, j, k) {
            function l(a) {
                return a && !(a.getTime && a.getTime() !== a.getTime())
            }

            function m(a) {
                return r(a) && !w(a) ? c(a) || void 0 : a
            }
            Mc(e, f, g, h), Jc(e, f, g, h, i, j);
            var n, o = h && h.$options && h.$options.timezone;
            if (h.$$parserName = a, h.$parsers.push(function(a) {
                    return h.$isEmpty(a) ? null : b.test(a) ? (a = c(a, n), o && (a = P(a, o)), a) : void 0
                }), h.$formatters.push(function(a) {
                    if (a && !w(a)) throw Pf("datefmt", a);
                    return l(a) ? ((n = a) && o && (n = P(n, o, !0)), k("date")(a, d, o)) : (n = null, "")
                }), r(g.min) || g.ngMin) {
                var p;
                h.$validators.min = function(a) {
                    return !l(a) || q(p) || c(a) >= p
                }, g.$observe("min", function(a) {
                    p = m(a), h.$validate()
                })
            }
            if (r(g.max) || g.ngMax) {
                var s;
                h.$validators.max = function(a) {
                    return !l(a) || q(s) || c(a) <= s
                }, g.$observe("max", function(a) {
                    s = m(a), h.$validate()
                })
            }
        }
    }

    function Mc(a, b, c, d) {
        (d.$$hasNativeValidators = s(b[0].validity)) && d.$parsers.push(function(a) {
            var c = b.prop("validity") || {};
            return c.badInput || c.typeMismatch ? void 0 : a
        })
    }

    function Nc(a) {
        a.$$parserName = "number", a.$parsers.push(function(b) {
            return a.$isEmpty(b) ? null : jf.test(b) ? parseFloat(b) : void 0
        }), a.$formatters.push(function(b) {
            if (!a.$isEmpty(b)) {
                if (!v(b)) throw Pf("numfmt", b);
                b = b.toString()
            }
            return b
        })
    }

    function Oc(a) {
        return r(a) && !v(a) && (a = parseFloat(a)), id(a) ? void 0 : a
    }

    function Pc(a) {
        var b = a.toString(),
            c = b.indexOf(".");
        return -1 === c ? -1 < a && 1 > a && (a = /e-(\d+)$/.exec(b)) ? Number(a[1]) : 0 : b.length - c - 1
    }

    function Qc(a, b, c, d, e) {
        if (r(d)) {
            if (a = a(d), !a.constant) throw Pf("constexpr", c, d);
            return a(b)
        }
        return e
    }

    function Rc(a, b) {
        return a = "ngClass" + a, ["$animate", function(c) {
            function e(a, b) {
                var c = [],
                    d = 0;
                a: for (; d < a.length; d++) {
                    for (var e = a[d], f = 0; f < b.length; f++)
                        if (e === b[f]) continue a;
                    c.push(e)
                }
                return c
            }

            function f(a) {
                var b = [];
                return jd(a) ? (d(a, function(a) {
                    b = b.concat(f(a))
                }), b) : u(a) ? a.split(" ") : s(a) ? (d(a, function(a, c) {
                    a && (b = b.concat(c.split(" ")))
                }), b) : a
            }
            return {
                restrict: "AC",
                link: function(g, h, i) {
                    function j(a) {
                        a = k(a, 1), i.$addClass(a)
                    }

                    function k(a, b) {
                        var c = h.data("$classCounts") || ga(),
                            e = [];
                        return d(a, function(a) {
                            (0 < b || c[a]) && (c[a] = (c[a] || 0) + b, c[a] === +(0 < b) && e.push(a))
                        }), h.data("$classCounts", c), e.join(" ")
                    }

                    function l(a, b) {
                        var d = e(b, a),
                            f = e(a, b),
                            d = k(d, 1),
                            f = k(f, -1);
                        d && d.length && c.addClass(h, d), f && f.length && c.removeClass(h, f)
                    }

                    function m(a) {
                        if (!0 === b || (1 & g.$index) === b) {
                            var c = f(a || []);
                            if (n) {
                                if (!I(a, n)) {
                                    var d = f(n);
                                    l(d, c)
                                }
                            } else j(c)
                        }
                        n = jd(a) ? a.map(function(a) {
                            return ia(a)
                        }) : ia(a)
                    }
                    var n;
                    g.$watch(i[a], m, !0), i.$observe("class", function(b) {
                        m(g.$eval(i[a]))
                    }), "ngClass" !== a && g.$watch("$index", function(c, d) {
                        var e = 1 & c;
                        if (e !== (1 & d)) {
                            var h = f(g.$eval(i[a]));
                            e === b ? j(h) : (e = k(h, -1), i.$removeClass(e))
                        }
                    })
                }
            }
        }]
    }

    function Sc(a) {
        function b(a, b) {
            b && !f[a] ? (i.addClass(e, a), f[a] = !0) : !b && f[a] && (i.removeClass(e, a), f[a] = !1)
        }

        function c(a, c) {
            a = a ? "-" + _(a, "-") : "", b(Kf + a, !0 === c), b(Lf + a, !1 === c)
        }
        var d = a.ctrl,
            e = a.$element,
            f = {},
            g = a.set,
            h = a.unset,
            i = a.$animate;
        f[Lf] = !(f[Kf] = e.hasClass(Kf)), d.$setValidity = function(a, e, f) {
            q(e) ? (d.$pending || (d.$pending = {}), g(d.$pending, a, f)) : (d.$pending && h(d.$pending, a, f), Tc(d.$pending) && (d.$pending = void 0)), B(e) ? e ? (h(d.$error, a, f), g(d.$$success, a, f)) : (g(d.$error, a, f), h(d.$$success, a, f)) : (h(d.$error, a, f), h(d.$$success, a, f)), d.$pending ? (b(Of, !0), d.$valid = d.$invalid = void 0, c("", null)) : (b(Of, !1), d.$valid = Tc(d.$error), d.$invalid = !d.$valid, c("", d.$valid)), e = d.$pending && d.$pending[a] ? void 0 : !d.$error[a] && (!!d.$$success[a] || null), c(a, e), d.$$parentForm.$setValidity(a, e, d)
        }
    }

    function Tc(a) {
        if (a)
            for (var b in a)
                if (a.hasOwnProperty(b)) return !1;
        return !0
    }
    var Uc, Vc, Wc, Xc, Yc = /^\/(.+)\/([a-z]*)$/,
        Zc = Object.prototype.hasOwnProperty,
        $c = function(a) {
            return u(a) ? a.toLowerCase() : a
        },
        _c = function(a) {
            return u(a) ? a.toUpperCase() : a
        },
        ad = [].slice,
        bd = [].splice,
        cd = [].push,
        dd = Object.prototype.toString,
        ed = Object.getPrototypeOf,
        fd = b("ng"),
        gd = a.angular || (a.angular = {}),
        hd = 0;
    Uc = a.document.documentMode;
    var id = Number.isNaN || function(a) {
        return a !== a
    };
    m.$inject = [], n.$inject = [];
    var jd = Array.isArray,
        kd = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/,
        ld = function(a) {
            return u(a) ? a.trim() : a
        },
        md = function(a) {
            return a.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
        },
        nd = function() {
            if (!r(nd.rules)) {
                var b = a.document.querySelector("[ng-csp]") || a.document.querySelector("[data-ng-csp]");
                if (b) {
                    var c = b.getAttribute("ng-csp") || b.getAttribute("data-ng-csp");
                    nd.rules = {
                        noUnsafeEval: !c || -1 !== c.indexOf("no-unsafe-eval"),
                        noInlineStyle: !c || -1 !== c.indexOf("no-inline-style")
                    }
                } else {
                    b = nd;
                    try {
                        new Function(""), c = !1
                    } catch (d) {
                        c = !0
                    }
                    b.rules = {
                        noUnsafeEval: c,
                        noInlineStyle: !1
                    }
                }
            }
            return nd.rules
        },
        od = function() {
            if (r(od.name_)) return od.name_;
            var b, c, d, e, f = qd.length;
            for (c = 0; c < f; ++c)
                if (d = qd[c], b = a.document.querySelector("[" + d.replace(":", "\\:") + "jq]")) {
                    e = b.getAttribute(d + "jq");
                    break
                } return od.name_ = e
        },
        pd = /:/g,
        qd = ["ng-", "data-ng-", "ng:", "x-ng-"],
        rd = function(a) {
            if (!a.currentScript) return !0;
            var b = a.currentScript.getAttribute("src"),
                c = a.createElement("a");
            if (c.href = b, b = c.protocol, a.location.protocol === b) return !0;
            switch (b) {
                case "http:":
                case "https:":
                case "ftp:":
                case "blob:":
                case "file:":
                case "data:":
                    return !0;
                default:
                    return !1
            }
        }(a.document),
        sd = /[A-Z]/g,
        td = !1,
        ud = 3,
        vd = {
            full: "1.5.9",
            major: 1,
            minor: 5,
            dot: 9,
            codeName: "timeturning-lockdown"
        };
    oa.expando = "ng339";
    var wd = oa.cache = {},
        xd = 1;
    oa._data = function(a) {
        return this.cache[a[this.expando]] || {}
    };
    var yd = /([:\-_]+(.))/g,
        zd = /^moz([A-Z])/,
        Ad = {
            mouseleave: "mouseout",
            mouseenter: "mouseover"
        },
        Bd = b("jqLite"),
        Cd = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
        Dd = /<|&#?\w+;/,
        Ed = /<([\w:-]+)/,
        Fd = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
        Gd = {
            option: [1, '<select multiple="multiple">', "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    Gd.optgroup = Gd.option, Gd.tbody = Gd.tfoot = Gd.colgroup = Gd.caption = Gd.thead, Gd.th = Gd.td;
    var Hd = a.Node.prototype.contains || function(a) {
            return !!(16 & this.compareDocumentPosition(a))
        },
        Id = oa.prototype = {
            ready: function(b) {
                function c() {
                    d || (d = !0, b())
                }
                var d = !1;
                "complete" === a.document.readyState ? a.setTimeout(c) : (this.on("DOMContentLoaded", c), oa(a).on("load", c))
            },
            toString: function() {
                var a = [];
                return d(this, function(b) {
                    a.push("" + b)
                }), "[" + a.join(", ") + "]"
            },
            eq: function(a) {
                return Vc(0 <= a ? this[a] : this[this.length + a])
            },
            length: 0,
            push: cd,
            sort: [].sort,
            splice: [].splice
        },
        Jd = {};
    d("multiple selected checked disabled readOnly required open".split(" "), function(a) {
        Jd[$c(a)] = a
    });
    var Kd = {};
    d("input select option textarea button form details".split(" "), function(a) {
        Kd[a] = !0
    });
    var Ld = {
        ngMinlength: "minlength",
        ngMaxlength: "maxlength",
        ngMin: "min",
        ngMax: "max",
        ngPattern: "pattern"
    };
    d({
        data: ua,
        removeData: sa,
        hasData: function(a) {
            for (var b in wd[a.ng339]) return !0;
            return !1
        },
        cleanData: function(a) {
            for (var b = 0, c = a.length; b < c; b++) sa(a[b])
        }
    }, function(a, b) {
        oa[b] = a
    }), d({
        data: ua,
        inheritedData: Aa,
        scope: function(a) {
            return Vc.data(a, "$scope") || Aa(a.parentNode || a, ["$isolateScope", "$scope"])
        },
        isolateScope: function(a) {
            return Vc.data(a, "$isolateScope") || Vc.data(a, "$isolateScopeNoTemplate")
        },
        controller: za,
        injector: function(a) {
            return Aa(a, "$injector")
        },
        removeAttr: function(a, b) {
            a.removeAttribute(b)
        },
        hasClass: va,
        css: function(a, b, c) {
            return b = ka(b), r(c) ? void(a.style[b] = c) : a.style[b]
        },
        attr: function(a, b, c) {
            var d = a.nodeType;
            if (d !== ud && 2 !== d && 8 !== d)
                if (d = $c(b), Jd[d]) {
                    if (!r(c)) return a[b] || (a.attributes.getNamedItem(b) || m).specified ? d : void 0;
                    c ? (a[b] = !0, a.setAttribute(b, d)) : (a[b] = !1, a.removeAttribute(d))
                } else if (r(c)) a.setAttribute(b, c);
            else if (a.getAttribute) return a = a.getAttribute(b, 2), null === a ? void 0 : a
        },
        prop: function(a, b, c) {
            return r(c) ? void(a[b] = c) : a[b]
        },
        text: function() {
            function a(a, b) {
                if (q(b)) {
                    var c = a.nodeType;
                    return 1 === c || c === ud ? a.textContent : ""
                }
                a.textContent = b
            }
            return a.$dv = "", a
        }(),
        val: function(a, b) {
            if (q(b)) {
                if (a.multiple && "select" === F(a)) {
                    var c = [];
                    return d(a.options, function(a) {
                        a.selected && c.push(a.value || a.text)
                    }), 0 === c.length ? null : c
                }
                return a.value
            }
            a.value = b
        },
        html: function(a, b) {
            return q(b) ? a.innerHTML : (qa(a, !0), void(a.innerHTML = b))
        },
        empty: Ba
    }, function(a, b) {
        oa.prototype[b] = function(b, c) {
            var d, e, f = this.length;
            if (a !== Ba && q(2 === a.length && a !== va && a !== za ? b : c)) {
                if (s(b)) {
                    for (d = 0; d < f; d++)
                        if (a === ua) a(this[d], b);
                        else
                            for (e in b) a(this[d], e, b[e]);
                    return this
                }
                for (d = a.$dv, f = q(d) ? Math.min(f, 1) : f, e = 0; e < f; e++) {
                    var g = a(this[e], b, c);
                    d = d ? d + g : g
                }
                return d
            }
            for (d = 0; d < f; d++) a(this[d], b, c);
            return this
        }
    }), d({
        removeData: sa,
        on: function(a, b, c, d) {
            if (r(d)) throw Bd("onargs");
            if (la(a)) {
                d = ta(a, !0);
                var e = d.events,
                    f = d.handle;
                f || (f = d.handle = Fa(a, e)), d = 0 <= b.indexOf(" ") ? b.split(" ") : [b];
                for (var g = d.length, h = function(b, d, g) {
                        var h = e[b];
                        h || (h = e[b] = [], h.specialHandlerWrapper = d, "$destroy" === b || g || a.addEventListener(b, f, !1)), h.push(c)
                    }; g--;) b = d[g], Ad[b] ? (h(Ad[b], Ha), h(b, void 0, !0)) : h(b)
            }
        },
        off: ra,
        one: function(a, b, c) {
            a = Vc(a), a.on(b, function d() {
                a.off(b, c), a.off(b, d)
            }), a.on(b, c)
        },
        replaceWith: function(a, b) {
            var c, e = a.parentNode;
            qa(a), d(new oa(b), function(b) {
                c ? e.insertBefore(b, c.nextSibling) : e.replaceChild(b, a), c = b
            })
        },
        children: function(a) {
            var b = [];
            return d(a.childNodes, function(a) {
                1 === a.nodeType && b.push(a)
            }), b
        },
        contents: function(a) {
            return a.contentDocument || a.childNodes || []
        },
        append: function(a, b) {
            var c = a.nodeType;
            if (1 === c || 11 === c) {
                b = new oa(b);
                for (var c = 0, d = b.length; c < d; c++) a.appendChild(b[c])
            }
        },
        prepend: function(a, b) {
            if (1 === a.nodeType) {
                var c = a.firstChild;
                d(new oa(b), function(b) {
                    a.insertBefore(b, c)
                })
            }
        },
        wrap: function(a, b) {
            na(a, Vc(b).eq(0).clone()[0])
        },
        remove: Ca,
        detach: function(a) {
            Ca(a, !0)
        },
        after: function(a, b) {
            var c = a,
                d = a.parentNode;
            b = new oa(b);
            for (var e = 0, f = b.length; e < f; e++) {
                var g = b[e];
                d.insertBefore(g, c.nextSibling), c = g
            }
        },
        addClass: xa,
        removeClass: wa,
        toggleClass: function(a, b, c) {
            b && d(b.split(" "), function(b) {
                var d = c;
                q(d) && (d = !va(a, b)), (d ? xa : wa)(a, b)
            })
        },
        parent: function(a) {
            return (a = a.parentNode) && 11 !== a.nodeType ? a : null
        },
        next: function(a) {
            return a.nextElementSibling
        },
        find: function(a, b) {
            return a.getElementsByTagName ? a.getElementsByTagName(b) : []
        },
        clone: pa,
        triggerHandler: function(a, b, c) {
            var e, f, g = b.type || b,
                h = ta(a);
            (h = (h = h && h.events) && h[g]) && (e = {
                preventDefault: function() {
                    this.defaultPrevented = !0
                },
                isDefaultPrevented: function() {
                    return !0 === this.defaultPrevented
                },
                stopImmediatePropagation: function() {
                    this.immediatePropagationStopped = !0
                },
                isImmediatePropagationStopped: function() {
                    return !0 === this.immediatePropagationStopped
                },
                stopPropagation: m,
                type: g,
                target: a
            }, b.type && (e = i(e, b)), b = ia(h), f = c ? [e].concat(c) : [e], d(b, function(b) {
                e.isImmediatePropagationStopped() || b.apply(a, f)
            }))
        }
    }, function(a, b) {
        oa.prototype[b] = function(b, c, d) {
            for (var e, f = 0, g = this.length; f < g; f++) q(e) ? (e = a(this[f], b, c, d), r(e) && (e = Vc(e))) : ya(e, a(this[f], b, c, d));
            return r(e) ? e : this
        }, oa.prototype.bind = oa.prototype.on, oa.prototype.unbind = oa.prototype.off
    }), Ka.prototype = {
        put: function(a, b) {
            this[Ja(a, this.nextUid)] = b
        },
        get: function(a) {
            return this[Ja(a, this.nextUid)]
        },
        remove: function(a) {
            var b = this[a = Ja(a, this.nextUid)];
            return delete this[a], b
        }
    };
    var Md = [function() {
            this.$get = [function() {
                return Ka
            }]
        }],
        Nd = /^([^\(]+?)=>/,
        Od = /^[^\(]*\(\s*([^\)]*)\)/m,
        Pd = /,/,
        Qd = /^\s*(_?)(\S+?)\1\s*$/,
        Rd = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
        Sd = b("$injector");
    Na.$$annotate = function(a, b, c) {
        var e;
        if ("function" == typeof a) {
            if (!(e = a.$inject)) {
                if (e = [], a.length) {
                    if (b) throw u(c) && c || (c = a.name || Ma(a)), Sd("strictdi", c);
                    b = La(a), d(b[1].split(Pd), function(a) {
                        a.replace(Qd, function(a, b, c) {
                            e.push(c)
                        })
                    })
                }
                a.$inject = e
            }
        } else jd(a) ? (b = a.length - 1, ca(a[b], "fn"), e = a.slice(0, b)) : ca(a, "fn", !0);
        return e
    };
    var Td = b("$animate"),
        Ud = function() {
            this.$get = m
        },
        Vd = function() {
            var a = new Ka,
                b = [];
            this.$get = ["$$AnimateRunner", "$rootScope", function(c, e) {
                function f(a, b, c) {
                    var e = !1;
                    return b && (b = u(b) ? b.split(" ") : jd(b) ? b : [], d(b, function(b) {
                        b && (e = !0, a[b] = c)
                    })), e
                }

                function g() {
                    d(b, function(b) {
                        var c = a.get(b);
                        if (c) {
                            var e = Qa(b.attr("class")),
                                f = "",
                                g = "";
                            d(c, function(a, b) {
                                a !== !!e[b] && (a ? f += (f.length ? " " : "") + b : g += (g.length ? " " : "") + b)
                            }), d(b, function(a) {
                                f && xa(a, f), g && wa(a, g)
                            }), a.remove(b)
                        }
                    }), b.length = 0
                }
                return {
                    enabled: m,
                    on: m,
                    off: m,
                    pin: m,
                    push: function(d, h, i, j) {
                        return j && j(), i = i || {}, i.from && d.css(i.from), i.to && d.css(i.to), (i.addClass || i.removeClass) && (h = i.addClass, j = i.removeClass, i = a.get(d) || {}, h = f(i, h, !0), j = f(i, j, !1), (h || j) && (a.put(d, i), b.push(d), 1 === b.length && e.$$postDigest(g))), d = new c, d.complete(), d
                    }
                }
            }]
        },
        Wd = ["$provide", function(a) {
            var b = this;
            this.$$registeredAnimations = Object.create(null), this.register = function(c, d) {
                if (c && "." !== c.charAt(0)) throw Td("notcsel", c);
                var e = c + "-animation";
                b.$$registeredAnimations[c.substr(1)] = e, a.factory(e, d)
            }, this.classNameFilter = function(a) {
                if (1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a : null) && /(\s+|\/)ng-animate(\s+|\/)/.test(this.$$classNameFilter.toString())) throw Td("nongcls", "ng-animate");
                return this.$$classNameFilter
            }, this.$get = ["$$animateQueue", function(a) {
                function b(a, b, c) {
                    if (c) {
                        var d;
                        a: {
                            for (d = 0; d < c.length; d++) {
                                var e = c[d];
                                if (1 === e.nodeType) {
                                    d = e;
                                    break a
                                }
                            }
                            d = void 0
                        }!d || d.parentNode || d.previousElementSibling || (c = null)
                    }
                    c ? c.after(a) : b.prepend(a)
                }
                return {
                    on: a.on,
                    off: a.off,
                    pin: a.pin,
                    enabled: a.enabled,
                    cancel: function(a) {
                        a.end && a.end()
                    },
                    enter: function(c, d, e, f) {
                        return d = d && Vc(d), e = e && Vc(e), d = d || e.parent(), b(c, d, e), a.push(c, "enter", Ra(f))
                    },
                    move: function(c, d, e, f) {
                        return d = d && Vc(d), e = e && Vc(e), d = d || e.parent(), b(c, d, e), a.push(c, "move", Ra(f))
                    },
                    leave: function(b, c) {
                        return a.push(b, "leave", Ra(c), function() {
                            b.remove()
                        })
                    },
                    addClass: function(b, c, d) {
                        return d = Ra(d), d.addClass = Pa(d.addclass, c), a.push(b, "addClass", d)
                    },
                    removeClass: function(b, c, d) {
                        return d = Ra(d), d.removeClass = Pa(d.removeClass, c), a.push(b, "removeClass", d)
                    },
                    setClass: function(b, c, d, e) {
                        return e = Ra(e), e.addClass = Pa(e.addClass, c), e.removeClass = Pa(e.removeClass, d), a.push(b, "setClass", e)
                    },
                    animate: function(b, c, d, e, f) {
                        return f = Ra(f), f.from = f.from ? i(f.from, c) : c, f.to = f.to ? i(f.to, d) : d, f.tempClasses = Pa(f.tempClasses, e || "ng-inline-animate"), a.push(b, "animate", f)
                    }
                }
            }]
        }],
        Xd = function() {
            this.$get = ["$$rAF", function(a) {
                function b(b) {
                    c.push(b), 1 < c.length || a(function() {
                        for (var a = 0; a < c.length; a++) c[a]();
                        c = []
                    })
                }
                var c = [];
                return function() {
                    var a = !1;
                    return b(function() {
                            a = !0
                        }),
                        function(c) {
                            a ? c() : b(c)
                        }
                }
            }]
        },
        Yd = function() {
            this.$get = ["$q", "$sniffer", "$$animateAsyncRun", "$document", "$timeout", function(a, b, c, e, f) {
                function g(a) {
                    this.setHost(a);
                    var b = c();
                    this._doneCallbacks = [], this._tick = function(a) {
                        var c = e[0];
                        c && c.hidden ? f(a, 0, !1) : b(a)
                    }, this._state = 0
                }
                return g.chain = function(a, b) {
                    function c() {
                        d === a.length ? b(!0) : a[d](function(a) {
                            !1 === a ? b(!1) : (d++, c())
                        })
                    }
                    var d = 0;
                    c()
                }, g.all = function(a, b) {
                    function c(c) {
                        f = f && c, ++e === a.length && b(f)
                    }
                    var e = 0,
                        f = !0;
                    d(a, function(a) {
                        a.done(c)
                    })
                }, g.prototype = {
                    setHost: function(a) {
                        this.host = a || {}
                    },
                    done: function(a) {
                        2 === this._state ? a() : this._doneCallbacks.push(a)
                    },
                    progress: m,
                    getPromise: function() {
                        if (!this.promise) {
                            var b = this;
                            this.promise = a(function(a, c) {
                                b.done(function(b) {
                                    !1 === b ? c() : a()
                                })
                            })
                        }
                        return this.promise
                    },
                    then: function(a, b) {
                        return this.getPromise().then(a, b)
                    },
                    "catch": function(a) {
                        return this.getPromise()["catch"](a)
                    },
                    "finally": function(a) {
                        return this.getPromise()["finally"](a)
                    },
                    pause: function() {
                        this.host.pause && this.host.pause()
                    },
                    resume: function() {
                        this.host.resume && this.host.resume()
                    },
                    end: function() {
                        this.host.end && this.host.end(), this._resolve(!0)
                    },
                    cancel: function() {
                        this.host.cancel && this.host.cancel(), this._resolve(!1)
                    },
                    complete: function(a) {
                        var b = this;
                        0 === b._state && (b._state = 1, b._tick(function() {
                            b._resolve(a)
                        }))
                    },
                    _resolve: function(a) {
                        2 !== this._state && (d(this._doneCallbacks, function(b) {
                            b(a)
                        }), this._doneCallbacks.length = 0, this._state = 2)
                    }
                }, g
            }]
        },
        Zd = function() {
            this.$get = ["$$rAF", "$q", "$$AnimateRunner", function(a, b, c) {
                return function(b, d) {
                    function e() {
                        return a(function() {
                            f.addClass && (b.addClass(f.addClass), f.addClass = null), f.removeClass && (b.removeClass(f.removeClass), f.removeClass = null), f.to && (b.css(f.to), f.to = null), g || h.complete(), g = !0
                        }), h
                    }
                    var f = d || {};
                    f.$$prepared || (f = H(f)), f.cleanupStyles && (f.from = f.to = null), f.from && (b.css(f.from), f.from = null);
                    var g, h = new c;
                    return {
                        start: e,
                        end: e
                    }
                }
            }]
        },
        $d = b("$compile"),
        _d = new function() {};
    Wa.$inject = ["$provide", "$$sanitizeUriProvider"], Xa.prototype.isFirstChange = function() {
        return this.previousValue === _d
    };
    var ae = /^((?:x|data)[:\-_])/i,
        be = b("$controller"),
        ce = /^(\S+)(\s+as\s+([\w$]+))?$/,
        de = function() {
            this.$get = ["$document", function(a) {
                return function(b) {
                    return b ? !b.nodeType && b instanceof Vc && (b = b[0]) : b = a[0].body, b.offsetWidth + 1
                }
            }]
        },
        ee = "application/json",
        fe = {
            "Content-Type": ee + ";charset=utf-8"
        },
        ge = /^\[|^\{(?!\{)/,
        he = {
            "[": /]$/,
            "{": /}$/
        },
        ie = /^\)\]\}',?\n/,
        je = b("$http"),
        ke = function(a) {
            return function() {
                throw je("legacy", a)
            }
        },
        le = gd.$interpolateMinErr = b("$interpolate");
    le.throwNoconcat = function(a) {
        throw le("noconcat", a)
    }, le.interr = function(a, b) {
        return le("interr", a, b.toString())
    };
    var me = function() {
            this.$get = ["$window", function(a) {
                function b(a) {
                    var b = function(a) {
                        b.data = a, b.called = !0
                    };
                    return b.id = a, b
                }
                var c = a.angular.callbacks,
                    d = {};
                return {
                    createCallback: function(a) {
                        a = "_" + (c.$$counter++).toString(36);
                        var e = "angular.callbacks." + a,
                            f = b(a);
                        return d[e] = c[a] = f, e
                    },
                    wasCalled: function(a) {
                        return d[a].called
                    },
                    getResponse: function(a) {
                        return d[a].data
                    },
                    removeCallback: function(a) {
                        delete c[d[a].id], delete d[a]
                    }
                }
            }]
        },
        ne = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
        oe = {
            http: 80,
            https: 443,
            ftp: 21
        },
        pe = b("$location"),
        qe = /^\s*[\\/]{2,}/,
        re = {
            $$absUrl: "",
            $$html5: !1,
            $$replace: !1,
            absUrl: zb("$$absUrl"),
            url: function(a) {
                if (q(a)) return this.$$url;
                var b = ne.exec(a);
                return (b[1] || "" === a) && this.path(decodeURIComponent(b[1])), (b[2] || b[1] || "" === a) && this.search(b[3] || ""), this.hash(b[5] || ""), this
            },
            protocol: zb("$$protocol"),
            host: zb("$$host"),
            port: zb("$$port"),
            path: Ab("$$path", function(a) {
                return a = null !== a ? a.toString() : "", "/" === a.charAt(0) ? a : "/" + a
            }),
            search: function(a, b) {
                switch (arguments.length) {
                    case 0:
                        return this.$$search;
                    case 1:
                        if (u(a) || v(a)) a = a.toString(), this.$$search = S(a);
                        else {
                            if (!s(a)) throw pe("isrcharg");
                            a = H(a, {}), d(a, function(b, c) {
                                null == b && delete a[c]
                            }), this.$$search = a
                        }
                        break;
                    default:
                        q(b) || null === b ? delete this.$$search[a] : this.$$search[a] = b
                }
                return this.$$compose(), this
            },
            hash: Ab("$$hash", function(a) {
                return null !== a ? a.toString() : ""
            }),
            replace: function() {
                return this.$$replace = !0, this
            }
        };
    d([yb, xb, wb], function(a) {
        a.prototype = Object.create(re), a.prototype.state = function(b) {
            if (!arguments.length) return this.$$state;
            if (a !== wb || !this.$$html5) throw pe("nostate");
            return this.$$state = q(b) ? null : b, this
        }
    });
    var se = b("$parse"),
        te = [].constructor,
        ue = (!1).constructor,
        ve = Function.constructor,
        we = (0).constructor,
        xe = {}.constructor,
        ye = "".constructor,
        ze = te.prototype,
        Ae = ue.prototype,
        Be = ve.prototype,
        Ce = we.prototype,
        De = xe.prototype,
        Ee = ye.prototype,
        Fe = Be.call,
        Ge = Be.apply,
        He = Be.bind,
        Ie = De.valueOf,
        Je = ga();
    d("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function(a) {
        Je[a] = !0
    });
    var Ke = {
            n: "\n",
            f: "\f",
            r: "\r",
            t: "\t",
            v: "\x0B",
            "'": "'",
            '"': '"'
        },
        Le = function(a) {
            this.options = a
        };
    Le.prototype = {
        constructor: Le,
        lex: function(a) {
            for (this.text = a, this.index = 0, this.tokens = []; this.index < this.text.length;)
                if (a = this.text.charAt(this.index), '"' === a || "'" === a) this.readString(a);
                else if (this.isNumber(a) || "." === a && this.isNumber(this.peek())) this.readNumber();
            else if (this.isIdentifierStart(this.peekMultichar())) this.readIdent();
            else if (this.is(a, "(){}[].,;:?")) this.tokens.push({
                index: this.index,
                text: a
            }), this.index++;
            else if (this.isWhitespace(a)) this.index++;
            else {
                var b = a + this.peek(),
                    c = b + this.peek(2),
                    d = Je[b],
                    e = Je[c];
                Je[a] || d || e ? (a = e ? c : d ? b : a, this.tokens.push({
                    index: this.index,
                    text: a,
                    operator: !0
                }), this.index += a.length) : this.throwError("Unexpected next character ", this.index, this.index + 1)
            }
            return this.tokens
        },
        is: function(a, b) {
            return -1 !== b.indexOf(a)
        },
        peek: function(a) {
            return a = a || 1, this.index + a < this.text.length && this.text.charAt(this.index + a)
        },
        isNumber: function(a) {
            return "0" <= a && "9" >= a && "string" == typeof a
        },
        isWhitespace: function(a) {
            return " " === a || "\r" === a || "\t" === a || "\n" === a || "\x0B" === a || " " === a
        },
        isIdentifierStart: function(a) {
            return this.options.isIdentifierStart ? this.options.isIdentifierStart(a, this.codePointAt(a)) : this.isValidIdentifierStart(a)
        },
        isValidIdentifierStart: function(a) {
            return "a" <= a && "z" >= a || "A" <= a && "Z" >= a || "_" === a || "$" === a
        },
        isIdentifierContinue: function(a) {
            return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(a, this.codePointAt(a)) : this.isValidIdentifierContinue(a)
        },
        isValidIdentifierContinue: function(a, b) {
            return this.isValidIdentifierStart(a, b) || this.isNumber(a)
        },
        codePointAt: function(a) {
            return 1 === a.length ? a.charCodeAt(0) : (a.charCodeAt(0) << 10) + a.charCodeAt(1) - 56613888
        },
        peekMultichar: function() {
            var a = this.text.charAt(this.index),
                b = this.peek();
            if (!b) return a;
            var c = a.charCodeAt(0),
                d = b.charCodeAt(0);
            return 55296 <= c && 56319 >= c && 56320 <= d && 57343 >= d ? a + b : a
        },
        isExpOperator: function(a) {
            return "-" === a || "+" === a || this.isNumber(a)
        },
        throwError: function(a, b, c) {
            throw c = c || this.index, b = r(b) ? "s " + b + "-" + this.index + " [" + this.text.substring(b, c) + "]" : " " + c, se("lexerr", a, b, this.text)
        },
        readNumber: function() {
            for (var a = "", b = this.index; this.index < this.text.length;) {
                var c = $c(this.text.charAt(this.index));
                if ("." === c || this.isNumber(c)) a += c;
                else {
                    var d = this.peek();
                    if ("e" === c && this.isExpOperator(d)) a += c;
                    else if (this.isExpOperator(c) && d && this.isNumber(d) && "e" === a.charAt(a.length - 1)) a += c;
                    else {
                        if (!this.isExpOperator(c) || d && this.isNumber(d) || "e" !== a.charAt(a.length - 1)) break;
                        this.throwError("Invalid exponent")
                    }
                }
                this.index++
            }
            this.tokens.push({
                index: b,
                text: a,
                constant: !0,
                value: Number(a)
            })
        },
        readIdent: function() {
            var a = this.index;
            for (this.index += this.peekMultichar().length; this.index < this.text.length;) {
                var b = this.peekMultichar();
                if (!this.isIdentifierContinue(b)) break;
                this.index += b.length
            }
            this.tokens.push({
                index: a,
                text: this.text.slice(a, this.index),
                identifier: !0
            })
        },
        readString: function(a) {
            var b = this.index;
            this.index++;
            for (var c = "", d = a, e = !1; this.index < this.text.length;) {
                var f = this.text.charAt(this.index),
                    d = d + f;
                if (e) "u" === f ? (e = this.text.substring(this.index + 1, this.index + 5), e.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + e + "]"), this.index += 4, c += String.fromCharCode(parseInt(e, 16))) : c += Ke[f] || f, e = !1;
                else if ("\\" === f) e = !0;
                else {
                    if (f === a) return this.index++, void this.tokens.push({
                        index: b,
                        text: d,
                        constant: !0,
                        value: c
                    });
                    c += f
                }
                this.index++
            }
            this.throwError("Unterminated quote", b)
        }
    };
    var Me = function(a, b) {
        this.lexer = a, this.options = b
    };
    Me.Program = "Program", Me.ExpressionStatement = "ExpressionStatement", Me.AssignmentExpression = "AssignmentExpression", Me.ConditionalExpression = "ConditionalExpression", Me.LogicalExpression = "LogicalExpression", Me.BinaryExpression = "BinaryExpression", Me.UnaryExpression = "UnaryExpression", Me.CallExpression = "CallExpression", Me.MemberExpression = "MemberExpression", Me.Identifier = "Identifier", Me.Literal = "Literal", Me.ArrayExpression = "ArrayExpression", Me.Property = "Property", Me.ObjectExpression = "ObjectExpression", Me.ThisExpression = "ThisExpression", Me.LocalsExpression = "LocalsExpression", Me.NGValueParameter = "NGValueParameter", Me.prototype = {
        ast: function(a) {
            return this.text = a, this.tokens = this.lexer.lex(a), a = this.program(), 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), a
        },
        program: function() {
            for (var a = [];;)
                if (0 < this.tokens.length && !this.peek("}", ")", ";", "]") && a.push(this.expressionStatement()), !this.expect(";")) return {
                    type: Me.Program,
                    body: a
                }
        },
        expressionStatement: function() {
            return {
                type: Me.ExpressionStatement,
                expression: this.filterChain()
            }
        },
        filterChain: function() {
            for (var a = this.expression(); this.expect("|");) a = this.filter(a);
            return a
        },
        expression: function() {
            return this.assignment()
        },
        assignment: function() {
            var a = this.ternary();
            return this.expect("=") && (a = {
                type: Me.AssignmentExpression,
                left: a,
                right: this.assignment(),
                operator: "="
            }), a
        },
        ternary: function() {
            var a, b, c = this.logicalOR();
            return this.expect("?") && (a = this.expression(), this.consume(":")) ? (b = this.expression(), {
                type: Me.ConditionalExpression,
                test: c,
                alternate: a,
                consequent: b
            }) : c
        },
        logicalOR: function() {
            for (var a = this.logicalAND(); this.expect("||");) a = {
                type: Me.LogicalExpression,
                operator: "||",
                left: a,
                right: this.logicalAND()
            };
            return a
        },
        logicalAND: function() {
            for (var a = this.equality(); this.expect("&&");) a = {
                type: Me.LogicalExpression,
                operator: "&&",
                left: a,
                right: this.equality()
            };
            return a
        },
        equality: function() {
            for (var a, b = this.relational(); a = this.expect("==", "!=", "===", "!==");) b = {
                type: Me.BinaryExpression,
                operator: a.text,
                left: b,
                right: this.relational()
            };
            return b
        },
        relational: function() {
            for (var a, b = this.additive(); a = this.expect("<", ">", "<=", ">=");) b = {
                type: Me.BinaryExpression,
                operator: a.text,
                left: b,
                right: this.additive()
            };
            return b
        },
        additive: function() {
            for (var a, b = this.multiplicative(); a = this.expect("+", "-");) b = {
                type: Me.BinaryExpression,
                operator: a.text,
                left: b,
                right: this.multiplicative()
            };
            return b
        },
        multiplicative: function() {
            for (var a, b = this.unary(); a = this.expect("*", "/", "%");) b = {
                type: Me.BinaryExpression,
                operator: a.text,
                left: b,
                right: this.unary()
            };
            return b
        },
        unary: function() {
            var a;
            return (a = this.expect("+", "-", "!")) ? {
                type: Me.UnaryExpression,
                operator: a.text,
                prefix: !0,
                argument: this.unary()
            } : this.primary()
        },
        primary: function() {
            var a;
            this.expect("(") ? (a = this.filterChain(), this.consume(")")) : this.expect("[") ? a = this.arrayDeclaration() : this.expect("{") ? a = this.object() : this.selfReferential.hasOwnProperty(this.peek().text) ? a = H(this.selfReferential[this.consume().text]) : this.options.literals.hasOwnProperty(this.peek().text) ? a = {
                type: Me.Literal,
                value: this.options.literals[this.consume().text]
            } : this.peek().identifier ? a = this.identifier() : this.peek().constant ? a = this.constant() : this.throwError("not a primary expression", this.peek());
            for (var b; b = this.expect("(", "[", ".");) "(" === b.text ? (a = {
                type: Me.CallExpression,
                callee: a,
                arguments: this.parseArguments()
            }, this.consume(")")) : "[" === b.text ? (a = {
                type: Me.MemberExpression,
                object: a,
                property: this.expression(),
                computed: !0
            }, this.consume("]")) : "." === b.text ? a = {
                type: Me.MemberExpression,
                object: a,
                property: this.identifier(),
                computed: !1
            } : this.throwError("IMPOSSIBLE");
            return a
        },
        filter: function(a) {
            a = [a];
            for (var b = {
                    type: Me.CallExpression,
                    callee: this.identifier(),
                    arguments: a,
                    filter: !0
                }; this.expect(":");) a.push(this.expression());
            return b
        },
        parseArguments: function() {
            var a = [];
            if (")" !== this.peekToken().text)
                do a.push(this.filterChain()); while (this.expect(","));
            return a
        },
        identifier: function() {
            var a = this.consume();
            return a.identifier || this.throwError("is not a valid identifier", a), {
                type: Me.Identifier,
                name: a.text
            }
        },
        constant: function() {
            return {
                type: Me.Literal,
                value: this.consume().value
            }
        },
        arrayDeclaration: function() {
            var a = [];
            if ("]" !== this.peekToken().text)
                do {
                    if (this.peek("]")) break;
                    a.push(this.expression())
                } while (this.expect(","));
            return this.consume("]"), {
                type: Me.ArrayExpression,
                elements: a
            }
        },
        object: function() {
            var a, b = [];
            if ("}" !== this.peekToken().text)
                do {
                    if (this.peek("}")) break;
                    a = {
                        type: Me.Property,
                        kind: "init"
                    }, this.peek().constant ? (a.key = this.constant(), a.computed = !1, this.consume(":"), a.value = this.expression()) : this.peek().identifier ? (a.key = this.identifier(), a.computed = !1, this.peek(":") ? (this.consume(":"), a.value = this.expression()) : a.value = a.key) : this.peek("[") ? (this.consume("["), a.key = this.expression(), this.consume("]"), a.computed = !0, this.consume(":"), a.value = this.expression()) : this.throwError("invalid key", this.peek()), b.push(a)
                } while (this.expect(","));
            return this.consume("}"), {
                type: Me.ObjectExpression,
                properties: b
            }
        },
        throwError: function(a, b) {
            throw se("syntax", b.text, a, b.index + 1, this.text, this.text.substring(b.index))
        },
        consume: function(a) {
            if (0 === this.tokens.length) throw se("ueoe", this.text);
            var b = this.expect(a);
            return b || this.throwError("is unexpected, expecting [" + a + "]", this.peek()), b
        },
        peekToken: function() {
            if (0 === this.tokens.length) throw se("ueoe", this.text);
            return this.tokens[0]
        },
        peek: function(a, b, c, d) {
            return this.peekAhead(0, a, b, c, d)
        },
        peekAhead: function(a, b, c, d, e) {
            if (this.tokens.length > a) {
                a = this.tokens[a];
                var f = a.text;
                if (f === b || f === c || f === d || f === e || !(b || c || d || e)) return a
            }
            return !1
        },
        expect: function(a, b, c, d) {
            return !!(a = this.peek(a, b, c, d)) && (this.tokens.shift(), a)
        },
        selfReferential: {
            "this": {
                type: Me.ThisExpression
            },
            $locals: {
                type: Me.LocalsExpression
            }
        }
    }, Pb.prototype = {
        compile: function(a, b) {
            var c = this,
                e = this.astBuilder.ast(a);
            this.state = {
                nextId: 0,
                filters: {},
                expensiveChecks: b,
                fn: {
                    vars: [],
                    body: [],
                    own: {}
                },
                assign: {
                    vars: [],
                    body: [],
                    own: {}
                },
                inputs: []
            }, Kb(e, c.$filter);
            var f, g = "";
            return this.stage = "assign", (f = Nb(e)) && (this.state.computing = "assign", g = this.nextId(), this.recurse(f, g), this.return_(g), g = "fn.assign=" + this.generateFunction("assign", "s,v,l")), f = Lb(e.body), c.stage = "inputs", d(f, function(a, b) {
                var d = "fn" + b;
                c.state[d] = {
                    vars: [],
                    body: [],
                    own: {}
                }, c.state.computing = d;
                var e = c.nextId();
                c.recurse(a, e), c.return_(e), c.state.inputs.push(d), a.watchId = b
            }), this.state.computing = "fn", this.stage = "main", this.recurse(e), g = '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + g + this.watchFns() + "return fn;", g = new Function("$filter", "ensureSafeMemberName", "ensureSafeObject", "ensureSafeFunction", "getStringValue", "ensureSafeAssignContext", "ifDefined", "plus", "text", g)(this.$filter, Db, Fb, Gb, Eb, Hb, Ib, Jb, a), this.state = this.stage = void 0, g.literal = Ob(e), g.constant = e.constant, g
        },
        USE: "use",
        STRICT: "strict",
        watchFns: function() {
            var a = [],
                b = this.state.inputs,
                c = this;
            return d(b, function(b) {
                a.push("var " + b + "=" + c.generateFunction(b, "s"))
            }), b.length && a.push("fn.inputs=[" + b.join(",") + "];"), a.join("")
        },
        generateFunction: function(a, b) {
            return "function(" + b + "){" + this.varsPrefix(a) + this.body(a) + "};"
        },
        filterPrefix: function() {
            var a = [],
                b = this;
            return d(this.state.filters, function(c, d) {
                a.push(c + "=$filter(" + b.escape(d) + ")")
            }), a.length ? "var " + a.join(",") + ";" : ""
        },
        varsPrefix: function(a) {
            return this.state[a].vars.length ? "var " + this.state[a].vars.join(",") + ";" : ""
        },
        body: function(a) {
            return this.state[a].body.join("")
        },
        recurse: function(a, b, c, e, f, g) {
            var h, i, j, k, l, n = this;
            if (e = e || m, !g && r(a.watchId)) b = b || this.nextId(), this.if_("i", this.lazyAssign(b, this.computedMember("i", a.watchId)), this.lazyRecurse(a, b, c, e, f, !0));
            else switch (a.type) {
                case Me.Program:
                    d(a.body, function(b, c) {
                        n.recurse(b.expression, void 0, void 0, function(a) {
                            i = a
                        }), c !== a.body.length - 1 ? n.current().body.push(i, ";") : n.return_(i)
                    });
                    break;
                case Me.Literal:
                    k = this.escape(a.value), this.assign(b, k), e(k);
                    break;
                case Me.UnaryExpression:
                    this.recurse(a.argument, void 0, void 0, function(a) {
                        i = a
                    }), k = a.operator + "(" + this.ifDefined(i, 0) + ")", this.assign(b, k), e(k);
                    break;
                case Me.BinaryExpression:
                    this.recurse(a.left, void 0, void 0, function(a) {
                        h = a
                    }), this.recurse(a.right, void 0, void 0, function(a) {
                        i = a
                    }), k = "+" === a.operator ? this.plus(h, i) : "-" === a.operator ? this.ifDefined(h, 0) + a.operator + this.ifDefined(i, 0) : "(" + h + ")" + a.operator + "(" + i + ")", this.assign(b, k), e(k);
                    break;
                case Me.LogicalExpression:
                    b = b || this.nextId(), n.recurse(a.left, b), n.if_("&&" === a.operator ? b : n.not(b), n.lazyRecurse(a.right, b)), e(b);
                    break;
                case Me.ConditionalExpression:
                    b = b || this.nextId(), n.recurse(a.test, b), n.if_(b, n.lazyRecurse(a.alternate, b), n.lazyRecurse(a.consequent, b)), e(b);
                    break;
                case Me.Identifier:
                    b = b || this.nextId(), c && (c.context = "inputs" === n.stage ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", a.name) + "?l:s"), c.computed = !1, c.name = a.name), Db(a.name), n.if_("inputs" === n.stage || n.not(n.getHasOwnProperty("l", a.name)), function() {
                        n.if_("inputs" === n.stage || "s", function() {
                            f && 1 !== f && n.if_(n.not(n.nonComputedMember("s", a.name)), n.lazyAssign(n.nonComputedMember("s", a.name), "{}")), n.assign(b, n.nonComputedMember("s", a.name))
                        })
                    }, b && n.lazyAssign(b, n.nonComputedMember("l", a.name))), (n.state.expensiveChecks || Rb(a.name)) && n.addEnsureSafeObject(b), e(b);
                    break;
                case Me.MemberExpression:
                    h = c && (c.context = this.nextId()) || this.nextId(), b = b || this.nextId(), n.recurse(a.object, h, void 0, function() {
                        n.if_(n.notNull(h), function() {
                            f && 1 !== f && n.addEnsureSafeAssignContext(h), a.computed ? (i = n.nextId(), n.recurse(a.property, i), n.getStringValue(i), n.addEnsureSafeMemberName(i), f && 1 !== f && n.if_(n.not(n.computedMember(h, i)), n.lazyAssign(n.computedMember(h, i), "{}")), k = n.ensureSafeObject(n.computedMember(h, i)), n.assign(b, k), c && (c.computed = !0, c.name = i)) : (Db(a.property.name), f && 1 !== f && n.if_(n.not(n.nonComputedMember(h, a.property.name)), n.lazyAssign(n.nonComputedMember(h, a.property.name), "{}")), k = n.nonComputedMember(h, a.property.name), (n.state.expensiveChecks || Rb(a.property.name)) && (k = n.ensureSafeObject(k)), n.assign(b, k), c && (c.computed = !1, c.name = a.property.name))
                        }, function() {
                            n.assign(b, "undefined")
                        }), e(b)
                    }, !!f);
                    break;
                case Me.CallExpression:
                    b = b || this.nextId(), a.filter ? (i = n.filter(a.callee.name), j = [], d(a.arguments, function(a) {
                        var b = n.nextId();
                        n.recurse(a, b), j.push(b)
                    }), k = i + "(" + j.join(",") + ")", n.assign(b, k), e(b)) : (i = n.nextId(), h = {}, j = [], n.recurse(a.callee, i, h, function() {
                        n.if_(n.notNull(i), function() {
                            n.addEnsureSafeFunction(i), d(a.arguments, function(a) {
                                n.recurse(a, n.nextId(), void 0, function(a) {
                                    j.push(n.ensureSafeObject(a))
                                })
                            }), h.name ? (n.state.expensiveChecks || n.addEnsureSafeObject(h.context), k = n.member(h.context, h.name, h.computed) + "(" + j.join(",") + ")") : k = i + "(" + j.join(",") + ")", k = n.ensureSafeObject(k), n.assign(b, k)
                        }, function() {
                            n.assign(b, "undefined")
                        }), e(b)
                    }));
                    break;
                case Me.AssignmentExpression:
                    if (i = this.nextId(), h = {}, !Mb(a.left)) throw se("lval");
                    this.recurse(a.left, void 0, h, function() {
                        n.if_(n.notNull(h.context), function() {
                            n.recurse(a.right, i), n.addEnsureSafeObject(n.member(h.context, h.name, h.computed)), n.addEnsureSafeAssignContext(h.context), k = n.member(h.context, h.name, h.computed) + a.operator + i, n.assign(b, k), e(b || k)
                        })
                    }, 1);
                    break;
                case Me.ArrayExpression:
                    j = [], d(a.elements, function(a) {
                        n.recurse(a, n.nextId(), void 0, function(a) {
                            j.push(a)
                        })
                    }), k = "[" + j.join(",") + "]", this.assign(b, k), e(k);
                    break;
                case Me.ObjectExpression:
                    j = [], l = !1, d(a.properties, function(a) {
                        a.computed && (l = !0)
                    }), l ? (b = b || this.nextId(), this.assign(b, "{}"), d(a.properties, function(a) {
                        a.computed ? (h = n.nextId(), n.recurse(a.key, h)) : h = a.key.type === Me.Identifier ? a.key.name : "" + a.key.value, i = n.nextId(), n.recurse(a.value, i), n.assign(n.member(b, h, a.computed), i)
                    })) : (d(a.properties, function(b) {
                        n.recurse(b.value, a.constant ? void 0 : n.nextId(), void 0, function(a) {
                            j.push(n.escape(b.key.type === Me.Identifier ? b.key.name : "" + b.key.value) + ":" + a)
                        })
                    }), k = "{" + j.join(",") + "}", this.assign(b, k)), e(b || k);
                    break;
                case Me.ThisExpression:
                    this.assign(b, "s"), e("s");
                    break;
                case Me.LocalsExpression:
                    this.assign(b, "l"), e("l");
                    break;
                case Me.NGValueParameter:
                    this.assign(b, "v"), e("v")
            }
        },
        getHasOwnProperty: function(a, b) {
            var c = a + "." + b,
                d = this.current().own;
            return d.hasOwnProperty(c) || (d[c] = this.nextId(!1, a + "&&(" + this.escape(b) + " in " + a + ")")), d[c]
        },
        assign: function(a, b) {
            if (a) return this.current().body.push(a, "=", b, ";"), a
        },
        filter: function(a) {
            return this.state.filters.hasOwnProperty(a) || (this.state.filters[a] = this.nextId(!0)), this.state.filters[a]
        },
        ifDefined: function(a, b) {
            return "ifDefined(" + a + "," + this.escape(b) + ")"
        },
        plus: function(a, b) {
            return "plus(" + a + "," + b + ")"
        },
        return_: function(a) {
            this.current().body.push("return ", a, ";")
        },
        if_: function(a, b, c) {
            if (!0 === a) b();
            else {
                var d = this.current().body;
                d.push("if(", a, "){"), b(), d.push("}"), c && (d.push("else{"), c(), d.push("}"))
            }
        },
        not: function(a) {
            return "!(" + a + ")"
        },
        notNull: function(a) {
            return a + "!=null"
        },
        nonComputedMember: function(a, b) {
            var c = /[^$_a-zA-Z0-9]/g;
            return /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(b) ? a + "." + b : a + '["' + b.replace(c, this.stringEscapeFn) + '"]'
        },
        computedMember: function(a, b) {
            return a + "[" + b + "]"
        },
        member: function(a, b, c) {
            return c ? this.computedMember(a, b) : this.nonComputedMember(a, b)
        },
        addEnsureSafeObject: function(a) {
            this.current().body.push(this.ensureSafeObject(a), ";")
        },
        addEnsureSafeMemberName: function(a) {
            this.current().body.push(this.ensureSafeMemberName(a), ";")
        },
        addEnsureSafeFunction: function(a) {
            this.current().body.push(this.ensureSafeFunction(a), ";")
        },
        addEnsureSafeAssignContext: function(a) {
            this.current().body.push(this.ensureSafeAssignContext(a), ";")
        },
        ensureSafeObject: function(a) {
            return "ensureSafeObject(" + a + ",text)"
        },
        ensureSafeMemberName: function(a) {
            return "ensureSafeMemberName(" + a + ",text)"
        },
        ensureSafeFunction: function(a) {
            return "ensureSafeFunction(" + a + ",text)"
        },
        getStringValue: function(a) {
            this.assign(a, "getStringValue(" + a + ")")
        },
        ensureSafeAssignContext: function(a) {
            return "ensureSafeAssignContext(" + a + ",text)"
        },
        lazyRecurse: function(a, b, c, d, e, f) {
            var g = this;
            return function() {
                g.recurse(a, b, c, d, e, f)
            }
        },
        lazyAssign: function(a, b) {
            var c = this;
            return function() {
                c.assign(a, b)
            }
        },
        stringEscapeRegex: /[^ a-zA-Z0-9]/g,
        stringEscapeFn: function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        },
        escape: function(a) {
            if (u(a)) return "'" + a.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
            if (v(a)) return a.toString();
            if (!0 === a) return "true";
            if (!1 === a) return "false";
            if (null === a) return "null";
            if ("undefined" == typeof a) return "undefined";
            throw se("esc")
        },
        nextId: function(a, b) {
            var c = "v" + this.state.nextId++;
            return a || this.current().vars.push(c + (b ? "=" + b : "")), c
        },
        current: function() {
            return this.state[this.state.computing]
        }
    }, Qb.prototype = {
        compile: function(a, b) {
            var c = this,
                e = this.astBuilder.ast(a);
            this.expression = a, this.expensiveChecks = b, Kb(e, c.$filter);
            var f, g;
            (f = Nb(e)) && (g = this.recurse(f)), f = Lb(e.body);
            var h;
            f && (h = [], d(f, function(a, b) {
                var d = c.recurse(a);
                a.input = d, h.push(d), a.watchId = b
            }));
            var i = [];
            return d(e.body, function(a) {
                i.push(c.recurse(a.expression))
            }), f = 0 === e.body.length ? m : 1 === e.body.length ? i[0] : function(a, b) {
                var c;
                return d(i, function(d) {
                    c = d(a, b)
                }), c
            }, g && (f.assign = function(a, b, c) {
                return g(a, c, b)
            }), h && (f.inputs = h), f.literal = Ob(e), f.constant = e.constant, f
        },
        recurse: function(a, b, c) {
            var e, f, g, h = this;
            if (a.input) return this.inputs(a.input, a.watchId);
            switch (a.type) {
                case Me.Literal:
                    return this.value(a.value, b);
                case Me.UnaryExpression:
                    return f = this.recurse(a.argument), this["unary" + a.operator](f, b);
                case Me.BinaryExpression:
                    return e = this.recurse(a.left), f = this.recurse(a.right), this["binary" + a.operator](e, f, b);
                case Me.LogicalExpression:
                    return e = this.recurse(a.left), f = this.recurse(a.right), this["binary" + a.operator](e, f, b);
                case Me.ConditionalExpression:
                    return this["ternary?:"](this.recurse(a.test), this.recurse(a.alternate), this.recurse(a.consequent), b);
                case Me.Identifier:
                    return Db(a.name, h.expression), h.identifier(a.name, h.expensiveChecks || Rb(a.name), b, c, h.expression);
                case Me.MemberExpression:
                    return e = this.recurse(a.object, !1, !!c), a.computed || (Db(a.property.name, h.expression), f = a.property.name), a.computed && (f = this.recurse(a.property)), a.computed ? this.computedMember(e, f, b, c, h.expression) : this.nonComputedMember(e, f, h.expensiveChecks, b, c, h.expression);
                case Me.CallExpression:
                    return g = [], d(a.arguments, function(a) {
                        g.push(h.recurse(a))
                    }), a.filter && (f = this.$filter(a.callee.name)), a.filter || (f = this.recurse(a.callee, !0)), a.filter ? function(a, c, d, e) {
                        for (var h = [], i = 0; i < g.length; ++i) h.push(g[i](a, c, d, e));
                        return a = f.apply(void 0, h, e), b ? {
                            context: void 0,
                            name: void 0,
                            value: a
                        } : a
                    } : function(a, c, d, e) {
                        var i, j = f(a, c, d, e);
                        if (null != j.value) {
                            Fb(j.context, h.expression), Gb(j.value, h.expression), i = [];
                            for (var k = 0; k < g.length; ++k) i.push(Fb(g[k](a, c, d, e), h.expression));
                            i = Fb(j.value.apply(j.context, i), h.expression)
                        }
                        return b ? {
                            value: i
                        } : i
                    };
                case Me.AssignmentExpression:
                    return e = this.recurse(a.left, !0, 1), f = this.recurse(a.right),
                        function(a, c, d, g) {
                            var i = e(a, c, d, g);
                            return a = f(a, c, d, g), Fb(i.value, h.expression), Hb(i.context), i.context[i.name] = a, b ? {
                                value: a
                            } : a
                        };
                case Me.ArrayExpression:
                    return g = [], d(a.elements, function(a) {
                            g.push(h.recurse(a))
                        }),
                        function(a, c, d, e) {
                            for (var f = [], h = 0; h < g.length; ++h) f.push(g[h](a, c, d, e));
                            return b ? {
                                value: f
                            } : f
                        };
                case Me.ObjectExpression:
                    return g = [], d(a.properties, function(a) {
                            a.computed ? g.push({
                                key: h.recurse(a.key),
                                computed: !0,
                                value: h.recurse(a.value)
                            }) : g.push({
                                key: a.key.type === Me.Identifier ? a.key.name : "" + a.key.value,
                                computed: !1,
                                value: h.recurse(a.value)
                            })
                        }),
                        function(a, c, d, e) {
                            for (var f = {}, h = 0; h < g.length; ++h) g[h].computed ? f[g[h].key(a, c, d, e)] = g[h].value(a, c, d, e) : f[g[h].key] = g[h].value(a, c, d, e);
                            return b ? {
                                value: f
                            } : f
                        };
                case Me.ThisExpression:
                    return function(a) {
                        return b ? {
                            value: a
                        } : a
                    };
                case Me.LocalsExpression:
                    return function(a, c) {
                        return b ? {
                            value: c
                        } : c
                    };
                case Me.NGValueParameter:
                    return function(a, c, d) {
                        return b ? {
                            value: d
                        } : d
                    }
            }
        },
        "unary+": function(a, b) {
            return function(c, d, e, f) {
                return c = a(c, d, e, f), c = r(c) ? +c : 0, b ? {
                    value: c
                } : c
            }
        },
        "unary-": function(a, b) {
            return function(c, d, e, f) {
                return c = a(c, d, e, f), c = r(c) ? -c : 0, b ? {
                    value: c
                } : c
            }
        },
        "unary!": function(a, b) {
            return function(c, d, e, f) {
                return c = !a(c, d, e, f), b ? {
                    value: c
                } : c
            }
        },
        "binary+": function(a, b, c) {
            return function(d, e, f, g) {
                var h = a(d, e, f, g);
                return d = b(d, e, f, g), h = Jb(h, d), c ? {
                    value: h
                } : h
            }
        },
        "binary-": function(a, b, c) {
            return function(d, e, f, g) {
                var h = a(d, e, f, g);
                return d = b(d, e, f, g), h = (r(h) ? h : 0) - (r(d) ? d : 0), c ? {
                    value: h
                } : h
            }
        },
        "binary*": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) * b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary/": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) / b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary%": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) % b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary===": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) === b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary!==": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) !== b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary==": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) == b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary!=": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) != b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary<": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) < b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary>": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) > b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary<=": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) <= b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary>=": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) >= b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary&&": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) && b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "binary||": function(a, b, c) {
            return function(d, e, f, g) {
                return d = a(d, e, f, g) || b(d, e, f, g), c ? {
                    value: d
                } : d
            }
        },
        "ternary?:": function(a, b, c, d) {
            return function(e, f, g, h) {
                return e = a(e, f, g, h) ? b(e, f, g, h) : c(e, f, g, h), d ? {
                    value: e
                } : e
            }
        },
        value: function(a, b) {
            return function() {
                return b ? {
                    context: void 0,
                    name: void 0,
                    value: a
                } : a
            }
        },
        identifier: function(a, b, c, d, e) {
            return function(f, g, h, i) {
                return f = g && a in g ? g : f, d && 1 !== d && f && !f[a] && (f[a] = {}), g = f ? f[a] : void 0, b && Fb(g, e), c ? {
                    context: f,
                    name: a,
                    value: g
                } : g
            }
        },
        computedMember: function(a, b, c, d, e) {
            return function(f, g, h, i) {
                var j, k, l = a(f, g, h, i);
                return null != l && (j = b(f, g, h, i), j += "", Db(j, e), d && 1 !== d && (Hb(l), l && !l[j] && (l[j] = {})), k = l[j], Fb(k, e)), c ? {
                    context: l,
                    name: j,
                    value: k
                } : k
            }
        },
        nonComputedMember: function(a, b, c, d, e, f) {
            return function(g, h, i, j) {
                return g = a(g, h, i, j), e && 1 !== e && (Hb(g), g && !g[b] && (g[b] = {})), h = null != g ? g[b] : void 0, (c || Rb(b)) && Fb(h, f), d ? {
                    context: g,
                    name: b,
                    value: h
                } : h
            }
        },
        inputs: function(a, b) {
            return function(c, d, e, f) {
                return f ? f[b] : a(c, d, e)
            }
        }
    };
    var Ne = function(a, b, c) {
        this.lexer = a, this.$filter = b, this.options = c, this.ast = new Me(a, c), this.astCompiler = c.csp ? new Qb(this.ast, b) : new Pb(this.ast, b)
    };
    Ne.prototype = {
        constructor: Ne,
        parse: function(a) {
            return this.astCompiler.compile(a, this.options.expensiveChecks)
        }
    };
    var Oe = b("$sce"),
        Pe = {
            HTML: "html",
            CSS: "css",
            URL: "url",
            RESOURCE_URL: "resourceUrl",
            JS: "js"
        },
        Qe = b("$compile"),
        Re = a.document.createElement("a"),
        Se = gc(a.location.href);
    jc.$inject = ["$document"], lc.$inject = ["$provide"];
    var Te = 22,
        Ue = ".",
        Ve = "0";
    qc.$inject = ["$locale"], rc.$inject = ["$locale"];
    var We = {
            yyyy: wc("FullYear", 4, 0, !1, !0),
            yy: wc("FullYear", 2, 0, !0, !0),
            y: wc("FullYear", 1, 0, !1, !0),
            MMMM: xc("Month"),
            MMM: xc("Month", !0),
            MM: wc("Month", 2, 1),
            M: wc("Month", 1, 1),
            LLLL: xc("Month", !1, !0),
            dd: wc("Date", 2),
            d: wc("Date", 1),
            HH: wc("Hours", 2),
            H: wc("Hours", 1),
            hh: wc("Hours", 2, -12),
            h: wc("Hours", 1, -12),
            mm: wc("Minutes", 2),
            m: wc("Minutes", 1),
            ss: wc("Seconds", 2),
            s: wc("Seconds", 1),
            sss: wc("Milliseconds", 3),
            EEEE: xc("Day"),
            EEE: xc("Day", !0),
            a: function(a, b) {
                return 12 > a.getHours() ? b.AMPMS[0] : b.AMPMS[1]
            },
            Z: function(a, b, c) {
                return a = -1 * c, a = (0 <= a ? "+" : "") + (vc(Math[0 < a ? "floor" : "ceil"](a / 60), 2) + vc(Math.abs(a % 60), 2))
            },
            ww: zc(2),
            w: zc(1),
            G: Ac,
            GG: Ac,
            GGG: Ac,
            GGGG: function(a, b) {
                return 0 >= a.getFullYear() ? b.ERANAMES[0] : b.ERANAMES[1]
            }
        },
        Xe = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
        Ye = /^\-?\d+$/;
    Bc.$inject = ["$locale"];
    var Ze = o($c),
        $e = o(_c);
    Fc.$inject = ["$parse"];
    var _e = o({
            restrict: "E",
            compile: function(a, b) {
                if (!b.href && !b.xlinkHref) return function(a, b) {
                    if ("a" === b[0].nodeName.toLowerCase()) {
                        var c = "[object SVGAnimatedString]" === dd.call(b.prop("href")) ? "xlink:href" : "href";
                        b.on("click", function(a) {
                            b.attr(c) || a.preventDefault()
                        })
                    }
                }
            }
        }),
        af = {};
    d(Jd, function(a, b) {
        function c(a, c, e) {
            a.$watch(e[d], function(a) {
                e.$set(b, !!a)
            })
        }
        if ("multiple" !== a) {
            var d = Ya("ng-" + b),
                e = c;
            "checked" === a && (e = function(a, b, e) {
                e.ngModel !== e[d] && c(a, b, e)
            }), af[d] = function() {
                return {
                    restrict: "A",
                    priority: 100,
                    link: e
                }
            }
        }
    }), d(Ld, function(a, b) {
        af[b] = function() {
            return {
                priority: 100,
                link: function(a, c, d) {
                    return "ngPattern" === b && "/" === d.ngPattern.charAt(0) && (c = d.ngPattern.match(Yc)) ? void d.$set("ngPattern", new RegExp(c[1], c[2])) : void a.$watch(d[b], function(a) {
                        d.$set(b, a)
                    })
                }
            }
        }
    }), d(["src", "srcset", "href"], function(a) {
        var b = Ya("ng-" + a);
        af[b] = function() {
            return {
                priority: 99,
                link: function(c, d, e) {
                    var f = a,
                        g = a;
                    "href" === a && "[object SVGAnimatedString]" === dd.call(d.prop("href")) && (g = "xlinkHref", e.$attr[g] = "xlink:href", f = null), e.$observe(b, function(b) {
                        b ? (e.$set(g, b), Uc && f && d.prop(f, e[g])) : "href" === a && e.$set(g, null)
                    })
                }
            }
        }
    });
    var bf = {
        $addControl: m,
        $$renameControl: function(a, b) {
            a.$name = b
        },
        $removeControl: m,
        $setValidity: m,
        $setDirty: m,
        $setPristine: m,
        $setSubmitted: m
    };
    Hc.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
    var cf = function(a) {
            return ["$timeout", "$parse", function(b, c) {
                function d(a) {
                    return "" === a ? c('this[""]').assign : c(a).assign || m
                }
                return {
                    name: "form",
                    restrict: a ? "EAC" : "E",
                    require: ["form", "^^?form"],
                    controller: Hc,
                    compile: function(c, e) {
                        c.addClass(Mf).addClass(Kf);
                        var f = e.name ? "name" : !(!a || !e.ngForm) && "ngForm";
                        return {
                            pre: function(a, c, e, g) {
                                var h = g[0];
                                if (!("action" in e)) {
                                    var j = function(b) {
                                        a.$apply(function() {
                                            h.$commitViewValue(), h.$setSubmitted()
                                        }), b.preventDefault()
                                    };
                                    c[0].addEventListener("submit", j, !1), c.on("$destroy", function() {
                                        b(function() {
                                            c[0].removeEventListener("submit", j, !1)
                                        }, 0, !1)
                                    })
                                }(g[1] || h.$$parentForm).$addControl(h);
                                var k = f ? d(h.$name) : m;
                                f && (k(a, h), e.$observe(f, function(b) {
                                    h.$name !== b && (k(a, void 0), h.$$parentForm.$$renameControl(h, b), (k = d(h.$name))(a, h))
                                })), c.on("$destroy", function() {
                                    h.$$parentForm.$removeControl(h), k(a, void 0), i(h, bf)
                                })
                            }
                        }
                    }
                }
            }]
        },
        df = cf(),
        ef = cf(!0),
        ff = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/,
        gf = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:\/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i,
        hf = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,
        jf = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/,
        kf = /^(\d{4,})-(\d{2})-(\d{2})$/,
        lf = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
        mf = /^(\d{4,})-W(\d\d)$/,
        nf = /^(\d{4,})-(\d\d)$/,
        of = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
        pf = ga();
    d(["date", "datetime-local", "month", "time", "week"], function(a) {
        pf[a] = !0
    });
    var qf = {
            text: function(a, b, c, d, e, f) {
                Jc(a, b, c, d, e, f), Ic(d)
            },
            date: Lc("date", kf, Kc(kf, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
            "datetime-local": Lc("datetimelocal", lf, Kc(lf, "yyyy MM dd HH mm ss sss".split(" ")), "yyyy-MM-ddTHH:mm:ss.sss"),
            time: Lc("time", of, Kc(of, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
            week: Lc("week", mf, function(a, b) {
                if (w(a)) return a;
                if (u(a)) {
                    mf.lastIndex = 0;
                    var c = mf.exec(a);
                    if (c) {
                        var d = +c[1],
                            e = +c[2],
                            f = c = 0,
                            g = 0,
                            h = 0,
                            i = yc(d),
                            e = 7 * (e - 1);
                        return b && (c = b.getHours(), f = b.getMinutes(), g = b.getSeconds(), h = b.getMilliseconds()), new Date(d, 0, i.getDate() + e, c, f, g, h)
                    }
                }
                return NaN
            }, "yyyy-Www"),
            month: Lc("month", nf, Kc(nf, ["yyyy", "MM"]), "yyyy-MM"),
            number: function(a, b, c, d, e, f) {
                Mc(a, b, c, d), Jc(a, b, c, d, e, f), Nc(d);
                var g, h;
                (r(c.min) || c.ngMin) && (d.$validators.min = function(a) {
                    return d.$isEmpty(a) || q(g) || a >= g
                }, c.$observe("min", function(a) {
                    g = Oc(a), d.$validate()
                })), (r(c.max) || c.ngMax) && (d.$validators.max = function(a) {
                    return d.$isEmpty(a) || q(h) || a <= h
                }, c.$observe("max", function(a) {
                    h = Oc(a), d.$validate()
                }))
            },
            url: function(a, b, c, d, e, f) {
                Jc(a, b, c, d, e, f), Ic(d), d.$$parserName = "url", d.$validators.url = function(a, b) {
                    var c = a || b;
                    return d.$isEmpty(c) || gf.test(c)
                }
            },
            email: function(a, b, c, d, e, f) {
                Jc(a, b, c, d, e, f), Ic(d), d.$$parserName = "email", d.$validators.email = function(a, b) {
                    var c = a || b;
                    return d.$isEmpty(c) || hf.test(c)
                }
            },
            radio: function(a, b, c, d) {
                q(c.name) && b.attr("name", ++hd), b.on("click", function(a) {
                    b[0].checked && d.$setViewValue(c.value, a && a.type)
                }), d.$render = function() {
                    b[0].checked = c.value === d.$viewValue
                }, c.$observe("value", d.$render)
            },
            range: function(a, b, c, d, e, f) {
                function g(a, d) {
                    b.attr(a, c[a]), c.$observe(a, d)
                }

                function h(a) {
                    l = Oc(a), id(d.$modelValue) || (k ? (a = b.val(), l > a && (a = l, b.val(a)), d.$setViewValue(a)) : d.$validate())
                }

                function i(a) {
                    m = Oc(a), id(d.$modelValue) || (k ? (a = b.val(), m < a && (b.val(m), a = m < l ? l : m), d.$setViewValue(a)) : d.$validate())
                }

                function j(a) {
                    n = Oc(a), id(d.$modelValue) || (k && d.$viewValue !== b.val() ? d.$setViewValue(b.val()) : d.$validate())
                }
                Mc(a, b, c, d), Nc(d), Jc(a, b, c, d, e, f);
                var k = d.$$hasNativeValidators && "range" === b[0].type,
                    l = k ? 0 : void 0,
                    m = k ? 100 : void 0,
                    n = k ? 1 : void 0,
                    o = b[0].validity;
                a = r(c.min), e = r(c.max), f = r(c.step);
                var p = d.$render;
                d.$render = k && r(o.rangeUnderflow) && r(o.rangeOverflow) ? function() {
                    p(), d.$setViewValue(b.val())
                } : p, a && (d.$validators.min = k ? function() {
                    return !0
                } : function(a, b) {
                    return d.$isEmpty(b) || q(l) || b >= l
                }, g("min", h)), e && (d.$validators.max = k ? function() {
                    return !0
                } : function(a, b) {
                    return d.$isEmpty(b) || q(m) || b <= m
                }, g("max", i)), f && (d.$validators.step = k ? function() {
                    return !o.stepMismatch
                } : function(a, b) {
                    var c;
                    if (!(c = d.$isEmpty(b) || q(n))) {
                        c = l || 0;
                        var e = n,
                            f = Number(b);
                        if ((0 | f) !== f || (0 | c) !== c || (0 | e) !== e) {
                            var g = Math.max(Pc(f), Pc(c), Pc(e)),
                                g = Math.pow(10, g),
                                f = f * g;
                            c *= g, e *= g
                        }
                        c = 0 === (f - c) % e
                    }
                    return c
                }, g("step", j))
            },
            checkbox: function(a, b, c, d, e, f, g, h) {
                var i = Qc(h, a, "ngTrueValue", c.ngTrueValue, !0),
                    j = Qc(h, a, "ngFalseValue", c.ngFalseValue, !1);
                b.on("click", function(a) {
                    d.$setViewValue(b[0].checked, a && a.type)
                }), d.$render = function() {
                    b[0].checked = d.$viewValue
                }, d.$isEmpty = function(a) {
                    return !1 === a
                }, d.$formatters.push(function(a) {
                    return I(a, i)
                }), d.$parsers.push(function(a) {
                    return a ? i : j
                })
            },
            hidden: m,
            button: m,
            submit: m,
            reset: m,
            file: m
        },
        rf = ["$browser", "$sniffer", "$filter", "$parse", function(a, b, c, d) {
            return {
                restrict: "E",
                require: ["?ngModel"],
                link: {
                    pre: function(e, f, g, h) {
                        if (h[0]) {
                            var i = $c(g.type);
                            "range" !== i || g.hasOwnProperty("ngInputRange") || (i = "text"), (qf[i] || qf.text)(e, f, g, h[0], b, a, c, d)
                        }
                    }
                }
            }
        }],
        sf = /^(true|false|\d+)$/,
        tf = function() {
            return {
                restrict: "A",
                priority: 100,
                compile: function(a, b) {
                    return sf.test(b.ngValue) ? function(a, b, c) {
                        c.$set("value", a.$eval(c.ngValue))
                    } : function(a, b, c) {
                        a.$watch(c.ngValue, function(a) {
                            c.$set("value", a)
                        })
                    }
                }
            }
        },
        uf = ["$compile", function(a) {
            return {
                restrict: "AC",
                compile: function(b) {
                    return a.$$addBindingClass(b),
                        function(b, c, d) {
                            a.$$addBindingInfo(c, d.ngBind), c = c[0], b.$watch(d.ngBind, function(a) {
                                c.textContent = q(a) ? "" : a
                            })
                        }
                }
            }
        }],
        vf = ["$interpolate", "$compile", function(a, b) {
            return {
                compile: function(c) {
                    return b.$$addBindingClass(c),
                        function(c, d, e) {
                            c = a(d.attr(e.$attr.ngBindTemplate)), b.$$addBindingInfo(d, c.expressions), d = d[0], e.$observe("ngBindTemplate", function(a) {
                                d.textContent = q(a) ? "" : a
                            })
                        }
                }
            }
        }],
        wf = ["$sce", "$parse", "$compile", function(a, b, c) {
            return {
                restrict: "A",
                compile: function(d, e) {
                    var f = b(e.ngBindHtml),
                        g = b(e.ngBindHtml, function(b) {
                            return a.valueOf(b)
                        });
                    return c.$$addBindingClass(d),
                        function(b, d, e) {
                            c.$$addBindingInfo(d, e.ngBindHtml), b.$watch(g, function() {
                                var c = f(b);
                                d.html(a.getTrustedHtml(c) || "")
                            })
                        }
                }
            }
        }],
        xf = o({
            restrict: "A",
            require: "ngModel",
            link: function(a, b, c, d) {
                d.$viewChangeListeners.push(function() {
                    a.$eval(c.ngChange)
                })
            }
        }),
        yf = Rc("", !0),
        zf = Rc("Odd", 0),
        Af = Rc("Even", 1),
        Bf = Gc({
            compile: function(a, b) {
                b.$set("ngCloak", void 0), a.removeClass("ng-cloak")
            }
        }),
        Cf = [function() {
            return {
                restrict: "A",
                scope: !0,
                controller: "@",
                priority: 500
            }
        }],
        Df = {},
        Ef = {
            blur: !0,
            focus: !0
        };
    d("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(a) {
        var b = Ya("ng-" + a);
        Df[b] = ["$parse", "$rootScope", function(c, d) {
            return {
                restrict: "A",
                compile: function(e, f) {
                    var g = c(f[b], null, !0);
                    return function(b, c) {
                        c.on(a, function(c) {
                            var e = function() {
                                g(b, {
                                    $event: c
                                })
                            };
                            Ef[a] && d.$$phase ? b.$evalAsync(e) : b.$apply(e)
                        })
                    }
                }
            }
        }]
    });
    var Ff = ["$animate", "$compile", function(a, b) {
            return {
                multiElement: !0,
                transclude: "element",
                priority: 600,
                terminal: !0,
                restrict: "A",
                $$tlb: !0,
                link: function(c, d, e, f, g) {
                    var h, i, j;
                    c.$watch(e.ngIf, function(c) {
                        c ? i || g(function(c, f) {
                            i = f, c[c.length++] = b.$$createComment("end ngIf", e.ngIf), h = {
                                clone: c
                            }, a.enter(c, d.parent(), d)
                        }) : (j && (j.remove(), j = null), i && (i.$destroy(), i = null), h && (j = fa(h.clone), a.leave(j).then(function() {
                            j = null
                        }), h = null))
                    })
                }
            }
        }],
        Gf = ["$templateRequest", "$anchorScroll", "$animate", function(a, b, c) {
            return {
                restrict: "ECA",
                priority: 400,
                terminal: !0,
                transclude: "element",
                controller: gd.noop,
                compile: function(d, e) {
                    var f = e.ngInclude || e.src,
                        g = e.onload || "",
                        h = e.autoscroll;
                    return function(d, e, i, j, k) {
                        var l, m, n, o = 0,
                            p = function() {
                                m && (m.remove(), m = null), l && (l.$destroy(), l = null), n && (c.leave(n).then(function() {
                                    m = null
                                }), m = n, n = null)
                            };
                        d.$watch(f, function(f) {
                            var i = function() {
                                    !r(h) || h && !d.$eval(h) || b()
                                },
                                m = ++o;
                            f ? (a(f, !0).then(function(a) {
                                if (!d.$$destroyed && m === o) {
                                    var b = d.$new();
                                    j.template = a, a = k(b, function(a) {
                                        p(), c.enter(a, null, e).then(i)
                                    }), l = b, n = a, l.$emit("$includeContentLoaded", f), d.$eval(g)
                                }
                            }, function() {
                                d.$$destroyed || m !== o || (p(), d.$emit("$includeContentError", f))
                            }), d.$emit("$includeContentRequested", f)) : (p(), j.template = null)
                        })
                    }
                }
            }
        }],
        Hf = ["$compile", function(b) {
            return {
                restrict: "ECA",
                priority: -400,
                require: "ngInclude",
                link: function(c, d, e, f) {
                    dd.call(d[0]).match(/SVG/) ? (d.empty(), b(ma(f.template, a.document).childNodes)(c, function(a) {
                        d.append(a)
                    }, {
                        futureParentElement: d
                    })) : (d.html(f.template), b(d.contents())(c))
                }
            }
        }],
        If = Gc({
            priority: 450,
            compile: function() {
                return {
                    pre: function(a, b, c) {
                        a.$eval(c.ngInit)
                    }
                }
            }
        }),
        Jf = function() {
            return {
                restrict: "A",
                priority: 100,
                require: "ngModel",
                link: function(a, b, c, e) {
                    var f = b.attr(c.$attr.ngList) || ", ",
                        g = "false" !== c.ngTrim,
                        h = g ? ld(f) : f;
                    e.$parsers.push(function(a) {
                        if (!q(a)) {
                            var b = [];
                            return a && d(a.split(h), function(a) {
                                a && b.push(g ? ld(a) : a)
                            }), b
                        }
                    }), e.$formatters.push(function(a) {
                        if (jd(a)) return a.join(f)
                    }), e.$isEmpty = function(a) {
                        return !a || !a.length
                    }
                }
            }
        },
        Kf = "ng-valid",
        Lf = "ng-invalid",
        Mf = "ng-pristine",
        Nf = "ng-dirty",
        Of = "ng-pending",
        Pf = b("ngModel"),
        Qf = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function(a, b, c, e, f, g, h, i, j, k) {
            this.$modelValue = this.$viewValue = Number.NaN, this.$$rawModelValue = void 0, this.$validators = {}, this.$asyncValidators = {}, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$untouched = !0, this.$touched = !1, this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$error = {}, this.$$success = {}, this.$pending = void 0, this.$name = k(c.name || "", !1)(a), this.$$parentForm = bf;
            var l, n = f(c.ngModel),
                o = n.assign,
                p = n,
                s = o,
                t = null,
                u = this;
            this.$$setOptions = function(a) {
                if ((u.$options = a) && a.getterSetter) {
                    var b = f(c.ngModel + "()"),
                        d = f(c.ngModel + "($$$p)");
                    p = function(a) {
                        var c = n(a);
                        return x(c) && (c = b(a)), c
                    }, s = function(a, b) {
                        x(n(a)) ? d(a, {
                            $$$p: b
                        }) : o(a, b)
                    }
                } else if (!n.assign) throw Pf("nonassign", c.ngModel, Q(e))
            }, this.$render = m, this.$isEmpty = function(a) {
                return q(a) || "" === a || null === a || a !== a
            }, this.$$updateEmptyClasses = function(a) {
                u.$isEmpty(a) ? (g.removeClass(e, "ng-not-empty"), g.addClass(e, "ng-empty")) : (g.removeClass(e, "ng-empty"), g.addClass(e, "ng-not-empty"))
            };
            var w = 0;
            Sc({
                ctrl: this,
                $element: e,
                set: function(a, b) {
                    a[b] = !0
                },
                unset: function(a, b) {
                    delete a[b]
                },
                $animate: g
            }), this.$setPristine = function() {
                u.$dirty = !1, u.$pristine = !0, g.removeClass(e, Nf), g.addClass(e, Mf)
            }, this.$setDirty = function() {
                u.$dirty = !0, u.$pristine = !1, g.removeClass(e, Mf), g.addClass(e, Nf), u.$$parentForm.$setDirty()
            }, this.$setUntouched = function() {
                u.$touched = !1, u.$untouched = !0, g.setClass(e, "ng-untouched", "ng-touched")
            }, this.$setTouched = function() {
                u.$touched = !0, u.$untouched = !1, g.setClass(e, "ng-touched", "ng-untouched")
            }, this.$rollbackViewValue = function() {
                h.cancel(t), u.$viewValue = u.$$lastCommittedViewValue, u.$render()
            }, this.$validate = function() {
                if (!id(u.$modelValue)) {
                    var a = u.$$rawModelValue,
                        b = u.$valid,
                        c = u.$modelValue,
                        d = u.$options && u.$options.allowInvalid;
                    u.$$runValidators(a, u.$$lastCommittedViewValue, function(e) {
                        d || b === e || (u.$modelValue = e ? a : void 0, u.$modelValue !== c && u.$$writeModelToScope())
                    })
                }
            }, this.$$runValidators = function(a, b, c) {
                function e() {
                    var c = !0;
                    return d(u.$validators, function(d, e) {
                        var f = d(a, b);
                        c = c && f, g(e, f)
                    }), !!c || (d(u.$asyncValidators, function(a, b) {
                        g(b, null)
                    }), !1)
                }

                function f() {
                    var c = [],
                        e = !0;
                    d(u.$asyncValidators, function(d, f) {
                        var h = d(a, b);
                        if (!h || !x(h.then)) throw Pf("nopromise", h);
                        g(f, void 0), c.push(h.then(function() {
                            g(f, !0)
                        }, function() {
                            e = !1, g(f, !1)
                        }))
                    }), c.length ? j.all(c).then(function() {
                        h(e)
                    }, m) : h(!0)
                }

                function g(a, b) {
                    i === w && u.$setValidity(a, b)
                }

                function h(a) {
                    i === w && c(a)
                }
                w++;
                var i = w;
                (function() {
                    var a = u.$$parserName || "parse";
                    return q(l) ? (g(a, null), !0) : (l || (d(u.$validators, function(a, b) {
                        g(b, null)
                    }), d(u.$asyncValidators, function(a, b) {
                        g(b, null)
                    })), g(a, l), l)
                })() && e() ? f() : h(!1)
            }, this.$commitViewValue = function() {
                var a = u.$viewValue;
                h.cancel(t), (u.$$lastCommittedViewValue !== a || "" === a && u.$$hasNativeValidators) && (u.$$updateEmptyClasses(a), u.$$lastCommittedViewValue = a, u.$pristine && this.$setDirty(), this.$$parseAndValidate())
            }, this.$$parseAndValidate = function() {
                var b = u.$$lastCommittedViewValue;
                if (l = !q(b) || void 0)
                    for (var c = 0; c < u.$parsers.length; c++)
                        if (b = u.$parsers[c](b), q(b)) {
                            l = !1;
                            break
                        } id(u.$modelValue) && (u.$modelValue = p(a));
                var d = u.$modelValue,
                    e = u.$options && u.$options.allowInvalid;
                u.$$rawModelValue = b, e && (u.$modelValue = b, u.$modelValue !== d && u.$$writeModelToScope()), u.$$runValidators(b, u.$$lastCommittedViewValue, function(a) {
                    e || (u.$modelValue = a ? b : void 0, u.$modelValue !== d && u.$$writeModelToScope())
                })
            }, this.$$writeModelToScope = function() {
                s(a, u.$modelValue), d(u.$viewChangeListeners, function(a) {
                    try {
                        a()
                    } catch (c) {
                        b(c)
                    }
                })
            }, this.$setViewValue = function(a, b) {
                u.$viewValue = a, u.$options && !u.$options.updateOnDefault || u.$$debounceViewValueCommit(b)
            }, this.$$debounceViewValueCommit = function(b) {
                var c = 0,
                    d = u.$options;
                d && r(d.debounce) && (d = d.debounce, v(d) ? c = d : v(d[b]) ? c = d[b] : v(d["default"]) && (c = d["default"])),
                    h.cancel(t), c ? t = h(function() {
                        u.$commitViewValue()
                    }, c) : i.$$phase ? u.$commitViewValue() : a.$apply(function() {
                        u.$commitViewValue()
                    })
            }, a.$watch(function() {
                var b = p(a);
                if (b !== u.$modelValue && (u.$modelValue === u.$modelValue || b === b)) {
                    u.$modelValue = u.$$rawModelValue = b, l = void 0;
                    for (var c = u.$formatters, d = c.length, e = b; d--;) e = c[d](e);
                    u.$viewValue !== e && (u.$$updateEmptyClasses(e), u.$viewValue = u.$$lastCommittedViewValue = e, u.$render(), u.$$runValidators(u.$modelValue, u.$viewValue, m))
                }
                return b
            })
        }],
        Rf = ["$rootScope", function(a) {
            return {
                restrict: "A",
                require: ["ngModel", "^?form", "^?ngModelOptions"],
                controller: Qf,
                priority: 1,
                compile: function(b) {
                    return b.addClass(Mf).addClass("ng-untouched").addClass(Kf), {
                        pre: function(a, b, c, d) {
                            var e = d[0];
                            b = d[1] || e.$$parentForm, e.$$setOptions(d[2] && d[2].$options), b.$addControl(e), c.$observe("name", function(a) {
                                e.$name !== a && e.$$parentForm.$$renameControl(e, a)
                            }), a.$on("$destroy", function() {
                                e.$$parentForm.$removeControl(e)
                            })
                        },
                        post: function(b, c, d, e) {
                            var f = e[0];
                            f.$options && f.$options.updateOn && c.on(f.$options.updateOn, function(a) {
                                f.$$debounceViewValueCommit(a && a.type)
                            }), c.on("blur", function() {
                                f.$touched || (a.$$phase ? b.$evalAsync(f.$setTouched) : b.$apply(f.$setTouched))
                            })
                        }
                    }
                }
            }
        }],
        Sf = /(\s+|^)default(\s+|$)/,
        Tf = function() {
            return {
                restrict: "A",
                controller: ["$scope", "$attrs", function(a, b) {
                    var c = this;
                    this.$options = H(a.$eval(b.ngModelOptions)), r(this.$options.updateOn) ? (this.$options.updateOnDefault = !1, this.$options.updateOn = ld(this.$options.updateOn.replace(Sf, function() {
                        return c.$options.updateOnDefault = !0, " "
                    }))) : this.$options.updateOnDefault = !0
                }]
            }
        },
        Uf = Gc({
            terminal: !0,
            priority: 1e3
        }),
        Vf = b("ngOptions"),
        Wf = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
        Xf = ["$compile", "$document", "$parse", function(b, e, f) {
            function g(a, b, d) {
                function e(a, b, c, d, e) {
                    this.selectValue = a, this.viewValue = b, this.label = c, this.group = d, this.disabled = e
                }

                function g(a) {
                    var b;
                    if (!j && c(a)) b = a;
                    else {
                        b = [];
                        for (var d in a) a.hasOwnProperty(d) && "$" !== d.charAt(0) && b.push(d)
                    }
                    return b
                }
                var h = a.match(Wf);
                if (!h) throw Vf("iexp", a, Q(b));
                var i = h[5] || h[7],
                    j = h[6];
                a = / as /.test(h[0]) && h[1];
                var k = h[9];
                b = f(h[2] ? h[1] : i);
                var l = a && f(a) || b,
                    m = k && f(k),
                    n = k ? function(a, b) {
                        return m(d, b)
                    } : function(a) {
                        return Ja(a)
                    },
                    o = function(a, b) {
                        return n(a, u(a, b))
                    },
                    p = f(h[2] || h[1]),
                    q = f(h[3] || ""),
                    r = f(h[4] || ""),
                    s = f(h[8]),
                    t = {},
                    u = j ? function(a, b) {
                        return t[j] = b, t[i] = a, t
                    } : function(a) {
                        return t[i] = a, t
                    };
                return {
                    trackBy: k,
                    getTrackByValue: o,
                    getWatchables: f(s, function(a) {
                        var b = [];
                        a = a || [];
                        for (var c = g(a), e = c.length, f = 0; f < e; f++) {
                            var i = a === c ? f : c[f],
                                j = a[i],
                                i = u(j, i),
                                j = n(j, i);
                            b.push(j), (h[2] || h[1]) && (j = p(d, i), b.push(j)), h[4] && (i = r(d, i), b.push(i))
                        }
                        return b
                    }),
                    getOptions: function() {
                        for (var a = [], b = {}, c = s(d) || [], f = g(c), h = f.length, i = 0; i < h; i++) {
                            var j = c === f ? i : f[i],
                                m = u(c[j], j),
                                t = l(d, m),
                                j = n(t, m),
                                v = p(d, m),
                                w = q(d, m),
                                m = r(d, m),
                                t = new e(j, t, v, w, m);
                            a.push(t), b[j] = t
                        }
                        return {
                            items: a,
                            selectValueMap: b,
                            getOptionFromViewValue: function(a) {
                                return b[o(a)]
                            },
                            getViewValueFromOption: function(a) {
                                return k ? gd.copy(a.viewValue) : a.viewValue
                            }
                        }
                    }
                }
            }
            var h = a.document.createElement("option"),
                i = a.document.createElement("optgroup");
            return {
                restrict: "A",
                terminal: !0,
                require: ["select", "ngModel"],
                link: {
                    pre: function(a, b, c, d) {
                        d[0].registerOption = m
                    },
                    post: function(a, c, f, j) {
                        function k(a, b) {
                            a.element = b, b.disabled = a.disabled, a.label !== b.label && (b.label = a.label, b.textContent = a.label), a.value !== b.value && (b.value = a.selectValue)
                        }

                        function l() {
                            var a = v && n.readValue();
                            if (v)
                                for (var b = v.items.length - 1; 0 <= b; b--) {
                                    var d = v.items[b];
                                    Ca(r(d.group) ? d.element.parentNode : d.element)
                                }
                            v = w.getOptions();
                            var e = {};
                            t && c.prepend(m), v.items.forEach(function(a) {
                                var b;
                                if (r(a.group)) {
                                    b = e[a.group], b || (b = i.cloneNode(!1), x.appendChild(b), b.label = null === a.group ? "null" : a.group, e[a.group] = b);
                                    var c = h.cloneNode(!1)
                                } else b = x, c = h.cloneNode(!1);
                                b.appendChild(c), k(a, c)
                            }), c[0].appendChild(x), o.$render(), o.$isEmpty(a) || (b = n.readValue(), (w.trackBy || p ? I(a, b) : a === b) || (o.$setViewValue(b), o.$render()))
                        }
                        var m, n = j[0],
                            o = j[1],
                            p = f.multiple;
                        j = 0;
                        for (var q = c.children(), s = q.length; j < s; j++)
                            if ("" === q[j].value) {
                                m = q.eq(j);
                                break
                            } var t = !!m,
                            u = Vc(h.cloneNode(!1));
                        u.val("?");
                        var v, w = g(f.ngOptions, c, a),
                            x = e[0].createDocumentFragment(),
                            y = function() {
                                t ? m.removeAttr("selected") : m.remove()
                            };
                        p ? (o.$isEmpty = function(a) {
                            return !a || 0 === a.length
                        }, n.writeValue = function(a) {
                            v.items.forEach(function(a) {
                                a.element.selected = !1
                            }), a && a.forEach(function(a) {
                                (a = v.getOptionFromViewValue(a)) && (a.element.selected = !0)
                            })
                        }, n.readValue = function() {
                            var a = c.val() || [],
                                b = [];
                            return d(a, function(a) {
                                (a = v.selectValueMap[a]) && !a.disabled && b.push(v.getViewValueFromOption(a))
                            }), b
                        }, w.trackBy && a.$watchCollection(function() {
                            if (jd(o.$viewValue)) return o.$viewValue.map(function(a) {
                                return w.getTrackByValue(a)
                            })
                        }, function() {
                            o.$render()
                        })) : (n.writeValue = function(a) {
                            var b = v.selectValueMap[c.val()],
                                d = v.getOptionFromViewValue(a);
                            b && b.element.removeAttribute("selected"), d ? (c[0].value !== d.selectValue && (u.remove(), y(), c[0].value = d.selectValue, d.element.selected = !0), d.element.setAttribute("selected", "selected")) : null === a || t ? (u.remove(), t || c.prepend(m), c.val(""), m.prop("selected", !0), m.attr("selected", !0)) : (y(), c.prepend(u), c.val("?"), u.prop("selected", !0), u.attr("selected", !0))
                        }, n.readValue = function() {
                            var a = v.selectValueMap[c.val()];
                            return a && !a.disabled ? (y(), u.remove(), v.getViewValueFromOption(a)) : null
                        }, w.trackBy && a.$watch(function() {
                            return w.getTrackByValue(o.$viewValue)
                        }, function() {
                            o.$render()
                        })), t ? (m.remove(), b(m)(a), m.removeClass("ng-scope")) : m = Vc(h.cloneNode(!1)), c.empty(), l(), a.$watchCollection(w.getWatchables, l)
                    }
                }
            }
        }],
        Yf = ["$locale", "$interpolate", "$log", function(a, b, c) {
            var e = /{}/g,
                f = /^when(Minus)?(.+)$/;
            return {
                link: function(g, h, i) {
                    function j(a) {
                        h.text(a || "")
                    }
                    var k, l = i.count,
                        n = i.$attr.when && h.attr(i.$attr.when),
                        o = i.offset || 0,
                        p = g.$eval(n) || {},
                        r = {},
                        s = b.startSymbol(),
                        t = b.endSymbol(),
                        u = s + l + "-" + o + t,
                        v = gd.noop;
                    d(i, function(a, b) {
                        var c = f.exec(b);
                        c && (c = (c[1] ? "-" : "") + $c(c[2]), p[c] = h.attr(i.$attr[b]))
                    }), d(p, function(a, c) {
                        r[c] = b(a.replace(e, u))
                    }), g.$watch(l, function(b) {
                        var d = parseFloat(b),
                            e = id(d);
                        e || d in p || (d = a.pluralCat(d - o)), d === k || e && id(k) || (v(), e = r[d], q(e) ? (null != b && c.debug("ngPluralize: no rule defined for '" + d + "' in " + n), v = m, j()) : v = g.$watch(e, j), k = d)
                    })
                }
            }
        }],
        Zf = ["$parse", "$animate", "$compile", function(a, e, f) {
            var g = b("ngRepeat"),
                h = function(a, b, c, d, e, f, g) {
                    a[c] = d, e && (a[e] = f), a.$index = b, a.$first = 0 === b, a.$last = b === g - 1, a.$middle = !(a.$first || a.$last), a.$odd = !(a.$even = 0 === (1 & b))
                };
            return {
                restrict: "A",
                multiElement: !0,
                transclude: "element",
                priority: 1e3,
                terminal: !0,
                $$tlb: !0,
                compile: function(b, i) {
                    var j = i.ngRepeat,
                        k = f.$$createComment("end ngRepeat", j),
                        l = j.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                    if (!l) throw g("iexp", j);
                    var m = l[1],
                        n = l[2],
                        o = l[3],
                        p = l[4],
                        l = m.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
                    if (!l) throw g("iidexp", m);
                    var q = l[3] || l[1],
                        r = l[2];
                    if (o && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(o) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(o))) throw g("badident", o);
                    var s, t, u, v, w = {
                        $id: Ja
                    };
                    return p ? s = a(p) : (u = function(a, b) {
                            return Ja(b)
                        }, v = function(a) {
                            return a
                        }),
                        function(a, b, f, i, l) {
                            s && (t = function(b, c, d) {
                                return r && (w[r] = b), w[q] = c, w.$index = d, s(a, w)
                            });
                            var m = ga();
                            a.$watchCollection(n, function(f) {
                                var i, n, p, s, w, x, y, z, A, B, C = b[0],
                                    D = ga();
                                if (o && (a[o] = f), c(f)) z = f, n = t || u;
                                else
                                    for (B in n = t || v, z = [], f) Zc.call(f, B) && "$" !== B.charAt(0) && z.push(B);
                                for (s = z.length, B = Array(s), i = 0; i < s; i++)
                                    if (w = f === z ? i : z[i], x = f[w], y = n(w, x, i), m[y]) A = m[y], delete m[y], D[y] = A, B[i] = A;
                                    else {
                                        if (D[y]) throw d(B, function(a) {
                                            a && a.scope && (m[a.id] = a)
                                        }), g("dupes", j, y, x);
                                        B[i] = {
                                            id: y,
                                            scope: void 0,
                                            clone: void 0
                                        }, D[y] = !0
                                    } for (p in m) {
                                    if (A = m[p], y = fa(A.clone), e.leave(y), y[0].parentNode)
                                        for (i = 0, n = y.length; i < n; i++) y[i].$$NG_REMOVED = !0;
                                    A.scope.$destroy()
                                }
                                for (i = 0; i < s; i++)
                                    if (w = f === z ? i : z[i], x = f[w], A = B[i], A.scope) {
                                        p = C;
                                        do p = p.nextSibling; while (p && p.$$NG_REMOVED);
                                        A.clone[0] !== p && e.move(fa(A.clone), null, C), C = A.clone[A.clone.length - 1], h(A.scope, i, q, x, r, w, s)
                                    } else l(function(a, b) {
                                        A.scope = b;
                                        var c = k.cloneNode(!1);
                                        a[a.length++] = c, e.enter(a, null, C), C = c, A.clone = a, D[A.id] = A, h(A.scope, i, q, x, r, w, s)
                                    });
                                m = D
                            })
                        }
                }
            }
        }],
        $f = ["$animate", function(a) {
            return {
                restrict: "A",
                multiElement: !0,
                link: function(b, c, d) {
                    b.$watch(d.ngShow, function(b) {
                        a[b ? "removeClass" : "addClass"](c, "ng-hide", {
                            tempClasses: "ng-hide-animate"
                        })
                    })
                }
            }
        }],
        _f = ["$animate", function(a) {
            return {
                restrict: "A",
                multiElement: !0,
                link: function(b, c, d) {
                    b.$watch(d.ngHide, function(b) {
                        a[b ? "addClass" : "removeClass"](c, "ng-hide", {
                            tempClasses: "ng-hide-animate"
                        })
                    })
                }
            }
        }],
        ag = Gc(function(a, b, c) {
            a.$watch(c.ngStyle, function(a, c) {
                c && a !== c && d(c, function(a, c) {
                    b.css(c, "")
                }), a && b.css(a)
            }, !0)
        }),
        bg = ["$animate", "$compile", function(a, b) {
            return {
                require: "ngSwitch",
                controller: ["$scope", function() {
                    this.cases = {}
                }],
                link: function(c, e, f, g) {
                    var h = [],
                        i = [],
                        j = [],
                        k = [],
                        l = function(a, b) {
                            return function() {
                                a.splice(b, 1)
                            }
                        };
                    c.$watch(f.ngSwitch || f.on, function(c) {
                        var e, f;
                        for (e = 0, f = j.length; e < f; ++e) a.cancel(j[e]);
                        for (e = j.length = 0, f = k.length; e < f; ++e) {
                            var m = fa(i[e].clone);
                            k[e].$destroy(), (j[e] = a.leave(m)).then(l(j, e))
                        }
                        i.length = 0, k.length = 0, (h = g.cases["!" + c] || g.cases["?"]) && d(h, function(c) {
                            c.transclude(function(d, e) {
                                k.push(e);
                                var f = c.element;
                                d[d.length++] = b.$$createComment("end ngSwitchWhen"), i.push({
                                    clone: d
                                }), a.enter(d, f.parent(), f)
                            })
                        })
                    })
                }
            }
        }],
        cg = Gc({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(a, b, c, d, e) {
                d.cases["!" + c.ngSwitchWhen] = d.cases["!" + c.ngSwitchWhen] || [], d.cases["!" + c.ngSwitchWhen].push({
                    transclude: e,
                    element: b
                })
            }
        }),
        dg = Gc({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(a, b, c, d, e) {
                d.cases["?"] = d.cases["?"] || [], d.cases["?"].push({
                    transclude: e,
                    element: b
                })
            }
        }),
        eg = b("ngTransclude"),
        fg = ["$compile", function(a) {
            return {
                restrict: "EAC",
                terminal: !0,
                compile: function(b) {
                    var c = a(b.contents());
                    return b.empty(),
                        function(a, b, d, e, f) {
                            function g() {
                                c(a, function(a) {
                                    b.append(a)
                                })
                            }
                            if (!f) throw eg("orphan", Q(b));
                            d.ngTransclude === d.$attr.ngTransclude && (d.ngTransclude = ""), d = d.ngTransclude || d.ngTranscludeSlot, f(function(a, c) {
                                a.length ? b.append(a) : (g(), c.$destroy())
                            }, null, d), d && !f.isSlotFilled(d) && g()
                        }
                }
            }
        }],
        gg = ["$templateCache", function(a) {
            return {
                restrict: "E",
                terminal: !0,
                compile: function(b, c) {
                    "text/ng-template" === c.type && a.put(c.id, b[0].text)
                }
            }
        }],
        hg = {
            $setViewValue: m,
            $render: m
        },
        ig = ["$element", "$scope", function(b, c) {
            var d = this,
                e = new Ka;
            d.ngModelCtrl = hg, d.unknownOption = Vc(a.document.createElement("option")), d.renderUnknownOption = function(a) {
                a = "? " + Ja(a) + " ?", d.unknownOption.val(a), b.prepend(d.unknownOption), b.val(a)
            }, c.$on("$destroy", function() {
                d.renderUnknownOption = m
            }), d.removeUnknownOption = function() {
                d.unknownOption.parent() && d.unknownOption.remove()
            }, d.readValue = function() {
                return d.removeUnknownOption(), b.val()
            }, d.writeValue = function(a) {
                d.hasOption(a) ? (d.removeUnknownOption(), b.val(a), "" === a && d.emptyOption.prop("selected", !0)) : null == a && d.emptyOption ? (d.removeUnknownOption(), b.val("")) : d.renderUnknownOption(a)
            }, d.addOption = function(a, b) {
                if (8 !== b[0].nodeType) {
                    da(a, '"option value"'), "" === a && (d.emptyOption = b);
                    var c = e.get(a) || 0;
                    e.put(a, c + 1), d.ngModelCtrl.$render(), b[0].hasAttribute("selected") && (b[0].selected = !0)
                }
            }, d.removeOption = function(a) {
                var b = e.get(a);
                b && (1 === b ? (e.remove(a), "" === a && (d.emptyOption = void 0)) : e.put(a, b - 1))
            }, d.hasOption = function(a) {
                return !!e.get(a)
            }, d.registerOption = function(a, b, c, e, f) {
                if (e) {
                    var g;
                    c.$observe("value", function(a) {
                        r(g) && d.removeOption(g), g = a, d.addOption(a, b)
                    })
                } else f ? a.$watch(f, function(a, e) {
                    c.$set("value", a), e !== a && d.removeOption(e), d.addOption(a, b)
                }) : d.addOption(c.value, b);
                b.on("$destroy", function() {
                    d.removeOption(c.value), d.ngModelCtrl.$render()
                })
            }
        }],
        jg = function() {
            return {
                restrict: "E",
                require: ["select", "?ngModel"],
                controller: ig,
                priority: 1,
                link: {
                    pre: function(a, b, c, e) {
                        var f = e[1];
                        if (f) {
                            var g = e[0];
                            if (g.ngModelCtrl = f, b.on("change", function() {
                                    a.$apply(function() {
                                        f.$setViewValue(g.readValue())
                                    })
                                }), c.multiple) {
                                g.readValue = function() {
                                    var a = [];
                                    return d(b.find("option"), function(b) {
                                        b.selected && a.push(b.value)
                                    }), a
                                }, g.writeValue = function(a) {
                                    var c = new Ka(a);
                                    d(b.find("option"), function(a) {
                                        a.selected = r(c.get(a.value))
                                    })
                                };
                                var h, i = NaN;
                                a.$watch(function() {
                                    i !== f.$viewValue || I(h, f.$viewValue) || (h = ia(f.$viewValue), f.$render()), i = f.$viewValue
                                }), f.$isEmpty = function(a) {
                                    return !a || 0 === a.length
                                }
                            }
                        }
                    },
                    post: function(a, b, c, d) {
                        var e = d[1];
                        if (e) {
                            var f = d[0];
                            e.$render = function() {
                                f.writeValue(e.$viewValue)
                            }
                        }
                    }
                }
            }
        },
        kg = ["$interpolate", function(a) {
            return {
                restrict: "E",
                priority: 100,
                compile: function(b, c) {
                    if (r(c.value)) var d = a(c.value, !0);
                    else {
                        var e = a(b.text(), !0);
                        e || c.$set("value", b.text())
                    }
                    return function(a, b, c) {
                        var f = b.parent();
                        (f = f.data("$selectController") || f.parent().data("$selectController")) && f.registerOption(a, b, c, d, e)
                    }
                }
            }
        }],
        lg = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, b, c, d) {
                    d && (c.required = !0, d.$validators.required = function(a, b) {
                        return !c.required || !d.$isEmpty(b)
                    }, c.$observe("required", function() {
                        d.$validate()
                    }))
                }
            }
        },
        mg = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, c, d, e) {
                    if (e) {
                        var f, g = d.ngPattern || d.pattern;
                        d.$observe("pattern", function(a) {
                            if (u(a) && 0 < a.length && (a = new RegExp("^" + a + "$")), a && !a.test) throw b("ngPattern")("noregexp", g, a, Q(c));
                            f = a || void 0, e.$validate()
                        }), e.$validators.pattern = function(a, b) {
                            return e.$isEmpty(b) || q(f) || f.test(b)
                        }
                    }
                }
            }
        },
        ng = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, b, c, d) {
                    if (d) {
                        var e = -1;
                        c.$observe("maxlength", function(a) {
                            a = k(a), e = id(a) ? -1 : a, d.$validate()
                        }), d.$validators.maxlength = function(a, b) {
                            return 0 > e || d.$isEmpty(b) || b.length <= e
                        }
                    }
                }
            }
        },
        og = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(a, b, c, d) {
                    if (d) {
                        var e = 0;
                        c.$observe("minlength", function(a) {
                            e = k(a) || 0, d.$validate()
                        }), d.$validators.minlength = function(a, b) {
                            return d.$isEmpty(b) || b.length >= e
                        }
                    }
                }
            }
        };
    a.angular.bootstrap ? a.console && console.log("WARNING: Tried to load angular more than once.") : (aa(), ja(gd), gd.module("ngLocale", [], ["$provide", function(a) {
        function b(a) {
            a += "";
            var b = a.indexOf(".");
            return -1 == b ? 0 : a.length - b - 1
        }
        a.value("$locale", {
            DATETIME_FORMATS: {
                AMPMS: ["AM", "PM"],
                DAY: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                ERANAMES: ["Before Christ", "Anno Domini"],
                ERAS: ["BC", "AD"],
                FIRSTDAYOFWEEK: 6,
                MONTH: "January February March April May June July August September October November December".split(" "),
                SHORTDAY: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
                SHORTMONTH: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                STANDALONEMONTH: "January February March April May June July August September October November December".split(" "),
                WEEKENDRANGE: [5, 6],
                fullDate: "EEEE, MMMM d, y",
                longDate: "MMMM d, y",
                medium: "MMM d, y h:mm:ss a",
                mediumDate: "MMM d, y",
                mediumTime: "h:mm:ss a",
                "short": "M/d/yy h:mm a",
                shortDate: "M/d/yy",
                shortTime: "h:mm a"
            },
            NUMBER_FORMATS: {
                CURRENCY_SYM: "$",
                DECIMAL_SEP: ".",
                GROUP_SEP: ",",
                PATTERNS: [{
                    gSize: 3,
                    lgSize: 3,
                    maxFrac: 3,
                    minFrac: 0,
                    minInt: 1,
                    negPre: "-",
                    negSuf: "",
                    posPre: "",
                    posSuf: ""
                }, {
                    gSize: 3,
                    lgSize: 3,
                    maxFrac: 2,
                    minFrac: 2,
                    minInt: 1,
                    negPre: "-¤",
                    negSuf: "",
                    posPre: "¤",
                    posSuf: ""
                }]
            },
            id: "en-us",
            localeID: "en_US",
            pluralCat: function(a, c) {
                var d = 0 | a,
                    e = c;
                return void 0 === e && (e = Math.min(b(a), 3)), Math.pow(10, e), 1 == d && 0 == e ? "one" : "other"
            }
        })
    }]), Vc(a.document).ready(function() {
        X(a.document, Y)
    }))
}(window), !window.angular.$$csp().noInlineStyle && window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>'), tl = window.tl || {}, tl.pg = tl.pg || {}, tl.pg.pageGuideList = tl.pg.pageGuideList || [], tl.pg.interval = {},
    function(a) {
        tl.pg.default_prefs = {
            auto_show_first: !0,
            loading_selector: "#loading",
            track_events_cb: function() {},
            handle_doc_switch: null,
            custom_open_button: null,
            pg_caption: "page guide",
            tourtitle: "Open Page Guide for help",
            check_welcome_dismissed: function() {
                var a = "tlypageguide_welcome_shown_" + tl.pg.hashUrl();
                try {
                    if (localStorage.getItem(a)) return !0
                } catch (b) {
                    if (document.cookie.indexOf(a) > -1) return !0
                }
                return !1
            },
            dismiss_welcome: function() {
                var a = "tlypageguide_welcome_shown_" + tl.pg.hashUrl();
                try {
                    localStorage.setItem(a, !0)
                } catch (b) {
                    var c = new Date;
                    c.setDate(c.getDate() + 365), document.cookie = a + "=true; expires=" + c.toUTCString()
                }
            },
            ready_callback: null,
            pointer_fallback: !0,
            default_zindex: 100,
            steps_element: "#tlyPageGuide",
            auto_refresh: !1,
            refresh_welcome: !1,
            refresh_interval: 500
        }, tl.pg.wrapper_markup = '<div id="tlyPageGuideWrapper"><div id="tlyPageGuideOverlay"></div><div id="tlyPageGuideMessages"><a href="#" class="tlypageguide_close" title="Close Guide">close</a><span class="tlypageguide_index"></span><div class="tlypageguide_text"></div><a href="#" class="tlypageguide_back" title="Previous">Previous</a><a href="#" class="tlypageguide_fwd" title="Next">Next</a></div><div id="tlyPageGuideContent"></div><div id="tlyPageGuideToggles"></div></div>', tl.pg.toggle_markup = '<div class="tlypageguide_toggle" title="Launch Page Guide"><div><span class="tlypageguide_toggletitle"></span></div><a href="#" class="tlypageguide_close" title="close guide">close guide &raquo;</a></div>', tl.pg.init = function(b) {
            b = a.extend({}, tl.pg.default_prefs, b);
            var c = a(b.steps_element),
                d = tl.pg.hashCode(b.steps_element);
            if (clearInterval(tl.pg.interval[d]), 0 !== c.length) {
                b.pointer_fallback && tl.pg.pointerEventSupport() && (b.pointer_fallback = !1);
                var e = a("#tlyPageGuideWrapper"),
                    f = !0;
                if (e.length || (f = !1, e = a(tl.pg.wrapper_markup)), null == b.custom_open_button && a("#tlyPageGuideToggle" + d).length < 1) {
                    var g = c.data("tourtitle") || b.tourtitle,
                        h = a(tl.pg.toggle_markup).attr("id", "tlyPageGuideToggle" + d).prepend(b.pg_caption);
                    h.find(".tlypageguide_toggletitle").text(g), e.find("#tlyPageGuideToggles").append(h)
                }
                f || a("body").prepend(e);
                var i = new tl.pg.PageGuide(a("#tlyPageGuideWrapper"), b);
                return i.ready(function() {
                    i.setup_welcome(), i.preferences.welcome_refresh && i.updateTimer(function() {
                        i.setup_welcome()
                    }, "welcome"), i.setup_handlers(), i.$base.find(".tlypageguide_toggle").animate({
                        right: "-120px"
                    }, 250), "function" == typeof b.ready_callback && b.ready_callback()
                }), tl.pg.pageGuideList.push(i), i
            }
        }, tl.pg.PageGuide = function(b, c) {
            this.preferences = c, this.$base = b, this.$message = this.$base.find("#tlyPageGuideMessages"), this.$fwd = this.$base.find("a.tlypageguide_fwd"), this.$back = this.$base.find("a.tlypageguide_back"), this.$content = this.$base.find("#tlyPageGuideContent"), this.$steps = a(c.steps_element), this.uuid = tl.pg.hashCode(c.steps_element), this.$toggle = this.$base.find("#tlyPageGuideToggle" + this.uuid), this.cur_idx = 0, this.cur_selector = null, this.track_event = this.preferences.track_events_cb, this.handle_doc_switch = this.preferences.handle_doc_switch, this.custom_open_button = this.preferences.custom_open_button, this.is_open = !1, this.targetData = {}, this.hashTable = {}, this.changeQueue = [], this.visibleTargets = [], this.timer = {
                overlay: null,
                welcome: null
            }
        }, tl.pg.hashUrl = function() {
            return tl.pg.hashCode(window.location.href)
        }, tl.pg.hashCode = function(a) {
            var b, c, d = 0;
            if (null == a || 0 === a.length) return d;
            for (b = 0; b < a.length; b++) c = a.charCodeAt(b), d = (d << 5) - d + c, d &= d;
            return d.toString()
        }, tl.pg.isScrolledIntoView = function(b, c) {
            var d = a(window).scrollTop(),
                e = d + a(window).height(),
                f = a(b).offset().top,
                g = f + a(b).height();
            return f >= d && e - c >= g
        }, tl.pg.destroy = function() {
            a("#tlyPageGuideWrapper").remove(), a("body").removeClass("tlypageguide-open"), a("body").removeClass("tlyPageGuideWelcomeOpen");
            for (var b in tl.pg.interval) tl.pg.interval.hasOwnProperty(b) && clearInterval(tl.pg.interval[b])
        }, tl.pg.pointerEventSupport = function() {
            var a = document.createElement("x"),
                b = document.documentElement,
                c = window.getComputedStyle,
                d = null;
            return "pointerEvents" in a.style && (a.style.pointerEvents = "auto", a.style.pointerEvents = "x", b.appendChild(a), d = c && "auto" === c(a, "").pointerEvents, b.removeChild(a), !!d)
        }, tl.pg.closeOpenGuides = function(a) {
            for (var b = 0; b < tl.pg.pageGuideList.length; b++) tl.pg.pageGuideList[b].uuid !== a && tl.pg.pageGuideList[b].close()
        }, tl.pg.PageGuide.prototype.setup_welcome = function() {
            var b = a(".tlyPageGuideWelcome, #tlyPageGuideWelcome").not("#tlyPageGuideWrapper > .tlyPageGuideWelcome, #tlyPageGuideWrapper > #tlyPageGuideWelcome").eq(0),
                c = this;
            b.length > 0 && (c.preferences.show_welcome = !c.preferences.check_welcome_dismissed(), c.preferences.show_welcome && b.appendTo(c.$base), b.find(".tlypageguide_ignore").length && b.on("click", ".tlypageguide_ignore", function() {
                c.close_welcome(), c.track_event("PG.ignoreWelcome")
            }), b.find(".tlypageguide_dismiss").length && b.on("click", ".tlypageguide_dismiss", function() {
                c.close_welcome(), c.preferences.dismiss_welcome(), c.track_event("PG.dismissWelcome")
            }), b.on("click", ".tlypageguide_start", function() {
                c.open(), c.track_event("PG.startFromWelcome")
            }), c.preferences.show_welcome && c.pop_welcome())
        }, tl.pg.PageGuide.prototype.ready = function(b) {
            var c = this;
            return tl.pg.interval[c.uuid] = window.setInterval(function() {
                a(c.preferences.loading_selector).is(":visible") || (b(), clearInterval(tl.pg.interval[c.uuid]))
            }, 250), this
        }, tl.pg.PageGuide.prototype.addSteps = function() {
            var b = this;
            b.$steps.find("li").each(function(c, d) {
                var e = a(d),
                    f = e.data("tourtarget"),
                    g = e.attr("class");
                if (null == b.targetData[f]) {
                    b.targetData[f] = {
                        targetStyle: {},
                        content: e.html()
                    };
                    var h = tl.pg.hashCode(f) + "";
                    b.hashTable[h] = f, b.$content.append('<div class="tlypageguide_shadow tlypageguide_shadow' + h + '" data-selectorhash="' + h + '"><span class="tlyPageGuideStepIndex ' + g + '"></span></div>')
                }
            })
        }, tl.pg.PageGuide.prototype.checkTargets = function() {
            var b = this,
                c = 0,
                d = [];
            for (var e in b.targetData) {
                for (var f, g = a(e), h = {
                        targetStyle: {
                            display: "none"
                        }
                    }, i = 0; i < g.length; i++)
                    if (a(g[i]).is(":visible")) {
                        f = a(g[i]), h.targetStyle.display = "block";
                        var j = f.offset();
                        a.extend(h.targetStyle, {
                            top: j.top,
                            left: j.left,
                            width: f.outerWidth(),
                            height: f.outerHeight(),
                            "z-index": f.css("z-index")
                        }), c++, h.index = c, d.push(e);
                        break
                    } var k = {
                    target: e
                };
                for (var l in h.targetStyle) h.targetStyle[l] !== b.targetData[e][l] && (null == k.targetStyle && (k.targetStyle = {}), k.targetStyle[l] = h.targetStyle[l]);
                h.index !== b.targetData[e].index && (k.index = h.index), (null != k.targetStyle || null != k.index) && b.changeQueue.push(k), a.extend(b.targetData[e], h)
            }
            b.visibleTargets = d
        }, tl.pg.PageGuide.prototype.positionOverlays = function() {
            for (var b = 0; b < this.changeQueue.length; b++) {
                var c = this.changeQueue[b],
                    d = ".tlypageguide_shadow" + tl.pg.hashCode(c.target),
                    e = this.$content.find(d);
                if (null != c.targetStyle) {
                    var f = a.extend({}, c.targetStyle);
                    for (var g in f) "z-index" === g && (f[g] = "number" == typeof f[g] ? f[g] + 1 : this.preferences.default_zindex);
                    e.css(f)
                }
                null != c.index && e.find(".tlyPageGuideStepIndex").text(c.index)
            }
            this.changeQueue = []
        }, tl.pg.PageGuide.prototype.refreshVisibleSteps = function() {
            this.addSteps(), this.checkTargets(), this.positionOverlays()
        }, tl.pg.PageGuide.prototype.updateVisible = function() {
            if (this.refreshVisibleSteps(), null != this.cur_selector && this.cur_selector !== this.visibleTargets[this.cur_idx]) {
                var a = this.cur_idx % this.visibleTargets.length;
                this.show_message(a)
            }
        }, tl.pg.PageGuide.prototype.show_message = function(b) {
            var c = this.visibleTargets[b],
                d = this.targetData[c];
            if (null != d) {
                var e = ".tlypageguide_shadow" + tl.pg.hashCode(c);
                if (this.handle_doc_switch) {
                    var f = this.visibleTargets.length,
                        g = this.visibleTargets[(b - 1 + f) % f];
                    this.handle_doc_switch(c, g)
                }
                this.$content.find(".tlypageguide-active").removeClass("tlypageguide-active"), this.$content.find(e).addClass("tlypageguide-active"), this.$message.find(".tlypageguide_text").html(d.content), this.cur_idx = b, this.cur_selector = c;
                var h = 100,
                    i = parseFloat(this.$message.css("height"));
                this.$message.css("height", "auto");
                var j = parseFloat(this.$message.outerHeight());
                this.$message.css("height", i), h > j && (j = h), j > a(window).height() / 2 && (j = a(window).height() / 2), this.$message.show().animate({
                    height: j
                }, 500), tl.pg.isScrolledIntoView(a(c), this.$message.outerHeight()) || a("html,body").animate({
                    scrollTop: d.targetStyle.top - 50
                }, 500), this.roll_number(this.$message.find("span"), d.index)
            }
        }, tl.pg.PageGuide.prototype.navigateBack = function() {
            var a = (this.cur_idx + this.visibleTargets.length - 1) % this.visibleTargets.length;
            return this.track_event("PG.back"), this.show_message(a, !0), !1
        }, tl.pg.PageGuide.prototype.navigateForward = function() {
            var a = (this.cur_idx + 1) % this.visibleTargets.length;
            return this.track_event("PG.fwd"), this.show_message(a, !0), !1
        }, tl.pg.PageGuide.prototype.open = function() {
            this.is_open || (tl.pg.closeOpenGuides(this.uuid), this._open())
        }, tl.pg.PageGuide.prototype._open = function() {
            this.preferences.show_welcome && (this.preferences.dismiss_welcome(), this.close_welcome()), this.is_open = !0, this.track_event("PG.open"), this.refreshVisibleSteps(), this.preferences.auto_show_first && this.visibleTargets.length && this.show_message(0), a("body").addClass("tlypageguide-open"), this.$toggle.addClass("tlyPageGuideToggleActive");
            var b = this;
            b.preferences.auto_refresh && b.updateTimer(function() {
                b.updateVisible()
            }, "overlay")
        }, tl.pg.PageGuide.prototype.updateTimer = function(a, b) {
            var c = this;
            a(), c.timer[b] = setTimeout(function() {
                c.updateTimer(a, b)
            }, c.preferences.refresh_interval)
        }, tl.pg.PageGuide.prototype.close = function() {
            this.is_open && this._close()
        }, tl.pg.PageGuide.prototype._close = function() {
            this.is_open = !1, this.track_event("PG.close"), this.preferences.auto_refresh && clearTimeout(this.timer.overlay), this.$content.find(".tlypageguide_shadow").css("display", "none"), this.$content.find(".tlypageguide-active").removeClass("tlypageguide-active"), this.$message.animate({
                height: "0"
            }, 500, function() {
                a(this).hide()
            }), a("body").removeClass("tlypageguide-open"), this.$toggle.removeClass("tlyPageGuideToggleActive")
        }, tl.pg.PageGuide.prototype.setup_handlers = function() {
            var b = this,
                c = null == b.custom_open_button ? b.$base.find("#tlyPageGuideToggle" + b.uuid) : a(b.custom_open_button);
            c.off(), c.on("click", function() {
                b.is_open ? b.close() : !b.preferences.show_welcome || b.preferences.check_welcome_dismissed() || a("body").hasClass("tlyPageGuideWelcomeOpen") ? b.open() : b.pop_welcome()
            }), a(".tlypageguide_close", b.$message.add(a(".tlypageguide_toggle"))).on("click", function() {
                return b.close(), !1
            }), b.$base.on("click", ".tlyPageGuideStepIndex", function() {
                var c = b.hashTable[a(this).parent().data("selectorhash")],
                    d = b.targetData[c],
                    e = d ? d.index : 1;
                b.track_event("PG.specific_elt"), b.show_message(e - 1)
            }), b.$fwd.on("click", function() {
                return b.is_open && b.navigateForward(), !1
            }), b.$back.on("click", function() {
                return b.is_open && b.navigateBack(), !1
            }), b.preferences.pointer_fallback && b.$base.on("click", ".tlypageguide_shadow", function(b) {
                a(this).hide();
                var c = a(document.elementFromPoint(b.clientX, b.clientY));
                c.is("a") ? c.get(0).click() : c.trigger(b.type), a(this).show()
            }), a(window).resize(function() {
                b.is_open && b.refreshVisibleSteps()
            })
        }, tl.pg.PageGuide.prototype.roll_number = function(a, b, c) {
            a.animate({
                "text-indent": (c ? "" : "-") + "50px"
            }, "fast", function() {
                a.html(b), a.css({
                    "text-indent": (c ? "-" : "") + "50px"
                }, "fast").animate({
                    "text-indent": "0"
                }, "fast")
            })
        }, tl.pg.PageGuide.prototype.pop_welcome = function() {
            a("body").addClass("tlyPageGuideWelcomeOpen"), this.track_event("PG.welcomeShown")
        }, tl.pg.PageGuide.prototype.close_welcome = function() {
            a("body").removeClass("tlyPageGuideWelcomeOpen")
        }
    }(jQuery), angular.module("ui.bootstrap", ["ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.isClass", "ui.bootstrap.datepicker", "ui.bootstrap.position", "ui.bootstrap.datepickerPopup", "ui.bootstrap.debounce", "ui.bootstrap.dropdown", "ui.bootstrap.stackedMap", "ui.bootstrap.modal", "ui.bootstrap.paging", "ui.bootstrap.pager", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.collapse", []).directive("uibCollapse", ["$animate", "$q", "$parse", "$injector", function(a, b, c, d) {
        var e = d.has("$animateCss") ? d.get("$animateCss") : null;
        return {
            link: function(d, f, g) {
                function h() {
                    f.hasClass("collapse") && f.hasClass("in") || b.resolve(l(d)).then(function() {
                        f.removeClass("collapse").addClass("collapsing").attr("aria-expanded", !0).attr("aria-hidden", !1), e ? e(f, {
                            addClass: "in",
                            easing: "ease",
                            to: {
                                height: f[0].scrollHeight + "px"
                            }
                        }).start()["finally"](i) : a.addClass(f, "in", {
                            to: {
                                height: f[0].scrollHeight + "px"
                            }
                        }).then(i)
                    })
                }

                function i() {
                    f.removeClass("collapsing").addClass("collapse").css({
                        height: "auto"
                    }), m(d)
                }

                function j() {
                    return f.hasClass("collapse") || f.hasClass("in") ? void b.resolve(n(d)).then(function() {
                        f.css({
                            height: f[0].scrollHeight + "px"
                        }).removeClass("collapse").addClass("collapsing").attr("aria-expanded", !1).attr("aria-hidden", !0), e ? e(f, {
                            removeClass: "in",
                            to: {
                                height: "0"
                            }
                        }).start()["finally"](k) : a.removeClass(f, "in", {
                            to: {
                                height: "0"
                            }
                        }).then(k)
                    }) : k()
                }

                function k() {
                    f.css({
                        height: "0"
                    }), f.removeClass("collapsing").addClass("collapse"), o(d)
                }
                var l = c(g.expanding),
                    m = c(g.expanded),
                    n = c(g.collapsing),
                    o = c(g.collapsed);
                d.$eval(g.uibCollapse) || f.addClass("in").addClass("collapse").attr("aria-expanded", !0).attr("aria-hidden", !1).css({
                    height: "auto"
                }), d.$watch(g.uibCollapse, function(a) {
                    a ? j() : h()
                })
            }
        }
    }]), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("uibAccordionConfig", {
        closeOthers: !0
    }).controller("UibAccordionController", ["$scope", "$attrs", "uibAccordionConfig", function(a, b, c) {
        this.groups = [], this.closeOthers = function(d) {
            var e = angular.isDefined(b.closeOthers) ? a.$eval(b.closeOthers) : c.closeOthers;
            e && angular.forEach(this.groups, function(a) {
                a !== d && (a.isOpen = !1)
            })
        }, this.addGroup = function(a) {
            var b = this;
            this.groups.push(a), a.$on("$destroy", function(c) {
                b.removeGroup(a)
            })
        }, this.removeGroup = function(a) {
            var b = this.groups.indexOf(a);
            b !== -1 && this.groups.splice(b, 1)
        }
    }]).directive("uibAccordion", function() {
        return {
            controller: "UibAccordionController",
            controllerAs: "accordion",
            transclude: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/accordion/accordion.html"
            }
        }
    }).directive("uibAccordionGroup", function() {
        return {
            require: "^uibAccordion",
            transclude: !0,
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/accordion/accordion-group.html"
            },
            scope: {
                heading: "@",
                panelClass: "@?",
                isOpen: "=?",
                isDisabled: "=?"
            },
            controller: function() {
                this.setHeading = function(a) {
                    this.heading = a
                }
            },
            link: function(a, b, c, d) {
                d.addGroup(a), a.openClass = c.openClass || "panel-open", a.panelClass = c.panelClass || "panel-default", a.$watch("isOpen", function(c) {
                    b.toggleClass(a.openClass, !!c), c && d.closeOthers(a)
                }), a.toggleOpen = function(b) {
                    a.isDisabled || b && 32 !== b.which || (a.isOpen = !a.isOpen)
                };
                var e = "accordiongroup-" + a.$id + "-" + Math.floor(1e4 * Math.random());
                a.headingId = e + "-tab", a.panelId = e + "-panel"
            }
        }
    }).directive("uibAccordionHeading", function() {
        return {
            transclude: !0,
            template: "",
            replace: !0,
            require: "^uibAccordionGroup",
            link: function(a, b, c, d, e) {
                d.setHeading(e(a, angular.noop))
            }
        }
    }).directive("uibAccordionTransclude", function() {
        function a() {
            return "uib-accordion-header,data-uib-accordion-header,x-uib-accordion-header,uib\\:accordion-header,[uib-accordion-header],[data-uib-accordion-header],[x-uib-accordion-header]"
        }
        return {
            require: "^uibAccordionGroup",
            link: function(b, c, d, e) {
                b.$watch(function() {
                    return e[d.uibAccordionTransclude]
                }, function(b) {
                    if (b) {
                        var d = angular.element(c[0].querySelector(a()));
                        d.html(""), d.append(b)
                    }
                })
            }
        }
    }), angular.module("ui.bootstrap.alert", []).controller("UibAlertController", ["$scope", "$attrs", "$interpolate", "$timeout", function(a, b, c, d) {
        a.closeable = !!b.close;
        var e = angular.isDefined(b.dismissOnTimeout) ? c(b.dismissOnTimeout)(a.$parent) : null;
        e && d(function() {
            a.close()
        }, parseInt(e, 10))
    }]).directive("uibAlert", function() {
        return {
            controller: "UibAlertController",
            controllerAs: "alert",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/alert/alert.html"
            },
            transclude: !0,
            replace: !0,
            scope: {
                type: "@",
                close: "&"
            }
        }
    }), angular.module("ui.bootstrap.buttons", []).constant("uibButtonConfig", {
        activeClass: "active",
        toggleEvent: "click"
    }).controller("UibButtonsController", ["uibButtonConfig", function(a) {
        this.activeClass = a.activeClass || "active", this.toggleEvent = a.toggleEvent || "click"
    }]).directive("uibBtnRadio", ["$parse", function(a) {
        return {
            require: ["uibBtnRadio", "ngModel"],
            controller: "UibButtonsController",
            controllerAs: "buttons",
            link: function(b, c, d, e) {
                var f = e[0],
                    g = e[1],
                    h = a(d.uibUncheckable);
                c.find("input").css({
                    display: "none"
                }), g.$render = function() {
                    c.toggleClass(f.activeClass, angular.equals(g.$modelValue, b.$eval(d.uibBtnRadio)))
                }, c.on(f.toggleEvent, function() {
                    if (!d.disabled) {
                        var a = c.hasClass(f.activeClass);
                        a && !angular.isDefined(d.uncheckable) || b.$apply(function() {
                            g.$setViewValue(a ? null : b.$eval(d.uibBtnRadio)), g.$render()
                        })
                    }
                }), d.uibUncheckable && b.$watch(h, function(a) {
                    d.$set("uncheckable", a ? "" : void 0)
                })
            }
        }
    }]).directive("uibBtnCheckbox", function() {
        return {
            require: ["uibBtnCheckbox", "ngModel"],
            controller: "UibButtonsController",
            controllerAs: "button",
            link: function(a, b, c, d) {
                function e() {
                    return g(c.btnCheckboxTrue, !0)
                }

                function f() {
                    return g(c.btnCheckboxFalse, !1)
                }

                function g(b, c) {
                    return angular.isDefined(b) ? a.$eval(b) : c
                }
                var h = d[0],
                    i = d[1];
                b.find("input").css({
                    display: "none"
                }), i.$render = function() {
                    b.toggleClass(h.activeClass, angular.equals(i.$modelValue, e()))
                }, b.on(h.toggleEvent, function() {
                    c.disabled || a.$apply(function() {
                        i.$setViewValue(b.hasClass(h.activeClass) ? f() : e()), i.$render()
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.carousel", []).controller("UibCarouselController", ["$scope", "$element", "$interval", "$timeout", "$animate", function(a, b, c, d, e) {
        function f() {
            for (; t.length;) t.shift()
        }

        function g(a) {
            for (var b = 0; b < q.length; b++) q[b].slide.active = b === a
        }

        function h(c, d, i) {
            if (!u) {
                if (angular.extend(c, {
                        direction: i
                    }), angular.extend(q[s].slide || {}, {
                        direction: i
                    }), e.enabled(b) && !a.$currentTransition && q[d].element && p.slides.length > 1) {
                    q[d].element.data(r, c.direction);
                    var j = p.getCurrentIndex();
                    angular.isNumber(j) && q[j].element && q[j].element.data(r, c.direction), a.$currentTransition = !0, e.on("addClass", q[d].element, function(b, c) {
                        if ("close" === c && (a.$currentTransition = null, e.off("addClass", b), t.length)) {
                            var d = t.pop().slide,
                                g = d.index,
                                i = g > p.getCurrentIndex() ? "next" : "prev";
                            f(), h(d, g, i)
                        }
                    })
                }
                a.active = c.index, s = c.index, g(d), l()
            }
        }

        function i(a) {
            for (var b = 0; b < q.length; b++)
                if (q[b].slide === a) return b
        }

        function j() {
            n && (c.cancel(n), n = null)
        }

        function k(b) {
            b.length || (a.$currentTransition = null, f())
        }

        function l() {
            j();
            var b = +a.interval;
            !isNaN(b) && b > 0 && (n = c(m, b))
        }

        function m() {
            var b = +a.interval;
            o && !isNaN(b) && b > 0 && q.length ? a.next() : a.pause()
        }
        var n, o, p = this,
            q = p.slides = a.slides = [],
            r = "uib-slideDirection",
            s = a.active,
            t = [],
            u = !1;
        p.addSlide = function(b, c) {
            q.push({
                slide: b,
                element: c
            }), q.sort(function(a, b) {
                return +a.slide.index - +b.slide.index
            }), (b.index === a.active || 1 === q.length && !angular.isNumber(a.active)) && (a.$currentTransition && (a.$currentTransition = null), s = b.index, a.active = b.index, g(s), p.select(q[i(b)]), 1 === q.length && a.play())
        }, p.getCurrentIndex = function() {
            for (var a = 0; a < q.length; a++)
                if (q[a].slide.index === s) return a
        }, p.next = a.next = function() {
            var b = (p.getCurrentIndex() + 1) % q.length;
            return 0 === b && a.noWrap() ? void a.pause() : p.select(q[b], "next")
        }, p.prev = a.prev = function() {
            var b = p.getCurrentIndex() - 1 < 0 ? q.length - 1 : p.getCurrentIndex() - 1;
            return a.noWrap() && b === q.length - 1 ? void a.pause() : p.select(q[b], "prev")
        }, p.removeSlide = function(b) {
            var c = i(b),
                d = t.indexOf(q[c]);
            d !== -1 && t.splice(d, 1), q.splice(c, 1), q.length > 0 && s === c ? c >= q.length ? (s = q.length - 1, a.active = s, g(s), p.select(q[q.length - 1])) : (s = c, a.active = s, g(s), p.select(q[c])) : s > c && (s--, a.active = s), 0 === q.length && (s = null, a.active = null, f())
        }, p.select = a.select = function(b, c) {
            var d = i(b.slide);
            void 0 === c && (c = d > p.getCurrentIndex() ? "next" : "prev"), b.slide.index === s || a.$currentTransition ? b && b.slide.index !== s && a.$currentTransition && t.push(q[d]) : h(b.slide, d, c)
        }, a.indexOfSlide = function(a) {
            return +a.slide.index
        }, a.isActive = function(b) {
            return a.active === b.slide.index
        }, a.isPrevDisabled = function() {
            return 0 === a.active && a.noWrap()
        }, a.isNextDisabled = function() {
            return a.active === q.length - 1 && a.noWrap()
        }, a.pause = function() {
            a.noPause || (o = !1, j())
        }, a.play = function() {
            o || (o = !0, l())
        }, a.$on("$destroy", function() {
            u = !0, j()
        }), a.$watch("noTransition", function(a) {
            e.enabled(b, !a)
        }), a.$watch("interval", l), a.$watchCollection("slides", k), a.$watch("active", function(a) {
            if (angular.isNumber(a) && s !== a) {
                for (var b = 0; b < q.length; b++)
                    if (q[b].slide.index === a) {
                        a = b;
                        break
                    } var c = q[a];
                c && (g(a), p.select(q[a]), s = a)
            }
        })
    }]).directive("uibCarousel", function() {
        return {
            transclude: !0,
            replace: !0,
            controller: "UibCarouselController",
            controllerAs: "carousel",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/carousel/carousel.html"
            },
            scope: {
                active: "=",
                interval: "=",
                noTransition: "=",
                noPause: "=",
                noWrap: "&"
            }
        }
    }).directive("uibSlide", function() {
        return {
            require: "^uibCarousel",
            transclude: !0,
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/carousel/slide.html"
            },
            scope: {
                actual: "=?",
                index: "=?"
            },
            link: function(a, b, c, d) {
                d.addSlide(a, b), a.$on("$destroy", function() {
                    d.removeSlide(a)
                })
            }
        }
    }).animation(".item", ["$animateCss", function(a) {
        function b(a, b, c) {
            a.removeClass(b), c && c()
        }
        var c = "uib-slideDirection";
        return {
            beforeAddClass: function(d, e, f) {
                if ("active" === e) {
                    var g = !1,
                        h = d.data(c),
                        i = "next" === h ? "left" : "right",
                        j = b.bind(this, d, i + " " + h, f);
                    return d.addClass(h), a(d, {
                            addClass: i
                        }).start().done(j),
                        function() {
                            g = !0
                        }
                }
                f()
            },
            beforeRemoveClass: function(d, e, f) {
                if ("active" === e) {
                    var g = !1,
                        h = d.data(c),
                        i = "next" === h ? "left" : "right",
                        j = b.bind(this, d, i, f);
                    return a(d, {
                            addClass: i
                        }).start().done(j),
                        function() {
                            g = !0
                        }
                }
                f()
            }
        }
    }]), angular.module("ui.bootstrap.dateparser", []).service("uibDateParser", ["$log", "$locale", "dateFilter", "orderByFilter", function(a, b, c, d) {
        function e(a, b) {
            var c = [],
                e = a.split(""),
                f = a.indexOf("'");
            if (f > -1) {
                var g = !1;
                a = a.split("");
                for (var h = f; h < a.length; h++) g ? ("'" === a[h] && (h + 1 < a.length && "'" === a[h + 1] ? (a[h + 1] = "$", e[h + 1] = "") : (e[h] = "", g = !1)), a[h] = "$") : "'" === a[h] && (a[h] = "$", e[h] = "", g = !0);
                a = a.join("")
            }
            return angular.forEach(n, function(d) {
                var f = a.indexOf(d.key);
                if (f > -1) {
                    a = a.split(""), e[f] = "(" + d.regex + ")", a[f] = "$";
                    for (var g = f + 1, h = f + d.key.length; g < h; g++) e[g] = "", a[g] = "$";
                    a = a.join(""), c.push({
                        index: f,
                        key: d.key,
                        apply: d[b],
                        matcher: d.regex
                    })
                }
            }), {
                regex: new RegExp("^" + e.join("") + "$"),
                map: d(c, "index")
            }
        }

        function f(a, b, c) {
            return !(c < 1) && (1 === b && c > 28 ? 29 === c && (a % 4 === 0 && a % 100 !== 0 || a % 400 === 0) : 3 !== b && 5 !== b && 8 !== b && 10 !== b || c < 31)
        }

        function g(a) {
            return parseInt(a, 10)
        }

        function h(a, b) {
            return a && b ? l(a, b) : a
        }

        function i(a, b) {
            return a && b ? l(a, b, !0) : a
        }

        function j(a, b) {
            a = a.replace(/:/g, "");
            var c = Date.parse("Jan 01, 1970 00:00:00 " + a) / 6e4;
            return isNaN(c) ? b : c
        }

        function k(a, b) {
            return a = new Date(a.getTime()), a.setMinutes(a.getMinutes() + b), a
        }

        function l(a, b, c) {
            c = c ? -1 : 1;
            var d = a.getTimezoneOffset(),
                e = j(b, d);
            return k(a, c * (e - d))
        }
        var m, n, o = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
        this.init = function() {
            m = b.id, this.parsers = {}, this.formatters = {}, n = [{
                key: "yyyy",
                regex: "\\d{4}",
                apply: function(a) {
                    this.year = +a
                },
                formatter: function(a) {
                    var b = new Date;
                    return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yyyy")
                }
            }, {
                key: "yy",
                regex: "\\d{2}",
                apply: function(a) {
                    a = +a, this.year = a < 69 ? a + 2e3 : a + 1900
                },
                formatter: function(a) {
                    var b = new Date;
                    return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yy")
                }
            }, {
                key: "y",
                regex: "\\d{1,4}",
                apply: function(a) {
                    this.year = +a
                },
                formatter: function(a) {
                    var b = new Date;
                    return b.setFullYear(Math.abs(a.getFullYear())), c(b, "y")
                }
            }, {
                key: "M!",
                regex: "0?[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                },
                formatter: function(a) {
                    var b = a.getMonth();
                    return /^[0-9]$/.test(b) ? c(a, "MM") : c(a, "M")
                }
            }, {
                key: "MMMM",
                regex: b.DATETIME_FORMATS.MONTH.join("|"),
                apply: function(a) {
                    this.month = b.DATETIME_FORMATS.MONTH.indexOf(a)
                },
                formatter: function(a) {
                    return c(a, "MMMM")
                }
            }, {
                key: "MMM",
                regex: b.DATETIME_FORMATS.SHORTMONTH.join("|"),
                apply: function(a) {
                    this.month = b.DATETIME_FORMATS.SHORTMONTH.indexOf(a)
                },
                formatter: function(a) {
                    return c(a, "MMM")
                }
            }, {
                key: "MM",
                regex: "0[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                },
                formatter: function(a) {
                    return c(a, "MM")
                }
            }, {
                key: "M",
                regex: "[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                },
                formatter: function(a) {
                    return c(a, "M")
                }
            }, {
                key: "d!",
                regex: "[0-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                },
                formatter: function(a) {
                    var b = a.getDate();
                    return /^[1-9]$/.test(b) ? c(a, "dd") : c(a, "d")
                }
            }, {
                key: "dd",
                regex: "[0-2][0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                },
                formatter: function(a) {
                    return c(a, "dd")
                }
            }, {
                key: "d",
                regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                },
                formatter: function(a) {
                    return c(a, "d")
                }
            }, {
                key: "EEEE",
                regex: b.DATETIME_FORMATS.DAY.join("|"),
                formatter: function(a) {
                    return c(a, "EEEE")
                }
            }, {
                key: "EEE",
                regex: b.DATETIME_FORMATS.SHORTDAY.join("|"),
                formatter: function(a) {
                    return c(a, "EEE")
                }
            }, {
                key: "HH",
                regex: "(?:0|1)[0-9]|2[0-3]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "HH")
                }
            }, {
                key: "hh",
                regex: "0[0-9]|1[0-2]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "hh")
                }
            }, {
                key: "H",
                regex: "1?[0-9]|2[0-3]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "H")
                }
            }, {
                key: "h",
                regex: "[0-9]|1[0-2]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "h")
                }
            }, {
                key: "mm",
                regex: "[0-5][0-9]",
                apply: function(a) {
                    this.minutes = +a
                },
                formatter: function(a) {
                    return c(a, "mm")
                }
            }, {
                key: "m",
                regex: "[0-9]|[1-5][0-9]",
                apply: function(a) {
                    this.minutes = +a
                },
                formatter: function(a) {
                    return c(a, "m")
                }
            }, {
                key: "sss",
                regex: "[0-9][0-9][0-9]",
                apply: function(a) {
                    this.milliseconds = +a
                },
                formatter: function(a) {
                    return c(a, "sss")
                }
            }, {
                key: "ss",
                regex: "[0-5][0-9]",
                apply: function(a) {
                    this.seconds = +a
                },
                formatter: function(a) {
                    return c(a, "ss")
                }
            }, {
                key: "s",
                regex: "[0-9]|[1-5][0-9]",
                apply: function(a) {
                    this.seconds = +a
                },
                formatter: function(a) {
                    return c(a, "s")
                }
            }, {
                key: "a",
                regex: b.DATETIME_FORMATS.AMPMS.join("|"),
                apply: function(a) {
                    12 === this.hours && (this.hours = 0), "PM" === a && (this.hours += 12)
                },
                formatter: function(a) {
                    return c(a, "a")
                }
            }, {
                key: "Z",
                regex: "[+-]\\d{4}",
                apply: function(a) {
                    var b = a.match(/([+-])(\d{2})(\d{2})/),
                        c = b[1],
                        d = b[2],
                        e = b[3];
                    this.hours += g(c + d), this.minutes += g(c + e)
                },
                formatter: function(a) {
                    return c(a, "Z")
                }
            }, {
                key: "ww",
                regex: "[0-4][0-9]|5[0-3]",
                formatter: function(a) {
                    return c(a, "ww")
                }
            }, {
                key: "w",
                regex: "[0-9]|[1-4][0-9]|5[0-3]",
                formatter: function(a) {
                    return c(a, "w")
                }
            }, {
                key: "GGGG",
                regex: b.DATETIME_FORMATS.ERANAMES.join("|").replace(/\s/g, "\\s"),
                formatter: function(a) {
                    return c(a, "GGGG")
                }
            }, {
                key: "GGG",
                regex: b.DATETIME_FORMATS.ERAS.join("|"),
                formatter: function(a) {
                    return c(a, "GGG")
                }
            }, {
                key: "GG",
                regex: b.DATETIME_FORMATS.ERAS.join("|"),
                formatter: function(a) {
                    return c(a, "GG")
                }
            }, {
                key: "G",
                regex: b.DATETIME_FORMATS.ERAS.join("|"),
                formatter: function(a) {
                    return c(a, "G")
                }
            }]
        }, this.init(), this.filter = function(a, c) {
            if (!angular.isDate(a) || isNaN(a) || !c) return "";
            c = b.DATETIME_FORMATS[c] || c, b.id !== m && this.init(), this.formatters[c] || (this.formatters[c] = e(c, "formatter"));
            var d = this.formatters[c],
                f = d.map,
                g = c;
            return f.reduce(function(b, c, d) {
                var e = g.match(new RegExp("(.*)" + c.key));
                e && angular.isString(e[1]) && (b += e[1], g = g.replace(e[1] + c.key, ""));
                var h = d === f.length - 1 ? g : "";
                return c.apply ? b + c.apply.call(null, a) + h : b + h
            }, "")
        }, this.parse = function(c, d, g) {
            if (!angular.isString(c) || !d) return c;
            d = b.DATETIME_FORMATS[d] || d, d = d.replace(o, "\\$&"), b.id !== m && this.init(), this.parsers[d] || (this.parsers[d] = e(d, "apply"));
            var h = this.parsers[d],
                i = h.regex,
                j = h.map,
                k = c.match(i),
                l = !1;
            if (k && k.length) {
                var n, p;
                angular.isDate(g) && !isNaN(g.getTime()) ? n = {
                    year: g.getFullYear(),
                    month: g.getMonth(),
                    date: g.getDate(),
                    hours: g.getHours(),
                    minutes: g.getMinutes(),
                    seconds: g.getSeconds(),
                    milliseconds: g.getMilliseconds()
                } : (g && a.warn("dateparser:", "baseDate is not a valid date"), n = {
                    year: 1900,
                    month: 0,
                    date: 1,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0
                });
                for (var q = 1, r = k.length; q < r; q++) {
                    var s = j[q - 1];
                    "Z" === s.matcher && (l = !0), s.apply && s.apply.call(n, k[q])
                }
                var t = l ? Date.prototype.setUTCFullYear : Date.prototype.setFullYear,
                    u = l ? Date.prototype.setUTCHours : Date.prototype.setHours;
                return f(n.year, n.month, n.date) && (!angular.isDate(g) || isNaN(g.getTime()) || l ? (p = new Date(0), t.call(p, n.year, n.month, n.date), u.call(p, n.hours || 0, n.minutes || 0, n.seconds || 0, n.milliseconds || 0)) : (p = new Date(g), t.call(p, n.year, n.month, n.date), u.call(p, n.hours, n.minutes, n.seconds, n.milliseconds))), p
            }
        }, this.toTimezone = h, this.fromTimezone = i, this.timezoneToOffset = j, this.addDateMinutes = k, this.convertTimezoneToLocal = l
    }]), angular.module("ui.bootstrap.isClass", []).directive("uibIsClass", ["$animate", function(a) {
        var b = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/,
            c = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;
        return {
            restrict: "A",
            compile: function(d, e) {
                function f(a, b, c) {
                    i.push(a), j.push({
                        scope: a,
                        element: b
                    }), o.forEach(function(b, c) {
                        g(b, a)
                    }), a.$on("$destroy", h)
                }

                function g(b, d) {
                    var e = b.match(c),
                        f = d.$eval(e[1]),
                        g = e[2],
                        h = k[b];
                    if (!h) {
                        var i = function(b) {
                            var c = null;
                            j.some(function(a) {
                                var d = a.scope.$eval(m);
                                if (d === b) return c = a, !0
                            }), h.lastActivated !== c && (h.lastActivated && a.removeClass(h.lastActivated.element, f), c && a.addClass(c.element, f), h.lastActivated = c)
                        };
                        k[b] = h = {
                            lastActivated: null,
                            scope: d,
                            watchFn: i,
                            compareWithExp: g,
                            watcher: d.$watch(g, i)
                        }
                    }
                    h.watchFn(d.$eval(g))
                }

                function h(a) {
                    var b = a.targetScope,
                        c = i.indexOf(b);
                    if (i.splice(c, 1), j.splice(c, 1), i.length) {
                        var d = i[0];
                        angular.forEach(k, function(a) {
                            a.scope === b && (a.watcher = d.$watch(a.compareWithExp, a.watchFn), a.scope = d)
                        })
                    } else k = {}
                }
                var i = [],
                    j = [],
                    k = {},
                    l = e.uibIsClass.match(b),
                    m = l[2],
                    n = l[1],
                    o = n.split(",");
                return f
            }
        }
    }]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.isClass"]).value("$datepickerSuppressError", !1).value("$datepickerLiteralWarning", !0).constant("uibDatepickerConfig", {
        datepickerMode: "day",
        formatDay: "dd",
        formatMonth: "MMMM",
        formatYear: "yyyy",
        formatDayHeader: "EEE",
        formatDayTitle: "MMMM yyyy",
        formatMonthTitle: "yyyy",
        maxDate: null,
        maxMode: "year",
        minDate: null,
        minMode: "day",
        ngModelOptions: {},
        shortcutPropagation: !1,
        showWeeks: !0,
        yearColumns: 5,
        yearRows: 4
    }).controller("UibDatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$locale", "$log", "dateFilter", "uibDatepickerConfig", "$datepickerLiteralWarning", "$datepickerSuppressError", "uibDateParser", function(a, b, c, d, e, f, g, h, i, j, k) {
        function l(b) {
            a.datepickerMode = b, a.datepickerOptions.datepickerMode = b
        }
        var m = this,
            n = {
                $setViewValue: angular.noop
            },
            o = {},
            p = [];
        !!b.datepickerOptions;
        a.datepickerOptions || (a.datepickerOptions = {}), this.modes = ["day", "month", "year"], ["customClass", "dateDisabled", "datepickerMode", "formatDay", "formatDayHeader", "formatDayTitle", "formatMonth", "formatMonthTitle", "formatYear", "maxDate", "maxMode", "minDate", "minMode", "showWeeks", "shortcutPropagation", "startingDay", "yearColumns", "yearRows"].forEach(function(b) {
            switch (b) {
                case "customClass":
                case "dateDisabled":
                    a[b] = a.datepickerOptions[b] || angular.noop;
                    break;
                case "datepickerMode":
                    a.datepickerMode = angular.isDefined(a.datepickerOptions.datepickerMode) ? a.datepickerOptions.datepickerMode : h.datepickerMode;
                    break;
                case "formatDay":
                case "formatDayHeader":
                case "formatDayTitle":
                case "formatMonth":
                case "formatMonthTitle":
                case "formatYear":
                    m[b] = angular.isDefined(a.datepickerOptions[b]) ? d(a.datepickerOptions[b])(a.$parent) : h[b];
                    break;
                case "showWeeks":
                case "shortcutPropagation":
                case "yearColumns":
                case "yearRows":
                    m[b] = angular.isDefined(a.datepickerOptions[b]) ? a.datepickerOptions[b] : h[b];
                    break;
                case "startingDay":
                    angular.isDefined(a.datepickerOptions.startingDay) ? m.startingDay = a.datepickerOptions.startingDay : angular.isNumber(h.startingDay) ? m.startingDay = h.startingDay : m.startingDay = (e.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
                    break;
                case "maxDate":
                case "minDate":
                    a.$watch("datepickerOptions." + b, function(a) {
                        a ? angular.isDate(a) ? m[b] = k.fromTimezone(new Date(a), o.timezone) : (i && f.warn("Literal date support has been deprecated, please switch to date object usage"), m[b] = new Date(g(a, "medium"))) : m[b] = h[b] ? k.fromTimezone(new Date(h[b]), o.timezone) : null, m.refreshView()
                    });
                    break;
                case "maxMode":
                case "minMode":
                    a.datepickerOptions[b] ? a.$watch(function() {
                        return a.datepickerOptions[b]
                    }, function(c) {
                        m[b] = a[b] = angular.isDefined(c) ? c : datepickerOptions[b], ("minMode" === b && m.modes.indexOf(a.datepickerOptions.datepickerMode) < m.modes.indexOf(m[b]) || "maxMode" === b && m.modes.indexOf(a.datepickerOptions.datepickerMode) > m.modes.indexOf(m[b])) && (a.datepickerMode = m[b], a.datepickerOptions.datepickerMode = m[b])
                    }) : m[b] = a[b] = h[b] || null
            }
        }), a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()), a.disabled = angular.isDefined(b.disabled) || !1, angular.isDefined(b.ngDisabled) && p.push(a.$parent.$watch(b.ngDisabled, function(b) {
            a.disabled = b, m.refreshView()
        })), a.isActive = function(b) {
            return 0 === m.compare(b.date, m.activeDate) && (a.activeDateId = b.uid, !0)
        }, this.init = function(b) {
            n = b, o = b.$options || h.ngModelOptions, a.datepickerOptions.initDate ? (m.activeDate = k.fromTimezone(a.datepickerOptions.initDate, o.timezone) || new Date, a.$watch("datepickerOptions.initDate", function(a) {
                a && (n.$isEmpty(n.$modelValue) || n.$invalid) && (m.activeDate = k.fromTimezone(a, o.timezone), m.refreshView())
            })) : m.activeDate = new Date;
            var c = n.$modelValue ? new Date(n.$modelValue) : new Date;
            this.activeDate = isNaN(c) ? k.fromTimezone(new Date, o.timezone) : k.fromTimezone(c, o.timezone), n.$render = function() {
                m.render()
            }
        }, this.render = function() {
            if (n.$viewValue) {
                var a = new Date(n.$viewValue),
                    b = !isNaN(a);
                b ? this.activeDate = k.fromTimezone(a, o.timezone) : j || f.error('Datepicker directive: "ng-model" value must be a Date object')
            }
            this.refreshView()
        }, this.refreshView = function() {
            if (this.element) {
                a.selectedDt = null, this._refreshView(), a.activeDt && (a.activeDateId = a.activeDt.uid);
                var b = n.$viewValue ? new Date(n.$viewValue) : null;
                b = k.fromTimezone(b, o.timezone), n.$setValidity("dateDisabled", !b || this.element && !this.isDisabled(b))
            }
        }, this.createDateObject = function(b, c) {
            var d = n.$viewValue ? new Date(n.$viewValue) : null;
            d = k.fromTimezone(d, o.timezone);
            var e = new Date;
            e = k.fromTimezone(e, o.timezone);
            var f = this.compare(b, e),
                g = {
                    date: b,
                    label: k.filter(b, c),
                    selected: d && 0 === this.compare(b, d),
                    disabled: this.isDisabled(b),
                    past: f < 0,
                    current: 0 === f,
                    future: f > 0,
                    customClass: this.customClass(b) || null
                };
            return d && 0 === this.compare(b, d) && (a.selectedDt = g), m.activeDate && 0 === this.compare(g.date, m.activeDate) && (a.activeDt = g), g
        }, this.isDisabled = function(b) {
            return a.disabled || this.minDate && this.compare(b, this.minDate) < 0 || this.maxDate && this.compare(b, this.maxDate) > 0 || a.dateDisabled && a.dateDisabled({
                date: b,
                mode: a.datepickerMode
            })
        }, this.customClass = function(b) {
            return a.customClass({
                date: b,
                mode: a.datepickerMode
            })
        }, this.split = function(a, b) {
            for (var c = []; a.length > 0;) c.push(a.splice(0, b));
            return c
        }, a.select = function(b) {
            if (a.datepickerMode === m.minMode) {
                var c = n.$viewValue ? k.fromTimezone(new Date(n.$viewValue), o.timezone) : new Date(0, 0, 0, 0, 0, 0, 0);
                c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()), c = k.toTimezone(c, o.timezone), n.$setViewValue(c), n.$render()
            } else m.activeDate = b, l(m.modes[m.modes.indexOf(a.datepickerMode) - 1]), a.$emit("uib:datepicker.mode");
            a.$broadcast("uib:datepicker.focus")
        }, a.move = function(a) {
            var b = m.activeDate.getFullYear() + a * (m.step.years || 0),
                c = m.activeDate.getMonth() + a * (m.step.months || 0);
            m.activeDate.setFullYear(b, c, 1), m.refreshView()
        }, a.toggleMode = function(b) {
            b = b || 1, a.datepickerMode === m.maxMode && 1 === b || a.datepickerMode === m.minMode && b === -1 || (l(m.modes[m.modes.indexOf(a.datepickerMode) + b]), a.$emit("uib:datepicker.mode"))
        }, a.keys = {
            13: "enter",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
        var q = function() {
            m.element[0].focus()
        };
        a.$on("uib:datepicker.focus", q), a.keydown = function(b) {
            var c = a.keys[b.which];
            if (c && !b.shiftKey && !b.altKey && !a.disabled)
                if (b.preventDefault(), m.shortcutPropagation || b.stopPropagation(), "enter" === c || "space" === c) {
                    if (m.isDisabled(m.activeDate)) return;
                    a.select(m.activeDate)
                } else !b.ctrlKey || "up" !== c && "down" !== c ? (m.handleKeyDown(c, b), m.refreshView()) : a.toggleMode("up" === c ? 1 : -1)
        }, a.$on("$destroy", function() {
            for (; p.length;) p.shift()()
        })
    }]).controller("UibDaypickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
        function d(a, b) {
            return 1 !== b || a % 4 !== 0 || a % 100 === 0 && a % 400 !== 0 ? f[b] : 29
        }

        function e(a) {
            var b = new Date(a);
            b.setDate(b.getDate() + 4 - (b.getDay() || 7));
            var c = b.getTime();
            return b.setMonth(0), b.setDate(1), Math.floor(Math.round((c - b) / 864e5) / 7) + 1
        }
        var f = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.step = {
            months: 1
        }, this.element = b, this.init = function(b) {
            angular.extend(b, this), a.showWeeks = b.showWeeks, b.refreshView()
        }, this.getDates = function(a, b) {
            for (var c, d = new Array(b), e = new Date(a), f = 0; f < b;) c = new Date(e), d[f++] = c, e.setDate(e.getDate() + 1);
            return d
        }, this._refreshView = function() {
            var b = this.activeDate.getFullYear(),
                d = this.activeDate.getMonth(),
                f = new Date(this.activeDate);
            f.setFullYear(b, d, 1);
            var g = this.startingDay - f.getDay(),
                h = g > 0 ? 7 - g : -g,
                i = new Date(f);
            h > 0 && i.setDate(-h + 1);
            for (var j = this.getDates(i, 42), k = 0; k < 42; k++) j[k] = angular.extend(this.createDateObject(j[k], this.formatDay), {
                secondary: j[k].getMonth() !== d,
                uid: a.uniqueId + "-" + k
            });
            a.labels = new Array(7);
            for (var l = 0; l < 7; l++) a.labels[l] = {
                abbr: c(j[l].date, this.formatDayHeader),
                full: c(j[l].date, "EEEE")
            };
            if (a.title = c(this.activeDate, this.formatDayTitle), a.rows = this.split(j, 7), a.showWeeks) {
                a.weekNumbers = [];
                for (var m = (11 - this.startingDay) % 7, n = a.rows.length, o = 0; o < n; o++) a.weekNumbers.push(e(a.rows[o][m].date))
            }
        }, this.compare = function(a, b) {
            var c = new Date(a.getFullYear(), a.getMonth(), a.getDate()),
                d = new Date(b.getFullYear(), b.getMonth(), b.getDate());
            return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d
        }, this.handleKeyDown = function(a, b) {
            var c = this.activeDate.getDate();
            if ("left" === a) c -= 1;
            else if ("up" === a) c -= 7;
            else if ("right" === a) c += 1;
            else if ("down" === a) c += 7;
            else if ("pageup" === a || "pagedown" === a) {
                var e = this.activeDate.getMonth() + ("pageup" === a ? -1 : 1);
                this.activeDate.setMonth(e, 1), c = Math.min(d(this.activeDate.getFullYear(), this.activeDate.getMonth()), c)
            } else "home" === a ? c = 1 : "end" === a && (c = d(this.activeDate.getFullYear(), this.activeDate.getMonth()));
            this.activeDate.setDate(c)
        }
    }]).controller("UibMonthpickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
        this.step = {
            years: 1
        }, this.element = b, this.init = function(a) {
            angular.extend(a, this), a.refreshView()
        }, this._refreshView = function() {
            for (var b, d = new Array(12), e = this.activeDate.getFullYear(), f = 0; f < 12; f++) b = new Date(this.activeDate), b.setFullYear(e, f, 1), d[f] = angular.extend(this.createDateObject(b, this.formatMonth), {
                uid: a.uniqueId + "-" + f
            });
            a.title = c(this.activeDate, this.formatMonthTitle), a.rows = this.split(d, 3)
        }, this.compare = function(a, b) {
            var c = new Date(a.getFullYear(), a.getMonth()),
                d = new Date(b.getFullYear(), b.getMonth());
            return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d
        }, this.handleKeyDown = function(a, b) {
            var c = this.activeDate.getMonth();
            if ("left" === a) c -= 1;
            else if ("up" === a) c -= 3;
            else if ("right" === a) c += 1;
            else if ("down" === a) c += 3;
            else if ("pageup" === a || "pagedown" === a) {
                var d = this.activeDate.getFullYear() + ("pageup" === a ? -1 : 1);
                this.activeDate.setFullYear(d)
            } else "home" === a ? c = 0 : "end" === a && (c = 11);
            this.activeDate.setMonth(c)
        }
    }]).controller("UibYearpickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
        function d(a) {
            return parseInt((a - 1) / f, 10) * f + 1
        }
        var e, f;
        this.element = b, this.yearpickerInit = function() {
            e = this.yearColumns, f = this.yearRows * e, this.step = {
                years: f
            }
        }, this._refreshView = function() {
            for (var b, c = new Array(f), g = 0, h = d(this.activeDate.getFullYear()); g < f; g++) b = new Date(this.activeDate), b.setFullYear(h + g, 0, 1), c[g] = angular.extend(this.createDateObject(b, this.formatYear), {
                uid: a.uniqueId + "-" + g
            });
            a.title = [c[0].label, c[f - 1].label].join(" - "), a.rows = this.split(c, e), a.columns = e
        }, this.compare = function(a, b) {
            return a.getFullYear() - b.getFullYear()
        }, this.handleKeyDown = function(a, b) {
            var c = this.activeDate.getFullYear();
            "left" === a ? c -= 1 : "up" === a ? c -= e : "right" === a ? c += 1 : "down" === a ? c += e : "pageup" === a || "pagedown" === a ? c += ("pageup" === a ? -1 : 1) * f : "home" === a ? c = d(this.activeDate.getFullYear()) : "end" === a && (c = d(this.activeDate.getFullYear()) + f - 1), this.activeDate.setFullYear(c)
        }
    }]).directive("uibDatepicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/datepicker.html"
            },
            scope: {
                datepickerOptions: "=?"
            },
            require: ["uibDatepicker", "^ngModel"],
            controller: "UibDatepickerController",
            controllerAs: "datepicker",
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                e.init(f)
            }
        }
    }).directive("uibDaypicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/day.html"
            },
            require: ["^uibDatepicker", "uibDaypicker"],
            controller: "UibDaypickerController",
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f.init(e)
            }
        }
    }).directive("uibMonthpicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/month.html"
            },
            require: ["^uibDatepicker", "uibMonthpicker"],
            controller: "UibMonthpickerController",
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f.init(e)
            }
        }
    }).directive("uibYearpicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/year.html"
            },
            require: ["^uibDatepicker", "uibYearpicker"],
            controller: "UibYearpickerController",
            link: function(a, b, c, d) {
                var e = d[0];
                angular.extend(e, d[1]), e.yearpickerInit(), e.refreshView()
            }
        }
    }), angular.module("ui.bootstrap.position", []).factory("$uibPosition", ["$document", "$window", function(a, b) {
        var c, d, e = {
                normal: /(auto|scroll)/,
                hidden: /(auto|scroll|hidden)/
            },
            f = {
                auto: /\s?auto?\s?/i,
                primary: /^(top|bottom|left|right)$/,
                secondary: /^(top|bottom|left|right|center)$/,
                vertical: /^(top|bottom)$/
            },
            g = /(HTML|BODY)/;
        return {
            getRawNode: function(a) {
                return a.nodeName ? a : a[0] || a
            },
            parseStyle: function(a) {
                return a = parseFloat(a), isFinite(a) ? a : 0
            },
            offsetParent: function(c) {
                function d(a) {
                    return "static" === (b.getComputedStyle(a).position || "static")
                }
                c = this.getRawNode(c);
                for (var e = c.offsetParent || a[0].documentElement; e && e !== a[0].documentElement && d(e);) e = e.offsetParent;
                return e || a[0].documentElement
            },
            scrollbarWidth: function(e) {
                if (e) {
                    if (angular.isUndefined(d)) {
                        var f = a.find("body");
                        f.addClass("uib-position-body-scrollbar-measure"), d = b.innerWidth - f[0].clientWidth, d = isFinite(d) ? d : 0, f.removeClass("uib-position-body-scrollbar-measure")
                    }
                    return d
                }
                if (angular.isUndefined(c)) {
                    var g = angular.element('<div class="uib-position-scrollbar-measure"></div>');
                    a.find("body").append(g), c = g[0].offsetWidth - g[0].clientWidth, c = isFinite(c) ? c : 0, g.remove()
                }
                return c
            },
            scrollbarPadding: function(a) {
                a = this.getRawNode(a);
                var c = b.getComputedStyle(a),
                    d = this.parseStyle(c.paddingRight),
                    e = this.parseStyle(c.paddingBottom),
                    f = this.scrollParent(a, !1, !0),
                    h = this.scrollbarWidth(f, g.test(f.tagName));
                return {
                    scrollbarWidth: h,
                    widthOverflow: f.scrollWidth > f.clientWidth,
                    right: d + h,
                    originalRight: d,
                    heightOverflow: f.scrollHeight > f.clientHeight,
                    bottom: e + h,
                    originalBottom: e
                }
            },
            isScrollable: function(a, c) {
                a = this.getRawNode(a);
                var d = c ? e.hidden : e.normal,
                    f = b.getComputedStyle(a);
                return d.test(f.overflow + f.overflowY + f.overflowX)
            },
            scrollParent: function(c, d, f) {
                c = this.getRawNode(c);
                var g = d ? e.hidden : e.normal,
                    h = a[0].documentElement,
                    i = b.getComputedStyle(c);
                if (f && g.test(i.overflow + i.overflowY + i.overflowX)) return c;
                var j = "absolute" === i.position,
                    k = c.parentElement || h;
                if (k === h || "fixed" === i.position) return h;
                for (; k.parentElement && k !== h;) {
                    var l = b.getComputedStyle(k);
                    if (j && "static" !== l.position && (j = !1), !j && g.test(l.overflow + l.overflowY + l.overflowX)) break;
                    k = k.parentElement
                }
                return k
            },
            position: function(c, d) {
                c = this.getRawNode(c);
                var e = this.offset(c);
                if (d) {
                    var f = b.getComputedStyle(c);
                    e.top -= this.parseStyle(f.marginTop), e.left -= this.parseStyle(f.marginLeft)
                }
                var g = this.offsetParent(c),
                    h = {
                        top: 0,
                        left: 0
                    };
                return g !== a[0].documentElement && (h = this.offset(g), h.top += g.clientTop - g.scrollTop, h.left += g.clientLeft - g.scrollLeft), {
                    width: Math.round(angular.isNumber(e.width) ? e.width : c.offsetWidth),
                    height: Math.round(angular.isNumber(e.height) ? e.height : c.offsetHeight),
                    top: Math.round(e.top - h.top),
                    left: Math.round(e.left - h.left)
                }
            },
            offset: function(c) {
                c = this.getRawNode(c);
                var d = c.getBoundingClientRect();
                return {
                    width: Math.round(angular.isNumber(d.width) ? d.width : c.offsetWidth),
                    height: Math.round(angular.isNumber(d.height) ? d.height : c.offsetHeight),
                    top: Math.round(d.top + (b.pageYOffset || a[0].documentElement.scrollTop)),
                    left: Math.round(d.left + (b.pageXOffset || a[0].documentElement.scrollLeft))
                }
            },
            viewportOffset: function(c, d, e) {
                c = this.getRawNode(c), e = e !== !1;
                var f = c.getBoundingClientRect(),
                    g = {
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    },
                    h = d ? a[0].documentElement : this.scrollParent(c),
                    i = h.getBoundingClientRect();
                if (g.top = i.top + h.clientTop, g.left = i.left + h.clientLeft, h === a[0].documentElement && (g.top += b.pageYOffset, g.left += b.pageXOffset), g.bottom = g.top + h.clientHeight, g.right = g.left + h.clientWidth, e) {
                    var j = b.getComputedStyle(h);
                    g.top += this.parseStyle(j.paddingTop), g.bottom -= this.parseStyle(j.paddingBottom), g.left += this.parseStyle(j.paddingLeft), g.right -= this.parseStyle(j.paddingRight)
                }
                return {
                    top: Math.round(f.top - g.top),
                    bottom: Math.round(g.bottom - f.bottom),
                    left: Math.round(f.left - g.left),
                    right: Math.round(g.right - f.right)
                }
            },
            parsePlacement: function(a) {
                var b = f.auto.test(a);
                return b && (a = a.replace(f.auto, "")), a = a.split("-"), a[0] = a[0] || "top", f.primary.test(a[0]) || (a[0] = "top"), a[1] = a[1] || "center", f.secondary.test(a[1]) || (a[1] = "center"), b ? a[2] = !0 : a[2] = !1, a
            },
            positionElements: function(a, c, d, e) {
                a = this.getRawNode(a), c = this.getRawNode(c);
                var g = angular.isDefined(c.offsetWidth) ? c.offsetWidth : c.prop("offsetWidth"),
                    h = angular.isDefined(c.offsetHeight) ? c.offsetHeight : c.prop("offsetHeight");
                d = this.parsePlacement(d);
                var i = e ? this.offset(a) : this.position(a),
                    j = {
                        top: 0,
                        left: 0,
                        placement: ""
                    };
                if (d[2]) {
                    var k = this.viewportOffset(a, e),
                        l = b.getComputedStyle(c),
                        m = {
                            width: g + Math.round(Math.abs(this.parseStyle(l.marginLeft) + this.parseStyle(l.marginRight))),
                            height: h + Math.round(Math.abs(this.parseStyle(l.marginTop) + this.parseStyle(l.marginBottom)))
                        };
                    if (d[0] = "top" === d[0] && m.height > k.top && m.height <= k.bottom ? "bottom" : "bottom" === d[0] && m.height > k.bottom && m.height <= k.top ? "top" : "left" === d[0] && m.width > k.left && m.width <= k.right ? "right" : "right" === d[0] && m.width > k.right && m.width <= k.left ? "left" : d[0], d[1] = "top" === d[1] && m.height - i.height > k.bottom && m.height - i.height <= k.top ? "bottom" : "bottom" === d[1] && m.height - i.height > k.top && m.height - i.height <= k.bottom ? "top" : "left" === d[1] && m.width - i.width > k.right && m.width - i.width <= k.left ? "right" : "right" === d[1] && m.width - i.width > k.left && m.width - i.width <= k.right ? "left" : d[1], "center" === d[1])
                        if (f.vertical.test(d[0])) {
                            var n = i.width / 2 - g / 2;
                            k.left + n < 0 && m.width - i.width <= k.right ? d[1] = "left" : k.right + n < 0 && m.width - i.width <= k.left && (d[1] = "right")
                        } else {
                            var o = i.height / 2 - m.height / 2;
                            k.top + o < 0 && m.height - i.height <= k.bottom ? d[1] = "top" : k.bottom + o < 0 && m.height - i.height <= k.top && (d[1] = "bottom")
                        }
                }
                switch (d[0]) {
                    case "top":
                        j.top = i.top - h;
                        break;
                    case "bottom":
                        j.top = i.top + i.height;
                        break;
                    case "left":
                        j.left = i.left - g;
                        break;
                    case "right":
                        j.left = i.left + i.width
                }
                switch (d[1]) {
                    case "top":
                        j.top = i.top;
                        break;
                    case "bottom":
                        j.top = i.top + i.height - h;
                        break;
                    case "left":
                        j.left = i.left;
                        break;
                    case "right":
                        j.left = i.left + i.width - g;
                        break;
                    case "center":
                        f.vertical.test(d[0]) ? j.left = i.left + i.width / 2 - g / 2 : j.top = i.top + i.height / 2 - h / 2
                }
                return j.top = Math.round(j.top), j.left = Math.round(j.left), j.placement = "center" === d[1] ? d[0] : d[0] + "-" + d[1], j
            },
            positionArrow: function(a, c) {
                a = this.getRawNode(a);
                var d = a.querySelector(".tooltip-inner, .popover-inner");
                if (d) {
                    var e = angular.element(d).hasClass("tooltip-inner"),
                        g = e ? a.querySelector(".tooltip-arrow") : a.querySelector(".arrow");
                    if (g) {
                        var h = {
                            top: "",
                            bottom: "",
                            left: "",
                            right: ""
                        };
                        if (c = this.parsePlacement(c), "center" === c[1]) return void angular.element(g).css(h);
                        var i = "border-" + c[0] + "-width",
                            j = b.getComputedStyle(g)[i],
                            k = "border-";
                        k += f.vertical.test(c[0]) ? c[0] + "-" + c[1] : c[1] + "-" + c[0], k += "-radius";
                        var l = b.getComputedStyle(e ? d : a)[k];
                        switch (c[0]) {
                            case "top":
                                h.bottom = e ? "0" : "-" + j;
                                break;
                            case "bottom":
                                h.top = e ? "0" : "-" + j;
                                break;
                            case "left":
                                h.right = e ? "0" : "-" + j;
                                break;
                            case "right":
                                h.left = e ? "0" : "-" + j
                        }
                        h[c[1]] = l, angular.element(g).css(h)
                    }
                }
            }
        }
    }]), angular.module("ui.bootstrap.datepickerPopup", ["ui.bootstrap.datepicker", "ui.bootstrap.position"]).value("$datepickerPopupLiteralWarning", !0).constant("uibDatepickerPopupConfig", {
        altInputFormats: [],
        appendToBody: !1,
        clearText: "Clear",
        closeOnDateSelection: !0,
        closeText: "Done",
        currentText: "Today",
        datepickerPopup: "yyyy-MM-dd",
        datepickerPopupTemplateUrl: "uib/template/datepickerPopup/popup.html",
        datepickerTemplateUrl: "uib/template/datepicker/datepicker.html",
        html5Types: {
            date: "yyyy-MM-dd",
            "datetime-local": "yyyy-MM-ddTHH:mm:ss.sss",
            month: "yyyy-MM"
        },
        onOpenFocus: !0,
        showButtonBar: !0,
        placement: "auto bottom-left"
    }).controller("UibDatepickerPopupController", ["$scope", "$element", "$attrs", "$compile", "$log", "$parse", "$window", "$document", "$rootScope", "$uibPosition", "dateFilter", "uibDateParser", "uibDatepickerPopupConfig", "$timeout", "uibDatepickerConfig", "$datepickerPopupLiteralWarning", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        function q(b) {
            var c = l.parse(b, w, a.date);
            if (isNaN(c))
                for (var d = 0; d < I.length; d++)
                    if (c = l.parse(b, I[d], a.date), !isNaN(c)) return c;
            return c
        }

        function r(a) {
            if (angular.isNumber(a) && (a = new Date(a)), !a) return null;
            if (angular.isDate(a) && !isNaN(a)) return a;
            if (angular.isString(a)) {
                var b = q(a);
                if (!isNaN(b)) return l.toTimezone(b, J)
            }
            return F.$options && F.$options.allowInvalid ? a : void 0
        }

        function s(a, b) {
            var d = a || b;
            return !c.ngRequired && !d || (angular.isNumber(d) && (d = new Date(d)), !d || (!(!angular.isDate(d) || isNaN(d)) || !!angular.isString(d) && !isNaN(q(b))))
        }

        function t(c) {
            if (a.isOpen || !a.disabled) {
                var d = H[0],
                    e = b[0].contains(c.target),
                    f = void 0 !== d.contains && d.contains(c.target);
                !a.isOpen || e || f || a.$apply(function() {
                    a.isOpen = !1
                })
            }
        }

        function u(c) {
            27 === c.which && a.isOpen ? (c.preventDefault(), c.stopPropagation(), a.$apply(function() {
                a.isOpen = !1
            }), b[0].focus()) : 40 !== c.which || a.isOpen || (c.preventDefault(), c.stopPropagation(), a.$apply(function() {
                a.isOpen = !0
            }))
        }

        function v() {
            if (a.isOpen) {
                var d = angular.element(H[0].querySelector(".uib-datepicker-popup")),
                    e = c.popupPlacement ? c.popupPlacement : m.placement,
                    f = j.positionElements(b, d, e, y);
                d.css({
                    top: f.top + "px",
                    left: f.left + "px"
                }), d.hasClass("uib-position-measure") && d.removeClass("uib-position-measure")
            }
        }
        var w, x, y, z, A, B, C, D, E, F, G, H, I, J, K = !1,
            L = [];
        this.init = function(e) {
            if (F = e, G = e.$options, x = angular.isDefined(c.closeOnDateSelection) ? a.$parent.$eval(c.closeOnDateSelection) : m.closeOnDateSelection, y = angular.isDefined(c.datepickerAppendToBody) ? a.$parent.$eval(c.datepickerAppendToBody) : m.appendToBody, z = angular.isDefined(c.onOpenFocus) ? a.$parent.$eval(c.onOpenFocus) : m.onOpenFocus, A = angular.isDefined(c.datepickerPopupTemplateUrl) ? c.datepickerPopupTemplateUrl : m.datepickerPopupTemplateUrl, B = angular.isDefined(c.datepickerTemplateUrl) ? c.datepickerTemplateUrl : m.datepickerTemplateUrl, I = angular.isDefined(c.altInputFormats) ? a.$parent.$eval(c.altInputFormats) : m.altInputFormats, a.showButtonBar = angular.isDefined(c.showButtonBar) ? a.$parent.$eval(c.showButtonBar) : m.showButtonBar, m.html5Types[c.type] ? (w = m.html5Types[c.type], K = !0) : (w = c.uibDatepickerPopup || m.datepickerPopup, c.$observe("uibDatepickerPopup", function(a, b) {
                    var c = a || m.datepickerPopup;
                    if (c !== w && (w = c, F.$modelValue = null, !w)) throw new Error("uibDatepickerPopup must have a date format specified.")
                })), !w) throw new Error("uibDatepickerPopup must have a date format specified.");
            if (K && c.uibDatepickerPopup) throw new Error("HTML5 date input types do not support custom formats.");
            C = angular.element("<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>"), G ? (J = G.timezone, a.ngModelOptions = angular.copy(G), a.ngModelOptions.timezone = null, a.ngModelOptions.updateOnDefault === !0 && (a.ngModelOptions.updateOn = a.ngModelOptions.updateOn ? a.ngModelOptions.updateOn + " default" : "default"), C.attr("ng-model-options", "ngModelOptions")) : J = null, C.attr({
                "ng-model": "date",
                "ng-change": "dateSelection(date)",
                "template-url": A
            }), D = angular.element(C.children()[0]), D.attr("template-url", B), a.datepickerOptions || (a.datepickerOptions = {}), K && "month" === c.type && (a.datepickerOptions.datepickerMode = "month", a.datepickerOptions.minMode = "month"), D.attr("datepicker-options", "datepickerOptions"), K ? F.$formatters.push(function(b) {
                return a.date = l.fromTimezone(b, J), b
            }) : (F.$$parserName = "date", F.$validators.date = s, F.$parsers.unshift(r), F.$formatters.push(function(b) {
                return F.$isEmpty(b) ? (a.date = b, b) : (angular.isNumber(b) && (b = new Date(b)), a.date = l.fromTimezone(b, J), l.filter(a.date, w))
            })), F.$viewChangeListeners.push(function() {
                a.date = q(F.$viewValue)
            }), b.on("keydown", u), H = d(C)(a), C.remove(), y ? h.find("body").append(H) : b.after(H), a.$on("$destroy", function() {
                for (a.isOpen === !0 && (i.$$phase || a.$apply(function() {
                        a.isOpen = !1
                    })), H.remove(), b.off("keydown", u), h.off("click", t), E && E.off("scroll", v), angular.element(g).off("resize", v); L.length;) L.shift()()
            })
        }, a.getText = function(b) {
            return a[b + "Text"] || m[b + "Text"]
        }, a.isDisabled = function(b) {
            "today" === b && (b = l.fromTimezone(new Date, J));
            var c = {};
            return angular.forEach(["minDate", "maxDate"], function(b) {
                a.datepickerOptions[b] ? angular.isDate(a.datepickerOptions[b]) ? c[b] = l.fromTimezone(new Date(a.datepickerOptions[b]), J) : (p && e.warn("Literal date support has been deprecated, please switch to date object usage"), c[b] = new Date(k(a.datepickerOptions[b], "medium"))) : c[b] = null
            }), a.datepickerOptions && c.minDate && a.compare(b, c.minDate) < 0 || c.maxDate && a.compare(b, c.maxDate) > 0
        }, a.compare = function(a, b) {
            return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate())
        }, a.dateSelection = function(c) {
            angular.isDefined(c) && (a.date = c);
            var d = a.date ? l.filter(a.date, w) : null;
            b.val(d), F.$setViewValue(d), x && (a.isOpen = !1, b[0].focus())
        }, a.keydown = function(c) {
            27 === c.which && (c.stopPropagation(), a.isOpen = !1, b[0].focus())
        }, a.select = function(b, c) {
            if (c.stopPropagation(), "today" === b) {
                var d = new Date;
                angular.isDate(a.date) ? (b = new Date(a.date), b.setFullYear(d.getFullYear(), d.getMonth(), d.getDate())) : b = new Date(d.setHours(0, 0, 0, 0))
            }
            a.dateSelection(b)
        }, a.close = function(c) {
            c.stopPropagation(), a.isOpen = !1, b[0].focus()
        }, a.disabled = angular.isDefined(c.disabled) || !1, c.ngDisabled && L.push(a.$parent.$watch(f(c.ngDisabled), function(b) {
            a.disabled = b
        })), a.$watch("isOpen", function(d) {
            d ? a.disabled ? a.isOpen = !1 : n(function() {
                v(), z && a.$broadcast("uib:datepicker.focus"), h.on("click", t);
                var d = c.popupPlacement ? c.popupPlacement : m.placement;
                y || j.parsePlacement(d)[2] ? (E = E || angular.element(j.scrollParent(b)), E && E.on("scroll", v)) : E = null, angular.element(g).on("resize", v)
            }, 0, !1) : (h.off("click", t), E && E.off("scroll", v), angular.element(g).off("resize", v))
        }), a.$on("uib:datepicker.mode", function() {
            n(v, 0, !1)
        })
    }]).directive("uibDatepickerPopup", function() {
        return {
            require: ["ngModel", "uibDatepickerPopup"],
            controller: "UibDatepickerPopupController",
            scope: {
                datepickerOptions: "=?",
                isOpen: "=?",
                currentText: "@",
                clearText: "@",
                closeText: "@"
            },
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f.init(e)
            }
        }
    }).directive("uibDatepickerPopupWrap", function() {
        return {
            replace: !0,
            transclude: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepickerPopup/popup.html"
            }
        }
    }), angular.module("ui.bootstrap.debounce", []).factory("$$debounce", ["$timeout", function(a) {
        return function(b, c) {
            var d;
            return function() {
                var e = this,
                    f = Array.prototype.slice.call(arguments);
                d && a.cancel(d), d = a(function() {
                    b.apply(e, f)
                }, c)
            }
        }
    }]), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.position"]).constant("uibDropdownConfig", {
        appendToOpenClass: "uib-dropdown-open",
        openClass: "open"
    }).service("uibDropdownService", ["$document", "$rootScope", function(a, b) {
        var c = null;
        this.open = function(b, f) {
            c || (a.on("click", d), f.on("keydown", e)), c && c !== b && (c.isOpen = !1), c = b
        }, this.close = function(b, f) {
            c === b && (c = null, a.off("click", d), f.off("keydown", e))
        };
        var d = function(a) {
                if (c && !(a && "disabled" === c.getAutoClose() || a && 3 === a.which)) {
                    var d = c.getToggleElement();
                    if (!(a && d && d[0].contains(a.target))) {
                        var e = c.getDropdownElement();
                        a && "outsideClick" === c.getAutoClose() && e && e[0].contains(a.target) || (c.isOpen = !1, b.$$phase || c.$apply())
                    }
                }
            },
            e = function(a) {
                27 === a.which ? (a.stopPropagation(), c.focusToggleElement(), d()) : c.isKeynavEnabled() && [38, 40].indexOf(a.which) !== -1 && c.isOpen && (a.preventDefault(), a.stopPropagation(), c.focusDropdownEntry(a.which))
            }
    }]).controller("UibDropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", function(a, b, c, d, e, f, g, h, i, j, k) {
        var l, m, n = this,
            o = a.$new(),
            p = e.appendToOpenClass,
            q = e.openClass,
            r = angular.noop,
            s = c.onToggle ? d(c.onToggle) : angular.noop,
            t = !1,
            u = null,
            v = !1,
            w = i.find("body");
        b.addClass("dropdown"), this.init = function() {
            if (c.isOpen && (m = d(c.isOpen), r = m.assign, a.$watch(m, function(a) {
                    o.isOpen = !!a
                })), angular.isDefined(c.dropdownAppendTo)) {
                var e = d(c.dropdownAppendTo)(o);
                e && (u = angular.element(e))
            }
            t = angular.isDefined(c.dropdownAppendToBody), v = angular.isDefined(c.keyboardNav), t && !u && (u = w), u && n.dropdownMenu && (u.append(n.dropdownMenu), b.on("$destroy", function() {
                n.dropdownMenu.remove()
            }))
        }, this.toggle = function(a) {
            return o.isOpen = arguments.length ? !!a : !o.isOpen, angular.isFunction(r) && r(o, o.isOpen), o.isOpen
        }, this.isOpen = function() {
            return o.isOpen
        }, o.getToggleElement = function() {
            return n.toggleElement
        }, o.getAutoClose = function() {
            return c.autoClose || "always"
        }, o.getElement = function() {
            return b
        }, o.isKeynavEnabled = function() {
            return v
        }, o.focusDropdownEntry = function(a) {
            var c = n.dropdownMenu ? angular.element(n.dropdownMenu).find("a") : b.find("ul").eq(0).find("a");
            switch (a) {
                case 40:
                    angular.isNumber(n.selectedOption) ? n.selectedOption = n.selectedOption === c.length - 1 ? n.selectedOption : n.selectedOption + 1 : n.selectedOption = 0;
                    break;
                case 38:
                    angular.isNumber(n.selectedOption) ? n.selectedOption = 0 === n.selectedOption ? 0 : n.selectedOption - 1 : n.selectedOption = c.length - 1
            }
            c[n.selectedOption].focus()
        }, o.getDropdownElement = function() {
            return n.dropdownMenu
        }, o.focusToggleElement = function() {
            n.toggleElement && n.toggleElement[0].focus()
        }, o.$watch("isOpen", function(c, d) {
            if (u && n.dropdownMenu) {
                var e, i, m, v = h.positionElements(b, n.dropdownMenu, "bottom-left", !0);
                if (e = {
                        top: v.top + "px",
                        display: c ? "block" : "none"
                    }, i = n.dropdownMenu.hasClass("dropdown-menu-right"), i ? (e.left = "auto", m = h.scrollbarWidth(!0), e.right = window.innerWidth - m - (v.left + b.prop("offsetWidth")) + "px") : (e.left = v.left + "px", e.right = "auto"), !t) {
                    var w = h.offset(u);
                    e.top = v.top - w.top + "px", i ? e.right = window.innerWidth - (v.left - w.left + b.prop("offsetWidth")) + "px" : e.left = v.left - w.left + "px"
                }
                n.dropdownMenu.css(e)
            }
            var x = u ? u : b,
                y = x.hasClass(u ? p : q);
            if (y === !c && g[c ? "addClass" : "removeClass"](x, u ? p : q).then(function() {
                    angular.isDefined(c) && c !== d && s(a, {
                        open: !!c
                    })
                }), c) n.dropdownMenuTemplateUrl && k(n.dropdownMenuTemplateUrl).then(function(a) {
                l = o.$new(), j(a.trim())(l, function(a) {
                    var b = a;
                    n.dropdownMenu.replaceWith(b), n.dropdownMenu = b
                })
            }), o.focusToggleElement(), f.open(o, b);
            else {
                if (n.dropdownMenuTemplateUrl) {
                    l && l.$destroy();
                    var z = angular.element('<ul class="dropdown-menu"></ul>');
                    n.dropdownMenu.replaceWith(z), n.dropdownMenu = z
                }
                f.close(o, b), n.selectedOption = null
            }
            angular.isFunction(r) && r(a, c)
        })
    }]).directive("uibDropdown", function() {
        return {
            controller: "UibDropdownController",
            link: function(a, b, c, d) {
                d.init()
            }
        }
    }).directive("uibDropdownMenu", function() {
        return {
            restrict: "A",
            require: "?^uibDropdown",
            link: function(a, b, c, d) {
                if (d && !angular.isDefined(c.dropdownNested)) {
                    b.addClass("dropdown-menu");
                    var e = c.templateUrl;
                    e && (d.dropdownMenuTemplateUrl = e), d.dropdownMenu || (d.dropdownMenu = b)
                }
            }
        }
    }).directive("uibDropdownToggle", function() {
        return {
            require: "?^uibDropdown",
            link: function(a, b, c, d) {
                if (d) {
                    b.addClass("dropdown-toggle"), d.toggleElement = b;
                    var e = function(e) {
                        e.preventDefault(), b.hasClass("disabled") || c.disabled || a.$apply(function() {
                            d.toggle()
                        })
                    };
                    b.bind("click", e), b.attr({
                        "aria-haspopup": !0,
                        "aria-expanded": !1
                    }), a.$watch(d.isOpen, function(a) {
                        b.attr("aria-expanded", !!a)
                    }), a.$on("$destroy", function() {
                        b.unbind("click", e)
                    })
                }
            }
        }
    }), angular.module("ui.bootstrap.stackedMap", []).factory("$$stackedMap", function() {
        return {
            createNew: function() {
                var a = [];
                return {
                    add: function(b, c) {
                        a.push({
                            key: b,
                            value: c
                        })
                    },
                    get: function(b) {
                        for (var c = 0; c < a.length; c++)
                            if (b === a[c].key) return a[c]
                    },
                    keys: function() {
                        for (var b = [], c = 0; c < a.length; c++) b.push(a[c].key);
                        return b
                    },
                    top: function() {
                        return a[a.length - 1]
                    },
                    remove: function(b) {
                        for (var c = -1, d = 0; d < a.length; d++)
                            if (b === a[d].key) {
                                c = d;
                                break
                            } return a.splice(c, 1)[0]
                    },
                    removeTop: function() {
                        return a.splice(a.length - 1, 1)[0]
                    },
                    length: function() {
                        return a.length
                    }
                }
            }
        }
    }), angular.module("ui.bootstrap.modal", ["ui.bootstrap.stackedMap", "ui.bootstrap.position"]).factory("$$multiMap", function() {
        return {
            createNew: function() {
                var a = {};
                return {
                    entries: function() {
                        return Object.keys(a).map(function(b) {
                            return {
                                key: b,
                                value: a[b]
                            }
                        })
                    },
                    get: function(b) {
                        return a[b]
                    },
                    hasKey: function(b) {
                        return !!a[b]
                    },
                    keys: function() {
                        return Object.keys(a)
                    },
                    put: function(b, c) {
                        a[b] || (a[b] = []), a[b].push(c)
                    },
                    remove: function(b, c) {
                        var d = a[b];
                        if (d) {
                            var e = d.indexOf(c);
                            e !== -1 && d.splice(e, 1), d.length || delete a[b]
                        }
                    }
                }
            }
        }
    }).provider("$uibResolve", function() {
        var a = this;
        this.resolver = null, this.setResolver = function(a) {
            this.resolver = a
        }, this.$get = ["$injector", "$q", function(b, c) {
            var d = a.resolver ? b.get(a.resolver) : null;
            return {
                resolve: function(a, e, f, g) {
                    if (d) return d.resolve(a, e, f, g);
                    var h = [];
                    return angular.forEach(a, function(a) {
                        angular.isFunction(a) || angular.isArray(a) ? h.push(c.resolve(b.invoke(a))) : angular.isString(a) ? h.push(c.resolve(b.get(a))) : h.push(c.resolve(a))
                    }), c.all(h).then(function(b) {
                        var c = {},
                            d = 0;
                        return angular.forEach(a, function(a, e) {
                            c[e] = b[d++]
                        }), c
                    })
                }
            }
        }]
    }).directive("uibModalBackdrop", ["$animate", "$injector", "$uibModalStack", function(a, b, c) {
        function d(b, d, e) {
            e.modalInClass && (a.addClass(d, e.modalInClass), b.$on(c.NOW_CLOSING_EVENT, function(c, f) {
                var g = f();
                b.modalOptions.animation ? a.removeClass(d, e.modalInClass).then(g) : g()
            }))
        }
        return {
            replace: !0,
            templateUrl: "uib/template/modal/backdrop.html",
            compile: function(a, b) {
                return a.addClass(b.backdropClass), d
            }
        }
    }]).directive("uibModalWindow", ["$uibModalStack", "$q", "$animateCss", "$document", function(a, b, c, d) {
        return {
            scope: {
                index: "@"
            },
            replace: !0,
            transclude: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/modal/window.html"
            },
            link: function(e, f, g) {
                f.addClass(g.windowClass || ""), f.addClass(g.windowTopClass || ""), e.size = g.size, e.close = function(b) {
                    var c = a.getTop();
                    c && c.value.backdrop && "static" !== c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(), b.stopPropagation(), a.dismiss(c.key, "backdrop click"))
                }, f.on("click", e.close), e.$isRendered = !0;
                var h = b.defer();
                g.$observe("modalRender", function(a) {
                    "true" === a && h.resolve()
                }), h.promise.then(function() {
                    var h = null;
                    g.modalInClass && (h = c(f, {
                        addClass: g.modalInClass
                    }).start(), e.$on(a.NOW_CLOSING_EVENT, function(a, b) {
                        var d = b();
                        c(f, {
                            removeClass: g.modalInClass
                        }).start().then(d)
                    })), b.when(h).then(function() {
                        var b = a.getTop();
                        if (b && a.modalRendered(b.key), !d[0].activeElement || !f[0].contains(d[0].activeElement)) {
                            var c = f[0].querySelector("[autofocus]");
                            c ? c.focus() : f[0].focus()
                        }
                    })
                })
            }
        }
    }]).directive("uibModalAnimationClass", function() {
        return {
            compile: function(a, b) {
                b.modalAnimation && a.addClass(b.uibModalAnimationClass)
            }
        }
    }).directive("uibModalTransclude", function() {
        return {
            link: function(a, b, c, d, e) {
                e(a.$parent, function(a) {
                    b.empty(), b.append(a)
                })
            }
        }
    }).factory("$uibModalStack", ["$animate", "$animateCss", "$document", "$compile", "$rootScope", "$q", "$$multiMap", "$$stackedMap", "$uibPosition", function(a, b, c, d, e, f, g, h, i) {
        function j(a) {
            return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length)
        }

        function k() {
            for (var a = -1, b = v.keys(), c = 0; c < b.length; c++) v.get(b[c]).value.backdrop && (a = c);
            return a > -1 && a < y && (a = y), a
        }

        function l(a, b) {
            var c = v.get(a).value,
                d = c.appendTo;
            v.remove(a), z = v.top(), z && (y = parseInt(z.value.modalDomEl.attr("index"), 10)), o(c.modalDomEl, c.modalScope, function() {
                var b = c.openedClass || u;
                w.remove(b, a);
                var e = w.hasKey(b);
                d.toggleClass(b, e), !e && t && t.heightOverflow && t.scrollbarWidth && (t.originalRight ? d.css({
                    paddingRight: t.originalRight + "px"
                }) : d.css({
                    paddingRight: ""
                }), t = null), m(!0)
            }, c.closedDeferred), n(), b && b.focus ? b.focus() : d.focus && d.focus()
        }

        function m(a) {
            var b;
            v.length() > 0 && (b = v.top().value, b.modalDomEl.toggleClass(b.windowTopClass || "", a))
        }

        function n() {
            if (r && k() === -1) {
                var a = s;
                o(r, s, function() {
                    a = null
                }), r = void 0, s = void 0
            }
        }

        function o(b, c, d, e) {
            function g() {
                g.done || (g.done = !0, a.leave(b).then(function() {
                    b.remove(), e && e.resolve()
                }), c.$destroy(), d && d())
            }
            var h, i = null,
                j = function() {
                    return h || (h = f.defer(), i = h.promise),
                        function() {
                            h.resolve()
                        }
                };
            return c.$broadcast(x.NOW_CLOSING_EVENT, j), f.when(i).then(g)
        }

        function p(a) {
            if (a.isDefaultPrevented()) return a;
            var b = v.top();
            if (b) switch (a.which) {
                case 27:
                    b.value.keyboard && (a.preventDefault(), e.$apply(function() {
                        x.dismiss(b.key, "escape key press")
                    }));
                    break;
                case 9:
                    var c = x.loadFocusElementList(b),
                        d = !1;
                    a.shiftKey ? (x.isFocusInFirstItem(a, c) || x.isModalFocused(a, b)) && (d = x.focusLastFocusableElement(c)) : x.isFocusInLastItem(a, c) && (d = x.focusFirstFocusableElement(c)), d && (a.preventDefault(), a.stopPropagation())
            }
        }

        function q(a, b, c) {
            return !a.value.modalScope.$broadcast("modal.closing", b, c).defaultPrevented
        }
        var r, s, t, u = "modal-open",
            v = h.createNew(),
            w = g.createNew(),
            x = {
                NOW_CLOSING_EVENT: "modal.stack.now-closing"
            },
            y = 0,
            z = null,
            A = "a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable=true]";
        return e.$watch(k, function(a) {
            s && (s.index = a)
        }), c.on("keydown", p), e.$on("$destroy", function() {
            c.off("keydown", p)
        }), x.open = function(b, f) {
            var g = c[0].activeElement,
                h = f.openedClass || u;
            m(!1), z = v.top(), v.add(b, {
                deferred: f.deferred,
                renderDeferred: f.renderDeferred,
                closedDeferred: f.closedDeferred,
                modalScope: f.scope,
                backdrop: f.backdrop,
                keyboard: f.keyboard,
                openedClass: f.openedClass,
                windowTopClass: f.windowTopClass,
                animation: f.animation,
                appendTo: f.appendTo
            }), w.put(h, b);
            var j = f.appendTo,
                l = k();
            if (!j.length) throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");
            l >= 0 && !r && (s = e.$new(!0), s.modalOptions = f, s.index = l, r = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'), r.attr("backdrop-class", f.backdropClass), f.animation && r.attr("modal-animation", "true"), d(r)(s), a.enter(r, j), t = i.scrollbarPadding(j), t.heightOverflow && t.scrollbarWidth && j.css({
                paddingRight: t.right + "px"
            })), y = z ? parseInt(z.value.modalDomEl.attr("index"), 10) + 1 : 0;
            var n = angular.element('<div uib-modal-window="modal-window"></div>');
            n.attr({
                "template-url": f.windowTemplateUrl,
                "window-class": f.windowClass,
                "window-top-class": f.windowTopClass,
                size: f.size,
                index: y,
                animate: "animate"
            }).html(f.content), f.animation && n.attr("modal-animation", "true"), j.addClass(h), a.enter(d(n)(f.scope), j), v.top().value.modalDomEl = n, v.top().value.modalOpener = g
        }, x.close = function(a, b) {
            var c = v.get(a);
            return c && q(c, b, !0) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.resolve(b), l(a, c.value.modalOpener), !0) : !c
        }, x.dismiss = function(a, b) {
            var c = v.get(a);
            return c && q(c, b, !1) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.reject(b), l(a, c.value.modalOpener), !0) : !c
        }, x.dismissAll = function(a) {
            for (var b = this.getTop(); b && this.dismiss(b.key, a);) b = this.getTop()
        }, x.getTop = function() {
            return v.top()
        }, x.modalRendered = function(a) {
            var b = v.get(a);
            b && b.value.renderDeferred.resolve()
        }, x.focusFirstFocusableElement = function(a) {
            return a.length > 0 && (a[0].focus(), !0)
        }, x.focusLastFocusableElement = function(a) {
            return a.length > 0 && (a[a.length - 1].focus(), !0)
        }, x.isModalFocused = function(a, b) {
            if (a && b) {
                var c = b.value.modalDomEl;
                if (c && c.length) return (a.target || a.srcElement) === c[0]
            }
            return !1
        }, x.isFocusInFirstItem = function(a, b) {
            return b.length > 0 && (a.target || a.srcElement) === b[0]
        }, x.isFocusInLastItem = function(a, b) {
            return b.length > 0 && (a.target || a.srcElement) === b[b.length - 1]
        }, x.loadFocusElementList = function(a) {
            if (a) {
                var b = a.value.modalDomEl;
                if (b && b.length) {
                    var c = b[0].querySelectorAll(A);
                    return c ? Array.prototype.filter.call(c, function(a) {
                        return j(a)
                    }) : c
                }
            }
        }, x
    }]).provider("$uibModal", function() {
        var a = {
            options: {
                animation: !0,
                backdrop: !0,
                keyboard: !0
            },
            $get: ["$rootScope", "$q", "$document", "$templateRequest", "$controller", "$uibResolve", "$uibModalStack", function(b, c, d, e, f, g, h) {
                function i(a) {
                    return a.template ? c.when(a.template) : e(angular.isFunction(a.templateUrl) ? a.templateUrl() : a.templateUrl)
                }
                var j = {},
                    k = null;
                return j.getPromiseChain = function() {
                    return k
                }, j.open = function(e) {
                    function j() {
                        return r
                    }
                    var l = c.defer(),
                        m = c.defer(),
                        n = c.defer(),
                        o = c.defer(),
                        p = {
                            result: l.promise,
                            opened: m.promise,
                            closed: n.promise,
                            rendered: o.promise,
                            close: function(a) {
                                return h.close(p, a)
                            },
                            dismiss: function(a) {
                                return h.dismiss(p, a)
                            }
                        };
                    if (e = angular.extend({}, a.options, e), e.resolve = e.resolve || {}, e.appendTo = e.appendTo || d.find("body").eq(0), !e.template && !e.templateUrl) throw new Error("One of template or templateUrl options is required.");
                    var q, r = c.all([i(e), g.resolve(e.resolve, {}, null, null)]);
                    return q = k = c.all([k]).then(j, j).then(function(a) {
                        var c = e.scope || b,
                            d = c.$new();
                        d.$close = p.close, d.$dismiss = p.dismiss, d.$on("$destroy", function() {
                            d.$$uibDestructionScheduled || d.$dismiss("$uibUnscheduledDestruction")
                        });
                        var g, i, j = {};
                        e.controller && (j.$scope = d, j.$scope.$resolve = {}, j.$uibModalInstance = p, angular.forEach(a[1], function(a, b) {
                            j[b] = a, j.$scope.$resolve[b] = a
                        }), i = f(e.controller, j, !0, e.controllerAs), e.controllerAs && e.bindToController && (g = i.instance, g.$close = d.$close, g.$dismiss = d.$dismiss, angular.extend(g, {
                            $resolve: j.$scope.$resolve
                        }, c)), g = i(), angular.isFunction(g.$onInit) && g.$onInit()), h.open(p, {
                            scope: d,
                            deferred: l,
                            renderDeferred: o,
                            closedDeferred: n,
                            content: a[0],
                            animation: e.animation,
                            backdrop: e.backdrop,
                            keyboard: e.keyboard,
                            backdropClass: e.backdropClass,
                            windowTopClass: e.windowTopClass,
                            windowClass: e.windowClass,
                            windowTemplateUrl: e.windowTemplateUrl,
                            size: e.size,
                            openedClass: e.openedClass,
                            appendTo: e.appendTo
                        }), m.resolve(!0)
                    }, function(a) {
                        m.reject(a), l.reject(a)
                    })["finally"](function() {
                        k === q && (k = null)
                    }), p
                }, j
            }]
        };
        return a
    }), angular.module("ui.bootstrap.paging", []).factory("uibPaging", ["$parse", function(a) {
        return {
            create: function(b, c, d) {
                b.setNumPages = d.numPages ? a(d.numPages).assign : angular.noop, b.ngModelCtrl = {
                    $setViewValue: angular.noop
                }, b._watchers = [], b.init = function(a, e) {
                    b.ngModelCtrl = a, b.config = e, a.$render = function() {
                        b.render()
                    }, d.itemsPerPage ? b._watchers.push(c.$parent.$watch(d.itemsPerPage, function(a) {
                        b.itemsPerPage = parseInt(a, 10), c.totalPages = b.calculateTotalPages(), b.updatePage()
                    })) : b.itemsPerPage = e.itemsPerPage, c.$watch("totalItems", function(a, d) {
                        (angular.isDefined(a) || a !== d) && (c.totalPages = b.calculateTotalPages(), b.updatePage())
                    })
                }, b.calculateTotalPages = function() {
                    var a = b.itemsPerPage < 1 ? 1 : Math.ceil(c.totalItems / b.itemsPerPage);
                    return Math.max(a || 0, 1)
                }, b.render = function() {
                    c.page = parseInt(b.ngModelCtrl.$viewValue, 10) || 1
                }, c.selectPage = function(a, d) {
                    d && d.preventDefault();
                    var e = !c.ngDisabled || !d;
                    e && c.page !== a && a > 0 && a <= c.totalPages && (d && d.target && d.target.blur(), b.ngModelCtrl.$setViewValue(a), b.ngModelCtrl.$render())
                }, c.getText = function(a) {
                    return c[a + "Text"] || b.config[a + "Text"]
                }, c.noPrevious = function() {
                    return 1 === c.page
                }, c.noNext = function() {
                    return c.page === c.totalPages
                }, b.updatePage = function() {
                    b.setNumPages(c.$parent, c.totalPages), c.page > c.totalPages ? c.selectPage(c.totalPages) : b.ngModelCtrl.$render()
                }, c.$on("$destroy", function() {
                    for (; b._watchers.length;) b._watchers.shift()()
                })
            }
        }
    }]), angular.module("ui.bootstrap.pager", ["ui.bootstrap.paging"]).controller("UibPagerController", ["$scope", "$attrs", "uibPaging", "uibPagerConfig", function(a, b, c, d) {
        a.align = angular.isDefined(b.align) ? a.$parent.$eval(b.align) : d.align, c.create(this, a, b)
    }]).constant("uibPagerConfig", {
        itemsPerPage: 10,
        previousText: "« Previous",
        nextText: "Next »",
        align: !0
    }).directive("uibPager", ["uibPagerConfig", function(a) {
        return {
            scope: {
                totalItems: "=",
                previousText: "@",
                nextText: "@",
                ngDisabled: "="
            },
            require: ["uibPager", "?ngModel"],
            controller: "UibPagerController",
            controllerAs: "pager",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/pager/pager.html"
            },
            replace: !0,
            link: function(b, c, d, e) {
                var f = e[0],
                    g = e[1];
                g && f.init(g, a)
            }
        }
    }]), angular.module("ui.bootstrap.pagination", ["ui.bootstrap.paging"]).controller("UibPaginationController", ["$scope", "$attrs", "$parse", "uibPaging", "uibPaginationConfig", function(a, b, c, d, e) {
        function f(a, b, c) {
            return {
                number: a,
                text: b,
                active: c
            }
        }

        function g(a, b) {
            var c = [],
                d = 1,
                e = b,
                g = angular.isDefined(i) && i < b;
            g && (j ? (d = Math.max(a - Math.floor(i / 2), 1), e = d + i - 1, e > b && (e = b, d = e - i + 1)) : (d = (Math.ceil(a / i) - 1) * i + 1, e = Math.min(d + i - 1, b)));
            for (var h = d; h <= e; h++) {
                var n = f(h, m(h), h === a);
                c.push(n)
            }
            if (g && i > 0 && (!j || k || l)) {
                if (d > 1) {
                    if (!l || d > 3) {
                        var o = f(d - 1, "...", !1);
                        c.unshift(o)
                    }
                    if (l) {
                        if (3 === d) {
                            var p = f(2, "2", !1);
                            c.unshift(p)
                        }
                        var q = f(1, "1", !1);
                        c.unshift(q)
                    }
                }
                if (e < b) {
                    if (!l || e < b - 2) {
                        var r = f(e + 1, "...", !1);
                        c.push(r)
                    }
                    if (l) {
                        if (e === b - 2) {
                            var s = f(b - 1, b - 1, !1);
                            c.push(s)
                        }
                        var t = f(b, b, !1);
                        c.push(t)
                    }
                }
            }
            return c
        }
        var h = this,
            i = angular.isDefined(b.maxSize) ? a.$parent.$eval(b.maxSize) : e.maxSize,
            j = angular.isDefined(b.rotate) ? a.$parent.$eval(b.rotate) : e.rotate,
            k = angular.isDefined(b.forceEllipses) ? a.$parent.$eval(b.forceEllipses) : e.forceEllipses,
            l = angular.isDefined(b.boundaryLinkNumbers) ? a.$parent.$eval(b.boundaryLinkNumbers) : e.boundaryLinkNumbers,
            m = angular.isDefined(b.pageLabel) ? function(c) {
                return a.$parent.$eval(b.pageLabel, {
                    $page: c
                })
            } : angular.identity;
        a.boundaryLinks = angular.isDefined(b.boundaryLinks) ? a.$parent.$eval(b.boundaryLinks) : e.boundaryLinks, a.directionLinks = angular.isDefined(b.directionLinks) ? a.$parent.$eval(b.directionLinks) : e.directionLinks, d.create(this, a, b), b.maxSize && h._watchers.push(a.$parent.$watch(c(b.maxSize), function(a) {
            i = parseInt(a, 10), h.render()
        }));
        var n = this.render;
        this.render = function() {
            n(), a.page > 0 && a.page <= a.totalPages && (a.pages = g(a.page, a.totalPages))
        }
    }]).constant("uibPaginationConfig", {
        itemsPerPage: 10,
        boundaryLinks: !1,
        boundaryLinkNumbers: !1,
        directionLinks: !0,
        firstText: "First",
        previousText: "Previous",
        nextText: "Next",
        lastText: "Last",
        rotate: !0,
        forceEllipses: !1
    }).directive("uibPagination", ["$parse", "uibPaginationConfig", function(a, b) {
        return {
            scope: {
                totalItems: "=",
                firstText: "@",
                previousText: "@",
                nextText: "@",
                lastText: "@",
                ngDisabled: "="
            },
            require: ["uibPagination", "?ngModel"],
            controller: "UibPaginationController",
            controllerAs: "pagination",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/pagination/pagination.html"
            },
            replace: !0,
            link: function(a, c, d, e) {
                var f = e[0],
                    g = e[1];
                g && f.init(g, b)
            }
        }
    }]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.stackedMap"]).provider("$uibTooltip", function() {
        function a(a) {
            var b = /[A-Z]/g,
                c = "-";
            return a.replace(b, function(a, b) {
                return (b ? c : "") + a.toLowerCase()
            })
        }
        var b = {
                placement: "top",
                placementClassPrefix: "",
                animation: !0,
                popupDelay: 0,
                popupCloseDelay: 0,
                useContentExp: !1
            },
            c = {
                mouseenter: "mouseleave",
                click: "click",
                outsideClick: "outsideClick",
                focus: "blur",
                none: ""
            },
            d = {};
        this.options = function(a) {
            angular.extend(d, a)
        }, this.setTriggers = function(a) {
            angular.extend(c, a)
        }, this.$get = ["$window", "$compile", "$timeout", "$document", "$uibPosition", "$interpolate", "$rootScope", "$parse", "$$stackedMap", function(e, f, g, h, i, j, k, l, m) {
            function n(a) {
                if (27 === a.which) {
                    var b = o.top();
                    b && (b.value.close(), o.removeTop(), b = null)
                }
            }
            var o = m.createNew();
            return h.on("keypress", n), k.$on("$destroy", function() {
                    h.off("keypress", n)
                }),
                function(e, k, m, n) {
                    function p(a) {
                        var b = (a || n.trigger || m).split(" "),
                            d = b.map(function(a) {
                                return c[a] || a
                            });
                        return {
                            show: b,
                            hide: d
                        }
                    }
                    n = angular.extend({}, b, d, n);
                    var q = a(e),
                        r = j.startSymbol(),
                        s = j.endSymbol(),
                        t = "<div " + q + '-popup uib-title="' + r + "title" + s + '" ' + (n.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + r + "content" + s + '" ') + 'placement="' + r + "placement" + s + '" popup-class="' + r + "popupClass" + s + '" animation="animation" is-open="isOpen" origin-scope="origScope" class="uib-position-measure"></div>';
                    return {
                        compile: function(a, b) {
                            var c = f(t);
                            return function(a, b, d, f) {
                                function j() {
                                    N.isOpen ? q() : m()
                                }

                                function m() {
                                    M && !a.$eval(d[k + "Enable"]) || (u(), x(), N.popupDelay ? G || (G = g(r, N.popupDelay, !1)) : r())
                                }

                                function q() {
                                    s(), N.popupCloseDelay ? H || (H = g(t, N.popupCloseDelay, !1)) : t()
                                }

                                function r() {
                                    return s(), u(), N.content ? (v(), void N.$evalAsync(function() {
                                        N.isOpen = !0, y(!0), S()
                                    })) : angular.noop
                                }

                                function s() {
                                    G && (g.cancel(G), G = null), I && (g.cancel(I), I = null)
                                }

                                function t() {
                                    N && N.$evalAsync(function() {
                                        N && (N.isOpen = !1, y(!1), N.animation ? F || (F = g(w, 150, !1)) : w())
                                    })
                                }

                                function u() {
                                    H && (g.cancel(H), H = null), F && (g.cancel(F), F = null)
                                }

                                function v() {
                                    D || (E = N.$new(), D = c(E, function(a) {
                                        K ? h.find("body").append(a) : b.after(a)
                                    }), z())
                                }

                                function w() {
                                    s(), u(), A(), D && (D.remove(), D = null), E && (E.$destroy(), E = null)
                                }

                                function x() {
                                    N.title = d[k + "Title"], Q ? N.content = Q(a) : N.content = d[e], N.popupClass = d[k + "Class"], N.placement = angular.isDefined(d[k + "Placement"]) ? d[k + "Placement"] : n.placement;
                                    var b = i.parsePlacement(N.placement);
                                    J = b[1] ? b[0] + "-" + b[1] : b[0];
                                    var c = parseInt(d[k + "PopupDelay"], 10),
                                        f = parseInt(d[k + "PopupCloseDelay"], 10);
                                    N.popupDelay = isNaN(c) ? n.popupDelay : c, N.popupCloseDelay = isNaN(f) ? n.popupCloseDelay : f
                                }

                                function y(b) {
                                    P && angular.isFunction(P.assign) && P.assign(a, b)
                                }

                                function z() {
                                    R.length = 0, Q ? (R.push(a.$watch(Q, function(a) {
                                        N.content = a, !a && N.isOpen && t()
                                    })), R.push(E.$watch(function() {
                                        O || (O = !0, E.$$postDigest(function() {
                                            O = !1, N && N.isOpen && S()
                                        }))
                                    }))) : R.push(d.$observe(e, function(a) {
                                        N.content = a, !a && N.isOpen ? t() : S()
                                    })), R.push(d.$observe(k + "Title", function(a) {
                                        N.title = a, N.isOpen && S()
                                    })), R.push(d.$observe(k + "Placement", function(a) {
                                        N.placement = a ? a : n.placement, N.isOpen && S()
                                    }))
                                }

                                function A() {
                                    R.length && (angular.forEach(R, function(a) {
                                        a()
                                    }), R.length = 0)
                                }

                                function B(a) {
                                    N && N.isOpen && D && (b[0].contains(a.target) || D[0].contains(a.target) || q())
                                }

                                function C() {
                                    var a = d[k + "Trigger"];
                                    T(), L = p(a), "none" !== L.show && L.show.forEach(function(a, c) {
                                        "outsideClick" === a ? (b.on("click", j), h.on("click", B)) : a === L.hide[c] ? b.on(a, j) : a && (b.on(a, m), b.on(L.hide[c], q)), b.on("keypress", function(a) {
                                            27 === a.which && q()
                                        })
                                    })
                                }
                                var D, E, F, G, H, I, J, K = !!angular.isDefined(n.appendToBody) && n.appendToBody,
                                    L = p(void 0),
                                    M = angular.isDefined(d[k + "Enable"]),
                                    N = a.$new(!0),
                                    O = !1,
                                    P = !!angular.isDefined(d[k + "IsOpen"]) && l(d[k + "IsOpen"]),
                                    Q = !!n.useContentExp && l(d[e]),
                                    R = [],
                                    S = function() {
                                        D && D.html() && (I || (I = g(function() {
                                            var a = i.positionElements(b, D, N.placement, K);
                                            D.css({
                                                top: a.top + "px",
                                                left: a.left + "px"
                                            }), D.hasClass(a.placement.split("-")[0]) || (D.removeClass(J.split("-")[0]), D.addClass(a.placement.split("-")[0])), D.hasClass(n.placementClassPrefix + a.placement) || (D.removeClass(n.placementClassPrefix + J), D.addClass(n.placementClassPrefix + a.placement)), D.hasClass("uib-position-measure") ? (i.positionArrow(D, a.placement), D.removeClass("uib-position-measure")) : J !== a.placement && i.positionArrow(D, a.placement), J = a.placement, I = null
                                        }, 0, !1)))
                                    };
                                N.origScope = a, N.isOpen = !1, o.add(N, {
                                    close: t
                                }), N.contentExp = function() {
                                    return N.content
                                }, d.$observe("disabled", function(a) {
                                    a && s(), a && N.isOpen && t()
                                }), P && a.$watch(P, function(a) {
                                    N && !a === N.isOpen && j()
                                });
                                var T = function() {
                                    L.show.forEach(function(a) {
                                        "outsideClick" === a ? b.off("click", j) : (b.off(a, m), b.off(a, j))
                                    }), L.hide.forEach(function(a) {
                                        "outsideClick" === a ? h.off("click", B) : b.off(a, q)
                                    })
                                };
                                C();
                                var U = a.$eval(d[k + "Animation"]);
                                N.animation = angular.isDefined(U) ? !!U : n.animation;
                                var V, W = k + "AppendToBody";
                                V = W in d && void 0 === d[W] || a.$eval(d[W]), K = angular.isDefined(V) ? V : K, a.$on("$destroy", function() {
                                    T(), w(), o.remove(N), N = null
                                })
                            }
                        }
                    }
                }
        }]
    }).directive("uibTooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function(a, b, c, d) {
        return {
            link: function(e, f, g) {
                var h, i, j, k = e.$eval(g.tooltipTemplateTranscludeScope),
                    l = 0,
                    m = function() {
                        i && (i.remove(), i = null), h && (h.$destroy(), h = null), j && (a.leave(j).then(function() {
                            i = null
                        }), i = j, j = null)
                    };
                e.$watch(b.parseAsResourceUrl(g.uibTooltipTemplateTransclude), function(b) {
                    var g = ++l;
                    b ? (d(b, !0).then(function(d) {
                        if (g === l) {
                            var e = k.$new(),
                                i = d,
                                n = c(i)(e, function(b) {
                                    m(), a.enter(b, f)
                                });
                            h = e, j = n, h.$emit("$includeContentLoaded", b)
                        }
                    }, function() {
                        g === l && (m(), e.$emit("$includeContentError", b))
                    }), e.$emit("$includeContentRequested", b)) : m()
                }), e.$on("$destroy", m)
            }
        }
    }]).directive("uibTooltipClasses", ["$uibPosition", function(a) {
        return {
            restrict: "A",
            link: function(b, c, d) {
                if (b.placement) {
                    var e = a.parsePlacement(b.placement);
                    c.addClass(e[0])
                }
                b.popupClass && c.addClass(b.popupClass), b.animation() && c.addClass(d.tooltipAnimationClass)
            }
        }
    }]).directive("uibTooltipPopup", function() {
        return {
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/tooltip/tooltip-popup.html"
        }
    }).directive("uibTooltip", ["$uibTooltip", function(a) {
        return a("uibTooltip", "tooltip", "mouseenter")
    }]).directive("uibTooltipTemplatePopup", function() {
        return {
            replace: !0,
            scope: {
                contentExp: "&",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&",
                originScope: "&"
            },
            templateUrl: "uib/template/tooltip/tooltip-template-popup.html"
        }
    }).directive("uibTooltipTemplate", ["$uibTooltip", function(a) {
        return a("uibTooltipTemplate", "tooltip", "mouseenter", {
            useContentExp: !0
        })
    }]).directive("uibTooltipHtmlPopup", function() {
        return {
            replace: !0,
            scope: {
                contentExp: "&",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/tooltip/tooltip-html-popup.html"
        }
    }).directive("uibTooltipHtml", ["$uibTooltip", function(a) {
        return a("uibTooltipHtml", "tooltip", "mouseenter", {
            useContentExp: !0
        })
    }]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("uibPopoverTemplatePopup", function() {
        return {
            replace: !0,
            scope: {
                uibTitle: "@",
                contentExp: "&",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&",
                originScope: "&"
            },
            templateUrl: "uib/template/popover/popover-template.html"
        }
    }).directive("uibPopoverTemplate", ["$uibTooltip", function(a) {
        return a("uibPopoverTemplate", "popover", "click", {
            useContentExp: !0
        })
    }]).directive("uibPopoverHtmlPopup", function() {
        return {
            replace: !0,
            scope: {
                contentExp: "&",
                uibTitle: "@",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/popover/popover-html.html"
        }
    }).directive("uibPopoverHtml", ["$uibTooltip", function(a) {
        return a("uibPopoverHtml", "popover", "click", {
            useContentExp: !0
        })
    }]).directive("uibPopoverPopup", function() {
        return {
            replace: !0,
            scope: {
                uibTitle: "@",
                content: "@",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/popover/popover.html"
        }
    }).directive("uibPopover", ["$uibTooltip", function(a) {
        return a("uibPopover", "popover", "click")
    }]), angular.module("ui.bootstrap.progressbar", []).constant("uibProgressConfig", {
        animate: !0,
        max: 100
    }).controller("UibProgressController", ["$scope", "$attrs", "uibProgressConfig", function(a, b, c) {
        function d() {
            return angular.isDefined(a.maxParam) ? a.maxParam : c.max
        }
        var e = this,
            f = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;
        this.bars = [], a.max = d(), this.addBar = function(a, b, c) {
            f || b.css({
                transition: "none"
            }), this.bars.push(a), a.max = d(), a.title = c && angular.isDefined(c.title) ? c.title : "progressbar", a.$watch("value", function(b) {
                a.recalculatePercentage()
            }), a.recalculatePercentage = function() {
                var b = e.bars.reduce(function(a, b) {
                    return b.percent = +(100 * b.value / b.max).toFixed(2), a + b.percent
                }, 0);
                b > 100 && (a.percent -= b - 100)
            }, a.$on("$destroy", function() {
                b = null, e.removeBar(a)
            })
        }, this.removeBar = function(a) {
            this.bars.splice(this.bars.indexOf(a), 1), this.bars.forEach(function(a) {
                a.recalculatePercentage()
            })
        }, a.$watch("maxParam", function(a) {
            e.bars.forEach(function(a) {
                a.max = d(), a.recalculatePercentage()
            })
        })
    }]).directive("uibProgress", function() {
        return {
            replace: !0,
            transclude: !0,
            controller: "UibProgressController",
            require: "uibProgress",
            scope: {
                maxParam: "=?max"
            },
            templateUrl: "uib/template/progressbar/progress.html"
        }
    }).directive("uibBar", function() {
        return {
            replace: !0,
            transclude: !0,
            require: "^uibProgress",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "uib/template/progressbar/bar.html",
            link: function(a, b, c, d) {
                d.addBar(a, b, c)
            }
        }
    }).directive("uibProgressbar", function() {
        return {
            replace: !0,
            transclude: !0,
            controller: "UibProgressController",
            scope: {
                value: "=",
                maxParam: "=?max",
                type: "@"
            },
            templateUrl: "uib/template/progressbar/progressbar.html",
            link: function(a, b, c, d) {
                d.addBar(a, angular.element(b.children()[0]), {
                    title: c.title
                })
            }
        }
    }), angular.module("ui.bootstrap.rating", []).constant("uibRatingConfig", {
        max: 5,
        stateOn: null,
        stateOff: null,
        enableReset: !0,
        titles: ["one", "two", "three", "four", "five"]
    }).controller("UibRatingController", ["$scope", "$attrs", "uibRatingConfig", function(a, b, c) {
        var d = {
                $setViewValue: angular.noop
            },
            e = this;
        this.init = function(e) {
            d = e, d.$render = this.render, d.$formatters.push(function(a) {
                return angular.isNumber(a) && a << 0 !== a && (a = Math.round(a)), a
            }), this.stateOn = angular.isDefined(b.stateOn) ? a.$parent.$eval(b.stateOn) : c.stateOn, this.stateOff = angular.isDefined(b.stateOff) ? a.$parent.$eval(b.stateOff) : c.stateOff, this.enableReset = angular.isDefined(b.enableReset) ? a.$parent.$eval(b.enableReset) : c.enableReset;
            var f = angular.isDefined(b.titles) ? a.$parent.$eval(b.titles) : c.titles;
            this.titles = angular.isArray(f) && f.length > 0 ? f : c.titles;
            var g = angular.isDefined(b.ratingStates) ? a.$parent.$eval(b.ratingStates) : new Array(angular.isDefined(b.max) ? a.$parent.$eval(b.max) : c.max);
            a.range = this.buildTemplateObjects(g)
        }, this.buildTemplateObjects = function(a) {
            for (var b = 0, c = a.length; b < c; b++) a[b] = angular.extend({
                index: b
            }, {
                stateOn: this.stateOn,
                stateOff: this.stateOff,
                title: this.getTitle(b)
            }, a[b]);
            return a
        }, this.getTitle = function(a) {
            return a >= this.titles.length ? a + 1 : this.titles[a]
        }, a.rate = function(b) {
            if (!a.readonly && b >= 0 && b <= a.range.length) {
                var c = e.enableReset && d.$viewValue === b ? 0 : b;
                d.$setViewValue(c), d.$render()
            }
        }, a.enter = function(b) {
            a.readonly || (a.value = b), a.onHover({
                value: b
            })
        }, a.reset = function() {
            a.value = d.$viewValue, a.onLeave()
        }, a.onKeydown = function(b) {
            /(37|38|39|40)/.test(b.which) && (b.preventDefault(), b.stopPropagation(), a.rate(a.value + (38 === b.which || 39 === b.which ? 1 : -1)))
        }, this.render = function() {
            a.value = d.$viewValue, a.title = e.getTitle(a.value - 1)
        }
    }]).directive("uibRating", function() {
        return {
            require: ["uibRating", "ngModel"],
            scope: {
                readonly: "=?readOnly",
                onHover: "&",
                onLeave: "&"
            },
            controller: "UibRatingController",
            templateUrl: "uib/template/rating/rating.html",
            replace: !0,
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                e.init(f)
            }
        }
    }), angular.module("ui.bootstrap.tabs", []).controller("UibTabsetController", ["$scope", function(a) {
        function b(a) {
            for (var b = 0; b < d.tabs.length; b++)
                if (d.tabs[b].index === a) return b
        }
        var c, d = this;
        d.tabs = [], d.select = function(a, f) {
            if (!e) {
                var g = b(c),
                    h = d.tabs[g];
                if (h) {
                    if (h.tab.onDeselect({
                            $event: f,
                            $selectedIndex: a
                        }), f && f.isDefaultPrevented()) return;
                    h.tab.active = !1
                }
                var i = d.tabs[a];
                i ? (i.tab.onSelect({
                    $event: f
                }), i.tab.active = !0, d.active = i.index, c = i.index) : !i && angular.isDefined(c) && (d.active = null, c = null)
            }
        }, d.addTab = function(a) {
            if (d.tabs.push({
                    tab: a,
                    index: a.index
                }), d.tabs.sort(function(a, b) {
                    return a.index > b.index ? 1 : a.index < b.index ? -1 : 0
                }), a.index === d.active || !angular.isDefined(d.active) && 1 === d.tabs.length) {
                var c = b(a.index);
                d.select(c)
            }
        }, d.removeTab = function(a) {
            for (var b, c = 0; c < d.tabs.length; c++)
                if (d.tabs[c].tab === a) {
                    b = c;
                    break
                } if (d.tabs[b].index === d.active) {
                var e = b === d.tabs.length - 1 ? b - 1 : b + 1 % d.tabs.length;
                d.select(e)
            }
            d.tabs.splice(b, 1)
        }, a.$watch("tabset.active", function(a) {
            angular.isDefined(a) && a !== c && d.select(b(a))
        });
        var e;
        a.$on("$destroy", function() {
            e = !0
        })
    }]).directive("uibTabset", function() {
        return {
            transclude: !0,
            replace: !0,
            scope: {},
            bindToController: {
                active: "=?",
                type: "@"
            },
            controller: "UibTabsetController",
            controllerAs: "tabset",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/tabs/tabset.html"
            },
            link: function(a, b, c) {
                a.vertical = !!angular.isDefined(c.vertical) && a.$parent.$eval(c.vertical), a.justified = !!angular.isDefined(c.justified) && a.$parent.$eval(c.justified)
            }
        }
    }).directive("uibTab", ["$parse", function(a) {
        return {
            require: "^uibTabset",
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/tabs/tab.html"
            },
            transclude: !0,
            scope: {
                heading: "@",
                index: "=?",
                classes: "@?",
                onSelect: "&select",
                onDeselect: "&deselect"
            },
            controller: function() {},
            controllerAs: "tab",
            link: function(b, c, d, e, f) {
                b.disabled = !1, d.disable && b.$parent.$watch(a(d.disable), function(a) {
                    b.disabled = !!a
                }), angular.isUndefined(d.index) && (e.tabs && e.tabs.length ? b.index = Math.max.apply(null, e.tabs.map(function(a) {
                    return a.index
                })) + 1 : b.index = 0), angular.isUndefined(d.classes) && (b.classes = ""), b.select = function(a) {
                    if (!b.disabled) {
                        for (var c, d = 0; d < e.tabs.length; d++)
                            if (e.tabs[d].tab === b) {
                                c = d;
                                break
                            } e.select(c, a)
                    }
                }, e.addTab(b), b.$on("$destroy", function() {
                    e.removeTab(b)
                }), b.$transcludeFn = f
            }
        }
    }]).directive("uibTabHeadingTransclude", function() {
        return {
            restrict: "A",
            require: "^uibTab",
            link: function(a, b) {
                a.$watch("headingElement", function(a) {
                    a && (b.html(""), b.append(a))
                })
            }
        }
    }).directive("uibTabContentTransclude", function() {
        function a(a) {
            return a.tagName && (a.hasAttribute("uib-tab-heading") || a.hasAttribute("data-uib-tab-heading") || a.hasAttribute("x-uib-tab-heading") || "uib-tab-heading" === a.tagName.toLowerCase() || "data-uib-tab-heading" === a.tagName.toLowerCase() || "x-uib-tab-heading" === a.tagName.toLowerCase() || "uib:tab-heading" === a.tagName.toLowerCase())
        }
        return {
            restrict: "A",
            require: "^uibTabset",
            link: function(b, c, d) {
                var e = b.$eval(d.uibTabContentTransclude).tab;
                e.$transcludeFn(e.$parent, function(b) {
                    angular.forEach(b, function(b) {
                        a(b) ? e.headingElement = b : c.append(b)
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.timepicker", []).constant("uibTimepickerConfig", {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        showMeridian: !0,
        showSeconds: !1,
        meridians: null,
        readonlyInput: !1,
        mousewheel: !0,
        arrowkeys: !0,
        showSpinners: !0,
        templateUrl: "uib/template/timepicker/timepicker.html"
    }).controller("UibTimepickerController", ["$scope", "$element", "$attrs", "$parse", "$log", "$locale", "uibTimepickerConfig", function(a, b, c, d, e, f, g) {
        function h() {
            var b = +a.hours,
                c = a.showMeridian ? b > 0 && b < 13 : b >= 0 && b < 24;
            if (c && "" !== a.hours) return a.showMeridian && (12 === b && (b = 0), a.meridian === v[1] && (b += 12)), b
        }

        function i() {
            var b = +a.minutes,
                c = b >= 0 && b < 60;
            if (c && "" !== a.minutes) return b
        }

        function j() {
            var b = +a.seconds;
            return b >= 0 && b < 60 ? b : void 0
        }

        function k(a, b) {
            return null === a ? "" : angular.isDefined(a) && a.toString().length < 2 && !b ? "0" + a : a.toString()
        }

        function l(a) {
            m(), u.$setViewValue(new Date(s)), n(a)
        }

        function m() {
            u.$setValidity("time", !0), a.invalidHours = !1, a.invalidMinutes = !1, a.invalidSeconds = !1
        }

        function n(b) {
            if (u.$modelValue) {
                var c = s.getHours(),
                    d = s.getMinutes(),
                    e = s.getSeconds();
                a.showMeridian && (c = 0 === c || 12 === c ? 12 : c % 12), a.hours = "h" === b ? c : k(c, !w), "m" !== b && (a.minutes = k(d)), a.meridian = s.getHours() < 12 ? v[0] : v[1], "s" !== b && (a.seconds = k(e)), a.meridian = s.getHours() < 12 ? v[0] : v[1]
            } else a.hours = null, a.minutes = null, a.seconds = null, a.meridian = v[0]
        }

        function o(a) {
            s = q(s, a), l()
        }

        function p(a, b) {
            return q(a, 60 * b)
        }

        function q(a, b) {
            var c = new Date(a.getTime() + 1e3 * b),
                d = new Date(a);
            return d.setHours(c.getHours(), c.getMinutes(), c.getSeconds()), d
        }

        function r() {
            return (null === a.hours || "" === a.hours) && (null === a.minutes || "" === a.minutes) && (!a.showSeconds || a.showSeconds && (null === a.seconds || "" === a.seconds))
        }
        var s = new Date,
            t = [],
            u = {
                $setViewValue: angular.noop
            },
            v = angular.isDefined(c.meridians) ? a.$parent.$eval(c.meridians) : g.meridians || f.DATETIME_FORMATS.AMPMS,
            w = !angular.isDefined(c.padHours) || a.$parent.$eval(c.padHours);
        a.tabindex = angular.isDefined(c.tabindex) ? c.tabindex : 0, b.removeAttr("tabindex"), this.init = function(b, d) {
            u = b, u.$render = this.render, u.$formatters.unshift(function(a) {
                return a ? new Date(a) : null
            });
            var e = d.eq(0),
                f = d.eq(1),
                h = d.eq(2),
                i = angular.isDefined(c.mousewheel) ? a.$parent.$eval(c.mousewheel) : g.mousewheel;
            i && this.setupMousewheelEvents(e, f, h);
            var j = angular.isDefined(c.arrowkeys) ? a.$parent.$eval(c.arrowkeys) : g.arrowkeys;
            j && this.setupArrowkeyEvents(e, f, h), a.readonlyInput = angular.isDefined(c.readonlyInput) ? a.$parent.$eval(c.readonlyInput) : g.readonlyInput, this.setupInputEvents(e, f, h)
        };
        var x = g.hourStep;
        c.hourStep && t.push(a.$parent.$watch(d(c.hourStep), function(a) {
            x = +a
        }));
        var y = g.minuteStep;
        c.minuteStep && t.push(a.$parent.$watch(d(c.minuteStep), function(a) {
            y = +a
        }));
        var z;
        t.push(a.$parent.$watch(d(c.min), function(a) {
            var b = new Date(a);
            z = isNaN(b) ? void 0 : b
        }));
        var A;
        t.push(a.$parent.$watch(d(c.max), function(a) {
            var b = new Date(a);
            A = isNaN(b) ? void 0 : b
        }));
        var B = !1;
        c.ngDisabled && t.push(a.$parent.$watch(d(c.ngDisabled), function(a) {
            B = a
        })), a.noIncrementHours = function() {
            var a = p(s, 60 * x);
            return B || a > A || a < s && a < z
        }, a.noDecrementHours = function() {
            var a = p(s, 60 * -x);
            return B || a < z || a > s && a > A
        }, a.noIncrementMinutes = function() {
            var a = p(s, y);
            return B || a > A || a < s && a < z
        }, a.noDecrementMinutes = function() {
            var a = p(s, -y);
            return B || a < z || a > s && a > A
        }, a.noIncrementSeconds = function() {
            var a = q(s, C);
            return B || a > A || a < s && a < z
        }, a.noDecrementSeconds = function() {
            var a = q(s, -C);
            return B || a < z || a > s && a > A
        }, a.noToggleMeridian = function() {
            return s.getHours() < 12 ? B || p(s, 720) > A : B || p(s, -720) < z
        };
        var C = g.secondStep;
        c.secondStep && t.push(a.$parent.$watch(d(c.secondStep), function(a) {
            C = +a
        })), a.showSeconds = g.showSeconds, c.showSeconds && t.push(a.$parent.$watch(d(c.showSeconds), function(b) {
            a.showSeconds = !!b
        })), a.showMeridian = g.showMeridian, c.showMeridian && t.push(a.$parent.$watch(d(c.showMeridian), function(b) {
            if (a.showMeridian = !!b, u.$error.time) {
                var c = h(),
                    d = i();
                angular.isDefined(c) && angular.isDefined(d) && (s.setHours(c), l())
            } else n()
        })), this.setupMousewheelEvents = function(b, c, d) {
            var e = function(a) {
                a.originalEvent && (a = a.originalEvent);
                var b = a.wheelDelta ? a.wheelDelta : -a.deltaY;
                return a.detail || b > 0
            };
            b.bind("mousewheel wheel", function(b) {
                B || a.$apply(e(b) ? a.incrementHours() : a.decrementHours()), b.preventDefault()
            }), c.bind("mousewheel wheel", function(b) {
                B || a.$apply(e(b) ? a.incrementMinutes() : a.decrementMinutes()), b.preventDefault()
            }), d.bind("mousewheel wheel", function(b) {
                B || a.$apply(e(b) ? a.incrementSeconds() : a.decrementSeconds()), b.preventDefault()
            })
        }, this.setupArrowkeyEvents = function(b, c, d) {
            b.bind("keydown", function(b) {
                B || (38 === b.which ? (b.preventDefault(), a.incrementHours(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementHours(), a.$apply()))
            }), c.bind("keydown", function(b) {
                B || (38 === b.which ? (b.preventDefault(), a.incrementMinutes(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementMinutes(), a.$apply()))
            }), d.bind("keydown", function(b) {
                B || (38 === b.which ? (b.preventDefault(), a.incrementSeconds(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementSeconds(), a.$apply()))
            })
        }, this.setupInputEvents = function(b, c, d) {
            if (a.readonlyInput) return a.updateHours = angular.noop, a.updateMinutes = angular.noop, void(a.updateSeconds = angular.noop);
            var e = function(b, c, d) {
                u.$setViewValue(null), u.$setValidity("time", !1), angular.isDefined(b) && (a.invalidHours = b), angular.isDefined(c) && (a.invalidMinutes = c), angular.isDefined(d) && (a.invalidSeconds = d)
            };
            a.updateHours = function() {
                var a = h(),
                    b = i();
                u.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (s.setHours(a), s.setMinutes(b), s < z || s > A ? e(!0) : l("h")) : e(!0)
            }, b.bind("blur", function(b) {
                u.$setTouched(), r() ? m() : null === a.hours || "" === a.hours ? e(!0) : !a.invalidHours && a.hours < 10 && a.$apply(function() {
                    a.hours = k(a.hours, !w)
                })
            }), a.updateMinutes = function() {
                var a = i(),
                    b = h();
                u.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (s.setHours(b), s.setMinutes(a), s < z || s > A ? e(void 0, !0) : l("m")) : e(void 0, !0)
            }, c.bind("blur", function(b) {
                u.$setTouched(), r() ? m() : null === a.minutes ? e(void 0, !0) : !a.invalidMinutes && a.minutes < 10 && a.$apply(function() {
                    a.minutes = k(a.minutes)
                })
            }), a.updateSeconds = function() {
                var a = j();
                u.$setDirty(), angular.isDefined(a) ? (s.setSeconds(a), l("s")) : e(void 0, void 0, !0)
            }, d.bind("blur", function(b) {
                r() ? m() : !a.invalidSeconds && a.seconds < 10 && a.$apply(function() {
                    a.seconds = k(a.seconds)
                })
            })
        }, this.render = function() {
            var b = u.$viewValue;
            isNaN(b) ? (u.$setValidity("time", !1), e.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (b && (s = b), s < z || s > A ? (u.$setValidity("time", !1), a.invalidHours = !0, a.invalidMinutes = !0) : m(), n())
        }, a.showSpinners = angular.isDefined(c.showSpinners) ? a.$parent.$eval(c.showSpinners) : g.showSpinners, a.incrementHours = function() {
            a.noIncrementHours() || o(60 * x * 60)
        }, a.decrementHours = function() {
            a.noDecrementHours() || o(60 * -x * 60)
        }, a.incrementMinutes = function() {
            a.noIncrementMinutes() || o(60 * y)
        }, a.decrementMinutes = function() {
            a.noDecrementMinutes() || o(60 * -y)
        }, a.incrementSeconds = function() {
            a.noIncrementSeconds() || o(C)
        }, a.decrementSeconds = function() {
            a.noDecrementSeconds() || o(-C)
        }, a.toggleMeridian = function() {
            var b = i(),
                c = h();
            a.noToggleMeridian() || (angular.isDefined(b) && angular.isDefined(c) ? o(720 * (s.getHours() < 12 ? 60 : -60)) : a.meridian = a.meridian === v[0] ? v[1] : v[0])
        }, a.blur = function() {
            u.$setTouched()
        }, a.$on("$destroy", function() {
            for (; t.length;) t.shift()()
        })
    }]).directive("uibTimepicker", ["uibTimepickerConfig", function(a) {
        return {
            require: ["uibTimepicker", "?^ngModel"],
            controller: "UibTimepickerController",
            controllerAs: "timepicker",
            replace: !0,
            scope: {},
            templateUrl: function(b, c) {
                return c.templateUrl || a.templateUrl
            },
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f && e.init(f, b.find("input"))
            }
        }
    }]), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.debounce", "ui.bootstrap.position"]).factory("uibTypeaheadParser", ["$parse", function(a) {
        var b = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
        return {
            parse: function(c) {
                var d = c.match(b);
                if (!d) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + c + '".');
                return {
                    itemName: d[3],
                    source: a(d[4]),
                    viewMapper: a(d[2] || d[1]),
                    modelMapper: a(d[1])
                }
            }
        }
    }]).controller("UibTypeaheadController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$q", "$timeout", "$document", "$window", "$rootScope", "$$debounce", "$uibPosition", "uibTypeaheadParser", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        function n() {
            O.moveInProgress || (O.moveInProgress = !0, O.$digest()), Z()
        }

        function o() {
            O.position = E ? l.offset(b) : l.position(b), O.position.top += b.prop("offsetHeight")
        }
        var p, q, r = [9, 13, 27, 38, 40],
            s = 200,
            t = a.$eval(c.typeaheadMinLength);
        t || 0 === t || (t = 1), a.$watch(c.typeaheadMinLength, function(a) {
            t = a || 0 === a ? a : 1
        });
        var u = a.$eval(c.typeaheadWaitMs) || 0,
            v = a.$eval(c.typeaheadEditable) !== !1;
        a.$watch(c.typeaheadEditable, function(a) {
            v = a !== !1
        });
        var w, x, y = e(c.typeaheadLoading).assign || angular.noop,
            z = c.typeaheadShouldSelect ? e(c.typeaheadShouldSelect) : function(a, b) {
                var c = b.$event;
                return 13 === c.which || 9 === c.which
            },
            A = e(c.typeaheadOnSelect),
            B = !!angular.isDefined(c.typeaheadSelectOnBlur) && a.$eval(c.typeaheadSelectOnBlur),
            C = e(c.typeaheadNoResults).assign || angular.noop,
            D = c.typeaheadInputFormatter ? e(c.typeaheadInputFormatter) : void 0,
            E = !!c.typeaheadAppendToBody && a.$eval(c.typeaheadAppendToBody),
            F = c.typeaheadAppendTo ? a.$eval(c.typeaheadAppendTo) : null,
            G = a.$eval(c.typeaheadFocusFirst) !== !1,
            H = !!c.typeaheadSelectOnExact && a.$eval(c.typeaheadSelectOnExact),
            I = e(c.typeaheadIsOpen).assign || angular.noop,
            J = a.$eval(c.typeaheadShowHint) || !1,
            K = e(c.ngModel),
            L = e(c.ngModel + "($$$p)"),
            M = function(b, c) {
                return angular.isFunction(K(a)) && q && q.$options && q.$options.getterSetter ? L(b, {
                    $$$p: c
                }) : K.assign(b, c)
            },
            N = m.parse(c.uibTypeahead),
            O = a.$new(),
            P = a.$on("$destroy", function() {
                O.$destroy()
            });
        O.$on("$destroy", P);
        var Q = "typeahead-" + O.$id + "-" + Math.floor(1e4 * Math.random());
        b.attr({
            "aria-autocomplete": "list",
            "aria-expanded": !1,
            "aria-owns": Q
        });
        var R, S;
        J && (R = angular.element("<div></div>"), R.css("position", "relative"), b.after(R), S = b.clone(), S.attr("placeholder", ""), S.attr("tabindex", "-1"), S.val(""), S.css({
            position: "absolute",
            top: "0px",
            left: "0px",
            "border-color": "transparent",
            "box-shadow": "none",
            opacity: 1,
            background: "none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)",
            color: "#999"
        }), b.css({
            position: "relative",
            "vertical-align": "top",
            "background-color": "transparent"
        }), R.append(S), S.after(b));
        var T = angular.element("<div uib-typeahead-popup></div>");
        T.attr({
            id: Q,
            matches: "matches",
            active: "activeIdx",
            select: "select(activeIdx, evt)",
            "move-in-progress": "moveInProgress",
            query: "query",
            position: "position",
            "assign-is-open": "assignIsOpen(isOpen)",
            debounce: "debounceUpdate"
        }), angular.isDefined(c.typeaheadTemplateUrl) && T.attr("template-url", c.typeaheadTemplateUrl), angular.isDefined(c.typeaheadPopupTemplateUrl) && T.attr("popup-template-url", c.typeaheadPopupTemplateUrl);
        var U = function() {
                J && S.val("")
            },
            V = function() {
                O.matches = [], O.activeIdx = -1, b.attr("aria-expanded", !1), U()
            },
            W = function(a) {
                return Q + "-option-" + a
            };
        O.$watch("activeIdx", function(a) {
            a < 0 ? b.removeAttr("aria-activedescendant") : b.attr("aria-activedescendant", W(a))
        });
        var X = function(a, b) {
                return !!(O.matches.length > b && a) && a.toUpperCase() === O.matches[b].label.toUpperCase()
            },
            Y = function(c, d) {
                var e = {
                    $viewValue: c
                };
                y(a, !0), C(a, !1), f.when(N.source(a, e)).then(function(f) {
                    var g = c === p.$viewValue;
                    if (g && w)
                        if (f && f.length > 0) {
                            O.activeIdx = G ? 0 : -1, C(a, !1), O.matches.length = 0;
                            for (var h = 0; h < f.length; h++) e[N.itemName] = f[h], O.matches.push({
                                id: W(h),
                                label: N.viewMapper(O, e),
                                model: f[h]
                            });
                            if (O.query = c, o(), b.attr("aria-expanded", !0), H && 1 === O.matches.length && X(c, 0) && (angular.isNumber(O.debounceUpdate) || angular.isObject(O.debounceUpdate) ? k(function() {
                                    O.select(0, d)
                                }, angular.isNumber(O.debounceUpdate) ? O.debounceUpdate : O.debounceUpdate["default"]) : O.select(0, d)), J) {
                                var i = O.matches[0].label;
                                angular.isString(c) && c.length > 0 && i.slice(0, c.length).toUpperCase() === c.toUpperCase() ? S.val(c + i.slice(c.length)) : S.val("")
                            }
                        } else V(), C(a, !0);
                    g && y(a, !1)
                }, function() {
                    V(), y(a, !1), C(a, !0)
                })
            };
        E && (angular.element(i).on("resize", n), h.find("body").on("scroll", n));
        var Z = k(function() {
            O.matches.length && o(), O.moveInProgress = !1
        }, s);
        O.moveInProgress = !1, O.query = void 0;
        var $, _ = function(a) {
                $ = g(function() {
                    Y(a)
                }, u)
            },
            aa = function() {
                $ && g.cancel($)
            };
        V(), O.assignIsOpen = function(b) {
            I(a, b)
        }, O.select = function(d, e) {
            var f, h, i = {};
            x = !0, i[N.itemName] = h = O.matches[d].model, f = N.modelMapper(a, i), M(a, f), p.$setValidity("editable", !0), p.$setValidity("parse", !0), A(a, {
                $item: h,
                $model: f,
                $label: N.viewMapper(a, i),
                $event: e
            }), V(), O.$eval(c.typeaheadFocusOnSelect) !== !1 && g(function() {
                b[0].focus()
            }, 0, !1)
        }, b.on("keydown", function(b) {
            if (0 !== O.matches.length && r.indexOf(b.which) !== -1) {
                var c = z(a, {
                    $event: b
                });
                if (O.activeIdx === -1 && c || 9 === b.which && b.shiftKey) return V(), void O.$digest();
                b.preventDefault();
                var d;
                switch (b.which) {
                    case 27:
                        b.stopPropagation(), V(), a.$digest();
                        break;
                    case 38:
                        O.activeIdx = (O.activeIdx > 0 ? O.activeIdx : O.matches.length) - 1, O.$digest(), d = T.find("li")[O.activeIdx], d.parentNode.scrollTop = d.offsetTop;
                        break;
                    case 40:
                        O.activeIdx = (O.activeIdx + 1) % O.matches.length, O.$digest(), d = T.find("li")[O.activeIdx], d.parentNode.scrollTop = d.offsetTop;
                        break;
                    default:
                        c && O.$apply(function() {
                            angular.isNumber(O.debounceUpdate) || angular.isObject(O.debounceUpdate) ? k(function() {
                                O.select(O.activeIdx, b)
                            }, angular.isNumber(O.debounceUpdate) ? O.debounceUpdate : O.debounceUpdate["default"]) : O.select(O.activeIdx, b)
                        })
                }
            }
        }), b.bind("focus", function(a) {
            w = !0, 0 !== t || p.$viewValue || g(function() {
                Y(p.$viewValue, a)
            }, 0)
        }), b.bind("blur", function(a) {
            B && O.matches.length && O.activeIdx !== -1 && !x && (x = !0, O.$apply(function() {
                angular.isObject(O.debounceUpdate) && angular.isNumber(O.debounceUpdate.blur) ? k(function() {
                    O.select(O.activeIdx, a)
                }, O.debounceUpdate.blur) : O.select(O.activeIdx, a)
            })), !v && p.$error.editable && (p.$setViewValue(), p.$setValidity("editable", !0), p.$setValidity("parse", !0), b.val("")), w = !1, x = !1
        });
        var ba = function(c) {
            b[0] !== c.target && 3 !== c.which && 0 !== O.matches.length && (V(), j.$$phase || a.$digest())
        };
        h.on("click", ba), a.$on("$destroy", function() {
            h.off("click", ba), (E || F) && ca.remove(), E && (angular.element(i).off("resize", n), h.find("body").off("scroll", n)), T.remove(), J && R.remove()
        });
        var ca = d(T)(O);
        E ? h.find("body").append(ca) : F ? angular.element(F).eq(0).append(ca) : b.after(ca), this.init = function(b, c) {
            p = b, q = c, O.debounceUpdate = p.$options && e(p.$options.debounce)(a), p.$parsers.unshift(function(b) {
                return w = !0, 0 === t || b && b.length >= t ? u > 0 ? (aa(), _(b)) : Y(b) : (y(a, !1), aa(), V()), v ? b : b ? void p.$setValidity("editable", !1) : (p.$setValidity("editable", !0), null)
            }), p.$formatters.push(function(b) {
                var c, d, e = {};
                return v || p.$setValidity("editable", !0), D ? (e.$model = b, D(a, e)) : (e[N.itemName] = b, c = N.viewMapper(a, e), e[N.itemName] = void 0, d = N.viewMapper(a, e), c !== d ? c : b)
            })
        }
    }]).directive("uibTypeahead", function() {
        return {
            controller: "UibTypeaheadController",
            require: ["ngModel", "^?ngModelOptions", "uibTypeahead"],
            link: function(a, b, c, d) {
                d[2].init(d[0], d[1])
            }
        }
    }).directive("uibTypeaheadPopup", ["$$debounce", function(a) {
        return {
            scope: {
                matches: "=",
                query: "=",
                active: "=",
                position: "&",
                moveInProgress: "=",
                select: "&",
                assignIsOpen: "&",
                debounce: "&"
            },
            replace: !0,
            templateUrl: function(a, b) {
                return b.popupTemplateUrl || "uib/template/typeahead/typeahead-popup.html"
            },
            link: function(b, c, d) {
                b.templateUrl = d.templateUrl, b.isOpen = function() {
                    var a = b.matches.length > 0;
                    return b.assignIsOpen({
                        isOpen: a
                    }), a
                }, b.isActive = function(a) {
                    return b.active === a
                }, b.selectActive = function(a) {
                    b.active = a
                }, b.selectMatch = function(c, d) {
                    var e = b.debounce();
                    angular.isNumber(e) || angular.isObject(e) ? a(function() {
                        b.select({
                            activeIdx: c,
                            evt: d
                        })
                    }, angular.isNumber(e) ? e : e["default"]) : b.select({
                        activeIdx: c,
                        evt: d
                    })
                }
            }
        }
    }]).directive("uibTypeaheadMatch", ["$templateRequest", "$compile", "$parse", function(a, b, c) {
        return {
            scope: {
                index: "=",
                match: "=",
                query: "="
            },
            link: function(d, e, f) {
                var g = c(f.templateUrl)(d.$parent) || "uib/template/typeahead/typeahead-match.html";
                a(g).then(function(a) {
                    var c = angular.element(a.trim());
                    e.replaceWith(c), b(c)(d)
                })
            }
        }
    }]).filter("uibTypeaheadHighlight", ["$sce", "$injector", "$log", function(a, b, c) {
        function d(a) {
            return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
        }

        function e(a) {
            return /<.*>/g.test(a)
        }
        var f;
        return f = b.has("$sanitize"),
            function(b, g) {
                return !f && e(b) && c.warn("Unsafe use of typeahead please use ngSanitize"), b = g ? ("" + b).replace(new RegExp(d(g), "gi"), "<strong>$&</strong>") : b, f || (b = a.trustAsHtml(b)), b
            }
    }]), angular.module("ui.bootstrap.carousel").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibCarouselCss && angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>'), angular.$$uibCarouselCss = !0
    }), angular.module("ui.bootstrap.datepicker").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}</style>'), angular.$$uibDatepickerCss = !0
    }), angular.module("ui.bootstrap.position").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'), angular.$$uibPositionCss = !0
    }), angular.module("ui.bootstrap.datepickerPopup").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerpopupCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}</style>'), angular.$$uibDatepickerpopupCss = !0
    }), angular.module("ui.bootstrap.tooltip").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibTooltipCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}</style>'), angular.$$uibTooltipCss = !0
    }), angular.module("ui.bootstrap.timepicker").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibTimepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-time input{width:50px;}</style>'), angular.$$uibTimepickerCss = !0
    }), angular.module("ui.bootstrap.typeahead").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibTypeaheadCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'), angular.$$uibTypeaheadCss = !0
    }), angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.isClass", "ui.bootstrap.datepicker", "ui.bootstrap.position", "ui.bootstrap.datepickerPopup", "ui.bootstrap.debounce", "ui.bootstrap.dropdown", "ui.bootstrap.stackedMap", "ui.bootstrap.modal", "ui.bootstrap.paging", "ui.bootstrap.pager", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.tpls", ["uib/template/accordion/accordion-group.html", "uib/template/accordion/accordion.html", "uib/template/alert/alert.html", "uib/template/carousel/carousel.html", "uib/template/carousel/slide.html", "uib/template/datepicker/datepicker.html", "uib/template/datepicker/day.html", "uib/template/datepicker/month.html", "uib/template/datepicker/year.html", "uib/template/datepickerPopup/popup.html", "uib/template/modal/backdrop.html", "uib/template/modal/window.html", "uib/template/pager/pager.html", "uib/template/pagination/pagination.html", "uib/template/tooltip/tooltip-html-popup.html", "uib/template/tooltip/tooltip-popup.html", "uib/template/tooltip/tooltip-template-popup.html", "uib/template/popover/popover-html.html", "uib/template/popover/popover-template.html", "uib/template/popover/popover.html", "uib/template/progressbar/bar.html", "uib/template/progressbar/progress.html", "uib/template/progressbar/progressbar.html", "uib/template/rating/rating.html", "uib/template/tabs/tab.html", "uib/template/tabs/tabset.html", "uib/template/timepicker/timepicker.html", "uib/template/typeahead/typeahead-match.html", "uib/template/typeahead/typeahead-popup.html"]), angular.module("ui.bootstrap.collapse", []).directive("uibCollapse", ["$animate", "$q", "$parse", "$injector", function(a, b, c, d) {
        var e = d.has("$animateCss") ? d.get("$animateCss") : null;
        return {
            link: function(d, f, g) {
                function h() {
                    f.hasClass("collapse") && f.hasClass("in") || b.resolve(l(d)).then(function() {
                        f.removeClass("collapse").addClass("collapsing").attr("aria-expanded", !0).attr("aria-hidden", !1), e ? e(f, {
                            addClass: "in",
                            easing: "ease",
                            to: {
                                height: f[0].scrollHeight + "px"
                            }
                        }).start()["finally"](i) : a.addClass(f, "in", {
                            to: {
                                height: f[0].scrollHeight + "px"
                            }
                        }).then(i)
                    })
                }

                function i() {
                    f.removeClass("collapsing").addClass("collapse").css({
                        height: "auto"
                    }), m(d)
                }

                function j() {
                    return f.hasClass("collapse") || f.hasClass("in") ? void b.resolve(n(d)).then(function() {
                        f.css({
                            height: f[0].scrollHeight + "px"
                        }).removeClass("collapse").addClass("collapsing").attr("aria-expanded", !1).attr("aria-hidden", !0), e ? e(f, {
                            removeClass: "in",
                            to: {
                                height: "0"
                            }
                        }).start()["finally"](k) : a.removeClass(f, "in", {
                            to: {
                                height: "0"
                            }
                        }).then(k)
                    }) : k()
                }

                function k() {
                    f.css({
                        height: "0"
                    }), f.removeClass("collapsing").addClass("collapse"), o(d)
                }
                var l = c(g.expanding),
                    m = c(g.expanded),
                    n = c(g.collapsing),
                    o = c(g.collapsed);
                d.$eval(g.uibCollapse) || f.addClass("in").addClass("collapse").attr("aria-expanded", !0).attr("aria-hidden", !1).css({
                    height: "auto"
                }), d.$watch(g.uibCollapse, function(a) {
                    a ? j() : h()
                })
            }
        }
    }]), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("uibAccordionConfig", {
        closeOthers: !0
    }).controller("UibAccordionController", ["$scope", "$attrs", "uibAccordionConfig", function(a, b, c) {
        this.groups = [], this.closeOthers = function(d) {
            var e = angular.isDefined(b.closeOthers) ? a.$eval(b.closeOthers) : c.closeOthers;
            e && angular.forEach(this.groups, function(a) {
                a !== d && (a.isOpen = !1)
            })
        }, this.addGroup = function(a) {
            var b = this;
            this.groups.push(a), a.$on("$destroy", function(c) {
                b.removeGroup(a)
            })
        }, this.removeGroup = function(a) {
            var b = this.groups.indexOf(a);
            b !== -1 && this.groups.splice(b, 1)
        }
    }]).directive("uibAccordion", function() {
        return {
            controller: "UibAccordionController",
            controllerAs: "accordion",
            transclude: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/accordion/accordion.html"
            }
        }
    }).directive("uibAccordionGroup", function() {
        return {
            require: "^uibAccordion",
            transclude: !0,
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/accordion/accordion-group.html"
            },
            scope: {
                heading: "@",
                panelClass: "@?",
                isOpen: "=?",
                isDisabled: "=?"
            },
            controller: function() {
                this.setHeading = function(a) {
                    this.heading = a
                }
            },
            link: function(a, b, c, d) {
                d.addGroup(a), a.openClass = c.openClass || "panel-open", a.panelClass = c.panelClass || "panel-default", a.$watch("isOpen", function(c) {
                    b.toggleClass(a.openClass, !!c), c && d.closeOthers(a)
                }), a.toggleOpen = function(b) {
                    a.isDisabled || b && 32 !== b.which || (a.isOpen = !a.isOpen)
                };
                var e = "accordiongroup-" + a.$id + "-" + Math.floor(1e4 * Math.random());
                a.headingId = e + "-tab", a.panelId = e + "-panel"
            }
        }
    }).directive("uibAccordionHeading", function() {
        return {
            transclude: !0,
            template: "",
            replace: !0,
            require: "^uibAccordionGroup",
            link: function(a, b, c, d, e) {
                d.setHeading(e(a, angular.noop))
            }
        }
    }).directive("uibAccordionTransclude", function() {
        function a() {
            return "uib-accordion-header,data-uib-accordion-header,x-uib-accordion-header,uib\\:accordion-header,[uib-accordion-header],[data-uib-accordion-header],[x-uib-accordion-header]"
        }
        return {
            require: "^uibAccordionGroup",
            link: function(b, c, d, e) {
                b.$watch(function() {
                    return e[d.uibAccordionTransclude]
                }, function(b) {
                    if (b) {
                        var d = angular.element(c[0].querySelector(a()));
                        d.html(""), d.append(b)
                    }
                })
            }
        }
    }), angular.module("ui.bootstrap.alert", []).controller("UibAlertController", ["$scope", "$attrs", "$interpolate", "$timeout", function(a, b, c, d) {
        a.closeable = !!b.close;
        var e = angular.isDefined(b.dismissOnTimeout) ? c(b.dismissOnTimeout)(a.$parent) : null;
        e && d(function() {
            a.close()
        }, parseInt(e, 10))
    }]).directive("uibAlert", function() {
        return {
            controller: "UibAlertController",
            controllerAs: "alert",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/alert/alert.html"
            },
            transclude: !0,
            replace: !0,
            scope: {
                type: "@",
                close: "&"
            }
        }
    }), angular.module("ui.bootstrap.buttons", []).constant("uibButtonConfig", {
        activeClass: "active",
        toggleEvent: "click"
    }).controller("UibButtonsController", ["uibButtonConfig", function(a) {
        this.activeClass = a.activeClass || "active", this.toggleEvent = a.toggleEvent || "click"
    }]).directive("uibBtnRadio", ["$parse", function(a) {
        return {
            require: ["uibBtnRadio", "ngModel"],
            controller: "UibButtonsController",
            controllerAs: "buttons",
            link: function(b, c, d, e) {
                var f = e[0],
                    g = e[1],
                    h = a(d.uibUncheckable);
                c.find("input").css({
                    display: "none"
                }), g.$render = function() {
                    c.toggleClass(f.activeClass, angular.equals(g.$modelValue, b.$eval(d.uibBtnRadio)))
                }, c.on(f.toggleEvent, function() {
                    if (!d.disabled) {
                        var a = c.hasClass(f.activeClass);
                        a && !angular.isDefined(d.uncheckable) || b.$apply(function() {
                            g.$setViewValue(a ? null : b.$eval(d.uibBtnRadio)), g.$render()
                        })
                    }
                }), d.uibUncheckable && b.$watch(h, function(a) {
                    d.$set("uncheckable", a ? "" : void 0)
                })
            }
        }
    }]).directive("uibBtnCheckbox", function() {
        return {
            require: ["uibBtnCheckbox", "ngModel"],
            controller: "UibButtonsController",
            controllerAs: "button",
            link: function(a, b, c, d) {
                function e() {
                    return g(c.btnCheckboxTrue, !0)
                }

                function f() {
                    return g(c.btnCheckboxFalse, !1)
                }

                function g(b, c) {
                    return angular.isDefined(b) ? a.$eval(b) : c
                }
                var h = d[0],
                    i = d[1];
                b.find("input").css({
                    display: "none"
                }), i.$render = function() {
                    b.toggleClass(h.activeClass, angular.equals(i.$modelValue, e()))
                }, b.on(h.toggleEvent, function() {
                    c.disabled || a.$apply(function() {
                        i.$setViewValue(b.hasClass(h.activeClass) ? f() : e()), i.$render()
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.carousel", []).controller("UibCarouselController", ["$scope", "$element", "$interval", "$timeout", "$animate", function(a, b, c, d, e) {
        function f() {
            for (; t.length;) t.shift()
        }

        function g(a) {
            for (var b = 0; b < q.length; b++) q[b].slide.active = b === a
        }

        function h(c, d, i) {
            if (!u) {
                if (angular.extend(c, {
                        direction: i
                    }), angular.extend(q[s].slide || {}, {
                        direction: i
                    }), e.enabled(b) && !a.$currentTransition && q[d].element && p.slides.length > 1) {
                    q[d].element.data(r, c.direction);
                    var j = p.getCurrentIndex();
                    angular.isNumber(j) && q[j].element && q[j].element.data(r, c.direction), a.$currentTransition = !0, e.on("addClass", q[d].element, function(b, c) {
                        if ("close" === c && (a.$currentTransition = null, e.off("addClass", b), t.length)) {
                            var d = t.pop().slide,
                                g = d.index,
                                i = g > p.getCurrentIndex() ? "next" : "prev";
                            f(), h(d, g, i)
                        }
                    })
                }
                a.active = c.index, s = c.index, g(d), l()
            }
        }

        function i(a) {
            for (var b = 0; b < q.length; b++)
                if (q[b].slide === a) return b
        }

        function j() {
            n && (c.cancel(n), n = null)
        }

        function k(b) {
            b.length || (a.$currentTransition = null, f())
        }

        function l() {
            j();
            var b = +a.interval;
            !isNaN(b) && b > 0 && (n = c(m, b))
        }

        function m() {
            var b = +a.interval;
            o && !isNaN(b) && b > 0 && q.length ? a.next() : a.pause()
        }
        var n, o, p = this,
            q = p.slides = a.slides = [],
            r = "uib-slideDirection",
            s = a.active,
            t = [],
            u = !1;
        p.addSlide = function(b, c) {
            q.push({
                slide: b,
                element: c
            }), q.sort(function(a, b) {
                return +a.slide.index - +b.slide.index
            }), (b.index === a.active || 1 === q.length && !angular.isNumber(a.active)) && (a.$currentTransition && (a.$currentTransition = null), s = b.index, a.active = b.index, g(s), p.select(q[i(b)]), 1 === q.length && a.play())
        }, p.getCurrentIndex = function() {
            for (var a = 0; a < q.length; a++)
                if (q[a].slide.index === s) return a
        }, p.next = a.next = function() {
            var b = (p.getCurrentIndex() + 1) % q.length;
            return 0 === b && a.noWrap() ? void a.pause() : p.select(q[b], "next")
        }, p.prev = a.prev = function() {
            var b = p.getCurrentIndex() - 1 < 0 ? q.length - 1 : p.getCurrentIndex() - 1;
            return a.noWrap() && b === q.length - 1 ? void a.pause() : p.select(q[b], "prev")
        }, p.removeSlide = function(b) {
            var c = i(b),
                d = t.indexOf(q[c]);
            d !== -1 && t.splice(d, 1), q.splice(c, 1), q.length > 0 && s === c ? c >= q.length ? (s = q.length - 1, a.active = s, g(s), p.select(q[q.length - 1])) : (s = c, a.active = s, g(s), p.select(q[c])) : s > c && (s--, a.active = s), 0 === q.length && (s = null, a.active = null, f())
        }, p.select = a.select = function(b, c) {
            var d = i(b.slide);
            void 0 === c && (c = d > p.getCurrentIndex() ? "next" : "prev"), b.slide.index === s || a.$currentTransition ? b && b.slide.index !== s && a.$currentTransition && t.push(q[d]) : h(b.slide, d, c)
        }, a.indexOfSlide = function(a) {
            return +a.slide.index
        }, a.isActive = function(b) {
            return a.active === b.slide.index
        }, a.isPrevDisabled = function() {
            return 0 === a.active && a.noWrap()
        }, a.isNextDisabled = function() {
            return a.active === q.length - 1 && a.noWrap()
        }, a.pause = function() {
            a.noPause || (o = !1, j())
        }, a.play = function() {
            o || (o = !0, l())
        }, a.$on("$destroy", function() {
            u = !0, j()
        }), a.$watch("noTransition", function(a) {
            e.enabled(b, !a)
        }), a.$watch("interval", l), a.$watchCollection("slides", k), a.$watch("active", function(a) {
            if (angular.isNumber(a) && s !== a) {
                for (var b = 0; b < q.length; b++)
                    if (q[b].slide.index === a) {
                        a = b;
                        break
                    } var c = q[a];
                c && (g(a), p.select(q[a]), s = a)
            }
        })
    }]).directive("uibCarousel", function() {
        return {
            transclude: !0,
            replace: !0,
            controller: "UibCarouselController",
            controllerAs: "carousel",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/carousel/carousel.html"
            },
            scope: {
                active: "=",
                interval: "=",
                noTransition: "=",
                noPause: "=",
                noWrap: "&"
            }
        }
    }).directive("uibSlide", function() {
        return {
            require: "^uibCarousel",
            transclude: !0,
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/carousel/slide.html"
            },
            scope: {
                actual: "=?",
                index: "=?"
            },
            link: function(a, b, c, d) {
                d.addSlide(a, b), a.$on("$destroy", function() {
                    d.removeSlide(a)
                })
            }
        }
    }).animation(".item", ["$animateCss", function(a) {
        function b(a, b, c) {
            a.removeClass(b), c && c()
        }
        var c = "uib-slideDirection";
        return {
            beforeAddClass: function(d, e, f) {
                if ("active" === e) {
                    var g = !1,
                        h = d.data(c),
                        i = "next" === h ? "left" : "right",
                        j = b.bind(this, d, i + " " + h, f);
                    return d.addClass(h), a(d, {
                            addClass: i
                        }).start().done(j),
                        function() {
                            g = !0
                        }
                }
                f()
            },
            beforeRemoveClass: function(d, e, f) {
                if ("active" === e) {
                    var g = !1,
                        h = d.data(c),
                        i = "next" === h ? "left" : "right",
                        j = b.bind(this, d, i, f);
                    return a(d, {
                            addClass: i
                        }).start().done(j),
                        function() {
                            g = !0
                        }
                }
                f()
            }
        }
    }]), angular.module("ui.bootstrap.dateparser", []).service("uibDateParser", ["$log", "$locale", "dateFilter", "orderByFilter", function(a, b, c, d) {
        function e(a, b) {
            var c = [],
                e = a.split(""),
                f = a.indexOf("'");
            if (f > -1) {
                var g = !1;
                a = a.split("");
                for (var h = f; h < a.length; h++) g ? ("'" === a[h] && (h + 1 < a.length && "'" === a[h + 1] ? (a[h + 1] = "$", e[h + 1] = "") : (e[h] = "", g = !1)), a[h] = "$") : "'" === a[h] && (a[h] = "$", e[h] = "", g = !0);
                a = a.join("")
            }
            return angular.forEach(n, function(d) {
                var f = a.indexOf(d.key);
                if (f > -1) {
                    a = a.split(""), e[f] = "(" + d.regex + ")", a[f] = "$";
                    for (var g = f + 1, h = f + d.key.length; g < h; g++) e[g] = "", a[g] = "$";
                    a = a.join(""), c.push({
                        index: f,
                        key: d.key,
                        apply: d[b],
                        matcher: d.regex
                    })
                }
            }), {
                regex: new RegExp("^" + e.join("") + "$"),
                map: d(c, "index")
            }
        }

        function f(a, b, c) {
            return !(c < 1) && (1 === b && c > 28 ? 29 === c && (a % 4 === 0 && a % 100 !== 0 || a % 400 === 0) : 3 !== b && 5 !== b && 8 !== b && 10 !== b || c < 31)
        }

        function g(a) {
            return parseInt(a, 10)
        }

        function h(a, b) {
            return a && b ? l(a, b) : a
        }

        function i(a, b) {
            return a && b ? l(a, b, !0) : a
        }

        function j(a, b) {
            a = a.replace(/:/g, "");
            var c = Date.parse("Jan 01, 1970 00:00:00 " + a) / 6e4;
            return isNaN(c) ? b : c
        }

        function k(a, b) {
            return a = new Date(a.getTime()), a.setMinutes(a.getMinutes() + b), a
        }

        function l(a, b, c) {
            c = c ? -1 : 1;
            var d = a.getTimezoneOffset(),
                e = j(b, d);
            return k(a, c * (e - d))
        }
        var m, n, o = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
        this.init = function() {
            m = b.id, this.parsers = {}, this.formatters = {}, n = [{
                key: "yyyy",
                regex: "\\d{4}",
                apply: function(a) {
                    this.year = +a
                },
                formatter: function(a) {
                    var b = new Date;
                    return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yyyy")
                }
            }, {
                key: "yy",
                regex: "\\d{2}",
                apply: function(a) {
                    a = +a, this.year = a < 69 ? a + 2e3 : a + 1900
                },
                formatter: function(a) {
                    var b = new Date;
                    return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yy")
                }
            }, {
                key: "y",
                regex: "\\d{1,4}",
                apply: function(a) {
                    this.year = +a
                },
                formatter: function(a) {
                    var b = new Date;
                    return b.setFullYear(Math.abs(a.getFullYear())), c(b, "y")
                }
            }, {
                key: "M!",
                regex: "0?[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                },
                formatter: function(a) {
                    var b = a.getMonth();
                    return /^[0-9]$/.test(b) ? c(a, "MM") : c(a, "M")
                }
            }, {
                key: "MMMM",
                regex: b.DATETIME_FORMATS.MONTH.join("|"),
                apply: function(a) {
                    this.month = b.DATETIME_FORMATS.MONTH.indexOf(a)
                },
                formatter: function(a) {
                    return c(a, "MMMM")
                }
            }, {
                key: "MMM",
                regex: b.DATETIME_FORMATS.SHORTMONTH.join("|"),
                apply: function(a) {
                    this.month = b.DATETIME_FORMATS.SHORTMONTH.indexOf(a)
                },
                formatter: function(a) {
                    return c(a, "MMM")
                }
            }, {
                key: "MM",
                regex: "0[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                },
                formatter: function(a) {
                    return c(a, "MM")
                }
            }, {
                key: "M",
                regex: "[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                },
                formatter: function(a) {
                    return c(a, "M")
                }
            }, {
                key: "d!",
                regex: "[0-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                },
                formatter: function(a) {
                    var b = a.getDate();
                    return /^[1-9]$/.test(b) ? c(a, "dd") : c(a, "d")
                }
            }, {
                key: "dd",
                regex: "[0-2][0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                },
                formatter: function(a) {
                    return c(a, "dd")
                }
            }, {
                key: "d",
                regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                },
                formatter: function(a) {
                    return c(a, "d")
                }
            }, {
                key: "EEEE",
                regex: b.DATETIME_FORMATS.DAY.join("|"),
                formatter: function(a) {
                    return c(a, "EEEE")
                }
            }, {
                key: "EEE",
                regex: b.DATETIME_FORMATS.SHORTDAY.join("|"),
                formatter: function(a) {
                    return c(a, "EEE")
                }
            }, {
                key: "HH",
                regex: "(?:0|1)[0-9]|2[0-3]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "HH")
                }
            }, {
                key: "hh",
                regex: "0[0-9]|1[0-2]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "hh")
                }
            }, {
                key: "H",
                regex: "1?[0-9]|2[0-3]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "H")
                }
            }, {
                key: "h",
                regex: "[0-9]|1[0-2]",
                apply: function(a) {
                    this.hours = +a
                },
                formatter: function(a) {
                    return c(a, "h")
                }
            }, {
                key: "mm",
                regex: "[0-5][0-9]",
                apply: function(a) {
                    this.minutes = +a
                },
                formatter: function(a) {
                    return c(a, "mm")
                }
            }, {
                key: "m",
                regex: "[0-9]|[1-5][0-9]",
                apply: function(a) {
                    this.minutes = +a
                },
                formatter: function(a) {
                    return c(a, "m")
                }
            }, {
                key: "sss",
                regex: "[0-9][0-9][0-9]",
                apply: function(a) {
                    this.milliseconds = +a
                },
                formatter: function(a) {
                    return c(a, "sss")
                }
            }, {
                key: "ss",
                regex: "[0-5][0-9]",
                apply: function(a) {
                    this.seconds = +a
                },
                formatter: function(a) {
                    return c(a, "ss")
                }
            }, {
                key: "s",
                regex: "[0-9]|[1-5][0-9]",
                apply: function(a) {
                    this.seconds = +a
                },
                formatter: function(a) {
                    return c(a, "s")
                }
            }, {
                key: "a",
                regex: b.DATETIME_FORMATS.AMPMS.join("|"),
                apply: function(a) {
                    12 === this.hours && (this.hours = 0), "PM" === a && (this.hours += 12)
                },
                formatter: function(a) {
                    return c(a, "a")
                }
            }, {
                key: "Z",
                regex: "[+-]\\d{4}",
                apply: function(a) {
                    var b = a.match(/([+-])(\d{2})(\d{2})/),
                        c = b[1],
                        d = b[2],
                        e = b[3];
                    this.hours += g(c + d), this.minutes += g(c + e)
                },
                formatter: function(a) {
                    return c(a, "Z")
                }
            }, {
                key: "ww",
                regex: "[0-4][0-9]|5[0-3]",
                formatter: function(a) {
                    return c(a, "ww")
                }
            }, {
                key: "w",
                regex: "[0-9]|[1-4][0-9]|5[0-3]",
                formatter: function(a) {
                    return c(a, "w")
                }
            }, {
                key: "GGGG",
                regex: b.DATETIME_FORMATS.ERANAMES.join("|").replace(/\s/g, "\\s"),
                formatter: function(a) {
                    return c(a, "GGGG")
                }
            }, {
                key: "GGG",
                regex: b.DATETIME_FORMATS.ERAS.join("|"),
                formatter: function(a) {
                    return c(a, "GGG")
                }
            }, {
                key: "GG",
                regex: b.DATETIME_FORMATS.ERAS.join("|"),
                formatter: function(a) {
                    return c(a, "GG")
                }
            }, {
                key: "G",
                regex: b.DATETIME_FORMATS.ERAS.join("|"),
                formatter: function(a) {
                    return c(a, "G")
                }
            }]
        }, this.init(), this.filter = function(a, c) {
            if (!angular.isDate(a) || isNaN(a) || !c) return "";
            c = b.DATETIME_FORMATS[c] || c, b.id !== m && this.init(), this.formatters[c] || (this.formatters[c] = e(c, "formatter"));
            var d = this.formatters[c],
                f = d.map,
                g = c;
            return f.reduce(function(b, c, d) {
                var e = g.match(new RegExp("(.*)" + c.key));
                e && angular.isString(e[1]) && (b += e[1], g = g.replace(e[1] + c.key, ""));
                var h = d === f.length - 1 ? g : "";
                return c.apply ? b + c.apply.call(null, a) + h : b + h
            }, "")
        }, this.parse = function(c, d, g) {
            if (!angular.isString(c) || !d) return c;
            d = b.DATETIME_FORMATS[d] || d, d = d.replace(o, "\\$&"), b.id !== m && this.init(), this.parsers[d] || (this.parsers[d] = e(d, "apply"));
            var h = this.parsers[d],
                i = h.regex,
                j = h.map,
                k = c.match(i),
                l = !1;
            if (k && k.length) {
                var n, p;
                angular.isDate(g) && !isNaN(g.getTime()) ? n = {
                    year: g.getFullYear(),
                    month: g.getMonth(),
                    date: g.getDate(),
                    hours: g.getHours(),
                    minutes: g.getMinutes(),
                    seconds: g.getSeconds(),
                    milliseconds: g.getMilliseconds()
                } : (g && a.warn("dateparser:", "baseDate is not a valid date"), n = {
                    year: 1900,
                    month: 0,
                    date: 1,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0
                });
                for (var q = 1, r = k.length; q < r; q++) {
                    var s = j[q - 1];
                    "Z" === s.matcher && (l = !0), s.apply && s.apply.call(n, k[q])
                }
                var t = l ? Date.prototype.setUTCFullYear : Date.prototype.setFullYear,
                    u = l ? Date.prototype.setUTCHours : Date.prototype.setHours;
                return f(n.year, n.month, n.date) && (!angular.isDate(g) || isNaN(g.getTime()) || l ? (p = new Date(0), t.call(p, n.year, n.month, n.date), u.call(p, n.hours || 0, n.minutes || 0, n.seconds || 0, n.milliseconds || 0)) : (p = new Date(g), t.call(p, n.year, n.month, n.date), u.call(p, n.hours, n.minutes, n.seconds, n.milliseconds))), p
            }
        }, this.toTimezone = h, this.fromTimezone = i, this.timezoneToOffset = j, this.addDateMinutes = k, this.convertTimezoneToLocal = l
    }]), angular.module("ui.bootstrap.isClass", []).directive("uibIsClass", ["$animate", function(a) {
        var b = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/,
            c = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;
        return {
            restrict: "A",
            compile: function(d, e) {
                function f(a, b, c) {
                    i.push(a), j.push({
                        scope: a,
                        element: b
                    }), o.forEach(function(b, c) {
                        g(b, a)
                    }), a.$on("$destroy", h)
                }

                function g(b, d) {
                    var e = b.match(c),
                        f = d.$eval(e[1]),
                        g = e[2],
                        h = k[b];
                    if (!h) {
                        var i = function(b) {
                            var c = null;
                            j.some(function(a) {
                                var d = a.scope.$eval(m);
                                if (d === b) return c = a, !0
                            }), h.lastActivated !== c && (h.lastActivated && a.removeClass(h.lastActivated.element, f), c && a.addClass(c.element, f), h.lastActivated = c)
                        };
                        k[b] = h = {
                            lastActivated: null,
                            scope: d,
                            watchFn: i,
                            compareWithExp: g,
                            watcher: d.$watch(g, i)
                        }
                    }
                    h.watchFn(d.$eval(g))
                }

                function h(a) {
                    var b = a.targetScope,
                        c = i.indexOf(b);
                    if (i.splice(c, 1), j.splice(c, 1), i.length) {
                        var d = i[0];
                        angular.forEach(k, function(a) {
                            a.scope === b && (a.watcher = d.$watch(a.compareWithExp, a.watchFn), a.scope = d)
                        })
                    } else k = {}
                }
                var i = [],
                    j = [],
                    k = {},
                    l = e.uibIsClass.match(b),
                    m = l[2],
                    n = l[1],
                    o = n.split(",");
                return f
            }
        }
    }]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.isClass"]).value("$datepickerSuppressError", !1).value("$datepickerLiteralWarning", !0).constant("uibDatepickerConfig", {
        datepickerMode: "day",
        formatDay: "dd",
        formatMonth: "MMMM",
        formatYear: "yyyy",
        formatDayHeader: "EEE",
        formatDayTitle: "MMMM yyyy",
        formatMonthTitle: "yyyy",
        maxDate: null,
        maxMode: "year",
        minDate: null,
        minMode: "day",
        ngModelOptions: {},
        shortcutPropagation: !1,
        showWeeks: !0,
        yearColumns: 5,
        yearRows: 4
    }).controller("UibDatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$locale", "$log", "dateFilter", "uibDatepickerConfig", "$datepickerLiteralWarning", "$datepickerSuppressError", "uibDateParser", function(a, b, c, d, e, f, g, h, i, j, k) {
        function l(b) {
            a.datepickerMode = b, a.datepickerOptions.datepickerMode = b
        }
        var m = this,
            n = {
                $setViewValue: angular.noop
            },
            o = {},
            p = [];
        !!b.datepickerOptions;
        a.datepickerOptions || (a.datepickerOptions = {}), this.modes = ["day", "month", "year"], ["customClass", "dateDisabled", "datepickerMode", "formatDay", "formatDayHeader", "formatDayTitle", "formatMonth", "formatMonthTitle", "formatYear", "maxDate", "maxMode", "minDate", "minMode", "showWeeks", "shortcutPropagation", "startingDay", "yearColumns", "yearRows"].forEach(function(b) {
            switch (b) {
                case "customClass":
                case "dateDisabled":
                    a[b] = a.datepickerOptions[b] || angular.noop;
                    break;
                case "datepickerMode":
                    a.datepickerMode = angular.isDefined(a.datepickerOptions.datepickerMode) ? a.datepickerOptions.datepickerMode : h.datepickerMode;
                    break;
                case "formatDay":
                case "formatDayHeader":
                case "formatDayTitle":
                case "formatMonth":
                case "formatMonthTitle":
                case "formatYear":
                    m[b] = angular.isDefined(a.datepickerOptions[b]) ? d(a.datepickerOptions[b])(a.$parent) : h[b];
                    break;
                case "showWeeks":
                case "shortcutPropagation":
                case "yearColumns":
                case "yearRows":
                    m[b] = angular.isDefined(a.datepickerOptions[b]) ? a.datepickerOptions[b] : h[b];
                    break;
                case "startingDay":
                    angular.isDefined(a.datepickerOptions.startingDay) ? m.startingDay = a.datepickerOptions.startingDay : angular.isNumber(h.startingDay) ? m.startingDay = h.startingDay : m.startingDay = (e.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
                    break;
                case "maxDate":
                case "minDate":
                    a.$watch("datepickerOptions." + b, function(a) {
                        a ? angular.isDate(a) ? m[b] = k.fromTimezone(new Date(a), o.timezone) : (i && f.warn("Literal date support has been deprecated, please switch to date object usage"), m[b] = new Date(g(a, "medium"))) : m[b] = h[b] ? k.fromTimezone(new Date(h[b]), o.timezone) : null, m.refreshView()
                    });
                    break;
                case "maxMode":
                case "minMode":
                    a.datepickerOptions[b] ? a.$watch(function() {
                        return a.datepickerOptions[b]
                    }, function(c) {
                        m[b] = a[b] = angular.isDefined(c) ? c : datepickerOptions[b], ("minMode" === b && m.modes.indexOf(a.datepickerOptions.datepickerMode) < m.modes.indexOf(m[b]) || "maxMode" === b && m.modes.indexOf(a.datepickerOptions.datepickerMode) > m.modes.indexOf(m[b])) && (a.datepickerMode = m[b], a.datepickerOptions.datepickerMode = m[b])
                    }) : m[b] = a[b] = h[b] || null
            }
        }), a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()), a.disabled = angular.isDefined(b.disabled) || !1, angular.isDefined(b.ngDisabled) && p.push(a.$parent.$watch(b.ngDisabled, function(b) {
            a.disabled = b, m.refreshView()
        })), a.isActive = function(b) {
            return 0 === m.compare(b.date, m.activeDate) && (a.activeDateId = b.uid, !0)
        }, this.init = function(b) {
            n = b, o = b.$options || h.ngModelOptions, a.datepickerOptions.initDate ? (m.activeDate = k.fromTimezone(a.datepickerOptions.initDate, o.timezone) || new Date, a.$watch("datepickerOptions.initDate", function(a) {
                a && (n.$isEmpty(n.$modelValue) || n.$invalid) && (m.activeDate = k.fromTimezone(a, o.timezone), m.refreshView())
            })) : m.activeDate = new Date;
            var c = n.$modelValue ? new Date(n.$modelValue) : new Date;
            this.activeDate = isNaN(c) ? k.fromTimezone(new Date, o.timezone) : k.fromTimezone(c, o.timezone), n.$render = function() {
                m.render()
            }
        }, this.render = function() {
            if (n.$viewValue) {
                var a = new Date(n.$viewValue),
                    b = !isNaN(a);
                b ? this.activeDate = k.fromTimezone(a, o.timezone) : j || f.error('Datepicker directive: "ng-model" value must be a Date object')
            }
            this.refreshView()
        }, this.refreshView = function() {
            if (this.element) {
                a.selectedDt = null, this._refreshView(), a.activeDt && (a.activeDateId = a.activeDt.uid);
                var b = n.$viewValue ? new Date(n.$viewValue) : null;
                b = k.fromTimezone(b, o.timezone), n.$setValidity("dateDisabled", !b || this.element && !this.isDisabled(b))
            }
        }, this.createDateObject = function(b, c) {
            var d = n.$viewValue ? new Date(n.$viewValue) : null;
            d = k.fromTimezone(d, o.timezone);
            var e = new Date;
            e = k.fromTimezone(e, o.timezone);
            var f = this.compare(b, e),
                g = {
                    date: b,
                    label: k.filter(b, c),
                    selected: d && 0 === this.compare(b, d),
                    disabled: this.isDisabled(b),
                    past: f < 0,
                    current: 0 === f,
                    future: f > 0,
                    customClass: this.customClass(b) || null
                };
            return d && 0 === this.compare(b, d) && (a.selectedDt = g), m.activeDate && 0 === this.compare(g.date, m.activeDate) && (a.activeDt = g), g
        }, this.isDisabled = function(b) {
            return a.disabled || this.minDate && this.compare(b, this.minDate) < 0 || this.maxDate && this.compare(b, this.maxDate) > 0 || a.dateDisabled && a.dateDisabled({
                date: b,
                mode: a.datepickerMode
            })
        }, this.customClass = function(b) {
            return a.customClass({
                date: b,
                mode: a.datepickerMode
            })
        }, this.split = function(a, b) {
            for (var c = []; a.length > 0;) c.push(a.splice(0, b));
            return c
        }, a.select = function(b) {
            if (a.datepickerMode === m.minMode) {
                var c = n.$viewValue ? k.fromTimezone(new Date(n.$viewValue), o.timezone) : new Date(0, 0, 0, 0, 0, 0, 0);
                c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()), c = k.toTimezone(c, o.timezone), n.$setViewValue(c), n.$render()
            } else m.activeDate = b, l(m.modes[m.modes.indexOf(a.datepickerMode) - 1]), a.$emit("uib:datepicker.mode");
            a.$broadcast("uib:datepicker.focus")
        }, a.move = function(a) {
            var b = m.activeDate.getFullYear() + a * (m.step.years || 0),
                c = m.activeDate.getMonth() + a * (m.step.months || 0);
            m.activeDate.setFullYear(b, c, 1), m.refreshView()
        }, a.toggleMode = function(b) {
            b = b || 1, a.datepickerMode === m.maxMode && 1 === b || a.datepickerMode === m.minMode && b === -1 || (l(m.modes[m.modes.indexOf(a.datepickerMode) + b]), a.$emit("uib:datepicker.mode"))
        }, a.keys = {
            13: "enter",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
        var q = function() {
            m.element[0].focus()
        };
        a.$on("uib:datepicker.focus", q), a.keydown = function(b) {
            var c = a.keys[b.which];
            if (c && !b.shiftKey && !b.altKey && !a.disabled)
                if (b.preventDefault(), m.shortcutPropagation || b.stopPropagation(), "enter" === c || "space" === c) {
                    if (m.isDisabled(m.activeDate)) return;
                    a.select(m.activeDate)
                } else !b.ctrlKey || "up" !== c && "down" !== c ? (m.handleKeyDown(c, b), m.refreshView()) : a.toggleMode("up" === c ? 1 : -1)
        }, a.$on("$destroy", function() {
            for (; p.length;) p.shift()()
        })
    }]).controller("UibDaypickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
        function d(a, b) {
            return 1 !== b || a % 4 !== 0 || a % 100 === 0 && a % 400 !== 0 ? f[b] : 29
        }

        function e(a) {
            var b = new Date(a);
            b.setDate(b.getDate() + 4 - (b.getDay() || 7));
            var c = b.getTime();
            return b.setMonth(0), b.setDate(1), Math.floor(Math.round((c - b) / 864e5) / 7) + 1
        }
        var f = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.step = {
            months: 1
        }, this.element = b, this.init = function(b) {
            angular.extend(b, this), a.showWeeks = b.showWeeks, b.refreshView()
        }, this.getDates = function(a, b) {
            for (var c, d = new Array(b), e = new Date(a), f = 0; f < b;) c = new Date(e), d[f++] = c, e.setDate(e.getDate() + 1);
            return d
        }, this._refreshView = function() {
            var b = this.activeDate.getFullYear(),
                d = this.activeDate.getMonth(),
                f = new Date(this.activeDate);
            f.setFullYear(b, d, 1);
            var g = this.startingDay - f.getDay(),
                h = g > 0 ? 7 - g : -g,
                i = new Date(f);
            h > 0 && i.setDate(-h + 1);
            for (var j = this.getDates(i, 42), k = 0; k < 42; k++) j[k] = angular.extend(this.createDateObject(j[k], this.formatDay), {
                secondary: j[k].getMonth() !== d,
                uid: a.uniqueId + "-" + k
            });
            a.labels = new Array(7);
            for (var l = 0; l < 7; l++) a.labels[l] = {
                abbr: c(j[l].date, this.formatDayHeader),
                full: c(j[l].date, "EEEE")
            };
            if (a.title = c(this.activeDate, this.formatDayTitle), a.rows = this.split(j, 7), a.showWeeks) {
                a.weekNumbers = [];
                for (var m = (11 - this.startingDay) % 7, n = a.rows.length, o = 0; o < n; o++) a.weekNumbers.push(e(a.rows[o][m].date))
            }
        }, this.compare = function(a, b) {
            var c = new Date(a.getFullYear(), a.getMonth(), a.getDate()),
                d = new Date(b.getFullYear(), b.getMonth(), b.getDate());
            return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d
        }, this.handleKeyDown = function(a, b) {
            var c = this.activeDate.getDate();
            if ("left" === a) c -= 1;
            else if ("up" === a) c -= 7;
            else if ("right" === a) c += 1;
            else if ("down" === a) c += 7;
            else if ("pageup" === a || "pagedown" === a) {
                var e = this.activeDate.getMonth() + ("pageup" === a ? -1 : 1);
                this.activeDate.setMonth(e, 1), c = Math.min(d(this.activeDate.getFullYear(), this.activeDate.getMonth()), c)
            } else "home" === a ? c = 1 : "end" === a && (c = d(this.activeDate.getFullYear(), this.activeDate.getMonth()));
            this.activeDate.setDate(c)
        }
    }]).controller("UibMonthpickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
        this.step = {
            years: 1
        }, this.element = b, this.init = function(a) {
            angular.extend(a, this), a.refreshView()
        }, this._refreshView = function() {
            for (var b, d = new Array(12), e = this.activeDate.getFullYear(), f = 0; f < 12; f++) b = new Date(this.activeDate), b.setFullYear(e, f, 1), d[f] = angular.extend(this.createDateObject(b, this.formatMonth), {
                uid: a.uniqueId + "-" + f
            });
            a.title = c(this.activeDate, this.formatMonthTitle), a.rows = this.split(d, 3)
        }, this.compare = function(a, b) {
            var c = new Date(a.getFullYear(), a.getMonth()),
                d = new Date(b.getFullYear(), b.getMonth());
            return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d
        }, this.handleKeyDown = function(a, b) {
            var c = this.activeDate.getMonth();
            if ("left" === a) c -= 1;
            else if ("up" === a) c -= 3;
            else if ("right" === a) c += 1;
            else if ("down" === a) c += 3;
            else if ("pageup" === a || "pagedown" === a) {
                var d = this.activeDate.getFullYear() + ("pageup" === a ? -1 : 1);
                this.activeDate.setFullYear(d)
            } else "home" === a ? c = 0 : "end" === a && (c = 11);
            this.activeDate.setMonth(c)
        }
    }]).controller("UibYearpickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
        function d(a) {
            return parseInt((a - 1) / f, 10) * f + 1
        }
        var e, f;
        this.element = b, this.yearpickerInit = function() {
            e = this.yearColumns, f = this.yearRows * e, this.step = {
                years: f
            }
        }, this._refreshView = function() {
            for (var b, c = new Array(f), g = 0, h = d(this.activeDate.getFullYear()); g < f; g++) b = new Date(this.activeDate), b.setFullYear(h + g, 0, 1), c[g] = angular.extend(this.createDateObject(b, this.formatYear), {
                uid: a.uniqueId + "-" + g
            });
            a.title = [c[0].label, c[f - 1].label].join(" - "), a.rows = this.split(c, e), a.columns = e
        }, this.compare = function(a, b) {
            return a.getFullYear() - b.getFullYear()
        }, this.handleKeyDown = function(a, b) {
            var c = this.activeDate.getFullYear();
            "left" === a ? c -= 1 : "up" === a ? c -= e : "right" === a ? c += 1 : "down" === a ? c += e : "pageup" === a || "pagedown" === a ? c += ("pageup" === a ? -1 : 1) * f : "home" === a ? c = d(this.activeDate.getFullYear()) : "end" === a && (c = d(this.activeDate.getFullYear()) + f - 1), this.activeDate.setFullYear(c)
        }
    }]).directive("uibDatepicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/datepicker.html"
            },
            scope: {
                datepickerOptions: "=?"
            },
            require: ["uibDatepicker", "^ngModel"],
            controller: "UibDatepickerController",
            controllerAs: "datepicker",
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                e.init(f)
            }
        }
    }).directive("uibDaypicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/day.html"
            },
            require: ["^uibDatepicker", "uibDaypicker"],
            controller: "UibDaypickerController",
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f.init(e)
            }
        }
    }).directive("uibMonthpicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/month.html"
            },
            require: ["^uibDatepicker", "uibMonthpicker"],
            controller: "UibMonthpickerController",
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f.init(e)
            }
        }
    }).directive("uibYearpicker", function() {
        return {
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepicker/year.html"
            },
            require: ["^uibDatepicker", "uibYearpicker"],
            controller: "UibYearpickerController",
            link: function(a, b, c, d) {
                var e = d[0];
                angular.extend(e, d[1]), e.yearpickerInit(), e.refreshView()
            }
        }
    }), angular.module("ui.bootstrap.position", []).factory("$uibPosition", ["$document", "$window", function(a, b) {
        var c, d, e = {
                normal: /(auto|scroll)/,
                hidden: /(auto|scroll|hidden)/
            },
            f = {
                auto: /\s?auto?\s?/i,
                primary: /^(top|bottom|left|right)$/,
                secondary: /^(top|bottom|left|right|center)$/,
                vertical: /^(top|bottom)$/
            },
            g = /(HTML|BODY)/;
        return {
            getRawNode: function(a) {
                return a.nodeName ? a : a[0] || a
            },
            parseStyle: function(a) {
                return a = parseFloat(a), isFinite(a) ? a : 0
            },
            offsetParent: function(c) {
                function d(a) {
                    return "static" === (b.getComputedStyle(a).position || "static")
                }
                c = this.getRawNode(c);
                for (var e = c.offsetParent || a[0].documentElement; e && e !== a[0].documentElement && d(e);) e = e.offsetParent;
                return e || a[0].documentElement
            },
            scrollbarWidth: function(e) {
                if (e) {
                    if (angular.isUndefined(d)) {
                        var f = a.find("body");
                        f.addClass("uib-position-body-scrollbar-measure"), d = b.innerWidth - f[0].clientWidth, d = isFinite(d) ? d : 0, f.removeClass("uib-position-body-scrollbar-measure")
                    }
                    return d
                }
                if (angular.isUndefined(c)) {
                    var g = angular.element('<div class="uib-position-scrollbar-measure"></div>');
                    a.find("body").append(g), c = g[0].offsetWidth - g[0].clientWidth, c = isFinite(c) ? c : 0, g.remove()
                }
                return c
            },
            scrollbarPadding: function(a) {
                a = this.getRawNode(a);
                var c = b.getComputedStyle(a),
                    d = this.parseStyle(c.paddingRight),
                    e = this.parseStyle(c.paddingBottom),
                    f = this.scrollParent(a, !1, !0),
                    h = this.scrollbarWidth(f, g.test(f.tagName));
                return {
                    scrollbarWidth: h,
                    widthOverflow: f.scrollWidth > f.clientWidth,
                    right: d + h,
                    originalRight: d,
                    heightOverflow: f.scrollHeight > f.clientHeight,
                    bottom: e + h,
                    originalBottom: e
                }
            },
            isScrollable: function(a, c) {
                a = this.getRawNode(a);
                var d = c ? e.hidden : e.normal,
                    f = b.getComputedStyle(a);
                return d.test(f.overflow + f.overflowY + f.overflowX)
            },
            scrollParent: function(c, d, f) {
                c = this.getRawNode(c);
                var g = d ? e.hidden : e.normal,
                    h = a[0].documentElement,
                    i = b.getComputedStyle(c);
                if (f && g.test(i.overflow + i.overflowY + i.overflowX)) return c;
                var j = "absolute" === i.position,
                    k = c.parentElement || h;
                if (k === h || "fixed" === i.position) return h;
                for (; k.parentElement && k !== h;) {
                    var l = b.getComputedStyle(k);
                    if (j && "static" !== l.position && (j = !1), !j && g.test(l.overflow + l.overflowY + l.overflowX)) break;
                    k = k.parentElement
                }
                return k
            },
            position: function(c, d) {
                c = this.getRawNode(c);
                var e = this.offset(c);
                if (d) {
                    var f = b.getComputedStyle(c);
                    e.top -= this.parseStyle(f.marginTop), e.left -= this.parseStyle(f.marginLeft)
                }
                var g = this.offsetParent(c),
                    h = {
                        top: 0,
                        left: 0
                    };
                return g !== a[0].documentElement && (h = this.offset(g), h.top += g.clientTop - g.scrollTop, h.left += g.clientLeft - g.scrollLeft), {
                    width: Math.round(angular.isNumber(e.width) ? e.width : c.offsetWidth),
                    height: Math.round(angular.isNumber(e.height) ? e.height : c.offsetHeight),
                    top: Math.round(e.top - h.top),
                    left: Math.round(e.left - h.left)
                }
            },
            offset: function(c) {
                c = this.getRawNode(c);
                var d = c.getBoundingClientRect();
                return {
                    width: Math.round(angular.isNumber(d.width) ? d.width : c.offsetWidth),
                    height: Math.round(angular.isNumber(d.height) ? d.height : c.offsetHeight),
                    top: Math.round(d.top + (b.pageYOffset || a[0].documentElement.scrollTop)),
                    left: Math.round(d.left + (b.pageXOffset || a[0].documentElement.scrollLeft))
                }
            },
            viewportOffset: function(c, d, e) {
                c = this.getRawNode(c), e = e !== !1;
                var f = c.getBoundingClientRect(),
                    g = {
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    },
                    h = d ? a[0].documentElement : this.scrollParent(c),
                    i = h.getBoundingClientRect();
                if (g.top = i.top + h.clientTop, g.left = i.left + h.clientLeft, h === a[0].documentElement && (g.top += b.pageYOffset, g.left += b.pageXOffset), g.bottom = g.top + h.clientHeight, g.right = g.left + h.clientWidth, e) {
                    var j = b.getComputedStyle(h);
                    g.top += this.parseStyle(j.paddingTop), g.bottom -= this.parseStyle(j.paddingBottom), g.left += this.parseStyle(j.paddingLeft), g.right -= this.parseStyle(j.paddingRight)
                }
                return {
                    top: Math.round(f.top - g.top),
                    bottom: Math.round(g.bottom - f.bottom),
                    left: Math.round(f.left - g.left),
                    right: Math.round(g.right - f.right)
                }
            },
            parsePlacement: function(a) {
                var b = f.auto.test(a);
                return b && (a = a.replace(f.auto, "")), a = a.split("-"), a[0] = a[0] || "top", f.primary.test(a[0]) || (a[0] = "top"), a[1] = a[1] || "center", f.secondary.test(a[1]) || (a[1] = "center"), b ? a[2] = !0 : a[2] = !1, a
            },
            positionElements: function(a, c, d, e) {
                a = this.getRawNode(a), c = this.getRawNode(c);
                var g = angular.isDefined(c.offsetWidth) ? c.offsetWidth : c.prop("offsetWidth"),
                    h = angular.isDefined(c.offsetHeight) ? c.offsetHeight : c.prop("offsetHeight");
                d = this.parsePlacement(d);
                var i = e ? this.offset(a) : this.position(a),
                    j = {
                        top: 0,
                        left: 0,
                        placement: ""
                    };
                if (d[2]) {
                    var k = this.viewportOffset(a, e),
                        l = b.getComputedStyle(c),
                        m = {
                            width: g + Math.round(Math.abs(this.parseStyle(l.marginLeft) + this.parseStyle(l.marginRight))),
                            height: h + Math.round(Math.abs(this.parseStyle(l.marginTop) + this.parseStyle(l.marginBottom)))
                        };
                    if (d[0] = "top" === d[0] && m.height > k.top && m.height <= k.bottom ? "bottom" : "bottom" === d[0] && m.height > k.bottom && m.height <= k.top ? "top" : "left" === d[0] && m.width > k.left && m.width <= k.right ? "right" : "right" === d[0] && m.width > k.right && m.width <= k.left ? "left" : d[0], d[1] = "top" === d[1] && m.height - i.height > k.bottom && m.height - i.height <= k.top ? "bottom" : "bottom" === d[1] && m.height - i.height > k.top && m.height - i.height <= k.bottom ? "top" : "left" === d[1] && m.width - i.width > k.right && m.width - i.width <= k.left ? "right" : "right" === d[1] && m.width - i.width > k.left && m.width - i.width <= k.right ? "left" : d[1],
                        "center" === d[1])
                        if (f.vertical.test(d[0])) {
                            var n = i.width / 2 - g / 2;
                            k.left + n < 0 && m.width - i.width <= k.right ? d[1] = "left" : k.right + n < 0 && m.width - i.width <= k.left && (d[1] = "right")
                        } else {
                            var o = i.height / 2 - m.height / 2;
                            k.top + o < 0 && m.height - i.height <= k.bottom ? d[1] = "top" : k.bottom + o < 0 && m.height - i.height <= k.top && (d[1] = "bottom")
                        }
                }
                switch (d[0]) {
                    case "top":
                        j.top = i.top - h;
                        break;
                    case "bottom":
                        j.top = i.top + i.height;
                        break;
                    case "left":
                        j.left = i.left - g;
                        break;
                    case "right":
                        j.left = i.left + i.width
                }
                switch (d[1]) {
                    case "top":
                        j.top = i.top;
                        break;
                    case "bottom":
                        j.top = i.top + i.height - h;
                        break;
                    case "left":
                        j.left = i.left;
                        break;
                    case "right":
                        j.left = i.left + i.width - g;
                        break;
                    case "center":
                        f.vertical.test(d[0]) ? j.left = i.left + i.width / 2 - g / 2 : j.top = i.top + i.height / 2 - h / 2
                }
                return j.top = Math.round(j.top), j.left = Math.round(j.left), j.placement = "center" === d[1] ? d[0] : d[0] + "-" + d[1], j
            },
            positionArrow: function(a, c) {
                a = this.getRawNode(a);
                var d = a.querySelector(".tooltip-inner, .popover-inner");
                if (d) {
                    var e = angular.element(d).hasClass("tooltip-inner"),
                        g = e ? a.querySelector(".tooltip-arrow") : a.querySelector(".arrow");
                    if (g) {
                        var h = {
                            top: "",
                            bottom: "",
                            left: "",
                            right: ""
                        };
                        if (c = this.parsePlacement(c), "center" === c[1]) return void angular.element(g).css(h);
                        var i = "border-" + c[0] + "-width",
                            j = b.getComputedStyle(g)[i],
                            k = "border-";
                        k += f.vertical.test(c[0]) ? c[0] + "-" + c[1] : c[1] + "-" + c[0], k += "-radius";
                        var l = b.getComputedStyle(e ? d : a)[k];
                        switch (c[0]) {
                            case "top":
                                h.bottom = e ? "0" : "-" + j;
                                break;
                            case "bottom":
                                h.top = e ? "0" : "-" + j;
                                break;
                            case "left":
                                h.right = e ? "0" : "-" + j;
                                break;
                            case "right":
                                h.left = e ? "0" : "-" + j
                        }
                        h[c[1]] = l, angular.element(g).css(h)
                    }
                }
            }
        }
    }]), angular.module("ui.bootstrap.datepickerPopup", ["ui.bootstrap.datepicker", "ui.bootstrap.position"]).value("$datepickerPopupLiteralWarning", !0).constant("uibDatepickerPopupConfig", {
        altInputFormats: [],
        appendToBody: !1,
        clearText: "Clear",
        closeOnDateSelection: !0,
        closeText: "Done",
        currentText: "Today",
        datepickerPopup: "yyyy-MM-dd",
        datepickerPopupTemplateUrl: "uib/template/datepickerPopup/popup.html",
        datepickerTemplateUrl: "uib/template/datepicker/datepicker.html",
        html5Types: {
            date: "yyyy-MM-dd",
            "datetime-local": "yyyy-MM-ddTHH:mm:ss.sss",
            month: "yyyy-MM"
        },
        onOpenFocus: !0,
        showButtonBar: !0,
        placement: "auto bottom-left"
    }).controller("UibDatepickerPopupController", ["$scope", "$element", "$attrs", "$compile", "$log", "$parse", "$window", "$document", "$rootScope", "$uibPosition", "dateFilter", "uibDateParser", "uibDatepickerPopupConfig", "$timeout", "uibDatepickerConfig", "$datepickerPopupLiteralWarning", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        function q(b) {
            var c = l.parse(b, w, a.date);
            if (isNaN(c))
                for (var d = 0; d < I.length; d++)
                    if (c = l.parse(b, I[d], a.date), !isNaN(c)) return c;
            return c
        }

        function r(a) {
            if (angular.isNumber(a) && (a = new Date(a)), !a) return null;
            if (angular.isDate(a) && !isNaN(a)) return a;
            if (angular.isString(a)) {
                var b = q(a);
                if (!isNaN(b)) return l.toTimezone(b, J)
            }
            return F.$options && F.$options.allowInvalid ? a : void 0
        }

        function s(a, b) {
            var d = a || b;
            return !c.ngRequired && !d || (angular.isNumber(d) && (d = new Date(d)), !d || (!(!angular.isDate(d) || isNaN(d)) || !!angular.isString(d) && !isNaN(q(b))))
        }

        function t(c) {
            if (a.isOpen || !a.disabled) {
                var d = H[0],
                    e = b[0].contains(c.target),
                    f = void 0 !== d.contains && d.contains(c.target);
                !a.isOpen || e || f || a.$apply(function() {
                    a.isOpen = !1
                })
            }
        }

        function u(c) {
            27 === c.which && a.isOpen ? (c.preventDefault(), c.stopPropagation(), a.$apply(function() {
                a.isOpen = !1
            }), b[0].focus()) : 40 !== c.which || a.isOpen || (c.preventDefault(), c.stopPropagation(), a.$apply(function() {
                a.isOpen = !0
            }))
        }

        function v() {
            if (a.isOpen) {
                var d = angular.element(H[0].querySelector(".uib-datepicker-popup")),
                    e = c.popupPlacement ? c.popupPlacement : m.placement,
                    f = j.positionElements(b, d, e, y);
                d.css({
                    top: f.top + "px",
                    left: f.left + "px"
                }), d.hasClass("uib-position-measure") && d.removeClass("uib-position-measure")
            }
        }
        var w, x, y, z, A, B, C, D, E, F, G, H, I, J, K = !1,
            L = [];
        this.init = function(e) {
            if (F = e, G = e.$options, x = angular.isDefined(c.closeOnDateSelection) ? a.$parent.$eval(c.closeOnDateSelection) : m.closeOnDateSelection, y = angular.isDefined(c.datepickerAppendToBody) ? a.$parent.$eval(c.datepickerAppendToBody) : m.appendToBody, z = angular.isDefined(c.onOpenFocus) ? a.$parent.$eval(c.onOpenFocus) : m.onOpenFocus, A = angular.isDefined(c.datepickerPopupTemplateUrl) ? c.datepickerPopupTemplateUrl : m.datepickerPopupTemplateUrl, B = angular.isDefined(c.datepickerTemplateUrl) ? c.datepickerTemplateUrl : m.datepickerTemplateUrl, I = angular.isDefined(c.altInputFormats) ? a.$parent.$eval(c.altInputFormats) : m.altInputFormats, a.showButtonBar = angular.isDefined(c.showButtonBar) ? a.$parent.$eval(c.showButtonBar) : m.showButtonBar, m.html5Types[c.type] ? (w = m.html5Types[c.type], K = !0) : (w = c.uibDatepickerPopup || m.datepickerPopup, c.$observe("uibDatepickerPopup", function(a, b) {
                    var c = a || m.datepickerPopup;
                    if (c !== w && (w = c, F.$modelValue = null, !w)) throw new Error("uibDatepickerPopup must have a date format specified.")
                })), !w) throw new Error("uibDatepickerPopup must have a date format specified.");
            if (K && c.uibDatepickerPopup) throw new Error("HTML5 date input types do not support custom formats.");
            C = angular.element("<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>"), G ? (J = G.timezone, a.ngModelOptions = angular.copy(G), a.ngModelOptions.timezone = null, a.ngModelOptions.updateOnDefault === !0 && (a.ngModelOptions.updateOn = a.ngModelOptions.updateOn ? a.ngModelOptions.updateOn + " default" : "default"), C.attr("ng-model-options", "ngModelOptions")) : J = null, C.attr({
                "ng-model": "date",
                "ng-change": "dateSelection(date)",
                "template-url": A
            }), D = angular.element(C.children()[0]), D.attr("template-url", B), a.datepickerOptions || (a.datepickerOptions = {}), K && "month" === c.type && (a.datepickerOptions.datepickerMode = "month", a.datepickerOptions.minMode = "month"), D.attr("datepicker-options", "datepickerOptions"), K ? F.$formatters.push(function(b) {
                return a.date = l.fromTimezone(b, J), b
            }) : (F.$$parserName = "date", F.$validators.date = s, F.$parsers.unshift(r), F.$formatters.push(function(b) {
                return F.$isEmpty(b) ? (a.date = b, b) : (angular.isNumber(b) && (b = new Date(b)), a.date = l.fromTimezone(b, J), l.filter(a.date, w))
            })), F.$viewChangeListeners.push(function() {
                a.date = q(F.$viewValue)
            }), b.on("keydown", u), H = d(C)(a), C.remove(), y ? h.find("body").append(H) : b.after(H), a.$on("$destroy", function() {
                for (a.isOpen === !0 && (i.$$phase || a.$apply(function() {
                        a.isOpen = !1
                    })), H.remove(), b.off("keydown", u), h.off("click", t), E && E.off("scroll", v), angular.element(g).off("resize", v); L.length;) L.shift()()
            })
        }, a.getText = function(b) {
            return a[b + "Text"] || m[b + "Text"]
        }, a.isDisabled = function(b) {
            "today" === b && (b = l.fromTimezone(new Date, J));
            var c = {};
            return angular.forEach(["minDate", "maxDate"], function(b) {
                a.datepickerOptions[b] ? angular.isDate(a.datepickerOptions[b]) ? c[b] = l.fromTimezone(new Date(a.datepickerOptions[b]), J) : (p && e.warn("Literal date support has been deprecated, please switch to date object usage"), c[b] = new Date(k(a.datepickerOptions[b], "medium"))) : c[b] = null
            }), a.datepickerOptions && c.minDate && a.compare(b, c.minDate) < 0 || c.maxDate && a.compare(b, c.maxDate) > 0
        }, a.compare = function(a, b) {
            return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate())
        }, a.dateSelection = function(c) {
            angular.isDefined(c) && (a.date = c);
            var d = a.date ? l.filter(a.date, w) : null;
            b.val(d), F.$setViewValue(d), x && (a.isOpen = !1, b[0].focus())
        }, a.keydown = function(c) {
            27 === c.which && (c.stopPropagation(), a.isOpen = !1, b[0].focus())
        }, a.select = function(b, c) {
            if (c.stopPropagation(), "today" === b) {
                var d = new Date;
                angular.isDate(a.date) ? (b = new Date(a.date), b.setFullYear(d.getFullYear(), d.getMonth(), d.getDate())) : b = new Date(d.setHours(0, 0, 0, 0))
            }
            a.dateSelection(b)
        }, a.close = function(c) {
            c.stopPropagation(), a.isOpen = !1, b[0].focus()
        }, a.disabled = angular.isDefined(c.disabled) || !1, c.ngDisabled && L.push(a.$parent.$watch(f(c.ngDisabled), function(b) {
            a.disabled = b
        })), a.$watch("isOpen", function(d) {
            d ? a.disabled ? a.isOpen = !1 : n(function() {
                v(), z && a.$broadcast("uib:datepicker.focus"), h.on("click", t);
                var d = c.popupPlacement ? c.popupPlacement : m.placement;
                y || j.parsePlacement(d)[2] ? (E = E || angular.element(j.scrollParent(b)), E && E.on("scroll", v)) : E = null, angular.element(g).on("resize", v)
            }, 0, !1) : (h.off("click", t), E && E.off("scroll", v), angular.element(g).off("resize", v))
        }), a.$on("uib:datepicker.mode", function() {
            n(v, 0, !1)
        })
    }]).directive("uibDatepickerPopup", function() {
        return {
            require: ["ngModel", "uibDatepickerPopup"],
            controller: "UibDatepickerPopupController",
            scope: {
                datepickerOptions: "=?",
                isOpen: "=?",
                currentText: "@",
                clearText: "@",
                closeText: "@"
            },
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f.init(e)
            }
        }
    }).directive("uibDatepickerPopupWrap", function() {
        return {
            replace: !0,
            transclude: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/datepickerPopup/popup.html"
            }
        }
    }), angular.module("ui.bootstrap.debounce", []).factory("$$debounce", ["$timeout", function(a) {
        return function(b, c) {
            var d;
            return function() {
                var e = this,
                    f = Array.prototype.slice.call(arguments);
                d && a.cancel(d), d = a(function() {
                    b.apply(e, f)
                }, c)
            }
        }
    }]), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.position"]).constant("uibDropdownConfig", {
        appendToOpenClass: "uib-dropdown-open",
        openClass: "open"
    }).service("uibDropdownService", ["$document", "$rootScope", function(a, b) {
        var c = null;
        this.open = function(b, f) {
            c || (a.on("click", d), f.on("keydown", e)), c && c !== b && (c.isOpen = !1), c = b
        }, this.close = function(b, f) {
            c === b && (c = null, a.off("click", d), f.off("keydown", e))
        };
        var d = function(a) {
                if (c && !(a && "disabled" === c.getAutoClose() || a && 3 === a.which)) {
                    var d = c.getToggleElement();
                    if (!(a && d && d[0].contains(a.target))) {
                        var e = c.getDropdownElement();
                        a && "outsideClick" === c.getAutoClose() && e && e[0].contains(a.target) || (c.isOpen = !1, b.$$phase || c.$apply())
                    }
                }
            },
            e = function(a) {
                27 === a.which ? (a.stopPropagation(), c.focusToggleElement(), d()) : c.isKeynavEnabled() && [38, 40].indexOf(a.which) !== -1 && c.isOpen && (a.preventDefault(), a.stopPropagation(), c.focusDropdownEntry(a.which))
            }
    }]).controller("UibDropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", function(a, b, c, d, e, f, g, h, i, j, k) {
        var l, m, n = this,
            o = a.$new(),
            p = e.appendToOpenClass,
            q = e.openClass,
            r = angular.noop,
            s = c.onToggle ? d(c.onToggle) : angular.noop,
            t = !1,
            u = null,
            v = !1,
            w = i.find("body");
        b.addClass("dropdown"), this.init = function() {
            if (c.isOpen && (m = d(c.isOpen), r = m.assign, a.$watch(m, function(a) {
                    o.isOpen = !!a
                })), angular.isDefined(c.dropdownAppendTo)) {
                var e = d(c.dropdownAppendTo)(o);
                e && (u = angular.element(e))
            }
            t = angular.isDefined(c.dropdownAppendToBody), v = angular.isDefined(c.keyboardNav), t && !u && (u = w), u && n.dropdownMenu && (u.append(n.dropdownMenu), b.on("$destroy", function() {
                n.dropdownMenu.remove()
            }))
        }, this.toggle = function(a) {
            return o.isOpen = arguments.length ? !!a : !o.isOpen, angular.isFunction(r) && r(o, o.isOpen), o.isOpen
        }, this.isOpen = function() {
            return o.isOpen
        }, o.getToggleElement = function() {
            return n.toggleElement
        }, o.getAutoClose = function() {
            return c.autoClose || "always"
        }, o.getElement = function() {
            return b
        }, o.isKeynavEnabled = function() {
            return v
        }, o.focusDropdownEntry = function(a) {
            var c = n.dropdownMenu ? angular.element(n.dropdownMenu).find("a") : b.find("ul").eq(0).find("a");
            switch (a) {
                case 40:
                    angular.isNumber(n.selectedOption) ? n.selectedOption = n.selectedOption === c.length - 1 ? n.selectedOption : n.selectedOption + 1 : n.selectedOption = 0;
                    break;
                case 38:
                    angular.isNumber(n.selectedOption) ? n.selectedOption = 0 === n.selectedOption ? 0 : n.selectedOption - 1 : n.selectedOption = c.length - 1
            }
            c[n.selectedOption].focus()
        }, o.getDropdownElement = function() {
            return n.dropdownMenu
        }, o.focusToggleElement = function() {
            n.toggleElement && n.toggleElement[0].focus()
        }, o.$watch("isOpen", function(c, d) {
            if (u && n.dropdownMenu) {
                var e, i, m, v = h.positionElements(b, n.dropdownMenu, "bottom-left", !0);
                if (e = {
                        top: v.top + "px",
                        display: c ? "block" : "none"
                    }, i = n.dropdownMenu.hasClass("dropdown-menu-right"), i ? (e.left = "auto", m = h.scrollbarWidth(!0), e.right = window.innerWidth - m - (v.left + b.prop("offsetWidth")) + "px") : (e.left = v.left + "px", e.right = "auto"), !t) {
                    var w = h.offset(u);
                    e.top = v.top - w.top + "px", i ? e.right = window.innerWidth - (v.left - w.left + b.prop("offsetWidth")) + "px" : e.left = v.left - w.left + "px"
                }
                n.dropdownMenu.css(e)
            }
            var x = u ? u : b,
                y = x.hasClass(u ? p : q);
            if (y === !c && g[c ? "addClass" : "removeClass"](x, u ? p : q).then(function() {
                    angular.isDefined(c) && c !== d && s(a, {
                        open: !!c
                    })
                }), c) n.dropdownMenuTemplateUrl && k(n.dropdownMenuTemplateUrl).then(function(a) {
                l = o.$new(), j(a.trim())(l, function(a) {
                    var b = a;
                    n.dropdownMenu.replaceWith(b), n.dropdownMenu = b
                })
            }), o.focusToggleElement(), f.open(o, b);
            else {
                if (n.dropdownMenuTemplateUrl) {
                    l && l.$destroy();
                    var z = angular.element('<ul class="dropdown-menu"></ul>');
                    n.dropdownMenu.replaceWith(z), n.dropdownMenu = z
                }
                f.close(o, b), n.selectedOption = null
            }
            angular.isFunction(r) && r(a, c)
        })
    }]).directive("uibDropdown", function() {
        return {
            controller: "UibDropdownController",
            link: function(a, b, c, d) {
                d.init()
            }
        }
    }).directive("uibDropdownMenu", function() {
        return {
            restrict: "A",
            require: "?^uibDropdown",
            link: function(a, b, c, d) {
                if (d && !angular.isDefined(c.dropdownNested)) {
                    b.addClass("dropdown-menu");
                    var e = c.templateUrl;
                    e && (d.dropdownMenuTemplateUrl = e), d.dropdownMenu || (d.dropdownMenu = b)
                }
            }
        }
    }).directive("uibDropdownToggle", function() {
        return {
            require: "?^uibDropdown",
            link: function(a, b, c, d) {
                if (d) {
                    b.addClass("dropdown-toggle"), d.toggleElement = b;
                    var e = function(e) {
                        e.preventDefault(), b.hasClass("disabled") || c.disabled || a.$apply(function() {
                            d.toggle()
                        })
                    };
                    b.bind("click", e), b.attr({
                        "aria-haspopup": !0,
                        "aria-expanded": !1
                    }), a.$watch(d.isOpen, function(a) {
                        b.attr("aria-expanded", !!a)
                    }), a.$on("$destroy", function() {
                        b.unbind("click", e)
                    })
                }
            }
        }
    }), angular.module("ui.bootstrap.stackedMap", []).factory("$$stackedMap", function() {
        return {
            createNew: function() {
                var a = [];
                return {
                    add: function(b, c) {
                        a.push({
                            key: b,
                            value: c
                        })
                    },
                    get: function(b) {
                        for (var c = 0; c < a.length; c++)
                            if (b === a[c].key) return a[c]
                    },
                    keys: function() {
                        for (var b = [], c = 0; c < a.length; c++) b.push(a[c].key);
                        return b
                    },
                    top: function() {
                        return a[a.length - 1]
                    },
                    remove: function(b) {
                        for (var c = -1, d = 0; d < a.length; d++)
                            if (b === a[d].key) {
                                c = d;
                                break
                            } return a.splice(c, 1)[0]
                    },
                    removeTop: function() {
                        return a.splice(a.length - 1, 1)[0]
                    },
                    length: function() {
                        return a.length
                    }
                }
            }
        }
    }), angular.module("ui.bootstrap.modal", ["ui.bootstrap.stackedMap", "ui.bootstrap.position"]).factory("$$multiMap", function() {
        return {
            createNew: function() {
                var a = {};
                return {
                    entries: function() {
                        return Object.keys(a).map(function(b) {
                            return {
                                key: b,
                                value: a[b]
                            }
                        })
                    },
                    get: function(b) {
                        return a[b]
                    },
                    hasKey: function(b) {
                        return !!a[b]
                    },
                    keys: function() {
                        return Object.keys(a)
                    },
                    put: function(b, c) {
                        a[b] || (a[b] = []), a[b].push(c)
                    },
                    remove: function(b, c) {
                        var d = a[b];
                        if (d) {
                            var e = d.indexOf(c);
                            e !== -1 && d.splice(e, 1), d.length || delete a[b]
                        }
                    }
                }
            }
        }
    }).provider("$uibResolve", function() {
        var a = this;
        this.resolver = null, this.setResolver = function(a) {
            this.resolver = a
        }, this.$get = ["$injector", "$q", function(b, c) {
            var d = a.resolver ? b.get(a.resolver) : null;
            return {
                resolve: function(a, e, f, g) {
                    if (d) return d.resolve(a, e, f, g);
                    var h = [];
                    return angular.forEach(a, function(a) {
                        angular.isFunction(a) || angular.isArray(a) ? h.push(c.resolve(b.invoke(a))) : angular.isString(a) ? h.push(c.resolve(b.get(a))) : h.push(c.resolve(a))
                    }), c.all(h).then(function(b) {
                        var c = {},
                            d = 0;
                        return angular.forEach(a, function(a, e) {
                            c[e] = b[d++]
                        }), c
                    })
                }
            }
        }]
    }).directive("uibModalBackdrop", ["$animate", "$injector", "$uibModalStack", function(a, b, c) {
        function d(b, d, e) {
            e.modalInClass && (a.addClass(d, e.modalInClass), b.$on(c.NOW_CLOSING_EVENT, function(c, f) {
                var g = f();
                b.modalOptions.animation ? a.removeClass(d, e.modalInClass).then(g) : g()
            }))
        }
        return {
            replace: !0,
            templateUrl: "uib/template/modal/backdrop.html",
            compile: function(a, b) {
                return a.addClass(b.backdropClass), d
            }
        }
    }]).directive("uibModalWindow", ["$uibModalStack", "$q", "$animateCss", "$document", function(a, b, c, d) {
        return {
            scope: {
                index: "@"
            },
            replace: !0,
            transclude: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/modal/window.html"
            },
            link: function(e, f, g) {
                f.addClass(g.windowClass || ""), f.addClass(g.windowTopClass || ""), e.size = g.size, e.close = function(b) {
                    var c = a.getTop();
                    c && c.value.backdrop && "static" !== c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(), b.stopPropagation(), a.dismiss(c.key, "backdrop click"))
                }, f.on("click", e.close), e.$isRendered = !0;
                var h = b.defer();
                g.$observe("modalRender", function(a) {
                    "true" === a && h.resolve()
                }), h.promise.then(function() {
                    var h = null;
                    g.modalInClass && (h = c(f, {
                        addClass: g.modalInClass
                    }).start(), e.$on(a.NOW_CLOSING_EVENT, function(a, b) {
                        var d = b();
                        c(f, {
                            removeClass: g.modalInClass
                        }).start().then(d)
                    })), b.when(h).then(function() {
                        var b = a.getTop();
                        if (b && a.modalRendered(b.key), !d[0].activeElement || !f[0].contains(d[0].activeElement)) {
                            var c = f[0].querySelector("[autofocus]");
                            c ? c.focus() : f[0].focus()
                        }
                    })
                })
            }
        }
    }]).directive("uibModalAnimationClass", function() {
        return {
            compile: function(a, b) {
                b.modalAnimation && a.addClass(b.uibModalAnimationClass)
            }
        }
    }).directive("uibModalTransclude", function() {
        return {
            link: function(a, b, c, d, e) {
                e(a.$parent, function(a) {
                    b.empty(), b.append(a)
                })
            }
        }
    }).factory("$uibModalStack", ["$animate", "$animateCss", "$document", "$compile", "$rootScope", "$q", "$$multiMap", "$$stackedMap", "$uibPosition", function(a, b, c, d, e, f, g, h, i) {
        function j(a) {
            return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length)
        }

        function k() {
            for (var a = -1, b = v.keys(), c = 0; c < b.length; c++) v.get(b[c]).value.backdrop && (a = c);
            return a > -1 && a < y && (a = y), a
        }

        function l(a, b) {
            var c = v.get(a).value,
                d = c.appendTo;
            v.remove(a), z = v.top(), z && (y = parseInt(z.value.modalDomEl.attr("index"), 10)), o(c.modalDomEl, c.modalScope, function() {
                var b = c.openedClass || u;
                w.remove(b, a);
                var e = w.hasKey(b);
                d.toggleClass(b, e), !e && t && t.heightOverflow && t.scrollbarWidth && (t.originalRight ? d.css({
                    paddingRight: t.originalRight + "px"
                }) : d.css({
                    paddingRight: ""
                }), t = null), m(!0)
            }, c.closedDeferred), n(), b && b.focus ? b.focus() : d.focus && d.focus()
        }

        function m(a) {
            var b;
            v.length() > 0 && (b = v.top().value, b.modalDomEl.toggleClass(b.windowTopClass || "", a))
        }

        function n() {
            if (r && k() === -1) {
                var a = s;
                o(r, s, function() {
                    a = null
                }), r = void 0, s = void 0
            }
        }

        function o(b, c, d, e) {
            function g() {
                g.done || (g.done = !0, a.leave(b).then(function() {
                    b.remove(), e && e.resolve()
                }), c.$destroy(), d && d())
            }
            var h, i = null,
                j = function() {
                    return h || (h = f.defer(), i = h.promise),
                        function() {
                            h.resolve()
                        }
                };
            return c.$broadcast(x.NOW_CLOSING_EVENT, j), f.when(i).then(g)
        }

        function p(a) {
            if (a.isDefaultPrevented()) return a;
            var b = v.top();
            if (b) switch (a.which) {
                case 27:
                    b.value.keyboard && (a.preventDefault(), e.$apply(function() {
                        x.dismiss(b.key, "escape key press")
                    }));
                    break;
                case 9:
                    var c = x.loadFocusElementList(b),
                        d = !1;
                    a.shiftKey ? (x.isFocusInFirstItem(a, c) || x.isModalFocused(a, b)) && (d = x.focusLastFocusableElement(c)) : x.isFocusInLastItem(a, c) && (d = x.focusFirstFocusableElement(c)), d && (a.preventDefault(), a.stopPropagation())
            }
        }

        function q(a, b, c) {
            return !a.value.modalScope.$broadcast("modal.closing", b, c).defaultPrevented
        }
        var r, s, t, u = "modal-open",
            v = h.createNew(),
            w = g.createNew(),
            x = {
                NOW_CLOSING_EVENT: "modal.stack.now-closing"
            },
            y = 0,
            z = null,
            A = "a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable=true]";
        return e.$watch(k, function(a) {
            s && (s.index = a)
        }), c.on("keydown", p), e.$on("$destroy", function() {
            c.off("keydown", p)
        }), x.open = function(b, f) {
            var g = c[0].activeElement,
                h = f.openedClass || u;
            m(!1), z = v.top(), v.add(b, {
                deferred: f.deferred,
                renderDeferred: f.renderDeferred,
                closedDeferred: f.closedDeferred,
                modalScope: f.scope,
                backdrop: f.backdrop,
                keyboard: f.keyboard,
                openedClass: f.openedClass,
                windowTopClass: f.windowTopClass,
                animation: f.animation,
                appendTo: f.appendTo
            }), w.put(h, b);
            var j = f.appendTo,
                l = k();
            if (!j.length) throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");
            l >= 0 && !r && (s = e.$new(!0), s.modalOptions = f, s.index = l, r = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'), r.attr("backdrop-class", f.backdropClass), f.animation && r.attr("modal-animation", "true"), d(r)(s), a.enter(r, j), t = i.scrollbarPadding(j), t.heightOverflow && t.scrollbarWidth && j.css({
                paddingRight: t.right + "px"
            })), y = z ? parseInt(z.value.modalDomEl.attr("index"), 10) + 1 : 0;
            var n = angular.element('<div uib-modal-window="modal-window"></div>');
            n.attr({
                "template-url": f.windowTemplateUrl,
                "window-class": f.windowClass,
                "window-top-class": f.windowTopClass,
                size: f.size,
                index: y,
                animate: "animate"
            }).html(f.content), f.animation && n.attr("modal-animation", "true"), j.addClass(h), a.enter(d(n)(f.scope), j), v.top().value.modalDomEl = n, v.top().value.modalOpener = g
        }, x.close = function(a, b) {
            var c = v.get(a);
            return c && q(c, b, !0) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.resolve(b), l(a, c.value.modalOpener), !0) : !c
        }, x.dismiss = function(a, b) {
            var c = v.get(a);
            return c && q(c, b, !1) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.reject(b), l(a, c.value.modalOpener), !0) : !c
        }, x.dismissAll = function(a) {
            for (var b = this.getTop(); b && this.dismiss(b.key, a);) b = this.getTop()
        }, x.getTop = function() {
            return v.top()
        }, x.modalRendered = function(a) {
            var b = v.get(a);
            b && b.value.renderDeferred.resolve()
        }, x.focusFirstFocusableElement = function(a) {
            return a.length > 0 && (a[0].focus(), !0)
        }, x.focusLastFocusableElement = function(a) {
            return a.length > 0 && (a[a.length - 1].focus(), !0)
        }, x.isModalFocused = function(a, b) {
            if (a && b) {
                var c = b.value.modalDomEl;
                if (c && c.length) return (a.target || a.srcElement) === c[0]
            }
            return !1
        }, x.isFocusInFirstItem = function(a, b) {
            return b.length > 0 && (a.target || a.srcElement) === b[0]
        }, x.isFocusInLastItem = function(a, b) {
            return b.length > 0 && (a.target || a.srcElement) === b[b.length - 1]
        }, x.loadFocusElementList = function(a) {
            if (a) {
                var b = a.value.modalDomEl;
                if (b && b.length) {
                    var c = b[0].querySelectorAll(A);
                    return c ? Array.prototype.filter.call(c, function(a) {
                        return j(a)
                    }) : c
                }
            }
        }, x
    }]).provider("$uibModal", function() {
        var a = {
            options: {
                animation: !0,
                backdrop: !0,
                keyboard: !0
            },
            $get: ["$rootScope", "$q", "$document", "$templateRequest", "$controller", "$uibResolve", "$uibModalStack", function(b, c, d, e, f, g, h) {
                function i(a) {
                    return a.template ? c.when(a.template) : e(angular.isFunction(a.templateUrl) ? a.templateUrl() : a.templateUrl)
                }
                var j = {},
                    k = null;
                return j.getPromiseChain = function() {
                    return k
                }, j.open = function(e) {
                    function j() {
                        return r
                    }
                    var l = c.defer(),
                        m = c.defer(),
                        n = c.defer(),
                        o = c.defer(),
                        p = {
                            result: l.promise,
                            opened: m.promise,
                            closed: n.promise,
                            rendered: o.promise,
                            close: function(a) {
                                return h.close(p, a)
                            },
                            dismiss: function(a) {
                                return h.dismiss(p, a)
                            }
                        };
                    if (e = angular.extend({}, a.options, e), e.resolve = e.resolve || {}, e.appendTo = e.appendTo || d.find("body").eq(0), !e.template && !e.templateUrl) throw new Error("One of template or templateUrl options is required.");
                    var q, r = c.all([i(e), g.resolve(e.resolve, {}, null, null)]);
                    return q = k = c.all([k]).then(j, j).then(function(a) {
                        var c = e.scope || b,
                            d = c.$new();
                        d.$close = p.close, d.$dismiss = p.dismiss, d.$on("$destroy", function() {
                            d.$$uibDestructionScheduled || d.$dismiss("$uibUnscheduledDestruction")
                        });
                        var g, i, j = {};
                        e.controller && (j.$scope = d, j.$scope.$resolve = {}, j.$uibModalInstance = p, angular.forEach(a[1], function(a, b) {
                            j[b] = a, j.$scope.$resolve[b] = a
                        }), i = f(e.controller, j, !0, e.controllerAs), e.controllerAs && e.bindToController && (g = i.instance, g.$close = d.$close, g.$dismiss = d.$dismiss, angular.extend(g, {
                            $resolve: j.$scope.$resolve
                        }, c)), g = i(), angular.isFunction(g.$onInit) && g.$onInit()), h.open(p, {
                            scope: d,
                            deferred: l,
                            renderDeferred: o,
                            closedDeferred: n,
                            content: a[0],
                            animation: e.animation,
                            backdrop: e.backdrop,
                            keyboard: e.keyboard,
                            backdropClass: e.backdropClass,
                            windowTopClass: e.windowTopClass,
                            windowClass: e.windowClass,
                            windowTemplateUrl: e.windowTemplateUrl,
                            size: e.size,
                            openedClass: e.openedClass,
                            appendTo: e.appendTo
                        }), m.resolve(!0)
                    }, function(a) {
                        m.reject(a), l.reject(a)
                    })["finally"](function() {
                        k === q && (k = null)
                    }), p
                }, j
            }]
        };
        return a
    }), angular.module("ui.bootstrap.paging", []).factory("uibPaging", ["$parse", function(a) {
        return {
            create: function(b, c, d) {
                b.setNumPages = d.numPages ? a(d.numPages).assign : angular.noop, b.ngModelCtrl = {
                    $setViewValue: angular.noop
                }, b._watchers = [], b.init = function(a, e) {
                    b.ngModelCtrl = a, b.config = e, a.$render = function() {
                        b.render()
                    }, d.itemsPerPage ? b._watchers.push(c.$parent.$watch(d.itemsPerPage, function(a) {
                        b.itemsPerPage = parseInt(a, 10), c.totalPages = b.calculateTotalPages(), b.updatePage()
                    })) : b.itemsPerPage = e.itemsPerPage, c.$watch("totalItems", function(a, d) {
                        (angular.isDefined(a) || a !== d) && (c.totalPages = b.calculateTotalPages(), b.updatePage())
                    })
                }, b.calculateTotalPages = function() {
                    var a = b.itemsPerPage < 1 ? 1 : Math.ceil(c.totalItems / b.itemsPerPage);
                    return Math.max(a || 0, 1)
                }, b.render = function() {
                    c.page = parseInt(b.ngModelCtrl.$viewValue, 10) || 1
                }, c.selectPage = function(a, d) {
                    d && d.preventDefault();
                    var e = !c.ngDisabled || !d;
                    e && c.page !== a && a > 0 && a <= c.totalPages && (d && d.target && d.target.blur(), b.ngModelCtrl.$setViewValue(a), b.ngModelCtrl.$render())
                }, c.getText = function(a) {
                    return c[a + "Text"] || b.config[a + "Text"]
                }, c.noPrevious = function() {
                    return 1 === c.page
                }, c.noNext = function() {
                    return c.page === c.totalPages
                }, b.updatePage = function() {
                    b.setNumPages(c.$parent, c.totalPages), c.page > c.totalPages ? c.selectPage(c.totalPages) : b.ngModelCtrl.$render()
                }, c.$on("$destroy", function() {
                    for (; b._watchers.length;) b._watchers.shift()()
                })
            }
        }
    }]), angular.module("ui.bootstrap.pager", ["ui.bootstrap.paging"]).controller("UibPagerController", ["$scope", "$attrs", "uibPaging", "uibPagerConfig", function(a, b, c, d) {
        a.align = angular.isDefined(b.align) ? a.$parent.$eval(b.align) : d.align, c.create(this, a, b)
    }]).constant("uibPagerConfig", {
        itemsPerPage: 10,
        previousText: "« Previous",
        nextText: "Next »",
        align: !0
    }).directive("uibPager", ["uibPagerConfig", function(a) {
        return {
            scope: {
                totalItems: "=",
                previousText: "@",
                nextText: "@",
                ngDisabled: "="
            },
            require: ["uibPager", "?ngModel"],
            controller: "UibPagerController",
            controllerAs: "pager",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/pager/pager.html"
            },
            replace: !0,
            link: function(b, c, d, e) {
                var f = e[0],
                    g = e[1];
                g && f.init(g, a)
            }
        }
    }]), angular.module("ui.bootstrap.pagination", ["ui.bootstrap.paging"]).controller("UibPaginationController", ["$scope", "$attrs", "$parse", "uibPaging", "uibPaginationConfig", function(a, b, c, d, e) {
        function f(a, b, c) {
            return {
                number: a,
                text: b,
                active: c
            }
        }

        function g(a, b) {
            var c = [],
                d = 1,
                e = b,
                g = angular.isDefined(i) && i < b;
            g && (j ? (d = Math.max(a - Math.floor(i / 2), 1), e = d + i - 1, e > b && (e = b, d = e - i + 1)) : (d = (Math.ceil(a / i) - 1) * i + 1, e = Math.min(d + i - 1, b)));
            for (var h = d; h <= e; h++) {
                var n = f(h, m(h), h === a);
                c.push(n)
            }
            if (g && i > 0 && (!j || k || l)) {
                if (d > 1) {
                    if (!l || d > 3) {
                        var o = f(d - 1, "...", !1);
                        c.unshift(o)
                    }
                    if (l) {
                        if (3 === d) {
                            var p = f(2, "2", !1);
                            c.unshift(p)
                        }
                        var q = f(1, "1", !1);
                        c.unshift(q)
                    }
                }
                if (e < b) {
                    if (!l || e < b - 2) {
                        var r = f(e + 1, "...", !1);
                        c.push(r)
                    }
                    if (l) {
                        if (e === b - 2) {
                            var s = f(b - 1, b - 1, !1);
                            c.push(s)
                        }
                        var t = f(b, b, !1);
                        c.push(t)
                    }
                }
            }
            return c
        }
        var h = this,
            i = angular.isDefined(b.maxSize) ? a.$parent.$eval(b.maxSize) : e.maxSize,
            j = angular.isDefined(b.rotate) ? a.$parent.$eval(b.rotate) : e.rotate,
            k = angular.isDefined(b.forceEllipses) ? a.$parent.$eval(b.forceEllipses) : e.forceEllipses,
            l = angular.isDefined(b.boundaryLinkNumbers) ? a.$parent.$eval(b.boundaryLinkNumbers) : e.boundaryLinkNumbers,
            m = angular.isDefined(b.pageLabel) ? function(c) {
                return a.$parent.$eval(b.pageLabel, {
                    $page: c
                })
            } : angular.identity;
        a.boundaryLinks = angular.isDefined(b.boundaryLinks) ? a.$parent.$eval(b.boundaryLinks) : e.boundaryLinks, a.directionLinks = angular.isDefined(b.directionLinks) ? a.$parent.$eval(b.directionLinks) : e.directionLinks, d.create(this, a, b), b.maxSize && h._watchers.push(a.$parent.$watch(c(b.maxSize), function(a) {
            i = parseInt(a, 10), h.render()
        }));
        var n = this.render;
        this.render = function() {
            n(), a.page > 0 && a.page <= a.totalPages && (a.pages = g(a.page, a.totalPages))
        }
    }]).constant("uibPaginationConfig", {
        itemsPerPage: 10,
        boundaryLinks: !1,
        boundaryLinkNumbers: !1,
        directionLinks: !0,
        firstText: "First",
        previousText: "Previous",
        nextText: "Next",
        lastText: "Last",
        rotate: !0,
        forceEllipses: !1
    }).directive("uibPagination", ["$parse", "uibPaginationConfig", function(a, b) {
        return {
            scope: {
                totalItems: "=",
                firstText: "@",
                previousText: "@",
                nextText: "@",
                lastText: "@",
                ngDisabled: "="
            },
            require: ["uibPagination", "?ngModel"],
            controller: "UibPaginationController",
            controllerAs: "pagination",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/pagination/pagination.html"
            },
            replace: !0,
            link: function(a, c, d, e) {
                var f = e[0],
                    g = e[1];
                g && f.init(g, b)
            }
        }
    }]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.stackedMap"]).provider("$uibTooltip", function() {
        function a(a) {
            var b = /[A-Z]/g,
                c = "-";
            return a.replace(b, function(a, b) {
                return (b ? c : "") + a.toLowerCase()
            })
        }
        var b = {
                placement: "top",
                placementClassPrefix: "",
                animation: !0,
                popupDelay: 0,
                popupCloseDelay: 0,
                useContentExp: !1
            },
            c = {
                mouseenter: "mouseleave",
                click: "click",
                outsideClick: "outsideClick",
                focus: "blur",
                none: ""
            },
            d = {};
        this.options = function(a) {
            angular.extend(d, a)
        }, this.setTriggers = function(a) {
            angular.extend(c, a)
        }, this.$get = ["$window", "$compile", "$timeout", "$document", "$uibPosition", "$interpolate", "$rootScope", "$parse", "$$stackedMap", function(e, f, g, h, i, j, k, l, m) {
            function n(a) {
                if (27 === a.which) {
                    var b = o.top();
                    b && (b.value.close(), o.removeTop(), b = null)
                }
            }
            var o = m.createNew();
            return h.on("keypress", n), k.$on("$destroy", function() {
                    h.off("keypress", n)
                }),
                function(e, k, m, n) {
                    function p(a) {
                        var b = (a || n.trigger || m).split(" "),
                            d = b.map(function(a) {
                                return c[a] || a
                            });
                        return {
                            show: b,
                            hide: d
                        }
                    }
                    n = angular.extend({}, b, d, n);
                    var q = a(e),
                        r = j.startSymbol(),
                        s = j.endSymbol(),
                        t = "<div " + q + '-popup uib-title="' + r + "title" + s + '" ' + (n.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + r + "content" + s + '" ') + 'placement="' + r + "placement" + s + '" popup-class="' + r + "popupClass" + s + '" animation="animation" is-open="isOpen" origin-scope="origScope" class="uib-position-measure"></div>';
                    return {
                        compile: function(a, b) {
                            var c = f(t);
                            return function(a, b, d, f) {
                                function j() {
                                    N.isOpen ? q() : m()
                                }

                                function m() {
                                    M && !a.$eval(d[k + "Enable"]) || (u(), x(), N.popupDelay ? G || (G = g(r, N.popupDelay, !1)) : r())
                                }

                                function q() {
                                    s(), N.popupCloseDelay ? H || (H = g(t, N.popupCloseDelay, !1)) : t()
                                }

                                function r() {
                                    return s(), u(), N.content ? (v(), void N.$evalAsync(function() {
                                        N.isOpen = !0, y(!0), S()
                                    })) : angular.noop
                                }

                                function s() {
                                    G && (g.cancel(G), G = null), I && (g.cancel(I), I = null)
                                }

                                function t() {
                                    N && N.$evalAsync(function() {
                                        N && (N.isOpen = !1, y(!1), N.animation ? F || (F = g(w, 150, !1)) : w())
                                    })
                                }

                                function u() {
                                    H && (g.cancel(H), H = null), F && (g.cancel(F), F = null)
                                }

                                function v() {
                                    D || (E = N.$new(), D = c(E, function(a) {
                                        K ? h.find("body").append(a) : b.after(a)
                                    }), z())
                                }

                                function w() {
                                    s(), u(), A(), D && (D.remove(), D = null), E && (E.$destroy(), E = null)
                                }

                                function x() {
                                    N.title = d[k + "Title"], Q ? N.content = Q(a) : N.content = d[e], N.popupClass = d[k + "Class"], N.placement = angular.isDefined(d[k + "Placement"]) ? d[k + "Placement"] : n.placement;
                                    var b = i.parsePlacement(N.placement);
                                    J = b[1] ? b[0] + "-" + b[1] : b[0];
                                    var c = parseInt(d[k + "PopupDelay"], 10),
                                        f = parseInt(d[k + "PopupCloseDelay"], 10);
                                    N.popupDelay = isNaN(c) ? n.popupDelay : c, N.popupCloseDelay = isNaN(f) ? n.popupCloseDelay : f
                                }

                                function y(b) {
                                    P && angular.isFunction(P.assign) && P.assign(a, b)
                                }

                                function z() {
                                    R.length = 0, Q ? (R.push(a.$watch(Q, function(a) {
                                        N.content = a, !a && N.isOpen && t()
                                    })), R.push(E.$watch(function() {
                                        O || (O = !0, E.$$postDigest(function() {
                                            O = !1, N && N.isOpen && S()
                                        }))
                                    }))) : R.push(d.$observe(e, function(a) {
                                        N.content = a, !a && N.isOpen ? t() : S()
                                    })), R.push(d.$observe(k + "Title", function(a) {
                                        N.title = a, N.isOpen && S()
                                    })), R.push(d.$observe(k + "Placement", function(a) {
                                        N.placement = a ? a : n.placement, N.isOpen && S()
                                    }))
                                }

                                function A() {
                                    R.length && (angular.forEach(R, function(a) {
                                        a()
                                    }), R.length = 0)
                                }

                                function B(a) {
                                    N && N.isOpen && D && (b[0].contains(a.target) || D[0].contains(a.target) || q())
                                }

                                function C() {
                                    var a = d[k + "Trigger"];
                                    T(), L = p(a), "none" !== L.show && L.show.forEach(function(a, c) {
                                        "outsideClick" === a ? (b.on("click", j), h.on("click", B)) : a === L.hide[c] ? b.on(a, j) : a && (b.on(a, m), b.on(L.hide[c], q)), b.on("keypress", function(a) {
                                            27 === a.which && q()
                                        })
                                    })
                                }
                                var D, E, F, G, H, I, J, K = !!angular.isDefined(n.appendToBody) && n.appendToBody,
                                    L = p(void 0),
                                    M = angular.isDefined(d[k + "Enable"]),
                                    N = a.$new(!0),
                                    O = !1,
                                    P = !!angular.isDefined(d[k + "IsOpen"]) && l(d[k + "IsOpen"]),
                                    Q = !!n.useContentExp && l(d[e]),
                                    R = [],
                                    S = function() {
                                        D && D.html() && (I || (I = g(function() {
                                            var a = i.positionElements(b, D, N.placement, K);
                                            D.css({
                                                top: a.top + "px",
                                                left: a.left + "px"
                                            }), D.hasClass(a.placement.split("-")[0]) || (D.removeClass(J.split("-")[0]), D.addClass(a.placement.split("-")[0])), D.hasClass(n.placementClassPrefix + a.placement) || (D.removeClass(n.placementClassPrefix + J), D.addClass(n.placementClassPrefix + a.placement)), D.hasClass("uib-position-measure") ? (i.positionArrow(D, a.placement), D.removeClass("uib-position-measure")) : J !== a.placement && i.positionArrow(D, a.placement), J = a.placement, I = null
                                        }, 0, !1)))
                                    };
                                N.origScope = a, N.isOpen = !1, o.add(N, {
                                    close: t
                                }), N.contentExp = function() {
                                    return N.content
                                }, d.$observe("disabled", function(a) {
                                    a && s(), a && N.isOpen && t()
                                }), P && a.$watch(P, function(a) {
                                    N && !a === N.isOpen && j()
                                });
                                var T = function() {
                                    L.show.forEach(function(a) {
                                        "outsideClick" === a ? b.off("click", j) : (b.off(a, m), b.off(a, j))
                                    }), L.hide.forEach(function(a) {
                                        "outsideClick" === a ? h.off("click", B) : b.off(a, q);
                                    })
                                };
                                C();
                                var U = a.$eval(d[k + "Animation"]);
                                N.animation = angular.isDefined(U) ? !!U : n.animation;
                                var V, W = k + "AppendToBody";
                                V = W in d && void 0 === d[W] || a.$eval(d[W]), K = angular.isDefined(V) ? V : K, a.$on("$destroy", function() {
                                    T(), w(), o.remove(N), N = null
                                })
                            }
                        }
                    }
                }
        }]
    }).directive("uibTooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function(a, b, c, d) {
        return {
            link: function(e, f, g) {
                var h, i, j, k = e.$eval(g.tooltipTemplateTranscludeScope),
                    l = 0,
                    m = function() {
                        i && (i.remove(), i = null), h && (h.$destroy(), h = null), j && (a.leave(j).then(function() {
                            i = null
                        }), i = j, j = null)
                    };
                e.$watch(b.parseAsResourceUrl(g.uibTooltipTemplateTransclude), function(b) {
                    var g = ++l;
                    b ? (d(b, !0).then(function(d) {
                        if (g === l) {
                            var e = k.$new(),
                                i = d,
                                n = c(i)(e, function(b) {
                                    m(), a.enter(b, f)
                                });
                            h = e, j = n, h.$emit("$includeContentLoaded", b)
                        }
                    }, function() {
                        g === l && (m(), e.$emit("$includeContentError", b))
                    }), e.$emit("$includeContentRequested", b)) : m()
                }), e.$on("$destroy", m)
            }
        }
    }]).directive("uibTooltipClasses", ["$uibPosition", function(a) {
        return {
            restrict: "A",
            link: function(b, c, d) {
                if (b.placement) {
                    var e = a.parsePlacement(b.placement);
                    c.addClass(e[0])
                }
                b.popupClass && c.addClass(b.popupClass), b.animation() && c.addClass(d.tooltipAnimationClass)
            }
        }
    }]).directive("uibTooltipPopup", function() {
        return {
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/tooltip/tooltip-popup.html"
        }
    }).directive("uibTooltip", ["$uibTooltip", function(a) {
        return a("uibTooltip", "tooltip", "mouseenter")
    }]).directive("uibTooltipTemplatePopup", function() {
        return {
            replace: !0,
            scope: {
                contentExp: "&",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&",
                originScope: "&"
            },
            templateUrl: "uib/template/tooltip/tooltip-template-popup.html"
        }
    }).directive("uibTooltipTemplate", ["$uibTooltip", function(a) {
        return a("uibTooltipTemplate", "tooltip", "mouseenter", {
            useContentExp: !0
        })
    }]).directive("uibTooltipHtmlPopup", function() {
        return {
            replace: !0,
            scope: {
                contentExp: "&",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/tooltip/tooltip-html-popup.html"
        }
    }).directive("uibTooltipHtml", ["$uibTooltip", function(a) {
        return a("uibTooltipHtml", "tooltip", "mouseenter", {
            useContentExp: !0
        })
    }]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("uibPopoverTemplatePopup", function() {
        return {
            replace: !0,
            scope: {
                uibTitle: "@",
                contentExp: "&",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&",
                originScope: "&"
            },
            templateUrl: "uib/template/popover/popover-template.html"
        }
    }).directive("uibPopoverTemplate", ["$uibTooltip", function(a) {
        return a("uibPopoverTemplate", "popover", "click", {
            useContentExp: !0
        })
    }]).directive("uibPopoverHtmlPopup", function() {
        return {
            replace: !0,
            scope: {
                contentExp: "&",
                uibTitle: "@",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/popover/popover-html.html"
        }
    }).directive("uibPopoverHtml", ["$uibTooltip", function(a) {
        return a("uibPopoverHtml", "popover", "click", {
            useContentExp: !0
        })
    }]).directive("uibPopoverPopup", function() {
        return {
            replace: !0,
            scope: {
                uibTitle: "@",
                content: "@",
                placement: "@",
                popupClass: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "uib/template/popover/popover.html"
        }
    }).directive("uibPopover", ["$uibTooltip", function(a) {
        return a("uibPopover", "popover", "click")
    }]), angular.module("ui.bootstrap.progressbar", []).constant("uibProgressConfig", {
        animate: !0,
        max: 100
    }).controller("UibProgressController", ["$scope", "$attrs", "uibProgressConfig", function(a, b, c) {
        function d() {
            return angular.isDefined(a.maxParam) ? a.maxParam : c.max
        }
        var e = this,
            f = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;
        this.bars = [], a.max = d(), this.addBar = function(a, b, c) {
            f || b.css({
                transition: "none"
            }), this.bars.push(a), a.max = d(), a.title = c && angular.isDefined(c.title) ? c.title : "progressbar", a.$watch("value", function(b) {
                a.recalculatePercentage()
            }), a.recalculatePercentage = function() {
                var b = e.bars.reduce(function(a, b) {
                    return b.percent = +(100 * b.value / b.max).toFixed(2), a + b.percent
                }, 0);
                b > 100 && (a.percent -= b - 100)
            }, a.$on("$destroy", function() {
                b = null, e.removeBar(a)
            })
        }, this.removeBar = function(a) {
            this.bars.splice(this.bars.indexOf(a), 1), this.bars.forEach(function(a) {
                a.recalculatePercentage()
            })
        }, a.$watch("maxParam", function(a) {
            e.bars.forEach(function(a) {
                a.max = d(), a.recalculatePercentage()
            })
        })
    }]).directive("uibProgress", function() {
        return {
            replace: !0,
            transclude: !0,
            controller: "UibProgressController",
            require: "uibProgress",
            scope: {
                maxParam: "=?max"
            },
            templateUrl: "uib/template/progressbar/progress.html"
        }
    }).directive("uibBar", function() {
        return {
            replace: !0,
            transclude: !0,
            require: "^uibProgress",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "uib/template/progressbar/bar.html",
            link: function(a, b, c, d) {
                d.addBar(a, b, c)
            }
        }
    }).directive("uibProgressbar", function() {
        return {
            replace: !0,
            transclude: !0,
            controller: "UibProgressController",
            scope: {
                value: "=",
                maxParam: "=?max",
                type: "@"
            },
            templateUrl: "uib/template/progressbar/progressbar.html",
            link: function(a, b, c, d) {
                d.addBar(a, angular.element(b.children()[0]), {
                    title: c.title
                })
            }
        }
    }), angular.module("ui.bootstrap.rating", []).constant("uibRatingConfig", {
        max: 5,
        stateOn: null,
        stateOff: null,
        enableReset: !0,
        titles: ["one", "two", "three", "four", "five"]
    }).controller("UibRatingController", ["$scope", "$attrs", "uibRatingConfig", function(a, b, c) {
        var d = {
                $setViewValue: angular.noop
            },
            e = this;
        this.init = function(e) {
            d = e, d.$render = this.render, d.$formatters.push(function(a) {
                return angular.isNumber(a) && a << 0 !== a && (a = Math.round(a)), a
            }), this.stateOn = angular.isDefined(b.stateOn) ? a.$parent.$eval(b.stateOn) : c.stateOn, this.stateOff = angular.isDefined(b.stateOff) ? a.$parent.$eval(b.stateOff) : c.stateOff, this.enableReset = angular.isDefined(b.enableReset) ? a.$parent.$eval(b.enableReset) : c.enableReset;
            var f = angular.isDefined(b.titles) ? a.$parent.$eval(b.titles) : c.titles;
            this.titles = angular.isArray(f) && f.length > 0 ? f : c.titles;
            var g = angular.isDefined(b.ratingStates) ? a.$parent.$eval(b.ratingStates) : new Array(angular.isDefined(b.max) ? a.$parent.$eval(b.max) : c.max);
            a.range = this.buildTemplateObjects(g)
        }, this.buildTemplateObjects = function(a) {
            for (var b = 0, c = a.length; b < c; b++) a[b] = angular.extend({
                index: b
            }, {
                stateOn: this.stateOn,
                stateOff: this.stateOff,
                title: this.getTitle(b)
            }, a[b]);
            return a
        }, this.getTitle = function(a) {
            return a >= this.titles.length ? a + 1 : this.titles[a]
        }, a.rate = function(b) {
            if (!a.readonly && b >= 0 && b <= a.range.length) {
                var c = e.enableReset && d.$viewValue === b ? 0 : b;
                d.$setViewValue(c), d.$render()
            }
        }, a.enter = function(b) {
            a.readonly || (a.value = b), a.onHover({
                value: b
            })
        }, a.reset = function() {
            a.value = d.$viewValue, a.onLeave()
        }, a.onKeydown = function(b) {
            /(37|38|39|40)/.test(b.which) && (b.preventDefault(), b.stopPropagation(), a.rate(a.value + (38 === b.which || 39 === b.which ? 1 : -1)))
        }, this.render = function() {
            a.value = d.$viewValue, a.title = e.getTitle(a.value - 1)
        }
    }]).directive("uibRating", function() {
        return {
            require: ["uibRating", "ngModel"],
            scope: {
                readonly: "=?readOnly",
                onHover: "&",
                onLeave: "&"
            },
            controller: "UibRatingController",
            templateUrl: "uib/template/rating/rating.html",
            replace: !0,
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                e.init(f)
            }
        }
    }), angular.module("ui.bootstrap.tabs", []).controller("UibTabsetController", ["$scope", function(a) {
        function b(a) {
            for (var b = 0; b < d.tabs.length; b++)
                if (d.tabs[b].index === a) return b
        }
        var c, d = this;
        d.tabs = [], d.select = function(a, f) {
            if (!e) {
                var g = b(c),
                    h = d.tabs[g];
                if (h) {
                    if (h.tab.onDeselect({
                            $event: f,
                            $selectedIndex: a
                        }), f && f.isDefaultPrevented()) return;
                    h.tab.active = !1
                }
                var i = d.tabs[a];
                i ? (i.tab.onSelect({
                    $event: f
                }), i.tab.active = !0, d.active = i.index, c = i.index) : !i && angular.isDefined(c) && (d.active = null, c = null)
            }
        }, d.addTab = function(a) {
            if (d.tabs.push({
                    tab: a,
                    index: a.index
                }), d.tabs.sort(function(a, b) {
                    return a.index > b.index ? 1 : a.index < b.index ? -1 : 0
                }), a.index === d.active || !angular.isDefined(d.active) && 1 === d.tabs.length) {
                var c = b(a.index);
                d.select(c)
            }
        }, d.removeTab = function(a) {
            for (var b, c = 0; c < d.tabs.length; c++)
                if (d.tabs[c].tab === a) {
                    b = c;
                    break
                } if (d.tabs[b].index === d.active) {
                var e = b === d.tabs.length - 1 ? b - 1 : b + 1 % d.tabs.length;
                d.select(e)
            }
            d.tabs.splice(b, 1)
        }, a.$watch("tabset.active", function(a) {
            angular.isDefined(a) && a !== c && d.select(b(a))
        });
        var e;
        a.$on("$destroy", function() {
            e = !0
        })
    }]).directive("uibTabset", function() {
        return {
            transclude: !0,
            replace: !0,
            scope: {},
            bindToController: {
                active: "=?",
                type: "@"
            },
            controller: "UibTabsetController",
            controllerAs: "tabset",
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/tabs/tabset.html"
            },
            link: function(a, b, c) {
                a.vertical = !!angular.isDefined(c.vertical) && a.$parent.$eval(c.vertical), a.justified = !!angular.isDefined(c.justified) && a.$parent.$eval(c.justified)
            }
        }
    }).directive("uibTab", ["$parse", function(a) {
        return {
            require: "^uibTabset",
            replace: !0,
            templateUrl: function(a, b) {
                return b.templateUrl || "uib/template/tabs/tab.html"
            },
            transclude: !0,
            scope: {
                heading: "@",
                index: "=?",
                classes: "@?",
                onSelect: "&select",
                onDeselect: "&deselect"
            },
            controller: function() {},
            controllerAs: "tab",
            link: function(b, c, d, e, f) {
                b.disabled = !1, d.disable && b.$parent.$watch(a(d.disable), function(a) {
                    b.disabled = !!a
                }), angular.isUndefined(d.index) && (e.tabs && e.tabs.length ? b.index = Math.max.apply(null, e.tabs.map(function(a) {
                    return a.index
                })) + 1 : b.index = 0), angular.isUndefined(d.classes) && (b.classes = ""), b.select = function(a) {
                    if (!b.disabled) {
                        for (var c, d = 0; d < e.tabs.length; d++)
                            if (e.tabs[d].tab === b) {
                                c = d;
                                break
                            } e.select(c, a)
                    }
                }, e.addTab(b), b.$on("$destroy", function() {
                    e.removeTab(b)
                }), b.$transcludeFn = f
            }
        }
    }]).directive("uibTabHeadingTransclude", function() {
        return {
            restrict: "A",
            require: "^uibTab",
            link: function(a, b) {
                a.$watch("headingElement", function(a) {
                    a && (b.html(""), b.append(a))
                })
            }
        }
    }).directive("uibTabContentTransclude", function() {
        function a(a) {
            return a.tagName && (a.hasAttribute("uib-tab-heading") || a.hasAttribute("data-uib-tab-heading") || a.hasAttribute("x-uib-tab-heading") || "uib-tab-heading" === a.tagName.toLowerCase() || "data-uib-tab-heading" === a.tagName.toLowerCase() || "x-uib-tab-heading" === a.tagName.toLowerCase() || "uib:tab-heading" === a.tagName.toLowerCase())
        }
        return {
            restrict: "A",
            require: "^uibTabset",
            link: function(b, c, d) {
                var e = b.$eval(d.uibTabContentTransclude).tab;
                e.$transcludeFn(e.$parent, function(b) {
                    angular.forEach(b, function(b) {
                        a(b) ? e.headingElement = b : c.append(b)
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.timepicker", []).constant("uibTimepickerConfig", {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        showMeridian: !0,
        showSeconds: !1,
        meridians: null,
        readonlyInput: !1,
        mousewheel: !0,
        arrowkeys: !0,
        showSpinners: !0,
        templateUrl: "uib/template/timepicker/timepicker.html"
    }).controller("UibTimepickerController", ["$scope", "$element", "$attrs", "$parse", "$log", "$locale", "uibTimepickerConfig", function(a, b, c, d, e, f, g) {
        function h() {
            var b = +a.hours,
                c = a.showMeridian ? b > 0 && b < 13 : b >= 0 && b < 24;
            if (c && "" !== a.hours) return a.showMeridian && (12 === b && (b = 0), a.meridian === v[1] && (b += 12)), b
        }

        function i() {
            var b = +a.minutes,
                c = b >= 0 && b < 60;
            if (c && "" !== a.minutes) return b
        }

        function j() {
            var b = +a.seconds;
            return b >= 0 && b < 60 ? b : void 0
        }

        function k(a, b) {
            return null === a ? "" : angular.isDefined(a) && a.toString().length < 2 && !b ? "0" + a : a.toString()
        }

        function l(a) {
            m(), u.$setViewValue(new Date(s)), n(a)
        }

        function m() {
            u.$setValidity("time", !0), a.invalidHours = !1, a.invalidMinutes = !1, a.invalidSeconds = !1
        }

        function n(b) {
            if (u.$modelValue) {
                var c = s.getHours(),
                    d = s.getMinutes(),
                    e = s.getSeconds();
                a.showMeridian && (c = 0 === c || 12 === c ? 12 : c % 12), a.hours = "h" === b ? c : k(c, !w), "m" !== b && (a.minutes = k(d)), a.meridian = s.getHours() < 12 ? v[0] : v[1], "s" !== b && (a.seconds = k(e)), a.meridian = s.getHours() < 12 ? v[0] : v[1]
            } else a.hours = null, a.minutes = null, a.seconds = null, a.meridian = v[0]
        }

        function o(a) {
            s = q(s, a), l()
        }

        function p(a, b) {
            return q(a, 60 * b)
        }

        function q(a, b) {
            var c = new Date(a.getTime() + 1e3 * b),
                d = new Date(a);
            return d.setHours(c.getHours(), c.getMinutes(), c.getSeconds()), d
        }

        function r() {
            return (null === a.hours || "" === a.hours) && (null === a.minutes || "" === a.minutes) && (!a.showSeconds || a.showSeconds && (null === a.seconds || "" === a.seconds))
        }
        var s = new Date,
            t = [],
            u = {
                $setViewValue: angular.noop
            },
            v = angular.isDefined(c.meridians) ? a.$parent.$eval(c.meridians) : g.meridians || f.DATETIME_FORMATS.AMPMS,
            w = !angular.isDefined(c.padHours) || a.$parent.$eval(c.padHours);
        a.tabindex = angular.isDefined(c.tabindex) ? c.tabindex : 0, b.removeAttr("tabindex"), this.init = function(b, d) {
            u = b, u.$render = this.render, u.$formatters.unshift(function(a) {
                return a ? new Date(a) : null
            });
            var e = d.eq(0),
                f = d.eq(1),
                h = d.eq(2),
                i = angular.isDefined(c.mousewheel) ? a.$parent.$eval(c.mousewheel) : g.mousewheel;
            i && this.setupMousewheelEvents(e, f, h);
            var j = angular.isDefined(c.arrowkeys) ? a.$parent.$eval(c.arrowkeys) : g.arrowkeys;
            j && this.setupArrowkeyEvents(e, f, h), a.readonlyInput = angular.isDefined(c.readonlyInput) ? a.$parent.$eval(c.readonlyInput) : g.readonlyInput, this.setupInputEvents(e, f, h)
        };
        var x = g.hourStep;
        c.hourStep && t.push(a.$parent.$watch(d(c.hourStep), function(a) {
            x = +a
        }));
        var y = g.minuteStep;
        c.minuteStep && t.push(a.$parent.$watch(d(c.minuteStep), function(a) {
            y = +a
        }));
        var z;
        t.push(a.$parent.$watch(d(c.min), function(a) {
            var b = new Date(a);
            z = isNaN(b) ? void 0 : b
        }));
        var A;
        t.push(a.$parent.$watch(d(c.max), function(a) {
            var b = new Date(a);
            A = isNaN(b) ? void 0 : b
        }));
        var B = !1;
        c.ngDisabled && t.push(a.$parent.$watch(d(c.ngDisabled), function(a) {
            B = a
        })), a.noIncrementHours = function() {
            var a = p(s, 60 * x);
            return B || a > A || a < s && a < z
        }, a.noDecrementHours = function() {
            var a = p(s, 60 * -x);
            return B || a < z || a > s && a > A
        }, a.noIncrementMinutes = function() {
            var a = p(s, y);
            return B || a > A || a < s && a < z
        }, a.noDecrementMinutes = function() {
            var a = p(s, -y);
            return B || a < z || a > s && a > A
        }, a.noIncrementSeconds = function() {
            var a = q(s, C);
            return B || a > A || a < s && a < z
        }, a.noDecrementSeconds = function() {
            var a = q(s, -C);
            return B || a < z || a > s && a > A
        }, a.noToggleMeridian = function() {
            return s.getHours() < 12 ? B || p(s, 720) > A : B || p(s, -720) < z
        };
        var C = g.secondStep;
        c.secondStep && t.push(a.$parent.$watch(d(c.secondStep), function(a) {
            C = +a
        })), a.showSeconds = g.showSeconds, c.showSeconds && t.push(a.$parent.$watch(d(c.showSeconds), function(b) {
            a.showSeconds = !!b
        })), a.showMeridian = g.showMeridian, c.showMeridian && t.push(a.$parent.$watch(d(c.showMeridian), function(b) {
            if (a.showMeridian = !!b, u.$error.time) {
                var c = h(),
                    d = i();
                angular.isDefined(c) && angular.isDefined(d) && (s.setHours(c), l())
            } else n()
        })), this.setupMousewheelEvents = function(b, c, d) {
            var e = function(a) {
                a.originalEvent && (a = a.originalEvent);
                var b = a.wheelDelta ? a.wheelDelta : -a.deltaY;
                return a.detail || b > 0
            };
            b.bind("mousewheel wheel", function(b) {
                B || a.$apply(e(b) ? a.incrementHours() : a.decrementHours()), b.preventDefault()
            }), c.bind("mousewheel wheel", function(b) {
                B || a.$apply(e(b) ? a.incrementMinutes() : a.decrementMinutes()), b.preventDefault()
            }), d.bind("mousewheel wheel", function(b) {
                B || a.$apply(e(b) ? a.incrementSeconds() : a.decrementSeconds()), b.preventDefault()
            })
        }, this.setupArrowkeyEvents = function(b, c, d) {
            b.bind("keydown", function(b) {
                B || (38 === b.which ? (b.preventDefault(), a.incrementHours(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementHours(), a.$apply()))
            }), c.bind("keydown", function(b) {
                B || (38 === b.which ? (b.preventDefault(), a.incrementMinutes(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementMinutes(), a.$apply()))
            }), d.bind("keydown", function(b) {
                B || (38 === b.which ? (b.preventDefault(), a.incrementSeconds(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementSeconds(), a.$apply()))
            })
        }, this.setupInputEvents = function(b, c, d) {
            if (a.readonlyInput) return a.updateHours = angular.noop, a.updateMinutes = angular.noop, void(a.updateSeconds = angular.noop);
            var e = function(b, c, d) {
                u.$setViewValue(null), u.$setValidity("time", !1), angular.isDefined(b) && (a.invalidHours = b), angular.isDefined(c) && (a.invalidMinutes = c), angular.isDefined(d) && (a.invalidSeconds = d)
            };
            a.updateHours = function() {
                var a = h(),
                    b = i();
                u.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (s.setHours(a), s.setMinutes(b), s < z || s > A ? e(!0) : l("h")) : e(!0)
            }, b.bind("blur", function(b) {
                u.$setTouched(), r() ? m() : null === a.hours || "" === a.hours ? e(!0) : !a.invalidHours && a.hours < 10 && a.$apply(function() {
                    a.hours = k(a.hours, !w)
                })
            }), a.updateMinutes = function() {
                var a = i(),
                    b = h();
                u.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (s.setHours(b), s.setMinutes(a), s < z || s > A ? e(void 0, !0) : l("m")) : e(void 0, !0)
            }, c.bind("blur", function(b) {
                u.$setTouched(), r() ? m() : null === a.minutes ? e(void 0, !0) : !a.invalidMinutes && a.minutes < 10 && a.$apply(function() {
                    a.minutes = k(a.minutes)
                })
            }), a.updateSeconds = function() {
                var a = j();
                u.$setDirty(), angular.isDefined(a) ? (s.setSeconds(a), l("s")) : e(void 0, void 0, !0)
            }, d.bind("blur", function(b) {
                r() ? m() : !a.invalidSeconds && a.seconds < 10 && a.$apply(function() {
                    a.seconds = k(a.seconds)
                })
            })
        }, this.render = function() {
            var b = u.$viewValue;
            isNaN(b) ? (u.$setValidity("time", !1), e.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (b && (s = b), s < z || s > A ? (u.$setValidity("time", !1), a.invalidHours = !0, a.invalidMinutes = !0) : m(), n())
        }, a.showSpinners = angular.isDefined(c.showSpinners) ? a.$parent.$eval(c.showSpinners) : g.showSpinners, a.incrementHours = function() {
            a.noIncrementHours() || o(60 * x * 60)
        }, a.decrementHours = function() {
            a.noDecrementHours() || o(60 * -x * 60)
        }, a.incrementMinutes = function() {
            a.noIncrementMinutes() || o(60 * y)
        }, a.decrementMinutes = function() {
            a.noDecrementMinutes() || o(60 * -y)
        }, a.incrementSeconds = function() {
            a.noIncrementSeconds() || o(C)
        }, a.decrementSeconds = function() {
            a.noDecrementSeconds() || o(-C)
        }, a.toggleMeridian = function() {
            var b = i(),
                c = h();
            a.noToggleMeridian() || (angular.isDefined(b) && angular.isDefined(c) ? o(720 * (s.getHours() < 12 ? 60 : -60)) : a.meridian = a.meridian === v[0] ? v[1] : v[0])
        }, a.blur = function() {
            u.$setTouched()
        }, a.$on("$destroy", function() {
            for (; t.length;) t.shift()()
        })
    }]).directive("uibTimepicker", ["uibTimepickerConfig", function(a) {
        return {
            require: ["uibTimepicker", "?^ngModel"],
            controller: "UibTimepickerController",
            controllerAs: "timepicker",
            replace: !0,
            scope: {},
            templateUrl: function(b, c) {
                return c.templateUrl || a.templateUrl
            },
            link: function(a, b, c, d) {
                var e = d[0],
                    f = d[1];
                f && e.init(f, b.find("input"))
            }
        }
    }]), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.debounce", "ui.bootstrap.position"]).factory("uibTypeaheadParser", ["$parse", function(a) {
        var b = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
        return {
            parse: function(c) {
                var d = c.match(b);
                if (!d) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + c + '".');
                return {
                    itemName: d[3],
                    source: a(d[4]),
                    viewMapper: a(d[2] || d[1]),
                    modelMapper: a(d[1])
                }
            }
        }
    }]).controller("UibTypeaheadController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$q", "$timeout", "$document", "$window", "$rootScope", "$$debounce", "$uibPosition", "uibTypeaheadParser", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        function n() {
            O.moveInProgress || (O.moveInProgress = !0, O.$digest()), Z()
        }

        function o() {
            O.position = E ? l.offset(b) : l.position(b), O.position.top += b.prop("offsetHeight")
        }
        var p, q, r = [9, 13, 27, 38, 40],
            s = 200,
            t = a.$eval(c.typeaheadMinLength);
        t || 0 === t || (t = 1), a.$watch(c.typeaheadMinLength, function(a) {
            t = a || 0 === a ? a : 1
        });
        var u = a.$eval(c.typeaheadWaitMs) || 0,
            v = a.$eval(c.typeaheadEditable) !== !1;
        a.$watch(c.typeaheadEditable, function(a) {
            v = a !== !1
        });
        var w, x, y = e(c.typeaheadLoading).assign || angular.noop,
            z = c.typeaheadShouldSelect ? e(c.typeaheadShouldSelect) : function(a, b) {
                var c = b.$event;
                return 13 === c.which || 9 === c.which
            },
            A = e(c.typeaheadOnSelect),
            B = !!angular.isDefined(c.typeaheadSelectOnBlur) && a.$eval(c.typeaheadSelectOnBlur),
            C = e(c.typeaheadNoResults).assign || angular.noop,
            D = c.typeaheadInputFormatter ? e(c.typeaheadInputFormatter) : void 0,
            E = !!c.typeaheadAppendToBody && a.$eval(c.typeaheadAppendToBody),
            F = c.typeaheadAppendTo ? a.$eval(c.typeaheadAppendTo) : null,
            G = a.$eval(c.typeaheadFocusFirst) !== !1,
            H = !!c.typeaheadSelectOnExact && a.$eval(c.typeaheadSelectOnExact),
            I = e(c.typeaheadIsOpen).assign || angular.noop,
            J = a.$eval(c.typeaheadShowHint) || !1,
            K = e(c.ngModel),
            L = e(c.ngModel + "($$$p)"),
            M = function(b, c) {
                return angular.isFunction(K(a)) && q && q.$options && q.$options.getterSetter ? L(b, {
                    $$$p: c
                }) : K.assign(b, c)
            },
            N = m.parse(c.uibTypeahead),
            O = a.$new(),
            P = a.$on("$destroy", function() {
                O.$destroy()
            });
        O.$on("$destroy", P);
        var Q = "typeahead-" + O.$id + "-" + Math.floor(1e4 * Math.random());
        b.attr({
            "aria-autocomplete": "list",
            "aria-expanded": !1,
            "aria-owns": Q
        });
        var R, S;
        J && (R = angular.element("<div></div>"), R.css("position", "relative"), b.after(R), S = b.clone(), S.attr("placeholder", ""), S.attr("tabindex", "-1"), S.val(""), S.css({
            position: "absolute",
            top: "0px",
            left: "0px",
            "border-color": "transparent",
            "box-shadow": "none",
            opacity: 1,
            background: "none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)",
            color: "#999"
        }), b.css({
            position: "relative",
            "vertical-align": "top",
            "background-color": "transparent"
        }), R.append(S), S.after(b));
        var T = angular.element("<div uib-typeahead-popup></div>");
        T.attr({
            id: Q,
            matches: "matches",
            active: "activeIdx",
            select: "select(activeIdx, evt)",
            "move-in-progress": "moveInProgress",
            query: "query",
            position: "position",
            "assign-is-open": "assignIsOpen(isOpen)",
            debounce: "debounceUpdate"
        }), angular.isDefined(c.typeaheadTemplateUrl) && T.attr("template-url", c.typeaheadTemplateUrl), angular.isDefined(c.typeaheadPopupTemplateUrl) && T.attr("popup-template-url", c.typeaheadPopupTemplateUrl);
        var U = function() {
                J && S.val("")
            },
            V = function() {
                O.matches = [], O.activeIdx = -1, b.attr("aria-expanded", !1), U()
            },
            W = function(a) {
                return Q + "-option-" + a
            };
        O.$watch("activeIdx", function(a) {
            a < 0 ? b.removeAttr("aria-activedescendant") : b.attr("aria-activedescendant", W(a))
        });
        var X = function(a, b) {
                return !!(O.matches.length > b && a) && a.toUpperCase() === O.matches[b].label.toUpperCase()
            },
            Y = function(c, d) {
                var e = {
                    $viewValue: c
                };
                y(a, !0), C(a, !1), f.when(N.source(a, e)).then(function(f) {
                    var g = c === p.$viewValue;
                    if (g && w)
                        if (f && f.length > 0) {
                            O.activeIdx = G ? 0 : -1, C(a, !1), O.matches.length = 0;
                            for (var h = 0; h < f.length; h++) e[N.itemName] = f[h], O.matches.push({
                                id: W(h),
                                label: N.viewMapper(O, e),
                                model: f[h]
                            });
                            if (O.query = c, o(), b.attr("aria-expanded", !0), H && 1 === O.matches.length && X(c, 0) && (angular.isNumber(O.debounceUpdate) || angular.isObject(O.debounceUpdate) ? k(function() {
                                    O.select(0, d)
                                }, angular.isNumber(O.debounceUpdate) ? O.debounceUpdate : O.debounceUpdate["default"]) : O.select(0, d)), J) {
                                var i = O.matches[0].label;
                                angular.isString(c) && c.length > 0 && i.slice(0, c.length).toUpperCase() === c.toUpperCase() ? S.val(c + i.slice(c.length)) : S.val("")
                            }
                        } else V(), C(a, !0);
                    g && y(a, !1)
                }, function() {
                    V(), y(a, !1), C(a, !0)
                })
            };
        E && (angular.element(i).on("resize", n), h.find("body").on("scroll", n));
        var Z = k(function() {
            O.matches.length && o(), O.moveInProgress = !1
        }, s);
        O.moveInProgress = !1, O.query = void 0;
        var $, _ = function(a) {
                $ = g(function() {
                    Y(a)
                }, u)
            },
            aa = function() {
                $ && g.cancel($)
            };
        V(), O.assignIsOpen = function(b) {
            I(a, b)
        }, O.select = function(d, e) {
            var f, h, i = {};
            x = !0, i[N.itemName] = h = O.matches[d].model, f = N.modelMapper(a, i), M(a, f), p.$setValidity("editable", !0), p.$setValidity("parse", !0), A(a, {
                $item: h,
                $model: f,
                $label: N.viewMapper(a, i),
                $event: e
            }), V(), O.$eval(c.typeaheadFocusOnSelect) !== !1 && g(function() {
                b[0].focus()
            }, 0, !1)
        }, b.on("keydown", function(b) {
            if (0 !== O.matches.length && r.indexOf(b.which) !== -1) {
                var c = z(a, {
                    $event: b
                });
                if (O.activeIdx === -1 && c || 9 === b.which && b.shiftKey) return V(), void O.$digest();
                b.preventDefault();
                var d;
                switch (b.which) {
                    case 27:
                        b.stopPropagation(), V(), a.$digest();
                        break;
                    case 38:
                        O.activeIdx = (O.activeIdx > 0 ? O.activeIdx : O.matches.length) - 1, O.$digest(), d = T.find("li")[O.activeIdx], d.parentNode.scrollTop = d.offsetTop;
                        break;
                    case 40:
                        O.activeIdx = (O.activeIdx + 1) % O.matches.length, O.$digest(), d = T.find("li")[O.activeIdx], d.parentNode.scrollTop = d.offsetTop;
                        break;
                    default:
                        c && O.$apply(function() {
                            angular.isNumber(O.debounceUpdate) || angular.isObject(O.debounceUpdate) ? k(function() {
                                O.select(O.activeIdx, b)
                            }, angular.isNumber(O.debounceUpdate) ? O.debounceUpdate : O.debounceUpdate["default"]) : O.select(O.activeIdx, b)
                        })
                }
            }
        }), b.bind("focus", function(a) {
            w = !0, 0 !== t || p.$viewValue || g(function() {
                Y(p.$viewValue, a)
            }, 0)
        }), b.bind("blur", function(a) {
            B && O.matches.length && O.activeIdx !== -1 && !x && (x = !0, O.$apply(function() {
                angular.isObject(O.debounceUpdate) && angular.isNumber(O.debounceUpdate.blur) ? k(function() {
                    O.select(O.activeIdx, a)
                }, O.debounceUpdate.blur) : O.select(O.activeIdx, a)
            })), !v && p.$error.editable && (p.$setViewValue(), p.$setValidity("editable", !0), p.$setValidity("parse", !0), b.val("")), w = !1, x = !1
        });
        var ba = function(c) {
            b[0] !== c.target && 3 !== c.which && 0 !== O.matches.length && (V(), j.$$phase || a.$digest())
        };
        h.on("click", ba), a.$on("$destroy", function() {
            h.off("click", ba), (E || F) && ca.remove(), E && (angular.element(i).off("resize", n), h.find("body").off("scroll", n)), T.remove(), J && R.remove()
        });
        var ca = d(T)(O);
        E ? h.find("body").append(ca) : F ? angular.element(F).eq(0).append(ca) : b.after(ca), this.init = function(b, c) {
            p = b, q = c, O.debounceUpdate = p.$options && e(p.$options.debounce)(a), p.$parsers.unshift(function(b) {
                return w = !0, 0 === t || b && b.length >= t ? u > 0 ? (aa(), _(b)) : Y(b) : (y(a, !1), aa(), V()), v ? b : b ? void p.$setValidity("editable", !1) : (p.$setValidity("editable", !0), null)
            }), p.$formatters.push(function(b) {
                var c, d, e = {};
                return v || p.$setValidity("editable", !0), D ? (e.$model = b, D(a, e)) : (e[N.itemName] = b, c = N.viewMapper(a, e), e[N.itemName] = void 0, d = N.viewMapper(a, e), c !== d ? c : b)
            })
        }
    }]).directive("uibTypeahead", function() {
        return {
            controller: "UibTypeaheadController",
            require: ["ngModel", "^?ngModelOptions", "uibTypeahead"],
            link: function(a, b, c, d) {
                d[2].init(d[0], d[1])
            }
        }
    }).directive("uibTypeaheadPopup", ["$$debounce", function(a) {
        return {
            scope: {
                matches: "=",
                query: "=",
                active: "=",
                position: "&",
                moveInProgress: "=",
                select: "&",
                assignIsOpen: "&",
                debounce: "&"
            },
            replace: !0,
            templateUrl: function(a, b) {
                return b.popupTemplateUrl || "uib/template/typeahead/typeahead-popup.html"
            },
            link: function(b, c, d) {
                b.templateUrl = d.templateUrl, b.isOpen = function() {
                    var a = b.matches.length > 0;
                    return b.assignIsOpen({
                        isOpen: a
                    }), a
                }, b.isActive = function(a) {
                    return b.active === a
                }, b.selectActive = function(a) {
                    b.active = a
                }, b.selectMatch = function(c, d) {
                    var e = b.debounce();
                    angular.isNumber(e) || angular.isObject(e) ? a(function() {
                        b.select({
                            activeIdx: c,
                            evt: d
                        })
                    }, angular.isNumber(e) ? e : e["default"]) : b.select({
                        activeIdx: c,
                        evt: d
                    })
                }
            }
        }
    }]).directive("uibTypeaheadMatch", ["$templateRequest", "$compile", "$parse", function(a, b, c) {
        return {
            scope: {
                index: "=",
                match: "=",
                query: "="
            },
            link: function(d, e, f) {
                var g = c(f.templateUrl)(d.$parent) || "uib/template/typeahead/typeahead-match.html";
                a(g).then(function(a) {
                    var c = angular.element(a.trim());
                    e.replaceWith(c), b(c)(d)
                })
            }
        }
    }]).filter("uibTypeaheadHighlight", ["$sce", "$injector", "$log", function(a, b, c) {
        function d(a) {
            return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
        }

        function e(a) {
            return /<.*>/g.test(a)
        }
        var f;
        return f = b.has("$sanitize"),
            function(b, g) {
                return !f && e(b) && c.warn("Unsafe use of typeahead please use ngSanitize"), b = g ? ("" + b).replace(new RegExp(d(g), "gi"), "<strong>$&</strong>") : b, f || (b = a.trustAsHtml(b)), b
            }
    }]), angular.module("uib/template/accordion/accordion-group.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/accordion/accordion-group.html", '<div class="panel" ng-class="panelClass || \'panel-default\'">\n  <div role="tab" id="{{::headingId}}" aria-selected="{{isOpen}}" class="panel-heading" ng-keypress="toggleOpen($event)">\n    <h4 class="panel-title">\n      <a role="button" data-toggle="collapse" href aria-expanded="{{isOpen}}" aria-controls="{{::panelId}}" tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" uib-accordion-transclude="heading"><span uib-accordion-header ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div id="{{::panelId}}" aria-labelledby="{{::headingId}}" aria-hidden="{{!isOpen}}" role="tabpanel" class="panel-collapse collapse" uib-collapse="!isOpen">\n    <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')
    }]), angular.module("uib/template/accordion/accordion.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/accordion/accordion.html", '<div role="tablist" class="panel-group" ng-transclude></div>')
    }]), angular.module("uib/template/alert/alert.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/alert/alert.html", '<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissible\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close({$event: $event})">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')
    }]), angular.module("uib/template/carousel/carousel.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/carousel/carousel.html", '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n  <div class="carousel-inner" ng-transclude></div>\n  <a role="button" href class="left carousel-control" ng-click="prev()" ng-class="{ disabled: isPrevDisabled() }" ng-show="slides.length > 1">\n    <span aria-hidden="true" class="glyphicon glyphicon-chevron-left"></span>\n    <span class="sr-only">previous</span>\n  </a>\n  <a role="button" href class="right carousel-control" ng-click="next()" ng-class="{ disabled: isNextDisabled() }" ng-show="slides.length > 1">\n    <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>\n    <span class="sr-only">next</span>\n  </a>\n  <ol class="carousel-indicators" ng-show="slides.length > 1">\n    <li ng-repeat="slide in slides | orderBy:indexOfSlide track by $index" ng-class="{ active: isActive(slide) }" ng-click="select(slide)">\n      <span class="sr-only">slide {{ $index + 1 }} of {{ slides.length }}<span ng-if="isActive(slide)">, currently active</span></span>\n    </li>\n  </ol>\n</div>\n')
    }]), angular.module("uib/template/carousel/slide.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/carousel/slide.html", '<div ng-class="{\n    \'active\': active\n  }" class="item text-center" ng-transclude></div>\n')
    }]), angular.module("uib/template/datepicker/datepicker.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/datepicker/datepicker.html", '<div class="uib-datepicker" ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <uib-daypicker ng-switch-when="day" tabindex="0"></uib-daypicker>\n  <uib-monthpicker ng-switch-when="month" tabindex="0"></uib-monthpicker>\n  <uib-yearpicker ng-switch-when="year" tabindex="0"></uib-yearpicker>\n</div>\n')
    }]), angular.module("uib/template/datepicker/day.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/datepicker/day.html", '<table class="uib-daypicker" role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left uib-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{::5 + showWeeks}}"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm uib-title" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right uib-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-if="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in ::labels track by $index" class="text-center"><small aria-label="{{::label.full}}">{{::label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="uib-weeks" ng-repeat="row in rows track by $index">\n      <td ng-if="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row" class="uib-day text-center" role="gridcell"\n        id="{{::dt.uid}}"\n        ng-class="::dt.customClass">\n        <button type="button" class="btn btn-default btn-sm"\n          uib-is-class="\n            \'btn-info\' for selectedDt,\n            \'active\' for activeDt\n            on dt"\n          ng-click="select(dt.date)"\n          ng-disabled="::dt.disabled"\n          tabindex="-1"><span ng-class="::{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("uib/template/datepicker/month.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/datepicker/month.html", '<table class="uib-monthpicker" role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left uib-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm uib-title" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right uib-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="uib-months" ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row" class="uib-month text-center" role="gridcell"\n        id="{{::dt.uid}}"\n        ng-class="::dt.customClass">\n        <button type="button" class="btn btn-default"\n          uib-is-class="\n            \'btn-info\' for selectedDt,\n            \'active\' for activeDt\n            on dt"\n          ng-click="select(dt.date)"\n          ng-disabled="::dt.disabled"\n          tabindex="-1"><span ng-class="::{\'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
    }]), angular.module("uib/template/datepicker/year.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/datepicker/year.html", '<table class="uib-yearpicker" role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left uib-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{::columns - 2}}"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm uib-title" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right uib-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="uib-years" ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row" class="uib-year text-center" role="gridcell"\n        id="{{::dt.uid}}"\n        ng-class="::dt.customClass">\n        <button type="button" class="btn btn-default"\n          uib-is-class="\n            \'btn-info\' for selectedDt,\n            \'active\' for activeDt\n            on dt"\n          ng-click="select(dt.date)"\n          ng-disabled="::dt.disabled"\n          tabindex="-1"><span ng-class="::{\'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("uib/template/datepickerPopup/popup.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/datepickerPopup/popup.html", '<div>\n  <ul class="uib-datepicker-popup dropdown-menu uib-position-measure" dropdown-nested ng-if="isOpen" ng-keydown="keydown($event)" ng-click="$event.stopPropagation()">\n    <li ng-transclude></li>\n    <li ng-if="showButtonBar" class="uib-button-bar">\n      <span class="btn-group pull-left">\n        <button type="button" class="btn btn-sm btn-info uib-datepicker-current" ng-click="select(\'today\', $event)" ng-disabled="isDisabled(\'today\')">{{ getText(\'current\') }}</button>\n        <button type="button" class="btn btn-sm btn-danger uib-clear" ng-click="select(null, $event)">{{ getText(\'clear\') }}</button>\n      </span>\n      <button type="button" class="btn btn-sm btn-success pull-right uib-close" ng-click="close($event)">{{ getText(\'close\') }}</button>\n    </li>\n  </ul>\n</div>\n')
    }]), angular.module("uib/template/modal/backdrop.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/modal/backdrop.html", '<div class="modal-backdrop"\n     uib-modal-animation-class="fade"\n     modal-in-class="in"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')
    }]), angular.module("uib/template/modal/window.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/modal/window.html", '<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"\n    uib-modal-animation-class="fade"\n    modal-in-class="in"\n    ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}">\n    <div class="modal-dialog {{size ? \'modal-\' + size : \'\'}}"><div class="modal-content" uib-modal-transclude></div></div>\n</div>\n')
    }]), angular.module("uib/template/pager/pager.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/pager/pager.html", '<ul class="pager">\n  <li ng-class="{disabled: noPrevious()||ngDisabled, previous: align}"><a href ng-click="selectPage(page - 1, $event)">{{::getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext()||ngDisabled, next: align}"><a href ng-click="selectPage(page + 1, $event)">{{::getText(\'next\')}}</a></li>\n</ul>\n')
    }]), angular.module("uib/template/pagination/pagination.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/pagination/pagination.html", '<ul class="pagination">\n  <li ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-first"><a href ng-click="selectPage(1, $event)">{{::getText(\'first\')}}</a></li>\n  <li ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-prev"><a href ng-click="selectPage(page - 1, $event)">{{::getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="pagination-page"><a href ng-click="selectPage(page.number, $event)">{{page.text}}</a></li>\n  <li ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-next"><a href ng-click="selectPage(page + 1, $event)">{{::getText(\'next\')}}</a></li>\n  <li ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-last"><a href ng-click="selectPage(totalPages, $event)">{{::getText(\'last\')}}</a></li>\n</ul>\n')
    }]), angular.module("uib/template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/tooltip/tooltip-html-popup.html", '<div class="tooltip"\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind-html="contentExp()"></div>\n</div>\n')
    }]), angular.module("uib/template/tooltip/tooltip-popup.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/tooltip/tooltip-popup.html", '<div class="tooltip"\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')
    }]), angular.module("uib/template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/tooltip/tooltip-template-popup.html", '<div class="tooltip"\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner"\n    uib-tooltip-template-transclude="contentExp()"\n    tooltip-template-transclude-scope="originScope()"></div>\n</div>\n')
    }]), angular.module("uib/template/popover/popover-html.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/popover/popover-html.html", '<div class="popover"\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n      <div class="popover-content" ng-bind-html="contentExp()"></div>\n  </div>\n</div>\n')
    }]), angular.module("uib/template/popover/popover-template.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/popover/popover-template.html", '<div class="popover"\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n      <div class="popover-content"\n        uib-tooltip-template-transclude="contentExp()"\n        tooltip-template-transclude-scope="originScope()"></div>\n  </div>\n</div>\n')
    }]), angular.module("uib/template/popover/popover.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/popover/popover.html", '<div class="popover"\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')
    }]), angular.module("uib/template/progressbar/bar.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" aria-labelledby="{{::title}}" ng-transclude></div>\n')
    }]), angular.module("uib/template/progressbar/progress.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/progressbar/progress.html", '<div class="progress" ng-transclude aria-labelledby="{{::title}}"></div>')
    }]), angular.module("uib/template/progressbar/progressbar.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" aria-labelledby="{{::title}}" ng-transclude></div>\n</div>\n')
    }]), angular.module("uib/template/rating/rating.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}" aria-valuetext="{{title}}">\n    <span ng-repeat-start="r in range track by $index" class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    <i ng-repeat-end ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')" ng-attr-title="{{r.title}}"></i>\n</span>\n')
    }]), angular.module("uib/template/tabs/tab.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/tabs/tab.html", '<li ng-class="[{active: active, disabled: disabled}, classes]" class="uib-tab nav-item">\n  <a href ng-click="select($event)" class="nav-link" uib-tab-heading-transclude>{{heading}}</a>\n</li>\n')
    }]), angular.module("uib/template/tabs/tabset.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{tabset.type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane"\n         ng-repeat="tab in tabset.tabs"\n         ng-class="{active: tabset.active === tab.index}"\n         uib-tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')
    }]), angular.module("uib/template/timepicker/timepicker.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/timepicker/timepicker.html", '<table class="uib-timepicker">\n  <tbody>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td class="uib-increment hours"><a ng-click="incrementHours()" ng-class="{disabled: noIncrementHours()}" class="btn btn-link" ng-disabled="noIncrementHours()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td>&nbsp;</td>\n      <td class="uib-increment minutes"><a ng-click="incrementMinutes()" ng-class="{disabled: noIncrementMinutes()}" class="btn btn-link" ng-disabled="noIncrementMinutes()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td ng-show="showSeconds">&nbsp;</td>\n      <td ng-show="showSeconds" class="uib-increment seconds"><a ng-click="incrementSeconds()" ng-class="{disabled: noIncrementSeconds()}" class="btn btn-link" ng-disabled="noIncrementSeconds()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n    <tr>\n      <td class="form-group uib-time hours" ng-class="{\'has-error\': invalidHours}">\n        <input type="text" placeholder="HH" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementHours()" ng-blur="blur()">\n      </td>\n      <td class="uib-separator">:</td>\n      <td class="form-group uib-time minutes" ng-class="{\'has-error\': invalidMinutes}">\n        <input type="text" placeholder="MM" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementMinutes()" ng-blur="blur()">\n      </td>\n      <td ng-show="showSeconds" class="uib-separator">:</td>\n      <td class="form-group uib-time seconds" ng-class="{\'has-error\': invalidSeconds}" ng-show="showSeconds">\n        <input type="text" placeholder="SS" ng-model="seconds" ng-change="updateSeconds()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementSeconds()" ng-blur="blur()">\n      </td>\n      <td ng-show="showMeridian" class="uib-time am-pm"><button type="button" ng-class="{disabled: noToggleMeridian()}" class="btn btn-default text-center" ng-click="toggleMeridian()" ng-disabled="noToggleMeridian()" tabindex="{{::tabindex}}">{{meridian}}</button></td>\n    </tr>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td class="uib-decrement hours"><a ng-click="decrementHours()" ng-class="{disabled: noDecrementHours()}" class="btn btn-link" ng-disabled="noDecrementHours()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td>&nbsp;</td>\n      <td class="uib-decrement minutes"><a ng-click="decrementMinutes()" ng-class="{disabled: noDecrementMinutes()}" class="btn btn-link" ng-disabled="noDecrementMinutes()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td ng-show="showSeconds">&nbsp;</td>\n      <td ng-show="showSeconds" class="uib-decrement seconds"><a ng-click="decrementSeconds()" ng-class="{disabled: noDecrementSeconds()}" class="btn btn-link" ng-disabled="noDecrementSeconds()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("uib/template/typeahead/typeahead-match.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/typeahead/typeahead-match.html", '<a href\n   tabindex="-1"\n   ng-bind-html="match.label | uibTypeaheadHighlight:query"\n   ng-attr-title="{{match.label}}"></a>\n')
    }]), angular.module("uib/template/typeahead/typeahead-popup.html", []).run(["$templateCache", function(a) {
        a.put("uib/template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen() && !moveInProgress" ng-style="{top: position().top+\'px\', left: position().left+\'px\'}" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index, $event)" role="option" id="{{::match.id}}">\n        <div uib-typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')
    }]), angular.module("ui.bootstrap.carousel").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibCarouselCss && angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>'), angular.$$uibCarouselCss = !0
    }), angular.module("ui.bootstrap.datepicker").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}</style>'), angular.$$uibDatepickerCss = !0
    }), angular.module("ui.bootstrap.position").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'), angular.$$uibPositionCss = !0
    }), angular.module("ui.bootstrap.datepickerPopup").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerpopupCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}</style>'), angular.$$uibDatepickerpopupCss = !0
    }), angular.module("ui.bootstrap.tooltip").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibTooltipCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}</style>'), angular.$$uibTooltipCss = !0
    }), angular.module("ui.bootstrap.timepicker").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibTimepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-time input{width:50px;}</style>'), angular.$$uibTimepickerCss = !0
    }), angular.module("ui.bootstrap.typeahead").run(function() {
        !angular.$$csp().noInlineStyle && !angular.$$uibTypeaheadCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'), angular.$$uibTypeaheadCss = !0
    }), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.affix"),
                    f = "object" == typeof b && b;
                e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
            })
        }
        var c = function(b, d) {
            this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
        };
        c.VERSION = "3.3.6", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {
            offset: 0,
            target: window
        }, c.prototype.getState = function(a, b, c, d) {
            var e = this.$target.scrollTop(),
                f = this.$element.offset(),
                g = this.$target.height();
            if (null != c && "top" == this.affixed) return e < c && "top";
            if ("bottom" == this.affixed) return null != c ? !(e + this.unpin <= f.top) && "bottom" : !(e + g <= a - d) && "bottom";
            var h = null == this.affixed,
                i = h ? e : f.top,
                j = h ? g : b;
            return null != c && e <= c ? "top" : null != d && i + j >= a - d && "bottom"
        }, c.prototype.getPinnedOffset = function() {
            if (this.pinnedOffset) return this.pinnedOffset;
            this.$element.removeClass(c.RESET).addClass("affix");
            var a = this.$target.scrollTop(),
                b = this.$element.offset();
            return this.pinnedOffset = b.top - a
        }, c.prototype.checkPositionWithEventLoop = function() {
            setTimeout(a.proxy(this.checkPosition, this), 1)
        }, c.prototype.checkPosition = function() {
            if (this.$element.is(":visible")) {
                var b = this.$element.height(),
                    d = this.options.offset,
                    e = d.top,
                    f = d.bottom,
                    g = Math.max(a(document).height(), a(document.body).height());
                "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
                var h = this.getState(g, b, e, f);
                if (this.affixed != h) {
                    null != this.unpin && this.$element.css("top", "");
                    var i = "affix" + (h ? "-" + h : ""),
                        j = a.Event(i + ".bs.affix");
                    if (this.$element.trigger(j), j.isDefaultPrevented()) return;
                    this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
                }
                "bottom" == h && this.$element.offset({
                    top: g - b - f
                })
            }
        };
        var d = a.fn.affix;
        a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function() {
            return a.fn.affix = d, this
        }, a(window).on("load", function() {
            a('[data-spy="affix"]').each(function() {
                var c = a(this),
                    d = c.data();
                d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
            })
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var c = a(this),
                    e = c.data("bs.alert");
                e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
            })
        }
        var c = '[data-dismiss="alert"]',
            d = function(b) {
                a(b).on("click", c, this.close)
            };
        d.VERSION = "3.3.6", d.TRANSITION_DURATION = 150, d.prototype.close = function(b) {
            function c() {
                g.detach().trigger("closed.bs.alert").remove()
            }
            var e = a(this),
                f = e.attr("data-target");
            f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
            var g = a(f);
            b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
        };
        var e = a.fn.alert;
        a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function() {
            return a.fn.alert = e, this
        }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.button"),
                    f = "object" == typeof b && b;
                e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
            })
        }
        var c = function(b, d) {
            this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
        };
        c.VERSION = "3.3.6", c.DEFAULTS = {
            loadingText: "loading..."
        }, c.prototype.setState = function(b) {
            var c = "disabled",
                d = this.$element,
                e = d.is("input") ? "val" : "html",
                f = d.data();
            b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function() {
                d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
            }, this), 0)
        }, c.prototype.toggle = function() {
            var a = !0,
                b = this.$element.closest('[data-toggle="buttons"]');
            if (b.length) {
                var c = this.$element.find("input");
                "radio" == c.prop("type") ? (c.prop("checked") && (a = !1), b.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == c.prop("type") && (c.prop("checked") !== this.$element.hasClass("active") && (a = !1), this.$element.toggleClass("active")), c.prop("checked", this.$element.hasClass("active")), a && c.trigger("change")
            } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
        };
        var d = a.fn.button;
        a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function() {
            return a.fn.button = d, this
        }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(c) {
            var d = a(c.target);
            d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), a(c.target).is('input[type="radio"]') || a(c.target).is('input[type="checkbox"]') || c.preventDefault()
        }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(b) {
            a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.carousel"),
                    f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b),
                    g = "string" == typeof b ? b : f.slide;
                e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
            })
        }
        var c = function(b, c) {
            this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 600, c.DEFAULTS = {
            interval: 5e3,
            pause: "hover",
            wrap: !0,
            keyboard: !0
        }, c.prototype.keydown = function(a) {
            if (!/input|textarea/i.test(a.target.tagName)) {
                switch (a.which) {
                    case 37:
                        this.prev();
                        break;
                    case 39:
                        this.next();
                        break;
                    default:
                        return
                }
                a.preventDefault()
            }
        }, c.prototype.cycle = function(b) {
            return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
        }, c.prototype.getItemIndex = function(a) {
            return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
        }, c.prototype.getItemForDirection = function(a, b) {
            var c = this.getItemIndex(b),
                d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
            if (d && !this.options.wrap) return b;
            var e = "prev" == a ? -1 : 1,
                f = (c + e) % this.$items.length;
            return this.$items.eq(f)
        }, c.prototype.to = function(a) {
            var b = this,
                c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
            if (!(a > this.$items.length - 1 || a < 0)) return this.sliding ? this.$element.one("slid.bs.carousel", function() {
                b.to(a)
            }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
        }, c.prototype.pause = function(b) {
            return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
        }, c.prototype.next = function() {
            if (!this.sliding) return this.slide("next")
        }, c.prototype.prev = function() {
            if (!this.sliding) return this.slide("prev")
        }, c.prototype.slide = function(b, d) {
            var e = this.$element.find(".item.active"),
                f = d || this.getItemForDirection(b, e),
                g = this.interval,
                h = "next" == b ? "left" : "right",
                i = this;
            if (f.hasClass("active")) return this.sliding = !1;
            var j = f[0],
                k = a.Event("slide.bs.carousel", {
                    relatedTarget: j,
                    direction: h
                });
            if (this.$element.trigger(k), !k.isDefaultPrevented()) {
                if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
                    this.$indicators.find(".active").removeClass("active");
                    var l = a(this.$indicators.children()[this.getItemIndex(f)]);
                    l && l.addClass("active")
                }
                var m = a.Event("slid.bs.carousel", {
                    relatedTarget: j,
                    direction: h
                });
                return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function() {
                    f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function() {
                        i.$element.trigger(m)
                    }, 0)
                }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this
            }
        };
        var d = a.fn.carousel;
        a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function() {
            return a.fn.carousel = d, this
        };
        var e = function(c) {
            var d, e = a(this),
                f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
            if (f.hasClass("carousel")) {
                var g = a.extend({}, f.data(), e.data()),
                    h = e.attr("data-slide-to");
                h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
            }
        };
        a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function() {
            a('[data-ride="carousel"]').each(function() {
                var c = a(this);
                b.call(c, c.data())
            })
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
            return a(d)
        }

        function c(b) {
            return this.each(function() {
                var c = a(this),
                    e = c.data("bs.collapse"),
                    f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
                !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
            })
        }
        var d = function(b, c) {
            this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a('[data-toggle="collapse"][href="#' + b.id + '"],[data-toggle="collapse"][data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
        };
        d.VERSION = "3.3.6", d.TRANSITION_DURATION = 350, d.DEFAULTS = {
            toggle: !0
        }, d.prototype.dimension = function() {
            var a = this.$element.hasClass("width");
            return a ? "width" : "height"
        }, d.prototype.show = function() {
            if (!this.transitioning && !this.$element.hasClass("in")) {
                var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
                if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
                    var f = a.Event("show.bs.collapse");
                    if (this.$element.trigger(f), !f.isDefaultPrevented()) {
                        e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
                        var g = this.dimension();
                        this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                        var h = function() {
                            this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                        };
                        if (!a.support.transition) return h.call(this);
                        var i = a.camelCase(["scroll", g].join("-"));
                        this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                    }
                }
            }
        }, d.prototype.hide = function() {
            if (!this.transitioning && this.$element.hasClass("in")) {
                var b = a.Event("hide.bs.collapse");
                if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                    var c = this.dimension();
                    this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                    var e = function() {
                        this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                    };
                    return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this);
                }
            }
        }, d.prototype.toggle = function() {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }, d.prototype.getParent = function() {
            return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function(c, d) {
                var e = a(d);
                this.addAriaAndCollapsedClass(b(e), e)
            }, this)).end()
        }, d.prototype.addAriaAndCollapsedClass = function(a, b) {
            var c = a.hasClass("in");
            a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
        };
        var e = a.fn.collapse;
        a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function() {
            return a.fn.collapse = e, this
        }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(d) {
            var e = a(this);
            e.attr("data-target") || d.preventDefault();
            var f = b(e),
                g = f.data("bs.collapse"),
                h = g ? "toggle" : e.data();
            c.call(f, h)
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            var c = b.attr("data-target");
            c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
            var d = c && a(c);
            return d && d.length ? d : b.parent()
        }

        function c(c) {
            c && 3 === c.which || (a(e).remove(), a(f).each(function() {
                var d = a(this),
                    e = b(d),
                    f = {
                        relatedTarget: this
                    };
                e.hasClass("open") && (c && "click" == c.type && /input|textarea/i.test(c.target.tagName) && a.contains(e[0], c.target) || (e.trigger(c = a.Event("hide.bs.dropdown", f)), c.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger(a.Event("hidden.bs.dropdown", f)))))
            }))
        }

        function d(b) {
            return this.each(function() {
                var c = a(this),
                    d = c.data("bs.dropdown");
                d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
            })
        }
        var e = ".dropdown-backdrop",
            f = '[data-toggle="dropdown"]',
            g = function(b) {
                a(b).on("click.bs.dropdown", this.toggle)
            };
        g.VERSION = "3.3.6", g.prototype.toggle = function(d) {
            var e = a(this);
            if (!e.is(".disabled, :disabled")) {
                var f = b(e),
                    g = f.hasClass("open");
                if (c(), !g) {
                    "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", c);
                    var h = {
                        relatedTarget: this
                    };
                    if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;
                    e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger(a.Event("shown.bs.dropdown", h))
                }
                return !1
            }
        }, g.prototype.keydown = function(c) {
            if (/(38|40|27|32)/.test(c.which) && !/input|textarea/i.test(c.target.tagName)) {
                var d = a(this);
                if (c.preventDefault(), c.stopPropagation(), !d.is(".disabled, :disabled")) {
                    var e = b(d),
                        g = e.hasClass("open");
                    if (!g && 27 != c.which || g && 27 == c.which) return 27 == c.which && e.find(f).trigger("focus"), d.trigger("click");
                    var h = " li:not(.disabled):visible a",
                        i = e.find(".dropdown-menu" + h);
                    if (i.length) {
                        var j = i.index(c.target);
                        38 == c.which && j > 0 && j--, 40 == c.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                    }
                }
            }
        };
        var h = a.fn.dropdown;
        a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function() {
            return a.fn.dropdown = h, this
        }, a(document).on("click.bs.dropdown.data-api", c).on("click.bs.dropdown.data-api", ".dropdown form", function(a) {
            a.stopPropagation()
        }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", g.prototype.keydown)
    }(jQuery), + function(a) {
        "use strict";

        function b(b, d) {
            return this.each(function() {
                var e = a(this),
                    f = e.data("bs.modal"),
                    g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
                f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
            })
        }
        var c = function(b, c) {
            this.options = c, this.$body = a(document.body), this.$element = a(b), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
                this.$element.trigger("loaded.bs.modal")
            }, this))
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {
            backdrop: !0,
            keyboard: !0,
            show: !0
        }, c.prototype.toggle = function(a) {
            return this.isShown ? this.hide() : this.show(a)
        }, c.prototype.show = function(b) {
            var d = this,
                e = a.Event("show.bs.modal", {
                    relatedTarget: b
                });
            this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
                d.$element.one("mouseup.dismiss.bs.modal", function(b) {
                    a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0)
                })
            }), this.backdrop(function() {
                var e = a.support.transition && d.$element.hasClass("fade");
                d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in"), d.enforceFocus();
                var f = a.Event("shown.bs.modal", {
                    relatedTarget: b
                });
                e ? d.$dialog.one("bsTransitionEnd", function() {
                    d.$element.trigger("focus").trigger(f)
                }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
            }))
        }, c.prototype.hide = function(b) {
            b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
        }, c.prototype.enforceFocus = function() {
            a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
                this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
            }, this))
        }, c.prototype.escape = function() {
            this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function(a) {
                27 == a.which && this.hide()
            }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
        }, c.prototype.resize = function() {
            this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
        }, c.prototype.hideModal = function() {
            var a = this;
            this.$element.hide(), this.backdrop(function() {
                a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
            })
        }, c.prototype.removeBackdrop = function() {
            this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
        }, c.prototype.backdrop = function(b) {
            var d = this,
                e = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var f = a.support.transition && e;
                if (this.$backdrop = a(document.createElement("div")).addClass("modal-backdrop " + e).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function(a) {
                        return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                    }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
                f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                var g = function() {
                    d.removeBackdrop(), b && b()
                };
                a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
            } else b && b()
        }, c.prototype.handleUpdate = function() {
            this.adjustDialog()
        }, c.prototype.adjustDialog = function() {
            var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
            this.$element.css({
                paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
                paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
            })
        }, c.prototype.resetAdjustments = function() {
            this.$element.css({
                paddingLeft: "",
                paddingRight: ""
            })
        }, c.prototype.checkScrollbar = function() {
            var a = window.innerWidth;
            if (!a) {
                var b = document.documentElement.getBoundingClientRect();
                a = b.right - Math.abs(b.left)
            }
            this.bodyIsOverflowing = document.body.clientWidth < a, this.scrollbarWidth = this.measureScrollbar()
        }, c.prototype.setScrollbar = function() {
            var a = parseInt(this.$body.css("padding-right") || 0, 10);
            this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
        }, c.prototype.resetScrollbar = function() {
            this.$body.css("padding-right", this.originalBodyPad)
        }, c.prototype.measureScrollbar = function() {
            var a = document.createElement("div");
            a.className = "modal-scrollbar-measure", this.$body.append(a);
            var b = a.offsetWidth - a.clientWidth;
            return this.$body[0].removeChild(a), b
        };
        var d = a.fn.modal;
        a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function() {
            return a.fn.modal = d, this
        }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(c) {
            var d = a(this),
                e = d.attr("href"),
                f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
                g = f.data("bs.modal") ? "toggle" : a.extend({
                    remote: !/#/.test(e) && e
                }, f.data(), d.data());
            d.is("a") && c.preventDefault(), f.one("show.bs.modal", function(a) {
                a.isDefaultPrevented() || f.one("hidden.bs.modal", function() {
                    d.is(":visible") && d.trigger("focus")
                })
            }), b.call(f, g, this)
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.tooltip"),
                    f = "object" == typeof b && b;
                !e && /destroy|hide/.test(b) || (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
            })
        }
        var c = function(a, b) {
            this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", a, b)
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.DEFAULTS = {
            animation: !0,
            placement: "top",
            selector: !1,
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            container: !1,
            viewport: {
                selector: "body",
                padding: 0
            }
        }, c.prototype.init = function(b, c, d) {
            if (this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(a.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                    click: !1,
                    hover: !1,
                    focus: !1
                }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
            for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
                var g = e[f];
                if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
                else if ("manual" != g) {
                    var h = "hover" == g ? "mouseenter" : "focusin",
                        i = "hover" == g ? "mouseleave" : "focusout";
                    this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
                }
            }
            this.options.selector ? this._options = a.extend({}, this.options, {
                trigger: "manual",
                selector: ""
            }) : this.fixTitle()
        }, c.prototype.getDefaults = function() {
            return c.DEFAULTS
        }, c.prototype.getOptions = function(b) {
            return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {
                show: b.delay,
                hide: b.delay
            }), b
        }, c.prototype.getDelegateOptions = function() {
            var b = {},
                c = this.getDefaults();
            return this._options && a.each(this._options, function(a, d) {
                c[a] != d && (b[a] = d)
            }), b
        }, c.prototype.enter = function(b) {
            var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
            return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusin" == b.type ? "focus" : "hover"] = !0), c.tip().hasClass("in") || "in" == c.hoverState ? void(c.hoverState = "in") : (clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function() {
                "in" == c.hoverState && c.show()
            }, c.options.delay.show)) : c.show())
        }, c.prototype.isInStateTrue = function() {
            for (var a in this.inState)
                if (this.inState[a]) return !0;
            return !1
        }, c.prototype.leave = function(b) {
            var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
            if (c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusout" == b.type ? "focus" : "hover"] = !1), !c.isInStateTrue()) return clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function() {
                "out" == c.hoverState && c.hide()
            }, c.options.delay.hide)) : c.hide()
        }, c.prototype.show = function() {
            var b = a.Event("show.bs." + this.type);
            if (this.hasContent() && this.enabled) {
                this.$element.trigger(b);
                var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                if (b.isDefaultPrevented() || !d) return;
                var e = this,
                    f = this.tip(),
                    g = this.getUID(this.type);
                this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
                var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement,
                    i = /\s?auto?\s?/i,
                    j = i.test(h);
                j && (h = h.replace(i, "") || "top"), f.detach().css({
                    top: 0,
                    left: 0,
                    display: "block"
                }).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
                var k = this.getPosition(),
                    l = f[0].offsetWidth,
                    m = f[0].offsetHeight;
                if (j) {
                    var n = h,
                        o = this.getPosition(this.$viewport);
                    h = "bottom" == h && k.bottom + m > o.bottom ? "top" : "top" == h && k.top - m < o.top ? "bottom" : "right" == h && k.right + l > o.width ? "left" : "left" == h && k.left - l < o.left ? "right" : h, f.removeClass(n).addClass(h)
                }
                var p = this.getCalculatedOffset(h, k, l, m);
                this.applyPlacement(p, h);
                var q = function() {
                    var a = e.hoverState;
                    e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
                };
                a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", q).emulateTransitionEnd(c.TRANSITION_DURATION) : q()
            }
        }, c.prototype.applyPlacement = function(b, c) {
            var d = this.tip(),
                e = d[0].offsetWidth,
                f = d[0].offsetHeight,
                g = parseInt(d.css("margin-top"), 10),
                h = parseInt(d.css("margin-left"), 10);
            isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top += g, b.left += h, a.offset.setOffset(d[0], a.extend({
                using: function(a) {
                    d.css({
                        top: Math.round(a.top),
                        left: Math.round(a.left)
                    })
                }
            }, b), 0), d.addClass("in");
            var i = d[0].offsetWidth,
                j = d[0].offsetHeight;
            "top" == c && j != f && (b.top = b.top + f - j);
            var k = this.getViewportAdjustedDelta(c, b, i, j);
            k.left ? b.left += k.left : b.top += k.top;
            var l = /top|bottom/.test(c),
                m = l ? 2 * k.left - e + i : 2 * k.top - f + j,
                n = l ? "offsetWidth" : "offsetHeight";
            d.offset(b), this.replaceArrow(m, d[0][n], l)
        }, c.prototype.replaceArrow = function(a, b, c) {
            this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
        }, c.prototype.setContent = function() {
            var a = this.tip(),
                b = this.getTitle();
            a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
        }, c.prototype.hide = function(b) {
            function d() {
                "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
            }
            var e = this,
                f = a(this.$tip),
                g = a.Event("hide.bs." + this.type);
            if (this.$element.trigger(g), !g.isDefaultPrevented()) return f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this
        }, c.prototype.fixTitle = function() {
            var a = this.$element;
            (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
        }, c.prototype.hasContent = function() {
            return this.getTitle()
        }, c.prototype.getPosition = function(b) {
            b = b || this.$element;
            var c = b[0],
                d = "BODY" == c.tagName,
                e = c.getBoundingClientRect();
            null == e.width && (e = a.extend({}, e, {
                width: e.right - e.left,
                height: e.bottom - e.top
            }));
            var f = d ? {
                    top: 0,
                    left: 0
                } : b.offset(),
                g = {
                    scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()
                },
                h = d ? {
                    width: a(window).width(),
                    height: a(window).height()
                } : null;
            return a.extend({}, e, g, h, f)
        }, c.prototype.getCalculatedOffset = function(a, b, c, d) {
            return "bottom" == a ? {
                top: b.top + b.height,
                left: b.left + b.width / 2 - c / 2
            } : "top" == a ? {
                top: b.top - d,
                left: b.left + b.width / 2 - c / 2
            } : "left" == a ? {
                top: b.top + b.height / 2 - d / 2,
                left: b.left - c
            } : {
                top: b.top + b.height / 2 - d / 2,
                left: b.left + b.width
            }
        }, c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
            var e = {
                top: 0,
                left: 0
            };
            if (!this.$viewport) return e;
            var f = this.options.viewport && this.options.viewport.padding || 0,
                g = this.getPosition(this.$viewport);
            if (/right|left/.test(a)) {
                var h = b.top - f - g.scroll,
                    i = b.top + f - g.scroll + d;
                h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
            } else {
                var j = b.left - f,
                    k = b.left + f + c;
                j < g.left ? e.left = g.left - j : k > g.right && (e.left = g.left + g.width - k)
            }
            return e
        }, c.prototype.getTitle = function() {
            var a, b = this.$element,
                c = this.options;
            return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
        }, c.prototype.getUID = function(a) {
            do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
            return a
        }, c.prototype.tip = function() {
            if (!this.$tip && (this.$tip = a(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
            return this.$tip
        }, c.prototype.arrow = function() {
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        }, c.prototype.enable = function() {
            this.enabled = !0
        }, c.prototype.disable = function() {
            this.enabled = !1
        }, c.prototype.toggleEnabled = function() {
            this.enabled = !this.enabled
        }, c.prototype.toggle = function(b) {
            var c = this;
            b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), b ? (c.inState.click = !c.inState.click, c.isInStateTrue() ? c.enter(c) : c.leave(c)) : c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
        }, c.prototype.destroy = function() {
            var a = this;
            clearTimeout(this.timeout), this.hide(function() {
                a.$element.off("." + a.type).removeData("bs." + a.type), a.$tip && a.$tip.detach(), a.$tip = null, a.$arrow = null, a.$viewport = null
            })
        };
        var d = a.fn.tooltip;
        a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function() {
            return a.fn.tooltip = d, this
        }
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.popover"),
                    f = "object" == typeof b && b;
                !e && /destroy|hide/.test(b) || (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
            })
        }
        var c = function(a, b) {
            this.init("popover", a, b)
        };
        if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
        c.VERSION = "3.3.6", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        }), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function() {
            return c.DEFAULTS
        }, c.prototype.setContent = function() {
            var a = this.tip(),
                b = this.getTitle(),
                c = this.getContent();
            a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
        }, c.prototype.hasContent = function() {
            return this.getTitle() || this.getContent()
        }, c.prototype.getContent = function() {
            var a = this.$element,
                b = this.options;
            return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
        }, c.prototype.arrow = function() {
            return this.$arrow = this.$arrow || this.tip().find(".arrow")
        };
        var d = a.fn.popover;
        a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function() {
            return a.fn.popover = d, this
        }
    }(jQuery), + function(a) {
        "use strict";

        function b(c, d) {
            this.$body = a(document.body), this.$scrollElement = a(a(c).is(document.body) ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", a.proxy(this.process, this)), this.refresh(), this.process()
        }

        function c(c) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.scrollspy"),
                    f = "object" == typeof c && c;
                e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
            })
        }
        b.VERSION = "3.3.6", b.DEFAULTS = {
            offset: 10
        }, b.prototype.getScrollHeight = function() {
            return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
        }, b.prototype.refresh = function() {
            var b = this,
                c = "offset",
                d = 0;
            this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), a.isWindow(this.$scrollElement[0]) || (c = "position", d = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function() {
                var b = a(this),
                    e = b.data("target") || b.attr("href"),
                    f = /^#./.test(e) && a(e);
                return f && f.length && f.is(":visible") && [
                    [f[c]().top + d, e]
                ] || null
            }).sort(function(a, b) {
                return a[0] - b[0]
            }).each(function() {
                b.offsets.push(this[0]), b.targets.push(this[1])
            })
        }, b.prototype.process = function() {
            var a, b = this.$scrollElement.scrollTop() + this.options.offset,
                c = this.getScrollHeight(),
                d = this.options.offset + c - this.$scrollElement.height(),
                e = this.offsets,
                f = this.targets,
                g = this.activeTarget;
            if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
            if (g && b < e[0]) return this.activeTarget = null, this.clear();
            for (a = e.length; a--;) g != f[a] && b >= e[a] && (void 0 === e[a + 1] || b < e[a + 1]) && this.activate(f[a])
        }, b.prototype.activate = function(b) {
            this.activeTarget = b, this.clear();
            var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
                d = a(c).parents("li").addClass("active");
            d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
        }, b.prototype.clear = function() {
            a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
        };
        var d = a.fn.scrollspy;
        a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function() {
            return a.fn.scrollspy = d, this
        }, a(window).on("load.bs.scrollspy.data-api", function() {
            a('[data-spy="scroll"]').each(function() {
                var b = a(this);
                c.call(b, b.data())
            })
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.tab");
                e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
            })
        }
        var c = function(b) {
            this.element = a(b)
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.prototype.show = function() {
            var b = this.element,
                c = b.closest("ul:not(.dropdown-menu)"),
                d = b.data("target");
            if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
                var e = c.find(".active:last a"),
                    f = a.Event("hide.bs.tab", {
                        relatedTarget: b[0]
                    }),
                    g = a.Event("show.bs.tab", {
                        relatedTarget: e[0]
                    });
                if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                    var h = a(d);
                    this.activate(b.closest("li"), c), this.activate(h, h.parent(), function() {
                        e.trigger({
                            type: "hidden.bs.tab",
                            relatedTarget: b[0]
                        }), b.trigger({
                            type: "shown.bs.tab",
                            relatedTarget: e[0]
                        })
                    })
                }
            }
        }, c.prototype.activate = function(b, d, e) {
            function f() {
                g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu").length && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
            }
            var g = d.find("> .active"),
                h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
            g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
        };
        var d = a.fn.tab;
        a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function() {
            return a.fn.tab = d, this
        };
        var e = function(c) {
            c.preventDefault(), b.call(a(this), "show")
        };
        a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
    }(jQuery), + function(a) {
        "use strict";

        function b() {
            var a = document.createElement("bootstrap"),
                b = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                };
            for (var c in b)
                if (void 0 !== a.style[c]) return {
                    end: b[c]
                };
            return !1
        }
        a.fn.emulateTransitionEnd = function(b) {
            var c = !1,
                d = this;
            a(this).one("bsTransitionEnd", function() {
                c = !0
            });
            var e = function() {
                c || a(d).trigger(a.support.transition.end)
            };
            return setTimeout(e, b), this
        }, a(function() {
            a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
                bindType: a.support.transition.end,
                delegateType: a.support.transition.end,
                handle: function(b) {
                    if (a(b.target).is(this)) return b.handleObj.handler.apply(this, arguments)
                }
            })
        })
    }(jQuery);