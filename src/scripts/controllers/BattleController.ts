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
        isBlackjack : boolean;
        chooseSpell : boolean;
        private system : BattleSystem;
        private onEntitySelected;
        private log : ConsoleOutputService;
        private $location;
        private spellService : SpellService;
        private endBattleService : EndBattleService;

        constructor($location, battleEntitiesService : BattleEntitiesService,
                    playerEntityService : PlayerEntityService,
                    deckService : DeckService,
                    log : ConsoleOutputService,
                    spellService : SpellService,
                    endBattleService : EndBattleService) {
            this.helloWorld = "Hello World";
            // TODO: Maybe move this initialization aspect into the services.
            this.system = new BattleSystem(playerEntityService.entities.map((entity) => {return new EntityInBattle(entity, new Hand([]))}), battleEntitiesService.entities);
            this.entities = this.system.entities;
            this.deck = this.system.getDeckForTesting();
            this.isBlackjack = false;
            this.chooseSpell = false;
            this.log = log;
            this.$location = $location;
            this.spellService = spellService;
            this.endBattleService = endBattleService;
            this.system.initializeRound();
        }

        deal() {
            this.system.initializeRound();
        }

        clickedEntity(entity) {
            console.log(entity);
            this.onEntitySelected(entity);
            this.onEntitySelected = undefined;
        }

        getCurrentEntity() {
            return this.system.nextAlly;
        }

        doOneAction() {
            var output = this.system.reconcileOneAction();
            if (typeof output != "undefined") {
                this.log.push(output);
            } else {
                this.log.clear();
            }
            // Check for battle over.

            if (this.system.isBattleOver()) {
                // Go to the battle over handler!
                this.endBattleService.finishBattle();
                this.$location.path("/dialogue")
            }
        }

        /*
            ACTION SELECTORS
         */

        /**
         * Sets up everything to be good on selection.
         */
        allyAttack() {
            // TODO: We need to change the selection method to check if we even need a selection.
            // We can get this information from the battle system if we've selected an attack that needs a target.
            // We need to add that variable to the battle system and check it here.
            // The controller's responsibility is to pass the required targets based upon the target type.
            // The battle system's responsibility is to figure out what sort of targets are needed for the request.
            // The action's responsibility is to construct itself given a target list.
            this.onEntitySelected = entity => {
                var currentEntity = this.getCurrentEntity();
                this.system.enqueueAction(currentEntity.attack(entity));
                currentEntity.ready = true;
                this.system.getNextAllyForAction();
                // If we're out of allies, need to continue.
                if (typeof this.getCurrentEntity() == "undefined") {
                    // Begin Blackjack phase.
                    console.log("BLACKJACK");
                    this.system.isBlackjack = true;
                    this.system.getNextAllyForBlackjack();
                }
            }
        }

        allyHit() {
            this.system.hitSelected();
        }

        allyStand() {
            this.system.standSelected();
            if (this.system.isReady) {
                this.doOneAction();
            }
            console.log(this.system.isReady);
        }

        allySpell() {
            this.chooseSpell = true;
        }

        selectSpell(spellName : string) {
            console.log("Selected ", spellName);
            this.chooseSpell = false;
            this.onEntitySelected = entity => {
                var currentEntity = this.getCurrentEntity();
                var spell = this.spellService.getSpell(spellName);
                this.system.enqueueAction(spell.getAction([entity], currentEntity));
                currentEntity.ready = true;
                this.system.getNextAllyForAction();
                // If we're out of allies, need to continue.
                if (typeof this.getCurrentEntity() == "undefined") {
                    // Begin Blackjack phase.
                    console.log("BLACKJACK");
                    this.system.isBlackjack = true;
                    this.system.getNextAllyForBlackjack();
                }
            }
        }

        testAddEntity() {
            this.system.entities.push(new EntityInBattle(new Entity, new Hand([])));
        }

        testAddAlly() {
            var newAlly = new EntityInBattle(new Entity, new Hand([]));
            this.system.allies.push(newAlly);
            this.system.entities.push(newAlly);
        }

        testAddEnemy() {
            var newEnemy = new CPUEntityInBattle(new Entity, new Hand([]));
            this.system.enemies.push(newEnemy);
            this.system.entities.push(newEnemy);
        }

        gogogo() {
            if (this.system.readyToReconcileActions()) {
                this.system.reconcileAllActions();
                this.system.endOfRoundCleanUp();
            }
        }

        isOver() {
            return this.system.isBattleOver();
        }
    }

}
