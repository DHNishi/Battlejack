/**
 * Created by dhnishi on 4/17/15.
 */
/// <reference path="../_all.ts"/>

module battlejack {
    export class CharacterCreationController {
        stats : StatView[];
        creator : CharacterCreator;
        character : Entity;
        name : string;
        playerService : PlayerEntityService;
        private spellService : SpellService;
        private $location;

        constructor(playerEntityService : PlayerEntityService, spellService : SpellService, $location) {
            // Iterate every the stat block.
            this.stats = [];
            this.creator = new CharacterCreator();
            this.playerService = playerEntityService;
            this.spellService = spellService;
            this.$location = $location;
            console.log(Stat);
            for (var val in Stat) {
                if (isNaN(val)) {
                    this.stats.push(new StatView(val, this.creator));
                }
            }
            this.name = "";
            console.log(this.stats);
        }

        incrementStat(statView : StatView) {
            //statView.value += 1;
            this.creator.incrementStat(statView.stat)
        }

        decrementStat(statView : StatView) {
            this.creator.decrementStat(statView.stat)
        }

        getPointsRemaining() {
            return this.creator.stats.statPoints;
        }

        createCharacter() {
            this.character = this.creator.createCharacter(this.name);
            this.playerService.addEntity(this.character);

            // TODO: remove.
            var action = new BattleAction;
            action.name = "Zip";
            action.priority = 0;
            action.mutateTargets = (targets : EntityInBattle[], self : EntityInBattle) => {
                console.log("NO!");
                action.output = "Zap!";
                console.log(action);
            };
            this.spellService.addSpell("Zap", new BattleActionFactory(action));

            this.reinitialize(new StatBlock());
        }

        save() {
            this.$location.path("/dialogue");
        }

        reinitialize(stats : StatBlock) {
            console.log("Reinitializing...");
            this.creator = new CharacterCreator(stats);
            this.stats = [];
            for (var val in Stat) {
                if (isNaN(val)) {
                    this.stats.push(new StatView(val, this.creator));
                }
            }
        }
    }

    class StatView {
        name : string;
        stat : Stat;
        creator : CharacterCreator;
        constructor (stat, creator) {
            this.stat = stat;
            this.name = StatBlock.getStatName(stat);
            this.creator = creator;
        }

        getStat() {
            console.log(this.stat, Stat[this.stat]);
            return this.creator.stats.getStat(this.stat);
        }
    }
}
