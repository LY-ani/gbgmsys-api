// 后台端口号
const PORT = 3000;
// 数据库
const DB = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: 3306,
  database: 'gbgmsys',
};
// token字符串密钥
const jwtSecretKey = 'vscode .zZ';
// token有限期
const expiresIn = '10h';
module.exports = {
  PORT,
  DB,
  jwtSecretKey,
  expiresIn,
};
