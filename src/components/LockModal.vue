<template>
<div class="backdrop">
    <div class="splash-image">
        <div>   
            <img :src="require('../assets/img/' + splashImage + '.png')" alt="Please Wait">
        </div>
        <div>
            <img :src="require('../assets/img/loading.gif')" alt="loading" class="loading-icon-puck">
        </div>
    </div>
    
</div> 
</template>

<script>
import main from '../main.js'

export default {
    data(){
        return{
        
        }
    },
    props:  ['splashImage'
            ],
    methods: {    

    },
    computed: {

    },

    mounted: function(){
        console.log(this.splashImage)
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

.splash-image{
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.loading-icon-puck{
    margin: 20px;
}

</style>