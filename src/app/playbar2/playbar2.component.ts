import { Component, OnInit, HostListener } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SongService } from "../song.service";
import { Playlist } from "../playlist";

import $ = require("jquery");

@Component({
  selector: "app-playbar2",
  templateUrl: "./playbar2.component.html",
  styleUrls: ["./playbar2.component.css"]
})
export class Playbar2Component implements OnInit {
  constructor(public sServ: SongService) {}

  songName = "Name";
  artist = "Artist";
  songSrc = "";
  image =
    "https://firebasestorage.googleapis.com/v0/b/websong-66c3d.appspot.com/o/songlogo.jpg?alt=media&token=40247c58-de1c-4a92-9c73-5b280f8d85c8";
  songlist: Playlist[] = [];

  array_random = [];

  isplay = false;
  repeat = false;
  random = false;
  text_script = "";

  play_index = 0;
  count = 0;
  count_random = 0;

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
    this.array_random = [src];
    this.sServ.mode = 1;
    this.play_index = iid;
    if (!this.repeat) this.count = 1;
    if (this.random) this.count_random = 1;
    this.sServ.playSongPlaylist(src, name, artist, image);
    this.sServ.refreshSong();
  }

  playListAudio() {
    if (this.sServ.audio.src != "") this.sServ.audio.pause();
    localStorage.setItem("isPlaying", "false");
    this.sServ.isPlaying.next(false);
    this.sServ.p1 = false;
    this.sServ.pp1 = false;
    this.sServ.mode = 1;
    this.isplay = true;
    if (!this.repeat) this.count = 1;
    if (this.random) this.count_random = 1;
    if (this.random) {
      var ran_num = Math.floor(Math.random() * this.songlist.length);
      let song_play = this.songlist[ran_num];
      this.play_index = ran_num;
      this.playAudio(
        song_play.src,
        song_play.name,
        song_play.artist,
        song_play.image
      );
      this.array_random = [song_play.src];
    } else {
      let song_play = this.songlist[0];
      this.playAudio(
        song_play.src,
        song_play.name,
        song_play.artist,
        song_play.image
      );
      this.array_random = [song_play.src];
    }
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

  savenow(playlist) {
    this.sServ.savePlaylist(playlist);
    this.show_hide_popup();
    this.text_script = "บันทึกเพลย์ลิสต์ของคุณสำเร็จแล้ว";
  }

  time_duration(value) {
    let time, m, s, text;
    time = parseInt(value);
    if (Number.isNaN(value)) return "0:00";
    if (time < 0) time = Math.abs(time);
    m = Math.round(time / 60);
    s = Math.round(time % 60);
    if (s < 10) s = "0" + s;
    if (s >= 30) {
      if (m == 0) text = "0:" + s;
      else text = m - 1 + ":" + s;
    } else text = m + ":" + s;
    return text;
  }

  @HostListener("document:keyup", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      this.playAudio(this.songSrc, this.songName, this.artist, this.image);
    }
    if (
      localStorage.getItem("isPlaying") === "false" &&
      this.sServ.pp1 &&
      this.selected_bar
    ) {
      if (
        this.sServ.audio.currentTime < 0 &&
        this.sServ.audio.currentTime > this.sServ.getDuration()
      )
        return false;
      if (event.keyCode === 37 || event.keyCode === 40) {
        this.sServ.audio.currentTime = this.sServ.audio.currentTime - 1;
        $(".fixed-bottom div div .slider_play").val(
          (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
        );
      } else if (event.keyCode === 39 || event.keyCode === 38) {
        this.sServ.audio.currentTime = this.sServ.audio.currentTime + 1;
        $(".fixed-bottom div div .slider_play").val(
          (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
        );
      }
      this.time_start = this.time_duration(this.sServ.audio.currentTime);
    }
  }

  ngOnInit() {
    this.onload = setInterval(() => {
      this.time_finish = "0:00";
      this.time_finish = this.time_duration(this.sServ.getDuration());
    }, 1);
    if (this.time_finish !== "0:00") clearInterval(this.onload);
    localStorage.setItem("isPlaying", "false");
    if (localStorage.getItem("song_src") !== null) {
      localStorage.setItem("isPlaying", "true");
      this.sServ.isPlaying.next(true);
      this.songName = localStorage.getItem("song_name");
      this.artist = localStorage.getItem("song_artist");
      this.songSrc = localStorage.getItem("song_src");
      this.image = localStorage.getItem("song_image");
      this.isplay = true;
      if (JSON.parse(localStorage.getItem("song_playlist")) != null)
        this.songlist = JSON.parse(localStorage.getItem("song_playlist"));
      this.sServ.playlist = this.songlist;
      this.sServ.loadaudio(this.songSrc);
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
    window.onkeydown = function(e) {
      return !(e.keyCode == 32);
    };
    if (!this.mobile) {
      $(window).on("click", event => {
        if (
          event.target.className != "fas fa-volume-up" &&
          event.target.className != "fas fa-volume-mute" &&
          event.target.className != "slider" &&
          event.target.className != "volume_bar"
        ) {
          $(".bg_volume_bar").hide();
          this.volume_bar = false;
        }
      });
    }
    $(window).on("click", event => {
      if (window.innerWidth <= 682) {
        if (
          event.target.className != "fas fa-ellipsis-v" &&
          event.target.className != "detailtext-less" &&
          event.target.className != "detailtext-less-row" &&
          event.target.className != "detailtext-less-img" &&
          event.target.className != "detailtext-less-img-inner card-img" &&
          event.target.className != "detailtext-less-text" &&
          event.target.className != "detailtext-less-text-name" &&
          event.target.className != "detailtext-less-text-artist" &&
          event.target.className != "detailtext-less-love" &&
          event.target.className != "detailtext-less-love-inner fa-heart far" &&
          event.target.className != "detailtext-less-love-inner fa-heart fas" &&
          event.target.className != "detailtext-less-love-inner fa-heart"
        ) {
          $(".detailtext-less").hide();
          this.option_bar = false;
        }
      } else {
        if (
          event.target.className != "fas fa-ellipsis-v" &&
          event.target.className != "detailtext" &&
          event.target.className != "detailtext-row" &&
          event.target.className != "detailtext-img" &&
          event.target.className != "detailtext-img-inner card-img" &&
          event.target.className != "detailtext-text" &&
          event.target.className != "detailtext-text-name" &&
          event.target.className != "detailtext-text-artist" &&
          event.target.className != "detailtext-love" &&
          event.target.className != "detailtext-love-inner fa-heart far" &&
          event.target.className != "detailtext-love-inner fa-heart fas" &&
          event.target.className != "detailtext-love-inner fa-heart"
        ) {
          $(".detailtext").hide();
          this.option_bar = false;
        }
      }
    });
    $(".fixed-bottom div .popuptext").hide();
    $("#playlistbar").hide();
    $(".bg_volume_bar").hide();
    $(".less_options").hide();
    $("#options").hide();
    $(".detailtext").hide();
    $(".detailtext-less").hide();
    $(".popuptext").hide();
    $(".popuptime").hide();
    $(".popuptime_extra").hide();
    var slider = <HTMLInputElement>document.getElementById("myRange");
    this.sServ.setVolume(slider.value);
    this.setProgressbar(
      $(".fixed-bottom div div div .slider"),
      slider.value,
      "rgb(255, 255, 100)",
      "#d3d3d3"
    );
  }

  selected_bar = false;

  setTime(e) {
    let x = e.pageX;
    if (this.sServ.audio.src != "") {
      if (window.innerWidth <= 1024)
        this.sServ.audio.currentTime =
          ((x + 1) / $(".fixed-bottom div #mobile .slider_play").width()) *
          this.sServ.audio.duration;
      else
        this.sServ.audio.currentTime =
          ((x + 1) / $(".fixed-bottom div #com .slider_play").width()) *
          this.sServ.audio.duration;
      this.block = false;
      this.down = false;
      this.timeskip = false;
      this.selected_bar = true;
    }
  }

  disableAuto(e) {
    if ($(".detailtext").is(":visible")) {
      $(".detailtext").hide();
      this.option_bar = false;
    }
    if ($(".detailtext-less").is(":visible")) {
      $(".detailtext-less").hide();
      this.option_bar = false;
    }
    if (this.sServ.p1) this.timeskip = true;
    if (this.sServ.audio.src != "") {
      this.block = true;
      this.down = true;
    }
  }

  setTime_mobile(e) {
    if (this.sServ.audio.src != "") {
      this.sServ.audio.currentTime =
        (e.target.valueAsNumber / 100) * this.sServ.audio.duration;
      this.block = false;
      this.down = false;
      this.timeskip = false;
    }
    $(".popuptime").hide();
  }

  moveTime_mobile(e) {
    let x = e.touches[0].pageX;
    if (x <= 23) $(".popuptime").offset({ left: 1 });
    else if (x >= $(".fixed-bottom div #mobile .slider_play").width() - 25)
      $(".popuptime").offset({
        left: $(".fixed-bottom div #mobile .slider_play").width() - 50
      });
    else $(".popuptime").offset({ left: x - 23 });
    this.time_selected = this.time_duration(
      (e.target.valueAsNumber / 100) * this.sServ.getDuration()
    );
  }

  disableAuto_mobile(e) {
    if ($(".detailtext").is(":visible")) {
      $(".detailtext").hide();
      this.option_bar = false;
    }
    if ($(".detailtext-less").is(":visible")) {
      $(".detailtext-less").hide();
      this.option_bar = false;
    }
    $(".popuptime").show();
    if (this.sServ.p1) this.timeskip = true;
    if (this.sServ.audio.src != "") {
      this.block = true;
      this.down = true;
    }
  }

  show_duraion(e) {
    if (this.time_finish != "0:00") {
      if (window.innerWidth <= 1024) $(".popuptime").show();
      else $(".popuptime_extra").show();
    }
  }

  time_selected = "0:00";

  set_duraion(e) {
    if (!$(".popuptime").is(":visible")) {
      if (this.time_finish != "0:00") {
        if (window.innerWidth <= 1024) $(".popuptime").show();
        else $(".popuptime_extra").show();
      }
    }
    let x = e.pageX;
    if (window.innerWidth <= 1024) {
      if (x <= 22) $(".popuptime").offset({ left: 1 });
      else if (x >= $(".fixed-bottom div #mobile .slider_play").width() - 24)
        $(".popuptime").offset({
          left: $(".fixed-bottom div #mobile .slider_play").width() - 47
        });
      else $(".popuptime").offset({ left: x - 22 });
      this.time_selected = this.time_duration(
        ((x + 1) / $(".fixed-bottom div #mobile .slider_play").width()) *
          this.sServ.getDuration()
      );
      if (x > $(".fixed-bottom div #mobile .slider_play").width()) {
        $(".popuptime").hide();
      }
    } else {
      if (x <= 22) $(".popuptime_extra").offset({ left: 1 });
      else if (x >= $(".fixed-bottom div #com .slider_play").width() - 24)
        $(".popuptime_extra").offset({
          left: $(".fixed-bottom div #com .slider_play").width() - 47
        });
      else $(".popuptime_extra").offset({ left: x - 22 });
      this.time_selected = this.time_duration(
        ((x + 1) / $(".fixed-bottom div #com .slider_play").width()) *
          this.sServ.getDuration()
      );
      if (x > $(".fixed-bottom div #com .slider_play").width()) {
        $(".popuptime_extra").hide();
      }
    }
  }

  hide_duraion(e) {
    $(".popuptime").hide();
    $(".popuptime_extra").hide();
  }

  time_show_script = null;
  time_ss = 0;

  show_hide_popup() {
    if ($(".fixed-bottom div .popuptext").is(":visible")) {
      $(".fixed-bottom div .popuptext").hide();
      clearInterval(this.time_show_script);
      this.time_ss = 0;
    }
    $(".fixed-bottom div .popuptext").fadeIn();
    this.time_show_script = setInterval(() => {
      this.time_ss++;
      if (this.time_ss == 1) {
        $(".fixed-bottom div .popuptext").fadeOut();
        clearInterval(this.time_show_script);
        this.time_ss = 0;
      }
    }, 1000);
  }

  repeatSong() {
    if (this.sServ.mode == 1 && !this.random) {
      this.count_random = 0;
      this.array_random = [];
    }
    if (this.repeat) {
      // if (this.random && this.sServ.mode == 1) this.random = false;
      this.repeat = false;
    } else {
      this.show_hide_popup();
      if (this.sServ.mode == 0) this.text_script = "เล่นเพลงซ้ำ";
      else this.text_script = "เล่นซ้ำทั้งหมด";
      this.repeat = true;
    }
  }

  randomSong() {
    if (this.sServ.audio.src != "") {
      this.count_random = 1;
      this.array_random = [this.sServ.audio.src];
      this.count = 0;
    } else {
      this.count_random = 0;
      this.array_random = [];
    }
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
        // this.repeat = true;
      }
      this.random = true;
    }
  }

  setProgressbar(e, val, start, stop) {
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
    if (window.innerWidth <= 1024 || this.mobile) {
      this.setProgressbar(
        $(".fixed-bottom div #mobile .slider_play"),
        0,
        "orangered",
        "#555"
      );
      $(".fixed-bottom div #mobile .slider_play").val(0);
    } else {
      this.setProgressbar(
        $(".fixed-bottom div #com .slider_play"),
        0,
        "orangered",
        "#555"
      );
      $(".fixed-bottom div #com .slider_play").val(0);
    }
    if (this.sServ.mode == 0) {
      if (this.repeat)
        this.playAudio(this.songSrc, this.songName, this.artist, this.image);
      else {
        this.sServ.audio.pause();
        this.sServ.audio.currentTime = 0;
        this.sServ.pp1 = true;
      }
    } else {
      if (this.songlist.length < 2) {
        this.sServ.audio.currentTime = 0;
        this.sServ.pp1 = false;
        if (!this.repeat) {
          this.sServ.audio.pause();
          this.sServ.pp1 = true;
        }
      } else {
        var ran_num, song_play, play_num;
        if (this.random) {
          if (mode == 0) {
            ran_num = Math.floor(Math.random() * this.songlist.length);
            song_play = this.songlist[ran_num];
            if (this.count_random < this.songlist.length) {
              while (this.array_random.indexOf(song_play.src) != -1) {
                ran_num = Math.floor(Math.random() * this.songlist.length);
                song_play = this.songlist[ran_num];
              }
              this.count_random++;
              this.array_random.push(song_play.src);
            } else {
              ran_num = Math.floor(Math.random() * this.songlist.length);
              song_play = this.songlist[ran_num];
              while (this.sServ.audio.src == song_play.src) {
                ran_num = Math.floor(Math.random() * this.songlist.length);
                song_play = this.songlist[ran_num];
              }
              this.array_random = [song_play.src];
              this.count_random++;
            }
            this.play_index = ran_num;
            this.playAudio(
              song_play.src,
              song_play.name,
              song_play.artist,
              song_play.image
            );
            if (this.count_random > this.songlist.length) {
              this.count_random = 1;
              if (!this.repeat) {
                this.sServ.audio.pause();
                this.sServ.audio.currentTime = 0;
                this.sServ.pp1 = true;
              }
            }
          } else {
            ran_num = Math.floor(Math.random() * this.songlist.length);
            song_play = this.songlist[ran_num];
            while (this.sServ.audio.src == song_play.src) {
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
            this.count_random = 1;
            this.array_random = [song_play.src];
          }
        } else {
          if (mode == 0) {
            this.play_index++;
            play_num = this.play_index % this.songlist.length;
          } else {
            this.play_index--;
            if (this.play_index < 0) this.play_index = this.songlist.length - 1;
            play_num = this.play_index % this.songlist.length;
          }
          song_play = this.songlist[play_num];
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
    if (e.target.className == "fas fa-volume-up") {
      this.save_volume = parseInt($(".fixed-bottom #com div .slider").val());
      $(".fixed-bottom #com div .slider").val(0);
      this.sServ.setVolume(0);
      this.setProgressbar(
        $(".fixed-bottom #com div .slider"),
        0,
        "rgb(237, 187, 76)",
        "#d3d3d3"
      );
      $(e.target).addClass("fa-volume-mute");
      $(e.target).removeClass("fa-volume-up");
    } else if (e.target.className == "fas fa-volume-mute") {
      this.setProgressbar(
        $(".fixed-bottom #com div .slider"),
        this.save_volume,
        "rgb(237, 187, 76)",
        "#d3d3d3"
      );
      $(".fixed-bottom #com div .slider").val(this.save_volume);
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

  mobile = false;

  forward() {
    if (this.sServ.p1) {
      if (!this.repeat) {
        if (this.sServ.mode == 1 && !this.random) {
          var song_play = this.songlist[
            (this.play_index + 1) % this.songlist.length
          ];
          this.playAudio(
            song_play.src,
            song_play.name,
            song_play.artist,
            song_play.image
          );
          this.sServ.audio.pause();
          this.sServ.audio.currentTime = 0;
          this.sServ.pp1 = true;
        }
      } else {
        if (this.sServ.mode == 0) this.sServ.p1 = false;
      }
      this.endSong(0);
      this.time_start = "0:00";
    }
  }

  backward() {
    if (this.sServ.p1) {
      if (!this.repeat) {
        if (
          this.sServ.mode == 1 &&
          this.random &&
          this.array_random.length > 0
        ) {
          if (this.array_random.length == 1) {
            this.sServ.audio.pause();
            this.sServ.audio.currentTime = 0;
            this.sServ.pp1 = true;
            if (window.innerWidth <= 1024 || this.mobile) {
              this.setProgressbar(
                $(".fixed-bottom div #mobile .slider_play"),
                0,
                "orangered",
                "#555"
              );
              $(".fixed-bottom div #mobile .slider_play").val(0);
            } else {
              this.setProgressbar(
                $(".fixed-bottom div #com .slider_play"),
                0,
                "orangered",
                "555"
              );
              $(".fixed-bottom div #com .slider_play").val(0);
            }
          } else {
            for (let i = 0; i < this.songlist.length; i++) {
              if (
                this.songlist[i].src ==
                this.array_random[this.array_random.length - 2]
              ) {
                var song_play = this.songlist[i];
                this.array_random.pop();
                break;
              }
            }
            this.count_random--;
            this.playAudio(
              song_play.src,
              song_play.name,
              song_play.artist,
              song_play.image
            );
            this.sServ.audio.play();
            this.sServ.audio.currentTime = 0;
            this.sServ.pp1 = false;
          }
          this.time_start = "0:00";
          return false;
        }
        if (
          (this.sServ.mode == 1 && !this.random) ||
          this.count == this.songlist.length
        ) {
          let back = this.play_index - 1;
          if (back < 0) back = this.songlist.length - 1;
          var song_play = this.songlist[back % this.songlist.length];
          this.playAudio(
            song_play.src,
            song_play.name,
            song_play.artist,
            song_play.image
          );
          this.sServ.audio.pause();
          this.sServ.audio.currentTime = 0;
          this.sServ.pp1 = true;
        }
      } else {
        if (this.sServ.mode == 0) this.sServ.p1 = false;
      }
      this.sServ.audio.currentTime = 0;
      this.endSong(1);
      this.time_start = "0:00";
    }
  }

  overlay = false;
  timer_bar = 0;
  time_bar = null;

  open_hide_playlist(e) {
    if (window.innerWidth <= 1024 || this.mobile) {
      if (
        e.target.className == "fas fa-ellipsis-v" ||
        e.target.className == "play_bar_mobile" ||
        e.target.className == "slider_play redslider"
      )
        return false;
      if (window.innerWidth <= 682) {
        if (
          e.target.className == "less_options" ||
          e.target.className == "bg_less_options"
        )
          return false;
      }
    }
    if (window.innerWidth <= 682) {
      if (
        e.target.className == "fas fa-ellipsis-v" ||
        e.target.className == "detailtext-less" ||
        e.target.className == "detailtext-less-row" ||
        e.target.className == "detailtext-less-img" ||
        e.target.className == "detailtext-less-img-inner card-img" ||
        e.target.className == "detailtext-less-text" ||
        e.target.className == "detailtext-less-text-name" ||
        e.target.className == "detailtext-less-text-artist" ||
        e.target.className == "detailtext-less-love" ||
        e.target.className == "detailtext-less-love-inner fa-heart far" ||
        e.target.className == "detailtext-less-love-inner fa-heart fas" ||
        e.target.className == "detailtext-less-love-inner fa-heart"
      ) {
        return false;
      }
    }
    if (
      e.target.className != "slider_play" &&
      e.target.className != "slider_play redslider"
    )
      this.selected_bar = false;
    if (
      e.target.className == "fas fa-play" ||
      e.target.className == "fas fa-pause" ||
      e.target.className == "fas fa-step-backward" ||
      e.target.className == "fas fa-step-forward" ||
      e.target.className == "fas fa-redo-alt" ||
      e.target.className == "fas fa-long-arrow-alt-right" ||
      e.target.className == "fas fa-random" ||
      e.target.className == "fas fa-volume-up" ||
      e.target.className == "fas fa-volume-mute" ||
      e.target.className == "slider" ||
      e.target.className == "volume_bar" ||
      e.target.className == "slider_play" ||
      e.target.className == "fas fa-sync-alt" ||
      e.target.className == "fa-heart far" ||
      e.target.className == "fa-heart fas" ||
      e.target.className == "fas fa-ellipsis-v" ||
      e.target.className == "detailtext" ||
      e.target.className == "detailtext-row" ||
      e.target.className == "detailtext-img" ||
      e.target.className == "detailtext-img-inner card-img" ||
      e.target.className == "detailtext-text" ||
      e.target.className == "detailtext-text-name" ||
      e.target.className == "detailtext-text-artist" ||
      e.target.className == "detailtext-love" ||
      e.target.className == "detailtext-love-inner fa-heart far" ||
      e.target.className == "detailtext-love-inner fa-heart fas" ||
      e.target.className == "detailtext-love-inner fa-heart"
    )
      return false;
    if (this.time_bar != null) {
      clearInterval(this.time_bar);
      this.time_bar = null;
      this.timer_bar = 0;
    }
    if (this.overlay) {
      this.overlay = false;
      $(".fixed-bottom .overlay").height(0);
      this.time_bar = setInterval(() => {
        this.timer_bar++;
        if (this.timer_bar == 1) {
          $("#playlistbar").hide();
          $(".fixed-bottom div div div div #content").css("cursor", "pointer");
          $(".fixed-bottom div div div div #content").css("opacity", 1);
          clearInterval(this.time_bar);
          this.time_bar = null;
          this.timer_bar = 0;
        }
      }, 500);
    } else {
      this.overlay = true;
      $("#playlistbar").show();
      $(".fixed-bottom .overlay").css({ height: "100%" });
      $(".fixed-bottom div div div div #content").css("cursor", "auto");
      $(".fixed-bottom div div div div #content").css("opacity", 0);
    }
  }

  hide_playlist() {
    if (this.time_bar != null) {
      clearInterval(this.time_bar);
      this.time_bar = null;
      this.timer_bar = 0;
    }
    if (this.overlay) {
      this.overlay = false;
      $(".fixed-bottom .overlay").height(0);
      this.time_bar = setInterval(() => {
        this.timer_bar++;
        if (this.timer_bar == 1) {
          $("#playlistbar").hide();
          $(".fixed-bottom div div div div #content").css("cursor", "pointer");
          $(".fixed-bottom div div div div #content").css("opacity", 1);
          clearInterval(this.time_bar);
          this.time_bar = null;
          this.timer_bar = 0;
        }
      }, 500);
    }
  }

  volume_bar = false;
  option_bar = false;

  showOptions() {
    if (this.option_bar) {
      if (window.innerWidth <= 682) $(".detailtext-less").hide();
      else $(".detailtext").hide();
      this.option_bar = false;
    } else {
      if (window.innerWidth <= 682) $(".detailtext-less").show();
      else $(".detailtext").show();
      this.option_bar = true;
    }
  }

  showVolume() {
    if (this.volume_bar) {
      $(".bg_volume_bar").hide();
      this.volume_bar = false;
    } else {
      $(".bg_volume_bar").show();
      this.volume_bar = true;
    }
  }

  showLessOption(e) {
    $("#options").hide();
    $(".less_options").show();
  }

  hideLessOption(e) {
    $(".less_options").hide();
    $("#options").show();
  }

  height_bar = 0;
  width_screen = 0;

  onPlaying() {
    this.width_screen = window.innerWidth;
    if (typeof window.orientation !== "undefined") this.mobile = true;
    if (this.mobile) {
      if (window.innerWidth <= 682) {
        if ($(".detailtext").is(":visible")) {
          $(".detailtext").hide();
          this.option_bar = false;
        }
      } else {
        if ($(".detailtext-less").is(":visible")) {
          $(".detailtext-less").hide();
          this.option_bar = false;
        }
      }
    }
    if (window.innerWidth <= 1024 || this.mobile) {
      this.height_bar = 55;
      $(".fixed-bottom #com").hide();
      $(".fixed-bottom #mobile").show();
      if (this.mobile) {
        $("#volume").hide();
        $(".bg_volume_bar").hide();
        $("#content").hide();
        $(".slider_play").css("pointer-events", "none");
        $(".slider_play").addClass("redslider");
        $(".repeats").css("margin-left", "20%");
        $(".randoms").css("margin-left", "20%");
        if (window.innerWidth <= 360) {
          if (!$("#mobile-less-fonts").hasClass("fix-less-fonts"))
            $("#mobile-less-fonts").addClass("fix-less-fonts");
          $("#mobile-less-options").css("padding-right", "1%");
        } else if (window.innerWidth <= 400) {
          if ($("#mobile-less-fonts").hasClass("fix-less-fonts"))
            $("#mobile-less-fonts").removeClass("fix-less-fonts");
          $("#mobile-less-options").css("padding-right", "3%");
        } else {
          if ($("#mobile-less-fonts").hasClass("fix-less-fonts"))
            $("#mobile-less-fonts").removeClass("fix-less-fonts");
          $("#mobile-less-options").css("padding-right", "7px");
        }
      } else {
        if (window.innerWidth <= 682) {
          if ($("#options").offset() != undefined) {
            let x =
              $("#options").offset().left -
              $(".less_options").width() +
              $("#options").width();
            $(".less_options").offset({ left: x });
          }
          $("#volume").hide();
          $(".bg_volume_bar").hide();
          this.volume_bar = false;
          if ($(".detailtext").is(":visible")) {
            $(".detailtext").hide();
            this.option_bar = false;
          }
          $(".repeats").hide();
          $(".randoms").hide();
          $("#options").show();
          $("#content").css("margin-left", "15%");
          $("#content").css("margin-right", "15%");
          var v = $(".fixed-bottom div .less_options div .slider").val();
        } else {
          $("#volume").show();
          $(".repeats").show();
          $(".repeats").css("margin-left", "15%");
          $(".randoms").css("margin-left", "15%");
          $(".randoms").show();
          $("#options").hide();
          $(".less_options").hide();
          if ($(".detailtext-less").is(":visible")) {
            $(".detailtext-less").hide();
            this.option_bar = false;
          }
          $("#content").css("margin-left", "10%");
          $("#content").css("margin-right", "1%");
          if ($(".bg_volume_bar").is(":visible")) {
            let offset_volume_bar = $("#volume").offset();
            $("#volume_bar").offset({ left: offset_volume_bar.left - 8 });
            $(".bg_volume_bar").offset({ left: -$(".bg_volume_bar").width() });
          }
          var v = $(".fixed-bottom div .bg_volume_bar div .slider").val();
        }
      }
      $(".slider_play").css("opacity", 1);
      $(".popuptext").css("font-size", "75%");
      $(".popuptext").css("min-width", "auto");
      $(".popuptext").css("max-width", "100%");
      $(".bg-position").height(70);
      $("#playlistbar .overlay").css("margin-bottom", 70);
      $("#playlistbar .overlay #mobile .modal-body").height(
        $("#playlistbar").height() - 110
      );
    } else {
      this.height_bar = 70;
      $(".bg_volume_bar").hide();
      this.volume_bar = false;
      if ($(".detailtext-less").is(":visible")) {
        $(".detailtext-less").hide();
        this.option_bar = false;
      }
      $(".fixed-bottom #mobile").hide();
      $(".fixed-bottom #com").show();
      $(".slider_play").css("opacity", 1);
      $(".popuptext").css("font-size", "100%");
      $(".popuptext").css("min-width", 140);
      $(".popuptext").css("max-width", "70%");
      $(".bg-position").height(70);
      $("#playlistbar .overlay").css("margin-bottom", 70);
      $(".repeats").show();
      $(".randoms").show();
      var v = $(".fixed-bottom div #com div div .slider").val();
    }
    if (v !== undefined) {
      this.sServ.setVolume(v);
      if (window.innerWidth <= 682) {
        var val =
          ($(".fixed-bottom div .less_options div .slider").val() -
            $(".fixed-bottom div .less_options div .slider").attr("min")) /
          ($(".fixed-bottom div .less_options div .slider").attr("max") -
            $(".fixed-bottom div .less_options div .slider").attr("min"));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom div .less_options div .slider"),
          percent,
          "rgb(237, 187, 76)",
          "#d3d3d3"
        );
      } else if (window.innerWidth <= 1024) {
        var val =
          ($(".fixed-bottom div .bg_volume_bar div .slider").val() -
            $(".fixed-bottom div .bg_volume_bar div .slider").attr("min")) /
          ($(".fixed-bottom div .bg_volume_bar div .slider").attr("max") -
            $(".fixed-bottom div .bg_volume_bar div .slider").attr("min"));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom div .bg_volume_bar div .slider"),
          percent,
          "rgb(237, 187, 76)",
          "#d3d3d3"
        );
      } else {
        var val =
          ($(".fixed-bottom div #com div .slider").val() -
            $(".fixed-bottom div #com div .slider").attr("min")) /
          ($(".fixed-bottom div #com div .slider").attr("max") -
            $(".fixed-bottom div #com div .slider").attr("min"));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom div #com div .slider"),
          percent,
          "rgb(237, 187, 76)",
          "#d3d3d3"
        );
      }
      if (parseInt(v) == 0) {
        if (window.innerWidth > 682 && window.innerWidth <= 1024) {
          $(".fixed-bottom #play-bar .mobile_bar div div div #volume").addClass(
            "fa-volume-mute"
          );
          $(
            ".fixed-bottom #play-bar .mobile_bar div div div #volume"
          ).removeClass("fa-volume-up");
        } else if (window.innerWidth > 1024) {
          $(".fixed-bottom div #com div div #volume").addClass(
            "fa-volume-mute"
          );
          $(".fixed-bottom div #com div div #volume").removeClass(
            "fa-volume-up"
          );
        }
      } else {
        if (window.innerWidth > 682 && window.innerWidth <= 1024) {
          $(".fixed-bottom #play-bar .mobile_bar div div div #volume").addClass(
            "fa-volume-up"
          );
          $(
            ".fixed-bottom #play-bar .mobile_bar div div div #volume"
          ).removeClass("fa-volume-mute");
        } else if (window.innerWidth > 1024) {
          $(".fixed-bottom div #com div div #volume").addClass("fa-volume-up");
          $(".fixed-bottom div #com div div #volume").removeClass(
            "fa-volume-mute"
          );
        }
      }
    }
    if (localStorage.getItem("isPlaying") === "true") {
      if (window.innerWidth <= 1024 || this.mobile) {
        var val =
          ($(".fixed-bottom div #mobile .slider_play").val() -
            $(".fixed-bottom div #mobile .slider_play").attr("min")) /
          ($(".fixed-bottom div #mobile .slider_play").attr("max") -
            $(".fixed-bottom div #mobile .slider_play").attr("min"));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom div #mobile .slider_play"),
          percent,
          "orangered",
          "#555"
        );
      } else {
        var val =
          ($(".fixed-bottom div #com .slider_play").val() -
            $(".fixed-bottom div #com .slider_play").attr("min")) /
          ($(".fixed-bottom div #com .slider_play").attr("max") -
            $(".fixed-bottom div #com .slider_play").attr("min"));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom div #com .slider_play"),
          percent,
          "orangered",
          "#555"
        );
      }
      var time = this.sServ.audio.currentTime;
      this.time_start = this.time_duration(time);
      if (!this.block && time > 0) {
        if (window.innerWidth <= 1024 || this.mobile)
          $(".fixed-bottom div #mobile .slider_play").val(
            (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
          );
        else
          $(".fixed-bottom div #com .slider_play").val(
            (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
          );
      }
      if (this.sServ.audio.currentTime === this.sServ.audio.duration) {
        if (this.repeat) this.sServ.p1 = false;
        else this.sServ.pp1 = true;
        this.sServ.audio.currentTime = 0;
        this.endSong(0);
        this.time_start = "0:00";
      }
      if (this.isplay) {
        $(".fixed-bottom div div #player").addClass("fa-pause");
        $(".fixed-bottom div div #player").removeClass("fa-play");
      }
    } else {
      if (this.sServ.pp1) {
        if (window.innerWidth <= 1024 || this.mobile) {
          var val =
            ($(".fixed-bottom div #mobile .slider_play").val() -
              $(".fixed-bottom div #mobile .slider_play").attr("min")) /
            ($(".fixed-bottom div #mobile .slider_play").attr("max") -
              $(".fixed-bottom div #mobile .slider_play").attr("min"));
          var percent = val * 100;
          this.setProgressbar(
            $(".fixed-bottom div #mobile .slider_play"),
            percent,
            "orangered",
            "#555"
          );
        } else {
          var val =
            ($(".fixed-bottom div #com .slider_play").val() -
              $(".fixed-bottom div #com .slider_play").attr("min")) /
            ($(".fixed-bottom div #com .slider_play").attr("max") -
              $(".fixed-bottom #com .slider_play").attr("min"));
          var percent = val * 100;
          this.setProgressbar(
            $(".fixed-bottom div #com .slider_play"),
            percent,
            "orangered",
            "#555"
          );
        }
        time = this.sServ.audio.currentTime;
        if (!this.block && time > 0) {
          if (window.innerWidth <= 1024 || this.mobile)
            $(".fixed-bottom div #mobile .slider_play").val(
              (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
            );
          else
            $(".fixed-bottom div #com .slider_play").val(
              (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
            );
        }
        this.time_start = this.time_duration(time);
        if (!this.sServ.pp1) this.time_start = "0:00";
      }
      if (this.isplay) {
        $(".fixed-bottom div div #player").addClass("fa-play");
        $(".fixed-bottom div div #player").removeClass("fa-pause");
      }
    }
    if (this.sServ.audio.src == "") {
      $(".slider_play").prop("disabled", true);
      $(".slider_play").css("cursor", "auto");
      $(".popuptime").hide();
      $(".popuptime_extra").hide();
    } else {
      $(".slider_play").prop("disabled", false);
      $(".slider_play").css("cursor", "pointer");
      let love = false;
      for (let i = 0; i < this.songlist.length; i++) {
        if (this.songlist[i].src == this.songSrc) {
          if (window.innerWidth <= 682) {
            $("#lover-s").addClass("fas");
            $("#lover-s").removeClass("far");
            $("#lover-s").attr("title", "ลบเพลงในเพลย์ลิสต์");
          } else if (window.innerWidth <= 1024) {
            $("#lover-md").addClass("fas");
            $("#lover-md").removeClass("far");
            $("#lover-md").attr("title", "ลบเพลงในเพลย์ลิสต์");
          } else {
            $("#lover-md").addClass("fas");
            $("#lover-md").removeClass("far");
            $("#lover-md").attr("title", "ลบเพลงในเพลย์ลิสต์");
          }
          love = true;
          break;
        }
      }
      if (!love) {
        if (window.innerWidth <= 682) {
          $("#lover-s").addClass("far");
          $("#lover-s").removeClass("fas");
          $("#lover-s").attr("title", "เพิ่มเพลงลงเพลย์ลิสต์");
        } else if (window.innerWidth <= 1024) {
          $("#lover-md").addClass("far");
          $("#lover-md").removeClass("fas");
          $("#lover-md").attr("title", "เพิ่มเพลงลงเพลย์ลิสต์");
        } else {
          $("#lover-md").addClass("far");
          $("#lover-md").removeClass("fas");
          $("#lover-md").attr("title", "เพิ่มเพลงลงเพลย์ลิสต์");
        }
      }
    }
    if (this.sServ.audio.paused) {
      $(".fixed-bottom div div #player").addClass("fa-play");
      $(".fixed-bottom div div #player").removeClass("fa-pause");
      localStorage.setItem("isPlaying", "false");
      this.sServ.isPlaying.next(false);
      this.sServ.pp1 = true;
    }
    if (this.sServ.audio.currentTime != 0 && !this.sServ.audio.paused) {
      $(".fixed-bottom div div #player").addClass("fa-pause");
      $(".fixed-bottom div div #player").removeClass("fa-play");
      this.sServ.pp1 = false;
      localStorage.setItem("isPlaying", "true");
      this.sServ.isPlaying.next(true);
    }
    if ($(".fixed-bottom div div #player").hasClass("fa-pause"))
      $(".fixed-bottom div div #player").attr("title", "หยุดชั่วคราว");
    else $(".fixed-bottom div div #player").attr("title", "เล่น");

    if (window.innerWidth <= 1024)
      $(".fixed-bottom #play-bar .mobile_bar div div div #volume").attr(
        "title",
        "เสียง"
      );
    else {
      if (
        $(".fixed-bottom div #com div div #volume").hasClass("fa-volume-mute")
      )
        $(".fixed-bottom div #com div div #volume").attr("title", "เปิดเสียง");
      else
        $(".fixed-bottom div #com div div #volume").attr("title", "ปิดเสียง");
    }
    return true;
  }

  deleteSong(src) {
    if (!this.repeat && this.count > 0) {
      this.count--;
      this.play_index--;
    }
    for (let i = 0; i < this.songlist.length; i++) {
      if (this.songlist[i].src == src) {
        this.sServ.savename = this.songlist[i].name + this.songlist[i].artist;
        this.songlist.splice(i, 1);
        this.sServ.heart = true;
        break;
      }
    }
    for (let i = 0; i < this.array_random.length; i++) {
      if (this.array_random[i] == src) {
        this.array_random.splice(i, 1);
        if (this.count_random > 0) this.count_random--;
        break;
      }
    }
  }
}
