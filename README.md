# Battlejack
A turn-based RPG adventure where you battle foes with Blackjack!

# How do battles work?

Battles occur in two phases -- the RPG phase and the Blackjack phase.

1. Select RPG actions.
2. Cards are dealt.
3. Blackjack actions are taken and reconciled.
4. Blackjack phase begins.
5. RPG actions are reconciled.
6. If both sides are both alive/haven't run away, loop to 1.

## The RPG Phase

Combatants in the battle select actions and targets during this phase.
It is very much like a turn-based classic JRPG where the characters choose their actions before the turn. 

## The Blackjack Phase

The initial cards are dealt to all of the players from a standard 52-card deck of cards.
Every combatant receives two cards, one face-up and one face-down.

At this point, every character then can optionally select a "Blackjack Action" to take for a turn.
A "Blackjack Action" is an action which takes place during the Blackjack phase and typically manipulates the cards of either the caster or other enemy combatants.

Once everyone has selected a Blackjack action, they then activate on the battlefield, manipulating everyone's cards.

At this point, everyone now begins the standard Blackjack actions of deciding to Hit or Stand. Once everyone has either hit 21, busted, or has selected the "Stand" action, this phase ends.

## RPG Action Reconciliation

Using the value of the hands, the RPG actions are reconciled. Attacks have their damages calculated, spells have their healing/damages/status effects calculated, etc, etc. These take place and change the battlefield.

## Loop

This continues until one side has either died or fled.