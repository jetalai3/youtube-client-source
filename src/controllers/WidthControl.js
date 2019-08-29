export const DEVICE = {
  MOBILE: 'MOBILE',
  TABLET: 'TABLET',
  DESKTOP: 'DESKTOP',
};
export const WIDTH = {
  [DEVICE.MOBILE]: 480,
  [DEVICE.TABLET]: 768,
};
export const PAGE_SIZE = {
  [DEVICE.MOBILE]: 1,
  [DEVICE.TABLET]: 2,
  [DEVICE.DESKTOP]: 4,
};
// eslint-disable-next-line no-unused-vars
export default function getDisplayedClipsQuantity(windowWidth) {
  if (windowWidth <= WIDTH[DEVICE.MOBILE]) {
    return PAGE_SIZE[DEVICE.MOBILE];
  }
  if (windowWidth <= WIDTH[DEVICE.TABLET]) {
    return PAGE_SIZE[DEVICE.TABLET];
  }
  return PAGE_SIZE[DEVICE.DESKTOP];
}
