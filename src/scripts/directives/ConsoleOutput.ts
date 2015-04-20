/**
 * Created by dhnishi on 4/19/15.
 */
/// <reference path="../_all.ts"/>

module battlejack {
    export function ConsoleOutputDirective(consoleOutputService : ConsoleOutputService) {
        return {
            template: "<div class='console-message fade-in'></div>",
            scope: {
            },
            link : ($scope, $elem, attrs) => {
                $scope.$watch(() => {
                    console.log(consoleOutputService.messages, consoleOutputService.getLastMessages(1));
                    return consoleOutputService.getLastMessages(1)[0];
                },
                (n, v) => {
                    console.log("Stuff changed.");
                    $scope.lastMessage = n;
                    var message = angular.element(".console-message");
                    message.html("<div class='fade-in'>" + $scope.lastMessage + "</div>");
                })
            }
        }
    }
}