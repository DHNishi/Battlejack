/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../scripts/Card.ts"/>
/// <reference path="../scripts/Hand.ts"/>
/// <reference path="../scripts/Entity.ts"/>
/// <reference path="../scripts/BattleEvaluator.ts"/>
module battlejack {
    describe("Entity", () => {
        it("Does attack hit?", () => {
            var baseEntity = new Entity;
            var attackerHand = new Hand([new Card(Suit.CLUBS, Rank.EIGHT),
                new Card(Suit.DIAMONDS, Rank.KING)]);
            var defenderHand = new Hand([new Card(Suit.CLUBS, Rank.EIGHT),
                new Card(Suit.DIAMONDS, Rank.KING)]);

            // Defender wins on tie.
            var attacker = new EntityInBattle(baseEntity, attackerHand);
            var defender = new EntityInBattle(baseEntity, defenderHand);
            expect(BattleEvaluator.doesAttackHit(attacker, defender)).toEqual(false);

            // Attacker wins on attack > defense.
            var defenderHand = new Hand([new Card(Suit.CLUBS, Rank.SEVEN),
                new Card(Suit.DIAMONDS, Rank.KING)]);
            defender = new EntityInBattle(baseEntity, defenderHand);
            expect(BattleEvaluator.doesAttackHit(attacker, defender)).toEqual(true);

            // Defender wins on defense > attack.
            var defenderHand = new Hand([new Card(Suit.CLUBS, Rank.NINE),
                new Card(Suit.DIAMONDS, Rank.KING)]);
            defender = new EntityInBattle(baseEntity, defenderHand);
            expect(BattleEvaluator.doesAttackHit(attacker, defender)).toEqual(false);
        });


        it("Attack damage calculations.", () => {
            var noHand = new Hand([]);
            expect(BattleEvaluator.getAttackDamageDealt(noHand, 100)).toEqual(0);

            var eighteenHand = new Hand([new Card(Suit.CLUBS, Rank.EIGHT),
                new Card(Suit.DIAMONDS, Rank.KING)]);
            expect(BattleEvaluator.getAttackDamageDealt(eighteenHand, 100)).toEqual(85);

            var blackjackHand = new Hand([new Card(Suit.CLUBS, Rank.ACE),
                new Card(Suit.DIAMONDS, Rank.KING)]);
            expect(BattleEvaluator.getAttackDamageDealt(blackjackHand, 100)).toEqual(100);
        });
    });

}
