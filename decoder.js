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
    var tableName = readString(fileText, 100);
    var unknownInt1 = readString(fileText, 8);
    var unknownInt2 = readString(fileText, 8);
    var unknownInt3 = readString(fileText, 8);
    var unknownInt4 = readString(fileText, 12);
    var unknownInt5 = readString(fileText, 12);
    var unknownInt6 = readString(fileText, 8);
    var unknownInt7 = readString(fileText, 7);
    var unknownInt8 = readString(fileText, 2);
    var unknownStrings = readString(fileText, 100);
    var ustar = readString(fileText, 8);
    var user = readString(fileText, 5);
    var group = readString(fileText, 5);
    var body = readString(fileText, 1000);

    console.log(tableName);
    console.log(unknownInt1);
    console.log(unknownInt2);
    console.log(unknownInt3);
    console.log(unknownInt4);
    console.log(unknownInt5);
    console.log(unknownInt6);
    console.log(unknownInt7);
    console.log(unknownInt8);
    console.log(unknownStrings);
    console.log(ustar);
    console.log(user);
    console.log(group);
    console.log(body);

    parseViewer.innerText = fileText.substring(globalOffset);
    //869
    //1714
    //3304
    //4150
    //5000

    //table name (char 100, null term, padded nulls)
    //int (char 8, 7 digits + null term) //0000644 (unix perms???, maybe string lens for users???)
    //int (char 8, 7 digits + null term) //0
    //int (char 8, 7 digits + null term) //0
    //int (char 12, 11 digits + null term)
    //int (char 12, 11 digits + null term)
    //int (char 7, 6 digits + null term)
    //int (char 2, space + 1 digit + null term)
    // unknown (char 100, padded nulls)
    // 'ustar  ' (char 8, 7 chars + null term)
    // 'root' (char 5, 4 chars + null term)
    // 'root' (char 5, 4 chars + null term)
    // null terminated body?? (len ??)
    //
}

function readString(body, len) {
    ret = body.substring(globalOffset,len);
    globalOffset+=len;
    return ret;
}