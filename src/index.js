const playButton = document.getElementById('playButton');
playButton.addEventListener('click', startPlay);
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 800;

let canvasPosition = canvas.getBoundingClientRect();
let allLineWidth = 4;
let blockArcRadius = 3;
let strikeArcRadius = 4;

function startPlay(event) {
  event.preventDefault();
  const cellSizeInput = document.getElementById('cellSize');
  const numberOfCellInput = document.getElementById('numberOfCell');
  const ships1Input = document.getElementById('ships1');
  const ships2Input = document.getElementById('ships2');
  const ships3Input = document.getElementById('ships3');
  const ships4Input = document.getElementById('ships4');
  document.querySelector('.settings').style.display = 'none';
  const settings = {
    battlCell: +numberOfCellInput.value,
    battlCellSize: +cellSizeInput.value,
    ships: {
      ships1: +ships1Input.value,
      ships2: +ships2Input.value,
      ships3: +ships3Input.value,
      ships4: +ships4Input.value,
    },
    settingsDone: true,
  };
  const { battlCell, battlCellSize } = settings;

  const fontSize = `${battlCellSize}px`;
  ctx.font = `${fontSize} 'Caveat'`;
  if (battlCellSize === 16) {
    allLineWidth = 2;
    blockArcRadius = 1;
    strikeArcRadius = 2;
  }
  const battlSize = battlCell * battlCellSize;

  const battlegroundPosition1 = {
    x: canvas.width / 2 - battlSize - battlCellSize * 4,
    y: battlCellSize * 2,
  };
  const battlegroundPosition2 = {
    x: canvas.width / 2 + battlCellSize * 4,
    y: battlCellSize * 2,
  };
  const shipDockPosition1 = {
    x: canvas.width / 2 - battlSize - battlCellSize * 4,
    y: battlCellSize * 2 + battlSize + battlCellSize * 2,
  };
  const shipDockPosition2 = {
    x: canvas.width / 2 + battlCellSize * 4,
    y: battlCellSize * 2 + battlSize + battlCellSize * 2,
  };
  const Player1 = {
    name: 'Player 1',
    battleground: makeBattleground(settings),
    battlegroundShips: {
      ships1: 0,
      ships2: 0,
      ships3: 0,
      ships4: 0,
    },
    shipDock: makeShipDock(settings),
    battlegroundPosition: battlegroundPosition1,
    shipDockPosition: shipDockPosition1,
    allShipsOnBattleground: false,
    allShipsDead: false,
    activePlayer: true,
  };
  const Player2 = {
    name: 'Player 2',
    battleground: makeBattleground(settings),
    battlegroundShips: {
      ships1: 0,
      ships2: 0,
      ships3: 0,
      ships4: 0,
    },
    shipDock: makeShipDock(settings),
    battlegroundPosition: battlegroundPosition2,
    shipDockPosition: shipDockPosition2,
    allShipsOnBattleground: false,
    allShipsDead: false,
    activePlayer: false,
  };
  const pattern = ctx.createPattern(createBackgroundPattern(battlCellSize), 'repeat');
  function resizeCanvas() {
    canvas.width = 1600;
    canvas.height = 800;
    canvasPosition = canvas.getBoundingClientRect();
    ctx.font = `${fontSize} 'Caveat'`;
  }

  window.addEventListener('resize', resizeCanvas, false);

  drawGame(settings, Player1, Player2, pattern, fontSize, battlSize);
}

function makeShipDock(settings) {
  const { ships } = settings;
  const shipDock = {};
  shipDock.ships1 = {
    name: 'ships1',
    numberOf: ships.ships1,
    size: 1,
    position: { sX: 0, sY: 0 },
  };
  shipDock.ships2 = {
    name: 'ships2',
    numberOf: ships.ships2,
    size: 2,
    position: { sX: 0, sY: 0 },
  };
  shipDock.ships3 = {
    name: 'ships3',
    numberOf: ships.ships3,
    size: 3,
    position: { sX: 0, sY: 0 },
  };
  shipDock.ships4 = {
    name: 'ships4',
    numberOf: ships.ships4,
    size: 4,
    position: { sX: 0, sY: 0 },
  };
  return shipDock;
}

function makeBattleground(settings) {
  const { battlCell } = settings;
  const battleground = [];
  for (let y = 0; y < battlCell; y++) {
    battleground[y] = [];
    for (let x = 0; x < battlCell; x++) {
      battleground[y][x] = {
        cX: 0,
        cY: 0,
        ship: false,
        strike: false,
        block: false,
      };
    }
  }
  return battleground;
}

// Background
function createBackgroundPattern(battlCellSize) {
  const patternCanvas = document.createElement('canvas');
  const patternContext = patternCanvas.getContext('2d');
  patternCanvas.width = battlCellSize;
  patternCanvas.height = battlCellSize;
  patternContext.beginPath();
  patternContext.rect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.strokeStyle = 'rgba(40, 46, 250, 0.05)';
  patternContext.fillStyle = 'rgba(250, 250, 250, 1)';
  patternContext.fill();
  patternContext.stroke();
  return patternCanvas;
}

function drawGame(settings, Player1, Player2, pattern, fontSize, battlSize) {
  const { battlCellSize, battlCell, ships } = settings;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // mouse
  const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    left: false,
    pLeft: false,
    right: false,
    pRight: false,
    takeObject: {},
    takeObjectHorizontal: true,
  };

  function moveHandler(event) {
    mouse.x = Math.round((event.clientX - canvasPosition.left)
    * (canvas.width / canvasPosition.width) * 1000) / 1000;
    mouse.y = Math.round((event.clientY - canvasPosition.y)
    * (canvas.height / canvasPosition.height) * 1000) / 1000;
  }

  function downHandler(event) {
    if (event.button === 0) {
      mouse.left = true;
    }
    if (event.button === 2) {
      mouse.right = true;
    }
  }

  function upHandler(event) {
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

  canvas.addEventListener('mousemove', moveHandler);
  canvas.addEventListener('mousedown', downHandler);
  canvas.addEventListener('mouseup', upHandler);

  // Drag'n'Drop
  function takeObj(Player) {
    // Take Obj on ship dock
    if (mouse.left && !mouse.pLeft) {
      const { shipDock } = Player;
      const shipDockKey = Object.keys(shipDock);
      for (let i = 0; i < shipDockKey.length; i++) {
        if ((shipDock[shipDockKey[i]].position.sX <= mouse.x)
              && (shipDock[shipDockKey[i]].position.sX + battlCellSize * (i + 1) >= mouse.x)
              && (shipDock[shipDockKey[i]].position.sY <= mouse.y)
              && (shipDock[shipDockKey[i]].position.sY + battlCellSize * (i + 1) >= mouse.y)
              && (shipDock[shipDockKey[i]].numberOf)
        ) {
          mouse.takeObject = shipDock[shipDockKey[i]];
          mouse.takeObjectHorizontal = true;
        }
      }
      // Take Obj on battleground
      let shipSize = 1;
      let shipHorizontal = true;
      for (let y = 0; y < battlCell; y++) {
        for (let x = 0; x < battlCell; x++) {
          if ((Player.battleground[y][x].cX <= mouse.x)
          && (Player.battleground[y][x].cX + battlCellSize >= mouse.x)
          && (Player.battleground[y][x].cY <= mouse.y)
          && (Player.battleground[y][x].cY + battlCellSize >= mouse.y)
          && (Player.battleground[y][x].ship)
          ) {
            Player.battleground[y][x].ship = false;
            if (Player.battleground?.[y]?.[x - 1]?.ship) {
              shipSize += 1;
              Player.battleground[y][x - 1].ship = false;
              if (Player.battleground?.[y]?.[x - 2]?.ship) {
                shipSize += 1;
                Player.battleground[y][x - 2].ship = false;
                if (Player.battleground?.[y]?.[x - 3]?.ship) {
                  shipSize += 1;
                  Player.battleground[y][x - 3].ship = false;
                }
              }
            }
            if (Player.battleground?.[y]?.[x + 1]?.ship) {
              shipSize += 1;
              Player.battleground[y][x + 1].ship = false;
              if (Player.battleground?.[y]?.[x + 2]?.ship) {
                shipSize += 1;
                Player.battleground[y][x + 2].ship = false;
                if (Player.battleground?.[y]?.[x + 3]?.ship) {
                  shipSize += 1;
                  Player.battleground[y][x + 3].ship = false;
                }
              }
            }
            if (Player.battleground?.[y - 1]?.[x]?.ship) {
              shipHorizontal = false;
              shipSize += 1;
              Player.battleground[y - 1][x].ship = false;
              if (Player.battleground?.[y - 2]?.[x]?.ship) {
                shipSize += 1;
                Player.battleground[y - 2][x].ship = false;
                if (Player.battleground?.[y - 3]?.[x]?.ship) {
                  shipSize += 1;
                  Player.battleground[y - 3][x].ship = false;
                }
              }
            }
            if (Player.battleground?.[y + 1]?.[x]?.ship) {
              shipHorizontal = false;
              shipSize += 1;
              Player.battleground[y + 1][x].ship = false;
              if (Player.battleground?.[y + 2]?.[x]?.ship) {
                shipSize += 1;
                Player.battleground[y + 2][x].ship = false;
                if (Player.battleground?.[y + 3]?.[x]?.ship) {
                  shipSize += 1;
                  Player.battleground[y + 3][x].ship = false;
                }
              }
            }
            if (shipSize === 4) {
              mouse.takeObject = shipDock.ships4;
              Player.battlegroundShips.ships4 -= 1;
            }
            if (shipSize === 3) {
              mouse.takeObject = shipDock.ships3;
              Player.battlegroundShips.ships3 -= 1;
            }
            if (shipSize === 2) {
              mouse.takeObject = shipDock.ships2;
              Player.battlegroundShips.ships2 -= 1;
            }
            if (shipSize === 1) {
              mouse.takeObject = shipDock.ships1;
              Player.battlegroundShips.ships1 -= 1;
            }
            createBlockCellOnPreparation(Player, settings);
            mouse.takeObjectHorizontal = shipHorizontal;
          }
        }
      }
    }
    if (mouse.right && !mouse.pRight) {
      mouse.takeObjectHorizontal = !mouse.takeObjectHorizontal;
    }
    if (!mouse.left && !mouse.pLeft) {
      mouse.takeObject = {};
    }
  }

  function dragObj() {
    if (Object.keys(mouse.takeObject).length !== 0) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(40, 46, 250, 1)';
      ctx.lineWidth = `${allLineWidth}`;
      if (mouse.takeObjectHorizontal) {
        if (mouse.takeObject.size >= 1) {
          ctx.rect(
            mouse.x - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
            mouse.y - battlCellSize / 2,
            battlCellSize,
            battlCellSize,
          );
          if (mouse.takeObject.size >= 2) {
            ctx.rect(
              mouse.x - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
              mouse.y - battlCellSize / 2,
              battlCellSize * 2,
              battlCellSize,
            );
            if (mouse.takeObject.size >= 3) {
              ctx.rect(
                mouse.x - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
                mouse.y - battlCellSize / 2,
                battlCellSize * 3,
                battlCellSize,
              );
              if (mouse.takeObject.size >= 4) {
                ctx.rect(
                  mouse.x - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
                  mouse.y - battlCellSize / 2,
                  battlCellSize * 4,
                  battlCellSize,
                );
              }
            }
          }
        }
      } else {
        if (mouse.takeObject.size >= 1) {
          ctx.rect(
            mouse.x - battlCellSize / 2,
            mouse.y - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
            battlCellSize,
            battlCellSize,
          );
          if (mouse.takeObject.size >= 2) {
            ctx.rect(
              mouse.x - battlCellSize / 2,
              mouse.y - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
              battlCellSize,
              battlCellSize * 2,
            );
            if (mouse.takeObject.size >= 3) {
              ctx.rect(
                mouse.x - battlCellSize / 2,
                mouse.y - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
                battlCellSize,
                battlCellSize * 3,
              );
              if (mouse.takeObject.size >= 4) {
                ctx.rect(
                  mouse.x - battlCellSize / 2,
                  mouse.y - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
                  battlCellSize,
                  battlCellSize * 4,
                );
              }
            }
          }
        }
        ctx.rect(
          mouse.x - battlCellSize / 2,
          mouse.y - battlCellSize * mouse.takeObject.size + battlCellSize / 2,
          battlCellSize,
          battlCellSize * mouse.takeObject.size,
        );
      }

      ctx.stroke();
    }
  }

  function dropObj(Player) {
    if (!mouse.left && mouse.pLeft) {
      for (let y = 0; y < settings.battlCell; y++) {
        for (let x = 0; x < settings.battlCell; x++) {
          if ((Player.battleground[y][x].cX <= mouse.x)
      && (Player.battleground[y][x].cY <= mouse.y)
      && (Player.battleground[y][x].cX + battlCellSize >= mouse.x)
      && (Player.battleground[y][x].cY + battlCellSize >= mouse.y)
      && (!Player.battleground[y][x].ship)
      && (!Player.battleground[y][x].block)
          ) {
            if (mouse.takeObjectHorizontal
            && mouse.takeObject.size === 1
            && (Player.battleground[y][x].cX - mouse.takeObject.size * battlCellSize + battlCellSize
              >= Player.battlegroundPosition.x)
            && !Player.battleground[y][x].block) {
              Player.battleground[y][x].ship = true;
              Player.battlegroundShips.ships1 += 1;
            }
            if (mouse.takeObjectHorizontal
          && mouse.takeObject.size === 2
          && (Player.battleground[y][x].cX - mouse.takeObject.size * battlCellSize + battlCellSize
            >= Player.battlegroundPosition.x)
          && !Player.battleground[y][x].block
          && !Player.battleground[y][x - 1].block) {
              Player.battleground[y][x].ship = true;
              Player.battleground[y][x - 1].ship = true;
              Player.battlegroundShips.ships2 += 1;
            }
            if (mouse.takeObjectHorizontal
          && mouse.takeObject.size === 3
          && (Player.battleground[y][x].cX - mouse.takeObject.size * battlCellSize + battlCellSize
            >= Player.battlegroundPosition.x)
          && !Player.battleground[y][x].block
          && !Player.battleground[y][x - 1].block
          && !Player.battleground[y][x - 2].block) {
              Player.battleground[y][x].ship = true;
              Player.battleground[y][x - 1].ship = true;
              Player.battleground[y][x - 2].ship = true;
              Player.battlegroundShips.ships3 += 1;
            }
            if (mouse.takeObjectHorizontal
          && mouse.takeObject.size === 4
          && (Player.battleground[y][x].cX - mouse.takeObject.size * battlCellSize + battlCellSize
            >= Player.battlegroundPosition.x)
          && !Player.battleground[y][x].block
          && !Player.battleground[y][x - 1].block
          && !Player.battleground[y][x - 2].block
          && !Player.battleground[y][x - 3].block) {
              Player.battleground[y][x].ship = true;
              Player.battleground[y][x - 1].ship = true;
              Player.battleground[y][x - 2].ship = true;
              Player.battleground[y][x - 3].ship = true;
              Player.battlegroundShips.ships4 += 1;
            }
            if (!mouse.takeObjectHorizontal
          && mouse.takeObject.size === 1
          && (Player.battleground[y][x].cY - mouse.takeObject.size * battlCellSize + battlCellSize
            >= Player.battlegroundPosition.y)
          && !Player.battleground[y][x].block) {
              Player.battleground[y][x].ship = true;
              Player.battlegroundShips.ships1 += 1;
            }
            if (!mouse.takeObjectHorizontal
          && mouse.takeObject.size === 2
          && (Player.battleground[y][x].cY - mouse.takeObject.size * battlCellSize + battlCellSize
            >= Player.battlegroundPosition.y)
          && !Player.battleground[y][x].block
          && !Player.battleground[y - 1][x].block) {
              Player.battleground[y][x].ship = true;
              Player.battleground[y - 1][x].ship = true;
              Player.battlegroundShips.ships2 += 1;
            }
            if (!mouse.takeObjectHorizontal
          && mouse.takeObject.size === 3
          && (Player.battleground[y][x].cY - mouse.takeObject.size * battlCellSize + battlCellSize
            >= Player.battlegroundPosition.y)
          && !Player.battleground[y][x].block
          && !Player.battleground[y - 1][x].block
          && !Player.battleground[y - 2][x].block) {
              Player.battleground[y][x].ship = true;
              Player.battleground[y - 1][x].ship = true;
              Player.battleground[y - 2][x].ship = true;
              Player.battlegroundShips.ships3 += 1;
            }
            if (!mouse.takeObjectHorizontal
          && mouse.takeObject.size === 4
          && (Player.battleground[y][x].cY - mouse.takeObject.size * battlCellSize + battlCellSize
            >= Player.battlegroundPosition.y)
          && !Player.battleground[y][x].block
          && !Player.battleground[y - 1][x].block
          && !Player.battleground[y - 2][x].block
          && !Player.battleground[y - 3][x].block) {
              Player.battleground[y][x].ship = true;
              Player.battleground[y - 1][x].ship = true;
              Player.battleground[y - 2][x].ship = true;
              Player.battleground[y - 3][x].ship = true;
              Player.battlegroundShips.ships4 += 1;
            }
          }
        }
      }
    }
  }

  function checkShips(Player) {
    Player.shipDock.ships1.numberOf = ships.ships1 - Player.battlegroundShips.ships1;
    Player.shipDock.ships2.numberOf = ships.ships2 - Player.battlegroundShips.ships2;
    Player.shipDock.ships3.numberOf = ships.ships3 - Player.battlegroundShips.ships3;
    Player.shipDock.ships4.numberOf = ships.ships4 - Player.battlegroundShips.ships4;
  }

  function createBlockCellOnPreparation(Player) {
    for (let y = 0; y < battlCell; y++) {
      for (let x = 0; x < battlCell; x++) {
        if (Player.battleground[y][x].ship) { continue; }
        if (Player.battleground?.[y]?.[x - 1]?.ship
        || (Player.battleground?.[y - 1]?.[x - 1]?.ship)
        || (Player.battleground?.[y - 1]?.[x]?.ship)
        || (Player.battleground?.[y - 1]?.[x + 1]?.ship)
        || (Player.battleground?.[y]?.[x + 1]?.ship)
        || (Player.battleground?.[y + 1]?.[x + 1]?.ship)
        || (Player.battleground?.[y + 1]?.[x]?.ship)
        || (Player.battleground?.[y + 1]?.[x - 1]?.ship)
        ) {
          Player.battleground[y][x].block = true;
        } else { Player.battleground[y][x].block = false; }
      }
    }
  }

  function strike(activePlayer, activeBattleground) {
    if (mouse.left && !mouse.pLeft
          && Player1.allShipsOnBattleground
          && Player2.allShipsOnBattleground
          && !activePlayer.allShipsDead
    ) {
      for (let y = 0; y < battlCell; y++) {
        for (let x = 0; x < battlCell; x++) {
          if ((activeBattleground.battleground[y][x].cX <= mouse.x)
          && (activeBattleground.battleground[y][x].cY <= mouse.y)
          && (activeBattleground.battleground[y][x].cX + battlCellSize >= mouse.x)
          && (activeBattleground.battleground[y][x].cY + battlCellSize >= mouse.y)
          && (!activeBattleground.battleground[y][x].strike)
          ) {
            activeBattleground.battleground[y][x].strike = true;
            if (activeBattleground.battleground[y][x].strike
              && !activeBattleground.battleground[y][x].ship) {
              if (activePlayer.name === 'Player 1') {
                Player2.activePlayer = true;
                Player1.activePlayer = false;
              }
              if (activePlayer.name === 'Player 2') {
                Player1.activePlayer = true;
                Player2.activePlayer = false;
              }
            }
          }
        }
      }
    }
  }

  function drawPreparationBattleground(Player) {
    for (let y = 0; y < battlCell; y++) {
      for (let x = 0; x < battlCell; x++) {
        const cX = x * (battlCellSize) + Player.battlegroundPosition.x;
        const cY = y * (battlCellSize) + Player.battlegroundPosition.y;
        Player.battleground[y][x].cX = cX;
        Player.battleground[y][x].cY = cY;

        if (Player.battleground[y][x].ship) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(6, 25, 247, 1)';
          ctx.lineWidth = `${allLineWidth}`;
          ctx.rect(cX, cY, battlCellSize, battlCellSize);
          ctx.stroke();
        }
        if (Player.battleground[y][x].block) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(6, 25, 247, 1)';
          ctx.arc(cX + battlCellSize / 2, cY + battlCellSize / 2, `${blockArcRadius}`, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.fillStyle = 'rgba(6, 25, 247, 1)';
    const letterX = Player.battlegroundPosition.x + battlCellSize / 4;
    const letterY = Player.battlegroundPosition.y - battlCellSize + battlCellSize / 2;
    const letterAlphabet = 'абвгдежзиклмнопрстуфхцчшщыэюя';
    const numberX = Player.battlegroundPosition.x - battlCellSize + battlCellSize / 4;
    const numberY = Player.battlegroundPosition.y - battlCellSize / 4;
    for (let i = 0; i < battlCell; i++) {
      ctx.fillText(letterAlphabet[i], letterX + battlCellSize * i, letterY);
    }
    for (let j = 1; j <= battlCell; j++) {
      let bigNamberX = numberX;
      if (j >= 10)(bigNamberX -= battlCellSize / 2);
      ctx.fillText(j, bigNamberX, numberY + battlCellSize * j);
    }
    ctx.beginPath();
    ctx.rect(Player.battlegroundPosition.x, Player.battlegroundPosition.y, battlSize, battlSize);
    ctx.strokeStyle = 'rgba(6, 25, 247, 1)';
    ctx.lineWidth = `${allLineWidth}`;
    ctx.stroke();
  }

  function drawBattleground(Player) {
    for (let y = 0; y < battlCell; y++) {
      for (let x = 0; x < battlCell; x++) {
        const cX = x * (battlCellSize) + Player.battlegroundPosition.x;
        const cY = y * (battlCellSize) + Player.battlegroundPosition.y;
        Player.battleground[y][x].cX = cX;
        Player.battleground[y][x].cY = cY;
        if (Player.battleground[y][x].strike) {
          if (Player.battleground[y][x].ship) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(6, 25, 247, 1)';
            ctx.lineWidth = `${allLineWidth}`;
            ctx.rect(cX, cY, battlCellSize, battlCellSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(cX, cY);
            ctx.lineTo(cX + battlCellSize, cY + battlCellSize);
            ctx.moveTo(cX + battlCellSize, cY);
            ctx.lineTo(cX, cY + battlCellSize);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.arc(cX + battlCellSize / 2, cY + battlCellSize / 2, `${strikeArcRadius}`, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        if (Player.battleground[y][x].block) {
          if ((Player.battleground?.[y - 1]?.[x - 1]?.ship
              && Player.battleground?.[y - 1]?.[x - 1]?.strike)
              || (Player.battleground?.[y - 1]?.[x + 1]?.ship
              && Player.battleground?.[y - 1]?.[x + 1]?.strike)
              || (Player.battleground?.[y + 1]?.[x + 1]?.ship
              && Player.battleground?.[y + 1]?.[x + 1]?.strike)
              || (Player.battleground?.[y + 1]?.[x - 1]?.ship
              && Player.battleground?.[y + 1]?.[x - 1]?.strike)

              || (Player.battleground?.[y]?.[x - 1]?.ship
              && Player.battleground?.[y]?.[x - 1]?.strike
              && Player.battleground?.[y]?.[x - 2]?.block
              && Player.battleground?.[y - 1]?.[x - 1]?.block
              && Player.battleground?.[y + 1]?.[x - 1]?.block)

              || (Player.battleground?.[y]?.[x - 1]?.ship
              && Player.battleground?.[y]?.[x - 1]?.strike
              && Player.battleground?.[y]?.[x - 2]?.ship
              && Player.battleground?.[y]?.[x - 2]?.strike
              && Player.battleground?.[y]?.[x - 3]?.block)

              || (Player.battleground?.[y]?.[x - 1]?.ship
              && Player.battleground?.[y]?.[x - 1]?.strike
              && Player.battleground?.[y]?.[x - 2]?.ship
              && Player.battleground?.[y]?.[x - 2]?.strike
              && Player.battleground?.[y]?.[x - 3]?.ship
              && Player.battleground?.[y]?.[x - 3]?.strike
              && Player.battleground?.[y]?.[x - 4]?.block)

              || (Player.battleground?.[y]?.[x - 1]?.ship
              && Player.battleground?.[y]?.[x - 1]?.strike
              && Player.battleground?.[y]?.[x - 2]?.ship
              && Player.battleground?.[y]?.[x - 2]?.strike
              && Player.battleground?.[y]?.[x - 3]?.ship
              && Player.battleground?.[y]?.[x - 3]?.strike
              && Player.battleground?.[y]?.[x - 4]?.ship
              && Player.battleground?.[y]?.[x - 4]?.strike)

              || (Player.battleground?.[y]?.[x + 1]?.ship
              && Player.battleground?.[y]?.[x + 1]?.strike
              && Player.battleground?.[y]?.[x + 2]?.block
              && Player.battleground?.[y - 1]?.[x + 1]?.block
              && Player.battleground?.[y + 1]?.[x + 1]?.block)

              || (Player.battleground?.[y]?.[x + 1]?.ship
              && Player.battleground?.[y]?.[x + 1]?.strike
              && Player.battleground?.[y]?.[x + 2]?.ship
              && Player.battleground?.[y]?.[x + 2]?.strike
              && Player.battleground?.[y]?.[x + 3]?.block)

              || (Player.battleground?.[y]?.[x + 1]?.ship
              && Player.battleground?.[y]?.[x + 1]?.strike
              && Player.battleground?.[y]?.[x + 2]?.ship
              && Player.battleground?.[y]?.[x + 2]?.strike
              && Player.battleground?.[y]?.[x + 3]?.ship
              && Player.battleground?.[y]?.[x + 3]?.strike
              && Player.battleground?.[y]?.[x + 4]?.block)

              || (Player.battleground?.[y]?.[x + 1]?.ship
              && Player.battleground?.[y]?.[x + 1]?.strike
              && Player.battleground?.[y]?.[x + 2]?.ship
              && Player.battleground?.[y]?.[x + 2]?.strike
              && Player.battleground?.[y]?.[x + 3]?.ship
              && Player.battleground?.[y]?.[x + 3]?.strike
              && Player.battleground?.[y]?.[x + 4]?.ship
              && Player.battleground?.[y]?.[x + 4]?.strike)

              || (Player.battleground?.[y - 1]?.[x]?.ship
              && Player.battleground?.[y - 1]?.[x]?.strike
              && Player.battleground?.[y - 2]?.[x]?.block
              && Player.battleground?.[y - 1]?.[x - 1]?.block
              && Player.battleground?.[y - 1]?.[x + 1]?.block)

              || (Player.battleground?.[y - 1]?.[x]?.ship
              && Player.battleground?.[y - 1]?.[x]?.strike
              && Player.battleground?.[y - 2]?.[x]?.ship
              && Player.battleground?.[y - 2]?.[x]?.strike
              && Player.battleground?.[y - 3]?.[x]?.block)

              || (Player.battleground?.[y - 1]?.[x]?.ship
              && Player.battleground?.[y - 1]?.[x]?.strike
              && Player.battleground?.[y - 2]?.[x]?.ship
              && Player.battleground?.[y - 2]?.[x]?.strike
              && Player.battleground?.[y - 3]?.[x]?.ship
              && Player.battleground?.[y - 3]?.[x]?.strike
              && Player.battleground?.[y - 4]?.[x]?.block)

              || (Player.battleground?.[y - 1]?.[x]?.ship
              && Player.battleground?.[y - 1]?.[x]?.strike
              && Player.battleground?.[y - 2]?.[x]?.ship
              && Player.battleground?.[y - 2]?.[x]?.strike
              && Player.battleground?.[y - 3]?.[x]?.ship
              && Player.battleground?.[y - 3]?.[x]?.strike
              && Player.battleground?.[y - 4]?.[x]?.ship
              && Player.battleground?.[y - 4]?.[x]?.strike)

              || (Player.battleground?.[y + 1]?.[x]?.ship
              && Player.battleground?.[y + 1]?.[x]?.strike
              && Player.battleground?.[y + 2]?.[x]?.block
              && Player.battleground?.[y + 1]?.[x - 1]?.block
              && Player.battleground?.[y + 1]?.[x + 1]?.block)

              || (Player.battleground?.[y + 1]?.[x]?.ship
              && Player.battleground?.[y + 1]?.[x]?.strike
              && Player.battleground?.[y + 2]?.[x]?.ship
              && Player.battleground?.[y + 2]?.[x]?.strike
              && Player.battleground?.[y + 3]?.[x]?.block)

              || (Player.battleground?.[y + 1]?.[x]?.ship
              && Player.battleground?.[y + 1]?.[x]?.strike
              && Player.battleground?.[y + 2]?.[x]?.ship
              && Player.battleground?.[y + 2]?.[x]?.strike
              && Player.battleground?.[y + 3]?.[x]?.ship
              && Player.battleground?.[y + 3]?.[x]?.strike
              && Player.battleground?.[y + 4]?.[x]?.block)

              || (Player.battleground?.[y + 1]?.[x]?.ship
              && Player.battleground?.[y + 1]?.[x]?.strike
              && Player.battleground?.[y + 2]?.[x]?.ship
              && Player.battleground?.[y + 2]?.[x]?.strike
              && Player.battleground?.[y + 3]?.[x]?.ship
              && Player.battleground?.[y + 3]?.[x]?.strike
              && Player.battleground?.[y + 4]?.[x]?.ship
              && Player.battleground?.[y + 4]?.[x]?.strike)

          ) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(6, 25, 247, 1)';
            ctx.arc(cX + battlCellSize / 2, cY + battlCellSize / 2, `${blockArcRadius}`, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    ctx.fillStyle = 'rgba(6, 25, 247, 1)';
    const letterX = Player.battlegroundPosition.x + battlCellSize / 4;
    const letterY = Player.battlegroundPosition.y - battlCellSize + battlCellSize / 2;
    const letterAlphabet = 'абвгдежзиклмнопрстуфхцчшщыэюя';
    const numberX = Player.battlegroundPosition.x - battlCellSize + battlCellSize / 4;
    const numberY = Player.battlegroundPosition.y - battlCellSize / 4;
    for (let i = 0; i < battlCell; i++) {
      ctx.fillText(letterAlphabet[i], letterX + battlCellSize * i, letterY);
    }
    for (let j = 1; j <= battlCell; j++) {
      let bigNamberX = numberX;
      if (j >= 10)(bigNamberX -= battlCellSize / 2);
      ctx.fillText(j, bigNamberX, numberY + battlCellSize * j);
    }
    ctx.beginPath();
    ctx.rect(Player.battlegroundPosition.x, Player.battlegroundPosition.y, battlSize, battlSize);
    ctx.strokeStyle = 'rgba(6, 25, 247, 1)';
    ctx.lineWidth = `${allLineWidth}`;
    ctx.stroke();
  }

  function drawShipDock(Player) {
    ctx.strokeStyle = 'rgba(6, 25, 247, 1)';
    ctx.lineWidth = `${allLineWidth}`;
    ctx.beginPath();
    const ships1X = Player.shipDockPosition.x + battlCellSize * 5;
    const ships1Y = Player.shipDockPosition.y + battlCellSize;
    const ships2X = Player.shipDockPosition.x + battlCellSize * 4;
    const ships2Y = Player.shipDockPosition.y + battlCellSize * 3;
    const ships3X = Player.shipDockPosition.x + battlCellSize * 3;
    const ships3Y = Player.shipDockPosition.y + battlCellSize * 5;
    const ships4X = Player.shipDockPosition.x + battlCellSize * 2;
    const ships4Y = Player.shipDockPosition.y + battlCellSize * 7;
    Player.shipDock.ships1.position.sX = ships1X;
    Player.shipDock.ships1.position.sY = ships1Y;
    Player.shipDock.ships2.position.sX = ships2X;
    Player.shipDock.ships2.position.sY = ships2Y;
    Player.shipDock.ships3.position.sX = ships3X;
    Player.shipDock.ships3.position.sY = ships3Y;
    Player.shipDock.ships4.position.sX = ships4X;
    Player.shipDock.ships4.position.sY = ships4Y;

    ctx.beginPath();
    ctx.rect(ships1X, ships1Y, battlCellSize, battlCellSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(ships2X, ships2Y, battlCellSize, battlCellSize);
    ctx.rect(ships2X, ships2Y, battlCellSize * 2, battlCellSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(ships3X, ships3Y, battlCellSize, battlCellSize);
    ctx.rect(ships3X, ships3Y, battlCellSize * 2, battlCellSize);
    ctx.rect(ships3X, ships3Y, battlCellSize * 3, battlCellSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(ships4X, ships4Y, battlCellSize, battlCellSize);
    ctx.rect(ships4X, ships4Y, battlCellSize * 2, battlCellSize);
    ctx.rect(ships4X, ships4Y, battlCellSize * 3, battlCellSize);
    ctx.rect(ships4X, ships4Y, battlCellSize * 4, battlCellSize);
    ctx.stroke();

    ctx.fillStyle = 'rgba(6, 25, 247, 1)';
    ctx.fillText(
      ` - ${Player.shipDock.ships1.numberOf} шт.`,
      Player.shipDockPosition.x + battlCellSize * 6.9,
      Player.shipDockPosition.y + battlCellSize * 1.8,
    );
    ctx.fillText(
      ` - ${Player.shipDock.ships2.numberOf} шт.`,
      Player.shipDockPosition.x + battlCellSize * 6.9,
      Player.shipDockPosition.y + battlCellSize * 3.8,
    );
    ctx.fillText(
      ` - ${Player.shipDock.ships3.numberOf} шт.`,
      Player.shipDockPosition.x + battlCellSize * 6.9,
      Player.shipDockPosition.y + battlCellSize * 5.8,
    );
    ctx.fillText(
      ` - ${Player.shipDock.ships4.numberOf} шт.`,
      Player.shipDockPosition.x + battlCellSize * 6.9,
      Player.shipDockPosition.y + battlCellSize * 7.8,
    );
  }

  function completePreparation(Player) {
    const { shipDock } = Player;
    if (!shipDock.ships1.numberOf
      && !shipDock.ships2.numberOf
      && !shipDock.ships3.numberOf
      && !shipDock.ships4.numberOf) {
      Player.allShipsOnBattleground = true;
    }
  }

  function completeBattle(Player) {
    let allShips = 0;
    let deadShips = 0;
    for (let y = 0; y < battlCell; y++) {
      for (let x = 0; x < battlCell; x++) {
        if (Player.battleground[y][x].ship
        ) {
          allShips += 1;
          if (Player.battleground[y][x].strike
          ) {
            deadShips += 1;
          }
        }
      }
    }
    if (deadShips === allShips
    ) { Player.allShipsDead = true; }
  }

  function gameMaster() {
    if ((!Player1.allShipsOnBattleground || !Player2.allShipsOnBattleground)
      && settings.settingsDone) {
      const player = !Player1.allShipsOnBattleground ? Player1 : Player2;
      takeObj(player);
      dropObj(player);
      checkShips(player);
      createBlockCellOnPreparation(player);
      completePreparation(player);
      mousePreviouslyClick();
      clearCanvas();
      drawPreparationBattleground(player);
      drawShipDock(player);
      dragObj();
    }

    if (Player1.allShipsOnBattleground
        && Player2.allShipsOnBattleground
        && !Player1.allShipsDead
        && !Player2.allShipsDead
        && (Player1.activePlayer || Player2.activePlayer)
    ) {
      const activePlayer = Player1.activePlayer ? Player1 : Player2;
      const activeBattleground = Player1.activePlayer ? Player2 : Player1;

      strike(activePlayer, activeBattleground);
      completeBattle(activeBattleground);
      clearCanvas();
      drawBattleground(Player1);
      drawBattleground(Player2);
    }

    if (Player1.allShipsOnBattleground
    && Player2.allShipsOnBattleground
    && (Player1.allShipsDead || Player2.allShipsDead)) {
      const text = Player1.allShipsDead ? 'Второй игрок Победил!' : 'Первый игрок Победил!';
      clearCanvas();
      fontSize = `${settings.battlCellSize * 3}px`;
      ctx.font = `${fontSize} 'Caveat'`;
      ctx.fillStyle = 'rgba(6, 25, 247, 1)';
      ctx.textAlign = 'center';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(gameMaster);
  }

  gameMaster();
}
