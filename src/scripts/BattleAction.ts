/**
 * Created by dhnishi on 4/14/15.
 */

/// <reference path="_all.ts"/>

module battlejack {

    export enum ValidTargets {
        SELF,
        ENEMY,
        ALLY,
        ALL_ENEMIES,
        ALL_ALLIES
    }

    /**
     * A BattleAction defines an attacker, the targets of the attack, and a function which mutates them appropriately.
     * This encapsulates the entire action of attacking.
     */
    export class BattleAction {
        name : string;
        entity : EntityInBattle;
        targets : EntityInBattle[];
        otherValidTargets : EntityInBattle[];
        priority : number;
        output : string;
        // TODO: We probably should inject a logger into here to allow us to log out the battle text.

        canBeUsed(entity : EntityInBattle) {
            return true;
        }
        mutateTargets : (targets : EntityInBattle[], entity : EntityInBattle) => void;
    }

    export class SpellAction extends BattleAction {
        mp_consumed : number;

        constructor(mp_consumed : number) {
            super();
            this.mp_consumed = mp_consumed;
        }

        canBeUsed(entity : EntityInBattle) {
            return (entity.getStats().mp >= this.mp_consumed);
        }
    }

    export class BattleActionFactory {
        prototype : BattleAction;
        constructor(prototype : BattleAction) {
            this.prototype = prototype;
        }

        getAction(targets : EntityInBattle[], entity : EntityInBattle) {
            var action = this.copyObject(this.prototype);
            action.entity = entity;
            action.targets = targets;
            return action;
        }

        getActionName() {
            return this.prototype.name;
        }

        private copyObject<T> (object:T): T {
            var objectCopy = <T>{};

            for (var key in object)
            {
                if (object.hasOwnProperty(key))
                {
                    objectCopy[key] = object[key];
                }
            }

            return objectCopy;
        }
    }
}