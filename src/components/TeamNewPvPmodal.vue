<template>
<div class="backdrop" @click.self="closeModal">
    <div class="teamNewPvPmodal">
        <h1>FACEOFF GRAPHIC HERE</h1>
        <div>Start a PvP Matchup with how many BUDS?</div>
        <input type="number" v-model="buddiesReward">
        <button class="green-button-close" @click="createMatchup(teamId,buddiesReward)">Submit New PvP Matchup for {{buddiesReward}} BUDS</button>
        <button class="green-button-close" @click="closeModal()">Cancel</button>
    </div>
</div> 
</template>

<script>
import main from '../main.js'

export default {
    data(){
        return{
            buddiesReward:2
        }
    },
    props:  ['teamId', 
            'opTotal',
            'dpTotal',
            'teamDna'
            ],
    methods: {

    async createMatchup(teamId, buddiesReward){
      await main.createMatchup(teamId, buddiesReward).then(res => {
          this.closeModal()
      })
      .catch(err => {

        //console.log(err)
      })
    },
       
        closeModal() {
            this.$emit('closeNewPvPModal')
        }
       

    },
    computed: {
       
    },

    mounted: function(){
    
    }
}

</script>


<style scoped>
.teamNewPvPmodal{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width:80%;
    max-width: 600px;
    padding: 20px;
    color: black;
    background: #fff;
    border-radius: 10px;
    box-shadow: 20px 20px 20px 0 rgba(0, 0, 0, 0.5);

}
.backdrop {
    backdrop-filter: blur(5px);
    top:0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
}

.green-button{
   margin: 15px;
font-size: 23px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.green-button:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button:focus{
    outline: none;
 border: none;
  background: rgb(12, 185, 128);
}

.green-button-close{
width: 80%;
margin: 15px;
font-size: 40px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.green-button-close:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button-close:focus{
    outline: none;
 border: none;
  background: rgb(78, 87, 84);
}

.player-canvas{
    
  width:100%;
  border: solid 5px black;
  border-radius: 10px;
}

.grey-button{
  margin: 15px;
font-size: 23px;
color: rgb(219, 174, 174);
background: rgb(110, 110, 110);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
cursor:not-allowed;
}

/* .freeAgency{

}

.free-agency-form{

}

.freeagencyformactive{

} */

.flip-card {
  display: inline-block;
  justify-items: center;
  background-color: white;
  width: 400px;
  height: 500px;
  border: none;
  border-radius: 10px;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
  border-radius: 10px;
}

/* Style the back side */
.flip-card-back {
  border: solid 5px black;
  border-radius: 10px;
  background-color: rgb(105, 105, 105);
  color: white;
  transform: rotateY(180deg);
}

.send-to-market{
    margin-top: -220px;
    visibility: hidden;
    opacity: 0;
    transition: 0.3s;
}

.freeagencyactive{
    margin-top: 0px;
    opacity: 1;
    visibility: visible;
}


form{
    max-width: 420px;
    margin:  auto;
    background: transparent;
    padding: 20px;
    border-radius: 10px;
}
label{
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}
input{
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
    -webkit-appearance: none;
  margin: 0;
  -moz-appearance: textfield;
  justify-content: center;
  font-size: xx-large;
  text-align: center; 
}
input:focus{
    border:rgb(233, 233, 233);
}

.send-to-market-button{
width: auto;
margin: 15px;
font-size: 20px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.send-to-market-button:hover {
    box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(185, 12, 41);
}


</style>