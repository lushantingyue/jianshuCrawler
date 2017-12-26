// 使用 superagent 模块 代理请求网页 + cheerio爬取节点数据
const request = require('superagent');
var htmlparser = require("htmlparser2");

const cheerio = require('cheerio');
var mongoose = require('./model/db');
// var mongoose = require('mongoose');
var Article_Model = mongoose.model('Article'); // 使用User模型
var ArticleDetail = mongoose.model('ArticleDetail');

// TODO:爬取简书7日热门
function getPage(page) {
    if (page) {
        var queryPage = "?page=" + page
        console.log(`onQueryPage.`);
    } else {
        queryPage = ""
        console.log('default pageOne.');
    }
    request
        .get('http://www.jianshu.com/trending/weekly'+ queryPage)
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
                // 遍历本地数据爬取详情页
                crawler2detail(show);
                console.log(`首页(head/request/response/html):` + res);
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

        var href = content.find('.meta a').prop('href');
        console.log(href);

        // 对象赋值
        var articleData = {
            Author: author,
            Title: title,
            Abstract: abstract,
            Date: time,
            Avatar: avatar,
            href: href
        };
        data.push(articleData);
        // 更具Model创建数据实体
        new Article_Model({
            author: author,
            title: title,
            _abstract: abstract,
            date: time,
            avatar: avatar,
            href: href
        }).save(function (err, user, count) {
            // ctx.redirect('/');
            console.log('简书7日热门 入库成功...')
        });
    });

    return data;
}

function articleFilter(articleData, href) {
    var $ = cheerio.load(articleData);
    // 文章列表
    // body > div.note > div.post > div.article > h1
    var list = $('div.note');
    // console.log(list);

    var data = [];
    var title = list.find('div.post div.article h1').text().trim();
    console.log('标题: ' + title);
    // body > div.note > div.post > div.article > div.author > a > img
    var avatar = list.find('div.post div.article div.author a img').prop('src');
    console.log('头像: ' + avatar);
    // body > div.note > div.post > div.article > div.author > div > span.name > a
    var name = list.find('div.post div.article div.author div span.name a').text().trim();
    console.log('昵称: ' + name);
    // body > div.note > div.post > div.article > div.show-content
    // var content = list.find('div.post div.article div.show-content').find('p');
    var content = list.find('div.post div.article div.show-content');
        var parseContent = '';
    var parser = new htmlparser.Parser({
        onopentag: function (name, attribs) {
            // if(name === "script" && attribs.type === "text/javascript"){
            //     console.log("JS! Hooray!");
            // }
            if (name === "p") {
                console.log("p tag!");
                parseContent = parseContent + '<p>';
            } else if (name == 'i') {
                parseContent = parseContent + '<i>';
            } else if (name == 'div') {
                parseContent = parseContent + '<div>';
            } else if (name == 'img') {
                parseContent = parseContent + '<img>';
            } else if (name == 'h1') {
                parseContent = parseContent + '<h1>';
            } else if (name == 'b') {
                parseContent = parseContent + '<b>';
            } else if (name == 'br') {
                parseContent = parseContent + '<br>';
            }
        },
        ontext: function (text) {
            console.log("-->", text);
            parseContent = parseContent + text;
        },
        onclosetag: function (tagname) {
            if (tagname === "p") {
                console.log("p tag end!");
                parseContent = parseContent + '</p>';
            } else if (name == 'i') {
                parseContent = parseContent + '</i>';
            } else if (name == 'h1') {
                parseContent = parseContent + '</h1>';
            } else if (name == 'b') {
                parseContent = parseContent + '</b>';
            } else if (name == 'br') {
                parseContent = parseContent + '<br>';
            }
        }
    }, {decodeEntities: true});
    // parser.write(content);
    // parser.end();
    // console.log(`===========================\n` + parseContent + `=============================\n`);

    // console.log('================================================');
    // console.log('正文: ' + content);
    // console.log("================================================");
    // 发表时间, 字数
    var pub_time = list.find('div.post div.article div.author div div span.publish-time').text();
    console.log(pub_time);
    var wordage = list.find('div.post div.article div.author div div span.wordage').text();
    console.log(wordage);

    new ArticleDetail({
        author: name,
        title: title,
        text: content,
        date: pub_time,
        avatar: avatar,
        wordage: wordage,
        href: href
    }).save(function (err, res, count) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log(res);
            console.log(count);
        }
    });
}

function crawler2detail(collection) {
    for (v of collection) {
        console.log('========== page_href: ' + v.href + ' ==============');
        const href = v.href;
        request.get('http://www.jianshu.com' + v.href)
            .end(function (err, resp) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    // console.log(resp.text);
                    articleFilter(resp.text, href);
                }
            });
    }
}

function queryDatabase() {
    ArticleDetail.find(function (err, list) {
        if (err)
            console.log('failed...')
        else {
            console.log('result:' + list);
        }
    });
}

function countArtical() {
    Article_Model.count(function (err, num) {
        if (err)
            console.log('failed...')
        else {
            console.log('count:' + num);
        }
    });
}

function countArticalDetail() {
    ArticleDetail.count(function (err, num) {
        if (err)
            console.log('failed...')
        else {
            console.log('count:' + num);
        }
    });
}

function queryArticleDetailByAuthor(author) {
    ArticleDetail.findOne({'author': author}, function (err, item) {
        if (err)
            console.log('failed...');
        else
            console.log('result: ' + item);
    })
}

function queryArticleDetailByhref(href) {
    ArticleDetail.findOne({'href': href}, function (err, item) {
        if (err)
            console.log('failed...');
        else
            console.log('result: ' + item);
    })
}

// 根据 href字段 查询单条信息
function queryByhref(href) {

    Article_Model.findOne({"href": href}, (err, item) => {
        if (err)
            console.log('failed...')
        else
            console.log('result: ' + item)
    })
}

function clearDatabase() {
    // 移除整个collection数据表
    ArticleDetail.remove({}, function (err) {
        if (err)
            console.log(err);
        else
            console.log('drop collection ArticleDetail success...');
    });
    Article_Model.remove({}, function (err) {
        if (err)
            console.log(err);
        else
            console.log('drop collection Article_Model success...');
    });
}

function removeByAuthor(str) {
    if (!str)
        return;
    else
        var author = str;
    var condition = {
        $or: [{"author": author}]  // 条件满足其一
        // $and: [{"username": usr}, {"goodAt": good}]  // 同时满足条件
    }
    Article_Model.findOneAndRemove({"author": author}, function (err, doc) {
        if (err) {
            console.log(err)
            return;
        }
        console.log('remove success...');
    })
}

function getMultiPage(count) {

    for (var page = 1; page < count; page++) {
        // async function crawler() {
        //     await
        getPage(page)
        // }
    }
}

// clearDatabase()
getMultiPage(2)
// getPage()

// 实现分页的关键DOM节点
// <a data-page="3" href="/trending/weekly" class="load-more">阅读更多</a>

// <meta name="mobile-agent" content="format=html5;url=https://www.jianshu.com/trending/weekly?page=2">

// Chrome调试 可以发现request header带 page=num 参数
// ?page=2  query参数是关键

/**
 * phantomJS模拟翻页：鼠标滑动到最后一个元素
 */


// clearDatabase();
// 查看 db.articles.find()
// 删除collections    CLI: db.articles.drop()
// removeByAuthor('阿阳sunny');
// queryDatabase();
// countArtical();
// countArticalDetail();
// queryByhref('/p/d315a19a991a');

// queryArticleDetailByAuthor('瓯南');
// queryArticleDetailByhref('/p/c5bc31531ecb');

// updateCollections()

function updateCollections() {
    // Article collection and update "abstract" column
    db.getCollection('Article').update({}, {$rename : {"abstract" : "_abstract"}}, false, true)
    // Schema.findOneAndUpdate({_id: id},{test: “更新字段”}).exex();
}