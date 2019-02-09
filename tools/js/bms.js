// bmsコンパイル時にレーン考慮したほうが良いのでは？？？？？？

var bms_matchers = {
    //random: /^#RANDOM\s+(\d+)$/i,
    //if: /^#IF\s+(\d+)$/i,
    //endif: /^#ENDIF$/i,
    //time_signature: /^#(\d\d\d)02:(\S*)$/,
    channel: /^#(?:EXT\s+#)?(\d\d\d)(\S\S):(\S*)$/,
    header: /^#(\w+)(?:\s+(\S.*))?$/
};

var command_matchers = {
    wavxx: /WAV(\w\w)/i,
    sound_ch: /01|[1-6][1-9]/,
    invisible_ch: /[3-4][1-9]/,
    long_ch: /[5-6][1-9]/,
};

var sound_chs = ["01", ""];

class BmsHeader{
    constructor(header, value){
        this.header = header;
        this.value = value;
    }
}

class HeaderWavxx{
    constructor(ch, filename){
        this.ch = ch;
        this.filename = filename;
    }

    match(reg){
        return !!this.filename.match(reg);
    }
}

class BmsHeaders{
    constructor(){
        this.headers = [];
        this.wavs = [];
        this.filenames = [];
        this.title = "";
        this.artist = "";
        this.lnobj;
    }

    push(header, value){
        var m;
        this.headers.push(new BmsHeader(header, value));
        if(header === "TITLE") this.title = value;
        if(header === "ARTIST") this.artist = value; 
        if(header === "LNOBJ") this.lnobj = value; 
        if(m = header.match(command_matchers.wavxx)){
            this.wavs.push(new HeaderWavxx(m[1], value));
            this.filenames.push(value);
        }
    }

    getSoundFilenames(){
        return this.filenames;
    }
}

class BmsCh{
    constructor(bar, ch, string){
        this.bar = bar;
        this.ch = ch;
        this.string = string;
    }
}

class BmsSoundCh{
    constructor(bar, numer, denom, value, ch, is_ln_end){
        this.bar = bar;
        this.numer = numer;
        this.denom = denom;
        this.value = value;
        this.ch = ch;
    }

    matchValueForList(wavs){
        return wavs.some(wav => this.value === wav.ch);
    }
}

class LnEndMgr{
    constructor(){
        this.ln_end = new Array(2).fill(new Array(10).fill(false));
    }

    isLnEnd(ch){
        if(ch.match(command_matchers.long_ch)){
            if(this.ln_end[ch[0]-5][ch[1]]){
                this.ln_end[ch[0]-5][ch[1]] = false;
                return true;
            }else{
                this.ln_end[ch[0]-5][ch[1]] = true;
                return false;
            }
        }
        return false;
    }
}

class BmsChs{
    constructor(){
        this.chs = [];
        this.sound_chs = [];
        this.ln_end = new LnEndMgr();
    }

    push(bar, ch, string){
        var items = Math.floor(string.length / 2);
        if (items === 0) return;

        if(ch.match(command_matchers.sound_ch)){
            for (var i = 0; i < items; i++) {
                var value = string.substr(i * 2, 2);
                if (value === '00') continue;
                var is_ln_end = this.ln_end(ch);
                this.sound_chs.push(new BmsSoundCh(bar, i, items, value, ch, is_ln_end));
              }
        }else{
            this.chs.push(new BmsCh(bar, ch, string));
        }
    }

    sortSoundCh(){
        this.sound_chs.sort(function(a, b){
            (a.bar + (a.numer / a.denom)) - (b.bar + (b.numer / b.denom));
        });
    }

    removeInvisibleNote(){
        this.sound_chs = this.sound_chs.filter(ch => !ch.ch.match(command_matchers.invisible_ch));
    }

    removeLongNote(lnobj){
        if(!lnobj) lnobj = "none";

        // LNOBJの削除
        this.sound_chs = this.sound_chs.filter(ch => !ch.value.match(lnobj));

        // #xxx51-69 の終端を削除
        var is_sp = false;
        this.sound_chs = this.sound_chs.filter(ch => {
            if(ch.ch.match(command_matchers.long_ch)){
                is_sp = !is_sp;
                if(is_sp){
                    return true;
                }else{
                    return false;
                }
            }else{
                return true;
            }
            
        });

        // #xxx51-69 => #xxx11-29
        this.sound_chs = this.sound_chs.map(ch => {
            if(ch.ch.match(command_matchers.long_ch)){
                return "" + (ch.ch[0]-4) + ch.ch[1];
            }
            return ch;
        });
    }

    sortObj(wavs, regs, is_space){
        var new_sound_chs = [];
        var not_match_wavs = wavs;
        var lanes = [];
        regs.forEach(reg => {
            var match_wavs = not_match_wavs.filter( wav => wav.match(reg));
            not_match_wavs = not_match_wavs.filter( wav => !wav.match(reg));

            var match_sound_chs = this.sound_chs.filter( ch => ch.matchValueForList(match_wavs));
            var width = 1;
            match_sound_chs.forEach(ch => {
                
            });



            new_sound_chs = new_sound_chs.concat()
        });
    }
}

class Bms{
    constructor(raw_text){
        this.raw_text = raw_text;
        this.headers = new BmsHeaders();
        this.chs = new BmsChs();

        var bms_lines = raw_text.split(/\r\n|\r|\n/);
        var m;

        bms_lines.forEach(line => {
            line = line.trim();
            if(line.charAt(0) !== "#") return;

            if(m = line.match(bms_matchers.channel)){
                this.chs.push(+m[1], m[2], m[3]);
            }
            else if(m = line.match(bms_matchers.header)){
                this.headers.push(m[1], m[2]);
            }
        });

        this.chs.sortSoundCh();
    }

    getSoundFilenames(){
        return this.headers.getSoundFilenames();
    }

    removeInvisibleNote(){
        this.chs.removeInvisibleNote();
    }

    removeLongNote(){
        this.chs.removeLongNote(this.headers.lnobj);
    }

    sortObj(regs, is_space){
        this.chs.sortObj(this.headers.wavs, regs, is_space);
    }

}

function loadBmsFromFile(f, callback){
    var reader = new FileReader();
    reader.readAsText(f, "sjis");
    reader.onload = function(e){	
        var bms_text = e.target.result;	
        callback(new Bms(bms_text));
    }
}