/**
 * Created by Vadim on 27.10.2014.
 */
function initShipping(mini) {
    document.write("<span class='before_city'></span> <span class='city_container'></span> <span class='before_date'></span> <div id='shipping_results'></div>");
    $.get('/data/shippingheader', function (result) {
        console.log(mini);
        var $city_header = $(result).find(".city_header").html();
        $(".city_container").html($city_header);
        if ($.cookie('region_name')) {
            $(".region_name").html($.cookie('region_name'));
            $(".region_name").attr('data-id', $.cookie('region_name_id'));
        }

        var current_id = $("#region_name").data('id');

        shippingRegionChange(current_id, mini);
        $("#shipping_regions").html($(result).find(".regions_table"));

    });
}

