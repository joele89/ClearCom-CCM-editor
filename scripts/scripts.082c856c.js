"use strict";

/**/
function keysetAssign(a, b, c, d, e, f, g) {
    function h(h, i, j) {
        function k() {
            o(), l(), n(), h.indexSelectedKey = 0
        }

        function l() {
            e.ports.then(function(a) {
                h.ports = a.reduce(function(a, b) {
                    return a[b.res] = b, a
                }, {})
            })
        }

        function m(a) {
            var b = h.getKeysetWithIndex(h.indexSelectedKey),
                c = b.keys.find(function(c) {
                    return c.type === b.keys[a].type && c.keyIndex !== a
                });
            c && (c.type = "None")
        }

        function n() {
            f.connections.then(function(a) {
                h.connections = f.filterConnections(a, "partyline"), h.groups = f.filterConnections(a, "group")
            })
        }

        function o() {
            g.roles.then(function(a) {
                h.roles = {}, h.roles = s(a, "type", "label")
            })
        }
        var p = "[Multiple Values]",
            q = "/api/1/special/call";
        h.indexSelectedKey = 0, h.ports = {}, h.connections = {}, h.groups = {}, h.showKeyset = !0, h.maxNumberOfKeysets = 24, h.keysetTalkBtnMode = [{
            value: "latching",
            text: c("Latching")
        }, {
            value: "non-latching",
            text: c("Non-Latching")
        }, {
            value: "disabled",
            text: c("Disabled")
        }], h.keyActivationState = [{
            value: "talk",
            text: c("Talk-Only")
        }, {
            value: "listen",
            text: c("Listen-Only")
        }, {
            value: "talklisten",
            text: c("Talk & Listen")
        }, {
            value: "dualtalklisten",
            text: c("Dual Talk & Listen")
        }, {
            value: "forcelisten",
            text: c("Force Listen")
        }, {
            value: "talkforcelisten",
            text: c("Talk & Force Listen")
        }, {
            value: "forcetalkforcelisten",
            text: c("Force Talk & Force Listen")
        }], h.keysetUsbFlasherMode = [{
            value: "disabled",
            text: c("Disabled")
        }, {
            value: "blinking",
            text: c("Blinking on call")
        }, {
            value: "solid",
            text: c("Solid on call")
        }], h.wbsKeyIndexToText = ["A", "B", "C", "D", "REPLY"], h.getDisplayTextFromValue = function(b, d) {
            var e = a("filter")(d, {
                value: b
            }, !0);
            return b == p ? b : "undefined" != typeof e && null !== e ? angular.isDefined(b) && e.length ? e[0].text : c("Not set") : "undefined"
        };
        var r = function(a) {
                var b = "",
                    c = [];
                return angular.forEach(a, function(a) {
                    var b = a.res;
                    b ? (b == p && c.push(p), b === q && c.push("CALL"), angular.forEach(h.connections, function(a) {
                        a.res === b && c.push(a.label)
                    }), angular.forEach(h.groups, function(a) {
                        a.res === b && c.push(a.label)
                    }), angular.forEach(h.roles, function(a, d) {
                        a.res === b && c.push(a.label)
                    }), angular.forEach(h.ports, function(a, d) {
                        d === b && c.push(a.port_label)
                    })) : angular.forEach(h.connections, function(b) {
                        b.id === a.id && c.push(b.label)
                    })
                }), b = c.map(function(a, b) {
                    return a
                }).join(", ")
            },
            s = function(a, b, c) {
                return a.sort(function(a, e) {
                    return d.naturalSort(a[b] + "." + a[c], e[b] + "." + e[c])
                })
            },
            t = function(a) {
                var b = [];
                return angular.forEach(a, function(a) {
                    b.push(a)
                }), b
            },
            u = function(a) {
                var b = h.ports[a];
                return !(!b || "PGM" !== b.port_desc)
            },
            v = function(a) {
                var b = h.ports[a];
                return !(!b || "SA" !== b.port_desc)
            },
            w = function(a) {
                var b;
                return angular.forEach(h.groups, function(c) {
                    c.res === a && (b = c)
                }), b
            };
        h.BoolToEnabledDisabled = [{
            value: !0,
            text: c("Enabled")
        }, {
            value: !1,
            text: c("Disabled")
        }], h.updateStackedKeyState = function() {
            var a = h.getKeysetWithIndex(h.indexSelectedKey);
            a.stackedKeyEnabled ? (a.stackedKeyLabel = "Stacked Key", a.connections = []) : (a.stackedKeyLabel = "", a.connections = []), h.updateKeysets()
        }, h.keysetTypeIs = function(a) {
            if (angular.isArray(a)) {
                var b = !1;
                return angular.forEach(a, function(a, c) {
                    h.keysetType === a && (b = !0)
                }), b
            }
            return h.keysetType === a
        }, h.selectKey = function(a) {
            h.indexSelectedKey === a ? h.showKeysetChannelAssignment() : h.indexSelectedKey = a
        }, h.updateKeysets = function(a) {
            if ("LQ-AIC" === h.keysetType && (void 0 !== a && m(a), h.keysets))
                for (var b = 0; b < h.keysets.length; b++) h.keysets[b].keysetIndex = b + 1;
            h.callback()
        }, h.getKeysetWithIndex = function(a) {
            if (h.keysets && a < h.keysets.length) return h.keysets[a]
        }, h.filterKeyActivationState = function() {
            var b = [],
                c = h.getKeysetWithIndex(h.indexSelectedKey);
            return c.isReplyKey ? b = a("filter")(h.keyActivationState, {
                value: "talk"
            }, !0) : c.connections && c.connections.length > 0 ? u(c.connections[0].res) ? (b.push(a("filter")(h.keyActivationState, {
                value: "listen"
            }, !0)[0]), b.push(a("filter")(h.keyActivationState, {
                value: "forcelisten"
            }, !0)[0])) : v(c.connections[0].res) ? b = a("filter")(h.keyActivationState, {
                value: "talk"
            }, !0) : c.connections[0].res === q || (h.keysetTypeIs(["FSII-BP"]) ? b = h.keyActivationState : h.keysetTypeIs(["Station"]) && (b = h.keyActivationState.filter(function(a) {
                return "dualtalklisten" !== a.value && "forcetalkforcelisten" !== a.value
            }))) : c.roles && c.roles.length > 0 && (b = h.keyActivationState), b.length > 0 && 0 === a("filter")(b, {
                value: c.activationState
            }, !0).length && c.activationState != p && (c.activationState = b[0].value), b
        }, h.updateLatchingParameter = function(a, b) {
            if (a.activationState != b) switch (b) {
                case "talk":
                case "talklisten":
                case "talkforcelisten":
                case "listen":
                    a.talkBtnMode = "latching";
                    break;
                case "dualtalklisten":
                case "forcelisten":
                case "forcetalkforcelisten":
                    a.talkBtnMode = "disabled"
            }
            return null
        }, h.aicRightKeysSelection = [{
            value: "None",
            text: "Not Set"
        }, {
            value: "Talk",
            text: "Talk"
        }, {
            value: "Event1",
            text: "Event1"
        }, {
            value: "Event2",
            text: "Event2"
        }, {
            value: "Call",
            text: "Call"
        }, {
            value: "RMK",
            text: "RMK"
        }], h.aicLeftKeysSelection = [{
            value: "None",
            text: "Not Set"
        }, {
            value: "Listen",
            text: "Listen"
        }, {
            value: "Event1",
            text: "Event1"
        }, {
            value: "Event2",
            text: "Event2"
        }, {
            value: "Call",
            text: "Call"
        }, {
            value: "RMK",
            text: "RMK"
        }], h.filterTalkBtnMode = function() {
            var b = h.keysetTalkBtnMode;
            if ("FSII-BP" === h.keysetType || "Station" === h.keysetType) {
                var c = h.getKeysetWithIndex(h.indexSelectedKey);
                if (c.connections && c.connections.length > 0) switch (c.activationState) {
                    case "talk":
                    case "talklisten":
                    case "talkforcelisten":
                        b = a("filter")(h.keysetTalkBtnMode, {
                            value: "!disabled"
                        });
                        break;
                    case "dualtalklisten":
                    case "forcelisten":
                    case "forcetalkforcelisten":
                        b = a("filter")(h.keysetTalkBtnMode, {
                            value: "disabled"
                        });
                        break;
                    case "listen":
                        b = a("filter")(h.keysetTalkBtnMode, {
                            value: "latching"
                        }, !0)
                } else b = !c.isCallKey || 2 !== h.indexSelectedKey && 3 !== h.indexSelectedKey ? 4 === h.indexSelectedKey ? a("filter")(h.keysetTalkBtnMode, {
                    value: "disabled"
                }) : [] : a("filter")(h.keysetTalkBtnMode, {
                    value: "disabled"
                });
                b.length > 0 && 0 === a("filter")(b, {
                    value: c.talkBtnMode
                }, !0).length && c.talkBtnMode != p && (c.talkBtnMode = b[0].value)
            }
            return b
        };
        var x = function() {
            for (var a = [], b = 0, c = h.keysets; b < c.length; b++) {
                var d = c[b];
                d.connections[0] && a.push(d.connections[0].res)
            }
            for (var e in h.connections)
                if (a.indexOf(h.connections[e].res) == -1) return h.connections[e].res;
            return null
        };
        h.disableArrow = function(a) {
            return "left" === a ? 0 === h.indexSelectedKey : "right" === a ? h.indexSelectedKey === h.keysets.length - 1 : void 0
        }, h.moveSelectedKey = function(a) {
            var b = 0;
            "left" === a && (b = h.indexSelectedKey - 1), "right" === a && (b = h.indexSelectedKey + 1);
            var c = h.keysets[h.indexSelectedKey];
            h.keysets[h.indexSelectedKey] = h.keysets[b], h.keysets[b] = c, h.indexSelectedKey = b;
            for (var d = 0; d < h.keysets.length; d++) h.keysets[d].keysetIndex = d;
            h.updateKeysets()
        }, h.addKeyset = function() {
            if (h.keysets && h.keysets.length < h.maxNumberOfKeysets) {
                var a = angular.copy(RolesService.defaultIACKeyset),
                    b = x();
                if (b && a.connections.push({
                        res: b
                    }), void 0 != h.indexSelectedKey && h.indexSelectedKey < h.keysets.length) {
                    var c = h.getKeysetWithIndex(h.indexSelectedKey);
                    angular.copy(c.keys, a.keys)
                }
                a.keysetIndex = h.keysets.length, h.keysets.push(a), h.indexSelectedKey = -1, h.selectKey(a.keysetIndex), h.updateKeysets()
            }
        }, h.removeKeyset = function() {
            if (h.keysets.length > 1) {
                var a = h.indexSelectedKey,
                    b = h.keysets.length - 1;
                h.keysets.splice(a, 1), h.indexSelectedKey === b && h.selectKey(b - 1)
            } else h.keysets = [], h.indexSelectedKey = null, h.keysets.push(angular.copy(RolesService.defaultIACKeyset));
            for (var c = 0; c < h.keysets.length; c++) h.keysets[c].keysetIndex = c;
            h.updateKeysets()
        }, h.getKeyAssignment = function(a) {
            var b = "";
            if (!h.keysets) return b;
            var d = h.keysets[a];
            if (d) {
                var e = r(d.connections);
                0 === d.connections.length && (d.isCallKey == p || d.isReplyKey == p ? b = "[MV]" : e = c(d.isCallKey ? "CALL" : d.isReplyKey && (3 == d.keysetIndex && "Station" == h.keysetType || "Station" != h.keysetType) ? "REPLY" : "Unassigned")), "" === b ? b = "" === e ? c("Unassigned") : e : b != e && (b = "[MV]")
            }
            return b
        }, h.showKeysetTalkBtnMode = function(b) {
            var d = a("filter")(h.keysetTalkBtnMode, {
                value: b
            });
            return angular.isDefined(b) && d.length ? d[0].text : c("Not set")
        }, h.showKeyActivationState = function(b) {
            var d = a("filter")(h.keyActivationState, {
                value: b
            });
            return angular.isDefined(b) && d.length ? d[0].text : c("Not set")
        }, h.showKeysetAssignment = function() {
            h.selectKey(h.indexSelectedKey)
        };
        var y = function(a, b, c) {
            return "SA" != a.port_desc && "PGM" != a.port_desc
        };
        h.showKeysetChannelAssignment = function() {
            var d, e, f = !1,
                g = !1,
                i = c("LQ-AIC" === h.keysetType ? "Keyset" : "Key"),
                j = h.getKeysetWithIndex(h.indexSelectedKey);
            if ("HBP-2X" == h.keysetType) e = 0 === h.indexSelectedKey ? "Left" : "Right";
            else if ("Station" === h.keysetType || "FSII-BP" === h.keysetType) switch (h.indexSelectedKey) {
                case 0:
                    e = "A";
                    break;
                case 1:
                    e = "B";
                    break;
                case 2:
                    e = "C";
                    break;
                case 3:
                    e = "D";
                    break;
                case 4:
                    e = "REPLY"
            } else e = "#" + (h.indexSelectedKey + 1);
            for (var k = [], l = 0; l < j.connections.length; l++) k.push(j.connections[l].id);
            "LQ-AIC" !== h.keysetType && j.stackedKeyEnabled && (d = c("Select Channels to assign to Keyset: ") + e, f = !0, g = !0);
            var m = j.connections.map(function(a, b) {
                    return a.res
                }),
                n = {};
            "FSII-BP" === h.keysetType && "FSII-BP" === h.keysetType && (2 == h.indexSelectedKey || 3 == h.indexSelectedKey) && h.keysets[h.indexSelectedKey - 2].connections.length > 0 && (n["Special Keys"] = {
                labelField: "label",
                primaryKeyField: "res",
                value: [{
                    id: 1,
                    label: "CALL",
                    res: q
                }],
                sortField: "label"
            }), "LQ-AIC" === h.keysetType ? n.Channels = {
                labelField: "label",
                primaryKeyField: "res",
                value: t(h.connections).filter(function(a) {
                    for (var b in h.keysets)
                        if (h.keysets[b].connections.length && a.res === h.keysets[b].connections[0].res) return b == h.indexSelectedKey;
                    return !0
                }),
                sortField: "label"
            } : (n.Channels = {
                labelField: "label",
                primaryKeyField: "res",
                value: t(h.connections),
                sortField: "label"
            }, n.Groups = {
                labelField: "label",
                primaryKeyField: "res",
                value: t(h.groups),
                sortField: "label"
            }, n.Roles = {
                labelField: "label",
                primaryKeyField: "res",
                value: a("filter")(h.roles, {
                    type: "FSII-BP",
                    isDefault: !1
                }, !0),
                sortField: "label"
            }, n.Ports = {
                labelField: "port_label",
                primaryKeyField: "res",
                value: h.keysetTypeIs("Station") ? a("filter")(t(h.ports), y) : h.keysetTypeIs("FSII-BP") ? t(h.ports) : [],
                sortField: "res"
            });
            var o = {
                    title: i + ": " + e,
                    messages: c("Select item to assign to " + i + ": ") + e,
                    emptyCollectionMessages: "LQ-AIC" === h.keysetType ? c("All Channels are already in use by this Role") : "",
                    connectables: n,
                    assigned: m,
                    allowMultipleSelections: f,
                    requireMultipleSelections: g
                },
                p = b.open({
                    templateUrl: "views/dialogs/connectionSelectionDialog.html",
                    controller: "connectionSelectionDialog",
                    controllerAs: "dialogCtrl",
                    size: "md",
                    backdrop: "static",
                    resolve: {
                        options: o
                    }
                });
            p.result.then(function(a) {
                var b = a.selected;
                if (b) {
                    var c = h.keysets[h.indexSelectedKey];
                    if ((0 === c.connections.length || c.connections[0].res === q) && b.length > 0 && (h.keysetTypeIs("FSII-BP") ? c.activationState = "talkforcelisten" : h.keysetTypeIs("Station") && (c.activationState = "talklisten"), h.keysetTypeIs("LQ-AIC") || (c.talkBtnMode = "latching")), c.connections = b.map(function(a) {
                            var b = {};
                            return b.res = a, b
                        }), h.lastKeyCanReply && (c.isReplyKey = !1), h.canCall && (c.isCallKey = !1), c.connections.length > 0 && (c.connections[0].res.search("role") > 0 || w(c.connections[0].res)) && (c.activationState = "talk"), c.connections.length > 0 && u(c.connections[0].res) && (c.activationState = "listen", c.talkBtnMode = "disabled"), c.connections.length > 0 && v(c.connections[0].res) && (c.activationState = "talk", c.talkBtnMode = "non-latching"), h.keysetTypeIs("FSII-BP")) {
                        if (c.connections.length > 0 && c.connections[0].res === q ? (c.isCallKey = !0, c.activationState = "listen") : c.isCallKey = !1, (0 === h.indexSelectedKey || 1 === h.indexSelectedKey) && 0 === c.connections.length) {
                            var d = h.keysets[h.indexSelectedKey + 2];
                            d.connections.length > 0 && d.connections[0].res === q && (d.connections = [], d.isCallKey = !1)
                        }
                        4 === h.indexSelectedKey && (c.isReplyKey = 0 === c.connections.length)
                    } else h.keysetTypeIs("Station") && 3 === c.keysetIndex && 0 === c.connections.length && (c.isReplyKey = !0, c.activationState = "talk", c.talkBtnMode = "disabled")
                }
                h.callback()
            }, function() {})
        }, e.subscribe(h, function() {
            return l()
        }), f.subscribe(h, function() {
            return n()
        }), g.subscribe(h, function() {
            return o()
        }), h.clearError = function() {
            console.log("clearing"), h.errorText = ""
        }, k()
    }
    var i = {
        scope: {
            keysets: "=ngModel",
            callback: "&",
            keysetType: "=",
            canCall: "=",
            lastKeyCanReply: "=",
            errorText: "=",
            indexSelectedKey: "="
        },
        restrict: "A",
        templateUrl: "user_controls/keyset/keyset.html",
        link: h
    };
    return i
}
/**/
function Expander(a) {
    function b(b, c, d) {
        b.currentState = {}, b.guideSupported = void 0 !== b.guideEnabled, b.showMe = function() {
            return b.pageName && b.section ? (a.UserData.expanderStates[b.pageName] || (a.UserData.expanderStates[b.pageName] = []), b.currentState = a.UserData.expanderStates[b.pageName].find(function(a) {
                return a.sectionName === b.section
            }), b.currentState || (b.currentState = {
                sectionName: b.section,
                expandedState: !(!b.startOpen || "false" === b.startOpen)
            }, a.UserData.expanderStates[b.pageName].push(b.currentState)), b.currentState.expandedState) : (b.currentState || (b.currentState = {
                section: "dummy",
                expandedState: !(!b.startOpen || "false" === b.startOpen)
            }), b.currentState.expandedState)
        }, b.toggle = function() {
            b.currentState.expandedState = !b.currentState.expandedState
        }, b.openGuide = function() {
            b.guideFunction()
        }
    }
    var c = {
        scope: {
            pageName: "@pageName",
            section: "@section",
            title: "@expanderTitle",
            startOpen: "@startOpen",
            currentGuide: "=",
            guideEnabled: "=",
            guideName: "@",
            guideFunction: "&"
        },
        replace: !0,
        transclude: !0,
        restrict: "EA",
        templateUrl: "user_controls/expander/expander.html",
        link: b
    };
    return c
}
/**/
function connectionContainer() {
    return {
        scope: {},
        bindToController: {
            connection: "=",
            roles: "<",
            connectionCapabilities: "=",
            connectionStatus: "=",
            "delete": "=",
            deleteCallback: "&",
            disassociateCallback: "&",
            hangUpSipCallCallback: "&",
            hangup: "&",
            devices: "=",
            labelEdit: "=",
            labelEditCallback: "&",
            showConnectionBridgeOptionsIcon: "=",
            showBridgeOptions: "&",
            showRoleLabels: "=",
            select: "&",
            selected: "="
        },
        restrict: "E",
        templateUrl: "user_controls/connectionContainer/connectionContainer.html",
        controller: ConnectionContainerCtrl,
        controllerAs: "ctrl"
    }
}
/**/
function navBarController(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    function o() {
        e.getDevice(0).then(function(a) {
            q.hostDevice = a, window.document.title = q.hostDevice.device_label, p(c.current)
        }, function(a) {
            console.log("Unable to fetch info for host device")
        })
    }

    function p(a) {
        switch (a.$$route.originalPath.split("/", 3).join("/")) {
            case "/view/connections":
                q.navbarActive.navButton = "Assignments";
                break;
            case "/view/devices":
            case "/":
                q.navbarActive.navButton = "Overview";
                break;
            case "/view/roles":
                q.navbarActive.navButton = "Roles";
                break;
            case "/view/device":
                var b = parseInt(a.params.deviceId);
                !q.hostDevice.isHost || b !== q.hostDevice.device_id && 0 !== b ? q.navbarActive.navButton = "Proxy" : q.navbarActive.navButton = "Home";
                break;
            case "/view/accounts":
                q.navbarActive.navButton = "Accounts";
                break;
            default:
                q.navbarActive.navButton = ""
        }
    }
    var q = this;
    q.sharedVM = b.devSharedVM, q.root = b, q.toggleGuide = function() {
        l.toggleGuide()
    }, q.openGuide = function(a) {
        l.openGuide(a)
    }, q.showHelp = function(a) {
        var b = a || "clearcom.com";
        d.open(b)
    }, q.navbarActive = {
        navButton: g.getActiveNavButton
    }, q.updateDeviceCapability = function(a) {
        f.getDeviceCapabilites(a).then(function(a) {
            q.deviceCapabilities = a
        })
    }, a.$on("$routeChangeSuccess", function() {
        q.updateDeviceCapability(0 | +n.$routeParams.deviceId)
    }), m.linkGroupCapabilities.then(function(a) {
        q.linkgroupCapabilities = a
    }), m.subscribe(a, function() {
        m.linkGroupCapabilities.then(function(a) {
            q.linkgroupCapabilities = a
        })
    }), q.showRoles = function() {
        return !!q.linkgroupCapabilities && !!q.linkgroupCapabilities.roles
    }, q.showSystemConfig = function() {
        return !!q.linkgroupCapabilities && (!!q.linkgroupCapabilities.roles || !!q.linkgroupCapabilities.users)
    }, q.showAccounts = function() {
        return !!q.linkgroupCapabilities && !!q.linkgroupCapabilities.externalSystems
    }, q.showResourceMeter = function() {
        return m.supportsResourceUsage(q.linkgroupCapabilities)
    }, q.helpUrl = function() {
        return b.helpUrl ? b.helpUrl : "help/Default.htm"
    }, q.logout = function() {
        var a;
        window.XMLHttpRequest ? a = new XMLHttpRequest : window.ActiveXObject && (a = new ActiveXObject("Microsoft.XMLHTTP")), window.ActiveXObject ? (document.execCommand("ClearAuthenticationCache"), window.location.href = "/") : (a.open("GET", "/", !0, "admin", "logout"), a.send(""), a.onreadystatechange = function() {
            4 === a.readyState && (window.location.href = "/")
        })
    }, o(), e.subscribe(a, function() {
        return o()
    }), q.isCollapsed = !0, a.$on("$routeChangeSuccess", function(a, b) {
        q.isCollapsed = !0, p(b)
    });
    var r = null;
    i().then(function(c) {
        c.on("reconnect", function() {
            window.location.reload(!0)
        }, a), c.on("disconnect", function() {
            r || b.userActionInProgress || (r = h(k("The IP connection to this host " + j.PRODUCT_NAME + " device has been lost. The page will automatically reload on connection."), function() {
                return r = null
            }))
        }, a)
    })
}
/**/
function socket(a, b, c) {
    console.trace()
    console.log(a)
    console.log(b)
    console.log(c)
    var d = b.defer();
    return c.getDeviceCapabilites(0).then(function(b) {
        function c(b, c, d) {
            var e = function() {
                for (var b = [], d = 0; d < arguments.length; d++) b[d] = arguments[d];
                a.$apply(function() {
                    c.apply(void 0, b)
                })
            };
            return h.on(b, e), d && d.$on("$destroy", function() {
                return h.off(b, e)
            }), e
        }

        function e(a, b) {
            h.off(a, b)
        }

        function f(a, b) {
            h.emit(a, b)
        }

        var h;
        h = b.webSocket ? io.connect("/", {
            reconnection: !0,
            reconnectionDelay: 1e3,
            reconnectionDelayMax: 1e3,
            reconnectionAttempts: 1 / 0
        }) : alert("websocket failed to start"), d.resolve({ on: c, off: e, emit: f, setPollingIntervalMs: null })
    }, function(a) {
        console.error("Failed to fetch device capabilities, unable to initiate socket"), d.reject(new Error("Unable to initiate socket"))
    }),
    function() {
        return d.promise
    }
}
/**/
function whilePressed(a, b) {
    function c(c, d, e) {
        function f() {
            d.on("mousedown", i), d.on("touchstart", i)
        }

        function g() {
            d.on("mouseup", j), d.on("mouseleave", j), d.on("touchend", j)
        }

        function h() {
            d.off("mouseup", j), d.off("mouseleave", j), d.off("touchend", j)
        }

        function i(a) {
            o || (o = !0, a.preventDefault(), k(), n = b(k, p), g())
        }

        function j() {
            b.cancel(n), h(), m(c), o = !1
        }

        function k() {
            l(c)
        }
        var l = a(e.ccWhilePressed),
            m = a(e.ccPressup),
            n = null,
            o = !1,
            p = parseInt(e.ccWhilePressedInterval) || 15;
        f()
    }
    return {
        restrict: "A",
        link: c
    }
}
/**/
function deviceListCtrl(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M) {
    function N() {
        q.roles.then(function(a) {
            ea.roles = a
        })
    }

    function O() {
        ea.sipOverviewData = [], ea.ivcOverviewData = [];
        for (var a = 0, b = ea.externalDevices; a < b.length; a++) {
            var c = b[a];
            for (var d in c.ports) {
                var f = c.ports[d];
                "SIP" === c.type && ea.sipOverviewData.push(S(c, f)), "IVC" === c.type && ea.ivcOverviewData.push(T(c, f))
            }
        }
        ea.sipOverviewData = e("orderBy")(ea.sipOverviewData, ["externalDeviceId", "id"]), ea.ivcOverviewData = e("orderBy")(ea.ivcOverviewData, ["externalDeviceId", "id"])
    }

    function P(a) {
        return ea.ports.find(function(b) {
            return b.port_externalDeviceId === a.externalDeviceId && b.port_externalPortId === a.id
        })
    }

    function Q(a) {
        var b = P(a);
        return b ? ea.activeSipCalls.filter(function(a) {
            return a.deviceId === b.device_id && a.audioInterfaceId === b.audioInterface_id_AudioInterface && a.portId === b.port_id
        }) : []
    }

    function R(a) {
        var b = ea.devices.find(function(b) {
            return b.device_id === a
        });
        return !!b && b.device_isReachable
    }

    function S(a, b) {
        var c = b.liveStatus && b.liveStatus.sipRegistrationStatusCode;
        return {
            desc: b.desc,
            label: b.label,
            serverName: a.label,
            sipRegistrationStatusCode: c,
            externalConnectionStatusMessage: x.sipRegistrationStatusToMessage(c),
            calls: Q(b),
            assignedDeviceId: b.settings.assignedDeviceId,
            externalDeviceId: b.externalDeviceId,
            externalPortId: b.id,
            deviceOnline: R(b.settings.assignedDeviceId)
        }
    }

    function T(a, b) {
        var c = b.liveStatus && b.liveStatus.externalConnectionStatus,
            d = !1,
            e = P(b);
        return e && (d = e.liveStatus.vox.status), {
            desc: b.desc,
            label: b.label,
            serverName: a.label,
            externalConnectionStatus: c,
            externalConnectionStatusMessage: x.externalConnectionStatusToMessage(c),
            vox: d,
            assignedDeviceId: b.settings.assignedDeviceId,
            externalDeviceId: b.externalDeviceId,
            externalPortId: b.id,
            deviceOnline: R(b.settings.assignedDeviceId)
        }
    }

    function U() {
        v.calls.then(function(a) {
            ea.activeSipCalls = a, O()
        })
    }

    function V() {
        ea.count++, u.devices.then(function(a) {
            ea.hostIsReachable = !0, ea.devices = a, la(a), O(), Z()
        })["catch"](function(a) {
            ea.hostNotReachable()
        })
    }

    function W() {
        C.gpos.then(function(a) {
            ea.gpios.gpos = a
        }), C.gpis.then(function(a) {
            ea.gpios.gpis = a
        })
    }

    function X() {
        w.ports.then(function(a) {
            ea.ports = a, O()
        })
    }

    function Y() {
        A.linkGroupCapabilities.then(function(a) {
            K = a
        })
    }

    function Z() {
        for (var a = function(a) {
                w.getPortWarningsForDevice(a.device_id).then(function(b) {
                    fa[a.device_id] = b
                })
            }, b = 0, c = ea.devices; b < c.length; b++) {
            var d = c[b];
            a(d)
        }
    }

    function $() {
        angular.forEach(ea.endpoints, function(a) {
            angular.forEach(ga, function(b, c) {
                angular.forEach(b, function(d) {
                    a.type == d.type && (ea.supportedEndpoints[c] = b)
                })
            })
        })
    }

    function _() {
        ea.count++, y.endpoints.then(function(a) {
            ea.hostIsReachable = !0, ea.endpoints = a, $()
        })["catch"](function() {
            return ea.hostNotReachable()
        })
    }

    function aa(a, b) {
        var c = ga[b];
        if (!c) return console.error("Family not supported", b), !1;
        for (var d = 0, e = c; d < e.length; d++) {
            var f = e[d];
            if (f.type === a.type) return !0
        }
        return !1
    }

    function ba() {
        l.audioInterfaces.then(ca)
    }

    function ca(a) {
        CCUtils.arrayUpdate("audioInterface_id", ea.audioInterfaces, a), ma()
    }

    function da() {
        h().then(function(b) {
            b.on("disconnect", function() {
                "deviceListCtrl" === ea.controllerName && (ea.hostIsReachable = !1)
            }, a), a.$on("$destroy", function() {
                ea.controllerName = null
            })
        })
    }
    o.defaultGuide = "overview";
    var ea = this,
        fa = {};
    ea.openGuide = function(a) {
        o.openGuide(a)
    }, a.$on("$destroy", function() {
        o.cleanupGuide()
    }), ea.CCM_CONSTANTS = D, ea.controllerName = "deviceListCtrl", ea.root = b, ea.GPIOType = GPIOType, b.helpUrl = "help/Content/Terminator/CCM/Context%20sensitive/overview.htm", ea.roles = I, ea.endpoints = J, ea.splitters = [{
        name: "spliter 1",
        antennas: 5
    }, {
        name: "spliter 2",
        antennas: 5
    }], ea.devices = G, ea.audioInterfaces = H, ea.callText = "", ea.displayDevices = [], ea.externalDevices = [], ea.activeSipCalls = [], ea.sipOverviewData = [], ea.ivcOverviewData = [], ea.endpointsOverviewData = [], ea.ports = [], ea.gpios = {
        gpis: [],
        gpos: []
    }, ea.connections = r.filterConnections(E, "partyline", "res"), ea.groups = r.filterConnections(E, "group", "res"), ea.hostIsReachable = !0, ea.isMasterReachable = !1, ea.count = 0, ea.modalAlertDevices = null, ea.alertMsgHostUnreachable = g("The selected Device cannot be accessed until both Host and Device are reachable"), ea.hasUnsupportedDeviceCount = !1, ea.showDifferentNumberOfChannelsMessage = !1, ea.showKeystateLegend = !1, ea.alerts = {}, ea.supportedInterfaceObject = {}, ea.devicesWithPowerWarning = [], ea.devicesCapabilities = {}, ea.supportedDevices = null, ea.maxDevices = null, ea.mixedFrequencies = !0, ea.supportedExternalDevices = [];
    var ga = {
        HelixNet: [{
            type: "HRM-4X",
            name: "Remote Stations"
        }, {
            type: "HKB-2X",
            name: "Speaker Stations"
        }, {
            type: "HBP-2X",
            name: "Beltpacks"
        }, {
            type: "HMS-4X",
            name: "Base Station"
        }],
        FSII: [{
            type: "FSII-BP",
            name: "FSII Beltpacks"
        }, {
            type: "FSII-Antenna",
            name: "FSII Antenna"
        }],
        LQ: [{
            type: "LQ-AIC",
            name: "Agent-IC"
        }]
    };
    ea.supportedEndpoints = {}, ea.licenseService = z, ea.getRoleLabelById = function(a) {
        var b = "";
        if (null !== a) {
            var c = void 0;
            void 0 !== a.liveStatus && void 0 !== a.liveStatus.role ? c = a.liveStatus.role : void 0 !== a.role && void 0 !== a.role.id && (c = a.role.id);
            var d = ea.roles.find(function(a) {
                return a.id === c
            });
            b = d ? d.label : "Unassigned"
        } else b = "Unassigned";
        return b
    };
    var ha = function(a) {
        var b = !1,
            c = !1;
        angular.forEach(a, function(a) {
            if ("HMS-4X" === a.deviceType_name) {
                a.hasIncompatibleNumberOfChannels = !1;
                var d = ea.devicesCapabilities[a.deviceType_name];
                if (d && d.licensing && a.device_isReachable)
                    if (angular.isDefined(a.licensedFeatures) && 0 !== a.licensedFeatures.length) {
                        var f = e("filter")(a.licensedFeatures, {
                            name: "24Channels"
                        });
                        angular.isDefined(f) && f.length > 0 ? c = !0 : (b = !0, ka(a.device_label))
                    } else b = !0, ka(a.device_label)
            }
        }), c && b && angular.forEach(a, function(a) {
            if ("HMS-4X" === a.deviceType_name) {
                var b = ea.devicesCapabilities[a.deviceType_name];
                if (b && b.licensing) {
                    var c = e("filter")(a.licensedFeatures, {
                        name: "24Channels"
                    });
                    a.hasIncompatibleNumberOfChannels = !c || 0 === c.length
                }
            }
        }), ea.showDifferentNumberOfChannelsMessage = b && c
    };
    ea.isCapabilitySupportedByDevice = function(a, b) {
        var c = ea.devicesCapabilities[a.deviceType_name];
        return !!c && c[b]
    }, ea.getAntenna = function(a) {
        var b = null;
        return angular.forEach(ea.endpoints, function(c) {
            "FSII-Antenna" == c.type && c.id == 1e6 + a && (b = c)
        }), b
    }, ea.endpointTypeStr = function(a, b) {
        return "HBP-2X" === a && b && 2 === b ? "HXII-BP" : a
    }, ea.getEndpointPhoneType = function(a) {
        var b = "";
        return a.liveStatus && a.liveStatus.os && (b = a.liveStatus.os, a.liveStatus.osVersion && (b += " " + a.liveStatus.osVersion)), b
    }, ea.rmkAll = !1, ea.callAll = ea.devices[0].device_liveStatus.callAllState, ea.fsIIFilterByRole = !0, ea.triggerRMK = function(a) {
        a.id ? a.rmkPress = !0 : (ea.rmkAll = !0, a.device_id = 1), y.rmkEndpoint(a.device_id, a.id).then(function(b) {
            f(function() {
                a.id ? a.rmkPress = !1 : ea.rmkAll = !1
            }, 3e3)
        })["catch"](function(b) {
            f(function() {
                a.id ? a.rmkPress = !1 : ea.rmkAll = !1
            }, 3e3), console.log(b)
        })
    }, ea.triggerCallSignal = function(a, b) {
        a.id ? a.pressingCall = b : (ea.callAll = b, a.device_id = 1), y.callEndpoint(a.device_id, a.id, b, ea.callText).then(function(a) {})["catch"](function(a) {
            console.log(a)
        })
    }, ea.triggerGPITest = function(a, b, c) {
        var d = null;
        b.liveStatus.forced && b.liveStatus.status === !c || (d = c), M.setGPI({
            version: "1",
            deviceId: a,
            action: "setGPI"
        }, {
            id: b.id,
            enabled: d
        }, function(a) {}, function(a) {})
    }, ea.getEntityNameFromEntityRes = function(a) {
        if (ea.connections[a]) return ea.connections[a].label;
        if (ea.groups[a]) return ea.groups[a].label;
        var b = ea.roles.find(function(b) {
            return b.res === a
        });
        return b ? b.label : (b = ea.ports.find(function(b) {
            return b.res === a
        }), b ? b.port_label : "Unassigned")
    }, ea.triggerGPOTest = function(a, b, c) {
        var d = null;
        b.liveStatus.forced && b.liveStatus.status === c || (d = c), M.setGPO({
            version: "1",
            deviceId: a,
            action: "setGPO"
        }, {
            id: b.id,
            enabled: d
        }, function(a) {}, function(a) {})
    }, ea.getGpioState = function(a, b) {
        var c = ea.gpios.find(function(c) {
            return c.type === b && c.id === a
        });
        return !(!c || !c.liveStatus) && c.liveStatus.status
    }, ea.hangUpSipCall = function(a) {
        v.hangupCall(a).then(function() {})
    }, ea.hangUpAllSipCall = function() {
        v.hangupAllCall()
    }, ea.showSip = function() {
        var a = !1;
        return K && K.externalSystems && angular.forEach(K.externalSystems, function(b) {
            "SIP" === b.type && (a = !0)
        }), a && ea.devices.some(function(a) {
            return z.getNumberOfLicensedUsers(a, z.SIP_LICENSE_REGEXP)
        }) && ea.externalDevices.some(function(a) {
            return "SIP" === a.type
        })
    }, ea.showResourceUsage = function() {
        return A.supportsResourceUsage(K)
    }, ea.showAIC = function() {
        return K && K.users && K.users.length > 0 && L.length > 0
    }, ea.showIvc32 = function() {
        var a = !1;
        return K && K.externalSystems && angular.forEach(K.externalSystems, function(b) {
            "IVC" === b.type && (a = !0)
        }), a && ea.externalDevices.some(function(a) {
            return "IVC" === a.type
        })
    }, ea.showHelixNet = function() {
        if (K && K.roles)
            for (var a = 0, b = K.roles; a < b.length; a++) {
                var c = b[a];
                if ("HMS-4X" === c.type) return !0
            }
        return !1
    };
    var ia = function() {
            x.externalDevices.then(function(a) {
                ea.externalDevices = a, O()
            })
        },
        ja = function() {
            p.alerts.then(function(a) {
                ea.alerts = {}, angular.forEach(a, function(a) {
                    ea.alerts[a.device_id] || (ea.alerts[a.device_id] = []), ea.alerts[a.device_id].push(a)
                })
            })
        };
    ea.getEndpointIdString = function(a) {
        return a ? String("000000" + a).slice(-6) : ""
    }, ea.getNumberOfConnectedBPs = function(a) {
        return ea.endpoints.filter(function(b) {
            return b.liveStatus.antennaIndex == a && "online" === b.liveStatus.status
        }).length
    }, ea.getTotalNumberOfBPs = function() {
        var a = ea.endpoints.filter(ea.searchOnlinePP).length;
        return a
    }, ea.getAntennaIconSRC = function(a) {
        return a && a.liveStatus && a.liveStatus.status && "online" === a.liveStatus.status && "2.4" == a.liveStatus.frequencyType ? "../../images/antenna-24.svg" : a && a.liveStatus && a.liveStatus.status && "online" === a.liveStatus.status && "1.9" == a.liveStatus.frequencyType ? "../../images/antenna-19.svg" : a && a.liveStatus && a.liveStatus.status && "online" !== a.liveStatus.status ? "../../images/antenna-error.svg" : "../../images/antenna-offline.svg"
    }, ea.getAntennaDensityWarning = function(a, b) {
        var c = ea.endpoints.filter(function(a) {
            return a.liveStatus.antennaIndex == b && "online" === a.liveStatus.status
        }).length;
        return a && a.liveStatus && "online" === a.liveStatus.status ? "2.4" == a.liveStatus.frequencyType && c >= 4 ? "antenna-connected-pp-warning" : "1.9" == a.liveStatus.frequencyType && c >= 5 ? "antenna-connected-pp-warning" : "antenna-connected-pp-ok" : "antenna-connected-pp-offline"
    }, ea.isEndpointLQ = function(a) {
        return aa(a, "LQ")
    }, ea.isEndpointHN = function(a) {
        return aa(a, "HelixNet")
    }, ea.isEndpointFS = function(a) {
        return aa(a, "FSII")
    }, ea.deviceIsMaster = function(a) {
        return "linkMaster" === a
    }, ea.isEndpointOnLocalDevice = function(a) {
        var b = !1;
        return angular.forEach(ea.devices, function(c) {
            c.device_id === a.device_id && (b = c.isHost)
        }), b
    };
    var ka = function(a) {
            angular.isUndefined(ea.devicesWith12Channels) ? (ea.numberOfDevicesWith12Channels = 1, ea.devicesWith12Channels = "'" + a + "'") : (ea.numberOfDevicesWith12Channels += 1, ea.devicesWith12Channels += ", '" + a + "'")
        },
        la = function(a) {
            ea.devicesWith12Channels = void 0, ea.numberOfDevicesWith12Channels = 0;
            var b = [],
                c = !1,
                d = !1,
                e = ea.supportedDevices;
            angular.forEach(a, function(a) {
                a.device_id > e && (e = a.device_id)
            }), ha(a), ea.supportedDevices && (ea.hasUnsupportedDeviceCount = a.length > ea.supportedDevices);
            for (var f = 1; f <= e; f++) {
                var g = !1;
                angular.forEach(a, function(a, e) {
                    g || a.device_id == f && (a.isHost && a.device_masterStatus && (c = "CONFLICT" === a.device_masterStatus, d = "BADVERSION" === a.device_masterStatus), a.device_isMaster && (ea.isMasterReachable = a.device_isReachable), a.device_ipAddress || (a.device_ipAddress = ""), b.push(a), a.device_liveStatus ? a.device_liveStatus.power = +a.device_liveStatus.power : a.device_liveStatus = {
                        power: 0
                    }, g = !0)
                }), ea.hostHasConflict = c, ea.hostHasBadVersion = d, g || b.push({
                    device_id: 0
                })
            }
            angular.equals(ea.displayDevices, b) || (CCUtils.copyArrayPreserveRefs(b, ea.displayDevices), ba())
        };
    ea.hostNotReachable = function() {
        ea.hostIsReachable = !1, k.setSystemStatus("failure")
    }, ea.removeDevice = function(a) {
        var b = g("Are you sure you want to remove this unreachable Device?"),
            c = "";
        i("sm", b, c, g("Delete"), g("Cancel"), function(b) {
            b && u.deleteDevice(a)
        })
    }, ea.getOnlineDeviceStatus = function(a) {
        return a.device_isReachable ? ea.getDeviceWarnings(a) ? "WARNING" : "OK" : "ERROR"
    };
    var ma = function() {
        angular.forEach(ea.devices, function(a, b) {
            var c = ea.devicesCapabilities[a.deviceType_name];
            if (c) {
                var d = [];
                angular.forEach(ea.audioInterfaces, function(b, c) {
                    b.device_id_Device === a.device_id && b.audioInterfaceType_shortName && d.push(b)
                }), ea.supportedInterfaceObject[a.device_id] || (ea.supportedInterfaceObject[a.device_id] = []), CCUtils.copyArrayPreserveRefs(m.formatWithCapabilities(c, d), ea.supportedInterfaceObject[a.device_id])
            }
        })
    };
    ea.getDeviceWarnings = function(a) {
        var b = [];
        ea.hostHasBadVersion && a.isHost ? b.push(g("The version of this device is incompatible with that of the Link-Master. The Link-Master has refused the connection.")) : ea.hostHasConflict && a.isHost ? b.push(g("Slot-ID conflict detected.")) : ea.hostIsReachable ? (ea.isMasterReachable || "linkMember" !== a.device_linking || b.push(g("The Link-Master is unreachable.")), null != ea.alerts && null != ea.alerts[a.device_id] && (b = b.concat(ea.alerts[a.device_id].map(function(a) {
            return a.message
        }))), a.hasIncompatibleNumberOfChannels && b.push(g("The license is currently limiting the system to 12 Channels.")), a.hxIIBPversionSW && "none" !== a.hxIIBPversionSW && a.versionSW !== a.hxIIBPversionSW && b.push(g("The version of firmware running on the HXII-BP is not compatible with the HMS-4X firmware version. Upgrade either the HXII-BP or HMS-4X firmware."))) : a.isHost || b.push(g("The host device is unreachable."));
        for (var c in fa[a.device_id]) b.push(fa[a.device_id][c]);
        return b.join("<br>")
    }, ea.getRoleLabel = function(a) {
        return a && !a.isDefault ? a.label : g("Local Config")
    }, ea.getLQRoleLabel = function(a) {
        return a && !a.isDefault && a.label ? a.label : g("AIC Default")
    }, ea.getRoleOrDefault = function(a) {
        if (a.role && a.role.id) return a.role.id;
        var b = this.roles.find(function(b) {
            return b.type === a.type && b.isDefault
        });
        return b ? b.id : 0
    }, ea.getRoleLabelForSorting = function(a) {
        return a.role && !a.role.isDefault ? s.naturalValue(ea.getRoleLabelById(a)) : "~"
    }, ea.getTypeForSorting = function(a) {
        var b = 0;
        return "HMS-4X" === a.type ? b = 1 : "HRM-4X" === a.type ? b = 2 : "HKB-2X" === a.type ? b = 3 : "HBP-2X" === a.type && 2 === a.revision ? b = 4 : "HBP-2X" === a.type && (b = 5), b
    }, ea.getDeviceName = function(a) {
        var b;
        return angular.forEach(ea.devices, function(c) {
            c.device_id === a && (b = c.device_label)
        }), b ? b : g("Device ") + a
    }, ea.showModalAlert = function(a) {
        ea.modalMessage || (ea.modalAlertDevices = j(a))
    }, ea.canShowAntennaName = function(a) {
        var b = document.getElementById(a),
            c = b.clientWidth;
        return c > 60
    }, ea.showFSIIAntennaConfig = function(a) {
        var b = null;
        angular.forEach(ea.devices, function(c) {
            c.device_id === a.device_id && (b = c)
        });
        var c = d.open({
            templateUrl: "views/dialogs/FSIIAntennaCfg.html",
            controller: "FSIIAntennaCfgCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                options: function() {
                    return {
                        endpoint: a,
                        device: b
                    }
                }
            }
        });
        c.result.then(function() {}, function() {})
    }, ea.showFSIIBeltpackConfig = function(a) {
        var b = null;
        angular.forEach(ea.devices, function(c) {
            c.device_id === a.device_id && (b = c)
        });
        var c = d.open({
            templateUrl: "views/dialogs/FSIIBeltpackCfg.html",
            controller: "FSIIBeltpackCfgCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                options: function() {
                    return {
                        endpoint: a,
                        device: b,
                        endpoints: ea.endpoints
                    }
                }
            }
        });
        c.result.then(function() {}, function() {})
    }, ea.showSyncOffset = function(a) {
        var b = e("filter")(ea.syncOffsetValues, {
            value: a
        }, !0);
        return angular.isDefined(a) && b.length ? b[0].text : g("Not set")
    }, ea.syncOffsetValues = [{
        value: 1,
        text: g("69m")
    }, {
        value: 2,
        text: g("139m")
    }, {
        value: 3,
        text: g("209m")
    }, {
        value: 4,
        text: g("279m")
    }, {
        value: 5,
        text: g("349m")
    }, {
        value: 6,
        text: g("419m")
    }, {
        value: 7,
        text: g("489m")
    }, {
        value: 8,
        text: g("559m")
    }, {
        value: 9,
        text: g("629m")
    }, {
        value: 10,
        text: g("699m")
    }, {
        value: 11,
        text: g("769m")
    }, {
        value: 12,
        text: g("839m")
    }, {
        value: 13,
        text: g("909m")
    }, {
        value: 14,
        text: g("979m")
    }, {
        value: 15,
        text: g("1049m")
    }, {
        value: 16,
        text: g("1119m")
    }, {
        value: 17,
        text: g("1189m")
    }, {
        value: 18,
        text: g("1259m")
    }, {
        value: 19,
        text: g("1329m")
    }, {
        value: 20,
        text: g("1399m")
    }, {
        value: 21,
        text: g("1469m")
    }, {
        value: 22,
        text: g("1539m")
    }, {
        value: 23,
        text: g("1609m")
    }], ea.searchActivePP = function(a) {
        return function(b) {
            if ("FSII-BP" === b.type && "undefined" != typeof b.liveStatus && "undefined" != typeof b.liveStatus.status && "unknown" !== b.liveStatus.status)
                if (ea.fsIIFilterByRole) {
                    if (ea.getRoleLabelById(b).match(a)) return !0
                } else if (b.label.match(a)) return !0;
            return !1
        }
    }, ea.searchUnusedPP = function(a) {
        var b = !1;
        return "FSII-BP" === a.type && ("undefined" != typeof a.liveStatus && "undefined" != typeof a.liveStatus.status ? "unknown" === a.liveStatus.status && (b = !0) : b = !0), b
    }, ea.searchOnlinePP = function(a) {
        return "FSII-BP" === a.type && "undefined" != typeof a.liveStatus && "undefined" != typeof a.liveStatus.status && "online" === a.liveStatus.status
    }, ea.showHNEndpointConfig = function(a) {
        var b = null;
        angular.forEach(ea.devices, function(c) {
            c.device_id === a.device_id && (b = c)
        });
        var c = d.open({
            templateUrl: "views/dialogs/HNEndpointCfg.html",
            controller: "HNEndpointCfgCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                options: function() {
                    return {
                        endpoint: a,
                        device: b
                    }
                }
            }
        });
        c.result.then(function() {}, function() {})
    }, ja();
    var na = {
        online: 0,
        connecting: 1,
        offline: 2,
        unknown: 3
    };
    ea.codecToDisplayText = function(a) {
        return "PCMA" === a ? "G711a" : "PCMU" === a ? "G711u" : a
    }, ea.activePPOrderBy = function(a) {
        var b;
        return b = void 0 !== a.liveStatus && void 0 !== a.liveStatus.status ? na[a.liveStatus.status] + ea.getRoleLabelById(a) + a.id : na[a.liveStatus.status] + "zzzzzzzzzz" + a.id
    }, ea.getButtonFillColor = function(a, b) {
        if ("offline" == a.liveStatus.status) return "#A6A6A6";
        var c = a.liveStatus.keyState.filter(function(a) {
                return a.keysetIndex === b
            }),
            d = ea.roles.filter(function(b) {
                return b.id === a.liveStatus.role
            });
        if (d.length > 0 && c.length > 0) {
            var e = d[0].settings.keysets.filter(function(a) {
                return a.keysetIndex === b
            });
            if (e.length > 0 && c[0]) {
                var f = c[0].currentState,
                    g = e[0].activationState;
                if ("off" === f) return "rgba(0,0,0,0)";
                if (e[0].isReplyKey) return "off" === f ? "rgba(0,0,0,0)" : "#c80000";
                if ("talkforcelisten" === g) return "listen" === f ? "#00c800" : "#ffa500";
                if ("forcetalkforcelisten" === g) return "#ffa500";
                if ("talk" === f) return "#c80000";
                if ("listen" === f) return "#00c800";
                if ("talklisten" === f || "talk+listen" === f) return "#ffa500"
            }
        }
        return "rgba(0,0,0,0)"
    }, ea.getButtonStrokeColor = function(a, b) {
        var c = ea.roles.filter(function(b) {
            return b.id === a.liveStatus.role
        });
        if (c.length > 0) {
            var d = c[0].settings.keysets.find(function(a) {
                return a.keysetIndex === b
            });
            if (void 0 !== d) {
                if (d.isCallKey) return "#ffa500";
                if (d.isReplyKey) return "#c80000";
                if (0 !== d.connections.length) {
                    var e = d.activationState;
                    if ("talk" === e) return "#c80000";
                    if ("listen" === e || "forcelisten" === e) return "#00c800";
                    if ("talklisten" === e || "talk+listen" === e) return "#ffa500";
                    if ("dualtalklisten" === e) return "#ffa500";
                    if ("talkforcelisten" === e) return "#ffa500";
                    if ("forcetalkforcelisten" === e) return "#ffa500"
                }
            }
        }
        return "rgba(0,0,0,0)"
    }, ea.keyColourIndex = function(a) {
        return "off" === a ? "rgba(0,0,0,0)" : "talk" === a ? "#c80000" : "listen" === a ? "#00c800" : "talklisten" === a || "talk+listen" === a ? "#ffa500" : "talkforcelisten" === a ? "#ffa500" : "forcetalkforcelisten" === a ? "#ffa500" : void 0
    }, ea.toggleColourLegend = function() {
        ea.showKeysetLegend = !ea.showKeysetLegend
    }, ea.showColourLegend = function() {
        return ea.showKeysetLegend
    }, ea.displayFER = function(a) {
        return a.frameErrorRate > 2
    }, ea.getAntennaClasses = function(a, b) {
        var c = "antenna-number-offline";
        return "online" === a && (c = "antenna-number"), c
    }, ea.getFillColor = function(a, b) {
        return a.linkQuality >= 80 ? "offline" == a.status ? "#a6a6a6" : "#66cd00" : a.linkQuality >= 60 && b < 5 ? "offline" == a.status ? "#a6a6a6" : "#66cd00" : a.linkQuality >= 40 && b < 4 ? "offline" == a.status ? "#a6a6a6" : "#66cd00" : a.linkQuality >= 20 && b < 3 ? "offline" == a.status ? "#a6a6a6" : "#fcd116" : a.linkQuality >= 10 && b < 2 ? "offline" == a.status ? "#a6a6a6" : "#ff3333" : "none"
    }, ea.convertVolumeToHeight = function(a) {
        return 30 - 30 * a / 100
    }, ea.getKeyIndexLabel = function(a) {
        return 0 == a ? "A" : 1 == a ? "B" : 2 == a ? "C" : 3 == a ? "D" : 4 == a ? "M" : ""
    }, ea.getStrokeColor = function(a, b) {
        return a.linkQuality >= 80 ? "offline" == a.status ? "#a6a6a6" : "#66cd00" : a.linkQuality >= 60 ? "offline" == a.status ? "#a6a6a6" : "#66cd00" : a.linkQuality >= 40 ? "offline" == a.status ? "#a6a6a6" : "#66cd00" : a.linkQuality >= 20 ? "offline" == a.status ? "#a6a6a6" : "#fcd116" : a.linkQuality >= 10 && "offline" == a.status ? "#a6a6a6" : "#ff3333"
    }, ea.getSipLinesColor = function(a) {
        return 0 === ea.getTotalLicensedUsers(ea.licenseService.SIP_LICENSE_REGEXP, a) ? "black" : "green"
    }, ea.getTotalLicensedUsers = function(a, b) {
        return z.getNumberOfLicensedUsers(b, a)
    }, ea.getUserSipLines = function(a) {
        return ea.sipOverviewData.reduce(function(b, c) {
            return c.assignedDeviceId === a.device_id && (b += 1), b
        }, 0)
    }, ea.getAgentICColor = function(a) {
        var b = ea.getTotalLicensedUsers(ea.licenseService.AGENT_IC_LICENSE_REGEXP, a);
        return 0 === b ? "black" : ea.getAgentICUserCount(a) <= b ? "green" : "yellow"
    }, ea.getAgentICUserCount = function(a) {
        return ea.endpoints.reduce(function(b, c) {
            return c.device_id === a.device_id && b++, b
        }, 0)
    }, ea.isEventTriggered = function(a, b, c) {
        var d;
        return d = b ? ea.gpios.gpos.find(function(b) {
            return b.id === a.id
        }) : ea.gpios.gpis.find(function(b) {
            return b.id === a.id
        }), !!(d && d.liveStatus && d.liveStatus.triggers) && d.liveStatus.triggers.includes(c)
    }, ea.getGPOActionDisplayTextFromValue = function(a) {
        return "talk" === a ? g("Talk") : "listen" === a ? g("Listen") : "talklisten" === a ? g("Talk & Listen") : "call" === a ? g("Call") : "Unknown"
    }, u.subscribe(a, function() {
        return V()
    }), l.subscribe(a, function() {
        return ba()
    }), q.subscribe(a, function() {
        return N()
    }), y.subscribe(a, function() {
        return _()
    }), p.subscribe(a, function() {
        return ja()
    }), v.subscribe(a, function() {
        return U()
    }), A.subscribe(a, function() {
        return Y()
    }), w.subscribe(a, function() {
        X(), Z()
    }), B.subscribe(a, function() {
        B.users.then(function(a) {
            return L = a
        })
    }), C.subscribe(a, function() {
        return W()
    }), n().then(function(b) {
        for (var c = !ea.supportedDevices, d = 0; d < b.length; d++) {
            if (c) {
                if (b[d].linking ? (ea.supportedDevices = b[d].linking.supportedDevices, ea.maxDevices = b[d].linking.maxDevices) : (ea.supportedDevices = 1, ea.maxDevices = 1), b[d].externalDevices)
                    for (var e = 0; e < b[d].externalDevices.length; e++) ea.supportedExternalDevices.indexOf(b[d].externalDevices[e].type) == -1 && ea.supportedExternalDevices.push(b[d].externalDevices[e].type)
            } else ea.supportedDevices = Math.min(ea.supportedDevices, b[d].linking.supportedDevices), ea.maxDevices = Math.min(ea.maxDevices, b[d].linking.maxDevices);
            ea.isLinkingSupported = ea.maxDevices > 1, ea.devicesCapabilities[b[d].type] = {}, angular.copy(b[d], ea.devicesCapabilities[b[d].type])
        }
        ea.supportedExternalDevices.length && (ia(), x.subscribe(a, function() {
            return ia()
        })), ea.hasUnsupportedDeviceCount = ea.devices.length > ea.supportedDevices, U(), ha(ea.displayDevices), ma(), la(G), ca(H), X(), $(), Z(), W(), da()
    })
}
/**/
function deviceMenuCtrl(a, b, c, d) {
    function e() {
        d.linkGroupCapabilities.then(function(a) {
            f.linkGroupCapabilities = a
        })
    }
    c.defaultGuide = "device";
    var f = this;
    f.root = b, f.sharedVM = b.devSharedVM, d.linkGroupCapabilities.then(function(a) {
        f.linkGroupCapabilities = a
    }), f.openGuide = function() {
        c.openGuide("devMenu")
    }, a.$on("$destroy", function() {
        c.cleanupGuide()
    }), f.showResourceUsage = function() {
        return d.supportsResourceUsage(f.linkGroupCapabilities)
    }, d.subscribe(a, function() {
        return e()
    })
}
/**/
function deviceViewCtrl(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    function r() {
        v.count++, k.endpoints.then(function(a) {
            v.hostIsReachable = !0, v.device.endpoints = a, angular.forEach(v.device.endpoints, function(a) {
                angular.forEach(v.allSupportedEndpoints, function(b, c) {
                    angular.forEach(b, function(d) {
                        a.type === d.type && (v.supportedEndpoints[c] = b)
                    })
                })
            }), w()
        })
    }

    function s() {
        j.currentDeviceAudioInterfaces.then(function(a) {
            if (v.device.audioInterfaces && a.length === v.device.audioInterfaces.length)
                for (var b = 0; b < a.length; b++) angular.copy(a[b], v.device.audioInterfaces[b]);
            else v.device.audioInterfaces = a;
            w()
        })
    }

    function t() {
        l.getPortWarningsForDevice(n.device_id).then(function(a) {
            u = !!Object.keys(a).length, v.updateDeviceStatus(v.device)
        })
    }
    var u = !1,
        v = this;
    b.devSharedVM = this, v.CCM_CONSTANTS = m, v.deviceViewCtrlName = "deviceViewCtrl", v.device = angular.copy(n), v.portIdentification = ["A / B", "C / D", "E / F", "G / H"], v.singlePortIdentification = ["A", "B", "C", "D", "E", "F", "G", "H"], a.$routeSegment = c, a.$routeParams = d, v.device.audioInterfaces = p, v.alerts = [], v.device.endpoints = o, v.deviceCapability = q, v.supportedInterfaceObject = {}, v.UNKNOWN = 0, v.OK = 1, v.WARNING = 2, v.ERROR = 3;
    var w = function() {
        v.supportedInterfaceObject[v.device.device_id] || (v.supportedInterfaceObject[v.device.device_id] = []), CCUtils.copyArrayPreserveRefs(g.formatWithCapabilities(v.deviceCapability, v.device.audioInterfaces, v.device.endpoints), v.supportedInterfaceObject[v.device.device_id])
    };
    w(), v.deviceIsMaster = function(a) {
        return "linkMaster" == a
    }, v.updateDeviceStatus = function(a) {
        if (!a) return void(v.deviceStatus = v.ERROR);
        if (a.device_masterStatus && (v.hostHasConflict = "CONFLICT" === a.device_masterStatus, v.hostHasBadVersion = "BADVERSION" === a.device_masterStatus), "NOTREADY" === a.device_masterStatus) return void(v.deviceStatus = v.WARNING);
        if (a.isHost) {
            if (v.hostHasBadVersion || v.hostHasConflict) return void(v.deviceStatus = v.WARNING)
        } else if (v.deviceIsMaster(a.device_linking) && !a.device_isReachable) return void(v.deviceStatus = v.WARNING);
        return a.hxIIBPversionSW && "none" !== a.hxIIBPversionSW && a.versionSW !== a.hxIIBPversionSW ? void(v.deviceStatus = v.WARNING) : v.interfacesHaveWarning() || u ? void(v.deviceStatus = v.WARNING) : void(v.deviceStatus = v.OK)
    }, v.interfacesHaveWarning = function(a) {
        var b = !1;
        return angular.forEach(v.alerts, function(a) {
            null != a.interface_id && (b = !0)
        }), b
    }, v.interfaceHasWarning = function(a) {
        var b = !1;
        return angular.forEach(v.alerts, function(c) {
            c.interface_id == a.audioInterface_id && (b = !0)
        }), b
    }, v.updateDeviceStatus(n), v.getDeviceStatus = function() {
        return v.hostHasConflict ? v.ERROR : v.deviceStatus
    }, v.getDevice = function() {
        i.currentDevice.then(function(a) {
            var b = v.device.audioInterfaces,
                c = v.device.endpoints;
            delete v.device.audioInterfaces, delete v.device.endpoints, CCUtils.objectUpdate(v.device, a), v.device.audioInterfaces = b, v.device.endpoints = c, v.setDefaultLiveStatus(), v.updateDeviceStatus(v.device)
        }, function() {
            v.updateDeviceStatus(null)
        })
    }, v.setDefaultLiveStatus = function() {
        null == v.device.device_liveStatus && (v.device.device_liveStatus = {}), angular.isUndefined(v.device.device_liveStatus.monitoring) && (v.device.device_liveStatus.monitoring = "0")
    };
    var x = function() {
        h.currentDeviceCurrentAlerts.then(function(a) {
            v.alerts = a, v.updateDeviceStatus(v.device)
        })
    };
    x(), t(), i.subscribe(a, function() {
        "upgrading" != b.upgradeStatus && v.getDevice()
    }), h.subscribe(a, function() {
        return x()
    }), j.subscribe(a, function() {
        return s()
    }), k.subscribe(a, function() {
        return r()
    }), l.subscribe(a, t), e().then(function(b) {
        b.on("disconnect", function() {
            console.log("socket.io: disconnected, " + v.deviceViewCtrlName), "deviceViewCtrl" === v.deviceViewCtrlName && v.updateDeviceStatus(null)
        }, a), a.$on("$destroy", function() {
            console.log("socket.io: destroy, " + v.deviceViewCtrlName), v.deviceViewCtrlName = null
        })
    })
}
/**/
function devCfgCommonCtrl(a, b, c, d, e) {
    function f() {
        c.devices.then(function(a) {
            return g.sharedVM.devicesList = a
        })
    }
    var g = this;
    g.sharedVM = b.devSharedVM, g.deviceCommonControllerName = "devCfgCommonCtrl", g.mgmtPort = 80, g.tunnelPort = 655, g.capabilities = {
        linking: {
            nameResolution: !0
        },
        resetToDefault: {
            options: [{
                name: "system",
                label: "Roles and Channels",
                isDefault: !0
            }]
        }
    }, g.sharedVM.devicesList = [], f(), c.subscribe(a, f), g.sharedVM.changeDevice = function(a) {
        g.sharedVM.device.device_id !== a && e.path(d.getSegmentUrl(d.name, {
            deviceId: a
        }))
    }
}
/**/
function devCfgBtnGroupCtrl(a, b, c, d) {
    function e() {
        d.getPortWarningsForDevice(i.sharedVM.device.device_id).then(function(a) {
            g = !!Object.keys(a).length, f()
        })
    }

    function f() {
        var a = c.getButton("Ports");
        a && (a.warning = g || h)
    }
    var g = !1,
        h = !1,
        i = this;
    i.sharedVM = b.devSharedVM, i.sharedVM.configButtons = c.getButtons, i.active = {
        button: c.getActive
    }, d.subscribe(a, e), e(), a.$watch(function(a) {
        return i.sharedVM.interfacesHaveWarning()
    }, function(a, b) {
        h = a, f()
    }), i.sharedVM.isSupportedByDeviceCapabilities = function(a) {
        return "Linking" === a ? i.sharedVM.deviceCapability.linking : "Network" === a ? i.sharedVM.deviceCapability.network : "Station" !== a || "FSII" === i.sharedVM.device.deviceType_name
    }
}
/**/
function deviceCfgGeneralCtrl(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D) {
    function E(a) {
        var b = [];
        return angular.forEach(a, function(a) {
            b.push(a)
        }), b
    }

    function F() {
        if (O.selectedGPIO.isGPO) {
            if (O.gpios.gpos) return O.gpios.gpos.filter(function(a) {
                return a.id === O.selectedGPIO.id
            })[0]
        } else if (O.gpios.gpis) return O.gpios.gpis.filter(function(a) {
            return a.id === O.selectedGPIO.id
        })[0];
        return null
    }

    function G(a, b) {
        var c = [];
        return angular.forEach(O.gpios.gpos, function(b) {
            angular.forEach(b.settings.events, function(b) {
                b.res !== a.res && c.push(b)
            })
        }), J(c)
    }

    function H(a, b) {
        var c, d, e = [];
        return "source" == b && (d = !1, c = !1, e.push(O.ports.filter(function(a) {
            return "SA" === a.port_config_type
        })[0])), "destination" == b && (d = !0, c = !0), J(e, d, c, !0, !0)
    }

    function I(a, b) {
        var c, d, e = [];
        return "source" == b && (d = !1, c = !1, e.push(O.ports.filter(function(a) {
            return "SA" === a.port_config_type
        })[0])), "destination" == b && (d = !0, c = !0), J(e, d, c, !0, !0)
    }

    function J(a, b, c, d, e) {
        void 0 === a && (a = []), void 0 === b && (b = !0), void 0 === c && (c = !0), void 0 === d && (d = !0), void 0 === e && (e = !0);
        var f = {};
        return b && (f.Channels = {
            labelField: "label",
            primaryKeyField: "res",
            value: E(O.connections).filter(function(b) {
                return a.findIndex(function(a) {
                    return a.res === b.res
                }) < 0
            }),
            sortField: "label"
        }), c && (f.Groups = {
            labelField: "label",
            primaryKeyField: "res",
            value: E(O.groups).filter(function(b) {
                return a.findIndex(function(a) {
                    return a.res === b.res
                }) < 0
            }),
            sortField: "label"
        }), d && (f.Roles = {
            labelField: "label",
            primaryKeyField: "res",
            value: E(O.roles).filter(function(b) {
                return a.findIndex(function(a) {
                    return a.res === b.res
                }) < 0 && !b.isDefault
            }),
            sortField: "label"
        }), e && (f.Ports = {
            labelField: "port_label",
            primaryKeyField: "res",
            value: E(O.ports).filter(function(b) {
                return a.findIndex(function(a) {
                    return a.res === b.res
                }) < 0 && "PGM" !== b.port_desc
            })
        }), f
    }

    function K(a) {
        function b(a) {
            return a = a.toString(), 1 == a.length ? "0" + a : a
        }
        var c = new Date;
        return a + "_" + b(c.getFullYear()) + "-" + b(c.getMonth() + 1) + "-" + b(c.getDate())
    }

    function L() {
        var a = new Date;
        return 1e3 * (3600 * (23 - a.getHours()) + 60 * (59 - a.getMinutes()) + (60 - a.getSeconds()) + 1)
    }

    function M() {
        var a = "";
        O.sharedVM.device && ("FSII" === O.sharedVM.device.deviceType_name ? a = "FSII_" : "HMS-4X" === O.sharedVM.device.deviceType_name ? 0 !== O.sharedVM.device.device_label.indexOf("HMS") && (a = "HMS_") : a = "LQ_"), O.backupName = K(a + O.sharedVM.device.device_label), Q = n(M, L())
    }

    function N() {
        y.gpos.then(function(a) {
            O.gpios.gpos = a, O.RefreshSelectedGPIO()
        }), y.gpis.then(function(a) {
            O.gpios.gpis = a, O.RefreshSelectedGPIO()
        })
    }
    var O = this;
    O.sharedVM = b.devSharedVM, O.root = b, O.gpios = {}, O.openGuide = function() {
        q.openGuide("devGeneral")
    }, a.$on("$destroy", function() {
        q.cleanupGuide()
    });
    var P, Q;
    O.controllerName = "deviceCfgGeneralCtrl", b.helpUrl = "help/Content/Terminator/CCM/Context%20sensitive/general.htm", O.clientInfoService = l, O.linkGroupCapabilities = A, x.subscribe(a, function() {
        return x.linkGroupCapabilities.then(function(a) {
            return O.linkGroupCapabilities = a
        })
    }), O.connections = s.filterConnections(B, "partyline", "res"), O.groups = s.filterConnections(B, "group", "res"), t.rolesFromServer.then(function(a) {
        O.roles = a
    }), u.ports.then(function(a) {
        O.ports = a
    }), O.changePassword = "1" === g.$routeParams.changePassword, O.wbsDateTime = "", O.showUpgrade = !1, O.showWireless = !0, O.upgradeComplete = !1, O.backupInProgress = !1, O.generalErrorTitle = "", O.generalErrorInfo = "", O.goodResponse = "", O.successSyncDateTime = "", O.changePasswordSettings = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }, O.monitoringChoices = [{
        value: "0",
        text: "Off"
    }, {
        value: "1",
        text: "Port A"
    }, {
        value: "2",
        text: "Port B"
    }], O.sharedVM.setDefaultLiveStatus(), O.hasLinkGroupRoleCapability = function(a) {
        return O.linkGroupCapabilities.roles && !!O.linkGroupCapabilities.roles.find(function(b) {
            return b.type === a
        })
    }, O.showDotted = function(a) {
        for (var b = "", c = 0; c < a.length; c++) b += "*";
        return b
    }, O.startOTA = function() {
        O.goodResponse = "", k.startOTA({
            version: "1",
            deviceId: O.sharedVM.device.device_id,
            action: "otastate"
        }, {
            OTAState: 1
        }, function(a) {
            O.goodResponse = i("Over the air registration is now opened for 2 minutes. The 2 minute timer resets after every successful registration. You can now begin pairing beltpacks with the base station.")
        }, function(a) {
            O.generalErrorTitle = i("Failed to start OTA registration."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.updateAdminPIN = function() {
        j.update({
            version: "1",
            deviceId: O.sharedVM.device.device_id
        }, {
            adminPin: O.sharedVM.device.device_settings.adminPin
        }, function(a) {}, function(a) {
            O.generalErrorTitle = i("Failed to modify administration code."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.validateWirelessSystemId = function(a) {
        return this.sharedVM.device.device_settings.wirelessId.toUpperCase() !== a.toUpperCase() && 3 === a.length
    }, O.updateWirelessSystemId = function() {
        var a = i("Changing the systems wireless id will result in all beltpacks needing to be reregsitered with the system. \n\nIn addition your system will be restarted and all audio will be lost."),
            b = i("Are you sure you want to perform this action?");
        o("sm", a, b, i("Okay"), i("Cancel"), function(a) {
            a ? j.update({
                version: "1",
                deviceId: O.sharedVM.device.device_id
            }, {
                wirelessId: O.sharedVM.device.device_settings.wirelessId
            }, function(a) {}, function(a) {
                O.generalErrorInfo = i("Failed to update the wireless system id."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
            }) : O.sharedVM.getDevice()
        })
    }, O.updateOTAPIN = function() {
        j.update({
            version: "1",
            deviceId: O.sharedVM.device.device_id
        }, {
            otaPin: O.sharedVM.device.device_settings.otaPin
        }, function(a) {}, function(a) {
            O.generalErrorTitle = i("Failed to update OTA code."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.applyPassword = function() {
        var a = {
            oldPassword: O.changePasswordSettings.oldPassword,
            newPassword: O.changePasswordSettings.newPassword
        };
        v.UpdatePassword("admin", a).then(function(a) {
            a.status && 200 != a.status ? (O.generalErrorTitle = i("Failed to modify password."), O.generalErrorInfo = a.message) : (O.changePasswordSettings.oldPassword = O.changePasswordSettings.newPassword = O.changePasswordSettings.confirmPassword = "", O.changePassword ? window.location.assign(window.location.protocol + "//" + window.location.host + "/") : window.location.reload(!0))
        })["catch"](function(a) {
            O.generalErrorTitle = i("Failed to modify password."), O.generalErrorInfo = a.message
        })
    }, O.cancelPassword = function() {
        O.changePasswordSettings.oldPassword = O.changePasswordSettings.newPassword = O.changePasswordSettings.confirmPassword = ""
    }, O.comparePasswords = function() {
        var a;
        return O.changePasswordSettings.newPassword && O.changePasswordSettings.confirmPassword && O.changePasswordSettings.newPassword != O.changePasswordSettings.confirmPassword && (a = "Password mismatch"), a
    }, O.getRoleLabel = function() {
        return O.sharedVM.device.role && !O.sharedVM.device.role.isDefault ? O.sharedVM.device.role.label : "Local Config"
    }, O.changeRole = function() {
        O.roleError = null;
        var a = i("Change Role"),
            b = [];
        b.push(O.sharedVM.device.role ? O.sharedVM.device.role.id : 0), t.roles.then(function(c) {
            for (var e = 0, f = c; e < f.length; e++) {
                var g = f[e];
                g.isDefault && (g.label = "Local Config")
            }
            var h = d.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: function() {
                        return {
                            title: a,
                            messages: "",
                            connectables: {
                                Roles: {
                                    primaryKeyField: "id",
                                    labelField: "label",
                                    value: c.filter(function(a) {
                                        return a.type == O.sharedVM.device.deviceType_name
                                    }).sort(function(a, b) {
                                        return a.isDefault ? 1 : a.label < b.label ? -1 : a.label > b.label ? 1 : 0
                                    })
                                }
                            },
                            assigned: b
                        }
                    }
                }
            });
            h.result.then(function(a) {
                for (var b = !1, d = function(a) {
                        O.sharedVM.device.role = c.find(function(b) {
                            return b.id == a
                        }), b = !0
                    }, e = 0, f = a.selected; e < f.length; e++) {
                    var g = f[e];
                    d(g)
                }
                b && w.changeEndpointRole(O.sharedVM.device.device_id, 0, O.sharedVM.device.role.id)["catch"](function(a) {
                    a.data && a.data.message ? O.roleError = a.data.message : O.roleError = i("No response from the server.")
                })
            }, function() {})
        })
    };
    var R = function() {
        k.reboot({
            version: "1",
            deviceId: O.sharedVM.device.device_id,
            action: "audiomonitor"
        }, {
            monitoring: O.sharedVM.device.device_liveStatus.monitoring
        }, function(a) {
            O.sharedVM.device.isHost
        }, function(a) {
            alert("error: " + a)
        })
    };
    O.setMonitoring = function() {
        R()
    }, O.showMonitoring = function(a) {
        var b = f("filter")(O.monitoringChoices, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : i("Not set")
    }, O.updateLicensePasscode = function() {
        O.licenseError = null, k.updateLicensePasscode({
            version: "2",
            deviceId: O.sharedVM.device.device_id,
            action: "license"
        }, {
            licensePasscode: O.sharedVM.device.licensePasscode
        }, function(a) {
            O.sharedVM.device.licensedFeatures = a.licensedFeatures
        }, function(a) {
            a.data && a.data.message ? (O.licenseError = a.data.message, O.sharedVM.getDevice()) : O.licenseError = i("No response from the server.")
        })
    }, O.getLicensedFeatures = function() {
        if (O.sharedVM.device.licensedFeatures) {
            var a = {
                "24Channels": i("24 Channels"),
                "25Beltpacks": i("25 Wireless Beltpacks"),
                "5Beltpacks": i("5 Wireless Beltpacks")
            };
            return O.sharedVM.device.licensedFeatures.map(function(b) {
                return a[b.name] || b.name
            }).join(", ")
        }
        return ""
    }, O.updateLabel = function() {
        j.update({
            version: "1",
            deviceId: O.sharedVM.device.device_id
        }, {
            label: O.sharedVM.device.device_label
        }, function(a) {}, function(a) {
            O.generalErrorTitle = i("Failed to modify label."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.resetToDefault = function() {
        var a = "",
            c = "",
            d = "",
            f = void 0,
            g = 80;
        O.sharedVM.device.deviceType_name.indexOf("HMS") >= 0 ? (a = i("This action will result in the resetting of ALL Role, Channel and Account information for the entire Link-Group.\n\nNetwork settings for this device will NOT be reset but can be reset using the Front Panel menu."), c = i("Resetting roles, channels and accounts to factory defaults..."), d = i("Are you sure you want to proceed with this action on '" + O.sharedVM.device.device_label + "' ?"), g = 5) : (a = i("Are you sure you want to reset all settings on") + " '" + O.sharedVM.device.device_label + "' ?", c = i("Resetting device settings to factory defaults..."), d = "", f = O.sharedVM.device.device_id), o("sm", a, d, i("Reset"), i("Cancel"), function(a) {
            a && (b.userActionInProgress = !0, e.path("/view/devices"), k.resetToDefault({
                version: "1",
                deviceId: f,
                action: "resettodefault",
                network: "keep"
            }, {}, function(a) {
                O.showModalProgress("sm", c, g, function() {
                    window.location.reload(!0), b.userActionInProgress = !1
                }, !0)
            }, function(a) {}))
        })
    }, O.setDateTime = function() {
        O.successSyncDateTime = "", k.setDateTime({
            version: "1",
            deviceId: O.sharedVM.device.device_id,
            action: "setDateTime"
        }, {
            dateTime: new Date
        }, function(a) {
            O.successSyncDateTime = i("Base station date and time are up to date.")
        }, function(a) {
            O.generalErrorTitle = i("Failed to set date and time on base station."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.getDateTime = function() {
        k.getDateTime({
            version: "1",
            deviceId: O.sharedVM.device.device_id,
            action: "getDateTime"
        }, {}, function(a) {
            if (a) {
                O.wbsDateTime = a.wbsDateTime;
                var b = (new Date).getTime(),
                    c = new Date(O.wbsDateTime).getTime();
                Math.abs(b - c) > 9e5 && (O.generalErrorTitle = i("Date/Time on base station is not synchronized with the browser."), O.generalErrorInfo = i('Go into "Maintenance" (current web page) and click on "Sync Clock" button.'))
            }
        }, function(a) {
            O.generalErrorTitle = i("Failed to get date and time from base station."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.backupTimer = function() {
        O.backupInProgress = !0, r.backupFile(O.backupName).then(function(a) {
            h.saveAs(a.blob, a.fileName), O.backupInProgress = !1
        })["catch"](function(a) {
            O.backupInProgress = !1, O.generalErrorTitle = i("Failed to get generated backup file."), O.generalErrorInfo = a.message
        })
    }, O.reboot = function() {
        var a = i("Are you sure you want to REBOOT") + " '" + O.sharedVM.device.device_label + "' ?",
            c = "";
        o("sm", a, c, i("Reboot"), i("Cancel"), function(a) {
            a && (b.userActionInProgress = !0, e.path("/view/devices"), k.reboot({
                version: "1",
                deviceId: O.sharedVM.device.device_id,
                action: "reboot"
            }, {}, function(a) {
                if (O.sharedVM.device.isHost) {
                    var c = i("Please wait while the device reboots..."),
                        d = 60;
                    O.showModalProgress("sm", c, d, function() {
                        e.path("/view/devices"), window.location.reload(!0), b.userActionInProgress = !1
                    }, !0)
                }
            }, function(a) {}))
        })
    }, O.snapshot = function() {
        var a = i("Click Continue to create a downloadable archive containing all logging and configuration information."),
            b = "";
        o("sm", a, b, i("Continue"), i("Cancel"), function(a) {
            a && (O.snapshotStatus = "", k.snapshot({
                version: "1",
                deviceId: O.sharedVM.device.device_id,
                action: "snapshot"
            }, {}, function(a) {
                O.sharedVM.device.isHost && (O.snapshotStatus = i("Preparing support info archive..."), P = n(T, 1e3))
            }, function(a) {
                console.log("CreateSnapshot(): ", a.data.message)
            }))
        })
    }, M(), O.showModalProgress = function(a, b, c, e, f) {
        var g = d.open({
            templateUrl: "views/dialogs/progress.html",
            controller: "ModalInstanceProgressCtrl",
            backdrop: "static",
            placement: "bottom",
            animation: "am-flip-x",
            size: a,
            resolve: {
                modalMessage: function() {
                    return [b]
                },
                seconds: function() {
                    return c
                }
            }
        });
        g.result.then(function() {
            e && e(1)
        }, function() {
            e(2)
        }, function() {
            e(3)
        });
        var h;
        g.closed.then(function() {
            h && p().then(function(a) {
                a.off("reconnect", h)
            })
        }), f && p().then(function(a) {
            h = a.on("reconnect", function() {
                g.close()
            })
        })
    }, O.restoreMessage = "", O.restoreSuccess = !0, O.backupUploader = new m({
        alias: "file",
        url: "/api/2/devices/restore",
        autoUpload: !0,
        removeAfterUpload: !0
    }), O.restoreDisabled = !1, O.restoreCaption = i("Restore");
    var S = O.backupUploader;
    S.onBeforeUploadItem = function(a) {
        O.restoreMessage = "", O.restoreSuccess = !0, O.restoreDisabled = !0, O.restoreCaption = i("Restoring...")
    }, S.onSuccessItem = function(a, b, c, d) {
        O.restoreMessage = "Successfully restored roles and channels.", O.restoreSuccess = !0, O.restoreDisabled = !1, O.restoreCaption = i("Restore")
    }, S.onCancelItem = function(a, b, c, d) {
        O.restoreMessage = "", O.restoreSuccess = !1, O.restoreDisabled = !1, O.restoreCaption = i("Restore")
    }, S.onErrorItem = function(a, b, c, d) {
        b.message ? O.restoreMessage = b.message : O.restoreMessage = "An unexpected error occured during the restore.", O.restoreSuccess = !1, O.restoreDisabled = !1, O.restoreCaption = i("Restore")
    };
    var T = function() {
        k.snapshotinfo({
            version: "1",
            deviceId: O.sharedVM.device.device_id,
            action: "snapshotinfo"
        }, {}, function(a) {
            O.snapshotStatus = i("Preparing support info archive... (" + a.percentComplete + "%)"), 100 != a.percentComplete ? P = n(T, 1e3) : (O.snapshotName = K("snapshot_" + O.sharedVM.device.device_label), O.snapshotUrl = a.url)
        }, function(a) {})
    };
    a.$on("$destroy", function(a) {
        n.cancel(P), n.cancel(Q)
    }), O.updateDspPlcState = function() {
        j.update({
            version: "1",
            deviceId: O.sharedVM.device.device_id
        }, {
            dspPlcState: O.sharedVM.device.device_settings.dspPlcState
        }, function(a) {}, function(a) {
            O.generalErrorTitle = i("Failed to change DSP PLC state."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.dspPlcStateValues = [{
        value: "Disabled",
        text: i("Disabled")
    }, {
        value: "Enabled",
        text: i("Enabled")
    }], O.updateBatteryType = function() {
        j.update({
            version: "1",
            deviceId: O.sharedVM.device.device_id
        }, {
            aaBatteryType: O.sharedVM.device.device_settings.aaBatteryType
        }, function(a) {}, function(a) {
            O.generalErrorTitle = i("Failed to modify AA Battery Type."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.aaBatteryTypeFSIIValues = [{
        value: "Alkaline",
        text: i("Alkaline")
    }, {
        value: "NiMH",
        text: i("NiMH")
    }], O.updateRoleSorting = function() {
        j.update({
            version: "1",
            deviceId: O.sharedVM.device.device_id
        }, {
            roleSorting: O.sharedVM.device.device_settings.roleSorting
        }, function(a) {}, function(a) {
            O.generalErrorTitle = i("Failed to modify role sorting."), a.data && a.data.message ? (O.generalErrorInfo = a.data.message, O.sharedVM.getDevice()) : O.generalErrorInfo = i("No response from the server.")
        })
    }, O.roleSortingFSIIValues = [{
        value: "RoleNumber",
        text: i("Role Number")
    }, {
        value: "Alphabetical",
        text: i("Alphabetical")
    }], O.gpioTriggerValues = [{
        value: "talk",
        text: i("Talk-Only")
    }, {
        value: "talklisten",
        text: i("Talk & Listen")
    }, {
        value: "call",
        text: i("Call")
    }], O.selectedGPIO = {
        id: null,
        isGPO: null,
        events: null
    }, O.networkEventActionTypes = [{
        value: "xpt",
        text: i("Xpt")
    }, {
        value: "gpo",
        text: i("GPO")
    }, {
        value: "call",
        text: i("Call")
    }], O.getDisplayTextFromValue = function(a, b, c, d) {
        c || (c = "text"), d || (d = "value");
        var e = f("filter")(b, (g = {}, g[d] = a, g), !0);
        return "undefined" != typeof e && null !== e ? angular.isDefined(a) && e.length ? e[0][c] : i("Not set") : "undefined";
        var g
    }, O.getDeviceStatus = function() {
        return O.sharedVM.getDeviceStatus()
    }, O.newNetworkEvent = function() {
        O.pendingNetworkEvent = {
            id: 0,
            sourceRes: null,
            destinationRes: null,
            action: {
                type: "call",
                details: {
                    sourceRes: null,
                    destinationRes: null,
                    gpoId: 0
                }
            }
        }
    }, O.removeNetworkEvent = function(a) {
        z.removeNetworkEvent(O.sharedVM.device.device_id, a).then(function(b) {
            O.sharedVM.device.device_settings.events.filter(function(b) {
                return b.id !== a
            })
        })
    }, O.updateNetworkEventActionType = function(a) {
        z.updateNetworkEvent(O.sharedVM.device.device_id, a)
    }, O.updateNetworkEventActionGPO = function(a) {
        z.updateNetworkEvent(O.sharedVM.device.device_id, a)
    }, O.saveNetworkEventAdd = function() {
        O.sharedVM.device.device_settings.events || (O.sharedVM.device.device_settings.events = []), z.addNetworkEvent(O.sharedVM.device.device_id, O.pendingNetworkEvent).then(function(a) {
            O.sharedVM.device.device_settings.events.push(O.pendingNetworkEvent), O.pendingNetworkEvent = null
        })
    }, O.cancelNetworkEventAdd = function() {
        O.pendingNetworkEvent = null
    }, O.changeNetworkEventEntity = function(a, b, c) {
        var e = "source" == b ? a.sourceRes : a.destinationRes,
            f = [],
            g = !0,
            h = !0,
            i = "Network Event Destination Assignment";
        "source" == b && (f.push(O.ports.filter(function(a) {
            return "SA" === a.port_config_type
        })[0]), i = "Network Event Source Assignment");
        var j = {
                title: i,
                messages: "Select an item to assign to Logic Input ",
                connectables: J(f, g, h, !0, !0),
                assigned: [e],
                allowMultipleSelections: !1,
                requireMultipleSelections: !1
            },
            k = d.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: j
                }
            });
        k.result.then(function(d) {
            d.selected[0] ? ("source" == b && (a.sourceRes = d.selected[0]), "destination" == b && (a.destinationRes = d.selected[0])) : ("source" == b && (a.sourceRes = "Unassigned"), "destination" == b && (a.destinationRes = "Unassigned")), c && z.updateNetworkEvent(O.sharedVM.device.device_id, a)
        })
    }, O.changeNetworkEventCrosspoint = function(a, b, c) {
        var e = a.action.details.destinationRes,
            f = "Network Event Crosspoint Destination Assignment";
        "source" == b && (f = "Network Event Crosspoint Source Assignment");
        var g = {
                title: f,
                messages: "Select an item to assign to Logic Input ",
                connectables: I(a, b),
                assigned: [e],
                allowMultipleSelections: !1,
                requireMultipleSelections: !1
            },
            h = d.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: g
                }
            });
        h.result.then(function(d) {
            d.selected[0] ? ("source" == b && (a.action.details.sourceRes = d.selected[0]), "destination" == b && (a.action.details.destinationRes = d.selected[0])) : ("source" == b && (a.action.details.sourceRes = "Unassigned"), "destination" == b && (a.action.details.destinationRes = "Unassigned")), c && z.updateNetworkEvent(O.sharedVM.device.device_id, a)
        })
    }, O.getEntityNameFromEntityRes = function(a) {
        if (O.connections[a]) return O.connections[a].label;
        if (O.groups[a]) return O.groups[a].label;
        if (O.roles) {
            var b = O.roles.find(function(b) {
                return b.res === a
            });
            if (b) return b.label
        }
        if (O.ports) {
            var c = O.ports.find(function(b) {
                return b.res === a
            });
            if (c) return c.port_label
        }
        return "Unassigned"
    }, O.newGPIOEvent = function(a) {
        O.pendingGPIOEvent = {
            res: "Unassigned",
            targetAction: "talk"
        }
    }, O.cancelGPIOEventAdd = function(a) {
        O.pendingGPIOEvent = null
    }, O.changeGPIEntity = function(a, b, c) {
        var e = "Logic Input Destination Assignment ";
        "source" == b && (e = "Logic Input Source Assignment ");
        var f = {
                title: e,
                messages: "Select an item to assign to Logic Input ",
                connectables: H(a, b),
                assigned: [a[b]],
                allowMultipleSelections: !1,
                requireMultipleSelections: !1
            },
            g = d.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: f
                }
            });
        g.result.then(function(d) {
            d.selected[0] ? a[b] = d.selected[0] : a[b] = "Unassigned", c && y.updateGPIEvent(O.sharedVM.device.device_id, O.selectedGPIO.id, a.id, a)
        })
    }, O.changeGPOEntity = function(a, b, c) {
        var e = this,
            f = {
                title: "Logic Output Key Target Assignment ",
                messages: "Select an item to assign to Logic Output ",
                connectables: G(a, c),
                assigned: [a.res],
                allowMultipleSelections: !1,
                requireMultipleSelections: !1
            },
            g = d.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: f
                }
            });
        g.result.then(function(c) {
            c.selected[0] ? (e.isSAKey(c.selected[0]) && (a.action = "talk"), a.res = c.selected[0]) : a.res = "Unassigned", b && y.updateGPOEvent(O.sharedVM.device.device_id, O.selectedGPIO.id, a.id, a)
        })
    }, O.filterGPIOTriggerValues = function(a) {
        var b = this.gpioTriggerValues;
        return this.isSAKey(a.res) && (b = f("filter")(this.gpioTriggerValues, {
            value: "talk"
        }, !0)), b
    }, O.isSAKey = function(a) {
        var b = this.ports.find(function(b) {
            return b.res === a
        });
        return !(!b || "SA" !== b.port_desc)
    }, O.updateGPIOLabel = function() {
        var a = {
            label: O.selectedGPIO.label
        };
        O.selectedGPIO.isGPO ? y.updateGPO(O.sharedVM.device.device_id, O.selectedGPIO.id, a) : y.updateGPI(O.sharedVM.device.device_id, O.selectedGPIO.id, a)
    }, O.SelectGPIO = function(a, b) {
        O.selectedGPIO.id = a.id, O.selectedGPIO.isGPO = b;
        var c = F();
        c && (O.selectedGPIO.events = c.settings.events, O.selectedGPIO.label = c.label)
    }, O.RefreshSelectedGPIO = function() {
        var a = F();
        a ? (O.selectedGPIO.events = a.settings.events, O.selectedGPIO.label = a.label) : O.SelectGPIO({
            id: 0
        }, !1)
    }, O.getGpioState = function(a, b) {
        if (O.gpios) {
            var c = O.gpios.find(function(c) {
                return c.type === b && c.id === a
            });
            return !(!c || !c.liveStatus) && c.liveStatus.status
        }
        return !1
    }, O.GPIOIsSelected = function(a, b) {
        return O.selectedGPIO.id === a && O.selectedGPIO.isGPO === b
    }, O.updateGPOAction = function(a) {
        var b = {
            action: a.action
        };
        y.updateGPOEvent(O.sharedVM.device.device_id, O.selectedGPIO.id, a.id, b)
    }, O.removeGPOEvent = function(a) {
        y.removeGPOEvent(O.sharedVM.device.device_id, O.selectedGPIO.id, a.id).then(function(a) {})
    }, O.saveGPOEventAdd = function(a) {
        if ("Unassigned" !== O.pendingGPIOEvent.res) {
            var b = {
                res: O.pendingGPIOEvent.res,
                action: O.pendingGPIOEvent.targetAction
            };
            y.addGPOEvent(O.sharedVM.device.device_id, O.selectedGPIO.id, b).then(function(a) {})
        }
        O.pendingGPIOEvent = null
    }, O.removeGPIEvent = function(a) {
        y.removeGPIEvent(O.sharedVM.device.device_id, O.selectedGPIO.id, a.id).then(function(a) {})
    }, O.saveGPIEventAdd = function(a) {
        if ("Unassigned" !== O.pendingGPIOEvent.source && "Unassigned" !== O.pendingGPIOEvent.destination) {
            var b = {
                source: O.pendingGPIOEvent.source,
                destination: O.pendingGPIOEvent.destination
            };
            y.addGPIEvent(O.sharedVM.device.device_id, O.selectedGPIO.id, b).then(function(a) {})
        }
        O.pendingGPIOEvent = null
    }, y.subscribe(a, function() {
        return N()
    }), N(), O.getDateTime()
}
/**/
function deviceCfgSettingsCtrl(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    function p(a) {
        var b = "",
            c = [];
        return angular.forEach(a, function(a) {
            var b = a.res;
            angular.forEach(v.connections, function(a) {
                a.res === b && c.push(a.label)
            }), angular.forEach(v.groups, function(a) {
                a.res === b && c.push(a.label)
            }), angular.forEach(v.roles, function(a, d) {
                a.res === b && c.push(a.label)
            }), angular.forEach(v.ports, function(a, d) {
                d === b && c.push(a.port_label)
            })
        }), b = c.map(function(a, b) {
            return a
        }).join(", ")
    }

    function q(a) {
        v.roles = {}, v.roles = w(a, "type", "label")
    }

    function r(a) {
        return a.find(function(a) {
            return "HS" === a.port_desc
        })
    }

    function s() {
        j.currentDevicePorts.then(function(a) {
            v.headsetPort = r(a)
        })
    }

    function t() {
        h.connections.then(function(a) {
            v.connections = h.filterConnections(a, "partyline", "res"), v.groups = h.filterConnections(a, "group", "res")
        })
    }

    function u() {
        k.endpoints.then(function(a) {
            v.endpoints = a
        })
    }
    var v = this;
    v.sharedVM = b.devSharedVM, v.root = b, v.openGuide = function() {
        l.openGuide("devStation")
    }, v.controllerName = "deviceCfgSettingsCtrl", v.selectedKey = 0, v.connections = h.filterConnections(m, "partyline", "res"), v.groups = h.filterConnections(m, "group", "res"), u(), v.headsetPort = r(n), v.indexSelectedKey = 0, v.headsetMicTypeValues = [{
        value: "automatic",
        text: e("Automatic")
    }, {
        value: "electret",
        text: e("Electret (-15dB)")
    }, {
        value: "dynamic_10",
        text: e("Dynamic (-15dB)")
    }, {
        value: "dynamic_0",
        text: e("Dynamic (0dB)")
    }], v.sidetoneGains = [{
        value: 0,
        text: e("0 dB")
    }, {
        value: -6,
        text: e("- 6 dB")
    }, {
        value: -12,
        text: e("- 12 dB")
    }, {
        value: -18,
        text: e("- 18 dB")
    }], v.sidetoneControlValues = [{
        value: "tracking",
        text: e("Tracking")
    }, {
        value: "non-tracking",
        text: e("Non-Tracking")
    }, {
        value: "disabled",
        text: e("Disabled")
    }], v.headphoneLimitValues = [{
        value: 24,
        text: e("OFF")
    }, {
        value: 6,
        text: e("+ 6 dB")
    }, {
        value: 0,
        text: e("0 dB")
    }, {
        value: -6,
        text: e("- 6 dB")
    }], v.keysetTalkBtnMode = [{
        value: "latching",
        text: e("Latching")
    }, {
        value: "non-latching",
        text: e("Non-Latching")
    }, {
        value: "disabled",
        text: e("Disabled")
    }], v.keyActivationState = [{
        value: "talk",
        text: e("Talk")
    }, {
        value: "listen",
        text: e("Listen")
    }, {
        value: "talklisten",
        text: e("Talk & Listen")
    }, {
        value: "forcelisten",
        text: e("Force Listen")
    }, {
        value: "talkforcelisten",
        text: e("Talk & Force Listen")
    }], v.antennaPortTypes = [{
        value: "rj45",
        text: e("RJ45")
    }, {
        value: "fiber",
        text: e("Fiber")
    }], v.showHeadsetLimit = function(a) {
        var b = d("filter")(v.headphoneLimitValues, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : e("Not set")
    }, v.showHeadsetSidetoneGain = function(a) {
        var b = d("filter")(v.sidetoneGains, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : e("Not set")
    }, v.showHeadsetMicType = function(a) {
        var b = d("filter")(v.headsetMicTypeValues, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : e("Not set")
    }, v.showHeadsetSidetoneCtrl = function(a) {
        var b = d("filter")(v.sidetoneControlValues, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : e("Not set")
    }, v.showKeysetTalkBtnMode = function(a) {
        var b = d("filter")(v.keysetTalkBtnMode, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : e("Not set")
    }, v.showKeyActivationState = function(a) {
        var b = d("filter")(v.keyActivationState, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : e("Not set")
    }, v.getKeyAssignment = function(a) {
        var b = "";
        return a && (b = p(a.connections), 0 === a.connections.length && (b = e("Unassigned"), b = e(3 == a.keysetIndex && a.isReplyKey ? "REPLY" : "Unassigned"))), b
    }, v.getKeysetWithIndex = function(a) {
        if (v.device)
            for (var b = 0; b < v.sharedVM.device.device_settings.keysets.length; b++)
                if (v.sharedVM.device.device_settings.keysets[b].keysetIndex == a) return v.sharedVM.device.device_settings.keysets[b]
    };
    var w = function(a, b, c) {
        return a.sort(function(a, d) {
            return f.naturalSort(a[b] + "." + a[c], d[b] + "." + d[c])
        })
    };
    v.filterTalkBtnMode = function() {
        var a = v.keysetTalkBtnMode;
        if (angular.isUndefined(v.sharedVM.device)) return a;
        var b = v.getKeysetWithIndex(v.indexSelectedKey);
        if (b.connections && b.connections.length > 0) switch (b.activationState) {
            case "talk":
            case "talklisten":
            case "talkforcelisten":
                a = d("filter")(v.keysetTalkBtnMode, {
                    value: "!disabled"
                });
                break;
            case "forcelisten":
                a = d("filter")(v.keysetTalkBtnMode, {
                    value: "disabled"
                });
                break;
            case "listen":
                a = d("filter")(v.keysetTalkBtnMode, {
                    value: "latching"
                }, !0)
        } else a = d("filter")(v.keysetTalkBtnMode, {
            value: "disabled"
        });
        return a.length > 0 && 0 === d("filter")(a, {
            value: b.talkBtnMode
        }, !0).length && (b.talkBtnMode = a[0].value), a
    }, v.updateKeysets = function() {
        g.update({
            version: "1",
            deviceId: v.sharedVM.device.device_id
        }, {
            keysets: v.sharedVM.device.device_settings.keysets
        }, function(a) {}, function(a) {})
    }, v.showAntennaPortType = function(a) {
        var b = d("filter")(v.antennaPortTypes, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : e("Not set")
    }, v.updateAntennaPorts = function() {
        g.update({
            version: "1",
            deviceId: v.sharedVM.device.device_id
        }, {
            antennaPorts: v.sharedVM.device.device_settings.antennaPorts
        }, function(a) {}, function(a) {})
    }, v.showGroupsAssignment = function() {
        var a = [];
        angular.forEach(v.sharedVM.device.device_settings.groups, function(b) {
            var c = v.groups[b.res];
            c && a.push(c.res)
        });
        var b = [];
        angular.forEach(v.groups, function(a, c) {
            b.push(a)
        });
        var d = {
                title: "Groups",
                connectables: {
                    Groups: {
                        labelField: "label",
                        primaryKeyField: "res",
                        value: b,
                        sortField: "label"
                    }
                },
                assigned: a,
                allowMultipleSelections: !0
            },
            e = c.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: d
                }
            });
        e.result.then(function(a) {
            var b = [];
            a.selected.sort().map(function(a) {
                b.push({
                    res: a
                })
            }), v.sharedVM.device.device_settings.groups = b, g.update({
                version: "1",
                deviceId: v.sharedVM.device.device_id
            }, {
                groups: v.sharedVM.device.device_settings.groups
            }, function(a) {}, function(a) {})
        })
    }, v.getGroupsAssignment = function() {
        return v.sharedVM.device.device_settings.groups && 0 !== v.sharedVM.device.device_settings.groups.length ? p(v.sharedVM.device.device_settings.groups) : e("Unassigned")
    }, v.filterKeyActivationState = function() {
        var a = [];
        if (angular.isUndefined(v.sharedVM.device)) return a;
        var b = v.getKeysetWithIndex(v.indexSelectedKey);
        return b.isReplyKey ? a = d("filter")(v.keyActivationState, {
            value: "talk"
        }, !0) : b.connections && b.connections.length > 0 ? a = v.keyActivationState : b.ports && b.ports.length > 0 && (a = v.keyActivationState), a.length > 0 && 0 === d("filter")(a, {
            value: b.activationState
        }, !0).length && (b.activationState = a[0].value), a
    }, v.updateHeadsetSideToneGain = function() {
        j.updatePort(v.headsetPort.port_id, {
            sidetoneGain: v.headsetPort.port_settings.sidetoneGain
        })
    }, v.updateHeadsetLimit = function() {
        j.updatePort(v.headsetPort.port_id, {
            headphoneLimit: v.headsetPort.port_settings.headphoneLimit
        })
    }, v.updateHeadsetSideToneCtrl = function() {
        j.updatePort(v.headsetPort.port_id, {
            sidetoneControl: v.headsetPort.port_settings.sidetoneControl
        })
    }, v.updateHeadsetMicType = function() {
        j.updatePort(v.headsetPort.port_id, {
            headsetMicType: v.headsetPort.port_settings.headsetMicType
        })
    }, h.subscribe(a, function() {
        return t()
    }), j.subscribe(a, function() {
        return s()
    }), q(o), i.subscribe(a, function() {
        i.roles.then(function(a) {
            return q
        })
    }), k.subscribe(a, function() {
        return u()
    }), v.indexSelectedKey = 0, v.showFSIIAntennaCableLengths = function(a) {
        var b = null,
            d = a[0];
        angular.forEach(v.devices, function(a) {
            a.device_id === d.device_id && (b = a)
        });
        var e = c.open({
            templateUrl: "views/dialogs/FSIIAntennaCableLengths.html",
            controller: "FSIIAntennaCableLengthsCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                options: function() {
                    return {
                        endpoints: a,
                        device: b
                    }
                }
            }
        });
        e.result.then(function() {}, function() {})
    }
}
/**/
function deviceCfgNetworkCtrl(a, b, c, d, e, f, g, h, i) {
    var j = this;
    j.root = b, j.sharedVM = b.devSharedVM, j.openGuide = function() {
        h.openGuide("devNetwork")
    }, a.$on("$destroy", function() {
        h.cleanupGuide()
    }), j.controllerName = "deviceCfgNetworkCtrl", b.helpUrl = "help/Content/Terminator/CCM/Context%20sensitive/network.htm", j.regexIpAddr = "^(([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))\\.){3}([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))$", j.regexNetmask = "^(([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))\\.){3}([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))$", j.regexPort = "^\\d{1,5}$", j.patternIpAddr = "[0-255].[0-255].[0-255].[0-255]", j.patternNetmask = "[0-255].[0-255].[0-255].[0-255]", j.goodResponse = "", j.warningResponse = "", j.errorResponse = "", j.required_string = e("Required"), j.empty_string = e("Not set"), j.invalidIpMessage = null, j.invalidNetmaskMessage = null, j.invalidExternalIpMessage = null, j.editing = {}, j.sharedVM.device.device_settings || (j.sharedVM.device.device_settings = {}), j.sharedVM.device.device_settings.network || (j.errorResponse = "Cannot retrieve network settings!", j.sharedVM.device.device_settings.network = {
        mode: "none",
        staticIP: "",
        netmask: "",
        gateway: "",
        dns1: "",
        dns2: "",
        extip: "",
        extport: 0
    }), j.net = angular.copy(j.sharedVM.device.device_settings.network), j.editingNetworkSettings = !1, i.linkGroupCapabilities.then(function(a) {
        j.linkGroupCapabilities = a
    }), i.subscribe(a, function() {
        return j.linkGroupCapabilities = i.linkGroupCapabilities
    });
    var k = function() {
            j.editingNetworkSettings = !1, j.invalidIpMessage = null, j.invalidNetmaskMessage = null, j.invalidExternalIpMessage = null, j.errorResponse = ""
        },
        l = function() {
            k()
        };
    a.$watch(function(a) {
        return j.sharedVM.device.device_settings.network
    }, function(a, b) {
        !j.editingNetworkSettings && j.sharedVM.device.device_settings.network && angular.copy(j.sharedVM.device.device_settings.network, j.net)
    }, !0), a.$watch(function(a) {
        return j.net
    }, function(a, b) {
        return j.goodResponse = "", j.warningResponse = "", j.errorResponse = "", angular.equals(j.sharedVM.device.device_settings.network, a) ? void k() : void(j.editingNetworkSettings = !0)
    }, !0), j.not_accessable_string = e("This page is no longer accessible"), j.try_newIP_string = e("Connect to new static IP address"), j.setupStatus = "", j.showExternalConnectivity = function() {
        return j.linkGroupCapabilities && j.linkGroupCapabilities.showNetworkExternalConnectivitySection
    }, j.restoreSettings = function(a) {
        angular.copy(j.sharedVM.device.device_settings.network, j.net), k()
    }, j.getScope = function() {
        return a
    };
    var m = function(a) {
        return "linkMaster" == a
    };
    j.setEditing = function(a, b) {
        j.editing[a] = b
    }, j.validateNetworkSettings = function() {
        j.invalidIpMessage = null, j.invalidNetmaskMessage = null, j.invalidExternalIpMessage = null, "static" == j.net.mode && (j.net.staticIP && (d.isIpReserved(j.net.staticIP) ? j.invalidIpMessage = e("IP addresses in the range 172.23.x.x are reserved for internal use.") : d.isIpValidForInterface(j.net.staticIP) || (j.invalidIpMessage = e("Invalid IP address."))), j.net.netmask && (d.isNetMaskValid(j.net.netmask) || (j.invalidNetmaskMessage = e("Invalid Subnet Mask.")))), j.net.extip && (d.isIpReserved(j.net.extip) ? j.invalidExternalIpMessage = e("IP addresses in the range 172.23.x.x are reserved for internal use.") : d.isIpValidForInterface(j.net.extip) || (j.invalidExternalIpMessage = e("Invalid IP address for the external connectivity.")))
    }, j.switchNetMode = function(a) {
        "static" === j.net.mode && (j.net.netmask || (j.net.netmask = "255.255.0.0"))
    }, j.applyNetwork = function() {
        var a = e("After setting the device to DHCP mode, you will lose the connection to the current page. You will be redirected to the Link-Master."),
            b = e("Setting the Link-Master to DHCP mode is not recommended and will require manual re-linking of all Link-Group members to the new DHCP Address."),
            c = e("You are about to modify the Link-Master's IP Address.  This action will require manual re-linking of all Link-Group members to the new address."),
            d = "";
        if ("dhcp" == j.net.mode)
            if (j.sharedVM.deviceCapability.linking && (j.sharedVM.device.isHost || m(j.sharedVM.device.device_linking)) && j.sharedVM.device.device_settings.network.mode != j.net.mode) {
                var g;
                g = m(j.sharedVM.device.device_linking) ? b : a, f("sm", g, d, e("Continue"), e("Cancel"), function(a) {
                    a && j.doSetupNetwork()
                })
            } else j.doSetupNetwork();
        else j.sharedVM.device.device_settings.network.staticIP != j.net.staticIP && j.sharedVM.deviceCapability.linking && m(j.sharedVM.device.device_linking) ? f("sm", c, d, e("Continue"), e("Cancel"), function(a) {
            a && j.doSetupNetwork()
        }) : j.doSetupNetwork()
    }, j.doSetupNetwork = function() {
        var a = angular.copy(j.sharedVM.device.device_settings.network);
        angular.copy(j.net, j.sharedVM.device.device_settings.network), "dhcp" == j.sharedVM.device.device_settings.network.mode && (j.sharedVM.device.device_settings.network.staticIP = j.sharedVM.device.device_settings.network.netmask = j.sharedVM.device.device_settings.network.gateway = j.sharedVM.device.device_settings.network.dns1 = j.sharedVM.device.device_settings.network.dns2 = ""), j.goodResponse = "", j.warningResponse = "", j.errorResponse = "";
        var b = {
            mode: j.sharedVM.device.device_settings.network.mode,
            extip: j.sharedVM.device.device_settings.network.extip,
            extport: j.sharedVM.device.device_settings.network.extport || 0
        };
        "static" === b.mode && (b.staticIP = j.sharedVM.device.device_settings.network.staticIP, b.netmask = j.sharedVM.device.device_settings.network.netmask, b.gateway = j.sharedVM.device.device_settings.network.gateway, b.dns1 = j.sharedVM.device.device_settings.network.dns1, b.dns2 = j.sharedVM.device.device_settings.network.dns2), g.setupNetwork(j.sharedVM.device.device_id, b).then(function(b) {
            var c, d, f = "dhcp" == j.sharedVM.device.device_settings.network.mode,
                g = j.sharedVM.device.device_settings.network.mode != a.mode,
                h = !f && j.sharedVM.device.device_settings.network.staticIP != a.staticIP;
            if (j.sharedVM.device.isHost) {
                var i;
                f && !m(j.sharedVM.device.device_linking) && (d = e("Browser will be redirected to the Link-Master's page"), i = j.sharedVM.device.device_masterAddress, j.sharedVM.device.device_masterPort && 80 != j.sharedVM.device.device_masterPort && (i += ":" + j.sharedVM.device.device_masterPort)), h && (d = e("Browser will be redirected to the Device's new static IP"), i = j.sharedVM.device.device_settings.network.staticIP, j.mgmtPort && 80 != j.mgmtPort && (i += ":" + j.mgmtPort)), i && (c = window.location.protocol + "//" + i + "/view/device/" + j.sharedVM.device.device_id + "/network")
            }
            l();
            var k = e("Applying network changes") + "...",
                n = 5;
            (h || g) && (n = j.sharedVM.device.isHost ? 10 : 20), j.showModalProgress("sm", k, n, function() {
                c ? j.showModalProgress("sm", d, 4, function() {
                    window.location.href = c
                }) : g ? (j.goodResponse = e("The device is now in") + " " + j.sharedVM.device.device_settings.network.mode + " " + e("mode") + ".", f && j.sharedVM.device.isHost && (j.warningResponse = e("Switching to DHCP mode will normally change the device's IP Address.  You will need to navigate your browser to the new address displayed on the device's Front Panel to regain access to the device."))) : j.goodResponse = e("Network changes have been applied.")
            })
        })["catch"](function(a) {
            j.errorResponse = e("Error applying network change with") + " " + j.sharedVM.device.device_settings.network.mode, a.data && a.data.message && (j.errorResponse += ". " + a.data.message)
        })
    }, j.showModalProgress = function(a, b, d, e) {
        var f = c.open({
            templateUrl: "views/dialogs/progress.html",
            controller: "ModalInstanceProgressCtrl",
            backdrop: "static",
            placement: "bottom",
            animation: "am-flip-x",
            size: a,
            resolve: {
                modalMessage: function() {
                    return [b]
                },
                seconds: function() {
                    return d
                }
            }
        });
        f.result.then(function(a) {
            e && e(1)
        }, function(a) {
            e(2)
        }, function() {
            e(3)
        })
    }
}
/**/
function deviceCfgEventsCtrl(a, b, c, d, e, f) {
    a.controllerName = "DeviceCfgEventsCtrl";
    var g = this;
    g.root = b, g.sharedVM = b.devSharedVM, g.openGuide = function() {
        f.openGuide("devEventLog")
    }, g.eventsForSpecificPage = [], g.currentEventPage = 1, g.nbOfPages = 1, g.nbOfEvents = 0, g.showSpinner = !1, g.fsIIEventlogOrderByField = "createdAt", g.fsIIEventlogReverseSort = !1, g.fsIIEventLogToDate = new Date, g.fsIIEventLogUseCurrentDatetime = !0, g.fsIIEventLogToDate.setMilliseconds(0), g.fsIIEventLogFromDate = new Date(new Date(g.fsIIEventLogToDate).getTime() - 6048e5), g.fsIILogDescriptionSearch = "", g.dateOptions = {
        dateDisabled: !1,
        formatYear: "yy",
        maxDate: new Date(2099, 12, 31),
        minDate: new Date(0),
        startingDay: 1
    }, g.openFromCalendar = function() {
        g.fromCalendarPopup.opened = !0
    }, g.fromCalendarPopup = {
        opened: !1
    }, g.openToCalendar = function() {
        g.toCalendarPopup.opened = !0
    }, g.toCalendarPopup = {
        opened: !1
    }, g.exportLogFile = function() {
        var a = {
            entityId: 0,
            startDateTime: new Date("1970-01-01T00:00:00.000Z").toISOString(),
            stopDateTime: (new Date).toISOString()
        };
        e.exportAllEventLog(a).then(function(a) {
            var b = new Blob([JSON.stringify(a.desiredEvents)], {
                type: "text/plain;charset=utf-8"
            });
            b = new Blob(["WBS Date/Time reference is: " + a.wbsDateTime + "   ", b], {
                type: "text/plain;charset=utf-8"
            });
            var d = "AllLogs.json";
            c.saveAs(b, d)
        })
    }, g.getEventLog = function(a) {
        g.showSpinner = !0, 0 == a ? g.currentEventPage = 1 : (g.currentEventPage = g.currentEventPage + a, g.currentEventPage < 1 && (g.currentEventPage = 1), g.currentEventPage > g.nbOfPages && (g.currentEventPage = g.nbOfPages)), "1970-01-01T00:00:00.000Z" == new Date(this.fsIIEventLogToDate).toISOString() && (this.fsIIEventLogToDate = new Date), this.fsIIEventLogUseCurrentDatetime && (this.fsIIEventLogToDate = new Date);
        var b = {
            entityId: 0,
            page: g.currentEventPage,
            limit: 25,
            startDateTime: new Date(this.fsIIEventLogFromDate).toISOString(),
            stopDateTime: new Date(this.fsIIEventLogToDate).toISOString(),
            textSearch: this.fsIILogDescriptionSearch,
            sortColumn: this.fsIIEventlogOrderByField,
            sortOrder: this.fsIIEventlogReverseSort ? "DESC" : "ASC"
        };
        e.getEventLog(b).then(function(a) {
            g.eventsForSpecificPage = a.desiredEvents, g.nbOfEvents = a.totalNumberOfEvents, g.nbOfPages = a.totalNumberOfPages, g.fsIIEventLogOrderByField = b.sortColumn, g.fsIIEventLogReverseSort = "DESC" == b.sortOrder, g.showSpinner = !1
        })
    }, g.convertToReadableEvent = function(a) {
        if (0 == a.entityType) switch (a.eventCode) {
            case 0:
                return "Beltpack ID:" + a.entityId + " --> Status is " + a.details.status;
            case 2:
                return "Beltpack ID:" + a.entityId + " --> Tcvr connection attempted, result: " + a.details.disconnectReason;
            case 3:
                return "Beltpack ID:" + a.entityId + " --> Password attempt " + (1 === +a.details.success ? "succeeded" : "failed") + " for " + (1 === a.details.authType ? "OTA registration" : "Admin menu");
            case 4:
                return "Beltpack ID:" + a.entityId + " --> Health battery " + a.details.batteryLevel + "% / link quality " + a.details.linkQuality;
            case 5:
                return "Beltpack ID:" + a.entityId + " --> Status update battery type: " + a.details.batteryType + ",\n            battery level: " + a.details.batteryLevel + ", link quality: " + a.details.RSSI + ", FER: " + a.details.frameErrorRate
        }
        if (1 == a.entityType) switch (a.eventCode) {
            case 1:
                return "Transceiver ID:" + a.entityId + " -->  Tcvr is: " + a.details.status + " , Sync is:  " + a.details.syncState
        }
        return 5 == a.eventCode ? "Database Error --> table: " + a.details.tableName + ", record count:  " + a.details.recordCount : JSON.stringify(a.details)
    }, g.purgeLogFiles = function() {
        var a = "Are you sure you want to purge all the logs on this device?",
            b = "";
        d("md", a, b, "Yes", "No", function(a) {
            a && (g.eventsForSpecificPage = [], g.currentEventPage = 1, g.nbOfPages = 1, g.nbOfEvents = 0, g.showSpinner = !0, g.fsIIEventlogOrderByField = "createdAt", g.fsIIEventlogReverseSort = !1, e.purgeEventLog().then(function() {
                g.getEventLog(0)
            }))
        })
    }, g.updateSortColumn = function(a) {
        g.fsIIEventlogOrderByField === a ? g.fsIIEventlogReverseSort = !g.fsIIEventlogReverseSort : (g.fsIIEventlogOrderByField = a, g.fsIIEventlogReverseSort = !1), g.getEventLog(0)
    }, g.getEventLog(0)
}
/**/
function deviceUpgradeCtrl(a, b, c, d, e, f, g, h) {
    var i = this;
    i.sharedVM = b.devSharedVM, i.upgrade = {
        progress: 0,
        status: "",
        version: ""
    }, i.disableUpload = !1, i.errorResponse = "";
    var j = i.sharedVM.deviceCapability.upgrade.extensions;
    i.fileExtensionsFilter = j.map(function(a) {
        return a.substr(a.lastIndexOf("."))
    }).join(", ");
    var k, l = !1,
        m = 1500;
    b.upgradeStatus = "", i.previousWord = "";
    var n = e("Problem detected during file upload. Please check the network connection, make sure the file is valid and try again."),
        o = e("Unsupported software version."),
        p = e("Downgrade is not possible with this package."),
        q = i.uploader = new f({
            alias: "file",
            url: "/api/1/devices/0/upload",
            autoUpload: !0,
            removeAfterUpload: !0,
            version: "1",
            deviceId: 0
        });
    i.upload = {
        file: {
            name: "",
            size: 0
        },
        progress: 0,
        result: ""
    }, i.disableUpgrade = !0, q.filters.push({
        name: "customeFilter",
        fn: function(a, b) {
            return j.every(function(b) {
                return a.name.substr(-b.length) !== b
            }) ? (i.errorResponse = e("Please select a " + j.join(" or ") + " file"), !1) : a.size < i.sharedVM.deviceCapability.upgrade.minSize ? (i.errorResponse = e("File too small") + " (< " + i.sharedVM.deviceCapability.upgrade.minSize / 1024 / 1024 + "MB)", !1) : a.size > i.sharedVM.deviceCapability.upgrade.maxSize ? (i.errorResponse = e("File too big") + " (> " + i.sharedVM.deviceCapability.upgrade.maxSize / 1024 / 1024 + "MB)", !1) : (i.disableUpgrade = !0, !0)
        }
    }), f.FileSelect.prototype.isEmptyAfterSelection = function() {
        return !0
    }, q.onBeforeUploadItem = function(a) {
        i.upload.file.name = a.file.name, i.upload.file.size = a.file.size, i.upload.progress = 1, i.upload.result = e("Uploading") + "...", i.upgrade.status = "", i.upgrade.progress = 0, i.upgrade.version = "", i.errorResponse = ""
    }, q.onProgressItem = function(a, b) {
        i.upload.progress = b, 100 == b && (i.upload.result = e("Validating") + "...")
    }, q.onSuccessItem = function(a, b, c, d) {
        b.size == i.upload.file.size && b.version && b.version.search("fail") < 0 && "Fail" != i.upload.result ? (i.upgrade.versionTag = b.version, i.upgrade.version = e("Version") + ": " + b.version, i.upload.progress = 0, 1 === b.supported ? (i.errorResponse = "", i.disableUpgrade = !1) : b.supported === -1 ? (i.errorResponse = p, i.disableUpgrade = !0) : (i.errorResponse = o, i.disableUpgrade = !0)) : (i.errorResponse = n, i.upload.progress = 0), i.upload.result = ""
    }, q.onErrorItem = function(a, b, c, d) {
        i.upload.result = "", b && b.message ? i.errorResponse = e("An error occurred during file upload") + ": " + b.message : i.errorResponse = n, i.upload.progress = 0
    }, q.onCompleteItem = function(a, b, c, d) {
        q.clearQueue()
    };
    var r = function() {
        i.failureCount = 0, i.failureTime = 0;
        var a = "RECEIVED",
            d = function() {
                return l ? ("RECEIVED" === a ? (k = c(d, m), a = "WAITING") : a = "MISSED_TICK", void g.refresh({
                    version: "1",
                    deviceId: 0
                }, function(f) {
                    if (i.failureCount > 0 && (i.failureCount = 0, i.failureTime = 0), "Idle" === f.stage && i.upload.file.name.indexOf("ubifs") !== -1 && "Starting" !== i.upgrade.status && window.location.reload(!0), f.reboot) {
                        l = !1, i.upgrade.progress = 100, i.upgrade.status = e("Rebooting") + "...";
                        var g = e("Rebooting Device...");
                        b.userActionInProgress = !0;
                        var h = 120;
                        i.showModalProgress("sm", g, h, function() {
                            window.location.reload(!0), b.userActionInProgress = !1
                        }, !0)
                    } else f.done ? (l = !1, i.upgrade.status = f.stage, i.upgrade.status.indexOf("Failed") == -1 && (i.upgrade.progress = 100, "FSII" !== i.sharedVM.deviceCapability.type && (i.sharedVM.device.hxIIBPversionSW = i.upgrade.versionTag)), i.disableUpload = !1) : (i.upgrade.progress = f.percentComplete, i.upgrade.status = f.stage);
                    "MISSED_TICK" === a && l && (k = c(d, m)), a = "RECEIVED"
                }, function(b) {
                    if (b.data && b.data.message) l = !1, i.errorResponse = e("The upgrade failed: " + b.data.message);
                    else if (i.failureCount++, 1 === i.failureCount) i.failureTime = Date.now();
                    else {
                        var f = Date.now(),
                            g = (f - i.failureTime) / 1e3;
                        i.failureCount >= 100 && (l = !1, i.errorResponse = e("Too much retries occurred during the upgrade. Retry count = " + i.failureCount)), g >= 120 && (l = !1, i.errorResponse = e("Timeout occured during the upgrade. Diff time = " + g))
                    }
                    l ? "MISSED_TICK" === a && (k = c(d, m)) : (i.upgrade.status = "Failed", i.disableUpload = !1, i.disableUpgrade = !0), a = "RECEIVED"
                })) : void c.cancel(k)
            };
        l === !1 ? k && c.cancel(k) : k = c(d, m)
    };
    i.startUpgrade = function() {
        i.upgrade.progress = 0, i.upgrade.status = e("Starting"), b.upgradeStatus = "upgrading", h().then(function(a) {
            return a.setPollingIntervalMs(3e4)
        }), g.exec({
            version: "1",
            deviceId: 0
        }, null, function(a) {
            i.disableUpgrade = !0, i.disableUpload = !0, i.startRefreshUpgradeProgress()
        }, function(a) {
            a.data && a.data.message ? i.errorResponse = e("Failed to initiate upgrade procedure: " + a.data.message) : i.errorResponse = e("Failed to initiate upgrade procedure"), i.upgrade.status = e("Failed"), i.disableUpgrade = !0, i.stopRefreshUpgradeProgress(), b.upgradeStatus = "", h().then(function(a) {
                return a.setPollingIntervalMs(5e3)
            })
        })
    }, i.stopRefreshUpgradeProgress = function() {
        l = !1, r()
    }, i.startRefreshUpgradeProgress = function() {
        l = !0, r()
    }, i.showModalProgress = function(a, b, c, e, f) {
        var g = d.open({
            templateUrl: "views/dialogs/progress.html",
            controller: "ModalInstanceProgressCtrl",
            backdrop: "static",
            placement: "bottom",
            animation: "am-flip-x",
            size: a,
            resolve: {
                modalMessage: function() {
                    return [b]
                },
                seconds: function() {
                    return c
                }
            }
        });
        g.result.then(function() {
            e && e(1)
        }, function() {
            e(2)
        }, function() {
            e(3)
        });
        var i;
        g.closed.then(function() {
            i && h().then(function(a) {
                a.off("reconnect", i)
            })
        }), f && h().then(function(a) {
            i = a.on("reconnect", function() {
                g.close()
            })
        })
    }, a.$on("$destroy", function() {
        k && c.cancel(k)
    })
}
/**/
function FSIIBeltpackCfgCtrl(a, b, c, d, e, f, g, h, i, j, k, l) {
    function m() {
        a.count++, k.getEndpoint(a.endpoint.id).then(function(b) {
            a.hostIsReachable = !0, a.endpoint = b, a.updateRoleLabel()
        })
    }
    a.controllerName = "FSIIBeltpackCfgCtrl", a.device = e.device, a.endpoint = e.endpoint, a.endpoints = e.endpoints, a.eventsForSpecificPage = {}, a.currentEventPage = 1, a.nbOfPages = 1, a.nbOfEvents = 0, a.showSpinner = !1, a.fsIIEventlogOrderByField = "createdAt", a.fsIIEventlogReverseSort = !1, a.fsIIEventLogUseCurrentDatetime = !0, a.fsIIEventLogToDate = new Date, a.fsIIEventLogToDate.setMilliseconds(0), a.fsIIEventLogFromDate = new Date(new Date(a.fsIIEventLogToDate).getTime() - 6048e5), a.fsIILogDescriptionSearch = "", a.dateOptions = {
        dateDisabled: !1,
        formatYear: "yy",
        maxDate: new Date(2099, 12, 31),
        minDate: new Date(0),
        startingDay: 1
    }, a.openFromCalendar = function() {
        a.fromCalendarPopup.opened = !0
    }, a.fromCalendarPopup = {
        opened: !1
    }, a.openToCalendar = function() {
        a.toCalendarPopup.opened = !0
    }, a.toCalendarPopup = {
        opened: !1
    }, a.updateLabel = function() {
        var b = {
            label: a.endpoint.label
        };
        k.updateEndpoint(a.endpoint.device_id, a.endpoint.id, b)
    }, a.getRoleLabel = function() {
        return "undefined" != typeof a.endpoint.settings.default_role && 0 !== a.endpoint.settings.default_role ? a.roleLabel : "Unassigned"
    }, a.updateRoleLabel = function() {
        j.getRole(a.endpoint.settings.default_role).then(function(b) {
            b && (a.roleLabel = b.label)
        })
    }, a.exportLogFile = function() {
        var b = {
            entityId: a.endpoint.id,
            startDateTime: new Date("1970-01-01T00:00:00.000Z").toISOString(),
            stopDateTime: (new Date).toISOString()
        };
        l.exportAllEventLog(b).then(function(b) {
            var c = new Blob([JSON.stringify(b.desiredEvents)], {
                type: "text/plain;charset=utf-8"
            });
            c = new Blob(["WBS Date/Time reference is: " + b.wbsDateTime + "   ", c], {
                type: "text/plain;charset=utf-8"
            });
            var d = "AllLogsForEndpoint_" + a.endpoint.id + ".json";
            i.saveAs(c, d)
        })
    }, a.isOffline = function() {
        var b = "undefined" == typeof a.endpoint.liveStatus || "undefined" == typeof a.endpoint.liveStatus.status;
        return b || (b = "online" !== a.endpoint.liveStatus.status), b
    }, a.getAntennaLabel = function(b) {
        if (a.endpoints && "undefined" != typeof b) {
            var c = b + 1e6,
                e = d("filter")(a.endpoints, {
                    id: c
                });
            if (e && 1 === e.length) return e[0].label
        }
        return "Unassigned"
    }, a.getAntennaIndex = function(a) {
        return "undefined" != typeof a ? a + 1 : "Unassigned"
    }, a.changeRole = function() {
        a.roleError = null;
        var b = f("Change Role"),
            d = [];
        a.endpoint.settings.default_role && d.push(a.endpoint.settings.default_role), j.roles.then(function(e) {
            var g = c.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: function() {
                        return {
                            title: b,
                            messages: "",
                            connectables: {
                                Roles: {
                                    primaryKeyField: "id",
                                    labelField: "label",
                                    value: e.filter(function(a) {
                                        return !a.isDefault
                                    })
                                }
                            },
                            assigned: d
                        }
                    }
                }
            });
            g.result.then(function(b) {
                for (var c = !1, d = function(b) {
                        a.endpoint.role = e.find(function(a) {
                            return a.id == b
                        }), c = !0
                    }, g = 0, h = b.selected; g < h.length; g++) {
                    var i = h[g];
                    d(i)
                }
                var j = 0;
                c && (j = a.endpoint.role.id), k.changeEndpointRole(a.endpoint.device_id, a.endpoint.id, j)["catch"](function(b) {
                    b.data && b.data.message ? a.roleError = b.data.message : a.roleError = f("No response from the server.")
                })
            }, function() {})
        })
    }, a.getEventLog = function(b) {
        a.showSpinner = !0, 0 == b ? a.currentEventPage = 1 : (a.currentEventPage = a.currentEventPage + b, a.currentEventPage < 1 && (a.currentEventPage = 1), a.currentEventPage > a.nbOfPages && (a.currentEventPage = a.nbOfPages)), "1970-01-01T00:00:00.000Z" == new Date(this.fsIIEventLogToDate).toISOString() && (this.fsIIEventLogToDate = new Date), this.fsIIEventLogUseCurrentDatetime && (this.fsIIEventLogToDate = new Date);
        var c = {
            entityId: a.endpoint.id,
            page: a.currentEventPage,
            limit: 10,
            startDateTime: new Date(this.fsIIEventLogFromDate).toISOString(),
            stopDateTime: new Date(this.fsIIEventLogToDate).toISOString(),
            textSearch: this.fsIILogDescriptionSearch,
            sortColumn: this.fsIIEventlogOrderByField,
            sortOrder: this.fsIIEventlogReverseSort ? "DESC" : "ASC"
        };
        l.getEventLog(c).then(function(b) {
            a.eventsForSpecificPage = b.desiredEvents, a.nbOfEvents = b.totalNumberOfEvents, a.nbOfPages = b.totalNumberOfPages, a.showSpinner = !1
        })
    }, k.subscribe(a, m), g().then(function(c) {
        c.on("disconnect", function() {
            console.log("socket.io: disconnected, " + a.controllerName), "FSIIBeltpackCfgCtrl" === a.controllerName && b.dismiss()
        }, a), a.$on("$destroy", function() {
            console.log("socket.io: destroy, " + a.controllerName), a.controllerName = null
        })
    }), a.deleteEndpoint = function() {
        var c = f("Are you sure you want to unregister the following wireless beltpack from your system: ") + a.endpoint.label + "?",
            d = "";
        h("md", c, d, f("Unregister"), f("Cancel"), function(c) {
            c && k.deleteEndpoint(a.endpoint.device_id, a.endpoint.id).then(function() {
                return b.close()
            })["catch"](function() {
                return b.close()
            })
        })
    }, a.purgeLogFiles = function() {
        var b = f("Are you sure you want to purge all the logs for ") + a.endpoint.label + "?",
            c = "";
        h("md", b, c, f("Yes"), f("No"), function(b) {
            b && (a.eventsForSpecificPage = {}, a.currentEventPage = 1, a.nbOfPages = 1, a.nbOfEvents = 0, a.showSpinner = !0, l.purgeEventLog(a.endpoint.id).then(function() {
                a.getEventLog(0)
            }))
        })
    }, a.done = function() {
        b.close()
    }, a.cancel = function() {
        b.dismiss()
    }, a.convertToReadableEvent = function(a) {
        switch (a.eventCode) {
            case 0:
                return "Status is " + a.details.status;
            case 2:
                return "Tcvr connection attempted, result: " + a.details.disconnectReason;
            case 3:
                return "Password attempt " + (1 === +a.details.success ? "succeeded" : "failed") + " for " + (1 === a.details.authType ? "OTA registration" : "Admin menu");
            case 4:
                return "Health battery " + a.details.batteryLevel + "% / link quality " + a.details.linkQuality
        }
        return JSON.stringify(a.details)
    }, a.updateSortColumn = function(b) {
        a.fsIIEventlogOrderByField === b ? a.fsIIEventlogReverseSort = !a.fsIIEventlogReverseSort : (a.fsIIEventlogOrderByField = b, a.fsIIEventlogReverseSort = !1), a.fsIIEventLogFromDate = this.fsIIEventLogFromDate, a.fsIIEventLogToDate = this.fsIIEventLogToDate, a.fsIILogDescriptionSearch = this.fsIILogDescriptionSearch, a.getEventLog(0)
    }, a.getEventLog(0), a.updateRoleLabel(), j.subscribe(a, function() {
        a.updateRoleLabel()
    })
}
/**/
function FSIIAntennaCableLengthsCtrl(a, b, c, d, e, f, g) {
    function h(a, b) {
        b.length != a.length && (b.length = 0);
        for (var c = 0; c < a.length; ++c) b.length === c && b.push(null), angular.isArray(a[c]) ? (angular.isArray(b[c]) || (b[c] = []), h(a[c], b[c])) : angular.isObject(a[c]) ? (angular.isObject(b[c]) || (b[c] = {}), i(a[c], b[c])) : b[c] = a[c]
    }

    function i(a, b) {
        var c;
        for (c in b) b.hasOwnProperty(c) && null == a[c] && delete b[c];
        for (c in a)
            if (a.hasOwnProperty(c)) {
                var d = a[c];
                angular.isArray(d) ? (angular.isArray(b[c]) || (b[c] = []), h(d, b[c])) : angular.isObject(d) ? (angular.isObject(b[c]) || (b[c] = {}), i(d, b[c])) : b[c] = d
            }
    }

    function j() {
        a.count++, g.endpoints.then(function(b) {
            a.hostIsReachable = !0;
            for (var c in b) angular.equals(a.endpoints[c], b[c]) || i(b[c], a.endpoints[c])
        })
    }
    a.controllerName = "FSIIAntennaCableLengthsCtrl", a.device = c.device, a.endpoints = c.endpoints, a.updateLabel = function(a) {
        var b = {
            label: a.label
        };
        g.updateEndpoint(a.device_id, a.id, b)
    }, a.updateSettings = function(a) {
        var b = {
            settings: a.settings
        };
        g.updateEndpoint(a.device_id, a.id, b)
    }, a.showSyncOffset = function(b) {
        var c = f("filter")(a.syncOffsetValues, {
            value: b
        }, !0);
        return angular.isDefined(b) && c.length ? c[0].text : d("Not set")
    }, a.syncOffsetValues = [{
        value: 1,
        text: d("0 - 69m")
    }, {
        value: 2,
        text: d("70 - 139m")
    }, {
        value: 3,
        text: d("140 - 209m")
    }, {
        value: 4,
        text: d("210 - 279m")
    }, {
        value: 5,
        text: d("280 - 349m")
    }, {
        value: 6,
        text: d("350 - 419m")
    }, {
        value: 7,
        text: d("420 - 489m")
    }, {
        value: 8,
        text: d("490 - 559m")
    }, {
        value: 9,
        text: d("560 - 629m")
    }, {
        value: 10,
        text: d("630 - 699m")
    }, {
        value: 11,
        text: d("700 - 769m")
    }, {
        value: 12,
        text: d("770 - 839m")
    }, {
        value: 13,
        text: d("840 - 909m")
    }, {
        value: 14,
        text: d("910 - 979m")
    }, {
        value: 15,
        text: d("980 - 1049m")
    }, {
        value: 16,
        text: d("1050 - 1119m")
    }, {
        value: 17,
        text: d("1120 - 1189m")
    }, {
        value: 18,
        text: d("1190 - 1259m")
    }, {
        value: 19,
        text: d("1260 - 1329m")
    }, {
        value: 20,
        text: d("1330 - 1399m")
    }, {
        value: 21,
        text: d("1400 - 1469m")
    }, {
        value: 22,
        text: d("1470 - 1539m")
    }, {
        value: 23,
        text: d("1540 - 1609m")
    }], g.subscribe(a, j), e().then(function(c) {
        c.on("disconnect", function() {
            console.log("socket.io: disconnected, " + a.controllerName), "FSIIAntennaCableLengthsCtrl" === a.controllerName && b.dismiss()
        }, a), a.$on("$destroy", function() {
            console.log("socket.io: destroy, " + a.controllerName), a.controllerName = null
        })
    }), a.done = function() {
        b.close()
    }, a.cancel = function() {
        b.dismiss()
    }
}
/**/
function FSIIAntennaCfgCtrl(a, b, c, d, e, f, g, h, i, j) {
    function k() {
        a.count++, i.getEndpoint(a.endpoint.id).then(function(b) {
            a.hostIsReachable = !0, a.endpoint = b
        })
    }
    a.controllerName = "FSIIAntennaCfgCtrl", a.device = c.device, a.endpoint = c.endpoint, a.eventsForSpecificPage = {}, a.currentEventPage = 1, a.nbOfPages = 1, a.nbOfEvents = 0, a.showSpinner = !1, a.fsIIEventlogOrderByField = "createdAt", a.fsIIEventlogReverseSort = !1, a.fsIIEventLogUseCurrentDatetime = !0, a.fsIIEventLogToDate = new Date, a.fsIIEventLogToDate.setMilliseconds(0), a.fsIIEventLogFromDate = new Date(new Date(a.fsIIEventLogToDate).getTime() - 6048e5), a.fsIILogDescriptionSearch = "", a.dateOptions = {
        dateDisabled: !1,
        formatYear: "yy",
        maxDate: new Date(2099, 12, 31),
        minDate: new Date(0),
        startingDay: 1
    }, a.openFromCalendar = function() {
        a.fromCalendarPopup.opened = !0
    }, a.fromCalendarPopup = {
        opened: !1
    }, a.openToCalendar = function() {
        a.toCalendarPopup.opened = !0
    }, a.toCalendarPopup = {
        opened: !1
    }, a.updateLabel = function() {
        var b = {
            label: a.endpoint.label
        };
        i.updateEndpoint(a.endpoint.device_id, a.endpoint.id, b)
    }, a.exportLogFile = function() {
        var b = {
            entityId: a.endpoint.id,
            startDateTime: new Date("1970-01-01T00:00:00.000Z").toISOString(),
            stopDateTime: (new Date).toISOString()
        };
        j.exportAllEventLog(b).then(function(b) {
            var c = new Blob([JSON.stringify(b.desiredEvents)], {
                type: "text/plain;charset=utf-8"
            });
            c = new Blob(["WBS Date/Time reference is: " + b.wbsDateTime + "   ", c], {
                type: "text/plain;charset=utf-8"
            });
            var d = "AllLogsForEndpoint_" + a.endpoint.id + ".json";
            e.saveAs(c, d)
        })
    }, a.isOffline = function() {
        var b = "undefined" == typeof a.endpoint.liveStatus || "undefined" == typeof a.endpoint.liveStatus.status;
        return b || (b = "online" !== a.endpoint.liveStatus.status), b
    }, a.updateSettings = function() {
        var b = {
            settings: a.endpoint.settings
        };
        i.updateEndpoint(a.endpoint.device_id, a.endpoint.id, b)
    }, a.getEventLog = function(b) {
        a.showSpinner = !0, 0 == b ? a.currentEventPage = 1 : (a.currentEventPage = a.currentEventPage + b, a.currentEventPage < 1 && (a.currentEventPage = 1), a.currentEventPage > a.nbOfPages && (a.currentEventPage = a.nbOfPages)), "1970-01-01T00:00:00.000Z" == new Date(this.fsIIEventLogToDate).toISOString() && (this.fsIIEventLogToDate = new Date), this.fsIIEventLogUseCurrentDatetime && (this.fsIIEventLogToDate = new Date);
        var c = {
            entityId: a.endpoint.id,
            page: a.currentEventPage,
            limit: 10,
            startDateTime: new Date(this.fsIIEventLogFromDate).toISOString(),
            stopDateTime: new Date(this.fsIIEventLogToDate).toISOString(),
            textSearch: this.fsIILogDescriptionSearch,
            sortColumn: this.fsIIEventlogOrderByField,
            sortOrder: this.fsIIEventlogReverseSort ? "DESC" : "ASC"
        };
        j.getEventLog(c).then(function(b) {
            a.eventsForSpecificPage = b.desiredEvents, a.nbOfEvents = b.totalNumberOfEvents, a.nbOfPages = b.totalNumberOfPages, a.showSpinner = !1
        })
    }, a.getEndpointDisplayModel = function(a) {
        return a ? "FSII-Antenna" == a ? "FSII-Transceiver" : a : "No Model Name Detected"
    }, i.subscribe(a, k), f().then(function(c) {
        c.on("disconnect", function() {
            console.log("socket.io: disconnected, " + a.controllerName), "FSIIAntennaCfgCtrl" === a.controllerName && b.dismiss()
        }, a), a.$on("$destroy", function() {
            console.log("socket.io: destroy, " + a.controllerName), a.controllerName = null
        })
    }), a.purgeLogFiles = function() {
        var b = d("Are you sure you want to purge all the logs for ") + a.endpoint.label + "?",
            c = "";
        g("md", b, c, d("Yes"), d("No"), function(b) {
            b && (a.eventsForSpecificPage = {}, a.currentEventPage = 1, a.nbOfPages = 1, a.nbOfEvents = 0, a.showSpinner = !0, j.purgeEventLog(a.endpoint.id).then(function() {
                a.getEventLog(0)
            }))
        })
    }, a.done = function() {
        b.close()
    }, a.cancel = function() {
        b.dismiss()
    }, a.convertToReadableEvent = function(a) {
        switch (a.eventCode) {
            case 1:
                return "Tcvr is: " + a.details.status + " , Sync is:  " + a.details.syncState
        }
        return JSON.stringify(a.details)
    }, a.updateSortColumn = function(b) {
        a.fsIIEventlogOrderByField === b ? a.fsIIEventlogReverseSort = !a.fsIIEventlogReverseSort : (a.fsIIEventlogOrderByField = b, a.fsIIEventlogReverseSort = !1), a.fsIIEventLogFromDate = this.fsIIEventLogFromDate, a.fsIIEventLogToDate = this.fsIIEventLogToDate, a.fsIILogDescriptionSearch = this.fsIILogDescriptionSearch, a.getEventLog(0)
    }, a.getEventLog(0)
}
/**/
function HNEndpointCfgCtrl(a, b, c, d, e, f, g, h) {
    function i(a) {
        function b(a) {
            return a = a.toString(), 1 == a.length ? "0" + a : a
        }
        var c = new Date;
        return a + "_" + b(c.getFullYear()) + "-" + b(c.getMonth() + 1) + "-" + b(c.getDate())
    }

    function j() {
        var a = new Date;
        return 1e3 * (3600 * (23 - a.getHours()) + 60 * (59 - a.getMinutes()) + (60 - a.getSeconds()) + 1)
    }

    function k() {
        a.supportInfoName = i("snapshot_" + a.endpoint.label), setTimeout(function() {
            k(), a.$apply()
        }, j())
    }
    a.device = d.device, a.endpoint = d.endpoint, a.endpointTypeName = h.endpointTypeToNameMap[a.endpoint.type], a.showMaintenance = !0, a.endpointTypeStr = function(a, b) {
        return "HBP-2X" === a && b && 2 === b ? "HXII-BP" : a
    }, a.updateLabel = function() {
        a.labelError = null;
        var b = {
            label: a.endpoint.label
        };
        h.updateEndpoint(a.endpoint.device_id, a.endpoint.id, b)["catch"](function(b) {
            b.data && b.data.message ? a.labelError = b.data.message : a.labelError = f("No response from the server.")
        })
    }, a.getRoleLabel = function() {
        return a.endpoint.role && !a.endpoint.role.isDefault ? a.endpoint.role.label : f("Local Config")
    }, a.changeRole = function() {
        a.roleError = null;
        var b = f("Change Role"),
            d = [];
        d.push(a.endpoint.role ? a.endpoint.role.id : 0), e.roles.then(function(e) {
            for (var g = 0, i = e; g < i.length; g++) {
                var j = i[g];
                j.isDefault && (j.label = "Local Config")
            }
            var k = c.open({
                templateUrl: "views/dialogs/connectionSelectionDialog.html",
                controller: "connectionSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: function() {
                        return {
                            title: b,
                            messages: "",
                            connectables: {
                                Roles: {
                                    primaryKeyField: "id",
                                    labelField: "label",
                                    value: e.filter(function(b) {
                                        return b.type == a.endpoint.type
                                    })
                                }
                            },
                            assigned: d
                        }
                    }
                }
            });
            k.result.then(function(b) {
                for (var c = !1, d = function(b) {
                        a.endpoint.role = e.find(function(a) {
                            return a.id == b
                        }), c = !0
                    }, g = 0, i = b.selected; g < i.length; g++) {
                    var j = i[g];
                    d(j)
                }
                c && h.changeEndpointRole(a.endpoint.device_id, a.endpoint.id, a.endpoint.role.id)["catch"](function(b) {
                    b.data && b.data.message ? a.roleError = b.data.message : a.roleError = f("No response from the server.")
                })
            }, function() {})
        })
    }, a.resetToDefault = function() {
        h.resetEndpointToDefault(a.endpoint.device_id, a.endpoint.id).then(function(a) {
            g(function() {
                b.close()
            }, 1500)
        })["catch"](function(b) {
            b.data && b.data.message ? a.maintenanceError = b.data.message : a.maintenanceError = f("No response from the server.")
        })
    }, a.reboot = function() {
        h.rebootEndpoint(a.endpoint.device_id, a.endpoint.id).then(function(a) {
            g(function() {
                b.close()
            }, 1500)
        })["catch"](function(b) {
            b.data && b.data.message ? a.maintenanceError = b.data.message : a.maintenanceError = f("No response from the server.")
        })
    }, k(), a.done = function() {
        b.close()
    }, a.cancel = function() {
        b.dismiss()
    }
}
/**/
keysetAssign.$inject = ["$filter", "$uibModal", "gettext", "naturalSort", "portsService", "connectionsService", "rolesService"], navBarController.$inject = ["$scope", "$rootScope", "$route", "$window", "devicesService", "capabilitiesService", "navbarService", "showModalAlert", "socket", "CCM_CONSTANTS", "gettext", "pageGuideService", "linkGroupCapabilitiesService", "$routeSegment"], socket.$inject = ["$rootScope", "$q", "capabilitiesService"], whilePressed.$inject = ["$parse", "$interval"], deviceListCtrl.$inject = ["$scope", "$rootScope", "$interval", "$uibModal", "$filter", "$timeout", "gettext", "socket", "showModalConfirm", "showModalAlert", "navbarService", "audioInterfacesService", "AudioInterfacesUtil", "multiDevicesCapabilitiesLoader", "pageGuideService", "alertsService", "rolesService", "connectionsService", "naturalSort", "$q", "devicesService", "callsService", "portsService", "externalDevicesService", "endpointsService", "licenseService", "linkGroupCapabilitiesService", "ivpUsersService", "gpioService", "CCM_CONSTANTS", "connections", "ports", "devices", "audioInterfaces", "roles", "endpoints", "linkGroupCapabilities", "ivpUsers", "PerformActionOnDevice"], deviceMenuCtrl.$inject = ["$scope", "$rootScope", "pageGuideService", "linkGroupCapabilitiesService"], deviceViewCtrl.$inject = ["$scope", "$rootScope", "$routeSegment", "$routeParams", "socket", "gettext", "AudioInterfacesUtil", "alertsService", "devicesService", "audioInterfacesService", "endpointsService", "portsService", "CCM_CONSTANTS", "device", "endpoints", "audioInterfaces", "deviceCapability"], devCfgCommonCtrl.$inject = ["$scope", "$rootScope", "devicesService", "$routeSegment", "$location"], devCfgBtnGroupCtrl.$inject = ["$scope", "$rootScope", "deviceCfgBtnGroupService", "portsService"], deviceCfgGeneralCtrl.$inject = ["$scope", "$rootScope", "$window", "$uibModal", "$location", "$filter", "$routeSegment", "FileSaver", "gettext", "UpdateDevice", "PerformActionOnDevice", "ClientInfoService", "FileUploader", "$timeout", "showModalConfirm", "socket", "pageGuideService", "devicesService", "connectionsService", "rolesService", "portsService", "userService", "endpointsService", "linkGroupCapabilitiesService", "gpioService", "networkEventService", "linkGroupCapabilities", "connections", "roles", "ports"], deviceCfgSettingsCtrl.$inject = ["$scope", "$rootScope", "$uibModal", "$filter", "gettext", "naturalSort", "UpdateDevice", "connectionsService", "rolesService", "portsService", "endpointsService", "pageGuideService", "connections", "ports", "roles"], deviceCfgNetworkCtrl.$inject = ["$scope", "$rootScope", "$uibModal", "DeviceIp", "gettext", "showModalConfirm", "devicesService", "pageGuideService", "linkGroupCapabilitiesService"], deviceCfgEventsCtrl.$inject = ["$scope", "$rootScope", "FileSaver", "showModalConfirm", "eventLogService", "pageGuideService"], deviceUpgradeCtrl.$inject = ["$scope", "$rootScope", "$timeout", "$uibModal", "gettext", "FileUploader", "UpgradeDevice", "socket"], FSIIBeltpackCfgCtrl.$inject = ["$scope", "$uibModalInstance", "$uibModal", "$filter", "options", "gettext", "socket", "showModalConfirm", "FileSaver", "rolesService", "endpointsService", "eventLogService"], FSIIAntennaCableLengthsCtrl.$inject = ["$scope", "$uibModalInstance", "options", "gettext", "socket", "$filter", "endpointsService"], FSIIAntennaCfgCtrl.$inject = ["$scope", "$uibModalInstance", "options", "gettext", "FileSaver", "socket", "showModalConfirm", "$filter", "endpointsService", "eventLogService"], HNEndpointCfgCtrl.$inject = ["$scope", "$uibModalInstance", "$uibModal", "options", "rolesService", "gettext", "$timeout", "endpointsService"], angular.module("userControlsDirectives", []);
/**/
var moonraker = angular.module("moonraker", ["ngResource", "ngSanitize", "naturalSort", "ui.bootstrap", "ngRoute", "route-segment", "view-segment", "gettext", "xeditable", "angularFileUpload", "angularAwesomeSlider", "ngGrid", "userControlsDirectives", "ngFileSaver", "ngNumberPicker"]).constant("CCM_CONSTANTS", {
    PRODUCT_NAME: "Core Configuration Manager"
}).run(["gettextCatalog", function(a) {
    a.currentLanguage = "en", a.debug = !0
}]).run(["capabilitiesService", "CCM_CONSTANTS", function(a, b) {
    a.getDeviceCapabilites(0).then(function(a) {
        b.PRODUCT_NAME = a.type
    })
}]).config(["$routeSegmentProvider", "$routeProvider", "$locationProvider", "$compileProvider", "$httpProvider", function(a, b, c, d, e) {
    d.debugInfoEnabled(!1), e.useApplyAsync(!0), c.html5Mode(!0), a.when("", "devices").when("/", "devices").when("/view/devices", "devices").when("/view/roles", "roles").when("/view/device/:deviceId/", "device").when("/view/device/:deviceId/general", "device.general").when("/view/device/:deviceId/network", "device.network").when("/view/device/:deviceId/wireless", "device.wireless").when("/view/device/:deviceId/settings", "device.settings").when("/view/device/:deviceId/ports", "device.ports").when("/view/device/:deviceId/events", "device.events").when("/view/device/:deviceId/linking", "device.linking").when("/view/device/:deviceId/interfaces/:interfaceList/4w", "device.4w").when("/view/device/:deviceId/interfaces/:interfaceList/4wg", "device.4wg").when("/view/device/:deviceId/interfaces/:interfaceList/2w", "device.2w").when("/view/device/:deviceId/statistics", "device.statistics").when("/view/accounts", "accounts").when("/view/accounts/ivc32/:externalDeviceId?/", "accounts.ivc32").when("/view/accounts/sip/:externalDeviceId?/", "accounts.sip").when("/view/accounts/aicusers", "accounts.aicusers").when("/view/connections", "connections").when("/view/lqconnections", "lqconnections").when("/view/conn", "conn"), b.otherwise({
        redirectTo: "/view/devices"
    }), a.segment("devices", {
        "default": !0,
        controller: "deviceListCtrl",
        controllerAs: "ctrl",
        templateUrl: "views/device/devices.html",
        resolve: {
            devices: ["devicesService", function(a) {
                return a.devices
            }],
            connections: ["connectionsService", function(a) {
                return a.connections
            }],
            audioInterfaces: ["audioInterfacesService", function(a) {
                return a.audioInterfaces
            }],
            roles: ["rolesService", function(a) {
                return a.roles
            }],
            ports: ["portsService", function(a) {
                return a.ports
            }],
            endpoints: ["endpointsService", function(a) {
                return a.endpoints
            }],
            linkGroupCapabilities: ["linkGroupCapabilitiesService", function(a) {
                return a.linkGroupCapabilities
            }],
            ivpUsers: ["ivpUsersService", function(a) {
                return a.users
            }]
        }
    }).segment("device", {
        controller: "deviceViewCtrl",
        controllerAs: "devViewCtrl",
        templateUrl: "views/device/deviceConfig.html",
        dependencies: ["deviceId"],
        resolve: {
            device: ["devicesService", function(a) {
                return a.currentDevice
            }],
            endpoints: ["endpointsService", function(a) {
                return a.endpoints
            }],
            audioInterfaces: ["audioInterfacesService", function(a) {
                return a.currentDeviceAudioInterfaces
            }],
            deviceCapability: ["capabilitiesService", function(a) {
                return a.currentDeviceCapabilites
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        },
        untilResolved: {}
    }).within().segment("general", {
        "default": !0,
        controller: "deviceCfgGeneralCtrl",
        controllerAs: "ctrl",
        templateUrl: "views/device/deviceCfgGeneral.html",
        resolve: {
            linkGroupCapabilities: ["linkGroupCapabilitiesService", function(a) {
                return a.linkGroupCapabilities
            }],
            connections: ["connectionsService", function(a) {
                return a.connections
            }],
            ports: ["portsService", function(a) {
                return a.ports
            }],
            roles: ["rolesService", function(a) {
                return a.roles
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("network", {
        templateUrl: "views/device/deviceCfgNetwork.html"
    }).segment("wireless", {
        templateUrl: "views/device/deviceCfgWireless.html"
    }).segment("settings", {
        controller: "deviceCfgSettingsCtrl",
        controllerAs: "ctrl",
        templateUrl: "views/device/deviceCfgSettings.html",
        resolve: {
            connections: ["connectionsService", function(a) {
                return a.connections
            }],
            ports: ["portsService", function(a) {
                return a.ports
            }],
            roles: ["rolesService", function(a) {
                return a.roles
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("ports", {
        controller: "portsCtrl",
        controllerAs: "ctrl",
        templateUrl: "views/device/ports.html",
        resolve: {
            audioInterfaces: ["audioInterfacesService", function(a) {
                return a.currentDeviceAudioInterfacesMap
            }],
            ports: ["portsService", function(a) {
                return a.currentDevicePortsMap
            }],
            externalDevices: ["externalDevicesService", function(a) {
                return a.externalDevicesMap
            }],
            deviceCapabilities: ["capabilitiesService", function(a) {
                return a.currentDeviceCapabilites
            }],
            linkGroupCapabilities: ["linkGroupCapabilitiesService", function(a) {
                return a.linkGroupCapabilities
            }],
            alerts: ["alertsService", function(a) {
                return a.currentDeviceCurrentAlerts
            }],
            connections: ["connectionsService", function(a) {
                return a.connections
            }],
            device: ["devicesService", function(a) {
                return a.currentDevice
            }],
            devices: ["devicesService", function(a) {
                return a.devicesMap
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("events", {
        templateUrl: "views/device/deviceCfgEvents.html"
    }).segment("linking", {
        templateUrl: "views/device/deviceCfgLinking.html",
        controller: "deviceCfgLinkingCtrl",
        controllerAs: "ctrl",
        resolve: {
            deviceCapability: ["capabilitiesService", function(a) {
                return a.currentDeviceCapabilites
            }],
            linkGroupCapabilities: ["linkGroupCapabilitiesService", function(a) {
                return a.linkGroupCapabilities
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("statistics", {
        templateUrl: "views/device/deviceStats.html"
    }).up().segment("connections", {
        controller: "connectionCtrl",
        controllerAs: "ctrl",
        templateUrl: "views/connection/connections.html",
        resolve: {
            ports: ["portsService", function(a) {
                return a.ports
            }],
            calls: ["callsService", function(a) {
                return a.calls
            }],
            roles: ["rolesService", function(a) {
                return a.roles
            }],
            connections: ["connectionsService", function(a) {
                return a.connections
            }],
            devices: ["devicesService", function(a) {
                return a.devices
            }],
            connectionsStatus: ["connectionsLiveStatusService", function(a) {
                return a.connectionsLiveStatusMap
            }],
            endpoints: ["endpointsService", function(a) {
                return a.endpoints
            }],
            deviceCapabilities: ["capabilitiesService", function(a) {
                return a.currentDeviceCapabilites
            }],
            linkGroupCapabilities: ["linkGroupCapabilitiesService", function(a) {
                return a.linkGroupCapabilities
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("roles", {
        controller: "rolesCtrl",
        controllerAs: "ctrl",
        "default": !0,
        templateUrl: "views/role/roleConfig.html",
        resolve: {
            connections: ["connectionsService", function(a) {
                return a.connections
            }],
            ports: ["portsService", function(a) {
                return a.ports
            }],
            devices: ["devicesService", function(a) {
                return a.devices
            }],
            audioInterfaces: ["audioInterfacesService", function(a) {
                return a.audioInterfaces
            }],
            linkGroupCapabilities: ["linkGroupCapabilitiesService", function(a) {
                return a.linkGroupCapabilities
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("accounts", {
        controller: "accountsCtrl",
        controllerAs: "accountsCtrl",
        templateUrl: "views/accounts/accounts.html",
        resolve: {
            externalDevices: ["externalDevicesService", function(a) {
                return a.externalDevices
            }],
            linkGroupCapabilities: ["linkGroupCapabilitiesService", function(a) {
                return a.linkGroupCapabilities
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).within().segment("ivc32", {
        controller: "ivc32Ctrl",
        controllerAs: "ivc32Ctrl",
        "default": !1,
        templateUrl: "views/accounts/ivc32.html",
        resolve: {
            devices: ["devicesService", function(a) {
                return a.devices
            }],
            externalDevices: ["externalDevicesService", function(a) {
                return a.externalDevices
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("sip", {
        controller: "sipCtrl",
        controllerAs: "sipCtrl",
        "default": !1,
        templateUrl: "views/accounts/sip.html",
        resolve: {
            devices: ["devicesService", function(a) {
                return a.devices
            }],
            externalDevices: ["externalDevicesService", function(a) {
                return a.externalDevices
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).segment("aicusers", {
        controller: "aicUsersCtrl",
        controllerAs: "aicUsersCtrl",
        "default": !0,
        templateUrl: "views/accounts/aicUsers.html",
        resolve: {
            devices: ["devicesService", function(a) {
                return a.devices
            }]
        },
        resolveFailed: {
            controller: "errorCtrl"
        }
    }).up()
}]);
/**/
moonraker.run(["editableOptions", "editableThemes", function(a, b) {
    b.bs3.inputClass = "input-sm", b.bs3.buttonsClass = "btn-sm", b.bs3.errorTpl = "", a.theme = "bs3"
}]), Array.prototype.find || (Array.prototype.find = function(a) {
    if (null == this) throw new TypeError("Array.prototype.find called on null or undefined");
    if ("function" != typeof a) throw new TypeError("predicate must be a function");
    for (var b, c = Object(this), d = c.length >>> 0, e = arguments[1], f = 0; f < d; f++)
        if (b = c[f], a.call(e, b, f, c)) return b
}), Array.prototype.findIndex || (Array.prototype.findIndex = function(a) {
    if (null === this) throw new TypeError("Array.prototype.findIndex called on null or undefined");
    if ("function" != typeof a) throw new TypeError("predicate must be a function");
    for (var b, c = Object(this), d = c.length >>> 0, e = arguments[1], f = 0; f < d; f++)
        if (b = c[f], a.call(e, b, f, c)) return f;
    return -1
}), "function" != typeof Object.assign && (Object.assign = function(a) {
    if (null == a) throw new TypeError("Cannot convert undefined or null to object");
    a = Object(a);
    for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        if (null != c)
            for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
    }
    return a
});
/**/
var Emitter = function() {
    function a() {
        this.eventHandlers = {}
    }
    return a.prototype.on = function(a, b) {
        return this.eventHandlers[a] || (this.eventHandlers[a] = []), this.eventHandlers[a].push(b), this
    }, a.prototype.addEventListener = function(a, b) {
        return this.on(a, b)
    }, a.prototype.once = function(a, b) {
        var c = this,
            d = function() {
                c.off(a, d), b()
            };
        return this.on(a, d), this
    }, a.prototype.off = function(a, b) {
        var c = this.eventHandlers[a];
        if (!c) return this;
        if (!b) return delete this.eventHandlers[a], this;
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            if (e === b) {
                c.splice(d, 1);
                break
            }
        }
        return this
    }, a.prototype.removeListener = function(a, b) {
        return this.off(a, b)
    }, a.prototype.removeEventListener = function(a, b) {
        return this.off(a, b)
    }, a.prototype.removeAllListeners = function() {
        return this.eventHandlers = {}, this
    }, a.prototype.emit = function(a) {
        for (var b = [], c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
        var d = this.eventHandlers[a];
        if (d) {
            d = d.slice(0);
            for (var e = 0, f = d; e < f.length; e++) {
                var g = f[e];
                g.apply(void 0, b)
            }
        }
        return this
    }, a.prototype.listeners = function(a) {
        return this.eventHandlers[a] || []
    }, a.prototype.hasListeners = function(a) {
        return !!this.listeners(a).length
    }, a
}();
/**/
angular.module("userControlsDirectives").directive("keysetAssign", keysetAssign), angular.module("userControlsDirectives").directive("expander", ["userService", Expander]), angular.module("userControlsDirectives").directive("ccConnectionContainer", connectionContainer);
/**/
var ConnectionContainerCtrl = function() {
        function a(a, b) {
            var c = this;
            switch (this.showRoleLabels = "role", this.showVoxStatus = !0, this.bridges = [], this.showEvents = !1, this.hideBridgeOptions = !0, a.$watch(function() {
                    return c.connectionStatus
                }, function() {
                    c.updateBridges(), c.hideBridgeOptions = c.shouldHideBridgeOptions(), c.infoText = c.getInfoText()
                }, !0), a.$watch(function() {
                    return c.roles
                }, function() {
                    c.updateBridges()
                }), this.connection.type) {
                case "partyline":
                    this.partialTemplateUrl = "user_controls/connectionContainer/channelAndGroup.html";
                    break;
                case "group":
                    this.partialTemplateUrl = "user_controls/connectionContainer/group.html";
                    break;
                case "direct":
                    this.partialTemplateUrl = "user_controls/connectionContainer/direct.html"
            }
            this.devices[0].deviceType_name.indexOf("FSII") === -1 ? this.showEvents = !0 : this.showVoxStatus = !1, this.panelDataEnabledText = b("Matrix-Data Enabled"), this.sipControlEnabledText = b("Matrix-Data Enabled")
        }
        return a.$inject = ["$scope", "gettext"], a.prototype.updateBridges = function() {
            var a = [];
            if (this.connectionStatus) {
                var b = function(b) {
                        var d = c.connectionStatus.participants[b],
                            e = c.displayBorder(d);
                        if (!d.multiChannel && e && "direct" !== c.connection.type) {
                            var f = a.find(function(a) {
                                return a.deviceId === d.deviceId && !a.multiChannel && a.displayBorder
                            });
                            f ? (f.participants.push(d), f.joinState.talk = f.joinState.talk || c.isJoinStateTalk(d), f.joinState.listen = f.joinState.listen || c.isJoinStateListen(d)) : a.push(c.createBridge(d, e))
                        } else a.push(c.createBridge(d, e))
                    },
                    c = this;
                for (var d in this.connectionStatus.participants) b(d)
            }
            if ("direct" === this.connection.type)
                for (; a.length < 2;) a.push(void 0);
            this.bridges = a
        }, a.prototype.showNetworkQuality = function(a) {
            if (!a) return {
                "stroke-dasharray": "0 100"
            };
            switch (a.type) {
                case 4:
                    return {
                        "stroke-dasharray": "41 100"
                    };
                case 3:
                    return {
                        "stroke-dasharray": "32 100"
                    };
                case 2:
                    return {
                        "stroke-dasharray": "21 100"
                    };
                case 1:
                    return {
                        "stroke-dasharray": "12 100"
                    };
                case 0:
                    return {
                        "stroke-dasharray": "6 100"
                    };
                case 5:
                    return {
                        "stroke-dasharray": "3"
                    }
            }
        }, a.prototype.canExecuteDisassociateCommand = function(a) {
            return "endpoint" !== a.type && (a.online && !a.pending)
        }, a.prototype.createBridge = function(a, b) {
            var c = this.devices.find(function(b) {
                return b.device_id === a.deviceId
            });
            return {
                deviceId: a.deviceId,
                multiChannel: a.multiChannel,
                displayBorder: b,
                label: c ? c.device_isMaster ? "LM" : c.device_id.toString() : "",
                participants: [a],
                sortId: ("endpoint" === a.type ? 1 : 0) + "_" + a.deviceId + "_" + (a.multiChannel ? 1 : 0) + "_" + a.label + "_" + this.bridges.length,
                joinState: {
                    talk: this.isJoinStateTalk(a),
                    listen: this.isJoinStateListen(a)
                }
            }
        }, a.prototype.isJoinStateTalk = function(a) {
            return !!a.liveStatus && ("Talk" === a.liveStatus.joinState || "Talk-Listen" === a.liveStatus.joinState)
        }, a.prototype.isJoinStateListen = function(a) {
            return !!a.liveStatus && ("Listen" === a.liveStatus.joinState || "Talk-Listen" === a.liveStatus.joinState)
        }, a.prototype.shouldHideBridgeOptions = function() {
            var a = this.connectionStatus.participants,
                b = Object.keys(a);
            return 2 === b.length && a[b[0]].deviceId === a[b[1]].deviceId
        }, a.prototype.getInfoText = function() {
            var a = this.connectionStatus.participants,
                b = Object.keys(a);
            if (2 === b.length) {
                var c = a[b[0]].type,
                    d = a[b[1]].type;
                if ("4W" === c && "4W" === d) return this.panelDataEnabledText;
                if (("4W" === c || "IVC" === c) && "SIP" === d || "SIP" === c && ("4W" === d || "IVC" === d)) return this.sipControlEnabledText
            }
            return ""
        }, a.prototype.displayBorder = function(a) {
            if ("endpoint" === a.type) return !1;
            var b = this.devices.find(function(b) {
                return b.device_id === a.deviceId
            });
            return !!b && 0 === b.deviceType_name.indexOf("LQ")
        }, a
    }(),
    CcConnectionParticipant = function() {
        function a(a, b, c) {
            this.$uibModal = a, this.$document = b, this.gettext = c, this.getEndpointIdString = function(a) {
                return a ? String("000000" + a).slice(-6) : ""
            }
        }
        return a.$inject = ["$uibModal", "$document", "gettext"], a.prototype.getConnectionDisplayString = function(a) {
            return "beltpackId" == this.showRoleLabels && "endpoint" === a.type && a.liveStatus && a.liveStatus.id ? this.getEndpointIdString(a.liveStatus.id) : "role" == this.showRoleLabels && void 0 !== a.roleLabel ? a.roleLabel : a.label
        }, a.prototype.getParticipantStatusClass = function() {
            var a = [];
            return "SIP" === this.participant.type && (!this.participant.online || this.participant.pending || this.hasActiveCall(this.participant) || a.push("selectable"), 0 !== this.participant.sipCalls.length && a.push("conn-port-has-active-sip-line")), this.participant.online ? this.participant.pending && a.push("pending") : a.push("offline"), a
        }, a.prototype.hangupSipCall = function(a) {
            this.onHangupSipCall({
                call: a
            })
        }, a.prototype.getCallLabel = function(a) {
            return a.uri || this.gettext("Connecting...")
        }, a.prototype.showSipDialOut = function() {
            var a = this;
            !this.participant.online || this.participant.pending || this.hasActiveCall(this.participant) || this.$uibModal.open({
                templateUrl: "views/dialogs/sipDialOut.html",
                controller: "sipDialOutCtrl",
                controllerAs: "ctrl",
                bindToController: !0,
                size: "lg",
                backdrop: "true",
                appendTo: this.$document.find(".conn-container-collection"),
                resolve: {
                    portRes: function() {
                        return a.participant.res
                    }
                }
            })
        }, a.prototype.hasActiveCall = function(a) {
            return void 0 !== a.sipCalls.find(function(a) {
                return a.liveStatus.inProgress
            })
        }, a
    }();
/**/
angular.module("userControlsDirectives").component("ccConnectionParticipant", {
    bindings: {
        participant: "<",
        showRoleLabels: "<",
        showVoxStatus: "<",
        onHangupSipCall: "&",
        onShowSipDial: "&"
    },
    controller: CcConnectionParticipant,
    templateUrl: "/user_controls/connectionParticipant/connectionParticipant.html"
}), angular.module("gettext").run(["gettextCatalog", function(a) {}]), angular.module("moonraker").factory("navbarService", [function() {
    var a = "",
        b = "ok";
    return {
        getActiveNavButton: a,
        setActiveNavButton: function(b) {
            a = b
        },
        getSystemStatus: b,
        setSystemStatus: function(a) {
            b = a
        }
    }
}]), angular.module("moonraker").component("ccmnavbar", {
    templateUrl: "/views/navbar.html",
    controller: navBarController,
    controllerAs: "ctrl"
}), angular.module("moonraker").controller("errorCtrl", ["$location", function(a) {
    console.log("error controler"), "/view/devices" != a.path() && (a.path("/view/devices"), window.location.reload(!0))
}]);
/**/
var CCUtils = function() {
    function a() {}
    return a.copyObjectPreserveRefs = function(a, b) {
        var c;
        for (c in b) b.hasOwnProperty(c) && null == a[c] && delete b[c];
        for (c in a)
            if (a.hasOwnProperty(c)) {
                var d = a[c];
                angular.isArray(d) ? (angular.isArray(b[c]) || (b[c] = []), this.copyArrayPreserveRefs(d, b[c])) : angular.isObject(d) ? (angular.isObject(b[c]) || (b[c] = {}), this.copyObjectPreserveRefs(d, b[c])) : b[c] = d
            }
    }, a.copyArrayPreserveRefs = function(b, c) {
        c.length != b.length && (c.length = 0);
        for (var d = 0; d < b.length; ++d) c.length === d && c.push(null), angular.isArray(b[d]) ? (angular.isArray(c[d]) || (c[d] = []), a.copyArrayPreserveRefs(b[d], c[d])) : angular.isObject(b[d]) ? (angular.isObject(c[d]) || (c[d] = {}), a.copyObjectPreserveRefs(b[d], c[d])) : c[d] = b[d]
    }, a.arrayUpdate = function(b, c, d) {
        var e = !1;
        if (!angular.equals(c, d)) {
            for (var f = {}, g = 0; g < c.length; g++) f[c[g][b]] = c[g];
            for (var h = 0, i = d; h < i.length; h++) {
                var j = i[h],
                    k = j[b];
                f[k] ? (angular.equals(j, f[k]) || a.copyObjectPreserveRefs(j, f[k]), delete f[k]) : (e = !0, c.push(j))
            }
            for (var l in f)
                for (var j = f[l], m = 0; m < c.length; m++)
                    if (c[m][b] == j[b]) {
                        c.splice(m, 1);
                        break
                    }
        }
        return e
    }, a.objectUpdate = function(b, c) {
        angular.equals(b, c) || a.copyObjectPreserveRefs(c, b)
    }, a.getPropertyByPath = function(a, b) {
        return b.split(".").reduce(function(a, b) {
            return a[b]
        }, a)
    }, a.setPropertyByPath = function(a, b, c) {
        for (var d = b.split("."), e = a, f = 0; f < d.length - 1; f++) null == e[d[f]] && (e[d[f]] = {}), e = e[d[f]];
        return e[d[d.length - 1]] = c, a
    }, a.arrayToMap = function(a, b) {
        return a.reduce(function(a, c) {
            return a[c[b]] = c, a
        }, {})
    }, a.hasNestedProperty = function(a) {
        for (var b = [], c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
        for (var d = 0; d < b.length; d++) {
            if (!a || !a.hasOwnProperty(b[d])) return !1;
            a = a[b[d]]
        }
        return !0
    }, a
}();
/**/
CCUtils.downloadAction = {
    method: "GET",
    headers: {
        accept: "application/octet-stream"
    },
    responseType: "arraybuffer",
    transformResponse: function(a, b, c) {
        if (c >= 200 && c <= 299) {
            var d = b("content-disposition") ? b("content-disposition").split(";")[1].trim().split("=")[1].replace(/"/g, "") : null,
                e = void 0;
            return a && (e = new Blob([a], {
                type: "application/octet-stream"
            })), {
                blob: e,
                fileName: d
            }
        }
        var f = String.fromCharCode.apply(null, new Uint8Array(a)),
            g = b("Content-Type");
        if (g && 0 === g.indexOf("application/json")) try {
            return angular.fromJson(f)
        } catch (h) {
            return f
        }
    }
};
/**/
var PageGuideService = function() {
    function a(a, b) {
        this.$window = a, this.$rootScope = b, this.$rootScope.guideEnabled = !1
    }
    return a.$inject = ["$window", "$rootScope"],
        a.prototype.toggleGuide = function() {
            this.$window.tl.pg.destroy(), this.currentGuide && (this.currentGuide = null), this.$rootScope.guideEnabled = !this.$rootScope.guideEnabled, this.$rootScope.guideEnabled && this.openGuide(this.defaultGuide)
        }, a.prototype.openGuide = function(a) {
            if (this.currentGuide === a) return void this.pageguide.open();
            this.$window.tl.pg.destroy(), this.currentGuide = a;
            var b = this.pageguide = this.$window.tl.pg.init({
                auto_refresh: !0,
                default_zindex: 1e4,
                steps_element: "#" + a + "PageGuide",
                custom_open_button: angular.element("#guideDummy"),
                ready_callback: function() {
                    b.open()
                }
            })
        }, a.prototype.cleanupGuide = function() {
            this.$window.tl.pg.destroy(), this.$rootScope.guideEnabled = !1, this.currentGuide = null
        }, a
}();
/**/
angular.module("moonraker").service("pageGuideService", PageGuideService);
/**/
var app = angular.module("moonraker");
/**/
app.factory("naturalSort", ["$locale", function(a) {
    var b = {},
        c = function(a) {
            return "00000000000000000000".slice(a.length)
        },
        d = function(a) {
            return a.replace(/(\d+)((\.\d+)+)?/g, function(a, b, d, e) {
                return d !== e ? a.replace(/(\d+)/g, function(a) {
                    return c(a) + a
                }) : (d = d || ".0", c(b) + b + d + c(d))
            })
        },
        e = function(a) {
            if (b[a]) return b[a];
            var c = d(a.trim());
            return b[a] = c, c
        };
    return {
        naturalValue: e,
        naturalSort: function(a, b) {
            return a = e(a), b = e(b), a.localeCompare(b)
        }
    }
}]), app.run(["$rootScope", "naturalSort", function(a, b) {
    a.naturalSort = function(a) {
        return function(c) {
            return b.naturalValue(c[a])
        }
    }
}]);
/**/
var deviceFactory = angular.module("moonraker");
/**/
deviceFactory.factory("UpdateDevice", ["$resource", function(a) {
    return a("/api/:version/devices/:deviceId", {
        version: "@version",
        deviceId: "@deviceId"
    }, {
        update: {
            method: "PUT"
        }
    })
}]), deviceFactory.factory("PerformActionOnDevice", ["$resource", function(a) {
    return a("/api/:version/devices/:deviceId/:action", {
        version: "@version",
        deviceId: "@deviceId",
        action: "@action"
    }, {
        updateLinkingConfig: {
            method: "POST"
        },
        resetToDefault: {
            method: "POST",
            params: {
                action: "resettodefault"
            }
        },
        restartServices: {
            method: "POST"
        },
        reboot: {
            method: "POST"
        },
        snapshot: {
            method: "POST"
        },
        updateLicensePasscode: {
            method: "POST"
        },
        snapshotinfo: {
            method: "GET"
        },
        wibuActivationinfo: {
            method: "GET"
        },
        wibuUpdate: {
            method: "POST"
        },
        wibuRetry: {
            method: "POST"
        },
        startOTA: {
            method: "POST"
        },
        setNetMode: {
            method: "POST"
        },
        setGPO: {
            method: "POST"
        },
        setGPI: {
            method: "POST"
        },
        setDateTime: {
            method: "POST"
        },
        getDateTime: {
            method: "GET"
        }
    })
}]), deviceFactory.factory("UpgradeDevice", ["$resource", function(a) {
    return a("/api/:version/devices/:deviceId/upgrade", {
        version: "@version",
        deviceId: "@deviceId"
    }, {
        refresh: {
            method: "GET",
            timeout: 1e4
        },
        exec: {
            method: "POST"
        }
    })
}]), deviceFactory.factory("UpgradeDevice", ["$resource", function(a) {
    return a("/api/:version/devices/:deviceId/upgrade", {
        version: "@version",
        deviceId: "@deviceId"
    }, {
        refresh: {
            method: "GET",
            timeout: 1e4
        },
        exec: {
            method: "POST"
        }
    })
}]), deviceFactory.factory("DeviceIp", function() {
    function a(a, b) {
        if (!a) return [];
        var c = a.split(":");
        return 2 == c.length ? (c[1] = parseInt(c[1]), isNaN(c[1]) ? [] : c) : 1 == c.length ? (c.push(b), c) : []
    }

    function b(a) {
        return a.length <= 255 && h.test(a)
    }

    function c(a) {
        if (a) {
            var b = a.match(g);
            if (b) return [b[1], b[2], b[3], b[4]]
        }
        return null
    }

    function d(a) {
        if (a) {
            var b = a.match(g);
            if (b && "172" == b[1] && "23" == b[2]) return !0
        }
        return !1
    }

    function e(a) {
        if (a) {
            var b = a.match(g);
            if (b) {
                var c = +b[1];
                return !(127 === c || c >= 224 && c <= 239)
            }
        }
        return !1
    }

    function f(a) {
        if (a && g.test(a)) {
            var b = (~a.split(".").reduce(function(a, b) {
                    return (a << 8) + parseInt(b)
                }, 0) >>> 0).toString(2),
                c = b.indexOf("0") === -1 ? 32 - b.length : 32;
            if ([0, 1, 31, 32].indexOf(c) === -1) return !0
        }
        return !1
    }
    var g = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        h = /^[a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[a-z\d])?)*$/i;
    return {
        splitPort: a,
        matchIp: c,
        isIpReserved: d,
        isIpValidForInterface: e,
        isNetMaskValid: f,
        isValidHostName: b
    }
});
/**/
var DevicesService = function() {
    function a(a, b, c, d, e) {
        this.$rootScope = b, this.$q = c, this.socket = d, this.$route = e, this.hostIdCache = null, this.devicesCache = null, this.deviceResource = a("/api/2/devices/:deviceId/:action", {
            deviceId: "@deviceId",
            action: "@action"
        }, {
            download: CCUtils.downloadAction
        }), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$rootScope", "$q", "socket", "$route"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:devices", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "devices", {
        get: function() {
            var a = this;
            return this.devicesCache || (this.devicesCache = this.fetchDevices(), this.devicesCache["catch"](function() {
                return a.devicesCache = null
            })), this.devicesCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "devicesMap", {
        get: function() {
            return this.devices.then(function(a) {
                return a.reduce(function(a, b) {
                    return a[b.device_id] = b, a
                }, {})
            })
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.getDevice = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.devices.then(function(b) {
                var e;
                e = 0 === a ? b.find(function(a) {
                    return a.isHost
                }) : b.find(function(b) {
                    return b.device_id === a
                }), e ? c(e) : d(new Error("Cannot find device with ID " + a))
            })["catch"](function(a) {
                return d(a)
            })
        })
    }, Object.defineProperty(a.prototype, "currentDevice", {
        get: function() {
            return this.getDevice(parseInt(this.$route.current.params.deviceId))
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.deleteDevice = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.deviceResource["delete"]({
                deviceId: a
            }, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.setupNetwork = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.deviceResource.save({
                deviceId: a,
                action: "setupnetwork"
            }, {
                network: b
            }, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.backupFile = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.deviceResource.download({
                action: "backup",
                name: a
            }, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, Object.defineProperty(a.prototype, "hostId", {
        get: function() {
            return this.hostIdCache || (this.hostIdCache = this.devices.then(function(a) {
                var b = a.find(function(a) {
                    return a.isHost
                }).device_id;
                if (void 0 === b) throw console.error('hostId(): None of the devices has "isHost" set to TRUE!'), new Error("Unable to resolve hostId");
                return b
            })), this.hostIdCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.resolveDeviceId = function(a) {
        return 0 === a ? this.hostId : this.$q.resolve(a)
    }, a.prototype.getRemoteDevices = function(a, b) {
        var c = b ? a + ":" + b : a;
        return this.deviceResource.query({
            proxytarget: c
        }).$promise
    }, a.prototype.fetchDevices = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.deviceResource.query(function(a) {
                b(a)
            }, function(a) {
                return c(a)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.devicesCache = null, this.hostIdCache = null, this.$rootScope.$emit("live:devices")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                devices: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    devices: "start"
                }), a.updateAndNotify()
            }), b.on("live:devices", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("devicesService", DevicesService);
/**/
var mobileService = angular.module("moonraker");
/**/
mobileService.factory("ClientInfoService", ["$window", function(a) {
    var b = function() {
        var b = navigator.userAgent || navigator.vendor || a.opera;
        return /(android|bb\d+|meego|ipad|playbook|silk|ipod|iphone).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4))
    };
    return {
        isMobile: b
    }
}]), angular.module("moonraker").factory("socket", socket);
angular.module("moonraker").factory("deviceCfgBtnGroupService", ["$window", "gettext", function(a, b) {
    var c = [{
            name: "General",
            route: "device.general",
            text: b("General"),
            icon: "/images/Navigation/General.svg"
        }, {
            name: "Station",
            route: "device.settings",
            text: b("Station"),
            icon: "/images/station.png"
        }, {
            name: "Network",
            route: "device.network",
            text: b("Network"),
            icon: "/images/Navigation/Network.svg"
        }, {
            name: "Linking",
            route: "device.linking",
            text: b("Linking"),
            icon: "/images/Navigation/Linking.svg"
        }, {
            name: "Ports",
            route: "device.ports",
            text: b("Ports"),
            icon: "/images/Navigation/Ports.svg"
        }, {
            name: "Events",
            route: "device.events",
            text: b("Event Log"),
            icon: "/images/events.png"
        }],
        d = "General";
    return {
        getButtons: c,
        getButton: function(a) {
            var b = null;
            return angular.forEach(c, function(c) {
                c.name == a && (b = c)
            }), b
        },
        getActive: d,
        setActive: function(a) {
            d = a
        }
    }
}]);
/**/
var app = angular.module("moonraker");
/**/
app.factory("showModalConfirm", ["$uibModal", "gettext", function(a, b) {
        return function(c, d, e, f, g, h) {
            var i = a.open({
                templateUrl: "views/dialogs/confirm.html",
                controller: "ModalInstanceConfirmCtrl",
                size: c,
                backdrop: "static",
                resolve: {
                    modalMessage: function() {
                        return {
                            message: d,
                            question: e,
                            ok: f ? f : b("Yes"),
                            cancel: g ? g : b("No")
                        }
                    }
                }
            });
            return i.result.then(function() {
                h && h(!0)
            }, function() {
                h && h(!1)
            }), i
        }
    }]), app.factory("showModalAlert", ["$uibModal", "gettext", function(a, b) {
        return function(c, d) {
            var e = a.open({
                template: '<div style="text-align:center;" class="modal-header"><h4  class="modal-title">' + c + '</h4></div><div class="modal-footer"><button style="float:right; margin-right: 1px" class="btn btn-success" ng-click="ok()">OK</button></div>',
                controller: "ModalInstanceAlertCtrl",
                backdrop: "static",
                placement: "bottom",
                animation: "am-flip-x",
                size: "sm",
                resolve: {
                    modalMessage: function() {
                        return {
                            message: c,
                            ok: b("OK")
                        }
                    }
                }
            });
            return e.result.then(function() {
                d && d(!0)
            }, function() {
                d && d(!1)
            }), e
        }
    }]),
    function() {
        angular.module("moonraker").directive("ccDeviceContainer", function() {
            return {
                restrict: "E",
                scope: {
                    device: "<",
                    devicesList: "<?",
                    supportedInterfaces: "<",
                    status: "@",
                    navTarget: "@",
                    warnings: "@",
                    psuMonitoring: "<?",
                    border: "<?",
                    selection: "<?",
                    linking: "<?",
                    isMasterReachable: "<?",
                    resourceMeter: "<?",
                    navOnClick: "&?",
                    selectOnClick: "&?",
                    changeDevice: "&?"
                },
                controller: function() {
                    var a = this;
                    a.name = "deviceContainer", a.toggleDevicesDropDown = function(a) {}, a.hasDeviceConflict = function() {
                        return "CONFLICT" === a.device.device_masterStatus
                    }, a.isDeviceMaster = function() {
                        return "linkMaster" === a.device.device_linking
                    }, a.getDeviceIp = function() {
                        return "HMS-4X" !== a.device.deviceType_name && a.device.isHost ? a.device.device_settings.network.staticIP : a.device.device_ipAddress
                    }, angular.isUndefined(a.isMasterReachable) && (a.isMasterReachable = !0)
                },
                controllerAs: "dir",
                bindToController: !0,
                templateUrl: "/views/components/deviceContainer.directive.html"
            }
        })
    }();
/**/
var CcDeviceIvcContainerCtrl = function() {
    function a() {
        this.numberOfConnectedPorts = 0, this.numberOfAssignedPorts = 0
    }
    return a.prototype.$onChanges = function(a) {
        a.externalDevice && this.onExternalDeviceUpdate(a.externalDevice.currentValue)
    }, a.prototype.onExternalDeviceUpdate = function(a) {
        var b = 0,
            c = 0;
        if (a.ports)
            for (var d in a.ports) {
                var e = a.ports[d];
                0 !== e.settings.assignedDeviceId && (c++, !e.liveStatus || "connected" !== e.liveStatus.externalConnectionStatus && 200 !== e.liveStatus.sipRegistrationStatusCode || b++)
            }
        this.numberOfAssignedPorts = c, this.numberOfConnectedPorts = b
    }, a
}();
/**/
angular.module("moonraker").component("ccDeviceIvcContainer", {
    bindings: {
        externalDevice: "<device"
    },
    controller: CcDeviceIvcContainerCtrl,
    controllerAs: "ctrl",
    templateUrl: "/views/components/externalDeviceIvcContainer.directive.html"
}), angular.module("moonraker").directive("ccWhilePressed", whilePressed), angular.module("moonraker").controller("deviceListCtrl", deviceListCtrl);
/**/
var GPIOType;
/**/
! function(a) {
    a[a.GPI = 0] = "GPI", a[a.GPO = 1] = "GPO"
}(GPIOType || (GPIOType = {})), angular.module("moonraker").controller("deviceMenuCtrl", deviceMenuCtrl), angular.module("moonraker").controller("deviceViewCtrl", deviceViewCtrl), angular.module("moonraker").controller("devCfgCommonCtrl", devCfgCommonCtrl), angular.module("moonraker").controller("devCfgBtnGroupCtrl", devCfgBtnGroupCtrl), angular.module("moonraker").controller("deviceCfgGeneralCtrl", deviceCfgGeneralCtrl);
/**/
var DeviceCfgLicenseCtrl = function() {
    function a(a, b, c, d, e, f, g) {
        var h = this;
        this.FileSaver = e, this.licenseService = f, this.pageGuideService = g, this.activatableLicenses = [], this.regexTicket = "^([A-Z0-9]{5}-){4}[A-Z0-9]{5}$", this.addNewOnlineLicenseVisible = !1, this.addNewOfflineLicenseVisible = !1, this.errorResponse = "", this.goodResponse = "", this.activationInProgress = !1, this.contextFileDownloadInProgress = !1, this.ticketHasActivations = !0, this.baseFeatures = ["AGENT-IC-LQ", "SIP8-LQ"], this.licensesForActivation = {}, this.vm = this, this.vm.root = b, this.sharedVM = b.devSharedVM, this.vm.root.helpUrl = "help/Content/Terminator/CCM/Context%20sensitive/license.htm", this.contextUploader = new d({
            alias: "file",
            url: "/api/1/devices/" + this.sharedVM.device.device_id + "/license/upload",
            autoUpload: !0,
            removeAfterUpload: !0
        }), this.contextUploader.filters.push({
            name: "customeFilter",
            fn: function(a, b) {
                return !(a.size > h.sharedVM.deviceCapability.upgrade.maxSize) || (h.errorResponse = c("File too big"), !1)
            }
        }), this.contextUploader.onBeforeUploadItem = function(a) {
            h.activationInProgress = !0, h.errorResponse = "", h.goodResponse = ""
        }, this.contextUploader.onProgressItem = function(a, b) {}, this.contextUploader.onSuccessItem = function(a, b, c, d) {
            h.goodResponse = "License applied successfully", h.hideAddOfflineLicense(), h.hideAddOnlineLicense(), h.activationInProgress = !1
        }, this.contextUploader.onErrorItem = function(a, b, c, d) {
            h.errorResponse = b.message, h.activationInProgress = !1
        }, a.$on("$destroy", function() {
            g.cleanupGuide()
        })
    }
    return a.$inject = ["$scope", "$rootScope", "gettext", "FileUploader", "FileSaver", "licenseService", "pageGuideService"], a.prototype.validateTicket = function() {
        var a = this,
            b = this.ticketId.replace(/[^a-zA-Z0-9]/g, "");
        this.ticketId = this.licenseService.decorateTicketId(b), this.errorResponse = "", this.goodResponse = "", this.ticketHasActivations = !0, 25 === b.length ? this.licenseService.getTicketInformation(this.vm.sharedVM.device.device_id, b).then(function(b) {
            a.activatableLicenses = b.features, 0 === a.activatableLicenses.length && (a.ticketHasActivations = !1);
            for (var c in a.activatableLicenses) {
                var d = 0;
                for (var e in a.sharedVM.device.licensedFeatures) a.sharedVM.device.licensedFeatures[e].name === a.activatableLicenses[c].name && (d = a.sharedVM.device.licensedFeatures[e].qty);
                a.licensesForActivation[a.activatableLicenses[c].name] = {
                    qty: 0,
                    available: a.activatableLicenses[c].qty,
                    licensed: d,
                    selected: !1
                }
            }
        })["catch"](function(b) {
            a.errorResponse = b.data.message
        }) : 0 === b.length || (this.errorResponse = "There are too " + (b.length > 25 ? "many" : "few") + " characters in the ticket provided")
    }, a.prototype.updateActivationInformation = function() {
        var a = this;
        this.activationInProgress = !0;
        var b = this.ticketId.replace(/-/g, ""),
            c = [];
        this.errorResponse = "", this.goodResponse = "";
        for (var d in this.licensesForActivation) this.licensesForActivation[d].selected && this.licensesForActivation[d].qty > 0 && c.push({
            name: d,
            qty: +this.licensesForActivation[d].qty
        });
        this.licenseService.updateActivationInformation(this.vm.sharedVM.device.device_id, b, c).then(function(b) {
            a.goodResponse = b.message, a.hideAddOfflineLicense(), a.hideAddOnlineLicense()
        })["catch"](function(b) {
            a.errorResponse = b.data.message
        })["finally"](function() {
            a.activationInProgress = !1
        })
    }, a.prototype.openGuide = function() {
        this.pageGuideService.openGuide("devNetwork")
    }, a.prototype.showAddOnlineLicense = function() {
        this.addNewOnlineLicenseVisible = !0, this.addNewOfflineLicenseVisible = !1
    }, a.prototype.hideAddOnlineLicense = function() {
        this.ticketId = "", this.activatableLicenses = [], this.ticketHasActivations = !0, this.addNewOnlineLicenseVisible = !1
    }, a.prototype.showAddOfflineLicense = function() {
        this.addNewOnlineLicenseVisible = !1, this.addNewOfflineLicenseVisible = !0
    }, a.prototype.hideAddOfflineLicense = function() {
        this.addNewOfflineLicenseVisible = !1
    }, a.prototype.licenseTypeToFriendlyName = function(a) {
        return this.licenseService.licensableFeatures[a] ? this.licenseService.licensableFeatures[a].friendlyName : a
    }, a.prototype.isLicensingOpen = function() {
        return this.addNewOnlineLicenseVisible || this.addNewOfflineLicenseVisible
    }, a.prototype.getMaximum = function(a) {
        if (this.licenseService.licensableFeatures[a.name]) {
            for (var b in this.sharedVM.device.licensedFeatures)
                if (this.sharedVM.device.licensedFeatures[b].name === a.name) return Math.min(this.licenseService.licensableFeatures[a.name].maximum - this.sharedVM.device.licensedFeatures[b].qty, a.qty);
            return Math.min(this.licenseService.licensableFeatures[a.name].maximum, a.qty)
        }
        return 0
    }, a.prototype.getMaximumForLicenseType = function(a) {
        return this.licenseService.licensableFeatures[a.name].maximum
    }, a.prototype.hasLicenseSelected = function() {
        for (var a in this.licensesForActivation)
            if (this.licensesForActivation[a].selected && this.licensesForActivation[a].qty > 0) return !0;
        return !1
    }, a.prototype.isLicenseSelectable = function(a) {
        if (a) {
            var b = this.licenseService.licensableFeatures[a.name];
            if (b && b.dependencies && b.dependencies.exclusive)
                for (var c = 0, d = b.dependencies.exclusive; c < d.length; c++) {
                    var e = d[c];
                    if (this.licensesForActivation[e] && this.licensesForActivation[e].selected || this.licenseService.getNumberOfLicensedUsers(this.sharedVM.device, e) > 0) return !1
                }
        } else
            for (var f = 0, g = this.activatableLicenses; f < g.length; f++) {
                var h = g[f];
                if (!this.isLicenseSelectable(h)) return !1
            }
        return !0
    }, a.prototype.featureOrdering = function() {
        var a = this.licenseService,
            b = this.sharedVM.device;
        return function(c) {
            var d = a.licensableFeatures[c].regexp;
            return b.licensedFeatures.some(function(a) {
                return d.test(a.name)
            }) ? 0 : 1
        }
    }, a.prototype.printFeatureText = function(a) {
        if (this.licenseService.licensableFeatures[a]) {
            var b = this.licenseService.getNumberOfLicensedUsers(this.sharedVM.device, this.licenseService.licensableFeatures[a].regexp);
            return b > 0 ? b + "x " + this.licenseService.licensableFeatures[a].featureName : this.licenseService.licensableFeatures[a].unlicensedText
        }
        return ""
    }, a.prototype.downloadContextFile = function() {
        var a = this;
        this.contextFileDownloadInProgress = !0, this.licenseService.getContextFile(this.sharedVM.device.device_id).then(function(b) {
            a.FileSaver.saveAs(b.blob, b.fileName)
        })["catch"](function(b) {
            a.errorResponse = b.data.message
        })["finally"](function() {
            a.contextFileDownloadInProgress = !1
        })
    }, a
}();
/**/
angular.module("moonraker").controller("deviceCfgLicenseCtrl", DeviceCfgLicenseCtrl), angular.module("moonraker").controller("deviceCfgLinkingCtrl", ["$scope", "$rootScope", "$uibModal", "$location", "gettext", "DeviceIp", "PerformActionOnDevice", "devicesService", "pageGuideService", "linkGroupCapabilities", "linkGroupCapabilitiesService", function(a, b, c, d, e, f, g, h, i, j, k) {
    function l(a) {
        p.masterIp = a || p.sharedVM.device.device_masterAddress, p.mgmtPort != p.sharedVM.device.device_masterPort && (p.masterIp = p.masterIp + ":" + p.sharedVM.device.device_masterPort)
    }

    function m(a) {
        if (a) {
            var b = f.splitPort(a, p.mgmtPort);
            return b[0] && (p.sharedVM.deviceCapability.linking.nameResolution || f.matchIp(b[0])) ? b : null
        }
    }

    function n() {
        p.slots = [];
        for (var a = 0; a < p.sharedVM.deviceCapability.linking.maxDevices; a++) 0 === a ? p.slots.push({
            slotId: a + 1,
            inUse: !0,
            isMaster: !0,
            isHost: !1,
            label: "Link Master"
        }) : p.slots.push({
            slotId: a + 1,
            inUse: !1,
            isMaster: !1,
            isHost: !1,
            label: ""
        })
    }

    function o(a, b) {
        p.slotUpdatePending = !0, p.linkingErrorTitle = null, p.masterUnreachable = !1, h.getRemoteDevices(a, b).then(function(a) {
            p.slotUpdatePending = !1;
            for (var b = 0, c = a; b < c.length; b++) {
                var d = c[b];
                if (d.isHost && (r(d.device_linking) || d.device_isMaster)) {
                    var f = d.deviceType_name;
                    if ("HMS-4X" === p.sharedVM.device.deviceType_name && "HMS-4X" !== f) return p.masterIp = null, p.linkingErrorTitle = e("The Link-Master has to be another HelixNet Main Station"), void(p.linkingErrorInfo = e("The specified Link-Master is of type " + f));
                    var g = d.linkingVersion;
                    return g !== p.sharedVM.device.linkingVersion ? (p.masterIp = null, p.linkingErrorTitle = e("The version on the Link-Master is not compatible."), void(g < p.sharedVM.device.linkingVersion ? p.linkingErrorInfo = e("Either update the version on the Link-Master or specify a different Link-Master.") : p.linkingErrorInfo = e("Either update the version on this device or specify a different Link-Master."))) : (p.devicesKnownByRemote = a, void w(p.devicesKnownByRemote, p.sharedVM.device.device_id))
                }
            }
            p.masterIp = null, p.linkingErrorTitle = e("Invalid Link-Master"), p.linkingErrorInfo = e("Please Select another Link-Master")
        })["catch"](function(a) {
            p.masterUnreachable = !0, p.linkingWarning = e("Connection to Linkmaster failed or was refused!") + " " + e("Device ID Validation will not be possible"), w(null, 2), p.slotUpdatePending = !1
        })
    }
    var p = this;
    p.root = b, p.sharedVM = b.devSharedVM, p.mgmtPort = 80, p.openGuide = function() {
        i.openGuide("devLinking")
    }, a.$on("$destroy", function() {
        i.cleanupGuide()
    });
    var q = function(a) {
        p.showLinkGroupOptimization = a.networkOptimization && a.networkOptimization.length > 0, p.showLinkGroupOptimizationDropdown = a.networkOptimization && a.networkOptimization.length > 1
    };
    q(j), k.subscribe(a, function() {
        k.linkGroupCapabilities.then(function(a) {
            q(a)
        })
    });
    var r = function(a) {
            return "linkMaster" == a
        },
        s = function(a) {
            return "disabled" == a
        };
    p.currentLinkingMode = p.sharedVM.device.device_linking, p.pendingLinkingMode = p.sharedVM.device.device_linking, p.linkingDisabled = s(p.sharedVM.device.device_linking), p.lmModeSelected = r(p.sharedVM.device.device_linking), p.lastSlotSelected = p.sharedVM.device.device_id, p.netMode = p.sharedVM.device.device_netMode || "WAN", p.LinkingOptions = p.sharedVM.deviceCapability.linking.options, p.LinkingOptions.forEach(function(a) {
        "disabled" === a.value && (p.linkingLabel = e("Linking Mode"))
    }), p.controllerName = "deviceCfgLinkingCtrl", p.invalidMasterIp = !1, p.masterUnreachable = !1, p.devicesInMyLINQGroup = 0, p.devicesKnownByRemote = 0, p.linkingLabel = e("Link-Group Role"), p.netModeOptions = [{
        value: "LAN",
        label: e("LAN/WAN Routed Network")
    }, {
        value: "WAN",
        label: e("Internet/NATed Network")
    }], p.showNetOptions = function(a) {
        var b = "";
        return a ? p.netModeOptions.forEach(function(c) {
            c.value == a && (b = c.label)
        }) : p.netModeOptions.forEach(function(a) {
            a["default"] && (b = a.label)
        }), b
    }, p.showLinkingOptions = function(a) {
        var b = "";
        return a ? p.LinkingOptions.forEach(function(c) {
            c.value == a && (b = c.label)
        }) : p.LinkingOptions.forEach(function(a) {
            a["default"] && (b = a.label)
        }), b
    };
    var t = function(a) {
            a ? (p.LINQMasterButton = "Link-Master", p.LINQButton = e("Change Role to Link-Member")) : (p.LINQMasterButton = e("Change Role to Link-Master"), p.LINQButton = "Link-Member")
        },
        u = function() {
            p.invalidMasterIp = !1, p.devicesInMyLINQGroup = null, p.devicesKnownByRemote = null
        };
    t(p.lmModeSelected), p.pendingRoleChange = !1, p.supportedDevices = p.sharedVM.deviceCapability.linking.supportedDevices, n(), p.fullMasterAddress = p.sharedVM.device.device_masterAddress + ":" + p.sharedVM.device.device_masterPort, p.fullMasterIp = p.fullMasterAddress, l(), p.linkingInfo = "", p.linkingSlotInfo = "", p.linkingWarning = "", p.linkingErrorTitle = "", p.linkingErrorInfo = "", p.popoverLINQMasterButton = e("Click to reconfigure of device as Link-Master"), p.popoverLINQButton = e("Click to join another Link-Group"), p.popoverClickToSelect = e("Click to Select"), p.masterIpChanged = function() {
        if (p.masterIp && (p.linkingErrorTitle = null, p.linkingWarning = null), !p.lmModeSelected && p.masterIp) {
            p.masterIp = p.masterIp.trim(), p.invalidMasterIp = !1;
            var a = m(p.masterIp);
            if (!a) return p.linkingErrorTitle = e("Invalid Link-Master IP address."), p.invalidMasterIp = !0, void(p.lmModeSelected || (p.pendingRoleChange = !0));
            if (a[0] == p.sharedVM.device.device_ipAddress) return p.linkingErrorTitle = e("Link-Master IP address cannot be the same as the device"), void(p.masterIp = null);
            if (a[0] == p.sharedVM.device.device_label) return p.linkingErrorTitle = e("Link-Master Name cannot be the same as the device"), void(p.masterIp = null);
            var b = f.matchIp(a[0]);
            if (b && (f.isIpReserved(a[0]) ? (p.linkingErrorTitle = e("IP addresses in the range 172.23.x.x are reserved for internal use."), p.invalidMasterIp = !0) : f.isIpValidForInterface(a[0]) || (p.linkingErrorTitle = e("Invalid Link-Master IP address."), p.invalidMasterIp = !0), p.invalidMasterIp)) return void(p.lmModeSelected || (p.pendingRoleChange = !0));
            if (a[0] == p.sharedVM.device.device_masterAddress && a[1] == p.sharedVM.device.device_masterPort) return void p.applyLmMode(!0);
            p.pendingRoleChange || (p.updatingLinking = !0), u(), a ? o(a[0], a[1]) : o(p.masterIp, "")
        }
    }, p.applyNetMode = function(a) {
        g.setNetMode({
            version: "1",
            deviceId: p.sharedVM.device.device_id,
            action: "setnetmode"
        }, {
            mode: p.netMode
        }, function(b) {
            p.sharedVM.device.device_netMode = a
        }, function(a) {
            p.linkingErrorTitle = e("Error changing netMode to") + " " + p.netMode, p.netMode = p.sharedVM.device.device_netMode
        })
    }, p.applyLmMode = function(a) {
        a ? (p.linkingInfo = null, p.linkingSlotInfo = null, p.linkingWarning = null, p.pendingRoleChange ? (p.sharedVM.device.device_linking = p.currentLinkingMode, p.pendingLinkingMode = p.currentLinkingMode, p.lmModeSelected = r(p.currentLinkingMode), p.pendingRoleChange = !1, p.linkingDisabled = s(p.currentLinkingMode)) : p.updatingLinking = !1, l(), u(), v()) : p.lmModeSelected || p.masterIp || p.linkingDisabled ? p.lmModeSelected ? (p.masterIp = p.sharedVM.device.device_ipAddress, r(p.currentLinkingMode) || p.updateLinkingConfig(1, !0)) : p.updateLinkingConfig(p.lastSlotSelected, !1) : p.invalidMasterIp = !0
    }, p.modifyLmMode = function(a) {
        switch (p.linkingErrorTitle = null, p.masterUnreachable = !1, p.invalidMasterIp = !1, a) {
            case "linkMaster":
                p.linkingDisabled ? p.linkingWarning = null : p.linkingWarning = e("This will change the selected device into a Link-Master which will make it leave the current Link group"), p.linkingDisabled = !1, p.lmModeSelected = !0, p.masterIp = void 0, p.linkingInfo = null, p.linkingSlotInfo = null, p.pendingRoleChange = !0;
                break;
            case "linkMember":
                p.linkingDisabled = !1, p.lmModeSelected = !1, p.masterIp = void 0, p.pendingRoleChange = !0;
                break;
            case "disabled":
                p.linkingDisabled = !0, p.lmModeSelected = !1, p.masterIp = void 0, p.pendingRoleChange = !0
        }
        p.pendingLinkingMode = a
    }, p.updateLINQSlot = function(a) {
        p.linkingWarning = null, p.pendingRoleChange || p.updatingLinking ? w(p.devicesInMyLINQGroup || p.devicesKnownByRemote, a) : p.updateLinkingConfig(a, !1)
    }, p.updateLinkingConfig = function(a, b) {
        var c = "127.0.0.1",
            f = m(p.masterIp);
        c = !b && angular.isDefined(f) ? f[0] : p.masterIp, d.path("/view/devices"), g.updateLinkingConfig({
            version: "2",
            deviceId: p.sharedVM.device.device_id,
            action: "updatelinkingconfig"
        }, {
            mode: p.pendingLinkingMode,
            masterIp: c,
            masterMgmtPort: angular.isDefined(f) ? f[1] : void 0,
            slotId: a
        }, function(b) {
            p.sharedVM.device.device_linking = p.pendingLinkingMode;
            var c, d, f, g, h = a != p.sharedVM.device.device_id;
            p.lmModeSelected ? (c = e("Reconfiguring"), d = " '" + p.sharedVM.device.device_label + "' ", f = e("to Link-Master mode") + "...", g = 8, p.showModalProgress("sm", c, d, f, g, function() {
                p.sharedVM.device.isHost && !h || window.location.reload(!0)
            })) : p.pendingRoleChange && (p.linkingDisabled ? (c = e("Disabling linking on"), d = " '" + p.sharedVM.device.device_label + "' ", f = "...") : (c = e("Linking"), d = " '" + p.sharedVM.device.device_label + "' ", f = e("to the Link-Group") + "..."), g = 12, p.showModalProgress("sm", c, d, f, g, function() {
                window.location.reload(!0)
            }))
        }, function(a) {
            window.alert(e("Failed to change device linking configuration") + "\nstatus: " + a.status + ", " + e("message") + ": " + a.data.message)
        })
    }, p.showLinkingWarningTooMany = function() {
        if (p.sharedVM.deviceCapability.linking.supportedDevices === p.sharedVM.deviceCapability.linking.maxDevices) return !1;
        if (p.linkingDisabled || (p.updatingLinking || p.pendingRoleChange) && p.lmModeSelected) return !1;
        var a = 0;
        angular.forEach(p.slots, function(b) {
            b.inUse && a++
        });
        var b = (p.updatingLinking || p.pendingRoleChange) && !p.lmModeSelected;
        return !!(b && a >= p.sharedVM.deviceCapability.linking.supportedDevices) || a > p.sharedVM.deviceCapability.linking.supportedDevices
    };
    var v = function() {
            p.masterUnreachable = !1, p.slotUpdatePending = !0, p.linkingErrorTitle = null, h.devices.then(function(a) {
                p.slotUpdatePending = !1, p.devicesInMyLINQGroup = a, w(p.devicesInMyLINQGroup, p.sharedVM.device.device_id)
            }, function(a) {
                p.slotUpdatePending = !1, w(null, p.sharedVM.device.device_id), p.linkingErrorTitle = e("Connection to Host failed!"), p.linkingErrorInfo = e("Response") + ": " + a.status + ", " + e("Reason") + ":" + a.data.message
            })
        },
        w = function(a, b) {
            n();
            var c = !0,
                d = !1,
                f = -1,
                g = p.sharedVM.device.device_id == b,
                h = m(p.masterIp),
                i = null != h && p.masterIp && (h[0] == p.sharedVM.device.device_masterAddress || h[0] == p.sharedVM.device.device_label) && h[1] == p.sharedVM.device.device_masterPort;
            if (p.lastSlotSelected = b, angular.forEach(p.slots, function(e, h) {
                    var j = !1;
                    angular.forEach(a, function(a, c) {
                        if (!j && a.device_id == e.slotId) {
                            e.label = a.device_label;
                            var f = g && e.slotId == b;
                            (f || !p.slotUpdatePending && !p.pendingRoleChange || p.sharedVM.device.device_uuid != a.device_uuid) && (e.inUse = !0, f && p.sharedVM.device.device_uuid == a.device_uuid || (j = !0),
                                d || (d = !i && f && p.sharedVM.device.device_uuid != a.device_uuid)), r(a.device_linking) && (e.isMaster = !0)
                        }
                    }), j || (f < 0 && (f = e.slotId), c = !1), e.isHost = e.slotId == b
                }), p.pendingRoleChange || p.updatingLinking) {
                if (c) p.masterIp = null, p.linkingErrorTitle = e("No Slot IDs are available on this Link-Master. "), p.linkingErrorInfo = e("Either remove a device from the existing Link-Group to free up a slot or specify a different Link-Master.");
                else if (d) {
                    w(a, f);
                    var j = e("Slot #") + f + " " + e("was automatically selected for this Device.");
                    p.linkingSlotInfo = j
                }
                p.linkingInfo = e("Select an available slot for registration of this Device within the Link-Group.")
            }
        };
    a.$watch(function() {
        return p.sharedVM.device.device_masterAddress
    }, function(a, b) {
        b == a || p.pendingRoleChange || p.slotUpdatePending || p.updatingLinking || l(a)
    }), v(), p.showModalProgress = function(a, b, d, e, f, g) {
        var h = c.open({
            templateUrl: "views/dialogs/progress.html",
            controller: "ModalInstanceProgressCtrl",
            backdrop: "static",
            placement: "bottom",
            animation: "am-flip-x",
            size: a,
            resolve: {
                modalMessage: function() {
                    return [b, d, e]
                },
                seconds: function() {
                    return f
                }
            }
        });
        h.result.then(function(a) {
            g && g(1)
        }, function(a) {
            g(2)
        }, function() {
            g(3)
        })
    }
}]);
/**/
var PortsCtrl = function() {
    function a(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A) {
        var B = this;
        this.$scope = a, this.$rootScope = b, this.$interval = c, this.$filter = d, this.$q = e, this.gettext = f, this.CCM_CONSTANTS = g, this.portsService = h, this.showModalAlert = j, this.showModalConfirm = k, this.externalDevicesService = l, this.pageGuideService = m, this.audioInterfacesService = n, this.connectionsService = o, this.devicesService = p, this.alertsService = q, this.$uibModal = r, this.deviceCapabilities = u, this.linkGroupCapabilities = v, this.device = z, this.devices = A, this.Ports = {}, this.AudioInterfaces = {}, this.SelectedPortIds = [], this.SelectedAudioInterfaceIds = [], this.InterfacesOfType = {}, this.PortIsSelected = {}, this.externalConnectionWarning = "", this.externalSipConnectionWarning = "", this.PortInfo = {}, this.Properties = {}, this.Visible = {
            externalConnectionStatus: !0,
            voxStatus: !0,
            gpiStatus: !0,
            gpoStatus: !0
        }, this.portWarnings = {}, this.multiValueText = "[Multiple Values]", this.doNotRefresh = !1, this.portsOfInterface = {}, this.alerts = [], this.initializeProperties(), this.root = this.$rootScope, this.sharedVM = this.root.devSharedVM, this.AudioInterfaces = s, this.Ports = t, this.externalDevices = x, this.alerts = w, this.Connections = y, this.portsService.subscribe(a, function() {
            B.getPorts(), B.getPortWarnings()
        }), this.audioInterfacesService.subscribe(a, function() {
            return B.getAudioInterfaces()
        }), this.externalDevicesService.subscribe(this.$scope, function() {
            return B.getExternalDevices()
        }), this.alertsService.subscribe(a, function() {
            return B.getAlerts()
        }), this.connectionsService.subscribe(a, function() {
            return B.getConnections()
        }), this.devicesService.subscribe(a, function() {
            B.devicesService.devicesMap.then(function(a) {
                return B.devices = a
            })
        }), this.$scope.$on("$destroy", function() {
            B.pageGuideService.cleanupGuide()
        }), this.initialSelection = {
            portId: -1,
            interfaceId: -1,
            externalDeviceId: -1,
            externalPortId: -1
        }, null != i.$routeParams.pId ? this.initialSelection.portId = parseInt(i.$routeParams.pId) : null != i.$routeParams.ifId ? this.initialSelection.interfaceId = parseInt(i.$routeParams.ifId) : null != i.$routeParams.externalDeviceId && null != i.$routeParams.externalPortId && (this.initialSelection.externalDeviceId = parseInt(i.$routeParams.externalDeviceId), this.initialSelection.externalPortId = parseInt(i.$routeParams.externalPortId)), this.generateCurrentAudioInterface(), this.generateCurrentPort(), this.getPortWarnings(), this.refreshData()
    }
    return a.$inject = ["$scope", "$rootScope", "$interval", "$filter", "$q", "gettext", "CCM_CONSTANTS", "portsService", "$routeSegment", "showModalAlert", "showModalConfirm", "externalDevicesService", "pageGuideService", "audioInterfacesService", "connectionsService", "devicesService", "alertsService", "$uibModal", "audioInterfaces", "ports", "deviceCapabilities", "linkGroupCapabilities", "alerts", "externalDevices", "connections", "device", "devices"], a.prototype.openGuide = function() {
        this.pageGuideService.openGuide("devPorts")
    }, a.prototype.SelectPort = function(a, b) {
        b && (this.clearSelectedPorts(), this.PortIsSelected = {}), this.SelectedPortIds.indexOf(a.port_id) === -1 ? (this.SelectedPortIds.push(a.port_id), this.PortIsSelected[a.port_id] = !0) : this.SelectedPortIds.length > 1 ? (this.SelectedPortIds.splice(this.SelectedPortIds.indexOf(a.port_id), 1), this.PortIsSelected[a.port_id] = !1) : this.PortIsSelected[a.port_id] = !0, this.refreshSelectedAudioInterface(), this.SelectedPortIds.length > 0 ? (this.generateCurrentPort(), this.generateCurrentAudioInterface(), this.updateVoxThresholds(), this.updateVoxMode(), this.updateGainValues()) : (this.CurrentPort = void 0, this.CurrentAudioInterface = void 0)
    }, a.prototype.updateGpioEvent = function(a) {
        for (var b = this, c = function(c) {
                var e = d.Ports[c];
                if (e) {
                    var f = (i = {}, i[a + "s"] = e.port_settings[a + "s"], i);
                    if (d.CurrentPort.port_settings[a + "s"][0].events[0].value !== d.multiValueText) {
                        var g = {
                                type: "connection",
                                value: d.CurrentPort.port_settings[a + "s"][0].events[0].value,
                                connections: !1
                            },
                            h = angular.copy(e.port_settings[a + "s"][0].events);
                        h = h.filter(function(a) {
                            return "connection" !== a.type
                        }), "disabled" !== g.value && h.push(g), f[a + "s"][0].events = h
                    }
                    "gpo" === a && d.CurrentPort.port_settings.gpos[0].offDelay !== d.multiValueText && (f.gpos[0].offDelay = d.CurrentPort.port_settings.gpos[0].offDelay), d.portsService.updatePort(e.port_id, f).then(function() {
                        e.port_settings[a + "s"] = f[a + "s"]
                    })["catch"](function() {
                        b.generateCurrentPort()
                    })
                }
                var i
            }, d = this, e = 0, f = this.SelectedPortIds; e < f.length; e++) {
            var g = f[e];
            c(g)
        }
    }, a.prototype.updateProperty = function(a, b) {
        var c = this;
        void 0 === b && (b = !1);
        var d, e, f, g, h = "label" === a,
            i = a;
        b ? (a = "audioInterface_settings." + a, g = this.CurrentAudioInterface, f = this.getSelectedAudioInterfaces()) : (h ? (a = "port_label", g = this.CurrentPort) : (a = "port_settings." + a, g = this.CurrentPort), f = this.getSelectedPorts());
        var j = CCUtils.getPropertyByPath(g, a);
        switch (a) {
            case "audioInterface_settings.power":
                e = j ? this.gettext("Warning: Power has been enabled on this interface(s). Termination has been enabled on both of its ports.") : this.gettext("Warning: Power has been disabled on this interface(s). Termination has been disabled on both of its ports."), g.audioInterface_settings.termination = j;
                break;
            case "port_settings.multiChannel":
                var k = f.filter(function(a) {
                    return Object.keys(a.port_connections).length >= 1 && a.port_settings.multiChannel !== j
                });
                k.length && (d = this.gettext("The following port(s) will have their channel assignments removed"), d += ":\n" + k.map(function(a) {
                    return a.port_label
                }).join("\n"));
                break;
            case "port_settings.vox.events":
                "disabled" === j[0].value && (j = [])
        }
        var l = CCUtils.setPropertyByPath({}, i, j),
            m = function() {
                var d, g;
                b ? (d = f.map(function(a) {
                    return a.audioInterface_id
                }), g = function(a, b) {
                    return c.audioInterfacesService.updateAudioInterface(a, b)
                }) : (d = f.map(function(a) {
                    return a.port_id
                }), g = function(a, b) {
                    return c.portsService.updatePort(a, b)
                }), g(d, l).then(function() {
                    f.forEach(function(b) {
                        CCUtils.setPropertyByPath(b, a, j)
                    }), e && c.showModalAlert(e)
                })["catch"](function() {
                    b ? c.generateCurrentAudioInterface() : c.generateCurrentPort()
                })
            };
        d ? (this.doNotRefresh = !0, this.showModalConfirm("sm", d, "", this.gettext("OK"), this.gettext("Cancel"), function(a) {
            c.doNotRefresh = !1, a ? m() : b ? c.generateCurrentAudioInterface() : c.generateCurrentPort()
        }, !0)) : m()
    }, a.prototype.getInterfacesOfType = function(a) {
        var b = this;
        if (this.AudioInterfaces) {
            var c = [];
            if ("IVC" === a || "SIP" === a) {
                var d = Object.keys(this.AudioInterfaces).find(function(c) {
                    return b.AudioInterfaces[c].audioInterfaceType_longName === a
                });
                if (d) {
                    var e = {};
                    for (var f in this.Ports) {
                        var g = this.Ports[f];
                        if (g.audioInterface_id_AudioInterface === this.AudioInterfaces[d].audioInterface_id && !e[g.port_externalDeviceId]) {
                            e[g.port_externalDeviceId] = !0;
                            var h = angular.copy(this.AudioInterfaces[d]);
                            h.externalDeviceId = g.port_externalDeviceId, c.push(h)
                        }
                    }
                }
            } else angular.forEach(this.AudioInterfaces, function(b) {
                b.audioInterfaceType_longName === a && c.push(b)
            });
            return c
        }
    }, a.prototype.getPortsOfInterface = function(a) {
        var b = this.keyForAudioInterfaceAndExternalDevice(a.audioInterface_id, a.externalDeviceId);
        return this.portsOfInterface[b] || []
    }, a.prototype.showExternalDeviceSettingsSection = function() {
        var a = this.getSelectedInterfaces();
        return 1 === a.length && null != a[0].externalDeviceId
    }, a.prototype.showMultiChannelSupportSetting = function() {
        var a = this.getSelectedInterfaces(),
            b = !0;
        return a.some(function(a) {
            return "SIP" === a.audioInterfaceType_shortName
        }) && (b = !1), b
    }, a.prototype.getSelectedInterfaces = function() {
        for (var a = [], b = 0, c = this.getSelectedPorts(); b < c.length; b++) {
            var d = c[b];
            a: for (var e in this.InterfacesOfType)
                for (var f = 0, g = this.InterfacesOfType[e]; f < g.length; f++) {
                    var h = g[f];
                    if (h.audioInterface_id === d.audioInterface_id_AudioInterface && h.externalDeviceId === d.port_externalDeviceId && a.indexOf(h) === -1) {
                        a.push(h);
                        break a
                    }
                }
        }
        return a
    }, a.prototype.IsInterfaceSelected = function(a) {
        var b = this.getSelectedInterfaces();
        if (Array.isArray(a)) {
            var c = !1;
            return angular.forEach(a, function(a) {
                b.indexOf(a) !== -1 && (c = !0)
            }), c
        }
        return b.indexOf(a) !== -1
    }, a.prototype.interfaceHasWarning = function(a) {
        return this.alerts.some(function(b) {
            return b.interface_id === a.audioInterface_id.toString()
        })
    }, a.prototype.portHasWarning = function(a) {
        if (a) {
            var b = void 0;
            return a.liveStatus && a.liveStatus.sipRegistrationStatusCode ? b = 200 !== a.liveStatus.sipRegistrationStatusCode : a.liveStatus && a.liveStatus.externalConnectionStatus && (b = "connected" !== a.liveStatus.externalConnectionStatus), b
        }
    }, a.prototype.IsCapabilitySupportedByInterfaces = function(a) {
        return !!this.CurrentAudioInterface && (!!this.CurrentAudioInterface.audioInterface_settings && !!this.CurrentAudioInterface.audioInterface_settings.hasOwnProperty(a))
    }, a.prototype.IsCapabilitySupportedByPorts = function(a) {
        var b = !0;
        if (this.CurrentPort) switch (a) {
            case "inputGain":
                "E1" !== this.CurrentPort.audioInterfaceType_shortName || "SA" !== this.CurrentPort.port_config_type && "HS" !== this.CurrentPort.port_config_type || (b = !1);
                break;
            case "outputGain":
                "E1" === this.CurrentPort.audioInterfaceType_shortName && "SA" !== this.CurrentPort.port_config_type && (b = !1);
                break;
            case "groups":
                if (!this.CurrentPort.port_connections.group) return !1;
                b = !!this.linkGroupCapabilities.connections.find(function(a) {
                    return "group" === a.type
                }) && ("E1" !== this.CurrentPort.audioInterfaceType_shortName || "PGM" !== this.CurrentPort.port_config_type);
                break;
            case "networkQuality":
            case "callSignal":
            case "portFunction":
            case "termination":
            case "rmkInputEnabled":
            case "rmkOutputEnabled":
            case "gpoTriggerEnabled":
            case "baudRate":
                b = this.IsCapabilitySupportedByInterfaces(a);
                break;
            default:
                b = this.CurrentPort.port_settings.hasOwnProperty(a)
        }
        return b
    }, a.prototype.GetDisplayTextFromValue = function(a, b) {
        var c = this.$filter("filter")(b, {
            value: a
        }, !0);
        return a === this.multiValueText ? a : null != c ? null != a && c.length ? c[0].label : this.gettext("Not set") : "undefined"
    }, a.prototype.getCurrentLimiterWarningMessage = function() {
        var a = "";
        if (!this.alerts.length) return a;
        if (this.SelectedAudioInterfaceIds.length > 1) return a;
        for (var b = this.AudioInterfaces[this.SelectedAudioInterfaceIds[0]], c = 0, d = this.alerts; c < d.length; c++) {
            var e = d[c];
            "current_limiter_2w" === e.code && e.interface_id === b.audioInterface_id.toString() && (a = e.message)
        }
        return a
    }, a.prototype.getPortWarningMessage = function(a) {
        return this.portWarnings[a]
    }, a.prototype.SetVisible = function(a, b) {
        this.Visible[a] = b
    }, a.prototype.testGpo = function(a) {
        var b = this.Ports[this.SelectedPortIds[0]];
        b && this.portsService.setGpo(b.port_id, a)
    }, a.prototype.startNulling = function(a) {
        var b = this,
            c = "Starting...",
            d = 0;
        this.portsService.startNulling(a.port_id), this.PortInfo[a.port_id] || (this.PortInfo[a.port_id] = {}), this.PortInfo[a.port_id].nulling = c;
        var e = this.$interval(function() {
                b.portsService.getNullingStatus(a.port_id).then(function(e) {
                    d++, "Idle" === e.nulling || d > 20 ? g() : e.nulling !== c && (b.PortInfo[a.port_id].nulling = e.nulling)
                })["catch"](function() {
                    return g()
                })
            }, 2e3),
            f = this.$scope.$on("$destroy", function() {
                return b.$interval.cancel(e)
            }),
            g = function() {
                b.PortInfo[a.port_id].nulling = "Idle", f(), b.$interval.cancel(e)
            }
    }, a.prototype.getCurrentConnectionLabels = function(a) {
        var b = this;
        if (void 0 === a && (a = "partyline"), void 0 !== this.CurrentPort) return this.CurrentPort.port_connections[a][-1] === this.multiValueText ? this.multiValueText : Object.keys(this.CurrentPort.port_connections[a]).map(function(a) {
            return b.Connections.find(function(b) {
                return b.id === Number(a)
            }).label
        }).join(", ")
    }, a.prototype.showAssignment = function(a) {
        var b, c = this,
            d = {};
        b = "group" == a ? "Groups" : "Channels", d[b] = {
            labelField: "label",
            primaryKeyField: "id",
            value: this.Connections.filter(function(b) {
                return b.type === a
            }),
            sortField: "id"
        };
        var e = this.$uibModal.open({
            templateUrl: "views/dialogs/connectionSelectionDialog.html",
            controller: "connectionSelectionDialog",
            controllerAs: "dialogCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                options: function() {
                    return {
                        title: c.SelectedPortIds.length > 1 ? c.gettext("Multiple Ports") : c.gettext(c.CurrentPort.port_label),
                        messages: "",
                        connectables: d,
                        assigned: Object.keys(c.CurrentPort.port_connections[a]).map(function(a) {
                            return Number(a)
                        }),
                        allowMultipleSelections: c.CurrentPort.port_settings.multiChannel !== !1
                    }
                }
            }
        });
        e.result.then(function(b) {
            var d = [];
            c.errorResponse = [], delete c.CurrentPort.port_connections[a][-1];
            for (var e = function(e) {
                    var f = c.Ports[e];
                    if (f) {
                        var g = Object.keys(f.port_connections).map(function(a) {
                                return Number(a)
                            }),
                            h = g.filter(function(d) {
                                var e = c.Connections.find(function(a) {
                                    return a.id === d
                                });
                                return e && e.type === a && b.selected.indexOf(d) === -1
                            }),
                            i = b.selected.filter(function(a) {
                                return g.indexOf(a) === -1
                            });
                        d.push(c.portsService.associateWithConnection(f.port_id, h).then(function() {
                            return c.portsService.associateWithConnection(f.port_id, i, !0)
                        }).then(function() {
                            for (var a = 0, b = h; a < b.length; a++) {
                                var c = b[a];
                                delete f.port_connections[c]
                            }
                            for (var d = 0, e = i; d < e.length; d++) {
                                var c = e[d];
                                f.port_connections[c] = {
                                    connectionState: 0
                                }
                            }
                        }))
                    }
                    c.$q.all(d).then(function() {
                        c.CurrentPort.port_connections[a] = {};
                        for (var d = 0, e = b.selected; d < e.length; d++) {
                            var f = e[d];
                            c.CurrentPort.port_connections[a][f] = {
                                connectionState: 0
                            }
                        }
                    })["catch"](function(a) {
                        a.data && a.data.message && c.errorResponse.push(a.data.message)
                    })
                }, f = 0, g = c.SelectedPortIds; f < g.length; f++) {
                var h = g[f];
                e(h)
            }
        })
    }, a.prototype.getSelectedPorts = function() {
        var a = this;
        return this.SelectedPortIds.map(function(b) {
            return a.Ports[b]
        })
    }, a.prototype.getSelectedAudioInterfaces = function() {
        var a = this;
        return this.SelectedAudioInterfaceIds.map(function(b) {
            return a.AudioInterfaces[b]
        })
    }, a.prototype.getAudioInterfaces = function() {
        var a = this;
        this.audioInterfacesService.currentDeviceAudioInterfacesMap.then(function(b) {
            a.AudioInterfaces = b, a.refreshData(), a.refreshSelectedAudioInterface(), a.generateCurrentAudioInterface()
        })
    }, a.prototype.getPorts = function() {
        var a = this;
        this.portsService.currentDevicePortsMap.then(function(b) {
            a.Ports = b, a.refreshData(), a.generateCurrentPort()
        })
    }, a.prototype.getAlerts = function() {
        var a = this;
        this.alertsService.currentDeviceCurrentAlerts.then(function(b) {
            a.alerts = b
        })
    }, a.prototype.getConnections = function() {
        var a = this;
        this.connectionsService.connections.then(function(b) {
            a.Connections = b
        })
    }, a.prototype.getExternalDevices = function() {
        var a = this;
        this.externalDevicesService.externalDevicesMap.then(function(b) {
            a.externalDevices = b
        })
    }, a.prototype.getPortWarnings = function() {
        var a = this;
        this.portsService.getPortWarningsForDevice(this.device.device_id).then(function(b) {
            a.portWarnings = b
        })
    }, a.prototype.refreshData = function() {
        var a = [],
            b = {};
        for (var c in this.Ports) {
            var d = this.Ports[c];
            if (this.initialSelection && (d.port_id === this.initialSelection.portId || d.audioInterface_id_AudioInterface === this.initialSelection.interfaceId || d.port_externalDeviceId === this.initialSelection.externalDeviceId && d.port_externalPortId === this.initialSelection.externalPortId) && this.SelectPort(d, !1), ["2W", "4W", "4WG", "IVC", "E1", "SIP"].indexOf(d.audioInterfaceType_shortName) >= 0 && a.indexOf(d.audioInterfaceType_longName) === -1 && a.push(d.audioInterfaceType_longName), "HS" != d.port_desc) {
                var e = this.keyForAudioInterfaceAndExternalDevice(d.audioInterface_id_AudioInterface, d.port_externalDeviceId);
                b[e] || (b[e] = []), b[e].push(d)
            }
        }
        CCUtils.objectUpdate(this.portsOfInterface, b), this.initialSelection && (this.initialSelection = null), "FSII" === this.CCM_CONSTANTS.PRODUCT_NAME ? this.InterfaceTypes = this.$filter("orderBy")(a) : this.InterfaceTypes = a;
        for (var f = 0, g = this.InterfaceTypes; f < g.length; f++) {
            var h = g[f];
            this.InterfacesOfType[h] || (this.InterfacesOfType[h] = []), CCUtils.copyArrayPreserveRefs(this.getInterfacesOfType(h), this.InterfacesOfType[h])
        }
        this.selectFirstPort()
    }, a.prototype.selectFirstPort = function() {
        var a = this;
        if (this.SelectedPortIds = this.SelectedPortIds.filter(function(b) {
                return a.Ports[b]
            }), !this.SelectedPortIds.length)
            for (var b = 0, c = this.InterfaceTypes; b < c.length; b++) {
                var d = c[b];
                for (var e in this.Ports) {
                    var f = this.Ports[e];
                    if (f.audioInterfaceType_longName === d) return void this.SelectPort(f, !1)
                }
            }
    }, a.prototype.keyForAudioInterfaceAndExternalDevice = function(a, b) {
        var c = "" + a;
        return null != b && (c += "/" + b), c
    }, a.prototype.refreshSelectedAudioInterface = function() {
        this.SelectedAudioInterfaceIds = [];
        for (var a = 0, b = this.SelectedPortIds; a < b.length; a++) {
            var c = b[a],
                d = this.Ports[c].audioInterface_id_AudioInterface;
            this.AudioInterfaces[d] && this.SelectedAudioInterfaceIds.indexOf(d) === -1 && this.SelectedAudioInterfaceIds.push(d)
        }
    }, a.prototype.clearSelectedPorts = function() {
        this.SelectedPortIds = []
    }, a.prototype.deepCompareForMultiSelect = function(a, b) {
        for (var c = Object.keys(a), d = 0; d < c.length; d++)
            if (b.hasOwnProperty(c[d]))
                if (Array.isArray(a[c[d]]))
                    for (var e in a[c[d]]) a[c[d]][e] = this.deepCompareForMultiSelect(a[c[d]][e], b[c[d]][e]);
                else "object" == typeof a[c[d]] ? "port_connections" == c[d] ? a[c[d]] = this.createConnectionMultiSelect(a[c[d]], b[c[d]]) : a[c[d]] = this.deepCompareForMultiSelect(a[c[d]], b[c[d]]) : a[c[d]] != b[c[d]] && (a[c[d]] = this.multiValueText);
        else delete a[c[d]];
        return a
    }, a.prototype.splitConnectionsToChannelsAndGroups = function(a) {
        var b = {
                partyline: {},
                group: {},
                direct: {}
            },
            c = Object.keys(a);
        if ("partyline" === c[0]) return a;
        for (var d = function(d) {
                var f = e.Connections.find(function(a) {
                    return a.id === Number(c[d])
                });
                f && (b[f.type][c[d]] = a[c[d]])
            }, e = this, f = 0; f < c.length; f++) d(f);
        return b
    }, a.prototype.createConnectionMultiSelect = function(a, b) {
        var c = this.splitConnectionsToChannelsAndGroups(a),
            d = this.splitConnectionsToChannelsAndGroups(b);
        return JSON.stringify(c.partyline) !== JSON.stringify(d.partyline) && (c.partyline = {}, c.partyline[-1] = this.multiValueText), JSON.stringify(c.group) !== JSON.stringify(d.group) && (c.group = {}, c.group[-1] = this.multiValueText), c
    }, a.prototype.addEventsIsMissing = function(a) {
        var b = {
            type: "connection",
            value: "disabled",
            connections: !1
        };
        a.port_settings.vox && a.port_settings.vox.events && 0 === a.port_settings.vox.events.length && a.port_settings.vox.events.push(angular.copy(b)), a.port_settings.gpis && 0 === a.port_settings.gpis[0].events.length && a.port_settings.gpis[0].events.push(angular.copy(b)), a.port_settings.gpos && 0 === a.port_settings.gpos[0].events.length && a.port_settings.gpos[0].events.push(angular.copy(b))
    }, a.prototype.generateCurrentPort = function() {
        if (!this.doNotRefresh) {
            var a;
            if (!(this.SelectedPortIds.length > 0)) return this.CurrentPort = void 0, void(this.externalConnectionWarning = "");
            a = this.findPortById(this.SelectedPortIds[0]);
            var b = angular.copy(a);
            if (this.addEventsIsMissing(b), this.SelectedPortIds.length > 1)
                for (var c = 1; c < this.SelectedPortIds.length; c++) {
                    var d = this.findPortById(this.SelectedPortIds[c]);
                    this.addEventsIsMissing(d), b = this.deepCompareForMultiSelect(b, d)
                } else this.deepCompareForMultiSelect(b, b);
            this.getSelectedPorts().some(function(a) {
                return "PGM" === a.port_config_type
            }) && delete b.port_connections.group, this.CurrentPort = b, 1 === this.SelectedPortIds.length && this.CurrentPort.liveStatus && "connected" !== this.CurrentPort.liveStatus.externalConnectionStatus ? this.externalConnectionWarning = this.externalDevicesService.externalConnectionStatusToMessage(this.CurrentPort.liveStatus.externalConnectionStatus) : this.externalConnectionWarning = "", 1 === this.SelectedPortIds.length && this.CurrentPort.liveStatus && 200 !== this.CurrentPort.liveStatus.sipRegistrationStatusCode ? this.externalSipConnectionWarning = this.externalDevicesService.sipRegistrationStatusToMessage(this.CurrentPort.liveStatus.sipRegistrationStatusCode) : this.externalSipConnectionWarning = ""
        }
    }, a.prototype.generateCurrentAudioInterface = function() {
        if (!this.doNotRefresh) {
            var a;
            if (!(this.SelectedAudioInterfaceIds.length > 0)) return void(this.CurrentAudioInterface = void 0);
            a = this.findInterfaceById(this.SelectedAudioInterfaceIds[0]);
            var b = angular.copy(a);
            if (b.id = -1, this.SelectedAudioInterfaceIds.length > 1)
                for (var c = 1; c < this.SelectedAudioInterfaceIds.length; c++) {
                    var d = this.findInterfaceById(this.SelectedAudioInterfaceIds[c]);
                    b = this.deepCompareForMultiSelect(b, d)
                }
            this.CurrentAudioInterface = b
        }
    }, a.prototype.retrievePortTypeLiveStatus = function(a) {
        var b;
        b = this.AudioInterfaces[a];
        var c = "";
        return c = b && b.audioInterface_liveStatus.powerSense ? "/images/power-enabled.svg" : b && b.audioInterface_settings.power ? "/images/power-enabled-but-not-providing-power.svg" : "/images/power-disabled.svg"
    }, a.prototype.findPortById = function(a) {
        return this.Ports[a]
    }, a.prototype.findInterfaceById = function(a) {
        var b, c = !1;
        return angular.forEach(this.AudioInterfaces, function(d) {
            c || d.audioInterface_id == a && (b = d, c = !0)
        }), b
    }, a.prototype.getChannelEvents = function() {
        var a = this,
            b = [{
                value: "disabled",
                label: "Disabled"
            }],
            c = [{
                value: "talk",
                label: "Control Event 1"
            }, {
                value: "control",
                label: "Control Event 2"
            }, {
                value: "call",
                label: "Call Control Event"
            }];
        return this.deviceCapabilities.events ? b = b.concat(c.filter(function(b) {
            var c = a.deviceCapabilities.events.find(function(a) {
                return "connection" === a.type && a.value === b.value
            });
            return !!c
        })) : []
    }, a.prototype.updateGainValues = function() {
        if (!this.CurrentAudioInterface) return void(this.Properties.inputGain = this.Properties.outputGain = []);
        switch (this.CurrentAudioInterface.audioInterfaceType_shortName) {
            case "2W":
                this.Properties.inputGain = this.Properties.outputGain = [{
                    value: 3,
                    label: "3 dB"
                }, {
                    value: 2,
                    label: "2 dB"
                }, {
                    value: 1,
                    label: "1 dB"
                }, {
                    value: 0,
                    label: "0 dB"
                }, {
                    value: -1,
                    label: "-1 dB"
                }, {
                    value: -2,
                    label: "-2 dB"
                }, {
                    value: -3,
                    label: "-3 dB"
                }];
                break;
            case this.multiValueText:
                this.getSelectedInterfaces().some(function(a) {
                    return "2W" === a.audioInterfaceType_shortName
                }) ? this.Properties.inputGain = this.Properties.outputGain = [] : this.Properties.inputGain = this.Properties.outputGain = [{
                    value: 12,
                    label: "12 dB"
                }, {
                    value: 9,
                    label: "9 dB"
                }, {
                    value: 6,
                    label: "6 dB"
                }, {
                    value: 3,
                    label: "3 dB"
                }, {
                    value: 0,
                    label: "0 dB"
                }, {
                    value: -3,
                    label: "- 3 dB"
                }, {
                    value: -6,
                    label: "- 6 dB"
                }, {
                    value: -9,
                    label: "- 9 dB"
                }, {
                    value: -12,
                    label: "-12 dB"
                }];
                break;
            case "4W":
            case "4WG":
            case "IVC":
            case "E1":
            case "SIP":
                if ("HMS-4X" === this.sharedVM.device.deviceType_name) {
                    this.Properties.inputGain = this.Properties.outputGain = [{
                        value: 12,
                        label: "12 dB"
                    }, {
                        value: 6,
                        label: "6 dB"
                    }, {
                        value: 0,
                        label: "0 dB"
                    }, {
                        value: -6,
                        label: "- 6 dB"
                    }, {
                        value: -12,
                        label: "-12 dB"
                    }];
                    break
                }
                this.Properties.inputGain = this.Properties.outputGain = [{
                    value: 12,
                    label: "12 dB"
                }, {
                    value: 9,
                    label: "9 dB"
                }, {
                    value: 6,
                    label: "6 dB"
                }, {
                    value: 3,
                    label: "3 dB"
                }, {
                    value: 0,
                    label: "0 dB"
                }, {
                    value: -3,
                    label: "- 3 dB"
                }, {
                    value: -6,
                    label: "- 6 dB"
                }, {
                    value: -9,
                    label: "- 9 dB"
                }, {
                    value: -12,
                    label: "-12 dB"
                }];
                break;
            default:
                this.Properties.inputGain = this.Properties.outputGain = []
        }
    }, a.prototype.updateVoxMode = function() {
        return "HMS-4X" === this.sharedVM.device.deviceType_name ? void(this.Properties.vox.state = [{
            value: "disabled",
            label: "Disabled"
        }, {
            value: "adaptive",
            label: "Adaptive Threshold"
        }]) : void(this.Properties.vox.state = [{
            value: "disabled",
            label: "Disabled"
        }, {
            value: "fixed",
            label: "Fixed Threshold"
        }, {
            value: "adaptive",
            label: "Adaptive Threshold"
        }])
    }, a.prototype.updateVoxThresholds = function() {
        var a = this;
        if (!this.CurrentAudioInterface) return void(this.Properties.vox.threshold = []);
        if ("HMS-4X" === this.sharedVM.device.deviceType_name) return void(this.Properties.vox.threshold = []);
        switch (this.CurrentAudioInterface.audioInterfaceType_shortName) {
            case "2W":
                this.Properties.vox.threshold = [{
                    value: -18,
                    label: "-18 dB"
                }, {
                    value: -20,
                    label: "-20 dB"
                }, {
                    value: -22,
                    label: "-22 dB"
                }, {
                    value: -24,
                    label: "-24 dB"
                }, {
                    value: -26,
                    label: "-26 dB"
                }, {
                    value: -28,
                    label: "-28 dB"
                }, {
                    value: -30,
                    label: "-30 dB"
                }, {
                    value: -32,
                    label: "-32 dB"
                }, {
                    value: -34,
                    label: "-34 dB"
                }, {
                    value: -36,
                    label: "-36 dB"
                }, {
                    value: -38,
                    label: "-38 dB"
                }, {
                    value: -40,
                    label: "-40 dB"
                }, {
                    value: -42,
                    label: "-42 dB"
                }, {
                    value: -44,
                    label: "-44 dB"
                }, {
                    value: -46,
                    label: "-46 dB"
                }, {
                    value: -48,
                    label: "-48 dB"
                }, {
                    value: -50,
                    label: "-50 dB"
                }, {
                    value: -52,
                    label: "-52 dB"
                }, {
                    value: -54,
                    label: "-54 dB"
                }, {
                    value: -56,
                    label: "-56 dB"
                }, {
                    value: -58,
                    label: "-58 dB"
                }, {
                    value: -60,
                    label: "-60 dB"
                }];
                break;
            case "4W":
            case "4WG":
            case "IVC":
            case "SIP":
                this.Properties.vox.threshold = [{
                    value: -18,
                    label: "0 dB"
                }, {
                    value: -20,
                    label: "- 2 dB"
                }, {
                    value: -22,
                    label: "- 4 dB"
                }, {
                    value: -24,
                    label: "- 6 dB"
                }, {
                    value: -26,
                    label: "- 8 dB"
                }, {
                    value: -28,
                    label: "-10 dB"
                }, {
                    value: -30,
                    label: "-12 dB"
                }, {
                    value: -32,
                    label: "-14 dB"
                }, {
                    value: -34,
                    label: "-16 dB"
                }, {
                    value: -36,
                    label: "-18 dB"
                }, {
                    value: -38,
                    label: "-20 dB"
                }, {
                    value: -40,
                    label: "-22 dB"
                }, {
                    value: -42,
                    label: "-24 dB"
                }, {
                    value: -44,
                    label: "-26 dB"
                }, {
                    value: -46,
                    label: "-28 dB"
                }, {
                    value: -48,
                    label: "-30 dB"
                }, {
                    value: -50,
                    label: "-32 dB"
                }, {
                    value: -52,
                    label: "-34 dB"
                }, {
                    value: -54,
                    label: "-36 dB"
                }, {
                    value: -56,
                    label: "-38 dB"
                }, {
                    value: -58,
                    label: "-40 dB"
                }, {
                    value: -60,
                    label: "-42 dB"
                }];
                break;
            default:
                this.SelectedAudioInterfaceIds.some(function(b) {
                    return "2W" === a.AudioInterfaces[b].audioInterfaceType_shortName
                }) ? this.Properties.vox.threshold = [] : this.Properties.vox.threshold = [{
                    value: -18,
                    label: "0 dB"
                }, {
                    value: -20,
                    label: "- 2 dB"
                }, {
                    value: -22,
                    label: "- 4 dB"
                }, {
                    value: -24,
                    label: "- 6 dB"
                }, {
                    value: -26,
                    label: "- 8 dB"
                }, {
                    value: -28,
                    label: "-10 dB"
                }, {
                    value: -30,
                    label: "-12 dB"
                }, {
                    value: -32,
                    label: "-14 dB"
                }, {
                    value: -34,
                    label: "-16 dB"
                }, {
                    value: -36,
                    label: "-18 dB"
                }, {
                    value: -38,
                    label: "-20 dB"
                }, {
                    value: -40,
                    label: "-22 dB"
                }, {
                    value: -42,
                    label: "-24 dB"
                }, {
                    value: -44,
                    label: "-26 dB"
                }, {
                    value: -46,
                    label: "-28 dB"
                }, {
                    value: -48,
                    label: "-30 dB"
                }, {
                    value: -50,
                    label: "-32 dB"
                }, {
                    value: -52,
                    label: "-34 dB"
                }, {
                    value: -54,
                    label: "-36 dB"
                }, {
                    value: -56,
                    label: "-38 dB"
                }, {
                    value: -58,
                    label: "-40 dB"
                }, {
                    value: -60,
                    label: "-42 dB"
                }]
        }
    }, a.prototype.initializeProperties = function() {
        var a = this.getChannelEvents();
        this.Properties = {
            vox: {
                state: [],
                delay: [{
                    value: 500,
                    label: "0.5 sec"
                }, {
                    value: 1e3,
                    label: "1.0 sec"
                }, {
                    value: 2e3,
                    label: "2.0 sec"
                }, {
                    value: 3e3,
                    label: "3.0 sec"
                }, {
                    value: 4e3,
                    label: "4.0 sec"
                }],
                threshold: [],
                events: a
            },
            externalNetworkQuality: [{
                value: "default",
                label: "EHX Managed"
            }, {
                value: "lan",
                label: "Very High (LAN)"
            }, {
                value: "wan",
                label: "High (WAN)"
            }, {
                value: "internet",
                label: "Low (Internet)"
            }],
            micLevel: [{
                value: !1,
                label: "Line Level (0 dB)"
            }, {
                value: !0,
                label: "Mic Level (-55 dB)"
            }],
            gpi: {
                events: a
            },
            gpo: {
                events: a,
                offDelay: [{
                    value: 0,
                    label: "None"
                }, {
                    value: 100,
                    label: "0.1 sec"
                }, {
                    value: 200,
                    label: "0.2 sec"
                }, {
                    value: 500,
                    label: "0.5 sec"
                }, {
                    value: 1e3,
                    label: "1.0 sec"
                }, {
                    value: 2e3,
                    label: "2.0 sec"
                }]
            },
            serial: {
                baudRate: [{
                    value: 9600,
                    label: this.gettext("9600 (Drake 4000)")
                }, {
                    value: 19200,
                    label: this.gettext("19200 (Eclipse)")
                }]
            },
            mode: [{
                value: "ClearCom",
                label: "Clear-Com"
            }, {
                value: "RTS",
                label: "RTS"
            }],
            portMode: [{
                value: "clearcom",
                label: "Clear-Com"
            }, {
                value: "rtsPin2",
                label: "RTS Pin 2"
            }, {
                value: "rtsPin3",
                label: "RTS Pin 3"
            }],
            BoolToEnabledDisabled: [{
                value: !0,
                label: this.gettext("Enabled")
            }, {
                value: !1,
                label: this.gettext("Disabled")
            }],
            BoolToOnOff: [{
                value: !0,
                label: this.gettext("On")
            }, {
                value: !1,
                label: this.gettext("Off")
            }],
            programOutput: [{
                value: 0,
                label: this.gettext("0 dB")
            }, {
                value: -6,
                label: this.gettext("- 6 dB")
            }, {
                value: -12,
                label: this.gettext("-12 dB")
            }, {
                value: -18,
                label: this.gettext("-18 dB")
            }, {
                value: -30,
                label: this.gettext("-30 dB")
            }, {
                value: -50,
                label: this.gettext("-50 dB")
            }, {
                value: -80,
                label: this.gettext("-80 dB")
            }],
            pinout: [{
                value: "matrix",
                label: this.gettext("to Panel")
            }, {
                value: "panel",
                label: this.gettext("to Matrix")
            }],
            inputGain: [],
            outputGain: [],
            programOutputEnabled: [{
                value: !0,
                label: "Unmute"
            }, {
                value: !1,
                label: "Mute"
            }]
        }
    }, a
}();
/**/
angular.module("moonraker").controller("portsCtrl", PortsCtrl), angular.module("moonraker").controller("deviceCfgWirelessCtrl", ["$rootScope", "$uibModal", "PerformActionOnDevice", "UpdateDevice", "gettext", function(a, b, c, d, e) {
    var f = this;
    f.root = a, f.sharedVM = a.devSharedVM, f.controllerName = "deviceCfgWirelessCtrl", f.generalErrorTitle = "", f.generalErrorInfo = "", f.goodResponse = "", f.startOTA = function() {
        f.goodResponse = "", c.startOTA({
            version: "1",
            deviceId: f.sharedVM.device.device_id,
            action: "otastate"
        }, {
            OTAState: 1
        }, function(a) {
            f.goodResponse = e("Over the air registration is now started. You can now pair beltpacks with the base station.")
        }, function(a) {
            f.generalErrorTitle = e("Failed to start OTA registration."), a.data && a.data.message ? (f.generalErrorInfo = a.data.message, f.sharedVM.getDevice()) : f.generalErrorInfo = e("No response from the server.")
        })
    }, f.updateOTAPIN = function() {
        d.update({
            version: "1",
            deviceId: f.sharedVM.device.device_id
        }, {
            otaPin: f.sharedVM.device.device_settings.otaPin
        }, function(a) {}, function(a) {
            f.generalErrorTitle = e("Failed to update OTA code."), a.data && a.data.message ? (f.generalErrorInfo = a.data.message, f.sharedVM.getDevice()) : f.generalErrorInfo = e("No response from the server.")
        })
    }, f.updateAdminPIN = function() {
        d.update({
            version: "1",
            deviceId: f.sharedVM.device.device_id
        }, {
            adminPin: f.sharedVM.device.device_settings.adminPin
        }, function(a) {}, function(a) {
            f.generalErrorTitle = e("Failed to modify administration code."), a.data && a.data.message ? (f.generalErrorInfo = a.data.message, f.sharedVM.getDevice()) : f.generalErrorInfo = e("No response from the server.")
        })
    }
}]), angular.module("moonraker").controller("deviceCfgSettingsCtrl", deviceCfgSettingsCtrl), angular.module("moonraker").controller("deviceCfgNetworkCtrl", deviceCfgNetworkCtrl), angular.module("moonraker").controller("deviceCfgEventsCtrl", deviceCfgEventsCtrl), angular.module("moonraker").controller("deviceUpgradeCtrl", deviceUpgradeCtrl), angular.module("moonraker").controller("deviceStatsCtrl", ["$scope", "$timeout", "socket", "gettext", "Device", "portsService", function(a, b, c, d, e, f) {
    a.controllerName = "deviceStatsCtrl", a.entries = [], a.devices = {}, a.ports = {}, a.statistics = {};
    var g = '<div ng-click="col.sort()" ng-class="{ ngSorted : !noSortVisible }"><div class="header-text"><br><span class="ngHeaderText">{{col.colDef.firstLine}}</span><br><span class="ngHeaderText">{{col.colDef.secondLine}}</span></div><div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div><div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div></div><div ng-show="col.allowResize" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';
    a.gridOptions = {
        data: "entries",
        headerRowHeight: 40,
        rowTemplate: '<div style="height: 100%" ng-class="{ odd: row.rowIndex % 1, even: row.rowIndex % 0 }"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div></div>',
        columnDefs: [{
            field: "port_label",
            firstLine: d("Port"),
            secondLine: d("Label"),
            width: 100,
            headerCellTemplate: g
        }, {
            field: "duration",
            firstLine: d("Duration"),
            secondLine: "(s)",
            width: 50,
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "pktsTx",
            firstLine: d("Audio Tx"),
            secondLine: d("packets"),
            width: 50,
            categoryDisplayName: d("Transmit"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "pktsRx",
            firstLine: d("Audio Rx"),
            secondLine: d("packets"),
            width: 50,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "dataPktsTx",
            firstLine: d("Data Pkts"),
            secondLine: d("From Port"),
            width: 56,
            categoryDisplayName: d("Transmit"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "dataPktsRx",
            firstLine: d("Data Pkts"),
            secondLine: d("To Port"),
            width: 56,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "dataBytesTx",
            firstLine: d("Data Bytes"),
            secondLine: d("From Port"),
            width: 60,
            categoryDisplayName: d("Transmit"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "dataBytesRx",
            firstLine: d("Data Bytes"),
            secondLine: d("To Port"),
            width: 60,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "pktsDisordered",
            firstLine: d("Out Of"),
            secondLine: d("Order"),
            width: 40,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "pktsTooLate",
            firstLine: d("Too"),
            secondLine: d("Late"),
            width: 40,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "pktsMissing",
            firstLine: d("Lost"),
            secondLine: d(""),
            width: 40,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "pktsDroppedTotal",
            firstLine: d("Dropped"),
            secondLine: d(""),
            width: 50,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "jitterAverage",
            firstLine: d("Avg"),
            secondLine: d("Jitter (ms)"),
            width: 60,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "jitterMax",
            firstLine: d("Max"),
            secondLine: d("Jitter (ms)"),
            width: 60,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "avgBufferContent",
            firstLine: d("Avg"),
            secondLine: d("Content (ms)"),
            width: 70,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }, {
            field: "maxBufferContent",
            firstLine: d("Max"),
            secondLine: d("Content (ms)"),
            width: 70,
            categoryDisplayName: d("Receive"),
            cellClass: "grid-align-right",
            headerCellTemplate: g
        }],
        enableColumnResize: !1,
        enableColumnReordering: !0,
        enablePinning: !1
    };
    var h = function(a) {
            var b = Number(a),
                c = {
                    deviceId: b >> 8,
                    interfaceId: 255 & b
                };
            return c
        },
        i = function() {
            f.currentDevicePorts.then(function(b) {
                angular.equals(a.ports, b) || (a.ports = b, a.entries = {}, angular.forEach(a.ports, function(b, c) {
                    var d = h(b.audioInterface_id_AudioInterface);
                    a.entries[c] = {
                        hw_index: b.port_hwIndex,
                        port_id: b.port_id,
                        device_id: b.device_id,
                        interface_id: d.interfaceId
                    }
                }), j())
            })
        };
    i();
    var j = function() {
        angular.forEach(a.entries, function(b) {
            angular.forEach(a.ports, function(a, c) {
                a.port_id == b.port_id && (b.interface_type = a.audioInterfaceType_shortName, b.port_label = a.port_label)
            }), a.statistics.deviceId == b.device_id && angular.forEach(a.statistics.audioInterfaces, function(a) {
                angular.forEach(a, function(a) {
                    b.interface_id == a.interfaceId && a.portId == b.hw_index && (b.duration = (a.statistics.timeIntervalInMs / 1e3).toFixed(0), b.pktsRx = a.statistics.pktsRx, b.pktsTx = a.statistics.pktsTx, b.dataPktsTx = a.statistics.dataPktsTx, b.dataPktsRx = a.statistics.dataPktsRx, b.dataBytesTx = a.statistics.dataBytesTx, b.dataBytesRx = a.statistics.dataBytesRx, b.pktsDisordered = a.statistics.pktsDisordered, b.pktsTooLate = a.statistics.pktsTooLate, b.pktsMissing = a.statistics.pktsMissing, b.pktsDroppedTotal = a.statistics.pktsDroppedTotal, b.jitterAverage = (a.statistics.jitterAverage / 1e3).toFixed(1), b.jitterMax = a.statistics.jitterMax, b.avgBufferContent = a.statistics.avgBufferContentTimeInterval, b.maxBufferContent = a.statistics.maxBufferContentTimeInterval)
                })
            })
        })
    };
    f.subscribe(a, function() {
        return i()
    }), c().then(function(c) {
        c.emit("live:update", {
            statistics: "start"
        }), c.on("reconnect", function() {
            "deviceStatsCtrl" === a.controllerName && (console.log("socket.io: connected"), c.emit("live:update", {
                statistics: "start"
            }))
        }, a), c.on("disconnect", function() {
            console.log("socket.io: disconnected")
        }, a), c.on("live:statistics", function(b) {
            "deviceStatsCtrl" === a.controllerName && b && (a.statistics = b, j())
        }, a), a.$on("$destroy", function() {
            a.getStatisticsTimer && b.cancel(a.getStatisticsTimer), a.controllerName = null, c.emit("live:update", {
                statistics: "stop"
            })
        })
    })
}]);
/**/
var app = angular.module("moonraker");
/**/
app.controller("ModalInstanceConfirmCtrl", ["$scope", "$uibModalInstance", "modalMessage", function(a, b, c) {
    a.modalMessage = c, a.ok = function() {
        b.close("OK")
    }, a.cancel = function() {
        b.dismiss("Cancel")
    }
}]), app.controller("ModalInstanceWaitCtrl", ["$scope", "$uibModalInstance", "$timeout", "modalMessage", "seconds", function(a, b, c, d, e) {
    a.modalMessage = d, c(function() {
        b.close("OK")
    }, 1e3 * e)
}]), app.controller("ModalInstanceAlertCtrl", ["$scope", "$uibModalInstance", "$timeout", "modalMessage", function(a, b, c, d) {
    a.modalMessage = d, a.ok = function() {
        b.close("OK"), a.modalMessage = null
    }
}]), app.controller("ModalInstanceProgressCtrl", ["$scope", "$uibModalInstance", "$interval", "$timeout", "modalMessage", "seconds", function(a, b, c, d, e, f) {
    a.modalMessage = e;
    var g = f,
        h = 0;
    a.dynamic = 0, a.periodicityInMs = 250;
    var i = Date.now(),
        j = c(function() {
            h > g && a.stopTimer();
            var b = Date.now(),
                c = (b - i) / 1e3;
            i = b, c < .25 && (c = .25), h += c, a.dynamic = 100 * h / g
        }, a.periodicityInMs);
    a.stopTimer = function() {
        angular.isDefined(j) && (c.cancel(j), j = void 0, b.close())
    }
}]);
/**/
var AicUsersCtrl = function() {
    function a(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
        var o = this;
        this.gettext = c, this.showModalConfirm = d, this.showModalAlert = e, this.$window = f, this.naturalSort = g, this.capabilitiesService = h, this.devicesService = i, this.rolesService = j, this.ivpUsersService = k, this.licenseService = l, this.devices = m, this.pageGuideService = n, this.pendingUser = null, this.isMasterReachable = !0, this.pendingUserForm = null, this.aicUsers = [], this.assignableDevices = [{
            value: 0,
            text: c("Any")
        }], this.assignableRoles = [{
            value: 0,
            text: c("Default Role")
        }], this.emptyString = c("Not Set"), h.getDeviceCapabilites(0).then(function(a) {
            return o.deviceCapability = a
        }), this.onReceivedDevices(m), this.loadRoles(), this.loadUsers(), i.subscribe(a, function() {
            return o.getDevices()
        }), j.subscribe(a, function() {
            return o.loadRoles()
        }), k.subscribe(a, function() {
            return o.loadUsers()
        }), a.$on("$destroy", function() {
            n.cleanupGuide()
        })
    }
    return a.$inject = ["$scope", "$routeSegment", "gettext", "showModalConfirm", "showModalAlert", "$window", "naturalSort", "capabilitiesService", "devicesService", "rolesService", "ivpUsersService", "licenseService", "devices", "pageGuideService"], a.prototype.sortByKey = function(a, b, c) {
        var d = this;
        return a.sort(function(a, e) {
            return d.naturalSort.naturalSort(a[b] + "." + a[c], e[b] + "." + e[c])
        })
    }, a.prototype.refreshUser = function() {
        var a = this;
        this.ivpUsersService.usersFromServer.then(function(b) {
            a.aicUsers = b
        })
    }, a.prototype.loadUsers = function() {
        var a = this;
        this.ivpUsersService.users.then(function(b) {
            var c = b.filter(function(a) {
                return "LQ-AIC" === a.type
            });
            a.aicUsers = a.sortByKey(c, "type", "id")
        })
    }, a.prototype.loadRoles = function() {
        var a = this;
        this.rolesService.roles.then(function(b) {
            var c = b.filter(function(a) {
                return "LQ-AIC" === a.type
            });
            a.roles = a.sortByKey(c, "type", "label"), CCUtils.arrayUpdate("value", a.assignableRoles, [{
                value: 0,
                text: a.gettext("None")
            }].concat(a.roles.map(function(a) {
                return {
                    value: a.id,
                    text: a.label
                }
            })))
        })
    }, a.prototype.openGuide = function() {
        this.pageGuideService.openGuide("externalaicUsers")
    }, a.prototype.isDeviceReachable = function(a) {
        var b = this.devices.find(function(b) {
            return b.device_id === a
        });
        return !!b && b.device_isReachable
    }, a.prototype.getDevices = function() {
        var a = this;
        this.devicesService.devices.then(function(b) {
            return a.onReceivedDevices(b)
        })
    }, a.prototype.onReceivedDevices = function(a) {
        var b = this;
        CCUtils.arrayUpdate("device_id", this.devices, a);
        var c = a.find(function(a) {
            return a.isHost
        });
        c && (this.isMasterReachable = "IsMaster" === c.device_masterStatus || "READY" === c.device_masterStatus), this.assignableDevices = [{
            value: 0,
            text: this.gettext("Any")
        }], angular.forEach(a, function(a) {
            b.capabilitiesService.getDeviceCapabilites(a.device_id).then(function(c) {
                var d = c.users && angular.isDefined(c.users.find(function(a) {
                    return "LQ-AIC" === a.type
                }));
                d && b.assignableDevices.push({
                    value: a.device_id,
                    text: a.device_label
                })
            })
        }, this)
    }, a.prototype.onUserKeyDown = function(a, b) {
        13 == a ? b.$submit() : 27 == a && b.$cancel()
    }, a.prototype.onPendingUserKeyDown = function(a, b) {
        13 == a ? b.$submit() : 27 == a && (b.$cancel(), this.pendingUser = null)
    }, a.prototype.onEditableElementClick = function(a, b) {
        var c = b.target.attributes.getNamedItem("e-name"),
            d = null != c ? c.value : "";
        a.rowform.$show();
        var e = a.rowform.$editables.find(function(a) {
            return a.name == d
        });
        e && this.$window.setTimeout(function() {
            e.inputEl[0].focus()
        }, 0)
    }, a.prototype.onUserAdded = function() {
        this.pendingUser = null
    }, a.prototype.onPendingUserShown = function(a) {
        this.pendingUserForm = a.pendingUserForm
    }, a.prototype.onPendingUserHidden = function(a) {
        this.pendingUserForm = null, this.clearError(a)
    }, a.prototype.cancelAdd = function(a) {
        a.pendingUserForm.$cancel(), this.pendingUserForm = null, this.pendingUser = null
    }, a.prototype.validateUserLabel = function(a) {
        return "" != a || this.gettext("The label cannot be empty.")
    }, a.prototype.validateUserLogin = function(a, b) {
        if ("" == a) return this.gettext("The username cannot be empty.");
        for (var c = this.aicUsers, d = 0, e = c; d < e.length; d++) {
            var f = e[d];
            if (f.id != b && f.settings.login == a) return this.gettext("Another user has the same username.")
        }
        return !0
    }, a.prototype.showAssignedDevice = function(a) {
        var b = this.assignableDevices.reduce(function(b, c) {
            return b || c.value != a ? b : c
        }, null);
        return b ? b.text : this.assignableDevices[0].text
    }, a.prototype.showAssignedRole = function(a) {
        var b = this.assignableRoles.reduce(function(b, c) {
            return b || c.value != a ? b : c
        }, null);
        return b ? b.text : this.assignableRoles[0].text
    }, a.prototype.addUser = function(a, b) {
        var c = this;
        this.clearError(a), null != this.pendingUser && this.ivpUsersService.createUser({
            label: b.label,
            type: "LQ-AIC",
            settings: {
                login: b.login,
                password: b.password,
                defaultRole: 0 | b.defaultRole,
                assignedDeviceId: 0 | b.assignedDeviceId
            }
        }).then(function(a) {
            b.id = a.id, c.refreshUser()
        }, function(a) {
            a.data && a.data.message ? c.showModalAlert(c.gettext("Failed to create user. ") + a.data.message) : c.showModalAlert(c.gettext("Failed to create user. The server didn't respond."))
        })
    }, a.prototype.addPendingUser = function(a) {
        this.pendingUser = {
            id: -1,
            type: "LQ-AIC",
            label: "",
            settings: {
                login: "",
                password: "",
                defaultRole: 0,
                assignedDeviceId: 0
            },
            liveStatus: {
                connectionStatus: ""
            }
        }, a.pendingUserForm.$show()
    }, a.prototype.updateUser = function(a, b, c) {
        var d = this;
        return this.clearError(a), 0 !== c.assignedDeviceId && this.devices.find(function(a) {
            return a.device_id === c.assignedDeviceId
        }).device_usage > 85 ? (a.$error = this.gettext("Device resource usage limits exceeded (LQ Assignment refused)"), a.$error) : void this.ivpUsersService.updateUser(b, {
            label: c.label,
            settings: {
                login: c.login,
                password: c.password,
                assignedDeviceId: c.assignedDeviceId,
                defaultRole: c.defaultRole
            }
        }).then(function(a) {
            d.refreshUser()
        })["catch"](function(a) {
            console.log(a.message)
        })
    }, a.prototype.confirmRemoveUser = function(a) {
        var b = this,
            c = this.gettext("Are you sure you want to delete this user?"),
            d = "";
        this.showModalConfirm("sm", c, d, this.gettext("Delete"), this.gettext("Cancel"), function(c) {
            c && b.removelUser(a.id)
        })
    }, a.prototype.removelUser = function(a) {
        var b = this;
        this.ivpUsersService.deleteUser(a).then(function(a) {
            b.refreshUser()
        }, function(c) {
            c.data || b.showModalAlert(b.gettext("Failed to delete user: ") + a + b.gettext(". The server didn't respond."))
        })
    }, a.prototype.getLinkMasterOffLineWarning = function() {
        return this.isMasterReachable ? "" : this.gettext("Connection to Link-Master lost: Use of this feature is disabled")
    }, a.prototype.clearError = function(a) {
        a.$error && (a.$error = "")
    }, a.prototype.cancelUserEdit = function(a) {
        a.rowform.$cancel()
    }, a.prototype.getConnectionWarning = function(a) {
        var b = "";
        return b
    }, a.prototype.isUnlicensed = function() {
        var a = this;
        return !this.devices.some(function(b) {
            return a.licenseService.getNumberOfLicensedUsers(b, a.licenseService.AGENT_IC_LICENSE_REGEXP) > 0
        })
    }, a
}();
/**/
angular.module("moonraker").controller("aicUsersCtrl", AicUsersCtrl);
/**/
var RolesCtrl = function() {
    function a(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
        var v = this;
        this.$uibModal = b, this.$filter = c, this.gettext = d, this.showModalConfirm = e, this.showModalAlert = f, this.linkGroupCapabilitiesService = g, this.rolesService = h, this.connectionsService = i, this.audioInterfacesService = j, this.devicesService = k, this.endpointsService = l, this.portsService = m, this.$routeSegment = n, this.pageGuideService = p, this.ports = s, this.devices = t, this.audioInterfaces = u, this.showEndpoint = {}, this.RoleIsSelected = {}, this.EndpointCapabilitiesArray = [], this.MultiValueText = "[Multiple Values]", this.roleUsageCount = 0, this.roleInUseBy = "", this.Properties = {}, this.Errors = {}, this.selectedRoleIds = [], this.endpoints = [], this.selectedKey = 0, this.roleTypeToDeviceStringMapping = {
            "HMS-4X": "main station",
            "HRM-4X": "remote station",
            "HKB-2X": "speaker station",
            "HBP-2X": "beltpack",
            "FSII-BP": "beltpack",
            "LQ-AIC": "Agent-IC"
        }, this.roleTypeToDeviceStringPluralMapping = {
            "HMS-4X": "main stations",
            "HRM-4X": "remote stations",
            "HKB-2X": "speaker stations",
            "HBP-2X": "beltpacks",
            "FSII-BP": "beltpacks",
            "LQ-AIC": "Agent-ICs"
        }, this.filterPorts = function(a, b, c) {
            return "SA" != a.port_desc && "PGM" != a.port_desc
        }, p.defaultGuide = "roles", a.$on("$destroy", function() {
            p.cleanupGuide()
        }), this.initializeProperties(), this.UserData = o.UserData, this.Connections = i.filterConnections(q, "partyline"), this.Groups = i.filterConnections(q, "group"), this.linkGroupCapabilitiesService.subscribe(a, function() {
            v.linkGroupCapabilitiesService.linkGroupCapabilities.then(function(a) {
                v.processLinkGroupCapabilities(a)
            })
        }), this.rolesService.subscribe(a, function() {
            return v.refreshRoles()
        }), this.connectionsService.subscribe(a, function() {
            return v.refreshConnections()
        }), this.portsService.subscribe(a, function() {
            return v.refreshPorts()
        }), this.processLinkGroupCapabilities(r), this.refreshRoles(), this.refreshEndpoints(), this.refreshPorts()
    }
    return a.$inject = ["$scope", "$uibModal", "$filter", "gettext", "showModalConfirm", "showModalAlert", "linkGroupCapabilitiesService", "rolesService", "connectionsService", "audioInterfacesService", "devicesService", "endpointsService", "portsService", "$routeSegment", "userService", "pageGuideService", "connections", "linkGroupCapabilities", "ports", "devices", "audioInterfaces"], a.prototype.openGuide = function(a) {
        this.pageGuideService.openGuide(a)
    }, a.prototype.selectRole = function(a, b) {
        this.CurrentRole && this.CurrentRole.type != a.type && (b = !0), b && (this.clearSelectedRoles(), this.RoleIsSelected = {}), this.selectedRoleIds.indexOf(+a.id) === -1 ? (this.selectedRoleIds.push(+a.id), this.RoleIsSelected[a.res] = !0) : this.selectedRoleIds.length > 1 ? (this.selectedRoleIds.splice(this.selectedRoleIds.indexOf(+a.id), 1), this.RoleIsSelected[a.res] = !1) : this.RoleIsSelected[a.res] = !1, this.selectedRoleIds.length > 0 ? this.generateCurrentRole(!1) : (this.CurrentRole = void 0, this.selectDefaultRole(a.type)), this.showEndpoint[a.type] = !0
    }, a.prototype.updateSettingOnChange = function(a, b) {
        var c = this,
            d = {
                settings: {}
            };
        d.settings[a] = this.CurrentRole.settings[a];
        for (var e = function(e) {
                f.updateRole(e, d, function(b) {
                    c.findRoleById(e).settings[a] = c.CurrentRole.settings[a]
                }, function(a) {
                    b && (c.Errors[b] = a.data.message)
                })
            }, f = this, g = 0, h = this.selectedRoleIds; g < h.length; g++) {
            var i = h[g];
            e(i)
        }
    }, a.prototype.showEndpointAssignment = function() {
        for (var a = this, b = [], c = 0, d = this.endpoints; c < d.length; c++) {
            var e = d[c];
            if ("FSII-Antenna" !== e.type) {
                var f = void 0,
                    g = 0;
                if (e.liveStatus) switch (e.liveStatus.status) {
                    case "online":
                        0 !== e.settings.default_role ? (f = EndpointStatus.Forced, g = e.settings.default_role) : 0 !== e.liveStatus.role ? (f = EndpointStatus.Assigned, g = e.liveStatus.role) : f = EndpointStatus.NoRole;
                        break;
                    case "connecting":
                        f = EndpointStatus.NoRole;
                        break;
                    case "offline":
                        f = EndpointStatus.Offline, g = e.liveStatus.role;
                        break;
                    case "unknown":
                        f = EndpointStatus.Offline
                } else f = EndpointStatus.Offline, g = e.settings.default_role;
                b.push({
                    id: e.id,
                    label: e.label,
                    status: f,
                    role: g
                })
            }
        }
        for (var h = [], i = 0, j = this.endpoints; i < j.length; i++) {
            var e = j[i]; + e.settings.default_role === +this.CurrentRole.id && h.push(e.id)
        }
        var k = {
                title: "Device Association",
                messages: this.gettext("Select a device to associate with this role"),
                emptyCollectionMessages: this.gettext("There are no endpoints registered with the system."),
                connectables: {
                    Beltpacks: {
                        labelField: "label",
                        primaryKeyField: "id",
                        value: b
                    }
                },
                assigned: angular.copy(h),
                allowMultipleSelections: !0,
                requireMultipleSelections: !1,
                myId: this.CurrentRole.id
            },
            l = this.$uibModal.open({
                templateUrl: "views/dialogs/endpointSelectionDialog.html",
                controller: "endpointSelectionDialog",
                controllerAs: "dialogCtrl",
                size: "md",
                backdrop: "static",
                resolve: {
                    options: k
                }
            });
        l.result.then(function(b) {
            for (var c = h.filter(function(a) {
                    return b.selected.indexOf(a) < 0
                }), d = function(b) {
                    var c = a.endpoints.find(function(a) {
                        return a.id === b
                    });
                    a.endpointsService.changeEndpointRole(c.device_id, c.id, 0).then(function(b) {
                        a.refreshEndpoints()
                    })["catch"](function(b) {
                        a.Errors.labelError = b.data.message
                    })
                }, e = 0, f = c; e < f.length; e++) {
                var g = f[e];
                d(g)
            }
            for (var i = b.selected.filter(function(a) {
                    return h.indexOf(a) < 0
                }), j = function(b) {
                    var c = a.endpoints.find(function(a) {
                        return a.id === b
                    });
                    a.endpointsService.changeEndpointRole(c.device_id, c.id, +a.CurrentRole.id).then(function(b) {
                        a.refreshEndpoints()
                    })["catch"](function(b) {
                        a.Errors.labelError = b.data.message
                    })
                }, k = 0, l = i; k < l.length; k++) {
                var m = l[k];
                j(m)
            }
        })
    }, a.prototype.toggleSelectAll = function(a, b) {
        var c = this;
        if (b) {
            var d = !1;
            this.clearSelectedRoles(), this.Roles.forEach(function(b) {
                b.type != a || b.isDefault || (c.addRoleToSelection(b), d = !0)
            }), d || this.selectDefaultRole(a)
        } else this.selectDefaultRole(a);
        this.generateCurrentRole(!1)
    }, a.prototype.roleTypeIs = function(a) {
        var b = !1;
        if (this.CurrentRole)
            if (angular.isArray(a))
                for (var c = 0, d = a; c < d.length; c++) {
                    var e = d[c];
                    this.CurrentRole.type == e && (b = !0)
                } else this.CurrentRole.type == a && (b = !0);
        return b
    }, a.prototype.GetDisplayTextFromValue = function(a, b) {
        var c = this.$filter("filter")(b, {
            value: a
        }, !0);
        return a === this.MultiValueText ? a : null != c ? null != a && c.length ? c[0].text : this.gettext("Not set") : "undefined"
    }, a.prototype.MultipleRolesSelected = function() {
        return this.selectedRoleIds.length > 1
    }, a.prototype.canDelete = function() {
        var a = this,
            b = !0;
        return this.Roles ? this.Roles.forEach(function(c) {
            c.isDefault && a.RoleIsSelected[c.res] && (b = !1)
        }) : b = !1, b
    }, a.prototype.cloneCurrentRole = function(a) {
        var b = angular.copy(a || this.CurrentRole);
        a || (b.description = "Cloned from " + this.CurrentRole.label), delete b.id, delete b.isDefault, delete b.res, delete b.label, this.createRole(b)
    }, a.prototype.deleteCurrentRole = function() {
        var a = this,
            b = this.gettext("Are you sure you want to delete the selected roles?"),
            c = "",
            d = "";
        this.showModalConfirm("sm", b, c, this.gettext("Delete"), this.gettext("Cancel"), function(b) {
            if (b) {
                var c = [];
                a.Roles.forEach(function(b) {
                    !b.isDefault && a.RoleIsSelected[b.res] && (c.push(b.id), d = b.type)
                }), c.forEach(function(b) {
                    a.deleteRole(b)
                }), a.CurrentRole = void 0, a.refreshRoles(), a.selectDefaultRole(d)
            }
        })
    }, a.prototype.resetCurrentRole = function() {
        var a = this;
        if (this.CurrentRole && this.CurrentRole.isDefault) {
            var b = this.gettext("Are you sure you want to reset the role to its default settings?"),
                c = "";
            this.showModalConfirm("sm", b, c, this.gettext("Reset"), this.gettext("Cancel"), function(b) {
                b && a.resetRole(+a.CurrentRole.id)
            })
        }
    }, a.prototype.showNewRoleDialog = function() {
        var a = this,
            b = this.$uibModal.open({
                templateUrl: "../../views/dialogs/newRoleDialog.html",
                controller: "newRoleDialog",
                controllerAs: "dialogCtrl",
                size: "fm",
                backdrop: "static",
                resolve: {
                    selectedType: function() {
                        return a.CurrentRole.type
                    },
                    CreateRole: function() {
                        return {
                            create: function(b) {
                                return a.createRole(b)
                            }
                        }
                    }
                }
            });
        b.result.then(function(b) {
            b.confirmed && a.refreshRoles()
        })
    }, a.prototype.showLogicActionDestination = function(a, b) {
        var c = this,
            d = {};
        d.Channels = {
            labelField: "label",
            primaryKeyField: "res",
            value: this.convertToArray(this.Connections),
            sortField: "id"
        }, d.Groups = {
            labelField: "label",
            primaryKeyField: "res",
            value: this.convertToArray(this.Groups),
            sortField: "id"
        }, d.Roles = {
            labelField: "label",
            primaryKeyField: "res",
            value: this.$filter("filter")(this.Roles, {
                type: "FSII-BP",
                isDefault: !1
            }, !0)
        }, d.Ports = {
            labelField: "port_label",
            primaryKeyField: "res",
            value: this.$filter("filter")(this.convertToArray(this.ports), this.filterPorts)
        };
        var e = {
            title: "Logic Input Destination Assignment " + a,
            messages: "Select an item to assign to Logic Input " + a,
            connectables: d,
            assigned: [b],
            allowMultipleSelections: !1,
            requireMultipleSelections: !1
        };
        this.showAssignments(e, function(b) {
            c.CurrentRole.settings["logicInput" + a + "ActionDestination"] = b.selected[0] || "", c.updateSettingOnChange("logicInput" + a + "ActionDestination", "logicInputErrorTitle")
        })
    }, a.prototype.showPrgChannelAssignment = function() {
        for (var a = this, b = [], c = this.CurrentRole.settings, d = 0; d < c.pgmAssignments.length; d++) b.push(c.pgmAssignments[d].res);
        var e = {
            title: "Program Assignment",
            messages: this.gettext("Select Channels to create Program Assignments"),
            connectables: {
                Channels: {
                    labelField: "label",
                    primaryKeyField: "res",
                    value: this.convertToArray(this.Connections),
                    sortField: "id"
                }
            },
            assigned: b,
            allowMultipleSelections: !0,
            requireMultipleSelections: !1
        };
        this.showAssignments(e, function(b) {
            var d = [];
            b.selected.sort().map(function(a) {
                d.push({
                    res: a
                })
            }), c.pgmAssignments = d, angular.forEach(a.selectedRoleIds, function(b) {
                var c = a.findRoleById(b),
                    e = c.settings;
                e.pgmAssignments = d;
                var f = {
                    settings: {
                        pgmAssignments: d
                    }
                };
                a.updateRole(b, f, function() {}, function(b) {
                    a.Errors.generalSaErrorTitle = b.data.message
                })
            })
        })
    }, a.prototype.showSaChannelAssignment = function() {
        for (var a = this, b = [], c = this.CurrentRole.settings, d = 0; d < c.saConnectionAssignments.length; d++) b.push(c.saConnectionAssignments[d].res);
        var e = {
            title: "SA Assignment",
            messages: this.gettext("Select Channels to create SA Assignments"),
            connectables: {
                Channels: {
                    labelField: "label",
                    primaryKeyField: "res",
                    value: this.convertToArray(this.Connections),
                    sortField: "id"
                }
            },
            assigned: b,
            allowMultipleSelections: !1,
            requireMultipleSelections: !1
        };
        this.showAssignments(e, function(b) {
            var d = [];
            b.selected.sort().map(function(a) {
                d.push({
                    res: a
                })
            }), c.saConnectionAssignments = d, angular.forEach(a.selectedRoleIds, function(b) {
                var c = a.findRoleById(b),
                    e = c.settings;
                e.saConnectionAssignments = d;
                var f = {
                    settings: {
                        saConnectionAssignments: d
                    }
                };
                a.updateRole(b, f, function() {}, function(b) {
                    a.Errors.generalSaErrorTitle = b.data.message
                })
            })
        })
    }, a.prototype.showGroupsAssignments = function() {
        var a = this,
            b = [],
            c = this.CurrentRole.settings;
        angular.forEach(c.groups, function(c) {
            var d = c.res;
            d !== a.MultiValueText && b.push(d)
        });
        var d = {
            title: this.gettext("Groups"),
            connectables: {
                Groups: {
                    labelField: "label",
                    primaryKeyField: "res",
                    value: this.convertToArray(this.Groups),
                    sortField: "id"
                }
            },
            assigned: b,
            allowMultipleSelections: !0
        };
        this.showAssignments(d, function(b) {
            var d = [];
            b.selected.sort().map(function(a) {
                d.push({
                    res: a
                })
            }), c.groups = d, angular.forEach(a.selectedRoleIds, function(b) {
                var c = a.findRoleById(b),
                    e = c.settings;
                e.groups = d;
                var f = {
                    settings: {
                        groups: d
                    }
                };
                a.updateRole(b, f, function() {}, function(b) {
                    a.Errors.groupsErrorTitle = b.data.message
                })
            })
        })
    }, a.prototype.showInterfaceChannelAssignment = function(a) {
        for (var b = this, c = [], d = 0; d < a.connections.length; d++) c.push(a.connections[d].res);
        var e = {
            title: this.gettext("Port: " + a.label),
            messages: "Select Channel to assign to Port: " + a.label,
            connectables: {
                Channels: {
                    primaryKeyField: "res",
                    labelField: "label",
                    value: this.convertToArray(this.Connections),
                    sortField: "id"
                }
            },
            assigned: c,
            allowMultipleSelections: !1
        };
        this.showAssignments(e, function(c) {
            var d = [];
            c.selected.sort().map(function(a) {
                d.push({
                    res: a
                })
            }), a.connections = d, b.updateSettingOnChange("interfaces", null)
        })
    }, a.prototype.showLocalKeyAssignmentsDialog = function(a, b) {
        var c, d = this,
            e = !1,
            f = b + 1,
            g = "general";
        switch (a) {
            case "opto":
                g += "Gpi" + b, c = "GPI (Opto)", b && (c = "GPI (Opto-" + f + ")");
                break;
            case "relay":
                g += "Gpo" + b, c = "GPO (Relay)", b && (c = "GPO (Relay-" + f + ")"), e = !0
        }
        g += "ErrorTitle";
        var h = this.CurrentRole.settings,
            i = this.$filter("filter")(h.gpios, {
                type: a,
                hwIndex: b
            })[0],
            j = this.loadOptionsForLocalKeyAssignments(e, i),
            k = [];
        j.find(function(a) {
            return a.isSelected
        }) && k.push(j.find(function(a) {
            return a.isSelected
        }).value);
        var l = {
            messages: this.gettext("Select Local Key Assignments to trigger " + c),
            connectables: {
                Values: {
                    primaryKeyField: "value",
                    labelField: "label",
                    value: j
                }
            },
            assigned: k,
            numberOfColumns: 4
        };
        this.showAssignments(l, function(c) {
            h = d.CurrentRole.settings;
            for (var e = 0, f = 0, g = 0; g < h.gpios.length; g++)
                if (h.gpios[g].hwIndex === b && h.gpios[g].type === a) {
                    e = g;
                    for (var i = 0; i < h.gpios[g].events.length; i++)
                        if ("localKeyPress" === h.gpios[g].events[i].type) {
                            f = i;
                            break
                        } break
                } h.gpios[e].events[f].value = c.selected[0] || "none", d.updateProperties("settings.gpios." + e + ".events." + f + ".value")
        })
    }, a.prototype.getGpioLocalKeyPressAssignment = function(a, b) {
        var c = this,
            d = this.CurrentRole.settings,
            e = this.$filter("filter")(d.gpios, {
                type: a,
                hwIndex: b
            }),
            f = "";
        return e[0] ? e[0].events.length > 0 && e[0].events[0].value === this.MultiValueText ? this.MultiValueText : (angular.forEach(e[0].events, function(b) {
            "localKeyPress" == b.type && (f += "relay" === a ? c.GetDisplayTextFromValue(b.value, c.Properties.relayOptions) : c.GetDisplayTextFromValue(b.value, c.Properties.optoOptions), f += ", ")
        }), f.length > 2 && f.indexOf(", ", f.length - 2) !== -1 && (f = f.substring(0, f.length - 2)), "" === f && (f = "None"), f) : f = "None"
    }, a.prototype.GetAssignments = function(a) {
        var b = "";
        return a && (b = this.keyAssignmentDescription(a), "" === b && (b = "Unassigned")), b
    }, a.prototype.updateProperties = function(a) {
        for (var b = this, c = a, d = !1, e = this.CurrentRole, f = c.split("."), g = 0, h = f; g < h.length; g++) {
            var i = h[g];
            if (!e.hasOwnProperty(i) && !Array.isArray(e)) return void console.log("Could not update property. Property not found.");
            e = e[i]
        }
        var j = {},
            k = "";
        for (var l in f) {
            if (!isNaN(parseFloat(f[l])) && isFinite(+f[l])) {
                d = !0;
                break
            }
            k += f[l] + "."
        }
        k = k.substring(0, k.length - 1);
        for (var m = function(a) {
                if (d) {
                    var f = {};
                    angular.copy(n.findRoleById(a), f);
                    for (var g = k.split("."), h = 0, i = g; h < i.length; h++) {
                        var l = i[h];
                        if (!f.hasOwnProperty(l)) return {
                            value: void 0
                        };
                        f = f[l], j[l] = Array.isArray(f) ? [] : {}
                    }
                    j = f, CCUtils.setPropertyByPath(j, c.replace(k + ".", ""), e), j = CCUtils.setPropertyByPath({}, k, j)
                } else j = CCUtils.setPropertyByPath({}, c, e);
                var m = angular.copy(j);
                n.updateRole(a, m, function(d) {
                    j = CCUtils.setPropertyByPath(b.findRoleById(a), c, e)
                }, function(a) {})
            }, n = this, o = 0, p = this.selectedRoleIds; o < p.length; o++) {
            var q = p[o],
                r = m(q);
            if ("object" == typeof r) return r.value
        }
    }, a.prototype.getRelayDetectionOfTalkCall = function(a, b) {
        var c = "",
            d = this.CurrentRole.settings,
            e = this.$filter("filter")(d.gpios, {
                type: "relay",
                hwIndex: a
            })[0];
        if (!e) return "None";
        var f = this.$filter("filter")(e.events, {
            type: "connection",
            value: b
        })[0];
        return f ? (c = this.GetAssignments(f.connections), "" !== c && "Unassigned" !== c || (c = "None"), c) : "None"
    }, a.prototype.showRelayDetectionOfTalkCall = function(a, b) {
        var c = this,
            d = "general",
            e = "talk" == b,
            f = "GPO (Relay)",
            g = a + 1;
        a && (d += "Gpo" + a, f = "GPO (Relay-" + g + ")"), d += "ErrorTitle";
        var h = this.CurrentRole.settings,
            i = this.gettext("The following triggers within the selected Channels will activate " + f),
            j = this.$filter("filter")(h.gpios, {
                type: "relay",
                hwIndex: a
            })[0];
        if (!j) return void console.error("Missing relay " + a + " in role");
        j.events || (j.events = []);
        var k = [],
            l = this.$filter("filter")(j.events, {
                type: "connection",
                value: b
            })[0];
        l || (l = {
            type: "connection",
            value: b,
            connections: []
        }), angular.forEach(l.connections, function(a) {
            a.res !== c.MultiValueText && k.push(a.res)
        });
        var m = {
            title: this.gettext(i),
            connectables: {
                Channels: {
                    labelField: "label",
                    primaryKeyField: "res",
                    value: this.convertToArray(this.Connections),
                    sortField: "id"
                }
            },
            showRelayDetectionOfTalkMessage: e,
            showRelayDetectionOfCallMessage: !e,
            assigned: k,
            allowMultipleSelections: !0
        };
        this.showAssignments(m, function(d) {
            j = c.$filter("filter")(h.gpios, {
                type: "relay",
                hwIndex: a
            })[0];
            var e = c.$filter("filter")(j.events, {
                type: "connection",
                value: b
            })[0];
            e || (e = {
                type: "connection",
                value: b,
                connections: []
            }, j.events.push(e));
            var f = [];
            d.selected.sort().map(function(a) {
                f.push({
                    res: a
                })
            }), f && e && (e.connections = f);
            for (var g = 0, i = 0, k = 0; k < c.CurrentRole.settings.gpios.length; k++)
                if (c.CurrentRole.settings.gpios[k].hwIndex === a && "relay" === c.CurrentRole.settings.gpios[k].type) {
                    g = k;
                    for (var l = 0; l < c.CurrentRole.settings.gpios[k].events.length; l++)
                        if ("connection" === c.CurrentRole.settings.gpios[k].events[l].type && c.CurrentRole.settings.gpios[k].events[l].value === b) {
                            i = l;
                            break
                        } break
                } c.updateProperties("settings.gpios." + g + ".events." + i + ".connections")
        })
    }, a.prototype.updateKeysetCallback = function() {
        var a = this;
        this.selectedRoleIds.forEach(function(b) {
            var c = a.findRoleById(b),
                d = angular.copy(a.CurrentRole.settings.keysets);
            d = a.removeMultiValuesFromKeyset(c.settings.keysets, d), a.updateRole(b, {
                settings: {
                    keysets: d
                }
            }, function(b) {
                a.findRoleById(b).settings.keysets = d
            }, function(b) {
                a.Errors.generalKeysetErrorTitle = b.data.message
            })
        })
    }, a.prototype.roleTypeToDeviceString = function(a, b) {
        return b ? this.roleTypeToDeviceStringPluralMapping[a] || "" : this.roleTypeToDeviceStringMapping[a] || ""
    }, a.prototype.getRoleCapabilitiesForType = function(a) {
        return this.EndpointCapabilitiesArray.find(function(b) {
            return b.type === a
        })
    }, a.prototype.getPortsForLogicInputDestinations = function() {
        return this.ports
    }, a.prototype.selectDefaultRole = function(a) {
        var b = this;
        this.clearSelectedRoles(), this.Roles.forEach(function(c) {
            c.type === a && c.isDefault && b.addRoleToSelection(c)
        }), this.generateCurrentRole(!1)
    }, a.prototype.showAssignments = function(a, b, c) {
        var d = this.$uibModal.open({
            templateUrl: "views/dialogs/connectionSelectionDialog.html",
            controller: "connectionSelectionDialog",
            controllerAs: "dialogCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                options: a
            }
        });
        d.result.then(function(a) {
            b(a)
        })
    }, a.prototype.refreshRoles = function(a) {
        var b = this;
        this.rolesService.rolesFromServer.then(function(c) {
            if (b.Roles = c, b.selectFirstRole(), b.generateCurrentRole(!0), a) {
                var d = b.findRoleById(a);
                b.selectRole(d, !0)
            }
        })
    }, a.prototype.refreshConnections = function() {
        var a = this;
        this.connectionsService.connections.then(function(b) {
            a.Groups = a.connectionsService.filterConnections(b, "group"), a.Connections = a.connectionsService.filterConnections(b, "partyline")
        })
    }, a.prototype.refreshPorts = function() {
        var a = this;
        this.portsService.ports.then(function(b) {
            a.ports = b.reduce(function(a, b) {
                return a[b.res] = b, a
            }, {})
        })
    }, a.prototype.refreshEndpoints = function() {
        var a = this;
        this.endpointsService.endpointsFromServer.then(function(b) {
            a.endpoints = b, a.CurrentRole ? a.updateNumberOfDevicesUsingRole() : (a.roleUsageCount = 0, a.roleInUseBy = "")
        })
    }, a.prototype.updateNumberOfDevicesUsingRole = function() {
        for (var a = 0, b = "", c = 0, d = this.endpoints; c < d.length; c++) {
            var e = d[c];
            e.settings.default_role && +e.settings.default_role === +this.CurrentRole.id && a++, e.role && e.liveStatus && e.liveStatus.role === +this.CurrentRole.id && "online" === e.liveStatus.status && (b = e.label)
        }
        this.roleUsageCount = a, this.roleInUseBy = b
    }, a.prototype.addRoleToSelection = function(a) {
        var b = this.selectedRoleIds.indexOf(+a.id);
        b < 0 && this.selectedRoleIds.push(+a.id), this.RoleIsSelected[a.res] = !0
    }, a.prototype.processLinkGroupCapabilities = function(a) {
        this.EndpointCapabilitiesArray = a.roles
    }, a.prototype.updateRole = function(a, b, c, d) {
        this.rolesService.updateRole(a, b).then(function(b) {
            c && c(a)
        })["catch"](function(a) {
            d ? d(a) : console.log(a.data.message)
        })
    }, a.prototype.deleteRole = function(a) {
        var b = this;
        this.rolesService.deleteRole(a).then(function(a) {}, function(c) {
            c.data || b.showModalAlert(b.gettext("Failed to delete role: ") + a + b.gettext(". The server didn't respond."))
        })
    }, a.prototype.createRole = function(a) {
        var b = this;
        this.rolesService.createRole(a).then(function(a) {
            b.refreshRoles(a.id)
        }, function(a) {
            a.data && a.data.message ? b.showModalAlert(b.gettext("Failed to duplicate role. ") + a.data.message) : b.showModalAlert(b.gettext("Failed to duplicate role. The device didn't respond."))
        })
    }, a.prototype.resetRole = function(a) {
        var b = this;
        this.rolesService.resetRole(a).then(function(a) {
            b.refreshRoles()
        }, function(c) {
            c.data && c.data.message ? b.showModalAlert(b.gettext("Failed to reset role: ") + a + ". " + c.data.message) : b.showModalAlert(b.gettext("Failed to reset role: ") + a + b.gettext(". The server didn't respond."))
        })
    }, a.prototype.selectFirstRole = function() {
        if (!this.selectedRoleIds.length) {
            if (this.$routeSegment.$routeParams.initialId) {
                var a = this.findRoleById(+this.$routeSegment.$routeParams.initialId);
                if (a) return void this.selectRole(a, !0)
            }
            this.Roles.length > 0 && this.selectRole(this.Roles[0], !0)
        }
    }, a.prototype.generateCurrentRole = function(a) {
        var b;
        if (!(this.selectedRoleIds.length > 0)) return void(this.CurrentRole = void 0);
        b = this.findRoleById(this.selectedRoleIds[0]);
        var c = angular.copy(b);
        if (this.selectedRoleIds.length > 1)
            for (var d = 1; d < this.selectedRoleIds.length; d++) {
                var e = this.findRoleById(this.selectedRoleIds[d]);
                c = this.deepCompareForMultiSelect(c, e)
            } else this.deepCompareForMultiSelect(c, c);
        this.CurrentRole && this.CurrentRole.settings.keysets && this.selectedKey >= this.CurrentRole.settings.keysets.length && (this.selectedKey = 0), a ? CCUtils.copyObjectPreserveRefs(c, this.CurrentRole) : this.CurrentRole = c, this.processIncompatibleHardwareWarningMessage(), this.updateNumberOfDevicesUsingRole()
    }, a.prototype.clearSelectedRoles = function() {
        this.selectedRoleIds = [], this.RoleIsSelected = {}, this.selectedKey = 0
    }, a.prototype.findRoleById = function(a) {
        return this.Roles.find(function(b) {
            return b.id === a
        })
    }, a.prototype.deepCompareForMultiSelect = function(a, b) {
        for (var c = Object.keys(a), d = 0; d < c.length; d++)
            if ("connections" == c[d] || "groups" == c[d] || "pgmAssignments" == c[d]) JSON.stringify(a[c[d]]) !== JSON.stringify(b[c[d]]) && (a[c[d]] = [{
                res: this.MultiValueText
            }]);
            else if (void 0 === b) console.log(a[c[d]]);
        else if (b.hasOwnProperty(c[d]))
            if (Array.isArray(a[c[d]]))
                if (a[c[d]].length != b[c[d]].length) {
                    var e = this.deepCompareForMultiSelect(a[c[d]][0], b[c[d]][0]);
                    a[c[d]] = [], a[c[d]].push(e)
                } else
                    for (var f in a[c[d]]) a[c[d]][f] = this.deepCompareForMultiSelect(a[c[d]][f], b[c[d]][f]);
        else "object" == typeof a[c[d]] ? a[c[d]] = this.deepCompareForMultiSelect(a[c[d]], b[c[d]]) : a[c[d]] != b[c[d]] && (a[c[d]] = this.MultiValueText);
        else delete a[c[d]];
        return a
    }, a.prototype.initializeProperties = function() {
        this.Properties = {
            sidetoneGain: this.generateValueText(-18, 0, 6, " dB", !1),
            headphoneGain: this.generateValueText(0, 12, 3, " dB", !1),
            pgmGain: this.generateValueText(-12, 12, 6, " dB", !1),
            saGain: this.generateValueText(-12, 12, 6, " dB", !1),
            hotMicGain: this.generateValueText(-12, 12, 6, " dB", !1),
            allTalkKeyValues: [{
                value: "all",
                text: this.gettext("All Channels")
            }, {
                value: "visible",
                text: this.gettext("Visible Channels")
            }],
            rmkBtnModeValues: [{
                value: "all",
                text: this.gettext("All Channels")
            }, {
                value: "visible",
                text: this.gettext("Visible Channels")
            }, {
                value: "disabled",
                text: this.gettext("Disabled")
            }],
            headroomValues: [{
                value: "normal",
                text: this.gettext("Normal")
            }, {
                value: "high",
                text: this.gettext("High")
            }],
            displayBrightnessValues: [{
                value: "low",
                text: this.gettext("Low")
            }, {
                value: "medium",
                text: this.gettext("Medium")
            }, {
                value: "high",
                text: this.gettext("High")
            }],
            keyBrightnessValues: [{
                value: "highLow",
                text: this.gettext("High/Low")
            }, {
                value: "highOff",
                text: this.gettext("High/Off")
            }, {
                value: "lowOff",
                text: this.gettext("Low/Off")
            }, {
                value: "offOff",
                text: this.gettext("Off/Off")
            }],
            screenSaverValues: [{
                value: "disabled",
                text: this.gettext("Disabled")
            }, {
                value: "blank",
                text: this.gettext("Blank")
            }, {
                value: "connectionName",
                text: this.gettext("Channel Name")
            }, {
                value: "roleName",
                text: this.gettext("Role Name")
            }, {
                value: "hostName",
                text: this.gettext("Hostname")
            }],
            loudSpeakerDimValues: [{
                value: 0,
                text: this.gettext("0 dB")
            }, {
                value: -3,
                text: this.gettext("- 3 dB")
            }, {
                value: -6,
                text: this.gettext("- 6 dB")
            }, {
                value: -12,
                text: this.gettext("- 12 dB")
            }, {
                value: -24,
                text: this.gettext("- 24 dB")
            }],
            prgm_ifbValues: [{
                value: 0,
                text: this.gettext("IFB Disabled")
            }, {
                value: -6,
                text: this.gettext("- 6 dB")
            }, {
                value: -12,
                text: this.gettext("- 12 dB")
            }, {
                value: -18,
                text: this.gettext("- 18 dB")
            }, {
                value: -24,
                text: this.gettext("- 24 dB")
            }, {
                value: -80,
                text: this.gettext("Full Cut")
            }],
            gainValues: this.generateValueText(-18, 12, 6, " dB", !1),
            vox_off_delayValuesMs: [{
                value: 500,
                text: this.gettext("0.5 s")
            }, {
                value: 1e3,
                text: this.gettext("1 s")
            }, {
                value: 2e3,
                text: this.gettext("2 s")
            }, {
                value: 3e3,
                text: this.gettext("3 s")
            }, {
                value: 4e3,
                text: this.gettext("4 s")
            }],
            headphoneLimitValues: [{
                value: "off",
                text: this.gettext("Off")
            }, {
                value: "6",
                text: this.gettext("+ 6 dB")
            }, {
                value: "0",
                text: this.gettext("0 dB")
            }, {
                value: "-6",
                text: this.gettext("- 6 dB")
            }],
            headphoneLimitValuesFSII: this.generateValueText(-12, 8, 1, " dB", !1),
            headphoneLowLevelLimitFSIIValues: [{
                value: -6,
                text: this.gettext("-6 dB")
            }, {
                value: -12,
                text: this.gettext("-12 dB")
            }, {
                value: -21,
                text: this.gettext("-21 dB")
            }, {
                value: -70,
                text: this.gettext("OFF (-70 dB)")
            }],
            volumeAdjustFSIIValues: [{
                value: 0,
                text: this.gettext("0.0 dB")
            }, {
                value: -.4,
                text: this.gettext("-0.4 dB")
            }, {
                value: -.7,
                text: this.gettext("-0.7 dB")
            }, {
                value: -1.4,
                text: this.gettext("-1.4 dB")
            }, {
                value: -1.8,
                text: this.gettext("-1.8 dB")
            }, {
                value: -2.5,
                text: this.gettext("-2.5 dB")
            }, {
                value: -3.6,
                text: this.gettext("-3.6 dB")
            }, {
                value: -4.3,
                text: this.gettext("-4.3 dB")
            }, {
                value: -5.3,
                text: this.gettext("-5.3 dB")
            }, {
                value: -6,
                text: this.gettext("-6.0 dB")
            }, {
                value: -7.1,
                text: this.gettext("-7.1 dB")
            }, {
                value: -8.5,
                text: this.gettext("-8.5 dB")
            }, {
                value: -9.6,
                text: this.gettext("-9.6 dB")
            }, {
                value: -11,
                text: this.gettext("-11.0 dB")
            }, {
                value: -12.4,
                text: this.gettext("-12.4 dB")
            }, {
                value: -14.2,
                text: this.gettext("-14.2 dB")
            }, {
                value: -16.7,
                text: this.gettext("-16.7 dB")
            }, {
                value: -20.6,
                text: this.gettext("-20.6 dB")
            }, {
                value: -24.9,
                text: this.gettext("-24.9 dB")
            }, {
                value: -29.8,
                text: this.gettext("-29.8 dB")
            }, {
                value: -36.6,
                text: this.gettext("-36.6 dB")
            }, {
                value: -45.1,
                text: this.gettext("-45.1 dB")
            }, {
                value: -54,
                text: this.gettext("-54.0 dB")
            }, {
                value: -69.9,
                text: this.gettext("-69.9 dB")
            }],
            lineInVolumeFSIIValues: this.generateValueText(-15, 6, 3, " dB", !1),
            inputOutputGainFSIIValues: this.generateValueText(-70, 15, 1, " dB", !1),
            masterVolumeModeFSIIValues: [{
                value: !1,
                text: this.gettext("Talk Keys")
            }, {
                value: !0,
                text: this.gettext("Master Volume")
            }],
            partyLineDisplayModeFSIIValues: [{
                value: !1,
                text: this.gettext("Intercom Mode")
            }, {
                value: !0,
                text: this.gettext("Partyline Mode")
            }],
            menuLevelFSIIValues: [{
                value: "advanced",
                text: this.gettext("Advanced")
            }, {
                value: "normal",
                text: this.gettext("Normal")
            }, {
                value: "basic",
                text: this.gettext("Basic")
            }, {
                value: "none",
                text: this.gettext("None")
            }],
            replyTalkAutoClearFSIIValues: this.generateValueText(0, 60, 1, " Second", !0, !0, !0),
            displayBrightnessFSIIValues: [{
                value: "verylow",
                text: this.gettext("Very Low")
            }, {
                value: "low",
                text: this.gettext("Low")
            }, {
                value: "medium",
                text: this.gettext("Medium")
            }, {
                value: "high",
                text: this.gettext("High")
            }, {
                value: "veryhigh",
                text: this.gettext("Very High")
            }],
            menuKeyModeFSIIValues: [{
                value: "listenagain",
                text: this.gettext("Listen Again")
            }, {
                value: "switchvolctrl",
                text: this.gettext("Switch Vol Ctrl")
            }],
            displayDimTimeoutFSIIValues: this.generateValueText(0, 120, 5, " Second", !0, !0, !0),
            displayTimeoutFSIIValues: this.generateValueText(5, 120, 5, " Second", !0),
            listenAgainAutoDeleteFSIIValues: this.generateValueText(0, 240, 30, " Minute", !0, !0, !0),
            listenAgainRecordTimeFSIIValues: this.generateValueText(0, 15, 1, " Second", !0, !0, !0),
            alarmModeFSIIValues: [{
                value: "vibrate+audio",
                text: this.gettext("Vibrate & Audible")
            }, {
                value: "vibrate",
                text: this.gettext("Vibrate Only")
            }, {
                value: "audio",
                text: this.gettext("Audible Only")
            }, {
                value: "off",
                text: this.gettext("Off")
            }],
            outOfRangeAlarmFSIIValues: [{
                value: "audio",
                text: this.gettext("Audio Only")
            }, {
                value: "off",
                text: this.gettext("Off")
            }],
            lowBatteryThresholdFSIIValues: this.generateValueText(0, 100, 5, "%", !0),
            sidetoneControlValues: [{
                value: "tracking",
                text: this.gettext("Tracking")
            }, {
                value: "non-tracking",
                text: this.gettext("Non-Tracking")
            }, {
                value: "disabled",
                text: this.gettext("Disabled")
            }],
            BoolToEnabledDisabled: [{
                value: !0,
                text: this.gettext("Enabled")
            }, {
                value: !1,
                text: this.gettext("Disabled")
            }],
            ReverseBoolToEnabledDisabled: [{
                value: !1,
                text: this.gettext("Enabled")
            }, {
                value: !0,
                text: this.gettext("Disabled")
            }],
            BoolToStringDisabled: [{
                value: !0,
                text: this.gettext("True")
            }, {
                value: !1,
                text: this.gettext("False")
            }],
            headsetMicTypeValues: [{
                value: "electret",
                text: this.gettext("Electret (-15dB)")
            }, {
                value: "dynamic_0",
                text: this.gettext("Dynamic (0dB)")
            }, {
                value: "dynamic_10",
                text: this.gettext("Dynamic (low)")
            }],
            keysetSALatching: [{
                value: !0,
                text: this.gettext("Latching")
            }, {
                value: !1,
                text: this.gettext("Non-Latching")
            }],
            MuteUnmute: [{
                value: !0,
                text: this.gettext("Unmute")
            }, {
                value: !1,
                text: this.gettext("Mute")
            }],
            sa_modeValues: [{
                value: !0,
                text: this.gettext("Channel Assign")
            }, {
                value: !1,
                text: this.gettext("SA")
            }],
            optoOptions: [{
                type: "localAssign",
                value: "none",
                text: this.gettext("None"),
                "default": !0
            }, {
                type: "localAssign",
                value: "talk1",
                text: this.gettext("Talk Key 1")
            }, {
                type: "localAssign",
                value: "talk2",
                text: this.gettext("Talk Key 2")
            }, {
                type: "localAssign",
                value: "talk3",
                text: this.gettext("Talk Key 3")
            }, {
                type: "localAssign",
                value: "talk4",
                text: this.gettext("Talk Key 4")
            }, {
                type: "localAssign",
                value: "call1",
                text: this.gettext("Call Key 1")
            }, {
                type: "localAssign",
                value: "call2",
                text: this.gettext("Call Key 2")
            }, {
                type: "localAssign",
                value: "call3",
                text: this.gettext("Call Key 3")
            }, {
                type: "localAssign",
                value: "call4",
                text: this.gettext("Call Key 4")
            }],
            relayOptions: [{
                type: "localAssign",
                value: "none",
                text: this.gettext("None")
            }, {
                type: "localAssign",
                value: "talk1",
                text: this.gettext("Talk Key 1")
            }, {
                type: "localAssign",
                value: "talk2",
                text: this.gettext("Talk Key 2")
            }, {
                type: "localAssign",
                value: "talk3",
                text: this.gettext("Talk Key 3")
            }, {
                type: "localAssign",
                value: "talk4",
                text: this.gettext("Talk Key 4")
            }, {
                type: "localAssign",
                value: "call1",
                text: this.gettext("Call Key 1")
            }, {
                type: "localAssign",
                value: "call2",
                text: this.gettext("Call Key 2")
            }, {
                type: "localAssign",
                value: "call3",
                text: this.gettext("Call Key 3")
            }, {
                type: "localAssign",
                value: "call4",
                text: this.gettext("Call Key 4")
            }, {
                type: "localAssign",
                value: "saKey",
                text: this.gettext("SA Key")
            }, {
                type: "connectionAssign",
                value: "talkEvent",
                text: this.gettext("Detection of Talk")
            }, {
                type: "connectionAssign",
                value: "callEvent",
                text: this.gettext("Detection of Call Control Event")
            }],
            minMasterVolumeFSIIValues: [{
                value: -80,
                text: this.gettext("Off")
            }, {
                value: -24.9,
                text: this.gettext("-24.9 dB")
            }, {
                value: -11,
                text: this.gettext("-11.0 dB")
            }, {
                value: -6,
                text: this.gettext("-6.0 dB")
            }],
            FSIIMicTypeValues: [{
                value: "dynamic",
                text: this.gettext("Dynamic")
            }, {
                value: "electrect",
                text: this.gettext("Electret")
            }, {
                value: "automatic",
                text: this.gettext("Automatic")
            }],
            logicInputValues: [{
                value: "none",
                text: this.gettext("No Function")
            }, {
                value: "activateAKey",
                text: this.gettext("Activate A Key")
            }, {
                value: "activateBKey",
                text: this.gettext("Activate B Key")
            }, {
                value: "activateCKey",
                text: this.gettext("Activate C Key")
            }, {
                value: "activateDKey",
                text: this.gettext("Activate D Key")
            }, {
                value: "activateReplyKey",
                text: this.gettext("Activate Reply Key")
            }, {
                value: "activateRoute",
                text: this.gettext("Activate Configured Action")
            }, {
                value: "activateAllTalks",
                text: this.gettext("Activate All Pre-Selected Talk Keys")
            }, {
                value: "activateReplyThenClear",
                text: this.gettext("Activate Reply Then Clear Key")
            }],
            logicInputActionTypeValues: [{
                value: "none",
                text: this.gettext("None")
            }, {
                value: "talk",
                text: this.gettext("Talk")
            }, {
                value: "listen",
                text: this.gettext("Listen")
            }, {
                value: "talklisten",
                text: this.gettext("Talk & Listen")
            }]
        }
    }, a.prototype.generateValueText = function(a, b, c, d, e, f, g) {
        for (var h = [], i = a; i <= b; i += c) 0 === i && f ? h.push({
            text: "Off",
            value: 0
        }) : g && 1 != i ? h.push({
            text: i + this.gettext(d + "s"),
            value: i
        }) : h.push({
            text: i + this.gettext(d),
            value: i
        });
        return e ? h : h.reverse()
    }, a.prototype.convertToArray = function(a) {
        var b = [];
        return angular.forEach(a, function(a) {
            b.push(a)
        }), b
    }, a.prototype.keyAssignmentDescription = function(a) {
        var b = this,
            c = [];
        return angular.forEach(a, function(a) {
            var d = a.res;
            d == b.MultiValueText && c.push(b.MultiValueText), angular.forEach(b.Connections, function(a) {
                a.res === d && c.push(a.label)
            }), angular.forEach(b.Groups, function(a) {
                a.res === d && c.push(a.label)
            }), angular.forEach(b.Roles, function(a, b) {
                a.res === d && c.push(a.label)
            }), angular.forEach(b.ports, function(a, b) {
                b === d && c.push(a.port_label)
            })
        }), c.map(function(a, b) {
            return a
        }).join(", ")
    }, a.prototype.loadOptionsForLocalKeyAssignments = function(a, b) {
        var c, d = [];
        c = a ? this.$filter("filter")(this.Properties.relayOptions, {
            type: "localAssign"
        }, !0) : this.$filter("filter")(this.Properties.optoOptions, {
            type: "localAssign"
        }, !0);
        for (var e = 0; e < c.length; e++) "none" != c[e].value && d.push({
            value: c[e].value,
            label: c[e].text,
            isSelected: !1
        });
        for (var e = 0; e < d.length; e++)
            if (b) {
                var f = this.$filter("filter")(b.events, {
                    value: d[e].value,
                    type: "localKeyPress"
                }, !0);
                angular.isDefined(f) && f.length > 0 && (d[e].isSelected = !0)
            } return d
    }, a.prototype.removeMultiValuesFromKeyset = function(a, b) {
        var c = Object.keys(b);
        if ("undefined" == typeof a && null == a) return b[c[0]] == this.MultiValueText ? null : b;
        for (var d = 0; d < c.length; d++)
            if (a.hasOwnProperty(c[d]))
                if (Array.isArray(b[c[d]]))
                    for (var e in b[c[d]]) b[c[d]][e] = this.removeMultiValuesFromKeyset(a[c[d]][e], b[c[d]][e]), null == b[c[d]][e] && b[c[d]].splice(e, 1);
                else "object" == typeof b[c[d]] ? b[c[d]] = this.removeMultiValuesFromKeyset(a[c[d]], b[c[d]]) : b[c[d]] == this.MultiValueText && (b[c[d]] = a[c[d]]);
        return b
    }, a.prototype.processIncompatibleHardwareWarningMessage = function() {
        var a = this;
        this.devicesService.devices.then(function(b) {
            a.devices = b, a.audioInterfacesService.audioInterfaces.then(function(b) {
                a.audioInterfaces = b
            })
        })
    }, a
}();
/**/
angular.module("moonraker").controller("rolesCtrl", RolesCtrl);
/**/
var NewRoleDialog = function() {
    function a(a, b, c, d, e, f, g) {
        var h = this;
        this.$uibModalInstance = b, this.selectedType = c, this.CreateRole = d, this.linkGroupCapabilitiesService = e, this.naturalSort = f, this.rolesService = g, this.EndpointCapabilitiesArray = [], this.newRole = {}, this.SelectRoleType(c), this.rolesService.subscribe(a, function() {
            return h.refreshRoles()
        }), this.refreshRoles(), this.refreshEndpointCapabilities()
    }
    return a.$inject = ["$scope", "$uibModalInstance", "selectedType", "CreateRole", "linkGroupCapabilitiesService", "naturalSort", "rolesService"], Object.defineProperty(a.prototype, "CanAddRoles", {
        get: function() {
            return "undefined" == typeof this.newRole.label || "" === this.newRole.label.trim()
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.AddRole = function() {
        var a = this,
            b = this.getRoleCapabilitiesForType(this.selectedType).labelLength;
        if (!(this.newRole.label.length > b)) {
            if (this.Roles.find(function(b) {
                    return b.label === a.newRole.label && b.type === a.templateRole.type
                })) return void(this.createError = "Label is already in use");
            var c = angular.copy(this.templateRole);
            c.label = this.newRole.label, c.description = this.newRole.description, delete c.isDefault, delete c.res, delete c.id, this.CreateRole.create(c), this.newRole.label = "", this.newRole.description = "", this.createError = ""
        }
    }, a.prototype.SelectRoleType = function(a) {
        var b = this;
        this.selectedType = a, this.Roles && this.Roles.forEach(function(a) {
            if (a.type === b.selectedType && a.isDefault) return void(b.templateRole = a)
        })
    }, a.prototype.Close = function() {
        var a = {
            confirmed: !1
        };
        this.$uibModalInstance.close(a)
    }, a.prototype.getRoleCapabilitiesForType = function(a) {
        return this.EndpointCapabilitiesArray.find(function(b) {
            return b.type === a
        })
    }, a.prototype.refreshRoles = function() {
        var a = this;
        this.rolesService.rolesFromServer.then(function(b) {
            a.Roles = a.sortByKey(b, "type", "label"), a.SelectRoleType(a.selectedType)
        })
    }, a.prototype.refreshEndpointCapabilities = function() {
        var a = this;
        this.linkGroupCapabilitiesService.linkGroupCapabilities.then(function(b) {
            a.EndpointCapabilitiesArray = b.roles
        })
    }, a.prototype.sortByKey = function(a, b, c) {
        var d = this;
        return a.sort(function(a, e) {
            return d.naturalSort.naturalSort(a[b] + "." + a[c], e[b] + "." + e[c])
        })
    }, a
}();
/**/
angular.module("moonraker").controller("newRoleDialog", NewRoleDialog);
/**/
var ConnectionSelectionDialog = function() {
    function a(a, b, c, d) {
        var e = this;
        this.naturalSort = d, this.showSection = {}, this.modalInstance = b, this.options = c;
        var f = function(a) {
                g.showSection[a] = !0, void 0 === g.options.connectables[a].sortField && (g.options.connectables[a].sortField = "label"), g.options.connectables[a].value.sort(function(b, c) {
                    return e.naturalSort.naturalSort(!b.isDefault + "." + b[e.options.connectables[a].sortField], !c.isDefault + "." + c[e.options.connectables[a].sortField])
                })
            },
            g = this;
        for (var h in this.options.connectables) f(h);
        this.options.numberOfColumns ? this.numberOfColumns = this.options.numberOfColumns : this.numberOfColumns = 6
    }
    return a.$inject = ["$scope", "$uibModalInstance", "options", "naturalSort"], Object.defineProperty(a.prototype, "connectionTypeCount", {
        get: function() {
            return Object.keys(this.options.connectables).length
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.onClick = function(a) {
        this.isSelected(a) ? this.deselect(a) : this.select(a), this.options.allowMultipleSelections || this.finish()
    }, a.prototype.canFinish = function() {
        return void 0 === this.options.requireMultipleSelections || !(this.options.requireMultipleSelections && this.options.assigned.length <= 1)
    }, a.prototype.finish = function() {
        var a = this.options.assigned.indexOf("-1");
        a != -1 && this.options.assigned.splice(a, 1);
        var b = {
            selected: this.options.assigned
        };
        this.modalInstance.close(b)
    }, a.prototype.cancel = function() {
        this.modalInstance.dismiss()
    }, a.prototype.orderById = function(a) {
        return parseInt(a.id, 10)
    }, Object.defineProperty(a.prototype, "styleWidth", {
        get: function() {
            var a = ".modal-dialog { width: " + 120 * this.numberOfColumns + "px; }";
            return a
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.isSelected = function(a) {
        for (var b = 0; b < this.options.assigned.length; b++)
            if (a == this.options.assigned[b]) return !0;
        return !1
    }, a.prototype.select = function(a) {
        this.options.allowMultipleSelections ? this.isSelected(a) || this.options.assigned.push(a) : (this.options.assigned = [], this.options.assigned.push(a))
    }, a.prototype.deselect = function(a) {
        var b = this.options.assigned.indexOf(a);
        b != -1 && this.options.assigned.splice(b, 1)
    }, a
}();
/**/
angular.module("moonraker").controller("connectionSelectionDialog", ConnectionSelectionDialog);
/**/
var EndpointStatus;
/**/
! function(a) {
    a[a.Forced = 0] = "Forced", a[a.Assigned = 1] = "Assigned", a[a.NoRole = 2] = "NoRole", a[a.Offline = 3] = "Offline"
}(EndpointStatus || (EndpointStatus = {}));
/**/
var EndpointSelectionDialog = function() {
    function a(a, b, c) {
        this.showSection = {}, this.endpointStatus = EndpointStatus, this.modalInstance = b, this.options = c;
        for (var d in this.options.connectables) this.showSection[d] = !0;
        this.options.numberOfColumns ? this.numberOfColumns = this.options.numberOfColumns : this.numberOfColumns = 6
    }
    return a.$inject = ["$scope", "$uibModalInstance", "options"], Object.defineProperty(a.prototype, "connectionTypeCount", {
        get: function() {
            return Object.keys(this.options.connectables).length
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.onClick = function(a) {
        this.isSelected(a) ? this.deselect(a) : this.select(a), this.options.allowMultipleSelections || this.finish()
    }, a.prototype.canFinish = function() {
        return void 0 === this.options.requireMultipleSelections || !(this.options.requireMultipleSelections && this.options.assigned.length <= 1)
    }, a.prototype.finish = function() {
        var a = this.options.assigned.indexOf("-1");
        a != -1 && this.options.assigned.splice(a, 1);
        var b = {
            selected: this.options.assigned
        };
        this.modalInstance.close(b)
    }, a.prototype.cancel = function() {
        this.modalInstance.dismiss()
    }, a.prototype.orderById = function(a) {
        return parseInt(a.id, 10)
    }, Object.defineProperty(a.prototype, "styleWidth", {
        get: function() {
            var a = ".modal-dialog { width: " + 120 * this.numberOfColumns + "px; }";
            return a
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.isSelected = function(a) {
        for (var b = 0; b < this.options.assigned.length; b++)
            if (a == this.options.assigned[b]) return !0;
        return !1
    }, a.prototype.select = function(a) {
        this.options.allowMultipleSelections ? this.isSelected(a) || this.options.assigned.push(a) : (this.options.assigned = [], this.options.assigned.push(a))
    }, a.prototype.deselect = function(a) {
        var b = this.options.assigned.indexOf(a);
        b != -1 && this.options.assigned.splice(b, 1)
    }, a
}();
/**/
angular.module("moonraker").controller("endpointSelectionDialog", EndpointSelectionDialog);
/**/
var app = angular.module("moonraker");
/**/
app.controller("FSIIBeltpackCfgCtrl", FSIIBeltpackCfgCtrl);
/**/
var app = angular.module("moonraker");
/**/
app.controller("FSIIAntennaCableLengthsCtrl", FSIIAntennaCableLengthsCtrl);
/**/
var app = angular.module("moonraker");
/**/
app.controller("FSIIAntennaCfgCtrl", FSIIAntennaCfgCtrl);
/**/
var app = angular.module("moonraker");
/**/
app.controller("HNEndpointCfgCtrl", HNEndpointCfgCtrl);
/**/
var AccountsCtrl = function() {
    function a(a, b, c, d, e, f, g) {
        var h = this;
        this.externalDevices = c, this.linkGroupCapabilities = d, this.pageGuideService = f, b.helpUrl = "help/Content/Project/Context%20sensitive/external.htm", f.defaultGuide = "external", e.subscribe(a, function() {
            e.externalDevices.then(function(a) {
                h.externalDevices = a
            })
        }), g.subscribe(a, function() {
            g.linkGroupCapabilities.then(function(a) {
                h.linkGroupCapabilities = a
            })
        }), a.$on("$destroy", function() {
            f.cleanupGuide()
        })
    }
    return a.$inject = ["$scope", "$rootScope", "externalDevices", "linkGroupCapabilities", "externalDevicesService", "pageGuideService", "linkGroupCapabilitiesService"], a.prototype.openGuide = function() {
        this.pageGuideService.openGuide("accMenu")
    }, a.prototype.showSip = function() {
        var a = !1;
        return this.linkGroupCapabilities && this.linkGroupCapabilities.externalSystems && angular.forEach(this.linkGroupCapabilities.externalSystems, function(b) {
            "SIP" === b.type && (a = !0)
        }), a
    }, a.prototype.showAIC = function() {
        return this.linkGroupCapabilities && this.linkGroupCapabilities.users && this.linkGroupCapabilities.users.length > 0
    }, a.prototype.showIvc32 = function() {
        var a = !1;
        return this.linkGroupCapabilities && this.linkGroupCapabilities.externalSystems && angular.forEach(this.linkGroupCapabilities.externalSystems, function(b) {
            "IVC" === b.type && (a = !0)
        }), a
    }, a
}();
/**/
angular.module("moonraker").controller("accountsCtrl", AccountsCtrl);
/**/
var AccountsBaseController = function() {
        function a(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
            var o = this;
            this.externalDeviceType = a, this.devicesService = d, this.devices = e, this.externalDevicesService = f, this.showModalAlert = g, this.gettext = h, this.showModalConfirm = i, this.DeviceIp = j, this.capabilitiesService = k, this.pageGuideService = m, this.$window = n, this.pendingPort = null, this.selectedExternalDevice = null, this.externalDevices = [], this.isMasterReachable = !0, this.pendingPortForm = null, this.assignableDevices = [{
                value: 0,
                text: h("None"),
                ivc: !1,
                sip: !1
            }], this.emptyString = h("Not Set"), k.getDeviceCapabilites(0).then(function(a) {
                return o.deviceCapability = a
            }), this.onReceivedExternalDevices(l), f.subscribe(b, function() {
                return o.getExternalDevices()
            }), this.onReceivedDevices(e), null != c.$routeParams.externalDeviceId && this.externalDevices.some(function(a) {
                return a.id === parseInt(c.$routeParams.externalDeviceId) && (o.selectExternalDevice(a), !0)
            }), d.subscribe(b, function() {
                return o.getDevices()
            }), b.$on("$destroy", function() {
                m.cleanupGuide()
            })
        }
        return a.prototype.isDeviceReachable = function(a) {
            var b = this.devices.find(function(b) {
                return b.device_id === a
            });
            return !!b && b.device_isReachable
        }, a.prototype.getDevices = function() {
            var a = this;
            this.devicesService.devices.then(function(b) {
                return a.onReceivedDevices(b)
            })
        }, a.prototype.onReceivedDevices = function(a) {
            var b = this;
            CCUtils.arrayUpdate("device_id", this.devices, a);
            var c = a.find(function(a) {
                return a.isHost
            });
            c && (this.isMasterReachable = "IsMaster" === c.device_masterStatus || "READY" === c.device_masterStatus), this.assignableDevices = [{
                value: 0,
                text: this.gettext("None"),
                ivc: !0,
                sip: !0
            }], angular.forEach(a, function(a) {
                b.capabilitiesService.getDeviceCapabilites(a.device_id).then(function(c) {
                    var d = angular.isDefined(c.externalDevices) && angular.isDefined(c.externalDevices.find(function(a) {
                            return "IVC" === a.type
                        })),
                        e = a.licensedFeatures.some(function(a) {
                            return a.name.indexOf("SIP") !== -1 && a.qty > 0
                        });
                    b.assignableDevices.push({
                        value: a.device_id,
                        text: a.device_label,
                        ivc: d,
                        sip: e
                    })
                })
            }, this)
        }, a.prototype.onReceivedExternalDevices = function(a) {
            var b = this;
            CCUtils.arrayUpdate("id", this.externalDevices, a.filter(function(a) {
                return a.type == b.externalDeviceType
            })), null == this.selectedExternalDevice ? this.selectExternalDevice(this.externalDevices[0]) : (this.selectedExternalDevice = this.externalDevices.find(function(a) {
                return b.selectedExternalDevice.id == a.id
            }), null == this.selectedExternalDevice && this.selectExternalDevice(this.externalDevices[0]))
        }, a.prototype.getExternalDevices = function() {
            var a = this;
            this.externalDevicesService.externalDevices.then(function(b) {
                return a.onReceivedExternalDevices(b)
            })
        }, a.prototype.getLinkMasterOffLineWarning = function() {
            return this.isMasterReachable ? "" : this.gettext("Connection to Link-Master lost: Use of this feature is disabled")
        }, a.prototype.selectExternalDevice = function(a) {
            this.selectedExternalDevice = a, this.pendingPort = null, null != this.pendingPortForm && (this.pendingPortForm.$cancel(), this.pendingPortForm = null)
        }, a.prototype.addExternalDeviceDevice = function(a) {
            var b = this;
            this.externalDevicesService.addExternalDevice({
                type: a
            }).then(function(a) {
                var c = b.externalDevices.find(function(b) {
                    return b.id == a.newDevice.id
                });
                c || (b.externalDevices.push(a.newDevice), b.selectExternalDevice(a.newDevice))
            })["catch"](function(c) {
                b.showModalAlert("Failed to add the " + a + " device.")
            })
        }, a.prototype.confirmRemoveExternalDevice = function() {
            var a = this,
                b = this.selectedExternalDevice,
                c = this.gettext("Are you sure you want to delete the current device?");
            "SIP" == b.type && (c = this.gettext("Are you sure you want to delete the current account?"));
            var d = "";
            this.showModalConfirm("sm", c, d, this.gettext("Delete"), this.gettext("Cancel"), function(c) {
                c && a.removeExternalDevice(b)
            })
        }, a.prototype.removeExternalDevice = function(a) {
            var b = this.externalDevices.indexOf(a),
                c = b === this.externalDevices.length - 1 ? this.externalDevices[this.externalDevices.length - 2] : this.externalDevices[b + 1];
            this.externalDevicesService.deleteExternalDevice(this.selectedExternalDevice.id), this.selectExternalDevice(c)
        }, a.prototype.confirmRemovePort = function(a) {
            var b = this,
                c = this.selectedExternalDevice,
                d = this.gettext("Are you sure you want to delete this port?");
            "SIP" == a.type && (d = this.gettext("Are you sure you want to delete this user?"));
            var e = "";
            this.showModalConfirm("sm", d, e, this.gettext("Delete"), this.gettext("Cancel"), function(d) {
                d && b.removeExternalPort(c, a)
            })
        }, a.prototype.removeExternalPort = function(a, b) {
            this.externalDevicesService.deleteExternalPort(a.id, b.id)
        }, a.prototype.saveLabel = function(a) {
            var b = this,
                c = this.selectedExternalDevice.id;
            return this.externalDevicesService.updateExternalDevice(c, {
                label: a
            }).then(function(a) {
                return !0
            })["catch"](function(a) {
                return b.gettext("Failed to update the label.")
            })
        }, a.prototype.saveIp = function(a) {
            var b = this;
            if (a) {
                if (this.DeviceIp.matchIp(a)) {
                    if (this.DeviceIp.isIpReserved(a)) return this.gettext("IP addresses in the range 172.23.x.x are reserved for internal use.");
                    if (!this.DeviceIp.isIpValidForInterface(a)) return this.gettext("Invalid IP address for the IVC-32 device.")
                } else if (!this.DeviceIp.isValidHostName(a)) return this.gettext("Invalid hostname format.");
                var c = this.selectedExternalDevice.settings.port,
                    d = this.getMatchingExternalDeviceMsg(a, c);
                if (d) return d
            }
            var e = this.selectedExternalDevice.id;
            return this.externalDevicesService.updateExternalDevice(e, {
                settings: {
                    ip: a
                }
            }).then(function(a) {
                return !0
            })["catch"](function(a) {
                return b.gettext("Failed to update the IP.")
            })
        }, a.prototype.getMatchingExternalDeviceMsg = function(a, b) {
            var c = this,
                d = this.externalDevices.find(function(d) {
                    return d.id !== c.selectedExternalDevice.id && d.settings.ip === a && d.settings.port === b
                });
            return d ? this.gettext("The external device '" + d.label + "' has the same IP / hostname and port as another external device.") : ""
        }, a.prototype.savePort = function(a) {
            var b = this,
                c = this.selectedExternalDevice.settings.ip;
            if (c) {
                var d = this.getMatchingExternalDeviceMsg(c, a);
                if (d) return d
            }
            var e = this.selectedExternalDevice.id;
            return this.externalDevicesService.updateExternalDevice(e, {
                settings: {
                    port: a
                }
            }).then(function(a) {
                return !0
            })["catch"](function(a) {
                return b.gettext("Failed to update the port.")
            })
        }, a.prototype.onEditableElementClick = function(a, b) {
            var c = b.target.attributes.getNamedItem("e-name"),
                d = null != c ? c.value : "";
            a.rowform.$show();
            var e = a.rowform.$editables.find(function(a) {
                return a.name == d
            });
            e && this.$window.setTimeout(function() {
                e.inputEl[0].focus()
            }, 0)
        }, a.prototype.onPortKeyDown = function(a, b) {
            13 == a ? b.$submit() : 27 == a && b.$cancel()
        }, a.prototype.onPendingPortKeyDown = function(a, b) {
            13 == a ? b.$submit() : 27 == a && (b.$cancel(), this.pendingPort = null)
        }, a.prototype.onPortAdded = function() {
            this.pendingPort = null
        }, a.prototype.onPendingPortShown = function(a) {
            this.pendingPortForm = a.pendingPortForm
        }, a.prototype.onPendingPortHidden = function(a) {
            this.pendingPortForm = null, this.clearError(a)
        }, a.prototype.cancelAdd = function(a) {
            a.pendingPortForm.$cancel(), this.pendingPortForm = null, this.pendingPort = null
        }, a.prototype.validatePortLabel = function(a) {
            return "" != a || this.gettext("The label cannot be empty.")
        }, a.prototype.validatePortLogin = function(a, b) {
            if ("" == a) return this.gettext("The username cannot be empty.");
            var c = this.selectedExternalDevice.ports,
                d = Object.keys(c).filter(function(d) {
                    return c[d].id != b && c[d].settings.login == a
                })[0];
            return !d || this.gettext("Another port has the same username.")
        }, a.prototype.showAssignedDevice = function(a) {
            var b = this.assignableDevices.reduce(function(b, c) {
                return b || c.value != a ? b : c
            }, null);
            return b ? b.text : this.assignableDevices[0].text
        }, a.prototype.clearError = function(a) {
            a.$error && (a.$error = "")
        }, a.prototype.cancelPortEdit = function(a) {
            a.rowform.$cancel()
        }, a
    }(),
    __extends = this && this.__extends || function() {
        var a = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(a, b) {
            a.__proto__ = b
        } || function(a, b) {
            for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
        };
        return function(b, c) {
            function d() {
                this.constructor = b
            }
            a(b, c), b.prototype = null === c ? Object.create(c) : (d.prototype = c.prototype, new d)
        }
    }(),
    Ivc32Ctrl = function(a) {
        function b(b, c, d, e, f, g, h, i, j, k, l, m, n) {
            var o = a.call(this, "IVC", b, c, f, d, g, j, k, i, h, m, e, n, l) || this;
            return o.editingIp = !1, o
        }
        return __extends(b, a), b.$inject = ["$scope", "$routeSegment", "devices", "externalDevices", "devicesService", "externalDevicesService", "DeviceIp", "showModalConfirm", "showModalAlert", "gettext", "$window", "capabilitiesService", "pageGuideService"], b.prototype.openGuide = function() {
            this.pageGuideService.openGuide("externalIVC")
        }, b.prototype.hasWarning = function(a) {
            for (var b in a.ports) {
                var c = a.ports[b];
                if (c.liveStatus && "connected" !== c.liveStatus.externalConnectionStatus && 0 != c.settings.assignedDeviceId) return !0
            }
            return !1
        }, b.prototype.addPort = function(a, b) {
            var c = this;
            if (this.clearError(a), null != this.pendingPort) return this.externalDevicesService.addExternalPort(this.selectedExternalDevice.id, {
                label: b.label,
                settings: {
                    login: b.login,
                    password: b.password,
                    assignedDeviceId: 0 | b.assignedDeviceId
                }
            }).then(function(a) {
                return !0
            })["catch"](function(b) {
                return 403 === b.status ? a.$error = c.gettext("Can't assign more ports to this device.") : a.$error = c.gettext("Failed to add the port."), a.$error
            })
        }, b.prototype.addPendingPort = function(a) {
            this.pendingPort = {
                label: "",
                settings: {
                    login: "",
                    password: "",
                    assignedDeviceId: 0
                }
            }, a.pendingPortForm.$show()
        }, b.prototype.updatePort = function(a, b, c) {
            var d = this,
                e = this.selectedExternalDevice.id;
            return this.clearError(a), 0 !== c.assignedDeviceId && this.devices.find(function(a) {
                return a.device_id === c.assignedDeviceId
            }).device_usage > 85 ? (a.$error = this.gettext("Device resource usage limits exceeded (LQ Assignment refused)"), a.$error) : this.externalDevicesService.updateExternalPort(e, b, {
                label: c.label,
                settings: {
                    login: c.login,
                    password: c.password,
                    assignedDeviceId: c.assignedDeviceId
                }
            }).then(function(a) {
                return !0
            })["catch"](function(b) {
                return 403 === b.status ? a.$error = d.gettext("Can't assign more ports to this device.") : a.$error = d.gettext("Failed to update the port."), a.$error
            })
        }, b.prototype.getConnectionWarning = function(a) {
            if (!this.isDeviceReachable(a.settings.assignedDeviceId)) return this.gettext("Device Offline");
            if (a.liveStatus && a.liveStatus.externalConnectionStatus) {
                var b = a.liveStatus.externalConnectionStatus;
                if ("connected" !== b) return this.externalDevicesService.externalConnectionStatusToMessage(b)
            }
            return ""
        }, b
    }(AccountsBaseController);
/**/
angular.module("moonraker").controller("ivc32Ctrl", Ivc32Ctrl);
/**/
var __extends = this && this.__extends || function() {
        var a = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(a, b) {
            a.__proto__ = b
        } || function(a, b) {
            for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
        };
        return function(b, c) {
            function d() {
                this.constructor = b
            }
            a(b, c), b.prototype = null === c ? Object.create(c) : (d.prototype = c.prototype, new d)
        }
    }(),
    SipCtrl = function(a) {
        function b(b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
            var p = a.call(this, "SIP", b, c, f, d, g, k, l, j, i, n, e, o, m) || this;
            return p.licenseService = h, p.availableSipTransportProtocolOptions = [{
                value: "udp",
                label: p.gettext("UDP")
            }], p
        }
        return __extends(b, a), b.$inject = ["$scope", "$routeSegment", "devices", "externalDevices", "devicesService", "externalDevicesService", "licenseService", "DeviceIp", "showModalConfirm", "showModalAlert", "gettext", "$window", "capabilitiesService", "pageGuideService"], b.prototype.getSipProtocolLabel = function(a) {
            for (var b = 0; b < this.availableSipTransportProtocolOptions.length; b++)
                if (this.availableSipTransportProtocolOptions[b].value === a) return this.availableSipTransportProtocolOptions[b].label;
            return ""
        }, b.prototype.openGuide = function() {
            this.pageGuideService.openGuide("externalSIP")
        }, b.prototype.hasWarning = function(a) {
            for (var b in a.ports) {
                var c = a.ports[b];
                if (c.liveStatus && 200 !== c.liveStatus.sipRegistrationStatusCode && 0 !== c.settings.assignedDeviceId) return !0
            }
            return !1
        }, b.prototype.addPendingLine = function(a) {
            this.pendingPort = {
                label: "",
                settings: {
                    login: "",
                    password: "",
                    assignedDeviceId: 0
                }
            }, a.pendingPortForm.$show()
        }, b.prototype.updateLine = function(a, b, c) {
            var d = this,
                e = this.selectedExternalDevice.id;
            return this.clearError(a), 0 !== c.assignedDeviceId && this.devices.find(function(a) {
                return a.device_id === c.assignedDeviceId
            }).device_usage > 85 ? (a.$error = this.gettext("Device resource usage limits exceeded (LQ Assignment refused)"), a.$error) : this.externalDevicesService.updateExternalPort(e, b, {
                label: c.label,
                settings: {
                    login: c.login,
                    password: c.password,
                    assignedDeviceId: c.assignedDeviceId
                }
            }).then(function(a) {
                return !0
            })["catch"](function(b) {
                return 403 === b.status ? a.$error = d.gettext("Can't assign more lines to this device.") : a.$error = d.gettext("Failed to update the line."), a.$error
            })
        }, b.prototype.saveSipTransportProtocol = function(a) {
            var b = this,
                c = this.selectedExternalDevice.id;
            return this.externalDevicesService.updateExternalDevice(c, {
                settings: {
                    protocol: a
                }
            }).then(function(a) {
                return !0
            })["catch"](function(a) {
                return b.gettext("Failed to update the SIP Transport Protocol.")
            })
        }, b.prototype.saveDomain = function(a) {
            var b = this,
                c = this.selectedExternalDevice.id;
            return this.externalDevicesService.updateExternalDevice(c, {
                settings: {
                    domain: a
                }
            }).then(function(a) {
                return !0
            })["catch"](function(a) {
                return b.gettext("Failed to update the Domain.")
            })
        }, b.prototype.addLine = function(a, b) {
            var c = this;
            if (this.clearError(a), null != this.pendingPort) return this.externalDevicesService.addExternalPort(this.selectedExternalDevice.id, {
                label: b.label,
                settings: {
                    login: b.login,
                    password: b.password,
                    assignedDeviceId: b.assignedDeviceId
                }
            }).then(function(a) {
                return !0
            })["catch"](function(b) {
                return 403 === b.status ? a.$error = c.gettext("Can't assign more lines to this device.") : a.$error = c.gettext("Failed to add the line."), a.$error
            })
        }, b.prototype.getConnectionWarning = function(a) {
            return this.isDeviceReachable(a.settings.assignedDeviceId) ? a.liveStatus && void 0 !== a.liveStatus.sipRegistrationStatusCode ? this.externalDevicesService.sipRegistrationStatusToMessage(a.liveStatus.sipRegistrationStatusCode) : "" : this.gettext("Device Offline")
        }, b.prototype.isUnlicensed = function() {
            var a = this;
            return !this.devices.some(function(b) {
                return a.licenseService.getNumberOfLicensedUsers(b, a.licenseService.SIP_LICENSE_REGEXP) > 0
            })
        }, b.prototype.showIPWarning = function() {
            return "" == this.selectedExternalDevice.settings.ip && 1 == Object.getOwnPropertyNames(this.selectedExternalDevice.ports).length
        }, b
    }(AccountsBaseController);
/**/
angular.module("moonraker").controller("sipCtrl", SipCtrl);
/**/
var ConnCtrl = function() {
    function a(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B) {
        var C = this;
        this.$rootScope = b, this.$uibModal = c, this.$document = d, this.$filter = e, this.gettext = f, this.naturalSort = g, this.connectionsService = h, this.connectionsLiveStatusService = i, this.portsService = j, this.callsService = k, this.devicesService = l, this.endpointsService = m, this.rolesService = n, this.pageGuideService = o, this.showModalConfirm = p, this.showModalAlert = q, this.linkGroupCapabilitiesService = r, this.deviceCapabilities = s, this.endpoints = t, this.connectionsStatus = u, this.roles = A, this.hidePortsForDevice = {}, this.hidePortsForType = {}, this.connectionTabs = [], this.activeConnectionId = null, this.activeConnectionType = null, this.showAll = !1, this.hideEmptyConnections = !0, this.linkMasterOffLineWarning = "", this.portTypes = [], this.connections = [], this.isMasterReachable = !1, this.isAddConnectionDisabled = !1, this.showConnectionBridgeOptionsIcon = !0, this.connectionsWithLive = {}, this.deviceConnectionStatus = [], this.typesConnectionStatus = [], this.devices = [], this.ports = [], this.sipCalls = [], this.showConnection = function(a) {
            if (!a) return !1;
            if (!C.isOfCurrentTabType(a.type)) return !1;
            if (C.showAll) {
                if (C.hideEmptyConnections) {
                    var b = C.connectionsWithLive[a.id].participants;
                    return Object.keys(b).length > 0
                }
            } else if (a.id !== C.activeConnectionId) return !1;
            return !0
        }, this.portOrder = function(a) {
            return "IVC" === a.audioInterfaceType_shortName ? C.naturalSort.naturalValue(a.port_desc) : "SIP" === a.audioInterfaceType_shortName ? C.naturalSort.naturalValue("Z" + a.port_desc) : a.port_id.toString()
        }, this.root = this.$rootScope, this.UserData = v.UserData;
        var D = {
            partyline: {
                label: f("Channels"),
                hideEmptyText: f("Hide Empty Channels"),
                showAllText: f("Show All Channels"),
                showSingleText: f("Show Single Channel")
            },
            direct: {
                label: f("Directs"),
                hideEmptyText: f("Hide Empty Directs"),
                showAllText: f("Show All Directs"),
                showSingleText: f("Show Single Direct")
            },
            group: {
                label: f("Groups"),
                hideEmptyText: f("Hide Empty Groups"),
                showAllText: f("Show All Groups"),
                showSingleText: f("Show Single Group")
            }
        };
        this.linkMasterOffLineWarning = f("Connection to Link-Master lost: Use of this feature is disabled"), this.processLinkGroupCapabilities(B);
        var E, F = function(a) {
                var b = D[a];
                E = G.linkGroupCapabilities.connections.filter(function(b) {
                    return b.type === a
                }).length, E > 0 && ("direct" === a && G.linkGroupCapabilities && G.hideDirectsTab() || G.connectionTabs.push({
                    type: a,
                    label: b.label,
                    hideEmptyText: b.hideEmptyText,
                    showAllText: b.showAllText,
                    showSingleText: b.showSingleText
                }))
            },
            G = this;
        for (var H in D) F(H);
        this.connectionTabs.length >= 2 && this.connectionTabs.splice(0, 0, {
            type: void 0,
            label: "All",
            hideEmptyText: f("Hide Empty Connections"),
            showAllText: f("Show All Connections"),
            showSingleText: f("Show Single Connection")
        }), this.deviceType = x.find(function(a) {
            return a.isHost
        }).deviceType_name, 0 === this.deviceType.indexOf("HMS") && (this.showAll = !0), "FSII" === this.deviceType && (this.UserData.groupByDeviceAssignments = !1), this.devices = this.processDevices(x), this.ports = this.processPorts(y), this.portTypes = [], this.ports.map(function(a) {
            C.portTypes[C.portTypes.length] = {
                label: a.port_config_type
            }
        }), this.sipCalls = this.processCalls(z), this.processDevices(x), this.processConnections(w), this.linkGroupCapabilitiesService.subscribe(a, function() {
            C.linkGroupCapabilitiesService.linkGroupCapabilities.then(function(a) {
                C.processLinkGroupCapabilities(a)
            })
        }), this.connectionsService.subscribe(a, function() {
            C.connectionsService.connections.then(function(a) {
                C.processConnections(a), C.checkConnectionVisibility()
            })
        }), this.portsService.subscribe(a, function() {
            C.portsService.ports.then(function(a) {
                C.ports = C.processPorts(a), C.portTypes = [], C.ports.map(function(a) {
                    C.portTypes[C.portTypes.length] = {
                        label: a.port_config_type
                    }
                }), C.refreshPortsOnConnectionsParticipants(), C.checkConnectionVisibility()
            })
        }), this.callsService.subscribe(a, function() {
            C.callsService.calls.then(function(a) {
                C.sipCalls = C.processCalls(a), C.refreshPortsOnConnectionsParticipants(), C.refreshPortsConnectionStatus()
            })
        }), this.devicesService.subscribe(a, function() {
            C.devicesService.devices.then(function(a) {
                C.devices = C.processDevices(a), C.refreshPortsOnConnectionsParticipants()
            })
        }), this.connectionsLiveStatusService.subscribe(a, function() {
            C.connectionsLiveStatusService.connectionsLiveStatusMap.then(function(a) {
                C.connectionsStatus = a, C.refreshLiveStatusOnConnectionsParticipants(), C.checkConnectionVisibility()
            })
        }), this.endpointsService.subscribe(a, function() {
            C.endpointsService.endpoints.then(function(a) {
                C.endpoints = a, C.refreshLiveStatusOnConnectionsParticipants()
            })
        }), this.rolesService.subscribe(a, function() {
            C.rolesService.roles.then(function(a) {
                C.roles = a
            })
        }), o.defaultGuide = "assignment", a.$on("$destroy", function() {
            o.cleanupGuide()
        })
    }
    return a.$inject = ["$scope", "$rootScope", "$uibModal", "$document", "$filter", "gettext", "naturalSort", "connectionsService", "connectionsLiveStatusService", "portsService", "callsService", "devicesService", "endpointsService", "rolesService", "pageGuideService", "showModalConfirm", "showModalAlert", "linkGroupCapabilitiesService", "deviceCapabilities", "endpoints", "connectionsStatus", "userService", "connections", "devices", "ports", "calls", "roles", "linkGroupCapabilities"], a.prototype.hideDirectsTab = function() {
        var a = !0;
        return this.linkGroupCapabilities && this.linkGroupCapabilities.connections && angular.forEach(this.linkGroupCapabilities.connections, function(b) {
            "direct" === b.type && (a = !1)
        }), a
    }, a.prototype.openGuide = function(a) {
        this.pageGuideService.openGuide(a)
    }, a.prototype.setActiveTab = function(a) {
        this.currentTab = this.connectionTabs[a], this.currentTabIndex = a, null !== this.activeConnectionId && this.isOfCurrentTabType(this.activeConnectionType) || this.selectFirstConnection()
    }, a.prototype.getPortUnavailableMessage = function(a) {
        if (!this.activeConnectionType) return this.gettext("You must first create a Channel or a Direct before you can assign ports.");
        var b = {};
        this.connectionsWithLive[this.activeConnectionId] && (b = this.connectionsWithLive[this.activeConnectionId].participants);
        var c = Object.keys(b),
            d = "";
        return 2 === c.length ? d = this.gettext("Direct connections are limited to 2 ports.") : a.multiChannel ? d = this.gettext("You cannot add ports into a direct channel if multichannel is enabled on the port.") : "SIP" === a.type ? d = this.gettext("A direct connection SIP-IVC or SIP-4W requires ports on the same device.") : "IVC" === a.type ? d = this.gettext("A direct connection SIP-IVC requires ports on the same device.") : "4W" === a.type && (d = this.gettext("A direct connection SIP-4W requires ports on the same device.")), "group" == this.activeConnectionType && "PGM" === a.type && (d = this.gettext("The Program audio can not be added to a group.")), d
    }, a.prototype.setActiveConnection = function(a, b) {
        if (void 0 === b && (b = !1), a) {
            if (a.id === this.activeConnectionId) return;
            this.isOfCurrentTabType(a.type) || this.setActiveTab(this.connectionTabs.findIndex(function(b) {
                return b.type === a.type
            })), this.activeConnectionType = a.type, this.activeConnectionId = a.id, b && (this.showAll = !1)
        } else this.activeConnectionId = null, this.activeConnectionType = null;
        this.refreshPortsConnectionStatus()
    }, a.prototype.selectFirstConnectionKey = function(a) {
        var b = Object.keys(a);
        this.setActiveConnection(this.connections.find(function(a) {
            return a.id === Number(b[0])
        }), !0)
    }, a.prototype.getConnectionsFromKeys = function(a) {
        var b = this;
        if (!a) return [];
        var c = Object.keys(a).map(function(a) {
            return b.connections.find(function(b) {
                return b.id === Number(a)
            })
        });
        return this.$filter("orderBy")(c, function(a) {
            return b.naturalSort.naturalValue(a.label)
        })
    }, a.prototype.checkConnectionVisibility = function() {
        var a = this;
        null !== this.activeConnectionId && this.showConnection(this.connections.find(function(b) {
            return b.id === a.activeConnectionId
        })) || this.selectFirstConnection()
    }, a.prototype.showResourceMeter = function() {
        return this.linkGroupCapabilitiesService.supportsResourceUsage(this.linkGroupCapabilities)
    }, a.prototype.toggleShowAll = function() {
        this.showAll = !this.showAll, this.checkConnectionVisibility()
    }, a.prototype.saveConnectionLabel = function(a, b) {
        var c = this;
        return this.connectionsService.updateConnection(Number(a.id), {
            label: b
        }).then(function() {
            return c.connections.find(function(b) {
                return b.id === a.id
            }).label = b, c.processConnections(c.connections), !0
        })["catch"](function(a) {
            return a.data && a.data.message ? a.data.message : c.gettext("No response from the server.")
        })
    }, a.prototype.addConnection = function(a) {
        var b = this;
        if (a) {
            var c, d = this.connections.filter(function(b) {
                return b.type === a
            }).length;
            if (angular.forEach(this.linkGroupCapabilities.connections, function(b) {
                    b.type === a && (c = b)
                }), c && c.dynamic) {
                if (d >= c.max) return void("partyline" === a ? this.showModalAlert(this.gettext("The maximum number of Channels has been reached.")) : "direct" === a ? this.showModalAlert(this.gettext("The maximum number of 4W Direct Channels has been reached.")) : this.showModalAlert(this.gettext("The maximum number of Channels for type '" + a + "' has been reached.")));
                this.isAddConnectionDisabled = !0, this.connectionsService.addConnection(a).then(function(a) {
                    var c = a.newConnection;
                    if (c) {
                        var d = {
                            type: c.type,
                            id: c.id,
                            label: c.label,
                            res: ""
                        };
                        b.connections.push(d), b.processConnections(b.connections), b.setActiveConnection(b.connections.find(function(a) {
                            return a.id === c.id
                        })), b.showAll = !1, b.isAddConnectionDisabled = !1
                    }
                })["catch"](function(a) {
                    b.isAddConnectionDisabled = !1
                })
            }
        }
    }, a.prototype.deleteConnection = function(a) {
        var b = this;
        if (this.isMasterReachable) {
            if (this.ports.filter(function(b) {
                    return void 0 !== b.port_connections[a.id]
                }).length) return void this.showModalAlert(this.gettext("Ports must be removed before deleting this channel."));
            var c;
            c = "partyline" === a.type ? this.gettext("Are you sure you want to remove this Channel ?") : this.gettext("Are you sure you want to remove this 4W Direct Channel ?"), this.showModalConfirm("sm", c, "", this.gettext("Delete"), this.gettext("Cancel"), function(c) {
                c && b.connectionsService.deleteConnection(Number(a.id)).then(function(c) {
                    var d = b.connections.filter(function(a) {
                            return b.isOfCurrentTabType(a.type)
                        }),
                        e = d.findIndex(function(b) {
                            return b.id === a.id
                        });
                    e !== -1 && d.length <= 1 ? b.setActiveConnection(void 0) : e === d.length - 1 ? b.setActiveConnection(d[e - 1]) : e === -1 ? b.setActiveConnection(d[0]) : b.setActiveConnection(d[e + 1]);
                    var f = b.connections.findIndex(function(b) {
                        return b.id === a.id
                    });
                    b.connections.splice(f, 1)
                })
            })
        }
    }, a.prototype.associatePortToConnection = function(a, b) {
        var c = this,
            d = this.connections.find(function(a) {
                return a.id === b
            }),
            e = this.ports.find(function(b) {
                return b.res === a
            });
        if (d && e) {
            if (this.devices.find(function(a) {
                    return a.device_id == e.device_id
                }).device_usage > 85) return void this.showModalAlert(this.gettext("Device resource usage limits exceeded. (Channel assignment refused)"));
            if ("direct" === d.type) {
                var f = this.getAssignedPorts(d.id);
                if (f.length >= 2) return void this.showModalAlert(this.gettext("Direct Connections are required to have only two port associations"))
            }
            this.portsService.associateWithConnection(e.port_id, b, !0).then(function() {
                if ("partyline" === d.type) {
                    var a = c.getAssignedPorts(d.id);
                    a.length && (e.port_settings.networkQuality = angular.copy(a[0].port_settings.networkQuality), e.port_settings.silenceSupp = a[0].port_settings.silenceSupp)
                }
                e.port_connections[b] = {
                    connectionState: 0
                }, c.refreshPortsOnConnectionsParticipants()
            })
        }
    }, a.prototype.disassociatePortFromConnection = function(a, b) {
        var c = this,
            d = this.ports.find(function(b) {
                return b.res === a
            });
        this.portsService.associateWithConnection(d.port_id, b, !1).then(function() {
            delete d.port_connections[b], c.refreshPortsOnConnectionsParticipants()
        })
    }, a.prototype.showBridgeOptions = function(a) {
        var b = this,
            c = this.ports.find(function(b) {
                return b.res === a
            });
        this.pageGuideService.cleanupGuide();
        var d = this.$uibModal.open({
            templateUrl: "views/dialogs/bridgeOptions.html",
            controller: "bridgeOptionsCtrl",
            controllerAs: "ctrl",
            bindToController: !0,
            size: "md",
            backdrop: "true",
            appendTo: this.$document.find(".conn-container-collection").eq(0),
            resolve: {
                options: function() {
                    return {
                        title: b.gettext("Local Audio Mix"),
                        message: "",
                        bridgePort: c
                    }
                }
            }
        });
        d.result.then(function(a) {})
    }, a.prototype.getConnectionCapabilities = function(a) {
        for (var b = 0, c = this.linkGroupCapabilities.connections; b < c.length; b++) {
            var d = c[b];
            if (d.type === a) return d
        }
        return null
    }, a.prototype.selectFirstConnection = function() {
        var a, b = this;
        a = this.showAll ? this.connections.find(function(a) {
            return b.showConnection(a)
        }) : this.connections.find(function(a) {
            return b.isOfCurrentTabType(a.type)
        }), this.setActiveConnection(a)
    }, a.prototype.isOfCurrentTabType = function(a) {
        return !!this.currentTab && (void 0 === this.currentTab.type || this.currentTab.type === a)
    }, a.prototype.processConnections = function(a) {
        var b = this;
        this.connections = this.$filter("orderBy")(a, function(a) {
            return b.naturalSort.naturalValue(a.label)
        }), this.updateConnectionsWithLive()
    }, a.prototype.processPorts = function(a) {
        return this.$filter("orderBy")(a.filter(function(a) {
            return "HS" !== a.port_config_type
        }), this.portOrder)
    }, a.prototype.processCalls = function(a) {
        return a
    }, a.prototype.processDevices = function(a) {
        return this.isMasterReachable = a.some(function(a) {
            return a.device_isMaster && a.device_isReachable || "disabled" === a.device_linking
        }), a
    }, a.prototype.processLinkGroupCapabilities = function(a) {
        this.linkGroupCapabilities = a, this.showConnectionBridgeOptionsIcon = a.showConnectionBridgeOptionsIcon
    }, a.prototype.updateConnectionsWithLive = function() {
        this.connectionsWithLive = {};
        for (var a = 0, b = this.connections; a < b.length; a++) {
            var c = b[a];
            this.connectionsWithLive[c.id] = {
                label: c.label,
                events: {
                    call: !1,
                    control: !1,
                    talk: !1
                },
                participants: {}
            }
        }
        this.refreshPortsOnConnectionsParticipants(), this.refreshLiveStatusOnConnectionsParticipants()
    }, a.prototype.getAssignedPorts = function(a) {
        return this.ports.filter(function(b) {
            return void 0 !== b.port_connections[a]
        })
    }, a.prototype.refreshPortsOnConnectionsParticipants = function() {
        for (var a in this.connectionsWithLive) {
            var b = Number(a),
                c = this.connectionsWithLive[b],
                d = c.participants;
            for (var e in d) {
                var f = d[e];
                f.portLiveStatus && (f.liveStatus ? (delete f.portLiveStatus, delete f.silenceSupp, delete f.networkQuality, f.pending = !0) : delete d[e])
            }
            for (var g = this.getAssignedPorts(b), h = function(a) {
                    var b = d[a.res],
                        c = i.devices.find(function(b) {
                            return b.device_id === a.device_id
                        }),
                        e = !!c && c.device_isReachable,
                        f = a.liveStatus.online,
                        g = e && f,
                        h = i.getMultiChannelProperty(a);
                    b ? (b.portLiveStatus = a.liveStatus, b.label = a.port_label, b.multiChannel = h, b.silenceSupp = a.port_settings.silenceSupp, b.networkQuality = a.port_settings.networkQuality, b.pending = a.liveStatus.pending, b.online = g, b.type = a.port_config_type, b.sipCalls = i.getCurrentPortsSipCalls(a)) : d[a.res] = {
                        portLiveStatus: a.liveStatus,
                        multiChannel: h,
                        networkQuality: a.port_settings.networkQuality,
                        silenceSupp: a.port_settings.silenceSupp,
                        pending: "SIP" !== a.port_config_type || a.liveStatus.pending,
                        online: g,
                        deviceId: a.device_id,
                        label: a.port_label,
                        sipCalls: i.getCurrentPortsSipCalls(a),
                        roleLabel: void 0,
                        type: a.port_config_type,
                        res: a.res
                    }
                }, i = this, j = 0, k = g; j < k.length; j++) {
                var l = k[j];
                h(l)
            }
        }
        this.refreshPortsConnectionStatus()
    }, a.prototype.refreshLiveStatusOnConnectionsParticipants = function() {
        for (var a in this.connectionsWithLive) {
            var b = this.connectionsWithLive[a],
                c = b.participants;
            for (var d in c) {
                var e = c[d];
                e.portLiveStatus ? (delete e.liveStatus, "SIP" !== e.type && (e.pending = !0)) : delete c[d]
            }
            var f = this.connectionsStatus[Number(a)];
            if (f) {
                b.events = f.events;
                for (var g = function(b) {
                        var d = c[b.res],
                            e = h.devices.find(function(a) {
                                return a.device_id === b.device_id
                            }),
                            f = !!e && e.device_isReachable;
                        if (d) {
                            var g = !d.portLiveStatus || d.portLiveStatus.online;
                            d.liveStatus = b, d.label = b.label, d.pending = !!d.portLiveStatus && d.portLiveStatus.pending, d.online = f && g
                        } else {
                            var i = h.ports.find(function(a) {
                                    return a.res === b.res
                                }),
                                j = i && void 0 !== i.port_connections[a],
                                k = i && !!i.liveStatus && i.liveStatus.pending,
                                l = i ? void 0 : h.endpoints.find(function(a) {
                                    return a.res === b.res
                                });
                            c[b.res] = {
                                liveStatus: b,
                                multiChannel: i ? h.getMultiChannelProperty(i) : void 0,
                                pending: !!i && (!j || k),
                                online: f,
                                deviceId: b.device_id,
                                label: b.label,
                                sipCalls: i ? h.getCurrentPortsSipCalls(i) : [],
                                roleLabel: h.getEndpointRoleLabel(l),
                                type: i ? i.port_config_type : "endpoint",
                                res: b.res
                            }
                        }
                    }, h = this, i = 0, j = f.participants; i < j.length; i++) {
                    var k = j[i];
                    g(k)
                }
            }
        }
        this.refreshPortsConnectionStatus()
    }, a.prototype.refreshPortsConnectionStatus = function() {
        for (var a = {}, b = {}, c = 0, d = this.devices; c < d.length; c++) {
            var e = d[c];
            b[e.device_id] = {
                deviceId: e.device_id,
                isMaster: e.device_isMaster,
                isReachable: e.device_isReachable,
                usage: e.device_usage,
                label: e.device_label,
                ports: []
            }
        }
        for (var f = 0, g = this.ports; f < g.length; f++) {
            var h = g[f];
            if (b[h.device_id]) {
                var i = {};
                for (var j in this.connectionsWithLive) {
                    var k = this.connectionsWithLive[j],
                        l = k.participants[h.res];
                    l && (i[j] = {
                        label: k.label,
                        pending: l.pending
                    })
                }
                var m = this.getMultiChannelProperty(h),
                    n = Object.keys(i).length > 0,
                    o = null != this.activeConnectionId && this.isPortTypeCompatible(h, this.activeConnectionType),
                    p = void 0 !== i[this.activeConnectionId],
                    q = !!h.liveStatus && h.liveStatus.pending,
                    r = "SIP" !== h.port_config_type && p ? i[this.activeConnectionId].pending : q,
                    s = b[h.device_id].isReachable && h.liveStatus.online,
                    t = void 0;
                void 0 !== h.liveStatus.externalConnectionStatus ? t = "connected" === h.liveStatus.externalConnectionStatus : void 0 !== h.liveStatus.sipRegistrationStatusCode && (t = 200 === h.liveStatus.sipRegistrationStatusCode);
                var u = h.liveStatus.vox ? h.liveStatus.vox.status : void 0,
                    v = o && !p && s && (!!m || !n);
                if (v && "direct" === this.activeConnectionType) {
                    var w = this.connectionsWithLive[this.activeConnectionId].participants,
                        x = Object.keys(w);
                    if (x.length >= 2) v = !1;
                    else if (1 === x.length) {
                        var y = w[x[0]];
                        y.deviceId !== h.device_id && (["4W", "IVC"].indexOf(h.port_config_type) !== -1 && "SIP" === y.type || "SIP" === h.port_config_type && ["4W", "IVC"].indexOf(y.type) !== -1) && (v = !1)
                    }
                }
                b[h.device_id].ports.push({
                    connections: i,
                    multiChannel: m,
                    assignable: v,
                    inuse: n,
                    assigned: p,
                    pending: r,
                    compatible: o,
                    res: h.res,
                    online: s,
                    label: h.port_label,
                    desc: h.port_desc,
                    externalConnectionStatus: t,
                    sipCalls: this.getCurrentPortsSipCalls(h),
                    voxStatus: u,
                    type: h.port_config_type
                }), "FSII" === this.deviceType ? (a[h.audioInterfaceType_shortName] || (a[h.audioInterfaceType_shortName] = {
                    label: h.audioInterfaceType_longName,
                    type: h.audioInterfaceType_shortName,
                    ports: []
                }), a[h.audioInterfaceType_shortName].ports.push({
                    connections: i,
                    multiChannel: m,
                    assignable: v,
                    inuse: n,
                    assigned: p,
                    pending: r,
                    compatible: o,
                    res: h.res,
                    online: s,
                    label: h.port_label,
                    desc: h.port_desc,
                    externalConnectionStatus: t,
                    sipCalls: this.getCurrentPortsSipCalls(h),
                    voxStatus: u,
                    type: h.port_config_type
                })) : (a[h.port_config_type] || (a[h.port_config_type] = {
                    label: h.audioInterfaceType_longName,
                    type: h.port_config_type,
                    ports: []
                }), a[h.port_config_type].ports.push({
                    connections: i,
                    multiChannel: m,
                    assignable: v,
                    inuse: n,
                    assigned: p,
                    pending: r,
                    compatible: o,
                    res: h.res,
                    online: s,
                    label: h.port_label,
                    desc: h.port_desc,
                    externalConnectionStatus: t,
                    sipCalls: this.getCurrentPortsSipCalls(h),
                    voxStatus: u,
                    type: h.port_config_type
                }))
            }
        }
        this.deviceConnectionStatus = Object.keys(b).map(function(a) {
            return b[a]
        }), this.typesConnectionStatus = Object.keys(a).map(function(b) {
            return a[b]
        }), this.typesConnectionStatus = this.typesConnectionStatus.sort(function(a, b) {
            return a.label > b.label ? 1 : b.label > a.label ? -1 : 0
        })
    }, a.prototype.isPortTypeCompatible = function(a, b) {
        switch (b) {
            case "partyline":
                return !0;
            case "direct":
                return a.port_settings.multiChannel === !1;
            case "group":
                return "PGM" !== a.port_config_type;
            default:
                return !1
        }
    }, a.prototype.getCurrentPortsSipCalls = function(a) {
        return this.sipCalls.filter(function(b) {
            return b.deviceId === a.device_id && b.audioInterfaceId === a.audioInterface_id_AudioInterface && b.portId === a.port_id
        })
    }, a.prototype.getCurrentPortConnectionStatusClass = function(a) {
        var b = [];
        (a.inuse && !a.assigned || Object.keys(a.connections).length >= 2) && b.push("selectable");
        var c = "";
        return a.online ? a.pending ? c = "pending" : a.assigned ? c = "selected" : a.inuse && (c = "inuse") : c = "offline", b.push(c), "SIP" === a.type && 0 !== a.sipCalls.length && b.push("conn-port-has-active-sip-line"), b
    }, a.prototype.hangUpSipCall = function(a) {
        this.callsService.hangupCall(a)
    }, a.prototype.getCallLabel = function(a) {
        return a.uri || this.gettext("Connecting...")
    }, a.prototype.portMasterGrouping = function() {
        return this.UserData.groupByDeviceAssignments ? this.deviceConnectionStatus : this.typesConnectionStatus
    }, a.prototype.getDetailGrouping = function(a) {
        return this.UserData.groupByDeviceAssignments ? this.deviceConnectionStatus.find(function(b) {
            return b.deviceId === a.deviceId
        }).ports : this.typesConnectionStatus.find(function(b) {
            return b.type === a.type
        }).ports
    }, a.prototype.getEndpointRoleLabel = function(a) {
        if (a) {
            if ("LQ-AIC" !== a.type && "FSII-BP" !== a.type && (!a.role || a.role.isDefault)) return "SA" === a.type ? a.label : "Local Config";
            var b = void 0;
            void 0 !== a.liveStatus && void 0 !== a.liveStatus.role ? b = a.liveStatus.role : void 0 !== a.role && void 0 !== a.role.id && (b = a.role.id);
            var c = this.roles.find(function(a) {
                return a.id === b
            });
            return c ? c.label : "Unassigned"
        }
    }, a.prototype.getMultiChannelProperty = function(a) {
        if (!a) return !1;
        if (void 0 !== a.port_settings.multiChannel) return a.port_settings.multiChannel;
        var b = this.devices.find(function(b) {
            return b.device_id === a.device_id
        });
        return !b || "HMS-4X" !== b.deviceType_name
    }, a
}();
/**/
angular.module("moonraker").controller("connectionCtrl", ConnCtrl);
/**/
var app = angular.module("moonraker");
/**/
app.controller("bridgeOptionsCtrl", ["$uibModalInstance", "options", "$filter", "gettext", "portsService", function(a, b, c, d, e) {
    var f = this;
    f.silenceSuppressionMessage = d("Silence suppression may affect latency (see network quality for details). This setting is not suitable for music.");
    var g = function(a) {
        return f.showQuality(a)
    };
    f.sliderOptions = {
        from: 0,
        to: 5,
        step: 1,
        scale: [d("Very Low"), d("Low"), d("Balanced"), d("High"), d("Very High"), d("Custom")],
        smooth: !1,
        calculate: g,
        limits: !1,
        callback: function(a) {}
    }, f.sliderOptionsSmall = angular.copy(f.sliderOptions), f.sliderOptionsSmall.scale[2] = "Bal..", f.qualities = [{
        value: 0,
        text: d("Very Low")
    }, {
        value: 1,
        text: d("Low")
    }, {
        value: 2,
        text: d("Balanced")
    }, {
        value: 3,
        text: d("High")
    }, {
        value: 4,
        text: d("Very High")
    }, {
        value: 5,
        text: d("Custom")
    }], f.jitterBuffers = [{
        value: "3-60",
        text: " 3ms -  60ms"
    }, {
        value: "5-60",
        text: " 5ms -  60ms"
    }, {
        value: "20-60",
        text: "20ms -  60ms"
    }, {
        value: "40-100",
        text: "40ms - 100ms"
    }, {
        value: "60-200",
        text: "60ms - 200ms"
    }, {
        value: "100-500",
        text: "100ms - 500ms"
    }, {
        value: "200-1000",
        text: "200ms - 1000ms"
    }], f.bitrates = [{
        value: 16,
        text: "16 Kbps"
    }, {
        value: 32,
        text: "32 Kbps"
    }, {
        value: 48,
        text: "48 Kbps"
    }, {
        value: 64,
        text: "64 Kbps"
    }, {
        value: 128,
        text: "128 Kbps"
    }], f.packetSizes = [{
        value: 5,
        text: "5 ms"
    }, {
        value: 10,
        text: "10 ms"
    }, {
        value: 20,
        text: "20 ms"
    }, {
        value: 40,
        text: "40 ms"
    }, {
        value: 60,
        text: "60 ms"
    }], f.packetSizesFecLessThan32Kbps = f.packetSizes.slice(2, 4), f.packetSizesFec = f.packetSizes.slice(1, 4), f.packetSizesLessThan64Kbps = f.packetSizes.slice(1), f.packetSizesLessThan32Kbps = f.packetSizesLessThan64Kbps.slice(1), f.setNetworkSettings = function(a, b) {}, f.BoolToEnabledDisabled = [{
        value: !0,
        text: d("Enabled")
    }, {
        value: !1,
        text: d("Disabled")
    }], f.options = b, f.bridgePort = b.bridgePort, f.showEnabledSettingFromBoolean = function(a) {
        angular.isUndefined(a) && (a = !1);
        var b = "Not found";
        return f.BoolToEnabledDisabled.forEach(function(c) {
            c.value == a && (b = c.text)
        }), b
    }, f.showSilenceSupp = function(a) {
        return angular.isUndefined(a.port_settings.silenceSupp) && (a.port_settings.silenceSupp = !1), f.showEnabledSettingFromBoolean(a.port_settings.silenceSupp)
    }, f.showAudioBandwidth = function(a) {
        var b = 8;
        switch (a.bitrate) {
            case 8:
                b = 4;
                break;
            case 10:
                b = 6;
                break;
            case 12:
                b = 6;
                break;
            default:
                b = a.bitrate >= 128 ? 20 : 12
        }
        return b + " kHz"
    }, f.showJitter = function(a) {
        var b = c("filter")(f.jitterBuffers, {
            value: a
        });
        return a && b.length ? b[0].text : d("Not set")
    }, f.showPacketSize = function(a) {
        var b = c("filter")(f.packetSizes, {
            value: a
        });
        return a && b.length ? b[0].text : d("Not set")
    }, f.getPacketSizes = function(a) {
        var b = !1,
            c = !1,
            d = !1,
            e = !1;
        return a ? (a.port_settings.fec && (b = !0), a.port_settings.networkQuality.bitrate < 64 && (d = !0), a.port_settings.networkQuality.bitrate < 32 && (c = !0), a.port_settings.silenceSupp === !0 && (e = !0), b ? c ? f.packetSizesFecLessThan32Kbps : f.packetSizesFec : d || e ? c ? f.packetSizesLessThan32Kbps : f.packetSizesLessThan64Kbps : f.packetSizes) : (console.error("getPacketsSizes: missing port"), f.packetSizes)
    }, f.showBitrate = function(a) {
        var b = c("filter")(f.bitrates, {
            value: a
        });
        return a && b.length ? b[0].text : d("Not set")
    }, f.showLatency = function(a) {
        var b = 20,
            c = a.jitter.split("-"),
            d = b + parseInt(c[0]),
            e = b + parseInt(c[1]);
        return d + "ms - " + e + "ms"
    }, f.showQuality = function(a) {
        var b = c("filter")(f.qualities, {
            value: a
        });
        return angular.isDefined(a) && b.length ? b[0].text : d("Not set")
    }, f.editPort = function(a) {
        f.editingQuality = !0, $(document).bind("mouseup touchend", function(a) {
            for (var b = $("#network-quality-slider").get(0), c = $("#port_quality").get(0), d = a.target; null != d;) {
                if (d == b || d == c) return;
                d = d.parentElement
            }
            $(document).unbind("mouseup touchend"), f.editingQuality = !1
        })
    }, f.applyNetworkQuality = function(a) {
        if (a) {
            var b = a.port_settings.networkQuality.type;
            5 != b && (a.port_settings.networkQuality.bitrate = f.bitrates[b].value, a.port_settings.networkQuality.packetSize = f.packetSizes[4 - b].value, a.port_settings.networkQuality.jitter = f.jitterBuffers[4 - b].value), a.port_settings.fec ? a.port_settings.networkQuality.packetSize = Math.max(10, Math.min(40, a.port_settings.networkQuality.packetSize)) : (a.port_settings.silenceSupp === !0 || a.port_settings.networkQuality.bitrate < 64) && (a.port_settings.networkQuality.packetSize = Math.max(10, a.port_settings.networkQuality.packetSize)), a.port_settings.networkQuality.bitrate < 32 && (a.port_settings.networkQuality.packetSize = Math.max(20, a.port_settings.networkQuality.packetSize)), e.updatePort(a.port_id, {
                networkQuality: a.port_settings.networkQuality,
                silenceSupp: a.port_settings.silenceSupp
            })
        }
    }, f.setSilenceSupp = function(a) {
        this.applyNetworkQuality(a)
    }, f.done = function() {
        a.close({})
    }, f.cancel = function() {
        a.dismiss()
    }
}]);
/**/
var SipDialOutCtrl = function() {
    function a(a, b, c, d, e, f, g) {
        var h = this;
        this.callsService = d, this.portsService = e, this.$uibModalInstance = f, this.portRes = g, this.calls = [], this.callRes = null, this.actionPending = !1, this.uri = "", this.submitError = "", this.portsService.ports.then(function(a) {
            h.processPorts(a), h.port.lastUri && (h.uri = h.port.lastUri, b(function() {
                return document.getElementById("sipdialouturi").select()
            }, 0, !1))
        }), this.callsService.subscribe(a, function() {
            h.callsService.calls.then(function(a) {
                return h.processCalls(a)
            })
        }), this.portsService.subscribe(a, function() {
            h.portsService.ports.then(function(a) {
                return h.processPorts(a)
            })
        })
    }
    return a.$inject = ["$scope", "$timeout", "gettext", "callsService", "portsService", "$uibModalInstance", "portRes"], a.prototype.cancel = function() {
        this.$uibModalInstance.close()
    }, a.prototype.initiateCall = function() {
        var a = this;
        this.submitError = "", this.call = null, this.actionPending = !0, this.callsService.makeCall(this.port.port_id, this.uri).then(function(b) {
            a.actionPending = !1, a.callRes = b.res, a.updateCallStatus()
        })["catch"](function(b) {
            a.actionPending = !1, b.data && b.data.message && (a.submitError = b.data.message)
        })
    }, a.prototype.hangUpCall = function() {
        var a = this;
        this.submitError = "", this.actionPending = !0, this.callsService.hangupCall(this.call).then(function(b) {
            a.actionPending = !1, a.call = null, a.callRes = null
        })["catch"](function(b) {
            a.actionPending = !1, b.data && b.data.message && (a.submitError = b.data.message)
        })
    }, a.prototype.processCalls = function(a) {
        this.calls = a, this.updateCallStatus()
    }, a.prototype.updateCallStatus = function() {
        var a = this;
        if (this.callRes) {
            var b = this.calls.find(function(b) {
                return b.res === a.callRes
            });
            if (!b) return;
            if (this.call = b, !this.call.liveStatus.inProgress) return void(this.callRes = null)
        }
    }, a.prototype.processPorts = function(a) {
        var b = this;
        this.port = a.find(function(a) {
            return a.res === b.portRes
        }), this.port || this.cancel()
    }, a
}();
/**/
angular.module("moonraker").controller("sipDialOutCtrl", SipDialOutCtrl);
/**/
var AlertsService = function() {
    function a(a, b, c, d, e, f, g) {
        var h = this;
        this.$q = b, this.$rootScope = c, this.socket = d, this.$route = e, this.devicesService = f, this.capabilitiesService = g, this.alertsCache = null, this.currentAlertsUrl = "/api/1/devices/:deviceId/alerts/current", this.currentAlertsResource = a(this.currentAlertsUrl, {
            deviceId: "@deviceId"
        }), this.alertsCache = b(function(a, b) {
            h.capabilitiesService.getDeviceCapabilites(0).then(function(c) {
                c.type.indexOf("LQ") !== -1 ? (h.subscribeToSocket(), h.fetchAlerts().then(function(b) {
                    return a(b)
                })["catch"](function(a) {
                    return b(a)
                })) : a([])
            })["catch"](function(a) {
                return b(a)
            })
        })
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket", "$route", "devicesService", "capabilitiesService"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:alerts", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "alerts", {
        get: function() {
            var a = this;
            return this.alertsCache || (this.alertsCache = this.fetchAlerts(), this.alertsCache["catch"](function() {
                return a.alertsCache = null
            })), this.alertsCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.getCurrentAlertsForDevice = function(a) {
        var b = this;
        return this.devicesService.resolveDeviceId(a).then(function(a) {
            return b.alerts.then(function(b) {
                var c = b.filter(function(b) {
                    return b.device_id === a.toString()
                });
                if (c) return c;
                throw new Error("Cannot find alerts with ID " + a)
            })
        })
    }, Object.defineProperty(a.prototype, "currentDeviceCurrentAlerts", {
        get: function() {
            return this.getCurrentAlertsForDevice(parseInt(this.$route.current.params.deviceId))
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.fetchAlerts = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.currentAlertsResource.query(function(a) {
                return b(a)
            }, function(a) {
                return c(a)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.alertsCache = null, this.$rootScope.$emit("live:alerts")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                alerts: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    alerts: "start"
                }), a.updateAndNotify()
            }), b.on("live:alerts", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("alertsService", AlertsService);
/**/
var LicensingService = function() {
    function a(a, b) {
        this.$q = b, this.AGENT_IC_SINGLE_LICENSE = "AGENT-IC-LQ", this.AGENT_IC_BULK_LICENSE = "AGENT-IC8-LQ", this.SIP_BULK_LICENSE = "SIP8-LQ", this.AGENT_IC_SINGLE_LICENSE_DEMO = "AGENT-IC-LQ-DEMO", this.AGENT_IC_BULK_LICENSE_DEMO = "AGENT-IC8-LQ-DEMO", this.SIP_BULK_LICENSE_DEMO = "SIP8-LQ-DEMO", this.AGENT_IC_LICENSE_REGEXP = /^AGENT-IC(\d*)-LQ$/, this.SIP_LICENSE_REGEXP = /^SIP(\d*)-LQ$/, this.AGENT_IC_LICENSE_REGEXP_DEMO = /^AGENT-IC(\d*)-LQ-DEMO$/, this.SIP_LICENSE_REGEXP_DEMO = /^SIP(\d*)-LQ-DEMO$/, this.licensableFeatures = {
            "AGENT-IC-LQ": {
                code: "AGENT-IC-LQ",
                friendlyName: "LQ Single Agent-IC user license",
                featureName: "Agent-IC user license(s)",
                regexp: this.AGENT_IC_LICENSE_REGEXP,
                unlicensedText: "Agent-IC is currently unlicensed",
                maximum: 8,
                dependencies: {
                    exclusive: ["AGENT-IC8-LQ"]
                }
            },
            "SIP8-LQ": {
                code: "SIP8-LQ",
                friendlyName: "LQ SIP (bulk of 8)",
                featureName: "SIP account(s)",
                regexp: this.SIP_LICENSE_REGEXP,
                unlicensedText: "SIP is currently unlicensed",
                maximum: 1
            },
            "AGENT-IC8-LQ": {
                code: "AGENT-IC8-LQ",
                friendlyName: "LQ Agent-IC user license (bulk of 8)",
                featureName: "Agent-IC user license(s)",
                regexp: this.AGENT_IC_LICENSE_REGEXP,
                unlicensedText: "Agent-IC is currently unlicensed",
                maximum: 1,
                dependencies: {
                    exclusive: ["AGENT-IC-LQ"]
                }
            },
            "AGENT-IC-LQ-DEMO": {
                code: "AGENT-IC-LQ-DEMO",
                friendlyName: "DEMO LQ Single Agent-IC user license",
                featureName: "DEMO Agent-IC user license(s)",
                regexp: this.AGENT_IC_LICENSE_REGEXP_DEMO,
                unlicensedText: "Agent-IC is currently unlicensed",
                maximum: 8,
                dependencies: {
                    exclusive: ["AGENT-IC8-LQ-DEMO"]
                }
            },
            "SIP8-LQ-DEMO": {
                code: "SIP8-LQ-DEMO",
                friendlyName: "DEMO LQ SIP (bulk of 8)",
                featureName: "DEMO SIP account(s)",
                regexp: this.SIP_LICENSE_REGEXP_DEMO,
                unlicensedText: "SIP is currently unlicensed",
                maximum: 1
            },
            "AGENT-IC8-LQ-DEMO": {
                code: "AGENT-IC8-LQ-DEMO",
                friendlyName: "DEMO LQ Agent-IC user license (bulk of 8)",
                featureName: "DEMO Agent-IC user license(s)",
                regexp: this.AGENT_IC_LICENSE_REGEXP_DEMO,
                unlicensedText: "Agent-IC is currently unlicensed",
                maximum: 1,
                dependencies: {
                    exclusive: ["AGENT-IC-LQ-DEMO"]
                }
            }
        }, this.ticketResource = a("/api/1/devices/:deviceId/license/ticket/:ticketId", {
            deviceId: "@deviceId",
            ticketId: "@ticketId"
        }), this.contextResource = a("/api/1/devices/:deviceId/license/context", {
            deviceId: "@deviceId"
        }, {
            download: CCUtils.downloadAction
        })
    }
    return a.$inject = ["$resource", "$q"], a.prototype.getTicketInformation = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.ticketResource.get({
                deviceId: a,
                ticketId: b
            }, d, e)
        })
    }, a.prototype.updateActivationInformation = function(a, b, c) {
        var d = this;
        return this.$q(function(e, f) {
            d.ticketResource.save({
                deviceId: a,
                ticketId: b
            }, {
                features: c
            }, e, f)
        })
    }, a.prototype.getContextFile = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.contextResource.download({
                deviceId: a
            }, c, d)
        })
    }, a.prototype.getNumberOfLicensedUsers = function(a, b) {
        var c;
        return c = b instanceof RegExp ? a.licensedFeatures.find(function(a) {
            return b.test(a.name)
        }) : a.licensedFeatures.find(function(a) {
            return a.name === b
        }), c ? c.name.indexOf("8") !== -1 ? 8 * +c.qty : +c.qty : 0
    }, a.prototype.decorateTicketId = function(a) {
        return a.toUpperCase().match(/.{5}/g).join("-")
    }, a
}();
/**/
angular.module("moonraker").service("licenseService", LicensingService);
/**/
var audioIfService = angular.module("moonraker");
/**/
audioIfService.factory("AudioInterfacesUtil", [function() {
    return {
        formatWithCapabilities: function(a, b, c) {
            var d, e = [],
                f = {
                    "2W": 0,
                    "4W": 1,
                    "4WG": 2,
                    1.9: 3,
                    2.4: 4
                };
            if ("supportedList" == a.icon.interfaces.displayMode) {
                var g = {};
                for (d in b)
                    if (b[d].audioInterfaceType_shortName) {
                        var h = b[d].audioInterfaceType_shortName;
                        if ("E1" === h)
                            for (var i in c) "FSII-Antenna" == c[i].type && c[i].liveStatus && c[i].liveStatus.frequencyType && (g[c[i].liveStatus.frequencyType] = !0);
                        else void 0 !== b[d].audioInterface_portCount ? void 0 === g[h] ? g[h] = b[d].audioInterface_portCount : g[h] += b[d].audioInterface_portCount : g[h] = !0
                    } for (var j in g)
                    if (g[j] > 0) {
                        var k = {
                            active: !0,
                            type: j
                        };
                        e.push(k)
                    } for (; e.length < a.icon.interfaces.max;) e.push({
                    active: !1
                });
                e.sort(function(a, b) {
                    return a.active && !b.active ? -1 : !a.active && b.active ? 1 : f[a.type] < f[b.type] ? -1 : f[a.type] > f[b.type] ? 1 : 0
                })
            } else if ("bySlot" == a.icon.interfaces.displayMode) {
                for (; e.length < a.icon.interfaces.max;) e.push({
                    active: !1
                });
                for (d in b) b[d].audioInterfaceType_shortName && b[d].audioInterface_hwIndex < e.length && (e[b[d].audioInterface_hwIndex] = {
                    active: !0,
                    type: b[d].audioInterfaceType_shortName
                })
            } else console.error("AudioInterfacesUtil.formatWithCapabilities: unsupported display mode: " + a.icon.interfaces.displayMode);
            return e
        }
    }
}]);
/**/
var AudioInterfacesService = function() {
    function a(a, b, c, d, e, f) {
        this.$q = b, this.$rootScope = c, this.$route = d, this.socket = e, this.devicesService = f, this.interfacesCache = null, this.interfacesUrl = "/api/1/devices/:deviceId/interfaces/:interfaceId", this.interfacesResource = a(this.interfacesUrl, {
            deviceId: "@deviceId",
            interfaceId: "@interfaceId"
        }, {
            update: {
                method: "PUT"
            }
        }), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "$route", "socket", "devicesService"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:interfaces", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "audioInterfaces", {
        get: function() {
            var a = this;
            return this.interfacesCache || (this.interfacesCache = this.fetchAudioInterfaces(), this.interfacesCache["catch"](function() {
                return a.interfacesCache = null
            })), this.interfacesCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "audioInterfacesMap", {
        get: function() {
            return this.audioInterfaces.then(function(a) {
                return CCUtils.arrayToMap(a, "audioInterface_id")
            })
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.getAudioInterfacesForDevice = function(a) {
        var b = this;
        return this.devicesService.resolveDeviceId(a).then(function(a) {
            return b.audioInterfaces.then(function(b) {
                return b.filter(function(b) {
                    return b.device_id_Device === a
                })
            })
        })
    }, a.prototype.getAudioInterfacesMapForDevice = function(a) {
        return this.getAudioInterfacesForDevice(a).then(function(a) {
            return CCUtils.arrayToMap(a, "audioInterface_id")
        })
    }, Object.defineProperty(a.prototype, "currentDeviceAudioInterfaces", {
        get: function() {
            return this.getAudioInterfacesForDevice(parseInt(this.$route.current.params.deviceId))
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "currentDeviceAudioInterfacesMap", {
        get: function() {
            return this.getAudioInterfacesMapForDevice(parseInt(this.$route.current.params.deviceId))
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.updateAudioInterface = function(a, b) {
        var c, d = this;
        c = Array.isArray(a) ? a : [a];
        var e = function(a) {
            var c = d.decodeGlobalAudioInterfaceId(a);
            return d.$q(function(e, f) {
                d.interfacesResource.update({
                    deviceId: c.deviceId,
                    interfaceId: a
                }, b, function(a) {
                    return e(a)
                }, function(a) {
                    return f(a)
                })
            })
        };
        return this.$q.all(c.map(function(a) {
            return e(a)
        })).then(function(a) {
            return a[0]
        })
    }, a.prototype.fetchAudioInterfaces = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.interfacesResource.query(function(a) {
                return b(a)
            }, function(b) {
                a.interfacesCache = null, c(b)
            })
        })
    }, a.prototype.decodeGlobalAudioInterfaceId = function(a) {
        var b = Number(a);
        return {
            deviceId: b >> 8,
            interfaceId: 255 & b
        }
    }, a.prototype.updateAndNotify = function() {
        this.interfacesCache = null, this.$rootScope.$emit("live:interfaces")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                interfaces: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    interfaces: "start"
                }), a.updateAndNotify()
            }), b.on("live:interfaces", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("audioInterfacesService", AudioInterfacesService);
/**/
var PortsService = function() {
    function a(a, b, c, d, e, f) {
        this.$q = b, this.$route = c, this.$rootScope = d, this.socket = e, this.devicesService = f, this.portsCache = null, this.portsUrl = "/api/1/devices/:deviceId/interfaces/:interfaceId/ports/:portId/:action", this.portsResource = a(this.portsUrl, {
            deviceId: "@deviceId",
            interfaceId: "@interfaceId",
            portId: "@portId",
            action: "@action"
        }, {
            update: {
                method: "PUT"
            }
        }), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$q", "$route", "$rootScope", "socket", "devicesService"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:ports", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "ports", {
        get: function() {
            var a = this;
            return this.portsCache || (this.portsCache = this.fetchPorts(), this.portsCache["catch"](function() {
                return a.portsCache = null
            })), this.portsCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "portsMap", {
        get: function() {
            return this.ports.then(function(a) {
                return a.reduce(function(a, b) {
                    return a[b.port_id] = b, a
                }, {})
            })
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.getPortsForDevice = function(a) {
        var b = this;
        return this.devicesService.resolveDeviceId(a).then(function(a) {
            return b.ports.then(function(b) {
                return b.filter(function(b) {
                    return b.device_id === a
                })
            })
        })
    }, a.prototype.getPortsMapForDevice = function(a) {
        return this.getPortsForDevice(a).then(function(a) {
            return a.reduce(function(a, b) {
                return a[b.port_id] = b, a
            }, {})
        })
    }, Object.defineProperty(a.prototype, "currentDevicePorts", {
        get: function() {
            var a = parseInt(this.$route.current.params.deviceId);
            return isFinite(a) || (a = 0), this.getPortsForDevice(a)
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "currentDevicePortsMap", {
        get: function() {
            var a = parseInt(this.$route.current.params.deviceId);
            return isFinite(a) || (a = 0), this.getPortsMapForDevice(a)
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.updatePort = function(a, b) {
        var c, d = this;
        c = Array.isArray(a) ? a : [a];
        var e = this.decodeGlobalPortId(c[0]).deviceId,
            f = c.map(function(a) {
                var b = d.decodeGlobalPortId(a);
                return "/api/1/devices/" + b.deviceId + "/interfaces/" + b.interfaceId + "/ports/" + a
            });
        return this.$q(function(a, c) {
            d.portsResource.update({
                deviceId: e
            }, Object.assign({}, {
                res: f
            }, b), function(b) {
                return a(b)
            }, function(a) {
                return c(a)
            })
        })
    }, a.prototype.associateWithConnection = function(a, b, c) {
        var d = this;
        void 0 === c && (c = !1);
        var e, f = this.decodeGlobalPortId(a),
            g = c ? "join" : "leave";
        e = Array.isArray(b) ? b : [b];
        var h = function(b) {
            return d.$q(function(c, e) {
                d.portsResource.save({
                    deviceId: f.deviceId,
                    interfaceId: f.interfaceId,
                    portId: a,
                    action: g
                }, {
                    target: "/api/1/connections/" + b
                }, function(a) {
                    return c(a)
                }, function(a) {
                    return e(a)
                })
            })
        };
        return this.$q.all(e.map(function(a) {
            return h(a)
        }))
    }, a.prototype.setGpo = function(a, b) {
        var c = this,
            d = this.decodeGlobalPortId(a);
        return this.$q(function(e, f) {
            c.portsResource.save({
                deviceId: d.deviceId,
                interfaceId: d.interfaceId,
                portId: a,
                action: "gpo"
            }, {
                enabled: b,
                timeout: 4e3
            }, function(a) {
                return e(a)
            }, function(a) {
                return f(a)
            })
        })
    }, a.prototype.startNulling = function(a) {
        var b = this,
            c = this.decodeGlobalPortId(a);
        return this.$q(function(d, e) {
            b.portsResource.save({
                deviceId: c.deviceId,
                interfaceId: c.interfaceId,
                portId: a,
                action: "nulling"
            }, null, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.getNullingStatus = function(a) {
        var b = this,
            c = this.decodeGlobalPortId(a);
        return this.$q(function(d, e) {
            b.portsResource.get({
                deviceId: c.deviceId,
                interfaceId: c.interfaceId,
                portId: a,
                action: "nulling"
            }, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.fetchPorts = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.portsResource.query(function(a) {
                b(a)
            }, function(b) {
                a.portsCache = null, c(b)
            })
        })
    }, a.prototype.decodeGlobalPortId = function(a) {
        var b = Number(a);
        return {
            deviceId: b >> 16,
            interfaceId: (65280 & b) >> 8,
            portId: 255 & b
        }
    }, a.prototype.getPortWarningsForDevice = function(a) {
        var b = this,
            c = {};
        return this.$q(function(d) {
            b.devicesService.getDevice(a).then(function(e) {
                return "HMS-4X" !== e.deviceType_name ? void d(c) : void b.getPortsForDevice(a).then(function(a) {
                    for (var b = 0, e = a; b < e.length; b++) {
                        var f = e[b];
                        f.liveStatus && !f.liveStatus.online && (c[f.port_id] = "Port " + f.port_desc + " is not responding")
                    }
                    d(c)
                })["catch"](function() {
                    return d(c)
                })
            })["catch"](function() {
                return d(c)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.portsCache = null, this.$rootScope.$emit("live:ports")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                ports: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    ports: "start"
                }), a.updateAndNotify()
            }), b.on("live:ports", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("portsService", PortsService);
/**/
var CallsService = function() {
    function a(a, b, c, d, e) {
        var f = this;
        this.$q = b, this.$rootScope = c, this.socket = d, this.portsService = e, this.callsCache = null, this.callsUrl = "/api/1/devices/:deviceId/interfaces/:interfaceId/ports/:portId/calls/:callId", this.callsResource = a(this.callsUrl, {
            deviceId: "@deviceId",
            interfaceId: "@interfaceId",
            portId: "@portId",
            callId: "@callId"
        }), this.callsCache = b(function(a, b) {
            f.subscribeToSocket(), f.fetchCalls().then(function(b) {
                return a(b)
            })["catch"](function(a) {
                return b(a)
            })
        })
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket", "portsService"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:calls", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "calls", {
        get: function() {
            var a = this;
            return this.callsCache || (this.callsCache = this.fetchCalls(), this.callsCache["catch"](function() {
                return a.callsCache = null
            })), this.callsCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.makeCall = function(a, b) {
        var c = this,
            d = this.portsService.decodeGlobalPortId(a);
        return this.$q(function(e, f) {
            c.callsResource.save({
                deviceId: d.deviceId,
                interfaceId: d.interfaceId,
                portId: a
            }, {
                uri: b
            }, e, f)
        })
    }, a.prototype.hangupCall = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            return a ? void b.callsResource["delete"]({
                deviceId: a.deviceId,
                interfaceId: a.audioInterfaceId,
                portId: a.portId,
                callId: a.id
            }, c, d) : d(new Error("Invalid call"))
        })
    }, a.prototype.hangupAllCall = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.callsResource["delete"](b, c)
        })
    }, a.prototype.fetchCalls = function() {
        return this.callsResource.query().$promise
    }, a.prototype.updateAndNotify = function() {
        this.callsCache = null, this.$rootScope.$emit("live:calls")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                calls: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    calls: "start"
                }), a.updateAndNotify()
            }), b.on("live:calls", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("callsService", CallsService);
/**/
var ConnectionsService = function() {
    function a(a, b, c, d) {
        this.$q = b, this.$rootScope = c, this.socket = d, this.connectionsUrl = "/api/1/connections/:connectionId/:action", this.connectionsResource = a(this.connectionsUrl, {
            connectionId: "@connectionId",
            action: "@action"
        }, {
            update: {
                method: "PUT"
            }
        }), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:vpl", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "connections", {
        get: function() {
            var a = this;
            return this.connectionsCache || (this.connectionsCache = this.fetchConnections(), this.connectionsCache["catch"](function() {
                return a.connectionsCache = null
            })), this.connectionsCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "connectionsMap", {
        get: function() {
            return this.connections.then(function(a) {
                return a.reduce(function(a, b) {
                    return a[b.id] = b, a
                }, {})
            })
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.addConnection = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.connectionsResource.save({
                type: a
            }, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.deleteConnection = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.connectionsResource["delete"]({
                connectionId: a
            }, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.updateConnection = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.connectionsResource.update({
                connectionId: a
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.filterConnections = function(a, b, c) {
        return void 0 === c && (c = "id"), a.filter(function(a) {
            return a.type === b
        }).reduce(function(a, b) {
            return a[b[c]] = b, a
        }, {})
    }, a.prototype.fetchConnections = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.connectionsResource.query(function(a) {
                return b(a)
            }, function(a) {
                return c(a)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.connectionsCache = null, this.$rootScope.$emit("live:vpl")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                vpl: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    vpl: "start"
                }), a.updateAndNotify()
            }), b.on("live:vpl", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("connectionsService", ConnectionsService);
/**/
var ConnectionsLiveStatusService = function() {
    function a(a, b, c, d) {
        this.$q = b, this.$rootScope = c, this.socket = d, this.connectionsLiveStatusUrl = "/api/1/connections/liveStatus", this.connectionsLiveStatusResource = a(this.connectionsLiveStatusUrl), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:connections", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "connectionsLiveStatus", {
        get: function() {
            var a = this;
            return this.connectionsLiveStatusCache || (this.connectionsLiveStatusCache = this.fetchConnectionsLiveStatus(), this.connectionsLiveStatusCache["catch"](function() {
                return a.connectionsLiveStatusCache = null
            })), this.connectionsLiveStatusCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "connectionsLiveStatusMap", {
        get: function() {
            return this.connectionsLiveStatus.then(function(a) {
                return a.reduce(function(a, b) {
                    return a[b.id] = b, a
                }, {})
            })
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.fetchConnectionsLiveStatus = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.connectionsLiveStatusResource.query(function(a) {
                return b(a)
            }, function(a) {
                return c(a)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.connectionsLiveStatusCache = null, this.$rootScope.$emit("live:connections")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                connections: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    connections: "start"
                }), a.updateAndNotify()
            }), b.on("live:connections", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("connectionsLiveStatusService", ConnectionsLiveStatusService);
/**/
var UserService = function() {
    function a(a, b) {
        this.$q = b, this.userData = null, this.userUrl = "/api/:version/users/:username", this.userResource = a(this.userUrl, {
            version: "@version",
            username: "@username"
        }, {
            update: {
                method: "PUT"
            }
        }), this.userData = {
            viewHostNames: !1,
            rolesSortingFieldName: "label",
            rolesSortingDirection: !0,
            groupByDeviceAssignments: !0,
            expanderStates: {}
        }
    }
    return a.$inject = ["$resource", "$q"], Object.defineProperty(a.prototype, "UserData", {
        get: function() {
            return this.userData
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.UpdatePassword = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.userResource.update({
                version: "1",
                username: a
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("userService", UserService);
/**/
var RolesService = function() {
    function a(a, b, c, d) {
        this.$q = b, this.$rootScope = c, this.socket = d, this.rolesCache = null, this.rolesUrl = "/api/1/roles/:roleId/:action", this.rolesResource = a(this.rolesUrl, {
            roleId: "@roleId",
            action: "@action"
        }, {
            update: {
                method: "PUT"
            }
        }), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:roles", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "rolesFromServer", {
        get: function() {
            return this.rolesCache = this.fetchRoles(), this.rolesCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "roles", {
        get: function() {
            return this.rolesCache || (this.rolesCache = this.fetchRoles()), this.rolesCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.getRole = function(a) {
        return this.roles.then(function(b) {
            return b.find(function(b) {
                return b.id === a
            })
        })
    }, a.prototype.createRole = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.rolesResource.save(a, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.deleteRole = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.rolesResource["delete"]({
                roleId: a
            }, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.updateRole = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.rolesResource.update({
                roleId: a
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.resetRole = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.rolesResource.save({
                roleId: a,
                action: "reset"
            }, {}, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.fetchRoles = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.rolesResource.query(function(a) {
                return b(a)
            }, function(b) {
                a.rolesCache = null, c(b)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.rolesCache = null, this.$rootScope.$emit("live:roles")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                roles: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    roles: "start"
                }), a.updateAndNotify()
            }), b.on("live:roles", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
RolesService.defaultIACKeyset = {
    keysetIndex: -1,
    connections: [],
    keys: [{
        keyIndex: 0,
        type: "Talk",
        isLatchable: !0
    }, {
        keyIndex: 1,
        type: "Call",
        isLatchable: !1
    }, {
        keyIndex: 2,
        type: "None",
        isLatchable: !1
    }, {
        keyIndex: 3,
        type: "Listen",
        isLatchable: !1
    }],
    isAutoListen: !0,
    minVolume: 0,
    maxVolume: 15e3
}, angular.module("moonraker").service("rolesService", RolesService);
/**/
var IvpUsersService = function() {
    function a(a, b, c, d) {
        this.$q = b, this.$rootScope = c, this.socket = d, this.usersCache = null, this.usersUrl = "/api/1/ivpusers/:userId/:action", this.usersResource = a(this.usersUrl, {
            userId: "@userId",
            action: "@action"
        }, {
            update: {
                method: "PUT"
            }
        }), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:ivpusers", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "usersFromServer", {
        get: function() {
            return this.usersCache = this.fetchUsers(), this.usersCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "users", {
        get: function() {
            return this.usersCache || (this.usersCache = this.fetchUsers()), this.usersCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.getUser = function(a) {
        return this.users.then(function(b) {
            return b.find(function(b) {
                return b.id === a
            })
        })
    }, a.prototype.createUser = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.usersResource.save(a, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.deleteUser = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.usersResource["delete"]({
                userId: a
            }, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.updateUser = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.usersResource.update({
                userId: a
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.fetchUsers = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.usersResource.query(function(a) {
                return b(a)
            }, function(b) {
                a.usersCache = null, c(b)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.usersCache = null, this.$rootScope.$emit("live:ivpusers")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                ivpusers: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    ivpusers: "start"
                }), a.updateAndNotify()
            }), b.on("live:ivpusers", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("ivpUsersService", IvpUsersService);
/**/
var capabilityServices = angular.module("moonraker");
/**/
capabilityServices.factory("DeviceCapability", ["$resource", function(a) {
    return a("/api/:version/devices/:deviceId/capability", {
        version: "@version",
        deviceId: "@deviceId"
    }, {
        get: {
            method: "GET",
            isArray: !1
        }
    })
}]), capabilityServices.factory("DevicesCapabilities", ["$resource", function(a) {
    return a("/api/:version/capabilities/devices/:type", {
        version: "@version",
        type: "@type"
    }, {
        get: {
            method: "GET",
            isArray: !1
        }
    })
}]), capabilityServices.factory("deviceCapabilityLoader", ["DeviceCapability", "$q", "$route", function(a, b, c) {
    return function(d) {
        var e = b.defer(),
            f = null != d ? d : c.current.params.deviceId;
        return a.get({
            version: "2",
            deviceId: f
        }, function(a) {
            e.resolve(a)
        }, function(a) {
            e.reject("Unable to fetch device " + f)
        }), e.promise
    }
}]), capabilityServices.factory("multiDevicesCapabilitiesLoader", ["DevicesCapabilities", "$q", "$route", function(a, b, c) {
    return function() {
        var c = {
                version: "1"
            },
            d = b.defer();
        return a.query(c, function(a) {
            d.resolve(a)
        }, function(a) {
            console.log("multiDevicesCapabilitiesLoader(): ", a.data.message), d.reject("Unable to fetch ports for ID(" + c + ")")
        }), d.promise
    }
}]);
/**/
var CapabilitiesService = function() {
    function a(a, b, c) {
        this.$q = b, this.$route = c, this._devicesCapabilitesCache = {}, this.audioInterfaceCapabilitiesCache = null, this.deviceCapabilitiesResource = a("/api/1/devices/:deviceId/capability", {
            deviceId: "@deviceId"
        }), this.audioInterfaceCapabilitiesResource = a("/api/1/capabilities/interfaces/:type", {
            type: "@type"
        })
    }
    return a.$inject = ["$resource", "$q", "$route"], a.prototype.getDeviceCapabilites = function(a) {
        var b = this;
        return this._devicesCapabilitesCache[a] || (this._devicesCapabilitesCache[a] = this.$q(function(c, d) {
            b.deviceCapabilitiesResource.get({
                deviceId: a
            }, function(a) {
                return c(a)
            }, function(c) {
                delete b._devicesCapabilitesCache[a], d(c)
            })
        })), this._devicesCapabilitesCache[a]
    }, Object.defineProperty(a.prototype, "audioInterfaceCapabilities", {
        get: function() {
            var a = this;
            return this.audioInterfaceCapabilitiesCache || (this.audioInterfaceCapabilitiesCache = this.$q(function(b, c) {
                a.audioInterfaceCapabilitiesResource.query(function(a) {
                    return b(a)
                }, function(b) {
                    a.audioInterfaceCapabilitiesCache = null, c(b)
                })
            })), this.audioInterfaceCapabilitiesCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "audioInterfaceCapabilitiesMap", {
        get: function() {
            return this.audioInterfaceCapabilities.then(function(a) {
                return a.reduce(function(a, b) {
                    return a[b.type] = b, a
                }, {})
            })
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "currentDeviceCapabilites", {
        get: function() {
            var a = this.$route.current.params.deviceId ? parseInt(this.$route.current.params.deviceId) : 0;
            return this.getDeviceCapabilites(a)
        },
        enumerable: !0,
        configurable: !0
    }), a
}();
/**/
angular.module("moonraker").service("capabilitiesService", CapabilitiesService);
/**/
var LinkGroupCapabilitiesService = function() {
    function a(a, b, c, d) {
        this.$rootScope = b, this.$q = c, this.socket = d, this.linkGroupCapabilitiesCache = null, this.linkGroupCapabilitiesResource = a("/api/1/capabilities/linkgroup", {}, {
            get: {
                method: "GET",
                isArray: !1
            }
        }), this.subscribeToSocket()
    }
    return a.$inject = ["$resource", "$rootScope", "$q", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:linkgroupcapabilities", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "linkGroupCapabilities", {
        get: function() {
            var a = this;
            return this.linkGroupCapabilitiesCache || (this.linkGroupCapabilitiesCache = this.$q(function(b, c) {
                a.linkGroupCapabilitiesResource.get(function(a) {
                    return b(a)
                }, function(b) {
                    a.linkGroupCapabilitiesCache = null, c(b)
                })
            })), this.linkGroupCapabilitiesCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.supportsResourceUsage = function(a) {
        return a && a.roles && !a.roles.some(function(a) {
            return "HMS-4X" === a.type || "FSII-BP" === a.type
        })
    }, a.prototype.updateAndNotify = function() {
        this.linkGroupCapabilitiesCache = null, this.$rootScope.$emit("live:linkgroupcapabilities")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                linkgroupcapabilities: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    linkgroupcapabilities: "start"
                }), a.updateAndNotify()
            }), b.on("live:linkgroupcapabilities", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("linkGroupCapabilitiesService", LinkGroupCapabilitiesService);
/**/
var EndpointsService = function() {
    function a(a, b, c, d) {
        this.$q = b, this.$rootScope = c, this.socket = d, this.endpointTypeToNameMap = {
            "HBP-2X": "Beltpack",
            "HRM-4X": "Remote Station",
            "HKB-2X": "Speaker Station",
            "HMS-4X": "Main Station",
            "LQ-AIC": "Agent-IC"
        }, this.endpointsCache = null, this.endpointsUrl = "/api/:version/devices/:deviceId/endpoints/:endpointId/:action", this.endpointsInitialized = !1, this.deferredPromises = {}, this.endpointsResource = a(this.endpointsUrl, {
            version: 1,
            endpointId: "@endpointId",
            action: "@action"
        }, {
            update: {
                method: "PUT"
            },
            resetToDefault: {
                method: "POST",
                params: {
                    action: "resettodefault"
                }
            },
            reboot: {
                method: "POST",
                params: {
                    action: "reboot"
                }
            },
            rmk: {
                method: "POST",
                params: {
                    action: "rmk"
                }
            },
            callSig: {
                method: "POST",
                params: {
                    action: "call"
                }
            }
        });
        var e = !1;
        e ? this.subscribeToSocket() : this.socketListener()
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:endpoints", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "endpointsFromServer", {
        get: function() {
            return this.deferredPromises.EndpointInit = null, this.endpointsCache = this.fetchEndpoints(), this.endpointsCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "endpoints", {
        get: function() {
            var a = this;
            return this.endpointsCache || (this.endpointsCache = this.fetchEndpoints(), this.endpointsCache["catch"](function() {
                return a.endpointsCache = null
            })), this.endpointsCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.getEndpoint = function(a) {
        return this.endpoints.then(function(b) {
            return b.find(function(b) {
                return b.id === a
            })
        })
    }, a.prototype.updateEndpoint = function(a, b, c) {
        return this.endpointsResource.update({
            deviceId: a,
            endpointId: b
        }, c).$promise
    }, a.prototype.deleteEndpoint = function(a, b) {
        return this.endpointsResource["delete"]({
            deviceId: a,
            endpointId: b
        }).$promise
    }, a.prototype.changeEndpointRole = function(a, b, c) {
        return this.endpointsResource.save({
            deviceId: a,
            endpointId: b,
            action: "changerole"
        }, {
            id: c
        }).$promise
    }, a.prototype.rebootEndpoint = function(a, b) {
        return this.endpointsResource.reboot({
            deviceId: a,
            endpointId: b
        }, {}).$promise
    }, a.prototype.resetEndpointToDefault = function(a, b) {
        return this.endpointsResource.resetToDefault({
            deviceId: a,
            endpointId: b
        }, {}).$promise
    }, a.prototype.rmkEndpoint = function(a, b) {
        return this.endpointsResource.rmk({
            deviceId: a,
            endpointId: b
        }, {}).$promise
    }, a.prototype.callEndpoint = function(a, b, c, d) {
        return this.endpointsResource.callSig({
            deviceId: a,
            endpointId: b
        }, {
            active: c,
            text: d
        }).$promise
    }, a.prototype.fetchEndpoints = function() {
        if (!this.deferredPromises.EndpointInit) {
            var a = this.$q.defer();
            this.deferredPromises.EndpointInit = a, this.socket().then(function(a) {
                a.emit("EndpointInit", {})
            }), this.endpointsCache = a.promise
        }
        return this.endpointsCache
    }, a.prototype.subscribeToSocket = function() {
        this.socket().then(function(a) {
            a.emit("live:update", {
                endpoints: "start"
            })
        })
    }, a.prototype.EndpointInitReply = function(a) {
        this.deferredPromises.EndpointInit.resolve(a.result), this.$rootScope.$emit("live:endpoints"), this.endpointsInitialized = !0
    }, a.prototype.EndpointUpdate = function(a) {
        var b = this;
        this.endpointsInitialized && this.endpointsCache.then(function(c) {
            var d = c.find(function(b) {
                return b.id === a.endpointId
            });
            void 0 !== d ? (CCUtils.setPropertyByPath(d, a.path, a.value), b.$rootScope.$emit("live:endpoints")) : console.log("EndpointUpdate could not find endpoint matching " + a.endpointId)
        })
    }, a.prototype.EndpointAdded = function(a) {
        var b = this;
        this.endpointsInitialized && this.endpointsCache.then(function(c) {
            c.push(a.value), b.$rootScope.$emit("live:endpoints")
        })
    }, a.prototype.EndpointRemoved = function(a) {
        this.deferredPromises.EndpointInit = null, this.endpointsCache = this.fetchEndpoints()
    }, a.prototype.socketListener = function() {
        var a = this;
        this.socket().then(function(b) {
            b.on("EndpointInit", function(b) {
                return a.EndpointInitReply(b)
            }), b.on("EndpointAdded", function(b) {
                return a.EndpointAdded(b)
            }), b.on("EndpointUpdated", function(b) {
                return a.EndpointUpdate(b)
            }), b.on("EndpointRemoved", function(b) {
                return a.EndpointRemoved(b)
            }), b.emit("EndpointInit", {}), b.on("reconnect", function() {
                b.emit("EndpointInit", {})
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("endpointsService", EndpointsService);
/**/
var ExternalDevicesService = function() {
    function a(a, b, c, d, e) {
        var f = this;
        this.gettext = b, this.$rootScope = c, this.$q = d, this.socket = e, this._externalDevicesCache = null, this.externalDeviceResource = a("/api/1/externalDevices/:externalDeviceId", {
            externalDeviceId: "@externalDeviceId"
        }, {
            update: {
                method: "PUT"
            }
        }), this.externalPortResource = a("/api/1/externalDevices/:externalDeviceId/ports/:externalPortId", {
            externalDeviceId: "@externalDeviceId",
            externalPortId: "@externalPortId"
        }, {
            update: {
                method: "PUT"
            }
        }), this._externalDevicesCache = d(function(a, b) {
            f.subscribeToSocket(), f.fetchExternalDevices().then(function(b) {
                return a(b)
            })["catch"](function(a) {
                return b(a)
            })
        })
    }
    return a.$inject = ["$resource", "gettext", "$rootScope", "$q", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:externalDevices", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "externalDevices", {
        get: function() {
            var a = this;
            return this._externalDevicesCache || (this._externalDevicesCache = this.fetchExternalDevices(), this._externalDevicesCache["catch"](function() {
                return a._externalDevicesCache = null
            })), this._externalDevicesCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "externalDevicesMap", {
        get: function() {
            return this.externalDevices.then(function(a) {
                return a.reduce(function(a, b) {
                    return a[b.id] = b, a
                }, {})
            })
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.addExternalDevice = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.externalDeviceResource.save(a, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.updateExternalDevice = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.externalDeviceResource.update({
                externalDeviceId: a
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.deleteExternalDevice = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.externalDeviceResource["delete"]({
                externalDeviceId: a
            }, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.addExternalPort = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.externalPortResource.save({
                externalDeviceId: a
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.updateExternalPort = function(a, b, c) {
        var d = this;
        return this.$q(function(e, f) {
            d.externalPortResource.update({
                externalDeviceId: a,
                externalPortId: b
            }, c, function(a) {
                return e(a)
            }, function(a) {
                return f(a)
            })
        })
    }, a.prototype.deleteExternalPort = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.externalPortResource["delete"]({
                externalDeviceId: a,
                externalPortId: b
            }, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.externalConnectionStatusToMessage = function(a) {
        switch (a) {
            case "unknown":
                return this.gettext("Unknown connection state");
            case "not_connected":
                return this.gettext("Disconnected");
            case "connecting":
                return this.gettext("Connecting...");
            case "connected":
                return this.gettext("Connected");
            case "disconnected":
                return this.gettext("IVC host is unreachable or invalid username/password was used");
            case "auth_failed":
                return this.gettext("IVC host is unreachable");
            case "already_in_use":
                return this.gettext("Username already in use");
            case "wrong_user":
                return this.gettext("Username not recognized");
            case "security_denial":
                return this.gettext("Incorrect username/password");
            case "wrong_type":
                return this.gettext('Unable to connect. Unexpected port function type on IVC host. Expecting type "LQ"');
            default:
                return "No message for connection status code '" + a + "'"
        }
    }, a.prototype.sipRegistrationStatusToMessage = function(a) {
        switch (a) {
            case -1:
                return this.gettext("Unknown connection state");
            case 0:
                return this.gettext("Unregistered");
            case 1:
                return this.gettext("Registering");
            case 2:
                return this.gettext("Unregistering");
            case 3:
                return this.gettext("Unable To Create Account");
            case 100:
                return this.gettext("Trying to contact the SIP server");
            case 200:
                return this.gettext("Online");
            case 401:
            case 403:
                return this.gettext("Invalid username/password");
            case 404:
                return this.gettext("User Not Found");
            case 408:
                return this.gettext("Request Timeout");
            case 502:
                return this.gettext("Bad gateway or proxy");
            default:
                return "No message for SIP registration code '" + a + "'"
        }
    }, a.prototype.fetchExternalDevices = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.externalDeviceResource.query(function(a) {
                return b(a)
            }, function(a) {
                return c(a)
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this._externalDevicesCache = null, this.$rootScope.$emit("live:externalDevices")
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                externalDevices: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    externalDevices: "start"
                }), a.updateAndNotify()
            }), b.on("live:externalDevices", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("externalDevicesService", ExternalDevicesService);
/**/
var GPIOService = function() {
    function a(a, b, c, d) {
        this.$q = b, this.$rootScope = c, this.socket = d, this.gpiCache = null, this.gpoCache = null, this.GPIOsUrl = "/api/1/devices/0/gpio", this.GPOUrl = "/api/1/devices/:deviceId/gpo/:gpoId/:action", this.GPOEventsUrl = "/api/1/devices/:deviceId/gpo/:gpoId/events/:eventId", this.GPIUrl = "/api/1/devices/:deviceId/gpi/:gpiId/:action", this.GPIEventsUrl = "/api/1/devices/:deviceId/gpi/:gpiId/events/:eventId", this.deferredPromises = {}, this.gpiInitialized = !1, this.gpoInitialized = !1, this.GPIOsResource = a(this.GPIOsUrl, {
            deviceId: "@deviceId"
        }), this.GPOsResource = a(this.GPOUrl, {
            deviceId: "@deviceId",
            gpoId: "@gpoId",
            action: "@action"
        }, {
            update: {
                method: "PUT"
            },
            addEvent: {
                method: "POST",
                params: {
                    action: "addEvent"
                }
            },
            removeEvent: {
                method: "DELETE"
            }
        }), this.GPIsResource = a(this.GPIUrl, {
            deviceId: "@deviceId",
            gpiId: "@gpiId",
            action: "@action"
        }, {
            update: {
                method: "PUT"
            },
            addEvent: {
                method: "POST",
                params: {
                    action: "addEvent"
                }
            },
            removeEvent: {
                method: "DELETE"
            }
        }), this.GPOEventResource = a(this.GPOEventsUrl, {
            deviceId: "@deviceId",
            gpoId: "@gpoId",
            eventId: "@eventId"
        }, {
            update: {
                method: "PUT"
            }
        }), this.GPIEventResource = a(this.GPIEventsUrl, {
            deviceId: "@deviceId",
            gpiId: "@gpiId",
            eventId: "@eventId"
        }, {
            update: {
                method: "PUT"
            }
        });
        var e = this.$q.defer();
        this.deferredPromises.GpiInit = e, this.gpiCache = e.promise;
        var f = this.$q.defer();
        this.deferredPromises.GpoInit = f, this.gpoCache = f.promise, this.socketListener()
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket"], a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:gpios", b);
        return a.$on("$destroy", c), c
    }, Object.defineProperty(a.prototype, "gpis", {
        get: function() {
            var a = this;
            return this.gpiCache || (this.gpiCache = this.fetchGPIOs(), this.gpiCache["catch"](function() {
                return a.gpiCache = null
            })), this.gpiCache
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(a.prototype, "gpos", {
        get: function() {
            var a = this;
            return this.gpoCache || (this.gpoCache = this.fetchGPIOs(), this.gpoCache["catch"](function() {
                return a.gpoCache = null
            })), this.gpoCache
        },
        enumerable: !0,
        configurable: !0
    }), a.prototype.fetchGPIOs = function() {
        var a = this;
        return this.$q(function(b, c) {
            a.GPIOsResource.query(function(a) {
                return b(a)
            }, function(a) {
                return c(a)
            })
        })
    }, a.prototype.updateGPI = function(a, b, c) {
        return this.GPIsResource.update({
            deviceId: a,
            gpiId: b
        }, c).$promise
    }, a.prototype.addGPIEvent = function(a, b, c) {
        var d = this;
        return this.$q(function(e, f) {
            d.GPIEventResource.save({
                deviceId: a,
                gpiId: b
            }, c, function(a) {
                return e(a)
            }, function(a) {
                return f(a)
            })
        })
    }, a.prototype.removeGPIEvent = function(a, b, c) {
        var d = this;
        return this.$q(function(e, f) {
            d.GPIEventResource["delete"]({
                deviceId: a,
                gpiId: b,
                eventId: c
            }, function(a) {
                return e(a)
            }, function(a) {
                return f(a)
            })
        })
    }, a.prototype.updateGPIEvent = function(a, b, c, d) {
        var e = this;
        return this.$q(function(f, g) {
            e.GPIEventResource.update({
                deviceId: a,
                gpiId: b,
                eventId: c
            }, d, function(a) {
                return f(a)
            }, function(a) {
                return g(a)
            })
        })
    }, a.prototype.updateGPO = function(a, b, c) {
        return this.GPOsResource.update({
            deviceId: a,
            gpoId: b
        }, c).$promise
    }, a.prototype.addGPOEvent = function(a, b, c) {
        var d = this;
        return this.$q(function(e, f) {
            d.GPOEventResource.save({
                deviceId: a,
                gpoId: b
            }, c, function(a) {
                return e(a)
            }, function(a) {
                return f(a)
            })
        })
    }, a.prototype.removeGPOEvent = function(a, b, c) {
        var d = this;
        return this.$q(function(e, f) {
            d.GPOEventResource["delete"]({
                deviceId: a,
                gpoId: b,
                eventId: c
            }, function(a) {
                return e(a)
            }, function(a) {
                return f(a)
            })
        })
    }, a.prototype.updateGPOEvent = function(a, b, c, d) {
        var e = this;
        return this.$q(function(f, g) {
            e.GPOEventResource.update({
                deviceId: a,
                gpoId: b,
                eventId: c
            }, d, function(a) {
                return f(a)
            }, function(a) {
                return g(a)
            })
        })
    }, a.prototype.GpoInitReply = function(a) {
        this.deferredPromises.GpoInit.resolve(a.result), this.$rootScope.$emit("live:gpios"), this.gpoInitialized = !0
    }, a.prototype.GpoUpdated = function(a) {
        var b = this;
        this.gpoInitialized && this.gpoCache.then(function(c) {
            var d = c.find(function(b) {
                return b.id === a.gpoId
            });
            CCUtils.setPropertyByPath(d, a.path, a.value), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.GpoEventAdded = function(a) {
        var b = this;
        this.gpoInitialized && this.gpoCache.then(function(c) {
            var d = c.find(function(b) {
                return b.id === a.gpoId
            });
            d.settings.events.push(a.value), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.GpoEventUpdated = function(a) {
        var b = this;
        this.gpoInitialized && this.gpoCache.then(function(c) {
            var d = c.find(function(b) {
                    return b.id === a.gpoId
                }),
                e = d.settings.events.find(function(b) {
                    return b.id === a.eventId
                });
            CCUtils.copyObjectPreserveRefs(a.value, e), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.GpoEventRemoved = function(a) {
        var b = this;
        this.gpoInitialized && this.gpoCache.then(function(c) {
            var d = c.find(function(b) {
                return b.id === a.gpoId
            });
            d.settings.events = d.settings.events.filter(function(b) {
                return b.id !== a.eventId
            }), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.GpiInitReply = function(a) {
        this.deferredPromises.GpiInit.resolve(a.result), this.$rootScope.$emit("live:gpios"), this.gpiInitialized = !0
    }, a.prototype.GpiUpdated = function(a) {
        var b = this;
        this.gpiInitialized && this.gpiCache.then(function(c) {
            var d = c.find(function(b) {
                return b.id === a.gpiId
            });
            CCUtils.setPropertyByPath(d, a.path, a.value), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.GpiEventAdded = function(a) {
        var b = this;
        this.gpiInitialized && this.gpiCache.then(function(c) {
            var d = c.find(function(b) {
                return b.id === a.gpiId
            });
            d.settings.events.push(a.value), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.GpiEventUpdated = function(a) {
        var b = this;
        this.gpiInitialized && this.gpiCache.then(function(c) {
            var d = c.find(function(b) {
                    return b.id === a.gpiId
                }),
                e = d.settings.events.find(function(b) {
                    return b.id === a.eventId
                });
            CCUtils.copyObjectPreserveRefs(a.value, e), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.GpiEventRemoved = function(a) {
        var b = this;
        this.gpiInitialized && this.gpiCache.then(function(c) {
            var d = c.find(function(b) {
                return b.id === a.gpiId
            });
            d.settings.events = d.settings.events.filter(function(b) {
                return b.id !== a.eventId
            }), b.$rootScope.$emit("live:gpios")
        })
    }, a.prototype.socketListener = function() {
        var a = this;
        this.socket().then(function(b) {
            b.on("GpiInit", function(b) {
                return a.GpiInitReply(b)
            }), b.on("GpiUpdated", function(b) {
                return a.GpiUpdated(b)
            }), b.on("GpiEventAdded", function(b) {
                return a.GpiEventAdded(b)
            }), b.on("GpiEventUpdated", function(b) {
                return a.GpiEventUpdated(b)
            }), b.on("GpiEventRemoved", function(b) {
                return a.GpiEventRemoved(b)
            }), b.emit("GpiInit", {}), b.on("GpoInit", function(b) {
                return a.GpoInitReply(b)
            }), b.on("GpoUpdated", function(b) {
                return a.GpoUpdated(b)
            }), b.on("GpoEventAdded", function(b) {
                return a.GpoEventAdded(b)
            }), b.on("GpoEventUpdated", function(b) {
                return a.GpoEventUpdated(b)
            }), b.on("GpoEventRemoved", function(b) {
                return a.GpoEventRemoved(b)
            }), b.emit("GpoInit", {}), b.on("reconnect", function() {
                b.emit("GpiInit", {}), b.emit("GpoInit", {})
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("gpioService", GPIOService);
/**/
var NetworkEventService = function() {
    function a(a, b) {
        this.$q = b, this.networkEventActionResourceUrl = "/api/1/devices/:deviceId/networkEvent/:networkEventId", this.NetworkEventActionResource = a(this.networkEventActionResourceUrl, {
            deviceId: "@deviceId",
            networkEventId: "@networkEventId"
        }, {
            update: {
                method: "PUT"
            }
        })
    }
    return a.$inject = ["$resource", "$q"], a.prototype.updateNetworkEvent = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.NetworkEventActionResource.update({
                deviceId: a,
                networkEventId: b.id
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.addNetworkEvent = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.NetworkEventActionResource.save({
                deviceId: a
            }, b, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a.prototype.removeNetworkEvent = function(a, b) {
        var c = this;
        return this.$q(function(d, e) {
            c.NetworkEventActionResource["delete"]({
                deviceId: a,
                networkEventId: b
            }, function(a) {
                return d(a)
            }, function(a) {
                return e(a)
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("networkEventService", NetworkEventService);
/**/
var EventLogService = function() {
    function a(a, b, c, d) {
        var e = this;
        this.$q = b, this.$rootScope = c, this.socket = d, this.eventLogUrl = "/api/1/events/:entityId", this.eventLogCache = null, this.exportAllEventLogUrl = "/api/1/events/export/:entityId", this.exportAllEventLogCache = null, this.eventLogResource = a(this.eventLogUrl, {
            entityId: "@entityId"
        }), this.eventLogCache = b(function(a, b) {
            e.subscribeToSocket(), e.fetchEventLogEnteries().then(function(b) {
                return a(b)
            })["catch"](function(a) {
                return b(a)
            })
        }), this.exportAllEventLogResource = a(this.exportAllEventLogUrl, {
            entityId: "@entityId"
        }), this.exportAllEventLogCache = b(function(a, b) {
            e.subscribeToSocket(), e.fetchAllEventLogEnteries().then(function(b) {
                return a(b)
            })["catch"](function(a) {
                return b(a)
            })
        })
    }
    return a.$inject = ["$resource", "$q", "$rootScope", "socket"], a.prototype.getEventLog = function(a) {
        var b = this;
        return this.eventLogCache = this.fetchEventLogEnteries(a), this.eventLogCache["catch"](function() {
            return b.eventLogCache = null
        }), this.eventLogCache
    }, a.prototype.exportAllEventLog = function(a) {
        var b = this;
        return this.exportAllEventLogCache = this.fetchAllEventLogEnteries(a), this.exportAllEventLogCache["catch"](function() {
            return b.exportAllEventLogCache = null
        }), this.exportAllEventLogCache
    }, a.prototype.purgeEventLog = function(a) {
        var b = this.$q.defer();
        return this.eventLogResource["delete"]({
            entityId: a
        }, function(a) {
            b.resolve(a)
        }, function(a) {
            b.reject("err")
        }), b.promise
    }, a.prototype.subscribe = function(a, b) {
        var c = this.$rootScope.$on("live:eventLog", b);
        return a.$on("$destroy", c), c
    }, a.prototype.subscribeToSocket = function() {
        var a = this;
        this.socket().then(function(b) {
            b.emit("live:update", {
                eventLog: "start"
            }), b.on("reconnect", function() {
                b.emit("live:update", {
                    eventLog: "start"
                }), a.updateAndNotify()
            }), b.on("live:eventLog", function(b) {
                b && b.updated && a.updateAndNotify()
            })
        })
    }, a.prototype.updateAndNotify = function() {
        this.eventLogCache = null, this.exportAllEventLogCache = null, this.$rootScope.$emit("live:eventLog")
    }, a.prototype.fetchEventLogEnteries = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.eventLogResource.get(a, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a.prototype.fetchAllEventLogEnteries = function(a) {
        var b = this;
        return this.$q(function(c, d) {
            b.exportAllEventLogResource.get(a, function(a) {
                return c(a)
            }, function(a) {
                return d(a)
            })
        })
    }, a
}();
/**/
angular.module("moonraker").service("eventLogService", EventLogService), angular.module("moonraker").directive("ngBlur", ["$parse", function(a) {
    return function(b, c, d) {
        var e = a(d.ngBlur);
        c.bind("blur", function(a) {
            b.$apply(function() {
                e(b, {
                    $event: a
                })
            })
        })
    }
}]), angular.module("moonraker").directive("ngFocus", ["$timeout", function(a) {
    return function(b, c, d) {
        b.$watch(d.ngFocus, function(b) {
            b && a(function() {
                c[0].focus()
            }, 0, !1)
        })
    }
}]), angular.module("moonraker").directive("ngEnter", function() {
    return function(a, b, c) {
        b.bind("keydown keypress", function(b) {
            13 === b.which && (a.$apply(function() {
                a.$eval(c.ngEnter)
            }), b.preventDefault())
        })
    }
}), angular.module("moonraker").filter("range", function() {
    return function(a, b) {
        b = parseInt(b);
        for (var c = 0; c < b; c++) a.push(c);
        return a
    }
}), angular.module("moonraker").filter("orderObjectBy", function() {
    return function(a, b) {
        if (!angular.isObject(a)) return a;
        var c = [];
        for (var d in a) c.push(a[d]);
        return angular.isFunction(b) ? c.sort(b) : c.sort(function(a, c) {
            return a[b] - c[b]
        }), c
    }
}), angular.module("moonraker").filter("keyLength", function() {
    return function(a) {
        if (null == a) return a;
        if (!angular.isObject(a)) throw Error("Usage of non-objects with keylength filter!!");
        return Object.keys(a).length
    }
}), angular.module("moonraker").filter("dateBetween", function() {
    return function(a, b, c, d, e) {
        if (!angular.isArray(a)) return a;
        var f = [],
            g = new Date(0);
        b && (g = b);
        var h = new Date;
        return c && (h = c), a.forEach(function(a) {
            a[d].getTime() <= h.getTime() && a[d].getTime() >= g.getTime() && f.push(a)
        }), f
    }
});
/**/