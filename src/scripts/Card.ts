/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    export enum Suit {
        SPADES,
        HEARTS,
        DIAMONDS,
        CLUBS
    }

    export enum Rank {
        ZERO_UNUSED,
        ONE_UNUSED,
        TWO,
        THREE,
        FOUR,
        FIVE,
        SIX,
        SEVEN,
        EIGHT,
        NINE,
        TEN,
        JACK,
        QUEEN,
        KING,
        ACE
    }


    export class Card {
        suit : Suit;
        rank : Rank;

        /**
         * Constructs a new card with a given suit and rank.
         * @param {Suit} suit The suit of the card.
         * @param {Rank} rank The rank of the card.
         */
        constructor(suit, rank) {
            this.suit = suit;
            this.rank = rank;
        }

        /**
         * Compatator for a card.
         * @param {Card} a First card to compare.
         * @param {Card} b Second card to compare.
         * @returns {number}
         */
        static compareTo(a : Card, b : Card) {
            if (a.rank > b.rank) {
                return 1;
            }
            if (a.rank < b.rank) {
                return -1;
            }
            return 0;
        }
    }
}
