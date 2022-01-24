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
        buddiesICOAddress,
        validatorAddress,
        testNetVersion
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
import VALIDATOR from '../public/assets/contracts/Validator.json'
import { ethers } from "ethers"

Moralis.initialize("1QCUjtu9KZhzIDE4ASFphZNnESsTFPPmyT5bsuxd") // Application id from moralis.io
Moralis.serverURL = "https://onhkokfjpssy.moralisweb3.com:2053/server"//Server url from moralis.io
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

async function myEthAddress(){
    const sender = await signer.getAddress()
    return sender
}

//Account Functions
Moralis.Web3.onAccountChanged(function(accounts) {
    console.log(accounts);
    location.reload();
});

if(typeof window.ethereum !== 'undefined') {
    //console.log('MetaMask is installed!')
    init();
}else{
    renderGetMetaMask()
}

async function init() {
    //console.log("Initializing...")
    try {
        let user = Moralis.User.current();
        //console.log(user)
        
        if(!user){
            //console.log("Moralis User Not Detected")
            createApp(Login).mount('#login')
            $("#login").show()
            $("#app").hide()
            $("#login_button").click( async () => {
                login()
            }
            )
        }else if(user){
            //console.log("Rendering game from previous login")
            renderGame()
        }        
     
    } catch (err) {
        //console.log("Error Trying to Log In")
        //console.log(err);
    }
}

async function renderGetMetaMask(){
    //console.log("Begin Render Get Meta Mask...")
    $("#login").hide()
    $("#app").hide()
    createApp(MetaMask).mount('#metamask')
    $("#metamask-button").click( async () => {
        //console.log("Metamask Button Cicked")
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
    //console.log("logged in user:", user);
    renderGame()
    location.reload();
  }

async function logOut() {
    await Moralis.User.logOut();
    //console.log("logged out");
    let user = Moralis.User.current();
    //console.log(user)
    if(!user){
        //console.log("Hide App")
        $("#app").hide()
        //console.log("Show Login Info")
        $("#login").show()
        location.reload();
    }
  }

async function renderGame(){
    //console.log("Begin Render Game...")
    createApp(App).use(router).mount('#app')
    $("#login").hide()
    $("#player_row").html("")
    $("#app").show()
    $("#disconnect-button").click( async () => {
        logOut()
        location.reload();
    })
}

//ICO Functions
async function getBudsICOInfo(){
    let ICOcontractInstance = new ethers.Contract(buddiesICOAddress, BUDDIESICO.abi, provider)
    let budsPerBNB = await ICOcontractInstance.getBudsPerBNB()
    let budsSoldWei = await ICOcontractInstance.getBudsSold()
    let budsBalanceWei = await ICOcontractInstance.getBudsBalance()
    let budsSold =  ethers.utils.formatUnits(budsSoldWei, 18)
    let budsBalance = ethers.utils.formatUnits(budsBalanceWei, 18)
    let obj = {budsPerBNB: budsPerBNB, budsSold: budsSold, budsBalance: budsBalance}
    return obj
}

async function buyBuddies(_value) {
    const options = {value: ethers.utils.parseEther(_value.toString())}
    const ICOcontractInstance = new ethers.Contract(buddiesICOAddress, BUDDIESICO.abi, signer)
    const reciept = await ICOcontractInstance.buyBuddies(options)
    console.log("BUDS Receipt")
    console.log(reciept)
    return
}

//NavBar Admin Button

async function addBuddiesToMetaMask(){
    const tokenAddress = buddiesaddress
    const tokenSymbol = "BUDDIES"
    const tokenDecimals = 18
    const tokenImage = 'https://i.imgur.com/SFJMgjd.png'

    try {
        const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', 
            options: {
              address: tokenAddress, 
              symbol: tokenSymbol,
              decimals: tokenDecimals, 
              image: tokenImage,
            },
          },
        });
      
        if (wasAdded) {
          
        } else {
          
        }
      } catch (err) {
        console.log(err)
      }
}

async function getBudsAddress(){
    return buddiesaddress
}

//Admin Modal Functions

async function getPvCadminInfo(){
    const sender = await signer.getAddress()
    const web3 = await Moralis.enableWeb3()
    let buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
    let contractInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, signer)
    let PvCAddress = await contractInstance.getPBPvCMatchupsAddress()
    let PvCDifficultyMod = await contractInstance.getDifficultyMod()
    let PvCBuddiesRewards = await contractInstance.getBuddiesReward()
    let PvCPBXPReward = await contractInstance.getPBXPReward()
    let PvCTimeouts = await contractInstance.getTimeOuts()
    let PvCBuddies = await contractInstance.getBudsBalance()
    let PvCBNB = await contractInstance.getBNBBalance()

    let playersContractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let pbPlayersAddressFromContract = await playersContractInstance.getPBPlayersAddress()
    let mintingCosts = await playersContractInstance.getMintingCosts()
    let playerNextId = await playersContractInstance.getNextId()
    let playerBuds = await playersContractInstance.getBudsBalance()
    let playerBNB = await playersContractInstance.getBNBBalance()
    let currentEdition = await playersContractInstance.getCurrentEdition()

    let proshopContractInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
    let pbProshopFactoryAddress = await proshopContractInstance.getPBProShopFactoryAddress()
    let pbProshopFactoryStats = await proshopContractInstance.getProShopStats()
    let pbProshopFactoryBuddies = await proshopContractInstance.getBudsBalance()
    let pbProshopFactoryBNB = await proshopContractInstance.getBNBBalance()

    let proshopHolderContractInstance = new ethers.Contract(pbProShopHolderAddress, PBPROSHOPHOLDER.abi, signer)
    let proshopHolderItemsSold = await proshopHolderContractInstance.getItemsSold()
    let proshopHolderAddress = await proshopHolderContractInstance.getPBProShopHolderAddress()
    let proshopHolderBNB = await proshopHolderContractInstance.getBNBBalance()

    let proshopMarketplaceContractInstance = new ethers.Contract(pbProShopMarketplaceAddress, PBPROSHOPMARKETPLACE.abi, signer)
    let proshopMarketplaceAddress = await proshopMarketplaceContractInstance.getPBProShopMarketplaceAddress()
    let proshopMarketplaceMarketFee = await proshopMarketplaceContractInstance.getProshopMarketFeePercent()
    let proshopMarketplaceFeesAddress = await proshopMarketplaceContractInstance.getMarketFeePayableAddress()
    let proshopFeesBuddiesBalance = await buddiesInstance.balanceOf(proshopMarketplaceFeesAddress)
    let proshopMarketplaceStats = await proshopMarketplaceContractInstance.getMarketplaceStats()
    let proshopMarketplaceBNB = await proshopMarketplaceContractInstance.getBNBBalance()
    let proshopMarketplaceBuddies = await proshopMarketplaceContractInstance.getBudsBalance()

    let pbTeamsContractInstance = new ethers.Contract(PBTeamsAddress, PBTEAMS.abi, signer)
    let pbTeamsAddress = await pbTeamsContractInstance.getPBTeamsAddress()
    let pbTeamsMintCost = await pbTeamsContractInstance.getTeamMintCost()
    let pbTeamsCount = 0
    let teamsBuddies = await pbTeamsContractInstance.getBudsBalance()
    let teamsBNB = await pbTeamsContractInstance.getBNBBalance()

    let pbPBXPContractInstance = new ethers.Contract(PBXPAddress, PBXP.abi, signer)
    let pbPBXPAddress = await pbPBXPContractInstance.getPBXPAddress()
    let pbPBXPUpgradeCost = await pbPBXPContractInstance.getUpgradeCost()
    let pbxpBuddies = await pbPBXPContractInstance.getBudsBalance()
    let pbxpBNB = await pbPBXPContractInstance.getBNBBalance()

    let icoContractInstance = new ethers.Contract(buddiesICOAddress, BUDDIESICO.abi, signer)
    let icoContractAddress = await icoContractInstance.getBuddiesICOAddress()
    let icoBuddiesPerBNB = await icoContractInstance.getBudsPerBNB()
    let icoBudsSold = await icoContractInstance.getBudsSold()
    let icoBudsBalance = await icoContractInstance.getBudsBalance()
    let icoBNBBalance = await icoContractInstance.getBNBBalance()

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
                PvCBNB: web3.utils.fromWei(PvCBNB),
                pbPlayersAddress: pbPlayersAddress, 
                mintCost0: web3.utils.fromWei(mintingCosts[0]),
                mintCost1: web3.utils.fromWei(mintingCosts[1]),
                mintCost2: web3.utils.fromWei(mintingCosts[2]),
                ageoutSeconds: mintingCosts[3],
                playerNextId: playerNextId,
                playerBuds: web3.utils.fromWei(playerBuds),
                playerBNB: web3.utils.fromWei(playerBNB),
                pbPlayersAddressFromContract: pbPlayersAddressFromContract,
                currentEdition: currentEdition,
                pbProshopFactoryAddress: pbProshopFactoryAddress,
                proshopItemsCreated: pbProshopFactoryStats,
                pbProshopFactoryBuddies: pbProshopFactoryBuddies,
                pbProshopFactoryBNB: pbProshopFactoryBNB,
                proshopHolderAddress: proshopHolderAddress,
                proshopHolderBNB: proshopHolderBNB,
                proshopItemsSold: proshopHolderItemsSold,
                proshopMarketplaceAddress: proshopMarketplaceAddress,
                proshopMarketplaceMarketFee: proshopMarketplaceMarketFee,
                proshopMarketplaceBNB: proshopMarketplaceBNB,
                proshopMarketplaceBuddies: proshopMarketplaceBuddies,
                proshopFeesBuddiesBalance: web3.utils.fromWei(proshopFeesBuddiesBalance),
                proshopMarketplaceFeesAddress: proshopMarketplaceFeesAddress,
                proshopMarketplaceTotalItems: proshopMarketplaceStats[0],
                proshopMarketplaceTotalComplete: proshopMarketplaceStats[1],
                pbTeamsAddress: pbTeamsAddress,
                pbTeamsMintCost: web3.utils.fromWei(pbTeamsMintCost),
                pbTeamsCount: pbTeamsCount,
                teamsBuddies: teamsBuddies,
                teamsBNB: teamsBNB,
                pbPBXPAddress: pbPBXPAddress,
                pbPBXPUpgradeCost: pbPBXPUpgradeCost,
                pbxpBuddies: pbxpBuddies,
                pbxpBNB: pbxpBNB,
                icoContractAddress: icoContractAddress,
                icoBuddiesPerBNB: icoBuddiesPerBNB,
                icoBudsSold: web3.utils.fromWei(icoBudsSold),
                icoBudsBalance: web3.utils.fromWei(icoBudsBalance),
                icoBNBBalance: web3.utils.fromWei(icoBNBBalance),
                }
    return obj
}

async function transferPBPlayersBUDS(amount){
    let contractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let valueWei =  ethers.utils.parseUnits(amount, 18)
    await contractInstance.transferBUDS(valueWei)
}

async function transferBUDS(to, amount){
    let contractInstance = new ethers.Contract(buddiesICOAddress, BUDDIESICO.abi, signer)
    await contractInstance.transferBUDS(to, amount)
}

async function transferBNB(to, amount){
    let contractInstance = new ethers.Contract(buddiesICOAddress, BUDDIESICO.abi, signer)
    let valueWei =  ethers.utils.parseUnits(amount, 18)
    await contractInstance.transferBNB(to, valueWei)
}

async function transferPvCBUDS(amount){
    let contractInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, signer)
    let valueWei =  ethers.utils.parseUnits(amount, 18)
    await contractInstance.transferBUDS(valueWei)
}

async function transferPvCBNB(amount){
    let contractInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, signer)
    let valueWei =  ethers.utils.parseUnits(amount, 18)
    await contractInstance.transferBNB(ethereum.selectedAddress, valueWei)
}

async function updateValidator(_w, _l){
    let contractInstance = new ethers.Contract(validatorAddress, VALIDATOR.abi, signer)
    await contractInstance.updateValidation(_w, _l)
}

async function updateVariables(_mintCost1, _mintCost2, _mintCost3, _ageoutSeconds){
    let contractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let m1 = ethers.utils.parseUnits(_mintCost1, 18)
    let m2 = ethers.utils.parseUnits(_mintCost2, 18)
    let m3 = ethers.utils.parseUnits(_mintCost3, 18)
    await contractInstance.updateVariables(m1, m2, m3,_ageoutSeconds)
}

async function updateBuddiesReward(_r0, _r1, _r2){
    let contractInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, signer)
    let r0 = ethers.utils.parseUnits(_r0, 18)
    let r1 = ethers.utils.parseUnits(_r1, 18)
    let r2 = ethers.utils.parseUnits(_r2, 18)
    let r = [r0, r1, r2]
    await contractInstance.updateBuddiesReward(r)
}

async function updateTimesOut(_to0, _to1, _to2){
    let contractInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, signer)
    let tos = [_to0, _to1, _to2]
    await contractInstance.updateTimesOut(tos)
}

async function updatePBXPReward(_xpr){
    let contractInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, signer)
    await contractInstance.updatePBXPReward(_xpr)
}

async function updateTeamMintCost(_value){
    let pbTeamsContractInstance = new ethers.Contract(PBTeamsAddress, PBTEAMS.abi, signer)
    let value = ethers.utils.parseUnits(_value, 18)
    await pbTeamsContractInstance.updateTeamMintCost(value)
}

async function updateBudsPerBNB(_icorate){
    let icoContractInstance = new ethers.Contract(buddiesICOAddress, BUDDIESICO.abi, signer)
    await icoContractInstance.updateBudsPerBNB(_icorate)
}

//Check Admin Functions
async function checkPBPlayerAdmin() {
    const contractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let adminCheck = await contractInstance.isAdmin()
    return adminCheck
  }

  async function checkMarketAdmin() {
    const sender = await signer.getAddress()
    const contractInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
    let adminCheck = await contractInstance.isAdmin()
    return adminCheck
  }

//PBP Admin Functions
async function getDraftPrice(){
    const playerContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let getDraft = await playerContract.getMintingCosts()
    //console.log(getDraft)
    let draftValue1 = ethers.utils.formatUnits(getDraft[0], 18)
    let draftValue2 = ethers.utils.formatUnits(getDraft[1], 18)
    let draftValue3 = ethers.utils.formatUnits(getDraft[2], 18)
    let resultsOb = {dv1: draftValue1, dv2: draftValue2, dv3: draftValue3}
    return resultsOb
}

async function updateDraftPrice(value){
    const playerContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let valueWei = ethers.utils.formatUnits(value, 18)
    await playerContract.updateMintingCost(valueWei)
}

async function getMarketplaceAddress(){
    const pbMarketContractInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
    let marketplaceAddress = await pbMarketContractInstance.getPBMarketplaceAddress()
    return marketplaceAddress
}

async function updateMarketplaceAddress(){
    const playerContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    await playerContract.updateMarketPlaceAddress(pbMarketplaceAddress)
    await playerContract.updateEquippedItemsAddress(equippeditemsaddress)
    await playerContract.updateProShopAddress(pbProShopFactoryAddress)
}

//Market ADMIN Functions
async function getMarketFeePercent(){
    const contractInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
    let getMarketPercentFee= await contractInstance.getMarketFeePercent()
    let fee = getMarketPercentFee/100
    return fee
}

async function updateMarketFeePercent(value){
    let sendValue = value * 100;
    const marketContract = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
    await marketContract.updateMarketFeePercent(sendValue)
}

async function getMarketFeePayableAddress(){
    const contractInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
    let getMarketFeePayableAddress = await contractInstance.getMarketFeePayableAddress()
    return getMarketFeePayableAddress
}

async function updateFeePayableAddress(newaddress){
    const marketContract = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
    await marketContract.updateFeePayableAddress(newaddress)
}

//Pro Shop Admin Functions
async function checkProShopAdmin() {
    const contractInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
    let adminCheck = await contractInstance.isAdmin()
    return adminCheck
  }

  async function loadProshopItems(_proShopItemAdmin,_proShopItems, _proShopActive){
        let proshopInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
        const qtys = await proshopInstance.balanceOfBatch(_proShopItemAdmin,_proShopItems)
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
            let proshopInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
            let senderAddressArray = []
            for (let i=0; i < _proShopItems.length; i++){
                senderAddressArray.push(ethereum.selectedAddress)
            }
            const qtys = await proshopInstance.balanceOfBatch(senderAddressArray,_proShopItems)
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
        let proshopMarketplaceInstance = new ethers.Contract(pbProShopMarketplaceAddress, PBPROSHOPMARKETPLACE.abi, signer)
        const proshopMarketplaceItems = await proshopMarketplaceInstance.getProShopMarketItems()
         return proshopMarketplaceItems
    }
    
    async function getProshopMarketFeePercent(){
        let proshopMarketplaceInstance = new ethers.Contract(pbProShopMarketplaceAddress, PBPROSHOPMARKETPLACE.abi, signer)
        let feepercent = await proshopMarketplaceInstance.getProshopMarketFeePercent()
        return feepercent
    }

    async function createProShopMarketItem(_tokenId, _sellPrice, _sellFee){
        let proshopInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
        let approveTransaction = await proshopInstance.setApprovalForAll(pbProShopMarketplaceAddress,true)
        let approveReceipt = await approveTransaction.wait()
        if(approveReceipt.events[0].event == "ApprovalForAll"){
            let value = _sellPrice + Number(_sellFee)
            console.log(value)
            let _totalprice = ethers.utils.parseUnits(value.toString(), 18)
            console.log(_totalprice)
            let proshopMarketplaceInstance = new ethers.Contract(pbProShopMarketplaceAddress, PBPROSHOPMARKETPLACE.abi, signer)
            await proshopMarketplaceInstance.createProShopMarketItem(_tokenId, _totalprice)
            return "Market Sale Created"
    }else{
        return "Market Sale Creation Failed"
    }
}

    async function createProShopMarketplaceSale(_marketListingId, _price) {
        let proShopMarketplaceContractInstance = new ethers.Contract(pbProShopMarketplaceAddress, PBPROSHOPMARKETPLACE.abi, signer)
        let buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
        let valueWei =_price.toString()
        
        let approval = await buddiesInstance.approve(pbProShopMarketplaceAddress, valueWei)
        let approveReceipt = await transaction.wait()
      
        if(approveReceipt.events[0].event == "Approval"){
            let transaction = await proShopMarketplaceContractInstance.createProShopMarketplaceSale(_marketListingId)
            return transaction
        }
    }

    async function cancelProShopMarketplaceSale(_marketListingId) {
        let proShopMarketplaceContractInstance = new ethers.Contract(pbProShopMarketplaceAddress, PBPROSHOPMARKETPLACE.abi, signer)
        await proShopMarketplaceContractInstance.cancelProShopMarketplaceSale(_marketListingId)
        return
    }    
    
    async function sendProShopAddress(){
        let proShopHolderInstance = new ethers.Contract(pbProShopHolderAddress, PBPROSHOPHOLDER.abi, signer)
        await proShopHolderInstance.updateProShopAddress(pbProShopFactoryAddress)
        let proShopFactoryInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
        await proShopFactoryInstance.updateProshopHolderAddress(pbProShopHolderAddress)
    }

//My Players Functions
async function loadPBPlayers(source){
    const sender = await signer.getAddress()
    const query = new Moralis.Query("PBTeams")
    console.log(query)
    query.equalTo('ownerAddress', sender.toLowerCase())
    const teams = await query.find()
    console.log(teams)
    console.log(teams[0])
    console.log(teams[0].attributes.teamDNA)
    console.log("Loading Players from: " + source)
    const tokenContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, provider)
    let result = await tokenContract.getAllTokensForUser(sender)
    let array = []
    for(var i=0;i<result.length;i++){
        array.push(result[i].toString());
    }
    console.log(array)
    let nounsArray = NOUNS
    let teamFirstLetter
    if (array.length == 0) {
        let emptyArray = []
      return emptyArray
      }
   
      
      
    const playerdata = array.map(async (playerId) => {
      let details = await tokenContract.getTokenDetails(playerId)
        if(teams[0].attributes.teamDNA == 0){
            teamFirstLetter = ''
        }else{
            
            let dnaInt = teams[0].attributes.teamDNA
            let dna = dnaInt.toString()
            console.log(dna)
            let teamNounNumber = parseInt(dna.slice(5,8))
            let teamName = nounsArray[teamNounNumber].noun
            teamFirstLetter = teamName.slice(0,1) 
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
    let myLetter = ""
    let playerPOS = 0
    let isOnTeam = false
    if(playerId == teams[0].attributes.p1){
        playerPOS = 1
        isOnTeam = true
        myLetter = teamFirstLetter
    }else if(playerId == teams[0].attributes.p2){
        playerPOS = 2
        isOnTeam = true
        myLetter = teamFirstLetter
    }else if(playerId == teams[0].attributes.p3){
        playerPOS = 3
        isOnTeam = true
        myLetter = teamFirstLetter
    }else if(playerId == teams[0].attributes.p4){
        playerPOS = 4
        isOnTeam = true
        myLetter = teamFirstLetter
    }else if(playerId == teams[0].attributes.p5){
        playerPOS = 5
        isOnTeam = true
        myLetter = teamFirstLetter
    }else if(playerId == teams[0].attributes.p6){
        playerPOS = 6
        isOnTeam = true
        myLetter = teamFirstLetter
    }

    let playercountry = await playerCountry(details.dna.toString())
    let playerAge = await getPlayerAge(details.ageoutTimestamp, details.draftTimestamp)

        return {
            id: playerId,
            offence: details.offence,
            defence: details.defence,
            dna: details.dna.toString(),
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
    threshold = threshold - 0

    total = 0;
    for (let i = 0; i < countries.length - 1; ++i) {
        total += countries[i][1]
        if (total >= threshold) {
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
    const tokenContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, provider)
    let details = await tokenContract.getTokenDetails(playerId)
        return {
          id: playerId,
          offence: details.offence.toNumber(),
          defence: details.defence.toNumber(),
          dna: details.dna.toString(),
          playertype: details.playertype.toNumber(),
          isOffence: details.isOffence,
          isDefence: details.isDefence,
          isGoalie: details.isGoalie,
          teamId: details.teamId,
          position: details.position,
          mainColor: details.mainColor.toNumber(),
          equippedJersey: details.equippedJersey.toNumber(),
          equippedStick: details.equippedStick,
          equippedToken: details.equippedToken.toNumber(),
          ageoutTimestamp: details.ageoutTimestamp.toNumber(),
          draftTimestamp: details.draftTimestamp.toNumber()           
        }    
}

async function getUpgradeCost() {
    const PBXPContract = new ethers.Contract(PBXPAddress, PBXP.abi, provider)
    let upgradeCost = await PBXPContract.getUpgradeCost()
    return upgradeCost
}

async function increaseStats(tokenId, statType, qty, xp) {
    const tokenContract = new ethers.Contract(PBXPAddress, PBXP.abi, signer)
    await tokenContract.increaseStats(tokenId, statType, qty, xp)
}

async function giftPlayer(tokenId, newOwner){
    const tokenContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let transaction = await tokenContract.giftPlayer(tokenId, newOwner)
    const transactionReceipt = await transaction.wait()
    console.log(transactionReceipt)
    return transactionReceipt
}

//PBPlayers Market Functions
async function loadPBPlayersMarket(){
    const marketContract = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
    const data = await marketContract.fetchMarketItems()
    if (data.length == 0) {
        return
    }
    const items = await Promise.all(data.map(async i => {
        const meta = await tokenContract.getTokenDetails(tokenId)
        const price = ethers.utils.parseUnits(i.price, 18)
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
    const proShopContractInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
    let timeStamp = await proShopContractInstance.getTimestamp()
    return timeStamp
}

async function addStockToProShop(sku, qty) {
    const proShopContractInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
    await proShopContractInstance.newProduct(sku, qty)
}

async function giftItem(tokenId, qty, newOwner){
    const proShopContractInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
    let tokenIdArray = [tokenId]
    let qtyArray = [qty]
    await proShopContractInstance.giftItem(tokenIdArray,qtyArray,newOwner)
}

async function burnStock(sku, qty) {
    const proShopContractInstance = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
    await proShopContractInstance.burnItems(sku, qty)
}

async function purchaseFromStore(value, tokenId, qty) {
    const proShopHolderContractInstance = new ethers.Contract(pbProShopHolderAddress, PBPROSHOPHOLDER.abi, signer)
    const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
    let valueWei = ethers.utils.parseUnits(value, 18)
    let approval = await buddiesInstance.approve(pbProShopHolderAddress, valueWei)
    let approvalReceipt = await approval.wait()

  if(approvalReceipt.events[0].event == "Approval"){
      let transaction = await proShopHolderContractInstance.purchaseFromStore(tokenId, valueWei, qty)
       return transaction
      }  
}

async function applyEquipmentToPlayer(selectToken, sku, playerId){
    const tokenContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let transaction = await tokenContract.updateEquipment(selectToken, sku, playerId)
    return transaction
}

async function removeProShopEquipment(equippedToken, playerId){
    let itemType = Number(equippedToken.substring(equippedToken.length - 2))
    const proshopHolderContract = new ethers.Contract(pbProShopFactoryAddress, PBPROSHOPFACTORY.abi, signer)
    await proshopHolderContract.setApprovalForAll(pbPlayersAddress, true)
    const tokenContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    let transaction = await tokenContract.removeEquipment(playerId)
    return transaction
}

//PBXP Shop Functions

async function addStockToPBXPShop(sku, qty) {
    const PBXPShopContractInstance = new ethers.Contract(PBXPShopFactoryAddress, PBXPSHOPFACTORY.abi, signer)
    await PBXPShopContractInstance.newProduct(sku, qty)
}

async function burnPBXPStock(sku, qty) {
    const PBXPShopContractInstance = new ethers.Contract(PBXPShopFactoryAddress, PBXPSHOPFACTORY.abi, signer)
    await PBXPShopContractInstance.burnItems(sku, qty)
}

//My Team Functions

async function displayTeam(){
    const query = new Moralis.Query("PBTeams")
    const sender = await signer.getAddress()
    query.equalTo('ownerAddress', sender.toLowerCase())
    const teams = await query.find()
    if(teams.length >= 1){
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
            p1Details = await getSinglePlayerData(p1ID).then(res => {
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p1ID == 0 || p1ID == ""){
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
            p2Details = await getSinglePlayerData(p2ID).then(res => {
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p2ID == 0 || p2ID == ""){
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
            p3Details = await getSinglePlayerData(p3ID).then(res => {
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p3ID == 0 || p3ID == ""){
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
            p4Details = await getSinglePlayerData(p4ID).then(res => {
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p4ID == 0 || p4ID == ""){
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
            p5Details = await getSinglePlayerData(p5ID).then(res => {
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p5ID == 0 || p5ID == ""){
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
            p6Details = await getSinglePlayerData(p6ID).then(res => {
                teamOP = teamOP + parseInt(res.offence)
                teamDP = teamDP + parseInt(res.defence)
                return res
            })
        }else if(p6ID == 0 || p6ID == ""){
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
            p6: p6Details
          }
        return teamObj
    }else if(teams.length == 0){
        console.log("No Team Found")
        return false
    }
}

async function getTeamFromMoralis(){
    const query = new Moralis.Query("PBTeams")
    const sender = await signer.getAddress()
    query.equalTo("ownerAddress", sender.toLowerCase())
    const teams = await query.find()
    if(teams.length >= 1){
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
    const sender = await signer.getAddress()
    query.equalTo('ownerAddress', sender.toLowerCase())
    const teams = await query.find()
    if(teams.length >= 1){
        return
    }
    let playerIds 
    await buySixPackofCards(value).then(res => {
        playerIds = res
    }).catch(err => {
        console.log(err)
        return
    })
    let dnaLength = 16
    let random_integer = Math.random()*101|0
    let datenow =  Date.now()
    let rand = ethers.utils.solidityKeccak256 (['string', 'string', 'string'],[signer, datenow.toString(), random_integer.toString()]) 
    let dna = rand % 10 ** dnaLength
    let digitFix = dnaLength - dna.toString().length 
    for(let i=0; i < digitFix; i++){
        dna = dna * 10
    }

    pbTeams.set('ownerAddress',  sender.toLowerCase())
    pbTeams.set('teamDNA', dna)
    pbTeams.set('p1', parseInt(playerIds[0]).toString())
    pbTeams.set('p2', parseInt(playerIds[1]).toString())
    pbTeams.set('p3', parseInt(playerIds[2]).toString())
    pbTeams.set('p4', parseInt(playerIds[3]).toString())
    pbTeams.set('p5', parseInt(playerIds[4]).toString())
    pbTeams.set('p6', parseInt(playerIds[5]).toString())
    pbTeams.set('user', Moralis.User.current())
    pbTeams.set('activeTimestamp1', 0)
    pbTeams.set('activeTimestamp2', 0)
    pbTeams.set('activeTimestamp3', 0)
    pbTeams.set('lastMatchWon1', false)
    pbTeams.set('lastMatchWon2', false)
    pbTeams.set('lastMatchWon3', false)
    console.log(pbTeams)
    await pbTeams.save()
    return teams
}

async function buySixPackofCards(value){
    let costtodraft = ethers.utils.parseUnits(value, 18)
    const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
    let approval = await buddiesInstance.approve(PBTeamsAddress, costtodraft)
    const approveReceipt = await approval.wait()
    if(approveReceipt.events[0].event == "Approval"){
        const teamInstance = new ethers.Contract(PBTeamsAddress, PBTEAMS.abi, signer)
        let playerIds = await teamInstance.mintSixPack(costtodraft)
        let playerIdsReceipt = await playerIds.wait()
        console.log(playerIdsReceipt.events[14].args)
        return playerIdsReceipt.events[14].args 
    }else{
        return 'Error'
    }
}

async function mintNewTeam(value){
    let costtodraft = ethers.utils.parseUnits(value, 18)
    const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
    let approval = await buddiesInstance.approve(PBTeamsAddress, costtodraft)
    const approveReceipt = await approval.wait()
    if(approveReceipt.events[0].event == "Approval"){
        const teamInstance = new ethers.Contract(PBTeamsAddress, PBTEAMS.abi, signer)
        let transaction = await teamInstance.mintTeam(costtodraft)
        const transactionReceipt = await transaction.wait()
        return transactionReceipt
    }else{
        return 'Error'
    }
}

async function getTeamMintCost(){
    const teamContract = new ethers.Contract(PBTeamsAddress, PBTEAMS.abi, signer)
    let teamMintCost = await teamContract.getTeamMintCost()
    let mintTeamValue = ethers.utils.formatUnits(teamMintCost, 18)
    return mintTeamValue
}

async function assignToPosition(posID, playerId){
    const puckBuddiesTeam = Moralis.Object.extend("PBTeams")
    const query = new Moralis.Query(puckBuddiesTeam)
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const results = await query.find()
    
    query.get(results[0].id).then((puckBuddiesTeam) =>{
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
}

async function doubleCheckIfPlayer(posID){
    const puckBuddiesTeam = Moralis.Object.extend("PBTeams")
    const query = new Moralis.Query(puckBuddiesTeam)
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const results = await query.find()
    
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

async function removeFromPosition(posID){
    const puckBuddiesTeam = Moralis.Object.extend("PBTeams")
    const query = new Moralis.Query(puckBuddiesTeam)
    query.equalTo('ownerAddress', ethereum.selectedAddress)
    const results = await query.find()
    
    query.get(results[0].id).then((puckBuddiesTeam) =>{
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
    const teamInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, provider)
    let teamTimeStamp = await teamInstance.getPvCMatchupsTimestamp()
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

async function loadPvCmatches(teamId){
    let teamIdFix = ethers.utils.solidityKeccak256(["uint"], [ethers.utils.solidityKeccak256(["string"], [teamId])])
    const pvcMatchupsHelperInstance = new ethers.Contract(PBPvCHelperAddress, PBPVCHELPER.abi, provider)
    const pvcMatchhupsInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, provider)
    let difficultyMod = await pvcMatchhupsInstance.getDifficultyMod()

    let opStat1 = await pvcMatchupsHelperInstance.generateRandomStat(difficultyMod, 1, 1)
    let dpStat1 = await pvcMatchupsHelperInstance.generateRandomStat(difficultyMod, 1, 2)
    let opStat2 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 1.5), 2, 1)
    let dpStat2 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 1.5), 2, 2)
    let opStat3 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 2), 3, 1)
    let dpStat3 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 2), 3, 2)
    
    let team1DNA_bn = await pvcMatchhupsInstance.generateRandomTeamDNA(1, 1, teamIdFix)
    let team1DNA = team1DNA_bn.toString()
    let team2DNA_bn = await pvcMatchhupsInstance.generateRandomTeamDNA(2, 2, teamIdFix)
    let team2DNA = team2DNA_bn.toString()
    let team3DNA_bn = await pvcMatchhupsInstance.generateRandomTeamDNA(3, 3, teamIdFix)
    let team3DNA = team3DNA_bn.toString()

    let timeouts = await pvcMatchhupsInstance.getTimeOuts(teamIdFix)
        console.log(timeouts)
        
    let matchUpNos = await pvcMatchhupsInstance.getNoMatchups(teamIdFix)
        console.log(matchUpNos)

    let to1 = parseInt(timeouts[0])
    let to2 = parseInt(timeouts[1])
    let to3 = parseInt(timeouts[2])
    let won1 = timeouts[3]
    let won2 = timeouts[4]
    let won3 = timeouts[5]
    let actv1 = parseInt(timeouts[6])
    let actv2 = parseInt(timeouts[7])
    let actv3 = parseInt(timeouts[8])
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
        'opStat1': parseInt(opStat1),
        'dpStat1': parseInt(dpStat1),
        'opStat2': parseInt(opStat2),
        'dpStat2': parseInt(dpStat2),
        'opStat3': parseInt(opStat3),
        'dpStat3': parseInt(dpStat3),
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
    console.log(availablePvCobject)
    return availablePvCobject
}

// async function hitTheIcePvC(difficulty, teamIdFix, playerIds){
//     const sender = ethereum.selectedAddress
//     const web3 = await Moralis.enableWeb3()  
//     let pvcMatchhupsInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    
//     await pvcMatchhupsInstance.methods.hitTheIcePvC(difficulty, teamIdFix, playerIds).send({from: sender, gas: 222000}).then(res => {
//         let resultOb = ({'isWinner': res.events.gamePlayed.returnValues[0], 
//                         'to1': res.events.gamePlayed.returnValues[1], 
//                         'to2': res.events.gamePlayed.returnValues[2], 
//                         'to3': res.events.gamePlayed.returnValues[3]})
//         return resultOb        
//     }).catch(err => {
//         console.log(err)
//     })  
// }

//Market Functions
  async function buyMarketPlayer(_itemId, _sellPrice, _fee) {
        const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
        const marketInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
        let sellPriceWei =  ethers.utils.parseUnits(_sellPrice, 18)
        let feeWei = ethers.utils.parseUnits(_fee, 18)
        let totalPriceWei = sellPriceWei + feeWei
        let approval = await buddiesInstance.approve(pbMarketplaceAddress, totalPriceWei)
        let approvalReceipt = await approval.wait()
        if(approvalReceipt.events[0].event == "Approval"){
            let transaction = await marketInstance.createMarketSale(pbPlayersAddress,_itemId,sellPriceWei,feeWei)
        }else{
            return
        }
  }

  async function sendPlayerToMarket(id, sellerprice, fee){    
        let tokenId = id.toString()
        let sellerpriceWei = ethers.utils.parseUnits(sellerprice.toString(), 18)
        let feeWei = ethers.utils.parseUnits(fee.toString(), 18)
        const playerContract = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
        let approval = await playerContract.approve(pbMarketplaceAddress, id)
        const approveReceipt = await approval.wait()
        console.log(approveReceipt.events[0].event)
        if(approveReceipt.events[0].event == "Approval"){
            const contractInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)    
            let transaction = await contractInstance.createMarketItem(pbPlayersAddress, tokenId, sellerpriceWei, feeWei)
            const transactionReceipt = await transaction.wait()
            console.log(transactionReceipt)
            return
        }else{
            return false
        }
  }

  async function getMarketPlayers(){
        const contractInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer) 
        let marketPlayers = await contractInstance.getMarketItems()
        return marketPlayers
  }

    async function cancelMarketSale(tokenId){
        const contractInstance = new ethers.Contract(pbMarketplaceAddress, PBPLAYERMARKET.abi, signer)
        await contractInstance.cancelMarketSale(pbPlayersAddress, tokenId)
    }

  //Player Minting Functions

  async function mintNewOffence(){
    let draftCost = await getDraftPrice()
    let costtodraft = ethers.utils.parseUnits(draftCost.dv1.toString(), 18)
    const contractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
    let approval = await buddiesInstance.approve(pbPlayersAddress, costtodraft)
    const approveReceipt = await approval.wait()
    console.log(approveReceipt.events[0].event)
    if(approveReceipt.events[0].event == "Approval"){
        let transaction = await contractInstance.mintPlayer(costtodraft,1)
        const transactionReceipt = await transaction.wait()
        console.log(transactionReceipt)
        return transactionReceipt
    }else{
        return false
    }
  }

  async function mintNewDefence(){
    let draftCost = await getDraftPrice()
    let costtodraft = ethers.utils.parseUnits(draftCost.dv2.toString(), 18)
    const contractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
    let approval = await buddiesInstance.approve(pbPlayersAddress, costtodraft)
    const approveReceipt = await approval.wait()
    console.log(approveReceipt.events[0].event)
    if(approveReceipt.events[0].event == "Approval"){
        let transaction = await contractInstance.mintPlayer(costtodraft,2)
        const transactionReceipt = await transaction.wait()
        console.log(transactionReceipt)
        return transactionReceipt
    }else{
        return false
    }
  }

  async function mintNewGoalie(){
    let draftCost = await getDraftPrice()
    let costtodraft = ethers.utils.parseUnits(draftCost.dv3.toString(), 18)
    const contractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, signer)
    let approval = await buddiesInstance.approve(pbPlayersAddress, costtodraft)
    const approveReceipt = await approval.wait()
    console.log(approveReceipt.events[0].event)
    if(approveReceipt.events[0].event == "Approval"){
        let transaction = await contractInstance.mintPlayer(costtodraft,3)
        const transactionReceipt = await transaction.wait()
        console.log(transactionReceipt)
        return transactionReceipt
    }else{
        return false
    }
  }

  async function mintSuperStar(opScore, dpScore, dna, playerType){
    const contractInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
    await contractInstance.mintSuperstar(opScore, dpScore, dna, playerType)
  }

  //Coin Token Functions
    async function updateCoinBalance(){
    const contractInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, provider)
    let balance = await contractInstance.balanceOf(ethereum.selectedAddress)
    let buddiesBalance = ethers.utils.formatUnits(balance, 18)
    let buds = parseFloat(buddiesBalance, 10)
    return buds
  }

  async function approveBuddyCoinSpend(address, value){
    let buddiesWei = ethers.utils.formatUnits(value, 18)
    const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, provider)   
    await buddiesInstance.approve(address, buddiesWei)
    }
    
    async function checkBuddiesAllowance(address){
        const buddiesInstance = new ethers.Contract(buddiesaddress, BUDDIES.abi, provider) 
        let balance = await buddiesInstance.allowance(sender, address)
        return balance
    }

//PBXP Functions
async function newPBXPtoTeamContract(qty){
    const PBXPInstance = new ethers.Contract(PBXPAddress, PBXP.abi, provider)
    await PBXPInstance.newPBXPtoTeamContract(qty)
}

async function checkXPBalanceonTeamContract(){
    const PBXPInstance = new ethers.Contract(PBXPAddress, PBXP.abi, provider)
    let balanceOfXP = await PBXPInstance.balanceOf(PBTeamsAddress,0)
    return balanceOfXP
}

async function updateXPBalance(){
    const sender = await signer.getAddress()
    const contractInstance = new ethers.Contract(PBXPAddress, PBXP.abi, provider)
    let result = await contractInstance.balanceOf(sender, 0)
    let balanceOfXP = parseInt(result.toString())
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
    mintSuperStar,
    approveBuddyCoinSpend,
    removeFromPosition,
    loadPvCmatches,
    newPBXPtoTeamContract,
    checkBuddiesAllowance,
    checkXPBalanceonTeamContract,
    updateXPBalance,
    addStockToPBXPShop,
    burnPBXPStock,
    getPvCMatchupsTimestamp,
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
    getTeamFromMoralis,
    mintNewTeamMoralis,
    buySixPackofCards,
    doubleCheckIfPlayer,
    transferBUDS,
    transferBNB,
    transferPBPlayersBUDS,
    transferPvCBUDS,
    transferPvCBNB,
    updateValidator,
    myEthAddress
}