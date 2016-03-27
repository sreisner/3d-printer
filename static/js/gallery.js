$(document).ready(function() {
    var gallery = $('.gallery');
    $.ajax('/api/print', {
        method: 'GET',
        success: function(data) {
            data.forEach(function(print) {
                var downloadFileName = print.title.substring(0, 20).split(' ').join('-') + '.stl';
                gallery.append('\
                    <a href="/api/grid/' + print.gridFileId + '" download="' + downloadFileName + '">\
                        <div class="print">\
                            <img src="/api/grid/' + print.gridPictureIds[0] + '">\
                            <p>' + print.title + '</p>\
                        </div>\
                    </a>');
            });
        }
    });
});
