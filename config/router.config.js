export default [
  // enterprise/user
  {
    path: '/enterprise/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/enterprise/user', redirect: '/enterprise/user/login' },
      { path: '/enterprise/user/login', component: './enterprise/User/Login' },
      { path: '/enterprise/user/register', component: './enterprise/User/Register' },
      { path: '/enterprise/user/register-result', component: './enterprise/User/RegisterResult' },
    ],
  },
  // admin/user
  {
    path: '/admin/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/admin/user', redirect: '/admin/user/login' },
      { path: '/admin/user/login', component: './admin/User/Login' },
      { path: '/admin/user/register', component: './admin/User/Register' },
      { path: '/admin/user/register-result', component: './admin/User/RegisterResult' },
    ],
  },
  // enterprise
  {
    path: '/enterprise',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user', 'enterprise', 'enterprise_root'],
    routes: [
      { path: '/enterprise', redirect: '/enterprise/product' },
      // 商品管理
      {
        path: '/enterprise/product',
        name: 'product',
        icon: 'shopping',
        component: './enterprise/Product/Product',
        authority: ['enterprise', 'enterprise_root'],
      },
      // 商品语言管理
      {
        path: '/enterprise/productLanguage',
        name: 'productLanguage',
        icon: 'shopping',
        component: './enterprise/ProductLanguage/ProductLanguage',
        authority: ['enterprise', 'enterprise_root'],
      },
      // 询问管理
      {
        path: '/enterprise/askManagement',
        name: 'askManagement',
        icon: 'question',
        component: './enterprise/AskManagement/AskManagement',
        authority: ['enterprise', 'enterprise_root'],
      },
      // 数据分析
      {
        path: '/enterprise/dataAnalysis',
        name: 'dataAnalysis',
        icon: 'dashboard',
        authority: ['enterprise', 'enterprise_root'],
        routes: [
          {
            path: '/enterprise/dataAnalysis/commodityGrowth',
            name: 'commodityGrowth',
            component: './enterprise/DataAnalysis/CommodityGrowth',
          },
          {
            path: '/enterprise/dataAnalysis/askAboutGrowth',
            name: 'askAboutGrowth',
            component: './enterprise/DataAnalysis/AskAboutGrowth',
          },
        ],
      },
      // 企业管理
      {
        path: '/enterprise/enterpriseManagement',
        name: 'enterpriseManagement',
        icon: 'home',
        component: './enterprise/EnterpriseManagement/EnterpriseManagement',
        authority: ['enterprise', 'enterprise_root'],
      },
      // 管理员设置
      {
        path: '/enterprise/administratorSettings',
        name: 'administratorSettings',
        icon: 'user',
        component: './enterprise/AdministratorSettings/AdministratorSettings',
        authority: ['enterprise_root'],
      },
      {
        component: '404',
      },
    ],
  },
  // admin
  {
    path: '/admin',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user', 'admin', 'admin_root'],
    routes: [
      { path: '/admin', redirect: '/admin/enterpriseManagement' },
      // 企业管理
      {
        path: '/admin/enterpriseManagement',
        name: 'enterpriseManagement',
        icon: 'home',
        component: './admin/EnterpriseManagement/EnterpriseManagement',
        authority: ['admin', 'admin_root'],
      },
      // 企业语言管理
      {
        path: '/admin/enterpriseLanguageManagement',
        name: 'enterpriseLanguageManagement',
        icon: 'home',
        component: './admin/enterpriseLanguageManagement/enterpriseLanguageManagement',
        authority: ['admin', 'admin_root'],
      },
      // 商品管理
      {
        path: '/admin/product',
        name: 'product',
        icon: 'shopping',
        component: './admin/Product/Product',
        authority: ['admin', 'admin_root'],
      },
      // 商品语言管理
      {
        path: '/admin/productLanguage',
        name: 'productLanguage',
        icon: 'shopping',
        component: './admin/ProductLanguage/ProductLanguage',
        authority: ['admin', 'admin_root'],
      },
      // 分类管理
      {
        path: '/admin/categoryManagement',
        name: 'categoryManagement',
        icon: 'folder',
        component: './admin/CategoryManagement/CategoryManagement',
        authority: ['admin', 'admin_root'],
      },
      // 分类语言管理
      {
        path: '/admin/categoryLanguageManagement',
        name: 'categoryLanguageManagement',
        icon: 'folder',
        component: './admin/CategoryLanguageManagement/CategoryLanguageManagement',
        authority: ['admin', 'admin_root'],
      },
      // 邮件管理
      {
        path: '/admin/email',
        name: 'email',
        icon: 'mail',
        component: './admin/Email/Email',
        authority: ['admin', 'admin_root'],
      },
      // 邮件模板管理
      {
        path: '/admin/emailTemplate',
        name: 'emailTemplate',
        icon: 'mail',
        component: './admin/EmailTemplate/EmailTemplate',
        authority: ['admin', 'admin_root'],
      },
      // 询问管理
      {
        path: '/admin/askManagement',
        name: 'askManagement',
        icon: 'question',
        component: './admin/AskManagement/AskManagement',
        authority: ['admin', 'admin_root'],
      },
      // 数据分析
      {
        path: '/admin/dataAnalysis',
        name: 'dataAnalysis',
        icon: 'dashboard',
        authority: ['admin', 'admin_root'],
        routes: [
          {
            path: '/admin/dataAnalysis/commodityGrowth',
            name: 'commodityGrowth',
            component: './admin/DataAnalysis/CommodityGrowth',
          },
          {
            path: '/admin/dataAnalysis/askAboutGrowth',
            name: 'askAboutGrowth',
            component: './admin/DataAnalysis/AskAboutGrowth',
          },
          {
            path: '/admin/dataAnalysis/userGrowth',
            name: 'userGrowth',
            component: './admin/DataAnalysis/UserGrowth',
          },
        ],
      },
      // 管理员设置
      {
        path: '/admin/administratorSettings',
        name: 'administratorSettings',
        icon: 'user',
        component: './admin/AdministratorSettings/AdministratorSettings',
        authority: ['admin_root'],
      },
      {
        component: '404',
      },
    ],
  },
];
