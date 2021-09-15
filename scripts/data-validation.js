$('#x-cord-input').on('input', getCheckFunction(checkCoordinate));
$('#radius-input').on('input', getCheckFunction(checkRadius));
$('#send-form').on('click', submitData);

function checkRadius(val) {
    return val >=2 && val <= 5;
}

function checkCoordinate(val) {
    return val >= -5 && val <= 3;
}

function getCheckFunction(func) {
    return function(event) {
        let val = this.value;
        if (val != '' && Number.isInteger(Number(val))) {
            if (!func(val)) {
                notValid(this);
            }
            else {
                valid(this);
            }
        }
        else {
            notValid(this);
        }
    }
}

function notValid(node) {
    $(node).addClass('not-valid');
}

function valid(node) {
    $(node).removeClass('not-valid');
    $(node)[0].nextElementSibling.classList.add('hidden');
}

function submitData() {
    let allValid = true;
    $('input').each(function() {
        $(this).trigger('input');
        if ($(this).is('.not-valid')) {
            this.nextElementSibling.classList.remove('hidden');
            allValid = false;
        }
    });

    let time = calculateTimeOfsset(new Date().getTimezoneOffset() * -1)

    if (allValid) {

        redraw_graphic();
        $.ajax({
            url: "index.php",
            type: "GET",
            data: {
                xCord: Number($('#x-cord-input').val()),
                yCord: Number($('#y-selection').val()),
                radius: $('#radius-input').val(),
                timeOffset: time
            }
        }).done(addIntoTable)
        .fail(processError);
    }
}

function redraw_graphic() {
    let path = $('#graphic path');
    let r = $('#radius-input').val();
    let path_points = "M 150 " + (150 - r*25) + "\n A " + (r*25) +
    " " + (r*25) + " 0 0 0 " + (150 - r*25) + " 150 " + "L 150 " +
    (150 + r*25 / 2) + " L 150 150 L " + (150 + r*25/2) + 
    " 150 L " + (150 +r*25/2) + " " + (150 - r*25) + " L 150 " +
    (150 - r*25);  

    path.attr("d", path_points);
}

function calculateTimeOfsset(time) {
    let hours = Math.abs(Math.floor(time / 60)); 
    let minutes = Math.abs(time % 60);

    if (hours < 10) {
        hours = '0' + hours;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    let sign = time < 0 ? '-' : '+';

    time = sign + hours + minutes;
    return time;
}

function addIntoTable(json) {
    $('table.results').removeClass('hidden');
    let data = JSON.parse(json);
    let row = $('<tr>');
    for (let i in data) {
        $('<td>').html(data[i]).appendTo(row);
    }
    $(row).insertAfter($('table.results tr').eq(0));
    draw_point();

}

function draw_point() {
    let circle = $('#graphic circle');
    if (circle.is('.hidden'))
        circle.removeClass('hidden');

    circle.attr("cx", 150 + $('#x-cord-input').val() * 25);
    circle.attr("cy", 150 - $('#y-selection').val() * 25);
}

function processError(xhr, status, errorThrown) {
    alert( "Sorry, there was a problem!" );
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
}
