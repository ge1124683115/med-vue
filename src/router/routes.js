export default [
  {
    name: "ProductManagement",
    path: "/productManagement",
    hidden: false,
    redirect: {
      name: "ProductManagement-Item"
    },
    component: "Layout",
    alwaysShow: true,
    meta: {
      auth:'perm-product',
      title: "品项管理",
      icon: "ProductManagement",
      noCache: false,
      link: null
    },
    children: [
      {
        name: "ProductManagement-Category",
        path: "category",
        hidden: true,
        component: "ProductManagement/category/index",
        meta: {
          title: "品项分类",
          icon: "filter",
          noCache: false,
          link: null
        }
      },
      {
        name: "ProductManagement-Item",
        path: "item",
        hidden: false,
        component: "ProductManagement/item/index",
        meta: {
          title: "品项维护",
          icon: "layers",
          noCache: false,
          link: null
        }
      },
    ]
  },
  {
    name: "ExpirationManagement",
    path: "/expirationManagement",
    hidden: true,
    redirect: {
      name: "ExpirationManagement-Setting"
    },
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "过期管理",
      icon: "ExpirationManagement",
      noCache: false,
      link: null
    },
    children: [
      {
        name: "ExpirationManagement-Setting",
        path: "setting",
        hidden: true,
        component: "ExpirationManagement/setting/index",
        meta: {
          title: "过期设置",
          icon: "ExpirationManagement-Setting",
          noCache: false,
          link: null
        }
      },
      {
        name: "ExpirationManagement-Tag",
        path: "tag",
        hidden: false,
        component: "ExpirationManagement/tag/index",
        meta: {
          title: "标签制作",
          icon: "ExpirationManagement-Tag",
          noCache: false,
          link: null
        }
      },
    ]
  },
  {
    name: "EnterpriseManagement",
    path: "/enterpriseManagement",
    hidden: false,
    redirect: {
      name: "EnterpriseManagement-Profile"
    },
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "企业管理",
      icon: "EnterpriseManager",
      noCache: false,
      link: null
    },
    children: [
      {
        name: "EnterpriseManagement-Profile",
        path: "profile",
        hidden: true,
        component: "EnterpriseManagement/profile/index",
        meta: {
          title: "企业信息",
          icon: "EnterpriseInfo",
          noCache: false,
          link: null
        }
      },
      {
        name: "EnterpriseManagement-Store",
        path: "store",
        hidden: false,
        component: "EnterpriseManagement/store/index",
        meta: {
          title: "门店管理",
          icon: "EnterpriseStore",
          noCache: false,
          link: null
        }
      },
      {
        name: "EnterpriseManagement-Dept",
        path: "dept",
        hidden: false,
        component: "EnterpriseManagement/dept/index",
        meta: {
          title: "部门管理",
          icon: "EnterpriseDept",
          noCache: false,
          link: null
        }
      },
    ]
  },
  {
    name: "UserManagement",
    path: "/userManagement",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      auth:'perm-user',
      title: "用户管理",
      icon: "UserManagement",
      noCache: false,
      link: null
    },
    children: [
      {
        name: "UserManagement-List",
        path: "list",
        hidden: false,
        component: "UserManagement/list/index",
        meta: {
          title: "用户列表",
          icon: "UserManagement-List",
          noCache: false,
          link: null
        }
      },
      {
        name: "UserManagement-Role",
        path: "role",
        hidden: true,
        component: "UserManagement/role/index",
        meta: {
          title: "角色维护",
          icon: "UserManagement-Role",
          noCache: false,
          link: null
        }
      },
    ]
  },
  {
    name: "SassManagement",
    path: "/sassManagement",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      title: "租户管理",
      icon: "SassManagement",
      noCache: false,
      link: null
    },
    children: [
      {
        name: "SassManagement-List",
        path: "list",
        hidden: false,
        component: "SassManagement/list/index",
        meta: {
          title: "租户列表",
          icon: "SassManagement-List",
          noCache: false,
          link: null
        }
      }
    ]
  },
  {
    name: "SystemManagement",
    path: "/systemManagement",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: {
      auth:'perm-system',
      title: "系统管理",
      icon: "system",
      noCache: false,
      link: null
    },
    children: [
      {
        name: "RoleManagement",
        path: "roleManagement",
        hidden: false,
        component: "SystemManagement/RoleManagement/index",
        meta: {
          title: "角色管理",
          icon: "UserManagement-Role",
          noCache: false,
          link: null
        }
      },
      {
        name: "DictionaryManagement",
        path: "dictionaryManagement",
        hidden: false,
        component: "SystemManagement/DictionaryManagement/index",
        meta: {
          title: "字典管理",
          icon: "dict",
          noCache: false,
          link: null
        }
      },
      {
        name: "PrintTemplateManagement",
        path: "printTemplateManagement",
        hidden: false,
        component: "SystemManagement/PrintTemplateManagement/index",
        meta: {
          title: "打印模板",
          icon: "PrintTemplateManagement",
          noCache: false,
          link: null
        }
      },
      {
        name: "LogManagement",
        path: "logManagement",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "日志管理",
          icon: "log",
          noCache: false,
          link: null
        },
        children: [
          {
            name: "LogManagement-Business",
            path: "businessLog",
            hidden: false,
            component: "SystemManagement/LogManagement/Business/index",
            meta: {
              title: "操作日志",
              icon: "form",
              noCache: false,
              link: null
            }
          },
          {
            name: "LogManagement-Login",
            path: "loginLog",
            hidden: false,
            component: "SystemManagement/LogManagement/Login/index",
            meta: {
              title: "登录日志",
              icon: "logininfor",
              noCache: false,
              link: null
            }
          },
        ]
      }
    ]
  },
];
