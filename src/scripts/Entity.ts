/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="../scripts/Hand.ts"/>

interface IEntity {
    getAttackBonus() : number;
    getAC() : number;
}

class Entity implements IEntity {
    stats : StatBlock;

    constructor() {
        this.stats = new StatBlock();
    }

    getAttackBonus() {
        return Math.floor((this.stats.strength - 10) / 2);
    }

    getAC() {
        return this.stats.ac;
    }
}

class EntityInBattle implements IEntity {
    hand : Hand;

    // Entity
    entity : Entity;

    constructor(entity : Entity, hand : Hand) {
        this.entity = entity;
        this.hand = hand;
    }

    getAttackBonus() {
        return this.entity.getAttackBonus();
    }

    getAC() {
        return this.entity.getAC();
    }
}

class StatBlock {
    static BASE_STAT = 10;

    hp : number;
    mp : number;
    strength : number;
    ac : number; // armor class

    constructor() {
        this.hp = StatBlock.BASE_STAT;
        this.mp = StatBlock.BASE_STAT;
        this.strength = StatBlock.BASE_STAT;
        this.ac = StatBlock.BASE_STAT;
    }
}
