export const getYoutubeVideoId = (url) => {
  if (!url) return null;
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m && m[1]) return m[1];
    }
    return null;
  } catch {
    return null;
  }
};

export const getYoutubeThumbnail = (url, quality = "hqdefault") => {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
};
