let canvas =  document.getElementById("canvas1");
let ctx = canvas.getContext('2d');
// canvas.width = 1600;  //2800
// canvas.height = 800;  //1400
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




// window.addEventListener('resize', function(){
//   canvasPosition = canvas.getBoundingClientRect();
//   mouse.x = canvas.width/2;
//   mouse.y = canvas.height/2;
// });


// document.addEventListener("click", (event)=>{
//   console.log(`x = ${event.clientX-canvasPosition.left} 
//                y = ${event.clientY-canvasPosition.top}` )})

const canvasPosition = canvas.getBoundingClientRect()
let battlCell = 10;
let battlCellMin = 10;
let battlCellMax = 29;
let battlCellSize = 32;
let battlSize = battlCell*battlCellSize;

let fontSize = battlCellSize + 'px';
ctx.font = `${fontSize} 'Caveat'`;

const ships = {
  ships1:4,
  ships2:3,
  ships3:2,
  ships4:1,
}

const battlegroundPosition1 = {
  x:canvas.width/2 - 128 - battlSize,
  y:battlCellSize*2,
}
const battlegroundPosition2 = {
  x:canvas.width/2 + 128,
  y:battlCellSize*2
}
const shipDockPosition1 = {
  x:canvas.width/2 - 128 - battlSize,
  y:battlCellSize*2 + battlSize + battlCellSize*2,
}
const shipDockPosition2 = {
  x:canvas.width/2 + 128,
  y:battlCellSize*2 + battlSize + battlCellSize*2,
}


//Background
function createBackgroundPattern (){
  const patternCanvas = document.createElement('canvas');
  const patternContext = patternCanvas.getContext('2d');
  patternCanvas.width = battlCellSize;
  patternCanvas.height = battlCellSize;
  patternContext.beginPath();
  patternContext.rect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.strokeStyle = "rgba(40, 46, 250, 0.05)";
  patternContext.fillStyle = "rgba(250, 250, 250, 1)" 
  patternContext.fill()
  patternContext.stroke();
  return patternCanvas
} 

const pattern = ctx.createPattern(createBackgroundPattern (), 'repeat');
ctx.fillStyle = pattern;
ctx.fillRect(0, 0, canvas.width, canvas.height);




// mouse
const mouse = 
{ x:canvas.width/2,
  y:canvas.height/2,
  left:false,
  pLeft:false,
  right:false,
  pRight:false,
  takeObject:{},
  over: false,
}




// canvas.addEventListener("mouseenter", enterHandler);
// canvas.addEventListener("mouseleave", leaveHandler);

// function enterHandler(event) {
//   mouse.over = true;
// }

// function leaveHandler(event) {
//   mouse.over = false;
// }




canvas.addEventListener("mousemove", moveHandler);
canvas.addEventListener("mousedown", downHandler);
canvas.addEventListener("mouseup", upHandler);




function moveHandler(event){
  mouse.x = event.clientX-canvasPosition.left;
  mouse.y = event.clientY-canvasPosition.top;
}

function downHandler(event){
  if (event.button === 0) {
    mouse.left = true;
  } 
  if (event.button === 2) {
    mouse.right = true;
  }
}

function upHandler(event){
  if (event.button === 0) {
    mouse.left = false;
  } 
  if (event.button === 2) {
    mouse.right = false;
  }
  
}

function mousePreviouslyClick() {
  mouse.pLeft = mouse.left;
  mouse.pRight = mouse.right;
}


// Drag'n'Drop
function takeObj (Player){ 
  //Take Obj on ship dock
  if (mouse.left && !mouse.pLeft){
  let {shipDock} = Player;
  let shipDockKey = Object.keys(shipDock)
  for (i = 0; i<shipDockKey.length; i++){
      if ( (shipDock[shipDockKey[i]].position.sX <= mouse.x) 
            && (shipDock[shipDockKey[i]].position.sX + battlCellSize*(i+1) >= mouse.x)
            && (shipDock[shipDockKey[i]].position.sY <= mouse.y)
            && (shipDock[shipDockKey[i]].position.sY + battlCellSize*(i+1) >= mouse.y)){
                mouse.takeObject=shipDock[shipDockKey[i]];
                mouse.takeObjectHorizontal = true;
        }
        
      }
      console.log(mouse.takeObject)  
      console.log(mouse.takeObjectHorizontal)  
    }
    if (mouse.right && !mouse.pRight){
      mouse.takeObjectHorizontal = !mouse.takeObjectHorizontal
      console.log(mouse.takeObjectHorizontal)  
    }
    if (!mouse.left && !mouse.pLeft){
    mouse.takeObject={}
    }
}

  function dragObj (){
  if (Object.keys(mouse.takeObject).length != 0){
    ctx.beginPath();
    ctx.strokeStyle = "rgba(40, 46, 250, 1)";
    ctx.lineWidth = 4; 
    if (mouse.takeObjectHorizontal){
      ctx.rect(mouse.x-battlCellSize*mouse.takeObject.size/2, 
      mouse.y-battlCellSize/2, 
      battlCellSize*mouse.takeObject.size, 
      battlCellSize);}
    else {
      ctx.rect(mouse.x-battlCellSize/2, 
      mouse.y-battlCellSize*mouse.takeObject.size/2, 
      battlCellSize, 
      battlCellSize*mouse.takeObject.size);
    }  
    
    ctx.stroke(); 
  }
}



 



// function takeObjHandler(event){
//   let mX = event.clientX-canvasPosition.left;
//   let mY = event.clientY-canvasPosition.top;
//   let {shipDock} = Player1;
//   let shipDockKey = Object.keys(shipDock)
//   for (i = 0; i<shipDockKey.length; i++){
//       if ( (shipDock[shipDockKey[i]].position.sX <= mX) 
//             && (shipDock[shipDockKey[i]].position.sX + battlCellSize*(i+1) >= mX)
//             && (shipDock[shipDockKey[i]].position.sY <= mY)
//             && (shipDock[shipDockKey[i]].position.sY + battlCellSize*(i+1) >= mY)){
//                 mouse.takeObject=shipDock[shipDockKey[i]]
//         }
//       } 
//       console.log(mouse.takeObject)  
//  }







// function takeObjHandler(event){
//   let mX = event.clientX-canvasPosition.left;
//   let mY = event.clientY-canvasPosition.top;
//   let {shipDock} = Player1;
//   let shipDockKey = Object.keys(shipDock)
//   for (i = 0; i<shipDockKey.length; i++){
//       if ( (shipDock[shipDockKey[i]].position.sX <= mX) 
//             && (shipDock[shipDockKey[i]].position.sX + battlCellSize*(i+1) >= mX)
//             && (shipDock[shipDockKey[i]].position.sY <= mY)
//             && (shipDock[shipDockKey[i]].position.sY + battlCellSize*(i+1) >= mY)){
//                 mouse.takeObject=shipDock[shipDockKey[i]]
//         }
//       }
//   console.log(mouse.takeObject)  
//  }


//  function moveObjHandler(event){
//   if (Object.keys(mouse.takeObject).length != 0){
//     mouse.x = event.clientX-canvasPosition.left;
//     mouse.y = event.clientY-canvasPosition.top;
//     console.log(mouse)
//   }
//  }










function makeBattleground(){
const battleground = []
for (let y = 0; y<battlCell; y++){
  battleground[y] = []
  for (let x = 0; x<battlCell; x++){
    battleground[y][x] = {
      cX: 0,
      cY: 0,
      ship: 0,
      strike: 0,
      block: 0,
      }
  }
}
return battleground
}


function drawBattleground(Player){
  for (let y = 0; y<battlCell; y++){
    for (let x = 0; x<battlCell; x++){
      let cX = x * (battlCellSize) + Player.battlegroundPosition.x;
      let cY = y * (battlCellSize) + Player.battlegroundPosition.y;
      Player.battleground[y][x].cX = cX;
      Player.battleground[y][x].cY = cY;
      // ctx.beginPath();
      // ctx.rect(cX , cY , battlCellSize , battlCellSize);
      // ctx.strokeStyle = "rgba(40, 46, 250, 0.05)";
      // ctx.lineWidth = 1;    
      // ctx.fillStyle = "rgba(250, 250, 250, 1)" 
      // ctx.fill()
      // ctx.stroke();
      if (Player.battleground[y][x].ship){}
      if (Player.battleground[y][x].strike){}
      if (Player.battleground[y][x].block){}
    }
  }
 
  
  ctx.fillStyle = "rgba(6, 25, 247, 1)";
  let letterX = Player.battlegroundPosition.x + battlCellSize/4;
  let letterY = Player.battlegroundPosition.y - battlCellSize + battlCellSize/2 ;
  let letterAlphabet = 'абвгдежзиклмнопрстуфхцчшщыэюя';
  let numberX = Player.battlegroundPosition.x - battlCellSize + battlCellSize/4;
  let numberY = Player.battlegroundPosition.y - battlCellSize/4;
  for (i = 0; i< battlCell; i++ ){
    ctx.fillText(letterAlphabet[i], letterX+ battlCellSize*i, letterY)
   }
  for (j = 1; j<= battlCell; j++ ){
    let bigNamberX = numberX 
    if (j>=10)(bigNamberX = bigNamberX - battlCellSize/2)
    ctx.fillText(j, bigNamberX , numberY+ battlCellSize*j)
  }
  ctx.beginPath();
      ctx.rect(Player.battlegroundPosition.x , Player.battlegroundPosition.y , battlSize , battlSize);
      ctx.strokeStyle = "rgba(6, 25, 247, 1)";
      ctx.lineWidth = 4;    
      ctx.stroke();  
  }




function makeShipDock(){
  const shipDock = {};
  shipDock.ships1= {
    name:"ships1",
    numberOf: ships.ships1,
    size:1,
    position: {sX:0, sY:0},
  }
  shipDock.ships2= {
    name:"ships2",
    numberOf: ships.ships2,
    size:2,
    position: {sX:0, sY:0},
  }
  shipDock.ships3= {
    name:"ships3",
    numberOf: ships.ships3,
    size:3,
    position: {sX:0, sY:0},
  }
  shipDock.ships4= {
    name: "ships4",
    numberOf: ships.ships4,
    size:4,
    position: {sX:0, sY:0},
  }
   return shipDock
}


function drawShipDock(Player){
      // ctx.beginPath();
      // ctx.rect(Player.shipDockPosition.x , Player.shipDockPosition.y , battlSize , battlSize);
      // ctx.strokeStyle = "rgba(6, 25, 247, 1)";
      // ctx.lineWidth = 4;  
      // ctx.stroke();
      // for (i = 0; i<Object.keys(Player.shipDock).length; i++){
      //   Object.entries
      //   Player.shipDock.ships
      // }
      ctx.strokeStyle = "rgba(6, 25, 247, 1)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ships1PositionX = Player.shipDockPosition.x+battlCellSize*5
      ships1PositionY = Player.shipDockPosition.y+battlCellSize 
      ships2PositionX = Player.shipDockPosition.x+battlCellSize*4
      ships2PositionY = Player.shipDockPosition.y+battlCellSize*3
      ships3PositionX = Player.shipDockPosition.x+battlCellSize*3
      ships3PositionY = Player.shipDockPosition.y+battlCellSize*5
      ships4PositionX = Player.shipDockPosition.x+battlCellSize*2
      ships4PositionY = Player.shipDockPosition.y+battlCellSize*7
      Player.shipDock.ships1.position.sX = ships1PositionX;
      Player.shipDock.ships1.position.sY = ships1PositionY;
      Player.shipDock.ships2.position.sX = ships2PositionX;
      Player.shipDock.ships2.position.sY = ships2PositionY;
      Player.shipDock.ships3.position.sX = ships3PositionX;
      Player.shipDock.ships3.position.sY = ships3PositionY;
      Player.shipDock.ships4.position.sX = ships4PositionX;
      Player.shipDock.ships4.position.sY = ships4PositionY;
    
      ctx.beginPath();
      ctx.rect( ships1PositionX, ships1PositionY , battlCellSize , battlCellSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect( ships2PositionX, ships2PositionY , battlCellSize*2 , battlCellSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect( ships3PositionX, ships3PositionY , battlCellSize*3 , battlCellSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect( ships4PositionX, ships4PositionY , battlCellSize*4 , battlCellSize);
      ctx.stroke();
 
      ctx.fillStyle = "rgba(6, 25, 247, 1)";
      ctx.fillText(" - " + Player.shipDock.ships1.numberOf + " шт.", Player.shipDockPosition.x+battlCellSize*6.9 , Player.shipDockPosition.y+battlCellSize*1.8 )
      ctx.fillText(" - " + Player.shipDock.ships2.numberOf + " шт.", Player.shipDockPosition.x+battlCellSize*6.9 , Player.shipDockPosition.y+battlCellSize*3.8 )
      ctx.fillText(" - " + Player.shipDock.ships3.numberOf + " шт.", Player.shipDockPosition.x+battlCellSize*6.9 , Player.shipDockPosition.y+battlCellSize*5.8 )
      ctx.fillText(" - " + Player.shipDock.ships4.numberOf + " шт.", Player.shipDockPosition.x+battlCellSize*6.9 , Player.shipDockPosition.y+battlCellSize*7.8 )
}

const Player1 = {
  battleground: makeBattleground(),
  shipDock: makeShipDock(),
  battlegroundPosition: battlegroundPosition1,
  shipDockPosition: shipDockPosition1,
}
const Player2 = {
  battleground: makeBattleground(),
  shipDock: makeShipDock(),
  battlegroundPosition: battlegroundPosition2,
  shipDockPosition: shipDockPosition2,
}





function drawPreparationScreen(obj){
  const { update, clear, render} = obj;
  requestAnimationFrame(tick);
function tick () { 
  requestAnimationFrame(tick);
  update()
  clear()
  render()
}


}

drawPreparationScreen({
  update(){
    takeObj (Player1)

    mousePreviouslyClick()
  },
  clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height )
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  render(){
    drawBattleground(Player1);
    drawBattleground(Player2);
    drawShipDock(Player1);
    drawShipDock(Player2);
    dragObj()
    
  }
})


// console.log(Player1)
 console.log(Player2)
// setInterval(draw, 10);





 
