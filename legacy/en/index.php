<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mandarin GO - Fun Learn Grow</title>
<meta name="keywords" content="Mandarin, Chinese, mandaringo, children education, Chinese Language, Chinese culture, London, United Kingdom, UK, Fun, Learn, grown,Education, education centre, language centre, academy, institution " />
<meta name="description" content="The best Chinese Language and culture centre for children">
<link rel="shortcut icon" href="images/favicon.ico" type="images/favicon.ico">
<link href="css/main.css" rel="stylesheet" type="text/css" />
<link href="css/reset.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/admin.js"></script>

<script type="text/javascript">
		function AutoScroll(obj) {
			var lh = $("#scroll-news").height();
			$(obj).find("ul:first").animate({
				marginTop: "-"+lh+"px"
			}, 500, function() {
				$(this).css({
					marginTop: "0px"
				}).find("li:first").appendTo(this);
			});
		}
		$(document).ready(function() {
			setInterval('AutoScroll("#scroll-news")', 5000);
		});
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
					<li><a href="/" class="now">Home</a></li>
					<li><a href="about">About</a></li>
					<li><a href="curriculum">Curriculum</a></li>
					<li><a href="source">Resource</a></li>
					<li><a href="contact">Contact</a></li>
				</ul>
				<div class="lanshift"><a href="/" class="blue b">EN</a> <span class="gray9">/</span> <a href="../cn/" class="gray9">简</a> <span class="gray9">/</span> <a href="../td/" class="gray9">繁</a></div>
			</div>
		</div>
	</div>
	<div class="mainview"></div>
</div>
<!--<div class="index-news">
	<div class="index-news-con">
		<div class="index-news-tit red">最新資訊：</div>
		<div class="qs-express-news" id="scroll-news">
			<div class="news-list-wrapper">
				<ul class="news-list" style="margin-top:0px;">
					<li class="news-item">
						<a class="" href="news-detail.html" target="_blank">
							中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦，趕快報名吧~~
						</a>
						<span class="fl gray9">2018-09-08</span>
					</li>
					<li class="news-item">
						<a class="" href="news-detail.html" target="_blank">
							中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦，趕快報名吧~~
						</a>
						<span class="fl gray9">2018-09-08</span>
					</li>
					<li class="news-item">
						<a class="" href="news-detail.html" target="_blank">
							中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦，趕快報名吧~~
						</a>
						<span class="fl gray9">2018-09-08</span>
					</li>
				</ul>
			</div>
		</div>
	</div>	
</div>-->
<!--<div class="mb30 clearfix">
	<div class="tit" style="padding-bottom:15px;">
		<h1>最新資訊</h1>
		<h6>Information</h6>
	</div>
	<ul class="newslist" style="width:1210px;">
		<li class="clearfix">
			<a class="" href="news-detail.html" target="_blank">
				中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦~~
			</a>
			<span class="fr gray9">2018-09-08</span>
		</li>
		<li class="clearfix">
			<a class="" href="news-detail.html" target="_blank">
				中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦~~
			</a>
			<span class="fr gray9">2018-09-08</span>
		</li>
		<li class="clearfix">
			<a class="" href="news-detail.html" target="_blank">
				中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦~~
			</a>
			<span class="fr gray9">2018-09-08</span>
		</li>
		<li class="clearfix">
			<a class="" href="news-detail.html" target="_blank">
				中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦~~
			</a>
			<span class="fr gray9">2018-09-08</span>
		</li>
		<li class="clearfix">
			<a class="" href="news-detail.html" target="_blank">
				中國傳統民俗童玩課程開課啦--不僅能了解中國文化和經驗傳承，更能快樂學中文呦~~
			</a>
			<span class="fr gray9">2018-09-08</span>
		</li>
	</ul>
	<div class="mt30 mb20 tc" style="width:100%;">
		<a  href="news.html" class="btn3" style="margin:0 auto;" >查看全部資訊</a>
	</div>
</div>-->
<div id="mainboxa" class="clearfix">
	<div class="tit">
		<h1 class="mb30">Teaching Philosophy</h1>
	</div>
	<ul>
		<li>
			<div class="noword clearfix">
				<div class="number a"></div>
				<p>We value all areas of development of<br/> a young child and utilise fun and<br/> active teaching techniques to allow <br/>our young students to be immersed <br/>in a happy learning environment.</p>
			</div>
			<div class="proimg"><img src="images/img14.png" /></div>
		</li>
		<li>
			<div class="noword clearfix">
				<div class="number b"></div>
				<p>Our featured themes in our<br/> curriculum and activities are<br/> structured and designed based on<br/> the children’s daily and social<br/> experiences.</p>
			</div>
			<div class="proimg"><img src="images/img15.png" /></div>
		</li>
		<li style="margin:0;">
			<div class="noword clearfix">
				<div class="number c"></div>
				<p>We invite children to grow and learn<br/> Mandarin with us through rhymes, <br/>songs, role playing, body<br/> movements and storytelling.</p>
			</div>
			<div class="proimg"><img src="images/img16.png" /></div>
		</li>
	</ul>
</div>
<div id="mainboxb" class="clearfix">
	<div class="frameimg"><img src="images/img01e.png" /></div>
</div>
<div id="mainboxc" class="clearfix">
	<div class="tit">
		<h1 class="mb20">Featured Themes</h1>
		<p class="fs16 lh28">A wide range of topics are covered beginning with basic greetings and self-introduction to learning about school life, communities and occupations. Our curriculum and activities are structured and designed based on the children’s daily and social experiences to increase their social, community and self-awareness while learning a new language.</p>
	</div>
	<ul>
		<li>
			<div class="mb"><img src="images/img04.png" /></div>
			<p>Basic knowledge</p>
		</li>
		<li>
			<div class="mb"><img src="images/img05.png" /></div>
			<p>About myself</p>
		</li>
		<li>
			<div class="mb"><img src="images/img06.png" /></div>
			<p>My family</p>
		</li>
		<li>
			<div class="mb"><img src="images/img07.png" /></div>
			<p>School life</p>
		</li>
		<li style="margin:0;">
			<div class="mb"><img src="images/img08.png" /></div>
			<p>Community</p>
		</li>
		<li>
			<div class="mb"><img src="images/img09.png" /></div>
			<p>Occupations</p>
		</li>
		<li>
			<div class="mb"><img src="images/img10.png" /></div>
			<p>Animals</p>
		</li>
		<li>
			<div class="mb"><img src="images/img11.png" /></div>
			<p>Our environment</p>
		</li>
		<li>
			<div class="mb"><img src="images/img12.png" /></div>
			<p>Health and foods</p>
		</li>
		<li style="margin:0;">
			<div class="mb"><img src="images/img13.png" /></div>
			<p>Festivals and celebrations</p>
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
