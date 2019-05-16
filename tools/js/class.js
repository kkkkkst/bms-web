/* eslint-disable camelcase */
var Note = function(str) {
  _a = str.split(' ');
  this.ch = _a[0];
  this.pos = _a[1];
  this.obj_num = _a[2];
};

Note.prototype.setCh = function(_ch) {
  this.ch = _ch;
  this.over = 26;
};

Note.prototype.getPos = function() {
  return this.pos;
};

Note.prototype.getObj = function() {
  return this.obj_num;
};

Note.prototype.getCh = function() {
  return this.ch;
};

Note.prototype.getStr = function() {
  return this.ch + ' ' + this.pos + ' ' + this.obj_num + ' 0 0';
};

var Line = function(_pos, _use) {
  this.pos = _pos;
  this.use = _use;
};

Line.prototype.getPos = function() {
  return this.pos;
};

Line.prototype.getUse = function() {
  return this.use;
};

var Bar = function(_tate, _posdiff) {
  this.tate = _tate;
  this.chlist = [5, 6, 7, 8, 9, 10, 11];
  this.use = [5, 6, 7, 8, 9, 10, 11];
  this.his1 = [];
  this.his2 = [];
  this.pos = 0;
  this.posdiff = _posdiff;
};

Bar.prototype.getCh = function() {
  var ret;
  if (this.chlist.length != 0) {
    var n = this.chlist.length;
    var rand = Math.floor(Math.random() * n);
    ret = this.chlist[rand];
    this.chlist.splice(rand, 1);

    var idx = this.use.indexOf(ret);
    if (idx >= 0) {
      this.use.splice(idx, 1);
    }

    this.his1.push(ret);
  } else {
    ret = this.over;
    this.over = this.over + 1;
  }

  return ret;
};

Bar.prototype.next = function(new_pos) {
  if (this.tate == 1) {
    this.chlist = [5, 6, 7, 8, 9, 10, 11];
  } else if (this.tate == 0) {
    var __n = Number(this.pos) + Number(this.posdiff);
    if (__n <= new_pos) {
      // 縦OK
      this.chlist = [5, 6, 7, 8, 9, 10, 11];
    } else {
      this.chlist = this.use;
    }
  } else {
    var _use = [5, 6, 7, 8, 9, 10, 11];
    for (var i = 0; i < this.his1.length; i++) {
      if (this.his2.indexOf(this.his1[i]) >= 0) {
        var idx = _use.indexOf(this.his1[i]);
        if (idx >= 0) {
          _use.splice(idx, 1);
        }
      }
    }
    this.chlist = _use;
  }
  this.over = 26;
  this.use = [5, 6, 7, 8, 9, 10, 11];
  this.his2 = this.his1;
  this.his1 = [];
  this.pos = new_pos;
};

function diffArray(arr1, arr2) {
  var newArr = [];
  for (var a = 0; a < arr1.length; a++) {
    if (arr2.indexOf(arr1[a]) === -1) {
      newArr.push(arr1[a]);
    }
  }
  for (var b = 0; b < arr2.length; b++) {
    if (arr1.indexOf(arr2[b]) === -1) {
      newArr.push(arr2[b]);
    }
  }
  return newArr;
}

function diffArrayOverlap(arr1, arr2) {
  var newArr = [];

  for (var a = 0; a < arr1.length; a++) {
    if (arr2.indexOf(arr1[a]) != -1) {
      newArr.push(arr1[a]);
    }
  }

  return newArr;
}

function app_bar() {
  var mpb = $('#mpb').val();

  $('#m2').val(mpb / 2);
  $('#m4').val(mpb / 4);
  $('#m8').val(mpb / 8);
  $('#m16').val(mpb / 16);
}

var C_Note = function(_ch, _obj_num) {
  this.ch = _ch;
  this.obj_num = _obj_num;
};

var C_Line = function(_pos, _notes) {
  this.pos = Number(_pos);
  this.notes = _notes;
};

C_Line.prototype.getPos = function() {
  return this.pos;
};

C_Line.prototype.getLength = function() {
  return this.notes.length;
};

var C_Clip = function(lines) {
  this.lines = lines;
};

C_Clip.prototype.getLength = function() {
  return this.lines.length;
};

C_Clip.prototype.getPos = function(index) {
  return this.lines[index].getPos();
};

C_Clip.prototype.getDens = function(index) {
  return this.lines[index].getLength();
};

function parse_clip(str) {
  var a_str = str.split(/\r\n|\r|\n/);
  var a_notes = [];
  for (var i = 1; i < a_str.length; i++) {
    a_notes.push(new Note(a_str[i]));
  }

  var old_pos = a_notes[0].getPos();
  var c_notes = [];
  var c_lines = [];

  for (var i = 0; i < a_notes.length; i++) {
    if (old_pos != a_notes[i].getPos()) {
      c_lines.push(new C_Line(old_pos, c_notes));
      old_pos = a_notes[i].getPos();
      c_notes = [];
    }

    c_notes.push(new C_Note(a_notes[i].getCh(), a_notes[i].getObj()));
  }

  if (c_notes.length > 0) {
    c_lines.push(new C_Line(old_pos, c_notes));
  }

  // c_lines.sort(function (a, b) {
  //    if (a.getPos() < b.getPos()) return -1;
  //    if (a.getPos() > b.getPos()) return 1;
  //    return 0;
  // });

  // for (var i = 0; i < c_lines.length; i++) {
  //    console.log(c_lines[i].getPos());
  // }

  var c_clip = new C_Clip(c_lines);

  return c_clip;
}

function make_dens_table(c_clip) {
  var a_dens = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var ary = [];
  var mes = 1;

  for (var i = 0; i < c_clip.getLength(); i++) {
    while (c_clip.getPos(i) >= 192 * mes) {
      ary.push(a_dens);
      a_dens = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      mes++;
    }

    var n = Math.floor(c_clip.getPos(i) / 12) % 16;
    a_dens[n] += c_clip.getDens(i);
  }

  ary.push(a_dens);

  var $div_base = $('<div>');
  var mes = Number($('#mitudo_mes').val());
  var ave_n = 0;
  var ave_sigma = 0;

  for (var i = 0; i < ary.length; i++) {
    var $div = $('<div style="margin-top: 10px;">');

    $div.append($('<div>').text('#' + ('000' + mes).slice(-3)));

    $div.append(
      $('<div>').text(
        String(ary[i][0]) +
          String(ary[i][1]) +
          String(ary[i][2]) +
          String(ary[i][3]) +
          ' ' +
          String(ary[i][4]) +
          String(ary[i][5]) +
          String(ary[i][6]) +
          String(ary[i][7]) +
          ' ' +
          String(ary[i][8]) +
          String(ary[i][9]) +
          String(ary[i][10]) +
          String(ary[i][11]) +
          ' ' +
          String(ary[i][12]) +
          String(ary[i][13]) +
          String(ary[i][14]) +
          String(ary[i][15])
      )
    );

    $div.append(
      $('<div>').text(
        String(ary[i][0] + ary[i][1]) +
          String(ary[i][2] + ary[i][3]) +
          ' ' +
          String(ary[i][4] + ary[i][5]) +
          String(ary[i][6] + ary[i][7]) +
          ' ' +
          String(ary[i][8] + ary[i][9]) +
          String(ary[i][10] + ary[i][11]) +
          ' ' +
          String(ary[i][12] + ary[i][13]) +
          String(ary[i][14] + ary[i][15])
      )
    );

    $div.append(
      $('<div>').text(
        String(ary[i][0] + ary[i][1] + ary[i][2] + ary[i][3]) +
          ' ' +
          String(ary[i][4] + ary[i][5] + ary[i][6] + ary[i][7]) +
          ' ' +
          String(ary[i][8] + ary[i][9] + ary[i][10] + ary[i][11]) +
          ' ' +
          String(ary[i][12] + ary[i][13] + ary[i][14] + ary[i][15])
      )
    );

    $div.append(
      $('<div>').text(
        String(
          ary[i][0] +
            ary[i][1] +
            ary[i][2] +
            ary[i][3] +
            ary[i][4] +
            ary[i][5] +
            ary[i][6] +
            ary[i][7]
        ) +
          ' ' +
          String(
            ary[i][8] +
              ary[i][9] +
              ary[i][10] +
              ary[i][11] +
              ary[i][12] +
              ary[i][13] +
              ary[i][14] +
              ary[i][15]
          )
      )
    );

    var all =
      ary[i][0] +
      ary[i][1] +
      ary[i][2] +
      ary[i][3] +
      ary[i][4] +
      ary[i][5] +
      ary[i][6] +
      ary[i][7] +
      ary[i][8] +
      ary[i][9] +
      ary[i][10] +
      ary[i][11] +
      ary[i][12] +
      ary[i][13] +
      ary[i][14] +
      ary[i][15];

    $div.append($('<div>').text(String(all)));

    $div_base.append($div);

    mes++;
    ave_n++;
    ave_sigma += all;
  }

  $div_base.prepend(
    $('<div style="margin-top: 10px;">').text(ave_sigma / ave_n + ' n/mes')
  );
  $('#mitudo_result').text('');
  $('#mitudo_result').append($div_base);
}
