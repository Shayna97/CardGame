// Deck Of Cards module

(function() {
  angular.module('DeckOfCards', []);
  
  // just one thing in our module.  a factory to instantiate Deck objects
  angular
    .module('DeckOfCards')
    .factory('deckFactory', deckFactory);
  
  // use $sce to mark html trusted for displaying suit icons
  deckFactory.$inject = ['$sce'];
  
  function deckFactory ($sce) {
    
    // array to keep track of card suits
    var suits = [{
      name: 'Clubs',
      color: 'black',
      glyph: $sce.trustAsHtml('&#x2663;')
    }, {
      name: 'Spades',
      color: 'black',
      glyph: $sce.trustAsHtml('&#x2660;')
    }, {
      name: 'Hearts',
      color: 'red',
      glyph: $sce.trustAsHtml('&#x2665;')
    }, {
      name: 'Diamonds',
      color: 'red',
      glyph: $sce.trustAsHtml('&#x2666;')
    }];
    
    // the card object
    function Card(suit, letter, name) {
      return {
        suit: suit,
        letter: letter,
        name: name || letter,
        displayName: (name || letter) + ' of ' + suit.name
      };
    }
    
    // the deck object
    function Deck() {
      // our public interface called "deck"
      var deck = {};
      // where to find the array of cards
      deck.cards = [];
      // expose operations publicly by attaching to deck
      deck.shuffle = shuffle;
      deck.dealOneCard = dealOneCard;
      deck.cut = cut;
      deck.cutInPlace = cutInPlace;
      deck.reset = reset;
      deck.reset();
      
      // helper function to generate a randmon int between a min and max
      function randomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
      }
      
      // function that cuts the cards and returns a top and bottom pile
      function cut(cards) {
        if (!cards || !cards.length) {
          return {
            top: [],
            bottom: []
          };
        } else if (cards.length === 1) {
          return {
            top: [cards[0]],
            bottom: []
          };
        } else {
          // find the middle, with a random variance of +/- 6
          var middle = Math.floor(cards.length / 2);
          var variance = randomInt(0, 12) - 6;
          middle += variance;
          middle = Math.max(middle, 1);
          return {
            top: cards.slice(0, middle),
            bottom: cards.slice(middle)
          };
        }
      }
      
      // function that cuts the cards and puts the bottom on the top
      function cutInPlace(pile) {
        var halves = cut(pile);
        return halves.bottom.concat(halves.top);
      }
      
      // function to shuffle the cards using a real-world algorithm
      function shuffle() {
       // repeat 20 times for a new deck
        for (var i = 0; i < 20; i++) {
          // cut the cards in half
          var halves = cut(deck.cards);
          // we will stack both halves into this pile
          var pile = [];
          while (halves.top.length > 0 || halves.bottom.length > 0) {
            // a random number of cards to take from the top
            var take = randomInt(1, 5);
            // take that many cards from the top and put in the pile
            pile = pile.concat(halves.top.splice(0, take));
            // a random number of cards to take from the bottom
            take = randomInt(1, 5);
            // take that many cards from the bottom and put in the pile
            pile = pile.concat(halves.bottom.splice(0, take));
          }
          // put the bottom onto the top so cards are mixed up more
          deck.cards = cutInPlace(pile);
        }
      }
      
      // function to deal the top card
      function dealOneCard() {
        return deck.cards.shift();
      }
      
      // function to reset the cards to a new deck in order
      function reset() {
        deck.cards = [];
        suits.forEach(function(suit) {
          deck.cards.push(Card(suit, 'A', 'Ace'));
          for (var i = 2; i <= 10; i++) {
            deck.cards.push(Card(suit, i+''));
          }
          deck.cards.push(Card(suit, 'J', 'Jack'));
          deck.cards.push(Card(suit, 'Q', 'Queen'));
          deck.cards.push(Card(suit, 'K', 'King'));
        });
      }
      
      // returning the public interface for Deck object
      return deck;
    }
    
    // returning the public interface for deckFactory
    return {
      createNewDeck: Deck
    };
  }
  
})();