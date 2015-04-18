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
        name : string;
        stats : StatBlock;

        constructor(name? : string) {
            this.name = name;
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

        // TODO: Make this into something smarter, better.
        attack(target : EntityInBattle) {
            var action = new BattleAction;
            action.entity = this;
            action.targets = [target];
            action.priority = 0;
            action.mutateTargets = (targets : EntityInBattle[], self : EntityInBattle) => {
                targets.forEach((target) => {
                    if (BattleEvaluator.doesAttackHit(self, target)) {
                        var damage = BattleEvaluator.getAttackDamageDealt(self.hand, 10);
                        target.getStats().hp -= damage;
                        console.log("Attack lands for ", damage);
                    }
                    else {
                        console.log("Attack misses!");
                    }
                });
            };
            return action;
        }

        resetForRound() {
            this.hand.clear();
            this.standing = false;
            this.ready = false;
        }
    }

    export enum Stat {
        STRENGTH,
        DEXTERITY,
        CONSTITUTION,
        INTELLIGENCE,
        LUCK
    }

    export class StatBlock {
        static BASE_STAT = 10;

        hp : number;
        mp : number;
        strength : number;
        dexterity : number;
        constitution : number;
        intelligence : number;
        luck : number;
        ac : number; // armor class

        constructor() {
            this.hp = StatBlock.BASE_STAT;
            this.mp = StatBlock.BASE_STAT;
            this.strength = StatBlock.BASE_STAT;
            this.dexterity = StatBlock.BASE_STAT;
            this.constitution = StatBlock.BASE_STAT;
            this.intelligence = StatBlock.BASE_STAT;
            this.luck = StatBlock.BASE_STAT;
            this.ac = StatBlock.BASE_STAT;
        }

        static getStatName(stat) {
            switch(Stat[stat]) {
                case Stat.STRENGTH.valueOf():
                    return "Strength";
                case Stat.DEXTERITY.valueOf():
                    return "Dexterity";
                case Stat.CONSTITUTION.valueOf():
                    return "Constitution";
                case Stat.INTELLIGENCE.valueOf():
                    return "Intelligence";
                case Stat.LUCK.valueOf():
                    return "Luck";
            }
            return "";
        }

        getStat(stat : Stat) {
            switch(Stat[stat]) {
                case Stat.STRENGTH.valueOf():
                    return this.strength;
                case Stat.DEXTERITY.valueOf():
                    return this.dexterity;
                case Stat.CONSTITUTION.valueOf():
                    return this.constitution;
                case Stat.INTELLIGENCE.valueOf():
                    return this.intelligence;
                case Stat.LUCK.valueOf():
                    return this.luck;
            }
            return -1;
        }

        setStat(stat : Stat, value : number) {
            switch(Stat[stat]) {
                case Stat.STRENGTH.valueOf():
                    this.strength = value;
                    break;
                case Stat.DEXTERITY.valueOf():
                    this.dexterity = value;
                    break;
                case Stat.CONSTITUTION.valueOf():
                    this.constitution = value;
                    break;
                case Stat.INTELLIGENCE.valueOf():
                    this.intelligence = value;
                    break;
                case Stat.LUCK.valueOf():
                    this.luck = value;
                    break;
            }
        }
    }

    export class CPUEntityInBattle extends EntityInBattle {

        handEvaluator : HandEvaluator;

        constructor(entity : Entity, hand : Hand, handEvaluator? : HandEvaluator) {
            super(entity, hand);
            this.handEvaluator = handEvaluator;
            if (typeof this.handEvaluator == "undefined") {
                this.handEvaluator = new HandEvaluator();
            }
        }

        chooseActions (system : BattleSystem) {
            // Choose a target.
            var target;
            // TODO: Make this system more robust.
            system.allies.forEach((ally) => {
                if (ally.getStats().hp > 0) {
                    target = ally;
                }
            });

            // Make an action.
            if (typeof target != "undefined") {
                system.enqueueAction(this.attack(target));
                this.ready = true;
            }
        }

        playBlackjack (system : BattleSystem) {
            var currentValue = this.handEvaluator.evaluate(this.hand);

            // Bust check.
            if (currentValue === 0) {
                system.stand(this);
            }

            if (currentValue >= 17) {
                system.stand(this);
            }
            else {
                system.hit(this);
                this.playBlackjack(system);
            }
        }
    }
}
