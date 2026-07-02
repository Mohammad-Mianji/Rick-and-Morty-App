import {
  EyeDropperIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { IoIosHeart, IoIosHeartDislike } from "react-icons/io";

function CharacterList({
  characters,
  searchResult,
  isLoading,
  handleChangeCharacter,
  setPage,
  selectedCharacter,
  handlePageChange,
  handleSearchPageChange,
  displayedCharacters,
  nextAvailable,
  nextSearchAvailable,
  query,
}) {
  return (
    <div className="characters-list" style={{ flex: 1 }}>
      {query.length > 3 ? (
        <span className="next-page__search top">
          Loading {displayedCharacters.length} characters with "
          <b className="icon red">{query}</b>" name.
        </span>
      ) : (
        ""
      )}
      {displayedCharacters.map((item) => (
        <Character
          selectedCharacter={selectedCharacter}
          item={item}
          key={item.id}
          handleChangeCharacter={handleChangeCharacter}
        ></Character>
      ))}
      {nextSearchAvailable ? (
        <button className="btn btn--secondary" onClick={handleSearchPageChange}>
          <span className="next-page__search">
            Load More Characters with "<b className="icon red">{query}</b>"
            name.
          </span>
        </button>
      ) : (
        ""
      )}

      {nextAvailable && !nextSearchAvailable && !query.trim() ? (
        <button className="btn btn--green" onClick={handlePageChange}>
          <span className="next-page">
            Showing {displayedCharacters.length} characters -{" "}
          </span>
          Load More Characters
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default CharacterList;

export function Character({
  item,
  children,
  handleChangeCharacter,
  selectedCharacter,
}) {
  return (
    <div
      className={`list__item ${selectedCharacter === item.id ? "selected" : ""}`}
      onClick={() => handleChangeCharacter(item.id)}
    >
      <img src={item.image} alt={item.name} />
      <CharacterName item={item} />
      <CharacterInfo item={item} />

      {children}
    </div>
  );
}

function CharacterName({ item }) {
  return (
    <h3 className="name">
      <span>{item.gender === "Male" ? "🧔🏻‍♂️ " : "👩🏻‍🦰 "}</span>
      <span>{item.id} - </span>
      <span>{item.name}</span>
    </h3>
  );
}

function CharacterInfo({ item }) {
  return (
    <div className="list-item__info info">
      <span className={`status ${item.status === "Dead" ? "red" : ""}`}></span>
      <span>{item.status}</span>
      <span> - {item.species}</span>
    </div>
  );
}
