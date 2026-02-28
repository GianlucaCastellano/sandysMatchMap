const { permute } = require("../utils/permutationHelper");
const boysDAO = require("../dao/boysDAO");
const girlsDAO = require("../dao/girlsDAO");
const matchingNightsDAO = require("../dao/matchingNightsDAO");
const matchboxDAO = require("../dao/matchboxDAO"); // NEU: Musst du noch erstellen

const countMatchesInNight = (combination, nightSeating, boys) => {
  let matches = 0;
  boys.forEach((boy, index) => {
    if (combination[index] === nightSeating[boy.id]) {
      matches++;
    }
  });
  return matches;
};

const calculateProbabilities = async () => {
  // 1. DATEN LADEN
  const [boys, allGirls, matchingNights, matchboxResults] = await Promise.all([
    boysDAO.getAllBoys(),
    girlsDAO.getAllGirls(),
    matchingNightsDAO.getAllMatchingNights(),
    matchboxDAO.getAllMatchBoxes(),
  ]);

  const girlIds = allGirls.map((g) => g.id);
  let validCombinationsCount = 0;
  const pairCounts = {};

  boys.forEach((boy) => {
    girlIds.forEach((girlId) => {
      pairCounts[`${boy.id}-${girlId}`] = 0;
    });
  });

  // 2. DER GENERATOR
  for (const girlPermutation of permute([...girlIds])) {
    let isPossible = true;

    // --- NEU: MATCHBOX FILTER ---
    for (const mb of matchboxResults) {
      const boyIndex = boys.findIndex((b) => b.id === mb.boys_id);
      const girlInCombination = girlPermutation[boyIndex];

      if (mb.result === true) {
        // Perfect Match
        if (girlInCombination !== mb.girls_id) {
          isPossible = false;
          break;
        }
      } else {
        // No Match
        if (girlInCombination === mb.girls_id) {
          isPossible = false;
          break;
        }
      }
    }
    if (!isPossible) continue;

    // --- BESTEHENDER FILTER: MATCHING NIGHTS ---
    for (const night of matchingNights) {
      const hits = countMatchesInNight(girlPermutation, night.seating, boys);
      if (hits !== night.lights) {
        isPossible = false;
        break;
      }
    }

    if (isPossible) {
      validCombinationsCount++;
      girlPermutation.forEach((girlId, boyIndex) => {
        const boyId = boys[boyIndex].id;
        pairCounts[`${boyId}-${girlId}`]++;
      });
    }
  }

  if (validCombinationsCount === 0) {
    throw new Error("Widerspruch in den Daten gefunden!");
  }

  // 3. ERGEBNISSE AUFBEREITEN
  const probabilities = [];
  for (const key in pairCounts) {
    const [boyId, girlId] = key.split("-"); // FIX: Kein .map(Number) wegen UUIDs!
    const count = pairCounts[key];

    probabilities.push({
      boyId,
      girlId,
      percentage: parseFloat(
        ((count / validCombinationsCount) * 100).toFixed(2),
      ),
    });
  }

  return {
    totalValidScenarios: validCombinationsCount,
    probabilities,
  };
};

module.exports = { calculateProbabilities };
