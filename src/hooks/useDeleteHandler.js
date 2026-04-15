import { toast } from "react-hot-toast";

export const useDeleteHandler = (
  deleteMutation,
  refetchFn,
  closeModal,
  successMessage = "Deleted successfully!",
) => {
  const handleDelete = (id) => {
    deleteMutation(id, {
      onSuccess: () => {
        toast.success(successMessage);
        closeModal();
        refetchFn();
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to delete",
        );
      },
    });
  };

  return { handleDelete };
};