import { Box, Paragraph, TextInput } from "@contentful/f36-components";
import React from "react";

import { TypeFieldComponent } from ".";

export const NumberField = ({ title, defaultValue }: TypeFieldComponent) => (
  <Box marginTop={`spacingM`}>
    <Paragraph marginBottom={`spacing2Xs`}>{title}</Paragraph>
    <TextInput defaultValue={defaultValue as string} />
  </Box>
);
