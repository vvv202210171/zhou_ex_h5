import home from '@/views/home/mainIndex'
import market from '@/views/home/market'
import trade from '@/views/home/trade'
import balances from '@/views/wallet/mainIndex'
import cycle from '@/views/futures/cycle'
export default [
  {
    path: '/',
    name: 'home',
    component: home,
    meta: { level: 1 }
  },
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/market',
    name: 'market',
    component: market,
    meta: { level: 1.1 }
  },
  {
    path: '/trade',
    name: 'trade',
    component: trade,
    meta: { level: 1.2, requiresAuth: true }
  },
  {
    path: '/cycle',
    name: 'cycle',
    component: cycle,
    meta: { level: 1.3, requiresAuth: true }
  },
  {
    path: '/balances',
    name: 'balances',
    component: balances,
    meta: { level: 1.4, requiresAuth: true }
  }
]
