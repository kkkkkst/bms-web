var bms_file;
var bms;
var sound_files;

var $input;
var $ifile;
var $append;
var $files;
var $match_files;
var $regs;
var $del;

class SoundFileList {
    constructor(filelist){
        this.all = filelist;
        this.not_match = filelist;
        this.regs = [];
        this.str_regs = [];
    }

    addReg(reg){
        this.regs.push(reg);
        this.str_regs.push(reg.source);
        this.not_match = this.all;
        this.regs.forEach(reg => {
            this.not_match = this.not_match.filter(file => !file.match(reg));
        });
    }

    delReg(index){
        this.regs.splice(index, 1);
        this.str_regs.splice(index, 1);
        this.not_match = this.all;
        this.regs.forEach(reg => {
            this.not_match = this.not_match.filter(file => !file.match(reg));
        });
    }

    getMatchFilenames(reg){
        return this.not_match.filter(file => file.match(reg))
    }
}

$(function(){

    setJqobj();
    addEvent();

});

function setJqobj(){
    $input = $("#in_reg");
    $append = $("#btn_append");
    $files = $("#slc_sound_files");
    $match_files = $("#slc_sound_files_matched");
    $regs = $("#slc_regs");
    $ifile = $("#in_file");
    $del = $("#btn_delreg");
}

function addEvent(){
    document.addEventListener("drop",function(e){
        e.preventDefault();

        var filelist = e.dataTransfer.files;
        if(filelist.length < 1) return;
        var f = filelist[0];
        if(f.name.toLowerCase().match(/.*\.[bp]m[sel]/)){
            loadBms(f);
        }
	},true);
     
    document.addEventListener("dragover",function(event){
        event.preventDefault();
    },true);

    $input.on("input", updateMatchList);
    $append.click(addRegs);
    $input.keypress(function(e){
        if (e.which == 13) {
            $append.click();
        }
    });
    $files.change(function() {
        $ifile.val($('#slc_sound_files option:selected').text());
    });
    $del.click(function() {
        if(!$regs.val()) return;
        sound_files.delReg(+$regs.val());
        updateList();
    });
}

function loadBms(f){
    bms_file = f;
    var reader = new FileReader();
    reader.readAsText(f, "sjis");
    reader.onload = function(e){	
        var bms_text = e.target.result;	
        bms = new Bms(bms_text);
        sound_files = new SoundFileList(bms.getSoundFilenames())
        updateList();
    }
}

function setArrayToSelect($slc, ary){
    $($slc).empty();
    ary.forEach(function(v, i){
        addOptionToSelect($slc, v, i);
    });
}

function addOptionToSelect($slc, txt, val){
    $slc.append($("<option value='" + val + "'>" + txt + "</option>"));
}

function getInputAsReg(){
    if(!bms) return;
    var input = $input.val();
    var reg;
    try {
        var reg = new RegExp(input, 'i');
    } 
    catch (error) {}
    return reg;
}

function addRegs(){
    var reg = getInputAsReg();
    if(!reg) return;
    sound_files.addReg(reg);
    updateList();
}

function updateList(){
    setArrayToSelect($files, sound_files.not_match);
    setArrayToSelect($regs, sound_files.str_regs);
    updateMatchList();
}

function updateMatchList(){
    var reg = getInputAsReg();
    if(!reg) return;
    var fs = sound_files.getMatchFilenames(reg);
    setArrayToSelect($match_files, fs);
}

function getConvertedBms(){
    
}