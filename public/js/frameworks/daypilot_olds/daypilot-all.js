/*
DayPilot Pro
Copyright (c) 2005 - 2013 Annpoint s.r.o.
http://www.daypilot.org/
Use of this software is subject to license terms.
Version: 444
*/
if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilotBubble === 'undefined') {
    var DayPilotBubble = DayPilot.BubbleVisible = {};
};
(function() {
    if (typeof DayPilot.Bubble !== 'undefined') {
        return;
    };
    var DayPilotBubble = {};
    DayPilotBubble.mouseMove = function(ev) {
        if (typeof(DayPilotBubble) === 'undefined') {
            return;
        };
        DayPilotBubble.mouse = DayPilotBubble.mousePosition(ev);
        var b = DayPilotBubble.active;
        if (b && b.showPosition) {
            var $a = b.showPosition;
            var $b = DayPilotBubble.mouse;
            if ($a.clientX !== $b.clientX || $a.clientY !== $b.clientY) {
                b.delayedHide();
            }
        }
    };
    DayPilotBubble.mousePosition = function(e) {
        var $c = DayPilot.page(e);
        $c.clientY = e.clientY;
        $c.clientX = e.clientX;
        return $c;
    };
    DayPilot.Bubble = function($d) {
        this.v = '444';
        var $e = this;
        this.backgroundColor = "#ffffff";
        this.border = "1px solid #000000";
        this.corners = 'Rounded';
        this.cssOnly = true;
        this.hideAfter = 500;
        this.loadingText = "Loading...";
        this.animated = true;
        this.animation = "fast";
        this.position = "EventTop";
        this.showAfter = 500;
        this.showLoadingLabel = true;
        this.useShadow = true;
        this.zIndex = 10;
        this.elements = {};
        this.callBack = function($f) {
            if (this.aspnet()) {
                WebForm_DoCallback(this.uniqueID, DayPilot.JSON.stringify($f), this.updateView, this, this.callbackError, true);
            } else {
                if ($f.calendar.internal.bubbleCallBack) {
                    $f.calendar.internal.bubbleCallBack($f, this);
                } else {
                    $f.calendar.bubbleCallBack($f, this);
                }
            }
        };
        this.callbackError = function($c, $g) {
            alert($c);
        };
        this.updateView = function($c, $g) {
            if ($e !== $g) {
                throw "Callback object mismatch (internal error)";
            };
            DayPilotBubble.active = $e;
            if ($e) {
                if ($e.elements.inner) {
                    $e.elements.inner.innerHTML = $c;
                };
                $e.adjustPosition();
                if (!$e.animated) {
                    $e.addShadow();
                }
            }
        };
        this.init = function() {
            DayPilot.re(document.body, 'mousemove', DayPilotBubble.mouseMove);
        };
        this.aspnet = function() {
            return (typeof WebForm_DoCallback !== 'undefined');
        };
        this.rounded = function() {
            return this.corners === 'Rounded';
        };
        this.showEvent = function(e, $h) {
            var a = new DayPilotBubble.CallBackArgs(e.calendar || e.root, 'Event', e, e.bubbleHtml ? e.bubbleHtml() : null);
            if ($h) {
                this.show(a);
            } else {
                this.showOnMouseOver(a);
            }
        };
        this.showCell = function($i) {
            var a = new DayPilotBubble.CallBackArgs($i.calendar || $i.root, 'Cell', $i, $i.staticBubbleHTML ? $i.staticBubbleHTML() : null);
            this.showOnMouseOver(a);
        };
        this.showTime = function($j) {
            var a = new DayPilotBubble.CallBackArgs($j.calendar || $j.root, 'Time', $j, $j.staticBubbleHTML ? $j.staticBubbleHTML() : null);
            this.showOnMouseOver(a);
        };
        this.showResource = function($k) {
            var a = new DayPilotBubble.CallBackArgs($k.calendar || $k.root, 'Resource', $k, $k.staticBubbleHTML ? $k.staticBubbleHTML() : null);
            this.showOnMouseOver(a);
        };
        this.showHtml = function($l, $m) {
            var a = new DayPilotBubble.CallBackArgs(null, 'Html', null, $l);
            a.div = $m;
            this.show(a);
        };
        this.show = function($n) {
            var $o = this.animated;
            this.showPosition = DayPilotBubble.mouse;
            var id;
            try {
                id = DayPilot.JSON.stringify($n.object);
            } catch (e) {
                return;
            };
            if (DayPilotBubble.active === this && this.sourceId === id) {
                return;
            };
            if (typeof DayPilot.Menu !== 'undefined' && DayPilot.Menu.active) {
                return;
            };
            DayPilotBubble.hideActive();
            DayPilotBubble.active = this;
            this.sourceId = id;
            var $m = document.createElement("div");
            $m.setAttribute("unselectable", "on");
            if (!this.showLoadingLabel) {
                $m.style.display = 'none';
            };
            document.body.appendChild($m);
            $m.style.position = 'absolute';
            if (!this.cssOnly) {
                if (this.width) {
                    $m.style.width = this.width;
                };
                $m.style.cursor = 'default';
            } else {
                $m.className = this.prefixCssClass("_main");
            };
            $m.style.top = '0px';
            $m.style.left = '0px';
            $m.style.zIndex = this.zIndex + 1;
            if ($o) {
                $m.style.visibility = 'hidden';
            };
            $m.onclick = function() {
                DayPilotBubble.hideActive();
            };
            $m.onmousemove = function(e) {
                DayPilotBubble.cancelTimeout();
                var e = e || window.event;
                e.cancelBubble = true;
            };
            $m.oncontextmenu = function() {
                return false;
            };
            $m.onmouseout = this.delayedHide;
            var $p = document.createElement("div");
            $m.appendChild($p);
            if (this.cssOnly) {
                $p.className = this.prefixCssClass("_main_inner");
            } else {
                $p.style.padding = '4px';
                if (this.border) {
                    $p.style.border = this.border;
                };
                if (this.rounded()) {
                    $p.style.MozBorderRadius = "5px";
                    $p.style.webkitBorderRadius = "5px";
                    $p.style.borderRadius = "5px";
                };
                $p.style.backgroundColor = this.backgroundColor;
            };
            $p.innerHTML = this.loadingText;
            this.elements.div = $m;
            this.elements.inner = $p;
            var $m = this.getDiv($n);
            if (this.position === "EventTop" && $m) {
                var $q = 2;
                var $r = DayPilot.abs($m, true);
                this.mouse = DayPilotBubble.mouse;
                this.mouse.x = $r.x;
                this.mouse.y = $r.y;
                this.mouse.h = $r.h + $q;
                this.mouse.w = $r.w;
            } else {
                this.mouse = DayPilotBubble.mouse;
            };
            if (this.showLoadingLabel && !$o) {
                this.adjustPosition();
                this.addShadow();
            };
            if ($n.staticHTML) {
                this.updateView($n.staticHTML, this);
            } else if (typeof this.onLoad === 'function') {
                var $f = {};
                $f.source = $n.object;
                $f.async = false;
                $f.loaded = function() {
                    if (this.async) {
                        $e.updateView($f.html, $e);
                    }
                };
                this.onLoad($f);
                if (!$f.async) {
                    $e.updateView($f.html, $e);
                }
            } else {
                this.callBack($n);
            }
        };
        this.getDiv = function($n) {
            if ($n.div) {
                return $n.div;
            };
            if ($n.type === 'Event' && $n.calendar && $n.calendar.internal.findEventDiv) {
                return $n.calendar.internal.findEventDiv($n.object);
            }
        };
        this.prefixCssClass = function($s) {
            if (this.cssClassPrefix) {
                return this.cssClassPrefix + $s;
            } else {
                return "";
            }
        };
        this.loadingElement = null;
        this.loadingStart = function($r) {};
        this.loadingStop = function() {};
        this.adjustPosition = function() {
            var $o = this.animated;
            var $t = this.position;
            var $u = 10;
            if (!this.elements.div) {
                return;
            };
            if (!this.mouse) {
                return;
            };
            if (!this.mouse.x || !this.mouse.y) {
                DayPilotBubble.hideActive();
                return;
            };
            var $m = this.elements.div;
            $m.style.display = '';
            var $v = $m.offsetHeight;
            var $w = $m.offsetWidth;
            $m.style.display = 'none';
            var wd = DayPilot.wd();
            var $x = wd.width;
            var $y = wd.height;
            if ($t === 'Mouse') {
                var $z = 22;
                var $A = 10;
                var top = 0;
                if (this.mouse.clientY > $y - $v + $u) {
                    var $B = this.mouse.clientY - ($y - $v) + $u;
                    top = (this.mouse.y - $v - $A);
                } else {
                    top = this.mouse.y + $z;
                };
                if (typeof top === 'number') {
                    $m.style.top = Math.max(top, 0) + "px";
                };
                if (this.mouse.clientX > $x - $w + $u) {
                    var $C = this.mouse.clientX - ($x - $w) + $u;
                    $m.style.left = (this.mouse.x - $C) + 'px';
                } else {
                    $m.style.left = this.mouse.x + 'px';
                }
            } else if ($t === 'EventTop') {
                var $D = 2;
                var top = this.mouse.y - $v - $D;
                var $E = wd.scrollTop;
                if (top < $E) {
                    top = this.mouse.y + this.mouse.h + $D;
                };
                if (typeof top === 'number') {
                    $m.style.top = Math.max(top, 0) + 'px';
                };
                var $F = this.mouse.x;
                if (this.mouse.x + $w + $u > $x) {
                    $F = $x - $w - $u;
                };
                $m.style.left = $F + 'px';
            };
            $m.style.display = '';
            if ($o) {
                $m.style.display = '';
                var $G = {};
                $G.color = $m.firstChild.style.color;
                $G.overflow = $m.style.overflow;
                $m.firstChild.style.color = "transparent";
                $m.style.overflow = 'hidden';
                this.removeShadow();
                DayPilot.pop($m, {
                    "finished": function() {
                        $m.firstChild.style.color = $G.color;
                        $m.style.overflow = $G.overflow;
                        $e.addShadow();
                    },
                    "vertical": "bottom",
                    "horizontal": "left",
                    "animation": $e.animation
                });
            }
        };
        this.delayedHide = function() {
            DayPilotBubble.cancelTimeout();
            if ($e.hideAfter > 0) {
                DayPilotBubble.timeout = window.setTimeout(DayPilotBubble.hideActive, $e.hideAfter);
            }
        };
        this.showOnMouseOver = function($n) {
            DayPilotBubble.cancelTimeout();
            var $H = function($I) {
                return function() {
                    $e.show($I);
                };
            };
            DayPilotBubble.timeout = window.setTimeout($H($n), this.showAfter);
        };
        this.hideOnMouseOut = function() {
            this.delayedHide();
        };
        this.addShadow = function() {
            if (!this.useShadow) {
                return;
            };
            if (this.cssOnly) {
                return;
            };
            if (!this.elements.div) {
                return;
            };
            var $m = this.elements.div;
            if (this.shadows && this.shadows.length > 0) {
                this.removeShadow();
            };
            this.shadows = [];
            for (var i = 0; i < 5; i++) {
                var $J = document.createElement('div');
                $J.setAttribute("unselectable", "on");
                $J.style.position = 'absolute';
                $J.style.width = $m.offsetWidth + 'px';
                $J.style.height = $m.offsetHeight + 'px';
                $J.style.top = $m.offsetTop + i + 'px';
                $J.style.left = $m.offsetLeft + i + 'px';
                $J.style.zIndex = this.zIndex;
                $J.style.filter = 'alpha(opacity:10)';
                $J.style.opacity = 0.1;
                $J.style.backgroundColor = '#000000';
                if (this.rounded()) {
                    $J.style.MozBorderRadius = "5px";
                    $J.style.webkitBorderRadius = "5px";
                    $J.style.borderRadius = "5px";
                };
                document.body.appendChild($J);
                this.shadows.push($J);
            }
        };
        this.removeShadow = function() {
            if (!this.shadows) {
                return;
            };
            for (var i = 0; i < this.shadows.length; i++) {
                document.body.removeChild(this.shadows[i]);
            };
            this.shadows = [];
        };
        this.removeDiv = function() {
            if (!this.elements.div) {
                return;
            };
            document.body.removeChild(this.elements.div);
            this.elements.div = null;
        };
        if ($d) {
            for (var name in $d) {
                this[name] = $d[name];
            }
        };
        this.init();
    };
    DayPilotBubble.cancelTimeout = function() {
        if (DayPilotBubble.timeout) {
            window.clearTimeout(DayPilotBubble.timeout);
        }
    };
    DayPilotBubble.hideActive = function() {
        DayPilotBubble.cancelTimeout();
        var $e = DayPilotBubble.active;
        if ($e) {
            $e.removeDiv();
            $e.removeShadow();
        };
        DayPilotBubble.active = null;
    };
    DayPilotBubble.CallBackArgs = function($K, $L, $M, $N) {
        this.calendar = $K;
        this.type = $L;
        this.object = $M;
        this.staticHTML = $N;
        this.toJSON = function() {
            var $O = {};
            $O.uid = this.calendar.uniqueID;
            $O.type = this.type;
            $O.object = $M;
            return $O;
        };
    };
    DayPilot.BubbleVisible.Bubble = DayPilotBubble.Bubble;
    DayPilot.BubbleVisible.hideActive = DayPilotBubble.hideActive;
    DayPilot.BubbleVisible.cancelTimeout = DayPilotBubble.cancelTimeout;
    DayPilot.Bubble.hideActive = DayPilotBubble.hideActive;
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilotCalendar === 'undefined') {
    var DayPilotCalendar = DayPilot.CalendarVisible = {};
};
if (typeof DayPilot.Global === 'undefined') {
    DayPilot.Global = {};
};
(function() {
    if (typeof DayPilot.Calendar !== 'undefined') {
        return;
    };
    DayPilot.Calendar = function(id) {
        this.v = '444';
        var $a = false;
        if (this instanceof DayPilot.Calendar && !this.$3s) {
            $a = true;
            this.$3s = true;
        };
        if (!$a) {
            throw "DayPilot.Calendar() is a constructor and must be called as 'var c = new DayPilot.Calendar(id);'";
        };
        var $b = this;
        this.uniqueID = null;
        this.id = id;
        this.isCalendar = true;
        this.api = 2;
        this.clientName = id;
        this.clientState = {};
        this.$3t = {};
        this.$3t.pixels = {};
        this.$3t.events = [];
        this.elements = {};
        this.elements.events = [];
        this.nav = {};
        this.events = {};
        this.hideUntilInit = true;
        this.fasterDispose = true;
        this.allDayEventBorderColor = "#000000";
        this.allDayEventFontFamily = 'Tahoma';
        this.allDayEventFontSize = '8pt';
        this.allDayEventFontColor = "#000000";
        this.allDayEventHeight = 25;
        this.allowEventOverlap = true;
        this.allowMultiSelect = true;
        this.autoRefreshCommand = 'refresh';
        this.autoRefreshEnabled = false;
        this.autoRefreshInterval = 60;
        this.autoRefreshMaxCount = 20;
        this.borderColor = "#000000";
        this.businessBeginsHour = 9;
        this.businessEndsHour = 18;
        this.cellBackColor = "#FFFFD5";
        this.cellBackColorNonBusiness = "#FFF4BC";
        this.cellBorderColor = "#999999";
        this.cellHeight = 20;
        this.cellDuration = 30;
        this.columnMarginRight = 5;
        this.cornerBackColor = "#ECE9D8";
        this.crosshairColor = 'Gray';
        this.crosshairOpacity = 20;
        this.crosshairType = "Header";
        this.cssOnly = true;
        this.dayBeginsHour = 0;
        this.dayEndsHour = 24;
        this.days = 1;
        this.deleteImageUrl = null;
        this.durationBarColor = 'blue';
        this.durationBarVisible = true;
        this.durationBarWidth = 5;
        this.durationBarImageUrl = null;
        this.eventArrangement = "SideBySide";
        this.eventBackColor = '#ffffff';
        this.eventBorderColor = "#000000";
        this.eventFontFamily = 'Tahoma';
        this.eventFontSize = '8pt';
        this.eventFontColor = "#000000";
        this.eventSelectColor = 'blue';
        this.headerFontSize = '10pt';
        this.headerFontFamily = 'Tahoma';
        this.headerFontColor = "#000000";
        this.headerHeight = 21;
        this.headerLevels = 1;
        this.height = 300;
        this.heightSpec = 'BusinessHours';
        this.hideFreeCells = false;
        this.hourHalfBorderColor = "#F3E4B1";
        this.hourBorderColor = "#EAD098";
        this.hourFontColor = "#000000";
        this.hourFontFamily = "Tahoma";
        this.hourFontSize = "16pt";
        this.hourNameBackColor = "#ECE9D8";
        this.hourNameBorderColor = "#ACA899";
        this.hourWidth = 45;
        this.initScrollPos = 0;
        this.loadingLabelText = "Loading...";
        this.loadingLabelVisible = true;
        this.loadingLabelBackColor = "orange";
        this.loadingLabelFontColor = "#ffffff";
        this.loadingLabelFontFamily = "Tahoma";
        this.loadingLabelFontSize = "10pt";
        this.locale = "en-us";
        this.messageHideAfter = 5000;
        this.moveBy = "Top";
        this.notifyCommit = 'Immediate';
        this.numberFormat = "0.00";
        this.roundedCorners = false;
        this.rtl = false;
        this.selectedColor = "#316AC5";
        this.shadow = 'Fill';
        this.showToolTip = true;
        this.showAllDayEvents = false;
        this.showAllDayEventStartEnd = true;
        this.showHeader = true;
        this.showHours = true;
        this.startDate = new DayPilot.Date().getDatePart();
        this.timeFormat = 'Auto';
        this.timeHeaderCellDuration = 60;
        this.useEventBoxes = 'Always';
        this.useEventSelectionBars = false;
        this.viewType = 'Days';
        this.eventClickHandling = 'Enabled';
        this.eventDoubleClickHandling = 'Enabled';
        this.eventRightClickHandling = 'ContextMenu';
        this.eventDeleteHandling = 'Disabled';
        this.eventEditHandling = 'Update';
        this.eventHoverHandling = 'Bubble';
        this.eventResizeHandling = 'Update';
        this.eventMoveHandling = 'Update';
        this.eventSelectHandling = 'Update';
        this.headerClickHandling = 'Enabled';
        this.timeRangeSelectedHandling = 'Enabled';
        this.timeRangeDoubleClickHandling = "Enabled";
        this.transparent = false;
        this.separateEventsTable = true;
        this.autoRefreshCount = 0;
        this.doubleClickTimeout = 100;
        this.$3u = {};
        this.$3u.ie = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE") !== -1);
        this.$3u.ie9 = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE 9") !== -1);
        this.$3u.ielt9 = (function() {
            var $c = document.createElement("div");
            $c.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
            var $d = ($c.getElementsByTagName("i").length === 1);
            return $d;
        })();
        this.$3u.ff = (navigator && navigator.userAgent && navigator.userAgent.indexOf("Firefox") !== -1);
        this.$3u.opera105 = (function() {
            if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                var v = new Number(RegExp.$1);
                return v >= 10.5;
            };
            return false;
        })();
        this.$3u.webkit522 = (function() {
            if (/AppleWebKit[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                var v = new Number(RegExp.$1);
                return v >= 522;
            };
            return false;
        })();
        this.clearSelection = function() {
            if (!this.selectedCells) {
                this.selectedCells = [];
                return;
            };
            this.$3v();
            this.selectedCells = [];
        };
        this.$3v = function() {
            if (!this.selectedCells) {
                return;
            };
            for (var j = 0; j < this.selectedCells.length; j++) {
                var $e = this.selectedCells[j];
                if ($e) {
                    if ($e.selected) {
                        $e.removeChild($e.selected);
                        $e.firstChild.style.display = '';
                        $e.selected = null;
                    }
                }
            }
        };
        this.cleanSelection = this.clearSelection;
        this.$3w = function($f, $g, $h) {
            var $i = {};
            $i.action = $f;
            $i.parameters = $h;
            $i.data = $g;
            $i.header = this.$3x();
            var $j = "JSON" + DayPilot.JSON.stringify($i);
            __doPostBack($b.uniqueID, $j);
        };
        this.$3y = function($f, $h, $g, $k) {
            if (this.callbackTimeout) {
                window.clearTimeout(this.callbackTimeout);
            };
            if (typeof $k === 'undefined') {
                $k = "CallBack";
            };
            this.callbackTimeout = window.setTimeout(function() {
                $b.$3z();
            }, 100);
            var $i = {};
            $i.action = $f;
            $i.type = $k;
            $i.parameters = $h;
            $i.data = $g;
            $i.header = this.$3x();
            var $j = "JSON" + DayPilot.JSON.stringify($i);
            if (this.backendUrl) {
                DayPilot.request(this.backendUrl, this.$3A, $j, this.$3B);
            } else if (typeof WebForm_DoCallback === 'function') {
                WebForm_DoCallback(this.uniqueID, $j, this.$3C, this.clientName, this.onCallbackError, true);
            }
        };
        this.$3B = function($l) {
            if (typeof $b.onAjaxError === 'function') {
                var $m = {};
                $m.request = $l;
                $b.onAjaxError($m);
            } else if (typeof $b.ajaxError === 'function') {
                $b.ajaxError($l);
            }
        };
        this.dispose = function() {
            var c = $b;
            if (!c.nav.top) {
                return;
            };
            c.$3D();
            c.$3E();
            if (c.nav.messageClose) {
                c.nav.messageClose.onclick = null;
            };
            if (c.nav.hourTable) c.nav.hourTable.oncontextmenu = null;
            if (c.nav.hourTable) c.nav.hourTable.onmousemove = null;
            if (c.nav.header) c.nav.header.oncontextmenu = null;
            if (c.nav.corner) c.nav.corner.oncontextmenu = null;
            c.nav.zoom.onmousemove = null;
            c.nav.scroll.onscroll = null;
            c.nav.scroll.root = null;
            DayPilot.pu(c.nav.loading);
            c.$3F();
            c.$3G();
            c.nav.select = null;
            c.nav.cornerRight = null;
            c.nav.scrollable = null;
            c.nav.bottomLeft = null;
            c.nav.bottomRight = null;
            c.nav.allday = null;
            c.nav.zoom = null;
            c.nav.loading = null;
            c.nav.events = null;
            c.nav.header = null;
            c.nav.hourTable = null;
            c.nav.scrolltop = null;
            c.nav.scroll = null;
            c.nav.vsph = null;
            c.nav.main = null;
            c.nav.message = null;
            c.nav.messageClose = null;
            c.nav.top.removeAttribute("style");
            c.nav.top.removeAttribute("class");
            c.nav.top.innerHTML = '';
            c.nav.top.dp = null;
            c.nav.top = null;
            DayPilot.ue(window, 'resize', c.$3H);
            DayPilotCalendar.unregister(c);
        };
        this.$3I = function() {
            var $n = document.getElementById(id);
            $n.dispose = this.dispose;
        };
        this.$3A = function($o) {
            $b.$3C($o.responseText);
        };
        this.$3x = function() {
            var h = {};
            h.v = this.v;
            h.control = "dpc";
            h.id = this.id;
            h.clientState = $b.clientState;
            h.columns = this.$3J();
            h.days = $b.days;
            h.startDate = $b.startDate;
            h.cellDuration = $b.cellDuration;
            h.cssOnly = $b.cssOnly;
            h.cssClassPrefix = $b.cssClassPrefix;
            h.heightSpec = $b.heightSpec;
            h.businessBeginsHour = $b.businessBeginsHour;
            h.businessEndsHour = $b.businessEndsHour;
            h.viewType = $b.viewType;
            h.dayBeginsHour = $b.dayBeginsHour;
            h.dayEndsHour = $b.dayEndsHour;
            h.headerLevels = $b.headerLevels;
            h.backColor = $b.cellBackColor;
            h.nonBusinessBackColor = $b.cellBackColorNonBusiness;
            h.eventHeaderVisible = $b.eventHeaderVisible;
            h.timeFormat = $b.timeFormat;
            h.timeHeaderCellDuration = $b.timeHeaderCellDuration;
            h.locale = $b.locale;
            h.showAllDayEvents = $b.showAllDayEvents;
            h.tagFields = $b.tagFields;
            h.hourNameBackColor = $b.hourNameBackColor;
            h.hourFontFamily = $b.hourFontFamily;
            h.hourFontSize = $b.hourFontSize;
            h.hourFontColor = $b.hourFontColor;
            h.selected = $b.multiselect.events();
            h.hashes = $b.hashes;
            return h;
        };
        this.$3K = function() {
            this.$3L();
            DayPilot.Areas.hideAll();
        };
        this.$3J = function() {
            var $p = [];
            $p.ignoreToJSON = true;
            if (!this.columns) {
                return $p;
            };
            for (var i = 0; i < this.columns.length; i++) {
                var $q = this.columns[i];
                var $r = this.$3M($q);
                $p.push($r);
            };
            return $p;
        };
        this.$3M = function($q) {
            var $r = {};
            $r.Value = $q.id;
            $r.Name = $q.name;
            $r.ToolTip = $q.toolTip;
            $r.Date = $q.start;
            $r.Children = this.$3N($q.children);
            return $r;
        };
        this.$3N = function($s) {
            var $t = [];
            $t.ignoreToJSON = true;
            if (!$s) {
                return $t;
            };
            for (var i = 0; i < $s.length; i++) {
                $t.push(this.$3M($s[i]));
            };
            return $t;
        };
        this.$3C = function($u, $v) {
            var $u = eval("(" + $u + ")");
            if ($u.BubbleGuid) {
                var $w = $u.BubbleGuid;
                var $x = this.bubbles[$w];
                delete this.bubbles[$w];
                $b.$3O();
                if (typeof $u.Result.BubbleHTML !== 'undefined') {
                    $x.updateView($u.Result.BubbleHTML, $x);
                };
                return;
            };
            if ($u.CallBackRedirect) {
                document.location.href = $u.CallBackRedirect;
                return;
            };
            if (typeof $u.ClientState !== 'undefined') {
                $b.clientState = $u.ClientState;
            };
            if ($u.UpdateType === "None") {
                $b.$3O();
                $b.$3P($u.CallBackData, true);
                if ($u.Message) {
                    $b.message($u.Message);
                };
                return;
            };
            if ($u.VsUpdate) {
                var $y = document.createElement("input");
                $y.type = 'hidden';
                $y.name = $b.id + "_vsupdate";
                $y.id = $y.name;
                $y.value = $u.VsUpdate;
                $b.nav.vsph.innerHTML = '';
                $b.nav.vsph.appendChild($y);
            };
            $b.$3E();
            $b.multiselect.clear(true);
            $b.multiselect.$3Q = $u.SelectedEvents;
            if (typeof $u.TagFields !== 'undefined') {
                $b.tagFields = $u.TagFields;
            };
            if (typeof $u.SortDirections !== 'undefined') {
                $b.sortDirections = $u.SortDirections;
            };
            if ($u.UpdateType === "Full") {
                $b.colors = $u.Colors;
                $b.palette = $u.Palette;
                $b.dirtyColors = $u.DirtyColors;
                $b.cellProperties = $u.CellProperties;
                $b.cellConfig = $u.CellConfig;
                $b.columns = $u.Columns;
                $b.days = $u.Days;
                $b.startDate = new DayPilot.Date($u.StartDate).getDatePart();
                $b.cellDuration = $u.CellDuration;
                $b.heightSpec = $u.HeightSpec ? $u.HeightSpec : $b.heightSpec;
                $b.businessBeginsHour = $u.BusinessBeginsHour ? $u.BusinessBeginsHour : $b.businessBeginsHour;
                $b.businessEndsHour = $u.BusinessEndsHour ? $u.BusinessEndsHour : $b.businessEndsHour;
                $b.viewType = $u.ViewType;
                $b.headerLevels = $u.HeaderLevels;
                $b.backColor = $u.BackColor ? $u.BackColor : $b.backColor;
                $b.nonBusinessBackColor = $u.NonBusinessBackColor ? $u.NonBusinessBackColor : $b.nonBusinessBackColor;
                $b.eventHeaderVisible = $u.EventHeaderVisible ? $u.EventHeaderVisible : $b.eventHeaderVisible;
                $b.timeFormat = $u.TimeFormat ? $u.TimeFormat : $b.timeFormat;
                $b.timeHeaderCellDuration = typeof $u.TimeHeaderCellDuration !== 'undefined' ? $u.TimeHeaderCellDuration : $b.timeHeaderCellDuration;
                $b.locale = $u.Locale ? $u.Locale : $b.locale;
                $b.dayBeginsHour = typeof $u.DayBeginsHour !== 'undefined' ? $u.DayBeginsHour : $b.dayBeginsHour;
                $b.dayEndsHour = typeof $u.DayEndsHour !== 'undefined' ? $u.DayEndsHour : $b.dayEndsHour;
                $b.cornerBackColor = $u.CornerBackColor;
                $b.cornerHtml = $u.CornerHTML;
                $b.hours = $u.Hours;
                $b.$3R();
                $b.$3S();
            };
            if ($u.Hashes) {
                for ($z in $u.Hashes) {
                    $b.hashes[$z] = $u.Hashes[$z];
                }
            };
            $b.$3T($u.Events);
            $b.$3U();
            if ($u.UpdateType === "Full" || $b.hideFreeCells) {
                $b.$3V();
                $b.$3W();
                $b.$3X();
                $b.$3Y();
                $b.$3Z();
                $b.$40();
                $b.$41();
                $b.$42();
                $b.clearSelection();
            };
            $b.$43();
            $b.$44();
            $b.$45();
            if ($b.timeRangeSelectedHandling !== "HoldForever") {
                $b.clearSelection();
            };
            $b.$46();
            if ($b.todo) {
                if ($b.todo.del) {
                    var $A = $b.todo.del;
                    $A.parentNode.removeChild($A);
                    $b.todo.del = null;
                }
            };
            $b.$3P($u.CallBackData, true);
            $b.$3O();
            $b.$47();
            if ($u.Message) {
                $b.message($u.Message);
            }
        };
        this.$3P = function($g, $B) {
            var $C = function($g, $D) {
                return function() {
                    if ($b.$48()) {
                        if (typeof $b.onAfterRender === 'function') {
                            var $m = {};
                            $m.isCallBack = $D;
                            $m.data = $g;
                            $b.onAfterRender($m);
                        }
                    } else {
                        if ($b.afterRender) {
                            $b.afterRender($g, $D);
                        }
                    }
                };
            };
            window.setTimeout($C($g, $B), 0);
        };
        this.$49 = function($E, $F, $k) {
            var $G = $b.nav.events;
            var $H = $G.clientWidth / $G.rows[0].cells.length;
            var i = Math.floor($b.coords.x / $H);
            if (i < 0) {
                i = 0;
            };
            if ($b.rtl) {
                i = $b.columnsBottom.length - i - 1;
            };
            var $q = $G.rows[0].cells[i];
            var $I = 0;
            if (typeof $E.duration !== 'undefined') {
                var $J = $E.duration;
                var top = Math.floor((($b.coords.y - $I) + $b.cellHeight / 2) / $b.cellHeight) * $b.cellHeight + $I;
                var $K = $J * $b.cellHeight / (60 * $b.cellDuration);
            } else {
                var e = $E.event;
                var $K = e.part.height;
                var top = e.part.top;
            };
            var $L = document.createElement('div');
            $L.setAttribute('unselectable', 'on');
            $L.style.position = 'absolute';
            $L.style.width = '100%';
            $L.style.height = $K + 'px';
            $L.style.left = '0px';
            $L.style.top = top + 'px';
            $L.style.zIndex = 101;
            $L.exclude = true;
            var $M = document.createElement("div");
            $L.appendChild($M);
            if (this.cssOnly) {
                $L.className = $b.$4a("_shadow");
                $M.className = this.$4a("_shadow_inner");
            };
            if (!this.cssOnly) {
                $M.style.position = "absolute";
                $M.style.top = "0px";
                $M.style.bottom = "0px";
                $M.style.left = "0px";
                $M.style.right = "0px";
                if ($k === 'Fill') {
                    $M.style.backgroundColor = "#aaaaaa";
                    $M.style.opacity = 0.5;
                    $M.style.filter = "alpha(opacity=50)";
                    $M.style.border = '2px solid #aaaaaa';
                } else {
                    $M.style.border = '2px dotted #666666';
                };
                if (this.roundedCorners) {
                    $M.style.MozBorderRadius = "5px";
                    $M.style.webkitBorderRadius = "5px";
                    $M.style.borderRadius = "5px";
                }
            };
            $q.firstChild.appendChild($L);
            return $L;
        };
        this.$4b = function() {
            return this.$4c() / (3600 * 1000);
        };
        this.$4d = function() {
            if (this.businessBeginsHour > this.businessEndsHour) {
                return 24 - this.businessBeginsHour + this.businessEndsHour;
            } else {
                return this.businessEndsHour - this.businessBeginsHour;
            }
        };
        this.$4e = function() {
            if (this.dayBeginsHour >= this.dayEndsHour) {
                return 24 - this.dayBeginsHour + this.dayEndsHour;
            } else {
                return this.dayEndsHour - this.dayBeginsHour;
            }
        };
        this.$4c = function($N) {
            var $O = 0;
            if (this.heightSpec === 'BusinessHoursNoScroll') {
                $O = this.$4d();
            } else if (this.hideFreeCells && !$N) {
                var $P = (this.maxEnd - 1) * this.cellDuration / this.cellHeight;
                var $Q = Math.ceil($P / 60);
                $O = Math.max(this.dayBeginsHour + $Q, this.businessEndsHour) - this.$4f();
            } else {
                $O = this.$4e();
            };
            return $O * 60 * 60 * 1000;
        };
        this.message = function($R, $S, $T, $U) {
            if (!$R) {
                return;
            };
            var $S = $S || this.messageHideAfter || 2000;
            var $T = $T || "#ffffff";
            var $U = $U || "#000000";
            var $V = 0.8;
            var $c;
            var top = this.$4g();
            var $W = this.showHours ? this.hourWidth : 0;
            var $X = DayPilot.sw($b.nav.scroll);
            if (!this.cssOnly) {
                top += 1;
                $W += 2;
                $X -= 2;
            };
            if ($b.rtl) {
                var $Y = $W;
                $W = $X;
                $X = $Y;
            };
            if (!this.nav.message) {
                $c = document.createElement("div");
                $c.style.position = "absolute";
                $c.style.left = ($W) + "px";
                $c.style.top = (top) + "px";
                $c.style.right = "0px";
                $c.style.display = 'none';
                $c.onmousemove = function() {
                    if ($b.messageTimeout) {
                        clearTimeout($b.messageTimeout);
                    }
                };
                $c.onmouseout = function() {
                    if ($b.nav.message.style.display !== 'none') {
                        $b.messageTimeout = setTimeout($b.$4h, 500);
                    }
                };
                var $M = document.createElement("div");
                $M.onclick = function() {
                    $b.nav.message.style.display = 'none';
                };
                if (!this.cssOnly) {
                    $M.style.padding = "5px";
                    $M.style.opacity = $V;
                    $M.style.filter = "alpha(opacity=" + ($V * 100) + ")";
                } else {
                    $M.className = this.$4a("_message");
                };
                $c.appendChild($M);
                var close = document.createElement("div");
                close.style.position = "absolute";
                if (!this.cssOnly) {
                    close.style.top = "5px";
                    close.style.right = (DayPilot.sw($b.nav.scroll) + 5) + "px";
                    close.style.color = $T;
                    close.style.lineHeight = "100%";
                    close.style.cursor = "pointer";
                    close.style.fontWeight = "bold";
                    close.innerHTML = "X";
                } else {
                    close.className = this.$4a("_message_close");
                };
                close.onclick = function() {
                    $b.nav.message.style.display = 'none';
                };
                $c.appendChild(close);
                this.nav.top.insertBefore($c, this.nav.loading);
                this.nav.message = $c;
                this.nav.messageClose = close;
            } else {
                this.nav.message.style.top = top + "px";
            };
            if (this.nav.cornerRight) {
                this.nav.message.style.right = $X + "px";
            } else {
                this.nav.message.style.right = "0px";
            };
            var $Z = function() {
                var $M = $b.nav.message.firstChild;
                if (!$b.cssOnly) {
                    $M.style.padding = "5px";
                    $M.style.opacity = $V;
                    $M.style.backgroundColor = $U;
                    $M.style.color = $T;
                };
                $M.innerHTML = $R;
                var end = function() {
                    $b.messageTimeout = setTimeout($b.$4h, $S);
                };
                DayPilot.fade($b.nav.message, 0.2, end);
            };
            clearTimeout($b.messageTimeout);
            if (this.nav.message.style.display !== 'none') {
                DayPilot.fade($b.nav.message, -0.2, $Z);
            } else {
                $Z();
            }
        };
        this.message.show = function($R) {
            $b.message($R);
        };
        this.message.hide = function() {
            $b.$4h();
        };
        this.$4h = function() {
            var end = function() {
                $b.nav.message.style.display = 'none';
            };
            DayPilot.fade($b.nav.message, -0.2, end);
        };
        this.$3Y = function() {
            if (this.nav.message) {
                this.nav.message.style.top = (this.$4g()) + "px";
            }
        };
        this.$4i = function() {
            return this.$4c() / (60 * 1000 * this.cellDuration);
        };
        this.eventClickPostBack = function(e, $g) {
            this.$3w('EventClick', $g, e);
        };
        this.eventClickCallBack = function(e, $g) {
            this.$3y('EventClick', e, $g);
        };
        this.$4j = function(e) {
            var $c = this;
            var e = e || window.event;
            var $00 = e.ctrlKey;
            if (typeof(DayPilot.Bubble) !== 'undefined') {
                DayPilot.Bubble.hideActive();
            };
            if ($b.eventDoubleClickHandling === 'Disabled') {
                $b.$4k($c, $00);
                return;
            };
            if (!$b.timeouts) {
                $b.timeouts = [];
            } else {
                for (var $01 in $b.timeouts) {
                    window.clearTimeout($b.timeouts[$01]);
                };
                $b.timeouts = [];
            };
            var $02 = function($c, $00) {
                return function() {
                    $b.$4k($c, $00);
                };
            };
            $b.timeouts.push(window.setTimeout($02(this, $00), $b.doubleClickTimeout));
        };
        this.$4k = function($03, $00) {
            var e = $03.event;
            if (!e.client.clickEnabled()) {
                return;
            };
            if ($b.$48()) {
                var $m = {};
                $m.e = e;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventClick === 'function') {
                    $b.onEventClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventClickHandling) {
                    case 'PostBack':
                        $b.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventClick(e);
                        break;
                    case 'Edit':
                        if (!e.allday()) {
                            $b.$4l($03);
                        };
                        break;
                    case 'Select':
                        if (!e.allday()) {
                            $b.$4m($03, e, $00);
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                    case 'ContextMenu':
                        var $04 = e.client.contextMenu();
                        if ($04) {
                            $04.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(e);
                            }
                        };
                        break;
                };
                if (typeof $b.onEventClicked === 'function') {
                    $b.onEventClicked($m);
                }
            } else {
                switch ($b.eventClickHandling) {
                    case 'PostBack':
                        $b.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventClick(e);
                        break;
                    case 'Edit':
                        if (!e.allday()) {
                            $b.$4l($03);
                        };
                        break;
                    case 'Select':
                        if (!e.allday()) {
                            $b.$4m($03, e, $00);
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                    case 'ContextMenu':
                        var $04 = e.client.contextMenu();
                        if ($04) {
                            $04.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(e);
                            }
                        };
                        break;
                }
            }
        };
        this.eventDoubleClickPostBack = function(e, $g) {
            this.$3w('EventDoubleClick', $g, e);
        };
        this.eventDoubleClickCallBack = function(e, $g) {
            this.$3y('EventDoubleClick', e, $g);
        };
        this.$4n = function(ev) {
            if (typeof(DayPilotBubble) !== 'undefined') {
                DayPilotBubble.hideActive();
            };
            if ($b.timeouts) {
                for (var $01 in $b.timeouts) {
                    window.clearTimeout($b.timeouts[$01]);
                };
                $b.timeouts = null;
            };
            var e = this.event;
            var ev = ev || window.event;
            if ($b.$48()) {
                var $m = {};
                $m.e = e;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventDoubleClick === 'function') {
                    $b.onEventDoubleClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventDoubleClickHandling) {
                    case 'PostBack':
                        $b.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventDoubleClickCallBack(e);
                        break;
                    case 'Edit':
                        if (!e.allday()) {
                            $b.$4l(this);
                        };
                        break;
                    case 'Select':
                        if (!e.allday()) {
                            $b.$4m(this, e, ev.ctrlKey);
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $b.onEventDoubleClicked === 'function') {
                    $b.onEventDoubleClicked($m);
                }
            } else {
                switch ($b.eventDoubleClickHandling) {
                    case 'PostBack':
                        $b.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventDoubleClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventDoubleClick(e);
                        break;
                    case 'Edit':
                        if (!e.allday()) {
                            $b.$4l(this);
                        };
                        break;
                    case 'Select':
                        if (!e.allday()) {
                            $b.$4m(this, e, ev.ctrlKey);
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                }
            }
        };
        this.eventRightClickPostBack = function(e, $g) {
            this.$3w('EventRightClick', $g, e);
        };
        this.eventRightClickCallBack = function(e, $g) {
            this.$3y('EventRightClick', e, $g);
        };
        this.$4o = function() {
            var e = this.event;
            if (!e.client.rightClickEnabled()) {
                return false;
            };
            if ($b.$48()) {
                var $m = {};
                $m.e = e;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventRightClick === 'function') {
                    $b.onEventRightClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventRightClickHandling) {
                    case 'PostBack':
                        $b.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventRightClickCallBack(e);
                        break;
                    case 'ContextMenu':
                        var $04 = e.client.contextMenu();
                        if ($04) {
                            $04.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(this.event);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $b.onEventRightClicked === 'function') {
                    $b.onEventRightClicked($m);
                }
            } else {
                switch ($b.eventRightClickHandling) {
                    case 'PostBack':
                        $b.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventRightClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventRightClick(e);
                        break;
                    case 'ContextMenu':
                        var $04 = e.client.contextMenu();
                        if ($04) {
                            $04.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(this.event);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                }
            };
            return false;
        };
        this.headerClickPostBack = function(c, $g) {
            this.$3w('HeaderClick', $g, c);
        };
        this.headerClickCallBack = function(c, $g) {
            this.$3y('HeaderClick', c, $g);
        };
        this.$4p = function($E) {
            var $g = this.data;
            var c = new DayPilotCalendar.Column($g.id, $g.name, $g.start);
            if ($b.$48()) {
                var $m = {};
                $m.header = {};
                $m.header.id = $g.id;
                $m.header.name = $g.name;
                $m.header.start = $g.start;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onHeaderClick === 'function') {
                    $b.onHeaderClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.headerClickHandling) {
                    case 'PostBack':
                        $b.headerClickPostBack(c);
                        break;
                    case 'CallBack':
                        $b.headerClickCallBack(c);
                        break;
                };
                if (typeof $b.onHeaderClicked === 'function') {
                    $b.onHeaderClicked($m);
                }
            } else {
                switch ($b.headerClickHandling) {
                    case 'PostBack':
                        $b.headerClickPostBack(c);
                        break;
                    case 'CallBack':
                        $b.headerClickCallBack(c);
                        break;
                    case 'JavaScript':
                        $b.onHeaderClick(c);
                        break;
                }
            }
        };
        this.$4q = function() {
            if (typeof(DayPilotBubble) !== 'undefined' && $b.columnBubble) {
                if ($b.viewType === "Resources") {
                    var $05 = {};
                    $05.calendar = $b;
                    $05.id = this.data.id;
                    $05.toJSON = function() {
                        var $06 = {};
                        $06.id = this.id;
                        return $06;
                    };
                    $b.columnBubble.showResource($05);
                } else {
                    var $07 = new DayPilot.Date(this.data.start);
                    var end = $07.addDays(1);
                    var $08 = {};
                    $08.calendar = $b;
                    $08.start = $07;
                    $08.end = end;
                    $08.toJSON = function() {
                        var $06 = {};
                        $06.start = this.start;
                        $06.end = this.end;
                        return $06;
                    };
                    $b.columnBubble.showTime($08);
                }
            };
            var $e = this;
            var $c = $e.firstChild;
            if (!$c.active) {
                var $g = $e.data;
                var c = new DayPilotCalendar.Column($g.id, $g.name, $g.start);
                c.areas = $e.data.areas;
                DayPilot.Areas.showAreas($c, c);
            }
        };
        this.$4r = function(ev) {
            if (typeof(DayPilotBubble) !== 'undefined' && $b.columnBubble) {
                $b.columnBubble.hideOnMouseOut();
            };
            DayPilot.Areas.hideAreas(this.firstChild, ev);
        };
        this.eventDeletePostBack = function(e, $g) {
            this.$3w('EventDelete', $g, e);
        };
        this.eventDeleteCallBack = function(e, $g) {
            this.$3y('EventDelete', e, $g);
        };
        this.$4s = function($E) {
            var e = $E.parentNode.parentNode.event;
            if ($b.$48()) {
                var $m = {};
                $m.e = e;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventDelete === 'function') {
                    $b.onEventDelete($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventDeleteHandling) {
                    case 'PostBack':
                        $b.eventDeletePostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventDeleteCallBack(e);
                        break;
                };
                if (typeof $b.onEventDeleted === 'function') {
                    $b.onEventDeleted($m);
                }
            } else {
                switch ($b.eventDeleteHandling) {
                    case 'PostBack':
                        $b.eventDeletePostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventDeleteCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventDelete(e);
                        break;
                }
            }
        };
        this.eventResizePostBack = function(e, $09, $0a, $g) {
            if (!$09) {
                throw 'newStart is null';
            };
            if (!$0a) {
                throw 'newEnd is null';
            };
            var $0b = {};
            $0b.e = e;
            $0b.newStart = $09;
            $0b.newEnd = $0a;
            this.$3w('EventResize', $g, $0b);
        };
        this.eventResizeCallBack = function(e, $09, $0a, $g) {
            if (!$09) throw 'newStart is null';
            if (!$0a) throw 'newEnd is null';
            var $0b = {};
            $0b.e = e;
            $0b.newStart = $09;
            $0b.newEnd = $0a;
            this.$3y('EventResize', $0b, $g);
        };
        this.$4t = function($k, $f, $0b, $g) {
            if ($k === 'PostBack') {
                $b.postBack2($f, $0b, $g);
            } else if ($k === 'CallBack') {
                $b.$3y($f, $0b, $g, "CallBack");
            } else if ($k === 'Immediate') {
                $b.$3y($f, $0b, $g, "Notify");
            } else if ($k === 'Queue') {
                $b.queue.add(new DayPilot.Action(this, $f, $0b, $g));
            } else if ($k === 'Notify') {
                if ($0c.notifyType() === 'Notify') {
                    $b.$3y($f, $0b, $g, "Notify");
                } else {
                    $b.queue.add(new DayPilot.Action($b, $f, $0b, $g));
                }
            } else {
                throw "Invalid event invocation type";
            }
        };
        this.$4f = function($N) {
            if (this.heightSpec === 'BusinessHoursNoScroll') {
                return this.businessBeginsHour;
            } else if (this.hideFreeCells && !$N) {
                var $P = (this.minStart - 1) * this.cellDuration / this.cellHeight;
                var $Q = Math.floor($P / 60);
                return Math.min(this.dayBeginsHour + $Q, this.businessBeginsHour);
            } else {
                return this.dayBeginsHour;
            }
        };
        this.$48 = function() {
            return $b.api === 2;
        };
        this.$4u = function(e, $0d, $0e, $0f) {
            if (this.eventResizeHandling === 'Disabled') {
                return;
            };
            var $I = 0;
            var $09 = new Date();
            var $0a = new Date();
            var $07 = e.start();
            var end = e.end();
            var $0g = $b.cellDuration;
            if ($0f === 'top') {
                var $0h = $07.getDatePart();
                var $0i = Math.floor(($0e - $I) / $b.cellHeight);
                var $0j = $0i * $0g;
                var ts = $0j * 60 * 1000;
                var $0k = $b.$4f() * 60 * 60 * 1000;
                $09 = $0h.addTime(ts + $0k);
                $0a = e.end();
            } else if ($0f === 'bottom') {
                var $0h = end.getDatePart();
                var $0i = Math.floor(($0e + $0d - $I) / $b.cellHeight);
                var $0j = $0i * $0g;
                var ts = $0j * 60 * 1000;
                var $0k = $b.$4f() * 60 * 60 * 1000;
                $09 = $07;
                $0a = $0h.addTime(ts + $0k);
            };
            if ($b.$48()) {
                var $m = {};
                $m.e = e;
                $m.newStart = $09;
                $m.newEnd = $0a;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventResize === 'function') {
                    $b.onEventResize($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventResizeHandling) {
                    case 'PostBack':
                        $b.eventResizePostBack(e, $09, $0a);
                        break;
                    case 'CallBack':
                        $b.eventResizeCallBack(e, $09, $0a);
                        break;
                    case 'Notify':
                        $b.eventResizeNotify(e, $09, $0a);
                        break;
                    case 'Update':
                        e.start($09);
                        e.end($0a);
                        $b.events.update(e);
                        break;
                };
                if (typeof $b.onEventResized === 'function') {
                    $b.onEventResized($m);
                }
            } else {
                switch ($b.eventResizeHandling) {
                    case 'PostBack':
                        $b.eventResizePostBack(e, $09, $0a);
                        break;
                    case 'CallBack':
                        $b.eventResizeCallBack(e, $09, $0a);
                        break;
                    case 'JavaScript':
                        $b.onEventResize(e, $09, $0a);
                        break;
                    case 'Notify':
                        $b.eventResizeNotify(e, $09, $0a);
                        break;
                }
            }
        };
        this.eventResizeNotify = function(e, $09, $0a, $g) {
            var $0l = new DayPilot.Event(e.copy(), this);
            e.start($09);
            e.end($0a);
            e.commit();
            $b.update();
            this.$4v("Notify", $0l, $09, $0a, $g);
        };
        this.$4v = function($k, e, $09, $0a, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.newStart = $09;
            $0b.newEnd = $0a;
            this.$4t($k, "EventResize", $0b, $g);
        };
        this.eventMovePostBack = function(e, $09, $0a, $0m, $g) {
            if (!$09) throw 'newStart is null';
            if (!$0a) throw 'newEnd is null';
            var $0b = {};
            $0b.e = e;
            $0b.newStart = $09;
            $0b.newEnd = $0a;
            $0b.newResource = $0m;
            this.$3w('EventMove', $g, $0b);
        };
        this.eventMoveCallBack = function(e, $09, $0a, $0m, $g) {
            if (!$09) throw 'newStart is null';
            if (!$0a) throw 'newEnd is null';
            var $0b = {};
            $0b.e = e;
            $0b.newStart = $09;
            $0b.newEnd = $0a;
            $0b.newResource = $0m;
            this.$3y('EventMove', $0b, $g);
        };
        this.$4w = function(e, $0n, $0e, ev, $0o) {
            if ($b.eventMoveHandling === 'Disabled') {
                return;
            };
            var $I = 0;
            var $0i = Math.floor(($0e - $I) / $b.cellHeight);
            var $0g = $b.cellDuration;
            var $0p = $0i * $0g * 60 * 1000;
            var $07 = e.start();
            var end = e.end();
            var $0h = new Date();
            if ($07.isDayPilotDate) {
                $07 = $07.d;
            };
            $0h.setTime(Date.UTC($07.getUTCFullYear(), $07.getUTCMonth(), $07.getUTCDate()));
            var $0q = ($b.useEventBoxes !== 'Never') ? $07.getTime() - ($0h.getTime() + $07.getUTCHours() * 3600 * 1000 + Math.floor($07.getUTCMinutes() / $0g) * $0g * 60 * 1000) : 0;
            var length = end.getTime() - $07.getTime();
            var $0k = $b.$4f() * 3600 * 1000;
            var $0r = this.columnsBottom[$0n];
            var $0s = $0r.start.getTime();
            var $0t = new Date();
            $0t.setTime($0s + $0p + $0q + $0k);
            var $09 = new DayPilot.Date($0t);
            var $0a = $09.addTime(length);
            var external = !!$0o;
            var $0m = $0r.id;
            if ($b.$48()) {
                var $m = {};
                $m.e = e;
                $m.newStart = $09;
                $m.newEnd = $0a;
                $m.newResource = $0m;
                $m.external = external;
                $m.ctrl = false;
                if (ev) {
                    $m.ctrl = ev.ctrlKey;
                };
                $m.shift = false;
                if (ev) {
                    $m.shift = ev.shiftKey;
                };
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventMove === 'function') {
                    $b.onEventMove($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventMoveHandling) {
                    case 'PostBack':
                        $b.eventMovePostBack(e, $09, $0a, $0m);
                        break;
                    case 'CallBack':
                        $b.eventMoveCallBack(e, $09, $0a, $0m);
                        break;
                    case 'Notify':
                        $b.eventMoveNotify(e, $09, $0a, $0m);
                        break;
                    case 'Update':
                        e.start($09);
                        e.end($0a);
                        e.resource($0m);
                        $b.events.update(e);
                        break;
                };
                if (typeof $b.onEventMoved === 'function') {
                    $b.onEventMoved($m);
                }
            } else {
                switch ($b.eventMoveHandling) {
                    case 'PostBack':
                        $b.eventMovePostBack(e, $09, $0a, $0m);
                        break;
                    case 'CallBack':
                        $b.eventMoveCallBack(e, $09, $0a, $0m);
                        break;
                    case 'JavaScript':
                        $b.onEventMove(e, $09, $0a, $0m, external, ev ? ev.ctrlKey : false, ev ? ev.shiftKey : false);
                        break;
                    case 'Notify':
                        $b.eventMoveNotify(e, $09, $0a, $0m, null);
                        break;
                }
            }
        };
        this.eventMoveNotify = function(e, $09, $0a, $0m, $g) {
            var $0l = new DayPilot.Event(e.copy(), this);
            e.start($09);
            e.end($0a);
            e.resource($0m);
            e.commit();
            $b.update();
            this.$4x("Notify", $0l, $09, $0a, $0m, $g);
        };
        this.$4x = function($k, e, $09, $0a, $0m, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.newStart = $09;
            $0b.newEnd = $0a;
            $0b.newResource = $0m;
            this.$4t($k, "EventMove", $0b, $g);
        };
        this.$4y = function($m, $x) {
            var $w = $b.$4z($x);
            var $0b = {};
            $0b.args = $m;
            $0b.guid = $w;
            $b.$3y("Bubble", $0b);
        };
        this.$4z = function($x) {
            var $w = DayPilot.guid();
            if (!this.bubbles) {
                this.bubbles = [];
            };
            this.bubbles[$w] = $x;
            return $w;
        };
        this.eventMenuClickPostBack = function(e, $0u, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.command = $0u;
            this.$3w('EventMenuClick', $g, $0b);
        };
        this.eventMenuClickCallBack = function(e, $0u, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.command = $0u;
            this.$3y('EventMenuClick', $0b, $g);
        };
        this.$4A = function($0u, e, $0v) {
            switch ($0v) {
                case 'PostBack':
                    $b.eventMenuClickPostBack(e, $0u);
                    break;
                case 'CallBack':
                    $b.eventMenuClickCallBack(e, $0u);
                    break;
            }
        };
        this.timeRangeMenuClickPostBack = function(e, $0u, $g) {
            var $0b = {};
            $0b.selection = e;
            $0b.command = $0u;
            this.$3w("TimeRangeMenuClick", $g, $0b);
        };
        this.timeRangeMenuClickCallBack = function(e, $0u, $g) {
            var $0b = {};
            $0b.selection = e;
            $0b.command = $0u;
            this.$3y("TimeRangeMenuClick", $0b, $g);
        };
        this.$4B = function($0u, e, $0v) {
            switch ($0v) {
                case 'PostBack':
                    $b.timeRangeMenuClickPostBack(e, $0u);
                    break;
                case 'CallBack':
                    $b.timeRangeMenuClickCallBack(e, $0u);
                    break;
            }
        };
        this.timeRangeSelectedPostBack = function($07, end, $0w, $g) {
            var $0x = {};
            $0x.start = $07;
            $0x.end = end;
            $0x.resource = $0w;
            this.$3w('TimeRangeSelected', $g, $0x);
        };
        this.timeRangeSelectedCallBack = function($07, end, $0w, $g) {
            var $0x = {};
            $0x.start = $07;
            $0x.end = end;
            $0x.resource = $0w;
            this.$3y('TimeRangeSelected', $0x, $g);
        };
        this.$4C = function($07, end, $q) {
            if (!$07.isDayPilotDate) {
                $07 = new DayPilot.Date($07);
            };
            if (!end.isDayPilotDate) {
                end = new DayPilot.Date(end);
            };
            var $0w = $q;
            if ($b.$48()) {
                var $m = {};
                $m.start = $07;
                $m.end = end;
                $m.resource = $0w;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onTimeRangeSelect === 'function') {
                    $b.onTimeRangeSelect($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $b.timeRangeSelectedPostBack($07, end, $0w);
                        break;
                    case 'CallBack':
                        $b.timeRangeSelectedCallBack($07, end, $0w);
                        break;
                };
                if (typeof $b.onTimeRangeSelected === 'function') {
                    $b.onTimeRangeSelected($m);
                }
            } else {
                switch ($b.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $b.timeRangeSelectedPostBack($07, end, $q);
                        break;
                    case 'CallBack':
                        $b.timeRangeSelectedCallBack($07, end, $q);
                        break;
                    case 'JavaScript':
                        $b.onTimeRangeSelected($07, end, $q);
                        break;
                }
            }
        };
        this.timeRangeDoubleClickPostBack = function($07, end, $q, $g) {
            var $0x = {};
            $0x.start = $07;
            $0x.end = end;
            $0x.resource = $q;
            this.$3w('TimeRangeDoubleClick', $g, $0x);
        };
        this.timeRangeDoubleClickCallBack = function($07, end, $q, $g) {
            var $0x = {};
            $0x.start = $07;
            $0x.end = end;
            $0x.resource = $q;
            this.$3y('TimeRangeDoubleClick', $0x, $g);
        };
        this.$4D = function($07, end, $q) {
            if ($b.$48()) {
                var $0w = $q;
                var $m = {};
                $m.start = $07;
                $m.end = end;
                $m.resource = $0w;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onTimeRangeDoubleClick === 'function') {
                    $b.onTimeRangeDoubleClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        $b.timeRangeDoubleClickPostBack($07, end, $0w);
                        break;
                    case 'CallBack':
                        $b.timeRangeDoubleClickCallBack($07, end, $0w);
                        break;
                };
                if (typeof $b.onTimeRangeDoubleClicked === 'function') {
                    $b.onTimeRangeDoubleClicked($m);
                }
            } else {
                switch ($b.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        $b.timeRangeDoubleClickPostBack($07, end, $q);
                        break;
                    case 'CallBack':
                        $b.timeRangeDoubleClickCallBack($07, end, $q);
                        break;
                    case 'JavaScript':
                        $b.onTimeRangeDoubleClick($07, end, $q);
                        break;
                }
            }
        };
        this.eventEditPostBack = function(e, $0y, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.newText = $0y;
            this.$3w("EventEdit", $g, $0b);
        };
        this.eventEditCallBack = function(e, $0y, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.newText = $0y;
            this.$3y("EventEdit", $0b, $g);
        };
        this.$4E = function(e, $0y) {
            if ($b.$48()) {
                var $m = {};
                $m.e = e;
                $m.newText = $0y;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventEdit === 'function') {
                    $b.onEventEdit($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventEditHandling) {
                    case 'PostBack':
                        $b.eventEditPostBack(e, $0y);
                        break;
                    case 'CallBack':
                        $b.eventEditCallBack(e, $0y);
                        break;
                    case 'Update':
                        e.text($0y);
                        $b.events.update(e);
                        break;
                };
                if (typeof $b.onEventEdited === 'function') {
                    $b.onEventEdited($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                }
            } else {
                switch ($b.eventEditHandling) {
                    case 'PostBack':
                        $b.eventEditPostBack(e, $0y);
                        break;
                    case 'CallBack':
                        $b.eventEditCallBack(e, $0y);
                        break;
                    case 'JavaScript':
                        $b.onEventEdit(e, $0y);
                        break;
                }
            }
        };
        this.eventSelectPostBack = function(e, $0z, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.change = $0z;
            this.$3w('EventSelect', $g, $0b);
        };
        this.eventSelectCallBack = function(e, $0z, $g) {
            var $0b = {};
            $0b.e = e;
            $0b.change = $0z;
            this.$3y('EventSelect', $0b, $g);
        };
        this.$4F = function($c, e, $00) {
            if ($b.$48()) {
                var m = $b.multiselect;
                m.previous = m.events();
                var $m = {};
                $m.e = e;
                $m.selected = m.isSelected(e);
                $m.ctrl = $00;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventSelect === 'function') {
                    $b.onEventSelect($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventSelectHandling) {
                    case 'PostBack':
                        $b.eventSelectPostBack(e, $0z);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            __theFormPostData = "";
                            __theFormPostCollection = [];
                            WebForm_InitCallback();
                        };
                        $b.eventSelectCallBack(e, $0z);
                        break;
                    case 'Update':
                        m.$4G($c, $00);
                        break;
                };
                if (typeof $b.onEventSelected === 'function') {
                    $m.change = m.isSelected(e) ? "selected" : "deselected";
                    $m.selected = m.isSelected(e);
                    $b.onEventSelected($m);
                }
            } else {
                var m = $b.multiselect;
                m.previous = m.events();
                m.$4G($c, $00);
                var $0z = m.isSelected(e) ? "selected" : "deselected";
                switch ($b.eventSelectHandling) {
                    case 'PostBack':
                        $b.eventSelectPostBack(e, $0z);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            __theFormPostData = "";
                            __theFormPostCollection = [];
                            WebForm_InitCallback();
                        };
                        $b.eventSelectCallBack(e, $0z);
                        break;
                    case 'JavaScript':
                        $b.onEventSelect(e, $0z);
                        break;
                }
            }
        };
        this.commandCallBack = function($0u, $g) {
            this.$3D();
            var $0b = {};
            $0b.command = $0u;
            this.$3y('Command', $0b, $g);
        };
        this.$4H = function(ev) {
            clearTimeout(DayPilotCalendar.selectedTimeout);
            if (DayPilotCalendar.selecting) {
                return;
            };
            if (DayPilotCalendar.editing) {
                DayPilotCalendar.editing.blur();
                return;
            };
            if ($b.selectedCells && $b.timeRangeDoubleClickHandling !== 'Disabled') {
                for (var i = 0; i < $b.selectedCells.length; i++) {
                    if (this === $b.selectedCells[i]) {
                        return;
                    }
                }
            };
            if ($b.timeRangeSelectedHandling === "Disabled") {
                return;
            };
            var $0A = (window.event) ? window.event.button : ev.which;
            if ($0A !== 1 && $0A !== 0) {
                return;
            };
            DayPilotCalendar.firstMousePos = DayPilot.mc(ev || window.event);
            $b.clearSelection();
            DayPilotCalendar.topSelectedCell = this;
            DayPilotCalendar.bottomSelectedCell = this;
            DayPilotCalendar.column = DayPilotCalendar.getColumn(this);
            $b.selectedCells.push(this);
            DayPilotCalendar.firstSelected = this;
        };
        this.$4I = function() {
            if (!this.selectedCells) {
                return;
            };
            var $0B = this.getSelection();
            if (!$0B) {
                return;
            };
            for (var j = 0; j < $b.selectedCells.length; j++) {
                var $e = $b.selectedCells[j];
                if ($e && !$e.selected) {
                    var $c = document.createElement("div");
                    $c.style.height = ($b.cellHeight - 1) + "px";
                    $c.style.backgroundColor = $b.selectedColor;
                    $e.firstChild.style.display = "none";
                    $e.insertBefore($c, $e.firstChild);
                    $e.selected = $c;
                }
            }
        };
        this.$4J = function(ev) {
            if (typeof(DayPilotBubble) !== 'undefined' && $b.cellBubble) {
                $b.cellBubble.hideOnMouseOut();
            }
        };
        this.$4K = function(ev) {
            if (typeof(DayPilotCalendar) === 'undefined') {
                return;
            };
            if (typeof(DayPilotBubble) !== 'undefined' && $b.cellBubble) {
                var $q = DayPilotCalendar.getColumn(this);
                var $05 = $b.columnsBottom[$q].id;
                var $e = {};
                $e.calendar = $b;
                $e.start = this.start;
                $e.end = this.end;
                $e.resource = $05;
                $e.toJSON = function() {
                    var $06 = {};
                    $06.start = this.start;
                    $06.end = this.end;
                    $06.resource = this.resource;
                    return $06;
                };
                $b.cellBubble.showCell($e);
            };
            if (DayPilotCalendar.firstMousePos) {
                var $0C = DayPilotCalendar.firstMousePos;
                var $0D = DayPilot.mc(ev || window.event);
                if ($0C.x !== $0D.x || $0C.y !== $0D.y) {
                    DayPilotCalendar.selecting = true;
                    $b.clearSelection();
                    $b.$4I();
                }
            };
            if (!DayPilotCalendar.selecting) {
                return;
            };
            var $0E = DayPilot.mc(ev || window.event);
            var $0F = DayPilotCalendar.getColumn(this);
            if ($0F !== DayPilotCalendar.column) {
                return;
            };
            $b.clearSelection();
            if ($0E.y < DayPilotCalendar.firstMousePos.y) {
                $b.selectedCells = DayPilotCalendar.getCellsBelow(this);
                DayPilotCalendar.topSelectedCell = $b.selectedCells[0];
                DayPilotCalendar.bottomSelectedCell = DayPilotCalendar.firstSelected;
            } else {
                $b.selectedCells = DayPilotCalendar.getCellsAbove(this);
                DayPilotCalendar.topSelectedCell = DayPilotCalendar.firstSelected;
                DayPilotCalendar.bottomSelectedCell = $b.selectedCells[0];
            };
            $b.$4I();
        };
        this.getSelection = function() {
            if (!DayPilotCalendar.topSelectedCell) {
                return null;
            };
            if (!DayPilotCalendar.bottomSelectedCell) {
                return null;
            };
            var $07 = DayPilotCalendar.topSelectedCell.start;
            var end = DayPilotCalendar.bottomSelectedCell.end;
            var $0G = DayPilotCalendar.topSelectedCell.resource;
            return new DayPilot.Selection($07, end, $0G, $b);
        };
        this.$4L = function(ev) {
            if (DayPilotCalendar.firstMousePos) {
                var $0H = function() {
                    DayPilotCalendar.selecting = true;
                    $b.$4I();
                    DayPilotCalendar.firstMousePos = null;
                    DayPilotCalendar.selecting = false;
                    var $0I = $b.getSelection();
                    $b.$4C($0I.start, $0I.end, $0I.resource);
                };
                if (DayPilotCalendar.selecting && DayPilotCalendar.topSelectedCell !== null) {
                    $0H();
                } else {
                    DayPilotCalendar.selectedTimeout = setTimeout($0H, 100);
                }
            } else {
                DayPilotCalendar.selecting = false;
            }
        };
        this.$4M = function(ev) {
            if (!$b.initScrollPos) {
                return;
            };
            $b.scrollPos = $b.nav.scroll.scrollTop;
            $b.scrollHeight = $b.nav.scroll.clientHeight;
            $b.nav.scrollpos.value = $b.scrollPos;
            $b.$46();
        };
        this.$46 = function() {
            if (!this.scrollLabelsVisible) {
                return;
            };
            if (!this.scrollLabels) {
                return;
            };
            var $0J = this.columnsBottom;
            var $0K = (this.showHours ? this.hourWidth : 0);
            var $H = this.nav.main.rows[0].cells[0].clientWidth;
            var iw = 10;
            var $0L = 1;
            for (var i = 0; i < $0J.length; i++) {
                var $0M = this.nav.scrollUp[i];
                var $0N = this.nav.scrollDown[i];
                $0M.style.left = ($0K + i * $H + $H / 2 - (iw / 2) + $0L) + "px";
                $0N.style.left = ($0K + i * $H + $H / 2 - (iw / 2) + $0L) + "px";
            };
            var $0O = this.$4N();
            for (var i = 0; i < this.nav.scrollUp.length; i++) {
                var up = this.nav.scrollUp[i];
                var $0P = this.nav.scrollDown[i];
                var $0Q = this.scrollLabels[i].minEnd - $0O;
                var $0R = this.scrollLabels[i].maxStart - $0O;
                if (up && $0P) {
                    if ($0Q <= $b.scrollPos) {
                        up.style.top = (this.$4g() + 2) + "px";
                        up.style.display = '';
                    } else {
                        up.style.display = 'none';
                    };
                    if ($0R >= $b.scrollPos + $b.scrollHeight) {
                        $0P.style.top = (this.$4g() + this.scrollHeight - 8) + "px";
                        $0P.style.display = '';
                    } else {
                        $0P.style.display = 'none';
                    }
                }
            }
        };
        this.$4O = function($E) {
            var $0S = $E.parentNode;
            while ($0S && $0S.tagName !== "TD") {
                $0S = $0S.parentNode;
            };
            var $0T = document.createElement('textarea');
            $0T.style.position = 'absolute';
            $0T.style.width = ($E.parentNode.offsetWidth - 2) + 'px';
            $0T.style.height = ($E.offsetHeight - 2) + 'px';
            var $0U = DayPilot.gs($E, 'fontFamily');
            if (!$0U) $0U = DayPilot.gs($E, 'font-family');
            $0T.style.fontFamily = $0U;
            var $0V = DayPilot.gs($E, 'fontSize');
            if (!$0V) $0V = DayPilot.gs($E, 'font-size');
            $0T.style.fontSize = $0V;
            $0T.style.left = '0px';
            $0T.style.top = $E.offsetTop + 'px';
            $0T.style.border = '1px solid black';
            $0T.style.padding = '0px';
            $0T.style.marginTop = '0px';
            $0T.style.backgroundColor = 'white';
            $0T.value = DayPilot.tr($E.event.text());
            $0T.event = $E.event;
            $0S.firstChild.appendChild($0T);
            return $0T;
        };
        this.$4m = function($c, e, $00) {
            $b.$4F($c, e, $00);
        };
        this.multiselect = {};
        this.multiselect.$3Q = [];
        this.multiselect.$4P = [];
        this.multiselect.$4Q = [];
        this.multiselect.$4R = [];
        this.multiselect.$4S = function() {
            var m = $b.multiselect;
            return DayPilot.JSON.stringify(m.events());
        };
        this.multiselect.events = function() {
            var m = $b.multiselect;
            var $0W = [];
            $0W.ignoreToJSON = true;
            for (var i = 0; i < m.$4P.length; i++) {
                $0W.push(m.$4P[i]);
            };
            return $0W;
        };
        this.multiselect.$4T = function() {
            var h = $b.nav.select;
            h.value = $b.multiselect.$4S();
        };
        this.multiselect.$4G = function($c, $0X) {
            var m = $b.multiselect;
            if (m.isSelected($c.event)) {
                if ($b.allowMultiSelect) {
                    if ($0X) {
                        m.remove($c.event, true);
                    } else {
                        var $0Y = m.$4P.length;
                        m.clear(true);
                        if ($0Y > 1) {
                            m.add($c.event, true);
                        }
                    }
                } else {
                    m.clear(true);
                }
            } else {
                if ($b.allowMultiSelect) {
                    if ($0X) {
                        m.add($c.event, true);
                    } else {
                        m.clear(true);
                        m.add($c.event, true);
                    }
                } else {
                    m.clear(true);
                    m.add($c.event, true);
                }
            };
            m.redraw();
            m.$4T();
        };
        this.multiselect.$4U = function(ev) {
            var m = $b.multiselect;
            return m.$4V(ev, m.$3Q);
        };
        this.multiselect.$4W = function() {
            var m = $b.multiselect;
            var $0Z = [];
            for (var i = 0; i < m.$4P.length; i++) {
                var event = m.$4P[i];
                $0Z.push(event.value());
            };
            alert($0Z.join("\n"));
        };
        this.multiselect.add = function(ev, $10) {
            var m = $b.multiselect;
            if (m.$4X(ev) === -1) {
                m.$4P.push(ev);
            };
            m.$4T();
            if ($10) {
                return;
            };
            m.redraw();
        };
        this.multiselect.remove = function(ev, $10) {
            var m = $b.multiselect;
            var i = m.$4X(ev);
            if (i !== -1) {
                m.$4P.splice(i, 1);
            };
            m.$4T();
            if ($10) {
                return;
            };
            m.redraw();
        };
        this.multiselect.clear = function($10) {
            var m = $b.multiselect;
            m.$4P = [];
            m.$4T();
            if ($10) {
                return;
            };
            m.redraw();
        };
        this.multiselect.redraw = function() {
            var m = $b.multiselect;
            for (var i = 0; i < $b.elements.events.length; i++) {
                var $c = $b.elements.events[i];
                if (m.isSelected($c.event)) {
                    m.$4Y($c);
                } else {
                    m.$4Z($c);
                }
            }
        };
        this.multiselect.$4Y = function($c) {
            var m = $b.multiselect;
            var cn = $b.cssOnly ? $b.$4a("_selected") : $b.$4a("selected");
            var c = m.$50($c);
            DayPilot.Util.addClass(c, cn);
            if ($b.useEventSelectionBars) {
                m.$51($c);
            };
            m.$4Q.push($c);
        };
        this.multiselect.$50 = function($c) {
            if ($b.cssOnly) {
                return $c;
            };
            for (var i = 0; i < $c.childNodes.length; i++) {
                var c = $c.childNodes[i];
                if (c.getAttribute("c") === "1") {
                    return c;
                }
            };
            return null;
        };
        this.multiselect.$52 = function() {
            var m = $b.multiselect;
            for (var i = 0; i < m.$4Q.length; i++) {
                var $c = m.$4Q[i];
                m.$4Z($c, true);
            };
            m.$4Q = [];
        };
        this.multiselect.$4Z = function($c, $11) {
            var m = $b.multiselect;
            var cn = $b.cssOnly ? $b.$4a("_selected") : $b.$4a("selected");
            var c = m.$50($c);
            DayPilot.Util.removeClass(c, cn);
            if ($b.useEventSelectionBars) {
                m.$53($c);
            };
            if ($11) {
                return;
            };
            var i = DayPilot.indexOf(m.$4Q, $c);
            if (i !== -1) {
                m.$4Q.splice(i, 1);
            }
        };
        this.multiselect.isSelected = function(ev) {
            return $b.multiselect.$4V(ev, $b.multiselect.$4P);
        };
        this.multiselect.$4X = function(ev) {
            return DayPilot.indexOf($b.multiselect.$4P, ev);
        };
        this.multiselect.$4V = function(e, $0Z) {
            if (!$0Z) {
                return false;
            };
            for (var i = 0; i < $0Z.length; i++) {
                var ei = $0Z[i];
                if (e === ei) {
                    return true;
                };
                if (typeof ei.value === 'function') {
                    if (ei.value() !== null && e.value() !== null && ei.value() === e.value()) {
                        return true;
                    };
                    if (ei.value() === null && e.value() === null && ei.recurrentMasterId() === e.recurrentMasterId() && e.start().toStringSortable() === ei.start()) {
                        return true;
                    }
                } else {
                    if (ei.value !== null && e.value() !== null && ei.value === e.value()) {
                        return true;
                    };
                    if (ei.value === null && e.value() === null && ei.recurrentMasterId === e.recurrentMasterId() && e.start().toStringSortable() === ei.start) {
                        return true;
                    }
                }
            };
            return false;
        };
        this.multiselect.$51 = function($12) {
            var w = 5;
            if (!$12.top) {
                var top = document.createElement("div");
                top.setAttribute("unselectable", "on");
                top.style.position = 'absolute';
                top.style.left = $12.offsetLeft + 'px';
                top.style.width = $12.offsetWidth + 'px';
                top.style.top = ($12.offsetTop - w) + 'px';
                top.style.height = w + 'px';
                top.style.backgroundColor = $b.eventSelectColor;
                top.style.zIndex = 100;
                $12.parentNode.appendChild(top);
                $12.top = top;
            };
            if (!$12.bottom) {
                var $13 = document.createElement("div");
                $13.setAttribute("unselectable", "on");
                $13.style.position = 'absolute';
                $13.style.left = $12.offsetLeft + 'px';
                $13.style.width = $12.offsetWidth + 'px';
                $13.style.top = ($12.offsetTop + $12.offsetHeight) + 'px';
                $13.style.height = w + 'px';
                $13.style.backgroundColor = $b.eventSelectColor;
                $13.style.zIndex = 100;
                $12.parentNode.appendChild($13);
                $12.bottom = $13;
            }
        };
        this.multiselect.$53 = function($12) {
            if ($12.top) {
                $12.parentNode.removeChild($12.top);
                $12.top = null;
            };
            if ($12.bottom) {
                $12.parentNode.removeChild($12.bottom);
                $12.bottom = null;
            }
        };
        this.$4l = function($E) {
            if (DayPilotCalendar.editing) {
                DayPilotCalendar.editing.blur();
                return;
            };
            var $0T = this.$4O($E);
            DayPilotCalendar.editing = $0T;
            $0T.onblur = function() {
                var id = $E.event.value();
                var $14 = $E.event.tag();
                var $15 = $E.event.text();
                var $0y = $0T.value;
                DayPilotCalendar.editing = null;
                $0T.parentNode.removeChild($0T);
                if ($15 === $0y) {
                    return;
                };
                $E.style.display = 'none';
                $b.$4E($E.event, $0y);
            };
            $0T.onkeypress = function(e) {
                var $16 = (window.event) ? event.keyCode : e.keyCode;
                if ($16 === 13) {
                    this.onblur();
                    return false;
                } else if ($16 === 27) {
                    $0T.parentNode.removeChild($0T);
                    DayPilotCalendar.editing = false;
                };
                return true;
            };
            $0T.select();
            $0T.focus();
        };
        this.$3R = function() {
            if (!this.columns) {
                this.columnsBottom = this.$54();
                this.$55(this.columnsBottom);
            } else {
                this.$55(this.columns);
                this.columnsBottom = this.$56(this.headerLevels, true);
            }
        };
        this.$54 = function() {
            var $0J = [];
            var $07 = this.startDate.getDatePart();
            var $17 = this.days;
            switch (this.viewType) {
                case "Day":
                    $17 = 1;
                    break;
                case "Week":
                    $17 = 7;
                    $07 = $07.firstDayOfWeek($0c.locale().weekStarts);
                    break;
                case "WorkWeek":
                    $17 = 5;
                    $07 = $07.firstDayOfWeek(1);
                    break;
            };
            if (this.heightSpec === 'BusinessHoursNoScroll') {
                $07 = $07.addHours(this.businessBeginsHour);
            };
            for (var i = 0; i < $17; i++) {
                var $q = {};
                $q.start = $07.addDays(i);
                $q.name = $q.start.toString($0c.locale().datePattern);
                $q.html = $q.name;
                $0J.push($q);
            };
            return $0J;
        };
        this.$57 = function($q) {
            if ($q.Start) {
                $q.id = $q.Value;
                $q.start = $q.Start;
                $q.name = $q.Name;
                $q.html = $q.InnerHTML;
                $q.toolTip = $q.ToolTip;
                $q.backColor = $q.BackColor;
                $q.areas = $q.Areas;
                $q.children = $q.Children;
                delete $q.Value;
                delete $q.Start;
                delete $q.Name;
                delete $q.InnerHTML;
                delete $q.ToolTip;
                delete $q.BackColor;
                delete $q.Areas;
                delete $q.Children;
            };
            $q.start = $q.start || $b.startDate;
            $q.start = new DayPilot.Date($q.start);
            $q.html = $q.html || $q.name;
            $q.getChildren = function($18, $19) {
                var $0Z = [];
                if ($18 <= 1) {
                    $0Z.push(this);
                    return $0Z;
                };
                if (!this.children || this.children.length === 0) {
                    if ($19) {
                        $0Z.push(this);
                    } else {
                        $0Z.push("empty");
                    };
                    return $0Z;
                };
                for (var i = 0; i < this.children.length; i++) {
                    var $1a = this.children[i];
                    var $1b = $1a.getChildren($18 - 1, $19);
                    for (var j = 0; j < $1b.length; j++) {
                        $0Z.push($1b[j]);
                    }
                };
                return $0Z;
            };
            $q.getChildrenCount = function($18) {
                var $0Y = 0;
                if (!this.children || this.children.length <= 0 || $18 <= 1) {
                    return 1;
                };
                for (var i = 0; i < this.children.length; i++) {
                    $0Y += this.children[i].getChildrenCount($18 - 1);
                };
                return $0Y;
            };
            $q.putIntoBlock = function(ep) {
                for (var i = 0; i < this.blocks.length; i++) {
                    var $1c = this.blocks[i];
                    if ($1c.overlapsWith(ep.part.top, ep.part.height)) {
                        $1c.events.push(ep);
                        $1c.min = Math.min($1c.min, ep.part.top);
                        $1c.max = Math.max($1c.max, ep.part.top + ep.part.height);
                        return i;
                    }
                };
                var $1c = [];
                $1c.lines = [];
                $1c.events = [];
                $1c.overlapsWith = function($07, $1d) {
                    var end = $07 + $1d - 1;
                    if (!(end < this.min || $07 > this.max - 1)) {
                        return true;
                    };
                    return false;
                };
                $1c.putIntoLine = function(ep) {
                    var $1e = this;
                    for (var i = 0; i < this.lines.length; i++) {
                        var $1f = this.lines[i];
                        if ($1f.isFree(ep.part.top, ep.part.height)) {
                            $1f.push(ep);
                            return i;
                        }
                    };
                    var $1f = [];
                    $1f.isFree = function($07, $1d) {
                        var end = $07 + $1d - 1;
                        var $N = this.length;
                        for (var i = 0; i < $N; i++) {
                            var e = this[i];
                            if (!(end < e.part.top || $07 > e.part.top + e.part.height - 1)) {
                                return false;
                            }
                        };
                        return true;
                    };
                    $1f.push(ep);
                    this.lines.push($1f);
                    return this.lines.length - 1;
                };
                $1c.events.push(ep);
                $1c.min = ep.part.top;
                $1c.max = ep.part.top + ep.part.height;
                this.blocks.push($1c);
                return this.blocks.length - 1;
            };
            $q.putIntoLine = function(ep) {
                var $1e = this;
                for (var i = 0; i < this.lines.length; i++) {
                    var $1f = this.lines[i];
                    if ($1f.isFree(ep.part.top, ep.part.height)) {
                        $1f.push(ep);
                        return i;
                    }
                };
                var $1f = [];
                $1f.isFree = function($07, $1d) {
                    var end = $07 + $1d - 1;
                    var $N = this.length;
                    for (var i = 0; i < $N; i++) {
                        var e = this[i];
                        if (!(end < e.part.top || $07 > e.part.top + e.part.height - 1)) {
                            return false;
                        }
                    };
                    return true;
                };
                $1f.push(ep);
                this.lines.push($1f);
                return this.lines.length - 1;
            };
            if ($q.children) {
                this.$55($q.children);
            }
        };
        this.$55 = function(cc) {
            for (var i = 0; i < cc.length; i++) {
                this.$57(cc[i]);
            }
        };
        this.$56 = function($18, $19) {
            var $1g = this.columns || this.columnsBottom;
            var $0Z = [];
            for (var i = 0; i < $1g.length; i++) {
                var $t = $1g[i].getChildren($18, $19);
                for (var j = 0; j < $t.length; j++) {
                    $0Z.push($t[j]);
                }
            };
            return $0Z;
        };
        this.$45 = function() {
            if (!this.showAllDayEvents) {
                return;
            };
            var $1h = this.nav.header;
            if (!$1h) {
                return;
            };
            $1h.style.display = 'none';
            var $0J = this.columnsBottom.length;
            for (var j = 0; j < this.allDay.lines.length; j++) {
                var $1f = this.allDay.lines[j];
                for (var i = 0; i < $1f.length; i++) {
                    var $g = $1f[i];
                    var $c = document.createElement("div");
                    $c.event = $g;
                    $c.setAttribute("unselectable", "on");
                    $c.style.position = 'absolute';
                    if ($b.rtl) {
                        $c.style.right = (100.0 * $g.part.colStart / $0J) + "%";
                    } else {
                        $c.style.left = (100.0 * $g.part.colStart / $0J) + "%";
                    };
                    $c.style.width = (100.0 * $g.part.colWidth / $0J) + "%";
                    $c.style.height = this.allDayEventHeight + 'px';
                    if (!this.cssOnly) {
                        $c.style.top = (3 + this.headerLevels * this.headerHeight + j * (this.allDayEventHeight + 2)) + "px";
                    } else {
                        $c.className = this.$4a("_alldayevent");
                        $c.style.top = (this.headerLevels * this.headerHeight + j * (this.allDayEventHeight)) + "px";
                    };
                    $c.style.textAlign = 'left';
                    $c.style.lineHeight = "1.2";
                    if ($g.client.clickEnabled()) {
                        $c.onclick = this.$4j;
                    };
                    if ($g.client.doubleClickEnabled()) {
                        $c.ondblclick = this.$4n;
                    };
                    $c.oncontextmenu = this.$4o;
                    $c.onmousemove = function(ev) {
                        var $c = this;
                        if (!$c.active) {
                            if ($b.cssOnly) {
                                DayPilot.Util.addClass($c, $b.$4a("_alldayevent_hover"));
                            };
                            DayPilot.Areas.showAreas($c, this.event);
                        };
                        if (typeof(DayPilotBubble) !== 'undefined' && $b.bubble && $b.eventHoverHandling !== 'Disabled') {
                            $b.bubble.showEvent(this.event);
                        }
                    };
                    $c.onmouseout = function(ev) {
                        var $c = this;
                        if ($b.cssOnly) {
                            DayPilot.Util.removeClass($c, $b.$4a("_alldayevent_hover"));
                        };
                        DayPilot.Areas.hideAreas(this, ev);
                        if ($b.bubble) {
                            $b.bubble.hideOnMouseOut();
                        }
                    };
                    if (this.showToolTip) {
                        $c.title = $g.client.toolTip();
                    };
                    var $1i = $g.start().getTime() === $g.part.start.getTime();
                    var $1j = $g.end().getTime() === $g.part.end.getTime();
                    var back = $g.data.backColor;
                    if (!this.cssOnly) {
                        var $M = document.createElement("div");
                        $M.setAttribute("unselectable", "on");
                        $M.style.marginLeft = '2px';
                        $M.style.marginRight = '3px';
                        $M.style.paddingLeft = '2px';
                        $M.style.height = (this.allDayEventHeight - 2) + 'px';
                        $M.style.border = '1px solid ' + this.allDayEventBorderColor;
                        $M.style.overflow = 'hidden';
                        $M.style.position = 'relative';
                        $M.style.backgroundColor = back;
                        $M.className = this.$4a("alldayevent");
                        if (this.roundedCorners) {
                            $M.style.MozBorderRadius = "5px";
                            $M.style.webkitBorderRadius = "5px";
                            $M.style.borderRadius = "5px";
                        };
                        var $1k = [];
                        var $1l = true;
                        var $1m = this.showAllDayEventStartEnd;
                        var $1n = this.showAllDayEventStartEnd;
                        var $1o = "Center";
                        var $1p = 0;
                        if ($1m) {
                            if ($1o === 'Left') {
                                $1k.push("<div unselectable='on' style='position:absolute;text-align:left;height:1px;font-size:1px;width:100%'><div unselectable='on' style='font-size:8pt;color:gray;text-align:right;");
                                $1k.push("width:");
                                $1k.push($1p - 4);
                                $1k.push("px;");
                                $1k.push("><span style='background-color:");
                            } else {
                                $1k.push("<div unselectable='on' style='position:absolute;text-align:left;height:1px;font-size:1px;width:100%'><div unselectable='on' style='font-size:8pt;color:gray'><span style='background-color:");
                            };
                            $1k.push('transparent');
                            $1k.push("' unselectable='on'>");
                            if ($1i) {
                                if ($g.start().getDatePart().getTime() !== $g.start().getTime()) {
                                    $1k.push(DayPilot.Date.hours($g.start().d, this.$58.timeFormat() === 'Clock12Hours'));
                                }
                            } else {
                                $1k.push("~");
                            };
                            $1k.push("</span></div></div>");
                        };
                        if ($1n) {
                            $1k.push("<div unselectable='on' style='position:absolute;text-align:right;height:1px;font-size:1px;width:100%'><div unselectable='on' style='margin-right:4px;font-size:8pt;color:gray'><span style='background-color:");
                            $1k.push('transparent');
                            $1k.push("' unselectable='on'>");
                            if ($1j) {
                                if ($g.end().getDatePart().getTime() !== $g.end().getTime()) {
                                    $1k.push(DayPilot.Date.hours($g.end().d, this.$58.timeFormat() === 'Clock12Hours'));
                                }
                            } else {
                                $1k.push("~");
                            };
                            $1k.push("</span></div></div>");
                        };
                        if ($1o === 'Left') {
                            var $W = $1m ? $1p : 0;
                            $1k.push("<div style='margin-top:0px;height:");
                            $1k.push(this.allDayEventHeight - 2);
                            $1k.push("px;");
                            $1k.push(";overflow:hidden;text-align:left;padding-left:");
                            $1k.push($W);
                            $1k.push("px;font-size:");
                            $1k.push(this.allDayEventFontSize);
                            $1k.push(";color:");
                            $1k.push(this.allDayEventFontColor);
                            $1k.push(";font-family:");
                            $1k.push(this.eventFontFamily);
                            $1k.push("' unselectable='on'>");
                            if ($g.client.innerHTML()) {
                                $1k.push($g.client.innerHTML());
                            } else {
                                $1k.push($g.text());
                            };
                            $1k.push("</div>");
                        } else if ($1o === 'Center') {
                            if ($1l) {
                                $1k.push("<div style='position:absolute; text-align:center; width: 98%; height:1px;'>");
                                $1k.push("<span style='background-color:");
                                $1k.push('transparent');
                                $1k.push(";font-size:");
                                $1k.push(this.allDayEventFontSize);
                                $1k.push(";color:");
                                $1k.push(this.allDayEventFontColor);
                                $1k.push(";font-family:");
                                $1k.push(this.allDayEventFontFamily);
                                $1k.push("' unselectable='on'>");
                                if ($g.client.innerHTML()) {
                                    $1k.push($g.client.innerHTML());
                                } else {
                                    $1k.push($g.text());
                                };
                                $1k.push("</span>");
                                $1k.push("</div>");
                            } else {
                                $1k.push("<div style='margin-top:0px;height:");
                                $1k.push(this.allDayEventHeight - 2);
                                $1k.push("px;");
                                $1k.push(";overflow:hidden;text-align:center;font-size:");
                                $1k.push(this.allDayEventFontSize);
                                $1k.push(";color:");
                                $1k.push(this.allDayEventFontColor);
                                $1k.push(";font-family:");
                                $1k.push(this.allDayEventFontFamily);
                                $1k.push("' unselectable='on'>");
                                if ($g.client.innerHTML()) {
                                    $1k.push($g.client.innerHTML());
                                } else {
                                    $1k.push($g.text());
                                };
                                $1k.push("</div>");
                            }
                        };
                        $M.innerHTML = $1k.join('');
                        $c.appendChild($M);
                    } else {
                        var $M = document.createElement("div");
                        $M.setAttribute("unselectable", "on");
                        $M.className = this.$4a("_alldayevent_inner");
                        if (back) {
                            $M.style.background = back;
                        };
                        if ($b.rtl) {
                            if (!$1i) {
                                DayPilot.Util.addClass($c, this.$4a("_alldayevent_continueright"));
                            };
                            if (!$1j) {
                                DayPilot.Util.addClass($c, this.$4a("_alldayevent_continueleft"));
                            }
                        } else {
                            if (!$1i) {
                                DayPilot.Util.addClass($c, this.$4a("_alldayevent_continueleft"));
                            };
                            if (!$1j) {
                                DayPilot.Util.addClass($c, this.$4a("_alldayevent_continueright"));
                            }
                        };
                        if ($g.client.innerHTML()) {
                            $M.innerHTML = $g.client.innerHTML();
                        } else {
                            $M.innerHTML = $g.text();
                        };
                        $c.appendChild($M);
                    };
                    if ($b.$48()) {
                        if (typeof $b.onAfterEventRender === 'function') {
                            var $m = {};
                            $m.e = $c.event;
                            $m.div = $c;
                            $b.onAfterEventRender($m);
                        }
                    } else {
                        if ($b.afterEventRender) {
                            $b.afterEventRender($c.event, $c);
                        }
                    };
                    this.nav.allday.appendChild($c);
                    this.elements.events.push($c);
                }
            };
            $1h.style.display = '';
        };
        this.$3E = function($1q) {
            $b.multiselect.$52();
            if (this.elements.events) {
                for (var i = 0; i < this.elements.events.length; i++) {
                    var $c = this.elements.events[i];
                    var $E = $c.event;
                    if ($E && $1q && !$E.allday()) {
                        continue;
                    };
                    if ($E) {
                        $E.div = null;
                        $E.root = null;
                    };
                    $c.onclick = null;
                    $c.onclickSave = null;
                    $c.ondblclick = null;
                    $c.oncontextmenu = null;
                    $c.onmouseover = null;
                    $c.onmouseout = null;
                    $c.onmousemove = null;
                    $c.onmousedown = null;
                    if ($c.firstChild && $c.firstChild.firstChild && $c.firstChild.firstChild.tagName && $c.firstChild.firstChild.tagName.toUpperCase() === 'IMG') {
                        var $1r = $c.firstChild.firstChild;
                        $1r.onmousedown = null;
                        $1r.onmousemove = null;
                        $1r.onclick = null;
                    };
                    $c.helper = null;
                    $c.event = null;
                    DayPilot.de($c);
                }
            };
            this.elements.events = [];
        };
        this.$59 = function($g) {
            var $G = this.nav.events;
            var $1s = this.roundedCorners;
            var $1t = this.roundedCorners && (this.$3u.ff || this.$3u.opera105 || this.$3u.webkit522 || !this.$3u.ielt9);
            var $1u = this.roundedCorners && !$1t;
            var $1v = $g.cache || $g.data;
            var $1w = $1v.borderColor || this.eventBorderColor;
            var $c = document.createElement("div");
            $c.setAttribute("unselectable", "on");
            $c.style.MozUserSelect = 'none';
            $c.style.KhtmlUserSelect = 'none';
            $c.style.WebkitUserSelect = 'none';
            $c.style.position = 'absolute';
            if (!this.cssOnly) {
                $c.style.fontFamily = this.eventFontFamily;
                $c.style.fontSize = this.eventFontSize;
                $c.style.color = $1v.fontColor || this.eventFontColor;
                if (!$1s) {
                    $c.style.backgroundColor = $1w;
                };
                if (this.transparent) {
                    $c.style.opacity = 0.6;
                    $c.style.filter = "alpha(opacity=60)";
                }
            } else {
                $c.className = this.$4a("_event");
            };
            $c.style.left = $g.part.left + '%';
            $c.style.top = ($g.part.top - this.$4N()) + 'px';
            $c.style.width = $g.part.width + '%';
            $c.style.height = Math.max($g.part.height, 2) + 'px';
            $c.style.overflow = 'hidden';
            $c.isFirst = $g.part.start.getTime() === $g.start().getTime();
            $c.isLast = $g.part.end.getTime() === $g.end().getTime();
            if ($g.client.clickEnabled()) {
                $c.onclick = this.$4j;
            };
            if ($g.client.doubleClickEnabled()) {
                $c.ondblclick = this.$4n;
            };
            $c.oncontextmenu = this.$4o;
            $c.onmousemove = this.$5a;
            $c.onmouseout = this.$5b;
            $c.onmousedown = this.$5c;
            $c.ontouchstart = this.$5d.onEventTouchStart;
            $c.ontouchmove = this.$5d.onEventTouchMove;
            $c.ontouchend = this.$5d.onEventTouchEnd;
            var $1k = [];
            if (!this.cssOnly) {
                if (this.eventDeleteHandling !== 'Disabled' && $g.client.deleteEnabled()) {
                    $1k.push("<div unselectable='on' style='position:absolute; width:100%;text-align:right;'><div style='position:absolute; width:10px; height:10px; right:2px; top: 2px; cursor:pointer;");
                    if (this.deleteImageUrl) {
                        $1k.push("background-image:url(\"" + this.deleteImageUrl + "\");");
                    };
                    $1k.push("' class='");
                    $1k.push(this.$4a("event_delete"));
                    $1k.push("' onmousemove=\"if(typeof(DayPilotBubble)!=='undefined'&&");
                    $1k.push(this.clientName);
                    $1k.push(".bubble && ");
                    $1k.push(this.clientName);
                    $1k.push(".bubble.hideAfter > 0");
                    $1k.push(") { DayPilotBubble.hideActive(); event.cancelBubble = true; };\" onmousedown=\"this.parentNode.parentNode.style.cursor='default';\" onclick='");
                    $1k.push(this.clientName);
                    $1k.push(".internal.eventDeleteDispatch(this); event.cancelBubble = true; if (event.stopPropagation) event.stopPropagation();' ></div></div>");
                };
                if ($1u) {
                    $1k.push("<div style='margin-right:2px;'>");
                    $1k.push("<div style='height:1px;line-height:1px;font-size:0px; margin-left:2px; background-color:");
                    $1k.push($1w);
                    $1k.push(";'>&nbsp;</div>");
                    $1k.push("</div>");
                    $1k.push("<div unselectable='on' style='position:absolute;width:100%;margin-top:-1px;'>");
                    $1k.push("<div style='height:1px;line-height:1px;font-size:0px;margin-left:1px;margin-top:1px; margin-right:1px;border-right:1px solid ");
                    $1k.push($1w);
                    $1k.push(";border-left:1px solid ");
                    $1k.push($1w);
                    $1k.push(";background-color:");
                    $1k.push($g.client.header() ? $1w : $g.BackgroundColor);
                    $1k.push("'>");
                    $1k.push("&nbsp;</div>");
                    $1k.push("</div>");
                } else if (!$1t) {
                    $1k.push("<div style='height:1px;line-height:1px;font-size:0px; width:1px;'>&nbsp;</div>");
                };
                $1k.push("<div");
                if (this.showToolTip) {
                    $1k.push(" title='");
                    $1k.push($g.client.toolTip().replace(/'/g, "&apos;"));
                    $1k.push("'");
                };
                var $K = Math.max($g.part.height - 2, 0);
                $1k.push(" c='1'");
                $1k.push(" class='");
                $1k.push($1v.cssClass || this.$4a('event'));
                $1k.push("'");
                if ($1u) {
                    $1k.push(" style='margin-top:1px;height:");
                    $1k.push($K - 2);
                } else {
                    $1k.push(" style='margin-top:0px;height:");
                    $1k.push($K);
                };
                $1k.push("px;background-color:");
                $1k.push($g.client.backColor());
                if ($1t) {
                    $1k.push(";border:1px solid ");
                    $1k.push($1w);
                    $1k.push(";-moz-border-radius:5px;");
                    $1k.push(";-webkit-border-radius:5px;");
                    $1k.push(";border-radius:5px;");
                } else {
                    $1k.push(";border-left:1px solid ");
                    $1k.push($1w);
                    $1k.push(";border-right:1px solid ");
                    $1k.push($1w);
                };
                $1k.push(";");
                if ($g.data.backgroundImage) {
                    $1k.push("background-image:url(");
                    $1k.push($g.data.backgroundImage);
                    $1k.push(");");
                    if ($g.data.backgroundRepeat) {
                        $1k.push("background-repeat:");
                        $1k.push($g.data.backgroundRepeat);
                        $1k.push(";");
                    }
                };
                if ($b.rtl) {
                    $1k.push("direction:rtl;");
                };
                $1k.push("' unselectable='on'>");
                if (this.durationBarVisible) {
                    var $1x = $g.client.barColor() || $b.durationBarColor;
                    $1k.push("<div style='position:absolute;left:1px;top:1px;width:");
                    $1k.push($b.durationBarWidth - 1);
                    $1k.push("px;height:");
                    $1k.push($g.part.barTop);
                    $1k.push("px;background-color:white;font-size:1px' unselectable='on'></div>");
                    $1k.push("<div style='position:absolute;left:1px;top:");
                    $1k.push($g.part.barTop + $g.part.barHeight);
                    $1k.push("px;width:");
                    $1k.push($b.durationBarWidth - 1);
                    $1k.push("px;height:");
                    $1k.push($K - ($g.part.barTop + $g.part.barHeight));
                    $1k.push("px;background-color:white;font-size:1px' unselectable='on'></div>");
                    $1k.push("<div style='position:absolute;left:1px;width:");
                    $1k.push($b.durationBarWidth);
                    $1k.push("px;height:");
                    $1k.push($g.part.barHeight);
                    $1k.push("px;");
                    if ($g.data.durationBarImageUrl) {
                        $1k.push("background-image:url(");
                        $1k.push($g.data.durationBarImageUrl);
                        $1k.push(");");
                    } else if ($b.durationBarImageUrl) {
                        $1k.push("background-image:url(");
                        $1k.push($b.durationBarImageUrl);
                        $1k.push(");");
                    };
                    $1k.push("top:");
                    $1k.push($g.part.barTop + 1);
                    $1k.push("px;background-color:");
                    $1k.push($1x);
                    $1k.push(";font-size:1px' unselectable='on'></div><div style='position:absolute;left:");
                    $1k.push($b.durationBarWidth);
                    $1k.push("px;top:1px;width:1px;background-color:");
                    $1k.push($1w);
                    $1k.push(";height:100%' unselectable='on'></div>");
                };
                var $1y = $g.client.header() ? this.eventHeaderHeight : 0;
                if ($g.client.header()) {
                    $1k.push("<div unselectable='on' style='overflow:hidden;height:");
                    $1k.push(this.eventHeaderHeight);
                    $1k.push("px; background-color:");
                    $1k.push($1w);
                    $1k.push(";font-size:");
                    $1k.push(this.eventHeaderFontSize);
                    $1k.push(";color:");
                    $1k.push(this.eventHeaderFontColor);
                    $1k.push("'>");
                    $1k.push($g.client.header());
                    $1k.push("</div>");
                };
                if (this.durationBarVisible) {
                    $1k.push("<div unselectable='on' style='padding-left:");
                    $1k.push($b.durationBarWidth + 3);
                    $1k.push("px;");
                } else {
                    $1k.push("<div unselectable='on' style='overflow:hidden;padding-left:2px;height:");
                    $1k.push($K - $1y - 1);
                    $1k.push("px;");
                };
                $1k.push("'>");
                $1k.push($g.client.innerHTML());
                $1k.push("</div></div>");
                if ($1u) {
                    $1k.push("<div unselectable='on' style='margin-right:2px;'>");
                    $1k.push("<div unselectable='on' style='height:1px;line-height:1px;font-size:0px;margin-left:2px;margin-top:1px;background-color:");
                    $1k.push($1w);
                    $1k.push(";'><!-- --></div>");
                    $1k.push("</div>");
                    $1k.push("<div unselectable='on' style='margin-right:0px;margin-top:-3px;position:relative;'>");
                    $1k.push("<div unselectable='on' style='margin-right:0px;position:relative;'>");
                    $1k.push("<div unselectable='on' style='height:1px;line-height:1px;font-size:0px;margin-top:1px;margin-left:1px;margin-right:1px;border-right:1px solid ");
                    $1k.push($1w);
                    $1k.push(";border-left:1px solid ");
                    $1k.push($1w);
                    $1k.push(";background-color:");
                    $1k.push($g.client.backColor());
                    $1k.push("'>");
                    $1k.push("<!-- --></div>");
                    $1k.push("</div>");
                    $1k.push("</div>");
                };
                $c.innerHTML = $1k.join('');
            } else {
                if ($1v.cssClass) {
                    DayPilot.Util.addClass($c, $1v.cssClass);
                };
                var $M = document.createElement("div");
                $M.setAttribute("unselectable", "on");
                $M.className = $b.$4a("_event_inner");
                $M.innerHTML = $g.client.innerHTML();
                if ($1v.backColor) {
                    $M.style.background = $1v.backColor;
                };
                if ($1v.borderColor) {
                    $M.style.borderColor = $1v.borderColor;
                };
                if ($1v.backgroundImage) {
                    $M.style.backgroundImage = "url(" + $1v.backgroundImage + ")";
                    if ($1v.backgroundRepeat) {
                        $M.style.backgroundRepeat = $1v.backgroundRepeat;
                    }
                };
                $c.appendChild($M);
                if ($g.client.barVisible()) {
                    var $K = $g.part.height - 2;
                    var $1z = 100 * $g.part.barTop / $K;
                    var $1A = Math.ceil(100 * $g.part.barHeight / $K);
                    if (this.durationBarMode === "PercentComplete") {
                        $1B = 0;
                        $1C = $1v.complete;
                    };
                    var $1D = document.createElement("div");
                    $1D.setAttribute("unselectable", "on");
                    $1D.className = this.$4a("_event_bar");
                    $1D.style.position = "absolute";
                    var $1E = document.createElement("div");
                    $1E.setAttribute("unselectable", "on");
                    $1E.className = this.$4a("_event_bar_inner");
                    $1E.style.top = $1z + "%";
                    if (0 < $1A && $1A <= 1) {
                        $1E.style.height = "1px";
                    } else {
                        $1E.style.height = $1A + "%";
                    };
                    $1D.appendChild($1E);
                    $c.appendChild($1D);
                }
            };
            if ($G.rows[0].cells[$g.part.dayIndex]) {
                var $1F = $G.rows[0].cells[$g.part.dayIndex].firstChild;
                $1F.appendChild($c);
                $b.$5e($c);
                $c.event = $g;
                if ($b.multiselect.$4U($g)) {
                    $b.multiselect.add($c.event, true);
                };
                if ($b.$48()) {
                    if (typeof $b.onAfterEventRender === 'function') {
                        var $m = {};
                        $m.e = $c.event;
                        $m.div = $c;
                        $b.onAfterEventRender($m);
                    }
                } else {
                    if ($b.afterEventRender) {
                        $b.afterEventRender($c.event, $c);
                    }
                }
            };
            $b.elements.events.push($c);
        };
        this.$5e = function(el) {
            var c = (el && el.childNodes) ? el.childNodes.length : 0;
            for (var i = 0; i < c; i++) {
                try {
                    var $1a = el.childNodes[i];
                    if ($1a.nodeType === 1) {
                        $1a.setAttribute("unselectable", "on");
                        this.$5e($1a);
                    }
                } catch (e) {}
            }
        };
        this.$44 = function() {
            this.multiselect.$4P = [];
            var $07 = new Date();
            for (var i = 0; i < this.columnsBottom.length; i++) {
                var $1G = this.columnsBottom[i];
                for (var m = 0; m < $1G.blocks.length; m++) {
                    var $1c = $1G.blocks[m];
                    for (var j = 0; j < $1c.lines.length; j++) {
                        var $1f = $1c.lines[j];
                        for (var k = 0; k < $1f.length; k++) {
                            var e = $1f[k];
                            e.part.width = 100 / $1c.lines.length;
                            e.part.left = e.part.width * j;
                            if (this.eventArrangement === 'Cascade') {
                                var $1H = (j === $1c.lines.length - 1);
                                if (!$1H) {
                                    e.part.width = e.part.width * 1.5;
                                }
                            };
                            if (this.eventArrangement === 'Full') {
                                e.part.left = e.part.left / 2;
                                e.part.width = 100 - e.part.left;
                            };
                            if (!e.allday()) {
                                this.$59(e);
                            }
                        }
                    }
                }
            };
            this.multiselect.redraw();
            var end = new Date();
            var $1I = end.getTime() - $07.getTime();
        };
        this.$5f = function() {
            this.multiselect.$4P = [];
            for (var i = 0; i < this.columnsBottom.length; i++) {
                var $1G = this.columnsBottom[i];
                for (var j = 0; j < $1G.lines.length; j++) {
                    var $1f = $1G.lines[j];
                    for (var k = 0; k < $1f.length; k++) {
                        var e = $1f[k];
                        e.part.width = 100 / $1G.lines.length;
                        e.part.left = e.Width * j;
                        if (!e.allday()) {
                            this.$59(e);
                        }
                    }
                }
            }
        };
        this.$4a = function($1J) {
            if (this.cssClassPrefix) {
                return this.cssClassPrefix + $1J;
            } else {
                return "";
            }
        };
        this.$43 = function() {
            if (this.nav.top.style.visibility === 'hidden') {
                this.nav.top.style.visibility = 'visible';
            }
        };
        this.$5g = function() {
            this.nav.top = document.getElementById(this.id);
            this.nav.top.dp = this;
            this.nav.top.innerHTML = '';
            this.nav.top.style.MozUserSelect = 'none';
            this.nav.top.style.KhtmlUserSelect = 'none';
            this.nav.top.style.WebkitUserSelect = 'none';
            this.nav.top.style.position = 'relative';
            if (this.width) {
                this.nav.top.style.width = this.width;
            };
            if (this.rtl) {
                this.nav.top.style.direction = "rtl";
            };
            if (!this.cssOnly) {
                this.nav.top.style.lineHeight = "1.2";
                this.nav.top.style.textAlign = "left";
            };
            if (this.heightSpec === "Parent100Pct") {
                this.nav.top.style.height = "100%";
            };
            if (this.hideUntilInit) {
                this.nav.top.style.visibility = 'hidden';
            };
            this.nav.scroll = document.createElement("div");
            this.nav.scroll.style.height = this.$5h() + "px";
            if (this.cssOnly) {
                DayPilot.Util.addClass(this.nav.top, this.$4a("_main"));
            };
            var $1K = this.columnWidthSpec === 'Fixed';
            if (!$1K) {
                if (this.heightSpec === "Fixed") {
                    this.nav.scroll.style.overflowY = "scroll";
                } else if (this.heightSpec === 'BusinessHours' && this.$4b() <= this.businessEndsHour - this.businessBeginsHour) {
                    this.nav.scroll.style.overflow = "hidden";
                } else if (this.heightSpec !== "Full" && this.heightSpec !== "BusinessHoursNoScroll") {
                    this.nav.scroll.style.overflow = "auto";
                } else {
                    this.nav.scroll.style.overflow = "hidden";
                }
            };
            this.nav.scroll.style.position = "relative";
            if (!this.cssOnly) {
                this.nav.scroll.style.border = "1px solid " + this.borderColor;
                this.nav.scroll.style.backgroundColor = this.hourNameBackColor;
            };
            if (this.showHeader) {
                var $1h = this.$5i();
                this.nav.top.appendChild($1h);
            };
            this.nav.scroll.style.zoom = 1;
            var $1L = this.$5j();
            this.nav.scrollable = $1L.firstChild;
            this.nav.scroll.appendChild($1L);
            this.nav.top.appendChild(this.nav.scroll);
            this.nav.vsph = document.createElement("div");
            this.nav.vsph.style.display = "none";
            this.nav.top.appendChild(this.nav.vsph);
            this.nav.scrollpos = document.createElement("input");
            this.nav.scrollpos.type = "hidden";
            this.nav.scrollpos.id = $b.id + "_scrollpos";
            this.nav.scrollpos.name = this.nav.scrollpos.id;
            this.nav.top.appendChild(this.nav.scrollpos);
            this.nav.select = document.createElement("input");
            this.nav.select.type = "hidden";
            this.nav.select.id = $b.id + "_select";
            this.nav.select.name = this.nav.select.id;
            this.nav.select.value = null;
            this.nav.top.appendChild(this.nav.select);
            this.nav.scrollLayer = document.createElement("div");
            this.nav.scrollLayer.style.position = 'absolute';
            this.nav.scrollLayer.style.top = '0px';
            this.nav.scrollLayer.style.left = '0px';
            this.nav.top.appendChild(this.nav.scrollLayer);
            this.nav.scrollUp = [];
            this.nav.scrollDown = [];
            this.nav.loading = document.createElement("div");
            this.nav.loading.style.position = 'absolute';
            this.nav.loading.style.top = '0px';
            this.nav.loading.style.left = (this.hourWidth + 5) + "px";
            this.nav.loading.style.backgroundColor = this.loadingLabelBackColor;
            this.nav.loading.style.fontSize = this.loadingLabelFontSize;
            this.nav.loading.style.fontFamily = this.loadingLabelFontFamily;
            this.nav.loading.style.color = this.loadingLabelFontColor;
            this.nav.loading.style.padding = '2px';
            this.nav.loading.innerHTML = this.loadingLabelText;
            this.nav.loading.style.display = 'none';
            this.nav.top.appendChild(this.nav.loading);
        };
        this.$40 = function() {
            if (!this.fasterDispose) {
                DayPilot.pu(this.nav.hourTable);
            } else {
                this.$5k();
            };
            if (this.nav.hoursPlaceholder) {
                this.nav.hoursPlaceholder.innerHTML = '';
                this.nav.hourTable = this.$5l();
                this.nav.hoursPlaceholder.appendChild(this.nav.hourTable);
            }
        };
        this.$5k = function() {
            if (!this.nav.hourTable) {
                return;
            };
            for (var i = 0; i < this.nav.hourTable.rows.length; i++) {
                var $1M = this.nav.hourTable.rows[i];
                var $c = $1M.cells[0].firstChild;
                $c.data = null;
                $c.onmousemove = null;
                $c.onmouseout = null;
            }
        };
        this.$5j = function() {
            var $1N = document.createElement("div");
            $1N.style.zoom = 1;
            $1N.style.position = 'relative';
            $1N.onmousemove = this.$5m;
            $1N.ontouchmove = this.$5d.onMainTouchMove;
            $1N.ontouchend = this.$5d.onMainTouchEnd;
            var $1O = null;
            var $1P = null;
            var $1Q = null;
            var $1K = this.columnWidthSpec === 'Fixed';
            if ($1K) {
                if (this.showHours) {
                    var $W = document.createElement("div");
                    $W.style.cssFloat = "left";
                    $W.style.styleFloat = "left";
                    $W.style.width = (this.hourWidth) + "px";
                    $W.style.height = this.$5h() + "px";
                    $W.style.overflow = "hidden";
                    $1N.appendChild($W);
                    $1O = $W;
                    var $1R = 30;
                    var $K = (this.$4c() * this.cellHeight) / (60000 * this.cellDuration) + $1R;
                    $1Q = document.createElement("div");
                    $1Q.style.height = ($K) + "px";
                    $W.appendChild($1Q);
                };
                var $X = document.createElement("div");
                $X.style.height = this.$5h() + "px";
                if (this.showHours) {
                    $X.style.marginLeft = (this.hourWidth) + "px";
                };
                $X.style.position = "relative";
                $X.style.overflow = "auto";
                $X.onscroll = function() {
                    $b.nav.bottomLeft.scrollTop = $b.nav.bottomRight.scrollTop;
                    $b.nav.upperRight.scrollLeft = $b.nav.bottomRight.scrollLeft;
                };
                $1N.appendChild($X);
                $1P = $X;
            } else {
                var $1S = document.createElement("table");
                $1S.cellSpacing = "0";
                $1S.cellPadding = "0";
                $1S.border = "0";
                $1S.style.border = "0px none";
                $1S.style.width = "100%";
                $1S.style.position = 'relative';
                var r = $1S.insertRow(-1);
                var c;
                if (this.showHours) {
                    c = r.insertCell(-1);
                    c.valign = "top";
                    c.style.padding = '0px';
                    c.style.border = '0px none';
                    $1Q = c;
                };
                c = r.insertCell(-1);
                c.width = "100%";
                c.style.padding = '0px';
                c.style.border = '0px none';
                c.style.verticalAlign = "top";
                if (!this.cssOnly) {
                    c.style.borderLeft = "1px solid " + this.borderColor;
                };
                $1P = c;
                $1N.appendChild($1S);
            };
            if ($1Q) {
                this.nav.hourTable = this.$5l();
                $1Q.appendChild(this.nav.hourTable);
            };
            if (!this.cssOnly && !this.separateEventsTable) {
                $1P.appendChild(this.$5n());
            } else {
                var parent = document.createElement("div");
                parent.style.height = "0px";
                parent.style.position = "relative";
                parent.appendChild(this.$5n());
                var $1T = document.createElement("div");
                $1T.style.position = "absolute";
                $1T.style.top = "0px";
                $1T.style.left = "0px";
                $1T.style.right = "0px";
                $1T.style.height = "0px";
                parent.appendChild($1T);
                this.nav.crosshair = $1T;
                parent.appendChild(this.$5o());
                $1P.appendChild(parent);
            };
            this.nav.zoom = $1N;
            this.nav.bottomLeft = $1O;
            this.nav.bottomRight = $1P;
            this.nav.hoursPlaceholder = $1Q;
            return $1N;
        };
        this.$5n = function() {
            var $1S = document.createElement("table");
            $1S.cellPadding = "0";
            $1S.cellSpacing = "0";
            $1S.border = "0";
            var $1K = this.columnWidthSpec === 'Fixed';
            if (!$1K) {
                $1S.style.width = "100%";
            };
            $1S.style.border = "0px none";
            if (!this.cssOnly) {};
            $1S.style.tableLayout = 'fixed';
            this.nav.main = $1S;
            this.nav.events = $1S;
            return $1S;
        };
        this.$5o = function() {
            var $1S = document.createElement("table");
            var $1K = this.columnWidthSpec === 'Fixed';
            $1S.style.position = "absolute";
            $1S.style.top = "0px";
            $1S.cellPadding = "0";
            $1S.cellSpacing = "0";
            $1S.border = "0";
            if (!$1K) {
                $1S.style.width = "100%";
            } else {
                $1S.style.width = (this.columnsBottom.length * this.columnWidth) + "px";
            };
            $1S.style.border = "0px none";
            $1S.style.tableLayout = 'fixed';
            this.nav.events = $1S;
            var $1U = true;
            var $0J = this.columnsBottom;
            var cl = $0J.length;
            var r = ($1U) ? $1S.insertRow(-1) : $1S.rows[0];
            for (var j = 0; j < cl; j++) {
                var c = ($1U) ? r.insertCell(-1) : r.cells[j];
                if ($1U) {
                    c.style.padding = '0px';
                    c.style.border = '0px none';
                    c.style.height = '0px';
                    c.style.overflow = 'visible';
                    if (!$b.rtl) {
                        c.style.textAlign = 'left';
                    };
                    var $c = document.createElement("div");
                    $c.style.marginRight = $b.columnMarginRight + "px";
                    $c.style.position = 'relative';
                    $c.style.height = '1px';
                    if (!this.cssOnly) {
                        $c.style.fontSize = '1px';
                        $c.style.lineHeight = '1.2';
                    };
                    $c.style.marginTop = '-1px';
                    c.appendChild($c);
                }
            };
            return $1S;
        };
        this.$5l = function() {
            var $1S = document.createElement("table");
            $1S.cellSpacing = "0";
            $1S.cellPadding = "0";
            $1S.border = "0";
            $1S.style.border = '0px none';
            $1S.style.width = this.hourWidth + "px";
            $1S.oncontextmenu = function() {
                return false;
            };
            $1S.onmousemove = function() {
                $b.$3L();
            };
            var $1V = this.$4c() / (this.timeHeaderCellDuration * 60 * 1000);
            for (var i = 0; i < $1V; i++) {
                this.$5p($1S, i);
            };
            return $1S;
        };
        this.$5q = function() {
            return (this.$4f() - this.$4f(true)) * (60 / this.cellDuration);
        };
        this.$5r = function() {
            return (this.$4f() - this.$4f(true));
        };
        this.$4N = function() {
            return this.$5q() * this.cellHeight;
        };
        this.$5p = function($1S, i) {
            var $K = (this.cellHeight * 60 / this.cellDuration) / (60 / this.timeHeaderCellDuration);
            var r = $1S.insertRow(-1);
            r.style.height = $K + "px";
            var c = r.insertCell(-1);
            c.valign = "bottom";
            c.setAttribute("unselectable", "on");
            if (!this.cssOnly) {
                c.className = this.$4a("rowheader");
                c.style.backgroundColor = this.hourNameBackColor;
                c.style.cursor = "default";
            };
            c.style.padding = '0px';
            c.style.border = '0px none';
            var $1W = document.createElement("div");
            if (this.cssOnly) {
                $1W.className = this.$4a("_rowheader");
            };
            $1W.style.position = "relative";
            $1W.style.width = this.hourWidth + "px";
            $1W.style.height = ($K) + "px";
            $1W.style.overflow = 'hidden';
            $1W.setAttribute("unselectable", "on");
            var $1c = document.createElement("div");
            if (this.cssOnly) {
                $1c.className = this.$4a("_rowheader_inner");
            };
            $1c.setAttribute("unselectable", "on");
            if (!this.cssOnly) {
                $1c.style.borderBottom = "1px solid " + this.hourNameBorderColor;
                $1c.style.textAlign = "right";
                $1c.style.height = ($K - 1) + "px";
            };
            var $R = null;
            var $g = null;
            if (this.hours) {
                $g = this.hours[i + this.$5r()];
                $R = $g.html;
            };
            var $07 = this.startDate.addHours(i + this.$4f());
            var $1X = $07.getHours();
            if (typeof $b.onBeforeTimeHeaderRender === 'function') {
                var $m = {};
                $m.header = {};
                $m.header.hours = $1X;
                $m.header.minutes = $07.getMinutes();
                $m.header.start = $07.toString("HH:mm");
                $m.header.html = $R;
                $m.header.areas = $g ? $g.areas : null;
                $b.onBeforeTimeHeaderRender($m);
                if ($m.header.html !== null) {
                    $R = $m.header.html;
                };
                $g = $m.header;
            };
            if ($g) {
                $1W.data = $g;
                $1W.onmousemove = $b.$5s;
                $1W.onmouseout = $b.$5t;
            };
            if ($R) {
                $1c.innerHTML = $R;
            } else {
                var $1Y = document.createElement("div");
                $1Y.setAttribute("unselectable", "on");
                if (!this.cssOnly) {
                    $1Y.style.padding = "2px";
                    $1Y.style.fontFamily = this.hourFontFamily;
                    $1Y.style.fontSize = this.hourFontSize;
                    $1Y.style.color = this.hourFontColor;
                };
                var am = $1X < 12;
                if (this.$58.timeFormat() === "Clock12Hours") {
                    $1X = $1X % 12;
                    if ($1X === 0) {
                        $1X = 12;
                    }
                };
                $1Y.innerHTML = $1X;
                var $1Z = document.createElement("span");
                $1Z.setAttribute("unselectable", "on");
                if (!this.cssOnly) {
                    $1Z.style.fontSize = "10px";
                    $1Z.style.verticalAlign = "super";
                } else {
                    $1Z.className = this.$4a("_rowheader_minutes");
                };
                var $20;
                if (this.$58.timeFormat() === "Clock12Hours") {
                    if (am) {
                        $20 = "AM";
                    } else {
                        $20 = "PM";
                    }
                } else {
                    $20 = "00";
                };
                if (!this.cssOnly) {
                    $1Z.innerHTML = "&nbsp;" + $20;
                } else {
                    $1Z.innerHTML = $20;
                };
                $1Y.appendChild($1Z);
                $1c.appendChild($1Y);
            };
            $1W.appendChild($1c);
            c.appendChild($1W);
        };
        this.$5s = function(ev) {
            $b.$3L();
            var $c = this;
            if (!$c.active) {
                DayPilot.Areas.showAreas($c, $c.data);
            }
        };
        this.$5t = function(ev) {
            DayPilot.Areas.hideAreas(this, ev);
        };
        this.$5h = function() {
            switch (this.heightSpec) {
                case "Fixed":
                    return this.height;
                case "Parent100Pct":
                    return this.height;
                case "Full":
                    return (this.$4c() * this.cellHeight) / (60000 * this.cellDuration);
                case "BusinessHours":
                case "BusinessHoursNoScroll":
                    var $O = this.$4d();
                    return $O * this.cellHeight * 60 / this.cellDuration;
                default:
                    throw "DayPilot.Calendar: Unexpected 'heightSpec' value.";
            }
        };
        this.$4g = function() {
            if (!this.showHeader) {
                return 0;
            };
            var $21 = this.headerLevels * this.headerHeight + this.headerLevels - 1;
            if (this.showAllDayEvents && this.allDayHeaderHeight) {
                if (!this.cssOnly) {
                    return $21 + this.allDayHeaderHeight;
                } else {
                    return $21 + this.allDayHeaderHeight;
                }
            } else {
                return $21;
            }
        };
        this.$3W = function() {
            if (!this.headerHeightAutoFit) {
                return;
            };
            if (this.headerLevels > 1) {
                throw "Header height can't be adjusted for HeaderLevels > 1 (not implemented yet).";
                return;
            };
            var $N = 0;
            for (var i = 0; i < this.columnsBottom.length; i++) {
                var $e = this.nav.header.rows[this.headerLevels - 1].cells[i];
                var $c = $e.firstChild;
                var $M = $c.firstChild;
                var $22 = $c.style.height;
                $c.style.height = "auto";
                $M.style.position = "static";
                var h = $c.offsetHeight;
                $c.style.height = $22;
                $M.style.position = '';
                $N = Math.max($N, h);
            };
            if ($N > this.headerHeight) {
                this.headerHeight = $N;
                this.$3U();
                this.$3V();
            }
        };
        this.$5u = function() {
            if (this.cssOnly) {
                return DayPilot.sw($b.nav.scroll) > 0;
            } else {
                return DayPilot.sw($b.nav.scroll) > 2;
            }
        };
        this.$5i = function() {
            var $1h = document.createElement("div");
            if (!this.cssOnly) {
                $1h.style.borderLeft = "1px solid " + this.borderColor;
                $1h.style.borderRight = "1px solid " + this.borderColor;
            };
            var $1K = this.columnWidthSpec === 'Fixed';
            if (!$1K) {
                $1h.style.overflow = "auto";
            };
            var $1N = document.createElement("div");
            $1N.style.position = "relative";
            $1N.style.zoom = "1";
            var $23 = null;
            var $1K = this.columnWidthSpec === 'Fixed';
            if ($1K) {
                var $W = document.createElement("div");
                $W.style.cssFloat = "left";
                $W.style.styleFloat = "left";
                $W.style.width = (this.hourWidth) + "px";
                if (this.showHours) {
                    var $24 = this.$5v();
                    this.nav.corner = $24;
                    $W.appendChild($24);
                    $1N.appendChild($W);
                    this.nav.upperLeft = $W;
                };
                var $1R = 30;
                var $X = document.createElement("div");
                if (this.showHours) {
                    $X.style.marginLeft = (this.hourWidth) + "px";
                };
                $X.style.position = "relative";
                $X.style.overflow = "hidden";
                $X.style.height = this.$4g() + "px";
                $1N.appendChild($X);
                this.nav.upperRight = $X;
                $23 = document.createElement("div");
                $23.style.width = (this.columnsBottom.length * this.columnWidth + $1R) + "px";
                $X.appendChild($23);
            } else {
                var $1S = document.createElement("table");
                $1S.cellPadding = "0";
                $1S.cellSpacing = "0";
                $1S.border = "0";
                $1S.style.width = "100%";
                $1S.style.borderCollapse = 'separate';
                $1S.style.border = "0px none";
                var r = $1S.insertRow(-1);
                this.nav.fullHeader = $1S;
                if (this.showHours) {
                    var c = r.insertCell(-1);
                    c.style.padding = '0px';
                    c.style.border = '0px none';
                    var $24 = this.$5v();
                    c.appendChild($24);
                    this.nav.corner = $24;
                };
                c = r.insertCell(-1);
                c.style.width = "100%";
                if (!this.cssOnly) {
                    c.style.backgroundColor = this.hourNameBackColor;
                };
                c.valign = "top";
                c.style.position = 'relative';
                c.style.padding = '0px';
                c.style.border = '0px none';
                $23 = document.createElement("div");
                $23.style.position = "relative";
                $23.style.height = this.$4g() + "px";
                $23.style.overflow = "hidden";
                c.appendChild($23);
                this.nav.mid = $23;
                $1N.appendChild($1S);
            };
            this.nav.headerParent = $23;
            this.$5w();
            var $25 = this.$5u();
            var $1K = this.columnWidthSpec === 'Fixed';
            if ($25 && !$1K) {
                this.$5x();
            };
            $1h.appendChild($1N);
            return $1h;
        };
        this.$5w = function() {
            this.nav.header = document.createElement("table");
            this.nav.header.cellPadding = "0";
            this.nav.header.cellSpacing = "0";
            var $1K = this.columnWidthSpec === 'Fixed';
            if (!$1K) {
                this.nav.header.width = "100%";
            };
            this.nav.header.style.tableLayout = "fixed";
            if (!this.cssOnly) {
                this.nav.header.style.borderBottom = "0px none #000000";
                this.nav.header.style.borderLeft = "1px solid " + this.borderColor;
                this.nav.header.style.borderTop = "1px solid " + this.borderColor;
            };
            this.nav.header.oncontextmenu = function() {
                return false;
            };
            var $25 = this.$5u();
            if (!this.cssOnly) {
                if ($25) {
                    this.nav.header.style.borderRight = "1px solid " + this.borderColor;
                }
            };
            this.nav.headerParent.appendChild(this.nav.header);
            if (this.nav.allday) {
                DayPilot.de(this.nav.allday);
            };
            if (this.showAllDayEvents) {
                var $26 = document.createElement("div");
                $26.style.position = 'absolute';
                $26.style.top = "0px";
                $26.style.height = "0px";
                var $1K = this.columnWidthSpec === 'Fixed';
                if (!$1K) {
                    $26.style.width = "100%";
                } else {
                    $26.style.width = (this.columnsBottom.length * this.columnWidth) + "px";
                };
                this.nav.allday = $26;
                this.nav.headerParent.appendChild($26);
            }
        };
        this.$5x = function() {
            if (!this.nav.fullHeader) {
                return;
            };
            var r = this.nav.fullHeader.rows[0];
            var c = r.insertCell(-1);
            if (!this.cssOnly) {
                c.className = this.$4a('cornerright');
                c.style.backgroundColor = this.hourNameBackColor;
                c.style.borderBottom = "0px none";
                c.style.borderLeft = "1px solid " + this.borderColor;
                c.style.borderRight = "0px none";
            };
            c.style.padding = '0px';
            c.style.verticalAlign = 'top';
            c.setAttribute("unselectable", "on");
            var $1k = document.createElement("div");
            $1k.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                $1k.className = this.$4a('_cornerright');
            };
            $1k.style.overflow = "hidden";
            $1k.style.position = "relative";
            $1k.style.width = "16px";
            $1k.style.height = this.$4g() + "px";
            var $M = document.createElement("div");
            if (this.cssOnly) {
                $M.className = this.$4a('_cornerright_inner');
            } else {
                $M.style.borderTop = "1px solid " + this.borderColor;
            };
            $1k.appendChild($M);
            c.appendChild($1k);
            this.nav.cornerRight = $1k;
        };
        this.$5v = function() {
            var $1L = document.createElement("div");
            $1L.style.position = 'relative';
            if (!this.cssOnly) {
                $1L.style.backgroundColor = this.cornerBackColor;
                $1L.style.fontFamily = this.headerFontFamily;
                $1L.style.fontSize = this.headerFontSize;
                $1L.style.color = this.headerFontColor;
                $1L.className = this.$4a("corner");
            } else {
                $1L.className = this.$4a("_corner");
            };
            $1L.style.width = this.hourWidth + "px";
            $1L.style.height = this.$4g() + "px";
            $1L.style.overflow = "hidden";
            $1L.oncontextmenu = function() {
                return false;
            };
            var $24 = document.createElement("div");
            if (this.cssOnly) {
                $24.className = this.$4a("_corner_inner");
            } else {
                $24.style.borderTop = "1px solid " + this.borderColor;
            };
            $24.setAttribute("unselectable", "on");
            var $R = this.cornerHTML || this.cornerHtml;
            $24.innerHTML = $R ? $R : '';
            $1L.appendChild($24);
            if (!this.numberFormat) return $1L;
            var $27 = document.createElement("div");
            $27.style.position = 'absolute';
            $27.style.padding = '2px';
            $27.style.top = '0px';
            $27.style.left = '1px';
            $27.style.backgroundColor = "#FF6600";
            $27.style.color = "white";
            $27.innerHTML = "\u0044\u0045\u004D\u004F";
            $27.setAttribute("unselectable", "on");
            $1L.appendChild($27);
            return $1L;
        };
        this.$3F = function() {
            var $1S = this.nav.main;
            $1S.root = null;
            $1S.onmouseup = null;
            for (var y = 0; y < $1S.rows.length; y++) {
                var r = $1S.rows[y];
                for (var x = 0; x < r.cells.length; x++) {
                    var c = r.cells[x];
                    c.root = null;
                    c.onmousedown = null;
                    c.onmousemove = null;
                    c.onmouseout = null;
                    c.onmouseup = null;
                    c.onclick = null;
                    c.ondblclick = null;
                    c.oncontextmenu = null;
                }
            };
            if (!this.fasterDispose) DayPilot.pu($1S);
        };
        this.$3X = function() {
            for (var i = 0; this.nav.scrollUp && i < this.nav.scrollUp.length; i++) {
                this.nav.scrollLayer.removeChild(this.nav.scrollUp[i]);
            };
            for (var i = 0; this.nav.scrollDown && i < this.nav.scrollDown.length; i++) {
                this.nav.scrollLayer.removeChild(this.nav.scrollDown[i]);
            };
            this.nav.scrollUp = [];
            this.nav.scrollDown = [];
        };
        this.$3Z = function() {
            var $1S = this.nav.main;
            var $0i = this.cellDuration * 60 * 1000;
            var $28 = this.$4i();
            var $0J = $b.columnsBottom;
            var $1U = !this.tableCreated || $0J.length !== $1S.rows[0].cells.length || $28 !== $1S.rows.length;
            if ($1S) {
                this.$3F();
                if ($b.$3u.ielt9 && $1U) {
                    DayPilot.de(this.nav.scrollable.parentNode);
                    var $1L = this.$5j();
                    this.nav.scrollable = $1L.firstChild;
                    this.nav.scroll.appendChild($1L);
                    $1S = this.nav.main;
                }
            }
            while ($1S && $1S.rows && $1S.rows.length > 0 && $1U) {
                if (!this.fasterDispose) DayPilot.pu($1S.rows[0]);
                $1S.deleteRow(0);
            };
            this.tableCreated = true;
            if (this.scrollLabelsVisible) {
                var $0J = this.columnsBottom;
                var $0K = (this.showHours ? this.hourWidth : 0);
                var $H = (this.nav.scroll.clientWidth - $0K) / $0J.length;
                for (var i = 0; i < $0J.length; i++) {
                    var $0M = document.createElement("div");
                    $0M.style.position = 'absolute';
                    $0M.style.top = '0px';
                    $0M.style.left = ($0K + 2 + i * $H + $H / 2) + "px";
                    $0M.style.display = 'none';
                    var $1r = document.createElement("div");
                    $1r.style.height = '10px';
                    $1r.style.width = '10px';
                    if (this.cssOnly) {
                        $1r.className = this.$4a("_scroll_up");
                    } else {
                        $1r.style.backgroundRepeat = "no-repeat";
                        if (this.scrollUpUrl) {
                            $1r.style.backgroundImage = "url('" + this.scrollUpUrl + "')";
                        };
                        $1r.className = this.$4a("scroll_up");
                    };
                    $0M.appendChild($1r);
                    this.nav.scrollLayer.appendChild($0M);
                    this.nav.scrollUp.push($0M);
                    var $0N = document.createElement("div");
                    $0N.style.position = 'absolute';
                    $0N.style.top = '0px';
                    $0N.style.left = ($0K + 2 + i * $H + $H / 2) + "px";
                    $0N.style.display = 'none';
                    var $1r = document.createElement("div");
                    $1r.style.height = '10px';
                    $1r.style.width = '10px';
                    if (this.cssOnly) {
                        $1r.className = this.$4a("_scroll_down");
                    } else {
                        $1r.style.backgroundRepeat = "no-repeat";
                        if (this.scrollDownUrl) {
                            $1r.style.backgroundImage = "url('" + this.scrollDownUrl + "')";
                        };
                        $1r.className = this.$4a("scroll_down");
                    };
                    $0N.appendChild($1r);
                    this.nav.scrollLayer.appendChild($0N);
                    this.nav.scrollDown.push($0N);
                }
            };
            var cl = $0J.length;
            if (this.cssOnly || this.separateEventsTable) {
                var $0W = this.nav.events;
                while ($0W && $0W.rows && $0W.rows.length > 0 && $1U) {
                    if (!this.fasterDispose) DayPilot.pu($0W.rows[0]);
                    $0W.deleteRow(0);
                };
                var r = ($1U) ? $0W.insertRow(-1) : $0W.rows[0];
                for (var j = 0; j < cl; j++) {
                    var c = ($1U) ? r.insertCell(-1) : r.cells[j];
                    if ($1U) {
                        c.style.padding = '0px';
                        c.style.border = '0px none';
                        c.style.height = '1px';
                        c.style.overflow = 'visible';
                        var $1K = this.columnWidthSpec === 'Fixed';
                        if ($1K) {
                            c.style.width = this.columnWidth + "px";
                        };
                        if (!$b.rtl) {
                            c.style.textAlign = 'left';
                        };
                        var $c = document.createElement("div");
                        $c.style.marginRight = $b.columnMarginRight + "px";
                        $c.style.position = 'relative';
                        $c.style.height = '1px';
                        if (!this.cssOnly) {
                            $c.style.fontSize = '1px';
                            $c.style.lineHeight = '1.2';
                        };
                        $c.style.marginTop = '-1px';
                        c.appendChild($c);
                    }
                }
            };
            for (var i = 0; i < $28; i++) {
                var r = ($1U) ? $1S.insertRow(-1) : $1S.rows[i];
                if ($1U) {
                    r.style.MozUserSelect = 'none';
                    r.style.KhtmlUserSelect = 'none';
                    r.style.WebkitUserSelect = 'none';
                };
                for (var j = 0; j < cl; j++) {
                    var $1G = this.columnsBottom[j];
                    var c = ($1U) ? r.insertCell(-1) : r.cells[j];
                    c.start = $1G.start.addTime(i * $0i).addHours(this.$4f());
                    c.end = c.start.addTime($0i);
                    c.resource = $1G.id;
                    if (typeof this.onBeforeCellRender === 'function') {
                        if (!this.cellProperties) {
                            this.cellProperties = [];
                        };
                        var $e = {};
                        $e.resource = c.resource;
                        $e.start = c.start;
                        $e.end = c.end;
                        var $29 = j + "_" + i;
                        $e.cssClass = null;
                        $e.html = null;
                        $e.backImage = null;
                        $e.backRepeat = null;
                        $e.backColor = null;
                        $e.business = this.$5y(c.start, c.end);
                        if (this.cellProperties[$29]) {
                            DayPilot.Util.copyProps(this.cellProperties[$29], $e, ['cssClass', 'html', 'backImage', 'backRepeat', 'backColor', 'business']);
                        };
                        var $m = {};
                        $m.cell = $e;
                        this.onBeforeCellRender($m);
                        this.cellProperties[$29] = $e;
                    };
                    var $2a = $b.$5z(j, i);
                    if ($1U) {
                        c.root = this;
                        c.style.padding = '0px';
                        c.style.border = '0px none';
                        c.style.verticalAlign = 'top';
                        c.style.height = $b.cellHeight + 'px';
                        c.style.overflow = 'hidden';
                        c.setAttribute("unselectable", "on");
                        if (!this.cssOnly) {
                            var $2b = document.createElement("div");
                            $2b.style.height = ($b.cellHeight - 1) + "px";
                            $2b.style.width = '100%';
                            $2b.style.overflow = 'hidden';
                            $2b.setAttribute("unselectable", "on");
                            c.appendChild($2b);
                            var $c = document.createElement("div");
                            $c.setAttribute("unselectable", "on");
                            $c.style.fontSize = '1px';
                            $c.style.height = '0px';
                            c.appendChild($c);
                            if ((!$b.rtl && j !== cl - 1) || $b.rtl) {
                                c.style.borderRight = '1px solid ' + $b.cellBorderColor;
                            };
                            var $2c = (c.end.getMinutes() + c.end.getSeconds() + c.end.getMilliseconds()) > 0;
                            if ($2c) {
                                if ($b.hourHalfBorderColor !== '') {
                                    $c.style.borderBottom = '1px solid ' + $b.hourHalfBorderColor;
                                };
                                $c.className = $b.$4a("hourhalfcellborder");
                            } else {
                                if ($b.hourBorderColor !== '') {
                                    $c.style.borderBottom = '1px solid ' + $b.hourBorderColor;
                                };
                                $c.className = $b.$4a("hourcellborder");
                            }
                        } else {
                            var $2b = document.createElement("div");
                            $2b.className = $b.$4a("_cell");
                            $2b.style.position = "relative";
                            $2b.style.height = ($b.cellHeight) + "px";
                            $2b.style.overflow = 'hidden';
                            $2b.setAttribute("unselectable", "on");
                            var $M = document.createElement("div");
                            $M.className = $b.$4a("_cell_inner");
                            $2b.appendChild($M);
                            c.appendChild($2b);
                        }
                    };
                    c.onmousedown = this.$4H;
                    c.onmousemove = this.$4K;
                    c.onmouseout = this.$4J;
                    c.ontouchstart = this.$5d.onCellTouchStart;
                    c.ontouchmove = this.$5d.onCellTouchMove;
                    c.ontouchend = this.$5d.onCellTouchEnd;
                    c.onmouseup = function() {
                        return false;
                    };
                    c.onclick = function() {
                        return false;
                    };
                    c.ondblclick = function() {
                        DayPilotCalendar.firstMousePos = null;
                        $b.$4I();
                        clearTimeout(DayPilotCalendar.selectedTimeout);
                        if ($b.timeRangeDoubleClickHandling === 'Disabled') {
                            return;
                        };
                        var $0I = $b.getSelection();
                        $b.$4D($0I.start, $0I.end, $0I.resource);
                    };
                    c.oncontextmenu = function() {
                        if (!this.selected) {
                            $b.clearSelection();
                            DayPilotCalendar.column = DayPilotCalendar.getColumn(this);
                            $b.selectedCells.push(this);
                            DayPilotCalendar.firstSelected = this;
                            DayPilotCalendar.topSelectedCell = this;
                            DayPilotCalendar.bottomSelectedCell = this;
                            $b.$4I();
                        };
                        if ($b.contextMenuSelection) {
                            $b.contextMenuSelection.show($b.getSelection());
                        };
                        return false;
                    };
                    var $U = $b.$5A(j, i);
                    $2b = c.firstChild;
                    var $1K = this.columnWidthSpec === 'Fixed';
                    if ($1K) {
                        $2b.style.width = this.columnWidth + "px";
                    };
                    if ($U) {
                        if (this.cssOnly) {
                            $2b.firstChild.style.background = $U;
                        } else {
                            $2b.style.background = $U;
                        }
                    };
                    var $2d = $2a ? $2a.business : this.$5y(c.start, c.end);
                    if ($2d && this.cssOnly) {
                        DayPilot.Util.addClass($2b, $b.$4a("_cell_business"));
                    };
                    if ($2a) {
                        if ($2a.html) {
                            $2b.firstChild.innerHTML = $2a.html;
                        };
                        if ($2a.cssClass) {
                            if (this.cssOnly) {
                                DayPilot.Util.addClass($2b, $2a.cssClass);
                            } else {
                                DayPilot.Util.addClass(c, $b.$4a($2a.cssClass));
                            }
                        };
                        if ($2a.backImage) {
                            $2b.style.backgroundImage = "url('" + $2a.backImage + "')";
                        };
                        if ($2a.backRepeat) {
                            $2b.style.backgroundRepeat = $2a.backRepeat;
                        }
                    };
                    if (!this.cssOnly) {
                        DayPilot.Util.addClass(c, $b.$4a("cellbackground"));
                    }
                }
            };
            $1S.onmouseup = this.$4L;
            $1S.root = this;
            $b.nav.scrollable.style.display = '';
        };
        this.$5y = function($07, end) {
            if (this.businessBeginsHour < this.businessEndsHour) {
                return !($07.getHours() < this.businessBeginsHour || $07.getHours() >= this.businessEndsHour || $07.getDayOfWeek() === 6 || $07.getDayOfWeek() === 0);
            };
            if ($07.getHours() >= this.businessBeginsHour) {
                return true;
            };
            if ($07.getHours() < this.businessEndsHour) {
                return true;
            };
            return false;
        };
        this.$5m = function(ev) {
            ev = ev || window.event;
            ev.insideMainD = true;
            if (window.event) {
                window.event.srcElement.inside = true;
            };
            DayPilotCalendar.activeCalendar = this;
            var $2e = $b.nav.main;
            $b.coords = DayPilot.mo3($2e, ev);
            var $0E = DayPilot.mc(ev);
            var $1T = $b.crosshairType && $b.crosshairType !== "Disabled";
            var $2f = $b.coords.x < $b.hourWidth;
            if (DayPilot.Global.moving || DayPilot.Global.resizing || DayPilotCalendar.selecting || $2f) {
                $b.$3L();
            } else if ($1T) {
                $b.$5B();
            };
            if (DayPilot.Global.resizing) {
                if (!DayPilotCalendar.resizingShadow) {
                    DayPilotCalendar.resizingShadow = $b.$49(DayPilot.Global.resizing, false, $b.shadow);
                };
                var $2g = DayPilot.Global.resizing.event.calendar.cellHeight;
                var $I = 0;
                var $2h = ($0E.y - DayPilotCalendar.originalMouse.y);
                if (DayPilot.Global.resizing.dpBorder === 'bottom') {
                    var $2i = Math.floor(((DayPilotCalendar.originalHeight + DayPilotCalendar.originalTop + $2h) + $2g / 2) / $2g) * $2g - DayPilotCalendar.originalTop + $I;
                    if ($2i < $2g) $2i = $2g;
                    var $N = DayPilot.Global.resizing.event.calendar.nav.main.clientHeight;
                    if (DayPilotCalendar.originalTop + $2i > $N) {
                        $2i = $N - DayPilotCalendar.originalTop;
                    };
                    DayPilotCalendar.resizingShadow.style.height = ($2i) + 'px';
                } else if (DayPilot.Global.resizing.dpBorder === 'top') {
                    var $2j = Math.floor(((DayPilotCalendar.originalTop + $2h - $I) + $2g / 2) / $2g) * $2g + $I;
                    if ($2j < $I) {
                        $2j = $I;
                    };
                    if ($2j > DayPilotCalendar.originalTop + DayPilotCalendar.originalHeight - $2g) {
                        $2j = DayPilotCalendar.originalTop + DayPilotCalendar.originalHeight - $2g;
                    };
                    var $2i = DayPilotCalendar.originalHeight - ($2j - DayPilotCalendar.originalTop);
                    if ($2i < $2g) {
                        $2i = $2g;
                    } else {
                        DayPilotCalendar.resizingShadow.style.top = $2j + 'px';
                    };
                    DayPilotCalendar.resizingShadow.style.height = ($2i) + 'px';
                }
            } else if (DayPilot.Global.moving) {
                if (!DayPilotCalendar.movingShadow) {
                    var $2k = 3;
                    if (DayPilot.distance($0E, DayPilotCalendar.originalMouse) > $2k) {
                        DayPilotCalendar.movingShadow = $b.$49(DayPilot.Global.moving, !$b.$3u.ie, $b.shadow);
                        DayPilotCalendar.movingShadow.style.width = (DayPilotCalendar.movingShadow.parentNode.offsetWidth + 1) + 'px';
                    } else {
                        return;
                    }
                };
                if (!$b.coords) {
                    return;
                };
                var $2g = $b.cellHeight;
                var $I = 0;
                var $0L = DayPilotCalendar.moveOffsetY;
                if (!$0L) {
                    $0L = $2g / 2;
                };
                if (this.moveBy === "Top") {
                    $0L = 0;
                };
                var $2j = Math.floor((($b.coords.y - $0L - $I) + $2g / 2) / $2g) * $2g + $I;
                if ($2j < $I) {
                    $2j = $I;
                };
                var $G = $b.nav.main;
                var $N = $G.clientHeight;
                var $K = parseInt(DayPilotCalendar.movingShadow.style.height);
                if ($2j + $K > $N) {
                    $2j = $N - $K;
                };
                DayPilotCalendar.movingShadow.style.top = $2j + 'px';
                var $H = $G.clientWidth / $G.rows[0].cells.length;
                var $q = Math.floor(($b.coords.x) / $H);
                if ($q < 0) {
                    $q = 0;
                };
                if ($b.rtl) {
                    $q = $b.columnsBottom.length - $q - 1;
                };
                var $0W = $b.nav.events;
                if ($q < $0W.rows[0].cells.length && $q >= 0 && DayPilotCalendar.movingShadow.column !== $q) {
                    DayPilotCalendar.movingShadow.column = $q;
                    DayPilotCalendar.moveShadow($0W.rows[0].cells[$q]);
                }
            };
            if (DayPilotCalendar.drag) {
                if (DayPilotCalendar.gShadow) {
                    document.body.removeChild(DayPilotCalendar.gShadow);
                };
                DayPilotCalendar.gShadow = null;
                if (!DayPilotCalendar.movingShadow && $b.coords) {
                    var $L = $b.$49(DayPilotCalendar.drag, false, DayPilotCalendar.drag.shadowType);
                    if ($L) {
                        DayPilotCalendar.movingShadow = $L;
                        var $0D = new DayPilot.Date().getDatePart();
                        var ev = {
                            'value': DayPilotCalendar.drag.id,
                            'start': $0D,
                            'end': $0D.addSeconds(DayPilotCalendar.drag.duration),
                            'text': DayPilotCalendar.drag.text
                        };
                        var event = new DayPilot.Event(ev, $b);
                        event.external = true;
                        DayPilot.Global.moving = {};
                        DayPilot.Global.moving.event = event;
                        DayPilot.Global.moving.helper = {};
                    }
                };
                ev.cancelBubble = true;
            }
        };
        this.temp = {};
        this.temp.getPosition = function() {
            var $2l = $b.$5C.getCellCoords();
            if (!$2l) {
                return null;
            };
            var $q = $b.columnsBottom[$2l.x];
            var $e = {};
            $e.resource = $q.id;
            $e.start = new DayPilot.Date($q.start).addHours($b.$4f(true)).addMinutes($2l.y * $b.cellDuration);
            $e.end = $e.start.addMinutes($b.cellDuration);
            return $e;
        };
        this.$5C = {};
        this.$5C.getCellCoords = function() {
            var $u = {};
            $u.x = 0;
            $u.y = 0;
            if (!$b.coords) {
                return null;
            };
            var $G = $b.nav.main;
            var $2m = $b.coords.x;
            var i = 0;
            var $1G = this.col($G, i);
            while ($1G && $2m > $1G.left) {
                i += 1;
                $1G = this.col($G, i);
            };
            $u.x = i - 1;
            var $I = 0;
            var $1M = Math.floor(($b.coords.y - $I) / $b.cellHeight);
            $u.y = $1M;
            if ($u.x < 0) {
                return null;
            };
            return $u;
        };
        this.$5C.col = function($1S, x) {
            var $u = {};
            $u.left = 0;
            $u.width = 0;
            var $e = $1S.rows[0].cells[x];
            if (!$e) {
                return null;
            };
            var t = DayPilot.abs($1S);
            var c = DayPilot.abs($e);
            $u.left = c.x - t.x;
            $u.width = $e.offsetWidth;
            return $u;
        };
        this.$5B = function() {
            this.$3L();
            if (!this.elements.crosshair) {
                this.elements.crosshair = [];
            };
            var $2n = this.$5C.getCellCoords();
            if (!$2n) {
                return;
            };
            var $q = $2n.x;
            var y = Math.floor($2n.y / (60 / $b.cellDuration) * (60 / $b.timeHeaderCellDuration));
            if (y < 0) {
                return;
            };
            if (this.nav.hourTable) {
                if (y >= this.nav.hourTable.rows.length) {
                    return;
                };
                var $2o = document.createElement("div");
                $2o.style.position = "absolute";
                $2o.style.left = "0px";
                $2o.style.right = "0px";
                $2o.style.top = "0px";
                $2o.style.bottom = "0px";
                $2o.style.opacity = .5;
                $2o.style.backgroundColor = this.crosshairColor;
                $2o.style.opacity = this.crosshairOpacity / 100;
                $2o.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                this.nav.hourTable.rows[y].cells[0].firstChild.appendChild($2o);
                this.elements.crosshair.push($2o);
            };
            if (this.nav.header) {
                var $2p = document.createElement("div");
                $2p.style.position = "absolute";
                $2p.style.left = "0px";
                $2p.style.right = "0px";
                $2p.style.top = "0px";
                $2p.style.bottom = "0px";
                $2p.style.opacity = .5;
                $2p.style.backgroundColor = this.crosshairColor;
                $2p.style.opacity = this.crosshairOpacity / 100;
                $2p.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                var $1M = this.nav.header.rows[this.headerLevels - 1];
                if ($1M.cells[$q]) {
                    $1M.cells[$q].firstChild.appendChild($2p);
                    this.elements.crosshair.push($2p);
                }
            };
            if (this.crosshairType === "Header") {
                return;
            };
            var $2q = this.nav.crosshair;
            var $I = 0;
            var top = Math.floor((($b.coords.y - $I)) / $b.cellHeight) * $b.cellHeight + $I;
            var $K = $b.cellHeight;
            var $2r = document.createElement("div");
            $2r.style.position = "absolute";
            $2r.style.left = "0px";
            $2r.style.right = "0px";
            $2r.style.top = top + "px";
            $2r.style.height = $K + "px";
            $2r.style.backgroundColor = this.crosshairColor;
            $2r.style.opacity = this.crosshairOpacity / 100;
            $2r.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
            $2r.onmousedown = this.$5D;
            $2q.appendChild($2r);
            this.elements.crosshair.push($2r);
            var $1G = this.$5C.col(this.nav.main, $q);
            $K = this.nav.main.clientHeight;
            if ($1G) {
                var $2s = document.createElement("div");
                $2s.style.position = "absolute";
                $2s.style.left = $1G.left + "px";
                $2s.style.width = $1G.width + "px";
                $2s.style.top = "0px";
                $2s.style.height = $K + "px";
                $2s.style.backgroundColor = this.crosshairColor;
                $2s.style.opacity = this.crosshairOpacity / 100;
                $2s.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                $2s.onmousedown = this.$5D;
                $2q.appendChild($2s);
                this.elements.crosshair.push($2s);
            }
        };
        this.$5D = function(ev) {
            $b.$3L();
            var $2n = $b.$5C.getCellCoords();
            var $2t = 0;
            var $e = $b.nav.main.rows[$2n.y + $2t].cells[$2n.x];
            $b.$4H.apply($e, [ev]);
        };
        this.$3L = function() {
            if (!this.elements.crosshair || this.elements.crosshair.length === 0) {
                return;
            };
            for (var i = 0; i < this.elements.crosshair.length; i++) {
                var e = this.elements.crosshair[i];
                if (e && e.parentNode) {
                    e.parentNode.removeChild(e);
                }
            };
            this.elements.crosshair = [];
        };
        this.$3S = function() {
            if (!this.cellConfig) {
                return;
            };
            var $2u = this.cellConfig;
            if ($2u.vertical) {
                for (var x = 0; x < $2u.x; x++) {
                    var $2v = this.cellProperties[x + "_0"];
                    for (var y = 1; y < $2u.y; y++) {
                        this.cellProperties[x + "_" + y] = $2v;
                    }
                }
            };
            if ($2u.horizontal) {
                for (var y = 0; y < $2u.y; y++) {
                    var $2v = this.cellProperties["0_" + y];
                    for (var x = 1; x < $2u.x; x++) {
                        this.cellProperties[x + "_" + y] = $2v;
                    }
                }
            };
            if ($2u["default"]) {
                var $2v = $2u["default"];
                for (var y = 0; y < $2u.y; y++) {
                    for (var x = 0; x < $2u.x; x++) {
                        if (!this.cellProperties[x + "_" + y]) {
                            this.cellProperties[x + "_" + y] = $2v;
                        }
                    }
                }
            }
        };
        this.$5z = function(x, y) {
            if (!this.cellProperties) {
                return null;
            };
            return this.cellProperties[x + "_" + y];
        };
        this.$5E = function(x, y) {
            var $29 = x + '_' + y;
            if (this.cellProperties && this.cellProperties[$29]) {
                return this.cellProperties[$29].business;
            };
            return false;
        };
        this.$5A = function(x, y) {
            var $29 = x + '_' + y;
            if (this.cellProperties && this.cellProperties[$29]) {
                return this.cellProperties[$29].backColor;
            };
            return null;
        };
        this.$3G = function() {
            var $1S = this.nav.header;
            if ($1S && $1S.rows) {
                for (var y = 0; y < $1S.rows.length; y++) {
                    var r = $1S.rows[y];
                    for (var x = 0; x < r.cells.length; x++) {
                        var c = r.cells[x];
                        c.onclick = null;
                        c.onmousemove = null;
                        c.onmouseout = null;
                    }
                }
            };
            if (!this.fasterDispose) DayPilot.pu($1S);
        };
        this.$5F = function($18, $1U) {
            var r = ($1U) ? this.nav.header.insertRow(-1) : this.nav.header.rows[$18 - 1];
            var $0J = this.$56($18);
            var $2w = $0J.length;
            for (var i = 0; i < $2w; i++) {
                var $g = $0J[i];
                if ($b.$48()) {
                    if (typeof $b.onBeforeHeaderRender === 'function') {
                        var $m = {};
                        $m.header = {};
                        DayPilot.Util.copyProps($g, $m.header, ['id', 'start', 'name', 'html', 'backColor', 'toolTip', 'areas', 'children']);
                        this.onBeforeHeaderRender($m);
                        DayPilot.Util.copyProps($m.header, $g, ['html', 'backColor', 'toolTip', 'areas']);
                    }
                };
                var $2x = $g.getChildren ? true : false;
                var $e = ($1U) ? r.insertCell(-1) : r.cells[i];
                $e.data = $g;
                if ($18 === $b.headerLevels) {} else {
                    var $2y = 1;
                    if ($2x) {
                        $2y = $g.getChildrenCount($b.headerLevels - $18 + 1);
                    };
                    $e.colSpan = $2y;
                };
                if ($2x) {
                    $e.onclick = this.$4p;
                    $e.onmousemove = this.$4q;
                    $e.onmouseout = this.$4r;
                    if ($g.toolTip) {
                        $e.title = $g.toolTip;
                    }
                };
                $e.style.overflow = 'hidden';
                $e.style.padding = '0px';
                $e.style.border = '0px none';
                $e.style.height = (this.headerHeight) + "px";
                if (!this.cssOnly) {
                    $e.style.borderLeft = "0px none";
                    if (i !== $2w - 1) {
                        $e.style.borderRight = "1px solid " + this.borderColor;
                    }
                };
                var $c = ($1U) ? document.createElement("div") : $e.firstChild;
                var $1K = this.columnWidthSpec === 'Fixed';
                if ($1K) {
                    $c.style.width = this.columnWidth + "px";
                };
                if ($1U) {
                    $c.setAttribute("unselectable", "on");
                    $c.style.MozUserSelect = 'none';
                    $c.style.KhtmlUserSelect = 'none';
                    $c.style.WebkitUserSelect = 'none';
                    $c.style.position = 'relative';
                    $c.style.height = this.headerHeight + "px";
                    if (!this.cssOnly) {
                        $c.className = $b.$4a('colheader');
                        $c.style.cursor = 'default';
                        $c.style.fontFamily = this.headerFontFamily;
                        $c.style.fontSize = this.headerFontSize;
                        $c.style.color = this.headerFontColor;
                        $c.style.backgroundColor = $g.backColor;
                        $c.style.textAlign = 'center';
                        var $1Y = document.createElement("div");
                        $1Y.style.position = 'absolute';
                        $1Y.style.left = '0px';
                        $1Y.style.right = '0px';
                        $1Y.style.top = "0px";
                        $1Y.style.bottom = "0px";
                        $1Y.style.padding = "2px";
                        $1Y.setAttribute("unselectable", "on");
                        if ($18 !== 1) {
                            $1Y.style.borderTop = '1px solid ' + this.borderColor;
                        };
                        if (this.headerClickHandling !== "Disabled") {
                            $1Y.style.cursor = 'pointer';
                        };
                        $c.appendChild($1Y);
                    } else {
                        $c.className = $b.$4a('_colheader');
                        var $M = document.createElement("div");
                        $M.className = $b.$4a('_colheader_inner');
                        if ($g.backColor) {
                            $M.style.background = $g.backColor;
                        };
                        $c.appendChild($M);
                    };
                    $e.appendChild($c);
                } else {
                    $c.style.height = this.headerHeight + "px";
                };
                if ($2x) {
                    $c.firstChild.innerHTML = $g.html;
                }
            }
        };
        this.$3V = function() {
            if (!this.showHeader) {
                return;
            };
            var $1h = this.nav.header;
            var $1U = true;
            var $0J = this.$56($b.headerLevels, true);
            var $2w = $0J.length;
            if (this.headerCreated && $1h && $1h.rows && $1h.rows.length > 0) {
                $1U = $1h.rows[$1h.rows.length - 1].cells.length !== $2w;
            };
            if (this.headerCreated && $b.$3u.ielt9 && $1U) {
                DayPilot.de(this.nav.header);
                this.$5w();
            }
            while (this.headerCreated && $1h && $1h.rows && $1h.rows.length > 0 && $1U) {
                if (!this.fasterDispose) DayPilot.pu($1h.rows[0]);
                $1h.deleteRow(0);
            };
            this.headerCreated = true;
            var $R = $b.cornerHTML || $b.cornerHtml;
            if (!$1U) {
                var $24 = $b.nav.corner;
                if ($24) {
                    if (!this.cssOnly) {
                        if ($b.cornerBackColor) {
                            $24.style.backgroundColor = $b.cornerBackColor;
                        } else {
                            $24.style.backgroundColor = $b.hourBackColor;
                        }
                    };
                    if (!this.fasterDispose) DayPilot.pu($24.firstChild);
                    $24.firstChild.innerHTML = $R ? $R : '';
                }
            };
            for (var i = 0; i < $b.headerLevels; i++) {
                this.$5F(i + 1, $1U);
            };
            if (!this.showAllDayEvents) {
                return;
            };
            var r = ($1U) ? this.nav.header.insertRow(-1) : this.nav.header.rows[$b.headerLevels];
            for (var i = 0; i < $2w; i++) {
                var $g = $0J[i];
                var $e = ($1U) ? r.insertCell(-1) : r.cells[i];
                $e.data = $g;
                $e.style.padding = '0px';
                $e.style.border = '0px none';
                $e.style.overflow = 'hidden';
                if (!this.cssOnly) {
                    $e.style.lineHeight = '1.2';
                };
                var $c = ($1U) ? document.createElement("div") : $e.firstChild;
                if ($1U) {
                    $c.setAttribute("unselectable", "on");
                    $c.style.MozUserSelect = 'none';
                    $c.style.KhtmlUserSelect = 'none';
                    $c.style.WebkitUserSelect = 'none';
                    $c.style.overflow = 'hidden';
                    $c.style.position = "relative";
                    $c.style.height = this.allDayHeaderHeight + "px";
                    if (!this.cssOnly) {
                        $c.className = this.$4a("alldayheader");
                        $c.style.textAlign = 'center';
                        $c.style.backgroundColor = $g.backColor;
                        $c.style.cursor = 'default';
                        var $1Y = document.createElement("div");
                        $1Y.style.position = "absolute";
                        $1Y.style.left = '0px';
                        $1Y.style.right = '0px';
                        $1Y.style.top = "0px";
                        $1Y.style.bottom = "0px";
                        $1Y.setAttribute("unselectable", "on");
                        $1Y.style.borderTop = '1px solid ' + this.borderColor;
                        $c.appendChild($1Y);
                        if ($b.rtl) {
                            if (i === $2w - 1) {
                                $1Y.style.borderLeft = "1px solid " + $g.backColor;
                            } else {
                                $1Y.style.borderLeft = "1px solid " + this.borderColor;
                            }
                        } else {
                            if (i !== $2w - 1) {
                                $1Y.style.borderRight = "1px solid " + this.borderColor;
                            }
                        }
                    } else {
                        $c.className = this.$4a("_alldayheader");
                        var $M = document.createElement("div");
                        $M.className = this.$4a("_alldayheader_inner");
                        $c.appendChild($M);
                    };
                    $e.appendChild($c);
                };
                $c.style.height = this.allDayHeaderHeight + "px";
            }
        };
        this.$3z = function() {
            if (this.loadingLabelVisible) {
                this.nav.loading.innerHTML = this.loadingLabelText;
                this.nav.loading.style.top = (this.$4g() + 5) + "px";
                this.nav.loading.style.display = '';
            }
        };
        this.$3O = function() {
            if (this.callbackTimeout) {
                window.clearTimeout(this.callbackTimeout);
            };
            this.nav.loading.style.display = 'none';
        };
        this.$5G = function() {
            var $2z = this.nav.scroll;
            if (!this.initScrollPos) return;
            $2z.root = this;
            $2z.onscroll = this.$4M;
            if ($2z.scrollTop === 0) {
                $2z.scrollTop = this.initScrollPos - this.$4N();
            } else {
                this.$4M();
            }
        };
        this.onCallbackError = function($u, $v) {
            alert("Error!\r\nResult: " + $u + "\r\nContext:" + $v);
        };
        this.scrollbarVisible = this.$5u;
        this.$42 = function() {
            var $2A = this.$5u();
            var $2B = !!this.nav.cornerRight;
            if ($2A !== $2B) {
                if ($2A) {
                    this.$5x();
                } else {
                    if (this.nav.fullHeader && this.nav.fullHeader.rows[0].cells.length === 3) {
                        var c = this.nav.fullHeader.rows[0].cells[2];
                        if (c.parentNode) {
                            c.parentNode.removeChild(c);
                        }
                    };
                    this.nav.cornerRight = null;
                }
            };
            var d = this.nav.cornerRight;
            if (!d) {
                return;
            };
            var w = DayPilot.sw(this.nav.scroll);
            if (!this.cssOnly) {
                if (w >= 3) {
                    d.style.width = (w - 3) + 'px';
                }
            } else {
                if (d) {
                    d.style.width = (w) + 'px';
                }
            };
            return w;
        };
        this.$47 = function($2C) {
            if ($2C) {
                this.autoRefreshEnabled = true;
            };
            if (!this.autoRefreshEnabled) {
                return;
            };
            if (this.autoRefreshCount >= this.autoRefreshMaxCount) {
                return;
            };
            this.$3D();
            var $2D = this.autoRefreshInterval;
            if (!$2D || $2D < 10) {
                throw "The minimum autoRefreshInterval is 10 seconds";
            };
            this.autoRefreshTimeout = window.setTimeout(function() {
                $b.$5H();
            }, this.autoRefreshInterval * 1000);
        };
        this.$3D = function() {
            if (this.autoRefreshTimeout) {
                window.clearTimeout(this.autoRefreshTimeout);
            }
        };
        this.$5H = function() {
            if (!DayPilot.Global.resizing && !DayPilot.Global.moving && !DayPilotCalendar.drag && !DayPilotCalendar.selecting) {
                this.autoRefreshCount++;
                this.commandCallBack(this.autoRefreshCommand);
            };
            if (this.autoRefreshCount < this.autoRefreshMaxCount) {
                this.autoRefreshTimeout = window.setTimeout(function() {
                    $b.$5H();
                }, this.autoRefreshInterval * 1000);
            }
        };
        this.$3H = function() {
            if ($b.heightSpec === "Parent100Pct") {
                $b.setHeight(parseInt($b.nav.top.clientHeight, 10));
            };
            $b.$41();
            $b.$46();
        };
        this.$5I = function() {
            if (!DayPilotCalendar.globalHandlers) {
                DayPilotCalendar.globalHandlers = true;
                DayPilot.re(document, 'mousemove', DayPilotCalendar.gMouseMove);
                DayPilot.re(document, 'mouseup', DayPilotCalendar.gMouseUp);
            };
            DayPilot.re(window, 'resize', this.$3H);
        };
        this.$5c = function(ev) {
            ev = ev || window.event;
            var $0A = ev.which || ev.button;
            if (typeof(DayPilotBubble) !== 'undefined') {
                DayPilotBubble.hideActive();
            };
            if ((this.style.cursor === 'n-resize' || this.style.cursor === 's-resize') && $0A === 1) {
                DayPilot.Global.resizing = this;
                DayPilotCalendar.originalMouse = DayPilot.mc(ev);
                DayPilotCalendar.originalHeight = this.offsetHeight;
                DayPilotCalendar.originalTop = this.offsetTop;
                $b.nav.top.style.cursor = this.style.cursor;
            } else if ((this.style.cursor === 'move' || $b.moveBy === 'Full') && $0A === 1) {
                DayPilot.Global.moving = this;
                var $2E = DayPilot.Global.moving.helper = {};
                $2E.oldColumn = $b.columnsBottom[this.event.part.dayIndex].id;
                DayPilotCalendar.originalMouse = DayPilot.mc(ev);
                DayPilotCalendar.originalTop = this.offsetTop;
                var $0L = DayPilot.mo3(this, ev);
                if ($0L) {
                    DayPilotCalendar.moveOffsetY = $0L.y;
                } else {
                    DayPilotCalendar.moveOffsetY = 0;
                };
                $b.nav.top.style.cursor = this.style.cursor;
            };
            return false;
        };
        this.$5J = function(i) {
            var $1v = this.$3t.events;
            var $g = this.events.list[i];
            var $2F = {};
            for (var name in $g) {
                $2F[name] = $g[name];
            };
            if (typeof this.onBeforeEventRender === 'function') {
                var $m = {};
                $m.e = $2F;
                this.onBeforeEventRender($m);
            };
            $1v[i] = $2F;
        };
        this.$5d = {};
        var $2G = $b.$5d;
        $2G.active = false;
        $2G.start = null;
        $2G.timeout = null;
        $2G.startcell = null;
        this.$5d.getCellCoords = function(x, y) {
            var $2H = DayPilot.abs($b.nav.main);
            var $2I = {
                x: x - $2H.x,
                y: y - $2H.y
            };
            var w = ($b.nav.main.clientWidth / $b.columnsBottom.length);
            var $2l = {
                x: Math.floor($2I.x / w),
                y: Math.floor($2I.y / $b.cellHeight),
                toString: function() {
                    return "x: " + this.x + " y:" + this.y;
                }
            };
            return $2l;
        };
        this.$5d.startSelecting = function($2l) {
            var $e = $b.nav.main.rows[$2l.y].cells[$2l.x];
            $2G.startcell = $2l;
            $b.clearSelection();
            DayPilotCalendar.column = DayPilotCalendar.getColumn($e);
            $b.selectedCells.push($e);
            DayPilotCalendar.firstSelected = $e;
            DayPilotCalendar.topSelectedCell = $e;
            DayPilotCalendar.bottomSelectedCell = $e;
            $b.$4I();
        };
        this.$5d.extendSelection = function($2l) {
            var $e = $b.nav.main.rows[$2l.y].cells[$2l.x];
            $b.clearSelection();
            if ($2l.y < $2G.startcell.y) {
                $b.selectedCells = DayPilotCalendar.getCellsBelow($e);
                DayPilotCalendar.topSelectedCell = $b.selectedCells[0];
                DayPilotCalendar.bottomSelectedCell = DayPilotCalendar.firstSelected;
            } else {
                $b.selectedCells = DayPilotCalendar.getCellsAbove($e);
                DayPilotCalendar.topSelectedCell = DayPilotCalendar.firstSelected;
                DayPilotCalendar.bottomSelectedCell = $b.selectedCells[0];
            };
            $b.$4I();
        };
        this.$5d.onCellTouchStart = function(ev) {
            if ($2G.active) {
                return;
            };
            var x = ev.touches[0].pageX;
            var y = ev.touches[0].pageY;
            var $2l = $2G.getCellCoords(x, y);
            var $2J = 500;
            $2G.timeout = window.setTimeout(function() {
                $2G.active = true;
                $2G.startSelecting($2l);
            }, $2J);
        };
        this.$5d.onCellTouchMove = function(ev) {
            if (!$2G.active) {
                window.clearTimeout($2G.timeout);
                return;
            };
            ev.preventDefault();
            if (!ev.touches[0]) {
                return;
            };
            var x = ev.touches[0].pageX;
            var y = ev.touches[0].pageY;
            var $2l = $2G.getCellCoords(x, y);
            $2G.extendSelection($2l);
        };
        this.$5d.onCellTouchEnd = function(ev) {
            if (!$2G.active) {
                window.clearTimeout($2G.timeout);
                return;
            };
            ev.preventDefault();
            $2G.startcell = null;
            var $0I = $b.getSelection();
            $0I.toString = function() {
                return "start: " + this.start + "\nend: " + this.end;
            };
            $b.$4C($0I.start, $0I.end, $0I.resource);
            window.setTimeout(function() {
                $2G.active = false;
            }, 500);
        };
        this.$5d.startMoving = function($c, $2l) {
            DayPilot.Global.moving = $c;
            var $2E = DayPilot.Global.moving.helper = {};
            $2E.oldColumn = $b.columnsBottom[$c.event.part.dayIndex].id;
            DayPilotCalendar.originalMouse = $2l;
            DayPilotCalendar.originalTop = this.offsetTop;
            var $2H = DayPilot.abs($c);
            DayPilotCalendar.moveOffsetY = $2l.y - $2H.y;
            if (!DayPilotCalendar.movingShadow) {
                DayPilotCalendar.movingShadow = $b.$49(DayPilot.Global.moving, !$b.$3u.ie, $b.shadow);
                DayPilotCalendar.movingShadow.style.width = (DayPilotCalendar.movingShadow.parentNode.offsetWidth + 1) + 'px';
            }
        };
        this.$5d.updateMoving = function($2l) {
            var $2g = $b.cellHeight;
            var $I = 0;
            var $0L = DayPilotCalendar.moveOffsetY;
            if (!$0L) {
                $0L = $2g / 2;
            };
            var $2j = Math.floor((($2l.y - $0L - $I) + $2g / 2) / $2g) * $2g + $I;
            if ($2j < $I) {
                $2j = $I;
            };
            var $G = $b.nav.main;
            var $N = $G.clientHeight;
            var $K = parseInt(DayPilotCalendar.movingShadow.style.height);
            if ($2j + $K > $N) {
                $2j = $N - $K;
            };
            DayPilotCalendar.movingShadow.style.top = $2j + 'px';
            var $H = $G.clientWidth / $G.rows[0].cells.length;
            var $q = Math.floor($2l.x / $H);
            if ($q < 0) {
                $q = 0;
            };
            var $0W = $b.nav.events;
            if ($q < $0W.rows[0].cells.length && $q >= 0 && DayPilotCalendar.movingShadow.column !== $q) {
                DayPilotCalendar.movingShadow.column = $q;
                DayPilotCalendar.moveShadow($0W.rows[0].cells[$q]);
            }
        };
        this.$5d.onEventTouchStart = function(ev) {
            if ($2G.active) {
                return;
            };
            $2G.preventEventTap = false;
            var $c = this;
            var x = ev.touches[0].pageX;
            var y = ev.touches[0].pageY;
            var $2l = {
                x: x,
                y: y,
                $c: this
            };
            var $2H = DayPilot.abs($b.nav.scrollable);
            $b.coords = {
                x: x - $2H.x,
                y: y - $2H.y
            };
            var $2J = 500;
            $2G.timeout = window.setTimeout(function() {
                $2G.active = true;
                $2G.startMoving($c, $2l);
            }, $2J);
        };
        this.$5d.onMainTouchMove = function(ev) {
            if ($2G.timeout) {
                window.clearTimeout($b.$5d.timeout);
            };
            if (DayPilot.Global.moving) {
                ev.preventDefault();
                var x = ev.touches[0].pageX;
                var y = ev.touches[0].pageY;
                var $2H = DayPilot.abs($b.nav.main);
                var $2l = {
                    x: x - $2H.x,
                    y: y - $2H.y
                };
                $2G.updateMoving($2l);
                return;
            };
            $2G.preventEventTap = true;
        };
        this.$5d.onMainTouchEnd = function(ev) {
            if (DayPilot.Global.moving) {
                $2G.active = false;
                ev.preventDefault();
                var top = DayPilotCalendar.movingShadow.offsetTop;
                DayPilotCalendar.deleteShadow(DayPilotCalendar.movingShadow);
                var $2K = DayPilot.Global.moving.event;
                var $0n = DayPilotCalendar.movingShadow.column;
                DayPilot.Global.moving = null;
                DayPilotCalendar.movingShadow = null;
                $2K.calendar.$4w($2K, $0n, top);
            }
        };
        this.$5d.onEventTouchMove = function(ev) {
            $2G.preventEventTap = true;
        };
        this.$5d.onEventTouchEnd = function(ev) {
            if (!$2G.active) {
                if ($2G.preventEventTap) {
                    return;
                };
                ev.preventDefault();
                $b.$4k(this, false);
                return;
            };
            $2G.active = false;
            if ($2G.timeout) {
                window.clearTimeout($b.$5d.timeout);
                return;
            }
        };
        this.$5a = function(ev) {
            var $2L = 5;
            var $2M = Math.max($b.durationBarWidth, 10);
            var w = 5;
            var $1h = ($b.moveBy === 'Top');
            if (typeof(DayPilotCalendar) === 'undefined') {
                return;
            };
            var $0L = DayPilot.mo3(this, ev);
            if (!$0L) {
                return;
            };
            var $c = this;
            if (!$c.active) {
                if ($b.cssOnly) {
                    DayPilot.Util.addClass($c, $b.$4a("_event_hover"));
                };
                DayPilot.Areas.showAreas($c, this.event);
            };
            if (DayPilot.Global.resizing || DayPilot.Global.moving) {
                return;
            };
            var $2N = this.isFirst;
            var $2O = this.isLast;
            if ($b.moveBy === "Disabled" || $b.moveBy === "None") {
                return;
            };
            if (!$1h && $0L.x <= $2M && this.event.client.moveEnabled()) {
                if ($2N) {
                    this.style.cursor = 'move';
                } else {
                    this.style.cursor = 'not-allowed';
                }
            } else if (!$1h && $0L.y <= $2L && this.event.client.resizeEnabled()) {
                if ($2N) {
                    this.style.cursor = "n-resize";
                    this.dpBorder = 'top';
                } else {
                    this.style.cursor = 'not-allowed';
                }
            } else if ($1h && $0L.y <= $2M && this.event.client.moveEnabled()) {
                this.style.cursor = "move";
            } else if (this.offsetHeight - $0L.y <= $2L && this.event.client.resizeEnabled()) {
                if ($2O) {
                    this.style.cursor = "s-resize";
                    this.dpBorder = 'bottom';
                } else {
                    this.style.cursor = 'not-allowed';
                }
            } else if (!DayPilot.Global.resizing && !DayPilot.Global.moving) {
                if (this.event.client.clickEnabled()) this.style.cursor = 'pointer';
                else this.style.cursor = 'default';
            };
            if (typeof(DayPilotBubble) !== 'undefined' && $b.bubble && $b.eventHoverHandling !== 'Disabled') {
                if (this.style.cursor === 'default' || this.style.cursor === 'pointer') {
                    var $2P = this.$5K && $0L.x === this.$5K.x && $0L.y === this.$5K.y;
                    if (!$2P) {
                        this.$5K = $0L;
                        $b.bubble.showEvent(this.event);
                    }
                } else {}
            }
        };
        this.$5b = function(ev) {
            if ($b.cssOnly) {
                DayPilot.Util.removeClass(this, $b.$4a("_event_hover"));
            };
            if ($b.bubble) {
                $b.bubble.hideOnMouseOut();
            };
            DayPilot.Areas.hideAreas(this, ev);
        };
        this.$3T = function($0W) {
            if (!$0W) {
                $0W = this.events.list;
            } else {
                this.events.list = $0W;
            };
            if (!$0W) {
                return;
            };
            this.allDay = {};
            this.allDay.events = [];
            this.allDay.lines = [];
            var length = $0W.length;
            var $J = this.$4c(true);
            this.$3t.pixels = {};
            var $2Q = [];
            this.scrollLabels = [];
            this.minStart = 10000;
            this.maxEnd = 0;
            this.startDate = new DayPilot.Date(this.startDate);
            for (var i = 0; i < length; i++) {
                var e = $0W[i];
                e.start = new DayPilot.Date(e.start);
                e.end = new DayPilot.Date(e.end);
            };
            if (typeof this.onBeforeEventRender === 'function') {
                for (var i = 0; i < length; i++) {
                    this.$5J(i);
                }
            };
            var $2R = this.viewType === 'Resources';
            var $2S = this.startDate;
            var $2T = this.startDate.addDays(this.days);
            for (var i = 0; i < this.columnsBottom.length; i++) {
                var scroll = {};
                scroll.minEnd = 1000000;
                scroll.maxStart = -1;
                this.scrollLabels.push(scroll);
                var $1G = this.columnsBottom[i];
                $1G.events = [];
                $1G.lines = [];
                $1G.blocks = [];
                var $2U = new DayPilot.Date($1G.start).addHours(this.$4f(true));
                var $2V = $2U.getTime();
                var $2W = $2U.addTime($J);
                var $2X = $2W.getTime();
                if ($2R) {
                    $2S = $2U.getDatePart();
                    $2T = $2W.getDatePart();
                };
                for (var j = 0; j < length; j++) {
                    if ($2Q[j]) {
                        continue;
                    };
                    var e = $0W[j];
                    var $07 = e.start;
                    var end = e.end;
                    var $2Y = $07.getTime();
                    var $2Z = end.getTime();
                    if ($2Z < $2Y) {
                        continue;
                    };
                    if (e.allday) {
                        var $30 = false;
                        if ($b.allDayEnd === 'Date') {
                            $30 = !($2Z < $2S.getTime() || $2Y >= $2T.getTime());
                        } else {
                            $30 = !($2Z <= $2S.getTime() || $2Y >= $2T.getTime());
                        };
                        if ($2R) {
                            $30 = $30 && (e.resource === $1G.id || $1G.id === "*");
                        };
                        if ($30) {
                            var ep = new DayPilot.Event(e, this);
                            ep.part.start = $2S.getTime() < $2Y ? $07 : $2S;
                            ep.part.end = $2T.getTime() > $2Z ? end : $2T;
                            ep.part.colStart = DayPilot.Date.daysDiff(this.startDate.d, ep.part.start.d);
                            ep.part.colWidth = DayPilot.Date.daysSpan(ep.part.start.d, ep.part.end.d) + 1;
                            if ($2R) {
                                ep.part.colStart = i;
                                ep.part.colWidth = 1;
                            };
                            this.allDay.events.push(ep);
                            if (typeof this.onBeforeEventRender === 'function') {
                                ep.cache = this.$3t.events[j];
                            };
                            $2Q[j] = true;
                            if ($2R && (ep.part.start.getTime() !== $2Y || ep.part.end.getTime() !== $2Z)) {
                                $2Q[j] = false;
                            }
                        };
                        continue;
                    };
                    var $30 = false;
                    if ($2R) {
                        $30 = ($1G.id === e.resource) && !($2Z <= $2V || $2Y >= $2X);
                    } else {
                        $30 = !($2Z <= $2V || $2Y >= $2X) || ($2Z === $2Y && $2Y === $2V);
                    };
                    if ($30) {
                        var ep = new DayPilot.Event(e, $b);
                        ep.part.dayIndex = i;
                        ep.part.start = $2V < $2Y ? $07 : $2U;
                        ep.part.end = $2X > $2Z ? end : $2W;
                        var $31 = this.$5L(ep.part.start, $1G.start);
                        var $32 = this.$5L(ep.part.end, $1G.start);
                        var top = $31.top;
                        var $13 = $32.top;
                        if (top === $13 && ($31.cut || $32.cut)) {
                            continue;
                        };
                        ep.part.box = $0c.useBox($2Z - $2Y);
                        var $I = 0;
                        if (ep.part.box) {
                            var $33 = $32.boxBottom;
                            ep.part.top = Math.floor(top / this.cellHeight) * this.cellHeight + $I;
                            ep.part.height = Math.max(Math.ceil($33 / this.cellHeight) * this.cellHeight - ep.part.top, this.cellHeight - 1);
                            ep.part.barTop = Math.max(top - ep.part.top - 1, 0);
                            ep.part.barHeight = Math.max($13 - top - 2, 1);
                        } else {
                            ep.part.top = top + $I;
                            ep.part.height = Math.max($13 - top, 0);
                            ep.part.barTop = 0;
                            ep.part.barHeight = Math.max($13 - top - 2, 1);
                        };
                        var $07 = ep.part.top;
                        var end = ep.part.top + ep.part.height;
                        if ($07 > scroll.maxStart) {
                            scroll.maxStart = $07;
                        };
                        if (end < scroll.minEnd) {
                            scroll.minEnd = end;
                        };
                        if ($07 < this.minStart) {
                            this.minStart = $07;
                        };
                        if (end > this.maxEnd) {
                            this.maxEnd = end;
                        };
                        $1G.events.push(ep);
                        if (typeof this.onBeforeEventRender === 'function') {
                            ep.cache = this.$3t.events[j];
                        };
                        if (ep.part.start.getTime() === $2Y && ep.part.end.getTime() === $2Z) {
                            $2Q[j] = true;
                        }
                    }
                }
            };
            for (var i = 0; i < this.columnsBottom.length; i++) {
                var $1G = this.columnsBottom[i];
                $1G.events.sort(this.$5M);
                for (var j = 0; j < $1G.events.length; j++) {
                    var e = $1G.events[j];
                    $1G.putIntoBlock(e);
                };
                for (var j = 0; j < $1G.blocks.length; j++) {
                    var $1c = $1G.blocks[j];
                    $1c.events.sort(this.$5N);
                    for (var k = 0; k < $1c.events.length; k++) {
                        var e = $1c.events[k];
                        $1c.putIntoLine(e);
                    }
                }
            };
            this.allDay.events.sort(this.$5N);
            this.allDay.putIntoLine = function(ep) {
                var $1e = this;
                for (var i = 0; i < this.lines.length; i++) {
                    var $1f = this.lines[i];
                    if ($1f.isFree(ep.part.colStart, ep.part.colWidth)) {
                        $1f.push(ep);
                        return i;
                    }
                };
                var $1f = [];
                $1f.isFree = function($07, $1d) {
                    var end = $07 + $1d - 1;
                    var $N = this.length;
                    for (var i = 0; i < $N; i++) {
                        var e = this[i];
                        if (!(end < e.part.colStart || $07 > e.part.colStart + e.part.colWidth - 1)) {
                            return false;
                        }
                    };
                    return true;
                };
                $1f.push(ep);
                this.lines.push($1f);
                return this.lines.length - 1;
            };
            for (var i = 0; i < this.allDay.events.length; i++) {
                var e = this.allDay.events[i];
                this.allDay.putIntoLine(e);
            };
            var $34 = Math.max(this.allDay.lines.length, 1);
            this.allDayHeaderHeight = $34 * (this.allDayEventHeight + 2) + 2;
        };
        this.$5M = function(a, b) {
            if (!a || !b || !a.start || !b.start) {
                return 0;
            };
            var $35 = a.start().ticks - b.start().ticks;
            if ($35 !== 0) {
                return $35;
            };
            var $36 = b.end().ticks - a.end().ticks;
            return $36;
        };
        this.$5N = function(a, b) {
            if (!a || !b) {
                return 0;
            };
            if (!a.data || !b.data || !a.data.sort || !b.data.sort || a.data.sort.length === 0 || b.data.sort.length === 0) {
                return $b.$5M(a, b);
            };
            var $u = 0;
            var i = 0;
            while ($u === 0 && a.data.sort[i] && b.data.sort[i]) {
                if (a.data.sort[i] === b.data.sort[i]) {
                    $u = 0;
                } else {
                    $u = $b.$5O(a.data.sort[i], b.data.sort[i], $b.sortDirections[i]);
                };
                i++;
            };
            return $u;
        };
        this.$5O = function(a, b, $37) {
            var $38 = ($37 !== "desc");
            var $39 = $38 ? -1 : 1;
            var $3a = -$39;
            if (a === null && b === null) {
                return 0;
            };
            if (b === null) {
                return $3a;
            };
            if (a === null) {
                return $39;
            };
            var ar = [];
            ar[0] = a;
            ar[1] = b;
            ar.sort();
            return a === ar[0] ? $39 : $3a;
        };
        this.$5P = function(e) {
            for (var i = 0; i < $b.elements.events.length; i++) {
                var $c = $b.elements.events[i];
                if ($c.event === e) {
                    return $c;
                }
            };
            return null;
        };
        this.events.find = function(id) {
            var $2w = $b.events.list.length;
            for (var i = 0; i < $2w; i++) {
                if ($b.events.list[i].id === id) {
                    return new DayPilot.Event($b.events.list[i], $b);
                }
            };
            return null;
        };
        this.events.findRecurrent = function($3b, $08) {
            var $2w = $b.events.list.length;
            for (var i = 0; i < $2w; i++) {
                if ($b.events.list[i].recurrentMasterId === $3b && $b.events.list[i].start.getTime() === $08.getTime()) {
                    return new DayPilot.Event($b.events.list[i], $b);
                }
            };
            return null;
        };
        this.events.update = function(e, $g) {
            var $0b = {};
            $0b.oldEvent = new DayPilot.Event(e.copy(), $b);
            $0b.newEvent = new DayPilot.Event(e.temp(), $b);
            var $f = new DayPilot.Action($b, "EventUpdate", $0b, $g);
            e.commit();
            $b.update();
            return $f;
        };
        this.events.remove = function(e, $g) {
            var $0b = {};
            $0b.e = new DayPilot.Event(e.data, $b);
            var $f = new DayPilot.Action($b, "EventRemove", $0b, $g);
            var $29 = DayPilot.indexOf($b.events.list, e.data);
            $b.events.list.splice($29, 1);
            $b.update();
            return $f;
        };
        this.events.add = function(e, $g) {
            e.calendar = $b;
            if (!$b.events.list) {
                $b.events.list = [];
            };
            $b.events.list.push(e.data);
            var $0b = {};
            $0b.e = e;
            var $f = new DayPilot.Action($b, "EventAdd", $0b, $g);
            $b.update();
            return $f;
        };
        this.queue = {};
        this.queue.list = [];
        this.queue.list.ignoreToJSON = true;
        this.queue.add = function($f) {
            if (!$f) {
                return;
            };
            if ($f.isAction) {
                $b.queue.list.push($f);
            } else {
                throw "DayPilot.Action object required for queue.add()";
            }
        };
        this.queue.notify = function($g) {
            var $0b = {};
            $0b.actions = $b.queue.list;
            $b.$3y('Notify', $0b, $g, "Notify");
            $b.queue.list = [];
        };
        this.queue.clear = function() {
            $b.queue.list = [];
        };
        this.queue.pop = function() {
            return $b.queue.list.pop();
        };
        this.update = function() {
            if (!this.columnsBottom) {
                return;
            };
            var $3c = true;
            if ($3c) {
                $b.$3E();
                this.$5Q();
                this.$3R();
                this.$3T();
                $b.$3V();
                $b.$3W();
                $b.$3X();
                $b.$3Y();
                $b.$3v();
                $b.$3Z();
                $b.$4I();
                $b.$40();
                $b.$41();
                $b.$42();
                this.$44();
                this.$45();
                $b.$46();
            } else {
                $b.$3E();
                $b.$3T();
                $b.$3U();
                $b.$44();
                $b.$45();
                $b.$46();
            }
        };
        this.show = function() {
            $b.nav.top.style.display = '';
            $b.$42();
        };
        this.hide = function() {
            $b.nav.top.style.display = 'none';
        };
        this.$5R = function($3d, $3e) {
            if (!this.debuggingEnabled) {
                return;
            };
            if (!$b.debugMessages) {
                $b.debugMessages = [];
            };
            $b.debugMessages.push($3d);
            if (typeof console !== 'undefined') {
                console.log($3d);
            }
        };
        this.$5L = function($0s, $07) {
            if (!$07) $07 = this.startDate;
            var $2Y = $07.getTime();
            var $3f = $0s.getTime();
            var $1v = this.$3t.pixels[$3f + "_" + $2Y];
            if ($1v) {
                return $1v;
            };
            $2Y = $07.addHours(this.$4f(true)).getTime();
            var $3g = this.cellDuration * 60 * 1000;
            var $3h = $3f - $2Y;
            var $3i = $3h % $3g;
            var $3j = $3h - $3i;
            var $3k = $3j + $3g;
            if ($3i === 0) {
                $3k = $3j;
            };
            var $u = {};
            $u.cut = false;
            $u.top = this.$5S($3h);
            $u.boxTop = this.$5S($3j);
            $u.boxBottom = this.$5S($3k);
            this.$3t.pixels[$3f + "_" + $2Y] = $u;
            return $u;
        };
        this.$5S = function($3f) {
            return Math.floor((this.cellHeight * $3f) / (1000 * 60 * this.cellDuration));
        };
        this.$5Q = function() {
            this.startDate = new DayPilot.Date(this.startDate);
            this.allDayHeaderHeight = this.allDayEventHeight + 4;
        };
        this.$3U = function() {
            if (this.nav.corner) {
                this.nav.corner.style.height = this.$4g() + "px";
            };
            if (this.nav.cornerRight) {
                this.nav.cornerRight.style.height = this.$4g() + "px";
            };
            if (this.nav.mid) {
                this.nav.mid.style.height = this.$4g() + "px";
            };
            if (this.showAllDayEvents && this.nav.header) {
                var $1M = this.nav.header.rows[this.nav.header.rows.length - 1];
                for (var i = 0; i < $1M.cells.length; i++) {
                    var $q = $1M.cells[i];
                    $q.firstChild.style.height = this.allDayHeaderHeight + "px";
                }
            };
            if (this.nav.upperRight) {
                this.nav.upperRight.style.height = this.$4g() + "px";
            }
        };
        this.$41 = function() {
            var sh = this.$5h();
            if (this.nav.scroll && sh > 0) {
                this.nav.scroll.style.height = sh + "px";
                this.scrollHeight = $b.nav.scroll.clientHeight;
                if (this.nav.bottomLeft) {
                    this.nav.bottomLeft.style.height = sh + "px";
                };
                if (this.nav.bottomRight) {
                    this.nav.bottomRight.style.height = sh + "px";
                }
            }
        };
        this.setHeight = function($1u) {
            if (this.heightSpec !== "Parent100Pct") {
                this.heightSpec = "Fixed";
            };
            if (this.cssOnly) {
                this.height = $1u - (this.$4g());
            } else {
                this.height = $1u - (this.$4g() + 3);
            };
            this.$41();
        };
        this.$58 = {};
        var $0c = this.$58;
        $0c.locale = function() {
            return DayPilot.Locale.find($b.locale);
        };
        $0c.timeFormat = function() {
            if ($b.timeFormat !== 'Auto') {
                return $b.timeFormat;
            };
            return this.locale().timeFormat;
        };
        $0c.useBox = function($3l) {
            if ($b.useEventBoxes === 'Always') {
                return true;
            };
            if ($b.useEventBoxes === 'Never') {
                return false;
            };
            return $3l < $b.cellDuration * 60 * 1000;
        };
        $0c.notifyType = function() {
            var $k;
            if ($b.notifyCommit === 'Immediate') {
                $k = "Notify";
            } else if ($b.notifyCommit === 'Queue') {
                $k = "Queue";
            } else {
                throw "Invalid notifyCommit value: " + $b.notifyCommit;
            };
            return $k;
        };
        this.$5T = function() {
            if (this.backendUrl || typeof WebForm_DoCallback === 'function') {
                return (typeof $b.events.list === 'undefined') || (!$b.events.list);
            } else {
                return false;
            }
        };
        this.$5U = function() {
            this.$5Q();
            this.$3R();
            this.$5g();
            this.$3V();
            this.$3W();
            this.$3Z();
            this.$42();
            this.$5G();
            this.$5I();
            this.$3I();
            DayPilotCalendar.register(this);
            this.$3H();
            this.$47();
            this.$3y('Init');
        };
        this.init = function() {
            this.nav.top = document.getElementById(id);
            if (this.nav.top.dp) {
                return;
            };
            var $3m = this.$5T();
            if ($3m) {
                this.$5U();
                this.initialized = true;
                return;
            };
            this.$5Q();
            this.$3R();
            this.$3S();
            if (this.events.list) {
                this.$3T();
            };
            this.$5g();
            this.$3V();
            this.$3W();
            this.$3Z();
            this.$43();
            this.$42();
            this.$5G();
            this.$5I();
            this.$3I();
            DayPilotCalendar.register(this);
            if (this.events.list) {
                this.$3U();
                this.$44();
                this.$45();
            };
            this.$3H();
            if (this.messageHTML) {
                this.message(this.messageHTML);
            };
            this.$3P(null, false);
            this.$47();
            this.initialized = true;
        };
        this.internal = {};
        this.internal.invokeEvent = this.$4t;
        this.internal.eventMenuClick = this.$4A;
        this.internal.timeRangeMenuClick = this.$4B;
        this.internal.bubbleCallBack = this.$4y;
        this.internal.findEventDiv = this.$5P;
        this.internal.eventDeleteDispatch = this.$4s;
        this.Init = this.init;
    };
    var DayPilotCalendar = {};
    DayPilotCalendar.topSelectedCell = null;
    DayPilotCalendar.bottomSelectedCell = null;
    DayPilotCalendar.selecting = false;
    DayPilotCalendar.column = null;
    DayPilotCalendar.firstSelected = null;
    DayPilotCalendar.firstMousePos = null;
    DayPilotCalendar.originalMouse = null;
    DayPilotCalendar.originalHeight = null;
    DayPilotCalendar.originalTop = null;
    DayPilotCalendar.globalHandlers = false;
    DayPilotCalendar.editing = false;
    DayPilotCalendar.originalText = null;
    DayPilotCalendar.register = function($b) {
        if (!DayPilotCalendar.registered) {
            DayPilotCalendar.registered = [];
        };
        var r = DayPilotCalendar.registered;
        for (var i = 0; i < r.length; i++) {
            if (r[i] === $b) {
                return;
            }
        };
        r.push($b);
    };
    DayPilotCalendar.unregister = function($b) {
        var a = DayPilotCalendar.registered;
        if (a) {
            var i = DayPilot.indexOf(a, $b);
            if (i !== -1) {
                a.splice(i, 1);
            };
            if (a.length === 0) {
                a = null;
            }
        };
        if (!a) {
            DayPilot.ue(document, 'mousemove', DayPilotCalendar.gMouseMove);
            DayPilot.ue(document, 'mouseup', DayPilotCalendar.gMouseUp);
            DayPilotCalendar.globalHandlers = false;
        }
    };
    DayPilotCalendar.getCellsAbove = function($e) {
        var $s = [];
        var c = DayPilotCalendar.getColumn($e);
        var tr = $e.parentNode;
        var $3n = null;
        while (tr && $3n !== DayPilotCalendar.firstSelected) {
            $3n = tr.getElementsByTagName("td")[c];
            $s.push($3n);
            tr = tr.previousSibling;
            while (tr && tr.tagName !== "TR") {
                tr = tr.previousSibling;
            }
        };
        return $s;
    };
    DayPilotCalendar.getCellsBelow = function($e) {
        var $s = [];
        var c = DayPilotCalendar.getColumn($e);
        var tr = $e.parentNode;
        var $3n = null;
        while (tr && $3n !== DayPilotCalendar.firstSelected) {
            $3n = tr.getElementsByTagName("td")[c];
            $s.push($3n);
            tr = tr.nextSibling;
            while (tr && tr.tagName !== "TR") {
                tr = tr.nextSibling;
            }
        };
        return $s;
    };
    DayPilotCalendar.getColumn = function($e) {
        var i = 0;
        while ($e.previousSibling) {
            $e = $e.previousSibling;
            if ($e.tagName === "TD") {
                i++;
            }
        };
        return i;
    };
    DayPilotCalendar.getShadowColumn = function($E) {
        if (!$E) {
            return null;
        };
        var $0S = $E.parentNode;
        while ($0S && $0S.tagName !== "TD") {
            $0S = $0S.parentNode;
        };
        return $0S;
    };
    DayPilotCalendar.gMouseMove = function(ev) {
        if (typeof(DayPilotCalendar) === 'undefined') {
            return;
        };
        if (ev.insideMainD) {
            return;
        } else if (ev.srcElement) {
            if (ev.srcElement.inside) {
                return;
            }
        };
        var $0E = DayPilot.mc(ev);
        if (DayPilotCalendar.drag) {
            document.body.style.cursor = 'move';
            if (!DayPilotCalendar.gShadow) {
                DayPilotCalendar.gShadow = DayPilotCalendar.createGShadow(DayPilotCalendar.drag.shadowType);
            };
            var $L = DayPilotCalendar.gShadow;
            $L.style.left = $0E.x + 'px';
            $L.style.top = $0E.y + 'px';
            DayPilot.Global.moving = null;
            DayPilotCalendar.deleteShadow(DayPilotCalendar.movingShadow);
            DayPilotCalendar.movingShadow = null;
        };
        for (var i = 0; i < DayPilotCalendar.registered.length; i++) {
            if (DayPilotCalendar.registered[i].$3K) {
                DayPilotCalendar.registered[i].$3K();
            }
        }
    };
    DayPilotCalendar.gUnload = function(ev) {
        if (!DayPilotCalendar.registered) {
            return;
        };
        var r = DayPilotCalendar.registered;
        for (var i = 0; i < r.length; i++) {
            var c = r[i];
            DayPilotCalendar.unregister(c);
        }
    };
    DayPilotCalendar.gMouseUp = function(e) {
        var e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        };
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        };
        if (DayPilot.Global.resizing) {
            if (!DayPilotCalendar.resizingShadow) {
                DayPilot.Global.resizing.style.cursor = 'default';
                DayPilot.Global.resizing.event.calendar.nav.top.style.cursor = 'auto';
                DayPilot.Global.resizing = null;
                return;
            };
            var $2K = DayPilot.Global.resizing.event;
            var $0f = DayPilot.Global.resizing.dpBorder;
            var $K = DayPilotCalendar.resizingShadow.clientHeight;
            var top = DayPilotCalendar.resizingShadow.offsetTop;
            DayPilotCalendar.deleteShadow(DayPilotCalendar.resizingShadow);
            DayPilotCalendar.resizingShadow = null;
            DayPilot.Global.resizing.style.cursor = 'default';
            $2K.calendar.nav.top.style.cursor = 'auto';
            DayPilot.Global.resizing.onclick = null;
            DayPilot.Global.resizing = null;
            if ($2K.calendar.overlap) {
                return;
            };
            $2K.calendar.$4u($2K, $K, top, $0f);
        } else if (DayPilot.Global.moving) {
            if (!DayPilotCalendar.movingShadow) {
                DayPilot.Global.moving.event.calendar.nav.top.style.cursor = 'auto';
                DayPilot.Global.moving = null;
                return;
            };
            var $3o = DayPilot.Global.moving.helper.oldColumn;
            var top = DayPilotCalendar.movingShadow.offsetTop;
            DayPilotCalendar.deleteShadow(DayPilotCalendar.movingShadow);
            var $2K = DayPilot.Global.moving.event;
            var $0n = DayPilotCalendar.movingShadow.column;
            var $0o = DayPilotCalendar.drag;
            DayPilot.Global.moving.event.calendar.nav.top.style.cursor = 'auto';
            DayPilot.Global.moving = null;
            DayPilotCalendar.movingShadow = null;
            if ($0o) {
                if (!$2K.calendar.todo) {
                    $2K.calendar.todo = {};
                };
                $2K.calendar.todo.del = $0o.element;
            };
            if ($2K.calendar.overlap) {
                return;
            };
            var ev = e || window.event;
            $2K.calendar.$4w($2K, $0n, top, ev, $0o);
        };
        if (DayPilotCalendar.drag) {
            DayPilotCalendar.drag = null;
            document.body.style.cursor = '';
        };
        if (DayPilotCalendar.gShadow) {
            document.body.removeChild(DayPilotCalendar.gShadow);
            DayPilotCalendar.gShadow = null;
        };
        DayPilotCalendar.moveOffsetY = null;
    };
    DayPilotCalendar.dragStart = function(element, $J, id, $1Y, $k) {
        DayPilot.us(element);
        var $0o = DayPilotCalendar.drag = {};
        $0o.element = element;
        $0o.duration = $J;
        $0o.text = $1Y;
        $0o.id = id;
        $0o.shadowType = $k ? $k : 'Fill';
        return false;
    };
    DayPilotCalendar.deleteShadow = function($L) {
        if (!$L) {
            return;
        };
        if (!$L.parentNode) {
            return;
        };
        $L.parentNode.removeChild($L);
    };
    DayPilotCalendar.createGShadow = function($k) {
        var $L = document.createElement('div');
        $L.setAttribute('unselectable', 'on');
        $L.style.position = 'absolute';
        $L.style.width = '100px';
        $L.style.height = '20px';
        $L.style.border = '2px dotted #666666';
        $L.style.zIndex = 101;
        if ($k === 'Fill') {
            $L.style.backgroundColor = "#aaaaaa";
            $L.style.opacity = 0.5;
            $L.style.filter = "alpha(opacity=50)";
            $L.style.border = '2px solid #aaaaaa';
        };
        document.body.appendChild($L);
        return $L;
    };
    DayPilotCalendar.moveShadow = function($q) {
        var $L = DayPilotCalendar.movingShadow;
        $L.parentNode.removeChild($L);
        $q.firstChild.appendChild($L);
        $L.style.left = '0px';
        $L.style.width = (DayPilotCalendar.movingShadow.parentNode.offsetWidth) + 'px';
    };
    DayPilotCalendar.Column = function($3p, name, $0s) {
        this.value = $3p;
        this.id = $3p;
        this.name = name;
        this.date = new DayPilot.Date($0s);
    };
    DayPilot.CalendarVisible.dragStart = DayPilotCalendar.dragStart;
    DayPilot.CalendarVisible.Calendar = DayPilotCalendar.Calendar;
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotCalendar = function($3q) {
                var $0C = null;
                var j = this.each(function() {
                    if (this.daypilot) {
                        return;
                    };
                    var $3r = new DayPilot.Calendar(this.id);
                    this.daypilot = $3r;
                    for (var name in $3q) {
                        $3r[name] = $3q[name];
                    };
                    $3r.Init();
                    if (!$0C) {
                        $0C = $3r;
                    }
                });
                if (this.length === 1) {
                    return $0C;
                } else {
                    return j;
                }
            };
        })(jQuery);
    };
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilot.Global === 'undefined') {
    DayPilot.Global = {};
};
(function() {
    if (typeof DayPilot.$ !== 'undefined') {
        return;
    };
    DayPilot.$ = function(id) {
        return document.getElementById(id);
    };
    DayPilot.mo = function(t, ev) {
        ev = ev || window.event;
        if (ev.layerX) {
            var $a = {
                x: ev.layerX,
                y: ev.layerY
            };
            if (!t) {
                return $a;
            };
            return $a;
        };
        if (ev.offsetX) {
            return {
                x: ev.offsetX,
                y: ev.offsetY
            };
        };
        return null;
    };
    DayPilot.isKhtml = (navigator && navigator.userAgent && navigator.userAgent.indexOf("KHTML") !== -1);
    DayPilot.isIE = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE") !== -1);
    DayPilot.isIE7 = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE 7") !== -1);
    DayPilot.isIEQuirks = DayPilot.isIE && (document.compatMode && document.compatMode === "BackCompat");
    DayPilot.mo2 = function($b, ev) {
        ev = ev || window.event;
        if (typeof(ev.offsetX) !== 'undefined') {
            var $a = {
                x: ev.offsetX + 1,
                y: ev.offsetY + 1
            };
            if (!$b) {
                return $a;
            };
            var $c = ev.srcElement;
            while ($c && $c !== $b) {
                if ($c.tagName !== 'SPAN') {
                    $a.x += $c.offsetLeft;
                    if ($c.offsetTop > 0) {
                        $a.y += $c.offsetTop - $c.scrollTop;
                    }
                };
                $c = $c.offsetParent;
            };
            if ($c) {
                return $a;
            };
            return null;
        };
        if (typeof(ev.layerX) !== 'undefined') {
            var $a = {
                x: ev.layerX,
                y: ev.layerY,
                $d: ev.target
            };
            if (!$b) {
                return $a;
            };
            var $c = ev.target;
            while ($c && $c.style.position !== 'absolute' && $c.style.position !== 'relative') {
                $c = $c.parentNode;
                if (DayPilot.isKhtml) {
                    $a.y += $c.scrollTop;
                }
            }
            while ($c && $c !== $b) {
                $a.x += $c.offsetLeft;
                $a.y += $c.offsetTop - $c.scrollTop;
                $c = $c.offsetParent;
            };
            if ($c) {
                return $a;
            };
            return null;
        };
        return null;
    };
    DayPilot.mo3 = function($b, ev) {
        ev = ev || window.event;
        var $e = DayPilot.page(ev);
        if ($e) {
            var $f = DayPilot.abs($b);
            return {
                x: $e.x - $f.x,
                y: $e.y - $f.y
            };
        };
        return DayPilot.mo2($b, ev);
    };
    DayPilot.mc = function(ev) {
        if (ev.pageX || ev.pageY) {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        };
        return {
            x: ev.clientX + document.documentElement.scrollLeft,
            y: ev.clientY + document.documentElement.scrollTop
        };
    };
    DayPilot.complete = function(f) {
        if (document.readyState === "complete") {
            f();
            return;
        };
        if (!DayPilot.complete.list) {
            DayPilot.complete.list = [];
            DayPilot.re(document, "readystatechange", function() {
                if (document.readyState === "complete") {
                    for (var i = 0; i < DayPilot.complete.list.length; i++) {
                        var d = DayPilot.complete.list[i];
                        d();
                    };
                    DayPilot.complete.list = [];
                }
            });
        };
        DayPilot.complete.list.push(f);
    };
    DayPilot.page = function(ev) {
        ev = ev || window.event;
        if (typeof ev.pageX !== 'undefined') {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        };
        if (typeof ev.clientX !== 'undefined') {
            return {
                x: ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: ev.clientY + document.body.scrollTop + document.documentElement.scrollTop
            };
        };
        return null;
    };
    DayPilot.abs = function(element, $g) {
        if (!element) {
            return null;
        };
        var r = {
            x: element.offsetLeft,
            y: element.offsetTop,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };
        if (element.getBoundingClientRect) {
            var b = null;
            try {
                b = element.getBoundingClientRect();
            } catch (e) {
                b = {
                    top: element.offsetTop,
                    $h: element.offsetLeft
                };
            };
            r.x = b.left;
            r.y = b.top;
            var d = DayPilot.doc();
            r.x -= d.clientLeft || 0;
            r.y -= d.clientTop || 0;
            var $i = DayPilot.pageOffset();
            r.x += $i.x;
            r.y += $i.y;
            if ($g) {
                var $j = DayPilot.absOffsetBased(element, false);
                var $g = DayPilot.absOffsetBased(element, true);
                r.x += $g.x - $j.x;
                r.y += $g.y - $j.y;
                r.w = $g.w;
                r.h = $g.h;
            };
            return r;
        } else {
            return DayPilot.absOffsetBased(element, $g);
        }
    };
    DayPilot.isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
    DayPilot.absOffsetBased = function(element, $g) {
        var r = {
            x: element.offsetLeft,
            y: element.offsetTop,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };
        while (DayPilot.op(element)) {
            element = DayPilot.op(element);
            r.x -= element.scrollLeft;
            r.y -= element.scrollTop;
            if ($g) {
                if (r.x < 0) {
                    r.w += r.x;
                    r.x = 0;
                };
                if (r.y < 0) {
                    r.h += r.y;
                    r.y = 0;
                };
                if (element.scrollLeft > 0 && r.x + r.w > element.clientWidth) {
                    r.w -= r.x + r.w - element.clientWidth;
                };
                if (element.scrollTop && r.y + r.h > element.clientHeight) {
                    r.h -= r.y + r.h - element.clientHeight;
                }
            };
            r.x += element.offsetLeft;
            r.y += element.offsetTop;
        };
        var $i = DayPilot.pageOffset();
        r.x += $i.x;
        r.y += $i.y;
        return r;
    };
    DayPilot.wd = function() {
        var $k = DayPilot.isIEQuirks;
        var $l = document.documentElement.clientHeight;
        if ($k) {
            $l = document.body.clientHeight;
        };
        var $m = document.documentElement.clientWidth;
        if ($k) {
            $m = document.body.clientWidth;
        };
        var $n = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var $o = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
        var $p = {};
        $p.width = $m;
        $p.height = $l;
        $p.scrollTop = $n;
        $p.scrollLeft = $o;
        return $p;
    };
    DayPilot.op = function(element) {
        try {
            return element.offsetParent;
        } catch (e) {
            return document.body;
        }
    };
    DayPilot.distance = function($q, $r) {
        return Math.sqrt(Math.pow($q.x - $r.x, 2) + Math.pow($q.y - $r.y, 2));
    };
    DayPilot.doc = function() {
        var de = document.documentElement;
        return (de && de.clientHeight) ? de : document.body;
    };
    DayPilot.pageOffset = function() {
        if (typeof pageXOffset !== 'undefined') {
            return {
                x: pageXOffset,
                y: pageYOffset
            };
        };
        var d = DayPilot.doc();
        return {
            x: d.scrollLeft,
            y: d.scrollTop
        };
    };
    DayPilot.ac = function(e, $s) {
        if (!$s) {
            var $s = [];
        };
        for (var i = 0; e.children && i < e.children.length; i++) {
            $s.push(e.children[i]);
            DayPilot.ac(e.children[i], $s);
        };
        return $s;
    };
    DayPilot.indexOf = function($t, $u) {
        if (!$t || !$t.length) {
            return -1;
        };
        for (var i = 0; i < $t.length; i++) {
            if ($t[i] === $u) {
                return i;
            }
        };
        return -1;
    };
    DayPilot.rfa = function($t, $u) {
        var i = DayPilot.indexOf($t, $u);
        if (i === -1) {
            return;
        };
        $t.splice(i, 1);
    };
    DayPilot.debug = function($v, $w) {
        if (!DayPilot.debugMessages) {
            DayPilot.debugMessages = [];
        };
        DayPilot.debugMessages.push($v);
        if (typeof console !== 'undefined') {
            console.log($v);
        }
    };
    DayPilot.debug.show = function() {
        alert("Log:\n" + DayPilot.debugMessages.join("\n"));
    };
    DayPilot.debug.clear = function() {
        DayPilot.debugMessages = [];
    };
    DayPilot.re = function(el, ev, $x) {
        if (el.addEventListener) {
            el.addEventListener(ev, $x, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + ev, $x);
        }
    };
    DayPilot.ue = function(el, ev, $x) {
        if (el.removeEventListener) {
            el.removeEventListener(ev, $x, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + ev, $x);
        }
    };
    DayPilot.tr = function($y) {
        if (!$y) return '';
        return $y.replace(/^\s+|\s+$/g, "");
    };
    DayPilot.ds = function(d) {
        return DayPilot.Date.toStringSortable(d);
    };
    DayPilot.gs = function(el, $z) {
        var x = el;
        if (x.currentStyle) var y = x.currentStyle[$z];
        else if (window.getComputedStyle) var y = document.defaultView.getComputedStyle(x, null).getPropertyValue($z);
        if (typeof(y) === 'undefined') y = '';
        return y;
    };
    DayPilot.ea = function(a) {
        var $A = "";
        for (var i = 0; i < a.length; i++) {
            if (a[i] || typeof(a[i]) === 'number') {
                if (a[i].isDayPilotDate) {
                    a[i] = a[i].toStringSortable();
                } else if (a[i].getFullYear) {
                    a[i] = DayPilot.ds(a[i]);
                };
                $A += encodeURIComponent(a[i]);
            };
            if (i + 1 < a.length) {
                $A += '&';
            }
        };
        return $A;
    };
    DayPilot.he = function(str) {
        var $p = str.replace(/&/g, "&amp;");
        $p = $p.replace(/</g, "&lt;");
        $p = $p.replace(/>/g, "&gt;");
        $p = $p.replace(/"/g, "&quot;");
        return $p;
    };
    DayPilot.ci = function($B) {
        var i = $B.cellIndex;
        if (i && i > 0) return i;
        var tr = $B.parentNode;
        var $C = tr.cells.length;
        for (i = 0; i < $C; i++) {
            if (tr.cells[i] === $B) return i;
        };
        return null;
    };
    DayPilot.us = function(element) {
        if (element) {
            element.setAttribute("unselectable", "on");
            element.style.MozUserSelect = 'none';
            for (var i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].nodeType === 1) {
                    DayPilot.us(element.childNodes[i]);
                }
            }
        }
    };
    DayPilot.pu = function(d) {
        var a = d.attributes,
            i, l, n;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                if (!a[i]) {
                    continue;
                };
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        };
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                var $s = DayPilot.pu(d.childNodes[i]);
            }
        }
    };
    DayPilot.puc = function(d) {
        var a = d.childNodes,
            i, l;
        if (a) {
            var l = a.length;
            for (i = 0; i < l; i += 1) {
                DayPilot.pu(d.childNodes[i]);
            }
        }
    };
    DayPilot.de = function(e) {
        if (!e) {
            return;
        };
        if (!e.parentNode) {
            return;
        };
        e.parentNode.removeChild(e);
    };
    DayPilot.gr = function($B) {
        var i = 0;
        var tr = $B.parentNode;
        while (tr.previousSibling) {
            tr = tr.previousSibling;
            if (tr.tagName === "TR") {
                i++;
            }
        };
        return i;
    };
    DayPilot.fade = function(element, $D, end) {
        var $E = 50;
        var $g = element.style.display !== 'none';
        var $F = $D > 0;
        var $G = $D < 0;
        if ($D === 0) {
            return;
        };
        if ($F && !$g) {
            element.target = parseFloat(element.style.opacity);
            element.opacity = 0;
            element.style.opacity = 0;
            element.style.filter = "alpha(opacity=0)";
            element.style.display = '';
        } else if ($G && !element.target) {
            element.target = element.style.opacity;
        } else {
            var $c = element.opacity;
            var $H = Math.floor(10 * ($c + $D)) / 10;
            if ($F && $H > element.target) {
                $H = element.target;
            };
            if ($G && $H < 0) {
                $H = 0;
            };
            var ie = $H * 100;
            element.opacity = $H;
            element.style.opacity = $H;
            element.style.filter = "alpha(opacity=" + ie + ")";
        };
        if (($F && (element.opacity >= element.target || element.opacity >= 1)) || ($G && element.opacity <= 0)) {
            element.target = null;
            if ($G) {
                element.style.opacity = element.target;
                element.opacity = element.target;
                var $I = element.target ? "alpha(opacity=" + (element.target * 100) + ")" : null;
                element.style.filter = $I;
                element.style.display = 'none';
            };
            if (end && typeof end === 'function') {
                end();
            }
        } else {
            this.messageTimeout = setTimeout(function() {
                DayPilot.fade(element, $D, end);
            }, $E);
        }
    };
    DayPilot.sw = function(element) {
        if (!element) {
            return 0;
        };
        return element.offsetWidth - element.clientWidth;
    };
    DayPilot.sh = function(element) {
        if (!element) {
            return 0;
        };
        return element.offsetHeight - element.clientHeight;
    };
    DayPilot.guid = function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return ("" + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    DayPilot.ua = function($t) {
        var u = {},
            a = [];
        for (var i = 0, l = $t.length; i < l; ++i) {
            if ($t[i] in u) continue;
            a.push($t[i]);
            u[$t[i]] = 1;
        };
        return a;
    };
    (function() {
        DayPilot.pop = wave;

        function wave($J, $K) {
            var $b = {
                w: $J.offsetWidth,
                h: $J.offsetHeight,
                x: parseInt($J.style.left),
                y: parseInt($J.style.top)
            };
            $b.height = $J.style.height;
            $b.width = $J.style.width;
            $b.top = $J.style.top;
            $b.left = $J.style.left;
            $b.toString = function() {
                return "w: " + this.w + " h:" + this.h
            };
            var $L = {};
            $L.finished = null;
            $L.vertical = 'center';
            $L.horizontal = 'center';
            if ($K) {
                for (var name in $K) {
                    $L[name] = $K[name];
                }
            };
            $J.style.visibility = 'hidden';
            $J.style.display = '';
            var $M = $K.animation || "fast";
            var $N = createPlan($M);
            $N.div = $J;
            $N.i = 0;
            $N.target = $b;
            $N.config = $L;
            doStep($N);
        };

        function createPlan($O) {
            var $P = function() {
                var $N = [];
                $N.time = 10;
                var $Q;
                var $D = 0.08;
                $Q = 0.1;
                for (var i = $Q; i < 1.2; i += $D) {
                    $N.push(i);
                    $Q = i;
                };
                $D = 0.03;
                for (var i = $Q; i > 0.8; i -= $D) {
                    $N.push(i);
                    $Q = i;
                };
                for (var i = $Q; i <= 1; i += $D) {
                    $N.push(i);
                    $Q = i;
                };
                return $N;
            };
            var $R = function() {
                var $N = [];
                $N.time = 15;
                var $Q;
                var $D = 0.04;
                $Q = 0.1;
                for (var i = $Q; i <= 1; i += $D) {
                    $N.push(i);
                    $Q = i;
                };
                return $N;
            };
            var $S = function() {
                var $N = [];
                $N.time = 9;
                var $Q;
                var $D = 0.04;
                $Q = 0.1;
                for (var i = $Q; i <= 1; i += $D) {
                    $N.push(i);
                    $Q = i;
                };
                return $N;
            };
            var $T = {
                "fast": $S,
                "slow": $R,
                "jump": $P
            };
            if (!$T[$O]) {
                $O = "fast";
            };
            return $T[$O]();
        };

        function doStep($N) {
            var $J = $N.div;
            var $U = $N[$N.i];
            var $V = $U * $N.target.h;
            var top;
            switch ($N.config.vertical) {
                case "center":
                    top = $N.target.y - ($V - $N.target.h) / 2;
                    break;
                case "top":
                    top = $N.target.y;
                    break;
                case "bottom":
                    top = $N.target.y - ($V - $N.target.h);
                    break;
                default:
                    throw "Unexpected 'vertical' value.";
            };
            var $W = $U * $N.target.w;
            var $h;
            switch ($N.config.horizontal) {
                case "left":
                    $h = $N.target.x;
                    break;
                case "center":
                    $h = $N.target.x - ($W - $N.target.w) / 2;
                    break;
                case "right":
                    $h = $N.target.x - ($W - $N.target.w);
                    break;
                default:
                    throw "Unexpected 'horizontal' value.";
            };
            var wd = DayPilot.wd();
            var $X = (wd.height + wd.scrollTop) - (top + $V);
            if ($X < 0) {
                top += $X;
            };
            var $Y = (wd.width) - ($h + $W);
            if ($Y < 0) {
                $h += $Y;
            };
            $J.style.height = $V + "px";
            $J.style.top = top + "px";
            $J.style.width = $W + "px";
            $J.style.left = $h + "px";
            $J.style.visibility = 'visible';
            $N.i++;
            if ($N.i < $N.length - 1) {
                setTimeout((function($N) {
                    return function() {
                        doStep($N);
                    };
                })($N), $N.time);
            } else {
                $J.style.width = $N.target.width;
                $J.style.height = $N.target.height;
                $J.style.top = $N.target.top;
                $J.style.left = $N.target.left;
                if (typeof $N.config.finished === 'function') {
                    $N.config.finished();
                }
            }
        }
    })();
    DayPilot.Util = {};
    DayPilot.Util.addClass = function($u, name) {
        if (!$u) {
            return;
        };
        if (!$u.className) {
            $u.className = name;
            return;
        };
        var $Z = new RegExp("(^|\\s)" + name + "($|\\s)");
        if (!$Z.test($u.className)) {
            $u.className = $u.className + ' ' + name;
        }
    };
    DayPilot.Util.addClassToString = function(str, name) {
        if (!str) {
            return name;
        };
        var $Z = new RegExp("(^|\\s)" + name + "($|\\s)");
        if (!$Z.test(str)) {
            return str + ' ' + name;
        } else {
            return str;
        }
    };
    DayPilot.Util.removeClass = function($u, name) {
        if (!$u) {
            return;
        };
        var $Z = new RegExp("(^|\\s)" + name + "($|\\s)");
        $u.className = $u.className.replace($Z, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
    DayPilot.Util.props = function(o) {
        var t = [];
        for (a in o) {
            t.push(a);
            t.push(o[a]);
        };
        return t.join("-");
    };
    DayPilot.Util.propArray = function($00, name) {
        var $p = [];
        if (!$00 || !$00.length) {
            return $p;
        };
        for (var i = 0; i < $00.length; i++) {
            $p.push($00[i][name]);
        };
        return $p;
    };
    DayPilot.Util.updatePropsFromArray = function($00, name, $t) {
        for (var i = 0; i < $t.length; i++) {
            $00[i][name] = $t[i];
        }
    };
    DayPilot.Util.copyProps = function($01, $b, $00) {
        if (!$01) {
            return;
        };
        if (typeof $00 === 'undefined') {
            for (var name in $01) {
                $b[name] = $01[name];
            }
        } else {
            for (var i = 0; i < $00.length; i++) {
                var name = $00[i];
                $b[name] = $01[name];
            }
        }
    };
    DayPilot.Areas = {};
    DayPilot.Areas.showAreas = function($J, e, ev) {
        if (DayPilot.Global.resizing) {
            return;
        };
        if (DayPilot.Global.moving) {
            return;
        };
        if (DayPilot.Areas.all && DayPilot.Areas.all.length > 0) {
            for (var i = 0; i < DayPilot.Areas.all.length; i++) {
                var d = DayPilot.Areas.all[i];
                if (d !== $J) {
                    DayPilot.Areas.hideAreas(d, ev);
                }
            }
        };
        if ($J.active) {
            return;
        };
        $J.active = {};
        var $02 = e.areas;
        if (!$02 && e.data && e.data.areas) {
            $02 = e.data.areas;
        };
        if (!$02 || $02.length === 0) {
            return;
        };
        if ($J.areas && $J.areas.length > 0) {
            return;
        };
        $J.areas = [];
        for (var i = 0; i < $02.length; i++) {
            var $03 = $02[i];
            if ($03.v !== 'Hover') {
                continue;
            };
            var a = DayPilot.Areas.createArea($J, e, $03);
            $J.areas.push(a);
            $J.appendChild(a);
            DayPilot.Areas.all.push($J);
        };
        $J.active.children = DayPilot.ac($J);
    };
    DayPilot.Areas.createArea = function($J, e, $03) {
        var a = document.createElement("div");
        a.style.position = "absolute";
        if (typeof $03.w !== 'undefined') {
            a.style.width = $03.w + "px";
        };
        if (typeof $03.h !== 'undefined') {
            a.style.height = $03.h + "px";
        };
        if (typeof $03.right !== 'undefined') {
            a.style.right = $03.right + "px";
        };
        if (typeof $03.top !== 'undefined') {
            a.style.top = $03.top + "px";
        };
        if (typeof $03.left !== 'undefined') {
            a.style.left = $03.left + "px";
        };
        if (typeof $03.bottom !== 'undefined') {
            a.style.bottom = $03.bottom + "px";
        };
        if (typeof $03.html !== 'undefined' && $03.html) {
            a.innerHTML = $03.html;
        };
        if ($03.css) {
            a.className = $03.css;
        };
        if ($03.action === "ResizeEnd" || $03.action === "ResizeStart" || $03.action === "Move") {
            if (e.calendar.isCalendar) {
                switch ($03.action) {
                    case "ResizeEnd":
                        $03.cursor = "s-resize";
                        $03.dpBorder = "bottom";
                        break;
                    case "ResizeStart":
                        $03.cursor = "n-resize";
                        $03.dpBorder = "top";
                        break;
                    case "Move":
                        $03.cursor = "move";
                        break;
                }
            };
            if (e.calendar.isScheduler || e.calendar.isMonth) {
                switch ($03.action) {
                    case "ResizeEnd":
                        $03.cursor = "e-resize";
                        $03.dpBorder = "right";
                        break;
                    case "ResizeStart":
                        $03.cursor = "w-resize";
                        $03.dpBorder = "left";
                        break;
                    case "Move":
                        $03.cursor = "move";
                        break;
                }
            };
            a.onmousemove = (function($J, e, $03) {
                return function(ev) {
                    var ev = ev || window.event;
                    $J.style.cursor = $03.cursor;
                    if ($03.dpBorder) $J.dpBorder = $03.dpBorder;
                    ev.cancelBubble = true;
                };
            })($J, e, $03);
            a.onmouseout = (function($J, e, $03) {
                return function(ev) {
                    $J.style.cursor = '';
                };
            })($J, e, $03);
        };
        if ($03.action === "Bubble" && e.isEvent) {
            a.onmousemove = (function($J, e, $03) {
                return function(ev) {
                    if (e.calendar.bubble) {
                        e.calendar.bubble.showEvent(e);
                    }
                };
            })($J, e, $03);
            a.onmouseout = (function($J, e, $03) {
                return function(ev) {
                    if (typeof DayPilot.Bubble !== "undefined") {
                        if (e.calendar.bubble) {
                            e.calendar.bubble.hideOnMouseOut();
                        }
                    }
                };
            })($J, e, $03);
        };
        a.onmousedown = (function($J, e, $03) {
            return function(ev) {
                if (!e.calendar) {
                    return;
                };
                var $04 = false;
                if (e.calendar.isMonth) {
                    $04 = true;
                };
                if (e.calendar.isScheduler && e.calendar.moveBy === 'Full') {
                    $04 = true;
                };
                if ($04) {
                    if ($03.action === "Move" || $03.action === "ResizeEnd" || $03.action === "ResizeStart") {
                        return;
                    };
                    ev = ev || window.event;
                    ev.cancelBubble = true;
                }
            };
        })($J, e, $03);
        a.onclick = (function($J, e, $03) {
            return function(ev) {
                var ev = ev || window.event;
                switch ($03.action) {
                    case "JavaScript":
                        var f = $03.js;
                        if (typeof f === 'string') {
                            f = eval("0, " + $03.js);
                        };
                        if (typeof f === 'function') {
                            f.call(this, e);
                        };
                        break;
                    case "ContextMenu":
                        var m = $03.menu;
                        if (typeof m === 'string') {
                            m = eval(m);
                        };
                        if (m && m.show) {
                            m.show(e);
                        };
                        break;
                    case "CallBack":
                        alert("callback not implemented yet, id: " + $03.id);
                        break;
                };
                ev.cancelBubble = true;
            };
        })($J, e, $03);
        return a;
    };
    DayPilot.Areas.all = [];
    DayPilot.Areas.hideAreas = function($J, ev) {
        if (!$J) {
            return;
        };
        if (!$J || !$J.active) {
            return;
        };
        var $05 = $J.active;
        var $02 = $J.areas;
        if ($05 && $05.children) {
            var ev = ev || window.event;
            if (ev) {
                var $b = ev.toElement || ev.relatedTarget;
                if (~DayPilot.indexOf($05.children, $b)) {
                    return;
                }
            }
        };
        if (!$02 || $02.length === 0) {
            $J.active = null;
            return;
        };
        for (var i = 0; i < $02.length; i++) {
            var a = $02[i];
            $J.removeChild(a);
        };
        $J.active = null;
        $J.areas = [];
        DayPilot.rfa(DayPilot.Areas.all, $J);
        $05.children = null;
    };
    DayPilot.Areas.hideAll = function(ev) {
        if (!DayPilot.Areas.all || DayPilot.Areas.all.length === 0) {
            return;
        };
        for (var i = 0; i < DayPilot.Areas.all.length; i++) {
            DayPilot.Areas.hideAreas(DayPilot.Areas.all[i], ev);
        }
    };
    DayPilot.Action = function($06, $07, $08, $09) {
        this.calendar = $06;
        this.isAction = true;
        this.action = $07;
        this.params = $08;
        this.data = $09;
        this.notify = function() {
            $06.internal.invokeEvent("Immediate", this.action, this.params, this.data);
        };
        this.auto = function() {
            $06.internal.invokeEvent("Notify", this.action, this.params, this.data);
        };
        this.queue = function() {
            $06.queue.add(this);
        };
        this.toJSON = function() {
            var $0a = {};
            $0a.name = this.action;
            $0a.params = this.params;
            $0a.data = this.data;
            return $0a;
        };
    };
    DayPilot.Selection = function($0b, end, $0c, $0d) {
        this.type = 'selection';
        this.start = $0b.isDayPilotDate ? $0b : new DayPilot.Date($0b);
        this.end = end.isDayPilotDate ? end : new DayPilot.Date(end);
        this.resource = $0c;
        this.root = $0d;
        this.toJSON = function($0e) {
            var $0a = {};
            $0a.start = this.start;
            $0a.end = this.end;
            $0a.resource = this.resource;
            return $0a;
        };
    };
    DayPilot.Event = function($09, $06, $0f) {
        var e = this;
        this.calendar = $06;
        this.data = $09 ? $09 : {};
        this.part = $0f ? $0f : {};
        if (typeof this.data.id === 'undefined') {
            this.data.id = this.data.value;
        };
        var $0g = {};
        var $0h = ["id", "text", "start", "end", "resource"];
        this.isEvent = true;
        this.temp = function() {
            if ($0g.dirty) {
                return $0g;
            };
            for (var i = 0; i < $0h.length; i++) {
                $0g[$0h[i]] = e.data[$0h[i]];
            };
            $0g.dirty = true;
            return $0g;
        };
        this.copy = function() {
            var $p = {};
            for (var i = 0; i < $0h.length; i++) {
                $p[$0h[i]] = e.data[$0h[i]];
            };
            return $p;
        };
        this.commit = function() {
            if (!$0g.dirty) {
                return;
            };
            for (var i = 0; i < $0h.length; i++) {
                e.data[$0h[i]] = $0g[$0h[i]];
            };
            $0g.dirty = false;
        };
        this.dirty = function() {
            return $0g.dirty;
        };
        this.id = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.data.id;
            } else {
                this.temp().id = $0i;
            }
        };
        this.value = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.id();
            } else {
                e.id($0i);
            }
        };
        this.text = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.data.text;
            } else {
                this.temp().text = $0i;
                this.client.innerHTML($0i);
            }
        };
        this.start = function($0i) {
            if (typeof $0i === 'undefined') {
                return new DayPilot.Date(e.data.start);
            } else {
                this.temp().start = new DayPilot.Date($0i);
            }
        };
        this.end = function($0i) {
            if (typeof $0i === 'undefined') {
                return new DayPilot.Date(e.data.end);
            } else {
                this.temp().end = new DayPilot.Date($0i);
            }
        };
        this.partStart = function() {
            return new DayPilot.Date(this.part.start);
        };
        this.partEnd = function() {
            return new DayPilot.Date(this.part.end);
        };
        this.row = function() {
            return this.resource();
        };
        this.allday = function() {
            if (typeof $0i === 'undefined') {
                return e.data.allday;
            } else {
                this.temp().allday = $0i;
            }
        };
        this.isAllDay = this.allday;
        this.resource = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.data.resource;
            } else {
                this.temp().resource = $0i;
            }
        };
        this.recurrent = function() {
            return e.data.recurrent;
        };
        this.recurrentMasterId = function() {
            return e.data.recurrentMasterId;
        };
        this.useBox = function() {
            return this.part.box;
        };
        this.staticBubbleHTML = function() {
            return this.bubbleHtml();
        };
        this.bubbleHtml = function() {
            if (e.cache) {
                return e.cache.bubbleHtml || e.data.bubbleHtml;
            };
            return e.data.bubbleHtml;
        };
        this.tag = function($0j) {
            var $0k = e.data.tag;
            if (!$0k) {
                return null;
            };
            if (typeof $0j === 'undefined') {
                return e.data.tag;
            };
            var $0l = e.calendar.tagFields;
            var $0m = -1;
            for (var i = 0; i < $0l.length; i++) {
                if ($0j === $0l[i]) $0m = i;
            };
            if ($0m === -1) {
                throw "Field name not found.";
            };
            return $0k[$0m];
        };
        this.client = {};
        this.client.innerHTML = function($0i) {
            if (typeof $0i === 'undefined') {
                if (e.cache && typeof e.cache.html !== "undefined") {
                    return e.cache.html;
                };
                if (typeof e.data.html !== "undefined") {
                    return e.data.html;
                };
                return e.data.text;
            } else {
                e.data.html = $0i;
            }
        };
        this.client.html = this.client.innerHTML;
        this.client.header = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.data.header;
            } else {
                e.data.header = $0i;
            }
        };
        this.client.cssClass = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.data.cssClass;
            } else {
                e.data.cssClass = $0i;
            }
        };
        this.client.toolTip = function($0i) {
            if (typeof $0i === 'undefined') {
                if (e.cache && typeof e.cache.toolTip !== "undefined") {
                    return e.cache.toolTip;
                };
                return typeof e.data.toolTip !== 'undefined' ? e.data.toolTip : e.data.text;
            } else {
                e.data.toolTip = $0i;
            }
        };
        this.client.backColor = function($0i) {
            if (typeof $0i === 'undefined') {
                if (e.cache && typeof e.cache.backColor !== "undefined") {
                    return e.cache.backColor;
                };
                return typeof e.data.backColor !== "undefined" ? e.data.backColor : e.calendar.eventBackColor;
            } else {
                e.data.backColor = $0i;
            }
        };
        this.client.borderColor = function($0i) {
            if (typeof $0i === 'undefined') {
                if (e.cache && typeof e.cache.borderColor !== "undefined") {
                    return e.cache.borderColor;
                };
                return typeof e.data.borderColor !== "undefined" ? e.data.borderColor : e.calendar.eventBorderColor;
            } else {
                e.data.borderColor = $0i;
            }
        };
        this.client.barColor = function($0i) {
            if (typeof $0i === 'undefined') {
                if (e.cache && typeof e.cache.barColor !== "undefined") {
                    return e.cache.barColor;
                };
                return typeof e.data.barColor !== "undefined" ? e.data.barColor : e.calendar.durationBarColor;
            } else {
                e.data.barColor = $0i;
            }
        };
        this.client.barVisible = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.durationBarVisible && !e.data.barHidden;
            } else {
                e.data.barHidden = !$0i;
            }
        };
        this.client.contextMenu = function($0i) {
            if (typeof $0i === 'undefined') {
                if (e.oContextMenu) {
                    return e.oContextMenu;
                };
                return (e.data.contextMenu) ? eval(e.data.contextMenu) : null;
            } else {
                e.oContextMenu = $0i;
            }
        };
        this.client.moveEnabled = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.eventMoveHandling !== 'Disabled' && !e.data.moveDisabled;
            } else {
                e.data.moveDisabled = !$0i;
            }
        };
        this.client.resizeEnabled = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.eventResizeHandling !== 'Disabled' && !e.data.resizeDisabled;
            } else {
                e.data.resizeDisabled = !$0i;
            }
        };
        this.client.rightClickEnabled = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.rightClickHandling !== 'Disabled' && !e.data.rightClickDisabled;
            } else {
                e.data.rightClickDisabled = !$0i;
            }
        };
        this.client.clickEnabled = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.clickHandling !== 'Disabled' && !e.data.clickDisabled;
            } else {
                e.data.clickDisabled = !$0i;
            }
        };
        this.client.deleteEnabled = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.eventDeleteHandling !== 'Disabled' && !e.data.deleteDisabled;
            } else {
                e.data.deleteDisabled = !$0i;
            }
        };
        this.client.doubleClickEnabled = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.doubleClickHandling !== 'Disabled' && !e.data.doubleClickDisabled;
            } else {
                e.data.doubleClickDisabled = !$0i;
            }
        };
        this.client.deleteClickEnabled = function($0i) {
            if (typeof $0i === 'undefined') {
                return e.calendar.eventDeleteHandling !== 'Disabled' && !e.data.deleteDisabled;
            } else {
                e.data.deleteDisabled = !$0i;
            }
        };
        this.toJSON = function($0e) {
            var $0a = {};
            $0a.value = this.id();
            $0a.id = this.id();
            $0a.text = this.text();
            $0a.start = this.start();
            $0a.end = this.end();
            $0a.resource = this.resource();
            $0a.isAllDay = false;
            $0a.recurrentMasterId = this.recurrentMasterId();
            $0a.tag = {};
            if (e.calendar.tagFields) {
                var $0l = e.calendar.tagFields;
                for (var i = 0; i < $0l.length; i++) {
                    $0a.tag[$0l[i]] = this.tag($0l[i]);
                }
            };
            return $0a;
        };
    };
    DayPilot.EventData = function(e) {
        this.value = function() {
            return id;
        };
        this.tag = function() {
            return null;
        };
        this.start = function() {
            return new Date(0);
        };
        this.end = function() {
            return new Date($0n * 1000);
        };
        this.text = function() {
            return $0o;
        };
        this.isAllDay = function() {
            return false;
        };
        this.allday = this.isAllDay;
    };
    DayPilot.request = function($0p, $0q, $0r, $0s) {
        var $0t = DayPilot.createXmlHttp();
        if (!$0t) {
            return;
        };
        $0t.open("POST", $0p, true);
        $0t.setRequestHeader('Content-type', 'text/plain');
        $0t.onreadystatechange = function() {
            if ($0t.readyState !== 4) return;
            if ($0t.status !== 200 && $0t.status !== 304) {
                if ($0s) {
                    $0s($0t);
                } else {
                    DayPilot.debug('HTTP error ' + $0t.status);
                };
                return;
            };
            $0q($0t);
        };
        if ($0t.readyState === 4) {
            return;
        };
        if (typeof $0r === 'object') {
            $0r = DayPilot.JSON.stringify($0r);
        };
        $0t.send($0r);
    };
    DayPilot.createXmlHttp = function() {
        var $0u;
        try {
            $0u = new XMLHttpRequest();
        } catch (e) {
            try {
                $0u = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        };
        return $0u;
    };
    DayPilot.Date = function($0v, $0w) {
        if (typeof $0v === 'undefined') {
            this.isDayPilotDate = true;
            this.d = DayPilot.Date.fromLocal();
            this.ticks = this.d.getTime();
            return;
        };
        if ($0v.isDayPilotDate) {
            return $0v;
        };
        var $0x = DayPilot.Date.Cache.Ctor;
        if ($0x[$0v]) {
            return $0x[$0v];
        };
        if (typeof $0v === "string") {
            var $p = DayPilot.Date.fromStringSortable($0v);
            $0x[$0v] = $p;
            return $p;
        };
        if (!$0v.getFullYear) {
            throw "date parameter is not a Date object: " + $0v;
        };
        if ($0w) {
            this.isDayPilotDate = true;
            this.d = DayPilot.Date.fromLocal($0v);
            this.ticks = this.d.getTime();
        } else {
            this.isDayPilotDate = true;
            this.d = $0v;
            this.ticks = this.d.getTime();
        }
    };
    DayPilot.Date.Cache = {};
    DayPilot.Date.Cache.Parsing = {};
    DayPilot.Date.Cache.Ctor = {};
    DayPilot.Date.prototype.addDays = function($0y) {
        return new DayPilot.Date(DayPilot.Date.addDays(this.d, $0y));
    };
    DayPilot.Date.prototype.addHours = function($0z) {
        return this.addTime($0z * 60 * 60 * 1000);
    };
    DayPilot.Date.prototype.addMilliseconds = function($0A) {
        return this.addTime($0A);
    };
    DayPilot.Date.prototype.addMinutes = function($0B) {
        return this.addTime($0B * 60 * 1000);
    };
    DayPilot.Date.prototype.addMonths = function($0C) {
        return new DayPilot.Date(DayPilot.Date.addMonths(this.d, $0C));
    };
    DayPilot.Date.prototype.addSeconds = function($0D) {
        return this.addTime($0D * 1000);
    };
    DayPilot.Date.prototype.addTime = function($0E) {
        return new DayPilot.Date(DayPilot.Date.addTime(this.d, $0E));
    };
    DayPilot.Date.prototype.addYears = function($0F) {
        var n = this.clone();
        n.d.setUTCFullYear(this.getYear() + $0F);
        return n;
    };
    DayPilot.Date.prototype.clone = function() {
        return new DayPilot.Date(DayPilot.Date.clone(this.d));
    };
    DayPilot.Date.prototype.dayOfWeek = function() {
        return this.d.getUTCDay();
    };
    DayPilot.Date.prototype.getDayOfWeek = function() {
        return this.d.getUTCDay();
    };
    DayPilot.Date.prototype.daysInMonth = function() {
        return DayPilot.Date.daysInMonth(this.d);
    };
    DayPilot.Date.prototype.dayOfYear = function() {
        return Math.ceil((this.getDatePart().getTime() - this.firstDayOfYear().getTime()) / 86400000) + 1;
    };
    DayPilot.Date.prototype.equals = function($0G) {
        if ($0G === null) {
            return false;
        };
        if ($0G.isDayPilotDate) {
            return DayPilot.Date.equals(this.d, $0G.d);
        } else {
            throw "The parameter must be a DayPilot.Date object (DayPilot.Date.equals())";
        }
    };
    DayPilot.Date.prototype.firstDayOfMonth = function() {
        var $0H = DayPilot.Date.firstDayOfMonth(this.getYear(), this.getMonth() + 1);
        return new DayPilot.Date($0H);
    };
    DayPilot.Date.prototype.firstDayOfYear = function() {
        var $0I = this.getYear();
        var d = new Date();
        d.setUTCFullYear($0I, 0, 1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return new DayPilot.Date(d);
    };
    DayPilot.Date.prototype.firstDayOfWeek = function($0J) {
        var $0H = DayPilot.Date.firstDayOfWeek(this.d, $0J);
        return new DayPilot.Date($0H);
    };
    DayPilot.Date.prototype.getDay = function() {
        return this.d.getUTCDate();
    };
    DayPilot.Date.prototype.getDatePart = function() {
        return new DayPilot.Date(DayPilot.Date.getDate(this.d));
    };
    DayPilot.Date.prototype.getYear = function() {
        return this.d.getUTCFullYear();
    };
    DayPilot.Date.prototype.getHours = function() {
        return this.d.getUTCHours();
    };
    DayPilot.Date.prototype.getMilliseconds = function() {
        return this.d.getUTCMilliseconds();
    };
    DayPilot.Date.prototype.getMinutes = function() {
        return this.d.getUTCMinutes();
    };
    DayPilot.Date.prototype.getMonth = function() {
        return this.d.getUTCMonth();
    };
    DayPilot.Date.prototype.getSeconds = function() {
        return this.d.getUTCSeconds();
    };
    DayPilot.Date.prototype.getTotalTicks = function() {
        return this.getTime();
    };
    DayPilot.Date.prototype.getTime = function() {
        return this.ticks;
    };
    DayPilot.Date.prototype.getTimePart = function() {
        return DayPilot.Date.getTime(this.d);
    };
    DayPilot.Date.prototype.lastDayOfMonth = function() {
        var $0H = DayPilot.Date.lastDayOfMonth(this.getYear(), this.getMonth() + 1);
        return new DayPilot.Date($0H);
    };
    DayPilot.Date.prototype.weekNumber = function() {
        var $0K = this.firstDayOfYear();
        var $0y = (this.getTime() - $0K.getTime()) / 86400000;
        return Math.ceil(($0y + $0K.dayOfWeek() + 1) / 7);
    };
    DayPilot.Date.prototype.local = function() {
        if (typeof this.offset === 'undefined') {
            return new DayPilot.Date(this.d);
        };
        return this.addMinutes(this.offset);
    };
    DayPilot.Date.prototype.weekNumberISO = function() {
        var $0L = false;
        var $0M = this.dayOfYear();
        var $0N = this.firstDayOfYear().dayOfWeek();
        var $0O = this.firstDayOfYear().addYears(1).addDays(-1).dayOfWeek();
        if ($0N === 0) {
            $0N = 7;
        };
        if ($0O === 0) {
            $0O = 7;
        };
        var $0P = 8 - ($0N);
        if ($0N === 4 || $0O === 4) {
            $0L = true;
        };
        var $0Q = Math.ceil(($0M - ($0P)) / 7.0);
        var $0R = $0Q;
        if ($0P >= 4) {
            $0R = $0R + 1;
        };
        if ($0R > 52 && !$0L) {
            $0R = 1;
        };
        if ($0R === 0) {
            $0R = this.firstDayOfYear().addDays(-1).weekNumberISO();
        };
        return $0R;
    };
    DayPilot.Date.prototype.toDateLocal = function() {
        return DayPilot.Date.toLocal(this.d);
    };
    DayPilot.Date.prototype.toJSON = function() {
        return this.toStringSortable();
    };
    DayPilot.Date.prototype.toString = function($0S, $0T) {
        if (typeof $0S === 'undefined') {
            return this.toStringSortable();
        };
        return new $0U($0S, $0T).print(this);
    };
    DayPilot.Date.prototype.toStringSortable = function() {
        return DayPilot.Date.toStringSortable(this.d);
    };
    DayPilot.Date.parse = function(str, $0S) {
        var p = new $0U($0S);
        return p.parse(str);
    };
    DayPilot.Date.fromStringSortable = function($0V) {
        var $p;
        if (!$0V) {
            throw "Can't create DayPilot.Date from empty string";
        };
        var $C = $0V.length;
        var $0v = $C === 10;
        var $0W = $C = 19;
        var $0X = $C === 25;
        if (!$0v && !$0W && !$0X) {
            throw "Invalid string format (use '2010-01-01', '2010-01-01T00:00:00', or '2010-01-01T00:00:00+00:00'.";
        };
        if (DayPilot.Date.Cache.Parsing[$0V]) {
            return DayPilot.Date.Cache.Parsing[$0V];
        };
        var $0I = $0V.substring(0, 4);
        var $0Y = $0V.substring(5, 7);
        var $0Z = $0V.substring(8, 10);
        var d = new Date();
        d.setUTCFullYear($0I, $0Y - 1, $0Z);
        if ($0v) {
            d.setUTCHours(0);
            d.setUTCMinutes(0);
            d.setUTCSeconds(0);
            d.setUTCMilliseconds(0);
            $p = new DayPilot.Date(d);
            DayPilot.Date.Cache.Parsing[$0V] = $p;
            return $p;
        };
        var $0z = $0V.substring(11, 13);
        var $0B = $0V.substring(14, 16);
        var $0D = $0V.substring(17, 19);
        d.setUTCHours($0z);
        d.setUTCMinutes($0B);
        d.setUTCSeconds($0D);
        d.setUTCMilliseconds(0);
        var $p = new DayPilot.Date(d);
        if ($0W) {
            DayPilot.Date.Cache.Parsing[$0V] = $p;
            return $p;
        };
        var $10 = $0V[20];
        var $11 = $0V.substring(21, 23);
        var $12 = $0V.substring(24);
        var $13 = $11 * 60 + $12;
        if ($10 === "-") {
            $13 = -$13;
        };
        $p = $p.addMinutes(-$13);
        $p.offset = $14;
        DayPilot.Date.Cache.Parsing[$0V] = $p;
        return $p;
    };
    DayPilot.Date.addDays = function($0v, $0y) {
        var d = new Date();
        d.setTime($0v.getTime() + $0y * 24 * 60 * 60 * 1000);
        return d;
    };
    DayPilot.Date.addMinutes = function($0v, $0B) {
        var d = new Date();
        d.setTime($0v.getTime() + $0B * 60 * 1000);
        return d;
    };
    DayPilot.Date.addMonths = function($0v, $0C) {
        if ($0C === 0) return $0v;
        var y = $0v.getUTCFullYear();
        var m = $0v.getUTCMonth() + 1;
        if ($0C > 0) {
            while ($0C >= 12) {
                $0C -= 12;
                y++;
            };
            if ($0C > 12 - m) {
                y++;
                m = $0C - (12 - m);
            } else {
                m += $0C;
            }
        } else {
            while ($0C <= -12) {
                $0C += 12;
                y--;
            };
            if (m <= $0C) {
                y--;
                m = 12 - ($0C + m);
            } else {
                m = m + $0C;
            }
        };
        var d = DayPilot.Date.clone($0v);
        d.setUTCFullYear(y);
        d.setUTCMonth(m - 1);
        return d;
    };
    DayPilot.Date.addTime = function($0v, $15) {
        var d = new Date();
        d.setTime($0v.getTime() + $15);
        return d;
    };
    DayPilot.Date.clone = function($16) {
        var d = new Date();
        return DayPilot.Date.dateFromTicks($16.getTime());
    };
    DayPilot.Date.daysDiff = function($0K, $17) {
        if ($0K.getTime() > $17.getTime()) {
            return null;
        };
        var i = 0;
        var $18 = DayPilot.Date.getDate($0K);
        var $19 = DayPilot.Date.getDate($17);
        while ($18 < $19) {
            $18 = DayPilot.Date.addDays($18, 1);
            i++;
        };
        return i;
    };
    DayPilot.Date.daysInMonth = function($0I, $0Y) {
        if ($0I.getUTCFullYear) {
            $0Y = $0I.getUTCMonth() + 1;
            $0I = $0I.getUTCFullYear();
        };
        var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ($0Y !== 2) return m[$0Y - 1];
        if ($0I % 4 !== 0) return m[1];
        if ($0I % 100 === 0 && $0I % 400 !== 0) return m[1];
        return m[1] + 1;
    };
    DayPilot.Date.daysSpan = function($0K, $17) {
        if ($0K.getTime() === $17.getTime()) {
            return 0;
        };
        var $1a = DayPilot.Date.daysDiff($0K, $17);
        if (DayPilot.Date.equals($17, DayPilot.Date.getDate($17))) {
            $1a--;
        };
        return $1a;
    };
    DayPilot.Date.diff = function($0K, $17) {
        if (!($0K && $17 && $0K.getTime && $17.getTime)) {
            throw "Both compared objects must be Date objects (DayPilot.Date.diff).";
        };
        return $0K.getTime() - $17.getTime();
    };
    DayPilot.Date.equals = function($0K, $17) {
        return $0K.getTime() === $17.getTime();
    };
    DayPilot.Date.fromLocal = function($1b) {
        if (!$1b) {
            $1b = new Date();
        };
        var d = new Date();
        d.setUTCFullYear($1b.getFullYear(), $1b.getMonth(), $1b.getDate());
        d.setUTCHours($1b.getHours());
        d.setUTCMinutes($1b.getMinutes());
        d.setUTCSeconds($1b.getSeconds());
        d.setUTCMilliseconds($1b.getMilliseconds());
        return d;
    };
    DayPilot.Date.firstDayOfMonth = function($0I, $0Y) {
        var d = new Date();
        d.setUTCFullYear($0I, $0Y - 1, 1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return d;
    };
    DayPilot.Date.firstDayOfWeek = function(d, $0J) {
        var $0Z = d.getUTCDay();
        while ($0Z !== $0J) {
            d = DayPilot.Date.addDays(d, -1);
            $0Z = d.getUTCDay();
        };
        return d;
    };
    DayPilot.Date.dateFromTicks = function($0E) {
        var d = new Date();
        d.setTime($0E);
        return d;
    };
    DayPilot.Date.getDate = function($16) {
        var d = DayPilot.Date.clone($16);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return d;
    };
    DayPilot.Date.getStart = function($0I, $0Y, $0J) {
        var $1c = DayPilot.Date.firstDayOfMonth($0I, $0Y);
        d = DayPilot.Date.firstDayOfWeek($1c, $0J);
        return d;
    };
    DayPilot.Date.getTime = function($16) {
        var $0v = DayPilot.Date.getDate($16);
        return DayPilot.Date.diff($16, $0v);
    };
    DayPilot.Date.hours = function($0v, $1d) {
        var $1e = $0v.getUTCMinutes();
        if ($1e < 10) $1e = "0" + $1e;
        var $1f = $0v.getUTCHours();
        if ($1d) {
            var am = $1f < 12;
            var $1f = $1f % 12;
            if ($1f === 0) {
                $1f = 12;
            };
            var $1g = am ? "AM" : "PM";
            return $1f + ':' + $1e + ' ' + $1g;
        } else {
            return $1f + ':' + $1e;
        }
    };
    DayPilot.Date.lastDayOfMonth = function($0I, $0Y) {
        var d = DayPilot.Date.firstDayOfMonth($0I, $0Y);
        var length = DayPilot.Date.daysInMonth($0I, $0Y);
        d.setUTCDate(length);
        return d;
    };
    DayPilot.Date.max = function($0K, $17) {
        if ($0K.getTime() > $17.getTime()) {
            return $0K;
        } else {
            return $17;
        }
    };
    DayPilot.Date.min = function($0K, $17) {
        if ($0K.getTime() < $17.getTime()) {
            return $0K;
        } else {
            return $17;
        }
    };
    DayPilot.Date.today = function() {
        var $1h = new Date();
        var d = new Date();
        d.setUTCFullYear($1h.getFullYear());
        d.setUTCMonth($1h.getMonth());
        d.setUTCDate($1h.getDate());
        return d;
    };
    DayPilot.Date.toLocal = function($0v) {
        if (!$0v) {
            $0v = new Date();
        };
        var d = new Date();
        d.setFullYear($0v.getUTCFullYear(), $0v.getUTCMonth(), $0v.getUTCDate());
        d.setHours($0v.getUTCHours());
        d.setMinutes($0v.getUTCMinutes());
        d.setSeconds($0v.getUTCSeconds());
        d.setMilliseconds($0v.getUTCMilliseconds());
        return d;
    };
    DayPilot.Date.toStringSortable = function($0v) {
        if ($0v.isDayPilotDate) {
            return $0v.toStringSortable();
        };
        var d = $0v;
        var $17 = d.getUTCSeconds();
        if ($17 < 10) $17 = "0" + $17;
        var $1e = d.getUTCMinutes();
        if ($1e < 10) $1e = "0" + $1e;
        var $1f = d.getUTCHours();
        if ($1f < 10) $1f = "0" + $1f;
        var $0Z = d.getUTCDate();
        if ($0Z < 10) $0Z = "0" + $0Z;
        var $0Y = d.getUTCMonth() + 1;
        if ($0Y < 10) $0Y = "0" + $0Y;
        var $0I = d.getUTCFullYear();
        if ($0I <= 0) {
            throw "The minimum year supported is 1.";
        };
        if ($0I < 10) {
            $0I = "000" + $0I;
        } else if ($0I < 100) {
            $0I = "00" + $0I;
        } else if ($0I < 1000) {
            $0I = "0" + $0I;
        };
        return $0I + "-" + $0Y + "-" + $0Z + 'T' + $1f + ":" + $1e + ":" + $17;
    };
    var $0U = function($0S, $0T) {
        if (typeof $0T === "string") {
            $0T = DayPilot.Locale.find($0T);
        };
        var $0T = $0T || DayPilot.Locale.US;
        var $1i = [{
            "seq": "yyyy",
            "expr": "[0-9]{4,4\u007d",
            "str": function(d) {
                return d.getYear();
            }
        }, {
            "seq": "MMMM",
            "expr": "[a-z]*",
            "str": function(d) {
                var r = $0T.monthNames[d.getMonth()];
                return r;
            }
        }, {
            "seq": "MM",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getMonth() + 1;
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "M",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getMonth() + 1;
                return r;
            }
        }, {
            "seq": "dddd",
            "expr": "[a-z]*",
            "str": function(d) {
                var r = $0T.dayNames[d.getDayOfWeek()];
                return r;
            }
        }, {
            "seq": "dd",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getDay();
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "d",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getDay();
                return r;
            }
        }, {
            "seq": "m",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getMinutes();
                return r;
            }
        }, {
            "seq": "mm",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getMinutes();
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "H",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getHours();
                return r;
            }
        }, {
            "seq": "HH",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getHours();
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "h",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var $1f = d.getHours();
                var $1f = $1f % 12;
                if ($1f === 0) {
                    $1f = 12;
                };
                return $1f;
            }
        }, {
            "seq": "hh",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var $1f = d.getHours();
                var $1f = $1f % 12;
                if ($1f === 0) {
                    $1f = 12;
                };
                var r = $1f;
                return r < 10 ? "0" + r : r;
            }
        }, {
            "seq": "tt",
            "expr": "(AM|PM)",
            "str": function(d) {
                var $1f = d.getHours();
                var am = $1f < 12;
                return am ? "AM" : "PM";
            }
        }, {
            "seq": "s",
            "expr": "[0-9]{1,2\u007d",
            "str": function(d) {
                var r = d.getSeconds();
                return r;
            }
        }, {
            "seq": "ss",
            "expr": "[0-9]{2,2\u007d",
            "str": function(d) {
                var r = d.getSeconds();
                return r < 10 ? "0" + r : r;
            }
        }];
        var $1j = function($0o) {
            return $0o.replace(/[-[\]{};()*+?.,\\^$|#\s]/g, "\\$&");
        };
        this.init = function() {
            this.year = this.findSequence("yyyy");
            this.month = this.findSequence("MM") || this.findSequence("M");
            this.day = this.findSequence("dd") || this.findSequence("d");
            this.hours = this.findSequence("HH") || this.findSequence("H");
            this.minutes = this.findSequence("mm") || this.findSequence("m");
            this.seconds = this.findSequence("ss") || this.findSequence("s");
        };
        this.findSequence = function($1k) {
            var $0m = $0S.indexOf($1k);
            if ($0m === -1) {
                return null;
            };
            return {
                "findValue": function($1l) {
                    var $1m = $1j($0S);
                    for (var i = 0; i < $1i.length; i++) {
                        var $C = $1i[i].length;
                        var $1n = ($1k === $1i[i].seq);
                        var $1o = $1i[i].expr;
                        if ($1n) {
                            $1o = "(" + $1o + ")";
                        };
                        $1m = $1m.replace($1i[i].seq, $1o);
                    };
                    try {
                        var r = new RegExp($1m);
                        var $t = r.exec($1l);
                        if (!$t) {
                            return null;
                        };
                        return parseInt($t[1]);
                    } catch (e) {
                        throw "unable to create regex from: " + $1m;
                    }
                }
            };
        };
        this.print = function($0v) {
            var find = function(t) {
                for (var i = 0; i < $1i.length; i++) {
                    if ($1i[i].seq === t) {
                        return $1i[i];
                    }
                };
                return null;
            };
            var $1p = $0S.length <= 0;
            var $1q = 0;
            var $1r = [];
            while (!$1p) {
                var $1s = $0S.substring($1q);
                var $1t = /(.)\1*/.exec($1s);
                if ($1t && $1t.length > 0) {
                    var $1u = $1t[0];
                    var q = find($1u);
                    if (q) {
                        $1r.push(q);
                    } else {
                        $1r.push($1u);
                    };
                    $1q += $1u.length;
                    $1p = $0S.length <= $1q;
                } else {
                    $1p = true;
                }
            };
            for (var i = 0; i < $1r.length; i++) {
                var c = $1r[i];
                if (typeof c !== 'string') {
                    $1r[i] = c.str($0v);
                }
            };
            return $1r.join("");
        };
        this.parse = function($1l) {
            var $0I = this.year.findValue($1l);
            if (!$0I) {
                return null;
            };
            var $0Y = this.month.findValue($1l);
            var $0Z = this.day.findValue($1l);
            var $0z = this.hours ? this.hours.findValue($1l) : 0;
            var $0B = this.minutes ? this.minutes.findValue($1l) : 0;
            var $0D = this.seconds ? this.seconds.findValue($1l) : 0;
            var d = new Date();
            d.setUTCFullYear($0I, $0Y - 1, $0Z);
            d.setUTCHours($0z);
            d.setUTCMinutes($0B);
            d.setUTCSeconds($0D);
            d.setUTCMilliseconds(0);
            return new DayPilot.Date(d);
        };
        this.init();
    };
    DayPilot.Action = function($06, $07, $08, $09) {
        this.calendar = $06;
        this.isAction = true;
        this.action = $07;
        this.params = $08;
        this.data = $09;
        this.notify = function() {
            $06.invokeEvent("Immediate", this.action, this.params, this.data);
        };
        this.auto = function() {
            $06.invokeEvent("Notify", this.action, this.params, this.data);
        };
        this.queue = function() {
            $06.queue.add(this);
        };
        this.toJSON = function() {
            var $0a = {};
            $0a.name = this.action;
            $0a.params = this.params;
            $0a.data = this.data;
            return $0a;
        };
    };
    DayPilot.Locale = function(id, $L) {
        this.id = id;
        this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.dayNamesShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.datePattern = "M/d/yyyy";
        this.timePattern = "H:mm";
        this.dateTimePattern = "M/d/yyyy H:mm";
        this.timeFormat = "Clock12Hours";
        this.weekStarts = 0;
        if ($L) {
            for (var name in $L) {
                this[name] = $L[name];
            }
        }
    };
    DayPilot.Locale.all = {};
    DayPilot.Locale.find = function(id) {
        if (!id) {
            return null;
        };
        var $1v = id.toLowerCase();
        if ($1v.length > 2) {
            $1v[2] = '-';
        };
        return DayPilot.Locale.all[$1v];
    };
    DayPilot.Locale.register = function($0T) {
        DayPilot.Locale.all[$0T.id] = $0T;
    };
    DayPilot.Locale.register(new DayPilot.Locale('de-de', {
        'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'dayNamesShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-au', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'timePattern': 'h:mm tt',
        'datePattern': 'd/MM/yyyy',
        'dateTimePattern': 'd/MM/yyyy h:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-ca', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'timePattern': 'h:mm tt',
        'datePattern': 'yyyy-MM-dd',
        'dateTimePattern': 'yyyy-MM-dd h:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-gb', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('en-us', {
        'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'dayNamesShort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
        'timePattern': 'h:mm tt',
        'datePattern': 'M/d/yyyy',
        'dateTimePattern': 'M/d/yyyy h:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('es-es', {
        'dayNames': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        'dayNamesShort': ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        'monthNames': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', ''],
        'timePattern': 'H:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('es-mx', {
        'dayNames': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        'dayNamesShort': ['do.', 'lu.', 'ma.', 'mi.', 'ju.', 'vi.', 'sá.'],
        'monthNames': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', ''],
        'timePattern': 'hh:mm tt',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy hh:mm tt',
        'timeFormat': 'Clock12Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('fr-fr', {
        'dayNames': ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        'dayNamesShort': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'],
        'monthNames': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('it-it', {
        'dayNames': ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
        'dayNamesShort': ['do', 'lu', 'ma', 'me', 'gi', 've', 'sa'],
        'monthNames': ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre', ''],
        'timePattern': 'HH.mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH.mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('ja-jp', {
        'dayNames': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        'dayNamesShort': ['日', '月', '火', '水', '木', '金', '土'],
        'monthNames': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ''],
        'timePattern': 'H:mm',
        'datePattern': 'yyyy/MM/dd',
        'dateTimePattern': 'yyyy/MM/dd H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('pt-br', {
        'dayNames': ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
        'dayNamesShort': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        'monthNames': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 0
    }));
    DayPilot.Locale.register(new DayPilot.Locale('ru-ru', {
        'dayNames': ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        'dayNamesShort': ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        'monthNames': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', ''],
        'timePattern': 'H:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('zh-cn', {
        'dayNames': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        'dayNamesShort': ['日', '一', '二', '三', '四', '五', '六'],
        'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', ''],
        'timePattern': 'H:mm',
        'datePattern': 'yyyy/M/d',
        'dateTimePattern': 'yyyy/M/d H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('sv-se', {
        'dayNames': ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
        'dayNamesShort': ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'],
        'monthNames': ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'yyyy-MM-dd',
        'dateTimePattern': 'yyyy-MM-dd HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('da-dk', {
        'dayNames': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
        'dayNamesShort': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
        'monthNames': ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd-MM-yyyy',
        'dateTimePattern': 'dd-MM-yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('nb-no', {
        'dayNames': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
        'dayNamesShort': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
        'monthNames': ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('nn-no', {
        'dayNames': ['søndag', 'måndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag'],
        'dayNamesShort': ['sø', 'må', 'ty', 'on', 'to', 'fr', 'la'],
        'monthNames': ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'dd.MM.yyyy',
        'dateTimePattern': 'dd.MM.yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('fi-fi', {
        'dayNames': ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
        'dayNamesShort': ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
        'monthNames': ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu', ''],
        'timePattern': 'H:mm',
        'datePattern': 'd.M.yyyy',
        'dateTimePattern': 'd.M.yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('nl-nl', {
        'dayNames': ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        'dayNamesShort': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        'monthNames': ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december', ''],
        'timePattern': 'HH:mm',
        'datePattern': 'd-M-yyyy',
        'dateTimePattern': 'd-M-yyyy HH:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.register(new DayPilot.Locale('cs-cz', {
        'dayNames': ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
        'dayNamesShort': ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
        'monthNames': ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec', ''],
        'timePattern': 'H:mm',
        'datePattern': 'd. M. yyyy',
        'dateTimePattern': 'd. M. yyyy H:mm',
        'timeFormat': 'Clock24Hours',
        'weekStarts': 1
    }));
    DayPilot.Locale.US = DayPilot.Locale.find("en-us");
    DayPilot.Switcher = function() {
        var $1w = this;
        this.views = [];
        this.switchers = [];
        this.navigator = {};
        this.active = null;
        this.day = new DayPilot.Date();
        this.navigator.updateMode = function($1x) {
            var $1y = $1w.navigator.control;
            if (!$1y) {
                return;
            };
            $1y.selectMode = $1x;
            $1y.select($1w.day);
        };
        this.addView = function($1y) {
            var $1z = {};
            $1z.isView = true;
            $1z.id = $1y.id;
            $1z.control = $1y;
            $1z.hide = function() {
                if ($1y.hide) {
                    $1y.hide();
                } else {
                    $1y.nav.top.style.display = 'none';
                }
            };
            $1z.show = function() {
                if ($1y.show) {
                    $1y.show();
                } else {
                    $1y.nav.top.style.display = '';
                }
            };
            $1z.selectMode = function() {
                if ($1y.isCalendar) {
                    switch ($1y.viewType) {
                        case "Day":
                            return "day";
                        case "Week":
                            return "week";
                        case "WorkWeek":
                            return "week";
                        default:
                            return "day";
                    }
                } else if ($1y.isMonth) {
                    switch ($1y.viewType) {
                        case "Month":
                            return "month";
                        case "Weeks":
                            return "week";
                        default:
                            return "day";
                    }
                };
                return "day";
            };
            this.views.push($1z);
        };
        this.addButton = function(id, $1y) {
            var element;
            if (typeof id === 'string') {
                element = document.getElementById(id);
            } else {
                element = id;
            };
            var $1z = this.$1S($1y);
            if (!$1z) {
                throw "View not found";
            };
            var $1A = {};
            $1A.element = element;
            $1A.view = $1z;
            $1A.onClick = function(ev) {
                $1w.show($1A.view);
                var $1x = $1A.view.selectMode();
                $1w.navigator.updateMode($1x);
                ev = ev || window.event;
                ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
            };
            DayPilot.re(element, 'click', $1A.onClick);
        };
        this.addNavigator = function($1y) {
            $1w.navigator.control = $1y;
            $1y.timeRangeSelectedHandling = "JavaScript"
            $1y.onTimeRangeSelected = function($0b, end, $0Z) {
                $1w.day = $0Z;
                $1w.active.control.commandCallBack("navigate", {
                    "day": $1w.day
                });
            };
        };
        this.show = function($1y) {
            var $1z = $1y.isView ? $1y : this.$1S($1y);
            if (this.active === $1z) {
                return;
            };
            this.active = $1z;
            this.$1T();
            $1z.show();
            $1w.active.control.commandCallBack("navigate", {
                "day": this.day
            });
        };
        this.$1S = function($1y) {
            for (var i = 0; i < this.views.length; i++) {
                if (this.views[i].control === $1y) {
                    return this.views[i];
                }
            };
            return null;
        };
        this.$1T = function() {
            for (var i = 0; i < this.views.length; i++) {
                this.views[i].hide();
            }
        };
    };
    var $1B = function(id) {
        var $1w = this;
        this.id = id;
        this.widths = [];
        this.titles = [];
        this.splitterWidth = 3;
        this.css = {};
        this.css.title = null;
        this.css.titleInner = null;
        this.css.splitter = null;
        this.blocks = [];
        this.drag = {};
        this.updated = function() {};
        this.updating = function() {};
        this.init = function() {
            var $J;
            if (!id) {
                throw "error: id not provided";
            } else if (typeof id === 'string') {
                $J = document.getElementById(id);
            } else if (id.appendChild) {
                $J = id;
            } else {
                throw "error: invalid object provided";
            };
            this.div = $J;
            this.blocks = [];
            for (var i = 0; i < this.widths.length; i++) {
                var s = document.createElement("div");
                s.style.float = "left";
                s.style.height = "100%";
                s.style.width = (this.widths[i] - this.splitterWidth) + "px";
                s.style.display.overflow = 'hidden';
                s.style.verticalAlign = "top";
                s.style.position = "relative";
                s.setAttribute("unselectable", "on");
                s.className = this.css.title;
                $J.appendChild(s);
                var $1C = document.createElement("div");
                $1C.innerHTML = this.titles[i];
                $1C.setAttribute("unselectable", "on");
                $1C.className = this.css.titleInner;
                s.appendChild($1C);
                var $1D = document.createElement("div");
                $1D.style.top = "0px";
                $1D.style.float = "left";
                $1D.style.height = "100%";
                $1D.style.width = this.splitterWidth + "px";
                $1D.style.cursor = "col-resize";
                $1D.setAttribute("unselectable", "on");
                $1D.className = this.css.splitter;
                var $09 = {};
                $09.index = i;
                $09.width = this.widths[i];
                $1D.data = $09;
                $1D.onmousedown = function(ev) {
                    $1w.drag.start = DayPilot.page(ev);
                    $1w.drag.data = this.data;
                    $1w.div.style.cursor = "col-resize";
                    ev = ev || window.event;
                    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                };
                $J.appendChild($1D);
                var $1E = {};
                $1E.section = s;
                $1E.handle = $1D;
                this.blocks.push($1E);
            };
            this.registerGlobalHandlers();
        };
        this.updateWidths = function() {
            for (var i = 0; i < this.blocks.length; i++) {
                var $1E = this.blocks[i];
                var $W = this.widths[i];
                $1E.handle.data.width = $W;
                this.$1U(i);
            }
        };
        this.$1U = function(i) {
            var $1E = this.blocks[i];
            var $W = this.widths[i];
            $1E.section.style.width = ($W - this.splitterWidth) + "px";
        };
        this.totalWidth = function() {
            var t = 0;
            for (var i = 0; i < this.widths.length; i++) {
                t += this.widths[i];
            };
            return t;
        };
        this.gMouseMove = function(ev) {
            if (!$1w.drag.start) {
                return;
            };
            var $09 = $1w.drag.data;
            var $1F = DayPilot.page(ev);
            var $1G = $1F.x - $1w.drag.start.x;
            var i = $09.index;
            $1w.widths[i] = $09.width + $1G;
            $1w.$1U(i);
            var $08 = {};
            $08.widths = this.widths;
            $08.index = $09.index;
            $1w.updating($08);
        };
        this.gMouseUp = function(ev) {
            if (!$1w.drag.start) {
                return;
            };
            $1w.drag.start = null;
            document.body.style.cursor = "";
            $1w.div.style.cursor = "";
            var $09 = $1w.drag.data;
            $09.width = $1w.widths[$09.index];
            var $08 = {};
            $08.widths = this.widths;
            $08.index = $09.index;
            $1w.updated($08);
        };
        this.registerGlobalHandlers = function() {
            DayPilot.re(document, 'mousemove', this.gMouseMove);
            DayPilot.re(document, 'mouseup', this.gMouseUp);
        };
    };
    DayPilot.Splitter = $1B;
})();
DayPilot.JSON = {};
(function() {
    function f(n) {
        return n < 10 ? '0' + n : n;
    };
    if (typeof Date.prototype.toJSON2 !== 'function') {
        Date.prototype.toJSON2 = function($0e) {
            return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + '';
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function($0e) {
            return this.valueOf();
        };
    };
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        $1H = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        $1I, $1J, $1K = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        $1L;

    function quote($0V) {
        $1H.lastIndex = 0;
        return $1H.test($0V) ? '"' + $0V.replace($1H, function(a) {
            var c = $1K[a];
            if (typeof c === 'string') {
                return c;
            };
            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + $0V + '"';
    };

    function str($0e, $1M) {
        var i, k, v, length, $1N = $1I,
            $1O, $1P = $1M[$0e];
        if ($1P && typeof $1P === 'object' && typeof $1P.toJSON2 === 'function') {
            $1P = $1P.toJSON2($0e);
        } else if ($1P && typeof $1P === 'object' && typeof $1P.toJSON === 'function' && !$1P.ignoreToJSON) {
            $1P = $1P.toJSON($0e);
        };
        if (typeof $1L === 'function') {
            $1P = $1L.call($1M, $0e, $1P);
        };
        switch (typeof $1P) {
            case 'string':
                return quote($1P);
            case 'number':
                return isFinite($1P) ? String($1P) : 'null';
            case 'boolean':
            case 'null':
                return String($1P);
            case 'object':
                if (!$1P) {
                    return 'null';
                };
                $1I += $1J;
                $1O = [];
                if (typeof $1P.length === 'number' && !$1P.propertyIsEnumerable('length')) {
                    length = $1P.length;
                    for (i = 0; i < length; i += 1) {
                        $1O[i] = str(i, $1P) || 'null';
                    };
                    v = $1O.length === 0 ? '[]' : $1I ? '[\n' + $1I + $1O.join(',\n' + $1I) + '\n' + $1N + ']' : '[' + $1O.join(',') + ']';
                    $1I = $1N;
                    return v;
                };
                if ($1L && typeof $1L === 'object') {
                    length = $1L.length;
                    for (i = 0; i < length; i += 1) {
                        k = $1L[i];
                        if (typeof k === 'string') {
                            v = str(k, $1P);
                            if (v) {
                                $1O.push(quote(k) + ($1I ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in $1P) {
                        if (Object.hasOwnProperty.call($1P, k)) {
                            v = str(k, $1P);
                            if (v) {
                                $1O.push(quote(k) + ($1I ? ': ' : ':') + v);
                            }
                        }
                    }
                };
                v = ($1O.length === 0) ? '{\u007D' : $1I ? '{\n' + $1I + $1O.join(',\n' + $1I) + '\n' + $1N + '\u007D' : '{' + $1O.join(',') + '\u007D';
                $1I = $1N;
                return v;
        }
    };
    if (typeof DayPilot.JSON.stringify !== 'function') {
        DayPilot.JSON.stringify = function($1P, $1Q, $1R) {
            var i;
            $1I = '';
            $1J = '';
            if (typeof $1R === 'number') {
                for (i = 0; i < $1R; i += 1) {
                    $1J += ' ';
                }
            } else if (typeof $1R === 'string') {
                $1J = $1R;
            };
            $1L = $1Q;
            if ($1Q && typeof $1Q !== 'function' && (typeof $1Q !== 'object' || typeof $1Q.length !== 'number')) {
                throw new Error('JSON.stringify');
            };
            return str('', {
                '': $1P
            });
        };
    };
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
(function() {
    if (typeof DayPilot.DatePicker !== 'undefined') {
        return;
    };
    DayPilot.DatePicker = function($a) {
        this.v = '444';
        var $b = "navigator_" + new Date().getTime();
        var $c = this;
        this.prepare = function() {
            this.locale = "en-us";
            this.target = null;
            this.resetTarget = true;
            this.pattern = this.$l.locale().datePattern;
            this.cssClassPrefix = "navigator_white";
            this.patterns = [];
            if ($a) {
                for (var name in $a) {
                    this[name] = $a[name];
                }
            };
            this.init();
        };
        this.init = function() {
            this.date = new DayPilot.Date(this.date);
            var $d = this.$m();
            if (this.resetTarget && !$d) {
                this.$n(this.date);
            }
        };
        this.close = function() {
            if (this.navigator) {
                this.navigator.dispose();
            };
            this.div.innerHTML = '';
            if (this.div && this.div.parentNode === document.body) {
                document.body.removeChild(this.div);
            }
        };
        this.$m = function() {
            var element = this.$o();
            if (!element) {
                return this.date;
            };
            var $d = null;
            if (element.tagName === "INPUT") {
                $d = element.value;
            } else {
                $d = element.innerText;
            };
            if (!$d) {
                return null;
            };
            var $e = DayPilot.Date.parse($d, $c.pattern);
            for (var i = 0; i < $c.patterns.length; i++) {
                if ($e) {
                    return $e;
                };
                $e = DayPilot.Date.parse($d, $c.patterns[i]);
            };
            return $e;
        };
        this.$n = function($e) {
            var element = this.$o();
            if (!element) {
                return;
            };
            var $d = $e.toString($c.pattern, $c.locale);
            if (element.tagName === "INPUT") {
                element.value = $d;
            } else {
                element.innerHTML = $d;
            }
        };
        this.$l = {};
        this.$l.locale = function() {
            return DayPilot.Locale.find($c.locale);
        };
        this.$o = function() {
            var id = this.target;
            var element = (id && id.nodeType && id.nodeType === 1) ? id : document.getElementById(id);
            return element;
        };
        this.show = function() {
            var element = this.$o();
            var navigator = this.navigator;
            var navigator = new DayPilot.Navigator($b);
            navigator.api = 2;
            navigator.cssOnly = true;
            navigator.cssClassPrefix = $c.cssClassPrefix;
            navigator.weekStarts = "Auto";
            navigator.locale = $c.locale;
            navigator.onTimeRangeSelected = function($f) {
                $c.date = $f.start;
                var $g = $f.start;
                var $d = $g.toString($c.pattern, $c.locale);
                var $f = {};
                $f.start = $g;
                $f.date = $g;
                $f.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onTimeRangeSelect === 'function') {
                    $c.onTimeRangeSelect($f);
                    if ($f.preventDefault.value) {
                        return;
                    }
                };
                $c.$n($d);
                $c.close();
                if (typeof $c.onTimeRangeSelected === 'function') {
                    $c.onTimeRangeSelected($f);
                }
            };
            this.navigator = navigator;
            var $h = DayPilot.abs(element);
            var $i = element.offsetHeight;
            var $j = document.createElement("div");
            $j.style.position = "absolute";
            $j.style.left = $h.x + "px";
            $j.style.top = ($h.y + $i) + "px";
            $j.id = $b;
            document.body.appendChild($j);
            this.div = $j;
            var $k = $c.$m() || new DayPilot.Date().getDatePart();
            navigator.startDate = $k;
            navigator.selectionStart = $k;
            navigator.init();
        };
        this.prepare();
    };
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilotMenu === 'undefined') {
    var DayPilotMenu = DayPilot.MenuVisible = {};
};
(function() {
    if (typeof DayPilot.Menu !== 'undefined') {
        return;
    };
    var DayPilotMenu = {};
    DayPilotMenu.mouse = null;
    DayPilotMenu.menu = null;
    DayPilotMenu.clickRegistered = false;
    DayPilot.Menu = function($a) {
        var $b = this;
        this.v = '444';
        this.zIndex = 10;
        this.useShadow = true;
        this.cssClassPrefix = null;
        this.cssOnly = true;
        this.menuTitle = null;
        this.showMenuTitle = false;
        if ($a && DayPilot.isArray($a)) {
            this.items = $a;
        };
        this.show = function(e, $c) {
            var $d = (typeof e.value === 'function') ? e.value() : null;
            if (typeof(DayPilot.Bubble) !== 'undefined') {
                DayPilot.Bubble.hideActive();
            };
            if (!$c) {
                DayPilotMenu.menuClean();
            };
            this.submenu = null;
            if (DayPilotMenu.mouse === null) return;
            var $e = document.createElement("div");
            $e.style.position = "absolute";
            $e.style.top = "0px";
            $e.style.left = "0px";
            $e.style.display = 'none';
            $e.style.overflow = 'hidden';
            $e.style.zIndex = this.zIndex + 1;
            $e.className = this.applyCssClass('main');
            $e.onclick = function() {
                this.parentNode.removeChild(this);
            };
            if (!this.items || this.items.length === 0) {
                throw "No menu items defined.";
            };
            if (this.showMenuTitle) {
                var title = document.createElement("div");
                title.innerHTML = this.menuTitle;
                title.className = this.applyCssClass("title");
                $e.appendChild(title);
            };
            for (var i = 0; i < this.items.length; i++) {
                var mi = this.items[i];
                var $f = document.createElement("div");
                if (typeof mi === 'undefined') {
                    continue;
                };
                if (mi.text === '-') {
                    var $g = document.createElement("div");
                    $f.appendChild($g);
                } else {
                    var $h = document.createElement("a");
                    $h.style.position = 'relative';
                    $h.style.display = "block";
                    if (mi.href) {
                        $h.href = mi.href.replace(/\x7B0\x7D/gim, $d);
                        $h.setAttribute("target", mi.target);
                    } else if (mi.onclick) {
                        $h.item = mi;
                        $h.onclick = mi.onclick;
                    } else if (mi.command) {
                        var $i = function(mi, $h) {
                            return function() {
                                var $j = $h.source;
                                var $f = mi;
                                $f.action = $f.action ? $f.action : 'CallBack';
                                var $k = $j.calendar || $j.root;
                                switch ($j.type) {
                                    case 'resource':
                                        $k.internal.resourceHeaderMenuClick($f.command, $j, $f.action);
                                        return;
                                    case 'selection':
                                        $k.internal.timeRangeMenuClick($f.command, $j, $f.action);
                                        return;
                                    default:
                                        $k.internal.eventMenuClick($f.command, $j, $f.action);
                                        return;
                                }
                            };
                        };
                        $h.onclick = $i(mi, $h);
                    };
                    $h.source = e;
                    var $l = document.createElement("span");
                    $l.innerHTML = mi.text;
                    $h.appendChild($l);
                    if (mi.image) {
                        var $m = document.createElement("img");
                        $m.src = mi.image;
                        $m.style.position = 'absolute';
                        $m.style.top = '0px';
                        $m.style.left = '0px';
                        $h.appendChild($m);
                    };
                    var $n = function(mi, $h) {
                        return function() {
                            var $j = $h.source;
                            var $f = mi;
                            setTimeout(function() {
                                if ($b.submenu && $b.submenu.item === $f) {
                                    return;
                                };
                                if ($b.submenu && $b.submenu.item !== $f) {
                                    $b.submenu.menu.hide();
                                    $b.submenu = null;
                                };
                                if (!$f.items) {
                                    return;
                                };
                                var $o = $b.cloneOptions();
                                $o.items = $f.items;
                                $b.submenu = {};
                                $b.submenu.menu = new DayPilot.Menu($o);
                                $b.submenu.menu.show($j, true);
                                $b.submenu.item = $f;
                            }, 500);
                        };
                    };
                    $h.onmouseover = $n(mi, $h);
                    $f.appendChild($h);
                };
                $e.appendChild($f);
            };
            $e.onclick = function(e) {
                window.setTimeout(function() {
                    DayPilotMenu.menuClean();
                }, 100);
            };
            $e.onmousedown = function(e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
            };
            $e.oncontextmenu = function() {
                return false;
            };
            document.body.appendChild($e);
            $e.style.display = '';
            var $p = $e.clientHeight;
            var $q = $e.offsetWidth;
            $e.style.display = 'none';
            var $r = document.documentElement.clientHeight;
            DayPilotMenu.mouse.x += 1;
            DayPilotMenu.mouse.y += 1;
            if (DayPilotMenu.mouse.clientY > $r - $p && $r !== 0) {
                var $s = DayPilotMenu.mouse.clientY - ($r - $p) + 5;
                $e.style.top = (DayPilotMenu.mouse.y - $s) + 'px';
            } else {
                $e.style.top = DayPilotMenu.mouse.y + 'px';
            };
            var $t = document.documentElement.clientWidth;
            if (DayPilotMenu.mouse.clientX > $t - $q && $t !== 0) {
                var $u = DayPilotMenu.mouse.clientX - ($t - $q) + 5;
                $e.style.left = (DayPilotMenu.mouse.x - $u) + 'px';
            } else {
                $e.style.left = DayPilotMenu.mouse.x + 'px';
            };
            $e.style.display = '';
            this.addShadow($e);
            this.div = $e;
            if (!$c) {
                DayPilot.Menu.active = this;
            };
            return;
        };
        this.applyCssClass = function($v) {
            if (this.cssClassPrefix) {
                return this.cssClassPrefix + (this.cssOnly ? "_" : "") + $v;
            } else {
                return "";
            }
        };
        this.cloneOptions = function() {
            var $o = {};
            var $w = ['cssOnly', 'cssClassPrefix', 'useShadow', 'zIndex'];
            for (var i = 0; i < $w.length; i++) {
                var p = $w[i];
                $o[p] = this[p];
            };
            return $o;
        };
        this.hide = function() {
            if (this.submenu) {
                this.submenu.menu.hide();
            };
            this.removeShadow();
            if (this.div && this.div.parentNode === document.body) {
                document.body.removeChild(this.div);
            }
        };
        this.addShadow = function($x) {
            if (!this.useShadow || this.cssOnly) {
                return;
            };
            if (!$x) {
                return;
            };
            if (this.shadows && this.shadows.length > 0) {
                this.removeShadow();
            };
            this.shadows = [];
            for (var i = 0; i < 5; i++) {
                var $y = document.createElement('div');
                $y.style.position = 'absolute';
                $y.style.width = $x.offsetWidth + 'px';
                $y.style.height = $x.offsetHeight + 'px';
                $y.style.top = $x.offsetTop + i + 'px';
                $y.style.left = $x.offsetLeft + i + 'px';
                $y.style.zIndex = this.zIndex;
                $y.style.filter = 'alpha(opacity:10)';
                $y.style.opacity = 0.1;
                $y.style.backgroundColor = '#000000';
                document.body.appendChild($y);
                this.shadows.push($y);
            }
        };
        this.removeShadow = function() {
            if (!this.shadows) {
                return;
            };
            for (var i = 0; i < this.shadows.length; i++) {
                document.body.removeChild(this.shadows[i]);
            };
            this.shadows = [];
        };
        var $o = DayPilot.isArray($a) ? null : $a;
        if ($o) {
            for (var name in $o) {
                this[name] = $o[name];
            }
        };
        DayPilot.re(document.body, 'mousemove', DayPilotMenu.mouseMove);
        if (!DayPilotMenu.clickRegistered) {
            DayPilot.re(document, 'mousedown', DayPilotMenu.menuClean);
            DayPilotMenu.clickRegistered = true;
        }
    };
    DayPilotMenu.menuClean = function(ev) {
        if (typeof(DayPilot.Menu.active) === 'undefined') return;
        if (DayPilot.Menu.active) {
            DayPilot.Menu.active.hide();
            DayPilot.Menu.active = null;
        }
    };
    DayPilotMenu.mouseMove = function(ev) {
        if (typeof(DayPilotMenu) === 'undefined') return;
        DayPilotMenu.mouse = DayPilotMenu.mousePosition(ev);
    };
    DayPilotMenu.mousePosition = function(e) {
        var $z = 0;
        var $A = 0;
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
            $z = e.pageX;
            $A = e.pageY;
        } else if (e.clientX || e.clientY) {
            $z = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            $A = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        };
        var $B = {};
        $B.x = $z;
        $B.y = $A;
        $B.clientY = e.clientY;
        $B.clientX = e.clientX;
        return $B;
    };
    DayPilot.MenuVisible.Menu = DayPilotMenu.Menu;
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();

if (typeof(DayPilot) === 'undefined') {
    DayPilot = {};
};
(function() {
    DayPilot.ModalStatic = {};
    DayPilot.ModalStatic.list = [];
    DayPilot.ModalStatic.hide = function() {
        if (this.list.length > 0) {
            var $a = this.list.pop();
            if ($a) {
                $a.hide();
            }
        }
    };
    DayPilot.ModalStatic.remove = function($b) {
        var $c = DayPilot.ModalStatic.list;
        for (var i = 0; i < $c.length; i++) {
            if ($c[i] === $b) {
                $c.splice(i, 1);
                return;
            }
        }
    };
    DayPilot.ModalStatic.close = function($d) {
        DayPilot.ModalStatic.result($d);
        DayPilot.ModalStatic.hide();
    };
    DayPilot.ModalStatic.result = function(r) {
        var $c = DayPilot.ModalStatic.list;
        if ($c.length > 0) {
            $c[$c.length - 1].result = r;
        }
    };
    DayPilot.ModalStatic.displayed = function($b) {
        var $c = DayPilot.ModalStatic.list;
        for (var i = 0; i < $c.length; i++) {
            if ($c[i] === $b) {
                return true;
            }
        };
        return false;
    };
    var $e = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE") !== -1);
    DayPilot.Modal = function() {
        this.autoStretch = true;
        this.autoStretchFirstLoadOnly = false;
        this.border = "10px solid #ccc";
        this.corners = 'Rounded';
        this.className = null;
        this.dragDrop = true;
        this.height = 200;
        this.maxHeight = null;
        this.opacity = 30;
        this.scrollWithPage = true;
        this.top = 20;
        this.useIframe = true;
        this.width = 500;
        this.zIndex = null;
        this.closed = null;
        var $f = this;
        this.id = '_' + new Date().getTime() + 'n' + (Math.random() * 10);
        this.registered = false;
        this.start = null;
        this.coords = null;
        this.showHtml = function($g) {
            if (DayPilot.ModalStatic.displayed(this)) {
                throw "This modal dialog is already displayed.";
            };
            if (!this.div) {
                this.create();
            };
            this.update();
            if (this.useIframe) {
                var $h = function(p, $i) {
                    return function() {
                        p.setInnerHTML(p.id + "iframe", $i);
                    };
                };
                window.setTimeout($h(this, $g), 0);
            } else {
                this.div.innerHTML = $g;
            };
            this.update();
            this.register();
        };
        this.rounded = function() {
            return this.corners && this.corners.toLowerCase() === 'rounded';
        };
        this.showUrl = function($j) {
            if (DayPilot.ModalStatic.displayed(this)) {
                throw "This modal dialog is already displayed.";
            };
            this.useIframe = true;
            if (!this.div) {
                this.create();
            };
            this.re(this.iframe, "load", this.onIframeLoad);
            this.iframe.src = $j;
            this.update();
            this.register();
        };
        this.update = function() {
            var $k = window;
            var $l = document;
            var scrollY = $k.pageYOffset ? $k.pageYOffset : (($l.documentElement && $l.documentElement.scrollTop) ? $l.documentElement.scrollTop : $l.body.scrollTop);
            var $m = function() {
                return $f.windowRect().y;
            };
            this.hideDiv.style.filter = "alpha(opacity=" + this.opacity + ")";
            this.hideDiv.style.opacity = "0." + this.opacity;
            this.hideDiv.style.backgroundColor = "black";
            if (this.zIndex) {
                this.hideDiv.style.zIndex = this.zIndex;
            };
            this.hideDiv.style.display = '';
            window.setTimeout(function() {
                $f.hideDiv.onclick = function() {
                    $f.hide();
                };
            }, 500);
            this.div.className = this.className;
            this.div.style.border = this.border;
            if (this.rounded()) {
                this.div.style.MozBorderRadius = "5px";
                this.div.style.webkitBorderRadius = "5px";
                this.div.style.borderRadius = "5px";
            };
            this.div.style.marginLeft = '-' + Math.floor(this.width / 2) + "px";
            this.div.style.position = 'absolute';
            this.div.style.top = (scrollY + this.top) + 'px';
            this.div.style.width = this.width + 'px';
            if (this.zIndex) {
                this.div.style.zIndex = this.zIndex;
            };
            if (this.height) {
                this.div.style.height = this.height + 'px';
            };
            if (this.useIframe && this.height) {
                this.iframe.style.height = (this.height) + 'px';
            };
            this.div.style.display = '';
            DayPilot.ModalStatic.list.push(this);
        };
        this.onIframeLoad = function() {
            $f.iframe.contentWindow.modal = $f;
            if ($f.autoStretch) {
                $f.stretch();
            }
        };
        this.stretch = function() {
            var $m = function() {
                return $f.windowRect().y;
            };
            var $n = this.maxHeight || $m() - 2 * this.top;
            for (var h = this.height; h < $n && this.hasScrollbar(); h += 10) {
                this.iframe.style.height = (h) + 'px';
                this.div.style.height = h + 'px';
            };
            if (this.autoStretchFirstLoadOnly) {
                this.ue(this.iframe, "load", this.onIframeLoad);
            }
        };
        this.hasScrollbar = function() {
            var document = this.iframe.contentWindow.document;
            var $o = document.compatMode === 'BackCompat' ? document.body : document.documentElement;
            var $p = $o.scrollHeight > $o.clientHeight;
            var $q = $o.scrollWidth > $o.clientWidth;
            return $p;
        };
        this.windowRect = function() {
            var $l = document;
            if ($l.compatMode === "CSS1Compat" && $l.documentElement && $l.documentElement.clientWidth) {
                var x = $l.documentElement.clientWidth;
                var y = $l.documentElement.clientHeight;
                return {
                    x: x,
                    y: y
                };
            } else {
                var x = $l.body.clientWidth;
                var y = $l.body.clientHeight;
                return {
                    x: x,
                    y: y
                };
            }
        };
        this.register = function() {
            if (this.registered) {
                return;
            };
            this.re(window, 'resize', this.resize);
            this.re(window, 'scroll', this.resize);
            if (this.dragDrop) {
                this.re(document, 'mousemove', this.drag);
                this.re(document, 'mouseup', this.drop);
            };
            this.registered = true;
        };
        this.drag = function(e) {
            if (!$f.coords) {
                return;
            };
            var e = e || window.event;
            var $r = $f.mc(e);
            var x = $r.x - $f.coords.x;
            var y = $r.y - $f.coords.y;
            $f.div.style.marginLeft = '0px';
            $f.div.style.top = ($f.start.y + y) + "px";
            $f.div.style.left = ($f.start.x + x) + "px";
        };
        this.drop = function(e) {
            if (!$f.coords) {
                return;
            };
            $f.unmaskIframe();
            $f.coords = null;
        };
        this.maskIframe = function() {
            if (!this.useIframe) {
                return;
            };
            var $s = 80;
            var $t = document.createElement("div");
            $t.style.backgroundColor = "#ffffff";
            $t.style.filter = "alpha(opacity=" + $s + ")";
            $t.style.opacity = "0." + $s;
            $t.style.width = "100%";
            $t.style.height = this.height + "px";
            $t.style.position = "absolute";
            $t.style.left = '0px';
            $t.style.top = '0px';
            this.div.appendChild($t);
            this.mask = $t;
        };
        this.unmaskIframe = function() {
            if (!this.useIframe) {
                return;
            };
            this.div.removeChild(this.mask);
            this.mask = null;
        };
        this.resize = function() {
            if (!$f.hideDiv) {
                return;
            };
            if (!$f.div) {
                return;
            };
            if ($f.hideDiv.style.display === 'none') {
                return;
            };
            if ($f.div.style.display === 'none') {
                return;
            };
            var scrollY = window.pageYOffset ? window.pageYOffset : ((document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop);
            if (!$f.scrollWithPage) {
                $f.div.style.top = (scrollY + $f.top) + 'px';
            }
        };
        this.re = function(el, ev, $u) {
            if (el.addEventListener) {
                el.addEventListener(ev, $u, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + ev, $u);
            }
        };
        this.ue = function(el, ev, $u) {
            if (el.removeEventListener) {
                el.removeEventListener(ev, $u, false);
            } else if (el.detachEvent) {
                el.detachEvent("on" + ev, $u);
            }
        };
        this.mc = function(ev) {
            if (ev.pageX || ev.pageY) {
                return {
                    x: ev.pageX,
                    y: ev.pageY
                };
            };
            return {
                x: ev.clientX + document.documentElement.scrollLeft,
                y: ev.clientY + document.documentElement.scrollTop
            };
        };
        this.abs = function(element) {
            var r = {
                x: element.offsetLeft,
                y: element.offsetTop
            };
            while (element.offsetParent) {
                element = element.offsetParent;
                r.x += element.offsetLeft;
                r.y += element.offsetTop;
            };
            return r;
        };
        this.create = function() {
            var $v = document.createElement("div");
            $v.id = this.id + "hide";
            $v.style.position = 'fixed';
            $v.style.left = "0px";
            $v.style.top = "0px";
            $v.style.right = "0px";
            $v.style.bottom = "0px";
            $v.style.backgroundColor = "black";
            $v.style.opacity = 0.50;
            $v.oncontextmenu = function() {
                return false;
            };
            document.body.appendChild($v);
            var $w = document.createElement("div");
            $w.id = this.id + 'popup';
            $w.style.position = 'fixed';
            $w.style.left = '50%';
            $w.style.top = '0px';
            $w.style.backgroundColor = 'white';
            $w.style.width = "50px";
            $w.style.height = "50px";
            if (this.dragDrop) {
                $w.onmousedown = this.dragStart;
            };
            var $x = 50;
            var $y = null;
            if (this.useIframe) {
                $y = document.createElement("iframe");
                $y.id = this.id + "iframe";
                $y.name = this.id + "iframe";
                $y.frameBorder = '0';
                $y.style.width = '100%';
                $y.style.height = $x + 'px';
                $w.appendChild($y);
            };
            document.body.appendChild($w);
            this.div = $w;
            this.iframe = $y;
            this.hideDiv = $v;
        };
        this.dragStart = function(e) {
            $f.maskIframe();
            $f.coords = $f.mc(e || window.event);
            $f.start = {
                x: $f.div.offsetLeft,
                y: $f.div.offsetTop
            };
        };
        this.setInnerHTML = function(id, $i) {
            var $z = window.frames[id];
            var $l = $z.contentWindow || $z.document || $z.contentDocument;
            if ($l.document) {
                $l = $l.document;
            };
            $l.body.innerHTML = $i;
        };
        this.close = function($d) {
            this.result = $d;
            this.hide();
        };
        this.hide = function() {
            if (this.div) {
                this.div.style.display = 'none';
                this.hideDiv.style.display = 'none';
                if (!this.useIframe) {
                    this.div.innerHTML = null;
                }
            };
            DayPilot.ModalStatic.remove(this);
            if (this.closed) {
                this.closed();
            }
        };
    };
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilotMonth === 'undefined') {
    var DayPilotMonth = DayPilot.MonthVisible = {};
};
(function() {
    var $a = function() {};
    if (typeof DayPilot.Month !== 'undefined') {
        return;
    };
    var DayPilotMonth = {};
    DayPilot.Month = function($b) {
        this.v = '444';
        this.nav = {};
        this.nav.top = document.getElementById($b);
        var $c = this;
        this.id = $b;
        this.isMonth = true;
        this.api = 2;
        this.hideUntilInit = true;
        this.startDate = new DayPilot.Date();
        this.width = '100%';
        this.cellHeight = 100;
        this.cellMarginBottom = 0;
        this.allowMultiSelect = true;
        this.autoRefreshCommand = 'refresh';
        this.autoRefreshEnabled = false;
        this.autoRefreshInterval = 60;
        this.autoRefreshMaxCount = 20;
        this.eventFontColor = "#000000";
        this.eventFontFamily = "Tahoma";
        this.eventFontSize = "11px";
        this.headerBackColor = '#ECE9D8';
        this.headerFontColor = '#000000';
        this.headerFontFamily = "Tahoma";
        this.headerFontSize = "10pt";
        this.headerHeight = 20;
        this.heightSpec = "Auto";
        this.weekStarts = 1;
        this.innerBorderColor = '#cccccc';
        this.borderColor = 'black';
        this.eventHeight = 25;
        this.cellHeaderHeight = 16;
        this.numberFormat = "0.00";
        this.clientState = {};
        this.afterRender = function() {};
        this.backColor = '#FFFFD5';
        this.nonBusinessBackColor = '#FFF4BC';
        this.cellHeaderBackColor = '';
        this.cellHeaderFontColor = '#000000';
        this.cellHeaderFontFamily = 'Tahoma';
        this.cellHeaderFontSize = '10pt';
        this.cssOnly = true;
        this.eventBackColor = 'White';
        this.eventBorderColor = 'Black';
        this.eventCorners = "Regular";
        this.eventFontColor = '#000000';
        this.eventFontFamily = 'Tahoma';
        this.eventFontSize = '11px';
        this.cellWidth = 14.285;
        this.lineSpace = 1;
        this.locale = "en-us";
        this.messageHideAfter = 5000;
        this.notifyCommit = 'Immediate';
        this.eventMoveToPosition = false;
        this.eventTextLayer = 'Top';
        this.eventStartTime = true;
        this.eventEndTime = true;
        this.eventTextAlignment = 'Center';
        this.eventTextLeftIndent = 20;
        this.showWeekend = true;
        this.cellMode = false;
        this.shadowType = "Fill";
        this.eventTimeFontColor = 'gray';
        this.eventTimeFontFamily = 'Tahoma';
        this.eventTimeFontSize = '8pt';
        this.viewType = 'Month';
        this.weeks = 1;
        this.eventClickHandling = 'Enabled';
        this.eventDoubleClickHandling = 'Enabled';
        this.eventMoveHandling = 'Update';
        this.eventResizeHandling = 'Update';
        this.eventRightClickHandling = 'ContextMenu';
        this.eventSelectHandling = 'Update';
        this.headerClickHandling = "Enabled";
        this.timeRangeSelectedHandling = 'Enabled';
        this.timeRangeDoubleClickHandling = 'Enabled';
        this.backendUrl = null;
        this.cellEvents = [];
        this.elements = {};
        this.elements.events = [];
        this.$1F = {};
        this.$1F.events = {};
        this.events = {};
        this.autoRefreshCount = 0;
        this.$1G = function($d, $e) {
            var $d = eval("(" + $d + ")");
            if ($d.BubbleGuid) {
                var $f = $d.BubbleGuid;
                var $g = this.bubbles[$f];
                delete this.bubbles[$f];
                $c.$1H();
                if (typeof $d.Result.BubbleHTML !== 'undefined') {
                    $g.updateView($d.Result.BubbleHTML, $g);
                };
                return;
            };
            if ($d.CallBackRedirect) {
                document.location.href = $d.CallBackRedirect;
                return;
            };
            if (typeof $d.ClientState !== 'undefined') {
                $c.clientState = $d.ClientState;
            };
            if ($d.UpdateType === "None") {
                $c.$1I($d.CallBackData, true);
                if ($d.Message) {
                    $c.message($d.Message);
                };
                return;
            };
            if ($d.VsUpdate) {
                var $h = document.createElement("input");
                $h.type = 'hidden';
                $h.name = $c.id + "_vsupdate";
                $h.id = $h.name;
                $h.value = $d.VsUpdate;
                $c.vsph.innerHTML = '';
                $c.vsph.appendChild($h);
            };
            $c.events.list = $d.Events;
            if (typeof $d.TagFields !== 'undefined') {
                $c.tagFields = $d.TagFields;
            };
            if (typeof $d.SortDirections !== 'undefined') {
                $c.sortDirections = $d.SortDirections;
            };
            if ($d.UpdateType === "Full") {
                $c.cellProperties = $d.CellProperties;
                $c.headerProperties = $d.HeaderProperties;
                $c.startDate = $d.StartDate;
                if (typeof $d.ShowWeekend !== 'undefined') {
                    $c.showWeekend = $d.ShowWeekend;
                };
                $c.headerBackColor = $d.HeaderBackColor ? $d.HeaderBackColor : $c.headerBackColor;
                $c.backColor = $d.BackColor ? $d.BackColor : $c.backColor;
                $c.nonBusinessBackColor = $d.NonBusinessBackColor ? $d.NonBusinessBackColor : $c.nonBusinessBackColor;
                $c.locale = $d.Locale ? $d.Locale : $c.locale;
                $c.timeFormat = $d.TimeFormat ? $d.TimeFormat : $c.timeFormat;
                if (typeof $d.WeekStarts !== 'undefined') {
                    $c.weekStarts = $d.WeekStarts;
                };
                $c.hashes = $d.Hashes;
            };
            $c.multiselect.clear(true);
            $c.multiselect.initList = $d.SelectedEvents;
            $c.$1J();
            $c.$1K();
            $c.$1L();
            if ($d.UpdateType === "Full") {
                $c.$1M();
                $c.$1N();
            };
            $c.$1O();
            $c.$1P();
            $c.$1Q();
            $c.$1I($d.CallBackData, true);
            $c.$1R();
            if ($d.Message) {
                $c.message($d.Message);
            }
        };
        this.$1I = function($i, $j) {
            var $k = function($i, $l) {
                return function() {
                    if ($c.$1S()) {
                        if (typeof $c.onAfterRender === 'function') {
                            var $m = {};
                            $m.isCallBack = $l;
                            $m.data = $i;
                            $c.onAfterRender($m);
                        }
                    } else {
                        if ($c.afterRender) {
                            $c.afterRender($i, $l);
                        }
                    }
                };
            };
            window.setTimeout($k($i, $j), 0);
        };
        this.$1S = function() {
            return $c.api === 2;
        };
        this.$1T = function($n) {
            if (this.cssClassPrefix) {
                return this.cssClassPrefix + $n;
            } else {
                return "";
            }
        };
        this.$1L = function() {
            if (!this.events.list) {
                return;
            };
            if (typeof this.onBeforeEventRender === 'function') {
                var length = this.events.list.length;
                for (var i = 0; i < length; i++) {
                    this.$1U(i);
                }
            };
            if (this.cellMode) {
                this.$1V();
            } else {
                this.$1W();
            }
        };
        this.$1H = function() {};
        this.$1W = function() {
            if (!this.events.list) {
                return;
            };
            for (var x = 0; x < this.events.list.length; x++) {
                var e = this.events.list[x];
                e.start = new DayPilot.Date(e.start).d;
                e.end = new DayPilot.Date(e.end).d;
                if (e.start.getTime() > e.end.getTime()) {
                    continue;
                };
                for (var i = 0; i < this.rows.length; i++) {
                    var $o = this.rows[i];
                    if ($o.belongsHere(e)) {
                        var ep = new DayPilot.Event(e, $c);
                        $o.events.push(ep);
                        if (typeof this.onBeforeEventRender === 'function') {
                            ep.cache = this.$1F.events[x];
                        }
                    }
                }
            };
            for (var ri = 0; ri < this.rows.length; ri++) {
                var $o = this.rows[ri];
                $o.events.sort(this.$1X);
                for (var ei = 0; ei < this.rows[ri].events.length; ei++) {
                    var ev = $o.events[ei];
                    var $p = $o.getStartColumn(ev);
                    var $q = $o.getWidth(ev);
                    $o.putIntoLine(ev, $p, $q, ri);
                }
            }
        };
        this.$1V = function() {
            this.cellEvents = [];
            for (var x = 0; x < this.$1Y(); x++) {
                this.cellEvents[x] = [];
                for (var y = 0; y < this.rows.length; y++) {
                    var $r = {};
                    var d = DayPilot.Date.addDays(this.firstDate, y * 7 + x);
                    $r.start = d;
                    $r.end = DayPilot.Date.addDays(d, 1);
                    $r.events = [];
                    this.cellEvents[x][y] = $r;
                }
            };
            for (var i = 0; i < this.events.list.length; i++) {
                var e = this.events.list[i];
                e.start = new DayPilot.Date(e.start);
                e.end = new DayPilot.Date(e.start);
                if (e.start.getTime() > e.end.getTime()) {
                    continue;
                };
                for (var x = 0; x < this.$1Y(); x++) {
                    for (var y = 0; y < this.rows.length; y++) {
                        var $r = this.cellEvents[x][y];
                        if (e.start.getTime() >= $r.start.getTime() && e.start.getTime() < $r.end.getTime()) {
                            var ep = new DayPilot.Event(e, $c);
                            $r.events.push(ep);
                            if (typeof this.onBeforeEventRender === 'function') {
                                ep.cache = this.$1F.events[i];
                            }
                        }
                    }
                }
            };
            for (var x = 0; x < this.$1Y(); x++) {
                for (var y = 0; y < this.rows.length; y++) {
                    var $r = this.cellEvents[x][y];
                    $r.events.sort(this.$1X);
                }
            }
        };
        this.$1J = function() {
            for (var i = 0; i < this.elements.events.length; i++) {
                var e = this.elements.events[i];
                e.event = null;
                e.click = null;
                e.parentNode.removeChild(e);
            };
            this.elements.events = [];
        };
        this.$1Q = function() {
            this.$1F.events = {};
            if (this.cellMode) {
                this.$1Z();
            } else {
                this.$20();
            };
            this.multiselect.redraw();
        };
        this.$1Z = function() {
            this.elements.events = [];
            for (var x = 0; x < this.$1Y(); x++) {
                for (var y = 0; y < this.rows.length; y++) {
                    var $r = this.cellEvents[x][y];
                    var $s = this.cells[x][y];
                    for (var i = 0; i < $r.events.length; i++) {
                        var ep = $r.events[i];
                        ep.part.colStart = x;
                        ep.part.colWidth = 1;
                        ep.part.row = y;
                        ep.part.line = i;
                        ep.part.startsHere = true;
                        ep.part.endsHere = true;
                        this.$21(ep);
                    }
                }
            }
        };
        this.$20 = function() {
            this.elements.events = [];
            for (var ri = 0; ri < this.rows.length; ri++) {
                var $o = this.rows[ri];
                for (var li = 0; li < $o.lines.length; li++) {
                    var $t = $o.lines[li];
                    for (var pi = 0; pi < $t.length; pi++) {
                        this.$21($t[pi]);
                    }
                }
            }
        };
        this.$22 = function(a, b) {
            if (!a || !b || !a.start || !b.start) {
                return 0;
            };
            var $u = a.start().ticks - b.start().ticks;
            if ($u !== 0) {
                return $u;
            };
            var $v = b.end().ticks - a.end().ticks;
            return $v;
        };
        this.$1X = function(a, b) {
            if (!a || !b) {
                return 0;
            };
            if (!a.data || !b.data || !a.data.sort || !b.data.sort || a.data.sort.length === 0 || b.data.sort.length === 0) {
                return $c.$22(a, b);
            };
            var $d = 0;
            var i = 0;
            while ($d === 0 && a.data.sort[i] && b.data.sort[i]) {
                if (a.data.sort[i] === b.data.sort[i]) {
                    $d = 0;
                } else {
                    $d = $c.$23(a.data.sort[i], b.data.sort[i], $c.sortDirections[i]);
                };
                i++;
            };
            return $d;
        };
        this.$23 = function(a, b, $w) {
            var $x = ($w !== "desc");
            var $y = $x ? -1 : 1;
            var $z = -$y;
            if (a === null && b === null) {
                return 0;
            };
            if (b === null) {
                return $z;
            };
            if (a === null) {
                return $y;
            };
            var ar = [];
            ar[0] = a;
            ar[1] = b;
            ar.sort();
            return a === ar[0] ? $y : $z;
        };
        this.$24 = function(x, y, $t, $A, $B, e) {
            if (!$B) {
                $B = 0;
            };
            var $C = $A;
            this.shadow = {};
            this.shadow.list = [];
            this.shadow.start = {
                x: x,
                y: y
            };
            this.shadow.width = $A;
            if (this.eventMoveToPosition) {
                $C = 1;
                this.shadow.position = $t;
            };
            var $D = y * 7 + x - $B;
            if ($D < 0) {
                $C += $D;
                x = 0;
                y = 0;
            };
            var $E = $B;
            while ($E >= 7) {
                y--;
                $E -= 7;
            };
            if ($E > x) {
                var $F = 7 - this.$1Y();
                if ($E > (x + $F)) {
                    y--;
                    x = x + 7 - $E;
                } else {
                    $C = $C - $E + x;
                    x = 0;
                }
            } else {
                x -= $E;
            };
            if (y < 0) {
                y = 0;
                x = 0;
            };
            var $G = null;
            if (DayPilotMonth.resizingEvent) {
                $G = 'w-resize';
            } else if (DayPilotMonth.movingEvent) {
                $G = "move";
            };
            this.nav.top.style.cursor = $G;
            while ($C > 0 && y < this.rows.length) {
                var $H = Math.min(this.$1Y() - x, $C);
                var $o = this.rows[y];
                var top = this.$25(y);
                var $I = $o.getHeight();
                if (this.eventMoveToPosition) {
                    top = this.$26(y, $t);
                    $I = 2;
                };
                var $J = document.createElement("div");
                $J.setAttribute("unselectable", "on");
                $J.style.position = 'absolute';
                $J.style.left = (this.$27() * x) + '%';
                $J.style.width = (this.$27() * $H) + '%';
                $J.style.top = (top) + 'px';
                $J.style.height = ($I) + 'px';
                $J.style.cursor = $G;
                var $K = document.createElement("div");
                $K.setAttribute("unselectable", "on");
                $J.appendChild($K);
                if (this.cssOnly) {
                    $J.className = this.$1T("_shadow");
                    $K.className = this.$1T("_shadow_inner");
                };
                if (!this.cssOnly) {
                    $K.style.position = "absolute";
                    $K.style.top = "0px";
                    $K.style.right = "0px";
                    $K.style.left = "0px";
                    $K.style.bottom = "0px";
                    if (this.shadowType === 'Fill') {
                        $K.style.backgroundColor = "#aaaaaa";
                        $K.style.opacity = 0.5;
                        $K.style.filter = "alpha(opacity=50)";
                        if (e && e.event) {
                            $K.style.overflow = 'hidden';
                            $K.style.fontSize = this.eventFontSize;
                            $K.style.fontFamily = this.eventFontFamily;
                            $K.style.color = this.eventFontColor;
                            $K.innerHTML = e.event.client.innerHTML() ? e.event.client.innerHTML() : e.event.text();
                        }
                    } else {
                        $K.style.border = '2px dotted #666666';
                    }
                };
                var $L = this.nav.events;
                $L.appendChild($J);
                this.shadow.list.push($J);
                $C -= ($H + 7 - this.$1Y());
                x = 0;
                y++;
            }
        };
        this.$28 = function() {
            if (this.shadow) {
                var $L = this.nav.events;
                for (var i = 0; i < this.shadow.list.length; i++) {
                    $L.removeChild(this.shadow.list[i]);
                };
                this.shadow = null;
                this.nav.top.style.cursor = '';
            }
        };
        this.$26 = function($o, $t) {
            var top = 0;
            for (var i = 0; i < $o; i++) {
                top += this.rows[i].getHeight();
            };
            top += this.cellHeaderHeight;
            top += $t * $M.lineHeight();
            return top;
        };
        this.$29 = function(x, y) {
            return DayPilot.Date.addDays(this.firstDate, y * 7 + x);
        };
        this.$1U = function(i) {
            var $N = this.$1F.events;
            var $i = this.events.list[i];
            var $O = {};
            for (var name in $i) {
                $O[name] = $i[name];
            };
            if (typeof this.onBeforeEventRender === 'function') {
                var $m = {};
                $m.e = $O;
                this.onBeforeEventRender($m);
            };
            $N[i] = $O;
        };
        this.$21 = function(ep, $P) {
            var $P = this.cellMode;
            var $o = ep.part.row;
            var $t = ep.part.line;
            var $p = ep.part.colStart;
            var $q = ep.part.colWidth;
            var $N = ep.cache || ep.data;
            var $Q = $P ? 0 : this.$27() * ($p);
            var $A = $P ? 100 : this.$27() * ($q);
            var top = $P ? $t * $M.lineHeight() : this.$26($o, $t);
            var e = document.createElement("div");
            e.setAttribute("unselectable", "on");
            e.style.height = this.eventHeight + 'px';
            if (!this.cssOnly) {
                e.style.fontFamily = this.eventFontFamily;
            } else {
                e.style.position = "relative";
                e.style.overflow = "hidden";
                e.className = this.$1T("_event");
            };
            if ($N.cssClass) {
                DayPilot.Util.addClass(e, $N.cssClass);
            };
            e.event = ep;
            if ($P) {
                e.style.marginRight = "2px";
                e.style.marginBottom = "2px";
            } else {
                e.style.width = $A + '%';
                e.style.position = 'absolute';
                e.style.left = $Q + '%';
                e.style.top = top + 'px';
            };
            if (this.showToolTip && $N.toolTip) {
                e.title = $N.toolTip;
            };
            e.onclick = this.$2a;;
            e.ondblclick = this.$2b;
            e.oncontextmenu = this.$2c;
            e.onmousedown = this.$2d;
            e.onmousemove = this.$2e;
            e.onmouseout = this.$2f;
            e.ontouchstart = $R.onEventTouchStart;
            e.ontouchmove = $R.onEventTouchMove;
            e.ontouchend = $R.onEventTouchEnd;
            if (!this.cssOnly) {
                var back = (ep.client.backColor()) ? ep.client.backColor() : this.eventBackColor;
                var $S = document.createElement("div");
                $S.setAttribute("unselectable", "on");
                $S.style.height = (this.eventHeight - 2) + 'px';
                $S.style.overflow = 'hidden';
                $S.style.position = "absolute";
                $S.style.left = "2px";
                $S.style.right = "2px";
                $S.style.paddingLeft = '2px';
                $S.style.border = '1px solid ' + $c.eventBorderColor;
                $S.style.backgroundColor = back;
                $S.style.fontFamily = "";
                $S.className = this.$1T("event");
                if ($M.rounded()) {
                    $S.style.MozBorderRadius = "5px";
                    $S.style.webkitBorderRadius = "5px";
                    $S.style.borderRadius = "5px";
                };
                var $K = [];
                var $T = this.eventTextLayer === 'Top';
                var $U = this.eventStartTime;
                var $V = this.eventEndTime;
                var $W = this.eventTextAlignment;
                var $X = this.eventTextLeftIndent;
                var $Y = this.eventTextLayer === 'Floats';
                if ($Y) {
                    if ($U) {
                        $K.push("<div unselectable='on' style='float:left; font-size:");
                        $K.push(this.eventTimeFontSize);
                        $K.push(";color:");
                        $K.push(this.eventTimeFontColor);
                        $K.push(";font-family:");
                        $K.push(this.eventTimeFontFamily);
                        $K.push("'>");
                        $K.push(DayPilot.Date.hours(ep.start().d, $c.timeFormat === 'Clock12Hours'));
                        $K.push("</div>");
                    };
                    if ($V) {
                        $K.push("<div unselectable='on' style='float:right;font-size:");
                        $K.push(this.eventTimeFontSize);
                        $K.push(";color:");
                        $K.push(this.eventTimeFontColor);
                        $K.push(";font-family:");
                        $K.push(this.eventTimeFontFamily);
                        $K.push("'>");
                        $K.push(DayPilot.Date.hours(ep.end().d, $c.timeFormat === 'Clock12Hours'));
                        $K.push("</div>");
                    };
                    $K.push("<div unselectable='on' style='");
                    $K.push("font-size:");
                    $K.push(this.eventFontSize);
                    $K.push(";color:");
                    $K.push(this.eventFontColor);
                    $K.push(";font-family:");
                    $K.push(this.eventFontFamily);
                    if ($W === 'Center') {
                        $K.push(";text-align:center;");
                    };
                    $K.push("'>");
                    if (ep.client.innerHTML()) {
                        $K.push(ep.client.innerHTML());
                    } else {
                        $K.push(ep.text());
                    };
                    $K.push("</div>");
                } else {
                    if ($U) {
                        if ($W === 'Left') {
                            $K.push("<div unselectable='on' style='position:absolute;text-align:left;height:1px;font-size:1px;width:100%'><div unselectable='on' style='font-size:");
                            $K.push(this.eventTimeFontSize);
                            $K.push(";color:");
                            $K.push(this.eventTimeFontColor);
                            $K.push(";font-family:");
                            $K.push(this.eventTimeFontFamily);
                            $K.push(";text-align:right;");
                            $K.push("width:");
                            $K.push($X - 4);
                            $K.push("px;");
                            $K.push("><span style='background-color:");
                        } else {
                            $K.push("<div unselectable='on' style='position:absolute;text-align:left;height:1px;font-size:1px;width:100%'><div unselectable='on' style='font-size:");
                            $K.push(this.eventTimeFontSize);
                            $K.push(";color:");
                            $K.push(this.eventTimeFontColor);
                            $K.push(";font-family:");
                            $K.push(this.eventTimeFontFamily);
                            $K.push(";'><span style='background-color:");
                        };
                        $K.push(back);
                        $K.push("' unselectable='on'>");
                        if (ep.part.startsHere) {
                            $K.push(DayPilot.Date.hours(ep.start().d, $c.timeFormat === 'Clock12Hours'));
                        } else {
                            $K.push("~");
                        };
                        $K.push("</span></div></div>");
                    };
                    if ($V) {
                        $K.push("<div unselectable='on' style='position:absolute;text-align:right;height:1px;font-size:1px;width:100%'><div unselectable='on' style='margin-right:4px;font-size:");
                        $K.push(this.eventTimeFontSize);
                        $K.push(";color:");
                        $K.push(this.eventTimeFontColor);
                        $K.push(";font-family:");
                        $K.push(this.eventTimeFontFamily);
                        $K.push(";'><span style='background-color:");
                        $K.push(back);
                        $K.push("' unselectable='on'>");
                        if (ep.part.endsHere) {
                            $K.push(DayPilot.Date.hours(ep.end().d, $c.timeFormat === 'Clock12Hours'));
                        } else {
                            $K.push("~");
                        };
                        $K.push("</span></div></div>");
                    };
                    if ($W === 'Left') {
                        var $Q = $U ? $X : 0;
                        $K.push("<div style='margin-top:0px;height:");
                        $K.push(this.eventHeight - 2);
                        $K.push("px;");
                        $K.push(";overflow:hidden;text-align:left;padding-left:");
                        $K.push($Q);
                        $K.push("px;font-size:");
                        $K.push(this.eventFontSize);
                        $K.push(";color:");
                        $K.push(this.eventFontColor);
                        $K.push(";font-family:");
                        $K.push(this.eventFontFamily);
                        $K.push("' unselectable='on'>");
                        if (ep.client.innerHTML()) {
                            $K.push(ep.client.innerHTML());
                        } else {
                            $K.push(ep.text());
                        };
                        $K.push("</div>");
                    } else if ($W === 'Center') {
                        if ($T) {
                            $K.push("<div style='position:absolute; text-align:center; width: 98%; height:1px; font-size: 1px;'>");
                            $K.push("<span style='background-color:");
                            $K.push(back);
                            $K.push(";font-size:");
                            $K.push(this.eventFontSize);
                            $K.push(";color:");
                            $K.push(this.eventFontColor);
                            $K.push(";font-family:");
                            $K.push(this.eventFontFamily);
                            $K.push("' unselectable='on'>");
                            if (ep.client.innerHTML()) {
                                $K.push(ep.client.innerHTML());
                            } else {
                                $K.push(ep.text());
                            };
                            $K.push("</span>");
                            $K.push("</div>");
                        } else {
                            $K.push("<div style='margin-top:0px;height:");
                            $K.push(this.eventHeight - 2);
                            $K.push("px;");
                            $K.push(";overflow:hidden;text-align:center;font-size:");
                            $K.push(this.eventFontSize);
                            $K.push(";color:");
                            $K.push(this.eventFontColor);
                            $K.push(";font-family:");
                            $K.push(this.eventFontFamily);
                            $K.push("' unselectable='on'>");
                            if (ep.client.innerHTML()) {
                                $K.push(ep.client.innerHTML());
                            } else {
                                $K.push(ep.text());
                            };
                            $K.push("</div>");
                        }
                    }
                };
                $S.innerHTML = $K.join('');
                e.appendChild($S);
            } else {
                if (!ep.part.startsHere) {
                    DayPilot.Util.addClass(e, this.$1T("_event_continueleft"));
                };
                if (!ep.part.endsHere) {
                    DayPilot.Util.addClass(e, this.$1T("_event_continueright"));
                };
                var $S = document.createElement("div");
                $S.setAttribute("unselectable", "on");
                $S.className = this.$1T("_event_inner");
                if (ep.client.innerHTML()) {
                    $S.innerHTML = ep.client.innerHTML();
                } else {
                    $S.innerHTML = ep.text();
                };
                if ($N.backColor) {
                    $S.style.background = $N.backColor;
                };
                e.appendChild($S);
            };
            if ($N.areas) {
                var $Z = $N.areas;
                for (var i = 0; i < $Z.length; i++) {
                    var $00 = $Z[i];
                    if ($00.v !== 'Visible') {
                        continue;
                    };
                    var a = DayPilot.Areas.createArea(e, ep, $00);
                    e.appendChild(a);
                }
            };
            this.elements.events.push(e);
            if ($P) {
                this.cells[$p][$o].body.appendChild(e);
            } else {
                this.nav.events.appendChild(e);
            };
            if ($c.multiselect.$2g(e.event)) {
                $c.multiselect.add(e.event, true);
            };
            var $s = e;
            if ($c.$1S()) {
                if (typeof $c.onAfterEventRender === 'function') {
                    var $m = {};
                    $m.e = $s.event;
                    $m.div = $s;
                    $c.onAfterEventRender($m);
                }
            } else {
                if ($c.afterEventRender) {
                    $c.afterEventRender($s.event, $s);
                }
            }
        };
        this.$2a = function(ev) {
            if ($R.start) {
                return;
            };
            $c.$2h(this, ev);
        };
        this.$2b = function(ev) {
            $c.$2i(this, ev);
        };
        this.$2e = function(ev) {
            var e = this;
            var ep = e.event;
            if (typeof(DayPilotMonth) === 'undefined') {
                return;
            };
            if (DayPilotMonth.movingEvent || DayPilotMonth.resizingEvent) {
                return;
            };
            var $B = DayPilot.mo3(e, ev);
            if (!$B) {
                return;
            };
            DayPilot.Areas.showAreas(e, e.event);
            if ($c.cssOnly) {
                $c.$2j(e.event).each(function($s) {
                    DayPilot.Util.addClass($s, $c.$1T("_event_hover"));
                });
            };
            var $01 = 6;
            if (!$c.cellMode && $B.x <= $01 && ep.client.resizeEnabled()) {
                if (ep.part.startsHere) {
                    e.style.cursor = "w-resize";
                    e.dpBorder = 'left';
                } else {
                    e.style.cursor = 'not-allowed';
                }
            } else if (!$c.cellMode && e.clientWidth - $B.x <= $01 && ep.client.resizeEnabled()) {
                if (ep.part.endsHere) {
                    e.style.cursor = "e-resize";
                    e.dpBorder = 'right';
                } else {
                    e.style.cursor = 'not-allowed';
                }
            } else {
                e.style.cursor = 'default';
            };
            if (typeof(DayPilotBubble) !== 'undefined' && $c.bubble && $c.eventHoverHandling !== 'Disabled') {
                if (!DayPilotMonth.movingEvent && !DayPilotMonth.resizingEvent) {
                    var $02 = this.$2k && $B.x === this.$2k.x && $B.y === this.$2k.y;
                    if (!$02) {
                        this.$2k = $B;
                        $c.bubble.showEvent(e.event);
                    }
                } else {
                    DayPilotBubble.hideActive();
                }
            }
        };
        this.$2f = function(ev) {
            var e = this;
            if (typeof(DayPilotBubble) !== 'undefined' && $c.bubble) {
                $c.bubble.hideOnMouseOut();
            };
            e.style.cursor = '';
            if ($c.cssOnly) {
                $c.$2j(e.event).each(function($s) {
                    DayPilot.Util.removeClass($s, $c.$1T("_event_hover"));
                });
            };
            DayPilot.Areas.hideAreas(e, ev);
        };
        this.$2c = function() {
            var e = this;
            $c.$2l(e.event);
            return false;
        };
        this.$2d = function(ev) {
            if ($R.start) {
                return;
            };
            var e = this;
            var ep = e.event;
            var $o = ep.part.row;
            var $p = ep.part.colStart;
            var $t = ep.part.line;
            var $q = ep.part.colWidth;
            ev = ev || window.event;
            var $03 = ev.which || ev.button;
            ev.cancelBubble = true;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            };
            if ($03 === 1) {
                if (typeof(DayPilotBubble) !== 'undefined' && $c.bubble) {
                    DayPilotBubble.hideActive();
                };
                DayPilotMonth.movingEvent = null;
                if (this.style.cursor === 'w-resize' || this.style.cursor === 'e-resize') {
                    var $04 = {};
                    $04.start = {};
                    $04.start.x = $p;
                    $04.start.y = $o;
                    $04.event = e.event;
                    $04.width = DayPilot.Date.daysSpan($04.event.start().d, $04.event.end().d) + 1;
                    $04.direction = this.style.cursor;
                    DayPilotMonth.resizingEvent = $04;
                } else if (this.style.cursor === 'move' || ep.client.moveEnabled()) {
                    $c.$28();
                    var $05 = DayPilot.mo2($c.nav.events, ev);
                    if (!$05) {
                        return;
                    };
                    var $r = $c.$2m($05.x, $05.y);
                    if (!$r) {
                        return;
                    };
                    var $D = DayPilot.Date.daysDiff(ep.start(), $c.rows[$o].start);
                    var $B = ($r.y * 7 + $r.x) - ($o * 7 + $p);
                    if ($D) {
                        $B += $D;
                    };
                    var $06 = {};
                    $06.start = {};
                    $06.start.x = $p;
                    $06.start.y = $o;
                    $06.start.line = $t;
                    $06.offset = $c.eventMoveToPosition ? 0 : $B;
                    $06.colWidth = $q;
                    $06.event = e.event;
                    $06.coords = $05;
                    DayPilotMonth.movingEvent = $06;
                }
            }
        };
        this.temp = {};
        this.temp.getPosition = function() {
            if (!$c.coords) {
                return null;
            };
            var $r = $c.$2m($c.coords.x, $c.coords.y);
            if (!$r) {
                return null;
            };
            var d = new DayPilot.Date($c.$29($r.x, $r.y));
            var $r = {};
            $r.start = d;
            $r.end = d.addDays(1);
            return $r;
        };
        this.$2n = {};
        var $R = $c.$2n;
        $R.active = false;
        $R.start = false;
        $R.timeouts = [];
        $R.onEventTouchStart = function(ev) {
            if ($R.active || $R.start) {
                return;
            };
            $R.clearTimeouts();
            $R.start = true;
            $R.active = false;
            var $s = this;
            var $07 = 500;
            $R.timeouts.push(window.setTimeout(function() {
                $R.active = true;
                $R.start = false;
                var $05 = $R.relativeCoords(ev);
                $R.startMoving($s, $05);
                ev.preventDefault();
            }, $07));
            ev.stopPropagation();
        };
        $R.onEventTouchMove = function(ev) {
            $R.clearTimeouts();
            $R.start = false;
        };
        $R.onEventTouchEnd = function(ev) {
            $R.clearTimeouts();
            if ($R.start) {
                $c.$2o(this, false);
            };
            window.setTimeout(function() {
                $R.start = false;
                $R.active = false;
            }, 500);
        };
        $R.onMainTouchStart = function(ev) {
            if ($R.active || $R.start) {
                return;
            };
            $R.clearTimeouts();
            $R.start = true;
            $R.active = false;
            var $07 = 500;
            $R.timeouts.push(window.setTimeout(function() {
                $R.active = true;
                $R.start = false;
                ev.preventDefault();
                var $05 = $R.relativeCoords(ev);
                $R.startRange($05);
            }, $07));
        };
        $R.onMainTouchMove = function(ev) {
            $R.clearTimeouts();
            $R.start = false;
            if ($R.active) {
                ev.preventDefault();
                var $05 = $R.relativeCoords(ev);
                if ($R.moving) {
                    $R.updateMoving($05);
                    return;
                };
                if ($R.range) {
                    $R.updateRange($05);
                }
            }
        };
        $R.onMainTouchEnd = function(ev) {
            $R.clearTimeouts();
            if ($R.active) {
                if ($R.moving) {
                    var $08 = $R.moving;
                    var e = $R.moving.event;
                    var $09 = $c.shadow.start;
                    var $0a = $c.shadow.position;
                    var $B = $R.moving.offset;
                    $c.$28();
                    $R.moving = null;
                    $c.$2p(e, $09.x, $09.y, $B, ev, $0a);
                };
                if ($R.range) {
                    var $0b = $R.range;
                    var $09 = new DayPilot.Date($c.$29($0b.from.x, $0b.from.y));
                    var end = $09.addDays($0b.width);
                    $R.range = null;
                    $c.$2q($09, end);
                }
            };
            window.setTimeout(function() {
                $R.start = false;
                $R.active = false;
            }, 500);
        };
        $R.clearTimeouts = function() {
            for (var i = 0; i < $R.timeouts.length; i++) {
                clearTimeout($R.timeouts[i]);
            };
            $R.timeouts = [];
        };
        $R.relativeCoords = function(ev) {
            var $L = $c.nav.events;
            var x = ev.touches[0].pageX;
            var y = ev.touches[0].pageY;
            var $05 = {
                x: x,
                y: y
            };
            var $0c = DayPilot.abs($L);
            var $05 = {
                x: x - $0c.x,
                y: y - $0c.y,
                toString: function() {
                    return "x: " + this.x + ", y:" + this.y;
                }
            };
            return $05;
        };
        $R.startMoving = function($s, $05) {
            $c.$28();
            ep = $s.event;
            var $r = $c.$2m($05.x, $05.y);
            if (!$r) {
                return;
            };
            var $D = DayPilot.Date.daysDiff(ep.start(), $c.rows[ep.part.row].start);
            var $B = ($r.y * 7 + $r.x) - (ep.part.row * 7 + ep.part.colStart);
            if ($D) {
                $B += $D;
            };
            var $06 = {};
            $06.start = {};
            $06.start.x = ep.part.colStart;
            $06.start.y = ep.part.row;
            $06.start.line = ep.part.line;
            $06.offset = $c.eventMoveToPosition ? 0 : $B;
            $06.colWidth = ep.part.colWidth;
            $06.event = ep;
            $06.coords = $05;
            $R.moving = $06;
            $R.updateMoving($05);
        };
        $R.updateMoving = function($05) {
            var $r = $c.$2m($05.x, $05.y);
            if (!$r) {
                return;
            };
            var $0d = $c.$2r($r);
            $c.$28();
            var event = $R.moving.event;
            var $B = $R.moving.offset;
            var $A = $c.cellMode ? 1 : DayPilot.Date.daysSpan(event.start().d, event.end().d) + 1;
            if ($A < 1) {
                $A = 1;
            };
            $c.$24($r.x, $r.y, $0d, $A, $B, event);
        };
        $R.startRange = function($05) {
            var $r = $c.$2m($05.x, $05.y);
            if (!$r) {
                return;
            };
            $c.$28();
            var $0e = {};
            $0e.start = {};
            $0e.start.x = $r.x;
            $0e.start.y = $r.y;
            $0e.x = $r.x;
            $0e.y = $r.y;
            $0e.width = 1;
            $R.range = $0e;
            $R.updateRange($05);
        };
        $R.updateRange = function($05) {
            var $r = $c.$2m($05.x, $05.y);
            if (!$r) {
                return;
            };
            $c.$28();
            var $09 = $R.range.start;
            var $0f = $09.y * 7 + $09.x;
            var $0g = $r.y * 7 + $r.x;
            var $A = Math.abs($0g - $0f) + 1;
            if ($A < 1) {
                $A = 1;
            };
            var $0h = $0f < $0g ? $09 : $r;
            $R.range.width = $A;
            $R.range.from = {
                x: $0h.x,
                y: $0h.y
            };
            $c.$24($0h.x, $0h.y, 0, $A, 0, null);
        };
        this.isWeekend = function($0i) {
            var $0j = 0;
            var $0k = 6;
            if ($0i.dayOfWeek() === $0j) {
                return true;
            };
            if ($0i.dayOfWeek() === $0k) {
                return true;
            };
            return false;
        };
        this.$2s = function() {
            var $0l = this.startDate.lastDayOfMonth();
            if (this.showWeekend) {
                return $0l;
            }
            while (this.isWeekend($0l)) {
                $0l = $0l.addDays(-1);
            };
            return $0l;
        };
        this.$1K = function() {
            if (typeof this.startDate === 'string') {
                this.startDate = DayPilot.Date.fromStringSortable(this.startDate);
            };
            if (this.viewType === 'Month') {
                this.startDate = this.startDate.firstDayOfMonth();
            } else {
                this.startDate = this.startDate.getDatePart();
            };
            this.firstDate = this.startDate.firstDayOfWeek($M.getWeekStart());
            if (!this.showWeekend) {
                var $0m = this.startDate.addMonths(-1).getMonth();
                var $0n = new DayPilot.Date(this.firstDate).addDays(6);
                while (this.isWeekend($0n)) {
                    $0n = $0n.addDays(-1);
                };
                if ($0n.getMonth() === $0m) {
                    this.firstDate = DayPilot.Date.addDays(this.firstDate, 7);
                }
            };
            var $0o = this.startDate;
            var $0p;
            if (this.viewType === 'Month') {
                var $0q = this.$2s().d;
                var $0r = DayPilot.Date.daysDiff(this.firstDate, $0q) + 1;
                $0p = Math.ceil($0r / 7);
            } else {
                $0p = this.weeks;
            };
            this.days = $0p * 7;
            this.rows = [];
            for (var x = 0; x < $0p; x++) {
                var r = {};
                r.start = DayPilot.Date.addDays(this.firstDate, x * 7);
                r.end = DayPilot.Date.addDays(r.start, this.$1Y());
                r.events = [];
                r.lines = [];
                r.index = x;
                r.minHeight = this.cellHeight;
                r.calendar = this;
                r.belongsHere = function(ev) {
                    if (ev.end.getTime() === ev.start.getTime() && ev.start.getTime() === this.start.getTime()) {
                        return true;
                    };
                    return !(ev.end.getTime() <= this.start.getTime() || ev.start.getTime() >= this.end.getTime());
                };
                r.getPartStart = function(ep) {
                    return DayPilot.Date.max(this.start, ep.start());
                };
                r.getPartEnd = function(ep) {
                    return DayPilot.Date.min(this.end, ep.end());
                };
                r.getStartColumn = function(ep) {
                    var $0s = this.getPartStart(ep);
                    return DayPilot.Date.daysDiff(this.start, $0s);
                };
                r.getWidth = function(ep) {
                    return DayPilot.Date.daysSpan(this.getPartStart(ep), this.getPartEnd(ep)) + 1;
                };
                r.putIntoLine = function(ep, $p, $q, $o) {
                    var $0t = this;
                    for (var i = 0; i < this.lines.length; i++) {
                        var $t = this.lines[i];
                        if ($t.isFree($p, $q)) {
                            $t.addEvent(ep, $p, $q, $o, i);
                            return i;
                        }
                    };
                    var $t = [];
                    $t.isFree = function($p, $q) {
                        var $0u = true;
                        for (var i = 0; i < this.length; i++) {
                            var ep = this[i];
                            if (!($p + $q - 1 < ep.part.colStart || $p > ep.part.colStart + ep.part.colWidth - 1)) {
                                $0u = false;
                            }
                        };
                        return $0u;
                    };
                    $t.addEvent = function(ep, $p, $q, $o, $0v) {
                        ep.part.colStart = $p;
                        ep.part.colWidth = $q;
                        ep.part.row = $o;
                        ep.part.line = $0v;
                        ep.part.startsHere = $0t.start.getTime() <= ep.start().getTime();
                        ep.part.endsHere = $0t.end.getTime() >= ep.end().getTime();
                        this.push(ep);
                    };
                    $t.addEvent(ep, $p, $q, $o, this.lines.length);
                    this.lines.push($t);
                    return this.lines.length - 1;
                };
                r.getStart = function() {
                    var $09 = 0;
                    for (var i = 0; i < $c.rows.length && i < this.index; i++) {
                        $09 += $c.rows[i].getHeight();
                    }
                };
                r.getHeight = function() {
                    return Math.max(this.lines.length * $M.lineHeight() + $c.cellHeaderHeight + $c.cellMarginBottom, this.calendar.cellHeight);
                };
                this.rows.push(r);
            };
            this.endDate = DayPilot.Date.addDays(this.firstDate, $0p * 7);
        };
        this.$2t = function() {
            switch (this.heightSpec) {
                case "Auto":
                    var $I = this.headerHeight;
                    for (var i = 0; i < this.rows.length; i++) {
                        $I += this.rows[i].getHeight();
                    };
                    return $I;
                case "Fixed":
                    return this.height;
            }
        };
        this.$2u = function($09, end) {
            var $0w = (end.y * 7 + end.x) - ($09.y * 7 + $09.x);
            return $0w + 1;
        };
        this.$2v = function() {
            var $0x = this.nav.top;
            this.nav.top.dp = this;
            $0x.setAttribute("unselectable", "on");
            $0x.style.MozUserSelect = 'none';
            $0x.style.KhtmlUserSelect = 'none';
            $0x.style.WebkitUserSelect = 'none';
            $0x.style.position = 'relative';
            if (this.width) {
                $0x.style.width = this.width;
            };
            $0x.onselectstart = function(e) {
                return false;
            };
            if (this.cssOnly) {
                $0x.className = this.$1T("_main");
            } else {
                $0x.style.border = "1px solid " + this.borderColor;
            };
            if (this.hideUntilInit) {
                $0x.style.visibility = 'hidden';
            };
            $0x.onmousemove = this.$2w;
            $0x.ontouchstart = $R.onMainTouchStart;
            $0x.ontouchmove = $R.onMainTouchMove;
            $0x.ontouchend = $R.onMainTouchEnd;
            this.vsph = document.createElement("div");
            this.vsph.style.display = 'none';
            this.nav.top.appendChild(this.vsph);
            var $0y = document.createElement("div");
            $0y.style.position = "relative";
            $0y.style.height = this.headerHeight + "px";
            $0y.oncontextmenu = function() {
                return false;
            };
            this.nav.top.appendChild($0y);
            this.nav.header = $0y;
            var $0z = document.createElement("div");
            $0z.style.position = "relative";
            $0z.style.zoom = "1";
            if (this.heightSpec === "Parent100Pct" || this.heightSpec === 'Fixed') {
                $0z.style.overflow = "auto";
            };
            var $0A = document.createElement("div");
            $0A.style.position = "relative";
            $0z.appendChild($0A);
            this.nav.top.appendChild($0z);
            this.nav.scrollable = $0z;
            this.nav.events = $0A;
        };
        this.$2w = function(ev) {
            $c.coords = DayPilot.mo2($c.nav.events, ev);
            var $05 = $c.coords;
            if (!$05) {
                return;
            };
            var $r = $c.$2m($05.x, $05.y);
            if (!$r) {
                return;
            };
            if (DayPilotMonth.resizingEvent) {
                $c.$28();
                var $04 = DayPilotMonth.resizingEvent;
                var $0B = $04.start;
                var $A, $09;
                if ($04.direction === 'w-resize') {
                    $09 = $r;
                    var $0C = $04.event.end().d;
                    if (DayPilot.Date.getDate($0C).getTime() === $0C.getTime()) {
                        $0C = DayPilot.Date.addDays($0C, -1);
                    };
                    var end = $c.$2x($0C);
                    $A = $c.$2u($r, end);
                } else {
                    $09 = $c.$2x($04.event.start().d);
                    $A = $c.$2u($09, $r);
                };
                if ($A < 1) {
                    $A = 1;
                };
                $c.$24($09.x, $09.y, 0, $A);
            } else if (DayPilotMonth.movingEvent) {
                if ($05.x === DayPilotMonth.movingEvent.coords.x && $05.y === DayPilotMonth.movingEvent.coords.y) {
                    return;
                };
                var $0d = $c.$2r($r);
                $c.$28();
                var event = DayPilotMonth.movingEvent.event;
                var $B = DayPilotMonth.movingEvent.offset;
                var $A = $c.cellMode ? 1 : DayPilot.Date.daysSpan(event.start().d, event.end().d) + 1;
                if ($A < 1) {
                    $A = 1;
                };
                $c.$24($r.x, $r.y, $0d, $A, $B, event);
            } else if (DayPilotMonth.timeRangeSelecting) {
                DayPilotMonth.cancelCellClick = true;
                $c.$28();
                var $09 = DayPilotMonth.timeRangeSelecting;
                var $0f = $09.y * 7 + $09.x;
                var $0g = $r.y * 7 + $r.x;
                var $A = Math.abs($0g - $0f) + 1;
                if ($A < 1) {
                    $A = 1;
                };
                var $0h = $0f < $0g ? $09 : $r;
                DayPilotMonth.timeRangeSelecting.from = {
                    x: $0h.x,
                    y: $0h.y
                };
                DayPilotMonth.timeRangeSelecting.width = $A;
                DayPilotMonth.timeRangeSelecting.moved = true;
                $c.$24($0h.x, $0h.y, 0, $A, 0, null);
            }
        };
        this.$2r = function($r) {
            var y = $r.relativeY;
            var $o = $c.rows[$r.y];
            var top = $c.cellHeaderHeight;
            var lh = $M.lineHeight();
            var $0D = $o.lines.length;
            for (var i = 0; i < $o.lines.length; i++) {
                var $t = $o.lines[i];
                if ($t.isFree($r.x, 1)) {
                    $0D = i;
                    break;
                }
            };
            var $0E = Math.floor((y - top + lh / 2) / lh);
            var $0E = Math.min($0D, $0E);
            var $0E = Math.max(0, $0E);
            return $0E;
        };
        this.message = function($0F, $0G, $0H, $0I) {
            if ($0F === null) {
                return;
            };
            var $0G = $0G || this.messageHideAfter || 2000;
            var $0H = $0H || "#ffffff";
            var $0I = $0I || "#000000";
            var $0J = 0.8;
            var top = this.headerHeight;
            var $Q = 1;
            var $0K = 0;
            var $s;
            if (!this.nav.message) {
                $s = document.createElement("div");
                $s.setAttribute("unselectable", "on");
                $s.style.position = "absolute";
                $s.style.right = "0px";
                $s.style.left = "0px";
                $s.style.top = top + "px";
                $s.style.opacity = $0J;
                $s.style.filter = "alpha(opacity=" + ($0J * 100) + ")";
                $s.style.display = 'none';
                $s.onmousemove = function() {
                    if ($c.messageTimeout) {
                        clearTimeout($c.messageTimeout);
                    }
                };
                $s.onmouseout = function() {
                    if ($c.nav.message.style.display !== 'none') {
                        $c.messageTimeout = setTimeout($c.$2y, 500);
                    }
                };
                if (!this.cssOnly) {
                    $s.style.textAlign = "left";
                };
                var $S = document.createElement("div");
                $S.setAttribute("unselectable", "on");
                $S.onclick = function() {
                    $c.nav.message.style.display = 'none';
                };
                if (!this.cssOnly) {
                    $S.style.padding = "5px";
                } else {
                    $S.className = this.$1T("_message");
                };
                $s.appendChild($S);
                var close = document.createElement("div");
                close.setAttribute("unselectable", "on");
                close.style.position = "absolute";
                if (!this.cssOnly) {
                    close.style.top = "5px";
                    close.style.right = (DayPilot.sw($c.nav.scroll) + 5) + "px";
                    close.style.color = $0H;
                    close.style.lineHeight = "100%";
                    close.style.cursor = "pointer";
                    close.style.fontWeight = "bold";
                    close.innerHTML = "X";
                } else {
                    close.className = this.$1T("_message_close");
                };
                close.onclick = function() {
                    $c.nav.message.style.display = 'none';
                };
                $s.appendChild(close);
                this.nav.top.appendChild($s);
                this.nav.message = $s;
            };
            var $0L = function() {
                $c.nav.message.style.opacity = $0J;
                var $S = $c.nav.message.firstChild;
                if (!$c.cssOnly) {
                    $S.style.backgroundColor = $0I;
                    $S.style.color = $0H;
                };
                $S.innerHTML = $0F;
                var end = function() {
                    $c.messageTimeout = setTimeout($c.$2y, $0G);
                };
                DayPilot.fade($c.nav.message, 0.2, end);
            };
            clearTimeout($c.messageTimeout);
            if (this.nav.message.style.display !== 'none') {
                DayPilot.fade($c.nav.message, -0.2, $0L);
            } else {
                $0L();
            }
        };
        this.message.show = function($0F) {
            $c.message($0F);
        };
        this.message.hide = function() {
            $c.$2y();
        };
        this.$2y = function() {
            var end = function() {
                $c.nav.message.style.display = 'none';
            };
            DayPilot.fade($c.nav.message, -0.2, end);
        };
        this.$2z = function(ev) {
            if ($c.heightSpec === "Parent100Pct") {
                $c.$1O();
            }
        };
        this.$1O = function() {
            if (this.heightSpec === 'Parent100Pct') {
                this.nav.top.style.height = "100%";
                var $I = this.nav.top.clientHeight;
                this.nav.scrollable.style.height = ($I - this.headerHeight) + "px";
            } else {
                this.nav.top.style.height = this.$2t() + 'px';
            };
            for (var x = 0; x < this.cells.length; x++) {
                for (var y = 0; y < this.cells[x].length; y++) {
                    this.cells[x][y].style.top = this.$25(y) + 'px';
                    this.cells[x][y].style.height = this.rows[y].getHeight() + 'px';
                }
            };
            this.$2A();
        };
        this.$2m = function(x, y) {
            var $0M = Math.floor(this.nav.top.clientWidth / this.$1Y());
            var $0N = Math.min(Math.floor(x / $0M), this.$1Y() - 1);
            var $o = null;
            var $I = this.headerHeight;
            var $0O = 0;
            if (y < $I) {
                return null;
            };
            for (var i = 0; i < this.rows.length; i++) {
                var $0P = $I;
                $I += this.rows[i].getHeight();
                if (y < $I) {
                    $0O = y - $0P;
                    $o = i;
                    break;
                }
            };
            if ($o === null) {
                $o = this.rows.length - 1;
            };
            var $r = {};
            $r.x = $0N;
            $r.y = $o;
            $r.relativeY = $0O;
            return $r;
        };
        this.$2x = function($0i) {
            var $A = DayPilot.Date.daysDiff(this.firstDate, $0i);
            var $r = {
                x: 0,
                y: 0
            };
            while ($A >= 7) {
                $r.y++;
                $A -= 7;
            };
            $r.x = $A;
            return $r;
        };
        this.$2A = function() {
            var $A = DayPilot.sw(this.nav.scrollable);
            this.nav.header.style.marginRight = $A + "px";
        };
        this.$1N = function() {
            var $0y = this.nav.header;
            var $0A = this.nav.events;
            this.cells = [];
            for (var x = 0; x < this.$1Y(); x++) {
                this.cells[x] = [];
                var $0Q = this.headerProperties ? this.headerProperties[x] : null;
                var $0R = x + $M.getWeekStart();
                if ($0R > 6) {
                    $0R -= 7;
                };
                if (!$0Q) {
                    var $0Q = {};
                    $0Q.html = $M.locale().dayNames[$0R];
                    if (!this.cssOnly) {
                        $0Q.backColor = this.headerBackColor;
                    }
                };
                if (typeof $c.onBeforeHeaderRender === 'function') {
                    var $m = {};
                    $m.header = {};
                    $m.header.dayOfWeek = $0R;
                    DayPilot.Util.copyProps($0Q, $m.header, ['html', 'backColor']);
                    $c.onBeforeHeaderRender($m);
                    DayPilot.Util.copyProps($m.header, $0Q, ['html', 'backColor']);
                };
                var $0S = document.createElement("div");
                $0S.setAttribute("unselectable", "on");
                $0S.style.position = 'absolute';
                $0S.style.left = (this.$27() * x) + '%';
                $0S.style.width = (this.$27()) + '%';
                $0S.style.top = '0px';
                $0S.style.height = (this.headerHeight) + 'px';
                (function(x) {
                    $0S.onclick = function() {
                        $c.$2B(x);
                    };
                })($0R);
                var $S = document.createElement("div");
                $S.setAttribute("unselectable", "on");
                $S.className = this.$1T("_header_inner");
                $S.innerHTML = $0Q.html;
                $0S.appendChild($S);
                if (!this.cssOnly) {
                    $S.style.position = "absolute";
                    $S.style.top = "0px";
                    $S.style.bottom = "0px";
                    $S.style.left = "0px";
                    $S.style.right = "0px";
                    $S.style.backgroundColor = $0Q.backColor;
                    $S.style.fontFamily = this.headerFontFamily;
                    $S.style.fontSize = this.headerFontSize;
                    $S.style.color = this.headerFontColor;
                    $S.style.textAlign = 'center';
                    $S.style.cursor = 'default';
                    $S.className = this.$1T("header");
                    if (x !== this.$1Y() - 1) {
                        $S.style.borderRight = '1px solid ' + this.borderColor;
                    }
                } else {
                    $0S.className = this.$1T("_header");
                    if ($0Q && $0Q.backColor) {
                        $S.style.background = $0Q.backColor;
                    }
                };
                $0y.appendChild($0S);
                for (var y = 0; y < this.rows.length; y++) {
                    this.$2C(x, y, $0A);
                }
            };
            var $s = document.createElement("div");
            $s.style.position = 'absolute';
            $s.style.padding = '2px';
            $s.style.top = '0px';
            $s.style.left = '0px';
            $s.style.backgroundColor = "#FF6600";
            $s.style.color = "white";
            $s.innerHTML = "\u0044\u0045\u004D\u004F";
            if (this.numberFormat) this.nav.top.appendChild($s);
        };
        this.$1M = function() {
            for (var x = 0; x < this.cells.length; x++) {
                for (var y = 0; y < this.cells[x].length; y++) {
                    this.cells[x][y].onclick = null;
                }
            };
            this.nav.header.innerHTML = '';
            this.nav.scrollable.innerHTML = '';
        };
        this.$2C = function(x, y, $0y) {
            var $o = this.rows[y];
            var d = DayPilot.Date.addDays(this.firstDate, y * 7 + x);
            var $0T = this.cellProperties ? this.cellProperties[y * this.$1Y() + x] : null;
            var $0U = null;
            if ($0T) {
                $0U = $0T["headerHtml"];
            } else {
                var $0i = d.getUTCDate();
                if ($0i === 1) {
                    $0U = $M.locale().monthNames[d.getUTCMonth()] + ' ' + $0i;
                } else {
                    $0U = $0i + "";
                }
            };
            if (typeof $c.onBeforeCellRender === 'function') {
                if (!$0T) {
                    var $0T = {};
                };
                var $m = {};
                $m.cell = {};
                $m.cell.areas = null;
                $m.cell.backColor = null;
                $m.cell.backImage = null;
                $m.cell.backRepeat = null;
                $m.cell.business = false;
                $m.cell.headerHtml = $0U;
                $m.cell.headerBackColor = null;
                $m.cell.cssClass = null;
                $m.cell.html = null;
                $m.cell.start = new DayPilot.Date(d);
                $m.cell.end = $m.cell.start.addDays(1);
                DayPilot.Util.copyProps($0T, $m.cell);
                $c.onBeforeCellRender($m);
                DayPilot.Util.copyProps($m.cell, $0T, ['areas', 'backColor', 'backImage', 'backRepeat', 'business', 'headerHtml', 'headerBackColor', 'cssClass', 'html']);
            };
            var $r = document.createElement("div");
            $r.setAttribute("unselectable", "on");
            $r.style.position = 'absolute';
            $r.style.cursor = 'default';
            $r.style.left = (this.$27() * x) + '%';
            $r.style.width = (this.$27()) + '%';
            $r.style.top = (this.$25(y)) + 'px';
            $r.style.height = ($o.getHeight()) + 'px';
            $r.d = d;
            $r.x = x;
            $r.y = y;
            $r.properties = $0T;
            var $0m = this.startDate.addMonths(-1).getMonth();
            var $0V = this.startDate.addMonths(1).getMonth();
            var $0W = this.startDate.getMonth();
            var $S = document.createElement("div");
            $S.setAttribute("unselectable", "on");
            $r.appendChild($S);
            if (this.cssOnly) {
                $S.className = this.$1T("_cell_inner");
            };
            if (!this.cssOnly) {
                $S.style.position = "absolute";
                $S.style.left = "0px";
                $S.style.right = "0px";
                $S.style.top = "0px";
                $S.style.bottom = "0px";
                if (d.getUTCMonth() === $0W) {
                    $r.className = this.$1T("cell");
                } else if (d.getUTCMonth() === $0m) {
                    $r.className = this.$1T("cell") + " " + this.$1T("previous");
                } else if (d.getUTCMonth() === $0V) {
                    $r.className = this.$1T("cell") + " " + this.$1T("next");
                };
                if ($0T) {
                    $S.style.background = $0T["backColor"];
                    $S.className += " " + this.$1T($0T["cssClass"]);
                    if ($0T["backImage"]) {
                        $S.style.backgroundImage = "url('" + $0T["backImage"] + "')";
                    };
                    if ($0T["backRepeat"]) {
                        $S.style.backgroundRepeat = $0T["backRepeat"];
                    }
                } else {
                    $S.style.background = this.$2D(d);
                };
                if (x !== this.$1Y() - 1) {
                    $S.style.borderRight = '1px solid ' + this.innerBorderColor;
                };
                if (y === 0) {
                    $S.style.borderTop = '1px solid ' + this.borderColor;
                };
                $S.style.borderBottom = '1px solid ' + this.innerBorderColor;
            } else {
                $S.className = this.$1T("_cell_inner");
                if (d.getUTCMonth() === $0W) {
                    $r.className = this.$1T("_cell");
                } else if (d.getUTCMonth() === $0m) {
                    $r.className = this.$1T("_cell") + " " + this.$1T("_previous");
                } else if (d.getUTCMonth() === $0V) {
                    $r.className = this.$1T("_cell") + " " + this.$1T("_next");
                } else {
                    $a();
                };
                if ($0T) {
                    if ($0T["cssClass"]) {
                        DayPilot.Util.addClass($r, $0T.cssClass);
                    };
                    if ($0T["business"]) {
                        DayPilot.Util.addClass($r, this.$1T("_cell_business"));
                    };
                    if ($0T["backColor"]) {
                        $S.style.backgroundColor = $0T["backColor"];
                    };
                    if ($0T["backImage"]) {
                        $S.style.backgroundImage = "url('" + $0T["backImage"] + "')";
                    };
                    if ($0T["backRepeat"]) {
                        $S.style.backgroundRepeat = $0T["backRepeat"];
                    }
                }
            };
            $r.onmousedown = this.$2E;
            $r.onmousemove = this.$2F;
            $r.onmouseout = this.$2G;
            $r.oncontextmenu = this.$2H;
            $r.onclick = this.$2I;
            $r.ondblclick = this.$2J;
            var $0X = document.createElement("div");
            $0X.setAttribute("unselectable", "on");
            $0X.style.height = this.cellHeaderHeight + "px";
            if (!this.cssOnly) {
                if ($0T && $0T["headerBackColor"]) {
                    $0X.style.backgroundColor = $0T["headerBackColor"];
                } else if (this.cellHeaderBackColor) {
                    $0X.style.backgroundColor = this.cellHeaderBackColor;
                };
                $0X.style.paddingRight = '2px';
                $0X.style.textAlign = "right";
                $0X.style.fontFamily = this.cellHeaderFontFamily;
                $0X.style.fontSize = this.cellHeaderFontSize;
                $0X.style.color = this.cellHeaderFontColor;
                $0X.className = this.$1T("cellheader");
            } else {
                if ($0T && $0T["headerBackColor"]) {
                    $0X.style.background = $0T["headerBackColor"];
                };
                $0X.className = this.$1T("_cell_header");
            };
            $0X.innerHTML = $0U;
            $S.appendChild($0X);
            if ($0T && $0T["html"]) {
                var $0F = document.createElement("div");
                $0F.setAttribute("unselectable", "on");
                $0F.style.height = ($o.getHeight() - this.cellHeaderHeight) + 'px';
                $0F.style.overflow = 'hidden';
                $0F.innerHTML = $0T["html"];
                $S.appendChild($0F);
            };
            if (this.cellMode) {
                var $0Y = document.createElement("div");
                $0Y.setAttribute("unselectable", "on");
                $0Y.style.height = (this.cellHeight - this.cellHeaderHeight) + "px";
                $0Y.style.overflow = 'auto';
                $0Y.style.position = 'relative';
                var $K = document.createElement('div');
                $K.setAttribute("unselectable", "on");
                $K.style.paddingTop = "1px";
                $K.style.paddingBottom = "1px";
                $0Y.appendChild($K);
                $S.appendChild($0Y);
                $r.body = $K;
                $r.scrolling = $0Y;
            };
            if ($r.properties) {
                var $Z = $r.properties.areas || [];
                for (var i = 0; i < $Z.length; i++) {
                    var $00 = $Z[i];
                    if ($00.v !== 'Visible') {
                        continue;
                    };
                    var a = DayPilot.Areas.createArea($r, $r.properties, $00);
                    $r.appendChild(a);
                }
            };
            this.cells[x][y] = $r;
            $0y.appendChild($r);
        };
        this.$2F = function() {
            var c = this;
            if (c.properties) {
                DayPilot.Areas.showAreas(c, c.properties);
            }
        };
        this.$2G = function(ev) {
            var c = this;
            if (c.properties) {
                DayPilot.Areas.hideAreas(c, ev);
            }
        };
        this.$2H = function() {
            var d = this.d;
            var go = function(d) {
                var $09 = new DayPilot.Date(d);
                var end = $09.addDays(1);
                var $0Z = new DayPilot.Selection($09, end, null, $c);
                if ($c.contextMenuSelection) {
                    $c.contextMenuSelection.show($0Z);
                }
            };
            go(d);
        };
        this.$2J = function() {
            var d = this.d;
            if ($c.timeouts) {
                for (var $10 in $c.timeouts) {
                    window.clearTimeout($c.timeouts[$10]);
                };
                $c.timeouts = null;
            };
            if ($c.timeRangeDoubleClickHandling !== 'Disabled') {
                var $09 = new DayPilot.Date(d);
                var end = $09.addDays(1);
                $c.$2K($09, end);
            }
        };
        this.$2I = function() {
            if (DayPilotMonth.cancelCellClick) {
                return;
            };
            var d = this.d;
            var $11 = function(d) {
                var $09 = new DayPilot.Date(d);
                var end = $09.addDays(1);
                $c.$2q($09, end);
            };
            if ($c.timeRangeSelectedHandling !== 'Disabled' && $c.timeRangeDoubleClickHandling === 'Disabled') {
                $11(d);
                return;
            };
            if (!$c.timeouts) {
                $c.timeouts = [];
            };
            var $12 = function(d) {
                return function() {
                    $11(d);
                };
            };
            $c.timeouts.push(window.setTimeout($12(d), 300));
        };
        this.$2E = function(e) {
            var $r = this;
            var x = $r.x;
            var y = $r.y;
            DayPilotMonth.cancelCellClick = false;
            if ($r.scrolling) {
                var $B = DayPilot.mo3($r.scrolling, e);
                var sw = DayPilot.sw($r.scrolling);
                var $A = $r.scrolling.offsetWidth;
                if ($B.x > $A - sw) {
                    return;
                }
            };
            if ($c.timeRangeSelectedHandling !== 'Disabled') {
                $c.$28();
                DayPilotMonth.timeRangeSelecting = {
                    "root": $c,
                    "x": x,
                    "y": y,
                    "from": {
                        x: x,
                        y: y
                    },
                    "width": 1
                };
            }
        };
        this.$1Y = function() {
            if (this.showWeekend) {
                return 7;
            } else {
                return 5;
            }
        };
        this.$27 = function() {
            if (this.showWeekend) {
                return 14.285;
            } else {
                return 20;
            }
        };
        this.$2D = function(d) {
            if (d.getUTCDay() === 6 || d.getUTCDay() === 0) {
                return this.nonBusinessBackColor;
            };
            return this.backColor;
        };
        this.$25 = function($0v) {
            var top = 0;
            for (var i = 0; i < $0v; i++) {
                top += this.rows[i].getHeight();
            };
            return top;
        };
        this.clearSelection = function() {
            this.$28();
        };
        this.$2L = function($13, $i, $14) {
            var $15 = {};
            $15.action = $13;
            $15.parameters = $14;
            $15.data = $i;
            $15.header = this.$2M();
            var $16 = "JSON" + DayPilot.JSON.stringify($15);
            __doPostBack($c.uniqueID, $16);
        };
        this.$2N = function($13, $14, $i, $17) {
            if (typeof $17 === 'undefined') {
                $17 = "CallBack";
            };
            var $15 = {};
            $15.action = $13;
            $15.type = $17;
            $15.parameters = $14;
            $15.data = $i;
            $15.header = this.$2M();
            var $16 = "JSON" + DayPilot.JSON.stringify($15);
            if (this.backendUrl) {
                DayPilot.request(this.backendUrl, this.$2O, $16, this.$2P);
            } else if (typeof WebForm_DoCallback === 'function') {
                WebForm_DoCallback(this.uniqueID, $16, this.$1G, null, this.callbackError, true);
            }
        };
        this.$2P = function($18) {
            if (typeof $c.onAjaxError === 'function') {
                var $m = {};
                $m.request = $18;
                $c.onAjaxError($m);
            } else if (typeof $c.ajaxError === 'function') {
                $c.ajaxError($18);
            }
        };
        this.$2O = function($19) {
            $c.$1G($19.responseText);
        };
        this.$2M = function() {
            var h = {};
            h.v = this.v;
            h.control = "dpm";
            h.id = this.id;
            h.visibleStart = new DayPilot.Date(this.firstDate);
            h.visibleEnd = h.visibleStart.addDays(this.days);
            h.clientState = this.clientState;
            h.cssOnly = $c.cssOnly;
            h.cssClassPrefix = $c.cssClassPrefix;
            h.startDate = $c.startDate;
            h.showWeekend = this.showWeekend;
            h.headerBackColor = this.headerBackColor;
            h.backColor = this.backColor;
            h.nonBusinessBackColor = this.nonBusinessBackColor;
            h.locale = this.locale;
            h.timeFormat = this.timeFormat;
            h.weekStarts = this.weekStarts;
            h.viewType = this.viewType;
            h.weeks = this.weeks;
            h.selected = $c.multiselect.events();
            h.hashes = $c.hashes;
            return h;
        };
        this.$2Q = function($17, $13, $1a, $i) {
            if ($17 === 'PostBack') {
                $c.postBack2($13, $1a, $i);
            } else if ($17 === 'CallBack') {
                $c.$2N($13, $1a, $i, "CallBack");
            } else if ($17 === 'Immediate') {
                $c.$2N($13, $1a, $i, "Notify");
            } else if ($17 === 'Queue') {
                $c.queue.add(new DayPilot.Action(this, $13, $1a, $i));
            } else if ($17 === 'Notify') {
                if ($M.notifyType() === 'Notify') {
                    $c.$2N($13, $1a, $i, "Notify");
                } else {
                    $c.queue.add(new DayPilot.Action($c, $13, $1a, $i));
                }
            } else {
                throw "Invalid event invocation type";
            }
        };
        this.$2R = function($m, $g) {
            var $f = $c.$2S($g);
            var $1a = {};
            $1a.args = $m;
            $1a.guid = $f;
            $c.$2N("Bubble", $1a);
        };
        this.$2S = function($g) {
            var $f = DayPilot.guid();
            if (!this.bubbles) {
                this.bubbles = [];
            };
            this.bubbles[$f] = $g;
            return $f;
        };
        this.eventClickPostBack = function(e, $i) {
            this.$2L("EventClick", $i, e);
        };
        this.eventClickCallBack = function(e, $i) {
            this.$2N('EventClick', e, $i);
        };
        this.$2h = function($s, e) {
            DayPilotMonth.movingEvent = null;
            DayPilotMonth.resizingEvent = null;
            var e = e || window.event;
            var $1b = e.ctrlKey;
            e.cancelBubble = true;
            if (e.stopPropagation) {
                e.stopPropagation();
            };
            if (typeof(DayPilotBubble) !== 'undefined') {
                DayPilotBubble.hideActive();
            };
            if ($c.eventDoubleClickHandling === 'Disabled') {
                $c.$2o($s, $1b);
                return;
            };
            if (!$c.timeouts) {
                $c.timeouts = [];
            } else {
                for (var $10 in $c.timeouts) {
                    window.clearTimeout($c.timeouts[$10]);
                };
                $c.timeouts = [];
            };
            var $1c = function($s, $1b) {
                return function() {
                    $c.$2o($s, $1b);
                };
            };
            $c.timeouts.push(window.setTimeout($1c($s, $1b), 300));
        };
        this.$2o = function($s, $1b) {
            var e = $s.event;
            if (!e.client.clickEnabled()) {
                return;
            };
            if ($c.$1S()) {
                var $m = {};
                $m.e = e;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventClick === 'function') {
                    $c.onEventClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventClickHandling) {
                    case 'PostBack':
                        $c.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        $c.eventClickCallBack(e);
                        break;
                    case 'Select':
                        $c.$2T($s, e, $1b);
                        break;
                    case 'ContextMenu':
                        var $1d = e.client.contextMenu();
                        if ($1d) {
                            $1d.show(e);
                        } else {
                            if ($c.contextMenu) {
                                $c.contextMenu.show(e);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($c.bubble) {
                            $c.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $c.onEventClicked === 'function') {
                    $c.onEventClicked($m);
                }
            } else {
                switch ($c.eventClickHandling) {
                    case 'PostBack':
                        $c.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        $c.eventClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $c.onEventClick(e);
                        break;
                    case 'Select':
                        $c.$2T($s, e, $1b);
                        break;
                    case 'ContextMenu':
                        var $1d = e.client.contextMenu();
                        if ($1d) {
                            $1d.show(e);
                        } else {
                            if ($c.contextMenu) {
                                $c.contextMenu.show(e);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($c.bubble) {
                            $c.bubble.showEvent(e);
                        };
                        break;
                }
            }
        };
        this.eventDoubleClickPostBack = function(e, $i) {
            this.$2L('EventDoubleClick', $i, e);
        };
        this.eventDoubleClickCallBack = function(e, $i) {
            this.$2N('EventDoubleClick', e, $i);
        };
        this.$2i = function($s, ev) {
            if (typeof(DayPilotBubble) !== 'undefined') {
                DayPilotBubble.hideActive();
            };
            if ($c.timeouts) {
                for (var $10 in $c.timeouts) {
                    window.clearTimeout($c.timeouts[$10]);
                };
                $c.timeouts = null;
            };
            var ev = ev || window.event;
            var e = $s.event;
            if ($c.$1S()) {
                var $m = {};
                $m.e = e;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventDoubleClick === 'function') {
                    $c.onEventDoubleClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventDoubleClickHandling) {
                    case 'PostBack':
                        $c.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        $c.eventDoubleClickCallBack(e);
                        break;
                    case 'Select':
                        $c.$2T($s, e, ev.ctrlKey);
                        break;
                    case 'Bubble':
                        if ($c.bubble) {
                            $c.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $c.onEventDoubleClicked === 'function') {
                    $c.onEventDoubleClicked($m);
                }
            } else {
                switch ($c.eventDoubleClickHandling) {
                    case 'PostBack':
                        $c.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        $c.eventDoubleClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $c.onEventDoubleClick(e);
                        break;
                    case 'Select':
                        $c.$2T($s, e, ev.ctrlKey);
                        break;
                    case 'Bubble':
                        if ($c.bubble) {
                            $c.bubble.showEvent(e);
                        };
                        break;
                }
            }
        };
        this.$2T = function($s, e, $1b) {
            $c.$2U($s, e, $1b);
        };
        this.eventSelectPostBack = function(e, $1e, $i) {
            var $1a = {};
            $1a.e = e;
            $1a.change = $1e;
            this.$2L('EventSelect', $i, $1a);
        };
        this.eventSelectCallBack = function(e, $1e, $i) {
            var $1a = {};
            $1a.e = e;
            $1a.change = $1e;
            this.$2N('EventSelect', $1a, $i);
        };
        this.$2U = function($s, e, $1b) {
            if ($c.$1S()) {
                var m = $c.multiselect;
                m.previous = m.events();
                var $m = {};
                $m.e = e;
                $m.selected = m.isSelected(e);
                $m.ctrl = $1b;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventSelect === 'function') {
                    $c.onEventSelect($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventSelectHandling) {
                    case 'PostBack':
                        $c.eventSelectPostBack(e, $1e);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            __theFormPostData = "";
                            __theFormPostCollection = [];
                            WebForm_InitCallback();
                        };
                        $c.eventSelectCallBack(e, $1e);
                        break;
                    case 'Update':
                        m.$2V($s, $1b);
                        break;
                };
                if (typeof $c.onEventSelected === 'function') {
                    $m.change = m.isSelected(e) ? "selected" : "deselected";
                    $m.selected = m.isSelected(e);
                    $c.onEventSelected($m);
                }
            } else {
                var m = $c.multiselect;
                m.previous = m.events();
                m.$2V($s, $1b);
                var $1e = m.isSelected(e) ? "selected" : "deselected";
                switch ($c.eventSelectHandling) {
                    case 'PostBack':
                        $c.eventSelectPostBack(e, $1e);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            __theFormPostData = "";
                            __theFormPostCollection = [];
                            WebForm_InitCallback();
                        };
                        $c.eventSelectCallBack(e, $1e);
                        break;
                    case 'JavaScript':
                        $c.onEventSelect(e, $1e);
                        break;
                }
            }
        };
        this.eventRightClickPostBack = function(e, $i) {
            this.$2L("EventRightClick", $i, e);
        };
        this.eventRightClickCallBack = function(e, $i) {
            this.$2N('EventRightClick', e, $i);
        };
        this.$2l = function(e) {
            this.event = e;
            if (!e.client.rightClickEnabled()) {
                return false;
            };
            if ($c.$1S()) {
                var $m = {};
                $m.e = e;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventRightClick === 'function') {
                    $c.onEventRightClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventRightClickHandling) {
                    case 'PostBack':
                        $c.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        $c.eventRightClickCallBack(e);
                        break;
                    case 'ContextMenu':
                        var $1d = e.client.contextMenu();
                        if ($1d) {
                            $1d.show(e);
                        } else {
                            if ($c.contextMenu) {
                                $c.contextMenu.show(this.event);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($c.bubble) {
                            $c.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $c.onEventRightClicked === 'function') {
                    $c.onEventRightClicked($m);
                }
            } else {
                switch ($c.eventRightClickHandling) {
                    case 'PostBack':
                        $c.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        $c.eventRightClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $c.onEventRightClick(e);
                        break;
                    case 'ContextMenu':
                        var $1d = e.client.contextMenu();
                        if ($1d) {
                            $1d.show(e);
                        } else {
                            if ($c.contextMenu) {
                                $c.contextMenu.show(this.event);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($c.bubble) {
                            $c.bubble.showEvent(e);
                        };
                        break;
                }
            };
            return false;
        };
        this.eventMenuClickPostBack = function(e, $1f, $i) {
            var $1a = {};
            $1a.e = e;
            $1a.command = $1f;
            this.$2L('EventMenuClick', $i, $1a);
        };
        this.eventMenuClickCallBack = function(e, $1f, $i) {
            var $1a = {};
            $1a.e = e;
            $1a.command = $1f;
            this.$2N('EventMenuClick', $1a, $i);
        };
        this.$2W = function($1f, e, $1g) {
            switch ($1g) {
                case 'PostBack':
                    $c.eventMenuClickPostBack(e, $1f);
                    break;
                case 'CallBack':
                    $c.eventMenuClickCallBack(e, $1f);
                    break;
            }
        };
        this.eventMovePostBack = function(e, $1h, $1i, $i, $0a) {
            if (!$1h) throw 'newStart is null';
            if (!$1i) throw 'newEnd is null';
            var $1a = {};
            $1a.e = e;
            $1a.newStart = $1h;
            $1a.newEnd = $1i;
            $1a.position = $0a;
            this.$2L('EventMove', $i, $1a);
        };
        this.eventMoveCallBack = function(e, $1h, $1i, $i, $0a) {
            if (!$1h) throw 'newStart is null';
            if (!$1i) throw 'newEnd is null';
            var $1a = {};
            $1a.e = e;
            $1a.newStart = $1h;
            $1a.newEnd = $1i;
            $1a.position = $0a;
            this.$2N('EventMove', $1a, $i);
        };
        this.$2p = function(e, x, y, $B, ev, $0a) {
            var $1j = DayPilot.Date.getTime(e.start().d);
            var $0C = DayPilot.Date.getDate(e.end().d);
            if ($0C.getTime() !== e.end().d.getTime()) {
                $0C = DayPilot.Date.addDays($0C, 1);
            };
            var $1k = DayPilot.Date.diff(e.end().d, $0C);
            var $1l = this.$29(x, y);
            $1l = DayPilot.Date.addDays($1l, -$B);
            var $A = DayPilot.Date.daysSpan(e.start().d, e.end().d) + 1;
            var $1m = DayPilot.Date.addDays($1l, $A);
            var $1h = new DayPilot.Date(DayPilot.Date.addTime($1l, $1j));
            var $1i = new DayPilot.Date(DayPilot.Date.addTime($1m, $1k));
            if ($c.$1S()) {
                var $m = {};
                $m.e = e;
                $m.newStart = $1h;
                $m.newEnd = $1i;
                $m.position = $0a;
                $m.ctrl = false;
                if (ev) {
                    $m.ctrl = ev.ctrlKey;
                };
                $m.shift = false;
                if (ev) {
                    $m.shift = ev.shiftKey;
                };
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventMove === 'function') {
                    $c.onEventMove($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventMoveHandling) {
                    case 'PostBack':
                        $c.eventMovePostBack(e, $1h, $1i, null, $0a);
                        break;
                    case 'CallBack':
                        $c.eventMoveCallBack(e, $1h, $1i, null, $0a);
                        break;
                    case 'Notify':
                        $c.eventMoveNotify(e, $1h, $1i, null, $0a);
                        break;
                    case 'Update':
                        e.start($1h);
                        e.end($1i);
                        $c.events.update(e);
                        break;
                };
                if (typeof $c.onEventMoved === 'function') {
                    $c.onEventMoved($m);
                }
            } else {
                switch ($c.eventMoveHandling) {
                    case 'PostBack':
                        $c.eventMovePostBack(e, $1h, $1i, null, $0a);
                        break;
                    case 'CallBack':
                        $c.eventMoveCallBack(e, $1h, $1i, null, $0a);
                        break;
                    case 'JavaScript':
                        $c.onEventMove(e, $1h, $1i, ev.ctrlKey, ev.shiftKey, $0a);
                        break;
                    case 'Notify':
                        $c.eventMoveNotify(e, $1h, $1i, null, $0a);
                        break;
                }
            }
        };
        this.eventMoveNotify = function(e, $1h, $1i, $i, $t) {
            var $1n = new DayPilot.Event(e.copy(), this);
            e.start($1h);
            e.end($1i);
            e.commit();
            $c.update();
            this.$2X("Notify", $1n, $1h, $1i, $i, $t);
        };
        this.$2X = function($17, e, $1h, $1i, $i, $t) {
            var $1a = {};
            $1a.e = e;
            $1a.newStart = $1h;
            $1a.newEnd = $1i;
            $1a.position = $t;
            this.$2Q($17, "EventMove", $1a, $i);
        };
        this.eventResizePostBack = function(e, $1h, $1i, $i) {
            if (!$1h) throw 'newStart is null';
            if (!$1i) throw 'newEnd is null';
            var $1a = {};
            $1a.e = e;
            $1a.newStart = $1h;
            $1a.newEnd = $1i;
            this.$2L('EventResize', $i, $1a);
        };
        this.eventResizeCallBack = function(e, $1h, $1i, $i) {
            if (!$1h) throw 'newStart is null';
            if (!$1i) throw 'newEnd is null';
            var $1a = {};
            $1a.e = e;
            $1a.newStart = $1h;
            $1a.newEnd = $1i;
            this.$2N('EventResize', $1a, $i);
        };
        this.$2Y = function(e, $09, $A) {
            var $1j = DayPilot.Date.getTime(e.start().d);
            var $0C = DayPilot.Date.getDate(e.end().d);
            if (!DayPilot.Date.equals($0C, e.end().d)) {
                $0C = DayPilot.Date.addDays($0C, 1);
            };
            var $1k = DayPilot.Date.diff(e.end().d, $0C);
            var $1l = this.$29($09.x, $09.y);
            var $1m = DayPilot.Date.addDays($1l, $A);
            var $1h = new DayPilot.Date(DayPilot.Date.addTime($1l, $1j));
            var $1i = new DayPilot.Date(DayPilot.Date.addTime($1m, $1k));
            if ($c.$1S()) {
                var $m = {};
                $m.e = e;
                $m.newStart = $1h;
                $m.newEnd = $1i;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onEventResize === 'function') {
                    $c.onEventResize($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.eventResizeHandling) {
                    case 'PostBack':
                        $c.eventResizePostBack(e, $1h, $1i);
                        break;
                    case 'CallBack':
                        $c.eventResizeCallBack(e, $1h, $1i);
                        break;
                    case 'Notify':
                        $c.eventResizeNotify(e, $1h, $1i);
                        break;
                    case 'Update':
                        e.start($1h);
                        e.end($1i);
                        $c.events.update(e);
                        break;
                };
                if (typeof $c.onEventResized === 'function') {
                    $c.onEventResized($m);
                }
            } else {
                switch ($c.eventResizeHandling) {
                    case 'PostBack':
                        $c.eventResizePostBack(e, $1h, $1i);
                        break;
                    case 'CallBack':
                        $c.eventResizeCallBack(e, $1h, $1i);
                        break;
                    case 'JavaScript':
                        $c.onEventResize(e, $1h, $1i);
                        break;
                    case 'Notify':
                        $c.eventResizeNotify(e, $1h, $1i);
                        break;
                }
            }
        };
        this.eventResizeNotify = function(e, $1h, $1i, $i) {
            var $1n = new DayPilot.Event(e.copy(), this);
            e.start($1h);
            e.end($1i);
            e.commit();
            $c.update();
            this.$2Z("Notify", $1n, $1h, $1i, $i);
        };
        this.$2Z = function($17, e, $1h, $1i, $i) {
            var $1a = {};
            $1a.e = e;
            $1a.newStart = $1h;
            $1a.newEnd = $1i;
            this.$2Q($17, "EventResize", $1a, $i);
        };
        this.timeRangeSelectedPostBack = function($09, end, $i) {
            var $0e = {};
            $0e.start = $09;
            $0e.end = end;
            this.$2L('TimeRangeSelected', $i, $0e);
        };
        this.timeRangeSelectedCallBack = function($09, end, $i) {
            var $0e = {};
            $0e.start = $09;
            $0e.end = end;
            this.$2N('TimeRangeSelected', $0e, $i);
        };
        this.$2q = function($09, end) {
            if ($c.$1S()) {
                var $m = {};
                $m.start = $09;
                $m.end = end;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onTimeRangeSelect === 'function') {
                    $c.onTimeRangeSelect($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $c.timeRangeSelectedPostBack($09, end);
                        $c.clearSelection();
                        break;
                    case 'CallBack':
                        $c.timeRangeSelectedCallBack($09, end);
                        $c.clearSelection();
                        break;
                };
                if (typeof $c.onTimeRangeSelected === 'function') {
                    $c.onTimeRangeSelected($m);
                }
            } else {
                switch ($c.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $c.timeRangeSelectedPostBack($09, end);
                        $c.clearSelection();
                        break;
                    case 'CallBack':
                        $c.timeRangeSelectedCallBack($09, end);
                        $c.clearSelection();
                        break;
                    case 'JavaScript':
                        $c.onTimeRangeSelected($09, end);
                        break;
                }
            }
        };
        this.timeRangeMenuClickPostBack = function(e, $1f, $i) {
            var $1a = {};
            $1a.selection = e;
            $1a.command = $1f;
            this.$2L("TimeRangeMenuClick", $i, $1a);
        };
        this.timeRangeMenuClickCallBack = function(e, $1f, $i) {
            var $1a = {};
            $1a.selection = e;
            $1a.command = $1f;
            this.$2N("TimeRangeMenuClick", $1a, $i);
        };
        this.$30 = function($1f, e, $1g) {
            switch ($1g) {
                case 'PostBack':
                    $c.timeRangeMenuClickPostBack(e, $1f);
                    break;
                case 'CallBack':
                    $c.timeRangeMenuClickCallBack(e, $1f);
                    break;
            }
        };
        this.headerClickPostBack = function(c, $i) {
            this.$2L('HeaderClick', $i, c);
        };
        this.headerClickCallBack = function(c, $i) {
            this.$2N('HeaderClick', c, $i);
        };
        this.$2B = function(x) {
            var $i = this.data;
            var c = {
                $0X: x
            };
            if ($c.$1S()) {
                var $m = {};
                $m.header = {};
                $m.header.dayOfWeek = x;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onHeaderClick === 'function') {
                    $c.onHeaderClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.headerClickHandling) {
                    case 'PostBack':
                        $c.headerClickPostBack(c);
                        break;
                    case 'CallBack':
                        $c.headerClickCallBack(c);
                        break;
                };
                if (typeof $c.onHeaderClicked === 'function') {
                    $c.onHeaderClicked($m);
                }
            } else {
                switch ($c.headerClickHandling) {
                    case 'PostBack':
                        $c.headerClickPostBack(c);
                        break;
                    case 'CallBack':
                        $c.headerClickCallBack(c);
                        break;
                    case 'JavaScript':
                        $c.onHeaderClick(c);
                        break;
                }
            }
        };
        this.timeRangeDoubleClickPostBack = function($09, end, $i) {
            var $0e = {};
            $0e.start = $09;
            $0e.end = end;
            this.$2L('TimeRangeDoubleClick', $i, $0e);
        };
        this.timeRangeDoubleClickCallBack = function($09, end, $i) {
            var $0e = {};
            $0e.start = $09;
            $0e.end = end;
            this.$2N('TimeRangeDoubleClick', $0e, $i);
        };
        this.$2K = function($09, end) {
            if ($c.$1S()) {
                var $m = {};
                $m.start = $09;
                $m.end = end;
                $m.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $c.onTimeRangeDoubleClick === 'function') {
                    $c.onTimeRangeDoubleClick($m);
                    if ($m.preventDefault.value) {
                        return;
                    }
                };
                switch ($c.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        $c.timeRangeDoubleClickPostBack($09, end);
                        break;
                    case 'CallBack':
                        $c.timeRangeDoubleClickCallBack($09, end);
                        break;
                };
                if (typeof $c.onTimeRangeDoubleClicked === 'function') {
                    $c.onTimeRangeDoubleClicked($m);
                }
            } else {
                switch ($c.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        $c.timeRangeDoubleClickPostBack($09, end);
                        break;
                    case 'CallBack':
                        $c.timeRangeDoubleClickCallBack($09, end);
                        break;
                    case 'JavaScript':
                        $c.onTimeRangeDoubleClick($09, end);
                        break;
                }
            }
        };
        this.commandCallBack = function($1f, $i) {
            this.$31();
            var $1a = {};
            $1a.command = $1f;
            this.$2N('Command', $1a, $i);
        };
        this.$32 = function(e) {
            for (var i = 0; i < $c.elements.events.length; i++) {
                var $s = $c.elements.events[i];
                if ($s.event === e) {
                    return $s;
                }
            };
            return null;
        };
        this.$2j = function(e) {
            var $d = {};
            $d.list = [];
            $d.each = function(m) {
                if (!m) {
                    return;
                };
                for (var i = 0; i < this.list.length; i++) {
                    m(this.list[i]);
                }
            };
            for (var i = 0; i < this.elements.events.length; i++) {
                var $s = this.elements.events[i];
                if ($s.event.data === e.data) {
                    $d.list.push($s);
                }
            };
            return $d;
        };
        this.$33 = {};
        var $M = this.$33;
        $M.lineHeight = function() {
            return $c.eventHeight + $c.lineSpace;
        };
        $M.rounded = function() {
            return $c.eventCorners === "Rounded";
        };
        $M.loadFromServer = function() {
            if ($c.backendUrl || typeof WebForm_DoCallback === 'function') {
                return (typeof $c.events.list === 'undefined') || (!$c.events.list);
            } else {
                return false;
            }
        };
        $M.locale = function() {
            return DayPilot.Locale.find($c.locale);
        };
        $M.getWeekStart = function() {
            if ($c.showWeekend) {
                return $c.weekStarts;
            } else {
                return 1;
            }
        };
        $M.notifyType = function() {
            var $17;
            if ($c.notifyCommit === 'Immediate') {
                $17 = "Notify";
            } else if ($c.notifyCommit === 'Queue') {
                $17 = "Queue";
            } else {
                throw "Invalid notifyCommit value: " + $c.notifyCommit;
            };
            return $17;
        };
        this.multiselect = {};
        this.multiselect.initList = [];
        this.multiselect.list = [];
        this.multiselect.divs = [];
        this.multiselect.previous = [];
        this.multiselect.$34 = function() {
            var m = $c.multiselect;
            return DayPilot.JSON.stringify(m.events());
        };
        this.multiselect.events = function() {
            var m = $c.multiselect;
            var $1o = [];
            $1o.ignoreToJSON = true;
            for (var i = 0; i < m.list.length; i++) {
                $1o.push(m.list[i]);
            };
            return $1o;
        };
        this.multiselect.$35 = function() {};
        this.multiselect.$2V = function($s, $1p) {
            var m = $c.multiselect;
            if (m.isSelected($s.event)) {
                if ($c.allowMultiSelect) {
                    if ($1p) {
                        m.remove($s.event, true);
                    } else {
                        var $0r = m.list.length;
                        m.clear(true);
                        if ($0r > 1) {
                            m.add($s.event, true);
                        }
                    }
                } else {
                    m.clear(true);
                }
            } else {
                if ($c.allowMultiSelect) {
                    if ($1p) {
                        m.add($s.event, true);
                    } else {
                        m.clear(true);
                        m.add($s.event, true);
                    }
                } else {
                    m.clear(true);
                    m.add($s.event, true);
                }
            };
            m.redraw();
            m.$35();
        };
        this.multiselect.$2g = function(ev) {
            var m = $c.multiselect;
            return m.$36(ev, m.initList);
        };
        this.multiselect.$37 = function() {
            var m = $c.multiselect;
            var $1q = [];
            for (var i = 0; i < m.list.length; i++) {
                var event = m.list[i];
                $1q.push(event.value());
            };
            alert($1q.join("\n"));
        };
        this.multiselect.add = function(ev, $1r) {
            var m = $c.multiselect;
            if (m.indexOf(ev) === -1) {
                m.list.push(ev);
            };
            if ($1r) {
                return;
            };
            m.redraw();
        };
        this.multiselect.remove = function(ev, $1r) {
            var m = $c.multiselect;
            var i = m.indexOf(ev);
            if (i !== -1) {
                m.list.splice(i, 1);
            }
        };
        this.multiselect.clear = function($1r) {
            var m = $c.multiselect;
            m.list = [];
            if ($1r) {
                return;
            };
            m.redraw();
        };
        this.multiselect.redraw = function() {
            var m = $c.multiselect;
            for (var i = 0; i < $c.elements.events.length; i++) {
                var $s = $c.elements.events[i];
                if (m.isSelected($s.event)) {
                    m.$38($s);
                } else {
                    m.$39($s);
                }
            }
        };
        this.multiselect.$38 = function($s) {
            var m = $c.multiselect;
            var cn = $c.cssOnly ? $c.$1T("_selected") : $c.$1T("selected");
            var $s = m.$3a($s);
            DayPilot.Util.addClass($s, cn);
            m.divs.push($s);
        };
        this.multiselect.$3a = function($s) {
            if ($c.cssOnly) {
                return $s;
            };
            return $s.firstChild;
        };
        this.multiselect.$3b = function() {
            var m = $c.multiselect;
            for (var i = 0; i < m.divs.length; i++) {
                var $s = m.divs[i];
                m.$39($s, true);
            };
            m.divs = [];
        };
        this.multiselect.$39 = function($s, $1s) {
            var m = $c.multiselect;
            var cn = $c.cssOnly ? $c.$1T("_selected") : $c.$1T("selected");
            var c = m.$3a($s);
            if (c && c.className && c.className.indexOf(cn) !== -1) {
                c.className = c.className.replace(cn, "");
            };
            if ($1s) {
                return;
            };
            var i = DayPilot.indexOf(m.divs, $s);
            if (i !== -1) {
                m.divs.splice(i, 1);
            }
        };
        this.multiselect.isSelected = function(ev) {
            return $c.multiselect.$36(ev, $c.multiselect.list);
        };
        this.multiselect.indexOf = function(ev) {
            return DayPilot.indexOf($c.multiselect.list, ev);
        };
        this.multiselect.$36 = function(e, $1q) {
            if (!$1q) {
                return false;
            };
            for (var i = 0; i < $1q.length; i++) {
                var ei = $1q[i];
                if (e === ei) {
                    return true;
                };
                if (typeof ei.value === 'function') {
                    if (ei.value() !== null && e.value() !== null && ei.value() === e.value()) {
                        return true;
                    };
                    if (ei.value() === null && e.value() === null && ei.recurrentMasterId() === e.recurrentMasterId() && e.start().toStringSortable() === ei.start()) {
                        return true;
                    }
                } else {
                    if (ei.value !== null && e.value() !== null && ei.value === e.value()) {
                        return true;
                    };
                    if (ei.value === null && e.value() === null && ei.recurrentMasterId === e.recurrentMasterId() && e.start().toStringSortable() === ei.start) {
                        return true;
                    }
                }
            };
            return false;
        };
        this.events.find = function(id) {
            var $1t = $c.events.list.length;
            for (var i = 0; i < $1t; i++) {
                if ($c.events.list[i].id === id) {
                    return new DayPilot.Event($c.events.list[i], $c);
                }
            };
            return null;
        };
        this.events.findRecurrent = function($1u, $1v) {
            var $1t = $c.events.list.length;
            for (var i = 0; i < $1t; i++) {
                if ($c.events.list[i].recurrentMasterId === $1u && $c.events.list[i].start.getTime() === $1v.getTime()) {
                    return new DayPilot.Event($c.events.list[i], $c);
                }
            };
            return null;
        };
        this.events.update = function(e, $i) {
            var $1a = {};
            $1a.oldEvent = new DayPilot.Event(e.copy(), $c);
            $1a.newEvent = new DayPilot.Event(e.temp(), $c);
            var $13 = new DayPilot.Action($c, "EventUpdate", $1a, $i);
            e.commit();
            $c.update();
            return $13;
        };
        this.events.remove = function(e, $i) {
            var $1a = {};
            $1a.e = new DayPilot.Event(e.data, $c);
            var $13 = new DayPilot.Action($c, "EventRemove", $1a, $i);
            var $0v = DayPilot.indexOf($c.events.list, e.data);
            $c.events.list.splice($0v, 1);
            $c.update();
            return $13;
        };
        this.events.add = function(e, $i) {
            e.calendar = $c;
            if (!$c.events.list) {
                $c.events.list = [];
            };
            $c.events.list.push(e.data);
            var $1a = {};
            $1a.e = e;
            var $13 = new DayPilot.Action($c, "EventAdd", $1a, $i);
            $c.update();
            return $13;
        };
        this.queue = {};
        this.queue.list = [];
        this.queue.list.ignoreToJSON = true;
        this.queue.add = function($13) {
            if (!$13) {
                return;
            };
            if ($13.isAction) {
                $c.queue.list.push($13);
            } else {
                throw "DayPilot.Action object required for queue.add()";
            }
        };
        this.queue.notify = function($i) {
            var $1a = {};
            $1a.actions = $c.queue.list;
            $c.$2N('Notify', $1a, $i, "Notify");
            $c.queue.list = [];
        };
        this.queue.clear = function() {
            $c.queue.list = [];
        };
        this.queue.pop = function() {
            return $c.queue.list.pop();
        };
        this.$1R = function($1w) {
            if ($1w) {
                this.autoRefreshEnabled = true;
            };
            if (!this.autoRefreshEnabled) {
                return;
            };
            if (this.autoRefreshCount >= this.autoRefreshMaxCount) {
                return;
            };
            this.$31();
            var $1x = this.autoRefreshInterval;
            if (!$1x || $1x < 10) {
                throw "The minimum autoRefreshInterval is 10 seconds";
            };
            this.autoRefreshTimeout = window.setTimeout(function() {
                $c.$3c();
            }, this.autoRefreshInterval * 1000);
        };
        this.$31 = function() {
            if (this.autoRefreshTimeout) {
                window.clearTimeout(this.autoRefreshTimeout);
            }
        };
        this.$3c = function() {
            if (!DayPilotMonth.eventResizing && !DayPilotMonth.eventMoving && !DayPilotMonth.timeRangeSelecting) {
                this.autoRefreshCount++;
                this.commandCallBack(this.autoRefreshCommand);
            };
            if (this.autoRefreshCount < this.autoRefreshMaxCount) {
                this.autoRefreshTimeout = window.setTimeout(function() {
                    $c.$3c();
                }, this.autoRefreshInterval * 1000);
            }
        };
        this.$3d = function($1y, $1z) {
            if (!this.debuggingEnabled) {
                return;
            };
            if (!$c.debugMessages) {
                $c.debugMessages = [];
            };
            $c.debugMessages.push($1y);
            if (typeof console !== 'undefined') {
                console.log($1y);
            }
        };
        this.update = function() {
            if (!this.cells) {
                return;
            };
            var $1A = true;
            $c.$1J();
            $c.$1K();
            $c.$1L();
            if ($1A) {
                $c.$1M();
                $c.$1N();
            };
            $c.$1O();
            $c.$1P();
            $c.$1Q();
        };
        this.dispose = function() {
            var c = $c;
            if (!c.nav.top) {
                return;
            };
            c.$31();
            c.$1J();
            c.nav.top.removeAttribute("style");
            c.nav.top.removeAttribute("class");
            c.nav.top.innerHTML = '';
            c.nav.top.dp = null;
            c.nav.top = null;
            DayPilotMonth.unregister(c);
        };
        this.$3e = function() {
            if (!DayPilotMonth.globalHandlers) {
                DayPilotMonth.globalHandlers = true;
                DayPilot.re(document, 'mouseup', DayPilotMonth.gMouseUp);
            };
            DayPilot.re(window, 'resize', this.$2z);
        };
        this.$1P = function() {
            if (this.nav.top.style.visibility === 'hidden') {
                this.nav.top.style.visibility = 'visible';
            }
        };
        this.show = function() {
            $c.nav.top.style.display = '';
        };
        this.hide = function() {
            $c.nav.top.style.display = 'none';
        };
        this.$3f = function() {
            this.$1K();
            this.$2v();
            this.$1N();
            this.$3e();
            this.$1R();
            this.$2N('Init');
            DayPilotMonth.register(this);
        };
        this.init = function() {
            this.nav.top = document.getElementById($b);
            if (this.nav.top.dp) {
                return;
            };
            var $1B = $M.loadFromServer();
            if ($1B) {
                this.$3f();
                this.initialized = true;
                return;
            };
            this.$1K();
            this.$1L();
            this.$2v();
            this.$1N();
            this.$1P();
            this.$1Q();
            this.$1O();
            this.$3e();
            if (this.messageHTML) {
                this.message(this.messageHTML);
            };
            this.$1I(null, false);
            this.$1R();
            DayPilotMonth.register(this);
            this.initialized = true;
        };
        this.internal = {};
        this.internal.invokeEvent = this.$2Q;
        this.internal.eventMenuClick = this.$2W;
        this.internal.timeRangeMenuClick = this.$30;
        this.internal.bubbleCallBack = this.$2R;
        this.internal.findEventDiv = this.$32;
        this.Init = this.init;
    };
    DayPilotMonth.register = function($c) {
        if (!DayPilotMonth.registered) {
            DayPilotMonth.registered = [];
        };
        for (var i = 0; i < DayPilotMonth.registered.length; i++) {
            if (DayPilotMonth.registered[i] === $c) {
                return;
            }
        };
        DayPilotMonth.registered.push($c);
    };
    DayPilotMonth.unregister = function($c) {
        var a = DayPilotMonth.registered;
        if (a) {
            var i = DayPilot.indexOf(a, $c);
            if (i !== -1) {
                a.splice(i, 1);
            };
            if (a.length === 0) {
                a = null;
            }
        };
        if (!a) {
            DayPilot.ue(document, 'mouseup', DayPilotMonth.gMouseUp);
            DayPilotMonth.globalHandlers = false;
        }
    };
    DayPilotMonth.gMouseUp = function(ev) {
        if (DayPilotMonth.movingEvent) {
            var $08 = DayPilotMonth.movingEvent;
            if (!$08.event || !$08.event.calendar || !$08.event.calendar.shadow || !$08.event.calendar.shadow.start) {
                return;
            };
            var $c = DayPilotMonth.movingEvent.event.calendar;
            var e = DayPilotMonth.movingEvent.event;
            var $09 = $c.shadow.start;
            var $0a = $c.shadow.position;
            var $B = DayPilotMonth.movingEvent.offset;
            $c.$28();
            DayPilotMonth.movingEvent = null;
            var ev = ev || window.event;
            $c.$2p(e, $09.x, $09.y, $B, ev, $0a);
            ev.cancelBubble = true;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            };
            DayPilotMonth.movingEvent = null;
            return false;
        } else if (DayPilotMonth.resizingEvent) {
            var $08 = DayPilotMonth.resizingEvent;
            if (!$08.event || !$08.event.calendar || !$08.event.calendar.shadow || !$08.event.calendar.shadow.start) {
                return;
            };
            var $c = DayPilotMonth.resizingEvent.event.calendar;
            var e = DayPilotMonth.resizingEvent.event;
            var $09 = $c.shadow.start;
            var $A = $c.shadow.width;
            $c.$28();
            DayPilotMonth.resizingEvent = null;
            $c.$2Y(e, $09, $A);
            ev.cancelBubble = true;
            DayPilotMonth.resizingEvent = null;
            return false;
        } else if (DayPilotMonth.timeRangeSelecting) {
            if (DayPilotMonth.timeRangeSelecting.moved) {
                var $0b = DayPilotMonth.timeRangeSelecting;
                var $c = $0b.root;
                var $09 = new DayPilot.Date($c.$29($0b.from.x, $0b.from.y));
                var end = $09.addDays($0b.width);
                $c.$2q($09, end);
            };
            DayPilotMonth.timeRangeSelecting = null;
        }
    };
    DayPilot.MonthVisible.Month = DayPilotMonth.Month;
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotMonth = function($1C) {
                var $1D = null;
                var j = this.each(function() {
                    if (this.daypilot) {
                        return;
                    };
                    var $1E = new DayPilot.Month(this.id);
                    this.daypilot = $1E;
                    for (var name in $1C) {
                        $1E[name] = $1C[name];
                    };
                    $1E.Init();
                    if (!$1D) {
                        $1D = $1E;
                    }
                });
                if (this.length === 1) {
                    return $1D;
                } else {
                    return j;
                }
            };
        })(jQuery);
    };
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilotNavigator === 'undefined') {
    var DayPilotNavigator = DayPilot.NavigatorVisible = {};
};
(function() {
    if (typeof DayPilot.Navigator !== 'undefined') {
        return;
    };
    DayPilotNavigator = {};
    DayPilot.Navigator = function(id) {
        this.v = '444';
        var $a = this;
        this.id = id;
        this.api = 2;
        this.isNavigator = true;
        this.weekStarts = 'Auto';
        this.selectMode = 'day';
        this.titleHeight = 20;
        this.dayHeaderHeight = 20;
        this.cellWidth = 20;
        this.cellHeight = 20;
        this.cssOnly = true;
        this.selectionStart = new DayPilot.Date().getDatePart();
        this.selectionEnd = null;
        this.selectionDay = null;
        this.showMonths = 1;
        this.skipMonths = 1;
        this.command = "navigate";
        this.year = new DayPilot.Date().getYear();
        this.month = new DayPilot.Date().getMonth() + 1;
        this.showWeekNumbers = false;
        this.weekNumberAlgorithm = 'Auto';
        this.rowsPerMonth = 'Six';
        this.orientation = "Vertical";
        this.locale = "en-us";
        this.timeRangeSelectedHandling = "Enabled";
        this.visibleRangeChangedHandling = "Enabled";
        this.$08 = function() {
            this.root.dp = this;
            if (this.cssOnly) {
                this.root.className = this.$09('_main');
            } else {
                this.root.className = this.$09('main');
            };
            if (this.orientation === "Horizontal") {
                this.root.style.width = this.showMonths * (this.cellWidth * 7 + this.$0a()) + 'px';
                this.root.style.height = (this.cellHeight * 6 + this.titleHeight + this.dayHeaderHeight) + 'px';
            } else {
                this.root.style.width = (this.cellWidth * 7 + this.$0a()) + 'px';
            };
            this.root.style.position = "relative";
            var $b = document.createElement("input");
            $b.type = 'hidden';
            $b.name = $a.id + "_state";
            $b.id = $b.name;
            this.root.appendChild($b);
            this.state = $b;
            if (!this.startDate) {
                this.startDate = new DayPilot.Date(DayPilot.Date.firstDayOfMonth(this.year, this.month));
            } else {
                this.startDate = new DayPilot.Date(this.startDate).firstDayOfMonth();
            };
            this.calendars = [];
            this.selected = [];
            this.months = [];
        };
        this.$0b = function() {
            return $a.api === 2;
        };
        this.$0c = function() {
            this.root.innerHTML = '';
        };
        this.$09 = function($c) {
            if (this.cssClassPrefix) {
                return this.cssClassPrefix + $c;
            } else {
                return "";
            }
        };
        this.$0d = function($d, name) {
            var $e = this.cssOnly ? this.$09("_" + name) : this.$09(name);
            DayPilot.Util.addClass($d, $e);
        };
        this.$0e = function($d, name) {
            var $e = this.cssOnly ? this.$09("_" + name) : this.$09(name);
            DayPilot.Util.removeClass($d, $e);
        };
        this.$0f = function(j, $f) {
            var $g = {};
            $g.cells = [];
            $g.days = [];
            $g.weeks = [];
            var $h = this.startDate.addMonths(j);
            var $i = $f.before;
            var $j = $f.after;
            var $k = $h.firstDayOfMonth();
            var $l = $k.firstDayOfWeek($m.weekStarts());
            var $n = $k.addMonths(1);
            var $o = DayPilot.Date.daysDiff($l.d, $n.d);
            var $p = (this.rowsPerMonth === "Auto") ? Math.ceil($o / 7) : 6;
            $g.rowCount = $p;
            var $q = (new DayPilot.Date()).getDatePart();
            var $r = this.cellWidth * 7 + this.$0a();
            var $s = this.cellHeight * $p + this.titleHeight + this.dayHeaderHeight;
            $g.height = $s;
            var $t = document.createElement("div");
            $t.style.width = ($r) + 'px';
            $t.style.height = ($s) + 'px';
            if (this.orientation === "Horizontal") {
                $t.style.position = "absolute";
                $t.style.left = ($r * j) + "px";
                $t.style.top = "0px";
            } else {
                $t.style.position = 'relative';
            };
            if (this.cssOnly) {
                $t.className = this.$09('_month');
            } else {
                $t.className = this.$09('month');
            };
            $t.style.cursor = 'default';
            $t.style.MozUserSelect = 'none';
            $t.style.KhtmlUserSelect = 'none';
            $t.style.WebkitUserSelect = 'none';
            $t.month = $g;
            this.root.appendChild($t);
            var $u = this.titleHeight + this.dayHeaderHeight;
            var tl = document.createElement("div");
            tl.style.position = 'absolute';
            tl.style.left = '0px';
            tl.style.top = '0px';
            tl.style.width = this.cellWidth + 'px';
            tl.style.height = this.titleHeight + 'px';
            tl.style.lineHeight = this.titleHeight + 'px';
            tl.style.textAlign = 'left';
            tl.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                tl.className = this.$09('_titleleft');
            } else {
                tl.className = this.$09('titleleft');
            };
            if ($f.left) {
                tl.style.cursor = 'pointer';
                tl.innerHTML = "<span style='margin-left:2px;'>&lt;</span>";
                tl.onclick = this.$0g;
            };
            $t.appendChild(tl);
            this.tl = tl;
            var ti = document.createElement("div");
            ti.style.position = 'absolute';
            ti.style.left = this.cellWidth + 'px';
            ti.style.top = '0px';
            ti.style.width = (this.cellWidth * 5 + this.$0a()) + 'px';
            ti.style.height = this.titleHeight + 'px';
            ti.style.lineHeight = this.titleHeight + 'px';
            ti.style.textAlign = 'center';
            ti.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                ti.className = this.$09('_title');
            } else {
                ti.className = this.$09('title');
            };
            ti.innerHTML = $m.locale().monthNames[$h.getMonth()] + ' ' + $h.getYear();
            $t.appendChild(ti);
            this.ti = ti;
            var tr = document.createElement("div");
            tr.style.position = 'absolute';
            tr.style.left = (this.cellWidth * 6 + this.$0a()) + 'px';
            tr.style.top = '0px';
            tr.style.width = this.cellWidth + 'px';
            tr.style.height = this.titleHeight + 'px';
            tr.style.lineHeight = this.titleHeight + 'px';
            tr.style.textAlign = 'right';
            tr.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                tr.className = this.$09('_titleright');
            } else {
                tr.className = this.$09('titleright');
            };
            if ($f.right) {
                tr.style.cursor = 'pointer';
                tr.innerHTML = "<span style='margin-right:2px;'>&gt;</span>";
                tr.onclick = this.$0h;
            };
            $t.appendChild(tr);
            this.tr = tr;
            var $v = this.$0a();
            if (this.showWeekNumbers) {
                for (var y = 0; y < $p; y++) {
                    var $w = $l.addDays(y * 7);
                    var $x = null;
                    switch (this.weekNumberAlgorithm) {
                        case "Auto":
                            $x = ($m.weekStarts() === 0) ? $w.weekNumber() : $w.weekNumberISO();
                            break;
                        case "US":
                            $x = $w.weekNumber();
                            break;
                        case "ISO8601":
                            $x = $w.weekNumberISO();
                            break;
                        default:
                            throw "Unknown weekNumberAlgorithm value.";
                    };
                    var dh = document.createElement("div");
                    dh.style.position = 'absolute';
                    dh.style.left = (0) + 'px';
                    dh.style.top = (y * this.cellHeight + $u) + 'px';
                    dh.style.width = this.cellWidth + 'px';
                    dh.style.height = this.cellHeight + 'px';
                    dh.style.lineHeight = this.cellHeight + 'px';
                    dh.style.textAlign = 'right';
                    dh.setAttribute("unselectable", "on");
                    if (this.cssOnly) {
                        dh.className = this.$09('_weeknumber');
                    } else {
                        dh.className = this.$09('weeknumber');
                    };
                    dh.innerHTML = "<span style='margin-right: 2px'>" + $x + "</span>";
                    $t.appendChild(dh);
                    $g.weeks.push(dh);
                }
            };
            for (var x = 0; x < 7; x++) {
                $g.cells[x] = [];
                var dh = document.createElement("div");
                dh.style.position = 'absolute';
                dh.style.left = (x * this.cellWidth + $v) + 'px';
                dh.style.top = this.titleHeight + 'px';
                dh.style.width = this.cellWidth + 'px';
                dh.style.height = this.dayHeaderHeight + 'px';
                dh.style.lineHeight = this.dayHeaderHeight + 'px';
                dh.style.textAlign = 'right';
                dh.setAttribute("unselectable", "on");
                if (this.cssOnly) {
                    dh.className = this.$09('_dayheader');
                } else {
                    dh.className = this.$09('dayheader');
                };
                dh.innerHTML = "<span style='margin-right: 2px'>" + this.$0i(x) + "</span>";
                $t.appendChild(dh);
                $g.days.push(dh);
                for (var y = 0; y < $p; y++) {
                    var $w = $l.addDays(y * 7 + x);
                    var $y = this.$0j($w) && this.selectMode !== 'none';
                    var $z = $w.getMonth() === $h.getMonth();
                    var $A = $w.getTime() < $h.getTime();
                    var $B = $w.getTime() > $h.getTime();
                    var $C;
                    var dc = document.createElement("div");
                    dc.day = $w;
                    dc.x = x;
                    dc.y = y;
                    dc.isCurrentMonth = $z;
                    if (this.cssOnly) {
                        dc.className = this.$09(($z ? '_day' : '_dayother'));
                    } else {
                        dc.className = this.$09(($z ? 'day' : 'dayother'));
                    };
                    if ($w.getTime() === $q.getTime() && $z) {
                        this.$0d(dc, 'today');
                    };
                    if ($w.dayOfWeek() === 0 || $w.dayOfWeek() === 6) {
                        this.$0d(dc, 'weekend');
                    };
                    dc.style.position = 'absolute';
                    dc.style.left = (x * this.cellWidth + $v) + 'px';
                    dc.style.top = (y * this.cellHeight + $u) + 'px';
                    dc.style.width = this.cellWidth + 'px';
                    dc.style.height = this.cellHeight + 'px';
                    dc.style.lineHeight = this.cellHeight + 'px';
                    dc.style.textAlign = 'right';
                    var $D = document.createElement("div");
                    $D.style.position = 'absolute';
                    if (this.cssOnly) {
                        $D.className = ($w.getTime() === $q.getTime() && $z) ? this.$09('_todaybox') : this.$09('_daybox');
                    } else {
                        $D.className = ($w.getTime() === $q.getTime() && $z) ? this.$09('todaybox') : this.$09('daybox');
                    };
                    $D.style.left = '0px';
                    $D.style.top = '0px';
                    $D.style.width = (this.cellWidth - 2) + 'px';
                    $D.style.height = (this.cellHeight - 2) + 'px';
                    dc.appendChild($D);
                    var $E = null;
                    if (this.cells && this.cells[$w.toStringSortable()]) {
                        $E = this.cells[$w.toStringSortable()];
                        if ($E.css) {
                            this.$0d(dc, $E.css);
                        }
                    };
                    var $F = null;
                    if ($z || ($i && $A) || ($j && $B)) {
                        $F = document.createElement("span");
                        $F.innerHTML = $w.getDay();
                        dc.style.cursor = 'pointer';
                        dc.isClickable = true;
                        if ($y) {
                            this.$0d(dc, 'select');
                        };
                        if ($E && $E.html) {
                            $F.innerHTML = $E.html;
                        };
                        $F.style.marginRight = '2px';
                        dc.appendChild($F);
                    };
                    dc.setAttribute("unselectable", "on");
                    dc.onclick = this.$0k;
                    dc.onmousedown = this.$0l;
                    dc.onmousemove = this.$0m;
                    if ($y) {
                        this.selected.push(dc);
                    };
                    $t.appendChild(dc);
                    $g.cells[x][y] = dc;
                }
            };
            var $G = document.createElement("div");
            $G.style.position = 'absolute';
            $G.style.left = '0px';
            $G.style.top = ($u - 2) + 'px';
            $G.style.width = (this.cellWidth * 7 + this.$0a()) + 'px';
            $G.style.height = '1px';
            $G.style.fontSize = '1px';
            $G.style.lineHeight = '1px';
            if (this.cssOnly) {
                $G.className = this.$09("_line");
            } else {
                $G.className = this.$09("line");
            };
            $t.appendChild($G);
            this.months.push($g);
        };
        this.$0a = function() {
            if (this.showWeekNumbers) {
                return this.cellWidth;
            };
            return 0;
        };
        this.$0n = function() {
            if (!this.items) {
                return;
            };
            for (var j = 0; j < this.showMonths; j++) {
                for (var x = 0; x < 7; x++) {
                    for (var y = 0; y < 6; y++) {
                        var $E = this.months[j].cells[x][y];
                        if (!$E) {
                            continue;
                        };
                        if (this.items[$E.day.toStringSortable()] === 1) {
                            this.$0d($E, 'busy');
                        } else {
                            this.$0e($E, 'busy');
                        }
                    }
                }
            }
        };
        this.$0o = function() {
            var s = {};
            s.startDate = $a.startDate;
            s.selectionStart = $a.selectionStart;
            s.selectionEnd = $a.selectionEnd.addDays(1);
            $a.state.value = DayPilot.JSON.stringify(s);
        };
        this.$0p = function() {
            switch (this.selectMode) {
                case 'day':
                    this.selectionEnd = this.selectionStart;
                    break;
                case 'week':
                    this.selectionStart = this.selectionStart.firstDayOfWeek($m.weekStarts());
                    this.selectionEnd = this.selectionStart.addDays(6);
                    break;
                case 'month':
                    this.selectionStart = this.selectionStart.firstDayOfMonth();
                    this.selectionEnd = this.selectionStart.lastDayOfMonth();
                    break;
                case 'none':
                    this.selectionEnd = this.selectionStart;
                    break;
                default:
                    throw "Unkown selectMode value.";
            }
        };
        this.select = function($H) {
            var $I = true;
            var $J = this.selectionStart;
            var $K = this.selectionEnd;
            this.selectionStart = new DayPilot.Date($H).getDatePart();
            this.selectionDay = this.selectionStart;
            var $L = false;
            if ($I) {
                var $M = this.startDate;
                if (this.selectionStart.getTime() < this.visibleStart().getTime() || this.selectionStart.getTime() > this.visibleEnd().getTime()) {
                    $M = this.selectionStart.firstDayOfMonth();
                };
                if ($M.toStringSortable() !== this.startDate.toStringSortable()) {
                    $L = true;
                };
                this.startDate = $M;
            };
            this.$0p();
            this.$0c();
            this.$08();
            this.$0q();
            this.$0n();
            this.$0o();
            if (!$J.equals(this.selectionStart) || !$K.equals(this.selectionEnd)) {
                this.$0r();
            };
            if ($L) {
                this.$0s();
            }
        };
        this.update = function() {
            this.$0c();
            this.$08();
            this.$0q();
            this.$0n();
            this.$0o();
        };
        this.$0t = function($N, $O, $P) {
            var $Q = {};
            $Q.action = $N;
            $Q.parameters = $P;
            $Q.data = $O;
            $Q.header = this.$0u();
            var $R = "JSON" + DayPilot.JSON.stringify($Q);
            var $S = null;
            if (this.backendUrl) {
                DayPilot.request(this.backendUrl, this.$0v, $R, this.$0w);
            } else {
                WebForm_DoCallback(this.uniqueID, $R, this.$0x, $S, this.callbackError, true);
            }
        };
        this.$0w = function($T) {
            if (typeof $a.onAjaxError === 'function') {
                var $U = {};
                $U.request = $T;
                $a.onAjaxError($U);
            } else if (typeof $a.ajaxError === 'function') {
                $a.ajaxError($T);
            }
        };
        this.$0v = function($V) {
            $a.$0x($V.responseText);
        };
        this.$0y = function($N, $O, $P) {
            var $Q = {};
            $Q.action = $N;
            $Q.parameters = $P;
            $Q.data = $O;
            $Q.header = this.$0u();
            var $R = "JSON" + DayPilot.JSON.stringify($Q);
            __doPostBack($a.uniqueID, $R);
        };
        this.$0u = function() {
            var h = {};
            h.v = this.v;
            h.startDate = this.startDate;
            h.selectionStart = this.selectionStart;
            return h;
        };
        this.$0z = function($N, $O) {
            if ($N === 'refresh') {
                this.$0s();
            }
        };
        this.$0i = function(i) {
            var x = i + $m.weekStarts();
            if (x > 6) {
                x -= 7;
            };
            return $m.locale().dayNamesShort[x];
        };
        this.$0j = function($H) {
            if (this.selectionStart === null || this.selectionEnd === null) {
                return false;
            };
            if (this.selectionStart.getTime() <= $H.getTime() && $H.getTime() <= this.selectionEnd.getTime()) {
                return true;
            };
            return false;
        };
        this.$0l = function(ev) {};
        this.$0m = function(ev) {};
        this.$0k = function(ev) {
            var $g = this.parentNode.month;
            var x = this.x;
            var y = this.y;
            var $w = $g.cells[x][y].day;
            if (!$g.cells[x][y].isClickable) {
                return;
            };
            $a.clearSelection();
            $a.selectionDay = $w;
            var $w = $a.selectionDay;
            switch ($a.selectMode) {
                case 'none':
                    $a.selectionStart = $w;
                    $a.selectionEnd = $w;
                    break;
                case 'day':
                    var s = $g.cells[x][y];
                    $a.$0d(s, 'select');
                    $a.selected.push(s);
                    $a.selectionStart = s.day;
                    $a.selectionEnd = s.day;
                    break;
                case 'week':
                    for (var j = 0; j < 7; j++) {
                        $a.$0d($g.cells[j][y], 'select');
                        $a.selected.push($g.cells[j][y]);
                    };
                    $a.selectionStart = $g.cells[0][y].day;
                    $a.selectionEnd = $g.cells[6][y].day;
                    break;
                case 'month':
                    var $W = null;
                    var end = null;
                    for (var y = 0; y < 6; y++) {
                        for (var x = 0; x < 7; x++) {
                            var s = $g.cells[x][y];
                            if (!s) {
                                continue;
                            };
                            if (s.day.getYear() === $w.getYear() && s.day.getMonth() === $w.getMonth()) {
                                $a.$0d(s, 'select');
                                $a.selected.push(s);
                                if ($W === null) {
                                    $W = s.day;
                                };
                                end = s.day;
                            }
                        }
                    };
                    $a.selectionStart = $W;
                    $a.selectionEnd = end;
                    break;
                default:
                    throw 'unknown selectMode';
            };
            $a.$0o();
            $a.$0r();
        };
        this.$0r = function() {
            var $W = $a.selectionStart;
            var end = $a.selectionEnd.addDays(1);
            var $o = DayPilot.Date.daysDiff($W.d, end.d);
            var $w = $a.selectionDay;
            if ($a.$0b()) {
                var $U = {};
                $U.start = $W;
                $U.end = end;
                $U.day = $w;
                $U.days = $o;
                $U.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $a.onTimeRangeSelect === 'function') {
                    $a.onTimeRangeSelect($U);
                    if ($U.preventDefault.value) {
                        return;
                    }
                };
                switch ($a.timeRangeSelectedHandling) {
                    case 'Bind':
                        var $X = eval($a.bound);
                        if ($X) {
                            var $Y = {};
                            $Y.start = $W;
                            $Y.end = end;
                            $Y.days = $o;
                            $Y.day = $w;
                            $X.commandCallBack($a.command, $Y);
                        };
                        break;
                    case 'None':
                        break;
                    case 'PostBack':
                        $a.timeRangeSelectedPostBack($W, end, $w);
                        break;
                };
                if (typeof $a.onTimeRangeSelected === 'function') {
                    $a.onTimeRangeSelected($U);
                }
            } else {
                switch ($a.timeRangeSelectedHandling) {
                    case 'Bind':
                        var $X = eval($a.bound);
                        if ($X) {
                            var $Y = {};
                            $Y.start = $W;
                            $Y.end = end;
                            $Y.days = $o;
                            $Y.day = $w;
                            $X.commandCallBack($a.command, $Y);
                        };
                        break;
                    case 'JavaScript':
                        $a.onTimeRangeSelected($W, end, $w);
                        break;
                    case 'None':
                        break;
                    case 'PostBack':
                        $a.timeRangeSelectedPostBack($W, end, $w);
                        break;
                }
            }
        };
        this.timeRangeSelectedPostBack = function($W, end, $O, $w) {
            var $Z = {};
            $Z.start = $W;
            $Z.end = end;
            $Z.day = $w;
            this.$0y('TimeRangeSelected', $O, $Z);
        };
        this.$0h = function(ev) {
            $a.$0A($a.skipMonths);
        };
        this.$0g = function(ev) {
            $a.$0A(-$a.skipMonths);
        };
        this.$0A = function(i) {
            this.startDate = this.startDate.addMonths(i);
            this.$0c();
            this.$08();
            this.$0q();
            this.$0o();
            this.$0s();
        };
        this.visibleStart = function() {
            return $a.startDate.firstDayOfMonth().firstDayOfWeek($m.weekStarts());
        };
        this.visibleEnd = function() {
            return $a.startDate.firstDayOfMonth().addMonths(this.showMonths - 1).firstDayOfWeek($m.weekStarts()).addDays(42);
        };
        this.$0s = function() {
            var $W = this.visibleStart();
            var end = this.visibleEnd();
            if ($a.$0b()) {
                var $U = {};
                $U.start = $W;
                $U.end = end;
                $U.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $a.onVisibleRangeChange === 'function') {
                    $a.onVisibleRangeChange($U);
                    if ($U.preventDefault.value) {
                        return;
                    }
                };
                switch (this.visibleRangeChangedHandling) {
                    case "CallBack":
                        this.visibleRangeChangedCallBack(null);
                        break;
                    case "PostBack":
                        this.visibleRangeChangedPostBack(null);
                        break;
                    case "Disabled":
                        break;
                };
                if (typeof $a.onVisibleRangeChanged === 'function') {
                    $a.onVisibleRangeChanged($U);
                }
            } else {
                switch (this.visibleRangeChangedHandling) {
                    case "CallBack":
                        this.visibleRangeChangedCallBack(null);
                        break;
                    case "PostBack":
                        this.visibleRangeChangedPostBack(null);
                        break;
                    case "JavaScript":
                        this.onVisibleRangeChanged($W, end);
                        break;
                    case "Disabled":
                        break;
                }
            }
        };
        this.visibleRangeChangedCallBack = function($O) {
            var $P = {};
            this.$0t("Visible", $O, $P);
        };
        this.visibleRangeChangedPostBack = function($O) {
            var $P = {};
            this.$0y("Visible", $O, $P);
        };
        this.$0x = function($00, $S) {
            var $00 = eval("(" + $00 + ")");
            $a.items = $00.Items;
            $a.cells = $00.Cells;
            $a.$0n();
        };
        this.$0q = function() {
            for (var j = 0; j < this.showMonths; j++) {
                var $f = this.$0B(j);
                this.$0f(j, $f);
            };
            this.root.style.height = this.$0C() + "px";
        };
        this.$0C = function() {
            if (this.orientation === "Horizontal") {
                var $01 = 0;
                for (var i = 0; i < this.months.length; i++) {
                    var $g = this.months[i];
                    if ($g.height > $01) {
                        $01 = $g.height;
                    }
                };
                return $01;
            } else {
                var $02 = 0;
                for (var i = 0; i < this.months.length; i++) {
                    var $g = this.months[i];
                    $02 += $g.height;
                };
                return $02;
            }
        };
        this.$0B = function(j) {
            if (this.internal.showLinks) {
                return this.internal.showLinks;
            };
            var $f = {};
            $f.left = (j === 0);
            $f.right = (j === 0);
            $f.before = j === 0;
            $f.after = j === this.showMonths - 1;
            if (this.orientation === "Horizontal") {
                $f.right = (j === this.showMonths - 1);
            };
            return $f;
        };
        this.internal = {};
        this.$0D = {};
        var $m = this.$0D;
        $m.locale = function() {
            return DayPilot.Locale.find($a.locale);
        };
        $m.weekStarts = function() {
            if ($a.weekStarts === 'Auto') {
                var $03 = $m.locale();
                if ($03) {
                    return $03.weekStarts;
                } else {
                    return 0;
                }
            } else {
                return $a.weekStarts;
            }
        };
        this.clearSelection = function() {
            for (var j = 0; j < this.selected.length; j++) {
                this.$0e(this.selected[j], 'select');
            };
            this.selected = [];
        };
        this.$0E = function() {
            if (this.backendUrl || typeof WebForm_DoCallback === 'function') {
                return (typeof $a.items === 'undefined') || (!$a.items);
            } else {
                return false;
            }
        };
        this.init = function() {
            this.root = document.getElementById(id);
            if (this.root.dp) {
                return;
            };
            this.$0p();
            this.$08();
            this.$0q();
            this.$0n();
            this.$0F();
            var $04 = this.$0E();
            if ($04) {
                this.$0s();
            };
            this.initialized = true;
        };
        this.dispose = function() {
            var c = $a;
            if (!c.root) {
                return;
            };
            c.root.removeAttribute("style");
            c.root.removeAttribute("class");
            c.root.dp = null;
            c.root.innerHTML = null;
            c.root = null;
        };
        this.$0F = function() {
            var $05 = document.getElementById(id);
            $05.dispose = this.dispose;
        };
        this.Init = this.init;
    };
    DayPilot.NavigatorVisible.Navigator = DayPilotNavigator.Navigator;
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotNavigator = function($06) {
                var $l = null;
                var j = this.each(function() {
                    if (this.daypilot) {
                        return;
                    };
                    var $07 = new DayPilot.Navigator(this.id);
                    this.daypilot = $07;
                    for (var name in $06) {
                        $07[name] = $06[name];
                    };
                    $07.Init();
                    if (!$l) {
                        $l = $07;
                    }
                });
                if (this.length === 1) {
                    return $l;
                } else {
                    return j;
                }
            };
        })(jQuery);
    };
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
};
if (typeof DayPilotScheduler === 'undefined') {
    var DayPilotScheduler = DayPilot.SchedulerVisible = {};
};
if (typeof DayPilot.Global === 'undefined') {
    DayPilot.Global = {};
};
(function() {
    if (typeof DayPilot.Scheduler !== 'undefined') {
        return;
    };
    var DayPilotScheduler = {};
    var $a = function() {};
    DayPilot.Scheduler = function(id) {
        this.v = '444';
        var $b = this;
        this.id = id;
        this.isScheduler = true;
        this.hideUntilInit = true;
        this.api = 2;
        this.allowMultiSelect = true;
        this.autoRefreshCommand = 'refresh';
        this.autoRefreshEnabled = false;
        this.autoRefreshInterval = 60;
        this.autoRefreshMaxCount = 20;
        this.autoScroll = "Drag";
        this.borderColor = "#000000";
        this.businessBeginsHour = 9;
        this.businessEndsHour = 18;
        this.cellBackColor = "#FFFFD5";
        this.cellBackColorNonBusiness = "#FFF4BC";
        this.cellBorderColor = "#EAD098";
        this.cellDuration = 60;
        this.cellGroupBy = 'Day';
        this.cellSelectColor = "#316AC5";
        this.cellWidth = 20;
        this.clientSide = true;
        this.crosshairColor = 'Gray';
        this.crosshairOpacity = 20;
        this.crosshairType = 'Header';
        this.debuggingEnabled = false;
        this.dragOutAllowed = false;
        this.durationBarColor = 'blue';
        this.durationBarHeight = 3;
        this.durationBarVisible = true;
        this.durationBarMode = "Duration";
        this.durationBarDetached = false;
        this.days = 1;
        this.dynamicEventRendering = 'Progressive';
        this.dynamicEventRenderingMargin = 50;
        this.dynamicLoading = false;
        this.eventBorderColor = "#000000";
        this.eventBorderVisible = true;
        this.eventBackColor = "#FFFFFF";
        this.eventFontFamily = "Tahoma, Arial";
        this.eventFontSize = '8pt';
        this.eventFontColor = '#000000';
        this.eventHeight = 20;
        this.eventMoveMargin = 5;
        this.eventMoveToPosition = false;
        this.eventResizeMargin = 5;
        this.ganttAppendToResources = false;
        this.headerFontColor = "#000000";
        this.headerFontFamily = "Tahoma, Arial";
        this.headerFontSize = '8pt';
        this.headerHeight = 20;
        this.heightSpec = 'Auto';
        this.hourFontFamily = "Tahoma, Arial";
        this.hourFontSize = '10pt';
        this.hourNameBackColor = "#ECE9D8";
        this.hourNameBorderColor = "#ACA899";
        this.layout = 'Auto';
        this.locale = "en-us";
        this.loadingLabelText = "Loading...";
        this.loadingLabelVisible = true;
        this.loadingLabelBackColor = "orange";
        this.loadingLabelFontColor = "#ffffff";
        this.loadingLabelFontFamily = "Tahoma";
        this.loadingLabelFontSize = "10pt";
        this.messageHideAfter = 5000;
        this.moveBy = 'Top';
        this.notifyCommit = 'Immediate';
        this.numberFormat = "0.00";
        this.treePreventParentUsage = true;
        this.rowHeaderWidth = 80;
        this.rowHeaderCols = null;
        this.rowMarginBottom = 0;
        this.rowMinHeight = 0;
        this.scrollX = 0;
        this.scrollY = 0;
        this.shadow = "Fill";
        this.showBaseTimeHeader = true;
        this.showNonBusiness = true;
        this.showToolTip = true;
        this.snapToGrid = true;
        this.startDate = new DayPilot.Date().getDatePart();
        this.syncResourceTree = true;
        this.timeBreakColor = '#000000';
        this.treeEnabled = false;
        this.treeIndent = 20;
        this.treeImageMarginLeft = 2;
        this.treeImageMarginTop = 2;
        this.timeFormat = "Auto";
        this.useEventBoxes = 'Always';
        this.viewType = 'Resources';
        this.weekStarts = 'Auto';
        this.width = null;
        this.eventCorners = 'Regular';;
        this.separators = [];
        this.afterRender = function() {};
        this.cornerHtml = '';
        this.crosshairLastY = -1;
        this.crosshairLastX = -1;
        this.eventClickHandling = 'Enabled';
        this.eventHoverHandling = 'Bubble';
        this.eventDoubleClickHandling = 'Enabled';
        this.eventEditHandling = 'Update';
        this.eventMoveHandling = 'Update';
        this.eventResizeHandling = 'Update';
        this.eventRightClickHandling = 'ContextMenu';
        this.eventSelectHandling = 'Update';
        this.resourceHeaderClickHandling = 'Enabled';
        this.timeRangeDoubleClickHandling = 'Enabled';
        this.timeRangeSelectedHandling = 'Enabled';
        this.cssOnly = true;
        this.backendUrl = null;
        if ($b.api === 1) {
            this.onEventMove = function() {};
            this.onEventResize = function() {};
            this.onResourceExpand = function() {};
            this.onResourceCollapse = function() {};
        };
        this.debugMessages = [];
        this.autoRefreshCount = 0;
        this.innerHeightTree = 0;
        this.rows = [];
        this.timeline = [];
        this.groupline = [];
        this.events = {};
        this.cells = {};
        this.elements = {};
        this.elements.events = [];
        this.elements.bars = [];
        this.elements.cells = [];
        this.elements.linesVertical = [];
        this.elements.separators = [];
        this.elements.range = [];
        this.elements.breaks = [];
        this.cache = {};
        this.cache.cells = [];
        this.cache.linesVertical = [];
        this.cache.timeHeaderGroups = [];
        this.cache.pixels = [];
        this.cache.breaks = [];
        this.cache.events = [];
        this.clientState = {};
        this.nav = {};
        this.$4r = function($c, $d) {
            var $c = eval("(" + $c + ")");
            if ($c.BubbleGuid) {
                var $e = $c.BubbleGuid;
                var $f = this.bubbles[$e];
                delete this.bubbles[$e];
                $b.$4s();
                if (typeof $c.Result.BubbleHTML !== 'undefined') {
                    $f.updateView($c.Result.BubbleHTML, $f);
                };
                return;
            };
            if ($c.CallBackRedirect) {
                document.location.href = $c.CallBackRedirect;
                return;
            };
            if (typeof DayPilot.Bubble !== "undefined") {
                DayPilot.Bubble.hideActive();
            };
            if (typeof $c.ClientState !== 'undefined') {
                $b.clientState = $c.ClientState;
            };
            if ($c.UpdateType === "None") {
                $b.$4s();
                if ($c.Message) {
                    $b.message($c.Message);
                };
                $b.$4t($c.CallBackData, true);
                return;
            };
            if ($c.VsUpdate) {
                var $g = document.createElement("input");
                $g.type = 'hidden';
                $g.name = $b.id + "_vsupdate";
                $g.id = $g.name;
                $g.value = $c.VsUpdate;
                $b.vsph.innerHTML = '';
                $b.vsph.appendChild($g);
            };
            if (typeof $c.TagFields !== 'undefined') {
                $b.tagFields = $c.TagFields;
            };
            if (typeof $c.SortDirections !== 'undefined') {
                $b.sortDirections = $c.SortDirections;
            };
            if ($c.UpdateType === "Full") {
                $b.resources = $c.Resources;
                $b.colors = $c.Colors;
                $b.palette = $c.Palette;
                $b.dirtyColors = $c.DirtyColors;
                $b.cellProperties = $c.CellProperties;
                $b.cellConfig = $c.CellConfig;
                $b.separators = $c.Separators;
                $b.timeHeader = $c.TimeHeader;
                $b.timeHeaders = $c.TimeHeaders;
                if (typeof $c.RowHeaderColumns !== 'undefined') $b.rowHeaderColumns = $c.RowHeaderColumns;
                $b.startDate = $c.StartDate ? new DayPilot.Date($c.StartDate) : $b.startDate;
                $b.days = $c.Days ? $c.Days : $b.days;
                $b.cellDuration = $c.CellDuration ? $c.CellDuration : $b.cellDuration;
                $b.cellGroupBy = $c.CellGroupBy ? $c.CellGroupBy : $b.cellGroupBy;
                $b.cellWidth = $c.CellWidth ? $c.CellWidth : $b.cellWidth;
                $b.viewType = $c.ViewType ? $c.ViewType : $b.viewType;
                $b.hourNameBackColor = $c.HourNameBackColor ? $c.HourNameBackColor : $b.hourNameBackColor;
                $b.showNonBusiness = $c.ShowNonBusiness ? $c.ShowNonBusiness : $b.showNonBusiness;
                $b.businessBeginsHour = $c.BusinessBeginsHour ? $c.BusinessBeginsHour : $b.businessBeginsHour;
                $b.businessEndsHour = $c.BusinessEndsHour ? $c.BusinessEndsHour : $b.businessEndsHour;
                if (typeof $c.DynamicLoading !== 'undefined') $b.dynamicLoading = $c.DynamicLoading;
                if (typeof $c.TreeEnabled !== 'undefined') $b.treeEnabled = $c.TreeEnabled;
                $b.backColor = $c.BackColor ? $c.BackColor : $b.backColor;
                $b.nonBusinessBackColor = $c.NonBusinessBackColor ? $c.NonBusinessBackColor : $b.nonBusinessBackColor;
                $b.locale = $c.Locale ? $c.Locale : $b.locale;
                if (typeof $c.TimeZone !== 'undefined') $b.timeZone = $c.TimeZone;
                $b.timeFormat = $c.TimeFormat ? $c.TimeFormat : $b.timeFormat;
                $b.rowHeaderCols = $c.RowHeaderCols ? $c.RowHeaderCols : $b.rowHeaderCols;
                if (typeof $c.DurationBarMode !== "undefined") $b.durationBarMode = $c.DurationBarMode;
                if (typeof $c.ShowBaseTimeHeader !== "undefined") $b.showBaseTimeHeader = $c.ShowBaseTimeHeader;
                $b.cornerBackColor = $c.CornerBackColor ? $c.CornerBackColor : $b.cornerBackColor;
                if (typeof $c.CornerHTML !== 'undefined') {
                    $b.cornerHtml = $c.CornerHTML;
                };
                $b.hashes = $c.Hashes;
                $b.$4u();
                $b.$4v();
                $b.$4w();
                $b.$4x();
                $b.$4y();
            };
            var $h = $b.$4z($c.Events, $c.Action === "Scroll");
            if ($c.UpdateType === 'Full') {
                $b.$4A();
                $b.$4B();
            };
            $b.$4C();
            $b.$4D();
            if ($c.Action !== "Scroll") {
                $b.$4E();
                $b.$4F();
                if ($b.heightSpec === 'Auto' || $b.heightSpec === 'Max') {
                    $b.$4G();
                };
                $b.$4H();
                $b.$4I();
                $b.$4J();
                $b.multiselect.clear(true);
                $b.multiselect.initList = $c.SelectedEvents;
                $b.$4K();
                $b.$4L();
                $b.$4M();
            } else {
                $b.multiselect.clear(true);
                $b.multiselect.initList = $c.SelectedEvents;
                $b.$4N($h, true);
                $b.$4K();
            };
            if ($b.timeRangeSelectedHandling !== "HoldForever") {
                $b.$4O();
            };
            if ($c.UpdateType === "Full") {
                $b.setScroll($c.ScrollX, $c.ScrollY);
                $b.$4P();
            };
            $b.$4Q();
            $b.$4s();
            if ($c.UpdateType === 'Full' && navigator.appVersion.indexOf("MSIE 7.") !== -1) {
                window.setTimeout(function() {
                    $b.$4A();
                    $b.$4G();
                }, 0);
            };
            $b.$4R();
            if ($c.Message) {
                if ($b.message) {
                    $b.message($c.Message);
                }
            };
            $b.$4t($c.CallBackData, true);
        };
        this.$4Q = function() {
            if ($b.todo) {
                if ($b.todo.del) {
                    var $i = $b.todo.del;
                    $i.parentNode.removeChild($i);
                    $b.todo.del = null;
                }
            }
        };
        this.$4t = function($j, $k) {
            var $l = function($j, $m) {
                return function() {
                    if ($b.$4S()) {
                        if (typeof $b.onAfterRender === 'function') {
                            var $n = {};
                            $n.isCallBack = $m;
                            $n.data = $j;
                            $b.onAfterRender($n);
                        }
                    } else {
                        if ($b.afterRender) {
                            $b.afterRender($j, $m);
                        }
                    }
                };
            };
            window.setTimeout($l($j, $k), 0);
        };
        this.scrollTo = function($o) {
            var $p = this.getPixels(new DayPilot.Date($o)).left;
            this.setScrollX($p);
        };
        this.scrollToResource = function(id) {
            DayPilot.complete(function() {
                var $q = $b.$4T(id);
                if (!$q) {
                    return;
                };
                setTimeout(function() {
                    var scrollY = $q.Top;
                    $b.nav.scroll.scrollTop = scrollY;
                }, 100);
            });
        };
        this.setScrollX = function(scrollX) {
            this.setScroll(scrollX, $b.scrollY);
        };
        this.setScrollY = function(scrollY) {
            this.setScroll($b.scrollX, scrollY);
        };
        this.setScroll = function(scrollX, scrollY) {
            var scroll = $b.nav.scroll;
            var $r = $b.innerHeightTree;
            var $s = $b.$4U() * $b.cellWidth;
            if (scroll.clientWidth + scrollX > $s) {
                scrollX = $s - scroll.clientWidth;
            };
            if (scroll.clientHeight + scrollY > $r) {
                scrollY = $r - scroll.clientHeight;
            };
            $b.divTimeScroll.scrollLeft = scrollX;
            $b.divResScroll.scrollTop = scrollY;
            scroll.scrollLeft = scrollX;
            scroll.scrollTop = scrollY;
        };
        this.message = function($t, $u, $v, $w) {
            if ($t === null) {
                return;
            };
            var $u = $u || this.messageHideAfter || 2000;
            var $v = $v || "#ffffff";
            var $w = $w || "#000000";
            var $x = 0.8;
            var top = this.$4V() + 1;
            var $y = this.$4W() + 1;
            var $z = DayPilot.sw($b.nav.scroll) + 1;
            var $A = DayPilot.sh($b.nav.scroll) + 1;
            var $B;
            if (!this.nav.message) {
                $B = document.createElement("div");
                $B.style.position = "absolute";
                $B.style.left = $y + "px";
                $B.style.right = $z + "px";
                $B.style.display = 'none';
                $B.onmousemove = function() {
                    if ($b.messageTimeout) {
                        clearTimeout($b.messageTimeout);
                    }
                };
                $B.onmouseout = function() {
                    if ($b.nav.message.style.display !== 'none') {
                        $b.messageTimeout = setTimeout($b.$4X, 500);
                    }
                };
                var $C = document.createElement("div");
                $C.onclick = function() {
                    $b.nav.message.style.display = 'none';
                };
                if (!this.cssOnly) {
                    $C.style.padding = "5px";
                    $C.style.opacity = $x;
                    $C.style.filter = "alpha(opacity=" + ($x * 100) + ")";
                } else {
                    $C.className = this.$4Y("_message");
                };
                $B.appendChild($C);
                var close = document.createElement("div");
                close.style.position = "absolute";
                if (!this.cssOnly) {
                    close.style.top = "5px";
                    close.style.right = (DayPilot.sw($b.nav.scroll) + 5) + "px";
                    close.style.color = $v;
                    close.style.lineHeight = "100%";
                    close.style.cursor = "pointer";
                    close.style.fontWeight = "bold";
                    close.innerHTML = "X";
                } else {
                    close.className = this.$4Y("_message_close");
                };
                close.onclick = function() {
                    $b.nav.message.style.display = 'none';
                };
                $B.appendChild(close);
                this.nav.top.appendChild($B);
                this.nav.message = $B;
            };
            var $D = function() {
                var $C = $b.nav.message.firstChild;
                if (!$b.cssOnly) {
                    $C.style.backgroundColor = $w;
                    $C.style.color = $v;
                };
                $C.innerHTML = $t;
                var $z = DayPilot.sw($b.nav.scroll) + 1;
                $b.nav.message.style.right = $z + "px";
                var $E = $b.messageBarPosition || "Top";
                if ($E === "Bottom") {
                    $b.nav.message.style.bottom = $A + "px";
                    $b.nav.message.style.top = "";
                } else if ($E === "Top") {
                    $b.nav.message.style.bottom = "";
                    $b.nav.message.style.top = top + "px";
                };
                var end = function() {
                    $b.messageTimeout = setTimeout($b.$4X, $u);
                };
                DayPilot.fade($b.nav.message, 0.2, end);
            };
            clearTimeout($b.messageTimeout);
            if (this.nav.message.style.display !== 'none') {
                DayPilot.fade($b.nav.message, -0.2, $D);
            } else {
                $D();
            }
        };
        this.$4X = function() {
            var end = function() {
                $b.nav.message.style.display = 'none';
            };
            DayPilot.fade($b.nav.message, -0.2, end);
        };
        this.message.show = function($t) {
            $b.message($t);
        };
        this.message.hide = function() {
            $b.$4X();
        };
        this.$4G = function() {
            if (this.nav.scroll) {
                if (this.heightSpec === 'Parent100Pct') {
                    this.height = parseInt(this.nav.top.clientHeight, 10) - (this.$4V() + 2);
                };
                var $F = this.$4Z();
                var $G = 1;
                var $H = $F + this.$4V() + $G;
                if ($F > 0) {
                    this.nav.scroll.style.height = ($F) + 'px';
                    this.scrollRes.style.height = ($F) + 'px';
                };
                if (this.nav.divider) {
                    this.nav.divider.style.height = ($H) + "px";
                };
                if (this.heightSpec !== "Parent100Pct") {
                    this.nav.top.style.height = ($H) + "px";
                };
                for (var i = 0; i < this.elements.separators.length; i++) {
                    this.elements.separators[i].style.height = this.innerHeightTree + 'px';
                };
                for (var i = 0; i < this.elements.linesVertical.length; i++) {
                    this.elements.linesVertical[i].style.height = this.innerHeightTree + 'px';
                }
            }
        };
        this.$4u = function() {
            this.endDate = (this.viewType !== 'Days') ? this.startDate.addDays(this.days) : this.startDate.addDays(1);
            this.timeline = [];
            this.cache.pixels = [];
            if (this.timeHeader) {
                var $I = this.startDate.getTime();
                var $q = this.timeHeader[this.timeHeader.length - 1];
                for (var i = 0; i < $q.length; i++) {
                    var h = $q[i];
                    var $J = {};
                    $J.start = new DayPilot.Date(h.start);
                    if (h.end) {
                        $J.end = new DayPilot.Date(h.end);
                    } else {
                        $J.end = $J.start.addMinutes(this.cellDuration);
                    };
                    $J.breakBefore = $J.start.ticks !== $I;
                    this.timeline.push($J);
                    $I = $J.end.ticks;
                }
            } else {
                this.timeHeader = [];
                var $K = this.startDate;
                var end = $K.addMinutes(this.cellDuration);
                var $L = false;
                var $M = this.timeHeaders;
                if (!$M) {
                    $M = [{
                        $N: this.cellGroupBy
                    }];
                };
                var $O = [];
                while (end.ticks <= this.endDate.ticks) {
                    if (this.$50($K, end)) {
                        var $J = {};
                        $J.start = $K;
                        $J.end = end;
                        $J.breakBefore = $L;
                        this.timeline.push($J);
                        var h = {};
                        h.start = $K;
                        h.end = end;
                        h.innerHTML = this.$51($K);
                        if (typeof this.onBeforeTimeHeaderRender === 'function') {
                            var $P = {};
                            $P.start = $K;
                            $P.end = end;
                            $P.html = h.innerHTML;
                            $P.tooltip = h.innerHTML;
                            $P.backColor = null;
                            $P.level = $M.length;
                            var $n = {};
                            $n.header = $P;
                            this.onBeforeTimeHeaderRender($n);
                            h.innerHTML = $P.html;
                            h.backColor = $P.backColor;
                            h.toolTip = $P.tooltip;
                        };
                        $O.push(h);
                        $L = false;
                    } else {
                        $L = true;
                    };
                    $K = end;
                    end = $K.addMinutes(this.cellDuration);
                };
                for (var i = 0; i < $M.length; i++) {
                    var $N = $M[i].groupBy;
                    var $K = this.startDate;
                    var $Q = [];
                    var $K = this.startDate;
                    while ($K.ticks < this.endDate.ticks) {
                        var h = {};
                        h.start = $K;
                        h.end = this.$52(h.start, $N);
                        h.left = this.getPixels(h.start).left;
                        var $R = this.getPixels(h.end).left - h.left;
                        h.colspan = Math.ceil($R / (1.0 * this.cellWidth));
                        h.innerHTML = this.$53($K, $N);
                        if ($R > 0) {
                            if (typeof this.onBeforeTimeHeaderRender === 'function') {
                                var $P = {};
                                $P.start = $K;
                                $P.end = end;
                                $P.html = h.innerHTML;
                                $P.toolTip = h.innerHTML;
                                $P.color = null;
                                $P.level = this.timeHeader.length;
                                var $n = {};
                                $n.header = $P;
                                this.onBeforeTimeHeaderRender($n);
                                h.innerHTML = $P.html;
                                h.backColor = $P.color;
                                h.toolTip = $P.toolTip;
                            };
                            $Q.push(h);
                        };
                        $K = h.end;
                    };
                    this.timeHeader.push($Q);
                };
                this.timeHeader.push($O);
            }
        };
        this.$4v = function() {
            this.groupline = [];
            var $S = this.endDate;
            var $P = {};
            var $K = this.startDate;
            while ($K.ticks < $S.ticks) {
                var $P = {};
                $P.start = $K;
                $P.end = this.$52($P.start);
                $P.left = this.getPixels($P.start).left;
                $P.width = this.getPixels($P.end).left - $P.left;
                if ($P.width > 0) {
                    this.groupline.push($P);
                };
                $K = $P.end;
            }
        };
        this.$50 = function($K, end) {
            if (typeof this.onIncludeTimeCell === 'function') {
                var $P = {};
                $P.start = $K;
                $P.end = end;
                $P.visible = true;
                var $n = {};
                $n.cell = $P;
                this.onIncludeTimeCell($n);
                return $P.visible;
            };
            if (this.showNonBusiness) {
                return true;
            };
            if ($K.d.getUTCDay() === 0) {
                return false;
            };
            if ($K.d.getUTCDay() === 6) {
                return false;
            };
            if (this.cellDuration < 60 * 24) {
                var $T = $K.d.getUTCHours();
                $T += $K.d.getUTCMinutes() / 60.0;
                $T += $K.d.getUTCSeconds() / 3600.0;
                $T += $K.d.getUTCMilliseconds() / 3600000.0;
                if ($T < this.businessBeginsHour) {
                    return false;
                };
                if (this.businessEndsHour >= 24) {
                    return true;
                };
                if ($T >= this.businessEndsHour) {
                    return false;
                }
            };
            return true;
        };
        this.getPixels = function($o) {
            var $U = $o.ticks;
            var $V = this.cache.pixels[$U];
            if ($V) {
                return $V;
            };
            var $W = null;
            var $X = 221876841600000;
            if (this.timeline.length === 0 || $U < this.timeline[0].start.ticks) {
                var $c = {};
                $c.cut = false;
                $c.left = 0;
                $c.boxLeft = $c.left;
                $c.boxRight = $c.left;
                $c.i = null;
                return $c;
            };
            for (var i = 0; i < this.timeline.length; i++) {
                var $Y = false;
                var $P = this.timeline[i];
                var $Z = $P.start.ticks;
                var $00 = $P.end.ticks;
                if ($Z < $U && $U < $00) {
                    var $01 = $U - $Z;
                    var $c = {};
                    $c.cut = false;
                    $c.left = i * this.cellWidth + this.$54($P, $01);
                    $c.boxLeft = i * this.cellWidth;
                    $c.boxRight = (i + 1) * this.cellWidth;
                    $c.i = i;
                    break;
                } else if ($Z === $U) {
                    var $c = {};
                    $c.cut = false;
                    $c.left = i * this.cellWidth;
                    $c.boxLeft = $c.left;
                    $c.boxRight = $c.left;
                    $c.i = i;
                    break;
                } else if ($00 === $U) {
                    var $c = {};
                    $c.cut = false;
                    $c.left = (i + 1) * this.cellWidth;
                    $c.boxLeft = $c.left;
                    $c.boxRight = $c.left;
                    $c.i = i + 1;
                    break;
                } else if ($U < $Z && $U > $X) {
                    var $c = {};
                    $c.cut = true;
                    $c.left = i * this.cellWidth;
                    $c.boxLeft = $c.left;
                    $c.boxRight = $c.left;
                    $c.i = i;
                    break;
                };
                $X = $00;
            };
            if (!$c) {
                var $c = {};
                $c.cut = true;
                $c.left = (this.timeline.length) * this.cellWidth;
                $c.boxLeft = $c.left;
                $c.boxRight = $c.left;
                $c.i = null;
            };
            this.cache.pixels[$U] = $c;
            return $c;
        };
        this.getDate = function($y, $02, $03) {
            var $E = this.$55($y);
            if (!$E) {
                return null;
            };
            var x = $E.x;
            var $04 = ($03 && x > 0) ? x - 1 : x;
            if (this.timeline[$04] === null) {
                return null;
            };
            var $K = ($03 && x > 0) ? this.timeline[x - 1].end : this.timeline[x].start;
            if (!$02) {
                return $K;
            } else {
                return $K.addTime(this.$56($E.cell, $E.offset));
            }
        };
        this.$55 = function($p) {
            var $05 = 0;
            var $W = 0;
            for (var i = 0; i < this.timeline.length; i++) {
                var $P = this.timeline[i];
                var $R = $P.width || this.cellWidth;
                $05 += $R;
                if ($p < $05) {
                    var $c = {};
                    $c.x = i;
                    $c.offset = $p - $W;
                    $c.cell = $P;
                    return $c;
                };
                $W = $05;
            };
            var $P = this.timeline[this.timeline.length - 1];
            var $c = {};
            $c.x = this.timeline.length - 1;
            $c.offset = $P.width || this.cellWidth;
            $c.cell = $P;
            return $c;
        };
        this.$54 = function($P, $U) {
            var $R = $P.width || this.cellWidth;
            var $06 = $P.end.ticks - $P.start.ticks;
            return Math.floor(($R * $U) / ($06));
        };
        this.$56 = function($P, $p) {
            var $06 = $P.end.ticks - $P.start.ticks;
            var $R = $P.width || this.cellWidth;
            return Math.floor($p / $R * $06);
        };
        this.$57 = function(ev) {
            if ($07.start) {
                return;
            };
            $08 = {};
            $b.$58(this, ev);
        };
        this.eventClickPostBack = function(e, $j) {
            this.$59('EventClick', e, $j);
        };
        this.eventClickCallBack = function(e, $j) {
            this.$5a('EventClick', e, $j);
        };
        this.$58 = function($B, ev) {
            var e = $B.event;
            var ev = ev || window.event;
            if (typeof(DayPilotBubble) !== 'undefined') {
                DayPilotBubble.hideActive();
            };
            if (!e.client.doubleClickEnabled()) {
                $b.$5b($B, ev.ctrlKey);
                return;
            };
            if (!$b.timeouts) {
                $b.timeouts = [];
            };
            var $09 = function($B, $0a) {
                return function() {
                    $b.$5b($B, $0a);
                };
            };
            $b.timeouts.push(window.setTimeout($09($B, ev.ctrlKey), 300));
        };
        this.$5b = function($B, $0a) {
            var e = $B.event;
            if (!e.client.clickEnabled()) {
                return;
            };
            if ($b.$4S()) {
                var $n = {};
                $n.e = e;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventClick === 'function') {
                    $b.onEventClick($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventClickHandling) {
                    case 'PostBack':
                        $b.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventClickCallBack(e);
                        break;
                    case 'Edit':
                        $b.$5c($B);
                        break;
                    case 'Select':
                        $b.$5d($B, e, $0a);
                        break;
                    case 'ContextMenu':
                        var $0b = e.client.contextMenu();
                        if ($0b) {
                            $0b.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(e);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $b.onEventClicked === 'function') {
                    $b.onEventClicked($n);
                }
            } else {
                switch ($b.eventClickHandling) {
                    case 'PostBack':
                        $b.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventClick(e);
                        break;
                    case 'Edit':
                        $b.$5c($B);
                        break;
                    case 'Select':
                        $b.$5d($B, e, $0a);
                        break;
                    case 'ContextMenu':
                        var $0b = e.client.contextMenu();
                        if ($0b) {
                            $0b.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(e);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                }
            }
        };
        this.setHScrollPosition = function($p) {
            this.nav.scroll.scrollLeft = $p;
        };
        this.getScrollX = function() {
            return this.nav.scroll.scrollLeft;
        };
        this.getHScrollPosition = this.getScrollX;
        this.getScrollY = function() {
            return this.nav.scroll.scrollTop;
        };
        this.$5d = function($B, e, $0a) {
            $b.$5e($B, e, $0a);
        };
        this.eventSelectPostBack = function(e, $0c, $j) {
            var $0d = {};
            $0d.e = e;
            $0d.change = $0c;
            this.$59('EventSelect', $0d, $j);
        };
        this.eventSelectCallBack = function(e, $0c, $j) {
            var $0d = {};
            $0d.e = e;
            $0d.change = $0c;
            this.$5a('EventSelect', $0d, $j);
        };
        this.$5e = function($B, e, $0a) {
            if ($b.$4S()) {
                var m = $b.multiselect;
                m.previous = m.events();
                var $n = {};
                $n.e = e;
                $n.selected = m.isSelected(e);
                $n.ctrl = $0a;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventSelect === 'function') {
                    $b.onEventSelect($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventSelectHandling) {
                    case 'PostBack':
                        $b.eventSelectPostBack(e, $0c);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            __theFormPostData = "";
                            __theFormPostCollection = [];
                            WebForm_InitCallback();
                        };
                        $b.eventSelectCallBack(e, $0c);
                        break;
                    case 'Update':
                        m.$5f($B, $0a);
                        break;
                };
                if (typeof $b.onEventSelected === 'function') {
                    $n.change = m.isSelected(e) ? "selected" : "deselected";
                    $n.selected = m.isSelected(e);
                    $b.onEventSelected($n);
                }
            } else {
                var m = $b.multiselect;
                m.previous = m.events();
                m.$5f($B, $0a);
                var $0c = m.isSelected(e) ? "selected" : "deselected";
                switch ($b.eventSelectHandling) {
                    case 'PostBack':
                        $b.eventSelectPostBack(e, $0c);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            __theFormPostData = "";
                            __theFormPostCollection = [];
                            WebForm_InitCallback();
                        };
                        $b.eventSelectCallBack(e, $0c);
                        break;
                    case 'JavaScript':
                        $b.onEventSelect(e, $0c);
                        break;
                }
            }
        };
        this.eventRightClickPostBack = function(e, $j) {
            this.$59('EventRightClick', e, $j);
        };
        this.eventRightClickCallBack = function(e, $j) {
            this.$5a('EventRightClick', e, $j);
        };
        this.$5g = function(ev) {
            var e = this.event;
            ev = ev || window.event;
            ev.cancelBubble = true;
            if (!this.event.client.rightClickEnabled()) {
                return false;
            };
            if ($b.$4S()) {
                var $n = {};
                $n.e = e;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventRightClick === 'function') {
                    $b.onEventRightClick($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventRightClickHandling) {
                    case 'PostBack':
                        $b.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventRightClickCallBack(e);
                        break;
                    case 'ContextMenu':
                        var $0b = e.client.contextMenu();
                        if ($0b) {
                            $0b.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(this.event);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $b.onEventRightClicked === 'function') {
                    $b.onEventRightClicked($n);
                }
            } else {
                switch ($b.eventRightClickHandling) {
                    case 'PostBack':
                        $b.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventRightClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventRightClick(e);
                        break;
                    case 'ContextMenu':
                        var $0b = e.client.contextMenu();
                        if ($0b) {
                            $0b.show(e);
                        } else {
                            if ($b.contextMenu) {
                                $b.contextMenu.show(this.event);
                            }
                        };
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                }
            };
            return false;
        };
        this.eventDoubleClickPostBack = function(e, $j) {
            this.$59('EventDoubleClick', e, $j);
        };
        this.eventDoubleClickCallBack = function(e, $j) {
            this.$5a('EventDoubleClick', e, $j);
        };
        this.$5h = function(ev) {
            if (typeof(DayPilotBubble) !== 'undefined') {
                DayPilotBubble.hideActive();
            };
            if ($b.timeouts) {
                for (var $0e in $b.timeouts) {
                    window.clearTimeout($b.timeouts[$0e]);
                };
                $b.timeouts = null;
            };
            var ev = ev || window.event;
            var e = this.event;
            if ($b.$4S()) {
                var $n = {};
                $n.e = e;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventDoubleClick === 'function') {
                    $b.onEventDoubleClick($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventDoubleClickHandling) {
                    case 'PostBack':
                        $b.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventDoubleClickCallBack(e);
                        break;
                    case 'Edit':
                        $b.$5c(this);
                        break;
                    case 'Select':
                        $b.$5d($B, e, ev.ctrlKey);
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                };
                if (typeof $b.onEventDoubleClicked === 'function') {
                    $b.onEventDoubleClicked($n);
                }
            } else {
                switch ($b.eventDoubleClickHandling) {
                    case 'PostBack':
                        $b.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.eventDoubleClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onEventDoubleClick(e);
                        break;
                    case 'Edit':
                        $b.$5c(this);
                        break;
                    case 'Select':
                        $b.$5d($B, e, ev.ctrlKey);
                        break;
                    case 'Bubble':
                        if ($b.bubble) {
                            $b.bubble.showEvent(e);
                        };
                        break;
                }
            }
        };
        this.eventResizePostBack = function(e, $0f, $0g, $j) {
            this.$5i("PostBack", e, $0f, $0g, $j);
        };
        this.eventResizeCallBack = function(e, $0f, $0g, $j) {
            this.$5i("CallBack", e, $0f, $0g, $j);
        };
        this.$5i = function($0h, e, $0f, $0g, $j) {
            var $0d = {};
            $0d.e = e;
            $0d.newStart = $0f;
            $0d.newEnd = $0g;
            this.$5j($0h, "EventResize", $0d, $j);
        };
        this.$5k = function(e, $0f, $0g) {
            if (this.eventResizeHandling === 'Disabled') {
                return;
            };
            if ($b.$4S()) {
                var $n = {};
                $n.e = e;
                $n.newStart = $0f;
                $n.newEnd = $0g;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventResize === 'function') {
                    $b.onEventResize($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventResizeHandling) {
                    case 'PostBack':
                        $b.eventResizePostBack(e, $0f, $0g);
                        break;
                    case 'CallBack':
                        $b.eventResizeCallBack(e, $0f, $0g);
                        break;
                    case 'Notify':
                        $b.eventResizeNotify(e, $0f, $0g);
                        break;
                    case 'Update':
                        e.start($0f);
                        e.end($0g);
                        $b.events.update(e);
                        break;
                };
                if (typeof $b.onEventResized === 'function') {
                    $b.onEventResized($n);
                }
            } else {
                switch ($b.eventResizeHandling) {
                    case 'PostBack':
                        $b.eventResizePostBack(e, $0f, $0g);
                        break;
                    case 'CallBack':
                        $b.eventResizeCallBack(e, $0f, $0g);
                        break;
                    case 'JavaScript':
                        $b.onEventResize(e, $0f, $0g);
                        break;
                    case 'Notify':
                        $b.eventResizeNotify(e, $0f, $0g);
                        break;
                    case 'Update':
                        e.start($0f);
                        e.end($0g);
                        $b.events.update(e);
                        break;
                }
            }
        };
        this.eventMovePostBack = function(e, $0f, $0g, $0i, $j, $Q) {
            this.$5l("PostBack", e, $0f, $0g, $0i, $j, $Q);
        };
        this.eventMoveCallBack = function(e, $0f, $0g, $0i, $j, $Q) {
            this.$5l("CallBack", e, $0f, $0g, $0i, $j, $Q);
        };
        this.$5l = function($0h, e, $0f, $0g, $0i, $j, $Q) {
            var $0d = {};
            $0d.e = e;
            $0d.newStart = $0f;
            $0d.newEnd = $0g;
            $0d.newResource = $0i;
            $0d.position = $Q;
            this.$5j($0h, "EventMove", $0d, $j);
        };
        this.$5j = function($0h, $0j, $0d, $j) {
            if ($0h === 'PostBack') {
                $b.$59($0j, $0d, $j);
            } else if ($0h === 'CallBack') {
                $b.$5a($0j, $0d, $j, "CallBack");
            } else if ($0h === 'Immediate') {
                $b.$5a($0j, $0d, $j, "Notify");
            } else if ($0h === 'Queue') {
                $b.queue.add(new DayPilot.Action(this, $0j, $0d, $j));
            } else if ($0h === 'Notify') {
                if ($0k.notifyType() === 'Notify') {
                    $b.$5a($0j, $0d, $j, "Notify");
                } else {
                    $b.queue.add(new DayPilot.Action($b, $0j, $0d, $j));
                }
            } else {
                throw "Invalid event invocation type";
            }
        };
        this.eventMoveNotify = function(e, $0f, $0g, $0i, $j, $Q) {
            var $0l = new DayPilot.Event(e.copy(), this);
            var $0m = $b.events.$5m(e.data);
            e.start($0f);
            e.end($0g);
            e.resource($0i);
            e.commit();
            $0m = $0m.concat($b.events.$5n(e.data));
            $b.$5o($0m);
            $b.$5p();
            $b.$4N($0m);
            this.$5l("Notify", $0l, $0f, $0g, $0i, $j, $Q);
        };
        this.eventResizeNotify = function(e, $0f, $0g, $j) {
            var $0l = new DayPilot.Event(e.copy(), this);
            var $0m = $b.events.$5m(e.data);
            e.start($0f);
            e.end($0g);
            e.commit();
            $0m = $0m.concat($b.events.$5n(e.data));
            $b.$5o($0m);
            $b.$5p();
            $b.$4N($0m);
            this.$5i("Notify", $0l, $0f, $0g, $j);
        };
        this.multiselect = {};
        this.multiselect.initList = [];
        this.multiselect.list = [];
        this.multiselect.divs = [];
        this.multiselect.previous = [];
        this.multiselect.$5q = function() {
            var m = $b.multiselect;
            return DayPilot.JSON.stringify(m.events());
        };
        this.multiselect.events = function() {
            var m = $b.multiselect;
            var $0n = [];
            $0n.ignoreToJSON = true;
            for (var i = 0; i < m.list.length; i++) {
                $0n.push(m.list[i]);
            };
            return $0n;
        };
        this.multiselect.$5r = function() {};
        this.multiselect.$5f = function($B, $0o) {
            var m = $b.multiselect;
            if (m.isSelected($B.event)) {
                if ($b.allowMultiSelect) {
                    if ($0o) {
                        m.remove($B.event, true);
                    } else {
                        var $0p = m.list.length;
                        m.clear();
                        if ($0p > 1) {
                            m.add($B.event, true);
                        }
                    }
                } else {
                    m.clear();
                }
            } else {
                if ($b.allowMultiSelect) {
                    if ($0o) {
                        m.add($B.event, true);
                    } else {
                        m.clear();
                        m.add($B.event, true);
                    }
                } else {
                    m.clear();
                    m.add($B.event, true);
                }
            };
            m.$5s($B);
            m.$5r();
        };
        this.multiselect.$5t = function(ev) {
            var m = $b.multiselect;
            return m.$5u(ev, m.initList);
        };
        this.multiselect.$5v = function() {
            var m = $b.multiselect;
            var $0q = [];
            for (var i = 0; i < m.list.length; i++) {
                var event = m.list[i];
                $0q.push(event.value());
            };
            alert($0q.join("\n"));
        };
        this.multiselect.add = function(ev, $0r) {
            var m = $b.multiselect;
            if (m.indexOf(ev) === -1) {
                m.list.push(ev);
            };
            if ($0r) {
                return;
            };
            m.redraw();
        };
        this.multiselect.remove = function(ev, $0r) {
            var m = $b.multiselect;
            var i = m.indexOf(ev);
            if (i !== -1) {
                m.list.splice(i, 1);
            };
            if ($0r) {
                return;
            };
            m.redraw();
        };
        this.multiselect.clear = function($0r) {
            var m = $b.multiselect;
            m.list = [];
            if ($0r) {
                return;
            };
            m.redraw();
        };
        this.multiselect.redraw = function() {
            var m = $b.multiselect;
            for (var i = 0; i < $b.elements.events.length; i++) {
                var $B = $b.elements.events[i];
                if (m.isSelected($B.event)) {
                    m.$5w($B);
                } else {
                    m.$5x($B);
                }
            }
        };
        this.multiselect.$5y = function(ev) {
            var m = $b.multiselect;
            var $B = null;
            for (var i = 0; i < $b.elements.events.length; i++) {
                if (m.isSelected($b.elements.events[i].event)) {
                    $B = $b.elements.events[i];
                    break;
                }
            };
            m.$5s($B);
        };
        this.multiselect.$5s = function($B) {
            if (!$B) {
                return;
            };
            var m = $b.multiselect;
            if (m.isSelected($B.event)) {
                m.$5w($B);
            } else {
                m.$5x($B);
            }
        };
        this.multiselect.$5w = function($B) {
            var m = $b.multiselect;
            var cn = $b.cssOnly ? $b.$4Y("_selected") : $b.$4Y("selected");
            var $B = m.$5z($B);
            DayPilot.Util.addClass($B, cn);
            m.divs.push($B);
        };
        this.multiselect.$5z = function($B) {
            return $B;
        };
        this.multiselect.$5A = function() {
            var m = $b.multiselect;
            for (var i = 0; i < m.divs.length; i++) {
                var $B = m.divs[i];
                m.$5x($B, true);
            };
            m.divs = [];
        };
        this.multiselect.$5x = function($B, $0s) {
            var m = $b.multiselect;
            var cn = $b.cssOnly ? $b.$4Y("_selected") : $b.$4Y("selected");
            DayPilot.Util.removeClass($B, cn);
            if ($0s) {
                return;
            };
            var i = DayPilot.indexOf(m.divs, $B);
            if (i !== -1) {
                m.divs.splice(i, 1);
            }
        };
        this.multiselect.isSelected = function(ev) {
            return $b.multiselect.$5u(ev, $b.multiselect.list);
        };
        this.multiselect.indexOf = function(ev) {
            return DayPilot.indexOf($b.multiselect.list, ev);
        };
        this.multiselect.$5u = function(e, $0q) {
            if (!$0q) {
                return false;
            };
            for (var i = 0; i < $0q.length; i++) {
                var ei = $0q[i];
                if (e === ei) {
                    return true;
                };
                if (typeof ei.value === 'function') {
                    if (ei.value() !== null && e.value() !== null && ei.value() === e.value()) {
                        return true;
                    };
                    if (ei.value() === null && e.value() === null && ei.recurrentMasterId() === e.recurrentMasterId() && e.start().toStringSortable() === ei.start()) {
                        return true;
                    }
                } else {
                    if (ei.value !== null && e.value() !== null && ei.value === e.value()) {
                        return true;
                    };
                    if (ei.value === null && e.value() === null && ei.recurrentMasterId === e.recurrentMasterId() && e.start().toStringSortable() === ei.start) {
                        return true;
                    }
                }
            };
            return false;
        };
        this.update = function() {
            var $0t = true;
            if ($0t) {
                $b.timeHeader = null;
                $b.$4u();
                $b.$4v();
                $b.$4w();
                $b.$4x();
            };
            this.$4z();
            if ($0t) {
                $b.$4A();
                $b.$4B();
            };
            $b.$4D();
            $b.$4E();
            $b.$4F();
            if ($b.heightSpec === 'Auto' || $b.heightSpec === 'Max') {
                $b.$4G();
            };
            this.$4I();
            this.$4J();
            this.$4H();
            this.$4K();
            this.$4L();
            this.$4M();
        };
        this.updateDebug = function() {
            var $0t = true;
            if ($0t) {
                $b.$4u();
                $b.$4v();
                $b.$4w();
                $b.$4x();
            };
            this.$4z();
            if ($0t) {
                $b.$4A();
                $b.$4B();
            };
            $b.$4D();
            $b.$4E();
            $b.$4F();
            if ($b.heightSpec === 'Auto' || $b.heightSpec === 'Max') {
                $b.$4G();
            };
            this.$4I();
            this.$4J();
            this.$4H();
            this.$4K();
            this.$4L();
            this.$4M();
        };
        this.$4N = function($0m, $0u) {
            var $K, end;
            $0m = DayPilot.ua($0m);
            if (this.rowsDirty) {
                var $0v = this.$4E();
                this.$4D();
                this.$4H();
                this.$4J();
                for (var i = 0; i < $0m.length; i++) {
                    var ri = $0m[i];
                    this.$5B(ri);
                };
                for (var i = 0; i < $0m.length; i++) {
                    var ri = $0m[i];
                    this.$5C(ri);
                };
                this.$4K();
                this.$4L();
                this.$5D();
            } else {
                var $0w = true;
                if ($0w) {
                    var $0x = function(i) {
                        if (i >= $0m.length) {
                            return;
                        };
                        var ri = $0m[i];
                        if (!$0u) {
                            $b.$5B(ri);
                        };
                        $b.$5C(ri);
                        if (i + 1 < $0m.length) {
                            setTimeout(function() {
                                $0x(i + 1);
                            }, 10);
                        }
                    };
                    $0x(0);
                } else {
                    for (var i = 0; i < $0m.length; i++) {
                        var ri = $0m[i];
                        if (!$0u) {
                            this.$5B(ri);
                        };
                        this.$5C(ri);
                    }
                }
            }
        };
        this.$5E = function(e, $0f, $0g, $0i, external, ev, $Q) {
            if ($b.eventMoveHandling === 'Disabled') {
                return;
            };
            if ($b.$4S()) {
                var $n = {};
                $n.e = e;
                $n.newStart = $0f;
                $n.newEnd = $0g;
                $n.newResource = $0i;
                $n.external = external;
                $n.ctrl = false;
                if (ev) {
                    $n.ctrl = ev.ctrlKey;
                };
                $n.shift = false;
                if (ev) {
                    $n.shift = ev.shiftKey;
                };
                $n.position = $Q;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventMove === 'function') {
                    $b.onEventMove($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventMoveHandling) {
                    case 'PostBack':
                        $b.eventMovePostBack(e, $0f, $0g, $0i, null, $Q);
                        break;
                    case 'CallBack':
                        $b.eventMoveCallBack(e, $0f, $0g, $0i, null, $Q);
                        break;
                    case 'Notify':
                        $b.eventMoveNotify(e, $0f, $0g, $0i, null, $Q);
                        break;
                    case 'Update':
                        e.start($0f);
                        e.end($0g);
                        e.resource($0i);
                        if (external) {
                            e.commit();
                            $b.events.add(e);
                        } else {
                            $b.events.update(e);
                        };
                        $b.$4Q();
                        break;
                };
                if (typeof $b.onEventMoved === 'function') {
                    $b.onEventMoved($n);
                }
            } else {
                switch ($b.eventMoveHandling) {
                    case 'PostBack':
                        $b.eventMovePostBack(e, $0f, $0g, $0i, null, $Q);
                        break;
                    case 'CallBack':
                        $b.eventMoveCallBack(e, $0f, $0g, $0i, null, $Q);
                        break;
                    case 'JavaScript':
                        $b.onEventMove(e, $0f, $0g, $0i, external, ev ? ev.ctrlKey : false, ev ? ev.shiftKey : false, $Q);
                        break;
                    case 'Notify':
                        $b.eventMoveNotify(e, $0f, $0g, $0i, null, $Q);
                        break;
                    case 'Update':
                        e.start($0f);
                        e.end($0g);
                        e.resource($0i);
                        $b.events.update(e);
                        break;
                }
            }
        };
        this.$5F = function($n, $f) {
            var $e = $b.$5G($f);
            var $0d = {};
            $0d.args = $n;
            $0d.guid = $e;
            $b.$5a("Bubble", $0d);
        };
        this.$5G = function($f) {
            var $e = DayPilot.guid();
            if (!this.bubbles) {
                this.bubbles = [];
            };
            this.bubbles[$e] = $f;
            return $e;
        };
        this.eventMenuClickPostBack = function(e, $0y, $j) {
            var $0d = {};
            $0d.e = e;
            $0d.command = $0y;
            this.$59('EventMenuClick', $0d, $j);
        };
        this.eventMenuClickCallBack = function(e, $0y, $j) {
            var $0d = {};
            $0d.e = e;
            $0d.command = $0y;
            this.$5a('EventMenuClick', $0d, $j);
        };
        this.$5H = function($0y, e, $0z) {
            switch ($0z) {
                case 'PostBack':
                    $b.eventMenuClickPostBack(e, $0y);
                    break;
                case 'CallBack':
                    $b.eventMenuClickCallBack(e, $0y);
                    break;
            }
        };
        this.timeRangeSelectedPostBack = function($K, end, $0A, $j) {
            var $0B = {};
            $0B.start = $K;
            $0B.end = end;
            $0B.resource = $0A;
            this.$59('TimeRangeSelected', $0B, $j);
        };
        this.timeRangeSelectedCallBack = function($K, end, $0A, $j) {
            var $0B = {};
            $0B.start = $K;
            $0B.end = end;
            $0B.resource = $0A;
            this.$5a('TimeRangeSelected', $0B, $j);
        };
        this.$5I = function($K, end, $0A) {
            if ($b.timeRangeSelectedHandling === 'Disabled') {
                return;
            };
            if ($b.$4S()) {
                var $n = {};
                $n.start = $K;
                $n.end = end;
                $n.resource = $0A;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onTimeRangeSelect === 'function') {
                    $b.onTimeRangeSelect($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $b.timeRangeSelectedPostBack($K, end, $0A);
                        break;
                    case 'CallBack':
                        $b.timeRangeSelectedCallBack($K, end, $0A);
                        break;
                };
                if (typeof $b.onTimeRangeSelected === 'function') {
                    $b.onTimeRangeSelected($n);
                }
            } else {
                switch ($b.timeRangeSelectedHandling) {
                    case 'PostBack':
                        $b.timeRangeSelectedPostBack($K, end, $0A);
                        break;
                    case 'CallBack':
                        $b.timeRangeSelectedCallBack($K, end, $0A);
                        break;
                    case 'JavaScript':
                        $b.onTimeRangeSelected($K, end, $0A);
                        break;
                    case 'Hold':
                        break;
                }
            }
        };
        this.timeRangeDoubleClickPostBack = function($K, end, $0A, $j) {
            var $0B = {};
            $0B.start = $K;
            $0B.end = end;
            $0B.resource = $0A;
            this.$59('TimeRangeDoubleClick', $0B, $j);
        };
        this.timeRangeDoubleClickCallBack = function($K, end, $0A, $j) {
            var $0B = {};
            $0B.start = $K;
            $0B.end = end;
            $0B.resource = $0A;
            this.$5a('TimeRangeDoubleClick', $0B, $j);
        };
        this.$5J = function($K, end, $0A) {
            if ($b.$4S()) {
                var $n = {};
                $n.start = $K;
                $n.end = end;
                $n.resource = $0A;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onTimeRangeDoubleClick === 'function') {
                    $b.onTimeRangeDoubleClick($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        $b.timeRangeDoubleClickPostBack($K, end, $0A);
                        break;
                    case 'CallBack':
                        $b.timeRangeDoubleClickCallBack($K, end, $0A);
                        break;
                };
                if (typeof $b.onTimeRangeDoubleClicked === 'function') {
                    $b.onTimeRangeDoubleClicked($n);
                }
            } else {
                switch ($b.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        $b.timeRangeDoubleClickPostBack($K, end, $0A);
                        break;
                    case 'CallBack':
                        $b.timeRangeDoubleClickCallBack($K, end, $0A);
                        break;
                    case 'JavaScript':
                        $b.onTimeRangeDoubleClick($K, end, $0A);
                        break;
                }
            }
        };
        this.timeRangeMenuClickPostBack = function(e, $0y, $j) {
            var $0d = {};
            $0d.selection = e;
            $0d.command = $0y;
            this.$59("TimeRangeMenuClick", $0d, $j);
        };
        this.timeRangeMenuClickCallBack = function(e, $0y, $j) {
            var $0d = {};
            $0d.selection = e;
            $0d.command = $0y;
            this.$5a("TimeRangeMenuClick", $0d, $j);
        };
        this.$5K = function($0y, e, $0z) {
            switch ($0z) {
                case 'PostBack':
                    $b.timeRangeMenuClickPostBack(e, $0y);
                    break;
                case 'CallBack':
                    $b.timeRangeMenuClickCallBack(e, $0y);
                    break;
            }
        };
        this.resourceHeaderMenuClickPostBack = function(e, $0y, $j) {
            var $0d = {};
            $0d.resource = e;
            $0d.command = $0y;
            this.$59("ResourceHeaderMenuClick", $0d, $j);
        };
        this.resourceHeaderMenuClickCallBack = function(e, $0y, $j) {
            var $0d = {};
            $0d.resource = e;
            $0d.command = $0y;
            this.$5a("ResourceHeaderMenuClick", $0d, $j);
        };
        this.$5L = function($0y, e, $0z) {
            switch ($0z) {
                case 'PostBack':
                    $b.resourceHeaderMenuClickPostBack(e, $0y);
                    break;
                case 'CallBack':
                    $b.resourceHeaderMenuClickCallBack(e, $0y);
                    break;
            }
        };
        this.resourceHeaderClickPostBack = function(e, $j) {
            var $0d = {};
            $0d.resource = e;
            this.$59("ResourceHeaderClick", $0d, $j);
        };
        this.resourceHeaderClickCallBack = function(e, $j) {
            var $0d = {};
            $0d.resource = e;
            this.$5a("ResourceHeaderClick", $0d, $j);
        };
        this.$5M = function(e) {
            if ($b.$4S()) {
                var $n = {};
                $n.resource = e;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onResourceHeaderClick === 'function') {
                    $b.onResourceHeaderClick($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch (this.resourceHeaderClickHandling) {
                    case 'PostBack':
                        $b.resourceHeaderClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.resourceHeaderClickCallBack(e);
                        break;
                };
                if (typeof $b.onResourceHeaderClicked === 'function') {
                    $b.onResourceHeaderClicked($n);
                }
            } else {
                switch (this.resourceHeaderClickHandling) {
                    case 'PostBack':
                        $b.resourceHeaderClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.resourceHeaderClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onResourceHeaderClick(e);
                        break;
                }
            }
        };
        this.timeHeaderClickPostBack = function(e, $j) {
            var $0d = {};
            $0d.header = e;
            this.$59("TimeHeaderClick", $0d, $j);
        };
        this.timeHeaderClickCallBack = function(e, $j) {
            var $0d = {};
            $0d.header = e;
            this.$5a("TimeHeaderClick", $0d, $j);
        };
        this.$5N = function(e) {
            if ($b.$4S()) {
                var $n = {};
                $n.header = e;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onTimeHeaderClick === 'function') {
                    $b.onTimeHeaderClick($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch (this.timeHeaderClickHandling) {
                    case 'PostBack':
                        $b.timeHeaderClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.timeHeaderClickCallBack(e);
                        break;
                };
                if (typeof $b.onTimeHeaderClicked === 'function') {
                    $b.onTimeHeaderClicked($n);
                }
            } else {
                switch (this.timeHeaderClickHandling) {
                    case 'PostBack':
                        $b.timeHeaderClickPostBack(e);
                        break;
                    case 'CallBack':
                        $b.timeHeaderClickCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onTimeHeaderClick(e);
                        break;
                }
            }
        };
        this.resourceCollapsePostBack = function(e, $j) {
            var $0d = {};
            $0d.resource = e;
            this.$59("ResourceCollapse", $0d, $j);
        };
        this.resourceCollapseCallBack = function(e, $j) {
            var $0d = {};
            $0d.resource = e;
            this.$5a("ResourceCollapse", $0d, $j);
        };
        this.$5O = function(e) {
            if ($b.$4S()) {
                var $n = {};
                $n.resource = e;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onResourceCollapse === 'function') {
                    $b.onResourceCollapse($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch (this.resourceCollapseHandling) {
                    case 'PostBack':
                        $b.resourceCollapsePostBack(e);
                        break;
                    case 'CallBack':
                        $b.resourceCollapseCallBack(e);
                        break;
                }
            } else {
                switch (this.resourceCollapseHandling) {
                    case 'PostBack':
                        $b.resourceCollapsePostBack(e);
                        break;
                    case 'CallBack':
                        $b.resourceCollapseCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onResourceCollapse(e);
                        break;
                }
            }
        };
        this.resourceExpandPostBack = function(e, $j) {
            var $0d = {};
            $0d.resource = e;
            this.$59("ResourceExpand", $0d, $j);
        };
        this.resourceExpandCallBack = function(e, $j) {
            var $0d = {};
            $0d.resource = e;
            this.$5a("ResourceExpand", $0d, $j);
        };
        this.$5P = function(e) {
            if ($b.$4S()) {
                var $n = {};
                $n.resource = e;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onResourceExpand === 'function') {
                    $b.onResourceExpand($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch (this.resourceExpandHandling) {
                    case 'PostBack':
                        $b.resourceExpandPostBack(e);
                        break;
                    case 'CallBack':
                        $b.resourceExpandCallBack(e);
                        break;
                }
            } else {
                switch (this.resourceExpandHandling) {
                    case 'PostBack':
                        $b.resourceExpandPostBack(e);
                        break;
                    case 'CallBack':
                        $b.resourceExpandCallBack(e);
                        break;
                    case 'JavaScript':
                        $b.onResourceExpand(e);
                        break;
                }
            }
        };
        this.eventEditPostBack = function(e, $0C, $j) {
            var $0d = {};
            $0d.e = e;
            $0d.newText = $0C;
            this.$59("EventEdit", $0d, $j);
        };
        this.eventEditCallBack = function(e, $0C, $j) {
            var $0d = {};
            $0d.e = e;
            $0d.newText = $0C;
            this.$5a("EventEdit", $0d, $j);
        };
        this.$5Q = function(e, $0C) {
            if ($b.$4S()) {
                var $n = {};
                $n.e = e;
                $n.newText = $0C;
                $n.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                if (typeof $b.onEventEdit === 'function') {
                    $b.onEventEdit($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                };
                switch ($b.eventEditHandling) {
                    case 'PostBack':
                        $b.eventEditPostBack(e, $0C);
                        break;
                    case 'CallBack':
                        $b.eventEditCallBack(e, $0C);
                        break;
                    case 'Update':
                        e.text($0C);
                        $b.events.update(e);
                        break;
                };
                if (typeof $b.onEventEdited === 'function') {
                    $b.onEventEdited($n);
                    if ($n.preventDefault.value) {
                        return;
                    }
                }
            } else {
                switch ($b.eventEditHandling) {
                    case 'PostBack':
                        $b.eventEditPostBack(e, $0C);
                        break;
                    case 'CallBack':
                        $b.eventEditCallBack(e, $0C);
                        break;
                    case 'JavaScript':
                        $b.onEventEdit(e, $0C);
                        break;
                }
            }
        };
        this.commandCallBack = function($0y, $j) {
            this.$5R("CallBack", $0y, $j);
        };
        this.commandPostBack = function($0y, $j) {
            this.$5R("PostBack", $0y, $j);
        };
        this.$5R = function($0h, $0y, $j) {
            var $0d = {};
            $0d.command = $0y;
            this.$5j($0h, "Command", $0d, $j);
        };
        this.$59 = function($0j, $0D, $j) {
            var $0E = {};
            $0E.action = $0j;
            $0E.type = "PostBack";
            $0E.parameters = $0D;
            $0E.data = $j;
            $0E.header = this.$5S();
            var $0F = "JSON" + DayPilot.JSON.stringify($0E);
            __doPostBack($b.uniqueID, $0F);
        };
        this.$5a = function($0j, $0D, $j, $0h) {
            if (this.callbackTimeout) {
                window.clearTimeout(this.callbackTimeout);
            };
            if (typeof $0h === 'undefined') {
                $0h = "CallBack";
            };
            this.$5T();
            this.callbackTimeout = window.setTimeout(function() {
                $b.$5U();
            }, 100);
            var $0E = {};
            $0E.action = $0j;
            $0E.type = $0h;
            $0E.parameters = $0D;
            $0E.data = $j;
            $0E.header = this.$5S();
            var $0G = DayPilot.JSON.stringify($0E);
            var $0F;
            if (typeof Iuppiter !== 'undefined' && Iuppiter.compress) {
                $0F = "LZJB" + Iuppiter.Base64.encode(Iuppiter.compress($0G));
            } else {
                $0F = "JSON" + $0G;
            };
            var $d = null;
            if (this.backendUrl) {
                DayPilot.request(this.backendUrl, this.$5V, $0F, this.$5W);
            } else if (typeof WebForm_DoCallback === 'function') {
                WebForm_DoCallback(this.uniqueID, $0F, this.$4r, $d, this.callbackError, true);
            }
        };
        this.$5X = function() {
            if (this.backendUrl) {
                return true;
            };
            if (typeof WebForm_DoCallback === 'function' && this.uniqueID) {
                return true;
            };
            return false;
        };
        this.$5W = function($0H) {
            if (typeof $b.onAjaxError === 'function') {
                var $n = {};
                $n.request = $0H;
                $b.onAjaxError($n);
            } else if (typeof $b.ajaxError === 'function') {
                $b.ajaxError($0H);
            }
        };
        this.$5V = function($0I) {
            $b.$4r($0I.responseText);
        };
        this.$5S = function() {
            var h = {};
            h.v = this.v;
            h.control = "dps";
            h.id = this.id;
            h.startDate = $b.startDate;
            h.days = $b.days;
            h.cellDuration = $b.cellDuration;
            h.cellGroupBy = $b.cellGroupBy;
            h.cellWidth = $b.cellWidth;
            h.viewType = $b.viewType;
            h.hourNameBackColor = $b.hourNameBackColor;
            h.showNonBusiness = $b.showNonBusiness;
            h.businessBeginsHour = $b.businessBeginsHour;
            h.businessEndsHour = $b.businessEndsHour;
            h.weekStarts = $b.weekStarts;
            h.treeEnabled = $b.treeEnabled;
            h.backColor = $b.cellBackColor;
            h.nonBusinessBackColor = $b.cellBackColorNonBusiness;
            h.locale = $b.locale;
            h.timeZone = $b.timeZone;
            h.tagFields = $b.tagFields;
            h.timeHeaders = $b.timeHeaders;
            h.cssOnly = $b.cssOnly;
            h.cssClassPrefix = $b.cssClassPrefix;
            h.durationBarMode = $b.durationBarMode;
            h.showBaseTimeHeader = $b.showBaseTimeHeader;
            h.rowHeaderColumns = $b.rowHeaderColumns;
            h.clientState = $b.clientState;
            if (this.nav.scroll) {
                h.scrollX = this.nav.scroll.scrollLeft;
                h.scrollY = this.nav.scroll.scrollTop;
            };
            h.selected = $b.multiselect.events();
            h.hashes = $b.hashes;
            var $0J = $b.$5Y(h.scrollX, h.scrollY);
            var $0B = $b.$5Z($0J);
            var $0K = $b.$60($0J);
            h.rangeStart = $0B.start;
            h.rangeEnd = $0B.end;
            h.resources = $0K;
            h.dynamicLoading = $b.dynamicLoading;
            if (this.syncResourceTree) {
                h.tree = this.$61();
            };
            return h;
        };
        this.getViewPort = function() {
            var scrollX = this.nav.scroll.scrollLeft;
            var scrollY = this.nav.scroll.scrollTop;
            var $0J = this.$5Y(scrollX, scrollY);
            var $0B = this.$5Z($0J);
            var $0L = this.$60($0J);
            var $c = {};
            $c.start = $0B.start;
            $c.end = $0B.end;
            $c.resources = $0L;
            return $c;
        };
        this.$5Y = function(scrollX, scrollY) {
            var $0J = {};
            $0J.start = {};
            $0J.end = {};
            $0J.start.x = Math.floor(scrollX / $b.cellWidth);
            $0J.end.x = Math.floor((scrollX + $b.nav.scroll.clientWidth) / $b.cellWidth);
            $0J.start.y = $b.$62(scrollY).i;
            $0J.end.y = $b.$62(scrollY + $b.nav.scroll.clientHeight).i;
            var $0M = this.timeline.length;
            if ($0J.end.x >= $0M) {
                $0J.end.x = $0M - 1;
            };
            return $0J;
        };
        this.$5Z = function($0J) {
            var $c = {};
            if (this.timeline.length <= 0) {
                $c.start = this.startDate;
                $c.end = this.startDate;
                return $c;
            };
            if (!this.timeline[$0J.start.x]) {
                throw 'Internal error: area.start.x is null.';
            };
            $c.start = this.timeline[$0J.start.x].start;
            $c.end = this.timeline[$0J.end.x].end;
            return $c;
        };
        this.$60 = function($0J) {
            if (!$0J) {
                var $0J = this.$5Y(this.nav.scroll.scrollLeft, this.nav.scroll.scrollTop);
            };
            var $0K = [];
            $0K.ignoreToJSON = true;
            for (var i = $0J.start.y; i <= $0J.end.y; i++) {
                var r = $b.rows[i];
                if (r && !r.Hidden) {
                    $0K.push(r.Value);
                }
            };
            return $0K;
        };
        this.$61 = function() {
            var $0N = [];
            $0N.ignoreToJSON = true;
            for (var i = 0; i < this.rows.length; i++) {
                if (this.rows[i].Level > 0) {
                    continue;
                };
                var $0O = this.$63(i);
                $0N.push($0O);
            };
            return $0N;
        };
        this.$64 = function($0P) {
            var $0Q = [];
            $0Q.ignoreToJSON = true;
            for (var i = 0; i < $0P.length; i++) {
                $0Q.push(this.$63($0P[i]));
            };
            return $0Q;
        };
        this.$63 = function(i) {
            var $q = this.rows[i];
            var $0O = {};
            $0O.Value = $q.Value;
            $0O.BackColor = $q.BackColor;
            $0O.Name = $q.Name;
            $0O.InnerHTML = $q.InnerHTML;
            $0O.ToolTip = $q.ToolTip;
            $0O.Expanded = $q.Expanded;
            $0O.Children = this.$64($q.Children);
            $0O.Loaded = $q.Loaded;
            $0O.IsParent = $q.IsParent;
            $0O.Columns = this.$65($q);
            if ($q.MinHeight !== $b.rowMinHeight) {
                $0O.MinHeight = $q.MinHeight;
            };
            if ($q.MarginBottom !== $b.rowMarginBottom) {
                $0O.MarginBottom = $q.MarginBottom;
            };
            return $0O;
        };
        this.$65 = function($q) {
            if (!$q.Columns || $q.Columns.length === 0) {
                return null;
            };
            var $0R = [];
            $0R.ignoreToJSON = true;
            for (var i = 0; i < $q.Columns.length; i++) {
                var c = {};
                c.InnerHTML = $q.Columns[i].html;
                $0R.push(c);
            };
            return $0R;
        };
        this.$4Y = function($0S) {
            if (this.cssClassPrefix) {
                return this.cssClassPrefix + $0S;
            } else {
                return "";
            }
        };
        this.$66 = function() {
            var $0T = document.getElementById(id);
            $0T.dispose = this.dispose;
        };
        this.dispose = function() {
            var c = $b;
            if (!c.nav.top) {
                return;
            };
            c.$5T();
            c.$4I();
            c.divBreaks = null;
            c.divCells = null;
            c.divCorner = null;
            c.divCrosshair = null;
            c.divEvents = null;
            c.divHeader = null;
            c.divLines = null;
            c.divNorth = null;
            c.divRange = null;
            c.divResScroll = null;
            c.divSeparators = null;
            c.divSeparatorsAbove = null;
            c.divStretch = null;
            c.divTimeScroll = null;
            c.scrollRes = null;
            c.vsph = null;
            c.maind = null;
            c.nav.loading = null;
            c.nav.top.onmousemove = null;
            c.nav.top.dispose = null;
            c.nav.top.ontouchstart = null;
            c.nav.top.ontouchmove = null;
            c.nav.top.ontouchend = null;
            c.nav.top.removeAttribute('style');
            c.nav.top.removeAttribute('class');
            c.nav.top.innerHTML = "";
            c.nav.top.dp = null;
            c.nav.top = null;
            c.nav.scroll.onscroll = null;
            c.nav.scroll.root = null;
            c.nav.scroll = null;
            DayPilot.ue(window, 'resize', c.$67);
            DayPilotScheduler.unregister(c);
        };
        this.$68 = function($0U, $0h) {
            var $0V = $b.maind;
            var $0W = $b.$69($0U);
            var event = $0U.event;
            var $F = event.part.height || $b.eventHeight;
            var top = (event.part && event.part.top) ? (event.part.top + $b.rows[event.part.dayIndex].Top) : $0W.top;
            var $0X = document.createElement('div');
            $0X.setAttribute('unselectable', 'on');
            $0X.style.position = 'absolute';
            $0X.style.width = ($0W.width) + 'px';
            $0X.style.height = $F + 'px';
            $0X.style.left = $0W.left + 'px';
            $0X.style.top = top + 'px';
            $0X.style.zIndex = 101;
            $0X.style.overflow = 'hidden';
            var $C = document.createElement("div");
            $0X.appendChild($C);
            if (this.cssOnly) {
                $0X.className = this.$4Y("_shadow");
                $C.className = this.$4Y("_shadow_inner");
            };
            if (!this.cssOnly) {
                if ($0h === 'Fill') {
                    $C.style.backgroundColor = "#aaaaaa";
                    $C.style.opacity = 0.5;
                    $C.style.filter = "alpha(opacity=50)";
                    $C.style.height = "100%";
                    if ($0U && $0U.event && $0U.style) {
                        $C.style.fontSize = $0U.style.fontSize;
                        $C.style.fontFamily = $0U.style.fontFamily;
                        $C.style.color = $0U.style.color;
                        $C.innerHTML = $0U.event.client.innerHTML();
                    }
                } else {
                    $0X.style.paddingTop = "2px";
                    $C.style.border = '2px dotted #666666';
                }
            };
            $0V.appendChild($0X);
            $0X.calendar = $b;
            return $0X;
        };
        this.$62 = function(y) {
            var $c = {};
            var element;
            var top = 0;
            var $0Y = 0;
            var $0Z = this.rows.length;
            for (var i = 0; i < $0Z; i++) {
                var $q = this.rows[i];
                if ($q.Hidden) {
                    continue;
                };
                $0Y += $q.Height;
                if (y < $0Y || i === $0Z - 1) {
                    top = $0Y - $q.Height;
                    element = $q;
                    break;
                }
            };
            $c.top = top;
            $c.bottom = $0Y;
            $c.i = i;
            $c.element = element;
            return $c;
        };
        this.$6a = function(i) {
            var top = 0;
            var $A = 0;
            var $10 = 0;
            if (i > this.rows.length - 1) {
                throw "Row index too high (DayPilotScheduler._getRowByIndex)";
            };
            for (var j = 0; j <= i; j++) {
                var $q = this.rows[j];
                if ($q.Hidden) {
                    continue;
                };
                $A += $q.Height;
                $10++;
            };
            top = $A - $q.Height;
            var $c = {};
            $c.top = top;
            $c.height = $q.Height;
            $c.bottom = $A;
            $c.i = $10 - 1;
            return $c;
        };
        this.$6b = function() {
            if (this.backendUrl || typeof WebForm_DoCallback === 'function') {
                return (typeof $b.events.list === 'undefined') || (!$b.events.list);
            } else {
                return false;
            }
        };
        this.events.find = function(id) {
            var $11 = $b.events.list.length;
            for (var i = 0; i < $11; i++) {
                if ($b.events.list[i].id === id) {
                    return new DayPilot.Event($b.events.list[i], $b);
                }
            };
            return null;
        };
        this.events.findRecurrent = function($12, $13) {
            var $11 = $b.events.list.length;
            for (var i = 0; i < $11; i++) {
                if ($b.events.list[i].recurrentMasterId === $12 && $b.events.list[i].start.getTime() === $13.getTime()) {
                    return new DayPilot.Event($b.events.list[i], $b);
                }
            };
            return null;
        };
        this.events.$5m = function($j) {
            var $0m = [];
            for (var i = 0; i < $b.rows.length; i++) {
                var $q = $b.rows[i];
                for (var r = 0; r < $q.events.length; r++) {
                    if ($q.events[r].data === $j) {
                        $0m.push(i);
                        $q.events.splice(r, 1);
                        break;
                    }
                }
            };
            return $0m;
        };
        this.events.$5n = function($j) {
            var $0m = [];
            for (var i = 0; i < $b.rows.length; i++) {
                var $q = $b.rows[i];
                var ep = $b.$6c($j, $q);
                if (ep) {
                    var $10 = DayPilot.indexOf($b.events.list, ep.data);
                    $b.$6d($10);
                    if (typeof $b.onBeforeEventRender === 'function') {
                        ep.cache = $b.cache.events[$10];
                    };
                    $0m.push(i);
                }
            };
            return $0m;
        };
        this.events.update = function(e, $j) {
            var $0d = {};
            $0d.oldEvent = new DayPilot.Event(e.copy(), $b);
            $0d.newEvent = new DayPilot.Event(e.temp(), $b);
            var $0j = new DayPilot.Action($b, "EventUpdate", $0d, $j);
            var $0m = $b.events.$5m(e.data);
            e.commit();
            $0m = $0m.concat($b.events.$5n(e.data));
            $b.$5o($0m);
            $b.$5p();
            $b.$4N($0m);
            $b.$4G();
            return $0j;
        };
        this.events.remove = function(e, $j) {
            var $0d = {};
            $0d.e = new DayPilot.Event(e.data, $b);
            var $0j = new DayPilot.Action($b, "EventRemove", $0d, $j);
            var $10 = DayPilot.indexOf($b.events.list, e.data);
            $b.events.list.splice($10, 1);
            var $0m = $b.events.$5m(e.data);
            $b.$5o($0m);
            $b.$5p();
            $b.$4N($0m);
            return $0j;
        };
        this.events.add = function(e, $j) {
            e.calendar = $b;
            if (!$b.events.list) {
                $b.events.list = [];
            };
            $b.events.list.push(e.data);
            var $0d = {};
            $0d.e = e;
            var $0j = new DayPilot.Action($b, "EventAdd", $0d, $j);
            var ri = DayPilot.indexOf($b.rows, $b.$4T(e.resource()));
            var $q = $b.rows[ri];
            var $0m = $b.events.$5n(e.data);
            $b.$5o($0m);
            $b.$5p();
            $b.$4N($0m);
            if ($b.viewType === "Gantt" && $b.initialized) {
                $b.update();
            };
            return $0j;
        };
        this.queue = {};
        this.queue.list = [];
        this.queue.list.ignoreToJSON = true;
        this.queue.add = function($0j) {
            if (!$0j) {
                return;
            };
            if ($0j.isAction) {
                $b.queue.list.push($0j);
            } else {
                throw "DayPilot.Action object required for queue.add()";
            }
        };
        this.queue.notify = function($j) {
            var $0d = {};
            $0d.actions = $b.queue.list;
            $b.$5a('Notify', $0d, $j, "Notify");
            $b.queue.list = [];
        };
        this.queue.clear = function() {
            $b.queue.list = [];
        };
        this.queue.pop = function() {
            return $b.queue.list.pop();
        };
        this.cells.find = function($K, $0A) {
            var x = $b.getPixels(new DayPilot.Date($K)).i;
            var $p = $b.$4T($0A).Top;
            var y = $b.$62($p).i;
            return this.findXy(x, y);
        };
        this.cells.findXy = function(x, y) {
            if (x === null || y === null) {
                return new $14();
            };
            var $P = {};
            $P.x = x;
            $P.y = y;
            $P.i = x + "_" + y;
            $P.div = $b.cache.cells[$P.i];
            if (!$b.cellProperties) {
                $b.cellProperties = [];
            };
            if ($b.cellProperties) {
                var p = $b.$6e(x, y);
                if (!p) {
                    p = {};
                    $b.cellProperties[$P.i] = p;
                };
                $P.properties = p;
            };
            return new $14($P);
        };
        var $14 = function(a) {
            this.list = [];
            if (DayPilot.isArray(a)) {
                for (var i = 0; i < a.length; i++) {
                    this.list.push(a[i]);
                }
            } else if (typeof a === 'object') {
                this.list.push(a);
            };
            this.cssClass = function($15) {
                this.each(function($16) {
                    $16.properties.cssClass = DayPilot.Util.addClassToString($16.properties.cssClass, $15);
                    if ($16.div) {
                        DayPilot.Util.addClass($16.div, $15);
                    }
                });
                return this;
            };
            this.html = function($t) {
                this.each(function($16) {
                    $16.properties.html = $t;
                    if ($16.div) {
                        $16.div.innerHTML = $t;
                    }
                });
                return this;
            };
            this.each = function(f) {
                if (!f) {
                    return;
                };
                for (var i = 0; i < this.list.length; i++) {
                    f(this.list[i]);
                }
            };
        };
        this.$6f = function($17, $18) {
            if (!this.debuggingEnabled) {
                return;
            };
            if (!$b.debugMessages) {
                $b.debugMessages = [];
            };
            $b.debugMessages.push($17);
            if (typeof console !== 'undefined') {
                console.log($17);
            }
        };
        this.showDebugMessages = function() {
            alert("Log:\n" + $b.debugMessages.join("\n"));
        };
        this.$6g = function($o) {
            if ($o.ticks === this.startDate.ticks) {
                return $o;
            };
            var $19 = this.startDate;
            if ($o.ticks < this.startDate.ticks) {
                while ($19.ticks > $o.ticks) {
                    $19 = $19.addMinutes(-this.cellDuration);
                };
                return $19;
            };
            if ($o.ticks > this.startDate.ticks) {
                while ($19.ticks <= $o.ticks) {
                    $19 = $19.addMinutes(this.cellDuration);
                };
                return $19.addMinutes(-this.cellDuration);
            };
            throw "Internal error: Cannot find box start";
        };
        this.$69 = function($0U) {
            var $q = this.$62($b.coords.y);
            var e = $0U.event;
            if (typeof e.end !== 'function') {
                alert("e.end function is not defined");
            };
            if (!e.end()) {
                alert("e.end() returns null");
            };
            var $06 = DayPilot.Date.diff(e.end().d, e.start().d);
            var $1a = $0k.useBox($06);
            var $1b = e.start().getDatePart();
            var $1c = ($1a) ? e.start().getTime() - ($1b.getTime() + Math.floor((e.start().getHours() * 60 + e.start().getMinutes()) / $b.cellDuration) * $b.cellDuration * 60 * 1000) : 0;
            var $1d;
            if (DayPilotScheduler.moveDragStart) {
                $1d = $1a ? DayPilotScheduler.moveDragStart.getTime() - this.$6g(e.start()).getTime() : DayPilotScheduler.moveDragStart.getTime() - e.start().getTime();
                $1d = Math.floor(($1d / 60000) / this.cellDuration) * (this.cellDuration * 60000);
            } else {
                $1d = 0;
            };
            if (this.eventMoveToPosition) {
                $1d = 0;
            };
            var $K = this.getDate(this.coords.x, true).addTime(-$1d);
            DayPilot.debug("start: " + $K.toString());
            if (DayPilotScheduler.resizing) {
                $K = e.start();
            };
            var $1e = $K;
            if (this.snapToGrid) {
                $K = this.$6g($K);
            };
            $K = $K.addTime($1c);
            var end = $K.addTime($06);
            var $1f = $K;
            var $1g = end;
            if (this.viewType === 'Days') {
                var $1h = this.rows[e.part.dayIndex].Start.getTime() - this.startDate.getTime();
                var $1f = $K.addTime(-$1h);
                var $1g = $1f.addTime($06);
                var $1i = $q.element.Start.getTime() - this.startDate.getTime();
                $K = $1f.addTime($1i);
                end = $K.addTime($06);
            };
            var $1j = this.getPixels($1f);
            var $1k = this.getPixels($1g);
            var $y = ($1a) ? $1j.boxLeft : $1j.left;
            var $R = ($1a) ? ($1k.boxRight - $y) : ($1k.left - $y);
            var $0W = {};
            $0W.top = $q.top;
            $0W.left = $y;
            $0W.row = $q.element;
            $0W.rowIndex = $q.i;
            $0W.width = $R;
            $0W.start = $K;
            $0W.end = end;
            $0W.relativeY = $b.coords.y - $q.top;
            return $0W;
        };
        this.$6h = function(y) {
            return this.treePreventParentUsage && this.$6i(y);
        };
        this.$6i = function(y) {
            var $q = this.rows[y];
            if ($q.IsParent) {
                return true;
            };
            if (this.treeEnabled) {
                if ($q.Children && $q.Children.length > 0) {
                    return true;
                }
            };
            return false;
        };
        this.$6j = function() {
            var scroll = this.nav.scroll;
            if (!$b.coords) {
                return;
            };
            var $0X = DayPilotScheduler.movingShadow;
            var $0W = this.$69(DayPilotScheduler.moving);
            var ev = DayPilotScheduler.moving.event;
            var $1l = 0;
            (function() {
                var y = $0W.relativeY;
                var $q = $0W.row;
                var $1m = $q.lines.length;
                var top = 0;
                var lh = $b.eventHeight;
                var $1n = $q.lines.length;
                for (var i = 0; i < $q.lines.length; i++) {
                    var $Q = $q.lines[i];
                    if ($Q.isFree($0W.left, $b.cellWidth)) {
                        $1n = i;
                        break;
                    }
                };
                var $05 = Math.floor((y - top + lh / 2) / lh);
                var $05 = Math.min($1n, $05);
                var $05 = Math.max(0, $05);
                $1l = $05;
            })();
            var $1o = !ev.data.moveVDisabled && $b.viewType !== 'Gantt';
            var $1p = !ev.data.moveHDisabled;
            var $1q = $1l * $b.eventHeight;
            if ($1q > 0) {
                $1q -= 3;
            };
            if ($1o) {
                if (!this.$6h($0W.rowIndex)) {
                    $0X.row = $0W.row;
                    $0X.style.height = Math.max($0W.row.Height, 0) + 'px';
                    $0X.style.top = ($0W.top) + 'px';
                    if ($b.eventMoveToPosition) {
                        $0X.style.top = ($0W.top + $1q) + "px";
                        $0X.style.height = "3px";
                        $0X.line = $1l;
                    }
                } else {
                    var $1r = $0X.row;
                    var $1s = $0W.rowIndex < $1r.Index ? 1 : -1;
                    for (var i = $0W.rowIndex; i !== $1r.Index; i += $1s) {
                        var $q = this.rows[i];
                        if (!this.$6h(i) && !$q.Hidden) {
                            $0X.style.top = ($q.Top) + 'px';
                            $0X.style.height = Math.max($q.Height, 0) + 'px';
                            $0X.row = $q;
                            if ($b.eventMoveToPosition) {
                                $1l = $1s > 0 ? 0 : $q.lines.length - 1;
                                $0X.style.top = ($0W.top + $1q) + "px";
                                $0X.style.height = "3px";
                                $0X.line = $1l;
                            };
                            break;
                        }
                    }
                }
            } else {
                var $1r = this.rows[this.$62(parseInt($0X.style.top)).i];
                var $1n = $1r.lines.length;
                for (var i = 0; i < $1r.lines.length; i++) {
                    var $Q = $1r.lines[i];
                    if ($Q.isFree($0W.left, $b.cellWidth)) {
                        $1n = i;
                        break;
                    }
                };
                $0X.style.height = Math.max($1r.Height, 0) + 'px';
                $0X.style.top = ($1r.Top) + 'px';
                $0X.row = $1r;
                if ($b.eventMoveToPosition) {
                    if ($0W.row === $1r) {
                        $0X.style.top = ($1r.Top + $1q) + "px";
                        $0X.style.height = "3px";
                        $0X.line = $1l;
                    } else {
                        var $05 = ($0W.rowIndex > $1r.Index && $1n > 0) ? $1n * $b.eventHeight - 3 : 0;
                        $0X.style.top = ($1r.Top + $05) + "px";
                        $0X.style.height = "3px";
                        $0X.line = 0;
                    }
                }
            };
            if ($1p) {
                $0X.style.left = $0W.left + 'px';
                if ($b.eventMoveToPosition) {
                    $0X.style.width = ($b.cellWidth) + 'px';
                } else {
                    $0X.style.width = ($0W.width) + 'px';
                };
                $0X.start = $0W.start;
                $0X.end = $0W.end;
            } else {
                $0X.start = ev.start();
                $0X.end = ev.end();
            }
        };
        this.$6k = function() {
            if (this.rowHeaderColumns) {
                this.rowHeaderCols = DayPilot.Util.propArray(this.rowHeaderColumns, "width");
            }
        };
        this.$4W = function() {
            var $1t = 0;
            this.$6k();
            if (this.rowHeaderCols) {
                for (var i = 0; i < this.rowHeaderCols.length; i++) {
                    $1t += this.rowHeaderCols[i];
                }
            } else {
                $1t = this.rowHeaderWidth;
            };
            return $1t;
        };
        this.$6l = function() {
            var $1u = this.divHeader;
            var $1n = [];
            for (var i = 0; i < $1u.rows.length; i++) {
                for (var j = 0; j < $1u.rows[i].cells.length; j++) {
                    var $C = $1u.rows[i].cells[j].firstChild.firstChild;
                    if (!$C || !$C.style) {
                        continue;
                    };
                    var $1v = $C.style.width;
                    var $1w = $C.style.right;
                    $C.style.position = "absolute";
                    $C.style.width = "auto";
                    $C.style.right = "auto";
                    $C.style.whiteSpace = "nowrap";
                    var w = $C.offsetWidth + 2;
                    $C.style.position = "";
                    $C.style.width = $1v;
                    $C.style.right = $1w;
                    $C.style.whiteSpace = "";
                    if (typeof $1n[j] === 'undefined') {
                        $1n[j] = 0;
                    };
                    $1n[j] = Math.max($1n[j], w);
                }
            };
            var $1x = 0;
            var $1y = false;
            this.$6k();
            if (this.rowHeaderCols) {
                for (var i = 0; i < $1n.length; i++) {
                    if (this.rowHeaderCols[i]) {
                        if ($1n[i] > this.rowHeaderCols[i]) {
                            this.rowHeaderCols[i] = $1n[i];
                            $1y = true;
                        };
                        $1x += this.rowHeaderCols[i];
                    }
                }
            } else {
                if (this.rowHeaderWidth < $1n[0]) {
                    $1x = $1n[0];
                    $1y = true;
                }
            };
            if ($1y) {
                if (this.$6m) {
                    this.$6m.widths = this.rowHeaderCols;
                    this.$6m.updateWidths();
                    DayPilot.Util.updatePropsFromArray(this.rowHeaderColumns, "width", this.rowHeaderCols);
                };
                this.rowHeaderWidth = $1x;
                this.$6n();
            }
        };
        this.$4A = function() {
            var parent = this.divResScroll;
            DayPilot.puc(parent);
            parent.innerHTML = '';
            this.$6k();
            var $1z = this.rowHeaderCols;
            var $0R = $1z ? this.rowHeaderCols.length : 0;
            var $1t = this.$4W();
            var $1u = document.createElement("table");
            $1u.style.borderCollapse = "collapse";
            $1u.style.KhtmlUserSelect = "none";
            $1u.style.MozUserSelect = "none";
            $1u.style.WebkitUserSelect = "none";
            $1u.style.width = $1t + "px";
            $1u.style.border = "0px none";
            $1u.cellSpacing = 0;
            $1u.cellPadding = 0;
            $1u.onmousemove = function() {
                $b.$6o();
                $b.$6p();
            };
            if (!this.cssOnly) {
                $1u.className = this.$4Y("resourceheader");
            };
            this.divHeader = $1u;
            var m = this.rows.length;
            for (var i = 0; i < m; i++) {
                var $q = this.rows[i];
                if ($q.Hidden) {
                    continue;
                };
                var r = $1u.insertRow(-1);
                var c = r.insertCell(-1);
                c.row = $q;
                c.index = i;
                var $R = $1z ? $1z[0] : this.rowHeaderWidth;
                c.style.width = ($R) + "px";
                c.style.border = "0px none";
                if (!this.cssOnly) {
                    c.style.borderRight = "1px solid " + this.borderColor;
                    c.style.backgroundColor = $q.BackColor;
                    c.style.fontFamily = this.headerFontFamily;
                    c.style.fontSize = this.headerFontSize;
                    c.style.color = this.headerFontColor;
                    c.style.cursor = 'default';
                    c.style.padding = '0px';
                };
                if ($q.ToolTip) {
                    c.title = $q.ToolTip;
                };
                c.setAttribute("unselectable", "on");
                c.setAttribute('resource', $q.Value);
                c.onmousemove = $b.$6q;
                c.onmouseout = $b.$6r;
                c.oncontextmenu = $b.$6s;
                c.onclick = $b.$6t;
                var $B = document.createElement("div");
                $B.style.width = ($R) + "px";
                $B.setAttribute("unselectable", "on");
                $B.className = this.cssOnly ? this.$4Y('_rowheader') : this.$4Y('rowheader');
                if ($q.CssClass) {
                    DayPilot.Util.addClass($B, $q.CssClass);
                };
                if ($q.BackColor) {
                    $B.style.backgroundColor = $q.BackColor;
                };
                $B.style.height = ($q.Height) + "px";
                $B.style.overflow = 'hidden';
                $B.style.position = 'relative';
                var $C = document.createElement("div");
                $C.setAttribute("unselectable", "on");
                $C.className = this.cssOnly ? this.$4Y('_rowheader_inner') : "";
                $B.appendChild($C);
                var $1A = document.createElement("div");
                $1A.style.position = "absolute";
                $1A.style.bottom = "0px";
                $1A.style.width = "100%";
                $1A.style.height = "1px";
                if (this.cssOnly) {
                    $1A.className = this.$4Y("_resourcedivider");
                } else {
                    $1A.style.backgroundColor = this.borderColor;
                };
                $B.appendChild($1A);
                if (this.treeEnabled) {
                    var $1B = document.createElement("div");
                    $1B.style.width = "10px";
                    $1B.style.height = "10px";
                    $1B.style.backgroundRepeat = "no-repeat";
                    $1B.style.position = 'absolute';
                    $1B.style.left = ($q.Level * this.treeIndent + this.treeImageMarginLeft) + 'px';
                    $1B.style.top = this.treeImageMarginTop + "px";
                    if (!$q.Loaded && $q.Children.length === 0) {
                        if (this.treeImageExpand && !this.cssOnly) {
                            $1B.style.backgroundImage = "url('" + this.treeImageExpand + "')";
                        };
                        $1B.className = this.cssOnly ? this.$4Y('_tree_image_expand') : this.$4Y('tree_image_expand');
                        $1B.style.cursor = 'pointer';
                        $1B.index = i;
                        $1B.onclick = function(ev) {
                            $b.$6u(this.index);
                            ev = ev || window.event;
                            ev.cancelBubble = true;
                        };
                    } else if ($q.Children.length > 0) {
                        if ($q.Expanded) {
                            if (this.treeImageCollapse && !this.cssOnly) {
                                $1B.style.backgroundImage = "url('" + this.treeImageCollapse + "')";
                            };
                            $1B.className = this.cssOnly ? this.$4Y('_tree_image_collapse') : this.$4Y('tree_image_collapse');
                        } else {
                            if (this.treeImageExpand && !this.cssOnly) {
                                $1B.style.backgroundImage = "url('" + this.treeImageExpand + "')";
                            };
                            $1B.className = this.cssOnly ? this.$4Y('_tree_image_expand') : this.$4Y('tree_image_expand');
                        };
                        $1B.style.cursor = 'pointer';
                        $1B.index = i;
                        $1B.onclick = function(ev) {
                            $b.$6v(this.index);
                            ev = ev || window.event;
                            ev.cancelBubble = true;
                        };
                    } else {
                        if (this.treeImageNoChildren && !this.cssOnly) {
                            $1B.style.backgroundImage = "url('" + this.treeImageNoChildren + "')";
                        };
                        $1B.className = this.cssOnly ? this.$4Y('_tree_image_no_children') : this.$4Y('tree_image_no_children');
                    };
                    $C.appendChild($1B);
                };
                var $1C = document.createElement("div");
                if (this.treeEnabled) {
                    $1C.style.marginLeft = (($q.Level + 1) * this.treeIndent) + 'px';
                } else if (!this.cssOnly) {
                    $1C.style.marginLeft = "4px";
                };
                $1C.innerHTML = $q.InnerHTML;
                $C.appendChild($1C);
                c.appendChild($B);
                if ($q.areas) {
                    for (var j = 0; j < $q.areas.length; j++) {
                        var $0J = $q.areas[j];
                        if ($0J.v !== 'Visible') {
                            continue;
                        };
                        var a = DayPilot.Areas.createArea($B, $q, $0J);
                        $B.appendChild(a);
                    }
                };
                if (!$q.Columns || $q.Columns.length === 0) {
                    c.colSpan = $0R > 0 ? $0R : 1;
                    $B.style.width = $1t + "px";
                } else {
                    for (var j = 1; j < $0R; j++) {
                        var c = r.insertCell(-1);
                        c.row = $q;
                        c.index = i;
                        if (!this.cssOnly) {
                            c.style.borderRight = "1px solid " + this.borderColor;
                            c.style.backgroundColor = $q.BackColor;
                            c.style.fontFamily = this.headerFontFamily;
                            c.style.fontSize = this.headerFontSize;
                            c.style.color = this.headerFontColor;
                            c.style.cursor = 'default';
                            c.style.padding = '0px';
                        };
                        if ($q.ToolTip) {
                            c.title = $q.ToolTip;
                        };
                        c.setAttribute("unselectable", "on");
                        if (!this.cssOnly) {
                            c.className = this.$4Y('rowheader');
                        };
                        c.setAttribute('resource', $q.Value);
                        c.onmousemove = $b.$6q;
                        c.onmouseout = $b.$6r;
                        c.oncontextmenu = $b.$6s;
                        c.onclick = $b.$6t;
                        var $B = document.createElement("div");
                        var w = this.cssOnly ? $1z[j] : $1z[j] - 1;
                        if ($q.BackColor) {
                            $B.style.backgroundColor = $q.BackColor;
                        };
                        $B.style.width = w + "px";
                        $B.style.height = ($q.Height) + "px";
                        $B.style.overflow = 'hidden';
                        $B.style.position = 'relative';
                        $B.setAttribute("unselectable", "on");
                        if (this.cssOnly) {
                            DayPilot.Util.addClass($B, this.$4Y("_rowheader"));
                            DayPilot.Util.addClass($B, this.$4Y("_rowheadercol"));
                            DayPilot.Util.addClass($B, this.$4Y("_rowheadercol" + j));
                        };
                        if ($q.CssClass) {
                            DayPilot.Util.addClass($B, $q.CssClass);
                        };
                        var $C = document.createElement("div");
                        $C.setAttribute("unselectable", "on");
                        if (this.cssOnly) {
                            $C.className = this.$4Y("_rowheader_inner");
                        };
                        $B.appendChild($C);
                        var $1A = document.createElement("div");
                        $1A.style.position = "absolute";
                        $1A.style.bottom = "0px";
                        $1A.style.width = ($1z[j] - 1) + "px";
                        $1A.style.height = "1px";
                        $1A.className = this.$4Y("_resourcedivider");
                        if (!this.cssOnly) {
                            $1A.style.backgroundColor = this.borderColor;
                        };
                        $B.appendChild($1A);
                        var $1C = document.createElement("div");
                        if (!this.cssOnly) {
                            $1C.style.marginLeft = '4px';
                        };
                        var $1D = $q.Columns[j - 1] ? $q.Columns[j - 1].html : "";
                        $1C.innerHTML = $1D;
                        $C.appendChild($1C);
                        c.appendChild($B);
                    }
                }
            };
            var r = $1u.insertRow(-1);
            var c = r.insertCell(-1);
            c.colSpan = $0R + 1;
            c.style.width = $1t + "px";
            c.style.height = (parent.clientHeight + 20) + "px";
            if (!this.cssOnly) {
                c.style.backgroundColor = this.hourNameBackColor;
                c.style.cursor = 'default';
            };
            c.setAttribute("unselectable", "on");
            if (!this.cssOnly) {
                c.className = this.$4Y('rowheader');
                c.style.fontSize = "1px";
                c.innerHTML = "&nbsp;";
            };
            if (this.cssOnly) {
                var $B = document.createElement("div");
                $B.style.position = "relative";
                $B.style.height = "100%";
                $B.className = this.$4Y('_rowheader');
                c.appendChild($B);
            };
            parent.appendChild($1u);
            if (this.rowHeaderWidthAutoFit) {
                this.$6l();
            }
        };
        this.$6s = function() {
            var $q = this.row;
            var r = {};
            r.type = 'resource';
            r.start = $q.Start;
            r.name = $q.Name;
            r.value = $q.Value;
            r.id = $q.Value;
            r.index = this.index;
            r.root = $b;
            r.toJSON = function($1E) {
                var $0G = {};
                $0G.start = this.start;
                $0G.name = this.name;
                $0G.value = this.value;
                $0G.index = this.index;
                return $0G;
            };
            if ($q.contextMenu) {
                $q.contextMenu.show(r);
            };
            return false;
        };
        this.$6t = function(ev) {
            var $q = this.row;
            var r = $b.$6w($q, this.index);
            $b.$5M(r);
        };
        this.$6x = function(ev) {
            var $P = this.cell;
            $P.start = this.cell.start;
            $P.level = this.cell.level;
            if (!$P.end) {
                $P.end = new DayPilot.Date($P.start).addMinutes($b.cellDuration);
            };
            $b.$5N($P);
        };
        this.$6w = function($q, $10) {
            var r = {};
            r.type = 'resource';
            r.start = $q.Start;
            r.name = $q.Name;
            r.value = $q.Value;
            r.id = $q.Value;
            r.index = $10;
            r.root = $b;
            r.toJSON = function($1E) {
                var $0G = {};
                $0G.start = this.start;
                $0G.name = this.name;
                $0G.value = this.value;
                $0G.id = this.id;
                $0G.index = this.index;
                return $0G;
            };
            return r;
        };
        this.$4z = function($0n, $1F) {
            var $1G = [];
            var $18 = null;
            if ($0n && $1F) {
                var $1H = $0n;
                var $18 = [];
                for (var i = 0; i < $1H.length; i++) {
                    var e = $1H[i];
                    var $Y = false;
                    for (var j = 0; j < this.events.list.length; j++) {
                        var ex = this.events.list[j];
                        if (ex.id === e.id) {
                            this.events.list[j] = e;
                            $Y = true;
                            break;
                        }
                    };
                    if (!$Y) {
                        $18.push(e);
                    }
                };
                this.events.list = this.events.list.concat($18);
            } else if ($0n) {
                this.events.list = $0n;
            } else if (!this.events.list) {
                this.events.list = [];
            };
            var $0q = $18 || this.events.list;
            var $1I = $0q.length;
            if (typeof this.onBeforeEventRender === 'function') {
                var $K = $18 ? this.events.list.length - $18.length : 0;
                var end = this.events.list.length;
                for (var i = $K; i < end; i++) {
                    this.$6d(i);
                }
            };
            var $h = [];
            for (var i = 0; i < this.rows.length; i++) {
                var $q = this.rows[i];
                if (!$18 || typeof $q.events === "undefined") {
                    $q.events = [];
                };
                $q.data = {};
                $q.data.start = new DayPilot.Date($q.Start);
                $q.data.startTicks = $q.data.start.getTime();
                $q.data.end = $0k.isResourcesView() ? $q.data.start.addDays(this.days) : $q.data.start.addDays(1);
                $q.data.endTicks = $q.data.end.getTime();
                $q.data.offset = $q.Start.getTime() - this.startDate.getTime();
                $q.data.i = i;
                if (this.$6h(i)) {
                    continue;
                };
                for (var j = 0; $0q && j < $1I; j++) {
                    if ($1G[j]) {
                        continue;
                    };
                    var e = $0q[j];
                    var ep = this.$6c(e, $q);
                    if (!ep) {
                        continue;
                    };
                    if (typeof this.onBeforeEventRender === 'function') {
                        ep.cache = this.cache.events[j + $K];
                    };
                    $h.push(i);
                    if (ep.data.resource !== "*" && ep.part.start.getTime() === ep.start().getTime() && ep.part.end.getTime() === ep.end().getTime()) {
                        $1G[j] = true;
                    }
                }
            };
            for (var i = 0; i < this.rows.length; i++) {
                var $q = this.rows[i];
                this.$6y($q);
            };
            this.$5p();
            return DayPilot.ua($h);
        };
        this.$6d = function(i) {
            var $V = this.cache.events;
            var $j = this.events.list[i];
            var $1J = {};
            for (var name in $j) {
                $1J[name] = $j[name];
            };
            if (typeof this.onBeforeEventRender === 'function') {
                var $n = {};
                $n.e = $1J;
                this.onBeforeEventRender($n);
            };
            $V[i] = $1J;
        };
        this.$6y = function($q) {
            $q.lines = [];
            if (this.sortDirections) {
                $q.events.sort(this.$6z);
            } else {
                $q.events.sort(this.$6A);
            };
            for (var j = 0; j < $q.events.length; j++) {
                var e = $q.events[j];
                $q.putIntoLine(e);
            }
        };
        this.$5o = function($0m) {
            $0m = DayPilot.ua($0m);
            for (var i = 0; i < $0m.length; i++) {
                var ri = $0m[i];
                $b.$6y($b.rows[ri]);
            }
        };
        this.$6c = function(e, $q) {
            var $K = new DayPilot.Date(e.start);
            var end = new DayPilot.Date(e.end);
            var $1K = $K.getTime();
            var $1L = end.getTime();
            if ($1L < $1K) {
                return null;
            };
            var $1M = false;
            switch (this.viewType) {
                case 'Days':
                    $1M = !($1L <= $q.data.startTicks || $1K >= $q.data.endTicks) || ($1K === $1L && $1K === $q.data.startTicks);
                    break;
                case 'Resources':
                    $1M = ($q.Value === e.resource || $q.Value === "*" || e.resource === "*") && (!($1L <= $q.data.startTicks || $1K >= $q.data.endTicks) || ($1K === $1L && $1K === $q.data.startTicks));
                    break;
                case 'Gantt':
                    $1M = ($q.Value === e.id) && !($1L <= $q.data.startTicks || $1K >= $q.data.endTicks);
                    break;
            };
            if (!$1M) {
                return null;
            };
            var ep = new DayPilot.Event(e, $b);
            ep.part.dayIndex = $q.data.i;
            ep.part.start = $q.data.startTicks < $1K ? ep.start() : $q.data.start;
            ep.part.end = $q.data.endTicks > $1L ? ep.end() : $q.data.end;
            var $1N = this.getPixels(ep.part.start.addTime(-$q.data.offset));
            var $1O = this.getPixels(ep.part.end.addTime(-$q.data.offset));
            var $y = $1N.left;
            var $z = $1O.left;
            if ($y === $z && ($1N.cut || $1O.cut)) {
                return null;
            };
            ep.part.box = $0k.useBox($1L - $1K);
            if (ep.part.box) {
                var $1P = $1O.boxRight;
                ep.part.left = Math.floor($y / this.cellWidth) * this.cellWidth;
                ep.part.width = Math.max(Math.ceil($1P / this.cellWidth) * this.cellWidth - ep.part.left, this.cellWidth);
                ep.part.barLeft = Math.max($y - ep.part.left, 0);
                ep.part.barWidth = Math.max($z - $y, 1);
            } else {
                ep.part.left = $y;
                ep.part.width = Math.max($z - $y, 0);
                ep.part.barLeft = 0;
                ep.part.barWidth = Math.max($z - $y - 1, 1);
            };
            $q.events.push(ep);
            return ep;
        };
        this.$6A = function(a, b) {
            if (!a || !b || !a.start || !b.start) {
                return 0;
            };
            var $1Q = a.start().ticks - b.start().ticks;
            if ($1Q !== 0) {
                return $1Q;
            };
            var $1R = b.end().ticks - a.end().ticks;
            return $1R;
        };
        this.$6z = function(a, b) {
            if (!a || !b) {
                return 0;
            };
            if (!a.data || !b.data || !a.data.sort || !b.data.sort || a.data.sort.length === 0 || b.data.sort.length === 0) {
                return $b.$6A(a, b);
            };
            var $c = 0;
            var i = 0;
            while ($c === 0 && a.data.sort[i] && b.data.sort[i]) {
                if (a.data.sort[i] === b.data.sort[i]) {
                    $c = 0;
                } else {
                    $c = $b.$6B(a.data.sort[i], b.data.sort[i], $b.sortDirections[i]);
                };
                i++;
            };
            return $c;
        };
        this.$6B = function(a, b, $1S) {
            var $1T = ($1S !== "desc");
            var $1U = $1T ? -1 : 1;
            var $1V = -$1U;
            if (a === null && b === null) {
                return 0;
            };
            if (b === null) {
                return $1V;
            };
            if (a === null) {
                return $1U;
            };
            var ar = [];
            ar[0] = a;
            ar[1] = b;
            ar.sort();
            return a === ar[0] ? $1U : $1V;
        };
        this.$4x = function() {
            this.rows = [];
            this.hasChildren = false;
            var $0L = this.resources;
            var $1W = this.$5X();
            if (!$1W) {
                if (this.viewType === "Gantt") {
                    $0L = this.$6C();
                } else if (this.viewType === "Days") {
                    $0L = this.$6D();
                }
            };
            var $10 = {};
            $10.i = 0;
            this.$6E($0L, $10, 0, null, this.treeEnabled, false);
        };
        this.$6C = function() {
            var $0q = [];
            if (this.ganttAppendToResources && this.resources) {
                for (var i = 0; i < this.resources.length; i++) {
                    $0q.push(this.resources[i]);
                }
            };
            if (!this.events.list) {
                return;
            };
            for (var i = 0; i < this.events.list.length; i++) {
                var e = this.events.list[i];
                var r = {};
                r.id = e.id;
                r.name = e.text;
                $0q.push(r);
            };
            return $0q;
        };
        this.$6D = function() {
            var $0q = [];
            var $1X = this.$6F.locale();
            for (var i = 0; i < this.days; i++) {
                var d = this.startDate.addDays(i);
                var r = {};
                r.name = d.toString($1X.datePattern, $1X);
                r.start = d;
                $0q.push(r);
            };
            return $0q;
        };
        this.$6E = function($0L, $10, $1Y, parent, $1Z, $20) {
            if (!$0L) {
                return;
            };
            for (var i = 0; i < $0L.length; i++) {
                if (!$0L[i]) {
                    continue;
                };
                var $21 = {};
                $21.level = $1Y;
                $21.hidden = $20;
                $21.index = $10.i;
                var $0K = this.$6G($0L[i], $21);
                var $q = {};
                $q.BackColor = $0K.backColor;
                $q.CssClass = $0K.cssClass;
                $q.Expanded = $0K.expanded;
                $q.Name = $0K.name;
                $q.InnerHTML = $0K.html ? $0K.html : $q.Name;
                $q.MinHeight = typeof $0K.minHeight !== 'undefined' ? $0K.minHeight : $b.rowMinHeight;
                $q.MarginBottom = typeof $0K.marginBottom !== 'undefined' ? $0K.marginBottom : $b.rowMarginBottom;
                $q.Loaded = !$0K.dynamicChildren;
                $q.Value = $0K.id || $0K.value;
                $q.ToolTip = $0K.toolTip;
                $q.Children = [];
                $q.Columns = [];
                $q.Start = $0K.start ? new DayPilot.Date($0K.start) : this.startDate;
                $q.IsParent = $0K.isParent;
                $q.contextMenu = $0K.contextMenu ? eval($0K.contextMenu) : this.contextMenuResource;
                $q.areas = $0K.areas;
                $q.Height = this.eventHeight;
                $q.Hidden = $20;
                $q.Level = $1Y;
                $q.Index = $10.i;
                $q.Resource = $0L[i];
                $q.lines = [];
                $q.isRow = true;
                $q.height = function() {
                    var $22 = Math.max(1, this.lines.length);
                    var $23 = $b.durationBarDetached ? ($b.eventHeight + 10) : $b.eventHeight;
                    var $F = $22 * $23 + this.MarginBottom;
                    return ($F > this.MinHeight) ? $F : this.MinHeight;
                };
                $q.putIntoLine = function(ep) {
                    var $24 = this;
                    for (var i = 0; i < this.lines.length; i++) {
                        var $Q = this.lines[i];
                        if ($Q.isFree(ep.part.left, ep.part.width)) {
                            $Q.push(ep);
                            return i;
                        }
                    };
                    var $Q = [];
                    $Q.isFree = function($25, $26) {
                        var end = $25 + $26 - 1;
                        var $1n = this.length;
                        for (var i = 0; i < $1n; i++) {
                            var e = this[i];
                            if (!(end < e.part.left || $25 > e.part.left + e.part.width - 1)) {
                                return false;
                            }
                        };
                        return true;
                    };
                    $Q.push(ep);
                    this.lines.push($Q);
                    return this.lines.length - 1;
                };
                this.rows.push($q);
                if (parent !== null) {
                    parent.Children.push($10.i);
                };
                if ($0K.columns) {
                    for (var j = 0; j < $0K.columns.length; j++) {
                        $q.Columns.push($0K.columns[j]);
                    }
                };
                $10.i++;
                if ($1Z && $0K.children && $0K.children.length) {
                    this.hasChildren = true;
                    var $27 = $20 || !$q.Expanded;
                    this.$6E($0K.children, $10, $1Y + 1, $q, true, $27);
                }
            }
        };
        this.$6G = function($0K, $21) {
            var r = {};
            for (var name in $0K) {
                r[name] = $0K[name];
            };
            if (typeof $0K.html === 'undefined') {
                r.html = $0K.name;
            };
            for (var name in $21) {
                r[name] = $21[name];
            };
            if (typeof this.onBeforeResHeaderRender === 'function') {
                var $n = {};
                $n.resource = r;
                this.onBeforeResHeaderRender($n);
            };
            return r;
        };
        this.$6H = function() {
            this.nav.top = document.getElementById(this.id);
            this.nav.top.dp = this;
            this.nav.top.innerHTML = "";
            if (!this.cssOnly) {
                this.nav.top.style.border = "1px solid " + this.borderColor;
            } else {
                DayPilot.Util.addClass(this.nav.top, this.$4Y("_main"));
            };
            this.nav.top.style.MozUserSelect = 'none';
            this.nav.top.style.KhtmlUserSelect = 'none';
            this.nav.top.style.WebkitUserSelect = 'none';
            if (this.width) {
                this.nav.top.style.width = this.width;
            };
            if (this.heightSpec === "Parent100Pct") {
                this.nav.top.style.height = "100%";
            };
            this.nav.top.style.lineHeight = "1.2";
            this.nav.top.style.position = "relative";
            this.nav.top.onmousemove = function(ev) {
                ev = ev || window.event;
                ev.insideMainD = true;
                if (window.event) {
                    window.event.srcElement.inside = true;
                }
            };
            this.nav.top.ontouchstart = $07.onMainTouchStart;
            this.nav.top.ontouchmove = $07.onMainTouchMove;
            this.nav.top.ontouchend = $07.onMainTouchEnd;
            if (this.hideUntilInit) {
                this.nav.top.style.visibility = 'hidden';
            };
            var $28 = this.$4W();
            var $29 = this.$6F.layout();
            if ($29 === 'DivBased') {
                var $y = document.createElement("div");
                $y.style.cssFloat = "left";
                $y.style.styleFloat = "left";
                $y.style.width = ($28) + "px";
                $y.appendChild(this.$6I());
                var $2a = document.createElement("div");
                $2a.style.height = "1px";
                $2a.className = this.$4Y("_divider_horizontal");
                if (!this.cssOnly) {
                    $2a.style.backgroundColor = this.borderColor;
                };
                $y.appendChild($2a);
                this.nav.dh1 = $2a;
                $y.appendChild(this.$6J());
                this.nav.left = $y;
                var $2b = document.createElement("div");
                $2b.style.cssFloat = "left";
                $2b.style.styleFloat = "left";
                $2b.style.width = "1px";
                $2b.style.height = (this.$4V() + this.$4Z()) + "px";
                $2b.className = this.$4Y("_divider");
                if (!this.cssOnly) {
                    $2b.style.backgroundColor = this.borderColor;
                };
                this.nav.divider = $2b;
                var $z = document.createElement("div");
                $z.style.marginLeft = ($28 + 1) + "px";
                $z.style.marginRight = '1px';
                $z.style.position = 'relative';
                $z.appendChild(this.$6K());
                this.nav.right = $z;
                var $2c = document.createElement("div");
                $2c.style.height = "1px";
                $2c.style.position = "absolute";
                $2c.style.top = this.$4V() + "px";
                $2c.style.width = "100%";
                $2c.className = this.$4Y("_divider_horizontal");
                if (!this.cssOnly) {
                    $2c.style.backgroundColor = this.borderColor;
                };
                $z.appendChild($2c);
                this.nav.dh2 = $2c;
                $z.appendChild(this.$6L());
                var $2d = document.createElement("div");
                $2d.style.clear = 'left';
                this.nav.top.appendChild($y);
                this.nav.top.appendChild($2b);
                this.nav.top.appendChild($z);
                this.nav.top.appendChild($2d);
            } else {
                var $1u = document.createElement("table");
                $1u.cellPadding = 0;
                $1u.cellSpacing = 0;
                $1u.border = 0;
                $1u.style.position = 'absolute';
                if (!this.cssOnly) {
                    $1u.style.backgroundColor = this.hourNameBackColor;
                };
                var $2e = $1u.insertRow(-1);
                var $2f = $2e.insertCell(-1);
                $2f.appendChild(this.$6I());
                var $2g = $2e.insertCell(-1);
                $2g.appendChild(this.$6K());
                var $2h = $1u.insertRow(-1);
                var $2i = $2h.insertCell(-1);
                $2i.appendChild(this.$6J());
                var $2j = $2h.insertCell(-1);
                $2j.appendChild(this.$6L());
                this.nav.top.appendChild($1u);
            };
            this.vsph = document.createElement("div");
            this.vsph.style.display = "none";
            this.nav.top.appendChild(this.vsph);
            var $2k = document.createElement("input");
            $2k.type = "hidden";
            $2k.id = this.id + "_state";
            $2k.name = this.id + "_state";
            this.nav.state = $2k;
            this.nav.top.appendChild($2k);
            var loading = document.createElement("div");
            loading.style.position = 'absolute';
            loading.style.left = (this.$4W() + 5) + "px";
            loading.style.top = (this.$4V() + 5) + "px";
            loading.style.display = 'none';
            if (!this.cssOnly) {
                loading.style.backgroundColor = this.loadingLabelBackColor;
                loading.style.fontSize = this.loadingLabelFontSize;
                loading.style.fontFamily = this.loadingLabelFontFamily;
                loading.style.color = this.loadingLabelFontColor;
                loading.style.padding = '2px';
            };
            loading.innerHTML = this.loadingLabelText;
            DayPilot.Util.addClass(loading, this.$4Y("_loading"));
            this.nav.loading = loading;
            this.nav.top.appendChild(loading);
        };
        this.$4F = function() {
            var $F = this.$4V();
            this.nav.corner.style.height = ($F) + "px";
            this.divTimeScroll.style.height = $F + "px";
            this.divNorth.style.height = $F + "px";
            if (this.nav.dh1 && this.nav.dh2) {
                this.nav.dh1.style.top = $F + "px";
                this.nav.dh2.style.top = $F + "px";
            };
            this.nav.loading.style.top = ($F + 5) + "px";
            this.nav.scroll.style.top = ($F + 1) + "px";
        };
        this.$6n = function() {
            this.$6k();
            var $R = this.$4W();
            var $H = $R;
            this.nav.corner.style.width = $R + "px";
            this.divCorner.style.width = $R + "px";
            this.divResScroll.style.width = $R + "px";
            this.nav.left.style.width = ($R) + "px";
            this.nav.right.style.marginLeft = ($R + 1) + "px";
            if (this.nav.message) {
                this.nav.message.style.paddingLeft = $R + "px";
            };
            if (this.nav.loading) {
                this.nav.loading.style.left = ($R + 5) + "px";
            };
            var $2l = function($C, $R) {
                if (!$C || !$C.style) {
                    return;
                };
                $P.style.width = $R + "px";
                $C.style.width = $R + "px";
                var $2b = $C.lastChild;
                if ($2b) {
                    $2b.style.width = $R + "px";
                }
            };
            var $1u = this.divHeader;
            $1u.style.width = $R + "px";
            for (var i = 0; i < $1u.rows.length; i++) {
                var $P = $1u.rows[i].cells[0];
                if ($P.colSpan > 1) {
                    var $C = $1u.rows[i].cells[0].firstChild;
                    $2l($C, $H);
                } else {
                    if (this.rowHeaderCols) {
                        for (var j = 0; j < $1u.rows[i].cells.length; j++) {
                            var $R = this.rowHeaderCols[j];
                            var $C = $1u.rows[i].cells[j].firstChild;
                            $2l($C, $R);
                        }
                    } else {
                        var $R = this.rowHeaderWidth;
                        var $C = $1u.rows[i].cells[0].firstChild;
                        $2l($C, $R);
                    }
                }
            };
            this.$6o();
        };
        this.$6M = function() {
            var $B = $b.nav.corner;
            var $2m = this.rowHeaderColumns;
            var $q = document.createElement("div");
            $q.style.position = "absolute";
            $q.style.bottom = "0px";
            $q.style.left = "0px";
            $q.style.width = "5000px";
            $q.style.height = this.headerHeight + "px";
            $q.style.overflow = "hidden";
            $q.className = this.$4Y("_columnheader");
            $B.appendChild($q);
            var $C = document.createElement("div");
            $C.style.position = "absolute";
            $C.style.top = "0px";
            $C.style.bottom = "0px";
            $C.style.left = "0px";
            $C.style.right = "0px";
            $C.className = this.$4Y("_columnheader_inner");
            $q.appendChild($C);
            var $2n = new DayPilot.Splitter($C);
            $2n.widths = DayPilot.Util.propArray($2m, "width");
            $2n.css.title = this.$4Y("_columnheader_cell");
            $2n.css.titleInner = this.$4Y("_columnheader_cell_inner");
            $2n.css.splitter = this.$4Y("_columnheader_splitter");
            $2n.titles = DayPilot.Util.propArray($2m, "title");
            $2n.updating = function($n) {
                DayPilot.Util.updatePropsFromArray($b.rowHeaderColumns, "width", this.widths);
                $b.$6n();
            };
            $2n.color = '#000000';
            $2n.opacity = 30;
            $2n.init();
            this.$6m = $2n;
        };
        this.$6I = function() {
            var $28 = this.$4W();
            var $B = document.createElement("div");
            $b.nav.corner = $B;
            $B.style.width = $28 + "px";
            $B.style.height = (this.$4V()) + "px";
            if (!this.cssOnly) {
                $B.style.backgroundColor = this.hourNameBackColor;
                $B.style.fontFamily = this.hourFontFamily;
                $B.style.fontSize = this.hourFontSize;
                $B.style.cursor = 'default';
            };
            $B.style.overflow = 'hidden';
            $B.style.position = 'relative';
            $B.className = this.cssOnly ? this.$4Y('_corner') : this.$4Y('corner');
            $B.setAttribute("unselectable", "on");
            $B.onmousemove = function() {
                $b.$6o();
                $b.$6p();
            };
            $B.oncontextmenu = function() {
                return false;
            };
            var $C = document.createElement("div");
            $C.style.position = "absolute";
            $C.style.top = "0px";
            $C.style.left = "0px";
            $C.style.right = "0px";
            $C.style.bottom = "0px";
            if (this.cssOnly) {
                $C.className = this.$4Y('_corner_inner');
            };
            this.divCorner = $C;
            $C.innerHTML = '&nbsp;';
            if (this.rowHeaderColumns && this.rowHeaderColumns.length > 0) {
                var $2o = document.createElement("div");
                $2o.style.position = "absolute";
                $2o.style.top = "0px";
                $2o.style.left = "0px";
                $2o.style.right = "0px";
                $2o.style.bottom = (this.headerHeight + 1) + "px";
                $B.appendChild($2o);
                var $2b = document.createElement("div");
                $2b.style.position = "absolute";
                $2b.style.left = "0px";
                $2b.style.right = "0px";
                $2b.style.height = "1px";
                $2b.style.bottom = (this.headerHeight) + "px";
                $2b.className = this.$4Y("_divider");
                $B.appendChild($2b);
                $2o.appendChild($C);
                this.$6M();
            } else {
                $B.appendChild($C);
            };
            var $2p = document.createElement("div");
            $2p.style.position = 'absolute';
            $2p.style.padding = '2px';
            $2p.style.top = '0px';
            $2p.style.left = '1px';
            $2p.style.backgroundColor = "#FF6600";
            $2p.style.color = "white";
            $2p.innerHTML = "\u0044\u0045\u004D\u004F";
            if (this.numberFormat) $B.appendChild($2p);
            return $B;
        };
        this.$4V = function() {
            if (this.timeHeader) {
                var $2q = this.timeHeader.length;
                if (!this.showBaseTimeHeader) {
                    $2q -= 1;
                };
                return $2q * this.headerHeight;
            };
            return 2 * this.headerHeight;
        };
        this.$6J = function() {
            var $B = document.createElement("div");
            if (!this.cssOnly) {
                $B.style.backgroundColor = this.hourNameBackColor;
            };
            $B.style.width = (this.$4W()) + "px";
            $B.style.height = this.$4Z() + "px";
            $B.style.overflow = 'hidden';
            $B.style.position = 'relative';
            $B.onmousemove = function() {
                $b.$6o();
                $b.$6p();
            };
            $B.oncontextmenu = function() {
                return false;
            };
            this.divResScroll = $B;
            this.scrollRes = $B;
            return $B;
        };
        this.$6N = function($B) {
            if ($0k.layout() === 'TableBased') {
                var $R = parseInt(this.width, 10);
                var $2r = (this.width.indexOf("%") !== -1);
                var $2s = /MSIE/i.test(navigator.userAgent);
                var $28 = this.$4W();
                if ($2r) {
                    if (this.nav.top && this.nav.top.offsetWidth > 0) {
                        $B.style.width = (this.nav.top.offsetWidth - 6 - $28) + "px";
                    }
                } else {
                    $B.style.width = ($R - $28) + "px";
                }
            }
        };
        this.$67 = function() {
            if ($b.$6F.layout() === 'TableBased') {
                $b.$6N($b.nav.scroll);
                $b.$6N($b.divTimeScroll);
            };
            $b.$4G();
            if ($b.cellWidthSpec === 'Auto') {
                $b.$4w();
                $b.$4B();
                $b.$4K();
            }
        };
        this.$4w = function() {
            if (this.cellWidthSpec !== 'Auto') {
                return;
            };
            var $H = this.nav.top.clientWidth;
            var $2t = this.$4W();
            var $0t = $H - $2t;
            var $P = $0t / this.$4U();
            this.cellWidth = Math.floor($P);
        };
        this.$6K = function() {
            var $B = document.createElement("div");
            $B.style.overflow = 'hidden';
            if (!this.cssOnly) {
                $B.style.backgroundColor = this.hourNameBackColor;
            };
            $B.style.position = 'absolute';
            $B.style.display = 'block';
            $B.style.top = "0px";
            $B.style.width = "100%";
            $B.style.height = this.$4V() + "px";
            $B.style.overflow = "hidden";
            $B.onmousemove = function() {
                $b.$6o();
                $b.$6p();
                if ($b.cellBubble) {
                    $b.cellBubble.delayedHide();
                }
            };
            this.$6N($B);
            this.divTimeScroll = $B;
            var $C = document.createElement("div");
            $C.style.width = (this.$4U() * this.cellWidth + 5000) + "px";
            this.divNorth = $C;
            $B.appendChild($C);
            return $B;
        };
        this.$4Z = function() {
            var $F;
            if (this.heightSpec === 'Fixed' || this.heightSpec === "Parent100Pct") {
                return this.height ? this.height : 0;
            } else {
                if (this.innerHeightTree) {
                    var $2u = DayPilot.sh($b.nav.scroll);
                    if ($2u === 0) {
                        $F = this.innerHeightTree;
                    } else {
                        $F = this.innerHeightTree + $2u;
                    }
                } else {
                    $F = this.rows.length * this.eventHeight;
                }
            };
            if (this.heightSpec === 'Max' && $F > this.height) {
                return this.height;
            };
            return $F;
        };
        this.$6O = function() {
            this.$6o();
            this.$6p();
        };
        this.$6L = function() {
            var $B = document.createElement("div");
            $B.style.overflow = "auto";
            $B.style.overflowX = "auto";
            $B.style.overflowY = "auto";
            $B.style.position = "absolute";
            $B.style.height = (this.$4Z()) + "px";
            $B.style.top = (this.$4V() + 1) + "px";
            $B.style.width = "100%";
            if (!this.cssOnly) {
                $B.style.backgroundColor = this.emptyBackColor;
            };
            $B.className = this.$4Y("_scrollable");
            $B.oncontextmenu = function() {
                return false;
            };
            this.$6N($B);
            this.nav.scroll = $B;
            this.maind = document.createElement("div");
            this.maind.style.MozUserSelect = "none";
            this.maind.style.KhtmlUserSelect = "none";
            this.maind.style.WebkitUserSelect = "none";
            this.maind.style.position = 'absolute';
            this.maind.style.width = (this.$4U() * this.cellWidth) + "px";
            this.maind.setAttribute("unselectable", "on");
            this.maind.onmousedown = this.$6P;
            this.maind.onmousemove = this.$6Q;
            this.maind.oncontextmenu = this.$6R;
            this.maind.ondblclick = this.$6S;
            this.maind.className = this.$4Y("_matrix");
            this.divStretch = document.createElement("div");
            this.divStretch.style.position = 'absolute';
            this.divStretch.style.height = '1px';
            this.maind.appendChild(this.divStretch);
            this.divCells = document.createElement("div");
            this.divCells.style.position = 'absolute';
            this.divCells.oncontextmenu = this.$6R;
            this.maind.appendChild(this.divCells);
            this.divLines = document.createElement("div");
            this.divLines.style.position = 'absolute';
            this.divLines.oncontextmenu = this.$6R;
            this.maind.appendChild(this.divLines);
            this.divBreaks = document.createElement("div");
            this.divBreaks.style.position = 'absolute';
            this.divBreaks.oncontextmenu = this.$6R;
            this.maind.appendChild(this.divBreaks);
            this.divSeparators = document.createElement("div");
            this.divSeparators.style.position = 'absolute';
            this.divSeparators.oncontextmenu = this.$6R;
            this.maind.appendChild(this.divSeparators);
            this.divCrosshair = document.createElement("div");
            this.divCrosshair.style.position = 'absolute';
            this.divCrosshair.ondblclick = this.$6S;
            this.maind.appendChild(this.divCrosshair);
            this.divRange = document.createElement("div");
            this.divRange.style.position = 'absolute';
            this.divRange.oncontextmenu = this.$6R;
            this.maind.appendChild(this.divRange);
            this.divEvents = document.createElement("div");
            this.divEvents.style.position = 'absolute';
            this.maind.appendChild(this.divEvents);
            this.divSeparatorsAbove = document.createElement("div");
            this.divSeparatorsAbove.style.position = 'absolute';
            this.divSeparatorsAbove.oncontextmenu = this.$6R;
            this.maind.appendChild(this.divSeparatorsAbove);
            $B.appendChild(this.maind);
            return $B;
        };
        this.$5U = function() {
            if (this.loadingLabelVisible) {
                $b.nav.loading.innerHTML = this.loadingLabelText;
                $b.nav.loading.style.display = '';
            }
        };
        this.$4s = function($17) {
            if (this.callbackTimeout) {
                window.clearTimeout(this.callbackTimeout);
            };
            if ($17) {
                this.nav.loading.innerHTML = $17;
                window.setTimeout(function() {
                    $b.$4s();
                }, 1000);
            } else {
                this.nav.loading.style.display = 'none';
            }
        };
        this.$6T = function() {
            this.startDate = new DayPilot.Date(this.startDate).getDatePart();
        };
        this.$4R = function($2v) {
            if ($2v) {
                this.autoRefreshEnabled = true;
            };
            if (!this.autoRefreshEnabled) {
                return;
            };
            if (this.autoRefreshCount >= this.autoRefreshMaxCount) {
                return;
            };
            this.$5T();
            var $2w = this.autoRefreshInterval;
            if (!$2w || $2w < 10) {
                throw "The minimum autoRefreshInterval is 10 seconds";
            };
            this.autoRefreshTimeout = window.setTimeout(function() {
                $b.$6U();
            }, this.autoRefreshInterval * 1000);
        };
        this.$5T = function() {
            if (this.autoRefreshTimeout) {
                window.clearTimeout(this.autoRefreshTimeout);
            }
        };
        this.$6U = function() {
            if (!DayPilotScheduler.resizing && !DayPilotScheduler.moving && !DayPilotScheduler.drag && !DayPilotScheduler.range) {
                var $2x = false;
                if (typeof this.onAutoRefresh === 'function') {
                    var $n = {};
                    $n.i = this.autoRefreshCount;
                    $n.preventDefault = function() {
                        this.preventDefault.value = true;
                    };
                    $b.onAutoRefresh($n);
                    if ($n.preventDefault.value) {
                        $2x = true;
                    }
                };
                if (!$2x) {
                    this.commandCallBack(this.autoRefreshCommand);
                };
                this.autoRefreshCount++;
            };
            if (this.autoRefreshCount < this.autoRefreshMaxCount) {
                this.autoRefreshTimeout = window.setTimeout(function() {
                    $b.$6U();
                }, this.autoRefreshInterval * 1000);
            }
        };
        this.$6V = function() {
            if (!DayPilotScheduler.globalHandlers) {
                DayPilotScheduler.globalHandlers = true;
                DayPilot.re(document, 'mousemove', DayPilotScheduler.gMouseMove);
                DayPilot.re(document, 'mouseup', DayPilotScheduler.gMouseUp);
            };
            DayPilot.re(window, 'resize', this.$67);
        };
        this.$6W = function() {
            this.nav.scroll.root = this;
            this.nav.scroll.onscroll = this.$6X;
            $b.scrollPos = this.nav.scroll.scrollLeft;
            $b.scrollTop = this.nav.scroll.scrollTop;
            $b.scrollWidth = this.divNorth.clientWidth;
        };
        this.$4P = function() {
            var $K = new Date();
            var $2y = {};
            $2y.scrollX = this.nav.scroll.scrollLeft;
            $2y.scrollY = this.nav.scroll.scrollTop;
            if (this.syncResourceTree) {
                $2y.tree = this.$61();
            };
            this.nav.state.value = DayPilot.he(DayPilot.JSON.stringify($2y));
            var end = new Date();
        };
        this.$4L = function() {
            if (!this.separators) {
                return;
            };
            for (var i = 0; i < this.separators.length; i++) {
                this.$6Y(i);
            }
        };
        this.batch = {};
        this.batch.step = 300;
        this.batch.delay = 10;
        this.batch.mode = "display";
        this.batch.layers = true;
        this.$4M = function($0w) {
            var $2z = this.batch.step;
            var $2A = this.batch.layers;
            if ($2A) {
                $b.divEvents = document.createElement("div");
                $b.divEvents.style.position = 'absolute';
                $b.maind.appendChild(this.divEvents);
            } else {};
            if (this.batch.mode === 'display') {
                this.divEvents.style.display = 'none';
            } else if (this.batch.mode === 'visibility') {
                this.divEvents.style.visibility = 'hidden';
            };
            var $2B = this.dynamicEventRendering === 'Progressive';
            var top = this.nav.scroll.scrollTop;
            var $A = top + this.nav.scroll.clientHeight;
            var $2C = this.durationBarDetached ? 10 : 0;
            if (this.clientSide) {
                for (var i = 0; i < this.rows.length; i++) {
                    var $q = this.rows[i];
                    var $2D = $q.Top - this.dynamicEventRenderingMargin;
                    var $2E = $2D + $q.Height + 2 * this.dynamicEventRenderingMargin;
                    if ($2B && ($A <= $2D || top >= $2E)) {
                        continue;
                    };
                    for (var j = 0; j < $q.lines.length; j++) {
                        var $Q = $q.lines[j];
                        for (var k = 0; k < $Q.length; k++) {
                            var e = $Q[k];
                            if (!e.part.top) {
                                e.part.line = j;
                                e.part.top = j * (this.eventHeight + $2C) + $2C;
                                e.part.detachedBarTop = e.part.top - $2C;
                                e.part.height = this.eventHeight;
                                e.part.right = e.part.left + e.part.width;
                                e.part.fullTop = this.rows[e.part.dayIndex].Top + e.Top;
                                e.part.fullBottom = e.part.fullTop + e.part.height;
                            };
                            var $2F = this.$6Z(e);
                            if ($0w && $2F) {
                                $2z--;
                                if ($2z <= 0) {
                                    this.divEvents.style.visibility = '';
                                    this.divEvents.style.display = '';
                                    window.setTimeout(function() {
                                        $b.$4M($0w);
                                    }, $b.batch.delay);
                                    return;
                                }
                            }
                        }
                    }
                }
            } else {
                var $2G = this.events.list.length;
                for (var i = 0; i < $2G; i++) {
                    this.$6Z(this.events.list[i]);
                }
            };
            this.divEvents.style.display = '';
            this.$4s();
        };
        this.$5C = function($2H) {
            var $q = this.rows[$2H];
            this.divEvents = document.createElement("div");
            this.divEvents.style.position = 'absolute';
            this.divEvents.style.display = 'none';
            this.maind.appendChild(this.divEvents);
            var $2C = this.durationBarDetached ? 10 : 0;
            for (var j = 0; j < $q.lines.length; j++) {
                var $Q = $q.lines[j];
                for (var k = 0; k < $Q.length; k++) {
                    var e = $Q[k];
                    e.part.line = j;
                    e.part.top = j * (this.eventHeight + $2C) + $2C;
                    e.part.detachedBarTop = e.part.top - $2C;
                    e.part.height = this.eventHeight;
                    e.part.right = e.part.left + e.part.width;
                    e.part.fullTop = this.rows[e.part.dayIndex].Top + e.Top;
                    e.part.fullBottom = e.part.fullTop + e.part.height;
                    this.$6Z(e);
                }
            };
            this.divEvents.style.display = '';
        };
        this.$4I = function() {
            if (this.elements.events) {
                var length = this.elements.events.length;
                for (var i = 0; i < length; i++) {
                    var $B = this.elements.events[i];
                    this.$70($B);
                }
            };
            this.elements.events = [];
        };
        this.$5B = function($2H) {
            if (this.elements.events) {
                var length = this.elements.events.length;
                var $2I = [];
                for (var i = 0; i < length; i++) {
                    var $B = this.elements.events[i];
                    if ($B.row === $2H) {
                        this.$70($B);
                        $2I.push(i);
                    }
                };
                for (var i = $2I.length - 1; i >= 0; i--) {
                    this.elements.events.splice($2I[i], 1);
                }
            }
        };
        this.$70 = function($B) {
            $B.onclick = null;
            $B.oncontextmenu = null;
            $B.onmouseover = null;
            $B.onmouseout = null;
            $B.onmousemove = null;
            $B.onmousedown = null;
            $B.ondblclick = null;
            if ($B.event) {
                if (!$B.isBar) {
                    $B.event.rendered = null;
                };
                $B.event = null;
            };
            if ($B.bar) {
                DayPilot.de($B.bar);
            };
            if ($B.parentNode) {
                $B.parentNode.removeChild($B);
            }
        };
        this.$71 = function($2J) {
            if (!$2J) {
                $2J = 0;
            };
            if (this.dynamicEventRendering !== 'Progressive') {
                return;
            };
            this.divEvents.style.display = 'none';
            var $0v = [];
            var $2K = 0;
            var length = this.elements.events.length;
            for (var i = length - 1; i >= 0; i--) {
                var $B = this.elements.events[i];
                if (this.$72($B.event)) {
                    if ($2J > 0) {
                        $2J--;
                        $0v.unshift($B);
                    } else {
                        this.$70($B);
                        $2K++;
                    }
                } else {
                    $0v.unshift($B);
                }
            };
            this.elements.events = $0v;
            this.divEvents.style.display = '';
        };
        this.$4J = function() {
            if (this.elements.separators) {
                for (var i = 0; i < this.elements.separators.length; i++) {
                    var $B = this.elements.separators[i];
                    DayPilot.pu($B);
                    $B.parentNode.removeChild($B);
                }
            };
            this.elements.separators = [];
        };
        this.$73 = function() {
            var $2B = this.dynamicEventRendering === 'Progressive';
            if (!this.nav.scroll) {
                return false;
            };
            var top = this.nav.scroll.scrollTop;
            var $A = top + this.nav.scroll.clientHeight;
            for (var i = 0; i < this.rows.length; i++) {
                var $q = this.rows[i];
                var $2D = $q.Top;
                var $2E = $q.Top + $q.Height;
                if ($2B && ($A <= $2D || top >= $2E)) {
                    continue;
                };
                for (var j = 0; j < $q.lines.length; j++) {
                    var $Q = $q.lines[j];
                    for (var k = 0; k < $Q.length; k++) {
                        var e = $Q[k];
                        if (this.$74(e)) {
                            return true;
                        }
                    }
                }
            };
            return false;
        };
        this.$74 = function($j) {
            if ($j.rendered) {
                return false;
            };
            var $2B = this.dynamicEventRendering === 'Progressive';
            var $y = this.nav.scroll.scrollLeft;
            var $z = $y + this.nav.scroll.clientWidth;
            var $2L = $j.Left;
            var $2M = $j.Left + $j.Width;
            if ($2B && ($z <= $2L || $y >= $2M)) {
                return false;
            };
            return true;
        };
        this.$72 = function($j) {
            if (!$j.rendered) {
                return true;
            };
            var top = this.nav.scroll.scrollTop;
            var $A = top + this.nav.scroll.clientHeight;
            var $y = this.nav.scroll.scrollLeft;
            var $z = $y + this.nav.scroll.clientWidth;
            var $2L = $j.Left;
            var $2M = $j.Right;
            var $2N = $j.FullTop;
            var $2O = $j.FullBottom;
            if ($z <= $2L || $y >= $2M) {
                return true;
            };
            if ($A <= $2N || top >= $2O) {
                return true;
            };
            return false;
        };
        this.$6Z = function($j) {
            if ($j.rendered) {
                return false;
            };
            var $2B = this.dynamicEventRendering === 'Progressive' && !this.dynamicLoading;
            var $y = this.nav.scroll.scrollLeft - this.dynamicEventRenderingMargin;
            var $z = $y + this.nav.scroll.clientWidth + 2 * this.dynamicEventRenderingMargin;
            var $2L = $j.part.left;
            var $2M = $j.part.left + $j.part.width;
            if ($2B && ($z <= $2L || $y >= $2M)) {
                return false;
            };
            var $2H = $j.part.dayIndex;
            var $2P = !this.cssOnly && this.eventBorderVisible;
            var $R = $j.part.width;
            var $F = $j.part.height;
            if ($2P) {
                $R -= 2;
                $F -= 2;
            };
            var $V = $j.cache || $j.data;
            $R = Math.max(0, $R);
            $F = Math.max(0, $F);
            var $q = this.rows[$2H];
            if ($q.Hidden) {
                return false;
            };
            var $2D = $q.Top;
            var $B = document.createElement("div");
            var $2Q = this.durationBarDetached;
            if ($2Q) {
                var $2R = document.createElement("div");
                $2R.style.position = 'absolute';
                $2R.style.left = ($j.part.left + $j.part.barLeft) + 'px';
                $2R.style.top = ($2D + $j.part.detachedBarTop) + 'px';
                $2R.style.width = $j.part.barWidth + 'px';
                $2R.style.height = 5 + 'px';
                $2R.style.backgroundColor = "red";
                $B.bar = $2R;
                this.elements.bars.push($2R);
                this.divEvents.appendChild($2R);
            };
            $B.style.position = 'absolute';
            $B.style.left = $j.part.left + 'px';
            $B.style.top = ($2D + $j.part.top) + 'px';
            $B.style.width = $R + 'px';
            $B.style.height = $F + 'px';
            if (!this.cssOnly) {
                if ($b.eventBorderVisible) {
                    $B.style.border = '1px solid ' + ($V.borderColor || this.eventBorderColor);
                };
                $B.style.backgroundColor = $j.client.backColor();
                $B.style.fontSize = this.eventFontSize;
                $B.style.cursor = 'default';
                $B.style.fontFamily = this.eventFontFamily;
                $B.style.color = $V.fontColor || this.eventFontColor;
                if ($V.backImage && !this.durationBarVisible) {
                    $B.style.backgroundImage = "url(" + $V.backImage + ")";
                    if ($V.backRepeat) {
                        $B.style.backgroundRepeat = $V.backRepeat;
                    }
                };
                if (this.$6F.rounded()) {
                    $B.style.MozBorderRadius = "5px";
                    $B.style.webkitBorderRadius = "5px";
                    $B.style.borderRadius = "5px";
                }
            };
            $B.style.whiteSpace = 'nowrap';
            $B.style.overflow = 'hidden';
            $B.className = this.cssOnly ? this.$4Y("_event") : this.$4Y("event");
            if ($V.cssClass) {
                DayPilot.Util.addClass($B, $V.cssClass);
            };
            var $2S = true;
            if ($2S) {
                DayPilot.Util.addClass($B, this.$4Y("_event_line" + $j.part.line));
            };
            $B.setAttribute("unselectable", "on");
            if (this.showToolTip) {
                $B.title = $j.client.toolTip();
            };
            $B.onmousemove = this.$75;
            $B.onmouseout = this.$76;
            $B.onmousedown = this.$77;
            $B.ontouchstart = $07.onEventTouchStart;
            $B.ontouchmove = $07.onEventTouchMove;
            $B.ontouchend = $07.onEventTouchEnd;
            if ($j.client.clickEnabled()) {
                $B.onclick = this.$57;
            };
            if ($j.client.doubleClickEnabled()) {
                $B.ondblclick = this.$5h;
            };
            $B.oncontextmenu = this.$5g;
            var $2T = [];
            var $2U = 0;
            if (this.cssOnly) {
                var $C = document.createElement("div");
                $C.setAttribute("unselectable", "on");
                $C.className = $b.$4Y("_event_inner");
                $C.innerHTML = $j.client.innerHTML();
                if ($V.backColor) {
                    $C.style.background = $V.backColor;
                };
                if ($V.borderColor) {
                    $C.style.borderColor = $V.borderColor;
                };
                if ($V.backImage) {
                    $C.style.backgroundImage = "url(" + $V.backImage + ")";
                    if ($V.backRepeat) {
                        $C.style.backgroundRepeat = $V.backRepeat;
                    }
                };
                $B.appendChild($C);
                var $2V = $j.start().getTime() === $j.part.start.getTime();
                var $2W = $j.end().getTime() === $j.part.end.getTime();
                if (!$2V) {
                    DayPilot.Util.addClass($B, this.$4Y("_event_continueleft"));
                };
                if (!$2W) {
                    DayPilot.Util.addClass($B, this.$4Y("_event_continueright"));
                };
                if ($j.client.barVisible()) {
                    var $2X = 100 * $j.part.barLeft / ($R);
                    var $2Y = Math.ceil(100 * $j.part.barWidth / ($R));
                    if (this.durationBarMode === "PercentComplete") {
                        $2X = 0;
                        $2Y = $V.complete;
                    };
                    var $2R = document.createElement("div");
                    $2R.setAttribute("unselectable", "on");
                    $2R.className = this.$4Y("_event_bar");
                    $2R.style.position = "absolute";
                    var $2Z = document.createElement("div");
                    $2Z.setAttribute("unselectable", "on");
                    $2Z.className = this.$4Y("_event_bar_inner");
                    $2Z.style.left = $2X + "%";
                    if (0 < $2Y && $2Y <= 1) {
                        $2Z.style.width = "1px";
                    } else {
                        $2Z.style.width = $2Y + "%";
                    };
                    if ($V.barColor) {
                        $2Z.style.backgroundColor = $V.barColor;
                    };
                    $2R.appendChild($2Z);
                    $B.appendChild($2R);
                }
            } else {
                if ($j.client.barVisible()) {
                    $2U = $b.durationBarHeight;
                    $2T.push("<div unselectable='on' style='left:0px;background-color:white;width:");
                    $2T.push($j.part.barLeft);
                    $2T.push("px;height:2px;font-size:1px;position:absolute'></div>");
                    $2T.push("<div unselectable='on' style='left:");
                    $2T.push($j.part.barLeft + $j.part.barWidth);
                    $2T.push("px;background-color:white;width:");
                    $2T.push($R - ($j.part.barLeft + $j.part.barWidth));
                    $2T.push("px;height:2px;font-size:1px;position:absolute'></div>");
                    if (this.durationBarMode === "Duration") {
                        $2T.push("<div unselectable='on' style='width:");
                        $2T.push($j.part.barWidth);
                        $2T.push("px;margin-left:");
                        $2T.push($j.part.barLeft);
                        $2T.push("px;height:");
                    } else {
                        $2T.push("<div unselectable='on' style='width:");
                        $2T.push($V.complete);
                        $2T.push("%;margin-left:0px;height:");
                    };
                    $2T.push($2U - 1);
                    $2T.push("px;background-color:");
                    $2T.push($j.client.barColor());
                    if ($V.barImageUrl) {
                        $2T.push(";background-image:url(");
                        $2T.push($V.barImageUrl);
                        $2T.push(")");
                    };
                    $2T.push(";font-size:1px;position:relative'></div>");
                    $2T.push("<div unselectable='on' style='width:");
                    $2T.push($R);
                    $2T.push("px;height:1px;background-color:");
                    $2T.push(($V.borderColor || this.eventBorderColor));
                    $2T.push(";font-size:1px;overflow:hidden;position:relative'></div>");
                };
                $2T.push("<div unselectable='on' style='padding-left:1px;width:");
                $2T.push($R - 1);
                $2T.push("px;height:");
                $2T.push($F - $2U);
                $2T.push("px;");
                if ($b.rtl) {
                    $2T.push("direction:rtl;");
                };
                if ($V.backImage && this.durationBarVisible) {
                    $2T.push("background-image:url(");
                    $2T.push($V.backImage);
                    $2T.push(");");
                    if ($V.backRepeat) {
                        $2T.push("background-repeat:");
                        $2T.push($V.backRepeat);
                        $2T.push(";");
                    }
                };
                $2T.push("'>");
                $2T.push($j.client.innerHTML());
                $2T.push("</div>");
                $B.innerHTML = $2T.join('');
            };
            $B.row = $2H;
            if ($V.areas) {
                for (var i = 0; i < $V.areas.length; i++) {
                    var $0J = $V.areas[i];
                    if ($0J.v !== 'Visible') {
                        continue;
                    };
                    var a = DayPilot.Areas.createArea($B, $j, $0J);
                    $B.appendChild(a);
                }
            };
            this.elements.events.push($B);
            this.divEvents.appendChild($B);
            $j.rendered = true;
            $B.event = $j;
            if ($b.multiselect.$5t($B.event)) {
                $b.multiselect.add($B.event, true);
                $b.multiselect.$5s($B);
            };
            if ($b.$4S()) {
                if (typeof $b.onAfterEventRender === 'function') {
                    var $n = {};
                    $n.e = $B.event;
                    $n.div = $B;
                    $b.onAfterEventRender($n);
                }
            } else {
                if ($b.afterEventRender) {
                    $b.afterEventRender($B.event, $B);
                }
            };
            return true;
        };
        this.$4S = function() {
            return $b.api === 2;
        };
        this.$5D = function() {
            for (var i = 0; i < this.elements.events.length; i++) {
                var $B = this.elements.events[i];
                var event = $B.event;
                var $2H = event.part.dayIndex;
                var $q = this.rows[$2H];
                var $2D = $q.Top;
                $B.style.top = ($2D + event.part.top) + 'px';
            }
        };
        this.$78 = function(e) {
            for (var i = 0; i < $b.elements.events.length; i++) {
                var $B = $b.elements.events[i];
                if ($B.event === e) {
                    return $B;
                }
            };
            return null;
        };
        this.$76 = function(ev) {
            var $B = this;
            DayPilot.Areas.hideAreas($B, ev);
            if ($b.cssOnly) {
                DayPilot.Util.removeClass($B, $b.$4Y("_event_hover"));
            };
            if ($b.bubble && $b.eventHoverHandling === 'Bubble') {
                $b.bubble.hideOnMouseOut();
            }
        };
        this.$75 = function(ev) {
            ev = ev || window.event;
            if ($b.cellBubble) {
                $b.cellBubble.delayedHide();
            };
            var $B = this;
            while ($B && !$B.event) {
                $B = $B.parentNode;
            };
            $b.$79($B, ev);
            if (!$B.active) {
                DayPilot.Areas.showAreas($B, $B.event);
                if ($b.cssOnly) {
                    DayPilot.Util.addClass($B, $b.$4Y("_event_hover"));
                }
            };
            if (ev.srcElement) {
                ev.srcElement.insideEvent = true;
            } else {
                ev.insideEvent = true;
            }
        };
        this.$7a = {};
        var $08 = this.$7a;
        this.$77 = function(ev) {
            $b.$6o();
            $b.$6p();
            if (typeof DayPilot.Bubble !== 'undefined') {
                DayPilot.Bubble.hideActive();
            };
            ev = ev || window.event;
            var $30 = ev.which || ev.button;
            if ($30 === 1) {
                if (this.style.cursor === 'w-resize' || this.style.cursor === 'e-resize') {
                    DayPilotScheduler.resizing = this;
                    DayPilotScheduler.originalMouse = DayPilot.mc(ev);
                    document.body.style.cursor = this.style.cursor;
                } else if (this.style.cursor === 'move') {
                    DayPilotScheduler.moving = this;
                    DayPilotScheduler.originalMouse = DayPilot.mc(ev);
                    DayPilotScheduler.moveOffsetX = DayPilot.mo3(this, ev).x;
                    DayPilotScheduler.moveDragStart = $b.getDate($b.coords.x, true);
                    document.body.style.cursor = 'move';
                } else if ($b.moveBy === 'Full') {
                    $08.start = true;
                    $08.moving = this;
                    $08.originalMouse = DayPilot.mc(ev);
                    $08.moveOffsetX = DayPilot.mo3(this, ev).x;
                    $08.moveDragStart = $b.getDate($b.coords.x, true);
                }
            };
            ev.cancelBubble = true;
            return false;
        };
        this.$7b = {};
        var $07 = $b.$7b;
        $07.active = false;
        $07.start = false;
        $07.timeouts = [];
        $07.onEventTouchStart = function(ev) {
            if ($07.active || $07.start) {
                return;
            };
            $07.clearTimeouts();
            $07.start = true;
            $07.active = false;
            var $B = this;
            var $31 = 500;
            $07.timeouts.push(window.setTimeout(function() {
                $07.active = true;
                $07.start = false;
                $b.coords = $07.relativeCoords(ev);
                $07.startMoving($B, ev);
                ev.preventDefault();
            }, $31));
            ev.stopPropagation();
        };
        $07.onEventTouchMove = function(ev) {
            $07.clearTimeouts();
            $07.start = false;
        };
        $07.onEventTouchEnd = function(ev) {
            $07.clearTimeouts();
            if ($07.start) {
                $b.$5b(this, false);
            };
            window.setTimeout(function() {
                $07.start = false;
                $07.active = false;
            }, 500);
        };
        $07.onMainTouchStart = function(ev) {
            if ($07.active || $07.start) {
                return;
            };
            $07.clearTimeouts();
            $07.start = true;
            $07.active = false;
            var $31 = 500;
            $07.timeouts.push(window.setTimeout(function() {
                $07.active = true;
                $07.start = false;
                ev.preventDefault();
                $b.coords = $07.relativeCoords(ev);
                $07.range = $b.$7c();
            }, $31));
        };
        $07.onMainTouchMove = function(ev) {
            $07.clearTimeouts();
            $07.start = false;
            if ($07.active) {
                ev.preventDefault();
                $b.coords = $07.relativeCoords(ev);
                if (DayPilotScheduler.moving) {
                    $07.updateMoving();
                    return;
                };
                if ($07.range) {
                    var $0B = $07.range;
                    $0B.end = {
                        x: Math.floor($b.coords.x / $b.cellWidth)
                    };
                    $b.$7d($0B);
                }
            }
        };
        $07.onMainTouchEnd = function(ev) {
            $07.clearTimeouts();
            if ($07.active) {
                if (DayPilotScheduler.moving) {
                    ev.preventDefault();
                    var e = DayPilotScheduler.moving.event;
                    var $0f = DayPilotScheduler.movingShadow.start;
                    var $0g = DayPilotScheduler.movingShadow.end;
                    var $0i = ($b.viewType !== 'Days') ? DayPilotScheduler.movingShadow.row.Value : null;
                    var external = DayPilotScheduler.drag ? true : false;
                    DayPilot.de(DayPilotScheduler.movingShadow);
                    DayPilotScheduler.movingShadow.calendar = null;
                    document.body.style.cursor = '';
                    DayPilotScheduler.moving = null;
                    DayPilotScheduler.movingShadow = null;
                    $b.$5E(e, $0f, $0g, $0i, external);
                };
                if ($07.range) {
                    var $32 = $b.$7e($07.range);
                    $07.range = null;
                    $b.$5I($32.start, $32.end, $32.resource);
                }
            };
            window.setTimeout(function() {
                $07.start = false;
                $07.active = false;
            }, 500);
        };
        $07.clearTimeouts = function() {
            for (var i = 0; i < $07.timeouts.length; i++) {
                clearTimeout($07.timeouts[i]);
            };
            $07.timeouts = [];
        };
        $07.relativeCoords = function(ev) {
            var $33 = $b.maind;
            var x = ev.touches[0].pageX;
            var y = ev.touches[0].pageY;
            var $34 = DayPilot.abs($33);
            var $0W = {
                x: x - $34.x,
                y: y - $34.y,
                toString: function() {
                    return "x: " + this.x + ", y:" + this.y;
                }
            };
            return $0W;
        };
        $07.startMoving = function($B, ev) {
            var $0W = {
                x: ev.touches[0].pageX,
                y: ev.touches[0].pageY
            };
            DayPilotScheduler.moving = $B;
            DayPilotScheduler.originalMouse = $0W;
            var $35 = DayPilot.abs($B);
            DayPilotScheduler.moveOffsetX = $0W.x - $35.x;
            DayPilotScheduler.moveDragStart = $b.getDate($b.coords.x, true);
            DayPilotScheduler.movingShadow = $b.$68($B, $b.shadow);
            $b.$6j();
        };
        $07.updateMoving = function() {
            if (DayPilotScheduler.movingShadow && DayPilotScheduler.movingShadow.calendar !== $b) {
                DayPilotScheduler.movingShadow.calendar = null;
                DayPilot.de(DayPilotScheduler.movingShadow);
                DayPilotScheduler.movingShadow = null;
            };
            if (!DayPilotScheduler.movingShadow) {
                var mv = DayPilotScheduler.moving;
                DayPilotScheduler.movingShadow = $b.$68(mv, $b.shadow);
            };
            DayPilotScheduler.moving.target = $b;
            $b.$6j();
        };
        this.$79 = function($B, ev) {
            var $36 = this.eventResizeMargin;
            var $37 = this.eventMoveMargin;
            var $0U = $B;
            if (typeof(DayPilotScheduler) === 'undefined') {
                return;
            };
            var $01 = DayPilot.mo3($B, ev);
            if (!$01) {
                return;
            };
            $b.eventOffset = $01;
            if (DayPilotScheduler.resizing) {
                return;
            };
            var $38 = $B.getAttribute("dpStart") === $B.getAttribute("dpPartStart");
            var $39 = $B.getAttribute("dpEnd") === $B.getAttribute("dpPartEnd");
            if ($b.moveBy === 'Top' && $01.y <= $37 && $0U.event.client.moveEnabled() && $b.eventMoveHandling !== 'Disabled') {
                if ($38) {
                    $B.style.cursor = 'move';
                } else {
                    $B.style.cursor = 'not-allowed';
                }
            } else if ($b.moveBy === 'Top' && $01.x <= $36 && $0U.event.client.resizeEnabled() && $b.eventResizeHandling !== 'Disabled') {
                if ($38) {
                    $B.style.cursor = "w-resize";
                    $B.dpBorder = 'left';
                } else {
                    $B.style.cursor = 'not-allowed';
                }
            } else if ($b.moveBy === 'Left' && $01.x <= $37 && $0U.event.client.moveEnabled() && $b.eventMoveHandling !== 'Disabled') {
                if ($38) {
                    $B.style.cursor = "move";
                } else {
                    $B.style.cursor = 'not-allowed';
                }
            } else if ($B.offsetWidth - $01.x <= $36 && $0U.event.client.resizeEnabled() && $b.eventResizeHandling !== 'Disabled') {
                if ($39) {
                    $B.style.cursor = "e-resize";
                    $B.dpBorder = 'right';
                } else {
                    $B.style.cursor = 'not-allowed';
                }
            } else if (!DayPilotScheduler.resizing && !DayPilotScheduler.moving) {
                if ($0U.event.client.clickEnabled() && $b.eventClickHandling !== 'Disabled') {
                    $B.style.cursor = 'pointer';
                } else {
                    $B.style.cursor = 'default';
                }
            };
            if (typeof(DayPilotBubble) !== 'undefined' && $b.bubble && $b.eventHoverHandling === 'Bubble') {
                if ($B.style.cursor === 'default' || $B.style.cursor === 'pointer') {
                    var $3a = this.$7f && $01.x === this.$7f.x && $01.y === this.$7f.y;
                    if (!$3a) {
                        this.$7f = $01;
                        $b.bubble.showEvent($B.event);
                    }
                } else {}
            }
        };
        this.$4U = function() {
            if (this.viewType !== 'Days') {
                return this.timeline.length;
            } else {
                return Math.floor(24 * 60 / this.cellDuration);
            }
        };
        this.$7e = function($0B) {
            var $0B = $0B || DayPilotScheduler.range || DayPilotScheduler.rangeHold;
            if (!$0B) {
                return null;
            };
            var $q = $b.rows[$0B.start.y];
            if (!$q) {
                return null;
            };
            var $0A = $q.Value;
            var $3b = $0B.end.x > $0B.start.x ? $0B.start.x : $0B.end.x;
            var $3c = ($0B.end.x > $0B.start.x ? $0B.end.x : $0B.start.x);
            var $1h = $q.Start.getTime() - this.startDate.getTime();
            var $K = this.timeline[$3b].start.addTime($1h);
            var end = this.timeline[$3c].end.addTime($1h);
            return new DayPilot.Selection($K, end, $0A, $b);
        };
        this.$7g = function($0U) {
            var $3d = $0U.parentNode;
            var $3e = document.createElement('textarea');
            $3e.style.position = 'absolute';
            $3e.style.width = (($0U.offsetWidth < 100) ? 100 : ($0U.offsetWidth - 2)) + 'px';
            $3e.style.height = ($0U.offsetHeight - 2) + 'px';
            $3e.style.fontFamily = DayPilot.gs($0U, 'fontFamily') || DayPilot.gs($0U, 'font-family');
            $3e.style.fontSize = DayPilot.gs($0U, 'fontSize') || DayPilot.gs($0U, 'font-size');
            $3e.style.left = $0U.offsetLeft + 'px';
            $3e.style.top = $0U.offsetTop + 'px';
            $3e.style.border = '1px solid black';
            $3e.style.padding = '0px';
            $3e.style.marginTop = '0px';
            $3e.style.backgroundColor = 'white';
            $3e.value = DayPilot.tr($0U.event.text());
            $3e.event = $0U.event;
            $3d.appendChild($3e);
            return $3e;
        };
        this.$5c = function($0U) {
            if (DayPilotScheduler.editing) {
                DayPilotScheduler.editing.blur();
                return;
            };
            var $3e = this.$7g($0U);
            DayPilotScheduler.editing = $3e;
            $3e.onblur = function() {
                var $3f = $0U.event.text();
                var $0C = $3e.value;
                DayPilotScheduler.editing = null;
                if ($3e.parentNode) {
                    $3e.parentNode.removeChild($3e);
                };
                if ($3f === $0C) {
                    return;
                };
                $0U.style.display = 'none';
                $b.$5Q($0U.event, $0C);
            };
            $3e.onkeypress = function(e) {
                var $3g = (window.event) ? event.keyCode : e.keyCode;
                if ($3g === 13) {
                    this.onblur();
                    return false;
                } else if ($3g === 27) {
                    $3e.parentNode.removeChild($3e);
                    DayPilotScheduler.editing = false;
                };
                return true;
            };
            $3e.select();
            $3e.focus();
        };
        this.$6q = function(ev) {
            var td = this;
            if (typeof(DayPilotBubble) !== 'undefined') {
                if ($b.cellBubble) {
                    $b.cellBubble.hideOnMouseOut();
                };
                if ($b.resourceBubble) {
                    var $0K = {};
                    $0K.calendar = $b;
                    $0K.id = td.getAttribute("resource");
                    $0K.toJSON = function() {
                        var $0G = {};
                        $0G.id = this.id;
                        return $0G;
                    };
                    $b.resourceBubble.showResource($0K);
                }
            };
            var $B = td.firstChild;
            if (!$B.active) {
                DayPilot.Areas.showAreas($B, $b.rows[td.index]);
            }
        };
        this.$6r = function(ev) {
            var td = this;
            if (typeof(DayPilotBubble) !== 'undefined' && $b.resourceBubble) {
                $b.resourceBubble.hideOnMouseOut();
            };
            var $B = td.firstChild;
            DayPilot.Areas.hideAreas($B, ev);
            $B.data = null;
        };
        this.$4B = function() {
            var $1u = document.createElement("table");
            $1u.cellSpacing = 0;
            $1u.cellPadding = 0;
            if (!this.cssOnly) {
                $1u.className = this.$4Y("timeheader");
            };
            $1u.style.borderCollapse = "collapse";
            if (!this.cssOnly) {
                $1u.style.color = $b.headerFontColor;
                $1u.style.border = "0px none";
            };
            for (var i = 0; i < this.timeHeader.length - 1; i++) {
                var $2e = $1u.insertRow(-1);
                this.$7h($2e, i);
            };
            var $2h = $1u.insertRow(-1);
            this.$7i($2h);
            var $3h = this.divNorth;
            DayPilot.puc($3h);
            $3h.innerHTML = '';
            $3h.appendChild($1u);
            $3h.style.width = (this.$4U() * this.cellWidth + 5000) + "px";
            var $3i = this.divCorner;
            if (!this.cssOnly) {
                $3i.style.backgroundColor = this.cornerBackColor;
            };
            $3i.innerHTML = this.cornerHtml;
            this.divStretch.style.width = (this.timeline.length * this.cellWidth) + "px";
        };
        this.$7h = function($q, $10) {
            if (this.timeHeader) {
                if (this.timeHeader.length - 1 <= $10) {
                    throw "Not enough timeHeader rows";
                };
                for (var i = 0; i < this.timeHeader[$10].length; i++) {
                    var $P = this.timeHeader[$10][i];
                    if (!$P.toolTip) {
                        $P.toolTip = $P.innerHTML;
                    };
                    if (!this.cssOnly) {
                        if (!$P.backColor) {
                            $P.backColor = this.hourNameBackColor;
                        }
                    };
                    if (!$P.colspan) {
                        $P.colspan = Math.ceil($P.width / (1.0 * this.cellWidth));
                    };
                    $P.level = $10;
                    this.$7j($q, $P);
                }
            } else {
                throw ".groupline is not used anymore";
            }
        };
        this.$53 = function($3j, $3k) {
            var $t = null;
            var $1X = this.$6F.locale();
            var $3k = $3k || this.cellGroupBy;
            switch ($3k) {
                case 'Hour':
                    $t = $3j.toString("H");
                    break;
                case 'Day':
                    $t = $3j.toString($1X.datePattern);
                    break;
                case 'Week':
                    $t = $0k.weekStarts() === 1 ? $3j.weekNumberISO() : $3j.weekNumber();
                    break;
                case 'Month':
                    $t = $3j.toString("MMMM yyyy", $1X);
                    break;
                case 'Year':
                    $t = $3j.toString("yyyy");
                    break;
                case 'None':
                    $t = '';
                    break;
                default:
                    throw 'Invalid cellGroupBy value';
            };
            return $t;
        };
        this.$51 = function($K) {
            var $06 = this.cellDuration;
            if ($06 < 60) {
                return $K.toString("mm");
            } else if ($06 < 1440) {
                return DayPilot.Date.hours($K.d, $b.$6F.timeFormat() === 'Clock12Hours');
            } else if ($06 < 10080) {
                return $K.toString("d");
            } else {
                return $K.weekNumberISO();
            }
        };
        this.$52 = function($3j, $3k) {
            var $3l = this.viewType !== 'Days' ? this.days : 1;
            var $S = this.startDate.addDays($3l);
            var $3k = $3k || this.cellGroupBy;
            switch ($3k) {
                case 'Hour':
                    to = $3j.addHours(1);
                    break;
                case 'Day':
                    to = $3j.addDays(1);
                    break;
                case 'Week':
                    to = $3j.addDays(1);
                    while (to.dayOfWeek() !== $0k.weekStarts()) {
                        to = to.addDays(1);
                    };
                    break;
                case 'Month':
                    to = $3j.addMonths(1);
                    to = to.firstDayOfMonth();
                    var $3m = (DayPilot.Date.diff(to.d, $3j.d) / (1000.0 * 60)) % this.cellDuration === 0;
                    while (!$3m) {
                        to = to.addHours(1);
                        $3m = (DayPilot.Date.diff(to.d, $3j.d) / (1000.0 * 60)) % this.cellDuration === 0;
                    };
                    break;
                case 'Year':
                    to = $3j.addYears(1);
                    to = to.firstDayOfYear();
                    var $3m = (DayPilot.Date.diff(to.d, $3j.d) / (1000.0 * 60)) % this.cellDuration === 0;
                    while (!$3m) {
                        to = to.addHours(1);
                        $3m = (DayPilot.Date.diff(to.d, $3j.d) / (1000.0 * 60)) % this.cellDuration === 0;
                    };
                    break;
                case 'None':
                    to = $S;
                    break;
                default:
                    throw 'Invalid cellGroupBy value';
            };
            if (to.getTime() > $S.getTime()) {
                to = $S;
            };
            return to;
        };
        this.$7j = function($q, $P) {
            var td = $q.insertCell(-1);
            td.colSpan = $P.colspan;
            td.setAttribute("unselectable", "on");
            var $F = Math.max(0, this.headerHeight);
            if (!this.cssOnly) {
                td.style.height = ($F - 1) + "px";
                td.style.textAlign = "center";
                td.style.backgroundColor = $P.backColor;
                td.style.fontFamily = this.hourFontFamily;
                td.style.fontSize = this.hourFontSize;
                td.style.color = this.headerFontColor;
                td.style.cursor = 'default';
                td.style.border = '0px none';
                td.style.borderBottom = "1px solid " + this.borderColor;
                td.style.padding = '0px';
            } else {
                td.style.height = ($F) + "px";
            };
            td.style.KhtmlUserSelect = 'none';
            td.style.MozUserSelect = 'none';
            td.style.WebkitUserSelect = 'none';
            td.style.whiteSpace = 'nowrap';
            if ($P.width) {
                td.style.width = $P.width + "px";
            };
            if (!this.cssOnly) {
                td.className = this.$4Y('timeheadergroup');
            };
            td.oncontextmenu = function() {
                return false;
            };
            td.cell = $P;
            td.onclick = this.$6x;
            var $3n = null;
            var $B = document.createElement("div");
            $B.setAttribute("unselectable", "on");
            if (!this.cssOnly) {
                $B.style.borderRight = "1px solid " + this.hourNameBorderColor;
                $B.style.width = ($P.width - 1) + "px";
                $B.style.height = ($F - 1) + "px";
                $3n = $B;
            } else {
                $B.className = this.$4Y('_timeheadergroup');
                if ($P.backColor) {
                    $B.style.backgroundColor = $P.backColor;
                };
                $B.style.position = "relative";
                if ($P.width) {
                    $B.style.width = ($P.width) + "px";
                };
                $B.style.height = ($F) + "px";
                var $C = document.createElement("div");
                $C.setAttribute("unselectable", "on");
                $C.className = this.$4Y("_timeheadergroup_inner");
                $B.appendChild($C);
                $3n = $C;
            };
            $B.style.overflow = 'hidden';
            $B.title = $P.toolTip;
            $3n.innerHTML = $P.innerHTML;
            td.appendChild($B);
        };
        this.$7i = function($q) {
            var $3o = this.$4U();
            var td = document.createElement("td");
            td.setAttribute("unselectable", "on");
            if (!this.cssOnly) {
                td.style.borderTop = "0px none";
                td.style.borderBottom = "0px none";
                td.style.borderLeft = "0px none";
                td.style.borderRight = "0px none";
                td.style.textAlign = 'center';
                td.style.fontFamily = this.hourFontFamily;
                td.style.fontSize = this.hourFontSize;
                td.style.color = this.headerFontColor;
                td.style.cursor = 'default';
                td.style.padding = '0px';
            };
            td.style.width = this.cellWidth + "px";
            td.style.height = (this.headerHeight) + "px";
            td.style.overflow = 'hidden';
            td.style.KhtmlUserSelect = 'none';
            td.style.MozUserSelect = 'none';
            td.style.WebkitUserSelect = 'none';
            if (!this.cssOnly) {
                td.className = this.$4Y('timeheadercol');
            };
            var $B = document.createElement("div");
            $B.setAttribute("unselectable", "on");
            $B.style.height = (this.headerHeight) + "px";
            $B.style.overflow = 'hidden';
            $B.style.position = 'relative';
            if (this.cssOnly) {
                $B.style.width = (this.cellWidth) + "px";
                $B.className = this.$4Y('_timeheadercol');
            } else {
                $B.style.borderRight = "1px solid " + this.hourNameBorderColor;
                $B.style.width = (this.cellWidth - 1) + "px";
            };
            var $C = document.createElement("div");
            $C.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                $C.className = this.$4Y("_timeheadercol_inner");
            };
            $B.appendChild($C);
            td.appendChild($B);
            var $10 = this.timeHeader.length - 1;
            for (var i = 0; i < $3o; i++) {
                var $P;
                if (this.timeHeader) {
                    $P = this.timeHeader[$10][i];
                    if (!$P.backColor) {
                        if (!this.cssOnly) {
                            $P.backColor = this.hourNameBackColor;
                        }
                    };
                    if (!$P.toolTip) {
                        $P.toolTip = $P.innerHTML;
                    }
                } else {
                    var c = this.timeline[i];
                    var $t = this.$7k(c.start);
                    var $P = {};
                    $P.innerHTML = $t;
                    $P.toolTip = $t;
                    $P.start = c.start;
                    $P.end = c.end;
                    $P.type = 'Cell';
                    $P.backColor = this.hourNameBackColor;
                    var $3p = this.beforeTimeHeaderRender ? this.beforeTimeHeaderRender($P) : null;
                    if ($3p) {
                        $P = $3p;
                    }
                };
                $P.level = $10;
                var $3q = td.cloneNode(true);
                if (!this.cssOnly) {
                    $3q.style.backgroundColor = $P.backColor;
                } else {
                    if ($P.backColor) {
                        $3q.firstChild.style.backgroundColor = $P.backColor;
                    }
                };
                $3q.firstChild.title = $P.toolTip;
                $3q.firstChild.firstChild.innerHTML = $P.innerHTML;
                $3q.oncontextmenu = function() {
                    return false;
                };
                $3q.cell = $P;
                $3q.onclick = this.$6x;
                $q.appendChild($3q);
            }
        };
        this.$7k = function($3j) {
            var $t = null;
            if (this.cellDuration < 60) {
                $t = $3j.getMinutes();
            } else if (this.cellDuration < 1440) {
                $t = $3j.getHours();
            } else {
                $t = $3j.getDay();
            };
            return $t;
        };
        this.$5p = function() {
            for (var i = 0; i < this.rows.length; i++) {
                var $q = this.rows[i];
                var $0v = $q.height() + $q.MarginBottom;
                if ($q.Height !== $0v) {
                    this.rowsDirty = true;
                };
                $q.Height = $0v;
            }
        };
        this.$4E = function() {
            var $2t = this.divHeader;
            if (!$2t) {
                return false;
            };
            var $11 = this.rows.length;
            var $0R = this.rowHeaderCols ? this.rowHeaderCols.length : 1;
            var j = 0;
            for (var i = 0; i < $11; i++) {
                var $q = this.rows[i];
                if ($q.Hidden) {
                    continue;
                };
                for (var c = 0; c < $2t.rows[j].cells.length; c++) {
                    var $3r = $2t.rows[j].cells[c];
                    var $3s = $q.Height;
                    if ($3r && $3r.firstChild && parseInt($3r.firstChild.style.height, 10) !== $3s) {
                        $3r.firstChild.style.height = $3s + "px";
                    }
                };
                j++;
            }
        };
        this.$6Y = function($10) {
            var s = this.separators[$10];
            s.location = s.location || s.Location;
            s.color = s.color || s.Color;
            s.layer = s.layer || s.Layer;
            s.width = s.width || s.Width;
            s.opacity = s.opacity || s.Opacity;
            var $13 = new DayPilot.Date(s.location);
            var $3t = s.color;
            var $R = s.width ? s.width : 1;
            var $3u = s.layer ? s.layer === 'AboveEvents' : false;
            var $x = s.opacity ? s.opacity : 100;
            if ($13.getTime() < this.startDate.getTime()) {
                return;
            };
            if ($13.getTime() >= this.startDate.addDays(this.days).getTime()) {
                return;
            };
            var $p = this.getPixels($13);
            if ($p.cut) {
                return;
            };
            if ($p.left < 0) {
                return;
            };
            if ($p.left > this.$4U() * this.cellWidth) {
                return;
            };
            var $Q = document.createElement("div");
            $Q.style.width = $R + 'px';
            $Q.style.height = $b.innerHeightTree + 'px';
            $Q.style.position = 'absolute';
            $Q.style.left = $p.left + 'px';
            $Q.style.top = '0px';
            $Q.style.backgroundColor = $3t;
            $Q.style.opacity = $x / 100;
            $Q.style.filter = "alpha(opacity=" + $x + ")";
            if ($3u) {
                this.divSeparatorsAbove.appendChild($Q);
            } else {
                this.divSeparators.appendChild($Q);
            };
            this.elements.separators.push($Q);
        };
        this.$6S = function(ev) {
            if ($b.timeRangeDoubleClickHandling === 'Disabled') {
                return false;
            };
            if (DayPilotScheduler.timeRangeTimeout) {
                clearTimeout(DayPilotScheduler.timeRangeTimeout);
                DayPilotScheduler.timeRangeTimeout = null;
            };
            var $0B = {};
            if (!$b.coords) {
                var $33 = $b.maind;
                $b.coords = DayPilot.mo3($33, ev);
            };
            ev = ev || window.event;
            if ($b.$7l($b.coords)) {
                var $32 = $b.$7e(DayPilotScheduler.rangeHold);
                $b.$5J($32.start, $32.end, $32.resource);
            } else {
                DayPilotScheduler.range = $b.$7c();
                var $32 = $b.$7e(DayPilotScheduler.range);
                $b.$5J($32.start, $32.end, $32.resource);
            };
            DayPilotScheduler.rangeHold = DayPilotScheduler.range;
            DayPilotScheduler.range = null;
        };
        this.$6P = function(ev) {
            if ($07.start) {
                return;
            };
            if (DayPilotScheduler.timeRangeTimeout && false) {
                clearTimeout(DayPilotScheduler.timeRangeTimeout);
                DayPilotScheduler.timeRangeTimeout = null;
            };
            $b.$6o();
            $b.$6p();
            if (!$b.coords) {
                var $33 = $b.maind;
                $b.coords = DayPilot.mo3($33, ev);
            };
            ev = ev || window.event;
            var $30 = ev.which || ev.button;
            if ($30 === 2 || ($30 === 3 && $b.$7l($b.coords))) {
                return false;
            };
            if ($b.timeRangeSelectedHandling === 'Disabled') {
                return false;
            };
            DayPilotScheduler.range = $b.$7c();
            return false;
        };
        this.$7c = function() {
            var $0B = {};
            $0B.start = {
                y: $b.$62($b.coords.y).i,
                x: Math.floor($b.coords.x / $b.cellWidth)
            };
            $0B.end = {
                x: Math.floor($b.coords.x / $b.cellWidth)
            };
            if (this.$6h($b.$62($b.coords.y).i)) {
                return;
            };
            $0B.calendar = $b;
            $b.$7d($0B);
            return $0B;
        };
        this.$6Q = function(ev) {
            if ($07.active) {
                return;
            };
            DayPilotScheduler.activeCalendar = $b;
            ev = ev || window.event;
            var $3v = DayPilot.mc(ev);
            $b.coords = DayPilot.mo3($b.maind, ev);
            if ($08.start) {
                if ($08.originalMouse.x !== $3v.x || $08.originalMouse.y !== $3v.y) {
                    DayPilot.Util.copyProps($08, DayPilotScheduler);
                    document.body.style.cursor = 'move';
                    $08 = {};
                }
            };
            if (DayPilotScheduler.resizing) {
                if (!DayPilotScheduler.resizingShadow) {
                    DayPilotScheduler.resizingShadow = $b.$68(DayPilotScheduler.resizing, $b.shadow);
                };
                var $3w = DayPilotScheduler.resizing.event.calendar.cellWidth;
                var $3x = DayPilotScheduler.resizing.event.part.width;
                var $3y = DayPilotScheduler.resizing.event.part.left;
                var $3z = 0;
                var $3A = ($3v.x - DayPilotScheduler.originalMouse.x);
                if (DayPilotScheduler.resizing.dpBorder === 'right') {
                    var $3B;
                    if ($b.snapToGrid) {
                        $3B = Math.ceil((($3x + $3y + $3A)) / $3w) * $3w - $3y;
                        if ($3B < $3w) {
                            $3B = $3w;
                        }
                    } else {
                        $3B = $3x + $3A;
                    };
                    var $1n = $b.maind.clientWidth;
                    if ($3y + $3B > $1n) {
                        $3B = $1n - $3y;
                    };
                    DayPilotScheduler.resizingShadow.style.width = ($3B) + 'px';
                } else if (DayPilotScheduler.resizing.dpBorder === 'left') {
                    var $3C;
                    if ($b.snapToGrid) {
                        $3C = Math.floor((($3y + $3A) + 0) / $3w) * $3w;
                        if ($3C < $3z) {
                            $3C = $3z;
                        }
                    } else {
                        $3C = $3y + $3A;
                    };
                    var $3B = $3x - ($3C - $3y);
                    var $z = $3y + $3x;
                    if ($b.snapToGrid) {
                        if ($3B < $3w) {
                            $3B = $3w;
                            $3C = $z - $3B;
                        }
                    };
                    DayPilotScheduler.resizingShadow.style.left = $3C + 'px';
                    DayPilotScheduler.resizingShadow.style.width = ($3B) + 'px';
                }
            } else if (DayPilotScheduler.moving) {
                if (DayPilotScheduler.movingShadow && DayPilotScheduler.movingShadow.calendar !== $b) {
                    DayPilotScheduler.movingShadow.calendar = null;
                    DayPilot.de(DayPilotScheduler.movingShadow);
                    DayPilotScheduler.movingShadow = null;
                };
                if (!DayPilotScheduler.movingShadow) {
                    var mv = DayPilotScheduler.moving;
                    DayPilotScheduler.movingShadow = $b.$68(mv, $b.shadow);
                };
                DayPilotScheduler.moving.target = $b;
                $b.$6j();
            } else if (DayPilotScheduler.range) {
                var $0B = DayPilotScheduler.range;
                $0B.end = {
                    x: Math.floor($b.coords.x / $b.cellWidth)
                };
                $b.$7d($0B);
            } else if ($b.crosshairType !== 'Disabled') {
                $b.$7m();
            };
            var $3D = ev.insideEvent;
            if (window.event) {
                $3D = window.event.srcElement.insideEvent;
            };
            if ($b.cellBubble && $b.coords && $b.rows && $b.rows.length > 0 && !$3D) {
                var x = Math.floor($b.coords.x / $b.cellWidth);
                var y = $b.$62($b.coords.y).i;
                if (y < $b.rows.length) {
                    var $P = {};
                    $P.calendar = $b;
                    $P.start = $b.timeline[x].start;
                    $P.end = $b.timeline[x].end;
                    $P.resource = $b.rows[y].Value;
                    $P.toJSON = function() {
                        var $0G = {};
                        $0G.start = this.start;
                        $0G.end = this.end;
                        $0G.resource = this.resource;
                        return $0G;
                    };
                    $b.cellBubble.showCell($P);
                }
            };
            if (DayPilotScheduler.drag) {
                $b.$6o();
                if (DayPilotScheduler.gShadow) {
                    document.body.removeChild(DayPilotScheduler.gShadow);
                };
                DayPilotScheduler.gShadow = null;
                if (!DayPilotScheduler.movingShadow && $b.coords && $b.rows.length > 0) {
                    if (!DayPilotScheduler.moving) {
                        DayPilotScheduler.moving = {};
                        var event = DayPilotScheduler.drag.event;
                        if (!event) {
                            var $3E = new DayPilot.Date().getDatePart();
                            var ev = {
                                'id': DayPilotScheduler.drag.id,
                                'start': $3E,
                                'end': $3E.addSeconds(DayPilotScheduler.drag.duration),
                                'text': DayPilotScheduler.drag.text
                            };
                            event = new DayPilot.Event(ev);
                            event.calendar = $b;
                        };
                        DayPilotScheduler.moving.event = event;
                    };
                    DayPilotScheduler.movingShadow = $b.$68(DayPilotScheduler.moving, DayPilotScheduler.drag.shadowType);
                };
                ev.cancelBubble = true;
            };
            if ($b.autoScroll === "Always" || ($b.autoScroll === "Drag" && (DayPilotScheduler.moving || DayPilotScheduler.resizing || DayPilotScheduler.range))) {
                var $3F = $b.nav.scroll;
                var $0W = {
                    x: $b.coords.x,
                    y: $b.coords.y
                };
                $0W.x -= $3F.scrollLeft;
                $0W.y -= $3F.scrollTop;
                var $R = $3F.clientWidth;
                var $F = $3F.clientHeight;
                var $1A = 20;
                var $y = $0W.x < $1A;
                var $z = $R - $0W.x < $1A;
                var top = $0W.y < $1A;
                var $A = $F - $0W.y < $1A;
                var x = 0;
                var y = 0;
                if ($y) {
                    x = -5;
                };
                if ($z) {
                    x = 5;
                };
                if (top) {
                    y = -5;
                };
                if ($A) {
                    y = 5;
                };
                if (x || y) {
                    $b.$7n(x, y);
                } else {
                    $b.$6p();
                }
            }
        };
        this.$7m = function() {
            if ($b.coords && $b.rows && $b.rows.length > 0) {
                var x = Math.floor($b.coords.x / $b.cellWidth);
                var y = $b.$62($b.coords.y).i;
                if (y < $b.rows.length) {
                    $b.$7o(x, y);
                }
            }
        };
        this.$6o = function() {
            this.divCrosshair.innerHTML = '';
            this.crosshairVertical = null;
            this.crosshairHorizontal = null;
            if (this.crosshairTop && this.crosshairTop.parentNode) {
                this.crosshairTop.parentNode.removeChild(this.crosshairTop);
                this.crosshairTop = null;
            };
            if (this.crosshairLeft) {
                for (var i = 0; i < this.crosshairLeft.length; i++) {
                    var ch = this.crosshairLeft[i];
                    if (ch.parentNode) {
                        ch.parentNode.removeChild(ch);
                    }
                };
                this.crosshairLeft = null;
            };
            this.crosshairLastX = -1;
            this.crosshairLastY = -1;
        };
        this.$7o = function(x, y) {
            var $0h = this.crosshairType;
            var $q = this.$6a(y);
            if ($0h === 'Full') {
                var $y = x * this.cellWidth;
                var $Q = this.crosshairVertical;
                if (!$Q) {
                    var $Q = document.createElement("div");
                    $Q.style.width = this.cellWidth + 'px';
                    $Q.style.height = $b.innerHeightTree + 'px';
                    $Q.style.position = 'absolute';
                    $Q.style.top = '0px';
                    $Q.style.backgroundColor = this.crosshairColor;
                    $Q.style.opacity = this.crosshairOpacity / 100;
                    $Q.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                    this.crosshairVertical = $Q;
                    this.divCrosshair.appendChild($Q);
                };
                $Q.style.left = $y + 'px';
                var top = $q.top;
                var $F = $q.height;
                var $R = this.$4U() * this.cellWidth;
                var $Q = this.crosshairHorizontal;
                if (!$Q) {
                    var $Q = document.createElement("div");
                    $Q.style.width = $R + 'px';
                    $Q.style.height = $F + 'px';
                    $Q.style.position = 'absolute';
                    $Q.style.top = top + 'px';
                    $Q.style.left = '0px';
                    $Q.style.backgroundColor = this.crosshairColor;
                    $Q.style.opacity = this.crosshairOpacity / 100;
                    $Q.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                    this.crosshairHorizontal = $Q;
                    this.divCrosshair.appendChild($Q);
                };
                $Q.style.top = top + 'px';
                $Q.style.height = $F + 'px';
            };
            if (this.crosshairLastX !== x) {
                if (this.crosshairTop && this.crosshairTop.parentNode) {
                    this.crosshairTop.parentNode.removeChild(this.crosshairTop);
                    this.crosshairTop = null;
                };
                var $Q = document.createElement("div");
                $Q.style.width = this.cellWidth + "px";
                $Q.style.height = this.headerHeight + "px";
                $Q.style.left = '0px';
                $Q.style.top = '0px';
                $Q.style.position = 'absolute';
                $Q.style.backgroundColor = this.crosshairColor;
                $Q.style.opacity = this.crosshairOpacity / 100;
                $Q.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                this.crosshairTop = $Q;
                var $3h = this.divNorth;
                var $3G = this.timeHeader ? this.timeHeader.length - 1 : 1;
                if ($3h.firstChild.rows[$3G].cells[x]) {
                    $3h.firstChild.rows[$3G].cells[x].firstChild.appendChild($Q);
                }
            };
            if (this.crosshairLastY !== y) {
                if (this.crosshairLeft) {
                    for (var i = 0; i < this.crosshairLeft.length; i++) {
                        var ch = this.crosshairLeft[i];
                        if (ch.parentNode) {
                            ch.parentNode.removeChild(ch);
                        }
                    };
                    this.crosshairLeft = null;
                };
                var $0R = this.rowHeaderCols ? this.rowHeaderCols.length : 1;
                this.crosshairLeft = [];
                for (var i = 0; i < this.divHeader.rows[$q.i].cells.length; i++) {
                    var $R = this.divHeader.rows[$q.i].cells[i].clientWidth;
                    var $Q = document.createElement("div");
                    $Q.style.width = $R + "px";
                    $Q.style.height = $q.height + "px";
                    $Q.style.left = '0px';
                    $Q.style.top = '0px';
                    $Q.style.position = 'absolute';
                    $Q.style.backgroundColor = this.crosshairColor;
                    $Q.style.opacity = this.crosshairOpacity / 100;
                    $Q.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                    this.crosshairLeft.push($Q);
                    this.divHeader.rows[$q.i].cells[i].firstChild.appendChild($Q);
                }
            };
            this.crosshairLastX = x;
            this.crosshairLastY = y;
        };
        this.$6R = function(ev) {
            ev = ev || window.event;
            if ($b.timeRangeSelectedHandling === 'Disabled') {
                return false;
            };
            if (!$b.$7l($b.coords)) {
                $b.$7p(ev);
            };
            if ($b.contextMenuSelection) {
                var $3H = $b.$7e(DayPilotScheduler.rangeHold);
                $b.contextMenuSelection.show($3H);
            };
            ev.cancelBubble = true;
            if (!$b.allowDefaultContextMenu) {
                return false;
            }
        };
        this.$7l = function($0W) {
            var $0B = DayPilotScheduler.rangeHold;
            if (!$0B || !$0B.start || !$0B.end) {
                return false;
            };
            var $q = this.$6a($0B.start.y);
            var $3I = $0B.start.x < $0B.end.x;
            var $3J = ($3I ? $0B.start.x : $0B.end.x) * this.cellWidth;
            var $3K = ($3I ? $0B.end.x : $0B.start.x) * this.cellWidth + this.cellWidth;
            var $3L = $q.top;
            var $3M = $q.bottom;
            if ($0W.x >= $3J && $0W.x <= $3K && $0W.y >= $3L && $0W.y <= $3M) {
                return true;
            };
            return false;
        };
        this.$7d = function($0B) {
            var $0B = $0B || DayPilotScheduler.range;
            var $3b = $0B.end.x > $0B.start.x ? $0B.start.x : $0B.end.x;
            var $3c = ($0B.end.x > $0B.start.x ? $0B.end.x : $0B.start.x) + 1;
            this.$4O();
            for (var x = $3b; x < $3c; x++) {
                this.$7q(x, $0B.start.y);
            }
        };
        this.$7p = function(ev) {
            if ($b.timeRangeSelectedHandling === 'Disabled') {
                return false;
            };
            ev = ev || window.event;
            var $30 = ev.which || ev.button;
            if (DayPilotScheduler.range) {
                return;
            };
            if (DayPilotScheduler.rangeHold && $b.$7l($b.coords) && ($30 === 3 || $30 === 2)) {
                return;
            };
            var $0B = {};
            $0B.start = {
                y: $b.$62($b.coords.y).i,
                x: Math.floor($b.coords.x / $b.cellWidth)
            };
            $0B.end = {
                x: Math.floor($b.coords.x / $b.cellWidth)
            };
            $b.$7d($0B);
            var $32 = $b.$7e($0B);
            $b.$5I($32.start, $32.end, $32.resource);
            DayPilotScheduler.rangeHold = $0B;
        };
        this.$6X = function(ev) {
            if ($b.dynamicLoading) {
                $b.$7r();
                return;
            };
            var $3N = $b.nav.scroll;
            $b.scrollPos = $3N.scrollLeft;
            $b.scrollTop = $3N.scrollTop;
            $b.scrollWidth = $3N.clientWidth;
            $b.divTimeScroll.scrollLeft = $b.scrollPos;
            $b.divResScroll.scrollTop = $b.scrollTop;
            if ($b.refreshTimeout) {
                window.clearTimeout($b.refreshTimeout);
            };
            $b.refreshTimeout = window.setTimeout($b.$7s(), 50);
            $b.onScrollCalled = true;
        };
        this.show = function() {
            $b.nav.top.style.display = '';
            this.$67();
            var f = $b.$7s();
            f();
        };
        this.hide = function() {
            $b.nav.top.style.display = 'none';
        };
        this.$7r = function() {
            var $3N = $b.nav.scroll;
            $b.scrollPos = $3N.scrollLeft;
            $b.scrollTop = $3N.scrollTop;
            $b.scrollWidth = $3N.clientWidth;
            $b.divTimeScroll.scrollLeft = $b.scrollPos;
            $b.divResScroll.scrollTop = $b.scrollTop;
            if ($b.refreshTimeout) {
                window.clearTimeout($b.refreshTimeout);
            };
            var $u = $b.scrollDelay || 500;
            $b.refreshTimeout = window.setTimeout($b.$7t($3N.scrollLeft, $3N.scrollTop), $u);
        };
        this.$7t = function(scrollX, scrollY) {
            if ($b.$4S()) {
                return function() {
                    if (typeof $b.onScroll === 'function') {
                        $b.$4K();
                        var $3O = function($0n) {
                            var $h = $b.$4z($0n, true);
                            $b.$4N($h, true);
                            $b.$4K();
                            $b.$4G();
                        };
                        var $0J = $b.$5Y(scrollX, scrollY);
                        var $0B = $b.$5Z($0J);
                        var $0K = $b.$60($0J);
                        var $n = {};
                        $n.viewport = {};
                        $n.viewport.start = $0B.start;
                        $n.viewport.end = $0B.end;
                        $n.viewport.resources = $0K;
                        $n.async = false;
                        $n.events = [];
                        $n.loaded = function() {
                            if (this.async) {
                                $3O(this.events);
                            }
                        };
                        $b.onScroll($n);
                        if (!$n.async) {
                            $3O($0n);
                        }
                    }
                };
            } else {
                return function() {
                    $b.scrollX = scrollX;
                    $b.scrollY = scrollY;
                    $b.$5a('Scroll');
                };
            }
        };
        this.$7s = function() {
            return function() {
                $b.$4P();
                $b.$4K();
                $b.refreshTimeout = window.setTimeout($b.$7u(), 200);
            };
        };
        this.$7u = function() {
            var $0w = true;
            var $3P = $b.dynamicEventRenderingCacheSweeping;
            var $3Q = $b.dynamicEventRenderingCacheSize;
            return function() {
                if ($b.$73()) {
                    $b.$5U();
                    window.setTimeout(function() {
                        if ($3P) $b.$71($3Q);
                        window.setTimeout(function() {
                            $b.$4M($0w);
                        }, 50);
                    }, 50);
                }
            };
        };
        this.$7v = function() {
            var $0J = this.$7w();
            var $3R = $0J.xStart;
            var $3S = $0J.xEnd - $0J.xStart;
            var $3T = $0J.yStart;
            var $3U = $0J.yEnd - $0J.yStart;
            if (typeof this.onBeforeCellRender === 'function') {
                if (!this.cellProperties) {
                    this.cellProperties = [];
                }
            };
            this.elements.cells = [];
            this.elements.linesVertical = [];
            for (var i = 0; i < $3S; i++) {
                var x = $3R + i;
                for (var j = 0; j < $3U; j++) {
                    var y = $3T + j;
                    if (!this.rows[y].Hidden) {
                        this.$7x(x, y);
                    }
                };
                this.$7y(x);
            };
            for (var y = 0; y < this.rows.length; y++) {
                if (!this.rows[y].Hidden) {
                    this.$7z(y);
                }
            }
        };
        this.$4K = function() {
            if (this.rows !== null && this.rows.length > 0) {
                var $3V = typeof this.onBeforeCellRender === 'function';
                var $3W = this.cellConfig && !this.cellConfig.vertical;
                this.$7v();
                this.$7A();
            };
            var $R = this.$4U() * this.cellWidth;
            this.maind.style.height = this.innerHeightTree + "px";
            this.maind.style.width = $R + "px";
            this.rowsDirty = false;
        };
        this.$7A = function() {
            this.elements.cells = [];
            var $0J = this.$7w();
            for (var x = $0J.xStart; x < $0J.xEnd; x++) {
                var $3X = (x < this.timeline.length - 1) ? this.timeline[x + 1].breakBefore : false;
                if ($3X) {
                    this.$7B(x);
                }
            }
        };
        this.$7B = function(x) {
            var $10 = "x" + x;
            if (this.cache.breaks[$10]) {
                return;
            };
            var $y = x * this.cellWidth + this.cellWidth - 1;
            var $F = this.innerHeightTree;
            var $Q = document.createElement("div");
            $Q.style.left = $y + "px";
            $Q.style.top = "0px";
            $Q.style.width = "1px";
            $Q.style.height = $F + "px";
            $Q.style.fontSize = '1px';
            $Q.style.lineHeight = '1px';
            $Q.style.overflow = 'hidden';
            $Q.style.position = 'absolute';
            $Q.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                $Q.className = this.$4Y("_matrix_vertical_break");
            } else {
                $Q.style.backgroundColor = this.timeBreakColor;
            };
            this.divBreaks.appendChild($Q);
            this.elements.breaks.push($Q);
            this.cache.breaks[$10] = '1';
        };
        this.$7w = function() {
            var $3Y = 30;
            var $0J = {};
            var $3Z = Math.floor(this.scrollPos / this.cellWidth);
            var $40 = Math.ceil(this.scrollWidth / this.cellWidth) + 1;
            var $1t = this.$4U();
            var $K = $3Z - $3Y;
            var end = $K + 2 * $3Y + $40;
            end = Math.min(end, $1t);
            $K = Math.max($K, 0);
            var $3T = this.$62(this.nav.scroll.scrollTop).i;
            var $41 = this.$62(this.nav.scroll.scrollTop + this.nav.scroll.offsetHeight).i;
            if ($41 < this.rows.length) {
                $41++;
            };
            var $3U = $41 - $3T;
            $0J.xStart = $K;
            $0J.xEnd = end;
            $0J.yStart = $3T;
            $0J.yEnd = $41;
            return $0J;
        };
        this.$7C = function() {
            var $0J = this.$7w();
            var $K = $0J.xStart;
            var end = $0J.xEnd;
            this.elements.cells = [];
            this.elements.linesVertical = [];
            for (var x = $K; x < end; x++) {
                this.$7D(x);
                this.$7y(x);
            };
            for (var y = 0; y < this.rows.length; y++) {
                if (!this.rows[y].Hidden) {
                    this.$7z(y);
                }
            }
        };
        this.$7z = function(y) {
            var $10 = "y" + y;
            if (this.cache.cells[$10]) {
                return;
            };
            var top = this.rows[y].Top + this.rows[y].Height - 1;
            var $R = this.$4U() * this.cellWidth;
            var $Q = document.createElement("div");
            $Q.style.left = "0px";
            $Q.style.top = top + "px";
            $Q.style.width = $R + "px";
            $Q.style.height = "1px";
            $Q.style.fontSize = '1px';
            $Q.style.lineHeight = '1px';
            $Q.style.overflow = 'hidden';
            $Q.style.position = 'absolute';
            if (!this.cssOnly) {
                $Q.style.backgroundColor = this.cellBorderColor;
            };
            $Q.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                $Q.className = this.$4Y("_matrix_horizontal_line");
            };
            this.divLines.appendChild($Q);
            this.elements.cells.push($Q);
            this.cache.cells[$10] = '1';
        };
        this.$7y = function(x) {
            var $10 = "x" + x;
            if (this.cache.linesVertical[$10]) {
                return;
            };
            var $y = (x + 1) * this.cellWidth - 1;
            var $Q = document.createElement("div");
            $Q.style.left = $y + "px";
            $Q.style.top = "0px";
            $Q.style.width = "1px";
            $Q.style.height = $b.innerHeightTree + "px";
            $Q.style.fontSize = '1px';
            $Q.style.lineHeight = '1px';
            $Q.style.overflow = 'hidden';
            $Q.style.position = 'absolute';
            if (!this.cssOnly) {
                $Q.style.backgroundColor = this.cellBorderColor;
            };
            $Q.setAttribute("unselectable", "on");
            if (this.cssOnly) {
                $Q.className = this.$4Y("_matrix_vertical_line");
            };
            this.divLines.appendChild($Q);
            this.elements.linesVertical.push($Q);
            this.cache.linesVertical[$10] = '1';
        };
        this.$7D = function(x) {
            var $10 = "x" + x;
            var $F = this.innerHeightTree;
            if (this.cache.cells[$10]) {
                return;
            };
            var $3t = this.$7E(x, 0);
            var $3X = (x < this.timeline.length - 1) ? this.timeline[x + 1].breakBefore : false;
            var $P = document.createElement("div");
            $P.style.left = (x * this.cellWidth) + "px";
            $P.style.top = "0px";
            $P.style.width = (this.cellWidth) + "px";
            $P.style.height = $F + "px";
            $P.style.position = 'absolute';
            $P.style.backgroundColor = $3t;
            $P.setAttribute("unselectable", "on");
            $P.className = this.cssOnly ? this.$4Y('_cellcolumn') : this.$4Y('cellbackground');
            $P.onclick = this.$7p;
            this.divCells.appendChild($P);
            this.elements.cells.push($P);
            this.cache.cells[$10] = '1';
        };
        this.$6v = function($10) {
            var $q = this.rows[$10];
            var $42 = !$q.Expanded;
            this.rows[$10].Expanded = $42;
            var $0m = this.$7F($10, $q.Expanded);
            if (!$42) {
                for (var i = 0; i < $0m.length; i++) {
                    var ri = $0m[i];
                    this.$5B(ri);
                }
            };
            this.$4D();
            this.$4A();
            this.$4G();
            this.$4H();
            this.$4K();
            if ($42) {
                for (var i = 0; i < $0m.length; i++) {
                    var ri = $0m[i];
                    this.$5C(ri);
                }
            };
            this.$5D();
            this.$4P();
            var r = this.$6w($q, $10);
            if ($42) {
                this.$5P(r);
            } else {
                this.$5O(r);
            }
        };
        this.$6u = function(i) {
            var $0d = {};
            $0d.index = i;
            if (typeof this.onLoadNode === 'function') {
                var $n = {};
                var $0A = this.rows[i].Resource;
                $n.resource = $0A;
                $n.async = false;
                $n.loaded = function() {
                    if (this.async) {
                        $0A.dynamicChildren = false;
                        $0A.expanded = true;
                        $b.update();
                    }
                };
                this.onLoadNode($n);
                if (!$n.async) {
                    $0A.dynamicChildren = false;
                    $0A.expanded = true;
                    this.update();
                }
            } else {
                this.$5a('LoadNode', $0d);
            }
        };
        this.$7F = function(i, $43) {
            var $q = this.rows[i];
            var $44 = [];
            if ($q.Children === null || $q.Children.length === 0) {
                return $44;
            };
            for (var k = 0; k < $q.Children.length; k++) {
                var $10 = $q.Children[k];
                this.rows[$10].Hidden = $43 ? !$q.Expanded : true;
                if ($43 === !this.rows[$10].Hidden) {
                    $44.push($10);
                };
                var $45 = this.$7F($10, $43);
                if ($45.length > 0) {
                    $44 = $44.concat($45);
                }
            };
            return $44;
        };
        this.$7n = function($46, $47) {
            this.$6p();
            this.$7G($46, $47);
        };
        this.$7H = function($2z) {
            if (!$2z) {
                return false;
            };
            var $H = this.nav.scroll.scrollWidth;
            var $K = this.nav.scroll.scrollLeft;
            var $R = this.nav.scroll.clientWidth;
            var $z = $K + $R;
            if ($2z < 0 && $K <= 0) {
                return false;
            };
            if ($2z > 0 && $z >= $H) {
                return false;
            };
            this.nav.scroll.scrollLeft += $2z;
            return true;
        };
        this.$7I = function($2z) {
            if (!$2z) {
                return false;
            };
            var $H = this.nav.scroll.scrollHeight;
            var $K = this.nav.scroll.scrollTop;
            var $F = this.nav.scroll.clientHeight;
            var $A = $K + $F;
            if ($2z < 0 && $K <= 0) {
                return false;
            };
            if ($2z > 0 && $A >= $H) {
                return false;
            };
            this.nav.scroll.scrollTop += $2z;
            return true;
        };
        this.$7G = function($46, $47) {
            var $48 = this.$7H($46) || this.$7I($47);
            if (!$48) {
                return;
            };
            var $49 = function($46, $47) {
                return function() {
                    $b.$7G($46, $47);
                };
            };
            this.scrolling = window.setTimeout($49($46, $47), 100);
        };
        this.$6p = function() {
            if (this.scrolling) {
                window.clearTimeout(this.scrolling);
                this.scrolling = null;
            }
        };
        this.$4D = function() {
            var top = 0;
            for (var i = 0; i < this.rows.length; i++) {
                var $q = this.rows[i];
                if (!$q.Hidden) {
                    $q.Top = top;
                    top += $q.Height;
                }
            };
            this.innerHeightTree = top;
        };
        this.$4H = function() {
            this.elements.cells = [];
            this.elements.linesVertical = [];
            this.elements.breaks = [];
            this.cache.cells = [];
            this.cache.linesVertical = [];
            this.cache.breaks = [];
            this.divCells.innerHTML = '';
            this.divLines.innerHTML = '';
            this.divBreaks.innerHTML = '';
        };
        this.$7x = function(x, y) {
            var $10 = x + '_' + y;
            if (this.cache.cells[$10]) {
                return;
            };
            if (typeof this.onBeforeCellRender === 'function') {
                var $q = $b.rows[y];
                var $0A = $q.Value;
                var $1h = $q.Start.getTime() - this.startDate.getTime();
                var $K = this.timeline[x].start.addTime($1h);
                var $P = {};
                $P.resource = $0A;
                $P.start = $K;
                $P.end = $K.addMinutes(this.cellDuration);
                $P.cssClass = null;
                $P.html = null;
                $P.backImage = null;
                $P.backRepeat = null;
                $P.backColor = null;
                var $n = {};
                $n.cell = $P;
                this.onBeforeCellRender($n);
                this.cellProperties[$10] = $P;
            };
            var p = this.$6e(x, y);
            var $P = document.createElement("div");
            $P.style.left = (x * this.cellWidth) + "px";
            $P.style.top = this.rows[y].Top + "px";
            $P.style.width = (this.cellWidth) + "px";
            $P.style.height = (this.rows[y].Height) + "px";
            $P.style.position = 'absolute';
            if (p && p.backColor) {
                $P.style.backgroundColor = p.backColor;
            };
            $P.setAttribute("unselectable", "on");
            $P.className = this.cssOnly ? this.$4Y('_cell') : this.$4Y('cellbackground');
            if (this.cssOnly && this.$6i(y)) {
                DayPilot.Util.addClass($P, this.$4Y("_cellparent"));
            };
            if (p) {
                if (p.cssClass) {
                    if (this.cssOnly) {
                        DayPilot.Util.addClass($P, p.cssClass);
                    } else {
                        DayPilot.Util.addClass($P, $b.$4Y(p.cssClass));
                    }
                };
                if (p.html) {
                    $P.innerHTML = p.html;
                };
                if (p.backImage) {
                    $P.style.backgroundImage = p.backImage;
                };
                if (p.backRepeat) {
                    $P.style.backgroundRepeat = p.backRepeat;
                }
            };
            $P.onclick = this.$7p;
            this.divCells.appendChild($P);
            this.elements.cells.push($P);
            this.cache.cells[$10] = $P;
        };
        this.$7q = function(x, y) {
            var $P = document.createElement("div");
            $P.style.left = (x * this.cellWidth) + "px";
            $P.style.top = this.rows[y].Top + "px";
            $P.style.width = (this.cellWidth - 1) + "px";
            $P.style.height = (this.rows[y].Height - 1) + "px";
            $P.style.position = 'absolute';
            $P.style.backgroundColor = $b.cellSelectColor;
            $P.setAttribute("unselectable", "on");
            this.divRange.appendChild($P);
            this.elements.range.push($P);
        };
        this.clearSelection = function() {
            this.$4O();
        };
        this.cleanSelection = this.clearSelection;
        this.$4O = function() {
            this.divRange.innerHTML = '<div style="position:absolute; left:0px; top:0px; width:0px; height:0px;"></div>';
            this.elements.range = [];
            DayPilotScheduler.rangeHold = null;
        };
        this.$6F = {};
        var $0k = this.$6F;
        $0k.locale = function() {
            return DayPilot.Locale.find($b.locale);
        };
        $0k.timeFormat = function() {
            if ($b.timeFormat !== 'Auto') {
                return $b.timeFormat;
            };
            return $0k.locale().timeFormat;
        };
        $0k.weekStarts = function() {
            if ($b.weekStarts === 'Auto') {
                var $1X = $0k.locale();
                if ($1X) {
                    return $1X.weekStarts;
                } else {
                    return 0;
                }
            } else {
                return $b.weekStarts;
            }
        };
        $0k.rounded = function() {
            return $b.eventCorners === 'Rounded';
        };
        $0k.layout = function() {
            var $4a = /MSIE 6/i.test(navigator.userAgent);
            if ($b.layout === 'Auto') {
                if ($4a) {
                    return 'TableBased';
                } else {
                    return 'DivBased';
                }
            };
            return $b.layout;
        };
        $0k.notifyType = function() {
            var $0h;
            if ($b.notifyCommit === 'Immediate') {
                $0h = "Notify";
            } else if ($b.notifyCommit === 'Queue') {
                $0h = "Queue";
            } else {
                throw "Invalid notifyCommit value: " + $b.notifyCommit;
            };
            return $0h;
        };
        $0k.isResourcesView = function() {
            return $b.viewType !== 'Days';
        };
        $0k.useBox = function($4b) {
            if ($b.useEventBoxes === 'Always') {
                return true;
            };
            if ($b.useEventBoxes === 'Never') {
                return false;
            };
            return $4b < $b.cellDuration * 60 * 1000;
        };
        this.$7E = function(x, y) {
            var $10 = x + '_' + y;
            if (this.cellProperties && this.cellProperties[$10]) {
                return this.cellProperties[$10].backColor;
            };
            return null;
        };
        this.$6e = function(x, y) {
            var $10 = x + '_' + y;
            if (this.cellProperties && this.cellProperties[$10]) {
                return this.cellProperties[$10];
            };
            return null;
        };
        this.$7J = function($4c, x, y) {
            var $10 = x + '_' + y;
            this.cellProperties[$10] = {};
            DayPilot.Util.copyProps($4c, this.cellProperties[$10], ['html', 'cssClass', 'backColor', 'backImage', 'backRepeat']);
            return this.cellProperties[$10];
        };
        this.$7K = function(x, y) {
            if (!this.cellConfig) {
                return;
            };
            var $4d = this.cellConfig;
            if ($4d.vertical) {
                return this.cellProperties[x + "_0"];
            };
            if ($4d.horizontal) {
                return this.cellProperties["0_" + y];
            };
            if ($4d["default"]) {
                return $4d["default"];
            }
        };
        this.$4y = function() {
            if (!this.cellConfig) {
                return;
            };
            var $4d = this.cellConfig;
            if ($4d.vertical) {
                for (var x = 0; x < $4d.x; x++) {
                    var $4e = this.cellProperties[x + "_0"];
                    for (var y = 1; y < $4d.y; y++) {
                        this.$7J($4e, x, y);
                    }
                }
            };
            if ($4d.horizontal) {
                for (var y = 0; y < $4d.y; y++) {
                    var $4e = this.cellProperties["0_" + y];
                    for (var x = 1; x < $4d.x; x++) {
                        this.$7J($4e, x, y);
                    }
                }
            };
            if ($4d["default"]) {
                var $4e = $4d["default"];
                for (var y = 0; y < $4d.y; y++) {
                    for (var x = 0; x < $4d.x; x++) {
                        if (!this.cellProperties[x + "_" + y]) {
                            this.$7J($4e, x, y);
                        }
                    }
                }
            }
        };
        this.isBusiness = function($P) {
            if ($P.start.dayOfWeek() === 0 || $P.start.dayOfWeek() === 6) {
                return false;
            };
            if (this.cellDuration < 720) {
                if ($P.start.getHours() < this.businessBeginsHour || $P.start.getHours() >= this.businessEndsHour) {
                    return false;
                } else {
                    return true;
                }
            };
            return true;
        };
        this.$4C = function() {
            if (this.nav.top.style.visibility === 'hidden') {
                this.nav.top.style.visibility = 'visible';
            }
        };
        this.$7L = function($p) {
            if (this.heightSpec !== "Parent100Pct") {
                this.heightSpec = "Fixed";
            };
            this.height = $p - (this.$4V() + 2);
            this.$4G();
        };
        this.$4T = function(id) {
            for (var i = 0; i < this.rows.length; i++) {
                if (this.rows[i].Value === id) {
                    return this.rows[i];
                }
            };
            return null;
        };
        this.$7M = function() {
            this.$6T();
            this.$4x();
            this.$6H();
            this.$67();
            this.$6V();
            this.$66();
            DayPilotScheduler.register(this);
            this.$4t(null, false);
            this.$6W();
            this.$4R();
            this.$5a('Init');
        };
        this.init = function() {
            this.nav.top = document.getElementById(id);
            if (this.nav.top.dp) {
                return;
            };
            var $4f = this.$6b();
            var $4g = this.events.list !== null;
            if ($4f) {
                this.$7M();
                this.initialized = true;
                return;
            };
            this.$6T();
            this.$4u();
            this.$4v();
            this.$4x();
            this.$4y();
            this.$6H();
            this.$67();
            this.$4w();
            this.$4B();
            this.$5U();
            if ($4g) {
                this.$4z();
            } else {
                this.events.list = [];
            };
            this.$4D();
            this.$4A();
            this.$4G();
            this.$4L();
            this.$4C();
            this.$6V();
            this.$66();
            DayPilotScheduler.register(this);
            this.$6W();
            this.$4s();
            if ($b.scrollToDate) {
                $b.scrollTo($b.scrollToDate);
            } else {
                $b.setScroll($b.scrollX, $b.scrollY);
            };
            if (!$b.onScrollCalled) {
                $b.$6X();
            };
            var $4h = function() {
                if ($b.scrollY) {
                    $b.setScroll($b.scrollX, $b.scrollY);
                }
            };
            window.setTimeout($4h, 200);
            if (this.messageHTML) {
                var $4i = function($17) {
                    return function() {
                        $b.message($17);
                    };
                };
                window.setTimeout($4i(this.messageHTML), 100);
            };
            this.$4R();
            this.initialized = true;
            this.$4t(null, false);
        };
        this.temp = {};
        this.temp.getPosition = function() {
            var x = Math.floor($b.coords.x / $b.cellWidth);
            var y = $b.$62($b.coords.y).i;
            if (y < $b.rows.length) {
                var $P = {};
                $P.start = $b.timeline[x].start;
                $P.end = $b.timeline[x].end;
                $P.resource = $b.rows[y].Value;
                return $P;
            } else {
                return null;
            }
        };
        this.internal = {};
        this.internal.invokeEvent = this.$5j;
        this.internal.eventMenuClick = this.$5H;
        this.internal.timeRangeMenuClick = this.$5K;
        this.internal.resourceHeaderMenuClick = this.$5L;
        this.internal.bubbleCallBack = this.$5F;
        this.internal.findEventDiv = this.$78;
        this.Init = this.init;
    };
    DayPilotScheduler.moving = null;
    DayPilotScheduler.originalMouse = null;
    DayPilotScheduler.resizing = null;
    DayPilotScheduler.globalHandlers = false;
    DayPilotScheduler.timeRangeTimeout = null;
    DayPilotScheduler.selectedCells = null;
    DayPilotScheduler.dragStart = function(element, $06, id, $1C, $0h) {
        DayPilot.us(element);
        var $4j = DayPilotScheduler.drag = {};
        $4j.element = element;
        $4j.duration = $06;
        $4j.text = $1C;
        $4j.id = id;
        $4j.shadowType = $0h ? $0h : 'Fill';
        return false;
    };
    DayPilotScheduler.dragStop = function() {
        if (DayPilotScheduler.gShadow) {
            document.body.removeChild(DayPilotScheduler.gShadow);
            DayPilotScheduler.gShadow = null;
        };
        DayPilotScheduler.drag = null;
    };
    DayPilotScheduler.register = function($b) {
        if (!DayPilotScheduler.registered) {
            DayPilotScheduler.registered = [];
        };
        for (var i = 0; i < DayPilotScheduler.registered.length; i++) {
            if (DayPilotScheduler.registered[i] === $b) {
                return;
            }
        };
        DayPilotScheduler.registered.push($b);
    };
    DayPilotScheduler.unregister = function($b) {
        var a = DayPilotScheduler.registered;
        if (a) {
            var i = DayPilot.indexOf(a, $b);
            if (i !== -1) {
                a.splice(i, 1);
            };
            if (a.length === 0) {
                a = null;
            }
        };
        if (!a) {
            DayPilot.ue(document, 'mousemove', DayPilotScheduler.gMouseMove);
            DayPilot.ue(document, 'mouseup', DayPilotScheduler.gMouseUp);
            DayPilotScheduler.globalHandlers = false;
        }
    };
    DayPilotScheduler.gMouseMove = function(ev) {
        if (typeof(DayPilotScheduler) === 'undefined') {
            return;
        };
        ev = ev || window.event;
        if (ev.insideMainD) {
            return;
        } else if (ev.srcElement) {
            if (ev.srcElement.inside) {
                return;
            }
        };
        var $3v = DayPilot.mc(ev);
        if (DayPilotScheduler.drag) {
            document.body.style.cursor = 'move';
            if (!DayPilotScheduler.gShadow) {
                DayPilotScheduler.gShadow = DayPilotScheduler.createGShadow(DayPilotScheduler.drag.shadowType);
            };
            var $0X = DayPilotScheduler.gShadow;
            $0X.style.left = $3v.x + 'px';
            $0X.style.top = $3v.y + 'px';
            DayPilotScheduler.moving = null;
            if (DayPilotScheduler.movingShadow) {
                DayPilotScheduler.movingShadow.calendar = null;
                DayPilot.de(DayPilotScheduler.movingShadow);
                DayPilotScheduler.movingShadow = null;
            }
        } else if (DayPilotScheduler.moving && DayPilotScheduler.moving.event.calendar.dragOutAllowed && !DayPilotScheduler.drag) {
            var $4k = DayPilotScheduler.moving.event.calendar;
            var ev = DayPilotScheduler.moving.event;
            DayPilotScheduler.moving.target = null;
            document.body.style.cursor = 'move';
            if (!DayPilotScheduler.gShadow) {
                DayPilotScheduler.gShadow = DayPilotScheduler.createGShadow($4k.shadow);
            };
            var $0X = DayPilotScheduler.gShadow;
            $0X.style.left = $3v.x + 'px';
            $0X.style.top = $3v.y + 'px';
            DayPilotScheduler.drag = {};
            var $4j = DayPilotScheduler.drag;
            $4j.element = null;
            $4j.duration = (ev.end().getTime() - ev.start().getTime()) / 1000;
            $4j.text = ev.text();
            $4j.id = ev.value();
            $4j.shadowType = $4k.shadow;
            $4j.event = ev;
            DayPilot.de(DayPilotScheduler.movingShadow);
            DayPilotScheduler.movingShadow.calendar = null;
            DayPilotScheduler.movingShadow = null;
        };
        for (var i = 0; i < DayPilotScheduler.registered.length; i++) {
            if (DayPilotScheduler.registered[i].$6O) {
                DayPilotScheduler.registered[i].$6O();
            }
        }
    };
    DayPilotScheduler.gUnload = function(ev) {
        if (!DayPilotScheduler.registered) {
            return;
        };
        for (var i = 0; i < DayPilotScheduler.registered.length; i++) {
            var c = DayPilotScheduler.registered[i];
            DayPilotScheduler.unregister(c);
        }
    };
    DayPilotScheduler.gMouseUp = function(ev) {
        if (DayPilotScheduler.resizing) {
            if (!DayPilotScheduler.resizingShadow) {
                document.body.style.cursor = '';
                DayPilotScheduler.resizing = null;
                return;
            };
            var e = DayPilotScheduler.resizing.event;
            var $b = e.calendar;
            var $4l = DayPilotScheduler.resizingShadow.clientWidth;
            var $4m = DayPilotScheduler.resizingShadow.offsetLeft;
            var $1A = DayPilotScheduler.resizing.dpBorder;
            var $q = $b.rows[DayPilotScheduler.resizing.event.part.dayIndex];
            var $1h = $q.Start.getTime() - $b.startDate.getTime();
            var $0f = null;
            var $0g = null;
            var $4n = !$b.snapToGrid;
            if ($1A === 'left') {
                $0f = $b.getDate($4m, $4n).addTime($1h);
                $0g = e.end();
            } else if ($1A === 'right') {
                $0f = e.start();
                $0g = $b.getDate($4m + $4l, $4n, true).addTime($1h);
            };
            DayPilot.de(DayPilotScheduler.resizingShadow);
            DayPilotScheduler.resizing = null;
            DayPilotScheduler.resizingShadow = null;
            document.body.style.cursor = '';
            $b.$5k(e, $0f, $0g);
        } else if (DayPilotScheduler.moving) {
            if (!DayPilotScheduler.movingShadow) {
                document.body.style.cursor = '';
                DayPilotScheduler.moving = null;
                return;
            };
            var e = DayPilotScheduler.moving.event;
            var $b = DayPilotScheduler.moving.target;
            if (!$b) {
                DayPilot.de(DayPilotScheduler.movingShadow);
                DayPilotScheduler.movingShadow.calendar = null;
                document.body.style.cursor = '';
                DayPilotScheduler.moving = null;
                return;
            };
            var $0f = DayPilotScheduler.movingShadow.start;
            var $0g = DayPilotScheduler.movingShadow.end;
            var $0i = ($b.viewType !== 'Days') ? DayPilotScheduler.movingShadow.row.Value : null;
            var external = DayPilotScheduler.drag ? true : false;
            var $Q = DayPilotScheduler.movingShadow.line;
            if (DayPilotScheduler.drag) {
                if (!$b.todo) {
                    $b.todo = {};
                };
                $b.todo.del = DayPilotScheduler.drag.element;
                DayPilotScheduler.drag = null;
            };
            DayPilot.de(DayPilotScheduler.movingShadow);
            DayPilotScheduler.movingShadow.calendar = null;
            document.body.style.cursor = '';
            DayPilotScheduler.moving = null;
            DayPilotScheduler.movingShadow = null;
            var ev = ev || window.event;
            $b.$5E(e, $0f, $0g, $0i, external, ev, $Q);
        } else if (DayPilotScheduler.range) {
            ev = ev || window.event;
            var $30 = ev.which || ev.button;
            var $0B = DayPilotScheduler.range;
            var $b = $0B.calendar;
            if (DayPilotScheduler.timeRangeTimeout) {
                clearTimeout(DayPilotScheduler.timeRangeTimeout);
                DayPilotScheduler.timeRangeTimeout = null;
                $b.$6S(ev);
                return;
            };
            DayPilotScheduler.rangeHold = $0B;
            DayPilotScheduler.range = null;
            var $49 = function($32) {
                return function() {
                    DayPilotScheduler.timeRangeTimeout = null;
                    $b.$5I($32.start, $32.end, $32.resource);
                    if ($b.timeRangeSelectedHandling !== "Hold" && $b.timeRangeSelectedHandling !== "HoldForever") {
                        $a();
                    } else {
                        DayPilotScheduler.rangeHold = $0B;
                    }
                };
            };
            var $32 = $b.$7e($0B);
            if ($30 !== 1) {
                DayPilotScheduler.timeRangeTimeout = null;
                return;
            };
            if ($b.timeRangeDoubleClickHandling === 'Disabled') {
                $49($32)();
                var ev = ev || window.event;
                ev.cancelBubble = true;
                return false;
            } else {
                DayPilotScheduler.timeRangeTimeout = setTimeout($49($32), 300);
            }
        };
        if (DayPilotScheduler.drag) {
            DayPilotScheduler.drag = null;
            document.body.style.cursor = '';
        };
        if (DayPilotScheduler.gShadow) {
            document.body.removeChild(DayPilotScheduler.gShadow);
            DayPilotScheduler.gShadow = null;
        };
        DayPilotScheduler.moveOffsetX = null;
        DayPilotScheduler.moveDragStart = null;
    };
    DayPilotScheduler.createGShadow = function($0h) {
        var $0X = document.createElement('div');
        $0X.setAttribute('unselectable', 'on');
        $0X.style.position = 'absolute';
        $0X.style.width = '100px';
        $0X.style.height = '20px';
        $0X.style.border = '2px dotted #666666';
        $0X.style.zIndex = 101;
        if ($0h === 'Fill') {
            $0X.style.backgroundColor = "#aaaaaa";
            $0X.style.opacity = 0.5;
            $0X.style.filter = "alpha(opacity=50)";
            $0X.style.border = '2px solid #aaaaaa';
        };
        document.body.appendChild($0X);
        return $0X;
    };
    DayPilot.SchedulerVisible.dragStart = DayPilotScheduler.dragStart;
    DayPilot.SchedulerVisible.dragStop = DayPilotScheduler.dragStop;
    DayPilot.SchedulerVisible.Scheduler = DayPilotScheduler.Scheduler;
    DayPilot.SchedulerVisible.globalHandlers = DayPilotScheduler.globalHandlers;
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotScheduler = function($4o) {
                var $4p = null;
                var j = this.each(function() {
                    if (this.daypilot) {
                        return;
                    };
                    var $4q = new DayPilot.Scheduler(this.id);
                    this.daypilot = $4q;
                    for (var name in $4o) {
                        $4q[name] = $4o[name];
                    };
                    $4q.Init();
                    if (!$4p) {
                        $4p = $4q;
                    }
                });
                if (this.length === 1) {
                    return $4p;
                } else {
                    return j;
                }
            };
        })(jQuery);
    };
    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }
})();