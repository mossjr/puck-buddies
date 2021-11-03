import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyPlayers from '../views/MyPlayers.vue'
import MyTeams from '../views/MyTeams.vue'
import Matchups from '../views/MatchUps.vue'
import PlayerMarket from '../views/FreeAgencyMarket.vue'
import ProShop from '../views/ProShop.vue'
import ProShopMarketplace from '../views/ProShopMarketplace.vue'
import MyEquipment from '../views/MyEquipment.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/my-players',
    name: 'My Players',
    component: MyPlayers
  },
  {
    path: '/pro-shop',
    name: 'Pro Shop',
    component: ProShop
  },
  {
    path: '/pro-shop-marketplace',
    name: 'Pro Shop Marketplace',
    component: ProShopMarketplace
  },
  {
    path: '/my-teams',
    name: 'My Teams',
    component: MyTeams
  },
  {
    path: '/matchups',
    name: 'Matchups',
    component: Matchups
  },
  {
    path: '/player-market',
    name: 'Player Market',
    component: PlayerMarket
  },
  {
    path: '/my-equipment',
    name: 'My Equipment',
    component: MyEquipment
  }]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
