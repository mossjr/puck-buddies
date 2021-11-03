<template>
<div class="backdrop" @click.self="closeModal">
  
    <div class="giftPlayerModal">
     
        <h1>Gift Items ({{qtyAvail}} available)</h1>
         <div><span @click="decreasQty()" class="input-number-decrement">–</span><input class="input-number" v-model="qtyToSend" type="number" min="1" :max="`${qtyAvail}`"><span @click="increasQty()" class="input-number-increment">+</span></div>
        <div class="button-bar">
             <input v-model="receipientAddress" class="small-input" type="text" placeholder="Receipient Address Here">
             <div class="small-warning">Enter address carefully, this transaction <b>cannot be reversed.</b></div>
             <button v-if="receipientAddress == ''" class="grey-button">Gift Item<span v-if="qtyToSend > 1">s</span></button>
             <button v-if="receipientAddress != ''" @click="giftItem('PB-BRB', selctToken, qtyToSend, receipientAddress)" class="green-button">Gift Item<span v-if="qtyToSend > 1">s</span></button>
             <button class="green-button-close" @click="closeModal()">Cancel</button>
        </div>
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
            qtyToSend:1,
            receipientAddress:'',
            splashImage: '',
            screenLocked: false
        }
    },
    props:  ['selectedItemSku', 
            'selectItemType',
            'selctToken',
            'qtyAvail'
            ],
    methods: {

      async giftItem(_splashImage, tokenId, qty, newOwner){
        this.splashImage = _splashImage
        this.screenLocked = true
        await main.giftItem(tokenId, qty, newOwner).then(res => {
          this.screenLocked = false
          this.closeModal()
        }).catch(err => {
          console.log(err)
          this.screenLocked = false
        })
      },

      increasQty(){
          if(this.qtyToSend < this.qtyAvail){
            this.qtyToSend++
          }
        },
        
        decreasQty(){
          if(this.qtyToSend > 1){
            this.qtyToSend--
          }
        },


       
        closeModal() {
            this.$emit('closeGiftItemModal')
        }
       

    },
    computed: {
       
    },

    mounted: function(){
    
    }
}

</script>


<style scoped>
.giftPlayerModal{
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

.green-button:hover{
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
width: 80%;
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

.grey-button{
  margin: 15px;
font-size: 23px;
color: rgb(219, 174, 174);
background: rgb(110, 110, 110);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
cursor:not-allowed;
}

/* .freeAgency{

}

.free-agency-form{

}

.freeagencyformactive{

} */


input{
    margin-bottom: 10px
}

input:focus{
    border:rgb(233, 233, 233);
}

.send-to-market-button{
width: auto;
margin: 15px;
font-size: 20px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.send-to-market-button:hover {
    box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(185, 12, 41);
}

.small-input{
  width: 80%;
  padding: 0 12px;
  vertical-align: top;
  text-align: center;
  outline: none;
}


.send-to-pro-shop-market-button{
width: auto;
margin: 15px;
font-size: 20px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.send-to-pro-shop-market-button:hover {
    box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(185, 12, 41);
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