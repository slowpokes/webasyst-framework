$("#select_region").overlay({
    top: 0,
    closeOnClick: false,
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



$(".delivery_city").click(function () {
    $("#select_region").overlay().load();
    $(".overlay_container").css("height", "100%");

});

$("#select_reg").find('a').click(function () {
    console.log('select_reg');
    setRegion($(this))
    $("#select_region").overlay().close();
    return false;
});

function setRegion(element) {
    var id = element.data('code');
    var text = element.text();
    $.removeCookie('region_name');
    $(".region_name").html(text);
    $(".region_name").attr('data-id', id);
    shippingRegionChange(id);
    console.log('setRegion');
    shippingHeaderChange(id);
    $.cookie("region_name", text, {expires: 365, path: '/'});
    $.cookie("region_name_id", id, {expires: 365, path: '/'});
}

if ($.cookie('region_name')) {
    $(".region_name").html($.cookie('region_name'));
    $(".region_name").attr('data-id', $.cookie('region_name_id'));
}
function shippingHeaderChange(region){
    $.get('/data/shippingheader/?region='+region, function(result){
        $(".apps").html(result);

    });
}

function shippingRegionChange(region){
    $.get('/data/shippingprice/?region='+region, function(result){
        console.log('shippingRegionChange');
        var data = $(result).find(".shipping_result");
        $("#shipping_results").html(data);
    });
}
