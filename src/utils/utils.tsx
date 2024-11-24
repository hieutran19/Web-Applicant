export const convertLinks = (link: string) => {
  if (link?.includes("drive.google.com")) {
    return link;
  } else if (link?.includes("/media/")) {
    return `${import.meta.env.VITE_MEDIA}${link}`;
  } else {
    return `${import.meta.env.VITE_MEDIA}/media/${link}`;
  }
};
