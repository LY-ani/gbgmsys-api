// 创建路由对象
const express = require('express');
const router = express.Router();
// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入解析 formdata 格式表单数据的包
const multer = require('multer');
// 导入处理路径的核心模块
const path = require('path');
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') });

const { register, login } = require('../router_handle/user');

const { reg_schema, login_schema } = require('../schema/user');

// 注册新用户
router.post(
  '/reguser',
  upload.single('user_pic'),
  expressJoi(reg_schema),
  register
);

// 登录
router.post('/login', expressJoi(login_schema), login);

// 将路由对象共享出去
module.exports = router;
