var cursor = $("#cursor");
var setter = $("#setter");
var writer = $("#writer");
var terminal = $("#terminal");
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

setInterval("blink()", 500);
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