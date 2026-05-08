let angle = 0;
let img;
let spaceBackground;
let LightCont = [255, 255, 204, 350, 0, 500]; // Light color (R, G, B) and position (X, Y, Z)
let lightAngle = atan2(LightCont[4], LightCont[3]);

function preload() {
  img = loadImage("imgs/planetTexture.png");
  spaceBackground = loadImage("imgs/StarSkyBG.png");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.style("display", "block");
}

function draw() {
  //BG
  push();

  noStroke();
  texture(spaceBackground);
  translate(0, 0, -500);
  plane(2000, 2000);
  pop();
  //planet
  push();
  ambientLight(10);
  translate(200, 0, -200);
  stroke(255, 0, 0);
  noStroke();
  rotate(-QUARTER_PI / 3);
  rotateX(-0.2);
  rotateY(angle);
  pointLight(...LightCont);
  texture(img);
  angle += 0.001;
  sphere(200);
  pop();
  // SHADOW
  push();

  // translate(200, 0, -195);
let lightAngle = atan2(LightCont[4], LightCont[3]);
let shadowOffset = 10;

translate(
  200 + cos(lightAngle + PI) * shadowOffset,
  0 + sin(lightAngle + PI) * shadowOffset,
  -200
);

  rotate(-QUARTER_PI / 3);
  rotateX(HALF_PI - 0.2001);

  noStroke();
  fill(35, 35, 0, 120);

  // Light direction
  

  let shadowCenter = lightAngle + PI;

  // shadow size
  let shadowWidth = PI * 0.45;

  flatRing(
    180,
    320,
    shadowCenter - shadowWidth / 2,
    shadowCenter + shadowWidth / 2,
  );
  pop();
  //ring
  push();
  // ambientLight(250);
  translate(200, 0, -200);
  pointLight(255, 255, 204, 430, -130, -80); //x,y (- = up?),z

  rotate(-QUARTER_PI / 3);
  rotateX(HALF_PI - 0.2);

  fill(205, 193, 159);
  noStroke();

  flatRing(220, 320, 0, TWO_PI);

  pop();
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
  // Resize canvas when window changes
  resizeCanvas(windowWidth, windowHeight);
}
