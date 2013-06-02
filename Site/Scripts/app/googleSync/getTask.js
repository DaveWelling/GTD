/// <reference path="../../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../gapiDriveClient.js"/>
/// <reference path="../../jquery-1.8.2.js"/>

define(["app/googleSync/loadAndAuthorize"], function (requestDeferred) {
    var fileGetDeferred = $.Deferred();
    var _fileId;
    function endGet(resp) {
        if (resp.status != 200) {
            fileGetDeferred.reject(resp);
        } else {
            fileGetDeferred.resolve(resp);
        }
    }
    function beginGet() {
        var request = gapi.client.drive.files.get({
            'fileId': _fileId
        });
        request.execute(endGet);
    }
    return function getFile(fileId) {
        _fileId = fileId;
        requestDeferred.then(beginGet);
        return fileGetDeferred;
    };
});