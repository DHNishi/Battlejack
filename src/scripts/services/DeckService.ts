/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="../_all.ts"/>
module battlejack {
    export class DeckService {
        protected generateDeck() {
            var deck = [];
            var TWO = Rank.TWO.valueOf();

            for (var suit in Suit) {
                for (var rank in Rank) {
                    if (typeof Suit[suit] === "number" && typeof Rank[rank] === "number") {
                        // Ignore invalid cards.
                        if (parseInt(Rank[rank]) >= TWO) {
                            deck.push(new Card(Suit[suit], Rank[rank]));
                        }
                    }
                }
            }
            return deck;
        }

        buildDeck() {
            var deck : Card[] = this.generateDeck();
            var count = deck.length;

            while (count > 0) {
                // Select a random card.
                var index = Math.floor(Math.random() * count);
                count--;

                // Put it at the end.
                var temp = deck[count];
                deck[count] = deck[index];
                deck[index] = temp;
            }
            return deck;
        }
    }

}
