//creat crad Project
function ListShow_Project(xmid,xmmc,xmdq,xmlb,fgNormal,fgSame,sgdw,kldw) {
    var xmmc=xmmc;
    //汉字编码，为了get传值
//  var Name=encodeURI(encodeURI(xmmc));
//  var CityName=encodeURI(encodeURI(xmdq));
    var dq=xmdq;
    var xmdq='地区：'+xmdq+'-----';
    var xmlb='工程代码：'+xmlb;
    var jtrq='开始日期：'+fgNormal;
    var yhrq='手机号码：'+fgSame;
    var sg='施工单位：'+sgdw;
    var jl='监理单位：'+kldw;
    var an1='进入工程';
    var an2='查看详情';
    
    var muicontent=document.getElementsByClassName('mui-content');
    var div=document.createElement('div');
    div.className='mui-card margintop10px';
    muicontent[0].appendChild(div);
    var ul=document.createElement('ul');
    ul.className='mui-table-view ';
    div.appendChild(ul);
    var li=document.createElement('li');
    li.className='mui-table-view-cell mui-media my_backgroundcolor_blue my_color_white';
    ul.appendChild(li);
    var actionOne=document.createElement('a');
    actionOne.href = '#';
    li.appendChild(actionOne);
    var img=document.createElement('img');
    img.className='mui-media-object mui-pull-right';
    img.src='../images/xmmc.png';
    actionOne.appendChild(img);
    var div2=document.createElement('div');
    div2.className='mui-media-body';            
    actionOne.appendChild(div2);
    var txt=document.createTextNode(xmmc);
    div2.appendChild(txt);
    var p=document.createElement('p');
    p.className='mui-ellipsis my_color_white';
    div2.appendChild(p);
    var txt2=document.createTextNode(xmdq+xmlb);
    p.appendChild(txt2);
    var p2=document.createElement('p');
    p2.className='mui-ellipsis my_underline my_color_white';
    div2.appendChild(p2);
    var li2=document.createElement('li');
    li2.className='mui-table-view-cell mui-media';
    ul.appendChild(li2);
    var a2=document.createElement('a');
    li2.appendChild(a2);
    var div3=document.createElement('div');
    div3.className='mui-media-body';
    a2.appendChild(div3);
    var span=document.createElement('span');
    span.className='mui-icon mui-icon-spinner-cycle mui-pull-left';
    div3.appendChild(span);
    var actionTwo=document.createElement('a');
    actionTwo.className='mui-btn mui-btn-warning mui-pull-right';
    actionTwo.type='button';
    div3.appendChild(actionTwo);
    var txt4=document.createTextNode(an1);
    actionTwo.appendChild(txt4);
    var p3=document.createElement('p');
    p3.className='mui-ellipsis my_fontsize my_paddingleft';
    div3.appendChild(p3);
    var txt5=document.createTextNode(jtrq);
    p3.appendChild(txt5);
    var p4=document.createElement('p');
    p4.className='mui-ellipsis my_fontsize my_paddingleft';
    div3.appendChild(p4);
    var txt6=document.createTextNode(yhrq);
    p4.appendChild(txt6);
    var p5=document.createElement('p');
    p5.className='mui-ellipsis my_fontsize my_color_blue paddingleft34px';
    div3.appendChild(p5);
    
    var li3=document.createElement('li');
    li3.className='mui-table-view-cell mui-media';
    ul.appendChild(li3);
    var a3=document.createElement('a');
    li3.appendChild(a3);
    var div4=document.createElement('div');
    div4.className='mui-media-body';
    a3.appendChild(div4);
    var span2=document.createElement('span');
    span2.className='mui-icon mui-icon-info mui-pull-left';
    div4.appendChild(span2);
    var button2=document.createElement('button');
    button2.className='mui-btn mui-btn-warning mui-pull-right';
    button2.type='button';
    div4.appendChild(button2);
    var txt8=document.createTextNode(an2);
    button2.appendChild(txt8);
    var p6=document.createElement('p');
    p6.className='mui-ellipsis my_fontsize my_paddingleft';
    div4.appendChild(p6);
    var txt9=document.createTextNode(sg);
    p6.appendChild(txt9);
    var p8=document.createElement('p');
    p8.className='mui-ellipsis my_fontsize my_paddingleft';
    div4.appendChild(p8);
    var txt10=document.createTextNode(jl);
    p8.appendChild(txt10);
    var p7=document.createElement('p');
    p7.className='mui-ellipsis my_fontsize my_color_blue my_paddingleft';
    div4.appendChild(p7);
    /*
     * button action
     */
    actionOne.addEventListener('tap',function(){
        proAction();
    });
    actionTwo.addEventListener('tap',function(){
        proAction();
    });
    function proAction(){
        localStorage.setItem('projectId',xmid);
        localStorage.setItem('projectName',xmmc);
        mui.openWindow({
            url:'project_index.html',
            id:'project_index',
        })
    }
    button2.addEventListener('tap',function(){
        localStorage.setItem('projectId',xmid);
        localStorage.setItem('projectName',xmmc);
        mui.openWindow({
            url:'project_mes.html',
            id:'project_mes',
        })
    });
};
//creat type
function ListShow_Type(TypeName,TypeUrl,TypeId,TypeNum){
    var TypeText = "<li class='mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 mycard' >";
//  TypeText += "<a href='"+TypeUrl+'?TypeId='+TypeId+"'><span class='TypeId'>"+TypeId+"</span>"
    TypeText += "<a href='#'><span class='TypeId' hidden='hidden'>"+TypeId+"</span>"
    TypeText += "<span class='mui-badge mui-badge-primary'>"+TypeNum+"</span>"
    TypeText += "<span class='mui-icon mui-icon-compose'></span>"
    TypeText += "<div class='mui-media-body'>"+TypeName+"</div></a></li>"
    $('.mui-table-view').append(TypeText);
}

//creat crad tab&doc
function ListShow(CId,CType,CUrl,CName,CSUTm,CSSta,CSDLine){
    switch(CType){
        case 0:
            CType = 'my_backgroundcolor_green2';
            break;
        case 1:
            CType = 'my_backgroundcolor_blue2';
            break;
        case 2:
            CType = 'my_backgroundcolor_orange';
            break;
        case 3:
            CType = 'my_backgroundcolor_purple';
            break;
        case 4:
            CType = 'my_backgroundcolor_red';
            break;
        case 5:
            CType = 'my_backgroundcolor_grey';
            break;
        default:break;
    }
    /*
     * CId      [id for tab/doc as card]
     * CType    [css for card]
     * CUrl     [url for card]
     * CName    [name for card]
     * CSUTm    [uploadS for card]
     * CSSta    [sign sta for card]
     * CSDLine  [sign date line for card]
     */
//  "<ul class='mui-table-view mui-card my_list my_marginbottom10px'><li class='mui-table-view-cell "+CType+"'>
//          <a class='a_color' href='"+CUrl+"'>
//              <span class='mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white'></span>
//              <p class='mui-ellipsis my_style2'>"+CName+"</p>
//          </a>
//          <li class='mui-table-view-cell'>
//              <p class='mui-ellipsis my_style1'>提交日期："+CSUTm+"</p>
//          </li>
//          <li class='mui-table-view-cell'>
//              <p class='mui-ellipsis my_style1'>签批状态："+CSSta+"</p>
//          </li>
//          <li class='mui-table-view-cell'>
//              <p class='mui-ellipsis my_style1'>截止日期："+CSDLine+"</p>
//          </li>
//      </li>
//  </ul>"
    var EleText = "<ul class='mui-table-view mui-card my_list my_marginbottom10px'><li class='mui-table-view-cell "+CType+"'><a class='a_color' href='"+CUrl+"'><span class='mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white'></span><p class='mui-ellipsis my_style2'>"+"<span class='CName'>"+CName+"</span>"+"<span class='CId' hidden='hidden'>"+CId+"</span>"+"</p></a><li class='mui-table-view-cell'><p class='mui-ellipsis my_style1'>提交日期："+CSUTm+"</p></li><li class='mui-table-view-cell'><p class='mui-ellipsis my_style1'>签批状态："+CSSta+"</p></li><li class='mui-table-view-cell'><p class='mui-ellipsis my_style1'>截止日期："+CSDLine+"</p></li></li></ul>"
    $('.mui-control-content-body').append(EleText);
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

