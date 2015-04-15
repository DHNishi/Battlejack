/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="_all.ts"/>
module battlejack {
    export interface IEntity {
        getAttackBonus() : number;
        getAC() : number;
    }

    export class Entity implements IEntity {
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

    export class EntityInBattle implements IEntity {
        hand : Hand;
        standing : boolean; // has stood with Blackjack hand.
        ready : boolean; // has moved this round.

        // Entity
        entity : Entity;

        constructor(entity : Entity, hand : Hand) {
            this.entity = entity;
            this.hand = hand;
            this.standing = false;
        }

        getAttackBonus() {
            return this.entity.getAttackBonus();
        }

        getAC() {
            return this.entity.getAC();
        }

        getStats() {
            return this.entity.stats;
        }

        resetForRound() {
            this.hand.clear();
            this.standing = false;
            this.ready = false;
        }
    }

    export class StatBlock {
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

}
