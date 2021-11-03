<template>
  <div class="home">
  </div>
  <h1>WELCOME TO PUCK BUDDIES!</h1>
</template>

<script>
import main from '../main.js'

export default {
methods:{
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

},

  mounted: function(){

    this.updateBalanceViewer()
    this.updateXpBalanceViewer()
    
  }
}

</script>


