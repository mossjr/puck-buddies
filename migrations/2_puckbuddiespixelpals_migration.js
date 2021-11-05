const feesAddress = "0xb851e028EEAeb2B2eC32186AaC93E3855d5242Cc"

const PBBuddies = artifacts.require("PBBuddies")
const PBPlayers = artifacts.require("PBPlayers")
const PBPlayerMarketplace = artifacts.require("PBPlayerMarketplace")
const PBProShopFactory = artifacts.require("PBProShopFactory")
const PBProShopHolder = artifacts.require("PBProShopHolder")
const PBProShopMarketplace = artifacts.require("PBProShopMarketplace")
const PBXP = artifacts.require("PBXP")
const PBMatchupValidation = artifacts.require("PBMatchupValidation")
const PBPvCHelper = artifacts.require("PBPvCHelper")
const PBTeams = artifacts.require("PBTeams")
const PBMatchups = artifacts.require("PBMatchups")
const PBMatchupsMarket = artifacts.require("PBMatchupsMarket")
const PBPvCMatchups = artifacts.require("PBPvCMatchups")
const BuddiesICO = artifacts.require("BuddiesICO")

// //Local
const firstAddress = "0x27Dc255C37a28b4eCDea766122E5bb557Fc043ec"


//bscTestnet
// const firstAddress = "0x27Dc255C37a28b4eCDea766122E5bb557Fc043ec"
// const secondAddress = "0xb851e028EEAeb2B2eC32186AaC93E3855d5242Cc"
// const thirdAddress = "0x46E008eeDE61cbAF08393a9d42688cD528eC8E43"

let buddiesCoinAddress
let PBBuddiesInstance
let pbPlayersInstance
let pbPlayersAddress
let pbMarketplaceInstance
let pbMarketplaceAddress
let pbProShopFactoryInstance
let pbProShopFactoryAddress
let pbProShopHolderInstance
let pbProShopHolderAddress
let pbProShopMarketplaceInstance
let pbProShopMarketplaceAddress
let PBXPInstance
let PBXPAddress
let PBMatchupValidationInstance
let PBMatchupValidationAddress
let PBPvCHelperInstance
let PBPvCHelperAddress
let PBTeamsInstance
let PBTeamsAddress
let PBMatchupsInstance
let PBMatchupsAddress
let PBMatchupsMarketInstance
let PBMatchupsMarketAddress
let PBPvCMatchupsInstance
let PBPvCMatchupsAddress
let buddiesICOInstance
let buddiesICOAddress

//PB Players Deploy Settings
const mintCost1 = "5000000000000000000"
const mintCost2 = "5000000000000000000"
const mintCost3 = "10000000000000000000"
const teamMintCost = "35000000000000000000"
const upgradeCost = "500"
const ageoutSeconds = "604800"

//PB ProShop Factory Deploy Settings
const skuToMint1 = "1694200002400001"
const skuToMint2 = "1100010001200001"
const skuToMint3 = "1100020001200001"
const skuToMint4 = "1100030001200001"
const skuToMint5 = "1100040001200001"
const skuToMint6 = "1100050001200001"
const quantityToMint = 20

//PB PvC Deploy Settings
let PvCTimeout = [60,130,230]
let PvCReward = ["25000000000000000","50000000000000000","100000000000000000"]
let PvCxpReward = 25
let PvCdifficultyModifier = 100
let PvCinitialValueOnContract = web3.utils.toWei('1000')

//ICO Settings
let initialICOBuddies = '100000000000000000000000'
let initalICOBudsPerBNB = '50'


module.exports = function (deployer) {


       deployer.deploy(PBBuddies).then(async () => {
            PBBuddiesInstance = await PBBuddies.deployed()
            await PBBuddiesInstance.getBuddiesAddress().then(async (res) => {
                buddiesCoinAddress = res
            })

            return deployer.deploy(BuddiesICO, buddiesCoinAddress, initalICOBudsPerBNB).then( async () =>{
                buddiesICOInstance = await BuddiesICO.deployed()
                await buddiesICOInstance.getBuddiesICOAddress().then(async (res) =>{
                    buddiesICOAddress = res
                    await PBBuddiesInstance.transfer(buddiesICOAddress, initialICOBuddies) 
                })

            return deployer.deploy(PBPlayers, buddiesCoinAddress, mintCost1, mintCost2, mintCost3, ageoutSeconds).then( async () => {
            pbPlayersInstance = await PBPlayers.deployed()
            await pbPlayersInstance.getPBPlayersAddress().then(res => {
                pbPlayersAddress = res
            })

            return deployer.deploy(PBPlayerMarketplace, buddiesCoinAddress, pbPlayersAddress, feesAddress).then( async () => {
                pbMarketplaceInstance = await PBPlayerMarketplace.deployed()
                await pbMarketplaceInstance.getPBMarketplaceAddress().then( res => {
                    pbMarketplaceAddress = res
                })               

                return deployer.deploy(PBProShopFactory, buddiesCoinAddress, pbPlayersAddress).then( async () => {  
                    pbProShopFactoryInstance = await PBProShopFactory.deployed()
                    await pbProShopFactoryInstance.getPBProShopFactoryAddress().then(async res => {
                        pbProShopFactoryAddress = res
                        await pbPlayersInstance.updatePBProShopFactoryAddress(pbProShopFactoryAddress)
                    })

                    return deployer.deploy(PBProShopHolder, buddiesCoinAddress, pbProShopFactoryAddress).then(async () =>{
                        pbProShopHolderInstance = await PBProShopHolder.deployed()
                        await pbProShopHolderInstance.getPBProShopHolderAddress().then(async res => {
                            pbProShopHolderAddress = res
                            await pbProShopFactoryInstance.updateProshopHolderAddress(pbProShopHolderAddress)
                            await pbProShopFactoryInstance.newProduct(skuToMint1, quantityToMint)
                            await pbProShopFactoryInstance.newProduct(skuToMint2, quantityToMint)
                            await pbProShopFactoryInstance.newProduct(skuToMint3, quantityToMint)
                            await pbProShopFactoryInstance.newProduct(skuToMint4, quantityToMint)
                            await pbProShopFactoryInstance.newProduct(skuToMint5, quantityToMint)
                            await pbProShopFactoryInstance.newProduct(skuToMint6, quantityToMint)
                        })

                        return deployer.deploy(PBProShopMarketplace, buddiesCoinAddress, pbProShopFactoryAddress, feesAddress).then(async () => {
                            pbProShopMarketplaceInstance = await PBProShopMarketplace.deployed()
                            await pbProShopMarketplaceInstance.getPBProShopMarketplaceAddress().then(async res => {
                                pbProShopMarketplaceAddress = res
                                await pbProShopFactoryInstance.updateProshopMarketplaceAddress(pbProShopMarketplaceAddress)
                                await pbProShopHolderInstance.updateProshopMarketplaceAddress(pbProShopMarketplaceAddress)
                            })

                            return deployer.deploy(PBXP, buddiesCoinAddress, pbPlayersAddress, upgradeCost).then(async () => {
                                PBXPInstance = await PBXP.deployed()
                                await PBXPInstance.getPBXPAddress().then(async res => {
                                    PBXPAddress = res
                                    await pbPlayersInstance.updatePBXPaddress(PBXPAddress)
                                    await PBXPInstance.newProduct(0, 1500)
                                })

                                    return deployer.deploy(PBPvCHelper, PvCdifficultyModifier).then(async () => {
                                        PBPvCHelperInstance = await PBPvCHelper.deployed()
                                        await  PBPvCHelperInstance.getPBPvCMatchuypHelperAddress().then(async res => {
                                            PBPvCHelperAddress = res
                                        })

                                        return deployer.deploy(PBTeams, teamMintCost, buddiesCoinAddress, PBXPAddress, pbPlayersAddress).then(async () => {
                                            PBTeamsInstance = await PBTeams.deployed()
                                            await PBTeamsInstance.getPBTeamsAddress().then(async res => {
                                                PBTeamsAddress = res
                                                await pbPlayersInstance.updatePBTeamsAddress(PBTeamsAddress)
                                                await PBXPInstance.updatePBTeamsAddress(PBTeamsAddress)
                                            })

                                            return deployer.deploy(PBMatchupValidation, PBTeamsAddress, pbPlayersAddress).then(async () => {
                                                PBMatchupValidationInstance = await PBMatchupValidation.deployed()
                                                await PBMatchupValidationInstance.getPBMatchupsAddress().then(async res => {
                                                    PBMatchupValidationAddress = res
                                                    await PBTeamsInstance.updatePBMatchupValidationAddress(PBMatchupValidationAddress)                                                    
                                                })

                                            return deployer.deploy(PBMatchups,buddiesCoinAddress, feesAddress, PBTeamsAddress, PBMatchupValidationAddress).then(async () => {
                                                PBMatchupsInstance = await PBMatchups.deployed()
                                                await PBMatchupsInstance.getPbMatchupsAddress().then(async res => {
                                                    PBMatchupsAddress = res
                                                    await PBXPInstance.updatePBMatchupsAddress(PBMatchupsAddress)
                                                })

                                                return deployer.deploy(PBMatchupsMarket).then(async () => {
                                                    PBMatchupsMarketInstance = await PBMatchupsMarket.deployed()
                                                    await PBMatchupsMarketInstance.getPBMatchupsMarketAddress().then(async res => {
                                                        PBMatchupsMarketAddress = res
                                                        await PBMatchupsInstance.updateMatchupsMarketAddress(PBMatchupsMarketAddress)
                                                        //add additional contract functions here

                                                    })

                                                    return deployer.deploy(PBPvCMatchups, buddiesCoinAddress, PBXPAddress, PBTeamsAddress, PBMatchupValidationAddress, PBPvCHelperAddress, PvCTimeout, PvCReward, PvCxpReward, PvCdifficultyModifier).then(async () => {
                                                        PBPvCMatchupsInstance = await PBPvCMatchups.deployed()
                                                        await pbPlayersInstance.mintSuperstar(firstAddress,0,0, generateRandomDNA(),1)
                                                        for(let i = 0; i < 20; i++){
                                                            await pbPlayersInstance.mintSuperstar(firstAddress, gerateRandomStat(50, 99), gerateRandomStat(0, 49), generateRandomDNA(), 1).then(async res => {
                                                                let playerID = res.logs[2].args[0].toString()
                                                                console.log("PlayerID " + playerID + " created")
                                                                await pbPlayersInstance.approve(pbMarketplaceAddress, playerID).then(async res => {
                                                                    await pbMarketplaceInstance.createMarketItem(pbPlayersAddress,playerID, '961538461538462000', '38461538461538000')
                                                                })
                                                            })
                                                            
                                                        }
                                                       
                                                   


                                                        await PBPvCMatchupsInstance.getPBPvCMatchupsAddress().then(async res => {
                                                            PBPvCMatchupsAddress = res
                                                            await PBBuddiesInstance.transfer(PBPvCMatchupsAddress, PvCinitialValueOnContract.toString()) 
                                                            await PBXPInstance.updatePBPvCAddress(PBPvCMatchupsAddress)

                                                            
                                                                await pbProShopFactoryInstance.newProduct(skuToMint1, 20)
                                                                await PBBuddiesInstance.approve(pbProShopHolderAddress, '48000000000000000000')
                                                                await pbProShopHolderInstance.purchaseFromStore(skuToMint1,'48000000000000000000', 20)
                                                                for(let i = 0; i < 20; i++){
                                                                    await pbProShopFactoryInstance.setApprovalForAll(pbProShopMarketplaceAddress, true)
                                                                    await pbProShopMarketplaceInstance.createProShopMarketItem(skuToMint1, '1000000000000000000').then(async res => {
                                                                        console.log("Sent " + skuToMint1 + " "  + i + " the Equipment Marketplace")
                                                                    })  
                                                                }

                                                                await pbProShopFactoryInstance.newProduct(skuToMint2, 20)
                                                                await PBBuddiesInstance.approve(pbProShopHolderAddress, '24000000000000000000')
                                                                await pbProShopHolderInstance.purchaseFromStore(skuToMint2,'24000000000000000000', 20)
                                                                for(let i = 0; i < 20; i++){
                                                                    await pbProShopFactoryInstance.setApprovalForAll(pbProShopMarketplaceAddress, true)
                                                                    await pbProShopMarketplaceInstance.createProShopMarketItem(skuToMint2, '500000000000000000').then(async res => {
                                                                        console.log("Sent " + skuToMint2 + " " + i + " the Equipment Marketplace")
                                                                    })  
                                                                }
                                                                

                                                                await pbProShopFactoryInstance.newProduct(skuToMint3, 20)
                                                                await PBBuddiesInstance.approve(pbProShopHolderAddress, '24000000000000000000')
                                                                await pbProShopHolderInstance.purchaseFromStore(skuToMint3,'24000000000000000000', 20)
                                                                for(let i = 0; i < 20; i++){
                                                                    await pbProShopFactoryInstance.setApprovalForAll(pbProShopMarketplaceAddress, true)
                                                                    await pbProShopMarketplaceInstance.createProShopMarketItem(skuToMint3, '500000000000000000').then(async res => {
                                                                        console.log("Sent " + skuToMint3 + " "  + i + " the Equipment Marketplace")
                                                                    })  
                                                                }
                                                                

                                                                await pbProShopFactoryInstance.newProduct(skuToMint4, 20)
                                                                await PBBuddiesInstance.approve(pbProShopHolderAddress, '24000000000000000000')
                                                                await pbProShopHolderInstance.purchaseFromStore(skuToMint4,'24000000000000000000', 20)
                                                                for(let i = 0; i < 20; i++){
                                                                    await pbProShopFactoryInstance.setApprovalForAll(pbProShopMarketplaceAddress, true)
                                                                    await pbProShopMarketplaceInstance.createProShopMarketItem(skuToMint4, '500000000000000000').then(async res => {
                                                                        console.log("Sent " + skuToMint4 + " "  + i + " the Equipment Marketplace")
                                                                    })  
                                                                }
                                                                

                                                                await pbProShopFactoryInstance.newProduct(skuToMint5, 20)
                                                                await PBBuddiesInstance.approve(pbProShopHolderAddress, '24000000000000000000')
                                                                await pbProShopHolderInstance.purchaseFromStore(skuToMint5,'24000000000000000000', 20)
                                                                for(let i = 0; i < 20; i++){
                                                                    await pbProShopFactoryInstance.setApprovalForAll(pbProShopMarketplaceAddress, true)
                                                                    await pbProShopMarketplaceInstance.createProShopMarketItem(skuToMint5, '500000000000000000').then(async res => {
                                                                        console.log("Sent " + skuToMint5 + " "  + i + " the Equipment Marketplace")
                                                                    })  
                                                                }

                                                                await pbProShopFactoryInstance.newProduct(skuToMint6, 20)
                                                                await PBBuddiesInstance.approve(pbProShopHolderAddress, '24000000000000000000')
                                                                await pbProShopHolderInstance.purchaseFromStore(skuToMint6,'24000000000000000000', 20)
                                                                for(let i = 0; i < 20; i++){
                                                                    await pbProShopFactoryInstance.setApprovalForAll(pbProShopMarketplaceAddress, true)
                                                                    await pbProShopMarketplaceInstance.createProShopMarketItem(skuToMint6, '500000000000000000').then(async res => {
                                                                        console.log("Sent " + skuToMint6 + " "  + i + " the Equipment Marketplace")
                                                                    })  
                                                                }
                                                                
                                                                
                                                         

                                                            console.log("export const pbPlayersAddress = \"" + pbPlayersAddress +"\"")
                                                            console.log("export const pbMarketplaceAddress = \"" + pbMarketplaceAddress +"\"")
                                                            console.log("export const pbProShopFactoryAddress = \"" + pbProShopFactoryAddress +"\"")
                                                            console.log("export const pbProShopHolderAddress = \"" + pbProShopHolderAddress +"\"")
                                                            console.log("export const pbProShopMarketplaceAddress = \"" + pbProShopMarketplaceAddress +"\"") 
                                                            console.log("export const PBXPAddress = \"" + PBXPAddress +"\"") 
                                                            console.log("export const PBMatchupValidationAddress = \"" + PBMatchupValidationAddress +"\"")
                                                            console.log("export const PBTeamsAddress = \"" + PBTeamsAddress +"\"")
                                                            console.log("export const PBMatchupsAddress = \"" + PBMatchupsAddress +"\"")
                                                            console.log("export const PBMatchupsMarketAddress = \"" + PBMatchupsMarketAddress +"\"")
                                                            console.log("export const PBPvCMatchupsAddress = \"" + PBPvCMatchupsAddress +"\"")
                                                            console.log("export const buddiesCoinAddress = \"" + buddiesCoinAddress +"\"")
                                                            console.log("export const buddiesICOAddress = \"" + buddiesICOAddress +"\"")

                                                            let obj = {addresses: []}
                                                            obj.addresses.push({addressname: 'pbPlayersAddress', address: pbPlayersAddress})
                                                            obj.addresses.push({addressname: 'pbMarketplaceAddress', address: pbMarketplaceAddress})
                                                            obj.addresses.push({addressname: 'pbProShopFactoryAddress', address: pbProShopFactoryAddress})
                                                            obj.addresses.push({addressname: 'pbProShopHolderAddress', address: pbProShopHolderAddress})
                                                            obj.addresses.push({addressname: 'pbProShopMarketplaceAddress', address: pbProShopMarketplaceAddress})
                                                            obj.addresses.push({addressname: 'PBXPAddress', address: PBXPAddress})
                                                            obj.addresses.push({addressname: 'PBMatchupValidationAddress', address: PBMatchupValidationAddress})
                                                            obj.addresses.push({addressname: 'PBTeamsAddress', address: PBTeamsAddress})
                                                            obj.addresses.push({addressname: 'PBMatchupsAddress', address: PBMatchupsAddress})
                                                            obj.addresses.push({addressname: 'PBMatchupsMarketAddress', address: PBMatchupsMarketAddress})
                                                            obj.addresses.push({addressname: 'PBPvCMatchupsAddress', address: PBPvCMatchupsAddress})
                                                            obj.addresses.push({addressname: 'PBPvCHelperAddress', address: PBPvCHelperAddress})
                                                            obj.addresses.push({addressname: 'buddiesCoinAddress', address: buddiesCoinAddress})
                                                            obj.addresses.push({addressname: 'buddiesICOAddress', address: buddiesICOAddress})
                                                            

                                                            let json = JSON.stringify(obj)
                                                            let fs = require('fs')
                                                            fs.writeFile("contractAddresses.json", json, (err)=> {
                                                                if (err) throw err;
                                                                console.log('Data written to file');
                                                            })
                                                            }) 


                                                        })    
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })         
       })        
  }

function generateRandomDNA(){
    let dna = ''
    for(let i = 0; i < 7; i++){
      let val = Math.floor(1000 + Math.random() * 9000);
      dna = dna + `${val}`
    }
    console.log(dna); 
    return dna
  }

  function gerateRandomStat(min, max){
      let statBell = 0
      let iterations = 4
      for(let i = 0; i < iterations; i++){
          let stat = Math.floor(Math.random() * (max - min + 1) + min)
          statBell = statBell + stat
      }
      let result = Math.floor(statBell/iterations)
      console.log(result)
      return  result

  }