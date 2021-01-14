import { Injectable } from "@angular/core";
import { Playlist } from "./playlist";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SongService {
  constructor() {}

  public song_src = new Subject<any>();
  public song_name = new Subject<any>();
  public song_artist = new Subject<any>();
  public song_image = new Subject<any>();
  public song_list = new Subject<any>();
  public song_playlist = new Subject<any>();

  public isPlaying = new Subject<boolean>();

  private callSongSource = new Subject<any>();

  callSong = this.callSongSource.asObservable();

  p1 = false;
  pp1 = false;

  playlist: Playlist[] = [];

  d_volume = 50;

  audio = new Audio();

  mode = 0;

  heart = false;
  savename = "";

  getDuration() {
    return this.audio.duration;
  }

  playSong(src, name, artist, image) {
    localStorage.setItem("song_src", src);
    this.song_src.next();
    localStorage.setItem("song_name", name);
    this.song_name.next();
    localStorage.setItem("song_artist", artist);
    this.song_artist.next();
    localStorage.setItem("song_image", image);
    this.song_image.next();

    if (this.audio.src != undefined && this.audio.src != src) {
      if (this.audio.src != "") this.audio.pause();
      localStorage.setItem("isPlaying", "false");
      this.isPlaying.next(false);
      this.p1 = false;
      this.pp1 = false;
    }
    if (!this.p1) {
      localStorage.setItem("isPlaying", "true");
      this.isPlaying.next(true);
      this.audio.src = src;
      this.audio.volume = this.d_volume / 100;
      this.audio.load();
      localStorage.setItem("song_duration", this.audio.duration + "");
      this.audio.play();
      this.p1 = true;
    } else {
      if (this.pp1) {
        localStorage.setItem("isPlaying", "true");
        this.isPlaying.next(true);
        this.audio.play();
        this.pp1 = false;
      } else {
        localStorage.setItem("isPlaying", "false");
        this.isPlaying.next(false);
        this.audio.pause();
        this.pp1 = true;
      }
    }
  }

  playSongPlaylist(src, name, artist, image) {
    localStorage.setItem("song_src", src);
    this.song_src.next();
    localStorage.setItem("song_name", name);
    this.song_name.next();
    localStorage.setItem("song_artist", artist);
    this.song_artist.next();
    localStorage.setItem("song_image", image);
    this.song_image.next();

    if (this.audio.src != "") this.audio.pause();
    localStorage.setItem("isPlaying", "false");
    this.isPlaying.next(false);
    this.p1 = false;
    this.pp1 = false;

    if (!this.p1) {
      localStorage.setItem("isPlaying", "true");
      this.isPlaying.next(true);
      this.audio.src = src;
      this.audio.volume = this.d_volume / 100;
      this.audio.load();
      localStorage.setItem("song_duration", this.audio.duration + "");
      this.audio.play();
      this.p1 = true;
    } else {
      if (this.pp1) {
        localStorage.setItem("isPlaying", "true");
        this.isPlaying.next(true);
        this.audio.play();
        this.pp1 = false;
      } else {
        localStorage.setItem("isPlaying", "false");
        this.isPlaying.next(false);
        this.audio.pause();
        this.pp1 = true;
      }
    }
  }

  loadaudio(src) {
    this.audio.src = src;
    this.audio.volume = this.d_volume / 100;
    this.audio.load();
    this.p1 = true;
    this.pp1 = true;
  }

  addToPlaylist(playlist, src, name, artist, image) {
    let song: Playlist = {
      src: src,
      name: name,
      artist: artist,
      image: image
    };
    playlist.push(song);
    this.playlist = playlist;
    if (
      typeof window.orientation !== "undefined" &&
      window.innerHeight > window.innerWidth
    )
      this.savePlaylist(this.playlist);
  }

  setVolume(value) {
    this.d_volume = parseInt(value);
    this.audio.volume = this.d_volume / 100;
  }

  refreshSong() {
    this.callSongSource.next();
  }

  savePlaylist(playlist) {
    localStorage.setItem("song_playlist", JSON.stringify(playlist));
    this.song_playlist.next();
    // window.alert("บันทึก Playlist ของคุณสำเร็จแล้ว")
  }
}
