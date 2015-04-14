/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../scripts/Card.ts"/>
/// <reference path="../scripts/Hand.ts"/>
/// <reference path="../scripts/Entity.ts"/>
module battlejack {
    describe("Entity", () => {
        it("Entity Constructors", () => {
            var entity = new Entity;
            expect(entity.stats).toEqual(new StatBlock);
            expect(entity.getAC()).toEqual(StatBlock.BASE_STAT);
            expect(entity.getAttackBonus()).toEqual(0);
        });

        it("EntityWithHand", () => {
            var firstCard = new Card(Suit.CLUBS, Rank.EIGHT);
            var secondCard = new Card(Suit.DIAMONDS, Rank.KING);
            var testHand = new Hand([firstCard, secondCard]);
            var entity = new Entity;

            var entityInBattle = new EntityInBattle(entity, testHand);
            expect(entityInBattle.getAC()).toEqual(StatBlock.BASE_STAT);
            expect(entityInBattle.getAttackBonus()).toEqual(0);
        });

    });

}
