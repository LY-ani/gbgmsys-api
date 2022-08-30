// 导入express模块
const express = require('express');
const { PORT } = require('./config');

// 导入解析token的中间件
const { expressjwt } = require('express-jwt');
const config = require('./config');

// 验证规则模块
const joi = require('joi');

const app = express();

// 导入cors中间件，设置跨域
const cors = require('cors');
app.use(cors());
// // 所有请求都经过这里
// app.all('*', function (req, res, next) {
//   console.log(req.headers.origin);
//   var orginList = ['http://localhost:8080'];
//   // 防止undefined 报错
//   if (!req.headers.origin) {
//     return;
//   }
//   if (orginList.includes(req.headers.origin.toLowerCase())) {
//     //允许的header类型
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin,X-Requested-with,content-type,content-type,Accept,Authorization'
//     );
//     //跨域允许的请求方式
//     res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
//     //设置允许跨域的域名，*代表允许任意域名跨域
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     if (req.method.toLowerCase() == 'options') {
//       res.sendStatus(200); //让options尝试请求快速结束
//     } else {
//       next();
//     }
//   } else {
//     res.sendStatus(500);
//   }
// });

// 配置解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// 封装res.cc中间件
app.use(function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // status=0成功，status=1失败，默认失败，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 解析token
app.use(
  expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({
    path: [/^\/api\//, /^\/uploads\//],
  })
);

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'));

// 导入并注册路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);
// 获取登录用户信息
app.get('/getUser', (req, res) => {
  res.send({ user: req.auth, status: 0 });
});
// 根据用户获取菜单
const getMenu = require('./router_handle/getMenu');
app.get('/getMenu', getMenu);
// 全局错误级别中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！', 401);
  // return res.status(401).send('身份认证失败！');

  // 未知错误
  res.cc(err);
});

app.listen(PORT, () => {
  console.log(`api running at port ${PORT}`);
});
