import { ConfigAppSDK } from "@contentful/app-sdk";
import {
  Button,
  Flex,
  Form,
  Heading,
  Paragraph,
} from "@contentful/f36-components";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppInstallationParameters {
  templates: Array<{
    id: string;
    name: string;
  }>;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    templates: [],
  });

  const [templates, setTemplates] = useState<
    AppInstallationParameters[`templates`]
  >(parameters.templates || []);

  const sdk = useSDK<ConfigAppSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  const addTemplate = () => {
    const updatedTemplates = [...templates];
    updatedTemplates.push({
      id: uuidv4(),
      name: `Untitled template`,
    });

    setTemplates(updatedTemplates);
  };

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: `80px`, maxWidth: `800px` })}
    >
      <Form>
        <Heading>App Config</Heading>
        <Paragraph>
          Welcome to your contentful app. This is your config page.
        </Paragraph>
        {templates?.at(0) &&
          templates.map(({ id, name }) => <div key={id}>{name}</div>)}
        <Button variant={`positive`} onClick={addTemplate}>
          Add template
        </Button>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
