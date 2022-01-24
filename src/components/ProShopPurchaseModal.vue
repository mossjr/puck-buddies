<template>
<div class="backdrop" @click.self="closeModal">
    <div class="pro-shop-purchase-modal">
      <img class="proshop-purchase-img" :src="`../assets/cos-img/pro-shop-${selectedSku}.png`" :alt="`pro-shop-${selectedSku}`">
      <div class="item-qty">Quantity Availble: <br>{{qtyAvail}}</div>
     
      <div><span @click="decreasQty()" class="input-number-decrement">–</span><input class="input-number" v-model="qtyToBuy" type="number" min="1" :max="`${qtyAvail}`"><span @click="increasQty()" class="input-number-increment">+</span></div>
      <div><button class="green-button" @click="purchaseFromStore('PB-BRB', valueTotal,selectedTokenId,qtyToBuy)">Purchase {{qtyToBuy}} for {{valueTotal}} BUDS</button></div>



        
      
        


        <button class="green-button-close" @click="closeModal">Close</button>
    </div>
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
            qtyToBuy:1,
            splashImage: '',
            screenLocked: false
        }
    },
    props:  ['selectedTokenId',
             'selectedSku',
             'skuPrice',
             'qtyAvail'
            ],
    methods: {

        async purchaseFromStore(_splashImage, value, tokenId, qty) {
            this.splashImage = _splashImage
            this.screenLocked = true
            await main.purchaseFromStore(value.toString(), tokenId, qty).then(res => {
                this.screenLocked = false
                //console.log(res)
                this.closeModal()
            }).catch(err =>{
              console.log(err)
              this.screenLocked = false
            })
        },

        increasQty(){
          if(this.qtyToBuy < this.qtyAvail){
            this.qtyToBuy++
          }
        },
        
        decreasQty(){
          if(this.qtyToBuy > 1){
            this.qtyToBuy--
          }
        },

        closeModal() {
            this.$emit('closePurchaseModal')
        },

        


    },
    computed: {
      valueTotal: function() {
        let digits = 3
        let mod = (10 ** digits)
        let a = (this.qtyToBuy * this.skuPrice)*mod
        let c = Math.ceil(a)/mod
        return c
      }
    },

    mounted: function(){
        
    }
}

</script>


<style scoped>
.pro-shop-purchase-modal{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width:500px;
    max-width: 90%;
    padding: 20px;
    color: black;
    background: #fff;
    border-radius: 10px;
    box-shadow: 20px 20px 20px 0 rgba(0, 0, 0, 0.5);

}
.backdrop {
    backdrop-filter: blur(5px);
    top:0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
}

.player-container{
  flex: 0 0 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
}

.green-button{
   margin: 15px;
font-size: 23px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.green-button-sm{
   margin: 5px;
font-size: 16px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 5px;
border-radius: 5px;
border: none;
transition: 0.3s ease; 
}
.green-button:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button-sm:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button:focus{
    outline: none;
 border: none;
  background: rgb(12, 185, 128);
}

.green-button-close{
width: 50%;
margin: 15px;
font-size: 40px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.green-button-close:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button-close:focus{
    outline: none;
 border: none;
  background: rgb(78, 87, 84);
}

.player-canvas{
    
  width:100%;
  border: solid 5px black;
  border-radius: 10px;
}



.proshop-purchase-img{
    width: 100%;
    max-width: 400px;
    margin-bottom: 10px;
    border-radius: 15px;

}

.input-number{
  width: 80px;
  padding: 0 12px;
  vertical-align: top;
  text-align: center;
  outline: none;
}

.input-number,
.input-number-decrement,
.input-number-increment{
  border: 1px solid #ccc;
  height: 40px;
  user-select: none;
}

.input-number-decrement,
.input-number-increment{
  display: inline-block;
  width: 30px;
  line-height: 38px;
  background: #f1f1f1;
  color: #444;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}


    

.input-number-decrement{
  border-right: none;
  border-radius: 4px 0 0 4px; 
}
  

.input-number-increment{
  border-left: none;
  border-radius: 0 4px 4px 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
 


</style>