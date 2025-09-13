// CommonJS version
const { trends } = require("google-trends-api-client");

async function trendScoreForKeywords(keywords = [], { geo = "" } = {}) {
  try {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setFullYear(endTime.getFullYear() - 1);

    // NOTE: method name is getInterestOverTime (not interestOverTime)
    const series = await trends.getInterestOverTime({
      keywords,            // array of strings
      startTime,
      endTime,
      geo,                 // e.g. "PK" for Pakistan or "" global
      // resolution: "WEEK" // optional
    });

    // series is an array of points per keyword; normalize/average per role
    // shape from the client is already parsed JSON. We’ll compute per keyword.
    const averages = {};
    for (const kw of keywords) {
      const points = series
        .filter(p => p.keyword === kw)
        .map(p => Number(p.value) || 0);
      const avg = points.reduce((a, b) => a + b, 0) / (points.length || 1);
      averages[kw] = Math.round(avg);
    }
    return averages;
  } catch (e) {
    // graceful fallback
    return Object.fromEntries(keywords.map(k => [k, 50]));
  }
}

module.exports = { trendScoreForKeywords };
