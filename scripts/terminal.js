var cursor = $("#cursor");
var setter = $("#setter");
var writer = $("#writer");
var terminal = $("#terminal");


function _emulate_enter_press(){
    var e = jQuery.Event("keypress");
    e.which = 13; //choose the one you want
    e.keyCode = 13;
    $("#setter").trigger("click");
    $("#setter").trigger(e);
    $("#writer").trigger("click");
    $("#writer").trigger(e);
    $("#terminal").trigger("click");
    $("#terminal").trigger(e);
}


function _add_new_line(textarea, data){
    data = " " + data + '\r\n'
    textarea.value+=data;
    _emulate_enter_press()
  
}

$(cursor).css("left", "0px");

function nl2br(txt) {
    return txt.replace(/\n/g, '<br /><i class="fa fa-terminal" aria-hidden="true"></i>:');
}

function writeit(from, e) {
    e = e || window.event;
    var w = $(writer);
    var tw = from.value;
    w.html(nl2br(tw));
}

function moveIt(count, e) {
    e = e || window.event;
    var keycode = e.keyCode || e.which;
    if (keycode == 37 && parseInt($(cursor).css("left")) >= (0 - ((count - 1) * 10))) {
        $(cursor).css("left", parseInt($(cursor).css("left")) - 10 + "px");
    } else if (keycode == 39 && (parseInt($(cursor).css("left")) + 10) <= 0) {
        $(cursor).css("left", parseInt($(cursor).css("left")) + 10 + "px");
    }
}

$(terminal).click(function() {
    $(setter).focus();
});
$(setter).keydown(function(event) {
    writeit(this, event);
    moveIt(this.value.length, event);
});
$(setter).keyup(function(event) {
    writeit(this, event);
});
$(setter).keypress(function(event) {
    writeit(this, event);
});


function init_textarea(){
    let textarea = document.getElementById('setter');
    textarea.value = '';
    _add_new_line(textarea, "Welcome to PONG SETTINGS terminal")
    return textarea
}

let difficulty = 1;
let game_mode = 0; 
let game_difficulties = ['Easy', 'Medium', 'Hard']
let game_modes = ['Player vs Player', 'Player vs Bot']

function get_gamedata(textarea){
    _add_new_line(textarea, "Select Difficulty Level: ")
    _add_new_line(textarea, "   1 - Easy")
    _add_new_line(textarea, "   2 - Medium")
    _add_new_line(textarea, "   3 - Hard")
    let current_stage = 1; 
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            if (current_stage == 1){
                let result = parseInt(textarea.value.charAt(textarea.value.length - 1))
                if (!isNaN(result)){
                    if (result >= 1 && result <= 3) {
                        difficulty = result;
                        current_stage++;
                        _add_new_line(textarea, `\r\nSelected Difficulty Level: ${game_difficulties[result-1]}`)
                        _add_new_line(textarea, ``)
                        _add_new_line(textarea, 'Select GAME MODE')
                        _add_new_line(textarea, "1 - Player vs Player")
                        _add_new_line(textarea, "2 - Player vs Bot")
                    }
                    else this.location.reload()
                }
                else this.location.reload()
            }
            else if(current_stage == 2){
                let result = parseInt(textarea.value.charAt(textarea.value.length - 1))
                if (!isNaN(result)){
                    if (result === 1 || result === 2){
                        game_mode = result;
                        _add_new_line(textarea, `\r\nSelected GAME MODE: ${game_modes[result-1]}`)
                        _add_new_line(textarea, " ")
                        _add_new_line(textarea, " How to play this mode? ")
                        if (result == 1){
                            _add_new_line(textarea, "Player 1 controlls left pannel with keys ↑ & ↓")
                            _add_new_line(textarea, "Player 2 controlls right pannel witn keys W and S")
                        }
                        else {
                            _add_new_line(textarea, "Player 1 controlls left pannel with keys W & S")
                            _add_new_line(textarea, "Bot controlls right pannel")
                        }
                        _add_new_line(textarea, "The game is infinite")
                        current_stage++;
                        _add_new_line(textarea, "Input anything to start...")
                    }
                    else this.location.reload()
                }
                else this.location.reload()
            }
            else{
                this.location.href = `pong.html?gm=${game_mode}&df=${difficulty}`
            }
        }
    
    }, false);
}


let textarea = init_textarea()
get_gamedata(textarea)
