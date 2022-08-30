const db = require('../db/index');
const path = require('path');
const fs = require('fs');
// 导入对密码进行加密处理模块
const bcrypt = require('bcryptjs');
// 导入生成token字符串的包
const jwt = require('jsonwebtoken');
const config = require('../config');
const register = (req, res) => {
  console.log('file', req.file);
  // 重命名图片 只能上次image/*类型的图片，不然会出错
  // 如果要上传其他格式的图片就不把下面重命名的代码删掉
  if (req.file) {
    let oldPath = req.file.path;
    let newPath = req.file.path + '.' + req.file.mimetype.split('/')[1];
    fs.renameSync(oldPath, newPath);
    req.file.path = req.file.path + '.' + req.file.mimetype.split('/')[1];
    req.file.filename =
      req.file.filename + '.' + req.file.mimetype.split('/')[1];
  }
  console.log(req.body);
  const pic = `http://localhost:${config.PORT}/uploads/pic_08.jpeg`;
  const userInfo = {
    ...req.body,
    // user_pic: path.join(
    //   `http://localhost:${config.PORT}/uploads`,
    //   'pic_08.jpeg'
    // ),
    user_pic:
      req.file && req.file.filename
        ? `http://localhost:${config.PORT}/uploads/${req.file.filename}`
        : pic,
  };
  console.log(userInfo);
  // 对用户的密码,进行 bcrypt 加密，返回值是加密之后的密码字符串
  userInfo.password = bcrypt.hashSync(userInfo.password, 10);
  const sql = `select * from sys_users where username='${userInfo.username}'`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！');
    }
    const sql = 'insert into sys_users set ?';
    db.query(sql, userInfo, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        return res.cc('注册用户失败，请稍后再试！');
      res.cc('注册成功！', 0);
    });
  });
};

const login = (req, res) => {
  const userInfo = req.body;
  const sql = `select * from sys_users where username='${userInfo.username}'`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('该用户名未注册！');
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );
    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('密码错误！');
    }
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    // const user = { ...results[0], password: '', user_pic: '' };
    const user = { ...results[0], password: '' };
    // 生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });
    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
    });
  });
};

module.exports = {
  register,
  login,
};
