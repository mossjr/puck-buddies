import { createApp } from 'vue'
import App from './App.vue'
import Login from './components/Login.vue'
import router from './router'
import MetaMask from './components/MetaMask.vue'
import {pbPlayersAddress, pbMarketplaceAddress, pbProShopFactoryAddress, pbProShopHolderAddress, pbProShopMarketplaceAddress, PBXPAddress, PBTeamsAddress, PBPvCMatchupsAddress, PBMatchupsAddress, PBMatchupsMarketAddress, buddiesaddress, marketfeesaddress, PBPvCHelperAddress} from '../src/config.js'
import PBXP from '../public/assets/contracts/PBXP.json'
import PBPLAYER from '../public/assets/contracts/PBPlayers.json'
import PBPLAYERMARKET from '../public/assets/contracts/PBPlayerMarketplace.json'
import BUDDIES from '../public/assets/contracts/buddies.json'
import PBPROSHOPFACTORY from '../public/assets/contracts/PBProShopFactory.json'
import PBPROSHOPHOLDER from '../public/assets/contracts/PBProShopHolder.json'
import PBPROSHOPMARKETPLACE from '../public/assets/contracts/PBProShopMarketplace.json'
import PBPVCHELPER from '../public/assets/contracts/PBPvCHelper.json'
// import PBXPSHOPHOLDER from '../public/assets/contracts/PBXPShopHolder.json'
import PBTEAMS from '../public/assets/contracts/PBTeams.json'
import PBPVCMATCHUPS from '../public/assets/contracts/PBPvCMatchups.json'
import PBMATCHUPS from '../public/assets/contracts/PBMatchups.json'
import PBMATCHUPSMARKET from '../public/assets/contracts/PBMatchupsMarket.json'
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
    loadPBPlayers()
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

//Check Admin Functions
async function checkPBPlayerAdmin() {
    const web3 = await Moralis.Web3.enable()
    let contractInstance = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let adminCheck = await contractInstance.methods.isAdmin().call({from: ethereum.selectedAddress})
    return adminCheck
  }

  async function checkMarketAdmin() {
    const web3 = await Moralis.Web3.enable()
    let contractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let adminCheck = await contractInstance.methods.isAdmin().call({from: ethereum.selectedAddress})
    return adminCheck
  }

//PBP Admin Functions
async function getDraftPrice(){
    window.web3 = await Moralis.Web3.enable()
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
    window.web3 = await Moralis.Web3.enable()
    let valueWei = web3.utils.toWei(value)
    const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let res = await playerContract.methods.updateMintingCost(valueWei).send({from: ethereum.selectedAddress, gas: 44000})
}

async function getMarketplaceAddress(){
    window.web3 = await Moralis.Web3.enable()
    const pbMarketContractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let marketplaceAddress = await pbMarketContractInstance.methods.getPBMarketplaceAddress().call({from: ethereum.selectedAddress})
    return marketplaceAddress
}

async function updateMarketplaceAddress(){
    window.web3 = await Moralis.Web3.enable()
    const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    await playerContract.methods.updateMarketPlaceAddress(pbMarketplaceAddress).send({from: ethereum.selectedAddress, gas: 512000})
    await playerContract.methods.updateEquippedItemsAddress(equippeditemsaddress).send({from: ethereum.selectedAddress, gas: 512000})
    await playerContract.methods.updateProShopAddress(pbProShopFactoryAddress).send({from: ethereum.selectedAddress, gas: 512000})
}

//Market ADMIN Functions
async function getMarketFeePercent(){
    window.web3 = await Moralis.Web3.enable()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let getMarketPercentFee= await marketContract.methods.getMarketFeePercent().call({from: ethereum.selectedAddress})
    let fee = getMarketPercentFee/100
    return fee
}

async function updateMarketFeePercent(value){
    let sendValue = value * 100;
    window.web3 = await Moralis.Web3.enable()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let res = await marketContract.methods.updateMarketFeePercent(sendValue).send({from: ethereum.selectedAddress, gas: 44000})
}

async function getMarketFeePayableAddress(){
    window.web3 = await Moralis.Web3.enable()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    let getMarketFeePayableAddress = await marketContract.methods.getMarketFeePayableAddress().call({from: ethereum.selectedAddress})
    console.log("Result: " + getMarketFeePayableAddress)
    return getMarketFeePayableAddress
}

async function updateFeePayableAddress(newaddress){
    window.web3 = await Moralis.Web3.enable()
    const marketContract = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress)
    console.log("here is the address being sent: " + newaddress)
    let updateMarketFeePayableAddress = await marketContract.methods.updateFeePayableAddress(newaddress).send({from: ethereum.selectedAddress, gas: 512000})
}

//Pro Shop Admin Functions
async function checkProShopAdmin() {
    const web3 = await Moralis.Web3.enable()
    let contractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    let adminCheck = await contractInstance.methods.isAdmin().call({from: ethereum.selectedAddress})
    return adminCheck
  }

  async function loadProshopItems(_proShopItemAdmin,_proShopItems, _proShopActive){
        window.web3 = await Moralis.Web3.enable()
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
            window.web3 = await Moralis.Web3.enable()
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
        window.web3 = await Moralis.Web3.enable()
        const proshopMarketplaceInstance = new web3.eth.Contract(PBPROSHOPMARKETPLACE.abi, pbProShopMarketplaceAddress)
        const proshopMarketplaceItems = await proshopMarketplaceInstance.methods.getProShopMarketItems().call({from: ethereum.selectedAddress})
         return proshopMarketplaceItems
    }
    
    async function getProshopMarketFeePercent(){
        window.web3 = await Moralis.Web3.enable()
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
            window.web3 = await Moralis.Web3.enable()
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
        const web3 = await Moralis.Web3.enable()
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
        const web3 = await Moralis.Web3.enable()
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
        const web3 = await Moralis.Web3.enable()
        let proShopHolderInstance = new web3.eth.Contract(PBPROSHOPHOLDER.abi, pbProShopHolderAddress)
        await proShopHolderInstance.methods.updateProShopAddress(pbProShopFactoryAddress).send({from: ethereum.selectedAddress, gas: 72000})
        let proShopFactoryInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
        await proShopFactoryInstance.methods.updateProshopHolderAddress(pbProShopHolderAddress).send({from: ethereum.selectedAddress, gas: 72000})
    }

//My Players Functions
async function loadPBPlayers(){
    window.web3 = await Moralis.Web3.enable()
    const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    let array = await tokenContract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress})
    let nounsArray = NOUNS
    let teamFirstLetter
    if (array.length == 0) {
        let emptyArray = []
      return emptyArray
      } 
    const playerdata = array.map(async (playerId) => {
      let details = await tokenContract.methods.getTokenDetails(playerId).call({from: ethereum.selectedAddress})
        if(details.teamDna == 0){
            teamFirstLetter = ''
        }else{
            let dna = details.teamDna
            console.log(dna)
            let teamNounNumber = parseInt(dna.slice(5,8))
            let teamName = nounsArray[teamNounNumber].noun
            teamFirstLetter = teamName.slice(0,1) 
            //console.log (details.teamId) 
            //console.log (teamName)
        }
        
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
          teamLetter: teamFirstLetter,
          position: details.position,
          jerseyId: details.jerseyId,
          mainColor: details.mainColor,
          equippedJersey: details.equippedJersey,
          equippedStick: details.equippedStick,
          equippedToken: details.equippedToken,
          ageoutTimestamp: details.ageoutTimestamp,
          draftTimestamp: details.draftTimestamp          
        }
      }).sort((a, b) => b.count - a.count)
      return playerdata
}


async function getSinglePlayerData(playerId){
    window.web3 = await Moralis.Web3.enable()
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
    window.web3 = await Moralis.Web3.enable()
    const PBXPContract = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    let upgradeCost = await PBXPContract.methods.getUpgradeCost().call({from: caller})
    return upgradeCost
}


async function increaseStats(tokenId, statType, qty, xp) {
    console.log("Token Id: " + tokenId + " statType: " +  statType + " qty: " + qty + " xp: " + xp)
    const sender = ethereum.selectedAddress
    window.web3 = await Moralis.Web3.enable()
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
    window.web3 = await Moralis.Web3.enable()
    const tokenContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    await tokenContract.methods.giftPlayer(tokenId, newOwner).send({from: sender, gas: 512000}).on("receipt", ( (receipt) => {
        console.log("Gas Used: " + receipt.gasUsed)
        console.log(receipt)
    }))
}


//PBPlayers Market Functions

async function loadPBPlayersMarket(){
    window.web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
    let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    let timeStamp = await proShopContractInstance.methods.getTimestamp().call({from: caller})
    console.log(timeStamp)
}

async function addStockToProShop(sku, qty) {
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
    let proShopContractInstance = new web3.eth.Contract(PBPROSHOPFACTORY.abi, pbProShopFactoryAddress)
    await proShopContractInstance.methods.newProduct(sku, qty).send({from: minter, gas: 512000}).on("receipt", ( (receipt) => {
                  console.log("Mint New Items Transaction received:")
                  console.log("Gas Used: " + receipt.gasUsed)
                  console.log(receipt)
                  
              }))
}

async function giftItem(tokenId, qty, newOwner){
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
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
  const web3 = await Moralis.Web3.enable()
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
    window.web3 = await Moralis.Web3.enable()
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
    window.web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
    let PBXPShopContractInstance = new web3.eth.Contract(PBXPSHOPFACTORY.abi, PBXPShopFactoryAddress)
    await PBXPShopContractInstance.methods.newProduct(sku, qty).send({from: minter, gas: 512000}).on("receipt", ( (receipt) => {
                  console.log("Mint New Items Transaction received:")
                  console.log("Gas Used: " + receipt.gasUsed)
                  console.log(receipt)
                  
              }))
}

async function burnPBXPStock(sku, qty) {
    const burner = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
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
//   const web3 = await Moralis.Web3.enable()
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
//     window.web3 = await Moralis.Web3.enable()
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
    console.log("Begin Display Teams")
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
    let teamInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
    let teamArray = await teamInstance.methods.getAllTokensForUser(minter).call({from: minter})
    if (teamArray.length == 0) {
        console.log("No Teams Found")
        return
        } 

    console.log("Team Array: " + teamArray)
    console.log(teamArray)
      const teamdata = teamArray.map(async (teamIndex) => {
        let details = await teamInstance.methods.getTokenDetails(teamIndex).call({from: ethereum.selectedAddress})
          return {
          teamIndex: teamIndex, 
          teamId: details.teamId,
          teamDna: details.teamDna,
          teamTotalOP: details.teamTotalOP,
          teamTotalDP: details.teamTotalDP,  
          activeTimestamp1: details.activeTimestamp1,
          activeTimestamp2: details.activeTimestamp2,
          activeTimestamp3: details.activeTimestamp3,
          lastMatchWon1: details.lastMatchWon1,
          lastMatchWon2: details.lastMatchWon2,
          lastMatchWon3: details.lastMatchWon3,
          ownerAddress: details.ownerAddress
          
          }
        }).sort((a, b) => b.count - a.count)
        return teamdata
}

async function mintNewTeam(value){
    let approved = false
    const minter = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
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
        return 
    }
}

// async function mintTeam(){
//     const minter = ethereum.selectedAddress
//     const web3 = await Moralis.Web3.enable()
//     let teamInstance = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
//     await teamInstance.methods.mintTeam().send({from: minter, gas: 2048000}).on("receipt", ((receipt) => {
//         console.log(receipt)
//         return res
//     }))
// }
async function checkIfTeam(){
    window.web3 = await Moralis.Web3.enable()
    const teamContract = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
    let checkTeam = await teamContract.methods.balanceOf(ethereum.selectedAddress).call({from: ethereum.selectedAddress})
    if (checkTeam == 0 ){
        return false
    } else if (checkTeam >= 1){
        return true
    }
}

async function getTeamMintCost(){
    window.web3 = await Moralis.Web3.enable()
    const teamContract = new web3.eth.Contract(PBTEAMS.abi, PBTeamsAddress)
    let teamMintCost = await teamContract.methods.getTeamMintCost().call({from: ethereum.selectedAddress})
    console.log(teamMintCost)
    let mintTeamValue = web3.utils.fromWei(teamMintCost)
    return mintTeamValue
}

async function assignToPosition(teamId, position, playerId, teamDna){
    const sender = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
    const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    console.log("Sending this TeamId: " + teamId)
    let receipt = await playerContract.methods.assignToTeam(teamId, position, playerId, teamDna).send({from: sender, gas: 512000})
        console.log("Here is the receipt: " + receipt)
        return (receipt)
}

async function removeFromPosition(teamId, playerId){
    const sender = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
    const playerContract = new web3.eth.Contract(PBPLAYER.abi, pbPlayersAddress)
    console.log("Sending this TeamId: " + teamId)
    console.log("Sending this PlayerId: " + playerId)
    await playerContract.methods.removeFromTeam(teamId, playerId).send({from: sender, gas: 1512000}).on("receipt", (receipt) => {
        console.log("Here is the receipt: " + receipt)
        return (receipt)
    }).catch(err =>{
        console.log(err)
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
    const web3 = await Moralis.Web3.enable()    
    let teamInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    let teamTimeStamp = await teamInstance.methods.getPvCMatchupsTimestamp().call({from: caller})
    return teamTimeStamp
}

async function loadPvCmatches(teamId){
    const caller = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()
    let pvcMatchupsHelperInstance = new web3.eth.Contract(PBPVCHELPER.abi, PBPvCHelperAddress)
    let pvcMatchhupsInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    let difficultyMod = await pvcMatchhupsInstance.methods.getDifficultyMod().call({from: caller})

    let opStat1 = await pvcMatchupsHelperInstance.methods.generateRandomHourlyStat(difficultyMod, 1, 1).call({from: caller})
    console.log(opStat1)
    let dpStat1 = await pvcMatchupsHelperInstance.methods.generateRandomHourlyStat(difficultyMod, 1, 2).call({from: caller})
    console.log(dpStat1)
    let opStat2 = await pvcMatchupsHelperInstance.methods.generateRandomHourlyStat((difficultyMod * 1.5), 2, 1).call({from: caller})
    console.log(opStat2)
    let dpStat2 = await pvcMatchupsHelperInstance.methods.generateRandomHourlyStat((difficultyMod * 1.5), 2, 2).call({from: caller})
    console.log(dpStat2)
    let opStat3 = await pvcMatchupsHelperInstance.methods.generateRandomHourlyStat((difficultyMod * 2), 3, 1).call({from: caller})
    console.log(opStat3)
    let dpStat3 = await pvcMatchupsHelperInstance.methods.generateRandomHourlyStat((difficultyMod * 2), 3, 2).call({from: caller})
    console.log(dpStat3)
    
    let team1DNA = await pvcMatchhupsInstance.methods.generateRandomTeamDNA(1, 1, teamId).call({from: caller})
    console.log(team1DNA)
    let team2DNA = await pvcMatchhupsInstance.methods.generateRandomTeamDNA(2, 2, teamId).call({from: caller})
    console.log(team2DNA)
    let team3DNA = await pvcMatchhupsInstance.methods.generateRandomTeamDNA(3, 3, teamId).call({from: caller})
    console.log(team3DNA)

    let timeouts = await pvcMatchhupsInstance.methods.getTimeOuts(teamId).call({from: caller})
        console.log(timeouts) 

    let to1 = timeouts[0]
    let to2 = timeouts[1]
    let to3 = timeouts[2]
    let won1 = timeouts[3]
    let won2 = timeouts[4]
    let won3 = timeouts[5]
    let actv1 = timeouts[6]
    let actv2 = timeouts[7]
    let actv3 = timeouts[8]

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
        'actv3': actv3
    })
    console.log(availablePvCobject)
    return availablePvCobject
}

async function hitTheIcePvC(difficulty, teamId, playerIds){
    console.log(playerIds)
    const sender = ethereum.selectedAddress
    const web3 = await Moralis.Web3.enable()  
    let pvcMatchhupsInstance = new web3.eth.Contract(PBPVCMATCHUPS.abi, PBPvCMatchupsAddress)
    
    await pvcMatchhupsInstance.methods.hitTheIcePvC(difficulty, teamId, playerIds).send({from: sender, gas: 512000}).then(res => {
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
//     const web3 = await Moralis.Web3.enable()  
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
    const web3 = await Moralis.Web3.enable()
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
        const web3 = await Moralis.Web3.enable()
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
        const web3 = await Moralis.Web3.enable()
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
        const web3 = await Moralis.Web3.enable()
        let contractInstance = new web3.eth.Contract(PBPLAYERMARKET.abi, pbMarketplaceAddress) 
        let marketPlayers = await contractInstance.methods.getMarketItems().call({from: ethereum.selectedAddress})
        console.log("Market PLayers from Contract")
        console.log(marketPlayers)
        return marketPlayers
  }

    async function cancelMarketSale(tokenId){
        const web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
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
    const web3 = await Moralis.Web3.enable()
    let PBXPInstance = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    const sender = ethereum.selectedAddress
    await PBXPInstance.methods.newPBXPtoTeamContract(qty).send({from: sender, gas: 72000})
}

async function checkXPBalanceonTeamContract(){
    const web3 = await Moralis.Web3.enable()
    let PBXPInstance = new web3.eth.Contract(PBXP.abi, PBXPAddress)
    const caller = ethereum.selectedAddress
    let balanceOfXP = await PBXPInstance.methods.balanceOf(PBTeamsAddress,0).call({from: caller})
    console.log(balanceOfXP)
    return balanceOfXP
}

async function updateXPBalance(){
    const web3 = await Moralis.Web3.enable()
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
    checkIfTeam,
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
    giftItem
}






