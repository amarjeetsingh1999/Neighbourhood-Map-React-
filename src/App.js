import React, { Component } from 'react';
import './App.css';
import locations from './data/locations';
import SideBar from './components/SideBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: locations,
      map: '',
      infoWindow: '',
      prevMarker: ''
    };

    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCCD6equ0yF5Ozzy7UceQ1625dtRYPht3s&callback=initMap')
    window.initMap = this.initMap;
  }

  initMap() {
    var self = this;

    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 28.5956, lng: 77.1628 },
      zoom: 14,
    });

    var InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
      self.closeInfoWindow();
    });

    this.setState({
      map: map,
      infoWindow: InfoWindow
    });

    window.google.maps.event.addListener(map, 'click', function () {
      self.closeInfoWindow();
    });

    var venues = [];
    this.state.venues.forEach(function (location) {
      var fullName = location.name + ' : ' + location.shortName;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.latitude, location.longitude),
        icon: 'https://tinyurl.com/jbnyevq',
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener('click', function () {
        self.openInfoWindow(marker);
      });

      location.fullName = fullName;
      location.marker = marker;
      location.display = true;
      venues.push(location);
    });
    this.setState({
      venues: venues
    });
  }

  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infoWindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      prevMarker: marker
    });
    this.state.infoWindow.setContent('Loading...');
    this.state.map.setCenter(marker.getPosition());
    this.state.map.setZoom(15);
    this.state.map.panBy(0, -100);
    this.getMarkerInfo(marker);
  }

  getMarkerInfo(marker) {
    var self = this;
    var clientId = "TB5OQOKWTQLPVIVB15JONZRKOE04U2LRFG31LJ1XHQ54ZSSB";
    var clientSecret = "A0AGA23IZPLV4EBKJJXDX2IUCHZIS0OHAQ1EIPVPQSZPP4ZT";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20181110&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

    /*
    let url = 'https://api.foursquare.com/v2/venues/search?client_id=TB5OQOKWTQLPVIVB15JONZRKOE04U2LRFG31LJ1XHQ54ZSSB&client_secret=A0AGA23IZPLV4EBKJJXDX2IUCHZIS0OHAQ1EIPVPQSZPP4ZT&v=20181110&ll=28.5956,77.1628';
    fetch(url)
    .then(res => res.json())
    .then((out) => {
      console.log('Checkout this JSON! ', out);
    })
    .catch(err => { throw err });
    */

    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            self.state.infoWindow.setContent("Sorry, data can't be loaded");
            return;
          }

          response.json().then(function (data) {
            var location_data = data.response.venues[0];
            var address = location_data.location.address;
            var name = location_data.name;
            self.state.infoWindow.setContent(`<b>${name}</b><br><i>${address}</i><br><p>Data by <a href="https://foursquare.com/">Foursquare</a></p>`);
          });
        }
      )
      .catch(function (err) {
        self.state.infoWindow.setContent("Error loading data!");
      });
  }

  closeInfoWindow() {
    if (this.state.prevMarker) {
      this.state.prevMarker.setAnimation(null);
    }
    this.setState({
      prevMarker: ''
    });
    this.state.infoWindow.close();
  }

  render() {
    return (
      <div>
        <SideBar key="100" venues={this.state.venues} openInfoWindow={this.openInfoWindow}
          closeInfoWindow={this.closeInfoWindow} />
        <div id="map"></div>
      </div>
    );
  }
}

export default App;

function loadMapJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function () {
    document.write("Error loading Google Maps!");
  };
  ref.parentNode.insertBefore(script, ref);
}