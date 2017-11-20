$(document).ready(function(){
    $.getJSON($("meta[name=bmstable]").attr("content"), function(header){
        $.getJSON(header.data_url, function(information){
            makeBMSTable(information,header.symbol);
        });
    });
});

function makeBMSTable(info, mark) {
    var x = "";
    var ev = "";
    var count = 0;
    var obj = $("#table_int");
    // 表のクリア
    obj.html("");
    $("<tr height='20' style='color:white;background-color:#666666'><td align='center'>level</td><td align='center'>タイトル</td><td align='center'>アーティスト</td><td align='center'>差分</td><td align='center'>コメント</td></tr>").appendTo(obj);
    var obj_sep = null;
    for (var i = 0; i < info.length; i++) {
        // 難度ごとの区切り
        if (x != info[i].level) {
            // 前の区切りに譜面数、平均密度を追加
            if (obj_sep != null) {
                obj_sep.html("<td colspan='6' align='center'>" + "<b>" + mark + x + " (" + count + "譜面)</b></td>");
            }
            obj_sep = $("<tr class='tr_separate' id='" + mark + info[i].level + "'></tr>");
            obj_sep.appendTo(obj);
            count = 0;
            x = info[i].level;
        }
        // 本文
        var str = $("<tr class='tr_normal'></tr>");
        if(info[i].state == 1) {
            str = $("<tr class='tr_new'></tr>");
        }
        if(info[i].state == 2) {
            str = $("<tr class='tr_update'></tr>");
        }
        // レベル表記
        $("<td width=2%'>" + mark + x + "</td>").appendTo(str);
        // タイトル
        $("<td width='40%'>" + "<a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + info[i].md5 + "' target='_blank'>" + info[i].title + "</a></td>").appendTo(str);
        // アーティスト
        var astr = "";
        if(info[i].url != null) {
            if(info[i].artist != null) {
                astr = "<a href='" + info[i].url + "'>" + info[i].artist + "</a>";
            } else {
                astr = "<a href='" + info[i].url + "'>" + info[i].url + "</a>";
            }
        } else {
            if(info[i].artist != null) {
                astr = info[i].artist;
            }
        }
        if(info[i].url_pack != null) {
            if(info[i].name_pack != null) {
                astr += "<br />(<a href='" + info[i].url_pack + "'>" + info[i].name_pack + "</a>)";
            } else {
                astr += "<br />(<a href='" + info[i].url_pack + "'>" + info[i].url_pack + "</a>)";
            }
        } else {
            if(info[i].name_pack != null) {
                astr += "<br />(" + info[i].name_pack + ")";
            }
        }
        $("<td width='18%'>" + astr + "</td>").appendTo(str);
        // 差分
        if(info[i].url_diff != null) {
            if(info[i].name_diff != null) {
                $("<td width='10%'><a href='" + info[i].url_diff + "'>" + info[i].name_diff + "</a></td>").appendTo(str);
            } else {
                $("<td width='10%'><a href='" + info[i].url_diff + "'>" + "差分" + "</a></td>").appendTo(str);
            }
        } else {
            if(info[i].name_diff != null) {
                $("<td width='10%'>" + info[i].name_diff + "</td>").appendTo(str);
            } else {
                $("<td width='10%'></td>").appendTo(str);
            }
        }
        // コメント
        $("<td width='30%'>" + info[i].comment + "</td>").appendTo(str);
        str.appendTo(obj);
        count++;
    }
    // 最後の区切り処理
    if (obj_sep != null) {
        obj_sep.html("<td colspan='6' align='center'>" + "<b>" + mark + x + " (" + count + "譜面)</b></td>");
    }
}
