/// <reference path="../../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../gapiDriveClient.js"/>
/// <reference path="../../jquery-1.8.2.js"/>

define(["app/googleSync/loadAndAuthorize"], function (requestDeferred) {
    var fileCreateDeferred = $.Deferred();
    var _task;
    function endCreate(resp) {
        // status should only be returned on failure
    	if ($.isEmptyObject(resp.status)) {
    		if ($.isEmptyObject(_task.attributes.alternateIds)) {
    			_task.attributes.alternateIds = {};
    		}
    		_task.attributes.alternateIds.gApiId = resp.id;
            fileCreateDeferred.resolve(resp, _task);
        } else {
            fileCreateDeferred.reject(resp);
        }
    }
    function beginCreate() {
        var token = gapi.auth.getToken();
        var request = gapi.client.request({
            'path': '/drive/v2/files/',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token
            },
            'body': {
                "mimeType": "application/vnd.google-apps.folder",
                "title": _task.attributes.title,
                description: _task.attributes.description
            }
        });

        request.execute(endCreate);
    }
    return function createFile(task) {
        _task = task;
        requestDeferred.then(beginCreate);
        return fileCreateDeferred;
    };
});