function Movie(id, title, countries, yearStart, yearEnd, genres, age,
               imdbRating, kinopoiskRating, image, imageBg) {
        this.id = id;
        this.title = title;
        this.countries = countries;
        this.yearStart = yearStart;
        this.yearEnd = yearEnd;
        this.genres = genres;
        this.age = age;
        this.imdbRating = imdbRating;
        this.kinopoiskRating = kinopoiskRating;
        this.image = image;
        this.imageBg = imageBg;
        this.getMovieTitle = function (){
            if (yearEnd === null) return this.title.toString();
            else return this.title + ' (сериал ' + this.yearStart + ' - ' + this.yearEnd + ')';
        }
        this.getMovieInfo = function (){
            return (this.countries.join(', ') + ", " + this.yearStart + "&nbsp;&nbsp;&nbsp;&nbsp;" + this.genres.join(', ') +
                "&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"age-rating\">" + this.age + "</span>\n" +
                "<p>IMDb: "+ this.imdbRating +" <img class=\"star-icon\" src=\"img/rating-star-icon.png\">\n" +
                "&nbsp;Кинопоиск: " + this.kinopoiskRating + " <img class=\"star-icon\" src=\"img/rating-star-icon.png\"></p>");
        }
}
var movieGenres = [
    "Детектив",
    "Фантастика",
    "Боевик",
    "Для детей",
    "Комедия",
    "Мелодрама",
    "Приключения"
];
var movies = [
    new Movie(0,"Бэтман",["США"],
    2022, null, [movieGenres[2], movieGenres[6]],
    "16+",8.4, 7.9,
    "/covers/batman-2022.jpg", "/covers/batman-2022-bg.jpg"
    ),
    new Movie(1,"Анчартед: На картах не значится",["США", "Испания"],
        2022, null, [movieGenres[2], movieGenres[5]],
        "12+",6.7, 7.1,
        "/covers/uncharted-2022.jpg", "/covers/uncharted-2022-bg.jpg"
    ),
    new Movie(2,"Смерть на Ниле",["США","Великобритания"],
        2022, null, [movieGenres[0], movieGenres[6]],
        "16+",6.6, 6.6,
        "/covers/death-on-the-nile-2022.jpg", "/covers/death-on-the-nile-2022-bg.jpg"
    ),
    new Movie(3,"Во все тяжкие",["США"],
        2008, 2013, [movieGenres[0], movieGenres[2], movieGenres[5]],
        "18+",9.5, 8.9,
        "/covers/breaking-bad-2008.jpg", "/covers/breaking-bad-2008-bg.jpg"
    ),
    new Movie(4,"Энканто",["США"],
        2021, null, [movieGenres[3], movieGenres[4], movieGenres[6]],
        "16+",8.4, 7.5,
        "/covers/encanto-2021.jpg", "/covers/encanto-2021-bg.jpg"
    ),
    new Movie(5, "Марсианин", ["Великобритания","США","Венгрия","Иордания"],
    2015, null, [movieGenres[1], movieGenres[6]],
    "16+", 8.0, 7.7,
    "/covers/martian-2015.jpg", "/covers/martian-2015-bg.jpg"
    ),
    new Movie(6, "Дюна", ["США","Канада","Венгрия"],
    2021, null, [movieGenres[1], movieGenres[2], movieGenres[5], movieGenres[6]],
    "12+", 8.1, 7.7,
    "/covers/dune-2021.jpg", "/covers/dune-2021-bg.jpg"
    ),
    new Movie(7, "Один дома", ["США"],
    1990, null, [movieGenres[3], movieGenres[4]],
    "0+", 7.7, 8.3,
    "/covers/home-alone-1990.jpg", "/covers/home-alone-1990-bg.jpg"
    ),
    new Movie(8, "Суперсемейка", ["США"],
    2004, null, [movieGenres[2], movieGenres[3], movieGenres[6]],
    "6+", 8.1, 7.6,
    "/covers/incredibles-2004.jpg", "/covers/incredibles-2004-bg.jpg"
    ),
    new Movie(9, "Настоящий детектив", ["США"],
    2014, 2019, [movieGenres[0], movieGenres[5]],
    "18+", 8.9, 8.7,
    "/covers/true-detective-2014.jpg", "/covers/true-detective-2014-bg.jpg"
    ),
    new Movie(10, "Стальной гигант", ["США"], 1999, null,
    [movieGenres[1], movieGenres[2],movieGenres[3],
    movieGenres[4], movieGenres[5], movieGenres[6]],
    "6+", 8.1, 8.1,
    "/covers/iron-giant-1999.jpg", "/covers/iron-giant-1999-bg.jpg"
    )
]