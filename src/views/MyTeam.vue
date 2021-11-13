<template>
  <div class="myteam">
    <!-- <button id="team-action-button" @click="mintTeam()" v-if="totalTeamsFound < 1 && playersLoaded">Mint New Team</button> -->
    <!-- <button @click="loadPvCmatches()">TEST</button>
    <input v-model="PBXPqtyToMint" type="number">
    <button @click="newPBXPtoTeamContract(PBXPqtyToMint)">Mint new PBXP</button> -->
    <!-- <button @click="getTeamDetails()">TEST</button> -->
    <img src="../assets/img/my-team.png" alt="my-team">
    <button @click="maralisRunPvC()">TEST</button>

    <div v-for="(team, index) in teams" :key="index">
      <div v-if="team.playerPos1 != 0 && team.playerPos2 != 0 && team.playerPos3 != 0 && team.playerPos4 != 0 && team.playerPos5 != 0 && team.playerPos6 != 0 && sixActivePlayers">
      <!-- <button id="team-action-button" v-if="!matchesLoaded && !matchesLoading" @click="loadPvCmatches(team.teamId)">Load Matcheups</button> -->
      <div class="loading-icon-container">
            <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="matchesLoading && !matchesLoaded">
        </div>

      <div v-if="matchesLoaded">
        <div class="loading-icon-container">
            <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="matchesLoading">
        </div>

        <div v-if="!matchesLoading && !lockMatchups30s" class="vs-team-stats">
          <div id="team1PvC">
            <div>
              <!-- <img src="../assets/img/prct-matcup.png" alt="Practice Matchup">     -->
            </div>
            <button v-if="timestamp >= activeTo1" @click="hitTheIcePvC(1, team.teamId, playerIdArray)" id="team-pvc-button">The {{cityNames[team.teamCityNumber].city}} <i>{{nouns[team.teamNounNumber].noun}}</i><br> <b>VS</b> <br> The {{cityNames[matches.team1CityNumber].city}} <i>{{nouns[matches.team1NounNumber].noun}}</i><br> OP: {{matches.opStat1}} DP: {{matches.dpStat1}}</button>
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
            <button v-if="timestamp >= activeTo2" @click="hitTheIcePvC(2, team.teamId, playerIdArray)" id="team-pvc-button">The {{cityNames[team.teamCityNumber].city}} <i>{{nouns[team.teamNounNumber].noun}}</i><br> <b>VS</b> <br> The {{cityNames[matches.team2CityNumber].city}} <i>{{nouns[matches.team2NounNumber].noun}}</i><br> OP: {{matches.opStat2}} DP: {{matches.dpStat2}}</button>
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
            <button v-if="timestamp >= activeTo3" @click="hitTheIcePvC(3, team.teamId,playerIdArray)" id="team-pvc-button">The {{cityNames[team.teamCityNumber].city}} <i>{{nouns[team.teamNounNumber].noun}}</i><br> <b>VS</b> <br> The {{cityNames[matches.team3CityNumber].city}} <i>{{nouns[matches.team3NounNumber].noun}}</i><br> OP: {{matches.opStat3}} DP: {{matches.dpStat3}}</button>
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
      

      <div class="team-name-container">
        <div class="team-name"> {{team.teamId}}: The {{cityNames[team.teamCityNumber].city}} <i>{{nouns[team.teamNounNumber].noun}}</i></div>
      </div>


      
      <div class="team-stats">
        <div class="team-data">OP: {{team.opTotal}}</div>
        <div class="team-data">DP: {{team.dpTotal}}</div>
        <!-- <div class="team-data">OP: {{team.teamTotalOP}}</div>
        <div class="team-data">DP: {{team.teamTotalDP}}</div> -->
      </div>




    <div  v-if="!loadingPlayers">
      <div class="player-container-team" v-for="(team, index) in teams" :key="index">
        <div class="player-container-inside">
          <div class="card" v-if="!team.pos1ret">
            <h4>Center</h4>
            <canvas v-if="team.playerPos1" class="player-canvas" :id="`canvas-player-no-${team.playerPos1}`">
            </canvas>
            <button v-if="!team.playerPos1 && offenceFound > 0" @click="openModal('Center', 1, 1, team.teamId, team.teamDna)" id="team-action-button">Assign Center</button>
            <button v-if="team.playerPos1 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 1, team.playerPos1)" id="bench-action-button">Bench Center</button>
            <button v-if="team.playerPos1 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos1ret">
            <h4>Center</h4>
            <canvas v-if="team.playerPos1" class="player-canvas" :id="`canvas-player-no-${team.playerPos1}`">
            </canvas>
            <button v-if="!team.playerPos1 && offenceFound > 0" @click="openModal('Center', 1, 1, team.teamId, team.teamDna)" id="team-action-button">Assign Center</button>
            <button v-if="team.playerPos1 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 1, team.playerPos1)" id="bench-action-button">Bench Center</button>
            <button v-if="team.playerPos1 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos2ret">
            <h4>Right Wing</h4>
            <canvas v-if="team.playerPos2" class="player-canvas" :id="`canvas-player-no-${team.playerPos2}`">
            </canvas>
            <button v-if="!team.playerPos2 && offenceFound > 0" @click="openModal('Right Wing', 1, 2, team.teamId, team.teamDna)" id="team-action-button">Assign Right Wing</button>
            <button v-if="team.playerPos2 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 2, team.playerPos2)" id="bench-action-button">Bench Right Wing</button>
            <button v-if="team.playerPos2 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos2ret">
            <h4>Right Wing</h4>
            <canvas v-if="team.playerPos2" class="player-canvas" :id="`canvas-player-no-${team.playerPos2}`">
            </canvas>
            <button v-if="!team.playerPos2 && offenceFound > 0" @click="openModal('Right Wing', 1, 2, team.teamId, team.teamDna)" id="team-action-button">Assign Right Wing</button>
            <button v-if="team.playerPos2 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 2, team.playerPos2)" id="bench-action-button">Bench Right Wing</button>
            <button v-if="team.playerPos2 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos3ret">
            <h4>Left Wing</h4>
            <canvas v-if="team.playerPos3" class="player-canvas" :id="`canvas-player-no-${team.playerPos3}`">
            </canvas>
            <button v-if="!team.playerPos3 && offenceFound > 0" @click="openModal('Left Wing', 1, 3, team.teamId, team.teamDna)" id="team-action-button">Assign Left Wing</button>
            <button v-if="team.playerPos3 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 3, team.playerPos3)" id="bench-action-button">Bench Left Wing</button>
            <button v-if="team.playerPos3 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos3ret">
            <h4>Left Wing</h4>
            <canvas v-if="team.playerPos3" class="player-canvas" :id="`canvas-player-no-${team.playerPos3}`">
            </canvas>
            <button v-if="!team.playerPos3 && offenceFound > 0" @click="openModal('Left Wing', 1, 3, team.teamId, team.teamDna)" id="team-action-button">Assign Left Wing</button>
            <button v-if="team.playerPos3 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 3, team.playerPos3)" id="bench-action-button">Bench Left Wing</button>
            <button v-if="team.playerPos3 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos4ret">
            <h4>Right Defence</h4>
             <canvas v-if="team.playerPos4" class="player-canvas" :id="`canvas-player-no-${team.playerPos4}`">
            </canvas>
            <button v-if="!team.playerPos4 && defenceFound > 0" @click="openModal('Right Defence', 2, 4, team.teamId, team.teamDna)" id="team-action-button">Assign Right Defence</button>
            <button v-if="team.playerPos4 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 4, team.playerPos4)" id="bench-action-button">Bench Right Defence</button>
            <button v-if="team.playerPos4 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos4ret">
            <h4>Right Defence</h4>
             <canvas v-if="team.playerPos4" class="player-canvas" :id="`canvas-player-no-${team.playerPos4}`">
            </canvas>
            <button v-if="!team.playerPos4 && defenceFound > 0" @click="openModal('Right Defence', 2, 4, team.teamId, team.teamDna)" id="team-action-button">Assign Right Defence</button>
            <button v-if="team.playerPos4 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 4, team.playerPos4)" id="bench-action-button">Bench Right Defence</button>
            <button v-if="team.playerPos4 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos5ret">
            <h4>Left Defence</h4>
            <canvas v-if="team.playerPos5" class="player-canvas" :id="`canvas-player-no-${team.playerPos5}`">
            </canvas>
            <button v-if="!team.playerPos5 && defenceFound > 0" @click="openModal('Left Defence', 2, 5, team.teamId, team.teamDna)" id="team-action-button">Assign Left Defence</button>
            <button v-if="team.playerPos5 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 5, team.playerPos5)" id="bench-action-button">Bench Left Defence</button>
            <button v-if="team.playerPos5 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos5ret">
            <h4>Left Defence</h4>
            <canvas v-if="team.playerPos5" class="player-canvas" :id="`canvas-player-no-${team.playerPos5}`">
            </canvas>
            <button v-if="!team.playerPos5 && defenceFound > 0" @click="openModal('Left Defence', 2, 5, team.teamId, team.teamDna)" id="team-action-button">Assign Left Defence</button>
            <button v-if="team.playerPos5 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 5, team.playerPos5)" id="bench-action-button">Bench Left Defence</button>
            <button v-if="team.playerPos5 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="card" v-if="!team.pos6ret">
            <h4>Goalie</h4>
            <canvas v-if="team.playerPos6" class="player-canvas" :id="`canvas-player-no-${team.playerPos6}`">
            </canvas>
            <button v-if="!team.playerPos6 && goaliesFound > 0" @click="openModal('Goalie', 3, 6, team.teamId, team.teamDna)" id="team-action-button">Assign Goalie</button>
            <button v-if="team.playerPos6 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 6, team.playerPos6)" id="bench-action-button">Bench Goalie</button>
            <button v-if="team.playerPos6 && timestamp <= maxActiveTo" id="locked-action-button">Player Locked</button>
        </div>

        <div class="ret-card" v-if="team.pos6ret">
            <h4>Goalie</h4>
            <canvas v-if="team.playerPos6" class="player-canvas" :id="`canvas-player-no-${team.playerPos6}`">
            </canvas>
            <button v-if="!team.playerPos6 && goaliesFound > 0" @click="openModal('Goalie', 3, 6, team.teamId, team.teamDna)" id="team-action-button">Assign Goalie</button>
            <button v-if="team.playerPos6 && timestamp > maxActiveTo" @click="benchPlayer('PB-BRB', team.teamId, 6, team.playerPos6)" id="bench-action-button">Bench Goalie</button>
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
<AssignPlayerModal @closeAssignPlayerModal="closeModal()" :teamId="modalTeam" :position="modalPosition" :modalPos="modalPosName" :playerType="modalPlayerType" :teamDna="teamDna"/>
</div>

<div v-if="showNewPvPmodal">
  <TeamNewPvPmodal @closeNewPvPModal="closeNewPvPModal()" :teamId="modalTeam" :opTotal="modalPvPOP" :dpTotal="modalPvPDP" :teamDna="modalTeamDNA"/>
</div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div> 
<div v-if="screenLockedPlay">
  <MatchupLock  :splashImage="splashImage" />
</div> 

</div>
</template>

<script>
import main from '../main.js'
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
      playerIdArray: []

    }
  },

  methods:{
    async maralisRunPvC(){
      this.screenLockedPlay = true
      await main.maralisRunPvC(this.playerIdArray, this.pageTeamId ).then(res =>{
        console.log(res)
        this.screenLockedPlay = false
      }).catch(err =>{
        console.log(err)
        this.screenLockedPlay = false
      })
    },


    async getTeamDetails(){
       Promise.all(await main.displayTeam()).then(res => {
        console.log(res) 
      })
   
    },


    async displayTeam(playerArray){
      Promise.all(await main.displayTeam())
      .then(res => {
        console.log("Result: " + res)
        console.log(res)
        let teamArray = []
        for (let i = 0; i < res.length; i++){
          
          let indexPlayer1 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "1")
          let indexPlayer2 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "2")
          let indexPlayer3 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "3")
          let indexPlayer4 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "4")
          let indexPlayer5 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "5")
          let indexPlayer6 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "6")
          let pos1id
          let pos1OP
          let pos1DP
          let pos2id
          let pos2OP
          let pos2DP
          let pos3id
          let pos3OP
          let pos3DP
          let pos4id
          let pos4OP
          let pos4DP
          let pos5id
          let pos5OP
          let pos5DP
          let pos6id
          let pos6OP
          let pos6DP
          let currentTime = Math.floor(Date.now() / 10 ** 3)
          let pos1ret = false
          let pos2ret = false
          let pos3ret = false
          let pos4ret = false
          let pos5ret = false
          let pos6ret = false
          if (indexPlayer1 >= 0){
            if(playerArray[indexPlayer1].ageoutTimestamp > currentTime){pos1ret = false} else {pos1ret = true}
          }
          if (indexPlayer2 >= 0){
            if(playerArray[indexPlayer2].ageoutTimestamp > currentTime){pos2ret = false} else {pos2ret = true}
          }
          if (indexPlayer3 >= 0){
           if(playerArray[indexPlayer3].ageoutTimestamp > currentTime){pos3ret = false} else {pos3ret = true}
          }
          if (indexPlayer4 >= 0){
           if(playerArray[indexPlayer4].ageoutTimestamp > currentTime){pos4ret = false} else {pos4ret = true}
          }
          if (indexPlayer5 >= 0){
           if(playerArray[indexPlayer5].ageoutTimestamp > currentTime){pos5ret = false} else {pos5ret = true}
          }
          if (indexPlayer6 >= 0){
           if(playerArray[indexPlayer6].ageoutTimestamp > currentTime){pos6ret = false} else {pos6ret = true}
          }
          let activePlayerCount = 0;
          
          if(pos1ret == false){activePlayerCount = activePlayerCount +1}
          if(pos2ret == false){activePlayerCount = activePlayerCount +1}
          if(pos3ret == false){activePlayerCount = activePlayerCount +1}
          if(pos4ret == false){activePlayerCount = activePlayerCount +1}
          if(pos5ret == false){activePlayerCount = activePlayerCount +1}
          if(pos6ret == false){activePlayerCount = activePlayerCount +1}
          if (indexPlayer1 >= 0){pos1id = playerArray[indexPlayer1].id} else {pos1id = ''}
          if (indexPlayer1 >= 0){pos1OP = playerArray[indexPlayer1].offence} else {pos1OP = ''}
          if (indexPlayer1 >= 0){pos1DP = playerArray[indexPlayer1].defence} else {pos1DP = ''}
          if (indexPlayer2 >= 0){pos2id = playerArray[indexPlayer2].id} else {pos2id = ''}
          if (indexPlayer2 >= 0){pos2OP = playerArray[indexPlayer2].offence} else {pos2OP = ''}
          if (indexPlayer2 >= 0){pos2DP = playerArray[indexPlayer2].defence} else {pos2DP = ''}
          if (indexPlayer3 >= 0){pos3id = playerArray[indexPlayer3].id} else {pos3id = ''}
          if (indexPlayer3 >= 0){pos3OP = playerArray[indexPlayer3].offence} else {pos3OP = ''}
          if (indexPlayer3 >= 0){pos3DP = playerArray[indexPlayer3].defence} else {pos3DP = ''}
          if (indexPlayer4 >= 0){pos4id = playerArray[indexPlayer4].id} else {pos4id = ''}
          if (indexPlayer4 >= 0){pos4OP = playerArray[indexPlayer4].offence} else {pos4OP = ''}
          if (indexPlayer4 >= 0){pos4DP = playerArray[indexPlayer4].defence} else {pos4DP = ''}
          if (indexPlayer5 >= 0){pos5id = playerArray[indexPlayer5].id} else {pos5id = ''}
          if (indexPlayer5 >= 0){pos5OP = playerArray[indexPlayer5].offence} else {pos5OP = ''}
          if (indexPlayer5 >= 0){pos5DP = playerArray[indexPlayer5].defence} else {pos5DP = ''}
          if (indexPlayer6 >= 0){pos6id = playerArray[indexPlayer6].id} else {pos6id = ''}
          if (indexPlayer6 >= 0){pos6OP = playerArray[indexPlayer6].offence} else {pos6OP = ''}
          if (indexPlayer6 >= 0){pos6DP = playerArray[indexPlayer6].defence} else {pos6DP = ''}
          console.log(pos1id + " " + pos2id + " " + pos3id + " " + pos4id + " " + pos5id + " " + pos6id)
          console.log(pos1OP + " " + pos2OP + " " + pos3OP + " " + pos4OP + " " + pos5OP + " " + pos6OP)
          console.log(pos1DP + " " + pos2DP + " " + pos3DP + " " + pos4DP + " " + pos5DP + " " + pos6DP)
          this.playerIdArray = [pos1id,pos2id,pos3id,pos4id,pos5id,pos6id]


          let opTotal = Number(pos1OP) + Number(pos2OP) + Number(pos3OP) + Number(pos4OP) + Number(pos5OP) + Number(pos6OP)
          let dpTotal = Number(pos1DP) + Number(pos2DP) + Number(pos3DP) + Number(pos4DP) + Number(pos5DP) + Number(pos6DP)

          let teamCityStarter = parseInt(res[i].teamDna.slice(1,4))
          let teamCityNumber = Math.floor((teamCityStarter/1000) * 529)
          let teamNounNumber = parseInt(res[i].teamDna.slice(5,8))
          
          let teamName = this.nouns[teamNounNumber].noun
          let teamLetter = teamName.slice(0,1)        
          console.log(teamLetter)

          teamArray.push({
            'teamId': res[i].teamId,
            'teamDna': res[i].teamDna,
            'teamTotalOP': res[i].teamTotalOP,
            'teamTotalDP': res[i].teamTotalDP,
            'teamCityNumber': teamCityNumber,
            'teamNounNumber': teamNounNumber,
            'teamLetter': teamLetter,
            'timeActive': res[i].timeActive,
            'gamesPlayed': res[i].gamesPlayed,
            'equippedItem': res[i].equippedItem,
            'playerPos1': pos1id,
            'playerPos1OP': pos1OP,
            'playerPos1DP': pos1DP,
            'pos1ret':pos1ret,
            'playerPos2': pos2id,
            'playerPos2OP': pos2OP,
            'playerPos2DP': pos2DP,
            'pos2ret':pos2ret,
            'playerPos3': pos3id,
            'playerPos3OP': pos3OP,
            'playerPos3DP': pos3DP,
            'pos3ret':pos3ret,
            'playerPos4': pos4id,
            'playerPos4OP': pos4OP,
            'playerPos4DP': pos4DP,
            'pos4ret':pos4ret,
            'playerPos5': pos5id,
            'playerPos5OP': pos5OP,
            'playerPos5DP': pos5DP,
            'pos5ret':pos5ret,
            'playerPos6': pos6id,
            'playerPos6OP': pos6OP,
            'playerPos6DP': pos6DP,
            'pos6ret':pos6ret,
            'opTotal': opTotal,
            'dpTotal': dpTotal,
            'activePlayerCount': activePlayerCount
          })
        }
        
        this.loadingTeams = false
        return {teamArray: teamArray, players: playerArray }
      })
      .then(res2 => {
        let res = res2.teamArray
        for (let i = 0; i < res2.players.length; i++){
         buildCanvas.preloadPlayerInfo(res2.players[i].id, res2.players[i], "player-no")
        }
        console.log("Active Player Count: " + res)
        console.log(res)
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

    async benchPlayer(_splashImage, _teamId, _position, _playerId){
      this.splashImage = _splashImage
      this.screenLocked = true
      console.log(_teamId)
      console.log(_position)
      
      await main.removeFromPosition(_teamId, _playerId).then(res => {
        this.screenLocked = false
        this.sendPlayerData()
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

    async sendPlayerData() {
      this.totalFoundPlayers = 0
      this.offenceFound = 0
      this.defenceFound = 0
      this.goaliesFound = 0
      let playerArray = [] 
      Promise.all(await main.loadPBPlayers())
      .then(res => {
        console.log("Result: " + res)
        if (res.length == 0) {
          console.log("0 Players Found")
          this.totalFoundPlayers = 0
        }else{  
        for (let i = 0; i < res.length; i++) {
           let isOff
            let isDef
            let isGoal
            if(res[i].playertype == 1){
              isOff = true
              isDef = false
              isGoal = false
            }else if (res[i].playertype == 2){
              isOff = false
              isDef = true
              isGoal = false
            }else if (res[i].playertype == 3){
              isOff = false
              isDef = false
              isGoal = true
            }
            console.log(res[i].ageoutTimestamp)
            playerArray.push({
              'id': res[i].id, 
              'offence': res[i].offence,  
              'defence': res[i].defence, 
              'dna': res[i].dna, 
              'playertype' : res[i].playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res[i].teamId,
              'teamLetter': res[i].teamLetter,
              'position' : res[i].position,
              'equippedJersey' : res[i].equippedJersey,
              'equippedStick' : res[i].equippedStick,
              'equippedToken' : res[i].equippedToken,
              'ageoutTimestamp': res[i].ageoutTimestamp,
              'draftTimestamp': res[i].draftTimestamp
              }) 
            if(res[i].playertype == 1 && res[i].teamId == 0){
              this.offenceFound = this.offenceFound+1
            }else if(res[i].playertype == 2 && res[i].teamId == 0){
              this.defenceFound = this.defenceFound+1
            }else if(res[i].playertype == 3 && res[i].teamId == 0){
              this.goaliesFound = this.goaliesFound+1
            }
          }
        }
        this.loadingPlayers = false
        console.log("Found " + this.offenceFound + " Offence")
        console.log("Found " + this.defenceFound + " Defence")
        console.log("Found " + this.goaliesFound + " Goalies")
        console.log(playerArray)
        return playerArray
          
      })
      .then(res => {

          this.totalFoundPlayers = res.length
          this.players = res
          this.displayTeam(res)
          this.updateBalanceViewer()
          this.updateXpBalanceViewer()
      
        })
        .catch((err) => {

          this.totalFoundPlayers = 0
          console.log("Rendering Players in My Players Error: " + err)
          console.log(err)
          this.players = null
          this.updateBalanceViewer()
          this.updateXpBalanceViewer()
        })
    },

    // async mintTeam() {
    //   Promise.all(await main.mintTeam()).then(async () => {
       
        
    //   await this.sendPlayerData()
    //   await this.updateBalanceViewer()
    //   await this.updateXpBalanceViewer()
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
    // },

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
      this.updateBalanceViewer()
      this.updateXpBalanceViewer()
      this.sendPlayerData()
    },

    async closeNewPvPModal(){
      this.showNewPvPmodal = !this.showNewPvPmodal
      this.updateBalanceViewer()
      this.updateXpBalanceViewer()
    },
        
    async loadCityAndNouns() {
            const cityNamesData = await main.getCityNames()
            const nounsData = await main.getNounNames()
            this.cityNames = cityNamesData
            this.nouns = nounsData

    },

    async updateProgressBars(){
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
      let color1 = await this.calculateProgressColor(progressPer1/100)
      let color2 = await this.calculateProgressColor(progressPer2/100)
      let color3 = await this.calculateProgressColor(progressPer3/100)
      this.progressColor1 = color1
      this.progressColor2 = color2
      this.progressColor3 = color3
    },

    async loadPvCmatches(teamId) {
      this.matchesLoading = true
      this.matchesLoaded = false
      this.timestamp = await main.getPvCMatchupsTimestamp()
      console.log("Current TimeStamp: " + this.timestamp)
      let cpuTimeStamp = (Date.now())/1000
      console.log(cpuTimeStamp)
      this.timestamp = cpuTimeStamp
      let matchesObject = await main.loadPvCmatches(teamId)
      this.matches = matchesObject
      console.log(this.matches)

      const progressSeconds1 = this.matches.actv1 - this.timestamp 
      console.log("Pregress Seconds 1: " + progressSeconds1)
      const progressPer1 = 100-((progressSeconds1/this.matches.to1)*100)
      console.log("Progress % 1 :" + progressPer1)
      this.progressPercent1 = progressPer1
      this.activeTo1 = this.matches.actv1

      const progressSeconds2 = this.matches.actv2 - this.timestamp 
      console.log("Pregress Seconds 2: " + progressSeconds2)
      const progressPer2 = 100-((progressSeconds2/this.matches.to2)*100)
      console.log("Progress % 2 :" + progressPer2)
      this.progressPercent2 = progressPer2
      this.activeTo2 = this.matches.actv2

      const progressSeconds3 = this.matches.actv3 - this.timestamp 
      console.log("Pregress Seconds 3: " + progressSeconds3)
      const progressPer3 = 100-((progressSeconds3/this.matches.to3)*100)
      console.log("Progress % 3 :" + progressPer3)
      this.progressPercent3 = progressPer3
      this.activeTo3 = this.matches.actv3
      console.log("Active TimeOut 3: " + this.activeTo3)

      if(this.activeTo1 >= this.activeTo2 && this.activeTo1 >= this.activeTo3){
        this.maxActiveTo = this.activeTo1
        console.log("Max Active TO is to1: " + this.activeTo1)
      }else if(this.activeTo2 >= this.activeTo1 && this.activeTo2 >= this.activeTo3){
        this.maxActiveTo = this.activeTo2
        console.log("Max Active TO is to2: " + this.activeTo2)
      }else if(this.activeTo3 >= this.activeTo1 && this.activeTo3 >= this.activeTo2){
        this.maxActiveTo = this.activeTo3
        console.log("Max Active TO is to3: " + this.activeTo3)
      }
    
      let color1 = await this.calculateProgressColor(progressPer1/100)
      let color2 = await this.calculateProgressColor(progressPer2/100)
      let color3 = await this.calculateProgressColor(progressPer3/100)
      console.log(color1)
      console.log(color2)
      console.log(color3)
      this.progressColor1 = color1
      this.progressColor2 = color2
      this.progressColor3 = color3
      console.log(this.progressColor1)
      console.log(this.progressColor2)
      console.log(this.progressColor3)

      console.log("Matchup 1 TS: " + this.matches.to1)
      console.log("Matchup 2 TS: " + this.matches.to2)
      console.log("Matchup 3 TS: " + this.matches.to3)
      console.log("Matchup 1 LW: " + this.matches.won1)
      console.log("Matchup 2 LW: " + this.matches.won2)
      console.log("Matchup 3 LW: " + this.matches.won3)
      console.log("Matchup 1 Actv: " + this.matches.actv1)
      console.log("Matchup 2 Actv: " + this.matches.actv2)
      console.log("Matchup 3 Actv: " + this.matches.actv3)
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

      async hitTheIcePvC(difficulty, teamId, playerIdArray){
        
        this.screenLockedPlay = true
        console.log(difficulty)
        console.log(teamId)
        let matchObject = await main.hitTheIcePvC(difficulty, teamId, playerIdArray).then(res => {
            this.screenLockedPlay = false
            console.log(matchObject)
            this.loadPvCmatches(teamId)
            this.updateBalanceViewer()
            this.updateXpBalanceViewer()
        })
        .catch(err => {
          this.screenLockedPlay = false
          this.loadPvCmatches()
          console.log(err)
        })
      },

       async hitTheIcePvCTester(difficulty, teamId){
        console.log(difficulty)
        console.log(teamId)
        let matchObject = await main.hitTheIcePvC(difficulty, teamId).then(res => {
            console.log(matchObject)
            this.loadPvCmatches(teamId)
            this.updateBalanceViewer()
            this.updateXpBalanceViewer()
        })
        .catch(err => {
          this.loadPvCmatches()
          console.log(err)
        })
      }
  },



  // computed: {
  //   cssProps() {
  //     return {
  //       '--progress': (this.progressPercent1)
  //     }
  //   }

  // },

  mounted: function(){
    this.loadCityAndNouns()
    this.sendPlayerData()
    this.updateBalanceViewer()
    this.updateXpBalanceViewer()
    window.setInterval(() =>{
      this.updateProgressBars()
      // this.checkForMatchupRefresh()
    }, 1000)
    
  }

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
