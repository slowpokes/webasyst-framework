function cartInit(block){
    initNumber(block);

    block.find(".item_pix a.delete").click(function () {
        var tr = $(this).closest('tr');
        tr.find('td').wrapInner('<div class="temp overflow_hidden" />');
        tr.find('td').animate({'padding-top':0, 'padding-bottom':0}, 500);
        tr.find('.temp').animate({height:0}, 500, function(){
            tr.remove();
        });
        $.post('/cart/delete/', {id: tr.data('id')}, function (response) {
            delCartPreview(tr.data('id'));
            updateCart(response.data);
        }, "json");
        return false;
    });

    block.find('.number_block').find('input').change(function() {
        saveCart($(this));
    });
    block.find('.number_block').find('input').keyup(function() {
        saveCart($(this));
    });
    block.find("#coupon_apply").click(function(){
        submitCart(block);
        return false;
    });

    block.find(".product_fv").each(function(){
        var c = $(this).data("available")*-1;
        if(c==0){
            var name = $(this).find(".item_name").text().replace(/(\r\n|\n|\r)/gm,"").replace(/\s{2,}/g, ' ');
            alert(name+" сейчас не доступен для заказа, пожалуйста удалите его из корзины");
        }
        else if($(this).data("available")>0){
            var name = $(this).find(".item_name");
            alert(name+" осталось только "+$(this).data("available")+" штук");
        }
    });
    basicAuthFormInit(block);
}

function basicAuthFormInit(block){
    setPhoneValidator('input[name="customer[phone]"]');
    block.find("#order_create").click(function(){
        createOrder(block);
        return false;
    });
}

function createOrder(block){
    var form = block.find("#cart_form");
    var url = '/cart/';
    var data = form.serialize()+'&checkout=1';

    var checkout_form = block.find("#checkout_block").find('form');
    var checkout_data = checkout_form.serialize();

    var cart = $("#cart_content").detach();

    $.post(url, data, function(result){
        var res = $($.parseHTML(result));
        var cart_cont = res.filter("#cart_content");
        var basicauth_cont = res.find('#checkout_block');
        if(cart_cont.length>0){
            makeCart(cart_cont);
        }
        else if(basicauth_cont.length>0){
            $.post('/checkout/', checkout_data, function(result){
                var res = $($.parseHTML(result));
                var address_cont = res.find('#checkout_address');
                var basic_cont = res.find('#checkout_block');
                if(address_cont.length>0){
                    makeAddress(address_cont);
                }
                if(basic_cont.length>0){
                    $("#cart_fast_info").html(cart);
                    $("#basicauth_block").html(basic_cont);
                    basicAuthFormInit(block);
                }
            });
        }
    });
    block.html("<div class='loading'></div>");
}

function updateRegion(cont){
    var region = cont.find("select[name='customer[address.shipping][region]']").val();
    cont.find(".field_dynamic").each(function(){
        var show = false;
        if($(this).hasClass('field_region_all')){
            show = true;
        }
        if($(this).hasClass('field_region_not_'+region)){
            show = false;
        }
        if($(this).hasClass('field_region_'+region)){
            show = true;
        }
        if(show){
            $(this).show();
        }
        else{
            $(this).hide();
        }
    });
    cont.find("select[name='customer[address.shipping][area]']>option").each(function(){
        if((region==$(this).data('code'))){
            $(this).show();
        }
        else{
            $(this).hide();
        }
    });
    cont.find("select[name='customer[address.shipping][area]']").val('-');
    loadShipping(cont)
}

function loadShipping(cont){
    var form = cont.find("#address_form");
    var url = '/checkout/address/';
    var data = form.serialize();
    $.post(url, data, function(result){
        $.get('/checkout/shipping/', function(result){
            var res2 = $($.parseHTML(result)).find("#shipping_content");
            cont.find(".checkout_shipping").first().html(res2);
            cont.find("input[type=radio]").click(function(){
                selectShipping(cont);
            });
            var f = cont.find("input[type=radio]").first();
            f.prop('checked', true);
            f.click();
        })
    });
}

function selectShipping(cont){
    var form = cont.find("#shipping_form");
    var url = '/checkout/shipping/';
    var data = form.serialize();
    var text = form.find("input[type=radio]:checked").first().closest(".shipping_option").find(".shipping_description").html();
    cont.find(".checkout_shipping_text").html(text);
    $.post(url, data, function(result){
        var res2 = $($.parseHTML(result)).find("#payment_content");
        var res3 = $($.parseHTML(result)).find("#order_summary");
        cont.find(".checkout_billing").html(res2);
        var f = res2.find("input[type=radio]").first();
        f.prop('checked', true);
        cont.find(".checkout_final").html("<div class='order_final'><input type='button' class='button extra_large' value='Подтвердить заказ'></div>");

        cont.find(".checkout_order_info").html(res3);
        cont.find(".checkout_final").find(".order_final").click(function(){
            finalizeOrder(cont);
        });
    });
}

function finalizeOrder(cont){
    var form = cont.find("#address_form");
    var shipping_form = cont.find("#shipping_form");
    var url = '/checkout/address/';
    var data = form.serialize();
    $.post(url, data, function(result){
        var res_error = $($.parseHTML(result)).find("#checkout_address");
        var res_ok = $($.parseHTML(result)).find("#shipping_content");
        if(res_error.length>0){
            makeAddress(res_error);
        }
        else{
            var url = '/checkout/shipping/';
            var data = shipping_form.serialize()+'&place_order=1';
            $.post(url, data, function(result){
                var payment_form = $($.parseHTML(result)).find("#payment_form");
                var url = '/checkout/payment/';
                var data = payment_form.serialize();
                $.post(url, data, function(result){
                    var res_ok = $($.parseHTML(result)).find("#checkout_success");
                    $("#cart_fast_info").html(res_ok);
                    orderFinalized();
                });
            });
        }
    });
    cont.html("<div class='loading'></div>");
}

function showCart(){
    $("body").addClass('exposed');
    $("#fast_cart_view").overlay().load();
    $("#cart_fast_info").html("<div class='loading'></div>");
    $.get('/cart/', function(data){
        var cont = $($.parseHTML(data)).filter("#cart_content");
        makeCart(cont);
    });
}

function makeCart(cont){
    $("#cart_fast_info").html(cont);
    cartInit($("#cart_fast_info"));
}

function makeAddress(cont){
    $("#cart_fast_info").html(cont);
    cont.find(".address_form").after("<div class='checkout_right'><div class='checkout_fast'><div class='checkout_shipping'></div><div class='checkout_billing'></div><div class='checkout_shipping_text'></div></div><div class='checkout_order_info'></div><div class='checkout_final'></div></div>");
    cont.find("select[name='customer[address.shipping][region]']").change(function(){
        updateRegion(cont);
    });
    updateRegion(cont);
    cont.find(".cart_return").click(function(){
        showCart();
    });
    putShipmentDate(cont.find("input[name='order[shipping_date]']"));
    initCityAutocomplete();
}

function putShipmentDate(element){
    element.datepicker({ gotoCurrent: true,  minDate: 0 });
    element.focus(function(){
        var eTop = element.offset().top;
        var v = eTop - $(window).scrollTop();
        $("#ui-datepicker-div").css("top", v+25);
        //setInterval(function(){$("#ui-datepicker-div").css("top", v);}, 500);
    });
}

function cartViewClose(){
    $("body").removeClass('exposed');
}

function closeCart(){
    $("#fast_cart_view").overlay().close();
}

function updateCart(data){
    updateCartSmall(data);
    $(".total").html(data.total);
    if (data.discount_numeric>0) {
        $(".discount_block").show();
    }
    else{
        $(".discount_block").hide();
    }
    var dascount_percent = Math.round(100*data.discount_numeric/(data.discount_numeric+data.total_numeric));
    $(".cart_discount").html('&minus; ' + data.discount);
    $(".discount_percent").html(dascount_percent+"%");
}

function saveCart(that){
    var tr = that.closest('tr');
    if (that.val()>0) {
        tr.find('.full_price').text((tr.data('price')*that.val())+' руб.');
        $.post('/cart/save/', {id: tr.data('id'), quantity: that.val()}, function (response) {
            updateCart(response.data);
        }, "json");
    }
}

function submitCart(that){
    var form = that.find("form").first();
    var data = form.serialize();
    $.post('/cart/', data, function(result){
        $.post('/cart/delete/', {id: 0}, function (response) {
            updateCart(response.data);
        }, "json");
    });
}

function clearCart(){
    cart_items.length = 0;
    cart_items_full.length = 0;
    $.post('/cart/delete/', {id: 0}, function (response) {
        updateCart(response.data);
    }, "json");
}

function orderFinalized(){
    clearCart();
}

function initCityAutocomplete(){
    var el = $("input[name='customer[address.shipping][city]']");
    var region = $("select[name='customer[address.shipping][region]']");
    el.autocomplete({
        serviceUrl: '/autocomplete/',
        minChars: 1,
        maxHeight: 400,
        width: 300,
        zIndex: 9999,
        deferRequestBy: 200,
        noCache:true,
        triggerSelectOnValidInput:false,
        params: { region: 0},
        onSearchStart:function(){
            el.autocomplete().setOptions({
                params: { region: region.val()}
            });
        },
        appendTo:el.parent()
    });
    //el.after($('.autocomplete-suggestions').detach());
}

/*
function cartSubmit(el){
    $.post($(el).attr('action'), $(el).serialize()+"&checkout=1", function(result){
        $("#contact_info").html(result);
    });
}

function loadCheckout(){
    $.get('/checkout/', function(result){
        putCheckout(result);
        scrollToElement($("#contact_info"));
    })
}

function putCheckout(result){
    $("#contact_info").html(result);
    setPhoneValidator('input[name="customer[phone]"]');
    $('input[name="login"]').each(function(){
        setEmailValidator($(this));
    });
    $("#checkout_block").hide();
    $("#checkout_ok").click(function(){
        btnLoading($(this));
        loadAddress();
        return false;
    });
}

function loadAddress(){
    var animate_speed = 500;
    $.post($("#checkout_form").attr('action'), $("#checkout_form").serialize(), function(result){
        if($(result).find("#shipping_form").length > 0){
            btnLoadingStop();
            $("#checkout_contact").css('float', 'left');
            $("#checkout_contact").css('border', 'none');
            $("#checkout_login").css('position', 'absolute');
            $("#checkout_login").animate({'opacity': 0}, animate_speed);
            $("#shipping_address").addClass('visible');
            var address = $("#checkout_contact").find(".wa-field[data-id='address.shipping']").first().remove();
            $("#checkout_contact").animate({'margin-left':0, 'width':'50%'}, animate_speed, function(){
                address.css('display', 'block');
                $("#shipping_address").html("<div class='form'>"+address.html()+"</div>");
                putRegionHandle($("#shipping_address"));
                $("#checkout_login").css('opacity', 1);
                $("#checkout_login").css('display', 'none');
            });
        }
        else{
            putCheckout(result);
        }
    });
}

function putRegionHandle(element){
    var el = $(element).find("select[name='customer[address.shipping][region]']");
    el.change(function(){
        chooseRegion($(this).val());
    });
    chooseRegion($(el).val())
}

function chooseRegion(id){
    if(id>0){
        loadDelivery();
    }
}

function loadDelivery(){
    $.post($("#checkout_form").attr('action'), $("#checkout_form").serialize(), function(result){
        if($(result).find("#shipping_form").length > 0){
            $("#shipping_info").html(result);
            $(".order_finish").hide();
        }
    });
}

function putGeoData(city, region){
    var reg = $("select[name='customer[address.shipping][region]']");
    var cit = $("input[name='customer[address.shipping][city]']");
    if(region<10) region = "0"+region;
    if(reg.val()>0){
    }
    else{
        reg.find("[value="+region+"]").attr("selected", "selected");
    }
    if(cit.attr('value')==''){
        cit.attr('value', city);
    }
}

*/