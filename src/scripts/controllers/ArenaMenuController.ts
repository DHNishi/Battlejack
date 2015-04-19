/**
 * Created by dhnishi on 4/19/15.
 */
/// <reference path="../_all.ts"/>

module battlejack {
    export class ArenaMenuController {
        private battleEntitiesService : BattleEntitiesService;
        private playerEntityService : PlayerEntityService;
        private $location;

        constructor(battleEntitiesService : BattleEntitiesService, playerEntityService : PlayerEntityService, location) {
            this.battleEntitiesService = battleEntitiesService;
            this.playerEntityService = playerEntityService;
            this.$location = location;
        }

        startBattle() {
            var battleFactory = new ArenaBattleFactory();
            this.battleEntitiesService.entities = battleFactory.generateBattle(0);
            this.$location.path("/battle");
        }
    }
}