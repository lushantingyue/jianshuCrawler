// 使用 superagent 模块 代理请求网页 + cheerio爬取节点数据
const request = require('superagent');
const cheerio = require('cheerio');

// TODO:爬取简书7日热门
function getPage() {
    request
        .get('http://www.jianshu.com/trending/weekly')
        // .query({ action: 'edit', city: 'London' }) // query string
        // .use(prefix) // Prefixes *only* this request
        // .use(nocache) // Prevents caching of *only* this request
        .end(function (err, res) {
            // Do something
            if (err) {
                console.log('request failed.' + err);
            } else {
                // 返回的text
                var show = contentFilter(res.text);
                console.log(res);
                console.log('\n\n\n========================all response divider =============================\n\n\n');
                console.log(show);
            }
        });
}

function contentFilter(page) {
    var $ = cheerio.load(page);
    // 文章列表
    var list = $('.note-list');

    var data = [];

    // 注意: 必须find出note-list下的每一个 li 节点, 再each取值
    // 遍历每个item, 取出 作者, 标题, 概要, 日期, 头像
    list.find('li').each(function (item) {
        var article = $(this);
        var content = article.find('.content');
        // console.log(content + '\n')

        // var author = content.find('.author').text();
        // #note-13049926 > div > div.author > a
        var avatar = content.find('.author a img').prop('src');
        // $('.apple', '#fruits').text()
        var author = content.find('.author .name a').text().trim();
        var time = content.find('.author .name .time').prop('data-shared-at');
        // $('#fruits').children().last().text();

        // #note-13072607 > div > div.author > div > span
        // console.log(author + '\n')

        var title = content.find('.title').text().trim();
        // console.log(title + '\n')

        var abstract = content.find('.abstract').text().trim();
        // console.log(abstract + '\n')

        // 对象赋值
        var articleData = {
            Author: author,
            Title: title,
            Abstract: abstract,
            Date:time,
            Avatar:avatar
        };
        data.push(articleData);
    });

    return data;
}

getPage();