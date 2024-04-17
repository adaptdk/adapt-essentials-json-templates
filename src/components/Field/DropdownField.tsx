import { Box, Paragraph, Select } from "@contentful/f36-components";
import React from "react";

import { TypeFieldComponent } from ".";

export const DropdownField = ({ title, defaultValue }: TypeFieldComponent) => (
  <Box marginTop={`spacingM`}>
    <Paragraph marginBottom={`spacing2Xs`}>{title}</Paragraph>
    {Array.isArray(defaultValue) && defaultValue.at(0) && (
      <Select>
        {defaultValue.map((value) => (
          <Select.Option key={value} value={value}>
            {value}
          </Select.Option>
        ))}
      </Select>
    )}
  </Box>
);
