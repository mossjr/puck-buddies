<template>
<div class="backdrop">
    <div class="pre-loader">
        <iframe src="/preload/index.html" title="Loading Puck Buddies" width="800" height="600" frameBorder="0"></iframe>
        <div><h2>Calculating Results. Please wait a moment.</h2></div>
        
<div class="container">
  <div class="box box-team1">{{myTeamNoun}}</div>
  <div class="box box-sog">SOG <br> {{t1SOG}} </div>
  <div class="box box-left box-score">{{t1Score}}</div>
  <div class="box box-score">{{t2Score}}</div>
  <div class="box box-sog">SOG <br> {{t2SOG}} </div>
  <div class="box box-left box-team2">{{oppTeamNoun}}</div>
  <div class="box box-gameplay">Period<br>{{period}}</div>
  <div class="box box-gameplay">Time<br>{{minutes}}:<span v-if="seconds >= 0 && seconds <= 9">{{seconds0helper}}</span>{{seconds}}</div>
</div>

        
    </div>
</div>
    
</template>

<script>
export default {
    data(){
        return{
            t1Score:0,
            t2Score:0,
            t1SOG:0,
            t2SOG:0,
            period:'',
            secondsLeftReg:3600,
            minutes:'',
            seconds:'',
            seconds0helper:0,
        }
    },
  props: [ 'gameLog', 'myTeamNoun', 'oppTeamNoun'],
  methods: {
       

        updateGameProgress(){
            let gameLogList = document.getElementById('gamelog');
            if (this.gameLog.gameObj.hasOwnProperty(this.secondsLeftReg)){
                let event = this.gameLog.gameObj[this.secondsLeftReg]
                //console.log(event)
                if(event == "T1 Shot on Goal"){
                    this.t1SOG++
                }
                if(event == "T2 Shot on Goal"){
                    this.t2SOG++
                }
                if(event == "T1 Scores"){
                    this.t1Score++
                }
                if(event == "T2 Scores"){
                    this.t2Score++
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
            
        }

    },
    
     computed: {

    },

  mounted: function(){
    window.setInterval(() =>{
      this.updateGameProgress()
    }, 10)
    
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


.box-left{
    margin-right: 10px;
}


  .container {
    display: flex;

  }




</style>