/*
 * Self playing mario game with q-learning
 * walid.daboubi@gmail.com
 */
horse = document.getElementById("horse")
wolf = document.getElementById("wolf")
princess = document.getElementById("princess")
env = document.getElementById("env")

unit = horse.offsetWidth;
width_in_unit = env.offsetWidth/unit;
height_in_unit = env.offsetHeight/unit;

princess.style.left = env.offsetLeft+(width_in_unit/2-1)*unit + "px";
princess.style.top = env.offsetTop+(height_in_unit/2-1)*unit + "px";
wolf.style.left = env.offsetLeft;
wolf.style.top = env.offsetTop;
horse.style.left = env.offsetLeft+unit;
horse.style.top = env.offsetTop;

  var blockers=[];

  function logEvent(event){
    document.getElementById("info").innerHTML=event+"<br>"+document.getElementById("info").innerHTML
  }

  function addRandomBlockers(density){
    for (i = 0; i < (width_in_unit*height_in_unit)/density; i++) {
      var cell = Math.floor(Math.random() * Math.floor(400))
      var column = cell%width_in_unit
      var row = (cell-(cell%height_in_unit))/height_in_unit
      var blocker = document.createElement("div");
      blocker.id = cell
      blocker.className = 'tree'
      blockerLeftCoord=env.offsetLeft+column*unit;
      blockerTopCoord=env.offsetTop+row*unit;
      if (
        (
          (
            (blockerLeftCoord == princess.offsetLeft) && (blockerTopCoord == princess.offsetTop))
            || ((blockerLeftCoord == horse.offsetLeft) && (blockerTopCoord == horse.offsetTop))
            || ((blockerTopCoord == wolf.offsetTop) && (blockerTopCoord == wolf.offsetTop)))
            == false){
        blocker.style.left = blockerLeftCoord
        blocker.style.top = blockerTopCoord;
        document.body.appendChild(blocker);
        blockers.push(cell);
      }
    }
  }

  function addBlockers(from, to, step){
    for (cell = from; cell <= to; cell+=step) {
      var column = cell%width_in_unit
      var row = (cell-(cell%height_in_unit))/height_in_unit
      var blocker = document.createElement("div");
      blocker.id = cell
      blocker.className = 'wall'
      blockerLeftCoord=env.offsetLeft+column*unit;
      blockerTopCoord=env.offsetTop+row*unit;
      blocker.style.left = blockerLeftCoord
      blocker.style.top = blockerTopCoord;
      document.body.appendChild(blocker);
      if (blockers.includes(cell)==false){
        blockers.push(cell);
      }
    }
  }

princess_found=false

game_started=false

  function start_game(){
    princess_found=false
    logEvent('Starting a new game..')
    logEvent('You can start when you are ready')
    logEvent('Use direction keys to move mario')
    wolf.style.left = env.offsetLeft;
    wolf.style.top = env.offsetTop;
    horse.style.left = env.offsetLeft+unit;
    horse.style.top = env.offsetTop;
    mario_score = 0;
    ai_score = 0;
    game_started=true
  }


  function reset(){

    localStorage.q_matrix = 0;
    localStorage.episodes = 0;
    window.location.reload();
    alert("A new game was generated!")
    logEvent('Setting a new game..')
  }

// Add random blockers
window.addRandomBlockers(10)

// Construct walls around the princess
window.addBlockers(127, 131, 1)
window.addBlockers(163, 167, 1)
window.addBlockers(171, 175, 1)
window.addBlockers(127, 227, 20)
window.addBlockers(131, 231, 20)
window.addBlockers(227, 228, 1)
window.addBlockers(230, 231, 1)
window.addBlockers(163, 343, 20)
window.addBlockers(175, 355, 20)
window.addBlockers(343, 347, 1)
window.addBlockers(351, 355, 1)

console.log(localStorage.episodes)
console.log(JSON.parse(localStorage.getItem("q_matrix")))

document.onkeydown = checkKey;


function checkCollision(element1,element2){
    if (element1.offsetLeft == element2.offsetLeft && element1.offsetTop == element2.offsetTop)
      return true;
    else
      return false;
}


function checkBlockerCollision(element,blockers){
  for (var i = 0; i < blockers.length; i++) {
    current_blocker=document.getElementById(blockers[i]);
    if (element.offsetLeft == current_blocker.offsetLeft && element.offsetTop == current_blocker.offsetTop){
      return true;
    }
  }
  return false;
}

function checkKey(e) {
  if (game_started == true){
    window.moveWolf(JSON.parse(localStorage.getItem('q_matrix')),200)
    game_started=false
  }
  if (princess_found==true){
    alert('Game Over')
  }

  e = e || window.event;
  var xCoord = horse.offsetLeft;
  var yCoord = horse.offsetTop;
  var step = unit;
  var previous_xCoord=xCoord;
  var previous_yCoord=yCoord;
  switch (e.keyCode) {

    case 37 : // left
      if (xCoord > env.offsetLeft)
        {logEvent("Mario goes left");
        xCoord -= step;}
      break;
    case 39 : // right
      if (xCoord < env.offsetLeft + env.offsetWidth - step)
        {logEvent("Mario goes right");
        xCoord += step;}
      break;
    case 40 : // down
      if (yCoord < env.offsetTop+env.offsetHeight - step)
        {logEvent("Mario goes down")
        yCoord += step;}
      break;
    case 38 : // up
      if (yCoord > env.offsetTop)
        {logEvent("Mario goes up")
        yCoord -= step;}
      break;
  }
  if ((checkBlockerCollision(horse,blockers) == false) && (checkCollision(horse,wolf)==false)&& (checkCollision(horse,princess)==false)){
    horse.style.left = xCoord + "px";
    horse.style.top = yCoord + "px";
  }
  else{
    horse.style.left=env.offsetLeft+unit;
    horse.style.top=env.offsetTop;
    xCoord=horse.offsetLeft;
    yCoord=horse.offsetTop;
    logEvent("collision -> init")
  }
  if (horse.offsetLeft == princess.offsetLeft && horse.offsetTop == princess.offsetTop){
    alert("You win")
  }
}

// // // // // // // // // // // // // // // // // //  AI part

function constructEnvMatrix(env_width){
  var env = [];
  var env_matrix = [];
  for (i = 0; i < env_width*env_width; i++) {
    env.push(i);
    env_matrix.push([])
    for (j = 0; j < env_width*env_width; j++){
      env_matrix[i].push(-1)
    }
  }

  for (current = 0; current < env_width*env_width; current++) {
    left = current - 1
    right = current + 1
    up = current - env_width
    down = current + env_width
    if (env.includes(left) && ((left+1)%env_width!=0) ){
      env_matrix[current][left] = 0;
    }
    if (env.includes(right) && ((right)%env_width!=0)){
      env_matrix[current][right] = 0
    }
    if (env.includes(up)){
      env_matrix[current][up] = 0
    }
    if (env.includes(down)){
      env_matrix[current][down] = 0
    }
  }
  return env_matrix;
}

function constructQMatrix(env_width){
  var q_matrix = [];
  for (i = 0; i < env_width*env_width; i++) {
    q_matrix.push([])
    for (j = 0; j < env_width*env_width; j++){
      q_matrix[i].push(0)
    }
  }
  return q_matrix;
}

function get_possible_next_sates(state,env){
  possible_next_state_rewards = env[state]
  possible_next_states = []
  for (i = 0; i < env.length; i++) {
    if (possible_next_state_rewards[i] != -1){
      possible_next_states.push(i)
    }
  }
  return possible_next_states;
}

function addBlockerToMatrix(blockers,matrix){
  for (var i = 0; i < blockers.length; i++) {
    cell = blockers[i]
    try {
      matrix[cell-1][cell] = -1000
    }
    catch(err) {
      //out of environment
    }
    try {
      matrix[cell+1][cell] = -1000
    }
    catch(err) {
      //out of environment
    }
    try {
      matrix[cell-20][cell] = -1000
    }
    catch(err) {
      //out of environment
    }
    try {
      matrix[cell+20][cell] = -1000
    }
    catch(err) {
      //out of environment
    }
  }
  return matrix
}


function TrainOnce(TRAINING_SESSIONS){
  logEvent("training..")
  env_matrix = window.constructEnvMatrix(20)
  env_matrix[208][209]=1000
  env_matrix[210][209]=1000
  env_matrix[189][209]=1000
  env_matrix[229][209]=1000
  env_matrix = window.addBlockerToMatrix(blockers,env_matrix)
  console.log(localStorage.q_matrix)
  if (localStorage.q_matrix!=0){
    q_matrix = JSON.parse(localStorage.getItem("q_matrix"));
  }
  else{
    q_matrix = window.constructQMatrix(20);
  }
      console.log(q_matrix)

      var GAMMA = 0.8;
      var target = 209
      var TRAINING_SESSIONS = 5000

      var random_next_state = null;
      var episode = 0

      while (episode < TRAINING_SESSIONS){

        if (random_next_state == target || random_next_state == null){
              random_initial_state =  Math.floor(Math.random() * Math.floor(400))
        }
        else{
              random_initial_state = random_next_state
            }

        possible_next_states = window.get_possible_next_sates(random_initial_state, env_matrix)
        random_next_state = possible_next_states[Math.floor(Math.random() * possible_next_states.length)];
        console.log("---------------------------------------------------------------")
        console.log(episode)

        //console.log("random_initial_state")
        //console.log(random_initial_state)
        //console.log("possible_next_states")
        //console.log(possible_next_states)
        //console.log("Random next state")
        //console.log(random_next_state)
        //console.log("env_matrix[random_initial_state][random_next_state]")
        //console.log(env_matrix[random_initial_state][random_next_state])
        // Works fine until here
        Q_possible_next_state_leadings = [];
        possible_next_states_second = get_possible_next_sates(random_next_state, env_matrix)
        //console.log("possible_next_states_second")
        //console.log(possible_next_states_second)
        for (i = 0; i < possible_next_states_second.length; i++) {
          random_next_state_leading=possible_next_states_second[i]
          Q_possible_next_state_leadings.push(q_matrix[random_next_state][random_next_state_leading])
        }
        //console.log("Q_possible_next_state_leadings")
        //console.log(Q_possible_next_state_leadings)

        if (q_matrix[random_initial_state][random_next_state] == 0){
              //console.log("bingo")
              //q_matrix[random_initial_state][random_next_state] = Math.round(env_matrix[random_initial_state][random_next_state] + GAMMA * Math.max(...Q_possible_next_state_leadings)); //getMatrixMax(Q_possible_next_state_leadings));
              q_matrix[random_initial_state][random_next_state] = env_matrix[random_initial_state][random_next_state] + GAMMA * Math.max(...Q_possible_next_state_leadings); //getMatrixMax(Q_possible_next_state_leadings));

              //console.log(Q_possible_next_state_leadings)
              //console.log("?????")
            }

        episode += 1;

      }
      localStorage.episodes=episode+parseInt(localStorage.episodes);
      logEvent(localStorage.episodes+" episodes done")
      //localStorage.q_matrix=q_matrix;
      localStorage.setItem("q_matrix", JSON.stringify(q_matrix));
      //alert("Are you ready?")

      return q_matrix
    }


function moveWolf(q_matrix,speed) {
  wolf.style.left=env.offsetLeft;
  wolf.style.top=env.offsetTop;
  var xCoord = wolf.offsetLeft;
  var yCoord = wolf.offsetTop;
  var step = unit;
  var id = setInterval(frame, speed);
  var current_position = 0;
  for (i = 0; i < q_matrix.length; i++) {
    if (Math.max(...q_matrix[i]) > 0){
      current_position = i;
      break
    }
  }
  env_width =  Math.sqrt(q_matrix.length)
  direction = 10
  previous_direction=null;
  creazy=false;
  var col=false;
  function frame() {
    if ((wolf.offsetLeft == princess.offsetLeft && wolf.offsetTop == princess.offsetTop) || direction == -1 || creazy==true  || col==true) {
      if (wolf.offsetLeft == princess.offsetLeft-35 || wolf.offsetTop == princess.offsetTop-35 || wolf.offsetLeft == princess.offsetLeft+35 || wolf.offsetTop == princess.offsetTop+35){
        logEvent('Princess found')
        princess_found = true
      }
      clearInterval(id);
    }
    else
    {
      //console.log("/////////////////////////////////////")
      q_max_value = Math.max(...q_matrix[current_position])
      next_step = q_matrix[current_position].indexOf(q_max_value)
      //console.log(q_matrix[current_position])
      //console.log(next_step)
      if (next_step == current_position + 1)
        {direction=2;  //right
        logEvent("right")}
      else if (next_step == current_position -1 )
        {direction=3;  //left
        logEvent("left")}
      else if (next_step == current_position + env_width)
        {direction=1;  //down
        logEvent("down")}
      else if (next_step == current_position - env_width)
        {direction=0;  //up
        logEvent("up")}
      else
        direction=-1;
      // Exit from loop (crary situation)
      if (previous_direction+direction==1 || previous_direction+direction==5){
        if (previous_direction == direction-1 ||  previous_direction == direction+1){
          direction==-1;
          logEvent("going mad")
          creazy=true;
        }
      }
      console.log("----------------------------------------")
      console.log("direction");
      console.log(direction);
      console.log("previous_direction");
      console.log(previous_direction);
      console.log("----------------------------------------")
      if (direction == 0){ //up
        if (yCoord > env.offsetTop)
          yCoord -= step;
      }
      if (direction == 1){ //down
        if (yCoord < env.offsetTop + env.offsetHeight - step)
          yCoord += step;
      }
      if (direction == 2){ //right
        if (xCoord < env.offsetLeft + env.offsetWidth - step)
          xCoord += step;
      }
      if (direction == 3){ //left
        if (xCoord > env.offsetLeft)
          xCoord -= step;
      }
      wolf.style.left = xCoord + "px";
      wolf.style.top = yCoord + "px";

      col=checkBlockerCollision(wolf,blockers)
      if ((col==true) || (checkCollision(horse,wolf)==true) || (checkCollision(princess,wolf)==true)){
        logEvent("collision -> restart");
        wolf.style.left = env.offsetLeft;
        wolf.style.top = env.offsetTop;
      }
      previous_direction = direction;
      current_position = next_step;
    }
  }
}
