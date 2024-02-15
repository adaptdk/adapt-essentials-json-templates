import {
  IconButton,
  ModalConfirm,
  ModalLauncher,
  Text,
} from "@contentful/f36-components";
import { DeleteIcon } from "@contentful/f36-icons";
import React from "react";

export function ConfirmRemoval({
  name = `this`,
  action = `Remove`,
  onConfirm,
  buttonClassName,
}: Readonly<{
  name?: string;
  action?: `Remove` | `Delete`;
  onConfirm: () => void;
  buttonClassName?: string;
}>) {
  const onRemove = () => {
    ModalLauncher.open(({ isShown, onClose }) => (
      <ModalConfirm
        title={`Confirm ${action === `Remove` ? `removal` : `deletion`}`}
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
        <Text>
          Are you sure you want to remove <b>{name}</b>?
        </Text>
      </ModalConfirm>
    )).then((result) => {
      if (result === true) {
        onConfirm();
      }
    });
  };

  return (
    <IconButton
      aria-label={
        action === `Remove` ? `Remove the field` : `Delete the template`
      }
      variant="negative"
      icon={<DeleteIcon />}
      onClick={onRemove}
      className={buttonClassName}
    />
  );
}
