<template>
  <div class="pro-shop">

<div>
  <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="loadingItems">
  </div>
      <button v-on:click="adminShow = !adminShow" v-if="isProShopAdmin">Admin</button>
      <button @click="getInStockData()">TEST</button>

<div class="admin-area" v-if="adminShow">
        <div class="admin-pro-buttons" v-if="isProShopAdmin">
          <form @submit.prevent="addStockToProShop()">
          <label>Item Management</label>
          <div>
              <label>SKU</label>
              <input type="text" required v-model="skutosend">
          </div>
          <div>
              <label>Quantity to Add</label>
              <input type="number" required v-model="howmanytocreate">
          </div>
          <div>
              <button>Create SKU {{ skutosend }}</button> 
          </div>
          <div>
                <p>QTY: <b>{{howmanytocreate}}</b> </p>
          </div>
        </form>
        </div>

        <div class="admin-pro-buttons" v-if="isProShopAdmin">
          <form @submit.prevent="burnStock()">
          <label>Item Management</label>
          <div>
              <label>SKU</label>
              <input type="text" required v-model="skutosend">
          </div>
          <div>
              <label>Quantity to Add</label>
              <input type="number" required v-model="howmanytoburn">
          </div>
          <div>
              <button>Burn SKU {{ skutosend }}</button> 
          </div>
          <div>
                <p>QTY: <b>{{howmanytoburn}}</b> </p>
          </div>
        </form>
        </div>

        <div class="admin-pro-buttons" v-if="isProShopAdmin">
          <button @click="sendProShopAddress()">Send Proshop Address</button> 
        </div>
</div>

<div class="items-container">
    <div  v-for="(item, index) in items" :key="index">
            <div class="proshop-card" v-if="item.active && item.type != 99">   
                <img class="proshop-img" :class="{outofstock: !item.inStock }" :src="`../assets/cos-img/pro-shop-${item.sku}.png`" :alt="`pro-shop-${item.sku}`">
                <div class="item-qty">Quantity Availble: <br>{{item.qty}}</div>
                <button v-if="item.inStock" @click="openPurchaseModal(item.tokenId, item.sku, item.price, item.qty)" id="proshop-action-button">Purchase for <br><b>{{item.price}} BUDS </b></button>
                <button v-if="!item.inStock" id="proshop-outofstock-button">OUT OF STOCK <br><b>{{item.price}} BUDS </b></button>
            </div>
    </div>

</div>

  </div>
  <div v-if="showPurchaseModal">
      <ProShopPurchaseModal @closePurchaseModal="closePurchaseModal()" :selectedSku="selectedSku" :skuPrice="skuPrice" :qtyAvail="qtyAvail" :selectedTokenId="selectedTokenId" />
  </div>
</template>

<script>
import main from '../main.js'
import {proShopItems} from '../config.js'
import ProShopPurchaseModal from '../components/ProShopPurchaseModal.vue'

export default {
    components: {ProShopPurchaseModal},
    data(){
        return{
            adminShow: false,
            loadingItems: true,
            isProShopAdmin: false,
            skutosend: 0,
            pricetosend: 0,
            howmanytocreate: 0,
            howmanytoupdate: 0,
            items:[],
            totalFoundItems:'',
            proshopaddress:'',
            howmanytoburn: '',
            selectedTokenId:'',
            selectedSku:'',
            skuPrice:'',
            qtyAvail:'',
            showPurchaseModal: false

        }
    },

    methods:{
        async getInStockData(){
            console.log(proShopItems)
            let _proShopItems = proShopItems.map(a => a.sku)
            let _proShopItemAdmin = proShopItems.map(a => a.admin)
            let _proShopActive = proShopItems.map(a => a.active)
            console.log(_proShopItems)
            console.log(_proShopItemAdmin)
            await main.loadProshopItems(_proShopItemAdmin,_proShopItems, _proShopActive).then(res => {
                console.log(res)
                this.items = res
                console.log(this.items)
            })
            .catch(err => {
                console.log(err)
                this.updateBalanceViewer()
            })
            this.loadingItems = false
            this.updateBalanceViewer()           
        },

        async sendProShopAddress() {
            await main.sendProShopAddress().then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
        },

        async checkProShopAdmin() {
            await main.checkProShopAdmin().then(res => {
                console.log("Is Pro Shop Admin: " + res)
                this.isProShopAdmin = res
            })
        },

        async addStockToProShop() {
            await main.addStockToProShop(this.skutosend, this.howmanytocreate).then(res => {
                console.log("Item(s) Added to the Pro Shop " + res)
                console.log(res)
                this.getInStockData()
            })
        },

        async burnStock() {
            await main.burnStock(this.skutosend, this.howmanytoburn).then(res => {
                console.log("Items Burned " + res )
                this.getInStockData()
            })
        },

        async openPurchaseModal( _selectedTokenId, _selectedSku, _skuPrice, _qtyAvail){
            this.selectedTokenId = _selectedTokenId
            this.selectedSku = _selectedSku
            this.skuPrice = _skuPrice
            this.qtyAvail = _qtyAvail
            this.showPurchaseModal = true
        },

        async closePurchaseModal(){
            this.showPurchaseModal = false
            this.checkProShopAdmin()
            this.getInStockData()
            this.updateBalanceViewer()
        },

        // async purchaseFromStore(value, sku) {
        //     console.log("Sending this Sku: " + sku)
        //     await main.purchaseFromStore(value, sku).then(res => {
        //         console.log(res)
        //         this.getInStockData()
        //     })
        // },

         async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
          this.myFunds = res
        })
      }, 

       async checkXPBalanceonTeamContract(){
      await main.checkXPBalanceonTeamContract().then(res => {
        console.log(res)
        this.xpBalanceOnTeamContract = res
      })
    },

    },

    mounted: function(){
        this.checkProShopAdmin(),
        this.getInStockData(),
        this.updateBalanceViewer(),
        this.checkXPBalanceonTeamContract
    }

}
</script>

<style>
.admin-area{
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  align-items: center;
  justify-content: center;  
}

.admin-pro-buttons {
  padding: 15px;
  margin: 10px;
  color: black;
  background: linear-gradient(100deg, #becec9, #6de29e);
  width: 60%;
  border-radius: 20px;
}

.items-container{
  display: flex;
  flex: 1;
  flex-direction: row;
  flex: 0 0 100%;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
}

.proshop-card {
  flex-grow: 12;
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  max-width: 200px;
  margin: 20px;
  margin-bottom: 70px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: black;
  text-align: center;
  justify-content: center;

  
}

.proshop-card:hover{
  box-shadow: 15px 15px 20px 0 rgba(0,0,0,0.5);

}

.proshop-img{
    width: 100%;
    margin-bottom: 10px;
    border-radius: 15px;

}

.outofstock{
    -webkit-filter: grayscale(85%); /* Ch 23+, Saf 6.0+, BB 10.0+ */
    filter: grayscale(85%); 
}

.item-qty{
    margin-bottom: 5px;
    font-size: large;
}

#proshop-outofstock-button{

width: 100%;
  height: 60px;
  border: none;
  background: rgb(165, 165, 165);
  color: rgb(216, 64, 64);
  border-radius: 10px;
  font-weight: bold;
  cursor:not-allowed;
  outline: none; 

}

#proshop-action-button{
    width: 100%;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

#proshop-action-button:hover{

  background: rgb(12, 185, 128);

  
}
</style>