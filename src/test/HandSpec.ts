/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

/// <reference path="../scripts/Card.ts"/>
/// <reference path="../scripts/Hand.ts"/>

module battlejack {
    describe("Hand", () => {
        it("Hand Constructors", () => {
            // Empty constructor
            var testHand = new Hand([]);
            expect(testHand.cards).toEqual([]);

            // With cards
            var firstCard = new Card(Suit.CLUBS, Rank.EIGHT);
            var secondCard = new Card(Suit.DIAMONDS, Rank.KING);
            testHand = new Hand([firstCard, secondCard]);
            expect(testHand.cards).toEqual([firstCard, secondCard]);
        });

        it("Add card to hand", () => {
            // Add to empty.
            var testHand = new Hand([]);
            var firstCard = new Card(Suit.CLUBS, Rank.EIGHT);
            testHand.add(firstCard);
            expect(testHand.cards).toEqual([firstCard]);
            testHand.add(firstCard);
            expect(testHand.cards).toEqual([firstCard, firstCard]);

            // Add to existing hand.
            var secondCard = new Card(Suit.DIAMONDS, Rank.KING);
            testHand = new Hand([firstCard, secondCard]);
            testHand.add(firstCard);
            expect(testHand.cards).toEqual([firstCard, secondCard, firstCard]);
        });
    });
}
