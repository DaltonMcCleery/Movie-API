import React from 'react';
import axios from "axios";

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.search = React.createRef();
    }

    searchMovies = (event) => {
        let env = this;
        if (event.target.value !== null && event.target.value !== '') {
            axios.get('https://api.themoviedb.org/3/search/movie?query=' + event.target.value + '&api_key=API_KEY_CHANGE_HERE')
                .then((response) => {
                    if (response.status === 200) {
                        let new_state = [];
                        let movie_ids = env.props.getLocalMovieIds();

                        (response.data.results).forEach(function (result) {
                            if (movie_ids.includes((result.id).toString())) {
                                new_state.push(result);
                            }
                        });

                        env.props.setParentState({movies: new_state})
                    }
                })
        } else {
            this.props.renderMovies()
        }
    }

    render() {
        return (
            <section id="search">
                <input type="text" name="search_movies" ref={this.search} onChange={this.searchMovies}
                       placeholder="Search My Movies"/>
            </section>
        );
    }
}

export default Search;