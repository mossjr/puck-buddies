import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyPlayers from '../views/MyPlayers.vue'
import MyTeam from '../views/MyTeam.vue'
// import Matchups from '../views/MaybeDeleteMe/MatchUps.vue'
import PlayerMarketplace from '../views/FreeAgencyMarket.vue'
import ProShop from '../views/ProShop.vue'
import EquipmentMarketplace from '../views/ProShopMarketplace.vue'
import MyEquipment from '../views/MyEquipment.vue'

const routes = [
  {
    path: '/',
    redirect: '/my-players'
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
    path: '/equipment-marketplace',
    name: 'Equipment Marketplace',
    component: EquipmentMarketplace
  },
  {
    path: '/my-team',
    name: 'My Team',
    component: MyTeam
  },
  // {
  //   path: '/matchups',
  //   name: 'Matchups',
  //   component: Matchups
  // },
  {
    path: '/player-marketplace',
    name: 'Player Marketplace',
    component: PlayerMarketplace
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
