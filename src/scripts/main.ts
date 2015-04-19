/**
 * Created by dhnishi on 4/12/15.
 */

/// <reference path="_all.ts"/>

module battlejack {
    var app = angular.module('blackjackApp', ['ngRoute'])
        .service('deckService', DeckService)
        .service('battleEntitiesService', BattleEntitiesService)
        .service("playerEntityService", PlayerEntityService)
        .controller("ArenaMenuController", ["battleEntitiesService", "playerEntityService", "$location", ArenaMenuController])
        .controller("BattleController", ["battleEntitiesService", "playerEntityService", "deckService", BattleController])
        .controller("CharacterCreationController", ["playerEntityService", CharacterCreationController])
        .config(['$routeProvider', ($routeProvider) => {
            $routeProvider.
                when('/battle', {
                    templateUrl: 'partials/battle.html'
                }).
                when('/character-creation', {
                    templateUrl: "partials/character-creation.html"
                }).
                when('/dialogue', {
                    templateUrl: "partials/dialogue.html"
                }).
                otherwise({
                    redirectTo: '/character-creation'
                })
        }]);
}
