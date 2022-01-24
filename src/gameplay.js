
import {
        pbPlayersAddress, 
        PBPvCMatchupsAddress,
        PBPvCHelperAddress, 
        
        } from '../src/config.js'
import PBPVCHELPER from '../public/assets/contracts/PBPvCHelper.json'
import PBPLAYER from '../public/assets/contracts/PBPlayers.json'
import PBPVCMATCHUPS from '../public/assets/contracts/PBPvCMatchups.json'
import { ethers } from "ethers"

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

    async function performPvC(_playerIDs, _teamIDRaw, _difficulty) {
        const pvcMatchupsHelperInstance = new ethers.Contract(PBPvCHelperAddress, PBPVCHELPER.abi, signer)
        const pvcMatchhupsInstance = new ethers.Contract(PBPvCMatchupsAddress, PBPVCMATCHUPS.abi, signer)
        const pbPlayersInstance = new ethers.Contract(pbPlayersAddress, PBPLAYER.abi, signer)
        const difficulty = _difficulty
        
          let difficultyMod = await pvcMatchhupsInstance.getDifficultyMod()
          let opStat1 = await pvcMatchupsHelperInstance.generateRandomStat(difficultyMod, 1, 1)
          let dpStat1 = await pvcMatchupsHelperInstance.generateRandomStat(difficultyMod, 1, 2)
          let opStat2 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 1.5), 2, 1)
          let dpStat2 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 1.5), 2, 2)
          let opStat3 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 2), 3, 1)
          let dpStat3 = await pvcMatchupsHelperInstance.generateRandomStat((difficultyMod * 2), 3, 2)
          let teamID = ethers.utils.solidityKeccak256(["uint"], [ethers.utils.solidityKeccak256(["string"], [_teamIDRaw])])
          let playerIDs = _playerIDs

          const query = new Moralis.Query("PBTeams")
          query.equalTo('ownerAddress', ethereum.selectedAddress)
          const teams = await query.find()

          //let teamDetails = await teamsInstance.methods.getTokenDetails(teamID).call({from: caller})
          let matchupNos = await pvcMatchhupsInstance.getNoMatchups(teamID)
          let mu1 = matchupNos[0]
          let mu2 = matchupNos[1]
          let mu3 = matchupNos[2]
          //console.log(matchupNos)

          
          let p1 = await pbPlayersInstance.getTokenDetails(_playerIDs[0])
          let p2 = await pbPlayersInstance.getTokenDetails(_playerIDs[1])
          let p3 = await pbPlayersInstance.getTokenDetails(_playerIDs[2])
          let p4 = await pbPlayersInstance.getTokenDetails(_playerIDs[3])
          let p5 = await pbPlayersInstance.getTokenDetails(_playerIDs[4])
          let p6 = await pbPlayersInstance.getTokenDetails(_playerIDs[5])

          //console.log([p1,p2,p3,p4,p5,p6])

          if(_playerIDs[0] != teams[0].attributes.p1){
            //console.log("Mismatch Player ID")
            return
          }

          if(_playerIDs[1] != teams[0].attributes.p2){
            //console.log("Mismatch Player ID")
            return
          }

          if(_playerIDs[2] != teams[0].attributes.p3){
            //console.log("Mismatch Player ID")
            return
          }

          if(_playerIDs[3] != teams[0].attributes.p4){
            //console.log("Mismatch Player ID")
            return
          }

          if(_playerIDs[4] != teams[0].attributes.p5){
            //console.log("Mismatch Player ID")
            return
          }

          if(_playerIDs[5] != teams[0].attributes.p6){
            //console.log("Mismatch Player ID")
            return
          }

          let teamOP = parseInt(p1.offence) + parseInt(p2.offence) + parseInt(p3.offence) + parseInt(p4.offence) + parseInt(p5.offence) + parseInt(p6.offence)
          let teamDP = parseInt(p1.defence) + parseInt(p2.defence) + parseInt(p3.defence) + parseInt(p4.defence) + parseInt(p5.defence) + parseInt(p6.defence)
          //console.log(teamOP + " " + teamDP)
          let thisMatchupNo
          if(difficulty == 1){
            thisMatchupNo = mu1
          }else if(difficulty == 2){
            thisMatchupNo = mu2
          }else if(difficulty == 3){
            thisMatchupNo = mu3
          }

          let playersOfAge = true

          if(p1.ageoutTimestamp >= Math.floor(Date.now() / 10 ** 3)){
            //console.log("P1 Valid")
          }else if(p1.ageoutTimestamp < Math.floor(Date.now() / 10 ** 3)){
            //console.log("P1 Retired")
            playersOfAge = false
          }

          if(p2.ageoutTimestamp >= Math.floor(Date.now() / 10 ** 3)){
            //console.log("P2 Valid")
          }else if(p2.ageoutTimestamp < Math.floor(Date.now() / 10 ** 3)){
            //console.log("P2 Retired")
            playersOfAge = false
          }

          if(p3.ageoutTimestamp >= Math.floor(Date.now() / 10 ** 3)){
            //console.log("P3 Valid")
          }else if(p3.ageoutTimestamp < Math.floor(Date.now() / 10 ** 3)){
            //console.log("P3 Retired")
            playersOfAge = false
          }

          if(p4.ageoutTimestamp >= Math.floor(Date.now() / 10 ** 3)){
            //console.log("P4 Valid")
          }else if(p4.ageoutTimestamp < Math.floor(Date.now() / 10 ** 3)){
            //console.log("P4 Retired")
            playersOfAge = false
          }

          if(p5.ageoutTimestamp >= Math.floor(Date.now() / 10 ** 3)){
            //console.log("P5 Valid")
          }else if(p5.ageoutTimestamp < Math.floor(Date.now() / 10 ** 3)){
            //console.log("P5 Retired")
            playersOfAge = false
          }

          if(p6.ageoutTimestamp >= Math.floor(Date.now() / 10 ** 3)){
            //console.log("P6 Valid")
          }else if(p6.ageoutTimestamp < Math.floor(Date.now() / 10 ** 3)){
            //console.log("P6 Retired")
            playersOfAge = false
          }



          let w
          let l
          if (playersOfAge == true){    
            const moralisRes = await Moralis.Cloud.run("getWL")
            w = moralisRes.w 
            l = moralisRes.l 
         }else if(playersOfAge == false){
             w = ''
             l = ''
         }
  
          let t2OP
          let t2DP
          if(difficulty == 1){
              t2OP = opStat1
                t2DP = dpStat1
          }else if(difficulty == 2){
              t2OP = opStat2
              t2DP = dpStat2
          }else if(difficulty == 3){
              t2OP = opStat3
              t2DP = dpStat3
          }  
          
          let range = 200000
          
          let scoringRange = 100
          let hitThePostRange = 75
          let shotOnGoalRange = 1000
          
          let range1 = scoringRange + (teamOP - t2DP)
          let range2 = range1 + hitThePostRange
          let range3 = range2 + shotOnGoalRange
          let range6 = (range - scoringRange)-(t2OP - teamDP)
          let range5 = range6 - hitThePostRange
          let range4 = range5 - shotOnGoalRange
          
          let t1Score = 0
          let t2Score = 0
          
          let t1SOG = 0
          let t2SOG = 0
          
          let OTscoringRange = 300
          let OThitThePostRange = 150
          let OTshotOnGoalRange = 3000
          
          let otRange1 = OTscoringRange + (teamOP - t2DP)
          let otRange2 = otRange1 + OThitThePostRange
          let otRange3 = otRange2 + OTshotOnGoalRange
          let otRange6 = (range - OTscoringRange)-(t2OP - teamDP)
          let otRange5 = otRange6 - OThitThePostRange
          let otRange4 = otRange5 - OTshotOnGoalRange
  
          let t1RegScore = 0
          let t2RegScore = 0
  
          let t1OTScore = 0
          let t2OTScore = 0
          
          let t1SORange = (parseInt(teamOP) + parseInt(t2DP))
          let t2SORange = (parseInt(t2OP) + parseInt(teamDP))
              
          
          let t1SOScore = 0
          let t2SOScore = 0
  
          let generatingGameLog = true
    

          
          
          let gameObj = {}
          for(let i=0; i < 3600; i++){
            let rando = Math.floor(Math.random() * range)
            let event
            if(rando <= range1){
              event = "T1 Scores"
              t1Score++
              t1RegScore++
              t1SOG++
            }else if(rando > range1 && rando <= range2){
              event = "T1 Hits the Post" 
            }else if(rando > range2 && rando <= range3){
              event = "T1 Shot on Goal"
              t1SOG++ 
            }else if(rando > range3 && rando <= range4){
              event = "Nothing" 
            }else if(rando > range4 && rando <= range5){
              event = "T2 Shot on Goal"
              t2SOG++ 
            }else if(rando > range5 && rando <= range6){
              event = "T2 Hits the Post" 
            }else if(rando > range6){
              event = "T2 Scores"
              t2Score++
              t2RegScore++
              t2SOG++ 
            }
            if(event != "Nothing"){
              gameObj[i] = event
            }
    
          }
          //end Regulation Object
        
        
        let overTimeObj = {}
        if(t1Score == t2Score){
            for(let i=0; i < 300; i++){
            let randoOT = Math.floor(Math.random() * range)
            let event
            if(randoOT <= otRange1){
                event = "T1 Scores"
                t1OTScore++
                overTimeObj[i] = event
                t1Score++
                break
            }else if(randoOT > otRange1 && randoOT <= otRange2){
                event = "T1 Hits the Post"
                overTimeObj[i] = event 
            }else if(randoOT > otRange2 && randoOT <= otRange3){
                event = "T1 Shot on Goal"
                t1SOG++
                overTimeObj[i] = event 
            }else if(randoOT > otRange3 && randoOT <= otRange4){
                event = "Nothing" 
            }else if(randoOT > otRange4 && randoOT <= otRange5){
                event = "T2 Shot on Goal"
                t2SOG++
                overTimeObj[i] = event 
            }else if(randoOT > otRange5 && randoOT <= otRange6){
                 event = "T2 Hits the Post"
                 overTimeObj[i] = event 
            }else if(randoOT > otRange6){
                event = "T2 Scores"
                t2OTScore++
                overTimeObj[i] = event
                t2Score++
                break 
            }
          } 
        } //end OT OBJ
        
        
        let shootoutObj = {}
        let randoSO
        let extraRound
        if(t1Score == t2Score && t1OTScore == t2OTScore){
    
                for(let i=0; i < 300; i++){
            
                    if(i <= 5){
                    
                            if(i == 0){
                                randoSO = Math.floor(Math.random() * t1SORange)
                                if (randoSO <= teamOP){
                                shootoutObj[i] = "T1 Scores" 
                                t1SOScore++
                                }else if(randoSO > teamOP){
                                shootoutObj[i] = "T1 Misses"
                                }
                            }
                    
                            if(i == 1){
                                randoSO = Math.floor(Math.random() * t2SORange)
                                if (randoSO <= t2OP){
                                shootoutObj[i] = "T2 Scores" 
                                t2SOScore++
                                }else if(randoSO > teamOP){
                                shootoutObj[i] = "T2 Misses"
                                }
                            }
                    
                            if(i == 2){
                                randoSO = Math.floor(Math.random() * t1SORange)
                                if (randoSO <= teamOP){
                                shootoutObj[i] = "T1 Scores" 
                                t1SOScore++
                                }else if(randoSO > teamOP){
                                shootoutObj[i] = "T1 Misses"
                                }
                            }
                    
                            if(i == 3){
                                randoSO = Math.floor(Math.random() * t2SORange)
                                if (randoSO <= t2OP){
                                shootoutObj[i] = "T2 Scores" 
                                t2SOScore++
                                if(t2SOScore == 2 && t1SOScore == 0){
                                  t2Score++
                                  break
                                }
                                }else if(randoSO > teamOP){
                                  shootoutObj[i] = "T2 Misses"
                                  if(t1SOScore == 2 && t2SOScore == 0){
                                    t1Score++
                                    break
                                  }
                                }
                            }
                    
                            if(i == 4){
                                randoSO = Math.floor(Math.random() * t1SORange)
                                if (randoSO <= teamOP){
                                  shootoutObj[i] = "T1 Scores" 
                                  t1SOScore++
                                  if(t1SOScore - t2SOScore == 2){
                                    t1Score++
                                    break
                                  }
                                }else if(randoSO > teamOP){
                                  shootoutObj[i] = "T1 Misses"
                                  if(t2SOScore > t1SOScore){
                                    t2Score++
                                    break
                                  }
                                }
                            }
                    
                            if(i == 5){
                              randoSO = Math.floor(Math.random() * t2SORange)
                                if (randoSO <= t2OP){
                                  shootoutObj[i] = "T2 Scores" 
                                  t2SOScore++
                                  if(t2SOScore > t1SOScore){
                                    t2Score++
                                    break
                                  }
                                }else if(randoSO > teamOP){
                                  shootoutObj[i] = "T2 Misses"
                                  if(t2SOScore < t1SOScore){
                                    t1Score++
                                    break
                                  }
                                }
                            } 
    
                    }else if(i > 5) {
    
                    
                    
                    if(i % 2 == 0){
                        let randoSO = Math.floor(Math.random() * t1SORange)
                        if (randoSO <= teamOP){
                            shootoutObj[i] = "T1 Scores"
                            t1SOScore++
                            extraRound = 1
                        }else if(randoSO > teamOP){
                            shootoutObj[i] = "T1 Misses"
                            extraRound = 0
                        }
                    }
                    
                    if(i % 2 != 0){
                        let randoSO = Math.floor(Math.random() * t2SORange)
                        if (randoSO <= t2OP){
                            shootoutObj[i] = "T2 Scores"
                            t2SOScore++
                              if(extraRound == 0){
                                t2Score++
                                break
                              }
                            }else if(randoSO > t2OP){
                            shootoutObj[i] = "T2 Misses"
                              if(extraRound == 1){
                                t1Score++
                                break
                              }
                            }
                        }
                      
                    }
                
                
              }
                
        }    //end Shootout Obj
  
  //Token Creation
  
  let wl
  if(t1Score > t2Score){
    wl = w
  }else if(t2Score > t1Score){
    wl = l
  }
  
  //console.log(signer)
  const sender = await signer.getAddress()
  //console.log(sender)
//['address', 'uint8 ', 'uint8 ','uint8 ','uint8 ','uint8 ','uint8 '],
//console.log([sender, wl, parseInt(thisMatchupNo), difficulty, teamID, t1Score, t2Score])
  //let paylmatchValidTokenoad = ethers.utils.keccak256( [sender, wl, parseInt(thisMatchupNo), difficulty, teamID, t1Score, t2Score]);

  let matchValidToken = ethers.utils.solidityKeccak256(['address', 'uint', 'uint','uint','uint','uint','uint'], [sender, wl, parseInt(thisMatchupNo), difficulty, teamID, t1Score, t2Score])
  //console.log({sender: sender, matchValidToken:matchValidToken, muchupNo:  parseInt(thisMatchupNo), difficulty:difficulty, teamID:teamID, t1Score:t1Score, t2Score:t2Score})
  let bcResultTransaction = await pvcMatchhupsInstance.rewardMatchup(matchValidToken, difficulty, teamID, t1Score, t2Score)
  let bcResult = await bcResultTransaction.wait()
  //console.log(bcResult)
  //console.log(bcResult.status) 
  let result
  if(bcResult.status == true){

          result = {difficultyMod:difficultyMod, 
                        opStat1:opStat1, 
                        dpStat1:dpStat1, 
                        opStat2:opStat2, 
                        dpStat2:dpStat2, 
                        opStat3:opStat3, 
                        dpStat3:dpStat3,
                        t2OP:t2OP,
                        t2DP:t2DP,
                        teamID: teamID,
                        playerIDs: playerIDs,
                        gameObj: gameObj,
                        gameOverTimeObj:overTimeObj,
                        gameShootoutObj:shootoutObj,
                        teamOP:teamOP,
                        teamDP:teamDP,
                        range1:range1,
                        range2:range2,
                        range3:range3,
                        range4:range4,
                        range5:range5,
                        range6:range6,
                        otRange1:otRange1,
                        otRange2:otRange2,
                        otRange3:otRange3,
                        otRange4:otRange4,
                        otRange5:otRange5,
                        otRange6:otRange6,
                        t1Score:t1Score,
                        t2Score:t2Score,
                        t1RegScore:t1RegScore,
                        t2RegScore:t2RegScore,
                        t1OTScore:t1OTScore,
                        t2OTScore:t2OTScore,
                        t1SOG:t1SOG,
                        t2SOG:t2SOG,
                        t1SORange:t1SORange,
                        t2SORange:t2SORange,
                        t1SOScore:t1SOScore,
                        t2SOScore:t2SOScore,
                        matchValidToken:matchValidToken,
                        matchupNos:matchupNos,
                        mu1:mu1,
                        mu2:mu2,
                        mu3:mu3,
                        thisMatchupNo:thisMatchupNo,
                        bcResult:bcResult    
                       }
                    }else if(bcResult.status == false){
                        result = {bcResult: ''}
                    }
               
                   

        return(result);
                      
                      
            
      }

      export default {
        performPvC,
      }