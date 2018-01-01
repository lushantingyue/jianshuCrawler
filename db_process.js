// 数据表 处理
var mongoose = require('./model/db');
var Article_Model = mongoose.model('Article'); // 使用User模型
var ArticleDetail = mongoose.model('ArticleDetail');

var cheerio = require('cheerio');

function updatePageOnArticle(pageNO, toPage, count) {

    for (var i = 0; i < count; i++) {
        // Article_Model.findOneAndUpdate({page: pageNO}, {page: toPage})

        Article_Model.findOneAndUpdate({"page": pageNO}, {"page":toPage }, function (err, doc) {
            if (err) {
                console.log(err)
                return;
            }
            console.log('success...');
        })

        // db.getCollection("Articles").update({"page":pageNO},{"$set":{"page":toPage}}, false, false)
        // db.getCollection('Article').update({}, {$rename : {"abstract" : "_abstract"}}, false, true)
    }
}

// 批量插入新字段
// db.getCollection("articles").update({"page":{$exists:false}},{"$set":{"page":1}},false,true)
function updateAllPageOnArticle(pageSize) {

    var total = Article_Model.count(function (err, num) {
        if (err) {
            console.log('failed...')
            return 0;
        }
            return num;
    });

    if (total !== 0) {
        var piece = total / pageSize;

        for (var toPage = piece; toPage > 0; toPage--) {

            for (var i = 0; i < pageSize; i++) {
                Article_Model.findOneAndUpdate({"page": 1}, {"page": toPage}, function (err, doc) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    console.log('success...');
                })
            }

        }
    }
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

async function queryArticleDetailByhref(href) {
    var txt = '';
    await ArticleDetail.findOne({'href': href}, function (err, item) {
        if (err) {
            console.log('failed...');
        }
        else {
            console.log('result: ' + item);
            txt = item.text;
        }
    })

    console.log(content);
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

queryArticleDetailByhref('/p/30248d503ca1');
// updatePageOnArticle(1, 2, 20);
// updateAllPageOnArticle(20);

// clearDatabase();

// 查看 db.articles.find()
// 删除collections    CLI: db.articles.drop()
// removeByAuthor('阿阳sunny');
// queryDatabase();
// countArtical();
// countArticalDetail();
// queryByhref('/p/d315a19a991a');

// queryArticleDetailByAuthor('潇逸霏');
// queryArticleDetailByhref('/p/c5bc31531ecb');

// updateCollections()

function updateCollections() {
    // Article collection and update "abstract" column
    db.getCollection('Article').update({}, {$rename : {"abstract" : "_abstract"}}, false, true)
    // Schema.findOneAndUpdate({_id: id},{test: “更新字段”}).exex();
}