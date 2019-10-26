import React from 'react';
import './App.css';
import $ from 'jquery';
import play from './media-play.svg';
import pause from './media-pause.svg';
import stepBackwards from './media-step-backward.svg';
import stepForwards from './media-step-forward.svg';

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

    $(document).bind('keypress', (e) => {
      e.preventDefault();

      //space bar
      if (e.which === 32){
        this.togglePlayPause();
      }
      //right arrow
      if (e.which === 39) {
        this.nextTrack();
      }
      //left arrow
      if (e.which === 37) {
        this.previousTrack();
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentIndex !== prevState.currentIndex) {
      const currentTrack = this.state.tracks[this.state.currentIndex]
      const duration = currentTrack.duration;

      setTimeout(() => {
        this.nextTrack()
      }, duration)
    }

    if (this.state.playing && !prevState.playing) {
      $('#media-player').trigger("play");
    }

    if (prevState.playing && !this.state.playing) {
      $('#media-player').trigger("pause");
    }
  }

  previousTrack = () => {
    this.setState({ currentIndex: this.state.currentIndex - 1 })
  }

  nextTrack = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 })
  }

  skipToTrack = (index) => {
    this.setState({ currentIndex: index })
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
    const { imageUrl, title} = track;

    return <li key={i} onClick={() => this.skipToTrack(i)}>
      <label>{title}</label>
      <img src={imageUrl} alt={title}/>
    </li>
  }

  renderTrackList() {
    return <ul className="track-list">
      {this.state.tracks.map((track, i) => {
        return this.renderTrack(track, i);
      })}
    </ul>
  }

  renderControls() {
    const nextDisabled = this.state.currentIndex === this.state.tracks.length - 1;
    const previousDisabled = this.state.currentIndex === 0;

    return <div className="controls">
      <button
        disabled={previousDisabled}
        onClick={this.previousTrack}>
          <img src={stepBackwards} alt="Previous" />
      </button>
      <button
        onClick={this.togglePlayPause}>
        {this.state.playing ?
          <img src={pause} alt="Pause" /> :
          <img src={play} alt="Play" />}
      </button>
      <button
        disabled={nextDisabled}
        onClick={this.nextTrack}>
          <img src={stepForwards} alt="Next" />
      </button>
    </div>
  }

  renderCurrentlyPlaying() {
    const trackCount = this.state.tracks.length
    if (trackCount < 1 || this.state.currentIndex >= trackCount) {
      return null;
    }

    const currentTrack = this.state.tracks[this.state.currentIndex];
    const { imageUrl, mediaUrl, title} = currentTrack;

    let media, image;
    if(mediaUrl.startsWith("https://audio-ssl.itunes.apple.com/")) {
      // audio
      media = <audio id="media-player">
        <source src={mediaUrl} />
        Your browser does not support the audio element.
      </audio>
      image = <img className="album-artwork" src={imageUrl} alt={title} />
    } else {
      // video
      media = <video id="media-player">
        <source src={mediaUrl} />
        Your browser does not support the video tag.
      </video>
      image = null;
    }

    const splitTitle = title.split(" by ");
    return <div className="player">
      {media}
      {image}
      <label className="song-title">{splitTitle[0]}</label>
      <label className="song-artist">{splitTitle[1]}</label>
      {this.renderControls()}
    </div>;
  }

  render() {
    return (
      <div className="App">
        <div className="main">
          {this.renderCurrentlyPlaying()}
          {this.renderTrackList()}
        </div>
      </div>
    );
  }
}

export default App;
