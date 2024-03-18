

import("./omdb").then(function (page) {
  page.render();
});



//elements
let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");

//event listener
openBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);

//TA FRAM MENYN
function toggleMenu() {
  let navMenuEl = document.getElementById("nav-menu");

  let style = window.getComputedStyle(navMenuEl);

  if (style.display === "none") {
    navMenuEl.style.display = "block";
  } else {
    navMenuEl.style.display = "none";
  }
}

//ELEMENT OCH EVENTLISTENERS
const inputEl = document.getElementById("input"); //SÖKFÖNSTER
const submitBtn = document.getElementById("submit"); //SÖKKNAPP
const searchResult = document.getElementById("results-stream"); //RESULTATLISTA FILMER
const showMovieInfo = document.getElementById("movie-info");//DIV FÖR SPECIFICS FÖR EN FILM, SKA TAS BORT VID NY SÖKNING
const searchResultTV =  document.getElementById("results-tvdb");//RESULTATLISTA SERIER
const showTvInfo = document.getElementById("tv-info");//DIV FÖR SPECIFICS FÖR EN serie, SKA TAS BORT VID NY SÖKNING
const seasonEl = document.getElementById("season-container"); //container där alla tv-säsonger hamnar

//submitBtn.addEventListener("click", searchMovies, false);
submitBtn.addEventListener("click", displaySearchResult, false);

//SÖKER EFTER FILMER
async function searchDBmovie(){
  let inputValue = inputEl.value;
  const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${inputValue}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
    }
  }; 
      
    try {    
      //MOVIE
      const response = await fetch(movieUrl, options);
      const result = await response.json();        
      
      return result;   
   
    } catch (error) {
      console.error(error);
    }      
}

//SÖKER EFTER TV-PROGRAM
async function searchDBtv(){
  let inputValue = inputEl.value;
  const url = `https://api.themoviedb.org/3/search/tv?query=${inputValue}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
    }
  };       
      const response = await fetch(url, options);
      const resultTV = await response.json();
      
      return resultTV;     
              
}

async function displaySearchResult(){
  //TA BORT DE TIDIGARE SÖKRESULTATEN
  searchResult.innerHTML = "";
  searchResultTV.innerHTML = "";
  showMovieInfo.innerHTML = "";
  showTvInfo.innerHTML = "";
  seasonEl.innerHTML = "";

  //SÖK/SÖK PÅ NYTT
  const movies = await searchDBmovie();
  const tvshows = await searchDBtv();

  //TA BORT "DOLD" CSS-KLASS PÅ RESULTATET SÅ DET VISAS I DOM
  searchResult.classList.remove("hide-search-list");
  searchResultTV.classList.remove("hide-search-list");  

    //FILMER
    for(i = 0; i < movies.results.length; i++){
  
      let listOfMoviesEl = document.createElement("div");
      listOfMoviesEl.dataset.id = movies.results[i].id; 
      listOfMoviesEl.classList.add("results-movie-item");
      posterEl = "https://image.tmdb.org/t/p/w45" + movies.results[i].poster_path;   

      listOfMoviesEl.innerHTML = `<div class = "results-item-thumbnail">
      <img src = ${posterEl}></div>
      <div class = "results-item-info">
      <div class="title-div">
      <h3>${movies.results[i].title}</h3>
      </div>
      <div class="airdate-div">
      <h4>(Film)</h4>
      <p>${movies.results[i].release_date}</p>
      </div>
      </div>`;
    
      searchResult.appendChild(listOfMoviesEl);
    }

    //TV
    for(i = 0; i < tvshows.results.length; i++){   
    
      let listOfTvshowsEl = document.createElement("div");
      listOfTvshowsEl.dataset.id = tvshows.results[i].id; 
      listOfTvshowsEl.classList.add("results-tv-item");
      posterEl = "https://image.tmdb.org/t/p/w45" + tvshows.results[i].poster_path;     
 
      listOfTvshowsEl.innerHTML = `<div class = "results-item-thumbnail">
      <img src = ${posterEl}></div>
      <div class = "results-item-info">
      <div class="title-div">
      <h3>${tvshows.results[i].name}</h3>
      </div>
      <div class="airdate-div">
      <h4>(TV)</h4>
      <p>${tvshows.results[i].first_air_date}</p>
      </div>
      </div>`;  

      searchResultTV.appendChild(listOfTvshowsEl);
    }    

  makeLinksMovies();
  makeLinksTV();  

}

//SKAPA LÄNKAR
 async function makeLinksMovies(){
  const searchedMovies = searchResult.querySelectorAll(".results-movie-item");
  
//LÄGG TILL LÄNKAR PÅ ALLA SÖKRESULTAT
  searchedMovies.forEach((searched) => {
    searched.addEventListener("click", async () => {

//NÄR ANV KLICKAR PÅ ETT SÖKRESULTAT, FÖRSVINNER ALLA RESULTAT
  searchResult.classList.add("hide-search-list");
  searchResultTV.classList.add("hide-search-list");
  inputEl.value = "";

const url = `https://api.themoviedb.org/3/movie/${searched.dataset.id}?language=en-US`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
  }
};
const result = await fetch(url, options);
const movieDetails = await result.json();    

getIMDBidMovie(movieDetails);

    });
  });
}

async function makeLinksTV(){
  //LÄGG TILL LÄNKAR PÅ ALLA SÖKRESULTAT(TV)
  const searchedTVshows = searchResultTV.querySelectorAll(".results-tv-item");
  searchedTVshows.forEach((searched) => {
    searched.addEventListener("click", async () => {
       //NÄR ANV KLICKAR PÅ ETT SÖKRESULTAT, FÖRSVINNER ALLA RESULTAT
      searchResult.classList.replace("results-stream", "hide-search-list");
      searchResultTV.classList.replace("results-tvdb", "hide-search-list");
      inputEl.value = "";
 
      //VID KLICK GÖRS ETT NYTT API-ANROP
const url = `https://api.themoviedb.org/3/tv/${searched.dataset.id}?language=en-US`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
  }
};
const result = await fetch(url, options);
const tvDetails = await result.json();    

getIMDBidTV(tvDetails);
    });
  });
}
 


//HÄMTA IMDB-ID FÖR ATT SEDAN GÖRA ANROP TILL OMDB OCH FÅ LISTA PÅ SKÅDISAR OSV
async function getIMDBidMovie(movieDetails){
  let movieID = movieDetails.id;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
    }
  };  
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/external_ids`, options);
    const result = await response.json();

  let IMDBid = result.imdb_id;
  const responseOMDB = await fetch(`http://www.omdbapi.com/?apikey=68bda63a&i=${IMDBid}`);
  const resultOMDB = await responseOMDB.json();

getInfoOmdb(resultOMDB, movieDetails);          
}

async function getIMDBidTV(tvDetails){
  let tvID = tvDetails.id;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
    }
  };
  
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvID}/external_ids`, options);
    const result = await response.json();

  let IMDBid = result.imdb_id;
  const responseOMDB = await fetch(`http://www.omdbapi.com/?apikey=68bda63a&i=${IMDBid}`);
  const resultOMDB = await responseOMDB.json();

  getInfoOmdbTV(resultOMDB, tvDetails);
  
}

//VISA DETALJERAD INFORMATION OM VALD FILMTITEL
//VISA OLIKA RATINGS I DOM 
async function getInfoOmdb(resultOMDB, movieDetails){
 
  let genreArray = movieDetails.genres.map(a => a.name).join(" | ").toString();

  let array = resultOMDB.Ratings;   

  showMovieInfo.innerHTML = `
  <img class="movie-poster" src= "https://image.tmdb.org/t/p/w185/${movieDetails.poster_path}"/>
  <h1 class = "movie-title">${movieDetails.title}</h1>
  <ul class = "misc-info">
  <li id="year"><b>Premiärdatum </b><br>${movieDetails.release_date}</li> 
  <li id="length"><b>Längd </b><br>${movieDetails.runtime} min</li>
  <li id="genre"><b>Genre </b><br>${genreArray}</li></ul>
  <h4 class = "actors">Skådespelare<br> ${resultOMDB.Actors}</h4>
  <p id="overwiew">${movieDetails.overview}</p>
  <div class="scores">
  <p class="score" id="averageScore" ><b>TMDB: </b>${movieDetails.vote_average}</p>`;

  for(let i = 0; i < array.length; i++){
    showMovieInfo.innerHTML +=  `<p class="score"><b>${array[i].Source}: </b>${array[i].Value}</p></div>`;   
  }
  whereIsTheMovieStream(movieDetails);
}

//HÄMTA OCH VISA VAR FILMEN STREAMAR
async function whereIsTheMovieStream(movieDetails){
  
  let movieID = movieDetails.id;
  const url = `https://api.themoviedb.org/3/movie/${movieID}/watch/providers`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
    }
  };  
 
const answer = await fetch(url, options);
const answered = await answer.json();


let streamingInfo = document.createElement("div");  
streamingInfo.classList.add("streamer-list");

for(let i = 0; i < answered.results['SE'].buy.length; i++){
  streamingInfo.innerHTML += `
  <img class="streamer-logo" src="https://image.tmdb.org/t/p/w45/${answered.results['SE'].buy[i].logo_path}"/>
  `;
}
showMovieInfo.appendChild(streamingInfo);
}

  //VISA DETALJERAD INFORMATION OM VALD TV-TITEL
  //VISA OLIKA RATINGS I DOM 
async function getInfoOmdbTV(resultOMDB, tvDetails){
 
  let genreArray = tvDetails.genres.map(a => a.name).join(" | ").toString();    

  let array = resultOMDB.Ratings;  

  showTvInfo.innerHTML = `
<img class="tv-poster" src= "https://image.tmdb.org/t/p/w185/${tvDetails.poster_path}"/>
<h1 class="movie-title">${tvDetails.name}</h1>
<ul class = "misc-info">
<li id="year"><b>Premiärdatum </b><br>${tvDetails.first_air_date}</li> 
<li id="length"><b>Längd </b><br>${tvDetails.episode_run_time[0]} min</li>
<li id="genre"><b>Genre </b><br>${genreArray}</li></ul>
<h4 class="actors">Skådespelare<br> ${resultOMDB.Actors}</h4>
<p id="overwiew">${tvDetails.overview}</p>
<div class="scores"><p class="score" id="averageScore" ><b>TMDB: </b>${tvDetails.vote_average}</p>`;

for(let i = 0; i < array.length; i++){
  showTvInfo.innerHTML += `<p class="score"><b>${array[i].Source}: </b>${array[i].Value}</p></div>`;  
 };
let seasonArray = tvDetails.seasons;

for(let i = 0; i < seasonArray.length; i++){

  let seasonList = document.createElement("div");
  seasonList.dataset.id = seasonArray[i].season_number;
  seasonList.classList.add("seasons-div");

  seasonList.innerHTML += `<img class="season-poster" src="https://image.tmdb.org/t/p/w92/${seasonArray[i].poster_path}"/>
  <p class="seasons"><b>${seasonArray[i].name}</b> Antal avsnitt: ${seasonArray[i].episode_count}</p>
  </div>`;

  seasonEl.appendChild(seasonList);
}
makeSeasonLinks(tvDetails);
whereIsTheStream(tvDetails);
}

async function whereIsTheStream(tvDetails){
  
  let tvID = tvDetails.id;
  const url = `https://api.themoviedb.org/3/tv/${tvID}/watch/providers`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
  }
};

const answer = await fetch(url, options);
const answered = await answer.json();

let streamingInfoTV = document.createElement("div");  
streamingInfoTV.classList.add("streamer-list");

for(let i = 0; i < answered.results['SE'].flatrate.length; i++){
  streamingInfoTV.innerHTML += `
  <img class="streamer-logo" src="https://image.tmdb.org/t/p/w45/${answered.results['SE'].flatrate[i].logo_path}"/>`
}
showTvInfo.appendChild(streamingInfoTV);
}

//HÄMTA INFO OM SPECIFIK SERIESÄSONG, VID KLICK
async function makeSeasonLinks(tvDetails){
  const TVseasons = seasonEl.querySelectorAll(".seasons-div");

  TVseasons.forEach((season) => {
    season.addEventListener("click", async () => {
      //VID KLICK GÖRS API-ANROP
      const url = `https://api.themoviedb.org/3/tv/${tvDetails.id}/season/${season.dataset.id}?language=en-US`;
    
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjRiYjc0YzYwMDI0MjFmZmE0NWEzN2IyYmJjMDhjNyIsInN1YiI6IjY1ZGEwODUzZjhhZWU4MDE3YzQxNmUxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Tm3VM8c4WC3_tAeRYHRyN__XNeFouwkkEQVAXoJeVv0'
        }        
      };

      const result = await fetch(url, options);
      const seasonDetails = await result.json();    

      displaySeasons(seasonDetails);   
    })
  })
}

//VISA INFO OM SPECIFIK SERIESÄSONG
async function displaySeasons(seasonDetails){

  let episodes = seasonDetails.episodes;
  let seasonInfo = document.createElement("div");
  
  seasonInfo.classList.add("season-details");

  seasonInfo.innerHTML = `
  <img class="season-poster-details" src="https://image.tmdb.org/t/p/w185/${seasonDetails.poster_path}"/>
  <h2>${seasonDetails.name}</h2>
  <h4>${seasonDetails.overview}`;

  for(let i = 0; i < episodes.length; i++){
    seasonInfo.innerHTML += `<div id="${episodes[i].id}" class="episode-details"> <h3>Avsnitt: ${episodes[i].episode_number}</h3>
    <h4>Premiärdatum: ${episodes[i].air_date}</h4>
    <p class="episode-overview">${episodes[i].overview}</p></div>`;
  } 
  seasonEl.appendChild(seasonInfo);

}




