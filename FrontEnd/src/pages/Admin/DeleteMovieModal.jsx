import { Modal } from "antd";
import { deleteMovie } from "../../api/movie";
import useApi from "../../hooks/useApi";

const DeleteMovieModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedMovie,
  setSelectedMovie,
  getData,
}) => {
  const { execute: removeMovie } = useApi(deleteMovie, {
    successMessage: true,
    onSuccess: () => getData(),
  });

  const handleOk = async () => {
    await removeMovie({ movieId: selectedMovie._id });
    setSelectedMovie(null);
    setIsDeleteModalOpen(false);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      title="Delete Movie?"
      open={isDeleteModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p className="pt-3 fs-18">Are you sure you want to delete this movie?</p>
      <p className="pb-3 fs-18">
        This action can't be undone and you'll lose this movie data.
      </p>
    </Modal>
  );
};

export default DeleteMovieModal;
