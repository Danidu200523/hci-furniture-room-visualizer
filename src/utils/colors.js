export const getColor = (name) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
};