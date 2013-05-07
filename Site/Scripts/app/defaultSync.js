/// <reference path="../require.js"/>
/// <reference path="../app/constants.js"/>

define(['backbone'], function (backbone) {
    return function(method, model, options) {
        model.url = AppConstants.WebApiUrl;
        backbone.sync(method, model, options);
    };
});