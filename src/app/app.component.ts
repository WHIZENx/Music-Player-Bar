import { Component, VERSION } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { SongService } from "./song.service";
import { Playlist } from "./playlist";
import { Router } from "@angular/router";

import $ = require("jquery");

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  mode = 0;

  constructor(
    public fServ: FirebaseService,
    public sServ: SongService,
    public router: Router
  ) {}

  song;
  songlist: Playlist[] = [];
  song_first = "";
  length_song = 0;

  ngOnInit() {
    this.fServ.getSongs().subscribe(val => {
      this.song = val.map(e => {
        this.length_song += 1;
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as Playlist)
        };
      });
    });
  }

  changeMode(mode) {
    if (mode == 0) {
      this.router.navigate([""]);
    } else if (mode == 1) {
      this.router.navigate(["playbar1"]);
    } else {
      this.router.navigate(["playbar2"]);
    }
    this.mode = mode;
  }

  playAudio(src, name, artist, image) {
    this.sServ.playSong(src, name, artist, image);
    this.sServ.refreshSong();
    this.sServ.mode = 0;
  }

  addplaylist(src, name, artist, image) {
    this.songlist = this.sServ.playlist;
    if (this.songlist !== []) {
      let have = false;
      for (let i = 0; i < this.songlist.length; i++) {
        if (this.songlist[i].src == src) have = true;
      }
      if (!have)
        this.sServ.addToPlaylist(this.songlist, src, name, artist, image);
      else this.deleteSong(src);
    } else this.sServ.addToPlaylist(this.songlist, src, name, artist, image);
    this.sServ.refreshSong();
  }

  deleteSong(src) {
    for (let i = 0; i < this.sServ.playlist.length; i++) {
      if (this.sServ.playlist[i].src == src) {
        for (let j = 0; j < this.length_song; j++) {
          if (
            this.sServ.playlist[i].name +
              this.sServ.playlist[i].artist +
              this.sServ.playlist[i].name ===
            $.trim($("div div #play" + (j + 1) + " div span a").text())
          ) {
            $("div div #vote" + (j + 1) + " #v" + (j + 1)).addClass("far");
            $("div div #vote" + (j + 1) + " #v" + (j + 1)).removeClass("fas");
          }
        }
        this.songlist.splice(i, 1);
        break;
      }
    }
  }

  onPlaying() {
    if (localStorage.getItem("isPlaying") === "true") {
      for (let i = 0; i < this.length_song; i++) {
        if (
          localStorage.getItem("song_name") +
            localStorage.getItem("song_artist") +
            localStorage.getItem("song_name") ===
          $.trim($("div div #play" + (i + 1) + " div span a").text())
        ) {
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).addClass(
            "fa-pause"
          );
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).removeClass(
            "fa-play"
          );
        } else {
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).addClass(
            "fa-play"
          );
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).removeClass(
            "fa-pause"
          );
        }
      }
    } else {
      for (let i = 0; i < this.length_song; i++) {
        if (
          localStorage.getItem("song_name") +
            localStorage.getItem("song_artist") +
            localStorage.getItem("song_name") ===
          $.trim($("div div #play" + (i + 1) + " div span a").text())
        ) {
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).addClass(
            "fa-play"
          );
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).removeClass(
            "fa-pause"
          );
        }
      }
    }

    if (this.sServ.heart == false) {
      for (let i = 0; i < this.length_song; i++) {
        if (
          this.sServ.savename ===
          $.trim($("div div #play" + (i + 1) + " div span a").text())
        ) {
          $("div div #vote" + (i + 1) + " #v" + (i + 1)).addClass("far");
          $("div div #vote" + (i + 1) + " #v" + (i + 1)).removeClass("fas");
          this.sServ.heart = false;
        }
      }
    }

    if (this.sServ.audio.paused) {
      for (let i = 0; i < this.length_song; i++) {
        if (
          localStorage.getItem("song_name") +
            localStorage.getItem("song_artist") +
            localStorage.getItem("song_name") ===
          $.trim($("div div #play" + (i + 1) + " div span a").text())
        ) {
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).addClass(
            "fa-play"
          );
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).removeClass(
            "fa-pause"
          );
        }
      }
    }

    if (this.sServ.audio.currentTime != 0 && !this.sServ.audio.paused) {
      for (let i = 0; i < this.length_song; i++) {
        if (
          localStorage.getItem("song_name") +
            localStorage.getItem("song_artist") +
            localStorage.getItem("song_name") ===
          $.trim($("div div #play" + (i + 1) + " div span a").text())
        ) {
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).addClass(
            "fa-pause"
          );
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).removeClass(
            "fa-play"
          );
        } else {
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).addClass(
            "fa-play"
          );
          $("div div #play" + (i + 1) + " div span a #" + (i + 1)).removeClass(
            "fa-pause"
          );
        }
      }
    }

    for (let j = 0; j < this.sServ.playlist.length; j++)
      for (let i = 0; i < this.length_song; i++) {
        if (
          this.sServ.playlist[j].name +
            this.sServ.playlist[j].artist +
            this.sServ.playlist[j].name ===
          $.trim($("div div #play" + (i + 1) + " div span a").text())
        ) {
          $("div div #vote" + (i + 1) + " #v" + (i + 1)).addClass("fas");
          $("div div #vote" + (i + 1) + " #v" + (i + 1)).removeClass("far");
        }
      }

    return true;
  }

  blockplay = false;
}
