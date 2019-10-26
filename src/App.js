import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends React.Component {
  state = {
    tracks: [],
    currentIndex: 0,
    playing: false
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

    setTimeout(() => {
      this.nextTrack()
    }, duration)
  }

  previousTrack = () => {
    this.setState({ currentIndex: this.state.currentIndex - 1 })
  }

  nextTrack = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 })
  }

  togglePlayPause = () => {
    if (this.state.playing) {
      this.setState({ playing: false })
      $('#media-player').trigger("pause");
    } else {
      this.setState({ playing: true })
      $('#media-player').trigger("play");
    }
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
      media = <audio id="media-player" controls>
        <source src={mediaUrl} />
        Your browser does not support the audio element.
      </audio>
    } else {
      // video
      media = <video id="media-player" width="320" height="240" controls>
        <source src={mediaUrl} />
        Your browser does not support the video tag.
      </video>
    }

    const nextDisabled = this.state.currentIndex === this.state.tracks.length - 1;
    const previousDisabled = this.state.currentIndex === 0;

    return <div className="player">
      <label>{title}</label>
      {media}
      <div className="controls">
      <button
        disabled={previousDisabled}
        onClick={this.previousTrack}>
        Previous
      </button>
      <button
        onClick={this.togglePlayPause}>
        {this.state.playing ? "Pause" : "Play"}
      </button>
      <button
        disabled={nextDisabled}
        onClick={this.nextTrack}>
        Next
      </button>
      </div>
    </div>;
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
