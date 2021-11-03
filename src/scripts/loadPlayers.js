import buildCanvas from '../scripts/buildPlayer.js'

async function loadClickedPlayer(id) {
  return id



  // let clickedId = id
    
  // window.web3 = await Moralis.Web3.enable()
  // let abi = await new Promise((res) => {
  //    $.getJSON("../assets/contracts/PixelPuckPlayer.json", ((json) => {
  //        console.log(json) 
  //       res(json.abi)
  //     }))
  // })
  // let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)
  // let array = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress})
  // console.log(array)
  // if (array.length == 0) {
  //   console.log("No Players Found")
  //   return
  //   } 
  // console.log("Players Found")

  // const playerdata = array.map(async (playerId) => {
  //   let details = await contract.methods.getTokenDetails(playerId).call({from: ethereum.selectedAddress})
  //     return {
  //       id: playerId,
  //       dna: details.dna,
  //       offence: details.offence,
  //       defence: details.defence,
  //       playertype: details.playertype,
  //       injuredTime: details.injuredTime,
  //       injuryTimestamp: details.injuryTimestamp,
  //       jerseyId: details.jerseyId,
  //       mainColor: details.mainColor,
  //       teamId: details.teamId
  //     }
  //   }).sort((a, b) => b.count - a.count)
  //   .then(res => {
  //     buildCanvas.preloadPlayerInfo(id, res[id])
  //   })
  //   return playerdata
  }

export default {
  loadClickedPlayer
}