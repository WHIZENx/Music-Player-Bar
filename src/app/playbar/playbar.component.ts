import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SongService } from "../song.service";
import { Playlist } from "../playlist";

import $ = require("jquery");

@Component({
  selector: "app-playbar",
  templateUrl: "./playbar.component.html",
  styleUrls: ["./playbar.component.css"]
})
export class PlaybarComponent implements OnInit {
  constructor(public sServ: SongService, public cdRef: ChangeDetectorRef) {}

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
  text_script = null;
  text_info = null;

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
      if (!have) {
        if (this.mobile) this.show_overlay_info_top("เพิ่มลงเพลย์ลิสต์แล้ว");
        else {
          this.show_hide_popup();
          this.text_script = "เพิ่มลงเพลย์ลิสต์แล้ว";
        }
        this.sServ.addToPlaylist(this.songlist, src, name, artist, image);
      } else {
        if (this.mobile) this.show_overlay_info_top("นำเพลงออกเพลย์ลิสต์แล้ว");
        else {
          this.show_hide_popup();
          this.text_script = "นำเพลงออกเพลย์ลิสต์แล้ว";
        }
        this.deleteSong(src, true);
      }
    } else this.sServ.addToPlaylist(this.songlist, src, name, artist, image);
    this.sServ.refreshSong();
  }

  deleteSongList(src) {
    this.deleteSong(src);
    this.show_hide_popup();
    this.text_script = "นำเพลงออกเพลย์ลิสต์แล้ว";
  }

  popup_info_1 = null;
  popup_info_2 = null;
  popup_info_3 = null;
  popup_info_4 = null;

  show_overlay_info_top(text) {
    if ($(".popup_playlist").is(":visible")) {
      $(".popup_playlist").height(0);
      $(".popup_playlist").css(
        "top",
        "-" + Math.round(window.innerHeight / 20) * 4 + "px"
      );
      $(".popup_playlist").hide();
      clearTimeout(this.popup_info_1);
      clearTimeout(this.popup_info_2);
    }
    if (!$(".popup_playlist").is(":visible")) {
      this.text_info = text;
      $(".popup_playlist").css(
        "font-size",
        "" + Math.round(window.innerHeight / 35) + "px"
      );
      $(".popup_playlist").show();
      $(".popup_playlist").css("top", "0");
      $(".popup_playlist").height(
        "" + Math.round(window.innerHeight / 20) + "px"
      );
    }
    this.popup_info_1 = setTimeout(() => {
      $(".popup_playlist").css(
        "top",
        "-" + Math.round(window.innerHeight / 20) * 2 + "px"
      );
      this.popup_info_1 = null;
    }, 2000);
    this.popup_info_2 = setTimeout(() => {
      $(".popup_playlist").height(0);
      $(".popup_playlist").hide();
      this.popup_info_2 = null;
    }, 2500);
  }

  show_overlay_info_down(mode) {
    if (mode == 0)
      $(".popup_option").css("background-color", "rgb(60,179,113)");
    else $(".popup_option").css("background-color", "orangered");
    if ($(".popup_option").is(":visible")) {
      $(".popup_option").height(0);
      $(".popup_option").css(
        "top",
        "-" + Math.round(window.innerHeight / 20) * 4 + "px"
      );
      $(".popup_option").hide();
      clearTimeout(this.popup_info_3);
      clearTimeout(this.popup_info_4);
    }
    if (!$(".popup_option").is(":visible")) {
      $(".popup_option").css(
        "font-size",
        "" + Math.round(window.innerHeight / 35) + "px"
      );
      $(".popup_option").show();
      $(".popup_option").css("bottom", "0");
      $(".popup_option").height(
        "" + Math.round(window.innerHeight / 20) + "px"
      );
    }
    this.popup_info_3 = setTimeout(() => {
      $(".popup_option").css(
        "top",
        "-" + Math.round(window.innerHeight / 20) * 2 + "px"
      );
      this.popup_info_3 = null;
    }, 2000);
    this.popup_info_4 = setTimeout(() => {
      $(".popup_option").height(0);
      $(".popup_option").hide();
      this.popup_info_4 = null;
    }, 2500);
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
    m = Math.round(time / 60.0);
    s = Math.round(time % 60.0);
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
        $(".slider_play").val(
          (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
        );
      } else if (event.keyCode === 39 || event.keyCode === 38) {
        this.sServ.audio.currentTime = this.sServ.audio.currentTime + 1;
        $(".slider_play").val(
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
          event.target.className != "fa fa-volume-up" &&
          event.target.className != "fa fa-volume-off" &&
          event.target.className != "slider" &&
          event.target.className != "volume_bar"
        ) {
          $(".bg_volume_bar").hide();
          this.volume_bar = false;
        }
      });
    }
    $(".popuptext").hide();
    $("#playlistbar").hide();
    $("#infobar").hide();
    $(".bg_volume_bar").hide();
    $(".less_options").hide();
    $("#options").hide();
    $(".popuptext").hide();
    $(".popuptime").hide();
    if (this.mobile) {
      $(".popuptime_info").offset({
        left:
          $(".slider_play_info").offset().left -
          $(".popuptime_info").width() / 2 +
          29
      });
    }
    $(".popuptime_info").hide();
    $(".popup_playlist").hide();
    $(".popup_option").hide();
    $("#text-overflow").hide();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges(); // Fix lifecycle hook
  }

  selected_bar = false;

  setTime(e) {
    if (this.time_finish == "0:00") return false;
    let x = e.pageX;
    if (this.sServ.audio.src != "") {
      this.sServ.audio.currentTime =
        ((x + 1) / $(".slider_play").width()) * this.sServ.audio.duration;
      this.block = false;
      this.down = false;
      this.timeskip = false;
      this.selected_bar = true;
    }
  }

  disableAuto(e) {
    if (this.time_finish == "0:00") {
      this.show_hide_popup();
      this.text_script = "กำลังโหลดเพลง...";
      return false;
    }
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
    if (this.time_finish == "0:00") return false;
    if (this.sServ.audio.src != "") {
      this.sServ.audio.currentTime =
        (e.target.valueAsNumber / 100) * this.sServ.audio.duration;
      this.block = false;
      this.down = false;
      this.timeskip = false;
    }
    $(".popuptime_info").hide();
  }

  moveTime_mobile(e) {
    if (this.time_finish == "0:00") return false;
    let x = e.touches[0].pageX;
    if (this.mobile && window.innerHeight > window.innerWidth) {
      if (x <= $(".slider_play_info").offset().left)
        $(".popuptime_info").offset({
          left:
            $(".slider_play_info").offset().left -
            $(".popuptime_info").width() / 2
        });
      else if (
        x + $(".popuptime_info").width() - 10 < window.innerWidth &&
        x >= window.innerWidth - $(".slider_play_info").offset().left
      )
        $(".popuptime_info").offset({
          left:
            window.innerWidth -
            $(".slider_play_info").offset().left -
            $(".popuptime_info").width() / 2
        });
      else {
        if (x + $(".popuptime_info").width() - 10 < window.innerWidth)
          $(".popuptime_info").offset({
            left: x - $(".popuptime_info").width() / 2
          });
      }
      this.time_selected = this.time_duration(
        (e.target.valueAsNumber / 100) * this.sServ.getDuration()
      );
    } else {
      if (x <= 23) $(".popuptime").offset({ left: 1 });
      else if (x >= $(".slider_play").width() - 25)
        $(".popuptime").offset({ left: $(".slider_play").width() - 50 });
      else $(".popuptime").offset({ left: x - 23 });
      this.time_selected = this.time_duration(
        (e.target.valueAsNumber / 100) * this.sServ.getDuration()
      );
    }
  }

  disableAuto_mobile(e) {
    if (this.sServ.p1) this.timeskip = true;
    if (this.sServ.audio.src != "") {
      this.block = true;
      this.down = true;
    }
    this.set_position_time(e, true);
    $(".popuptime_info").show();
  }

  touch_y_pos = 0;
  touch_y_pos_cur = 0;

  save_position_ty(e) {
    if (!this.down) this.touch_y_pos = e.touches[0].pageY;
  }

  move_position_ty(e) {
    if (!this.down) this.touch_y_pos_cur = e.touches[0].pageY;
  }

  check_position_ty(e) {
    if (this.touch_y_pos < this.touch_y_pos_cur - 100) this.hide_info();
    this.touch_y_pos = 0;
    this.touch_y_pos_cur = 0;
  }

  set_position_time(e, mobile = false) {
    if (this.time_finish == "0:00") return false;
    if (!mobile) {
      e.offset({
        left:
          (this.sServ.audio.currentTime * $(".slider_play").width()) /
            this.sServ.getDuration() -
          e.width() / 2
      });
      let left = e.position().left;
      if (left < 2) e.offset({ left: 2 });
      else if (left >= $(".slider_play").width() - 30)
        e.offset({ left: $(".slider_play").width() - 52 });
    } else {
      let x = e.touches[0].pageX;
      if (this.mobile && window.innerHeight > window.innerWidth) {
        if (x <= $(".slider_play_info").offset().left)
          $(".popuptime_info").offset({
            left:
              $(".slider_play_info").offset().left -
              $(".popuptime_info").width() / 2
          });
        else if (
          x + $(".popuptime_info").width() - 10 < window.innerWidth &&
          x >= window.innerWidth - $(".slider_play_info").offset().left
        )
          $(".popuptime_info").offset({
            left:
              window.innerWidth -
              $(".slider_play_info").offset().left -
              $(".popuptime_info").width() / 2
          });
        else {
          if (x + $(".popuptime_info").width() - 10 < window.innerWidth)
            $(".popuptime_info").offset({
              left: x - $(".popuptime_info").width() / 2
            });
        }
      }
    }
    this.time_selected = this.time_start;
  }

  show_duraion(e) {
    if (this.time_finish != "0:00") {
      $(".popuptime").show();
      this.set_position_time($(".popuptime"));
    }
  }

  time_selected = "0:00";

  set_duraion(e) {
    if (this.time_finish == "0:00") return false;
    if (!$(".popuptime").is(":visible")) {
      if (this.time_finish != "0:00") {
        $(".popuptime").show();
      }
    }
    let x = e.pageX;
    if (x <= 23) $(".popuptime").offset({ left: 2 });
    else if (x >= $(".slider_play").width() - 30)
      $(".popuptime").offset({ left: $(".slider_play").width() - 52 });
    else $(".popuptime").offset({ left: x - 23 });
    if (x > 0)
      this.time_selected = this.time_duration(
        ((x + 1) / $(".slider_play").width()) * this.sServ.getDuration()
      );
    else if (x > $(".slider_play").width())
      this.time_selected = this.time_duration(this.sServ.getDuration());
    else this.time_selected = "0:00";
  }

  hide_duraion(e) {
    if (this.time_finish == "0:00") return false;
    this.set_position_time($(".popuptime"));
    $(".popuptime").hide();
  }

  time_show_script = null;
  time_ss = 0;

  show_hide_popup() {
    if ($(".popuptext").is(":visible")) {
      $(".popuptext").hide();
      clearInterval(this.time_show_script);
      this.time_ss = 0;
    }
    $(".popuptext").fadeIn();
    this.time_show_script = setInterval(() => {
      this.time_ss++;
      if (this.time_ss == 1) {
        $(".popuptext").fadeOut();
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
      if (this.mobile && window.innerHeight > window.innerWidth)
        this.show_overlay_info_down(0);
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
        if (this.mobile && window.innerHeight > window.innerWidth)
          this.show_overlay_info_down(0);
      }
      this.random = false;
    } else {
      if (this.sServ.mode == 1) {
        this.show_hide_popup();
        this.text_script = "สุ่มเพลงเล่น";
        if (this.mobile && window.innerHeight > window.innerWidth)
          this.show_overlay_info_down(0);
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
    if (this.mobile && window.innerHeight > window.innerWidth) {
      this.setProgressbar($(".slider_play_info"), 0, "white", "#666");
      $(".slider_play_info").val(0);
    } else {
      this.setProgressbar($(".slider_play"), 0, "orangered", "#555");
      $(".slider_play").val(0);
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
    this.check_text_overflow_skip();
  }

  checkVolume(e) {
    if (e.target.className == "fa fa-volume-up") {
      this.save_volume = parseInt(
        $(".fixed-bottom .playerbar .bg-position .row div div .slider").val()
      );
      $(".fixed-bottom .bg-position .row div div .slider").val(0);
      this.sServ.setVolume(0);
      this.setProgressbar(
        $(".fixed-bottom .playerbar .bg-position .row div div .slider"),
        0,
        "rgb(237, 187, 76)",
        "#d3d3d3"
      );
      $(e.target).addClass("fa-volume-off");
      $(e.target).removeClass("fa-volume-up");
    } else if (e.target.className == "fa fa-volume-off") {
      this.setProgressbar(
        $(".fixed-bottom .playerbar .bg-position .row div div .slider"),
        this.save_volume,
        "rgb(237, 187, 76)",
        "#d3d3d3"
      );
      $(".fixed-bottom .playerbar .bg-position .row div div .slider").val(
        this.save_volume
      );
      this.sServ.setVolume(this.save_volume);
      $(e.target).addClass("fa-volume-up");
      $(e.target).removeClass("fa-volume-off");
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
      if (!this.sServ.p1 || !this.sServ.pp1) {
        if (!this.run_text) {
        }
      }
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
            this.setProgressbar($(".slider_play"), 0, "orangered", "#555");
            $(".slider_play").val(0);
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
        e.target.className == "option-bg-container" ||
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
        e.target.className == "option-bg-container" ||
        e.target.className == "detailtext-less" ||
        e.target.className == "detailtext-less-row" ||
        e.target.className == "detailtext-less-img" ||
        e.target.className == "detailtext-less-img-inner card-img" ||
        e.target.className == "detailtext-less-text" ||
        e.target.className == "detailtext-less-text-name" ||
        e.target.className == "detailtext-less-text-artist" ||
        e.target.className == "detailtext-less-love" ||
        e.target.className == "detailtext-less-love-inner fa fa-heart-o" ||
        e.target.className == "detailtext-less-love-inner fa fa-heart" ||
        e.target.className == "detailtext-less-love-inner fa-heart" ||
        e.target.className == "fa-heart fas" ||
        e.target.className == "fa-heart far"
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
      e.target.className == "fa fa-play" ||
      e.target.className == "fa fa-pause" ||
      e.target.className == "fa fa-step-backward" ||
      e.target.className == "fa fa-step-forward" ||
      e.target.className == "fa fa-repeat" ||
      e.target.className == "fa fa-long-arrow-right" ||
      e.target.className == "fa fa-random" ||
      e.target.className == "fa fa-volume-up" ||
      e.target.className == "fa fa-volume-off" ||
      e.target.className == "slider slider-than" ||
      e.target.className == "volume_bar" ||
      e.target.className == "slider_play" ||
      e.target.className == "fa fa-refresh" ||
      e.target.className == "fa fa-heart" ||
      e.target.className == "fa fa-heart-o" ||
      e.target.className == "option-bg-container" ||
      e.target.className == "detailtext" ||
      e.target.className == "detailtext-row" ||
      e.target.className == "detailtext-img" ||
      e.target.className == "detailtext-img-inner card-img" ||
      e.target.className == "detailtext-text" ||
      e.target.className == "detailtext-text-name" ||
      e.target.className == "detailtext-text-artist" ||
      e.target.className == "detailtext-love" ||
      e.target.className == "detailtext-love-inner fa fa-heart-o" ||
      e.target.className == "detailtext-love-inner fa fa-heart" ||
      e.target.className == "detailtext-love-inner fa-heart" ||
      e.target.className == "fa-heart fas" ||
      e.target.className == "fa-heart far"
    )
      return false;
    if ($(".overlay-info").is(":visible")) this.hide_info();
    if (this.time_bar != null) {
      clearInterval(this.time_bar);
      this.time_bar = null;
      this.timer_bar = 0;
    }
    if (this.overlay) {
      this.overlay = false;
      $(".overlay").height(0);
      $("#content").css("transform", "rotate(0deg)");
      $("#content").css("-webkit-transform", "rotate(0deg)");
      $("#content").css("margin-top", "10px");
      this.time_bar = setInterval(() => {
        this.timer_bar++;
        if (this.timer_bar == 1) {
          $("#playlistbar").hide();
          clearInterval(this.time_bar);
          this.time_bar = null;
          this.timer_bar = 0;
        }
      }, 500);
    } else {
      this.overlay = true;
      $("#playlistbar").show();
      $(".overlay").css({ height: "100%" });
      $("#content").css("margin-top", "-5px");
      $("#content").css("transform", "rotate(180deg)");
      $("#content").css("-webkit-transform", "rotate(180deg)");
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
      $(".overlay").height(0);
      $("#content").css("transform", "rotate(0deg)");
      $("#content").css("-webkit-transform", "rotate(0deg)");
      $("#content").css("margin-top", "10px");
      this.time_bar = setInterval(() => {
        this.timer_bar++;
        if (this.timer_bar == 1) {
          $("#playlistbar").hide();
          clearInterval(this.time_bar);
          this.time_bar = null;
          this.timer_bar = 0;
        }
      }, 500);
    }
  }

  volume_bar = false;
  option_bar = false;

  overlay_info = false;
  timer_infobar = 0;
  time_infobar = null;

  showInfo(e) {
    if (
      this.image ==
      "https://firebasestorage.googleapis.com/v0/b/websong-66c3d.appspot.com/o/songlogo.jpg?alt=media&token=40247c58-de1c-4a92-9c73-5b280f8d85c8"
    )
      return false;
    if (
      e.target.className == "fa fa-play" ||
      e.target.className == "fa fa-pause"
    ) {
      this.playAudio(this.songSrc, this.songName, this.artist, this.image);
      return false;
    }

    if (this.mobile && window.innerHeight > window.innerWidth) {
      if ($(".overlay").is(":visible")) this.hide_playlist();
      this.show_info();
    }
  }

  showOptions() {
    if (this.option_bar) {
      // if (window.innerWidth <= 682) $(".detailtext-less").hide();
      // else $(".detailtext").hide();

      this.option_bar = false;
    } else {
      // if (window.innerWidth <= 682) $(".detailtext-less").show();
      // else $(".detailtext").show();
      this.option_bar = true;
    }
  }

  overlay_playlist_info = false;
  timer_playlist_infobar = 0;
  time_playlist_infobar = null;

  show_playlist_info() {
    this.overlay_playlist_info = true;
    $(".overlay-playlist-info").show();
    $(".overlay-info").css({ bottom: "100%" });
    $(".overlay-info").css({ height: "100%" });
    $(".overlay-playlist-info").css({ height: "100%" });
    setTimeout(() => {
      $(".overlay-info").hide();
      if (this.first_time) {
        $("#text-overflow").hide();
        $("#col-name-info").css("text-indent", 0);
        this.first_time = false;
        clearInterval($("#col-name-info").data("interval"));
      }
    }, 500);
  }

  hide_info_playlist() {
    if ($(".popup_option").is(":visible")) {
      $(".popup_option").height(0);
      $(".popup_option").css(
        "top",
        "-" + Math.round(window.innerHeight / 20) * 2 + "px"
      );
      $(".popup_option").hide();
      clearTimeout(this.popup_info_3);
      clearTimeout(this.popup_info_4);
    }
    this.overlay_playlist_info = false;
    $(".overlay-info").show();
    $(".overlay-info").css({ bottom: "0%" });
    $(".overlay-playlist-info").height(0);
    setTimeout(() => {
      $(".overlay-playlist-info").hide();
    }, 500);
    this.check_text_overflow();
  }

  first_time = false;

  show_info() {
    if (this.time_infobar != null) {
      clearInterval(this.time_infobar);
      this.time_infobar = null;
      this.timer_infobar = 0;
    }
    if (this.overlay_info) {
      this.overlay_info = false;
      $(".overlay-info").height(0);
      $(".playerbar-mobile").show();
      $("#infobar").css("z-index", "1060");
      this.time_infobar = setInterval(() => {
        this.timer_infobar++;
        if (this.timer_infobar == 1) {
          $("#infobar").hide();
          clearInterval(this.time_infobar);
          this.time_infobar = null;
          this.timer_infobar = 0;
          $("html, body").css({ overflow: "auto" });
          if ($(".popup_playlist").is(":visible")) {
            $(".popup_playlist").height(0);
            $(".popup_playlist").css(
              "top",
              "-" + Math.round(window.innerHeight / 20) * 2 + "px"
            );
            $(".popup_playlist").hide();
            clearTimeout(this.popup_info_1);
            clearTimeout(this.popup_info_2);
          }
        }
      }, 500);
    } else {
      this.overlay_info = true;
      $("#infobar").show();
      $("#infobar").css("z-index", "1090");
      setTimeout(() => {
        $(".playerbar-mobile").hide();
      }, 200);
      $(".overlay-info").css({ height: "100%" });
      $("html, body").css({ overflow: "hidden" });
      this.check_text_overflow();
    }
  }

  run_text = false;

  check_text_overflow_skip() {
    this.first_time = false;
    $("#text-overflow").hide();
    $("#col-name-info").css("text-indent", 0);
    clearInterval($("#col-name-info").data("interval"));
    $("#col-name-info").css("visibility", "hidden");
    $("#col-name-info").fadeOut(200);
    setTimeout(() => {
      $("#col-name-info").css("visibility", "visible");
      $("#col-name-info").fadeIn("fast");
      this.check_text_overflow();
    }, 175);
  }

  check_text_overflow() {
    if ($("#name-info").prop("scrollWidth") > $("#col-name-info").width()) {
      if (!this.first_time) {
        $("#text-overflow").show();
        var width_text =
          $("#name-info").prop("scrollWidth") + $("#name-info").width();
        var marquee = $("#col-name-info");
        this.first_time = true;
        this.run_text = true;
        marquee.each(function() {
          var mar = $(this),
            indent = mar.width();
          mar.marquee = function() {
            indent--;
            mar.css("text-indent", indent);
            if (indent < -1 * width_text) {
              indent = mar.width() + 80;
            }
          };
          mar.data("interval", setInterval(mar.marquee, 1500 / 60));
        });
      }
    } else {
      this.first_time = false;
      this.run_text = false;
      clearInterval($("#col-name-info").data("interval"));
      $("#col-name-info").css("text-indent", 0);
      $("#text-overflow").hide();
    }
  }

  hide_info() {
    if (this.time_infobar != null) {
      clearInterval(this.time_infobar);
      this.time_infobar = null;
      this.timer_infobar = 0;
    }
    if (this.overlay_info) {
      this.overlay_info = false;
      $(".overlay-info").height(0);
      $(".playerbar-mobile").show();
      $("#infobar").css("z-index", "1060");
      this.time_infobar = setInterval(() => {
        this.timer_infobar++;
        if (this.timer_infobar == 1) {
          if (this.first_time) {
            $("#text-overflow").hide();
            $("#col-name-info").css("text-indent", 0);
            this.first_time = false;
            clearInterval($("#col-name-info").data("interval"));
          }
          $("#infobar").hide();
          clearInterval(this.time_infobar);
          this.time_infobar = null;
          this.timer_infobar = 0;
          $("html, body").css({ overflow: "auto" });
          if ($(".popup_playlist").is(":visible")) {
            $(".popup_playlist").height(0);
            $(".popup_playlist").css(
              "top",
              "-" + Math.round(window.innerHeight / 20) * 2 + "px"
            );
            $(".popup_playlist").hide();
            clearTimeout(this.popup_info_1);
            clearTimeout(this.popup_info_2);
          }
        }
      }, 500);
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

  onPlaying() {
    if (typeof window.orientation !== "undefined") this.mobile = true;
    if (this.mobile) {
      if (window.innerHeight > window.innerWidth) {
        if (
          this.image ==
          "https://firebasestorage.googleapis.com/v0/b/websong-66c3d.appspot.com/o/songlogo.jpg?alt=media&token=40247c58-de1c-4a92-9c73-5b280f8d85c8"
        )
          $("#player_info").hide();
        else $("#player_info").show();
        $(".playerbar").hide();
        $("#playlistbar").hide();
        if (
          !$(".overlay-info").is(":visible") &&
          !$(".overlay-playlist-info").is(":visible")
        )
          $(".playerbar-mobile").show();
        $(".randoms").css("margin-left", "15%");
        if ($(".overlay-info").is(":visible"))
          $("#playlist-logo2").offset({
            left: $("#playlist-logo1").offset().left + 8
          });
        if (window.innerWidth <= 360) $("#play_text").css("font-size", "80%");
        else $("#play_text").css("font-size", "100%");
      } else {
        $(".playerbar").show();
        $("#playlistbar").show();
        $(".playerbar-mobile").hide();
        $(".repeats").css("margin-left", "20%");
        $(".randoms").css("margin-left", "20%");
      }
      if (window.innerWidth <= 360) {
        if (!$("#mobile-less-fonts").hasClass("fix-less-fonts"))
          $("#mobile-less-fonts").addClass("fix-less-fonts");
        $("#mobile-less-options").css("padding-left", "0");
        $("#mobile-less-options").css("padding-right", "4%");
      } else if (window.innerWidth <= 400) {
        if ($("#mobile-less-fonts").hasClass("fix-less-fonts"))
          $("#mobile-less-fonts").removeClass("fix-less-fonts");
        $("#mobile-less-options").css("padding-left", "5px");
        $("#mobile-less-options").css("padding-right", "6%");
      } else {
        if ($("#mobile-less-fonts").hasClass("fix-less-fonts"))
          $("#mobile-less-fonts").removeClass("fix-less-fonts");
        $("#mobile-less-options").css("padding-left", "7px");
        $("#mobile-less-options").css("padding-right", "5%");
      }
      $("#volume-less").hide();
      $(".bg_volume_bar").hide();
      $("#content").hide();
      $(".slider_play").css("pointer-events", "none");
      $(".slider_play").addClass("redslider");
      $(".m_option").css("width", "100%");
      $("#right-option").css("justify-content", "center");
      $("#com").hide();
      $("#mobile").show();
      $("#volume").hide();
      $(".slider-than").hide();
    } else {
      if (
        this.image ==
        "https://firebasestorage.googleapis.com/v0/b/websong-66c3d.appspot.com/o/songlogo.jpg?alt=media&token=40247c58-de1c-4a92-9c73-5b280f8d85c8"
      ) {
        $("#option-bg").hide();
      } else $("#option-bg").show();
      $("#right-option").css("justify-content", "flex-end");
      $(".playerbar-mobile").hide();
      $(".modal-body").height($("#playlistbar").height() - 110);
      $("#volume").hide();
      $("#infobar").hide();
      if (window.innerWidth <= 682) {
        if ($("#options").offset() != undefined) {
          let x =
            $("#options").offset().left -
            $(".less_options").width() +
            $("#options").width();
          $(".less_options").offset({ left: x + 1 });
        }
        $("#volume-less").hide();
        $(".bg_volume_bar").hide();
        this.volume_bar = false;
        $(".repeats").hide();
        $(".randoms").hide();
        $("#options").show();
        $("#com").hide();
        $("#mobile").show();
        $(".slider-than").hide();
        var v = $(".fixed-bottom .playerbar .less_options div .slider").val();
      } else if (window.innerWidth <= 1024) {
        $("#options").hide();
        $("#volume-less").show();
        $(".repeats").show();
        $(".randoms").show();
        $("#com").hide();
        $("#mobile").show();
        $(".slider-than").hide();
        if ($(".bg_volume_bar").is(":visible")) {
          let offset_volume_bar = $("#volume-less").offset();
          $("#volume_bar").offset({ left: offset_volume_bar.left - 10 });
          $(".bg_volume_bar").offset({ left: -$(".bg_volume_bar").width() });
        }
        var v = $(".fixed-bottom .playerbar .bg_volume_bar div .slider").val();
      } else {
        $("#right-option").css("justify-content", "flex-end");
        $("#com").show();
        $("#mobile").hide();
        $(".bg_volume_bar").hide();
        this.volume_bar = false;
        $("#options").hide();
        $("#volume-less").hide();
        $("#volume").show();
        $(".slider-than").show();
        $(".repeats").show();
        $(".randoms").show();
        $(".modal-body").height("100%");
        var v = $(
          ".fixed-bottom .playerbar .bg-position .row #mobile-less-options div #myRange"
        ).val();
      }
    }
    if (v !== undefined) {
      this.sServ.setVolume(v);
      if (window.innerWidth <= 682) {
        var val =
          ($(".fixed-bottom .playerbar .less_options div .slider").val() -
            $(".fixed-bottom .playerbar .less_options div .slider").attr(
              "min"
            )) /
          ($(".fixed-bottom .playerbar .less_options div .slider").attr("max") -
            $(".fixed-bottom .playerbar .less_options div .slider").attr(
              "min"
            ));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom .less_options div .slider"),
          percent,
          "rgb(237, 187, 76)",
          "#d3d3d3"
        );
      } else if (window.innerWidth <= 1024) {
        var val =
          ($(".fixed-bottom .playerbar .bg_volume_bar div .slider").val() -
            $(".fixed-bottom .playerbar .bg_volume_bar div .slider").attr(
              "min"
            )) /
          ($(".fixed-bottom .playerbar .bg_volume_bar div .slider").attr(
            "max"
          ) -
            $(".fixed-bottom .playerbar .bg_volume_bar div .slider").attr(
              "min"
            ));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom .bg_volume_bar div .slider"),
          percent,
          "rgb(237, 187, 76)",
          "#d3d3d3"
        );
      } else {
        var val =
          ($(
            ".fixed-bottom .playerbar .bg-position .row div div .slider"
          ).val() -
            $(
              ".fixed-bottom .playerbar .bg-position .row div div .slider"
            ).attr("min")) /
          ($(".fixed-bottom .playerbar .bg-position .row div div .slider").attr(
            "max"
          ) -
            $(
              ".fixed-bottom .playerbar .bg-position .row div div .slider"
            ).attr("min"));
        var percent = val * 100;
        this.setProgressbar(
          $(".fixed-bottom .playerbar .bg-position .row div div .slider"),
          percent,
          "rgb(237, 187, 76)",
          "#d3d3d3"
        );
      }
      if (parseInt(v) == 0) {
        if (window.innerWidth > 682 && window.innerWidth <= 1024) {
          $("#volume-less").addClass("fa-volume-off");
          $("#volume-less").removeClass("fa-volume-up");
        } else if (window.innerWidth > 1024) {
          $("#volume").addClass("fa-volume-off");
          $("#volume").removeClass("fa-volume-up");
        }
      } else {
        if (window.innerWidth > 682 && window.innerWidth <= 1024) {
          $("#volume-less").addClass("fa-volume-up");
          $("#volume-less").removeClass("fa-volume-off");
        } else if (window.innerWidth > 1024) {
          $("#volume").addClass("fa-volume-up");
          $("#volume").removeClass("fa-volume-off");
        }
      }
    }
    if (localStorage.getItem("isPlaying") === "true") {
      if (this.mobile && window.innerHeight > window.innerWidth) {
        var val =
          ($(".slider_play_info").val() - $(".slider_play_info").attr("min")) /
          ($(".slider_play_info").attr("max") -
            $(".slider_play_info").attr("min"));
        var percent = val * 100;
        if (this.time_start == "0:00") {
          this.setProgressbar($(".slider_play_info"), 0, "white", "#666");
          $(".slider_play_info").val(0);
        } else {
          this.setProgressbar($(".slider_play_info"), percent, "white", "#666");
        }
      }
      var val =
        ($(".slider_play").val() - $(".slider_play").attr("min")) /
        ($(".slider_play").attr("max") - $(".slider_play").attr("min"));
      var percent = val * 100;
      if (this.time_start == "0:00") {
        this.setProgressbar($(".slider_play"), 0, "orangered", "#555");
        $(".slider_play").val(0);
      } else {
        this.setProgressbar($(".slider_play"), percent, "orangered", "#555");
      }
      var time = this.sServ.audio.currentTime;
      this.time_start = this.time_duration(time);
      if (!this.block && time > 0) {
        $(".slider_play").val(
          (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
        );
        if (this.mobile && window.innerHeight > window.innerWidth)
          $(".slider_play_info").val(
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
        if (this.mobile && window.innerHeight > window.innerWidth) {
          $("#player_info").addClass("fa-pause");
          $("#player_info").removeClass("fa-play");
          $("#player_info_bar").addClass("fa-pause");
          $("#player_info_bar").removeClass("fa-play");
        }
        $("#player").addClass("fa-pause");
        $("#player").removeClass("fa-play");
      }
    } else {
      if (this.sServ.pp1) {
        if (this.mobile && window.innerHeight > window.innerWidth) {
          var val =
            ($(".slider_play_info").val() -
              $(".slider_play_info").attr("min")) /
            ($(".slider_play_info").attr("max") -
              $(".slider_play_info").attr("min"));
          var percent = val * 100;
          this.setProgressbar($(".slider_play_info"), percent, "white", "#666");
        }
        var val =
          ($(".slider_play").val() - $(".slider_play").attr("min")) /
          ($(".slider_play").attr("max") - $(".slider_play").attr("min"));
        var percent = val * 100;
        this.setProgressbar($(".slider_play"), percent, "orangered", "#555");
        time = this.sServ.audio.currentTime;
        if (!this.block && time > 0) {
          $(".slider_play").val(
            (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
          );
          if (this.mobile && window.innerHeight > window.innerWidth)
            $(".slider_play_info").val(
              (this.sServ.audio.currentTime / this.sServ.getDuration()) * 100
            );
        }
        this.time_start = this.time_duration(time);
        if (!this.sServ.pp1) this.time_start = "0:00";
      }
      if (this.isplay) {
        if (this.mobile && window.innerHeight > window.innerWidth) {
          $("#player_info").addClass("fa-play");
          $("#player_info").removeClass("fa-pause");
          $("#player_info_bar").addClass("fa-play");
          $("#player_info_bar").removeClass("fa-pause");
        }
        $("#player").addClass("fa-play");
        $("#player").removeClass("fa-pause");
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
      var love = false;
      if (this.mobile && window.innerHeight > window.innerWidth) {
        for (let i = 0; i < this.songlist.length; i++) {
          if (this.songlist[i].src == this.songSrc) {
            $("#lover-info").addClass("fas");
            $("#lover-info").removeClass("far");
            love = true;
            break;
          }
        }
      }
      if (!this.mobile) {
        for (let i = 0; i < this.songlist.length; i++) {
          if (this.songlist[i].src == this.songSrc) {
            $("#love-bar").addClass("fas");
            $("#love-bar").removeClass("far");
            $("#option-bg").attr("title", "ไม่ชอบ");
            love = true;
            break;
          }
        }
      }
    }

    if (!love) {
      if (this.mobile && window.innerHeight > window.innerWidth) {
        $("#lover-info").addClass("far");
        $("#lover-info").removeClass("fas");
      }
      if (!this.mobile) {
        $("#love-bar").addClass("far");
        $("#love-bar").removeClass("fas");
        $("#option-bg").attr("title", "ชอบ");
      }
    }
    if (this.sServ.audio.paused) {
      if (this.mobile && window.innerHeight > window.innerWidth) {
        $("#player_info").addClass("fa-play");
        $("#player_info").removeClass("fa-pause");
        $("#player_info_bar").addClass("fa-play");
        $("#player_info_bar").removeClass("fa-pause");
      }
      $("#player").addClass("fa-play");
      $("#player").removeClass("fa-pause");
      localStorage.setItem("isPlaying", "false");
      this.sServ.isPlaying.next(false);
      this.sServ.pp1 = true;
    }
    if (this.sServ.audio.currentTime != 0 && !this.sServ.audio.paused) {
      if (this.mobile && window.innerHeight > window.innerWidth) {
        $("#player_info").addClass("fa-pause");
        $("#player_info").removeClass("fa-play");
        $("#player_info_bar").addClass("fa-pause");
        $("#player_info_bar").removeClass("fa-play");
      }
      $("#player").addClass("fa-pause");
      $("#player").removeClass("fa-play");
      this.sServ.pp1 = false;
      localStorage.setItem("isPlaying", "true");
      this.sServ.isPlaying.next(true);
    }
    if ($("#player").hasClass("fa-pause"))
      $("#player").attr("title", "หยุดชั่วคราว");
    else $("#player").attr("title", "เล่น");

    if ($("#volume").hasClass("fa-volume-off"))
      $("#volume").attr("title", "เปิดเสียง");
    else $("#volume").attr("title", "ปิดเสียง");

    if (this.mobile) {
      let win_width = window.innerWidth;
      let win_height = window.innerHeight;
      let tri_inch = (win_width ** 2 + win_height ** 2) ** 0.5;
      $("#name-info").css("font-size", Math.round(tri_inch / 27) + "px");
      $("#down-info").css("font-size", Math.round(tri_inch / 37) + "px");
      $("#artist-info").css("font-size", Math.round(tri_inch / 30) - 8 + "px");
      $("#time-start-info").css(
        "font-size",
        Math.round(tri_inch / 30) - 8 + "px"
      );
      $("#time-finish-info").css(
        "font-size",
        Math.round(tri_inch / 30) - 8 + "px"
      );
      $("#backward-info").css("font-size", Math.round(tri_inch / 45) + "px");
      $("#player_info_bar").css("font-size", Math.round(tri_inch / 20) + "px");
      $("#forward-info").css("font-size", Math.round(tri_inch / 45) + "px");
      $("#playlist-logo1").css("font-size", Math.round(tri_inch / 28) + "px");
      $("#lover-info").css("font-size", Math.round(tri_inch / 28) + "px");
      $("#playlist-logo2").css(
        "font-size",
        Math.round(tri_inch / 28) - 10 + "px"
      );
      $("#playlist-logo2").offset({
        left:
          $("#playlist-logo1").offset().left +
          $("#playlist-logo1").width() / 2.5
      });
      $("#playlist-logo2").offset({
        top:
          $("#playlist-logo1").offset().top +
          $("#playlist-logo1").height() / 2.5
      });
      $("#playbar-info").css(
        "height",
        Math.round(win_height / 20) * (win_height / 1000) + "px"
      );
      $(".popuptime_info").css("font-size", Math.round(tri_inch / 40) + "px");
    }

    return true;
  }

  deleteSong(src, mode = false) {
    if (!this.repeat && this.count > 0) {
      this.count--;
      this.play_index--;
    }
    for (let i = 0; i < this.songlist.length; i++) {
      if (this.songlist[i].src == src) {
        this.sServ.savename =
          this.songlist[i].name +
          this.songlist[i].artist +
          this.songlist[i].name;
        this.songlist.splice(i, 1);
        this.sServ.heart = false;
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
    if (this.mobile && window.innerHeight > window.innerWidth && !mode) {
      this.savenow(this.songlist);
      this.text_script = "ลบเพลงออกจากเพลย์ลิสต์แล้ว";
      this.show_overlay_info_down(1);
    }
  }
}
