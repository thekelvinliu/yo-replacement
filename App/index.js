import qs from 'querystring';
import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import env from '../env';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  text: {
    color: '#fff',
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchText: "can't send 'yo' without location data",
      location: null,
      locationText: 'no location data',
    };
    this.getLocation = this.getLocation.bind(this);
    this.sendYo = this.sendYo.bind(this);
  }

  async getLocation() {
    this.setState({ locationText: 'loading...' });
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({ locationText: 'location access is denied' });
    }
    const {
      coords: {
        latitude,
        longitude,
      },
    } = await Location.getCurrentPositionAsync({});
    const lat = latitude.toFixed(7);
    const lng = longitude.toFixed(7);
    this.setState({
      fetchText: 'ready',
      location: {
        lat,
        lng,
      },
      locationText: `latitude: ${lat} & longitude: ${lng}`,
    });
  }

  async sendYo() {
    const {
      location: {
        lat,
        lng,
      },
    } = this.state;
    const params = {
      location: `${lat};${lng}`,
      username: env.YO_UPDATE_USER,
    };
    const url = [env.LOCATION_SERVICE, qs.stringify(params)].join('?');
    this.setState({ fetchText: 'loading...' });
    try {
      const res = await fetch(url);
      this.setState({ fetchText: `'yo' ${res.status === 200 ? 'successful' : 'failed'}` });
    } catch (err) {
      const fetchText = process.env.NODE_ENV === 'production'
        ? "'yo' failed"
        : err.message;
      this.setState({ fetchText });
      console.error(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.state.locationText}</Text>
        <Button
          onPress={this.getLocation}
          title="get gps location"
        />
        <Text style={styles.text}>{this.state.fetchText}</Text>
        <Button
          onPress={this.sendYo}
          title="send 'yo'"
          disabled={!this.state.location}
        />
      </View>
    );
  }
}
