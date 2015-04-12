/**
 * Created by dhnishi on 4/11/15.
 */

/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="Card.ts"/>
/// <reference path="Hand.ts"/>

class HandEvaluator {

    BLACKJACK = 21;

    /**
     * Scores a Blackjack hand.
     * @param {Hand} hand A hand to evaluate.
     * @returns {number} The value of the hand from 2 to 21. If the value is 0, the hand was a bust.
     */
    evaluate(hand : Hand) {
        var sum = this.blackjackSumHand(hand);

        // Bust check.
        if (sum > this.BLACKJACK) {
            return 0;
        }

        return sum;
    }

    /**
     * Sums all of the cards in the hand in the optimal fashion.
     * @param hand A hand to evaluate.
     * @returns {number} The sum of the hand.
     */
    blackjackSumHand(hand : Hand) {
        var sum = 0;
        // Sort a copy of the list before evaluating to not mutate the parent.
        hand.cards.slice().sort(Card.compareTo).forEach((card) => {
            var cardValue;
            switch(card.rank) {
                case Rank.JACK:
                case Rank.QUEEN:
                case Rank.KING:
                    cardValue = 10;
                    break;
                case Rank.ACE:
                    cardValue = 11;

                    // Only use lower value of ace when needed.
                    if ((sum + cardValue) > this.BLACKJACK) {
                        cardValue = 1
                    }
                    break;
                default:
                    cardValue = card.rank;
            }

            sum += cardValue;
        });

        return sum;
    }
}