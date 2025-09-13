const { trends } = require("google-trends-api-client");

async function trendScoreForKeywords(keywords = [], { geo = "" } = {}) {
  try {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setFullYear(endTime.getFullYear() - 1);

    const series = await trends.getInterestOverTime({
      keywords,            
      startTime,
      endTime,
      geo,               
    });

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
    return Object.fromEntries(keywords.map(k => [k, 50]));
  }
}

module.exports = { trendScoreForKeywords };
