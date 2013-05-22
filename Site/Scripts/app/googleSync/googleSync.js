/// <reference path="../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../gapiDriveClient.js"/>

// Change read -> get to read -> post
define(['backbone'], function (backbone) {
    var CLIENT_ID = '178349449538-uqbhjan88ghb4fni6i8ebr1870mns25a.apps.googleusercontent.com';
    var SCOPES = 'https://www.googleapis.com/auth/drive';


    /**
     * Check if the current user has authorized the application.
     */
    function checkAuth() {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
            handleAuthResult);
    }

    /**
     * Called when authorization server replies.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
        if (authResult){
            if (authResult.error) {
                throw new Error(authResult.error);
            }
            // passed.
        } else {
            gapi.auth.authorize(
              { 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false },
              handleAuthResult);
        }
    }

    /**
     * Start the file upload.
     *
     * @param {Object} evt Arguments from the file selector.
     */
    function uploadFile(evt) {
        gapi.client.load('drive', 'v2', function() {
            var file = evt.target.files[0];
            insertFile(file);
        });
    }

    /**
     * Insert new file.
     *
     * @param {File} fileData File object to read data from.
     * @param {Function} callback Function to call when the request is complete.
     */
    function insertFile(fileData, callback) {
      var boundary = '-------314159265358979323846';
      var delimiter = "\r\n--" + boundary + "\r\n";
      var closeDelim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
            var contentType = fileData.type || 'application/octet-stream';
            var metadata = {
                'title': fileData.name,
                'mimeType': contentType
            };

            var base64Data = btoa(reader.result);
            var multipartRequestBody =
                delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: ' + contentType + '\r\n' +
                    'Content-Transfer-Encoding: base64\r\n' +
                    '\r\n' +
                    base64Data +
                    closeDelim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files',
                'method': 'POST',
                'params': { 'uploadType': 'multipart' },
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });
            if (!callback) {
                callback = function(file) {
                    console.log(file);
                };
            }
            request.execute(callback);
        };
    }
    
    // Override for Backbone.sync
    return function (method, model, options) {
        // Verify user is logged in.
        checkAuth();
        
        options || (options = {});

        //switch (method) {
        //    case 'create':
        //        // POST /Task/create
        //        options.url = AppConstants.GoogleApiUrl + "/Task/create";
        //        options.emulateJSON = true;
        //        break;
        //    case 'update':
        //        // POST /Task/{1}/update
        //        //options.url = AppConstants.RhoModelUrl + "/Task/{" + model.id + "}/update";
        //        options.url = AppConstants.GoogleApiUrl + "/Task/update";
        //        options.emulateJSON = true;
        //        //options.url = AppConstants.RhoModelUrl + "/Task/restUpdate/{" + model.id + "}";
        //        break;
        //    case 'delete':
        //        // POST /Task/{1}/delete
        //        options.url = AppConstants.GoogleApiUrl + "/Task/{" + model.id + "}/delete";
        //        break;
        //    case 'read':
        //        if ((!model.hasOwnProperty("models")) && model.attributes[model.idAttribute]) {
        //            // GET /Task/{1}
        //            options.url = AppConstants.GoogleApiUrl + "/Task/{" + model.id + "}";
        //        } else {
        //            // GET /Task
        //            options.url = AppConstants.GoogleApiUrl + "/Task/findTasks";
        //        }
        //        options.emulateJSON = true;
        //        break;
        //    default:
        //        throw new Error(method + " is unsupported.");
        //};
        //backbone.sync(method, model, options);
    };
});