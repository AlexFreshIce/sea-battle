let canvas =  document.getElementById("canvas");
let ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 800;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;}

// const rect = canvas.getBoundingClientRect()
// document.addEventListener("click", (event)=>{
//   console.log(`x = ${event.clientX-rect.left} 
//                y = ${event.clientY-rect.top}` )})

  




let battlCell = 10;
let battlCellMin = 10;
let battlCellMax = 28;
let battlCellSize = 32;
let battlSize = battlCell*battlCellSize;
let battlegroundPosition1 = {
  x:canvas.width/2 - 128 - battlSize,
  y:battlCellSize*2,
}
let battlegroundPosition2 = {
  x:canvas.width/2 + 128,
  y:battlCellSize*2
}
let shipDockPosition1 = {
  x:canvas.width/2 - 128 - battlSize,
  y:battlCellSize*2 + battlSize + battlCellSize*2,
}
let shipDockPosition2 = {
  x:canvas.width/2 + 128,
  y:battlCellSize*2 + battlSize + battlCellSize*2,
}
const ships = {
  ships1:4,
  ships2:3,
  ships3:2,
  ships4:1,
}


let fontSize = battlCellSize - battlCellSize/4 + 'px';


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
 
  ctx.font = `${fontSize} serif`;
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
    if (j>=10)(bigNamberX = bigNamberX - battlCellSize/4)
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
    numberOf: ships.ships1,
    position: {sX:0, sY:0}
  }
  shipDock.ships2= {
    numberOf: ships.ships4,
    position: {sX:0, sY:0}
  }
  shipDock.ships3= {
    numberOf: ships.ships4,
    position: {sX:0, sY:0}
  }
  shipDock.ships4= {
    numberOf: ships.ships4,
    position: {sX:0, sY:0}
  }
   return shipDock
}


function drawShipDockd(Player){
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
      ctx.font = `${fontSize} serif`;
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

function drawPreparationScreen(){
drawBattleground(Player1);
drawBattleground(Player2);
drawShipDockd(Player1);
drawShipDockd(Player2);
}

drawPreparationScreen()



// console.log(Player1)
 console.log(Player2)
// setInterval(draw, 10);
