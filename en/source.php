<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Resource - Mandarin GO - Fun Learn Grow</title>
<meta name="keywords" content="Mandarin, Chinese, mandaringo, children education, Chinese Language, Chinese culture, London, United Kingdom, UK, Fun, Learn, grown,Education, education centre, language centre, academy, institution " />
<meta name="description" content="The best Chinese Language and culture centre for children"><link rel="shortcut icon" href="images/favicon.ico" type="images/favicon.ico">
<link href="css/main.css" rel="stylesheet" type="text/css" />
<link href="css/reset.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/admin.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript">
//彈出隱藏層
function ShowDiv(show_div,bg_div){
document.getElementById(show_div).style.display='block';
document.getElementById(bg_div).style.display='block' ;
var bgdiv = document.getElementById(bg_div);
bgdiv.style.width = document.body.scrollWidth;
// bgdiv.style.height = $(document).height();
$("#"+bg_div).height($(document).height());
};
//關閉彈出層
function CloseDiv(show_div,bg_div)
{
document.getElementById(show_div).style.display='none';
document.getElementById(bg_div).style.display='none';
};
</script> 
<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" ></script>
<script type="text/javascript">
    var imgUrl = 'images/soview.png'; 
    var descContent = 'Chinese Language and Culture Learning Centre for Children';
    var shareTitle = 'Mandarin GO - Fun Learn Grow';
    var appid = '';

    $.ajax({
        type : 'POST',
        url :  "http://dev.mymax.cn/running/comm/weixin/open/jsSDKConfig", //这个地址并非通用且长期有效，请去微信官方查看文档，并自行配置
        dataType : "json",
        data:{url:window.location.href},
        success : function(response){
             var appId = response.s.appId;
                var timestamp = response.s.timeStamp;
                var nonceStr = response.s.nonceStr;
                var signature = response.s.signature;

                wx.config({
                    debug: false,
                    appId: appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                    ]
                });
                 wx.ready(function() {
                         
                        wx.onMenuShareTimeline({
                            title: shareTitle, // 分享标题
                            link: lineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareAppMessage({
                            title: shareTitle, // 分享标题
                            desc: descContent, // 分享描述
                            link: lineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl:'' , // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                });
        },
        error:function(response){
            window.parent.growl("删除失败["+response.responseText+"]!","error");
        }
    });
</script>
</head>

<body>
<img src="images/soview.png" width="0" height="0" />
<div id="head">
	<div class="navbox">
		<div class="nav">
			<a href="/" class="logo" title="Mandarin GO"></a>
			<div class="list">
				<ul class="toolbar">
					<li><a href="/">Home</a></li>
					<li><a href="about">About</a></li>
					<li><a href="curriculum">Curriculum</a></li>
					<li><a href="source" class="now">Resource</a></li>
					<li><a href="contact">Contact</a></li>
				</ul>
				<div class="lanshift"><a href="/" class="blue b">EN</a> <span class="gray9">/</span> <a href="../cn/" class="gray9">简</a> <span class="gray9">/</span> <a href="../td/" class="gray9">繁</a></div>
			</div>
			</div>
		</div>
	<div class="mainview5"></div>
	</div>
<div>


<div id="mainboxf" class="clearfix" style="background:#fff;">
	<div class="tit" style="padding-bottom:20px;">
		<h1 class="mb30">Activity Sheets</h1>
	</div>
	<ul class="study-list">
		<li>
			<a href="resource/a08.jpg" class="viewimg" target="_blank"><img src="images/resource/a08.jpg" width="70%"/></a>
			<div class="viewtit">
				<p style="background:#f0f0f0">The Best Bear Colouring Sheet</p>
				<a href="" class="download" download="resource/a08.jpg"></a>
			</div>
		</li>
		<li>
			<a href="resource/a07.jpg" class="viewimg" target="_blank"><img src="images/resource/a07.jpg" width="70%"/></a>
			<div class="viewtit">
				<p style="background:#f0f0f0">Lantern Drawing Sheet</p>
				<a href="" class="download" download="resource/a07.jpg"></a>
			</div>
		</li>
		<li>
			<a href="resource/a06.jpg" class="viewimg" target="_blank"><img src="images/resource/a06.jpg" width="70%"/></a>
		  <div class="viewtit">
				<p style="background:#f0f0f0">Imitative Writing</p>
				<a href="resource/color.pdf" class="download" download="resource/a06.jpg"></a>
			</div>
		</li>
		<li style="margin-right:0;">
			<a href="resource/a05.jpg" class="viewimg" target="_blank"><img src="images/resource/a05.jpg" width="70%"/></a>
			<div class="viewtit">
				<p style="background:#f0f0f0">Cut and Paste the Fruits</p>
				<a href="" class="download" download="resource/a05.jpg"></a>
			</div>
		</li>
		<li>
			<a href="resource/a04.jpg" class="viewimg" target="_blank"><img src="images/resource/a04.jpg" width="70%"/></a>
			<div class="viewtit">
				<p style="background:#f0f0f0">Connect the Dots</p>
				<a href="" class="download" download="resource/a04.jpg"></a>
			</div>
		</li>
		<li>
			<a href="resource/a03.jpg" class="viewimg" target="_blank"><img src="images/resource/a03.jpg" width="70%"/></a>
			<div class="viewtit">
				<p style="background:#f0f0f0">The Colour of Fruits</p>
				<a href="" class="download" download="resource/a03.jpg"></a>
			</div>
		</li>
		<li>
			<a href="resource/a02.jpg" class="viewimg" target="_blank"><img src="images/resource/a02.jpg" width="70%"/></a>
			<div class="viewtit">
				<p style="background:#f0f0f0">The Finger Song of Fruits</p>
				<a href="" class="download" download="resource/a02.jpg"></a>
			</div>
		</li>
		<li style="margin-right:0;">
			<a href="resource/a01.jpg" class="viewimg" target="_blank"><img src="images/resource/a01.jpg" width="70%"/></a>
			<div class="viewtit">
				<p style="background:#f0f0f0">My Favourite Fruit</p>
				<a href="" class="download" download="resource/a01.jpg"></a>
			</div>
		</li>
	</ul>
</div>
<div id="mainboxf" class="clearfix" style="background:#f2f2f2;">
	<div class="tit" style="padding-bottom:20px;">
		<h1 class="mb30">Children’s Chinese Learning Songs</h1>
	</div>
	<ul class="study-list">
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv','fade')" class="viewimg"><img src="images/resource/07.jpg" width="260"/></a>
			<div class="viewtit2">
				<p>Hello Song</p>
				<a href="https://www.youtube.com/watch?v=m_rDIzj6DRE" class="see" target="_blank"></a>
			</div>
		</li>
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv2','fade2')" class="viewimg"><img src="images/resource/08.jpg" width="260"/></a>
			<div class="viewtit2">
				<p>Colour Song</p>
				<a href="https://www.youtube.com/watch?v=UulTlStNp5k&frags=pl%2Cwn" class="see" target="_blank"></a>
			</div>
		</li>
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv3','fade3')" class="viewimg"><img src="images/resource/09.jpg" width="260"/></a>
			<div class="viewtit2">
				<p>Fruits Song</p>
				<a href="https://www.youtube.com/watch?v=tM_HV6-_AEs&frags=pl%2Cwn" class="see" target="_blank"></a>
			</div>
		</li>
		<li style="margin-right:0;">
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv4','fade4')" class="viewimg"><img src="images/resource/10.jpg" width="260"/></a>
			<div class="viewtit2">
				<p>Happy Clapping Song</p>
				<a href="https://www.youtube.com/watch?v=wAGJVPXaHHk&frags=pl%2Cwn" class="see" target="_blank"></a>
			</div>
		</li>
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv5','fade5')" class="viewimg"><img src="images/resource/11.jpg" width="260"/></a>
			<div class="viewtit2">
				<p>Dancing Rabbit</p>
				<a href="https://www.youtube.com/watch?v=PC0w5nP9aDo&frags=pl%2Cwn" class="see" target="_blank"></a>
			</div>
		</li>
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv6','fade6')" class="viewimg"><img src="images/resource/13.jpg" width="260"/></a>
			<div class="viewtit2">
				<p>Find My Body Song</p>
				<a href="https://www.youtube.com/watch?v=ZbdMqA_Lat0&frags=pl%2Cwn" class="see" target="_blank"></a>
			</div>
		</li>
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv7','fade7')" class="viewimg"><img src="images/resource/12.jpg" width="260"/></a>
			<div class="viewtit2">
				<p>My Face Song</p>
				<a href="https://www.youtube.com/watch?v=B2SPDR6orCg" class="see" target="_blank"></a>
			</div>
		</li>
	</ul>
</div>
<div id="mainboxf" class="clearfix" style="background:#fff;">
	<div class="tit" style="padding-bottom:20px;">
		<h1 class="mb30">Other Resources</h1>
	</div>
	<ul class="study-list">
		<li>
			<a href="http://support.playcloud.org/fingersong/csource03/img.php?lang=tc&class2=73" target="_blank">
			<div class="viewimg"><img src="images/resource/14.jpg" width="260"/></div>
			<div class="viewtit" style="padding-bottom:0;">
				<p style="border-bottom:none; margin:0;">Chinese Finger Songs</p>
			</div>
			</a>
		</li>
		<li>
			<a href="http://edu.ocac.gov.tw/local/taiwan_toy/toy_list_1_c.htm" target="_blank">
			<div class="viewimg"><img src="images/resource/15.jpg" width="260"/></div>
			<div class="viewtit" style="padding-bottom:0;">
				<p style="border-bottom:none; margin:0;">Traditional Chinese Folk and Toys</p>
			</div>
			</a>
		</li>
	</ul>
</div>
</div>

<div id="foot">
	<div class="footbox clearfix" >
		<div class="contact">
			<a href="https://www.facebook.com/MandarinGoUK/" class="facebook" title="facebook" target="_blank"></a>
		</div>
		<div class="copyright">© Mandarin Go Ltd. All Rights Reserved. </div>
		<a href="mailto:MandarinGOUK@hotmail.com" class="linklogo"></a>
	</div>
</div>
<div id="fade" class="black_overlay" onClick="CloseDiv('MyDiv','fade')"></div>
<div id="MyDiv" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv','fade')"></span>
		<iframe width="900" height="470" src="https://www.youtube.com/embed/m_rDIzj6DRE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="background:#cccccc;"></iframe>
	</div>
</div>
<div id="fade2" class="black_overlay" onClick="CloseDiv('MyDiv2','fade2')"></div>
<div id="MyDiv2" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv2','fade2')"></span>
		<iframe width="900" height="470" src="https://www.youtube.com/embed/UulTlStNp5k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="background:#cccccc;"></iframe></iframe>
	</div>
</div>
<div id="fade3" class="black_overlay" onClick="CloseDiv('MyDiv3','fade3')"></div>
<div id="MyDiv3" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv3','fade3')"></span>
		<iframe width="900" height="470" src="https://www.youtube.com/embed/tM_HV6-_AEs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="background:#cccccc;"></iframe></iframe>
	</div>
</div>
<div id="fade4" class="black_overlay" onClick="CloseDiv('MyDiv4','fade4')"></div>
<div id="MyDiv4" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv4','fade4')"></span>
		<iframe width="900" height="470" src="https://www.youtube.com/embed/wAGJVPXaHHk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="background:#cccccc;"></iframe></iframe>
	</div>
</div>
<div id="fade5" class="black_overlay" onClick="CloseDiv('MyDiv5','fade5')"></div>
<div id="MyDiv5" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv5','fade5')"></span>
		<iframe width="900" height="470" src="https://www.youtube.com/embed/PC0w5nP9aDo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="background:#cccccc;"></iframe>
	</div>
</div>
<div id="fade6" class="black_overlay" onClick="CloseDiv('MyDiv6','fade6')"></div>
<div id="MyDiv6" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv6','fade6')"></span>
		<iframe width="900" height="470" src="https://www.youtube.com/embed/ZbdMqA_Lat0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="background:#cccccc;"></iframe>
	</div>
</div>
<div id="fade7" class="black_overlay" onClick="CloseDiv('MyDiv7','fade7')"></div>
<div id="MyDiv7" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv7','fade7')"></span>
		<iframe width="900" height="470" src="https://www.youtube.com/embed/B2SPDR6orCg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="background:#cccccc;"></iframe></iframe>
	</div>
</div>
<!--<div id="black_overlay" class="black_overlay" style="display:block;position:fixed;"></div>
<div id="white_content" class="white_content" style="display:block;">
	<div class="white_box">
		<span class="closelay"></span>
		<div class="tc">	
			<img src="act/images/act01.jpg" border="0" usemap="#Map" />
			<map name="Map" id="Map">
			  <area shape="rect" coords="272,404,588,452" href="act/curriculum01.html"  style="outline:none;"/>
			</map>
	  </div>
	</div>
</div>
<script type="text/javascript">

$(".closelay").click( function () { 
	$("#black_overlay").hide();
	$("#white_content").hide();

 });
$(".black_overlay").click( function () { 
	$("#black_overlay").hide();
	$("#white_content").hide();

 });
</script> -->
</body>
</html>
