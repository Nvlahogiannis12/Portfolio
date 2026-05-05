let angle = 0;
let img;
let spaceBackground;
let LightCont = [255, 255, 204, 1000, 50, 1000];
// Click and drag the mouse to view the scene from different angles.

function preload() {
  img = loadImage("imgs/planetTexture.png");
  spaceBackground = loadImage("imgs/StarSkyBG.png");
}

function setup() {
  createCanvas(1000, 1000, WEBGL);
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
  stroke(255, 0, 0);
  noStroke();
  rotate(-QUARTER_PI / 3);
  rotateX(-0.2);
  rotateY(angle);
  pointLight(...LightCont);
  texture(img);
  angle += 0.005;
  sphere(100);
  pop();

  //ring
  push();
  // Create a 3D ring
  rotate(-QUARTER_PI / 3);
  rotateX(HALF_PI - 0.2);
  fill(205, 193, 159);
  noStroke();
  pointLight(...LightCont);
  torus(150, 10); // (Radius of ring, Radius of tube)
  pop();
}
