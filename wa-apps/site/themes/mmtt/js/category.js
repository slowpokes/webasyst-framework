var gl_min, gl_max;
var price_timer;

$(document).ready(function () {
    initFilters();
    prepareText();
    smallProductsInit($("#category_products"));
    initBrandLinks();
});

window.onpopstate = function(event) {
    var elapsed_time = new Date().getTime() - start_time;
    if(elapsed_time>1000){
        var url = window.location.search.replace( "?", "" );
        ajaxFilter(url, $(".filters").first());
    }
};


var ajax_filter;
var count_timer;

function initFilters(){
    initPrice();
    initColor();
    $(".filters").find('input[type=checkbox]').change(function(){
        prepareFilter($(this));
    });
    hideSingleFilters();
    hideFilters();
    scrollFilters();
}

function prepareFilter(element){
    var url = $("#filter_form").serialize();
    history.pushState({}, "", location.href);
    history.replaceState({}, "", "?"+url);
    ajaxFilter(url, element);
}

function ajaxFilter(url, element){
    if(ajax_filter){
        ajax_filter.abort();
    }
    hideCount();
    $("#category_products").html("<div class='loading'></div>");
    var top = $(element).position().top;
    ajax_filter = $.get('', url+'&ajax=1', function(res){
        $(".category_links").hide();
        var products = $(res).find("#category_products");
        $("#category_products").html(products);
        var sidebar = $(res).find("#category_sidebar");
        //$("#category_sidebar").html(sidebar);
        //initFilters();
        smallProductsInit($("#category_products"));
        var c = $("#category_products").find(".product_list").data('count');
        showCount(top, c);
    })
}

function prepareText(){
    $('#category_products').after($("#category_description").remove());
}

function hideSingleFilters(){
    $(".filter").each(function(){
        if($(this).attr('id')!='filter_price'){
            var c = $(this).find('.filter_value').length;
            if(c<=1){
                $(this).hide();
            }
        }
        else{
            var min_price = $(this).find("input[name='price_min']").attr("value")*1;
            var max_price = $(this).find("input[name='price_max']").attr("value")*1;
            var cat_min_price = $(this).find("input[name='price_min']").attr("placeholder")*1;
            var cat_max_price = $(this).find("input[name='price_max']").attr("placeholder")*1;
            if((min_price>=max_price)||(cat_min_price>=cat_max_price)){
                $(this).hide();
            }
        }
    });
}

function scrollFilters(){
    $(".filter").each(function(){
        var container = $(this).find(".filter_content");
        var checkboxes = container.find("input[type='checkbox']:checked");
        if(checkboxes.length>0){
            var first = checkboxes.eq(0).parent();
            var top = first.offset().top - first.parent().offset().top;
            clog(top);
            container.scrollTop(top);
        }
    });
}

function hideFilters(){
    $(".filter").each(function(){
        if($(this).data('collapsed')==1){
            if($(this).find("input[type='checkbox']:checked").length==0){
                $(this).addClass('collapsed');
            }
        }
        var id = $(this).data('id');
        var el = $(this).find('.filter_title');
        el.css('cursor', 'pointer');
        el.click(function(){
            toggleFilter(id);
            return false;
        });
    });
}

function toggleFilter(id){
    $("#filter_"+id).toggleClass('collapsed');
}

function showCount(top, count){
    clearTimeout(count_timer);
    var el = $("#filter_count");
    el.css('left', $('.sidebar').width());
    el.css('top', top);
    el.show();
    el.find('span').text(count);
    count_timer = setTimeout(function(){hideCount()},5000);
}

function hideCount(){
    clearTimeout(count_timer);
    $("#filter_count").hide();
}

function initPrice(){
    var price_min = $("#filter_price_min").val()*1;
    var price_max = $("#filter_price_max").val()*1;
    var cat_price_min = $("#filter_price_min").attr('placeholder')*1;
    var cat_price_max = $("#filter_price_max").attr('placeholder')*1;
    if(price_max>price_min){
        element = $('.price_slider1');
        $(element).noUiSlider({
            range: [cat_price_min, cat_price_max]
            ,start: [price_min, price_max]
            ,handles: 2
            ,connect: true
            ,step:10
            ,slide: function(){
                var values = $(this).val();
                $("#filter_price_min").val(values[0]);
                $("#filter_price_max").val(values[1]);
            }
        }).change( function () {
            prepareFilter(element);
        });
        $("#filter_price_min").keyup(function(){
            priceChange(element, $("#filter_price_min").val(), $("#filter_price_max").val());
        });
        $("#filter_price_max").keyup(function(){
            priceChange(element, $("#filter_price_min").val(), $("#filter_price_max").val());
        });
    }
    else{
        clog(price_max+"<"+price_min);
    }
}

function initColor(){
    $(".icon16.color").each(function(){
        $(this).parents(".filter_content").addClass("filter_color_content");
        var parent = $(this).parents(".filter_value");
        var text = $(this).parent().text();
        parent.attr('title', text);
        parent.addClass('filter_color');
    });
}

function priceChange(element, min, max){
    clearTimeout(price_timer);
    price_timer = setTimeout(function(){
        if ((gl_min!=min)||(gl_max!=max)){
            prepareFilter(element);
        }
        gl_min=min;
        gl_max=max;
    }, 1000);
}

function initBrandLinks(){
    $(".brand_sidebar_links").find('a').click(function(){
        if(ajax_filter){
            ajax_filter.abort();
        }
        var url = $(this).attr('href');
        $("#category_products").html("<div class='loading'></div>");
        ajax_filter = $.get(url, '&ajax=1', function(res){
            var products = $(res).find("#category_products");
            $("#category_products").html(products);
            smallProductsInit($("#category_products"));
        })
        return false;
    });
}