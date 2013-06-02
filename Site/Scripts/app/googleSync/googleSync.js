/// <reference path="../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../gapiDriveClient.js"/>
/// <reference path="../../jquery-1.8.2.js"/>

// Change read -> get to read -> post
define(['backbone'], function (backbone) {
    
    /**
     * Start the file upload.
     *
     * @param {Object} evt Arguments from the file selector.
     */
    function uploadFile(evt) {
        gapi.client.load('drive', 'v2', function () {
            var file = evt.target.files[0];
            insertFile(file);
        });
    }
 

    function innerGetRoot() {
        var url = "https://www.googleapis.com/drive/v2/files/" + AppConstants.RootId;
        return $.getJSON(url);
    };
    
    function createFolder() {

        var access_token = googleAuth.getAccessToken();

        var request = gapi.client.request({
            'path': '/drive/v2/files/',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            },
            'body': {
                "title": "Tasks",
                "mimeType": "application/vnd.google-apps.folder",
            }
        });

        request.execute(function (resp) {
            console.log(resp);
            document.getElementById("info").innerHTML = "Created folder: " + resp.title;
        });
    }
    
    function getRoot() {

        // Make sure gapi loaded and authenticated before attempting get.
        var chain1 = loadGapiClient();
        var chain2 = chain1.then(checkAuth);
        var chain3 = chain2.then(innerGetRoot);
        var chain4 = chain3.then(null, createRoot);
        return chain3;
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
        reader.onload = function (e) {
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
                callback = function (file) {
                    console.log(file);
                };
            }
            request.execute(callback);
        };
    }

    // Override for Backbone.sync
    return function (method, model, options) {
        options || (options = {});

        this.deleteRoot = deleteRoot;
        this.getRoot = getRoot;
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