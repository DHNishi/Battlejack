/**
 * Created by dhnishi on 4/25/15.
 */
/// <reference path="../_all.ts"/>

module battlejack {
    export class SpellService {
        spells;

        constructor() {
            this.spells = {};
        }

        addSpell(spellName : string, action : BattleActionFactory) {
            this.spells[spellName] = action;
            console.log("Game Spells:", this.spells);
        }

        getSpell(spellName : string) {
            return this.spells[spellName];
        }
    }
}