/* eslint-disable no-undef */
import getDisplayedClipsQuantity from '../controllers/WidthControl';


test('Test the behavior of getDisplayedClipsQuantity() for desktops', () => {
  const res = getDisplayedClipsQuantity(1200);
  expect(res).toEqual(4);
});

test('Test the behavior of getDisplayedClipsQuantity() for tablets', () => {
  const res = getDisplayedClipsQuantity(700);
  expect(res).toEqual(2);
});

test('Test the behavior of getDisplayedClipsQuantity() for mobiles', () => {
  const res = getDisplayedClipsQuantity(300);
  expect(res).toEqual(1);
});
