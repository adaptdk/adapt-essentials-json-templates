import {
  ButtonGroup,
  Flex,
  FormControl,
  IconButton,
  Radio,
  SectionHeading,
  Stack,
  Text,
  TextInput,
} from "@contentful/f36-components";
import { CopyIcon, PlusIcon } from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";
import { css } from "emotion";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import type { TypeTemplate, TypeTemplateField } from "../../utils/types";
import { ConfirmRemoval } from "../ConfirmRemoval";
import TemplateField from "./TemplateField";

type TypeTemplateEditor = {
  template: TypeTemplate;
  setTemplates: Dispatch<SetStateAction<TypeTemplate[]>>;
};

const TemplateEditor = ({ template, setTemplates }: TypeTemplateEditor) => (
  <Flex
    key={template.id}
    flexDirection="column"
    marginBottom={`spacingM`}
    padding={`spacingL`}
    className={css({
      border: `1px solid ${tokens.gray300}`,
      borderRadius: tokens.borderRadiusMedium,
    })}
  >
    <FormControl isRequired>
      <Flex>
        <FormControl.Label
          className={css({
            display: `block`,
          })}
        >
          Template name
        </FormControl.Label>
        <ButtonGroup
          spacing="spacingS"
          variant="spaced"
          className={css({
            marginLeft: `auto`,
          })}
        >
          <IconButton
            aria-label="Clone template"
            variant="positive"
            icon={<CopyIcon />}
            onClick={() =>
              setTemplates((prevTemplates) => [
                ...prevTemplates,
                { ...template, id: uuidv4() },
              ])
            }
          />
          <ConfirmRemoval
            name={`${template.name} template`}
            action="Delete"
            onConfirm={() => {
              setTemplates((prev) => prev.filter((t) => t.id !== template.id));
            }}
          />
        </ButtonGroup>
      </Flex>
      <TextInput
        className={css({
          maxWidth: `35rem`,
        })}
        value={template.name}
        onChange={(e) => {
          setTemplates((prevTemplates) =>
            prevTemplates.map((prevTemplate) => {
              const value = e?.target?.value;
              if (prevTemplate.id === template.id) {
                return {
                  ...prevTemplate,
                  name: value,
                };
              }
              return prevTemplate;
            }),
          );
        }}
      />
      <FormControl.HelpText>
        Please enter a name for your template
      </FormControl.HelpText>
    </FormControl>

    <FormControl isRequired>
      <FormControl.Label>Collection</FormControl.Label>
      <Stack flexDirection="row">
        <Radio id={`${template.id}}-yes`} name={template.id} value="yes">
          Yes
        </Radio>
        <Radio
          id={`${template.id}}-no`}
          name={template.id}
          value="no"
          defaultChecked
        >
          No
        </Radio>
      </Stack>
      <FormControl.HelpText>
        Will it be used to store multiple entries of the same template?
      </FormControl.HelpText>
    </FormControl>

    <SectionHeading>Fields</SectionHeading>
    <Flex flexDirection="column" marginBottom="spacingM">
      {template.fields?.at(0) ? (
        template.fields?.map((field: TypeTemplateField, idx: number) => (
          <TemplateField
            key={field.id}
            field={field}
            index={idx}
            setTemplates={setTemplates}
          />
        ))
      ) : (
        <Text>There are no fields.</Text>
      )}
    </Flex>

    <Flex>
      <IconButton
        aria-label="Add a field"
        variant="primary"
        icon={<PlusIcon />}
        onClick={() => {
          setTemplates((prevTemplates) =>
            prevTemplates.map((prevTemplate) => {
              if (prevTemplate.id === template.id) {
                return {
                  ...prevTemplate,
                  fields: [
                    ...prevTemplate.fields,
                    {
                      id: uuidv4(),
                      title: `Untitled`,
                      type: `text`,
                      defaultValue: `Default value`,
                    },
                  ],
                };
              }
              return prevTemplate;
            }),
          );
        }}
      >
        Add a field
      </IconButton>
    </Flex>
  </Flex>
);

export default TemplateEditor;
