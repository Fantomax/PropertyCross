RAD.plugin("plugin.fastclick", function (core, id) {
    'use strict';

    var document = window.document,
        body = document.body,
        self = {moduleID: id},
        GHOST_CLICK_TIMEOUT = 500,
        TOUCH_DIFFERENCE = 10,
        coordinates = [];

    function Swiper(element) {
        var swiper = this,
            lastMove,
            preLastMove;

        function extractCoord(e) {
            var result = {},
                touchEvent = e;

            if (swiper.touch) {
                if (e.touches && e.touches[0] && e.type !== "touchend") {
                    touchEvent = e.touches[0];
                } else if (e.changedTouches && e.changedTouches[0]) {
                    touchEvent = e.changedTouches[0];
                }
            }

            result.screenX = touchEvent.screenX;
            result.screenY = touchEvent.screenY;
            result.clientX = touchEvent.clientX;
            result.clientY = touchEvent.clientY;
            return result;
        }

        function getDirection(startX, startY, endX, endY) {
            var result;

            if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
                if (startX > endX) {
                    result = "left";
                } else {
                    result = "right";
                }
            } else {
                if (startY > endY) {
                    result = "top";
                } else {
                    result = "bottom";
                }
            }
            return result;
        }

        function fireEvent(type, e) {
            var coords = extractCoord(e),
                customEvent = document.createEvent('Event');

            customEvent.initEvent(type, true, true);
            customEvent[type] = {
                clientX: coords.clientX,
                clientY: coords.clientY,
                screenX: coords.screenX,
                screenY: coords.screenY,
                timeStamp: e.timeStamp
            };
            e.target.dispatchEvent(customEvent);
        }

        function getDirectionVelosity(lastX, lastY, lastTime, endX, endY, endTime) {
            var distance,
                velocity,
                direction = getDirection(lastX, lastY, endX, endY);

            switch (direction) {
            case "left":
                distance = lastX - endX;
                break;
            case "right":
                distance = endX - lastX;
                break;
            case "top":
                distance = lastY - endY;
                break;
            case "bottom":
                distance = endY - lastY;
                break;
            }
            velocity = (distance / (endTime - lastTime)).toFixed(3);
            return velocity;
        }

        function distance(x1, y1, x2, y2) {
            var xdiff = x2 - x1,
                ydiff = y2 - y1;
            return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        }

        function saveLastPoint(e) {
            var coords = extractCoord(e);
            lastMove = preLastMove;
            preLastMove = {
                screenX: coords.screenX,
                screenY: coords.screenY,
                timeStamp: e.timeStamp
            };
        }

        swiper.down = function (e) {
            var coords = extractCoord(e);
            swiper.startX = coords.screenX;
            swiper.startY = coords.screenY;
            swiper.startClientX = coords.clientX;
            swiper.startClientY = coords.clientY;
            swiper.timeStamp = e.timeStamp;
            swiper.moved = false;
            swiper.isDown = true;
            swiper.touchStartTime = new Date().getTime();

            lastMove = preLastMove = {
                screenX: 0,
                screenY: 0,
                timeStamp: new Date().getTime()
            };
            saveLastPoint(e);
            fireEvent("tapdown", e);
        };

        swiper.move = function (e) {
            var coords = extractCoord(e);
            if (swiper.isDown) {
                fireEvent("tapmove", e);
            }
            if (Math.abs(coords.screenX - swiper.startX) > TOUCH_DIFFERENCE || (Math.abs(coords.screenY - swiper.startY) > TOUCH_DIFFERENCE)) {
                swiper.moved = true;
                saveLastPoint(e);
            }
        };

        swiper.cancel = function (e) {
            if (swiper.isDown) {
                if (swiper.touch) {
                    swiper.up(e);
                } else {
                    fireEvent("tapcancel", e);
                }
            }
        };

        swiper.clear = function (e) {
            fireEvent("tapclear", e);
        };

        swiper.up = function (e) {
            var swipeEvent,
                coord = extractCoord(e),
                dVelocity,
                velocity,
                duration = new Date().getTime() - swiper.touchStartTime;

            if (!swiper.isDown) {
                return;
            }

            swiper.isDown = false;
            if (!swiper.moved && duration <= 200) {
                fireEvent("tap", e);
            }

            velocity = (distance(lastMove.screenX, lastMove.screenY, coord.screenX, coord.screenY) / (e.timeStamp - lastMove.timeStamp)).toFixed(3);
            if (swiper.moved && velocity > 0) {

                dVelocity = getDirectionVelosity(lastMove.screenX, lastMove.screenY, lastMove.timeStamp, coord.screenX, coord.screenY, e.timeStamp);

                swipeEvent = document.createEvent('Event');
                swipeEvent.initEvent('swipe', true, true);
                swipeEvent.swipe = {
                    //start point event attributes
                    start: {
                        screenX: swiper.startX,
                        screenY: swiper.startY,
                        clientX: swiper.startClientX,
                        clientY: swiper.startClientY,
                        timeStamp: swiper.timeStamp
                    },
                    //end point event attributes
                    end: {
                        screenX: coord.screenX,
                        screenY: coord.screenY,
                        clientX: coord.clientX,
                        clientY: coord.clientY,
                        timeStamp: e.timeStamp
                    },
                    //velocity(px/ms) in end point without direction
                    velocity: velocity,
                    //swipe direction ("left", "right", "top", "bottom")
                    direction: getDirection(swiper.startX, swiper.startY, coord.screenX, coord.screenY),
                    //swipe speed(px/ms) in end point by direction
                    speed: dVelocity
                };
                e.target.dispatchEvent(swipeEvent);
            }

            fireEvent("tapup", e);
        };

        swiper.destroy = function () {
            if (!this.touch) {
                this.el.removeEventListener('mousedown', this.down);
                this.el.removeEventListener('mouseup', this.up);
                this.el.removeEventListener('mousemove', this.move);
                this.el.removeEventListener('mouseout', this.cancel);
                this.el.removeEventListener('mouseover', this.clear);
            } else {
                this.el.removeEventListener('touchstart', this.down);
                this.el.removeEventListener('touchend', this.up);
                this.el.removeEventListener('touchmove', this.move);
                this.el.removeEventListener('touchcancel', this.cancel);
            }
            delete this.el;
        };

        // init
        swiper.el = element;
        element = null;
        swiper.touch = (window.ontouchstart !== undefined);
        if (!swiper.touch) {
            swiper.el.addEventListener('mousedown', swiper.down, false);
            swiper.el.addEventListener('mouseup', swiper.up, false);
            swiper.el.addEventListener('mousemove', swiper.move, false);
            swiper.el.addEventListener('mouseout', swiper.cancel, false);
            swiper.el.addEventListener('mouseover', swiper.clear, false);
        } else {
            swiper.el.addEventListener('touchstart', swiper.down, false);
            swiper.el.addEventListener('touchend', swiper.up, false);
            swiper.el.addEventListener('touchmove', swiper.move, false);
            swiper.el.addEventListener('touchcancel', swiper.cancel, false);
        }

        return swiper;
    }

    function preventGhostClick(x, y) {
        coordinates.push(x, y);
        window.setTimeout(function () {
            coordinates.splice(0, 2);
        }, GHOST_CLICK_TIMEOUT);
    }

    function onClick(event) {
        var x, y, i;

        for (i = 0; i < coordinates.length; i += 2) {
            x = coordinates[i];
            y = coordinates[i + 1];
            if (Math.abs(event.screenX - x) < TOUCH_DIFFERENCE && Math.abs(event.screenY - y) < TOUCH_DIFFERENCE) {
                event.preventDefault();
                event.stopPropagation();
                return true;
            }
        }
        preventGhostClick(event.screenX, event.screenY);
        return false;
    }

    function onTouchStart(e) {
        self.startX = e.touches[0].screenX;
        self.startY = e.touches[0].screenY;
        self.touchStartTime = new Date().getTime();
        self.move = false;
        self.cancelsed = false;

        return true;
    }

    function onTouchCancel() {
        self.cancelsed = true;
    }

    function onTouchMove(e) {
        if (Math.abs(e.touches[0].screenX - self.startX) > TOUCH_DIFFERENCE || (Math.abs(e.touches[0].screenY - self.startY) > TOUCH_DIFFERENCE)) {
            self.move = true;
        }
    }

    function sendClick(event, newType) {
        var clickEvent, touch;

        touch = event.changedTouches[0];
        clickEvent = window.document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(newType, true, true, window, 1,
            touch.screenX, touch.screenY, touch.clientX, touch.clientY,
            false, false, false, false, 0, null);
        event.target.dispatchEvent(clickEvent);
    }

    function onTouchEnd(event) {
        var touch = event.changedTouches[0],
            duration = new Date().getTime() - self.touchStartTime;
        if (self.move || self.cancelsed || duration > 200) {
            return false;
        }

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect
        if (window.document.activeElement && window.document.activeElement !== event.target) {
            window.document.activeElement.blur();
        }

        sendClick(event, 'click');

        if (event.target.focus) {
            event.target.focus();
        }
        preventGhostClick(touch.screenX, touch.screenY);

        event.preventDefault();
        event.stopPropagation();

        return true;
    }

    function isAndroid() {
        return window.navigator.userAgent.indexOf('Android') > 0;
    }

    function fastClickNeeded() {
        var metaViewport;

        // Devices that don't support touch don't need FastClick
        if (window.ontouchstart === undefined) {
            return false;
        }

        if ((/Chrome\/[0-9]+/).test(window.navigator.userAgent)) {

            // Chrome on Android with user-scalable="no" doesn't need FastClick
            if (isAndroid()) {
                metaViewport = document.querySelector('meta[name=viewport]');
                if (metaViewport && metaViewport.content.indexOf('user-scalable=no') !== -1) {
                    return false;
                }

                // Chrome desktop doesn't need FastClick
            } else {
                return false;
            }
        }

        return true;
    }

    //  constructor
    self.swipe = new Swiper(body);
    if (fastClickNeeded()) {
        body.addEventListener('click', onClick, true);
        body.addEventListener('touchstart', onTouchStart, false);
        body.addEventListener('touchend', onTouchEnd, false);
        body.addEventListener('touchmove', onTouchMove, false);
        body.addEventListener('touchcancel', onTouchCancel, false);
    }

    // destuctor
    self.destroy = function () {
        if (fastClickNeeded()) {
            body.removeEventListener('click', onClick, true);
            body.removeEventListener('touchstart', onTouchStart, false);
            body.removeEventListener('touchend', onTouchEnd, false);
            body.removeEventListener('touchmove', onTouchMove, false);
            body.removeEventListener('touchcancel', onTouchCancel, false);
        }
        this.swipe.destroy();
    };

    return self;
});