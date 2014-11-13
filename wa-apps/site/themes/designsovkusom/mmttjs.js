var fast_view_array = [];
var fast_view_id;
var start_time = new Date().getTime();
var header_animate = false;
var cart_timer;
var zoom_hover = false;
var is_fast_view = false;
var cart_total = '';
var current_menu_item;
var menu_timer = null;
var submenu_timer = null;
var brandmenu_timer = null;
var address_template = '';

function mainInit(){
    $(".image_view").live('click', function(){
        imageArrowClick($(this));
        return false;
    });

    $(".fast_view").live('click', function(){
        fastView($(this));
        return false;
    });
    $("#region").find('.regions').find('a').click(function(){
        setRegion($(this));
        $("#region").overlay().close();
        return false;
    });
    initNumber($(document));
    $(".continue_shopping").live('click', function(){
        $("#cart_add_ok").overlay().close();
        $("#saved_add_ok").overlay().close();
        return false;
    });
    $(".big_rarr").live('click', function(){
        fastViewNext();
        return false;
    });
    $(".big_larr").live('click', function(){
        fastViewPrev();
        return false;
    });

    $(".region_handler").click(function(){
        showRegion();
    });

    $("#sku_shooser").find('.ov_add_btn').click(function(){
        var form = $("#sku_shooser").find('.ov_form').first();
        var image = $("#sku_shooser").find('.ov_sku_image').find('img').first();
        processAdd2Cart(form, image);
        $("#sku_shooser").overlay().close();
        return false;
    });

    $("#cart_add_additional").find('.ov_add_btn').click(function(){
        add2Cart($(this), false);
        $("#cart_add_additional").overlay().close();
        return false;
    });

    $(document).scroll(function() {
        flowHeader();
    });

    $('#mailer-frontend-subscribe-form').submit(function() {
        var form = $(this);

        // Validate email
        var email_input = form.find('input[name="email"]');
        email_input.siblings('.errormsg').remove();
        if (!email_input.val()) {
            email_input.addClass('error').after('<em class="errormsg">Это поле обязательное.</em>');
            return false;
        } else {
            email_input.removeClass('error');
        }
        $('iframe[name="mailer-frontend-subscribe-form-target"]').load(function() {
            $('#mailer-frontend-subscribe-form').hide();
            $('.submit_ok').show();
        });
        return true;
    });

    $(".cart_button").live('click', function(){
        showCart();
        return false;
    });
    infoHoverInit();
    $.datepicker.setDefaults($.datepicker.regional['ru']);
    menuInit();
    initOverlays();
    $(".sidebar_link").click(function(){
        var li = $(this).parent();
        if(li.hasClass('closed')){
            li.removeClass('closed');
        }
        else{
            li.addClass('closed');
            li.find('li').addClass('closed');
        }
        return false;
    });
    initScrollTop();
}

function initOverlays(){
    $("#fast_view").overlay({
        top: 0,
        closeOnClick: true,
        oneInstance: false,
        load: false,
        mask: {
            color: '#000',
            loadSpeed: 200,
            opacity: 0.4,
            zIndex:1540
        },
        onClose: function() {
            fastViewClose();
        }
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
            zIndex:1540
        },
        onClose: function() {
            cartViewClose();
        }
    });
    $("#cart_add_ok").overlay({
        top: 200,
        closeOnClick: true,
        oneInstance: false,
        load: false
    });
    $("#saved_add_ok").overlay({
        top: 200,
        closeOnClick: true,
        oneInstance: false,
        load: false
    });
    $("#sku_shooser").overlay({
        top: 200,
        closeOnClick: true,
        oneInstance: false,
        load: false
    });
    $("#cart_add_additional").overlay({
        top: 200,
        closeOnClick: true,
        oneInstance: false,
        load: false
    });
    $("#region").overlay({
        top: 50,
        closeOnClick: true,
        oneInstance: false,
        load: false
    });
    $("#video_overlay").overlay({
        top: 50,
        closeOnClick: true,
        oneInstance: false,
        load: false,
        mask: {
            color: '#000',
            loadSpeed: 200,
            opacity: 0.4,
            zIndex:1540
        }
    });
}

var fast_view_product;

function initProduct(element, limitH){
    initNumber(element);
    $(element).find(".small_sku a").click(function(){
        checkSku($(this).parent());
        return false;
    });
    $(element).find(".image > a").click(function(){
        if($(this).parent().hasClass('video')){
            showVideo($(this));
        }else{
            setImage($(this).data('id'));
        }
        return false;
    });
    var tabs = $(element).find(".product_tabs");
    var t1 = tabs.find('.tab_1').html();
    var t2 = tabs.find('.tab_2').html();
    tabs.find('.tab_1').replaceWith(t2);
    tabs.find('.tab_2').replaceWith(t1);
    $(element).find(".tab_headers").tabs(".tab_contents > div");
    zoomer($(element).find("#product-image"), $(element).find("#enlarge_image"));
    setSku($(element).find(".add2cart_block").find('input[name="sku_id"]').val());
    add2CartClick($('.add2cart'));
    savelater($('.savelater'));
    initGallery();
    $(element).find('.protect').bind('copy', function(){return false;});
    if(limitH){
        //smallProductLimitHeight(element.find(".product_details"), 270, element.find("#product_info").data('url'))
        //limitHeight(element.find(".product_tabs"), 170, 'смотреть все')
    }
}

function initGallery(){
    var count = $("#product-gallery").find(".caroucel").find('.image').length;
    if(count>4){
        $('#product-gallery').find('.arrow').click(function(){
            movePreview($(this));
            return false;
        });
    }
    else{
        $("#product-gallery").find('.arrow').css('visibility', 'hidden');
    }
}

function clog(str){
    if (window.console) console.log(str);
}

function initNumber(element){
    $(element).find(".number").each(function(){
        makeNumber($(this));
    });
}

function setTopCategory(id){
    $(".cat_"+id).addClass('current');
}

function makeNumber(elem){
    elem.removeClass('number');
    elem.addClass('number_input');
    elem.wrap('<span class="number_block">');
    elem.after('<span class="number_buttons"><span class="number_up"></span><span class="number_down"></span></span>');
    elem.parent().find('.number_up').click(function(){
        var val = elem.val()*1;
        if(isNaN(val)) val = 0;
        val++;
        elem.val(val);
        elem.change();
        return false;
    });
    elem.parent().find('.number_down').click(function(){
        var val = elem.val()*1;
        if(isNaN(val)) val = 0;
        val--;
        if(val<=0)val = 1;
        elem.val(val);
        elem.change();
        return false;
    });
}

function imageArrowClick(el){
    var prod = $(el).parents('.small_product').first();
    var cur_index = 0;
    var img_array = prod.find('.images').find('span');
    img_array.each(function(index, e){
        if($(this).hasClass('current')){
            cur_index = index;
            $(this).removeClass('current');
        }
    });
    if($(el).hasClass('left')){
        cur_index--;
    }
    else{
        cur_index++;
    }
    if(cur_index<0){
        cur_index = img_array.length-1;
    }
    if(cur_index>img_array.length-1){
        cur_index = 0;
    }
    img_array.each(function(index, e){
        if(index==cur_index){
            $(this).addClass('current');
            prod.find('.image').find('img').attr('src', $(this).data('src'));
        }
    });
}

function fastView(el){
    var prod = $(el).parents('.small_product').first();
    var id = prod.data('id');
    fast_view_array = $(el).parents('.products').first().data('fastview');
    fastViewShow(id);
}

function fastViewShow(id){
    is_fast_view = true;
    flowHeader();
    $("#fast_view").overlay().load();
    $("#product_fast_info").html("<div class='loading'></div>");
    $.get('/fastview/'+id, function(data){
        var cont = $(data).find("#product_info");
        $("#product_fast_info").html(cont);
        fast_view_id = id;
        appendFastViewButtons();
        initProduct($("#product_fast_info"), true);
    });
}

function appendFastViewButtons(){
    if (typeof fast_view_array[1] != 'undefined'){
        if(fast_view_array[1]!=fast_view_id){
            $("#product_fast_info").append("<a href='#' class='big_larr'></a>");
        }
    }
    if(fast_view_array[fast_view_array.length-1]!=fast_view_id){
        $("#product_fast_info").append("<a href='#' class='big_rarr'></a>");
    }
}

function fastViewNext(){
    var n = 0;
    var length = fast_view_array.length,
        element = null;
    for (var i = 0; i < length; i++) {
        element = fast_view_array[i];
        if(fast_view_id==element){
            n = i;
        }
    }
    n++;
    if(n>=fast_view_array.length){
        n = 1;
    }
    fastViewShow(fast_view_array[n]);
}

function fastViewPrev(){
    var n = 0;
    var length = fast_view_array.length,
        element = null;
    for (var i = 0; i < length; i++) {
        element = fast_view_array[i];
        if(fast_view_id==element){
            n = i;
        }
    }
    n--;
    if(n<=0){
        n = fast_view_array.length-1;
    }
    fastViewShow(fast_view_array[n]);
}

function checkSku(elem, dont_set_image){
    dont_set_image = dont_set_image || 0;
    $(".product_skus").find('.checked').removeClass('checked');
    elem.addClass('checked');
    $(".add2cart_block").find('input[name="sku_id"]').val(elem.data('id'));
    $("#product_price").text(elem.data('price-text'));
    $("#product_price").data('price', elem.data('price'));
    $("#product_sku").text(elem.data('sku'));
    $("#compare_price").text(elem.data('compare-price-text'));
    if((elem.data('compare-price')>0)&&(elem.data('compare-price')>elem.data('price'))){
    }
    else{
        $("#compare_price").text('');
    }
    if(dont_set_image==0){
        setImage(elem.data('image-id'));
    }
    checkCart($('.add2cart'));
}

function setImage(image_id){
    if(image_id>0){
        var src = $("#product-image-"+image_id).data('fullimg');
        $("#product-image").attr('src', src);
        $("#product-image-enl").attr('src', $("#product-image-"+image_id).data('enlarge'));
    }
}

function setSku(id){
    checkSku($("#sku_"+id), 1);
}

function zoomer(small_el, big_el){
    function showZoom(){
        square.show();
        $(big_el).show();
    }
    function hideZoom(){
        square.hide();
        $(big_el).hide();
    }
    var big_square = $(big_el).width();
    $(big_el).hide();
    var container = $(small_el).wrap('<div class="zoom_container">');
    var sm_sqr = $('<div class="small_square"></div>');
    $(small_el).after(sm_sqr);
    var square = $(small_el).parent().find('.small_square');
    var big_img = $(big_el).find('img').first();
    $(small_el).hover(function(){
        zoom_hover = true;
    }, function(){
        zoom_hover = false;
    });
    $(sm_sqr).hover(function(){
        zoom_hover = true;
    }, function(){
        zoom_hover = false;
    });
    $(window).mousemove(function(event) {
        var offset = $(small_el).offset();
        var show = true;
        if(offset){
            if(event.pageX<offset.left)show = false;
            if(event.pageY<offset.top)show = false;
            if(event.pageX>offset.left+$(small_el).width())show = false;
            if(event.pageY>offset.top+$(small_el).height())show = false;
        }
        else{
            show = false;
        }
        if(show&&zoom_hover){
            var koeff = $(big_img).width()/$(small_el).width();
            var small_square = Math.round(big_square/koeff);
            var width = small_square;
            var height = small_square;
            if(width>$(small_el).width())width=$(small_el).width();
            if(height>$(small_el).height())height=$(small_el).height();
            square.width(width);
            square.height(height);
            showZoom();
            var relativeX = Math.round(event.pageX-offset.left);
            var relativeY = Math.round(event.pageY-offset.top);
            smallX = (relativeX-small_square/2);
            smallY = (relativeY-small_square/2);
            if(smallX>$(small_el).width()-small_square)smallX = $(small_el).width()-small_square;
            if(smallY>$(small_el).height()-small_square)smallY = $(small_el).height()-small_square;
            if(smallX<0)smallX = 0;
            if(smallY<0)smallY = 0;
            square.css('left', smallX+'px');
            square.css('top', smallY+'px');
            bigX = smallX*koeff;
            bigY = smallY*koeff;
            $(big_img).css('margin-left', -1*bigX);
            $(big_img).css('margin-top', -1*bigY);
        }
        else{
            hideZoom();
        }
    });
}

function add2CartClick(el){
    $(el).click(function(){
        if($(this).hasClass('disabled')){
            cartAddAdditional(el);
        }
        else{
            add2Cart(el, true)
        }
        return false;
    });
}

function add2Cart(el, dasable_button){
    var f = $(el).parents('form').first();
    var image = $(el).parents('.product_info').first().find('.product_image').find('img');
    cartAnimate(el);
    processAdd2Cart(f, image);
    if(dasable_button){
        checkCart(el);
    }
}

function processAdd2Cart(form, image){
    var f = form;
    cart_items.push(f.find('input[name="sku_id"]').val());
    imageAnimate(image);
    $.post(f.attr('action'), f.serialize(), function (response) {
        if (response.status == 'ok') {
            add2CartPreview(form.parents('.product_data').first(), response.data.item_id);
            updateCartSmall(response.data);
            afterAdd2Cart();
            //cartAddOK();
        }
        if (response.data.error) {
            alert(response.data.error);
        }
    }, "json");
}

function add2CartPreview(block, item_id){
    var item = {
        item_id: item_id*1,
        id: block.find('input[name="product_id"]').val()*1,
        img: block.find('.pc_image').html(),
        sku: (block.find('input[name="sku_id"]').val()*1+10000),
        name: block.find('.pc_name').text(),
        price: block.find('.price').data('price'),
        price_text: block.find('.price').text(),
        url: block.data('url'),
        qtty: block.find('input[name="quantity"]').val()
    }
    var length = cart_items_full.length,element = null;
    var pos = -1;
    for (var i = 0; i < length; i++) {
        element = cart_items_full[i];
        if(element.item_id==item_id){
            pos = i;
        }
    }
    if(pos>=0){
        cart_items_full[pos].qtty++;
    }
    else{
        cart_items_full.push(item);
    }
    generateCart();
}

function delCartPreview(item_id){
    var length = cart_items_full.length,
        element = null;
    var pos = -1;
    for (var i = 0; i < length; i++) {
        element = cart_items_full[i];
        if(element.item_id==item_id){
            pos = i;
        }
    }
    cart_items_full.splice(pos,1);
}

function logCartPreview(){
    var length = cart_items_full.length,
        element = null;
    for (var i = 0; i < length; i++) {
        clog(cart_items_full[i]);
    }
}

function afterAdd2Cart(){
    if (typeof is_cart_page != 'undefined'){
        // мы в корзине
        location.href=location.href;
    }
}

function savelater(el){
    $(el).click(function(){
        var f = $(el).parents('form').first();
        $.post('/saved/add/', f.serialize(), function (response) {
            if (response.status == 'ok') {
                savedAddOK();
            }
            if (response.data.error) {
                alert(response.data.error);
            }
        }, "json");
        return false;
    });
}

function updateCartSmall(data){
    if(data.count>0){
        $(".cart_count").text(data.count_text);
        $(".cart_total").text(data.total);
        $(".cart_empty").hide();
        $(".cart_notempty").show();
        if ((typeof cart_page != 'undefined')&&cart_page){
            $(".cart_link").hide();
        }
        else{
            $(".cart_link").show();
        }
        cart_total = data.total;
    }
    else{
        $(".cart_empty").show();
        $(".cart_notempty").hide();
        $(".cart_link").hide();
    }
    generateCart();
}

function cartAddOK(){
    $("#cart_add_ok").overlay().load();
    var obj = $("#cart_add_ok").find('.animation');
    obj.css('width', 0);
    setTimeout(function(){
        obj.animate({width:'64'}, 300);
    }, 150);
}

function cartAddAdditional(el){
    var f = $(el).parents('form').first();
    var sku_id = f.find('input[name="sku_id"]').val();
    var product_id = f.find('input[name="product_id"]').val();
    var f2 = $("#cart_add_additional").find('form').first();
    f2.find('input[name="sku_id"]').val(sku_id);
    f2.find('input[name="product_id"]').val(product_id);
    $("#cart_add_additional").overlay().load();
}

function savedAddOK(){
    var count = $("#saved_count").data('count');
    count++;
    $("#saved_count").data('count', count);
    $("#saved_count").text("("+count+")");
    $("#saved_add_ok").overlay().load();
    var obj = $("#saved_add_ok").find('.animation');
    obj.css('width', 0);
    setTimeout(function(){
        obj.animate({width:'64'}, 300);
    }, 150);
}

function cartAnimate(el){
    var span = $('<input class="button" type="submit">');
    span.val($(el).val());
    span.css('position', 'absolute');
    span.css('left', $(el).offset().left);
    span.css('top', $(el).offset().top);
    span.css('z-index', 1700);
    $('body').append(span);
    span.animate({
        opacity:0
    }, 800, function(){
        span.remove();
    });
}

function imageAnimate(el){
    if (typeof el.attr('src') != 'undefined'){
        var span = $('<img>');
        span.attr('src', el.attr('src'));
        span.css('position', 'absolute');
        span.css('left', el.offset().left);
        span.css('top', el.offset().top);
        span.css('height', el.height());
        span.css('z-index', 17000);
        $('body').append(span);
        var cart_el = $('#cart-summary');
        if($("#float_header").hasClass('visible')){
            cart_el = $('#fl_cart');
        }
        span.animate({
            left: cart_el.offset().left,
            top: cart_el.offset().top,
            height:64
        }, 500, function(){
            span.remove();
        });
    }
}

function test(){
    cartAnimate($('.add2cart'));
}

function checkCart(el){
    var f = $(el).parents('form').first();
    var cur_sku = f.find('input[name="sku_id"]').val();
    var found = false;

    var length = cart_items.length;
    for (var i = 0; i < length; i++) {
        if(cart_items[i]==cur_sku){
            found = true;
        }
    }
    if(found){
        $(el).addClass('disabled');
        $(el).attr('value', 'Уже в корзине');
    }
    else{
        $(el).removeClass('disabled');
        $(el).attr('value', 'Добавить в корзину');
    }
}

function chooseShipping(id){
    $(".shipping_options").find('.chosen').removeClass('chosen');
    $(".shipping_"+id).addClass('chosen');
    $("#shipping_id").attr("value", id);
    $(".order_finish").hide();
    $.post($("#checkout_form").attr('action'), $("#checkout_form").serialize(), function(result){
        $(".order_finish").show();
    });
}

function btnLoading(elem){
    var newel = $('<span class="btn_loading"></span>');
    $(elem).replaceWith(newel);
}

function btnLoadingStop(){
    $('span.btn_loading').remove();
}

function scrollToElement(element){
    $('html, body').animate({
        scrollTop: $(element).offset().top
    }, 1000);
}

function setPhoneValidator(element){
    //$(element).addClass('phone_prefix');
    $(element).msk("+7 (999) 999-99-99", {empty_string:"7 ___ _______"});;
}

function setEmailValidator(element){
    var domains = ['gmail.com', 'mail.ru', 'list.ru', 'inbox.ru', 'yandex.ru'];
    $(element).on('focus', function(){
        element.parent().find('.short_msg').remove();
    });

    $(element).on('blur', function() {
        $(this).mailcheck({
            domains: domains,
            suggested: function(el, suggestion) {
                var a = $('<span>'+suggestion.full+'</span>');
                a.click(function(){
                    element.val(suggestion.full);
                    element.parent().find('.short_msg').remove();
                });
                a.css('cursor', 'pointer');
                var html = $('<span class="short_msg hintmsg">Возможно вы имели в виду </span>');
                html.append(a);
                $(el).after(html);
            },
            empty: function(el) {
                var html = '<span class="short_msg hintmsg">Недопустимый email</span>';
                //$(el).after(html);
            }
        });
    });
}

function movePreview(element){
    var caroucel = $("#product-gallery").find(".caroucel");
    var margin = parseInt(caroucel.css('marginLeft'));
    var width = caroucel.find('.image').outerWidth(true);
    var images_visible = Math.round($("#product-gallery").find('.caroucel_container').width()/width);
    if(margin>0)margin = 0;
    var img_count = caroucel.find('.image').length;
    if(img_count>images_visible){
        img_num = Math.abs(Math.round(margin/width));
        if(element.hasClass('right')){
            img_num++;
            if(img_num>img_count-images_visible)img_num = 0;
        }
        if(element.hasClass('left')){
            img_num--;
            if(img_num<0)img_num = img_count-images_visible;
        }
        setCaroucellPos(img_num);
    }
}

function setCaroucellPos(img_num){
    var correction = -1;
    var caroucel = $("#product-gallery").find(".caroucel");
    var margin = img_num*(caroucel.find('.image').outerWidth(true))-correction;
    var img_count = caroucel.find('.image').length;
    caroucel.animate({'margin-left':-margin}, 300);
}

function setPromo(type, element){
    if(type=='Новинка'){
        addPromo('new', element);
    }
    if(type=='Хит продаж'){
        addPromo('hit', element);
    }
}

function addPromo(type, element){
    $(document).ready(function () {
        $(element).each(function(){
            if(!$(this).find('.promo').hasClass(type)){
                $(this).find('.image_main').prepend('<div class="promo '+type+'"></div>');
            }
        });
    });
}

function limitHeight(element, height, btntext){
    $(document).ready(function () {
        var fade = element.wrap("<div class='fade'></div>").parent();
        var fade_block = fade.wrap("<div class='fade_block'></div>").parent();
        var switcher = $("<div class='switcher_block'><a href='#' class='switcher'>"+btntext+"</a></div>");
        var fade_img = $("<div class='fade_img'></div>");
        fade.append(fade_img);
        element.css('overflow', 'hidden');
        element.height(height);
        fade.height(height);
        $(switcher).find('.switcher').click(function(){
            if ($(fade).hasClass('visible')){
                $(element).removeClass('visible');
                $(fade).removeClass('visible');
                $(this).text(btntext);
                fade_img.show();
            }
            else{
                $(element).addClass('visible');
                $(fade).addClass('visible');
                $(this).text('свернуть');
                fade_img.hide();
            }
            return false;
        });
        fade_block.append(switcher);
    });
}

function smallProductLimitHeight(element, height, url){
    $(document).ready(function () {
        var switcher = $("<div class='switcher_block'><a href='"+url+"' class='switcher'>смотреть полностью</a></div>");
        element.after(switcher);
        if(element.height()>height){
            var fade_img = $("<div class='fade_img'></div>");
            element.after(fade_img);
            element.css('overflow', 'hidden');
            element.height(height);
        }
    });
}

function cutText(text, n) { //56
    var short = text.substr(0, n);
    if (/^\S/.test(text.substr(n)))
        return short.replace(/\s+\S*$/, "")+'...';
    return short;
}

function smallProductsInit(element){
    element.find('.small_product').each(function(){
        var real_height = $(this).find('.name_limiter').height();
        var allow_height = $(this).find('.name').height();
        if(real_height>allow_height){
            var new_height = real_height;
            var counter = 80;
            while(new_height>allow_height){
                var new_text = cutText($(this).find('.name_limiter').text(), counter);
                $(this).find('.name_limiter').text(new_text);
                new_height = $(this).find('.name_limiter').height();
                counter--;
                if(counter<10) break;
            }
        }
        var sm_pr = $(this);
        $(this).find('.add2cart_small').click(function(){
            smallAdd2Cart(sm_pr);
            return false;
        });
    });
    element.find(".discount").tooltip({position: "bottom center",offset:[5,0]});
}

function showRegion(){
    var id = $(".region_name").data('id');
    /*
     $(".region_name").replaceWith($("#region_chooser").html());
     $(".delivery_city").find('.region').find("[value='"+id+"']").attr("selected", "selected");
     $(".delivery_city").find('.region').click();
     $(".delivery_city").find('.region').focus();
     $(".delivery_city").find('.region').change(function(){
     setRegion($(this))
     });
     $(".delivery_city").find('.region').blur(function(){
     setRegion($(this))
     });
     */
    $("#region").overlay().load();
}

function setRegion(element){
    var id = element.data('code');
    $.removeCookie('region');
    $.cookie("region", id, { expires : 365 , path: '/' });
    var text = element.text();
    var span = $('<span>'+text+'</span>');
    span.click(function(){
        showRegion();
        return false;
    });
    span.addClass('region_name');
    span.data('id', id)
    $("#region_name").html(span);
}

function smallAdd2Cart(element){
    var skus = element.find('.skus').first().find('div');
    if(skus.length==1){
        var form = element.find('.addtocart').first();
        var image = element.find('.image').find('img').first();
        processAdd2Cart(form, image)
    }
    else{
        var block = $("#sku_shooser");
        block.find('.ov_sku_image').html('');
        var img = $("<img>");
        img.attr('src', element.find('.image').find('img').first().attr('src'))
        block.find('.ov_sku_image').html(img);
        block.find('input[name="product_id"]').val(element.data('id'));

        var sku_block = block.find('.ov_skus').first();
        sku_block.html('');
        element.find('.skus').find('div').each(function(){
            var bl = $("<div>");
            bl.data('id', $(this).data('id'));
            bl.data('image', $(this).data('image'));
            bl.data('price-text', $(this).data('price-text'));
            bl.data('price', $(this).data('price'));
            bl.addClass('small_sku');
            var sku = $('<a>');
            sku.attr('href', '#');
            if($(this).data('sku-image')!=''){
                var img2 = $('<img>');
                img2.attr('src', $(this).data('sku-image'));
                sku.html(img2);
                bl.addClass('sku_image');
            }
            else{
                sku.text($(this).data('name'));
            }
            sku.click(function(){
                var link = $(this).parent();
                block.find(".ov_skus").find('.checked').removeClass('checked');
                link.addClass('checked');
                block.find('input[name="sku_id"]').val(link.data('id'));
                if(link.data('image')!=''){
                    block.find('.ov_sku_image').find('img').attr('src', link.data('image'));
                }
                block.find('.ov_price').text(link.data('price-text'));
                block.find('.ov_price').data('price', link.data('price'));
                return false;
            });
            bl.append(sku);
            sku_block.append(bl);
        });
        sku_block.find('a').first().click();
        block.overlay().load();
    }
}

function setInit(element){
    smallProductsInit(element);
}

function initBrands(){
    $(".brandtags").find('a').click(function(){
        filterBrands($(this));
        return false;
    });
}

function filterBrands(el){
    $(".brandtags").find(".selected").removeClass("selected");
    el.addClass("selected");
    var id = el.data('id');
    var category_id = el.data('category');
    $(".brands_list").find(".small_brand").each(function(){
        var tags = $(this).data('brandtags');
        var link = $(this).data('link');
        var new_link = link;
        if(category_id>0){
            new_link = link+"?category="+category_id;
        }
        $(this).find("a").each(function(){
            $(this).attr("href", new_link);
        });
        if($.inArray(id, tags)>=0){
            $(this).show();
        }
        else{
            $(this).hide();
        }
    });
}

function flowHeader(){
    var top = $(document).scrollTop();
    var length = cart_items_full.length;
    var cart_empty = true;
    if (typeof cart_page != 'undefined'){
    }
    else{
        cart_page = false;
    }
    if(length>0)cart_empty = false;
    if((top>30)&&(!is_fast_view)&&(!cart_empty)&&(!cart_page)){
        $("#cart-summary").addClass('fixed');
    }
    else{
        $("#cart-summary").removeClass('fixed');
    }
}

function generateCart(){
    var html = "";
    var length = cart_items_full.length,
        element = null;
    for (var i = 0; i < length; i++) {
        element = cart_items_full[i];
        html += "<div class='sc_item' data-id='"+element.item_id+"'>";
        html += "<div class='sc_item_del'><a href='#' class='delete'></a></div>";
        html += "<div class='sc_item_img'>";
        html += "<a href='"+element.url+"'>";
        html += element.img;
        html += "</a>";
        html += "</div>";
        html += "<div class='sc_item_text'>";
        html += "<a href='"+element.url+"'>";
        html += "<span class='sc_item_name'>("+element.sku+") "+element.name+"</span>";
        html += "</a>";
        html += "</div>";
        html += "<div class='sc_item_qtty'>"+element.qtty+" x "+element.price_text+"</div>";
        html += "</div>";
    }
    html = "<div class='sc_items'>"+html+"</div>";
    var link = $('<a class="button small sc_link" href="/cart/">Оформить заказ</a>');
    link.click(function(){
        showCart();
        return false;
    });
    html += "<div class='sc_total'>Итого: <b>"+cart_total+"</b></div>";
    $(".cart_preview").html(html);
    $(".cart_preview").find('.sc_total').prepend(link);
    $("#fl_cart").html($("#cart-summary").clone());
}

function cartMouseIn(el){
    window.clearTimeout(cart_timer);
    var length = cart_items_full.length;
    var cart_empty = true;
    if(length>0)cart_empty = false;
    if(!cart_empty){
        cart_timer = setTimeout(function(){
            if(el.hasClass(".cart_preview")){
                el.slideDown(300);
            }
            else{
                el.find(".cart_preview").slideDown(300);
            }
        }, 500);
    }
}

function cartMouseOut(el){
    window.clearTimeout(cart_timer);
    cart_timer = setTimeout(function(){
        if(el.hasClass(".cart_preview")){
            el.slideUp(300);
        }
        else{
            el.find(".cart_preview").slideUp(300);
        }
    }, 500);
}

function fastViewClose(){
    is_fast_view = false;
    flowHeader();
}

function formAjax(button, form, container, result_container_id, params, callback){
    var url = form.attr('action');
    var data = form.serialize()+params;
    button.click(function(){
        $.post(url, data, function(result){
            var cont = $($.parseHTML(result)).filter(result_container_id);
            container.html(cont);
            if(callback && getClass.call(callback) == '[object Function]'){
                callback();
            }
        });
        return false;
    });
}

function infoHoverInit(){
    var el = $(".info_hover");
    var tooltip = $("#hover_tooltip");
    el.live('mouseover', function(){
        var text = $(this).html();
        $(this).data('html', text);
        tooltip.html(text);
        $(this).html(tooltip);
        tooltip.show();
        $(this).addClass('hovered');
        var top = tooltip.outerHeight()/2-8;
        clog(top);
        tooltip.css('top', -top);
    });
    el.live('mouseout', function(){
        tooltip.hide();
        tooltip.html('');
        $(this).html($(this).data('html'));
        $(this).removeClass('hovered');
    });
}

function menuInit(){
    initBrandsMenu();
    $('.top_lvl1 > li').each(function(){
        $(this).hover(function(){
            current_menu_item = $(this);
            $(this).addClass('current');
            if($(this).hasClass('category_link')){
                $(".sm_left > ul").hide();
                $(".sub_big").show();
                $(".sub_small").hide();
                var el = $(".sm_left > ul.parent_"+$(this).data('category-id'));
                el.show();
                showSubMenu(el.find("li:first"), 1);
                openMenu();
            }
            if($(this).hasClass('menu_link')){
                var el = $(".sub_menu > .sub_small > div.parent_"+$(this).data('category-id'));
                el.show();
                $(".sub_big").hide();
                $(".sub_small").show();
                openMenu();
            }
        }, function(){
            closeMenu();
        });
    });
    $(".sub_menu").hover(function(){
        openMenu();
    }, function(){
        closeMenu();
    });

    $('.sm_left > ul > li').each(function(){
        $(this).hover(function(){
            showSubMenu($(this), 300);
        }, function(){
            if(submenu_timer) clearTimeout(submenu_timer);
        });
    });
}

function initBrandsMenu(){
    var bl = $("#brand_letters").clone(true);
    bl.attr('id', 'brand_letters_top');
    bl.removeClass('hidden');
    $(".mainmenu").find('.brands').addClass('menu_link').data('category-id', 'brands');
    bl.wrap('<div class="parent_brands" />');
    $(".sub_menu > .sub_small").append(bl);
    bl.find('.brand_abbr').find('a').hover(function(){
        var cl = '.menu_bl_'+$(this).text();
        if(brandmenu_timer) clearTimeout(brandmenu_timer);
        brandmenu_timer = setTimeout(function(){
            bl.find('.brands_letter_list').hide();
            bl.find(cl).show();
        }, 300);
    }, function(){
        if(brandmenu_timer) clearTimeout(brandmenu_timer);
    });
}

function openMenu(){
    current_menu_item.addClass('current');
    if(menu_timer) clearTimeout(menu_timer);
    menu_timer = setTimeout(function(){$('.sub_menu').show();}, 300);
}

function closeMenu(){
    current_menu_item.removeClass('current');
    if(menu_timer) clearTimeout(menu_timer);
    menu_timer = setTimeout(function(){
        $('.sub_menu').hide();
    }, 300);
}

function showSubMenu(element, t){
    if(submenu_timer) clearTimeout(submenu_timer);
    submenu_timer = setTimeout(function(){
        $(".sm_left > ul > li.current").removeClass('current');
        element.addClass('current');
        $(".sm_center > div").hide();
        var el = $(".sm_center > div.parent_"+element.data('category-id'));
        el.show();
        $(".sm_right > .day_product").hide();
        var product_el = $(".sm_right > div.day_product_"+element.data('category-id'));
        if(product_el.length>0){
            product_el.show();
            el.parent().addClass('with_product');
        }
        else{
            el.parent().removeClass('with_product');
        }
    }, t);
}

function lazyLoadHeader(){
    $.get('/null/', function(data){
        $("#cart-summary").html($(data).find("#cart-summary"));
        $("#top_menu").html($(data).find("#top_menu"));
        menuInit();
    });
}


function initComments(){
    $('#comment_submit').click(function(){
        var button = $(this);
        button.attr('disabled', true).next().show();

        var container = $('.comment-form');
        var form = $('.comment-form form');
        $.post(form.attr('action')+'?json=1', form.serialize(), function(response){

            button.attr('disabled', false).next().hide();

            if (response.status && response.status == 'ok' && response.data.redirect) {
                window.location.replace(response.data.redirect);
                window.location.href = response.data.redirect;
                return;
            }
            if ( response.status && response.status == 'ok' && response.data) {
                var template = $(response.data.template);
                var count_str = response.data.count_str;

                var target;
                if (container.prev().is('.comments')) {
                    target = container.prev('.comments').children('ul');
                } else {
                    target = container.parent();
                    if (!target.next('ul').size()) {
                        target.after('<ul class="menu-v with-icons"></ul>');
                    }
                    target = target.next('ul');
                }

                target.append( $('<li />').append(template) );
                move_form_add('.comments', 0);

                $('.not-comment').remove();
                $('.comment-count').show().html(count_str);

                template.trigger('plugin.comment_add');
                form_refresh(true);
            } else if( response.status && response.status == 'fail' ) {
                form_refresh();
                var errors = response.errors;
                $(errors).each(function($name){
                    var error = this;
                    for (name in error) {
                        var elem = $('.comment-form form').find('[name='+name+']');
                        elem.after($('<em class="errormsg"></em>').text(error[name])).addClass('error');
                    }
                });
            }
            else {
                form_refresh(false);
            }

        }, "json")
            .error(function(){
                form_refresh(false);
            });
        return false;
    });
}

function form_refresh(empty){
    var form = $('.comment-form');
    form.find('.errormsg').remove();
    form.find('.error').removeClass('error');
    form.find('.wa-captcha-refresh').click();

    if (empty) {
        form.find('textarea').val('');
    }
}

function openLink(element){
    element.parentsUntil("div").removeClass('closed');
}

function initPagesSidebar(element, url){
    element.find('li').each(function(){
        if($(this).find(">a").attr('href')==url){
            $(this).addClass('current');
        }
    });
    element.find(".pages_block").each(function(){
        if($(this).find('.current').length>0){

        }
        else{
            $(this).hide();
        }
    });
}

function initScrollTop(){
    var to_top_button = $('<div class="to_top" ><div class="to_top_panel" title="Наверх"><div class="to_top_button"><span class="arrow">&uarr;</span> <span class="label">наверх</span></div></div></div>')
    $('body').append(to_top_button);
    $('.to_top_panel', to_top_button).click(function(){
        $('html, body').animate({scrollTop: (0)}, 500);
    });
    var show = false;
    $(window).scroll(function () {
        if( this.pageYOffset > 0){
            if(!show){
                to_top_button.show();
                show = true
            }
        }else{
            if(show){
                to_top_button.hide();
                show = false
            }
        }
    })
    function mini_or_normal_width(){
        if( $(window).width() < 1330 ){ // если экран маленький - показываем мини панель
            to_top_button.addClass('mini')
        }else{                          // если экран нормальный - показываем нормальную панель
            to_top_button.removeClass('mini')
        }
    }
    $(window).resize(function() {
        mini_or_normal_width()
    });
    mini_or_normal_width()
}

function scrollToLetter(letter){
    var el = $(".letter_"+letter);
    if(el.length>0){
        $('html, body').animate({scrollTop: (el.offset().top-30)}, 500);
    }
}

function initBrandsScroll(){
    $(document).ready(function () {
        $(".brands_letters").find('a').click(function(){
            scrollToLetter($(this).text());
        });
    });
    var hash = location.hash.substring(1);
    if(hash!=''){
        scrollToLetter(hash);
    }
}

function initMultiAddress(){
    var name = 'address';
    element = $(".wa-field-address");
    var total = element.find('.field_separator').length;
    if(total>1){
        element.find('.field_separator_0').remove();
        element.find('.multi_block_0').remove();
    }
    element.find('.field_separator').each(function(){
        var value = element.data('ext-'+$(this).data('id'));
        if(total>1){
            var html1 = '<div class="wa-field"><div class="wa-value"><input type="submit" value="Удалить" class="button red" name="delete['+name+']['+$(this).data('id')+']"></div></div>';
            if($(this).data('id')>0){
                $(this).after(html1);
            }
        }
    });
    var html = ' <input type="submit" value="Добавить" class="button small" name="add['+name+']">';
    element.find("> .wa-name").append(html);
}

function initMultiPart(element, name, value, total){
}

function showVideo(element){
    var html = element.data('html');
    $("#video_overlay").find('.overlay_video_container').html(html);
    $("#video_overlay").overlay().load();
}/**
 * Created by vadimz on 14.08.14.
 */
