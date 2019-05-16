/* eslint-disable camelcase */
$(function() {
  $('#b2s').click(function() {
    var sec = 240 / $('#bpm').val();
    $('#mps').val($('#mpb').val() / sec);
    app_bar();
  });

  $('#s2b').click(function() {
    var sec = 240 / $('#bpm').val();
    $('#mpb').val($('#mps').val() * sec);
    app_bar();
  });

  $('#convert').click(function() {
    var stra = $('#clip')
      .val()
      .split(/\r\n|\r|\n/);
    var tate_haba = Number($('#tate_haba').val());
    var tate_count = Number($('#tate_count').val());
    var tate_ganbaru = $('#tate_ganbaru').prop('checked');
    var tate_yuusen = $('#tate_yuusen').prop('checked');

    var _str = 'iBMSC Clipboard Data xNT\n';

    var lines = [];

    var available = [5, 6, 7, 8, 9, 10, 11]; // 初期化忘れずに

    var note = new Note(stra[1]); // 初期化忘れずに

    var old_pos = note.getPos(); // 初期化忘れずに

    var i = 1;

    var used_ary = []; // 初期化忘れずに

    var available_pri = []; // 初期化忘れずに

    var over = 26; // 初期化忘れずに

    var koeta = false;
    var turami = 0;

    while (i < stra.length) {
      // 初期化
      available = [5, 6, 7, 8, 9, 10, 11];
      old_pos = note.getPos();
      used_ary = [];
      over = 26;

      // 二度と使われない過去を削除
      while (
        lines.length > 0 &&
        lines[0].getPos() < note.getPos() - tate_haba * tate_count
      ) {
        lines.shift();
      }

      // 縦連となる場所を検索
      for (var j = 0; j < lines.length; j++) {
        if (lines[j].getPos() > note.getPos() - tate_haba) {
          Array.prototype.push.apply(used_ary, lines[j].getUse());
        }
      }

      // 縦連数が規定を超えるものを検索(0ならやんない)
      if (tate_count != 0) {
        var fg = 0;
        var fg2 = 0;
        var arr = [5, 6, 7, 8, 9, 10, 11];
        for (var k = 1; k <= tate_count; k++) {
          var l = note.getPos() - tate_haba * k;
          for (var j = 0; j < lines.length; j++) {
            if (lines[j].getPos() == l) {
              fg = 1;
              arr = diffArrayOverlap(arr, lines[j].getUse());
              if (arr.length == 0) {
                fg = 0;
              }
              break;
            }
          }

          if (fg == 0) {
            fg2 = 1;
            break;
          }

          fg = 0;
        }
        if (fg2 == 0) {
          Array.prototype.push.apply(used_ary, arr);
        }
      }

      // 利用可能を定義
      available = diffArray(available, used_ary);
      used_ary = [];
      available_pri = [];
      if (tate_yuusen) {
        for (var j = 0; j < lines.length; j++) {
          var l = note.getPos() - tate_haba;
          if (lines[j].getPos() == l) {
            available_pri = diffArray(lines[j].getUse(), available);
            available = diffArray(available, available_pri);
            break;
          }
        }
      }

      // 同じLineをループ
      while (note.getPos() == old_pos) {
        // 利用可能に配置 配置場所を記録 なければ26+ 削除も
        var ret; // 配置場所
        // 配置場所決定
        if (available.length != 0) {
          // 優先あれば
          if (available_pri.length != 0) {
            var n = available_pri.length;
            var rand = Math.floor(Math.random() * n);
            ret = available_pri[rand];
            available_pri.splice(rand, 1);

            // なければ
          } else {
            var n = available.length;
            var rand = Math.floor(Math.random() * n);
            ret = available[rand];
            available.splice(rand, 1);
          }

          used_ary.push(ret);

          // 超えた
        } else {
          if (tate_ganbaru) {
            koeta = true;
            turami++;
            // if (turami % 100 == 0) {
            //    $("#turami").text(turami);
            // }
          }
          ret = over;
          over++;
        }

        note.setCh(ret);

        _str += note.getStr() + '\n';

        i++;
        if (i >= stra.length) {
          break;
        }
        note = new Note(stra[i]);
      }

      lines.push(new Line(old_pos, used_ary));

      if (koeta) {
        _str = 'iBMSC Clipboard Data xNT\n';
        lines = [];
        note = new Note(stra[1]); // 初期化忘れずに
        old_pos = note.getPos(); // 初期化忘れずに
        i = 1;
        koeta = false;
      }

      if (turami > 100000) {
        _str = 'tintin';
        break;
      }
    }

    $('#turami').text(turami);
    $('#p_out').val(_str);
  });

  $('#mitudo_btn').click(function() {
    make_dens_table(parse_clip($('#mitudo_clip').val()));
  });

  $('#mpb').change(function() {
    app_bar();
  });

  $('#left_convert').click(function() {
    var stra = $('#left_clip')
      .val()
      .split(/\r\n|\r|\n/);
    var _str = 'iBMSC Clipboard Data xNT\n';
    var left_n = $('#left_n').val();

    var note = new Note(stra[1]);

    var old_pos = note.getPos();

    var ch = 26;

    var ch_ = 57;

    for (var i = 1; i < stra.length; i++) {
      note = new Note(stra[i]);

      if (note.getPos() != old_pos) {
        ch = 26;
        ch_ = 57;
      }

      if (note.getPos() % left_n == 0) {
        note.setCh(ch);
        ch++;
      } else {
        note.setCh(ch_);
        ch_--;
      }

      old_pos = note.getPos();

      _str += note.getStr() + '\n';
    }

    $('#left_out').val(_str);
  });

  $('#bt6_convert').click(function() {
    var stra = $('#bt6_clip')
      .val()
      .split(/\r\n|\r|\n/);
    var bpm = Number($('#bt6_bpm').val());
    var speed = Number($('#bt6_speed').val());
    var start = Number($('#bt6_start').val());
    var delay = Number($('#bt6_delay').val());
    var start_time = start * 192;
    var h_time = 60 / bpm / 48;
    var out_str = '';

    for (var i = 1; i < stra.length; i++) {
      var note = new Note(stra[i]);
      var out_arr = new Array(4);

      var sec = h_time * (Number(note.getPos()) + start_time + delay);
      // sec = Math.round(sec*100);

      out_arr[0] = sec; // / 100;

      if (note.getObj() == '10000') {
        out_arr[1] = 'enemy';
      } else {
        out_arr[1] = 'friend';
      }

      if (note.getCh() == '5') {
        out_arr[2] = 'L';
      } else if (note.getCh() == '7') {
        out_arr[2] = 'D';
      } else if (note.getCh() == '9') {
        out_arr[2] = 'U';
      } else {
        out_arr[2] = 'R';
      }

      out_arr[3] = speed;

      console.log(out_arr);

      out_str +=
        '\n\t\t[' +
        out_arr[0] +
        ', "' +
        out_arr[1] +
        '", "' +
        out_arr[2] +
        '", ' +
        out_arr[3] +
        '],';
    }

    $('#bt6_out').val(out_str);
  });

  var clipboard = new Clipboard('#p_copy');
  var clipboard = new Clipboard('#left_copy');
  var clipboard = new Clipboard('#bt6_cpy');
});
