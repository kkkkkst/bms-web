$(document).ready(function() {
  $("#tableList").DataTable({
    lengthChange: true,
    info: false,
    paging: false,
    scrollX: false,
    order: [[0, "asc"], [2, "asc"]],

    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Japanese.json"
    },

    ajax: {
      url:
        "https://script.google.com/macros/s/AKfycbxMG5jqTHVZqSqE3dNkvc-QUcgm1-soiy0xMOJQn0ycCy2ZBGiy/exec?tablename=tablelist",
      dataSrc: ""
    },

    columns: [
      {
        title: "タイプ",
        data: "type",
        orderData: [1]
      },
      {
        title: "ot",
        data: "type_order",
        visible: false
      },
      {
        title: "差分公開サイト",
        data: "name",
        render: function(data, type, row) {
          return '<a href="' + row.url + '" target="_blank">' + data + "</a>";
        }
      },
      {
        title: "管理人",
        data: "administrator"
      },
      {
        title: "難易度表 (json)",
        data: "name_table",
        render: function(data, type, row) {
          return (
            '<a href="' + row.url_table + '" target="_blank">' + data + "</a>"
          );
        }
      },
      {
        title: "ミラー",
        data: "name_mirror",
        render: function(data, type, row) {
          return (
            '<a href="' + row.url_mirror + '" target="_blank">' + data + "</a>"
          );
        }
      },
      {
        title: "備考",
        data: "note"
      }
    ]
  });
});
