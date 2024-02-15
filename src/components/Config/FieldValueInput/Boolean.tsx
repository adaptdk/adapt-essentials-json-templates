import { FormControl, Switch, TextInput } from "@contentful/f36-components";
import { css } from "emotion";
import React from "react";

import {
  TypeTemplateField,
  TypeUpdateFieldParameters,
} from "../../../utils/types";

type Props = {
  field: TypeTemplateField;
  updateField: (arg0: TypeUpdateFieldParameters) => void;
};

export const Boolean = ({ field, updateField }: Props) => {
  const handleBooleanChange = () => {
    const prevValue = field.defaultValue;
    const value = !prevValue;

    updateField({ defaultValue: value });
  };

  const handleLabelChange = (type: `yes` | `no`, value: string) => {
    switch (type) {
      case `yes`:
        updateField({ yesLabel: value });
        break;
      case `no`:
        updateField({ noLabel: value });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <FormControl marginBottom={`none`}>
        <FormControl.Label className={css({ minWidth: `10ch` })}>
          Default value
        </FormControl.Label>
        <Switch
          isChecked={!!field.defaultValue}
          onChange={handleBooleanChange}
        />
      </FormControl>

      <FormControl marginBottom={`none`}>
        <FormControl.Label>True label</FormControl.Label>
        <TextInput
          placeholder={`Yes`}
          defaultValue={`Yes`}
          onChange={(e) => handleLabelChange(`yes`, e.target.value)}
        />
      </FormControl>

      <FormControl marginBottom={`none`}>
        <FormControl.Label>False label</FormControl.Label>
        <TextInput
          placeholder={`No`}
          defaultValue={`No`}
          onChange={(e) => handleLabelChange(`no`, e.target.value)}
        />
      </FormControl>
    </>
  );
};
