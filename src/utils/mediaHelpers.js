// utils/mediaHelpers.js
function detectResourceType(mime = '', filename = '') {
  const m = String(mime).toLowerCase();
  const f = String(filename).toLowerCase();

  // Images
  if (m.startsWith('image/')) return 'image';

  // Video (Cloudinary treats audio under 'video' resource_type too)
  if (m.startsWith('video/') || m.startsWith('audio/')) return 'video';

  // Documents / everything else -> 'raw'
  const docExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.txt', '.rtf'];
  if (docExts.some(ext => f.endsWith(ext))) return 'raw';

  // Fallback
  return 'raw';
}

function parseTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(t => String(t).trim()).filter(Boolean);
  // allow JSON string or comma list
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parseTags(parsed);
  } catch {}
  return String(input).split(',').map(t => t.trim()).filter(Boolean);
}

module.exports = { detectResourceType, parseTags };
