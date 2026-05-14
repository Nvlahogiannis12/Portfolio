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
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);

  // 1. Set the parent first so width/height are correct
  let container = select("#bannerDiv");
  if (container) {
    cnv.parent("bannerDiv");
  }

  // 2. Initialize planet stats BEFORE creating any meteors
  updatePlanetStats();

  cnv.style("display", "block");
  meteorLayer = createGraphics(windowWidth, windowHeight, WEBGL);

  // 3. Populate array ONCE (Removed the double loop)
  for (let i = 0; i < 15; i++) {
    meteors.push(new Meteor());
  }

  // 4. UI Elements
  myTitle = createP("Portfolio");
  myTitle.style("font-family", "space");
  mySubtitle = createP("Nick Vlahogiannis");
  myTitle.position(width * 0.05, height * 0.2);
  myTitle.style("font-size", `${min(width, height) * 0.1}px`);
  myTitle.style("color", "white");
  mySubtitle.position(width * 0.08, height * 0.35);
  mySubtitle.style("font-size", `${min(width, height) * 0.08}px`);
  mySubtitle.style("color", "white");
  mySubtitle.style("font-family", "space");
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
  // Use the global pX, pY, pZ set in updatePlanetStats
  translate(pX, pY, pZ);
  rotate(-QUARTER_PI / 3);
  rotateX(-0.2);
  rotateY(angle);
  pointLight(...LightCont);
  noStroke();
  texture(img);
  sphere(min(width, height) * 0.18);
  angle += 0.001;
  pop();

  drawShadowAndRing(pX, min(width, height) * 0.18);

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
    lightAngle + PI - 0.7,
    lightAngle + PI + 0.7,
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

class Meteor {
  constructor() {
    this.reset();
  }

  reset() {
    this.z = random(-3000, -5000);
    this.size = random(15, 35);
    this.speed = random(5, 10);
    this.rot = random(TWO_PI);

    // COLOR LOGIC: R and G match
    this.sharedRG = floor(random(200, 255));
    this.blueVal = floor(random(200, 250));

    // SPAWN LOGIC: Keep rerolling until outside the cylinder
    let safetyCheck = 0;
    let spawnBuffer = pAvoid * 1.1; // Spawn slightly further out than the shield

    do {
      this.x = random(-width * 1.5, width * 1.5);
      this.y = random(-height * 1.5, height * 1.5);
      safetyCheck++;
    } while (dist(this.x, this.y, pX, pY) < spawnBuffer && safetyCheck < 100);
  }

  update() {
    this.z += this.speed;
    if (typeof pX === "number") {
      this.checkCollision();
    }
    if (this.z > 500) this.reset();
  }

  checkCollision() {
    let d = dist(this.x, this.y, pX, pY);

    let detectionRange = pAvoid * 1.8;

    if (d < detectionRange) {
      let angle = atan2(this.y - pY, this.x - pX);

      if (d < pAvoid) {
        this.x = pX + cos(angle) * (pAvoid + 2);
        this.y = pY + sin(angle) * (pAvoid + 2);
      } else {
        let force = map(d, pAvoid, detectionRange, 4.0, 0, true);
        let steerX = cos(angle) * force;
        let steerY = sin(angle) * force;

        this.x += steerX;
        this.y += steerY;
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
    let perspective = 600 / (abs(this.z) + 1);
    let d = dist(mx, my, this.x * perspective, this.y * perspective);
    return d < this.size * perspective * 2;
  }
}

function updatePlanetStats() {
  pX = min(width, height) * 0.25;
  pY = 0;
  pZ = -200;
  // This is the "Pipe" radius. 0.4 ensures it covers rings + a safety gap.
  pAvoid = min(width, height) * 0.4;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updatePlanetStats();
  if (meteorLayer) meteorLayer.resizeCanvas(windowWidth, windowHeight);
}

function flatRing(iR, oR, sA, eA, det = 100) {
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i <= det; i++) {
    let a = map(i, 0, det, sA, eA);
    vertex(cos(a) * iR, sin(a) * iR, 0);
    vertex(cos(a) * oR, sin(a) * oR, 0);
  }
  endShape();
}

function mousePressed() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  for (let m of meteors) {
    if (m.isClicked(mx, my)) m.reset();
  }
}
