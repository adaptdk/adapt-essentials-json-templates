import { Asset, FieldAppSDK } from "@contentful/app-sdk";
import {
  AssetCard,
  Box,
  Button,
  Flex,
  Menu,
  MenuItem,
  Paragraph,
} from "@contentful/f36-components";
import { ChevronDownIcon, PlusIcon } from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";
import { useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import React, { useEffect, useState } from "react";

import { getEntryStatus } from "../../utils/status";
import { TypeFieldComponent } from ".";

export type TypeImageField = TypeFieldComponent & {
  defaultValue: string;
  value?: Asset;
};

export const ImageField = ({
  id,
  title,
  value,
  updateField,
}: TypeImageField) => {
  const [loading, setLoading] = useState(true);
  const sdk = useSDK<FieldAppSDK>();
  console.log({ sdk });

  const { locale } = sdk.field;
  const { openAsset } = sdk.navigator;
  const { selectSingleAsset } = sdk.dialogs;
  const { create: createAsset, get: getAsset } = sdk.cma.asset;

  // Update the asset on initial load
  useEffect(() => {
    if (value?.sys.id) {
      const updateAsset = async () => {
        const space = await sdk.cma.space.get({});
        const env = await sdk.cma.environment.get({});

        const asset = await getAsset({
          spaceId: space.sys.id,
          environmentId: env.sys.id,
          assetId: value.sys.id,
        });

        if (asset.sys.id) {
          updateField(id, asset);
        }
      };

      updateAsset().then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleClick = async (
    type: `existing` | `new` | `current` | `remove`,
  ) => {
    if (type === `remove`) {
      updateField(id, undefined);
    }

    if (type === `current`) {
      const asset = await openAsset(value.sys.id, {
        slideIn: { waitForClose: true },
      });

      if (asset.entity.sys.id) {
        updateField(id, asset.entity);
      }
    }

    if (type === `existing`) {
      const asset: Asset | null = await selectSingleAsset();

      if (asset.sys.id) {
        updateField(id, asset);
      }
    }

    if (type === `new`) {
      const space = await sdk.cma.space.get({});
      const env = await sdk.cma.environment.get({});
      const asset: Asset = await createAsset(
        {
          spaceId: space.sys.id,
          environmentId: env.sys.id,
        },
        null,
      );

      if (asset.sys.id) {
        const updatedAsset = await openAsset(asset.sys.id, {
          slideIn: { waitForClose: true },
        });

        if (updatedAsset.entity.sys.id) {
          updateField(id, updatedAsset.entity);
        }
      }
    }
  };

  return (
    <Box marginTop={`spacingM`}>
      <Paragraph marginBottom={`spacing2Xs`}>{title}</Paragraph>
      {value ? (
        <AssetCard
          type={`image`}
          isLoading={loading}
          src={value.fields.file[locale].url}
          title={value.fields.title[locale]}
          status={getEntryStatus(value.sys)}
          onClick={() => handleClick(`current`)}
          actions={[
            <MenuItem key={`edit`} onClick={() => handleClick(`current`)}>
              Edit
            </MenuItem>,
            <MenuItem key={`remove`} onClick={() => handleClick(`remove`)}>
              Remove
            </MenuItem>,
          ]}
        />
      ) : (
        <Flex
          justifyContent={`center`}
          alignItems={`center`}
          className={css({
            border: `1px dashed ${tokens.gray600}`,
            borderRadius: tokens.borderRadiusMedium,
            padding: tokens.spacingXl,
          })}
        >
          <Menu>
            <Menu.Trigger>
              <Button
                startIcon={<PlusIcon />}
                endIcon={<ChevronDownIcon />}
                size={`small`}
              >
                Add media
              </Button>
            </Menu.Trigger>

            <Menu.List>
              <Menu.Item onClick={() => handleClick(`existing`)}>
                Add existing media
              </Menu.Item>
              <Menu.Item onClick={() => handleClick(`new`)}>
                Add new media
              </Menu.Item>
            </Menu.List>
          </Menu>
        </Flex>
      )}
    </Box>
  );
};
