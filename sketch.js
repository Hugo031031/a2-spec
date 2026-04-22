    let heartImg;
    let coralParticles = [];

    // Original soft ocean colors
    let healthyColors = [
        "#1a0f7a", // deep indigo
        "#2a3cff", // strong blue
        "#00a6ff", // cyan-blue
        "#00d4a3", // aqua green
        "#7d5cff", // violet
        "#ff4fd8", // pink
        "#ff7a00", // orange
        "#ffd400"  // yellow
    ];

    // Character set
    let charPalette = [
        "c", "o", "r", "a", "l", 
        "1", "2", "3", "4", "5", "6", "7", "8", "9", 
        "s", "u", "n"
    ];

    let cellSize = 5; // Fine detail

    function preload() {
    heartImg = loadImage('heart.png'); 
    }

    function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont('monospace');
    textAlign(CENTER, CENTER);
    noStroke();
    
    buildHeart();
    }

    function buildHeart() {
    // Scale heart to fit screen
    let imgScale = min((windowWidth * 0.85) / heartImg.width, (windowHeight * 0.85) / heartImg.height);
    heartImg.resize(heartImg.width * imgScale, heartImg.height * imgScale);
    heartImg.loadPixels();

    let offsetX = (windowWidth - heartImg.width) / 2;
    let offsetY = (windowHeight - heartImg.height) / 2;

    for (let y = 0; y < heartImg.height; y += cellSize) {
        for (let x = 0; x < heartImg.width; x += cellSize) {
        
        let index = (Math.floor(x) + Math.floor(y) * heartImg.width) * 4;
        let brightness = (heartImg.pixels[index] + heartImg.pixels[index+1] + heartImg.pixels[index+2]) / 3;

        // Detect heart silhouette
        if (brightness < 160 && heartImg.pixels[index+3] > 50) {
            
            let noiseVal = noise(x * 0.012, y * 0.012);
            
            // Spawn particles in noise bands for organic look
            if (noiseVal > 0.25 && noiseVal < 0.75) {
            coralParticles.push(new AsciiParticle(offsetX + x, offsetY + y, noiseVal));
            }
        }
        }
    }
    }

    class AsciiParticle {
    constructor(x, y, noiseValue) {
        this.colorSpeed = random(0.0005, 0.002);
        this.baseX = x;
        this.baseY = y;
        this.noiseValue = noiseValue; 
        this.myChar = charPalette[Math.floor(Math.random() * charPalette.length)];
        this.fontSize = cellSize * 1.4; 
        this.jitterX = random(-2, 2);
        this.jitterY = random(-2, 2);
    }

    display() {
        
        // Constant visibility (No slithering logic)
        // Alpha is set to a soft, consistent level across the whole heart
        let alpha = 200; 

        // Gentle underwater swaying (Sin/Cos logic restored)
        
        let xMove = sin(frameCount * 0.03 + this.baseY * 0.01) * 2;
        let yMove = cos(frameCount * 0.03 + this.baseX * 0.01) * 2;

        // Pick color from the palette based on noise position
        let shift = frameCount * 0.008;
        let colorIndex = Math.floor((this.noiseValue + shift) * healthyColors.length);
        let activeColor = color(healthyColors[colorIndex % healthyColors.length]);
        activeColor.setAlpha(alpha);

        fill(activeColor);
        textSize(this.fontSize);
        
        text(this.myChar, this.baseX + this.jitterX + xMove, this.baseY + this.jitterY + yMove);
    }
    }

    function draw() {
    background("#f4f5f0"); // Soft light background restored

    // Draw all particles at once
    coralParticles.forEach(p => p.display());
    }

    function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    coralParticles = [];
    buildHeart();
    }