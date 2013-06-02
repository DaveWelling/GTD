/// <reference path="../../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../gapiDriveClient.js"/>
/// <reference path="../../jquery-1.8.2.js"/>

define([], function() {
    var CLIENT_ID = '178349449538-uqbhjan88ghb4fni6i8ebr1870mns25a.apps.googleusercontent.com';
    var SCOPES = 'https://www.googleapis.com/auth/drive';


    var loadDeferred = $.Deferred();
    var authDeferred = $.Deferred();

    /**
     * Check if the current user has authorized the application.
     */
    function checkAuth() {
        gapi.auth.authorize(
            { 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true },
            handleAuthResult);
        return authDeferred;
    }

    /**
     * Called when authorization server replies.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
        if (authResult) {
            if (authResult.error) {
                //throw new Error(authResult.error);
                authDeferred.reject(authResult.error);
            }
            authDeferred.resolve();
        } else {
            gapi.auth.authorize(
              { 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false },
              handleAuthResult);
        }
    }

    function loadGapiClient() {
        gapi.client.load('drive', 'v2', loadDeferred.resolve);
        return loadDeferred;
    }

    return (function chainLoadAndAuthorize() {
        // Make sure gapi loaded and authenticated before attempting delete.
        var chain1 = loadGapiClient();
        var chain2 = chain1.then(checkAuth);
        return chain2;
    }());
});
