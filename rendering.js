let angle = 0;
let myTitle;
let img;
let spaceBackground;

let LightCont = [255, 255, 204, 350, 0, 500];

function preload() {
  img = loadImage("imgs/planetTexture.png");
  spaceBackground = loadImage("imgs/StarSkyBG.png");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);

  cnv.style("display", "block");
  cnv.parent("bannerDiv");

  myTitle = createP("Portfolio");

 myTitle.position(width * 0.05, height * 0.2);
 myTitle.style("font-size", `${min(width, height) * 0.15}px`);

  myTitle.style("color", "white");
// myTitle.style("font-size", `${min(width, height) * 0.18}px`);
}

function draw() {
  clear();
//Background
push();

drawingContext.disable(drawingContext.DEPTH_TEST);

resetMatrix();

let imgAspect = spaceBackground.width / spaceBackground.height;
let canvasAspect = width / height;

let drawW, drawH;

// COVER logic (not contain)
if (canvasAspect > imgAspect) {
  drawW = width;
  drawH = width / imgAspect;
} else {
  drawH = height;
  drawW = height * imgAspect;
}

translate(-width / 2, -height / 2);

image(spaceBackground, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);

drawingContext.enable(drawingContext.DEPTH_TEST);

pop();
//Planet
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

  // SHADOW
  push();

  let lightAngle = atan2(LightCont[4], LightCont[3]);

  let shadowCenter = lightAngle + PI;
  let shadowWidth = PI * 0.45;

  translate(planetOffset, 0, -200);

  rotate(-QUARTER_PI / 3);
  rotateX(HALF_PI - 0.2);

  noStroke();
  fill(35, 35, 0, 120);

  flatRing(
    planetRadius * 0.9,
    planetRadius * 1.6,
    shadowCenter - shadowWidth / 2,
    shadowCenter + shadowWidth / 2
  );

  pop();

  // =========================
  // RING
  // =========================
  push();

  translate(planetOffset, 0, -200);

  pointLight(255, 255, 204, 430, -130, -80);

  rotate(-QUARTER_PI / 3);
  rotateX(HALF_PI - 0.2);

  fill(205, 193, 159);
  noStroke();

  flatRing(
    planetRadius * 1.1,
    planetRadius * 1.6,
    0,
    TWO_PI
  );

  pop();
}

function flatRing(
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  detail = 100
) {
  beginShape(TRIANGLE_STRIP);

  for (let i = 0; i <= detail; i++) {
    let angle = map(i, 0, detail, startAngle, endAngle);

    let x1 = cos(angle) * innerRadius;
    let y1 = sin(angle) * innerRadius;

    let x2 = cos(angle) * outerRadius;
    let y2 = sin(angle) * outerRadius;

    vertex(x1, y1, 0);
    vertex(x2, y2, 0);
  }

  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  myTitle.position(width * 0.05, height * 0.2);

  myTitle.style("font-size", `${min(width, height) * 0.15}px`);
}