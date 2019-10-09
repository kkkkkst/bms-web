$(document).ready(function() {
  $("#convertTableList").DataTable({
    lengthChange: false,
    info: false,
    paging: false,
    order: [1, "asc"],

    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Japanese.json"
    },

    ajax: {
      url: "list.json",
      dataSrc: ""
    },

    columns: [
      {
        title: "★",
        data: "symbol"
      },
      {
        title: "差分公開サイト<br>(変換後ページ)",
        data: "name",
        render: function(data, type, row) {
          return '<a href="' + row.url + '" target="_blank">' + data + "</a>";
        }
      },
      {
        title: "変換元",
        data: "original_url",
        render: function(data, type, row) {
          return '<a href="' + data + '" target="_blank">変換元</a>';
        }
      },
      {
        title: "更新日（変換）",
        data: "update"
      }
    ]
  });

  new ClipboardJS("#cotCopy");

  $("#cotExec").click(function() {
    var url =
      "https://script.google.com/macros/s/AKfycbxMG5jqTHVZqSqE3dNkvc-QUcgm1-soiy0xMOJQn0ycCy2ZBGiy/exec?convoldtable=" +
      encodeURI($("#cotName").val()) +
      "&url=" +
      encodeURI($("#cotUrl").val()) +
      "&symbol=" +
      encodeURI($("#cotSymbol").val()) +
      "&encode=" +
      encodeURI($("#cotEncode").val());
    $("#cotOutput").val(url);
  });

  $(".cotAutoSelect").focus(function() {
    $(this).select();
  });
});
