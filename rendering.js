// Click and drag the mouse to view the scene from different angles.

function setup() {
  createCanvas(1000, 1000, WEBGL);

  describe("A white sphere on a gray background.");
}
let r = 2;

function draw() {
  background(200);

  // Draw the sphere.
  //   rotateWithFrameCount();
  rotateZ(2 * r);
  rotateY(2 * r);
  r *= 2;
  sphere();
}

function rotateWithFrameCount() {
  rotateZ(frameCount);
  rotateY(frameCount);
}
