document.querySelectorAll('.hole').forEach((element) => element.addEventListener('click', hitHole));

const statusDeadElement = document.querySelector('#status #dead');
const statusLostElement = document.querySelector('#status #lost');

const LOSE_NUMBER_CONDITION = 5;
const WIN_NUMBER_CONDITION = 10;

/**
 *
 * @param {PointerEvent} e
 */
function hitHole(e) {
  const wasRabbitHitted = e.target.classList.contains('hole_has-mole');
  if (wasRabbitHitted) {
    statusDeadElement.textContent = (Number(statusDeadElement.textContent) ?? 0) + 1;
  } else {
    statusLostElement.textContent = (Number(statusLostElement.textContent) ?? 0) + 1;
  }
  checkFinishGame();
}

function checkFinishGame() {
  const deadStats = Number(statusDeadElement.textContent) ?? 0;
  const lostStats = Number(statusLostElement.textContent) ?? 0;
  if (lostStats === LOSE_NUMBER_CONDITION) {
    alert('You lose');
    clearStats();
  }
  if (deadStats === WIN_NUMBER_CONDITION) {
    alert('You win');
    clearStats();
  }
}

function clearStats() {
  statusDeadElement.textContent = 0;
  statusLostElement.textContent = 0;
}
