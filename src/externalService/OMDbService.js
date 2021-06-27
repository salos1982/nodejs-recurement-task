const axios = require('axios');

const MoviesExternalService = require('../moviesExtenalService');
const { APIError } = require('../apiError');
const Movie = require('../Movie');

class OMDbService extends MoviesExternalService {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = 'http://www.omdbapi.com/';
  }

  async getMovieInfo(title) {
    if (!title) {
      throw new APIError(400, 'title must not be null or empty');
    }

    const response = await this.runRequest({t: title});
    if (response.Response === 'False') {
      return null;
    }

    if (response.Error) {
      console.error(response.Error);
      return null;
    }

    const movie = new Movie();
    movie.title = response.Title;
    movie.releaseDate = Date.parse(response.ReleaseDate);
    movie.genre = response.Genre;
    movie.director = response.Director;

    return movie;
  }

  async runRequest(params) {
    const query = { ...params };
    query.apiKey = this.apiKey;

    try {
      const options = {
        params: query,
      }
      return await axios(this.apiUrl, options).then(response => response.data);
    } catch(err) {
      console.error(err);
      throw new APIError(503, err.message);
    }
    
  }
}

module.exports = OMDbService;
