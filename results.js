const RESULTS = {
  "groups": {
    "A": [
      "Mexico",
      "South Africa",
      "South Korea",
      "Czech Republic"
    ],
    "B": [
      "Switzerland",
      "Canada",
      "Bosnia & Herzegovina",
      "Qatar"
    ],
    "C": [
      "Brazil",
      "Morocco",
      "Scotland",
      "Haiti"
    ],
    "D": [
      "USA",
      "Australia",
      "Paraguay",
      "Turkey"
    ],
    "E": [
      "Germany",
      "Ivory Coast",
      "Ecuador",
      "Curaçao"
    ],
    "F": [
      "Netherlands",
      "Japan",
      "Sweden",
      "Tunisia"
    ],
    "G": [
      "Belgium",
      "Egypt",
      "Iran",
      "New Zealand"
    ],
    "H": [
      "Spain",
      "Cape Verde",
      "Uruguay",
      "Saudi Arabia"
    ],
    "I": [
      "France",
      "Norway",
      "Senegal",
      "Iraq"
    ],
    "J": [
      "Argentina",
      "Austria",
      "Algeria",
      "Jordan"
    ],
    "K": [
      "Colombia",
      "Portugal",
      "DR Congo",
      "Uzbekistan"
    ],
    "L": [
      "England",
      "Croatia",
      "Ghana",
      "Panama"
    ]
  },
  "thirdPlace": [
    "DR Congo",
    "Sweden",
    "Ecuador",
    "Ghana",
    "Bosnia & Herzegovina",
    "Algeria",
    "Paraguay",
    "Senegal"
  ],
  "groupMatches": {
    "A": {
      "Mexico__South Africa": { "home": 2, "away": 0 },
      "South Korea__Czech Republic": { "home": 2, "away": 1 },
      "Czech Republic__South Africa": { "home": 1, "away": 1 },
      "Mexico__South Korea": { "home": 1, "away": 0 },
      "Czech Republic__Mexico": { "home": 0, "away": 3 },
      "South Africa__South Korea": { "home": 1, "away": 0 }
    },
    "B": {
      "Canada__Bosnia & Herzegovina": { "home": 1, "away": 1 },
      "Qatar__Switzerland": { "home": 1, "away": 1 },
      "Switzerland__Bosnia & Herzegovina": { "home": 4, "away": 1 },
      "Canada__Qatar": { "home": 6, "away": 0 },
      "Switzerland__Canada": { "home": 2, "away": 1 },
      "Bosnia & Herzegovina__Qatar": { "home": 3, "away": 1 }
    },
    "C": {
      "Brazil__Morocco": { "home": 1, "away": 1 },
      "Haiti__Scotland": { "home": 0, "away": 1 },
      "Scotland__Morocco": { "home": 0, "away": 1 },
      "Brazil__Haiti": { "home": 3, "away": 0 },
      "Scotland__Brazil": { "home": 0, "away": 3 },
      "Morocco__Haiti": { "home": 4, "away": 2 }
    },
    "D": {
      "USA__Paraguay": { "home": 4, "away": 1 },
      "Australia__Turkey": { "home": 2, "away": 0 },
      "USA__Australia": { "home": 2, "away": 0 },
      "Turkey__Paraguay": { "home": 0, "away": 1 },
      "Turkey__USA": { "home": 3, "away": 2 },
      "Paraguay__Australia": { "home": 0, "away": 0 }
    },
    "E": {
      "Germany__Curaçao": { "home": 7, "away": 1 },
      "Ivory Coast__Ecuador": { "home": 1, "away": 0 },
      "Germany__Ivory Coast": { "home": 2, "away": 1 },
      "Ecuador__Curaçao": { "home": 0, "away": 0 },
      "Curaçao__Ivory Coast": { "home": 0, "away": 2 },
      "Ecuador__Germany": { "home": 2, "away": 1 }
    },
    "F": {
      "Netherlands__Japan": { "home": 2, "away": 2 },
      "Sweden__Tunisia": { "home": 5, "away": 1 },
      "Netherlands__Sweden": { "home": 5, "away": 1 },
      "Tunisia__Japan": { "home": 0, "away": 4 },
      "Japan__Sweden": { "home": 1, "away": 1 },
      "Tunisia__Netherlands": { "home": 1, "away": 3 }
    },
    "G": {
      "Belgium__Egypt": { "home": 1, "away": 1 },
      "Iran__New Zealand": { "home": 2, "away": 2 },
      "Belgium__Iran": { "home": 0, "away": 0 },
      "New Zealand__Egypt": { "home": 1, "away": 3 },
      "Egypt__Iran": { "home": 1, "away": 1 },
      "New Zealand__Belgium": { "home": 1, "away": 5 }
    },
    "H": {
      "Spain__Cape Verde": { "home": 0, "away": 0 },
      "Saudi Arabia__Uruguay": { "home": 1, "away": 1 },
      "Spain__Saudi Arabia": { "home": 4, "away": 0 },
      "Uruguay__Cape Verde": { "home": 2, "away": 2 },
      "Cape Verde__Saudi Arabia": { "home": 0, "away": 0 },
      "Uruguay__Spain": { "home": 0, "away": 1 }
    },
    "I": {
      "France__Senegal": { "home": 3, "away": 1 },
      "Iraq__Norway": { "home": 1, "away": 4 },
      "France__Iraq": { "home": 3, "away": 0 },
      "Norway__Senegal": { "home": 3, "away": 2 },
      "Norway__France": { "home": 1, "away": 4 },
      "Senegal__Iraq": { "home": 5, "away": 0 }
    },
    "J": {
      "Argentina__Algeria": { "home": 3, "away": 0 },
      "Austria__Jordan": { "home": 3, "away": 1 },
      "Argentina__Austria": { "home": 2, "away": 0 },
      "Jordan__Algeria": { "home": 1, "away": 2 },
      "Algeria__Austria": { "home": 3, "away": 3 },
      "Jordan__Argentina": { "home": 1, "away": 3 }
    },
    "K": {
      "Portugal__DR Congo": { "home": 1, "away": 1 },
      "Uzbekistan__Colombia": { "home": 1, "away": 3 },
      "Portugal__Uzbekistan": { "home": 5, "away": 0 },
      "Colombia__DR Congo": { "home": 1, "away": 0 },
      "Colombia__Portugal": { "home": 0, "away": 0 },
      "DR Congo__Uzbekistan": { "home": 3, "away": 1 }
    },
    "L": {
      "England__Croatia": { "home": 4, "away": 2 },
      "Ghana__Panama": { "home": 1, "away": 0 },
      "England__Ghana": { "home": 0, "away": 0 },
      "Panama__Croatia": { "home": 0, "away": 1 },
      "Panama__England": { "home": 0, "away": 2 },
      "Croatia__Ghana": { "home": 2, "away": 1 }
    }
  },
  "knockout": {
    "round32": [
      "Canada",
      "Brazil",
      "Paraguay",
      "Morocco"
    ],
    "round16": [],
    "quarterfinals": [],
    "semifinals": [],
    "champion": "",
    "runnerUp": "",
    "finalists": [],
    "thirdPlaceWinner": "",
    "final": "",
    "thirdPlace": "",
    "matches": {
      "round32": [
        {
          "match": 73,
          "team1": "South Africa",
          "team2": "Canada",
          "winner": "Canada"
        },
        {
          "match": 74,
          "team1": "Brazil",
          "team2": "Japan",
          "winner": "Brazil"
        },
        {
          "match": 75,
          "team1": "Germany",
          "team2": "Paraguay",
          "winner": "Paraguay"
        },
        {
          "match": 76,
          "team1": "Netherlands",
          "team2": "Morocco",
          "winner": "Morocco"
        },
        {
          "match": 77,
          "team1": "Ivory Coast",
          "team2": "Norway",
          "winner": null
        },
        {
          "match": 78,
          "team1": "France",
          "team2": "Sweden",
          "winner": null
        },
        {
          "match": 79,
          "team1": "Mexico",
          "team2": "Ecuador",
          "winner": null
        },
        {
          "match": 80,
          "team1": "England",
          "team2": "DR Congo",
          "winner": null
        },
        {
          "match": 81,
          "team1": "Belgium",
          "team2": "Senegal",
          "winner": null
        },
        {
          "match": 82,
          "team1": "USA",
          "team2": "Bosnia & Herzegovina",
          "winner": null
        },
        {
          "match": 83,
          "team1": "Spain",
          "team2": "Austria",
          "winner": null
        },
        {
          "match": 84,
          "team1": "Portugal",
          "team2": "Croatia",
          "winner": null
        },
        {
          "match": 85,
          "team1": "Switzerland",
          "team2": "Algeria",
          "winner": null
        },
        {
          "match": 86,
          "team1": "Australia",
          "team2": "Egypt",
          "winner": null
        },
        {
          "match": 87,
          "team1": "Argentina",
          "team2": "Cape Verde",
          "winner": null
        },
        {
          "match": 88,
          "team1": "Colombia",
          "team2": "Ghana",
          "winner": null
        }
      ],
      "round16": [
        {
          "match": 89,
          "team1": "Canada",
          "team2": "Morocco",
          "winner": null
        },
        {
          "match": 90,
          "team1": "Paraguay",
          "team2": null,
          "winner": null
        },
        {
          "match": 91,
          "team1": "Brazil",
          "team2": null,
          "winner": null
        },
      ],
      "quarterfinals": [],
      "semifinals": [],
      "thirdPlace": [],
      "final": []
    }
  },
  "semifinalists": [],
  "finalists": [],
  "champion": "",
  "runnerUp": "",
  "thirdPlaceWinner": "",
  "awards": {
    "goldenBoot": [],
    "goldenBall": []
  }
};
