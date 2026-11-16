/**
 * Mulberry32 Seeded Pseudo-Random Number Generator (PRNG)
 * Ensures deterministic, reproducible demo dataset generation across runs.
 */
export function createRng(initialSeed = 2026) {
  let s = initialSeed >>> 0;

  function next() {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    // Float between 0 (inclusive) and 1 (exclusive)
    random: next,

    // Integer between min and max (inclusive)
    int(min, max) {
      return Math.floor(next() * (max - min + 1)) + min;
    },

    // Pick one element from an array
    pick(arr) {
      if (!arr || arr.length === 0) return null;
      return arr[Math.floor(next() * arr.length)];
    },

    // Pick multiple unique elements from an array
    pickMultiple(arr, count) {
      if (!arr || arr.length === 0) return [];
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    // Pick by weighted probability
    weightedPick(items, weights) {
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let rand = next() * totalWeight;
      for (let i = 0; i < items.length; i++) {
        if (rand < weights[i]) return items[i];
        rand -= weights[i];
      }
      return items[items.length - 1];
    },

    // Boolean with probability of true
    bool(probability = 0.5) {
      return next() < probability;
    },

    // Shuffle an array deterministically
    shuffle(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  };
}
