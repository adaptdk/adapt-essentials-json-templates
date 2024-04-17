import React from "react";

import type { TypeTemplateField } from "../../utils/types";
import { BooleanField } from "./BooleanField";
import { DropdownField } from "./DropdownField";
import { ImageField, TypeImageField } from "./ImageField";
import { NumberField } from "./NumberField";
import { TextField, TypeTextField } from "./TextField";

export type TypeFieldComponent = {
  updateField: (
    fieldId: string,
    updatedValue: TypeTemplateField[`value`],
  ) => void;
} & TypeTemplateField;

const FieldComponent = (props: TypeFieldComponent) => {
  switch (props.type) {
    case `boolean`:
      return <BooleanField {...props} />;
    case `dropdown`:
      return <DropdownField {...props} />;
    case `number`:
      return <NumberField {...props} />;
    case `text`:
      return <TextField {...(props as TypeTextField)} />;
    case `image`:
      return <ImageField {...(props as TypeImageField)} />;
    default:
      return null;
  }
};

export default FieldComponent;
