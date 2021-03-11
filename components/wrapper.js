import React from "react";
import Head from "next/head";
import Add from "./add";
import Tabs from "./tabs";
import Movie from "./movie";
import Search from "./search";
import axios from "axios";

class Wrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: []
        }
    }

    componentDidMount() {
        // localStorage.removeItem('Unwatched-movies');
        // localStorage.removeItem('Watched-movies');

        this.renderMovies();
    }

    getLocalMovieIds = () => {
        // Fetch any locally stored Movie IDs
        let movies = localStorage.getItem(this.props.title+"-movies")
        if (movies) {
            // Split IDs into a parsable array
            return movies.split(",");
        }

        return [];
    }

    getReverseLocalMovieIds = () => {
        let key = 'Unwatched'
        if (this.props.title === key) {
            key = 'Watched'
        }

        // Fetch any locally stored Movie IDs
        let movies = localStorage.getItem(key+"-movies")
        if (movies) {
            // Split IDs into a parsable array
            return movies.split(",");
        }

        return [];
    }

    renderMovies = (reverse = null) => {
        let env = this;
        let movie_ids = this.getLocalMovieIds();
        if (reverse) {
            movie_ids = this.getReverseLocalMovieIds();
        }

        (movie_ids).forEach(function (movie_id) {
            axios.get('https://api.themoviedb.org/3/movie/'+movie_id+'?api_key=API_KEY_CHANGE_HERE')
                .then((response) => {
                    if (response.status === 200) {
                        let new_movies = env.state.movies;
                        new_movies[response.data.id] = response.data
                        env.setState({movies: new_movies})
                    }
                })
        })
    }

    setParentState = (newState) => {
        this.setState(newState);
    }

    setLocalState = (newState) => {
        localStorage.setItem(this.props.title+"-movies", newState.toString());
        this.renderMovies();
    }

    setReverseLocalState = (newState) => {
        let key = 'Unwatched'
        if (this.props.title === key) {
            key = 'Watched'
        }

        localStorage.setItem(key+"-movies", newState.toString());
        this.renderMovies(key);
    }

    render() {
        return (
            <main>
                <Head>
                    <title>{this.props.title} Movies</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Add {...this.state}
                     setLocalState={this.setLocalState}
                     getLocalMovieIds={this.getLocalMovieIds}/>

                <div id="tabs-and-search">
                    <Tabs/>
                    <Search {...this.state}
                            renderMovies={this.renderMovies}
                            setParentState={this.setParentState}
                            getLocalMovieIds={this.getLocalMovieIds}/>
                </div>

                <section id={this.props.title} className="movie-list">
                    {this.state.movies.map((movie, key) => (
                        <Movie key={key}
                               movie={movie}
                               type={this.props.title}
                               renderMovies={this.renderMovies}
                               setLocalState={this.setLocalState}
                               getLocalMovieIds={this.getLocalMovieIds}
                               setReverseLocalState={this.setReverseLocalState}
                               getReverseLocalMovieIds={this.getReverseLocalMovieIds}/>
                    ))}
                </section>
            </main>
        );
    }
}

export default Wrapper
