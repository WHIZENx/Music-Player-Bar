import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SongService } from "../song.service";
import { Playlist } from "../playlist";

import $ = require("jquery");

@Component({
  selector: "app-playbar1",
  templateUrl: "./playbar1.component.html",
  styleUrls: ["./playbar1.component.css"]
})
export class Playbar1Component implements OnInit {
  constructor(public sServ: SongService) {}

  songName = "Name";
  artist = "Artist";
  songSrc = "";
  image =
    "https://firebasestorage.googleapis.com/v0/b/websong-66c3d.appspot.com/o/songlogo.jpg?alt=media&token=40247c58-de1c-4a92-9c73-5b280f8d85c8";
  songlist: Playlist[] = [];

  isplay = false;
  repeat = false;
  random = false;
  text_script = "";

  play_index = 0;
  count = 0;

  time_finish = "0:00";
  time_start = "0:00";

  playAudio(src, name, artist, image) {
    if (this.isplay) {
      this.sServ.playSong(src, name, artist, image);
      this.sServ.refreshSong();
    }
  }

  playAudioButton() {
    localStorage.setItem("isPlaying", "true");
    this.sServ.isPlaying.next(true);
    this.sServ.audio.play();
    this.sServ.pp1 = false;
  }

  pauseAudio() {
    localStorage.setItem("isPlaying", "false");
    this.sServ.isPlaying.next(false);
    this.sServ.audio.pause();
    this.sServ.pp1 = true;
  }

  playSelectAudio(iid, src, name, artist, image) {
    this.sServ.mode = 1;
    this.play_index = iid;
    if (!this.repeat) this.count = 1;
    this.sServ.playSongPlaylist(src, name, artist, image);
    this.sServ.refreshSong();
  }

  playListAudio() {
    localStorage.setItem("isPlaying", "false");
    this.sServ.isPlaying.next(false);
    this.sServ.p1 = false;
    this.sServ.pp1 = false;
    this.sServ.mode = 1;
    this.isplay = true;
    if (!this.repeat) this.count = 1;
    if (this.random) {
      var ran_num = Math.floor(Math.random() * this.songlist.length);
      let song_play = this.songlist[ran_num];
      while (song_play.src == this.songSrc) {
        ran_num = Math.floor(Math.random() * this.songlist.length);
        song_play = this.songlist[ran_num];
      }
      this.play_index = ran_num;
      this.playAudio(
        song_play.src,
        song_play.name,
        song_play.artist,
        song_play.image
      );
    } else {
      let song_play = this.songlist[0];
      this.playAudio(
        song_play.src,
        song_play.name,
        song_play.artist,
        song_play.image
      );
    }
  }

  savenow(playlist) {
    this.sServ.savePlaylist(playlist);
  }

  ngOnInit() {
    this.onload = setInterval(() => {
      this.time_finish = "0:00";
      let s;
      let m = Math.round(this.sServ.getDuration() / 60);
      s = Math.round(this.sServ.getDuration() % 60);
      if (s < 10) s = "0" + s;
      if (!Number.isNaN(m)) {
        if (s >= 30) this.time_finish = m - 1 + ":" + s;
        else this.time_finish = m + ":" + s;
      }
    }, 1);
    if (this.time_finish !== "0:00") clearInterval(this.onload);
    localStorage.setItem("isPlaying", "false");
    if (localStorage.getItem("song_src") !== null) {
      this.songName = localStorage.getItem("song_name");
      this.artist = localStorage.getItem("song_artist");
      this.songSrc = localStorage.getItem("song_src");
      this.image = localStorage.getItem("song_image");
      this.isplay = true;
      if (JSON.parse(localStorage.getItem("song_playlist")) != null)
        this.songlist = JSON.parse(localStorage.getItem("song_playlist"));
      this.sServ.playlist = this.songlist;
    } else {
      this.songlist = this.sServ.playlist;
      this.isplay = false;
    }
    this.sServ.callSong.subscribe(() => {
      if (localStorage.getItem("song_src") !== null) {
        this.songName = localStorage.getItem("song_name");
        this.artist = localStorage.getItem("song_artist");
        this.songSrc = localStorage.getItem("song_src");
        this.image = localStorage.getItem("song_image");
        this.isplay = true;
        if (JSON.parse(localStorage.getItem("song_playlist")) == null) {
          this.sServ.playlist = this.songlist;
          this.songlist = this.sServ.playlist;
        }
        this.sServ.callSong.subscribe(() => {
          if (JSON.parse(localStorage.getItem("song_playlist")) == null) {
            this.sServ.playlist = this.songlist;
            this.songlist = this.sServ.playlist;
          }
        });
      } else {
        this.songlist = this.sServ.playlist;
        this.isplay = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.sServ.audio.played || this.sServ.audio.paused) {
      localStorage.setItem("isPlaying", "false");
      this.sServ.isPlaying.next(false);
      this.sServ.audio.pause();
      this.sServ.audio.currentTime = 0;
      this.sServ.audio.src = "";
      this.sServ.pp1 = false;
      this.sServ.p1 = false;
    }
  }

  ngAfterViewInit() {
    $(".fixed-bottom div .popuptext").hide();
    var slider = <HTMLInputElement>document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;
    this.sServ.setVolume(slider.value);
    this.setPeogressbar(
      $(".fixed-bottom div div div .slider"),
      slider.value,
      "rgb(255, 255, 100)",
      "#d3d3d3"
    );
  }

  setTime(e) {
    if (!this.sServ.p1) $(e.target).val(0);
    this.sServ.audio.currentTime =
      (e.target.value / 100) * this.sServ.audio.duration;
    this.block = false;
    this.down = false;
    this.timeskip = false;
  }

  disableAuto(e) {
    this.block = true;
    this.down = true;
    if (this.sServ.p1) this.timeskip = true;
  }

  time_show_script = null;
  time_ss = 0;

  show_hide_popup() {
    if ($(".fixed-bottom div .popuptext").is(":visible")) {
      $(".fixed-bottom div .popuptext").hide();
      clearInterval(this.time_show_script);
      this.time_ss = 0;
    }
    $(".fixed-bottom div .popuptext").fadeIn("slow");
    this.time_show_script = setInterval(() => {
      this.time_ss++;
      if (this.time_ss == 1) {
        $(".fixed-bottom div .popuptext").fadeOut("slow");
        clearInterval(this.time_show_script);
        this.time_ss = 0;
      }
    }, 1000);
  }

  repeatSong() {
    if (this.repeat) {
      if (this.random && this.sServ.mode == 1) this.random = false;
      this.repeat = false;
    } else {
      this.show_hide_popup();
      if (this.sServ.mode == 0) this.text_script = "เล่นเพลงซ้ำ";
      else this.text_script = "เล่นเพลย์ลิสต์ซ้ำ";
      this.repeat = true;
      this.count = 0;
    }
  }

  randomSong() {
    if (this.random) {
      if (this.sServ.mode == 1) {
        this.show_hide_popup();
        this.text_script = "เล่นเพลงต่อเนื่อง";
      }
      this.random = false;
    } else {
      if (this.sServ.mode == 1) {
        this.show_hide_popup();
        this.text_script = "สุ่มเพลงเล่น";
        this.repeat = true;
      }
      this.random = true;
    }
  }

  setPeogressbar(e, val, start, stop) {
    e.css(
      "background-image",
      "-webkit-gradient(linear, left top, right top, " +
        "color-stop(" +
        val +
        "%, " +
        start +
        "), " +
        "color-stop(" +
        val +
        "%, " +
        stop +
        ")" +
        ")"
    );
    e.css(
      "background-image",
      "-moz-linear-gradient(left center, " +
        start +
        " 0%, " +
        start +
        " " +
        val +
        "%, " +
        stop +
        " " +
        val +
        "%, " +
        stop +
        " 100%)"
    );
  }

  endSong(mode) {
    if (this.sServ.mode == 0) {
      if (this.repeat)
        this.playAudio(this.songSrc, this.songName, this.artist, this.image);
    } else {
      if (this.songlist.length < 2) {
        if (this.count < this.songlist.length)
          this.playAudio(this.songSrc, this.songName, this.artist, this.image);
      } else {
        if (this.random) {
          var ran_num = Math.floor(Math.random() * this.songlist.length);
          let song_play = this.songlist[ran_num];
          while (song_play.src == this.songSrc) {
            ran_num = Math.floor(Math.random() * this.songlist.length);
            song_play = this.songlist[ran_num];
          }
          this.play_index = ran_num;
          this.playAudio(
            song_play.src,
            song_play.name,
            song_play.artist,
            song_play.image
          );
        } else {
          if (mode == 0) {
            this.play_index++;
            var play_num = this.play_index % this.songlist.length;
          } else {
            this.play_index--;
            if (this.play_index < 0) {
              this.play_index = this.songlist.length - 1;
              var play_num = this.play_index % this.songlist.length;
            } else {
              var play_num = this.play_index % this.songlist.length;
            }
          }
          let song_play = this.songlist[play_num];
          if (!this.repeat) {
            if (this.count < this.songlist.length)
              this.playAudio(
                song_play.src,
                song_play.name,
                song_play.artist,
                song_play.image
              );
            else this.count = 0;
            this.count++;
          } else
            this.playAudio(
              song_play.src,
              song_play.name,
              song_play.artist,
              song_play.image
            );
        }
      }
    }
  }

  checkVolume(e) {
    if (e.target.className == "position-absolute fas fa-volume-up") {
      this.save_volume = parseInt($(".fixed-bottom div div div .slider").val());
      $(".fixed-bottom div div div .slider").val(0);
      this.sServ.setVolume(0);
      this.setPeogressbar(
        $(".fixed-bottom div div div .slider"),
        0,
        "rgb(237, 187, 76)",
        "#d3d3d3"
      );
      $(e.target).addClass("fa-volume-mute");
      $(e.target).removeClass("fa-volume-up");
    } else if (e.target.className == "position-absolute fas fa-volume-mute") {
      this.setPeogressbar(
        $(".fixed-bottom div div div .slider"),
        this.save_volume,
        "rgb(237, 187, 76)",
        "#d3d3d3"
      );
      $(".fixed-bottom div div div .slider").val(this.save_volume);
      this.sServ.setVolume(this.save_volume);
      $(e.target).addClass("fa-volume-up");
      $(e.target).removeClass("fa-volume-mute");
    }
  }

  onload;
  onplay;
  block = false;
  down = false;
  timeskip = false;
  save_volume = 50;

  forward() {
    if (this.sServ.p1) {
      this.sServ.audio.currentTime = this.sServ.audio.duration;
      this.setPeogressbar(
        $(".fixed-bottom div div .slider_play"),
        0,
        "#df7164",
        "white"
      );
      $(".fixed-bottom div div .slider_play").val(0);
      this.time_start = "0:00";
      localStorage.setItem("isPlaying", "false");
      this.sServ.p1 = false;
      this.endSong(0);
    }
  }

  backward() {
    if (this.sServ.p1) {
      this.setPeogressbar(
        $(".fixed-bottom div div .slider_play"),
        0,
        "#df7164",
        "white"
      );
      $(".fixed-bottom div div .slider_play").val(0);
      this.time_start = "0:00";
      localStorage.setItem("isPlaying", "false");
      this.sServ.p1 = false;
      this.endSong(1);
    }
  }

  onPlaying() {
    var v = $(".fixed-bottom div div div .slider").val();
    if (v !== undefined) {
      this.sServ.setVolume(v);
      var val =
        ($(".fixed-bottom div div div .slider").val() -
          $(".fixed-bottom div div div .slider").attr("min")) /
        ($(".fixed-bottom div div div .slider").attr("max") -
          $(".fixed-bottom div div div .slider").attr("min"));
      var percent = val * 100;
      this.setPeogressbar(
        $(".fixed-bottom div div div .slider"),
        percent,
        "rgb(237, 187, 76)",
        "#d3d3d3"
      );
      if (parseInt(v) == 0) {
        $(".fixed-bottom div div #volume").addClass("fa-volume-mute");
        $(".fixed-bottom div div #volume").removeClass("fa-volume-up");
      } else {
        $(".fixed-bottom div div #volume").addClass("fa-volume-up");
        $(".fixed-bottom div div #volume").removeClass("fa-volume-mute");
      }
    }
    if (localStorage.getItem("isPlaying") === "true") {
      var val =
        ($(".fixed-bottom div div .slider_play").val() -
          $(".fixed-bottom div div .slider_play").attr("min")) /
        ($(".fixed-bottom div div .slider_play").attr("max") -
          $(".fixed-bottom div div .slider_play").attr("min"));
      var percent = val * 100;
      this.setPeogressbar(
        $(".fixed-bottom div div div .slider_play"),
        percent,
        "#df7164",
        "white"
      );
      if (this.down) {
        let s;
        let timesk =
          (parseInt($(".fixed-bottom div div .slider_play").val()) / 100) *
          this.sServ.audio.duration;
        let skiptime = Math.abs(timesk);
        let m = Math.round(skiptime / 60);
        s = Math.round(skiptime % 60);
        if (s < 10) s = "0" + s;
        if (s >= 30) {
          if (m == 0) this.time_start = "0:" + s;
          else this.time_start = m - 1 + ":" + s;
        } else this.time_start = m + ":" + s;
      } else {
        var time = parseInt(this.sServ.audio.currentTime.toFixed(0));
        let s;
        let m = Math.round(time / 60);
        s = Math.round(time % 60);
        if (!Number.isNaN(m)) {
          if (s < 10) s = "0" + s;
          if (s >= 30) {
            if (m == 0) this.time_start = "0:" + s;
            else this.time_start = m - 1 + ":" + s;
          } else this.time_start = m + ":" + s;
        } else this.time_start = "0:00";
      }
      if (time == 0) $(".fixed-bottom div div .slider_play").val(0);
      if (!this.block && time > 0)
        $(".fixed-bottom div div .slider_play").val(
          (this.sServ.audio.currentTime / this.sServ.audio.duration) * 100
        );
      if (this.sServ.audio.currentTime === this.sServ.audio.duration) {
        this.setPeogressbar(
          $(".fixed-bottom div div .slider_play"),
          0,
          "#df7164",
          "white"
        );
        $(".fixed-bottom div div .slider_play").val(0);
        this.time_start = "0:00";
        localStorage.setItem("isPlaying", "false");
        this.sServ.p1 = false;
        this.endSong(0);
      }
      if (this.isplay) {
        $(".fixed-bottom div div #player").addClass("fa-pause");
        $(".fixed-bottom div div #player").removeClass("fa-play");
      }
    } else {
      if (this.sServ.pp1) {
        var val =
          ($(".fixed-bottom div div .slider_play").val() -
            $(".fixed-bottom div div .slider_play").attr("min")) /
          ($(".fixed-bottom div div .slider_play").attr("max") -
            $(".fixed-bottom div div .slider_play").attr("min"));
        var percent = val * 100;
        this.setPeogressbar(
          $(".fixed-bottom div div div .slider_play"),
          percent,
          "#df7164",
          "white"
        );
        let timesk =
          (parseInt($(".fixed-bottom div div .slider_play").val()) / 100) *
          this.sServ.audio.duration;
        let skiptime = Math.abs(timesk);
        let s;
        let m = Math.round(skiptime / 60);
        s = Math.round(skiptime % 60);
        if (s < 10) s = "0" + s;
        if (s >= 30) {
          if (m == 0) this.time_start = "0:" + s;
          else this.time_start = m - 1 + ":" + s;
        } else this.time_start = m + ":" + s;
      }
      if (this.isplay) {
        $(".fixed-bottom div div #player").addClass("fa-play");
        $(".fixed-bottom div div #player").removeClass("fa-pause");
      }
    }
    return true;
  }

  deleteSong(src) {
    for (let i = 0; i < this.songlist.length; i++) {
      if (this.songlist[i].src == src) {
        this.sServ.savename = this.songlist[i].name + this.songlist[i].artist;
        this.songlist.splice(i, 1);
        this.sServ.heart = true;
        break;
      }
    }
  }
}
