import {proShopItems} from '../config.js'


function preloadPlayerInfo(id, data, pos) {
    let firstName = ""
    let lastName = ""
    let firstNameDna = ("" + Math.floor((data.dna.slice(0,1)/2)) + data.dna.slice(1,4))
    let lastNameDna = ("" + Math.floor((data.dna.slice(4,5)/2)) + data.dna.slice(5,8))
    firstNameDna = firstNameDna - 0
    lastNameDna = lastNameDna - 0
    if(data.id == 999999999){

    }
    const playerNames = async () => {
        const response = await fetch('/assets/data/names.json')
        const json  = await response.json();
        return json
        }
    playerNames().then(namedata => {
        firstName = namedata[firstNameDna].first_name
        lastName = namedata[lastNameDna].last_name
        let pdata = data
        let pid = id
        //console.log(pdata)
        
        preloadFont(pid, pdata, firstName, lastName, pos);
    })
}

function preloadFont (id,data, firstName, lastName, pos) {
    let myFont = new FontFace('pixels','url(/assets/fonts/pixels.ttf)')
    let pid = id
    let pdata = data
    let fname = firstName
    let lname = lastName
    myFont.load().then(function(font){
        document.fonts.add(font)
        renderPlayer(pid, pdata, fname, lname, pos)
    })

}

function renderPlayer (id, data, firstName, lastName, pos){
    // let canvas = document.getElementById('canvas-'+ pos + "-" + id )
    // canvas.classList.add('hide')
    if(data.id == 999999999){
        //console.log("ID: " + data.id)
        //console.log(data)
    }
    
    let pHelper
    let pType = data.playertype
    if (pType == 1) {
        $("#player_type").html("Offence")
        pHelper = 1
    }
    else if (pType == 2) {
        $("#player_type").html("Defence")
        pHelper = 1
    }
    else if (pType == 3) {
        $("#player_type").html("Goalie")
        pHelper = 3
    }


//Skates    
let skates = new Image()
let skatesDna = data.dna.slice(12, 13)
let nSkates = 0
if(skatesDna <= 6){
    nSkates = 0
} else if(skatesDna <= 8){
    nSkates = 1
} else if(skatesDna == 9){
    nSkates = 2
}
let skatesImg = "/assets/player-" + pHelper+ "-img/PPP-skates-" + pHelper+ "-"+ nSkates + ".png"
skates.src=skatesImg;

//Laces
let laces = new Image()
let lacesDna = data.dna.slice(13, 16)
let nLaces = 0
if(lacesDna <= 1){
    nLaces = 3
} else if(lacesDna <= 10){
    nLaces = 2
} else if(lacesDna <= 500){
    nLaces = 0
} else {
    nLaces = 1
}
let lacesImg = "/assets/player-" + pHelper+ "-img/PPP-laces-" + pHelper+ "-" + nLaces + ".png"
laces.src=lacesImg;

//Legs
let legs = new Image()
if(data.equippedJersey == 0){
    let legsDna = data.dna.slice(16,17)
    let nLegs = legsDna % 10
    let legsImg = "/assets/player-" + pHelper+ "-img/PPP-legs-" + pHelper + "-" + nLegs + ".png"
    legs.src=legsImg;
}else{
    let legsImg = "/assets/player-" + pHelper + "-eq-img/PPP-eq-legs-" + pHelper + "-" + data.equippedJersey + ".png"
    legs.src=legsImg;
}


//Shorts
let shorts = new Image()
if(data.equippedJersey == 0){
    let shortsDna = data.dna.slice(17,18)
    let nShorts = shortsDna % 10
    let shortsImg = "/assets/player-" + pHelper + "-img/PPP-shorts-" + pHelper + "-" + nShorts + ".png"
    shorts.src=shortsImg;
}else{
    let shortsImg = "/assets/player-" + pHelper + "-eq-img/PPP-eq-shorts-" + pHelper + "-" + data.equippedJersey + ".png"
    shorts.src=shortsImg;
}

//Jerseys
let jerseys = new Image()
if(data.equippedJersey == 0){
    let jerseysDna = data.dna.slice(18,19)
    let nJerseys = jerseysDna % 10
    let jerseysImg = "/assets/player-" + pHelper + "-img/PPP-jersey-" + pHelper + "-" + nJerseys + ".png"
    jerseys.src=jerseysImg;
}else{
    let jerseysImg = "/assets/player-" + pHelper + "-eq-img/PPP-eq-jersey-" + pHelper + "-" + data.equippedJersey + ".png"
    jerseys.src=jerseysImg;
}

//crest
let crest = new Image()
if(data.equippedJersey == 0 && data.teamLetter != ""){
    let letter = data.teamLetter
    let crestIMG = "/assets/player-img/Crest-" + letter + ".png"
    crest.src = crestIMG
}

//Sticks
let sticks = new Image()
let sticksDna = data.dna.slice(19, 21)
let nSticks = 0
if(sticksDna <= 6){
    nSticks = 0
} else if(sticksDna <= 75){
    nSticks = 1
} else if(sticksDna <= 99){
    nSticks = 2
}
let sticksImg = "/assets/player-" + pHelper + "-img/PPP-stick-" + pHelper + "-" + nSticks + ".png"
sticks.src=sticksImg;

//Gloves
let gloves = new Image()
if(data.equippedJersey == 0){
    let glovesDna = data.dna.slice(21,22)
    let nGloves = glovesDna % 10
    let glovesImg = "/assets/player-" + pHelper + "-img/PPP-gloves-" + pHelper + "-" + nGloves + ".png"
    gloves.src=glovesImg;
}else{
    let glovesImg = "/assets/player-" + pHelper + "-eq-img/PPP-eq-gloves-" + pHelper + "-" + data.equippedJersey + ".png"
    gloves.src=glovesImg;
}

//Faces
let faces = new Image()
let facesDna = data.dna.slice(22,23)
let nFaces = facesDna % 7
let facesImg = "/assets/player-" + pHelper + "-img/PPP-face-" + pHelper + "-" + nFaces + ".png"
faces.src=facesImg;

//Facial Hair
let facialHair = new Image()
let facialHairDna = data.dna.slice(23,25)
let nFacialHair = facialHairDna % 26
let facialHairImg = "/assets/player-" + pHelper + "-img/PPP-facial-hair-" + pHelper + "-" + nFacialHair + ".png"
facialHair.src=facialHairImg;

//Hair
let hair = new Image()
let hairDna = data.dna.slice(25,26)
let nHair = hairDna % 6
let hairImg = "/assets/player-" + pHelper + "-img/PPP-hair-" + pHelper + "-" + nHair + ".png"
hair.src=hairImg;

//Helmet
let helmet = new Image()
if(data.equippedJersey == 0){
    let helmetDna = data.dna.slice(26,27)
    let nHelmet = helmetDna % 10
    let helmetImg = "/assets/player-" + pHelper + "-img/PPP-helmet-" + pHelper + "-" + nHelmet + ".png"
    helmet.src=helmetImg;
}else{
    let helmetImg = "/assets/player-" + pHelper + "-eq-img/PPP-eq-helmet-" + pHelper + "-" + data.equippedJersey + ".png"
    helmet.src=helmetImg; 
}

//Visor
let visor = new Image()
let visorDna = data.dna.slice(27,28)
let nVisor = visorDna % 10
let visorImg = "/assets/player-" + pHelper + "-img/PPP-visor-" + pHelper + "-" + nVisor + ".png"
visor.src=visorImg;

//Frame
let frame = new Image()
let frameImg = "/assets/player-img/PPP-frame.png"
frame.src=frameImg

//position
let position = new Image()
if(data.position == 0){
}else{
    let posImg = "/assets/player-img/POS-"+ data.position +".png"
    position.src=posImg
}

//Flag
let flag = new Image()
let flagCountry = playerCountry();

let flagImage = ''
if (flagCountry == "Canada"){
    flagImage = "/assets/player-img/ppp-flag-canada.png"
}
else if (flagCountry == "United States"){
    flagImage = "/assets/player-img/ppp-flag-usa.png"
}
else if (flagCountry == "Denmark"){
    flagImage = "/assets/player-img/ppp-flag-denmark.png"
}
else if (flagCountry == "Sweden"){
    flagImage = "/assets/player-img/ppp-flag-sweden.png"
}
else if (flagCountry == "Finland"){
    flagImage = "/assets/player-img/ppp-flag-finland.png"
}
else if (flagCountry == "Russia"){
    flagImage = "/assets/player-img/ppp-flag-russia.png"
}
else if (flagCountry == "Czech Republic"){
    flagImage = "/assets/player-img/ppp-flag-czech-republic.png"
}
else if (flagCountry == "Switzerland"){
    flagImage = "/assets/player-img/ppp-flag-switzerland.png"
}
else if (flagCountry == "Slovakia"){
    flagImage = "/assets/player-img/ppp-flag-slovakia.png"
}
else if (flagCountry == "Germany"){
    flagImage = "/assets/player-img/ppp-flag-germany.png"
}
else if (flagCountry == "Denmark"){
    flagImage = "/assets/player-img/ppp-flag-denmark.png"
}
else if (flagCountry == "Latvia"){
    flagImage = "/assets/player-img/ppp-flag-latvia.png"
}
else if (flagCountry == "France"){
    flagImage = "/assets/player-img/ppp-flag-france.png"
}
else if (flagCountry == "Belarus"){
    flagImage = "/assets/player-img/ppp-flag-belarus.png"
}
else if (flagCountry == "Slovenia"){
    flagImage = "/assets/player-img/ppp-flag-slovenia.png"
}
else if (flagCountry == "Norway"){
    flagImage = "/assets/player-img/ppp-flag-norway.png"
}
else if (flagCountry == "Austria"){
    flagImage = "/assets/player-img/ppp-flag-austria.png"
}
else if (flagCountry == "Netherlands"){
    flagImage = "/assets/player-img/ppp-flag-netherlands.png"
}
else if (flagCountry == "Australia"){
    flagImage = "/assets/player-img/ppp-flag-australia.png"
}
flag.src=flagImage



// let skatesLoaded
// let legsLoaded
// let shortsLoaded
// let jerseyLoaded
// let crestLoaded
// let stickLoaded
// let glovesLoaded
// let facesLoaded
// let facialhairLoaded
// let hairLoaded
// let helmetLoaded
// let visorLoaded
// let frameLoaded
// let positionLoaded
// let flagLoaded
                                                                                                         

skates.onload=function(){
    // skatesLoaded = true
    buildPlayer()
}

legs.onload=function(){
    // legsLoaded = true
   buildPlayer()
}
shorts.onload=function(){ 
    // shortsLoaded = true
   buildPlayer()
}
jerseys.onload=function(){
    // jerseyLoaded = true
   buildPlayer()
}
crest.onload=function(){
    // crestLoaded = true
   buildPlayer()
}
sticks.onload=function(){
    // stickLoaded = true
   buildPlayer()
}
gloves.onload=function(){
    // glovesLoaded = true
   buildPlayer()
}
faces.onload=function(){
    // facesLoaded = true
   buildPlayer()
}
facialHair.onload=function(){
    // facialhairLoaded = true
   buildPlayer()
}
hair.onload=function(){
    // hairLoaded = true
   buildPlayer()
}
helmet.onload=function(){
    // helmetLoaded = true
   buildPlayer()
}
visor.onload=function(){
    // visorLoaded = true
   buildPlayer()
}
frame.onload=function(){
    // frameLoaded = true
   buildPlayer()
}
position.onload=function(){
    // positionLoaded = true
   buildPlayer()
}
flag.onload=function(){
    // flagLoaded = true
    buildPlayer()
    
}

// function buildLoader(){
//     let canvas = document.getElementById('canvas-'+ pos + "-" + id )
//     if (!canvas){ return }
//     let ctx = canvas.getContext('2d')
//     canvas.width=400
//     canvas.height=500
//     let loading = new Image()
//     let loadingImg
//     if(data.playertype == 1 || data.playertype == 2 ){
//         loadingImg = "/assets/player-img/player-1-loading.png"
//     }else if(data.playertype == 3 ){
//         loadingImg = "/assets/player-img/player-3-loading.png"
//     }
//     loading.src=loadingImg;
//     ctx.drawImage(loading,0,0)
// }


    function buildPlayer(){
    let canvas = document.getElementById('canvas-'+ pos + "-" + id )
    if (!canvas){ return }
    let ctx = canvas.getContext('2d')
    canvas.width=400
    canvas.height=500
    // if (skatesLoaded && legsLoaded && shortsLoaded && jerseyLoaded && crestLoaded && stickLoaded && glovesLoaded && facesLoaded && facialhairLoaded && hairLoaded && helmetLoaded && visorLoaded && frameLoaded && positionLoaded && flagLoaded){
    //     canvas.classList.add('hide')
 
    //random bg
    if(data.equippedJersey == 0){
    let stringToColour = function(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
          var value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }
        let bgcol1 = stringToColour(firstName)
        let bgcol2 = stringToColour(lastName)
        let bgcol = ctx.createLinearGradient(0,0,100,600)
        bgcol.addColorStop(0, bgcol1)
        bgcol.addColorStop(1, bgcol2)
        ctx.fillStyle = bgcol
        ctx.fillRect(0,0,400,500)
    }else{
        let index = proShopItems.findIndex(x => x.sku == data.equippedToken)
        let bgcol1 = proShopItems[index].c1
        let bgcol2 = proShopItems[index].c2
        let bgcol = ctx.createLinearGradient(0,0,100,600)
        bgcol.addColorStop(0, bgcol1)
        bgcol.addColorStop(1, bgcol2)
        ctx.fillStyle = bgcol
        ctx.fillRect(0,0,400,500)
    }
// }else{
//     let loading = new Image()
//     let loadingImg
//     if(data.playertype == 1 || data.playertype == 2 ){
//         loadingImg = "/assets/player-img/player-1-loading.png"
//     }else if(data.playertype == 3 ){
//         loadingImg = "/assets/player-img/player-3-loading.png"
//     }
//     loading.src=loadingImg;
//     ctx.drawImage(loading,0,0)
// }

    //player elements offset
    let offsetx = -25
    let offsety = -5
    let goffsetx = -30
    let goffsety = -20
    
    //draw elements on canvas
    if(data.playertype == 1){
        ctx.drawImage(skates,144+offsetx,320+offsety)
        ctx.drawImage(laces,172+offsetx,344+offsety)
        ctx.drawImage(legs,152+offsetx,284+offsety)
        ctx.drawImage(shorts,148+offsetx,220+offsety)
        ctx.drawImage(jerseys,120+offsetx,112+offsety)
        if(data.equippedJersey == 0 && data.teamLetter != ""){
            ctx.drawImage(crest,155+offsetx,140+offsety)
        }
        ctx.drawImage(sticks,104+offsetx,152+offsety)
        ctx.drawImage(gloves,148+offsetx,194+offsety)
        ctx.drawImage(faces,186+offsetx,52+offsety)
        ctx.drawImage(facialHair,190+offsetx,52+offsety)
        ctx.drawImage(hair,178+offsetx,48+offsety)
        ctx.drawImage(helmet,182+offsetx,8+offsety)
        ctx.drawImage(visor,198+offsetx,36+offsety)
        ctx.drawImage(frame,0,0)
        ctx.drawImage(flag,5,430 )
        if(data.position != "0"){
            ctx.drawImage(position, 280,235)
        }
        
    }else if(data.playertype == 2){
        ctx.drawImage(skates,144+offsetx,320+offsety)
        ctx.drawImage(laces,172+offsetx,344+offsety)
        ctx.drawImage(legs,152+offsetx,284+offsety)
        ctx.drawImage(shorts,148+offsetx,220+offsety)
        ctx.drawImage(jerseys,120+offsetx,112+offsety)
        if(data.equippedJersey == 0 && data.teamLetter != ""){
            ctx.drawImage(crest,155+offsetx,140+offsety)
        }
        ctx.drawImage(sticks,104+offsetx,152+offsety)
        ctx.drawImage(gloves,148+offsetx,194+offsety)
        ctx.drawImage(faces,186+offsetx,52+offsety)
        ctx.drawImage(facialHair,190+offsetx,52+offsety)
        ctx.drawImage(hair,178+offsetx,48+offsety)
        ctx.drawImage(helmet,182+offsetx,8+offsety)
        ctx.drawImage(visor,198+offsetx,36+offsety)
        ctx.drawImage(frame,0,0)
        ctx.drawImage(flag,5,430 )
        if(data.position != "0"){
            ctx.drawImage(position, 280,235)
        }
        
    }else if(data.playertype == 3){
        ctx.drawImage(skates,150+goffsetx,330+goffsety)
        ctx.drawImage(laces,172+goffsetx,354+goffsety)
        ctx.drawImage(legs,150+goffsetx,266+goffsety)
        ctx.drawImage(shorts,114+goffsetx,216+goffsety)
        ctx.drawImage(jerseys,120+goffsetx,112+goffsety)
        if(data.equippedJersey == 0 && data.teamLetter != ""){
            ctx.drawImage(crest,190+offsetx,130+offsety)
        }
        ctx.drawImage(sticks,104+goffsetx,78+goffsety)
        ctx.drawImage(gloves,154+goffsetx,168+goffsety)
        ctx.drawImage(faces,210+goffsetx,28+goffsety)
        ctx.drawImage(facialHair,214+goffsetx,56+goffsety)
        ctx.drawImage(hair,202+goffsetx,78+goffsety)
        ctx.drawImage(helmet,194+goffsetx,26+goffsety)
        ctx.drawImage(visor,224+goffsetx,70+goffsety)
        ctx.drawImage(frame,0,0)
        ctx.drawImage(flag,5,430 )
        if(data.position != "0"){
            ctx.drawImage(position, 280,235)
        }
        
    }

    //Age Settings
    let yearsActve = 22
    let startAge = 18
    let careerLength = data.ageoutTimestamp - data.draftTimestamp
    let careerProgress = Math.floor(Date.now() / 10 ** 3) - data.draftTimestamp
    let oneYearSpan = careerLength/yearsActve
    let yearsIntoCareer = Math.floor(careerProgress/oneYearSpan)
    let playerAge = startAge + yearsIntoCareer

    //Skill Font
    ctx.font = "30px pixels"
    ctx.fillStyle = "black"
    if(pType != 3){
        ctx.fillText("OP: " + data.offence, 270, 70)
        ctx.fillText("DP: " + data.defence, 270, 110)
        if(playerAge <= 40){
            ctx.fillText("AGE: " + playerAge, 265, 150) 
        }else if(playerAge > 40){
            ctx.fillText("Retired", 265, 150)  
        }
    }else if (pType == 3){
        ctx.fillText("DP: " + data.defence, 270, 95)
        if(playerAge <= 40){
            ctx.fillText("AGE: " + playerAge, 265, 135) 
        }else if(playerAge > 40){
            ctx.fillText("Retired", 265, 135)  
        }
    }

    if(pType == 1){
        ctx.font = "20px pixels";
        ctx.fillText("Offence", 275, 180)
    }else if(pType == 2){
        ctx.font = "20px pixels";
        ctx.fillText("Defence", 270, 180)
    }else if(pType == 3){
        ctx.font = "20px pixels";
        ctx.fillText("Goalie", 270, 180)
    }

    //First Name Last Name
    ctx.font = "30px pixels";
    let fNameWidth = ctx.measureText(firstName)
    let lNameWidth = ctx.measureText(lastName)
    let fNameX = 400 - (fNameWidth.width + 10)
    let fNameY = 400
    let lNameX = 400 - (lNameWidth.width + 10)
    let lNameY = 430
    let fNameThicc = 3
    ctx.fillStyle = "black"
    ctx.fillText(firstName, fNameX+fNameThicc, fNameY+fNameThicc)
    ctx.fillText(firstName, fNameX-fNameThicc, fNameY+fNameThicc)
    ctx.fillText(firstName, fNameX+fNameThicc, fNameY-fNameThicc)
    ctx.fillText(firstName, fNameX-fNameThicc, fNameY-fNameThicc)
    ctx.fillText(lastName, lNameX+fNameThicc, lNameY+fNameThicc)
    ctx.fillText(lastName, lNameX-fNameThicc, lNameY+fNameThicc)
    ctx.fillText(lastName, lNameX+fNameThicc, lNameY-fNameThicc)
    ctx.fillText(lastName, lNameX-fNameThicc, lNameY-fNameThicc)
    ctx.fillStyle = "white"
    ctx.fillText(firstName, fNameX, fNameY)
    ctx.fillText(lastName, lNameX, lNameY)
    //Id Number
    ctx.font = "20px pixels";
    ctx.fillStyle = "black"
    let idWidth = ctx.measureText("#" + id)
    let idX = 400 - (idWidth.width + 10)
    ctx.fillText("#" + id, idX, 496)

    // if (skatesLoaded && legsLoaded && shortsLoaded && jerseyLoaded && crestLoaded && stickLoaded && glovesLoaded && facesLoaded && facialhairLoaded && hairLoaded && helmetLoaded && visorLoaded && frameLoaded && positionLoaded && flagLoaded){
    //    console.log("All Loaded")
    //     canvas.classList.remove('hide')
    // }
    }
    
function playerCountry(){
        const countries = [
            ['Canada', 4274],
            ['United States', 2793],
            ['Sweden', 967],
            ['Finland', 582],
            ['Russia', 523],
            ['Czech Republic', 335],
            ['Switzerland', 118],
            ['Slovakia', 98],
            ['Germany', 88],
            ['Denmark', 78],
            ['Latvia', 39],
            ['France', 29],
            ['Belarus', 19],
            ['Slovenia', 14],
            ['Norway', 13],
            ['Austria', 11],
            ['Netherlands', 10],
            ['Australia', 9]
        ]
    
        let total = 0
        for (let i = 0; i < countries.length; ++i) {
            total += countries[i][1];
            
        }

        let threshold = data.dna.slice(8,12)
        //console.log("Country Threshold Player " + id + ": " + threshold)
        threshold = threshold - 0
    
        total = 0;
        for (let i = 0; i < countries.length - 1; ++i) {
            total += countries[i][1]
            if (total >= threshold) {
                //console.log("Selected Country Player " + id + ": " + countries[i][0])
                return countries[i][0]
                
            }
        }
        return countries[countries.length - 1][0]
    }
}

export default {
    preloadPlayerInfo
}

