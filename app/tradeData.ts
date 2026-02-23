// tradeData.ts - Trade data (salary/cap details from BBRef, etc.)
// RULE: All draft picks must have YEAR, ORIGINAL OWNER, and any RESTRICTIONS.

export const TRADE_HISTORY: Record<string, any> = {
  // KYRIE IRVING TRADE (Feb 6, 2023)
  '202681': [{
    id: 'kyrie-trade-2023',
    date: 'February 6, 2023',
    title: 'The Kyrie Gamble',
    teamsTrading: 'DAL Mavericks \u2194 BKN Nets',
    root: {
      id: '202681',
      label: 'Kyrie Irving',
      img: '202681',
      team: 'DAL',
      note: '27.1 PPG in Brooklyn'
    },
    assets: [
      {
        id: 'dinwiddie-sent',
        label: 'Spencer Dinwiddie',
        img: '203915',
        type: 'player',
        team: 'BKN',
        isSent: true,
        note: 'To Brooklyn'
      },
      {
        id: 'dfs-sent',
        label: 'Dorian Finney-Smith',
        img: '1627827',
        type: 'player',
        team: 'BKN',
        isSent: true,
        note: 'To Brooklyn'
      },
      {
        id: 'dal-2029-pick',
        label: '2029 1st (DAL)',
        type: 'pick',
        team: 'BKN',
        restriction: 'Unprotected',
        portal: { label: 'PART OF KYRIE IRVING TRADE', targetTradeId: '202681' }
      }
    ]
  }],

  // LUKA DONCIC TRADE (June 21, 2018) — ATL sent Luka to DAL; DAL sent Trae + pick to ATL
  '1629029': [{
    id: 'luka-trade-2018',
    date: 'June 21, 2018',
    title: 'The Luka Dončić Trade',
    teamsTrading: 'DAL → ATL',
    root: {
      id: '1629029',
      label: 'Luka Dončić',
      img: '1629029',
      team: 'DAL',
      from: 'ATL',
      to: 'DAL',
      drafted_player: { name: 'Luka Dončić', img: '1629029', pickNumber: 3 }
    },
    assets: [
      {
        id: '1629027',
        label: 'Trae Young',
        img: '1629027',
        type: 'star',
        team: 'ATL',
        from: 'DAL',
        to: 'ATL',
        drafted_player: { name: 'Trae Young', img: '1629027', pickNumber: 5 }
      },
      {
        id: '1629629',
        type: 'player',
        label: 'Cam Reddish',
        team: 'ATL',
        from: 'DAL',
        to: 'ATL',
        assetTitle: '2019 1st (DAL)',
        assetSub: 'Top 5 protected',
        drafted_player: { name: 'Cam Reddish', img: '1629629', pickNumber: 10 }
      }
    ]
  }],

  // CAM REDDISH TRADE (Jan 13, 2022)
  // ATL sent: Reddish, Solomon Hill, 2025 2nd (BKN). NYK sent: Knox, 2022 1st (CHA). TPE: Solomon Hill.
  '1629629': [{
    id: 'reddish-trade-2022',
    date: 'January 13, 2022',
    title: 'Reddish to New York',
    teamsTrading: 'ATL → NYK',
    tradeExceptionGenerated: { player: 'Solomon Hill', amount: 1669178 },
    root: {
      id: '1629629',
      label: 'Cam Reddish',
      img: '1629629',
      team: 'ATL',
      from: 'ATL',
      to: 'NYK',
      note: 'From the Luka pick'
    },
    packageSent: [
      {
        id: 'solomon-hill-sent',
        label: 'Solomon Hill',
        img: '203524',
        type: 'packageItem',
        team: 'NYK',
        from: 'ATL',
        to: 'NYK',
        isSent: true,
        badge: { label: 'WAIVED', variant: 'red' }
      },
      {
        id: '2025-2nd-via-bkn-sent',
        label: '2025 2nd (BKN)',
        subLabel: 'via Brooklyn',
        type: 'pick',
        team: 'NYK',
        from: 'ATL',
        to: 'NYK',
        isSent: true,
        assetTitle: '2025 2nd (BKN)',
        drafted_player: { name: 'Adou Thiero', img: '1631287', pickNumber: 36 },
        portal: { label: 'PART OF MIKAL BRIDGES TRADE', targetTradeId: '1628969' }
      }
    ],
    assets: [
      {
        id: 'knox-from-nyk',
        label: 'Kevin Knox',
        img: '1628995',
        type: 'player',
        team: 'ATL',
        from: 'NYK',
        to: 'ATL',
        drafted_player: { name: 'Kevin Knox', img: '1628995', pickNumber: 9 }
      },
      {
        id: 'cha-protected-1st',
        label: '2026 & 2027 2nds',
        type: 'pick',
        team: 'ATL',
        footer: 'Originally Protected 2023 1st',
        badge: { label: 'CONVERTED', variant: 'amber' },
        portal: { label: 'PART OF DEJOUNTE MURRAY TRADE', targetTradeId: '1627749' }
      }
    ]
  }],

  // DEJOUNTE MURRAY TRADE (June 2022) - 2026 & 2027 2nds sent to SAS
  '1627749': [{
    id: 'murray-trade-2022',
    date: 'June 29, 2022',
    title: 'Dejounte to Atlanta',
    teamsTrading: 'SAS Spurs → ATL Hawks',
    root: { id: '1627749', label: 'Dejounte Murray', img: '1627749', team: 'ATL' },
    assets: []
  }],

  // TRAE YOUNG FUTURE TRADE (Simulated)
  '1629027': [{
    id: 'trae-trade-2026',
    date: 'July 15, 2026',
    title: 'Trae to Washington',
    teamsTrading: 'ATL Hawks \u2194 WAS Wizards',
    root: {
      id: '1629027',
      label: 'Trae Young',
      img: '1629027',
      team: 'WAS',
      from: 'ATL',
      to: 'WAS',
      note: 'Traded to Wizards'
    },
    assets: [
      {
        id: '1630557',
        label: 'Corey Kispert',
        img: '1630557',
        type: 'player',
        team: 'ATL',
        from: 'WAS',
        to: 'ATL'
      },
      {
        id: '203468',
        label: 'CJ McCollum',
        img: '203468',
        type: 'player',
        team: 'ATL',
        from: 'WAS',
        to: 'ATL'
      }
    ]
  }]
};