# adblock-detector.js

v0.1.2

Copyright 2017 Nic Jansma

[http://nicj.net](http://nicj.net)

Licensed under the MIT license

## Introduction

`adblock-detector.js` attempts to detect if the advertising on your site is being blocked by software in the visitor's
browser such as [Adblock Plus](https://adblockplus.org/).

As of March 2014, this library is able to detect Google AdSense ads being blocked on Windows machines when
[Adblock Plus](https://adblockplus.org/) or [Remove It Permanently](https://addons.mozilla.org/en-US/firefox/addon/remove-it-permanently/)
is installed for the following browsers:

* Internet Explorer 11
* Firefox 27
* Chrome 33

`adblock-detector.js` *may* work in other environments, such as other browsers, browser versions, ad publishers
and ad-blockers, but it has not (yet) been thoroughly tested elsewhere.  If you have experience with this library
working in other environments, please  update this README.  Validating and updating `adblock-detector.js` to work
in new environments will be an ongoing process.

**NOTE:** This library is intended to be used to monitor your ad-blocker rate, or to replace blocked ads with
other *non-annoying* content such as a gentle text suggestion to donate to the site if the visitor feels so inclined.
Replacing blocked ads with other ads will likely upset your customers.

You can see this script in action on [sarna.net](http://www.sarna.net), which gives a gentle *Please donate Bitcoins
if you enjoy this site* message to the visitor if ads are blocked.  The visitor is also given the opportunity to
hide the message for a year if they do not want to continue seeing it.

## Download

Releases are available for download from [GitHub](https://github.com/nicjansma/adblock-detector.js).

__Development:__ [`src/adblock-detector.js`](https://github.com/nicjansma/adblock-detector.js/raw/master/src/adblock-detector.js)
    - ~3.7kb

__Production:__ [`dist/adblock-detector.min.js`](https://github.com/nicjansma/adblock-detector.js/raw/master/dist/adblock-detector.min.js)
    - ~500b (minified / gzipped)

`adblock-detector.js` is also available via [bower](http://bower.io/). You can install using:

    bower install adblock-detector

## Usage

***NOTE:*** `adblock-detector.js` requires jQuery.

Include `adblock-detector.js` in your HTML:

```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="adblock-detector.min.js"></script>
```

Once imported, a global `AdblockDetector` element is added to the top-level window object (if not using
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)).

Otherwise, `adblock-detector.js` can be used as an AMD / [require.js](http://requirejs.org) module.

To detect if ads were blocked on the page, you can either use `AdblockDetector.hasAdsBlocked(element)` to detect if an
individual **ad container** has been blocked, or use `AdblockDetector.detect(...)`, which waits for the `document.ready`
event and then checks all of the ads on the page to see if any have been blocked.

To help `adblock-detector.js` determine if ads are being blocked, all of your ads should be wrapped up in a
**container element**, such as the following:

```html
    <div class='ad-container'>
        <script type='text/javascript' src='http://pagead2.googlesyndication.com/pagead/show_ads.js'></script>
    </div>
```

This container element helps `AdblockDetector` find where ads should have appeared in the DOM so it can inspect them.

## Examples

Two complete examples are provided in the `examples/` folder:

* `analytics.html` - Uses Google Analytics (Universal) to monitor which users have an ad-blocker installed by setting an Google Analytics Dimension.

* `please-donate.html` - Gives a gentle plea to users who have an ad-blocker installed, requesting Bitcoins if they
    enjoy the site.  Also gives an option to hide the nag message if the user doesn't want to see it anymore.

More examples:

### Determing if a single ad has been blocked

After setting up your ad in a `<div class='.ad-container'>`, you could check to see if it has been blocked via the
`hasAdsBlocked()` function.  You should wait a small period after the `document.ready` event for ads to be asynchronously
loaded before checking (for example, 500 to 2,500 ms).

```html
    <div class='ad-container' id='ad1'>
        <script type='text/javascript' src='http://pagead2.googlesyndication.com/pagead/show_ads.js'></script>
    </div>
    <script>
        $(function() {
            setTimeout(function() {
                alert('Ads blocked? ' + AdblockDetector.hasAdsBlocked($('#ad1'));
            }, 3000);
        });
    </script>
```
### Determing if a any ads have been blocked

After setting up your ads in `<div class='.ad-container'>`, you can check to see if any ads have been blocked via the
`detect()` function:

```html
    <div class='ad-container' id='ad1'>
        <script type='text/javascript' src='http://pagead2.googlesyndication.com/pagead/show_ads.js'></script>
    </div>
    <script>
        AdblockDetector.detect({
            timeout: 3000,
            selector: '.ad-container',
            blocked: function(element) {
                alert(element + ' had its ads blocked');
            },
            complete: function(adCount, adsBlockedCount) {
                alert(adsBlockedCount + ' ads blocked out of ' + adCount);
            }
        });
    </script>
```

### Replacing an ad with your own content

After detecting that your ads have been blocked via the `detect()` function, you can replace the ad content with
something else.  For example, you could inject a gentle **Please Donate** text suggestion instead.

```html
    <div class='ad-container' id='ad1'>
        <script type='text/javascript' src='http://pagead2.googlesyndication.com/pagead/show_ads.js'></script>
    </div>
    <script>
        AdblockDetector.detect({
            timeout: 3000,
            selector: '.ad-container',
            blocked: function(element) {
                $(element).html('Please donate Bitcoins to us at <a href="bitcoin:1PVhFgNmTNmHsCEdNA2HHH18pFNiaVLUa9">' +
                    '1PVhFgNmTNmHsCEdNA2HHH18pFNiaVLUa9</a> if you enjoy this site.');
            }
        });
    </script>
```

## Reference

### `AdblockDetector.hasAdsBlocked(element)`

Determines if ads are being blocked in the target element (ad container).

#### Params:

* `element` HTMLElement ad container to check (`HTMLElement`)

#### Returns:

`boolean` True if the matching ad container had its ad blocked

### `AdblockDetector.detect(opts)`

Waits for `document.ready`, then looks for ads matching a selector to see if any ads were blocked.

#### Params:

* `opts` Options (`object`)

    * `opts.timeout` Timeout before document is checked (`number`, default: `3000`)

    * `opts.selector` jQuery selector of ad containers (`string`, default: `'.ad-container'`)

    * `opts.blocked` Function that fires when a container's ads have been blocked (`function(element)`, default: `null`)

    * `opts.complete` Function that fires after all ads have been checked for being blocked
        (`function(adCount, adsBlockedCount)`, default: `null`)
        * `adCount` is the number of ads that matched the `selector`
        * `adsBlockedCount` is the number of ads that were blocked

## Tests

`adblock-detector.js` tests are found in the `test/` directory, and must be run in your web browser:

    test/test.html

To run the test, you need a valid [Google AdSense](http://www.google.com/adsense/start/) publisher account.  Once
you have an account that can serve ads, change the constant in test.html that specifies which AdSense account to use:

```js
//
// NOTE: Modify this with a valid client ID to test
//
var PUB_CLIENT = "pub-123xyz";
```

The tests are run manually.  You should load the `test.html` in your browser of choice and select either the
*Run Tests w/ NO Ad Blocker* or *Run Tests w/ Ad Blocker* buttons depending on your situation.

## Version History

* v0.0.1 - 2014-03-22: Initial version
* v0.1.1 - 2014-04-08: Detects Remove It Permanently (Firefox addon)
* v0.1.2 - 2015-03-12: Wraps IFRAME access in a try/catch to avoid cross-origin exceptions
