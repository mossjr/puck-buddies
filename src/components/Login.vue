<template>
<div class="login-page" >
    <img class="banner" src="/assets/puck-buddies-banner.png" alt="banner">
    <div class="center">  
    <h2>Welcome to</h2>
    <h1>Puck Buddies!</h1>
  <button id="login_button">Login with MetaMask</button>
  </div>
</div>
  
</template>

<script>



</script>

<style scoped>


.center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    background: white;
    border-radius: 10px;
}

.banner{
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    transition: 0.3s;
   
}

.banner:hover{
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
   
}

.center h1 {
   text-align: center;
    padding: 0 10px 0 10px;
}
.center h2 {
   text-align: center;
    padding: 0 10px 0 10px;
}

.center button{
    width: 80%;
    height: 50px;
    font-family: montserrat;
    cursor: pointer;
    color: white;
    border: none;
    background: #2691d9;
    margin: 0 10% 20px 10%;
    border-radius: 10px;
    transition: 0.3s;

}

.center button:hover{
    color: white;
    background: rgb(12, 185, 128);
}


</style>
