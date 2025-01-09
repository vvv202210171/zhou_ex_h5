export default [
  {
    path: "/coinRecharge",
    name: "coinRecharge",
    component: () => import("@/views/wallet/coinRecharge"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/coinRechargeUdun",
    name: "coinRechargeUdun",
    component: () => import("@/views/wallet/coinRechargeUdun"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/coinWithdraw",
    name: "coinWithdraw",
    component: () => import("@/views/wallet/coinWithdraw"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/coinTransfer",
    name: "coinTransfer",
    component: () => import("@/views/wallet/coinTransfer"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/trans",
    name: "trans",
    component: () => import("@/views/wallet/trans"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/transRecord",
    name: "transRecord",
    component: () => import("@/views/wallet/transRecord"),
    meta: { level: 3, requiresAuth: true },
  },
  {
    path: "/coinConvert",
    name: "coinConvert",
    component: () => import("@/views/wallet/coinConvert"),
    meta: { level: 3, requiresAuth: true },
  },

  {
    path: "/balanceRecord",
    name: "balanceRecord",
    component: () => import("@/views/wallet/balanceRecord"),
    meta: { level: 3, requiresAuth: true },
  },

  {
    path: "/coinAddress",
    name: "coinAddress",
    component: () => import("@/views/wallet/coinAddress"),
    meta: { level: 4, requiresAuth: true },
  },

  {
    path: "/coninBankCard",
    name: "coninBankCard",
    component: () => import("@/views/wallet/coninBankCard"),
    meta: { level: 5, requiresAuth: true },
  },

  {
    path: "/bindBankCard",
    name: "bindBankCard",
    component: () => import("@/views/wallet/bindBankCard"),
    meta: { level: 6, requiresAuth: true },
  },
];
