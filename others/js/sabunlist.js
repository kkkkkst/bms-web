jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "non-empty-string-asc": function(str1, str2) {
    if (str1 == "") return 1;
    if (str2 == "") return -1;
    return str1 < str2 ? -1 : str1 > str2 ? 1 : 0;
  },

  "non-empty-string-desc": function(str1, str2) {
    if (str1 == "") return 1;
    if (str2 == "") return -1;
    return str1 < str2 ? 1 : str1 > str2 ? -1 : 0;
  }
});

$(document).ready(function() {
  $("#tableList").DataTable({
    lengthChange: true,
    info: false,
    paging: false,
    scrollX: false,
    order: [[0, "asc"], [3, "asc"], [1, "asc"]],

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
        data: {
          _: "type",
          sort: "type_order",
          display: "type"
        }
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
        type: "non-empty-string",
        data: "administrator"
      },
      {
        title: "難易度表 (json)",
        type: "non-empty-string",
        data: function(row, type, set, meta) {
          if (type === "display") {
            return (
              '<a href="' +
              row.url_table +
              '" target="_blank">' +
              row.name_table +
              "</a>"
            );
          } else if (type === "sort") {
            return row.name_table;
          }
          return row.name_table;
        }
      },
      {
        title: "ミラー",
        type: "non-empty-string",
        data: function(row, type, set, meta) {
          if (type === "display") {
            return (
              '<a href="' +
              row.url_mirror +
              '" target="_blank">' +
              row.name_mirror +
              "</a>"
            );
          } else if (type === "sort") {
            return row.name_mirror;
          }
          return row.name_mirror;
        }
      },
      {
        title: "備考",
        type: "non-empty-string",
        data: "note"
      }
    ]
  });
});
