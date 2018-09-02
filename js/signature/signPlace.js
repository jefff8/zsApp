/*
 * 定义背景
 */
canvas = document.getElementById("backgcanvas");
context = canvas.getContext('2d');
imageBg = new Image();
imageBg.src = imgTab
/*
 * 定义签名
 */
canvasSign = document.getElementById("signcanvas");
contextSign = canvasSign.getContext('2d');
imageSign = new Image();
imageSign.src = imgSign
/*
 * 关于签名的移动
 */
canvas.onmousedown=function (e) {
    loc = windowToCanvas(e.clientX,e.clientY);
    $('#SignX').val(loc.x)
    $('#SignY').val(loc.y)
    ShowImg()
}
/*
 * 保存操作
 */
$('#Save-btn').on('tap',function(){
    var dataUrl = canvas.toDataURL()
    localStorage.setItem('SignFinal',dataUrl);
})
//绘制签名
function ShowImgSign(){
    //清除旧签名
    var WidthSign = canvasSign.width
    var HeightSign = canvasSign.height
    contextSign.clearRect( 0, 0,WidthSign,HeightSign)
    //控制签名宽度
    var canvasSignWidth = imageSign.width
    var canvasSignHeitht = imageSign.height
    
    //关于签名的缩放
    var scaleSign = $('#field-range-input').val()
    
    var WidthSignShow = canvasSignWidth*scaleSign*0.01
    var HeightSignShow = canvasSignHeitht*scaleSign*0.01
    
    //绘制签名
    canvasSign.width = WidthSignShow*PIXEL_RATIO
    canvasSign.height = HeightSignShow*PIXEL_RATIO
    canvasSign.style.width = WidthSignShow+'px'
    canvasSign.style.height = HeightSignShow+'px'
    contextSign.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    contextSign.drawImage(imageSign, 0, 0,WidthSignShow,HeightSignShow)
}
//获取设备像素比
var PIXEL_RATIO = (function () {
    var ctx = document.createElement('canvas').getContext('2d'),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
})();

//绘制背景
function ShowImg(){
    ShowImgSign()
    //控制背景宽度
    var imgWidth = imageBg.width
    var imgHeight = imageBg.height
//          console.log(imgWidth)
//          console.log(imgHeight)
    var canvasWidth = Math.min(imgWidth , $(window).width()-10 )
    
    //计算缩放比
    var scale = canvasWidth/imgWidth
//          console.log(scale)
    //解决模糊问题
    var showWidth = imgWidth*scale
    var showHight = imgHeight*scale
//          console.log(showWidth)
//          console.log(showHight)
    canvas.width = showWidth*PIXEL_RATIO
    canvas.height = showHight*PIXEL_RATIO
//          canvas.width = showWidth*5
//          canvas.height = showHight*5
    canvas.style.width = showWidth+'px'
    canvas.style.height = showHight+'px'
    
    //获取签名绘制位置
    var SignPX = $('#SignX').val()
    var SignPY = $('#SignY').val()
    
    
    context.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    context.drawImage(imageBg, 0, 0,showWidth,showHight)
    context.drawImage(canvasSign, SignPX, SignPY)
}
//获取坐标
function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect()
    return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)}
}