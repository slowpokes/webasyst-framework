$(document).ready(function() {
    var button = $('#uploadButton'), interval;
    var _csrf = $('input[name=_csrf]').val();
    var post_id = $('input[name=post_id]').val();
    $.ajax_upload(button, {
        action: '?plugin=logopost&action=saveImage',
        name: 'logopost',
        data: {_csrf: _csrf, post_id: post_id},
        onComplete: function(file, response) {
            var response = $.parseJSON(response);
            if (response.status == 'ok') {
                $("#logopost-response").text(file);
                $("#logopost-preview").html('<img src="' + response.data.preview + '" />');
                $("#deleteButton").show();
            } else if (response.status == 'fail') {
                $("#response").text(response.errors.join());
            }

        }
    });

    $('#deleteButton').click(function() {
        var _csrf = $('input[name=_csrf]').val();
        var post_id = $('input[name=post_id]').val();
        $.ajax({
            url: "?plugin=logopost&action=deleteImage",
            dataType: 'json',
            type: 'POST',
            data: {_csrf: _csrf, post_id: post_id}
        }).done(function(response) {
            $("#logopost-preview").html('');
            $("#logopost-response").text(response.data.message);
            $("#deleteButton").hide();
        });
    });

});
