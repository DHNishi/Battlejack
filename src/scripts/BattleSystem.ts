/**
 * Created by dhnishi on 4/14/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    // Battle system contains a single battle with entities.
    export class BattleSystem {
        entities : EntityInBattle[];
        allies : EntityInBattle[];
        enemies : EntityInBattle[];
        private deck : Card[];
        private roundActions : BattleAction[];
        private handEvaluator : HandEvaluator;
        deckService : DeckService;

        nextAlly : EntityInBattle;
        isBlackjack : boolean;

        constructor(allies : EntityInBattle[], enemies : EntityInBattle[]) {
            this.handEvaluator = new HandEvaluator();
            this.allies = allies;
            this.enemies = enemies;
            this.entities = allies.concat(enemies);
            this.roundActions = [];
            this.deck = [];
            this.deckService = new DeckService();
        }

        initializeRound() {
            // Get a randomized deck.
            this.isBlackjack = false;
            this.deck = this.deckService.buildDeck();
            this.blackjackDraw();
            this.getNextAllyForAction();
        }

        private blackjackDraw() {
            this.entities.forEach((entity) => {
                entity.hand.add(this.deck.pop());
                entity.hand.add(this.deck.pop());
            });
        }

        enqueueAction(action : BattleAction) {
            this.roundActions.push(action);
        }

        hit(entity : EntityInBattle) {
            var handScore = this.handEvaluator.evaluate(entity.hand);
            if (handScore > 0 && handScore < 21 && !entity.standing) {
                entity.hand.add(this.deck.pop());
                return true;
            }
            return false;
        }

        stand(entity : EntityInBattle) {
            entity.standing = true;
        }

        readyToReconcileActions() {
            var isReady = true;
            this.entities.forEach((entity) => {
                if (entity.standing === false) {
                    isReady = false;
                }
            });
            return isReady;
        }

        reconcileAllActions() {
            // Sort actions -- highest priorities go first.
            this.roundActions.sort((a : BattleAction, b : BattleAction) => {
                var aKey = a.priority;
                var bKey = b.priority;
                if (aKey > bKey) {
                    return -1;
                }
                else if (aKey < bKey) {
                    return 1;
                }
                // TODO: Check agility in here.
                return 0;
            });
            console.log(this.roundActions);

            // Apply all actions.
            this.roundActions.forEach((action : BattleAction) => {
               action.mutateTargets(action.targets, action.entity);
            });
        }

        endOfRoundCleanUp() {
            this.entities.forEach((entity) => {
                entity.resetForRound();
            });
            this.roundActions = [];
        }

        isBattleOver() {
            var alliesDead = true;
            this.allies.forEach((entity) => {
                if (entity.getStats().hp > 0) {
                    alliesDead = false;
                }
            });
            if (alliesDead == true) {
                return true;
            }

            var enemiesDead = true;
            this.enemies.forEach((entity) => {
                if (entity.getStats().hp > 0) {
                    enemiesDead = false;
                }
            });
            return enemiesDead;
        }

        /**
         * Battle flow functions below.
         */

        getNextAllyForAction() {
            var nextAlly = undefined;
            this.allies.forEach(entity => {
                if (entity.ready !== true) {
                    nextAlly = entity;
                }
            });
            this.nextAlly = nextAlly;
        }

        getNextAllyForBlackjack() {
            var nextAlly = undefined;
            this.allies.forEach(entity => {
                if (entity.standing !== true) {
                    nextAlly = entity;
                }
            });
            this.nextAlly = nextAlly;
        }

        hitSelected() {
            this.hit(this.nextAlly);
        }

        standSelected() {
            this.stand(this.nextAlly);
            this.getNextAllyForBlackjack();
            if (typeof this.nextAlly == "undefined") {
                this.reconcileAllActions();
                this.endOfRoundCleanUp();
                this.initializeRound();
                this.isBlackjack = false;
            }
        }

        /**
         * TESTING FUNCTIONS BELOW
         */

        getDeckForTesting() {
            return this.deck;
        }

        setDeckServiceForTesting(newDeck : DeckService) {
            this.deckService = newDeck;
        }
    }
}
