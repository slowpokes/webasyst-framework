$(document).ready(function () {


    $(".cartheader").click(function () {
        if (!$("#cart-summary").hasClass("empty")) {
            showCart();
        }
        return false;
    });



    $("#fast_cart_view").overlay({
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
            closeCart();
        }
    });
    infoHoverInit();
});

function clog(str) {
    if (window.console) console.log(str);
}

function showCart() {
    $("body").addClass('freeze');
    $("#fast_cart_view").overlay().load();
    $("#cart_fast_info").html('<div class="preloader"><div class="status">&nbsp;</div></div>');
    $.get('/cart/', function (data) {
        console.log(data);
        var cont = $($.parseHTML(data)).find("#cart_content");
        makeCart(cont);
    });
}

function makeCart(cont) {
    $("#cart_fast_info").html(cont);
    cartInit($("#cart_fast_info"));
}

function cartInit(block) {
    basicAuthFormInit(block);

    block.find("a.deleteico").click(function () {
        var tr = $(this).closest('tr');
        tr.find('td').wrapInner('<div class="temp overflow_hidden" />');
        tr.find('td').animate({'padding-top': 0, 'padding-bottom': 0}, 500);
        tr.find('.temp').animate({height: 0}, 500, function () {
            tr.remove();
        });
        $.ajax({
            url: "/cart/delete/",
            type: "POST",
            data: {id: tr.data('id')},
            dataType: "json",
            success: function (response) {
                tr.remove();
                updatesCart(response.data);
            }

        });
        return false;
    });


    block.find("input.qty").change(function () {
        var that = $(this);
        if (that.val() > 0) {
            var tr = that.closest('tr');

            if (that.val()) {
                tr.find('.cols_fullprice').text(((tr.data('price')) * that.val()) + ' руб.');

                $.post('cart/save/', {html: 0, id: tr.data('id'), quantity: that.val()}, function (response) {
                    if (response.data.q) {
                        that.val(response.data.q);
                    }
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        that.removeClass('error');
                    }
                    updatesCart(response.data);
                }, "json");
            }
        } else {
            that.val(1);
        }
    });
}

function basicAuthFormInit(block) {
    clog('basicAuthFormInit');
    setPhoneValidator('input[name="customer[phone]"]');

    $("#order_create").click(function () {
        createOrder(block);
        return false;
    });


}

function setPhoneValidator(element) {
    $(element).msk("+7 (999) 999-99-99", {empty_string: "7 ___ _______"});

}

function createOrder(block) {
    clog('createOrder start');
    $(".overlay_container").css("height", "100%");
    $("#fast_cart_view").css("height", "800px");
    var form = block.find("#cart_form");
    var url = '/cart/';
    var data = form.serialize() + '&checkout=1';
    console.log(data);
    var checkout_form = block.find("#checkout_block").find('form');
    var checkout_data = checkout_form.serialize();

    var cart = $("#cart_content").detach();

    $.post(url, data, function (result) {
        var res = $($.parseHTML(result));
        var cart_cont = res.filter("#cart_content");
        var basicauth_cont = res.find('#checkout_block');
        if (cart_cont.length > 0) {
            clog('error in cart data');
            makeCart(cart_cont);
        }
        else if (basicauth_cont.length > 0) {
            clog('save basic data');
            $.post('/checkout/', checkout_data, function (result) {
                var res = $($.parseHTML(result));
                var address_cont = res.find('#checkout_address');
                var basic_cont = res.find('#checkout_block');
                if (address_cont.length > 0) {
                    clog('data saved, init address form');
                    makeAddress(address_cont);
                }
                if (basic_cont.length > 0) {
                    clog('error in basic data');
                    $("#cart_fast_info").html(cart);
                    $("#basicauth_block").html(basic_cont);
                    basicAuthFormInit(block);
                }
            });
        }
    });
    block.html('<div class="preloader"><div class="status">&nbsp;</div></div>');
}


function makeAddress(cont) {
    clog('makeAddress');

    $("#cart_fast_info").html(cont);
    $(".address_form").after("<div class='checkout_right'><div class='checkout_fast'><div class='checkout_shipping'></div><div class='checkout_billing'></div><div class='checkout_shipping_text hint'></div></div><div class='checkout_order_info'></div><div class='checkout_final'></div></div>");
    $("input[name='customer[address.shipping][region]']").change(function () {

        updateRegion(cont);
    });

    updateRegion(cont);


    $(".cart_return").click(function () {
        showCart();
    });
    /*putShipmentDate($("input[name='order[shipping_date]']"));*/
}

function updateRegion(cont) {
    clog('updateRegion');
    Kladr();
    var region = $("#address_form #city").val();

    $("#address_form .field_dynamic").each(function () {
        var show = false;
        if ($(this).hasClass('field_region_all')) {
            show = true;
        }
        if ($(this).hasClass('field_region_not_' + region)) {
            show = false;
        }
        if ($(this).hasClass('field_region_' + region)) {
            show = true;
        }
        if (show) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
    /*$("select[name='customer[address.shipping][area]']>option").each(function(){
     if((region==$(this).data('code'))){
     $(this).show();
     }
     else{
     $(this).hide();
     }
     });
     $("select[name='customer[address.shipping][area]']").val('-');*/
    loadShipping(cont)
}

function putShipmentDate(element) {
    element.datepicker({ gotoCurrent: true, minDate: 0 });
    element.focus(function () {
        var eTop = element.offset().top;
        var v = eTop - $(window).scrollTop();
        $("#ui-datepicker-div").css("top", v + 25);
        //setInterval(function(){$("#ui-datepicker-div").css("top", v);}, 500);
    });
}

function loadShipping(cont) {
    clog('loadShipping');
    var form = $("#address_form");
    var url = '/checkout/address/';
    var data = form.serialize();
    $.post(url, data, function (result) {
        clog('data posted');
        $.get('/checkout/shipping/', function (result) {
            clog('data got');
            var res2 = $($.parseHTML(result)).find("#shipping_content");
            if (res2.length > 0) {
                $(".checkout_shipping").first().html(res2);
                $("input[type=radio]").click(function () {
                    selectShipping(cont);
                });
                var f = $("input[type=radio]").first();
                f.prop('checked', true);
                f.click();
            }
            else {
                clog('error in shipping data');
            }
        })
    });
}

function selectShipping(cont) {
    clog('selectShipping');
    var form = $("#shipping_form");
    var url = '/checkout/shipping/';
    var data = form.serialize();
    var text = form.find("input[type=radio]:checked").first().closest(".shipping_option").find(".shipping_description").html();
    $(".checkout_shipping_text").html(text);
    $.post(url, data, function (result) {
        clog('shipping saved');
        Kladr();
        var res2 = $($.parseHTML(result)).find("#payment_content");
        var res3 = $($.parseHTML(result)).find("#order_summary");
        if (res2.length > 0) {
            $(".checkout_billing").html(res2);
            var f = res2.find("input[type=radio]").first();
            f.prop('checked', true);
            $(".checkout_final").html("<div class='order_final'><input type='button' class='rv-button orange-button' value='Подтвердить заказ'></div>");

            $(".checkout_order_info").html(res3);
            $(".checkout_final").find(".order_final").click(function () {
                finalizeOrder(cont);
            });
        } else {
            clog('error in saving shipping');
        }
    });
}

function finalizeOrder(cont) {
    clog('finalizeOrder');
    var form = $("#address_form");
    var shipping_form = $("#shipping_form");
    var url = '/checkout/address/';
    var data = form.serialize();
    $.post(url, data, function (result) {
        clog('data posted');
        var res_error = $($.parseHTML(result)).find("#checkout_address");
        var res_ok = $($.parseHTML(result)).find("#shipping_content");
        if (res_error.length > 0) {
            clog('error in address');
            makeAddress(res_error);
        }
        else {
            var url = '/checkout/shipping/';
            var data = shipping_form.serialize() + '&place_order=1';
            $.post(url, data, function (result) {
                var payment_form = $($.parseHTML(result)).find("#payment_form");
                var url = '/checkout/payment/';
                var data = payment_form.serialize();
                $.post(url, data, function (result) {
                    var res_ok = $($.parseHTML(result)).find("#checkout_success");
                    $("#cart_fast_info").html(res_ok);
                    orderFinalized();
                });
            });
        }
    });
    cont.html('<div class="preloader"><div class="status">&nbsp;</div></div>');
}

function infoHoverInit() {
    var el = $(".info_hover");
    var tooltip = $("#hover_tooltip");
    el.live('mouseover', function () {
        var text = $(this).html();
        $(this).data('html', text);
        tooltip.html(text);
        $(this).html(tooltip);
        tooltip.show();
        $(this).addClass('hovered');
        var top = tooltip.outerHeight() / 2 - 8;
        clog(top);
        tooltip.css('top', -top);
    });
    el.live('mouseout', function () {
        tooltip.hide();
        tooltip.html('');
        $(this).html($(this).data('html'));
        $(this).removeClass('hovered');
    });
}

function closeCart() {
    $("#fast_cart_view").overlay().close();
    $("body").removeClass('freeze');
}
function updatesCart(data) {

    $(".cart-total.align-right.total.bold.nowrap").html(data.total);
    $(".price.nowrap.cart-total").html(data.total);

    $(".cart-count").html(data.count);


    $(".align-right.nowrap.cart_discount").html('&minus; ' + data.discount);
    var dascount_percent = Math.round(100 * data.discount_numeric / (data.discount_numeric + data.total_numeric)); // процент скидки
    $(".discount_percent").html('Ваша скидка ' + dascount_percent + "% ");


    if (data.count > 0) {
        $("#cart-summary").removeClass("empty");

    }
    else {
        $("#cart-summary").addClass("empty");
        $("#order_create").addClass("inactive");
        closeCart();
    }

    if (data.discount_numeric > 0) {
        $(".discount_block").show();
    }
    else {
        $(".discount_block").hide();
    }


}

