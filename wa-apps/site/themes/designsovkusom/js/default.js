(function ($) {
    $(document).ready(function () {
        var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
        $('input[autofocus]').parents(".wa-field").first().children('.wa-name, i').addClass('active');


        // Add active if form auto complete
        $(document).on('change', input_selector, function () {
            if ($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
                $(this).parents(".wa-field").first().children('.wa-name, i').addClass('active');
            }
            //console.log(22);
        });
    });
}(jQuery));


$(document).ajaxComplete(function () {
    Materialize.updateTextFields();
});

$(document).ready(function () {

    (function ($) {
        $(function () {
            var jcarousel = $(".jcarousel");

            jcarousel
                .on('jcarousel:reload jcarousel:create', function () {
                    var carousel = $(this),
                        width = carousel.innerWidth();

                    if (width >= 1280) {
                        width = width / 5;
                    } else if (width >= 1100) {
                        width = width / 5;
                    } else if (width >= 800) {
                        width = width / 4;
                    } else if (width >= 600) {
                        width = width / 3;
                    } else if (width >= 350) {
                        width = width / 2;
                    }
                    console.log(width);
                    carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');


                })
                .jcarousel({});


            $('.jcarousel-control-prev')
                .jcarouselControl({
                    target: '-=1'
                });

            $('.jcarousel-control-next')
                .jcarouselControl({
                    target: '+=1'
                });

            $('.jcarousel-pagination')
                .on('jcarouselpagination:active', 'a', function () {
                    $(this).addClass('active');
                })
                .on('jcarouselpagination:inactive', 'a', function () {
                    $(this).removeClass('active');
                })
                .on('click', function (e) {
                    e.preventDefault();
                })
                .jcarouselPagination({
                    perPage: 1,
                    item: function (page) {
                        return '<a href="#' + page + '">' + page + '</a>';
                    }
                });
        });
    })(jQuery);


    $("body").on("click", ".switch", function () {
        if ($(".switch > div > input").prop("checked")) {
            $(".switch > div > input").prop('checked', false);
            $(".lazyloading-paging").show();
            $(".lazyloading-paging").removeClass("lazyloading-paging");

            $.cookie('lazy', 'false', {expires: 7});
            $.cookie('products_lazy_loading', 0, {expires: 365, path: '/'});
            lazy_enabled = 0;
            $('.lazy-target').hide();
        }
        else {
            $(".switch > div > input").prop('checked', true);
            $(".paginations").addClass("lazyloading-paging");
            $(".lazyloading-paging").hide();
            $(window).lazyLoad && $(window).lazyLoad('reload');
            if ($(".lazy-target").attr("data-next-url") != '') {
                $.cookie('lazy', 'true', {expires: 7});
                $.cookie('products_lazy_loading', 1, {expires: 365, path: '/'});
                lazy_enabled = 1;
                $('.lazy-target').show();
            }


        }

    });

    if (!$(".switch > div > input").prop("checked")) {
        $(".lazyloading-paging").show();
        $(".lazyloading-paging").removeClass("lazyloading-paging");
    }

    $("body").on("click", ".tab", function showVideo(e) {
        Materialize.updateTextFields();
        var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
        $(document).on('change', input_selector, function () {
            if ($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
                $(this).parents(".wa-field").first().children('.wa-name, i').addClass('active');
            }
            validate_field($(this));
        });
    });


    $('.modal-trigger-video').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            ready: function () {
                var html = $(".modal-trigger-video").data('html');
                $("#video1").find('#video1cont').html(html);
            },
            complete: function () {
                $("#video1cont").html('');
            } // Callback for Modal close
        }
    );


    $('.product-list li').live("hover", function () {
        if (!$(this).hasClass('main_block')) {
            // $(this).find('.add_cart').show();
            $(this).find('.prices').css('color', '#F4731E');
            if ($(this).find('.sku_images_over').children('.image').length != 0) {
                $(this).find('.sku_images').show();
            }
        }
        else {
            $(this).find('.prices').css('color', '#F4731E');
            $(this).find('.badges').show();
            $(this).find('.badge_sex').show();
        }
    });


    $('.sku_images').live("mouseleave", function () {

            var main_image = $(this).parents("li").find('.imagess').children('img');
            var default_image_img = $(this).parents("li").find('.imagess').children('.default_image').children('img').attr('src');
            main_image.attr('src', default_image_img);
        }
    );

    $('.product-list li').live("mouseleave", function () {
        if (!$(this).hasClass('main_block')) {
            //$(this).find('.add_cart').hide();
            $(this).find('.prices').css('color', '#444');
            $(this).find('.sku_images').hide();
            var main_image = $(this).find('.imagess').children('img');
            var default_image_img = $(this).find('.imagess').children('.default_image').children('img').attr('src');
            main_image.attr('src', default_image_img);

        }
        else {
            $(this).find('.prices').css('color', '#444');

        }

    });


    $('.product-list li .igm').live("hover", function () {
        var href = $(this).attr('href');
        var img = $(this).data('small');
        var main_image = $(this).parents('a').children('.imagess').children('img');
        main_image.attr('href', href);
        main_image.attr('src', img);
    });


    // Add Active Class To Current Link
    var url = window.location.pathname; // get current URL
    $('.main_menu a[href="' + url + '"]').addClass('activeV');

    var $activeUL = $('.activeV').closest('ul');
    /*
     Revise below condition that tests if .active is a submenu
     */
    if ($activeUL.attr('class') != 'main_menu') { //check if it is submenu

        //console.log($activeUL.parents('.firstli').children('a'));
        $activeUL.parents('.firstli').children('a').addClass('activeV');
    }

    function openLink(element) {
        element.parentsUntil("div").removeClass('closed');
    }

    function processShippingHeader(result) {
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
    }

    var shipping_header = $.cookie('shippingheader');
    if (shipping_header) {
        processShippingHeader(shipping_header)
    }
    else {
        $.get('/data/shippingheader/', function (result) {
            $.cookie('shippingheader', result, {expires: 7, path: '/'});
            processShippingHeader(result);
        });
    }
    /*

     $("body").click(function (event) {
     if ($(event.target).closest(".wrapper_cart").length || $(event.target).closest(".cart_panel").length) return;
     $(".cart_panel").slideUp("fast");
     event.stopPropagation();
     });

     */
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

            if (!$("#cart-summary").hasClass('empty') && $("body").width() > 1280) {
                $("#cart-summary").addClass("fixed");
                //$(".cart_panel").hide();
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
        $("body").removeClass("freeze");
        return false;
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $(".dialog:visible").hide().find('.cart').empty();
            $("body").removeClass("freeze");
        }
        if (e.keyCode == 16) {
            console.log($(".product-service-dialog").length);
        }
    });

    $("#main").on('submit', '.product-list form.addtocart', function () {
        var f = $(this);

        //$(".product-service-dialog").remove();
        if (f.data('url')) {
            var d = $('#dialog');
            var c = d.find('.cart');
            c.load(f.data('url'), function () {
                c.prepend('<a href="#" class="dialog-close">&times;</a>');
                d.show();
                if ((c.height() > c.find('form').height())) {
                    c.css('bottom', '0');
                } else {
                    c.css('bottom', '0%');
                }
                // $("body").addClass("freeze");

            });
            return false;
        }
        $.post(f.attr('action') + '?html=0', f.serialize(), function (response) {
            var cart_count = $(".cart-count");
            var cart_total = $(".cart-total");
            cart_total.closest('#cart-summary').removeClass('empty');
            $('.cart-count').removeClass('empty');
            $('.cart_icon').attr('src', '/wa-apps/shop/themes/designsovkusom/img/basketon.png');
            updateCartSummaryFixedStatus();
            animateProductImage(f, function () {
                cart_total.html(response.data.total);
                cart_count.html(response.data.count);
            });
            //console.log(response);
            if (response.status == 'ok') {
                if (response.data.error) {
                    alert(response.data.error);
                }
            } else if (response.status == 'fail') {
                alert(response.errors);
            }
        }, "json");

        return false;

    });

    $('.filters.ajax form input').live("change", function () {
        var that = $(this);
        var f = $(this).closest('form');
        var preurl = $(this).parents("form").attr("data-url");
        var url = '?' + f.serialize();
        var parent_id = $(this).parents(".filter-box").attr("id");
        var parents = $(this).parents(".filter-box");
        $(window).lazyLoad && $(window).lazyLoad('sleep');
        $.get(preurl + url, function (html) {

            var checked = $('.filters.ajax form').find('input:checkbox:checked');
            var checked_parent = checked.parents(".filter-box");
            var product = $(html).find("#product-list");
            var feature_id = $(html).find("#bxsl").attr("data-active");
            var features = feature_id.split(',');

            $(html).find(".feature_value").map(function () {
                if ($.inArray($(this).val(), features) != -1) {
                    $("#" + $(this).attr("id")).attr("disabled", false);
                }
                else {
                    $("#" + $(this).attr("id")).attr("disabled", true);

                }

            });
            var pars = [];
            checked.each(function (e) {
                var flag = 0;

                var par = $(this).parents(".filter-box").attr("id");
                if ($.inArray(par, pars)) {
                    pars [e] = par;
                }

            });

            if (pars.length < 2) {
                // console.log("222");
                // parents.find("input").attr("disabled", false);
                //console.log(checked_parent.find("input"));
                checked_parent.find("input").attr("disabled", false);
            }
            else {

            }


            // стиль для отключенных элементов
            $(html).find(".feature_value").map(function () {
                if ($("#" + $(this).attr("id")).prop("disabled") == true) {
                    $("#" + $(this).attr("id")).parents("label").addClass("filter-disable");
                    $("#" + $(this).attr("id")).prop("checked", false);
                }
                else {
                    $("#" + $(this).attr("id")).parents("label").removeClass("filter-disable");

                }

            });


            $("#product-list").html(product);
            if (!!(history.pushState && history.state !== undefined)) {
                window.history.pushState({}, '', url);
            }
            $(window).lazyLoad && $(window).lazyLoad('reload');
        });
    });

    $('body').on('click', '.popup-text', function () {
        var dialog = $("#dialog_modal");
        var c = dialog.find('.modal-content');
        var dialog_block = $('<div class="dialog-text"></div>');
        dialog_block.html($(this).data('text'));
        if (dialog_block.find('> div').length >= 10) {
            dialog_block.addClass('columns');
        }
        else {
            dialog_block.removeClass('columns');
        }
        c.html(dialog_block);
        dialog.openModal();
        return false;
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
/*
 var timer;
 $("body").on("mouseenter", ".wrapper_cart", function () {
 $.ajax({
 url: "/panel/",
 cache: true,
 success: function (html) {
 $(".cart_panel").html(html);

 }
 });
 $(".cart_panel").fadeIn();

 }).on("mouseleave", ".wrapper_cart", function () {
 $(".cart_panel").fadeOut();

 });
 */
$(".wa-name").on("click", function () {
    $(this).addClass("active");
    $(this).parents(".wa-field").find("input").focus();
    $(this).parents(".wa-field").find("textarea").focus();
});

(function ($) {
    var block;
    var settings;

    $.fn.ac_profile = function (options) {
        block = this;
        settings = $.extend({}, options);
        $(document).ready(function () {
            $('.profile-edit').click(function () {
                editProfile($(this).data('id'));
                return false;
            });
        });
        return this;
    };

    function editProfile(id) {
        var html = $("#profile-" + id).clone();
        html.find(".address-full").find('input').ac_address();
        $('#modal_profile .modal-content').html(html);
        $('#modal_profile').openModal();
    }

    function checkSingle() {
        if (block.find('.address').length == 1) {
            block.find('.single-hide').hide();
        }
        else {
            block.find('.single-hide').show();
        }
    }

    function deleteAddress(address) {
        address.remove();
        checkSingle();
    }

    function addAddress() {
        block.append('<input type="hidden" name="add_address" value="1">');
        block.submit();
    }

}(jQuery));


(function ($) {
    var block;
    var settings;

    $.fn.ac_address = function (options) {
        block = this;
        settings = $.extend({}, options);
        $(document).ready(function () {
            block.each(function () {
                var sub = $(this);
                var address_block = sub.parents('.address');
                address_block.find(".address-part").blur(function () {
                    var addr = '';
                    address_block.find(".address-part").each(function () {
                        if ($(this).val() != '') {
                            addr += ' ' + $(this).data('name') + ' ' + $(this).val();
                        }
                    });
                    sub.val(addr);
                });
            });
        });
        return this;
    };

    function updateAddressField(element) {

    }

}(jQuery));
;



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

function animateProductImage(form, callback) {
    var cart_total = $(".cart-total");
    var block = '';
    var animate_block = $("#image_animate");
    block = form.parents('.inner_product');
    var origin, img;
    if (block.length > 0) {
        //это блок товара в категории
        origin = block.find('.imagess img');
        img = $('<img src="' + origin.attr('src') + '">');
        img.css('height', '200px');
        animate_block.html(img);
    }
    else {
        block = form.parents('.product-info');
        if (block.length > 0) {
            //блок "вы смотрели"
            origin = block.parent().find('.imagess img');
            img = $('<img src="' + origin.attr('src') + '">');
            img.css('height', '150px');
            animate_block.html(img);
        }
        else {
            block = form.parents('.product-page');
            if (block.length > 0) {
                //страница товара
                origin = block.find('#image-link');
                img = $('<img src="' + origin.attr('src') + '">');
                animate_block.html(img);
            }
        }
    }
    if (block.length > 0) {
        animate_block.show();
        animate_block.css({
            'z-index': 100,
            top: origin.offset().top,
            left: origin.offset().left,
            position: 'absolute',
            width: 'auto',
            height: 'auto',
            opacity: 1
        }).animate({
            top: cart_total.offset().top,
            left: cart_total.offset().left,
            width: 0,
            height: 0,
            opacity: 0.5
        }, 1500, function () {
            animate_block.hide();
            callback();
        });
    }
}