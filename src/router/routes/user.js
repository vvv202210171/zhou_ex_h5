export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/user/login"),
    meta: { level: 10 },
  },
  {
    path: "/register/:code",
    name: "register",
    component: () => import("@/views/user/register"),
    meta: { level: 11 },
  },
  {
    path: "/resetPass",
    name: "resetPass",
    component: () => import("@/views/user/resetPass"),
    meta: { level: 11 },
  },
  {
    path: "/downloadApp",
    name: "downloadApp",
    component: () => import("@/views/user/downloadApp"),
    meta: { level: 12 },
  },

  // {
  //   path: '/personal',
  //   name: 'personal',
  //   component: () =>
  //     import ('@/views/my/personal'),
  //   meta: { level: 2 ,requiresAuth: true}
  // },
  {
    path: "/my",
    name: "my",
    component: () => import("@/views/my/mainIndex"),
    meta: { level: 2 },
  },
  {
    path: "/inviteFriends",
    name: "inviteFriends",
    component: () => import("@/views/my/inviteFriends"),
    meta: { level: 3, requiresAuth: true },
  },

  {
    path: "/myTeam",
    name: "myTeam",
    component: () => import("@/views/my/myTeam"),
    meta: { level: 3, requiresAuth: true },
  },

  {
    path: "/securityCenter",
    name: "securityCenter",
    component: () => import("@/views/my/securityCenter"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/idAuth",
    name: "idAuth",
    component: () => import("@/views/my/idAuth"),
    meta: { level: 4, requiresAuth: true },
  },
  {
    path: "/modifyLoginPass",
    name: "modifyLoginPass",
    component: () => import("@/views/my/modifyLoginPass"),
    meta: { level: 4, requiresAuth: true },
  },
  {
    path: "/modifyPayPass",
    name: "modifyPayPass",
    component: () => import("@/views/my/modifyPayPass"),
    meta: { level: 4, requiresAuth: true },
  },
  {
    path: "/bindPhone",
    name: "bindPhone",
    component: () => import("@/views/my/bindPhone"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/bindEmail",
    name: "bindEmail",
    component: () => import("@/views/my/bindEmail"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/helpCenter",
    name: "helpCenter",
    component: () => import("@/views/my/helpCenter"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/aboutUs",
    name: "aboutUs",
    component: () => import("@/views/my/aboutUs"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/apiKey",
    name: "apiKey",
    component: () => import("@/views/my/apiKey"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/certificate",
    name: "certificate",
    component: () => import("@/views/my/certificate"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/setting",
    name: "setting",
    component: () => import("@/views/my/setting"),
    meta: { level: 3 },
  },
];
