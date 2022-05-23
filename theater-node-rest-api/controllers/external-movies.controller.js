const axios = require("axios");
const HttpProxyAgent = require("http-proxy-agent");

const Movie = require("../models/movie");

const apiKey = "a72ef8c22618c2627948855b78ac20bc";
const movieSearchUrl = "http://api.themoviedb.org/3/search/movie?query={0}&page={1}&api_key=" + apiKey;

module.exports = {

  searchMovies: (query, page) => {
    const url = movieSearchUrl.replace("{0}", query).replace("{1}", page);
    try {
      const proxyAgent = new HttpProxyAgent('http://proxy-chain.intel.com:911');
      return axios.get(url, {
        proxy: false,
        httpAgent: proxyAgent
      });
    } catch (error) {
      console.error(error);
    }
  },

  createSearchAutocompleteResult: (results, optionsNumber) => {

    const uniqueFilter = (value, index, self) => {
      return self.indexOf(value) === index;
    }
    
    const namesOnlyArray = results.results.map((res) => {
      return res.title;
    });
    const uniqueAutoCompleteList = namesOnlyArray.filter(uniqueFilter);
    return uniqueAutoCompleteList.slice(0, optionsNumber);
  },

  createMoviesResult: (results) => {
    const convertedMoviesArray = [];
    results.results.forEach((res) => {
        const convertedMovie = {
            movieId: res.id,
            title: res.title,
            overview: res.overview,
            releaseDate: res.release_date,
            posterUrl: res.poster_path,
            voteAvg: res.vote_average,
            voteCount: res.vote_count,
            language: res.original_language,
            isInLocalDB: false
        };
        convertedMoviesArray.push(convertedMovie);
    });
    return {
        page: results.page,
        results: convertedMoviesArray,
        totalPages: results.total_pages,
        totalResults: results.total_results
    };
  },

  checkWhichMoviesExistsInLocalDB: (movies, res) => {
    Movie.find({}, function (error, dbMovies) {
        if (error){
            console.log(error);
        }
        else {
            movies.results.forEach(movie => {
                const dbMovie = dbMovies.find(dbMovie => dbMovie.movieId === movie.movieId);
                if (dbMovie != null) {
                    movie.isInLocalDB = true;
                }
            });
        }
    });
  }
};
