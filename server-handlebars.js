const express = require("express");
const mongoose = require("mongoose");
const Movies = require("./models/Movies");
const app = express();
const hbs = require("hbs");

mongoose
  .connect("mongodb://localhost/webmad0819", { useNewUrlParser: true })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error("Error connecting to mongo", err));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.get("/players", (req, res) => {
  const players = [
    {
      name: "Rusell",
      lastName: "Westbrook",
      team: "OKC",
      photo:
        "https://thunderousintentions.com/wp-content/uploads/getty-images/2017/12/891998404-oklahoma-city-thunder-v-indiana-pacers.jpg.jpg"
    },
    {
      name: "Kevin",
      lastName: "Durant",
      team: "GSW",
      photo:
        "https://img.bleacherreport.net/img/images/photos/003/670/482/hi-res-3c2473cd8600df96c4b94c93808562c8_crop_north.jpg?h=533&w=800&q=70&crop_x=center&crop_y=top"
    },
    {
      name: "Lebron",
      lastName: "James",
      team: "CLE",
      photo:
        "https://usatftw.files.wordpress.com/2018/01/ap_cavaliers_timberwolves_basketball.jpg?w=1000&h=600&crop=1"
    },
    {
      name: "Emanuel",
      lastName: "Ginóbilli",
      team: "SAS",
      photo:
        "https://cdn.vox-cdn.com/thumbor/Z9kR0HDJrzOzxOdwGe7Jwyxxvjk=/0x0:2802x4203/1200x800/filters:focal(1329x1158:1777x1606)/cdn.vox-cdn.com/uploads/chorus_image/image/57733525/usa_today_10429631.0.jpg"
    },
    {
      name: "Kyrie",
      lastName: "Irving",
      team: "BOS",
      photo:
        "https://cdn-s3.si.com/s3fs-public/styles/marquee_large_2x/public/2017/11/11/kyrie-irving-mvp-case.jpg?itok=PWYqUSGf"
    },
    {
      name: "Kobe",
      lastName: "Bryant",
      team: "LAK",
      photo:
        "https://clutchpoints.com/wp-content/uploads/2017/10/Kobe-Bryant-e1508564618882.jpg"
    }
  ];
  res.render("players", { players });
});

app.get("/cities", (req, res) => {
  res.render("cities", {
    cities: [
      { name: "madrid", population: 4000000 },
      { name: "bcn", population: 2000000 },
      { name: "london", population: 9000000 }
    ]
  });
});

app.get("/hbstest", (req, res) => {
  res.render("render-html", {
    name: "<h1>Marta</h1>",
    age: 20,
    salary: Math.round(Math.random() * 10000)
  });
});

app.get("/movies/:year", (req, res) => {
  Movies.find({ year: req.params.year })
    .select({ title: 1, director: 1, rate: 1 })
    .then(allMoviesOfThatYear => {
      if (allMoviesOfThatYear.length === 0) {
        res.render("movies", {
          noMovies: true
        });
      }

      allMoviesOfThatYear = allMoviesOfThatYear.map(movie => {
        movie.director = movie.director.toUpperCase();
        return movie;
      });

      allMoviesOfThatYear = JSON.parse(JSON.stringify(allMoviesOfThatYear));

      res.render("movies", {
        data: allMoviesOfThatYear
      });
    });
});

app.listen(5010, () => {
  console.log("Server started on port 5010");
});
