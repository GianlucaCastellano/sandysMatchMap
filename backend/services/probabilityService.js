const { permute } = require("../utils/permutationHelper");
const boysDAO = require("../dao/boysDAO");
const girlsDAO = require("../dao/girlsDAO");
const matchingNightsDAO = require("../dao/matchingNightsDao");
const matchboxDAO = require("../dao/matchboxDAO");

/**
 * Hilfsfunktion: Prüft, wie viele Übereinstimmungen eine Kombination mit den Picks einer Nacht hat.
 */
const countMatchesInNight = (combination, nightSeating, boys) => {
  let matches = 0;
  boys.forEach((boy, index) => {
    if (nightSeating[boy.id] && combination[index] === nightSeating[boy.id]) {
      matches++;
    }
  });
  return matches;
};

const calculateProbabilities = async () => {
  // 1. Daten laden
  const [boys, girls, matchingNights, matchboxResults] = await Promise.all([
    boysDAO.getAllBoys(),
    girlsDAO.getAllGirls(),
    matchingNightsDAO.getAllMatchingNights(),
    matchboxDAO.getAllMatchBoxes(),
  ]);

  if (!boys.length || !girls.length) {
    throw new Error("Nicht genug Daten vorhanden.");
  }

  const girlIds = girls.map((g) => g.id);
  let validCombinationsCount = 0;
  const pairCounts = {};

  // pairCounts initialisieren
  boys.forEach((boy) => {
    girlIds.forEach((girlId) => {
      pairCounts[`${boy.id}:${girlId}`] = 0;
    });
  });

  // 2. Alle Permutationen durchlaufen
  for (const girlPermutation of permute([...girlIds])) {
    let isPossible = true;

    // --- FILTER A: MATCHBOX ---
    for (const mb of matchboxResults) {
      const boyIndex = boys.findIndex((b) => b.id === mb.boys_id);
      if (boyIndex === -1) continue;

      const girlInCombination = girlPermutation[boyIndex];
      if (mb.result === true) {
        if (girlInCombination !== mb.girls_id) {
          isPossible = false;
          break;
        }
      } else {
        if (girlInCombination === mb.girls_id) {
          isPossible = false;
          break;
        }
      }
    }
    if (!isPossible) continue;

    // --- FILTER B: MATCHING NIGHTS ---
    for (const night of matchingNights) {
      const hits = countMatchesInNight(girlPermutation, night.seating, boys);
      // Fallback für beams/lights
      const actualBeams =
        night.beams !== undefined ? night.beams : night.lights;

      if (hits !== actualBeams) {
        isPossible = false;
        break;
      }
    }
    if (!isPossible) continue;

    // Szenario ist valide
    validCombinationsCount++;
    girlPermutation.forEach((girlId, boyIndex) => {
      const boyId = boys[boyIndex].id;
      pairCounts[`${boyId}:${girlId}`]++;
    });
  }

  // 3. Validierung
  if (validCombinationsCount === 0) {
    throw new Error(
      "Widerspruch in den Daten! Es gibt kein mögliches Szenario.",
    );
  }

  // 4. FORMATIERUNG FÜR FRONTEND
  const boysView = {};
  const girlsView = {};

  // Sicher initialisieren
  boys.forEach((b) => {
    boysView[b.id] = { name: b.name, matches: [] };
  });
  girls.forEach((g) => {
    girlsView[g.id] = { name: g.name, matches: [] };
  });

  for (const key in pairCounts) {
    const [boyId, girlId] = key.split(":");
    const count = pairCounts[key];
    const probability = parseFloat(
      ((count / validCombinationsCount) * 100).toFixed(2),
    );

    const boy = boys.find((b) => b.id === boyId);
    const girl = girls.find((g) => g.id === girlId);

    if (boysView[boyId]) {
      boysView[boyId].matches.push({
        partnerId: girlId,
        partnerName: girl ? girl.name : "Unbekannt",
        probability,
      });
    }

    if (girlsView[girlId]) {
      girlsView[girlId].matches.push({
        partnerId: boyId,
        partnerName: boy ? boy.name : "Unbekannt",
        probability,
      });
    }
  }

  // Sortieren
  const sortByProb = (a, b) => b.probability - a.probability;
  Object.values(boysView).forEach((b) => b.matches.sort(sortByProb));
  Object.values(girlsView).forEach((g) => g.matches.sort(sortByProb));

  console.log(
    `DEBUG: Berechnung fertig. ${validCombinationsCount} Szenarien gefunden.`,
  );

  return {
    totalScenarios: validCombinationsCount,
    calculationTime: new Date().toISOString(),
    boysView,
    girlsView,
  };
};

module.exports = { calculateProbabilities };
