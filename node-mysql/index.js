const mysql = require('mysql')

// 创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    port: '3306',
    database: 'nodeblog'  // 相当于 use nodeblog
})

// 开始连接
con.connect()

// 定义sql语句
const sql = `insert into blogs (title, content, createtime, author) values ('标题C', '内容C',1546871704408, 'zhangsan')`

// 执行sql语句
con.query(sql, (err, result) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(result)
})

// 关闭连接
con.end()
