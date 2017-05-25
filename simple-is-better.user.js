// ==UserScript==
// @name        Simple is Better
// @namespace   net.maymay.simple-is-better
// @description Automatically loads the Simple Wikipedia version of articles that exist there, because simple is better.
// @include     https://*.wikipedia.org/*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
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
     * Checks whether or not a Simple article exists.
     *
     * @param {Location} loc
     *
     * @return {boolean}
     */
    function simpleArticleExists (loc) {
        return 200 === GM_xmlhttpRequest({
            'url': getSimpleUrl(loc),
            'method': 'HEAD',
            'synchronous': true
        }).status;
    }

    /**
     * Inserts a link to the regular version of the given article.
     *
     * @param {Location} loc
     */
    function linkToRegularArticle (loc) {
        var x = document.querySelector('#firstHeading');
        x.innerHTML = x.innerHTML + ' (<a href="' + getRegularUrl(loc) + '?redirect=no">read complex article</a>)';
    }

    /**
     * This is where the magic happens.
     */
    function main () {
        if (isSimple(window.location.host)) {
            if (GM_getValue('redirected')) {
                linkToRegularArticle(window.location);
                GM_setValue('redirected', false);
            }
        } else {
            if (-1 === window.location.search.indexOf('redirect=no') && simpleArticleExists(window.location)) {
                window.location.href = getSimpleUrl(window.location);
                GM_setValue('redirected', true);
            }
        }
    }

    main();

})(); // end IIFE
