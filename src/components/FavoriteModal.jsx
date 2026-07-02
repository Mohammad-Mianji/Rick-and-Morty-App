import { XCircleIcon } from "@heroicons/react/24/outline";

function FavoriteModal({ children, modalIsOpen, setModalIsOpen, numOfFavs }) {
  if (!modalIsOpen) return null;
  return (
    <div className="modal">
      <div className="backdrop" onClick={() => setModalIsOpen(false)}></div>
      <div className="modal__content">
        <div className="modal__header">
          <h2 className="title">You have {numOfFavs} favorite characters</h2>
          <button onClick={() => setModalIsOpen(false)}>
            <XCircleIcon className="icon close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default FavoriteModal;
