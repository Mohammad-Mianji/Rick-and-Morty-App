import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { IoIosHeart, IoIosHeartDislike } from "react-icons/io";

function CharacterDeatil({
  selectedCharacter,
  handleFavorites,
  handleRemoveFavorite,
  addedToFavorites,
}) {
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [sortBy, setSortBy] = useState(true);
  useEffect(() => {
    async function getCharacter() {
      try {
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedCharacter}`,
        );
        setCharacter(data);
        const episodesId = data.episode.map((item) => item.split("/").at(-1));
        const { data: episodesData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`,
        );
        setEpisodes([episodesData].flat());
        setSortBy(true);
      } catch (error) {
        toast.error(error.message);
      }
    }
    if (selectedCharacter) getCharacter();
  }, [selectedCharacter]);

  //   useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const { data } = await axios.get(
  //         `https://rickandmortyapi.com/api/character/${selectedCharacter}`,
  //       );
  //       console.log(data);
  //     } catch (error) {
  //     } finally {
  //     }
  //   }
  //   fetchData();
  // }, []);

  if (!character || !selectedCharacter)
    return (
      <div className="detail-fixed">
        <h1>Please select a character</h1>
      </div>
    );
  return (
    <div className="detail-fixed">
      <Toaster />
      <CharacterDetailInfo
        character={character}
        handleFavorites={handleFavorites}
        handleRemoveFavorite={handleRemoveFavorite}
        addedToFavorites={addedToFavorites}
      />
      <EpisodesList sortBy={sortBy} setSortBy={setSortBy} episodes={episodes} />
    </div>
  );
}

export default CharacterDeatil;

function CharacterDetailInfo({
  character,
  handleFavorites,
  handleRemoveFavorite,
  addedToFavorites,
}) {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === "Male" ? "🧔🏻‍♂️ " : "👩🏻‍🦰 "}</span>
          <span>{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>{character.status}</span>
          <span> - {character.species}</span>
        </div>
        <div className="location">
          <p>Last known location:</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {addedToFavorites ? (
            <button
              className="btn btn--remove"
              onClick={() => handleRemoveFavorite(character)}
            >
              <IoIosHeartDislike /> Remove Favorite
            </button>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => handleFavorites(character)}
            >
              <IoIosHeart /> Add to Favorites
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EpisodesList({ episodes, sortBy, setSortBy }) {
  let sortedEpisodes;
  if (sortBy) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created),
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created),
    );
  }

  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of episodes:</h2>
        <button onClick={() => setSortBy((prevState) => !prevState)}>
          <ArrowUpCircleIcon
            className="icon"
            style={{ rotate: sortBy ? "0deg" : "180deg" }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, "0")} {item.episode} -{" "}
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
