export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  price: number; // in millions
  goals: number;
  assists: number;
  cleanSheets: number;
  minutes: number; // estimated
  yellowCards: number;
  redCards: number;
  saves: number; // for GK
  goalsByGW: number[]; // per gameweek
  assistsByGW: number[]; // per gameweek
  bonusPoints: number;
}

// FPL Points calculation:
// Goal: FWD=4, MID=5, DEF/GK=6
// Assist: 3pts all positions
// Clean sheet: GK/DEF=4, MID=1
// Playing 60+ min: 2pts (we estimate all starters play ~70min avg)
// Yellow card: -1
// Red card: -3
// Save: 1pt per 3 saves (GK only)
// Bonus: varies

function calculateFPLPoints(player: Player): number {
  let points = 0;

  // Goals
  const goalValue = player.position === "FWD" ? 4 : player.position === "MID" ? 5 : 6;
  points += player.goals * goalValue;

  // Assists
  points += player.assists * 3;

  // Clean sheets (estimated from team data)
  if (player.position === "GK" || player.position === "DEF") {
    points += player.cleanSheets * 4;
  } else if (player.position === "MID") {
    points += player.cleanSheets * 1;
  }

  // Minutes (estimate ~70 min per game for starters = 2pts per game)
  const gamesPlayed = Math.round(player.minutes / 90);
  points += gamesPlayed * 2;

  // Cards
  points -= player.yellowCards;
  points -= player.redCards * 3;

  // Bonus
  points += player.bonusPoints;

  return points;
}

export const players: Player[] = [
  // === MANCHESTER CITY ===
  {
    id: "haaland", name: "Erling Haaland", teamId: "mci", position: "FWD", price: 14.5,
    goals: 15, assists: 0, cleanSheets: 0, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [2, 3, 1, 1, 3, 2, 2, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 16,
  },
  {
    id: "foden", name: "Phil Foden", teamId: "mci", position: "MID", price: 9.0,
    goals: 3, assists: 2, cleanSheets: 2, minutes: 680, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 0, 1, 0, 1, 0], assistsByGW: [1, 0, 1, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "debruyne", name: "Kevin De Bruyne", teamId: "mci", position: "MID", price: 10.0,
    goals: 1, assists: 8, cleanSheets: 2, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 1, 0, 0, 0], assistsByGW: [1, 2, 0, 1, 0, 2, 1, 1], bonusPoints: 12,
  },
  {
    id: "grealish", name: "Jack Grealish", teamId: "mci", position: "MID", price: 7.0,
    goals: 0, assists: 2, cleanSheets: 2, minutes: 400, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 1, 1, 0, 0], bonusPoints: 3,
  },
  {
    id: "doku", name: "Jérémy Doku", teamId: "mci", position: "MID", price: 6.5,
    goals: 0, assists: 3, cleanSheets: 1, minutes: 350, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 1, 0, 0, 1, 0, 1, 0], bonusPoints: 3,
  },
  {
    id: "gvardiol", name: "Joško Gvardiol", teamId: "mci", position: "DEF", price: 5.5,
    goals: 0, assists: 2, cleanSheets: 3, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 1, 0, 1, 0], bonusPoints: 4,
  },

  // === ARSENAL ===
  {
    id: "saka", name: "Bukayo Saka", teamId: "ars", position: "MID", price: 10.0,
    goals: 5, assists: 3, cleanSheets: 3, minutes: 720, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 1, 0, 1, 1, 1], assistsByGW: [1, 1, 1, 0, 0, 0, 0, 0], bonusPoints: 10,
  },
  {
    id: "havertz", name: "Kai Havertz", teamId: "ars", position: "FWD", price: 8.5,
    goals: 4, assists: 0, cleanSheets: 0, minutes: 700, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 1, 0, 0, 1, 0, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "odegaard", name: "Martin Ødegaard", teamId: "ars", position: "MID", price: 8.0,
    goals: 0, assists: 5, cleanSheets: 3, minutes: 710, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 1, 0, 1, 1, 1], bonusPoints: 8,
  },
  {
    id: "rice", name: "Declan Rice", teamId: "ars", position: "MID", price: 6.5,
    goals: 0, assists: 5, cleanSheets: 3, minutes: 720, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 1, 1, 0, 1, 0, 1], bonusPoints: 5,
  },
  {
    id: "martinelli", name: "Gabriel Martinelli", teamId: "ars", position: "MID", price: 7.0,
    goals: 2, assists: 0, cleanSheets: 3, minutes: 600, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 1, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "gabriel_g", name: "Gabriel Magalhães", teamId: "ars", position: "DEF", price: 5.5,
    goals: 1, assists: 0, cleanSheets: 4, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 1, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "trossard", name: "Leandro Trossard", teamId: "ars", position: "MID", price: 6.5,
    goals: 1, assists: 0, cleanSheets: 2, minutes: 350, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },

  // === BRIGHTON ===
  {
    id: "joaopedro", name: "João Pedro", teamId: "bri", position: "FWD", price: 7.5,
    goals: 11, assists: 0, cleanSheets: 0, minutes: 720, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [2, 2, 0, 2, 2, 1, 2, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 14,
  },
  {
    id: "mitoma", name: "Kaoru Mitoma", teamId: "bri", position: "MID", price: 7.0,
    goals: 4, assists: 2, cleanSheets: 2, minutes: 650, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 1, 0, 0, 1, 1, 0], assistsByGW: [0, 0, 0, 0, 1, 0, 0, 0], bonusPoints: 7,
  },
  {
    id: "gross", name: "Pascal Groß", teamId: "bri", position: "MID", price: 5.5,
    goals: 0, assists: 10, cleanSheets: 2, minutes: 700, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [2, 1, 1, 2, 1, 1, 2, 0], bonusPoints: 12,
  },
  {
    id: "minteh", name: "Yankuba Minteh", teamId: "bri", position: "MID", price: 5.0,
    goals: 4, assists: 1, cleanSheets: 2, minutes: 550, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 1, 1, 0, 1, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 5,
  },
  {
    id: "adingra", name: "Simon Adingra", teamId: "bri", position: "MID", price: 5.5,
    goals: 3, assists: 1, cleanSheets: 2, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 1, 0, 0, 1, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "baleba", name: "Carlos Baleba", teamId: "bri", position: "MID", price: 4.5,
    goals: 1, assists: 3, cleanSheets: 2, minutes: 600, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 1, 1, 0, 1, 0], bonusPoints: 4,
  },
  {
    id: "rutter", name: "Georginio Rutter", teamId: "bri", position: "FWD", price: 5.5,
    goals: 0, assists: 2, cleanSheets: 0, minutes: 350, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 1, 0, 0, 1, 0], bonusPoints: 2,
  },
  {
    id: "estupinan_p", name: "Pervis Estupiñán", teamId: "bri", position: "DEF", price: 5.0,
    goals: 0, assists: 2, cleanSheets: 3, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 1, 0, 0, 1, 0], bonusPoints: 4,
  },

  // === LIVERPOOL ===
  {
    id: "salah", name: "Mohamed Salah", teamId: "liv", position: "MID", price: 12.5,
    goals: 5, assists: 0, cleanSheets: 2, minutes: 720, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 1, 1, 0, 0, 0, 1, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 8,
  },
  {
    id: "jota", name: "Diogo Jota", teamId: "liv", position: "FWD", price: 7.5,
    goals: 4, assists: 0, cleanSheets: 0, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 1, 0, 0, 0, 1, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 5,
  },
  {
    id: "szoboszlai", name: "Dominik Szoboszlai", teamId: "liv", position: "MID", price: 7.0,
    goals: 1, assists: 5, cleanSheets: 2, minutes: 680, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 1, 0, 0, 0], assistsByGW: [1, 0, 1, 0, 1, 0, 1, 1], bonusPoints: 7,
  },
  {
    id: "trent", name: "Trent Alexander-Arnold", teamId: "liv", position: "DEF", price: 7.0,
    goals: 0, assists: 3, cleanSheets: 3, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 0, 0, 0, 1, 1], bonusPoints: 6,
  },
  {
    id: "gakpo", name: "Cody Gakpo", teamId: "liv", position: "MID", price: 6.5,
    goals: 1, assists: 2, cleanSheets: 2, minutes: 450, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 1, 0, 1, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "macallister", name: "Alexis Mac Allister", teamId: "liv", position: "MID", price: 6.0,
    goals: 0, assists: 1, cleanSheets: 2, minutes: 600, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 1, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },

  // === CHELSEA ===
  {
    id: "palmer", name: "Cole Palmer", teamId: "che", position: "MID", price: 10.5,
    goals: 9, assists: 0, cleanSheets: 1, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [2, 2, 1, 1, 0, 2, 1, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 12,
  },
  {
    id: "jackson", name: "Nicolas Jackson", teamId: "che", position: "FWD", price: 7.5,
    goals: 6, assists: 0, cleanSheets: 0, minutes: 650, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [1, 1, 0, 1, 0, 2, 1, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 7,
  },
  {
    id: "nkunku", name: "Christopher Nkunku", teamId: "che", position: "FWD", price: 7.0,
    goals: 2, assists: 0, cleanSheets: 0, minutes: 400, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 0, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "neto", name: "Pedro Neto", teamId: "che", position: "MID", price: 6.5,
    goals: 0, assists: 6, cleanSheets: 1, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 1, 1, 0, 2, 1, 0], bonusPoints: 7,
  },
  {
    id: "enzo", name: "Enzo Fernández", teamId: "che", position: "MID", price: 6.0,
    goals: 0, assists: 4, cleanSheets: 1, minutes: 700, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 1, 0, 1, 0, 1, 1, 0], bonusPoints: 4,
  },
  {
    id: "caicedo", name: "Moisés Caicedo", teamId: "che", position: "MID", price: 5.0,
    goals: 0, assists: 1, cleanSheets: 1, minutes: 600, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },

  // === ASTON VILLA ===
  {
    id: "watkins", name: "Ollie Watkins", teamId: "avl", position: "FWD", price: 8.5,
    goals: 6, assists: 0, cleanSheets: 0, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 1, 2, 1, 1, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 8,
  },
  {
    id: "mcginn", name: "John McGinn", teamId: "avl", position: "MID", price: 6.0,
    goals: 1, assists: 5, cleanSheets: 1, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 1, 2, 0, 1, 1], bonusPoints: 6,
  },
  {
    id: "rogers", name: "Morgan Rogers", teamId: "avl", position: "MID", price: 5.0,
    goals: 2, assists: 0, cleanSheets: 1, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 1, 0, 0, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "tielemans", name: "Youri Tielemans", teamId: "avl", position: "MID", price: 5.5,
    goals: 0, assists: 3, cleanSheets: 1, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 1, 1, 0, 1], bonusPoints: 3,
  },

  // === TOTTENHAM ===
  {
    id: "son", name: "Son Heung-min", teamId: "tot", position: "MID", price: 9.5,
    goals: 4, assists: 1, cleanSheets: 1, minutes: 700, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 1, 0, 2, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "maddison", name: "James Maddison", teamId: "tot", position: "MID", price: 7.0,
    goals: 1, assists: 3, cleanSheets: 1, minutes: 600, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 1, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 1, 1], bonusPoints: 4,
  },
  {
    id: "kulusevski", name: "Dejan Kulusevski", teamId: "tot", position: "MID", price: 6.5,
    goals: 1, assists: 2, cleanSheets: 1, minutes: 550, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 1, 0], assistsByGW: [0, 0, 0, 0, 1, 0, 0, 1], bonusPoints: 3,
  },
  {
    id: "johnson_b", name: "Brennan Johnson", teamId: "tot", position: "MID", price: 5.0,
    goals: 2, assists: 1, cleanSheets: 1, minutes: 450, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 1, 0, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 1, 0], bonusPoints: 3,
  },
  {
    id: "porro", name: "Pedro Porro", teamId: "tot", position: "DEF", price: 5.5,
    goals: 0, assists: 2, cleanSheets: 1, minutes: 680, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 1, 0, 1, 0], bonusPoints: 3,
  },

  // === NEWCASTLE ===
  {
    id: "isak", name: "Alexander Isak", teamId: "new", position: "FWD", price: 9.0,
    goals: 5, assists: 0, cleanSheets: 0, minutes: 720, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 1, 1, 0, 1, 0, 0, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 7,
  },
  {
    id: "gordon", name: "Anthony Gordon", teamId: "new", position: "MID", price: 7.0,
    goals: 4, assists: 2, cleanSheets: 1, minutes: 700, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 1, 0, 1, 0, 0, 1], assistsByGW: [0, 1, 0, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "bruno_g", name: "Bruno Guimarães", teamId: "new", position: "MID", price: 6.5,
    goals: 0, assists: 3, cleanSheets: 1, minutes: 720, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 1, 0, 1, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "trippier", name: "Kieran Trippier", teamId: "new", position: "DEF", price: 5.5,
    goals: 0, assists: 3, cleanSheets: 2, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 1, 0, 1, 0, 0, 1], bonusPoints: 5,
  },
  {
    id: "barnes_h", name: "Harvey Barnes", teamId: "new", position: "MID", price: 5.5,
    goals: 1, assists: 1, cleanSheets: 1, minutes: 400, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },

  // === BRENTFORD ===
  {
    id: "mbeumo", name: "Bryan Mbeumo", teamId: "bre", position: "MID", price: 6.5,
    goals: 8, assists: 1, cleanSheets: 1, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [2, 1, 0, 1, 1, 1, 1, 1], assistsByGW: [0, 0, 1, 0, 0, 0, 0, 0], bonusPoints: 10,
  },
  {
    id: "wissa", name: "Yoane Wissa", teamId: "bre", position: "FWD", price: 6.0,
    goals: 3, assists: 2, cleanSheets: 0, minutes: 550, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 1, 1, 1, 0, 0, 0], assistsByGW: [1, 0, 0, 0, 0, 1, 0, 0], bonusPoints: 4,
  },
  {
    id: "janelt", name: "Vitaly Janelt", teamId: "bre", position: "MID", price: 5.0,
    goals: 0, assists: 6, cleanSheets: 1, minutes: 680, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 1, 0, 1, 1, 0, 1, 1], bonusPoints: 7,
  },
  {
    id: "schade", name: "Kevin Schade", teamId: "bre", position: "MID", price: 5.0,
    goals: 4, assists: 1, cleanSheets: 1, minutes: 550, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 1, 1, 1, 0, 0], assistsByGW: [0, 0, 0, 1, 0, 0, 0, 0], bonusPoints: 5,
  },
  {
    id: "norgaard", name: "Christian Nørgaard", teamId: "bre", position: "MID", price: 4.5,
    goals: 0, assists: 2, cleanSheets: 1, minutes: 600, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 1, 1, 0, 0], bonusPoints: 2,
  },
  {
    id: "damsgaard", name: "Mikkel Damsgaard", teamId: "bre", position: "MID", price: 4.5,
    goals: 0, assists: 2, cleanSheets: 1, minutes: 350, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 0, 1, 0, 0, 0], bonusPoints: 2,
  },

  // === LEEDS UNITED ===
  {
    id: "dcl", name: "Dominic Calvert-Lewin", teamId: "lee", position: "FWD", price: 6.5,
    goals: 7, assists: 0, cleanSheets: 0, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 1, 2, 1, 1, 1, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 8,
  },
  {
    id: "ramazani", name: "Largie Ramazani", teamId: "lee", position: "MID", price: 5.0,
    goals: 0, assists: 5, cleanSheets: 2, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 2, 0, 1, 1, 0], bonusPoints: 5,
  },
  {
    id: "aaronson", name: "Brenden Aaronson", teamId: "lee", position: "MID", price: 5.0,
    goals: 1, assists: 1, cleanSheets: 2, minutes: 600, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 1, 0, 0, 0, 0], assistsByGW: [0, 0, 1, 1, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "danjames", name: "Dan James", teamId: "lee", position: "MID", price: 4.5,
    goals: 1, assists: 1, cleanSheets: 2, minutes: 450, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 1, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 1], bonusPoints: 2,
  },
  {
    id: "piroe", name: "Joel Piroe", teamId: "lee", position: "FWD", price: 4.5,
    goals: 1, assists: 0, cleanSheets: 0, minutes: 250, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 1,
  },

  // === BOURNEMOUTH ===
  {
    id: "semenyo", name: "Antoine Semenyo", teamId: "bou", position: "MID", price: 5.5,
    goals: 5, assists: 1, cleanSheets: 1, minutes: 680, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 1, 0, 0, 1, 1, 1], assistsByGW: [0, 0, 0, 1, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "tavernier_m", name: "Marcus Tavernier", teamId: "bou", position: "MID", price: 5.5,
    goals: 3, assists: 4, cleanSheets: 1, minutes: 700, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 1, 2], assistsByGW: [1, 0, 1, 1, 0, 1, 0, 0], bonusPoints: 5,
  },
  {
    id: "evanilson", name: "Evanilson", teamId: "bou", position: "FWD", price: 6.0,
    goals: 3, assists: 1, cleanSheets: 0, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 1, 1, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 1], bonusPoints: 4,
  },
  {
    id: "kluivert", name: "Justin Kluivert", teamId: "bou", position: "MID", price: 5.0,
    goals: 1, assists: 2, cleanSheets: 1, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 1, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 1, 1], bonusPoints: 3,
  },
  {
    id: "kerkez", name: "Milos Kerkez", teamId: "bou", position: "DEF", price: 4.5,
    goals: 0, assists: 1, cleanSheets: 1, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 1, 0, 0, 0, 0, 0], bonusPoints: 2,
  },

  // === CRYSTAL PALACE ===
  {
    id: "mateta", name: "Jean-Philippe Mateta", teamId: "cry", position: "FWD", price: 6.0,
    goals: 6, assists: 0, cleanSheets: 0, minutes: 680, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 2, 1, 0, 2, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 7,
  },
  {
    id: "eze", name: "Eberechi Eze", teamId: "cry", position: "MID", price: 6.5,
    goals: 3, assists: 0, cleanSheets: 0, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 1, 1, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "kamada", name: "Daichi Kamada", teamId: "cry", position: "MID", price: 5.5,
    goals: 0, assists: 5, cleanSheets: 0, minutes: 650, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 2, 1, 0, 2, 0, 0], bonusPoints: 5,
  },
  {
    id: "mitchell", name: "Tyrick Mitchell", teamId: "cry", position: "DEF", price: 4.5,
    goals: 0, assists: 2, cleanSheets: 0, minutes: 700, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 1, 0, 0, 0, 1, 0, 0], bonusPoints: 2,
  },

  // === MANCHESTER UNITED ===
  {
    id: "zirkzee", name: "Joshua Zirkzee", teamId: "mun", position: "FWD", price: 6.5,
    goals: 4, assists: 0, cleanSheets: 0, minutes: 600, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 2, 0, 0, 0, 1, 1, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 5,
  },
  {
    id: "rashford", name: "Marcus Rashford", teamId: "mun", position: "MID", price: 7.0,
    goals: 2, assists: 0, cleanSheets: 1, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 2, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "bruno_f", name: "Bruno Fernandes", teamId: "mun", position: "MID", price: 8.5,
    goals: 1, assists: 3, cleanSheets: 1, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 1, 0, 0, 1, 0, 0], assistsByGW: [0, 2, 0, 0, 0, 0, 0, 0], bonusPoints: 5,
  },
  {
    id: "amad", name: "Amad Diallo", teamId: "mun", position: "MID", price: 5.0,
    goals: 0, assists: 4, cleanSheets: 1, minutes: 450, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 1, 1, 0, 1, 0, 1, 0], bonusPoints: 4,
  },
  {
    id: "garnacho", name: "Alejandro Garnacho", teamId: "mun", position: "MID", price: 6.0,
    goals: 1, assists: 0, cleanSheets: 1, minutes: 350, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },

  // === HULL CITY ===
  {
    id: "philogene", name: "Jaden Philogene", teamId: "hul", position: "MID", price: 6.0,
    goals: 5, assists: 1, cleanSheets: 1, minutes: 700, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 1, 1, 1, 0, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "estupinan_o", name: "Óscar Estupiñán", teamId: "hul", position: "FWD", price: 5.5,
    goals: 2, assists: 0, cleanSheets: 0, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 0, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "slater", name: "Regan Slater", teamId: "hul", position: "MID", price: 4.5,
    goals: 0, assists: 4, cleanSheets: 1, minutes: 680, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 1, 0, 1, 0, 1], bonusPoints: 4,
  },
  {
    id: "palmer_k", name: "Kasey Palmer", teamId: "hul", position: "MID", price: 4.5,
    goals: 0, assists: 2, cleanSheets: 1, minutes: 550, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 0, 0, 1, 0, 0], bonusPoints: 2,
  },

  // === EVERTON ===
  {
    id: "mcneil", name: "Dwight McNeil", teamId: "eve", position: "MID", price: 5.5,
    goals: 3, assists: 3, cleanSheets: 2, minutes: 700, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 1, 0, 0, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "beto", name: "Beto", teamId: "eve", position: "FWD", price: 5.0,
    goals: 2, assists: 0, cleanSheets: 0, minutes: 400, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 1, 0, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },
  {
    id: "harrison_j", name: "Jack Harrison", teamId: "eve", position: "MID", price: 4.5,
    goals: 0, assists: 3, cleanSheets: 2, minutes: 600, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 1, 0, 0, 0, 1, 0, 0], bonusPoints: 3,
  },
  {
    id: "tarkowski", name: "James Tarkowski", teamId: "eve", position: "DEF", price: 4.5,
    goals: 0, assists: 3, cleanSheets: 3, minutes: 720, yellowCards: 2, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 1, 0, 0, 1, 0, 0], bonusPoints: 5,
  },

  // === IPSWICH TOWN ===
  {
    id: "delap", name: "Liam Delap", teamId: "ips", position: "FWD", price: 5.5,
    goals: 6, assists: 0, cleanSheets: 0, minutes: 680, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 2, 0, 1, 1, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 7,
  },
  {
    id: "hutchinson", name: "Omari Hutchinson", teamId: "ips", position: "MID", price: 5.0,
    goals: 3, assists: 1, cleanSheets: 0, minutes: 600, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 0, 0, 1, 1, 0], assistsByGW: [0, 0, 0, 1, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "davis_l", name: "Leif Davis", teamId: "ips", position: "DEF", price: 5.0,
    goals: 0, assists: 6, cleanSheets: 0, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 2, 0, 1, 1, 1], bonusPoints: 7,
  },
  {
    id: "chaplin", name: "Conor Chaplin", teamId: "ips", position: "MID", price: 5.0,
    goals: 0, assists: 3, cleanSheets: 0, minutes: 550, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 1, 1, 0], bonusPoints: 3,
  },
  {
    id: "szmodics", name: "Sammie Szmodics", teamId: "ips", position: "MID", price: 4.5,
    goals: 1, assists: 0, cleanSheets: 0, minutes: 350, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 1, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 1,
  },

  // === FULHAM ===
  {
    id: "muniz", name: "Rodrigo Muniz", teamId: "ful", position: "FWD", price: 5.5,
    goals: 5, assists: 0, cleanSheets: 0, minutes: 650, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 1, 0, 1, 0, 1, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "smithrowe", name: "Emile Smith Rowe", teamId: "ful", position: "MID", price: 5.5,
    goals: 1, assists: 0, cleanSheets: 0, minutes: 400, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },
  {
    id: "robinson_a", name: "Antonee Robinson", teamId: "ful", position: "DEF", price: 5.0,
    goals: 0, assists: 4, cleanSheets: 1, minutes: 720, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 1, 0, 1, 1, 0, 0], bonusPoints: 5,
  },
  {
    id: "iwobi", name: "Alex Iwobi", teamId: "ful", position: "MID", price: 5.5,
    goals: 0, assists: 1, cleanSheets: 0, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },
  {
    id: "pereira", name: "Andreas Pereira", teamId: "ful", position: "MID", price: 6.0,
    goals: 0, assists: 3, cleanSheets: 0, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 1, 0, 0, 0, 1, 1], bonusPoints: 3,
  },
  {
    id: "traore", name: "Adama Traoré", teamId: "ful", position: "MID", price: 4.5,
    goals: 1, assists: 0, cleanSheets: 0, minutes: 300, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 1, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 1,
  },

  // === SUNDERLAND ===
  {
    id: "isidor", name: "Wilson Isidor", teamId: "sun", position: "FWD", price: 5.0,
    goals: 3, assists: 0, cleanSheets: 0, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [1, 0, 0, 0, 2, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "roberts_p", name: "Patrick Roberts", teamId: "sun", position: "MID", price: 4.5,
    goals: 1, assists: 3, cleanSheets: 0, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 1, 0, 0, 0], assistsByGW: [0, 1, 1, 0, 1, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "rigg", name: "Chris Rigg", teamId: "sun", position: "MID", price: 4.5,
    goals: 0, assists: 2, cleanSheets: 0, minutes: 450, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [1, 0, 0, 0, 1, 0, 0, 0], bonusPoints: 2,
  },

  // === NOTTINGHAM FOREST ===
  {
    id: "wood", name: "Chris Wood", teamId: "nfo", position: "FWD", price: 6.0,
    goals: 4, assists: 0, cleanSheets: 0, minutes: 650, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 1, 0, 1, 0, 1], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 5,
  },
  {
    id: "gibbswhite", name: "Morgan Gibbs-White", teamId: "nfo", position: "MID", price: 6.5,
    goals: 0, assists: 3, cleanSheets: 0, minutes: 680, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 1, 0, 1, 0, 1, 0, 0], bonusPoints: 3,
  },
  {
    id: "elanga", name: "Anthony Elanga", teamId: "nfo", position: "MID", price: 5.5,
    goals: 1, assists: 3, cleanSheets: 0, minutes: 600, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 1, 0, 1, 0, 0, 0, 0], assistsByGW: [0, 1, 0, 0, 0, 0, 0, 1], bonusPoints: 4,
  },
  {
    id: "joseph", name: "Mateo Joseph", teamId: "lee", position: "FWD", price: 4.5,
    goals: 1, assists: 0, cleanSheets: 0, minutes: 200, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 1,
  },

  // === COVENTRY CITY ===
  {
    id: "wright", name: "Haji Wright", teamId: "cov", position: "FWD", price: 5.5,
    goals: 4, assists: 0, cleanSheets: 0, minutes: 600, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 1, 2, 1, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 5,
  },
  {
    id: "sakamoto", name: "Tatsuhiro Sakamoto", teamId: "cov", position: "MID", price: 4.5,
    goals: 1, assists: 2, cleanSheets: 0, minutes: 500, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 0, 1, 0, 0, 0], bonusPoints: 2,
  },
  {
    id: "simms", name: "Ellis Simms", teamId: "cov", position: "FWD", price: 4.5,
    goals: 1, assists: 0, cleanSheets: 0, minutes: 250, yellowCards: 0, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 1, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 1,
  },
  {
    id: "sheaf", name: "Ben Sheaf", teamId: "cov", position: "MID", price: 4.0,
    goals: 0, assists: 1, cleanSheets: 0, minutes: 500, yellowCards: 1, redCards: 0, saves: 0,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 1, 0, 0], bonusPoints: 1,
  },

  // === GOALKEEPERS ===
  {
    id: "raya", name: "David Raya", teamId: "ars", position: "GK", price: 5.5,
    goals: 0, assists: 0, cleanSheets: 5, minutes: 720, yellowCards: 0, redCards: 0, saves: 22,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 6,
  },
  {
    id: "ederson", name: "Ederson", teamId: "mci", position: "GK", price: 5.5,
    goals: 0, assists: 0, cleanSheets: 3, minutes: 720, yellowCards: 0, redCards: 0, saves: 18,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "verbruggen", name: "Bart Verbruggen", teamId: "bri", position: "GK", price: 4.5,
    goals: 0, assists: 0, cleanSheets: 3, minutes: 720, yellowCards: 0, redCards: 0, saves: 15,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "alisson", name: "Alisson", teamId: "liv", position: "GK", price: 5.0,
    goals: 0, assists: 0, cleanSheets: 3, minutes: 720, yellowCards: 0, redCards: 0, saves: 16,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "sanchez", name: "Robert Sánchez", teamId: "che", position: "GK", price: 4.5,
    goals: 0, assists: 0, cleanSheets: 1, minutes: 720, yellowCards: 0, redCards: 0, saves: 28,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },
  {
    id: "flekken", name: "Mark Flekken", teamId: "bre", position: "GK", price: 4.5,
    goals: 0, assists: 0, cleanSheets: 2, minutes: 720, yellowCards: 0, redCards: 0, saves: 20,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "pickford", name: "Jordan Pickford", teamId: "eve", position: "GK", price: 4.5,
    goals: 0, assists: 0, cleanSheets: 3, minutes: 720, yellowCards: 0, redCards: 0, saves: 24,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 4,
  },
  {
    id: "muric", name: "Arijanet Muric", teamId: "nfo", position: "GK", price: 4.0,
    goals: 0, assists: 0, cleanSheets: 2, minutes: 720, yellowCards: 0, redCards: 0, saves: 26,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
  {
    id: "onana", name: "André Onana", teamId: "mun", position: "GK", price: 4.5,
    goals: 0, assists: 0, cleanSheets: 1, minutes: 720, yellowCards: 0, redCards: 0, saves: 30,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 2,
  },
  {
    id: "pope", name: "Alex Palmer", teamId: "sun", position: "GK", price: 4.0,
    goals: 0, assists: 0, cleanSheets: 2, minutes: 720, yellowCards: 0, redCards: 0, saves: 32,
    goalsByGW: [0, 0, 0, 0, 0, 0, 0, 0], assistsByGW: [0, 0, 0, 0, 0, 0, 0, 0], bonusPoints: 3,
  },
];

// Calculate FPL points for each player
export function getFPLPoints(player: Player): number {
  return calculateFPLPoints(player);
}

export function getPlayerGWPoints(player: Player, gw: number): number {
  const idx = gw - 1;
  let pts = 0;
  
  // Minutes (assume 2pts per game started)
  pts += 2;
  
  // Goals
  const goalValue = player.position === "FWD" ? 4 : player.position === "MID" ? 5 : 6;
  pts += (player.goalsByGW[idx] || 0) * goalValue;
  
  // Assists
  pts += (player.assistsByGW[idx] || 0) * 3;
  
  // Bonus (distribute roughly)
  if (player.goalsByGW[idx] > 0 || player.assistsByGW[idx] > 0) {
    pts += Math.round(player.bonusPoints / 8);
  }
  
  return pts;
}

// Get all players sorted by FPL points
export function getTopPlayers(position?: Position, limit?: number): Player[] {
  let filtered = position ? players.filter(p => p.position === position) : [...players];
  filtered.sort((a, b) => getFPLPoints(b) - getFPLPoints(a));
  return limit ? filtered.slice(0, limit) : filtered;
}

// Get top scorers
export function getTopScorers(limit?: number): Player[] {
  const sorted = [...players].sort((a, b) => b.goals - a.goals);
  return limit ? sorted.slice(0, limit) : sorted;
}

// Get top assisters
export function getTopAssisters(limit?: number): Player[] {
  const sorted = [...players].sort((a, b) => b.assists - a.assists);
  return limit ? sorted.slice(0, limit) : sorted;
}

// Get best value picks (points per million)
export function getBestValue(position?: Position, limit?: number): Player[] {
  let filtered = position ? players.filter(p => p.position === position) : [...players];
  filtered.sort((a, b) => (getFPLPoints(b) / b.price) - (getFPLPoints(a) / a.price));
  return limit ? filtered.slice(0, limit) : filtered;
}

// Get differentials (low ownership, high potential - players priced 4.5-6.5 with good returns)
export function getDifferentials(limit?: number): Player[] {
  const filtered = players.filter(p => p.price >= 4.5 && p.price <= 6.5 && getFPLPoints(p) > 30);
  filtered.sort((a, b) => getFPLPoints(b) - getFPLPoints(a));
  return limit ? filtered.slice(0, limit) : filtered;
}

// Get form players (best last 3 GWs)
export function getInFormPlayers(position?: Position, limit?: number): Player[] {
  let filtered = position ? players.filter(p => p.position === position) : [...players];
  filtered.sort((a, b) => {
    const formA = (a.goalsByGW.slice(5).reduce((s, g) => s + g, 0) * 4) + (a.assistsByGW.slice(5).reduce((s, a) => s + a, 0) * 3);
    const formB = (b.goalsByGW.slice(5).reduce((s, g) => s + g, 0) * 4) + (b.assistsByGW.slice(5).reduce((s, a) => s + a, 0) * 3);
    return formB - formA;
  });
  return limit ? filtered.slice(0, limit) : filtered;
}
