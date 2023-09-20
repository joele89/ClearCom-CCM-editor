//uploader = document.getElementById("upload")

async function decode(uploader) {
    if (uploader.files && uploader.files[0]&& (uploader.files[0].name.substring(uploader.files[0].name.lastIndexOf('.') + 1).toLowerCase() == "cca")) 
    var parseViewer = document.getElementById("parseViewer");
    var reader = new FileReader();
    var fileData = await new Promise(resolve => {
        reader.onload = function(e) { resolve(e.target.result); }
        reader.readAsArrayBuffer(uploader.files[0]);
    })
    var decompressor = new DecompressionStream("gzip");
    var decompressed = new Blob(fileData).stream().pipeThrough(decompressor);
    parseViewer.innerText = decompressed.readAsText()
}
