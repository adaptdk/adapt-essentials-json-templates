import {
  Flex,
  FormControl,
  Pill,
  Text,
  TextInput,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { css } from "emotion";
import React, { useState } from "react";

import {
  TypeTemplateField,
  TypeUpdateFieldParameters,
} from "../../../utils/types";

type Props = {
  field: TypeTemplateField;
  updateField: (arg0: TypeUpdateFieldParameters) => void;
};

export const Dropdown = ({ field, updateField }: Props) => {
  const [errorMsg, setErrorMsg] = useState(``);

  const handleSubmit = (e) => {
    if (e.key === `Enter`) {
      const current = [...(field.defaultValue as string[])];
      const { value } = e.target;

      if (value && current) {
        if (current.includes(value)) {
          setErrorMsg(`This value already exists`);
        } else {
          current.push(value);
          updateField({ defaultValue: current });
          e.target.value = ``;
        }
      }
    } else {
      setErrorMsg(``);
    }
  };

  const handleRemove = (label) => {
    const current = [...(field.defaultValue as string[])];
    const filtered = current.filter((item) => item !== label);
    updateField({ defaultValue: filtered });
  };

  return (
    <>
      <FormControl marginBottom={`none`} isInvalid={!!errorMsg}>
        <FormControl.Label>Add value</FormControl.Label>
        <TextInput
          placeholder={`Hit enter to add a value`}
          onKeyDown={handleSubmit}
        />
        {errorMsg && (
          <FormControl.ValidationMessage>
            {errorMsg}
          </FormControl.ValidationMessage>
        )}
      </FormControl>

      <FormControl className={css({ maxWidth: `30%` })}>
        <FormControl.Label>Accepted values</FormControl.Label>
        <Flex
          gap={`spacingM`}
          className={css({
            overflow: `auto`,
            paddingBottom: tokens.spacing2Xs,
          })}
        >
          {Array.isArray(field.defaultValue) && field.defaultValue?.at(0) ? (
            field.defaultValue.map((value) => (
              <Pill
                key={value}
                label={value}
                onClose={() => handleRemove(value)}
              />
            ))
          ) : (
            <Text>No values yet</Text>
          )}
        </Flex>
      </FormControl>
    </>
  );
};
