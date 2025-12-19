describe('Weapon Class', () => {
  it('Weapon constructor sets properties correctly', () => {
    const weapon = new Weapon('Test', 10, 100, 2);
    expect(weapon.name).toBe('Test');
    expect(weapon.attack).toBe(10);
    expect(weapon.durability).toBe(100);
    expect(weapon.initialDurability).toBe(100);
    expect(weapon.range).toBe(2);
  });

  it('takeDamage decreases durability', () => {
    const weapon = new Weapon('Test', 10, 100, 2);
    weapon.takeDamage(30);
    expect(weapon.durability).toBe(70);
  });

  it('takeDamage does not go below 0', () => {
    const weapon = new Weapon('Test', 10, 50, 2);
    weapon.takeDamage(100);
    expect(weapon.durability).toBe(0);
  });

  it('isBroken returns true when durability is 0', () => {
    const weapon = new Weapon('Test', 10, 0, 2);
    expect(weapon.isBroken()).toBe(true);
  });

  it('isBroken returns false when durability > 0', () => {
    const weapon = new Weapon('Test', 10, 50, 2);
    expect(weapon.isBroken()).toBe(false);
  });

  it('getAttack returns 0 when broken', () => {
    const weapon = new Weapon('Test', 10, 0, 2);
    expect(weapon.getAttack()).toBe(0);
  });

  it('getAttack returns full attack when durability > 30%', () => {
    const weapon = new Weapon('Test', 10, 100, 2);
    weapon.takeDamage(50);
    expect(weapon.getAttack()).toBe(10);
  });

  it('getAttack returns half attack when durability < 30%', () => {
    const weapon = new Weapon('Test', 10, 100, 2);
    weapon.takeDamage(80);
    expect(weapon.getAttack()).toBe(5);
  });

  it('Arm has correct properties', () => {
    const arm = new Arm();
    expect(arm.name).toBe('Рука');
    expect(arm.attack).toBe(1);
    expect(arm.durability).toBe(Infinity);
    expect(arm.range).toBe(1);
  });

  it('Sword has correct properties', () => {
    const sword = new Sword();
    expect(sword.name).toBe('Меч');
    expect(sword.attack).toBe(25);
    expect(sword.durability).toBe(500);
    expect(sword.range).toBe(1);
  });

  it('Bow has correct properties', () => {
    const bow = new Bow();
    expect(bow.name).toBe('Лук');
    expect(bow.attack).toBe(10);
    expect(bow.durability).toBe(200);
    expect(bow.range).toBe(3);
  });

  it('Axe inherits from Sword', () => {
    const axe = new Axe();
    expect(axe.name).toBe('Секира');
    expect(axe.attack).toBe(27);
    expect(axe.durability).toBe(800);
    expect(axe.range).toBe(1);
    expect(axe instanceof Sword).toBe(true);
  });

  it('LongBow inherits from Bow', () => {
    const longbow = new LongBow();
    expect(longbow.name).toBe('Длинный лук');
    expect(longbow.attack).toBe(15);
    expect(longbow.durability).toBe(200);
    expect(longbow.range).toBe(4);
    expect(longbow instanceof Bow).toBe(true);
  });

  it('StormStaff inherits from Staff', () => {
    const stormstaff = new StormStaff();
    expect(stormstaff.name).toBe('Посох Бури');
    expect(stormstaff.attack).toBe(10);
    expect(stormstaff.durability).toBe(300);
    expect(stormstaff.range).toBe(3);
    expect(stormstaff instanceof Staff).toBe(true);
  });
});

describe('Player Class', () => {
  it('Player constructor sets properties correctly', () => {
    const player = new Player('TestPlayer', 0);
    expect(player.name).toBe('TestPlayer');
    expect(player.position).toBe(0);
    expect(player.life).toBe(100);
    expect(player.magic).toBe(20);
    expect(player.speed).toBe(1);
    expect(player.attack).toBe(10);
    expect(player.agility).toBe(5);
    expect(player.luck).toBe(10);
    expect(player.description).toBe('Игрок');
  });

  it('getLuck returns value between luck/100 and (100+luck)/100', () => {
    const player = new Player('Test', 0);
    for (let i = 0; i < 100; i++) {
      const luck = player.getLuck();
      expect(luck).toBeGreaterThanOrEqual(player.luck / 100);
      expect(luck).toBeLessThanOrEqual((100 + player.luck) / 100);
    }
  });

  it('getDamage returns 0 when distance > weapon range', () => {
    const player = new Player('Test', 0);
    player.weapon = new Weapon('Test', 10, 100, 2);
    expect(player.getDamage(3)).toBe(0);
  });

  it('getDamage calculates correctly', () => {
    const player = new Player('Test', 0);
    player.attack = 10;
    player.weapon = { getAttack: () => 5, range: 5 };
    player.getLuck = () => 1.0;
    const damage = player.getDamage(2);
    expect(damage).toBe((10 + 5) * 1.0 / 2);
  });

  it('takeDamage reduces life', () => {
    const player = new Player('Test', 0);
    player.takeDamage(30);
    expect(player.life).toBe(70);
  });

  it('takeDamage does not go below 0', () => {
    const player = new Player('Test', 0);
    player.takeDamage(150);
    expect(player.life).toBe(0);
  });

  it('isDead returns true when life is 0', () => {
    const player = new Player('Test', 0);
    player.life = 0;
    expect(player.isDead()).toBe(true);
  });

  it('isDead returns false when life > 0', () => {
    const player = new Player('Test', 0);
    player.life = 50;
    expect(player.isDead()).toBe(false);
  });

  it('moveLeft moves correctly', () => {
    const player = new Player('Test', 5);
    player.speed = 2;
    player.moveLeft(3);
    expect(player.position).toBe(3);
  });

  it('moveRight moves correctly', () => {
    const player = new Player('Test', 5);
    player.speed = 2;
    player.moveRight(3);
    expect(player.position).toBe(7);
  });

  it('move calls correct direction', () => {
    const player = new Player('Test', 5);
    player.speed = 2;

    player.move(-3);
    expect(player.position).toBe(3);

    player.position = 5;
    player.move(3);
    expect(player.position).toBe(7);
  });

  it('move respects speed limit', () => {
    const player = new Player('Test', 5);
    player.speed = 1;
    player.moveLeft(3);
    expect(player.position).toBe(4);
  });

  it('takeAttack with dodge does no damage', () => {
    const player = new Player('Test', 0);
    player.life = 100;
    player.dodged = () => true;
    player.takeAttack(30);
    expect(player.life).toBe(100);
  });

  it('takeAttack with no block or dodge deals damage', () => {
    const player = new Player('Test', 0);
    player.life = 100;
    player.isAttackBlocked = () => false;
    player.dodged = () => false;
    player.takeAttack(30);
    expect(player.life).toBe(70);
  });

  it('checkWeapon switches when broken', () => {
    const player = new Player('Test', 0);
    player.primaryWeapons = [Weapon, Arm];
    player.weapon = { isBroken: () => true, name: 'Test' };
    player.checkWeapon();
  });

  it('chooseEnemy selects weakest', () => {
    const player = new Player('Test', 0);
    const enemy1 = { name: 'E1', life: 50, isDead: () => false };
    const enemy2 = { name: 'E2', life: 30, isDead: () => false };
    const enemy3 = { name: 'E3', life: 70, isDead: () => false };

    const chosen = player.chooseEnemy([player, enemy1, enemy2, enemy3]);
    expect(chosen).toBe(enemy2);
  });

  it('chooseEnemy ignores self and dead', () => {
    const player = new Player('Test', 0);
    const enemy1 = { name: 'E1', life: 50, isDead: () => true };
    const enemy2 = { name: 'E2', life: 30, isDead: () => false };

    const chosen = player.chooseEnemy([player, enemy1, enemy2]);
    expect(chosen).toBe(enemy2);
  });

  it('moveToEnemy moves towards enemy', () => {
    const player = new Player('Test', 0);
    player.speed = 2;
    const enemy = { position: 5 };

    player.moveToEnemy(enemy);
    expect(player.position).toBe(2);
  });
});

describe('Warrior Class', () => {
  it('Warrior has correct stats', () => {
    const warrior = new Warrior('War', 0);
    expect(warrior.life).toBe(120);
    expect(warrior.speed).toBe(2);
    expect(warrior.description).toBe('Воин');
    expect(warrior.primaryWeapons).toEqual([Sword, Knife, Arm]);
  });

  it('Warrior takeDamage uses mana when lucky and low health', () => {
    const warrior = new Warrior('War', 0);
    warrior.life = 40;
    warrior.magic = 50;
    warrior.getLuck = () => 0.9;

    warrior.takeDamage(30);
    expect(warrior.magic).toBe(20);
    expect(warrior.life).toBe(40);
  });

  it('Warrior takeDamage uses life when mana depleted', () => {
    const warrior = new Warrior('War', 0);
    warrior.life = 40;
    warrior.magic = 20;
    warrior.getLuck = () => 0.9;

    warrior.takeDamage(30);
    expect(warrior.magic).toBe(0);
    expect(warrior.life).toBe(30);
  });

  it('Warrior takeDamage uses normal damage when not lucky', () => {
    const warrior = new Warrior('War', 0);
    warrior.life = 40;
    warrior.magic = 50;
    warrior.getLuck = () => 0.5;

    warrior.takeDamage(30);
    expect(warrior.life).toBe(10);
    expect(warrior.magic).toBe(50);
  });
});

describe('Archer Class', () => {
  it('Archer has correct stats', () => {
    const archer = new Archer('Arch', 0);
    expect(archer.life).toBe(80);
    expect(archer.magic).toBe(35);
    expect(archer.attack).toBe(5);
    expect(archer.agility).toBe(10);
    expect(archer.description).toBe('Лучник');
    expect(archer.primaryWeapons).toEqual([Bow, Knife, Arm]);
  });

  it('Archer getDamage formula', () => {
    const archer = new Archer('Arch', 0);
    archer.attack = 5;
    archer.weapon = { getAttack: () => 10, range: 3 };
    archer.getLuck = () => 1.0;

    const damage = archer.getDamage(2);
    expect(damage).toBe((5 + 10) * 1.0 * 2 / 3);
  });
});

describe('Mage Class', () => {
  it('Mage has correct stats', () => {
    const mage = new Mage('Mag', 0);
    expect(mage.life).toBe(70);
    expect(mage.magic).toBe(100);
    expect(mage.attack).toBe(5);
    expect(mage.agility).toBe(8);
    expect(mage.description).toBe('Маг');
    expect(mage.primaryWeapons).toEqual([Staff, Knife, Arm]);
  });

  it('Mage takeDamage uses shield when magic > 50', () => {
    const mage = new Mage('Mag', 0);
    mage.magic = 60;

    mage.takeDamage(40);
    expect(mage.life).toBe(70 - 20);
    expect(mage.magic).toBe(48);
  });

  it('Mage takeDamage normal when magic <= 50', () => {
    const mage = new Mage('Mag', 0);
    mage.magic = 40;

    mage.takeDamage(40);
    expect(mage.life).toBe(30);
    expect(mage.magic).toBe(40);
  });
});

describe('Dwarf Class', () => {
  it('Dwarf has correct stats', () => {
    const dwarf = new Dwarf('Dwarf', 0);
    expect(dwarf.life).toBe(130);
    expect(dwarf.attack).toBe(15);
    expect(dwarf.luck).toBe(20);
    expect(dwarf.description).toBe('Гном');
    expect(dwarf.primaryWeapons).toEqual([Axe, Knife, Arm]);
  });
});

describe('Crossbowman Class', () => {
  it('Crossbowman has correct stats', () => {
    const crossbowman = new Crossbowman('Cross', 0);
    expect(crossbowman.life).toBe(85);
    expect(crossbowman.attack).toBe(8);
    expect(crossbowman.agility).toBe(20);
    expect(crossbowman.luck).toBe(15);
    expect(crossbowman.description).toBe('Арбалетчик');
    expect(crossbowman.primaryWeapons).toEqual([LongBow, Knife, Arm]);
  });
});

describe('Demiurge Class', () => {
  it('Demiurge has correct stats', () => {
    const demiurge = new Demiurge('Dem', 0);
    expect(demiurge.life).toBe(80);
    expect(demiurge.magic).toBe(120);
    expect(demiurge.attack).toBe(6);
    expect(demiurge.luck).toBe(12);
    expect(demiurge.description).toBe('Демиург');
    expect(demiurge.primaryWeapons).toEqual([StormStaff, Knife, Arm]);
  });

  it('Demiurge getDamage increases when magic > 0 and lucky', () => {
    const demiurge = new Demiurge('Dem', 0);
    demiurge.attack = 6;
    demiurge.magic = 50;
    demiurge.weapon = { getAttack: () => 10, range: 3 };
    demiurge.getLuck = () => 0.7;

    const damage = demiurge.getDamage(2);
    expect(damage).toBe((6 + 10) * 0.7 / 2 * 1.5);
  });

  it('Demiurge getDamage normal when not lucky', () => {
    const demiurge = new Demiurge('Dem', 0);
    demiurge.attack = 6;
    demiurge.magic = 50;
    demiurge.weapon = { getAttack: () => 10, range: 3 };
    demiurge.getLuck = () => 0.5;

    const damage = demiurge.getDamage(2);
    expect(damage).toBe((6 + 10) * 0.5 / 2);
  });

  it('Demiurge getDamage normal when no magic', () => {
    const demiurge = new Demiurge('Dem', 0);
    demiurge.attack = 6;
    demiurge.magic = 0;
    demiurge.weapon = { getAttack: () => 10, range: 3 };
    demiurge.getLuck = () => 0.7;

    const damage = demiurge.getDamage(2);
    expect(damage).toBe((6 + 10) * 0.7 / 2);
  });
});

describe('Game Functions', () => {
  it('play function returns alive players', () => {
    const player1 = new Player('P1', 0);
    const player2 = new Player('P2', 10);
    player2.life = 1;

    const alive = play([player1, player2]);
    expect(alive.length).toBe(1);
  });

  it('tryAttack with out of range', () => {
    const player = new Player('P1', 0);
    const enemy = new Player('P2', 10);

    player.weapon = { range: 5, getAttack: () => 10 };


    player.tryAttack(enemy);
    expect(enemy.position).toBe(10);
  });
});
