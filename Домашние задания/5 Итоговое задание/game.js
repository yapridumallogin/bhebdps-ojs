class Weapon {
  constructor(name, attack, durability, range) {
    this.name = name;
    this.attack = attack;
    this.durability = durability;
    this.initialDurability = durability;
    this.range = range;
  }

  takeDamage(damage) {
    if (this.durability === Infinity) return;

    this.durability -= damage;
    if (this.durability < 0) {
      this.durability = 0;
    }
  }

  isBroken() {
    return this.durability === 0;
  }

  getAttack() {
    if (this.isBroken()) return 0;

    if (this.initialDurability !== Infinity &&
      this.durability < this.initialDurability * 0.3) {
      return this.attack / 2;
    }

    return this.attack;
  }
}

class Arm extends Weapon {
  constructor() {
    super('Рука', 1, Infinity, 1);
  }
}

class Sword extends Weapon {
  constructor() {
    super('Меч', 25, 500, 1);
  }
}

class Bow extends Weapon {
  constructor() {
    super('Лук', 10, 200, 3);
  }
}

class Knife extends Weapon {
  constructor() {
    super('Нож', 5, 300, 1);
  }
}

class Staff extends Weapon {
  constructor() {
    super('Посох', 8, 300, 2);
  }
}

class Axe extends Sword {
  constructor() {
    super();
    this.name = 'Секира';
    this.attack = 27;
    this.durability = 800;
    this.initialDurability = 800;
  }
}

class LongBow extends Bow {
  constructor() {
    super();
    this.name = 'Длинный лук';
    this.attack = 15;
    this.range = 4;
  }
}

class StormStaff extends Staff {
  constructor() {
    super();
    this.name = 'Посох Бури';
    this.attack = 10;
    this.range = 3;
  }
}

class Player {
  constructor(name, position) {
    this.name = name;
    this.position = position;
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
  }

  getLuck() {
    const randomNumber = Math.random() * 100;
    return (randomNumber + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }
    const weaponDamage = this.weapon.getAttack();
    return (this.attack + weaponDamage) * this.getLuck() / distance;
  }

  takeDamage(damage) {
    this.life -= damage;
    if (this.life < 0) {
      this.life = 0;
    }
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    const moveDistance = Math.min(Math.abs(distance), this.speed);
    this.position -= moveDistance;
    console.log(`${this.name} двигается влево на ${moveDistance}. Новая позиция: ${this.position}`);
  }

  moveRight(distance) {
    const moveDistance = Math.min(Math.abs(distance), this.speed);
    this.position += moveDistance;
    console.log(`${this.name} двигается вправо на ${moveDistance}. Новая позиция: ${this.position}`);
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(Math.abs(distance));
    } else {
      this.moveRight(distance);
    }
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      console.log(`${this.name} блокирует удар оружием!`);
      this.weapon.takeDamage(damage);
      this.checkWeapon();
      return;
    }

    if (this.dodged()) {
      console.log(`${this.name} уклоняется от удара!`);
      return;
    }

    console.log(`${this.name} получает ${damage.toFixed(2)} урона`);
    this.takeDamage(damage);
  }

  checkWeapon() {
    if (this.weapon.isBroken()) {
      console.log(`${this.name}: оружие ${this.weapon.name} сломано!`);
      if (this.primaryWeapons) {
        const currentIndex = this.primaryWeapons.findIndex(w => this.weapon instanceof w);
        if (currentIndex < this.primaryWeapons.length - 1) {
          this.weapon = new this.primaryWeapons[currentIndex + 1]();
          console.log(`${this.name} берет ${this.weapon.name}`);
        }
      }
    }
  }

  tryAttack(enemy) {
    const distance = Math.abs(this.position - enemy.position);
    console.log(`${this.name} атакует ${enemy.name} с расстояния ${distance}`);

    if (distance <= 0) {
      console.log(`${this.name} и ${enemy.name} находятся в одной позиции!`);
      enemy.position += 1;
      const damage = this.getDamage(1) * 2;
      console.log(`${enemy.name} отскакивает и получает двойной урон: ${damage.toFixed(2)}`);
      enemy.takeAttack(damage);
      return;
    }

    if (this.weapon.range < distance) {
      console.log(`${this.name} не может достать ${enemy.name} (дальность оружия: ${this.weapon.range}, расстояние: ${distance})`);
      return;
    }

    const weaponDamage = 10 * this.getLuck();
    this.weapon.takeDamage(weaponDamage);
    console.log(`${this.weapon.name} получает ${weaponDamage.toFixed(2)} повреждений`);
    this.checkWeapon();

    if (this.position === enemy.position) {
      enemy.position += 1;
      const damage = this.getDamage(1) * 2;
      console.log(`${enemy.name} отскакивает и получает двойной урон: ${damage.toFixed(2)}`);
      enemy.takeAttack(damage);
    } else {
      const damage = this.getDamage(distance);
      console.log(`${this.name} наносит ${damage.toFixed(2)} урона`);
      enemy.takeAttack(damage);
    }
  }

  attack(enemy) {
    this.tryAttack(enemy);
  }

  block() {
    this.isAttackBlocked();
  }

  castSpell(enemy) {
    if (this.magic > 0) {
      console.log(`${this.name} использует заклинание!`);
      this.tryAttack(enemy);
      this.magic -= 10;
      console.log(`${this.name} тратит 10 маны. Осталось маны: ${this.magic}`);
      if (this.magic < 0) {
        this.magic = 0;
      }
    } else {
      console.log(`${this.name} не может использовать заклинание: нет маны`);
    }
  }

  chooseEnemy(players) {
    const alivePlayers = players.filter(p => !p.isDead() && p !== this);
    if (alivePlayers.length === 0) {
      return null;
    }

    let minHealth = Infinity;
    let chosenEnemy = null;

    for (const player of alivePlayers) {
      if (player.life < minHealth) {
        minHealth = player.life;
        chosenEnemy = player;
      }
    }

    console.log(`${this.name} выбирает цель: ${chosenEnemy.name} (здоровье: ${chosenEnemy.life})`);
    return chosenEnemy;
  }

  moveToEnemy(enemy) {
    if (!enemy) return;

    const distanceToEnemy = enemy.position - this.position;
    const moveDistance = Math.sign(distanceToEnemy) * Math.min(Math.abs(distanceToEnemy), this.speed);

    if (moveDistance !== 0) {
      this.move(moveDistance);
    }
  }

  turn(players) {
    if (this.isDead()) {
      console.log(`${this.name} мертв и пропускает ход`);
      return;
    }

    console.log(`\n--- Ход ${this.name} (${this.description}) ---`);
    console.log(`Здоровье: ${this.life.toFixed(2)}, Мана: ${this.magic}, Позиция: ${this.position}, Оружие: ${this.weapon.name}`);

    const enemy = this.chooseEnemy(players);
    if (!enemy) {
      console.log(`${this.name} не нашел противников!`);
      return;
    }

    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
  }
}

class Warrior extends Player {
  constructor(name, position) {
    super(name, position);
    this.life = 120;
    this.speed = 2;
    this.description = 'Воин';
    this.weapon = new Sword();
    this.primaryWeapons = [Sword, Knife, Arm];
  }

  takeDamage(damage) {
    if (this.life < 60 && this.getLuck() > 0.8) {
      if (this.magic > 0) {
        console.log(`${this.name} использует ману для защиты!`);
        this.magic -= damage;
        if (this.magic < 0) {
          const remainingDamage = -this.magic;
          this.magic = 0;
          this.life -= remainingDamage;
          if (this.life < 0) {
            this.life = 0;
          }
        }
        console.log(`${this.name} потерял ману. Осталось маны: ${this.magic}`);
        return;
      }
    }
    this.life -= damage;
    if (this.life < 0) {
      this.life = 0;
    }
  }
}

class Archer extends Player {
  constructor(name, position) {
    super(name, position);
    this.life = 80;
    this.magic = 35;
    this.attack = 5;
    this.agility = 10;
    this.description = 'Лучник';
    this.weapon = new Bow();
    this.primaryWeapons = [Bow, Knife, Arm];
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }
    const weaponDamage = this.weapon.getAttack();
    return (this.attack + weaponDamage) * this.getLuck() * distance / this.weapon.range;
  }
}

class Mage extends Player {
  constructor(name, position) {
    super(name, position);
    this.life = 70;
    this.magic = 100;
    this.attack = 5;
    this.agility = 8;
    this.description = 'Маг';
    this.weapon = new Staff();
    this.primaryWeapons = [Staff, Knife, Arm];
  }

  takeDamage(damage) {
    if (this.magic > 50) {
      console.log(`${this.name} использует магический щит!`);
      const reducedDamage = damage / 2;
      this.life -= reducedDamage;
      this.magic -= 12;
      console.log(`${this.name} теряет 12 маны. Осталось маны: ${this.magic}`);
      if (this.magic < 0) {
        this.magic = 0;
      }
    } else {
      this.life -= damage;
    }

    if (this.life < 0) {
      this.life = 0;
    }
  }

  turn(players) {
    if (this.isDead()) {
      console.log(`${this.name} мертв и пропускает ход`);
      return;
    }

    console.log(`\n--- Ход ${this.name} (${this.description}) ---`);
    console.log(`Здоровье: ${this.life.toFixed(2)}, Мана: ${this.magic}, Позиция: ${this.position}, Оружие: ${this.weapon.name}`);

    const enemy = this.chooseEnemy(players);
    if (!enemy) {
      console.log(`${this.name} не нашел противников!`);
      return;
    }

    this.moveToEnemy(enemy);
    this.castSpell(enemy);
  }
}

class Dwarf extends Warrior {
  constructor(name, position) {
    super(name, position);
    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';
    this.weapon = new Axe();
    this.primaryWeapons = [Axe, Knife, Arm];
    this.hitCount = 0;
  }

  takeDamage(damage) {
    this.hitCount++;
    console.log(`${this.name} получает ${this.hitCount}-й удар`);

    if (this.hitCount % 6 === 0 && this.getLuck() > 0.5) {
      console.log(`${this.name} использует каменную кожу!`);
      damage = damage / 2;
      console.log(`Урон уменьшен вдвое: ${damage.toFixed(2)}`);
    }

    super.takeDamage(damage);
  }
}

class Crossbowman extends Archer {
  constructor(name, position) {
    super(name, position);
    this.life = 85;
    this.attack = 8;
    this.agility = 20;
    this.luck = 15;
    this.description = 'Арбалетчик';
    this.weapon = new LongBow();
    this.primaryWeapons = [LongBow, Knife, Arm];
  }
}

class Demiurge extends Mage {
  constructor(name, position) {
    super(name, position);
    this.life = 80;
    this.magic = 120;
    this.attack = 6;
    this.luck = 12;
    this.description = 'Демиург';
    this.weapon = new StormStaff();
    this.primaryWeapons = [StormStaff, Knife, Arm];
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    const weaponDamage = this.weapon.getAttack();
    let damage = (this.attack + weaponDamage) * this.getLuck() / distance;

    if (this.magic > 0 && this.getLuck() > 0.6) {
      console.log(`${this.name} усиливает заклинание!`);
      damage *= 1.5;
    }

    return damage;
  }
}

function play(players) {
  console.log('=== НАЧАЛО КОРОЛЕВСКОЙ БИТВЫ ===');
  console.log('Участники:');
  players.forEach(player => {
    console.log(`${player.name} (${player.description}) - здоровье: ${player.life}, позиция: ${player.position}`);
  });
  console.log('===============================\n');

  let round = 1;
  const maxRounds = 100;

  while (round <= maxRounds) {
    console.log(`\n=== РАУНД ${round} ===`);

    const alivePlayers = players.filter(p => !p.isDead());

    if (alivePlayers.length <= 1) {
      break;
    }

    for (const player of players) {
      if (!player.isDead()) {
        player.turn(players);
      }
    }

    round++;
  }

  const alivePlayers = players.filter(p => !p.isDead());

  console.log('\n=== ИТОГИ БИТВЫ ===');
  if (alivePlayers.length === 1) {
    const winner = alivePlayers[0];
    console.log(`ПОБЕДИТЕЛЬ: ${winner.name} (${winner.description})!`);
    console.log(`Осталось здоровья: ${winner.life.toFixed(2)}`);
  } else if (alivePlayers.length > 1) {
    console.log('НИЧЬЯ! Оставшиеся в живых:');
    alivePlayers.forEach(player => {
      console.log(`${player.name} (${player.description}) - здоровье: ${player.life.toFixed(2)}`);
    });
  } else {
    console.log('ВСЕ УМЕРЛИ! Победителя нет.');
  }

  return alivePlayers;
}
