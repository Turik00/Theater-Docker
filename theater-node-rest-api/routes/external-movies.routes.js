const express = require("express");
const externalMovieRoute = express.Router();
const externalMoviesController = require("../controllers/external-movies.controller");

externalMovieRoute.get("/search-movies/:query/:page", async (req, res) => {
  const searchedMovies = await externalMoviesController.searchMovies(req.params.query, req.params.page).catch((err) => res.status(500).send(err));
  const searchedMoviesRes = await externalMoviesController.createMoviesResult(searchedMovies.data);
  await externalMoviesController.checkWhichMoviesExistsInLocalDB(searchedMoviesRes, res);
  res.status(200).json(searchedMoviesRes);
});

externalMovieRoute.get("/search-movies-autocomplete/:query/:options", function (req, res) {
  externalMoviesController
    .searchMovies(req.params.query, 1)
    .then((result) => res.status(200).send(
        externalMoviesController.createSearchAutocompleteResult(result.data, req.params.options)))
    .catch((err) => res.status(500).send(err));
});

module.exports = externalMovieRoute;
