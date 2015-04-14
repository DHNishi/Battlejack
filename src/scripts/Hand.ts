/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    export class Hand {
        cards : Card[];

        constructor(cards : Card[]) {
            this.cards = cards;
        }

        add(card : Card) {
            this.cards.push(card);
        }

        clear() {
            this.cards = [];
        }
    }
}
