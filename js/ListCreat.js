/*
 * NodeName=>节点名
 * i=>标志位
 */
function CreatNodeLeft(NodeName,i){
    html.push("<a class='mui-control-item' href='#content"+ i +"' >"+NodeName+"</a>");
    return html;
}
/*
 * CardType=>卡片类型
 * UploadTime=》提交时间
 * CheMan=》审批人
 * CheTim=》审批时间
 * CheEls=》审批备注
 * CheRes=》审批结果
 */
function CreatNodeRight(CardType,UploadTime,CheMan,CheTim,CheEls,CheRes,NodeName,i){
    var htmlRight = ''
    htmlRight+="<div id='content"+ i + "' class='mui-control-content'><div class='mui-table-view'>";
    htmlRight+="<li class='mui-table-view-cell'>"+NodeName+"</li>";
    for(var i=0;i<2;i++){
        htmlRight+="<div class='mui-card'><div class='mui-card-header "+CardType+"'>提交时间："+UploadTime+"</div><div class='mui-card-content'><div class='mui-card-content-inner'>";
        htmlRight+="<p><span>审批人：</span></p><p><span class='formMes'>测试工程2</span></p><hr/>"
        htmlRight+="<p><span>审批时间：</span></p><p><span class='formMes'>测试工程2</span></p><hr/>";
        htmlRight+="<p><span>备注：</span></p><p><span class='formMes'>测试工程2</span></p></div></div>"
        htmlRight+="<div class='mui-card-footer'><span class='formMes'>审批结果:驳回</span></div></div>"
    }
    htmlRight+='</div></div>';
    return htmlRight
}