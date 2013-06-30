(function($) {
    $.fn.scrollConverter = function(options) {
        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            onScroll: function() {
            },
            active: false
        }, options);

        var docElem = document.documentElement;
        var eventsBound = false;
//        var active = false;



        var scrollCallback = function(offset, event, callback) {
            // Abort the scrolling if it's inactive
            if (!settings.active) {
                return;
            }

            // Abort the scrolling if it's inactive
            var delta, numPixelsPerStep, change, newOffset,
                    docOffset, scrollWidth, winWidth, maxOffset;
            // Set scrolling parameters
            delta = 0;
            numPixelsPerStep = 10;
            // Find the maximum offset for the scroll
            docOffset = (docElem ? docElem.offsetWidth : 0) || 0;
            scrollWidth = document.body.scrollWidth || 0;
            winWidth = docElem ? docElem.clientWidth : 0;
            maxOffset = Math.max(docOffset, scrollWidth) - winWidth;
            // "Normalize" the wheel value across browsers
            //  The delta value after this will not be the same for all browsers.
            //  Instead, it is normalized in a way to try to give a pretty similar feeling in all browsers.
            //
            //  Firefox and Opera
            if (event.detail) {
                delta = event.detail * -240;
            }
            // IE, Safari and Chrome
            else if (event.wheelDelta) {
                delta = event.wheelDelta * 5;
            }

            // Get the real offset change from the delta
            //  A positive change is when the user scrolled the wheel up (in regular scrolling direction)
            //  A negative change is when the user scrolled the wheel down
            change = delta / 120 * numPixelsPerStep;
            newOffset = offset.x - change;
            // Do the scroll if the new offset is positive
            if (newOffset >= 0 && newOffset <= maxOffset) {
                offset.x = newOffset;
                offset.setByScript = true;
                window.scrollTo(offset.x, offset.y);
            }
            // Keep the offset within the boundaries
            else if (offset.x !== 0 && offset.x !== maxOffset) {
                offset.x = newOffset > maxOffset ? maxOffset : 0;
                offset.setByScript = true;
                window.scrollTo(offset.x, offset.y);
            }

            // Fire the callback
            if (typeof callback === "function") {
                callback(offset);
            }
        };

        /**
         * 
         */
        var getOffset = function(axis) {
            axis = axis.toUpperCase();
            var pageOffset = "page" + axis + "Offset",
                    scrollValue = "scroll" + axis,
                    scrollDir = "scroll" + (axis === "X" ? "Left" : "Top");
            // Get the scroll offset for all browsers
            return window[pageOffset] || window[scrollValue] || (function() {
                var rootElem = document.documentElement || document.body.parentNode;
                return ((typeof rootElem[scrollDir] === "number") ? rootElem : document.body)[scrollDir];
            }());
        };


        var bindEvents = function(offset, cb) {
            var callback = function(e) {
                // Fix event object for IE8 and below
                e = e || window.event;
                // Trigger the scroll behavior
                scrollCallback(offset, e, cb);
                // Prevent the normal scroll action to happen
                if (e.preventDefault && e.stopPropagation) {
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    return false;
                }
            };

            var updateOffsetOnScroll = function() {
                // Update the offset variable when the normal scrollbar is used
                if (!offset.setByScript) {
                    offset.x = getOffset("x");
                    offset.y = getOffset("y");
                }
                offset.setByScript = false;
            };


            // Safari, Chrome, Opera, IE9+
            if (window.addEventListener) {
                // Safari, Chrome, Opera, IE9
                if ("onmousewheel" in window) {
                    window.addEventListener("mousewheel", callback, false);
                    window.addEventListener("scroll", updateOffsetOnScroll, false);
                }

                // Firefox
                else {
                    window.addEventListener("DOMMouseScroll", callback, false);
                    window.addEventListener("scroll", updateOffsetOnScroll, false);
                }
            }
            // IE8 and below
            else {
                document.attachEvent("onmousewheel", callback);
                window.attachEvent("onscroll", updateOffsetOnScroll);
            }
        };

        /**
         * 
         */
        var deactivateScrolling = function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };


        // Activate the scrolling switch
        //  An optional callback can be passed in, which will fire at every scroll update
        return {
            // Activate the scrolling switch
            //  An optional callback can be passed in, which will fire at every scroll update
            activate: function() {
                settings.active = true;
                console.log(settings.active);

                // Bind events if it hasn't been done before
                if (!eventsBound) {
                    var offset = {x: 0, y: 0};
                    bindEvents(offset, settings.onScroll);
                    eventsBound = true;
                }
            },
            desactivate: function() {
                settings.active = false;
                console.log(settings.active);
            },
            isActivated: function() {
                return settings.active;
            }
        }
    };
})(jQuery);