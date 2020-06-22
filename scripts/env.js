/*
Game environment construction
walid.daboubi@gmail.com
*/


// Check collision between  two elements
function checkCollision(element1,element2){
    if (element1.offsetLeft == element2.offsetLeft && element1.offsetTop == element2.offsetTop)
      return true;
    else
      return false;
}

// Check collision between one elemenet and all the blockers
function checkBlockerCollision(element,blockers){
  for (var i = 0; i < blockers.length; i++) {
    current_blocker=document.getElementById(blockers[i]);
    if (element.offsetLeft == current_blocker.offsetLeft && element.offsetTop == current_blocker.offsetTop){
      return true;
    }
  }
  return false;
}

// Create random blockers
function addRandomBlockers(density){
  for (i = 0; i < (width_in_unit*height_in_unit)/density; i++) {
    var cell = Math.floor(Math.random() * Math.floor(400))
    if (cell!=209 && cell!=229 && cell!=249){
      var column = cell%width_in_unit
      var row = (cell-(cell%height_in_unit))/height_in_unit
      var blocker = document.createElement("div");
      blocker.id = cell
      if (cell%5==0)
      blocker.className = 'tortule'
      else
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
        blocker.style.left = blockerLeftCoord+"px";
        blocker.style.top = blockerTopCoord+"px";
        document.body.appendChild(blocker);
        blockers.push(cell);
      }
    }
  }
}

// Add non random blockers
function addBlockers(from, to, step){
  for (cell = from; cell <= to; cell+=step) {
    var column = cell%width_in_unit
    var row = (cell-(cell%height_in_unit))/height_in_unit
    var blocker = document.createElement("div");
    blocker.id = cell
    blocker.className = 'wall'
    blockerLeftCoord=env.offsetLeft+column*unit;
    blockerTopCoord=env.offsetTop+row*unit;
    blocker.style.left = blockerLeftCoord+"px";
    blocker.style.top = blockerTopCoord+"px";
    document.body.appendChild(blocker);
    if (blockers.includes(cell)==false){
      blockers.push(cell);
    }
  }
}

// start a new game
function start_game(){
  document.onkeydown = checkKey;
  princess_found=false
  logEvent('Starting a new game..')
  logEvent('You can start when you are ready')
  logEvent('Use direction keys to move mario')
  wolf.style.left = env.offsetLeft+"px";
  wolf.style.top = env.offsetTop+"px";
  horse.style.left = env.offsetLeft+unit+"px";
  horse.style.top = env.offsetTop+"px";
  mario_score = 0;
  ai_score = 0;
  game_started=true
}

// Reset game and environment
function reset(){
  localStorage.q_matrix = 0;
  localStorage.episodes = 0;
  alert("A new game was generated!")
  logEvent('Setting a new game..')
  level_select = document.getElementById("level");
  level=level_select.options[level_select.selectedIndex].value
  localStorage.level=parseInt(level)
  location.reload();
}

function logEvent(event){
  document.getElementById("info").innerHTML=event+"<br>"+document.getElementById("info").innerHTML
}
