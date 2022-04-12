function rectangularCollision({ attacker, target }) {
  return (
    attacker.attackBox.position.x + attacker.attackBox.width >= target.position.x &&
    attacker.attackBox.position.x <= target.position.x + target.width &&
    attacker.attackBox.position.y + attacker.attackBox.height >= target.position.y &&
    attacker.attackBox.position.y <= target.position.y + target.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';
  if (player.healthBar === enemy.healthBar) {
    document.querySelector('#displayText').textContent = 'Tie';
  } else if (player.healthBar > enemy.healthBar) {
    document.querySelector('#displayText').textContent = 'Player 1 Wins';
  } else if (enemy.healthBar > player.healthBar) {
    document.querySelector('#displayText').textContent = 'Player 2 Wins';
  }
}

let timer = 120;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').textContent = timer;
  }
  
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}