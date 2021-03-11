import React from 'react';
import axios from 'axios';

class Add extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResults: []
        }

        this.movie = React.createRef();
        this.searchMovies = this.searchMovies.bind(this);
    }

    searchMovies = (event) => {
        let env = this;
        if (event.target.value !== null && event.target.value !== '') {
            axios.get('https://api.themoviedb.org/3/search/movie?query=' + event.target.value + '&api_key=API_KEY_CHANGE_HERE')
                .then((response) => {
                    if (response.status === 200) {
                        env.setState({searchResults: response.data.results})
                    }
                })
        } else {
            env.setState({searchResults: []})
        }
    }

    addMovie = () => {
        let env = this;

        // Add first movie returned
        axios.get('https://api.themoviedb.org/3/search/movie?query='+this.movie.current.value+'&api_key=API_KEY_CHANGE_HERE')
            .then((response) => {
                if (response.status === 200) {
                    let movie = response.data.results[0];
                    env.addClickMovie(movie.id)
                }
            })
    }

    addClickMovie = (new_movie_id) => {
        let env = this;
        let movie_ids = this.props.getLocalMovieIds();

        if (!movie_ids.includes(new_movie_id)) {
            movie_ids.push(new_movie_id);
        }

        // Reset input and state
        this.movie.current.value = '';
        this.setState({searchResults: []}, function () {
            env.props.setLocalState(movie_ids)
        })
    }

    render() {
        return (
            <section id="add-movie">
                <div className="input">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search"
                         className="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path fill="currentColor"
                              d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/>
                    </svg>
                    <input type="text" name="add_movie" ref={this.movie} onChange={this.searchMovies}
                           placeholder="Search MovieDB"/>

                    <div id="search-results" className={(this.state.searchResults.length > 0 ? 'active' : '')}>
                        {this.state.searchResults.map((result) => (
                            <span key={result.id} onClick={() => this.addClickMovie(result.id)}>
                                <img src={'https://image.tmdb.org/t/p/original'+result.poster_path} alt={result.original_title}/>
                                <div>
                                    <p>{result.original_title}</p>
                                    <p>Year: {result.release_date}</p>
                                </div>
                            </span>
                        ))}
                    </div>
                </div>
                <button onClick={() => this.addMovie()}>
                    <span>Add To Unwatched</span>
                    <span>+</span>
                </button>
            </section>
        );
    }
}

export default Add;