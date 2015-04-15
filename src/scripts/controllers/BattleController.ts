/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="../_all.ts"/>

/* Fundamentally, a battle consists of a loop of several phases.

 1. Blackjack Draw phase.
 In the Blackjack phase, we deal() cards to all of the players.

 2. Aggregation of actions. Generate actions for all CPU players using an AI method. We'll have an AI decorator to be used with entities.
 We'll have an |isDone| variable on each entity. Every time a player selects an action for an entity, we check if everyone isDone. If not, do nothing.
 If everyone is done, we continue to the next phase.

 3. Blackjack play phase.
 We'll have an |isStanding| variable on each entity.
 Iterate over all human entities and have them do their hit/stand movements. Once everyone is standing or has busted, continue.
 Iterate over all CPU entities and have their AI do hit/stand movements. Once all CPUs are standing or have busted, continue.

 4. RPG actions take place.
 Sort the RPG actions first by priority and then by Entity agility.
 Iterate over every action in sorted order and activate() them.
 Each action has a list of targets which it iterates over and mutates appropriately.

 5. Check if we're done.
 This step may need to be repeated several times within the earlier phases, if action occurs.
 A side is dead if they're all incapacitated (i.e. <= 0 HP).
 A battle end service can clean everything up and we can then route to a different page and a different controller.

 */

module battlejack {
    export class BattleController {
        helloWorld : string;
        entities : EntityInBattle[];
        deck : Card[];
        private system : BattleSystem;

        constructor() {
            this.helloWorld = "Hello World";
            this.system = new BattleSystem([]);
            this.entities = this.system.entities;
            this.deck = this.system.getDeckForTesting();
        }

        deal() {
            this.system.initializeRound();
        }

        testAddEntity() {
            this.system.entities.push(new EntityInBattle(new Entity, new Hand([])));
        }

        gogogo() {
            if (this.system.readyToReconcileActions()) {
                this.system.reconcileActions();
                this.system.endOfRoundCleanUp();
            }
        }
    }

}
