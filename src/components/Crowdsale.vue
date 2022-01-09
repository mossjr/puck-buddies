<template>
<div class="crowdsale" >
    <div class="center-crowd-sale">
        
    <h2>Welcome to the</h2>
    <h1>Puck Buddies<br>CROWD SALE!</h1>
    <div>
        <div v-if="myBuds < teamMintCost">
        <p>This is your chance to get in on the ground floor of this exciting new NFT Play-to-Earn game.</p>
        <p>Reserve your coins here and come back to claim them after the conclusion of the crowd sale:</p>
        <h2>-- put crowd sale end date here --</h2>
        <br>
        <p>Check out our White Paper HERE</p>
        <h2>Main Crowd Sale Points</h2>       
        <p>All BNB raised will be used for liquidity pool on Pancakeswap</p>
        <p>All BUDDIES coins will be available to claim 24hrs after the Crowd Sale has concluded</p>
        <p>The Puck Buddies Game will be available 24hrs after the Crowd Sale has concluded</p>
        <p>All Crowd Sale processes are hard-coded into our Crowd Sale Contract and cannot be altered by anyone (including us)</p>
        <p>See the Crowd Sale contract for yourself HERE</p>
        </div>

        <div class="coin-container">
                <div class="coinbalancecard">
                    <div class="admin"><h3>Pre-purchase BUDDIES Coins</h3></div>
                    <div>
                    <input type="text" v-model="xpr">
                    </div>
                    <button @click="updatePBXPReward()">Apply</button>
                </div>
                
            </div> 
        
    </div>
  <button v-if="myBuds >= teamMintCost" id="login_button" @click="mintNewTeam('PB-BRB')">Mint Your First Team for <br><b>{{teamMintCost}} BUDS</b></button>
  </div>
</div>

<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div>

<div v-if="icoModalVisible">
    <icomodal @closeIcoModal="closeIcoModal"  />
</div>
  
</template>

<script>
import main from '../main.js'
import icomodal from './ICOModal.vue'
import LockModal from './LockModal.vue'

export default {
    components: { LockModal, icomodal },
    data() {
    return{
        loadingData: true,
        teamMintCost:0,
        myBuds:0,
        splashImage:'',
        screenLocked: false,
        icoModalVisible: false,
        }
    },
    
    methods:{

            async mintNewTeam(_splashImage){
                let teamFound
                await main.getTeamFromMoralis().then(res =>{
                    teamFound = res
                    //console.log(res)
                })
                if(teamFound == false){
                    this.splashImage = _splashImage
                    this.screenLocked=true
                    await main.mintNewTeamMoralis(this.teamMintCost).then(res => {
                        this.screenLocked=false
                        //console.log(res)
                        this.$emit('teamFound')
                    }).catch(err => {
                        this.screenLocked=false
                        //console.log(err)
                        this.$emit('teamFound')
                    })
                }else if(teamFound == true){
                    alert("Team detected on this profile. Please refresh your window.")
                }
            },

            async getTeamMintCost(){
                await main.getTeamMintCost().then(res =>{
                    this.teamMintCost = res
                }).catch(err =>{
                    //console.log(err)
                })
            },

            async closeIcoModal(){
                this.icoModalVisible = false;
                this.updateBalanceViewer()
                this.getTeamMintCost()

            },

            async showIcoModal(){
                this.icoModalVisible=true;
            },

            async updateBalanceViewer(){
                await main.updateCoinBalance().then(res => {
                let resBalance = "My BUDDIES coins: " + res
                document.getElementById('coin-balance').innerHTML = resBalance
                this.myBuds = res
                })
            },

            async addBuddiesToMetaMask(){
            await main.addBuddiesToMetaMask()
            }
    },
    
  mounted: function(){
    this.$nextTick(function(){
        this.loadingData = true
        this.updateBalanceViewer()
        this.getTeamMintCost()
        
    })

  }

}

// this.updateBalanceViewer()
//         this.getTeamMintCost()


</script>

<style scoped>

h2{
    color:black;
}

h1{
    color:black;
}

p{
    color:black;
}

.center-crowd-sale{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    background: white;
    border-radius: 10px;
    padding:100px;
}

.banner{
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    transition: 0.3s;
   
}

.banner:hover{
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
   
}

.center-crowd-sale h1 {
   text-align: center;
    padding: 0 10px 0 10px;
}
.center-crowd-sale h2 {
   text-align: center;
    padding: 0 10px 0 10px;
}

.center-crowd-sale button{
    width: 80%;
    height: 50px;
    font-family: montserrat;
    cursor: pointer;
    color: white;
    border: none;
    background: #2691d9;
    margin: 0 10% 20px 10%;
    border-radius: 10px;
    transition: 0.3s;

}

.center-crowd-sale button:hover{
    color: white;
    background: rgb(12, 185, 128);
}

.coin-container{
    margin: 20px;
    display: flex;
    justify-content: center;

}
.coinbalancecard{
  margin: 10px;
  padding: 15px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.1);
    font-size: 1em;
    color: rgb(12, 185, 128);
    background: #fff;
    min-width: 120px;
  
}

.buds-coin{
    cursor:pointer;
}

#coin-balance{
    font-weight:bolder;
}

.ico-live-now{
    margin: 25px;
    padding: 10px;
    cursor: pointer;
background: #fff;
border: none;
border-radius: 15px;
box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
transform: scale(1);
animation: pulse 2s infinite;

}

@keyframes pulse {
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
}
</style>
