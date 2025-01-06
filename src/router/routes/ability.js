export default [
    {
      path: "/ability",
      name: "ability",
      component: () => import("@/views/ability/ability"),
      meta: { level: 2, requiresAuth: true },
    },
    {
      path: "/comfirmNode",
      name: "comfirmNode",
      component: () => import("@/views/ability/comfirmNode"),
      meta: { level: 3, requiresAuth: true },
    },
    {
      path: "/nodeRecord",
      name: "nodeRecord",
      component: () => import("@/views/ability/nodeRecord"),
      meta: { level: 4, requiresAuth: true },
    },
    {
      path: "/withdrawAbility",
      name: "withdrawAbility",
      component: () => import("@/views/ability/withdrawAbility"),
      meta: { level: 4, requiresAuth: true },
    },
    {
      path: "/withdrawRecord",
      name: "withdrawRecord",
      component: () => import("@/views/ability/withdrawRecord"),
      meta: { level: 4, requiresAuth: true },
    },
    {
      path: "/abilityRecord",
      name: "abilityRecord",
      component: () => import("@/views/ability/abilityRecord"),
      meta: { level: 4, requiresAuth: true },
    },
   
  ];
  