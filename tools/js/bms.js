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
    sound_ch: /01|[1-6][A-Za-z1-9]/
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
}

class BmsHeaders{
    constructor(){
        this.headers = [];
        this.wavs = [];
        this.filenames = [];
        this.title = "";
        this.artist = "";
    }

    push(header, value){
        var m;
        this.headers.push(new BmsHeader(header, value));
        if(header === "TITLE") this.title = value;
        if(header === "ARTIST") this.artist = value;
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
    constructor(bar, numer, denom, value, ch){
        this.bar = bar;
        this.numer = numer;
        this.denom = denom;
        this.value = value;
        this.ch = ch;
    }
}

class BmsChs{
    constructor(){
        this.chs = [];
        this.sound_chs = [];
    }

    push(bar, ch, string){
        var items = Math.floor(string.length / 2);
        if (items === 0) return;

        if(ch.match(command_matchers.sound_ch)){
            for (var i = 0; i < items; i++) {
                var value = string.substr(i * 2, 2);
                if (value === '00') continue;
                this.sound_chs.push(new BmsSoundCh(bar, i, items, value, ch));
              }
        }else{
            this.chs.push(new BmsCh(bar, ch, string));
        }
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
    }

    getSoundFilenames(){
        return this.headers.getSoundFilenames();
    }

}