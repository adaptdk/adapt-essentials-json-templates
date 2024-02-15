import {
  Flex,
  FormControl,
  IconButton,
  Select,
  TextInput,
} from "@contentful/f36-components";
import { CopyIcon } from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";
import { css } from "emotion";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";

import { FIELD_TYPE_DEFAULT_VALUES, FIELD_TYPES } from "../../utils/constants";
import {
  TypeTemplate,
  TypeTemplateField,
  TypeUpdateFieldParameters,
} from "../../utils/types";
import { ConfirmRemoval } from "../ConfirmRemoval";
import FieldValueInput from "./FieldValueInput";

type Props = {
  field: TypeTemplateField;
  index: number;
  setTemplates: Dispatch<SetStateAction<TypeTemplate[]>>;
};

const TemplateField = ({ field, index, setTemplates }: Props) => {
  const updateField = (parameters: TypeUpdateFieldParameters) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) => {
        const updatedFields = template.fields.map((f) => {
          if (f.id === field.id) {
            return {
              ...f,
              ...parameters,
            };
          }
          return f;
        });

        return { ...template, fields: updatedFields };
      }),
    );
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as TypeTemplateField[`type`];

    let additionalTypeProps = {};
    switch (type) {
      case `boolean`:
        additionalTypeProps = {
          yesLabel: `Yes`,
          noLabel: `No`,
        };
        break;
      default:
        break;
    }

    updateField({
      type,
      defaultValue: FIELD_TYPE_DEFAULT_VALUES[type],
      ...additionalTypeProps,
    });
  };

  return (
    <Flex
      key={field.id}
      gap={`spacingM`}
      justifyContent={`space-between`}
      padding={`spacingS`}
      className={css({
        borderRadius: tokens.borderRadiusMedium,
        backgroundColor: index % 2 ? tokens.gray100 : `transparent`,
      })}
    >
      <Flex gap={`spacingM`}>
        <FormControl marginBottom="none">
          <FormControl.Label>Title</FormControl.Label>
          <TextInput
            defaultValue={field.title}
            onChange={(e) => updateField({ title: e.target.value })}
          />
        </FormControl>
        <FormControl marginBottom="none">
          <FormControl.Label>Type</FormControl.Label>
          <Select
            id="optionSelect"
            name="optionSelect"
            defaultValue={field.type}
            onChange={handleTypeChange}
          >
            {FIELD_TYPES.map(({ type, label }) => (
              <Select.Option key={type} value={type}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </FormControl>
        <FieldValueInput field={field} updateField={updateField} />
      </Flex>

      <Flex gap={`spacingM`}>
        <FormControl>
          <FormControl.Label style={{ display: `block` }}>
            Clone
          </FormControl.Label>
          <IconButton
            aria-label="Clone field"
            variant="positive"
            icon={<CopyIcon />}
            onClick={() => {
              setTemplates((prevTemplates) =>
                prevTemplates.map((template) => {
                  if (template.id === template.id) {
                    return {
                      ...template,
                      fields: [...template.fields, { ...field, id: uuidv4() }],
                    };
                  }
                  return template;
                }),
              );
            }}
          />
        </FormControl>
        <FormControl className={css({ justifySelf: `flex-end` })}>
          <FormControl.Label style={{ display: `block` }}>
            Remove
          </FormControl.Label>
          <ConfirmRemoval
            name={`${field.id} field`}
            onConfirm={() => {
              setTemplates((prevTemplates) =>
                prevTemplates.map((template) => {
                  if (template.id === template.id) {
                    return {
                      ...template,
                      fields: template.fields.filter(
                        (currentField: TypeTemplateField) =>
                          currentField.id !== field.id,
                      ),
                    };
                  }
                  return template;
                }),
              );
            }}
          />
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default TemplateField;
