import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import FavoriteModal from "./FavoriteModal";
import { useEffect, useState } from "react";
import { Character } from "./CharacterList";

function Navbar({ children }) {
  return <nav className="navbar">{children}</nav>;
}

export default Navbar;

export function Logo() {
  return (
    <div className="navbar__logo">
      <img
        src="src\images\rick-and-morty-logo.png"
        alt="Rick and Morty Characters"
      />
    </div>
  );
}

export function Search({ query, setQuery }) {
  return (
    <input
      value={query}
      type="search"
      className="text-field"
      placeholder="Search..."
      onChange={(event) => setQuery(event.target.value)}
    />
  );
}

export function SearchResult({ numOfSearch }) {
  return <div className="navbar__result"> {numOfSearch} Characters Loaded</div>;
}

export function Favourites({
  favorites,
  handleRemoveFavorite,
  handleChangeCharacter,
  modalIsOpen,
  setModalIsOpen,
}) {
  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [modalIsOpen]);
  return (
    <>
      <FavoriteModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        numOfFavs={favorites.length}
      >
        {favorites.length == 0 && modalIsOpen ? (
          <p style={{ color: "white" }}>You have no favorite characters.</p>
        ) : (
          favorites.map((item) => (
            <Character
              item={item}
              key={item.id}
              handleChangeCharacter={handleChangeCharacter}
            >
              <button
                className="icon red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(item);
                }}
              >
                <TrashIcon />
              </button>
            </Character>
          ))
        )}
      </FavoriteModal>
      <button className="heart" onClick={() => setModalIsOpen(true)}>
        <HeartIcon className="icon" />
        <span className="badge">{favorites.length}</span>
      </button>
    </>
  );
}
