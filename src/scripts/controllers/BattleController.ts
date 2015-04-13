/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="../../../typings/angularjs/angular.d.ts"/>

/// <reference path="../services/BattleEntitiesService.ts"/>
/// <reference path="../services/DeckService.ts"/>
/// <reference path="../Card.ts"/>
/// <reference path="../Entity.ts"/>
/// <reference path="../HandEvaluator.ts"/>
/// <reference path="../main.ts"/>

app.controller("BattleController", ["battleEntitiesService", "deckService", BattleController]
);

function BattleController(battleEntitiesService, deckService) {
    var battleCtrl = this;
    var handEvaluator = new HandEvaluator();

    battleCtrl.helloWorld = "Hello World";
    battleCtrl.entities = battleEntitiesService.entities;

    battleEntitiesService.addEntity(new Entity());
    battleCtrl.deck = deckService.buildDeck();

    battleCtrl.hit = (entity : EntityInBattle) => {
        var handScore = handEvaluator.evaluate(entity.hand);
        if (handScore > 0 && handScore < 21 && !entity.standing) {
            entity.hand.add(battleCtrl.deck.pop());
            return true;
        }
        return false;
    };

    battleCtrl.stand = (entity : EntityInBattle) => {
        entity.standing = true;

        // Check if everyone has stood yet -- if so, let's continue.
        var allStanding = true;
        battleCtrl.entities.forEach((entity : EntityInBattle) => {
            if (!entity.standing) {
                allStanding = false;;
            }
        });

        if (!allStanding) {
            return;
        }

        finishRound();
    };

    battleCtrl.deal = () => {
        battleCtrl.deck = deckService.buildDeck();
        battleCtrl.entities.forEach((entity : EntityInBattle) => {
            // TODO: Add error checking for all deck pops.
            entity.hand.clear();
            entity.standing = false;
            entity.hand.add(battleCtrl.deck.pop());
            entity.hand.add(battleCtrl.deck.pop());
        });
    };

    battleCtrl.testAddEntity = () => {
        battleEntitiesService.addEntity(new Entity());
    };

    battleCtrl.getScore = (entity : EntityInBattle) => {
        return handEvaluator.evaluate(entity.hand);
    };

    var finishRound = () => {
        var maxHandScore = -1;
        var maxEntity;
        battleCtrl.entities.forEach((entity : EntityInBattle) => {
            var handScore = handEvaluator.evaluate(entity.hand);
            if (handScore > maxHandScore) {
                maxHandScore = handScore;
                maxEntity = entity;
            }
        });
        console.log(maxEntity, " wins!");
        battleCtrl.deal();
    };
}
