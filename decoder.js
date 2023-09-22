//uploader = document.getElementById("upload")
var globalOffset;

async function decode(uploader) {
    if (uploader.files && uploader.files[0]&& (uploader.files[0].name.substring(uploader.files[0].name.lastIndexOf('.') + 1).toLowerCase() == "cca")) 
    var parseViewer = document.getElementById("parseViewer");
    var reader = new FileReader();
    var fileData = await new Promise(resolve => {
        reader.onload = function(e) { resolve(e.target.result); }
        reader.readAsArrayBuffer(uploader.files[0]);
    })
    var decompressor = new DecompressionStream("gzip");
    var decompressed = new Blob([fileData]).stream().pipeThrough(decompressor);
    var reader = decompressed.getReader();
    var fileText = "";
    for (i = 0; fileBytes = (await reader.read()).value; fileBytes)
    {
        fileText += new TextDecoder("utf-8").decode(fileBytes);
    }
    globalOffset = 0;
    //USTAR file format
    var dataset = {};
    do {
        console.log("=======================")
        var tableName = readString(fileText, 100);
        var fileMode = readString(fileText, 8);
        var ownerUID = readString(fileText, 8);
        var groupGID = readString(fileText, 8);
        var bodyLen = parseInt(readString(fileText, 12), 8);
        var lastChange = parseInt(readString(fileText, 12), 8);
        var checksum = readString(fileText, 7);
        var typeFlag = readString(fileText, 2);
        var linkedFilename = readString(fileText, 100);
        var ustarIndicator = readString(fileText, 6);
        var ustarVersion = readString(fileText, 2);
        var ownerName = readString(fileText, 32);
        var groupName = readString(fileText, 32);
        var deviceMajorNumber = readString(fileText, 8);
        var deviceMinorNumber = readString(fileText, 8);
        var filenamePrefix = readString(fileText, 155);
        var padding = readString(fileText, 12);
        if (bodyLen > 0) {
            var body = readString(fileText,bodyLen)
            globalOffset += (512 - (bodyLen % 512)) //padding
            if (body.startsWith("{")) {
                body = '[' + body.replace(/}\r?\n?{/g,"},{") + ']';
                try {
                    console.log(body);
                    var table = JSON.parse(body);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        dataset[tableName] = {
            fileMode: fileMode,
            ownerUID: ownerUID,
            groupGID: groupGID,
            bodyLen: bodyLen,
            lastChange: lastChange,
            checksum: checksum,
            typeFlag: typeFlag,
            linkedFilename: linkedFilename,
            ustarIndicator: ustarIndicator,
            ustarVersion: ustarVersion,
            ownerName: ownerName,
            groupName: groupName,
            deviceMajorNumber: deviceMajorNumber,
            deviceMinorNumber: deviceMinorNumber,
            filenamePrefix: filenamePrefix,
            body: body,
            table: table
        }
    } while (globalOffset < fileText.length);

    console.log()
    console.log("REMAINDER");
    console.log()
    console.log(fileText.substring(globalOffset));

}

function readString(body, len) {
    var ret = body.substring(globalOffset,globalOffset+len).replace(/\0+$/g,'');
    //console.log(globalOffset +':' + len + ': "' + ret + '"')
    globalOffset+=len;
    return ret;
}