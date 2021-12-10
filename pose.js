var video;
var poseNet;
var poses = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    window.results = results;
    poses = results;
    post('/api/pose', results);
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function post(url, data, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('POST', url)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.send(JSON.stringify(data))
  xhr.onload = function() {
    if (callback) callback(JSON.parse(xhr.responseText))
  }
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // contains an array of the discovered poses, labelled by part
  //console.log(poses);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (var i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    var pose = poses[i].pose;
    for (var j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      var keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (var i = 0; i < poses.length; i++) {
    var skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (var j = 0; j < skeleton.length; j++) {
      var partA = skeleton[j][0];
      var partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}