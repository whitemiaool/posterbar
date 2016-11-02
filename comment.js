var http = require('http');
var querystring = require('querystring');

var http = require('http'),
	cherrio = require('cheerio');
var url = 'http://tieba.baidu.com/f?kw=%E8%A5%BF%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6&fr=index';   //贴吧URL
var tid = []
var i = 0
http.get(url, function(res) {
	var html = '';
	res.on('data', function(data) {
		html += data;
	});
	res.on('end', function(data) {
		//console.log('html: ' + html)
		tid = parserHtml(html);
		setInterval(comment, 15000) //间隔15s执行一次评论
		console.log(tid)
	});
}).on('error', function(err) {
	console.log(err);
});

function parserHtml(html) {
	var $ = cherrio.load(html),
		chapterList = $('.threadlist_title');
	console.log('chapterList:###########' + chapterList)
	var ids = [];
	chapterList.each(function(item) {
		var idtitle = $(this)
		console.log('idtitle######################:' + idtitle)
		var id = idtitle.find('.j_th_tit ')
		console.log(id)
		ids.push(parseInt(id.attr('href').split('/p/')[1], 10))
	})
	return ids
}

function comment() {
	if(i < tid.length) {
		i += 1;
		//post是要发送的数据，也是就body
		var post = querystring.stringify({
			'ie': 'utf-8',
			'kw': '西南科技大学',
			'fid': 128449,
			'tid': tid[i],
			'vcode_md5': '',
			'floor_num': 71,
			'rich_text': 1,
			'tbs': '425a0650bf3b5be31476172819',
			'content': 'No:this is a super test', //评论的内容
			'files': [],
			'mouse_pwd': '20,20,30,10,30,22,18,17,47,23,10,22,10,23,10,22,10,23,10,22,10,23,10,22,47,23,30,19,18,18,47,23,21,16,16,10,17,16,30,14761728410380',
			'mouse_pwd_t': 1476172841038,
			'mouse_pwd_isclick': 0,
			'__type__': 'reply'
		});

		//发送http的header
		var options = {
			host: 'tieba.baidu.com',
			port: 80,
			path: '/f/commit/post/add',
			method: 'post',
			headers: {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
				'Connection': 'keep-alive',
				'Content-Length': post.length,
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				//'Cookie'://用户信息，可以从浏览器登入贴吧后在后台获得，user's coockie we can get it from web browser 
		};

		var req = http.request(options, function(res) {
			console.log('status: ' + res.statusCode)
			console.log(tid[i] + ': 评论中......')
			console.log('\n')
		});
		req.write(post);
		req.end();
	}
}
