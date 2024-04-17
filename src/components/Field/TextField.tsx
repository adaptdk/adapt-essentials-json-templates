import { Box, Flex, Paragraph, TextInput } from "@contentful/f36-components";
import React from "react";

import { TypeFieldComponent } from ".";

export type TypeTextField = TypeFieldComponent & {
  defaultValue: string;
  value?: string;
};

export const TextField = ({
  id,
  title,
  defaultValue,
  value,
  updateField,
}: TypeTextField) => (
  <Box marginTop={`spacingM`}>
    <Paragraph marginBottom={`spacing2Xs`}>{title}</Paragraph>
    <TextInput
      defaultValue={(value as string) || (defaultValue as string)}
      onChange={(e) => updateField(id, e.target.value)}
    />
    <Flex justifyContent={`space-between`} marginTop={`spacingXs`}>
      <Paragraph>{value?.length || defaultValue?.length} characters</Paragraph>
      <Paragraph>Maximum 256 characters</Paragraph>
    </Flex>
  </Box>
);
