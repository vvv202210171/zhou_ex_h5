export default [
  {
    path: '/marketDetails/:type',
    name: 'marketDetails',
    component: () =>
      import ('@/views/home/marketDetails'),
    meta: { level: 10 }
  },
  {
    path: '/coinSearch',
    name: 'coinSearch',
    component: () =>
      import ('@/views/home/coinSearch'),
    meta: { level: 2 }
  },
  {
    path: '/notice',
    name: 'notice',
    component: () =>
      import ('@/views/home/notice'),
    meta: { level: 3 }
  },

  {
    path: '/lockMining',
    name: 'lockMining',
    component: () =>
      import ('@/views/home/lockMining'),
    meta: { level: 2, requiresAuth: true }
  },
  {
    path: '/comfirmLock',
    name: 'comfirmLock',
    component: () =>
      import ('@/views/home/comfirmLock'),
    meta: { level: 3, requiresAuth: true }
  },
  {
    path: '/lockRecord',
    name: 'lockRecord',
    component: () =>
      import ('@/views/home/lockRecord'),
    meta: { level: 4, requiresAuth: true }
  },
  {
    path: '/browser',
    name: 'browser',
    component: () =>
        import ('@/views/home/browser'),
        meta: { level: 0, requiresAuth: false}
  }

]
