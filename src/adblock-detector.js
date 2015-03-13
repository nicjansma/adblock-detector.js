/*eslint-env jquery,browser,amd*/
//
// adblock-detector.js
//
// Detects ad-blockers
//
// Copyright 2014 Nic Jansma
// http://nicj.net
//
// https://github.com/nicjansma/adblock-detector.js
//
// Licensed under the MIT license
//
(function() {
    "use strict";

    var AdblockDetector = {};

    // save old AdblockDetector object for noConflict()
    var root;
    var previousObj;
    if (typeof window !== "undefined") {
        root = window;
        previousObj = root.AdblockDetector;
    }

    //
    // Functions
    //
    /**
     * Changes the value of AdblockDetector back to its original value, returning
     * a reference to the AdblockDetector object.
     *
     * @returns {AdblockDetector} This AdblockDetector
     */
    AdblockDetector.noConflict = function() {
        root.AdblockDetector = previousObj;
        return AdblockDetector;
    };

    /**
     * Determines if the target element (ad container) had its ads blocked.
     *
     * @param {Element} element Ad container element
     *
     * @returns {boolean} True if an ad-blocker was detected
     */
    AdblockDetector.hasAdsBlocked = function(element) {
        var $element = $(element);

        // look for child IFRAMEs
        var iframes = $element.find("iframe");

        if (iframes.length > 0) {
            try {
                // FireFox
                var adWindow = iframes[0].contentWindow;
                if (adWindow && adWindow.document) {
                    var adDoc = adWindow.document;
                    var adDocFrames = $(adDoc).find("iframe");

                    if (adDocFrames.length > 0) {
                        if (adDocFrames[0].className !== "") {
                            // AdBlock Plus
                            return true;
                        } else if (!adDocFrames.is(":visible")) {
                            // Remove It Permanently (Firefox)
                            return true;
                        }
                    }
                }
            } catch (e) {
                // Likely a cross-origin access exception.  If thrown, it means
                // the IFRAME was loaded from another origin, so it likely loaded
                // a real ad.
                return false;
            }
        } else {
            // Google Chrome and Internet Explorer
            return true;
        }

        return false;
    };

    /**
     * @typedef AdblockDetector~detect
     * @property {number} [timeout=3000] Timeout before document is checked
     * @property {string} [selector=.ad-container] jQuery selector of ad containers
     * @property {function} [blocked=null] Function that fires when a container"s ads have been blocked
     * @property {function} [complete=null] Function that fires after all ads have been checked for being blocked
     */

    /**
     * Waits for document.ready and then looks for ads matching a selector to see if any ads were blocked.
     *
     * @param {AdblockDetector~detect} opts Options
     */
    AdblockDetector.detect = function(opts) {
        var defaults = {
            timeout: 3000,
            selector: ".ad-container",
            blocked: null,
            complete: null
        };

        var options = $.extend({}, defaults, opts);

        $(function() {
            // wait a few ms for AdBlocker to kick in
            setTimeout(function() {
                var adsBlockedCount = 0;
                var adCount = 0;

                // find all matching ad containers
                $(options.selector).each(function(i, element) {
                    adCount++;

                    if (AdblockDetector.hasAdsBlocked(element)) {
                        adsBlockedCount++;

                        if (options.blocked) {
                            options.blocked(element);
                        }
                    }
                });

                if (options.complete) {
                    options.complete(adCount, adsBlockedCount);
                }
            }, options.timeout);
        });
    };

    //
    // Export to the appropriate location
    //
    if (typeof define === "function" && define.amd) {
        //
        // AMD / RequireJS
        //
        define([], function () {
            return AdblockDetector;
        });
    } else if (typeof root !== "undefined") {
        //
        // Browser Global
        //
        root.AdblockDetector = AdblockDetector;
    }
}(typeof window !== "undefined" ? window : undefined));
