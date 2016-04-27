var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var safeWriteFile = require('safe-write-file');


// main();

function main(){
	var requrl = 'http://www.27270.com/ent/meinvtupian/';
	request(requrl, function(error, response, body) {
	    if (!error && response.statusCode == 200) {
	        //返回请求页面的HTML body
	        handleData(body)
	    }
	})
}

function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

function handleData(data) {
    var $ = cheerio.load(data);
    var lists = $(".MeinvTuPianBox ul li");
    var items = [];
    lists.each(function(index, el) {
        var $el = $(el).find('img');

        var src = $el.attr('src');
        var name = +new Date() + path.extname(src);
        downloadImg(src, name,'images', function (){
        	console.log(name + ' complete');
        })
    })
}

function downloadImg(uri, filename, dest,callback) {
    request.head(uri, function(err, res, body) {
        if (err) {
            console.log('err: ' + err);
            return false;
        }
        request.get(uri)
        	.pipe(fs.createWriteStream(dest+'/'+filename))
        	.on('close', callback); 
    });
};





/**
 * temp data src  demo1

function getSrc(){
	var base = 'http://evt.dianping.com/5370/images/page_1/motion/';
	var items = [];
	for(var i = 1; i<=72; i++){
		var index = i >= 1000 ? i : i >= 100 ? '0' + i : i >= 10 ? '00' + i : '000' + i; 
		var name = 'motion_' + index + '.jpg';
		var src = base + name;
		downloadImg(src, name, 'dest', function (){
			console.log(name + ' complete')
		});
	}
}
getSrc();
 */

/**
 * demo2
 */

var urls = [
    'http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E7%BE%8E%E5%A5%B3%E5%9B%BE%E7%89%87%E5%BA%93&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=%E7%BE%8E%E5%A5%B3%E5%9B%BE%E7%89%87%E5%BA%93&s=&se=&tab=&width=&height=&face=&istype=&qc=&nc=&fr=&pn=30&rn=30&gsm=1e&1461048600444='

]
function getGirl(){
    var requrl = urls[0];
    request(requrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var res = JSON.parse(body);
            var imgs = res.data || [];
            console.log(imgs)
            imgs.forEach( function(el, index) {
                var src = el.middleURL || "undefined";
                console.log(src)
                var name = +new Date() + path.extname(src);
                downloadImg(src, name,'girls', function (){
                    console.log(name + ' complete');
                })
            });
            //返回请求页面的HTML body
            // handleData(body)
        }
    })
}
getGirl();
