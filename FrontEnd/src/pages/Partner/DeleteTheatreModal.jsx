import React from "react";
import { Modal } from "antd";
import { deleteTheatre } from "../../api/theatre";
import useApi from "../../hooks/useApi";

const DeleteTheatreModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) => {
  const { execute: removeTheatre } = useApi(deleteTheatre, {
    successMessage: true,
    onSuccess: () => getData(),
  });

  const handleOk = async () => {
    await removeTheatre({ theatreId: selectedTheatre._id });
    setIsDeleteModalOpen(false);
    setSelectedTheatre(null);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedTheatre(null);
  };
  return (
    <>
      <Modal
        title="Delete Theatre?"
        open={isDeleteModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p className="pt-3 fs-18">
          Are you sure you want to delete this theatre?
        </p>
        <p className="pb-3 fs-18">
          This action can't be undone and you'll lose this theatre data.
        </p>
      </Modal>
    </>
  );
};

export default DeleteTheatreModal;
