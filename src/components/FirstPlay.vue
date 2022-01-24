<template>
<div class="login-page" >
    <div class="center">
        <img @click="showIcoModal()" class="ico-live-now" src="../assets/img/ico-live-now-sm.png" alt="">  
    <h2>Welcome to</h2>
    <h1>Puck Buddies TESTNET!</h1>
    <div>
        <div v-if="myBuds < teamMintCost">
        <p>In order to play, you will some BUDDIES coins.</p>
        <p>Click the button above to get started!</p>
        </div>
        <div v-if="myBuds >= teamMintCost">
        <p >In order to play, you will need a team and some players.</p>
        <p>Click the button below to mint your first team!</p>
        </div>
            <div class="coin-container">
                <div class="coinbalancecard">
                    <div  class="buds-coin"><img @click="addBuddiesToMetaMask()" src="../assets/img/buddies-coin-icon.png" style="width:50px;height:50px" alt="buddies-coin"></div><div id="coin-balance"></div>
                     <p>(click to add BUDS to MetaMask)</p>
                </div>
                
            </div> 
    </div>
    <div class="loading-icon-container" v-if="!priceLoaded">
            <img class="loadingicon" src="../assets/img/loading.gif" alt="loading">
        </div>
    <div v-if="priceLoaded">
        <button v-if="myBuds >= teamMintCost" id="login_button" @click="mintNewTeam('PB-BRB')">Mint Your First Team for <br><b>{{teamMintCost}} BUDS</b></button>
    </div>
  
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
import icomodal from '../components/ICOModal.vue'
import LockModal from '../components/LockModal.vue'

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
        priceLoaded: false,
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
                        console.log(err)
                        this.$emit('teamFound')
                    })
                }else if(teamFound == true){
                    alert("Team detected on this profile. Please refresh your window.")
                }
            },

            async getTeamMintCost(){
                await main.getTeamMintCost().then(res =>{
                    this.teamMintCost = res
                    this.priceLoaded = true
                }).catch(err =>{
                    console.log(err)
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

.center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    background: white;
    border-radius: 10px;
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

.center h1 {
   text-align: center;
    padding: 0 10px 0 10px;
}
.center h2 {
   text-align: center;
    padding: 0 10px 0 10px;
}

.center button{
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

.center button:hover{
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
