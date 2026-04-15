import { useState } from "react";

export const useDeleteModal = () => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });
  
  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      id,
      name,
    });
    console.log("id from delete modal", id);
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      name: "",
    });
  };

  return {
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
  };
};
