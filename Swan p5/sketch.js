let scoreboard = {}

let name=document.getElementById("names")
let score
let x
let y
let x2
let y2
let x3
let y3
let x4
let y4
let x5
let y5
let x6
let y6
let direction_x
let direction_y
let time
let range
let min 
let max
let level
let speed
let overalltime

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCds9GlDj520vKYLOYVaGw00pvWG30zIyo",
  authDomain: "swan-p5.firebaseapp.com",
  databaseURL: "https://swan-p5.firebaseio.com",
  projectId: "swan-p5",
  storageBucket: "swan-p5.appspot.com",
  messagingSenderId: "688391304710",
  appId: "1:688391304710:web:2e15c4abf2651eb6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database()

function setup() {
  createCanvas(windowWidth, windowHeight);
  s = width/734
  x = 270
  y = 180
  x2 = 180
  y2 = 180
  x3 = [640,640,640]
  y3 = [90,355,640]
  x4 = [90,90,90]
  y4 = [90,355,640]
  direction_x=1
  direction_y=1
  score = 0
  time = 5
  min = random(-10,-1)
  max = random(1,5)
  level = 0
  x5 = 500
  y5 = 640
  x6 = 220
  y6 = 640
  speed = 10
  overalltime=60
}

function draw() {
  if (touches.length == 0) {
      if (keyIsDown(LEFT_ARROW)){
      x = x - 10
      }
      if (keyIsDown(RIGHT_ARROW)){
      x = x + 10
      }
      if (keyIsDown(UP_ARROW)){
      y = y - 10
      }
      if (keyIsDown(DOWN_ARROW)){
      y = y + 10
      }
  }
	
  else {
	  x=touches[0].x
	  y=touches[0].y
  }
  
  if (overalltime > 0) {
  
  background(170);
  circle(x*s,y,70*s);
  fill(225);
  
  
  circle(x2*s,y2,70*s);
  fill(98);
  x2 = x2 + speed*direction_x
  y2 = y2 + 10*direction_y
  
  if (x2 > width || x2 <0) {
    direction_x = direction_x * -1
  }
  
  if (y2 > height || y2 < 0) {
    direction_y = direction_y * -1
  }
  
  for (i=0 ; i<3; i=i+1) {
      circle(x3[i]*s,y3[i],30*s);
      fill(5);

      if (dist(x,y,x3[i],y3[i])<70+30) {
        score=score+0.1
      }
  }
  
  for (i=0 ; i<3; i=i+1) {
      circle(x4[i]*s,y4[i],30*s);
      fill(5);

      if (dist(x,y,x4[i],y4[i])<70+30) {
      score=score-0.1
      }
  }
  
  textSize(25)
  text("Score: " + score.toFixed(0),315*s, 640)
  
  if (dist(x,y,x2,y2)<70+70) {
    score=score+0.1
  }
  
  textSize(25)
  text("Time: " + time.toFixed(0),315*s,90)
  time = time - 0.02
  
  if (time < 0 && (score>=min && score<=max)){
    fill(34,139,34);
    circle(x5*s,y5,15*s);
    time = time + 0.02
  }
  
  if (time < 0 && (score<=min || score>=max)){
    fill(255,0,0);
    circle(x6*s,y6,15*s);
    time = time + 0.02
  }
    
  
  textSize(25)
  text("Range: " + min.toFixed(0) + " <= score <= " + max.toFixed(0), 238*s,60)
  
  textSize(25)
  text("Level: "+ level, 315*s, 670)
  
  textSize(25)
    text("Overall Time: " +overalltime.toFixed(0), 275*s, 700)
    overalltime = overalltime - 0.02
    
  }
  
  else {
    name.innerHTML = "Name? <input id='pname'><button onclick='restart()'>Restart</button> <button onclick='generate_alltime_leaderboard()'>All-time leaderboard</button>"
    noLoop()
  }
    
}

function mouseClicked() {
  if ((abs(x5*s-mouseX) < 50) && (abs(y5-mouseY) < 50)) {
    level = level + 1
    time = 5
    min = random(-20,-15)
    max = random(-14,-10 )
    speed = speed + 10
  }
  if ((abs(x6*s-mouseX) < 50) && (abs(y6-mouseY) <50)) {
    level = level - 1
    time = 5
    min = random(-9,-1)
    max = random(0,2)
    speed = speed - 10
  }
}

function keyPressed() {
  if (keyCode === 32) {
    noLoop()
  }
  
  if (keyCode === 27) {
    loop()
  }
}

function restart() {
  let pname=document.getElementById("pname").value
  database.ref(pname).set(level)
  if (name !="") {
    scoreboard[pname] = level
  }
  alert("Scoreboard: " + JSON.stringify(scoreboard,null,1))
  time=5
  score=0
  overalltime = 60
  level = 0
  speed = 10
  x2 = 180
  y2 = 180
  let direction_x
  let direction_y
  loop()
  name.innerHTML=""
  generate_leaderboard()
}


function generate_leaderboard() {
  scores = Object.values(scoreboard)
  names = Object.keys(scoreboard)
  
  if (scores.length >= 3) {
    let leaderboard = { }
    for (i=0; i<3; i=i+1) {
      max = Math.max(...scores)
      index = scores.indexOf(max)
      leaderboard[names[index]] = max
      names.splice(index,1)
      scores.splice(index,1)
    }
    alert("Leaderboard: " + JSON.stringify(leaderboard,null,1))
  }
}

function generate_alltime_leaderboard() {
	let alltime_leaderboard = { }
	database.ref().orderByValue().limitToLast(3).on("value", function(snapshot) {
		snapshot.forEach(function(data) {
		alltime_leaderboard[data.key] = data.val()
		});
    	});
	if (Object.values(alltime_leaderboard).length > 0) {
	  alert("All-time leaderboard: " + JSON.stringify(alltime_leaderboard,null,1))
    	}
}

generate_alltime_leaderboard()


