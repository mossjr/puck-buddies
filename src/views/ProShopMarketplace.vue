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
                    <button @click="createProShopMarketplaceSale(item.marketListingId, item.sellingPrice)" id="inventory-action-button">{{item.marketListingId}}: Purchase for <br>{{item.sellingPriceDisplay}} BUDS</button>
                    </div>
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
</template>

<script>
import main from '../main.js'

export default {
    components: {},
    data(){
        return{
            loadingItems: true,
            items: [],
            itemsToShow: 10,
            increaseBy: 10,
            itemsFound: 0,
            showMyItems: false,
        }
    },

    methods: {
        async loadProshopMarketItems(){
            await main.loadProshopMarketItems().then(res =>{
                //console.log(res)
                this.itemsFound = res.length
                let itemsArray = []
                for (let i = 0; i < res.length; i++) {
                    if(res[i].valid == true) {
                        let sku =  res[i].tokenId.slice(0,6)
                        let sellingPriceFromWei = res[i].sellingPrice/(10 ** 18)
                        let isMine = false
                        console.log(ethereum.selectedAddress)
                        console.log(res[i].seller)
                        if(res[i].seller.toLowerCase() == ethereum.selectedAddress){
                            console.log("MINE!")
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
                console.log(itemsArray)
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

      async createProShopMarketplaceSale(_marketListingId, _price) {
          await main.createProShopMarketplaceSale(_marketListingId, _price).then(res => {
              this.loadProshopMarketItems()
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
        this.updateBalanceViewer()
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
</style>