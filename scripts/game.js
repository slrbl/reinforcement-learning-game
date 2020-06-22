/*
 * Self playing mario game with q-learning
 * walid.daboubi@gmail.com
 */

mario = document.getElementById("mario")
agent = document.getElementById("agent")
princess = document.getElementById("princess")
env = document.getElementById("env")
level_select = document.getElementById("level");
train_btn = document.getElementById("train");

unit = mario.offsetWidth;
width_in_unit = env.offsetWidth/unit;
height_in_unit = env.offsetHeight/unit;

princess.style.left = env.offsetLeft+(width_in_unit/2-1)*unit + "px";
princess.style.top = env.offsetTop+(height_in_unit/2-3)*unit + "px";
agent.style.left = env.offsetLeft+"px";
agent.style.top = env.offsetTop+"px";
mario.style.left = env.offsetLeft+unit+"px";
mario.style.top = env.offsetTop+"px";

var blockers=[];

princess_found=false
game_started=false

// Add random blockers
level_select.value=localStorage.level
window.addRandomBlockers(parseInt(localStorage.level))

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
