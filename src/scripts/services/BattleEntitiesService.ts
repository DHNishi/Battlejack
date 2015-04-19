/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="../_all.ts"/>

module battlejack {
    export class BattleEntitiesService {
        entities : CPUEntityInBattle[];

        constructor() {
            this.entities = [];
        }

        clearEntities() {
            this.entities = [];
        }

        addEntity(entity : Entity) {
            var newEntity = new CPUEntityInBattle(entity, new Hand([]));
            this.entities.push(newEntity);
        }
    }
}
