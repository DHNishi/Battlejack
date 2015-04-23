/**
 * Created by dhnishi on 4/17/15.
 */
/// <reference path="_all.ts"/>

module battlejack {
    export class CharacterCreator {
        stats : StatBlock;
        pointsRemaining : number;
        CHARACTER_CREATION_POINTS = 32;
        POINT_BUY_COSTS = {
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 2,
            14: 2,
            15: 3,
            16: 3,
            17: 4,
            18: 4
        };
        MIN_STAT = 8;
        MAX_STAT = 18;

        constructor() {
            this.stats = new StatBlock();
            this.pointsRemaining = this.CHARACTER_CREATION_POINTS;
        }

        incrementStat(stat : Stat) {
            var currentValue = this.stats.getStat(stat);
            var cost = this.POINT_BUY_COSTS[currentValue];

            if (cost > this.pointsRemaining) {
                return;
            }
            if (currentValue >= this.MAX_STAT) {
                return;
            }
            this.pointsRemaining -= cost;
            this.stats.setStat(stat, currentValue + 1);
        }

        decrementStat(stat : Stat) {
            var currentValue = this.stats.getStat(stat);
            if (currentValue <= this.MIN_STAT) {
                return;
            }
            this.pointsRemaining += this.POINT_BUY_COSTS[currentValue - 1];
            this.stats.setStat(stat, currentValue - 1);
        }

        createCharacter(name : string) {
            var newEntity = new Entity(name);
            newEntity.stats = this.stats;

            // TODO: remove.
            var action = new BattleAction;
            action.name = "zip";
            action.priority = 0;
            action.mutateTargets = (targets : EntityInBattle[], self : EntityInBattle) => {
                console.log("NO!");
                action.output = "Zap!";
                console.log(action);
            };
            newEntity.getSpellList().push(new BattleActionFactory(new SpellAction(action, 0)));
            return newEntity;
        }
    }
}