<template>
    <div class="proshop-marketplace">
        <img src="../assets/img/equipment-marketplace.png" alt="equipment-marketplace">
    <div>
        <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="loadingItems">
    </div>

    <div>
        <button class="action-button" @click="showItemsSwitch()" v-if="showMyItems">Switch to Items On Sale</button>
        <button class="action-button" @click="showItemsSwitch()" v-if="!showMyItems">Switch to My Items on Sale</button>
    </div>

    <div class="items-container">
        <div  v-for="(item, index) in items" :key="index">
            <div v-if="!showMyItems"> 
                 <div class="proshop-marketplace-card" v-if="index + 1 <= itemsToShow && !item.isMine">  
                    <img class="proshop-img" :src="`../assets/cos-img/pro-shop-${item.sku}.png`" :alt="`pro-shop-${item.sku}`">
                    <div class="button-container">
                    <button @click="createProShopMarketplaceSale('PB-BRB', item.marketListingId, item.sellingPrice)" v-if="myFunds>=item.sellingPriceDisplay" id="inventory-action-button">Purchase for <br>{{item.sellingPriceDisplay}} BUDS</button>
                    <button id="nofunds-action-button" v-if="myFunds<item.sellingPriceDisplay">Purchase for <br>{{item.sellingPriceDisplay}} BUDS</button>
                    
                    </div>
                    <div class="listing-id">#{{item.marketListingId}}</div>
                </div>
            </div>

             <div v-if="showMyItems"> 
                 <div class="proshop-marketplace-card" v-if="index + 1 <= itemsToShow && item.isMine">  
                    <img class="proshop-img" :src="`../assets/cos-img/pro-shop-${item.sku}.png`" :alt="`pro-shop-${item.sku}`">
                    <div class="button-container">
                    <button @click="cancelProShopMarketplaceSale(item.marketListingId)" id="inventory-cancel-button">{{item.marketListingId}}: Cancel Sale <br>({{item.sellingPriceDisplay}} BUDS)</button>
                    </div>
                </div>
            </div>


           
        </div>
    </div>
</div>
  <div>
    <button class="load-more-button" @click="(loadItems) => { itemsToShow = itemsToShow + increaseBy, loadProshopMarketItems()}" v-if="itemsToShow < itemsFound">Load More</button>
  </div>
  <div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div> 
</template>

<script>
import main from '../main.js'
import LockModal from '../components/LockModal.vue'

export default {
    components: {LockModal},
    data(){
        return{
            loadingItems: true,
            items: [],
            itemsToShow: 10,
            increaseBy: 10,
            itemsFound: 0,
            myFunds:'',
            showMyItems: false,
            splashImage: '',
            screenLocked: false
        }
    },

    methods: {
        async loadProshopMarketItems(){
            await main.loadProshopMarketItems().then(res =>{
                this.itemsFound = res.length
                let itemsArray = []
                for (let i = 0; i < res.length; i++) {
                    if(res[i].valid == true) {
                        let tokenId = parseInt(res[i].tokenId)
                        let sku =  tokenId.toString().slice(0,6)
                        let sellingPriceFromWei = res[i].sellingPrice/(10 ** 18)
                        let isMine = false
                        if(res[i].seller.toLowerCase() == ethereum.selectedAddress){
                            isMine = true
                        }
                        itemsArray.push({
                        'marketListingId': res[i].marketListingId,
                        'seller': res[i].seller,
                        'sellingPriceDisplay': sellingPriceFromWei,
                        'sellingPrice': res[i].sellingPrice,
                        'tokenId': res[i].tokenId,
                        'sku': sku,
                        'isMine': isMine
                        })
                    }  
                }
                itemsArray.sort((a, b) => {
                    return a.sellingPrice - b.sellingPrice
                })
                this.items =  itemsArray
                this.loadingItems = false
            })
            .catch(err => {
                console.log(err)
                this.loadingItems = false
            })
        },

        async showItemsSwitch(){
           this.showMyItems = !this.showMyItems 
           this.itemsToShow = 10
        },

        async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
          this.myFunds = res
        })
      },

    async updateXpBalanceViewer(){
          await main.updateXPBalance().then(res => {
            document.getElementById('xp-balance').innerHTML = res
            this.myXp = res
          })
      },

      async createProShopMarketplaceSale(_splashImage, _marketListingId, _price) {
          this.splashImage = _splashImage
          this.screenLocked = true
          await main.createProShopMarketplaceSale(_marketListingId, _price).then(res => {
              this.loadProshopMarketItems()
              this.screenLocked = false
          }).catch(err =>{
              console.log(err)
              this.screenLocked = false
          })
      },

      async cancelProShopMarketplaceSale(_marketListingId) {
          await main.cancelProShopMarketplaceSale(_marketListingId).then(res => {
              this.loadProshopMarketItems()
          })
      }

    },

    mounted: function(){
        this.loadProshopMarketItems(),
        this.updateBalanceViewer(),
        this.updateXpBalanceViewer()
    }
}
</script>


<style>
.proshop-marketplace{
    caret-color: rgba(0,0,0,0);
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

.proshop-marketplace-card {
  flex-grow: 12;
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  max-width: 175px;
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

#inventory-action-button{
    margin: 5px;
    width: 100%;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

#nofunds-action-button{
        margin: 5px;
    width: 100%;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(165, 165, 165);
  color: rgb(216, 64, 64);
  border-radius: 10px;
  font-weight: bold;
  cursor:not-allowed;
}

#inventory-action-button:hover{

  background: rgb(12, 185, 128);

  
}

.action-button{
    caret-color: rgba(0,0,0,0);
    margin: 5px;
    width:300px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

.action-button:hover{
caret-color: rgba(0,0,0,0);
  background: rgb(12, 185, 128);

  
}

#inventory-cancel-button{
  margin: 5px;
  width: 100%;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(145, 11, 11);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
}

#inventory-cancel-button:hover{
     background: rgb(204, 17, 17);
}

.button-container{
    display: flex;

}

.load-more-button{
    caret-color: rgba(0,0,0,0);
     margin: 5px;
    width:300px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
}

.load-more-button:hover{
      background: rgb(12, 185, 128);
}

.listing-id{
    font-size: 0.5em;
    font-weight: bolder;
    text-align: start;
    margin: 0 0 0 10px;
}

.loadingicon{
    margin-bottom:10px;
}
</style>