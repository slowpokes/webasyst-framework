$(document).ready(function () {

    $(".sidebar_link").click(function () {
        var li = $(this).parent();
        if (li.hasClass('closed')) {
            console.log(1);
            li.removeClass('closed');
        }
        else {
            li.addClass('closed');
            console.log(2);
            li.find('li').addClass('closed');
        }
        return false;
    });


    $('.product-list li').live("hover", function () {
        if (!$(this).hasClass('main_block')) {
            $(this).find('.add_cart').show();
            $(this).find('.prices').css('color', '#F4731E');
            $(this).find('.badge_sex').show();
            if ($(this).find('.sku_images').children('.image').length != 0) {
                $(this).find('.sku_images').show();
            }
        }
    });


    $('.product-list li').live("mouseleave", function () {
        if (!$(this).hasClass('main_block')) {
            $(this).find('.add_cart').hide();
            $(this).find('.prices').css('color', '#444');
            $(this).find('.sku_images').hide();
            $(this).find('.badge_sex').hide();
            var main_image = $(this).find('.imagess').children('img');
            var default_image_img = $(this).find('.imagess').children('.default_image').children('img').attr('src');
            main_image.attr('src', default_image_img);

        }

    });


    $('.product-list li .igm').live("hover", function () {
        var href = $(this).attr('href');
        var img = $(this).data('small');
        var main_image = $(this).parents('a').children('.imagess').children('img');
        main_image.attr('href', href);
        main_image.attr('src', img);
    });


    /* $("#auth_login").click(function () {
     $("#fast_cart_view").overlay().load();
     $.get('/login/', function (data) {
     var cont = $($.parseHTML(data)).find(".authform-container");
     $("#cart_fast_info").html(cont);
     });
     });*/

    // Add Active Class To Current Link
    var url = window.location.pathname; // get current URL
    $('.main_menu a[href="' + url + '"]').addClass('activeV');

    var $activeUL = $('.activeV').closest('ul');
    /*
     Revise below condition that tests if .active is a submenu
     */
    if ($activeUL.attr('class') != 'main_menu') { //check if it is submenu

        console.log($activeUL.parents('.firstli').children('a'));
        $activeUL.parents('.firstli').children('a').addClass('activeV');
    }

    function openLink(element) {
        element.parentsUntil("div").removeClass('closed');
    }

    $.get('/data/shippingheader/', function (result) {

        var $city_header = $(result).find(".city_header").html();
        var $date_header = $(result).find(".date_header").html();
        $(".city_container").html($city_header);
        $(".date_container").html($date_header);
        if ($.cookie('region_name')) {
            $(".region_name").html($.cookie('region_name'));
            $(".region_name").attr('data-id', $.cookie('region_name_id'));
        }
        var current_id = $("#region_name").data('id');
        shippingHeaderChange(current_id);

    });


    $("body").click(function (event) {
        if ($(event.target).closest(".wrapper_cart").length || $(event.target).closest(".cart_panel").length) return;
        $(".cart_panel").slideUp("fast");
        event.stopPropagation();
    });


    /**
     * Menu
     */

    jQuery.fn.hoverWithDelay = function (inCallback, outCallback, delay) {
        this.each(function (i, el) {
            var timer;
            $(this).hover(function () {
                timer = setTimeout(function () {
                    timer = null;
                    inCallback.call(el);
                }, delay);
            }, function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                } else
                    outCallback.call(el);
            });
        });
    };

    $('.firstli').hoverWithDelay(function () {
        $('ul', this).show();
        $('a', this).addClass("active");
    }, function () {
        $('ul', this).hide();
        $('a', this).removeClass("active");
    }, 200);


    // scroll-dependent animations
    function updateCartSummaryFixedStatus() {
        if ($(window).scrollTop() >= 45) {
            if (!$("#cart-summary").hasClass('empty')) {
                $("#cart-summary").addClass("fixed");
                $(".cart_panel").hide();
            }
        }
        else if ($(window).scrollTop() < 40) {
            $("#cart-summary").removeClass("fixed");
        }
    }

    $(window).scroll(function () {
        updateCartSummaryFixedStatus();
    });

    $('.dialog').on('click', 'a.dialog-close', function () {
        $(this).closest('.dialog').hide().find('.cart').empty();
        return false;
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $(".dialog:visible").hide().find('.cart').empty();
        }
    });

    $("#main").on('submit', '.product-list form.addtocart', function () {
        var f = $(this);
        if (f.data('url')) {
            console.log(f.data('url'));
            var d = $('#dialog');
            var c = d.find('.cart');
            console.log(c);
            c.load(f.data('url'), function () {
                c.prepend('<a href="#" class="dialog-close">&times;</a>');
                d.show();
                if ((c.height() > c.find('form').height())) {
                    c.css('bottom', '0');
                } else {
                    c.css('bottom', '0%');
                }

            });
            return false;
        }
        $.post(f.attr('action') + '?html=0', f.serialize(), function (response) {

            console.log(response);
            if (response.status == 'ok') {
                var cart_total = $(".cart-total");
                var cart_count = $(".cart-count");
                var cart_div = f.closest('.cart');
                cart_total.closest('#cart-summary').removeClass('empty');
                $('.cart-count').removeClass('empty');
                $('.cart_icon').attr('src', '/wa-apps/shop/themes/designsovkusom/img/basketon.png');
                updateCartSummaryFixedStatus();
                var clone = $('<div class="cart"></div>').append($('#cart-form').clone());
                console.log(clone);
                if (cart_div.closest('.dialog').length) {
                    console.log("true");
                    clone.insertAfter(cart_div.closest('.dialog'));
                } else {
                    console.log("false");
                    clone.insertAfter(cart_div);
                }
                if (f.closest(".product-list").get(0).tagName.toLowerCase() == 'table') {
                    var origin = f.closest('tr');
                    var block = $('<div></div>').append($('<table></table>').append(origin.clone()));
                } else {
                    var origin = f.closest('li');
                    var block = $('<div></div>').append(origin.html());
                }

                block.css({
                    'z-index': 10,
                    top: origin.offset().top,
                    left: origin.offset().left,
                    width: origin.width() + 'px',
                    height: origin.height() + 'px',
                    position: 'absolute',
                    overflow: 'hidden'
                }).insertAfter("#main").animate({
                    top: cart_total.offset().top,
                    left: cart_total.offset().left,
                    width: 0,
                    height: 0,
                    opacity: 0.5
                }, 500, function () {
                    $(this).remove();
                    cart_total.html(response.data.total);
                    cart_count.html(response.data.count);
                });
                if (response.data.error) {
                    alert(response.data.error);
                }
            } else if (response.status == 'fail') {
                alert(response.errors);
            }
            console.log("funcend");
        }, "json");

        return false;

    });

    $('.filters.ajax form input').change(function () {
        var f = $(this).closest('form');
        var url = '?' + f.serialize();
        console.log(url);
        $(window).lazyLoad && $(window).lazyLoad('sleep');
        $.get(url, function (html) {
            //  console.log(html);
            var tmp = $('<div></div>').html(html);
            $('#product-list').html(tmp.find('#product-list').html());
            if (!!(history.pushState && history.state !== undefined)) {
                window.history.pushState({}, '', url);
            }
            $(window).lazyLoad && $(window).lazyLoad('reload');
        });
    });
});


/*function initFilters(element){
 element.find(".filter-box").each(function(){
 if(!$(this).hasClass("filter-price")){
 var c = $(this).find(".filter-content");
 if(c.find(":checked").length==0){
 c.hide();
 }
 var n = $(this).find(".filter-name");
 if(!n.data('binded')){
 n.data('binded', true)
 n.click(function(){
 c.toggle();
 });
 }
 }
 });
 }
 */
/*---------------------------------
 Tabs
 -----------------------------------*/
// tab setup

$('.tab-content').addClass('clearfix').not(':first').hide();
$('ul.tabs').each(function () {
    var current = $(this).find('li.current');
    if (current.length < 1) {
        $(this).find('li:first').addClass('current');
    }
    current = $(this).find('li.current a').attr('href');
    $(current).show();
});

// tab click
$(document).on('click', 'ul.tabs a[href^="#"]', function (e) {
    e.preventDefault();
    var tabs = $(this).parents('ul.tabs').find('li');
    var tab_next = $(this).attr('href');
    var tab_current = tabs.filter('.current').find('a').attr('href');
    $(tab_current).hide();
    tabs.removeClass('current');
    $(this).parent().addClass('current');
    $(tab_next).show();
    history.pushState(null, null, window.location.search + $(this).attr('href'));
    return false;
});

// tab hashtag identification and auto-focus
var wantedTag = window.location.hash;
if (wantedTag != "") {
    // This code can and does fail, hard, killing the entire app.
    // Esp. when used with the jQuery.Address project.
    try {
        var allTabs = $("ul.tabs a[href^=" + wantedTag + "]").parents('ul.tabs').find('li');
        var defaultTab = allTabs.filter('.current').find('a').attr('href');
        $(defaultTab).hide();
        allTabs.removeClass('current');
        $("ul.tabs a[href^=" + wantedTag + "]").parent().addClass('current');
        $("#" + wantedTag.replace('#', '')).show();
    } catch (e) {
        // I have no idea what to do here, so I'm leaving this for the maintainer.
    }
}


/**
 *  TOP CART
 */


var timer;
$('.wrapper_cart').on({
    hover: function () {
        clearTimeout(timer);
        if (!$("#cart-summary").hasClass("empty")) {

            timer = setTimeout(function () {
                $.ajax({
                    url: "/panel/",
                    cache: false,
                    success: function (html) {
                        $(".cart_panel").html(html);
                        $(".cart_panel").show();

                    }
                });

            }, 200)
        }
    },
    mouseleave: function () {
        setTimeout(function () {
            if (!$(".wrapper_cart").is(":hover")) {
                $(".cart_panel").fadeOut();
            }
        }, 2000);
    }
});

/**
 * Переключение страниц и изменение url без
 */


$(function () {
    $('#nav_page > li > a').click(function (e) {
        e.preventDefault();
        var set_name = $(this).parent().data('set');
        var url_name = $(this).parent().data('url');
        $("#nav_page > li.current").removeClass('current');
        $(this).parent().addClass('current');
        $('.tabs-content').hide();
        $('#' + set_name).show();
        window.history.pushState($(this).attr('id'), "Title", url_name);


    });
});


$(".goto").hover(function () {
    console.log($("#" + this.id));
    //$("").removeClass("show_lvl3");
    $(".activ").removeClass("activ");
    $(".show_lvl3").removeClass("show_lvl3");
    $("#" + this.id).addClass("activ");
    $(".menu_" + this.id).addClass("show_lvl3");

});

$('.menubrand').mouseleave(function () {
    $(this).children('.goto').removeClass('activ');
    $(this).children('.block_brand').removeClass('show_lvl3');
});


$('body').on('click', 'form.addtocart .orange-button, .product-submit', function () {
    $(".cartheader").removeClass('deactivate');
    $('.cart_icon').attr('src', '/wa-apps/shop/themes/designsovkusom/img/basketon.png');
    $('.cart-count').removeClass('empty');
    var checked_sku = $(".sku_id:checked");
    var qty = $("#prod_qty").val();
    var count_sku = checked_sku.data('sku-count');
    var new_count_sku = count_sku - qty;
    checked_sku.attr('data-sku-count', new_count_sku);

});


$('.bx-wrapper li').live({
    hover: function () {
        $('.prices', this).hide();
        $('.show_details', this).show();
    },
    mouseleave: function () {
        $('.prices', this).show();
        $('.show_details', this).hide();

    }
});