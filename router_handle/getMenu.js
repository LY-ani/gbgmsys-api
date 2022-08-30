const getMenu = (req, res) => {
  const menu = [
    {
      path: '/home',
      name: 'Home',
      label: '首页',
      icon: 's-home',
      url: 'home/Home.vue',
    },
    {
      path: '/mall',
      name: 'Mall',
      label: '课程管理',
      icon: 'reading',
      url: 'mall/Mall.vue',
    },
    {
      path: '/user',
      name: 'User',
      label: '用户管理',
      icon: 'user',
      url: 'user/User.vue',
    },
    {
      path: '/other',
      label: '其他',
      icon: 'help',
      children: [
        {
          path: '/page1',
          name: 'Page1',
          label: '页面1',
          icon: 'setting',
          url: 'other/PageOne.vue',
        },
        {
          path: '/page2',
          name: 'Page2',
          label: '页面2',
          icon: 'setting',
          url: 'other/PageTwo.vue',
        },
      ],
    },
  ];
  const menu1 = [
    {
      path: '/home',
      name: 'Home',
      label: '首页',
      icon: 's-home',
      url: 'home/Home.vue',
    },
    {
      path: '/mall',
      name: 'Mall',
      label: '课程管理',
      icon: 'reading',
      url: 'mall/Mall.vue',
    },
  ];
  res.send({
    status: 0,
    // menu: JSON.stringify(menu),
    menu: menu,
  });
};

module.exports = getMenu;
