/* ============================================================
   2026 FIFA World Cup Prediction Game - app.js
   Data fetched from openfootball/worldcup.json
   ============================================================ */

const DATA_SRC = 'https://raw.githubusercontent.com/openfootball/worldcup.json/refs/heads/master/2026';
// EDITA ESTAS 3 COSAS POR FAVOR
// POR FAVOR
const LEADERBOARD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMG4T-ZrGQ2OdtWmeNXj7tpQ_tIGSn_owTqquLiBqh4UcAgjdKGhV2ytbNUcQD0n124tj_-ZDWOXHE/pub?gid=1459121604&single=true&output=csv'
const FORM_ID = '1FAIpQLSdqAyTjJBkaBRRixdiw6u-urRFIMUz7g7G-zcol6RucWvRKZg';
const ENTRY_ID = 'entry.1885888446';
// REPITO, POR FAVOR

const FLAG_CODE = {
  'Mexico':'mx','South Africa':'za','South Korea':'kr','Czech Republic':'cz',
  'Canada':'ca','Bosnia & Herzegovina':'ba','Qatar':'qa','Switzerland':'ch',
  'Brazil':'br','Morocco':'ma','Haiti':'ht','Scotland':'gb-sct',
  'USA':'us','Paraguay':'py','Australia':'au','Turkey':'tr',
  'Germany':'de','Cura\u00e7ao':'cw','Ivory Coast':'ci','Ecuador':'ec',
  'Netherlands':'nl','Japan':'jp','Sweden':'se','Tunisia':'tn',
  'Belgium':'be','Egypt':'eg','Iran':'ir','New Zealand':'nz',
  'Spain':'es','Cape Verde':'cv','Saudi Arabia':'sa','Uruguay':'uy',
  'France':'fr','Senegal':'sn','Iraq':'iq','Norway':'no',
  'Argentina':'ar','Algeria':'dz','Austria':'at','Jordan':'jo',
  'Portugal':'pt','DR Congo':'cd','Uzbekistan':'uz','Colombia':'co',
  'England':'gb-eng','Croatia':'hr','Ghana':'gh','Panama':'pa'
};

const AWARD_PLAYERS = [

  // France
  { name: 'Kylian Mbappé', country: 'France' },
  { name: 'Ousmane Dembélé', country: 'France' },
  { name: 'Antoine Griezmann', country: 'France' },
  { name: 'Eduardo Camavinga', country: 'France' },
  { name: 'Aurélien Tchouaméni', country: 'France' },

  // England
  { name: 'Jude Bellingham', country: 'England' },
  { name: 'Harry Kane', country: 'England' },
  { name: 'Phil Foden', country: 'England' },
  { name: 'Bukayo Saka', country: 'England' },
  { name: 'Cole Palmer', country: 'England' },
  { name: 'Declan Rice', country: 'England' },

  // Brazil
  { name: 'Vinícius Júnior', country: 'Brazil' },
  { name: 'Rodrygo', country: 'Brazil' },
  { name: 'Raphinha', country: 'Brazil' },
  { name: 'Endrick', country: 'Brazil' },

  // Spain
  { name: 'Lamine Yamal', country: 'Spain' },
  { name: 'Rodri', country: 'Spain' },
  { name: 'Pedri', country: 'Spain' },
  { name: 'Nico Williams', country: 'Spain' },
  { name: 'Oyarzabal', country: 'Spain' },

  // Argentina
  { name: 'Lionel Messi', country: 'Argentina' },
  { name: 'Lautaro Martínez', country: 'Argentina' },
  { name: 'Julián Álvarez', country: 'Argentina' },

  // Germany
  { name: 'Florian Wirtz', country: 'Germany' },
  { name: 'Jamal Musiala', country: 'Germany' },
  { name: 'Kai Havertz', country: 'Germany' },

  // Portugal
  { name: 'Cristiano Ronaldo', country: 'Portugal' },
  { name: 'Bernardo Silva', country: 'Portugal' },
  { name: 'Bruno Fernandes', country: 'Portugal' },
  { name: 'Rafael Leão', country: 'Portugal' },

  // Netherlands
  { name: 'Xavi Simons', country: 'Netherlands' },
  { name: 'Cody Gakpo', country: 'Netherlands' },

  // Belgium
  { name: 'Kevin De Bruyne', country: 'Belgium' },

  // Uruguay
  { name: 'Fede Valverde', country: 'Uruguay' },
  { name: 'Darwin Núñez', country: 'Uruguay' },

  // Mexico
  { name: 'Santiago Giménez', country: 'Mexico' },

  // Colombia
  { name: 'Luis Díaz', country: 'Colombia' },

  // USA
  { name: 'Christian Pulisic', country: 'USA' },

  // South Korea
  { name: 'Son Heung-min', country: 'South Korea' },

  // Norway
  { name: 'Martin Ødegaard', country: 'Norway' }
];

function getFlagClass(team) {
  if (!team) return '';
  const code = FLAG_CODE[team];
  return code ? 'fi fi-'+code : '';
}

let TEAMS_BY_GROUP = {};       // {A: [{name,flag,fifa},...], B: [...]}
let GROUP_NAMES = [];
let BRACKET_R32 = [];          // [{num,slot1:{type,group,groups?},slot2:{type,...}},...]
let KO_TREE = null;            // built bracket tree for rendering
let LOADED = false;
let tpAllocation = {};         // matchNum -> third-place team name (from FIFA table)

function buildTPAllocation() {
  tpAllocation = {};

  const picked = state.thirdPlace.filter(Boolean);
  if (picked.length !== 8) return;

  const byGroup = {};

  picked.forEach(teamName => {
    const group = findTeamGroup(teamName);
    if (group) {
      byGroup[group] = teamName;
    }
  });

  const groups = Object.keys(byGroup).sort();
  if (groups.length !== 8) return;

  const key = groups.join("");
  const order = TP_TABLE[key];

  if (!order) {
    console.warn("No TP_TABLE mapping found for:", key, groups);
    return;
  }

  TP_COLUMNS.forEach((matchNum, index) => {
    const group = String(order[index]).replace(/^3/, "");
    tpAllocation[matchNum] = byGroup[group] || null;
  });
}

// ---- State ----
let state = {
  groups: {},
  thirdPlace: [],
  matchTeams: {},         // matchId -> { team1, team2 }
  knockoutResults: {},    // matchId -> winner team name
  awards: { goldenBoot: ['','',''], goldenBall: ['','',''] }
};

// ---- Fetch & Parse ----
async function loadData() {
  try {
    const resp = await fetch(DATA_SRC+'/worldcup.json');
    const data = await resp.json();

    // Extract group compositions from group-stage matches (early exit at 4 teams/group)
    TEAMS_BY_GROUP = {};
    const seen = {}, done = {};
    data.matches.forEach(m => {
      const g = m.group;
      if (!g || !g.startsWith('Group ')) return;
      const letter = g.replace('Group ','');
      if (done[letter]) return;
      if (!TEAMS_BY_GROUP[letter]) TEAMS_BY_GROUP[letter] = [];
      if (!seen[letter]) seen[letter] = {};
      [m.team1, m.team2].forEach(t => {
        if (t && !seen[letter][t]) {
          seen[letter][t] = true;
          TEAMS_BY_GROUP[letter].push({ name: t, flag: '', fifa: '' });
        }
      });
      if (TEAMS_BY_GROUP[letter].length >= 4) done[letter] = true;
    });
    GROUP_NAMES = Object.keys(TEAMS_BY_GROUP).sort();

    // Initialize state groups
    GROUP_NAMES.forEach(g => {
      state.groups[g] = TEAMS_BY_GROUP[g].map(t => t.name);
    });

    // Build bracket using official 2026 FIFA structure
    KO_TREE = {
      round32: [
        {num:73,slot1:{type:'runner_up',group:'A'},slot2:{type:'runner_up',group:'B'}},
        {num:74,slot1:{type:'winner',group:'E'},slot2:{type:'third_place',groups:['A','B','C','D','F']}},
        {num:75,slot1:{type:'winner',group:'F'},slot2:{type:'runner_up',group:'C'}},
        {num:76,slot1:{type:'winner',group:'C'},slot2:{type:'runner_up',group:'F'}},
        {num:77,slot1:{type:'winner',group:'I'},slot2:{type:'third_place',groups:['C','D','F','G','H']}},
        {num:78,slot1:{type:'runner_up',group:'E'},slot2:{type:'runner_up',group:'I'}},
        {num:79,slot1:{type:'winner',group:'A'},slot2:{type:'third_place',groups:['C','E','F','H','I']}},
        {num:80,slot1:{type:'winner',group:'L'},slot2:{type:'third_place',groups:['E','H','I','J','K']}},
        {num:81,slot1:{type:'winner',group:'D'},slot2:{type:'third_place',groups:['B','E','F','I','J']}},
        {num:82,slot1:{type:'winner',group:'G'},slot2:{type:'third_place',groups:['A','E','H','I','J']}},
        {num:83,slot1:{type:'runner_up',group:'K'},slot2:{type:'runner_up',group:'L'}},
        {num:84,slot1:{type:'winner',group:'H'},slot2:{type:'runner_up',group:'J'}},
        {num:85,slot1:{type:'winner',group:'B'},slot2:{type:'third_place',groups:['E','F','G','I','J']}},
        {num:86,slot1:{type:'winner',group:'J'},slot2:{type:'runner_up',group:'H'}},
        {num:87,slot1:{type:'winner',group:'K'},slot2:{type:'third_place',groups:['D','E','I','J','L']}},
        {num:88,slot1:{type:'runner_up',group:'D'},slot2:{type:'runner_up',group:'G'}}
      ],
      round16: [
        {num:89,slot1:{type:'winner_of',matchNum:73},slot2:{type:'winner_of',matchNum:75}},
        {num:90,slot1:{type:'winner_of',matchNum:74},slot2:{type:'winner_of',matchNum:77}},
        {num:91,slot1:{type:'winner_of',matchNum:76},slot2:{type:'winner_of',matchNum:78}},
        {num:92,slot1:{type:'winner_of',matchNum:79},slot2:{type:'winner_of',matchNum:80}},
        {num:93,slot1:{type:'winner_of',matchNum:83},slot2:{type:'winner_of',matchNum:84}},
        {num:94,slot1:{type:'winner_of',matchNum:81},slot2:{type:'winner_of',matchNum:82}},
        {num:95,slot1:{type:'winner_of',matchNum:86},slot2:{type:'winner_of',matchNum:88}},
        {num:96,slot1:{type:'winner_of',matchNum:85},slot2:{type:'winner_of',matchNum:87}}
      ],
      quarterfinals: [
        {num:97,slot1:{type:'winner_of',matchNum:89},slot2:{type:'winner_of',matchNum:90}},
        {num:98,slot1:{type:'winner_of',matchNum:93},slot2:{type:'winner_of',matchNum:94}},
        {num:99,slot1:{type:'winner_of',matchNum:91},slot2:{type:'winner_of',matchNum:92}},
        {num:100,slot1:{type:'winner_of',matchNum:95},slot2:{type:'winner_of',matchNum:96}}
      ],
      semifinals: [
        {num:101,slot1:{type:'winner_of',matchNum:97},slot2:{type:'winner_of',matchNum:98}},
        {num:102,slot1:{type:'winner_of',matchNum:99},slot2:{type:'winner_of',matchNum:100}}
      ],
      thirdPlace: [
        {num:103,slot1:{type:'loser_of',matchNum:101},slot2:{type:'loser_of',matchNum:102}}
      ],
      final: [
        {num:104,slot1:{type:'winner_of',matchNum:101},slot2:{type:'winner_of',matchNum:102}}
      ]
    };
    BRACKET_R32 = KO_TREE.round32;
    LOADED = true;
    return true;
  } catch(e) {
    console.error('Failed to load tournament data:', e);
    showToast('Failed to load tournament data. Check your connection.', true);
    return false;
  }
}

function findTeamGroup(teamName) {
  for (const g of GROUP_NAMES) {
    if (state.groups[g] && state.groups[g].includes(teamName)) return g;
  }
  return TEAMS_BY_GROUP ? Object.keys(TEAMS_BY_GROUP).find(g => TEAMS_BY_GROUP[g].some(t=>t.name===teamName)) : null;
}

function getTeamFlagClass(teamName) { return getFlagClass(teamName); }

// ---- Compute match teams from group picks ----
function getSlotTeam(ref) {
  if (!ref) return null;
  if (ref.type === 'winner') return state.groups[ref.group] ? state.groups[ref.group][0] : null;
  if (ref.type === 'runner_up') return state.groups[ref.group] ? state.groups[ref.group][1] : null;
  if (ref.type === 'third_place') return tpAllocation[ref._matchNum] || null;
  if (ref.type === 'winner_of') return state.knockoutResults[ref.matchNum] || null;
  if (ref.type === 'loser_of') {
    const m = state.matchTeams[ref.matchNum];
    const w = state.knockoutResults[ref.matchNum];
    if (!m || !w) return null;
    return m.team1 === w ? m.team2 : m.team1;
  }
  return null;
}

function computeMatchTeams() {
  state.matchTeams = {};

  // R32: resolve from group picks + TP allocation
  KO_TREE.round32.forEach(m => {
    state.matchTeams[m.num] = {
      team1: getSlotTeam(Object.assign({}, m.slot1, {_matchNum: m.num})),
      team2: getSlotTeam(Object.assign({}, m.slot2, {_matchNum: m.num}))
    };
  });

  // R16: resolve winners
  (KO_TREE.round16 || []).forEach(m => {
    state.matchTeams[m.num] = {
      team1: getSlotTeam(m.slot1),
      team2: getSlotTeam(m.slot2)
    };
  });

  // QF
  (KO_TREE.quarterfinals || []).forEach(m => {
    state.matchTeams[m.num] = {
      team1: getSlotTeam(m.slot1),
      team2: getSlotTeam(m.slot2)
    };
  });

  // SF
  (KO_TREE.semifinals || []).forEach(m => {
    state.matchTeams[m.num] = {
      team1: getSlotTeam(m.slot1),
      team2: getSlotTeam(m.slot2)
    };
  });

  // Final
  if (KO_TREE.final && KO_TREE.final[0]) {
    const m = KO_TREE.final[0];
    state.matchTeams[m.num] = {
      team1: getSlotTeam(m.slot1),
      team2: getSlotTeam(m.slot2)
    };
  }

  // Third place
  if (KO_TREE.thirdPlace && KO_TREE.thirdPlace[0]) {
    const m = KO_TREE.thirdPlace[0];
    state.matchTeams[m.num] = {
      team1: getSlotTeam(m.slot1),
      team2: getSlotTeam(m.slot2)
    };
  }
}



// ---- Toast / Loading / Confetti ----
function showToast(msg, error) {
  const c = document.getElementById('toastContainer');
  const d = document.createElement('div');
  d.className = error ? 'error-toast' : 'success-toast';
  d.textContent = msg;
  c.appendChild(d);
  setTimeout(() => d.remove(), 3500);
}

function showLoading(msg) {
  document.getElementById('loadingOverlay').style.display = 'flex';
  document.getElementById('loadingText').textContent = msg || 'Loading...';
}
function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

function fireConfetti() {
  const colors = ['#FFD700','#FF6B6B','#4CAF50','#64B5F6','#FF8A65','#BA68C8','#FFF176'];
  const c = document.getElementById('confettiContainer');
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random()*100+'%';
    p.style.width = (6+Math.random()*10)+'px';
    p.style.height = (6+Math.random()*10)+'px';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDuration = (2+Math.random()*3)+'s';
    p.style.animationDelay = Math.random()*0.5+'s';
    c.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

// ---- Render Group Stage ----
function renderGroups() {
  const grid = document.getElementById('groupsGrid');
  grid.innerHTML = '';

  state.thirdPlace = state.thirdPlace.filter(team =>
    GROUP_NAMES.some(g => (state.groups[g] || [])[2] === team)
  );

  GROUP_NAMES.forEach(g => {
    const card = document.createElement('div');
    card.className = 'group-card';

    const h3 = document.createElement('h3');
    h3.textContent = 'Group ' + g;
    card.appendChild(h3);

    const teams = state.groups[g] || [];

    teams.forEach((team, idx) => {
      const isThird = idx === 2;
      const isFourth = idx === 3;
      const isPickedThird = isThird && state.thirdPlace.includes(team);
      const eliminated = isFourth || (isThird && !isPickedThird);

      const row = document.createElement('div');
      row.className =
        'group-team pos-' + (idx + 1) +
        (eliminated ? ' eliminated' : '');

      const badge = document.createElement('span');
      badge.className = 'position-badge';
      badge.textContent = idx + 1;
      row.appendChild(badge);

      const flag = document.createElement('span');
      flag.className = 'team-flag ' + getTeamFlagClass(team);
      row.appendChild(flag);

      const name = document.createElement('span');
      name.className = 'team-name';
      name.textContent = team;
      row.appendChild(name);

      if (idx === 2) {
        const isPicked = state.thirdPlace.includes(team);

        const ball = document.createElement('span');
        ball.className = 'third-ball' + (isPicked ? ' picked' : '');
        ball.textContent = '⚽';
        ball.title = isPicked ? 'Remove from best 3rd place' : 'Pick as best 3rd place';

        ball.addEventListener('click', e => {
          e.stopPropagation();

          const tp = state.thirdPlace.filter(Boolean);
          const pos = tp.indexOf(team);

          if (pos >= 0) {
            state.thirdPlace = tp.filter(t => t !== team);
          } else {
            if (tp.length >= 8) {
              showToast('Solo avanzan 8, tonto. Si quieres quitar uno dale a la pelota ⚽', true);
              return;
            }

            state.thirdPlace = [...tp, team];
          }

          renderAll();
        });

        row.appendChild(ball);
      }

      const btns = document.createElement('div');
      btns.className = 'move-btns';

      const up = document.createElement('button');
      up.textContent = '▲';
      up.disabled = idx === 0;
      up.title = 'Move up';

      up.addEventListener('click', () => {
        [state.groups[g][idx], state.groups[g][idx - 1]] =
          [state.groups[g][idx - 1], state.groups[g][idx]];

        state.thirdPlace = state.thirdPlace.filter(team =>
          GROUP_NAMES.some(g => (state.groups[g] || [])[2] === team)
        );

        renderAll();
      });

      const dn = document.createElement('button');
      dn.textContent = '▼';
      dn.disabled = idx === 3;
      dn.title = 'Move down';

      dn.addEventListener('click', () => {
        [state.groups[g][idx], state.groups[g][idx + 1]] =
          [state.groups[g][idx + 1], state.groups[g][idx]];

        state.thirdPlace = state.thirdPlace.filter(team =>
          GROUP_NAMES.some(g => (state.groups[g] || [])[2] === team)
        );

        renderAll();
      });

      btns.appendChild(up);
      btns.appendChild(dn);
      row.appendChild(btns);
      card.appendChild(row);
    });

    grid.appendChild(card);
  });
}

// ---- Render Third Place ----
function renderThirdPlace() {
  const container = document.getElementById('thirdPlacePicks');
  container.innerHTML = '';
  const picked = state.thirdPlace.filter(Boolean);

  if (picked.length === 0) {
    container.innerHTML = '<p class="note-text">No has elegido nada, ¿qué miras?</p>';
  } else {
    picked.forEach((team, i) => {
      const tag = document.createElement('span');
      tag.className = 'third-pick-tag';
      tag.title = 'Click to remove';
      tag.innerHTML = '<span class="third-pick-num">'+(i+1)+'</span> ' +
        '<span class="'+getTeamFlagClass(team)+'"></span> ' + team;
      tag.addEventListener('click', () => {
        state.thirdPlace = state.thirdPlace.filter(t => t !== team);
        renderAll();
      });
      container.appendChild(tag);
    });
  }
}

// ---- Render Bracket (tournament tree) ----
function getBracketDisplayOrder() {
  const r32Order = [];
  const r16Order = [];
  const qfOrder = [];

  KO_TREE.semifinals.forEach(sf => {
    [sf.slot1.matchNum, sf.slot2.matchNum].forEach(qfNum => {
      const qfIdx = KO_TREE.quarterfinals.findIndex(m => m.num === qfNum);
      if (qfIdx !== -1) {
        qfOrder.push(qfIdx);

        const qf = KO_TREE.quarterfinals[qfIdx];
        [qf.slot1.matchNum, qf.slot2.matchNum].forEach(r16Num => {
          const r16Idx = KO_TREE.round16.findIndex(m => m.num === r16Num);
          if (r16Idx !== -1) {
            r16Order.push(r16Idx);

            const r16 = KO_TREE.round16[r16Idx];
            [r16.slot1.matchNum, r16.slot2.matchNum].forEach(r32Num => {
              const r32Idx = KO_TREE.round32.findIndex(m => m.num === r32Num);
              if (r32Idx !== -1) r32Order.push(r32Idx);
            });
          }
        });
      }
    });
  });

  return { r32Order, r16Order, qfOrder };
}

function renderBracket() {
  const container = document.getElementById('bracketContainer');
  container.innerHTML = '';
  if (!KO_TREE) return;

  const order = getBracketDisplayOrder();

  const SLOT_H = 46;
  const GAP = 10;
  const MATCH_GAP = 2;
  const LABEL_H = 32;
  const COL_W = 170;
  const CONN_W = 58;

  const MATCH_H = SLOT_H * 2 + MATCH_GAP;
  const STEP = MATCH_H + GAP;

  const cols = [
    10,
    COL_W + CONN_W,
    COL_W * 2 + CONN_W * 2,
    COL_W * 3 + CONN_W * 3,
    COL_W * 4 + CONN_W * 4
  ];

  function matchData(treeArr, ord) {
    return (ord || treeArr.map((_, i) => i)).map(i => {
      const m = treeArr[i];
      const mt = state.matchTeams[m.num] || {};
      return {
        team1: mt.team1,
        team2: mt.team2,
        winner: state.knockoutResults[m.num] || null,
        num: m.num
      };
    });
  }

  const r32 = matchData(KO_TREE.round32, order.r32Order);
  const r16 = matchData(KO_TREE.round16, order.r16Order);
  const qf = matchData(KO_TREE.quarterfinals, order.qfOrder);
  const sf = matchData(KO_TREE.semifinals);

  const r32Tree = order.r32Order.map(i => KO_TREE.round32[i]);
  const r16Tree = order.r16Order.map(i => KO_TREE.round16[i]);
  const qfTree = order.qfOrder.map(i => KO_TREE.quarterfinals[i]);
  const sfTree = KO_TREE.semifinals;

  const finMatch = KO_TREE.final ? KO_TREE.final[0] : null;
  const finNum = finMatch ? finMatch.num : 104;
  const finMt = state.matchTeams[finNum] || {};
  const finalMatch = {
    team1: finMt.team1,
    team2: finMt.team2,
    winner: state.knockoutResults[finNum] || null,
    num: finNum
  };

  const r32Tops = r32.map((_, i) => LABEL_H + i * STEP);

  function centerOf(top) {
    return top + SLOT_H;
  }

  function buildTops(dstTree, srcTree, srcTops) {
    return dstTree.map(dst => {
      const s1i = srcTree.findIndex(s => s.num === dst.slot1.matchNum);
      const s2i = srcTree.findIndex(s => s.num === dst.slot2.matchNum);

      if (s1i === -1 || s2i === -1) {
        return LABEL_H;
      }

      const c1 = centerOf(srcTops[s1i]);
      const c2 = centerOf(srcTops[s2i]);

      return ((c1 + c2) / 2) - SLOT_H;
    });
  }

  const r16Tops = buildTops(r16Tree, r32Tree, r32Tops);
  const qfTops = buildTops(qfTree, r16Tree, r16Tops);
  const sfTops = buildTops(sfTree, qfTree, qfTops);

  let finalTop = LABEL_H;
  if (sfTops.length === 2) {
    finalTop = ((centerOf(sfTops[0]) + centerOf(sfTops[1])) / 2) - SLOT_H;
  }

  const maxH = LABEL_H + r32.length * STEP + 40;

  const wrapper = document.createElement('div');
  wrapper.style.cssText =
    'position:relative;height:' + maxH + 'px;min-width:' + (COL_W * 5 + CONN_W * 4 + 40) + 'px';

  ['Dieciseisavos', 'Octavos', 'Cuartos', 'Semis', 'Final'].forEach((lbl, i) => {
    const l = document.createElement('div');
    l.className = 'bracket-round-label';
    l.style.cssText =
      'position:absolute;top:2px;left:' + cols[i] + 'px;width:' + COL_W + 'px;text-align:center;';
    l.textContent = lbl;
    wrapper.appendChild(l);
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', maxH);
  svg.style.cssText =
    'position:absolute;top:0;left:0;pointer-events:none;z-index:1;';

  function mkPath(d) {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    p.setAttribute('stroke', '#81C784');
    p.setAttribute('stroke-width', '2');
    p.setAttribute('fill', 'none');
    return p;
  }

  function connect(srcTree, srcTops, dstTree, dstTops, srcLeft, dstLeft) {
    const sx = srcLeft + COL_W - 6;
    const dx = dstLeft + 3;
    const mx = sx + (dx - sx) / 2;

    dstTree.forEach((dst, di) => {
      const s1i = srcTree.findIndex(s => s.num === dst.slot1.matchNum);
      const s2i = srcTree.findIndex(s => s.num === dst.slot2.matchNum);
      if (s1i === -1 || s2i === -1) return;

      const y1 = centerOf(srcTops[s1i]);
      const y2 = centerOf(srcTops[s2i]);
      const yd = centerOf(dstTops[di]);

      svg.appendChild(mkPath(`M${sx},${y1} L${mx},${y1} L${mx},${yd} L${dx},${yd}`));
      svg.appendChild(mkPath(`M${sx},${y2} L${mx},${y2} L${mx},${yd} L${dx},${yd}`));
    });
  }

  function connectSemisToFinal() {
    if (sfTree.length !== 2) return;

    const sx = cols[3] + COL_W - 6;
    const dx = cols[4] + 3;
    const mx = sx + (dx - sx) / 2;
    const yd = centerOf(finalTop);

    sfTops.forEach(top => {
      const y = centerOf(top);
      svg.appendChild(mkPath(`M${sx},${y} L${mx},${y} L${mx},${yd} L${dx},${yd}`));
    });
  }

  wrapper.appendChild(svg);

  function slotDiv(team, isWinner, matchNum, slotNum, top, left, extraClass) {
  const hasTeam = Boolean(team);
  const winner = state.knockoutResults[matchNum] || null;
  const isRealWinner = hasTeam && winner && team === winner;
  const isLoser = hasTeam && winner && team !== winner;


  const d = document.createElement('div');

  d.className =
    'bracket-slot' +
    (hasTeam ? ' has-team' : ' empty-slot') +
    (isRealWinner ? ' winner' : '') +
    (isLoser ? ' loser' : '') +
    (extraClass ? ' ' + extraClass : '');

  d.style.cssText =
    'position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + (COL_W - 6) + 'px;z-index:2;';

  d.innerHTML =
    '<span class="slot-flag ' + getFlagClass(team) + '"></span>' +
    '<span class="slot-name">' + (team || '---') + '</span>' +
    '<button class="slot-clear">×</button>';

  d.addEventListener('click', () => {
  const match = state.matchTeams[matchNum] || {};
  const hasBothTeams = Boolean(match.team1 && match.team2);

  if (!hasBothTeams) {
    return;
  }

  const previousWinner = state.knockoutResults[matchNum] || null;

  pickWinner(matchNum, slotNum);

  setTimeout(() => {
    const pickedEl = document.querySelector(
      `.bracket-slot[data-match="${matchNum}"][data-slot="${slotNum}"]`
    );

    if (pickedEl) {
      pickedEl.classList.remove('just-picked');
      void pickedEl.offsetWidth;
      pickedEl.classList.add('just-picked');
    }
  }, 0);
});

  d.dataset.match = matchNum;
  d.dataset.slot = slotNum;

  d.querySelector('.slot-clear').addEventListener('click', e => {
    e.stopPropagation();
    clearKnockoutAndRender(team);
  });

  return d;
}

  function drawRound(matches, tops, colIdx) {
    const left = cols[colIdx];

    matches.forEach((m, i) => {
      const top = tops[i];

      wrapper.appendChild(
        slotDiv(m.team1, m.winner === m.team1, m.num, 1, top, left, '')
      );

      wrapper.appendChild(
        slotDiv(m.team2, m.winner === m.team2, m.num, 2, top + SLOT_H, left, '')
      );
    });
  }

  connect(r32Tree, r32Tops, r16Tree, r16Tops, cols[0], cols[1]);
  connect(r16Tree, r16Tops, qfTree, qfTops, cols[1], cols[2]);
  connect(qfTree, qfTops, sfTree, sfTops, cols[2], cols[3]);
  connectSemisToFinal();

  drawRound(r32, r32Tops, 0);
  drawRound(r16, r16Tops, 1);
  drawRound(qf, qfTops, 2);
  drawRound(sf, sfTops, 3);

  const finalWinner = finalMatch.winner || null;

  wrapper.appendChild(
    slotDiv(
      finalMatch.team1,
      Boolean(finalMatch.team1 && finalWinner && finalMatch.team1 === finalWinner),
      finNum,
      1,
      finalTop,
      cols[4],
      ''
    )
  );

  wrapper.appendChild(
    slotDiv(
      finalMatch.team2,
      Boolean(finalMatch.team2 && finalWinner && finalMatch.team2 === finalWinner),
      finNum,
      2,
      finalTop + SLOT_H,
      cols[4],
      ''
    )
  );
  container.appendChild(wrapper);
}

function pickWinner(matchNum, slotNum) {
  const mt = state.matchTeams[matchNum];
  if (!mt) return;
  const team = slotNum === 1 ? mt.team1 : mt.team2;
  if (!team) return;
  if (state.knockoutResults[matchNum] === team) {
    delete state.knockoutResults[matchNum];
  } else {
    state.knockoutResults[matchNum] = team;
  }
  computeMatchTeams();
  renderAll();
}

function clearKnockoutAndRender(team) {
  if (!team) return;
  Object.keys(state.knockoutResults).forEach(k => {
    if (state.knockoutResults[k] === team) delete state.knockoutResults[k];
  });
  computeMatchTeams();
  renderAll();
}

// ---- Awards ----
function renderAwardSelects() {
  const ids = ['awardGb1', 'awardGb2', 'awardGb3', 'awardBa1', 'awardBa2', 'awardBa3'];

  ids.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    const currentValue = select.value;

    select.innerHTML = '<option value="">---</option>';

    AWARD_PLAYERS.forEach(player => {
      const flagClass = getFlagClass(player.country);
      const flagCode = FLAG_CODE[player.country] || '';
      const option = document.createElement('option');

      option.value = player.name;
      option.textContent = `${flagCode ? countryEmoji(flagCode) + ' ' : ''}${player.name} — ${player.country}`;

      select.appendChild(option);
    });

    select.value = currentValue || '';
  });
}

function countryEmoji(code) {
  const SPECIAL = {
    'gb-eng': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  };

  if (SPECIAL[code]) return SPECIAL[code];
  if (!code || code.includes('-')) return '';

  return code
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));
}

function readAwards() {
  return {
    goldenBoot: [
      document.getElementById('awardGb1')?.value || '',
      document.getElementById('awardGb2')?.value || '',
      document.getElementById('awardGb3')?.value || ''
    ],
    goldenBall: [
      document.getElementById('awardBa1')?.value || '',
      document.getElementById('awardBa2')?.value || '',
      document.getElementById('awardBa3')?.value || ''
    ]
  };
}

function fillAwards(a) {
  renderAwardSelects();

  if (!a) return;

  if (a.goldenBoot) {
    document.getElementById('awardGb1').value = a.goldenBoot[0] || '';
    document.getElementById('awardGb2').value = a.goldenBoot[1] || '';
    document.getElementById('awardGb3').value = a.goldenBoot[2] || '';
  }

  if (a.goldenBall) {
    document.getElementById('awardBa1').value = a.goldenBall[0] || '';
    document.getElementById('awardBa2').value = a.goldenBall[1] || '';
    document.getElementById('awardBa3').value = a.goldenBall[2] || '';
  }
}

// ---- Build Payload ----
function buildPayload() {
  computeMatchTeams();
  const awards = readAwards();

  function winners(nums) { return nums.map(n => state.knockoutResults[n]).filter(Boolean); }
  function allTeams(nums) {
    return nums.flatMap(n => { const m = state.matchTeams[n] || {}; return [m.team1, m.team2]; }).filter(Boolean);
  }
  const r32nums = KO_TREE.round32.map(m => m.num);
  const r16nums = (KO_TREE.round16||[]).map(m => m.num);
  const qfnums  = (KO_TREE.quarterfinals||[]).map(m => m.num);
  const sfnums  = (KO_TREE.semifinals||[]).map(m => m.num);

  return {
    groups: state.groups,
    thirdPlace: state.thirdPlace.filter(Boolean),
    knockout: {
      round32: winners(r32nums),
      round16: winners(r16nums),
      quarterfinals: winners(qfnums),
      semifinals: winners(sfnums),
      final: (KO_TREE.final && KO_TREE.final[0]) ? state.knockoutResults[KO_TREE.final[0].num] : null,
      thirdPlace: (KO_TREE.thirdPlace && KO_TREE.thirdPlace[0]) ? state.knockoutResults[KO_TREE.thirdPlace[0].num] : null
    },
    semifinalists: allTeams(sfnums),
    awards
  };
}

// ---- Results ----
function predictionResultStatus(predValue, realValue) {
  if (!realValue || realValue.length === 0) return 'pending';
  if (!predValue) return 'wrong';
  return predValue === realValue ? 'correct' : 'wrong';
}

function scorePrediction(prediction, results = RESULTS) {
  let score = 0;

  GROUP_NAMES.forEach(group => {
    const predGroup = prediction.groups?.[group] || [];
    const realGroup = results.groups?.[group] || [];

    if (predictionResultStatus(predGroup[0], realGroup[0]) === 'correct') score += 3;
    if (predictionResultStatus(predGroup[1], realGroup[1]) === 'correct') score += 2;
  });

  const realThirds = new Set(results.thirdPlace || []);
  (prediction.thirdPlace || []).forEach(team => {
    if (realThirds.size && realThirds.has(team)) score += 1;
  });

  ['round32', 'round16', 'quarterfinals', 'semifinals'].forEach(round => {
    const realTeams = new Set(results.knockout?.[round] || []);
    const predictedTeams = prediction.knockout?.[round] || [];

    predictedTeams.forEach(team => {
      if (realTeams.size && realTeams.has(team)) score += 3;
    });
  });

  if (
    results.knockout?.final &&
    prediction.knockout?.final === results.knockout.final
  ) {
    score += 10;
  }

  const realSemis = new Set(results.semifinalists || []);
  (prediction.semifinalists || []).forEach(team => {
    if (realSemis.size && realSemis.has(team)) score += 5;
  });

  if (
    results.thirdPlaceWinner &&
    prediction.thirdPlaceWinner === results.thirdPlaceWinner
  ) {
    score += 3;
  }

  const predBoot = prediction.awards?.goldenBoot || [];
  const realBoot = results.awards?.goldenBoot || [];

  if (realBoot[0] && predBoot[0] === realBoot[0]) score += 5;
  if (realBoot[1] && predBoot[1] === realBoot[1]) score += 3;
  if (realBoot[2] && predBoot[2] === realBoot[2]) score += 1;

  const predBall = prediction.awards?.goldenBall || [];
  const realBall = results.awards?.goldenBall || [];

  if (realBall[0] && predBall[0] === realBall[0]) score += 5;
  if (realBall[1] && predBall[1] === realBall[1]) score += 3;
  if (realBall[2] && predBall[2] === realBall[2]) score += 1;

  return score;
}

// ---- Leaderboard ----

async function loadLeaderboard() {
  const res = await fetch(LEADERBOARD_CSV_URL);
  const csv = await res.text();

  const rows = parseCSV(csv);
  const submissions = [];

  rows.slice(1).forEach(row => {
    const rawJson = row[1];
    if (!rawJson) return;

    try {
      const prediction = JSON.parse(rawJson);
      submissions.push({
        name: prediction.name || 'Anonymous',
        score: scorePrediction(prediction),
        prediction
      });
    } catch (e) {
      console.warn('Invalid prediction JSON:', rawJson);
    }
  });

  submissions.sort((a, b) => b.score - a.score);
  renderLeaderboardList(submissions);
}

function parseCSV(csv) {
  const rows = [];
  let row = [];
  let value = '';
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (value || row.length) {
        row.push(value);
        rows.push(row);
      }
      row = [];
      value = '';
      if (char === '\r' && next === '\n') i++;
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function renderLeaderboardList(submissions) {
  const container = document.getElementById('leaderboardContent');

  container.innerHTML = `
    <div class="leaderboard-list"></div>
  `;

  const list = container.querySelector('.leaderboard-list');

  submissions.forEach((entry, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'leaderboard-entry';

    btn.innerHTML = `
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-name">${entry.name}</span>
      <span class="leaderboard-score">${entry.score} pts</span>
    `;

    btn.addEventListener('click', () => {
      openPredictionModal(entry);
    });

    list.appendChild(btn);
  });
}

function openPredictionModal(entry) {
  const modal = document.getElementById('predictionModal');
  const viewer = document.getElementById('predictionViewer');

  modal.style.display = 'flex';
  viewer.innerHTML = '';

  renderPredictionReview(entry);
}

function closePredictionModal() {
  const modal = document.getElementById('predictionModal');
  const viewer = document.getElementById('predictionViewer');

  modal.style.display = 'none';
  viewer.innerHTML = '';
}

function renderPredictionReview(entry) {
  const viewer = document.getElementById('predictionViewer');

  viewer.innerHTML = `
    <div class="prediction-review">
      <h3>La predicción de ${entry.name} — ${entry.score} pts</h3>

      <h4>Fase de grupos</h4>
      <div class="review-groups" id="reviewGroups"></div>

      <h4>Knockout</h4>
      <div class="review-section" id="reviewKnockout"></div>

      <h4>Logros individuales</h4>
      <div class="review-section" id="reviewAwards"></div>
    </div>
  `;

  renderReviewGroups(entry.prediction);
  renderReviewKnockout(entry.prediction);
  renderReviewAwards(entry.prediction);
}

function renderReviewGroups(prediction) {
  const container = document.getElementById('reviewGroups');
  container.className = 'groups-grid';
  container.innerHTML = '';

  GROUP_NAMES.forEach(g => {
    const card = document.createElement('div');
    card.className = 'group-card';

    const h3 = document.createElement('h3');
    h3.textContent = 'Group ' + g;
    card.appendChild(h3);

    const teams = prediction.groups?.[g] || [];
    const realTeams = RESULTS.groups?.[g] || [];

    teams.forEach((team, idx) => {
      const isResolved = realTeams.length > idx;
      const isCorrect = isResolved && team === realTeams[idx];
      const isWrong = isResolved && team !== realTeams[idx];

      const row = document.createElement('div');
      row.className =
        'group-team pos-' + (idx + 1) +
        (isCorrect ? ' review-correct' : '') +
        (isWrong ? ' review-wrong' : '') +
        (!isResolved ? ' review-pending' : '');

      const badge = document.createElement('span');
      badge.className = 'position-badge';
      badge.textContent = idx + 1;
      row.appendChild(badge);

      const flag = document.createElement('span');
      flag.className = 'team-flag ' + getTeamFlagClass(team);
      row.appendChild(flag);

      const name = document.createElement('span');
      name.className = 'team-name';
      name.textContent = team || '---';
      row.appendChild(name);

      card.appendChild(row);
    });

    container.appendChild(card);
  });
}

function renderReviewKnockout(prediction) {
  const container = document.getElementById('reviewKnockout');
  container.className = 'bracket-wrapper';
  container.innerHTML = '';

  const oldState = JSON.parse(JSON.stringify(state));

  state.groups = JSON.parse(JSON.stringify(prediction.groups || {}));
  state.thirdPlace = [...(prediction.thirdPlace || [])];
  state.knockoutResults = {};
  state.matchTeams = {};

  computeMatchTeams();

  function applyRoundWinners(roundName, treeRound) {
    const predicted = new Set(prediction.knockout?.[roundName] || []);

    treeRound.forEach(match => {
      const mt = state.matchTeams[match.num] || {};
      if (predicted.has(mt.team1)) state.knockoutResults[match.num] = mt.team1;
      if (predicted.has(mt.team2)) state.knockoutResults[match.num] = mt.team2;
    });

    computeMatchTeams();
  }

  applyRoundWinners('round32', KO_TREE.round32 || []);
  applyRoundWinners('round16', KO_TREE.round16 || []);
  applyRoundWinners('quarterfinals', KO_TREE.quarterfinals || []);
  applyRoundWinners('semifinals', KO_TREE.semifinals || []);

  if (KO_TREE.final?.[0] && prediction.knockout?.final) {
    state.knockoutResults[KO_TREE.final[0].num] = prediction.knockout.final;
    computeMatchTeams();
  }

  const reviewState = JSON.parse(JSON.stringify(state));

  state.groups = oldState.groups;
  state.thirdPlace = oldState.thirdPlace;
  state.knockoutResults = oldState.knockoutResults;
  state.matchTeams = oldState.matchTeams;

  const order = getBracketDisplayOrder();

  const SLOT_H = 46;
  const GAP = 10;
  const MATCH_GAP = 2;
  const LABEL_H = 32;
  const COL_W = 170;
  const CONN_W = 58;
  const MATCH_H = SLOT_H * 2 + MATCH_GAP;
  const STEP = MATCH_H + GAP;

  const cols = [
    10,
    COL_W + CONN_W,
    COL_W * 2 + CONN_W * 2,
    COL_W * 3 + CONN_W * 3,
    COL_W * 4 + CONN_W * 4
  ];

  function matchData(treeArr, ord) {
    return (ord || treeArr.map((_, i) => i)).map(i => {
      const m = treeArr[i];
      const mt = reviewState.matchTeams[m.num] || {};
      return {
        team1: mt.team1,
        team2: mt.team2,
        winner: reviewState.knockoutResults[m.num] || null,
        num: m.num
      };
    });
  }

  const r32 = matchData(KO_TREE.round32, order.r32Order);
  const r16 = matchData(KO_TREE.round16, order.r16Order);
  const qf = matchData(KO_TREE.quarterfinals, order.qfOrder);
  const sf = matchData(KO_TREE.semifinals);

  const r32Tree = order.r32Order.map(i => KO_TREE.round32[i]);
  const r16Tree = order.r16Order.map(i => KO_TREE.round16[i]);
  const qfTree = order.qfOrder.map(i => KO_TREE.quarterfinals[i]);
  const sfTree = KO_TREE.semifinals;

  const finMatch = KO_TREE.final?.[0];
  const finNum = finMatch ? finMatch.num : 104;
  const finMt = reviewState.matchTeams[finNum] || {};
  const finalMatch = {
    team1: finMt.team1,
    team2: finMt.team2,
    winner: reviewState.knockoutResults[finNum] || null,
    num: finNum
  };

  const r32Tops = r32.map((_, i) => LABEL_H + i * STEP);

  function centerOf(top) {
    return top + SLOT_H;
  }

  function buildTops(dstTree, srcTree, srcTops) {
    return dstTree.map(dst => {
      const s1i = srcTree.findIndex(s => s.num === dst.slot1.matchNum);
      const s2i = srcTree.findIndex(s => s.num === dst.slot2.matchNum);
      if (s1i === -1 || s2i === -1) return LABEL_H;

      return ((centerOf(srcTops[s1i]) + centerOf(srcTops[s2i])) / 2) - SLOT_H;
    });
  }

  const r16Tops = buildTops(r16Tree, r32Tree, r32Tops);
  const qfTops = buildTops(qfTree, r16Tree, r16Tops);
  const sfTops = buildTops(sfTree, qfTree, qfTops);

  let finalTop = LABEL_H;
  if (sfTops.length === 2) {
    finalTop = ((centerOf(sfTops[0]) + centerOf(sfTops[1])) / 2) - SLOT_H;
  }

  const maxH = LABEL_H + r32.length * STEP + 40;

  const wrapper = document.createElement('div');
  wrapper.className = 'bracket';
  wrapper.style.cssText =
    'position:relative;height:' + maxH + 'px;min-width:' + (COL_W * 5 + CONN_W * 4 + 40) + 'px';

  ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'].forEach((lbl, i) => {
    const l = document.createElement('div');
    l.className = 'bracket-round-label';
    l.style.cssText =
      'position:absolute;top:2px;left:' + cols[i] + 'px;width:' + COL_W + 'px;text-align:center;';
    l.textContent = lbl;
    wrapper.appendChild(l);
  });

  function slotDiv(team, winner, matchNum, top, left) {
    const hasTeam = Boolean(team);
    const isWinner = hasTeam && winner && team === winner;

    const d = document.createElement('div');
    d.className =
      'bracket-slot' +
      (hasTeam ? ' has-team' : ' empty-slot') +
      (isWinner ? ' winner' : '');

    d.style.cssText =
      'position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + (COL_W - 6) + 'px;z-index:2;cursor:default;';

    d.innerHTML =
      '<span class="slot-flag ' + getFlagClass(team) + '"></span>' +
      '<span class="slot-name">' + (team || '---') + '</span>';

    return d;
  }

  function drawRound(matches, tops, colIdx) {
    const left = cols[colIdx];

    matches.forEach((m, i) => {
      wrapper.appendChild(slotDiv(m.team1, m.winner, m.num, tops[i], left));
      wrapper.appendChild(slotDiv(m.team2, m.winner, m.num, tops[i] + SLOT_H, left));
    });
  }

  drawRound(r32, r32Tops, 0);
  drawRound(r16, r16Tops, 1);
  drawRound(qf, qfTops, 2);
  drawRound(sf, sfTops, 3);

  wrapper.appendChild(slotDiv(finalMatch.team1, finalMatch.winner, finNum, finalTop, cols[4]));
  wrapper.appendChild(slotDiv(finalMatch.team2, finalMatch.winner, finNum, finalTop + SLOT_H, cols[4]));

  container.appendChild(wrapper);
}

function renderReviewAwards(prediction) {
  const container = document.getElementById('reviewAwards');
  container.className = 'awards-section';
  container.innerHTML = '';

  const rows = [
    ['Golden Boot 1st (5pt)', prediction.awards?.goldenBoot?.[0], RESULTS.awards?.goldenBoot?.[0]],
    ['Golden Boot 2nd (3pt)', prediction.awards?.goldenBoot?.[1], RESULTS.awards?.goldenBoot?.[1]],
    ['Golden Boot 3rd (1pt)', prediction.awards?.goldenBoot?.[2], RESULTS.awards?.goldenBoot?.[2]],
    ['Golden Ball Gold (5pt)', prediction.awards?.goldenBall?.[0], RESULTS.awards?.goldenBall?.[0]],
    ['Golden Ball Silver (3pt)', prediction.awards?.goldenBall?.[1], RESULTS.awards?.goldenBall?.[1]],
    ['Golden Ball Bronze (1pt)', prediction.awards?.goldenBall?.[2], RESULTS.awards?.goldenBall?.[2]]
  ];

  rows.forEach(([label, predicted, real]) => {
    const resolved = Boolean(real);
    const correct = resolved && predicted === real;
    const wrong = resolved && predicted !== real;

    const row = document.createElement('div');
    row.className =
      'award-row' +
      (correct ? ' review-correct' : '') +
      (wrong ? ' review-wrong' : '') +
      (!resolved ? ' review-pending' : '');

    row.innerHTML = `
      <label>${label}:</label>
      <div class="award-select" style="cursor:default;">
        ${predicted || '---'}
        ${resolved ? `<small style="display:block;font-weight:700;">Actual: ${real}</small>` : ''}
      </div>
    `;

    container.appendChild(row);
  });
}

// ---- Scoring ----
function calculateScore(prediction, results) {
  if (!results) return 0;
  let score = 0;

  if (prediction.groups && results.groups) {
    Object.keys(results.groups).forEach(g => {
      const pred = prediction.groups[g] || [];
      const real = results.groups[g] || [];
      if (pred[0] === real[0]) score += 3;
      if (pred[1] === real[1]) score += 2;
    });
  }

  if (prediction.thirdPlace && results.thirdPlace) {
    prediction.thirdPlace.forEach(t => { if (t && results.thirdPlace.includes(t)) score += 1; });
  }

  if (prediction.knockout && results.knockout) {
    ['round32','round16','quarterfinals','semifinals'].forEach(stage => {
      (prediction.knockout[stage]||[]).forEach(t => {
        if (t && (results.knockout[stage]||[]).includes(t)) score += 3;
      });
    });
    if (prediction.knockout.final === results.knockout.final) score += 10;
    if (prediction.knockout.thirdPlace === results.knockout.thirdPlace) score += 3;
    if (prediction.semifinalists && results.knockout.semifinals) {
      prediction.semifinalists.forEach(t => {
        if (t && results.knockout.semifinals.includes(t)) score += 5;
      });
    }
  }

  if (prediction.awards && results.awards) {
    const gb = prediction.awards.goldenBoot, rb = results.awards.goldenBoot;
    if (gb && rb) { if (gb[0]===rb[0]) score+=5; if (gb[1]===rb[1]) score+=3; if (gb[2]===rb[2]) score+=1; }
    const ba = prediction.awards.goldenBall, rba = results.awards.goldenBall;
    if (ba && rba) { if (ba[0]===rba[0]) score+=5; if (ba[1]===rba[1]) score+=3; if (ba[2]===rba[2]) score+=1; }
  }

  return score;
}

// ---- Leaderboard ----
function renderLeaderboard(entries) {
  const div = document.getElementById('leaderboardContent');
  if (!entries || entries.length === 0) {
    div.innerHTML = '<p class="note-text" style="margin-top:20px;">No predictions found.</p>';
    return;
  }
  entries.sort((a,b) => b.score - a.score);

  const table = document.createElement('table');
  table.className = 'leaderboard-table';
  table.innerHTML = `<thead><tr><th>#</th><th>Name</th><th>Score</th><th>Champion</th></tr></thead><tbody></tbody>`;
  const tbody = table.querySelector('tbody');

  entries.forEach((e, idx) => {
    const tr = document.createElement('tr');
    if (idx === 0) tr.className = 'rank-1';
    tr.innerHTML = `<td>${idx===0?'<span class="rank-crown">👑</span> ':''}${idx+1}</td><td>${e.name}</td><td>${e.score}</td><td>${e.champion||'--'}</td>`;
    tbody.appendChild(tr);
  });

  div.innerHTML = '';
  div.appendChild(table);
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') { if (text[i+1]==='"') { field+='"'; i++; } else inQuotes = false; }
      else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i+1]==='\n') i++;
        row.push(field); field = '';
        if (row.length) rows.push(row);
        row = [];
      } else field += ch;
    }
  }
  row.push(field);
  if (row.length || field) rows.push(row);
  return rows;
}

// ---- Submit ----
const FORM_ACTION = 'https://docs.google.com/forms/d/e/'+FORM_ID+'/formResponse';

function submitPrediction() {
  openNameModal();
}

function openNameModal() {
  const modal = document.getElementById('nameModal');
  const input = document.getElementById('playerNameInput');

  modal.style.display = 'flex';
  input.value = '';
  setTimeout(() => input.focus(), 50);
}

function closeNameModal() {
  document.getElementById('nameModal').style.display = 'none';
}

async function confirmSubmitPrediction() {
  const input = document.getElementById('playerNameInput');
  const playerName = input.value.trim();

  if (!playerName) {
    showToast('Please enter your name.', true);
    input.focus();
    return;
  }

  const payload = buildPayload();
  payload.name = playerName;
  payload._submittedAt = new Date().toISOString();

  const params = new URLSearchParams();
  params.append(ENTRY_ID, JSON.stringify(payload));

  closeNameModal();
  showLoading('Publicando...');

  try {
    await fetch(FORM_ACTION, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    hideLoading();
    fireConfetti();
    showToast('Listo, buena suerte. Puede tardar unos segundos en aparecer en el ranking.');
  } catch(e) {
    hideLoading();
    showToast('Error. Inténtalo otra vez o avísame.', true);
  }
}

// ---- Master Render ----
function renderAll() {
  buildTPAllocation();
  computeMatchTeams();
  renderGroups();
  renderThirdPlace();
  renderBracket();
  renderAwardSelects();
  loadLeaderboard();
}

function resetState() {
  GROUP_NAMES.forEach(g => {
    state.groups[g] = TEAMS_BY_GROUP[g].map(t => t.name);
  });

  state.thirdPlace = [];

  state.knockoutResults = {};
  state.matchTeams = {};
  state.knockout = {};

  state.awards = {
    goldenBoot: ['', '', ''],
    goldenBall: ['', '', '']
  };

  fillAwards(state.awards);
  renderAll();

  showToast('A tomar por culo. (Si recargas la página lo recuperas, por si acaso)');
}

// ---- Init ----
async function init() {
  showLoading('Loading tournament data...');
  const ok = await loadData();
  hideLoading();
  if (!ok) { showToast('Failed to load tournament data. Check connection and reload.', true); return; }

  // Clear stale localStorage from old team data
  const v = localStorage.getItem('wc2026_version');
  if (v !== '3') {
    localStorage.removeItem('wc2026_picks');
    localStorage.setItem('wc2026_version', '3');
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('btnReset').addEventListener('click', () => { resetState(); computeMatchTeams(); renderAll(); });
  document.getElementById('btnSubmit').addEventListener('click', submitPrediction);
  document.getElementById('confirmNameSubmit').addEventListener('click', confirmSubmitPrediction);
  document.getElementById('cancelNameSubmit').addEventListener('click', closeNameModal);
  document.getElementById('playerNameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmSubmitPrediction();
    if (e.key === 'Escape') closeNameModal();
  });

  document.getElementById('closePredictionModal').addEventListener('click', closePredictionModal);

  document.getElementById('predictionModal').addEventListener('click', e => {
    if (e.target.id === 'predictionModal') {
      closePredictionModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closePredictionModal();
    }
  });

  computeMatchTeams();
  renderAll();

  // Autosave to localStorage
  let saveTimer;
  const saveHook = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const data = buildPayload();
      data._awards = readAwards();
      try { localStorage.setItem('wc2026_picks', JSON.stringify(data)); } catch(e) {}
    }, 500);
  };
  document.querySelectorAll('#awardGb1,#awardGb2,#awardGb3,#awardBa1,#awardBa2,#awardBa3').forEach(el => {
    el.addEventListener('input', saveHook);
  });

  // Restore saved picks (knockout winners + awards only; groups come from live data)
  try {
    const saved = localStorage.getItem('wc2026_picks');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.thirdPlace) state.thirdPlace = data.thirdPlace;
      if (data._awards || data.awards) fillAwards(data._awards || data.awards);
      if (data.knockout) {
        ['round32','round16','quarterfinals','semifinals'].forEach(s => {
          if (data.knockout[s]) {
            const treeArr = KO_TREE[s] || [];
            (data.knockout[s]||[]).forEach((t, i) => {
              if (treeArr[i] && t) state.knockoutResults[treeArr[i].num] = t;
            });
          }
        });
        if (data.knockout.final && KO_TREE.final && KO_TREE.final[0]) state.knockoutResults[KO_TREE.final[0].num] = data.knockout.final;
        if (data.knockout.thirdPlace && KO_TREE.thirdPlace && KO_TREE.thirdPlace[0]) state.knockoutResults[KO_TREE.thirdPlace[0].num] = data.knockout.thirdPlace;
      }
      computeMatchTeams();
      renderAll();
    }
  } catch(e) {}

  if (window.location.hash === '#leaderboard') {
    document.querySelector('[data-tab="leaderboard"]').click();
  }
}

document.addEventListener('DOMContentLoaded', init);
