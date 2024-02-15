export type TypeTemplateField = {
  id: string;
  title: string;
  type: `text` | `number` | `boolean` | `dropdown`;
  defaultValue: string | boolean | string[];
  yesLabel?: string;
  noLabel?: string;
};

export type TypeUpdateFieldParameters = Partial<Omit<TypeTemplateField, `id`>>;

export type TypeTemplate = {
  id: string;
  name: string;
  isCollection: boolean;
  fields: Array<TypeTemplateField> | [];
};
