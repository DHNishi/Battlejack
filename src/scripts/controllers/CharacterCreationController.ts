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
        private playerService : PlayerEntityService;

        constructor(playerEntityService : PlayerEntityService) {
            // Iterate every the stat block.
            this.stats = [];
            this.creator = new CharacterCreator();
            this.playerService = playerEntityService;
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
            return this.creator.pointsRemaining;
        }

        createCharacter() {
            this.character = this.creator.createCharacter(this.name);
            this.playerService.addEntity(this.character);
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
            return this.creator.stats.getStat(this.stat);
        }
    }
}
