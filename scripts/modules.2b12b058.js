! function(a, b) {
    "use strict";

    function c() {
        function a(a, c) {
            return b.extend(Object.create(a), c)
        }

        function c(a, b) {
            var c = b.caseInsensitiveMatch,
                d = {
                    originalPath: a,
                    regexp: a
                },
                e = d.keys = [];
            return a = a.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function(a, b, c, d) {
                var f = "?" === d || "*?" === d ? "?" : null,
                    g = "*" === d || "*?" === d ? "*" : null;
                return e.push({
                    name: c,
                    optional: !!f
                }), b = b || "", "" + (f ? "" : b) + "(?:" + (f ? b : "") + (g && "(.+?)" || "([^/]+)") + (f || "") + ")" + (f || "")
            }).replace(/([\/$\*])/g, "\\$1"), d.regexp = new RegExp("^" + a + "$", c ? "i" : ""), d
        }
        var d = {};
        this.when = function(a, e) {
            var f = b.copy(e);
            if (b.isUndefined(f.reloadOnSearch) && (f.reloadOnSearch = !0), b.isUndefined(f.caseInsensitiveMatch) && (f.caseInsensitiveMatch = this.caseInsensitiveMatch), d[a] = b.extend(f, a && c(a, f)), a) {
                var g = "/" == a[a.length - 1] ? a.substr(0, a.length - 1) : a + "/";
                d[g] = b.extend({
                    redirectTo: a
                }, c(g, f))
            }
            return this
        }, this.caseInsensitiveMatch = !1, this.otherwise = function(a) {
            return "string" == typeof a && (a = {
                redirectTo: a
            }), this.when(null, a), this
        }, this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$templateRequest", "$sce", function(c, e, f, g, i, j, k) {
            function l(a, b) {
                var c = b.keys,
                    d = {};
                if (!b.regexp) return null;
                var e = b.regexp.exec(a);
                if (!e) return null;
                for (var f = 1, g = e.length; f < g; ++f) {
                    var h = c[f - 1],
                        i = e[f];
                    h && i && (d[h.name] = i)
                }
                return d
            }

            function m(a) {
                var d = t.current;
                q = o(), r = q && d && q.$$route === d.$$route && b.equals(q.pathParams, d.pathParams) && !q.reloadOnSearch && !s, r || !d && !q || c.$broadcast("$routeChangeStart", q, d).defaultPrevented && a && a.preventDefault()
            }

            function n() {
                var a = t.current,
                    d = q;
                r ? (a.params = d.params, b.copy(a.params, f), c.$broadcast("$routeUpdate", a)) : (d || a) && (s = !1, t.current = d, d && d.redirectTo && (b.isString(d.redirectTo) ? e.path(p(d.redirectTo, d.params)).search(d.params).replace() : e.url(d.redirectTo(d.pathParams, e.path(), e.search())).replace()), g.when(d).then(function() {
                    if (d) {
                        var a, c, e = b.extend({}, d.resolve);
                        return b.forEach(e, function(a, c) {
                            e[c] = b.isString(a) ? i.get(a) : i.invoke(a, null, null, c)
                        }), b.isDefined(a = d.template) ? b.isFunction(a) && (a = a(d.params)) : b.isDefined(c = d.templateUrl) && (b.isFunction(c) && (c = c(d.params)), b.isDefined(c) && (d.loadedTemplateUrl = k.valueOf(c), a = j(c))), b.isDefined(a) && (e.$template = a), g.all(e)
                    }
                }).then(function(e) {
                    d == t.current && (d && (d.locals = e, b.copy(d.params, f)), c.$broadcast("$routeChangeSuccess", d, a))
                }, function(b) {
                    d == t.current && c.$broadcast("$routeChangeError", d, a, b)
                }))
            }

            function o() {
                var c, f;
                return b.forEach(d, function(d, g) {
                    !f && (c = l(e.path(), d)) && (f = a(d, {
                        params: b.extend({}, e.search(), c),
                        pathParams: c
                    }), f.$$route = d)
                }), f || d[null] && a(d[null], {
                    params: {},
                    pathParams: {}
                })
            }

            function p(a, c) {
                var d = [];
                return b.forEach((a || "").split(":"), function(a, b) {
                    if (0 === b) d.push(a);
                    else {
                        var e = a.match(/(\w+)(?:[?*])?(.*)/),
                            f = e[1];
                        d.push(c[f]), d.push(e[2] || ""), delete c[f]
                    }
                }), d.join("")
            }
            var q, r, s = !1,
                t = {
                    routes: d,
                    reload: function() {
                        s = !0;
                        var a = {
                            defaultPrevented: !1,
                            preventDefault: function() {
                                this.defaultPrevented = !0, s = !1
                            }
                        };
                        c.$evalAsync(function() {
                            m(a), a.defaultPrevented || n()
                        })
                    },
                    updateParams: function(a) {
                        if (!this.current || !this.current.$$route) throw h("norout", "Tried updating route when with no current route");
                        a = b.extend({}, this.current.params, a), e.path(p(this.current.$$route.originalPath, a)), e.search(a)
                    }
                };
            return c.$on("$locationChangeStart", m), c.$on("$locationChangeSuccess", n), t
        }]
    }

    function d() {
        this.$get = function() {
            return {}
        }
    }

    function e(a, c, d) {
        return {
            restrict: "ECA",
            terminal: !0,
            priority: 400,
            transclude: "element",
            link: function(e, f, g, h, i) {
                function j() {
                    n && (d.cancel(n), n = null), l && (l.$destroy(), l = null), m && (n = d.leave(m), n.then(function() {
                        n = null
                    }), m = null)
                }

                function k() {
                    var g = a.current && a.current.locals,
                        h = g && g.$template;
                    if (b.isDefined(h)) {
                        var k = e.$new(),
                            n = a.current,
                            q = i(k, function(a) {
                                d.enter(a, null, m || f).then(function() {
                                    !b.isDefined(o) || o && !e.$eval(o) || c()
                                }), j()
                            });
                        m = q, l = n.scope = k, l.$emit("$viewContentLoaded"), l.$eval(p)
                    } else j()
                }
                var l, m, n, o = g.autoscroll,
                    p = g.onload || "";
                e.$on("$routeChangeSuccess", k), k()
            }
        }
    }

    function f(a, b, c) {
        return {
            restrict: "ECA",
            priority: -400,
            link: function(d, e) {
                var f = c.current,
                    g = f.locals;
                e.html(g.$template);
                var h = a(e.contents());
                if (f.controller) {
                    g.$scope = d;
                    var i = b(f.controller, g);
                    f.controllerAs && (d[f.controllerAs] = i), e.data("$ngControllerController", i), e.children().data("$ngControllerController", i)
                }
                d[f.resolveAs || "$resolve"] = g, h(d)
            }
        }
    }
    var g = b.module("ngRoute", ["ng"]).provider("$route", c),
        h = b.$$minErr("ngRoute");
    g.provider("$routeParams", d), g.directive("ngView", e), g.directive("ngView", f), e.$inject = ["$route", "$anchorScroll", "$animate"], f.$inject = ["$compile", "$controller", "$route"]
}(window, window.angular),
function(a) {
    var b = a.module("route-segment", []);
    b.provider("$routeSegment", ["$routeProvider", function c(b) {
        function d(a) {
            return a.replace(/([\:\-\_]+(.))/g, function(a, b, c, d) {
                return d ? c.toUpperCase() : c
            })
        }

        function e(a, b) {
            if (!a) throw new Error("Invalid pointer segment");
            var c;
            return {
                segment: function(b, e) {
                    return a[d(b)] = {
                        name: b,
                        params: e
                    }, c = b, this
                },
                within: function(b) {
                    var g;
                    if (b = b || c, g = a[d(b)]) void 0 == g.children && (g.children = {});
                    else {
                        if (f.strictMode) throw new Error("Cannot get into unknown `" + b + "` segment");
                        g = a[d(b)] = {
                            params: {},
                            children: {}
                        }
                    }
                    return e(g.children, this)
                },
                up: function() {
                    return b
                },
                root: function() {
                    return h
                }
            }
        }
        var c = this,
            f = c.options = {
                autoLoadTemplates: !0,
                strictMode: !1
            },
            g = this.segments = {},
            h = e(g, null),
            i = {};
        c.when = function(a, c, d) {
            return void 0 == d && (d = {}), d.segment = c, b.when(a, d), i[c] = a, this
        }, a.extend(c, h), this.$get = ["$rootScope", "$q", "$http", "$templateCache", "$route", "$routeParams", "$injector", function(b, c, e, h, j, k, l) {
            function m(b) {
                var c = !1;
                return b.params.dependencies && a.forEach(b.params.dependencies, function(b) {
                    a.equals(r.$routeParams[b], k[b]) || (c = !0)
                }), c
            }

            function n(a, b) {
                return r.chain[a] && r.chain[a].clearWatcher && r.chain[a].clearWatcher(), b ? (s[a] = b.name, b.params.untilResolved ? o(a, b.name, b.params.untilResolved).then(function(c) {
                    return void 0 != c.success && p(a), o(a, b.name, b.params)
                }) : o(a, b.name, b.params)) : (s[a] = null, void p(a))
            }

            function o(d, g, i) {
                var j = a.extend({}, i.resolve);
                return a.forEach(j, function(b, c) {
                    j[c] = a.isString(b) ? l.get(b) : l.invoke(b)
                }), i.template && (j.$template = i.template, a.isFunction(j.$template) && (j.$template = l.invoke(j.$template))), f.autoLoadTemplates && i.templateUrl && (j.$template = i.templateUrl, a.isFunction(j.$template) && (j.$template = l.invoke(j.$template)), j.$template = e.get(j.$template, {
                    cache: h
                }).then(function(a) {
                    return a.data
                })), c.all(j).then(function(e) {
                    if (s[d] != g) return c.reject();
                    if (r.chain[d] = {
                            name: g,
                            params: i,
                            locals: e,
                            reload: function() {
                                var a = q(d, r.name.split("."));
                                n(d, a).then(function(a) {
                                    void 0 != a.success && p(d)
                                })
                            }
                        }, i.watcher) {
                        var f = function() {
                                if (!a.isFunction(i.watcher) && !a.isArray(i.watcher)) throw new Error("Watcher is not a function in segment `" + g + "`");
                                return l.invoke(i.watcher, {}, {
                                    segment: r.chain[d]
                                })
                            },
                            h = f();
                        r.chain[d].clearWatcher = b.$watch(f, function(a) {
                            a != h && (h = a, r.chain[d].reload())
                        })
                    }
                    return {
                        success: d
                    }
                }, function(b) {
                    if (i.resolveFailed) {
                        var e = {
                            error: function() {
                                return c.when(b)
                            }
                        };
                        return o(d, g, a.extend({
                            resolve: e
                        }, i.resolveFailed))
                    }
                    throw new Error("Resolving failed with a reason `" + b + "`, but no `resolveFailed` provided for segment `" + g + "`")
                })
            }

            function p(c) {
                r.$routeParams = a.copy(k), r.name = "";
                for (var d = 0; d < r.chain.length; d++) r.chain[d] && (r.name += r.chain[d].name + ".");
                r.name = r.name.substr(0, r.name.length - 1), b.$broadcast("routeSegmentChange", {
                    index: c,
                    segment: r.chain[c] || null
                })
            }

            function q(a, b) {
                if (!b) return null;
                if (a >= b.length) return null;
                for (var c, e = g, f = 0; f <= a; f++) c = b[f], void 0 != e[d(c)] && (e = e[d(c)]), f < a && (e = e.children);
                return {
                    name: c,
                    params: e.params,
                    children: e.children
                }
            }
            var r = {
                    name: "",
                    $routeParams: a.copy(k),
                    chain: [],
                    startsWith: function(a) {
                        var b = new RegExp("^" + a);
                        return b.test(r.name)
                    },
                    contains: function(a) {
                        for (var b = 0; b < this.chain.length; b++)
                            if (this.chain[b] && this.chain[b].name == a) return !0;
                        return !1
                    },
                    getSegmentUrl: function(b, c) {
                        var d, e, f;
                        if (!i[b]) throw new Error("Can not get URL for segment with name `" + b + "`");
                        c = a.extend({}, k, c || {}), d = i[b];
                        for (e in c) {
                            var g = new RegExp(":" + e + "[*?]?", "g");
                            d = d.replace(g, c[e])
                        }
                        if (d = d.replace(/\/\:.*?\?/g, ""), f = d.match(/\/\:([^\/]*)/)) throw new Error("Route param `" + f[1] + "` is not specified for route `" + i[b] + "`");
                        return d
                    }
                },
                s = {};
            return b.$on("$routeChangeSuccess", function(a, b) {
                var d = b.$route || b.$$route;
                if (d && d.segment) {
                    for (var e = d.segment, f = e.split("."), g = [], h = -1, i = 0; i < f.length; i++) {
                        var j = q(i, f);
                        (s[i] != j.name || g.length > 0 || m(j)) && (r.chain[i] && r.chain[i].name == j.name && 0 == g.length && !m(j) ? s[i] = j.name : (g.push({
                            index: i,
                            newSegment: j
                        }), h = i))
                    }
                    var k = c.when();
                    if (g.length > 0)
                        for (var i = 0; i < g.length; i++) ! function(a) {
                            k = k.then(function() {
                                return n(g[a].index, g[a].newSegment)
                            }).then(function(b) {
                                if (void 0 != b.success) {
                                    p(b.success);
                                    for (var c = g[a].index + 1; c < r.chain.length; c++) r.chain[c] && (r.chain[c].clearWatcher && r.chain[c].clearWatcher(), r.chain[c] = null, n(c, null))
                                }
                            })
                        }(i);
                    k.then(function() {
                        if (r.chain.length > f.length) {
                            var a = r.chain.length,
                                b = r.chain.length - f.length;
                            r.chain.splice(-b, b);
                            for (var c = f.length; c < a; c++) n(c, null), h = r.chain.length - 1
                        }
                    }).then(function() {
                        var a = c.when();
                        if (h == r.chain.length - 1)
                            for (var b = q(h, r.name.split(".")); b;) {
                                var d = b.children,
                                    e = h + 1;
                                b = null;
                                for (var f in d) ! function(c, d, e) {
                                    d[c].params["default"] && (a = a.then(function() {
                                        return n(e, {
                                            name: d[c].name,
                                            params: d[c].params
                                        }).then(function(a) {
                                            a.success && p(a.success)
                                        })
                                    }), b = d[c], h = e)
                                }(f, d, e)
                            }
                        return a
                    })
                }
            }), r
        }]
    }]), b.filter("routeSegmentUrl", ["$routeSegment", function(a) {
        var b = function(b, c) {
            return a.getSegmentUrl(b, c)
        };
        return b.$stateful = !0, b
    }]), b.filter("routeSegmentEqualsTo", ["$routeSegment", function(a) {
        var b = function(b) {
            return a.name == b
        };
        return b.$stateful = !0, b
    }]), b.filter("routeSegmentStartsWith", ["$routeSegment", function(a) {
        var b = function(b) {
            return a.startsWith(b)
        };
        return b.$stateful = !0, b
    }]), b.filter("routeSegmentContains", ["$routeSegment", function(a) {
        var b = function(b) {
            return a.contains(b)
        };
        return b.$stateful = !0, b
    }]), b.filter("routeSegmentParam", ["$routeSegment", function(a) {
        var b = function(b) {
            return a.$routeParams[b]
        };
        return b.$stateful = !0, b
    }])
}(angular),
function(a) {
    a.module("view-segment", ["route-segment"]).directive("appViewSegment", ["$route", "$compile", "$controller", "$routeParams", "$routeSegment", "$q", "$injector", "$timeout", "$animate", function(a, b, c, d, e, f, g, h, i) {
        return {
            restrict: "ECA",
            priority: 400,
            transclude: "element",
            compile: function(a, b) {
                return function(a, c, d, f, g) {
                    function j() {
                        o && (i.cancel(o), o = null), l && (l.$destroy(), l = null), m && (o = i.leave(m), o && o.then(function() {
                            o = null
                        }), m = null)
                    }

                    function k(b) {
                        p = b;
                        var d = a.$new(),
                            e = g(d, function(a) {
                                b && a.data("viewSegment", b), i.enter(a, null, m || c), j()
                            });
                        m = e, l = d, l.$emit("$viewContentLoaded"), l.$eval(q)
                    }
                    var l, m, n, o, p = {},
                        q = b.onload || "",
                        r = parseInt(b.appViewSegment);
                    e.chain[r] ? n = h(function() {
                        k(e.chain[r])
                    }, 0) : k(), a.$on("routeSegmentChange", function(a, b) {
                        n && h.cancel(n), b.index == r && p != b.segment && k(b.segment)
                    })
                }
            }
        }
    }]), a.module("view-segment").directive("appViewSegment", ["$route", "$compile", "$controller", function(b, c, d) {
        return {
            restrict: "ECA",
            priority: -400,
            link: function(b, e) {
                var f = e.data("viewSegment") || {},
                    g = a.extend({}, f.locals),
                    h = g && g.$template;
                h && e.html(h);
                var i = c(e.contents());
                if (f.params && f.params.controller) {
                    g.$scope = b;
                    var j = d(f.params.controller, g);
                    f.params.controllerAs && (b[f.params.controllerAs] = j), e.data("$ngControllerController", j), e.children().data("$ngControllerController", j)
                }
                i(b)
            }
        }
    }])
}(angular),
function(a, b) {
    "use strict";

    function c(a) {
        return null != a && "" !== a && "hasOwnProperty" !== a && g.test("." + a)
    }

    function d(a, d) {
        if (!c(d)) throw f("badmember", 'Dotted member path "@{0}" is invalid.', d);
        for (var e = d.split("."), g = 0, h = e.length; g < h && b.isDefined(a); g++) {
            var i = e[g];
            a = null !== a ? a[i] : void 0
        }
        return a
    }

    function e(a, c) {
        c = c || {}, b.forEach(c, function(a, b) {
            delete c[b]
        });
        for (var d in a) !a.hasOwnProperty(d) || "$" === d.charAt(0) && "$" === d.charAt(1) || (c[d] = a[d]);
        return c
    }
    var f = b.$$minErr("$resource"),
        g = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;
    b.module("ngResource", ["ng"]).provider("$resource", function() {
        var a = /^https?:\/\/[^\/]*/,
            c = this;
        this.defaults = {
            stripTrailingSlashes: !0,
            cancellable: !1,
            actions: {
                get: {
                    method: "GET"
                },
                save: {
                    method: "POST"
                },
                query: {
                    method: "GET",
                    isArray: !0
                },
                remove: {
                    method: "DELETE"
                },
                "delete": {
                    method: "DELETE"
                }
            }
        }, this.$get = ["$http", "$log", "$q", "$timeout", function(g, h, i, j) {
            function k(a) {
                return l(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
            }

            function l(a, b) {
                return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, b ? "%20" : "+")
            }

            function m(a, b) {
                this.template = a, this.defaults = q({}, c.defaults, b), this.urlParams = {}
            }

            function n(a, k, l, t) {
                function u(a, b) {
                    var c = {};
                    return b = q({}, k, b), p(b, function(b, e) {
                        s(b) && (b = b(a)), c[e] = b && b.charAt && "@" === b.charAt(0) ? d(a, b.substr(1)) : b
                    }), c
                }

                function v(a) {
                    return a.resource
                }

                function w(a) {
                    e(a || {}, this)
                }
                var x = new m(a, t);
                return l = q({}, c.defaults.actions, l), w.prototype.toJSON = function() {
                    var a = q({}, this);
                    return delete a.$promise, delete a.$resolved, a
                }, p(l, function(a, d) {
                    var k = /^(POST|PUT|PATCH)$/i.test(a.method),
                        l = a.timeout,
                        m = b.isDefined(a.cancellable) ? a.cancellable : t && b.isDefined(t.cancellable) ? t.cancellable : c.defaults.cancellable;
                    l && !b.isNumber(l) && (h.debug("ngResource:\n  Only numeric values are allowed as `timeout`.\n  Promises are not supported in $resource, because the same value would be used for multiple requests. If you are looking for a way to cancel requests, you should use the `cancellable` option."), delete a.timeout, l = null), w[d] = function(c, h, n, t) {
                        var y, z, A, B = {};
                        switch (arguments.length) {
                            case 4:
                                A = t, z = n;
                            case 3:
                            case 2:
                                if (!s(h)) {
                                    B = c, y = h, z = n;
                                    break
                                }
                                if (s(c)) {
                                    z = c, A = h;
                                    break
                                }
                                z = h, A = n;
                            case 1:
                                s(c) ? z = c : k ? y = c : B = c;
                                break;
                            case 0:
                                break;
                            default:
                                throw f("badargs", "Expected up to 4 arguments [params, data, success, error], got {0} arguments", arguments.length)
                        }
                        var C, D, E = this instanceof w,
                            F = E ? y : a.isArray ? [] : new w(y),
                            G = {},
                            H = a.interceptor && a.interceptor.response || v,
                            I = a.interceptor && a.interceptor.responseError || void 0;
                        p(a, function(a, b) {
                            switch (b) {
                                default:
                                    G[b] = r(a);
                                    break;
                                case "params":
                                case "isArray":
                                case "interceptor":
                                case "cancellable":
                            }
                        }), !E && m && (C = i.defer(), G.timeout = C.promise, l && (D = j(C.resolve, l))), k && (G.data = y), x.setUrlParams(G, q({}, u(y, a.params || {}), B), a.url);
                        var J = g(G).then(function(c) {
                            var g = c.data;
                            if (g) {
                                if (b.isArray(g) !== !!a.isArray) throw f("badcfg", "Error in resource configuration for action `{0}`. Expected response to contain an {1} but got an {2} (Request: {3} {4})", d, a.isArray ? "array" : "object", b.isArray(g) ? "array" : "object", G.method, G.url);
                                if (a.isArray) F.length = 0, p(g, function(a) {
                                    "object" == typeof a ? F.push(new w(a)) : F.push(a)
                                });
                                else {
                                    var h = F.$promise;
                                    e(g, F), F.$promise = h
                                }
                            }
                            return c.resource = F, c
                        }, function(a) {
                            return (A || o)(a), i.reject(a)
                        });
                        return J["finally"](function() {
                            F.$resolved = !0, !E && m && (F.$cancelRequest = b.noop, j.cancel(D), C = D = G.timeout = null)
                        }), J = J.then(function(a) {
                            var b = H(a);
                            return (z || o)(b, a.headers), b
                        }, I), E ? J : (F.$promise = J, F.$resolved = !1, m && (F.$cancelRequest = C.resolve), F)
                    }, w.prototype["$" + d] = function(a, b, c) {
                        s(a) && (c = b, b = a, a = {});
                        var e = w[d].call(this, a, this, b, c);
                        return e.$promise || e
                    }
                }), w.bind = function(b) {
                    return n(a, q({}, k, b), l)
                }, w
            }
            var o = b.noop,
                p = b.forEach,
                q = b.extend,
                r = b.copy,
                s = b.isFunction;
            return m.prototype = {
                setUrlParams: function(c, d, e) {
                    var g, h, i = this,
                        j = e || i.template,
                        m = "",
                        n = i.urlParams = {};
                    p(j.split(/\W/), function(a) {
                        if ("hasOwnProperty" === a) throw f("badname", "hasOwnProperty is not a valid parameter name.");
                        !new RegExp("^\\d+$").test(a) && a && new RegExp("(^|[^\\\\]):" + a + "(\\W|$)").test(j) && (n[a] = {
                            isQueryParamValue: new RegExp("\\?.*=:" + a + "(?:\\W|$)").test(j)
                        })
                    }), j = j.replace(/\\:/g, ":"), j = j.replace(a, function(a) {
                        return m = a, ""
                    }), d = d || {}, p(i.urlParams, function(a, c) {
                        g = d.hasOwnProperty(c) ? d[c] : i.defaults[c], b.isDefined(g) && null !== g ? (h = a.isQueryParamValue ? l(g, !0) : k(g), j = j.replace(new RegExp(":" + c + "(\\W|$)", "g"), function(a, b) {
                            return h + b
                        })) : j = j.replace(new RegExp("(/?):" + c + "(\\W|$)", "g"), function(a, b, c) {
                            return "/" === c.charAt(0) ? c : b + c
                        })
                    }), i.defaults.stripTrailingSlashes && (j = j.replace(/\/+$/, "") || "/"), j = j.replace(/\/\.(?=\w+($|\?))/, "."), c.url = m + j.replace(/\/\\\./, "/."), p(d, function(a, b) {
                        i.urlParams[b] || (c.params = c.params || {}, c.params[b] = a)
                    })
                }
            }, n
        }]
    })
}(window, window.angular),
function(a, b) {
    "use strict";

    function c(a, c, d) {
        function e(a, d, e) {
            var g, h;
            e = e || {}, h = e.expires, g = b.isDefined(e.path) ? e.path : f, b.isUndefined(d) && (h = "Thu, 01 Jan 1970 00:00:00 GMT", d = ""), b.isString(h) && (h = new Date(h));
            var i = encodeURIComponent(a) + "=" + encodeURIComponent(d);
            i += g ? ";path=" + g : "", i += e.domain ? ";domain=" + e.domain : "", i += h ? ";expires=" + h.toUTCString() : "", i += e.secure ? ";secure" : "";
            var j = i.length + 1;
            return j > 4096 && c.warn("Cookie '" + a + "' possibly not set or overflowed because it was too large (" + j + " > 4096 bytes)!"), i
        }
        var f = d.baseHref(),
            g = a[0];
        return function(a, b, c) {
            g.cookie = e(a, b, c)
        }
    }
    b.module("ngCookies", ["ng"]).provider("$cookies", [function() {
        function a(a) {
            return a ? b.extend({}, c, a) : c
        }
        var c = this.defaults = {};
        this.$get = ["$$cookieReader", "$$cookieWriter", function(c, d) {
            return {
                get: function(a) {
                    return c()[a]
                },
                getObject: function(a) {
                    var c = this.get(a);
                    return c ? b.fromJson(c) : c
                },
                getAll: function() {
                    return c()
                },
                put: function(b, c, e) {
                    d(b, c, a(e))
                },
                putObject: function(a, c, d) {
                    this.put(a, b.toJson(c), d)
                },
                remove: function(b, c) {
                    d(b, void 0, a(c))
                }
            }
        }]
    }]), b.module("ngCookies").factory("$cookieStore", ["$cookies", function(a) {
        return {
            get: function(b) {
                return a.getObject(b)
            },
            put: function(b, c) {
                a.putObject(b, c)
            },
            remove: function(b) {
                a.remove(b)
            }
        }
    }]), c.$inject = ["$document", "$log", "$browser"], b.module("ngCookies").provider("$$cookieWriter", function() {
        this.$get = c
    })
}(window, window.angular),
function(a, b) {
    "use strict";

    function c() {
        function c(a, b) {
            var c, d = {},
                e = a.split(",");
            for (c = 0; c < e.length; c++) d[b ? i(e[c]) : e[c]] = !0;
            return d
        }

        function d(b, c) {
            null === b || void 0 === b ? b = "" : "string" != typeof b && (b = "" + b), s.innerHTML = b;
            var d = 5;
            do {
                if (0 === d) throw m("uinput", "Failed to sanitize html because the input is unstable");
                d--, a.document.documentMode && q(s), b = s.innerHTML, s.innerHTML = b
            } while (b !== s.innerHTML);
            for (var e = s.firstChild; e;) {
                switch (e.nodeType) {
                    case 1:
                        c.start(e.nodeName.toLowerCase(), n(e.attributes));
                        break;
                    case 3:
                        c.chars(e.textContent)
                }
                var f;
                if (!(f = e.firstChild) && (1 === e.nodeType && c.end(e.nodeName.toLowerCase()), f = e.nextSibling, !f))
                    for (; null == f && (e = e.parentNode, e !== s);) f = e.nextSibling, 1 === e.nodeType && c.end(e.nodeName.toLowerCase());
                e = f
            }
            for (; e = s.firstChild;) s.removeChild(e)
        }

        function n(a) {
            for (var b = {}, c = 0, d = a.length; c < d; c++) {
                var e = a[c];
                b[e.name] = e.value
            }
            return b
        }

        function o(a) {
            return a.replace(/&/g, "&amp;").replace(t, function(a) {
                var b = a.charCodeAt(0),
                    c = a.charCodeAt(1);
                return "&#" + (1024 * (b - 55296) + (c - 56320) + 65536) + ";"
            }).replace(u, function(a) {
                return "&#" + a.charCodeAt(0) + ";"
            }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }

        function p(a, b) {
            var c = !1,
                d = e(a, a.push);
            return {
                start: function(a, e) {
                    a = i(a), !c && C[a] && (c = a), c || D[a] !== !0 || (d("<"), d(a), g(e, function(c, e) {
                        var f = i(e),
                            g = "img" === a && "src" === f || "background" === f;
                        H[f] !== !0 || E[f] === !0 && !b(c, g) || (d(" "), d(e), d('="'), d(o(c)), d('"'))
                    }), d(">"))
                },
                end: function(a) {
                    a = i(a), c || D[a] !== !0 || v[a] === !0 || (d("</"), d(a), d(">")), a == c && (c = !1)
                },
                chars: function(a) {
                    c || d(o(a))
                }
            }
        }

        function q(b) {
            if (b.nodeType === a.Node.ELEMENT_NODE)
                for (var c = b.attributes, d = 0, e = c.length; d < e; d++) {
                    var f = c[d],
                        g = f.name.toLowerCase();
                    "xmlns:ns1" !== g && 0 !== g.lastIndexOf("ns1:", 0) || (b.removeAttributeNode(f), d--, e--)
                }
            var h = b.firstChild;
            h && q(h), h = b.nextSibling, h && q(h)
        }
        var r = !1;
        this.$get = ["$$sanitizeUri", function(a) {
            return r && f(D, B),
                function(b) {
                    var c = [];
                    return k(b, l(c, function(b, c) {
                        return !/^unsafe:/.test(a(b, c))
                    })), c.join("")
                }
        }], this.enableSvg = function(a) {
            return h(a) ? (r = a, this) : r
        }, e = b.bind, f = b.extend, g = b.forEach, h = b.isDefined, i = b.lowercase, j = b.noop, k = d, l = p;
        var s, t = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
            u = /([^#-~ |!])/g,
            v = c("area,br,col,hr,img,wbr"),
            w = c("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
            x = c("rp,rt"),
            y = f({}, x, w),
            z = f({}, w, c("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul")),
            A = f({}, x, c("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),
            B = c("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan"),
            C = c("script,style"),
            D = f({}, v, z, A, y),
            E = c("background,cite,href,longdesc,src,xlink:href"),
            F = c("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width"),
            G = c("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan", !0),
            H = f({}, E, G, F);
        ! function(a) {
            var b;
            if (!a.document || !a.document.implementation) throw m("noinert", "Can't create an inert html document");
            b = a.document.implementation.createHTMLDocument("inert");
            var c = b.documentElement || b.getDocumentElement(),
                d = c.getElementsByTagName("body");
            if (1 === d.length) s = d[0];
            else {
                var e = b.createElement("html");
                s = b.createElement("body"), e.appendChild(s), b.appendChild(e)
            }
        }(a)
    }

    function d(a) {
        var b = [],
            c = l(b, j);
        return c.chars(a), b.join("")
    }
    var e, f, g, h, i, j, k, l, m = b.$$minErr("$sanitize");
    b.module("ngSanitize", []).provider("$sanitize", c), b.module("ngSanitize").filter("linky", ["$sanitize", function(a) {
        var c = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,
            e = /^mailto:/i,
            f = b.$$minErr("linky"),
            g = b.isDefined,
            h = b.isFunction,
            i = b.isObject,
            j = b.isString;
        return function(b, k, l) {
            function m(a) {
                a && t.push(d(a))
            }

            function n(a, b) {
                var c, d = r(a);
                t.push("<a ");
                for (c in d) t.push(c + '="' + d[c] + '" ');
                !g(k) || "target" in d || t.push('target="', k, '" '), t.push('href="', a.replace(/"/g, "&quot;"), '">'), m(b), t.push("</a>")
            }
            if (null == b || "" === b) return b;
            if (!j(b)) throw f("notstring", "Expected string but received: {0}", b);
            for (var o, p, q, r = h(l) ? l : i(l) ? function() {
                    return l
                } : function() {
                    return {}
                }, s = b, t = []; o = s.match(c);) p = o[0], o[2] || o[4] || (p = (o[3] ? "http://" : "mailto:") + p), q = o.index, m(s.substr(0, q)), n(p, o[0].replace(e, "")), s = s.substring(q + o[0].length);
            return m(s), a(t.join(""))
        }
    }])
}(window, window.angular), angular.module("xeditable", []).value("editableOptions", {
        theme: "default",
        icon_set: "default",
        buttons: "right",
        blurElem: "cancel",
        blurForm: "ignore",
        activate: "focus",
        isDisabled: !1,
        activationEvent: "click",
        submitButtonTitle: "Submit",
        submitButtonAriaLabel: "Submit",
        cancelButtonTitle: "Cancel",
        cancelButtonAriaLabel: "Cancel",
        clearButtonTitle: "Clear",
        clearButtonAriaLabel: "Clear",
        displayClearButton: !1
    }), angular.module("xeditable").directive("editableBsdate", ["editableDirectiveFactory", "$injector", "$parse", function(a, b, c) {
        uibDatepickerConfig = b.get("uibDatepickerConfig"), uibDatepickerPopupConfig = b.get("uibDatepickerPopupConfig");
        var d = [
                ["eIsOpen", "is-open"],
                ["eDateDisabled", "date-disabled"],
                ["eDatepickerPopup", "uib-datepicker-popup"],
                ["eShowButtonBar", "show-button-bar"],
                ["eCurrentText", "current-text"],
                ["eClearText", "clear-text"],
                ["eCloseText", "close-text"],
                ["eCloseOnDateSelection", "close-on-date-selection"],
                ["eDatePickerAppendToBody", "datepicker-append-to-body"],
                ["eOnOpenFocus", "on-open-focus"],
                ["eName", "name"],
                ["eDateDisabled", "date-disabled"]
            ],
            e = [
                ["eFormatDay", "formatDay"],
                ["eFormatMonth", "formatMonth"],
                ["eFormatYear", "formatYear"],
                ["eFormatDayHeader", "formatDayHeader"],
                ["eFormatDayTitle", "formatDayTitle"],
                ["eFormatMonthTitle", "formatMonthTitle"],
                ["eMaxMode", "maxMode"],
                ["eMinMode", "minMode"],
                ["eDatepickerMode", "datepickerMode"]
            ];
        return a({
            directiveName: "editableBsdate",
            inputTpl: "<div></div>",
            render: function() {
                this.parent.render.call(this);
                var a = this.attrs,
                    b = this.scope,
                    f = angular.element('<input type="text" class="form-control" ng-model="$parent.$data"/>');
                f.attr("uib-datepicker-popup", a.eDatepickerPopupXEditable || uibDatepickerPopupConfig.datepickerPopup), f.attr("year-range", a.eYearRange || 20), f.attr("ng-readonly", a.eReadonly || !1);
                for (var g = d.length - 1; g >= 0; g--) {
                    var h = a[d[g][0]];
                    "undefined" != typeof h && f.attr(d[g][1], h)
                }
                a.eNgChange && (f.attr("ng-change", a.eNgChange), this.inputEl.removeAttr("ng-change")), a.eStyle && (f.attr("style", a.eStyle), this.inputEl.removeAttr("style"));
                var i = {
                    maxDate: b.$eval(a.eMaxDate) || uibDatepickerConfig.maxDate,
                    minDate: b.$eval(a.eMinDate) || uibDatepickerConfig.minDate,
                    showWeeks: a.eShowWeeks ? "true" === a.eShowWeeks.toLowerCase() : uibDatepickerConfig.showWeeks,
                    startingDay: a.eStartingDay || 0,
                    initDate: b.$eval(a.eInitDate) || new Date
                };
                if (a.eDatepickerOptions) {
                    var j = c(a.eDatepickerOptions)(b);
                    angular.extend(i, j)
                }
                for (var k = e.length - 1; k >= 0; k--) {
                    var l = a[e[k][0]];
                    "undefined" != typeof l && (i[e[k][1]] = l)
                }
                b.dateOptions = i;
                var m = angular.isDefined(a.eShowCalendarButton) ? a.eShowCalendarButton : "true";
                if ("true" === m) {
                    var n = angular.element('<button type="button" class="btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>'),
                        o = angular.element('<span class="input-group-btn"></span>');
                    n.attr("ng-click", a.eNgClick), o.append(n), this.inputEl.append(o)
                } else f.attr("ng-click", a.eNgClick);
                f.attr("datepicker-options", "dateOptions"), this.inputEl.prepend(f), this.inputEl.removeAttr("class"), this.inputEl.removeAttr("ng-click"), this.inputEl.removeAttr("is-open"), this.inputEl.removeAttr("init-date"), this.inputEl.removeAttr("datepicker-popup"), this.inputEl.removeAttr("required"), this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("date-picker-append-to-body"), this.inputEl.removeAttr("name"), this.inputEl.attr("class", "input-group")
            }
        })
    }]), angular.module("xeditable").directive("editableBstime", ["editableDirectiveFactory", function(a) {
        return a({
            directiveName: "editableBstime",
            inputTpl: "<uib-timepicker></uib-timepicker>",
            render: function() {
                this.parent.render.call(this);
                var a = angular.element('<div class="well well-small" style="display:inline-block;"></div>');
                a.attr("ng-model", this.inputEl.attr("ng-model")), this.inputEl.removeAttr("ng-model"), this.attrs.eNgChange && (a.attr("ng-change", this.inputEl.attr("ng-change")), this.inputEl.removeAttr("ng-change")), this.inputEl.wrap(a)
            }
        })
    }]), angular.module("xeditable").directive("editableCheckbox", ["editableDirectiveFactory", function(a) {
        return a({
            directiveName: "editableCheckbox",
            inputTpl: '<input type="checkbox">',
            render: function() {
                this.parent.render.call(this), this.attrs.eTitle && (this.inputEl.wrap("<label></label>"), this.inputEl.parent().append("<span>" + this.attrs.eTitle + "</span>"))
            },
            autosubmit: function() {
                var a = this;
                a.inputEl.bind("change", function() {
                    setTimeout(function() {
                        a.scope.$apply(function() {
                            a.scope.$form.$submit()
                        })
                    }, 500)
                })
            }
        })
    }]), angular.module("xeditable").directive("editableChecklist", ["editableDirectiveFactory", "editableNgOptionsParser", function(a, b) {
        return a({
            directiveName: "editableChecklist",
            inputTpl: "<span></span>",
            useCopy: !0,
            render: function() {
                this.parent.render.call(this);
                var a = b(this.attrs.eNgOptions),
                    c = "",
                    d = "";
                this.attrs.eNgChange && (c = ' ng-change="' + this.attrs.eNgChange + '"'), this.attrs.eChecklistComparator && (d = ' checklist-comparator="' + this.attrs.eChecklistComparator + '"');
                var e = '<label ng-repeat="' + a.ngRepeat + '"><input type="checkbox" checklist-model="$parent.$parent.$data" checklist-value="' + a.locals.valueFn + '"' + c + d + '><span ng-bind="' + a.locals.displayFn + '"></span></label>';
                this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("ng-options"), this.inputEl.removeAttr("ng-change"), this.inputEl.removeAttr("checklist-comparator"), this.inputEl.html(e)
            }
        })
    }]), angular.module("xeditable").directive("editableCombodate", ["editableDirectiveFactory", "editableCombodate", function(a, b) {
        return a({
            directiveName: "editableCombodate",
            inputTpl: '<input type="text">',
            render: function() {
                this.parent.render.call(this);
                var a = {
                        value: new Date(this.scope.$data)
                    },
                    c = this;
                angular.forEach(["format", "template", "minYear", "maxYear", "yearDescending", "minuteStep", "secondStep", "firstItem", "errorClass", "customClass", "roundTime", "smartDays"], function(b) {
                    var d = "e" + b.charAt(0).toUpperCase() + b.slice(1);
                    d in c.attrs && ("minYear" == b || "maxYear" == b || "minuteStep" == b || "secondStep" == b ? a[b] = parseInt(c.attrs[d], 10) : a[b] = c.attrs[d])
                });
                var d = b.getInstance(this.inputEl, a);
                d.$widget.find("select").bind("change", function(a) {
                    c.scope.$data = new Date(d.getValue()).toISOString()
                })
            }
        })
    }]),
    function() {
        var a = function(a) {
                return a.toLowerCase().replace(/-(.)/g, function(a, b) {
                    return b.toUpperCase()
                })
            },
            b = "text|password|email|tel|number|url|search|color|date|datetime|datetime-local|time|month|week|file".split("|");
        angular.forEach(b, function(b) {
            var c = a("editable-" + b);
            angular.module("xeditable").directive(c, ["editableDirectiveFactory", function(a) {
                return a({
                    directiveName: c,
                    inputTpl: '<input type="' + b + '">',
                    render: function() {
                        if (this.parent.render.call(this), this.attrs.eInputgroupleft || this.attrs.eInputgroupright) {
                            if (this.inputEl.wrap('<div class="input-group"></div>'), this.attrs.eInputgroupleft) {
                                var a = angular.element('<span class="input-group-addon">' + this.attrs.eInputgroupleft + "</span>");
                                this.inputEl.parent().prepend(a)
                            }
                            if (this.attrs.eInputgroupright) {
                                var b = angular.element('<span class="input-group-addon">' + this.attrs.eInputgroupright + "</span>");
                                this.inputEl.parent().append(b)
                            }
                        }
                        if (this.attrs.eLabel) {
                            var c = angular.element("<label>" + this.attrs.eLabel + "</label>");
                            this.attrs.eInputgroupleft || this.attrs.eInputgroupright ? this.inputEl.parent().parent().prepend(c) : this.inputEl.parent().prepend(c)
                        }
                        this.attrs.eFormclass && this.editorEl.addClass(this.attrs.eFormclass)
                    },
                    autosubmit: function() {
                        var a = this;
                        a.inputEl.bind("keydown", function(b) {
                            9 === b.keyCode && a.scope.$apply(function() {
                                a.scope.$form.$submit()
                            })
                        })
                    }
                })
            }])
        }), angular.module("xeditable").directive("editableRange", ["editableDirectiveFactory", "$interpolate", function(a, b) {
            return a({
                directiveName: "editableRange",
                inputTpl: '<input type="range" id="range" name="range">',
                render: function() {
                    this.parent.render.call(this), this.inputEl.after("<output>" + b.startSymbol() + "$data" + b.endSymbol() + "</output>")
                }
            })
        }])
    }(), angular.module("xeditable").directive("editableTagsInput", ["editableDirectiveFactory", "editableUtils", function(a, b) {
        var c = a({
                directiveName: "editableTagsInput",
                inputTpl: "<tags-input></tags-input>",
                render: function() {
                    this.parent.render.call(this), this.inputEl.append(b.rename("auto-complete", this.attrs.$autoCompleteElement)), this.inputEl.removeAttr("ng-model"), this.inputEl.attr("ng-model", "$parent.$data")
                }
            }),
            d = c.link;
        return c.link = function(a, b, c, e) {
            var f = b.find("editable-tags-input-auto-complete");
            return c.$autoCompleteElement = f.clone(), f.remove(), d(a, b, c, e)
        }, c
    }]), angular.module("xeditable").directive("editableRadiolist", ["editableDirectiveFactory", "editableNgOptionsParser", "$interpolate", function(a, b, c) {
        return a({
            directiveName: "editableRadiolist",
            inputTpl: "<span></span>",
            render: function() {
                this.parent.render.call(this);
                var a = b(this.attrs.eNgOptions),
                    d = "";
                this.attrs.eNgChange && (d = 'ng-change="' + this.attrs.eNgChange + '"');
                var e = '<label data-ng-repeat="' + a.ngRepeat + '"><input type="radio" data-ng-disabled="::' + this.attrs.eNgDisabled + '" data-ng-model="$parent.$parent.$data" data-ng-value="' + c.startSymbol() + "::" + a.locals.valueFn + c.endSymbol() + '"' + d + '><span data-ng-bind="::' + a.locals.displayFn + '"></span></label>';
                this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("ng-options"), this.inputEl.removeAttr("ng-change"),
                    this.inputEl.html(e)
            },
            autosubmit: function() {
                var a = this;
                a.inputEl.bind("change", function() {
                    setTimeout(function() {
                        a.scope.$apply(function() {
                            a.scope.$form.$submit()
                        })
                    }, 500)
                })
            }
        })
    }]), angular.module("xeditable").directive("editableSelect", ["editableDirectiveFactory", function(a) {
        return a({
            directiveName: "editableSelect",
            inputTpl: "<select></select>",
            render: function() {
                if (this.parent.render.call(this), this.attrs.ePlaceholder) {
                    var a = angular.element('<option value="">' + this.attrs.ePlaceholder + "</option>");
                    this.inputEl.append(a)
                }
            },
            autosubmit: function() {
                var a = this;
                a.inputEl.bind("change", function() {
                    a.scope.$apply(function() {
                        a.scope.$form.$submit()
                    })
                })
            }
        })
    }]), angular.module("xeditable").directive("editableTextarea", ["editableDirectiveFactory", function(a) {
        return a({
            directiveName: "editableTextarea",
            inputTpl: "<textarea></textarea>",
            addListeners: function() {
                var a = this;
                a.parent.addListeners.call(a), a.single && "no" !== a.buttons && a.autosubmit()
            },
            autosubmit: function() {
                var a = this;
                a.inputEl.bind("keydown", function(b) {
                    a.attrs.submitOnEnter ? 13 !== b.keyCode || b.shiftKey || a.scope.$apply(function() {
                        a.scope.$form.$submit()
                    }) : (b.ctrlKey || b.metaKey) && 13 === b.keyCode && a.scope.$apply(function() {
                        a.scope.$form.$submit()
                    })
                })
            }
        })
    }]), angular.module("xeditable").directive("editableUidate", ["editableDirectiveFactory", function(a) {
        return a({
            directiveName: "editableUidate",
            inputTpl: '<input class="form-control" />',
            render: function() {
                this.parent.render.call(this), this.inputEl.attr("ui-date", this.attrs.eUiDate), this.inputEl.attr("placeholder", this.attrs.ePlaceholder)
            }
        })
    }]), angular.module("xeditable").directive("editableUiSelect", ["editableDirectiveFactory", "editableUtils", function(a, b) {
        var c = a({
                directiveName: "editableUiSelect",
                inputTpl: "<ui-select></ui-select>",
                render: function() {
                    this.parent.render.call(this), this.inputEl.append(b.rename("ui-select-match", this.attrs.$matchElement)), this.inputEl.append(b.rename("ui-select-choices", this.attrs.$choicesElement)), this.inputEl.removeAttr("ng-model"), this.inputEl.attr("ng-model", "$parent.$parent.$data")
                }
            }),
            d = c.link;
        return c.link = function(a, b, c, e) {
            var f = b.find("editable-ui-select-match"),
                g = b.find("editable-ui-select-choices");
            return c.$matchElement = f.clone(), c.$choicesElement = g.clone(), f.remove(), g.remove(), d(a, b, c, e)
        }, c
    }]), angular.module("xeditable").factory("editableController", ["$q", "editableUtils", function(a, b) {
        function c(a, c, d, e, f, g, h, i, j, k) {
            var l, m, n = this;
            n.scope = a, n.elem = d, n.attrs = c, n.inputEl = null, n.editorEl = null, n.single = !0, n.error = "", n.theme = f[c.editableTheme] || f[h.theme] || f["default"], n.parent = {};
            var o = c.editableTheme || h.theme || "default",
                p = c.editableIconSet || h.icon_set;
            n.icon_set = "default" === p ? g["default"][o] : g.external[p], n.inputTpl = "", n.directiveName = "", n.useCopy = !1, n.single = null, n.buttons = "right", n.init = function(b) {
                if (n.single = b, n.name = c.eName || c[n.directiveName], !c[n.directiveName]) throw "You should provide value for `" + n.directiveName + "` in editable element!";
                l = e(c[n.directiveName]), n.single ? n.buttons = n.attrs.buttons || h.buttons : n.buttons = "no", c.eName && n.scope.$watch("$data", function(a) {
                    n.scope.$form.$data[c.eName] = a
                }), c.onshow && (n.onshow = function() {
                    return n.catchError(e(c.onshow)(a))
                }), c.onhide && (n.onhide = function() {
                    return e(c.onhide)(a)
                }), c.oncancel && (n.oncancel = function() {
                    return e(c.oncancel)(a)
                }), c.onbeforesave && (n.onbeforesave = function() {
                    return n.catchError(e(c.onbeforesave)(a))
                }), c.onaftersave && (n.onaftersave = function() {
                    return n.catchError(e(c.onaftersave)(a))
                }), a.$parent.$watch(c[n.directiveName], function(a, b) {
                    n.setLocalValue(), n.handleEmpty()
                })
            }, n.render = function() {
                var a = n.theme;
                n.inputEl = angular.element(n.inputTpl), n.controlsEl = angular.element(a.controlsTpl), n.controlsEl.append(n.inputEl), "no" !== n.buttons && (n.buttonsEl = angular.element(a.buttonsTpl), n.submitEl = angular.element(a.submitTpl), n.resetEl = angular.element(a.resetTpl), n.cancelEl = angular.element(a.cancelTpl), n.submitEl.attr("title", h.submitButtonTitle), n.submitEl.attr("aria-label", h.submitButtonAriaLabel), n.cancelEl.attr("title", h.cancelButtonTitle), n.cancelEl.attr("aria-label", h.cancelButtonAriaLabel), n.resetEl.attr("title", h.clearButtonTitle), n.resetEl.attr("aria-label", h.clearButtonAriaLabel), n.icon_set && (n.submitEl.find("span").addClass(n.icon_set.ok), n.cancelEl.find("span").addClass(n.icon_set.cancel), n.resetEl.find("span").addClass(n.icon_set.clear)), n.buttonsEl.append(n.submitEl).append(n.cancelEl), h.displayClearButton && n.buttonsEl.append(n.resetEl), n.controlsEl.append(n.buttonsEl), n.inputEl.addClass("editable-has-buttons")), n.errorEl = angular.element(a.errorTpl), n.controlsEl.append(n.errorEl), n.editorEl = angular.element(n.single ? a.formTpl : a.noformTpl), n.editorEl.append(n.controlsEl);
                for (var d in c.$attr)
                    if (!(d.length <= 1)) {
                        var e = !1,
                            f = d.substring(1, 2);
                        if ("e" === d.substring(0, 1) && f === f.toUpperCase() && (e = d.substring(1), "Form" !== e && "NgSubmit" !== e)) {
                            var g = e.substring(0, 1),
                                i = e.substring(1, 2);
                            e = i === i.toUpperCase() && g === g.toUpperCase() ? g.toLowerCase() + "-" + b.camelToDash(e.substring(1)) : g.toLowerCase() + b.camelToDash(e.substring(1));
                            var j = "value" !== e && "" === c[d] ? e : c[d];
                            n.inputEl.attr(e, j)
                        }
                    } n.inputEl.addClass("editable-input"), n.inputEl.attr("ng-model", "$parent.$data"), n.editorEl.addClass(b.camelToDash(n.directiveName)), n.single && (n.editorEl.attr("editable-form", "$form"), n.editorEl.attr("blur", n.attrs.blur || ("no" === n.buttons ? "cancel" : h.blurElem))), angular.isFunction(a.postrender) && a.postrender.call(n)
            }, n.setLocalValue = function() {
                n.scope.$data = n.useCopy ? angular.copy(l(a.$parent)) : l(a.$parent)
            };
            var q = null;
            n.show = function() {
                return n.setLocalValue(), n.render(), d.after(n.editorEl), q = a.$new(), j(n.editorEl)(q), n.addListeners(), d.addClass("editable-hide"), n.onshow()
            }, n.hide = function() {
                return q.$destroy(), n.controlsEl.remove(), n.editorEl.remove(), d.removeClass("editable-hide"), n.onhide()
            }, n.cancel = function() {
                n.oncancel()
            }, n.addListeners = function() {
                n.inputEl.bind("keyup", function(a) {
                    if (n.single) switch (a.keyCode) {
                        case 27:
                            n.scope.$apply(function() {
                                n.scope.$form.$cancel()
                            })
                    }
                }), n.single && "no" === n.buttons && n.autosubmit(), n.editorEl.bind("click", function(a) {
                    a.which && 1 !== a.which || n.scope.$form.$visible && (n.scope.$form._clicked = !0)
                })
            }, n.setWaiting = function(a) {
                a ? (m = !n.inputEl.attr("disabled") && !n.inputEl.attr("ng-disabled") && !n.inputEl.attr("ng-enabled"), m && (n.inputEl.attr("disabled", "disabled"), n.buttonsEl && n.buttonsEl.find("button").attr("disabled", "disabled"))) : m && (n.inputEl.removeAttr("disabled"), n.buttonsEl && n.buttonsEl.find("button").removeAttr("disabled"))
            }, n.activate = function(a, b) {
                setTimeout(function() {
                    var c = n.inputEl[0];
                    "focus" === h.activate && c.focus ? (void 0 !== a && "" !== a && c.setSelectionRange && (b = b || a, c.onfocus = function() {
                        setTimeout(function() {
                            try {
                                this.setSelectionRange(a, b)
                            } catch (c) {}
                        }.bind(this))
                    }), "editableRadiolist" == n.directiveName || "editableChecklist" == n.directiveName || "editableBsdate" == n.directiveName || "editableTagsInput" == n.directiveName ? c.querySelector(".ng-pristine").focus() : c.focus()) : "select" === h.activate && (c.select ? c.select() : c.focus && c.focus())
                }, 0)
            }, n.setError = function(b) {
                angular.isObject(b) || (a.$error = b, n.error = b)
            }, n.catchError = function(a, b) {
                return angular.isObject(a) && b !== !0 ? k.when(a).then(angular.bind(this, function(a) {
                    this.catchError(a, !0)
                }), angular.bind(this, function(a) {
                    this.catchError(a, !0)
                })) : b && angular.isObject(a) && a.status && 200 !== a.status && a.data && angular.isString(a.data) ? (this.setError(a.data), a = a.data) : angular.isString(a) && this.setError(a), a
            }, n.save = function() {
                l.assign(a.$parent, n.useCopy ? angular.copy(n.scope.$data) : n.scope.$data)
            }, n.handleEmpty = function() {
                var b = l(a.$parent),
                    c = null === b || void 0 === b || "" === b || angular.isArray(b) && 0 === b.length;
                d.toggleClass("editable-empty", c)
            }, n.autosubmit = angular.noop, n.onshow = angular.noop, n.onhide = angular.noop, n.oncancel = angular.noop, n.onbeforesave = angular.noop, n.onaftersave = angular.noop
        }
        return c.$inject = ["$scope", "$attrs", "$element", "$parse", "editableThemes", "editableIcons", "editableOptions", "$rootScope", "$compile", "$q"], c
    }]), angular.module("xeditable").factory("editableDirectiveFactory", ["$parse", "$compile", "editableThemes", "$rootScope", "$document", "editableController", "editableFormController", "editableOptions", function(a, b, c, d, e, f, g, h) {
        return function(b) {
            return {
                restrict: "A",
                scope: !0,
                require: [b.directiveName, "?^form"],
                controller: f,
                link: function(c, f, i, j) {
                    var k, l = j[0],
                        m = !1;
                    if (j[1]) k = j[1], m = void 0 === i.eSingle;
                    else if (i.eForm) {
                        var n = a(i.eForm)(c);
                        if (n) k = n, m = !0;
                        else if (f && "function" == typeof f.parents && f.parents().last().find("form[name=" + i.eForm + "]").length) k = null, m = !0;
                        else
                            for (var o = 0; o < e[0].forms.length; o++)
                                if (e[0].forms[o].name === i.eForm) {
                                    k = null, m = !0;
                                    break
                                }
                    }
                    angular.forEach(b, function(a, b) {
                        void 0 !== l[b] && (l.parent[b] = l[b])
                    }), angular.extend(l, b);
                    var p = function() {
                        return angular.isDefined(i.editDisabled) ? c.$eval(i.editDisabled) : h.isDisabled
                    };
                    if (l.init(!m), c.$editable = l, f.addClass("editable"), m)
                        if (k) {
                            if (c.$form = k, !c.$form.$addEditable) throw "Form with editable elements should have `editable-form` attribute.";
                            c.$form.$addEditable(l)
                        } else d.$$editableBuffer = d.$$editableBuffer || {}, d.$$editableBuffer[i.eForm] = d.$$editableBuffer[i.eForm] || [], d.$$editableBuffer[i.eForm].push(l), c.$form = null;
                    else c.$form = g(), c.$form.$addEditable(l), i.eForm && (a(i.eForm).assign || angular.noop)(c.$parent, c.$form), i.eForm && !i.eClickable || (f.addClass("editable-click"), f.bind(h.activationEvent, function(a) {
                        a.preventDefault(), a.editable = l, p() || c.$apply(function() {
                            c.$form.$show()
                        })
                    }))
                }
            }
        }
    }]), angular.module("xeditable").factory("editableFormController", ["$parse", "$document", "$rootScope", "editablePromiseCollection", "editableUtils", function(a, b, c, d, e) {
        var f = [],
            g = function(a, b) {
                if (b == a) return !0;
                for (var c = b.parentNode; null !== c;) {
                    if (c == a) return !0;
                    c = c.parentNode
                }
                return !1
            },
            h = function(a, b) {
                var c = !0,
                    d = a.$editables;
                return angular.forEach(d, function(a) {
                    var d = a.editorEl[0];
                    g(d, b.target) && (c = !1)
                }), c
            };
        b.bind("click", function(a) {
            if (!a.which || 1 === a.which) {
                for (var b = [], d = [], e = 0; e < f.length; e++) f[e]._clicked ? f[e]._clicked = !1 : f[e].$waiting || ("cancel" === f[e]._blur && h(f[e], a) && b.push(f[e]), "submit" === f[e]._blur && h(f[e], a) && d.push(f[e]));
                (b.length || d.length) && c.$apply(function() {
                    angular.forEach(b, function(a) {
                        a.$cancel()
                    }), angular.forEach(d, function(a) {
                        a.$submit()
                    })
                })
            }
        }), c.$on("closeEdit", function() {
            for (var a = 0; a < f.length; a++) f[a].$hide()
        });
        var i = {
            $addEditable: function(a) {
                this.$editables.push(a), a.elem.bind("$destroy", angular.bind(this, this.$removeEditable, a)), a.scope.$form || (a.scope.$form = this), this.$visible && a.catchError(a.show()), a.catchError(a.setWaiting(this.$waiting))
            },
            $removeEditable: function(a) {
                for (var b = 0; b < this.$editables.length; b++)
                    if (this.$editables[b] === a) return void this.$editables.splice(b, 1)
            },
            $show: function() {
                if (!this.$visible) {
                    this.$visible = !0;
                    var a = d();
                    a.when(this.$onshow()), this.$setError(null, ""), angular.forEach(this.$editables, function(b) {
                        a.when(b.show())
                    }), a.then({
                        onWait: angular.bind(this, this.$setWaiting),
                        onTrue: angular.bind(this, this.$activate),
                        onFalse: angular.bind(this, this.$activate),
                        onString: angular.bind(this, this.$activate)
                    }), setTimeout(angular.bind(this, function() {
                        this._clicked = !1, e.indexOf(f, this) === -1 && f.push(this)
                    }), 0)
                }
            },
            $activate: function(a) {
                var b, c, d;
                if (this.$editables.length) {
                    if (angular.isString(a))
                        for (b = 0; b < this.$editables.length; b++)
                            if (this.$editables[b].name === a) return void this.$editables[b].activate();
                    for (b = 0; b < this.$editables.length; b++)
                        if (this.$editables[b].error) return void this.$editables[b].activate();
                    c = this.$editables[0].elem[0].selectionStart ? this.$editables[0].elem[0].selectionStart : this.$editables[0].elem[0].text ? this.$editables[0].elem[0].text.length : 0, d = this.$editables[0].elem[0].selectionEnd ? this.$editables[0].elem[0].selectionEnd : this.$editables[0].elem[0].text ? this.$editables[0].elem[0].text.length : 0, this.$editables[0].activate(c, d)
                }
            },
            $hide: function() {
                this.$visible && (this.$visible = !1, this.$onhide(), angular.forEach(this.$editables, function(a) {
                    a.hide()
                }), e.arrayRemove(f, this))
            },
            $cancel: function() {
                this.$visible && (this.$oncancel(), angular.forEach(this.$editables, function(a) {
                    a.cancel()
                }), this.$hide())
            },
            $setWaiting: function(a) {
                this.$waiting = !!a, angular.forEach(this.$editables, function(b) {
                    b.setWaiting(!!a)
                })
            },
            $setError: function(a, b) {
                angular.forEach(this.$editables, function(c) {
                    a && c.name !== a || c.setError(b)
                })
            },
            $submit: function() {
                function a(a) {
                    var b = d();
                    b.when(this.$onbeforesave()), b.then({
                        onWait: angular.bind(this, this.$setWaiting),
                        onTrue: a ? angular.bind(this, this.$save) : angular.bind(this, this.$hide),
                        onFalse: angular.bind(this, this.$hide),
                        onString: angular.bind(this, this.$activate)
                    })
                }
                if (!this.$waiting) {
                    this.$setError(null, "");
                    var b = d();
                    angular.forEach(this.$editables, function(a) {
                        b.when(a.onbeforesave())
                    }), b.then({
                        onWait: angular.bind(this, this.$setWaiting),
                        onTrue: angular.bind(this, a, !0),
                        onFalse: angular.bind(this, a, !1),
                        onString: angular.bind(this, this.$activate)
                    })
                }
            },
            $save: function() {
                angular.forEach(this.$editables, function(a) {
                    a.save()
                });
                var a = d();
                a.when(this.$onaftersave()), angular.forEach(this.$editables, function(b) {
                    a.when(b.onaftersave())
                }), a.then({
                    onWait: angular.bind(this, this.$setWaiting),
                    onTrue: angular.bind(this, this.$hide),
                    onFalse: angular.bind(this, this.$hide),
                    onString: angular.bind(this, this.$activate)
                })
            },
            $onshow: angular.noop,
            $oncancel: angular.noop,
            $onhide: angular.noop,
            $onbeforesave: angular.noop,
            $onaftersave: angular.noop
        };
        return function() {
            return angular.extend({
                $editables: [],
                $visible: !1,
                $waiting: !1,
                $data: {},
                _clicked: !1,
                _blur: null
            }, i)
        }
    }]), angular.module("xeditable").directive("editableForm", ["$rootScope", "$parse", "editableFormController", "editableOptions", function(a, b, c, d) {
        return {
            restrict: "A",
            require: ["form"],
            compile: function() {
                return {
                    pre: function(b, d, e, f) {
                        var g, h = f[0];
                        e.editableForm ? b[e.editableForm] && b[e.editableForm].$show ? (g = b[e.editableForm], angular.extend(h, g)) : (g = c(), b[e.editableForm] = g, angular.extend(g, h)) : (g = c(), angular.extend(h, g));
                        var i = a.$$editableBuffer,
                            j = h.$name;
                        j && i && i[j] && (angular.forEach(i[j], function(a) {
                            g.$addEditable(a)
                        }), delete i[j])
                    },
                    post: function(a, c, e, f) {
                        var g;
                        g = e.editableForm && a[e.editableForm] && a[e.editableForm].$show ? a[e.editableForm] : f[0], e.onshow && (g.$onshow = angular.bind(g, b(e.onshow), a)), e.onhide && (g.$onhide = angular.bind(g, b(e.onhide), a)), e.oncancel && (g.$oncancel = angular.bind(g, b(e.oncancel), a)), e.shown && b(e.shown)(a) && g.$show(), g._blur = e.blur || d.blurForm, e.ngSubmit || e.submit || (e.onbeforesave && (g.$onbeforesave = function() {
                            return b(e.onbeforesave)(a, {
                                $data: g.$data
                            })
                        }), e.onaftersave && (g.$onaftersave = function() {
                            return b(e.onaftersave)(a, {
                                $data: g.$data
                            })
                        }), c.bind("submit", function(b) {
                            b.preventDefault(), a.$apply(function() {
                                g.$submit()
                            })
                        })), c.bind("click", function(a) {
                            a.which && 1 !== a.which || g.$visible && (g._clicked = !0)
                        })
                    }
                }
            }
        }
    }]), angular.module("xeditable").factory("editablePromiseCollection", ["$q", function(a) {
        function b() {
            return {
                promises: [],
                hasFalse: !1,
                hasString: !1,
                when: function(b, c) {
                    if (b === !1) this.hasFalse = !0;
                    else if (!c && angular.isObject(b)) this.promises.push(a.when(b));
                    else {
                        if (!angular.isString(b)) return;
                        this.hasString = !0
                    }
                },
                then: function(b) {
                    function c() {
                        h.hasString || h.hasFalse ? !h.hasString && h.hasFalse ? e() : f() : d()
                    }
                    b = b || {};
                    var d = b.onTrue || angular.noop,
                        e = b.onFalse || angular.noop,
                        f = b.onString || angular.noop,
                        g = b.onWait || angular.noop,
                        h = this;
                    this.promises.length ? (g(!0), a.all(this.promises).then(function(a) {
                        g(!1), angular.forEach(a, function(a) {
                            h.when(a, !0)
                        }), c()
                    }, function(a) {
                        g(!1), f()
                    })) : c()
                }
            }
        }
        return b
    }]), angular.module("xeditable").factory("editableUtils", [function() {
        return {
            indexOf: function(a, b) {
                if (a.indexOf) return a.indexOf(b);
                for (var c = 0; c < a.length; c++)
                    if (b === a[c]) return c;
                return -1
            },
            arrayRemove: function(a, b) {
                var c = this.indexOf(a, b);
                return c >= 0 && a.splice(c, 1), b
            },
            camelToDash: function(a) {
                var b = /[A-Z]/g;
                return a.replace(b, function(a, b) {
                    return (b ? "-" : "") + a.toLowerCase()
                })
            },
            dashToCamel: function(a) {
                var b = /([\:\-\_]+(.))/g,
                    c = /^moz([A-Z])/;
                return a.replace(b, function(a, b, c, d) {
                    return d ? c.toUpperCase() : c
                }).replace(c, "Moz$1")
            },
            rename: function(a, b) {
                if (b[0] && b[0].attributes) {
                    var c = angular.element("<" + a + "/>");
                    c.html(b.html());
                    for (var d = b[0].attributes, e = 0; e < d.length; ++e) c.attr(d.item(e).nodeName, d.item(e).value);
                    return c
                }
            }
        }
    }]), angular.module("xeditable").factory("editableNgOptionsParser", [function() {
        function a(a) {
            var c;
            if (!(c = a.match(b))) throw "ng-options parse error";
            var d, e = c[2] || c[1],
                f = c[4] || c[6],
                g = c[5],
                h = (c[3] || "", c[2] ? c[1] : f),
                i = c[7],
                j = c[8],
                k = j ? c[8] : null;
            return void 0 === g ? (d = f + " in " + i, void 0 !== j && (d += " track by " + k)) : d = "(" + g + ", " + f + ") in " + i, {
                ngRepeat: d,
                locals: {
                    valueName: f,
                    keyName: g,
                    valueFn: h,
                    displayFn: e
                }
            }
        }
        var b = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
        return a
    }]), angular.module("xeditable").factory("editableCombodate", [function() {
        function a(a, b) {
            if (this.$element = angular.element(a), "INPUT" != this.$element[0].nodeName) throw "Combodate should be applied to INPUT element";
            var c = (new Date).getFullYear();
            this.defaults = {
                format: "YYYY-MM-DD HH:mm",
                template: "D / MMM / YYYY   H : mm",
                value: null,
                minYear: 1970,
                maxYear: c,
                yearDescending: !0,
                minuteStep: 5,
                secondStep: 1,
                firstItem: "empty",
                errorClass: null,
                customClass: "",
                roundTime: !0,
                smartDays: !0
            }, this.options = angular.extend({}, this.defaults, b), this.init()
        }
        return a.prototype = {
            constructor: a,
            init: function() {
                if (this.map = {
                        day: ["D", "date"],
                        month: ["M", "month"],
                        year: ["Y", "year"],
                        hour: ["[Hh]", "hours"],
                        minute: ["m", "minutes"],
                        second: ["s", "seconds"],
                        ampm: ["[Aa]", ""]
                    }, this.$widget = angular.element('<span class="combodate"></span>').html(this.getTemplate()), this.initCombos(), this.options.smartDays) {
                    var a = this;
                    this.$widget.find("select").bind("change", function(b) {
                        (angular.element(b.target).hasClass("month") || angular.element(b.target).hasClass("year")) && a.fillCombo("day")
                    })
                }
                this.$widget.find("select").css("width", "auto"), this.$element.css("display", "none").after(this.$widget), this.setValue(this.$element.val() || this.options.value)
            },
            getTemplate: function() {
                var a = this.options.template,
                    b = this.options.customClass;
                return angular.forEach(this.map, function(b, c) {
                    b = b[0];
                    var d = new RegExp(b + "+"),
                        e = b.length > 1 ? b.substring(1, 2) : b;
                    a = a.replace(d, "{" + e + "}")
                }), a = a.replace(/ /g, "&nbsp;"), angular.forEach(this.map, function(c, d) {
                    c = c[0];
                    var e = c.length > 1 ? c.substring(1, 2) : c;
                    a = a.replace("{" + e + "}", '<select class="' + d + " " + b + '"></select>')
                }), a
            },
            initCombos: function() {
                for (var a in this.map) {
                    var b = this.$widget[0].querySelectorAll("." + a);
                    this["$" + a] = b.length ? angular.element(b) : null, this.fillCombo(a)
                }
            },
            fillCombo: function(a) {
                var b = this["$" + a];
                if (b) {
                    var c = "fill" + a.charAt(0).toUpperCase() + a.slice(1),
                        d = this[c](),
                        e = b.val();
                    b.html("");
                    for (var f = 0; f < d.length; f++) b.append('<option value="' + d[f][0] + '">' + d[f][1] + "</option>");
                    b.val(e)
                }
            },
            fillCommon: function(a) {
                var b, c = [];
                if ("name" === this.options.firstItem) {
                    b = moment.relativeTime || moment.langData()._relativeTime;
                    var d = "function" == typeof b[a] ? b[a](1, !0, a, !1) : b[a];
                    d = d.split(" ").reverse()[0], c.push(["", d])
                } else "empty" === this.options.firstItem && c.push(["", ""]);
                return c
            },
            fillDay: function() {
                var a, b, c = this.fillCommon("d"),
                    d = this.options.template.indexOf("DD") !== -1,
                    e = 31;
                if (this.options.smartDays && this.$month && this.$year) {
                    var f = parseInt(this.$month.val(), 10),
                        g = parseInt(this.$year.val(), 10);
                    isNaN(f) || isNaN(g) || (e = moment([g, f]).daysInMonth())
                }
                for (b = 1; b <= e; b++) a = d ? this.leadZero(b) : b, c.push([b, a]);
                return c
            },
            fillMonth: function() {
                var a, b, c = this.fillCommon("M"),
                    d = this.options.template.indexOf("MMMM") !== -1,
                    e = this.options.template.indexOf("MMM") !== -1,
                    f = this.options.template.indexOf("MM") !== -1;
                for (b = 0; b <= 11; b++) a = d ? moment().date(1).month(b).format("MMMM") : e ? moment().date(1).month(b).format("MMM") : f ? this.leadZero(b + 1) : b + 1, c.push([b, a]);
                return c
            },
            fillYear: function() {
                var a, b, c = [],
                    d = this.options.template.indexOf("YYYY") !== -1;
                for (b = this.options.maxYear; b >= this.options.minYear; b--) a = d ? b : (b + "").substring(2), c[this.options.yearDescending ? "push" : "unshift"]([b, a]);
                return c = this.fillCommon("y").concat(c)
            },
            fillHour: function() {
                var a, b, c = this.fillCommon("h"),
                    d = this.options.template.indexOf("h") !== -1,
                    e = (this.options.template.indexOf("H") !== -1, this.options.template.toLowerCase().indexOf("hh") !== -1),
                    f = d ? 1 : 0,
                    g = d ? 12 : 23;
                for (b = f; b <= g; b++) a = e ? this.leadZero(b) : b, c.push([b, a]);
                return c
            },
            fillMinute: function() {
                var a, b, c = this.fillCommon("m"),
                    d = this.options.template.indexOf("mm") !== -1;
                for (b = 0; b <= 59; b += this.options.minuteStep) a = d ? this.leadZero(b) : b, c.push([b, a]);
                return c
            },
            fillSecond: function() {
                var a, b, c = this.fillCommon("s"),
                    d = this.options.template.indexOf("ss") !== -1;
                for (b = 0; b <= 59; b += this.options.secondStep) a = d ? this.leadZero(b) : b, c.push([b, a]);
                return c
            },
            fillAmpm: function() {
                var a = this.options.template.indexOf("a") !== -1,
                    b = (this.options.template.indexOf("A") !== -1, [
                        ["am", a ? "am" : "AM"],
                        ["pm", a ? "pm" : "PM"]
                    ]);
                return b
            },
            getValue: function(a) {
                var b, c = {},
                    d = this,
                    e = !1;
                return angular.forEach(this.map, function(a, b) {
                    if ("ampm" !== b) {
                        var f = "day" === b ? 1 : 0;
                        return c[b] = d["$" + b] ? parseInt(d["$" + b].val(), 10) : f, isNaN(c[b]) ? (e = !0, !1) : void 0
                    }
                }), e ? "" : (this.$ampm && (12 === c.hour ? c.hour = "am" === this.$ampm.val() ? 0 : 12 : c.hour = "am" === this.$ampm.val() ? c.hour : c.hour + 12), b = moment([c.year, c.month, c.day, c.hour, c.minute, c.second]), this.highlight(b), a = void 0 === a ? this.options.format : a, null === a ? b.isValid() ? b : null : b.isValid() ? b.format(a) : "")
            },
            setValue: function(a) {
                function b(a, b) {
                    var c = {};
                    return angular.forEach(a.children("option"), function(a, d) {
                        var e = angular.element(a).attr("value");
                        if ("" !== e) {
                            var f = Math.abs(e - b);
                            ("undefined" == typeof c.distance || f < c.distance) && (c = {
                                value: e,
                                distance: f
                            })
                        }
                    }), c.value
                }
                if (a) {
                    var c = "string" == typeof a ? moment(a, this.options.format, !0) : moment(a),
                        d = this,
                        e = {};
                    c.isValid() && (angular.forEach(this.map, function(a, b) {
                        "ampm" !== b && (e[b] = c[a[1]]())
                    }), this.$ampm && (e.hour >= 12 ? (e.ampm = "pm", e.hour > 12 && (e.hour -= 12)) : (e.ampm = "am", 0 === e.hour && (e.hour = 12))), angular.forEach(e, function(a, c) {
                        d["$" + c] && ("minute" === c && d.options.minuteStep > 1 && d.options.roundTime && (a = b(d["$" + c], a)), "second" === c && d.options.secondStep > 1 && d.options.roundTime && (a = b(d["$" + c], a)), d["$" + c].val(a))
                    }), this.options.smartDays && this.fillCombo("day"), this.$element.val(c.format(this.options.format)).triggerHandler("change"))
                }
            },
            highlight: function(a) {
                a.isValid() ? this.options.errorClass ? this.$widget.removeClass(this.options.errorClass) : this.$widget.find("select").css("border-color", this.borderColor) : this.options.errorClass ? this.$widget.addClass(this.options.errorClass) : (this.borderColor || (this.borderColor = this.$widget.find("select").css("border-color")), this.$widget.find("select").css("border-color", "red"))
            },
            leadZero: function(a) {
                return a <= 9 ? "0" + a : a
            },
            destroy: function() {
                this.$widget.remove(), this.$element.removeData("combodate").show()
            }
        }, {
            getInstance: function(b, c) {
                return new a(b, c)
            }
        }
    }]), angular.module("xeditable").factory("editableIcons", function() {
        var a = {
            "default": {
                bs2: {
                    ok: "icon-ok icon-white",
                    cancel: "icon-remove",
                    clear: "icon-trash"
                },
                bs3: {
                    ok: "glyphicon glyphicon-ok",
                    cancel: "glyphicon glyphicon-remove",
                    clear: "glyphicon glyphicon-trash"
                }
            },
            external: {
                "font-awesome": {
                    ok: "fa fa-check",
                    cancel: "fa fa-times",
                    clear: "fa fa-trash"
                }
            }
        };
        return a
    }), angular.module("xeditable").factory("editableThemes", function() {
        var a = {
            "default": {
                formTpl: '<form class="editable-wrap"></form>',
                noformTpl: '<span class="editable-wrap"></span>',
                controlsTpl: '<span class="editable-controls"></span>',
                inputTpl: "",
                errorTpl: '<div class="editable-error" data-ng-if="$error" data-ng-bind="$error"></div>',
                buttonsTpl: '<span class="editable-buttons"></span>',
                submitTpl: '<button type="submit">save</button>',
                cancelTpl: '<button type="button" ng-click="$form.$cancel()">cancel</button>',
                resetTpl: '<button type="reset">clear</button>'
            },
            bs2: {
                formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
                noformTpl: '<span class="editable-wrap"></span>',
                controlsTpl: '<div class="editable-controls controls control-group" ng-class="{\'error\': $error}"></div>',
                inputTpl: "",
                errorTpl: '<div class="editable-error help-block" data-ng-if="$error" data-ng-bind="$error"></div>',
                buttonsTpl: '<span class="editable-buttons"></span>',
                submitTpl: '<button type="submit" class="btn btn-primary"><span></span></button>',
                cancelTpl: '<button type="button" class="btn" ng-click="$form.$cancel()"><span></span></button>',
                resetTpl: '<button type="reset" class="btn btn-danger">clear</button>'
            },
            bs3: {
                formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
                noformTpl: '<span class="editable-wrap"></span>',
                controlsTpl: '<div class="editable-controls form-group" ng-class="{\'has-error\': $error}"></div>',
                inputTpl: "",
                errorTpl: '<div class="editable-error help-block" data-ng-if="$error" data-ng-bind="$error"></div>',
                buttonsTpl: '<span class="editable-buttons"></span>',
                submitTpl: '<button type="submit" class="btn btn-primary"><span></span></button>',
                cancelTpl: '<button type="button" class="btn btn-default" ng-click="$form.$cancel()"><span></span></button>',
                resetTpl: '<button type="reset" class="btn btn-danger">clear</button>',
                buttonsClass: "",
                inputClass: "",
                postrender: function() {
                    switch (this.directiveName) {
                        case "editableText":
                        case "editableSelect":
                        case "editableTextarea":
                        case "editableEmail":
                        case "editableTel":
                        case "editableNumber":
                        case "editableUrl":
                        case "editableSearch":
                        case "editableDate":
                        case "editableDatetime":
                        case "editableBsdate":
                        case "editableTime":
                        case "editableMonth":
                        case "editableWeek":
                        case "editablePassword":
                        case "editableDatetimeLocal":
                            if (this.inputEl.addClass("form-control"), this.theme.inputClass) {
                                if (this.inputEl.attr("multiple") && ("input-sm" === this.theme.inputClass || "input-lg" === this.theme.inputClass)) break;
                                this.inputEl.addClass(this.theme.inputClass)
                            }
                            break;
                        case "editableCheckbox":
                            this.editorEl.addClass("checkbox")
                    }
                    this.buttonsEl && this.theme.buttonsClass && this.buttonsEl.find("button").addClass(this.theme.buttonsClass)
                }
            },
            semantic: {
                formTpl: '<form class="editable-wrap ui form" ng-class="{\'error\': $error}" role="form"></form>',
                noformTpl: '<span class="editable-wrap"></span>',
                controlsTpl: '<div class="editable-controls ui fluid input" ng-class="{\'error\': $error}"></div>',
                inputTpl: "",
                errorTpl: '<div class="editable-error ui error message" data-ng-if="$error" data-ng-bind="$error"></div>',
                buttonsTpl: '<span class="mini ui buttons"></span>',
                submitTpl: '<button type="submit" class="ui primary button"><i class="ui check icon"></i></button>',
                cancelTpl: '<button type="button" class="ui button" ng-click="$form.$cancel()"><i class="ui cancel icon"></i></button>',
                resetTpl: '<button type="reset" class="ui button">clear</button>'
            }
        };
        return a
    }), ! function(a, b) {
        "object" == typeof exports && "object" == typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? exports["angular-file-upload"] = b() : a["angular-file-upload"] = b()
    }(this, function() {
        return function(a) {
            function b(d) {
                if (c[d]) return c[d].exports;
                var e = c[d] = {
                    exports: {},
                    id: d,
                    loaded: !1
                };
                return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports
            }
            var c = {};
            return b.m = a, b.c = c, b.p = "", b(0)
        }([function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }
            var e = c(1),
                f = d(e),
                g = c(2),
                h = d(g),
                i = c(3),
                j = d(i),
                k = c(4),
                l = d(k),
                m = c(5),
                n = d(m),
                o = c(6),
                p = d(o),
                q = c(7),
                r = d(q),
                s = c(8),
                t = d(s),
                u = c(9),
                v = d(u),
                w = c(10),
                x = d(w),
                y = c(11),
                z = d(y),
                A = c(12),
                B = d(A),
                C = c(13),
                D = d(C);
            angular.module(f["default"].name, []).value("fileUploaderOptions", h["default"]).factory("FileUploader", j["default"]).factory("FileLikeObject", l["default"]).factory("FileItem", n["default"]).factory("FileDirective", p["default"]).factory("FileSelect", r["default"]).factory("FileDrop", v["default"]).factory("FileOver", x["default"]).factory("Pipeline", t["default"]).directive("nvFileSelect", z["default"]).directive("nvFileDrop", B["default"]).directive("nvFileOver", D["default"]).run(["FileUploader", "FileLikeObject", "FileItem", "FileDirective", "FileSelect", "FileDrop", "FileOver", "Pipeline", function(a, b, c, d, e, f, g, h) {
                a.FileLikeObject = b, a.FileItem = c, a.FileDirective = d, a.FileSelect = e, a.FileDrop = f, a.FileOver = g, a.Pipeline = h
            }])
        }, function(a, b) {
            a.exports = {
                name: "angularFileUpload"
            }
        }, function(a, b) {
            "use strict";
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = {
                url: "/",
                alias: "file",
                headers: {},
                queue: [],
                progress: 0,
                autoUpload: !1,
                removeAfterUpload: !1,
                method: "POST",
                filters: [],
                formData: [],
                queueLimit: Number.MAX_VALUE,
                withCredentials: !1,
                disableMultipart: !1
            }
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function f(a, b, c, d, f, h, i, t) {
                var u = d.File,
                    v = d.FormData,
                    w = function() {
                        function d(b) {
                            e(this, d);
                            var c = k(a);
                            l(this, c, b, {
                                isUploading: !1,
                                _nextIndex: 0,
                                _directives: {
                                    select: [],
                                    drop: [],
                                    over: []
                                }
                            }), this.filters.unshift({
                                name: "queueLimit",
                                fn: this._queueLimitFilter
                            }), this.filters.unshift({
                                name: "folder",
                                fn: this._folderFilter
                            })
                        }
                        return d.prototype.addToQueue = function(a, b, c) {
                            var d = this,
                                e = this.isArrayLikeObject(a) ? Array.prototype.slice.call(a) : [a],
                                f = this._getFilters(c),
                                j = this.queue.length,
                                k = [],
                                l = function n() {
                                    var a = e.shift();
                                    if (r(a)) return m();
                                    var c = d.isFile(a) ? a : new h(a),
                                        j = d._convertFiltersToPipes(f),
                                        l = new t(j),
                                        o = function(a) {
                                            var b = a.pipe.originalFilter,
                                                c = g(a.args, 2),
                                                e = c[0],
                                                f = c[1];
                                            d._onWhenAddingFileFailed(e, b, f), n()
                                        },
                                        p = function(a, b) {
                                            var c = new i(d, a, b);
                                            k.push(c), d.queue.push(c), d._onAfterAddingFile(c), n()
                                        };
                                    l.onThrown = o, l.onSuccessful = p, l.exec(c, b)
                                },
                                m = function() {
                                    d.queue.length !== j && (d._onAfterAddingAll(k), d.progress = d._getTotalProgress()), d._render(), d.autoUpload && d.uploadAll()
                                };
                            l()
                        }, d.prototype.removeFromQueue = function(a) {
                            var b = this.getIndexOfItem(a),
                                c = this.queue[b];
                            c.isUploading && c.cancel(), this.queue.splice(b, 1), c._destroy(), this.progress = this._getTotalProgress()
                        }, d.prototype.clearQueue = function() {
                            for (; this.queue.length;) this.queue[0].remove();
                            this.progress = 0
                        }, d.prototype.uploadItem = function(a) {
                            var b = this.getIndexOfItem(a),
                                c = this.queue[b],
                                d = this.isHTML5 ? "_xhrTransport" : "_iframeTransport";
                            c._prepareToUploading(), this.isUploading || (this._onBeforeUploadItem(c), c.isCancel || (c.isUploading = !0, this.isUploading = !0, this[d](c), this._render()))
                        }, d.prototype.cancelItem = function(a) {
                            var b = this,
                                c = this.getIndexOfItem(a),
                                d = this.queue[c],
                                e = this.isHTML5 ? "_xhr" : "_form";
                            d && (d.isCancel = !0, d.isUploading ? d[e].abort() : ! function() {
                                var a = [void 0, 0, {}],
                                    c = function() {
                                        b._onCancelItem.apply(b, [d].concat(a)), b._onCompleteItem.apply(b, [d].concat(a))
                                    };
                                f(c)
                            }())
                        }, d.prototype.uploadAll = function() {
                            var a = this.getNotUploadedItems().filter(function(a) {
                                return !a.isUploading
                            });
                            a.length && (m(a, function(a) {
                                return a._prepareToUploading()
                            }), a[0].upload())
                        }, d.prototype.cancelAll = function() {
                            var a = this.getNotUploadedItems();
                            m(a, function(a) {
                                return a.cancel()
                            })
                        }, d.prototype.isFile = function(a) {
                            return this.constructor.isFile(a)
                        }, d.prototype.isFileLikeObject = function(a) {
                            return this.constructor.isFileLikeObject(a)
                        }, d.prototype.isArrayLikeObject = function(a) {
                            return this.constructor.isArrayLikeObject(a)
                        }, d.prototype.getIndexOfItem = function(a) {
                            return o(a) ? a : this.queue.indexOf(a)
                        }, d.prototype.getNotUploadedItems = function() {
                            return this.queue.filter(function(a) {
                                return !a.isUploaded
                            })
                        }, d.prototype.getReadyItems = function() {
                            return this.queue.filter(function(a) {
                                return a.isReady && !a.isUploading
                            }).sort(function(a, b) {
                                return a.index - b.index
                            })
                        }, d.prototype.destroy = function() {
                            var a = this;
                            m(this._directives, function(b) {
                                m(a._directives[b], function(a) {
                                    a.destroy()
                                })
                            })
                        }, d.prototype.onAfterAddingAll = function(a) {}, d.prototype.onAfterAddingFile = function(a) {}, d.prototype.onWhenAddingFileFailed = function(a, b, c) {}, d.prototype.onBeforeUploadItem = function(a) {}, d.prototype.onProgressItem = function(a, b) {}, d.prototype.onProgressAll = function(a) {}, d.prototype.onSuccessItem = function(a, b, c, d) {}, d.prototype.onErrorItem = function(a, b, c, d) {}, d.prototype.onCancelItem = function(a, b, c, d) {}, d.prototype.onCompleteItem = function(a, b, c, d) {}, d.prototype.onCompleteAll = function() {}, d.prototype._getTotalProgress = function(a) {
                            if (this.removeAfterUpload) return a || 0;
                            var b = this.getNotUploadedItems().length,
                                c = b ? this.queue.length - b : this.queue.length,
                                d = 100 / this.queue.length,
                                e = (a || 0) * d / 100;
                            return Math.round(c * d + e)
                        }, d.prototype._getFilters = function(a) {
                            if (!a) return this.filters;
                            if (q(a)) return a;
                            var b = a.match(/[^\s,]+/g);
                            return this.filters.filter(function(a) {
                                return -1 !== b.indexOf(a.name)
                            })
                        }, d.prototype._convertFiltersToPipes = function(a) {
                            var b = this;
                            return a.map(function(a) {
                                var c = j(b, a.fn);
                                return c.isAsync = 3 === a.fn.length, c.originalFilter = a, c
                            })
                        }, d.prototype._render = function() {
                            b.$$phase || b.$apply()
                        }, d.prototype._folderFilter = function(a) {
                            return !(!a.size && !a.type)
                        }, d.prototype._queueLimitFilter = function() {
                            return this.queue.length < this.queueLimit
                        }, d.prototype._isSuccessCode = function(a) {
                            return a >= 200 && 300 > a || 304 === a
                        }, d.prototype._transformResponse = function(a, b) {
                            var d = this._headersGetter(b);
                            return m(c.defaults.transformResponse, function(b) {
                                a = b(a, d)
                            }), a
                        }, d.prototype._parseHeaders = function(a) {
                            var b, c, d, e = {};
                            return a ? (m(a.split("\n"), function(a) {
                                d = a.indexOf(":"), b = a.slice(0, d).trim().toLowerCase(), c = a.slice(d + 1).trim(), b && (e[b] = e[b] ? e[b] + ", " + c : c)
                            }), e) : e
                        }, d.prototype._headersGetter = function(a) {
                            return function(b) {
                                return b ? a[b.toLowerCase()] || null : a
                            }
                        }, d.prototype._xhrTransport = function(a) {
                            var b, c = this,
                                d = a._xhr = new XMLHttpRequest;
                            if (a.disableMultipart ? b = a._file : (b = new v, m(a.formData, function(a) {
                                    m(a, function(a, c) {
                                        b.append(c, a)
                                    })
                                }), b.append(a.alias, a._file, a.file.name)), "number" != typeof a._file.size) throw new TypeError("The file specified is no longer valid");
                            d.upload.onprogress = function(b) {
                                var d = Math.round(b.lengthComputable ? 100 * b.loaded / b.total : 0);
                                c._onProgressItem(a, d)
                            }, d.onload = function() {
                                var b = c._parseHeaders(d.getAllResponseHeaders()),
                                    e = c._transformResponse(d.response, b),
                                    f = c._isSuccessCode(d.status) ? "Success" : "Error",
                                    g = "_on" + f + "Item";
                                c[g](a, e, d.status, b), c._onCompleteItem(a, e, d.status, b)
                            }, d.onerror = function() {
                                var b = c._parseHeaders(d.getAllResponseHeaders()),
                                    e = c._transformResponse(d.response, b);
                                c._onErrorItem(a, e, d.status, b), c._onCompleteItem(a, e, d.status, b)
                            }, d.onabort = function() {
                                var b = c._parseHeaders(d.getAllResponseHeaders()),
                                    e = c._transformResponse(d.response, b);
                                c._onCancelItem(a, e, d.status, b), c._onCompleteItem(a, e, d.status, b)
                            }, d.open(a.method, a.url, !0), d.withCredentials = a.withCredentials, m(a.headers, function(a, b) {
                                d.setRequestHeader(b, a)
                            }), d.send(b)
                        }, d.prototype._iframeTransport = function(a) {
                            var b = this,
                                c = s('<form style="display: none;" />'),
                                d = s('<iframe name="iframeTransport' + Date.now() + '">'),
                                e = a._input;
                            a._form && a._form.replaceWith(e), a._form = c, e.prop("name", a.alias), m(a.formData, function(a) {
                                m(a, function(a, b) {
                                    var d = s('<input type="hidden" name="' + b + '" />');
                                    d.val(a), c.append(d)
                                })
                            }), c.prop({
                                action: a.url,
                                method: "POST",
                                target: d.prop("name"),
                                enctype: "multipart/form-data",
                                encoding: "multipart/form-data"
                            }), d.bind("load", function() {
                                var c = "",
                                    e = 200;
                                try {
                                    c = d[0].contentDocument.body.innerHTML
                                } catch (f) {
                                    e = 500
                                }
                                var g = {
                                        response: c,
                                        status: e,
                                        dummy: !0
                                    },
                                    h = {},
                                    i = b._transformResponse(g.response, h);
                                b._onSuccessItem(a, i, g.status, h), b._onCompleteItem(a, i, g.status, h)
                            }), c.abort = function() {
                                var f, g = {
                                        status: 0,
                                        dummy: !0
                                    },
                                    h = {};
                                d.unbind("load").prop("src", "javascript:false;"), c.replaceWith(e), b._onCancelItem(a, f, g.status, h), b._onCompleteItem(a, f, g.status, h)
                            }, e.after(c), c.append(e).append(d), c[0].submit()
                        }, d.prototype._onWhenAddingFileFailed = function(a, b, c) {
                            this.onWhenAddingFileFailed(a, b, c)
                        }, d.prototype._onAfterAddingFile = function(a) {
                            this.onAfterAddingFile(a)
                        }, d.prototype._onAfterAddingAll = function(a) {
                            this.onAfterAddingAll(a)
                        }, d.prototype._onBeforeUploadItem = function(a) {
                            a._onBeforeUpload(), this.onBeforeUploadItem(a)
                        }, d.prototype._onProgressItem = function(a, b) {
                            var c = this._getTotalProgress(b);
                            this.progress = c, a._onProgress(b), this.onProgressItem(a, b), this.onProgressAll(c), this._render()
                        }, d.prototype._onSuccessItem = function(a, b, c, d) {
                            a._onSuccess(b, c, d), this.onSuccessItem(a, b, c, d)
                        }, d.prototype._onErrorItem = function(a, b, c, d) {
                            a._onError(b, c, d), this.onErrorItem(a, b, c, d)
                        }, d.prototype._onCancelItem = function(a, b, c, d) {
                            a._onCancel(b, c, d), this.onCancelItem(a, b, c, d)
                        }, d.prototype._onCompleteItem = function(a, b, c, d) {
                            a._onComplete(b, c, d), this.onCompleteItem(a, b, c, d);
                            var e = this.getReadyItems()[0];
                            return this.isUploading = !1, p(e) ? void e.upload() : (this.onCompleteAll(), this.progress = this._getTotalProgress(), void this._render())
                        }, d.isFile = function(a) {
                            return u && a instanceof u
                        }, d.isFileLikeObject = function(a) {
                            return a instanceof h
                        }, d.isArrayLikeObject = function(a) {
                            return n(a) && "length" in a
                        }, d.inherit = function(a, b) {
                            a.prototype = Object.create(b.prototype), a.prototype.constructor = a, a.super_ = b
                        }, d
                    }();
                return w.prototype.isHTML5 = !(!u || !v), w.isHTML5 = w.prototype.isHTML5, w
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            });
            var g = function() {
                function a(a, b) {
                    var c = [],
                        d = !0,
                        e = !1,
                        f = void 0;
                    try {
                        for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                    } catch (i) {
                        e = !0, f = i
                    } finally {
                        try {
                            !d && h["return"] && h["return"]()
                        } finally {
                            if (e) throw f
                        }
                    }
                    return c
                }
                return function(b, c) {
                    if (Array.isArray(b)) return b;
                    if (Symbol.iterator in Object(b)) return a(b, c);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }();
            b["default"] = f;
            var h = c(1),
                i = (d(h), angular),
                j = i.bind,
                k = i.copy,
                l = i.extend,
                m = i.forEach,
                n = i.isObject,
                o = i.isNumber,
                p = i.isDefined,
                q = i.isArray,
                r = i.isUndefined,
                s = i.element;
            f.$inject = ["fileUploaderOptions", "$rootScope", "$http", "$window", "$timeout", "FileLikeObject", "FileItem", "Pipeline"]
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function f() {
                return function() {
                    function a(b) {
                        e(this, a);
                        var c = j(b),
                            d = c ? b.value : b,
                            f = k(d) ? "FakePath" : "Object",
                            g = "_createFrom" + f;
                        this[g](d)
                    }
                    return a.prototype._createFromFakePath = function(a) {
                        this.lastModifiedDate = null, this.size = null, this.type = "like/" + a.slice(a.lastIndexOf(".") + 1).toLowerCase(), this.name = a.slice(a.lastIndexOf("/") + a.lastIndexOf("\\") + 2)
                    }, a.prototype._createFromObject = function(a) {
                        this.lastModifiedDate = i(a.lastModifiedDate), this.size = a.size, this.type = a.type, this.name = a.name
                    }, a
                }()
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = f;
            var g = c(1),
                h = (d(g), angular),
                i = h.copy,
                j = h.isElement,
                k = h.isString
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function f(a, b) {
                return function() {
                    function c(a, d, f) {
                        e(this, c);
                        var g = l(d),
                            h = g ? k(d) : null,
                            m = g ? null : d;
                        j(this, {
                            url: a.url,
                            alias: a.alias,
                            headers: i(a.headers),
                            formData: i(a.formData),
                            removeAfterUpload: a.removeAfterUpload,
                            withCredentials: a.withCredentials,
                            disableMultipart: a.disableMultipart,
                            method: a.method
                        }, f, {
                            uploader: a,
                            file: new b(d),
                            isReady: !1,
                            isUploading: !1,
                            isUploaded: !1,
                            isSuccess: !1,
                            isCancel: !1,
                            isError: !1,
                            progress: 0,
                            index: null,
                            _file: m,
                            _input: h
                        }), h && this._replaceNode(h)
                    }
                    return c.prototype.upload = function() {
                        try {
                            this.uploader.uploadItem(this)
                        } catch (a) {
                            this.uploader._onCompleteItem(this, "", 0, []), this.uploader._onErrorItem(this, "", 0, [])
                        }
                    }, c.prototype.cancel = function() {
                        this.uploader.cancelItem(this)
                    }, c.prototype.remove = function() {
                        this.uploader.removeFromQueue(this)
                    }, c.prototype.onBeforeUpload = function() {}, c.prototype.onProgress = function(a) {}, c.prototype.onSuccess = function(a, b, c) {}, c.prototype.onError = function(a, b, c) {}, c.prototype.onCancel = function(a, b, c) {}, c.prototype.onComplete = function(a, b, c) {}, c.prototype._onBeforeUpload = function() {
                        this.isReady = !0, this.isUploading = !1, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !1, this.isError = !1, this.progress = 0, this.onBeforeUpload()
                    }, c.prototype._onProgress = function(a) {
                        this.progress = a, this.onProgress(a)
                    }, c.prototype._onSuccess = function(a, b, c) {
                        this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !0, this.isCancel = !1, this.isError = !1, this.progress = 100, this.index = null, this.onSuccess(a, b, c)
                    }, c.prototype._onError = function(a, b, c) {
                        this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !1, this.isCancel = !1, this.isError = !0, this.progress = 0, this.index = null, this.onError(a, b, c)
                    }, c.prototype._onCancel = function(a, b, c) {
                        this.isReady = !1, this.isUploading = !1, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !0, this.isError = !1, this.progress = 0, this.index = null, this.onCancel(a, b, c)
                    }, c.prototype._onComplete = function(a, b, c) {
                        this.onComplete(a, b, c), this.removeAfterUpload && this.remove()
                    }, c.prototype._destroy = function() {
                        this._input && this._input.remove(), this._form && this._form.remove(), delete this._form, delete this._input
                    }, c.prototype._prepareToUploading = function() {
                        this.index = this.index || ++this.uploader._nextIndex, this.isReady = !0
                    }, c.prototype._replaceNode = function(b) {
                        var c = a(b.clone())(b.scope());
                        c.prop("value", null), b.css("display", "none"), b.after(c)
                    }, c
                }()
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = f;
            var g = c(1),
                h = (d(g), angular),
                i = h.copy,
                j = h.extend,
                k = h.element,
                l = h.isElement;
            f.$inject = ["$compile", "FileLikeObject"]
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function f() {
                var a = function() {
                    function a(b) {
                        e(this, a), i(this, b), this.uploader._directives[this.prop].push(this), this._saveLinks(), this.bind()
                    }
                    return a.prototype.bind = function() {
                        for (var a in this.events) {
                            var b = this.events[a];
                            this.element.bind(a, this[b])
                        }
                    }, a.prototype.unbind = function() {
                        for (var a in this.events) this.element.unbind(a, this.events[a])
                    }, a.prototype.destroy = function() {
                        var a = this.uploader._directives[this.prop].indexOf(this);
                        this.uploader._directives[this.prop].splice(a, 1), this.unbind()
                    }, a.prototype._saveLinks = function() {
                        for (var a in this.events) {
                            var b = this.events[a];
                            this[b] = this[b].bind(this)
                        }
                    }, a
                }();
                return a.prototype.events = {}, a
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = f;
            var g = c(1),
                h = (d(g), angular),
                i = h.extend
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function f(a, b) {
                if (!a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !b || "object" != typeof b && "function" != typeof b ? a : b
            }

            function g(a, b) {
                if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
                a.prototype = Object.create(b && b.prototype, {
                    constructor: {
                        value: a,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
            }

            function h(a, b) {
                return function(b) {
                    function c(a) {
                        e(this, c);
                        var d = k(a, {
                                events: {
                                    $destroy: "destroy",
                                    change: "onChange"
                                },
                                prop: "select"
                            }),
                            g = f(this, b.call(this, d));
                        return g.uploader.isHTML5 || g.element.removeAttr("multiple"), g.element.prop("value", null), g
                    }
                    return g(c, b), c.prototype.getOptions = function() {}, c.prototype.getFilters = function() {}, c.prototype.isEmptyAfterSelection = function() {
                        return !!this.element.attr("multiple")
                    }, c.prototype.onChange = function() {
                        var b = this.uploader.isHTML5 ? this.element[0].files : this.element[0],
                            c = this.getOptions(),
                            d = this.getFilters();
                        this.uploader.isHTML5 || this.destroy(), this.uploader.addToQueue(b, c, d), this.isEmptyAfterSelection() && (this.element.prop("value", null), this.element.replaceWith(a(this.element.clone())(this.scope)))
                    }, c
                }(b)
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = h;
            var i = c(1),
                j = (d(i), angular),
                k = j.extend;
            h.$inject = ["$compile", "FileDirective"]
        }, function(a, b) {
            "use strict";

            function c(a) {
                if (Array.isArray(a)) {
                    for (var b = 0, c = Array(a.length); b < a.length; b++) c[b] = a[b];
                    return c
                }
                return Array.from(a)
            }

            function d(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function e(a) {
                return function() {
                    function b() {
                        var a = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0];
                        d(this, b), this.pipes = a
                    }
                    return b.prototype.next = function(b) {
                        var d = this.pipes.shift();
                        if (h(d)) return void this.onSuccessful.apply(this, c(b));
                        var e = new Error("The filter has not passed");
                        if (e.pipe = d, e.args = b, d.isAsync) {
                            var f = a.defer(),
                                i = g(this, this.next, b),
                                j = g(this, this.onThrown, e);
                            f.promise.then(i, j), d.apply(void 0, c(b).concat([f]))
                        } else {
                            var k = Boolean(d.apply(void 0, c(b)));
                            k ? this.next(b) : this.onThrown(e)
                        }
                    }, b.prototype.exec = function() {
                        for (var a = arguments.length, b = Array(a), c = 0; a > c; c++) b[c] = arguments[c];
                        this.next(b)
                    }, b.prototype.onThrown = function(a) {}, b.prototype.onSuccessful = function() {}, b
                }()
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = e;
            var f = angular,
                g = f.bind,
                h = f.isUndefined;
            e.$inject = ["$q"]
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function f(a, b) {
                if (!a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !b || "object" != typeof b && "function" != typeof b ? a : b
            }

            function g(a, b) {
                if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
                a.prototype = Object.create(b && b.prototype, {
                    constructor: {
                        value: a,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
            }

            function h(a) {
                return function(a) {
                    function b(c) {
                        e(this, b);
                        var d = k(c, {
                            events: {
                                $destroy: "destroy",
                                drop: "onDrop",
                                dragover: "onDragOver",
                                dragleave: "onDragLeave"
                            },
                            prop: "drop"
                        });
                        return f(this, a.call(this, d))
                    }
                    return g(b, a), b.prototype.getOptions = function() {}, b.prototype.getFilters = function() {}, b.prototype.onDrop = function(a) {
                        var b = this._getTransfer(a);
                        if (b) {
                            var c = this.getOptions(),
                                d = this.getFilters();
                            this._preventAndStop(a), l(this.uploader._directives.over, this._removeOverClass, this), this.uploader.addToQueue(b.files, c, d)
                        }
                    }, b.prototype.onDragOver = function(a) {
                        var b = this._getTransfer(a);
                        this._haveFiles(b.types) && (b.dropEffect = "copy", this._preventAndStop(a), l(this.uploader._directives.over, this._addOverClass, this))
                    }, b.prototype.onDragLeave = function(a) {
                        a.currentTarget !== this.element[0] && (this._preventAndStop(a), l(this.uploader._directives.over, this._removeOverClass, this))
                    }, b.prototype._getTransfer = function(a) {
                        return a.dataTransfer ? a.dataTransfer : a.originalEvent.dataTransfer
                    }, b.prototype._preventAndStop = function(a) {
                        a.preventDefault(), a.stopPropagation()
                    }, b.prototype._haveFiles = function(a) {
                        return !!a && (a.indexOf ? -1 !== a.indexOf("Files") : !!a.contains && a.contains("Files"))
                    }, b.prototype._addOverClass = function(a) {
                        a.addOverClass()
                    }, b.prototype._removeOverClass = function(a) {
                        a.removeOverClass()
                    }, b
                }(a)
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = h;
            var i = c(1),
                j = (d(i), angular),
                k = j.extend,
                l = j.forEach;
            h.$inject = ["FileDirective"]
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }

            function f(a, b) {
                if (!a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !b || "object" != typeof b && "function" != typeof b ? a : b
            }

            function g(a, b) {
                if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
                a.prototype = Object.create(b && b.prototype, {
                    constructor: {
                        value: a,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
            }

            function h(a) {
                return function(a) {
                    function b(c) {
                        e(this, b);
                        var d = k(c, {
                            events: {
                                $destroy: "destroy"
                            },
                            prop: "over",
                            overClass: "nv-file-over"
                        });
                        return f(this, a.call(this, d))
                    }
                    return g(b, a), b.prototype.addOverClass = function() {
                        this.element.addClass(this.getOverClass())
                    }, b.prototype.removeOverClass = function() {
                        this.element.removeClass(this.getOverClass())
                    }, b.prototype.getOverClass = function() {
                        return this.overClass
                    }, b
                }(a)
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = h;
            var i = c(1),
                j = (d(i), angular),
                k = j.extend;
            h.$inject = ["FileDirective"]
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b, c) {
                return {
                    link: function(d, e, f) {
                        var g = d.$eval(f.uploader);
                        if (!(g instanceof b)) throw new TypeError('"Uploader" must be an instance of FileUploader');
                        var h = new c({
                            uploader: g,
                            element: e,
                            scope: d
                        });
                        h.getOptions = a(f.options).bind(h, d), h.getFilters = function() {
                            return f.filters
                        }
                    }
                }
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = e;
            var f = c(1);
            d(f), e.$inject = ["$parse", "FileUploader", "FileSelect"]
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b, c) {
                return {
                    link: function(d, e, f) {
                        var g = d.$eval(f.uploader);
                        if (!(g instanceof b)) throw new TypeError('"Uploader" must be an instance of FileUploader');
                        if (g.isHTML5) {
                            var h = new c({
                                uploader: g,
                                element: e
                            });
                            h.getOptions = a(f.options).bind(h, d), h.getFilters = function() {
                                return f.filters
                            }
                        }
                    }
                }
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = e;
            var f = c(1);
            d(f), e.$inject = ["$parse", "FileUploader", "FileDrop"]
        }, function(a, b, c) {
            "use strict";

            function d(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }

            function e(a, b) {
                return {
                    link: function(c, d, e) {
                        var f = c.$eval(e.uploader);
                        if (!(f instanceof a)) throw new TypeError('"Uploader" must be an instance of FileUploader');
                        var g = new b({
                            uploader: f,
                            element: d
                        });
                        g.getOverClass = function() {
                            return e.overClass || g.overClass
                        }
                    }
                }
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b["default"] = e;
            var f = c(1);
            d(f), e.$inject = ["FileUploader", "FileOver"]
        }])
    }), angular.module("gettext", []), angular.module("gettext").constant("gettext", function(a) {
        return a
    }), angular.module("gettext").factory("gettextCatalog", ["gettextPlurals", "gettextFallbackLanguage", "$http", "$cacheFactory", "$interpolate", "$rootScope", function(a, b, c, d, e, f) {
        function g() {
            f.$broadcast("gettextLanguageChanged")
        }
        var h, i = "$$noContext",
            j = '<span id="test" title="test" class="tested">test</span>',
            k = angular.element("<span>" + j + "</span>").html() !== j,
            l = function(a) {
                return h.debug && h.currentLanguage !== h.baseLanguage ? h.debugPrefix + a : a
            },
            m = function(a) {
                return h.showTranslatedMarkers ? h.translatedMarkerPrefix + a + h.translatedMarkerSuffix : a
            };
        return h = {
            debug: !1,
            debugPrefix: "[MISSING]: ",
            showTranslatedMarkers: !1,
            translatedMarkerPrefix: "[",
            translatedMarkerSuffix: "]",
            strings: {},
            baseLanguage: "en",
            currentLanguage: "en",
            cache: d("strings"),
            setCurrentLanguage: function(a) {
                this.currentLanguage = a, g()
            },
            getCurrentLanguage: function() {
                return this.currentLanguage
            },
            setStrings: function(b, c) {
                this.strings[b] || (this.strings[b] = {});
                var d = a(b, 1);
                for (var e in c) {
                    var f = c[e];
                    if (k && (e = angular.element("<span>" + e + "</span>").html()), angular.isString(f) || angular.isArray(f)) {
                        var h = {};
                        h[i] = f, f = h
                    }
                    for (var j in f) {
                        var l = f[j];
                        angular.isArray(l) || (f[j] = [], f[j][d] = l)
                    }
                    this.strings[b][e] = f
                }
                g()
            },
            getStringFormFor: function(b, c, d, e) {
                if (!b) return null;
                var f = this.strings[b] || {},
                    g = f[c] || {},
                    h = g[e || i] || [];
                return h[a(b, d)]
            },
            getString: function(a, c, d) {
                var f = b(this.currentLanguage);
                return a = this.getStringFormFor(this.currentLanguage, a, 1, d) || this.getStringFormFor(f, a, 1, d) || l(a), a = c ? e(a)(c) : a, m(a)
            },
            getPlural: function(a, c, d, f, g) {
                var h = b(this.currentLanguage);
                return c = this.getStringFormFor(this.currentLanguage, c, a, g) || this.getStringFormFor(h, c, a, g) || l(1 === a ? c : d), f && (f.$count = a, c = e(c)(f)), m(c)
            },
            loadRemote: function(a) {
                return c({
                    method: "GET",
                    url: a,
                    cache: h.cache
                }).then(function(a) {
                    var b = a.data;
                    for (var c in b) h.setStrings(c, b[c]);
                    return a
                })
            }
        }
    }]), angular.module("gettext").directive("translate", ["gettextCatalog", "$parse", "$animate", "$compile", "$window", "gettextUtil", function(a, b, c, d, e, f) {
        function g(a) {
            return f.lcFirst(a.replace(j, ""))
        }

        function h(a, b, c) {
            var d = Object.keys(b).filter(function(a) {
                return f.startsWith(a, j) && a !== j
            });
            if (!d.length) return null;
            var e = angular.extend({}, a),
                h = [];
            return d.forEach(function(d) {
                var f = a.$watch(b[d], function(a) {
                    var b = g(d);
                    e[b] = a, c(e)
                });
                h.push(f)
            }), a.$on("$destroy", function() {
                h.forEach(function(a) {
                    a()
                })
            }), e
        }
        var i = parseInt((/msie (\d+)/.exec(angular.lowercase(e.navigator.userAgent)) || [])[1], 10),
            j = "translateParams";
        return {
            restrict: "AE",
            terminal: !0,
            compile: function(e, g) {
                f.assert(!g.translatePlural || g.translateN, "translate-n", "translate-plural"), f.assert(!g.translateN || g.translatePlural, "translate-plural", "translate-n");
                var j = f.trim(e.html()),
                    k = g.translatePlural,
                    l = g.translateContext;
                return i <= 8 && "<!--IE fix-->" === j.slice(-13) && (j = j.slice(0, -13)), {
                    post: function(e, g, i) {
                        function m(b) {
                            b = b || null;
                            var h;
                            k ? (e = o || (o = e.$new()), e.$count = n(e), h = a.getPlural(e.$count, j, k, b, l)) : h = a.getString(j, b, l);
                            var i = g.contents();
                            if (0 !== i.length) {
                                if (h === f.trim(i.html())) return void(p && d(i)(e));
                                var m = angular.element("<span>" + h + "</span>");
                                d(m.contents())(e);
                                var q = m.contents();
                                c.enter(q, g), c.leave(i)
                            }
                        }
                        var n = b(i.translateN),
                            o = null,
                            p = !0,
                            q = h(e, i, m);
                        m(q), p = !1, i.translateN && e.$watch(i.translateN, function() {
                            m(q)
                        }), e.$on("gettextLanguageChanged", function() {
                            m(q)
                        })
                    }
                }
            }
        }
    }]), angular.module("gettext").factory("gettextFallbackLanguage", function() {
        var a = {},
            b = /([^_]+)_[^_]+$/;
        return function(c) {
            if (a[c]) return a[c];
            var d = b.exec(c);
            return d ? (a[c] = d[1], d[1]) : null
        }
    }), angular.module("gettext").filter("translate", ["gettextCatalog", function(a) {
        function b(b, c) {
            return a.getString(b, null, c)
        }
        return b.$stateful = !0, b
    }]), angular.module("gettext").factory("gettextPlurals", function() {
        function a(a) {
            return b[a] || (b[a] = a.split(/\-|_/).shift()), b[a]
        }
        var b = {
            pt_BR: "pt_BR",
            "pt-BR": "pt_BR"
        };
        return function(b, c) {
            switch (a(b)) {
                case "ay":
                case "bo":
                case "cgg":
                case "dz":
                case "fa":
                case "id":
                case "ja":
                case "jbo":
                case "ka":
                case "kk":
                case "km":
                case "ko":
                case "ky":
                case "lo":
                case "ms":
                case "my":
                case "sah":
                case "su":
                case "th":
                case "tt":
                case "ug":
                case "vi":
                case "wo":
                case "zh":
                    return 0;
                case "is":
                    return c % 10 != 1 || c % 100 == 11 ? 1 : 0;
                case "jv":
                    return 0 != c ? 1 : 0;
                case "mk":
                    return 1 == c || c % 10 == 1 ? 0 : 1;
                case "ach":
                case "ak":
                case "am":
                case "arn":
                case "br":
                case "fil":
                case "fr":
                case "gun":
                case "ln":
                case "mfe":
                case "mg":
                case "mi":
                case "oc":
                case "pt_BR":
                case "tg":
                case "ti":
                case "tr":
                case "uz":
                case "wa":
                case "zh":
                    return c > 1 ? 1 : 0;
                case "lv":
                    return c % 10 == 1 && c % 100 != 11 ? 0 : 0 != c ? 1 : 2;
                case "lt":
                    return c % 10 == 1 && c % 100 != 11 ? 0 : c % 10 >= 2 && (c % 100 < 10 || c % 100 >= 20) ? 1 : 2;
                case "be":
                case "bs":
                case "hr":
                case "ru":
                case "sr":
                case "uk":
                    return c % 10 == 1 && c % 100 != 11 ? 0 : c % 10 >= 2 && c % 10 <= 4 && (c % 100 < 10 || c % 100 >= 20) ? 1 : 2;
                case "mnk":
                    return 0 == c ? 0 : 1 == c ? 1 : 2;
                case "ro":
                    return 1 == c ? 0 : 0 == c || c % 100 > 0 && c % 100 < 20 ? 1 : 2;
                case "pl":
                    return 1 == c ? 0 : c % 10 >= 2 && c % 10 <= 4 && (c % 100 < 10 || c % 100 >= 20) ? 1 : 2;
                case "cs":
                case "sk":
                    return 1 == c ? 0 : c >= 2 && c <= 4 ? 1 : 2;
                case "sl":
                    return c % 100 == 1 ? 1 : c % 100 == 2 ? 2 : c % 100 == 3 || c % 100 == 4 ? 3 : 0;
                case "mt":
                    return 1 == c ? 0 : 0 == c || c % 100 > 1 && c % 100 < 11 ? 1 : c % 100 > 10 && c % 100 < 20 ? 2 : 3;
                case "gd":
                    return 1 == c || 11 == c ? 0 : 2 == c || 12 == c ? 1 : c > 2 && c < 20 ? 2 : 3;
                case "cy":
                    return 1 == c ? 0 : 2 == c ? 1 : 8 != c && 11 != c ? 2 : 3;
                case "kw":
                    return 1 == c ? 0 : 2 == c ? 1 : 3 == c ? 2 : 3;
                case "ga":
                    return 1 == c ? 0 : 2 == c ? 1 : c < 7 ? 2 : c < 11 ? 3 : 4;
                case "ar":
                    return 0 == c ? 0 : 1 == c ? 1 : 2 == c ? 2 : c % 100 >= 3 && c % 100 <= 10 ? 3 : c % 100 >= 11 ? 4 : 5;
                default:
                    return 1 != c ? 1 : 0
            }
        }
    }), angular.module("gettext").factory("gettextUtil", function() {
        function a(a, b, c) {
            if (!a) throw new Error("You should add a " + b + " attribute whenever you add a " + c + " attribute.")
        }

        function b(a, b) {
            return 0 === a.indexOf(b)
        }

        function c(a) {
            var b = a.charAt(0).toLowerCase();
            return b + a.substr(1)
        }
        var d = function() {
            return String.prototype.trim ? function(a) {
                return "string" == typeof a ? a.trim() : a
            } : function(a) {
                return "string" == typeof a ? a.replace(/^\s*/, "").replace(/\s*$/, "") : a
            }
        }();
        return {
            trim: d,
            assert: a,
            startsWith: b,
            lcFirst: c
        }
    }),
    function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function(a) {
        a.fn.addBack = a.fn.addBack || a.fn.andSelf, a.fn.extend({
            actual: function(b, c) {
                if (!this[b]) throw '$.actual => The jQuery method "' + b + '" you called does not exist';
                var d, e, f = {
                        absolute: !1,
                        clone: !1,
                        includeMargin: !1,
                        display: "block"
                    },
                    g = a.extend(f, c),
                    h = this.eq(0);
                if (g.clone === !0) d = function() {
                    var a = "position: absolute !important; top: -1000 !important; ";
                    h = h.clone().attr("style", a).appendTo("body")
                }, e = function() {
                    h.remove()
                };
                else {
                    var i, j = [],
                        k = "";
                    d = function() {
                        i = h.parents().addBack().filter(":hidden"), k += "visibility: hidden !important; display: " + g.display + " !important; ", g.absolute === !0 && (k += "position: absolute !important; "), i.each(function() {
                            var b = a(this),
                                c = b.attr("style");
                            j.push(c), b.attr("style", c ? c + ";" + k : k)
                        })
                    }, e = function() {
                        i.each(function(b) {
                            var c = a(this),
                                d = j[b];
                            void 0 === d ? c.removeAttr("style") : c.attr("style", d)
                        })
                    }
                }
                d();
                var l = /(outer)/.test(b) ? h[b](g.includeMargin) : h[b]();
                return e(), l
            }
        })
    }),
    function(a, b) {
        "use strict";
        var c = 6,
            d = 4,
            e = "asc",
            f = "desc",
            g = "_ng_field_",
            h = "_ng_depth_",
            i = "_ng_hidden_",
            j = "_ng_column_",
            k = /CUSTOM_FILTERS/g,
            l = /COL_FIELD/g,
            m = /DISPLAY_CELL_TEMPLATE/g,
            n = /EDITABLE_CELL_TEMPLATE/g,
            o = /CELL_EDITABLE_CONDITION/g,
            p = /<.+>/;
        a.ngGrid = {}, a.ngGrid.i18n = {};
        var q = (angular.module("ngGrid.services", []), angular.module("ngGrid.directives", [])),
            r = angular.module("ngGrid.filters", []);
        angular.module("ngGrid", ["ngGrid.services", "ngGrid.directives", "ngGrid.filters"]);
        var s = function(a, b, d, e) {
            if (void 0 === a.selectionProvider.selectedItems) return !0;
            var f, g = d.which || d.keyCode,
                h = !1,
                i = !1,
                j = void 0 === a.selectionProvider.lastClickedRow ? 1 : a.selectionProvider.lastClickedRow.rowIndex,
                k = a.columns.filter(function(a) {
                    return a.visible
                }),
                l = a.columns.filter(function(a) {
                    return a.pinned
                });
            if (a.col && (f = k.indexOf(a.col)), 37 !== g && 38 !== g && 39 !== g && 40 !== g && (e.config.noTabInterference || 9 !== g) && 13 !== g) return !0;
            if (a.enableCellSelection) {
                9 === g && d.preventDefault();
                var m = a.showSelectionCheckbox ? 1 === a.col.index : 0 === a.col.index,
                    n = 1 === a.$index || 0 === a.$index,
                    o = a.$index === a.renderedColumns.length - 1 || a.$index === a.renderedColumns.length - 2,
                    p = k.indexOf(a.col) === k.length - 1,
                    q = l.indexOf(a.col) === l.length - 1;
                if (37 === g || 9 === g && d.shiftKey) {
                    var r = 0;
                    m || (f -= 1), n ? m && 9 === g && d.shiftKey ? (r = e.$canvas.width(), f = k.length - 1, i = !0) : r = e.$viewport.scrollLeft() - a.col.width : l.length > 0 && (r = e.$viewport.scrollLeft() - k[f].width), e.$viewport.scrollLeft(r)
                } else(39 === g || 9 === g && !d.shiftKey) && (o ? p && 9 === g && !d.shiftKey ? (e.$viewport.scrollLeft(0), f = a.showSelectionCheckbox ? 1 : 0, h = !0) : e.$viewport.scrollLeft(e.$viewport.scrollLeft() + a.col.width) : q && e.$viewport.scrollLeft(0), p || (f += 1))
            }
            var s;
            s = a.configGroups.length > 0 ? e.rowFactory.parsedData.filter(function(a) {
                return !a.isAggRow
            }) : e.filteredRows;
            var t = 0;
            if (0 !== j && (38 === g || 13 === g && d.shiftKey || 9 === g && d.shiftKey && i) ? t = -1 : j !== s.length - 1 && (40 === g || 13 === g && !d.shiftKey || 9 === g && h) && (t = 1), t) {
                var u = s[j + t];
                u.beforeSelectionChange(u, d) && (u.continueSelection(d), a.$emit("ngGridEventDigestGridParent"), a.selectionProvider.lastClickedRow.renderedRowIndex >= a.renderedRows.length - c - 2 ? e.$viewport.scrollTop(e.$viewport.scrollTop() + a.rowHeight) : a.selectionProvider.lastClickedRow.renderedRowIndex <= c + 2 && e.$viewport.scrollTop(e.$viewport.scrollTop() - a.rowHeight))
            }
            return a.enableCellSelection && setTimeout(function() {
                a.domAccessProvider.focusCellElement(a, a.renderedColumns.indexOf(k[f]))
            }, 3), !1
        };
        String.prototype.trim || (String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "")
        }), Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
            var b = this.length >>> 0,
                c = Number(arguments[1]) || 0;
            for (c = c < 0 ? Math.ceil(c) : Math.floor(c), c < 0 && (c += b); c < b; c++)
                if (c in this && this[c] === a) return c;
            return -1
        }), Array.prototype.filter || (Array.prototype.filter = function(a) {
            var b = Object(this),
                c = b.length >>> 0;
            if ("function" != typeof a) throw new TypeError;
            for (var d = [], e = arguments[1], f = 0; f < c; f++)
                if (f in b) {
                    var g = b[f];
                    a.call(e, g, f, b) && d.push(g)
                } return d
        }), r.filter("checkmark", function() {
            return function(a) {
                return a ? "✔" : "✘"
            }
        }), r.filter("ngColumns", function() {
            return function(a) {
                return a.filter(function(a) {
                    return !a.isAggCol
                })
            }
        }), angular.module("ngGrid.services").factory("$domUtilityService", ["$utilityService", "$window", function(a, c) {
            var d = {},
                e = {},
                f = function() {
                    var a = b("<div></div>");
                    a.appendTo("body"), a.height(100).width(100).css("position", "absolute").css("overflow", "scroll"), a.append('<div style="height: 400px; width: 400px;"></div>'), d.ScrollH = a.height() - a[0].clientHeight, d.ScrollW = a.width() - a[0].clientWidth, a.empty(), a.attr("style", ""), a.append('<span style="font-family: Verdana, Helvetica, Sans-Serif; font-size: 14px;"><strong>M</strong></span>'), d.LetterW = a.children().first().width(), a.remove()
                };
            return d.eventStorage = {}, d.AssignGridContainers = function(a, c, e) {
                e.$root = b(c), e.$topPanel = e.$root.find(".ngTopPanel"), e.$groupPanel = e.$root.find(".ngGroupPanel"), e.$headerContainer = e.$topPanel.find(".ngHeaderContainer"), a.$headerContainer = e.$headerContainer, e.$headerScroller = e.$topPanel.find(".ngHeaderScroller"), e.$headers = e.$headerScroller.children(), e.$viewport = e.$root.find(".ngViewport"), e.$canvas = e.$viewport.find(".ngCanvas"), e.$footerPanel = e.$root.find(".ngFooterPanel");
                var f = a.$watch(function() {
                    return e.$viewport.scrollLeft()
                }, function(a) {
                    return e.$headerContainer.scrollLeft(a)
                });
                a.$on("$destroy", function() {
                    b(e.$root.parent()).off("resize.nggrid"), e.$root = null, e.$topPanel = null, e.$headerContainer = null, e.$headers = null, e.$canvas = null, e.$footerPanel = null, f()
                }), d.UpdateGridLayout(a, e)
            }, d.getRealWidth = function(a) {
                var c = 0,
                    d = {
                        visibility: "hidden",
                        display: "block"
                    },
                    e = a.parents().andSelf().not(":visible");
                return b.swap(e[0], d, function() {
                    c = a.outerWidth()
                }), c
            }, d.UpdateGridLayout = function(a, b) {
                var c = b.$viewport.scrollTop();
                b.elementDims.rootMaxW = b.$root.width(), b.$root.is(":hidden") && (b.elementDims.rootMaxW = d.getRealWidth(b.$root)), b.elementDims.rootMaxH = b.$root.height(), b.refreshDomSizes(), a.adjustScrollTop(c, !0)
            }, d.numberOfGrids = 0, d.setStyleText = function(a, b) {
                var d = a.styleSheet,
                    e = a.gridId,
                    f = c.document;
                d || (d = f.getElementById(e)), d || (d = f.createElement("style"), d.type = "text/css", d.id = e, (f.head || f.getElementsByTagName("head")[0]).appendChild(d)), d.styleSheet && !d.sheet ? d.styleSheet.cssText = b : d.innerHTML = b, a.styleSheet = d, a.styleText = b
            }, d.BuildStyles = function(a, b, c) {
                var e, f = b.config.rowHeight,
                    g = b.gridId,
                    h = a.columns,
                    i = 0,
                    j = a.totalRowWidth();
                e = "." + g + " .ngCanvas { width: " + j + "px; }." + g + " .ngRow { width: " + j + "px; }." + g + " .ngCanvas { width: " + j + "px; }." + g + " .ngHeaderScroller { width: " + (j + d.ScrollH) + "px}";
                for (var k = 0; k < h.length; k++) {
                    var l = h[k];
                    l.visible !== !1 && (e += "." + g + " .col" + k + " { width: " + l.width + "px; left: " + i + "px; height: " + f + "px }." + g + " .colt" + k + " { width: " + l.width + "px; }", i += l.width)
                }
                d.setStyleText(b, e), a.adjustScrollLeft(b.$viewport.scrollLeft()), c && d.digest(a)
            }, d.setColLeft = function(a, b, c) {
                if (c.styleText) {
                    var f = e[a.index];
                    f || (f = e[a.index] = new RegExp(".col" + a.index + " { width: [0-9]+px; left: [0-9]+px"));
                    var g = c.styleText.replace(f, ".col" + a.index + " { width: " + a.width + "px; left: " + b + "px");
                    d.setStyleText(c, g)
                }
            }, d.setColLeft.immediate = 1, d.RebuildGrid = function(a, b) {
                d.UpdateGridLayout(a, b), (null == b.config.maintainColumnRatios || b.config.maintainColumnRatios) && b.configureColumnWidths(), a.adjustScrollLeft(b.$viewport.scrollLeft()), d.BuildStyles(a, b, !0)
            }, d.digest = function(a) {
                a.$root.$$phase || a.$digest()
            }, d.ScrollH = 17, d.ScrollW = 17, d.LetterW = 10, f(), d
        }]), angular.module("ngGrid.services").factory("$sortService", ["$parse", function(a) {
            var b = {};
            return b.colSortFnCache = {}, b.isCustomSort = !1, b.guessSortFn = function(a) {
                var c = typeof a;
                switch (c) {
                    case "number":
                        return b.sortNumber;
                    case "boolean":
                        return b.sortBool;
                    case "string":
                        return a.match(/^[-+]?[£$¤]?[\d,.]+%?$/) ? b.sortNumberStr : b.sortAlpha;
                    default:
                        return "[object Date]" === Object.prototype.toString.call(a) ? b.sortDate : b.basicSort
                }
            }, b.basicSort = function(a, b) {
                return a === b ? 0 : a < b ? -1 : 1
            }, b.sortNumber = function(a, b) {
                return a - b
            }, b.sortNumberStr = function(a, b) {
                var c, d, e = !1,
                    f = !1;
                return c = parseFloat(a.replace(/[^0-9.-]/g, "")), isNaN(c) && (e = !0), d = parseFloat(b.replace(/[^0-9.-]/g, "")), isNaN(d) && (f = !0), e && f ? 0 : e ? 1 : f ? -1 : c - d
            }, b.sortAlpha = function(a, b) {
                var c = a.toLowerCase(),
                    d = b.toLowerCase();
                return c === d ? 0 : c < d ? -1 : 1
            }, b.sortDate = function(a, b) {
                var c = a.getTime(),
                    d = b.getTime();
                return c === d ? 0 : c < d ? -1 : 1
            }, b.sortBool = function(a, b) {
                return a && b ? 0 : a || b ? a ? 1 : -1 : 0
            }, b.sortData = function(c, d) {
                if (d && c) {
                    var f, g, h = c.fields.length,
                        i = c.fields,
                        j = d.slice(0);
                    d.sort(function(d, k) {
                        for (var l, m, n = 0, o = 0; 0 === n && o < h;) {
                            f = c.columns[o], g = c.directions[o], m = b.getSortFn(f, j);
                            var p = a(i[o])(d),
                                q = a(i[o])(k);
                            b.isCustomSort ? (l = m(p, q), n = g === e ? l : 0 - l) : !p && 0 !== p || !q && 0 !== q ? q || p ? p ? q || (n = -1) : n = 1 : n = 0 : (l = m(p, q), n = g === e ? l : 0 - l), o++
                        }
                        return n
                    })
                }
            }, b.Sort = function(a, c) {
                b.isSorting || (b.isSorting = !0, b.sortData(a, c), b.isSorting = !1)
            }, b.getSortFn = function(c, d) {
                var e, f;
                if (b.colSortFnCache[c.field]) e = b.colSortFnCache[c.field];
                else if (void 0 !== c.sortingAlgorithm) e = c.sortingAlgorithm, b.colSortFnCache[c.field] = c.sortingAlgorithm, b.isCustomSort = !0;
                else {
                    if (f = d[0], !f) return e;
                    e = b.guessSortFn(a(c.field)(f)), e ? b.colSortFnCache[c.field] = e : e = b.sortAlpha
                }
                return e
            }, b
        }]), angular.module("ngGrid.services").factory("$utilityService", ["$parse", function(c) {
            var d = /function (.{1,})\(/,
                e = {
                    visualLength: function(a) {
                        var c = document.getElementById("testDataLength");
                        c || (c = document.createElement("SPAN"), c.id = "testDataLength", c.style.visibility = "hidden", document.body.appendChild(c));
                        var d = b(a);
                        b(c).css({
                            font: d.css("font"),
                            "font-size": d.css("font-size"),
                            "font-family": d.css("font-family")
                        }), c.innerHTML = d.text();
                        var e = c.offsetWidth;
                        return document.body.removeChild(c), e
                    },
                    forIn: function(a, b) {
                        for (var c in a) a.hasOwnProperty(c) && b(a[c], c)
                    },
                    evalProperty: function(a, b) {
                        return c("entity." + b)({
                            entity: a
                        })
                    },
                    endsWith: function(a, b) {
                        return !(!a || !b || "string" != typeof a) && a.indexOf(b, a.length - b.length) !== -1
                    },
                    isNullOrUndefined: function(a) {
                        return void 0 === a || null === a
                    },
                    getElementsByClassName: function(a) {
                        if (document.getElementsByClassName) return document.getElementsByClassName(a);
                        for (var b = [], c = new RegExp("\\b" + a + "\\b"), d = document.getElementsByTagName("*"), e = 0; e < d.length; e++) {
                            var f = d[e].className;
                            c.test(f) && b.push(d[e])
                        }
                        return b
                    },
                    newId: function() {
                        var a = (new Date).getTime();
                        return function() {
                            return a += 1
                        }
                    }(),
                    seti18n: function(b, c) {
                        var d = a.ngGrid.i18n[c];
                        for (var e in d) b.i18n[e] = d[e]
                    },
                    getInstanceType: function(a) {
                        var b = d.exec(a.constructor.toString());
                        if (b && b.length > 1) {
                            var c = b[1].replace(/^\s+|\s+$/g, "");
                            return c
                        }
                        return ""
                    }
                };
            return e
        }]);
        var t = function(a, b, c, d) {
            this.rowIndex = 0, this.offsetTop = this.rowIndex * c, this.entity = a, this.label = a.gLabel, this.field = a.gField, this.depth = a.gDepth, this.parent = a.parent, this.children = a.children, this.aggChildren = a.aggChildren, this.aggIndex = a.aggIndex, this.collapsed = d, this.groupInitState = d, this.rowFactory = b, this.rowHeight = c, this.isAggRow = !0, this.offsetLeft = 25 * a.gDepth, this.aggLabelFilter = a.aggLabelFilter
        };
        t.prototype.toggleExpand = function() {
            this.collapsed = !this.collapsed, this.orig && (this.orig.collapsed = this.collapsed), this.notifyChildren()
        }, t.prototype.setExpand = function(a) {
            this.collapsed = a, this.notifyChildren()
        }, t.prototype.notifyChildren = function() {
            for (var a = Math.max(this.rowFactory.aggCache.length, this.children.length), b = 0; b < a; b++)
                if (this.aggChildren[b] && (this.aggChildren[b].entity[i] = this.collapsed, this.collapsed && this.aggChildren[b].setExpand(this.collapsed)), this.children[b] && (this.children[b][i] = this.collapsed), b > this.aggIndex && this.rowFactory.aggCache[b]) {
                    var c = this.rowFactory.aggCache[b],
                        d = 30 * this.children.length;
                    c.offsetTop = this.collapsed ? c.offsetTop - d : c.offsetTop + d
                } this.rowFactory.renderedChange()
        }, t.prototype.aggClass = function() {
            return this.collapsed ? "ngAggArrowCollapsed" : "ngAggArrowExpanded"
        }, t.prototype.totalChildren = function() {
            if (this.aggChildren.length > 0) {
                var a = 0,
                    b = function(c) {
                        c.aggChildren.length > 0 ? angular.forEach(c.aggChildren, function(a) {
                            b(a)
                        }) : a += c.children.length
                    };
                return b(this), a
            }
            return this.children.length
        }, t.prototype.copy = function() {
            var a = new t(this.entity, this.rowFactory, this.rowHeight, this.groupInitState);
            return a.orig = this, a
        };
        var u = function(a, c, d, g, h, i) {
                var j = this,
                    l = a.colDef,
                    m = 500,
                    n = 0,
                    o = null;
                j.colDef = a.colDef, j.width = l.width, j.groupIndex = 0, j.isGroupedBy = !1, j.minWidth = l.minWidth ? l.minWidth : 50, j.maxWidth = l.maxWidth ? l.maxWidth : 9e3, j.enableCellEdit = void 0 !== l.enableCellEdit ? l.enableCellEdit : a.enableCellEdit || a.enableCellEditOnFocus, j.cellEditableCondition = l.cellEditableCondition || a.cellEditableCondition || "true", j.headerRowHeight = a.headerRowHeight, j.displayName = void 0 === l.displayName ? l.field : l.displayName, j.index = a.index, j.isAggCol = a.isAggCol, j.cellClass = l.cellClass, j.sortPriority = void 0, j.cellFilter = l.cellFilter ? l.cellFilter : "", j.field = l.field, j.aggLabelFilter = l.aggLabelFilter || l.cellFilter, j.visible = i.isNullOrUndefined(l.visible) || l.visible, j.sortable = !1, j.resizable = !1, j.pinnable = !1, j.pinned = a.enablePinning && l.pinned, j.originalIndex = null == a.originalIndex ? j.index : a.originalIndex, j.groupable = i.isNullOrUndefined(l.groupable) || l.groupable, a.enableSort && (j.sortable = i.isNullOrUndefined(l.sortable) || l.sortable), a.enableResize && (j.resizable = i.isNullOrUndefined(l.resizable) || l.resizable), a.enablePinning && (j.pinnable = i.isNullOrUndefined(l.pinnable) || l.pinnable), j.sortDirection = void 0, j.sortingAlgorithm = l.sortFn, j.headerClass = l.headerClass, j.cursor = j.sortable ? "pointer" : "default", j.headerCellTemplate = l.headerCellTemplate || h.get("headerCellTemplate.html"), j.cellTemplate = l.cellTemplate || h.get("cellTemplate.html").replace(k, j.cellFilter ? "|" + j.cellFilter : ""), j.enableCellEdit && (j.cellEditTemplate = l.cellEditTemplate || h.get("cellEditTemplate.html"), j.editableCellTemplate = l.editableCellTemplate || h.get("editableCellTemplate.html")), l.cellTemplate && !p.test(l.cellTemplate) && (j.cellTemplate = h.get(l.cellTemplate) || b.ajax({
                    type: "GET",
                    url: l.cellTemplate,
                    async: !1
                }).responseText), j.enableCellEdit && l.editableCellTemplate && !p.test(l.editableCellTemplate) && (j.editableCellTemplate = h.get(l.editableCellTemplate) || b.ajax({
                    type: "GET",
                    url: l.editableCellTemplate,
                    async: !1
                }).responseText), l.headerCellTemplate && !p.test(l.headerCellTemplate) && (j.headerCellTemplate = h.get(l.headerCellTemplate) || b.ajax({
                    type: "GET",
                    url: l.headerCellTemplate,
                    async: !1
                }).responseText), j.colIndex = function() {
                    var a = j.pinned ? "pinned " : "";
                    return a += "col" + j.index + " colt" + j.index, j.cellClass && (a += " " + j.cellClass), a
                }, j.groupedByClass = function() {
                    return j.isGroupedBy ? "ngGroupedByIcon" : "ngGroupIcon"
                }, j.toggleVisible = function() {
                    j.visible = !j.visible
                }, j.showSortButtonUp = function() {
                    return j.sortable ? j.sortDirection === f : j.sortable
                }, j.showSortButtonDown = function() {
                    return j.sortable ? j.sortDirection === e : j.sortable
                }, j.noSortVisible = function() {
                    return !j.sortDirection
                }, j.sort = function(b) {
                    if (!j.sortable) return !0;
                    var c = j.sortDirection === e ? f : e;
                    return j.sortDirection = c, a.sortCallback(j, b), !1
                }, j.gripClick = function() {
                    n++, 1 === n ? o = setTimeout(function() {
                        n = 0
                    }, m) : (clearTimeout(o), a.resizeOnDataCallback(j), n = 0)
                }, j.gripOnMouseDown = function(a) {
                    return c.isColumnResizing = !0, a.ctrlKey && !j.pinned ? (j.toggleVisible(), g.BuildStyles(c, d), !0) : (a.target.parentElement.style.cursor = "col-resize", j.startMousePosition = a.clientX, j.origWidth = j.width, b(document).mousemove(j.onMouseMove), b(document).mouseup(j.gripOnMouseUp), !1)
                }, j.onMouseMove = function(a) {
                    var b = a.clientX - j.startMousePosition,
                        e = b + j.origWidth;
                    return j.width = e < j.minWidth ? j.minWidth : e > j.maxWidth ? j.maxWidth : e, c.hasUserChangedGridColumnWidths = !0, g.BuildStyles(c, d), !1
                }, j.gripOnMouseUp = function(a) {
                    return b(document).off("mousemove", j.onMouseMove), b(document).off("mouseup", j.gripOnMouseUp), a.target.parentElement.style.cursor = "default", g.digest(c), c.isColumnResizing = !1, !1
                }, j.copy = function() {
                    var b = new u(a, c, d, g, h, i);
                    return b.isClone = !0, b.orig = j, b
                }, j.setVars = function(a) {
                    j.orig = a, j.width = a.width, j.groupIndex = a.groupIndex, j.isGroupedBy = a.isGroupedBy, j.displayName = a.displayName, j.index = a.index, j.isAggCol = a.isAggCol, j.cellClass = a.cellClass, j.cellFilter = a.cellFilter, j.field = a.field, j.aggLabelFilter = a.aggLabelFilter, j.visible = a.visible, j.sortable = a.sortable, j.resizable = a.resizable, j.pinnable = a.pinnable, j.pinned = a.pinned, j.originalIndex = a.originalIndex, j.sortDirection = a.sortDirection, j.sortingAlgorithm = a.sortingAlgorithm, j.headerClass = a.headerClass, j.headerCellTemplate = a.headerCellTemplate, j.cellTemplate = a.cellTemplate, j.cellEditTemplate = a.cellEditTemplate
                }
            },
            v = function(a) {
                this.outerHeight = null, this.outerWidth = null, b.extend(this, a)
            },
            w = function(a) {
                this.previousColumn = null, this.grid = a
            };
        w.prototype.changeUserSelect = function(a, b) {
            a.css({
                "-webkit-touch-callout": b,
                "-webkit-user-select": b,
                "-khtml-user-select": b,
                "-moz-user-select": "none" === b ? "-moz-none" : b,
                "-ms-user-select": b,
                "user-select": b
            })
        }, w.prototype.focusCellElement = function(a, b) {
            if (a.selectionProvider.lastClickedRow) {
                var c = void 0 !== b ? b : this.previousColumn,
                    d = a.selectionProvider.lastClickedRow.clone ? a.selectionProvider.lastClickedRow.clone.elm : a.selectionProvider.lastClickedRow.elm;
                if (void 0 !== c && d) {
                    var e = angular.element(d[0].children).filter(function() {
                            return 8 !== this.nodeType
                        }),
                        f = Math.max(Math.min(a.renderedColumns.length - 1, c), 0);
                    this.grid.config.showSelectionCheckbox && angular.element(e[f]).scope() && 0 === angular.element(e[f]).scope().col.index && (f = 1), e[f] && e[f].children[1].children[0].focus(), this.previousColumn = c
                }
            }
        }, w.prototype.selectionHandlers = function(a, b) {
            function c(c) {
                if (16 === c.keyCode) return f.changeUserSelect(b, "none", c), !0;
                if (!e) {
                    e = !0;
                    var d = s(a, b, c, f.grid);
                    return e = !1, d
                }
                return !0
            }

            function d(a) {
                return 16 === a.keyCode && f.changeUserSelect(b, "text", a), !0
            }
            var e = !1,
                f = this;
            b.bind("keydown", c), b.bind("keyup", d), b.on("$destroy", function() {
                b.off("keydown", c), b.off("keyup", d)
            })
        };
        var x = function(c, d, e, f) {
                var g = this;
                g.colToMove = void 0, g.groupToMove = void 0, g.assignEvents = function() {
                    c.config.jqueryUIDraggable && !c.config.enablePinning ? (c.$groupPanel.droppable({
                        addClasses: !1,
                        drop: function(a) {
                            g.onGroupDrop(a)
                        }
                    }), c.$groupPanel.on("$destroy", function() {
                        c.$groupPanel = null
                    })) : (c.$groupPanel.on("mousedown", g.onGroupMouseDown).on("dragover", g.dragOver).on("drop", g.onGroupDrop), c.$topPanel.on("mousedown", ".ngHeaderScroller", g.onHeaderMouseDown).on("dragover", ".ngHeaderScroller", g.dragOver), c.$groupPanel.on("$destroy", function() {
                        c.$groupPanel.off("mousedown"), c.$groupPanel = null
                    }), c.config.enableColumnReordering && c.$topPanel.on("drop", ".ngHeaderScroller", g.onHeaderDrop), c.$topPanel.on("$destroy", function() {
                        c.$topPanel.off("mousedown"), c.config.enableColumnReordering && c.$topPanel.off("drop"), c.$topPanel = null
                    })), d.$on("$destroy", d.$watch("renderedColumns", function() {
                        f(g.setDraggables)
                    }))
                }, g.dragStart = function(a) {
                    a.dataTransfer.setData("text", "")
                }, g.dragOver = function(a) {
                    a.preventDefault()
                }, g.setDraggables = function() {
                    if (c.config.jqueryUIDraggable) c.$root && c.$root.find(".ngHeaderSortColumn").draggable({
                        helper: "clone",
                        appendTo: "body",
                        stack: "div",
                        addClasses: !1,
                        start: function(a) {
                            g.onHeaderMouseDown(a)
                        }
                    }).droppable({
                        drop: function(a) {
                            g.onHeaderDrop(a)
                        }
                    });
                    else {
                        var a = c.$root.find(".ngHeaderSortColumn");
                        if (angular.forEach(a, function(a) {
                                a.className && a.className.indexOf("ngHeaderSortColumn") !== -1 && (a.setAttribute("draggable", "true"), a.addEventListener && (a.addEventListener("dragstart", g.dragStart), angular.element(a).on("$destroy", function() {
                                    angular.element(a).off("dragstart", g.dragStart), a.removeEventListener("dragstart", g.dragStart)
                                })))
                            }), navigator.userAgent.indexOf("MSIE") !== -1) {
                            var b = c.$root.find(".ngHeaderSortColumn");
                            b.bind("selectstart", function() {
                                return this.dragDrop(), !1
                            }), angular.element(b).on("$destroy", function() {
                                b.off("selectstart")
                            })
                        }
                    }
                }, g.onGroupMouseDown = function(a) {
                    var d = b(a.target);
                    if ("ngRemoveGroup" !== d[0].className) {
                        var e = angular.element(d).scope();
                        e && (c.config.jqueryUIDraggable || (d.attr("draggable", "true"), this.addEventListener && (this.addEventListener("dragstart", g.dragStart), angular.element(this).on("$destroy", function() {
                            this.removeEventListener("dragstart", g.dragStart)
                        })), navigator.userAgent.indexOf("MSIE") !== -1 && (d.bind("selectstart", function() {
                            return this.dragDrop(), !1
                        }), d.on("$destroy", function() {
                            d.off("selectstart")
                        }))), g.groupToMove = {
                            header: d,
                            groupName: e.group,
                            index: e.$index
                        })
                    } else g.groupToMove = void 0
                }, g.onGroupDrop = function(a) {
                    a.stopPropagation();
                    var e, f;
                    g.groupToMove ? (e = b(a.target).closest(".ngGroupElement"), "ngGroupPanel" === e.context.className ? (d.configGroups.splice(g.groupToMove.index, 1), d.configGroups.push(g.groupToMove.groupName)) : (f = angular.element(e).scope(), f && g.groupToMove.index !== f.$index && (d.configGroups.splice(g.groupToMove.index, 1), d.configGroups.splice(f.$index, 0, g.groupToMove.groupName))), g.groupToMove = void 0, c.fixGroupIndexes()) : g.colToMove && (d.configGroups.indexOf(g.colToMove.col) === -1 && (e = b(a.target).closest(".ngGroupElement"), "ngGroupPanel" === e.context.className || "ngGroupPanelDescription ng-binding" === e.context.className ? d.groupBy(g.colToMove.col) : (f = angular.element(e).scope(), f && d.removeGroup(f.$index))), g.colToMove = void 0), d.$$phase || d.$apply()
                }, g.onHeaderMouseDown = function(a) {
                    var c = b(a.target).closest(".ngHeaderSortColumn"),
                        d = angular.element(c).scope();
                    d && (g.colToMove = {
                        header: c,
                        col: d.col
                    })
                }, g.onHeaderDrop = function(a) {
                    if (g.colToMove && !g.colToMove.col.pinned) {
                        var f = b(a.target).closest(".ngHeaderSortColumn"),
                            h = angular.element(f).scope();
                        if (h) {
                            if (g.colToMove.col === h.col || h.col.pinned) return;
                            d.columns.splice(g.colToMove.col.index, 1), d.columns.splice(h.col.index, 0, g.colToMove.col), c.fixColumnIndexes(), g.colToMove = void 0, e.digest(d)
                        }
                    }
                }, g.assignGridEventHandlers = function() {
                    c.config.tabIndex === -1 ? (c.$viewport.attr("tabIndex", e.numberOfGrids), e.numberOfGrids++) : c.$viewport.attr("tabIndex", c.config.tabIndex);
                    var f, g = function() {
                        clearTimeout(f), f = setTimeout(function() {
                            e.RebuildGrid(d, c)
                        }, 100)
                    };
                    b(a).on("resize.nggrid", g);
                    var h, i = function() {
                        clearTimeout(h), h = setTimeout(function() {
                            e.RebuildGrid(d, c)
                        }, 100)
                    };
                    b(c.$root.parent()).on("resize.nggrid", i), d.$on("$destroy", function() {
                        b(a).off("resize.nggrid", g)
                    })
                }, g.assignGridEventHandlers(), g.assignEvents()
            },
            y = function(a, b) {
                a.maxRows = function() {
                    var c = Math.max(a.totalServerItems, b.data.length);
                    return c
                }, a.$on("$destroy", a.$watch("totalServerItems", function(b, c) {
                    a.currentMaxPages = a.maxPages()
                })), a.multiSelect = b.config.enableRowSelection && b.config.multiSelect, a.selectedItemCount = b.selectedItemCount, a.maxPages = function() {
                    return 0 === a.maxRows() ? 1 : Math.ceil(a.maxRows() / a.pagingOptions.pageSize)
                }, a.pageForward = function() {
                    var b = a.pagingOptions.currentPage;
                    a.totalServerItems > 0 ? a.pagingOptions.currentPage = Math.min(b + 1, a.maxPages()) : a.pagingOptions.currentPage++
                }, a.pageBackward = function() {
                    var b = a.pagingOptions.currentPage;
                    a.pagingOptions.currentPage = Math.max(b - 1, 1)
                }, a.pageToFirst = function() {
                    a.pagingOptions.currentPage = 1
                }, a.pageToLast = function() {
                    var b = a.maxPages();
                    a.pagingOptions.currentPage = b
                }, a.cantPageForward = function() {
                    var c = a.pagingOptions.currentPage,
                        d = a.maxPages();
                    return a.totalServerItems > 0 ? c >= d : b.data.length < 1
                }, a.cantPageToLast = function() {
                    return !(a.totalServerItems > 0) || a.cantPageForward()
                }, a.cantPageBackward = function() {
                    var b = a.pagingOptions.currentPage;
                    return b <= 1
                }
            },
            z = function(e, f, g, h, j, k, l, m, n, o, q) {
                var r = {
                        aggregateTemplate: void 0,
                        afterSelectionChange: function() {},
                        beforeSelectionChange: function() {
                            return !0
                        },
                        checkboxCellTemplate: void 0,
                        checkboxHeaderTemplate: void 0,
                        columnDefs: void 0,
                        data: [],
                        dataUpdated: function() {},
                        enableCellEdit: !1,
                        enableCellEditOnFocus: !1,
                        enableCellSelection: !1,
                        enableColumnResize: !1,
                        enableColumnReordering: !1,
                        enableColumnHeavyVirt: !1,
                        enablePaging: !1,
                        enablePinning: !1,
                        enableRowSelection: !0,
                        enableSorting: !0,
                        enableHighlighting: !1,
                        excludeProperties: [],
                        filterOptions: {
                            filterText: "",
                            useExternalFilter: !1
                        },
                        footerRowHeight: 55,
                        footerTemplate: void 0,
                        forceSyncScrolling: !0,
                        groups: [],
                        groupsCollapsedByDefault: !0,
                        headerRowHeight: 30,
                        headerRowTemplate: void 0,
                        jqueryUIDraggable: !1,
                        jqueryUITheme: !1,
                        keepLastSelected: !0,
                        maintainColumnRatios: void 0,
                        menuTemplate: void 0,
                        multiSelect: !0,
                        pagingOptions: {
                            pageSizes: [250, 500, 1e3],
                            pageSize: 250,
                            currentPage: 1
                        },
                        pinSelectionCheckbox: !1,
                        plugins: [],
                        primaryKey: void 0,
                        rowHeight: 30,
                        rowTemplate: void 0,
                        selectedItems: [],
                        selectWithCheckboxOnly: !1,
                        showColumnMenu: !1,
                        showFilter: !1,
                        showFooter: !1,
                        showGroupPanel: !1,
                        showSelectionCheckbox: !1,
                        sortInfo: {
                            fields: [],
                            columns: [],
                            directions: []
                        },
                        tabIndex: -1,
                        totalServerItems: 0,
                        useExternalSorting: !1,
                        i18n: "en",
                        virtualizationThreshold: 50,
                        noTabInterference: !1
                    },
                    s = this;
                s.maxCanvasHt = 0, s.config = b.extend(r, a.ngGrid.config, f), s.config.showSelectionCheckbox = s.config.showSelectionCheckbox && s.config.enableColumnHeavyVirt === !1, s.config.enablePinning = s.config.enablePinning && s.config.enableColumnHeavyVirt === !1, s.config.selectWithCheckboxOnly = s.config.selectWithCheckboxOnly && s.config.showSelectionCheckbox !== !1, s.config.pinSelectionCheckbox = s.config.enablePinning, "string" == typeof f.columnDefs && (s.config.columnDefs = e.$eval(f.columnDefs)), s.rowCache = [], s.rowMap = [], s.gridId = "ng" + l.newId(), s.$root = null, s.$groupPanel = null, s.$topPanel = null, s.$headerContainer = null, s.$headerScroller = null, s.$headers = null, s.$viewport = null, s.$canvas = null, s.rootDim = s.config.gridDim, s.data = [], s.lateBindColumns = !1, s.filteredRows = [], s.initTemplates = function() {
                    var a = ["rowTemplate", "aggregateTemplate", "headerRowTemplate", "checkboxCellTemplate", "checkboxHeaderTemplate", "menuTemplate", "footerTemplate"],
                        b = [];
                    return angular.forEach(a, function(a) {
                        b.push(s.getTemplate(a))
                    }), q.all(b)
                }, s.getTemplate = function(a) {
                    var b = s.config[a],
                        c = s.gridId + a + ".html",
                        d = q.defer();
                    if (b && !p.test(b)) o.get(b, {
                        cache: k
                    }).success(function(a) {
                        k.put(c, a), d.resolve()
                    }).error(function(a) {
                        d.reject("Could not load template: " + b)
                    });
                    else if (b) k.put(c, b), d.resolve();
                    else {
                        var e = a + ".html";
                        k.put(c, k.get(e)), d.resolve()
                    }
                    return d.promise
                }, "object" == typeof s.config.data && (s.data = s.config.data), s.calcMaxCanvasHeight = function() {
                    var a;
                    return a = s.config.groups.length > 0 ? s.rowFactory.parsedData.filter(function(a) {
                        return !a[i]
                    }).length * s.config.rowHeight : s.filteredRows.length * s.config.rowHeight
                }, s.elementDims = {
                    scrollW: 0,
                    scrollH: 0,
                    rowIndexCellW: 25,
                    rowSelectedCellW: 25,
                    rootMaxW: 0,
                    rootMaxH: 0
                }, s.setRenderedRows = function(a) {
                    e.renderedRows.length = a.length;
                    for (var b = 0; b < a.length; b++) !e.renderedRows[b] || a[b].isAggRow || e.renderedRows[b].isAggRow ? (e.renderedRows[b] = a[b].copy(), e.renderedRows[b].collapsed = a[b].collapsed, a[b].isAggRow || e.renderedRows[b].setVars(a[b])) : e.renderedRows[b].setVars(a[b]), e.renderedRows[b].rowIndex = a[b].rowIndex, e.renderedRows[b].offsetTop = a[b].offsetTop, e.renderedRows[b].selected = a[b].selected, a[b].renderedRowIndex = b;
                    s.refreshDomSizes(), e.$emit("ngGridEventRows", a)
                }, s.minRowsToRender = function() {
                    var a = e.viewportDimHeight() || 1;
                    return Math.floor(a / s.config.rowHeight)
                }, s.refreshDomSizes = function() {
                    var a = new v;
                    a.outerWidth = s.elementDims.rootMaxW, a.outerHeight = s.elementDims.rootMaxH, s.rootDim = a, s.maxCanvasHt = s.calcMaxCanvasHeight()
                }, s.buildColumnDefsFromData = function() {
                    s.config.columnDefs = [];
                    var a = s.data[0];
                    return a ? void l.forIn(a, function(a, b) {
                        s.config.excludeProperties.indexOf(b) === -1 && s.config.columnDefs.push({
                            field: b
                        })
                    }) : void(s.lateBoundColumns = !0)
                }, s.buildColumns = function() {
                    var a = s.config.columnDefs,
                        b = [];
                    if (a || (s.buildColumnDefsFromData(), a = s.config.columnDefs), s.config.showSelectionCheckbox && b.push(new u({
                            colDef: {
                                field: "✔",
                                width: s.elementDims.rowSelectedCellW,
                                sortable: !1,
                                resizable: !1,
                                groupable: !1,
                                headerCellTemplate: k.get(e.gridId + "checkboxHeaderTemplate.html"),
                                cellTemplate: k.get(e.gridId + "checkboxCellTemplate.html"),
                                pinned: s.config.pinSelectionCheckbox
                            },
                            index: 0,
                            headerRowHeight: s.config.headerRowHeight,
                            sortCallback: s.sortData,
                            resizeOnDataCallback: s.resizeOnData,
                            enableResize: s.config.enableColumnResize,
                            enableSort: s.config.enableSorting,
                            enablePinning: s.config.enablePinning
                        }, e, s, h, k, l)), a.length > 0) {
                        var c = s.config.showSelectionCheckbox ? 1 : 0,
                            d = e.configGroups.length;
                        e.configGroups.length = 0, angular.forEach(a, function(a, f) {
                            f += c;
                            var g = new u({
                                    colDef: a,
                                    index: f + d,
                                    originalIndex: f,
                                    headerRowHeight: s.config.headerRowHeight,
                                    sortCallback: s.sortData,
                                    resizeOnDataCallback: s.resizeOnData,
                                    enableResize: s.config.enableColumnResize,
                                    enableSort: s.config.enableSorting,
                                    enablePinning: s.config.enablePinning,
                                    enableCellEdit: s.config.enableCellEdit || s.config.enableCellEditOnFocus,
                                    cellEditableCondition: s.config.cellEditableCondition
                                }, e, s, h, k, l),
                                i = s.config.groups.indexOf(a.field);
                            i !== -1 && (g.isGroupedBy = !0, e.configGroups.splice(i, 0, g), g.groupIndex = e.configGroups.length), b.push(g)
                        }), e.columns = b, s.config.groups.length > 0 && s.rowFactory.getGrouping(s.config.groups)
                    }
                }, s.configureColumnWidths = function() {
                    var a = [],
                        b = [],
                        c = 0,
                        d = 0,
                        f = {};
                    if (angular.forEach(e.columns, function(a, b) {
                            if (!l.isNullOrUndefined(a.originalIndex)) {
                                var c = a.originalIndex;
                                s.config.showSelectionCheckbox && (0 === a.originalIndex && a.visible && (d += 25), c--), f[c] = b
                            }
                        }), angular.forEach(s.config.columnDefs, function(g, h) {
                            var i = e.columns[f[h]];
                            g.index = h;
                            var j, k = !1;
                            if (l.isNullOrUndefined(g.width) ? g.width = "*" : (k = !!isNaN(g.width) && l.endsWith(g.width, "%"), j = k ? g.width : parseInt(g.width, 10)), isNaN(j) && !e.hasUserChangedGridColumnWidths) {
                                if (j = g.width, "auto" === j) {
                                    i.width = i.minWidth, d += i.width;
                                    var m = i;
                                    return void e.$on("$destroy", e.$on("ngGridEventData", function() {
                                        s.resizeOnData(m)
                                    }))
                                }
                                if (j.indexOf("*") !== -1) return i.visible !== !1 && (c += j.length), void a.push(g);
                                if (k) return void b.push(g);
                                throw 'unable to parse column width, use percentage ("10%","20%", etc...) or "*" to use remaining width of grid'
                            }
                            i.visible !== !1 && (d += i.width = parseInt(i.width, 10))
                        }), b.length > 0) {
                        s.config.maintainColumnRatios = s.config.maintainColumnRatios !== !1;
                        var g = 0,
                            i = 0;
                        angular.forEach(b, function(a) {
                            var b = e.columns[f[a.index]],
                                c = parseFloat(a.width) / 100;
                            g += c, b.visible || (i += c)
                        });
                        var j = g - i;
                        angular.forEach(b, function(a) {
                            var b = e.columns[f[a.index]],
                                c = parseFloat(a.width) / 100;
                            c /= i > 0 ? j : g;
                            var h = s.rootDim.outerWidth * g;
                            b.width = h * c, d += b.width
                        })
                    }
                    if (a.length > 0) {
                        s.config.maintainColumnRatios = s.config.maintainColumnRatios !== !1;
                        var k = s.rootDim.outerWidth - d;
                        s.maxCanvasHt > e.viewportDimHeight() && (k -= h.ScrollW);
                        var m = Math.floor(k / c);
                        angular.forEach(a, function(b, c) {
                            var g = e.columns[f[b.index]];
                            g.width = m * b.width.length, g.visible !== !1 && (d += g.width);
                            var i = c === a.length - 1;
                            if (i && d < s.rootDim.outerWidth) {
                                var j = s.rootDim.outerWidth - d;
                                s.maxCanvasHt > e.viewportDimHeight() && (j -= h.ScrollW), g.width += j
                            }
                        })
                    }
                }, s.init = function() {
                    return s.initTemplates().then(function() {
                        e.selectionProvider = new E(s, e, n), e.domAccessProvider = new w(s), s.rowFactory = new C(s, e, h, k, l), s.searchProvider = new D(e, s, j), s.styleProvider = new F(e, s), e.$on("$destroy", e.$watch("configGroups", function(a) {
                            var b = [];
                            angular.forEach(a, function(a) {
                                b.push(a.field || a)
                            }), s.config.groups = b, s.rowFactory.filteredRowsChanged(), e.$emit("ngGridEventGroups", a)
                        }, !0)), e.$on("$destroy", e.$watch("columns", function(a) {
                            e.isColumnResizing || h.RebuildGrid(e, s), e.$emit("ngGridEventColumns", a)
                        }, !0)), e.$on("$destroy", e.$watch(function() {
                            return f.i18n
                        }, function(a) {
                            l.seti18n(e, a)
                        })), s.maxCanvasHt = s.calcMaxCanvasHeight(), s.config.sortInfo.fields && s.config.sortInfo.fields.length > 0 && e.$on("$destroy", e.$watch(function() {
                            return s.config.sortInfo
                        }, function(a) {
                            g.isSorting || (s.sortColumnsInit(), e.$emit("ngGridEventSorted", s.config.sortInfo))
                        }, !0))
                    })
                }, s.resizeOnData = function(a) {
                    var c = a.minWidth,
                        d = l.getElementsByClassName("col" + a.index);
                    angular.forEach(d, function(a, d) {
                        var e;
                        if (0 === d) {
                            var f = b(a).find(".ngHeaderText");
                            e = l.visualLength(f) + 10
                        } else {
                            var g = b(a).find(".ngCellText");
                            e = l.visualLength(g) + 10
                        }
                        e > c && (c = e)
                    }), a.width = a.longest = Math.min(a.maxWidth, c + 7), h.BuildStyles(e, s, !0)
                }, s.lastSortedColumns = [], s.sortData = function(a, c) {
                    if (c && c.shiftKey && s.config.sortInfo) {
                        var d = s.config.sortInfo.columns.indexOf(a);
                        d === -1 ? (1 === s.config.sortInfo.columns.length && (s.config.sortInfo.columns[0].sortPriority = 1), s.config.sortInfo.columns.push(a), a.sortPriority = s.config.sortInfo.columns.length, s.config.sortInfo.fields.push(a.field), s.config.sortInfo.directions.push(a.sortDirection), s.lastSortedColumns.push(a)) : s.config.sortInfo.directions[d] = a.sortDirection
                    } else if (!s.config.useExternalSorting || s.config.useExternalSorting && s.config.sortInfo) {
                        var f = b.isArray(a);
                        s.config.sortInfo.columns.length = 0, s.config.sortInfo.fields.length = 0, s.config.sortInfo.directions.length = 0;
                        var g = function(a) {
                            s.config.sortInfo.columns.push(a), s.config.sortInfo.fields.push(a.field), s.config.sortInfo.directions.push(a.sortDirection), s.lastSortedColumns.push(a)
                        };
                        f ? angular.forEach(a, function(a, b) {
                            a.sortPriority = b + 1, g(a)
                        }) : (s.clearSortingData(a), a.sortPriority = void 0, g(a)), s.sortActual(), s.searchProvider.evalFilter(), e.$emit("ngGridEventSorted", s.config.sortInfo)
                    }
                }, s.sortColumnsInit = function() {
                    s.config.sortInfo.columns ? s.config.sortInfo.columns.length = 0 : s.config.sortInfo.columns = [];
                    var a = [];
                    angular.forEach(e.columns, function(b) {
                        var c = s.config.sortInfo.fields.indexOf(b.field);
                        c !== -1 && (b.sortDirection = s.config.sortInfo.directions[c] || "asc", a[c] = b)
                    }), 1 === a.length ? s.sortData(a[0]) : s.sortData(a)
                }, s.sortActual = function() {
                    if (!s.config.useExternalSorting) {
                        var a = s.data.slice(0);
                        angular.forEach(a, function(a, b) {
                            var c = s.rowMap[b];
                            if (void 0 !== c) {
                                var d = s.rowCache[c];
                                void 0 !== d && (a.preSortSelected = d.selected, a.preSortIndex = b)
                            }
                        }), g.Sort(s.config.sortInfo, a), angular.forEach(a, function(a, b) {
                            s.rowCache[b].entity = a, s.rowCache[b].selected = a.preSortSelected, s.rowMap[a.preSortIndex] = b, delete a.preSortSelected, delete a.preSortIndex
                        })
                    }
                }, s.clearSortingData = function(a) {
                    a ? (angular.forEach(s.lastSortedColumns, function(b) {
                        a.index !== b.index && (b.sortDirection = "", b.sortPriority = null)
                    }), s.lastSortedColumns[0] = a, s.lastSortedColumns.length = 1) : (angular.forEach(s.lastSortedColumns, function(a) {
                        a.sortDirection = "", a.sortPriority = null
                    }), s.lastSortedColumns = [])
                }, s.fixColumnIndexes = function() {
                    for (var a = 0; a < e.columns.length; a++) e.columns[a].index = a
                }, s.fixGroupIndexes = function() {
                    angular.forEach(e.configGroups, function(a, b) {
                        a.groupIndex = b + 1
                    })
                }, e.elementsNeedMeasuring = !0, e.columns = [], e.renderedRows = [], e.renderedColumns = [], e.headerRow = null, e.rowHeight = s.config.rowHeight, e.jqueryUITheme = s.config.jqueryUITheme, e.showSelectionCheckbox = s.config.showSelectionCheckbox, e.enableCellSelection = s.config.enableCellSelection, e.enableCellEditOnFocus = s.config.enableCellEditOnFocus, e.footer = null, e.selectedItems = s.config.selectedItems, e.multiSelect = s.config.multiSelect, e.showFooter = s.config.showFooter, e.footerRowHeight = e.showFooter ? s.config.footerRowHeight : 0, e.showColumnMenu = s.config.showColumnMenu, e.forceSyncScrolling = s.config.forceSyncScrolling, e.showMenu = !1, e.configGroups = [], e.gridId = s.gridId, e.enablePaging = s.config.enablePaging, e.pagingOptions = s.config.pagingOptions, e.i18n = {}, l.seti18n(e, s.config.i18n), e.adjustScrollLeft = function(a) {
                    for (var b = 0, c = 0, d = e.columns.length, f = [], g = !s.config.enableColumnHeavyVirt, i = 0, j = function(a) {
                            g ? f.push(a) : e.renderedColumns[i] ? e.renderedColumns[i].setVars(a) : e.renderedColumns[i] = a.copy(), i++
                        }, k = 0; k < d; k++) {
                        var l = e.columns[k];
                        if (l.visible !== !1) {
                            var m = l.width + b;
                            if (l.pinned) {
                                j(l);
                                var n = k > 0 ? a + c : a;
                                h.setColLeft(l, n, s), c += l.width
                            } else m >= a && b <= a + s.rootDim.outerWidth && j(l);
                            b += l.width
                        }
                    }
                    g && (e.renderedColumns = f)
                }, s.prevScrollTop = 0, s.prevScrollIndex = 0, e.adjustScrollTop = function(a, b) {
                    if (s.prevScrollTop !== a || b) {
                        a > 0 && s.$viewport[0].scrollHeight - a <= s.$viewport.outerHeight() && e.$emit("ngGridEventScroll");
                        var f, g = Math.floor(a / s.config.rowHeight);
                        if (s.filteredRows.length > s.config.virtualizationThreshold) {
                            if (s.prevScrollTop < a && g < s.prevScrollIndex + d) return;
                            if (s.prevScrollTop > a && g > s.prevScrollIndex - d) return;
                            f = new A(Math.max(0, g - c), g + s.minRowsToRender() + c)
                        } else {
                            var h = e.configGroups.length > 0 ? s.rowFactory.parsedData.length : s.filteredRows.length;
                            f = new A(0, Math.max(h, s.minRowsToRender() + c))
                        }
                        s.prevScrollTop = a, s.rowFactory.UpdateViewableRange(f), s.prevScrollIndex = g
                    }
                }, e.toggleShowMenu = function() {
                    e.showMenu = !e.showMenu
                }, e.toggleSelectAll = function(a, b) {
                    e.selectionProvider.toggleSelectAll(a, !1, b)
                }, e.totalFilteredItemsLength = function() {
                    return s.filteredRows.length
                }, e.showGroupPanel = function() {
                    return s.config.showGroupPanel
                }, e.topPanelHeight = function() {
                    return s.config.showGroupPanel === !0 ? s.config.headerRowHeight + 32 : s.config.headerRowHeight
                }, e.viewportDimHeight = function() {
                    return Math.max(0, s.rootDim.outerHeight - e.topPanelHeight() - e.footerRowHeight - 2)
                }, e.groupBy = function(a) {
                    if (!(s.data.length < 1) && a.groupable && a.field) {
                        a.sortDirection || a.sort({
                            shiftKey: e.configGroups.length > 0
                        });
                        var b = e.configGroups.indexOf(a);
                        b === -1 ? (a.isGroupedBy = !0, e.configGroups.push(a), a.groupIndex = e.configGroups.length) : e.removeGroup(b), s.$viewport.scrollTop(0), h.digest(e)
                    }
                }, e.removeGroup = function(a) {
                    var b = e.columns.filter(function(b) {
                        return b.groupIndex === a + 1
                    })[0];
                    b.isGroupedBy = !1, b.groupIndex = 0, e.columns[a].isAggCol && (e.columns.splice(a, 1), e.configGroups.splice(a, 1), s.fixGroupIndexes()), 0 === e.configGroups.length && (s.fixColumnIndexes(), h.digest(e)), e.adjustScrollLeft(0)
                }, e.togglePin = function(a) {
                    for (var b = a.index, c = 0, d = 0; d < e.columns.length && e.columns[d].pinned; d++) c++;
                    a.pinned && (c = Math.max(a.originalIndex, c - 1)), a.pinned = !a.pinned, e.columns.splice(b, 1), e.columns.splice(c, 0, a), s.fixColumnIndexes(), h.BuildStyles(e, s, !0), s.$viewport.scrollLeft(s.$viewport.scrollLeft() - a.width)
                }, e.totalRowWidth = function() {
                    for (var a = 0, b = e.columns, c = 0; c < b.length; c++) b[c].visible !== !1 && (a += b[c].width);
                    return a
                }, e.headerScrollerDim = function() {
                    var a = e.viewportDimHeight(),
                        b = s.maxCanvasHt,
                        c = b > a,
                        d = new v;
                    return d.autoFitHeight = !0, d.outerWidth = e.totalRowWidth(), c ? d.outerWidth += s.elementDims.scrollW : b - a <= s.elementDims.scrollH && (d.outerWidth += s.elementDims.scrollW), d
                }
            },
            A = function(a, b) {
                this.topRow = a, this.bottomRow = b
            },
            B = function(a, b, c, d, e) {
                this.entity = a, this.config = b, this.selectionProvider = c, this.rowIndex = d, this.utils = e, this.selected = c.getSelection(a), this.cursor = this.config.enableRowSelection && !this.config.selectWithCheckboxOnly ? "pointer" : "default", this.beforeSelectionChange = b.beforeSelectionChangeCallback, this.afterSelectionChange = b.afterSelectionChangeCallback, this.offsetTop = this.rowIndex * b.rowHeight, this.rowDisplayIndex = 0
            };
        B.prototype.setSelection = function(a) {
            this.selectionProvider.setSelection(this, a), this.selectionProvider.lastClickedRow = this
        }, B.prototype.continueSelection = function(a) {
            this.selectionProvider.ChangeSelection(this, a)
        }, B.prototype.ensureEntity = function(a) {
            this.entity !== a && (this.entity = a, this.selected = this.selectionProvider.getSelection(this.entity))
        }, B.prototype.toggleSelected = function(a) {
            if (!this.config.enableRowSelection && !this.config.enableCellSelection) return !0;
            var b = a.target || a;
            return "checkbox" === b.type && "ngSelectionCell ng-scope" !== b.parentElement.className || (this.config.selectWithCheckboxOnly && "checkbox" !== b.type ? (this.selectionProvider.lastClickedRow = this, !0) : (this.beforeSelectionChange(this, a) && this.continueSelection(a), !1))
        }, B.prototype.alternatingRowClass = function() {
            var a = this.rowIndex % 2 === 0,
                b = {
                    ngRow: !0,
                    selected: this.selected,
                    even: a,
                    odd: !a,
                    "ui-state-default": this.config.jqueryUITheme && a,
                    "ui-state-active": this.config.jqueryUITheme && !a
                };
            return b
        }, B.prototype.getProperty = function(a) {
            return this.utils.evalProperty(this.entity, a)
        }, B.prototype.copy = function() {
            return this.clone = new B(this.entity, this.config, this.selectionProvider, this.rowIndex, this.utils), this.clone.isClone = !0, this.clone.elm = this.elm, this.clone.orig = this, this.clone
        }, B.prototype.setVars = function(a) {
            a.clone = this, this.entity = a.entity, this.selected = a.selected, this.orig = a
        };
        var C = function(a, b, d, e, f) {
                var k = this;
                k.aggCache = {}, k.parentCache = [], k.dataChanged = !0, k.parsedData = [], k.rowConfig = {}, k.selectionProvider = b.selectionProvider, k.rowHeight = 30, k.numberOfAggregates = 0, k.groupedData = void 0, k.rowHeight = a.config.rowHeight, k.rowConfig = {
                    enableRowSelection: a.config.enableRowSelection,
                    rowClasses: a.config.rowClasses,
                    selectedItems: b.selectedItems,
                    selectWithCheckboxOnly: a.config.selectWithCheckboxOnly,
                    beforeSelectionChangeCallback: a.config.beforeSelectionChange,
                    afterSelectionChangeCallback: a.config.afterSelectionChange,
                    jqueryUITheme: a.config.jqueryUITheme,
                    enableCellSelection: a.config.enableCellSelection,
                    rowHeight: a.config.rowHeight
                }, k.renderedRange = new A(0, a.minRowsToRender() + c), k.buildEntityRow = function(a, b) {
                    return new B(a, k.rowConfig, k.selectionProvider, b, f)
                }, k.buildAggregateRow = function(b, c) {
                    var d = k.aggCache[b.aggIndex];
                    return d || (d = new t(b, k, k.rowConfig.rowHeight, a.config.groupsCollapsedByDefault), k.aggCache[b.aggIndex] = d), d.rowIndex = c, d.offsetTop = c * k.rowConfig.rowHeight, d
                }, k.UpdateViewableRange = function(a) {
                    k.renderedRange = a, k.renderedChange()
                }, k.filteredRowsChanged = function() {
                    a.lateBoundColumns && a.filteredRows.length > 0 && (a.config.columnDefs = void 0, a.buildColumns(), a.lateBoundColumns = !1, b.$evalAsync(function() {
                        b.adjustScrollLeft(0)
                    })), k.dataChanged = !0, a.config.groups.length > 0 && k.getGrouping(a.config.groups), k.UpdateViewableRange(k.renderedRange)
                }, k.renderedChange = function() {
                    if (!k.groupedData || a.config.groups.length < 1) return k.renderedChangeNoGroups(), void a.refreshDomSizes();
                    k.wasGrouped = !0, k.parentCache = [];
                    var b = 0,
                        c = k.parsedData.filter(function(a) {
                            return a.isAggRow ? !a.parent || !a.parent.collapsed : (a[i] || (a.rowIndex = b++), !a[i])
                        });
                    k.totalRows = c.length;
                    for (var d = [], e = k.renderedRange.topRow; e < k.renderedRange.bottomRow; e++) c[e] && (c[e].offsetTop = e * a.config.rowHeight, d.push(c[e]));
                    a.setRenderedRows(d)
                }, k.renderedChangeNoGroups = function() {
                    for (var b = [], c = k.renderedRange.topRow; c < k.renderedRange.bottomRow; c++) a.filteredRows[c] && (a.filteredRows[c].rowIndex = c, a.filteredRows[c].offsetTop = c * a.config.rowHeight, b.push(a.filteredRows[c]));
                    a.setRenderedRows(b)
                }, k.fixRowCache = function() {
                    var b = a.data.length,
                        c = b - a.rowCache.length;
                    if (c < 0) a.rowCache.length = a.rowMap.length = b;
                    else
                        for (var d = a.rowCache.length; d < b; d++) a.rowCache[d] = a.rowFactory.buildEntityRow(a.data[d], d)
                }, k.parseGroupData = function(a) {
                    if (a.values)
                        for (var b = 0; b < a.values.length; b++) k.parentCache[k.parentCache.length - 1].children.push(a.values[b]), k.parsedData.push(a.values[b]);
                    else
                        for (var c in a)
                            if (c !== g && c !== h && c !== j && a.hasOwnProperty(c)) {
                                var d = k.buildAggregateRow({
                                    gField: a[g],
                                    gLabel: c,
                                    gDepth: a[h],
                                    isAggRow: !0,
                                    _ng_hidden_: !1,
                                    children: [],
                                    aggChildren: [],
                                    aggIndex: k.numberOfAggregates,
                                    aggLabelFilter: a[j].aggLabelFilter
                                }, 0);
                                k.numberOfAggregates++, d.parent = k.parentCache[d.depth - 1], d.parent && (d.parent.collapsed = !1, d.parent.aggChildren.push(d)),
                                    k.parsedData.push(d), k.parentCache[d.depth] = d, k.parseGroupData(a[c])
                            }
                }, k.getGrouping = function(c) {
                    function l(a, b) {
                        return a.filter(function(a) {
                            return a.field === b
                        })
                    }
                    k.aggCache = [], k.numberOfAggregates = 0, k.groupedData = {};
                    for (var m = a.filteredRows, n = c.length, o = b.columns, p = 0; p < m.length; p++) {
                        var q = m[p].entity;
                        if (!q) return;
                        m[p][i] = a.config.groupsCollapsedByDefault;
                        for (var r = k.groupedData, s = 0; s < c.length; s++) {
                            var t = c[s],
                                v = l(o, t)[0],
                                w = f.evalProperty(q, t);
                            w = w ? w.toString() : "null", r[w] || (r[w] = {}), r[g] || (r[g] = t), r[h] || (r[h] = s), r[j] || (r[j] = v), r = r[w]
                        }
                        r.values || (r.values = []), r.values.push(m[p])
                    }
                    if (o.length > 0)
                        for (var x = 0; x < c.length; x++) !o[x].isAggCol && x <= n && o.splice(0, 0, new u({
                            colDef: {
                                field: "",
                                width: 25,
                                sortable: !1,
                                resizable: !1,
                                headerCellTemplate: '<div class="ngAggHeader"></div>',
                                pinned: a.config.pinSelectionCheckbox
                            },
                            enablePinning: a.config.enablePinning,
                            isAggCol: !0,
                            headerRowHeight: a.config.headerRowHeight
                        }, b, a, d, e, f));
                    a.fixColumnIndexes(), b.adjustScrollLeft(0), k.parsedData.length = 0, k.parseGroupData(k.groupedData), k.fixRowCache()
                }, a.config.groups.length > 0 && a.filteredRows.length > 0 && k.getGrouping(a.config.groups)
            },
            D = function(a, c, d) {
                var e = this,
                    f = [];
                e.extFilter = c.config.filterOptions.useExternalFilter, a.showFilter = c.config.showFilter, a.filterText = "", e.fieldMap = {};
                var g = function(a) {
                        var b = {};
                        for (var c in a) a.hasOwnProperty(c) && (b[c.toLowerCase()] = a[c]);
                        return b
                    },
                    h = function(a, b, c) {
                        var e;
                        for (var f in b)
                            if (b.hasOwnProperty(f)) {
                                var i = c[f.toLowerCase()];
                                if (!i) continue;
                                var j = b[f];
                                if ("object" != typeof j || j instanceof Date) {
                                    var k = null,
                                        l = null;
                                    if (i && i.cellFilter && (l = i.cellFilter.split(":"), k = d(l[0])), null !== j && void 0 !== j) {
                                        if ("function" == typeof k) {
                                            var m = k(j, l[1].slice(1, -1)).toString();
                                            e = a.regex.test(m)
                                        } else e = a.regex.test(j.toString());
                                        if (e) return !0
                                    }
                                } else {
                                    var n = g(i);
                                    if (e = h(a, j, n)) return !0
                                }
                            } return !1
                    },
                    i = function(a, b) {
                        var c, f = e.fieldMap[a.columnDisplay];
                        if (!f) return !1;
                        var g = f.cellFilter.split(":"),
                            h = f.cellFilter ? d(g[0]) : null,
                            i = b[a.column] || b[f.field.split(".")[0]];
                        if (null === i || void 0 === i) return !1;
                        if ("function" == typeof h) {
                            var j = h("object" == typeof i ? k(i, f.field) : i, g[1]).toString();
                            c = a.regex.test(j)
                        } else c = a.regex.test("object" == typeof i ? k(i, f.field).toString() : i.toString());
                        return !!c
                    },
                    j = function(a) {
                        for (var b = 0, c = f.length; b < c; b++) {
                            var d, g = f[b];
                            if (d = g.column ? i(g, a) : h(g, a, e.fieldMap), !d) return !1
                        }
                        return !0
                    };
                e.evalFilter = function() {
                    0 === f.length ? c.filteredRows = c.rowCache : c.filteredRows = c.rowCache.filter(function(a) {
                        return j(a.entity)
                    });
                    for (var a = 0; a < c.filteredRows.length; a++) c.filteredRows[a].rowIndex = a;
                    c.rowFactory.filteredRowsChanged()
                };
                var k = function(a, b) {
                        if ("object" != typeof a || "string" != typeof b) return a;
                        var c = b.split("."),
                            d = a;
                        if (c.length > 1) {
                            for (var e = 1, f = c.length; e < f; e++)
                                if (d = d[c[e]], !d) return a;
                            return d
                        }
                        return a
                    },
                    l = function(a, b) {
                        try {
                            return new RegExp(a, b)
                        } catch (c) {
                            return new RegExp(a.replace(/(\^|\$|\(|\)|<|>|\[|\]|\{|\}|\\|\||\.|\*|\+|\?)/g, "\\$1"))
                        }
                    },
                    m = function(a) {
                        f = [];
                        var c;
                        if (c = b.trim(a))
                            for (var d = c.split(";"), e = 0; e < d.length; e++) {
                                var g = d[e].split(":");
                                if (g.length > 1) {
                                    var h = b.trim(g[0]),
                                        i = b.trim(g[1]);
                                    h && i && f.push({
                                        column: h,
                                        columnDisplay: h.replace(/\s+/g, "").toLowerCase(),
                                        regex: l(i, "i")
                                    })
                                } else {
                                    var j = b.trim(g[0]);
                                    j && f.push({
                                        column: "",
                                        regex: l(j, "i")
                                    })
                                }
                            }
                    };
                e.extFilter || a.$on("$destroy", a.$watch("columns", function(a) {
                    for (var b = 0; b < a.length; b++) {
                        var c = a[b];
                        if (c.field)
                            if (c.field.match(/\./g)) {
                                for (var d = c.field.split("."), f = e.fieldMap, g = 0; g < d.length - 1; g++) f[d[g]] = f[d[g]] || {}, f = f[d[g]];
                                f[d[d.length - 1]] = c
                            } else e.fieldMap[c.field.toLowerCase()] = c;
                        c.displayName && (e.fieldMap[c.displayName.toLowerCase().replace(/\s+/g, "")] = c)
                    }
                })), a.$on("$destroy", a.$watch(function() {
                    return c.config.filterOptions.filterText
                }, function(b) {
                    a.filterText = b
                })), a.$on("$destroy", a.$watch("filterText", function(b) {
                    e.extFilter || (a.$emit("ngGridEventFilter", b), m(b), e.evalFilter())
                }))
            },
            E = function(a, b, c) {
                var d = this;
                d.multi = a.config.multiSelect, d.selectedItems = a.config.selectedItems, d.selectedIndex = a.config.selectedIndex, d.lastClickedRow = void 0, d.ignoreSelectedItemChanges = !1, d.pKeyParser = c(a.config.primaryKey), d.ChangeSelection = function(c, e) {
                    var f = e.which || e.keyCode,
                        g = 40 === f || 38 === f;
                    if (e && e.shiftKey && !e.keyCode && d.multi && a.config.enableRowSelection) {
                        if (d.lastClickedRow) {
                            var h;
                            h = b.configGroups.length > 0 ? a.rowFactory.parsedData.filter(function(a) {
                                return !a.isAggRow
                            }) : a.filteredRows;
                            var i = c.rowIndex,
                                j = d.lastClickedRowIndex;
                            if (i === j) return !1;
                            i < j ? (i ^= j, j = i ^ j, i ^= j, i--) : j++;
                            for (var k = []; j <= i; j++) k.push(h[j]);
                            if (k[k.length - 1].beforeSelectionChange(k, e)) {
                                for (var l = 0; l < k.length; l++) {
                                    var m = k[l],
                                        n = m.selected;
                                    m.selected = !n, m.clone && (m.clone.selected = m.selected);
                                    var o = d.selectedItems.indexOf(m.entity);
                                    o === -1 ? d.selectedItems.push(m.entity) : d.selectedItems.splice(o, 1)
                                }
                                k[k.length - 1].afterSelectionChange(k, e)
                            }
                            return d.lastClickedRow = c, d.lastClickedRowIndex = c.rowIndex, !0
                        }
                    } else d.multi ? (!e.keyCode || g && !a.config.selectWithCheckboxOnly) && d.setSelection(c, !c.selected) : d.lastClickedRow === c ? d.setSelection(d.lastClickedRow, !!a.config.keepLastSelected || !c.selected) : (d.lastClickedRow && d.setSelection(d.lastClickedRow, !1), d.setSelection(c, !c.selected));
                    return d.lastClickedRow = c, d.lastClickedRowIndex = c.rowIndex, !0
                }, d.getSelection = function(a) {
                    return d.getSelectionIndex(a) !== -1
                }, d.getSelectionIndex = function(b) {
                    var c = -1;
                    if (a.config.primaryKey) {
                        var e = d.pKeyParser(b);
                        angular.forEach(d.selectedItems, function(a, b) {
                            e === d.pKeyParser(a) && (c = b)
                        })
                    } else c = d.selectedItems.indexOf(b);
                    return c
                }, d.setSelection = function(b, c) {
                    if (a.config.enableRowSelection) {
                        if (c) d.getSelectionIndex(b.entity) === -1 && (!d.multi && d.selectedItems.length > 0 && d.toggleSelectAll(!1, !0), d.selectedItems.push(b.entity));
                        else {
                            var e = d.getSelectionIndex(b.entity);
                            e !== -1 && d.selectedItems.splice(e, 1)
                        }
                        b.selected = c, b.orig && (b.orig.selected = c), b.clone && (b.clone.selected = c), b.afterSelectionChange(b)
                    }
                }, d.toggleSelectAll = function(b, c, e) {
                    var f = e ? a.filteredRows : a.rowCache;
                    if (c || a.config.beforeSelectionChange(f, b)) {
                        var g = d.selectedItems.length;
                        g > 0 && (d.selectedItems.length = 0);
                        for (var h = 0; h < f.length; h++) f[h].selected = b, f[h].clone && (f[h].clone.selected = b), b && d.selectedItems.push(f[h].entity);
                        c || a.config.afterSelectionChange(f, b)
                    }
                }
            },
            F = function(a, b) {
                a.headerCellStyle = function(a) {
                    return {
                        height: a.headerRowHeight + "px"
                    }
                }, a.rowStyle = function(b) {
                    var c = {
                        top: b.offsetTop + "px",
                        height: a.rowHeight + "px"
                    };
                    return b.isAggRow && (c.left = b.offsetLeft), c
                }, a.canvasStyle = function() {
                    return {
                        height: b.maxCanvasHt + "px"
                    }
                }, a.headerScrollerStyle = function() {
                    return {
                        height: b.config.headerRowHeight + "px"
                    }
                }, a.topPanelStyle = function() {
                    return {
                        width: b.rootDim.outerWidth + "px",
                        height: a.topPanelHeight() + "px"
                    }
                }, a.headerStyle = function() {
                    return {
                        width: b.rootDim.outerWidth + "px",
                        height: b.config.headerRowHeight + "px"
                    }
                }, a.groupPanelStyle = function() {
                    return {
                        width: b.rootDim.outerWidth + "px",
                        height: "32px"
                    }
                }, a.viewportStyle = function() {
                    return {
                        width: b.rootDim.outerWidth + "px",
                        height: a.viewportDimHeight() + "px"
                    }
                }, a.footerStyle = function() {
                    return {
                        width: b.rootDim.outerWidth + "px",
                        height: a.footerRowHeight + "px"
                    }
                }
            };
        q.directive("ngCellHasFocus", ["$domUtilityService", function(a) {
            var b = function(b, c) {
                b.isFocused = !0, a.digest(b), b.$broadcast("ngGridEventStartCellEdit"), b.$emit("ngGridEventStartCellEdit"), b.$on("$destroy", b.$on("ngGridEventEndCellEdit", function() {
                    b.isFocused = !1, a.digest(b)
                }))
            };
            return function(a, c) {
                function d(b) {
                    return a.enableCellEditOnFocus ? j = !0 : c.focus(), !0
                }

                function e(d) {
                    a.enableCellEditOnFocus && (d.preventDefault(), j = !1, b(a, c))
                }

                function f(d) {
                    return i = !0, a.enableCellEditOnFocus && !j && b(a, c), !0
                }

                function g() {
                    return i = !1, !0
                }

                function h(d) {
                    return a.enableCellEditOnFocus || (i && 37 !== d.keyCode && 38 !== d.keyCode && 39 !== d.keyCode && 40 !== d.keyCode && 9 !== d.keyCode && !d.shiftKey && 13 !== d.keyCode && b(a, c), i && d.shiftKey && d.keyCode >= 65 && d.keyCode <= 90 && b(a, c), 27 === d.keyCode && c.focus()), !0
                }
                var i = !1,
                    j = !1;
                a.editCell = function() {
                    a.enableCellEditOnFocus || setTimeout(function() {
                        b(a, c)
                    }, 0)
                }, c.bind("mousedown", d), c.bind("click", e), c.bind("focus", f), c.bind("blur", g), c.bind("keydown", h), c.on("$destroy", function() {
                    c.off("mousedown", d), c.off("click", e), c.off("focus", f), c.off("blur", g), c.off("keydown", h)
                })
            }
        }]), q.directive("ngCellText", function() {
            return function(a, b) {
                function c(a) {
                    a.preventDefault()
                }

                function d(a) {
                    a.preventDefault()
                }
                b.bind("mouseover", c), b.bind("mouseleave", d), b.on("$destroy", function() {
                    b.off("mouseover", c), b.off("mouseleave", d)
                })
            }
        }), q.directive("ngCell", ["$compile", "$domUtilityService", function(a, c) {
            var d = {
                scope: !1,
                compile: function() {
                    return {
                        pre: function(c, d) {
                            var e, f = c.col.cellTemplate.replace(l, "row.entity." + c.col.field);
                            c.col.enableCellEdit ? (e = c.col.cellEditTemplate, e = e.replace(o, c.col.cellEditableCondition), e = e.replace(m, f), e = e.replace(n, c.col.editableCellTemplate.replace(l, "row.entity." + c.col.field))) : e = f;
                            var g = b(e);
                            d.append(g), a(g)(c), c.enableCellSelection && g[0].className.indexOf("ngSelectionCell") === -1 && (g[0].setAttribute("tabindex", 0), g.addClass("ngCellElement"))
                        },
                        post: function(a, b) {
                            a.enableCellSelection && a.domAccessProvider.selectionHandlers(a, b), a.$on("$destroy", a.$on("ngGridEventDigestCell", function() {
                                c.digest(a)
                            }))
                        }
                    }
                }
            };
            return d
        }]), q.directive("ngEditCellIf", [function() {
            return {
                transclude: "element",
                priority: 1e3,
                terminal: !0,
                restrict: "A",
                compile: function(a, b, c) {
                    return function(a, b, d) {
                        var e, f;
                        a.$on("$destroy", a.$watch(d.ngEditCellIf, function(d) {
                            e && (e.remove(), e = void 0), f && (f.$destroy(), f = void 0), d && (f = a.$new(), c(f, function(a) {
                                e = a, b.after(a)
                            }))
                        }))
                    }
                }
            }
        }]), q.directive("ngGridFooter", ["$compile", "$templateCache", function(a, b) {
            var c = {
                scope: !1,
                compile: function() {
                    return {
                        pre: function(c, d) {
                            0 === d.children().length && d.append(a(b.get(c.gridId + "footerTemplate.html"))(c))
                        }
                    }
                }
            };
            return c
        }]), q.directive("ngGridMenu", ["$compile", "$templateCache", function(a, b) {
            var c = {
                scope: !1,
                compile: function() {
                    return {
                        pre: function(c, d) {
                            0 === d.children().length && d.append(a(b.get(c.gridId + "menuTemplate.html"))(c))
                        }
                    }
                }
            };
            return c
        }]), q.directive("ngGrid", ["$compile", "$filter", "$templateCache", "$sortService", "$domUtilityService", "$utilityService", "$timeout", "$parse", "$http", "$q", function(a, c, d, e, f, g, h, i, j, k) {
            var l = {
                scope: !0,
                compile: function() {
                    return {
                        pre: function(l, m, n) {
                            var o = b(m),
                                p = l.$eval(n.ngGrid);
                            p.gridDim = new v({
                                outerHeight: b(o).height(),
                                outerWidth: b(o).width()
                            });
                            var q = new z(l, p, e, f, c, d, g, h, i, j, k);
                            return l.$on("$destroy", function() {
                                p.gridDim = null, p.selectRow = null, p.selectItem = null, p.selectAll = null, p.selectVisible = null, p.groupBy = null, p.sortBy = null, p.gridId = null, p.ngGrid = null, p.$gridScope = null, p.$gridServices = null, l.domAccessProvider.grid = null, angular.element(q.styleSheet).remove(), q.styleSheet = null
                            }), q.init().then(function() {
                                if ("string" == typeof p.columnDefs ? l.$on("$destroy", l.$parent.$watch(p.columnDefs, function(a) {
                                        return a ? (q.lateBoundColumns = !1, l.columns = [], q.config.columnDefs = a, q.buildColumns(), q.eventProvider.assignEvents(), void f.RebuildGrid(l, q)) : (q.refreshDomSizes(), void q.buildColumns())
                                    }, !0)) : q.buildColumns(), "string" == typeof p.totalServerItems ? l.$on("$destroy", l.$parent.$watch(p.totalServerItems, function(a, b) {
                                        angular.isDefined(a) ? l.totalServerItems = a : l.totalServerItems = 0
                                    })) : l.totalServerItems = 0, "string" == typeof p.data) {
                                    var c = function(a) {
                                        q.data = b.extend([], a), q.rowFactory.fixRowCache(), angular.forEach(q.data, function(a, b) {
                                            var c = q.rowMap[b] || b;
                                            q.rowCache[c] && q.rowCache[c].ensureEntity(a), q.rowMap[c] = b
                                        }), q.searchProvider.evalFilter(), q.configureColumnWidths(), q.refreshDomSizes(), q.config.sortInfo.fields.length > 0 && (q.sortColumnsInit(), l.$emit("ngGridEventSorted", q.config.sortInfo)), l.$emit("ngGridEventData", q.gridId)
                                    };
                                    l.$on("$destroy", l.$parent.$watch(p.data, c)), l.$on("$destroy", l.$parent.$watch(p.data + ".length", function() {
                                        c(l.$eval(p.data)), l.adjustScrollTop(q.$viewport.scrollTop(), !0)
                                    }))
                                }
                                return q.footerController = new y(l, q), m.addClass("ngGrid").addClass(q.gridId.toString()), p.enableHighlighting || m.addClass("unselectable"), p.jqueryUITheme && m.addClass("ui-widget"), m.append(a(d.get("gridTemplate.html"))(l)), f.AssignGridContainers(l, m, q), q.eventProvider = new x(q, l, f, h), p.selectRow = function(a, b) {
                                    q.rowCache[a] && (q.rowCache[a].clone && q.rowCache[a].clone.setSelection(!!b), q.rowCache[a].setSelection(!!b))
                                }, p.selectItem = function(a, b) {
                                    p.selectRow(q.rowMap[a], b)
                                }, p.selectAll = function(a) {
                                    l.toggleSelectAll(a)
                                }, p.selectVisible = function(a) {
                                    l.toggleSelectAll(a, !0)
                                }, p.groupBy = function(a) {
                                    if (a) l.groupBy(l.columns.filter(function(b) {
                                        return b.field === a
                                    })[0]);
                                    else {
                                        var c = b.extend(!0, [], l.configGroups);
                                        angular.forEach(c, l.groupBy)
                                    }
                                }, p.sortBy = function(a) {
                                    var b = l.columns.filter(function(b) {
                                        return b.field === a
                                    })[0];
                                    b && b.sort()
                                }, p.gridId = q.gridId, p.ngGrid = q, p.$gridScope = l, p.$gridServices = {
                                    SortService: e,
                                    DomUtilityService: f,
                                    UtilityService: g
                                }, l.$on("$destroy", l.$on("ngGridEventDigestGrid", function() {
                                    f.digest(l.$parent)
                                })), l.$on("$destroy", l.$on("ngGridEventDigestGridParent", function() {
                                    f.digest(l.$parent)
                                })), l.$evalAsync(function() {
                                    l.adjustScrollLeft(0)
                                }), angular.forEach(p.plugins, function(a) {
                                    "function" == typeof a && (a = new a);
                                    var b = l.$new();
                                    a.init(b, q, p.$gridServices), p.plugins[g.getInstanceType(a)] = a, l.$on("$destroy", function() {
                                        b.$destroy()
                                    })
                                }), "function" == typeof p.init && p.init(q, l), null
                            })
                        }
                    }
                }
            };
            return l
        }]), q.directive("ngHeaderCell", ["$compile", function(a) {
            var b = {
                scope: !1,
                compile: function() {
                    return {
                        pre: function(b, c) {
                            c.append(a(b.col.headerCellTemplate)(b))
                        }
                    }
                }
            };
            return b
        }]), q.directive("ngHeaderRow", ["$compile", "$templateCache", function(a, b) {
            var c = {
                scope: !1,
                compile: function() {
                    return {
                        pre: function(c, d) {
                            0 === d.children().length && d.append(a(b.get(c.gridId + "headerRowTemplate.html"))(c))
                        }
                    }
                }
            };
            return c
        }]), q.directive("ngInput", [function() {
            return {
                require: "ngModel",
                link: function(a, b, c, d) {
                    function e(c) {
                        switch (c.keyCode) {
                            case 37:
                            case 38:
                            case 39:
                            case 40:
                                c.stopPropagation();
                                break;
                            case 27:
                                a.$$phase || a.$apply(function() {
                                    d.$setViewValue(h), b.blur()
                                });
                                break;
                            case 13:
                                (a.enableCellEditOnFocus && a.totalFilteredItemsLength() - 1 > a.row.rowIndex && a.row.rowIndex > 0 || a.col.enableCellEdit) && b.blur()
                        }
                        return !0
                    }

                    function f(a) {
                        a.stopPropagation()
                    }

                    function g(a) {
                        a.stopPropagation()
                    }
                    var h, i = a.$watch("ngModel", function() {
                        h = d.$modelValue, i()
                    });
                    b.bind("keydown", e), b.bind("click", f), b.bind("mousedown", g), b.on("$destroy", function() {
                        b.off("keydown", e), b.off("click", f), b.off("mousedown", g)
                    }), a.$on("$destroy", a.$on("ngGridEventStartCellEdit", function() {
                        b.focus(), b.select()
                    })), angular.element(b).bind("blur", function() {
                        a.$emit("ngGridEventEndCellEdit")
                    })
                }
            }
        }]), q.directive("ngRow", ["$compile", "$domUtilityService", "$templateCache", function(a, b, c) {
            var d = {
                scope: !1,
                compile: function() {
                    return {
                        pre: function(d, e) {
                            if (d.row.elm = e, d.row.clone && (d.row.clone.elm = e), d.row.isAggRow) {
                                var f = c.get(d.gridId + "aggregateTemplate.html");
                                f = d.row.aggLabelFilter ? f.replace(k, "| " + d.row.aggLabelFilter) : f.replace(k, ""), e.append(a(f)(d))
                            } else e.append(a(c.get(d.gridId + "rowTemplate.html"))(d));
                            d.$on("$destroy", d.$on("ngGridEventDigestRow", function() {
                                b.digest(d)
                            }))
                        }
                    }
                }
            };
            return d
        }]), q.directive("ngViewport", [function() {
            return function(a, b) {
                function c(b) {
                    var c = b.target.scrollLeft,
                        d = b.target.scrollTop;
                    return a.$headerContainer && a.$headerContainer.scrollLeft(c), a.adjustScrollLeft(c), a.adjustScrollTop(d), a.forceSyncScrolling ? i() : (clearTimeout(g), g = setTimeout(i, 150)), f = c, h = d, e = !1, !0
                }

                function d() {
                    return e = !0, b.focus && b.focus(), !0
                }
                var e, f, g, h = 0,
                    i = function() {
                        a.$root.$$phase || a.$digest()
                    };
                b.bind("scroll", c), b.bind("mousewheel DOMMouseScroll", d), b.on("$destroy", function() {
                    b.off("scroll", c), b.off("mousewheel DOMMouseScroll", d)
                }), a.enableCellSelection || a.domAccessProvider.selectionHandlers(a, b)
            }
        }]), a.ngGrid.i18n.da = {
            ngAggregateLabel: "artikler",
            ngGroupPanelDescription: "Grupér rækker udfra en kolonne ved at trække dens overskift hertil.",
            ngSearchPlaceHolder: "Søg...",
            ngMenuText: "Vælg kolonner:",
            ngShowingItemsLabel: "Viste rækker:",
            ngTotalItemsLabel: "Rækker totalt:",
            ngSelectedItemsLabel: "Valgte rækker:",
            ngPageSizeLabel: "Side størrelse:",
            ngPagerFirstTitle: "Første side",
            ngPagerNextTitle: "Næste side",
            ngPagerPrevTitle: "Forrige side",
            ngPagerLastTitle: "Sidste side"
        }, a.ngGrid.i18n.de = {
            ngAggregateLabel: "eintrag",
            ngGroupPanelDescription: "Ziehen Sie eine Spaltenüberschrift hierhin um nach dieser Spalte zu gruppieren.",
            ngSearchPlaceHolder: "Suche...",
            ngMenuText: "Spalten auswählen:",
            ngShowingItemsLabel: "Zeige Einträge:",
            ngTotalItemsLabel: "Einträge gesamt:",
            ngSelectedItemsLabel: "Ausgewählte Einträge:",
            ngPageSizeLabel: "Einträge pro Seite:",
            ngPagerFirstTitle: "Erste Seite",
            ngPagerNextTitle: "Nächste Seite",
            ngPagerPrevTitle: "Vorherige Seite",
            ngPagerLastTitle: "Letzte Seite"
        }, a.ngGrid.i18n.en = {
            ngAggregateLabel: "items",
            ngGroupPanelDescription: "Drag a column header here and drop it to group by that column.",
            ngSearchPlaceHolder: "Search...",
            ngMenuText: "Choose Columns:",
            ngShowingItemsLabel: "Showing Items:",
            ngTotalItemsLabel: "Total Items:",
            ngSelectedItemsLabel: "Selected Items:",
            ngPageSizeLabel: "Page Size:",
            ngPagerFirstTitle: "First Page",
            ngPagerNextTitle: "Next Page",
            ngPagerPrevTitle: "Previous Page",
            ngPagerLastTitle: "Last Page"
        }, a.ngGrid.i18n.es = {
            ngAggregateLabel: "Artículos",
            ngGroupPanelDescription: "Arrastre un encabezado de columna aquí y soltarlo para agrupar por esa columna.",
            ngSearchPlaceHolder: "Buscar...",
            ngMenuText: "Elegir columnas:",
            ngShowingItemsLabel: "Artículos Mostrando:",
            ngTotalItemsLabel: "Artículos Totales:",
            ngSelectedItemsLabel: "Artículos Seleccionados:",
            ngPageSizeLabel: "Tamaño de Página:",
            ngPagerFirstTitle: "Primera Página",
            ngPagerNextTitle: "Página Siguiente",
            ngPagerPrevTitle: "Página Anterior",
            ngPagerLastTitle: "Última Página"
        }, a.ngGrid.i18n.fa = {
            ngAggregateLabel: "موردها",
            ngGroupPanelDescription: "یک عنوان ستون اینجا را بردار و به گروهی از آن ستون بیانداز.",
            ngSearchPlaceHolder: "جستجو...",
            ngMenuText: "انتخاب ستون‌ها:",
            ngShowingItemsLabel: "نمایش موردها:",
            ngTotalItemsLabel: "همهٔ موردها:",
            ngSelectedItemsLabel: "موردهای انتخاب‌شده:",
            ngPageSizeLabel: "اندازهٔ صفحه:",
            ngPagerFirstTitle: "صفحهٔ اول",
            ngPagerNextTitle: "صفحهٔ بعد",
            ngPagerPrevTitle: "صفحهٔ قبل",
            ngPagerLastTitle: "آخرین صفحه"
        }, a.ngGrid.i18n.fr = {
            ngAggregateLabel: "articles",
            ngGroupPanelDescription: "Faites glisser un en-tête de colonne ici et déposez-le vers un groupe par cette colonne.",
            ngSearchPlaceHolder: "Recherche...",
            ngMenuText: "Choisir des colonnes:",
            ngShowingItemsLabel: "Articles Affichage des:",
            ngTotalItemsLabel: "Nombre total d'articles:",
            ngSelectedItemsLabel: "Éléments Articles:",
            ngPageSizeLabel: "Taille de page:",
            ngPagerFirstTitle: "Première page",
            ngPagerNextTitle: "Page Suivante",
            ngPagerPrevTitle: "Page précédente",
            ngPagerLastTitle: "Dernière page"
        }, a.ngGrid.i18n.nl = {
            ngAggregateLabel: "items",
            ngGroupPanelDescription: "Sleep hier een kolomkop om op te groeperen.",
            ngSearchPlaceHolder: "Zoeken...",
            ngMenuText: "Kies kolommen:",
            ngShowingItemsLabel: "Toon items:",
            ngTotalItemsLabel: "Totaal items:",
            ngSelectedItemsLabel: "Geselecteerde items:",
            ngPageSizeLabel: "Pagina grootte:, ",
            ngPagerFirstTitle: "Eerste pagina",
            ngPagerNextTitle: "Volgende pagina",
            ngPagerPrevTitle: "Vorige pagina",
            ngPagerLastTitle: "Laatste pagina"
        }, a.ngGrid.i18n["pt-br"] = {
            ngAggregateLabel: "itens",
            ngGroupPanelDescription: "Arraste e solte uma coluna aqui para agrupar por essa coluna",
            ngSearchPlaceHolder: "Procurar...",
            ngMenuText: "Selecione as colunas:",
            ngShowingItemsLabel: "Mostrando os Itens:",
            ngTotalItemsLabel: "Total de Itens:",
            ngSelectedItemsLabel: "Items Selecionados:",
            ngPageSizeLabel: "Tamanho da Página:",
            ngPagerFirstTitle: "Primeira Página",
            ngPagerNextTitle: "Próxima Página",
            ngPagerPrevTitle: "Página Anterior",
            ngPagerLastTitle: "Última Página"
        }, a.ngGrid.i18n["zh-cn"] = {
            ngAggregateLabel: "条目",
            ngGroupPanelDescription: "拖曳表头到此处以进行分组",
            ngSearchPlaceHolder: "搜索...",
            ngMenuText: "数据分组与选择列：",
            ngShowingItemsLabel: "当前显示条目：",
            ngTotalItemsLabel: "条目总数：",
            ngSelectedItemsLabel: "选中条目：",
            ngPageSizeLabel: "每页显示数：",
            ngPagerFirstTitle: "回到首页",
            ngPagerNextTitle: "下一页",
            ngPagerPrevTitle: "上一页",
            ngPagerLastTitle: "前往尾页"
        }, a.ngGrid.i18n["zh-tw"] = {
            ngAggregateLabel: "筆",
            ngGroupPanelDescription: "拖拉表頭到此處以進行分組",
            ngSearchPlaceHolder: "搜尋...",
            ngMenuText: "選擇欄位：",
            ngShowingItemsLabel: "目前顯示筆數：",
            ngTotalItemsLabel: "總筆數：",
            ngSelectedItemsLabel: "選取筆數：",
            ngPageSizeLabel: "每頁顯示：",
            ngPagerFirstTitle: "第一頁",
            ngPagerNextTitle: "下一頁",
            ngPagerPrevTitle: "上一頁",
            ngPagerLastTitle: "最後頁"
        }, angular.module("ngGrid").run(["$templateCache", function(a) {
            a.put("aggregateTemplate.html", '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" class="ngAggregate">\r\n    <span class="ngAggregateText">{{row.label CUSTOM_FILTERS}} ({{row.totalChildren()}} {{AggItemsLabel}})</span>\r\n    <div class="{{row.aggClass()}}"></div>\r\n</div>\r\n'), a.put("cellEditTemplate.html", '<div ng-cell-has-focus ng-dblclick="CELL_EDITABLE_CONDITION && editCell()">\r\n\t<div ng-edit-cell-if="!(isFocused && CELL_EDITABLE_CONDITION)">\t\r\n\t\tDISPLAY_CELL_TEMPLATE\r\n\t</div>\r\n\t<div ng-edit-cell-if="isFocused && CELL_EDITABLE_CONDITION">\r\n\t\tEDITABLE_CELL_TEMPLATE\r\n\t</div>\r\n</div>\r\n'), a.put("cellTemplate.html", '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{COL_FIELD CUSTOM_FILTERS}}</span></div>'), a.put("checkboxCellTemplate.html", '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>'), a.put("checkboxHeaderTemplate.html", '<input class="ngSelectionHeader" type="checkbox" ng-show="multiSelect" ng-model="allSelected" ng-change="toggleSelectAll(allSelected, true)"/>'), a.put("editableCellTemplate.html", '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" />'), a.put("footerTemplate.html", '<div ng-show="showFooter" class="ngFooterPanel" ng-class="{\'ui-widget-content\': jqueryUITheme, \'ui-corner-bottom\': jqueryUITheme}" ng-style="footerStyle()">\r\n    <div class="ngTotalSelectContainer" >\r\n        <div class="ngFooterTotalItems" ng-class="{\'ngNoMultiSelect\': !multiSelect}" >\r\n            <span class="ngLabel">{{i18n.ngTotalItemsLabel}} {{maxRows()}}</span><span ng-show="filterText.length > 0" class="ngLabel">({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span>\r\n        </div>\r\n        <div class="ngFooterSelectedItems" ng-show="multiSelect">\r\n            <span class="ngLabel">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span>\r\n        </div>\r\n    </div>\r\n    <div class="ngPagerContainer" style="float: right; margin-top: 10px;" ng-show="enablePaging" ng-class="{\'ngNoMultiSelect\': !multiSelect}">\r\n        <div style="float:left; margin-right: 10px;" class="ngRowCountPicker">\r\n            <span style="float: left; margin-top: 3px;" class="ngLabel">{{i18n.ngPageSizeLabel}}</span>\r\n            <select style="float: left;height: 27px; width: 100px" ng-model="pagingOptions.pageSize" >\r\n                <option ng-repeat="size in pagingOptions.pageSizes">{{size}}</option>\r\n            </select>\r\n        </div>\r\n        <div style="float:left; margin-right: 10px; line-height:25px;" class="ngPagerControl" style="float: left; min-width: 135px;">\r\n            <button type="button" class="ngPagerButton" ng-click="pageToFirst()" ng-disabled="cantPageBackward()" title="{{i18n.ngPagerFirstTitle}}"><div class="ngPagerFirstTriangle"><div class="ngPagerFirstBar"></div></div></button>\r\n            <button type="button" class="ngPagerButton" ng-click="pageBackward()" ng-disabled="cantPageBackward()" title="{{i18n.ngPagerPrevTitle}}"><div class="ngPagerFirstTriangle ngPagerPrevTriangle"></div></button>\r\n            <input class="ngPagerCurrent" min="1" max="{{currentMaxPages}}" type="number" style="width:50px; height: 24px; margin-top: 1px; padding: 0 4px;" ng-model="pagingOptions.currentPage"/>\r\n            <span class="ngGridMaxPagesNumber" ng-show="maxPages() > 0">/ {{maxPages()}}</span>\r\n            <button type="button" class="ngPagerButton" ng-click="pageForward()" ng-disabled="cantPageForward()" title="{{i18n.ngPagerNextTitle}}"><div class="ngPagerLastTriangle ngPagerNextTriangle"></div></button>\r\n            <button type="button" class="ngPagerButton" ng-click="pageToLast()" ng-disabled="cantPageToLast()" title="{{i18n.ngPagerLastTitle}}"><div class="ngPagerLastTriangle"><div class="ngPagerLastBar"></div></div></button>\r\n        </div>\r\n    </div>\r\n</div>\r\n'), a.put("gridTemplate.html", '<div class="ngTopPanel" ng-class="{\'ui-widget-header\':jqueryUITheme, \'ui-corner-top\': jqueryUITheme}" ng-style="topPanelStyle()">\r\n    <div class="ngGroupPanel" ng-show="showGroupPanel()" ng-style="groupPanelStyle()">\r\n        <div class="ngGroupPanelDescription" ng-show="configGroups.length == 0">{{i18n.ngGroupPanelDescription}}</div>\r\n        <ul ng-show="configGroups.length > 0" class="ngGroupList">\r\n            <li class="ngGroupItem" ng-repeat="group in configGroups">\r\n                <span class="ngGroupElement">\r\n                    <span class="ngGroupName">{{group.displayName}}\r\n                        <span ng-click="removeGroup($index)" class="ngRemoveGroup">x</span>\r\n                    </span>\r\n                    <span ng-hide="$last" class="ngGroupArrow"></span>\r\n                </span>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <div class="ngHeaderContainer" ng-style="headerStyle()">\r\n        <div ng-header-row class="ngHeaderScroller" ng-style="headerScrollerStyle()"></div>\r\n    </div>\r\n    <div ng-grid-menu></div>\r\n</div>\r\n<div class="ngViewport" unselectable="on" ng-viewport ng-class="{\'ui-widget-content\': jqueryUITheme}" ng-style="viewportStyle()">\r\n    <div class="ngCanvas" ng-style="canvasStyle()">\r\n        <div ng-style="rowStyle(row)" ng-repeat="row in renderedRows" ng-click="row.toggleSelected($event)" ng-class="row.alternatingRowClass()" ng-row></div>\r\n    </div>\r\n</div>\r\n<div ng-grid-footer></div>\r\n'), a.put("headerCellTemplate.html", '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{ \'ngSorted\': !col.noSortVisible() }">\r\n    <div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>\r\n    <div class="ngSortButtonDown" ng-click="col.sort($event)" ng-show="col.showSortButtonDown()"></div>\r\n    <div class="ngSortButtonUp" ng-click="col.sort($event)" ng-show="col.showSortButtonUp()"></div>\r\n    <div class="ngSortPriority">{{col.sortPriority}}</div>\r\n    <div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>\r\n</div>\r\n<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>\r\n'), a.put("headerRowTemplate.html", '<div ng-style="{ height: col.headerRowHeight }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngHeaderCell">\r\n\t<div class="ngVerticalBar" ng-style="{height: col.headerRowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div>\r\n\t<div ng-header-cell></div>\r\n</div>'), a.put("menuTemplate.html", '<div ng-show="showColumnMenu || showFilter"  class="ngHeaderButton" ng-click="toggleShowMenu()">\r\n    <div class="ngHeaderButtonArrow"></div>\r\n</div>\r\n<div ng-show="showMenu" class="ngColMenu">\r\n    <div ng-show="showFilter">\r\n        <input placeholder="{{i18n.ngSearchPlaceHolder}}" type="text" ng-model="filterOptions.filterText"/>\r\n    </div>\r\n    <div ng-show="showColumnMenu">\r\n        <span class="ngMenuText">{{i18n.ngMenuText}}</span>\r\n        <ul class="ngColList">\r\n            <li class="ngColListItem" ng-repeat="col in columns | ngColumns">\r\n                <label><input ng-disabled="col.pinned" type="checkbox" class="ngColListCheckbox" ng-model="col.visible"/>{{col.displayName}}</label>\r\n\t\t\t\t<a title="Group By" ng-class="col.groupedByClass()" ng-show="col.groupable && col.visible" ng-click="groupBy(col)"></a>\r\n\t\t\t\t<span class="ngGroupingNumber" ng-show="col.groupIndex > 0">{{col.groupIndex}}</span>          \r\n            </li>\r\n        </ul>\r\n    </div>\r\n</div>\r\n'), a.put("rowTemplate.html", '<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}">\r\n\t<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div>\r\n\t<div ng-cell></div>\r\n</div>')
        }])
    }(window, jQuery),
    function(a) {
        "use strict";
        a.module("angularAwesomeSlider", []).directive("slider", ["$compile", "$templateCache", "$timeout", "$window", "slider", function(b, c, d, e, f) {
            return {
                restrict: "AE",
                require: "?ngModel",
                scope: {
                    options: "=",
                    ngDisabled: "="
                },
                priority: 1,
                link: function(g, h, i, j) {
                    function k() {
                        a.element(e).bind("resize", function(a) {
                            g.slider.onresize()
                        })
                    }
                    if (j) {
                        if (!g.options) throw new Error('You must provide a value for "options" attribute.');
                        a.injector();
                        a.isString(g.options) && (g.options = a.toJson(g.options)), g.mainSliderClass = "jslider", g.mainSliderClass += g.options.skin ? " jslider_" + g.options.skin : " ", g.mainSliderClass += g.options.vertical ? " vertical " : "", g.mainSliderClass += g.options.css ? " sliderCSS" : "", g.mainSliderClass += g.options.className ? " " + g.options.className : "", g.options.limits = !a.isDefined(g.options.limits) || g.options.limits, h.after(b(c.get("ng-slider/slider-bar.tmpl.html"))(g, function(a, b) {
                            b.tmplElt = a
                        }));
                        var l = !1,
                            m = function(b) {
                                g.from = "" + g.options.from, g.to = "" + g.options.to, g.options.calculate && a.isFunction(g.options.calculate) && (g.from = g.options.calculate(g.from), g.to = g.options.calculate(g.to));
                                var c = {
                                    from: g.options.round ? parseFloat(g.options.from) : parseInt(g.options.from, 10),
                                    to: g.options.round ? parseFloat(g.options.to) : parseInt(g.options.to, 10),
                                    step: g.options.step,
                                    smooth: g.options.smooth,
                                    limits: g.options.limits,
                                    round: g.options.round || !1,
                                    value: b || j.$viewValue,
                                    dimension: "",
                                    scale: g.options.scale,
                                    modelLabels: g.options.modelLabels,
                                    vertical: g.options.vertical,
                                    css: g.options.css,
                                    className: g.options.className,
                                    realtime: g.options.realtime,
                                    cb: n,
                                    threshold: g.options.threshold,
                                    heterogeneity: g.options.heterogeneity
                                };
                                c.calculate = g.options.calculate || void 0, c.onstatechange = g.options.onstatechange || void 0, g.slider = g.slider ? g.slider.init(h, g.tmplElt, c) : p(h, g.tmplElt, c), l || k();
                                var d = g.tmplElt.find("div")[7];
                                a.element(d).html(g.slider.generateScale()), g.slider.drawScale(d), g.ngDisabled && o(g.ngDisabled), l = !0
                            };
                        j.$render = function() {
                            if ((j.$viewValue || 0 === j.$viewValue) && ("number" == typeof j.$viewValue && (j.$viewValue = "" + j.$viewValue), j.$viewValue.split(";")[1] ? g.mainSliderClass = g.mainSliderClass.replace(" jslider-single", "") : g.mainSliderClass += " jslider-single", g.slider)) {
                                var a = j.$viewValue.split(";");
                                g.slider.getPointers()[0].set(a[0], !0), a[1] && (g.slider.getPointers()[1].set(a[1], !0), parseInt(a[1]) > parseInt(a[0]) && g.slider.getPointers()[0].set(a[0], !0))
                            }
                        }, g.$on("slider-value-update", function(a, b) {
                            m(b.value), d(function() {
                                g.slider.redrawPointers()
                            })
                        });
                        var n = function(a, b) {
                            g.disabled || (g.$apply(function() {
                                j.$setViewValue(a)
                            }), g.options.callback && g.options.callback(a, b))
                        };
                        g.$watch("options", function(a) {
                            d(function() {
                                m()
                            })
                        }, g.watchOptions || !0);
                        var o = function(a) {
                            g.disabled = a, g.slider && (g.tmplElt.toggleClass("disabled"), g.slider.disable(a))
                        };
                        g.$watch("ngDisabled", function(a) {
                            o(a)
                        }), g.limitValue = function(b) {
                            return g.options.modelLabels ? a.isFunction(g.options.modelLabels) ? g.options.modelLabels(b) : void 0 !== g.options.modelLabels[b] ? g.options.modelLabels[b] : b : b
                        };
                        var p = function(a, b, c) {
                            return new f(a, b, c)
                        }
                    }
                }
            }
        }]).config(function() {}).run(function() {})
    }(angular),
    function(a) {
        "use strict";
        a.module("angularAwesomeSlider").constant("sliderConstants", {
            SLIDER: {
                settings: {
                    from: 1,
                    to: 40,
                    step: 1,
                    smooth: !0,
                    limits: !1,
                    round: !1,
                    value: "3",
                    dimension: "",
                    vertical: !1,
                    calculate: !1,
                    onstatechange: !1,
                    callback: !1,
                    realtime: !1
                },
                className: "jslider",
                selector: ".jslider-",
                css: {
                    visible: {
                        visibility: "visible"
                    },
                    hidden: {
                        visibility: "hidden"
                    }
                }
            },
            EVENTS: {}
        })
    }(angular),
    function(a) {
        "use strict";
        a.module("angularAwesomeSlider").factory("sliderUtils", ["$window", function(a) {
            return {
                offset: function(a) {
                    var b = a[0],
                        c = 0,
                        d = 0,
                        e = document.documentElement || document.body,
                        f = window.pageXOffset || e.scrollLeft,
                        g = window.pageYOffset || e.scrollTop;
                    return c = b.getBoundingClientRect().left + f, d = b.getBoundingClientRect().top + g, {
                        left: c,
                        top: d
                    }
                },
                browser: function() {
                    var b = a.navigator.userAgent,
                        c = {
                            mozilla: /mozilla/i,
                            chrome: /chrome/i,
                            safari: /safari/i,
                            firefox: /firefox/i,
                            ie: /internet explorer/i
                        };
                    for (var d in c)
                        if (c[d].test(b)) return d;
                    return "unknown"
                }
            }
        }])
    }(angular),
    function(a) {
        "use strict";
        a.module("angularAwesomeSlider").factory("sliderDraggable", ["sliderUtils", function(b) {
            function c() {
                this._init.apply(this, arguments)
            }
            return c.prototype.oninit = function() {}, c.prototype.events = function() {}, c.prototype.onmousedown = function() {
                this.ptr.css({
                    position: "absolute"
                })
            }, c.prototype.onmousemove = function(a, b, c) {
                this.ptr.css({
                    left: b,
                    top: c
                })
            }, c.prototype.onmouseup = function() {}, c.prototype.isDefault = {
                drag: !1,
                clicked: !1,
                toclick: !0,
                mouseup: !1
            }, c.prototype._init = function() {
                if (arguments.length > 0) {
                    if (this.ptr = arguments[0], this.label = arguments[3], this.parent = arguments[2], !this.ptr) return;
                    this.is = {}, a.extend(this.is, this.isDefault);
                    var c = b.offset(this.ptr);
                    this.d = {
                        left: c.left,
                        top: c.top,
                        width: this.ptr[0].clientWidth,
                        height: this.ptr[0].clientHeight
                    }, this.oninit.apply(this, arguments), this._events()
                }
            }, c.prototype._getPageCoords = function(a) {
                return a.targetTouches && a.targetTouches[0] ? {
                    x: a.targetTouches[0].pageX,
                    y: a.targetTouches[0].pageY
                } : {
                    x: a.pageX,
                    y: a.pageY
                }
            }, c.prototype._bindEvent = function(a, b, c) {
                this.supportTouches_ && a[0].addEventListener(this.events_[b].touch, c, !1), a.bind(this.events_[b].nonTouch, c)
            }, c.prototype._events = function() {
                var b = this;
                this.supportTouches_ = "ontouchend" in document, this.events_ = {
                    click: {
                        touch: "touchstart",
                        nonTouch: "click"
                    },
                    down: {
                        touch: "touchstart",
                        nonTouch: "mousedown"
                    },
                    move: {
                        touch: "touchmove",
                        nonTouch: "mousemove"
                    },
                    up: {
                        touch: "touchend",
                        nonTouch: "mouseup"
                    },
                    mousedown: {
                        touch: "mousedown",
                        nonTouch: "mousedown"
                    }
                };
                var c = a.element(window.document);
                this._bindEvent(c, "move", function(a) {
                    b.is.drag && (a.stopPropagation(), a.preventDefault(), b.parent.disabled || b._mousemove(a))
                }), this._bindEvent(c, "down", function(a) {
                    b.is.drag && (a.stopPropagation(), a.preventDefault())
                }), this._bindEvent(c, "up", function(a) {
                    b._mouseup(a)
                }), this._bindEvent(this.label, "down", function(a) {
                    return b._mousedown(a), !1
                }), this._bindEvent(this.label, "up", function(a) {
                    b._mouseup(a)
                }), this._bindEvent(this.ptr, "down", function(a) {
                    return b._mousedown(a), !1
                }), this._bindEvent(this.ptr, "up", function(a) {
                    b._mouseup(a)
                }), this.events()
            }, c.prototype._mousedown = function(b) {
                this.is.drag = !0, this.is.clicked = !1, this.is.mouseup = !1;
                var c = this._getPageCoords(b);
                this.cx = c.x - this.ptr[0].offsetLeft, this.cy = c.y - this.ptr[0].offsetTop, a.extend(this.d, {
                    left: c.x,
                    top: c.y,
                    width: this.ptr[0].clientWidth,
                    height: this.ptr[0].clientHeight
                }), this.outer && this.outer.get(0) && this.outer.css({
                    height: Math.max(this.outer.height(), $(document.body).height()),
                    overflow: "hidden"
                }), this.onmousedown(b)
            }, c.prototype._mousemove = function(a) {
                this.is.toclick = !1;
                var b = this._getPageCoords(a);
                this.onmousemove(a, b.x - this.cx, b.y - this.cy)
            }, c.prototype._mouseup = function(a) {
                if (this.is.drag) {
                    this.is.drag = !1;
                    var c = b.browser();
                    this.outer && this.outer.get(0) && ("mozilla" === c ? this.outer.css({
                        overflow: "hidden"
                    }) : this.outer.css({
                        overflow: "visible"
                    }), this.outer.css({
                        height: "auto"
                    })), this.onmouseup(a)
                }
            }, c
        }])
    }(angular),
    function(a) {
        "use strict";
        a.module("angularAwesomeSlider").factory("sliderPointer", ["sliderDraggable", "sliderUtils", function(b, c) {
            function d() {
                b.apply(this, arguments)
            }
            return d.prototype = new b, d.prototype.oninit = function(b, c, d, e, f) {
                this.uid = c, this.parent = f, this.value = {}, this.vertical = d, this.settings = a.copy(f.settings), this.threshold = this.settings.threshold
            }, d.prototype.onmousedown = function(a) {
                var b = c.offset(this.parent.domNode),
                    d = {
                        left: b.left,
                        top: b.top,
                        width: this.parent.domNode[0].clientWidth,
                        height: this.parent.domNode[0].clientHeight
                    };
                this._parent = {
                    offset: d,
                    width: d.width,
                    height: d.height
                }, this.ptr.addClass("jslider-pointer-hover")
            }, d.prototype.onmousemove = function(b, c, d) {
                var e = this._getPageCoords(b);
                this._set(this.vertical ? this.calc(e.y) : this.calc(e.x)), this.settings.realtime && this.settings.cb && a.isFunction(this.settings.cb) && this.settings.cb.call(this.parent, this.parent.getValue(), !this.is.drag)
            }, d.prototype.onmouseup = function(b) {
                this.settings.cb && a.isFunction(this.settings.cb) && this.settings.cb.call(this.parent, this.parent.getValue(), !this.is.drag), this.is.drag || this.ptr.removeClass("jslider-pointer-hover")
            }, d.prototype.limits = function(a) {
                return this.parent.limits(a, this)
            }, d.prototype.calc = function(a) {
                return this.vertical ? this.limits(100 * (a - this._parent.offset.top) / this._parent.height) : this.limits(100 * (a - this._parent.offset.left) / this._parent.width)
            }, d.prototype.set = function(a, b) {
                this.value.origin = this.parent.round(a), this._set(this.parent.valueToPrc(a, this), b)
            }, d.prototype._set = function(a, b) {
                this.allowed = !0;
                var c = this.value.origin,
                    d = this.value.prc;
                if (this.value.origin = this.parent.prcToValue(a), this.value.prc = a, this.threshold && this.parent.o.pointers[1]) {
                    var e = this.value.origin,
                        f = this.parent.o.pointers[0 === this.uid ? 1 : 0].value.origin;
                    this.allowed = Math.abs(f - e) >= this.threshold, this.allowed || void 0 === c || void 0 === d || (this.value.origin = c, this.value.prc = d)
                }
                this.vertical ? this.ptr.css({
                    top: this.value.prc + "%",
                    marginTop: -5
                }) : this.ptr.css({
                    left: this.value.prc + "%"
                }), this.parent.redraw(this)
            }, d
        }])
    }(angular),
    function(a) {
        "use strict";
        a.module("angularAwesomeSlider").factory("slider", ["sliderPointer", "sliderConstants", "sliderUtils", function(b, c, d) {
            function e() {
                return this.init.apply(this, arguments)
            }
            return e.prototype.init = function(b, d, e) {
                return this.settings = e, this.inputNode = b, this.inputNode.addClass("ng-hide"), this.settings.interval = this.settings.to - this.settings.from, this.settings.calculate && a.isFunction(this.settings.calculate) && (this.nice = this.settings.calculate), this.settings.onstatechange && a.isFunction(this.settings.onstatechange) && (this.onstatechange = this.settings.onstatechange), this.css = c.SLIDER.css, this.is = {
                    init: !1
                }, this.o = {}, this.initValue = {}, this.isAsc = e.from < e.to, this.create(d), this
            }, e.prototype.create = function(c) {
                var e = this;
                this.domNode = c;
                var f = this.domNode.find("div"),
                    g = this.domNode.find("i"),
                    h = a.element,
                    i = a.extend,
                    j = a.forEach,
                    k = h(f[1]),
                    l = h(f[2]),
                    m = h(f[5]),
                    n = h(f[6]),
                    o = h(g[0]),
                    p = h(g[1]),
                    q = h(g[2]),
                    r = h(g[3]),
                    s = h(g[4]),
                    t = h(g[5]),
                    u = h(g[6]),
                    v = [m, n],
                    w = [k, l],
                    x = d.offset(this.domNode),
                    y = {
                        left: x.left,
                        top: x.top,
                        width: this.domNode[0].clientWidth,
                        height: this.domNode[0].clientHeight
                    },
                    z = e.settings.value.split(";");
                this.sizes = {
                    domWidth: this.domNode[0].clientWidth,
                    domHeight: this.domNode[0].clientHeight,
                    domOffset: y
                }, i(this.o, {
                    pointers: {},
                    labels: {
                        0: {
                            o: m
                        },
                        1: {
                            o: n
                        }
                    },
                    limits: {
                        0: a.element(f[3]),
                        1: a.element(f[4])
                    },
                    indicators: {
                        0: r,
                        1: s,
                        2: t,
                        3: u
                    }
                }), i(this.o.labels[0], {
                    value: this.o.labels[0].o.find("span")
                }), i(this.o.labels[1], {
                    value: this.o.labels[1].o.find("span")
                }), this.settings.single = !e.settings.value.split(";")[1], this.settings.single ? q.addClass("ng-hide") : q.removeClass("ng-hide"), j(w, function(c, f) {
                    e.settings = a.copy(e.settings);
                    var g, h, i, j, k, l = z[f];
                    l && (e.o.pointers[f] = new b(c, f, e.settings.vertical, v[f], e), g = z[f - 1], h = g ? parseInt(g, 10) : void 0, l = e.settings.round ? parseFloat(l) : parseInt(l, 10), (g && e.isAsc ? l < h : l > h) && (l = g), i = e.isAsc ? l > e.settings.to : l < e.settings.to, j = i ? e.settings.to : l, e.o.pointers[f].set(j, !0), k = d.offset(e.o.pointers[f].ptr), e.o.pointers[f].d = {
                        left: k.left,
                        top: k.top
                    })
                }), e.domNode.bind("mousedown", e.clickHandler.apply(e)), this.o.value = h(this.domNode.find("i")[2]), this.is.init = !0, this.settings.css && (o.css(this.settings.css.background ? this.settings.css.background : {}), p.css(this.settings.css.background ? this.settings.css.background : {}), this.o.pointers[1] || (r.css(this.settings.css.before ? this.settings.css.before : {}), u.css(this.settings.css.after ? this.settings.css.after : {})), s.css(this.settings.css["default"] ? this.settings.css["default"] : {}), t.css(this.settings.css["default"] ? this.settings.css["default"] : {}), q.css(this.settings.css.range ? this.settings.css.range : {}), k.css(this.settings.css.pointer ? this.settings.css.pointer : {}), l.css(this.settings.css.pointer ? this.settings.css.pointer : {})), this.redrawPointers()
            }, e.prototype.clickHandler = function() {
                var b = this,
                    c = function(a) {
                        var c = b.o.pointers[0].ptr,
                            e = b.o.pointers[1].ptr,
                            f = d.offset(c),
                            g = d.offset(e);
                        b.o.pointers[0].d = {
                            left: f.left,
                            top: f.top,
                            width: c[0].clientWidth,
                            height: c[0].clientHeight
                        }, b.o.pointers[1].d = {
                            left: g.left,
                            top: g.top,
                            width: e[0].clientWidth,
                            height: e[0].clientHeight
                        }
                    };
                return function(e) {
                    if (!b.disabled) {
                        var f = b.settings.vertical,
                            g = 0,
                            h = d.offset(b.domNode),
                            i = b.o.pointers[0],
                            j = b.o.pointers[1] ? b.o.pointers[1] : null,
                            k = e.originalEvent ? e.originalEvent : e,
                            l = f ? k.pageY : k.pageX,
                            m = f ? "top" : "left",
                            n = {
                                left: h.left,
                                top: h.top,
                                width: b.domNode[0].clientWidth,
                                height: b.domNode[0].clientHeight
                            },
                            o = b.o.pointers[g];
                        if (j) {
                            j.d.width || c();
                            var p = d.offset(i.ptr)[m],
                                q = d.offset(j.ptr)[m],
                                r = Math.abs((q - p) / 2),
                                s = l >= q || l >= q - r;
                            s && (o = j)
                        }
                        o._parent = {
                            offset: n,
                            width: n.width,
                            height: n.height
                        };
                        var t = i._getPageCoords(e);
                        return o.cx = t.x - o.d.left, o.cy = t.y - o.d.top, o.onmousemove(e, t.x, t.y), o.onmouseup(), a.extend(o.d, {
                            left: t.x,
                            top: t.y
                        }), b.redraw(o), !1
                    }
                }
            }, e.prototype.disable = function(a) {
                this.disabled = a
            }, e.prototype.nice = function(a) {
                return a
            }, e.prototype.onstatechange = function() {}, e.prototype.limits = function(a, b) {
                if (!this.settings.smooth) {
                    var c = 100 * this.settings.step / this.settings.interval;
                    a = Math.round(a / c) * c
                }
                if (b) {
                    var d = this.o.pointers[1 - b.uid];
                    d && b.uid && a < d.value.prc && (a = d.value.prc), d && !b.uid && a > d.value.prc && (a = d.value.prc)
                }
                return a < 0 && (a = 0), a > 100 && (a = 100), Math.round(10 * a) / 10
            }, e.prototype.getPointers = function() {
                return this.o.pointers
            }, e.prototype.generateScale = function() {
                if (this.settings.scale && this.settings.scale.length > 0) {
                    for (var b, c, d = "", e = this.settings.scale, f = {}, g = this.settings.vertical ? "top" : "left", h = 0; h < e.length; h++) a.isDefined(e[h].val) || (b = (100 / (e.length - 1)).toFixed(2), d += '<span style="' + g + ": " + h * b + '%">' + ("|" != e[h] ? "<ins>" + e[h] + "</ins>" : "") + "</span>"), e[h].val <= this.settings.to && e[h].val >= this.settings.from && !f[e[h].val] && (f[e[h].val] = !0, b = this.valueToPrc(e[h].val), c = e[h].label ? e[h].label : e[h].val, d += '<span style="' + g + ": " + b + '%"><ins>' + c + "</ins></span>");
                    return d
                }
                return ""
            }, e.prototype.onresize = function() {
                this.sizes = {
                    domWidth: this.domNode[0].clientWidth,
                    domHeight: this.domNode[0].clientHeight,
                    domOffset: {
                        left: this.domNode[0].offsetLeft,
                        top: this.domNode[0].offsetTop,
                        width: this.domNode[0].clientWidth,
                        height: this.domNode[0].clientHeight
                    }
                }, this.redrawPointers()
            }, e.prototype.update = function() {
                this.onresize(), this.drawScale()
            }, e.prototype.drawScale = function(b) {
                a.forEach(a.element(b).find("ins"), function(a, b) {
                    a.style.marginLeft = -a.clientWidth / 2
                })
            }, e.prototype.redrawPointers = function() {
                a.forEach(this.o.pointers, function(a) {
                    this.redraw(a)
                }, this)
            }, e.prototype.redraw = function(b) {
                if (!this.is.init) return this.o.pointers[0] && !this.o.pointers[1] ? (this.originValue = this.o.pointers[0].value.prc, this.o.indicators[0].css(this.settings.vertical ? {
                    top: 0,
                    height: this.o.pointers[0].value.prc + "%"
                } : {
                    left: 0,
                    width: this.o.pointers[0].value.prc + "%"
                }), this.o.indicators[1].css(this.settings.vertical ? {
                    top: this.o.pointers[0].value.prc + "%"
                } : {
                    left: this.o.pointers[0].value.prc + "%"
                }), this.o.indicators[3].css(this.settings.vertical ? {
                    top: this.o.pointers[0].value.prc + "%"
                } : {
                    left: this.o.pointers[0].value.prc + "%"
                })) : (this.o.indicators[2].css(this.settings.vertical ? {
                    top: this.o.pointers[1].value.prc + "%"
                } : {
                    left: this.o.pointers[1].value.prc + "%"
                }), this.o.indicators[0].css(this.settings.vertical ? {
                    top: 0,
                    height: "0"
                } : {
                    left: 0,
                    width: "0"
                }), this.o.indicators[3].css(this.settings.vertical ? {
                    top: "0",
                    height: "0"
                } : {
                    left: "0",
                    width: "0"
                })), !1;
                this.setValue();
                var c, d;
                this.o.pointers[0] && this.o.pointers[1] && (c = this.settings.vertical ? {
                    top: this.o.pointers[0].value.prc + "%",
                    height: this.o.pointers[1].value.prc - this.o.pointers[0].value.prc + "%"
                } : {
                    left: this.o.pointers[0].value.prc + "%",
                    width: this.o.pointers[1].value.prc - this.o.pointers[0].value.prc + "%"
                }, this.o.value.css(c), this.o.pointers[0].value.prc === this.o.pointers[1].value.prc && this.o.pointers[1].ptr.css("z-index", 0 === this.o.pointers[0].value.prc ? "3" : "1")), this.o.pointers[0] && !this.o.pointers[1] && (d = this.o.pointers[0].value.prc - this.originValue, d >= 0 ? this.o.indicators[3].css(this.settings.vertical ? {
                    height: d + "%"
                } : {
                    width: d + "%"
                }) : this.o.indicators[3].css(this.settings.vertical ? {
                    height: 0
                } : {
                    width: 0
                }), this.o.pointers[0].value.prc < this.originValue ? this.o.indicators[0].css(this.settings.vertical ? {
                    height: this.o.pointers[0].value.prc + "%"
                } : {
                    width: this.o.pointers[0].value.prc + "%"
                }) : this.o.indicators[0].css(this.settings.vertical ? {
                    height: this.originValue + "%"
                } : {
                    width: this.originValue + "%"
                }));
                var e = this.nice(b.value.origin);
                this.settings.modelLabels && (e = a.isFunction(this.settings.modelLabels) ? this.settings.modelLabels(e) : void 0 !== this.settings.modelLabels[e] ? this.settings.modelLabels[e] : e), this.o.labels[b.uid].value.html(e), this.redrawLabels(b)
            }, e.prototype.redrawLabels = function(a) {
                function b(a, b, d) {
                    b.margin = -b.label / 2;
                    var e = c.settings.vertical ? c.sizes.domHeight : c.sizes.domWidth;
                    if (c.sizes.domWidth) {
                        var f = b.border + b.margin;
                        f < 0 && (b.margin -= f), c.sizes.domWidth > 0 && b.border + b.label / 2 > e ? (b.margin = 0, b.right = !0) : b.right = !1
                    }
                    return c.settings.vertical ? a.o.css({
                        top: d + "%",
                        marginLeft: "20px",
                        marginTop: b.margin,
                        bottom: "auto"
                    }) : a.o.css({
                        left: d + "%",
                        marginLeft: b.margin + "px",
                        right: "auto"
                    }), b.right && c.sizes.domWidth > 0 && (c.settings.vertical ? a.o.css({
                        top: "auto",
                        bottom: 0
                    }) : a.o.css({
                        left: "auto",
                        right: 0
                    })), b
                }
                var c = this,
                    d = this.o.labels[a.uid],
                    e = a.value.prc,
                    f = 0 === d.o[0].offsetWidth ? 7 * d.o[0].textContent.length : d.o[0].offsetWidth;
                this.sizes.domWidth = this.domNode[0].clientWidth, this.sizes.domHeight = this.domNode[0].clientHeight;
                var g, h, i = {
                        label: c.settings.vertical ? d.o[0].offsetHeight : f,
                        right: !1,
                        border: e * (c.settings.vertical ? this.sizes.domHeight : this.sizes.domWidth) / 100
                    },
                    j = 0 === a.uid ? 1 : 0;
                if (!this.settings.single && !this.settings.vertical) {
                    g = this.o.labels[j], h = this.o.pointers[j];
                    var k = this.o.labels[0],
                        l = this.o.labels[1],
                        m = this.o.pointers[0],
                        n = this.o.pointers[1],
                        o = n.ptr[0].offsetLeft - m.ptr[0].offsetLeft,
                        p = this.nice(h.value.origin);
                    if (k.o.css(this.css.visible), l.o.css(this.css.visible), p = this.getLabelValue(p), o + 10 < k.o[0].offsetWidth + l.o[0].offsetWidth) {
                        if (g.o.css(this.css.hidden), g.value.html(p), e = (h.value.prc - e) / 2 + e, h.value.prc != a.value.prc) {
                            p = this.nice(this.o.pointers[0].value.origin);
                            var q = this.nice(this.o.pointers[1].value.origin);
                            p = this.getLabelValue(p), q = this.getLabelValue(q), d.value.html(p + "&nbsp;&ndash;&nbsp;" + q), i.label = d.o[0].offsetWidth, i.border = e * r / 100
                        }
                    } else g.value.html(p), g.o.css(this.css.visible)
                }
                i = b(d, i, e);
                var r = c.settings.vertical ? c.sizes.domHeight : c.sizes.domWidth;
                if (g) {
                    var s = 0 === d.o[0].offsetWidth ? d.o[0].textContent.length / 2 * 7 : d.o[0].offsetWidth,
                        t = {
                            label: c.settings.vertical ? g.o[0].offsetHeight : s,
                            right: !1,
                            border: h.value.prc * this.sizes.domWidth / 100
                        };
                    i = b(g, t, h.value.prc)
                }
                this.redrawLimits()
            }, e.prototype.redrawLimits = function() {
                if (this.settings.limits) {
                    var b = [!0, !0],
                        c = 0;
                    for (var d in this.o.pointers)
                        if (!this.settings.single || 0 === d) {
                            var e = this.o.pointers[d],
                                f = this.o.labels[e.uid],
                                g = f.o[0].offsetLeft - this.sizes.domOffset.left,
                                h = this.o.limits[0];
                            g < h[0].clientWidth && (b[0] = !1), h = this.o.limits[1], g + f.o[0].clientWidth > this.sizes.domWidth - h[0].clientWidth && (b[1] = !1)
                        } for (; c < b.length; c++) b[c] ? a.element(this.o.limits[c]).addClass("animate-show") : a.element(this.o.limits[c]).addClass("animate-hidde")
                }
            }, e.prototype.setValue = function() {
                var a = this.getValue();
                this.inputNode.attr("value", a), this.onstatechange.call(this, a, this.inputNode)
            }, e.prototype.getValue = function() {
                if (!this.is.init) return !1;
                var b = this,
                    c = "";
                return a.forEach(this.o.pointers, function(a, d) {
                    void 0 === a.value.prc || isNaN(a.value.prc) || (c += (d > 0 ? ";" : "") + b.prcToValue(a.value.prc))
                }), c
            }, e.prototype.getLabelValue = function(b) {
                return this.settings.modelLabels ? a.isFunction(this.settings.modelLabels) ? this.settings.modelLabels(b) : void 0 !== this.settings.modelLabels[b] ? this.settings.modelLabels[b] : b : b
            }, e.prototype.getPrcValue = function() {
                if (!this.is.init) return !1;
                var a = "";
                return a
            }, e.prototype.prcToValue = function(a) {
                var b;
                if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0)
                    for (var c = this.settings.heterogeneity, d = 0, e = this.settings.round ? parseFloat(this.settings.from) : parseInt(this.settings.from, 10), f = this.settings.round ? parseFloat(this.settings.to) : parseInt(this.settings.to, 10), g = 0; g <= c.length; g++) {
                        var h;
                        h = c[g] ? c[g].split("/") : [100, f];
                        var i = this.settings.round ? parseFloat(h[0]) : parseInt(h[0], 10),
                            j = this.settings.round ? parseFloat(h[1]) : parseInt(h[1], 10);
                        a >= d && a <= i && (b = e + (a - d) * (j - e) / (i - d)), d = i, e = j
                    } else b = this.settings.from + a * this.settings.interval / 100;
                return this.round(b)
            }, e.prototype.valueToPrc = function(a, b) {
                var c, d = this.settings.round ? parseFloat(this.settings.from) : parseInt(this.settings.from, 10);
                if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0)
                    for (var e = this.settings.heterogeneity, f = 0, g = 0; g <= e.length; g++) {
                        var h;
                        h = e[g] ? e[g].split("/") : [100, this.settings.to];
                        var i = this.settings.round ? parseFloat(h[0]) : parseInt(h[0], 10),
                            j = this.settings.round ? parseFloat(h[1]) : parseInt(h[1], 10);
                        a >= d && a <= j && (c = b ? b.limits(f + (a - d) * (i - f) / (j - d)) : this.limits(f + (a - d) * (i - f) / (j - d))), f = i, d = j
                    } else c = b ? b.limits(100 * (a - d) / this.settings.interval) : this.limits(100 * (a - d) / this.settings.interval);
                return c
            }, e.prototype.round = function(a) {
                return a = Math.round(a / this.settings.step) * this.settings.step, a = this.settings.round ? Math.round(a * Math.pow(10, this.settings.round)) / Math.pow(10, this.settings.round) : Math.round(a)
            }, e
        }])
    }(angular),
    function(a, b) {
        "use strict";
        a.module("angularAwesomeSlider").run(["$templateCache", function(a) {
            a.put("ng-slider/slider-bar.tmpl.html", '<span ng-class="mainSliderClass" id="{{sliderTmplId}}"><table><tr><td><div class="jslider-bg"><i class="left"></i><i class="right"></i><i class="range"></i><i class="before"></i><i class="default"></i><i class="default"></i><i class="after"></i></div><div class="jslider-pointer"></div><div class="jslider-pointer jslider-pointer-to"></div><div class="jslider-label" ng-show="options.limits"><span ng-bind="limitValue(options.from)"></span>{{options.dimension}}</div><div class="jslider-label jslider-label-to" ng-show="options.limits"><span ng-bind="limitValue(options.to)"></span>{{options.dimension}}</div><div class="jslider-value"><span></span>{{options.dimension}}</div><div class="jslider-value jslider-value-to"><span></span>{{options.dimension}}</div><div class="jslider-scale" id="{{sliderScaleDivTmplId}}"></div></td></tr></table></span>')
        }])
    }(window.angular), ! function(a, b) {
        if ("object" == typeof exports && "object" == typeof module) module.exports = b(require("angular"));
        else if ("function" == typeof define && define.amd) define(["angular"], b);
        else {
            var c = b("object" == typeof exports ? require("angular") : a.angular);
            for (var d in c)("object" == typeof exports ? exports : a)[d] = c[d]
        }
    }(this, function(a) {
        return function(a) {
            function b(d) {
                if (c[d]) return c[d].exports;
                var e = c[d] = {
                    exports: {},
                    id: d,
                    loaded: !1
                };
                return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports
            }
            var c = {};
            return b.m = a, b.c = c, b.p = "", b(0)
        }([function(a, b, c) {
            "use strict";

            function d(a) {
                if (a && a.__esModule) return a;
                var b = {};
                if (null != a)
                    for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (b[c] = a[c]);
                return b["default"] = a, b
            }
            Object.defineProperty(b, "__esModule", {
                value: !0
            }), b.ngNumberPicker = void 0;
            var e = c(1),
                f = d(e),
                g = function(a) {
                    return null === a || void 0 === a
                },
                h = function() {
                    "function" != typeof Object.assign && (Object.assign = function(a) {
                        if (g(a)) throw new TypeError("Cannot convert undefined or null to object");
                        for (var b = Object(a), c = 1; c < arguments.length; c++) {
                            var d = arguments[c];
                            if (!g(d))
                                for (var e in d) d.hasOwnProperty(e) && (b[e] = d[e])
                        }
                        return b
                    })
                };
            b.ngNumberPicker = function() {
                h();
                var a = "ngNumberPicker",
                    b = {
                        min: 0,
                        max: 100,
                        step: 1,
                        timeout: 600
                    },
                    c = function(a) {
                        return Number(a)
                    },
                    d = function(a) {
                        if (!f.isNumber(a)) throw new Error("value [" + a + "] is not a valid number")
                    },
                    e = function(a) {
                        return a.touches && a.touches.length > 0 ? f.element(a.touches[0].target) : f.element(a.target)
                    },
                    g = function(a) {
                        return e(a).attr("type")
                    },
                    i = function(a) {
                        for (var b in a) {
                            var d = a[b];
                            a[b] = c(d)
                        }
                    },
                    j = function(a, c) {
                        return {
                            restrict: "E",
                            transclude: !0,
                            scope: {
                                value: "=",
                                singular: "@",
                                plural: "@",
                                unitPosition: "@",
                                min: "@",
                                max: "@",
                                step: "@",
                                change: "&"
                            },
                            link: function(f, h) {
                                var j = Object.assign({}, b, {
                                    min: f.min,
                                    max: f.max,
                                    step: f.step
                                });
                                i(j), d(j.min), d(j.max), d(j.step), j.min > f.value && (f.value = j.min), f.$watch("value", function(a, b) {
                                    f.canDown = a > j.min, f.canUp = a < j.max, f.unit = 1 === a ? f.singular : f.plural, a !== b && f.change()
                                });
                                var k, l, m, n, o, p = function(a) {
                                        var b = g(a);
                                        if (f.value = Number(f.value), "up" === b) {
                                            if (f.value >= j.max) return;
                                            f.value += j.step, f.value > j.max && (f.value = j.max)
                                        } else if ("down" === b) {
                                            if (f.value <= j.min) return;
                                            f.value -= j.step, f.value < j.min && (f.value = j.min)
                                        }
                                    },
                                    q = h.find("span");
                                q.on("click", function(a) {
                                    p(a), f.$apply(), a.stopPropagation()
                                }), q.on("touchstart", function(b) {
                                    k || (k = !0, e(b).addClass("active"), n = (new Date).getTime(), l = a(function() {
                                        m = c(function() {
                                            p(b)
                                        }, 200)
                                    }, j.timeout), b.preventDefault())
                                }), q.on("touchend", function(b) {
                                    o = (new Date).getTime(), m && (c.cancel(m), m = void 0), l && (a.cancel(l), l = void 0), o - n < j.timeout && (p(b), f.$apply()), e(b).removeClass("active"), b.stopPropagation(), k = !1
                                }), f.$on("$destroy", function() {
                                    q.off("touchstart touchend click")
                                })
                            },
                            template: '<div class="input-group"><span class="input-group-addon" type="down" ng-disabled="!canDown">-</span><label class="form-control"><span class="picker-unit-left" ng-if="unitPosition === \'left\' && unit">{{ unit }}</span><ng-transclude>{{ value }}</ng-transclude><span class="picker-unit-right" ng-if="unitPosition !== \'left\' && unit">{{ unit }}</span></label><span class="input-group-addon" type="up" ng-disabled="!canUp">+</span></div>'
                        }
                    };
                return f.module(a, []).directive("hNumber", ["$timeout", "$interval", j]), a
            }()
        }, function(b, c) {
            b.exports = a
        }])
    }),
    function(a, b) {
        if ("object" == typeof exports && "object" == typeof module) module.exports = b();
        else if ("function" == typeof define && define.amd) define([], b);
        else {
            var c = b();
            for (var d in c)("object" == typeof exports ? exports : a)[d] = c[d]
        }
    }(this, function() {
        return function(a) {
            function b(d) {
                if (c[d]) return c[d].exports;
                var e = c[d] = {
                    exports: {},
                    id: d,
                    loaded: !1
                };
                return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports
            }
            var c = {};
            return b.m = a, b.c = c, b.p = "", b(0)
        }([function(a, b, c) {
            "use strict";
            a.exports = "ngFileSaver", angular.module("ngFileSaver", []).factory("FileSaver", ["Blob", "SaveAs", "FileSaverUtils", c(1)]).factory("FileSaverUtils", [c(2)]).factory("Blob", ["$window", c(3)]).factory("SaveAs", [c(5)])
        }, function(a, b) {
            "use strict";
            a.exports = function(a, b, c) {
                function d(a, d, e) {
                    try {
                        b(a, d, e)
                    } catch (f) {
                        c.handleErrors(f.message)
                    }
                }
                return {
                    saveAs: function(a, b, e) {
                        return c.isBlobInstance(a) || c.handleErrors("Data argument should be a blob instance"), c.isString(b) || c.handleErrors("Filename argument should be a string"), d(a, b, e)
                    }
                }
            }
        }, function(a, b) {
            "use strict";
            a.exports = function() {
                return {
                    handleErrors: function(a) {
                        throw new Error(a)
                    },
                    isString: function(a) {
                        return "string" == typeof a || a instanceof String
                    },
                    isUndefined: function(a) {
                        return "undefined" == typeof a
                    },
                    isBlobInstance: function(a) {
                        return a instanceof Blob
                    }
                }
            }
        }, function(a, b, c) {
            "use strict";
            c(4), a.exports = function(a) {
                return a.Blob
            }
        }, function(a, b) {
            ! function(a) {
                "use strict";
                if (a.URL = a.URL || a.webkitURL, a.Blob && a.URL) try {
                    return void new Blob
                } catch (b) {}
                var c = a.BlobBuilder || a.WebKitBlobBuilder || a.MozBlobBuilder || function(a) {
                    var b = function(a) {
                            return Object.prototype.toString.call(a).match(/^\[object\s(.*)\]$/)[1]
                        },
                        c = function() {
                            this.data = []
                        },
                        d = function(a, b, c) {
                            this.data = a, this.size = a.length, this.type = b, this.encoding = c
                        },
                        e = c.prototype,
                        f = d.prototype,
                        g = a.FileReaderSync,
                        h = function(a) {
                            this.code = this[this.name = a]
                        },
                        i = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),
                        j = i.length,
                        k = a.URL || a.webkitURL || a,
                        l = k.createObjectURL,
                        m = k.revokeObjectURL,
                        n = k,
                        o = a.btoa,
                        p = a.atob,
                        q = a.ArrayBuffer,
                        r = a.Uint8Array,
                        s = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
                    for (d.fake = f.fake = !0; j--;) h.prototype[i[j]] = j + 1;
                    return k.createObjectURL || (n = a.URL = function(a) {
                        var b, c = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                        return c.href = a, "origin" in c || ("data:" === c.protocol.toLowerCase() ? c.origin = null : (b = a.match(s), c.origin = b && b[1])), c
                    }), n.createObjectURL = function(a) {
                        var b, c = a.type;
                        return null === c && (c = "application/octet-stream"), a instanceof d ? (b = "data:" + c, "base64" === a.encoding ? b + ";base64," + a.data : "URI" === a.encoding ? b + "," + decodeURIComponent(a.data) : o ? b + ";base64," + o(a.data) : b + "," + encodeURIComponent(a.data)) : l ? l.call(k, a) : void 0
                    }, n.revokeObjectURL = function(a) {
                        "data:" !== a.substring(0, 5) && m && m.call(k, a)
                    }, e.append = function(a) {
                        var c = this.data;
                        if (r && (a instanceof q || a instanceof r)) {
                            for (var e = "", f = new r(a), i = 0, j = f.length; i < j; i++) e += String.fromCharCode(f[i]);
                            c.push(e)
                        } else if ("Blob" === b(a) || "File" === b(a)) {
                            if (!g) throw new h("NOT_READABLE_ERR");
                            var k = new g;
                            c.push(k.readAsBinaryString(a))
                        } else a instanceof d ? "base64" === a.encoding && p ? c.push(p(a.data)) : "URI" === a.encoding ? c.push(decodeURIComponent(a.data)) : "raw" === a.encoding && c.push(a.data) : ("string" != typeof a && (a += ""), c.push(unescape(encodeURIComponent(a))))
                    }, e.getBlob = function(a) {
                        return arguments.length || (a = null), new d(this.data.join(""), a, "raw")
                    }, e.toString = function() {
                        return "[object BlobBuilder]"
                    }, f.slice = function(a, b, c) {
                        var e = arguments.length;
                        return e < 3 && (c = null), new d(this.data.slice(a, e > 1 ? b : this.data.length), c, this.encoding)
                    }, f.toString = function() {
                        return "[object Blob]"
                    }, f.close = function() {
                        this.size = 0, delete this.data
                    }, c
                }(a);
                a.Blob = function(a, b) {
                    var d = b ? b.type || "" : "",
                        e = new c;
                    if (a)
                        for (var f = 0, g = a.length; f < g; f++) Uint8Array && a[f] instanceof Uint8Array ? e.append(a[f].buffer) : e.append(a[f]);
                    var h = e.getBlob(d);
                    return !h.slice && h.webkitSlice && (h.slice = h.webkitSlice), h
                };
                var d = Object.getPrototypeOf || function(a) {
                    return a.__proto__
                };
                a.Blob.prototype = d(new a.Blob)
            }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this)
        }, function(a, b, c) {
            "use strict";
            a.exports = function() {
                return c(6).saveAs || function() {}
            }
        }, function(a, b, c) {
            var d, e = e || function(a) {
                "use strict";
                if (!("undefined" == typeof a || "undefined" != typeof navigator && /MSIE [1-9]\./.test(navigator.userAgent))) {
                    var b = a.document,
                        c = function() {
                            return a.URL || a.webkitURL || a
                        },
                        d = b.createElementNS("http://www.w3.org/1999/xhtml", "a"),
                        e = "download" in d,
                        f = function(a) {
                            var b = new MouseEvent("click");
                            a.dispatchEvent(b)
                        },
                        g = /constructor/i.test(a.HTMLElement) || a.safari,
                        h = /CriOS\/[\d]+/.test(navigator.userAgent),
                        i = function(b) {
                            (a.setImmediate || a.setTimeout)(function() {
                                throw b
                            }, 0)
                        },
                        j = "application/octet-stream",
                        k = 4e4,
                        l = function(a) {
                            var b = function() {
                                "string" == typeof a ? c().revokeObjectURL(a) : a.remove()
                            };
                            setTimeout(b, k)
                        },
                        m = function(a, b, c) {
                            b = [].concat(b);
                            for (var d = b.length; d--;) {
                                var e = a["on" + b[d]];
                                if ("function" == typeof e) try {
                                    e.call(a, c || a)
                                } catch (f) {
                                    i(f)
                                }
                            }
                        },
                        n = function(a) {
                            return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob([String.fromCharCode(65279), a], {
                                type: a.type
                            }) : a
                        },
                        o = function(b, i, k) {
                            k || (b = n(b));
                            var o, p = this,
                                q = b.type,
                                r = q === j,
                                s = function() {
                                    m(p, "writestart progress write writeend".split(" "))
                                },
                                t = function() {
                                    if ((h || r && g) && a.FileReader) {
                                        var d = new FileReader;
                                        return d.onloadend = function() {
                                            var b = h ? d.result : d.result.replace(/^data:[^;]*;/, "data:attachment/file;"),
                                                c = a.open(b, "_blank");
                                            c || (a.location.href = b), b = void 0, p.readyState = p.DONE, s()
                                        }, d.readAsDataURL(b), void(p.readyState = p.INIT)
                                    }
                                    if (o || (o = c().createObjectURL(b)), r) a.location.href = o;
                                    else {
                                        var e = a.open(o, "_blank");
                                        e || (a.location.href = o)
                                    }
                                    p.readyState = p.DONE, s(), l(o)
                                };
                            return p.readyState = p.INIT, e ? (o = c().createObjectURL(b), void setTimeout(function() {
                                d.href = o, d.download = i, f(d), s(), l(o), p.readyState = p.DONE
                            })) : void t()
                        },
                        p = o.prototype,
                        q = function(a, b, c) {
                            return new o(a, b || a.name || "download", c)
                        };
                    return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function(a, b, c) {
                        return b = b || a.name || "download", c || (a = n(a)), navigator.msSaveOrOpenBlob(a, b)
                    } : (p.abort = function() {}, p.readyState = p.INIT = 0, p.WRITING = 1, p.DONE = 2, p.error = p.onwritestart = p.onprogress = p.onwrite = p.onabort = p.onerror = p.onwriteend = null, q)
                }
            }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
            "undefined" != typeof a && a.exports ? a.exports.saveAs = e : null !== c(7) && null !== c(8) && (d = function() {
                return e
            }.call(b, c, b, a), !(void 0 !== d && (a.exports = d)))
        }, function(a, b) {
            a.exports = function() {
                throw new Error("define cannot be used indirect")
            }
        }, function(a, b) {
            (function(b) {
                a.exports = b
            }).call(b, {})
        }])
    }), angular.module("naturalSort", []).factory("naturalService", ["$locale", function(a) {
        "use strict";
        var b = function(a) {
                return "00000000000000000000".slice(a.length)
            },
            c = function(a) {
                return null === a || void 0 === a ? "" : "" + a
            },
            d = "M" === a.DATETIME_FORMATS.shortDate.charAt(0),
            e = function(a) {
                return c(a).replace(/(\d\d?)[-\/\.](\d\d?)[-\/\.](\d{4})/, function(a, b, c, e) {
                    var f = c;
                    return d ? Number(b) > 12 && (c = b, b = f) : Number(c) < 13 && (c = b, b = f), e + "-" + b + "-" + c
                })
            },
            f = function(a) {
                return a.replace(/(\d+)((\.\d+)+)?/g, function(a, c, d, e) {
                    return d !== e ? a.replace(/(\d+)/g, function(a) {
                        return b(a) + a
                    }) : (d = d || ".0", b(c) + c + d + b(d))
                })
            },
            g = function(a) {
                return f(e(a))
            };
        return {
            naturalValue: g,
            naturalSort: function(a, b) {
                return a = g(a), b = g(b), b > a ? -1 : a > b ? 1 : 0
            }
        }
    }]).run(["$rootScope", "naturalService", function(a, b) {
        "use strict";
        a.natural = function(a) {
            return function(c) {
                return b.naturalValue(c[a])
            }
        }
    }]);