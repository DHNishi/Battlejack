/**
 * Created by dhnishi on 4/11/15.
 */

/// <reference path="Card.ts"/>

class Hand {
    cards : Card[];

    constructor(cards : Card[]) {
        this.cards = cards;
    }

    add(card : Card) {
        this.cards.push(card);
    }
}