$("#select_region").overlay({
    top: 0,
    closeOnClick: true,
    oneInstance: false,
    load: false,
    mask: {
        color: '#000',
        loadSpeed: 200,
        opacity: 0.6,
        zIndex: 2540
    },
    onClose: function () {

    }
});


function delivCity(that) {
    if ($(that).parents(".jcarousel").length) {
        $("#select_region").addClass("mini");
    }
    $("#select_region").overlay().load();
    $(".overlay_container").css("height", "100%");

}

$("#select_reg").find('a').click(function () {
    if ($(this).parents(".mini").length) {
        var mini = 1;
    }
    else {
        mini = 0;
    }

    setRegion($(this), mini);
    $("#select_region").overlay().close();
    return false;
});

function setRegion(element, mini) {
    var id = element.data('code');
    var text = element.text();
    $(".region_name").html(text);
    $(".region_name").attr('data-id', id);
    shippingRegionChange(id, mini);
    shippingHeaderChange(id);

    $.cookie("region_name", text, {expires: 365, path: '/'});
    $.cookie("region_name_id", id, {expires: 365, path: '/'});
}

function shippingHeaderChange(region) {
    $.get('/data/shippingheader/?region=' + region, function (result) {
        var $date_header = $(result).find(".date_header").html();
        $(".date_container").html($date_header);
    });
}

function shippingRegionChange(region, mini) {
    $.get('/data/shippingprice/?region=' + region, function (result) {
        if (mini == 1) {
            $(".before_city").text("Стоимость и сроки доставки в ");
            $(".before_date").html("<span style='color: #808080; cursor: pointer;' onclick='delivCity();'>(выбрать регион)</span>");
            var data_mini = $(result).find(".shipping_result_mini");
            $("#shipping_results").html(data_mini);
        }
        else {
            console.log('full');
            var data = $(result).find(".shipping_result");
            $("#shipping_results").html(data);
        }

    });
}

