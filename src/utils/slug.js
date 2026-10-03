export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
};