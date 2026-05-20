const RESULTS = {
  "groups": {
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
  ],
  "groupMatches": {
    "A": {
      "Mexico__South Africa": { "home": 2, "away": 0 },
      "Mexico__South Korea": { "home": 1, "away": 0 },
      "Mexico__Czech Republic": { "home": 2, "away": 1 },
      "South Africa__South Korea": { "home": 2, "away": 0 },
      "South Africa__Czech Republic": { "home": 1, "away": 0 },
      "South Korea__Czech Republic": { "home": 1, "away": 1 }
    },
    "B": {
      "Canada__Switzerland": { "home": 0, "away": 0 },
      "Canada__Qatar": { "home": 2, "away": 1 },
      "Canada__Bosnia & Herzegovina": { "home": 1, "away": 1 },
      "Switzerland__Qatar": { "home": 2, "away": 0 },
      "Switzerland__Bosnia & Herzegovina": { "home": 2, "away": 1 },
      "Qatar__Bosnia & Herzegovina": { "home": 1, "away": 0 }
    },
    "C": {
      "Brazil__Haiti": { "home": 3, "away": 0 },
      "Brazil__Morocco": { "home": 2, "away": 0 },
      "Brazil__Scotland": { "home": 2, "away": 1 },
      "Haiti__Morocco": { "home": 1, "away": 3 },
      "Haiti__Scotland": { "home": 1, "away": 3 },
      "Morocco__Scotland": { "home": 0, "away": 1 }
    },
    "D": {
      "Turkey__Paraguay": { "home": 2, "away": 1 },
      "Turkey__Australia": { "home": 2, "away": 1 },
      "Turkey__USA": { "home": 2, "away": 0 },
      "Paraguay__Australia": { "home": 1, "away": 0 },
      "Paraguay__USA": { "home": 0, "away": 0 },
      "Australia__USA": { "home": 0, "away": 0 }
    },
    "E": {
      "Curaçao__Ecuador": { "home": 2, "away": 1 },
      "Curaçao__Germany": { "home": 1, "away": 0 },
      "Curaçao__Ivory Coast": { "home": 1, "away": 3 },
      "Ecuador__Germany": { "home": 2, "away": 1 },
      "Ecuador__Ivory Coast": { "home": 0, "away": 2 },
      "Germany__Ivory Coast": { "home": 0, "away": 1 }
    },
    "F": {
      "Japan__Netherlands": { "home": 3, "away": 1 },
      "Japan__Tunisia": { "home": 1, "away": 1 },
      "Japan__Sweden": { "home": 2, "away": 2 },
      "Netherlands__Tunisia": { "home": 1, "away": 0 },
      "Netherlands__Sweden": { "home": 1, "away": 0 },
      "Tunisia__Sweden": { "home": 1, "away": 3 }
    },
    "G": {
      "Egypt__Belgium": { "home": 2, "away": 1 },
      "Egypt__Iran": { "home": 2, "away": 1 },
      "Egypt__New Zealand": { "home": 3, "away": 1 },
      "Belgium__Iran": { "home": 1, "away": 0 },
      "Belgium__New Zealand": { "home": 1, "away": 0 },
      "Iran__New Zealand": { "home": 1, "away": 2 }
    },
    "H": {
      "Uruguay__Spain": { "home": 1, "away": 0 },
      "Uruguay__Saudi Arabia": { "home": 3, "away": 1 },
      "Uruguay__Cape Verde": { "home": 0, "away": 0 },
      "Spain__Saudi Arabia": { "home": 0, "away": 1 },
      "Spain__Cape Verde": { "home": 2, "away": 1 },
      "Saudi Arabia__Cape Verde": { "home": 0, "away": 1 }
    },
    "I": {
      "France__Iraq": { "home": 3, "away": 1 },
      "France__Senegal": { "home": 3, "away": 2 },
      "France__Norway": { "home": 0, "away": 2 },
      "Iraq__Senegal": { "home": 2, "away": 1 },
      "Iraq__Norway": { "home": 1, "away": 1 },
      "Senegal__Norway": { "home": 0, "away": 1 }
    },
    "J": {
      "Argentina__Jordan": { "home": 1, "away": 3 },
      "Argentina__Algeria": { "home": 2, "away": 0 },
      "Argentina__Austria": { "home": 1, "away": 0 },
      "Jordan__Algeria": { "home": 3, "away": 2 },
      "Jordan__Austria": { "home": 1, "away": 1 },
      "Algeria__Austria": { "home": 2, "away": 0 }
    },
    "K": {
      "Portugal__Uzbekistan": { "home": 2, "away": 1 },
      "Portugal__DR Congo": { "home": 2, "away": 1 },
      "Portugal__Colombia": { "home": 0, "away": 1 },
      "Uzbekistan__DR Congo": { "home": 0, "away": 3 },
      "Uzbekistan__Colombia": { "home": 2, "away": 2 },
      "DR Congo__Colombia": { "home": 1, "away": 0 }
    },
    "L": {
      "England__Ghana": { "home": 2, "away": 3 },
      "England__Croatia": { "home": 0, "away": 1 },
      "England__Panama": { "home": 0, "away": 2 },
      "Ghana__Croatia": { "home": 2, "away": 0 },
      "Ghana__Panama": { "home": 1, "away": 1 },
      "Croatia__Panama": { "home": 1, "away": 2 }
    }
  },
  "knockout": {
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
      "round32": [
        { "match": 73, "team1": "South Africa", "team2": "Canada", "winner": "South Africa" },
        { "match": 74, "team1": "Ivory Coast", "team2": "Spain", "winner": "Ivory Coast" },
        { "match": 75, "team1": "Netherlands", "team2": "Scotland", "winner": "Netherlands" },
        { "match": 76, "team1": "Brazil", "team2": "Japan", "winner": "Brazil" },
        { "match": 77, "team1": "Norway", "team2": "New Zealand", "winner": "Norway" },
        { "match": 78, "team1": "Curaçao", "team2": "France", "winner": "France" },
        { "match": 79, "team1": "Mexico", "team2": "Sweden", "winner": "Mexico" },
        { "match": 80, "team1": "Ghana", "team2": "Algeria", "winner": "Algeria" },
        { "match": 81, "team1": "Turkey", "team2": "Colombia", "winner": "Turkey" },
        { "match": 82, "team1": "Egypt", "team2": "Morocco", "winner": "Morocco" },
        { "match": 83, "team1": "Portugal", "team2": "Panama", "winner": "Portugal" },
        { "match": 84, "team1": "Uruguay", "team2": "Argentina", "winner": "Uruguay" },
        { "match": 85, "team1": "Switzerland", "team2": "Iraq", "winner": "Switzerland" },
        { "match": 86, "team1": "Jordan", "team2": "Cape Verde", "winner": "Jordan" },
        { "match": 87, "team1": "DR Congo", "team2": "Ecuador", "winner": "Ecuador" },
        { "match": 88, "team1": "Paraguay", "team2": "Belgium", "winner": "Belgium" }
      ],
      "round16": [
        { "match": 89, "team1": "South Africa", "team2": "Netherlands", "winner": "Netherlands" },
        { "match": 90, "team1": "Ivory Coast", "team2": "Norway", "winner": "Norway" },
        { "match": 91, "team1": "Brazil", "team2": "France", "winner": "France" },
        { "match": 92, "team1": "Mexico", "team2": "Algeria", "winner": "Algeria" },
        { "match": 93, "team1": "Portugal", "team2": "Uruguay", "winner": "Uruguay" },
        { "match": 94, "team1": "Turkey", "team2": "Morocco", "winner": "Morocco" },
        { "match": 95, "team1": "Jordan", "team2": "Belgium", "winner": "Belgium" },
        { "match": 96, "team1": "Switzerland", "team2": "Ecuador", "winner": "Ecuador" }
      ],
      "quarterfinals": [
        { "match": 97, "team1": "Netherlands", "team2": "Norway", "winner": "Norway" },
        { "match": 98, "team1": "Uruguay", "team2": "Morocco", "winner": "Morocco" },
        { "match": 99, "team1": "France", "team2": "Algeria", "winner": "Algeria" },
        { "match": 100, "team1": "Belgium", "team2": "Ecuador", "winner": "Ecuador" }
      ],
      "semifinals": [
        { "match": 101, "team1": "Norway", "team2": "Morocco", "winner": "Norway" },
        { "match": 102, "team1": "Algeria", "team2": "Ecuador", "winner": "Algeria" }
      ],
      "thirdPlace": [
        { "match": 103, "team1": "Morocco", "team2": "Ecuador", "winner": "Morocco" }
      ],
      "final": [
        { "match": 104, "team1": "Norway", "team2": "Algeria", "winner": "Norway" }
      ]
    }
  },
  "semifinalists": [
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
  }
};