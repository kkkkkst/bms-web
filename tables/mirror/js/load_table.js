var table_data = 'data.json';
var table_columns = [
  {
    title: 'level',
    data: 'level',
    type: 'natural',
  },
  {
    title: 'タイトル<br>(LR2IR)',
    data: 'title',
    // width: '25%',
    render: ParseData.parseTitle,
  },
  {
    title: 'アーティスト<br>(本体URL)',
    data: 'artist',
    // width: '15%',
    render: ParseData.parseArtist,
  },
  {
    title: '差分',
    render: ParseData.parseSabun,
    orderable: false,
  },
  {
    title: 'コメント',
    render: ParseData.parseComment,
  },
];

$(document).ready(function() {
  $.getJSON('header.json', function(header) {
    $('title').text(header.name);
    $('#table_title').text(header.name);
    $('#original_url').text('オリジナル: ' + header.name);
    $('#original_url').attr('href', header.original_url);
  });
});
