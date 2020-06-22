// Move mario function
function checkKey(e) {
  game_mode=true
  if (game_started == true){
    window.moveAgent(JSON.parse(localStorage.getItem('q_matrix')),200)
    game_started=false
  }
  if (princess_found==true && game_mode==true){
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
    logEvent(xCoord+','+yCoord)

  }
  else{
    horse.style.left=env.offsetLeft+unit+"px";
    horse.style.top=env.offsetTop+"px";
    xCoord=horse.offsetLeft;
    yCoord=horse.offsetTop;
    logEvent("collision -> init")
  }
  if (horse.offsetLeft == princess.offsetLeft && horse.offsetTop == princess.offsetTop){
    alert("You win")
  }
}



function moveAgent(q_matrix,speed) {

  wolf.style.left=env.offsetLeft+"px";
  wolf.style.top=env.offsetTop+"px";
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

        localStorage.princess_found = true
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
      /*
      console.log("direction");
      console.log(direction);
      console.log("previous_direction");
      console.log(previous_direction);
      */
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
      logEvent(xCoord+','+yCoord)

      col=checkBlockerCollision(wolf,blockers)
      if ((col==true) || (checkCollision(horse,wolf)==true) || (checkCollision(princess,wolf)==true)){
        logEvent("collision -> restart");
        wolf.style.left = env.offsetLeft+"px";
        wolf.style.top = env.offsetTop+"px";
      }

      previous_direction = direction;
      current_position = next_step;

    }
  }
}
