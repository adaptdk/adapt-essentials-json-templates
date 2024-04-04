import { FormControl, TextInput } from "@contentful/f36-components";
import React from "react";

import type {
  TypeTemplateField,
  TypeUpdateFieldParameters,
} from "../../../utils/types";
import { Boolean } from "./Boolean";
import { Dropdown } from "./Dropdown";

type Props = {
  field: TypeTemplateField;
  updateField: (arg0: TypeUpdateFieldParameters) => void;
};

const FieldValueInput = ({ field, updateField }: Props) => {
  switch (field.type) {
    case `boolean`:
      return <Boolean field={field} updateField={updateField} />;
    case `dropdown`:
      return <Dropdown field={field} updateField={updateField} />;
    case `number`:
      return (
        <FormControl marginBottom={`none`}>
          <FormControl.Label>Default value</FormControl.Label>
          <TextInput
            type={`number`}
            placeholder={field.defaultValue as string}
          />
        </FormControl>
      );
    case `text`:
      return (
        <FormControl marginBottom={`none`}>
          <FormControl.Label>Default value</FormControl.Label>
          <TextInput placeholder={field.defaultValue as string} />
        </FormControl>
      );
    default:
      return null;
  }
};
export default FieldValueInput;
