/**
 * Created by dhnishi on 4/19/15.
 */

/// <reference path="../_all.ts"/>

module battlejack {
    export class ConsoleOutputService {
        messages : string[];

        constructor() {
            this.messages = [];
        }

        getLastMessages(n : number) {
            return this.messages.slice(n * -1);
        }

        push(message : string) {
            this.messages.push(message);
            console.log(message);
        }

        clear() {
            this.messages = [];
        }
    }
}