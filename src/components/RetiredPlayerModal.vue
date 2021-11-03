<template>
<div class="backdrop" @click.self="closeModal">
    <div class="retired-player-modal">
        <div class="flip-card">
            <div class="flip-card-inner">
            <div class="flip-card-front">
                <canvas class="player-canvas" :id="`canvas-modal-no-${selectedId}`"></canvas>
            </div>
            <!-- <div class="flip-card-back">
                <div>Each Stat Point costs {{upgradeCost}} PBXP</div>
                <div>{{myXp}} PBXP</div>
                
                <div class="xp-buttons-container">
                    
                    <div>
                        <button class="power-select-button" @click="selectPower(1)" :class="{powerselected: opPowerSelected}">Offensive Power</button>
                        <button class="power-select-button" @click="selectPower(2)" :class="{powerselected: dpPowerSelected}">Defensive Power</button>
                    </div>
                    <button class="xp-to-send-button" @click="increaseStats(selectedId, selectPowerNumber, opToIncrease, totalXpOp)">Increase {{selectedPower}} <br>by {{opToIncrease}} point<span v-if="opToIncrease > 1">s</span> <br> {{totalXpOp}} PBXP</button>
                    <div>
                        <button class="decrease-button" @click="decreaseOpToSend()">&#8592;</button>
                        <button class="increase-button" @click="increaseOpToSend(playerData.offence)" v-if="myXp > totalXpOp ">&#8594;</button>
                        <button class="increase-grey-button" v-if="myXp <= totalXpOp ">&#8594;</button>
                    </div>
                    
                </div>
            </div> -->
        </div>
        </div>
        
<div class="button-bar">
    <button class="green-button" v-if="playerData.teamId == 0" @click="gotoFreeAgency">Send to Player Market</button>
    <button class="grey-button" v-if="playerData.teamId != 0">Send to Player Market</button>
</div>
<div class="send-to-market" :class="{freeagencyactive: freeAgencyButton}">
    <form @submit.prevent="sendPlayerToMarket()">
    <label>Listing Amount</label>
    <input type="text" required v-model="sellingValue">
    <button class="send-to-market-button">Send To Player Market for <b>{{ sellingValue }} BUDS</b> <br> + {{sellingFeePercent}}% ({{sellingFee}}) market fee</button>
    </form>

</div>

<div class="button-bar">
    <button class="green-button" v-if="playerData.equippedToken != 0" @click="removeProShopEquipment">Remove Pro Shop Equipment</button>
</div>

        <button class="green-button-close" @click="closeModal">Close</button>
    </div>
</div> 
</template>

<script>
import playerCanvasBuild from '../scripts/buildPlayer.js'
import main from '../main.js'
import {proShopItems} from '../config.js'
export default {
    data(){
        return{
            freeAgencyButton: false,
            assignToTeamButton: false,
            sellingValue: 2,
            sellingFeePercent: 4,
            sellingFee: '',
            opToIncrease:1,
            dpToIncrease:1,
            upgradeCost:'',
            myXp:'',
            opPowerSelected:true,
            dpPowerSelected:false,
            selectedPower:"Offensive Power",
            selectPowerNumber:1
        }
    },
    props:  ['selectedId', 
            'playerData',
            'defaultDraft'
            ],
    methods: {
        async sendPlayerToMarket() {
            let id = this.playerData.id
            let sellerPrice = this.sellingValue
            let f = this.sellingFeePercent
            let a = sellerPrice * (100 + f) / 100
            let b = a - sellerPrice
            let fee = b.toFixed(4)
           console.log(id + " SV: " + sellerPrice + " SF: " + fee)
           await main.sendPlayerToMarket(id, sellerPrice, fee)
           this.closeModal()
        },

        closeModal() {
            this.$emit('closeRetiredPlayerModal')
        },
        loadPlayer() {
            playerCanvasBuild.preloadPlayerInfo(this.selectedId,this.playerData, "modal-no") 
        },
        gotoFreeAgency() {
            this.freeAgencyButton = !this.freeAgencyButton
        },

        async selectPower(type){
            if(type == 1){
                this.opPowerSelected = true
                this.dpPowerSelected = false
                this.selectedPower = "Offensive Power"
                this.selectPowerNumber = 1
            }else if(type == 2){
                this.opPowerSelected = false
                this.dpPowerSelected = true
                this.selectedPower = "Defensive Power"
                this.selectPowerNumber = 2
            }
        },

        async updateXpBalanceViewer(){
          await main.updateXPBalance().then(res => {
            document.getElementById('xp-balance').innerHTML = res
            this.myXp = res
          })
      },

        async getUpgradeCost(){
            await main.getUpgradeCost().then(res => {
                this.upgradeCost = res
            })
        },

        async increaseStats(tokenId, statType, qty, xp){
            await main.increaseStats(tokenId, statType, qty, xp).then(res=> {
                this.loadPlayer()
                this.closeModal()
            })
        },

        async removeProShopEquipment() {
            await main.removeProShopEquipment(this.playerData.equippedToken, this.playerData.id).then(res => {
                 this.closeModal()
            })
            .catch(err => {
                console.log(err)
                this.closeModal()
            })
        },

        async decreaseOpToSend(){
            if (this.opToIncrease > 1){
                this.opToIncrease = this.opToIncrease - 1
            }
        },

         async increaseOpToSend(playerOP){
            if (this.opToIncrease < (99-playerOP)){
                this.opToIncrease = this.opToIncrease + 1
            }
        },

        async decreaseDpToSend(){
            if (this.dpToIncrease > 1){
                this.dpToIncrease = this.dpToIncrease - 1
            }
        },

         async increaseDpToSend(playerOP){
            if (this.dpToIncrease < (99-playerOP)){
                this.dpToIncrease = this.dpToIncrease + 1
            }
        }

    },
    computed: {
        sellingFee: function () {
            let n = this.sellingValue
            let f = this.sellingFeePercent
            let a = n * (100 + f) / 100
            let b = a - n
            let c = b.toFixed(4)
           return c
        },

        totalXpOp: function () {
            let total = this.opToIncrease * this.upgradeCost
            return total
        },

        totalXpDp: function () {
            let total = this.dpToIncrease * this.upgradeCost
            return total
        },


    },

    mounted: function(){
    this.loadPlayer()
    this.getUpgradeCost()
    this.updateXpBalanceViewer()
    this.sellingValue = (this.defaultDraft * 110) / 100
    }
}

</script>


<style scoped>
.retired-player-modal{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width:80%;
    max-width: 600px;
    padding: 20px;
    color: black;
    background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
    border-radius:40px;
    box-shadow: 20px 20px 20px 0 rgba(0, 0, 0, 0.5);
    border-style: solid;
    border-width: thick;
    border-color: rgb(102, 0, 94);

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

.flip-card {
  display: inline-block;
  justify-items: center;
  background-color: white;
  width: 400px;
  height: 500px;
  border: none;
  border-radius: 10px;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/*  */

.send-to-market{
    margin-top: -220px;
    visibility: hidden;
    opacity: 0;
    transition: 0.3s;
}

.freeagencyactive{
    margin-top: 0px;
    opacity: 1;
    visibility: visible;
}


form{
    max-width: 420px;
    margin:  auto;
    background: transparent;
    padding: 20px;
    border-radius: 10px;
}
label{
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}
input{
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
    -webkit-appearance: none;
  margin: 0;
  -moz-appearance: textfield;
  justify-content: center;
  font-size: xx-large;
  text-align: center; 
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

.xp-buttons-container{
    margin-top: 20px;
    padding: 20px;
}

.xp-to-send-button{
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 23px;
    color: #fff;
    background: rgb(11, 145, 100);
    text-decoration: none;
    padding: 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s ease;
    width: 100%;
}

.xp-to-send-button:hover{
    background: rgb(17, 221, 153);
}

.decrease-button{
    margin: 0 2.5% 0 0;
    font-size: 23px;
    color: #fff;
    background: rgb(11, 145, 100);
    text-decoration: none;
    padding: 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s ease; 
    width: 45%;
    height: 50px;
}

.increase-button{
   
    font-size: 23px;
    color: #fff;
    background: rgb(11, 145, 100);
    text-decoration: none;
    padding: 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s ease; 
    width: 45%;
    height: 50px;
}

.increase-grey-button{
     
    font-size: 23px;
    color: rgb(0, 0, 0);
    background: rgb(209, 209, 209);
    text-decoration: none;
    padding: 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s ease; 
    width: 45%;
    height: 50px;
}

.power-select-button{
    margin: 5px; 
    font-size: 23px;
    text-decoration: none;
    padding: 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s ease; 
    width: 45%;
    height: auto;
    background: rgb(11, 145, 100);
    outline-style: none;
}

.powerselected{
    margin: 5px;  
    font-size: 23px;
    text-decoration: none;
    padding: 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s ease; 
    width: 45%;
    height: auto;
    background: rgb(17, 192, 134);
    outline-style: none;
}





</style>