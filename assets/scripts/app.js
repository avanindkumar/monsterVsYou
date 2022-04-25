const ATTACK_VALUE = 20;
const STRONG_ATTACK_VALUE = 30;
const MONSTER_ATTACK_VALUE = 20;
const HEAL_VALUE = 10;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let enteredValue = prompt('Game Max health value', '100');
let maxChosenHealth = parseInt(enteredValue);
let battleLog = [];

if (isNaN(maxChosenHealth) || maxChosenHealth <= 0) {
  maxChosenHealth = 100;
}

let currentPlayerHealth = maxChosenHealth;
let currentMonsterHealth = maxChosenHealth;
let hasBonusLife = true;

adjustHealthBars(maxChosenHealth);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = 'Monster';
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = 'Monster';
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = 'Player';
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = 'Player';
  }
  battleLog.push(logEntry);
}

function reset() {
  currentPlayerHealth = maxChosenHealth;
  currentMonsterHealth = maxChosenHealth;
  resetGame(maxChosenHealth);
}

function endRound() {
  let initialPlayerHealth = currentPlayerHealth;
  const pDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= pDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    pDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    currentPlayerHealth = initialPlayerHealth;
    removeBonusLife();
    setPlayerHealth(initialPlayerHealth);
    alert('You would be dead but bonus life saved you!!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Win!!!!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'Player Won',
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lose!!!!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'Monster Won',
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert('Your have a Draw!!!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'You have a Draw',
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  }
}

function attackMonster(mode) {
  let damage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    damage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === MODE_STRONG_ATTACK) {
    damage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  const mDamage = dealMonsterDamage(damage);
  currentMonsterHealth -= mDamage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function onAttack() {
  attackMonster(MODE_ATTACK);
}
function onStrongAttack() {
  attackMonster(MODE_STRONG_ATTACK);
}

function onHeal() {
  let healValue;
  if (currentPlayerHealth + HEAL_VALUE > maxChosenHealth) {
    healValue = maxChosenHealth - currentPlayerHealth;
    alert("You Can't heal above Max Health");
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLog() {
  // for (let i = 0; i <battleLog.length; i++) {
  //   console.log(battleLog[i]);
  // }
  let i=0
  for (const element of battleLog){
    console.log(`#${i}`);
    for(const key in battleLog){
      console.log(key);
      console.log(battleLog[key]);
    }
    i++;
  }
}

strongAttackBtn.addEventListener('click', onStrongAttack);
attackBtn.addEventListener('click', onAttack);
healBtn.addEventListener('click', onHeal);
logBtn.addEventListener('click', printLog);
