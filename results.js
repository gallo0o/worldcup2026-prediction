const RESULTS = {
  /*"groups": {
    "A": [
      "Mexico",
      "South Africa",
      "Czech Republic",
      "South Korea"
    ],
    "B": [
      "Switzerland",
      "Canada",
      "Qatar",
      "Bosnia & Herzegovina"
    ],
    "C": [
      "Brazil",
      "Scotland",
      "Morocco",
      "Haiti"
    ],
    "D": [
      "Turkey",
      "Paraguay",
      "USA",
      "Australia"
    ],
    "E": [
      "Ivory Coast",
      "Curaçao",
      "Ecuador",
      "Germany"
    ],
    "F": [
      "Netherlands",
      "Japan",
      "Sweden",
      "Tunisia"
    ],
    "G": [
      "Egypt",
      "Belgium",
      "New Zealand",
      "Iran"
    ],
    "H": [
      "Uruguay",
      "Cape Verde",
      "Spain",
      "Saudi Arabia"
    ],
    "I": [
      "Norway",
      "France",
      "Iraq",
      "Senegal"
    ],
    "J": [
      "Jordan",
      "Argentina",
      "Algeria",
      "Austria"
    ],
    "K": [
      "DR Congo",
      "Portugal",
      "Colombia",
      "Uzbekistan"
    ],
    "L": [
      "Ghana",
      "Panama",
      "Croatia",
      "England"
    ]
  },
  "thirdPlace": [
    "Sweden",
    "Colombia",
    "Iraq",
    "Morocco",
    "Algeria",
    "Spain",
    "Ecuador",
    "New Zealand"
  ],*/
  "groupMatches": {
    "A": {
      "Mexico__South Africa": { "home": 2, "away": 0 },
      "Mexico__South Korea": { "home": 1, "away": 0 },
      //"Mexico__Czech Republic": { "home": 1, "away": 0 },
      //"South Africa__South Korea": { "home": 2, "away": 0 },
      "South Africa__Czech Republic": { "home": 1, "away": 1 },
      "South Korea__Czech Republic": { "home": 2, "away": 1 }
    },
    "B": {
      //"Canada__Switzerland": { "home": 0, "away": 0 },
      "Canada__Qatar": { "home": 6, "away": 0 },
      "Canada__Bosnia & Herzegovina": { "home": 1, "away": 1 },
      "Switzerland__Qatar": { "home": 1, "away": 1 },
      "Switzerland__Bosnia & Herzegovina": { "home": 4, "away": 1 },
      //"Qatar__Bosnia & Herzegovina": { "home": 1, "away": 0 }
    },
    "C": {
      "Brazil__Haiti": { "home": 3, "away": 0 },
      "Brazil__Morocco": { "home": 1, "away": 1 },
      //"Brazil__Scotland": { "home": 2, "away": 1 },
      //"Haiti__Morocco": { "home": 1, "away": 3 },
      "Haiti__Scotland": { "home": 0, "away": 1 },
      "Morocco__Scotland": { "home": 0, "away": 1 }
    },
    "D": {
      "Turkey__Paraguay": { "home": 0, "away": 1 },
      "Turkey__Australia": { "home": 2, "away": 0 },
      //"Turkey__USA": { "home": 2, "away": 0 },
      //"Paraguay__Australia": { "home": 1, "away": 0 },
      "Paraguay__USA": { "home": 4, "away": 1 },
      "Australia__USA": { "home": 2, "away": 0 }
    },
    "E": {
      "Curaçao__Ecuador": { "home": 0, "away": 0 },
      "Curaçao__Germany": { "home": 7, "away": 1 },
      //"Curaçao__Ivory Coast": { "home": 1, "away": 3 },
      //"Ecuador__Germany": { "home": 2, "away": 1 },
      "Ecuador__Ivory Coast": { "home": 1, "away": 0 },
      "Germany__Ivory Coast": { "home": 2, "away": 1 }
    },
    "F": {
      "Japan__Netherlands": { "home": 2, "away": 2 },
      "Japan__Tunisia": { "home": 0, "away": 4 },
      //"Japan__Sweden": { "home": 2, "away": 2 },
      //"Netherlands__Tunisia": { "home": 1, "away": 0 },
      "Netherlands__Sweden": { "home": 5, "away": 1 },
      "Tunisia__Sweden": { "home": 5, "away": 1 }
    },
    "G": {
      "Egypt__Belgium": { "home": 1, "away": 1 },
      //"Egypt__Iran": { "home": 2, "away": 1 },
      //"Egypt__New Zealand": { "home": 3, "away": 1 },
      "Belgium__Iran": { "home": 0, "away": 0 },
      //"Belgium__New Zealand": { "home": 1, "away": 0 },
      "Iran__New Zealand": { "home": 2, "away": 2 }
    },
    "H": {
      //"Uruguay__Spain": { "home": 1, "away": 0 },
      "Uruguay__Saudi Arabia": { "home": 1, "away": 1 },
      "Uruguay__Cape Verde": { "home": 2, "away": 2 },
      "Spain__Saudi Arabia": { "home": 4, "away": 0 },
      "Spain__Cape Verde": { "home": 0, "away": 0 },
      //"Saudi Arabia__Cape Verde": { "home": 0, "away": 1 }
    },
    "I": {
      //"France__Iraq": { "home": 3, "away": 1 },
      "France__Senegal": { "home": 3, "away": 1 },
      //"France__Norway": { "home": 0, "away": 2 },
      //"Iraq__Senegal": { "home": 2, "away": 1 },
      "Iraq__Norway": { "home": 1, "away": 4 },
      //"Senegal__Norway": { "home": 0, "away": 1 }
    },
    "J": {
      //"Argentina__Jordan": { "home": 1, "away": 3 },
      "Argentina__Algeria": { "home": 3, "away": 0 },
      //"Argentina__Austria": { "home": 1, "away": 0 },
      //"Jordan__Algeria": { "home": 3, "away": 2 },
      "Jordan__Austria": { "home": 3, "away": 1 },
      //"Algeria__Austria": { "home": 2, "away": 0 }
    },
    "K": {
      //"Portugal__Uzbekistan": { "home": 2, "away": 1 },
      "Portugal__DR Congo": { "home": 1, "away": 1 },
      //"Portugal__Colombia": { "home": 0, "away": 1 },
      //"Uzbekistan__DR Congo": { "home": 0, "away": 3 },
      "Uzbekistan__Colombia": { "home": 1, "away": 3 },
      //"DR Congo__Colombia": { "home": 1, "away": 0 }
    },
    "L": {
      //"England__Ghana": { "home": 2, "away": 3 },
      "England__Croatia": { "home": 4, "away": 2 },
      //"England__Panama": { "home": 0, "away": 2 },
      //"Ghana__Croatia": { "home": 2, "away": 0 },
      "Ghana__Panama": { "home": 1, "away": 0 },
      //"Croatia__Panama": { "home": 1, "away": 2 }
    }
  },
  /*"knockout": {
    "round32": [
      "South Africa",
      "Ivory Coast",
      "Netherlands",
      "Brazil",
      "Norway",
      "France",
      "Mexico",
      "Algeria",
      "Turkey",
      "Morocco",
      "Portugal",
      "Uruguay",
      "Switzerland",
      "Jordan",
      "Ecuador",
      "Belgium"
    ],
    "round16": [
      "Netherlands",
      "Norway",
      "France",
      "Algeria",
      "Uruguay",
      "Morocco",
      "Belgium",
      "Ecuador"
    ],
    "quarterfinals": [
      "Norway",
      "Morocco",
      "Algeria",
      "Ecuador"
    ],
    "semifinals": [
      "Norway",
      "Algeria"
    ],
    "champion": "Norway",
    "runnerUp": "Algeria",
    "finalists": [
      "Norway",
      "Algeria"
    ],
    "thirdPlaceWinner": "Morocco",
    "final": "Norway",
    "thirdPlace": "Morocco",
    "matches": {
      "round32": [],
      "round16": [],
      "quarterfinals": [],
      "semifinals": [],
      "thirdPlace": [],
      "final": []
    }
  },*/
  /*"semifinalists": [
    "Norway",
    "Morocco",
    "Algeria",
    "Ecuador"
  ],
  "finalists": [
    "Norway",
    "Algeria"
  ],
  "champion": "Norway",
  "runnerUp": "Algeria",
  "thirdPlaceWinner": "Morocco",
  "awards": {
    "goldenBoot": [
      "Kylian Mbappé",
      "Harry Kane",
      "Vinícius Júnior"
    ],
    "goldenBall": [
      "Lionel Messi",
      "Jude Bellingham",
      "Kevin De Bruyne"
    ]
  }*/
};
