import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends React.Component {
  state = {
    tracks: [],
    currentIndex: 0
  }

  componentDidMount() {
    $.ajax({
      type: "GET",
      url: "https://s3-us-west-2.amazonaws.com/anchor-website/challenges/bsb.json",
      dataType: "JSON"
    }).done((data) => {
      this.setState({ tracks: data.tracks })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const currentTrack = this.state.tracks[this.state.currentIndex]
    const duration = currentTrack.duration;
    console.log(duration)
    debugger
    setTimeout(() => {
      this.setState({ currentIndex: this.state.currentIndex++ })
    }, duration)
  }

  renderTrack(track, i) {
    const { duration, imageUrl, mediaUrl, title} = track;

    return <li key={i}>
      <h1>{title}</h1>
      <img src={imageUrl} />
    </li>
  }

  renderTrackList() {
    return <ul className="track-list">
      {this.state.tracks.map((track, i) => {
        return this.renderTrack(track, i);
      })}
    </ul>
  }

  renderCurrentlyPlaying() {
    if (this.state.tracks.length < 1) {
      return null;
    }

    const currentTrack = this.state.tracks[this.state.currentIndex];
    const { duration, imageUrl, mediaUrl, title} = currentTrack;

    let media;
    if(mediaUrl.startsWith("https://audio-ssl.itunes.apple.com/")) {
      // audio
      media = <audio controls>
        <source src={mediaUrl} />
        Your browser does not support the audio element.
      </audio>
    } else {
      // video
      media = <video width="320" height="240" controls>
        <source src={mediaUrl} />
        Your browser does not support the video tag.
      </video>
    }

    return media;
  }

  render() {
    return (
      <div className="App">
        {this.renderCurrentlyPlaying()}
        {this.renderTrackList()}
      </div>
    );
  }
}

export default App;
