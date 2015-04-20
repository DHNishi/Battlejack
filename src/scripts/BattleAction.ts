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
        entity : EntityInBattle;
        targets : EntityInBattle[];
        otherValidTargets : EntityInBattle[];
        priority : number;
        output : string;
        // TODO: We probably should inject a logger into here to allow us to log out the battle text.

        mutateTargets : (targets : EntityInBattle[], entity : EntityInBattle) => void;
    }
}