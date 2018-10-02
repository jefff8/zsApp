//显示签名
function showSignSvg(SignPX,SignPY,FormW,FormH,SignW,SignH,PageFinal,SignFinal,placeImg){
    PageFinal --;
    var imgArr = document.getElementsByClassName("paneImg")
//              alert(imgArr[0].width)
    //计算表单缩放比
    var scaleFromX = (imgArr[0].width)/FormW
    var scaleFromY = (imgArr[0].height)/FormH
    //签名缩放
    var SignSvg = new Image()
    var SignWidth = SignW*scaleFromX*2
    var SignHeight = SignH*scaleFromY*2
//              SignSvg.width = SignWidth
//              SignSvg.height = SignHeight
    SignSvg.src = SignFinal
    //签名坐标缩放
    var PlaceX = SignPX*scaleFromX
    var PlaceY = SignPY*scaleFromY
    //签名显示
    SignSvg.onload = function()
    {
//                  var place  = $('.pane').eq(PageFinal)
        //定义子节点的位置
        var EleSvgText = ""
        //创建子节点
        EleSvgText += "<img class='PlaceSvg' style='width:"+(SignWidth)+"px;height:"+(SignHeight)+"px;top:"+PlaceY+"px;left:"+PlaceX+"px;' src='"+SignSvg.src+"' />"
//                  console.log(EleSvgText)
        $('.pane').eq(PageFinal).append(EleSvgText)
//                  console.log(SignWidth)
//                  console.log(SignHeight)
//                  console.log(SignSvg.src)
    }
}

//签名的放大
function showSignSvgPlus(){
    
}
