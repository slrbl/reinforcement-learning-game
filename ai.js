
/*
Contains the Q-Learning part
walid.daboubi@gmail.com
*/
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

// Train the agent to find the  target using Q-Learning
function trainAgent(training_sessions){
  logEvent("training..")
  // Construct env marix
  env_matrix = window.constructEnvMatrix(20)
  // define target
  var TARGET = 169
  var GAMMA = 0.8;
  var episode = 0
  env_matrix[TARGET-1][TARGET]=1000
  env_matrix[TARGET+1][TARGET]=1000
  env_matrix[TARGET+20][TARGET]=1000
  // Add blockers to env matrix
  env_matrix = window.addBlockerToMatrix(blockers,env_matrix)
  console.log(localStorage.q_matrix)
  if (localStorage.q_matrix!=0){
    q_matrix = JSON.parse(localStorage.getItem("q_matrix"));
  }
  else{
    q_matrix = window.constructQMatrix(20);
  }
  console.log(q_matrix)
  var random_next_state = null;
  while (episode < training_sessions){
    if (random_next_state == TARGET || random_next_state == null){
      random_initial_state =  Math.floor(Math.random() * Math.floor(400))
    }
    else{
      random_initial_state = random_next_state
    }
    possible_next_states = window.get_possible_next_sates(random_initial_state, env_matrix)
    random_next_state = possible_next_states[Math.floor(Math.random() * possible_next_states.length)];
    console.log("NEW EPISODE")
    console.log(episode)
    //console.log("random_initial_state")
    //console.log(random_initial_state)
    //console.log("possible_next_states")
    //console.log(possible_next_states)
    //console.log("Random next state")
    //console.log(random_next_state)
    //console.log("env_matrix[random_initial_state][random_next_state]")
    //console.log(env_matrix[random_initial_state][random_next_state])
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
      q_matrix[random_initial_state][random_next_state] = env_matrix[random_initial_state][random_next_state] + GAMMA * Math.max(...Q_possible_next_state_leadings); //getMatrixMax(Q_possible_next_state_leadings));
      //console.log(Q_possible_next_state_leadings)
    }
    episode += 1;
  }
  localStorage.episodes = episode+parseInt(localStorage.episodes);
  logEvent(localStorage.episodes+" episodes done")
  localStorage.setItem("q_matrix", JSON.stringify(q_matrix));
  return q_matrix
}

function infiniteTrain(){
  localStorage.princess_found=false
  var id = setInterval(frame2, 3000);
  function frame2() {
    if (localStorage.princess_found=='true'){
      alert('Ready to start a new game')
      clearInterval(id);
    }
    if (localStorage.princess_found=='false'){
      window.moveAgent(window.trainAgent(5000),50)
    }
  }
}
