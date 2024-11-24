export const sortStatusArray = (statusArray) => {
  return statusArray.sort((a, b) => a.label.localeCompare(b.label));
};
