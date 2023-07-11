const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'rehabilitation_db'
});

// cssファイルの取得
app.use(express.static('assets'));

// mysqlからデータを持ってくる
app.get('/', (req, res) => {
  const sql = "select * from clients";

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('index', {
      users: result
    });
  });
});

app.post('/', (req, res) => {
  const sql = "INSERT INTO clients SET ?"
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'html/form.html'))
});

app.get('/edit/:id', (req, res) => {
  //clientsテーブルからidが合致するデータの表示？
  const sql = "SELECT * FROM clients WHERE id = ?";
  //selectをqueryでコマンドを叩いている、それをrenderで返している？
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('edit', {
      user: result
    });
  });
});

app.get('/user_information/:id', (req, res) => {
  //clientsテーブルからidが合致するデータの表示？
  const sql = "SELECT * FROM rihabili_user_data WHERE id = ?";
  //selectをqueryでコマンドを叩いている、それをrenderで返している？
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('user_information', {
      user: result
    });
  });
});


// app.get('/user_information/:id', (req, res) => {
//   // パラメータからidを取得
//   const id = parseInt(req.params.id);
//   // idに一致するユーザー情報を検索
//   const user = userInformation.find(user => user.id === id);
//   // ユーザー情報が存在する場合
//   if (user) {
//     res.render('user_information', { user });
//   } else {
//     // ユーザーが見つからない場合はエラーページを表示するなどの処理
//     res.render('error');
//   }
// });



app.post('/update/:id', (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE clients SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const sql = "DELETE FROM clients WHERE id = ?";
  con.query(
    sql, [req.params.id],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.redirect('/');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));