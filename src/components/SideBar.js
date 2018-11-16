import React, { Component } from 'react';
import VenueItems from './VenueItems';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: '',
            query: '',
            suggestions: true,
        };

        this.filterVenues = this.filterVenues.bind(this);
    }

    filterVenues(term) {
        this.props.closeInfoWindow();
        const { value } = term.target;
        var locations = [];
        this.props.venues.forEach(function (location) {
            if (location.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            locations: locations,
            query: value
        });
    }

    componentWillMount() {
        this.setState({
            locations: this.props.venues
        });
    }

    render() {
        var venueList = this.state.locations.map(function (venueItem, index) {
            return (
                <VenueItems key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={venueItem} />
            );
        }, this);

        return (
            <div className="sideBar">
                <input role="search" aria-labelledby="filter" id="search-input" className="search-input" type="text" placeholder="Filter Suggestions"
                    value={this.state.query} onChange={this.filterVenues} />
                <ul>
                    {this.state.suggestions && venueList}
                </ul>
                <p className="creator">Made with <span className="heart">♥</span> by Amarjeet</p>
            </div>
        );
    }
}

export default SideBar;