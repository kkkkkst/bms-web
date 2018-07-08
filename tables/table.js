$(document).ready(function(){

    var $load = $('<p id="t_load">難易度表をロード中...</p>');

    $("#table_int").before($load);

    $.getJSON($("meta[name=bmstable]").attr("content"), function(header){
        $.getJSON(header.data_url, function(information){
            makeBMSTable(information,header.symbol);
            $load.hide();
        });
    });
});

function object_array_sort(data,key,order,fn){
    //デフォは降順(DESC)
    var num_a = -1;
    var num_b = 1;

    var arr = [];

    if(order === 'asc'){//指定があれば昇順(ASC)
        num_a = 1;
        num_b = -1;
    }

    data = data.sort(function(a, b){
        var x;
        var y;
        if(isNaN(Number(a[key]))){
            if (arr.indexOf(a[key]) == -1){
                arr.push(a[key]);
            }
            x = 999 + arr.indexOf(a[key]);
        }else{
            x = Number(a[key]);
        }

        if(isNaN(Number(b[key]))){
            if (arr.indexOf(b[key]) == -1){
                arr.push(b[key]);
            }
            y = 999 + arr.indexOf(b[key]);
        }else{
            y = Number(b[key]);
        }

        if (x > y) return num_a;
        if (x < y) return num_b;
        return 0;
    });

    fn(data); // ソート後の配列を返す
}

function makeBMSTable(info, mark) {
    var x = "";
    var ev = "";
    var count = 0;
    var obj = $("#table_int");
    //難易度でソートする
    object_array_sort(info, 'level', 'asc', function(){});
    // 表のクリア
    obj.html("");
    $("<tr style='color:white;background-color:#666666'><td align='center'>level</td><td align='center'>タイトル</td><td align='center'>アーティスト</td><td align='center'>差分</td><td align='center'>コメント</td></tr>").appendTo(obj);
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
        if(info[i].state == 3) {
            str = $("<tr class='tr_deprecated'></tr>");
        }
        // レベル表記
        $("<td width=5%'>" + mark + x + "</td>").appendTo(str);
        // タイトル
        $("<td width='30%'>" + "<a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + info[i].md5 + "' target='_blank'>" + info[i].title + "</a></td>").appendTo(str);
        // アーティスト
        var astr = "";
        if(info[i].url) {
            if(info[i].artist) {
                astr = "<a href='" + info[i].url + "'>" + info[i].artist + "</a>";
            } else {
                astr = "<a href='" + info[i].url + "'>" + info[i].url + "</a>";
            }
        } else {
            if(info[i].artist) {
                astr = info[i].artist;
            }
        }
        if(info[i].url_pack) {
            if(info[i].name_pack) {
                astr += "<br />(<a href='" + info[i].url_pack + "'>" + info[i].name_pack + "</a>)";
            } else {
                astr += "<br />(<a href='" + info[i].url_pack + "'>" + info[i].url_pack + "</a>)";
            }
        } else {
            if(info[i].name_pack) {
                astr += "<br />(" + info[i].name_pack + ")";
            }
        }
        $("<td width='30%'>" + astr + "</td>").appendTo(str);
        // 差分
        if(info[i].url_diff) {
            if(info[i].name_diff) {
                $("<td width='5%'><a href='" + info[i].url_diff + "'>" + info[i].name_diff + "</a></td>").appendTo(str);
            } else {
                $("<td width='5%'><a href='" + info[i].url_diff + "'>" + "差分" + "</a></td>").appendTo(str);
            }
        } else {
            if(info[i].name_diff) {
                $("<td width='5%'>" + info[i].name_diff + "</td>").appendTo(str);
            } else {
                $("<td width='5%'></td>").appendTo(str);
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
