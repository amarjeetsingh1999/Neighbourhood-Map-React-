import React from 'react';

class VenueItems extends React.Component {
    render() {
        return (
            <li role="button" className="item" tabIndex="0" onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)} onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}>{this.props.data.fullName}</li>
        );
    }
}

export default VenueItems;