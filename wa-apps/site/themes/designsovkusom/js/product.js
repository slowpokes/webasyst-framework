(function ($) {
    $.fn.restrict = function () {
        return this.each(function () {
            if (this.type && 'number' === this.type.toLowerCase()) {
                $(this).on('change', function () {
                    var _self = this,
                        v = parseFloat(_self.value),
                        min = parseFloat(_self.min),
                        max = parseFloat(_self.max);
                    if (v >= min && v <= max) {
                        _self.value = v;
                    }
                    else {
                        _self.value = v < min ? min : max;
                    }
                });
            }
        });
    };
})(jQuery);

// YOUTUBE

$(".video a").click(function showVideo(e) {
    $("#video_overlay").overlay({
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
            $(".overlay_video_container").html('');
        }
    });
    var html = $(this).data('html');
    $("#video_overlay").find('.overlay_video_container').html(html);
    $("#video_overlay").overlay().load();
    $(".overlay_container").css("height", "100%");
    return false;
});


$(".close").live("click", function () {
    alert(1);
});
/*
 var player;
 function onYouTubePlayerAPIReady() {
 console.log(1);
 // create the global player from the specific iframe (#video)
 player = new YT.Player('youtube', {
 events: {
 // call this function when player is ready to use
 'onReady': onPlayerReady,
 'onStateChange': onPlayerStateChange
 }
 });
 }

 function onPlayerReady(event) {

 var playButton = document.getElementById("header");
 playButton.addEventListener("click", function() {
 player.playVideo();
 });

 document.getElementsByClassName("close").addEventListener("click", function () {
 player.stopVideo();
 });
 }

 function onPlayerStateChange(event) {
 console.log(2);
 }

 */
$(".skus").find("input").first().attr('checked', true);


function Maxmin() {
    var qty = $("#prod_qty");
    var checked_sku = $(".sku_id:checked");
    qty.val(1);
    qty.attr({
        "max": checked_sku.data('sku-count'),
        "min": 1
    });
    qty.restrict();
}

Maxmin();


$('.number_down').click(function () {
    var $input = $('input.product-quantity');
    var count = parseInt($input.val()) - 1;
    count = count < 1 ? 1 : count;
    $input.val(count);
    $input.change();
    return false;
});
$('.number_up').click(function () {
    var $input = $('input.product-quantity');
    $input.val(parseInt($input.val()) + 1);
    $input.change();
    return false;
});

var skuid = $("#product-skus input:radio:checked").data('sku-id');
$("#artsku").text(skuid);


if ($("input[name=sku_id]:radio:checked").data('disabled')) {
    $('.product-submit').val('Нет в наличии');
    $('.product-submit').addClass('disabled');

}


$("input[name=sku_id]:radio").change(function () {
    Maxmin();
    if ($(this).data('disabled')) {
        $('.product-submit').val('Нет в наличии');
        $('.product-submit').addClass('disabled');
    }
    else {
        $('.product-submit').val('В корзину');
        $('.product-submit').removeClass('disabled');
    }

});


function currency_format(number, no_html) {
    // Format a number with grouped thousands
    //
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +	 bugfix by: Michael White (http://crestidg.com)

    var i, j, kw, kd, km;
    var decimals = currency.frac_digits;
    var dec_point = currency.decimal_point;
    var thousands_sep = currency.thousands_sep;

    // input sanitation & defaults
    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ",";
    }
    if (thousands_sep == undefined) {
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
    kd = (decimals && (number - i) ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


    var number = km + kw + kd;
    var s = no_html ? currency.sign : currency.sign_html;
    if (!currency.sign_position) {
        return s + currency.sign_delim + number;
    } else {
        return number + currency.sign_delim + s;
    }
}

$(function () {

    var service_variant_html = function (id, name, price) {
        return '<option data-price="' + price + '" id="service-variant-' + id + '" value="' + id + '">' + name + ' (+' + currency_format(price, 1) + ')</option>'; //currency_format(price, 1)
    };

    var update_sku_services = function (sku_id) {
        $("div.stocks div").hide();
        $("#sku-" + sku_id + "-stock").show();

        for (var service_id in sku_services[sku_id]) {
            var v = sku_services[sku_id][service_id];
            if (v === false) {
                $("#service-" + service_id).hide().find('input,select').attr('disabled', 'disabled').removeAttr('checked');
            } else {
                $("#service-" + service_id).show().find('input').removeAttr('disabled');
                if (typeof (v) == 'string') {
                    $("#service-" + service_id + ' .service-price').html(currency_format(v, 1)); //currency_format(v)
                    $("#service-" + service_id + ' input').data('price', v);
                } else {
                    var selected_variant_id = $("#service-" + service_id + ' .service-variants').data('variant-id');
                    for (var variant_id in v) {
                        var obj = $("#service-variant-" + variant_id);
                        if (v[variant_id] === false) {
                            obj.hide();
                        } else {
                            if (!selected_variant_id) {
                                selected_variant_id = variant_id;
                            }
                            obj.replaceWith(service_variant_html(variant_id, v[variant_id][0], v[variant_id][1]));
                        }
                    }
                    $("#service-" + service_id + ' .service-variants').val(selected_variant_id);
                }
            }
        }

    };


    $('.variation').mouseover(function () {
        $(this).find('.arrow_box').show();
    }).mouseout(function () {
        $(this).find('.arrow_box').hide();
    });


    $("#product-skus li").click(function () {
        $input = $(this).children("input");
        $input.prop('checked', true);
        if ($input.data('image-id')) {
            var href = $input.attr('href');
            var img = $input.data('small');
            console.log(img);
            $("#image-link").attr('href', href);
            $("#product-image").attr('src', img);
        }
        var cur_elem_name = $('#product-skus input:radio:checked').parent('#product-skus > li > label');
        var notcur_elem_name = $('#product-skus input:radio:not(:checked)').parent('#product-skus > li > label');


        $(cur_elem_name).find('.sku_total').addClass('active_sku');
        $(notcur_elem_name).find('.sku_total').removeClass('active_sku');

        $(cur_elem_name).find('.sku_total_perfume').addClass('active_sku');
        $(notcur_elem_name).find('.sku_total_perfume').removeClass('active_sku');

        if ($input.data('disabled')) {
            $(".add2cart input:submit").attr('disabled', 'disabled');
        } else {
            $(".add2cart input:submit").removeAttr('disabled');
        }
        var sku_id = $input.val();
        update_sku_services(sku_id);
        update_price();
    });


    $("select.sku-feature").change(function () {
        var key = "";
        $("select.sku-feature").each(function () {
            key += $(this).data('feature-id') + ':' + $(this).val() + ';';
        });
        var sku = sku_features[key];
        if (sku) {
            if (sku.image_id) {
                /*$("#product-image-" + sku.image_id).click();*/
                $("#product-image").parent().find("div.loading").remove();
                $("#product-image").parent().append('<div class="loading" style="position: absolute; left: ' + (($("#product-image").width() - 16) / 2) + 'px; top: ' + (($("#product-image").height() - 16) / 2) + 'px"><i class="icon16 loading"></i></div>');

                var img = $("#product-image-" + sku.image_id + " img");
                var size = $("#product-image").attr('src').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
                var src = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');

                var a = $("#product-image-" + sku.image_id);
                var asize = $("#image-link").attr('href').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
                var asrc = a.attr('href').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + asize + '$3');

                $('<img>').attr('src', src).load(function () {
                    $("#product-image").attr('src', src);
                    $("#image-link").attr('href', asrc);
                    $("#product-image").parent().find("div.loading").remove();
                }).each(function () {
                    //ensure image load is fired. Fixes opera loading bug
                    if (this.complete) {
                        $(this).trigger("load");
                    }
                });
            }
            update_sku_services(sku.id);
            if (sku.available) {
                $(".add2cart input[type=submit]").removeAttr('disabled');
            } else {
                $(".add2cart input[type=submit]").attr('disabled', 'disabled');
            }
            $(".add2cart .price").data('price', sku.price);
            update_price(sku.price, sku.compare_price);
        } else {
            $("div.stocks div").hide();
            $("#sku-no-stock").show();
            $(".add2cart input[type=submit]").attr('disabled', 'disabled');
            $(".add2cart .compare-at-price").hide();
            $(".add2cart .price").empty();
        }

    });
    $("select.sku-feature:first").change();

    function update_price(price, compare_price) {
        if (price === undefined) {
            if ($("#product-skus input:radio:checked").length) {
                var price = parseFloat($("#product-skus input:radio:checked").data('price'));
                if (compare_price === undefined) {
                    var compare_price = parseFloat($("#product-skus input:radio:checked").data('compare-price'));
                }
            } else {
                var price = parseFloat($(".add2cart .price").data('price'));
            }
        }
        var sku = $("#product-skus input:radio:checked").data('sku-id');
        $("#artsku").text(sku);

        if (compare_price) {
            if (!$(".add2cart .compare-at-price").length) {
                $(".add2cart").prepend('<span class="compare-at-price nowrap"></span>');
            }
            $(".add2cart .compare-at-price").html(currency_format(compare_price, 1)).show(); //currency_format(compare_price)
        } else {
            $(".add2cart .compare-at-price").hide();
        }
        $("#cart-form .services input:checked").each(function () {
            var s = $(this).val();
            if ($('#service-' + s + '  .service-variants').length) {
                price += parseFloat($('#service-' + s + '  .service-variants :selected').data('price'));
            } else {
                price += parseFloat($(this).data('price'));
            }
        });
        $(".add2cart .price").html(currency_format(price, 1)); //currency_format(price)
    }

    if (!$("#product-skus input:radio:checked").length) {
        $("#product-skus input:radio:enabled:first").attr('checked', 'checked');
    }
    update_price();
    // product images

    $("#product-gallery a").hover(function () {
        $("#product-image").parent().find("div.loading").remove();
        $("#product-image").parent().append('<div class="loading" style="position: absolute; left: ' + (($("#product-image").width() - 16) / 2) + 'px; top: ' + (($("#product-image").height() - 16) / 2) + 'px"><i class="icon16 loading"></i></div>');

        var img = $(this).find('img');
        var size = $("#product-image").attr('src').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
        var src = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');
        $('<img>').attr('src', src).load(function () {
            $("#product-image").attr('src', src);
            $("#product-image").parent().find("div.loading").remove();
        }).each(function () {
            //ensure image load is fired. Fixes opera loading bug
            if (this.complete) {
                $(this).trigger("load");
            }
        });
        return false;
    });

    // add to cart block: services
    $(".cart .services input:checkbox").click(function () {
        var obj = $('select[name="service_variant[' + $(this).val() + ']"]');
        if (obj.length) {
            if ($(this).is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
        }
        update_price();
    });

    $(".cart .services .service-variants").on('change', function () {
        update_price();
    });

    // compare block
    $("a.compare-add").click(function () {
        var compare = $.cookie('shop_compare');
        if (compare) {
            compare += ',' + $(this).data('product');
        } else {
            compare = '' + $(this).data('product');
        }
        if (compare.split(',').length > 1) {
            var url = $("#compare-link").attr('href').replace(/compare\/.*$/, 'compare/' + compare + '/');
            $("#compare-link").attr('href', url).show().find('span.count').html(compare.split(',').length);
        }
        $.cookie('shop_compare', compare, {expires: 30, path: '/'});
        $(this).hide();
        $("a.compare-remove").show();
        return false;
    });
    $("a.compare-remove").click(function () {
        var compare = $.cookie('shop_compare');
        if (compare) {
            compare = compare.split(',');
        } else {
            compare = [];
        }
        var i = $.inArray($(this).data('product') + '', compare);
        if (i != -1) {
            compare.splice(i, 1)
        }
        $("#compare-link").hide();
        if (compare) {
            $.cookie('shop_compare', compare.join(','), {expires: 30, path: '/'});
        } else {
            $.cookie('shop_compare', null);
        }
        $(this).hide();
        $("a.compare-add").show();
        return false;
    });

    $("#cart-form").submit(function () {
        var f = $(this);
        $.post(f.attr('action') + '?html=0', f.serialize(), function (response) {

            if (response.status == 'ok') {
                var cart_total = $(".cart-total");
                var cart_count = $(".cart-count");
                var cart_div = f.closest('.cart');
                cart_total.closest('.cart').removeClass('empty');
                if ($(window).scrollTop() >= 45) {
                    $("#cart-summary").addClass("fixed");
                }
                var clone = $('<div class="cart"></div>').append($('#cart-form').clone());
                if (cart_div.closest('#dialog').length) {
                    clone.insertAfter(cart_div.closest('#dialog'));

                } else {

                    clone.insertAfter(cart_div);
                }
                var clone_sku = $(clone).find(".product-service-dialog");
                $(clone).remove();
                clone_sku.css({
                    'z-index': 10,
                    top: cart_div.offset().top,
                    left: cart_div.offset().left,
                    width: cart_div.width() + 'px',
                    height: cart_div.height() + 'px',
                    position: 'absolute',
                    overflow: 'hidden'
                }).insertAfter("#main").animate({
                    top: cart_total.offset().top,
                    left: cart_total.offset().left,
                    width: 0,
                    height: 0,
                    opacity: 0.5,

                }, 500, function () {

                    cart_total.html(response.data.total);
                    cart_count.html(response.data.count);
                });
                if (cart_div.closest('.dialog').length) {
                    cart_div.closest('.dialog').hide().find('.cart').empty();
                }
            } else if (response.status == 'fail') {
                alert(response.errors);
            }
        }, "json");
        return false;
    });
});