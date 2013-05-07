/// <reference path="../require.js"/>
/// <reference path="../app/constants.js"/>

// Change read -> get to read -> post
define(['backbone'], function (backbone) {
	// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
	  var methodMap = {
	    'create': 'POST',
	    'update': 'POST',
	    'delete': 'POST',
	    'read':   'GET'
	  };
	var syncOverride = function(method, model, options) {
	    var type = methodMap[method];

	    // Default options, unless specified.
	    _.defaults(options || (options = {}), {
	      emulateHTTP: Backbone.emulateHTTP,
	      emulateJSON: Backbone.emulateJSON
	    });

	    // Default JSON-request options.
	    var params = {type: type, dataType: 'json'};

	    // Ensure that we have a URL.
	    if (!options.url) {
	      params.url = _.result(model, 'url') || urlError();
	    }

	    // Ensure that we have the appropriate request data.
	    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
	      params.contentType = 'application/json';
	      params.data = JSON.stringify(options.attrs || model.toJSON(options));
	    }

	    // For older servers, emulate JSON by encoding the request into an HTML-form.
	    if (options.emulateJSON) {
	      params.contentType = 'application/x-www-form-urlencoded';
	      params.data = params.data ? {model: params.data} : {};
	    }

	    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	    // And an `X-HTTP-Method-Override` header.
	    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
	      params.type = 'POST';
	      if (options.emulateJSON) params.data._method = type;
	      var beforeSend = options.beforeSend;
	      options.beforeSend = function(xhr) {
	        xhr.setRequestHeader('X-HTTP-Method-Override', type);
	        if (beforeSend) return beforeSend.apply(this, arguments);
	      };
	    }

	    // Don't process data on a non-GET request.
	    if (params.type !== 'GET' && !options.emulateJSON) {
	      params.processData = false;
	    }

	    // Make the request, allowing the user to override any Ajax options.
	    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
	    model.trigger('request', model, xhr, options);
	    return xhr;
	  };
	  
    return function(method, model, options) {

        options || (options = {});

        switch (method) {
        case 'create':
            // POST /Task/create
            options.url = AppConstants.RhoModelUrl + "/Task/create";
            options.emulateJSON = true;
            break;
        case 'update':
            // POST /Task/{1}/update
            //options.url = AppConstants.RhoModelUrl + "/Task/{" + model.id + "}/update";
            options.url = AppConstants.RhoModelUrl + "/Task/update";
            options.emulateJSON = true;
            //options.url = AppConstants.RhoModelUrl + "/Task/restUpdate/{" + model.id + "}";
            break;
        case 'delete':
            // POST /Task/{1}/delete
            options.url = AppConstants.RhoModelUrl + "/Task/{" + model.id + "}/delete";
            break;
        case 'read':
            if ((!model.hasOwnProperty("models")) && model.attributes[model.idAttribute]) {
                // GET /Task/{1}
                options.url = AppConstants.RhoModelUrl + "/Task/{" + model.id + "}";
            } else {
                // GET /Task
                options.url = AppConstants.RhoModelUrl + "/Task/findTasks";
            }
            options.emulateJSON = true;            
            break;
        default:
            throw new Error(method + " is unsupported.");
        };
        syncOverride(method, model, options);
    };
});