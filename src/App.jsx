import { useEffect, useState } from "react";
import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar, {
  Favourites,
  Search,
  SearchResult,
  Logo,
} from "./components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import FavoriteModal from "./components/FavoriteModal";
import { FaSlideshare } from "react-icons/fa";

function App() {
  const [characters, setCharacters] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("FAVORITES-LIST")) || [],
  );
  const [page, setPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nextAvailable, setNextAvailable] = useState(true);
  const [nextSearchAvailable, setNextSearchAvailable] = useState(true);
  const [searchPage, setSearchPage] = useState(1);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResult([]);
      setNextSearchAvailable(false);
      setSearchPage(1);
      return;
    }
    if (query.length < 3) return;
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);

        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character?page=${searchPage}&name=${query}`,
          { signal },
        );
        if (data.info.next) {
          setNextSearchAvailable(true);
          console.log(data.info.next);
        } else {
          setNextSearchAvailable(false);
        }

        if (searchPage === 1) {
          setSearchResult(data.results);
        } else {
          setSearchResult((prevData) => [...prevData, ...data.results]);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;

        if (error.response.status === 404) {
          setSearchResult([]);
          toast.dismiss();
          toast.error("Character not found");
          setNextSearchAvailable(false);
          return;
        }
        toast.error("Something went wrong");
        setNextSearchAvailable(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    return () => {
      controller.abort();
    };
  }, [query, searchPage]);

  //Fetching by page

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);

        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${page}`,
          { signal },
        );
        if (!data.info.next) setNextAvailable(false);
        setNextSearchAvailable(false);

        setCharacters((prevChar) => [...prevChar, ...data.results]);
      } catch (error) {
        if (!axios.isCancel(error)) {
          toast.error(error.response.data.error);
          setCharacters([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      controller.abort();
    };
  }, [page]);

  useEffect(() => {
    localStorage.setItem("FAVORITES-LIST", JSON.stringify(favorites));
  }, [favorites]);

  const handleChangeCharacter = (id) => {
    if (modalIsOpen) setModalIsOpen(false);
    setSelectedCharacter(id);
  };
  const handleFavorites = (char) => {
    setFavorites((prevFavs) => [...prevFavs, char]);
    toast.dismiss();
    toast.success(char.name + " added to favorites.", {
      position: "bottom-center",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };
  const handleRemoveFavorite = (char) => {
    setFavorites((prevFavs) => prevFavs.filter((item) => item.id !== char.id));
    toast.dismiss();
    toast.success(char.name + " removed from favorites", {
      icon: "❌",
      position: "bottom-center",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        flex: 1,
      },
    });
  };
  const addedToFavorites = favorites
    .map((item) => item.id)
    .includes(selectedCharacter);
  const handlePageChange = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const handleSearchPageChange = () => {
    setSearchPage((prevSPage) => prevSPage + 1);
  };
  const displayedCharacters =
    query.trim() && query.length > 2 ? searchResult : characters;
  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <Logo />
        <SearchResult numOfSearch={displayedCharacters.length} />
        <Search query={query} setQuery={setQuery} />
        <Favourites
          favorites={favorites}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          handleChangeCharacter={handleChangeCharacter}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      </Navbar>
      <Main>
        <CharacterList
          addedToFavorites={addedToFavorites}
          handleFavorites={handleFavorites}
          selectedCharacter={selectedCharacter}
          handleChangeCharacter={handleChangeCharacter}
          isLoading={isLoading}
          characters={characters}
          searchResult={searchResult}
          handlePageChange={handlePageChange}
          handleSearchPageChange={handleSearchPageChange}
          displayedCharacters={displayedCharacters}
          nextAvailable={nextAvailable}
          nextSearchAvailable={nextSearchAvailable}
          query={query}
        />
        <CharacterDetail
          addedToFavorites={addedToFavorites}
          selectedCharacter={selectedCharacter}
          handleFavorites={handleFavorites}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}

// Getting API Using FETCH Methods

//   useEffect(() => {
//   async function fetchData() {
//     try {
//       setIsLoading(true);
//       const res = await fetch("https://rickandmortyapi.com/api/character");
//       if (!res.ok) throw new Error("Something went wrong!!");
//       const data = await res.json();
//       setCharacters(data.results);
//       toast.success("Data loaded successfully");
//     } catch (error) {
//       toast.error(error.message);
//       console.log(error.response);
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   fetchData();
// }, []);
