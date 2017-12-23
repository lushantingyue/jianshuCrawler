var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// TODO:定义一个数据的模板规格
// 文章: 作者,标题,概要,日期,头像
var Article = new Schema({
    author: String,
    title: String,
    abstract: String,
    date:String,
    avatar:String,
    href:String
});

var ArticleDetail = new Schema({
    author: String,
    title: String,
    text: String,
    date:String,
    avatar:String,
    wordage:String,
    href:String
});

// 根据模板定义模型
mongoose.model("Article", Article);
mongoose.model("ArticleDetail", ArticleDetail);
// 创建数据库连接
mongoose.Promise = global.Promise;

// 连接数据库, 方式一
// mongoose.connect('mongodb://localhost/MyBlog-User');

// 连接数据库, 方式二
var conn = mongoose.createConnection('localhost','MyBlog-User');

conn.on('error', console.error.bind(console, '连接错误'));
// open -> openUri
// `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead
conn.once('openUri', function () {
    console.log('连接成功...');
});

module.exports = mongoose;