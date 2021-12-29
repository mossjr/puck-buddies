import { createApp } from 'vue'
import App from './App.vue'
import Login from './components/Login.vue'
import router from './router'
import MetaMask from './components/MetaMask.vue'
import {pbPlayersAddress, 
        pbMarketplaceAddress, 
        pbProShopFactoryAddress, 
        pbProShopHolderAddress, 
        pbProShopMarketplaceAddress,
        PBXPAddress, 
        PBTeamsAddress, 
        PBPvCMatchupsAddress,
        buddiesaddress, 
        marketfeesaddress, 
        PBPvCHelperAddress, 
        buddiesICOAddress
        } from '../src/config.js'
import PBXP from '../public/assets/contracts/PBXP.json'
import PBPLAYER from '../public/assets/contracts/PBPlayers.json'
import PBPLAYERMARKET from '../public/assets/contracts/PBPlayerMarketplace.json'
import BUDDIES from '../public/assets/contracts/buddies.json'
import PBPROSHOPFACTORY from '../public/assets/contracts/PBProShopFactory.json'
import PBPROSHOPHOLDER from '../public/assets/contracts/PBProShopHolder.json'
import PBPROSHOPMARKETPLACE from '../public/assets/contracts/PBProShopMarketplace.json'
import PBPVCHELPER from '../public/assets/contracts/PBPvCHelper.json'
import PBTEAMS from '../public/assets/contracts/PBTeams.json'
import PBPVCMATCHUPS from '../public/assets/contracts/PBPvCMatchups.json'
import BUDDIESICO from '../public/assets/contracts/BuddiesICO.json'
import CITIES from '../public/assets/data/cities.json'
import NOUNS from '../public/assets/data/nouns.json'



Moralis.initialize("1QCUjtu9KZhzIDE4ASFphZNnESsTFPPmyT5bsuxd") // Application id from moralis.io
Moralis.serverURL = "https://onhkokfjpssy.moralisweb3.com:2053/server"//Server url from moralis.io

//Account Functions
Moralis.Web3.onAccountsChanged(function(accounts) {
    console.log(accounts);
    location.reload();
});

if(typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!')
    init();
}else{
    renderGetMetaMask()
}

async function init() {
    console.log("Initializing...")
    try {
        let user = Moralis.User.current();
        console.log(user)
        
        if(!user){
            console.log("Moralis User Not Detected")
            createApp(Login).mount('#login')
            $("#login").show()
            $("#app").hide()
            $("#login_button").click( async () => {
                login()
            }
            )
        }else if(user){
            console.log("Rendering game from previous login")
            renderGame()
        }        
     
    } catch (err) {
        console.log("Error Trying to Log In")
        console.log(err);
    }
}

async function renderGetMetaMask(){
    console.log("Begin Render Get Meta Mask...")
    $("#login").hide()
    $("#app").hide()
    createApp(MetaMask).mount('#metamask')
    $("#metamask-button").click( async () => {
        console.log("Metamask Button Cicked")
        window.open(
            'https://metamask.io/',
            '_blank'
        )
    })
}

async function login() {
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate();
    }
    console.log("logged in user:", user);
    renderGame()
    location.reload();
  }

async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
    let user = Moralis.User.current();
    console.log(user)
    if(!user){
        console.log("Hide App")
        $("#app").hide()
        console.log("Show Login Info")
        $("#login").show()
        location.reload();
    }
  }

async function renderGame(){
    console.log("Begin Render Game...")
    createApp(App).use(router).mount('#app')
    $("#login").hide()
    $("#player_row").html("")
    $("#app").show()
    $("#disconnect-button").click( async () => {
        logOut()
        location.reload();
    })
    // loadPBPlayers("From Render Game")
}

//ICO Functions
async function getBudsICOInfo(){
    let ICOcontractInstance = new web3.eth.Contract(BUDDIESICO.abi, buddiesICOAddress)
    let budsPerBNB = await ICOcontractInstance.methods.getBudsPerBNB().call({from: ethereum.selectedAddress})
    let budsSoldWei = await ICOcontractInstance.methods.getBudsSold().call({from: ethereum.selectedAddress})
    let budsBalanceWei = await ICOcontractInstance.methods.getBudsBalance().call({from: ethereum.selectedAddress})
    let budsSold =  web3.utils.fromWei(budsSoldWei)
    let budsBalance = web3.utils.fromWei(budsBalanceWei)
    let obj = {budsPerBNB: budsPerBNB, budsSold: budsSold, budsBalance: budsBalance}
    return obj
}

async function buyBuddies(_value) {
    let valueWei =  web3.utils.toWei(_value.toString())
    let ICOcontractInstance = new web3.eth.Contract(BUDDIESICO.abi, buddiesICOAddress)
    await ICOcontractInstance.methods.buyBuddies().send({from: ethereum.selectedAddress, value: valueWei, gas: 510000}).on("receipt", ( (receipt) => {
        console.log("ICO Purchase Successful")
        console.log(receipt)
        return
    }))
        .catch(err =>{
        console.log("ICO Purchase Error")
        console.log(err)
    })
}

//NavBar Admin Button

async function addBuddiesToMetaMask(){
    const tokenAddress = buddiesaddress
    const tokenSymbol = "BUDDIES"
    const tokenDecimals = 18
    const tokenImage = 'https://i.imgur.com/SFJMgjd.png'

    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });
      
        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }
}

async function getBudsAddress(){
    return buddiesaddress
}

//Admin Modal Functions

async function getPvCadminInfo(){
    const web3 = await Moralis.enableWeb3()
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)

    let contractInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    let PvCAddress = await contractInstance.methods.getPBPvCMatchupsAddress().call({from: ethereum.selectedAddress})
    console.log(PvCAddress)
    let PvCDifficultyMod = await contractInstance.methods.getDifficultyMod().call({from: ethereum.selectedAddress})
    console.log(PvCDifficultyMod)
    let PvCBuddiesRewards = await contractInstance.methods.getBuddiesReward().call({from: ethereum.selectedAddress})
    console.log(PvCBuddiesRewards)
    let PvCPBXPReward = await contractInstance.methods.getPBXPReward().call({from: ethereum.selectedAddress})
    console.log(PvCPBXPReward)
    let PvCTimeouts = await contractInstance.methods.getTimeOuts(0).call({from: ethereum.selectedAddress})
    console.log(PvCTimeouts)
    let PvCBuddies = await buddiesInstance.methods.balanceOf(PBPvCMatchupsAddress).call({from: ethereum.selectedAddress})
    console.log(PvCBuddies)

    let playersContractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let pbPlayersAddressFromContract = await playersContractInstance.methods.getPBPlayersAddress().call({from: ethereum.selectedAddress})
    console.log(pbPlayersAddressFromContract)
    let mintingCosts = await playersContractInstance.methods.getMintingCosts().call({from: ethereum.selectedAddress})
    console.log(mintingCosts)
    let playerNextId = await playersContractInstance.methods.getNextId().call({from: ethereum.selectedAddress})
    console.log(playerNextId)

    let proshopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    let pbProshopFactoryAddress = await proshopContractInstance.methods.getPBProShopFactoryAddress().call({from: ethereum.selectedAddress})
    console.log(pbProshopFactoryAddress)
    let pbProshopFactoryStats = await proshopContractInstance.methods.getProShopStats().call({from: ethereum.selectedAddress})
    console.log(pbProshopFactoryStats)

    let proshopHolderContractInstance = new web3.eth.Contract(PBPROSHOPHOLDER.abi, pbProShopHolderAddress)
    let proshopHolderItemsSold = await proshopHolderContractInstance.methods.getItemsSold().call({from: ethereum.selectedAddress})
    console.log(proshopHolderItemsSold)
    let proshopHolderAddress = await proshopHolderContractInstance.methods.getPBProShopHolderAddress().call({from: ethereum.selectedAddress})
    console.log(proshopHolderAddress)

    let proshopMarketplaceContractInstance = new web3.eth.Contract(PBPROSHOPMARKETPLACE.abi, pbProShopMarketplaceAddress)
    let proshopMarketplaceAddress = await proshopMarketplaceContractInstance.methods.getPBProShopMarketplaceAddress().call({from: ethereum.selectedAddress})
    console.log(proshopMarketplaceAddress)
    let proshopMarketplaceMarketFee = await proshopMarketplaceContractInstance.methods.getProshopMarketFeePercent().call({from: ethereum.selectedAddress})
    console.log(proshopMarketplaceMarketFee)
    let proshopMarketplaceFeesAddress = await proshopMarketplaceContractInstance.methods.getMarketFeePayableAddress().call({from: ethereum.selectedAddress})
    console.log(proshopMarketplaceFeesAddress)
    let proshopFeesBuddiesBalance = await buddiesInstance.methods.balanceOf(proshopMarketplaceFeesAddress).call({from: ethereum.selectedAddress})
    let proshopMarketplaceStats = await proshopMarketplaceContractInstance.methods.getMarketplaceStats().call({from: ethereum.selectedAddress})
    console.log(proshopMarketplaceStats)

    let pbTeamsContractInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
    let pbTeamsAddress = await pbTeamsContractInstance.methods.getPBTeamsAddress().call({from: ethereum.selectedAddress})
    console.log(pbTeamsAddress)
    let pbTeamsMintCost = await pbTeamsContractInstance.methods.getTeamMintCost().call({from: ethereum.selectedAddress})
    console.log(pbTeamsMintCost)
    let pbTeamsCount = 0 //await pbTeamsContractInstance.methods.getTeamsCount().call({from: ethereum.selectedAddress})
    console.log(pbTeamsCount)

    let pbPBXPContractInstance = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    let pbPBXPAddress = await pbPBXPContractInstance.methods.getPBXPAddress().call({from: ethereum.selectedAddress})
    console.log(pbPBXPAddress)
    let pbPBXPUpgradeCost = await pbPBXPContractInstance.methods.getUpgradeCost().call({from: ethereum.selectedAddress})
    console.log(pbPBXPUpgradeCost)

    let icoContractInstance = new web3.eth.Contract(BUDDIESICO.abi, buddiesICOAddress)
    let icoContractAddress = await icoContractInstance.methods.getBuddiesICOAddress().call({from: ethereum.selectedAddress})
    console.log(icoContractAddress)
    let icoBuddiesPerBNB = await icoContractInstance.methods.getBudsPerBNB().call({from: ethereum.selectedAddress})
    console.log(icoBuddiesPerBNB)
    let icoBudsSold = await icoContractInstance.methods.getBudsSold().call({from: ethereum.selectedAddress})
    console.log(icoBudsSold)
    let icoBudsBalance = await icoContractInstance.methods.getBudsBalance().call({from: ethereum.selectedAddress})
    console.log(icoBudsBalance)
    let icoBNBBalance = await icoContractInstance.methods.getBNBBalance().call({from: ethereum.selectedAddress})
    console.log(icoBNBBalance)

    let obj = { PvCAddress:PvCAddress, 
                PvCDifficultyMod: PvCDifficultyMod, 
                PvCBuddiesReward0: web3.utils.fromWei(PvCBuddiesRewards[0]), 
                PvCBuddiesReward1: web3.utils.fromWei(PvCBuddiesRewards[1]), 
                PvCBuddiesReward2: web3.utils.fromWei(PvCBuddiesRewards[2]),
                PvCto0: PvCTimeouts[0],
                PvCto1: PvCTimeouts[1],
                PvCto2: PvCTimeouts[2],
                PvCPBXPReward: PvCPBXPReward,
                PvCBuddies: web3.utils.fromWei(PvCBuddies),
                pbPlayersAddress: pbPlayersAddress, 
                mintCost0: web3.utils.fromWei(mintingCosts[0]),
                mintCost1: web3.utils.fromWei(mintingCosts[1]),
                mintCost2: web3.utils.fromWei(mintingCosts[2]),
                ageoutSeconds: mintingCosts[3],
                playerNextId: playerNextId,
                pbProshopFactoryAddress: pbProshopFactoryAddress,
                proshopItemsCreated: pbProshopFactoryStats,
                proshopHolderAddress: proshopHolderAddress,
                proshopItemsSold: proshopHolderItemsSold,
                proshopMarketplaceAddress: proshopMarketplaceAddress,
                proshopMarketplaceMarketFee: proshopMarketplaceMarketFee,
                proshopFeesBuddiesBalance: web3.utils.fromWei(proshopFeesBuddiesBalance),
                proshopMarketplaceFeesAddress: proshopMarketplaceFeesAddress,
                proshopMarketplaceTotalItems: proshopMarketplaceStats[0],
                proshopMarketplaceTotalComplete: proshopMarketplaceStats[1],
                pbTeamsAddress: pbTeamsAddress,
                pbTeamsMintCost: web3.utils.fromWei(pbTeamsMintCost),
                pbTeamsCount: pbTeamsCount,
                pbPBXPAddress: pbPBXPAddress,
                icoContractAddress: icoContractAddress,
                icoBuddiesPerBNB: icoBuddiesPerBNB,
                icoBudsSold: web3.utils.fromWei(icoBudsSold),
                icoBudsBalance: web3.utils.fromWei(icoBudsBalance),
                icoBNBBalance: web3.utils.fromWei(icoBNBBalance),
                }
                console.log(obj)
    return obj
}


async function updateVariables(_mintCost1, _mintCost2, _mintCost3, _ageoutSeconds){
    const web3 = await Moralis.enableWeb3()
    let m1 = web3.utils.toWei(_mintCost1.toString())
    let m2 = web3.utils.toWei(_mintCost2.toString())
    let m3 = web3.utils.toWei(_mintCost3.toString())
    let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    await contractInstance.methods.updateVariables(m1, m2, m3,_ageoutSeconds).send({from: ethereum.selectedAddress, gas: 44000}).on("receipt", ( (receipt) => {
        console.log(receipt)
    })).catch(err =>{
        console.log(err)
    })
}

async function updateBuddiesReward(_r0, _r1, _r2){
    const web3 = await Moralis.enableWeb3()
    let r0 = web3.utils.toWei(_r0.toString())
    let r1 = web3.utils.toWei(_r1.toString())
    let r2 = web3.utils.toWei(_r2.toString())
    let r = [r0, r1, r2]
    let contractInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    await contractInstance.methods.updateBuddiesReward(r).send({from: ethereum.selectedAddress, gas: 44000}).on("receipt", ( (receipt) => {
        console.log(receipt)
    })).catch(err =>{
        console.log(err)     
    })
}

async function updateTimesOut(_to0, _to1, _to2){
    const web3 = await Moralis.enableWeb3()
    let tos = [_to0, _to1, _to2]
    let contractInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    await contractInstance.methods.updateTimesOut(tos).send({from: ethereum.selectedAddress, gas: 44000}).on("receipt", ( (receipt) => {
        console.log(receipt)
    })).catch(err =>{
        console.log(err)     
    })
}

async function updatePBXPReward(_xpr){
    const web3 = await Moralis.enableWeb3()
    let contractInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    await contractInstance.methods.updatePBXPReward(_xpr).send({from: ethereum.selectedAddress, gas: 44000}).on("receipt", ( (receipt) => {
        console.log(receipt)
    })).catch(err =>{
        console.log(err)
    })
}

async function updateTeamMintCost(_value){
    const web3 = await Moralis.enableWeb3()
    let value = web3.utils.toWei(_value.toString())
    let pbTeamsContractInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
    await pbTeamsContractInstance.methods.updateTeamMintCost(value).send({from: ethereum.selectedAddress, gas: 44000}).on("receipt", ( (receipt) => {
        console.log(receipt)
    })).catch(err =>{
        console.log(err)
    })
}

async function updateBudsPerBNB(_icorate){
    const web3 = await Moralis.enableWeb3()
    let icoContractInstance = new web3.eth.Contract(BUDDIESICO.abi, buddiesICOAddress)
    await icoContractInstance.methods.updateBudsPerBNB(_icorate).send({from: ethereum.selectedAddress, gas: 44000}).on("receipt", ( (receipt) => {
        console.log(receipt)
    })).catch(err =>{
        console.log(err)
    })
}



//Check Admin Functions
async function checkPBPlayerAdmin() {
    const web3 = await Moralis.enableWeb3()
    let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let adminCheck = await contractInstance.methods.isAdmin().call({from: ethereum.selectedAddress})
    return adminCheck
  }

  async function checkMarketAdmin() {
    const web3 = await Moralis.enableWeb3()
    let contractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let adminCheck = await contractInstance.methods.isAdmin().call({from: ethereum.selectedAddress})
    return adminCheck
  }

//PBP Admin Functions
async function getDraftPrice(){
    window.web3 = await Moralis.enableWeb3()
    const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let getDraft = await playerContract.methods.getMintingCosts().call({from: ethereum.selectedAddress})
    console.log(getDraft)
    let draftValue1 = web3.utils.fromWei(getDraft[0])
    let draftValue2 = web3.utils.fromWei(getDraft[1])
    let draftValue3 = web3.utils.fromWei(getDraft[2])
    let resultsOb = {dv1: draftValue1, dv2: draftValue2, dv3: draftValue3}
    return resultsOb
}

async function updateDraftPrice(value){
    window.web3 = await Moralis.enableWeb3()
    let valueWei = web3.utils.toWei(value)
    const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let res = await playerContract.methods.updateMintingCost(valueWei).send({from: ethereum.selectedAddress, gas: 44000})
}

async function getMarketplaceAddress(){
    window.web3 = await Moralis.enableWeb3()
    const pbMarketContractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let marketplaceAddress = await pbMarketContractInstance.methods.getPBMarketplaceAddress().call({from: ethereum.selectedAddress})
    return marketplaceAddress
}

async function updateMarketplaceAddress(){
    window.web3 = await Moralis.enableWeb3()
    const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    await playerContract.methods.updateMarketPlaceAddress(pbMarketplaceAddress).send({from: ethereum.selectedAddress, gas: 512000})
    await playerContract.methods.updateEquippedItemsAddress(equippeditemsaddress).send({from: ethereum.selectedAddress, gas: 512000})
    await playerContract.methods.updateProShopAddress(pbProShopFactoryAddress).send({from: ethereum.selectedAddress, gas: 512000})
}

//Market ADMIN Functions
async function getMarketFeePercent(){
    window.web3 = await Moralis.enableWeb3()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let getMarketPercentFee= await marketContract.methods.getMarketFeePercent().call({from: ethereum.selectedAddress})
    let fee = getMarketPercentFee/100
    return fee
}

async function updateMarketFeePercent(value){
    let sendValue = value * 100;
    window.web3 = await Moralis.enableWeb3()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let res = await marketContract.methods.updateMarketFeePercent(sendValue).send({from: ethereum.selectedAddress, gas: 44000})
}

async function getMarketFeePayableAddress(){
    window.web3 = await Moralis.enableWeb3()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let getMarketFeePayableAddress = await marketContract.methods.getMarketFeePayableAddress().call({from: ethereum.selectedAddress})
    console.log("Result: " + getMarketFeePayableAddress)
    return getMarketFeePayableAddress
}

async function updateFeePayableAddress(newaddress){
    window.web3 = await Moralis.enableWeb3()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    console.log("here is the address being sent: " + newaddress)
    let updateMarketFeePayableAddress = await marketContract.methods.updateFeePayableAddress(newaddress).send({from: ethereum.selectedAddress, gas: 512000})
}

//Pro Shop Admin Functions
async function checkProShopAdmin() {
    const web3 = await Moralis.enableWeb3()
    let contractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    let adminCheck = await contractInstance.methods.isAdmin().call({from: ethereum.selectedAddress})
    return adminCheck
  }

  async function loadProshopItems(_proShopItemAdmin,_proShopItems, _proShopActive){
        window.web3 = await Moralis.enableWeb3()
        const proshopInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
        const qtys = await proshopInstance.methods.balanceOfBatch(_proShopItemAdmin,_proShopItems).call({from: ethereum.selectedAddress})
        let stock = []
        for (let i=0; i < qtys.length; i++){
            let sku = _proShopItems[i].toString().slice(0,6)
            let price = _proShopItems[i].toString().slice(6,13)
            let budzPrice = Number(price)/1000
            let type = _proShopItems[i].toString().slice(14,16)
            let op = _proShopItems[i].toString().slice(0,3)
            let dp = _proShopItems[i].toString().slice(4,7)
            let inStock = false
            if (qtys[i] > 0){
                inStock = true
            }else if (qtys[i] == 0){
                inStock = false
            }

            stock.push({
                'tokenId': _proShopItems[i],
                'sku': sku,
                'price': budzPrice,
                'type': type,
                'qty': qtys[i],
                'inStock': inStock, 
                'admin': _proShopItemAdmin[i],
                'active': _proShopActive[i],
                'op': op,
                'dp': dp
            })
        }
        return stock
  }

        async function loadMyEquipment(_proShopItems){
            window.web3 = await Moralis.enableWeb3()
            const proshopInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
            let senderAddressArray = []
            for (let i=0; i < _proShopItems.length; i++){
                senderAddressArray.push(ethereum.selectedAddress)
            }
            const qtys = await proshopInstance.methods.balanceOfBatch(senderAddressArray,_proShopItems).call({from: ethereum.selectedAddress})
            let inventory = []
            for (let i=0; i < qtys.length; i++){
                 let sku = _proShopItems[i].toString().slice(0,6)
                 let type = _proShopItems[i].toString().slice(14,16)
                 let col1 = _proShopItems[i].c1
                 let col2 = _proShopItems[i].c2
                 let inInventory = false
                 if(qtys[i] == 0){
                    inInventory = false
                 }else if (qtys[i] > 0){
                    inInventory = true
                 }    
                 inventory.push({
                    'tokenId': _proShopItems[i],
                    'sku': sku,
                    'type': type,
                    'col1': col1,
                    'col2': col2,
                    'qty': qtys[i],
                    'inInventory': inInventory
                 })
             }
             return inventory
            }

    async function loadProshopMarketItems(){
        window.web3 = await Moralis.enableWeb3()
        const proshopMarketplaceInstance = new web3.eth.Contract(PBPROSHOPMARKETPLACE.abi, pbProShopMarketplaceAddress)
        const proshopMarketplaceItems = await proshopMarketplaceInstance.methods.getProShopMarketItems().call({from: ethereum.selectedAddress})
         return proshopMarketplaceItems
    }
    
    async function getProshopMarketFeePercent(){
        window.web3 = await Moralis.enableWeb3()
        const proshopMarketplaceInstance = new web3.eth.Contract(PBPROSHOPMARKETPLACE.abi, pbProShopMarketplaceAddress)
        let feepercent = await proshopMarketplaceInstance.methods.getProshopMarketFeePercent().call({from: ethereum.selectedAddress})
        return feepercent
    }

    async function createProShopMarketItem(_tokenId, _sellPrice, _sellFee){
        let approved = false
        const proshopInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
        await proshopInstance.methods.setApprovalForAll(pbProShopMarketplaceAddress,true).send({from: ethereum.selectedAddress, gas: 72000}).on("receipt", ( () => {
            console.log("ProShop Approved")
            approved = true
        }))
        .catch(err =>{
            console.log(err)
        })
        if(approved == true){
            let value = _sellPrice + Number(_sellFee)
            let _totalprice =  web3.utils.toWei(value.toString())
            window.web3 = await Moralis.enableWeb3()
            console.log(_totalprice)
            console.log(_tokenId)
            const proshopMarketplaceInstance = new web3.eth.Contract(PBPROSHOPMARKETPLACE.abi, pbProShopMarketplaceAddress)
            await proshopMarketplaceInstance.methods.createProShopMarketItem(_tokenId, _totalprice).send({from: ethereum.selectedAddress, gas: 512000})
            approved = false
            return
        }else{
            approved = false
        }
  
    }

    async function createProShopMarketplaceSale(_marketListingId, _price) {
        let approved = false;
        const sender = ethereum.selectedAddress
        const web3 = await Moralis.enableWeb3()
        let valueWei =_price.toString()
        let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
        let proShopMarketplaceContractInstance = new web3.eth.Contract(PBPROSHOPMARKETPLACE.abi, pbProShopMarketplaceAddress)
        
        await buddiesInstance.methods.approve(pbProShopMarketplaceAddress, valueWei).send({from: sender, gas: 72000}).on("receipt", ( () => {
            console.log("Buddies Spend by ProShop Marketplace Contract Address Approved")
            approved = true
        }))
        .catch(err => {
            console.log("Error trying to make Approval for Buddies Spend by ProShop Marketplace Contract: " + err)
            console.log(err)
        })  
      
        if(approved == true){
            approved = false;
            let transaction = await proShopMarketplaceContractInstance.methods.createProShopMarketplaceSale(_marketListingId).send({from: sender, gas: 521000}).on("receipt", ( (receipt) => {
                    console.log("Transaction complete: " + receipt)
                }))
                .catch(err => {
                    console.log("Error trying to buy from the Pro Shop Marketplace: " + err)
                    console.log(err)
                    })
             return transaction
            }
    }

    async function cancelProShopMarketplaceSale(_marketListingId) {
        const sender = ethereum.selectedAddress
        const web3 = await Moralis.enableWeb3()
        let proShopMarketplaceContractInstance = new web3.eth.Contract(PBPROSHOPMARKETPLACE.abi, pbProShopMarketplaceAddress)
        await proShopMarketplaceContractInstance.methods.cancelProShopMarketplaceSale(_marketListingId).send({from: sender, gas: 521000}).on("receipt", ( (receipt) => {
            console.log("Canceling Proshop Marketplace Item Sale complete: " + receipt)
        }))
        .catch(err => {
            console.log("Error trying to Cancel Sale from Pro Shop Marketplace: " + err)
            console.log(err)
            })
     return
    }    
    
    async function sendProShopAddress(){
        const web3 = await Moralis.enableWeb3()
        let proShopHolderInstance = new web3.eth.Contract(PBPROSHOPHOLDER.abi, pbProShopHolderAddress)
        await proShopHolderInstance.methods.updateProShopAddress(pbProShopFactoryAddress).send({from: ethereum.selectedAddress, gas: 72000})
        let proShopFactoryInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
        await proShopFactoryInstance.methods.updateProshopHolderAddress(pbProShopHolderAddress).send({from: ethereum.selectedAddress, gas: 72000})
    }

//My Players Functions
async function loadPBPlayers(source){
    const query = new Moralis.Query("PBTeams")
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const teams = await query.find()
    // console.log(teams[0])
    // console.log(teams[0].attributes.teamDNA)
    console.log("Loading Players from: " + source)
    window.web3 = await Moralis.enableWeb3()
    const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let array = await tokenContract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress})
    // console.log(array)
    let nounsArray = NOUNS
    let teamFirstLetter
    if (array.length == 0) {
        let emptyArray = []
      return emptyArray
      }
   
      
      
    const playerdata = array.map(async (playerId) => {
      let details = await tokenContract.methods.getTokenDetails(playerId).call({from: ethereum.selectedAddress})
      
        if(teams[0].attributes.teamDNA == 0){
            teamFirstLetter = ''
        }else{
            
            let dnaInt = teams[0].attributes.teamDNA
            let dna = dnaInt.toString()
            console.log(dna)
            let teamNounNumber = parseInt(dna.slice(5,8))
            let teamName = nounsArray[teamNounNumber].noun
            teamFirstLetter = teamName.slice(0,1) 
            //console.log (details.teamId) 
            //console.log (teamName)
        }

    let isOffence = false
    let isDefence = false
    let isGoalie = false
    
    if(details.playertype == 1){
        isOffence = true
    }else if(details.playertype == 2){
        isDefence = true
    }else if(details.playertype == 3){
        isGoalie = true
    }

    // console.log(playerId + " " + teams[0].attributes.p1)
    // console.log(playerId + " " + teams[0].attributes.p2)
    // console.log(playerId + " " + teams[0].attributes.p3)
    // console.log(playerId + " " + teams[0].attributes.p4)
    // console.log(playerId + " " + teams[0].attributes.p5)
    // console.log(playerId + " " + teams[0].attributes.p6)
    let myLetter = ""
    let playerPOS = 0
    let isOnTeam = false
    if(playerId == teams[0].attributes.p1){
        playerPOS = 1
        isOnTeam = true
        myLetter = teamFirstLetter
        // console.log("Assigned Player POS: " + playerPOS)
    }else if(playerId == teams[0].attributes.p2){
        playerPOS = 2
        isOnTeam = true
        myLetter = teamFirstLetter
        // console.log("Assigned Player POS: " + playerPOS)
    }else if(playerId == teams[0].attributes.p3){
        playerPOS = 3
        isOnTeam = true
        myLetter = teamFirstLetter
        // console.log("Assigned Player POS: " + playerPOS)
    }else if(playerId == teams[0].attributes.p4){
        playerPOS = 4
        isOnTeam = true
        myLetter = teamFirstLetter
        // console.log("Assigned Player POS: " + playerPOS)
    }else if(playerId == teams[0].attributes.p5){
        playerPOS = 5
        isOnTeam = true
        myLetter = teamFirstLetter
        // console.log("Assigned Player POS: " + playerPOS)
    }else if(playerId == teams[0].attributes.p6){
        playerPOS = 6
        isOnTeam = true
        myLetter = teamFirstLetter
        // console.log("Assigned Player POS: " + playerPOS)
    }

    let playercountry = await playerCountry(details.dna)
    let playerAge = await getPlayerAge(details.ageoutTimestamp, details.draftTimestamp)
        // console.log(details)
        // console.log({
        //     id: playerId,
        //     offence: details.offence,
        //     defence: details.defence,
        //     dna: details.dna,
        //     playertype: details.playertype,
        //     isOffence:isOffence,
        //     isDefence:isDefence,
        //     isGoalie:isGoalie,
        //     teamId: details.teamId,
        //     teamLetter: teamFirstLetter,
        //     position: playerPOS,
        //     mainColor: details.mainColor,
        //     equippedJersey: details.equippedJersey,
        //     equippedToken: details.equippedToken,
        //     ageoutTimestamp: details.ageoutTimestamp,
        //     draftTimestamp: details.draftTimestamp,
        //     playercountry: playercountry ,
        //     playerAge:playerAge         
        //   })
        return {
            id: playerId,
            offence: details.offence,
            defence: details.defence,
            dna: details.dna,
            playertype: details.playertype,
            isOffence:isOffence,
            isDefence:isDefence,
            isGoalie:isGoalie,
            isOnTeam: isOnTeam,
            teamLetter: myLetter,
            position:playerPOS,
            mainColor: details.mainColor,
            equippedJersey: details.equippedJersey,
            equippedToken: details.equippedToken,
            ageoutTimestamp: details.ageoutTimestamp,
            draftTimestamp: details.draftTimestamp,
            playercountry: playercountry ,
            playerAge:playerAge         
        }
      }).sort((a, b) => b.count - a.count)
      return playerdata
}

function playerCountry(_dna){
    const countries = [
        ['Canada', 4274],
        ['United States', 2793],
        ['Sweden', 967],
        ['Finland', 582],
        ['Russia', 523],
        ['Czech Republic', 335],
        ['Switzerland', 118],
        ['Slovakia', 98],
        ['Germany', 88],
        ['Denmark', 78],
        ['Latvia', 39],
        ['France', 29],
        ['Belarus', 19],
        ['Slovenia', 14],
        ['Norway', 13],
        ['Austria', 11],
        ['Netherlands', 10],
        ['Australia', 9]
    ]

    let total = 0
    for (let i = 0; i < countries.length; ++i) {
        total += countries[i][1];
        
    }

    let threshold = _dna.slice(8,12)
    //console.log("Country Threshold Player " + id + ": " + threshold)
    threshold = threshold - 0

    total = 0;
    for (let i = 0; i < countries.length - 1; ++i) {
        total += countries[i][1]
        if (total >= threshold) {
            //console.log("Selected Country Player " + id + ": " + countries[i][0])
            return countries[i][0]
            
        }
    }
    return countries[countries.length - 1][0]
}

function getPlayerAge(_ageoutTimestamp, _draftTimestamp){
    let yearsActve = 22
    let startAge = 18
    let careerLength = _ageoutTimestamp - _draftTimestamp
    let careerProgress = Math.floor(Date.now() / 10 ** 3) - _draftTimestamp
    let oneYearSpan = careerLength/yearsActve
    let yearsIntoCareer = Math.floor(careerProgress/oneYearSpan)
    let playerAge = startAge + yearsIntoCareer
    return playerAge
}


async function getSinglePlayerData(playerId){
    window.web3 = await Moralis.enableWeb3()
    const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let details = await tokenContract.methods.getTokenDetails(playerId).call({from: ethereum.selectedAddress}) 
    console.log("DETAILS FROM MAIN")
        console.log(details)
        return {
          id: playerId,
          offence: details.offence,
          defence: details.defence,
          dna: details.dna,
          playertype: details.playertype,
          isOffence: details.isOffence,
          isDefence: details.isDefence,
          isGoalie: details.isGoalie,
          teamId: details.teamId,
          position: details.position,
          mainColor: details.mainColor,
          equippedJersey: details.equippedJersey,
          equippedStick: details.equippedStick,
          equippedToken: details.equippedToken,
          ageoutTimestamp: details.ageoutTimestamp,
          draftTimestamp: details.draftTimestamp            
        }
        
}

async function getUpgradeCost() {
    const caller = ethereum.selectedAddress
    window.web3 = await Moralis.enableWeb3()
    const PBXPContract = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    let upgradeCost = await PBXPContract.methods.getUpgradeCost().call({from: caller})
    return upgradeCost
}


async function increaseStats(tokenId, statType, qty, xp) {
    console.log("Token Id: " + tokenId + " statType: " +  statType + " qty: " + qty + " xp: " + xp)
    const sender = ethereum.selectedAddress
    
    const tokenContract = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    await tokenContract.methods.increaseStats(tokenId, statType, qty, xp).send({from: sender, gas: 512000}).on("receipt", ( (receipt) => {
        console.log("Successfully increased Stat")
        console.log("Gas Used: " + receipt.gasUsed)
        console.log(receipt)
    }))
}

async function giftPlayer(tokenId, newOwner){
    console.log(tokenId + " " + newOwner)
    const sender = ethereum.selectedAddress
    window.web3 = await Moralis.enableWeb3()
    const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    await tokenContract.methods.giftPlayer(tokenId, newOwner).send({from: sender, gas: 512000}).on("receipt", ( (receipt) => {
        console.log("Gas Used: " + receipt.gasUsed)
        console.log(receipt)
    }))
}


//PBPlayers Market Functions

async function loadPBPlayersMarket(){
    window.web3 = await Moralis.enableWeb3()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    const data = await marketContract.methods.fetchMarketItems()
    if (data.length == 0) {
        return
    }
    const items = await Promise.all(data.map(async i => {
        const meta = await tokenContract.methods.getTokenDetails(tokenId)
        const price = Web3.utils.fromWei(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          id: meta.playerId,
          offence: meta.details.offence,
          defence: meta.details.defence,
          dna: meta.details.dna,
          playertype: meta.details.playertype,
          isOffence: meta.details.isOffence,
          isDefence: meta.details.isDefence,
          isGoalie: meta.details.isGoalie,
          teamId: meta.details.teamId,
          jerseyId: meta.details.jerseyId,
           mainColor: meta.details.mainColor,
          injuredTime: meta.details.injuredTime,
          injuryTimestamp: meta.details.injuryTimestamp  
        }
        return item  
    }))
}


//Pro Shop Functions
async function getTimestamp(){
    const caller = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    let timeStamp = await proShopContractInstance.methods.getTimestamp().call({from: caller})
    console.log(timeStamp)
}

async function addStockToProShop(sku, qty) {
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    await proShopContractInstance.methods.newProduct(sku, qty).send({from: minter, gas: 512000}).on("receipt", ( (receipt) => {
                  console.log("Mint New Items Transaction received:")
                  console.log("Gas Used: " + receipt.gasUsed)
                  console.log(receipt)
                  
              }))
}

async function giftItem(tokenId, qty, newOwner){
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    let tokenIdArray = [tokenId]
    let qtyArray = [qty]
    await proShopContractInstance.methods.giftItem(tokenIdArray,qtyArray,newOwner).send({from: minter, gas: 512000}).on("receipt", ( (receipt) => {
        console.log("Gift Items Transaction received:")
        console.log("Gas Used: " + receipt.gasUsed)
        console.log(receipt)
    })).catch(err =>{
        console.log(err)
    })
}

async function burnStock(sku, qty) {
    const burner = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    await proShopContractInstance.methods.burnItems(sku, qty).send({from: burner, gas: 512000}).on("receipt", ( (receipt) => {
                  console.log("Burn Items Transaction received:")
                  console.log("Gas Used: " + receipt.gasUsed)
                  console.log(receipt)
              }))
}

async function purchaseFromStore(value, tokenId, qty) {
  console.log("The Value sending is " + value)
  console.log("The tokenId  sending is " + tokenId)
  console.log("The qty  sending is " + qty)
  let approved = false;
  const sender = ethereum.selectedAddress
  const web3 = await Moralis.enableWeb3()
//   let priceFromSku = sku.toString().slice(6,13)
//   priceFromSku = priceFromSku/1000
//   let validPrice = web3.utils.toWei(priceFromSku.toString())
  let valueWei = web3.utils.toWei(value.toString())
  let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
  //let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
  let proShopHolderContractInstance = new web3.eth.Contract(PBPROSHOPHOLDER.abi, pbProShopHolderAddress)
  
  await buddiesInstance.methods.approve(pbProShopHolderAddress, valueWei).send({from: sender, gas: 72000}).on("receipt", ( () => {
      console.log("Buddies Spend by ProShop Contract Address Approved")
      approved = true
  }))
  .catch(err => {
      console.log("Error trying to make Approval for Buddies Spend by ProShop Contract: " + err)
      console.log(err)
  })  

  if(approved == true){
      approved = false;
      console.log("Sending :" + valueWei + " * " + qty + " : " + tokenId)
      let transaction = await proShopHolderContractInstance.methods.purchaseFromStore(tokenId, valueWei, qty).send({from: sender, gas: 521000}).on("receipt", ( (receipt) => {
              console.log("Transaction complete: " + receipt)
          }))
          .catch(err => {
              console.log("Error trying to buy from the Pro Shop: " + err)
              console.log(err)
              })
       return transaction
      }
    
}

async function applyEquipmentToPlayer(selectToken, sku, playerId){
    window.web3 = await Moralis.enableWeb3()
    const sender = ethereum.selectedAddress
    const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let transaction = await tokenContract.methods.updateEquipment(selectToken, sku, playerId).send({from: sender, gas: 521000}).on("receipt", ( (receipt) => {
        console.log("Transaction complete: " + receipt)
        console.log(receipt)
    }))
    .catch(err => {
        console.log("Error trying to apply equipment to player: " + err)
        console.log(err)
        })
    return transaction
}

async function removeProShopEquipment(equippedToken, playerId){
    let itemType = Number(equippedToken.substring(equippedToken.length - 2))
    window.web3 = await Moralis.enableWeb3()
    const sender = ethereum.selectedAddress
    const proshopHolderContract = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    await proshopHolderContract.methods.setApprovalForAll(pbPlayersAddress, true).send({from: sender, gas: 521000})
    const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let transaction = await tokenContract.methods.removeEquipment(playerId).send({from: sender, gas: 521000}).on("receipt", ( (receipt) => {
        console.log("Transaction complete: " + receipt)
        console.log(receipt)
    }))
    .catch(err => {
        console.log("Error trying to apply equipment to player: " + err)
        console.log(err)
        })
    return transaction
}


//PBXP Shop Functions

async function addStockToPBXPShop(sku, qty) {
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let PBXPShopContractInstance = new web3.eth.Contract(PBXPSHOPFACTORY.abi, PBXPShopFactoryAddress)
    await PBXPShopContractInstance.methods.newProduct(sku, qty).send({from: minter, gas: 512000}).on("receipt", ( (receipt) => {
                  console.log("Mint New Items Transaction received:")
                  console.log("Gas Used: " + receipt.gasUsed)
                  console.log(receipt)
                  
              }))
}

async function burnPBXPStock(sku, qty) {
    const burner = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let PBXPShopContractInstance = new web3.eth.Contract(PBXPSHOPFACTORY.abi, PBXPShopFactoryAddress)
    await PBXPShopContractInstance.methods.burnItems(sku, qty).send({from: burner, gas: 512000}).on("receipt", ( (receipt) => {
                  console.log("Burn Items Transaction received:")
                  console.log("Gas Used: " + receipt.gasUsed)
                  console.log(receipt)
              }))
}

// async function purchaseFromStore(value, sku) {
//   console.log("The Value sending is " + value)
//   console.log("The sku  sending is " + sku)
//   let approved = false;
//   const sender = ethereum.selectedAddress
//   const web3 = await Moralis.enableWeb3()
//   let priceFromSku = sku.toString().slice(6,13)
//   priceFromSku = priceFromSku/1000
//   let validPrice = web3.utils.toWei(priceFromSku.toString())
//   let valueWei = web3.utils.toWei(value.toString())
//   let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
//   //let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
//   let proShopHolderContractInstance = new web3.eth.Contract(PBPROSHOPHOLDER.abi, pbProShopHolderAddress)
  
//   await buddiesInstance.methods.approve(pbProShopHolderAddress, valueWei).send({from: sender, gas: 72000}).on("receipt", ( () => {
//       console.log("Buddies Spend by ProShop Contract Address Approved")
//       approved = true
//   }))
//   .catch(err => {
//       console.log("Error trying to make Approval for Buddies Spend by ProShop Contract: " + err)
//       console.log(err)
//   })  

//   if(approved == true){
//       approved = false;
//       let transaction = await proShopHolderContractInstance.methods.buyItems(sku, valueWei).send({from: sender, gas: 521000}).on("receipt", ( (receipt) => {
//               console.log("Transaction complete: " + receipt)
//           }))
//           .catch(err => {
//               console.log("Error trying to buy from the Pro Shop: " + err)
//               console.log(err)
//               })
//        return transaction
//       }
    
// }

// async function applyEquipmentToPlayer(selectToken, sku, itemType, playerId){
//     window.web3 = await Moralis.enableWeb3()
//     const sender = ethereum.selectedAddress
//     const proshopHolderContract = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
//     await proshopHolderContract.methods.setApprovalForAll(pbPlayersAddress, true).send({from: sender, gas: 521000})
//     const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
//     let transaction = await tokenContract.methods.updateEquipment(selectToken, sku, itemType, playerId).send({from: sender, gas: 521000}).on("receipt", ( (receipt) => {
//         console.log("Transaction complete: " + receipt)
//         console.log(receipt)
//     }))
//     .catch(err => {
//         console.log("Error trying to apply equipment to player: " + err)
//         console.log(err)
//         })
//     return transaction
// }





//My Team Functions

async function displayTeam(){
    console.log("Begin Display Teams - NEED TO SWITCH TO MORALIS")
    const query = new Moralis.Query("PBTeams")
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const teams = await query.find()
    if(teams.length >= 1){
        console.log("Team Found")
        console.log(teams[0])
        let p1ID = teams[0].attributes.p1
        let p2ID = teams[0].attributes.p2
        let p3ID = teams[0].attributes.p3
        let p4ID = teams[0].attributes.p4
        let p5ID = teams[0].attributes.p5
        let p6ID = teams[0].attributes.p6
        let p1Details
        let p2Details
        let p3Details
        let p4Details
        let p5Details
        let p6Details
        let teamOP = 0
        let teamDP = 0

        if (p1ID > 0){
            console.log("looking up POS 1 player: " + p1ID)
            p1Details = await getSinglePlayerData(p1ID).then(res => {
                console.log(res)
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p1ID == 0 || p1ID == ""){
            console.log("POS 1 Player not found")
            p1Details = {
            id: "",
            offence: 0,
            defence: 0,
            dna: 0,
            playertype: 0,
            ageoutTimestamp: 100000000000,
            draftTimestamp: 0,
            equippedJersey: 0,
            equippedStick: 0,
            equippedToken: 0,
            isDefence: false,
            isGoalie: false,
            isOffence: false,
            mainColor: 0,
            position: 0,
            teamId: 0
            }
        }

         if (p2ID > 0){
            console.log("looking up POS 2 player: " + p2ID)
            p2Details = await getSinglePlayerData(p2ID).then(res => {
                console.log(res)
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p2ID == 0 || p2ID == ""){
            console.log("POS 2 Player not found")
            p2Details = {
            id: "",
            offence: 0,
            defence: 0,
            dna: 0,
            playertype: 0,
            ageoutTimestamp: 100000000000,
            draftTimestamp: 0,
            equippedJersey: 0,
            equippedStick: 0,
            equippedToken: 0,
            isDefence: false,
            isGoalie: false,
            isOffence: false,
            mainColor: 0,
            position: 0,
            teamId: 0
            }
        }
        
        if (p3ID > 0){
            console.log("looking up POS 3 player: " + p3ID)
            p3Details = await getSinglePlayerData(p3ID).then(res => {
                console.log(res)
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p3ID == 0 || p3ID == ""){
            console.log("POS 3 Player not found")
            p3Details = {
            id: "",
            offence: 0,
            defence: 0,
            dna: 0,
            playertype: 0,
            ageoutTimestamp: 100000000000,
            draftTimestamp: 0,
            equippedJersey: 0,
            equippedStick: 0,
            equippedToken: 0,
            isDefence: false,
            isGoalie: false,
            isOffence: false,
            mainColor: 0,
            position: 0,
            teamId: 0
            }
        }
        
        if (p4ID > 0){
            console.log("looking up POS 4 player: " + p4ID)
            p4Details = await getSinglePlayerData(p4ID).then(res => {
                console.log(res)
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p4ID == 0 || p4ID == ""){
            console.log("POS 4 Player not found")
            p4Details = {
            id: "",
            offence: 0,
            defence: 0,
            dna: 0,
            playertype: 0,
            ageoutTimestamp: 100000000000,
            draftTimestamp: 0,
            equippedJersey: 0,
            equippedStick: 0,
            equippedToken: 0,
            isDefence: false,
            isGoalie: false,
            isOffence: false,
            mainColor: 0,
            position: 0,
            teamId: 0
            }
        }
        
        if (p5ID > 0){
            console.log("looking up POS 5 player: " + p5ID)
            p5Details = await getSinglePlayerData(p5ID).then(res => {
                console.log(res)
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p5ID == 0 || p5ID == ""){
            console.log("POS 5 Player not found")
            p5Details = {
            id: "",
            offence: 0,
            defence: 0,
            dna: 0,
            playertype: 0,
            ageoutTimestamp: 100000000000,
            draftTimestamp: 0,
            equippedJersey: 0,
            equippedStick: 0,
            equippedToken: 0,
            isDefence: false,
            isGoalie: false,
            isOffence: false,
            mainColor: 0,
            position: 0,
            teamId: 0
            }
        }
        
        if (p6ID > 0){
            console.log("looking up POS 6 player: " + p6ID)
            p6Details = await getSinglePlayerData(p6ID).then(res => {
                console.log(res)
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p6ID == 0 || p6ID == ""){
            console.log("POS 6 Player not found")
            p6Details = {
            id: "",
            offence: 0,
            defence: 0,
            dna: 0,
            playertype: 0,
            ageoutTimestamp: 100000000000,
            draftTimestamp: 0,
            equippedJersey: 0,
            equippedStick: 0,
            equippedToken: 0,
            isDefence: false,
            isGoalie: false,
            isOffence: false,
            mainColor: 0,
            position: 0,
            teamId: 0
            }
        }

  
        console.log(teamOP + " " + teamDP)

        // const web3 = await Moralis.enableWeb3()
        // let contractInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
        // let PvCTimeouts = await contractInstance.methods.getTimeOuts().call({from: ethereum.selectedAddress})
        let teamObj = {
            teamIndex: 0, 
            teamId: teams[0].id,
            teamDna: teams[0].attributes.teamDNA,
            teamTotalOP: teamOP,
            teamTotalDP: teamDP,  
            activeTimestamp1: teams[0].attributes.activeTimestamp1,
            activeTimestamp2: teams[0].attributes.activeTimestamp2,
            activeTimestamp3: teams[0].attributes.activeTimestamp3,
            lastMatchWon1: teams[0].attributes.lastMatchWon1,
            lastMatchWon2: teams[0].attributes.lastMatchWon2,
            lastMatchWon3: teams[0].attributes.lastMatchWon3,
            ownerAddress: teams[0].attributes.ownerAddress,
            p1: p1Details,
            p2: p2Details,
            p3: p3Details,
            p4: p4Details,
            p5: p5Details,
            p6: p6Details,
            
          }
        console.log(teamObj)

        return teamObj
    }else if(teams.length == 0){
        console.log("No Team Found")
        return false
    }


    // const minter = ethereum.selectedAddress
    // const web3 = await Moralis.enableWeb3()
    // let teamInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
    // let teamArray = await teamInstance.methods.getAllTokensForUser(minter).call({from: minter})
    // if (teamArray.length == 0) {
    //     console.log("No Teams Found")
    //     return
    //     } 

    // console.log("Team Array: " + teamArray)
    // console.log(teamArray)
    //   const teamdata = teamArray.map(async (teamIndex) => {
    //     let details = await teamInstance.methods.getTokenDetails(teamIndex).call({from: ethereum.selectedAddress})
    //       return {
    //       teamIndex: teamIndex, 
    //       teamId: details.teamId,
    //       teamDna: details.teamDna,
    //       teamTotalOP: details.teamTotalOP,
    //       teamTotalDP: details.teamTotalDP,  
    //       activeTimestamp1: details.activeTimestamp1,
    //       activeTimestamp2: details.activeTimestamp2,
    //       activeTimestamp3: details.activeTimestamp3,
    //       lastMatchWon1: details.lastMatchWon1,
    //       lastMatchWon2: details.lastMatchWon2,
    //       lastMatchWon3: details.lastMatchWon3,
    //       ownerAddress: details.ownerAddress
          
    //       }
    //     }).sort((a, b) => b.count - a.count)
    //     return teamdata
}

async function getTeamFromMoralis(){
    const query = new Moralis.Query("PBTeams")
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const teams = await query.find()
    if(teams.length >= 1){
        console.log("Team Found")
        return true
    }else if(teams.length == 0){
        console.log("No Team Found")
        return false
    }
}

async function mintNewTeamMoralis(value){

    const puckBuddiesTeam = Moralis.Object.extend("PBTeams")
    const pbTeams = new puckBuddiesTeam()
    const query = new Moralis.Query("PBTeams")
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const teams = await query.find()
    if(teams.length >= 1){
        console.log("Team Found")
        return
    }
    let playerIds 
    await buySixPackofCards(value).then(res => {
        console.log(res.events.sixPackPlayer.returnValues)
        playerIds = res.events.sixPackPlayer.returnValues
    }).catch(err => {
        console.log(err)
        return
    })
    console.log(playerIds)
    let dnaLength = 16
    let random_integer = Math.random()*101|0
    let rand = web3.utils.soliditySha3(ethereum.selectedAddress, Date.now(), random_integer) 
    let dna = rand % 10 ** dnaLength
    let digitFix = dnaLength - dna.toString().length 
    for(let i=0; i < digitFix; i++){
        dna = dna * 10
    }
    
    pbTeams.set('ownerAddress', ethereum.selectedAddress)
    pbTeams.set('teamDNA', dna)
    pbTeams.set('p1', playerIds[0])
    pbTeams.set('p2', playerIds[1])
    pbTeams.set('p3', playerIds[2])
    pbTeams.set('p4', playerIds[3])
    pbTeams.set('p5', playerIds[4])
    pbTeams.set('p6', playerIds[5])
    pbTeams.set('user', Moralis.User.current())
    pbTeams.set('activeTimestamp1', 0)
    pbTeams.set('activeTimestamp2', 0)
    pbTeams.set('activeTimestamp3', 0)
    pbTeams.set('lastMatchWon1', false)
    pbTeams.set('lastMatchWon2', false)
    pbTeams.set('lastMatchWon3', false)
    await pbTeams.save()
    return teams
}

async function buySixPackofCards(value){
    let approved = false
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let costtodraft = web3.utils.toWei(value)
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
    await buddiesInstance.methods.approve(PBTeamsAddress, costtodraft).send({from: minter, gas: 72000}).on("receipt", ( () => {
        approved = true
    }))
    .catch(err => {
        console.log(err)
    })
    if(approved == true){
        console.log("Approved Buddies Spend")
        approved = false
        let teamInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
        let playerIds = await teamInstance.methods.mintSixPack(costtodraft).send({from: minter, gas: 2100000}).on("receipt", ((receipt) =>{
            // console.log(receipt)
            // console.log(receipt.events.sixPackPlayer.returnValues)
            // playerIds = receipt.events.sixPackPlayer.returnValues
            
        }))
        return playerIds
    }else{
        approved = false
        return 'Error'
    }
}

async function mintNewTeam(value){



    let approved = false
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let costtodraft = web3.utils.toWei(value)
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
    await buddiesInstance.methods.approve(PBTeamsAddress, costtodraft).send({from: minter, gas: 72000}).on("receipt", ( () => {
        approved = true
    }))
    .catch(err => {
        console.log(err)
    })
    if(approved == true){
        approved = false
        let teamInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
        await teamInstance.methods.mintTeam(costtodraft).send({from: minter, gas: 2100000}).on("receipt", ((receipt) =>{
            console.log(receipt)
            return receipt
    }))
    }else{
        approved = false
        return 'Error'
    }
}

// async function mintTeam(){
//     const minter = ethereum.selectedAddress
//     const web3 = await Moralis.enableWeb3()
//     let teamInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
//     await teamInstance.methods.mintTeam().send({from: minter, gas: 2048000}).on("receipt", ((receipt) => {
//         console.log(receipt)
//         return res
//     }))
// }
// async function checkIfTeam(){
//     window.web3 = await Moralis.enableWeb3()
//     const teamContract = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
//     let checkTeam = await teamContract.methods.balanceOf(ethereum.selectedAddress).call({from: ethereum.selectedAddress})
//     if (checkTeam == 0 ){
//         return false
//     } else if (checkTeam >= 1){
//         return true
//     }
// }

async function getTeamMintCost(){
    window.web3 = await Moralis.enableWeb3()
    const teamContract = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
    let teamMintCost = await teamContract.methods.getTeamMintCost().call({from: ethereum.selectedAddress})
    console.log(teamMintCost)
    let mintTeamValue = web3.utils.fromWei(teamMintCost)
    return mintTeamValue
}

async function assignToPosition(posID, playerId){
    const puckBuddiesTeam = Moralis.Object.extend("PBTeams")
    // const pbTeams = new puckBuddiesTeam()
    const query = new Moralis.Query(puckBuddiesTeam)
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const results = await query.find();
    console.log(results[0].id)
    
    query.get(results[0].id).then((puckBuddiesTeam) =>{
        console.log("Team Found")
        if(posID == 1){
            puckBuddiesTeam.set('p1', playerId)
        }else if(posID == 2){
            puckBuddiesTeam.set('p2', playerId)
        }else if(posID == 3){
            puckBuddiesTeam.set('p3', playerId)
        }else if(posID == 4){
            puckBuddiesTeam.set('p4', playerId)
        }else if(posID == 5){
            puckBuddiesTeam.set('p5', playerId)
        }else if(posID == 6){
            puckBuddiesTeam.set('p6', playerId)
        }
        return puckBuddiesTeam.save()
        
    }).catch( (error) => {
        console.log(error)
    })

    // const sender = ethereum.selectedAddress
    // const web3 = await Moralis.enableWeb3()
    // const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    // console.log("Sending this TeamId: " + teamId)
    // let receipt = await playerContract.methods.assignToTeam(teamId, position, playerId, teamDna).send({from: sender, gas: 512000})
    //     console.log("Here is the receipt: " + receipt)
    //     return (receipt)
}

async function doubleCheckIfPlayer(posID){
    const puckBuddiesTeam = Moralis.Object.extend("PBTeams")
    const query = new Moralis.Query(puckBuddiesTeam)
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const results = await query.find();
    console.log(results[0])
    console.log(results[0].attributes.p1)
    
    if(posID == 1){
        if(results[0].attributes.p1 != ""){
            return true
        }else{
            return false
        }
    }

    if(posID == 2){
        if(results[0].attributes.p2 != ""){
            return true
        }else{
            return false
        }
    }

    if(posID == 3){
        if(results[0].attributes.p3 != ""){
            return true
        }else{
            return false
        }
    }

    if(posID == 4){
        if(results[0].attributes.p4 != ""){
            return true
        }else{
            return false
        }
    }

    if(posID == 5){
        if(results[0].attributes.p5 != ""){
            return true
        }else{
            return false
        }
    }

    if(posID == 6){
        if(results[0].attributes.p6 != ""){
            return true
        }else{
            return false
        }
    }
  

}

// async function removeFromPosition(teamId, playerId){
//     const sender = ethereum.selectedAddress
//     const web3 = await Moralis.enableWeb3()
//     const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
//     console.log("Sending this TeamId: " + teamId)
//     console.log("Sending this PlayerId: " + playerId)
//     await playerContract.methods.removeFromTeam(teamId, playerId).send({from: sender, gas: 1512000}).on("receipt", (receipt) => {
//         console.log("Here is the receipt: " + receipt)
//         return (receipt)
//     }).catch(err =>{
//         console.log(err)
//     })
        
// }

async function removeFromPosition(posID){
    const puckBuddiesTeam = Moralis.Object.extend("PBTeams")
    // const pbTeams = new puckBuddiesTeam()
    const query = new Moralis.Query(puckBuddiesTeam)
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const results = await query.find();
    console.log(results[0].id)
    
    query.get(results[0].id).then((puckBuddiesTeam) =>{
        console.log("Team Found")
        if(posID == 1){
            puckBuddiesTeam.set('p1', "")
        }else if(posID == 2){
            puckBuddiesTeam.set('p2', "")
        }else if(posID == 3){
            puckBuddiesTeam.set('p3', "")
        }else if(posID == 4){
            puckBuddiesTeam.set('p4', "")
        }else if(posID == 5){
            puckBuddiesTeam.set('p5', "")
        }else if(posID == 6){
            puckBuddiesTeam.set('p6', "")
        }
        return puckBuddiesTeam.save()
        
    }).catch( (error) => {
        console.log(error)
    })
  
}



async function getCityNames(){
    return CITIES
    }
async function getNounNames(){
    return NOUNS
    }


//Team v Computer Functions


async function getPvCMatchupsTimestamp(){
    const caller = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()    
    let teamInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    let teamTimeStamp = await teamInstance.methods.getPvCMatchupsTimestamp().call({from: caller})
    return teamTimeStamp
}

async function maralisRunPvC(_playerIdArray, _pageTeamId, _difficulty){
let param = {difficulty: _difficulty, 
            pvcHelperABI: PBPVCHELPER.abi, 
            pvcHelperAddress: PBPvCHelperAddress, 
            pvcMatchupsABI: PBPVCMATCHUPS.abi, 
            pvcMatchupsAddress: PBPvCMatchupsAddress,
            selectedAddress: ethereum.selectedAddress,
            pvcMatchupsValidationABI : PBMATCHUPSVALIDATION.abi,
            pcvMatchupsValidationAddress: PBMatchupValidationAddress,
            teamID: _pageTeamId,
            playerIDs: _playerIdArray,
            teamsAddress: PBTeamsAddress,
            teamsABI: PBTEAMS.abi,

        }
const moralisRes = await Moralis.Cloud.run("playPvCMatchup", param)
console.log(moralisRes)
console.log("Final: " + moralisRes.t1Score + " " + moralisRes.t2Score + " Regulation: " + moralisRes.t1RegScore + " " + moralisRes.t2RegScore + " Overtime: " + moralisRes.t1OTScore + " " + moralisRes.t2OTScore + " Shootout: " + moralisRes.t1SOScore + " " + moralisRes.t2SOScore)
return {gameObj: moralisRes.gameObj, 
        gameOverTimeObj: moralisRes.gameOverTimeObj, 
        gameShootoutObj: moralisRes.gameShootoutObj, 
        t1RegScore:moralisRes.t1RegScore, 
        t2RegScore:moralisRes.t2RegScore,
        t1SOScore:moralisRes.t1SOScore, 
        t2SOScore:moralisRes.t2SOScore,
        t1SOScore:moralisRes.t1SOScore, 
        t2SOScore:moralisRes.t2SOScore,
        finalScore1:moralisRes.t1Score, 
        finalScore2:moralisRes.t2Score, 
        matchValidToken: moralisRes.matchValidToken }
}

function encode(string) {
    var number = "0x";
    var length = string.length;
    for (var i = 0; i < length; i++)
        number += string.charCodeAt(i).toString(16);
    return number;
}

async function loadPvCmatches(teamId){
    let teamIdFix = encode(teamId) 
    console.log(teamIdFix)
    const caller = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let pvcMatchupsHelperInstance = new web3.eth.Contract(PBPVCHELPER.abi, PBPvCHelperAddress)
    let pvcMatchhupsInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    let difficultyMod = await pvcMatchhupsInstance.methods.getDifficultyMod().call({from: caller})

    let opStat1 = await pvcMatchupsHelperInstance.methods.generateRandomStat(difficultyMod, 1, 1).call({from: caller})
    //console.log(opStat1)
    let dpStat1 = await pvcMatchupsHelperInstance.methods.generateRandomStat(difficultyMod, 1, 2).call({from: caller})
    //console.log(dpStat1)
    let opStat2 = await pvcMatchupsHelperInstance.methods.generateRandomStat((difficultyMod * 1.5), 2, 1).call({from: caller})
    //console.log(opStat2)
    let dpStat2 = await pvcMatchupsHelperInstance.methods.generateRandomStat((difficultyMod * 1.5), 2, 2).call({from: caller})
    //console.log(dpStat2)
    let opStat3 = await pvcMatchupsHelperInstance.methods.generateRandomStat((difficultyMod * 2), 3, 1).call({from: caller})
    //console.log(opStat3)
    let dpStat3 = await pvcMatchupsHelperInstance.methods.generateRandomStat((difficultyMod * 2), 3, 2).call({from: caller})
    //console.log(dpStat3)
    
    let team1DNA = await pvcMatchhupsInstance.methods.generateRandomTeamDNA(1, 1, teamIdFix).call({from: caller})
    //console.log(team1DNA)
    let team2DNA = await pvcMatchhupsInstance.methods.generateRandomTeamDNA(2, 2, teamIdFix).call({from: caller})
    //console.log(team2DNA)
    let team3DNA = await pvcMatchhupsInstance.methods.generateRandomTeamDNA(3, 3, teamIdFix).call({from: caller})
    //console.log(team3DNA)

    let timeouts = await pvcMatchhupsInstance.methods.getTimeOuts(teamIdFix).call({from: caller})
        console.log(timeouts)
        
    let matchUpNos = await pvcMatchhupsInstance.methods.getNoMatchups(teamIdFix).call({from: caller})
        console.log(matchUpNos)

    let to1 = timeouts[0]
    let to2 = timeouts[1]
    let to3 = timeouts[2]
    let won1 = timeouts[3]
    let won2 = timeouts[4]
    let won3 = timeouts[5]
    let actv1 = timeouts[6]
    let actv2 = timeouts[7]
    let actv3 = timeouts[8]
    let muNo1 = matchUpNos[0]
    let muNo2 = matchUpNos[1]
    let muNo3 = matchUpNos[2]

    let team1CityStarter = parseInt(team1DNA.slice(1,4))
    let team1CityNumber = Math.floor((team1CityStarter/1000) * 529)
    let team1NounNumber = parseInt(team1DNA.slice(5,8))

    let team2CityStarter = parseInt(team2DNA.slice(1,4))
    let team2CityNumber = Math.floor((team2CityStarter/1000) * 529)
    let team2NounNumber = parseInt(team2DNA.slice(5,8))

    let team3CityStarter = parseInt(team3DNA.slice(1,4))
    let team3CityNumber = Math.floor((team3CityStarter/1000) * 529)
    let team3NounNumber = parseInt(team3DNA.slice(5,8))

   
    let availablePvCobject = ({
        'opStat1': opStat1,
        'dpStat1': dpStat1,
        'opStat2': opStat2,
        'dpStat2': dpStat2,
        'opStat3': opStat3,
        'dpStat3': dpStat3,
        'team1CityNumber': team1CityNumber,
        'team1NounNumber': team1NounNumber,
        'team2CityNumber': team2CityNumber,
        'team2NounNumber': team2NounNumber,
        'team3CityNumber': team3CityNumber,
        'team3NounNumber': team3NounNumber,
        'to1': to1,
        'to2': to2,
        'to3': to3,
        'won1': won1,
        'won2': won2,
        'won3': won3,
        'actv1': actv1,
        'actv2': actv2,
        'actv3': actv3,
        'muNo1': muNo1,
        'muNo2': muNo2,
        'muNo3': muNo3,
    })
    //console.log(availablePvCobject)
    return availablePvCobject
}

async function performPvC(token, difficulty, teamId, t1S, t2S){
    let teamIdFix = encode(teamId) 
    console.log(teamIdFix)
    console.log({token:token, difficulty:difficulty, teamId:teamIdFix, t1S:t1S, t2S:t2S})
    const sender = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()  
    let pvcMatchhupsInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    console.log("Sending PvC Matchup to Blockchain")
    let matchUpIndex = await pvcMatchhupsInstance.methods.rewardMatchup(token, difficulty, teamIdFix, t1S, t2S).send({from: sender, gas: 102400})
    return(matchUpIndex) 
}

async function hitTheIcePvC(difficulty, teamIdFix, playerIds){
    console.log(playerIds)
    const sender = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()  
    let pvcMatchhupsInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    
    await pvcMatchhupsInstance.methods.hitTheIcePvC(difficulty, teamIdFix, playerIds).send({from: sender, gas: 222000}).then(res => {
        // let gameResult = receipt.events.gamePlayed.returnValues.isWinner
        // console.log(receipt.events.gamePlayed.returnValues)
        // console.log("Is Winner: " + gameResult)
        
        console.log(res)
        console.log("IsWinner: " + res.events.gamePlayed.returnValues[0])
        console.log("to1: " + res.events.gamePlayed.returnValues[1])
        console.log("to2: " + res.events.gamePlayed.returnValues[2])
        console.log("to3: " + res.events.gamePlayed.returnValues[3])
        let resultOb = ({'isWinner': res.events.gamePlayed.returnValues[0], 
                        'to1': res.events.gamePlayed.returnValues[1], 
                        'to2': res.events.gamePlayed.returnValues[2], 
                        'to3': res.events.gamePlayed.returnValues[3]})
        return resultOb        
    }).catch(err => {
        console.log(err)
    })  
}


// async function hitTheIcePvC(difficulty, teamId){
//     const sender = ethereum.selectedAddress
//     const web3 = await Moralis.enableWeb3()  
//     let pvcMatchhupsInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)

//     await pvcMatchhupsInstance.methods.hitTheIcePvC(difficulty, teamId).send({from: sender, gas: 1512000}).on("receipt", ( (receipt) => {
//         let gameResult = receipt.events.gamePlayed.returnValues.isWinner
//         console.log(receipt.events.gamePlayed.returnValues)
//         console.log("Is Winner: " + gameResult)
//         let resultOb = ({'isWinner': receipt.events.gamePlayed.returnValues.isWinner, 
//                         'to1': receipt.events.gamePlayed.returnValues.to1, 
//                         'to2': receipt.events.gamePlayed.returnValues.to2, 
//                         'to3': receipt.events.gamePlayed.returnValues.to3})
//         console.log(resultOb)
//         return resultOb        
//     })).catch(err => {
//         console.log(err)
//     })  
// }

//Matchup Functions

async function createMatchup(teamId, buddiesReward){
    let buddiesRewardWei = web3.utils.toWei(buddiesReward.toString())
    const sender = ethereum.selectedAddress
    let approved = false;
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)    
    await buddiesInstance.methods.approve(PBMatchupsAddress, buddiesRewardWei).send({from: sender, gas: 72000}).on("receipt", ( () => {
        console.log("Buddies Spend by Matchups Contract Address Approved")
        approved = true
    }))
    .catch(err => {
        console.log("Error trying to make Approval for Buddies Spend by Matchups Contract: " + err)
        console.log(err)
        approved = false
    })  
    if(approved == true){
        let matchupsContractInstance = new web3.eth.Contract(PBMATCHUPS.abi, PBMatchupsAddress)
        await matchupsContractInstance.methods.createMatchup(teamId, buddiesRewardWei).send({from: sender, gas: 512000}).on("receipt", ((receipt) =>{
            console.log(receipt)
            approved = false
        }))
        .catch(err => {
            console.log(err)
            approved = false
        })
    }
}

async function getAvailableMatcheups(){
    const sender = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let matchupsContractInstance = new web3.eth.Contract(PBMATCHUPS.abi, PBMatchupsAddress)
    let matchupsArray = await matchupsContractInstance.methods.getAllTokensForUser(PBMatchupsMarketAddress).call({from: sender})
    if (matchupsArray.length == 0){
        let emptyArray = []
        console.log("No Matchups Found")
        return emptyArray
    }else{
        const matchupsData = matchupsArray.map(async (matchupId) => {
            let details = await matchupsContractInstance.methods.getTokenDetails(matchupId).call({from: sender})
            console.log(details)
            let buddiesAmountFromWei = web3.utils.fromWei(details.buddiesAmount)
            return {
                matchupId: details.matchId,
                t1OStats: details.t1OStats,
                t1DStats: details.t1DStats,
                t2OStats: details.t2OStats,
                t2DStats: details.t2DStats,
                teamDna: details.teamDna,
                teamId: details.teamId,
                buddiesAmount: buddiesAmountFromWei,
                timestamp: details.timestamp,
                challenger: details.challenger,
                creator: details.creator,
                creatorIsWinner: details.creatorIsWinner,
                active: details.active
            }
              }).sort((a, b) => b.count - a.count)
              return matchupsData
            }
}

async function hitTheIcePvP(reward, pvpmatchupId, chalTeamId) { 
        let buddiesRewardWei = web3.utils.toWei(reward.toString())
        console.log(buddiesRewardWei)
        const sender = ethereum.selectedAddress
        let matchupsContractInstance = new web3.eth.Contract(PBMATCHUPS.abi, PBMatchupsAddress)
        let approved = false;
        let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)    
        await buddiesInstance.methods.approve(PBMatchupsAddress, buddiesRewardWei).send({from: sender, gas: 72000}).on("receipt", ( () => {
            console.log("Buddies Spend by Matchups Contract Address Approved")
            approved = true
        }))
        .catch(err => {
            console.log("Error trying to make Approval for Buddies Spend by Matchups Contract: " + err)
            console.log(err)
            approved = false
        })  
        if(approved == true){
        await matchupsContractInstance.methods.PvPHitTheIce(buddiesRewardWei, pvpmatchupId, chalTeamId).send({from: sender, gas: 512000}).on("receipt", ((receipt) =>{
            console.log(receipt)
        }))
        .catch(err => {
            console.log(err)
        })
    }
}

async function cancelMatchup(matchId){
    const sender = ethereum.selectedAddress
    let matchupsContractInstance = new web3.eth.Contract(PBMATCHUPS.abi, PBMatchupsAddress)
    await matchupsContractInstance.methods.cancelMatchup(matchId).send({from: sender, gas: 72000}).on("receipt", ( () => {
        console.log("Successfully Cancelled Matchup")

    }))
    .catch(err => {
        console.log("Error trying to cancel Matchup: " + err)
        console.log(err)
    })  
}



//Market Functions
  async function buyMarketPlayer(_itemId, _sellPrice, _fee) {
        const minter = ethereum.selectedAddress
        let approved = false
        const web3 = await Moralis.enableWeb3()
        let marketInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
        let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
        let sellPriceWei = web3.utils.toWei(_sellPrice.toString())
        let feeWei = web3.utils.toWei(_fee.toString())
        let totalPriceWei = sellPriceWei + feeWei
        await buddiesInstance.methods.approve(pbMarketplaceAddress, totalPriceWei).send({from: minter, gas: 72000}).on("receipt", ( () => {
            console.log("Buddies Spend by Market Contract Address Approved")
            approved = true
        }))
        .catch(err => {
            console.log("Error trying to make Approval for Buddies Spend by Market Contract: " + err)
            console.log(err)
        })
        if(approved == true){
            approved = false
            let transaction = await marketInstance.methods.createMarketSale(pbPlayersAddress,_itemId,sellPriceWei,feeWei).send({from: ethereum.selectedAddress, gas: 2100000}).on("receipt", ( () => {
                console.log("Purchase from Market Complete")
                return transaction
            }))
            .catch(err => {
                approved = false
                console.log("Error trying to make Market Purchase: " + err)
                console.log(err)
            })
        }else{
            approved = false
            return
        }

  }

  async function sendPlayerToMarket(id, sellerprice, fee){
        let approved = false
        const web3 = await Moralis.enableWeb3()
        const minter = ethereum.selectedAddress;
        let tokenId = id.toString()
        let sellerpriceWei = web3.utils.toWei(sellerprice.toString())
        let feeWei = web3.utils.toWei(fee.toString())
        const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
        await playerContract.methods.approve(pbMarketplaceAddress, id).send({from: minter, gas: 72000}).on("receipt", ( () => {
            console.log("Player Token Transfer to Market Approved")
            approved = true
        }))        
        .catch(err => {
            console.log("Error trying to get Approval for Player Token transfer to Market: " + err)
            console.log(err)
        })
        if(approved == true){
        let contractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)      
        await contractInstance.methods.createMarketItem(pbPlayersAddress, tokenId, sellerpriceWei, feeWei).send({from: minter, gas: 1024000}).on("receipt", ( () => {
            console.log("Send to Market Complete")
        }))
        .catch(err => {
            console.log("Error sending Player Token to Market: " + err)
            console.log(err)
        })
    }
    else{
        approved = false
        return
    }
  }

  async function getMarketPlayers(){
        const web3 = await Moralis.enableWeb3()
        let contractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress) 
        let marketPlayers = await contractInstance.methods.getMarketItems().call({from: ethereum.selectedAddress})
        console.log("Market PLayers from Contract")
        console.log(marketPlayers)
        return marketPlayers
  }

    async function cancelMarketSale(tokenId){
        const web3 = await Moralis.enableWeb3()
        let contractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
        await contractInstance.methods.cancelMarketSale(pbPlayersAddress, tokenId).send({from: ethereum.selectedAddress, gas: 2100000}).on("receipt", ( () => {
            console.log("Cancel Market Sale Complete")
        }))
        .catch((err) => {
            console.log(err)
        })
    }

  //Player Minting Functions

  async function mintNewOffence(){
    const type = "Offence"
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let approved = false
    let draftCost = await getDraftPrice()
    let costtodraft = web3.utils.toWei(draftCost.dv1)
    let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
    await buddiesInstance.methods.approve(pbPlayersAddress, costtodraft).send({from: minter, gas: 72000}).on("receipt", ( () => {
        console.log("Drafting " + type + " Approval Point")
        approved = true
    }))
    .catch(err => {
        console.log("Error trying to make " + type + " Draft Approval: " + err)
        console.log(err)
    })
    if(approved == true){
        approved = false
        let transaction = await contractInstance.methods.mintPlayer(costtodraft,1).send({from: minter, gas: 512000}).on("receipt", ( () => {
            console.log("Drafting "+ type + " Complete")
            return transaction
        }))
        .catch(err => {
            approved = false
            console.log("Error trying to Draft " + type + ": " + err)
            console.log(err)
        })
    }else{
        approved = false
        return
    }
  }

  async function mintNewDefence(){
    const type = "Defence"
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let approved = false
    let draftCost = await getDraftPrice()
    let costtodraft = web3.utils.toWei(draftCost.dv2)
    let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
    await buddiesInstance.methods.approve(pbPlayersAddress, costtodraft).send({from: minter, gas: 72000}).on("receipt", ( () => {
        console.log("Drafting " + type + " Approval Point")
        approved = true
    }))
    .catch(err => {
        console.log("Error trying to make " + type + " Draft Approval: " + err)
        console.log(err)
    })
    if(approved == true){
        approved = false
        let transaction = await contractInstance.methods.mintPlayer(costtodraft,2).send({from: minter, gas: 512000}).on("receipt", ( () => {
            console.log("Drafting "+ type + " Complete")
            return transaction
        }))
        .catch(err => {
            approved = false
            console.log("Error trying to Draft " + type + ": " + err)
            console.log(err)
        })
    }else{
        approved = false
        return
    }
  
  }

  async function mintNewGoalie(){
    const type = "Goalie"
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.enableWeb3()
    let approved = false
    let draftCost = await getDraftPrice()
    let costtodraft = web3.utils.toWei(draftCost.dv3)
    let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
    await buddiesInstance.methods.approve(pbPlayersAddress, costtodraft).send({from: minter, gas: 72000}).on("receipt", ( () => {
        console.log("Drafting " + type + " Approval Point")
        approved = true
    }))
    .catch(err => {
        console.log("Error trying to make " + type + " Draft Approval: " + err)
        console.log(err)
    })
    if(approved == true){
        approved = false
        let transaction = await contractInstance.methods.mintPlayer(costtodraft,3).send({from: minter, gas: 512000}).on("receipt", ( () => {
            console.log("Drafting "+ type + " Complete")
            return transaction
        }))
        .catch(err => {
            approved = false
            console.log("Error trying to Draft " + type + ": " + err)
            console.log(err)
        })
    }else{
        approved = false
        return
    }
  }

//   async function mintTeamPlayers(){
//     const minter = ethereum.selectedAddress
//     let approved = false
//     let draftCost = await getDraftPrice()
//     let costtodraft = web3.utils.toWei(draftCost.dv4)
//     let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
//     let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
//     await buddiesInstance.methods.approve(pbPlayersAddress, costtodraft).send({from: minter, gas: 72000}).on("receipt", ( () => {
//         console.log("Drafting " + type + " Approval Point")
//         approved = true
//     }))
//     .catch(err => {
//         console.log("Error trying to make " + type + " Draft Approval: " + err)
//         console.log(err)
//     })
//     if(approved == true){
//         approved = false
//         let transaction = await contractInstance.methods.mintTeamPlayers(costtodraft).send({from: minter, gas: 512000}).on("receipt", ( () => {
//             console.log("Drafting "+ type + " Complete")
//             return transaction
//         }))
//         .catch(err => {
//             approved = false
//             console.log("Error trying to Draft " + type + ": " + err)
//             console.log(err)
//         })
//     }else{
//         approved = false
//         return
//     }
//   }

  async function mintSuperStar(opScore, dpScore, dna, playerType){
    const minter = ethereum.selectedAddress
    let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    await contractInstance.methods.mintSuperstar(opScore, dpScore, dna, playerType).send({from: minter, gas: 512000}).on("receipt", ( () => {
        console.log("Drafting "+ type + " Complete")
        return transaction
    }))
    .catch(err => {
        approved = false
        console.log("Error trying to Draft " + type + ": " + err)
        console.log(err)
    })
  }



  //Coin Token Functions
    async function updateCoinBalance(){
    const web3 = await Moralis.enableWeb3()
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
    let balance = await buddiesInstance.methods.balanceOf(ethereum.selectedAddress).call({from: ethereum.selectedAddress})
    let buddiesBalance = web3.utils.fromWei(balance)
    let buds = parseFloat(buddiesBalance, 10)
    return buds
  }

  async function approveBuddyCoinSpend(address, value){
    let buddiesWei = web3.utils.toWei(value.toString())
    const sender = ethereum.selectedAddress
    let approved = false;
    let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)    
    await buddiesInstance.methods.approve(address, buddiesWei).send({from: sender, gas: 72000}).on("receipt", ( () => {
        console.log("Buddies Spend by Matchups Contract Address Approved")
        approved = true
    }))
    .catch(err => {
        console.log("Error trying to make Approval for Buddies Spend by Matchups Contract: " + err)
        console.log(err)
    })
    }
    
    async function checkBuddiesAllowance(address){
        const sender = ethereum.selectedAddress
        let buddiesInstance = new web3.eth.Contract(BUDDIES.abi, buddiesaddress)
        let balance = await buddiesInstance.methods.allowance(sender, address).call({from:sender})
        console.log(balance)
        return balance
    }

//PBXP Functions
async function newPBXPtoTeamContract(qty){
    const web3 = await Moralis.enableWeb3()
    let PBXPInstance = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    const sender = ethereum.selectedAddress
    await PBXPInstance.methods.newPBXPtoTeamContract(qty).send({from: sender, gas: 72000})
}

async function checkXPBalanceonTeamContract(){
    const web3 = await Moralis.enableWeb3()
    let PBXPInstance = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    const caller = ethereum.selectedAddress
    let balanceOfXP = await PBXPInstance.methods.balanceOf(PBTeamsAddress,0).call({from: caller})
    console.log(balanceOfXP)
    return balanceOfXP
}

async function updateXPBalance(){
    const web3 = await Moralis.enableWeb3()
    let PBXPInstance = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    const caller = ethereum.selectedAddress
    let balanceOfXP = await PBXPInstance.methods.balanceOf(caller,0).call({from: caller})
    console.log(balanceOfXP)
    return balanceOfXP
  }


export default {
    loadPBPlayers,
    loadPBPlayersMarket,
    mintNewOffence,
    mintNewDefence,
    mintNewGoalie,
    sendPlayerToMarket,
    buyMarketPlayer,
    getDraftPrice,
    checkPBPlayerAdmin,
    checkMarketAdmin,
    updateDraftPrice,
    updateCoinBalance,
    getMarketFeePercent,
    updateMarketFeePercent,
    getMarketFeePayableAddress,
    updateFeePayableAddress,
    getMarketplaceAddress,
    updateMarketplaceAddress,
    getMarketPlayers,
    getSinglePlayerData,
    cancelMarketSale,
    checkProShopAdmin,
    loadProshopItems,
    purchaseFromStore,
    loadMyEquipment,
    addStockToProShop,
    sendProShopAddress,
    burnStock,
    applyEquipmentToPlayer,
    removeProShopEquipment,
    displayTeam,
    assignToPosition,
    getCityNames,
    getNounNames,
    getTimestamp,
    hitTheIcePvP,
    createMatchup,
    mintSuperStar,
    approveBuddyCoinSpend,
    getAvailableMatcheups,
    removeFromPosition,
    loadPvCmatches,
    hitTheIcePvC,
    newPBXPtoTeamContract,
    checkBuddiesAllowance,
    checkXPBalanceonTeamContract,
    updateXPBalance,
    addStockToPBXPShop,
    burnPBXPStock,
    getPvCMatchupsTimestamp,
    cancelMatchup,
    loadProshopMarketItems,
    getProshopMarketFeePercent,
    createProShopMarketItem,
    createProShopMarketplaceSale,
    cancelProShopMarketplaceSale,
    increaseStats,
    getUpgradeCost,
    addBuddiesToMetaMask,
    getTeamMintCost,
    mintNewTeam,
    getBudsAddress,
    giftPlayer,
    giftItem,
    getBudsICOInfo,
    buyBuddies,
    getPvCadminInfo,
    updateVariables,
    updateBuddiesReward,
    updatePBXPReward,
    updateTimesOut,
    updateTeamMintCost,
    updateBudsPerBNB,
    maralisRunPvC,
    performPvC,
    getTeamFromMoralis,
    mintNewTeamMoralis,
    buySixPackofCards,
    doubleCheckIfPlayer
}






