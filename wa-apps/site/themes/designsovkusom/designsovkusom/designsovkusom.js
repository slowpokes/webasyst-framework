$(document).ready(function(){
    /*$(".cart").mouseenter(function(){
        $(".cart_info").slideDown(500);
    });
    
    $(".cart_info").mouseleave(function(){
        $(".cart_info").slideUp(500);
    });*/
    $("#search").focus(function(){
        $(".searchform").addClass("active_search");
    });
    
    $("#search").focusout(function(){
        $(".searchform").removeClass("active_search");
    });
    
    $(".product-navigation .tab").click(function(e) {
        value=$(this).attr("value");
        $('li.tab').removeClass("selected");
	    $(".product-content .tab").hide();
	    $(this).addClass("selected");
	    $("#tab"+value).show();
    });
    
  	current_tab=$(".product-navigation li:first-child");
  	val=$(current_tab).attr("value");
  	$(current_tab).addClass("selected");
	$(".product-content .tab").hide();
  	$("#tab"+val).show();
  	
    $("#product-sort").change(function(){
        location.assign($(this).val()); 
    });
    
    
    $('.product-view span').click(function(){
    	var item = $(this);
    	if(item.hasClass('selected')) return false;
    	
    	$('.product-view span').removeClass('selected');
    	item.addClass('selected');
    	
    	if(item.data('view'))
    	{
    		$('ul.product-list').addClass('blocks').removeClass('list');
    		$.cookie('dsv_view', 'blocks', { expires: 30, path: '/'});
    	}
    	else
    	{
    		$('ul.product-list').addClass('list').removeClass('blocks');
    		$.cookie('dsv_view', 'list', { expires: 30, path: '/'});
    	}
    	return false;
    });

	$("#back-top").hide();

	$(window).scroll(function (){
		if ($(this).scrollTop() > 100){
			$("#back-top").fadeIn();
		} else{
			$("#back-top").fadeOut();
		}
	});

	$("#back-top a").click(function (){
		$("body,html").animate({
			scrollTop:0
		}, 800);
		return false;
	});
});