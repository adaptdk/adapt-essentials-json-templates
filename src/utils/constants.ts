export const FIELD_TYPES = [
  {
    type: `text`,
    label: `Text`,
  },
  {
    type: `number`,
    label: `Number`,
  },
  {
    type: `boolean`,
    label: `Boolean`,
  },
  {
    type: `dropdown`,
    label: `Dropdown`,
  },
  {
    type: `image`,
    label: `Image`,
  },
];

export const FIELD_TYPE_DEFAULT_VALUES = {
  boolean: false,
  number: `0`,
  dropdown: [],
  text: ``,
  image: undefined,
};
