$(document).ready(function () {

    $.get('/data/shippingheader/', function (result) {
        $(".apps").html(result);
        var current_id = $("#region_name").data('id');
        shippingHeaderChange(current_id);
    });
    function openLink(element){
        element.parentsUntil("div").removeClass('closed');
    }

    function shippingHeaderChange(region) {
        $.get('/data/shippingheader/?region=' + region, function (result) {
            $(".apps").html(result);

        });
    }



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
        console.log(1);
        $('ul', this).show();
        $('a', this).addClass("active");
    }, function () {
        $('ul', this).hide();
        $('a', this).removeClass("active");
    }, 100);


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
            var d = $('#dialog');
            var c = d.find('.cart');
            c.load(f.data('url'), function () {
                c.prepend('<a href="#" class="dialog-close">&times;</a>');
                d.show();
                if ((c.height() > c.find('form').height())) {
                    c.css('bottom', 'auto');
                } else {
                    c.css('bottom', '15%');
                }
            });
            return false;
        }
        $.post(f.attr('action') + '?html=0', f.serialize(), function (response) {
            if (response.status == 'ok') {
                console.log(response);
                var cart_total = $(".cart-total");
                var cart_count = $(".cart-count");
                cart_total.closest('#cart-summary').removeClass('empty');
                updateCartSummaryFixedStatus();
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
        $(window).lazyLoad && $(window).lazyLoad('sleep');
        $.get(url, function (html) {
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
 *  Plus and minis count
 */

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


/**
 *  TOP CART
 */

$('#cart_arrow').click(function () {
    $.ajax({
        url: "/panel/",
        cache: false,
        success: function (html) {
            $(".cart_panel").html(html);
            if ($(".cart_panel").hasClass("close")) {
                console.log("ifarrow");
                $(".cart_panel").css('display', 'none');
                $(".cart_panel").slideDown("slow");
                $(".cart_panel").removeClass("close");
            }
            else {
                console.log("ifarrow");
                $(".cart_panel").slideUp("slow");
                $(".cart_panel").addClass("close");
            }
        }
    });

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


$('form.addtocart .orange-button, .product-submit').click(function () {
    setTimeout(function () {

        $.ajax({
            url: "/panel/",
            cache: false,
            success: function (html) {
                $(".cart_panel").html(html);
                $(".cartheader").removeClass("deactivate");
                $("#cart-summary").removeClass("empty");

                if ($(".cart_panel").hasClass("close")) {
                    console.log("iforange");
                    $(".cart_panel").css('display', 'none');
                    $(".cart_panel").slideDown("slow");
                    $(".cart_panel").removeClass("close");
                }
                else {
                    console.log("elseorange");
                    $(".cart_panel").hide();
                    $(".cart_panel").slideDown("slow");

                }
            }
        });
    }, 1000); // время в мс
});



