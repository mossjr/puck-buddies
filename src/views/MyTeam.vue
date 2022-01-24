<template>
  <div class="myteam">
    <!-- <button id="team-action-button" @click="mintTeam()" v-if="totalTeamsFound < 1 && playersLoaded">Mint New Team</button> -->
    <!-- <button @click="loadPvCmatches()">TEST</button>
    <input v-model="PBXPqtyToMint" type="number">
    <button @click="newPBXPtoTeamContract(PBXPqtyToMint)">Mint new PBXP</button> -->
    <img src="../assets/img/my-team.png" alt="my-team">

    <div v-for="(team, index) in teams" :key="index">
        <div class="team-name-container">
        <div class="team-name">The {{cityNames[team.teamCityNumber].city}} <i>{{nouns[team.teamNounNumber].noun}}</i></div>
      </div>
      <div v-if="team.activePlayerCount == 6">
      <!-- <button id="team-action-button" v-if="!matchesLoaded && !matchesLoading" @click="loadPvCmatches(team.teamId)">Load Matcheups</button> -->
      <div class="loading-icon-container">
            <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="matchesLoading && !matchesLoaded">
        </div>

      <div v-if="matchesLoaded && !matchPlaying">
        <div class="loading-icon-container">
            <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="matchesLoading">
        </div>

        <div v-if="!matchesLoading && !lockMatchups30s" class="vs-team-stats">
          <img src="../assets/img/vs-red.png" alt="">
          <div id="team1PvC">
            <div>
              <!-- <img src="../assets/img/prct-matcup.png" alt="Practice Matchup">     -->
            </div>
            <button v-if="timestamp >= activeTo1" @click="moralisRunPvC('PB-BRB', nouns[team.teamNounNumber].noun, nouns[matches.team1NounNumber].noun, 1, team.teamId, matchUpNo1 )" id="team-pvc-button"><h1>The {{cityNames[matches.team1CityNumber].city}} <i>{{nouns[matches.team1NounNumber].noun}}</i></h1><p> OP: {{matches.opStat1}} DP: {{matches.dpStat1}}</p></button>
            <button v-if="timestamp < activeTo1 && matches.won1" id="team-pvc-won"><h2><b>VICTORY!</b></h2> <br>Please wait for next Matchup to become availble.</button>
            <button v-if="timestamp < activeTo1 && !matches.won1" id="team-pvc-lost"><h2><b>DEFEAT!</b></h2> <br>Please wait for next Matchup to become availble.</button>
          </div>
          <div v-if="timestamp <activeTo1" class="progress-bar-container">
              <div class="progress1" id="play-animation" :style="{width: progressPercent1 + '%', 'background-color': '#'+ progressColor1}"></div>
          </div>
          <div id="team2PvC">
            <div>
              <!-- <img src="../assets/img/exhb-matcup.png" alt="Exhibition Matchup">     -->
            </div>
            <button v-if="timestamp >= activeTo2"  @click="moralisRunPvC('PB-BRB', nouns[team.teamNounNumber].noun, nouns[matches.team2NounNumber].noun, 2, team.teamId, matchUpNo2 )" id="team-pvc-button"><h1>The {{cityNames[matches.team2CityNumber].city}} <i>{{nouns[matches.team2NounNumber].noun}}</i></h1><p> OP: {{matches.opStat2}} DP: {{matches.dpStat2}}</p></button>
            <button v-if="timestamp < activeTo2 && matches.won2" id="team-pvc-won"><h2><b>VICTORY!</b></h2> <br>Please wait for next Matchup to become availble.</button>
            <button v-if="timestamp < activeTo2 && !matches.won2" id="team-pvc-lost"><h2><b>DEFEAT!</b></h2> <br>Please wait for next Matchup to become availble.</button>
            <div v-if="timestamp < activeTo2" class="progress-bar-container">
              <div class="progress2" id="play-animation" :style="{width: progressPercent2 + '%', 'background-color': '#'+ progressColor2}"></div>
            </div>
          </div>
          <div id="team3PvC">
            <div>
              <!-- <img src="../assets/img/comp-matcup.png" alt="Competative Matchup">     -->
            </div>
            <button v-if="timestamp >= activeTo3"  @click="moralisRunPvC('PB-BRB', nouns[team.teamNounNumber].noun, nouns[matches.team3NounNumber].noun, 3, team.teamId, matchUpNo3 )" id="team-pvc-button"><h1>The {{cityNames[matches.team3CityNumber].city}} <i>{{nouns[matches.team3NounNumber].noun}}</i></h1><p> OP: {{matches.opStat3}} DP: {{matches.dpStat3}}</p></button>
            <button v-if="timestamp < activeTo3 && matches.won3" id="team-pvc-won"><h2><b>VICTORY!</b></h2> <br>Please wait for next Matchup to become availble.</button>
            <button v-if="timestamp < activeTo3 && !matches.won3" id="team-pvc-lost"><h2><b>DEFEAT!</b></h2> <br>Please wait for next Matchup to become availble.</button>
            <div v-if="timestamp < activeTo3" class="progress-bar-container">
              <div class="progress3" id="play-animation" :style="{width: progressPercent3 + '%', 'background-color': '#'+ progressColor3}"></div>
            </div>
          </div>
          <!-- <div class="noraml-updating-timer" v-if="secondsTillChange > 60">Refreshing Opponent Stats in {{minsTillChange}} minutes</div>
          <div class="noraml-updating-timer" v-if="secondsTillChange <= 60">Refreshing Opponent Stats in {{secondsTillChange}} seconds</div> -->
        </div>

        <!-- <div v-if="lockMatchups30s">
          <img src="../assets/img/back-soon.png" alt="Back Soon">
          <div class="noraml-updating-timer">Refreshing Opponent Stats in {{secondsTillChange}} seconds</div>
        </div> -->
      </div>
        <!-- <div>
          <button id="team-action-button" @click="openNewPvPmodal(team.teamId, team.opTotal, team.dpTotal, team.teamDna)">Create a PvP Matchup</button>
        </div> -->
    </div>
      




      
      <div class="team-stats">
        <div class="team-data">OP: {{team.opTotal}}</div>
        <div class="team-data">DP: {{team.dpTotal}}</div>
        <!-- <div class="team-data">OP: {{team.teamTotalOP}}</div>
        <div class="team-data">DP: {{team.teamTotalDP}}</div> -->
      </div>




    <div >
      <div class="player-container-team" v-for="(team, index) in teams" :key="index">
        <div class="player-container-inside">
          <div class="card" v-if="!team.pos1ret">
            <h4>Center</h4>
            <canvas v-if="team.playerPos1" class="player-canvas" :id="`canvas-player-no-${team.playerPos1}`">
            </canvas>
            <button v-if="!team.playerPos1" @click="openModal('Center', 1, 1, team.teamId, team.teamDna)" id="team-action-button">Assign Center</button>
            <button v-if="team.playerPos1 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 1)" id="bench-action-button">Bench Center</button>
            <button v-if="team.playerPos1 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos1ret">
            <h4>Center</h4>
            <canvas v-if="team.playerPos1" class="player-canvas" :id="`canvas-player-no-${team.playerPos1}`">
            </canvas>
            <button v-if="!team.playerPos1" @click="openModal('Center', 1, 1, team.teamId, team.teamDna)" id="team-action-button">Assign Center</button>
            <button v-if="team.playerPos1 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 1)" id="bench-action-button">Bench Center</button>
            <button v-if="team.playerPos1 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos2ret">
            <h4>Right Wing</h4>
            <canvas v-if="team.playerPos2" class="player-canvas" :id="`canvas-player-no-${team.playerPos2}`">
            </canvas>
            <button v-if="!team.playerPos2" @click="openModal('Right Wing', 1, 2, team.teamId, team.teamDna)" id="team-action-button">Assign Right Wing</button>
            <button v-if="team.playerPos2 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 2)" id="bench-action-button">Bench Right Wing</button>
            <button v-if="team.playerPos2 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos2ret">
            <h4>Right Wing</h4>
            <canvas v-if="team.playerPos2" class="player-canvas" :id="`canvas-player-no-${team.playerPos2}`">
            </canvas>
            <button v-if="!team.playerPos2" @click="openModal('Right Wing', 1, 2, team.teamId, team.teamDna)" id="team-action-button">Assign Right Wing</button>
            <button v-if="team.playerPos2 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 2)" id="bench-action-button">Bench Right Wing</button>
            <button v-if="team.playerPos2 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos3ret">
            <h4>Left Wing</h4>
            <canvas v-if="team.playerPos3" class="player-canvas" :id="`canvas-player-no-${team.playerPos3}`">
            </canvas>
            <button v-if="!team.playerPos3" @click="openModal('Left Wing', 1, 3, team.teamId, team.teamDna)" id="team-action-button">Assign Left Wing</button>
            <button v-if="team.playerPos3 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 3)" id="bench-action-button">Bench Left Wing</button>
            <button v-if="team.playerPos3 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos3ret">
            <h4>Left Wing</h4>
            <canvas v-if="team.playerPos3" class="player-canvas" :id="`canvas-player-no-${team.playerPos3}`">
            </canvas>
            <button v-if="!team.playerPos3" @click="openModal('Left Wing', 1, 3, team.teamId, team.teamDna)" id="team-action-button">Assign Left Wing</button>
            <button v-if="team.playerPos3 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB',3)" id="bench-action-button">Bench Left Wing</button>
            <button v-if="team.playerPos3 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos4ret">
            <h4>Right Defence</h4>
             <canvas v-if="team.playerPos4" class="player-canvas" :id="`canvas-player-no-${team.playerPos4}`">
            </canvas>
            <button v-if="!team.playerPos4" @click="openModal('Right Defence', 2, 4, team.teamId, team.teamDna)" id="team-action-button">Assign Right Defence</button>
            <button v-if="team.playerPos4 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 4)" id="bench-action-button">Bench Right Defence</button>
            <button v-if="team.playerPos4 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos4ret">
            <h4>Right Defence</h4>
             <canvas v-if="team.playerPos4" class="player-canvas" :id="`canvas-player-no-${team.playerPos4}`">
            </canvas>
            <button v-if="!team.playerPos4" @click="openModal('Right Defence', 2, 4, team.teamId, team.teamDna)" id="team-action-button">Assign Right Defence</button>
            <button v-if="team.playerPos4 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB',4)" id="bench-action-button">Bench Right Defence</button>
            <button v-if="team.playerPos4 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos5ret">
            <h4>Left Defence</h4>
            <canvas v-if="team.playerPos5" class="player-canvas" :id="`canvas-player-no-${team.playerPos5}`">
            </canvas>
            <button v-if="!team.playerPos5" @click="openModal('Left Defence', 2, 5, team.teamId, team.teamDna)" id="team-action-button">Assign Left Defence</button>
            <button v-if="team.playerPos5 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 5)" id="bench-action-button">Bench Left Defence</button>
            <button v-if="team.playerPos5 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos5ret">
            <h4>Left Defence</h4>
            <canvas v-if="team.playerPos5" class="player-canvas" :id="`canvas-player-no-${team.playerPos5}`">
            </canvas>
            <button v-if="!team.playerPos5" @click="openModal('Left Defence', 2, 5, team.teamId, team.teamDna)" id="team-action-button">Assign Left Defence</button>
            <button v-if="team.playerPos5 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 5)" id="bench-action-button">Bench Left Defence</button>
            <button v-if="team.playerPos5 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos6ret">
            <h4>Goalie</h4>
            <canvas v-if="team.playerPos6" class="player-canvas" :id="`canvas-player-no-${team.playerPos6}`">
            </canvas>
            <button v-if="!team.playerPos6" @click="openModal('Goalie', 3, 6, team.teamId, team.teamDna)" id="team-action-button">Assign Goalie</button>
            <button v-if="team.playerPos6 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 6)" id="bench-action-button">Bench Goalie</button>
            <button v-if="team.playerPos6 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos6ret">
            <h4>Goalie</h4>
            <canvas v-if="team.playerPos6" class="player-canvas" :id="`canvas-player-no-${team.playerPos6}`">
            </canvas>
            <button v-if="!team.playerPos6" @click="openModal('Goalie', 3, 6, team.teamId, team.teamDna)" id="team-action-button">Assign Goalie</button>
            <button v-if="team.playerPos6 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', 6)" id="bench-action-button">Bench Goalie</button>
            <button v-if="team.playerPos6 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>      

        </div>
        

        
      </div>
    </div>
        <!-- <div>
          <button id="team-action-button" >{{timestamp}} <br> {{hourtimestamp}} <br> {{secondsTillChange}} <br> {{minsTillChange}}:{{secLessMinsTillChange}}</button>
        </div> -->

    </div>

  
    
<div v-if="showAssignModal">
<AssignPlayerModal @closeAssignPlayerModal="closeModal()" :position="modalPosition" :modalPos="modalPosName" :playerType="modalPlayerType" :teamDna="teamDna"/>
</div>

<div v-if="showNewPvPmodal">
  <TeamNewPvPmodal @closeNewPvPModal="closeNewPvPModal()" :teamId="modalTeam" :opTotal="modalPvPOP" :dpTotal="modalPvPDP" :teamDna="modalTeamDNA"/>
</div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div> 
<div v-if="screenLockedPlay">
  <MatchupLock @closePvCModal="closePvCModal()" :splashImage="splashImage" :gameLog="gameLog" :myTeamNoun="myTeamNoun" :oppTeamNoun="oppTeamNoun" />
</div> 

</div>
</template>

<script>
import main from '../main.js'
import gameplay from '../gameplay.js'
import buildCanvas from '../scripts/buildPlayer.js'
import AssignPlayerModal from '../components/AssignPlayerModal.vue'
import TeamNewPvPmodal from '../components/TeamNewPvPmodal.vue'
import LockModal from '../components/LockModal.vue'
import MatchupLock from '../components/MatchupLock.vue'

export default {
  components: { AssignPlayerModal,
                TeamNewPvPmodal,
                LockModal,
                MatchupLock },
  data(){
    return{
      teams: [],
      teamPlayers: 0,
      players: [],
      matches: {},
      pageTeamId:'',
      totalFoundPlayers: 0,
      offenceFound: 0,
      defenceFound: 0,
      goaliesFound: 0,
      loadingTeams: true,
      playersLoaded: false,
      totalTeamsFound: 0,
      showAssignModal: false,
      showNewPvPmodal: false,
      modalTeam: '',
      modalPosition: '',
      modalPosName: '',
      modalPlayerType: '',
      modalPvPOP:'',
      modalPvPDP:'',
      modalTeamDNA:'',
      cityNames: [],
      nouns: [],
      teamDna: '',
      buddiesReward:''.id,
      matchesLoaded: false,
      matchesLoading: false,
      matchPlaying: false,
      PBXPqtyToMint: '',
      myFunds:'',
      myXp:'',
      timestamp:0,
      hourtimestamp:0,
      secondsTillChange:0,
      minsTillChange:0,
      secLessMinsTillChange:0,
      progressPercent1:'',
      progressPercent2:'',
      progressPercent3:'',
      activeTo1:'',
      activeTo2:'',
      activeTo3:'',
      maxActiveTo:'',
      progressColor1:'',
      progressColor2:'',
      progressColor3:'',
      lockMatchups30s:false,
      sixActivePlayers: false,
      splashImage: '',
      screenLocked:false,
      screenLockedPlay: false,
      playerIdArray: [],
      gameLog:{},
      teamNames:{},
      myTeamNoun:'',
      oppTeamNoun:'',
      matchUpNo1:'',
      matchUpNo2:'',
      matchUpNo3:'',
      loadCount:0,

    }
  },

  methods:{

    async mintNewTeamMoralis(){
      await main.mintNewTeamMoralis().then(res => {
        ////console.log(res)
      }).catch(err => {
        ////console.log(err)
      })
    },

    async moralisRunPvC(_splashImage, _myTeamNoun, _oppTeamNoun, _difficulty, _teamId, _muNo){
      this.matchPlaying = true
      this.myTeamNoun = _myTeamNoun
      this.oppTeamNoun = _oppTeamNoun
      this.splashImage = _splashImage
      this.screenLocked = true
      await gameplay.performPvC(this.playerIdArray, _teamId, _difficulty).then(async res =>{
        //////console.log(res)
        this.gameLog = res
        if(res.bcResult == ''){
          this.screenLocked = false
          alert("Something went wrong, please try again")
          return
        }else if (res.bcResult != ''){
          this.screenLocked = false
          this.screenLockedPlay = true
        }
      }).catch(err =>{
        console.log(err)
        this.screenLocked = false
        this.screenLockedPlay = false
        alert("Error Detected")
      })
    },

  convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
},

    async getTeamDetails(){
        await main.displayTeam().then(res => { 
        let teamArray = []
        let playerArray = [] 

         let teamDNA = res.teamDna
          teamDNA = teamDNA.toString()
          ////console.log(teamDNA)
          let teamCityStarter = parseInt(teamDNA.slice(1,4))
          let teamCityNumber = Math.floor((teamCityStarter/1000) * 529)
          let teamNounNumber1 = parseInt(teamDNA.slice(5,9))
          
          ////console.log("Team Number 1: " + teamNounNumber1)
          let teamNounNumber = Math.floor(this.convertRange(teamNounNumber1, [0,9999], [1,3142]))
      
          ////console.log("Team Number: " + teamNounNumber)

          let teamName = this.nouns[teamNounNumber].noun
          let teamLetter = teamName.slice(0,1)        
          //////console.log(teamLetter)
        
        if(res.p1.id != ""){
          ////console.log("Player POS 1 Found")
            let isOff
            let isDef
            let isGoal
            if(res.p1.playertype == 1){
              isOff = true
              isDef = false
              isGoal = false
            }else if (res.p1.playertype == 2){
              isOff = false
              isDef = true
              isGoal = false
            }else if (res.p1.playertype == 3){
              isOff = false
              isDef = false
              isGoal = true
            }
     
         playerArray.push({
              'id': res.p1.id, 
              'offence': res.p1.offence,  
              'defence': res.p1.defence, 
              'dna': res.p1.dna, 
              'playertype' : res.p1.playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res.teamId,
              'teamLetter': teamLetter,
              'position' : 1,
              'equippedJersey' : res.p1.equippedJersey,
              'equippedStick' : res.p1.equippedStick,
              'equippedToken' : res.p1.equippedToken,
              'ageoutTimestamp': res.p1.ageoutTimestamp,
              'draftTimestamp': res.p1.draftTimestamp
              }) 
        
        }


 if(res.p2.id != 0){
            let isOff
            let isDef
            let isGoal
            if(res.p2.playertype == 1){
              isOff = true
              isDef = false
              isGoal = false
            }else if (res.p2.playertype == 2){
              isOff = false
              isDef = true
              isGoal = false
            }else if (res.p2.playertype == 3){
              isOff = false
              isDef = false
              isGoal = true
            }
     
         playerArray.push({
              'id': res.p2.id, 
              'offence': res.p2.offence,  
              'defence': res.p2.defence, 
              'dna': res.p2.dna, 
              'playertype' : res.p2.playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res.teamId,
              'teamLetter': teamLetter,
              'position' : 2,
              'equippedJersey' : res.p2.equippedJersey,
              'equippedStick' : res.p2.equippedStick,
              'equippedToken' : res.p2.equippedToken,
              'ageoutTimestamp': res.p2.ageoutTimestamp,
              'draftTimestamp': res.p2.draftTimestamp
              }) 
        } 


         if(res.p3.id != 0){
            let isOff
            let isDef
            let isGoal
            if(res.p3.playertype == 1){
              isOff = true
              isDef = false
              isGoal = false
            }else if (res.p3.playertype == 2){
              isOff = false
              isDef = true
              isGoal = false
            }else if (res.p3.playertype == 3){
              isOff = false
              isDef = false
              isGoal = true
            }
     
         playerArray.push({
              'id': res.p3.id, 
              'offence': res.p3.offence,  
              'defence': res.p3.defence, 
              'dna': res.p3.dna, 
              'playertype' : res.p3.playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res.teamId,
              'teamLetter': teamLetter,
              'position' : 3,
              'equippedJersey' : res.p3.equippedJersey,
              'equippedStick' : res.p3.equippedStick,
              'equippedToken' : res.p3.equippedToken,
              'ageoutTimestamp': res.p3.ageoutTimestamp,
              'draftTimestamp': res.p3.draftTimestamp
              }) 
        } 


         if(res.p4.id != 0){
            let isOff
            let isDef
            let isGoal
            if(res.p4.playertype == 1){
              isOff = true
              isDef = false
              isGoal = false
            }else if (res.p4.playertype == 2){
              isOff = false
              isDef = true
              isGoal = false
            }else if (res.p4.playertype == 3){
              isOff = false
              isDef = false
              isGoal = true
            }
     
         playerArray.push({
              'id': res.p4.id, 
              'offence': res.p4.offence,  
              'defence': res.p4.defence, 
              'dna': res.p4.dna, 
              'playertype' : res.p4.playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res.teamId,
              'teamLetter': teamLetter,
              'position' : 4,
              'equippedJersey' : res.p4.equippedJersey,
              'equippedStick' : res.p4.equippedStick,
              'equippedToken' : res.p4.equippedToken,
              'ageoutTimestamp': res.p4.ageoutTimestamp,
              'draftTimestamp': res.p4.draftTimestamp
              }) 
        } 


         if(res.p5.id != 0){
            let isOff
            let isDef
            let isGoal
            if(res.p5.playertype == 1){
              isOff = true
              isDef = false
              isGoal = false
            }else if (res.p5.playertype == 2){
              isOff = false
              isDef = true
              isGoal = false
            }else if (res.p5.playertype == 3){
              isOff = false
              isDef = false
              isGoal = true
            }
     
         playerArray.push({
              'id': res.p5.id, 
              'offence': res.p5.offence,  
              'defence': res.p5.defence, 
              'dna': res.p5.dna, 
              'playertype' : res.p5.playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res.teamId,
              'teamLetter': teamLetter,
              'position' : 5,
              'equippedJersey' : res.p5.equippedJersey,
              'equippedStick' : res.p5.equippedStick,
              'equippedToken' : res.p5.equippedToken,
              'ageoutTimestamp': res.p5.ageoutTimestamp,
              'draftTimestamp': res.p5.draftTimestamp
              }) 
        } 


         if(res.p6.id != 0){
            let isOff
            let isDef
            let isGoal
            if(res.p6.playertype == 1){
              isOff = true
              isDef = false
              isGoal = false
            }else if (res.p6.playertype == 2){
              isOff = false
              isDef = true
              isGoal = false
            }else if (res.p6.playertype == 3){
              isOff = false
              isDef = false
              isGoal = true
            }
     
         playerArray.push({
              'id': res.p6.id, 
              'offence': res.p6.offence,  
              'defence': res.p6.defence, 
              'dna': res.p6.dna, 
              'playertype' : res.p6.playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res.teamId,
              'teamLetter': teamLetter,
              'position' : 6,
              'equippedJersey' : res.p6.equippedJersey,
              'equippedStick' : res.p6.equippedStick,
              'equippedToken' : res.p6.equippedToken,
              'ageoutTimestamp': res.p6.ageoutTimestamp,
              'draftTimestamp': res.p6.draftTimestamp
              }) 
        } 
        ////console.log(playerArray)
        this.teamPlayers == playerArray.length

         

          let currentTime = Math.floor(Date.now() / 10 ** 3)
          let pos1ret = false
          let pos2ret = false
          let pos3ret = false
          let pos4ret = false
          let pos5ret = false
          let pos6ret = false
      
          if(res.p1.ageoutTimestamp > currentTime){pos1ret = false} else {pos1ret = true}
          if(res.p2.ageoutTimestamp > currentTime){pos2ret = false} else {pos2ret = true}
          if(res.p3.ageoutTimestamp > currentTime){pos3ret = false} else {pos3ret = true}
          if(res.p4.ageoutTimestamp > currentTime){pos4ret = false} else {pos4ret = true}
          if(res.p5.ageoutTimestamp > currentTime){pos5ret = false} else {pos5ret = true}
          if(res.p6.ageoutTimestamp > currentTime){pos6ret = false} else {pos6ret = true}
          let activePlayerCount = 0;
          
          if(pos1ret == false){activePlayerCount = activePlayerCount +1}
          if(pos2ret == false){activePlayerCount = activePlayerCount +1}
          if(pos3ret == false){activePlayerCount = activePlayerCount +1}
          if(pos4ret == false){activePlayerCount = activePlayerCount +1}
          if(pos5ret == false){activePlayerCount = activePlayerCount +1}
          if(pos6ret == false){activePlayerCount = activePlayerCount +1}

          this.playerIdArray = [res.p1.id,res.p2.id,res.p3.id,res.p4.id,res.p5.id,res.p6.id]

         teamArray.push({
            'teamId': res.teamId,
            'teamDna': res.teamDna,
            'teamTotalOP': res.teamTotalOP,
            'teamTotalDP': res.teamTotalDP,
            'teamCityNumber': teamCityNumber,
            'teamNounNumber': teamNounNumber,
            'teamLetter': teamLetter,
            'timeActive': res.timeActive,
            'gamesPlayed': res.gamesPlayed,
            'equippedItem': res.equippedItem,
            'playerPos1': res.p1.id,
            'playerPos1OP': res.p1.offence,
            'playerPos1DP': res.p1.defence,
            'pos1ret':pos1ret,
            'playerPos2': res.p2.id,
            'playerPos2OP': res.p2.offence,
            'playerPos2DP': res.p2.defence,
            'pos1ret':pos2ret,
            'playerPos3': res.p3.id,
            'playerPos3OP': res.p3.offence,
            'playerPos3DP': res.p3.defence,
            'pos1ret':pos3ret,
            'playerPos4': res.p4.id,
            'playerPos4OP': res.p4.offence,
            'playerPos4DP': res.p4.defence,
            'pos1ret':pos4ret,
            'playerPos5': res.p5.id,
            'playerPos5OP': res.p5.offence,
            'playerPos5DP': res.p5.defence,
            'pos1ret':pos5ret,
            'playerPos6': res.p6.id,
            'playerPos6OP': res.p6.offence,
            'playerPos6DP': res.p6.defence,
            'pos1ret':pos6ret,
            'opTotal': res.teamTotalOP,
            'dpTotal': res.teamTotalDP,
            'activePlayerCount': activePlayerCount
          })

        this.loadingTeams = false
        this.matchPlaying = false
        return {teamArray: teamArray, players: playerArray }
      })
      .then(res2 => {
        let res = res2.teamArray
        for (let i = 0; i < res2.players.length; i++){
         buildCanvas.preloadPlayerInfo(res2.players[i].id, res2.players[i], "player-no")
        }
        //////console.log("Active Player Count: " + res)
        ////console.log(res)
        if(res2.teamArray[0].activePlayerCount == 6){
          this.sixActivePlayers = true
        }        
        this.totalTeamsFound = res.length
        this.teams = res
        this.playersLoaded = true
        this.loadPvCmatches(res2.teamArray[0].teamId)
        this.pageTeamId = res2.teamArray[0].teamId
        this.updateBalanceViewer()
        this.updateXpBalanceViewer()
      })
      .catch((err) => {
        console.log("Error rendering Teams: " + err)
        console.log(err)
        this.totalTeamsFound = 0
        this.teams = null
        this.playersLoaded = true
        this.updateBalanceViewer()
        this.updateXpBalanceViewer()
      })
    },

    async benchPlayer(_splashImage, _posID){
      this.splashImage = _splashImage
      this.screenLocked = true
      //////console.log(_teamId)
      //////console.log(_position)
      
      await main.removeFromPosition(_posID).then(res => {
        this.screenLocked = false
        this.getTeamDetails()
        this.updateBalanceViewer()
        this.updateXpBalanceViewer()
        
      })
      .catch(err => {
        this.screenLocked = false
        console.log(err)
        this.sendPlayerData()
        this.updateBalanceViewer()
        this.updateXpBalanceViewer()
      })
      
    },

      async openNewPvPmodal(teamId, opTotal, dpTotal, dna) {
      this.modalTeam = teamId
      this.modalPvPOP = opTotal
      this.modalPvPDP = dpTotal
      this.modalTeamDNA = dna
      this.showNewPvPmodal = !this.showNewPvPmodal
    },

    async openModal(posName, playerType, position, teamId, teamDna) {
      this.modalPosition = position
      this.modalTeam = teamId
      this.modalPosName = posName
      this.modalPlayerType = playerType
      this.teamDna = teamDna
      this.showAssignModal = !this.showAssignModal
    },

    async closeModal() {
      this.modalPosition = ''
      this.modalTeam = ''
      this.showAssignModal = !this.showAssignModal
      await this.updateBalanceViewer()
      await this.updateXpBalanceViewer()
      await this.getTeamDetails()
    },

    async closeNewPvPModal(){
      this.showNewPvPmodal = !this.showNewPvPmodal
      this.updateBalanceViewer()
      this.updateXpBalanceViewer()
    },

    async closePvCModal(){
      this.screenLockedPlay = false
    await this.loadCityAndNouns()
    await this.getTeamDetails()
    await this.updateBalanceViewer()
    await this.updateXpBalanceViewer()
    this.updateProgressBars()
    },
        
    async loadCityAndNouns() {
            const cityNamesData = await main.getCityNames()
            const nounsData = await main.getNounNames()
            this.cityNames = cityNamesData
            this.nouns = nounsData

    },

    async updateProgressBars(){
      let timer = window.setInterval(() =>{
      let cpuTimeStamp = Math.floor((Date.now())/1000)
      this.timestamp = cpuTimeStamp
      this.hourtimestamp = ((Math.floor(cpuTimeStamp/3600))*3600)+3600
      this.secondsTillChange = this.hourtimestamp - cpuTimeStamp
      this.minsTillChange = (Math.floor(this.secondsTillChange/60))+1
      this.secLessMinsTillChange = this.secondsTillChange-(this.minsTillChange*60)
     
      const progressSeconds1 = this.matches.actv1 - this.timestamp 
      const progressPer1 = 100-((progressSeconds1/this.matches.to1)*100)
      this.progressPercent1 = progressPer1
      const progressSeconds2 = this.matches.actv2 - this.timestamp 
      const progressPer2 = 100-((progressSeconds2/this.matches.to2)*100)
      this.progressPercent2 = progressPer2
     const progressSeconds3 = this.matches.actv3 - this.timestamp 
      const progressPer3 = 100-((progressSeconds3/this.matches.to3)*100)
      this.progressPercent3 = progressPer3
      let color1 =  this.calculateProgressColor(progressPer1/100)
      let color2 =  this.calculateProgressColor(progressPer2/100)
      let color3 =  this.calculateProgressColor(progressPer3/100)
      this.progressColor1 = color1
      this.progressColor2 = color2
      this.progressColor3 = color3
      }, 1000)
    },

    async loadPvCmatches(teamId) {
      this.matchesLoading = true
      this.matchesLoaded = false
      this.timestamp = await main.getPvCMatchupsTimestamp()
      //////console.log("Current TimeStamp: " + this.timestamp)
      let cpuTimeStamp = (Date.now())/1000
      //////console.log(cpuTimeStamp)
      this.timestamp = cpuTimeStamp
      let matchesObject = await main.loadPvCmatches(teamId)
      this.matches = matchesObject
      //////console.log(this.matches)

      this.matchUpNo1 = this.matches.muNo1
      this.matchUpNo2 = this.matches.muNo2
      this.matchUpNo3 = this.matches.muNo3

      const progressSeconds1 = this.matches.actv1 - this.timestamp 
      //////console.log("Pregress Seconds 1: " + progressSeconds1)
      const progressPer1 = 100-((progressSeconds1/this.matches.to1)*100)
      //////console.log("Progress % 1 :" + progressPer1)
      this.progressPercent1 = progressPer1
      this.activeTo1 = this.matches.actv1

      const progressSeconds2 = this.matches.actv2 - this.timestamp 
      //////console.log("Pregress Seconds 2: " + progressSeconds2)
      const progressPer2 = 100-((progressSeconds2/this.matches.to2)*100)
      //////console.log("Progress % 2 :" + progressPer2)
      this.progressPercent2 = progressPer2
      this.activeTo2 = this.matches.actv2

      const progressSeconds3 = this.matches.actv3 - this.timestamp 
      //////console.log("Pregress Seconds 3: " + progressSeconds3)
      const progressPer3 = 100-((progressSeconds3/this.matches.to3)*100)
      //////console.log("Progress % 3 :" + progressPer3)
      this.progressPercent3 = progressPer3
      this.activeTo3 = this.matches.actv3
      //////console.log("Active TimeOut 3: " + this.activeTo3)

      if(this.activeTo1 >= this.activeTo2 && this.activeTo1 >= this.activeTo3){
        this.maxActiveTo = this.activeTo1
        //////console.log("Max Active TO is to1: " + this.activeTo1)
      }else if(this.activeTo2 >= this.activeTo1 && this.activeTo2 >= this.activeTo3){
        this.maxActiveTo = this.activeTo2
        //////console.log("Max Active TO is to2: " + this.activeTo2)
      }else if(this.activeTo3 >= this.activeTo1 && this.activeTo3 >= this.activeTo2){
        this.maxActiveTo = this.activeTo3
        //////console.log("Max Active TO is to3: " + this.activeTo3)
      }
    
      let color1 = await this.calculateProgressColor(progressPer1/100)
      let color2 = await this.calculateProgressColor(progressPer2/100)
      let color3 = await this.calculateProgressColor(progressPer3/100)
      //////console.log(color1)
      //////console.log(color2)
      //////console.log(color3)
      this.progressColor1 = color1
      this.progressColor2 = color2
      this.progressColor3 = color3
      //////console.log(this.progressColor1)
      //////console.log(this.progressColor2)
     // ////console.log(this.progressColor3)

      //////console.log("Matchup 1 TS: " + this.matches.to1)
      //////console.log("Matchup 2 TS: " + this.matches.to2)
      //////console.log("Matchup 3 TS: " + this.matches.to3)
      //////console.log("Matchup 1 LW: " + this.matches.won1)
      //////console.log("Matchup 2 LW: " + this.matches.won2)
      //////console.log("Matchup 3 LW: " + this.matches.won3)
      //////console.log("Matchup 1 Actv: " + this.matches.actv1)
      //////console.log("Matchup 2 Actv: " + this.matches.actv2)
      //////console.log("Matchup 3 Actv: " + this.matches.actv3)
      this.matchesLoading = false
      this.matchesLoaded = true
    },

    async calculateProgressColor(progressPercentage){
      let color2 = 'FF0000'
      let color1 = '0ED000'
      let hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
      };

      let r = Math.ceil(parseInt(color1.substring(0,2), 16) * progressPercentage + parseInt(color2.substring(0,2), 16) * (1-progressPercentage));
      let g = Math.ceil(parseInt(color1.substring(2,4), 16) * progressPercentage + parseInt(color2.substring(2,4), 16) * (1-progressPercentage));
      let b = Math.ceil(parseInt(color1.substring(4,6), 16) * progressPercentage + parseInt(color2.substring(4,6), 16) * (1-progressPercentage));

      let middle = hex(r) + hex(g) + hex(b);
      return middle
    },

    // async checkForMatchupRefresh(){
    //   let testNo = 0  
    //   let countdown = 30
    //   if(this.secondsTillChange <= testNo && this.secondsTillChange > testNo - countdown){
    //     this.lockMatchups30s = true
    //   }else if(this.secondsTillChange <= testNo - countdown && this.lockMatchups30s || this.secondsTillChange > testNo && this.lockMatchups30s){
    //     this.loadPvCmatches(this.pageTeamId)
    //     this.lockMatchups30s = false
    //   }
      
    // },

    async newPBXPtoTeamContract(qty){
      await main.newPBXPtoTeamContract(qty)
    },

     async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
          this.myFunds = res
        })
      }, 

      async updateXpBalanceViewer(){
                  await main.updateXPBalance().then(res => {
          document.getElementById('xp-balance').innerHTML = res
          this.myXp = res
          })
      },

      clearIntervals(){
        const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
        for (let i = 1; i < interval_id; i++) {
          window.clearInterval(i);
        } 
      }
  },


  mounted: async function(){
    //await this.clearIntervals()
    await this.loadCityAndNouns()
    await this.getTeamDetails()
    await this.updateBalanceViewer()
    await this.updateXpBalanceViewer()
    this.updateProgressBars()
      // this.checkForMatchupRefresh()
    
  },

  // updated: function(){
  //   this.clearIntervals()
  // },

}
</script>

<style>
.myteam{
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.player-container-team{
  flex: 0 0 100%;
  display: flex;
  padding-left:0%;
  padding-right: 0%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
  
}

.player-container-inside{
  width: 1100px;
   max-width: 1100px;
     display: flex;
  flex-direction: row;
  flex-wrap: wrap;
   justify-content: center;
}

.team-name-container{
  display: flex;
  flex: 0 0 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.team-stats{
  display: flex;
  flex: 0 0 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  
}

.vs-team-stats{
  max-width: 100%;
}

.team-name{
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  font-size: 3em;
  width: 80%;
  max-width: 640px;
  margin: 20px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: black;
  text-align: center;
  justify-content: center;
}

.team-data{
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  width: 25%;
  margin: 10px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: black;
  text-align: center;
  justify-content: center;
  max-width: 200px;
}

.player-canvas{
    
  width:100%;
  border: solid 5px black;
  border-radius: 10px;
}

.card {
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  width: 250px;
  min-height: 300px;
  margin: 20px;
  margin-bottom: 70px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: black;
  text-align: center;
  justify-content: center;
  border-style: solid;
    border-width: thick;
    border-color: rgb(8, 102, 0);
  
}

.ret-card {
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  width: 250px;
  min-height: 300px;
  margin: 20px;
  margin-bottom: 70px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: rgb(255, 255, 255);
  text-align: center;
  justify-content: center;
  border-style: solid;
    border-width: thick;
    border-color: rgb(102, 0, 94);
}

#team-action-button{
  padding: 50px;
  margin: 10px;
  transition: 0.3s;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

#team-action-button:hover{

  background: rgb(12, 185, 128);

  
}

#team-pvc-button{
  width: 600px;
  padding: 20px;
  margin: 10px;
  transition: 0.3s;
  border: dashed;
  border-color: black;
  border-width: 3px;
  background: linear-gradient(120deg, #c3e7f5, #f0d1d1);
  margin-bottom: 20px;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
  color: rgb(4, 4, 4);
  font-size: 1.1em;
  font-weight: bold;
  
}
#team-pvc-won{
  width: 600px;
  padding: 20px;
  margin: 10px;
  transition: 0.3s;
  border: dashed;
  border-color: rgb(3, 151, 8);
  border-width: 6px;
  background: linear-gradient(120deg, #cae9d2, #999999);
  margin-bottom: 20px;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
  color: rgb(4, 4, 4);
  font-size: 1.1em;
  font-weight: bold;
  
}
#team-pvc-lost{
  width: 600px;
  padding: 20px;
  margin: 10px;
  transition: 0.3s;
  border: dashed;
  border-color: rgb(151, 3, 3);
  border-width: 6px;
  background: linear-gradient(120deg, #e9caca, #999999);
  margin-bottom: 20px;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
  color: rgb(4, 4, 4);
  font-size: 1.1em;
  font-weight: bold;
  
}

#team-pvc-button:hover{

  background: linear-gradient(120deg, #06a1df, #cc1111);
  color: #fff;

  
}

#bench-action-button{
    transition: 0.3s;
  height: 40px;
  margin-top: 10px;
  border: none;
  background: rgb(71, 71, 71);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

#bench-action-button:hover{

  background: rgb(185, 12, 41);

}

#locked-action-button{
    transition: 0.3s;
  height: 40px;
  margin-top: 10px;
  border: none;
  background: rgb(177, 177, 177);
  color: rgb(211, 110, 110);
  border-radius: 10px;
  font-weight: bold;
  cursor:not-allowed;
  
}

.progress-bar-container{
  height: 10px;
  width: 550px;
  background-color: rgb(214, 214, 214);
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: -42px;
  border-radius: 5px;
}

.progress-bar-container .progress1{
  position: absolute;
  height: 100%;
  border-radius: 5px;
  transition: 100ms;
}

.progress-bar-container .progress2{
  position: absolute;
  height: 100%;
  border-radius: 5px;
  transition: 3.6s;
}

.progress-bar-container .progress3{
  position: absolute;
  height: 100%;
  border-radius: 5px;
  transition: 3.6s;
}

.locked-player{
  background-color:lightgray;
  color: darkgray;
}

#play-animation{
  animation: progress-animation 1s forwards;
}

@keyframes progress-animation {
  0% {width: 0%; background-color:indigo;}
  100% {}
}


</style>
