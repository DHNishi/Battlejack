/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

/// <reference path="../scripts/Card.ts"/>

describe("Card", () => {
    it("Card Constructed with Suit and Rank", () => {
        var aceSpades = new Card(Suit.SPADES, Rank.ACE);
        expect(aceSpades.suit).toBe(Suit.SPADES);
        expect(aceSpades.rank).toBe(Rank.ACE);
    });
});
