/**
 * Created by dhnishi on 4/14/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    // Battle system contains a single battle with entities.
    export class BattleSystem {
        entities : EntityInBattle[];
        private deck : Card[];
        private roundActions : BattleAction[];
        private handEvaluator : HandEvaluator;
        deckService : DeckService;

        constructor(entities : EntityInBattle[]) {
            this.handEvaluator = new HandEvaluator();
            this.entities = entities;
            this.roundActions = [];
            this.deck = [];
            this.deckService = new DeckService();
        }

        initializeRound() {
            // Get a randomized deck.
            this.deck = this.deckService.buildDeck();
            this.blackjackDraw();
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

        reconcileActions() {
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
            var isDone = false;
            this.entities.forEach((entity) => {
                // TODO: Replace with incapacitated.
                // TODO: Make this check sides.
                console.log(entity.getStats().hp);
                if (entity.getStats().hp <= 0) {
                    isDone = true;
                }
            });
            return isDone;
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
