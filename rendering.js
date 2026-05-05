let angle = 0;
let img;
let LightCont = [255, 255, 204, 1000, 50, 1000];
// Click and drag the mouse to view the scene from different angles.

function preload() {
  img = loadImage("imgs/planetTexture.png");
}

function setup() {
  createCanvas(1000, 1000, WEBGL);
}

function draw() {
  //planet
  push();
  background(200);
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
  fill(255, 255, 0);
  noStroke();
  pointLight(...LightCont);
  torus(150, 10); // (Radius of ring, Radius of tube)
  pop();
}
