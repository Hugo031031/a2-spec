let heartImg;
let coralParticles = [];
let stringParticles = [];

let healthyColors = [
    "#1a0f7a", "#2a3cff", "#00a6ff", "#00d4a3", 
    "#7d5cff", "#ff4fd8", "#ff7a00", "#ffd400"
];

// Specific palette for strings
let bluePalette = ["#1a0f7a", "#2a3cff", "#00a6ff", "#0055ff", "#0022aa"];

let charPalette = ["c", "o", "r", "a", "l", "1", "2", "3", "s", "u", "n", "@", "#", "$", "%", "&", "*", "+", "=", "?", "!", "~"];
let cellSize = 10; 

function preload() {
  heartImg = loadImage('heart.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  noStroke();
  buildScene();
}

function isInsideHeart(screenX, screenY, offsetX, offsetY) {
  let imgX = Math.floor(screenX - offsetX);
  let imgY = Math.floor(screenY - offsetY);

  if (imgX >= 0 && imgX < heartImg.width && imgY >= 0 && imgY < heartImg.height) {
    let index = (imgX + imgY * heartImg.width) * 4;
    let r = heartImg.pixels[index];
    let g = heartImg.pixels[index+1];
    let b = heartImg.pixels[index+2];
    let a = heartImg.pixels[index+3];
    let brightness = (r + g + b) / 3;
    // Break only when truly inside the heart mass
    return (brightness < 130 && a > 100);
  }
  return false;
}

function buildScene() {
  coralParticles = [];
  stringParticles = [];
  
  let imgScale = min((windowWidth * 0.7) / heartImg.width, (windowHeight * 0.7) / heartImg.height);
  heartImg.resize(heartImg.width * imgScale, heartImg.height * imgScale);
  heartImg.loadPixels();

  let offsetX = (windowWidth - heartImg.width) / 2;
  let offsetY = (windowHeight - heartImg.height) / 2;
  let center = { x: windowWidth / 2, y: windowHeight / 2 };

  // 1. Build Heart
  for (let y = 0; y < heartImg.height; y += cellSize) {
    for (let x = 0; x < heartImg.width; x += cellSize) {
      let index = (Math.floor(x) + Math.floor(y) * heartImg.width) * 4;
      if (heartImg.pixels[index+3] > 50 && (heartImg.pixels[index] + heartImg.pixels[index+1] + heartImg.pixels[index+2])/3 < 160) {
        let noiseVal = noise(x * 0.01, y * 0.01);
        coralParticles.push(new AsciiParticle(offsetX + x, offsetY + y, noiseVal, true));
      }
    }
  }

  // 2. Build Blue Strings
  let numBundles = 14; 
  let thickness = 4; 
  
  for (let i = 0; i < numBundles; i++) {
    let startX, startY;
    let edge = floor(random(4));
    if (edge === 0) { startX = random(width); startY = -20; }
    else if (edge === 1) { startX = random(width); startY = height + 20; }
    else if (edge === 2) { startX = -20; startY = random(height); }
    else { startX = width + 20; startY = random(height); }

    let cp1x = random(width * 0.1, width * 0.9);
    let cp1y = random(height * 0.1, height * 0.9);
    let cp2x = random(width * 0.1, width * 0.9);
    let cp2y = random(height * 0.1, height * 0.9);

    let steps = 80; 
    for (let j = 0; j < steps; j++) {
      let t = j / steps;
      let bx = bezierPoint(startX, cp1x, cp2x, center.x, t);
      let by = bezierPoint(startY, cp1y, cp2y, center.y, t);

      if (isInsideHeart(bx, by, offsetX, offsetY)) break;

      for (let k = 0; k < thickness; k++) {
        let offX = random(-7, 7); 
        let offY = random(-7, 7);
        let noiseVal = noise((bx + offX) * 0.01, (by + offY) * 0.01);
        stringParticles.push(new AsciiParticle(bx + offX, by + offY, noiseVal, false));
      }
    }
  }
}

class AsciiParticle {
  constructor(x, y, noiseValue, isHeart) {
    this.x = x;
    this.y = y;
    this.noiseValue = noiseValue; 
    this.isHeart = isHeart;
    this.myChar = charPalette[Math.floor(random(charPalette.length))];
    this.fontSize = cellSize * 0.8; 
  }

  display() {
    let xMove = sin(frameCount * 0.03 + this.y * 0.01) * 1.5;
    let yMove = cos(frameCount * 0.03 + this.x * 0.01) * 1.5;

    let activeColor;
    if (this.isHeart) {
      // Animated Color Shifting for Heart
      let shift = frameCount * 0.008;
      let colorIndex = Math.floor((this.noiseValue + shift) * healthyColors.length);
      activeColor = color(healthyColors[colorIndex % healthyColors.length]);
      activeColor.setAlpha(255);
    } else {
      // Static Blue Colors for Strings
      let colorIndex = Math.floor(this.noiseValue * bluePalette.length);
      activeColor = color(bluePalette[colorIndex % bluePalette.length]);
      activeColor.setAlpha(180);
    }

    fill(activeColor);
    textSize(this.fontSize);
    text(this.myChar, this.x + xMove, this.y + yMove);
  }
}

function draw() {
  background("#f4f5f0"); 
  
  // Strings behind
  stringParticles.forEach(p => p.display());
  
  // Heart on top
  coralParticles.forEach(p => p.display());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildScene();
}