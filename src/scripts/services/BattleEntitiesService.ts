/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="../_all.ts"/>

module battlejack {


    export function makeBattleEntitiesService() {
        console.log("service made");
        // TODO: Maybe turn this into its own class?
        var service : any = {};

        // We store the entities in the service itself.
        service.entities = [];

        service.clearEntities = () => {
            service.entities = [];
        };

        // Adds a new entity in battle mode.
        service.addEntity = (entity : Entity) => {
            var newEntity = new EntityInBattle(entity, new Hand([]));
            service.entities.push(newEntity);
        };

        return service;
    }

}
