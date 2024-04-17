import { Box, Paragraph, Radio } from "@contentful/f36-components";
import React from "react";

import { TypeFieldComponent } from ".";

export const BooleanField = ({
  title,
  defaultValue,
  yesLabel,
  noLabel,
}: TypeFieldComponent) => (
  <Box marginTop={`spacingM`}>
    <Paragraph marginBottom={`spacing2Xs`}>{title}</Paragraph>
    <Radio name={title} value={`true`} defaultChecked={!!defaultValue}>
      {yesLabel}
    </Radio>
    <Radio name={title} value={`false`} defaultChecked={!defaultValue}>
      {noLabel}
    </Radio>
  </Box>
);
