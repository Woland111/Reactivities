import React, { useContext, Fragment } from "react";
import { Modal } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";
import { observer } from "mobx-react-lite";

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body },
    closeModal
  } = rootStore.modalStore;

  return (
    <Fragment>
      <Modal open={open} onClose={closeModal} size="mini">
        <Modal.Content>{body}</Modal.Content>
      </Modal>
    </Fragment>
  );
};

export default observer(ModalContainer);
