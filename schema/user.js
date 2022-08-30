const joi = require('joi');

// 用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi
  .string()
  .pattern(/^[\S]{6,16}$/)
  .required();
const nickname = joi.string().min(0).max(10);
const email = joi.string().min(0);

// 注册和登录表单的验证规则对象
exports.login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
  },
};
exports.reg_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
    nickname,
    email,
  },
};
