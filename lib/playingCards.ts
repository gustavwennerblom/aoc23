export type Card = {
  suit?: string;
  symbol: string;
  strength?: number;
};

export type cardCountBySymbol = {
  [symbol: string]: number;
};

export type HandOfCards = {
  cards: Card[];
  strength?: number;
  type?:
    | "fiveOfAKind"
    | "fourOfAKind"
    | "fullHouse"
    | "threeOfAKind"
    | "twoPair"
    | "onePair"
    | "highCard";
};

export function valuateCard(card: Card): number {
  const { symbol } = card;
  if (symbol === "A") return 14;
  if (symbol === "K") return 13;
  if (symbol === "Q") return 12;
  if (symbol === "J") return 1;
  if (symbol === "T") return 10;
  return Number(symbol);
}

function sortCardsBySymbol(cards: Card[]): cardCountBySymbol {
  const cardsBySymbol: cardCountBySymbol = {};
  for (const card of cards) {
    if (!cardsBySymbol[card.symbol]) {
      cardsBySymbol[card.symbol] = 1;
    } else {
      cardsBySymbol[card.symbol]++;
    }
  }
  return cardsBySymbol;
}

export function calcFiveCardHandType(
  _hand: HandOfCards,
  setStrength?: boolean,
  jokerSymbol?: string
): HandOfCards {
  const hand = structuredClone(_hand);
  const { cards: cardsWithJokers } = hand;
  if (cardsWithJokers.length !== 5) throw new Error("Hand must be 5 cards");
  const jokerCount = cardsWithJokers.filter(
    (card) => card.symbol === jokerSymbol
  ).length;
  const cards = cardsWithJokers.filter((card) => card.symbol !== jokerSymbol);

  // Handle special case where all cards are jokers
  if (jokerCount === 5) {
    return {
      cards: cardsWithJokers,
      type: "fiveOfAKind",
      strength: setStrength ? 7 : undefined,
    };
  }
  const cardsBySymbol = sortCardsBySymbol(cards);

  // Handle case five of a kind)
  if (
    Object.values(cardsBySymbol).some(
      (cardCount) => cardCount === 5 - jokerCount
    )
  ) {
    return {
      cards: cardsWithJokers,
      type: "fiveOfAKind",
      strength: setStrength ? 7 : undefined,
    };
  }
  // Handle case four of a kind
  if (
    Object.values(cardsBySymbol).some(
      (cardCount) => cardCount === 4 - jokerCount
    )
  ) {
    return {
      cards: cardsWithJokers,
      type: "fourOfAKind",
      strength: setStrength ? 6 : undefined,
    };
  }
  // Handle case full house
  if (
    Object.values(cardsBySymbol).some(
      (cardCount) => cardCount === 3 - jokerCount
    ) &&
    Object.keys(cardsBySymbol).length === 2
  ) {
    return {
      cards: cardsWithJokers,
      type: "fullHouse",
      strength: setStrength ? 5 : undefined,
    };
  }
  // Handle case three of a kind
  if (
    Object.values(cardsBySymbol).some(
      (cardCount) => cardCount === 3 - jokerCount
    )
  ) {
    return {
      cards: cardsWithJokers,
      type: "threeOfAKind",
      strength: setStrength ? 4 : undefined,
    };
  }
  // Handle case two pair
  if (
    Object.values(cardsBySymbol).filter((cardCount) => cardCount === 2)
      .length === 2 &&
    jokerCount === 0
  ) {
    return {
      cards: cardsWithJokers,
      type: "twoPair",
      strength: setStrength ? 3 : undefined,
    };
  }
  // Handle case one pair
  if (
    Object.values(cardsBySymbol).some(
      (cardCount) => cardCount === 2 - jokerCount
    )
  ) {
    return {
      cards: cardsWithJokers,
      type: "onePair",
      strength: setStrength ? 2 : undefined,
    };
  }
  // Handle case high card
  return {
    cards: cardsWithJokers,
    type: "highCard",
    strength: setStrength ? 1 : undefined,
  };
}
