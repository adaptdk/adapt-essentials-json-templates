import { ConfigAppSDK } from "@contentful/app-sdk";
import {
  Accordion,
  Form,
  Heading,
  IconButton,
  Paragraph,
} from "@contentful/f36-components";
import { PlusIcon } from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { TemplateEditor } from "../components/Config";
import { TypeTemplate } from "../utils/types";

export interface AppInstallationParameters {
  templates: Array<TypeTemplate>;
}

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();

  const [parameters, setParameters] = useState<AppInstallationParameters>({
    templates: [],
  });

  const [templates, setTemplates] = useState<
    AppInstallationParameters[`templates`]
  >(parameters.templates);

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    console.log(`on save: `, templates);
    return {
      parameters: {
        templates,
      },
      targetState: currentState,
    };
  }, [templates, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure, parameters]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);

        if (currentParameters?.templates) {
          setTemplates(currentParameters.templates);
        }
      }
      sdk.app.setReady();
    })();
  }, [sdk]);

  useEffect(() => {
    if (parameters.templates?.at(0)) {
      setTemplates(parameters.templates);
    }
  }, [parameters]);

  const addTemplate = () => {
    const updatedTemplates = [...templates];
    updatedTemplates.push({
      id: uuidv4(),
      name: `Untitled template`,
      isCollection: false,
      fields: [],
    });

    setTemplates(updatedTemplates);
  };

  return (
    <Form
      className={css({
        maxWidth: tokens.contentWidthDefault,
        padding: tokens.spacingL,
        margin: `0 auto`,
      })}
    >
      <Heading>App Config</Heading>
      <Paragraph>
        Welcome to JSON Templates. Start by adding your first template.
      </Paragraph>

      {templates?.at(0) && (
        <Accordion className={css({ marginBottom: tokens.spacingL })}>
          {templates?.map((template) => (
            <Accordion.Item key={template.id} title={template.name}>
              <TemplateEditor template={template} setTemplates={setTemplates} />
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <IconButton
        aria-label="Add template"
        icon={<PlusIcon />}
        variant="positive"
        onClick={() => {
          addTemplate();
        }}
      >
        Add template
      </IconButton>
    </Form>
  );
};

export default ConfigScreen;
