-- Assuming you have the following JSON data
WITH country_json AS (
    SELECT '[
  {
    "name": "Afghanistan",
    "code_2": "AF",
    "code_3": "AFG",
    "numeric": 4
  },
  {
    "name": "Albania",
    "code_2": "AL",
    "code_3": "ALB",
    "numeric": 8
  },
  {
    "name": "Algeria",
    "code_2": "DZ",
    "code_3": "DZA",
    "numeric": 12
  },
  {
    "name": "American Samoa",
    "code_2": "AS",
    "code_3": "ASM",
    "numeric": 16
  },
  {
    "name": "Andorra",
    "code_2": "AD",
    "code_3": "AND",
    "numeric": 20
  },
  {
    "name": "Angola",
    "code_2": "AO",
    "code_3": "AGO",
    "numeric": 24
  },
  {
    "name": "Anguilla",
    "code_2": "AI",
    "code_3": "AIA",
    "numeric": 660
  },
  {
    "name": "Antarctica",
    "code_2": "AQ",
    "code_3": "ATA",
    "numeric": 10
  },
  {
    "name": "Antigua and Barbuda",
    "code_2": "AG",
    "code_3": "ATG",
    "numeric": 28
  },
  {
    "name": "Argentina",
    "code_2": "AR",
    "code_3": "ARG",
    "numeric": 32
  },
  {
    "name": "Armenia",
    "code_2": "AM",
    "code_3": "ARM",
    "numeric": 51
  },
  {
    "name": "Aruba",
    "code_2": "AW",
    "code_3": "ABW",
    "numeric": 533
  },
  {
    "name": "Australia",
    "code_2": "AU",
    "code_3": "AUS",
    "numeric": 36
  },
  {
    "name": "Austria",
    "code_2": "AT",
    "code_3": "AUT",
    "numeric": 40
  },
  {
    "name": "Azerbaijan",
    "code_2": "AZ",
    "code_3": "AZE",
    "numeric": 31
  },
  {
    "name": "Bahamas",
    "code_2": "BS",
    "code_3": "BHS",
    "numeric": 44
  },
  {
    "name": "Bahrain",
    "code_2": "BH",
    "code_3": "BHR",
    "numeric": 48
  },
  {
    "name": "Bangladesh",
    "code_2": "BD",
    "code_3": "BGD",
    "numeric": 50
  },
  {
    "name": "Barbados",
    "code_2": "BB",
    "code_3": "BRB",
    "numeric": 52
  },
  {
    "name": "Belarus",
    "code_2": "BY",
    "code_3": "BLR",
    "numeric": 112
  },
  {
    "name": "Belgium",
    "code_2": "BE",
    "code_3": "BEL",
    "numeric": 56
  },
  {
    "name": "Belize",
    "code_2": "BZ",
    "code_3": "BLZ",
    "numeric": 84
  },
  {
    "name": "Benin",
    "code_2": "BJ",
    "code_3": "BEN",
    "numeric": 204
  },
  {
    "name": "Bermuda",
    "code_2": "BM",
    "code_3": "BMU",
    "numeric": 60
  },
  {
    "name": "Bhutan",
    "code_2": "BT",
    "code_3": "BTN",
    "numeric": 64
  },
  {
    "name": "Bolivia",
    "code_2": "BO",
    "code_3": "BOL",
    "numeric": 68
  },
  {
    "name": "Bonaire, Sint Eustatius and Saba",
    "code_2": "BQ",
    "code_3": "BES",
    "numeric": 535
  },
  {
    "name": "Bosnia and Herzegovina",
    "code_2": "BA",
    "code_3": "BIH",
    "numeric": 70
  },
  {
    "name": "Botswana",
    "code_2": "BW",
    "code_3": "BWA",
    "numeric": 72
  },
  {
    "name": "Bouvet Island",
    "code_2": "BV",
    "code_3": "BVT",
    "numeric": 74
  },
  {
    "name": "Brazil",
    "code_2": "BR",
    "code_3": "BRA",
    "numeric": 76
  },
  {
    "name": "British Indian Ocean Territory",
    "code_2": "IO",
    "code_3": "IOT",
    "numeric": 86
  },
  {
    "name": "Brunei Darussalam",
    "code_2": "BN",
    "code_3": "BRN",
    "numeric": 96
  },
  {
    "name": "Bulgaria",
    "code_2": "BG",
    "code_3": "BGR",
    "numeric": 100
  },
  {
    "name": "Burkina Faso",
    "code_2": "BF",
    "code_3": "BFA",
    "numeric": 854
  },
  {
    "name": "Burundi",
    "code_2": "BI",
    "code_3": "BDI",
    "numeric": 108
  },
  {
    "name": "Cabo Verde",
    "code_2": "CV",
    "code_3": "CPV",
    "numeric": 132
  },
  {
    "name": "Cambodia",
    "code_2": "KH",
    "code_3": "KHM",
    "numeric": 116
  },
  {
    "name": "Cameroon",
    "code_2": "CM",
    "code_3": "CMR",
    "numeric": 120
  },
  {
    "name": "Canada",
    "code_2": "CA",
    "code_3": "CAN",
    "numeric": 124
  },
  {
    "name": "Cayman Islands",
    "code_2": "KY",
    "code_3": "CYM",
    "numeric": 136
  },
  {
    "name": "Central African Republic",
    "code_2": "CF",
    "code_3": "CAF",
    "numeric": 140
  },
  {
    "name": "Chad",
    "code_2": "TD",
    "code_3": "TCD",
    "numeric": 148
  },
  {
    "name": "Chile",
    "code_2": "CL",
    "code_3": "CHL",
    "numeric": 152
  },
  {
    "name": "China",
    "code_2": "CN",
    "code_3": "CHN",
    "numeric": 156
  },
  {
    "name": "Christmas Island",
    "code_2": "CX",
    "code_3": "CXR",
    "numeric": 162
  },
  {
    "name": "Cocos (Keeling) Islands",
    "code_2": "CC",
    "code_3": "CCK",
    "numeric": 166
  },
  {
    "name": "Colombia",
    "code_2": "CO",
    "code_3": "COL",
    "numeric": 170
  },
  {
    "name": "Comoros",
    "code_2": "KM",
    "code_3": "COM",
    "numeric": 174
  },
  {
    "name": "Congo (the Democratic Republic of the)",
    "code_2": "CD",
    "code_3": "COD",
    "numeric": 180
  },
  {
    "name": "Congo",
    "code_2": "CG",
    "code_3": "COG",
    "numeric": 178
  },
  {
    "name": "Cook Islands",
    "code_2": "CK",
    "code_3": "COK",
    "numeric": 184
  },
  {
    "name": "Costa Rica",
    "code_2": "CR",
    "code_3": "CRI",
    "numeric": 188
  },
  {
    "name": "Croatia",
    "code_2": "HR",
    "code_3": "HRV",
    "numeric": 191
  },
  {
    "name": "Cuba",
    "code_2": "CU",
    "code_3": "CUB",
    "numeric": 192
  },
  {
    "name": "Curaçao",
    "code_2": "CW",
    "code_3": "CUW",
    "numeric": 531
  },
  {
    "name": "Cyprus",
    "code_2": "CY",
    "code_3": "CYP",
    "numeric": 196
  },
  {
    "name": "Czechia",
    "code_2": "CZ",
    "code_3": "CZE",
    "numeric": 203
  },
  {
    "name": "Côte dIvoire",
    "code_2": "CI",
    "code_3": "CIV",
    "numeric": 384
  },
  {
    "name": "Denmark",
    "code_2": "DK",
    "code_3": "DNK",
    "numeric": 208
  },
  {
    "name": "Djibouti",
    "code_2": "DJ",
    "code_3": "DJI",
    "numeric": 262
  },
  {
    "name": "Dominica",
    "code_2": "DM",
    "code_3": "DMA",
    "numeric": 212
  },
  {
    "name": "Dominican Republic",
    "code_2": "DO",
    "code_3": "DOM",
    "numeric": 214
  },
  {
    "name": "Ecuador",
    "code_2": "EC",
    "code_3": "ECU",
    "numeric": 218
  },
  {
    "name": "Egypt",
    "code_2": "EG",
    "code_3": "EGY",
    "numeric": 818
  },
  {
    "name": "El Salvador",
    "code_2": "SV",
    "code_3": "SLV",
    "numeric": 222
  },
  {
    "name": "Equatorial Guinea",
    "code_2": "GQ",
    "code_3": "GNQ",
    "numeric": 226
  },
  {
    "name": "Eritrea",
    "code_2": "ER",
    "code_3": "ERI",
    "numeric": 232
  },
  {
    "name": "Estonia",
    "code_2": "EE",
    "code_3": "EST",
    "numeric": 233
  },
  {
    "name": "Eswatini",
    "code_2": "SZ",
    "code_3": "SWZ",
    "numeric": 748
  },
  {
    "name": "Ethiopia",
    "code_2": "ET",
    "code_3": "ETH",
    "numeric": 231
  },
  {
    "name": "Falkland Islands [Malvinas]",
    "code_2": "FK",
    "code_3": "FLK",
    "numeric": 238
  },
  {
    "name": "Faroe Islands",
    "code_2": "FO",
    "code_3": "FRO",
    "numeric": 234
  },
  {
    "name": "Fiji",
    "code_2": "FJ",
    "code_3": "FJI",
    "numeric": 242
  },
  {
    "name": "Finland",
    "code_2": "FI",
    "code_3": "FIN",
    "numeric": 246
  },
  {
    "name": "France",
    "code_2": "FR",
    "code_3": "FRA",
    "numeric": 250
  },
  {
    "name": "French Guiana",
    "code_2": "GF",
    "code_3": "GUF",
    "numeric": 254
  },
  {
    "name": "French Polynesia",
    "code_2": "PF",
    "code_3": "PYF",
    "numeric": 258
  },
  {
    "name": "French Southern Territories",
    "code_2": "TF",
    "code_3": "ATF",
    "numeric": 260
  },
  {
    "name": "Gabon",
    "code_2": "GA",
    "code_3": "GAB",
    "numeric": 266
  },
  {
    "name": "Gambia",
    "code_2": "GM",
    "code_3": "GMB",
    "numeric": 270
  },
  {
    "name": "Georgia",
    "code_2": "GE",
    "code_3": "GEO",
    "numeric": 268
  },
  {
    "name": "Germany",
    "code_2": "DE",
    "code_3": "DEU",
    "numeric": 276
  },
  {
    "name": "Ghana",
    "code_2": "GH",
    "code_3": "GHA",
    "numeric": 288
  },
  {
    "name": "Gibraltar",
    "code_2": "GI",
    "code_3": "GIB",
    "numeric": 292
  },
  {
    "name": "Greece",
    "code_2": "GR",
    "code_3": "GRC",
    "numeric": 300
  },
  {
    "name": "Greenland",
    "code_2": "GL",
    "code_3": "GRL",
    "numeric": 304
  },
  {
    "name": "Grenada",
    "code_2": "GD",
    "code_3": "GRD",
    "numeric": 308
  },
  {
    "name": "Guadeloupe",
    "code_2": "GP",
    "code_3": "GLP",
    "numeric": 312
  },
  {
    "name": "Guam",
    "code_2": "GU",
    "code_3": "GUM",
    "numeric": 316
  },
  {
    "name": "Guatemala",
    "code_2": "GT",
    "code_3": "GTM",
    "numeric": 320
  },
  {
    "name": "Guernsey",
    "code_2": "GG",
    "code_3": "GGY",
    "numeric": 831
  },
  {
    "name": "Guinea",
    "code_2": "GN",
    "code_3": "GIN",
    "numeric": 324
  },
  {
    "name": "Guinea-Bissau",
    "code_2": "GW",
    "code_3": "GNB",
    "numeric": 624
  },
  {
    "name": "Guyana",
    "code_2": "GY",
    "code_3": "GUY",
    "numeric": 328
  },
  {
    "name": "Haiti",
    "code_2": "HT",
    "code_3": "HTI",
    "numeric": 332
  },
  {
    "name": "Heard Island and McDonald Islands",
    "code_2": "HM",
    "code_3": "HMD",
    "numeric": 334
  },
  {
    "name": "Holy See",
    "code_2": "VA",
    "code_3": "VAT",
    "numeric": 336
  },
  {
    "name": "Honduras",
    "code_2": "HN",
    "code_3": "HND",
    "numeric": 340
  },
  {
    "name": "Hong Kong",
    "code_2": "HK",
    "code_3": "HKG",
    "numeric": 344
  },
  {
    "name": "Hungary",
    "code_2": "HU",
    "code_3": "HUN",
    "numeric": 348
  },
  {
    "name": "Iceland",
    "code_2": "IS",
    "code_3": "ISL",
    "numeric": 352
  },
  {
    "name": "India",
    "code_2": "IN",
    "code_3": "IND",
    "numeric": 356
  },
  {
    "name": "Indonesia",
    "code_2": "ID",
    "code_3": "IDN",
    "numeric": 360
  },
  {
    "name": "Iran (Islamic Republic of)",
    "code_2": "IR",
    "code_3": "IRN",
    "numeric": 364
  },
  {
    "name": "Iraq",
    "code_2": "IQ",
    "code_3": "IRQ",
    "numeric": 368
  },
  {
    "name": "Ireland",
    "code_2": "IE",
    "code_3": "IRL",
    "numeric": 372
  },
  {
    "name": "Isle of Man",
    "code_2": "IM",
    "code_3": "IMN",
    "numeric": 833
  },
  {
    "name": "Israel",
    "code_2": "IL",
    "code_3": "ISR",
    "numeric": 376
  },
  {
    "name": "Italy",
    "code_2": "IT",
    "code_3": "ITA",
    "numeric": 380
  },
  {
    "name": "Jamaica",
    "code_2": "JM",
    "code_3": "JAM",
    "numeric": 388
  },
  {
    "name": "Japan",
    "code_2": "JP",
    "code_3": "JPN",
    "numeric": 392
  },
  {
    "name": "Jersey",
    "code_2": "JE",
    "code_3": "JEY",
    "numeric": 832
  },
  {
    "name": "Jordan",
    "code_2": "JO",
    "code_3": "JOR",
    "numeric": 400
  },
  {
    "name": "Kazakhstan",
    "code_2": "KZ",
    "code_3": "KAZ",
    "numeric": 398
  },
  {
    "name": "Kenya",
    "code_2": "KE",
    "code_3": "KEN",
    "numeric": 404
  },
  {
    "name": "Kiribati",
    "code_2": "KI",
    "code_3": "KIR",
    "numeric": 296
  },
  {
    "name": "Korea",
    "code_2": "KP",
    "code_3": "PRK",
    "numeric": 408
  },
  {
    "name": "Korea (the Republic of)",
    "code_2": "KR",
    "code_3": "KOR",
    "numeric": 410
  },
  {
    "name": "Kuwait",
    "code_2": "KW",
    "code_3": "KWT",
    "numeric": 414
  },
  {
    "name": "Kyrgyzstan",
    "code_2": "KG",
    "code_3": "KGZ",
    "numeric": 417
  },
  {
    "name": "Lao",
    "code_2": "LA",
    "code_3": "LAO",
    "numeric": 418
  },
  {
    "name": "Latvia",
    "code_2": "LV",
    "code_3": "LVA",
    "numeric": 428
  },
  {
    "name": "Lebanon",
    "code_2": "LB",
    "code_3": "LBN",
    "numeric": 422
  },
  {
    "name": "Lesotho",
    "code_2": "LS",
    "code_3": "LSO",
    "numeric": 426
  },
  {
    "name": "Liberia",
    "code_2": "LR",
    "code_3": "LBR",
    "numeric": 430
  },
  {
    "name": "Libya",
    "code_2": "LY",
    "code_3": "LBY",
    "numeric": 434
  },
  {
    "name": "Liechtenstein",
    "code_2": "LI",
    "code_3": "LIE",
    "numeric": 438
  },
  {
    "name": "Lithuania",
    "code_2": "LT",
    "code_3": "LTU",
    "numeric": 440
  },
  {
    "name": "Luxembourg",
    "code_2": "LU",
    "code_3": "LUX",
    "numeric": 442
  },
  {
    "name": "Macao",
    "code_2": "MO",
    "code_3": "MAC",
    "numeric": 446
  },
  {
    "name": "Madagascar",
    "code_2": "MG",
    "code_3": "MDG",
    "numeric": 450
  },
  {
    "name": "Malawi",
    "code_2": "MW",
    "code_3": "MWI",
    "numeric": 454
  },
  {
    "name": "Malaysia",
    "code_2": "MY",
    "code_3": "MYS",
    "numeric": 458
  },
  {
    "name": "Maldives",
    "code_2": "MV",
    "code_3": "MDV",
    "numeric": 462
  },
  {
    "name": "Mali",
    "code_2": "ML",
    "code_3": "MLI",
    "numeric": 466
  },
  {
    "name": "Malta",
    "code_2": "MT",
    "code_3": "MLT",
    "numeric": 470
  },
  {
    "name": "Marshall Islands",
    "code_2": "MH",
    "code_3": "MHL",
    "numeric": 584
  },
  {
    "name": "Martinique",
    "code_2": "MQ",
    "code_3": "MTQ",
    "numeric": 474
  },
  {
    "name": "Mauritania",
    "code_2": "MR",
    "code_3": "MRT",
    "numeric": 478
  },
  {
    "name": "Mauritius",
    "code_2": "MU",
    "code_3": "MUS",
    "numeric": 480
  },
  {
    "name": "Mayotte",
    "code_2": "YT",
    "code_3": "MYT",
    "numeric": 175
  },
  {
    "name": "Mexico",
    "code_2": "MX",
    "code_3": "MEX",
    "numeric": 484
  },
  {
    "name": "Micronesia",
    "code_2": "FM",
    "code_3": "FSM",
    "numeric": 583
  },
  {
    "name": "Moldova",
    "code_2": "MD",
    "code_3": "MDA",
    "numeric": 498
  },
  {
    "name": "Monaco",
    "code_2": "MC",
    "code_3": "MCO",
    "numeric": 492
  },
  {
    "name": "Mongolia",
    "code_2": "MN",
    "code_3": "MNG",
    "numeric": 496
  },
  {
    "name": "Montenegro",
    "code_2": "ME",
    "code_3": "MNE",
    "numeric": 499
  },
  {
    "name": "Montserrat",
    "code_2": "MS",
    "code_3": "MSR",
    "numeric": 500
  },
  {
    "name": "Morocco",
    "code_2": "MA",
    "code_3": "MAR",
    "numeric": 504
  },
  {
    "name": "Mozambique",
    "code_2": "MZ",
    "code_3": "MOZ",
    "numeric": 508
  },
  {
    "name": "Myanmar",
    "code_2": "MM",
    "code_3": "MMR",
    "numeric": 104
  },
  {
    "name": "Namibia",
    "code_2": "NA",
    "code_3": "NAM",
    "numeric": 516
  },
  {
    "name": "Nauru",
    "code_2": "NR",
    "code_3": "NRU",
    "numeric": 520
  },
  {
    "name": "Nepal",
    "code_2": "NP",
    "code_3": "NPL",
    "numeric": 524
  },
  {
    "name": "Netherlands",
    "code_2": "NL",
    "code_3": "NLD",
    "numeric": 528
  },
  {
    "name": "New Caledonia",
    "code_2": "NC",
    "code_3": "NCL",
    "numeric": 540
  },
  {
    "name": "New Zealand",
    "code_2": "NZ",
    "code_3": "NZL",
    "numeric": 554
  },
  {
    "name": "Nicaragua",
    "code_2": "NI",
    "code_3": "NIC",
    "numeric": 558
  },
  {
    "name": "Niger",
    "code_2": "NE",
    "code_3": "NER",
    "numeric": 562
  },
  {
    "name": "Nigeria",
    "code_2": "NG",
    "code_3": "NGA",
    "numeric": 566
  },
  {
    "name": "Niue",
    "code_2": "NU",
    "code_3": "NIU",
    "numeric": 570
  },
  {
    "name": "Norfolk Island",
    "code_2": "NF",
    "code_3": "NFK",
    "numeric": 574
  },
  {
    "name": "Northern Mariana Islands",
    "code_2": "MP",
    "code_3": "MNP",
    "numeric": 580
  },
  {
    "name": "Norway",
    "code_2": "NO",
    "code_3": "NOR",
    "numeric": 578
  },
  {
    "name": "Oman",
    "code_2": "OM",
    "code_3": "OMN",
    "numeric": 512
  },
  {
    "name": "Pakistan",
    "code_2": "PK",
    "code_3": "PAK",
    "numeric": 586
  },
  {
    "name": "Palau",
    "code_2": "PW",
    "code_3": "PLW",
    "numeric": 585
  },
  {
    "name": "Palestine",
    "code_2": "PS",
    "code_3": "PSE",
    "numeric": 275
  },
  {
    "name": "Panama",
    "code_2": "PA",
    "code_3": "PAN",
    "numeric": 591
  },
  {
    "name": "Papua New Guinea",
    "code_2": "PG",
    "code_3": "PNG",
    "numeric": 598
  },
  {
    "name": "Paraguay",
    "code_2": "PY",
    "code_3": "PRY",
    "numeric": 600
  },
  {
    "name": "Peru",
    "code_2": "PE",
    "code_3": "PER",
    "numeric": 604
  },
  {
    "name": "Philippines",
    "code_2": "PH",
    "code_3": "PHL",
    "numeric": 608
  },
  {
    "name": "Pitcairn",
    "code_2": "PN",
    "code_3": "PCN",
    "numeric": 612
  },
  {
    "name": "Poland",
    "code_2": "PL",
    "code_3": "POL",
    "numeric": 616
  },
  {
    "name": "Portugal",
    "code_2": "PT",
    "code_3": "PRT",
    "numeric": 620
  },
  {
    "name": "Puerto Rico",
    "code_2": "PR",
    "code_3": "PRI",
    "numeric": 630
  },
  {
    "name": "Qatar",
    "code_2": "QA",
    "code_3": "QAT",
    "numeric": 634
  },
  {
    "name": "Republic of North Macedonia",
    "code_2": "MK",
    "code_3": "MKD",
    "numeric": 807
  },
  {
    "name": "Romania",
    "code_2": "RO",
    "code_3": "ROU",
    "numeric": 642
  },
  {
    "name": "Russian Federation",
    "code_2": "RU",
    "code_3": "RUS",
    "numeric": 643
  },
  {
    "name": "Rwanda",
    "code_2": "RW",
    "code_3": "RWA",
    "numeric": 646
  },
  {
    "name": "Réunion",
    "code_2": "RE",
    "code_3": "REU",
    "numeric": 638
  },
  {
    "name": "Saint Barthélemy",
    "code_2": "BL",
    "code_3": "BLM",
    "numeric": 652
  },
  {
    "name": "Saint Helena, Ascension and Tristan da Cunha",
    "code_2": "SH",
    "code_3": "SHN",
    "numeric": 654
  },
  {
    "name": "Saint Kitts and Nevis",
    "code_2": "KN",
    "code_3": "KNA",
    "numeric": 659
  },
  {
    "name": "Saint Lucia",
    "code_2": "LC",
    "code_3": "LCA",
    "numeric": 662
  },
  {
    "name": "Saint Martin",
    "code_2": "MF",
    "code_3": "MAF",
    "numeric": 663
  },
  {
    "name": "Saint Pierre and Miquelon",
    "code_2": "PM",
    "code_3": "SPM",
    "numeric": 666
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "code_2": "VC",
    "code_3": "VCT",
    "numeric": 670
  },
  {
    "name": "Samoa",
    "code_2": "WS",
    "code_3": "WSM",
    "numeric": 882
  },
  {
    "name": "San Marino",
    "code_2": "SM",
    "code_3": "SMR",
    "numeric": 674
  },
  {
    "name": "Sao Tome and Principe",
    "code_2": "ST",
    "code_3": "STP",
    "numeric": 678
  },
  {
    "name": "Saudi Arabia",
    "code_2": "SA",
    "code_3": "SAU",
    "numeric": 682
  },
  {
    "name": "Senegal",
    "code_2": "SN",
    "code_3": "SEN",
    "numeric": 686
  },
  {
    "name": "Serbia",
    "code_2": "RS",
    "code_3": "SRB",
    "numeric": 688
  },
  {
    "name": "Seychelles",
    "code_2": "SC",
    "code_3": "SYC",
    "numeric": 690
  },
  {
    "name": "Sierra Leone",
    "code_2": "SL",
    "code_3": "SLE",
    "numeric": 694
  },
  {
    "name": "Singapore",
    "code_2": "SG",
    "code_3": "SGP",
    "numeric": 702
  },
  {
    "name": "Sint Maarten",
    "code_2": "SX",
    "code_3": "SXM",
    "numeric": 534
  },
  {
    "name": "Slovakia",
    "code_2": "SK",
    "code_3": "SVK",
    "numeric": 703
  },
  {
    "name": "Slovenia",
    "code_2": "SI",
    "code_3": "SVN",
    "numeric": 705
  },
  {
    "name": "Solomon Islands",
    "code_2": "SB",
    "code_3": "SLB",
    "numeric": 90
  },
  {
    "name": "Somalia",
    "code_2": "SO",
    "code_3": "SOM",
    "numeric": 706
  },
  {
    "name": "South Africa",
    "code_2": "ZA",
    "code_3": "ZAF",
    "numeric": 710
  },
  {
    "name": "South Georgia and the South Sandwich Islands",
    "code_2": "GS",
    "code_3": "SGS",
    "numeric": 239
  },
  {
    "name": "South Sudan",
    "code_2": "SS",
    "code_3": "SSD",
    "numeric": 728
  },
  {
    "name": "Spain",
    "code_2": "ES",
    "code_3": "ESP",
    "numeric": 724
  },
  {
    "name": "Sri Lanka",
    "code_2": "LK",
    "code_3": "LKA",
    "numeric": 144
  },
  {
    "name": "Sudan",
    "code_2": "SD",
    "code_3": "SDN",
    "numeric": 729
  },
  {
    "name": "Suriname",
    "code_2": "SR",
    "code_3": "SUR",
    "numeric": 740
  },
  {
    "name": "Svalbard and Jan Mayen",
    "code_2": "SJ",
    "code_3": "SJM",
    "numeric": 744
  },
  {
    "name": "Sweden",
    "code_2": "SE",
    "code_3": "SWE",
    "numeric": 752
  },
  {
    "name": "Switzerland",
    "code_2": "CH",
    "code_3": "CHE",
    "numeric": 756
  },
  {
    "name": "Syrian Arab Republic",
    "code_2": "SY",
    "code_3": "SYR",
    "numeric": 760
  },
  {
    "name": "Taiwan (Province of China)",
    "code_2": "TW",
    "code_3": "TWN",
    "numeric": 158
  },
  {
    "name": "Tajikistan",
    "code_2": "TJ",
    "code_3": "TJK",
    "numeric": 762
  },
  {
    "name": "Tanzania, United Republic of",
    "code_2": "TZ",
    "code_3": "TZA",
    "numeric": 834
  },
  {
    "name": "Thailand",
    "code_2": "TH",
    "code_3": "THA",
    "numeric": 764
  },
  {
    "name": "Timor-Leste",
    "code_2": "TL",
    "code_3": "TLS",
    "numeric": 626
  },
  {
    "name": "Togo",
    "code_2": "TG",
    "code_3": "TGO",
    "numeric": 768
  },
  {
    "name": "Tokelau",
    "code_2": "TK",
    "code_3": "TKL",
    "numeric": 772
  },
  {
    "name": "Tonga",
    "code_2": "TO",
    "code_3": "TON",
    "numeric": 776
  },
  {
    "name": "Trinidad and Tobago",
    "code_2": "TT",
    "code_3": "TTO",
    "numeric": 780
  },
  {
    "name": "Tunisia",
    "code_2": "TN",
    "code_3": "TUN",
    "numeric": 788
  },
  {
    "name": "Turkey",
    "code_2": "TR",
    "code_3": "TUR",
    "numeric": 792
  },
  {
    "name": "Turkmenistan",
    "code_2": "TM",
    "code_3": "TKM",
    "numeric": 795
  },
  {
    "name": "Turks and Caicos Islands",
    "code_2": "TC",
    "code_3": "TCA",
    "numeric": 796
  },
  {
    "name": "Tuvalu",
    "code_2": "TV",
    "code_3": "TUV",
    "numeric": 798
  },
  {
    "name": "Uganda",
    "code_2": "UG",
    "code_3": "UGA",
    "numeric": 800
  },
  {
    "name": "Ukraine",
    "code_2": "UA",
    "code_3": "UKR",
    "numeric": 804
  },
  {
    "name": "United Arab Emirates",
    "code_2": "AE",
    "code_3": "ARE",
    "numeric": 784
  },
  {
    "name": "United Kingdom of Great Britain and Northern Ireland",
    "code_2": "GB",
    "code_3": "GBR",
    "numeric": 826
  },
  {
    "name": "United States Minor Outlying Islands",
    "code_2": "UM",
    "code_3": "UMI",
    "numeric": 581
  },
  {
    "name": "United States of America",
    "code_2": "US",
    "code_3": "USA",
    "numeric": 840
  },
  {
    "name": "Uruguay",
    "code_2": "UY",
    "code_3": "URY",
    "numeric": 858
  },
  {
    "name": "Uzbekistan",
    "code_2": "UZ",
    "code_3": "UZB",
    "numeric": 860
  },
  {
    "name": "Vanuatu",
    "code_2": "VU",
    "code_3": "VUT",
    "numeric": 548
  },
  {
    "name": "Venezuela",
    "code_2": "VE",
    "code_3": "VEN",
    "numeric": 862
  },
  {
    "name": "Viet Nam",
    "code_2": "VN",
    "code_3": "VNM",
    "numeric": 704
  },
  {
    "name": "Virgin Islands (British)",
    "code_2": "VG",
    "code_3": "VGB",
    "numeric": 92
  },
  {
    "name": "Virgin Islands (U.S.)",
    "code_2": "VI",
    "code_3": "VIR",
    "numeric": 850
  },
  {
    "name": "Wallis and Futuna",
    "code_2": "WF",
    "code_3": "WLF",
    "numeric": 876
  },
  {
    "name": "Western Sahara",
    "code_2": "EH",
    "code_3": "ESH",
    "numeric": 732
  },
  {
    "name": "Yemen",
    "code_2": "YE",
    "code_3": "YEM",
    "numeric": 887
  },
  {
    "name": "Zambia",
    "code_2": "ZM",
    "code_3": "ZMB",
    "numeric": 894
  },
  {
    "name": "Zimbabwe",
    "code_2": "ZW",
    "code_3": "ZWE",
    "numeric": 716
  },
  {
    "name": "Åland Islands",
    "code_2": "AX",
    "code_3": "ALA",
    "numeric": 248
  }
    ]'::jsonb AS data
),

-- Transform the JSON data into a set of rows
country_records AS (
    SELECT 
        country.name,
        country.code_3
    FROM 
        jsonb_to_recordset((SELECT data FROM country_json)) AS country(name TEXT, code_3 TEXT)
)

UPDATE countries
SET code_3 = country_records.code_3
FROM country_records
WHERE countries.name = country_records.name;
