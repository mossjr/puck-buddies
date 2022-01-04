<template>
<div class="backdrop" @click.self="closeModal">
    <div class="player-modal">
        <div class="flip-card">
            <div class="flip-card-inner">
            <div class="flip-card-front">
                <canvas class="player-canvas" :id="`canvas-modal-no-${selectedId}`"></canvas>
            </div>
            <div class="flip-card-back">
                <div class="name-block">{{playerName}}</div>
                <div class="stats-block">
                    <div class="content-block"><b>Country:</b> {{playerData.playercountry}}</div>
                    <div class="content-block"><b>Age:</b> {{playerData.playerAge}}</div>
                    <div v-if="playerData.playertype != 3" class="content-block"><b>Offensive Power:</b> {{playerData.offence}}</div>
                    <div class="content-block"><b>Defensive Power: </b>{{playerData.defence}}</div>
                </div>
                <!-- <div>Each Stat Point costs {{upgradeCost}} PBXP</div>
                <div>{{myXp}} PBXP</div>
                <div>{{myXPplus}}</div> -->
                
                    <div v-if="myXp >= upgradeCost" class="xp-buttons-container">  
                        <div>
                            <button class="power-select-button" v-if="playerData.playertype != 3" @click="selectPower(1)" :class="{powerselected: opPowerSelected}">OP</button>
                            <button class="power-select-button" @click="selectPower(2)" :class="{powerselected: dpPowerSelected}">DP</button>
                        </div>
                        <button class="xp-to-send-button" @click="increaseStats('PB-BRB', selectedId, selectPowerNumber, opToIncrease, totalXpOp)">Increase <b>{{selectedPower}}</b> <br>by <b>{{opToIncrease}} point</b><span v-if="opToIncrease > 1">s</span> <br> <b>{{totalXpOp}}</b> PBXP</button>
                        <div>
                            <button class="decrease-button"  v-if="totalXpOp != upgradeCost" @click="decreaseOpToSend()">&#8592;</button>
                            <button class="decrease-grey-button" v-if="totalXpOp == upgradeCost" @click="decreaseOpToSend()">&#8592;</button>
                            <button class="increase-button" @click="increaseOpToSend(playerData.offence)" v-if="myXp >= (myXPplus)">&#8594; {{myXPplus}}</button>
                            <button class="increase-grey-button" v-if="myXp < (myXPplus) ">&#8594;</button>
                        </div>
                    </div>

                    <div class="no-xp-warn" v-if="myXp < upgradeCost" >Play more matches to earn PBXP to upgrade stats</div>

            </div>
        </div>
        </div>

        <div v-if="playerData.isOnTeam == false" class="button-bar">
            <form @submit.prevent="sendPlayerToMarket('PB-BRB')">
            <label>Listing Amount</label>
            <input type="text" required v-model="sellingValue">
            <button class="send-to-market-button" v-if="playerData.isOnTeam == false">Send To Player Market for <b>{{ sellingValue }} BUDS</b> <br> + {{sellingFeePercent}}% ({{sellingFee}}) market fee</button>
            <button class="grey-button" v-if="playerData.isOnTeam == true">Send to Player Market</button>
            </form>
            
        </div>
            
        
        <div v-if="playerData.isOnTeam == false" class="button-bar">
             <input v-model="receipientAddress" class="small-warning" type="text" placeholder="Receipient Address Here">
             <div class="small-warning">Enter address carefully, this transaction <b>cannot be reversed.</b></div>
            <button @click="giftPlayer('PB-BRB', playerData.id, receipientAddress)" class="green-button">Gift Player</button>
        </div>
        
<!-- <div class="button-bar">
    <button class="green-button" v-if="playerData.teamId == 0" @click="gotoFreeAgency">Send to Player Market</button>
    <button class="grey-button" v-if="playerData.teamId != 0">Send to Player Market</button>
</div>
<div class="send-to-market" :class="{freeagencyactive: freeAgencyButton}">
    <form @submit.prevent="sendPlayerToMarket('PB-BRB')">
    <label>Listing Amount</label>
    <input type="text" required v-model="sellingValue">
    <button class="send-to-market-button">Send To Player Market for <b>{{ sellingValue }} BUDS</b> <br> + {{sellingFeePercent}}% ({{sellingFee}}) market fee</button>
    </form>

</div> -->

<div class="button-bar">
    <button class="green-button" v-if="playerData.equippedToken != 0" @click="removeProShopEquipment('PB-BRB')">Remove Pro Shop Equipment</button>
</div>

        <button class="green-button-close" @click="closeModal">Close</button>
    </div>
</div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div> 
</template>

<script>
import playerCanvasBuild from '../scripts/buildPlayer.js'
import main from '../main.js'
import LockModal from '../components/LockModal.vue'
import {proShopItems} from '../config.js'
export default {
    components: {LockModal},
    data(){
        return{
            freeAgencyButton: false,
            assignToTeamButton: false,
            sellingValue: 2,
            sellingFeePercent: 4,
            sellingFee: '',
            opToIncrease:1,
            dpToIncrease:1,
            upgradeCost:0,
            myXp:0,
            opPowerSelected:false,
            dpPowerSelected:true,
            selectedPower:"Defensive Power",
            selectPowerNumber:2,
            splashImage: '',
            screenLocked: false,
            receipientAddress: '',
            playerName:'',
        }
    },
    props:  ['selectedId', 
            'playerData',
            'defaultDraft'
            ],
    methods: {
        async sendPlayerToMarket(_splashImage) {
            this.splashImage = _splashImage
            this.screenLocked = true
            let id = this.playerData.id
            let sellerPrice = this.sellingValue
            let f = this.sellingFeePercent
            let a = sellerPrice * (100 + f) / 100
            let b = a - sellerPrice
            let fee = b.toFixed(4)
           console.log(id + " SV: " + sellerPrice + " SF: " + fee)
           await main.sendPlayerToMarket(id, sellerPrice, fee).then(res => {
              this.screenLocked = false
           }).catch(err => {
               this.screenLocked = false
           })
           this.closeModal()
        },

        closeModal() {
            this.$emit('closePlayerModal')
        },

        loadPlayer() {
            console.log(this.playerData)
            let firstName = ""
            let lastName = ""
            let firstNameDna = ("" + Math.floor((this.playerData.dna.slice(0,1)/2)) + this.playerData.dna.slice(1,4))
            let lastNameDna = ("" + Math.floor((this.playerData.dna.slice(4,5)/2)) + this.playerData.dna.slice(5,8))
            firstNameDna = firstNameDna - 0
            lastNameDna = lastNameDna - 0
            const playerNames = async () => {
                const response = await fetch('/assets/data/names.json')
                const json  = await response.json();
                return json
                }
            playerNames().then(namedata => {
                firstName = namedata[firstNameDna].first_name
                lastName = namedata[lastNameDna].last_name
                this.playerName = firstName + " " + lastName
            })
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
            console.log(parseInt(res))
            this.myXp = parseInt(res)
          })
      },

        async getUpgradeCost(){
            await main.getUpgradeCost().then(res => {
                console.log(parseInt(res))
                this.upgradeCost = parseInt(res)
            })
        },

        async increaseStats(_splashImage, tokenId, statType, qty, xp){
            console.log("Token Id: " + tokenId + " statType: " +  statType + " qty: " + qty + " xp: " + xp)
            this.splashImage = _splashImage
            this.screenLocked = true
            await main.increaseStats(tokenId, statType, qty, xp).then(res=> {
                this.screenLocked = false
                this.loadPlayer()
                this.closeModal()
            }).catch(err => {
               this.screenLocked = false
           })
        },

        async giftPlayer(_splashImage, _tokenId, _newOwner) {
            this.splashImage = _splashImage
            this.screenLocked = true
            await main.giftPlayer(_tokenId, _newOwner).then(res => {
                this.screenLocked = false
                this.loadPlayer()
                this.closeModal()
             }).catch(err => {
                this.screenLocked = false
            })
        },

        async removeProShopEquipment(_splashImage) {
            this.splashImage = _splashImage
            this.screenLocked = true
            await main.removeProShopEquipment(this.playerData.equippedToken, this.playerData.id).then(res => {
                this.screenLocked = false
                this.loadPlayer()
                 this.closeModal()
            })
            .catch(err => {
                this.screenLocked = false
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
            let total =  parseInt(this.opToIncrease) *  parseInt(this.upgradeCost)
            return total
        },

        totalXpDp: function () {
            let total =  parseInt(this.dpToIncrease) *  parseInt(this.upgradeCost)
            return total
        },

        myXPplus: function () {
            let total = parseInt(this.totalXpOp) + parseInt(this.upgradeCost)
            return total
        }


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
.player-modal{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width:80%;
    max-width: 600px;
    padding: 20px;
    color: black;
    background: #fff;
    border-radius: 40px;
    box-shadow: 20px 20px 20px 0 rgba(0, 0, 0, 0.5);
    border-style: solid;
    border-width: thick;
    border-color: rgb(8, 102, 0);
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

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
  border-radius: 10px;
}

/* Style the back side */
.flip-card-back {
  border: solid 5px black;
  border-radius: 10px;
  background-color: rgb(105, 105, 105);
  color: white;
  transform: rotateY(180deg);
}

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
    font-size: 12px;
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
    cursor:not-allowed;
    color: rgb(85, 85, 85);
    background: rgb(85, 85, 85);
    text-decoration: none;
    padding: 10px;
    border-radius: 10px;
    border: none;
    transition: 0.3s ease; 
    width: 45%;
    height: 50px;
}

.decrease-grey-button{
     
   margin: 0 2.5% 0 0;
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
    font-size: 12px;
    color:white;
    font-weight: bold;
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
    font-size: 12px;
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

.small-warning{
    font-size: 0.85em;
}

.name-block{
    background: wheat;
    color:black;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 2em;
}

.stats-block{
    background-color:brown;
    padding-left: 20%;
    padding-top:10px;
    padding-bottom:10px;
    text-align: start;
}

.content-block{
    margin:0px 20px 5px 20px;
}

.no-xp-warn{
    margin-top: 20px;
    padding:20px 0 20px 0;
    color:brown;
    background-color: wheat;
}

</style>