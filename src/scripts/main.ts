/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    var app = angular.module('blackjackApp', [])
        .service('deckService', DeckService)
        .service('battleEntitiesService', BattleEntitiesService)
        .controller("BattleController", ["battleEntitiesService", "deckService", BattleController]);
}
