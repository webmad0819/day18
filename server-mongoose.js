const express = require("express");
const mongoose = require("mongoose");
const Movies = require("./models/Movies");
const app = express();

// this connects to the DB
mongoose
  .connect("mongodb://localhost/webmad0819", { useNewUrlParser: true })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error("Error connecting to mongo", err));

// this transforms duration in string format to a minutes computation
function transformDurationToMinutes(duration) {
  let time = duration.split(" ");

  let hours;
  let minutes;

  if (time[0].indexOf("h") > -1) {
    hours = +time[0].replace("h", "") * 60;
  }

  if (time[0].indexOf("min") > -1) {
    minutes = +time[0].replace("min", "");
  }

  if (time.length > 1 && time[1].indexOf("min") > -1) {
    minutes = +time[1].replace("min", "");
  }

  return hours + minutes;
}

// this creates a new movie
// example URL: http://localhost:5000/new-movie
app.get("/new-movie", (req, res) => {
  Movies.create({
    title: "Ironmovie with timestamps",
    year: 2019,
    rate: 9.2,
    duration: "3h 30min"
  }).then(createdMovie => {
    let createdMovieClean = JSON.parse(JSON.stringify(createdMovie));
    createdMovieClean.duration = transformDurationToMinutes(createdMovie.duration);
    res.json(createdMovieClean);
  });
});

// this yields all the mongo movies
// example URL: http://localhost:5000/movies-mongo
app.get("/movies-mongo", (req, res) => {
  Movies.find().then(allMovies => {
    let allMoviesFinal = allMovies.map(movie => {
      movie = JSON.parse(JSON.stringify(movie));
      movie.duration = transformDurationToMinutes(movie.duration);

      return movie;
    });

    res.json(allMoviesFinal);
  });
});

// this yields a hardcoded static json
// example URL: http://localhost:5000/movies
app.get("/movies", (req, res) => {
  res.json([
    {
      title: "The Shawshank Redemption",
      year: 1994,
      director: "Frank Darabont",
      duration: "2h 22min",
      genre: ["Crime", "Drama"],
      rate: 9.3
    },
    {
      title: "The Godfather",
      year: 1972,
      director: "Francis Ford Coppola",
      duration: "2h 55min",
      genre: ["Crime", "Drama"],
      rate: 9.2
    }
  ]);
});

// this updates a movie with a specific ID
// example URL: http://localhost:5000/movie/update/[your movie id, example: 5d7775a51be232a0c7086d68]
app.get("/movie/update/:movieID", (req, res) => {
  Movies.findByIdAndUpdate(req.params.movieID, {
    title: "new ironmovida actualizada",
    __v: 1
  }).then(updatedMovie => res.json({ updated: true }));
});

// this deletes one movie
// example URL: http://localhost:5000/movie/[your movie id, example: 5d7775a51be232a0c7086d68]
app.get("/movie/delete/:movieID", (req, res) => {
  Movies.findByIdAndDelete(req.params.movieID).then(movieDeleted => {
    res.json({ deleted: true, pablo: "guay" });
  });
});

// this yields one specific movie by id
// example URL: http://localhost:5000/movie/[your movie id, example: 5d7775a51be232a0c7086d68]
app.get("/movie/:movieID", (req, res) => {
  Movies.findById(req.params.movieID)
    .then(movieFound => {
      res.json(movieFound);
    })
    .catch(error => {
      res.json({
        error: true,
        msg: error
      });
    });
});

// this yields all students
// example URL: http://localhost:5000/students
app.get("/students", (req, res) => {
  res.json([{ s1: "pepe" }, { s2: "esther" }]);
});

// this yields all students by genre
// example URL: http://localhost:5000/students/man
app.get("/students/:genre", (req, res) => {
  if (req.params.genre === "man") {
    res.json([{ s1: "pepe" }]);
  } else {
    res.json([{ s2: "esther" }]);
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
