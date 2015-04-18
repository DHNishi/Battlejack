/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../scripts/_all.ts"/>

module battlejack {
    class FakeDeckService extends DeckService {
        cards : Card[];

        constructor(cards : Card[]) {
            super();
            this.cards = cards;
        }

        buildDeck() {
            return this.cards;
        }
    }

    class FakeAction extends BattleAction {
        hasGone : boolean;
        goesAfter : FakeAction;

        constructor(goesAfter? : FakeAction) {
            super();
            this.goesAfter = goesAfter;
            this.hasGone = false;
            this.mutateTargets = (targets : EntityInBattle[], entity : EntityInBattle) => {
                // Don't trigger a fake action twice.
                if (this.hasGone) {
                    fail();
                }

                // Fake actions go in correct order.
                if (typeof this.goesAfter !== "undefined"){
                    expect(this.goesAfter.hasGone).toBe(true);
                }

                this.hasGone = true;
            }
        }
    }

    describe("Battle System", () => {
        var entities : EntityInBattle[];
        var battleSystem : BattleSystem;

        beforeEach(() => {
            entities = [
                new EntityInBattle(new Entity, new Hand([])),
                new EntityInBattle(new Entity, new Hand([])),
                new EntityInBattle(new Entity, new Hand([])),
                new EntityInBattle(new Entity, new Hand([]))
            ];

            battleSystem = new BattleSystem(entities, []);
        });
        it("Battle system constructs properly.", () => {
            expect(battleSystem.allies).toEqual(entities);
        });

        it("Battle system begins each round with a fresh deck and dealt cards", () => {
            expect(battleSystem.getDeckForTesting()).toEqual([]);
            battleSystem.initializeRound();

            expect(battleSystem.getDeckForTesting().length).toBeGreaterThan(0);
            entities.forEach((entity) => {
                expect(entity.hand.cards.length).toBe(2);
            });
        });

        it("Battle system has functional Blackjack mechanics", () => {
            // Generate a deck of all 2s.
            var fakeDeck : Card[] = [];
            fakeDeck.push(new Card(Suit.CLUBS, Rank.TWO));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.TWO));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.ACE));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));
            fakeDeck.push(new Card(Suit.CLUBS, Rank.KING));

            battleSystem.setDeckServiceForTesting(new FakeDeckService(fakeDeck));
            battleSystem.initializeRound();

            var handEvaluator : HandEvaluator = new HandEvaluator();
            entities.forEach((entity) => {
                expect(entity.hand.cards.length).toBe(2);
                expect(handEvaluator.evaluate(entity.hand)).toBe(20);
            });

            // Ensure that I can't hit beyond 21.
            expect(battleSystem.hit(entities[0])).toBe(true);
            expect(handEvaluator.evaluate(entities[0].hand)).toBe(21);
            expect(battleSystem.hit(entities[0])).toBe(false);
            expect(handEvaluator.evaluate(entities[0].hand)).toBe(21);
            battleSystem.stand(entities[0]);
            expect(battleSystem.readyToReconcileActions()).toBe(false);

            // Check for bust.
            expect(battleSystem.hit(entities[1])).toBe(true);
            expect(handEvaluator.evaluate(entities[1].hand)).toBe(0);
            expect(battleSystem.hit(entities[1])).toBe(false);
            battleSystem.stand(entities[1]);
            expect(battleSystem.readyToReconcileActions()).toBe(false);

            // Stand everyone else should mean done with round.
            battleSystem.stand(entities[2]);
            battleSystem.stand(entities[3]);
            expect(battleSystem.readyToReconcileActions()).toBe(true);
        });

        it("Battle system reconciles actions in priority order", () => {
            var lastAction = new FakeAction(tiedForFirst);
            lastAction.priority = -1;
            var tiedForFirst = new FakeAction(firstAction);
            tiedForFirst.priority = 0;
            var firstAction = new FakeAction(secondAction);
            firstAction.priority = 0;
            var secondAction = new FakeAction(thirdAction);
            firstAction.priority = 1;
            var thirdAction = new FakeAction();
            firstAction.priority = 2;

            battleSystem.enqueueAction(secondAction);
            battleSystem.enqueueAction(lastAction);
            battleSystem.enqueueAction(firstAction);
            battleSystem.enqueueAction(tiedForFirst);
            battleSystem.enqueueAction(thirdAction);
            battleSystem.reconcileAllActions();
        });

        it("Battle system cleans all hands and actions at end of round", () => {
            // Initialize round and hand out cards.
            battleSystem.initializeRound();

            // Add an action.
            battleSystem.enqueueAction(new FakeAction());
            battleSystem.reconcileAllActions();

            battleSystem.endOfRoundCleanUp();
            entities.forEach((entity) => {
                expect(entity.hand.cards.length).toBe(0);
            });

            // If the FakeAction was unqueued, this shouldn't fail.
            battleSystem.reconcileAllActions();
        });

        // TODO: Change this to be real.
        it("Battle system ends if one side is dead.", () => {
            battleSystem.enemies.push(new CPUEntityInBattle(new Entity, new Hand([])));
            expect(battleSystem.isBattleOver()).toBe(false);
            entities.forEach(entity => {
              entity.getStats().hp = 0;
            });
            expect(battleSystem.isBattleOver()).toBe(true);
        });
    });
}

