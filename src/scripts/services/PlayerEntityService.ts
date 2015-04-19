/**
 * Created by dhnishi on 4/18/15.
 */

/// <reference path="../_all.ts"/>

module battlejack {
    export class PlayerEntityService {
        entities : Entity[];

        constructor() {
            this.entities = [];
        }

        addEntity(entity : Entity) {
            this.entities.push(entity);
            console.log("PlayerEntityService", this.entities);
        }
    }
}