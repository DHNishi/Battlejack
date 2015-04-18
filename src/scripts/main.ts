/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    var app = angular.module('blackjackApp', ['ngRoute'])
        .service('deckService', DeckService)
        .service('battleEntitiesService', BattleEntitiesService)
        .controller("BattleController", ["battleEntitiesService", "deckService", BattleController])
        .controller("CharacterCreationController", [CharacterCreationController])
        .config(['$routeProvider', ($routeProvider) => {
            $routeProvider.
                when('/battle', {
                    templateUrl: 'partials/battle.html'
                }).
                when('/character-creation', {
                    templateUrl: "partials/character-creation.html"
                }).
                otherwise({
                    redirectTo: '/battle'
                })
        }]);
}
