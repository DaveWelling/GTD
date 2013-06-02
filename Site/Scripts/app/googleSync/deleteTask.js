/// <reference path="../../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../gapiDriveClient.js"/>
/// <reference path="../../jquery-1.8.2.js"/>

define(["app/googleSync/loadAndAuthorize"], function (requestDeferred) {
    var fileDeleteDeferred = $.Deferred();
    var _fileId;
    function endDelete(resp) {
        if (resp.status != 200) {
            fileDeleteDeferred.reject(resp);
        } else {
            fileDeleteDeferred.resolve(resp);
        }
    }
    function beginDelete() {
        var request = gapi.client.drive.files.delete({
            'fileId': _fileId
        });
        request.execute(endDelete);
    }
    return function deleteFile(fileId) {
        _fileId = fileId;
        requestDeferred.then(beginDelete);
        return fileDeleteDeferred;
    };
});