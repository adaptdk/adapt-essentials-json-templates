import { ConfigAppSDK } from '@contentful/app-sdk';
import {
  Flex,
  Form,
  FormControl,
  Heading,
  Text,
  Paragraph,
  SectionHeading,
  TextInput,
  IconButton,
  ButtonGroup,
  Stack,
  Select,
  Radio,
  ModalLauncher,
  ModalConfirm,
} from '@contentful/f36-components';
import { PlusIcon, DeleteIcon, CopyIcon } from '@contentful/f36-icons';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppInstallationParameters {
  templates: Array<{
    id: string;
    name: string;
    isCollection: boolean;
    fields:
      | Array<{
          id: string;
          title: string;
          type: 'text' | 'number' | 'boolean' | 'date' | 'media' | 'reference';
          defaultValue: any;
        }>
      | [];
  }>;
}

function ConfirmRemoval({
  dialogText = 'Are you sure you want to remove it?',
  action = 'Remove',
  onConfirm,
  buttonClassName,
}: Readonly<{
  dialogText?: string;
  action?: 'Remove' | 'Delete';
  onConfirm: () => void;
  buttonClassName?: string;
}>) {
  const onRemove = () => {
    ModalLauncher.open(({ isShown, onClose }) => {
      return (
        <ModalConfirm
          title={`Confirm ${action === 'Remove' ? 'removal' : 'deletion'}`}
          intent="negative"
          isShown={isShown}
          onCancel={() => {
            onClose(false);
          }}
          onConfirm={() => {
            onClose(true);
          }}
          confirmLabel={action}
          cancelLabel="Cancel"
        >
          <Text>{dialogText}</Text>
        </ModalConfirm>
      );
    }).then((result) => {
      if (result === true) {
        onConfirm();
      }
    });
  };

  return (
    <IconButton
      aria-label={
        action === 'Remove' ? 'Remove the field' : 'Delete the template'
      }
      variant="negative"
      icon={<DeleteIcon />}
      onClick={onRemove}
      className={buttonClassName}
    />
  );
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
      isCollection: false,
      fields: [],
    });

    setTemplates(updatedTemplates);
  };

  return (
    <Form
      className={css({
        maxWidth: `calc(998px + 3rem)`,
        margin: `3rem auto`,
      })}
    >
      <Heading>App Config</Heading>
      <Paragraph>
        Welcome to JSON Templates. Start by adding your fist template.
      </Paragraph>

      {templates?.map((template) => (
        <Flex
          key={template.id}
          flexDirection="column"
          marginBottom="spacingM"
          className={css({
            border: `1px solid #e3e3e3`,
            padding: `2rem 1.5rem`,
          })}
        >
          <FormControl isRequired>
            <Flex>
              <FormControl.Label
                className={css({
                  display: 'block',
                })}
              >
                Template name
              </FormControl.Label>
              <ButtonGroup
                spacing="spacingS"
                variant="spaced"
                className={css({
                  marginLeft: 'auto',
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
                  dialogText={`Are you sure you want to delete the "${template.name}" template?`}
                  action="Delete"
                  onConfirm={() => {
                    setTemplates(templates.filter((t) => t.id !== template.id));
                  }}
                />
              </ButtonGroup>
            </Flex>
            <TextInput
              className={css({
                maxWidth: '35rem',
              })}
              value={template.name}
              onChange={(e) => {
                setTemplates((prevTemplates) => {
                  return prevTemplates.map((prevTemplate) => {
                    const value = e?.target?.value;
                    if (prevTemplate.id === template.id) {
                      return {
                        ...prevTemplate,
                        name: value,
                      };
                    }
                    return prevTemplate;
                  });
                });
              }}
            />
            <FormControl.HelpText>
              Please enter your name for your template
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
            {template.fields?.map((field, idx) => (
              <Flex
                key={field.id}
                gap="1rem"
                paddingRight="spacingM"
                paddingLeft="spacingM"
                paddingTop="spacingS"
                paddingBottom="spacingS"
                style={{
                  backgroundColor: idx % 2 ? `#f3f3f3` : `transparent`,
                }}
              >
                <Text>{field.id}</Text>
                <FormControl marginBottom="none">
                  <FormControl.Label>Title</FormControl.Label>
                  <TextInput defaultValue={field.title} />
                </FormControl>
                <FormControl marginBottom="none">
                  <FormControl.Label>Type</FormControl.Label>
                  <Select
                    id="optionSelect"
                    name="optionSelect"
                    defaultValue={field.type}
                  >
                    <Select.Option value="text">Text</Select.Option>
                    <Select.Option value="number">Number</Select.Option>
                    <Select.Option value="boolean">Boolean</Select.Option>
                    <Select.Option value="date">Date</Select.Option>
                    <Select.Option value="Media">Media</Select.Option>
                    <Select.Option value="Media">Reference</Select.Option>
                  </Select>
                </FormControl>
                <FormControl marginBottom="none">
                  <FormControl.Label>Default value</FormControl.Label>
                  <TextInput defaultValue={field.defaultValue} />
                </FormControl>
                <FormControl>
                  <FormControl.Label style={{ display: 'block' }}>
                    Clone
                  </FormControl.Label>
                  <IconButton
                    aria-label="Clone field"
                    variant="positive"
                    icon={<CopyIcon />}
                    onClick={() => {
                      setTemplates((prevTemplates) => {
                        return prevTemplates.map((template) => {
                          if (template.id === template.id) {
                            return {
                              ...template,
                              fields: [
                                ...template.fields,
                                { ...field, id: uuidv4() },
                              ],
                            };
                          }
                          return template;
                        });
                      });
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label style={{ display: 'block' }}>
                    Remove
                  </FormControl.Label>
                  <ConfirmRemoval
                    dialogText={`Are you sure you want to remove the field ${field.id}?`}
                    onConfirm={() => {
                      setTemplates((prevTemplates) => {
                        return prevTemplates.map((template) => {
                          if (template.id === template.id) {
                            return {
                              ...template,
                              fields: template.fields.filter(
                                (currentField) => currentField.id !== field.id
                              ),
                            };
                          }
                          return template;
                        });
                      });
                    }}
                  />
                </FormControl>
              </Flex>
            ))}
            {!template.fields?.at(0) && <Text>There are no fields.</Text>}
          </Flex>
          <Flex>
            <IconButton
              aria-label="Add a field"
              variant="primary"
              icon={<PlusIcon />}
              onClick={() => {
                setTemplates((prevTemplates) => {
                  return prevTemplates.map((prevTemplate) => {
                    if (prevTemplate.id === template.id) {
                      return {
                        ...prevTemplate,
                        fields: [
                          ...prevTemplate.fields,
                          {
                            id: uuidv4(),
                            title: 'Untitled',
                            type: 'boolean',
                            defaultValue: 'Default value',
                          },
                        ],
                      };
                    }
                    return prevTemplate;
                  });
                });
              }}
            >
              Add a field
            </IconButton>
          </Flex>
        </Flex>
      ))}
      <IconButton
        aria-label="Add a new template"
        icon={<PlusIcon />}
        variant="positive"
        onClick={() => {
          addTemplate();
        }}
      >
        Add a new template
      </IconButton>
    </Form>
  );
};

export default ConfigScreen;
