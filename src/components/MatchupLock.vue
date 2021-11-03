<template>
<div class="backdrop">
    <div class="pre-loader">
        <iframe src="/preload/index.html" title="Loading Puck Buddies" width="800" height="600" frameBorder="0"></iframe>
        <div><h2>Calculating Results. Please wait a moment.</h2></div>
    </div>
</div>
    
</template>

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
</style>