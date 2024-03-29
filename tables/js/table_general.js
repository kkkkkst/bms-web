var SABUN_DL_STR = "DL";
var table_data = "";

function createTable() {
  $("#difficulty_table").DataTable({
    lengthChange:
      typeof dtLengthChange === "undefined" ? false : dtLengthChange,
    info: typeof dtInfo === "undefined" ? false : dtInfo,
    paging: typeof dtPaging === "undefined" ? false : dtPaging,
    pageLength: typeof dtPageLength === "undefined" ? 200 : dtPageLength,
    scrollX: typeof dtScrollX === "undefined" ? true : dtScrollX,
    scrollY: typeof dtScrollY === "undefined" ? "85vh" : dtScrollY,

    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Japanese.json"
    },

    ajax: {
      url: table_data,
      dataSrc: ""
    },

    columns:
      typeof table_columns === "undefined" ? DEFAULT_COLUMNS : table_columns,

    createdRow: function(row, data) {
      if (data.state == 1) {
        $(row).addClass("new");
      }
      if (data.state == 2) {
        $(row).addClass("update");
      }
      if (data.state == 5) {
        $(row).addClass("deprecated");
      }
    },

    initComplete: function() {
      if (typeof loadTableDataHandler !== "undefined") {
        loadTableDataHandler();
      }

      var colLevel = this.api().column(0);

      var select = $(
        '<div class="dataTables_length">レベルでフィルタ: <select><option value="">All</option></select></div>'
      )
        .prependTo($("#difficulty_table_wrapper"))
        .on("change", function() {
          var val = $.fn.dataTable.util.escapeRegex(
            $(this)
              .find("select")
              .val()
          );
          colLevel.search(val ? "^" + val + "$" : "", true, false).draw();
        });

      colLevel
        .data()
        .unique()
        .sort(function(a, b) {
          return parseInt(a) - parseInt(b);
        })
        .each(function(d, j) {
          select
            .find("select")
            .append('<option value="' + d + '">' + d + "</option>");
        });
    }
  });
}

$(document).ready(function() {
  $.getJSON($("meta[name=bmstable]").attr("content"), function(header) {
    if (typeof isManualLoad === "undefined") {
      table_data = header.data_url;
      createTable();
    }
  });
});

var ParseData = {
  parseTitle: function(data, type, row) {
    var link =
      "http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=";
    link += row.md5;
    return '<a href="' + link + '" target="_blank">' + data + "</a>";
  },

  parseArtist: function(data, type, row) {
    var astr = "";

    if (row.url) {
      if (row.artist) {
        astr =
          "<a href='" + row.url + "' target='_blank'>" + row.artist + "</a>";
      } else {
        astr = "<a href='" + row.url + "' target='_blank'>" + row.url + "</a>";
      }
    } else {
      if (row.artist) {
        astr = row.artist;
      }
    }

    if (row.url_pack) {
      if (row.name_pack) {
        astr +=
          "<br />(<a href='" +
          row.url_pack +
          "' target='_blank'>" +
          row.name_pack +
          "</a>)";
      } else {
        astr +=
          "<br />(<a href='" +
          row.url_pack +
          "' target='_blank'>" +
          row.url_pack +
          "</a>)";
      }
    } else {
      if (row.name_pack) {
        astr += "<br />(" + row.name_pack + ")";
      }
    }
    return astr;
  },

  parseSabun: function(data, type, row) {
    var str_ = "";

    if (row.url_diff) {
      if (row.name_diff) {
        str_ +=
          "<a href='" +
          row.url_diff +
          "' target='_blank'>" +
          row.name_diff +
          "</a>";
      } else {
        str_ +=
          "<a href='" +
          row.url_diff +
          "' target='_blank'>" +
          SABUN_DL_STR +
          "</a>";
      }
    } else {
      if (row.name_diff) {
        str_ += row.name_diff;
      }
    }
    return str_;
  },

  parseDate: function(data) {
    var str_ = "";
    if (data) {
      var date_ = new Date(data);
      str_ =
        date_.getFullYear() +
        "/" +
        (date_.getMonth() + 1) +
        "/" +
        date_.getDate();
    }
    return str_;
  },

  parseTotalnotes: function(data, type, row) {
    var str_ = "";
    if (row.total && row.notes) {
      str_ +=
        row.total +
        " / " +
        row.notes +
        "<br>" +
        Math.floor((row.total / row.notes) * 1000) / 1000;
    }
    return str_;
  },

  parseType: function(data, type, row) {
    var str_ = "";
    if (row.score_type) {
      var link = "http://www.ribbit.xyz/bms/score/view?md5=";
      link += row.md5;
      str_ = '<a href="' + link + '" target="_blank">' + data + "</a>";
    }
    return str_;
  },

  parseComment: function(data, type, row) {
    return row.comment || "";
  }
};

var DEFAULT_COLUMNS = [
  {
    title: "level",
    data: "level",
    type: "natural"
  },
  {
    title: "タイトル<br>(LR2IR)",
    data: "title",
    render: ParseData.parseTitle
  },
  {
    title: "アーティスト<br>(本体URL)",
    data: "artist",
    render: ParseData.parseArtist
  },
  {
    title: "差分",
    render: ParseData.parseSabun,
    orderable: false
  },
  {
    title: "コメント",
    render: ParseData.parseComment
  }
];