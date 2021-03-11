import React from 'react';

class Movie extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.watched = React.createRef();
    }

    componentDidMount() {

    }

    toggleView = () => {
        let open = false;
        if (this.state.open === open) {
            open = true;
        }

        this.setState({open: open})
    }

    toggleWatched = () => {
        let env = this;
        let current_movie_ids = this.props.getLocalMovieIds();
        let other_movie_ids = this.props.getReverseLocalMovieIds();

        // Remove from current
        current_movie_ids = current_movie_ids.filter(function(item) {
            return parseInt(item) !== parseInt(env.props.movie.id)
        });
        this.props.setLocalState(current_movie_ids);

        // Add to other
        other_movie_ids.push(this.props.movie.id);
        this.props.setReverseLocalState(other_movie_ids);
    }

    render() {
        return (
            <section className={"movie "+(this.state.open ? 'open' : '')}>
               <div className="top-movie" onClick={this.toggleView}>
                   <span/>
                   <h3>{this.props.movie.original_title}</h3>
               </div>
               <div className='movie-details'>
                   <img src={'https://image.tmdb.org/t/p/original'+this.props.movie.poster_path} alt={this.props.movie.original_title}/>
                   <div className="details-text">
                       <p>Release Date: {this.props.movie.release_date}</p>
                       <p>Runtime: {this.props.movie.runtime}m</p>
                       <p>IMDB Score: {this.props.movie.vote_average}</p>
                   </div>
                   <div className="watched-checkbox">
                       <input type='checkbox' ref={this.watched} onChange={this.toggleWatched} defaultChecked={(this.props.type === 'Watched')}/>
                       <label>Watched</label>
                   </div>
               </div>
            </section>
        );
    }
}

export default Movie;