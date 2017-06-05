// 爬虫(爬取简书首页文章信息)
const http = require('http');
const cheerio = require('cheerio');

// ============== 爬取完整网页数据 ================ //
var host = 'http://www.jianshu.com';

http.get(host, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data;
    });
    res.on('end', function () {
        // console.log(html);
        var data = contentFilter(html);
        showData(data);
    });
}).on('error', function () {
    console.log('爬取数据出错.');
});

// 目标节点数据:作者,标题, 概览
//content
//      |-- author
//      |-- title
//      |-- abstract


// ===================== 过滤所需数据 ====================== //
function contentFilter(page) {
    var $ = cheerio.load(page);
    // 文章列表
    var list = $('.note-list');

    var data = [];

    // var size = list.find('li').length;

    // 注意: 必须find出note-list下的每一个 li 节点, 再each取值
    // 遍历每个item, 取出 作者, 标题, 要略
    list.find('li').each(function (item) {
        var article = $(this);
        var content = article.find('.content');
        // console.log(content + '\n')

        var author = content.find('.author').text().trim();
        // console.log(author + '\n')

        var title = content.find('.title').text().trim();
        // console.log(title + '\n')

        var abstract = content.find('.abstract').text().trim();
        // console.log(abstract + '\n')

        // 对象赋值
        var articleData = {
            Author: author,
            Title: title,
            Abstract: abstract
        };
        data.push(articleData);
    });

    return data;
}

// 展示爬取的数据
function showData(data) {
    data.forEach(function (item) {
        console.log(item.Author + '\n');
        console.log(item.Title + '\n');
        console.log(item.Abstract + '\n');
    })

    // Q: 怎样把获取的data数据在浏览器显示出来
    // 怎样把获取的data数据在浏览器显示出来，而不是打印出来
    // 5天前 源自：进击Node.js基础（一）... 5-10 24 浏览 1 回答
    // 最佳回答
    // 4天前
    // A: 可以使用node.js新建一个服务器 然后将data数据传输到这个服务器上 然后前端通过ajax的get方法访问这个服务器 拿到数据
}