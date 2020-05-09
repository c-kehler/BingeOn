import React, { useState, useEffect } from "react";
import axios from "axios";
import { find } from "lodash";

const Search = () => {
  const [searchActorsID, setSearchActorsID] = useState();
  const [actorData, setActorData] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [credits, setCredits] = useState({});
  const [runtime, setRuntime] = useState([]);

  const onSearch = async (event) => {
    event.preventDefault();
    try {
      await axios
        .get(
          `https://api.themoviedb.org/3/search/person?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&query=${searchInput}&page=1&include_adult=false`
        )
        .then((res) => {
          setActorData(res.data.results[0]);
          setSearchActorsID(res.data.results[0].id);
        });
      } catch (error) {
        console.log(error)
      }
      
  };
  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${searchActorsID}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&append_to_response=credits`
      )
      .then((result) => {
        setCredits(result);
      });
  }, [searchActorsID]);
  useEffect(() => {
    let movieIdArray = credits?.data?.credits.cast.map((value) => value.id);
    if (movieIdArray) {
      setRuntime([]);
      movieIdArray.map((id) =>
        axios
          .get(
            ` https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`
          )
          .then((result) => {
            if (!find(result.data.genres, { name: "Documentary" })) {
              setRuntime((runtime) => [...runtime, result.data.runtime]);
            }
          })
      );
    }
  }, [credits]);
  const minToHours = (num) => {
    console.log(num)
    let hours = Math.floor(num / 60);
    let minutes = num % 60;
    return (<p>It would take <span class="font-bold">{hours}</span> hours and <span class="font-bold">{minutes}</span> minutes to watch all of their movies</p>);
  };
  const minToDays = (num) => {
    let hours = Math.floor(num / 60 % 24);
    let Days = Math.floor(num / 60 / 24);
    let minutes = Math.floor(num % 60);
    console.log(credits?.data?.credits?.cast)
    return (<p> <span class="font-bold">{Days}</span> days, <span class="font-bold">{hours}</span> hours and <span class="font-bold">{minutes}</span> minutes</p>);
  }
  return (
    <div class="w-full h-full bg-gray-100 pt-20">
      <div class="z-10 relative max-w-sm rounded overflow-hidden shadow-lg mx-auto w-full md:w-2/3 bg-white">
        <form onSubmit={onSearch}>
          <div>
            <div class="bg-white flex items-center h-12 shadow">
              <input
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                class="bg-white rounded-l-full w-full py-1 px-6 text-gray-700 leading-tight focus:outline-none"
                id="search"
                type="text"
                placeholder="Search For Actor"
              />
              <div class="p-4">
                <button class="text-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center">
                  <svg
                    version="1.1"
                    class="h-4 text-dark"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 52.966 52.966"
                  >
                    <path
                      d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
        c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
        C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
        S32.459,40,21.983,40z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>

        {runtime.length ? (
          <>
            <div class="flex flex-col">
              <div class="-mb-20 mt-4 z-10">
                <img
                  class="object-cover h-48 w-48 rounded-full mx-auto mb-4 border-white border-8"
                  src={`https://image.tmdb.org/t/p/w500/${actorData?.profile_path}`}
                ></img>
              </div>
              <div class="bg-gray-200 pt-20 p-8">
                <div>
                  {actorData?.name} has been in{" "}
                  <span class="font-bold">{runtime.length}</span> movies
                </div>
                <div>{minToHours(runtime.reduce((a, b) => a + b, 0))}</div>
                <div>
                  That's {minToDays(runtime.reduce((a, b) => a + b, 0))}
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div class="absolute image-grid overflow-hidden z-0 h-screen top-0 flex flex-wrap">
        {credits?.data?.credits?.cast.map((value) =>
          value.poster_path ? (
            <img
              class="w-20 opacity-25"
              src={`https://image.tmdb.org/t/p/w500/${value.poster_path}`}
            ></img>
          ) : (
            ""
          )
        )}
        {credits?.data?.credits?.cast.length < 150 &&
          credits?.data?.credits?.cast.map((value) =>
            value.poster_path ? (
              <img
                class="w-20 opacity-25"
                src={`https://image.tmdb.org/t/p/w500/${value.poster_path}`}
              ></img>
            ) : (
              ""
            )
          )}
      </div>
    </div>
  );
};

export default Search;
