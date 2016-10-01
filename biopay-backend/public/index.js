$(document).ready(function(){
    $('.modal-trigger').leanModal();
    $('#video').materialbox();
});
navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
navigator.getMedia({video:true, audio:false},
    function (mediaStream) {
        var video = document.getElementsByTagName('video')[0];
        video.src = window.URL.createObjectURL(mediaStream);
        video.play();
    },
    //handle error
    function (error) {
        console.log(error);
    });

var buyableItems = [
    {type: 'snooze', name: 'Apple MacBook Pro', price: 29.99},
    {type: 'translate', name: 'POST/bank Notizblock', price: 9.99},
    {type: 'web', name: '', price: 49.99},
    {type: 'today', name: 'Jacket', price: 129.99}
];
var full_price = 0;

function CheckoutList() {
    var checkoutList = $('#checkout-list');
    var list = [];

    var render = function () {
        checkoutList.html('');
        full_price = 0;
        $(list).each(function (index, item) {
            var $li = $('<li class="collection-item avatar"></li>');
            $li.append('<i class="material-icons circle">'+
                item.type+'</i><span class="title">'+item.name+'</span><p>'+item.price+' €</p>');

            full_price += item.price;
            checkoutList.append($li);
        });
        var $li = $('<li class="collection-item avatar"></li>');
        $li.append('<i class="material-icons circle">star</i><span class="title"><b>Full Price</b></span><p>'+full_price+' €</p>');
        checkoutList.append($li);
    };

    return {render: render, list: list}
}

$('#pay').click(function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');
    context.drawImage(video, 0, 0, 320, 240);
    var imagedata = context.getImageData(0,0,320,240);

    $('.progress').html('<div class="indeterminate"></div>');
    setTimeout(function() {
        $('.progress').html('<div class="determinate" style="width: 100%"></div>');
        $('#payed').html('Payed <i class="material-icons green-text">done</i>')
    }, 3000);
});

$(document).keypress(function(key) {
    console.log(key.keyCode);
    if (key.keyCode == 32) {
        //Save image and move to microsoft service
        $('#payed').html('Sending Picture to Microsoft Service');
        $('.progress').html('<div class="indeterminate"></div>');

        window.setTimeout(function() {
            $('.progress').html('<div class="determinate" style="width: 100%"></div>');
            $('#payed').html('IBAN Available<i class="material-icons green-text">done</i>');
        }, 2000)
    }

    if (key.keyCode == 13) {
        cl.list.push(buyableItems.pop());
        cl.render();
        document.getElementById('beep').play()
    }

    if (key.keyCode == 103) {
        $('.progress').html('<div class="indeterminate"></div>');
        $('#payed').html('Sending Money');

        window.setTimeout(function () {
            $('.progress').html('<div class="determinate" style="width: 100%"></div>');
            $('#payed').html('Payed<i class="material-icons green-text">done</i>');
            document.getElementById('ching').play()
        }, 2000);
    }
});

var cl = CheckoutList();