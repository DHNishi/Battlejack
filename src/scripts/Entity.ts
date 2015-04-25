/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="_all.ts"/>
module battlejack {
    export interface IEntity {
        getAttackBonus() : number;
        getAC() : number;
        getName() : string;
        getSpellList() : string[];
        isIncapacitated() : boolean;

        getLevel() : number;
        getExperience() : number;
        addExperience(exp : number) : void;
        levelUp();

        // Returns the amount of damage dealt.
        dealDamage(amount : number, type : string) : number;
    }

    export class Entity implements IEntity {
        name : string;
        stats : StatBlock;
        spellList : string[];
        private level : number;
        private experience : number;

        constructor(name? : string) {
            this.name = name;
            this.stats = new StatBlock();
            this.spellList = [];
            this.experience = 0;
            this.level = 1;
        }

        getAttackBonus() {
            return Math.floor((this.stats.strength - 10) / 2);
        }

        getAC() {
            var statBonus = this.stats.getStatBonus(Stat.DEXTERITY);
            console.log(statBonus);
            console.log(this.stats.dexterity);
            return this.stats.ac;
        }

        getName() {
            return this.name;
        }

        getSpellList() {
            return this.spellList;
        }

        isIncapacitated() {
            return this.stats.hp > 0;
        }

        dealDamage(amount : number, type : string) {
            // TODO: This is simplistic and stupid. Improve it!
            this.stats.hp -= amount;
            return amount;
        }

        getLevel() : number {
            return this.level;
        }
        getExperience() : number {
            return this.experience;
        }
        addExperience(exp : number) {
            this.experience += exp;
        }
        levelUp() {
            this.level += 1;
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

        getName() {
            return this.entity.getName();
        }

        getStats() {
            return this.entity.stats;
        }

        getSpellList() {
            return this.entity.getSpellList();
        }

        isIncapacitated() {
            return this.entity.isIncapacitated();
        }

        dealDamage(amount : number, type : string) {
            return this.entity.dealDamage(amount, type);
        }

        getLevel() : number {
            return this.entity.getLevel();
        }

        getExperience() : number {
            return this.entity.getExperience();
        }

        addExperience(exp : number) {
            this.entity.addExperience(exp);
        }

        levelUp() {
            this.entity.levelUp();
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
                        var expectedDamage = BattleEvaluator.getAttackDamageDealt(self.hand, 10);
                        var damage = target.dealDamage(expectedDamage, "Slashing");
                        //console.log("Attack lands for ", damage);
                        action.output = self.getName() + " attacks " + target.getName() + " for " + damage + " damage!";
                    }
                    else {
                        //console.log("Attack misses!");
                        action.output = self.getName() + " attacks " + target.getName() + ", but misses!";
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
            var statConverted : any = Stat[stat];
            switch(statConverted) {
                case Stat.STRENGTH:
                    return this.strength;
                case Stat.DEXTERITY:
                    return this.dexterity;
                case Stat.CONSTITUTION:
                    return this.constitution;
                case Stat.INTELLIGENCE:
                    return this.intelligence;
                case Stat.LUCK:
                    return this.luck;
            }
            return -1;
        }

        setStat(stat : Stat, value : number) {
            var statConverted : any = Stat[stat];
            switch(statConverted) {
                case Stat.STRENGTH:
                    this.strength = value;
                    break;
                case Stat.DEXTERITY:
                    this.dexterity = value;
                    break;
                case Stat.CONSTITUTION:
                    this.constitution = value;
                    break;
                case Stat.INTELLIGENCE:
                    this.intelligence = value;
                    break;
                case Stat.LUCK:
                    this.luck = value;
                    break;
            }
        }

        getStatBonus(stat : Stat) {
            return Math.floor((this.getStat(stat) - 10) / 2);
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
            while (this.standing == false) {
                // Bust check.
                var currentValue = this.handEvaluator.evaluate(this.hand);
                if (currentValue <= 0) {
                    system.stand(this);
                }

                if (currentValue >= 17) {
                    system.stand(this);
                }
                else {
                    system.hit(this);
                }
            }
        }
    }
}
