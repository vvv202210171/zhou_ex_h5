export default [

  {
    path: '/coinRecord/:data',
    name: 'coinRecord',
    component: () =>
      import ('@/views/coinExchange/coinRecord'),
    meta: { level: 3, requiresAuth: true }
  },
  {
    path: '/allRecord',
    name: 'allRecord',
    component: () =>
      import ('@/views/coinExchange/allRecord'),
    meta: { level: 3, requiresAuth: true }
  },

  {
    path: '/futuresRecord',
    name: 'futuresRecord',
    component: () =>
      import ('@/views/futures/futuresRecord'),
    meta: { level: 2, requiresAuth: true }
  },

  {
    path: '/stopPl',
    name: 'stopPl',
    component: () =>
      import ('@/views/futures/stopPl'),
    meta: { level: 3, requiresAuth: true }
  },

  {
    path: '/cycleHistory',
    name: 'cycleHistory',
    component: () =>
      import ('@/views/futures/cycleHistory'),
    meta: { level: 3, requiresAuth: true }
  }
]
