var fabric = fabric || {
    version: "1.7.22"
};
"undefined" != typeof exports && (exports.fabric = fabric), "undefined" != typeof document && "undefined" != typeof window ? (fabric.document = document, fabric.window = window, window.fabric = fabric) : (fabric.document = require("jsdom").jsdom(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E")), fabric.document.createWindow ? fabric.window = fabric.document.createWindow() : fabric.window = fabric.document.parentWindow), fabric.isTouchSupported = "ontouchstart" in fabric.window, fabric.isLikelyNode = "undefined" != typeof Buffer && "undefined" == typeof window, fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id"], fabric.DPI = 96, fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)", fabric.fontPaths = {}, fabric.iMatrix = [1, 0, 0, 1, 0, 0], fabric.canvasModule = "canvas", fabric.perfLimitSizeTotal = 2097152, fabric.maxCacheSideLimit = 4096, fabric.minCacheSideLimit = 256, fabric.charWidthsCache = {}, fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1,
    function() {
        function t(t, e) {
            if(this.__eventListeners[t]) {
                var i = this.__eventListeners[t];
                e ? i[i.indexOf(e)] = !1 : fabric.util.array.fill(i, !1)
            }
        }

        function e(t, e) {
            if(this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length)
                for(var i in t) this.on(i, t[i]);
            else this.__eventListeners[t] || (this.__eventListeners[t] = []), this.__eventListeners[t].push(e);
            return this
        }

        function i(e, i) {
            if(this.__eventListeners) {
                if(0 === arguments.length)
                    for(e in this.__eventListeners) t.call(this, e);
                else if(1 === arguments.length && "object" == typeof arguments[0])
                    for(var r in e) t.call(this, r, e[r]);
                else t.call(this, e, i);
                return this
            }
        }

        function r(t, e) {
            if(this.__eventListeners) {
                var i = this.__eventListeners[t];
                if(i) {
                    for(var r = 0, n = i.length; r < n; r++) i[r] && i[r].call(this, e || {});
                    return this.__eventListeners[t] = i.filter(function(t) {
                        return !1 !== t
                    }), this
                }
            }
        }
        fabric.Observable = {
            observe: e,
            stopObserving: i,
            fire: r,
            on: e,
            off: i,
            trigger: r
        }
    }(), fabric.Collection = {
        _objects: [],
        add: function() {
            if(this._objects.push.apply(this._objects, arguments), this._onObjectAdded)
                for(var t = 0, e = arguments.length; t < e; t++) this._onObjectAdded(arguments[t]);
            return this.renderOnAddRemove && this.renderAll(), this
        },
        insertAt: function(t, e, i) {
            var r = this.getObjects();
            return i ? r[e] = t : r.splice(e, 0, t), this._onObjectAdded && this._onObjectAdded(t), this.renderOnAddRemove && this.renderAll(), this
        },
        remove: function() {
            for(var t, e = this.getObjects(), i = !1, r = 0, n = arguments.length; r < n; r++) - 1 !== (t = e.indexOf(arguments[r])) && (i = !0, e.splice(t, 1), this._onObjectRemoved && this._onObjectRemoved(arguments[r]));
            return this.renderOnAddRemove && i && this.renderAll(), this
        },
        forEachObject: function(t, e) {
            for(var i = this.getObjects(), r = 0, n = i.length; r < n; r++) t.call(e, i[r], r, i);
            return this
        },
        getObjects: function(t) {
            return void 0 === t ? this._objects : this._objects.filter(function(e) {
                return e.type === t
            })
        },
        item: function(t) {
            return this.getObjects()[t]
        },
        isEmpty: function() {
            return 0 === this.getObjects().length
        },
        size: function() {
            return this.getObjects().length
        },
        contains: function(t) {
            return this.getObjects().indexOf(t) > -1
        },
        complexity: function() {
            return this.getObjects().reduce(function(t, e) {
                return t += e.complexity ? e.complexity() : 0
            }, 0)
        }
    }, fabric.CommonMethods = {
        _setOptions: function(t) {
            for(var e in t) this.set(e, t[e])
        },
        _initGradient: function(t, e) {
            !t || !t.colorStops || t instanceof fabric.Gradient || this.set(e, new fabric.Gradient(t))
        },
        _initPattern: function(t, e, i) {
            !t || !t.source || t instanceof fabric.Pattern ? i && i() : this.set(e, new fabric.Pattern(t, i))
        },
        _initClipping: function(t) {
            if(t.clipTo && "string" == typeof t.clipTo) {
                var e = fabric.util.getFunctionBody(t.clipTo);
                void 0 !== e && (this.clipTo = new Function("ctx", e))
            }
        },
        _setObject: function(t) {
            for(var e in t) this._set(e, t[e])
        },
        set: function(t, e) {
            return "object" == typeof t ? this._setObject(t) : "function" == typeof e && "clipTo" !== t ? this._set(t, e(this.get(t))) : this._set(t, e), this
        },
        _set: function(t, e) {
            this[t] = e
        },
        toggle: function(t) {
            var e = this.get(t);
            return "boolean" == typeof e && this.set(t, !e), this
        },
        get: function(t) {
            return this[t]
        }
    },
    function(t) {
        var e = Math.sqrt,
            i = Math.atan2,
            r = Math.pow,
            n = Math.abs,
            s = Math.PI / 180;
        fabric.util = {
            removeFromArray: function(t, e) {
                var i = t.indexOf(e);
                return -1 !== i && t.splice(i, 1), t
            },
            getRandomInt: function(t, e) {
                return Math.floor(Math.random() * (e - t + 1)) + t
            },
            degreesToRadians: function(t) {
                return t * s
            },
            radiansToDegrees: function(t) {
                return t / s
            },
            rotatePoint: function(t, e, i) {
                t.subtractEquals(e);
                var r = fabric.util.rotateVector(t, i);
                return new fabric.Point(r.x, r.y).addEquals(e)
            },
            rotateVector: function(t, e) {
                var i = Math.sin(e),
                    r = Math.cos(e);
                return {
                    x: t.x * r - t.y * i,
                    y: t.x * i + t.y * r
                }
            },
            transformPoint: function(t, e, i) {
                return i ? new fabric.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y) : new fabric.Point(e[0] * t.x + e[2] * t.y + e[4], e[1] * t.x + e[3] * t.y + e[5])
            },
            makeBoundingBoxFromPoints: function(t) {
                var e = [t[0].x, t[1].x, t[2].x, t[3].x],
                    i = fabric.util.array.min(e),
                    r = fabric.util.array.max(e),
                    n = Math.abs(i - r),
                    s = [t[0].y, t[1].y, t[2].y, t[3].y],
                    o = fabric.util.array.min(s),
                    a = fabric.util.array.max(s);
                return {
                    left: i,
                    top: o,
                    width: n,
                    height: Math.abs(o - a)
                }
            },
            invertTransform: function(t) {
                var e = 1 / (t[0] * t[3] - t[1] * t[2]),
                    i = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
                    r = fabric.util.transformPoint({
                        x: t[4],
                        y: t[5]
                    }, i, !0);
                return i[4] = -r.x, i[5] = -r.y, i
            },
            toFixed: function(t, e) {
                return parseFloat(Number(t).toFixed(e))
            },
            parseUnit: function(t, e) {
                var i = /\D{0,2}$/.exec(t),
                    r = parseFloat(t);
                switch(e || (e = fabric.Text.DEFAULT_SVG_FONT_SIZE), i[0]) {
                    case "mm":
                        return r * fabric.DPI / 25.4;
                    case "cm":
                        return r * fabric.DPI / 2.54;
                    case "in":
                        return r * fabric.DPI;
                    case "pt":
                        return r * fabric.DPI / 72;
                    case "pc":
                        return r * fabric.DPI / 72 * 12;
                    case "em":
                        return r * e;
                    default:
                        return r
                }
            },
            falseFunction: function() {
                return !1
            },
            getKlass: function(t, e) {
                return t = fabric.util.string.camelize(t.charAt(0).toUpperCase() + t.slice(1)), fabric.util.resolveNamespace(e)[t]
            },
            resolveNamespace: function(e) {
                if(!e) return fabric;
                var i, r = e.split("."),
                    n = r.length,
                    s = t || fabric.window;
                for(i = 0; i < n; ++i) s = s[r[i]];
                return s
            },
            loadImage: function(t, e, i, r) {
                if(t) {
                    var n = fabric.util.createImage();
                    n.onload = function() {
                        e && e.call(i, n), n = n.onload = n.onerror = null
                    }, n.onerror = function() {
                        fabric.log("Error loading " + n.src), e && e.call(i, null, !0), n = n.onload = n.onerror = null
                    }, 0 !== t.indexOf("data") && r && (n.crossOrigin = r), n.src = t
                } else e && e.call(i, t)
            },
            enlivenObjects: function(t, e, i, r) {
                function n() {
                    ++o === a && e && e(s)
                }
                var s = [],
                    o = 0,
                    a = (t = t || []).length;
                a ? t.forEach(function(t, e) {
                    if(t && t.type) {
                        fabric.util.getKlass(t.type, i).fromObject(t, function(i, o) {
                            o || (s[e] = i), r && r(t, i, o), n()
                        }, !0)
                    } else n()
                }) : e && e(s)
            },
            enlivenPatterns: function(t, e) {
                function i() {
                    ++n === s && e && e(r)
                }
                var r = [],
                    n = 0,
                    s = (t = t || []).length;
                s ? t.forEach(function(t, e) {
                    t && t.source ? new fabric.Pattern(t, function(t) {
                        r[e] = t, i()
                    }) : (r[e] = t, i())
                }) : e && e(r)
            },
            groupSVGElements: function(t, e, i) {
                var r;
                return r = new fabric.PathGroup(t, e), void 0 !== i && (r.sourcePath = i), r
            },
            populateWithProperties: function(t, e, i) {
                if(i && "[object Array]" === Object.prototype.toString.call(i))
                    for(var r = 0, n = i.length; r < n; r++) i[r] in t && (e[i[r]] = t[i[r]])
            },
            drawDashedLine: function(t, r, n, s, o, a) {
                var h = s - r,
                    c = o - n,
                    l = e(h * h + c * c),
                    u = i(c, h),
                    f = a.length,
                    d = 0,
                    g = !0;
                for(t.save(), t.translate(r, n), t.moveTo(0, 0), t.rotate(u), r = 0; l > r;)(r += a[d++ % f]) > l && (r = l), t[g ? "lineTo" : "moveTo"](r, 0), g = !g;
                t.restore()
            },
            createCanvasElement: function(t) {
                return t || (t = fabric.document.createElement("canvas")), t.getContext || "undefined" == typeof G_vmlCanvasManager || G_vmlCanvasManager.initElement(t), t
            },
            createImage: function() {
                return fabric.isLikelyNode ? new(require("canvas").Image) : fabric.document.createElement("img")
            },
            createAccessors: function(t) {
                var e, i, r, n, s, o = t.prototype;
                for(e = o.stateProperties.length; e--;) n = "set" + (r = (i = o.stateProperties[e]).charAt(0).toUpperCase() + i.slice(1)), o[s = "get" + r] || (o[s] = function(t) {
                    return new Function('return this.get("' + t + '")')
                }(i)), o[n] || (o[n] = function(t) {
                    return new Function("value", 'return this.set("' + t + '", value)')
                }(i))
            },
            clipContext: function(t, e) {
                e.save(), e.beginPath(), t.clipTo(e), e.clip()
            },
            multiplyTransformMatrices: function(t, e, i) {
                return [t[0] * e[0] + t[2] * e[1], t[1] * e[0] + t[3] * e[1], t[0] * e[2] + t[2] * e[3], t[1] * e[2] + t[3] * e[3], i ? 0 : t[0] * e[4] + t[2] * e[5] + t[4], i ? 0 : t[1] * e[4] + t[3] * e[5] + t[5]]
            },
            qrDecompose: function(t) {
                var n = i(t[1], t[0]),
                    o = r(t[0], 2) + r(t[1], 2),
                    a = e(o),
                    h = (t[0] * t[3] - t[2] * t[1]) / a,
                    c = i(t[0] * t[2] + t[1] * t[3], o);
                return {
                    angle: n / s,
                    scaleX: a,
                    scaleY: h,
                    skewX: c / s,
                    skewY: 0,
                    translateX: t[4],
                    translateY: t[5]
                }
            },
            customTransformMatrix: function(t, e, i) {
                var r = [1, 0, n(Math.tan(i * s)), 1],
                    o = [n(t), 0, 0, n(e)];
                return fabric.util.multiplyTransformMatrices(o, r, !0)
            },
            resetObjectTransform: function(t) {
                t.scaleX = 1, t.scaleY = 1, t.skewX = 0, t.skewY = 0, t.flipX = !1, t.flipY = !1, t.setAngle(0)
            },
            getFunctionBody: function(t) {
                return(String(t).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
            },
            isTransparent: function(t, e, i, r) {
                r > 0 && (e > r ? e -= r : e = 0, i > r ? i -= r : i = 0);
                var n, s, o = !0,
                    a = t.getImageData(e, i, 2 * r || 1, 2 * r || 1),
                    h = a.data.length;
                for(n = 3; n < h && (s = a.data[n], !1 !== (o = s <= 0)); n += 4);
                return a = null, o
            },
            parsePreserveAspectRatioAttribute: function(t) {
                var e, i = "meet",
                    r = "Mid",
                    n = "Mid",
                    s = t.split(" ");
                return s && s.length && ("meet" !== (i = s.pop()) && "slice" !== i ? (e = i, i = "meet") : s.length && (e = s.pop())), r = "none" !== e ? e.slice(1, 4) : "none", n = "none" !== e ? e.slice(5, 8) : "none", {
                    meetOrSlice: i,
                    alignX: r,
                    alignY: n
                }
            },
            clearFabricFontCache: function(t) {
                t ? fabric.charWidthsCache[t] && delete fabric.charWidthsCache[t] : fabric.charWidthsCache = {}
            },
            limitDimsByArea: function(t, e) {
                var i = Math.sqrt(e * t),
                    r = Math.floor(e / i);
                return {
                    x: Math.floor(i),
                    y: r
                }
            },
            capValue: function(t, e, i) {
                return Math.max(t, Math.min(e, i))
            }
        }
    }("undefined" != typeof exports ? exports : this),
    function() {
        function t(t, i, s, a, h, c, l) {
            var u = o.call(arguments);
            if(r[u]) return r[u];
            var f = Math.PI,
                d = l * f / 180,
                g = Math.sin(d),
                p = Math.cos(d),
                v = 0,
                b = 0,
                m = -p * t * .5 - g * i * .5,
                _ = -p * i * .5 + g * t * .5,
                y = (s = Math.abs(s)) * s,
                x = (a = Math.abs(a)) * a,
                C = _ * _,
                S = m * m,
                w = y * x - y * C - x * S,
                O = 0;
            if(w < 0) {
                var T = Math.sqrt(1 - w / (y * x));
                s *= T, a *= T
            } else O = (h === c ? -1 : 1) * Math.sqrt(w / (y * C + x * S));
            var j = O * s * _ / a,
                k = -O * a * m / s,
                M = p * j - g * k + .5 * t,
                D = g * j + p * k + .5 * i,
                A = e(1, 0, (m - j) / s, (_ - k) / a),
                P = e((m - j) / s, (_ - k) / a, (-m - j) / s, (-_ - k) / a);
            0 === c && P > 0 ? P -= 2 * f : 1 === c && P < 0 && (P += 2 * f);
            for(var E = Math.ceil(Math.abs(P / f * 2)), I = [], L = P / E, F = 8 / 3 * Math.sin(L / 4) * Math.sin(L / 4) / Math.sin(L / 2), B = A + L, R = 0; R < E; R++) I[R] = function(t, e, i, r, s, a, h, c, l, u, f) {
                var d = o.call(arguments);
                if(n[d]) return n[d];
                var g = Math.cos(t),
                    p = Math.sin(t),
                    v = Math.cos(e),
                    b = Math.sin(e),
                    m = i * s * v - r * a * b + h,
                    _ = r * s * v + i * a * b + c,
                    y = u + l * (-i * s * p - r * a * g),
                    x = f + l * (-r * s * p + i * a * g),
                    C = m + l * (i * s * b + r * a * v),
                    S = _ + l * (r * s * b - i * a * v);
                return n[d] = [y, x, C, S, m, _], n[d]
            }(A, B, p, g, s, a, M, D, F, v, b), v = I[R][4], b = I[R][5], A = B, B += L;
            return r[u] = I, I
        }

        function e(t, e, i, r) {
            var n = Math.atan2(e, t),
                s = Math.atan2(r, i);
            return s >= n ? s - n : 2 * Math.PI - (n - s)
        }

        function i(t, e, i, r, n, a, h, c) {
            var l = o.call(arguments);
            if(s[l]) return s[l];
            var u, f, d, g, p, v, b, m, _ = Math.sqrt,
                y = Math.min,
                x = Math.max,
                C = Math.abs,
                S = [],
                w = [
                    [],
                    []
                ];
            f = 6 * t - 12 * i + 6 * n, u = -3 * t + 9 * i - 9 * n + 3 * h, d = 3 * i - 3 * t;
            for(var O = 0; O < 2; ++O)
                if(O > 0 && (f = 6 * e - 12 * r + 6 * a, u = -3 * e + 9 * r - 9 * a + 3 * c, d = 3 * r - 3 * e), C(u) < 1e-12) {
                    if(C(f) < 1e-12) continue;
                    0 < (g = -d / f) && g < 1 && S.push(g)
                } else(b = f * f - 4 * d * u) < 0 || (0 < (p = (-f + (m = _(b))) / (2 * u)) && p < 1 && S.push(p), 0 < (v = (-f - m) / (2 * u)) && v < 1 && S.push(v));
            for(var T, j, k, M = S.length, D = M; M--;) T = (k = 1 - (g = S[M])) * k * k * t + 3 * k * k * g * i + 3 * k * g * g * n + g * g * g * h, w[0][M] = T, j = k * k * k * e + 3 * k * k * g * r + 3 * k * g * g * a + g * g * g * c, w[1][M] = j;
            w[0][D] = t, w[1][D] = e, w[0][D + 1] = h, w[1][D + 1] = c;
            var A = [{
                x: y.apply(null, w[0]),
                y: y.apply(null, w[1])
            }, {
                x: x.apply(null, w[0]),
                y: x.apply(null, w[1])
            }];
            return s[l] = A, A
        }
        var r = {},
            n = {},
            s = {},
            o = Array.prototype.join;
        fabric.util.drawArc = function(e, i, r, n) {
            for(var s = n[0], o = n[1], a = n[2], h = n[3], c = n[4], l = [
                    [],
                    [],
                    [],
                    []
                ], u = t(n[5] - i, n[6] - r, s, o, h, c, a), f = 0, d = u.length; f < d; f++) l[f][0] = u[f][0] + i, l[f][1] = u[f][1] + r, l[f][2] = u[f][2] + i, l[f][3] = u[f][3] + r, l[f][4] = u[f][4] + i, l[f][5] = u[f][5] + r, e.bezierCurveTo.apply(e, l[f])
        }, fabric.util.getBoundsOfArc = function(e, r, n, s, o, a, h, c, l) {
            for(var u, f = 0, d = 0, g = [], p = t(c - e, l - r, n, s, a, h, o), v = 0, b = p.length; v < b; v++) u = i(f, d, p[v][0], p[v][1], p[v][2], p[v][3], p[v][4], p[v][5]), g.push({
                x: u[0].x + e,
                y: u[0].y + r
            }), g.push({
                x: u[1].x + e,
                y: u[1].y + r
            }), f = p[v][4], d = p[v][5];
            return g
        }, fabric.util.getBoundsOfCurve = i
    }(),
    function() {
        function t(t, e, i) {
            if(t && 0 !== t.length) {
                var r = t.length - 1,
                    n = e ? t[r][e] : t[r];
                if(e)
                    for(; r--;) i(t[r][e], n) && (n = t[r][e]);
                else
                    for(; r--;) i(t[r], n) && (n = t[r]);
                return n
            }
        }
        var e = Array.prototype.slice;
        Array.prototype.indexOf || (Array.prototype.indexOf = function(t) {
            if(void 0 === this || null === this) throw new TypeError;
            var e = Object(this),
                i = e.length >>> 0;
            if(0 === i) return -1;
            var r = 0;
            if(arguments.length > 0 && ((r = Number(arguments[1])) != r ? r = 0 : 0 !== r && r !== Number.POSITIVE_INFINITY && r !== Number.NEGATIVE_INFINITY && (r = (r > 0 || -1) * Math.floor(Math.abs(r)))), r >= i) return -1;
            for(var n = r >= 0 ? r : Math.max(i - Math.abs(r), 0); n < i; n++)
                if(n in e && e[n] === t) return n;
            return -1
        }), Array.prototype.forEach || (Array.prototype.forEach = function(t, e) {
            for(var i = 0, r = this.length >>> 0; i < r; i++) i in this && t.call(e, this[i], i, this)
        }), Array.prototype.map || (Array.prototype.map = function(t, e) {
            for(var i = [], r = 0, n = this.length >>> 0; r < n; r++) r in this && (i[r] = t.call(e, this[r], r, this));
            return i
        }), Array.prototype.every || (Array.prototype.every = function(t, e) {
            for(var i = 0, r = this.length >>> 0; i < r; i++)
                if(i in this && !t.call(e, this[i], i, this)) return !1;
            return !0
        }), Array.prototype.some || (Array.prototype.some = function(t, e) {
            for(var i = 0, r = this.length >>> 0; i < r; i++)
                if(i in this && t.call(e, this[i], i, this)) return !0;
            return !1
        }), Array.prototype.filter || (Array.prototype.filter = function(t, e) {
            for(var i, r = [], n = 0, s = this.length >>> 0; n < s; n++) n in this && (i = this[n], t.call(e, i, n, this) && r.push(i));
            return r
        }), Array.prototype.reduce || (Array.prototype.reduce = function(t) {
            var e, i = this.length >>> 0,
                r = 0;
            if(arguments.length > 1) e = arguments[1];
            else
                for(;;) {
                    if(r in this) {
                        e = this[r++];
                        break
                    }
                    if(++r >= i) throw new TypeError
                }
            for(; r < i; r++) r in this && (e = t.call(null, e, this[r], r, this));
            return e
        }), fabric.util.array = {
            fill: function(t, e) {
                for(var i = t.length; i--;) t[i] = e;
                return t
            },
            invoke: function(t, i) {
                for(var r = e.call(arguments, 2), n = [], s = 0, o = t.length; s < o; s++) n[s] = r.length ? t[s][i].apply(t[s], r) : t[s][i].call(t[s]);
                return n
            },
            min: function(e, i) {
                return t(e, i, function(t, e) {
                    return t < e
                })
            },
            max: function(e, i) {
                return t(e, i, function(t, e) {
                    return t >= e
                })
            }
        }
    }(),
    function() {
        function t(e, i, r) {
            if(r)
                if(!fabric.isLikelyNode && i instanceof Element) e = i;
                else if(i instanceof Array) {
                e = [];
                for(var n = 0, s = i.length; n < s; n++) e[n] = t({}, i[n], r)
            } else if(i && "object" == typeof i)
                for(var o in i) i.hasOwnProperty(o) && (e[o] = t({}, i[o], r));
            else e = i;
            else
                for(var o in i) e[o] = i[o];
            return e
        }
        fabric.util.object = {
            extend: t,
            clone: function(e, i) {
                return t({}, e, i)
            }
        }
    }(),
    function() {
        String.prototype.trim || (String.prototype.trim = function() {
            return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")
        }), fabric.util.string = {
            camelize: function(t) {
                return t.replace(/-+(.)?/g, function(t, e) {
                    return e ? e.toUpperCase() : ""
                })
            },
            capitalize: function(t, e) {
                return t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase())
            },
            escapeXml: function(t) {
                return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }
        }
    }(),
    function() {
        var t = Array.prototype.slice,
            e = Function.prototype.apply,
            i = function() {};
        Function.prototype.bind || (Function.prototype.bind = function(r) {
            var n, s = this,
                o = t.call(arguments, 1);
            return n = o.length ? function() {
                return e.call(s, this instanceof i ? this : r, o.concat(t.call(arguments)))
            } : function() {
                return e.call(s, this instanceof i ? this : r, arguments)
            }, i.prototype = this.prototype, n.prototype = new i, n
        })
    }(),
    function() {
        function t() {}

        function e(t) {
            for(var e = null, r = this; r.constructor.superclass;) {
                var n = r.constructor.superclass.prototype[t];
                if(r[t] !== n) {
                    e = n;
                    break
                }
                r = r.constructor.superclass.prototype
            }
            return e ? arguments.length > 1 ? e.apply(this, i.call(arguments, 1)) : e.call(this) : console.log("tried to callSuper " + t + ", method not found in prototype chain", this)
        }
        var i = Array.prototype.slice,
            r = function() {},
            n = function() {
                for(var t in {
                        toString: 1
                    })
                    if("toString" === t) return !1;
                return !0
            }(),
            s = function(t, e, i) {
                for(var r in e) r in t.prototype && "function" == typeof t.prototype[r] && (e[r] + "").indexOf("callSuper") > -1 ? t.prototype[r] = function(t) {
                    return function() {
                        var r = this.constructor.superclass;
                        this.constructor.superclass = i;
                        var n = e[t].apply(this, arguments);
                        if(this.constructor.superclass = r, "initialize" !== t) return n
                    }
                }(r) : t.prototype[r] = e[r], n && (e.toString !== Object.prototype.toString && (t.prototype.toString = e.toString), e.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = e.valueOf))
            };
        fabric.util.createClass = function() {
            function n() {
                this.initialize.apply(this, arguments)
            }
            var o = null,
                a = i.call(arguments, 0);
            "function" == typeof a[0] && (o = a.shift()), n.superclass = o, n.subclasses = [], o && (t.prototype = o.prototype, n.prototype = new t, o.subclasses.push(n));
            for(var h = 0, c = a.length; h < c; h++) s(n, a[h], o);
            return n.prototype.initialize || (n.prototype.initialize = r), n.prototype.constructor = n, n.prototype.callSuper = e, n
        }
    }(),
    function() {
        function t(t) {
            var e, i, r = Array.prototype.slice.call(arguments, 1),
                n = r.length;
            for(i = 0; i < n; i++)
                if(e = typeof t[r[i]], !/^(?:function|object|unknown)$/.test(e)) return !1;
            return !0
        }

        function e(t, e) {
            return {
                handler: e,
                wrappedHandler: function(t, e) {
                    return function(i) {
                        e.call(r(t), i || fabric.window.event)
                    }
                }(t, e)
            }
        }

        function i(t, e, i) {
            var r = "touchend" === t.type ? "changedTouches" : "touches";
            return t[r] && t[r][0] ? t[r][0][e] - (t[r][0][e] - t[r][0][i]) || t[i] : t[i]
        }
        var r, n, s = "unknown",
            o = function() {
                var t = 0;
                return function(e) {
                    return e.__uniqueID || (e.__uniqueID = "uniqueID__" + t++)
                }
            }();
        ! function() {
            var t = {};
            r = function(e) {
                return t[e]
            }, n = function(e, i) {
                t[e] = i
            }
        }();
        var a, h, c = t(fabric.document.documentElement, "addEventListener", "removeEventListener") && t(fabric.window, "addEventListener", "removeEventListener"),
            l = t(fabric.document.documentElement, "attachEvent", "detachEvent") && t(fabric.window, "attachEvent", "detachEvent"),
            u = {},
            f = {};
        c ? (a = function(t, e, i, r) {
            t && t.addEventListener(e, i, !l && r)
        }, h = function(t, e, i, r) {
            t && t.removeEventListener(e, i, !l && r)
        }) : l ? (a = function(t, i, r) {
            if(t) {
                var s = o(t);
                n(s, t), u[s] || (u[s] = {}), u[s][i] || (u[s][i] = []);
                var a = e(s, r);
                u[s][i].push(a), t.attachEvent("on" + i, a.wrappedHandler)
            }
        }, h = function(t, e, i) {
            if(t) {
                var r, n = o(t);
                if(u[n] && u[n][e])
                    for(var s = 0, a = u[n][e].length; s < a; s++)(r = u[n][e][s]) && r.handler === i && (t.detachEvent("on" + e, r.wrappedHandler), u[n][e][s] = null)
            }
        }) : (a = function(t, e, i) {
            if(t) {
                var r = o(t);
                if(f[r] || (f[r] = {}), !f[r][e]) {
                    f[r][e] = [];
                    var n = t["on" + e];
                    n && f[r][e].push(n), t["on" + e] = function(t, e) {
                        return function(i) {
                            if(f[t] && f[t][e])
                                for(var r = f[t][e], n = 0, s = r.length; n < s; n++) r[n].call(this, i || fabric.window.event)
                        }
                    }(r, e)
                }
                f[r][e].push(i)
            }
        }, h = function(t, e, i) {
            if(t) {
                var r = o(t);
                if(f[r] && f[r][e])
                    for(var n = f[r][e], s = 0, a = n.length; s < a; s++) n[s] === i && n.splice(s, 1)
            }
        }), fabric.util.addListener = a, fabric.util.removeListener = h;
        var d = function(t) {
                return typeof t.clientX !== s ? t.clientX : 0
            },
            g = function(t) {
                return typeof t.clientY !== s ? t.clientY : 0
            };
        fabric.isTouchSupported && (d = function(t) {
            return i(t, "pageX", "clientX")
        }, g = function(t) {
            return i(t, "pageY", "clientY")
        }), fabric.util.getPointer = function(t) {
            t || (t = fabric.window.event);
            var e = t.target || (typeof t.srcElement !== s ? t.srcElement : null),
                i = fabric.util.getScrollLeftTop(e);
            return {
                x: d(t) + i.left,
                y: g(t) + i.top
            }
        }, fabric.util.object.extend(fabric.util, fabric.Observable)
    }(),
    function() {
        var t = fabric.document.createElement("div"),
            e = "string" == typeof t.style.opacity,
            i = "string" == typeof t.style.filter,
            r = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
            n = function(t) {
                return t
            };
        e ? n = function(t, e) {
            return t.style.opacity = e, t
        } : i && (n = function(t, e) {
            var i = t.style;
            return t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1), r.test(i.filter) ? (e = e >= .9999 ? "" : "alpha(opacity=" + 100 * e + ")", i.filter = i.filter.replace(r, e)) : i.filter += " alpha(opacity=" + 100 * e + ")", t
        }), fabric.util.setStyle = function(t, e) {
            var i = t.style;
            if(!i) return t;
            if("string" == typeof e) return t.style.cssText += ";" + e, e.indexOf("opacity") > -1 ? n(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t;
            for(var r in e) "opacity" === r ? n(t, e[r]) : i["float" === r || "cssFloat" === r ? void 0 === i.styleFloat ? "cssFloat" : "styleFloat" : r] = e[r];
            return t
        }
    }(),
    function() {
        function t(t, e) {
            var i = fabric.document.createElement(t);
            for(var r in e) "class" === r ? i.className = e[r] : "for" === r ? i.htmlFor = e[r] : i.setAttribute(r, e[r]);
            return i
        }

        function e(t) {
            for(var e = 0, i = 0, r = fabric.document.documentElement, n = fabric.document.body || {
                    scrollLeft: 0,
                    scrollTop: 0
                }; t && (t.parentNode || t.host) && ((t = t.parentNode || t.host) === fabric.document ? (e = n.scrollLeft || r.scrollLeft || 0, i = n.scrollTop || r.scrollTop || 0) : (e += t.scrollLeft || 0, i += t.scrollTop || 0), 1 !== t.nodeType || "fixed" !== fabric.util.getElementStyle(t, "position")););
            return {
                left: e,
                top: i
            }
        }
        var i, r = Array.prototype.slice,
            n = function(t) {
                return r.call(t, 0)
            };
        try {
            i = n(fabric.document.childNodes) instanceof Array
        } catch(t) {}
        i || (n = function(t) {
            for(var e = new Array(t.length), i = t.length; i--;) e[i] = t[i];
            return e
        });
        var s;
        s = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function(t, e) {
                var i = fabric.document.defaultView.getComputedStyle(t, null);
                return i ? i[e] : void 0
            } : function(t, e) {
                var i = t.style[e];
                return !i && t.currentStyle && (i = t.currentStyle[e]), i
            },
            function() {
                var t = fabric.document.documentElement.style,
                    e = "userSelect" in t ? "userSelect" : "MozUserSelect" in t ? "MozUserSelect" : "WebkitUserSelect" in t ? "WebkitUserSelect" : "KhtmlUserSelect" in t ? "KhtmlUserSelect" : "";
                fabric.util.makeElementUnselectable = function(t) {
                    return void 0 !== t.onselectstart && (t.onselectstart = fabric.util.falseFunction), e ? t.style[e] = "none" : "string" == typeof t.unselectable && (t.unselectable = "on"), t
                }, fabric.util.makeElementSelectable = function(t) {
                    return void 0 !== t.onselectstart && (t.onselectstart = null), e ? t.style[e] = "" : "string" == typeof t.unselectable && (t.unselectable = ""), t
                }
            }(),
            function() {
                fabric.util.getScript = function(t, e) {
                    var i = fabric.document.getElementsByTagName("head")[0],
                        r = fabric.document.createElement("script"),
                        n = !0;
                    r.onload = r.onreadystatechange = function(t) {
                        if(n) {
                            if("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) return;
                            n = !1, e(t || fabric.window.event), r = r.onload = r.onreadystatechange = null
                        }
                    }, r.src = t, i.appendChild(r)
                }
            }(), fabric.util.getById = function(t) {
                return "string" == typeof t ? fabric.document.getElementById(t) : t
            }, fabric.util.toArray = n, fabric.util.makeElement = t, fabric.util.addClass = function(t, e) {
                t && -1 === (" " + t.className + " ").indexOf(" " + e + " ") && (t.className += (t.className ? " " : "") + e)
            }, fabric.util.wrapElement = function(e, i, r) {
                return "string" == typeof i && (i = t(i, r)), e.parentNode && e.parentNode.replaceChild(i, e), i.appendChild(e), i
            }, fabric.util.getScrollLeftTop = e, fabric.util.getElementOffset = function(t) {
                var i, r, n = t && t.ownerDocument,
                    o = {
                        left: 0,
                        top: 0
                    },
                    a = {
                        left: 0,
                        top: 0
                    },
                    h = {
                        borderLeftWidth: "left",
                        borderTopWidth: "top",
                        paddingLeft: "left",
                        paddingTop: "top"
                    };
                if(!n) return a;
                for(var c in h) a[h[c]] += parseInt(s(t, c), 10) || 0;
                return i = n.documentElement, void 0 !== t.getBoundingClientRect && (o = t.getBoundingClientRect()), r = e(t), {
                    left: o.left + r.left - (i.clientLeft || 0) + a.left,
                    top: o.top + r.top - (i.clientTop || 0) + a.top
                }
            }, fabric.util.getElementStyle = s
    }(),
    function() {
        function t() {}
        var e = function() {
            for(var t = [function() {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }, function() {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                }, function() {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0")
                }, function() {
                    return new XMLHttpRequest
                }], e = t.length; e--;) try {
                if(t[e]()) return t[e]
            } catch(t) {}
        }();
        fabric.util.request = function(i, r) {
            r || (r = {});
            var n = r.method ? r.method.toUpperCase() : "GET",
                s = r.onComplete || function() {},
                o = e(),
                a = r.body || r.parameters;
            return o.onreadystatechange = function() {
                4 === o.readyState && (s(o), o.onreadystatechange = t)
            }, "GET" === n && (a = null, "string" == typeof r.parameters && (i = function(t, e) {
                return t + (/\?/.test(t) ? "&" : "?") + e
            }(i, r.parameters))), o.open(n, i, !0), "POST" !== n && "PUT" !== n || o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), o.send(a), o
        }
    }(), fabric.log = function() {}, fabric.warn = function() {}, "undefined" != typeof console && ["log", "warn"].forEach(function(t) {
        void 0 !== console[t] && "function" == typeof console[t].apply && (fabric[t] = function() {
            return console[t].apply(console, arguments)
        })
    }),
    function() {
        function t() {
            return !1
        }

        function e() {
            return i.apply(fabric.window, arguments)
        }
        var i = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(t) {
            fabric.window.setTimeout(t, 1e3 / 60)
        };
        fabric.util.animate = function(i) {
            e(function(r) {
                i || (i = {});
                var n, s = r || +new Date,
                    o = i.duration || 500,
                    a = s + o,
                    h = i.onChange || t,
                    c = i.abort || t,
                    l = i.onComplete || t,
                    u = i.easing || function(t, e, i, r) {
                        return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
                    },
                    f = "startValue" in i ? i.startValue : 0,
                    d = "endValue" in i ? i.endValue : 100,
                    g = i.byValue || d - f;
                i.onStart && i.onStart(),
                    function t(r) {
                        if(c()) l(d, 1, 1);
                        else {
                            var p = (n = r || +new Date) > a ? o : n - s,
                                v = p / o,
                                b = u(p, f, g, o),
                                m = Math.abs((b - f) / g);
                            h(b, m, v), n > a ? i.onComplete && i.onComplete() : e(t)
                        }
                    }(s)
            })
        }, fabric.util.requestAnimFrame = e
    }(),
    function() {
        fabric.util.animateColor = function(t, e, i, r) {
            var n = new fabric.Color(t).getSource(),
                s = new fabric.Color(e).getSource();
            r = r || {}, fabric.util.animate(fabric.util.object.extend(r, {
                duration: i || 500,
                startValue: n,
                endValue: s,
                byValue: s,
                easing: function(t, e, i, n) {
                    return function(t, e, i) {
                        var r = "rgba(" + parseInt(t[0] + i * (e[0] - t[0]), 10) + "," + parseInt(t[1] + i * (e[1] - t[1]), 10) + "," + parseInt(t[2] + i * (e[2] - t[2]), 10);
                        return r += "," + (t && e ? parseFloat(t[3] + i * (e[3] - t[3])) : 1), r += ")"
                    }(e, i, r.colorEasing ? r.colorEasing(t, n) : 1 - Math.cos(t / n * (Math.PI / 2)))
                }
            }))
        }
    }(),
    function() {
        function t(t, e, i, r) {
            return t < Math.abs(e) ? (t = e, r = i / 4) : r = 0 === e && 0 === t ? i / (2 * Math.PI) * Math.asin(1) : i / (2 * Math.PI) * Math.asin(e / t), {
                a: t,
                c: e,
                p: i,
                s: r
            }
        }

        function e(t, e, i) {
            return t.a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - t.s) * (2 * Math.PI) / t.p)
        }

        function i(t, e, i, n) {
            return i - r(n - t, 0, i, n) + e
        }

        function r(t, e, i, r) {
            return(t /= r) < 1 / 2.75 ? i * (7.5625 * t * t) + e : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
        }
        fabric.util.ease = {
            easeInQuad: function(t, e, i, r) {
                return i * (t /= r) * t + e
            },
            easeOutQuad: function(t, e, i, r) {
                return -i * (t /= r) * (t - 2) + e
            },
            easeInOutQuad: function(t, e, i, r) {
                return(t /= r / 2) < 1 ? i / 2 * t * t + e : -i / 2 * (--t * (t - 2) - 1) + e
            },
            easeInCubic: function(t, e, i, r) {
                return i * (t /= r) * t * t + e
            },
            easeOutCubic: function(t, e, i, r) {
                return i * ((t = t / r - 1) * t * t + 1) + e
            },
            easeInOutCubic: function(t, e, i, r) {
                return(t /= r / 2) < 1 ? i / 2 * t * t * t + e : i / 2 * ((t -= 2) * t * t + 2) + e
            },
            easeInQuart: function(t, e, i, r) {
                return i * (t /= r) * t * t * t + e
            },
            easeOutQuart: function(t, e, i, r) {
                return -i * ((t = t / r - 1) * t * t * t - 1) + e
            },
            easeInOutQuart: function(t, e, i, r) {
                return(t /= r / 2) < 1 ? i / 2 * t * t * t * t + e : -i / 2 * ((t -= 2) * t * t * t - 2) + e
            },
            easeInQuint: function(t, e, i, r) {
                return i * (t /= r) * t * t * t * t + e
            },
            easeOutQuint: function(t, e, i, r) {
                return i * ((t = t / r - 1) * t * t * t * t + 1) + e
            },
            easeInOutQuint: function(t, e, i, r) {
                return(t /= r / 2) < 1 ? i / 2 * t * t * t * t * t + e : i / 2 * ((t -= 2) * t * t * t * t + 2) + e
            },
            easeInSine: function(t, e, i, r) {
                return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
            },
            easeOutSine: function(t, e, i, r) {
                return i * Math.sin(t / r * (Math.PI / 2)) + e
            },
            easeInOutSine: function(t, e, i, r) {
                return -i / 2 * (Math.cos(Math.PI * t / r) - 1) + e
            },
            easeInExpo: function(t, e, i, r) {
                return 0 === t ? e : i * Math.pow(2, 10 * (t / r - 1)) + e
            },
            easeOutExpo: function(t, e, i, r) {
                return t === r ? e + i : i * (1 - Math.pow(2, -10 * t / r)) + e
            },
            easeInOutExpo: function(t, e, i, r) {
                return 0 === t ? e : t === r ? e + i : (t /= r / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + e : i / 2 * (2 - Math.pow(2, -10 * --t)) + e
            },
            easeInCirc: function(t, e, i, r) {
                return -i * (Math.sqrt(1 - (t /= r) * t) - 1) + e
            },
            easeOutCirc: function(t, e, i, r) {
                return i * Math.sqrt(1 - (t = t / r - 1) * t) + e
            },
            easeInOutCirc: function(t, e, i, r) {
                return(t /= r / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + e : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
            },
            easeInElastic: function(i, r, n, s) {
                var o = 0;
                return 0 === i ? r : 1 == (i /= s) ? r + n : (o || (o = .3 * s), -e(t(n, n, o, 1.70158), i, s) + r)
            },
            easeOutElastic: function(e, i, r, n) {
                var s = 0,
                    o = r;
                if(0 === e) return i;
                if(1 == (e /= n)) return i + r;
                s || (s = .3 * n);
                var a = t(o, r, s, 1.70158);
                return a.a * Math.pow(2, -10 * e) * Math.sin((e * n - a.s) * (2 * Math.PI) / a.p) + a.c + i
            },
            easeInOutElastic: function(i, r, n, s) {
                var o = 0,
                    a = n;
                if(0 === i) return r;
                if(2 == (i /= s / 2)) return r + n;
                o || (o = s * (.3 * 1.5));
                var h = t(a, n, o, 1.70158);
                return i < 1 ? -.5 * e(h, i, s) + r : h.a * Math.pow(2, -10 * (i -= 1)) * Math.sin((i * s - h.s) * (2 * Math.PI) / h.p) * .5 + h.c + r
            },
            easeInBack: function(t, e, i, r, n) {
                return void 0 === n && (n = 1.70158), i * (t /= r) * t * ((n + 1) * t - n) + e
            },
            easeOutBack: function(t, e, i, r, n) {
                return void 0 === n && (n = 1.70158), i * ((t = t / r - 1) * t * ((n + 1) * t + n) + 1) + e
            },
            easeInOutBack: function(t, e, i, r, n) {
                return void 0 === n && (n = 1.70158), (t /= r / 2) < 1 ? i / 2 * (t * t * ((1 + (n *= 1.525)) * t - n)) + e : i / 2 * ((t -= 2) * t * ((1 + (n *= 1.525)) * t + n) + 2) + e
            },
            easeInBounce: i,
            easeOutBounce: r,
            easeInOutBounce: function(t, e, n, s) {
                return t < s / 2 ? .5 * i(2 * t, 0, n, s) + e : .5 * r(2 * t - s, 0, n, s) + .5 * n + e
            }
        }
    }(),
    function(t) {
        "use strict";

        function e(t) {
            return t in m ? m[t] : t
        }

        function i(t, e, i, r) {
            var n, s = "[object Array]" === Object.prototype.toString.call(e);
            return "fill" !== t && "stroke" !== t || "none" !== e ? "strokeDashArray" === t ? e = "none" === e ? null : e.replace(/,/g, " ").split(/\s+/).map(function(t) {
                return parseFloat(t)
            }) : "transformMatrix" === t ? e = i && i.transformMatrix ? d(i.transformMatrix, h.parseTransformAttribute(e)) : h.parseTransformAttribute(e) : "visible" === t ? (e = "none" !== e && "hidden" !== e, i && !1 === i.visible && (e = !1)) : "opacity" === t ? (e = parseFloat(e), i && void 0 !== i.opacity && (e *= i.opacity)) : "originX" === t ? e = "start" === e ? "left" : "end" === e ? "right" : "center" : n = s ? e.map(f) : f(e, r) : e = "", !s && isNaN(n) ? e : n
        }

        function r(t, e) {
            for(var i, r, n = [], s = 0; s < e.length; s++) i = e[s], r = t.getElementsByTagName(i), n = n.concat(Array.prototype.slice.call(r));
            return n
        }

        function n(t, e) {
            var i = {};
            for(var r in h.cssRules[e])
                if(function(t, e) {
                        var i, r = !0;
                        (i = s(t, e.pop())) && e.length && (r = function(t, e) {
                            var i, r = !0;
                            for(; t.parentNode && 1 === t.parentNode.nodeType && e.length;) r && (i = e.pop()), t = t.parentNode, r = s(t, i);
                            return 0 === e.length
                        }(t, e));
                        return i && r && 0 === e.length
                    }(t, r.split(" ")))
                    for(var n in h.cssRules[e][r]) i[n] = h.cssRules[e][r][n];
            return i
        }

        function s(t, e) {
            var i, r = t.nodeName,
                n = t.getAttribute("class"),
                s = t.getAttribute("id");
            if(i = new RegExp("^" + r, "i"), e = e.replace(i, ""), s && e.length && (i = new RegExp("#" + s + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")), n && e.length)
                for(var o = (n = n.split(" ")).length; o--;) i = new RegExp("\\." + n[o] + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "");
            return 0 === e.length
        }

        function o(t, e) {
            var i;
            if(t.getElementById && (i = t.getElementById(e)), i) return i;
            var r, n, s = t.getElementsByTagName("*");
            for(n = 0; n < s.length; n++)
                if(r = s[n], e === r.getAttribute("id")) return r
        }

        function a(t) {
            var e, i, r, n, s = t.getAttribute("viewBox"),
                o = 1,
                a = 1,
                c = 0,
                l = 0,
                u = t.getAttribute("width"),
                d = t.getAttribute("height"),
                g = t.getAttribute("x") || 0,
                v = t.getAttribute("y") || 0,
                b = t.getAttribute("preserveAspectRatio") || "",
                m = !s || !p.test(t.nodeName) || !(s = s.match(y)),
                _ = !u || !d || "100%" === u || "100%" === d,
                x = m && _,
                C = {},
                S = "";
            if(C.width = 0, C.height = 0, C.toBeParsed = x, x) return C;
            if(m) return C.width = f(u), C.height = f(d), C;
            if(c = -parseFloat(s[1]), l = -parseFloat(s[2]), e = parseFloat(s[3]), i = parseFloat(s[4]), _ ? (C.width = e, C.height = i) : (C.width = f(u), C.height = f(d), o = C.width / e, a = C.height / i), "none" !== (b = h.util.parsePreserveAspectRatioAttribute(b)).alignX && (a = o = o > a ? a : o), 1 === o && 1 === a && 0 === c && 0 === l && 0 === g && 0 === v) return C;
            if((g || v) && (S = " translate(" + f(g) + " " + f(v) + ") "), r = S + " matrix(" + o + " 0 0 " + a + " " + c * o + " " + l * a + ") ", "svg" === t.nodeName) {
                for(n = t.ownerDocument.createElement("g"); t.firstChild;) n.appendChild(t.firstChild);
                t.appendChild(n)
            } else r = (n = t).getAttribute("transform") + r;
            return n.setAttribute("transform", r), C
        }
        var h = t.fabric || (t.fabric = {}),
            c = h.util.object.extend,
            l = h.util.object.clone,
            u = h.util.toFixed,
            f = h.util.parseUnit,
            d = h.util.multiplyTransformMatrices,
            g = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/i,
            p = /^(symbol|image|marker|pattern|view|svg)$/i,
            v = /^(?:pattern|defs|symbol|metadata|clipPath|mask)$/i,
            b = /^(symbol|g|a|svg)$/i,
            m = {
                cx: "left",
                x: "left",
                r: "radius",
                cy: "top",
                y: "top",
                display: "visible",
                visibility: "visible",
                transform: "transformMatrix",
                "fill-opacity": "fillOpacity",
                "fill-rule": "fillRule",
                "font-family": "fontFamily",
                "font-size": "fontSize",
                "font-style": "fontStyle",
                "font-weight": "fontWeight",
                "stroke-dasharray": "strokeDashArray",
                "stroke-linecap": "strokeLineCap",
                "stroke-linejoin": "strokeLineJoin",
                "stroke-miterlimit": "strokeMiterLimit",
                "stroke-opacity": "strokeOpacity",
                "stroke-width": "strokeWidth",
                "text-decoration": "textDecoration",
                "text-anchor": "originX",
                opacity: "opacity"
            },
            _ = {
                stroke: "strokeOpacity",
                fill: "fillOpacity"
            };
        h.cssRules = {}, h.gradientDefs = {}, h.parseTransformAttribute = function() {
            function t(t, e, i) {
                t[i] = Math.tan(h.util.degreesToRadians(e[0]))
            }
            var e = [1, 0, 0, 1, 0, 0],
                i = h.reNum,
                r = "(?:\\s+,?\\s*|,\\s*)",
                n = "(?:" + ("(?:(matrix)\\s*\\(\\s*(" + i + ")" + r + "(" + i + ")" + r + "(" + i + ")" + r + "(" + i + ")" + r + "(" + i + ")" + r + "(" + i + ")\\s*\\))") + "|" + ("(?:(translate)\\s*\\(\\s*(" + i + ")(?:" + r + "(" + i + "))?\\s*\\))") + "|" + ("(?:(scale)\\s*\\(\\s*(" + i + ")(?:" + r + "(" + i + "))?\\s*\\))") + "|" + ("(?:(rotate)\\s*\\(\\s*(" + i + ")(?:" + r + "(" + i + ")" + r + "(" + i + "))?\\s*\\))") + "|" + ("(?:(skewX)\\s*\\(\\s*(" + i + ")\\s*\\))") + "|" + ("(?:(skewY)\\s*\\(\\s*(" + i + ")\\s*\\))") + ")",
                s = "^\\s*(?:" + ("(?:" + n + "(?:" + r + "*" + n + ")*)") + "?)\\s*$",
                o = new RegExp(s),
                a = new RegExp(n, "g");
            return function(i) {
                var r = e.concat(),
                    s = [];
                if(!i || i && !o.test(i)) return r;
                i.replace(a, function(i) {
                    var o = new RegExp(n).exec(i).filter(function(t) {
                            return !!t
                        }),
                        a = o[1],
                        c = o.slice(2).map(parseFloat);
                    switch(a) {
                        case "translate":
                            ! function(t, e) {
                                t[4] = e[0], 2 === e.length && (t[5] = e[1])
                            }(r, c);
                            break;
                        case "rotate":
                            c[0] = h.util.degreesToRadians(c[0]),
                                function(t, e) {
                                    var i = Math.cos(e[0]),
                                        r = Math.sin(e[0]),
                                        n = 0,
                                        s = 0;
                                    3 === e.length && (n = e[1], s = e[2]), t[0] = i, t[1] = r, t[2] = -r, t[3] = i, t[4] = n - (i * n - r * s), t[5] = s - (r * n + i * s)
                                }(r, c);
                            break;
                        case "scale":
                            ! function(t, e) {
                                var i = e[0],
                                    r = 2 === e.length ? e[1] : e[0];
                                t[0] = i, t[3] = r
                            }(r, c);
                            break;
                        case "skewX":
                            t(r, c, 2);
                            break;
                        case "skewY":
                            t(r, c, 1);
                            break;
                        case "matrix":
                            r = c
                    }
                    s.push(r.concat()), r = e.concat()
                });
                for(var c = s[0]; s.length > 1;) s.shift(), c = h.util.multiplyTransformMatrices(c, s[0]);
                return c
            }
        }();
        var y = new RegExp("^\\s*(" + h.reNum + "+)\\s*,?\\s*(" + h.reNum + "+)\\s*,?\\s*(" + h.reNum + "+)\\s*,?\\s*(" + h.reNum + "+)\\s*$");
        h.parseSVGDocument = function(t, e, i, n) {
            if(t) {
                ! function(t) {
                    for(var e = r(t, ["use", "svg:use"]), i = 0; e.length && i < e.length;) {
                        var n, s, h, c, l = e[i],
                            u = l.getAttribute("xlink:href").substr(1),
                            f = l.getAttribute("x") || 0,
                            d = l.getAttribute("y") || 0,
                            g = o(t, u).cloneNode(!0),
                            p = (g.getAttribute("transform") || "") + " translate(" + f + ", " + d + ")",
                            v = e.length;
                        if(a(g), /^svg$/i.test(g.nodeName)) {
                            var b = g.ownerDocument.createElement("g");
                            for(s = 0, c = (h = g.attributes).length; s < c; s++) n = h.item(s), b.setAttribute(n.nodeName, n.nodeValue);
                            for(; g.firstChild;) b.appendChild(g.firstChild);
                            g = b
                        }
                        for(s = 0, c = (h = l.attributes).length; s < c; s++) "x" !== (n = h.item(s)).nodeName && "y" !== n.nodeName && "xlink:href" !== n.nodeName && ("transform" === n.nodeName ? p = n.nodeValue + " " + p : g.setAttribute(n.nodeName, n.nodeValue));
                        g.setAttribute("transform", p), g.setAttribute("instantiated_by_use", "1"), g.removeAttribute("id"), l.parentNode.replaceChild(g, l), e.length === v && i++
                    }
                }(t);
                var s = h.Object.__uid++,
                    c = a(t),
                    u = h.util.toArray(t.getElementsByTagName("*"));
                if(c.crossOrigin = n && n.crossOrigin, c.svgUid = s, 0 === u.length && h.isLikelyNode) {
                    for(var f = [], d = 0, p = (u = t.selectNodes('//*[name(.)!="svg"]')).length; d < p; d++) f[d] = u[d];
                    u = f
                }
                var b = u.filter(function(t) {
                    return a(t), g.test(t.nodeName.replace("svg:", "")) && ! function(t, e) {
                        for(; t && (t = t.parentNode);)
                            if(t.nodeName && e.test(t.nodeName.replace("svg:", "")) && !t.getAttribute("instantiated_by_use")) return !0;
                        return !1
                    }(t, v)
                });
                !b || b && !b.length ? e && e([], {}) : (h.gradientDefs[s] = h.getGradientDefs(t), h.cssRules[s] = h.getCSSRules(t), h.parseElements(b, function(t) {
                    e && e(t, c)
                }, l(c), i, n))
            }
        };
        var x = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + h.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + h.reNum + "))?\\s+(.*)");
        c(h, {
            parseFontDeclaration: function(t, e) {
                var i = t.match(x);
                if(i) {
                    var r = i[1],
                        n = i[3],
                        s = i[4],
                        o = i[5],
                        a = i[6];
                    r && (e.fontStyle = r), n && (e.fontWeight = isNaN(parseFloat(n)) ? n : parseFloat(n)), s && (e.fontSize = f(s)), a && (e.fontFamily = a), o && (e.lineHeight = "normal" === o ? 1 : o)
                }
            },
            getGradientDefs: function(t) {
                var e, i, n, s = r(t, ["linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient"]),
                    o = 0,
                    a = {},
                    h = {};
                for(o = s.length; o--;) n = (e = s[o]).getAttribute("xlink:href"), i = e.getAttribute("id"), n && (h[i] = n.substr(1)), a[i] = e;
                for(i in h) {
                    var c = a[h[i]].cloneNode(!0);
                    for(e = a[i]; c.firstChild;) e.appendChild(c.firstChild)
                }
                return a
            },
            parseAttributes: function(t, r, s) {
                if(t) {
                    var o, a, l = {};
                    void 0 === s && (s = t.getAttribute("svgUid")), t.parentNode && b.test(t.parentNode.nodeName) && (l = h.parseAttributes(t.parentNode, r, s)), a = l && l.fontSize || t.getAttribute("font-size") || h.Text.DEFAULT_SVG_FONT_SIZE;
                    var f = r.reduce(function(e, i) {
                        return(o = t.getAttribute(i)) && (e[i] = o), e
                    }, {});
                    f = c(f, c(n(t, s), h.parseStyleAttribute(t)));
                    var d, g, p = {};
                    for(var v in f) g = i(d = e(v), f[v], l, a), p[d] = g;
                    p && p.font && h.parseFontDeclaration(p.font, p);
                    var m = c(l, p);
                    return b.test(t.nodeName) ? m : function(t) {
                        for(var e in _)
                            if(void 0 !== t[_[e]] && "" !== t[e]) {
                                if(void 0 === t[e]) {
                                    if(!h.Object.prototype[e]) continue;
                                    t[e] = h.Object.prototype[e]
                                }
                                if(0 !== t[e].indexOf("url(")) {
                                    var i = new h.Color(t[e]);
                                    t[e] = i.setAlpha(u(i.getAlpha() * t[_[e]], 2)).toRgba()
                                }
                            }
                        return t
                    }(m)
                }
            },
            parseElements: function(t, e, i, r, n) {
                new h.ElementsParser(t, e, i, r, n).parse()
            },
            parseStyleAttribute: function(t) {
                var e = {},
                    i = t.getAttribute("style");
                return i ? ("string" == typeof i ? function(t, e) {
                    var i, r;
                    t.replace(/;\s*$/, "").split(";").forEach(function(t) {
                        var n = t.split(":");
                        i = n[0].trim().toLowerCase(), r = n[1].trim(), e[i] = r
                    })
                }(i, e) : function(t, e) {
                    var i, r;
                    for(var n in t) void 0 !== t[n] && (i = n.toLowerCase(), r = t[n], e[i] = r)
                }(i, e), e) : e
            },
            parsePointsAttribute: function(t) {
                if(!t) return null;
                var e, i, r = [];
                for(e = 0, i = (t = (t = t.replace(/,/g, " ").trim()).split(/\s+/)).length; e < i; e += 2) r.push({
                    x: parseFloat(t[e]),
                    y: parseFloat(t[e + 1])
                });
                return r
            },
            getCSSRules: function(t) {
                for(var e = t.getElementsByTagName("style"), i = {}, r = 0, n = e.length; r < n; r++) {
                    var s = e[r].textContent || e[r].text;
                    "" !== (s = s.replace(/\/\*[\s\S]*?\*\//g, "")).trim() && s.match(/[^{]*\{[\s\S]*?\}/g).map(function(t) {
                        return t.trim()
                    }).forEach(function(t) {
                        for(var e = t.match(/([\s\S]*?)\s*\{([^}]*)\}/), r = {}, n = e[2].trim().replace(/;$/, "").split(/\s*;\s*/), s = 0, o = n.length; s < o; s++) {
                            var a = n[s].split(/\s*:\s*/),
                                c = a[0],
                                l = a[1];
                            r[c] = l
                        }(t = e[1]).split(",").forEach(function(t) {
                            "" !== (t = t.replace(/^svg/i, "").trim()) && (i[t] ? h.util.object.extend(i[t], r) : i[t] = h.util.object.clone(r))
                        })
                    })
                }
                return i
            },
            loadSVGFromURL: function(t, e, i, r) {
                t = t.replace(/^\n\s*/, "").trim(), new h.util.request(t, {
                    method: "get",
                    onComplete: function(t) {
                        var n = t.responseXML;
                        n && !n.documentElement && h.window.ActiveXObject && t.responseText && ((n = new ActiveXObject("Microsoft.XMLDOM")).async = "false", n.loadXML(t.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))), n && n.documentElement || e && e(null), h.parseSVGDocument(n.documentElement, function(t, i) {
                            e && e(t, i)
                        }, i, r)
                    }
                })
            },
            loadSVGFromString: function(t, e, i, r) {
                t = t.trim();
                var n;
                if("undefined" != typeof DOMParser) {
                    var s = new DOMParser;
                    s && s.parseFromString && (n = s.parseFromString(t, "text/xml"))
                } else h.window.ActiveXObject && ((n = new ActiveXObject("Microsoft.XMLDOM")).async = "false", n.loadXML(t.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                h.parseSVGDocument(n.documentElement, function(t, i) {
                    e(t, i)
                }, i, r)
            }
        })
    }("undefined" != typeof exports ? exports : this), fabric.ElementsParser = function(t, e, i, r, n) {
        this.elements = t, this.callback = e, this.options = i, this.reviver = r, this.svgUid = i && i.svgUid || 0, this.parsingOptions = n
    }, fabric.ElementsParser.prototype.parse = function() {
        this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects()
    }, fabric.ElementsParser.prototype.createObjects = function() {
        for(var t = 0, e = this.elements.length; t < e; t++) this.elements[t].setAttribute("svgUid", this.svgUid),
            function(t, e) {
                setTimeout(function() {
                    t.createObject(t.elements[e], e)
                }, 0)
            }(this, t)
    }, fabric.ElementsParser.prototype.createObject = function(t, e) {
        var i = fabric[fabric.util.string.capitalize(t.tagName.replace("svg:", ""))];
        if(i && i.fromElement) try {
            this._createObject(i, t, e)
        } catch(t) {
            fabric.log(t)
        } else this.checkIfDone()
    }, fabric.ElementsParser.prototype._createObject = function(t, e, i) {
        if(t.async) t.fromElement(e, this.createCallback(i, e), this.options);
        else {
            var r = t.fromElement(e, this.options);
            this.resolveGradient(r, "fill"), this.resolveGradient(r, "stroke"), this.reviver && this.reviver(e, r), this.instances[i] = r, this.checkIfDone()
        }
    }, fabric.ElementsParser.prototype.createCallback = function(t, e) {
        var i = this;
        return function(r) {
            i.resolveGradient(r, "fill"), i.resolveGradient(r, "stroke"), i.reviver && i.reviver(e, r), i.instances[t] = r, i.checkIfDone()
        }
    }, fabric.ElementsParser.prototype.resolveGradient = function(t, e) {
        var i = t.get(e);
        if(/^url\(/.test(i)) {
            var r = i.slice(5, i.length - 1);
            fabric.gradientDefs[this.svgUid][r] && t.set(e, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][r], t))
        }
    }, fabric.ElementsParser.prototype.checkIfDone = function() {
        0 == --this.numElements && (this.instances = this.instances.filter(function(t) {
            return null != t
        }), this.callback(this.instances))
    },
    function(t) {
        "use strict";

        function e(t, e) {
            this.x = t, this.y = e
        }
        var i = t.fabric || (t.fabric = {});
        i.Point ? i.warn("fabric.Point is already defined") : (i.Point = e, e.prototype = {
            type: "point",
            constructor: e,
            add: function(t) {
                return new e(this.x + t.x, this.y + t.y)
            },
            addEquals: function(t) {
                return this.x += t.x, this.y += t.y, this
            },
            scalarAdd: function(t) {
                return new e(this.x + t, this.y + t)
            },
            scalarAddEquals: function(t) {
                return this.x += t, this.y += t, this
            },
            subtract: function(t) {
                return new e(this.x - t.x, this.y - t.y)
            },
            subtractEquals: function(t) {
                return this.x -= t.x, this.y -= t.y, this
            },
            scalarSubtract: function(t) {
                return new e(this.x - t, this.y - t)
            },
            scalarSubtractEquals: function(t) {
                return this.x -= t, this.y -= t, this
            },
            multiply: function(t) {
                return new e(this.x * t, this.y * t)
            },
            multiplyEquals: function(t) {
                return this.x *= t, this.y *= t, this
            },
            divide: function(t) {
                return new e(this.x / t, this.y / t)
            },
            divideEquals: function(t) {
                return this.x /= t, this.y /= t, this
            },
            eq: function(t) {
                return this.x === t.x && this.y === t.y
            },
            lt: function(t) {
                return this.x < t.x && this.y < t.y
            },
            lte: function(t) {
                return this.x <= t.x && this.y <= t.y
            },
            gt: function(t) {
                return this.x > t.x && this.y > t.y
            },
            gte: function(t) {
                return this.x >= t.x && this.y >= t.y
            },
            lerp: function(t, i) {
                return void 0 === i && (i = .5), i = Math.max(Math.min(1, i), 0), new e(this.x + (t.x - this.x) * i, this.y + (t.y - this.y) * i)
            },
            distanceFrom: function(t) {
                var e = this.x - t.x,
                    i = this.y - t.y;
                return Math.sqrt(e * e + i * i)
            },
            midPointFrom: function(t) {
                return this.lerp(t)
            },
            min: function(t) {
                return new e(Math.min(this.x, t.x), Math.min(this.y, t.y))
            },
            max: function(t) {
                return new e(Math.max(this.x, t.x), Math.max(this.y, t.y))
            },
            toString: function() {
                return this.x + "," + this.y
            },
            setXY: function(t, e) {
                return this.x = t, this.y = e, this
            },
            setX: function(t) {
                return this.x = t, this
            },
            setY: function(t) {
                return this.y = t, this
            },
            setFromPoint: function(t) {
                return this.x = t.x, this.y = t.y, this
            },
            swap: function(t) {
                var e = this.x,
                    i = this.y;
                this.x = t.x, this.y = t.y, t.x = e, t.y = i
            },
            clone: function() {
                return new e(this.x, this.y)
            }
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            this.status = t, this.points = []
        }
        var i = t.fabric || (t.fabric = {});
        i.Intersection ? i.warn("fabric.Intersection is already defined") : (i.Intersection = e, i.Intersection.prototype = {
            constructor: e,
            appendPoint: function(t) {
                return this.points.push(t), this
            },
            appendPoints: function(t) {
                return this.points = this.points.concat(t), this
            }
        }, i.Intersection.intersectLineLine = function(t, r, n, s) {
            var o, a = (s.x - n.x) * (t.y - n.y) - (s.y - n.y) * (t.x - n.x),
                h = (r.x - t.x) * (t.y - n.y) - (r.y - t.y) * (t.x - n.x),
                c = (s.y - n.y) * (r.x - t.x) - (s.x - n.x) * (r.y - t.y);
            if(0 !== c) {
                var l = a / c,
                    u = h / c;
                0 <= l && l <= 1 && 0 <= u && u <= 1 ? (o = new e("Intersection")).appendPoint(new i.Point(t.x + l * (r.x - t.x), t.y + l * (r.y - t.y))) : o = new e
            } else o = new e(0 === a || 0 === h ? "Coincident" : "Parallel");
            return o
        }, i.Intersection.intersectLinePolygon = function(t, i, r) {
            for(var n, s, o, a = new e, h = r.length, c = 0; c < h; c++) n = r[c], s = r[(c + 1) % h], o = e.intersectLineLine(t, i, n, s), a.appendPoints(o.points);
            return a.points.length > 0 && (a.status = "Intersection"), a
        }, i.Intersection.intersectPolygonPolygon = function(t, i) {
            for(var r = new e, n = t.length, s = 0; s < n; s++) {
                var o = t[s],
                    a = t[(s + 1) % n],
                    h = e.intersectLinePolygon(o, a, i);
                r.appendPoints(h.points)
            }
            return r.points.length > 0 && (r.status = "Intersection"), r
        }, i.Intersection.intersectPolygonRectangle = function(t, r, n) {
            var s = r.min(n),
                o = r.max(n),
                a = new i.Point(o.x, s.y),
                h = new i.Point(s.x, o.y),
                c = e.intersectLinePolygon(s, a, t),
                l = e.intersectLinePolygon(a, o, t),
                u = e.intersectLinePolygon(o, h, t),
                f = e.intersectLinePolygon(h, s, t),
                d = new e;
            return d.appendPoints(c.points), d.appendPoints(l.points), d.appendPoints(u.points), d.appendPoints(f.points), d.points.length > 0 && (d.status = "Intersection"), d
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
        }

        function i(t, e, i) {
            return i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
        }
        var r = t.fabric || (t.fabric = {});
        r.Color ? r.warn("fabric.Color is already defined.") : (r.Color = e, r.Color.prototype = {
            _tryParsingColor: function(t) {
                var i;
                t in e.colorNameMap && (t = e.colorNameMap[t]), "transparent" === t && (i = [255, 255, 255, 0]), i || (i = e.sourceFromHex(t)), i || (i = e.sourceFromRgb(t)), i || (i = e.sourceFromHsl(t)), i || (i = [0, 0, 0, 1]), i && this.setSource(i)
            },
            _rgbToHsl: function(t, e, i) {
                t /= 255, e /= 255, i /= 255;
                var n, s, o, a = r.util.array.max([t, e, i]),
                    h = r.util.array.min([t, e, i]);
                if(o = (a + h) / 2, a === h) n = s = 0;
                else {
                    var c = a - h;
                    switch(s = o > .5 ? c / (2 - a - h) : c / (a + h), a) {
                        case t:
                            n = (e - i) / c + (e < i ? 6 : 0);
                            break;
                        case e:
                            n = (i - t) / c + 2;
                            break;
                        case i:
                            n = (t - e) / c + 4
                    }
                    n /= 6
                }
                return [Math.round(360 * n), Math.round(100 * s), Math.round(100 * o)]
            },
            getSource: function() {
                return this._source
            },
            setSource: function(t) {
                this._source = t
            },
            toRgb: function() {
                var t = this.getSource();
                return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
            },
            toRgba: function() {
                var t = this.getSource();
                return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
            },
            toHsl: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
            },
            toHsla: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
            },
            toHex: function() {
                var t, e, i, r = this.getSource();
                return t = r[0].toString(16), t = 1 === t.length ? "0" + t : t, e = r[1].toString(16), e = 1 === e.length ? "0" + e : e, i = r[2].toString(16), i = 1 === i.length ? "0" + i : i, t.toUpperCase() + e.toUpperCase() + i.toUpperCase()
            },
            toHexa: function() {
                var t;
                return t = 255 * this.getSource()[3], t = t.toString(16), t = 1 === t.length ? "0" + t : t, this.toHex() + t.toUpperCase()
            },
            getAlpha: function() {
                return this.getSource()[3]
            },
            setAlpha: function(t) {
                var e = this.getSource();
                return e[3] = t, this.setSource(e), this
            },
            toGrayscale: function() {
                var t = this.getSource(),
                    e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10),
                    i = t[3];
                return this.setSource([e, e, e, i]), this
            },
            toBlackWhite: function(t) {
                var e = this.getSource(),
                    i = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0),
                    r = e[3];
                return t = t || 127, i = Number(i) < Number(t) ? 0 : 255, this.setSource([i, i, i, r]), this
            },
            overlayWith: function(t) {
                t instanceof e || (t = new e(t));
                for(var i = [], r = this.getAlpha(), n = this.getSource(), s = t.getSource(), o = 0; o < 3; o++) i.push(Math.round(.5 * n[o] + .5 * s[o]));
                return i[3] = r, this.setSource(i), this
            }
        }, r.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/, r.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, r.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i, r.Color.colorNameMap = {
            aqua: "#00FFFF",
            black: "#000000",
            blue: "#0000FF",
            fuchsia: "#FF00FF",
            gray: "#808080",
            grey: "#808080",
            green: "#008000",
            lime: "#00FF00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            orange: "#FFA500",
            purple: "#800080",
            red: "#FF0000",
            silver: "#C0C0C0",
            teal: "#008080",
            white: "#FFFFFF",
            yellow: "#FFFF00"
        }, r.Color.fromRgb = function(t) {
            return e.fromSource(e.sourceFromRgb(t))
        }, r.Color.sourceFromRgb = function(t) {
            var i = t.match(e.reRGBa);
            if(i) {
                var r = parseInt(i[1], 10) / (/%$/.test(i[1]) ? 100 : 1) * (/%$/.test(i[1]) ? 255 : 1),
                    n = parseInt(i[2], 10) / (/%$/.test(i[2]) ? 100 : 1) * (/%$/.test(i[2]) ? 255 : 1),
                    s = parseInt(i[3], 10) / (/%$/.test(i[3]) ? 100 : 1) * (/%$/.test(i[3]) ? 255 : 1);
                return [parseInt(r, 10), parseInt(n, 10), parseInt(s, 10), i[4] ? parseFloat(i[4]) : 1]
            }
        }, r.Color.fromRgba = e.fromRgb, r.Color.fromHsl = function(t) {
            return e.fromSource(e.sourceFromHsl(t))
        }, r.Color.sourceFromHsl = function(t) {
            var r = t.match(e.reHSLa);
            if(r) {
                var n, s, o, a = (parseFloat(r[1]) % 360 + 360) % 360 / 360,
                    h = parseFloat(r[2]) / (/%$/.test(r[2]) ? 100 : 1),
                    c = parseFloat(r[3]) / (/%$/.test(r[3]) ? 100 : 1);
                if(0 === h) n = s = o = c;
                else {
                    var l = c <= .5 ? c * (h + 1) : c + h - c * h,
                        u = 2 * c - l;
                    n = i(u, l, a + 1 / 3), s = i(u, l, a), o = i(u, l, a - 1 / 3)
                }
                return [Math.round(255 * n), Math.round(255 * s), Math.round(255 * o), r[4] ? parseFloat(r[4]) : 1]
            }
        }, r.Color.fromHsla = e.fromHsl, r.Color.fromHex = function(t) {
            return e.fromSource(e.sourceFromHex(t))
        }, r.Color.sourceFromHex = function(t) {
            if(t.match(e.reHex)) {
                var i = t.slice(t.indexOf("#") + 1),
                    r = 3 === i.length || 4 === i.length,
                    n = 8 === i.length || 4 === i.length,
                    s = r ? i.charAt(0) + i.charAt(0) : i.substring(0, 2),
                    o = r ? i.charAt(1) + i.charAt(1) : i.substring(2, 4),
                    a = r ? i.charAt(2) + i.charAt(2) : i.substring(4, 6),
                    h = n ? r ? i.charAt(3) + i.charAt(3) : i.substring(6, 8) : "FF";
                return [parseInt(s, 16), parseInt(o, 16), parseInt(a, 16), parseFloat((parseInt(h, 16) / 255).toFixed(2))]
            }
        }, r.Color.fromSource = function(t) {
            var i = new e;
            return i.setSource(t), i
        })
    }("undefined" != typeof exports ? exports : this),
    function() {
        function t(t) {
            var e, i, r, n = t.getAttribute("style"),
                s = t.getAttribute("offset") || 0;
            if(s = parseFloat(s) / (/%$/.test(s) ? 100 : 1), s = s < 0 ? 0 : s > 1 ? 1 : s, n) {
                var o = n.split(/\s*;\s*/);
                "" === o[o.length - 1] && o.pop();
                for(var a = o.length; a--;) {
                    var h = o[a].split(/\s*:\s*/),
                        c = h[0].trim(),
                        l = h[1].trim();
                    "stop-color" === c ? e = l : "stop-opacity" === c && (r = l)
                }
            }
            return e || (e = t.getAttribute("stop-color") || "rgb(0,0,0)"), r || (r = t.getAttribute("stop-opacity")), e = new fabric.Color(e), i = e.getAlpha(), r = isNaN(parseFloat(r)) ? 1 : parseFloat(r), r *= i, {
                offset: s,
                color: e.toRgb(),
                opacity: r
            }
        }

        function e(t, e, i) {
            var r, n = 0,
                s = 1,
                o = "";
            for(var a in e) "Infinity" === e[a] ? e[a] = 1 : "-Infinity" === e[a] && (e[a] = 0), r = parseFloat(e[a], 10), s = "string" == typeof e[a] && /^\d+%$/.test(e[a]) ? .01 : 1, "x1" === a || "x2" === a || "r2" === a ? (s *= "objectBoundingBox" === i ? t.width : 1, n = "objectBoundingBox" === i ? t.left || 0 : 0) : "y1" !== a && "y2" !== a || (s *= "objectBoundingBox" === i ? t.height : 1, n = "objectBoundingBox" === i ? t.top || 0 : 0), e[a] = r * s + n;
            if("ellipse" === t.type && null !== e.r2 && "objectBoundingBox" === i && t.rx !== t.ry) {
                var h = t.ry / t.rx;
                o = " scale(1, " + h + ")", e.y1 && (e.y1 /= h), e.y2 && (e.y2 /= h)
            }
            return o
        }
        var i = fabric.util.object.clone;
        fabric.Gradient = fabric.util.createClass({
            offsetX: 0,
            offsetY: 0,
            initialize: function(t) {
                t || (t = {});
                var e = {};
                this.id = fabric.Object.__uid++, this.type = t.type || "linear", e = {
                    x1: t.coords.x1 || 0,
                    y1: t.coords.y1 || 0,
                    x2: t.coords.x2 || 0,
                    y2: t.coords.y2 || 0
                }, "radial" === this.type && (e.r1 = t.coords.r1 || 0, e.r2 = t.coords.r2 || 0), this.coords = e, this.colorStops = t.colorStops.slice(), t.gradientTransform && (this.gradientTransform = t.gradientTransform), this.offsetX = t.offsetX || this.offsetX, this.offsetY = t.offsetY || this.offsetY
            },
            addColorStop: function(t) {
                for(var e in t) {
                    var i = new fabric.Color(t[e]);
                    this.colorStops.push({
                        offset: parseFloat(e),
                        color: i.toRgb(),
                        opacity: i.getAlpha()
                    })
                }
                return this
            },
            toObject: function(t) {
                var e = {
                    type: this.type,
                    coords: this.coords,
                    colorStops: this.colorStops,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
                };
                return fabric.util.populateWithProperties(this, e, t), e
            },
            toSVG: function(t) {
                var e, r, n = i(this.coords, !0),
                    s = i(this.colorStops, !0),
                    o = n.r1 > n.r2;
                if(s.sort(function(t, e) {
                        return t.offset - e.offset
                    }), !t.group || "path-group" !== t.group.type)
                    for(var a in n) "x1" === a || "x2" === a ? n[a] += this.offsetX - t.width / 2 : "y1" !== a && "y2" !== a || (n[a] += this.offsetY - t.height / 2);
                if(r = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"', this.gradientTransform && (r += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" '), "linear" === this.type ? e = ["<linearGradient ", r, ' x1="', n.x1, '" y1="', n.y1, '" x2="', n.x2, '" y2="', n.y2, '">\n'] : "radial" === this.type && (e = ["<radialGradient ", r, ' cx="', o ? n.x1 : n.x2, '" cy="', o ? n.y1 : n.y2, '" r="', o ? n.r1 : n.r2, '" fx="', o ? n.x2 : n.x1, '" fy="', o ? n.y2 : n.y1, '">\n']), "radial" === this.type) {
                    if(o) {
                        (s = s.concat()).reverse();
                        for(l = 0; l < s.length; l++) s[l].offset = 1 - s[l].offset
                    }
                    var h = Math.min(n.r1, n.r2);
                    if(h > 0)
                        for(var c = h / Math.max(n.r1, n.r2), l = 0; l < s.length; l++) s[l].offset += c * (1 - s[l].offset)
                }
                for(l = 0; l < s.length; l++) {
                    var u = s[l];
                    e.push("<stop ", 'offset="', 100 * u.offset + "%", '" style="stop-color:', u.color, null !== u.opacity ? ";stop-opacity: " + u.opacity : ";", '"/>\n')
                }
                return e.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n"), e.join("")
            },
            toLive: function(t, e) {
                var i, r, n = fabric.util.object.clone(this.coords);
                if(this.type) {
                    if(e.group && "path-group" === e.group.type)
                        for(r in n) "x1" === r || "x2" === r ? n[r] += -this.offsetX + e.width / 2 : "y1" !== r && "y2" !== r || (n[r] += -this.offsetY + e.height / 2);
                    "linear" === this.type ? i = t.createLinearGradient(n.x1, n.y1, n.x2, n.y2) : "radial" === this.type && (i = t.createRadialGradient(n.x1, n.y1, n.r1, n.x2, n.y2, n.r2));
                    for(var s = 0, o = this.colorStops.length; s < o; s++) {
                        var a = this.colorStops[s].color,
                            h = this.colorStops[s].opacity,
                            c = this.colorStops[s].offset;
                        void 0 !== h && (a = new fabric.Color(a).setAlpha(h).toRgba()), i.addColorStop(c, a)
                    }
                    return i
                }
            }
        }), fabric.util.object.extend(fabric.Gradient, {
            fromElement: function(i, r) {
                var n, s, o, a = i.getElementsByTagName("stop"),
                    h = i.getAttribute("gradientUnits") || "objectBoundingBox",
                    c = i.getAttribute("gradientTransform"),
                    l = [];
                "linear" === (n = "linearGradient" === i.nodeName || "LINEARGRADIENT" === i.nodeName ? "linear" : "radial") ? s = function(t) {
                    return {
                        x1: t.getAttribute("x1") || 0,
                        y1: t.getAttribute("y1") || 0,
                        x2: t.getAttribute("x2") || "100%",
                        y2: t.getAttribute("y2") || 0
                    }
                }(i): "radial" === n && (s = function(t) {
                    return {
                        x1: t.getAttribute("fx") || t.getAttribute("cx") || "50%",
                        y1: t.getAttribute("fy") || t.getAttribute("cy") || "50%",
                        r1: 0,
                        x2: t.getAttribute("cx") || "50%",
                        y2: t.getAttribute("cy") || "50%",
                        r2: t.getAttribute("r") || "50%"
                    }
                }(i));
                for(var u = a.length; u--;) l.push(t(a[u]));
                o = e(r, s, h);
                var f = new fabric.Gradient({
                    type: n,
                    coords: s,
                    colorStops: l,
                    offsetX: -r.left,
                    offsetY: -r.top
                });
                return(c || "" !== o) && (f.gradientTransform = fabric.parseTransformAttribute((c || "") + o)), f
            },
            forObject: function(t, i) {
                return i || (i = {}), e(t, i.coords, "userSpaceOnUse"), new fabric.Gradient(i)
            }
        })
    }(),
    function() {
        "use strict";
        var t = fabric.util.toFixed;
        fabric.Pattern = fabric.util.createClass({
            repeat: "repeat",
            offsetX: 0,
            offsetY: 0,
            initialize: function(t, e) {
                if(t || (t = {}), this.id = fabric.Object.__uid++, this.setOptions(t), !t.source || t.source && "string" != typeof t.source) e && e(this);
                else if(void 0 !== fabric.util.getFunctionBody(t.source)) this.source = new Function(fabric.util.getFunctionBody(t.source)), e && e(this);
                else {
                    var i = this;
                    this.source = fabric.util.createImage(), fabric.util.loadImage(t.source, function(t) {
                        i.source = t, e && e(i)
                    })
                }
            },
            toObject: function(e) {
                var i, r, n = fabric.Object.NUM_FRACTION_DIGITS;
                return "function" == typeof this.source ? i = String(this.source) : "string" == typeof this.source.src ? i = this.source.src : "object" == typeof this.source && this.source.toDataURL && (i = this.source.toDataURL()), r = {
                    type: "pattern",
                    source: i,
                    repeat: this.repeat,
                    offsetX: t(this.offsetX, n),
                    offsetY: t(this.offsetY, n)
                }, fabric.util.populateWithProperties(this, r, e), r
            },
            toSVG: function(t) {
                var e = "function" == typeof this.source ? this.source() : this.source,
                    i = e.width / t.width,
                    r = e.height / t.height,
                    n = this.offsetX / t.width,
                    s = this.offsetY / t.height,
                    o = "";
                return "repeat-x" !== this.repeat && "no-repeat" !== this.repeat || (r = 1), "repeat-y" !== this.repeat && "no-repeat" !== this.repeat || (i = 1), e.src ? o = e.src : e.toDataURL && (o = e.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + n + '" y="' + s + '" width="' + i + '" height="' + r + '">\n<image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + o + '"></image>\n</pattern>\n'
            },
            setOptions: function(t) {
                for(var e in t) this[e] = t[e]
            },
            toLive: function(t) {
                var e = "function" == typeof this.source ? this.source() : this.source;
                if(!e) return "";
                if(void 0 !== e.src) {
                    if(!e.complete) return "";
                    if(0 === e.naturalWidth || 0 === e.naturalHeight) return ""
                }
                return t.createPattern(e, this.repeat)
            }
        })
    }(),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.toFixed;
        e.Shadow ? e.warn("fabric.Shadow is already defined.") : (e.Shadow = e.util.createClass({
            color: "rgb(0,0,0)",
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: !1,
            includeDefaultValues: !0,
            initialize: function(t) {
                "string" == typeof t && (t = this._parseShadow(t));
                for(var i in t) this[i] = t[i];
                this.id = e.Object.__uid++
            },
            _parseShadow: function(t) {
                var i = t.trim(),
                    r = e.Shadow.reOffsetsAndBlur.exec(i) || [];
                return {
                    color: (i.replace(e.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)").trim(),
                    offsetX: parseInt(r[1], 10) || 0,
                    offsetY: parseInt(r[2], 10) || 0,
                    blur: parseInt(r[3], 10) || 0
                }
            },
            toString: function() {
                return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
            },
            toSVG: function(t) {
                var r = 40,
                    n = 40,
                    s = e.Object.NUM_FRACTION_DIGITS,
                    o = e.util.rotateVector({
                        x: this.offsetX,
                        y: this.offsetY
                    }, e.util.degreesToRadians(-t.angle));
                return t.width && t.height && (r = 100 * i((Math.abs(o.x) + this.blur) / t.width, s) + 20, n = 100 * i((Math.abs(o.y) + this.blur) / t.height, s) + 20), t.flipX && (o.x *= -1), t.flipY && (o.y *= -1), '<filter id="SVGID_' + this.id + '" y="-' + n + '%" height="' + (100 + 2 * n) + '%" x="-' + r + '%" width="' + (100 + 2 * r) + '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' + i(this.blur ? this.blur / 2 : 0, s) + '"></feGaussianBlur>\n\t<feOffset dx="' + i(o.x, s) + '" dy="' + i(o.y, s) + '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' + this.color + '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
            },
            toObject: function() {
                if(this.includeDefaultValues) return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    affectStroke: this.affectStroke
                };
                var t = {},
                    i = e.Shadow.prototype;
                return ["color", "blur", "offsetX", "offsetY", "affectStroke"].forEach(function(e) {
                    this[e] !== i[e] && (t[e] = this[e])
                }, this), t
            }
        }), e.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/)
    }("undefined" != typeof exports ? exports : this),
    function() {
        "use strict";
        if(fabric.StaticCanvas) fabric.warn("fabric.StaticCanvas is already defined.");
        else {
            var t = fabric.util.object.extend,
                e = fabric.util.getElementOffset,
                i = fabric.util.removeFromArray,
                r = fabric.util.toFixed,
                n = fabric.util.transformPoint,
                s = fabric.util.invertTransform,
                o = new Error("Could not initialize `canvas` element");
            fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
                initialize: function(t, e) {
                    e || (e = {}), this._initStatic(t, e)
                },
                backgroundColor: "",
                backgroundImage: null,
                overlayColor: "",
                overlayImage: null,
                includeDefaultValues: !0,
                stateful: !1,
                renderOnAddRemove: !0,
                clipTo: null,
                controlsAboveOverlay: !1,
                allowTouchScrolling: !1,
                imageSmoothingEnabled: !0,
                viewportTransform: fabric.iMatrix.concat(),
                backgroundVpt: !0,
                overlayVpt: !0,
                onBeforeScaleRotate: function() {},
                enableRetinaScaling: !0,
                vptCoords: {},
                skipOffscreen: !1,
                _initStatic: function(t, e) {
                    var i = fabric.StaticCanvas.prototype.renderAll.bind(this);
                    this._objects = [], this._createLowerCanvas(t), this._initOptions(e), this._setImageSmoothing(), this.interactive || this._initRetinaScaling(), e.overlayImage && this.setOverlayImage(e.overlayImage, i), e.backgroundImage && this.setBackgroundImage(e.backgroundImage, i), e.backgroundColor && this.setBackgroundColor(e.backgroundColor, i), e.overlayColor && this.setOverlayColor(e.overlayColor, i), this.calcOffset()
                },
                _isRetinaScaling: function() {
                    return 1 !== fabric.devicePixelRatio && this.enableRetinaScaling
                },
                getRetinaScaling: function() {
                    return this._isRetinaScaling() ? fabric.devicePixelRatio : 1
                },
                _initRetinaScaling: function() {
                    this._isRetinaScaling() && (this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio))
                },
                calcOffset: function() {
                    return this._offset = e(this.lowerCanvasEl), this
                },
                setOverlayImage: function(t, e, i) {
                    return this.__setBgOverlayImage("overlayImage", t, e, i)
                },
                setBackgroundImage: function(t, e, i) {
                    return this.__setBgOverlayImage("backgroundImage", t, e, i)
                },
                setOverlayColor: function(t, e) {
                    return this.__setBgOverlayColor("overlayColor", t, e)
                },
                setBackgroundColor: function(t, e) {
                    return this.__setBgOverlayColor("backgroundColor", t, e)
                },
                _setImageSmoothing: function() {
                    var t = this.getContext();
                    t.imageSmoothingEnabled = t.imageSmoothingEnabled || t.webkitImageSmoothingEnabled || t.mozImageSmoothingEnabled || t.msImageSmoothingEnabled || t.oImageSmoothingEnabled, t.imageSmoothingEnabled = this.imageSmoothingEnabled
                },
                __setBgOverlayImage: function(t, e, i, r) {
                    return "string" == typeof e ? fabric.util.loadImage(e, function(e) {
                        e && (this[t] = new fabric.Image(e, r)), i && i(e)
                    }, this, r && r.crossOrigin) : (r && e.setOptions(r), this[t] = e, i && i(e)), this
                },
                __setBgOverlayColor: function(t, e, i) {
                    return this[t] = e, this._initGradient(e, t), this._initPattern(e, t, i), this
                },
                _createCanvasElement: function(t) {
                    var e = fabric.util.createCanvasElement(t);
                    if(e.style || (e.style = {}), !e) throw o;
                    if(void 0 === e.getContext) throw o;
                    return e
                },
                _initOptions: function(t) {
                    this._setOptions(t), this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0, this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0, this.lowerCanvasEl.style && (this.lowerCanvasEl.width = this.width, this.lowerCanvasEl.height = this.height, this.lowerCanvasEl.style.width = this.width + "px", this.lowerCanvasEl.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
                },
                _createLowerCanvas: function(t) {
                    this.lowerCanvasEl = fabric.util.getById(t) || this._createCanvasElement(t), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d")
                },
                getWidth: function() {
                    return this.width
                },
                getHeight: function() {
                    return this.height
                },
                setWidth: function(t, e) {
                    return this.setDimensions({
                        width: t
                    }, e)
                },
                setHeight: function(t, e) {
                    return this.setDimensions({
                        height: t
                    }, e)
                },
                setDimensions: function(t, e) {
                    var i;
                    e = e || {};
                    for(var r in t) i = t[r], e.cssOnly || (this._setBackstoreDimension(r, t[r]), i += "px"), e.backstoreOnly || this._setCssDimension(r, i);
                    return this._initRetinaScaling(), this._setImageSmoothing(), this.calcOffset(), e.cssOnly || this.renderAll(), this
                },
                _setBackstoreDimension: function(t, e) {
                    return this.lowerCanvasEl[t] = e, this.upperCanvasEl && (this.upperCanvasEl[t] = e), this.cacheCanvasEl && (this.cacheCanvasEl[t] = e), this[t] = e, this
                },
                _setCssDimension: function(t, e) {
                    return this.lowerCanvasEl.style[t] = e, this.upperCanvasEl && (this.upperCanvasEl.style[t] = e), this.wrapperEl && (this.wrapperEl.style[t] = e), this
                },
                getZoom: function() {
                    return this.viewportTransform[0]
                },
                setViewportTransform: function(t) {
                    var e, i = this._activeGroup;
                    this.viewportTransform = t;
                    for(var r = 0, n = this._objects.length; r < n; r++)(e = this._objects[r]).group || e.setCoords(!1, !0);
                    return i && i.setCoords(!1, !0), this.calcViewportBoundaries(), this.renderAll(), this
                },
                zoomToPoint: function(t, e) {
                    var i = t,
                        r = this.viewportTransform.slice(0);
                    t = n(t, s(this.viewportTransform)), r[0] = e, r[3] = e;
                    var o = n(t, r);
                    return r[4] += i.x - o.x, r[5] += i.y - o.y, this.setViewportTransform(r)
                },
                setZoom: function(t) {
                    return this.zoomToPoint(new fabric.Point(0, 0), t), this
                },
                absolutePan: function(t) {
                    var e = this.viewportTransform.slice(0);
                    return e[4] = -t.x, e[5] = -t.y, this.setViewportTransform(e)
                },
                relativePan: function(t) {
                    return this.absolutePan(new fabric.Point(-t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5]))
                },
                getElement: function() {
                    return this.lowerCanvasEl
                },
                _onObjectAdded: function(t) {
                    this.stateful && t.setupState(), t._set("canvas", this), t.setCoords(), this.fire("object:added", {
                        target: t
                    }), t.fire("added")
                },
                _onObjectRemoved: function(t) {
                    this.fire("object:removed", {
                        target: t
                    }), t.fire("removed"), delete t.canvas
                },
                clearContext: function(t) {
                    return t.clearRect(0, 0, this.width, this.height), this
                },
                getContext: function() {
                    return this.contextContainer
                },
                clear: function() {
                    return this._objects.length = 0, this.backgroundImage = null, this.overlayImage = null, this.backgroundColor = "", this.overlayColor = "", this._hasITextHandlers && (this.off("mouse:up", this._mouseUpITextHandler), this._iTextInstances = null, this._hasITextHandlers = !1), this.clearContext(this.contextContainer), this.fire("canvas:cleared"), this.renderAll(), this
                },
                renderAll: function() {
                    var t = this.contextContainer;
                    return this.renderCanvas(t, this._objects), this
                },
                calcViewportBoundaries: function() {
                    var t = {},
                        e = this.getWidth(),
                        i = this.getHeight(),
                        r = s(this.viewportTransform);
                    return t.tl = n({
                        x: 0,
                        y: 0
                    }, r), t.br = n({
                        x: e,
                        y: i
                    }, r), t.tr = new fabric.Point(t.br.x, t.tl.y), t.bl = new fabric.Point(t.tl.x, t.br.y), this.vptCoords = t, t
                },
                renderCanvas: function(t, e) {
                    this.calcViewportBoundaries(), this.clearContext(t), this.fire("before:render"), this.clipTo && fabric.util.clipContext(this, t), this._renderBackground(t), t.save(), t.transform.apply(t, this.viewportTransform), this._renderObjects(t, e), t.restore(), !this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.clipTo && t.restore(), this._renderOverlay(t), this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.fire("after:render")
                },
                _renderObjects: function(t, e) {
                    for(var i = 0, r = e.length; i < r; ++i) e[i] && e[i].render(t)
                },
                _renderBackgroundOrOverlay: function(t, e) {
                    var i = this[e + "Color"];
                    i && (t.fillStyle = i.toLive ? i.toLive(t, this) : i, t.fillRect(i.offsetX || 0, i.offsetY || 0, this.width, this.height)), (i = this[e + "Image"]) && (this[e + "Vpt"] && (t.save(), t.transform.apply(t, this.viewportTransform)), i.render(t), this[e + "Vpt"] && t.restore())
                },
                _renderBackground: function(t) {
                    this._renderBackgroundOrOverlay(t, "background")
                },
                _renderOverlay: function(t) {
                    this._renderBackgroundOrOverlay(t, "overlay")
                },
                getCenter: function() {
                    return {
                        top: this.getHeight() / 2,
                        left: this.getWidth() / 2
                    }
                },
                centerObjectH: function(t) {
                    return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y))
                },
                centerObjectV: function(t) {
                    return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top))
                },
                centerObject: function(t) {
                    var e = this.getCenter();
                    return this._centerObject(t, new fabric.Point(e.left, e.top))
                },
                viewportCenterObject: function(t) {
                    var e = this.getVpCenter();
                    return this._centerObject(t, e)
                },
                viewportCenterObjectH: function(t) {
                    var e = this.getVpCenter();
                    return this._centerObject(t, new fabric.Point(e.x, t.getCenterPoint().y)), this
                },
                viewportCenterObjectV: function(t) {
                    var e = this.getVpCenter();
                    return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, e.y))
                },
                getVpCenter: function() {
                    var t = this.getCenter(),
                        e = s(this.viewportTransform);
                    return n({
                        x: t.left,
                        y: t.top
                    }, e)
                },
                _centerObject: function(t, e) {
                    return t.setPositionByOrigin(e, "center", "center"), this.renderAll(), this
                },
                toDatalessJSON: function(t) {
                    return this.toDatalessObject(t)
                },
                toObject: function(t) {
                    return this._toObjectMethod("toObject", t)
                },
                toDatalessObject: function(t) {
                    return this._toObjectMethod("toDatalessObject", t)
                },
                _toObjectMethod: function(e, i) {
                    var r = {
                        objects: this._toObjects(e, i)
                    };
                    return t(r, this.__serializeBgOverlay(e, i)), fabric.util.populateWithProperties(this, r, i), r
                },
                _toObjects: function(t, e) {
                    return this.getObjects().filter(function(t) {
                        return !t.excludeFromExport
                    }).map(function(i) {
                        return this._toObject(i, t, e)
                    }, this)
                },
                _toObject: function(t, e, i) {
                    var r;
                    this.includeDefaultValues || (r = t.includeDefaultValues, t.includeDefaultValues = !1);
                    var n = t[e](i);
                    return this.includeDefaultValues || (t.includeDefaultValues = r), n
                },
                __serializeBgOverlay: function(t, e) {
                    var i = {},
                        r = this.backgroundImage,
                        n = this.overlayImage;
                    return this.backgroundColor && (i.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(e) : this.backgroundColor), this.overlayColor && (i.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(e) : this.overlayColor), r && !r.excludeFromExport && (i.backgroundImage = this._toObject(r, t, e)), n && !n.excludeFromExport && (i.overlayImage = this._toObject(n, t, e)), i
                },
                svgViewportTransformation: !0,
                toSVG: function(t, e) {
                    t || (t = {});
                    var i = [];
                    return this._setSVGPreamble(i, t), this._setSVGHeader(i, t), this._setSVGBgOverlayColor(i, "backgroundColor"), this._setSVGBgOverlayImage(i, "backgroundImage", e), this._setSVGObjects(i, e), this._setSVGBgOverlayColor(i, "overlayColor"), this._setSVGBgOverlayImage(i, "overlayImage", e), i.push("</svg>"), i.join("")
                },
                _setSVGPreamble: function(t, e) {
                    e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
                },
                _setSVGHeader: function(t, e) {
                    var i, n = e.width || this.width,
                        s = e.height || this.height,
                        o = 'viewBox="0 0 ' + this.width + " " + this.height + '" ',
                        a = fabric.Object.NUM_FRACTION_DIGITS;
                    e.viewBox ? o = 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ' : this.svgViewportTransformation && (i = this.viewportTransform, o = 'viewBox="' + r(-i[4] / i[0], a) + " " + r(-i[5] / i[3], a) + " " + r(this.width / i[0], a) + " " + r(this.height / i[3], a) + '" '), t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', n, '" ', 'height="', s, '" ', o, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>\n", this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), "</defs>\n")
                },
                createSVGRefElementsMarkup: function() {
                    var t = this;
                    return ["backgroundColor", "overlayColor"].map(function(e) {
                        var i = t[e];
                        if(i && i.toLive) return i.toSVG(t, !1)
                    }).join("")
                },
                createSVGFontFacesMarkup: function() {
                    for(var t, e, i, r, n, s, o = "", a = {}, h = fabric.fontPaths, c = this.getObjects(), l = 0, u = c.length; l < u; l++)
                        if(t = c[l], e = t.fontFamily, -1 !== t.type.indexOf("text") && !a[e] && h[e] && (a[e] = !0, t.styles)) {
                            i = t.styles;
                            for(n in i) {
                                r = i[n];
                                for(s in r) !a[e = r[s].fontFamily] && h[e] && (a[e] = !0)
                            }
                        }
                    for(var f in a) o += ["\t\t@font-face {\n", "\t\t\tfont-family: '", f, "';\n", "\t\t\tsrc: url('", h[f], "');\n", "\t\t}\n"].join("");
                    return o && (o = ['\t<style type="text/css">', "<![CDATA[\n", o, "]]>", "</style>\n"].join("")), o
                },
                _setSVGObjects: function(t, e) {
                    for(var i, r = 0, n = this.getObjects(), s = n.length; r < s; r++)(i = n[r]).excludeFromExport || this._setSVGObject(t, i, e)
                },
                _setSVGObject: function(t, e, i) {
                    t.push(e.toSVG(i))
                },
                _setSVGBgOverlayImage: function(t, e, i) {
                    this[e] && this[e].toSVG && t.push(this[e].toSVG(i))
                },
                _setSVGBgOverlayColor: function(t, e) {
                    var i = this[e];
                    if(i)
                        if(i.toLive) {
                            var r = i.repeat;
                            t.push('<rect transform="translate(', this.width / 2, ",", this.height / 2, ')"', ' x="', i.offsetX - this.width / 2, '" y="', i.offsetY - this.height / 2, '" ', 'width="', "repeat-y" === r || "no-repeat" === r ? i.source.width : this.width, '" height="', "repeat-x" === r || "no-repeat" === r ? i.source.height : this.height, '" fill="url(#SVGID_' + i.id + ')"', "></rect>\n")
                        } else t.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[e], '"', "></rect>\n")
                },
                sendToBack: function(t) {
                    if(!t) return this;
                    var e, r, n, s = this._activeGroup;
                    if(t === s)
                        for(e = (n = s._objects).length; e--;) r = n[e], i(this._objects, r), this._objects.unshift(r);
                    else i(this._objects, t), this._objects.unshift(t);
                    return this.renderAll && this.renderAll()
                },
                bringToFront: function(t) {
                    if(!t) return this;
                    var e, r, n, s = this._activeGroup;
                    if(t === s)
                        for(n = s._objects, e = 0; e < n.length; e++) r = n[e], i(this._objects, r), this._objects.push(r);
                    else i(this._objects, t), this._objects.push(t);
                    return this.renderAll && this.renderAll()
                },
                sendBackwards: function(t, e) {
                    if(!t) return this;
                    var r, n, s, o, a, h = this._activeGroup,
                        c = 0;
                    if(t === h)
                        for(a = h._objects, r = 0; r < a.length; r++) n = a[r], (s = this._objects.indexOf(n)) > 0 + c && (o = s - 1, i(this._objects, n), this._objects.splice(o, 0, n)), c++;
                    else 0 !== (s = this._objects.indexOf(t)) && (o = this._findNewLowerIndex(t, s, e), i(this._objects, t), this._objects.splice(o, 0, t));
                    return this.renderAll && this.renderAll(), this
                },
                _findNewLowerIndex: function(t, e, i) {
                    var r;
                    if(i) {
                        r = e;
                        for(var n = e - 1; n >= 0; --n) {
                            if(t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) {
                                r = n;
                                break
                            }
                        }
                    } else r = e - 1;
                    return r
                },
                bringForward: function(t, e) {
                    if(!t) return this;
                    var r, n, s, o, a, h = this._activeGroup,
                        c = 0;
                    if(t === h)
                        for(r = (a = h._objects).length; r--;) n = a[r], (s = this._objects.indexOf(n)) < this._objects.length - 1 - c && (o = s + 1, i(this._objects, n), this._objects.splice(o, 0, n)), c++;
                    else(s = this._objects.indexOf(t)) !== this._objects.length - 1 && (o = this._findNewUpperIndex(t, s, e), i(this._objects, t), this._objects.splice(o, 0, t));
                    return this.renderAll && this.renderAll(), this
                },
                _findNewUpperIndex: function(t, e, i) {
                    var r;
                    if(i) {
                        r = e;
                        for(var n = e + 1; n < this._objects.length; ++n) {
                            if(t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) {
                                r = n;
                                break
                            }
                        }
                    } else r = e + 1;
                    return r
                },
                moveTo: function(t, e) {
                    return i(this._objects, t), this._objects.splice(e, 0, t), this.renderAll && this.renderAll()
                },
                dispose: function() {
                    return this.clear(), this
                },
                toString: function() {
                    return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
                }
            }), t(fabric.StaticCanvas.prototype, fabric.Observable), t(fabric.StaticCanvas.prototype, fabric.Collection), t(fabric.StaticCanvas.prototype, fabric.DataURLExporter), t(fabric.StaticCanvas, {
                EMPTY_JSON: '{"objects": [], "background": "white"}',
                supports: function(t) {
                    var e = fabric.util.createCanvasElement();
                    if(!e || !e.getContext) return null;
                    var i = e.getContext("2d");
                    if(!i) return null;
                    switch(t) {
                        case "getImageData":
                            return void 0 !== i.getImageData;
                        case "setLineDash":
                            return void 0 !== i.setLineDash;
                        case "toDataURL":
                            return void 0 !== e.toDataURL;
                        case "toDataURLWithQuality":
                            try {
                                return e.toDataURL("image/jpeg", 0), !0
                            } catch(t) {}
                            return !1;
                        default:
                            return null
                    }
                }
            }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
        }
    }(), fabric.BaseBrush = fabric.util.createClass({
        color: "rgb(0, 0, 0)",
        width: 1,
        shadow: null,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        strokeDashArray: null,
        setShadow: function(t) {
            return this.shadow = new fabric.Shadow(t), this
        },
        _setBrushStyles: function() {
            var t = this.canvas.contextTop;
            t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.lineJoin = this.strokeLineJoin, this.strokeDashArray && fabric.StaticCanvas.supports("setLineDash") && t.setLineDash(this.strokeDashArray)
        },
        _setShadow: function() {
            if(this.shadow) {
                var t = this.canvas.contextTop,
                    e = this.canvas.getZoom();
                t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * e, t.shadowOffsetX = this.shadow.offsetX * e, t.shadowOffsetY = this.shadow.offsetY * e
            }
        },
        _resetShadow: function() {
            var t = this.canvas.contextTop;
            t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
        }
    }), fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        initialize: function(t) {
            this.canvas = t, this._points = []
        },
        onMouseDown: function(t) {
            this._prepareForDrawing(t), this._captureDrawingPath(t), this._render()
        },
        onMouseMove: function(t) {
            this._captureDrawingPath(t), this.canvas.clearContext(this.canvas.contextTop), this._render()
        },
        onMouseUp: function() {
            this._finalizeAndAddPath()
        },
        _prepareForDrawing: function(t) {
            var e = new fabric.Point(t.x, t.y);
            this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y)
        },
        _addPoint: function(t) {
            this._points.length > 1 && t.eq(this._points[this._points.length - 1]) || this._points.push(t)
        },
        _reset: function() {
            this._points.length = 0, this._setBrushStyles(), this._setShadow()
        },
        _captureDrawingPath: function(t) {
            var e = new fabric.Point(t.x, t.y);
            this._addPoint(e)
        },
        _render: function() {
            var t, e, i = this.canvas.contextTop,
                r = this.canvas.viewportTransform,
                n = this._points[0],
                s = this._points[1];
            if(i.save(), i.transform(r[0], r[1], r[2], r[3], r[4], r[5]), i.beginPath(), 2 === this._points.length && n.x === s.x && n.y === s.y) {
                var o = this.width / 1e3;
                n = new fabric.Point(n.x, n.y), s = new fabric.Point(s.x, s.y), n.x -= o, s.x += o
            }
            for(i.moveTo(n.x, n.y), t = 1, e = this._points.length; t < e; t++) {
                var a = n.midPointFrom(s);
                i.quadraticCurveTo(n.x, n.y, a.x, a.y), n = this._points[t], s = this._points[t + 1]
            }
            i.lineTo(n.x, n.y), i.stroke(), i.restore()
        },
        convertPointsToSVGPath: function(t) {
            var e, i = [],
                r = this.width / 1e3,
                n = new fabric.Point(t[0].x, t[0].y),
                s = new fabric.Point(t[1].x, t[1].y),
                o = t.length,
                a = 1,
                h = 1,
                c = o > 2;
            for(c && (a = t[2].x < s.x ? -1 : t[2].x === s.x ? 0 : 1, h = t[2].y < s.y ? -1 : t[2].y === s.y ? 0 : 1), i.push("M ", n.x - a * r, " ", n.y - h * r, " "), e = 1; e < o; e++) {
                if(!n.eq(s)) {
                    var l = n.midPointFrom(s);
                    i.push("Q ", n.x, " ", n.y, " ", l.x, " ", l.y, " ")
                }
                n = t[e], e + 1 < t.length && (s = t[e + 1])
            }
            return c && (a = n.x > t[e - 2].x ? 1 : n.x === t[e - 2].x ? 0 : -1, h = n.y > t[e - 2].y ? 1 : n.y === t[e - 2].y ? 0 : -1), i.push("L ", n.x + a * r, " ", n.y + h * r), i
        },
        createPath: function(t) {
            var e = new fabric.Path(t, {
                    fill: null,
                    stroke: this.color,
                    strokeWidth: this.width,
                    strokeLineCap: this.strokeLineCap,
                    strokeLineJoin: this.strokeLineJoin,
                    strokeDashArray: this.strokeDashArray,
                    originX: "center",
                    originY: "center"
                }),
                i = new fabric.Point(e.left, e.top);
            return e.originX = fabric.Object.prototype.originX, e.originY = fabric.Object.prototype.originY, i = e.translateToGivenOrigin(i, "center", "center", e.originX, e.originY), e.top = i.y, e.left = i.x, this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)), e
        },
        _finalizeAndAddPath: function() {
            this.canvas.contextTop.closePath();
            var t = this.convertPointsToSVGPath(this._points).join("");
            if("M 0 0 Q 0 0 0 0 L 0 0" !== t) {
                var e = this.createPath(t);
                this.canvas.add(e), e.setCoords(), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderAll(), this.canvas.fire("path:created", {
                    path: e
                })
            } else this.canvas.renderAll()
        }
    }), fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        initialize: function(t) {
            this.canvas = t, this.points = []
        },
        drawDot: function(t) {
            var e = this.addPoint(t),
                i = this.canvas.contextTop,
                r = this.canvas.viewportTransform;
            i.save(), i.transform(r[0], r[1], r[2], r[3], r[4], r[5]), i.fillStyle = e.fill, i.beginPath(), i.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1), i.closePath(), i.fill(), i.restore()
        },
        onMouseDown: function(t) {
            this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t)
        },
        onMouseMove: function(t) {
            this.drawDot(t)
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for(var e = [], i = 0, r = this.points.length; i < r; i++) {
                var n = this.points[i],
                    s = new fabric.Circle({
                        radius: n.radius,
                        left: n.x,
                        top: n.y,
                        originX: "center",
                        originY: "center",
                        fill: n.fill
                    });
                this.shadow && s.setShadow(this.shadow), e.push(s)
            }
            var o = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            o.canvas = this.canvas, this.canvas.add(o), this.canvas.fire("path:created", {
                path: o
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.renderAll()
        },
        addPoint: function(t) {
            var e = new fabric.Point(t.x, t.y),
                i = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
                r = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
            return e.radius = i, e.fill = r, this.points.push(e), e
        }
    }), fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        density: 20,
        dotWidth: 1,
        dotWidthVariance: 1,
        randomOpacity: !1,
        optimizeOverlapping: !0,
        initialize: function(t) {
            this.canvas = t, this.sprayChunks = []
        },
        onMouseDown: function(t) {
            this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.render()
        },
        onMouseMove: function(t) {
            this.addSprayChunk(t), this.render()
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for(var e = [], i = 0, r = this.sprayChunks.length; i < r; i++)
                for(var n = this.sprayChunks[i], s = 0, o = n.length; s < o; s++) {
                    var a = new fabric.Rect({
                        width: n[s].width,
                        height: n[s].width,
                        left: n[s].x + 1,
                        top: n[s].y + 1,
                        originX: "center",
                        originY: "center",
                        fill: this.color
                    });
                    this.shadow && a.setShadow(this.shadow), e.push(a)
                }
            this.optimizeOverlapping && (e = this._getOptimizedRects(e));
            var h = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            h.canvas = this.canvas, this.canvas.add(h), this.canvas.fire("path:created", {
                path: h
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.renderAll()
        },
        _getOptimizedRects: function(t) {
            for(var e, i = {}, r = 0, n = t.length; r < n; r++) i[e = t[r].left + "" + t[r].top] || (i[e] = t[r]);
            var s = [];
            for(e in i) s.push(i[e]);
            return s
        },
        render: function() {
            var t = this.canvas.contextTop;
            t.fillStyle = this.color;
            var e = this.canvas.viewportTransform;
            t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
            for(var i = 0, r = this.sprayChunkPoints.length; i < r; i++) {
                var n = this.sprayChunkPoints[i];
                void 0 !== n.opacity && (t.globalAlpha = n.opacity), t.fillRect(n.x, n.y, n.width, n.width)
            }
            t.restore()
        },
        addSprayChunk: function(t) {
            this.sprayChunkPoints = [];
            for(var e, i, r, n = this.width / 2, s = 0; s < this.density; s++) {
                e = fabric.util.getRandomInt(t.x - n, t.x + n), i = fabric.util.getRandomInt(t.y - n, t.y + n), r = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
                var o = new fabric.Point(e, i);
                o.width = r, this.randomOpacity && (o.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(o)
            }
            this.sprayChunks.push(this.sprayChunkPoints)
        }
    }), fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
        getPatternSrc: function() {
            var t = fabric.document.createElement("canvas"),
                e = t.getContext("2d");
            return t.width = t.height = 25, e.fillStyle = this.color, e.beginPath(), e.arc(10, 10, 10, 0, 2 * Math.PI, !1), e.closePath(), e.fill(), t
        },
        getPatternSrcFunction: function() {
            return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
        },
        getPattern: function() {
            return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
        },
        _setBrushStyles: function() {
            this.callSuper("_setBrushStyles"), this.canvas.contextTop.strokeStyle = this.getPattern()
        },
        createPath: function(t) {
            var e = this.callSuper("createPath", t),
                i = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
            return e.stroke = new fabric.Pattern({
                source: this.source || this.getPatternSrcFunction(),
                offsetX: -i.x,
                offsetY: -i.y
            }), e
        }
    }),
    function() {
        var t = fabric.util.getPointer,
            e = fabric.util.degreesToRadians,
            i = fabric.util.radiansToDegrees,
            r = Math.atan2,
            n = Math.abs,
            s = fabric.StaticCanvas.supports("setLineDash");
        fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
            initialize: function(t, e) {
                e || (e = {}), this._initStatic(t, e), this._initInteractive(), this._createCacheCanvas()
            },
            uniScaleTransform: !1,
            uniScaleKey: "shiftKey",
            centeredScaling: !1,
            centeredRotation: !1,
            centeredKey: "altKey",
            altActionKey: "shiftKey",
            interactive: !0,
            selection: !0,
            selectionKey: "shiftKey",
            altSelectionKey: null,
            selectionColor: "rgba(100, 100, 255, 0.3)",
            selectionDashArray: [],
            selectionBorderColor: "rgba(255, 255, 255, 0.3)",
            selectionLineWidth: 1,
            hoverCursor: "move",
            moveCursor: "move",
            defaultCursor: "default",
            freeDrawingCursor: "crosshair",
            rotationCursor: "crosshair",
            containerClass: "canvas-container",
            perPixelTargetFind: !1,
            targetFindTolerance: 0,
            skipTargetFind: !1,
            isDrawingMode: !1,
            preserveObjectStacking: !1,
            snapAngle: 0,
            snapThreshold: null,
            stopContextMenu: !1,
            fireRightClick: !1,
            fireMiddleClick: !1,
            _initInteractive: function() {
                this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this._initRetinaScaling(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset()
            },
            _chooseObjectsToRender: function() {
                var t, e = this.getActiveGroup(),
                    i = this.getActiveObject(),
                    r = [],
                    n = [];
                if(!e && !i || this.preserveObjectStacking) r = this._objects;
                else {
                    for(var s = 0, o = this._objects.length; s < o; s++) t = this._objects[s], e && e.contains(t) || t === i ? n.push(t) : r.push(t);
                    e && (e._set("_objects", n), r.push(e)), i && r.push(i)
                }
                return r
            },
            renderAll: function() {
                !this.contextTopDirty || this._groupSelector || this.isDrawingMode || (this.clearContext(this.contextTop), this.contextTopDirty = !1);
                var t = this.contextContainer;
                return this.renderCanvas(t, this._chooseObjectsToRender()), this
            },
            renderTop: function() {
                var t = this.contextTop;
                return this.clearContext(t), this.selection && this._groupSelector && this._drawSelection(t), this.fire("after:render"), this.contextTopDirty = !0, this
            },
            _resetCurrentTransform: function() {
                var t = this._currentTransform;
                t.target.set({
                    scaleX: t.original.scaleX,
                    scaleY: t.original.scaleY,
                    skewX: t.original.skewX,
                    skewY: t.original.skewY,
                    left: t.original.left,
                    top: t.original.top
                }), this._shouldCenterTransform(t.target) ? "rotate" === t.action ? this._setOriginToCenter(t.target) : ("center" !== t.originX && ("right" === t.originX ? t.mouseXSign = -1 : t.mouseXSign = 1), "center" !== t.originY && ("bottom" === t.originY ? t.mouseYSign = -1 : t.mouseYSign = 1), t.originX = "center", t.originY = "center") : (t.originX = t.original.originX, t.originY = t.original.originY)
            },
            containsPoint: function(t, e, i) {
                var r, n = i || this.getPointer(t, !0);
                return r = e.group && e.group === this.getActiveGroup() ? this._normalizePointer(e.group, n) : {
                    x: n.x,
                    y: n.y
                }, e.containsPoint(r) || e._findTargetCorner(n)
            },
            _normalizePointer: function(t, e) {
                var i = t.calcTransformMatrix(),
                    r = fabric.util.invertTransform(i),
                    n = this.restorePointerVpt(e);
                return fabric.util.transformPoint(n, r)
            },
            isTargetTransparent: function(t, e, i) {
                var r = t.hasBorders,
                    n = t.transparentCorners,
                    s = this.contextCache,
                    o = t.selectionBackgroundColor;
                t.hasBorders = t.transparentCorners = !1, t.selectionBackgroundColor = "", s.save(), s.transform.apply(s, this.viewportTransform), t.render(s), s.restore(), t.active && t._renderControls(s), t.hasBorders = r, t.transparentCorners = n, t.selectionBackgroundColor = o;
                var a = fabric.util.isTransparent(s, e, i, this.targetFindTolerance);
                return this.clearContext(s), a
            },
            _shouldClearSelection: function(t, e) {
                var i = this.getActiveGroup(),
                    r = this.getActiveObject();
                return !e || e && i && !i.contains(e) && i !== e && !t[this.selectionKey] || e && !e.evented || e && !e.selectable && r && r !== e
            },
            _shouldCenterTransform: function(t) {
                if(t) {
                    var e, i = this._currentTransform;
                    return "scale" === i.action || "scaleX" === i.action || "scaleY" === i.action ? e = this.centeredScaling || t.centeredScaling : "rotate" === i.action && (e = this.centeredRotation || t.centeredRotation), e ? !i.altKey : i.altKey
                }
            },
            _getOriginFromCorner: function(t, e) {
                var i = {
                    x: t.originX,
                    y: t.originY
                };
                return "ml" === e || "tl" === e || "bl" === e ? i.x = "right" : "mr" !== e && "tr" !== e && "br" !== e || (i.x = "left"), "tl" === e || "mt" === e || "tr" === e ? i.y = "bottom" : "bl" !== e && "mb" !== e && "br" !== e || (i.y = "top"), i
            },
            _getActionFromCorner: function(t, e, i) {
                if(!e) return "drag";
                switch(e) {
                    case "mtr":
                        return "rotate";
                    case "ml":
                    case "mr":
                        return i[this.altActionKey] ? "skewY" : "scaleX";
                    case "mt":
                    case "mb":
                        return i[this.altActionKey] ? "skewX" : "scaleY";
                    default:
                        return "scale"
                }
            },
            _setupCurrentTransform: function(t, i) {
                if(i) {
                    var r = this.getPointer(t),
                        n = i._findTargetCorner(this.getPointer(t, !0)),
                        s = this._getActionFromCorner(i, n, t),
                        o = this._getOriginFromCorner(i, n);
                    this._currentTransform = {
                        target: i,
                        action: s,
                        corner: n,
                        scaleX: i.scaleX,
                        scaleY: i.scaleY,
                        skewX: i.skewX,
                        skewY: i.skewY,
                        offsetX: r.x - i.left,
                        offsetY: r.y - i.top,
                        originX: o.x,
                        originY: o.y,
                        ex: r.x,
                        ey: r.y,
                        lastX: r.x,
                        lastY: r.y,
                        left: i.left,
                        top: i.top,
                        theta: e(i.angle),
                        width: i.width * i.scaleX,
                        mouseXSign: 1,
                        mouseYSign: 1,
                        shiftKey: t.shiftKey,
                        altKey: t[this.centeredKey]
                    }, this._currentTransform.original = {
                        left: i.left,
                        top: i.top,
                        scaleX: i.scaleX,
                        scaleY: i.scaleY,
                        skewX: i.skewX,
                        skewY: i.skewY,
                        originX: o.x,
                        originY: o.y
                    }, this._resetCurrentTransform()
                }
            },
            _translateObject: function(t, e) {
                var i = this._currentTransform,
                    r = i.target,
                    n = t - i.offsetX,
                    s = e - i.offsetY,
                    o = !r.get("lockMovementX") && r.left !== n,
                    a = !r.get("lockMovementY") && r.top !== s;
                return o && r.set("left", n), a && r.set("top", s), o || a
            },
            _changeSkewTransformOrigin: function(t, e, i) {
                var r = "originX",
                    n = {
                        0: "center"
                    },
                    s = e.target.skewX,
                    o = "left",
                    a = "right",
                    h = "mt" === e.corner || "ml" === e.corner ? 1 : -1,
                    c = 1;
                t = t > 0 ? 1 : -1, "y" === i && (s = e.target.skewY, o = "top", a = "bottom", r = "originY"), n[-1] = o, n[1] = a, e.target.flipX && (c *= -1), e.target.flipY && (c *= -1), 0 === s ? (e.skewSign = -h * t * c, e[r] = n[-t]) : (s = s > 0 ? 1 : -1, e.skewSign = s, e[r] = n[s * h * c])
            },
            _skewObject: function(t, e, i) {
                var r = this._currentTransform,
                    n = r.target,
                    s = !1,
                    o = n.get("lockSkewingX"),
                    a = n.get("lockSkewingY");
                if(o && "x" === i || a && "y" === i) return !1;
                var h, c, l = n.getCenterPoint(),
                    u = n.toLocalPoint(new fabric.Point(t, e), "center", "center")[i],
                    f = n.toLocalPoint(new fabric.Point(r.lastX, r.lastY), "center", "center")[i],
                    d = n._getTransformedDimensions();
                return this._changeSkewTransformOrigin(u - f, r, i), h = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY)[i], c = n.translateToOriginPoint(l, r.originX, r.originY), s = this._setObjectSkew(h, r, i, d), r.lastX = t, r.lastY = e, n.setPositionByOrigin(c, r.originX, r.originY), s
            },
            _setObjectSkew: function(t, e, i, r) {
                var n, s, o, a, h, c, l, u, f, d = e.target,
                    g = !1,
                    p = e.skewSign;
                return "x" === i ? (a = "y", h = "Y", c = "X", u = 0, f = d.skewY) : (a = "x", h = "X", c = "Y", u = d.skewX, f = 0), o = d._getTransformedDimensions(u, f), (l = 2 * Math.abs(t) - o[i]) <= 2 ? n = 0 : (n = p * Math.atan(l / d["scale" + c] / (o[a] / d["scale" + h])), n = fabric.util.radiansToDegrees(n)), g = d["skew" + c] !== n, d.set("skew" + c, n), 0 !== d["skew" + h] && (s = d._getTransformedDimensions(), n = r[a] / s[a] * d["scale" + h], d.set("scale" + h, n)), g
            },
            _scaleObject: function(t, e, i) {
                var r = this._currentTransform,
                    n = r.target,
                    s = n.get("lockScalingX"),
                    o = n.get("lockScalingY"),
                    a = n.get("lockScalingFlip");
                if(s && o) return !1;
                var h = n.translateToOriginPoint(n.getCenterPoint(), r.originX, r.originY),
                    c = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY),
                    l = n._getTransformedDimensions(),
                    u = !1;
                return this._setLocalMouse(c, r), u = this._setObjectScale(c, r, s, o, i, a, l), n.setPositionByOrigin(h, r.originX, r.originY), u
            },
            _setObjectScale: function(t, e, i, r, n, s, o) {
                var a, h, c, l, u = e.target,
                    f = !1,
                    d = !1,
                    g = !1;
                return c = t.x * u.scaleX / o.x, l = t.y * u.scaleY / o.y, a = u.scaleX !== c, h = u.scaleY !== l, s && c <= 0 && c < u.scaleX && (f = !0), s && l <= 0 && l < u.scaleY && (d = !0), "equally" !== n || i || r ? n ? "x" !== n || u.get("lockUniScaling") ? "y" !== n || u.get("lockUniScaling") || d || r || u.set("scaleY", l) && (g = g || h) : f || i || u.set("scaleX", c) && (g = g || a) : (f || i || u.set("scaleX", c) && (g = g || a), d || r || u.set("scaleY", l) && (g = g || h)) : f || d || (g = this._scaleObjectEqually(t, u, e, o)), e.newScaleX = c, e.newScaleY = l, f || d || this._flipObject(e, n), g
            },
            _scaleObjectEqually: function(t, e, i, r) {
                var n, s = t.y + t.x,
                    o = r.y * i.original.scaleY / e.scaleY + r.x * i.original.scaleX / e.scaleX,
                    a = t.x / Math.abs(t.x),
                    h = t.y / Math.abs(t.y);
                return i.newScaleX = a * Math.abs(i.original.scaleX * s / o), i.newScaleY = h * Math.abs(i.original.scaleY * s / o), n = i.newScaleX !== e.scaleX || i.newScaleY !== e.scaleY, e.set("scaleX", i.newScaleX), e.set("scaleY", i.newScaleY), n
            },
            _flipObject: function(t, e) {
                t.newScaleX < 0 && "y" !== e && ("left" === t.originX ? t.originX = "right" : "right" === t.originX && (t.originX = "left")), t.newScaleY < 0 && "x" !== e && ("top" === t.originY ? t.originY = "bottom" : "bottom" === t.originY && (t.originY = "top"))
            },
            _setLocalMouse: function(t, e) {
                var i = e.target,
                    r = this.getZoom(),
                    s = i.padding / r;
                "right" === e.originX ? t.x *= -1 : "center" === e.originX && (t.x *= 2 * e.mouseXSign, t.x < 0 && (e.mouseXSign = -e.mouseXSign)), "bottom" === e.originY ? t.y *= -1 : "center" === e.originY && (t.y *= 2 * e.mouseYSign, t.y < 0 && (e.mouseYSign = -e.mouseYSign)), n(t.x) > s ? t.x < 0 ? t.x += s : t.x -= s : t.x = 0, n(t.y) > s ? t.y < 0 ? t.y += s : t.y -= s : t.y = 0
            },
            _rotateObject: function(t, e) {
                var n = this._currentTransform;
                if(n.target.get("lockRotation")) return !1;
                var s = r(n.ey - n.top, n.ex - n.left),
                    o = r(e - n.top, t - n.left),
                    a = i(o - s + n.theta),
                    h = !0;
                if(n.target.snapAngle > 0) {
                    var c = n.target.snapAngle,
                        l = n.target.snapThreshold || c,
                        u = Math.ceil(a / c) * c,
                        f = Math.floor(a / c) * c;
                    Math.abs(a - f) < l ? a = f : Math.abs(a - u) < l && (a = u)
                }
                return a < 0 && (a = 360 + a), a %= 360, n.target.angle === a ? h = !1 : n.target.angle = a, h
            },
            setCursor: function(t) {
                this.upperCanvasEl.style.cursor = t
            },
            _resetObjectTransform: function(t) {
                t.scaleX = 1, t.scaleY = 1, t.skewX = 0, t.skewY = 0, t.setAngle(0)
            },
            _drawSelection: function(t) {
                var e = this._groupSelector,
                    i = e.left,
                    r = e.top,
                    o = n(i),
                    a = n(r);
                if(this.selectionColor && (t.fillStyle = this.selectionColor, t.fillRect(e.ex - (i > 0 ? 0 : -i), e.ey - (r > 0 ? 0 : -r), o, a)), this.selectionLineWidth && this.selectionBorderColor)
                    if(t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, this.selectionDashArray.length > 1 && !s) {
                        var h = e.ex + .5 - (i > 0 ? 0 : o),
                            c = e.ey + .5 - (r > 0 ? 0 : a);
                        t.beginPath(), fabric.util.drawDashedLine(t, h, c, h + o, c, this.selectionDashArray), fabric.util.drawDashedLine(t, h, c + a - 1, h + o, c + a - 1, this.selectionDashArray), fabric.util.drawDashedLine(t, h, c, h, c + a, this.selectionDashArray), fabric.util.drawDashedLine(t, h + o - 1, c, h + o - 1, c + a, this.selectionDashArray), t.closePath(), t.stroke()
                    } else fabric.Object.prototype._setLineDash.call(this, t, this.selectionDashArray), t.strokeRect(e.ex + .5 - (i > 0 ? 0 : o), e.ey + .5 - (r > 0 ? 0 : a), o, a)
            },
            findTarget: function(t, e) {
                if(!this.skipTargetFind) {
                    var i, r, n = this.getPointer(t, !0),
                        s = this.getActiveGroup(),
                        o = this.getActiveObject();
                    if(this.targets = [], s && !e && s === this._searchPossibleTargets([s], n)) return this._fireOverOutEvents(s, t), s;
                    if(o && o._findTargetCorner(n)) return this._fireOverOutEvents(o, t), o;
                    if(o && o === this._searchPossibleTargets([o], n)) {
                        if(!this.preserveObjectStacking) return this._fireOverOutEvents(o, t), o;
                        i = o, r = this.targets, this.targets = []
                    }
                    var a = this._searchPossibleTargets(this._objects, n);
                    return t[this.altSelectionKey] && a && i && a !== i && (a = i, this.targets = r), this._fireOverOutEvents(a, t), a
                }
            },
            _fireOverOutEvents: function(t, e) {
                var i, r, n = this._hoveredTarget;
                n !== t && (i = {
                    e: e,
                    target: t,
                    previousTarget: this._hoveredTarget
                }, r = {
                    e: e,
                    target: this._hoveredTarget,
                    nextTarget: t
                }, this._hoveredTarget = t), t ? n !== t && (n && (this.fire("mouse:out", r), n.fire("mouseout", r)), this.fire("mouse:over", i), t.fire("mouseover", i)) : n && (this.fire("mouse:out", r), n.fire("mouseout", r))
            },
            _checkTarget: function(t, e) {
                if(e && e.visible && e.evented && this.containsPoint(null, e, t)) {
                    if(!this.perPixelTargetFind && !e.perPixelTargetFind || e.isEditing) return !0;
                    if(!this.isTargetTransparent(e, t.x, t.y)) return !0
                }
            },
            _searchPossibleTargets: function(t, e) {
                for(var i, r, n, s = t.length; s--;)
                    if(this._checkTarget(e, t[s])) {
                        "group" === (i = t[s]).type && i.subTargetCheck && (r = this._normalizePointer(i, e), (n = this._searchPossibleTargets(i._objects, r)) && this.targets.push(n));
                        break
                    }
                return i
            },
            restorePointerVpt: function(t) {
                return fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform))
            },
            getPointer: function(e, i, r) {
                r || (r = this.upperCanvasEl);
                var n, s = t(e),
                    o = r.getBoundingClientRect(),
                    a = o.width || 0,
                    h = o.height || 0;
                return a && h || ("top" in o && "bottom" in o && (h = Math.abs(o.top - o.bottom)), "right" in o && "left" in o && (a = Math.abs(o.right - o.left))), this.calcOffset(), s.x = s.x - this._offset.left, s.y = s.y - this._offset.top, i || (s = this.restorePointerVpt(s)), n = 0 === a || 0 === h ? {
                    width: 1,
                    height: 1
                } : {
                    width: r.width / a,
                    height: r.height / h
                }, {
                    x: s.x * n.width,
                    y: s.y * n.height
                }
            },
            _createUpperCanvas: function() {
                var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
                this.upperCanvasEl ? this.upperCanvasEl.className = "" : this.upperCanvasEl = this._createCanvasElement(), fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + t), this.wrapperEl.appendChild(this.upperCanvasEl), this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext("2d")
            },
            _createCacheCanvas: function() {
                this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute("width", this.width), this.cacheCanvasEl.setAttribute("height", this.height), this.contextCache = this.cacheCanvasEl.getContext("2d")
            },
            _initWrapperElement: function() {
                this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                    class: this.containerClass
                }), fabric.util.setStyle(this.wrapperEl, {
                    width: this.getWidth() + "px",
                    height: this.getHeight() + "px",
                    position: "relative"
                }), fabric.util.makeElementUnselectable(this.wrapperEl)
            },
            _applyCanvasStyle: function(t) {
                var e = this.getWidth() || t.width,
                    i = this.getHeight() || t.height;
                fabric.util.setStyle(t, {
                    position: "absolute",
                    width: e + "px",
                    height: i + "px",
                    left: 0,
                    top: 0,
                    "touch-action": "none"
                }), t.width = e, t.height = i, fabric.util.makeElementUnselectable(t)
            },
            _copyCanvasStyle: function(t, e) {
                e.style.cssText = t.style.cssText
            },
            getSelectionContext: function() {
                return this.contextTop
            },
            getSelectionElement: function() {
                return this.upperCanvasEl
            },
            _setActiveObject: function(t) {
                var e = this._activeObject;
                e && (e.set("active", !1), t !== e && e.onDeselect && "function" == typeof e.onDeselect && e.onDeselect()), this._activeObject = t, t.set("active", !0)
            },
            setActiveObject: function(t, e) {
                var i = this.getActiveObject();
                return i && i !== t && i.fire("deselected", {
                    e: e
                }), this._setActiveObject(t), this.fire("object:selected", {
                    target: t,
                    e: e
                }), t.fire("selected", {
                    e: e
                }), this.renderAll(), this
            },
            getActiveObject: function() {
                return this._activeObject
            },
            _onObjectRemoved: function(t) {
                this.getActiveObject() === t && (this.fire("before:selection:cleared", {
                    target: t
                }), this._discardActiveObject(), this.fire("selection:cleared", {
                    target: t
                }), t.fire("deselected")), this._hoveredTarget === t && (this._hoveredTarget = null), this.callSuper("_onObjectRemoved", t)
            },
            _discardActiveObject: function() {
                var t = this._activeObject;
                t && (t.set("active", !1), t.onDeselect && "function" == typeof t.onDeselect && t.onDeselect()), this._activeObject = null
            },
            discardActiveObject: function(t) {
                var e = this._activeObject;
                return e && (this.fire("before:selection:cleared", {
                    target: e,
                    e: t
                }), this._discardActiveObject(), this.fire("selection:cleared", {
                    e: t
                }), e.fire("deselected", {
                    e: t
                })), this
            },
            _setActiveGroup: function(t) {
                this._activeGroup = t, t && t.set("active", !0)
            },
            setActiveGroup: function(t, e) {
                return this._setActiveGroup(t), t && (this.fire("object:selected", {
                    target: t,
                    e: e
                }), t.fire("selected", {
                    e: e
                })), this
            },
            getActiveGroup: function() {
                return this._activeGroup
            },
            _discardActiveGroup: function() {
                var t = this.getActiveGroup();
                t && t.destroy(), this.setActiveGroup(null)
            },
            discardActiveGroup: function(t) {
                var e = this.getActiveGroup();
                return e && (this.fire("before:selection:cleared", {
                    e: t,
                    target: e
                }), this._discardActiveGroup(), this.fire("selection:cleared", {
                    e: t
                })), this
            },
            deactivateAll: function() {
                for(var t, e = this.getObjects(), i = 0, r = e.length; i < r; i++)(t = e[i]) && t.set("active", !1);
                return this._discardActiveGroup(), this._discardActiveObject(), this
            },
            deactivateAllWithDispatch: function(t) {
                for(var e, i = this.getObjects(), r = 0, n = i.length; r < n; r++)(e = i[r]) && e.set("active", !1);
                return this.discardActiveGroup(t), this.discardActiveObject(t), this
            },
            dispose: function() {
                fabric.StaticCanvas.prototype.dispose.call(this);
                var t = this.wrapperEl;
                return this.removeListeners(), t.removeChild(this.upperCanvasEl), t.removeChild(this.lowerCanvasEl), delete this.upperCanvasEl, t.parentNode && t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl), delete this.wrapperEl, this
            },
            clear: function() {
                return this.discardActiveGroup(), this.discardActiveObject(), this.clearContext(this.contextTop), this.callSuper("clear")
            },
            drawControls: function(t) {
                var e = this.getActiveGroup();
                e ? e._renderControls(t) : this._drawObjectsControls(t)
            },
            _drawObjectsControls: function(t) {
                for(var e = 0, i = this._objects.length; e < i; ++e) this._objects[e] && this._objects[e].active && this._objects[e]._renderControls(t)
            },
            _toObject: function(t, e, i) {
                var r = this._realizeGroupTransformOnObject(t),
                    n = this.callSuper("_toObject", t, e, i);
                return this._unwindGroupTransformOnObject(t, r), n
            },
            _realizeGroupTransformOnObject: function(t) {
                if(t.group && t.group === this.getActiveGroup()) {
                    var e = {};
                    return ["angle", "flipX", "flipY", "left", "scaleX", "scaleY", "skewX", "skewY", "top"].forEach(function(i) {
                        e[i] = t[i]
                    }), this.getActiveGroup().realizeTransform(t), e
                }
                return null
            },
            _unwindGroupTransformOnObject: function(t, e) {
                e && t.set(e)
            },
            _setSVGObject: function(t, e, i) {
                var r;
                r = this._realizeGroupTransformOnObject(e), this.callSuper("_setSVGObject", t, e, i), this._unwindGroupTransformOnObject(e, r)
            }
        });
        for(var o in fabric.StaticCanvas) "prototype" !== o && (fabric.Canvas[o] = fabric.StaticCanvas[o]);
        fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function() {}), fabric.Element = fabric.Canvas
    }(),
    function() {
        function t(t, e) {
            return "which" in t ? t.which === e : t.button === e - 1
        }
        var e = {
                mt: 0,
                tr: 1,
                mr: 2,
                br: 3,
                mb: 4,
                bl: 5,
                ml: 6,
                tl: 7
            },
            i = fabric.util.addListener,
            r = fabric.util.removeListener;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
            _initEventListeners: function() {
                this.removeListeners(), this._bindEvents(), i(fabric.window, "resize", this._onResize), i(this.upperCanvasEl, "mousedown", this._onMouseDown), i(this.upperCanvasEl, "mousemove", this._onMouseMove), i(this.upperCanvasEl, "mouseout", this._onMouseOut), i(this.upperCanvasEl, "mouseenter", this._onMouseEnter), i(this.upperCanvasEl, "wheel", this._onMouseWheel), i(this.upperCanvasEl, "contextmenu", this._onContextMenu), i(this.upperCanvasEl, "touchstart", this._onMouseDown, {
                    passive: !1
                }), i(this.upperCanvasEl, "touchmove", this._onMouseMove, {
                    passive: !1
                }), "undefined" != typeof eventjs && "add" in eventjs && (eventjs.add(this.upperCanvasEl, "gesture", this._onGesture), eventjs.add(this.upperCanvasEl, "drag", this._onDrag), eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.add(this.upperCanvasEl, "shake", this._onShake), eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress))
            },
            _bindEvents: function() {
                this.eventsBinded || (this._onMouseDown = this._onMouseDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onLongPress = this._onLongPress.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this), this._onMouseOut = this._onMouseOut.bind(this), this._onMouseEnter = this._onMouseEnter.bind(this), this._onContextMenu = this._onContextMenu.bind(this), this.eventsBinded = !0)
            },
            removeListeners: function() {
                r(fabric.window, "resize", this._onResize), r(this.upperCanvasEl, "mousedown", this._onMouseDown), r(this.upperCanvasEl, "mousemove", this._onMouseMove), r(this.upperCanvasEl, "mouseout", this._onMouseOut), r(this.upperCanvasEl, "mouseenter", this._onMouseEnter), r(this.upperCanvasEl, "wheel", this._onMouseWheel), r(this.upperCanvasEl, "contextmenu", this._onContextMenu), r(this.upperCanvasEl, "touchstart", this._onMouseDown), r(this.upperCanvasEl, "touchmove", this._onMouseMove), "undefined" != typeof eventjs && "remove" in eventjs && (eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture), eventjs.remove(this.upperCanvasEl, "drag", this._onDrag), eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.remove(this.upperCanvasEl, "shake", this._onShake), eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress))
            },
            _onGesture: function(t, e) {
                this.__onTransformGesture && this.__onTransformGesture(t, e)
            },
            _onDrag: function(t, e) {
                this.__onDrag && this.__onDrag(t, e)
            },
            _onMouseWheel: function(t) {
                this.__onMouseWheel(t)
            },
            _onMouseOut: function(t) {
                var e = this._hoveredTarget;
                this.fire("mouse:out", {
                    target: e,
                    e: t
                }), this._hoveredTarget = null, e && e.fire("mouseout", {
                    e: t
                }), this._iTextInstances && this._iTextInstances.forEach(function(t) {
                    t.isEditing && t.hiddenTextarea.focus()
                })
            },
            _onMouseEnter: function(t) {
                this.findTarget(t) || (this.fire("mouse:over", {
                    target: null,
                    e: t
                }), this._hoveredTarget = null)
            },
            _onOrientationChange: function(t, e) {
                this.__onOrientationChange && this.__onOrientationChange(t, e)
            },
            _onShake: function(t, e) {
                this.__onShake && this.__onShake(t, e)
            },
            _onLongPress: function(t, e) {
                this.__onLongPress && this.__onLongPress(t, e)
            },
            _onContextMenu: function(t) {
                return this.stopContextMenu && (t.stopPropagation(), t.preventDefault()), !1
            },
            _onMouseDown: function(t) {
                this.__onMouseDown(t), i(fabric.document, "touchend", this._onMouseUp, {
                    passive: !1
                }), i(fabric.document, "touchmove", this._onMouseMove, {
                    passive: !1
                }), r(this.upperCanvasEl, "mousemove", this._onMouseMove), r(this.upperCanvasEl, "touchmove", this._onMouseMove), "touchstart" === t.type ? r(this.upperCanvasEl, "mousedown", this._onMouseDown) : (i(fabric.document, "mouseup", this._onMouseUp), i(fabric.document, "mousemove", this._onMouseMove))
            },
            _onMouseUp: function(t) {
                if(this.__onMouseUp(t), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp), r(fabric.document, "mousemove", this._onMouseMove), r(fabric.document, "touchmove", this._onMouseMove), i(this.upperCanvasEl, "mousemove", this._onMouseMove), i(this.upperCanvasEl, "touchmove", this._onMouseMove, {
                        passive: !1
                    }), "touchend" === t.type) {
                    var e = this;
                    setTimeout(function() {
                        i(e.upperCanvasEl, "mousedown", e._onMouseDown)
                    }, 400)
                }
            },
            _onMouseMove: function(t) {
                !this.allowTouchScrolling && t.preventDefault && t.preventDefault(), this.__onMouseMove(t)
            },
            _onResize: function() {
                this.calcOffset()
            },
            _shouldRender: function(t, e) {
                var i = this.getActiveGroup() || this.getActiveObject();
                return(!i || !i.isEditing || t !== i) && !!(t && (t.isMoving || t !== i) || !t && i || !t && !i && !this._groupSelector || e && this._previousPointer && this.selection && (e.x !== this._previousPointer.x || e.y !== this._previousPointer.y))
            },
            __onMouseUp: function(e) {
                var i;
                if(t(e, 3)) this.fireRightClick && this._handleEvent(e, "up", i, 3);
                else if(t(e, 2)) this.fireMiddleClick && this._handleEvent(e, "up", i, 2);
                else if(this.isDrawingMode && this._isCurrentlyDrawing) this._onMouseUpInDrawingMode(e);
                else {
                    var r = !0,
                        n = this._currentTransform,
                        s = this._groupSelector,
                        o = !s || 0 === s.left && 0 === s.top;
                    n && (this._finalizeCurrentTransform(e), r = !n.actionPerformed), i = r ? this.findTarget(e, !0) : n.target;
                    var a = this._shouldRender(i, this.getPointer(e));
                    i || !o ? this._maybeGroupObjects(e) : (this._groupSelector = null, this._currentTransform = null), i && (i.isMoving = !1), this._setCursorFromEvent(e, i), this._handleEvent(e, "up", i || null, 1, o), i && (i.__corner = 0), a && this.renderAll()
                }
            },
            _handleEvent: function(t, e, i, r, n) {
                var s = void 0 === i ? this.findTarget(t) : i,
                    o = this.targets || [],
                    a = {
                        e: t,
                        target: s,
                        subTargets: o,
                        button: r || 1,
                        isClick: n || !1
                    };
                this.fire("mouse:" + e, a), s && s.fire("mouse" + e, a);
                for(var h = 0; h < o.length; h++) o[h].fire("mouse" + e, a)
            },
            _finalizeCurrentTransform: function(t) {
                var e = this._currentTransform,
                    i = e.target;
                i._scaling && (i._scaling = !1), i.setCoords(), this._restoreOriginXY(i), (e.actionPerformed || this.stateful && i.hasStateChanged()) && (this.fire("object:modified", {
                    target: i,
                    e: t
                }), i.fire("modified", {
                    e: t
                }))
            },
            _restoreOriginXY: function(t) {
                if(this._previousOriginX && this._previousOriginY) {
                    var e = t.translateToOriginPoint(t.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                    t.originX = this._previousOriginX, t.originY = this._previousOriginY, t.left = e.x, t.top = e.y, this._previousOriginX = null, this._previousOriginY = null
                }
            },
            _onMouseDownInDrawingMode: function(t) {
                this._isCurrentlyDrawing = !0, this.discardActiveObject(t).renderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
                var e = this.getPointer(t);
                this.freeDrawingBrush.onMouseDown(e), this._handleEvent(t, "down")
            },
            _onMouseMoveInDrawingMode: function(t) {
                if(this._isCurrentlyDrawing) {
                    var e = this.getPointer(t);
                    this.freeDrawingBrush.onMouseMove(e)
                }
                this.setCursor(this.freeDrawingCursor), this._handleEvent(t, "move")
            },
            _onMouseUpInDrawingMode: function(t) {
                this._isCurrentlyDrawing = !1, this.clipTo && this.contextTop.restore(), this.freeDrawingBrush.onMouseUp(), this._handleEvent(t, "up")
            },
            __onMouseDown: function(e) {
                var i = this.findTarget(e);
                if(t(e, 3)) this.fireRightClick && this._handleEvent(e, "down", i || null, 3);
                else if(t(e, 2)) this.fireMiddleClick && this._handleEvent(e, "down", i || null, 2);
                else if(this.isDrawingMode) this._onMouseDownInDrawingMode(e);
                else if(!this._currentTransform) {
                    var r = this.getPointer(e, !0);
                    this._previousPointer = r;
                    var n = this._shouldRender(i, r),
                        s = this._shouldGroup(e, i);
                    if(this._shouldClearSelection(e, i) ? this.deactivateAllWithDispatch(e) : s && (this._handleGrouping(e, i), i = this.getActiveGroup()), !this.selection || i && (i.selectable || i.isEditing) || (this._groupSelector = {
                            ex: r.x,
                            ey: r.y,
                            top: 0,
                            left: 0
                        }), i) {
                        !i.selectable || !i.__corner && s || (this._beforeTransform(e, i), this._setupCurrentTransform(e, i));
                        var o = this.getActiveObject();
                        i !== this.getActiveGroup() && i !== o && (this.deactivateAll(), i.selectable && (o && o.fire("deselected", {
                            e: e
                        }), this.setActiveObject(i, e)))
                    }
                    this._handleEvent(e, "down", i || null), n && this.renderAll()
                }
            },
            _beforeTransform: function(t, e) {
                this.stateful && e.saveState(), e._findTargetCorner(this.getPointer(t)) && this.onBeforeScaleRotate(e)
            },
            _setOriginToCenter: function(t) {
                this._previousOriginX = this._currentTransform.target.originX, this._previousOriginY = this._currentTransform.target.originY;
                var e = t.getCenterPoint();
                t.originX = "center", t.originY = "center", t.left = e.x, t.top = e.y, this._currentTransform.left = t.left, this._currentTransform.top = t.top
            },
            _setCenterToOrigin: function(t) {
                var e = t.translateToOriginPoint(t.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                t.originX = this._previousOriginX, t.originY = this._previousOriginY, t.left = e.x, t.top = e.y, this._previousOriginX = null, this._previousOriginY = null
            },
            __onMouseMove: function(t) {
                var e, i;
                if(this.isDrawingMode) this._onMouseMoveInDrawingMode(t);
                else if(!(void 0 !== t.touches && t.touches.length > 1)) {
                    var r = this._groupSelector;
                    r ? (i = this.getPointer(t, !0), r.left = i.x - r.ex, r.top = i.y - r.ey, this.renderTop()) : this._currentTransform ? this._transformObject(t) : (e = this.findTarget(t), this._setCursorFromEvent(t, e)), this._handleEvent(t, "move", e || null)
                }
            },
            __onMouseWheel: function(t) {
                this._handleEvent(t, "wheel")
            },
            _transformObject: function(t) {
                var e = this.getPointer(t),
                    i = this._currentTransform;
                i.reset = !1, i.target.isMoving = !0, i.shiftKey = t.shiftKey, i.altKey = t[this.centeredKey], this._beforeScaleTransform(t, i), this._performTransformAction(t, i, e), i.actionPerformed && this.renderAll()
            },
            _performTransformAction: function(t, e, i) {
                var r = i.x,
                    n = i.y,
                    s = e.target,
                    o = e.action,
                    a = !1;
                "rotate" === o ? (a = this._rotateObject(r, n)) && this._fire("rotating", s, t) : "scale" === o ? (a = this._onScale(t, e, r, n)) && this._fire("scaling", s, t) : "scaleX" === o ? (a = this._scaleObject(r, n, "x")) && this._fire("scaling", s, t) : "scaleY" === o ? (a = this._scaleObject(r, n, "y")) && this._fire("scaling", s, t) : "skewX" === o ? (a = this._skewObject(r, n, "x")) && this._fire("skewing", s, t) : "skewY" === o ? (a = this._skewObject(r, n, "y")) && this._fire("skewing", s, t) : (a = this._translateObject(r, n)) && (this._fire("moving", s, t), this.setCursor(s.moveCursor || this.moveCursor)), e.actionPerformed = e.actionPerformed || a
            },
            _fire: function(t, e, i) {
                this.fire("object:" + t, {
                    target: e,
                    e: i
                }), e.fire(t, {
                    e: i
                })
            },
            _beforeScaleTransform: function(t, e) {
                if("scale" === e.action || "scaleX" === e.action || "scaleY" === e.action) {
                    var i = this._shouldCenterTransform(e.target);
                    (i && ("center" !== e.originX || "center" !== e.originY) || !i && "center" === e.originX && "center" === e.originY) && (this._resetCurrentTransform(), e.reset = !0)
                }
            },
            _onScale: function(t, e, i, r) {
                return !t[this.uniScaleKey] && !this.uniScaleTransform || e.target.get("lockUniScaling") ? (e.reset || "scale" !== e.currentAction || this._resetCurrentTransform(), e.currentAction = "scaleEqually", this._scaleObject(i, r, "equally")) : (e.currentAction = "scale", this._scaleObject(i, r))
            },
            _setCursorFromEvent: function(t, e) {
                if(!e) return this.setCursor(this.defaultCursor), !1;
                var i = e.hoverCursor || this.hoverCursor,
                    r = this.getActiveGroup(),
                    n = e._findTargetCorner && (!r || !r.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
                return n ? this._setCornerCursor(n, e, t) : this.setCursor(i), !0
            },
            _setCornerCursor: function(t, i, r) {
                if(t in e) this.setCursor(this._getRotatedCornerCursor(t, i, r));
                else {
                    if("mtr" !== t || !i.hasRotatingPoint) return this.setCursor(this.defaultCursor), !1;
                    this.setCursor(this.rotationCursor)
                }
            },
            _getRotatedCornerCursor: function(t, i, r) {
                var n = Math.round(i.getAngle() % 360 / 45);
                return n < 0 && (n += 8), n += e[t], r[this.altActionKey] && e[t] % 2 == 0 && (n += 2), n %= 8, this.cursorMap[n]
            }
        })
    }(),
    function() {
        var t = Math.min,
            e = Math.max;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            _shouldGroup: function(t, e) {
                var i = this.getActiveObject();
                return t[this.selectionKey] && e && e.selectable && (this.getActiveGroup() || i && i !== e) && this.selection
            },
            _handleGrouping: function(t, e) {
                var i = this.getActiveGroup();
                (e !== i || (e = this.findTarget(t, !0))) && (i ? this._updateActiveGroup(e, t) : this._createActiveGroup(e, t), this._activeGroup && this._activeGroup.saveCoords())
            },
            _updateActiveGroup: function(t, e) {
                var i = this.getActiveGroup();
                if(i.contains(t)) {
                    if(i.removeWithUpdate(t), t.set("active", !1), 1 === i.size()) return this.discardActiveGroup(e), void this.setActiveObject(i.item(0), e)
                } else i.addWithUpdate(t);
                this.fire("selection:created", {
                    target: i,
                    e: e
                }), i.set("active", !0)
            },
            _createActiveGroup: function(t, e) {
                if(this._activeObject && t !== this._activeObject) {
                    var i = this._createGroup(t);
                    i.addWithUpdate(), this.setActiveGroup(i, e), this._activeObject = null, this.fire("selection:created", {
                        target: i,
                        e: e
                    })
                }
                t.set("active", !0)
            },
            _createGroup: function(t) {
                var e = this.getObjects(),
                    i = e.indexOf(this._activeObject) < e.indexOf(t) ? [this._activeObject, t] : [t, this._activeObject];
                return this._activeObject.isEditing && this._activeObject.exitEditing(), new fabric.Group(i, {
                    canvas: this
                })
            },
            _groupSelectedObjects: function(t) {
                var e = this._collectObjects();
                1 === e.length ? this.setActiveObject(e[0], t) : e.length > 1 && ((e = new fabric.Group(e.reverse(), {
                    canvas: this
                })).addWithUpdate(), this.setActiveGroup(e, t), e.saveCoords(), this.fire("selection:created", {
                    target: e,
                    e: t
                }), this.renderAll())
            },
            _collectObjects: function() {
                for(var i, r = [], n = this._groupSelector.ex, s = this._groupSelector.ey, o = n + this._groupSelector.left, a = s + this._groupSelector.top, h = new fabric.Point(t(n, o), t(s, a)), c = new fabric.Point(e(n, o), e(s, a)), l = n === o && s === a, u = this._objects.length; u-- && !((i = this._objects[u]) && i.selectable && i.visible && (i.intersectsWithRect(h, c) || i.isContainedWithinRect(h, c) || i.containsPoint(h) || i.containsPoint(c)) && (i.set("active", !0), r.push(i), l)););
                return r
            },
            _maybeGroupObjects: function(t) {
                this.selection && this._groupSelector && this._groupSelectedObjects(t);
                var e = this.getActiveGroup();
                e && (e.setObjectsCoords().setCoords(), e.isMoving = !1, this.setCursor(this.defaultCursor)), this._groupSelector = null, this._currentTransform = null
            }
        })
    }(),
    function() {
        var t = fabric.StaticCanvas.supports("toDataURLWithQuality");
        fabric.util.object.extend(fabric.StaticCanvas.prototype, {
            toDataURL: function(t) {
                t || (t = {});
                var e = t.format || "png",
                    i = t.quality || 1,
                    r = t.multiplier || 1,
                    n = {
                        left: t.left || 0,
                        top: t.top || 0,
                        width: t.width || 0,
                        height: t.height || 0
                    };
                return this.__toDataURLWithMultiplier(e, i, n, r)
            },
            __toDataURLWithMultiplier: function(t, e, i, r) {
                var n = this.getWidth(),
                    s = this.getHeight(),
                    o = (i.width || this.getWidth()) * r,
                    a = (i.height || this.getHeight()) * r,
                    h = this.getZoom() * r,
                    c = this.viewportTransform,
                    l = [h, 0, 0, h, (c[4] - i.left) * r, (c[5] - i.top) * r],
                    u = this.interactive;
                this.viewportTransform = l, this.interactive && (this.interactive = !1), n !== o || s !== a ? this.setDimensions({
                    width: o,
                    height: a
                }, {
                    backstoreOnly: !0
                }) : this.renderAll();
                var f = this.__toDataURL(t, e, i);
                return u && (this.interactive = u), this.viewportTransform = c, this.setDimensions({
                    width: n,
                    height: s
                }, {
                    backstoreOnly: !0
                }), f
            },
            __toDataURL: function(e, i) {
                var r = this.contextContainer.canvas;
                "jpg" === e && (e = "jpeg");
                return t ? r.toDataURL("image/" + e, i) : r.toDataURL("image/" + e)
            },
            toDataURLWithMultiplier: function(t, e, i) {
                return this.toDataURL({
                    format: t,
                    multiplier: e,
                    quality: i
                })
            }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        loadFromDatalessJSON: function(t, e, i) {
            return this.loadFromJSON(t, e, i)
        },
        loadFromJSON: function(t, e, i) {
            if(t) {
                var r = "string" == typeof t ? JSON.parse(t) : fabric.util.object.clone(t),
                    n = this,
                    s = this.renderOnAddRemove;
                return this.renderOnAddRemove = !1, this._enlivenObjects(r.objects, function(t) {
                    n.clear(), n._setBgOverlay(r, function() {
                        t.forEach(function(t, e) {
                            n.insertAt(t, e)
                        }), n.renderOnAddRemove = s, delete r.objects, delete r.backgroundImage, delete r.overlayImage, delete r.background, delete r.overlay, n._setOptions(r), n.renderAll(), e && e()
                    })
                }, i), this
            }
        },
        _setBgOverlay: function(t, e) {
            var i = {
                backgroundColor: !1,
                overlayColor: !1,
                backgroundImage: !1,
                overlayImage: !1
            };
            if(t.backgroundImage || t.overlayImage || t.background || t.overlay) {
                var r = function() {
                    i.backgroundImage && i.overlayImage && i.backgroundColor && i.overlayColor && e && e()
                };
                this.__setBgOverlay("backgroundImage", t.backgroundImage, i, r), this.__setBgOverlay("overlayImage", t.overlayImage, i, r), this.__setBgOverlay("backgroundColor", t.background, i, r), this.__setBgOverlay("overlayColor", t.overlay, i, r)
            } else e && e()
        },
        __setBgOverlay: function(t, e, i, r) {
            var n = this;
            if(!e) return i[t] = !0, void(r && r());
            "backgroundImage" === t || "overlayImage" === t ? fabric.util.enlivenObjects([e], function(e) {
                n[t] = e[0], i[t] = !0, r && r()
            }) : this["set" + fabric.util.string.capitalize(t, !0)](e, function() {
                i[t] = !0, r && r()
            })
        },
        _enlivenObjects: function(t, e, i) {
            t && 0 !== t.length ? fabric.util.enlivenObjects(t, function(t) {
                e && e(t)
            }, null, i) : e && e([])
        },
        _toDataURL: function(t, e) {
            this.clone(function(i) {
                e(i.toDataURL(t))
            })
        },
        _toDataURLWithMultiplier: function(t, e, i) {
            this.clone(function(r) {
                i(r.toDataURLWithMultiplier(t, e))
            })
        },
        clone: function(t, e) {
            var i = JSON.stringify(this.toJSON(e));
            this.cloneWithoutData(function(e) {
                e.loadFromJSON(i, function() {
                    t && t(e)
                })
            })
        },
        cloneWithoutData: function(t) {
            var e = fabric.document.createElement("canvas");
            e.width = this.getWidth(), e.height = this.getHeight();
            var i = new fabric.Canvas(e);
            i.clipTo = this.clipTo, this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src, function() {
                i.renderAll(), t && t(i)
            }), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.object.clone,
            n = e.util.toFixed,
            s = e.util.string.capitalize,
            o = e.util.degreesToRadians,
            a = e.StaticCanvas.supports("setLineDash"),
            h = !e.isLikelyNode;
        e.Object || (e.Object = e.util.createClass(e.CommonMethods, {
            type: "object",
            originX: "left",
            originY: "top",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            scaleX: 1,
            scaleY: 1,
            flipX: !1,
            flipY: !1,
            opacity: 1,
            angle: 0,
            skewX: 0,
            skewY: 0,
            cornerSize: 13,
            transparentCorners: !0,
            hoverCursor: null,
            moveCursor: null,
            padding: 0,
            borderColor: "rgba(102,153,255,0.75)",
            borderDashArray: null,
            cornerColor: "rgba(102,153,255,0.5)",
            cornerStrokeColor: null,
            cornerStyle: "rect",
            cornerDashArray: null,
            centeredScaling: !1,
            centeredRotation: !0,
            fill: "rgb(0,0,0)",
            fillRule: "nonzero",
            globalCompositeOperation: "source-over",
            backgroundColor: "",
            selectionBackgroundColor: "",
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeLineJoin: "miter",
            strokeMiterLimit: 10,
            shadow: null,
            borderOpacityWhenMoving: .4,
            borderScaleFactor: 1,
            transformMatrix: null,
            minScaleLimit: .01,
            selectable: !0,
            evented: !0,
            visible: !0,
            hasControls: !0,
            hasBorders: !0,
            hasRotatingPoint: !0,
            rotatingPointOffset: 40,
            perPixelTargetFind: !1,
            includeDefaultValues: !0,
            clipTo: null,
            lockMovementX: !1,
            lockMovementY: !1,
            lockRotation: !1,
            lockScalingX: !1,
            lockScalingY: !1,
            lockUniScaling: !1,
            lockSkewingX: !1,
            lockSkewingY: !1,
            lockScalingFlip: !1,
            excludeFromExport: !1,
            objectCaching: h,
            statefullCache: !1,
            noScaleCache: !0,
            dirty: !0,
            stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow clipTo visible backgroundColor skewX skewY fillRule".split(" "),
            cacheProperties: "fill stroke strokeWidth strokeDashArray width height strokeLineCap strokeLineJoin strokeMiterLimit backgroundColor".split(" "),
            initialize: function(t) {
                (t = t || {}) && this.setOptions(t)
            },
            _createCacheCanvas: function() {
                this._cacheProperties = {}, this._cacheCanvas = e.document.createElement("canvas"), this._cacheContext = this._cacheCanvas.getContext("2d"), this._updateCacheCanvas()
            },
            _limitCacheSize: function(t) {
                var i = e.perfLimitSizeTotal,
                    r = t.width,
                    n = t.height,
                    s = e.maxCacheSideLimit,
                    o = e.minCacheSideLimit;
                if(r <= s && n <= s && r * n <= i) return r < o && (t.width = o), n < o && (t.height = o), t;
                var a = r / n,
                    h = e.util.limitDimsByArea(a, i),
                    c = e.util.capValue,
                    l = c(o, h.x, s),
                    u = c(o, h.y, s);
                return r > l && (t.zoomX /= r / l, t.width = l, t.capped = !0), n > u && (t.zoomY /= n / u, t.height = u, t.capped = !0), t
            },
            _getCacheCanvasDimensions: function() {
                var t = this.canvas && this.canvas.getZoom() || 1,
                    i = this.getObjectScaling(),
                    r = this.canvas && this.canvas._isRetinaScaling() ? e.devicePixelRatio : 1,
                    n = this._getNonTransformedDimensions(),
                    s = i.scaleX * t * r,
                    o = i.scaleY * t * r;
                return {
                    width: n.x * s + 2,
                    height: n.y * o + 2,
                    zoomX: s,
                    zoomY: o,
                    x: n.x,
                    y: n.y
                }
            },
            _updateCacheCanvas: function() {
                if(this.noScaleCache && this.canvas && this.canvas._currentTransform) {
                    var t = this.canvas._currentTransform.target,
                        i = this.canvas._currentTransform.action;
                    if(this === t && i.slice && "scale" === i.slice(0, 5)) return !1
                }
                var r, n, s = this._cacheCanvas,
                    o = this._limitCacheSize(this._getCacheCanvasDimensions()),
                    a = e.minCacheSideLimit,
                    h = o.width,
                    c = o.height,
                    l = o.zoomX,
                    u = o.zoomY,
                    f = h !== this.cacheWidth || c !== this.cacheHeight,
                    d = this.zoomX !== l || this.zoomY !== u,
                    g = f || d,
                    p = 0,
                    v = 0,
                    b = !1;
                if(f) {
                    var m = this._cacheCanvas.width,
                        _ = this._cacheCanvas.height,
                        y = h > m || c > _;
                    b = y || (h < .9 * m || c < .9 * _) && m > a && _ > a, y && !o.capped && (h > a || c > a) && (p = .1 * h, v = .1 * c)
                }
                return !!g && (b ? (s.width = Math.ceil(h + p), s.height = Math.ceil(c + v)) : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0), this._cacheContext.clearRect(0, 0, s.width, s.height)), r = o.x * l / 2, n = o.y * u / 2, this.cacheTranslationX = Math.round(s.width / 2 - r) + r, this.cacheTranslationY = Math.round(s.height / 2 - n) + n, this.cacheWidth = h, this.cacheHeight = c, this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY), this._cacheContext.scale(l, u), this.zoomX = l, this.zoomY = u, !0)
            },
            setOptions: function(t) {
                this._setOptions(t), this._initGradient(t.fill, "fill"), this._initGradient(t.stroke, "stroke"), this._initClipping(t), this._initPattern(t.fill, "fill"), this._initPattern(t.stroke, "stroke")
            },
            transform: function(t, e) {
                this.group && !this.group._transformDone && this.group === this.canvas._activeGroup && this.group.transform(t);
                var i = e ? this._getLeftTopCoords() : this.getCenterPoint();
                t.translate(i.x, i.y), this.angle && t.rotate(o(this.angle)), t.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1)), this.skewX && t.transform(1, 0, Math.tan(o(this.skewX)), 1, 0, 0), this.skewY && t.transform(1, Math.tan(o(this.skewY)), 0, 1, 0, 0)
            },
            toObject: function(t) {
                var i = e.Object.NUM_FRACTION_DIGITS,
                    r = {
                        type: this.type,
                        originX: this.originX,
                        originY: this.originY,
                        left: n(this.left, i),
                        top: n(this.top, i),
                        width: n(this.width, i),
                        height: n(this.height, i),
                        fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                        stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                        strokeWidth: n(this.strokeWidth, i),
                        strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                        strokeLineCap: this.strokeLineCap,
                        strokeLineJoin: this.strokeLineJoin,
                        strokeMiterLimit: n(this.strokeMiterLimit, i),
                        scaleX: n(this.scaleX, i),
                        scaleY: n(this.scaleY, i),
                        angle: n(this.getAngle(), i),
                        flipX: this.flipX,
                        flipY: this.flipY,
                        opacity: n(this.opacity, i),
                        shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                        visible: this.visible,
                        clipTo: this.clipTo && String(this.clipTo),
                        backgroundColor: this.backgroundColor,
                        fillRule: this.fillRule,
                        globalCompositeOperation: this.globalCompositeOperation,
                        transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null,
                        skewX: n(this.skewX, i),
                        skewY: n(this.skewY, i)
                    };
                return e.util.populateWithProperties(this, r, t), this.includeDefaultValues || (r = this._removeDefaultValues(r)), r
            },
            toDatalessObject: function(t) {
                return this.toObject(t)
            },
            _removeDefaultValues: function(t) {
                var i = e.util.getKlass(t.type).prototype;
                return i.stateProperties.forEach(function(e) {
                    t[e] === i[e] && delete t[e];
                    "[object Array]" === Object.prototype.toString.call(t[e]) && "[object Array]" === Object.prototype.toString.call(i[e]) && 0 === t[e].length && 0 === i[e].length && delete t[e]
                }), t
            },
            toString: function() {
                return "#<fabric." + s(this.type) + ">"
            },
            getObjectScaling: function() {
                var t = this.scaleX,
                    e = this.scaleY;
                if(this.group) {
                    var i = this.group.getObjectScaling();
                    t *= i.scaleX, e *= i.scaleY
                }
                return {
                    scaleX: t,
                    scaleY: e
                }
            },
            _set: function(t, i) {
                var r = "scaleX" === t || "scaleY" === t,
                    n = this[t] !== i;
                return r && (i = this._constrainScale(i)), "scaleX" === t && i < 0 ? (this.flipX = !this.flipX, i *= -1) : "scaleY" === t && i < 0 ? (this.flipY = !this.flipY, i *= -1) : "shadow" !== t || !i || i instanceof e.Shadow ? "dirty" === t && this.group && this.group.set("dirty", i) : i = new e.Shadow(i), this[t] = i, n && this.cacheProperties.indexOf(t) > -1 && (this.group && this.group.set("dirty", !0), this.dirty = !0), n && this.group && this.stateProperties.indexOf(t) > -1 && this.group.set("dirty", !0), "width" !== t && "height" !== t || (this.minScaleLimit = Math.min(.1, 1 / Math.max(this.width, this.height))), this
            },
            setOnGroup: function() {},
            setSourcePath: function(t) {
                return this.sourcePath = t, this
            },
            getViewportTransform: function() {
                return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : e.iMatrix.concat()
            },
            isNotVisible: function() {
                return 0 === this.opacity || 0 === this.width && 0 === this.height || !this.visible
            },
            render: function(t, i) {
                this.isNotVisible() || this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (t.save(), this._setupCompositeOperation(t), this.drawSelectionBackground(t), i || this.transform(t), this._setOpacity(t), this._setShadow(t), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.clipTo && e.util.clipContext(this, t), this.shouldCache(i) ? (this._cacheCanvas || this._createCacheCanvas(), this.isCacheDirty(i) && (this.statefullCache && this.saveState({
                    propertySet: "cacheProperties"
                }), this.drawObject(this._cacheContext, i), this.dirty = !1), this.drawCacheOnCanvas(t)) : (this._removeCacheCanvas(), this.dirty = !1, this.drawObject(t, i), i && this.objectCaching && this.statefullCache && this.saveState({
                    propertySet: "cacheProperties"
                })), this.clipTo && t.restore(), t.restore())
            },
            _removeCacheCanvas: function() {
                this._cacheCanvas = null, this.cacheWidth = 0, this.cacheHeight = 0
            },
            needsItsOwnCache: function() {
                return !1
            },
            shouldCache: function(t) {
                return !t && this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isCaching())
            },
            willDrawShadow: function() {
                return !!this.shadow && (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY)
            },
            drawObject: function(t, e) {
                this._renderBackground(t), this._setStrokeStyles(t), this._setFillStyles(t), this._render(t, e)
            },
            drawCacheOnCanvas: function(t) {
                t.scale(1 / this.zoomX, 1 / this.zoomY), t.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY)
            },
            isCacheDirty: function(t) {
                if(this.isNotVisible()) return !1;
                if(this._cacheCanvas && !t && this._updateCacheCanvas()) return !0;
                if(this.dirty || this.statefullCache && this.hasStateChanged("cacheProperties")) {
                    if(this._cacheCanvas && !t) {
                        var e = this.cacheWidth / this.zoomX,
                            i = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-e / 2, -i / 2, e, i)
                    }
                    return !0
                }
                return !1
            },
            _renderBackground: function(t) {
                if(this.backgroundColor) {
                    var e = this._getNonTransformedDimensions();
                    t.fillStyle = this.backgroundColor, t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y), this._removeShadow(t)
                }
            },
            _setOpacity: function(t) {
                t.globalAlpha *= this.opacity
            },
            _setStrokeStyles: function(t) {
                this.stroke && (t.lineWidth = this.strokeWidth, t.lineCap = this.strokeLineCap, t.lineJoin = this.strokeLineJoin, t.miterLimit = this.strokeMiterLimit, t.strokeStyle = this.stroke.toLive ? this.stroke.toLive(t, this) : this.stroke)
            },
            _setFillStyles: function(t) {
                this.fill && (t.fillStyle = this.fill.toLive ? this.fill.toLive(t, this) : this.fill)
            },
            _setLineDash: function(t, e, i) {
                e && (1 & e.length && e.push.apply(e, e), a ? t.setLineDash(e) : i && i(t))
            },
            _renderControls: function(t) {
                if(this.active && (!this.group || this.group === this.canvas.getActiveGroup())) {
                    var i, r = this.getViewportTransform(),
                        n = this.calcTransformMatrix();
                    n = e.util.multiplyTransformMatrices(r, n), i = e.util.qrDecompose(n), t.save(), t.translate(i.translateX, i.translateY), t.lineWidth = 1 * this.borderScaleFactor, this.group || (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1), this.group && this.group === this.canvas.getActiveGroup() ? (t.rotate(o(i.angle)), this.drawBordersInGroup(t, i)) : (t.rotate(o(this.angle)), this.drawBorders(t)), this.drawControls(t), t.restore()
                }
            },
            _setShadow: function(t) {
                if(this.shadow) {
                    var i = this.canvas && this.canvas.viewportTransform[0] || 1,
                        r = this.canvas && this.canvas.viewportTransform[3] || 1,
                        n = this.getObjectScaling();
                    this.canvas && this.canvas._isRetinaScaling() && (i *= e.devicePixelRatio, r *= e.devicePixelRatio), t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * (i + r) * (n.scaleX + n.scaleY) / 4, t.shadowOffsetX = this.shadow.offsetX * i * n.scaleX, t.shadowOffsetY = this.shadow.offsetY * r * n.scaleY
                }
            },
            _removeShadow: function(t) {
                this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
            },
            _applyPatternGradientTransform: function(t, e) {
                if(e.toLive) {
                    var i = e.gradientTransform || e.patternTransform;
                    i && t.transform.apply(t, i);
                    var r = -this.width / 2 + e.offsetX || 0,
                        n = -this.height / 2 + e.offsetY || 0;
                    t.translate(r, n)
                }
            },
            _renderFill: function(t) {
                this.fill && (t.save(), this._applyPatternGradientTransform(t, this.fill), "evenodd" === this.fillRule ? t.fill("evenodd") : t.fill(), t.restore())
            },
            _renderStroke: function(t) {
                this.stroke && 0 !== this.strokeWidth && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray, this._renderDashedStroke), this._applyPatternGradientTransform(t, this.stroke), t.stroke(), t.restore())
            },
            clone: function(t, i) {
                return this.constructor.fromObject ? this.constructor.fromObject(this.toObject(i), t) : new e.Object(this.toObject(i))
            },
            cloneAsImage: function(t, i) {
                var r = this.toDataURL(i);
                return e.util.loadImage(r, function(i) {
                    t && t(new e.Image(i))
                }), this
            },
            toDataURL: function(t) {
                t || (t = {});
                var i = e.util.createCanvasElement(),
                    r = this.getBoundingRect();
                i.width = r.width, i.height = r.height, e.util.wrapElement(i, "div");
                var n = new e.StaticCanvas(i, {
                    enableRetinaScaling: t.enableRetinaScaling
                });
                "jpg" === t.format && (t.format = "jpeg"), "jpeg" === t.format && (n.backgroundColor = "#fff");
                var s = {
                    active: this.get("active"),
                    left: this.getLeft(),
                    top: this.getTop()
                };
                this.set("active", !1), this.setPositionByOrigin(new e.Point(n.getWidth() / 2, n.getHeight() / 2), "center", "center");
                var o = this.canvas;
                n.add(this);
                var a = n.toDataURL(t);
                return this.set(s).setCoords(), this.canvas = o, n.dispose(), n = null, a
            },
            isType: function(t) {
                return this.type === t
            },
            complexity: function() {
                return 1
            },
            toJSON: function(t) {
                return this.toObject(t)
            },
            setGradient: function(t, i) {
                i || (i = {});
                var r = {
                    colorStops: []
                };
                return r.type = i.type || (i.r1 || i.r2 ? "radial" : "linear"), r.coords = {
                    x1: i.x1,
                    y1: i.y1,
                    x2: i.x2,
                    y2: i.y2
                }, (i.r1 || i.r2) && (r.coords.r1 = i.r1, r.coords.r2 = i.r2), r.gradientTransform = i.gradientTransform, e.Gradient.prototype.addColorStop.call(r, i.colorStops), this.set(t, e.Gradient.forObject(this, r))
            },
            setPatternFill: function(t) {
                return this.set("fill", new e.Pattern(t))
            },
            setShadow: function(t) {
                return this.set("shadow", t ? new e.Shadow(t) : null)
            },
            setColor: function(t) {
                return this.set("fill", t), this
            },
            setAngle: function(t) {
                var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
                return e && this._setOriginToCenter(), this.set("angle", t), e && this._resetOrigin(), this
            },
            centerH: function() {
                return this.canvas && this.canvas.centerObjectH(this), this
            },
            viewportCenterH: function() {
                return this.canvas && this.canvas.viewportCenterObjectH(this), this
            },
            centerV: function() {
                return this.canvas && this.canvas.centerObjectV(this), this
            },
            viewportCenterV: function() {
                return this.canvas && this.canvas.viewportCenterObjectV(this), this
            },
            center: function() {
                return this.canvas && this.canvas.centerObject(this), this
            },
            viewportCenter: function() {
                return this.canvas && this.canvas.viewportCenterObject(this), this
            },
            remove: function() {
                return this.canvas && (this.group && this.group === this.canvas._activeGroup && this.group.remove(this), this.canvas.remove(this)), this
            },
            getLocalPointer: function(t, i) {
                i = i || this.canvas.getPointer(t);
                var r = new e.Point(i.x, i.y),
                    n = this._getLeftTopCoords();
                return this.angle && (r = e.util.rotatePoint(r, n, o(-this.angle))), {
                    x: r.x - n.x,
                    y: r.y - n.y
                }
            },
            _setupCompositeOperation: function(t) {
                this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation)
            }
        }), e.util.createAccessors(e.Object), e.Object.prototype.rotate = e.Object.prototype.setAngle, i(e.Object.prototype, e.Observable), e.Object.NUM_FRACTION_DIGITS = 2, e.Object._fromObject = function(t, i, n, s, o) {
            var a = e[t];
            if(i = r(i, !0), !s) {
                var h = o ? new a(i[o], i) : new a(i);
                return n && n(h), h
            }
            e.util.enlivenPatterns([i.fill, i.stroke], function(t) {
                void 0 !== t[0] && (i.fill = t[0]), void 0 !== t[1] && (i.stroke = t[1]);
                var e = o ? new a(i[o], i) : new a(i);
                n && n(e)
            })
        }, e.Object.__uid = 0)
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.util.degreesToRadians,
            e = {
                left: -.5,
                center: 0,
                right: .5
            },
            i = {
                top: -.5,
                center: 0,
                bottom: .5
            };
        fabric.util.object.extend(fabric.Object.prototype, {
            translateToGivenOrigin: function(t, r, n, s, o) {
                var a, h, c, l = t.x,
                    u = t.y;
                return "string" == typeof r ? r = e[r] : r -= .5, "string" == typeof s ? s = e[s] : s -= .5, a = s - r, "string" == typeof n ? n = i[n] : n -= .5, "string" == typeof o ? o = i[o] : o -= .5, h = o - n, (a || h) && (c = this._getTransformedDimensions(), l = t.x + a * c.x, u = t.y + h * c.y), new fabric.Point(l, u)
            },
            translateToCenterPoint: function(e, i, r) {
                var n = this.translateToGivenOrigin(e, i, r, "center", "center");
                return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
            },
            translateToOriginPoint: function(e, i, r) {
                var n = this.translateToGivenOrigin(e, "center", "center", i, r);
                return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
            },
            getCenterPoint: function() {
                var t = new fabric.Point(this.left, this.top);
                return this.translateToCenterPoint(t, this.originX, this.originY)
            },
            getPointByOrigin: function(t, e) {
                var i = this.getCenterPoint();
                return this.translateToOriginPoint(i, t, e)
            },
            toLocalPoint: function(e, i, r) {
                var n, s, o = this.getCenterPoint();
                return n = void 0 !== i && void 0 !== r ? this.translateToGivenOrigin(o, "center", "center", i, r) : new fabric.Point(this.left, this.top), s = new fabric.Point(e.x, e.y), this.angle && (s = fabric.util.rotatePoint(s, o, -t(this.angle))), s.subtractEquals(n)
            },
            setPositionByOrigin: function(t, e, i) {
                var r = this.translateToCenterPoint(t, e, i),
                    n = this.translateToOriginPoint(r, this.originX, this.originY);
                this.set("left", n.x), this.set("top", n.y)
            },
            adjustPosition: function(i) {
                var r, n, s = t(this.angle),
                    o = this.getWidth(),
                    a = Math.cos(s) * o,
                    h = Math.sin(s) * o;
                r = "string" == typeof this.originX ? e[this.originX] : this.originX - .5, n = "string" == typeof i ? e[i] : i - .5, this.left += a * (n - r), this.top += h * (n - r), this.setCoords(), this.originX = i
            },
            _setOriginToCenter: function() {
                this._originalOriginX = this.originX, this._originalOriginY = this.originY;
                var t = this.getCenterPoint();
                this.originX = "center", this.originY = "center", this.left = t.x, this.top = t.y
            },
            _resetOrigin: function() {
                var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
                this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = t.x, this.top = t.y, this._originalOriginX = null, this._originalOriginY = null
            },
            _getLeftTopCoords: function() {
                return this.translateToOriginPoint(this.getCenterPoint(), "left", "top")
            },
            onDeselect: function() {}
        })
    }(),
    function() {
        var t = fabric.util.degreesToRadians,
            e = fabric.util.multiplyTransformMatrices;
        fabric.util.object.extend(fabric.Object.prototype, {
            oCoords: null,
            aCoords: null,
            getCoords: function(t, e) {
                this.oCoords || this.setCoords();
                var i = t ? this.aCoords : this.oCoords;
                return function(t) {
                    return [new fabric.Point(t.tl.x, t.tl.y), new fabric.Point(t.tr.x, t.tr.y), new fabric.Point(t.br.x, t.br.y), new fabric.Point(t.bl.x, t.bl.y)]
                }(e ? this.calcCoords(t) : i)
            },
            intersectsWithRect: function(t, e, i, r) {
                var n = this.getCoords(i, r);
                return "Intersection" === fabric.Intersection.intersectPolygonRectangle(n, t, e).status
            },
            intersectsWithObject: function(t, e, i) {
                return "Intersection" === fabric.Intersection.intersectPolygonPolygon(this.getCoords(e, i), t.getCoords(e, i)).status || t.isContainedWithinObject(this, e, i) || this.isContainedWithinObject(t, e, i)
            },
            isContainedWithinObject: function(t, e, i) {
                for(var r = this.getCoords(e, i), n = 0, s = t._getImageLines(i ? t.calcCoords(e) : e ? t.aCoords : t.oCoords); n < 4; n++)
                    if(!t.containsPoint(r[n], s)) return !1;
                return !0
            },
            isContainedWithinRect: function(t, e, i, r) {
                var n = this.getBoundingRect(i, r);
                return n.left >= t.x && n.left + n.width <= e.x && n.top >= t.y && n.top + n.height <= e.y
            },
            containsPoint: function(t, e, i, r) {
                var e = e || this._getImageLines(r ? this.calcCoords(i) : i ? this.aCoords : this.oCoords),
                    n = this._findCrossPoints(t, e);
                return 0 !== n && n % 2 == 1
            },
            isOnScreen: function(t) {
                if(!this.canvas) return !1;
                for(var e, i = this.canvas.vptCoords.tl, r = this.canvas.vptCoords.br, n = this.getCoords(!0, t), s = 0; s < 4; s++)
                    if((e = n[s]).x <= r.x && e.x >= i.x && e.y <= r.y && e.y >= i.y) return !0;
                if(this.intersectsWithRect(i, r, !0)) return !0;
                var o = {
                    x: (i.x + r.x) / 2,
                    y: (i.y + r.y) / 2
                };
                return !!this.containsPoint(o, null, !0)
            },
            _getImageLines: function(t) {
                return {
                    topline: {
                        o: t.tl,
                        d: t.tr
                    },
                    rightline: {
                        o: t.tr,
                        d: t.br
                    },
                    bottomline: {
                        o: t.br,
                        d: t.bl
                    },
                    leftline: {
                        o: t.bl,
                        d: t.tl
                    }
                }
            },
            _findCrossPoints: function(t, e) {
                var i, r, n, s, o = 0;
                for(var a in e)
                    if(!((s = e[a]).o.y < t.y && s.d.y < t.y || s.o.y >= t.y && s.d.y >= t.y || (s.o.x === s.d.x && s.o.x >= t.x ? n = s.o.x : (i = 0, r = (s.d.y - s.o.y) / (s.d.x - s.o.x), n = -(t.y - i * t.x - (s.o.y - r * s.o.x)) / (i - r)), n >= t.x && (o += 1), 2 !== o))) break;
                return o
            },
            getBoundingRectWidth: function() {
                return this.getBoundingRect().width
            },
            getBoundingRectHeight: function() {
                return this.getBoundingRect().height
            },
            getBoundingRect: function(t, e) {
                var i = this.getCoords(t, e);
                return fabric.util.makeBoundingBoxFromPoints(i)
            },
            getWidth: function() {
                return this._getTransformedDimensions().x
            },
            getHeight: function() {
                return this._getTransformedDimensions().y
            },
            _constrainScale: function(t) {
                return Math.abs(t) < this.minScaleLimit ? t < 0 ? -this.minScaleLimit : this.minScaleLimit : t
            },
            scale: function(t) {
                return(t = this._constrainScale(t)) < 0 && (this.flipX = !this.flipX, this.flipY = !this.flipY, t *= -1), this.scaleX = t, this.scaleY = t, this.setCoords()
            },
            scaleToWidth: function(t) {
                var e = this.getBoundingRect().width / this.getWidth();
                return this.scale(t / this.width / e)
            },
            scaleToHeight: function(t) {
                var e = this.getBoundingRect().height / this.getHeight();
                return this.scale(t / this.height / e)
            },
            calcCoords: function(e) {
                var i = t(this.angle),
                    r = this.getViewportTransform(),
                    n = e ? this._getTransformedDimensions() : this._calculateCurrentDimensions(),
                    s = n.x,
                    o = n.y,
                    a = Math.sin(i),
                    h = Math.cos(i),
                    c = s > 0 ? Math.atan(o / s) : 0,
                    l = s / Math.cos(c) / 2,
                    u = Math.cos(c + i) * l,
                    f = Math.sin(c + i) * l,
                    d = this.getCenterPoint(),
                    g = e ? d : fabric.util.transformPoint(d, r),
                    p = new fabric.Point(g.x - u, g.y - f),
                    v = new fabric.Point(p.x + s * h, p.y + s * a),
                    b = new fabric.Point(p.x - o * a, p.y + o * h),
                    m = new fabric.Point(g.x + u, g.y + f);
                if(!e) var _ = new fabric.Point((p.x + b.x) / 2, (p.y + b.y) / 2),
                    y = new fabric.Point((v.x + p.x) / 2, (v.y + p.y) / 2),
                    x = new fabric.Point((m.x + v.x) / 2, (m.y + v.y) / 2),
                    C = new fabric.Point((m.x + b.x) / 2, (m.y + b.y) / 2),
                    S = new fabric.Point(y.x + a * this.rotatingPointOffset, y.y - h * this.rotatingPointOffset);
                g = {
                    tl: p,
                    tr: v,
                    br: m,
                    bl: b
                };
                return e || (g.ml = _, g.mt = y, g.mr = x, g.mb = C, g.mtr = S), g
            },
            setCoords: function(t, e) {
                return this.oCoords = this.calcCoords(t), e || (this.aCoords = this.calcCoords(!0)), t || this._setCornerCoords && this._setCornerCoords(), this
            },
            _calcRotateMatrix: function() {
                if(this.angle) {
                    var e = t(this.angle),
                        i = Math.cos(e),
                        r = Math.sin(e);
                    return 6.123233995736766e-17 !== i && -1.8369701987210297e-16 !== i || (i = 0), [i, r, -r, i, 0, 0]
                }
                return fabric.iMatrix.concat()
            },
            calcTransformMatrix: function(t) {
                var i, r, n = this.getCenterPoint(),
                    s = [1, 0, 0, 1, n.x, n.y],
                    o = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, !0);
                return r = this.group && !t ? e(this.group.calcTransformMatrix(), s) : s, this.angle && (i = this._calcRotateMatrix(), r = e(r, i)), r = e(r, o)
            },
            _calcDimensionsTransformMatrix: function(i, r, n) {
                var s, o = [this.scaleX * (n && this.flipX ? -1 : 1), 0, 0, this.scaleY * (n && this.flipY ? -1 : 1), 0, 0];
                return i && (s = [1, 0, Math.tan(t(i)), 1], o = e(o, s, !0)), r && (s = [1, Math.tan(t(r)), 0, 1], o = e(o, s, !0)), o
            },
            _getNonTransformedDimensions: function() {
                var t = this.strokeWidth;
                return {
                    x: this.width + t,
                    y: this.height + t
                }
            },
            _getTransformedDimensions: function(t, e) {
                void 0 === t && (t = this.skewX), void 0 === e && (e = this.skewY);
                var i, r, n = this._getNonTransformedDimensions(),
                    s = n.x / 2,
                    o = n.y / 2,
                    a = [{
                        x: -s,
                        y: -o
                    }, {
                        x: s,
                        y: -o
                    }, {
                        x: -s,
                        y: o
                    }, {
                        x: s,
                        y: o
                    }],
                    h = this._calcDimensionsTransformMatrix(t, e, !1);
                for(i = 0; i < a.length; i++) a[i] = fabric.util.transformPoint(a[i], h);
                return r = fabric.util.makeBoundingBoxFromPoints(a), {
                    x: r.width,
                    y: r.height
                }
            },
            _calculateCurrentDimensions: function() {
                var t = this.getViewportTransform(),
                    e = this._getTransformedDimensions();
                return fabric.util.transformPoint(e, t, !0).scalarAdd(2 * this.padding)
            }
        })
    }(), fabric.util.object.extend(fabric.Object.prototype, {
        sendToBack: function() {
            return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this
        },
        bringToFront: function() {
            return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this), this
        },
        sendBackwards: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t), this
        },
        bringForward: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t), this
        },
        moveTo: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t), this
        }
    }),
    function() {
        function t(t, e) {
            if(e) {
                if(e.toLive) return t + ": url(#SVGID_" + e.id + "); ";
                var i = new fabric.Color(e),
                    r = t + ": " + i.toRgb() + "; ",
                    n = i.getAlpha();
                return 1 !== n && (r += t + "-opacity: " + n.toString() + "; "), r
            }
            return t + ": none; "
        }
        fabric.util.object.extend(fabric.Object.prototype, {
            getSvgStyles: function(e) {
                var i = this.fillRule,
                    r = this.strokeWidth ? this.strokeWidth : "0",
                    n = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                    s = this.strokeLineCap ? this.strokeLineCap : "butt",
                    o = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                    a = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                    h = void 0 !== this.opacity ? this.opacity : "1",
                    c = this.visible ? "" : " visibility: hidden;",
                    l = e ? "" : this.getSvgFilter(),
                    u = t("fill", this.fill);
                return [t("stroke", this.stroke), "stroke-width: ", r, "; ", "stroke-dasharray: ", n, "; ", "stroke-linecap: ", s, "; ", "stroke-linejoin: ", o, "; ", "stroke-miterlimit: ", a, "; ", u, "fill-rule: ", i, "; ", "opacity: ", h, ";", l, c].join("")
            },
            getSvgFilter: function() {
                return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : ""
            },
            getSvgId: function() {
                return this.id ? 'id="' + this.id + '" ' : ""
            },
            getSvgTransform: function() {
                if(this.group && "path-group" === this.group.type) return "";
                var t = fabric.util.toFixed,
                    e = this.getAngle(),
                    i = this.getSkewX() % 360,
                    r = this.getSkewY() % 360,
                    n = this.getCenterPoint(),
                    s = fabric.Object.NUM_FRACTION_DIGITS,
                    o = "path-group" === this.type ? "" : "translate(" + t(n.x, s) + " " + t(n.y, s) + ")",
                    a = 0 !== e ? " rotate(" + t(e, s) + ")" : "",
                    h = 1 === this.scaleX && 1 === this.scaleY ? "" : " scale(" + t(this.scaleX, s) + " " + t(this.scaleY, s) + ")",
                    c = 0 !== i ? " skewX(" + t(i, s) + ")" : "",
                    l = 0 !== r ? " skewY(" + t(r, s) + ")" : "",
                    u = "path-group" === this.type ? this.width : 0,
                    f = this.flipX ? " matrix(-1 0 0 1 " + u + " 0) " : "",
                    d = "path-group" === this.type ? this.height : 0;
                return [o, a, h, f, this.flipY ? " matrix(1 0 0 -1 0 " + d + ")" : "", c, l].join("")
            },
            getSvgTransformMatrix: function() {
                return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : ""
            },
            _createBaseSVGMarkup: function() {
                var t = [];
                return this.fill && this.fill.toLive && t.push(this.fill.toSVG(this, !1)), this.stroke && this.stroke.toLive && t.push(this.stroke.toSVG(this, !1)), this.shadow && t.push(this.shadow.toSVG(this)), t
            }
        })
    }(),
    function() {
        function t(t, e, r) {
            var n = {};
            r.forEach(function(e) {
                n[e] = t[e]
            }), i(t[e], n, !0)
        }

        function e(t, i, r) {
            if(t === i) return !0;
            if(Array.isArray(t)) {
                if(t.length !== i.length) return !1;
                for(var n = 0, s = t.length; n < s; n++)
                    if(!e(t[n], i[n])) return !1;
                return !0
            }
            if(t && "object" == typeof t) {
                var o, a = Object.keys(t);
                if(!r && a.length !== Object.keys(i).length) return !1;
                for(var n = 0, s = a.length; n < s; n++)
                    if(o = a[n], !e(t[o], i[o])) return !1;
                return !0
            }
        }
        var i = fabric.util.object.extend;
        fabric.util.object.extend(fabric.Object.prototype, {
            hasStateChanged: function(t) {
                var i = "_" + (t = t || "stateProperties");
                return Object.keys(this[i]).length < this[t].length || !e(this[i], this, !0)
            },
            saveState: function(e) {
                var i = e && e.propertySet || "stateProperties",
                    r = "_" + i;
                return this[r] ? (t(this, r, this[i]), e && e.stateProperties && t(this, r, e.stateProperties), this) : this.setupState(e)
            },
            setupState: function(t) {
                var e = (t = t || {}).propertySet || "stateProperties";
                return t.propertySet = e, this["_" + e] = {}, this.saveState(t), this
            }
        })
    }(),
    function() {
        var t = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            _controlsVisibility: null,
            _findTargetCorner: function(t) {
                if(!this.hasControls || !this.active) return !1;
                var e, i, r = t.x,
                    n = t.y;
                this.__corner = 0;
                for(var s in this.oCoords)
                    if(this.isControlVisible(s) && ("mtr" !== s || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== s && "mr" !== s && "mb" !== s && "ml" !== s) && (i = this._getImageLines(this.oCoords[s].corner), 0 !== (e = this._findCrossPoints({
                            x: r,
                            y: n
                        }, i)) && e % 2 == 1)) return this.__corner = s, s;
                return !1
            },
            _setCornerCoords: function() {
                var e, i, r = this.oCoords,
                    n = t(45 - this.angle),
                    s = .707106 * this.cornerSize,
                    o = s * Math.cos(n),
                    a = s * Math.sin(n);
                for(var h in r) e = r[h].x, i = r[h].y, r[h].corner = {
                    tl: {
                        x: e - a,
                        y: i - o
                    },
                    tr: {
                        x: e + o,
                        y: i - a
                    },
                    bl: {
                        x: e - o,
                        y: i + a
                    },
                    br: {
                        x: e + a,
                        y: i + o
                    }
                }
            },
            drawSelectionBackground: function(e) {
                if(!this.selectionBackgroundColor || this.group || !this.active || this.canvas && !this.canvas.interactive) return this;
                e.save();
                var i = this.getCenterPoint(),
                    r = this._calculateCurrentDimensions(),
                    n = this.canvas.viewportTransform;
                return e.translate(i.x, i.y), e.scale(1 / n[0], 1 / n[3]), e.rotate(t(this.angle)), e.fillStyle = this.selectionBackgroundColor, e.fillRect(-r.x / 2, -r.y / 2, r.x, r.y), e.restore(), this
            },
            drawBorders: function(t) {
                if(!this.hasBorders) return this;
                var e = this._calculateCurrentDimensions(),
                    i = 1 / this.borderScaleFactor,
                    r = e.x + i,
                    n = e.y + i;
                if(t.save(), t.strokeStyle = this.borderColor, this._setLineDash(t, this.borderDashArray, null), t.strokeRect(-r / 2, -n / 2, r, n), this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls) {
                    var s = -n / 2;
                    t.beginPath(), t.moveTo(0, s), t.lineTo(0, s - this.rotatingPointOffset), t.closePath(), t.stroke()
                }
                return t.restore(), this
            },
            drawBordersInGroup: function(t, e) {
                if(!this.hasBorders) return this;
                var i = this._getNonTransformedDimensions(),
                    r = fabric.util.customTransformMatrix(e.scaleX, e.scaleY, e.skewX),
                    n = fabric.util.transformPoint(i, r),
                    s = 1 / this.borderScaleFactor,
                    o = n.x + s,
                    a = n.y + s;
                return t.save(), this._setLineDash(t, this.borderDashArray, null), t.strokeStyle = this.borderColor, t.strokeRect(-o / 2, -a / 2, o, a), t.restore(), this
            },
            drawControls: function(t) {
                if(!this.hasControls) return this;
                var e = this._calculateCurrentDimensions(),
                    i = e.x,
                    r = e.y,
                    n = this.cornerSize,
                    s = -(i + n) / 2,
                    o = -(r + n) / 2,
                    a = this.transparentCorners ? "stroke" : "fill";
                return t.save(), t.strokeStyle = t.fillStyle = this.cornerColor, this.transparentCorners || (t.strokeStyle = this.cornerStrokeColor), this._setLineDash(t, this.cornerDashArray, null), this._drawControl("tl", t, a, s, o), this._drawControl("tr", t, a, s + i, o), this._drawControl("bl", t, a, s, o + r), this._drawControl("br", t, a, s + i, o + r), this.get("lockUniScaling") || (this._drawControl("mt", t, a, s + i / 2, o), this._drawControl("mb", t, a, s + i / 2, o + r), this._drawControl("mr", t, a, s + i, o + r / 2), this._drawControl("ml", t, a, s, o + r / 2)), this.hasRotatingPoint && this._drawControl("mtr", t, a, s + i / 2, o - this.rotatingPointOffset), t.restore(), this
            },
            _drawControl: function(t, e, i, r, n) {
                if(this.isControlVisible(t)) {
                    var s = this.cornerSize,
                        o = !this.transparentCorners && this.cornerStrokeColor;
                    switch(this.cornerStyle) {
                        case "circle":
                            e.beginPath(), e.arc(r + s / 2, n + s / 2, s / 2, 0, 2 * Math.PI, !1), e[i](), o && e.stroke();
                            break;
                        default:
                            "undefined" != typeof G_vmlCanvasManager || this.transparentCorners || e.clearRect(r, n, s, s), e[i + "Rect"](r, n, s, s), o && e.strokeRect(r, n, s, s)
                    }
                }
            },
            isControlVisible: function(t) {
                return this._getControlsVisibility()[t]
            },
            setControlVisible: function(t, e) {
                return this._getControlsVisibility()[t] = e, this
            },
            setControlsVisibility: function(t) {
                t || (t = {});
                for(var e in t) this.setControlVisible(e, t[e]);
                return this
            },
            _getControlsVisibility: function() {
                return this._controlsVisibility || (this._controlsVisibility = {
                    tl: !0,
                    tr: !0,
                    br: !0,
                    bl: !0,
                    ml: !0,
                    mt: !0,
                    mr: !0,
                    mb: !0,
                    mtr: !0
                }), this._controlsVisibility
            }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        FX_DURATION: 500,
        fxCenterObjectH: function(t, e) {
            var i = function() {},
                r = (e = e || {}).onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("left"),
                endValue: this.getCenter().left,
                duration: this.FX_DURATION,
                onChange: function(e) {
                    t.set("left", e), s.renderAll(), n()
                },
                onComplete: function() {
                    t.setCoords(), r()
                }
            }), this
        },
        fxCenterObjectV: function(t, e) {
            var i = function() {},
                r = (e = e || {}).onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("top"),
                endValue: this.getCenter().top,
                duration: this.FX_DURATION,
                onChange: function(e) {
                    t.set("top", e), s.renderAll(), n()
                },
                onComplete: function() {
                    t.setCoords(), r()
                }
            }), this
        },
        fxRemove: function(t, e) {
            var i = function() {},
                r = (e = e || {}).onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("opacity"),
                endValue: 0,
                duration: this.FX_DURATION,
                onStart: function() {
                    t.set("active", !1)
                },
                onChange: function(e) {
                    t.set("opacity", e), s.renderAll(), n()
                },
                onComplete: function() {
                    s.remove(t), r()
                }
            }), this
        }
    }), fabric.util.object.extend(fabric.Object.prototype, {
        animate: function() {
            if(arguments[0] && "object" == typeof arguments[0]) {
                var t, e, i = [];
                for(t in arguments[0]) i.push(t);
                for(var r = 0, n = i.length; r < n; r++) t = i[r], e = r !== n - 1, this._animate(t, arguments[0][t], arguments[1], e)
            } else this._animate.apply(this, arguments);
            return this
        },
        _animate: function(t, e, i, r) {
            var n, s = this;
            e = e.toString(), i = i ? fabric.util.object.clone(i) : {}, ~t.indexOf(".") && (n = t.split("."));
            var o = n ? this.get(n[0])[n[1]] : this.get(t);
            "from" in i || (i.from = o), e = ~e.indexOf("=") ? o + parseFloat(e.replace("=", "")) : parseFloat(e), fabric.util.animate({
                startValue: i.from,
                endValue: e,
                byValue: i.by,
                easing: i.easing,
                duration: i.duration,
                abort: i.abort && function() {
                    return i.abort.call(s)
                },
                onChange: function(e, o, a) {
                    n ? s[n[0]][n[1]] = e : s.set(t, e), r || i.onChange && i.onChange(e, o, a)
                },
                onComplete: function(t, e, n) {
                    r || (s.setCoords(), i.onComplete && i.onComplete(t, e, n))
                }
            })
        }
    }),
    function(t) {
        "use strict";

        function e(t, e) {
            var i = t.origin,
                r = t.axis1,
                n = t.axis2,
                s = t.dimension,
                o = e.nearest,
                a = e.center,
                h = e.farthest;
            return function() {
                switch(this.get(i)) {
                    case o:
                        return Math.min(this.get(r), this.get(n));
                    case a:
                        return Math.min(this.get(r), this.get(n)) + .5 * this.get(s);
                    case h:
                        return Math.max(this.get(r), this.get(n))
                }
            }
        }
        var i = t.fabric || (t.fabric = {}),
            r = i.util.object.extend,
            n = i.util.object.clone,
            s = {
                x1: 1,
                x2: 1,
                y1: 1,
                y2: 1
            },
            o = i.StaticCanvas.supports("setLineDash");
        i.Line ? i.warn("fabric.Line is already defined") : (i.Line = i.util.createClass(i.Object, {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            cacheProperties: i.Object.prototype.cacheProperties.concat("x1", "x2", "y1", "y2"),
            initialize: function(t, e) {
                t || (t = [0, 0, 0, 0]), this.callSuper("initialize", e), this.set("x1", t[0]), this.set("y1", t[1]), this.set("x2", t[2]), this.set("y2", t[3]), this._setWidthHeight(e)
            },
            _setWidthHeight: function(t) {
                t || (t = {}), this.width = Math.abs(this.x2 - this.x1), this.height = Math.abs(this.y2 - this.y1), this.left = "left" in t ? t.left : this._getLeftToOriginX(), this.top = "top" in t ? t.top : this._getTopToOriginY()
            },
            _set: function(t, e) {
                return this.callSuper("_set", t, e), void 0 !== s[t] && this._setWidthHeight(), this
            },
            _getLeftToOriginX: e({
                origin: "originX",
                axis1: "x1",
                axis2: "x2",
                dimension: "width"
            }, {
                nearest: "left",
                center: "center",
                farthest: "right"
            }),
            _getTopToOriginY: e({
                origin: "originY",
                axis1: "y1",
                axis2: "y2",
                dimension: "height"
            }, {
                nearest: "top",
                center: "center",
                farthest: "bottom"
            }),
            _render: function(t, e) {
                if(t.beginPath(), e) {
                    var i = this.getCenterPoint(),
                        r = this.strokeWidth / 2;
                    t.translate(i.x - ("butt" === this.strokeLineCap && 0 === this.height ? 0 : r), i.y - ("butt" === this.strokeLineCap && 0 === this.width ? 0 : r))
                }
                if(!this.strokeDashArray || this.strokeDashArray && o) {
                    var n = this.calcLinePoints();
                    t.moveTo(n.x1, n.y1), t.lineTo(n.x2, n.y2)
                }
                t.lineWidth = this.strokeWidth;
                var s = t.strokeStyle;
                t.strokeStyle = this.stroke || t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = s
            },
            _renderDashedStroke: function(t) {
                var e = this.calcLinePoints();
                t.beginPath(), i.util.drawDashedLine(t, e.x1, e.y1, e.x2, e.y2, this.strokeDashArray), t.closePath()
            },
            toObject: function(t) {
                return r(this.callSuper("toObject", t), this.calcLinePoints())
            },
            _getNonTransformedDimensions: function() {
                var t = this.callSuper("_getNonTransformedDimensions");
                return "butt" === this.strokeLineCap && (0 === this.width && (t.y -= this.strokeWidth), 0 === this.height && (t.x -= this.strokeWidth)), t
            },
            calcLinePoints: function() {
                var t = this.x1 <= this.x2 ? -1 : 1,
                    e = this.y1 <= this.y2 ? -1 : 1,
                    i = t * this.width * .5,
                    r = e * this.height * .5;
                return {
                    x1: i,
                    x2: t * this.width * -.5,
                    y1: r,
                    y2: e * this.height * -.5
                }
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = {
                        x1: this.x1,
                        x2: this.x2,
                        y1: this.y1,
                        y2: this.y2
                    };
                return this.group && "path-group" === this.group.type || (i = this.calcLinePoints()), e.push("<line ", this.getSvgId(), 'x1="', i.x1, '" y1="', i.y1, '" x2="', i.x2, '" y2="', i.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            }
        }), i.Line.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), i.Line.fromElement = function(t, e) {
            e = e || {};
            var n = i.parseAttributes(t, i.Line.ATTRIBUTE_NAMES),
                s = [n.x1 || 0, n.y1 || 0, n.x2 || 0, n.y2 || 0];
            return e.originX = "left", e.originY = "top", new i.Line(s, r(n, e))
        }, i.Line.fromObject = function(t, e, r) {
            var s = n(t, !0);
            s.points = [t.x1, t.y1, t.x2, t.y2];
            var o = i.Object._fromObject("Line", s, function(t) {
                delete t.points, e && e(t)
            }, r, "points");
            return o && delete o.points, o
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = Math.PI,
            r = e.util.object.extend;
        e.Circle ? e.warn("fabric.Circle is already defined.") : (e.Circle = e.util.createClass(e.Object, {
            type: "circle",
            radius: 0,
            startAngle: 0,
            endAngle: 2 * i,
            cacheProperties: e.Object.prototype.cacheProperties.concat("radius"),
            initialize: function(t) {
                this.callSuper("initialize", t), this.set("radius", t && t.radius || 0)
            },
            _set: function(t, e) {
                return this.callSuper("_set", t, e), "radius" === t && this.setRadius(e), this
            },
            toObject: function(t) {
                return this.callSuper("toObject", ["radius", "startAngle", "endAngle"].concat(t))
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    r = 0,
                    n = 0,
                    s = (this.endAngle - this.startAngle) % (2 * i);
                if(0 === s) this.group && "path-group" === this.group.type && (r = this.left + this.radius, n = this.top + this.radius), e.push("<circle ", this.getSvgId(), 'cx="' + r + '" cy="' + n + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
                else {
                    var o = Math.cos(this.startAngle) * this.radius,
                        a = Math.sin(this.startAngle) * this.radius,
                        h = Math.cos(this.endAngle) * this.radius,
                        c = Math.sin(this.endAngle) * this.radius,
                        l = s > i ? "1" : "0";
                    e.push('<path d="M ' + o + " " + a, " A " + this.radius + " " + this.radius, " 0 ", +l + " 1", " " + h + " " + c, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n')
                }
                return t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(), t.arc(e ? this.left + this.radius : 0, e ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, !1), this._renderFill(t), this._renderStroke(t)
            },
            getRadiusX: function() {
                return this.get("radius") * this.get("scaleX")
            },
            getRadiusY: function() {
                return this.get("radius") * this.get("scaleY")
            },
            setRadius: function(t) {
                return this.radius = t, this.set("width", 2 * t).set("height", 2 * t)
            }
        }), e.Circle.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), e.Circle.fromElement = function(t, i) {
            i || (i = {});
            var n = e.parseAttributes(t, e.Circle.ATTRIBUTE_NAMES);
            if(! function(t) {
                    return "radius" in t && t.radius >= 0
                }(n)) throw new Error("value of `r` attribute is required and can not be negative");
            n.left = n.left || 0, n.top = n.top || 0;
            var s = new e.Circle(r(n, i));
            return s.left -= s.radius, s.top -= s.radius, s
        }, e.Circle.fromObject = function(t, i, r) {
            return e.Object._fromObject("Circle", t, i, r)
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Triangle ? e.warn("fabric.Triangle is already defined") : (e.Triangle = e.util.createClass(e.Object, {
            type: "triangle",
            initialize: function(t) {
                this.callSuper("initialize", t), this.set("width", t && t.width || 100).set("height", t && t.height || 100)
            },
            _render: function(t) {
                var e = this.width / 2,
                    i = this.height / 2;
                t.beginPath(), t.moveTo(-e, i), t.lineTo(0, -i), t.lineTo(e, i), t.closePath(), this._renderFill(t), this._renderStroke(t)
            },
            _renderDashedStroke: function(t) {
                var i = this.width / 2,
                    r = this.height / 2;
                t.beginPath(), e.util.drawDashedLine(t, -i, r, 0, -r, this.strokeDashArray), e.util.drawDashedLine(t, 0, -r, i, r, this.strokeDashArray), e.util.drawDashedLine(t, i, r, -i, r, this.strokeDashArray), t.closePath()
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = this.width / 2,
                    r = this.height / 2,
                    n = [-i + " " + r, "0 " + -r, i + " " + r].join(",");
                return e.push("<polygon ", this.getSvgId(), 'points="', n, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>'), t ? t(e.join("")) : e.join("")
            }
        }), e.Triangle.fromObject = function(t, i, r) {
            return e.Object._fromObject("Triangle", t, i, r)
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = 2 * Math.PI,
            r = e.util.object.extend;
        e.Ellipse ? e.warn("fabric.Ellipse is already defined.") : (e.Ellipse = e.util.createClass(e.Object, {
            type: "ellipse",
            rx: 0,
            ry: 0,
            cacheProperties: e.Object.prototype.cacheProperties.concat("rx", "ry"),
            initialize: function(t) {
                this.callSuper("initialize", t), this.set("rx", t && t.rx || 0), this.set("ry", t && t.ry || 0)
            },
            _set: function(t, e) {
                switch(this.callSuper("_set", t, e), t) {
                    case "rx":
                        this.rx = e, this.set("width", 2 * e);
                        break;
                    case "ry":
                        this.ry = e, this.set("height", 2 * e)
                }
                return this
            },
            getRx: function() {
                return this.get("rx") * this.get("scaleX")
            },
            getRy: function() {
                return this.get("ry") * this.get("scaleY")
            },
            toObject: function(t) {
                return this.callSuper("toObject", ["rx", "ry"].concat(t))
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = 0,
                    r = 0;
                return this.group && "path-group" === this.group.type && (i = this.left + this.rx, r = this.top + this.ry), e.push("<ellipse ", this.getSvgId(), 'cx="', i, '" cy="', r, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(e ? this.left + this.rx : 0, e ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, i, !1), t.restore(), this._renderFill(t), this._renderStroke(t)
            }
        }), e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), e.Ellipse.fromElement = function(t, i) {
            i || (i = {});
            var n = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES);
            n.left = n.left || 0, n.top = n.top || 0;
            var s = new e.Ellipse(r(n, i));
            return s.top -= s.ry, s.left -= s.rx, s
        }, e.Ellipse.fromObject = function(t, i, r) {
            return e.Object._fromObject("Ellipse", t, i, r)
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Rect ? e.warn("fabric.Rect is already defined") : (e.Rect = e.util.createClass(e.Object, {
            stateProperties: e.Object.prototype.stateProperties.concat("rx", "ry"),
            type: "rect",
            rx: 0,
            ry: 0,
            cacheProperties: e.Object.prototype.cacheProperties.concat("rx", "ry"),
            initialize: function(t) {
                this.callSuper("initialize", t), this._initRxRy()
            },
            _initRxRy: function() {
                this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
            },
            _render: function(t, e) {
                if(1 !== this.width || 1 !== this.height) {
                    var i = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                        r = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                        n = this.width,
                        s = this.height,
                        o = e ? this.left : -this.width / 2,
                        a = e ? this.top : -this.height / 2,
                        h = 0 !== i || 0 !== r,
                        c = .4477152502;
                    t.beginPath(), t.moveTo(o + i, a), t.lineTo(o + n - i, a), h && t.bezierCurveTo(o + n - c * i, a, o + n, a + c * r, o + n, a + r), t.lineTo(o + n, a + s - r), h && t.bezierCurveTo(o + n, a + s - c * r, o + n - c * i, a + s, o + n - i, a + s), t.lineTo(o + i, a + s), h && t.bezierCurveTo(o + c * i, a + s, o, a + s - c * r, o, a + s - r), t.lineTo(o, a + r), h && t.bezierCurveTo(o, a + c * r, o + c * i, a, o + i, a), t.closePath(), this._renderFill(t), this._renderStroke(t)
                } else t.fillRect(-.5, -.5, 1, 1)
            },
            _renderDashedStroke: function(t) {
                var i = -this.width / 2,
                    r = -this.height / 2,
                    n = this.width,
                    s = this.height;
                t.beginPath(), e.util.drawDashedLine(t, i, r, i + n, r, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r, i + n, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r + s, i, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i, r + s, i, r, this.strokeDashArray), t.closePath()
            },
            toObject: function(t) {
                return this.callSuper("toObject", ["rx", "ry"].concat(t))
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = this.left,
                    r = this.top;
                return this.group && "path-group" === this.group.type || (i = -this.width / 2, r = -this.height / 2), e.push("<rect ", this.getSvgId(), 'x="', i, '" y="', r, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            }
        }), e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), e.Rect.fromElement = function(t, r) {
            if(!t) return null;
            r = r || {};
            var n = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES);
            n.left = n.left || 0, n.top = n.top || 0;
            var s = new e.Rect(i(r ? e.util.object.clone(r) : {}, n));
            return s.visible = s.visible && s.width > 0 && s.height > 0, s
        }, e.Rect.fromObject = function(t, i, r) {
            return e.Object._fromObject("Rect", t, i, r)
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.min,
            n = e.util.array.max,
            s = e.util.toFixed,
            o = e.Object.NUM_FRACTION_DIGITS;
        e.Polyline ? e.warn("fabric.Polyline is already defined") : (e.Polyline = e.util.createClass(e.Object, {
            type: "polyline",
            points: null,
            minX: 0,
            minY: 0,
            cacheProperties: e.Object.prototype.cacheProperties.concat("points"),
            initialize: function(t, e) {
                e = e || {}, this.points = t || [], this.callSuper("initialize", e), this._calcDimensions(), "top" in e || (this.top = this.minY), "left" in e || (this.left = this.minX), this.pathOffset = {
                    x: this.minX + this.width / 2,
                    y: this.minY + this.height / 2
                }
            },
            _calcDimensions: function() {
                var t = this.points,
                    e = r(t, "x"),
                    i = r(t, "y"),
                    s = n(t, "x"),
                    o = n(t, "y");
                this.width = s - e || 0, this.height = o - i || 0, this.minX = e || 0, this.minY = i || 0
            },
            toObject: function(t) {
                return i(this.callSuper("toObject", t), {
                    points: this.points.concat()
                })
            },
            toSVG: function(t) {
                var e = [],
                    i = 0,
                    r = 0,
                    n = this._createBaseSVGMarkup();
                this.group && "path-group" === this.group.type || (i = this.pathOffset.x, r = this.pathOffset.y);
                for(var a = 0, h = this.points.length; a < h; a++) e.push(s(this.points[a].x - i, o), ",", s(this.points[a].y - r, o), " ");
                return n.push("<", this.type, " ", this.getSvgId(), 'points="', e.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n'), t ? t(n.join("")) : n.join("")
            },
            commonRender: function(t, e) {
                var i, r = this.points.length,
                    n = e ? 0 : this.pathOffset.x,
                    s = e ? 0 : this.pathOffset.y;
                if(!r || isNaN(this.points[r - 1].y)) return !1;
                t.beginPath(), t.moveTo(this.points[0].x - n, this.points[0].y - s);
                for(var o = 0; o < r; o++) i = this.points[o], t.lineTo(i.x - n, i.y - s);
                return !0
            },
            _render: function(t, e) {
                this.commonRender(t, e) && (this._renderFill(t), this._renderStroke(t))
            },
            _renderDashedStroke: function(t) {
                var i, r;
                t.beginPath();
                for(var n = 0, s = this.points.length; n < s; n++) i = this.points[n], r = this.points[n + 1] || i, e.util.drawDashedLine(t, i.x, i.y, r.x, r.y, this.strokeDashArray)
            },
            complexity: function() {
                return this.get("points").length
            }
        }), e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polyline.fromElement = function(t, i) {
            if(!t) return null;
            i || (i = {});
            var r = e.parsePointsAttribute(t.getAttribute("points")),
                n = e.parseAttributes(t, e.Polyline.ATTRIBUTE_NAMES);
            return new e.Polyline(r, e.util.object.extend(n, i))
        }, e.Polyline.fromObject = function(t, i, r) {
            return e.Object._fromObject("Polyline", t, i, r, "points")
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Polygon ? e.warn("fabric.Polygon is already defined") : (e.Polygon = e.util.createClass(e.Polyline, {
            type: "polygon",
            _render: function(t, e) {
                this.commonRender(t, e) && (t.closePath(), this._renderFill(t), this._renderStroke(t))
            },
            _renderDashedStroke: function(t) {
                this.callSuper("_renderDashedStroke", t), t.closePath()
            }
        }), e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polygon.fromElement = function(t, r) {
            if(!t) return null;
            r || (r = {});
            var n = e.parsePointsAttribute(t.getAttribute("points")),
                s = e.parseAttributes(t, e.Polygon.ATTRIBUTE_NAMES);
            return new e.Polygon(n, i(s, r))
        }, e.Polygon.fromObject = function(t, i, r) {
            return e.Object._fromObject("Polygon", t, i, r, "points")
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.array.min,
            r = e.util.array.max,
            n = e.util.object.extend,
            s = Object.prototype.toString,
            o = e.util.drawArc,
            a = {
                m: 2,
                l: 2,
                h: 1,
                v: 1,
                c: 6,
                s: 4,
                q: 4,
                t: 2,
                a: 7
            },
            h = {
                m: "l",
                M: "L"
            };
        e.Path ? e.warn("fabric.Path is already defined") : (e.Path = e.util.createClass(e.Object, {
            type: "path",
            path: null,
            minX: 0,
            minY: 0,
            cacheProperties: e.Object.prototype.cacheProperties.concat("path", "fillRule"),
            stateProperties: e.Object.prototype.stateProperties.concat("path"),
            initialize: function(t, e) {
                e = e || {}, this.callSuper("initialize", e), t || (t = []);
                var i = "[object Array]" === s.call(t);
                this.path = i ? t : t.match && t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi), this.path && (i || (this.path = this._parsePath()), this._setPositionDimensions(e))
            },
            _setPositionDimensions: function(t) {
                var e = this._parseDimensions();
                this.minX = e.left, this.minY = e.top, this.width = e.width, this.height = e.height, void 0 === t.left && (this.left = e.left + ("center" === this.originX ? this.width / 2 : "right" === this.originX ? this.width : 0)), void 0 === t.top && (this.top = e.top + ("center" === this.originY ? this.height / 2 : "bottom" === this.originY ? this.height : 0)), this.pathOffset = this.pathOffset || {
                    x: this.minX + this.width / 2,
                    y: this.minY + this.height / 2
                }
            },
            _renderPathCommands: function(t) {
                var e, i, r, n = null,
                    s = 0,
                    a = 0,
                    h = 0,
                    c = 0,
                    l = 0,
                    u = 0,
                    f = -this.pathOffset.x,
                    d = -this.pathOffset.y;
                this.group && "path-group" === this.group.type && (f = 0, d = 0), t.beginPath();
                for(var g = 0, p = this.path.length; g < p; ++g) {
                    switch((e = this.path[g])[0]) {
                        case "l":
                            h += e[1], c += e[2], t.lineTo(h + f, c + d);
                            break;
                        case "L":
                            h = e[1], c = e[2], t.lineTo(h + f, c + d);
                            break;
                        case "h":
                            h += e[1], t.lineTo(h + f, c + d);
                            break;
                        case "H":
                            h = e[1], t.lineTo(h + f, c + d);
                            break;
                        case "v":
                            c += e[1], t.lineTo(h + f, c + d);
                            break;
                        case "V":
                            c = e[1], t.lineTo(h + f, c + d);
                            break;
                        case "m":
                            s = h += e[1], a = c += e[2], t.moveTo(h + f, c + d);
                            break;
                        case "M":
                            s = h = e[1], a = c = e[2], t.moveTo(h + f, c + d);
                            break;
                        case "c":
                            i = h + e[5], r = c + e[6], l = h + e[3], u = c + e[4], t.bezierCurveTo(h + e[1] + f, c + e[2] + d, l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "C":
                            h = e[5], c = e[6], l = e[3], u = e[4], t.bezierCurveTo(e[1] + f, e[2] + d, l + f, u + d, h + f, c + d);
                            break;
                        case "s":
                            i = h + e[3], r = c + e[4], null === n[0].match(/[CcSs]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.bezierCurveTo(l + f, u + d, h + e[1] + f, c + e[2] + d, i + f, r + d), l = h + e[1], u = c + e[2], h = i, c = r;
                            break;
                        case "S":
                            i = e[3], r = e[4], null === n[0].match(/[CcSs]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.bezierCurveTo(l + f, u + d, e[1] + f, e[2] + d, i + f, r + d), h = i, c = r, l = e[1], u = e[2];
                            break;
                        case "q":
                            i = h + e[3], r = c + e[4], l = h + e[1], u = c + e[2], t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "Q":
                            i = e[3], r = e[4], t.quadraticCurveTo(e[1] + f, e[2] + d, i + f, r + d), h = i, c = r, l = e[1], u = e[2];
                            break;
                        case "t":
                            i = h + e[1], r = c + e[2], null === n[0].match(/[QqTt]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "T":
                            i = e[1], r = e[2], null === n[0].match(/[QqTt]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "a":
                            o(t, h + f, c + d, [e[1], e[2], e[3], e[4], e[5], e[6] + h + f, e[7] + c + d]), h += e[6], c += e[7];
                            break;
                        case "A":
                            o(t, h + f, c + d, [e[1], e[2], e[3], e[4], e[5], e[6] + f, e[7] + d]), h = e[6], c = e[7];
                            break;
                        case "z":
                        case "Z":
                            h = s, c = a, t.closePath()
                    }
                    n = e
                }
            },
            _render: function(t) {
                this._renderPathCommands(t), this._renderFill(t), this._renderStroke(t)
            },
            toString: function() {
                return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
            },
            toObject: function(t) {
                return n(this.callSuper("toObject", ["sourcePath", "pathOffset"].concat(t)), {
                    path: this.path.map(function(t) {
                        return t.slice()
                    }),
                    top: this.top,
                    left: this.left
                })
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.path = this.sourcePath), delete e.sourcePath, e
            },
            toSVG: function(t) {
                for(var e = [], i = this._createBaseSVGMarkup(), r = "", n = 0, s = this.path.length; n < s; n++) e.push(this.path[n].join(" "));
                var o = e.join(" ");
                return this.group && "path-group" === this.group.type || (r = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") "), i.push("<path ", this.getSvgId(), 'd="', o, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), r, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n"), t ? t(i.join("")) : i.join("")
            },
            complexity: function() {
                return this.path.length
            },
            _parsePath: function() {
                for(var t, e, i, r, n, s = [], o = [], c = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, l = 0, u = this.path.length; l < u; l++) {
                    for(r = (t = this.path[l]).slice(1).trim(), o.length = 0; i = c.exec(r);) o.push(i[0]);
                    n = [t.charAt(0)];
                    for(var f = 0, d = o.length; f < d; f++) e = parseFloat(o[f]), isNaN(e) || n.push(e);
                    var g = n[0],
                        p = a[g.toLowerCase()],
                        v = h[g] || g;
                    if(n.length - 1 > p)
                        for(var b = 1, m = n.length; b < m; b += p) s.push([g].concat(n.slice(b, b + p))), g = v;
                    else s.push(n)
                }
                return s
            },
            _parseDimensions: function() {
                for(var t, n, s, o, a = [], h = [], c = null, l = 0, u = 0, f = 0, d = 0, g = 0, p = 0, v = 0, b = this.path.length; v < b; ++v) {
                    switch((t = this.path[v])[0]) {
                        case "l":
                            f += t[1], d += t[2], o = [];
                            break;
                        case "L":
                            f = t[1], d = t[2], o = [];
                            break;
                        case "h":
                            f += t[1], o = [];
                            break;
                        case "H":
                            f = t[1], o = [];
                            break;
                        case "v":
                            d += t[1], o = [];
                            break;
                        case "V":
                            d = t[1], o = [];
                            break;
                        case "m":
                            l = f += t[1], u = d += t[2], o = [];
                            break;
                        case "M":
                            l = f = t[1], u = d = t[2], o = [];
                            break;
                        case "c":
                            n = f + t[5], s = d + t[6], g = f + t[3], p = d + t[4], o = e.util.getBoundsOfCurve(f, d, f + t[1], d + t[2], g, p, n, s), f = n, d = s;
                            break;
                        case "C":
                            g = t[3], p = t[4], o = e.util.getBoundsOfCurve(f, d, t[1], t[2], g, p, t[5], t[6]), f = t[5], d = t[6];
                            break;
                        case "s":
                            n = f + t[3], s = d + t[4], null === c[0].match(/[CcSs]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, f + t[1], d + t[2], n, s), g = f + t[1], p = d + t[2], f = n, d = s;
                            break;
                        case "S":
                            n = t[3], s = t[4], null === c[0].match(/[CcSs]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, t[1], t[2], n, s), f = n, d = s, g = t[1], p = t[2];
                            break;
                        case "q":
                            n = f + t[3], s = d + t[4], g = f + t[1], p = d + t[2], o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "Q":
                            g = t[1], p = t[2], o = e.util.getBoundsOfCurve(f, d, g, p, g, p, t[3], t[4]), f = t[3], d = t[4];
                            break;
                        case "t":
                            n = f + t[1], s = d + t[2], null === c[0].match(/[QqTt]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "T":
                            n = t[1], s = t[2], null === c[0].match(/[QqTt]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "a":
                            o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6] + f, t[7] + d), f += t[6], d += t[7];
                            break;
                        case "A":
                            o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6], t[7]), f = t[6], d = t[7];
                            break;
                        case "z":
                        case "Z":
                            f = l, d = u
                    }
                    c = t, o.forEach(function(t) {
                        a.push(t.x), h.push(t.y)
                    }), a.push(f), h.push(d)
                }
                var m = i(a) || 0,
                    _ = i(h) || 0;
                return {
                    left: m,
                    top: _,
                    width: (r(a) || 0) - m,
                    height: (r(h) || 0) - _
                }
            }
        }), e.Path.fromObject = function(t, i, r) {
            var n;
            if("string" != typeof t.path) return e.Object._fromObject("Path", t, i, r, "path");
            e.loadSVGFromURL(t.path, function(e) {
                var r = t.path;
                n = e[0], delete t.path, n.setOptions(t), n.setSourcePath(r), i && i(n)
            })
        }, e.Path.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(["d"]), e.Path.fromElement = function(t, i, r) {
            var s = e.parseAttributes(t, e.Path.ATTRIBUTE_NAMES);
            i && i(new e.Path(s.d, n(s, r)))
        }, e.Path.async = !0)
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.PathGroup ? e.warn("fabric.PathGroup is already defined") : (e.PathGroup = e.util.createClass(e.Object, {
            type: "path-group",
            fill: "",
            cacheProperties: [],
            initialize: function(t, e) {
                e = e || {}, this.paths = t || [];
                for(var i = this.paths.length; i--;) this.paths[i].group = this;
                e.toBeParsed && (this.parseDimensionsFromPaths(e), delete e.toBeParsed), this.setOptions(e), this.setCoords()
            },
            parseDimensionsFromPaths: function(t) {
                for(var i, r, n, s, o, a, h = [], c = [], l = this.paths.length; l--;) {
                    s = (n = this.paths[l]).height + n.strokeWidth, o = n.width + n.strokeWidth, i = [{
                        x: n.left,
                        y: n.top
                    }, {
                        x: n.left + o,
                        y: n.top
                    }, {
                        x: n.left,
                        y: n.top + s
                    }, {
                        x: n.left + o,
                        y: n.top + s
                    }], a = this.paths[l].transformMatrix;
                    for(var u = 0; u < i.length; u++) r = i[u], a && (r = e.util.transformPoint(r, a, !1)), h.push(r.x), c.push(r.y)
                }
                t.width = Math.max.apply(null, h), t.height = Math.max.apply(null, c)
            },
            drawObject: function(t) {
                t.save(), t.translate(-this.width / 2, -this.height / 2);
                for(var e = 0, i = this.paths.length; e < i; ++e) this.paths[e].render(t, !0);
                t.restore()
            },
            shouldCache: function() {
                var t = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isCaching());
                if(this.caching = t, t)
                    for(var e = 0, i = this.paths.length; e < i; e++)
                        if(this.paths[e].willDrawShadow()) return this.caching = !1, !1;
                return t
            },
            willDrawShadow: function() {
                if(this.shadow) return !0;
                for(var t = 0, e = this.paths.length; t < e; t++)
                    if(this.paths[t].willDrawShadow()) return !0;
                return !1
            },
            isCaching: function() {
                return this.caching || this.group && this.group.isCaching()
            },
            isCacheDirty: function() {
                if(this.callSuper("isCacheDirty")) return !0;
                if(!this.statefullCache) return !1;
                for(var t = 0, e = this.paths.length; t < e; t++)
                    if(this.paths[t].isCacheDirty(!0)) {
                        if(this._cacheCanvas) {
                            var i = this.cacheWidth / this.zoomX,
                                r = this.cacheHeight / this.zoomY;
                            this._cacheContext.clearRect(-i / 2, -r / 2, i, r)
                        }
                        return !0
                    }
                return !1
            },
            _set: function(t, e) {
                if("fill" === t && e && this.isSameColor())
                    for(var i = this.paths.length; i--;) this.paths[i]._set(t, e);
                return this.callSuper("_set", t, e)
            },
            toObject: function(t) {
                var e = this.paths.map(function(e) {
                    var i = e.includeDefaultValues;
                    e.includeDefaultValues = e.group.includeDefaultValues;
                    var r = e.toObject(t);
                    return e.includeDefaultValues = i, r
                });
                return i(this.callSuper("toObject", ["sourcePath"].concat(t)), {
                    paths: e
                })
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.paths = this.sourcePath), e
            },
            toSVG: function(t) {
                var e = this.getObjects(),
                    i = this.getPointByOrigin("left", "top"),
                    r = "translate(" + i.x + " " + i.y + ")",
                    n = this._createBaseSVGMarkup();
                n.push("<g ", this.getSvgId(), 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransformMatrix(), r, this.getSvgTransform(), '" ', ">\n");
                for(var s = 0, o = e.length; s < o; s++) n.push("\t", e[s].toSVG(t));
                return n.push("</g>\n"), t ? t(n.join("")) : n.join("")
            },
            toString: function() {
                return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
            },
            isSameColor: function() {
                var t = this.getObjects()[0].get("fill") || "";
                return "string" == typeof t && (t = t.toLowerCase(), this.getObjects().every(function(e) {
                    var i = e.get("fill") || "";
                    return "string" == typeof i && i.toLowerCase() === t
                }))
            },
            complexity: function() {
                return this.paths.reduce(function(t, e) {
                    return t + (e && e.complexity ? e.complexity() : 0)
                }, 0)
            },
            getObjects: function() {
                return this.paths
            }
        }), e.PathGroup.fromObject = function(t, i) {
            var r = t.paths;
            delete t.paths, "string" == typeof r ? e.loadSVGFromURL(r, function(n) {
                var s = r,
                    o = e.util.groupSVGElements(n, t, s);
                t.paths = r, i(o)
            }) : e.util.enlivenObjects(r, function(n) {
                var s = new e.PathGroup(n, t);
                t.paths = r, i(s)
            })
        }, e.PathGroup.async = !0)
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.min,
            n = e.util.array.max;
        if(!e.Group) {
            var s = {
                lockMovementX: !0,
                lockMovementY: !0,
                lockRotation: !0,
                lockScalingX: !0,
                lockScalingY: !0,
                lockUniScaling: !0
            };
            e.Group = e.util.createClass(e.Object, e.Collection, {
                type: "group",
                strokeWidth: 0,
                subTargetCheck: !1,
                cacheProperties: [],
                initialize: function(t, e, i) {
                    e = e || {}, this._objects = [], i && this.callSuper("initialize", e), this._objects = t || [];
                    for(var r = this._objects.length; r--;) this._objects[r].group = this;
                    e.originX && (this.originX = e.originX), e.originY && (this.originY = e.originY), i ? (this._updateObjectsCoords(!0), this._updateObjectsACoords()) : (this._calcBounds(), this._updateObjectsCoords(), this.callSuper("initialize", e)), this.setCoords(), this.saveCoords()
                },
                _updateObjectsACoords: function() {
                    for(var t = this._objects.length; t--;) this._objects[t].setCoords(!0, !0)
                },
                _updateObjectsCoords: function(t) {
                    for(var e = this.getCenterPoint(), i = this._objects.length; i--;) this._updateObjectCoords(this._objects[i], e, t)
                },
                _updateObjectCoords: function(t, e, i) {
                    if(t.__origHasControls = t.hasControls, t.hasControls = !1, !i) {
                        var r = t.getLeft(),
                            n = t.getTop();
                        t.set({
                            left: r - e.x,
                            top: n - e.y
                        }), t.setCoords(!0, !0)
                    }
                },
                toString: function() {
                    return "#<fabric.Group: (" + this.complexity() + ")>"
                },
                addWithUpdate: function(t) {
                    return this._restoreObjectsState(), e.util.resetObjectTransform(this), t && (this._objects.push(t), t.group = this, t._set("canvas", this.canvas)), this.forEachObject(this._setObjectActive, this), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this
                },
                _setObjectActive: function(t) {
                    t.set("active", !0), t.group = this
                },
                removeWithUpdate: function(t) {
                    return this._restoreObjectsState(), e.util.resetObjectTransform(this), this.forEachObject(this._setObjectActive, this), this.remove(t), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this
                },
                _onObjectAdded: function(t) {
                    this.dirty = !0, t.group = this, t._set("canvas", this.canvas)
                },
                _onObjectRemoved: function(t) {
                    this.dirty = !0, delete t.group, t.set("active", !1)
                },
                delegatedProperties: {
                    fill: !0,
                    stroke: !0,
                    strokeWidth: !0,
                    fontFamily: !0,
                    fontWeight: !0,
                    fontSize: !0,
                    fontStyle: !0,
                    lineHeight: !0,
                    textDecoration: !0,
                    textAlign: !0,
                    backgroundColor: !0
                },
                _set: function(t, e) {
                    var i = this._objects.length;
                    if(this.delegatedProperties[t] || "canvas" === t)
                        for(; i--;) this._objects[i].set(t, e);
                    else
                        for(; i--;) this._objects[i].setOnGroup(t, e);
                    this.callSuper("_set", t, e)
                },
                toObject: function(t) {
                    var e = this.getObjects().map(function(e) {
                        var i = e.includeDefaultValues;
                        e.includeDefaultValues = e.group.includeDefaultValues;
                        var r = e.toObject(t);
                        return e.includeDefaultValues = i, r
                    });
                    return i(this.callSuper("toObject", t), {
                        objects: e
                    })
                },
                toDatalessObject: function(t) {
                    var e = this.getObjects().map(function(e) {
                        var i = e.includeDefaultValues;
                        e.includeDefaultValues = e.group.includeDefaultValues;
                        var r = e.toDatalessObject(t);
                        return e.includeDefaultValues = i, r
                    });
                    return i(this.callSuper("toDatalessObject", t), {
                        objects: e
                    })
                },
                render: function(t) {
                    this._transformDone = !0, this.callSuper("render", t), this._transformDone = !1
                },
                shouldCache: function() {
                    var t = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isCaching());
                    if(this.caching = t, t)
                        for(var e = 0, i = this._objects.length; e < i; e++)
                            if(this._objects[e].willDrawShadow()) return this.caching = !1, !1;
                    return t
                },
                willDrawShadow: function() {
                    if(this.callSuper("willDrawShadow")) return !0;
                    for(var t = 0, e = this._objects.length; t < e; t++)
                        if(this._objects[t].willDrawShadow()) return !0;
                    return !1
                },
                isCaching: function() {
                    return this.caching || this.group && this.group.isCaching()
                },
                drawObject: function(t) {
                    for(var e = 0, i = this._objects.length; e < i; e++) this._renderObject(this._objects[e], t)
                },
                isCacheDirty: function() {
                    if(this.callSuper("isCacheDirty")) return !0;
                    if(!this.statefullCache) return !1;
                    for(var t = 0, e = this._objects.length; t < e; t++)
                        if(this._objects[t].isCacheDirty(!0)) {
                            if(this._cacheCanvas) {
                                var i = this.cacheWidth / this.zoomX,
                                    r = this.cacheHeight / this.zoomY;
                                this._cacheContext.clearRect(-i / 2, -r / 2, i, r)
                            }
                            return !0
                        }
                    return !1
                },
                _renderControls: function(t, e) {
                    t.save(), t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, this.callSuper("_renderControls", t, e);
                    for(var i = 0, r = this._objects.length; i < r; i++) this._objects[i]._renderControls(t);
                    t.restore()
                },
                _renderObject: function(t, e) {
                    if(t.visible) {
                        var i = t.hasRotatingPoint;
                        t.hasRotatingPoint = !1, t.render(e), t.hasRotatingPoint = i
                    }
                },
                _restoreObjectsState: function() {
                    return this._objects.forEach(this._restoreObjectState, this), this
                },
                realizeTransform: function(t) {
                    var i = t.calcTransformMatrix(),
                        r = e.util.qrDecompose(i),
                        n = new e.Point(r.translateX, r.translateY);
                    return t.flipX = !1, t.flipY = !1, t.set("scaleX", r.scaleX), t.set("scaleY", r.scaleY), t.skewX = r.skewX, t.skewY = r.skewY, t.angle = r.angle, t.setPositionByOrigin(n, "center", "center"), t
                },
                _restoreObjectState: function(t) {
                    return this.realizeTransform(t), t.setCoords(), t.hasControls = t.__origHasControls, delete t.__origHasControls, t.set("active", !1), delete t.group, this
                },
                destroy: function() {
                    return this._objects.forEach(function(t) {
                        t.set("dirty", !0)
                    }), this._restoreObjectsState()
                },
                saveCoords: function() {
                    return this._originalLeft = this.get("left"), this._originalTop = this.get("top"), this
                },
                hasMoved: function() {
                    return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
                },
                setObjectsCoords: function() {
                    return this.forEachObject(function(t) {
                        t.setCoords(!0, !0)
                    }), this
                },
                _calcBounds: function(t) {
                    for(var e, i, r, n = [], s = [], o = ["tr", "br", "bl", "tl"], a = 0, h = this._objects.length, c = o.length; a < h; ++a)
                        for((e = this._objects[a]).setCoords(!0), r = 0; r < c; r++) i = o[r], n.push(e.oCoords[i].x), s.push(e.oCoords[i].y);
                    this.set(this._getBounds(n, s, t))
                },
                _getBounds: function(t, i, s) {
                    var o = new e.Point(r(t), r(i)),
                        a = new e.Point(n(t), n(i)),
                        h = {
                            width: a.x - o.x || 0,
                            height: a.y - o.y || 0
                        };
                    return s || (h.left = o.x || 0, h.top = o.y || 0, "center" === this.originX && (h.left += h.width / 2), "right" === this.originX && (h.left += h.width), "center" === this.originY && (h.top += h.height / 2), "bottom" === this.originY && (h.top += h.height)), h
                },
                toSVG: function(t) {
                    var e = this._createBaseSVGMarkup();
                    e.push("<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '" style="', this.getSvgFilter(), '">\n');
                    for(var i = 0, r = this._objects.length; i < r; i++) e.push("\t", this._objects[i].toSVG(t));
                    return e.push("</g>\n"), t ? t(e.join("")) : e.join("")
                },
                get: function(t) {
                    if(t in s) {
                        if(this[t]) return this[t];
                        for(var e = 0, i = this._objects.length; e < i; e++)
                            if(this._objects[e][t]) return !0;
                        return !1
                    }
                    return t in this.delegatedProperties ? this._objects[0] && this._objects[0].get(t) : this[t]
                }
            }), e.Group.fromObject = function(t, i) {
                e.util.enlivenObjects(t.objects, function(r) {
                    var n = e.util.object.clone(t, !0);
                    delete n.objects, i && i(new e.Group(r, n, !0))
                })
            }, e.Group.async = !0
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = fabric.util.object.extend;
        t.fabric || (t.fabric = {}), t.fabric.Image ? fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
            type: "image",
            crossOrigin: "",
            alignX: "none",
            alignY: "none",
            meetOrSlice: "meet",
            strokeWidth: 0,
            _lastScaleX: 1,
            _lastScaleY: 1,
            minimumScaleTrigger: .5,
            stateProperties: fabric.Object.prototype.stateProperties.concat("alignX", "alignY", "meetOrSlice"),
            objectCaching: !1,
            initialize: function(t, e, i) {
                e || (e = {}), this.filters = [], this.resizeFilters = [], this.callSuper("initialize", e), this._initElement(t, e, i)
            },
            getElement: function() {
                return this._element
            },
            setElement: function(t, e, i) {
                var r, n;
                return this._element = t, this._originalElement = t, this._initConfig(i), 0 === this.resizeFilters.length ? r = e : (n = this, r = function() {
                    n.applyFilters(e, n.resizeFilters, n._filteredEl || n._originalElement, !0)
                }), 0 !== this.filters.length ? this.applyFilters(r) : r && r(this), this
            },
            setCrossOrigin: function(t) {
                return this.crossOrigin = t, this._element.crossOrigin = t, this
            },
            getOriginalSize: function() {
                var t = this.getElement();
                return {
                    width: t.width,
                    height: t.height
                }
            },
            _stroke: function(t) {
                if(this.stroke && 0 !== this.strokeWidth) {
                    var e = this.width / 2,
                        i = this.height / 2;
                    t.beginPath(), t.moveTo(-e, -i), t.lineTo(e, -i), t.lineTo(e, i), t.lineTo(-e, i), t.lineTo(-e, -i), t.closePath()
                }
            },
            _renderDashedStroke: function(t) {
                var e = -this.width / 2,
                    i = -this.height / 2,
                    r = this.width,
                    n = this.height;
                t.save(), this._setStrokeStyles(t), t.beginPath(), fabric.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray), t.closePath(), t.restore()
            },
            toObject: function(t) {
                var i = [],
                    r = [],
                    n = 1,
                    s = 1;
                this.filters.forEach(function(t) {
                    t && ("Resize" === t.type && (n *= t.scaleX, s *= t.scaleY), i.push(t.toObject()))
                }), this.resizeFilters.forEach(function(t) {
                    t && r.push(t.toObject())
                });
                var o = e(this.callSuper("toObject", ["crossOrigin", "alignX", "alignY", "meetOrSlice"].concat(t)), {
                    src: this.getSrc(),
                    filters: i,
                    resizeFilters: r
                });
                return o.width /= n, o.height /= s, o
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = -this.width / 2,
                    r = -this.height / 2,
                    n = "none";
                if(this.group && "path-group" === this.group.type && (i = this.left, r = this.top), "none" !== this.alignX && "none" !== this.alignY && (n = "x" + this.alignX + "Y" + this.alignY + " " + this.meetOrSlice), e.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', "<image ", this.getSvgId(), 'xlink:href="', this.getSvgSrc(!0), '" x="', i, '" y="', r, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="', n, '"', "></image>\n"), this.stroke || this.strokeDashArray) {
                    var s = this.fill;
                    this.fill = null, e.push("<rect ", 'x="', i, '" y="', r, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'), this.fill = s
                }
                return e.push("</g>\n"), t ? t(e.join("")) : e.join("")
            },
            getSrc: function(t) {
                var e = t ? this._element : this._originalElement;
                return e ? fabric.isLikelyNode ? e._src : e.src : this.src || ""
            },
            setSrc: function(t, e, i) {
                fabric.util.loadImage(t, function(t) {
                    return this.setElement(t, e, i)
                }, this, i && i.crossOrigin)
            },
            toString: function() {
                return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
            },
            applyFilters: function(t, e, i, r) {
                if(e = e || this.filters, i = i || this._originalElement) {
                    var n, s, o = fabric.util.createImage(),
                        a = this.canvas ? this.canvas.getRetinaScaling() : fabric.devicePixelRatio,
                        h = this.minimumScaleTrigger / a,
                        c = this;
                    if(0 === e.length) return this._element = i, t && t(this), i;
                    var l = fabric.util.createCanvasElement();
                    return l.width = i.width, l.height = i.height, l.getContext("2d").drawImage(i, 0, 0, i.width, i.height), e.forEach(function(t) {
                        t && (r ? (n = c.scaleX < h ? c.scaleX : 1, s = c.scaleY < h ? c.scaleY : 1, n * a < 1 && (n *= a), s * a < 1 && (s *= a)) : (n = t.scaleX, s = t.scaleY), t.applyTo(l, n, s), r || "Resize" !== t.type || (c.width *= t.scaleX, c.height *= t.scaleY))
                    }), o.width = l.width, o.height = l.height, fabric.isLikelyNode ? (o.src = l.toBuffer(void 0, fabric.Image.pngCompression), c._element = o, !r && (c._filteredEl = o), t && t(c)) : (o.onload = function() {
                        c._element = o, !r && (c._filteredEl = o), t && t(c), o.onload = l = null
                    }, o.src = l.toDataURL("image/png")), l
                }
            },
            _render: function(t, e) {
                var i, r, n, s = this._findMargins();
                i = e ? this.left : -this.width / 2, r = e ? this.top : -this.height / 2, "slice" === this.meetOrSlice && (t.beginPath(), t.rect(i, r, this.width, this.height), t.clip()), !1 === this.isMoving && this.resizeFilters.length && this._needsResize() ? (this._lastScaleX = this.scaleX, this._lastScaleY = this.scaleY, n = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, !0)) : n = this._element, n && t.drawImage(n, i + s.marginX, r + s.marginY, s.width, s.height), this._stroke(t), this._renderStroke(t)
            },
            _needsResize: function() {
                return this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY
            },
            _findMargins: function() {
                var t, e, i = this.width,
                    r = this.height,
                    n = 0,
                    s = 0;
                return "none" === this.alignX && "none" === this.alignY || (t = [this.width / this._element.width, this.height / this._element.height], e = "meet" === this.meetOrSlice ? Math.min.apply(null, t) : Math.max.apply(null, t), i = this._element.width * e, r = this._element.height * e, "Mid" === this.alignX && (n = (this.width - i) / 2), "Max" === this.alignX && (n = this.width - i), "Mid" === this.alignY && (s = (this.height - r) / 2), "Max" === this.alignY && (s = this.height - r)), {
                    width: i,
                    height: r,
                    marginX: n,
                    marginY: s
                }
            },
            _resetWidthHeight: function() {
                var t = this.getElement();
                this.set("width", t.width), this.set("height", t.height)
            },
            _initElement: function(t, e, i) {
                this.setElement(fabric.util.getById(t), i, e), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
            },
            _initConfig: function(t) {
                t || (t = {}), this.setOptions(t), this._setWidthHeight(t), this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin)
            },
            _initFilters: function(t, e) {
                t && t.length ? fabric.util.enlivenObjects(t, function(t) {
                    e && e(t)
                }, "fabric.Image.filters") : e && e()
            },
            _setWidthHeight: function(t) {
                this.width = "width" in t ? t.width : this.getElement() ? this.getElement().width || 0 : 0, this.height = "height" in t ? t.height : this.getElement() ? this.getElement().height || 0 : 0
            }
        }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function(t, e) {
            fabric.util.loadImage(t.src, function(i, r) {
                r ? e && e(null, r) : fabric.Image.prototype._initFilters.call(t, t.filters, function(r) {
                    t.filters = r || [], fabric.Image.prototype._initFilters.call(t, t.resizeFilters, function(r) {
                        return t.resizeFilters = r || [], new fabric.Image(i, t, e)
                    })
                })
            }, null, t.crossOrigin)
        }, fabric.Image.fromURL = function(t, e, i) {
            fabric.util.loadImage(t, function(t) {
                e && e(new fabric.Image(t, i))
            }, null, i && i.crossOrigin)
        }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href crossOrigin".split(" ")), fabric.Image.fromElement = function(t, i, r) {
            var n, s = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
            s.preserveAspectRatio && (n = fabric.util.parsePreserveAspectRatioAttribute(s.preserveAspectRatio), e(s, n)), fabric.Image.fromURL(s["xlink:href"], i, e(r ? fabric.util.object.clone(r) : {}, s))
        }, fabric.Image.async = !0, fabric.Image.pngCompression = 1)
    }("undefined" != typeof exports ? exports : this), fabric.util.object.extend(fabric.Object.prototype, {
        _getAngleValueForStraighten: function() {
            var t = this.getAngle() % 360;
            return t > 0 ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90)
        },
        straighten: function() {
            return this.setAngle(this._getAngleValueForStraighten()), this
        },
        fxStraighten: function(t) {
            var e = function() {},
                i = (t = t || {}).onComplete || e,
                r = t.onChange || e,
                n = this;
            return fabric.util.animate({
                startValue: this.get("angle"),
                endValue: this._getAngleValueForStraighten(),
                duration: this.FX_DURATION,
                onChange: function(t) {
                    n.setAngle(t), r()
                },
                onComplete: function() {
                    n.setCoords(), i()
                },
                onStart: function() {
                    n.set("active", !1)
                }
            }), this
        }
    }), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        straightenObject: function(t) {
            return t.straighten(), this.renderAll(), this
        },
        fxStraightenObject: function(t) {
            return t.fxStraighten({
                onChange: this.renderAll.bind(this)
            }), this
        }
    }), fabric.Image.filters = fabric.Image.filters || {}, fabric.Image.filters.BaseFilter = fabric.util.createClass({
        type: "BaseFilter",
        initialize: function(t) {
            t && this.setOptions(t)
        },
        setOptions: function(t) {
            for(var e in t) this[e] = t[e]
        },
        toObject: function() {
            return {
                type: this.type
            }
        },
        toJSON: function() {
            return this.toObject()
        }
    }), fabric.Image.filters.BaseFilter.fromObject = function(t, e) {
        var i = new fabric.Image.filters[t.type](t);
        return e && e(i), i
    },
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Brightness = n(r.BaseFilter, {
            type: "Brightness",
            initialize: function(t) {
                t = t || {}, this.brightness = t.brightness || 0
            },
            applyTo: function(t) {
                for(var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.brightness, s = 0, o = r.length; s < o; s += 4) r[s] += n, r[s + 1] += n, r[s + 2] += n;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    brightness: this.brightness
                })
            }
        }), e.Image.filters.Brightness.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Convolute = n(r.BaseFilter, {
            type: "Convolute",
            initialize: function(t) {
                t = t || {}, this.opaque = t.opaque, this.matrix = t.matrix || [0, 0, 0, 0, 1, 0, 0, 0, 0]
            },
            applyTo: function(t) {
                for(var e, i, r, n, s, o, a, h, c, l = this.matrix, u = t.getContext("2d"), f = u.getImageData(0, 0, t.width, t.height), d = Math.round(Math.sqrt(l.length)), g = Math.floor(d / 2), p = f.data, v = f.width, b = f.height, m = u.createImageData(v, b), _ = m.data, y = this.opaque ? 1 : 0, x = 0; x < b; x++)
                    for(var C = 0; C < v; C++) {
                        s = 4 * (x * v + C), e = 0, i = 0, r = 0, n = 0;
                        for(var S = 0; S < d; S++)
                            for(var w = 0; w < d; w++) o = C + w - g, (a = x + S - g) < 0 || a > b || o < 0 || o > v || (h = 4 * (a * v + o), c = l[S * d + w], e += p[h] * c, i += p[h + 1] * c, r += p[h + 2] * c, n += p[h + 3] * c);
                        _[s] = e, _[s + 1] = i, _[s + 2] = r, _[s + 3] = n + y * (255 - n)
                    }
                u.putImageData(m, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    opaque: this.opaque,
                    matrix: this.matrix
                })
            }
        }), e.Image.filters.Convolute.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.GradientTransparency = n(r.BaseFilter, {
            type: "GradientTransparency",
            initialize: function(t) {
                t = t || {}, this.threshold = t.threshold || 100
            },
            applyTo: function(t) {
                for(var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.threshold, s = r.length, o = 0, a = r.length; o < a; o += 4) r[o + 3] = n + 255 * (s - o) / s;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold
                })
            }
        }), e.Image.filters.GradientTransparency.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Grayscale = r(i.BaseFilter, {
            type: "Grayscale",
            applyTo: function(t) {
                for(var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, s = r.width * r.height * 4, o = 0; o < s;) e = (n[o] + n[o + 1] + n[o + 2]) / 3, n[o] = e, n[o + 1] = e, n[o + 2] = e, o += 4;
                i.putImageData(r, 0, 0)
            }
        }), e.Image.filters.Grayscale.fromObject = function(t, i) {
            return t = t || {}, t.type = "Grayscale", e.Image.filters.BaseFilter.fromObject(t, i)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Invert = r(i.BaseFilter, {
            type: "Invert",
            applyTo: function(t) {
                var e, i = t.getContext("2d"),
                    r = i.getImageData(0, 0, t.width, t.height),
                    n = r.data,
                    s = n.length;
                for(e = 0; e < s; e += 4) n[e] = 255 - n[e], n[e + 1] = 255 - n[e + 1], n[e + 2] = 255 - n[e + 2];
                i.putImageData(r, 0, 0)
            }
        }), e.Image.filters.Invert.fromObject = function(t, i) {
            return t = t || {}, t.type = "Invert", e.Image.filters.BaseFilter.fromObject(t, i)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Mask = n(r.BaseFilter, {
            type: "Mask",
            initialize: function(t) {
                t = t || {}, this.mask = t.mask, this.channel = [0, 1, 2, 3].indexOf(t.channel) > -1 ? t.channel : 0
            },
            applyTo: function(t) {
                if(this.mask) {
                    var i, r = t.getContext("2d"),
                        n = r.getImageData(0, 0, t.width, t.height),
                        s = n.data,
                        o = this.mask.getElement(),
                        a = e.util.createCanvasElement(),
                        h = this.channel,
                        c = n.width * n.height * 4;
                    a.width = t.width, a.height = t.height, a.getContext("2d").drawImage(o, 0, 0, t.width, t.height);
                    var l = a.getContext("2d").getImageData(0, 0, t.width, t.height).data;
                    for(i = 0; i < c; i += 4) s[i + 3] = l[i + h];
                    r.putImageData(n, 0, 0)
                }
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    mask: this.mask.toObject(),
                    channel: this.channel
                })
            }
        }), e.Image.filters.Mask.fromObject = function(t, i) {
            e.util.loadImage(t.mask.src, function(r) {
                return t.mask = new e.Image(r, t.mask), e.Image.filters.BaseFilter.fromObject(t, i)
            })
        }, e.Image.filters.Mask.async = !0
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Noise = n(r.BaseFilter, {
            type: "Noise",
            initialize: function(t) {
                t = t || {}, this.noise = t.noise || 0
            },
            applyTo: function(t) {
                for(var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, s = this.noise, o = 0, a = n.length; o < a; o += 4) e = (.5 - Math.random()) * s, n[o] += e, n[o + 1] += e, n[o + 2] += e;
                i.putImageData(r, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    noise: this.noise
                })
            }
        }), e.Image.filters.Noise.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Pixelate = n(r.BaseFilter, {
            type: "Pixelate",
            initialize: function(t) {
                t = t || {}, this.blocksize = t.blocksize || 4
            },
            applyTo: function(t) {
                var e, i, r, n, s, o, a, h = t.getContext("2d"),
                    c = h.getImageData(0, 0, t.width, t.height),
                    l = c.data,
                    u = c.height,
                    f = c.width;
                for(i = 0; i < u; i += this.blocksize)
                    for(r = 0; r < f; r += this.blocksize) {
                        n = l[e = 4 * i * f + 4 * r], s = l[e + 1], o = l[e + 2], a = l[e + 3];
                        for(var d = i, g = i + this.blocksize; d < g; d++)
                            for(var p = r, v = r + this.blocksize; p < v; p++) l[e = 4 * d * f + 4 * p] = n, l[e + 1] = s, l[e + 2] = o, l[e + 3] = a
                    }
                h.putImageData(c, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    blocksize: this.blocksize
                })
            }
        }), e.Image.filters.Pixelate.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.RemoveWhite = n(r.BaseFilter, {
            type: "RemoveWhite",
            initialize: function(t) {
                t = t || {}, this.threshold = t.threshold || 30, this.distance = t.distance || 20
            },
            applyTo: function(t) {
                for(var e, i, r, n = t.getContext("2d"), s = n.getImageData(0, 0, t.width, t.height), o = s.data, a = this.threshold, h = this.distance, c = 255 - a, l = Math.abs, u = 0, f = o.length; u < f; u += 4) e = o[u], i = o[u + 1], r = o[u + 2], e > c && i > c && r > c && l(e - i) < h && l(e - r) < h && l(i - r) < h && (o[u + 3] = 0);
                n.putImageData(s, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold,
                    distance: this.distance
                })
            }
        }), e.Image.filters.RemoveWhite.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Sepia = r(i.BaseFilter, {
            type: "Sepia",
            applyTo: function(t) {
                var e, i, r = t.getContext("2d"),
                    n = r.getImageData(0, 0, t.width, t.height),
                    s = n.data,
                    o = s.length;
                for(e = 0; e < o; e += 4) i = .3 * s[e] + .59 * s[e + 1] + .11 * s[e + 2], s[e] = i + 100, s[e + 1] = i + 50, s[e + 2] = i + 255;
                r.putImageData(n, 0, 0)
            }
        }), e.Image.filters.Sepia.fromObject = function(t, i) {
            return t = t || {}, t.type = "Sepia", new e.Image.filters.BaseFilter.fromObject(t, i)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Sepia2 = r(i.BaseFilter, {
            type: "Sepia2",
            applyTo: function(t) {
                var e, i, r, n, s = t.getContext("2d"),
                    o = s.getImageData(0, 0, t.width, t.height),
                    a = o.data,
                    h = a.length;
                for(e = 0; e < h; e += 4) i = a[e], r = a[e + 1], n = a[e + 2], a[e] = (.393 * i + .769 * r + .189 * n) / 1.351, a[e + 1] = (.349 * i + .686 * r + .168 * n) / 1.203, a[e + 2] = (.272 * i + .534 * r + .131 * n) / 2.14;
                s.putImageData(o, 0, 0)
            }
        }), e.Image.filters.Sepia2.fromObject = function(t, i) {
            return t = t || {}, t.type = "Sepia2", new e.Image.filters.BaseFilter.fromObject(t, i)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Tint = n(r.BaseFilter, {
            type: "Tint",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000000", this.opacity = void 0 !== t.opacity ? t.opacity : new e.Color(this.color).getAlpha()
            },
            applyTo: function(t) {
                var i, r, n, s, o, a, h, c, l, u = t.getContext("2d"),
                    f = u.getImageData(0, 0, t.width, t.height),
                    d = f.data,
                    g = d.length;
                for(r = (l = new e.Color(this.color).getSource())[0] * this.opacity, n = l[1] * this.opacity, s = l[2] * this.opacity, c = 1 - this.opacity, i = 0; i < g; i += 4) o = d[i], a = d[i + 1], h = d[i + 2], d[i] = r + o * c, d[i + 1] = n + a * c, d[i + 2] = s + h * c;
                u.putImageData(f, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color,
                    opacity: this.opacity
                })
            }
        }), e.Image.filters.Tint.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Multiply = n(r.BaseFilter, {
            type: "Multiply",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000000"
            },
            applyTo: function(t) {
                var i, r, n = t.getContext("2d"),
                    s = n.getImageData(0, 0, t.width, t.height),
                    o = s.data,
                    a = o.length;
                for(r = new e.Color(this.color).getSource(), i = 0; i < a; i += 4) o[i] *= r[0] / 255, o[i + 1] *= r[1] / 255, o[i + 2] *= r[2] / 255;
                n.putImageData(s, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color
                })
            }
        }), e.Image.filters.Multiply.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric,
            i = e.Image.filters,
            r = e.util.createClass;
        i.Blend = r(i.BaseFilter, {
            type: "Blend",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000", this.image = t.image || !1, this.mode = t.mode || "multiply", this.alpha = t.alpha || 1
            },
            applyTo: function(t) {
                var i, r, n, s, o, a, h, c, l, u, f = t.getContext("2d"),
                    d = f.getImageData(0, 0, t.width, t.height),
                    g = d.data,
                    p = !1;
                if(this.image) {
                    p = !0;
                    var v = e.util.createCanvasElement();
                    v.width = this.image.width, v.height = this.image.height;
                    var b = new e.StaticCanvas(v);
                    b.add(this.image);
                    u = b.getContext("2d").getImageData(0, 0, b.width, b.height).data
                } else i = (u = new e.Color(this.color).getSource())[0] * this.alpha, r = u[1] * this.alpha, n = u[2] * this.alpha;
                for(var m = 0, _ = g.length; m < _; m += 4) switch(s = g[m], o = g[m + 1], a = g[m + 2], p && (i = u[m] * this.alpha, r = u[m + 1] * this.alpha, n = u[m + 2] * this.alpha), this.mode) {
                    case "multiply":
                        g[m] = s * i / 255, g[m + 1] = o * r / 255, g[m + 2] = a * n / 255;
                        break;
                    case "screen":
                        g[m] = 1 - (1 - s) * (1 - i), g[m + 1] = 1 - (1 - o) * (1 - r), g[m + 2] = 1 - (1 - a) * (1 - n);
                        break;
                    case "add":
                        g[m] = Math.min(255, s + i), g[m + 1] = Math.min(255, o + r), g[m + 2] = Math.min(255, a + n);
                        break;
                    case "diff":
                    case "difference":
                        g[m] = Math.abs(s - i), g[m + 1] = Math.abs(o - r), g[m + 2] = Math.abs(a - n);
                        break;
                    case "subtract":
                        h = s - i, c = o - r, l = a - n, g[m] = h < 0 ? 0 : h, g[m + 1] = c < 0 ? 0 : c, g[m + 2] = l < 0 ? 0 : l;
                        break;
                    case "darken":
                        g[m] = Math.min(s, i), g[m + 1] = Math.min(o, r), g[m + 2] = Math.min(a, n);
                        break;
                    case "lighten":
                        g[m] = Math.max(s, i), g[m + 1] = Math.max(o, r), g[m + 2] = Math.max(a, n)
                }
                f.putImageData(d, 0, 0)
            },
            toObject: function() {
                return {
                    color: this.color,
                    image: this.image,
                    mode: this.mode,
                    alpha: this.alpha
                }
            }
        }), e.Image.filters.Blend.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = Math.pow,
            r = Math.floor,
            n = Math.sqrt,
            s = Math.abs,
            o = Math.max,
            a = Math.round,
            h = Math.sin,
            c = Math.ceil,
            l = e.Image.filters,
            u = e.util.createClass;
        l.Resize = u(l.BaseFilter, {
            type: "Resize",
            resizeType: "hermite",
            scaleX: 0,
            scaleY: 0,
            lanczosLobes: 3,
            applyTo: function(t, e, i) {
                if(1 !== e || 1 !== i) {
                    this.rcpScaleX = 1 / e, this.rcpScaleY = 1 / i;
                    var r, n = t.width,
                        s = t.height,
                        o = a(n * e),
                        h = a(s * i);
                    "sliceHack" === this.resizeType && (r = this.sliceByTwo(t, n, s, o, h)), "hermite" === this.resizeType && (r = this.hermiteFastResize(t, n, s, o, h)), "bilinear" === this.resizeType && (r = this.bilinearFiltering(t, n, s, o, h)), "lanczos" === this.resizeType && (r = this.lanczosResize(t, n, s, o, h)), t.width = o, t.height = h, t.getContext("2d").putImageData(r, 0, 0)
                }
            },
            sliceByTwo: function(t, i, n, s, a) {
                var h, c = t.getContext("2d"),
                    l = .5,
                    u = .5,
                    f = 1,
                    d = 1,
                    g = !1,
                    p = !1,
                    v = i,
                    b = n,
                    m = e.util.createCanvasElement(),
                    _ = m.getContext("2d");
                for(s = r(s), a = r(a), m.width = o(s, i), m.height = o(a, n), s > i && (l = 2, f = -1), a > n && (u = 2, d = -1), h = c.getImageData(0, 0, i, n), t.width = o(s, i), t.height = o(a, n), c.putImageData(h, 0, 0); !g || !p;) i = v, n = b, s * f < r(v * l * f) ? v = r(v * l) : (v = s, g = !0), a * d < r(b * u * d) ? b = r(b * u) : (b = a, p = !0), h = c.getImageData(0, 0, i, n), _.putImageData(h, 0, 0), c.clearRect(0, 0, v, b), c.drawImage(m, 0, 0, i, n, 0, 0, v, b);
                return c.getImageData(0, 0, s, a)
            },
            lanczosResize: function(t, e, o, a, l) {
                function u(t) {
                    var h, c, f, d, j, k, M, D, A, P, E;
                    for(O.x = (t + .5) * m, T.x = r(O.x), h = 0; h < l; h++) {
                        for(O.y = (h + .5) * _, T.y = r(O.y), j = 0, k = 0, M = 0, D = 0, A = 0, c = T.x - C; c <= T.x + C; c++)
                            if(!(c < 0 || c >= e)) {
                                P = r(1e3 * s(c - O.x)), w[P] || (w[P] = {});
                                for(var I = T.y - S; I <= T.y + S; I++) I < 0 || I >= o || (E = r(1e3 * s(I - O.y)), w[P][E] || (w[P][E] = b(n(i(P * y, 2) + i(E * x, 2)) / 1e3)), (f = w[P][E]) > 0 && (j += f, k += f * p[d = 4 * (I * e + c)], M += f * p[d + 1], D += f * p[d + 2], A += f * p[d + 3]))
                            }
                        v[d = 4 * (h * a + t)] = k / j, v[d + 1] = M / j, v[d + 2] = D / j, v[d + 3] = A / j
                    }
                    return ++t < a ? u(t) : g
                }
                var f = t.getContext("2d"),
                    d = f.getImageData(0, 0, e, o),
                    g = f.getImageData(0, 0, a, l),
                    p = d.data,
                    v = g.data,
                    b = function(t) {
                        return function(e) {
                            if(e > t) return 0;
                            if(e *= Math.PI, s(e) < 1e-16) return 1;
                            var i = e / t;
                            return h(e) * h(i) / e / i
                        }
                    }(this.lanczosLobes),
                    m = this.rcpScaleX,
                    _ = this.rcpScaleY,
                    y = 2 / this.rcpScaleX,
                    x = 2 / this.rcpScaleY,
                    C = c(m * this.lanczosLobes / 2),
                    S = c(_ * this.lanczosLobes / 2),
                    w = {},
                    O = {},
                    T = {};
                return u(0)
            },
            bilinearFiltering: function(t, e, i, n, s) {
                var o, a, h, c, l, u, f, d, g, p = 0,
                    v = this.rcpScaleX,
                    b = this.rcpScaleY,
                    m = t.getContext("2d"),
                    _ = 4 * (e - 1),
                    y = m.getImageData(0, 0, e, i).data,
                    x = m.getImageData(0, 0, n, s),
                    C = x.data;
                for(h = 0; h < s; h++)
                    for(c = 0; c < n; c++)
                        for(l = v * c - (o = r(v * c)), u = b * h - (a = r(b * h)), g = 4 * (a * e + o), f = 0; f < 4; f++) d = y[g + f] * (1 - l) * (1 - u) + y[g + 4 + f] * l * (1 - u) + y[g + _ + f] * u * (1 - l) + y[g + _ + 4 + f] * l * u, C[p++] = d;
                return x
            },
            hermiteFastResize: function(t, e, i, o, a) {
                for(var h = this.rcpScaleX, l = this.rcpScaleY, u = c(h / 2), f = c(l / 2), d = t.getContext("2d"), g = d.getImageData(0, 0, e, i).data, p = d.getImageData(0, 0, o, a), v = p.data, b = 0; b < a; b++)
                    for(var m = 0; m < o; m++) {
                        for(var _ = 4 * (m + b * o), y = 0, x = 0, C = 0, S = 0, w = 0, O = 0, T = 0, j = (b + .5) * l, k = r(b * l); k < (b + 1) * l; k++)
                            for(var M = s(j - (k + .5)) / f, D = (m + .5) * h, A = M * M, P = r(m * h); P < (m + 1) * h; P++) {
                                var E = s(D - (P + .5)) / u,
                                    I = n(A + E * E);
                                I > 1 && I < -1 || (y = 2 * I * I * I - 3 * I * I + 1) > 0 && (T += y * g[(E = 4 * (P + k * e)) + 3], C += y, g[E + 3] < 255 && (y = y * g[E + 3] / 250), S += y * g[E], w += y * g[E + 1], O += y * g[E + 2], x += y)
                            }
                        v[_] = S / x, v[_ + 1] = w / x, v[_ + 2] = O / x, v[_ + 3] = T / C
                    }
                return p
            },
            toObject: function() {
                return {
                    type: this.type,
                    scaleX: this.scaleX,
                    scaleY: this.scaleY,
                    resizeType: this.resizeType,
                    lanczosLobes: this.lanczosLobes
                }
            }
        }), e.Image.filters.Resize.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.ColorMatrix = n(r.BaseFilter, {
            type: "ColorMatrix",
            initialize: function(t) {
                t || (t = {}), this.matrix = t.matrix || [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
            },
            applyTo: function(t) {
                var e, i, r, n, s, o = t.getContext("2d"),
                    a = o.getImageData(0, 0, t.width, t.height),
                    h = a.data,
                    c = h.length,
                    l = this.matrix;
                for(e = 0; e < c; e += 4) i = h[e], r = h[e + 1], n = h[e + 2], s = h[e + 3], h[e] = i * l[0] + r * l[1] + n * l[2] + s * l[3] + l[4], h[e + 1] = i * l[5] + r * l[6] + n * l[7] + s * l[8] + l[9], h[e + 2] = i * l[10] + r * l[11] + n * l[12] + s * l[13] + l[14], h[e + 3] = i * l[15] + r * l[16] + n * l[17] + s * l[18] + l[19];
                o.putImageData(a, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    type: this.type,
                    matrix: this.matrix
                })
            }
        }), e.Image.filters.ColorMatrix.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Contrast = n(r.BaseFilter, {
            type: "Contrast",
            initialize: function(t) {
                t = t || {}, this.contrast = t.contrast || 0
            },
            applyTo: function(t) {
                for(var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = 259 * (this.contrast + 255) / (255 * (259 - this.contrast)), s = 0, o = r.length; s < o; s += 4) r[s] = n * (r[s] - 128) + 128, r[s + 1] = n * (r[s + 1] - 128) + 128, r[s + 2] = n * (r[s + 2] - 128) + 128;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    contrast: this.contrast
                })
            }
        }), e.Image.filters.Contrast.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Saturate = n(r.BaseFilter, {
            type: "Saturate",
            initialize: function(t) {
                t = t || {}, this.saturate = t.saturate || 0
            },
            applyTo: function(t) {
                for(var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, s = .01 * -this.saturate, o = 0, a = n.length; o < a; o += 4) e = Math.max(n[o], n[o + 1], n[o + 2]), n[o] += e !== n[o] ? (e - n[o]) * s : 0, n[o + 1] += e !== n[o + 1] ? (e - n[o + 1]) * s : 0, n[o + 2] += e !== n[o + 2] ? (e - n[o + 2]) * s : 0;
                i.putImageData(r, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    saturate: this.saturate
                })
            }
        }), e.Image.filters.Saturate.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.toFixed,
            r = e.Object.NUM_FRACTION_DIGITS;
        e.Text ? e.warn("fabric.Text is already defined") : (e.Text = e.util.createClass(e.Object, {
            _dimensionAffectingProps: ["fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "text", "charSpacing", "textAlign"],
            _reNewline: /\r?\n/,
            _reSpacesAndTabs: /[ \t\r]+/g,
            type: "text",
            fontSize: 40,
            fontWeight: "normal",
            fontFamily: "Times New Roman",
            textDecoration: "",
            textAlign: "left",
            fontStyle: "",
            lineHeight: 1.16,
            textBackgroundColor: "",
            stateProperties: e.Object.prototype.stateProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing"),
            cacheProperties: e.Object.prototype.cacheProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles"),
            stroke: null,
            shadow: null,
            _fontSizeFraction: .25,
            _fontSizeMult: 1.13,
            charSpacing: 0,
            initialize: function(t, e) {
                e = e || {}, this.text = t, this.__skipDimension = !0, this.callSuper("initialize", e), this.__skipDimension = !1, this._initDimensions(), this.setCoords(), this.setupState({
                    propertySet: "_dimensionAffectingProps"
                })
            },
            _initDimensions: function(t) {
                this.__skipDimension || (t || (t = e.util.createCanvasElement().getContext("2d"), this._setTextStyles(t)), this._textLines = this._splitTextIntoLines(), this._clearCache(), this.width = this._getTextWidth(t) || this.cursorWidth || 2, this.height = this._getTextHeight(t), this.setCoords())
            },
            toString: function() {
                return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
            },
            _getCacheCanvasDimensions: function() {
                var t = this.callSuper("_getCacheCanvasDimensions"),
                    e = this.fontSize;
                return t.width += e * t.zoomX, t.height += e * t.zoomY, t
            },
            _render: function(t) {
                this._setTextStyles(t), this.group && "path-group" === this.group.type && t.translate(this.left, this.top), this._renderTextLinesBackground(t), this._renderText(t), this._renderTextDecoration(t)
            },
            _renderText: function(t) {
                this._renderTextFill(t), this._renderTextStroke(t)
            },
            _setTextStyles: function(t) {
                t.textBaseline = "alphabetic", t.font = this._getFontDeclaration()
            },
            _getTextHeight: function() {
                return this._getHeightOfSingleLine() + (this._textLines.length - 1) * this._getHeightOfLine()
            },
            _getTextWidth: function(t) {
                for(var e = this._getLineWidth(t, 0), i = 1, r = this._textLines.length; i < r; i++) {
                    var n = this._getLineWidth(t, i);
                    n > e && (e = n)
                }
                return e
            },
            _renderChars: function(t, e, i, r, n) {
                var s, o, a = t.slice(0, -4);
                if(this[a].toLive) {
                    var h = -this.width / 2 + this[a].offsetX || 0,
                        c = -this.height / 2 + this[a].offsetY || 0;
                    e.save(), e.translate(h, c), r -= h, n -= c
                }
                if(0 !== this.charSpacing)
                    for(var l = this._getWidthOfCharSpacing(), u = 0, f = (i = i.split("")).length; u < f; u++) s = i[u], o = e.measureText(s).width + l, e[t](s, r, n), r += o > 0 ? o : 0;
                else e[t](i, r, n);
                this[a].toLive && e.restore()
            },
            _renderTextLine: function(t, e, i, r, n, s) {
                n -= this.fontSize * this._fontSizeFraction;
                var o = this._getLineWidth(e, s);
                if("justify" !== this.textAlign || this.width < o) this._renderChars(t, e, i, r, n, s);
                else
                    for(var a, h = i.split(/\s+/), c = 0, l = this._getWidthOfWords(e, h.join(" "), s, 0), u = this.width - l, f = h.length - 1, d = f > 0 ? u / f : 0, g = 0, p = 0, v = h.length; p < v; p++) {
                        for(;
                            " " === i[c] && c < i.length;) c++;
                        a = h[p], this._renderChars(t, e, a, r + g, n, s, c), g += this._getWidthOfWords(e, a, s, c) + d, c += a.length
                    }
            },
            _getWidthOfWords: function(t, e) {
                var i = t.measureText(e).width;
                return 0 !== this.charSpacing && (i += e.split("").length * this._getWidthOfCharSpacing()), i > 0 ? i : 0
            },
            _getLeftOffset: function() {
                return -this.width / 2
            },
            _getTopOffset: function() {
                return -this.height / 2
            },
            isEmptyStyles: function() {
                return !0
            },
            _renderTextCommon: function(t, e) {
                for(var i = 0, r = this._getLeftOffset(), n = this._getTopOffset(), s = 0, o = this._textLines.length; s < o; s++) {
                    var a = this._getHeightOfLine(t, s),
                        h = a / this.lineHeight,
                        c = this._getLineWidth(t, s),
                        l = this._getLineLeftOffset(c);
                    this._renderTextLine(e, t, this._textLines[s], r + l, n + i + h, s), i += a
                }
            },
            _renderTextFill: function(t) {
                !this.fill && this.isEmptyStyles() || this._renderTextCommon(t, "fillText")
            },
            _renderTextStroke: function(t) {
                (this.stroke && 0 !== this.strokeWidth || !this.isEmptyStyles()) && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray), t.beginPath(), this._renderTextCommon(t, "strokeText"), t.closePath(), t.restore())
            },
            _getHeightOfLine: function() {
                return this._getHeightOfSingleLine() * this.lineHeight
            },
            _getHeightOfSingleLine: function() {
                return this.fontSize * this._fontSizeMult
            },
            _renderTextLinesBackground: function(t) {
                if(this.textBackgroundColor) {
                    var e, i, r, n = 0,
                        s = t.fillStyle;
                    t.fillStyle = this.textBackgroundColor;
                    for(var o = 0, a = this._textLines.length; o < a; o++) e = this._getHeightOfLine(t, o), (i = this._getLineWidth(t, o)) > 0 && (r = this._getLineLeftOffset(i), t.fillRect(this._getLeftOffset() + r, this._getTopOffset() + n, i, e / this.lineHeight)), n += e;
                    t.fillStyle = s, this._removeShadow(t)
                }
            },
            _getLineLeftOffset: function(t) {
                return "center" === this.textAlign ? (this.width - t) / 2 : "right" === this.textAlign ? this.width - t : 0
            },
            _clearCache: function() {
                this.__lineWidths = [], this.__lineHeights = []
            },
            _shouldClearDimensionCache: function() {
                var t = this._forceClearCache;
                return t || (t = this.hasStateChanged("_dimensionAffectingProps")), t && (this.saveState({
                    propertySet: "_dimensionAffectingProps"
                }), this.dirty = !0), t
            },
            _getLineWidth: function(t, e) {
                if(this.__lineWidths[e]) return -1 === this.__lineWidths[e] ? this.width : this.__lineWidths[e];
                var i, r = this._textLines[e];
                return i = "" === r ? 0 : this._measureLine(t, e), this.__lineWidths[e] = i, i && "justify" === this.textAlign && r.split(/\s+/).length > 1 && (this.__lineWidths[e] = -1), i
            },
            _getWidthOfCharSpacing: function() {
                return 0 !== this.charSpacing ? this.fontSize * this.charSpacing / 1e3 : 0
            },
            _measureLine: function(t, e) {
                var i, r = this._textLines[e],
                    n = t.measureText(r).width,
                    s = 0;
                return 0 !== this.charSpacing && (s = (r.split("").length - 1) * this._getWidthOfCharSpacing()), (i = n + s) > 0 ? i : 0
            },
            _renderTextDecoration: function(t) {
                if(this.textDecoration) {
                    var e = this.height / 2,
                        i = this,
                        r = [];
                    this.textDecoration.indexOf("underline") > -1 && r.push(.85), this.textDecoration.indexOf("line-through") > -1 && r.push(.43), this.textDecoration.indexOf("overline") > -1 && r.push(-.12), r.length > 0 && function(r) {
                        var n, s, o, a, h, c, l, u = 0;
                        for(n = 0, s = i._textLines.length; n < s; n++) {
                            for(h = i._getLineWidth(t, n), c = i._getLineLeftOffset(h), l = i._getHeightOfLine(t, n), o = 0, a = r.length; o < a; o++) t.fillRect(i._getLeftOffset() + c, u + (i._fontSizeMult - 1 + r[o]) * i.fontSize - e, h, i.fontSize / 15);
                            u += l
                        }
                    }(r)
                }
            },
            _getFontDeclaration: function() {
                return [e.isLikelyNode ? this.fontWeight : this.fontStyle, e.isLikelyNode ? this.fontStyle : this.fontWeight, this.fontSize + "px", e.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily].join(" ")
            },
            render: function(t, e) {
                this.visible && (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (this._shouldClearDimensionCache() && (this._setTextStyles(t), this._initDimensions(t)), this.callSuper("render", t, e)))
            },
            _splitTextIntoLines: function() {
                return this.text.split(this._reNewline)
            },
            toObject: function(t) {
                var e = ["text", "fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "textDecoration", "textAlign", "textBackgroundColor", "charSpacing"].concat(t);
                return this.callSuper("toObject", e)
            },
            toSVG: function(t) {
                this.ctx || (this.ctx = e.util.createCanvasElement().getContext("2d"));
                var i = this._createBaseSVGMarkup(),
                    r = this._getSVGLeftTopOffsets(this.ctx),
                    n = this._getSVGTextAndBg(r.textTop, r.textLeft);
                return this._wrapSVGTextAndBg(i, n), t ? t(i.join("")) : i.join("")
            },
            _getSVGLeftTopOffsets: function(t) {
                var e = this._getHeightOfLine(t, 0);
                return {
                    textLeft: -this.width / 2 + (this.group && "path-group" === this.group.type ? this.left : 0),
                    textTop: 0 + (this.group && "path-group" === this.group.type ? -this.top : 0),
                    lineTop: e
                }
            },
            _wrapSVGTextAndBg: function(t, e) {
                var i = this.getSvgFilter(),
                    r = "" === i ? "" : ' style="' + i + '"';
                t.push("\t<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"', r, ">\n", e.textBgRects.join(""), '\t\t<text xml:space="preserve" ', this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(!0), '" >\n', e.textSpans.join(""), "\t\t</text>\n", "\t</g>\n")
            },
            getSvgStyles: function(t) {
                return e.Object.prototype.getSvgStyles.call(this, t) + " white-space: pre;"
            },
            _getSVGTextAndBg: function(t, e) {
                var i = [],
                    r = [],
                    n = 0;
                this._setSVGBg(r);
                for(var s = 0, o = this._textLines.length; s < o; s++) this.textBackgroundColor && this._setSVGTextLineBg(r, s, e, t, n), this._setSVGTextLineText(s, i, n, e, t, r), n += this._getHeightOfLine(this.ctx, s);
                return {
                    textSpans: i,
                    textBgRects: r
                }
            },
            _setSVGTextLineText: function(t, n, s, o, a) {
                var h = this.fontSize * (this._fontSizeMult - this._fontSizeFraction) - a + s - this.height / 2;
                "justify" !== this.textAlign ? n.push('\t\t\t<tspan x="', i(o + this._getLineLeftOffset(this._getLineWidth(this.ctx, t)), r), '" ', 'y="', i(h, r), '" ', this._getFillAttributes(this.fill), ">", e.util.string.escapeXml(this._textLines[t]), "</tspan>\n") : this._setSVGTextLineJustifed(t, n, h, o)
            },
            _setSVGTextLineJustifed: function(t, n, s, o) {
                var a = e.util.createCanvasElement().getContext("2d");
                this._setTextStyles(a);
                var h, c, l = this._textLines[t].split(/\s+/),
                    u = this._getWidthOfWords(a, l.join("")),
                    f = this.width - u,
                    d = l.length - 1,
                    g = d > 0 ? f / d : 0,
                    p = this._getFillAttributes(this.fill);
                for(o += this._getLineLeftOffset(this._getLineWidth(a, t)), t = 0, c = l.length; t < c; t++) h = l[t], n.push('\t\t\t<tspan x="', i(o, r), '" ', 'y="', i(s, r), '" ', p, ">", e.util.string.escapeXml(h), "</tspan>\n"), o += this._getWidthOfWords(a, h) + g
            },
            _setSVGTextLineBg: function(t, e, n, s, o) {
                t.push("\t\t<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', i(n + this._getLineLeftOffset(this._getLineWidth(this.ctx, e)), r), '" y="', i(o - this.height / 2, r), '" width="', i(this._getLineWidth(this.ctx, e), r), '" height="', i(this._getHeightOfLine(this.ctx, e) / this.lineHeight, r), '"></rect>\n')
            },
            _setSVGBg: function(t) {
                this.backgroundColor && t.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', i(-this.width / 2, r), '" y="', i(-this.height / 2, r), '" width="', i(this.width, r), '" height="', i(this.height, r), '"></rect>\n')
            },
            _getFillAttributes: function(t) {
                var i = t && "string" == typeof t ? new e.Color(t) : "";
                return i && i.getSource() && 1 !== i.getAlpha() ? 'opacity="' + i.getAlpha() + '" fill="' + i.setAlpha(1).toRgb() + '"' : 'fill="' + t + '"'
            },
            _set: function(t, e) {
                this.callSuper("_set", t, e), this._dimensionAffectingProps.indexOf(t) > -1 && (this._initDimensions(), this.setCoords())
            },
            complexity: function() {
                return 1
            }
        }), e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" ")), e.Text.DEFAULT_SVG_FONT_SIZE = 16, e.Text.fromElement = function(t, i) {
            if(!t) return null;
            var r = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES);
            (i = e.util.object.extend(i ? e.util.object.clone(i) : {}, r)).top = i.top || 0, i.left = i.left || 0, "dx" in r && (i.left += r.dx), "dy" in r && (i.top += r.dy), "fontSize" in i || (i.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE), i.originX || (i.originX = "left");
            var n = "";
            "textContent" in t ? n = t.textContent : "firstChild" in t && null !== t.firstChild && "data" in t.firstChild && null !== t.firstChild.data && (n = t.firstChild.data), n = n.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
            var s = new e.Text(n, i),
                o = s.getHeight() / s.height,
                a = ((s.height + s.strokeWidth) * s.lineHeight - s.height) * o,
                h = s.getHeight() + a,
                c = 0;
            return "left" === s.originX && (c = s.getWidth() / 2), "right" === s.originX && (c = -s.getWidth() / 2), s.set({
                left: s.getLeft() + c,
                top: s.getTop() - h / 2 + s.fontSize * (.18 + s._fontSizeFraction) / s.lineHeight
            }), s
        }, e.Text.fromObject = function(t, i, r) {
            return e.Object._fromObject("Text", t, i, r, "text")
        }, e.util.createAccessors(e.Text))
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.util.object.clone;
        fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
            type: "i-text",
            selectionStart: 0,
            selectionEnd: 0,
            selectionColor: "rgba(17,119,255,0.3)",
            isEditing: !1,
            editable: !0,
            editingBorderColor: "rgba(102,153,255,0.25)",
            cursorWidth: 2,
            cursorColor: "#333",
            cursorDelay: 1e3,
            cursorDuration: 600,
            styles: null,
            caching: !0,
            _reSpace: /\s|\n/,
            _currentCursorOpacity: 0,
            _selectionDirection: null,
            _abortCursorAnimation: !1,
            __widthOfSpace: [],
            initialize: function(t, e) {
                this.styles = e ? e.styles || {} : {}, this.callSuper("initialize", t, e), this.initBehavior()
            },
            _clearCache: function() {
                this.callSuper("_clearCache"), this.__widthOfSpace = []
            },
            isEmptyStyles: function() {
                if(!this.styles) return !0;
                var t = this.styles;
                for(var e in t)
                    for(var i in t[e])
                        for(var r in t[e][i]) return !1;
                return !0
            },
            setSelectionStart: function(t) {
                t = Math.max(t, 0), this._updateAndFire("selectionStart", t)
            },
            setSelectionEnd: function(t) {
                t = Math.min(t, this.text.length), this._updateAndFire("selectionEnd", t)
            },
            _updateAndFire: function(t, e) {
                this[t] !== e && (this._fireSelectionChanged(), this[t] = e), this._updateTextarea()
            },
            _fireSelectionChanged: function() {
                this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {
                    target: this
                })
            },
            getSelectionStyles: function(t, e) {
                if(2 === arguments.length) {
                    for(var i = [], r = t; r < e; r++) i.push(this.getSelectionStyles(r));
                    return i
                }
                var n = this.get2DCursorLocation(t);
                return this._getStyleDeclaration(n.lineIndex, n.charIndex) || {}
            },
            setSelectionStyles: function(t) {
                if(this.selectionStart === this.selectionEnd) this._extendStyles(this.selectionStart, t);
                else
                    for(var e = this.selectionStart; e < this.selectionEnd; e++) this._extendStyles(e, t);
                return this._forceClearCache = !0, this
            },
            _extendStyles: function(t, e) {
                var i = this.get2DCursorLocation(t);
                this._getLineStyle(i.lineIndex) || this._setLineStyle(i.lineIndex, {}), this._getStyleDeclaration(i.lineIndex, i.charIndex) || this._setStyleDeclaration(i.lineIndex, i.charIndex, {}), fabric.util.object.extend(this._getStyleDeclaration(i.lineIndex, i.charIndex), e)
            },
            _initDimensions: function(t) {
                t || this.clearContextTop(), this.callSuper("_initDimensions", t)
            },
            render: function(t, e) {
                this.clearContextTop(), this.callSuper("render", t, e), this.cursorOffsetCache = {}, this.renderCursorOrSelection()
            },
            _render: function(t) {
                this.callSuper("_render", t), this.ctx = t
            },
            clearContextTop: function() {
                if(this.active && this.isEditing && this.canvas && this.canvas.contextTop) {
                    var t = this.canvas.contextTop;
                    t.save(), t.transform.apply(t, this.canvas.viewportTransform), this.transform(t), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this._clearTextArea(t), t.restore()
                }
            },
            renderCursorOrSelection: function() {
                if(this.active && this.isEditing) {
                    var t, e, i = this.text.split("");
                    this.canvas && this.canvas.contextTop ? ((e = this.canvas.contextTop).save(), e.transform.apply(e, this.canvas.viewportTransform), this.transform(e), this.transformMatrix && e.transform.apply(e, this.transformMatrix), this._clearTextArea(e)) : (e = this.ctx).save(), this.selectionStart === this.selectionEnd ? (t = this._getCursorBoundaries(i, "cursor"), this.renderCursor(t, e)) : (t = this._getCursorBoundaries(i, "selection"), this.renderSelection(i, t, e)), e.restore()
                }
            },
            _clearTextArea: function(t) {
                var e = this.width + 4,
                    i = this.height + 4;
                t.clearRect(-e / 2, -i / 2, e, i)
            },
            get2DCursorLocation: function(t) {
                void 0 === t && (t = this.selectionStart);
                for(var e = this._textLines.length, i = 0; i < e; i++) {
                    if(t <= this._textLines[i].length) return {
                        lineIndex: i,
                        charIndex: t
                    };
                    t -= this._textLines[i].length + 1
                }
                return {
                    lineIndex: i - 1,
                    charIndex: this._textLines[i - 1].length < t ? this._textLines[i - 1].length : t
                }
            },
            getCurrentCharStyle: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return {
                    fontSize: i && i.fontSize || this.fontSize,
                    fill: i && i.fill || this.fill,
                    textBackgroundColor: i && i.textBackgroundColor || this.textBackgroundColor,
                    textDecoration: i && i.textDecoration || this.textDecoration,
                    fontFamily: i && i.fontFamily || this.fontFamily,
                    fontWeight: i && i.fontWeight || this.fontWeight,
                    fontStyle: i && i.fontStyle || this.fontStyle,
                    stroke: i && i.stroke || this.stroke,
                    strokeWidth: i && i.strokeWidth || this.strokeWidth
                }
            },
            getCurrentCharFontSize: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return i && i.fontSize ? i.fontSize : this.fontSize
            },
            getCurrentCharColor: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return i && i.fill ? i.fill : this.cursorColor
            },
            _getCursorBoundaries: function(t, e) {
                var i = Math.round(this._getLeftOffset()),
                    r = this._getTopOffset(),
                    n = this._getCursorBoundariesOffsets(t, e);
                return {
                    left: i,
                    top: r,
                    leftOffset: n.left + n.lineLeft,
                    topOffset: n.top
                }
            },
            _getCursorBoundariesOffsets: function(t, e) {
                if(this.cursorOffsetCache && "top" in this.cursorOffsetCache) return this.cursorOffsetCache;
                for(var i, r = 0, n = 0, s = 0, o = 0, a = 0, h = 0; h < this.selectionStart; h++) "\n" === t[h] ? (a = 0, o += this._getHeightOfLine(this.ctx, n), n++, s = 0) : (a += this._getWidthOfChar(this.ctx, t[h], n, s), s++), r = this._getLineLeftOffset(this._getLineWidth(this.ctx, n));
                return "cursor" === e && (o += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, n) / this.lineHeight - this.getCurrentCharFontSize(n, s) * (1 - this._fontSizeFraction)), 0 !== this.charSpacing && s === this._textLines[n].length && (a -= this._getWidthOfCharSpacing()), i = {
                    top: o,
                    left: a > 0 ? a : 0,
                    lineLeft: r
                }, this.cursorOffsetCache = i, this.cursorOffsetCache
            },
            renderCursor: function(t, e) {
                var i = this.get2DCursorLocation(),
                    r = i.lineIndex,
                    n = i.charIndex,
                    s = this.getCurrentCharFontSize(r, n),
                    o = t.leftOffset,
                    a = this.scaleX * this.canvas.getZoom(),
                    h = this.cursorWidth / a;
                e.fillStyle = this.getCurrentCharColor(r, n), e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity, e.fillRect(t.left + o - h / 2, t.top + t.topOffset, h, s)
            },
            renderSelection: function(t, e, i) {
                i.fillStyle = this.selectionColor;
                for(var r = this.get2DCursorLocation(this.selectionStart), n = this.get2DCursorLocation(this.selectionEnd), s = r.lineIndex, o = n.lineIndex, a = s; a <= o; a++) {
                    var h = this._getLineLeftOffset(this._getLineWidth(i, a)) || 0,
                        c = this._getHeightOfLine(this.ctx, a),
                        l = 0,
                        u = 0,
                        f = this._textLines[a];
                    if(a === s) {
                        for(var d = 0, g = f.length; d < g; d++) d >= r.charIndex && (a !== o || d < n.charIndex) && (u += this._getWidthOfChar(i, f[d], a, d)), d < r.charIndex && (h += this._getWidthOfChar(i, f[d], a, d));
                        d === f.length && (u -= this._getWidthOfCharSpacing())
                    } else if(a > s && a < o) u += this._getLineWidth(i, a) || 5;
                    else if(a === o) {
                        for(var p = 0, v = n.charIndex; p < v; p++) u += this._getWidthOfChar(i, f[p], a, p);
                        n.charIndex === f.length && (u -= this._getWidthOfCharSpacing())
                    }
                    l = c, (this.lineHeight < 1 || a === o && this.lineHeight > 1) && (c /= this.lineHeight), i.fillRect(e.left + h, e.top + e.topOffset, u > 0 ? u : 0, c), e.topOffset += l
                }
            },
            _renderChars: function(t, e, i, r, n, s, o) {
                if(this.isEmptyStyles()) return this._renderCharsFast(t, e, i, r, n);
                o = o || 0;
                var a, h, c = this._getHeightOfLine(e, s),
                    l = "";
                e.save(), n -= c / this.lineHeight * this._fontSizeFraction;
                for(var u = o, f = i.length + o; u <= f; u++) a = a || this.getCurrentCharStyle(s, u), h = this.getCurrentCharStyle(s, u + 1), (this._hasStyleChanged(a, h) || u === f) && (this._renderChar(t, e, s, u - 1, l, r, n, c), l = "", a = h), l += i[u - o];
                e.restore()
            },
            _renderCharsFast: function(t, e, i, r, n) {
                "fillText" === t && this.fill && this.callSuper("_renderChars", t, e, i, r, n), "strokeText" === t && (this.stroke && this.strokeWidth > 0 || this.skipFillStrokeCheck) && this.callSuper("_renderChars", t, e, i, r, n)
            },
            _renderChar: function(t, e, i, r, n, s, o, a) {
                var h, c, l, u, f, d, g, p, v, b = this._getStyleDeclaration(i, r);
                if(b ? (c = this._getHeightOfChar(e, n, i, r), u = b.stroke, l = b.fill, d = b.textDecoration) : c = this.fontSize, u = (u || this.stroke) && "strokeText" === t, l = (l || this.fill) && "fillText" === t, b && e.save(), h = this._applyCharStylesGetWidth(e, n, i, r, b || null), d = d || this.textDecoration, b && b.textBackgroundColor && this._removeShadow(e), 0 !== this.charSpacing) {
                    p = this._getWidthOfCharSpacing(), h = 0;
                    for(var m, _ = 0, y = (g = n.split("")).length; _ < y; _++) m = g[_], l && e.fillText(m, s + h, o), u && e.strokeText(m, s + h, o), h += (v = e.measureText(m).width + p) > 0 ? v : 0
                } else l && e.fillText(n, s, o), u && e.strokeText(n, s, o);
                (d || "" !== d) && (f = this._fontSizeFraction * a / this.lineHeight, this._renderCharDecoration(e, d, s, o, f, h, c)), b && e.restore(), e.translate(h, 0)
            },
            _hasStyleChanged: function(t, e) {
                return t.fill !== e.fill || t.fontSize !== e.fontSize || t.textBackgroundColor !== e.textBackgroundColor || t.textDecoration !== e.textDecoration || t.fontFamily !== e.fontFamily || t.fontWeight !== e.fontWeight || t.fontStyle !== e.fontStyle || t.stroke !== e.stroke || t.strokeWidth !== e.strokeWidth
            },
            _renderCharDecoration: function(t, e, i, r, n, s, o) {
                if(e) {
                    var a, h, c = o / 15,
                        l = {
                            underline: r + o / 10,
                            "line-through": r - o * (this._fontSizeFraction + this._fontSizeMult - 1) + c,
                            overline: r - (this._fontSizeMult - this._fontSizeFraction) * o
                        },
                        u = ["underline", "line-through", "overline"];
                    for(a = 0; a < u.length; a++) h = u[a], e.indexOf(h) > -1 && t.fillRect(i, l[h], s, c)
                }
            },
            _renderTextLine: function(t, e, i, r, n, s) {
                this.isEmptyStyles() || (n += this.fontSize * (this._fontSizeFraction + .03)), this.callSuper("_renderTextLine", t, e, i, r, n, s)
            },
            _renderTextDecoration: function(t) {
                if(this.isEmptyStyles()) return this.callSuper("_renderTextDecoration", t)
            },
            _renderTextLinesBackground: function(t) {
                this.callSuper("_renderTextLinesBackground", t);
                var e, i, r, n, s, o, a, h, c, l, u = 0,
                    f = this._getLeftOffset(),
                    d = this._getTopOffset(),
                    g = "";
                t.save();
                for(var p = 0, v = this._textLines.length; p < v; p++)
                    if(e = this._getHeightOfLine(t, p), "" !== (n = this._textLines[p]) && this.styles && this._getLineStyle(p)) {
                        i = this._getLineWidth(t, p), r = this._getLineLeftOffset(i), a = h = c = l = 0;
                        for(var b = 0, m = n.length; b < m; b++) g !== (o = this._getStyleDeclaration(p, b) || {}).textBackgroundColor && (l && c && (t.fillStyle = g, t.fillRect(a, h, c, l)), a = h = c = l = 0, g = o.textBackgroundColor || ""), o.textBackgroundColor ? (s = n[b], g === o.textBackgroundColor && (g = o.textBackgroundColor, a || (a = f + r + this._getWidthOfCharsAt(t, p, b)), h = d + u, c += this._getWidthOfChar(t, s, p, b), l = e / this.lineHeight)) : g = "";
                        l && c && (t.fillStyle = g, t.fillRect(a, h, c, l), a = h = c = l = 0), u += e
                    } else u += e;
                t.restore()
            },
            _getCacheProp: function(t, e) {
                return t + e.fontSize + e.fontWeight + e.fontStyle
            },
            _getFontCache: function(t) {
                return fabric.charWidthsCache[t] || (fabric.charWidthsCache[t] = {}), fabric.charWidthsCache[t]
            },
            _applyCharStylesGetWidth: function(e, i, r, n, s) {
                var o, a, h, c = s || this._getStyleDeclaration(r, n),
                    l = t(c);
                if(this._applyFontStyles(l), h = this._getFontCache(l.fontFamily), a = this._getCacheProp(i, l), !c && h[a] && this.caching) return h[a];
                "string" == typeof l.shadow && (l.shadow = new fabric.Shadow(l.shadow));
                var u = l.fill || this.fill;
                return e.fillStyle = u.toLive ? u.toLive(e, this) : u, l.stroke && (e.strokeStyle = l.stroke && l.stroke.toLive ? l.stroke.toLive(e, this) : l.stroke), e.lineWidth = l.strokeWidth || this.strokeWidth, e.font = this._getFontDeclaration.call(l), l.shadow && (l.scaleX = this.scaleX, l.scaleY = this.scaleY, l.canvas = this.canvas, l.getObjectScaling = this.getObjectScaling, this._setShadow.call(l, e)), this.caching && h[a] ? h[a] : (o = e.measureText(i).width, this.caching && (h[a] = o), o)
            },
            _applyFontStyles: function(t) {
                t.fontFamily || (t.fontFamily = this.fontFamily), t.fontSize || (t.fontSize = this.fontSize), t.fontWeight || (t.fontWeight = this.fontWeight), t.fontStyle || (t.fontStyle = this.fontStyle)
            },
            _getStyleDeclaration: function(e, i, r) {
                return r ? this.styles[e] && this.styles[e][i] ? t(this.styles[e][i]) : {} : this.styles[e] && this.styles[e][i] ? this.styles[e][i] : null
            },
            _setStyleDeclaration: function(t, e, i) {
                this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function(t, e) {
                delete this.styles[t][e]
            },
            _getLineStyle: function(t) {
                return this.styles[t]
            },
            _setLineStyle: function(t, e) {
                this.styles[t] = e
            },
            _deleteLineStyle: function(t) {
                delete this.styles[t]
            },
            _getWidthOfChar: function(t, e, i, r) {
                if(!this._isMeasuring && "justify" === this.textAlign && this._reSpacesAndTabs.test(e)) return this._getWidthOfSpace(t, i);
                t.save();
                var n = this._applyCharStylesGetWidth(t, e, i, r);
                return 0 !== this.charSpacing && (n += this._getWidthOfCharSpacing()), t.restore(), n > 0 ? n : 0
            },
            _getHeightOfChar: function(t, e, i) {
                var r = this._getStyleDeclaration(e, i);
                return r && r.fontSize ? r.fontSize : this.fontSize
            },
            _getWidthOfCharsAt: function(t, e, i) {
                var r, n, s = 0;
                for(r = 0; r < i; r++) n = this._textLines[e][r], s += this._getWidthOfChar(t, n, e, r);
                return s
            },
            _measureLine: function(t, e) {
                this._isMeasuring = !0;
                var i = this._getWidthOfCharsAt(t, e, this._textLines[e].length);
                return 0 !== this.charSpacing && (i -= this._getWidthOfCharSpacing()), this._isMeasuring = !1, i > 0 ? i : 0
            },
            _getWidthOfSpace: function(t, e) {
                if(this.__widthOfSpace[e]) return this.__widthOfSpace[e];
                var i = this._textLines[e],
                    r = this._getWidthOfWords(t, i, e, 0),
                    n = this.width - r,
                    s = i.length - i.replace(this._reSpacesAndTabs, "").length,
                    o = Math.max(n / s, t.measureText(" ").width);
                return this.__widthOfSpace[e] = o, o
            },
            _getWidthOfWords: function(t, e, i, r) {
                for(var n = 0, s = 0; s < e.length; s++) {
                    var o = e[s];
                    o.match(/\s/) || (n += this._getWidthOfChar(t, o, i, s + r))
                }
                return n
            },
            _getHeightOfLine: function(t, e) {
                if(this.__lineHeights[e]) return this.__lineHeights[e];
                for(var i = this._textLines[e], r = this._getHeightOfChar(t, e, 0), n = 1, s = i.length; n < s; n++) {
                    var o = this._getHeightOfChar(t, e, n);
                    o > r && (r = o)
                }
                return this.__lineHeights[e] = r * this.lineHeight * this._fontSizeMult, this.__lineHeights[e]
            },
            _getTextHeight: function(t) {
                for(var e, i = 0, r = 0, n = this._textLines.length; r < n; r++) e = this._getHeightOfLine(t, r), i += r === n - 1 ? e / this.lineHeight : e;
                return i
            },
            toObject: function(e) {
                return fabric.util.object.extend(this.callSuper("toObject", e), {
                    styles: t(this.styles, !0)
                })
            }
        }), fabric.IText.fromObject = function(t, e, i) {
            return fabric.Object._fromObject("IText", t, e, i, "text")
        }
    }(),
    function() {
        var t = fabric.util.object.clone;
        fabric.util.object.extend(fabric.IText.prototype, {
            initBehavior: function() {
                this.initAddedHandler(), this.initRemovedHandler(), this.initCursorSelectionHandlers(), this.initDoubleClickSimulation(), this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
            },
            onDeselect: function() {
                this.isEditing && this.exitEditing(), this.selected = !1, this.callSuper("onDeselect")
            },
            initAddedHandler: function() {
                var t = this;
                this.on("added", function() {
                    var e = t.canvas;
                    e && (e._hasITextHandlers || (e._hasITextHandlers = !0, t._initCanvasHandlers(e)), e._iTextInstances = e._iTextInstances || [], e._iTextInstances.push(t))
                })
            },
            initRemovedHandler: function() {
                var t = this;
                this.on("removed", function() {
                    var e = t.canvas;
                    e && (e._iTextInstances = e._iTextInstances || [], fabric.util.removeFromArray(e._iTextInstances, t), 0 === e._iTextInstances.length && (e._hasITextHandlers = !1, t._removeCanvasHandlers(e)))
                })
            },
            _initCanvasHandlers: function(t) {
                t._mouseUpITextHandler = function() {
                    t._iTextInstances && t._iTextInstances.forEach(function(t) {
                        t.__isMousedown = !1
                    })
                }.bind(this), t.on("mouse:up", t._mouseUpITextHandler)
            },
            _removeCanvasHandlers: function(t) {
                t.off("mouse:up", t._mouseUpITextHandler)
            },
            _tick: function() {
                this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete")
            },
            _animateCursor: function(t, e, i, r) {
                var n;
                return n = {
                    isAborted: !1,
                    abort: function() {
                        this.isAborted = !0
                    }
                }, t.animate("_currentCursorOpacity", e, {
                    duration: i,
                    onComplete: function() {
                        n.isAborted || t[r]()
                    },
                    onChange: function() {
                        t.canvas && t.selectionStart === t.selectionEnd && t.renderCursorOrSelection()
                    },
                    abort: function() {
                        return n.isAborted
                    }
                }), n
            },
            _onTickComplete: function() {
                var t = this;
                this._cursorTimeout1 && clearTimeout(this._cursorTimeout1), this._cursorTimeout1 = setTimeout(function() {
                    t._currentTickCompleteState = t._animateCursor(t, 0, this.cursorDuration / 2, "_tick")
                }, 100)
            },
            initDelayedCursor: function(t) {
                var e = this,
                    i = t ? 0 : this.cursorDelay;
                this.abortCursorAnimation(), this._currentCursorOpacity = 1, this._cursorTimeout2 = setTimeout(function() {
                    e._tick()
                }, i)
            },
            abortCursorAnimation: function() {
                var t = this._currentTickState || this._currentTickCompleteState;
                this._currentTickState && this._currentTickState.abort(), this._currentTickCompleteState && this._currentTickCompleteState.abort(), clearTimeout(this._cursorTimeout1), clearTimeout(this._cursorTimeout2), this._currentCursorOpacity = 0, t && this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx)
            },
            selectAll: function() {
                this.selectionStart = 0, this.selectionEnd = this.text.length, this._fireSelectionChanged(), this._updateTextarea()
            },
            getSelectedText: function() {
                return this.text.slice(this.selectionStart, this.selectionEnd)
            },
            findWordBoundaryLeft: function(t) {
                var e = 0,
                    i = t - 1;
                if(this._reSpace.test(this.text.charAt(i)))
                    for(; this._reSpace.test(this.text.charAt(i));) e++, i--;
                for(;
                    /\S/.test(this.text.charAt(i)) && i > -1;) e++, i--;
                return t - e
            },
            findWordBoundaryRight: function(t) {
                var e = 0,
                    i = t;
                if(this._reSpace.test(this.text.charAt(i)))
                    for(; this._reSpace.test(this.text.charAt(i));) e++, i++;
                for(;
                    /\S/.test(this.text.charAt(i)) && i < this.text.length;) e++, i++;
                return t + e
            },
            findLineBoundaryLeft: function(t) {
                for(var e = 0, i = t - 1; !/\n/.test(this.text.charAt(i)) && i > -1;) e++, i--;
                return t - e
            },
            findLineBoundaryRight: function(t) {
                for(var e = 0, i = t; !/\n/.test(this.text.charAt(i)) && i < this.text.length;) e++, i++;
                return t + e
            },
            getNumNewLinesInSelectedText: function() {
                for(var t = this.getSelectedText(), e = 0, i = 0, r = t.length; i < r; i++) "\n" === t[i] && e++;
                return e
            },
            searchWordBoundary: function(t, e) {
                for(var i = this._reSpace.test(this.text.charAt(t)) ? t - 1 : t, r = this.text.charAt(i), n = /[ \n\.,;!\?\-]/; !n.test(r) && i > 0 && i < this.text.length;) i += e, r = this.text.charAt(i);
                return n.test(r) && "\n" !== r && (i += 1 === e ? 0 : 1), i
            },
            selectWord: function(t) {
                t = t || this.selectionStart;
                var e = this.searchWordBoundary(t, -1),
                    i = this.searchWordBoundary(t, 1);
                this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()
            },
            selectLine: function(t) {
                t = t || this.selectionStart;
                var e = this.findLineBoundaryLeft(t),
                    i = this.findLineBoundaryRight(t);
                this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea()
            },
            enterEditing: function(t) {
                if(!this.isEditing && this.editable) return this.canvas && this.exitEditingOnOthers(this.canvas), this.isEditing = !0, this.selected = !0, this.initHiddenTextarea(t), this.hiddenTextarea.focus(), this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._textBeforeEdit = this.text, this._tick(), this.fire("editing:entered"), this._fireSelectionChanged(), this.canvas ? (this.canvas.fire("text:editing:entered", {
                    target: this
                }), this.initMouseMoveHandler(), this.canvas.renderAll(), this) : this
            },
            exitEditingOnOthers: function(t) {
                t._iTextInstances && t._iTextInstances.forEach(function(t) {
                    t.selected = !1, t.isEditing && t.exitEditing()
                })
            },
            initMouseMoveHandler: function() {
                this.canvas.on("mouse:move", this.mouseMoveHandler)
            },
            mouseMoveHandler: function(t) {
                if(this.__isMousedown && this.isEditing) {
                    var e = this.getSelectionStartFromPointer(t.e),
                        i = this.selectionStart,
                        r = this.selectionEnd;
                    (e === this.__selectionStartOnMouseDown && i !== r || i !== e && r !== e) && (e > this.__selectionStartOnMouseDown ? (this.selectionStart = this.__selectionStartOnMouseDown, this.selectionEnd = e) : (this.selectionStart = e, this.selectionEnd = this.__selectionStartOnMouseDown), this.selectionStart === i && this.selectionEnd === r || (this.restartCursorIfNeeded(), this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()))
                }
            },
            _setEditingProps: function() {
                this.hoverCursor = "text", this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = "text"), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0
            },
            _updateTextarea: function() {
                if(this.hiddenTextarea && !this.inCompositionMode && (this.cursorOffsetCache = {}, this.hiddenTextarea.value = this.text, this.hiddenTextarea.selectionStart = this.selectionStart, this.hiddenTextarea.selectionEnd = this.selectionEnd, this.selectionStart === this.selectionEnd)) {
                    var t = this._calcTextareaPosition();
                    this.hiddenTextarea.style.left = t.left, this.hiddenTextarea.style.top = t.top, this.hiddenTextarea.style.fontSize = t.fontSize
                }
            },
            _calcTextareaPosition: function() {
                if(!this.canvas) return {
                    x: 1,
                    y: 1
                };
                var t = this.text.split(""),
                    e = this._getCursorBoundaries(t, "cursor"),
                    i = this.get2DCursorLocation(),
                    r = i.lineIndex,
                    n = i.charIndex,
                    s = this.getCurrentCharFontSize(r, n),
                    o = e.leftOffset,
                    a = this.calcTransformMatrix(),
                    h = {
                        x: e.left + o,
                        y: e.top + e.topOffset + s
                    },
                    c = this.canvas.upperCanvasEl,
                    l = c.width - s,
                    u = c.height - s;
                return h = fabric.util.transformPoint(h, a), (h = fabric.util.transformPoint(h, this.canvas.viewportTransform)).x < 0 && (h.x = 0), h.x > l && (h.x = l), h.y < 0 && (h.y = 0), h.y > u && (h.y = u), h.x += this.canvas._offset.left, h.y += this.canvas._offset.top, {
                    left: h.x + "px",
                    top: h.y + "px",
                    fontSize: s
                }
            },
            _saveEditingProps: function() {
                this._savedProps = {
                    hasControls: this.hasControls,
                    borderColor: this.borderColor,
                    lockMovementX: this.lockMovementX,
                    lockMovementY: this.lockMovementY,
                    hoverCursor: this.hoverCursor,
                    defaultCursor: this.canvas && this.canvas.defaultCursor,
                    moveCursor: this.canvas && this.canvas.moveCursor
                }
            },
            _restoreEditingProps: function() {
                this._savedProps && (this.hoverCursor = this._savedProps.overCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor))
            },
            exitEditing: function() {
                var t = this._textBeforeEdit !== this.text;
                return this.selected = !1, this.isEditing = !1, this.selectable = !0, this.selectionEnd = this.selectionStart, this.hiddenTextarea && (this.hiddenTextarea.blur && this.hiddenTextarea.blur(), this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea), this.hiddenTextarea = null), this.abortCursorAnimation(), this._restoreEditingProps(), this._currentCursorOpacity = 0, this.fire("editing:exited"), t && this.fire("modified"), this.canvas && (this.canvas.off("mouse:move", this.mouseMoveHandler), this.canvas.fire("text:editing:exited", {
                    target: this
                }), t && this.canvas.fire("object:modified", {
                    target: this
                })), this
            },
            _removeExtraneousStyles: function() {
                for(var t in this.styles) this._textLines[t] || delete this.styles[t]
            },
            _removeCharsFromTo: function(t, e) {
                for(; e !== t;) this._removeSingleCharAndStyle(t + 1), e--;
                this.selectionStart = t, this.selectionEnd = t
            },
            _removeSingleCharAndStyle: function(t) {
                var e = "\n" === this.text[t - 1],
                    i = e ? t : t - 1;
                this.removeStyleObject(e, i), this.text = this.text.slice(0, t - 1) + this.text.slice(t), this._textLines = this._splitTextIntoLines()
            },
            insertChars: function(t, e) {
                var i;
                if(this.selectionEnd - this.selectionStart > 1 && this._removeCharsFromTo(this.selectionStart, this.selectionEnd), e || !this.isEmptyStyles())
                    for(var r = 0, n = t.length; r < n; r++) e && (i = fabric.util.object.clone(fabric.copiedTextStyle[r], !0)), this.insertChar(t[r], r < n - 1, i);
                else this.insertChar(t, !1)
            },
            insertChar: function(t, e, i) {
                var r = "\n" === this.text[this.selectionStart];
                this.text = this.text.slice(0, this.selectionStart) + t + this.text.slice(this.selectionEnd), this._textLines = this._splitTextIntoLines(), this.insertStyleObjects(t, r, i), this.selectionStart += t.length, this.selectionEnd = this.selectionStart, e || (this._updateTextarea(), this.setCoords(), this._fireSelectionChanged(), this.fire("changed"), this.restartCursorIfNeeded(), this.canvas && (this.canvas.fire("text:changed", {
                    target: this
                }), this.canvas.renderAll()))
            },
            restartCursorIfNeeded: function() {
                this._currentTickState && !this._currentTickState.isAborted && this._currentTickCompleteState && !this._currentTickCompleteState.isAborted || this.initDelayedCursor()
            },
            insertNewlineStyleObject: function(e, i, r) {
                this.shiftLineStyles(e, 1);
                var n = {},
                    s = {};
                if(this.styles[e] && this.styles[e][i - 1] && (n = this.styles[e][i - 1]), r && n) s[0] = t(n), this.styles[e + 1] = s;
                else {
                    var o = !1;
                    for(var a in this.styles[e]) {
                        var h = parseInt(a, 10);
                        h >= i && (o = !0, s[h - i] = this.styles[e][a], delete this.styles[e][a])
                    }
                    o && (this.styles[e + 1] = s)
                }
                this._forceClearCache = !0
            },
            insertCharStyleObject: function(e, i, r) {
                var n = this.styles[e],
                    s = t(n);
                0 !== i || r || (i = 1);
                for(var o in s) {
                    var a = parseInt(o, 10);
                    a >= i && (n[a + 1] = s[a], s[a - 1] || delete n[a])
                }
                var h = r || t(n[i - 1]);
                h && (this.styles[e][i] = h), this._forceClearCache = !0
            },
            insertStyleObjects: function(t, e, i) {
                var r = this.get2DCursorLocation(),
                    n = r.lineIndex,
                    s = r.charIndex;
                this._getLineStyle(n) || this._setLineStyle(n, {}), "\n" === t ? this.insertNewlineStyleObject(n, s, e) : this.insertCharStyleObject(n, s, i)
            },
            shiftLineStyles: function(e, i) {
                var r = t(this.styles);
                for(var n in r) {
                    (s = parseInt(n, 10)) <= e && delete r[s]
                }
                for(var n in this.styles) {
                    var s = parseInt(n, 10);
                    s > e && (this.styles[s + i] = r[s], r[s - i] || delete this.styles[s])
                }
            },
            removeStyleObject: function(t, e) {
                var i = this.get2DCursorLocation(e),
                    r = i.lineIndex,
                    n = i.charIndex;
                this._removeStyleObject(t, i, r, n)
            },
            _getTextOnPreviousLine: function(t) {
                return this._textLines[t - 1]
            },
            _removeStyleObject: function(e, i, r, n) {
                if(e) {
                    var s = this._getTextOnPreviousLine(i.lineIndex),
                        o = s ? s.length : 0;
                    this.styles[r - 1] || (this.styles[r - 1] = {});
                    for(n in this.styles[r]) this.styles[r - 1][parseInt(n, 10) + o] = this.styles[r][n];
                    this.shiftLineStyles(i.lineIndex, -1)
                } else {
                    var a = this.styles[r];
                    a && delete a[n];
                    var h = t(a);
                    for(var c in h) {
                        var l = parseInt(c, 10);
                        l >= n && 0 !== l && (a[l - 1] = h[l], delete a[l])
                    }
                }
            },
            insertNewline: function() {
                this.insertChars("\n")
            },
            setSelectionStartEndWithShift: function(t, e, i) {
                i <= t ? (e === t ? this._selectionDirection = "left" : "right" === this._selectionDirection && (this._selectionDirection = "left", this.selectionEnd = t), this.selectionStart = i) : i > t && i < e ? "right" === this._selectionDirection ? this.selectionEnd = i : this.selectionStart = i : (e === t ? this._selectionDirection = "right" : "left" === this._selectionDirection && (this._selectionDirection = "right", this.selectionStart = e), this.selectionEnd = i)
            },
            setSelectionInBoundaries: function() {
                var t = this.text.length;
                this.selectionStart > t ? this.selectionStart = t : this.selectionStart < 0 && (this.selectionStart = 0), this.selectionEnd > t ? this.selectionEnd = t : this.selectionEnd < 0 && (this.selectionEnd = 0)
            }
        })
    }(), fabric.util.object.extend(fabric.IText.prototype, {
        initDoubleClickSimulation: function() {
            this.__lastClickTime = +new Date, this.__lastLastClickTime = +new Date, this.__lastPointer = {}, this.on("mousedown", this.onMouseDown.bind(this))
        },
        onMouseDown: function(t) {
            this.__newClickTime = +new Date;
            var e = this.canvas.getPointer(t.e);
            this.isTripleClick(e, t.e) ? (this.fire("tripleclick", t), this._stopEvent(t.e)) : this.isDoubleClick(e) && (this.fire("dblclick", t), this._stopEvent(t.e)), this.__lastLastClickTime = this.__lastClickTime, this.__lastClickTime = this.__newClickTime, this.__lastPointer = e, this.__lastIsEditing = this.isEditing, this.__lastSelected = this.selected
        },
        isDoubleClick: function(t) {
            return this.__newClickTime - this.__lastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y && this.__lastIsEditing
        },
        isTripleClick: function(t) {
            return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y
        },
        _stopEvent: function(t) {
            t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation()
        },
        initCursorSelectionHandlers: function() {
            this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks()
        },
        initClicks: function() {
            this.on("dblclick", function(t) {
                this.selectWord(this.getSelectionStartFromPointer(t.e))
            }), this.on("tripleclick", function(t) {
                this.selectLine(this.getSelectionStartFromPointer(t.e))
            })
        },
        initMousedownHandler: function() {
            this.on("mousedown", function(t) {
                if(this.editable && (!t.e.button || 1 === t.e.button)) {
                    var e = this.canvas.getPointer(t.e);
                    this.__mousedownX = e.x, this.__mousedownY = e.y, this.__isMousedown = !0, this.selected && this.setCursorByClick(t.e), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.selectionStart === this.selectionEnd && this.abortCursorAnimation(), this.renderCursorOrSelection())
                }
            })
        },
        _isObjectMoved: function(t) {
            var e = this.canvas.getPointer(t);
            return this.__mousedownX !== e.x || this.__mousedownY !== e.y
        },
        initMouseupHandler: function() {
            this.on("mouseup", function(t) {
                this.__isMousedown = !1, !this.editable || this._isObjectMoved(t.e) || t.e.button && 1 !== t.e.button || (this.__lastSelected && !this.__corner && (this.enterEditing(t.e), this.selectionStart === this.selectionEnd ? this.initDelayedCursor(!0) : this.renderCursorOrSelection()), this.selected = !0)
            })
        },
        setCursorByClick: function(t) {
            var e = this.getSelectionStartFromPointer(t),
                i = this.selectionStart,
                r = this.selectionEnd;
            t.shiftKey ? this.setSelectionStartEndWithShift(i, r, e) : (this.selectionStart = e, this.selectionEnd = e), this.isEditing && (this._fireSelectionChanged(), this._updateTextarea())
        },
        getSelectionStartFromPointer: function(t) {
            for(var e, i = this.getLocalPointer(t), r = 0, n = 0, s = 0, o = 0, a = 0, h = this._textLines.length; a < h; a++) {
                e = this._textLines[a], s += this._getHeightOfLine(this.ctx, a) * this.scaleY;
                var c = this._getLineWidth(this.ctx, a);
                n = this._getLineLeftOffset(c) * this.scaleX;
                for(var l = 0, u = e.length; l < u; l++) {
                    if(r = n, n += this._getWidthOfChar(this.ctx, e[l], a, this.flipX ? u - l : l) * this.scaleX, !(s <= i.y || n <= i.x)) return this._getNewSelectionStartFromOffset(i, r, n, o + a, u);
                    o++
                }
                if(i.y < s) return this._getNewSelectionStartFromOffset(i, r, n, o + a - 1, u)
            }
            return this.text.length
        },
        _getNewSelectionStartFromOffset: function(t, e, i, r, n) {
            var s = t.x - e,
                o = r + (i - t.x > s ? 0 : 1);
            return this.flipX && (o = n - o), o > this.text.length && (o = this.text.length), o
        }
    }), fabric.util.object.extend(fabric.IText.prototype, {
        initHiddenTextarea: function() {
            this.hiddenTextarea = fabric.document.createElement("textarea"), this.hiddenTextarea.setAttribute("autocapitalize", "off"), this.hiddenTextarea.setAttribute("autocorrect", "off"), this.hiddenTextarea.setAttribute("autocomplete", "off"), this.hiddenTextarea.setAttribute("spellcheck", "false"), this.hiddenTextarea.setAttribute("data-fabric-hiddentextarea", ""), this.hiddenTextarea.setAttribute("wrap", "off");
            var t = this._calcTextareaPosition();
            this.hiddenTextarea.style.cssText = "position: absolute; top: " + t.top + "; left: " + t.left + "; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; line-height: 1px; padding锝皌op: " + t.fontSize + ";", fabric.document.body.appendChild(this.hiddenTextarea), fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this)), fabric.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this)), fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this)), fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "cut", this.cut.bind(this)), fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this)), !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this)), this._clickHandlerInitialized = !0)
        },
        keysMap: {
            8: "removeChars",
            9: "exitEditing",
            27: "exitEditing",
            13: "insertNewline",
            33: "moveCursorUp",
            34: "moveCursorDown",
            35: "moveCursorRight",
            36: "moveCursorLeft",
            37: "moveCursorLeft",
            38: "moveCursorUp",
            39: "moveCursorRight",
            40: "moveCursorDown",
            46: "forwardDelete"
        },
        ctrlKeysMapUp: {
            67: "copy",
            88: "cut"
        },
        ctrlKeysMapDown: {
            65: "selectAll"
        },
        onClick: function() {
            this.hiddenTextarea && this.hiddenTextarea.focus()
        },
        onKeyDown: function(t) {
            if(this.isEditing) {
                if(t.keyCode in this.keysMap) this[this.keysMap[t.keyCode]](t);
                else {
                    if(!(t.keyCode in this.ctrlKeysMapDown && (t.ctrlKey || t.metaKey))) return;
                    this[this.ctrlKeysMapDown[t.keyCode]](t)
                }
                t.stopImmediatePropagation(), t.preventDefault(), t.keyCode >= 33 && t.keyCode <= 40 ? (this.clearContextTop(), this.renderCursorOrSelection()) : this.canvas && this.canvas.renderAll()
            }
        },
        onKeyUp: function(t) {
            this.isEditing && !this._copyDone ? t.keyCode in this.ctrlKeysMapUp && (t.ctrlKey || t.metaKey) && (this[this.ctrlKeysMapUp[t.keyCode]](t), t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.renderAll()) : this._copyDone = !1
        },
        onInput: function(t) {
            if(this.isEditing && !this.inCompositionMode) {
                var e, i, r, n = this.selectionStart || 0,
                    s = this.selectionEnd || 0,
                    o = this.text.length,
                    a = this.hiddenTextarea.value.length;
                a > o ? (r = "left" === this._selectionDirection ? s : n, e = a - o, i = this.hiddenTextarea.value.slice(r, r + e)) : (e = a - o + s - n, i = this.hiddenTextarea.value.slice(n, n + e)), this.insertChars(i), t.stopPropagation()
            }
        },
        onCompositionStart: function() {
            this.inCompositionMode = !0, this.prevCompositionLength = 0, this.compositionStart = this.selectionStart
        },
        onCompositionEnd: function() {
            this.inCompositionMode = !1
        },
        onCompositionUpdate: function(t) {
            var e = t.data;
            this.selectionStart = this.compositionStart, this.selectionEnd = this.selectionEnd === this.selectionStart ? this.compositionStart + this.prevCompositionLength : this.selectionEnd, this.insertChars(e, !1), this.prevCompositionLength = e.length
        },
        forwardDelete: function(t) {
            if(this.selectionStart === this.selectionEnd) {
                if(this.selectionStart === this.text.length) return;
                this.moveCursorRight(t)
            }
            this.removeChars(t)
        },
        copy: function(t) {
            if(this.selectionStart !== this.selectionEnd) {
                var e = this.getSelectedText(),
                    i = this._getClipboardData(t);
                i && i.setData("text", e), fabric.copiedText = e, fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd), t.stopImmediatePropagation(), t.preventDefault(), this._copyDone = !0
            }
        },
        paste: function(t) {
            var e = null,
                i = this._getClipboardData(t),
                r = !0;
            i ? (e = i.getData("text").replace(/\r/g, ""), fabric.copiedTextStyle && fabric.copiedText === e || (r = !1)) : e = fabric.copiedText, e && this.insertChars(e, r), t.stopImmediatePropagation(), t.preventDefault()
        },
        cut: function(t) {
            this.selectionStart !== this.selectionEnd && (this.copy(t), this.removeChars(t))
        },
        _getClipboardData: function(t) {
            return t && t.clipboardData || fabric.window.clipboardData
        },
        _getWidthBeforeCursor: function(t, e) {
            for(var i, r = this._textLines[t].slice(0, e), n = this._getLineWidth(this.ctx, t), s = this._getLineLeftOffset(n), o = 0, a = r.length; o < a; o++) i = r[o], s += this._getWidthOfChar(this.ctx, i, t, o);
            return s
        },
        getDownCursorOffset: function(t, e) {
            var i = this._getSelectionForOffset(t, e),
                r = this.get2DCursorLocation(i),
                n = r.lineIndex;
            if(n === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode) return this.text.length - i;
            var s = r.charIndex,
                o = this._getWidthBeforeCursor(n, s),
                a = this._getIndexOnLine(n + 1, o);
            return this._textLines[n].slice(s).length + a + 2
        },
        _getSelectionForOffset: function(t, e) {
            return t.shiftKey && this.selectionStart !== this.selectionEnd && e ? this.selectionEnd : this.selectionStart
        },
        getUpCursorOffset: function(t, e) {
            var i = this._getSelectionForOffset(t, e),
                r = this.get2DCursorLocation(i),
                n = r.lineIndex;
            if(0 === n || t.metaKey || 33 === t.keyCode) return -i;
            var s = r.charIndex,
                o = this._getWidthBeforeCursor(n, s),
                a = this._getIndexOnLine(n - 1, o),
                h = this._textLines[n].slice(0, s);
            return -this._textLines[n - 1].length + a - h.length
        },
        _getIndexOnLine: function(t, e) {
            for(var i, r = this._getLineWidth(this.ctx, t), n = this._textLines[t], s = this._getLineLeftOffset(r), o = 0, a = 0, h = n.length; a < h; a++) {
                var c = n[a],
                    l = this._getWidthOfChar(this.ctx, c, t, a);
                if((s += l) > e) {
                    i = !0;
                    var u = s - l,
                        f = s,
                        d = Math.abs(u - e);
                    o = Math.abs(f - e) < d ? a : a - 1;
                    break
                }
            }
            return i || (o = n.length - 1), o
        },
        moveCursorDown: function(t) {
            this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length || this._moveCursorUpOrDown("Down", t)
        },
        moveCursorUp: function(t) {
            0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorUpOrDown("Up", t)
        },
        _moveCursorUpOrDown: function(t, e) {
            var i = this["get" + t + "CursorOffset"](e, "right" === this._selectionDirection);
            e.shiftKey ? this.moveCursorWithShift(i) : this.moveCursorWithoutShift(i), 0 !== i && (this.setSelectionInBoundaries(), this.abortCursorAnimation(), this._currentCursorOpacity = 1, this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
        },
        moveCursorWithShift: function(t) {
            var e = "left" === this._selectionDirection ? this.selectionStart + t : this.selectionEnd + t;
            return this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, e), 0 !== t
        },
        moveCursorWithoutShift: function(t) {
            return t < 0 ? (this.selectionStart += t, this.selectionEnd = this.selectionStart) : (this.selectionEnd += t, this.selectionStart = this.selectionEnd), 0 !== t
        },
        moveCursorLeft: function(t) {
            0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorLeftOrRight("Left", t)
        },
        _move: function(t, e, i) {
            var r;
            if(t.altKey) r = this["findWordBoundary" + i](this[e]);
            else {
                if(!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode) return this[e] += "Left" === i ? -1 : 1, !0;
                r = this["findLineBoundary" + i](this[e])
            }
            if(void 0 !== typeof r && this[e] !== r) return this[e] = r, !0
        },
        _moveLeft: function(t, e) {
            return this._move(t, e, "Left")
        },
        _moveRight: function(t, e) {
            return this._move(t, e, "Right")
        },
        moveCursorLeftWithoutShift: function(t) {
            var e = !0;
            return this._selectionDirection = "left", this.selectionEnd === this.selectionStart && 0 !== this.selectionStart && (e = this._moveLeft(t, "selectionStart")), this.selectionEnd = this.selectionStart, e
        },
        moveCursorLeftWithShift: function(t) {
            return "right" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveLeft(t, "selectionEnd") : 0 !== this.selectionStart ? (this._selectionDirection = "left", this._moveLeft(t, "selectionStart")) : void 0
        },
        moveCursorRight: function(t) {
            this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length || this._moveCursorLeftOrRight("Right", t)
        },
        _moveCursorLeftOrRight: function(t, e) {
            var i = "moveCursor" + t + "With";
            this._currentCursorOpacity = 1, e.shiftKey ? i += "Shift" : i += "outShift", this[i](e) && (this.abortCursorAnimation(), this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
        },
        moveCursorRightWithShift: function(t) {
            return "left" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveRight(t, "selectionStart") : this.selectionEnd !== this.text.length ? (this._selectionDirection = "right", this._moveRight(t, "selectionEnd")) : void 0
        },
        moveCursorRightWithoutShift: function(t) {
            var e = !0;
            return this._selectionDirection = "right", this.selectionStart === this.selectionEnd ? (e = this._moveRight(t, "selectionStart"), this.selectionEnd = this.selectionStart) : this.selectionStart = this.selectionEnd, e
        },
        removeChars: function(t) {
            this.selectionStart === this.selectionEnd ? this._removeCharsNearCursor(t) : this._removeCharsFromTo(this.selectionStart, this.selectionEnd), this.set("dirty", !0), this.setSelectionEnd(this.selectionStart), this._removeExtraneousStyles(), this.canvas && this.canvas.renderAll(), this.setCoords(), this.fire("changed"), this.canvas && this.canvas.fire("text:changed", {
                target: this
            })
        },
        _removeCharsNearCursor: function(t) {
            if(0 !== this.selectionStart)
                if(t.metaKey) {
                    var e = this.findLineBoundaryLeft(this.selectionStart);
                    this._removeCharsFromTo(e, this.selectionStart), this.setSelectionStart(e)
                } else if(t.altKey) {
                var i = this.findWordBoundaryLeft(this.selectionStart);
                this._removeCharsFromTo(i, this.selectionStart), this.setSelectionStart(i)
            } else this._removeSingleCharAndStyle(this.selectionStart), this.setSelectionStart(this.selectionStart - 1)
        }
    }),
    function() {
        var t = fabric.util.toFixed,
            e = fabric.Object.NUM_FRACTION_DIGITS;
        fabric.util.object.extend(fabric.IText.prototype, {
            _setSVGTextLineText: function(t, e, i, r, n, s) {
                this._getLineStyle(t) ? this._setSVGTextLineChars(t, e, i, r, s) : fabric.Text.prototype._setSVGTextLineText.call(this, t, e, i, r, n)
            },
            _setSVGTextLineChars: function(t, e, i, r, n) {
                for(var s = this._textLines[t], o = 0, a = this._getLineLeftOffset(this._getLineWidth(this.ctx, t)) - this.width / 2, h = this._getSVGLineTopOffset(t), c = this._getHeightOfLine(this.ctx, t), l = 0, u = s.length; l < u; l++) {
                    var f = this._getStyleDeclaration(t, l) || {};
                    e.push(this._createTextCharSpan(s[l], f, a, h.lineTop + h.offset, o));
                    var d = this._getWidthOfChar(this.ctx, s[l], t, l);
                    f.textBackgroundColor && n.push(this._createTextCharBg(f, a, h.lineTop, c, d, o)), o += d
                }
            },
            _getSVGLineTopOffset: function(t) {
                for(var e = 0, i = 0, r = 0; r < t; r++) e += this._getHeightOfLine(this.ctx, r);
                return i = this._getHeightOfLine(this.ctx, r), {
                    lineTop: e,
                    offset: (this._fontSizeMult - this._fontSizeFraction) * i / (this.lineHeight * this._fontSizeMult)
                }
            },
            _createTextCharBg: function(i, r, n, s, o, a) {
                return ['\t\t<rect fill="', i.textBackgroundColor, '" x="', t(r + a, e), '" y="', t(n - this.height / 2, e), '" width="', t(o, e), '" height="', t(s / this.lineHeight, e), '"></rect>\n'].join("")
            },
            _createTextCharSpan: function(i, r, n, s, o) {
                var a = this.getSvgStyles.call(fabric.util.object.extend({
                    visible: !0,
                    fill: this.fill,
                    stroke: this.stroke,
                    type: "text",
                    getSvgFilter: fabric.Object.prototype.getSvgFilter
                }, r));
                return ['\t\t\t<tspan x="', t(n + o, e), '" y="', t(s - this.height / 2, e), '" ', r.fontFamily ? 'font-family="' + r.fontFamily.replace(/"/g, "'") + '" ' : "", r.fontSize ? 'font-size="' + r.fontSize + '" ' : "", r.fontStyle ? 'font-style="' + r.fontStyle + '" ' : "", r.fontWeight ? 'font-weight="' + r.fontWeight + '" ' : "", r.textDecoration ? 'text-decoration="' + r.textDecoration + '" ' : "", 'style="', a, '">', fabric.util.string.escapeXml(i), "</tspan>\n"].join("")
            }
        })
    }(),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Textbox = e.util.createClass(e.IText, e.Observable, {
            type: "textbox",
            minWidth: 20,
            dynamicMinWidth: 2,
            __cachedLines: null,
            lockScalingY: !0,
            lockScalingFlip: !0,
            noScaleCache: !1,
            _dimensionAffectingProps: e.Text.prototype._dimensionAffectingProps.concat("width"),
            initialize: function(t, i) {
                this.callSuper("initialize", t, i), this.setControlsVisibility(e.Textbox.getTextboxControlVisibility()), this.ctx = this.objectCaching ? this._cacheContext : e.util.createCanvasElement().getContext("2d")
            },
            _initDimensions: function(t) {
                this.__skipDimension || (t || (t = e.util.createCanvasElement().getContext("2d"), this._setTextStyles(t), this.clearContextTop()), this.dynamicMinWidth = 0, this._textLines = this._splitTextIntoLines(t), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), this._clearCache(), this.height = this._getTextHeight(t), this.setCoords())
            },
            _generateStyleMap: function() {
                for(var t = 0, e = 0, i = 0, r = {}, n = 0; n < this._textLines.length; n++) "\n" === this.text[i] && n > 0 ? (e = 0, i++, t++) : " " === this.text[i] && n > 0 && (e++, i++), r[n] = {
                    line: t,
                    offset: e
                }, i += this._textLines[n].length, e += this._textLines[n].length;
                return r
            },
            _getStyleDeclaration: function(t, e, i) {
                if(this._styleMap) {
                    var r = this._styleMap[t];
                    if(!r) return i ? {} : null;
                    t = r.line, e = r.offset + e
                }
                return this.callSuper("_getStyleDeclaration", t, e, i)
            },
            _setStyleDeclaration: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function(t, e) {
                var i = this._styleMap[t];
                t = i.line, e = i.offset + e, delete this.styles[t][e]
            },
            _getLineStyle: function(t) {
                var e = this._styleMap[t];
                return this.styles[e.line]
            },
            _setLineStyle: function(t, e) {
                var i = this._styleMap[t];
                this.styles[i.line] = e
            },
            _deleteLineStyle: function(t) {
                var e = this._styleMap[t];
                delete this.styles[e.line]
            },
            _wrapText: function(t, e) {
                var i, r = e.split(this._reNewline),
                    n = [];
                for(i = 0; i < r.length; i++) n = n.concat(this._wrapLine(t, r[i], i));
                return n
            },
            _measureText: function(t, e, i, r) {
                var n = 0;
                r = r || 0;
                for(var s = 0, o = e.length; s < o; s++) n += this._getWidthOfChar(t, e[s], i, s + r);
                return n
            },
            _wrapLine: function(t, e, i) {
                for(var r = 0, n = [], s = "", o = e.split(" "), a = "", h = 0, c = 0, l = 0, u = 0, f = !0, d = this._getWidthOfCharSpacing(), g = 0; g < o.length; g++) a = o[g], c = this._measureText(t, a, i, h), h += a.length, (r += l + c - d) >= this.width && !f ? (n.push(s), s = "", r = c, f = !0) : r += d, f || (s += " "), s += a, l = this._measureText(t, " ", i, h), h++, f = !1, c > u && (u = c);
                return g && n.push(s), u > this.dynamicMinWidth && (this.dynamicMinWidth = u - d), n
            },
            _splitTextIntoLines: function(t) {
                t = t || this.ctx;
                var e = this.textAlign;
                this._styleMap = null, t.save(), this._setTextStyles(t), this.textAlign = "left";
                var i = this._wrapText(t, this.text);
                return this.textAlign = e, t.restore(), this._textLines = i, this._styleMap = this._generateStyleMap(), i
            },
            setOnGroup: function(t, e) {
                "scaleX" === t && (this.set("scaleX", Math.abs(1 / e)), this.set("width", this.get("width") * e / (void 0 === this.__oldScaleX ? 1 : this.__oldScaleX)), this.__oldScaleX = e)
            },
            get2DCursorLocation: function(t) {
                void 0 === t && (t = this.selectionStart);
                for(var e = this._textLines.length, i = 0, r = 0; r < e; r++) {
                    var n = this._textLines[r].length;
                    if(t <= i + n) return {
                        lineIndex: r,
                        charIndex: t - i
                    };
                    i += n, "\n" !== this.text[i] && " " !== this.text[i] || i++
                }
                return {
                    lineIndex: e - 1,
                    charIndex: this._textLines[e - 1].length
                }
            },
            _getCursorBoundariesOffsets: function(t, e) {
                for(var i = 0, r = 0, n = this.get2DCursorLocation(), s = this._textLines[n.lineIndex].split(""), o = this._getLineLeftOffset(this._getLineWidth(this.ctx, n.lineIndex)), a = 0; a < n.charIndex; a++) r += this._getWidthOfChar(this.ctx, s[a], n.lineIndex, a);
                for(a = 0; a < n.lineIndex; a++) i += this._getHeightOfLine(this.ctx, a);
                return "cursor" === e && (i += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, n.lineIndex) / this.lineHeight - this.getCurrentCharFontSize(n.lineIndex, n.charIndex) * (1 - this._fontSizeFraction)), {
                    top: i,
                    left: r,
                    lineLeft: o
                }
            },
            getMinWidth: function() {
                return Math.max(this.minWidth, this.dynamicMinWidth)
            },
            toObject: function(t) {
                return this.callSuper("toObject", ["minWidth"].concat(t))
            }
        }), e.Textbox.fromObject = function(t, i, r) {
            return e.Object._fromObject("Textbox", t, i, r, "text")
        }, e.Textbox.getTextboxControlVisibility = function() {
            return {
                tl: !1,
                tr: !1,
                br: !1,
                bl: !1,
                ml: !0,
                mt: !1,
                mr: !0,
                mb: !1,
                mtr: !0
            }
        }
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.Canvas.prototype._setObjectScale;
        fabric.Canvas.prototype._setObjectScale = function(e, i, r, n, s, o, a) {
            var h = i.target;
            if(!(h instanceof fabric.Textbox)) return t.call(fabric.Canvas.prototype, e, i, r, n, s, o, a);
            var c = h.width * (e.x / i.scaleX / (h.width + h.strokeWidth));
            return c >= h.getMinWidth() ? (h.set("width", c), !0) : void 0
        }, fabric.Group.prototype._refreshControlsVisibility = function() {
            if(void 0 !== fabric.Textbox)
                for(var t = this._objects.length; t--;)
                    if(this._objects[t] instanceof fabric.Textbox) return void this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility())
        }, fabric.util.object.extend(fabric.Textbox.prototype, {
            _removeExtraneousStyles: function() {
                for(var t in this._styleMap) this._textLines[t] || delete this.styles[this._styleMap[t].line]
            },
            insertCharStyleObject: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, fabric.IText.prototype.insertCharStyleObject.apply(this, [t, e, i])
            },
            insertNewlineStyleObject: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, fabric.IText.prototype.insertNewlineStyleObject.apply(this, [t, e, i])
            },
            shiftLineStyles: function(t, e) {
                t = this._styleMap[t].line, fabric.IText.prototype.shiftLineStyles.call(this, t, e)
            },
            _getTextOnPreviousLine: function(t) {
                for(var e = this._textLines[t - 1]; this._styleMap[t - 2] && this._styleMap[t - 2].line === this._styleMap[t - 1].line;) e = this._textLines[t - 2] + e, t--;
                return e
            },
            removeStyleObject: function(t, e) {
                var i = this.get2DCursorLocation(e),
                    r = this._styleMap[i.lineIndex],
                    n = r.line,
                    s = r.offset + i.charIndex;
                this._removeStyleObject(t, i, n, s)
            }
        })
    }(),
    function() {
        var t = fabric.IText.prototype._getNewSelectionStartFromOffset;
        fabric.IText.prototype._getNewSelectionStartFromOffset = function(e, i, r, n, s) {
            n = t.call(this, e, i, r, n, s);
            for(var o = 0, a = 0, h = 0; h < this._textLines.length && !((o += this._textLines[h].length) + a >= n); h++) "\n" !== this.text[o + a] && " " !== this.text[o + a] || a++;
            return n - h + a
        }
    }(),
    function() {
        function request(t, e, i) {
            var r = URL.parse(t);
            r.port || (r.port = 0 === r.protocol.indexOf("https:") ? 443 : 80);
            var n = (0 === r.protocol.indexOf("https:") ? HTTPS : HTTP).request({
                hostname: r.hostname,
                port: r.port,
                path: r.path,
                method: "GET"
            }, function(t) {
                var r = "";
                e && t.setEncoding(e), t.on("end", function() {
                    i(r)
                }), t.on("data", function(e) {
                    200 === t.statusCode && (r += e)
                })
            });
            n.on("error", function(t) {
                t.errno === process.ECONNREFUSED ? fabric.log("ECONNREFUSED: connection refused to " + r.hostname + ":" + r.port) : fabric.log(t.message), i(null)
            }), n.end()
        }

        function requestFs(t, e) {
            require("fs").readFile(t, function(t, i) {
                if(t) throw fabric.log(t), t;
                e(i)
            })
        }
        if("undefined" == typeof document || "undefined" == typeof window) {
            var DOMParser = require("xmldom").DOMParser,
                URL = require("url"),
                HTTP = require("http"),
                HTTPS = require("https"),
                Canvas = require("canvas"),
                Image = require("canvas").Image;
            fabric.util.loadImage = function(t, e, i) {
                function r(r) {
                    r ? (n.src = new Buffer(r, "binary"), n._src = t, e && e.call(i, n)) : (n = null, e && e.call(i, null, !0))
                }
                var n = new Image;
                t && (t instanceof Buffer || 0 === t.indexOf("data")) ? (n.src = n._src = t, e && e.call(i, n)) : t && 0 !== t.indexOf("http") ? requestFs(t, r) : t ? request(t, "binary", r) : e && e.call(i, t)
            }, fabric.loadSVGFromURL = function(t, e, i) {
                0 !== (t = t.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim()).indexOf("http") ? requestFs(t, function(t) {
                    fabric.loadSVGFromString(t.toString(), e, i)
                }) : request(t, "", function(t) {
                    fabric.loadSVGFromString(t, e, i)
                })
            }, fabric.loadSVGFromString = function(t, e, i) {
                var r = (new DOMParser).parseFromString(t);
                fabric.parseSVGDocument(r.documentElement, function(t, i) {
                    e && e(t, i)
                }, i)
            }, fabric.util.getScript = function(url, callback) {
                request(url, "", function(body) {
                    eval(body), callback && callback()
                })
            }, fabric.createCanvasForNode = function(t, e, i, r) {
                r = r || i;
                var n = fabric.document.createElement("canvas"),
                    s = new Canvas(t || 600, e || 600, r),
                    o = new Canvas(t || 600, e || 600, r);
                n.style = {}, n.width = s.width, n.height = s.height, (i = i || {}).nodeCanvas = s, i.nodeCacheCanvas = o;
                var a = new(fabric.Canvas || fabric.StaticCanvas)(n, i);
                return a.nodeCanvas = s, a.nodeCacheCanvas = o, a.contextContainer = s.getContext("2d"), a.contextCache = o.getContext("2d"), a.Font = Canvas.Font, a
            };
            var originaInitStatic = fabric.StaticCanvas.prototype._initStatic;
            fabric.StaticCanvas.prototype._initStatic = function(t, e) {
                t = t || fabric.document.createElement("canvas"), this.nodeCanvas = new Canvas(t.width, t.height), this.nodeCacheCanvas = new Canvas(t.width, t.height), originaInitStatic.call(this, t, e), this.contextContainer = this.nodeCanvas.getContext("2d"), this.contextCache = this.nodeCacheCanvas.getContext("2d"), this.Font = Canvas.Font
            }, fabric.StaticCanvas.prototype.createPNGStream = function() {
                return this.nodeCanvas.createPNGStream()
            }, fabric.StaticCanvas.prototype.createJPEGStream = function(t) {
                return this.nodeCanvas.createJPEGStream(t)
            }, fabric.StaticCanvas.prototype._initRetinaScaling = function() {
                if(this._isRetinaScaling()) return this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.nodeCanvas.width = this.width * fabric.devicePixelRatio, this.nodeCanvas.height = this.height * fabric.devicePixelRatio, this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio), this
            }, fabric.Canvas && (fabric.Canvas.prototype._initRetinaScaling = fabric.StaticCanvas.prototype._initRetinaScaling);
            var origSetBackstoreDimension = fabric.StaticCanvas.prototype._setBackstoreDimension;
            fabric.StaticCanvas.prototype._setBackstoreDimension = function(t, e) {
                return origSetBackstoreDimension.call(this, t, e), this.nodeCanvas[t] = e, this
            }, fabric.Canvas && (fabric.Canvas.prototype._setBackstoreDimension = fabric.StaticCanvas.prototype._setBackstoreDimension)
        }
    }();