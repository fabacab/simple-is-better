// ==UserScript==
// @name        Simple is Better
// @namespace   net.maymay.simple-is-better
// @description Automatically loads the Simple Wikipedia version of articles that exist there, because simple is better.
// @version     0.1.3
// @include     https://*.wikipedia.org/*
// @domain      wikipedia.org
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @updateURL   https://github.com/meitar/simple-is-better/raw/master/simple-is-better.user.js
// ==/UserScript==

(function () { // begin IIFE

    /**
     * Checks whether or not the given domain name is a Simple Wikipedia.
     *
     * @param {string} domain_name
     *
     * @return {boolean}
     */
    function isSimple (domain_name) {
        return 'simple.wikipedia.org' === domain_name;
    }

    /**
     * Gets the URL of a Simple article.
     *
     * @param {Location} loc
     *
     * @return {string}
     */
    function getSimpleUrl (loc) {
        return 'https://simple.wikipedia.org' + loc.pathname;
    }

    /**
     * Gets the URL of a regular (not-Simple) article.
     *
     * @param {Location} loc
     *
     * @return {string}
     */
    function getRegularUrl (loc) {
        return 'https://wikipedia.org' + loc.pathname;
    }

    /**
     * Inserts a link to the regular version of the given article.
     *
     * @param {Location} loc
     */
    function linkToRegularArticle (loc) {
        var x = document.querySelector('#firstHeading');
        x.innerHTML = x.innerHTML + ' (<a href="' + getRegularUrl(loc) + '?redirect=no">read complex article</a>)';
        GM_deleteValue('redirected');
    }

    /**
     * Redirects the browser to the given URL.
     *
     * @param {string} to_url
     */
    function redirect (to_url) {
        window.location.href = to_url;
        GM_setValue('redirected', true);
    }

    /**
     * This is where the magic happens.
     */
    function main () {
        if (isSimple(window.location.host)) {
            if (GM_getValue('redirected', false)) {
                linkToRegularArticle(window.location);
            }
        } else {
            if ( -1 === window.location.search.indexOf('redirect=no')
                 && -1 === window.location.search.indexOf('action=edit')
                 && -1 === window.location.search.indexof('action=submit') ) {
                var simple_url = getSimpleUrl(window.location);
                GM_xmlhttpRequest({
                    'url': simple_url,
                    'method': 'HEAD',
                    'onload': function (response) {
                        if (200 === response.status) {
                            redirect(simple_url);
                        }
                    }
                });
            }
        }
    }

    main();

})(); // end IIFE
