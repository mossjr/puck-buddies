<template>
  <div class="my-equipment">
    <img src="../assets/img/my-equipment.png" alt="my-equipment">
      <div class="items-container">
        
        <div  v-for="(item, index) in items" :key="index">
            <div class="inventory-card" v-if="item.inInventory">  
                <img class="proshop-img" :src="`../assets/cos-img/pro-shop-${item.sku}.png`" :alt="`pro-shop-${item.sku}`">
                <div class="item-qty">Amount in Inventory: {{item.qty}}</div>
                <div class="button-container">
                    <button @click="openSellEquipmentModal(item.tokenId, item.sku, item.type)" id="inventory-action-button">Sell Item</button>
                    <button @click="openGiftItemModal(item.tokenId, item.sku, item.type, item.qty)" id="inventory-action-button">Gift Item</button>
                </div>
                <div class="button-bar">
                  <button @click="openModal(item.tokenId, item.sku, item.type)" id="inventory-button">Apply Item to Player</button>
                </div>
                
                
                
            </div>
    </div>

</div>

  </div>

<div v-if="showPlayerPickerModal"> 
<PlayerPickerModal @closePlayerPickerModal="closeModal" :selectedItemSku="selectedItem" :selectItemType="selectType" :selectToken="selectTokenId"/>
</div>
<div v-if="showSellEquipmentModal">
  <SellMyEquipmentModal @closeSellEquipmentModal="closeSellEquipmentModal" :selectedItemSku="selectedItem" :selectItemType="selectType" :selctToken="selectTokenId"/>
</div>
<div v-if="showGiftItemModal">
  <GiftItemModal @closeGiftItemModal="closeGiftItemModal" :selectedItemSku="selectedItem" :selectItemType="selectType" :selctToken="selectTokenId" :qtyAvail="selectedQty"/>
</div>
</template>

<script>
import PlayerPickerModal from '../components/PlayerPickerModal.vue'
import SellMyEquipmentModal from '../components/SellMyEquipmentModal.vue'
import GiftItemModal from '../components/GiftMyEquipmentModal.vue'
import main from '../main.js'
import {proShopItems} from '../config.js'

export default {
    components: { PlayerPickerModal, SellMyEquipmentModal, GiftItemModal },
    data(){
        return{
            loadingItems: true,
            items: [],
            showPlayerPickerModal: false,
            showSellEquipmentModal: false,
            showGiftItemModal: false,
            selectTokenId: '',
            selectedItem: '',
            selectType: '',
            selectedQty: '',
        }
    },

methods: {
        async loadMyEquipment(){
            console.log(proShopItems)
            let _proShopItems = proShopItems.map(a => a.sku)
            console.log(_proShopItems)
            await main.loadMyEquipment(_proShopItems).then(res => {
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

        async openModal(tokenId, sku, itemType) {
        this.selectedItem = sku
        this.selectType = itemType
        this.selectTokenId = tokenId
        this.showPlayerPickerModal = !this.showPlayerPickerModal      
    },

        async closeModal() {
        this.showPlayerPickerModal = !this.showPlayerPickerModal
        this.loadMyEquipment()
    },

        async openSellEquipmentModal(tokenId, sku, itemType) {
        this.selectedItem = sku
        this.selectType = itemType
        this.selectTokenId = tokenId
        
        this.showSellEquipmentModal = !this.showSellEquipmentModal      
    },

        async closeSellEquipmentModal() {
        this.showSellEquipmentModal = !this.showSellEquipmentModal
        this.loadMyEquipment()
    },

     async openGiftItemModal(tokenId, sku, itemType, itemQty) {
        this.selectedItem = sku
        this.selectType = itemType
        this.selectTokenId = tokenId
        this.selectedQty = itemQty
        this.showGiftItemModal = !this.showGiftItemModal      
    },

        async closeGiftItemModal() {
        this.showGiftItemModal = !this.showGiftItemModal
        this.loadMyEquipment()
      }
    
},

mounted: function(){
    this.loadMyEquipment(),
    this.updateBalanceViewer(),
    this.updateXpBalanceViewer()
}

}
</script>

<style>
.items-container{
  display: flex;
  flex: 1;
  flex-direction: row;
  flex: 0 0 100%;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
}

.inventory-card {
  flex-grow: 12;
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  max-width: 300px;
  /* height: 400px; */
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

#inventory-button{
   margin: 5px 0 5px 0;
    width: 95%;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold; 
}

#inventory-button:hover{
  background: rgb(12, 185, 128);
}

#inventory-action-button:hover{
  background: rgb(12, 185, 128);
}

.button-container{
    display: flex;

}
</style>