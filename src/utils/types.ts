import { Asset } from "@contentful/app-sdk";

export type TypeTemplateField = {
  id: string;
  title: string;
  type: `text` | `number` | `boolean` | `dropdown` | `image`;
  defaultValue: string | boolean | string[];
  value?: string | boolean | string[] | Asset;
  yesLabel?: string;
  noLabel?: string;
};

export type TypeUpdateFieldParameters = Partial<Omit<TypeTemplateField, `id`>>;

export type TypeTemplate = {
  id: string;
  name: string;
  fields: Array<TypeTemplateField> | [];
};
