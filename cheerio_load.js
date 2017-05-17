//使用 cheerio 生成Dom 结构
var cheerio = require('cheerio');
var $ = cheerio.load('<div class="container"></div>');
//console.info($);
var container = $('.container');
//console.info(container);
for (var i = 0; i < 10; i++) {
    //方法1
    //container.append('<div class="item">'+i+'</div>');
    //方法2
    var item = $('<div />');
    item.addClass('item');
    item.text(i);
    container.append(item);
}
//console.info(container.html());
console.info($.html());