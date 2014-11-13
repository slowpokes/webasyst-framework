/**
 * Created by Vadim on 27.10.2014.
 */
function initShipping(){
    document.write("<div id='shipping_menu'></div><div id='shipping_results'></div>");
    $.get('/data/shippingprice', function(result){
        var data = $(result).find(".shipping_result");
        $("#shipping_menu").html(data);
        var current_region = $(".region_name").text();
        var current_id = $(".region_name").data('id');
        $("#shipping_menu").find(".region_name").text(current_region);
        region_callback = shippingRegionChange;
        shippingRegionChange(current_id);
        $("#shipping_regions").html($(result).find(".regions_table"));
    });
}

