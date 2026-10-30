export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface FPLPlayer {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  points: number;
  price: number;
}

// Complete 2026/27 FPL player database from official data
export const fplPlayers: FPLPlayer[] = [
  // === ARSENAL ===
  { id: "raya", name: "Raya", teamId: "ars", position: "GK", points: 49, price: 6.2 },
  { id: "gabriel_ars", name: "Gabriel", teamId: "ars", position: "DEF", points: 52, price: 7.9 },
  { id: "j_timber", name: "J.Timber", teamId: "ars", position: "DEF", points: 3, price: 6.5 },
  { id: "saliba", name: "Saliba", teamId: "ars", position: "DEF", points: 0, price: 5.9 },
  { id: "calafiori", name: "Calafiori", teamId: "ars", position: "DEF", points: 45, price: 5.9 },
  { id: "white", name: "White", teamId: "ars", position: "DEF", points: 42, price: 5.4 },
  { id: "hincapie", name: "Hincapie", teamId: "ars", position: "DEF", points: 3, price: 5.2 },
  { id: "mosquera", name: "Mosquera", teamId: "ars", position: "DEF", points: 12, price: 5.2 },
  { id: "konsa", name: "Konsa", teamId: "ars", position: "DEF", points: 39, price: 4.7 },
  { id: "saka", name: "Saka", teamId: "ars", position: "MID", points: 37, price: 9.5 },
  { id: "odegaard", name: "Ødegaard", teamId: "ars", position: "MID", points: 36, price: 6.7 },
  { id: "bruno_g_ars", name: "Bruno G.", teamId: "ars", position: "MID", points: 22, price: 6.7 },
  { id: "rice", name: "Rice", teamId: "ars", position: "MID", points: 39, price: 7.4 },
  { id: "martinelli", name: "Martinelli", teamId: "ars", position: "MID", points: 0, price: 6.3 },
  { id: "eze_ars", name: "Eze", teamId: "ars", position: "MID", points: 8, price: 6.2 },
  { id: "madueke", name: "Madueke", teamId: "ars", position: "MID", points: 12, price: 6.2 },
  { id: "tziolis", name: "Tzolis", teamId: "ars", position: "MID", points: 16, price: 6.1 },
  { id: "merino", name: "Merino", teamId: "ars", position: "MID", points: 9, price: 5.7 },
  { id: "lewis_skelly", name: "Lewis-Skelly", teamId: "ars", position: "MID", points: 13, price: 5.4 },
  { id: "zubimendi", name: "Zubimendi", teamId: "ars", position: "MID", points: 6, price: 5.2 },
  { id: "havertz", name: "Havertz", teamId: "ars", position: "FWD", points: 24, price: 7.4 },
  { id: "skeres", name: "Skeres", teamId: "ars", position: "FWD", points: 9, price: 7.0 },
  { id: "g_jesus", name: "G.Jesus", teamId: "ars", position: "FWD", points: 0, price: 5.9 },

  // === ASTON VILLA ===
  { id: "suzuki", name: "Suzuki", teamId: "avl", position: "GK", points: 30, price: 5.0 },
  { id: "m_bizot", name: "M.Bizot", teamId: "avl", position: "GK", points: 1, price: 4.5 },
  { id: "digne", name: "Digne", teamId: "avl", position: "DEF", points: 0, price: 4.5 },
  { id: "mings", name: "Mings", teamId: "avl", position: "DEF", points: 18, price: 4.5 },
  { id: "konsa_avl", name: "Konsa", teamId: "avl", position: "DEF", points: 22, price: 4.5 },
  { id: "wan_bissaka", name: "Wan-Bissaka", teamId: "avl", position: "DEF", points: 13, price: 4.5 },
  { id: "pau", name: "Pau", teamId: "avl", position: "DEF", points: 6, price: 4.4 },
  { id: "maatsen", name: "Maatsen", teamId: "avl", position: "DEF", points: 11, price: 4.4 },
  { id: "cash", name: "Cash", teamId: "avl", position: "DEF", points: 17, price: 4.3 },
  { id: "manzambi", name: "Manzambi", teamId: "avl", position: "MID", points: 31, price: 6.1 },
  { id: "mbaye", name: "Mbaye", teamId: "avl", position: "MID", points: 8, price: 6.0 },
  { id: "gomes_avl", name: "Gomes", teamId: "avl", position: "MID", points: 11, price: 5.5 },
  { id: "mcginn", name: "McGinn", teamId: "avl", position: "MID", points: 34, price: 5.4 },
  { id: "barkley", name: "Barkley", teamId: "avl", position: "MID", points: 13, price: 5.0 },
  { id: "kamara_avl", name: "Kamara", teamId: "avl", position: "MID", points: 28, price: 5.0 },
  { id: "goretzka", name: "Goretzka", teamId: "avl", position: "MID", points: 2, price: 5.9 },
  { id: "watkins", name: "Watkins", teamId: "avl", position: "FWD", points: 0, price: 7.8 },
  { id: "n_jackson", name: "N.Jackson", teamId: "avl", position: "FWD", points: 34, price: 6.8 },
  { id: "abraham", name: "Abraham", teamId: "avl", position: "FWD", points: 4, price: 5.5 },

  // === AFC BOURNEMOUTH ===
  { id: "di_gregorio", name: "Di Gregorio", teamId: "bou", position: "GK", points: 0, price: 4.5 },
  { id: "forster", name: "Forster", teamId: "bou", position: "GK", points: 0, price: 4.0 },
  { id: "hill", name: "Hill", teamId: "bou", position: "DEF", points: 32, price: 5.5 },
  { id: "truffert", name: "Truffert", teamId: "bou", position: "DEF", points: 25, price: 5.4 },
  { id: "silva_bou", name: "Silva", teamId: "bou", position: "DEF", points: 29, price: 5.0 },
  { id: "smith_bou", name: "Smith", teamId: "bou", position: "DEF", points: 16, price: 4.5 },
  { id: "kroupi_jr", name: "Kroupi.Jr", teamId: "bou", position: "MID", points: 1, price: 7.3 },
  { id: "rayan", name: "Rayan", teamId: "bou", position: "MID", points: 25, price: 6.3 },
  { id: "tavernier", name: "Tavernier", teamId: "bou", position: "MID", points: 52, price: 6.4 },
  { id: "scott_bou", name: "Scott", teamId: "bou", position: "MID", points: 30, price: 5.9 },
  { id: "kluivert", name: "Kluivert", teamId: "bou", position: "MID", points: 22, price: 5.9 },
  { id: "cook", name: "Cook", teamId: "bou", position: "MID", points: 17, price: 5.0 },
  { id: "adams", name: "Adams", teamId: "bou", position: "MID", points: 20, price: 5.0 },
  { id: "christie_bou", name: "Christie", teamId: "bou", position: "MID", points: 11, price: 5.0 },
  { id: "evanilson", name: "Evanilson", teamId: "bou", position: "FWD", points: 43, price: 6.3 },
  { id: "rodriguez", name: "Rodriguez", teamId: "bou", position: "FWD", points: 4, price: 6.0 },

  // === BRENTFORD ===
  { id: "kelleher", name: "Kelleher", teamId: "bre", position: "GK", points: 26, price: 5.0 },
  { id: "collins", name: "Collins", teamId: "bre", position: "DEF", points: 10, price: 5.4 },
  { id: "van_den_berg", name: "Van den Berg", teamId: "bre", position: "DEF", points: 3, price: 4.9 },
  { id: "ajer", name: "Ajer", teamId: "bre", position: "DEF", points: 32, price: 4.5 },
  { id: "hickey", name: "Hickey", teamId: "bre", position: "DEF", points: 8, price: 4.5 },
  { id: "pinnock", name: "Pinnock", teamId: "bre", position: "DEF", points: 21, price: 4.5 },
  { id: "schuster", name: "Schuster", teamId: "bre", position: "DEF", points: 22, price: 4.5 },
  { id: "kayode", name: "Kayode", teamId: "bre", position: "DEF", points: 28, price: 4.6 },
  // Mbeumo moved to Man Utd (see Man Utd section)
  { id: "schade", name: "Schade", teamId: "bre", position: "MID", points: 42, price: 6.2 },
  { id: "o_dango", name: "O.Dango", teamId: "bre", position: "MID", points: 19, price: 6.2 },
  { id: "anthony", name: "Anthony", teamId: "bre", position: "MID", points: 23, price: 5.9 },
  { id: "lewis_potter", name: "Lewis-Potter", teamId: "bre", position: "MID", points: 35, price: 5.5 },
  { id: "jensen", name: "Jensen", teamId: "bre", position: "MID", points: 10, price: 5.4 },
  { id: "damsgaard", name: "Damsgaard", teamId: "bre", position: "MID", points: 18, price: 5.3 },
  { id: "janelt", name: "Janelt", teamId: "bre", position: "MID", points: 30, price: 5.0 },
  { id: "thiago", name: "Thiago", teamId: "bre", position: "FWD", points: 23, price: 7.8 },
  { id: "wilson_bre", name: "Wilson", teamId: "bre", position: "FWD", points: 4, price: 5.4 },

  // === BRIGHTON ===
  { id: "verbruggen", name: "Verbruggen", teamId: "bri", position: "GK", points: 40, price: 4.6 },
  { id: "de_cuyper", name: "De Cuyper", teamId: "bri", position: "DEF", points: 60, price: 5.3 },
  { id: "vuskovic", name: "Vuskovic", teamId: "bri", position: "DEF", points: 52, price: 5.2 },
  { id: "svoboda", name: "Svoboda", teamId: "bri", position: "DEF", points: 2, price: 5.0 },
  { id: "struijk", name: "Struijk", teamId: "bri", position: "DEF", points: 5, price: 4.9 },
  { id: "boscagli", name: "Boscagli", teamId: "bri", position: "DEF", points: 33, price: 4.5 },
  { id: "dunk", name: "Dunk", teamId: "bri", position: "DEF", points: 30, price: 4.5 },
  { id: "mitoma", name: "Mitoma", teamId: "bri", position: "MID", points: 0, price: 5.9 },
  { id: "hinshelwood", name: "Hinshelwood", teamId: "bri", position: "MID", points: 23, price: 5.9 },
  { id: "minteh", name: "Minteh", teamId: "bri", position: "MID", points: 0, price: 5.8 },
  { id: "gomez_bri", name: "Gomez", teamId: "bri", position: "MID", points: 39, price: 5.0 },
  { id: "ayari", name: "Ayari", teamId: "bri", position: "MID", points: 33, price: 5.4 },
  { id: "wieffer", name: "Wieffer", teamId: "bri", position: "DEF", points: 7, price: 4.8 },
  { id: "kostoulas", name: "Kostoulas", teamId: "bri", position: "FWD", points: 43, price: 5.8 },
  { id: "david", name: "David", teamId: "bri", position: "FWD", points: 1, price: 5.9 },
  { id: "georginio", name: "Georginio", teamId: "bri", position: "FWD", points: 12, price: 5.3 },

  // === CHELSEA ===
  { id: "martinez_che", name: "Martinez", teamId: "che", position: "GK", points: 20, price: 5.0 },
  { id: "lacroix", name: "Lacroix", teamId: "che", position: "DEF", points: 24, price: 5.9 },
  { id: "chalobah", name: "Chalobah", teamId: "che", position: "DEF", points: 0, price: 5.5 },
  { id: "palestra", name: "Palestra", teamId: "che", position: "DEF", points: 2, price: 5.3 },
  { id: "fofana_che", name: "Fofana", teamId: "che", position: "DEF", points: 8, price: 5.0 },
  { id: "gusto", name: "Gusto", teamId: "che", position: "DEF", points: 5, price: 4.8 },
  { id: "colwill", name: "Colwill", teamId: "che", position: "DEF", points: 14, price: 4.8 },
  { id: "hato", name: "Hato", teamId: "che", position: "DEF", points: 25, price: 4.5 },
  { id: "palmer", name: "Palmer", teamId: "che", position: "MID", points: 37, price: 9.8 },
  { id: "rogers_che", name: "Rogers", teamId: "che", position: "MID", points: 41, price: 8.0 },
  { id: "neto", name: "Neto", teamId: "che", position: "MID", points: 37, price: 6.6 },
  { id: "madueke_che", name: "Madueke", teamId: "che", position: "MID", points: 6, price: 6.3 },
  { id: "enzo_che", name: "Enzo", teamId: "che", position: "MID", points: 19, price: 6.9 },
  { id: "caicedo", name: "Caicedo", teamId: "che", position: "MID", points: 8, price: 5.3 },
  { id: "joao_pedro", name: "João Pedro", teamId: "che", position: "FWD", points: 47, price: 7.8 },
  { id: "welbeck", name: "Welbeck", teamId: "che", position: "FWD", points: 7, price: 5.8 },

  // === COVENTRY CITY ===
  { id: "rushworth", name: "Rushworth", teamId: "cov", position: "GK", points: 22, price: 4.5 },
  { id: "thomas_cov", name: "Thomas", teamId: "cov", position: "DEF", points: 32, price: 4.0 },
  { id: "dasilva_cov", name: "Dasilva", teamId: "cov", position: "DEF", points: 27, price: 4.0 },
  { id: "pinnock_cov", name: "Pinnock", teamId: "cov", position: "DEF", points: 21, price: 4.5 },
  { id: "van_ewijk", name: "van Ewijk", teamId: "cov", position: "DEF", points: 15, price: 3.9 },
  { id: "mason_clark", name: "Mason-Clark", teamId: "cov", position: "MID", points: 10, price: 5.3 },
  { id: "torp", name: "Torp", teamId: "cov", position: "MID", points: 4, price: 5.3 },
  { id: "rudoni", name: "Rudoni", teamId: "cov", position: "MID", points: 28, price: 4.9 },
  { id: "grimes", name: "Grimes", teamId: "cov", position: "MID", points: 17, price: 4.8 },
  { id: "sakamoto", name: "Sakamoto", teamId: "cov", position: "MID", points: 6, price: 4.8 },
  { id: "wright_cov", name: "Wright", teamId: "cov", position: "FWD", points: 0, price: 5.3 },
  { id: "thomas_asante", name: "Thomas-Asante", teamId: "cov", position: "FWD", points: 21, price: 5.0 },
  { id: "cherif", name: "Cherif", teamId: "cov", position: "FWD", points: 16, price: 5.0 },
  { id: "simms", name: "Simms", teamId: "cov", position: "FWD", points: 10, price: 4.9 },

  // === CRYSTAL PALACE ===
  { id: "henderson", name: "Henderson", teamId: "cry", position: "GK", points: 5, price: 4.9 },
  { id: "khalaili", name: "Khalaili", teamId: "cry", position: "DEF", points: 21, price: 5.0 },
  { id: "richards", name: "Richards", teamId: "cry", position: "DEF", points: 23, price: 4.9 },
  { id: "mitchell_cry", name: "Mitchell", teamId: "cry", position: "DEF", points: 29, price: 4.5 },
  { id: "chilwell", name: "Chilwell", teamId: "cry", position: "DEF", points: 8, price: 4.4 },
  { id: "sarr_cry", name: "Sarr", teamId: "cry", position: "MID", points: 2, price: 6.2 },
  { id: "yeremy", name: "Yeremy", teamId: "cry", position: "MID", points: 26, price: 5.5 },
  { id: "kamada", name: "Kamada", teamId: "cry", position: "MID", points: 32, price: 5.0 },
  { id: "wharton", name: "Wharton", teamId: "cry", position: "MID", points: 23, price: 5.4 },
  { id: "mcneil_cry", name: "McNeil", teamId: "cry", position: "MID", points: 7, price: 5.3 },
  { id: "mateta", name: "Mateta", teamId: "cry", position: "FWD", points: 5, price: 6.3 },
  { id: "strand_larsen", name: "Strand Larsen", teamId: "cry", position: "FWD", points: 21, price: 6.0 },
  { id: "nketiah", name: "Nketiah", teamId: "cry", position: "FWD", points: 11, price: 5.4 },

  // === EVERTON ===
  { id: "pickford", name: "Pickford", teamId: "eve", position: "GK", points: 29, price: 5.5 },
  { id: "tarkowski", name: "Tarkowski", teamId: "eve", position: "DEF", points: 48, price: 6.2 },
  { id: "branthwaite", name: "Branthwaite", teamId: "eve", position: "DEF", points: 31, price: 5.5 },
  { id: "mykolenko", name: "Mykolenko", teamId: "eve", position: "DEF", points: 28, price: 4.5 },
  { id: "keane", name: "Keane", teamId: "eve", position: "DEF", points: 1, price: 4.7 },
  { id: "maitland_niles", name: "Maitland-Niles", teamId: "eve", position: "DEF", points: 26, price: 4.5 },
  { id: "dewsbury_hall", name: "Dewsbury-Hall", teamId: "eve", position: "MID", points: 37, price: 6.6 },
  { id: "grealish", name: "Grealish", teamId: "eve", position: "MID", points: 10, price: 6.5 },
  { id: "garner", name: "Garner", teamId: "eve", position: "MID", points: 20, price: 6.0 },
  { id: "johnson_eve", name: "Johnson", teamId: "eve", position: "MID", points: 14, price: 5.8 },
  { id: "george_eve", name: "George", teamId: "eve", position: "MID", points: 23, price: 5.5 },
  { id: "armstrong", name: "Armstrong", teamId: "eve", position: "MID", points: 23, price: 5.0 },
  { id: "barry", name: "Barry", teamId: "eve", position: "FWD", points: 30, price: 5.6 },
  { id: "beto", name: "Beto", teamId: "eve", position: "FWD", points: 2, price: 5.4 },

  // === FULHAM ===
  { id: "leno", name: "Leno", teamId: "ful", position: "GK", points: 34, price: 4.5 },
  { id: "andersen", name: "Andersen", teamId: "ful", position: "DEF", points: 3, price: 5.0 },
  { id: "bassey", name: "Bassey", teamId: "ful", position: "DEF", points: 33, price: 4.5 },
  { id: "castagne", name: "Castagne", teamId: "ful", position: "DEF", points: 35, price: 4.5 },
  { id: "robinson", name: "Robinson", teamId: "ful", position: "DEF", points: 26, price: 4.4 },
  { id: "affengruber", name: "Affengruber", teamId: "ful", position: "DEF", points: 27, price: 4.5 },
  { id: "king", name: "King", teamId: "ful", position: "MID", points: 34, price: 5.6 },
  { id: "iwobi", name: "Iwobi", teamId: "ful", position: "MID", points: 32, price: 5.4 },
  { id: "bob", name: "Bobb", teamId: "ful", position: "MID", points: 30, price: 5.5 },
  { id: "smith_rowe", name: "Smith Rowe", teamId: "ful", position: "MID", points: 3, price: 5.3 },
  { id: "palacios_ful", name: "Palacios", teamId: "ful", position: "MID", points: 14, price: 5.3 },
  { id: "gonzalo", name: "Gonzalo", teamId: "ful", position: "FWD", points: 20, price: 6.0 },
  { id: "muniz", name: "Muniz", teamId: "ful", position: "FWD", points: 5, price: 5.3 },

  // === HULL CITY ===
  { id: "tzolakis", name: "Tzolakis", teamId: "hul", position: "GK", points: 42, price: 4.7 },
  { id: "ajayi", name: "Ajayi", teamId: "hul", position: "DEF", points: 34, price: 4.2 },
  { id: "egan", name: "Egan", teamId: "hul", position: "DEF", points: 35, price: 4.1 },
  { id: "mendy", name: "Mendy", teamId: "hul", position: "DEF", points: 28, price: 4.1 },
  { id: "giles", name: "Giles", teamId: "hul", position: "DEF", points: 29, price: 4.0 },
  { id: "belloumi", name: "Belloumi", teamId: "hul", position: "MID", points: 43, price: 5.2 },
  { id: "thomas_hul", name: "Thomas", teamId: "hul", position: "MID", points: 13, price: 5.5 },
  { id: "stroud", name: "Stroud", teamId: "hul", position: "MID", points: 15, price: 4.9 },
  { id: "slater", name: "Slater", teamId: "hul", position: "MID", points: 20, price: 4.5 },
  { id: "mc burnie", name: "McBurnie", teamId: "hul", position: "FWD", points: 24, price: 5.5 },
  { id: "vaz", name: "Vaz", teamId: "hul", position: "FWD", points: 5, price: 5.0 },

  // === IPSWICH TOWN ===
  { id: "walton", name: "Walton", teamId: "ips", position: "GK", points: 9, price: 4.4 },
  { id: "o_shea", name: "O'Shea", teamId: "ips", position: "DEF", points: 26, price: 4.0 },
  { id: "davis_ips", name: "Davis", teamId: "ips", position: "DEF", points: 28, price: 4.0 },
  { id: "diop", name: "Diop", teamId: "ips", position: "DEF", points: 18, price: 3.9 },
  { id: "enciso", name: "Enciso", teamId: "ips", position: "MID", points: 29, price: 5.5 },
  { id: "fatawu", name: "Fatawu", teamId: "ips", position: "MID", points: 14, price: 5.4 },
  { id: "philogene", name: "Philogene", teamId: "ips", position: "MID", points: 6, price: 5.4 },
  { id: "clarke", name: "Clarke", teamId: "ips", position: "MID", points: 17, price: 5.3 },
  { id: "maeda", name: "Maeda", teamId: "ips", position: "MID", points: 18, price: 5.3 },
  { id: "szmodics", name: "Szmodics", teamId: "ips", position: "MID", points: 0, price: 5.0 },
  { id: "emersonn", name: "Emersonn", teamId: "ips", position: "FWD", points: 31, price: 5.5 },
  { id: "flemming", name: "Flemming", teamId: "ips", position: "FWD", points: 13, price: 5.5 },
  { id: "akpom", name: "Akpom", teamId: "ips", position: "FWD", points: 10, price: 5.0 },

  // === LEEDS UNITED ===
  { id: "trafford", name: "Trafford", teamId: "lee", position: "GK", points: 42, price: 5.0 },
  { id: "bijol", name: "Bijol", teamId: "lee", position: "DEF", points: 21, price: 5.0 },
  { id: "bogle", name: "Bogle", teamId: "lee", position: "DEF", points: 50, price: 4.8 },
  { id: "gudmundsson", name: "Gudmundsson", teamId: "lee", position: "DEF", points: 25, price: 4.5 },
  { id: "justin", name: "Justin", teamId: "lee", position: "DEF", points: 40, price: 4.5 },
  { id: "elvedi", name: "Elvedi", teamId: "lee", position: "DEF", points: 16, price: 4.5 },
  { id: "wilson_lee", name: "Wilson", teamId: "lee", position: "MID", points: 9, price: 6.2 },
  { id: "stach", name: "Stach", teamId: "lee", position: "MID", points: 32, price: 6.0 },
  { id: "okafor", name: "Okafor", teamId: "lee", position: "MID", points: 23, price: 5.8 },
  { id: "ampadu", name: "Ampadu", teamId: "lee", position: "MID", points: 25, price: 5.3 },
  { id: "aaronson", name: "Aaronson", teamId: "lee", position: "MID", points: 11, price: 5.2 },
  { id: "calvert_lewin", name: "Calvert-Lewin", teamId: "lee", position: "FWD", points: 35, price: 6.1 },
  { id: "nmecha", name: "Nmecha", teamId: "lee", position: "FWD", points: 10, price: 5.3 },

  // === LIVERPOOL ===
  { id: "a_becker", name: "A.Becker", teamId: "liv", position: "GK", points: 36, price: 5.5 },
  { id: "virgil", name: "Virgil", teamId: "liv", position: "DEF", points: 38, price: 6.4 },
  { id: "araujo", name: "Araujo", teamId: "liv", position: "DEF", points: 33, price: 5.4 },
  { id: "kerkez", name: "Kerkez", teamId: "liv", position: "DEF", points: 22, price: 5.3 },
  { id: "jacquet", name: "Jacquet", teamId: "liv", position: "DEF", points: 38, price: 5.1 },
  { id: "frimpong", name: "Frimpong", teamId: "liv", position: "DEF", points: 4, price: 5.2 },
  { id: "barcola", name: "Barcola", teamId: "liv", position: "MID", points: 19, price: 8.1 },
  { id: "wirtz", name: "Wirtz", teamId: "liv", position: "MID", points: 31, price: 7.2 },
  { id: "gakpo", name: "Gakpo", teamId: "liv", position: "MID", points: 35, price: 7.1 },
  { id: "szoboszlai", name: "Szoboszlai", teamId: "liv", position: "MID", points: 21, price: 6.7 },
  { id: "munoz", name: "Munoz", teamId: "liv", position: "MID", points: 26, price: 6.5 },
  { id: "gravenberch", name: "Gravenberch", teamId: "liv", position: "MID", points: 11, price: 5.8 },
  { id: "mac_allister", name: "Mac Allister", teamId: "liv", position: "MID", points: 17, price: 5.4 },
  { id: "isak", name: "Isak", teamId: "liv", position: "FWD", points: 51, price: 9.1 },

  // === MANCHESTER CITY ===
  { id: "donnarumma", name: "Donnarumma", teamId: "mci", position: "GK", points: 30, price: 5.5 },
  { id: "o_reilly", name: "O'Reilly", teamId: "mci", position: "DEF", points: 13, price: 6.2 },
  { id: "ahi", name: "Ahi", teamId: "mci", position: "DEF", points: 37, price: 6.0 },
  { id: "matheus_n", name: "Matheus N.", teamId: "mci", position: "DEF", points: 19, price: 5.9 },
  { id: "gvardiol", name: "Gvardiol", teamId: "mci", position: "DEF", points: 42, price: 5.7 },
  { id: "ben_mci", name: "Ben", teamId: "mci", position: "DEF", points: 25, price: 5.5 },
  { id: "khusanov", name: "Khusanov", teamId: "mci", position: "DEF", points: 13, price: 5.3 },
  { id: "semenyo", name: "Semenyo", teamId: "mci", position: "MID", points: 37, price: 8.2 },
  { id: "cherki", name: "Cherki", teamId: "mci", position: "MID", points: 44, price: 8.0 },
  { id: "doku", name: "Doku", teamId: "mci", position: "MID", points: 21, price: 7.5 },
  { id: "foden", name: "Foden", teamId: "mci", position: "MID", points: 19, price: 6.8 },
  { id: "anderson_mci", name: "Anderson", teamId: "mci", position: "MID", points: 23, price: 6.3 },
  { id: "ndiaye", name: "Ndiaye", teamId: "mci", position: "MID", points: 33, price: 5.8 },
  { id: "haaland", name: "Haaland", teamId: "mci", position: "FWD", points: 66, price: 15.8 },

  // === MANCHESTER UNITED ===
  { id: "lammens", name: "Lammens", teamId: "mun", position: "GK", points: 17, price: 4.8 },
  { id: "de_ligt", name: "De Ligt", teamId: "mun", position: "DEF", points: 0, price: 4.9 },
  { id: "dalot", name: "Dalot", teamId: "mun", position: "DEF", points: 13, price: 4.8 },
  { id: "martinez_mun", name: "Martinez", teamId: "mun", position: "DEF", points: 11, price: 4.8 },
  { id: "yoro", name: "Yoro", teamId: "mun", position: "DEF", points: 10, price: 4.8 },
  { id: "maguire", name: "Maguire", teamId: "mun", position: "DEF", points: 16, price: 4.7 },
  { id: "b_fernandes", name: "B.Fernandes", teamId: "mun", position: "MID", points: 33, price: 11.7 },
  { id: "cunha", name: "Cunha", teamId: "mun", position: "MID", points: 38, price: 7.8 },
  { id: "mbeumo", name: "Mbeumo", teamId: "mun", position: "MID", points: 43, price: 7.9 },
  { id: "rashford", name: "Rashford", teamId: "mun", position: "MID", points: 11, price: 6.8 },
  { id: "tielemans_mun", name: "Tielemans", teamId: "mun", position: "MID", points: 24, price: 5.7 },
  { id: "dorgu", name: "Dorgu", teamId: "mun", position: "MID", points: 10, price: 5.7 },
  { id: "amad", name: "Amad", teamId: "mun", position: "MID", points: 5, price: 5.7 },
  { id: "mainoo", name: "Mainoo", teamId: "mun", position: "MID", points: 26, price: 5.5 },
  { id: "zirkzee", name: "Zirkzee", teamId: "mun", position: "FWD", points: 4, price: 5.3 },

  // === NEWCASTLE ===
  { id: "ek", name: "Ek", teamId: "new", position: "GK", points: 24, price: 5.0 },
  { id: "hall", name: "Hall", teamId: "new", position: "DEF", points: 40, price: 5.3 },
  { id: "thiaw", name: "Thiaw", teamId: "new", position: "DEF", points: 16, price: 5.0 },
  { id: "botman", name: "Botman", teamId: "new", position: "DEF", points: 26, price: 5.0 },
  { id: "burn", name: "Burn", teamId: "new", position: "DEF", points: 8, price: 4.8 },
  { id: "j_murphy", name: "J.Murphy", teamId: "new", position: "MID", points: 10, price: 5.9 },
  { id: "barnes", name: "Barnes", teamId: "new", position: "MID", points: 40, price: 6.1 },
  { id: "n_gonzalez", name: "N.Gonzalez", teamId: "new", position: "MID", points: 19, price: 5.5 },
  { id: "l_miley", name: "L.Miley", teamId: "new", position: "MID", points: 15, price: 5.5 },
  { id: "willock", name: "Willock", teamId: "new", position: "MID", points: 27, price: 5.0 },
  { id: "elanga", name: "Elanga", teamId: "new", position: "MID", points: 19, price: 6.0 },
  { id: "wissa", name: "Wissa", teamId: "new", position: "FWD", points: 19, price: 6.0 },
  { id: "fernandez_pardo", name: "Fernandez-Pardo", teamId: "new", position: "FWD", points: 7, price: 6.0 },
  { id: "woltemade", name: "Woltemade", teamId: "new", position: "FWD", points: 4, price: 5.9 },
  { id: "osula", name: "Osula", teamId: "new", position: "FWD", points: 14, price: 5.8 },

  // === NOTTINGHAM FOREST ===
  { id: "sels", name: "Sels", teamId: "nfo", position: "GK", points: 20, price: 5.0 },
  { id: "murillo", name: "Murillo", teamId: "nfo", position: "DEF", points: 28, price: 5.5 },
  { id: "miyoshi", name: "Miyoshi", teamId: "nfo", position: "DEF", points: 15, price: 5.3 },
  { id: "n_williams", name: "N.Williams", teamId: "nfo", position: "DEF", points: 31, price: 5.0 },
  { id: "diomande", name: "Diomande", teamId: "nfo", position: "DEF", points: 10, price: 5.3 },
  { id: "gibbs_white", name: "Gibbs-White", teamId: "nfo", position: "MID", points: 32, price: 7.9 },
  // Elanga moved to Newcastle (see Newcastle section)
  { id: "ndoye", name: "Ndoye", teamId: "nfo", position: "MID", points: 27, price: 5.5 },
  { id: "mcatee", name: "McAtee", teamId: "nfo", position: "MID", points: 23, price: 5.5 },
  { id: "hudson_odoi", name: "Hudson-Odoi", teamId: "nfo", position: "MID", points: 4, price: 5.7 },
  { id: "wood", name: "Wood", teamId: "nfo", position: "FWD", points: 7, price: 5.7 },
  { id: "igor_jesus", name: "Igor Jesus", teamId: "nfo", position: "FWD", points: 12, price: 5.7 },
  { id: "delap", name: "Delap", teamId: "nfo", position: "FWD", points: 15, price: 5.5 },

  // === SUNDERLAND ===
  { id: "roefs", name: "Roefs", teamId: "sun", position: "GK", points: 23, price: 4.9 },
  { id: "mukiele", name: "Mukiele", teamId: "sun", position: "DEF", points: 20, price: 5.4 },
  { id: "danso", name: "Danso", teamId: "sun", position: "DEF", points: 1, price: 5.0 },
  { id: "ballard", name: "Ballard", teamId: "sun", position: "DEF", points: 14, price: 4.8 },
  { id: "hume", name: "Hume", teamId: "sun", position: "DEF", points: 20, price: 4.2 },
  { id: "reinildo", name: "Reinildo", teamId: "sun", position: "DEF", points: 15, price: 4.4 },
  { id: "xhaka", name: "Xhaka", teamId: "sun", position: "MID", points: 28, price: 5.4 },
  // Tonali moved to Tottenham (see Tottenham section)
  { id: "sadiki", name: "Sadiki", teamId: "sun", position: "MID", points: 18, price: 4.8 },
  { id: "rigg", name: "Rigg", teamId: "sun", position: "MID", points: 6, price: 4.8 },
  { id: "brobbey", name: "Brobbey", teamId: "sun", position: "FWD", points: 26, price: 5.7 },
  { id: "isidor", name: "Isidor", teamId: "sun", position: "FWD", points: 17, price: 5.4 },

  // === TOTTENHAM ===
  { id: "kinsky", name: "Kinsky", teamId: "tot", position: "GK", points: 32, price: 4.4 },
  { id: "senesi", name: "Senesi", teamId: "tot", position: "DEF", points: 5, price: 5.7 },
  { id: "van_de_ven", name: "Van de Ven", teamId: "tot", position: "DEF", points: 24, price: 5.0 },
  { id: "van_hecke", name: "Van Hecke", teamId: "tot", position: "DEF", points: 38, price: 4.9 },
  { id: "porro", name: "Porro", teamId: "tot", position: "DEF", points: 10, price: 5.3 },
  { id: "robertson_tot", name: "Robertson", teamId: "tot", position: "DEF", points: 28, price: 4.3 },
  { id: "udogie", name: "Udogie", teamId: "tot", position: "DEF", points: 9, price: 4.4 },
  { id: "vio", name: "Vio", teamId: "tot", position: "MID", points: 10, price: 6.5 },
  { id: "kudus", name: "Kudus", teamId: "tot", position: "MID", points: 19, price: 6.5 },
  { id: "kulusevski", name: "Kulusevski", teamId: "tot", position: "MID", points: 2, price: 6.5 },
  { id: "maddison", name: "Maddison", teamId: "tot", position: "MID", points: 14, price: 6.2 },
  { id: "tel", name: "Tel", teamId: "tot", position: "MID", points: 20, price: 5.6 },
  { id: "fernandes_tot", name: "Fernandes", teamId: "tot", position: "MID", points: 16, price: 5.6 },
  { id: "bentancur", name: "Bentancur", teamId: "tot", position: "MID", points: 13, price: 5.4 },
  { id: "gallagher", name: "Gallagher", teamId: "tot", position: "MID", points: 13, price: 5.3 },
  { id: "tonali", name: "Tonali", teamId: "tot", position: "MID", points: 30, price: 5.3 },
  { id: "marmoush", name: "Marmoush", teamId: "tot", position: "FWD", points: 20, price: 7.0 },
  { id: "solanke", name: "Solanke", teamId: "tot", position: "FWD", points: 19, price: 5.8 },
  { id: "richarlison", name: "Richarlison", teamId: "tot", position: "FWD", points: 2, price: 5.9 },
];

// Get team IDs
export const teamIds = [...new Set(fplPlayers.map(p => p.teamId))];

// Get players by team
export function getPlayersByTeam(teamId: string): FPLPlayer[] {
  return fplPlayers.filter(p => p.teamId === teamId).sort((a, b) => b.points - a.points);
}

// Get players by position
export function getPlayersByPosition(teamId: string, position: Position): FPLPlayer[] {
  return fplPlayers.filter(p => p.teamId === teamId && p.position === position).sort((a, b) => b.points - a.points);
}

// Team strength metrics (derived from player quality)
export function getTeamStrength(teamId: string): { 
  attack: number; 
  defense: number; 
  overall: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheetRate: number;
  attackingThreat: number;
  defensiveStability: number;
} {
  const players = fplPlayers.filter(p => p.teamId === teamId);
  const attackers = players.filter(p => p.position === "FWD" || p.position === "MID");
  const defenders = players.filter(p => p.position === "DEF" || p.position === "GK");
  const gks = players.filter(p => p.position === "GK");
  
  const attack = attackers.reduce((s, p) => s + p.points, 0) / Math.max(attackers.length, 1);
  const defense = defenders.reduce((s, p) => s + p.points, 0) / Math.max(defenders.length, 1);
  const overall = players.reduce((s, p) => s + p.points, 0) / Math.max(players.length, 1);
  
  // Estimate goals scored/conceded from player points
  // High attacking points = more goals scored
  // High defensive points = fewer goals conceded + clean sheets
  const goalsScored = attack * 1.2; // Rough proxy
  const goalsConceded = 50 - (defense * 0.8); // Inverse relationship
  const cleanSheetRate = Math.min(0.6, defense / 60); // Higher defense = more clean sheets
  
  // Attacking threat: combination of goals and assists potential
  const attackingThreat = attackers
    .filter(p => p.points > 20) // Only count key attackers
    .reduce((s, p) => s + p.points, 0) / Math.max(attackers.filter(p => p.points > 20).length, 1);
  
  // Defensive stability: consistency of defensive players
  const defensiveStability = defenders
    .filter(p => p.points > 15) // Only count key defenders
    .reduce((s, p) => s + p.points, 0) / Math.max(defenders.filter(p => p.points > 15).length, 1);
  
  return { 
    attack, 
    defense, 
    overall,
    goalsScored,
    goalsConceded,
    cleanSheetRate,
    attackingThreat,
    defensiveStability
  };
}

// Predict player performance for a specific match
export function predictPlayerPerformance(
  player: FPLPlayer,
  isHome: boolean,
  opponentTeamId: string
): { 
  predictedPoints: number; 
  confidence: number; 
  matchDifficulty: number;
  factors: { label: string; impact: string; value: number; weight: number }[];
  goalProb: number;
  assistProb: number;
  cleanSheetProb: number;
} {
  const factors: { label: string; impact: string; value: number; weight: number }[] = [];
  const opponentStrength = getTeamStrength(opponentTeamId);
  const ownStrength = getTeamStrength(player.teamId);
  
  // Pattern-based analysis
  const highScoringTeams = ['bri', 'che', 'mci']; // Brighton, Chelsea, Man City
  const isHighScoringGame = highScoringTeams.includes(player.teamId) || highScoringTeams.includes(opponentTeamId);
  
  const drawProneTeams = ['bre', 'lee', 'hul', 'eve', 'mun']; // Brentford, Leeds, Hull, Everton, Man Utd
  const isDrawProneGame = drawProneTeams.includes(player.teamId) || drawProneTeams.includes(opponentTeamId);
  
  // Clean sheet rates from GW1-8 data
  const cleanSheetRates: Record<string, number> = {
    'ars': 0.625, // 5/8 clean sheets
    'bri': 0.50,  // 4/8
    'mci': 0.375, // 3/8
    'liv': 0.375, // 3/8
    'lee': 0.375, // 3/8
    'bre': 0.25,  // 2/8
    'eve': 0.25,  // 2/8
    'nfo': 0.125, // 1/8
    'mun': 0.125, // 1/8
    'cry': 0.125, // 1/8
    'ips': 0.0,   // 0/8
    'shu': 0.0,   // 0/8
    'bur': 0.0,   // 0/8
  };
  
  // Calculate match difficulty (1-5 scale, 5 = hardest)
  const matchDifficulty = isHome 
    ? 5 - ((ownStrength.overall - opponentStrength.overall) / 10 + 2.5)
    : 5 - ((ownStrength.overall - opponentStrength.overall) / 10 + 2);
  const normalizedDifficulty = Math.max(1, Math.min(5, matchDifficulty));
  
  let predicted = 0;
  let goalProb = 0;
  let assistProb = 0;
  let cleanSheetProb = 0;
  
  // === POSITION-SPECIFIC PREDICTION MODELS ===
  
  if (player.position === "FWD") {
    // STRIKER MODEL
    // Factor 1: Opponent Defensive Weakness (30% weight)
    const oppDefWeakness = Math.max(0.5, Math.min(1.5, 1.3 - (opponentStrength.defensiveStability / 40)));
    factors.push({ 
      label: "Opponent Defense", 
      impact: opponentStrength.goalsConceded.toFixed(1) + " goals conceded", 
      value: oppDefWeakness,
      weight: 0.30
    });
    
    // Factor 2: Player Form (25% weight)
    const formFactor = Math.min(2.0, player.points / 25);
    factors.push({ 
      label: "Current Form", 
      impact: player.points + " FPL pts", 
      value: formFactor,
      weight: 0.25
    });
    
    // Factor 3: Player Quality/Price (15% weight)
    const qualityFactor = Math.min(1.5, player.price / 8);
    factors.push({ 
      label: "Player Quality", 
      impact: "£" + player.price + "m", 
      value: qualityFactor,
      weight: 0.15
    });
    
    // Factor 4: Team Attacking Strength (15% weight)
    const teamAttack = Math.min(1.4, ownStrength.attackingThreat / 35);
    factors.push({ 
      label: "Team Attack", 
      impact: ownStrength.goalsScored.toFixed(1) + " goals scored", 
      value: teamAttack,
      weight: 0.15
    });
    
    // Factor 5: Home Advantage (10% weight)
    const homeFactor = isHome ? 1.2 : 0.85;
    factors.push({ 
      label: "Home/Away", 
      impact: isHome ? "Home +20%" : "Away -15%", 
      value: homeFactor,
      weight: 0.10
    });
    
    // Factor 6: Minutes/Role (5% weight)
    const minutesFactor = player.points > 40 ? 1.2 : player.points > 20 ? 1.0 : 0.8;
    factors.push({ 
      label: "Starter Status", 
      impact: minutesFactor > 1 ? "Key Player" : "Rotation Risk", 
      value: minutesFactor,
      weight: 0.05
    });
    
    // Calculate predicted points
    predicted = (
      (oppDefWeakness * 0.30) +
      (formFactor * 0.25) +
      (qualityFactor * 0.15) +
      (teamAttack * 0.15) +
      (homeFactor * 0.10) +
      (minutesFactor * 0.05)
    ) * 6; // Scale to realistic FPL range
    
    // High-scoring game bonus for attackers
    if (isHighScoringGame) {
      predicted *= 1.15; // 15% boost for high-scoring games
      factors.push({
        label: "High-Scoring Game",
        impact: "Brighton/Chelsea/Man City involved",
        value: 1.15,
        weight: 0.15
      });
    }
    
    // Goal probability (based on opponent defense weakness and form)
    goalProb = Math.min(0.7, (oppDefWeakness * formFactor * 0.15));
    
    // Assist probability
    assistProb = Math.min(0.5, (teamAttack * formFactor * 0.08));
    
  } else if (player.position === "MID") {
    // MIDFIELDER MODEL (similar to forwards but with assist emphasis)
    const oppDefWeakness = Math.max(0.6, Math.min(1.4, 1.25 - (opponentStrength.defensiveStability / 45)));
    factors.push({ 
      label: "Opponent Defense", 
      impact: opponentStrength.goalsConceded.toFixed(1) + " goals conceded", 
      value: oppDefWeakness,
      weight: 0.25
    });
    
    const formFactor = Math.min(1.8, player.points / 28);
    factors.push({ 
      label: "Current Form", 
      impact: player.points + " FPL pts", 
      value: formFactor,
      weight: 0.25
    });
    
    const qualityFactor = Math.min(1.4, player.price / 7.5);
    factors.push({ 
      label: "Player Quality", 
      impact: "£" + player.price + "m", 
      value: qualityFactor,
      weight: 0.15
    });
    
    const teamAttack = Math.min(1.3, ownStrength.attackingThreat / 38);
    factors.push({ 
      label: "Team Attack", 
      impact: ownStrength.goalsScored.toFixed(1) + " goals scored", 
      value: teamAttack,
      weight: 0.15
    });
    
    const homeFactor = isHome ? 1.15 : 0.88;
    factors.push({ 
      label: "Home/Away", 
      impact: isHome ? "Home +15%" : "Away -12%", 
      value: homeFactor,
      weight: 0.10
    });
    
    const minutesFactor = player.points > 30 ? 1.15 : player.points > 15 ? 1.0 : 0.85;
    factors.push({ 
      label: "Starter Status", 
      impact: minutesFactor > 1 ? "Regular Starter" : "Rotation Risk", 
      value: minutesFactor,
      weight: 0.10
    });
    
    predicted = (
      (oppDefWeakness * 0.25) +
      (formFactor * 0.25) +
      (qualityFactor * 0.15) +
      (teamAttack * 0.15) +
      (homeFactor * 0.10) +
      (minutesFactor * 0.10)
    ) * 5;
    
    // High-scoring game bonus for midfielders
    if (isHighScoringGame) {
      predicted *= 1.12; // 12% boost for high-scoring games
      factors.push({
        label: "High-Scoring Game",
        impact: "Brighton/Chelsea/Man City involved",
        value: 1.12,
        weight: 0.12
      });
    }
    
    goalProb = Math.min(0.5, (oppDefWeakness * formFactor * 0.10));
    assistProb = Math.min(0.6, (teamAttack * formFactor * 0.12));
    
  } else if (player.position === "DEF") {
    // DEFENDER MODEL
    // Factor 1: Opponent Attacking Weakness (25% weight)
    const oppAttackWeakness = Math.max(0.6, Math.min(1.5, 1.35 - (opponentStrength.attackingThreat / 40)));
    factors.push({ 
      label: "Opponent Attack", 
      impact: opponentStrength.goalsScored.toFixed(1) + " goals scored", 
      value: oppAttackWeakness,
      weight: 0.25
    });
    
    // Factor 2: Own Team Defensive Strength (25% weight)
    const ownDefense = Math.min(1.5, ownStrength.defensiveStability / 35);
    factors.push({ 
      label: "Team Defense", 
      impact: ownStrength.goalsConceded.toFixed(1) + " goals conceded", 
      value: ownDefense,
      weight: 0.25
    });
    
    // Factor 3: Player Form (20% weight)
    const formFactor = Math.min(1.6, player.points / 30);
    factors.push({ 
      label: "Current Form", 
      impact: player.points + " FPL pts", 
      value: formFactor,
      weight: 0.20
    });
    
    // Factor 4: Clean Sheet Probability (15% weight)
    // Use actual clean sheet rates from GW1-8 data
    const baseCleanSheetRate = cleanSheetRates[player.teamId] || 0.25;
    const opponentAttackFactor = Math.max(0.5, Math.min(1.5, 1.2 - (opponentStrength.attackingThreat / 50)));
    cleanSheetProb = Math.min(0.75, baseCleanSheetRate * opponentAttackFactor * (isHome ? 1.15 : 0.90));
    
    factors.push({ 
      label: "Clean Sheet", 
      impact: (cleanSheetProb * 100).toFixed(0) + "% chance (based on " + (baseCleanSheetRate * 100).toFixed(0) + "% team rate)", 
      value: cleanSheetProb,
      weight: 0.15
    });
    
    // Factor 5: Attacking Threat from Defense (10% weight)
    const attackingThreat = player.points > 25 ? 1.3 : player.points > 15 ? 1.1 : 0.9;
    factors.push({ 
      label: "Attacking Threat", 
      impact: attackingThreat > 1.1 ? "Goal/Assist Threat" : "Defensive Role", 
      value: attackingThreat,
      weight: 0.10
    });
    
    // Factor 6: Home Advantage (5% weight)
    const homeFactor = isHome ? 1.1 : 0.92;
    factors.push({ 
      label: "Home/Away", 
      impact: isHome ? "Home +10%" : "Away -8%", 
      value: homeFactor,
      weight: 0.05
    });
    
    predicted = (
      (oppAttackWeakness * 0.25) +
      (ownDefense * 0.25) +
      (formFactor * 0.20) +
      (cleanSheetProb * 4 * 0.15) + // 4pts for clean sheet
      (attackingThreat * 0.10) +
      (homeFactor * 0.05)
    ) * 3.5;
    
    goalProb = Math.min(0.2, (attackingThreat * 0.05));
    assistProb = Math.min(0.3, (attackingThreat * 0.08));
    
  } else {
    // GOALKEEPER MODEL
    // Factor 1: Opponent Attacking Weakness (30% weight)
    const oppAttackWeakness = Math.max(0.6, Math.min(1.5, 1.4 - (opponentStrength.attackingThreat / 38)));
    factors.push({ 
      label: "Opponent Attack", 
      impact: opponentStrength.goalsScored.toFixed(1) + " goals scored", 
      value: oppAttackWeakness,
      weight: 0.30
    });
    
    // Factor 2: Own Team Defensive Strength (30% weight)
    const ownDefense = Math.min(1.5, ownStrength.defensiveStability / 32);
    factors.push({ 
      label: "Team Defense", 
      impact: ownStrength.goalsConceded.toFixed(1) + " goals conceded", 
      value: ownDefense,
      weight: 0.30
    });
    
    // Factor 3: Player Form (20% weight)
    const formFactor = Math.min(1.5, player.points / 35);
    factors.push({ 
      label: "Current Form", 
      impact: player.points + " FPL pts", 
      value: formFactor,
      weight: 0.20
    });
    
    // Factor 4: Clean Sheet Probability (15% weight)
    // Use actual clean sheet rates from GW1-8 data
    const baseCleanSheetRate = cleanSheetRates[player.teamId] || 0.25;
    const opponentAttackFactor = Math.max(0.5, Math.min(1.5, 1.2 - (opponentStrength.attackingThreat / 50)));
    cleanSheetProb = Math.min(0.80, baseCleanSheetRate * opponentAttackFactor * (isHome ? 1.18 : 0.88));
    
    factors.push({ 
      label: "Clean Sheet", 
      impact: (cleanSheetProb * 100).toFixed(0) + "% chance (based on " + (baseCleanSheetRate * 100).toFixed(0) + "% team rate)", 
      value: cleanSheetProb,
      weight: 0.15
    });
    
    // Factor 5: Home Advantage (5% weight)
    const homeFactor = isHome ? 1.08 : 0.94;
    factors.push({ 
      label: "Home/Away", 
      impact: isHome ? "Home +8%" : "Away -6%", 
      value: homeFactor,
      weight: 0.05
    });
    
    predicted = (
      (oppAttackWeakness * 0.30) +
      (ownDefense * 0.30) +
      (formFactor * 0.20) +
      (cleanSheetProb * 4 * 0.15) +
      (homeFactor * 0.05)
    ) * 3;
    
    goalProb = 0;
    assistProb = 0;
  }
  
  // Add clean sheet points for DEF/GK
  if ((player.position === "DEF" || player.position === "GK") && cleanSheetProb > 0.3) {
    predicted += cleanSheetProb * 4;
  }
  
  // Add goal/assist expectations
  predicted += (goalProb * 4.5) + (assistProb * 3);
  
  // Confidence based on player data quality
  const confidence = Math.min(92, Math.max(35, 
    (player.points > 30 ? 85 : player.points > 15 ? 65 : 45) +
    (player.price > 7 ? 5 : 0)
  ));
  
  return { 
    predictedPoints: Math.round(predicted * 10) / 10, 
    confidence,
    matchDifficulty: normalizedDifficulty,
    factors,
    goalProb: Math.round(goalProb * 100),
    assistProb: Math.round(assistProb * 100),
    cleanSheetProb: Math.round(cleanSheetProb * 100)
  };
}

// Rank players from two teams for a match
export function rankPlayersForMatch(
  homeTeamId: string,
  awayTeamId: string,
  injuredPlayerIds: string[] = []
): { player: FPLPlayer; prediction: ReturnType<typeof predictPlayerPerformance>; isHome: boolean }[] {
  const homePlayers = getPlayersByTeam(homeTeamId).filter(p => p.points > 0 && !injuredPlayerIds.includes(p.id));
  const awayPlayers = getPlayersByTeam(awayTeamId).filter(p => p.points > 0 && !injuredPlayerIds.includes(p.id));
  
  const ranked: { player: FPLPlayer; prediction: ReturnType<typeof predictPlayerPerformance>; isHome: boolean }[] = [];
  
  homePlayers.forEach(p => {
    ranked.push({
      player: p,
      prediction: predictPlayerPerformance(p, true, awayTeamId),
      isHome: true,
    });
  });
  
  awayPlayers.forEach(p => {
    ranked.push({
      player: p,
      prediction: predictPlayerPerformance(p, false, homeTeamId),
      isHome: false,
    });
  });
  
  // Sort by predicted points
  ranked.sort((a, b) => b.prediction.predictedPoints - a.prediction.predictedPoints);
  
  return ranked;
}
