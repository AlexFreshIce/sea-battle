/* eslint-disable import/extensions */
import settings from './settings.js';

const canvas = document.querySelector('#canvas1');

export const mouse = {
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
  event.preventDefault();
  if (event.isPrimary) {
    mouse.x = Math.round((event.clientX - settings.canvasPosition.left)
  * (canvas.width / settings.canvasPosition.width) * 1000) / 1000;
    mouse.y = Math.round((event.clientY - settings.canvasPosition.y)
  * (canvas.height / settings.canvasPosition.height) * 1000) / 1000;
  }
}

function downHandler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    mouse.x = Math.round((event.clientX - settings.canvasPosition.left)
      * (canvas.width / settings.canvasPosition.width) * 1000) / 1000;
    mouse.y = Math.round((event.clientY - settings.canvasPosition.y)
      * (canvas.height / settings.canvasPosition.height) * 1000) / 1000;
    mouse.left = true;
  } else {
    mouse.right = true;
  }
}

function upHandler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    mouse.left = false;
  } else {
    mouse.right = false;
  }
}

function rightClickHandler(event) {
  event.preventDefault();
  mouse.takeObjectHorizontal = !mouse.takeObjectHorizontal;
}

export function mousePreviouslyClick() {
  mouse.pLeft = mouse.left;
  mouse.pRight = mouse.right;
}

canvas.addEventListener('pointermove', moveHandler);
canvas.addEventListener('pointerdown', downHandler);
canvas.addEventListener('pointerup', upHandler);
canvas.addEventListener('contextmenu', rightClickHandler);
