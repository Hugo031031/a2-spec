function buildScene() {
  coralParticles = [];
  stringParticles = [];
  
  // Calculate scaling and centering
  let imgScale = min((windowWidth * 0.7) / heartImg.width, (windowHeight * 0.7) / heartImg.height);
  heartImg.resize(heartImg.width * imgScale, heartImg.height * imgScale);
  heartImg.loadPixels();

  let offsetX = (windowWidth - heartImg.width) / 2;
  let offsetY = (windowHeight - heartImg.height) / 2;
  let center = { x: windowWidth / 2, y: windowHeight / 2 };

  // 1. Build Heart First (so we have the data ready)
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
  let thickness = 5; // Increased slightly for better look
  
  for (let i = 0; i < numBundles; i++) {
    // Determine starting side
    let startX, startY;
    let edge = floor(random(4));
    if (edge === 0) { startX = random(width); startY = -50; }
    else if (edge === 1) { startX = random(width); startY = height + 50; }
    else if (edge === 2) { startX = -50; startY = random(height); }
    else { startX = width + 50; startY = random(height); }

    // Random control points for organic curves
    let cp1x = random(width);
    let cp1y = random(height);
    let cp2x = random(width);
    let cp2y = random(height);

    let steps = 120; // More steps for smoother strings
    for (let j = 0; j < steps; j++) {
      let t = j / steps;
      // Use Bezier to move from edge toward the center
      let bx = bezierPoint(startX, cp1x, cp2x, center.x, t);
      let by = bezierPoint(startY, cp1y, cp2y, center.y, t);

      for (let k = 0; k < thickness; k++) {
        let offX = random(-8, 8); 
        let offY = random(-8, 8);
        let finalX = bx + offX;
        let finalY = by + offY;

        // CRITICAL CHECK: Only add the particle if it is NOT inside the heart
        // We also check a tiny bit of "padding" (2px) for a cleaner edge
        if (!isInsideHeart(finalX, finalY, offsetX, offsetY)) {
          let noiseVal = noise(finalX * 0.01, finalY * 0.01);
          stringParticles.push(new AsciiParticle(finalX, finalY, noiseVal, false));
        }
      }
    }
  }
}
