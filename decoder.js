
function decode(uploader) {
    if (uploader.files && uploader.files[0]&& (url.substring(url.lastIndexOf('.') + 1).toLowerCase() == "cca")) 
    var reader = new FileReader();
    reader.onload = function(e) {
        var parseViewer = document.getElementById("parseViewer");
        parseViewer.innerText = e.target.result;
    }
    read.readAsDataURL(input.files[0]);
}