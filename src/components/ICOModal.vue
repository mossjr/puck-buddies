<template>
<div class="backdrop" @click.self="closeModal">
    <div class="ico-modal">
       <img src="../assets/img/ico-live-now-sm.png" alt="">
    <div>
        <div class="coin-container">
                <div class="coinbalancecard">

                    <div class="buds-coin"><img @click="addBuddiesToMetaMask()"  src="../assets/img/buddies-coin-icon.png" style="width:50px;height:50px" alt="buddies-coin"></div><div id="coin-balance"></div>
                     <p>(click to add BUDS to MetaMask)</p>
                     <!-- <h3>{{totalBudsSold}} of {{totalBuds}} <b>BUDS</b> sold</h3> -->
                </div>
                
            </div>
            <!-- <div>
                  <h3>ICO STAGE 1 - {{percentFixed}}% COMPLETE</h3>
                </div> -->
       <!-- <div class="ico-progress-bar-container">
              <div class="ico-progress" id="ico-play-animation" :style="{width: progressPercent + '%', 'background-color': '#'+ progressColor}"></div>
      </div> -->
      
    </div>

       <div>
         <input class="ico-input" v-model="budsToPurchase" type="number" min="1" :max="`${budsRemaining}`">
       </div>
       <div>
         <div class="sm-warn">(Will round to nearest whole BUD)</div>
       </div>
       <div class="loading-icon-container" v-if="!priceLoaded">
            <img class="loadingicon" src="../assets/img/loading.gif" alt="loading">
        </div>
       <div v-if="priceLoaded">
         <button class="green-button" @click="buyBuddies('PB-BRB',bnbCost)">Buy {{fixedbudsToPurchase}} <b>BUDS</b> for {{bnbCost}} <b>BNB</b></button>
       </div>
        
<button class="green-button-close" @click="closeModal">Close</button>
    </div>
</div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div>   
</template>

<script>
import main from '../main.js'
import LockModal from './LockModal.vue'

export default {
    components: {LockModal},
    data(){
        return{
            budsPerBNB:'',
            totalBuds:'',
            totalBudsSold:'',
            budsToPurchase:35,
            progressColor:'',
            progressPercent:'',
            splashImage: '',
            screenLocked: false,
            priceLoaded: false,
        }
    },

    methods: {

  
    async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
          if(res > this.costToDraft){
            this.noFunds = false;
          }else if(this.costToDraft){
            this.noFunds = true;
          }
        })
    },

    async getBudsICOInfo(){
      await main.getBudsICOInfo().then(res => {
        this.budsPerBNB = res.budsPerBNB
        this.totalBuds = Math.floor(res.budsBalance)
        this.totalBudsSold = Math.floor(res.budsSold)
        this.updateProgressBars()
        this.priceLoaded = true
      }).catch(err => {
        //console.log(err)
        this.updateProgressBars()
      })
    },

    async updateProgressBars(){
      const progressPer = (this.totalBudsSold/this.totalBuds)
      this.progressPercent = progressPer *100
      let color = await this.calculateProgressColor(progressPer)
       this.progressColor = color
    },

    
    async calculateProgressColor(progressPercentage){
      let color2 = 'd929fb'
      let color1 = '16d2e0'
      let hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
      };

      let r = Math.ceil(parseInt(color1.substring(0,2), 16) * progressPercentage + parseInt(color2.substring(0,2), 16) * (1-progressPercentage));
      let g = Math.ceil(parseInt(color1.substring(2,4), 16) * progressPercentage + parseInt(color2.substring(2,4), 16) * (1-progressPercentage));
      let b = Math.ceil(parseInt(color1.substring(4,6), 16) * progressPercentage + parseInt(color2.substring(4,6), 16) * (1-progressPercentage));

      let middle = hex(r) + hex(g) + hex(b);
      return middle
    },

    async addBuddiesToMetaMask(){
      await main.addBuddiesToMetaMask()
     },

     async buyBuddies(_splashImage, _value){
       if(_value <= 0){
         alert("Value must be greater than 0")
         return
       }else{
         this.splashImage = _splashImage
        this.screenLocked = true
        await main.buyBuddies(_value).then(res => {
         this.screenLocked = false
         this.closeModal()
       }).catch(err => {
         console.log("Error buying BUDS")
         console.log(err)
         this.screenLocked = false
       })
        }
       }
       ,


        closeModal() {
            this.$emit('closeIcoModal')
        },


    },
    computed: {
      fixedbudsToPurchase: function() {
        let n = this.budsToPurchase.toFixed(0)
        return n
      },

      bnbCost: function() {
        let n = this.fixedbudsToPurchase/this.budsPerBNB
        return n
      },

      budsRemaining: function() {
        let n = this.totalBuds - this.totalBudsSold
        return n
      },

      percentFixed: function() {
        let n = this.progressPercent * 1
        n = n.toFixed(2)
        return n
      }
    },

    mounted: function(){
       this.getBudsICOInfo()
       
    }
}

</script>


<style scoped>
.ico-modal{
  caret-color: rgba(0,0,0,0);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width:800px;
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
  z-index: 9999999;

}

.ico-input{
	position:relative;
  font-size: 2em;
  width: 200px;
  background: lightgoldenrodyellow;
  padding: 3px;
  display: inline-block;
  border: none;
  margin: 60px 0 0 0 ;
  text-align: center; 
}

input:focus, textarea:focus, select:focus{
        outline: none;
        caret-color: black;
    }

.green-button{
   margin: 15px;
font-size: 3em;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px 30px 10px 30px;
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
width: 20%;
margin: 15px;
font-size: 2em;
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

.sm-warn{
  font-size:0.8em;
  margin: 10px;
}

.ico-progress-bar-container{
height: 40px;
  width: 550px;
  background-color: rgb(214, 214, 214);
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  border-radius: 20px;
}

.ico-progress-bar-container .ico-progress{
  position: absolute;
  height: 100%;
  border-radius: 20px;
  transition: 3.6s;
}

#ico-play-animation{
  animation: ico-progress-animation 1s forwards;
}

.buds-coin{
    cursor: pointer;
}

@keyframes ico-progress-animation {
  0% {width: 0%; background-color:indigo;}
  100% {}
}

</style>