<template>
<div class="backdrop">
    <div class="pre-loader">
        <div v-if="!matchComplete">
            <iframe src="/preload/index.html" title="Loading Puck Buddies" width="800" height="600" frameBorder="0"></iframe>
        </div>

        <div v-if="team1Winner && matchComplete">
            <div><img src="../assets/img/winner-trophy.png" alt="winner-trophy"></div> 
        </div>

        <div v-if="team1Loser && matchComplete">
            <div><img src="../assets/img/defeat.png" alt="defeat"></div> 
        </div>
        
        <!-- <div><h2>Calculating Results. Please wait a moment.</h2></div> -->
        
<div class="container" v-if="!showShootOut">
  <div class="box box-team1">{{myTeamNoun}}</div>
  <div class="box box-sog">SOG <br> {{t1SOG}} </div>
  <div class="box box-left box-score">{{t1Score}}</div>
  <div class="box box-score">{{t2Score}}</div>
  <div class="box box-sog">SOG <br> {{t2SOG}} </div>
  <div class="box box-left box-team2">{{oppTeamNoun}}</div>
  <div class="box box-gameplay"  v-if="!matchComplete">Period<br>{{period}}</div>
  <div class="box box-gameplay"  v-if="!matchComplete">Time<br>{{minutes}}:<span v-if="seconds >= 0 && seconds <= 9">{{seconds0helper}}</span>{{seconds}}</div>
</div>

<div v-if="showShootOut">
    <div class="container">
        <div class="box box-half box-team1">{{myTeamNoun}}</div>
        <div class="box box-half box-team2">{{oppTeamNoun}}</div>
    </div>
    <div class="container">
        <div class="box box-so-no">{{soT1no1}}</div>
        <div class="box box-so-no">{{soT1no2}}</div>
        <div class="box box-so-no">{{soT1no3}}</div>
        <div class="box box-so-no">{{soT2no1}}</div>
        <div class="box box-so-no">{{soT2no2}}</div>
        <div class="box box-so-no">{{soT2no3}}</div>
    </div>
    <div class="container">
        <div class="box box-so" :class="{ sogoal : soGoalT1res1, somiss : soMissT1res1}">{{soT1pos1}}</div>
        <div class="box box-so" :class="{ sogoal : soGoalT1res2, somiss : soMissT1res2}">{{soT1pos2}}</div>
        <div class="box box-so" :class="{ sogoal : soGoalT1res3, somiss : soMissT1res3}">{{soT1pos3}}</div>
        <div class="box box-so" :class="{ sogoal : soGoalT2res1, somiss : soMissT2res1}">{{soT2pos1}}</div>
        <div class="box box-so" :class="{ sogoal : soGoalT2res2, somiss : soMissT2res2}">{{soT2pos2}}</div>
        <div class="box box-so" :class="{ sogoal : soGoalT2res3, somiss : soMissT2res3}">{{soT2pos3}}</div>
    </div>

    <div class="sudden-death">
        <div class="container" v-if="showSuddenDeath">
                 <div class="box box-so-no">SUDDEN DEATH</div>
        </div>
    
        <div class="container" v-if="showSuddenDeath">
            <div class="box box-so" :class="{ sogoal : suddenDeathGoalT1, somiss : suddenDeathMissT1}">{{suddenDeathT1}}</div>
            <div class="box box-so" :class="{ sogoal : suddenDeathGoalT2, somiss : suddenDeathMissT2}">{{suddenDeathT2}}</div>
        </div>
    </div>
</div>

<div  v-if="!matchComplete"><button @click="skipSimulation()" class="action-button margin-button">Skip Simulation</button></div>
<div  v-if="matchComplete"><button @click="closeModal()" class="action-button margin-button">Close</button></div>
        
    </div>
</div>
    
</template>

<script>
export default {
    data(){
        return{
            t1Score:0,
            t2Score:0,
            t1ScoreReg:0,
            t2ScoreReg:0,
            t1ScoreOT:0,
            t2ScoreOT:0,
            t1SOG:0,
            t2SOG:0,
            period:'',
            secondsLeftReg:3600,
            secondsLeftOT:300,
            minutes:'',
            seconds:'',
            seconds0helper:0,
            showShootOut: false,
            showSuddenDeath: false,
            soRound:0,
            soT1no1:1,
            soT1no2:2,
            soT1no3:3,
            soT2no1:1,
            soT2no2:2,
            soT2no3:3,
            soT1pos1:'-',
            soT1pos2:'-',
            soT1pos3:'-',
            soT2pos1:'-',
            soT2pos2:'-',
            soT2pos3:'-',
            soGoalT1res1:false,
            soGoalT1res2:false,
            soGoalT1res3:false,
            soGoalT2res1:false,
            soGoalT2res2:false,
            soGoalT2res3:false,
            soMissT1res1:false,
            soMissT1res2:false,
            soMissT1res3:false,
            soMissT2res1:false,
            soMissT2res2:false,
            soMissT2res3:false,
            soRegGoalsT1:0,
            soRegGoalsT2:0,
            suddenDeathT1:'-',
            suddenDeathT2:'-',
            suddenDeathGoalT1:false,
            suddenDeathGoalT2:false,
            suddenDeathMissT1:false,
            suddenDeathMissT2:false,
            suddenDeathPreResultPause:true,
            matchComplete:false,
            team1Winner:false,
            team1Loser:false,

        }
    },
  props: [ 'gameLog', 'myTeamNoun', 'oppTeamNoun'],
  methods: {

    
       

        updateGameProgress(){
            ////console.log(this.gameLog.gameObj)
            ////console.log(this.gameLog.gameOverTimeObj)
            ////console.log(this.gameLog.gameShootoutObj)
            ////console.log(this.gameLog.finalScore1)
            ////console.log(this.gameLog.finalScore2)


            let timer = window.setInterval(() =>{
                ////console.log("Regulation")
            if(this.matchComplete == true){
                    clearInterval(timer)
                }
            if (this.gameLog.gameObj.hasOwnProperty(this.secondsLeftReg)){
                let event = this.gameLog.gameObj[this.secondsLeftReg]
                ////console.log(event)
                if(event == "T1 Shot on Goal"){
                    this.t1SOG++
                }
                if(event == "T2 Shot on Goal"){
                    this.t2SOG++
                }
                if(event == "T1 Scores"){
                    this.t1Score++
                    this.t1ScoreReg++
                }
                if(event == "T2 Scores"){
                    this.t2Score++
                    this.t2ScoreReg++
                }

            }

            if (this.secondsLeftReg >=0) {
                if(this.secondsLeftReg >2400){
                    this.period = "1st"
                    this.minutes = Math.floor((this.secondsLeftReg-2400)/60)
                    this.seconds = (this.secondsLeftReg - (this.minutes * 60))-2400
                }else if(this.secondsLeftReg > 1200 && this.secondsLeftReg <= 2400) {
                    this.period = "2nd"
                    this.minutes = Math.floor((this.secondsLeftReg-1200)/60)
                    this.seconds = (this.secondsLeftReg - (this.minutes * 60))-1200
                }else if(this.secondsLeftReg <= 1200){
                    this.period = "3rd"
                    this.minutes = Math.floor(this.secondsLeftReg/60)
                    this.seconds = this.secondsLeftReg - (this.minutes * 60)
                }
                this.secondsLeftReg = this.secondsLeftReg - 1
            }

            if(this.secondsLeftReg <= 0){
                clearInterval(timer)
            }

            if (this.t1ScoreReg > this.t2ScoreReg && this.secondsLeftReg <= 0){
                this.matchComplete = true
                this.team1Winner = true
            }
            
            if (this.t1ScoreReg < this.t2ScoreReg && this.secondsLeftReg <= 0){
                this.matchComplete = true
                this.team1Loser = true
            }

            if (this.t1ScoreReg == this.t2ScoreReg && this.secondsLeftReg <= 0){
                this.updateGameProgressOT()
            }
        

            }, 10)
            
        },

        updateGameProgressOT(){
            
            let timer = window.setInterval(() =>{
                ////console.log("Overtime")
                this.period = "OT"
                if(this.matchComplete == true){
                    clearInterval(timer)
                }
                if (this.gameLog.gameOverTimeObj.hasOwnProperty(this.secondsLeftOT)){
                    let event = this.gameLog.gameOverTimeObj[this.secondsLeftOT]
                    ////console.log(event)
                    if(event == "T1 Shot on Goal"){
                        this.t1SOG++
                    }
                    if(event == "T2 Shot on Goal"){
                        this.t2SOG++
                    }
                    if(event == "T1 Scores"){
                    this.t1Score++
                    this.t1ScoreOT++
                    }
                    if(event == "T2 Scores"){
                        this.t2Score++
                        this.t2ScoreOT++
                    }
                }

                if (this.secondsLeftOT >=0) {
                        this.minutes = Math.floor(this.secondsLeftOT/60)
                        this.seconds = this.secondsLeftOT - (this.minutes * 60)
                        this.secondsLeftOT = this.secondsLeftOT - 1
                }

                if(this.secondsLeftOT <= 0){
                    clearInterval(timer)
                }

                if (this.t1ScoreOT > this.t2ScoreOT){
                this.matchComplete = true
                this.team1Winner = true
                }
                
                if (this.t1ScoreOT < this.t2ScoreOT){
                    this.matchComplete = true
                    this.team1Loser = true
                }

                if(this.t1ScoreOT == this.t2ScoreOT && this.secondsLeftOT <= 0){
                    this.updateGameProgressSO()
                }
                
            }, 75)
        },

        updateGameProgressSO(){
            this.showShootOut = true
            let rounds = this.gameLog.gameShootoutObj.length
            let timer = window.setInterval(() =>{
                ////console.log("Shootout")
                if(this.matchComplete == true){
                    clearInterval(timer)
                }
                ////console.log(this.soRound)
               this.period = "SO"
               let event = this.gameLog.gameShootoutObj[this.soRound]

                if(this.soRound == 0 && event == "T1 Scores"){
                    this.soT1pos1 = "X"
                    this.soGoalT1res1 = true
                    this.soRegGoalsT1++
                }
                if(this.soRound == 0 && event == "T1 Misses"){
                    this.soT1pos1 = "0"
                    this.soMissT1res1 = true
                }

                if(this.soRound == 1 && event == "T2 Scores"){
                    this.soT2pos1 = "X"
                    this.soGoalT2res1 = true
                    this.soRegGoalsT2++
                }
                if(this.soRound == 1 && event == "T2 Misses"){
                    this.soT2pos1 = "0"
                    this.soMissT2res1 = true
                }

                if(this.soRound == 2 && event == "T1 Scores"){
                    this.soT1pos2 = "X"
                    this.soGoalT1res2 = true
                    this.soRegGoalsT1++
                }
                if(this.soRound == 2 && event == "T1 Misses"){
                    this.soT1pos2 = "0"
                    this.soMissT1res2 = true
                }

                if(this.soRound == 3 && event == "T2 Scores"){
                    this.soT2pos2 = "X"
                    this.soGoalT2res2 = true
                    this.soRegGoalsT2++
                }
                if(this.soRound == 3 && event == "T2 Misses"){
                    this.soT2pos2 = "0"
                    this.soMissT2res2 = true
                }

                //T1 Win
                if(this.soRound == 3 && this.soRegGoalsT1 == 2 && this.soRegGoalsT2 == 0 ){
                    this.t1Score++
                    this.matchComplete = true
                    this.team1Winner = true
                }

                 //T2 Win
                if(this.soRound == 3 && this.soRegGoalsT1 == 0 && this.soRegGoalsT2 == 2 ){
                    this.t2Score++
                    this.matchComplete = true
                    this.team1Loser = true
                }

                if(this.soRound == 4 && event == "T1 Scores"){
                    this.soT1pos3 = "X"
                    this.soGoalT1res3 = true
                    this.soRegGoalsT1++
                }

                //T1 Win
                if(this.soRound == 4 && this.soRegGoalsT1 - this.soRegGoalsT2 == 2 ){
                    this.t1Score++
                    this.matchComplete = true
                    this.team1Winner = true
                }

                if(this.soRound == 4 && event == "T1 Misses"){
                    this.soT1pos3 = "0"
                    this.soMissT1res3 = true
                }

                 //T2 Win
                if(this.soRound == 4 && this.soRegGoalsT2 - this.soRegGoalsT1 == 2 ){
                    this.t2Score++
                    this.matchComplete = true
                    this.team1Loser = true
                }

                if(this.soRound == 5 && event == "T2 Scores"){
                    this.soT2pos3 = "X"
                    this.soGoalT2res3 = true
                    this.soRegGoalsT2++
                }

                if(this.soRound == 5 && event == "T2 Misses"){
                    this.soT2pos3 = "0"
                    this.soMissT2res3 = true
                }

                //T1 Win
                if(this.soRound == 5 && this.soRegGoalsT1 > this.soRegGoalsT2){
                    this.t1Score++
                    this.matchComplete = true
                    this.team1Winner = true
                }

                //T2 Win
                if(this.soRound == 5 && this.soRegGoalsT2 > this.soRegGoalsT1){
                    this.t2Score++
                    this.matchComplete = true
                    this.team1Loser = true
                }

                if(this.soRound > 5){
                    this.showSuddenDeath=true
                }

                if(this.soRound > 5 && this.soRound % 2 == 0 && this.suddenDeathPreResultPause){
                    this.suddenDeathGoalT1 = false
                    this.suddenDeathGoalT2 = false
                    this.suddenDeathMissT1 = false
                    this.suddenDeathMissT2 = false
                    this.suddenDeathPreResultPause = false
                }

                 if(this.soRound > 5 && this.soRound % 2 == 0 && !this.suddenDeathPreResultPause){
                    if(event == "T1 Scores"){
                        this.soRegGoalsT1++
                        this.suddenDeathT1 = "X"
                        this.suddenDeathGoalT1 = true
                    }else if(event == "T1 Misses"){
                        this.suddenDeathT1 = "0"
                        this.suddenDeathMissT1 = true
                    }
                    
                }

                if(this.soRound > 5 && this.soRound % 2 != 0){
                    if(event == "T2 Scores"){
                        this.soRegGoalsT2++
                        this.suddenDeathT2 = "X"
                        this.suddenDeathGoalT2 = true
                        //T2 Win
                            if(this.suddenDeathMissT1 == true){
                                this.t2Score++
                                this.matchComplete = true
                                this.team1Loser = true
                            }
                    }else if(event == "T2 Misses"){
                        this.suddenDeathT2 = "0"
                        this.suddenDeathMissT2 = true
                         //T1 Win
                            if(this.suddenDeathGoalT1 == true){
                                this.t1Score++
                                this.matchComplete = true
                                this.team1Winner = true
                            }
                    }
                    this.suddenDeathPreResultPause = true
                }

                if(this.soRound <= 5){
                    this.soRound++
                }

                if(this.soRound > 5 && !this.suddenDeathPreResultPause){
                    this.soRound++
                }
                
            

            if(this.soRound > rounds){
                clearInterval(timer)
            }

            }, 1000)
        },


        skipSimulation(){
            // Get a reference to the last interval + 1
            const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

            // Clear any timeout/interval up to that id
            for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
            }

            this.closeModal()

        },

        closeModal() {
            this.$emit('closePvCModal')
        },

        },
    
     computed: {

    },

  mounted: function(){
    
      this.updateGameProgress()
  
    
  }

}


</script>

<style scoped>
.backdrop {
    backdrop-filter: blur(5px);
    top:0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
}
.pre-loader{
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

body {
  margin: 40px;
}

.box {
  text-transform: uppercase;
  flex-grow:6;
  border:3px solid;
  border-image:linear-gradient(to bottom,rgb(158, 158, 158),rgb(255, 255, 255)) 10;
  /* background-color: rgb(255, 255, 255); */
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
}

.box-half {
    width:50%;
}

.box-team1 {
    color:#fff;
    font-size: 1.75em;
    font-weight: bolder;
    background:linear-gradient(to bottom, rgb(175, 6, 6), rgb(220, 79, 79) 45%, rgb(157, 9, 9) 50% , rgb(118, 3, 3) , rgb(26, 0, 0) );
}

.box-team2 {
    color:#fff;
    font-size: 1.75em;
    font-weight: bolder;
    background:linear-gradient(to bottom, rgb(9, 6, 175), rgb(81, 79, 220) 45%, rgb(16, 9, 157) 50% , rgb(18, 3, 118) , rgb(26, 0, 0) );
}

.box-score {
    
    color:#000;
    font-weight: bolder;
    font-size: 2em;
    max-width:100px;
    background:linear-gradient(to bottom, rgb(219, 219, 220), rgb(245, 245, 245) 35%, rgb(138, 138, 138) 40%, rgb(158, 158, 158) );
}

.box-gameplay {
    color:#fff;
    font-weight: bolder;
    font-size: 1em;
   max-width:80px;
    background:linear-gradient(to bottom, rgb(1, 47, 90), rgb(0, 38, 73) 35%, rgb(0, 26, 51) 40%, rgb(0, 38, 73) );
}

.box-sog {
    color:#fff;
    font-weight: bold;
    font-size: 1em;
   max-width:80px;
    background:linear-gradient(to bottom, rgb(1, 47, 90), rgb(0, 38, 73) 35%, rgb(0, 26, 51) 40%, rgb(0, 38, 73) );
}

.box-so-no{
    color:#000;
    font-weight: bold;
    font-size: 1em;
    
    background:linear-gradient(to bottom, rgb(225, 211, 14), rgb(230, 235, 132) 35%, rgb(225, 211, 14) 40%, rgb(174, 168, 6) );
}



.box-so{
    color:#000;
    font-weight: bold;
    font-size: 2em;
    
    background:linear-gradient(to bottom, rgb(219, 219, 220), rgb(245, 245, 245) 35%, rgb(138, 138, 138) 40%, rgb(158, 158, 158) );
}

.sudden-death{
    margin-top: 40px;;
}

.sogoal {
    background:linear-gradient(to bottom, rgb(5, 181, 5), rgb(127, 221, 127) 35%, rgb(26, 135, 4) 40%, rgb(2, 46, 0) );
}

.somiss {
    background:linear-gradient(to bottom, rgb(181, 5, 5), rgb(224, 138, 138) 35%, rgb(135, 4, 4) 40%, rgb(53, 1, 1) );
}


.box-left{
    margin-right: 10px;
}


  .container {
    display: flex;

  }

.calc-warn{
    margin: 40px;
    font-size: 0.8em;
}

.margin-button{
    margin-top: 50px;
}


</style>