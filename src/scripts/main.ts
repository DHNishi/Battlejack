/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    var app = angular.module('blackjackApp', [])
        .factory('deckService', makeDeckService)
        .factory('battleEntitiesService', makeBattleEntitiesService)
        .controller("BattleController", ["battleEntitiesService", "deckService", BattleController]);
}
