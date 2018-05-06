window.addEventListener('ShowImg',getImgData);
function getImgData(e){
    imgData=e.detail.imgData;
//  alert(imgData);
    document.getElementById("tc12").innerHTML = '<img style="width: 100%;height: 100%;" src="'+imgData+'" />'
}
