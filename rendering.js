let angle = 0;
let myTitle;
let mySubtitle;
let img;
let spaceBackground;
let meteorLayer;
let meteors = [];
let pX, pY, pZ, pAvoid;

let LightCont = [255, 255, 204, 350, 0, 500];

function preload() {
  img = loadImage("imgs/planetTexture.png");
  spaceBackground = loadImage("imgs/StarSkyBG.png");
}

function setup() {
  // 1. Create the canvas
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  updatePlanetStats();

  for (let i = 0; i < 15; i++) {
    meteors.push(new Meteor());
  }

  let container = select("#bannerDiv");
  if (container) {
    cnv.parent("bannerDiv");
  } else {
    console.warn(
      "Element #bannerDiv not found. Canvas attached to body instead.",
    );
  }

  cnv.style("display", "block");

  // 3. Initialize Meteor Layer
  meteorLayer = createGraphics(windowWidth, windowHeight, WEBGL);

  for (let i = 0; i < 15; i++) {
    meteors.push(new Meteor());
  }

  // 4. UI Elements
  myTitle = createP("Portfolio");
  mySubtitle = createP("Nick Vlahogiannis");

  myTitle.position(width * 0.05, height * 0.2);
  myTitle.style("font-size", `${min(width, height) * 0.15}px`);
  myTitle.style("color", "white");

  mySubtitle.position(width * 0.08, height * 0.35);
  mySubtitle.style("font-size", `${min(width, height) * 0.08}px`);
  mySubtitle.style("color", "white");
}

function draw() {
  clear();

  // --- BACKGROUND ---
  push();
  drawingContext.disable(drawingContext.DEPTH_TEST);
  resetMatrix();
  let imgAspect = spaceBackground.width / spaceBackground.height;
  let canvasAspect = width / height;
  let drawW, drawH;
  if (canvasAspect > imgAspect) {
    drawW = width;
    drawH = width / imgAspect;
  } else {
    drawH = height;
    drawW = height * imgAspect;
  }
  translate(-width / 2, -height / 2);
  image(
    spaceBackground,
    (width - drawW) / 2,
    (height - drawH) / 2,
    drawW,
    drawH,
  );
  drawingContext.enable(drawingContext.DEPTH_TEST);
  pop();

  // --- PLANET & RINGS ---
  push();
  ambientLight(10);
  let planetOffset = min(width, height) * 0.25;
  let planetRadius = min(width, height) * 0.18;
  translate(planetOffset, 0, -200);
  rotate(-QUARTER_PI / 3);
  rotateX(-0.2);
  rotateY(angle);
  pointLight(...LightCont);
  noStroke();
  texture(img);
  sphere(planetRadius);
  angle += 0.001;
  pop();

  // (Shadow and Ring logic remains the same as your previous version)
  drawShadowAndRing(planetOffset, planetRadius);

  // --- METEOR LAYER ---
  if (meteorLayer) {
    meteorLayer.clear();
    meteorLayer.push();
    meteorLayer.ambientLight(100);
    meteorLayer.pointLight(255, 255, 255, 0, 0, 500);
    for (let m of meteors) {
      m.update();
      m.display(meteorLayer);
    }
    meteorLayer.pop();

    push();
    resetMatrix();
    imageMode(CENTER);
    image(meteorLayer, 0, 0);
    pop();
  }
}

// Helper for cleanliness
function drawShadowAndRing(planetOffset, planetRadius) {
  push();
  let lightAngle = atan2(LightCont[4], LightCont[3]);
  translate(planetOffset, 0, -199);
  rotate(-QUARTER_PI / 3);
  rotateX(HALF_PI - 0.2);
  noStroke();
  fill(35, 35, 0, 120);
  flatRing(
    planetRadius * 0.9,
    planetRadius * 1.6,
    lightAngle + PI - (PI * 0.45) / 2,
    lightAngle + PI + (PI * 0.45) / 2,
  );
  pop();

  push();
  translate(planetOffset, 0, -200);
  pointLight(255, 255, 204, 430, -130, -80);
  rotate(-QUARTER_PI / 3);
  rotateX(HALF_PI - 0.2);
  fill(205, 193, 159);
  noStroke();
  flatRing(planetRadius * 1.1, planetRadius * 1.6, 0, TWO_PI);
  pop();
}

function mousePressed() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  for (let m of meteors) {
    if (m.isClicked(mx, my)) m.reset();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (meteorLayer) meteorLayer.resizeCanvas(windowWidth, windowHeight);

  if (myTitle) {
    myTitle.position(width * 0.05, height * 0.2);
    myTitle.style("font-size", `${min(width, height) * 0.15}px`);
  }
  updatePlanetStats();
}

function flatRing(
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  detail = 100,
) {
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i <= detail; i++) {
    let angle = map(i, 0, detail, startAngle, endAngle);
    vertex(cos(angle) * innerRadius, sin(angle) * innerRadius, 0);
    vertex(cos(angle) * outerRadius, sin(angle) * outerRadius, 0);
  }
  endShape();
}

class Meteor {
  constructor() {
    this.reset();
  }

  reset() {
    this.z = random(-3000, -5000);
    this.size = random(15, 35);
    this.speed = random(10, 25);
    this.rot = random(TWO_PI);

    // COLOR LOGIC
    let minColor = 200;
    let maxColor = 255;
    this.sharedRG =
      Math.floor(Math.random() * (maxColor - minColor + 1)) + minColor;
    this.blueVal = Math.floor(Math.random() * (250 - 200 + 1)) + 200;

    // --- NEW SPAWN PROTECTION ---
    // Keep picking a random X and Y until it is NOT in the planet lane
    let safetyCheck = 0;
    do {
      this.x = random(-width, width);
      this.y = random(-height, height);
      safetyCheck++;
      // dist() against pX and pY (the planet's center)
    } while (dist(this.x, this.y, pX, pY) < pAvoid && safetyCheck < 100);
  }

  update() {
    this.z += this.speed;

    // SAFETY CHECK: Only run collision if planet variables exist and are numbers
    if (typeof pX === "number" && typeof pAvoid === "number") {
      this.checkCollision();
    }

    if (this.z > 500) this.reset();
  }

  checkCollision() {
    let d = dist(this.x, this.y, pX, pY);
    let detectionRange = pAvoid * 1.5;

    // If it gets too close while flying toward the planet
    if (d < detectionRange && this.z < pZ) {
      // If it somehow manages to get INSIDE pAvoid, push it out instantly
      if (d < pAvoid) {
        let angle = atan2(this.y - pY, this.x - pX);
        this.x = pX + cos(angle) * (pAvoid + 5);
        this.y = pY + sin(angle) * (pAvoid + 5);
      } else {
        // Smooth steering force
        let force = map(d, pAvoid, detectionRange, 1.5, 0, true);
        this.x += (this.x - pX) * 0.05 * force;
        this.y += (this.y - pY) * 0.05 * force;
      }
    }
  }

  display(pg) {
    pg.push();
    pg.translate(this.x, this.y, this.z);
    pg.rotateX(this.rot + frameCount * 0.02);
    pg.fill(this.sharedRG, this.sharedRG, this.blueVal);
    pg.noStroke();
    pg.sphere(this.size);
    pg.pop();
  }

  isClicked(mx, my) {
    let perspective = 600 / abs(this.z);
    let d = dist(mx, my, this.x * perspective, this.y * perspective);
    return d < this.size * perspective * 2;
  }
}

function updatePlanetStats() {
  pX = min(width, height) * 0.25;
  pY = 0;
  pZ = -200;
  pAvoid = min(width, height) * 0.45;
}
