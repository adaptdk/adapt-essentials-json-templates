import { FieldAppSDK } from "@contentful/app-sdk";
import {
  Box,
  Button,
  Flex,
  Form,
  Grid,
  Heading,
  SectionHeading,
  Text,
} from "@contentful/f36-components";
import { DeleteIcon, PlusIcon } from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";
import {
  useAutoResizer,
  useFieldValue,
  useSDK,
} from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import React, { useMemo } from "react";

import FieldComponent from "../components/Field";
import { TypeTemplate, TypeTemplateField } from "../utils/types";

const Field = () => {
  useAutoResizer();

  const [value, setValue] = useFieldValue<TypeTemplate | null>();
  const sdk = useSDK<FieldAppSDK>();
  const templates = useMemo(() => sdk.parameters.installation.templates, [sdk]);

  const updateField = (
    fieldId: string,
    updatedValue: TypeTemplateField[`value`],
  ) => {
    if (!value) {
      return;
    }
    console.log(`svx`);

    const newValue = { ...value };

    // Find the field and update it
    const fieldIndex = newValue.fields.findIndex((f) => f.id === fieldId);
    if (fieldIndex !== -1) {
      newValue.fields[fieldIndex] = {
        ...newValue.fields[fieldIndex],
        value: updatedValue,
      };

      setValue(newValue);
    }
  };

  return (
    <Form>
      {templates?.at(0) && !value && (
        <Grid
          className={css({
            gridTemplateColumns: `repeat(2, 1fr)`,
            gap: tokens.spacingM,
            maxHeight: `350px`,
          })}
        >
          {templates.map((template) => (
            <Flex
              key={template.id}
              className={css({
                padding: tokens.spacingM,
                border: `1px solid ${tokens.gray300}`,
                flexDirection: `column`,
                borderRadius: tokens.borderRadiusMedium,
              })}
            >
              <Heading>{template.name}</Heading>
              <SectionHeading
                className={css({ marginBottom: tokens.spacingXs })}
              >
                Fields
              </SectionHeading>
              <Flex
                flexDirection={`column`}
                gap={`spacing2Xs`}
                className={css({ marginBottom: tokens.spacingM })}
              >
                {template.fields.map((field) => (
                  <Flex key={field.id}>
                    <Text
                      className={css({
                        textTransform: `capitalize`,
                        color: tokens.gray500,
                        flexBasis: `70px`,
                      })}
                    >
                      {field.type}
                    </Text>
                    <Text>{field.title}</Text>
                  </Flex>
                ))}
              </Flex>

              <Button
                className={css({ marginTop: `auto`, alignSelf: `center` })}
                variant={`positive`}
                startIcon={<PlusIcon />}
                onClick={() => setValue(template)}
              >
                Select template
              </Button>
            </Flex>
          ))}
        </Grid>
      )}

      {value?.fields?.at(0) && (
        <Box>
          <Flex
            alignItems={`center`}
            justifyContent={`space-between`}
            className={css({
              borderRadius: tokens.borderRadiusMedium,
              backgroundColor: tokens.gray100,
              padding: tokens.spacingM,
            })}
          >
            <Heading className={css({ margin: 0 })}>{value.name}</Heading>
            <Button
              startIcon={<DeleteIcon />}
              variant={`negative`}
              size={`small`}
              onClick={() => setValue(undefined)}
            >
              Remove
            </Button>
          </Flex>

          {value.fields.map((field: TypeTemplateField) => (
            <FieldComponent
              key={field.id}
              {...field}
              updateField={updateField}
            />
          ))}
        </Box>
      )}
    </Form>
  );
};

export default Field;
