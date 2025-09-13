const { trendScoreForKeywords } = require("./trendService");


const STREAM_KEYWORDS = {
  Data: ["data scientist","data analyst","machine learning","business intelligence"],
  Engineering: ["backend developer","devops","cloud engineer","full stack developer"],
  Design: ["ui designer","ux designer","product designer"],
  Content: ["technical writer","seo specialist","content strategist"],
  Soft: ["project manager","scrum master","customer success"]
};

async function recommendFromScores(categoryScores = {}) {
  const sorted = Object.entries(categoryScores)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,2);

  const keywords = [...new Set(sorted.flatMap(([cat]) => STREAM_KEYWORDS[cat] || []))];
  const trend = await trendScoreForKeywords(keywords);

  const results = [];
  for (const [cat, score] of sorted) {
    for (const role of STREAM_KEYWORDS[cat] || []) {
      const blended = score * 10 + (trend[role] || 0);
      results.push({ stream: cat, role, score, trend: trend[role] || 0, blended });
    }
  }
  results.sort((a,b)=>b.blended - a.blended);

  const streams = [...new Set(results.map(r=>r.stream))].map(s => ({
    stream: s,
    avgCategory: Number(categoryScores[s] || 0),
    topRoles: results.filter(r=>r.stream===s).slice(0,3)
  }));

  return { streams, roles: results.slice(0,6) };
}

module.exports = { recommendFromScores };