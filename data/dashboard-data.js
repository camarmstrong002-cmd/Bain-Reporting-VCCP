// Bain VCCP Dashboard - Data Layer
// Auto-generated from real source files
// CM360 Report | Media Plans 2025/2026 | SOV Report | Creative Analysis

const MONTHS = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"];
const MONTH_LABELS = ["Jan '25", "Feb '25", "Mar '25", "Apr '25", "May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26"];

const SITE_TOTALS = {
  "The Economist": {
    "impressions": 14813483,
    "clicks": 29408,
    "ctr": 0.1985
  },
  "WSJ": {
    "impressions": 14022715,
    "clicks": 16848,
    "ctr": 0.1201
  },
  "FT": {
    "impressions": 7376609,
    "clicks": 12955,
    "ctr": 0.1756
  },
  "Nativo Inc.": {
    "impressions": 17287883,
    "clicks": 37332,
    "ctr": 0.2159
  },
  "Mobkoi": {
    "impressions": 5344703,
    "clicks": 36437,
    "ctr": 0.6817
  }
};

const MONTHLY_TOTALS = {
  "2025-01": {
    "impressions": 231,
    "clicks": 74
  },
  "2025-02": {
    "impressions": 2220157,
    "clicks": 4859
  },
  "2025-03": {
    "impressions": 2219590,
    "clicks": 4002
  },
  "2025-04": {
    "impressions": 2766294,
    "clicks": 4222
  },
  "2025-05": {
    "impressions": 4776926,
    "clicks": 9763
  },
  "2025-06": {
    "impressions": 6886362,
    "clicks": 18036
  },
  "2025-07": {
    "impressions": 5406043,
    "clicks": 24148
  },
  "2025-08": {
    "impressions": 2735750,
    "clicks": 6653
  },
  "2025-09": {
    "impressions": 6356184,
    "clicks": 18727
  },
  "2025-10": {
    "impressions": 9309819,
    "clicks": 19642
  },
  "2025-11": {
    "impressions": 4486750,
    "clicks": 7578
  },
  "2025-12": {
    "impressions": 1354857,
    "clicks": 1605
  },
  "2026-01": {
    "impressions": 3584922,
    "clicks": 3964
  },
  "2026-02": {
    "impressions": 3484654,
    "clicks": 4450
  },
  "2026-03": {
    "impressions": 3256854,
    "clicks": 5257
  }
};

const SITE_MONTHLY = {
  "The Economist": [
    184,
    1011616,
    1047768,
    1055350,
    1032899,
    1070027,
    1073536,
    1120813,
    1044922,
    1007069,
    1304058,
    616471,
    1567498,
    840848,
    1020424
  ],
  "FT": [
    0,
    402853,
    426992,
    966375,
    503777,
    367203,
    835746,
    496568,
    361636,
    1180803,
    369788,
    366638,
    367190,
    370666,
    360374
  ],
  "WSJ": [
    47,
    805688,
    744830,
    744569,
    819803,
    759431,
    859039,
    760955,
    751969,
    822633,
    782927,
    371653,
    1650159,
    2273103,
    1875909
  ],
  "Nativo Inc.": [
    0,
    0,
    0,
    0,
    2420447,
    3784746,
    287,
    357414,
    2898501,
    5796157,
    2029977,
    95,
    75,
    37,
    147
  ],
  "Mobkoi": [
    0,
    0,
    0,
    0,
    0,
    904955,
    2637435,
    0,
    1299156,
    503157,
    0,
    0,
    0,
    0,
    0
  ]
};
const SITE_MONTHLY_CLICKS = {
  "The Economist": [
    51,
    3072,
    2475,
    2432,
    2041,
    2070,
    2688,
    3408,
    1596,
    1411,
    1475,
    768,
    1379,
    1780,
    2762
  ],
  "FT": [
    0,
    802,
    766,
    957,
    782,
    555,
    1586,
    1423,
    636,
    1783,
    573,
    517,
    1156,
    662,
    757
  ],
  "WSJ": [
    23,
    985,
    761,
    830,
    1268,
    1026,
    1807,
    1235,
    1371,
    1094,
    1086,
    308,
    1403,
    1995,
    1656
  ],
  "Nativo Inc.": [
    0,
    0,
    0,
    3,
    5672,
    8677,
    6,
    557,
    6019,
    11824,
    4442,
    11,
    26,
    13,
    82
  ],
  "Mobkoi": [
    0,
    0,
    0,
    0,
    0,
    5708,
    18061,
    30,
    9105,
    3530,
    2,
    1,
    0,
    0,
    0
  ]
};

const REGION_DATA = [
  {
    "region": "NAM",
    "impressions": 22387478,
    "clicks": 38938,
    "ctr": 0.1739
  },
  {
    "region": "Global",
    "impressions": 13160581,
    "clicks": 26558,
    "ctr": 0.2018
  },
  {
    "region": "EMEA T1",
    "impressions": 7244559,
    "clicks": 22164,
    "ctr": 0.3059
  },
  {
    "region": "APAC",
    "impressions": 6563290,
    "clicks": 21966,
    "ctr": 0.3347
  },
  {
    "region": "US",
    "impressions": 4500850,
    "clicks": 7447,
    "ctr": 0.1654
  },
  {
    "region": "EMEA T2",
    "impressions": 2804122,
    "clicks": 9723,
    "ctr": 0.3467
  },
  {
    "region": "CA",
    "impressions": 1082180,
    "clicks": 3141,
    "ctr": 0.2903
  },
  {
    "region": "LATAM",
    "impressions": 1102333,
    "clicks": 3043,
    "ctr": 0.2761
  }
];

const TARGETING_DATA = [
  {
    "targeting": "Audience",
    "impressions": 25190952,
    "clicks": 63698,
    "ctr": 0.2529
  },
  {
    "targeting": "Subscribers",
    "impressions": 13841274,
    "clicks": 27883,
    "ctr": 0.2015
  },
  {
    "targeting": "Other",
    "impressions": 10381086,
    "clicks": 19597,
    "ctr": 0.1888
  },
  {
    "targeting": "Aud+Context",
    "impressions": 6306480,
    "clicks": 7745,
    "ctr": 0.1228
  },
  {
    "targeting": "Contextual",
    "impressions": 2376235,
    "clicks": 13200,
    "ctr": 0.5555
  },
  {
    "targeting": "C-Suite",
    "impressions": 650701,
    "clicks": 691,
    "ctr": 0.1062
  },
  {
    "targeting": "Sponsorship",
    "impressions": 98665,
    "clicks": 166,
    "ctr": 0.1682
  }
];

const TOP_PLACEMENTS = [
  {
    "placement": "Nativo_NAM_ABM_Display_Macro_STtariffs_Insights 1x1",
    "site": "Nativo Inc.",
    "region": "NAM",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 4574062,
    "clicks": 7448,
    "ctr": 0.1628
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_300x250",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 2518943,
    "clicks": 2354,
    "ctr": 0.0935
  },
  {
    "placement": "Nativo_Global_Audience_NativeArticle5_Macro_TarrifsNextChapter_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "Global",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1660526,
    "clicks": 4236,
    "ctr": 0.2551
  },
  {
    "placement": "Nativo_NAM_Audience_NativeArticle4_AI_UnstickingYourAITransformation_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "NAM",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1626830,
    "clicks": 3315,
    "ctr": 0.2038
  },
  {
    "placement": "Nativo_NAM_Audience_NativeArticle5_Macro_TarrifsNextChapter_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "NAM",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1626734,
    "clicks": 3933,
    "ctr": 0.2418
  },
  {
    "placement": "Nativo_Global_Audience_NativeArticle4_AI_UnstickingYourAITransformation_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "Global",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1552092,
    "clicks": 3602,
    "ctr": 0.2321
  },
  {
    "placement": "Nativo_NAM_Audience_NativeArticle1_AI_BoardsPhase1_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "NAM",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1051798,
    "clicks": 2264,
    "ctr": 0.2153
  },
  {
    "placement": "Nativo_NAM_Audience_NativeArticle3_Energy_AgendaPhase1_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "NAM",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1051653,
    "clicks": 2307,
    "ctr": 0.2194
  },
  {
    "placement": "Nativo_NAM_Audience_NativeArticle2_Macro_TarrifsPhase1_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "NAM",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1051510,
    "clicks": 2335,
    "ctr": 0.2221
  },
  {
    "placement": "Nativo_Global_Audience_NativeArticle3_Energy_AgendaPhase1_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "Global",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1005102,
    "clicks": 2145,
    "ctr": 0.2134
  },
  {
    "placement": "Nativo_Global_Audience_NativeArticle1_AI_BoardsPhase1_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "Global",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1004573,
    "clicks": 2095,
    "ctr": 0.2085
  },
  {
    "placement": "Nativo_Global_Audience_NativeArticle2_Macro_TarrifsPhase1_InFeedUnit",
    "site": "Nativo Inc.",
    "region": "Global",
    "targeting": "Audience",
    "format": "Native",
    "impressions": 1003855,
    "clicks": 2132,
    "ctr": 0.2124
  },
  {
    "placement": "WSJ_Global_DAVOS_CustomABM+Contextual_Display_300x250",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 916384,
    "clicks": 264,
    "ctr": 0.0288
  },
  {
    "placement": "Mobkoi_APAC_Contextual_Display_AI & Macro_Subtheme_Interscroller",
    "site": "Mobkoi",
    "region": "APAC",
    "targeting": "Contextual",
    "format": "Interscroller",
    "impressions": 861856,
    "clicks": 5196,
    "ctr": 0.6029
  },
  {
    "placement": "Mobkoi_APAC_Audience_Display_AI & Macro_Subtheme_Interscroller",
    "site": "Mobkoi",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 808492,
    "clicks": 4147,
    "ctr": 0.5129
  },
  {
    "placement": "WSJ_Global_DAVOS_Video",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Other",
    "format": "Video",
    "impressions": 803170,
    "clicks": 756,
    "ctr": 0.0941
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_300x250_Q4",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 792769,
    "clicks": 376,
    "ctr": 0.0474
  },
  {
    "placement": "Mobkoi_Behavioural_Interscroller_Burst 1 - EMEA (Tier 1)",
    "site": "Mobkoi",
    "region": "Global",
    "targeting": "Other",
    "format": "Interscroller",
    "impressions": 770792,
    "clicks": 6095,
    "ctr": 0.7907
  },
  {
    "placement": "Mobkoi_EMEATier1_Contextual_Display_AI & Macro_Subtheme_Interscroller",
    "site": "Mobkoi",
    "region": "EMEA T1",
    "targeting": "Contextual",
    "format": "Interscroller",
    "impressions": 680062,
    "clicks": 4873,
    "ctr": 0.7166
  },
  {
    "placement": "WSJ_Global_RunOfApp_Display_300x250_Q1",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 674696,
    "clicks": 900,
    "ctr": 0.1334
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_Macro_STStrategyActions_FolioRiver",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 626028,
    "clicks": 1281,
    "ctr": 0.2046
  },
  {
    "placement": "WSJ_Global_DAVOS_CustomABM+Contextual_Display_300x600",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Aud+Context",
    "format": "300x600",
    "impressions": 570362,
    "clicks": 249,
    "ctr": 0.0437
  },
  {
    "placement": "WSJ_Global_DAVOS_CustomABM+Contextual_Display_970x250",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Aud+Context",
    "format": "970x250",
    "impressions": 545782,
    "clicks": 207,
    "ctr": 0.0379
  },
  {
    "placement": "WSJ_Global_DJID_Display_300x250_Q1",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 527369,
    "clicks": 731,
    "ctr": 0.1386
  },
  {
    "placement": "WSJ_NAM_CustomABM+Contextual_Display_300x250",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 432628,
    "clicks": 159,
    "ctr": 0.0368
  },
  {
    "placement": "WSJ_Global_C-Suite_Display_300x250_Q1",
    "site": "WSJ",
    "region": "Global",
    "targeting": "C-Suite",
    "format": "300x250",
    "impressions": 431651,
    "clicks": 501,
    "ctr": 0.1161
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_AI_ReimagineWins_FolioRiver_Q4",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 429287,
    "clicks": 894,
    "ctr": 0.2083
  },
  {
    "placement": "Economist_EMEATier1_Subscribers_Display_300x250",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 425872,
    "clicks": 1374,
    "ctr": 0.3226
  },
  {
    "placement": "FT_NAM_Subcribers_Display_300x250",
    "site": "FT",
    "region": "NAM",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 397394,
    "clicks": 585,
    "ctr": 0.1472
  },
  {
    "placement": "FT_NAM_Audience+Contextual_Display_300x250",
    "site": "FT",
    "region": "NAM",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 382373,
    "clicks": 618,
    "ctr": 0.1616
  },
  {
    "placement": "FT_EMEATier1_Subcribers_Display_300x250",
    "site": "FT",
    "region": "EMEA T1",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 382029,
    "clicks": 642,
    "ctr": 0.1681
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_WinwithAI_CompetitiveAdvantage_FolioStandard",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 350215,
    "clicks": 861,
    "ctr": 0.2458
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_Macro_TariffActions_FolioRiver",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 337552,
    "clicks": 1165,
    "ctr": 0.3451
  },
  {
    "placement": "FT_NAM_Display_Newsletter_AI_MakeAIWork_Q4",
    "site": "FT",
    "region": "NAM",
    "targeting": "Other",
    "format": "Newsletter",
    "impressions": 326460,
    "clicks": 622,
    "ctr": 0.1905
  },
  {
    "placement": "FT_EMEATier1_Audience+Contextual_Display_300x250",
    "site": "FT",
    "region": "EMEA T1",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 326392,
    "clicks": 578,
    "ctr": 0.1771
  },
  {
    "placement": "FT_NAM_Display_Newsletter_AI_ReimagineWins_Q4",
    "site": "FT",
    "region": "NAM",
    "targeting": "Other",
    "format": "Newsletter",
    "impressions": 322410,
    "clicks": 159,
    "ctr": 0.0493
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_Energy_DataCenterDemand_FolioRiver",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 315842,
    "clicks": 801,
    "ctr": 0.2536
  },
  {
    "placement": "FT_NAM_CustomABM+Contextual_Display_300x250_Q4",
    "site": "FT",
    "region": "NAM",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 308113,
    "clicks": 525,
    "ctr": 0.1704
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_AI_CEOActions_FolioRiver",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 292561,
    "clicks": 643,
    "ctr": 0.2198
  },
  {
    "placement": "Economist_EMEATier1_Feb_Display_Macro_STModels_ResponsiveBillboard_Q1",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Other",
    "format": "Other",
    "impressions": 289951,
    "clicks": 279,
    "ctr": 0.0962
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_Energy_MeetingDemand_FolioRiver",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 289085,
    "clicks": 931,
    "ctr": 0.3221
  },
  {
    "placement": "WSJ_NAM_Subcribers_Display_Folio",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Other",
    "format": "Folio",
    "impressions": 286100,
    "clicks": 729,
    "ctr": 0.2548
  },
  {
    "placement": "Economist_US_Subscribers_Display_300x250",
    "site": "The Economist",
    "region": "US",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 285703,
    "clicks": 910,
    "ctr": 0.3185
  },
  {
    "placement": "Economist_US_Takeover_HPTO_Jan_Display_970x250_Q1",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "970x250",
    "impressions": 264456,
    "clicks": 121,
    "ctr": 0.0458
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_300x600_Q4",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "300x600",
    "impressions": 259973,
    "clicks": 177,
    "ctr": 0.0681
  },
  {
    "placement": "Economist_US_Audience_Display_AI_ReimagineWins_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "US",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 247213,
    "clicks": 247,
    "ctr": 0.0999
  },
  {
    "placement": "Mobkoi_EMEATier2_Contextual_Display_AI & Macro_Subtheme_Interscroller",
    "site": "Mobkoi",
    "region": "EMEA T2",
    "targeting": "Contextual",
    "format": "Interscroller",
    "impressions": 246550,
    "clicks": 2163,
    "ctr": 0.8773
  },
  {
    "placement": "Mobkoi_APAC_Audience_Display_Energy_Flex_Interscroller",
    "site": "Mobkoi",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 243046,
    "clicks": 1790,
    "ctr": 0.7365
  },
  {
    "placement": "Mobkoi_APAC_Audience_Display_AI_CEOActions_Interscroller",
    "site": "Mobkoi",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 240188,
    "clicks": 850,
    "ctr": 0.3539
  },
  {
    "placement": "Mobkoi_APAC_Audience_Display_AI_CompetitiveAdvantage_Interscroller",
    "site": "Mobkoi",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 239549,
    "clicks": 1544,
    "ctr": 0.6445
  },
  {
    "placement": "WSJ_NAM_CustomABM+Contextual_Display_300x600",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Aud+Context",
    "format": "300x600",
    "impressions": 238295,
    "clicks": 123,
    "ctr": 0.0516
  },
  {
    "placement": "Economist_EMEATier1_Subscribers_Display_AI_CompetitiveAdvantage_ResponsiveBillboard",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Subscribers",
    "format": "Other",
    "impressions": 232922,
    "clicks": 219,
    "ctr": 0.094
  },
  {
    "placement": "Economist_EMEATier1_Audience_Display_AI_ReimagineWins_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 228380,
    "clicks": 253,
    "ctr": 0.1108
  },
  {
    "placement": "Economist_EMEATier1_Subscribers_Display_AI_CompetitiveAdvantage_Interscroller",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Subscribers",
    "format": "Interscroller",
    "impressions": 224351,
    "clicks": 789,
    "ctr": 0.3517
  },
  {
    "placement": "Economist_APAC_Subscribers_Display_300x250",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 213938,
    "clicks": 654,
    "ctr": 0.3057
  },
  {
    "placement": "Economist_EMEATier1_Audience_Display_Energy_Flex_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 210393,
    "clicks": 210,
    "ctr": 0.0998
  },
  {
    "placement": "FT_APAC_Subcribers_Display_300x250",
    "site": "FT",
    "region": "APAC",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 204529,
    "clicks": 300,
    "ctr": 0.1467
  },
  {
    "placement": "WSJ_NAM_CustomABM+Contexual_Display_970x250",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Audience",
    "format": "970x250",
    "impressions": 202246,
    "clicks": 81,
    "ctr": 0.0401
  },
  {
    "placement": "FT_NAM_Subscribers_Display_300x250_Q4",
    "site": "FT",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 200759,
    "clicks": 267,
    "ctr": 0.133
  },
  {
    "placement": "Economist_US_Feb_Display_Macro_STModels_ResponsiveBillboard_Q1",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "Other",
    "impressions": 200281,
    "clicks": 96,
    "ctr": 0.0479
  },
  {
    "placement": "FT_APAC_Audience+Contextual_Display_300x250",
    "site": "FT",
    "region": "APAC",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 198235,
    "clicks": 329,
    "ctr": 0.166
  },
  {
    "placement": "Economist_EMEATier1_Subscribers_Display_300x600",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Subscribers",
    "format": "300x600",
    "impressions": 194105,
    "clicks": 79,
    "ctr": 0.0407
  },
  {
    "placement": "Economist_APAC_Subscribers_Display_300x600",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Subscribers",
    "format": "300x600",
    "impressions": 193437,
    "clicks": 43,
    "ctr": 0.0222
  },
  {
    "placement": "FT_EMEATier1_Subscribers_Display_300x250_Q4",
    "site": "FT",
    "region": "EMEA T1",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 190376,
    "clicks": 314,
    "ctr": 0.1649
  },
  {
    "placement": "Economist_US_Subscribers_Display_300x600",
    "site": "The Economist",
    "region": "US",
    "targeting": "Subscribers",
    "format": "300x600",
    "impressions": 189491,
    "clicks": 40,
    "ctr": 0.0211
  },
  {
    "placement": "Economist_APAC_Audience_Display_AI_ReimagineWins_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 185972,
    "clicks": 135,
    "ctr": 0.0726
  },
  {
    "placement": "Economist_EMEATier1_Audience_Display_Energy_Flex_ResponsiveBillboard",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 185235,
    "clicks": 242,
    "ctr": 0.1306
  },
  {
    "placement": "Economist_EMEATier1_Jan_Display_Macro_STModels_ResponsiveBillboard_Q1",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Other",
    "format": "Other",
    "impressions": 183828,
    "clicks": 139,
    "ctr": 0.0756
  },
  {
    "placement": "WSJ_NAM_CustomABM+Contextual_Display_300x250_Q4",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 179354,
    "clicks": 44,
    "ctr": 0.0245
  },
  {
    "placement": "WSJ_Global_Subscribers_Display_300x250",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 178856,
    "clicks": 223,
    "ctr": 0.1247
  },
  {
    "placement": "FT_GLOBAL_Newswrap Newsletter_AV_Week3-4_MessageA_Display_AI_Transform_300x250",
    "site": "FT",
    "region": "Global",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 177757,
    "clicks": 104,
    "ctr": 0.0585
  },
  {
    "placement": "Mobkoi_EMEATier2_Audience_Display_AI & Macro_Subtheme_Interscroller",
    "site": "Mobkoi",
    "region": "EMEA T2",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 174639,
    "clicks": 1324,
    "ctr": 0.7581
  },
  {
    "placement": "Mobkoi_EMEATier1_Audience_Display_Energy_Flex_Interscroller",
    "site": "Mobkoi",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 170648,
    "clicks": 1857,
    "ctr": 1.0882
  },
  {
    "placement": "Mobkoi_EMEATier1_Audience_Display_AI_CompetitiveAdvantage_Interscroller",
    "site": "Mobkoi",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 170150,
    "clicks": 1736,
    "ctr": 1.0203
  },
  {
    "placement": "Mobkoi_EMEATier1_Audience_Display_Energy_MeetingDemand_Interscroller",
    "site": "Mobkoi",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 169302,
    "clicks": 1012,
    "ctr": 0.5977
  },
  {
    "placement": "Economist_US_Takeover_HPTO_Jan_Display_300x250_Q1",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 169291,
    "clicks": 54,
    "ctr": 0.0319
  },
  {
    "placement": "Mobkoi_EMEATier1_Audience_Display_AI_CEOActions_Interscroller",
    "site": "Mobkoi",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 169110,
    "clicks": 834,
    "ctr": 0.4932
  },
  {
    "placement": "Economist_EMEATier1_Feb_Display_Macro_STModels_Interscroller_Q1",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Other",
    "format": "Interscroller",
    "impressions": 168954,
    "clicks": 903,
    "ctr": 0.5345
  },
  {
    "placement": "Economist_APAC_Subscribers_Display_AI_CompetitiveAdvantage_ResponsiveBillboard",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Subscribers",
    "format": "Other",
    "impressions": 165836,
    "clicks": 187,
    "ctr": 0.1128
  },
  {
    "placement": "Economist_APAC_Audience_Display_Energy_Flex_ResponsiveBillboard",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 165126,
    "clicks": 137,
    "ctr": 0.083
  },
  {
    "placement": "FT_EMEATier1_CustomABM+Contextual_Display_300x250_Q4",
    "site": "FT",
    "region": "EMEA T1",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 164776,
    "clicks": 292,
    "ctr": 0.1772
  },
  {
    "placement": "Economist_EMEATier2_Subscribers_Display_300x250",
    "site": "The Economist",
    "region": "EMEA T2",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 162444,
    "clicks": 505,
    "ctr": 0.3109
  },
  {
    "placement": "Mobkoi_APAC_Audience_Display_Energy_MeetingDemand_Interscroller",
    "site": "Mobkoi",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Interscroller",
    "impressions": 160370,
    "clicks": 706,
    "ctr": 0.4402
  },
  {
    "placement": "Economist_APAC_Audience_Display_Energy_Flex_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 159459,
    "clicks": 119,
    "ctr": 0.0746
  },
  {
    "placement": "FT_EMEATier2_Subcribers_Display_300x250",
    "site": "FT",
    "region": "EMEA T2",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 152626,
    "clicks": 233,
    "ctr": 0.1527
  },
  {
    "placement": "FT_NAM_Contextual_Display_300x250",
    "site": "FT",
    "region": "NAM",
    "targeting": "Contextual",
    "format": "300x250",
    "impressions": 151936,
    "clicks": 234,
    "ctr": 0.154
  },
  {
    "placement": "FT_GLOBAL_Newswrap Newsletter_AV_Week3-4_MessageB_Display_AI_3Ways_300x250",
    "site": "FT",
    "region": "Global",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 150699,
    "clicks": 38,
    "ctr": 0.0252
  },
  {
    "placement": "FT_EMEATier1_Contextual_Display_300x250",
    "site": "FT",
    "region": "EMEA T1",
    "targeting": "Contextual",
    "format": "300x250",
    "impressions": 150012,
    "clicks": 280,
    "ctr": 0.1867
  },
  {
    "placement": "Economist_EMEATier1_Audience_Display_AI_CompetitiveAdvantage_ResponsiveBillboard",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 149924,
    "clicks": 118,
    "ctr": 0.0787
  },
  {
    "placement": "Economist_US_Subscribers_Display_Interscroller",
    "site": "The Economist",
    "region": "US",
    "targeting": "Subscribers",
    "format": "Interscroller",
    "impressions": 149371,
    "clicks": 638,
    "ctr": 0.4271
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_Energy_Flex_FolioStandard",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "Folio",
    "impressions": 147236,
    "clicks": 425,
    "ctr": 0.2887
  },
  {
    "placement": "FT_EMEATier2_Audience+Contextual_Display_300x250",
    "site": "FT",
    "region": "EMEA T2",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 146606,
    "clicks": 269,
    "ctr": 0.1835
  },
  {
    "placement": "WSJ_NAM_Subscribers_Display_300x600",
    "site": "WSJ",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "300x600",
    "impressions": 141340,
    "clicks": 135,
    "ctr": 0.0955
  },
  {
    "placement": "Economist_APAC_Subscribers_Display_AI_CompetitiveAdvantage_Interscroller",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Subscribers",
    "format": "Interscroller",
    "impressions": 141235,
    "clicks": 524,
    "ctr": 0.371
  },
  {
    "placement": "FT_NAM_Subscribers_Display_970x250",
    "site": "FT",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "970x250",
    "impressions": 140600,
    "clicks": 498,
    "ctr": 0.3542
  },
  {
    "placement": "Economist_US_Audience_Display_Energy_Flex_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "US",
    "targeting": "Audience",
    "format": "Other",
    "impressions": 139039,
    "clicks": 131,
    "ctr": 0.0942
  },
  {
    "placement": "FT_GLOBAL_Newswrap Newsletter_AV_Week1-2_MessageA_Display_AI_AIResults_300x250",
    "site": "FT",
    "region": "Global",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 138096,
    "clicks": 70,
    "ctr": 0.0507
  },
  {
    "placement": "Economist_US_Dec_Display_AI_ReimagineWins_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "Other",
    "impressions": 137488,
    "clicks": 111,
    "ctr": 0.0807
  },
  {
    "placement": "FT_GLOBAL_Newswrap Newsletter_AV_Week1-2_MessageB_Display_AI_InnovationIncrease_300x250",
    "site": "FT",
    "region": "Global",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 136738,
    "clicks": 39,
    "ctr": 0.0285
  },
  {
    "placement": "Economist_US_Subscribers_Display_AI_CompetitiveAdvantage_ResponsiveBillboard",
    "site": "The Economist",
    "region": "US",
    "targeting": "Subscribers",
    "format": "Other",
    "impressions": 136228,
    "clicks": 150,
    "ctr": 0.1101
  },
  {
    "placement": "Economist_US_Takeover_Business&Finance_Jan_Display_300x250_Q1",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 135556,
    "clicks": 60,
    "ctr": 0.0443
  },
  {
    "placement": "Economist_APAC_Dec_Display_AI_ReimagineWins_ResponsiveBillboard_Q4",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Other",
    "format": "Other",
    "impressions": 134774,
    "clicks": 126,
    "ctr": 0.0935
  },
  {
    "placement": "Economist_US_Feb_Display_Macro_STModels_Interscroller_Q1",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "Interscroller",
    "impressions": 128119,
    "clicks": 655,
    "ctr": 0.5112
  },
  {
    "placement": "WSJ_Global_RON_Display_300x250_Q1",
    "site": "WSJ",
    "region": "Global",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 110526,
    "clicks": 141,
    "ctr": 0.1276
  },
  {
    "placement": "Economist_APAC_Feb_Display_Macro_STModels_ResponsiveBillboard_Q1",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Other",
    "format": "Other",
    "impressions": 61664,
    "clicks": 53,
    "ctr": 0.0859
  },
  {
    "placement": "Economist_EMEATier1_Audience_Display_300x250_Q1",
    "site": "The Economist",
    "region": "EMEA T1",
    "targeting": "Audience",
    "format": "300x250",
    "impressions": 60429,
    "clicks": 104,
    "ctr": 0.1721
  },
  {
    "placement": "WSJ_Global_C-Suite_Display_300x600_Q1",
    "site": "WSJ",
    "region": "Global",
    "targeting": "C-Suite",
    "format": "300x600",
    "impressions": 52386,
    "clicks": 29,
    "ctr": 0.0554
  },
  {
    "placement": "FT_NAM_Subscribers_Display_300x250_Q1",
    "site": "FT",
    "region": "NAM",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 44545,
    "clicks": 52,
    "ctr": 0.1167
  },
  {
    "placement": "FT_EMEATier1_Subscribers_Display_300x250_Q1",
    "site": "FT",
    "region": "EMEA T1",
    "targeting": "Subscribers",
    "format": "300x250",
    "impressions": 44348,
    "clicks": 52,
    "ctr": 0.1173
  },
  {
    "placement": "Economist_APAC_Feb_Display_Macro_STModels_Interscroller_Q1",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Other",
    "format": "Interscroller",
    "impressions": 42660,
    "clicks": 267,
    "ctr": 0.6259
  },
  {
    "placement": "Economist_LATAM_Feb_Display_Macro_STModels_Interscroller_Q1",
    "site": "The Economist",
    "region": "LATAM",
    "targeting": "Other",
    "format": "Interscroller",
    "impressions": 42311,
    "clicks": 300,
    "ctr": 0.709
  },
  {
    "placement": "Economist_US_Takeover_Business&Finance_March_Display_300x600",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "300x600",
    "impressions": 42254,
    "clicks": 24,
    "ctr": 0.0568
  },
  {
    "placement": "WSJ_Global_C-Suite_Display_970x250_Q1",
    "site": "WSJ",
    "region": "Global",
    "targeting": "C-Suite",
    "format": "970x250",
    "impressions": 41799,
    "clicks": 31,
    "ctr": 0.0742
  },
  {
    "placement": "WSJ_Global_C-Suite_Display_Macro_STStrategyActions_FolioRiver_Q1",
    "site": "WSJ",
    "region": "Global",
    "targeting": "C-Suite",
    "format": "Folio",
    "impressions": 39972,
    "clicks": 43,
    "ctr": 0.1076
  },
  {
    "placement": "FT_EMEATier1_CustomABM+Contextual_Display_300x250_Q1",
    "site": "FT",
    "region": "EMEA T1",
    "targeting": "Aud+Context",
    "format": "300x250",
    "impressions": 39338,
    "clicks": 56,
    "ctr": 0.1424
  },
  {
    "placement": "Economist_US_Takeover_Business&Finance_March_Display_300x250",
    "site": "The Economist",
    "region": "US",
    "targeting": "Other",
    "format": "300x250",
    "impressions": 37596,
    "clicks": 39,
    "ctr": 0.1037
  },
  {
    "placement": "Economist_LATAM_Feb_Display_Macro_STModels_ResponsiveBillboard_Q1",
    "site": "The Economist",
    "region": "LATAM",
    "targeting": "Other",
    "format": "Other",
    "impressions": 31703,
    "clicks": 36,
    "ctr": 0.1136
  },
  {
    "placement": "Economist_APAC_Audience_Display_300x250_Q1",
    "site": "The Economist",
    "region": "APAC",
    "targeting": "Audience",
    "format": "300x250",
    "impressions": 30475,
    "clicks": 50,
    "ctr": 0.1641
  }
];

const TOTAL_IMPRESSIONS = 58845393;
const TOTAL_CLICKS = 132980;
const OVERALL_CTR = 0.226;

// Creative Analysis Data
const CREATIVE_THEMES = [
  {
    "theme": "AI",
    "impressions": 13768555,
    "clicks": 23766,
    "ctr": 0.17
  },
  {
    "theme": "Energy",
    "impressions": 5010267,
    "clicks": 7251,
    "ctr": 0.14
  },
  {
    "theme": "Macro",
    "impressions": 8442346,
    "clicks": 17812,
    "ctr": 0.21
  }
];
const CREATIVE_MESSAGES = [
  {
    "message": "CompetitiveAdvantage",
    "impressions": 2951506,
    "clicks": 6861,
    "ctr": 0.23
  },
  {
    "message": "Flex",
    "impressions": 2559876,
    "clicks": 3681,
    "ctr": 0.14
  },
  {
    "message": "ReimagineWins",
    "impressions": 2550397,
    "clicks": 3560,
    "ctr": 0.14
  },
  {
    "message": "AiResults",
    "impressions": 2412424,
    "clicks": 4371,
    "ctr": 0.18
  },
  {
    "message": "SeizeV2",
    "impressions": 2215971,
    "clicks": 5306,
    "ctr": 0.24
  },
  {
    "message": "UnstickTransformation",
    "impressions": 1189980,
    "clicks": 1336,
    "ctr": 0.11
  },
  {
    "message": "STModels",
    "impressions": 1925621,
    "clicks": 3880,
    "ctr": 0.2
  },
  {
    "message": "Navigation",
    "impressions": 1039435,
    "clicks": 980,
    "ctr": 0.09
  },
  {
    "message": "CostDiscipline",
    "impressions": 1036210,
    "clicks": 1520,
    "ctr": 0.15
  },
  {
    "message": "InsightsandResultsV2",
    "impressions": 868388,
    "clicks": 1930,
    "ctr": 0.22
  },
  {
    "message": "Resources",
    "impressions": 732535,
    "clicks": 727,
    "ctr": 0.1
  },
  {
    "message": "InsightsandResults",
    "impressions": 711901,
    "clicks": 813,
    "ctr": 0.11
  },
  {
    "message": "AgilityUncertainty",
    "impressions": 704550,
    "clicks": 2143,
    "ctr": 0.3
  },
  {
    "message": "TariffUncertainty",
    "impressions": 530361,
    "clicks": 556,
    "ctr": 0.1
  },
  {
    "message": "MakeAIWork",
    "impressions": 511987,
    "clicks": 859,
    "ctr": 0.17
  },
  {
    "message": "AiGrowth",
    "impressions": 500350,
    "clicks": 373,
    "ctr": 0.07
  },
  {
    "message": "AiWorld",
    "impressions": 421362,
    "clicks": 1753,
    "ctr": 0.42
  },
  {
    "message": "TariffActions",
    "impressions": 416667,
    "clicks": 1385,
    "ctr": 0.33
  },
  {
    "message": "STStrategyActions",
    "impressions": 444213,
    "clicks": 905,
    "ctr": 0.2
  },
  {
    "message": "DataCenterDemand",
    "impressions": 367093,
    "clicks": 888,
    "ctr": 0.24
  },
  {
    "message": "CEOActions",
    "impressions": 338223,
    "clicks": 705,
    "ctr": 0.21
  },
  {
    "message": "SupplyChain",
    "impressions": 320156,
    "clicks": 99,
    "ctr": 0.03
  },
  {
    "message": "MeetingDemand",
    "impressions": 311328,
    "clicks": 975,
    "ctr": 0.31
  },
  {
    "message": "STExpire",
    "impressions": 311283,
    "clicks": 868,
    "ctr": 0.28
  },
  {
    "message": "CompetitiveAdvantageV2",
    "impressions": 303494,
    "clicks": 124,
    "ctr": 0.04
  },
  {
    "message": "UncertaintyintoOpportunity",
    "impressions": 191506,
    "clicks": 380,
    "ctr": 0.2
  },
  {
    "message": "Transform",
    "impressions": 177757,
    "clicks": 104,
    "ctr": 0.06
  },
  {
    "message": "WinwithAi",
    "impressions": 154404,
    "clicks": 302,
    "ctr": 0.2
  },
  {
    "message": "3Ways",
    "impressions": 150699,
    "clicks": 38,
    "ctr": 0.03
  },
  {
    "message": "STLaggardsLeaders",
    "impressions": 144304,
    "clicks": 291,
    "ctr": 0.2
  },
  {
    "message": "InnovationIncrease",
    "impressions": 136738,
    "clicks": 39,
    "ctr": 0.03
  },
  {
    "message": "80Nearshoring",
    "impressions": 132726,
    "clicks": 392,
    "ctr": 0.3
  },
  {
    "message": "ScaledEffectively",
    "impressions": 110647,
    "clicks": 44,
    "ctr": 0.04
  },
  {
    "message": "AcceleratedGrowth",
    "impressions": 69749,
    "clicks": 133,
    "ctr": 0.19
  },
  {
    "message": "AIPilotstoGrowth",
    "impressions": 64537,
    "clicks": 127,
    "ctr": 0.2
  },
  {
    "message": "WinningClientStories",
    "impressions": 52846,
    "clicks": 113,
    "ctr": 0.21
  },
  {
    "message": "WinningClientStoriesV2",
    "impressions": 47817,
    "clicks": 107,
    "ctr": 0.22
  },
  {
    "message": "Headwinds",
    "impressions": 37270,
    "clicks": 15,
    "ctr": 0.04
  },
  {
    "message": "AcceleratedGrowthV2",
    "impressions": 21278,
    "clicks": 9,
    "ctr": 0.04
  },
  {
    "message": "Welcome",
    "impressions": 12207,
    "clicks": 20,
    "ctr": 0.16
  },
  {
    "message": "Frontpage",
    "impressions": 41236,
    "clicks": 107,
    "ctr": 0.26
  }
];
const MONTHLY_THEME_CTR = [
  {
    "month": "Jan",
    "Macro": 0.1
  },
  {
    "month": "Feb",
    "AI": 0.22
  },
  {
    "month": "Mar",
    "AI": 0.19,
    "Macro": 0.18
  },
  {
    "month": "Apr",
    "AI": 0.1,
    "Macro": 0.23,
    "Energy": 0.11
  },
  {
    "month": "May",
    "AI": 0.15,
    "Macro": 0.2
  },
  {
    "month": "Jun",
    "AI": 0.17,
    "Energy": 0.15
  },
  {
    "month": "Jul",
    "AI": 0.25,
    "Macro": 0.2
  },
  {
    "month": "Aug",
    "AI": 0.25,
    "Macro": 0.26
  },
  {
    "month": "Sep",
    "Macro": 0.12,
    "Energy": 0.18
  },
  {
    "month": "Oct",
    "AI": 0.14
  },
  {
    "month": "Nov",
    "AI": 0.14,
    "Energy": 0.13
  },
  {
    "month": "Dec",
    "AI": 0.11
  },
  {
    "month": "Jan '26"
  },
  {
    "month": "Feb '26"
  },
  {
    "month": "Mar '26",
    "Macro": 0.3
  }
];

// SOV Data
const SOV_FREQUENCY = {
  "WSJ": {
    "monthly": {
      "Feb": 3.25,
      "Mar": 3.6,
      "Apr": 3.18,
      "May": 2.85,
      "Jun": 2.83,
      "Jul": 4.36,
      "Aug": 4.51,
      "Sep": 3.63,
      "Oct": 3.04,
      "Nov": 4.04,
      "Dec": 4.8
    },
    "avg": 3.64
  },
  "Economist": {
    "monthly": {
      "Feb": 3.88,
      "Mar": 3.68,
      "Apr": 3.75,
      "May": 3.6,
      "Jun": 3.57,
      "Jul": 3.42,
      "Aug": 3.42,
      "Sep": 3.77,
      "Oct": 4.85,
      "Nov": 4.15,
      "Dec": 4.88
    },
    "avg": 3.91
  },
  "FT": {
    "monthly": {
      "Mar": 3.62,
      "Apr": 4.58,
      "May": 3.78,
      "Jun": 3.58,
      "Jul": 3.79,
      "Aug": 3.7,
      "Sep": 3.63,
      "Oct": 5.42,
      "Nov": 3.52,
      "Dec": 3.17
    },
    "avg": 3.88
  }
};
const AUDIENCE_DEFINITIONS = [
  {
    "publisher": "WSJ",
    "audience": "Subscribers",
    "definition": "Anyone that subscribes to WSJ",
    "size": 1700000
  },
  {
    "publisher": "WSJ",
    "audience": "ABM/Custom",
    "definition": "Fortune 500 companies OR CSuite senior decison makers (from ABM)",
    "size": 18700
  },
  {
    "publisher": "FT",
    "audience": "Audience / ABM",
    "definition": "ABM (Company size + Revenue OR CSuite) (Subscribers or Registered Readers)",
    "size": 1843648
  },
  {
    "publisher": "FT",
    "audience": "Contextual",
    "definition": "Just Contextual on topics (Prior agreed) - number of opportinities to show for subscribers and registered readers",
    "size": 11165691
  },
  {
    "publisher": "FT",
    "audience": "Subscribers",
    "definition": "Paid subscriptions (no Registered readers - and also people who may not have declared job titles so would be missed in ABM)",
    "size": 986072
  },
  {
    "publisher": "Economist",
    "audience": "Audience",
    "definition": "1PD/3PD Business Decision Makers (Not necceasily al subscribers)",
    "size": 1332000
  },
  {
    "publisher": "Economist",
    "audience": "Audience + Contextual",
    "definition": "ABM + contextual",
    "size": 8511000
  },
  {
    "publisher": "Economist",
    "audience": "Subscribers",
    "definition": "Can only be idenfied as subscribers when logged in",
    "size": 926000
  }
];
const PENETRATION_DATA = [
  {
    "audience": "Audience",
    "months": {
      "February": 4.23,
      "March": 6.45,
      "April": 6.72,
      "May": 6.93,
      "June": 7.66,
      "July": 8.35,
      "August": 10.68,
      "September": 11.97,
      "October": 22.12,
      "November": 12.43,
      "December": 8.51
    }
  },
  {
    "audience": "Audience + Contextual",
    "months": {
      "February": 0.47,
      "March": 0.75,
      "April": 0.74,
      "May": 0.73,
      "June": 0.79,
      "July": 0.72,
      "August": 0.86
    }
  },
  {
    "audience": "Subscribers",
    "months": {
      "February": 23.95,
      "March": 23.29,
      "April": 24.52,
      "May": 24.7,
      "June": 29.9,
      "July": 34.85,
      "August": 36.1,
      "September": 4.28,
      "November": 3.4
    }
  }
];
const FREQ_DETAIL = [
  {
    "audience": "Audience",
    "months": {
      "February": 2.06,
      "March": 2.81,
      "April": 2.72,
      "May": 2.75,
      "June": 3.01,
      "July": 2.86,
      "August": 2.98,
      "September": 4.16,
      "October": 3.5,
      "November": 4.78,
      "December": 5.53
    }
  },
  {
    "audience": "Audience + Contextual",
    "months": {
      "February": 1.89,
      "March": 2.01,
      "April": 2.16,
      "May": 2.19,
      "June": 2.46,
      "July": 2.24,
      "August": 2.31
    }
  },
  {
    "audience": "Subscribers",
    "months": {
      "February": 3.7,
      "March": 3.14,
      "April": 2.92,
      "May": 2.87,
      "June": 3.18,
      "July": 2.77,
      "August": 2.69,
      "September": 3.44,
      "November": 2.95
    }
  }
];

// 2026 Media Plan
const PLAN_2026 = {
  "WSJ": {
    "Feb": 50000,
    "Mar": 50000,
    "Apr": 40000,
    "May": 40000,
    "Jun": 40000,
    "Jul": 20000,
    "Aug": 20000,
    "Sep": 100000,
    "Oct": 100000,
    "Nov": 100000,
    "Dec": 100000,
    "Jan '27": 40000
  },
  "Economist": {
    "Feb": 50000,
    "Mar": 42058,
    "Apr": 35415,
    "May": 35415,
    "Jun": 19183,
    "Jul": 19183,
    "Aug": 19183,
    "Sep": 50729,
    "Oct": 35415,
    "Nov": 43195,
    "Dec": 19183,
    "Jan '27": 56562
  },
  "FT": {
    "March": 45833,
    "Apr": 45833,
    "May": 45833,
    "Jun": 45833,
    "Jul": 45833,
    "Aug": 45833,
    "Sep": 45833,
    "Oct": 45833,
    "Nov": 45833,
    "Dec": 45833,
    "Jan '27": 45833
  }
};