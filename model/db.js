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
    wordage:String
});

// 根据模板定义模型
mongoose.model("Article", Article);
mongoose.model("ArticleDetail", ArticleDetail);
// 创建数据库连接
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/MyBlog-User');

// var conn = mongoose.createConnection('localhost','MyBlog-User');
//
// conn.on('error', console.error.bind(console, '连接错误'));
// conn.once('open', function () {
//     console.log('连接成功...');
// });

module.exports = mongoose;