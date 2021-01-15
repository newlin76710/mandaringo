<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>About - Mandarin GO - Fun Learn Grow</title>
<meta name="keywords" content="Mandarin, Chinese, mandaringo, children education, Chinese Language, Chinese culture, London, United Kingdom, UK, Fun, Learn, grown,Education, education centre, language centre, academy, institution " />
<meta name="description" content="The best Chinese Language and culture centre for children">
<link rel="shortcut icon" href="images/favicon.ico" type="images/favicon.ico">
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
					<li><a href="about" class="now">About</a></li>
					<li><a href="curriculum">Curriculum</a></li>
					<li><a href="source">Resource</a></li>
					<li><a href="contact">Contact</a></li>
				</ul>
				<div class="lanshift"><a href="/" class="blue b">EN</a> <span class="gray9">/</span> <a href="../cn/" class="gray9">简</a> <span class="gray9">/</span> <a href="../td/" class="gray9">繁</a></div>
			</div>
			</div>
		</div>
	</div>
	<div class="mainview2"></div>
</div>
<div id="mainboxc" class="clearfix">
	<div class="tit">
		<h1>About Mandarin Go</h1>
	</div>
	<div class="genbox aboutword">
	<p class="mb">Mandarin Go’s mission is to create a happy and friendly environment for young children to learn Mandarin and experience Chinese culture through a variety of fun and educational activities.Our curriculum and activities are designed based on the children’s daily and social experiences, combined with rhythms, songs, and storytelling.<br/>

Mandarin Go invites your children to learn while developing fond memories of the journey. We want to inspire your children to learn Mandarin and develop an interest in Chinese culture.With Mandarin Go, your children will discover their character, be curious and realise the importance of family and caring for others. As your children continue to explore, they learn to respect and appreciate the multi-cultural community that they live in.
</p>
	</div>
</div>
<div id="mainboxd" class="clearfix">
	<div class="tit2">
		<h1>Founder</h1>
	</div>
	<div class="fw">
		<div class="fw-photo"><img src="images/teacher01.jpg" /></div>
		<div class="fw-word">
			<h2>Yu-Ting Lin</h2>
			<p class="mt15">The reason that I started Mandarin Go is to create an environment for more children to happily learn Mandarin and create their own precious childhood memories, while giving an opportunity for teachers to fulfil their passions. <br/>
Children are very curious about the world which they live in and language can help them expand their awareness, and more importantly their future prospects. Through Mandarin Go, I hope to see our students develop their emotional potential, such as sharing and caring for others as well as self-description; physical development, through limbic and intrinsic movements; and their local, cultural and global awareness. <br/>
Learning is a journey of growth and I hope that children can be happy as they grow and learn with us. My wish is that all the children and teachers growing with us can enjoy a joyful and memorable experience. 
</p>
		</div>
	</div>
</div>
<div id="mainboxd" class="clearfix" style="background:#778a99;">
	<div class="tit2">
		<h1>Team Members</h1>
		<h6 style="color:#a9bbca;"></h6>
	</div>
	<div style="font-size:16px;color:#ffffff;line-height:26px;width:1210px;margin:0 auto 50px;">
	Our team members are from various parts of the world with diverse backgrounds. We promote cultural awareness and aim to provide a happy learning environment for your children to grow and develop into fine global citizens. We welcome applicants from all cultural backgrounds who share our vision and values to join us.
	</div>
	<ul class="genbox teacher">
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv','fade')">
				<img src="images/teacher04.jpg" />
				<h6>Zhao Min Shu</h6>
			</a>
		</li>
		<li>
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv2','fade2')">
				<img src="images/teacher03.jpg" />
				<h6>Yang Yu Yang</h6>
			</a>
		</li>
		<li style="margin:0;">
			<a href="javascript:void(0)" onClick="ShowDiv('MyDiv3','fade3')">
				<img src="images/teacher02.jpg" />
				<h6>Huai Shuan Chen</h6>
			</a>
		</li>
	</ul>
</div>
<div class="mb30 clearfix">
	<div class="tit">
		<h1>Activities Photos</h1>
		<h6></h6>
	</div>
	<ul class="active">
		<li>
			<div class="mb"><img src="images/actimg32.jpg" /></div>
			<p>Colourful world</p>
		</li>
		<li>
			<div class="mb"><img src="images/actimg33.jpg" /></div>
			<p>Yummy fruits</p>
		</li>
		<li style="margin:0;">
			<div class="mb"><img src="images/actimg34.jpg" /></div>
			<p>My little hand</p>
		</li>
		<li>
			<div class="mb"><img src="images/actimg35.jpg" /></div>
			<p>Explore the world</p>
		</li>
		<li>
			<div class="mb"><img src="images/actimg36.jpg" /></div>
			<p>Chinese culture experience</p>
		</li>
		<li style="margin:0;">
			<div class="mb"><img src="images/actimg38.jpg" /></div>
			<p>Calligraphy</p>
		</li>		
	</ul>
</div>
<div id="foot">
	<div class="footbox clearfix" >
		<div class="contact">
			<a href="https://www.facebook.com/MandarinGoUK/" class="facebook" title="facebook"  target="_blank"></a>
		</div>
		<div class="copyright">© Mandarin Go Ltd. All Rights Reserved. </div>
		<a href="mailto:MandarinGOUK@hotmail.com" class="linklogo"></a>
	</div>
</div>
<!--彈出層時背景層DIV-->
<div id="fade" class="black_overlay" onClick="CloseDiv('MyDiv','fade')"></div>
<div id="MyDiv" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv','fade')"></span>
		<div class="teacherphoto"><img src="images/teacher04.jpg" /></div>
		<div class="teacherdetail">
			<h1 class="mb">Zhao Min Shu</h1>
			<p>National Taiwan Normal University, Taipei, Taiwan
PhD. Institute of Teaching Chinese as a Second Language

</p>
		</div>
	</div>
</div>

<div id="fade2" class="black_overlay" onClick="CloseDiv('MyDiv2','fade2')"></div>
<div id="MyDiv2" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv2','fade2')"></span>
		<div class="teacherphoto"><img src="images/teacher03.jpg" /></div>
		<div class="teacherdetail">
			<h1 class="mb">Yang Yu Yang</h1>
			<p>Tokai University, Japan <br/>
M.A. Department of Information Media Technology
</p>
		</div>
	</div>
</div>

<div id="fade3" class="black_overlay" onClick="CloseDiv('MyDiv3','fade3')"></div>
<div id="MyDiv3" class="white_content">
	<div class="white_box">
		<span class="closelay" onClick="CloseDiv('MyDiv3','fade3')"></span>
		<div class="teacherphoto"><img src="images/teacher02.jpg" /></div>
		<div class="teacherdetail">
			<h1 class="mb">HuaiShuan Chen</h1>
			<p>National Taiwan Normal University, Taipei, Taiwan<br/>
M.A. Institute of Teaching Chinese as a Second Language<br/>
Language Lecturer; National Taiwan Normal University Department of Chinese As a Second Language<br/>
Lecturer; National Central University Language Center<br/>
Instructor, International Chinese Language Program, National Taiwan University, Taipei (Former IUP)<br/> 
Chief Instructor, International Chinese Language Program, National Taiwan University, Taipei (Former IUP)<br/>
Instructor, Chinese Culture Language Center, National Taiwan Normal University, Taipei, Taiwan</p>
		</div>
	</div>
</div>

</body>
</html>
