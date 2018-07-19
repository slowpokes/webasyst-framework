/*jslint browser: true, devel: true */
/*global window*/

(function (WA_THEME, $) {
    "use strict";
    function library(module) {
        $(function () {
            if (module.init) {
                module.init();
                // if ("name" in module) {
                //     console.info("%s initialized", module.name);
                // }
            }
        });
        return module;
    }

    // Settings
    WA_THEME.config = $("#config").data();

    WA_THEME.app = library(function () {
        var cfg = WA_THEME.config;

        return {
            init: function () {
                console.log("%s - %s",cfg.locale.theme, cfg.themeversion);

                this.initDataSlider();
                this.initLazyLoad();
                this.initFlexmenu();
            },
            initDataSlider: function () {
                if ($.fn.slick) {
                    $(".dataSlider").slick();
                }
            },
            initLazyLoad: function () {
                if ($.fn.lazyload) {
                    $("img.lazy").lazyload();
                }
            },
            initFlexmenu: function () {
                var $flex = $(".navbar-flex"),
                    script = cfg.parenturl + "js/flexmenu.min.js";
                if ($flex.length > 0 && $flex.has("li").length) {
                    $.getScript(script, function () {
                        $flex.flexMenu({
                            linkText: cfg.locale.more,
                            linkTitle: cfg.locale.more,
                            popupClass: "dropdown-menu"
                        });
                    });
                }
            }
        };
    }());

    WA_THEME.modal = library(function () {
        var $modal = $("#modal");
            /*modalTimer = null;*/

        return {
            name: "MODAL",
            loadData: function (content, callback) {
                $modal.find(".modal__template").html(content);
                if (typeof callback !== "function") {
                    callback = false;
                }
                if (callback) {
                    callback();
                }
            },
            init: function () {
                var that = this,
                    cfg = WA_THEME.config;

                // Событие при быстром просмотре
                $(window).on("productQuickview", function (e, data) {
                    that.loadData(data.html, function () {
                        if($modal.hasClass("in")) {
                            $modal.trigger("shown.bs.modal");
                        } else {
                            $modal.modal("show");
                        }

                        $modal.removeClass("loading");
                    });
                });

                $modal.on("shown.bs.modal", function (e) {
                    /* clearTimeout(modalTimer); */
                    var $content = $modal.find(".modal__content");

                    if (!$content.length) { return false; }
                    if ($content.hasClass("quickview")) {
                        $(window).trigger("initProductGallery");
                        /*
                        modalTimer = setTimeout(function () {
                        }, 500);
                        */
                    }
                    if ($content.hasClass("added")) {
                        $modal.find(".dataSlider:not(.slick-initialized)").slick();
                    }
                });

                $modal.on("hidden.bs.modal", function () {
                    $modal.find(".slick-slider").each(function () {
                       $(this).slick("unslick");
                    });
                    $modal.find(".modal__template").empty();
                });

                // Событие при добавлении в корзину
                $(window).on("productAdded", function (e, data) {
                    if (cfg.cart === "undefinded") { return false; }
                    var url = cfg.cart + "?added=" + data.id + "&qty" + data.qty;
                    $modal.addClass("loading");
                    $.get(url, function (html) {
                        that.loadData(html, function () {
                            $modal.removeClass("loading");
                            if (($modal.data("bs.modal") || {}).isShown){
                                $modal.trigger("shown.bs.modal");
                            } else {
                                $modal.modal("show");
                            }
                        });
                    });
                });
            }
        };
    }());

    WA_THEME.adapters = library(function () {
        var onProviderClick = function( $link ) {
            var $li = $link.closest("li"),
                provider = $li.data("provider");

            if (provider != "guest" && provider != "signup") {
                var left = (screen.width-600)/ 2,
                    top = (screen.height-400)/ 2,
                    href = $link.attr("href");

                if ( ( typeof require_authorization !== "undefined" ) && !require_authorization) {
                    href = href + "&guest=1";
                }

                openWindow(href, "oauth", "width=600,height=400,left="+left+",top="+top+",status=no,toolbar=no,menubar=no");
            }
        };

        var openWindow = function( href, win_name, params) {
            window.open(href, win_name, params);
        };

        return {
            init: function () {
                $(".auth-type a").on("click", function() {
                    onProviderClick( $(this) );
                    return false;
                });
            }
        };
    }());

    /* TODO : captcha refresh */

    // Shop modules
    WA_THEME.ProductsCookie = function () {
        var ProductsCookie = function (params) {
            this.cookie = params.cookie;
            this.id = params.id;
            this.messages = params.messages;
            this.active = params.active || "active";
            this.url = params.url;
            this.elements = this.getListArray();
        };
        ProductsCookie.prototype = {
            constructor: ProductsCookie,
            getListArray: function () {
                var list = $.cookie(this.cookie);

                if (list) {
                    list = list.split(",");
                } else {
                    list = [];
                }
                return list;
            },
            addItem: function (id) {
                var i = $.inArray(id + "", this.elements);
                if (i !== -1) {
                    return false;
                }
                this.elements.push(id + "");
                this.updateList();
            },
            removeItem: function (id) {
                var i = $.inArray(id + "", this.elements);
                if (i !== -1) {
                    this.elements.splice(i, 1);
                }
                this.updateList();
            },
            proccessItem: function ($elem) {
                var id = $elem.data("id"),
                    title = "",
                    msgClass = "";
                if ($elem.hasClass(this.active)) {
                    this.removeItem(id);
                    title = this.messages.add;
                } else {
                    msgClass = "js-" + $elem.data("list") + "-remove";

                    this.addItem(id);
                    title = this.messages.remove;
                    $(window).trigger("messageAdd", {
                        id: id,
                        action: this.messages.addto,
                        target: this.messages.added,
                        class: msgClass,
                        url: this.url
                    });
                    //message.setParams(this.messages.added, this.id + "-remove", id, this.url);
                }
                $("." + $elem.data("list") + "[data-id='" + id + "']").toggleClass(this.active).attr("title", title).tooltip("fixTitle");
                $elem.tooltip("show");
            },
            /*
                checkItem: function (id) {
                    if (typeof id == "undefined") { return false; }

                    var i = $.inArray(id + "", this.elements);
                    if (i !== -1) {
                        this.elements.splice(i, 1);
                        this.updateList();
                    }
                    this.addItem(id);
                },
            */
            resetList: function () {
                this.elements = [];
                this.updateList();
            },
            updateList: function () {
                var items = this.elements;
                if (items.length > 0) {
                    $.cookie(this.cookie, items.join(","), {expires: 30, path: "/"});
                } else {
                    $.removeCookie(this.cookie, {path: "/"});
                }
            }
        };

        return ProductsCookie;
    }();

    WA_THEME.Products = function () {
        var config = $("#config").data(),
            locale = config.locale;
        var Products = function (options) {
            // DOM
            this.wrapper = $(".productsWrapper");
            // this.$products = this.$wrapper.find(".products__item");
            this.sorting = this.wrapper.find(".sort");
            this.productList = this.wrapper.find(".products");

            // VARS
            // this.added_class = "is-added";
            // this.compare = ( options['compare'] || false );

            // DYNAMIC VARS

            // INIT
            this.bindEvents();
        };
        Products.prototype = {
            constructor: Products,
            bindEvents: function () {
                var that = this,
                    $wrapper = that.wrapper,
                    // locale = $("#config").data("locale"),
                    comparisonList = new WA_THEME.ProductsCookie({
                        cookie: "shop_compare",
                        id: "compare",
                        messages: {
                            add: locale.compare_add,
                            remove: locale.compare_remove,
                            added: locale.compare,
                            addto: locale.addto
                        },
                        url: config.compare
                    }),
                    favouriteList = new WA_THEME.ProductsCookie({
                        cookie: "shop_wishlist",
                        id: "favourite",
                        messages: {
                            add: locale.favourite_add,
                            remove: locale.favourite_remove,
                            added: locale.favourite,
                            addto: locale.addto
                        },
                        url: config.search + "?func=wishlist"
                    }),
                    viewedList = new WA_THEME.ProductsCookie({
                        cookie: "shop_viewed",
                        id: "viewed"
                    });

                $wrapper.on("submit", "form.products__add", function (event) {
                    event.preventDefault();
                    that.onSubmitProduct($(this));
                });

                $(document).on("click", ".products__quickview, .products__sibling", function () {
                    var id = $(this).data("id");
                    if($("#modal").hasClass("in")){
                        $("#modal").addClass("loading");
                    }
                    $.post($(this).data("url"), function (html) {
                        $(window).trigger("productQuickview", {html: html});
                        $(window).trigger("productView", id);
                    });
                });

                $(document).on("click", ".compare", function (event) {
                    comparisonList.proccessItem($(this));
                    $(window).trigger("updateCompare", comparisonList.elements.join(","));
                    return false;
                });

                $(document).on("click", ".js-compare-remove", function (event) {
                    comparisonList.removeItem($(this).data("product"));
                    $(window).trigger("updateCompare", comparisonList.elements.join(","));

                    if ($(this).hasClass("messages__cancel")) {
                        $(this).closest(".messages__item").remove();
                        $(".compare[data-id='" + $(this).data("product") + "']").removeClass("active");
                    }
                    // return false;
                });

                $(document).on("click", ".favorite", function (event) {
                    favouriteList.proccessItem($(this));
                    $(window).trigger("updateFavorite", favouriteList.elements.length);
                    return false;
                });

                $(document).on("click", ".js-favorite-remove", function (event) {
                    favouriteList.removeItem($(this).data("product"));
                    $(window).trigger("updateFavorite", favouriteList.elements.length);

                    if ($(this).hasClass("messages__cancel")) {
                        $(this).closest(".messages__item").remove();
                        $(".favorite[data-id='" + $(this).data("product") + "']").removeClass("active");
                    }
                    return false;
                });

                $(document).on("click", ".reset-wishlist", function (event) {
                    favouriteList.resetList();
                    location.reload();
                    return false;
                });

                $(document).on("click", ".reset-compare", function (event) {
                    comparisonList.resetList();
                    location.href = location.href.replace(/compare\/.*/, "compare/");
                    return false;
                });

                $(document).on("click", ".reset-viewed", function (event) {
                    viewedList.resetList();
                    location.reload();
                    return false;
                });
/*
                $(document).on("click", "a[data-view='list']", function () {
                    that.onChangeView($(this), true);
                    return false;
                });

                $(document).on("click", "a[data-view='thumbs']", function () {
                    that.onChangeView($(this), false);
                    return false;
                });
*/
                $(document).on("click", "a[data-view]", function () {
                    that.onChangeView($(this));
                    return false;
                });

                $wrapper.on("click", "a[data-perpage]", function () {
                    if ($(this).closest("li").hasClass("selected")) { return false; }

                    if ($(this).data("perpage") !== "all") {
                        $.cookie("products_per_page", $(this).data("perpage"), {expires: 30, path: "/"});
                        $.cookie("lazyppp", null, {expires: 0, path: "/"});
                        document.location = location.protocol + "//" + location.host + location.pathname;
                    } else {
                        $.cookie("products_per_page", null, {expires: 0, path: "/"});
                        $.cookie("lazyppp", "1", {expires: 30, path: "/"});
                        document.location = $(this).data("href");
                    }
                    return false;
                });

                $(window).on("productView", function (e, id) {
                    viewedList.addItem(id);
                });
            },
            onSubmitProduct: function ($form) {
                var that = this,
                    $product = $form.closest(".products__item"),
                    qty = $form.find(".qty__input").val(),
                    product_href = $form.data("url");

                // Если у товара несколько артикулов
                // то подгружается форма с выбором
                // иначе добавляется товар в корзину
                if (product_href) {
                    product_href = product_href + "&qty=" + qty;

                    $.get(product_href, function (html) {

                        // Вызываем модальное окно "Быстрый просмотр", передаем ему полученный html
                        // WA_THEME.Modal - productQuickview
                        $(window).trigger("productQuickview", {html: html});
                    });
                } else {
                    $.post($form.attr("action") + "?html=1", $form.serialize(), function (response) {
                        // Update Cart at Header
                        if (response.status == "ok") {
                            // Изменяем индикаторы корзины
                            $(window).trigger("updateCart", response.data);

                            $(window).trigger("messageAdd", {
                                id: response.data.item_id,
                                action: locale.addto,
                                target: locale.cart,
                                class: "js-cart-remove",
                                url: config.cart
                            });

                            // Вызываем модальное окно "Добавлен в корзину"
                            // WA_THEME.Modal - productAdded
                            $(window).trigger("productAdded", {id: response.data.item_id, qty: $form.find(".qty__input").val() || 1});

                            // fCart - fCart_process
                            $(window).trigger("fCart_process", { product_id: $product.find("[name='product_id']").val(), sku_id: response.data.item_id });
                        } else if (response.status == "fail"){
                            alert(response.errors);
                        }
                    }, "json");
                }
            },
            onChangeView: function ($link) {
                var that = this,
                    activeClass = "active",
                    is_active = $link.hasClass(activeClass),
                    $list = that.wrapper.find(".products");

                if (!is_active) {
                    if ($link.data('view') === 'list') {
                        $list.removeClass("thumbs stream").addClass("list");
                    } else if ($link.data('view') === 'thumbs') {
                        $list.removeClass("list stream").addClass("thumbs");
                    } else {
                        $list.removeClass("list thumbs").addClass("stream");
                    }
                    $.cookie("product_view", $link.data("view"), { expires: 30, path: "/" });
                    that.wrapper.find(".sort__view ." + activeClass).removeClass(activeClass);
                    $link.addClass(activeClass);
                }
            }
        };

        return Products;
    }();

    WA_THEME.mobileMenu = library(function () {
        var toggleSelector = "#toggleMobileMenu",
            coverClass = "cover",
            openClass = "is-open";

        var toggleMenu = function () {
            $(".mobileMenu").toggleClass(openClass);
            $(".wrapper").toggleClass(openClass);

            if ($("." + coverClass).length) {
                $("." + coverClass).remove();
            } else {
                $(".wrapper").append("<div class='" + coverClass + "'></div>");
            }
        };
        return {
            name: "MOBILE MENU",
            init: function () {
                $(toggleSelector).click(function () {
                    toggleMenu();
                });

                $(document).on("click", "." + coverClass, function () {
                    toggleMenu();
                });
            }
        };
    }());

    WA_THEME.amaMenu = library(function () {
        var coverSelector = "#nav-cover",
            navSelector = "#navbar-shadowed",
            shownClass = "is-shown";

        return {
            name: "AMA MENU",
            init: function () {
                $(navSelector + " .dropdown").hover(
                    function () {
                        $(coverSelector).addClass(shownClass);
                    },
                    function () {
                        $(coverSelector).removeClass(shownClass);
                    }
                );
            }
        };
    }());

    WA_THEME.counters = library(function () {
        var toggleClass = "full",
            animateClass = "is-active",
            cartTimer = null;

        return {
            name: "COUNTERS",
            init: function () {
                var themeConfig = WA_THEME.config;

                $(window).on("updateCart", function (e, data) {
                    var $cart = $(".js-cart"),
                        $total = $(".js-cart-total"),
                        $count = $(".js-cart-count");

                    clearTimeout(cartTimer);
                    if (data.count > 0) {
                        $cart.addClass(toggleClass);
                    } else {
                        $cart.removeClass(toggleClass);
                    }
                    $count.each(function () {
                        var that = this;
                        if ($(that).hasClass("mi-icon-badge")) {
                            $(that)
                                .attr("data-badge", data.count)
                                .data("badge", data.count)
                                .addClass(animateClass);
                            cartTimer = setTimeout(function () {
                                $(that).removeClass(animateClass);
                            }, 500);
                        } else {
                            $(that).html(data.count);
                        }
                    });
                    $total.html(data.total);
                });

                $(window).on("updateCompare", function (e, str) {
                    var $compare = $(".js-compare"),
                        $count = $(".js-compare-count"),
                        url = themeConfig.compare,
                        array = (str) ? str.split(",") : [],
                        count = array.length;

                    if (count > 0) {
                        $compare.addClass(toggleClass);
                    } else {
                        $compare.removeClass(toggleClass);
                    }
                    if (count > 1) {
                        url = url.replace(/compare\/.*$/, "compare/" + str + "/");
                    } else {
                        url = "javascript:void(0)";
                    }
                    $compare.attr("href", url);
                    $count.html(count);
                });

                $(window).on("updateFavorite", function (e, count) {
                    var $favorite = $(".js-favorite"),
                        $count = $(".js-favorite-count");

                    if (count > 0) {
                        $favorite.addClass(toggleClass);
                    } else {
                        $favorite.removeClass(toggleClass);
                    }
                    $count.html(count);
                });
            }
        };
    }());

    WA_THEME.retina = library(function () {
        return {
            name: "RETINA",
            retinify: function() {
                $("img.retinify").retina();
            },
            init: function () {
                var that = this,
                    themeConfig = WA_THEME.config,
                    script = themeConfig.staticurl + "wa-content/js/jquery-plugins/jquery.retina.min.js?" + themeConfig.version;

                if (themeConfig.retina !== "undefined") {
                    if ($.Retina) {
                        that.retinify();
                    } else {
                        $.ajax({
                            dataType: "script",
                            url: script,
                            cache: true
                        }).done(that.retinify);
                    }
                }
            }
        };
    }());

    WA_THEME.filter = library(function () {
        var limit = parseInt($(".filter").data("limit"), 10) - 1,
            activeFilters = $("#filters-active");

        var ajax_form_callback = function (f) {
            var fields = f.serializeArray(),
                params = [];

            for (var i = 0; i < fields.length; i++) {
                if (fields[i].value !== "") {
                    params.push(fields[i].name + "=" + fields[i].value);
                }
            }
            var url = "?" + params.join("&");
            $(window).lazyLoad && $(window).lazyLoad("sleep");
            $(".productsWrapper", "#product-list").html("<img src='" + f.data("loading") + "'>");
            $.get(url+"&_=_", function(html) {
                var tmp = $("<div></div>").html(html);
                if ($.Retina) {
                    $("#product-list img").retina();
                }
                $(".productsWrapper", "#product-list").html(tmp.find(".productsWrapper").html()).find("img.lazy");
                if (!!(history.pushState && history.state !== undefined)) {
                    window.history.pushState({}, "", url);
                }
                $(window).lazyLoad && $(window).lazyLoad("reload");
                $(".products__gallery:not(.brazzers-daddy)").brazzersCarousel();
                $("img.lazy").lazyload();
                $("img.lazy").lazyload({ event: "lazyload" });
            });
        };
        function updateActiveFilter () {
            var count = activeFilters.children().length;
            if (count > 0) {
                activeFilters.closest(".filter__block").removeClass("hidden");
            } else {
                activeFilters.closest(".filter__block").addClass("hidden");
            }
        };

        return {
            name: "FILTER",
            init: function () {
                updateActiveFilter();

                $(".filter.ajax form input").change(function () {
                    ajax_form_callback($(this).closest("form"));

                    // active filter
                    if($(this).hasClass("checkbox")) {
                        var name = $(this).attr("name"),
                            value = $(this).val(),
                            text = $("label[for='" + $(this).attr("id") + "']").text(),
                            filter = activeFilters.find("a[data-name='" + name + "'][data-value='" + value + "']");

                        if(filter.length) {
                            filter.closest("li").remove();
                        } else {
                            activeFilters.append("<li><a href='#' data-name=" + name + " data-value=" + value + " class='filter-active'>" + text + "</a></li>").data({
                                "name": name,
                                "value": value
                            });
                        }

                        updateActiveFilter();
                    }
                });

                // resert active filters
                $(".filter").on("click", ".filter__uncheck", function () {
                    $("#filters-active").html("");
                    $(".checkbox", ".filter").attr("checked", false);
                    $("form", ".filter").submit();
                    updateActiveFilter();
                    return false;
                });

                $(".filter.ajax form").submit(function () {
                    ajax_form_callback($(this));
                    return false;
                });

                $(".filter .filter__slider").each(function () {
                    if (!$(this).find(".filter-slider").length) {
                        $(this).append("<div class='filter-slider'></div>");
                    } else {
                        return;
                    }
                    var min = $(this).find(".min");
                    var max = $(this).find(".max");
                    var min_value = parseFloat(min.attr("placeholder"));
                    var max_value = parseFloat(max.attr("placeholder"));
                    var step = 1;
                    var slider = $(this).find(".filter-slider");
                    if (slider.data("step")) {
                        step = parseFloat(slider.data("step"));
                    } else {
                        var diff = max_value - min_value;
                        if (Math.round(min_value) != min_value || Math.round(max_value) != max_value) {
                            step = diff / 10;
                            var tmp = 0;
                            while (step < 1) {
                                step *= 10;
                                tmp += 1;
                            }
                            step = Math.pow(10, -tmp);
                            tmp = Math.round(100000 * Math.abs(Math.round(min_value) - min_value)) / 100000;
                            if (tmp && tmp < step) {
                                step = tmp;
                            }
                            tmp = Math.round(100000 * Math.abs(Math.round(max_value) - max_value)) / 100000;
                            if (tmp && tmp < step) {
                                step = tmp;
                            }
                        }
                    }
                    slider.slider({
                        range: true,
                        min: parseFloat(min.attr("placeholder")),
                        max: parseFloat(max.attr("placeholder")),
                        step: step,
                        values: [parseFloat(min.val().length ? min.val() : min.attr("placeholder")),
                            parseFloat(max.val().length ? max.val() : max.attr("placeholder"))],
                        slide: function( event, ui ) {
                            var v = ui.values[0] == $(this).slider("option", "min") ? "" : ui.values[0];
                            min.val(v);
                            v = ui.values[1] == $(this).slider("option", "max") ? "" : ui.values[1];
                            max.val(v);
                        },
                        stop: function (event, ui) {
                            min.change();
                        }
                    });
                    min.add(max).change(function () {
                        var v_min =  min.val() === "" ? slider.slider("option", "min") : parseFloat(min.val());
                        var v_max = max.val() === "" ? slider.slider("option", "max") : parseFloat(max.val());
                        if (v_max >= v_min) {
                            slider.slider("option", "values", [v_min, v_max]);
                        }
                    });
                });

                $(".filter").on("click", ".filter-active", function(){
                    $(".filter").find("input[name='"+ $(this).data("name") +"'][value='"+ $(this).data("value") +"']").attr("checked", false).change();
                    $(this).closest("li").remove();
                    return false;
                });

                $(".filter__content", ".filter[data-limit]").each(function(){
                    var extra_values = $(this).find(".filter__value:gt(" + limit + ")").detach();
                    extra_values.appendTo($(this).find(".more-values"));
                });
            }
        };
    }());

    WA_THEME.filterMobile = library(function () {
        var showSelector = ".filter__show",
            hideSelector = ".sbMobile__hide",
            openClass = "is-open";

        return {
            name: "MOBILE FILTER",
            init: function () {
                $(showSelector).on("click", function () {
                    $(".wrapper").toggleClass(openClass);
                    $(".sidebar").toggleClass(openClass);
                    $(".collapse", ".filter").removeClass("in");
                    $("a[data-toggle='collapse']", ".filter").addClass("collapsed");
                    //$(".collapse").collapse("hide");
                    return false;
                });

                $(hideSelector).on("click", function () {
                    $(".wrapper").removeClass(openClass);
                    $(".sidebar").removeClass(openClass);
                    return false;
                });
            }
        };
    }());

    WA_THEME.qty = library(function () {
        var to = null, //timeout
            int = null; //interval

        function changeValue($input, callback) {
            var count = parseInt($input.val(), 10);

            if (typeof callback !== "function") {
                callback = false;
            }
            if (callback) {
                count = callback(count);
            }
            $input.val(count);
            to = setTimeout(function () {
                int = setInterval(function () {
                    if (callback) {
                        count = callback(count);
                    }
                    $input.val(count);
                }, 75);
            }, 500);
        }

        function clear() {
            clearTimeout(to);
            clearInterval(int);
        }

        function plus(value) {
            value = value + 1;
            return value;
        }

        function minus(value) {
            if (value < 2) {
                return value;
            }
            value = value - 1;
            return value;
        }

        return {
            name: "QUANTITY",
            init: function () {
                $(document).on("focusin", ".qty__input", function () {
                    $(this).closest(".qty").addClass("is-focus");
                });
                $(document).on("focusout", ".qty__input", function () {
                    $(this).closest(".qty").removeClass("is-focus");
                });
                $(document).on("change", ".qty__input", function () {
                    var that = $(this);
                    that.val(that.val() > 0 ? that.val() : 1);
                });
                $(document).on("mousedown", ".qty__plus", function () {
                    var $input = $(this).prevAll(".qty__input");
                    changeValue($input, plus);
                });
                $(document).on("mouseup", ".qty__plus", function () {
                    var $input = $(this).prevAll(".qty__input");
                    clear();
                    $input.focus().change();
                });
                $(document).on("mouseout", ".qty__plus", function () {
                    var $input = $(this).prevAll(".qty__input");
                    clear();
                    $input.change();
                });
                $(document).on("mousedown", ".qty__minus", function () {
                    var $input = $(this).prevAll(".qty__input");
                    changeValue($input, minus);
                });
                $(document).on("mouseup", ".qty__minus", function () {
                    var $input = $(this).prevAll(".qty__input");
                    clear();
                    $input.focus().change();
                });
                $(document).on("mouseout", ".qty__minus", function () {
                    var $input = $(this).prevAll(".qty__input");
                    clear();
                    $input.change();
                });
            }
        };
    }());

    WA_THEME.search = library(function () {
        var $wrapper = $("#searchWrapper"),
            $collapse = $(".search-form__collapse");

        var clearSearch = function () {
            $collapse.html("").hide();
        };

        return {
            name: "AJAX SEARCH",
            init: function () {
                var themeConfig = WA_THEME.config;

                $("#searchAjax").on("keyup", function () {
                    if ($(this).val().length > 4) {
                        $collapse.load(themeConfig.search + "?query=" + encodeURIComponent($(this).val()) + "&autocomplete=1 #searchProducts", function () {
                            $collapse.show();
                        });
                    } else {
                        clearSearch();
                    }
                });

                $wrapper.on("mouseleave", function () {
                    clearSearch();
                });
            }
        };
    }());

    WA_THEME.shop = function () {
        return {
            name: "SHOP",
            initProductSlider: function () {
                var $slider = $("#masterslider");
                if (!$slider.length) { return false; }

                var config = $slider.data();
                if (config.type === "off") { return false; }

                var slider = new MasterSlider();
                slider.control("arrows", { autohide:false } );
                slider.control("bullets", { autohide:false, margin: 16 });

                if (config.type == "productslider2") {
                    slider.setup("masterslider", {
                        width: 1400,
                        height: 500,
                        view: "basic",
                        autoplay: config.autoplay,
                        speed: 20,
                        loop: true,
                        instantStartLayers: true,
                        overPause: true,
                        preload: "all"
                    });
                } else if (config.type == "productslider3") {
                    slider.setup("masterslider", {
                        width: 1400,
                        height: 500,
                        view: "fadeBasic",
                        autoplay: config.autoplay,
                        instantStartLayers: true,
                        loop: true,
                        overPause: true,
                        fillMode: "fill",
                        parallaxMode: "swipe"
                    });
                } else if (config.type == "productslider4") {
                    slider.setup("masterslider", {
                        width: 1400,
                        height: 500,
                        view: "scale",
                        speed: 20,
                        preload: 0,
                        loop: true,
                        instantStartLayers: true,
                        centerControls: true,
                        overPause: true,
                        fillMode: "fill",
                        autoplay: config.autoplay,
                        parallaxMode: "swipe"
                    });
                } else {
                    slider.setup("masterslider", {
                        width: 1400,
                        height: 500,
                        view: "basic",
                        autoplay: config.autoplay,
                        speed: 20,
                        loop: true,
                        instantStartLayers: true,
                        overPause: true,
                        fillMode: "fit",
                        preload: "all",
                        parallaxMode: "mouse"
                    });
                }

                $(document).on("submit", "form.slider_add", function (event) {
                    var $form = $(this),
                        product_href = $form.find(".product-url").data("url");

                    if (product_href) {
                        $.post(product_href, function (html) {
                            $(window).trigger("productQuickview", {html: html});
                        });
                    } else {
                        $.post($form.attr("action") + "?html=1", $form.serialize(), function (response) {
                            if (response.status == "ok") {
                                $(window).trigger("updateCart", response.data);
                                $(window).trigger("productAdded", {id: response.data.item_id, qty: $form.find(".qty__input").val() || 1});
                            } else if (response.status == "fail"){
                                alert(response.errors);
                            }
                        }, "json");
                    }
                    return false;
                });
            },
            init: function () {
                $("a[data-crcy]").click(function(){
                    if ($(this).hasClass("active")) { return false; }

                    var url = location.href;
                    if (url.indexOf("?") == -1) {url += "?";}
                    else {url += "&";}
                    location.href = url + "currency=" + $(this).data("crcy");
                });

                // $("#productsCount a").click(function(){
                //     if($(this).closest("li").hasClass("selected")){ return false; }
                //
                //     if($(this).data("perpage")){
                //         $.cookie("products_per_page", $(this).data("perpage"), { expires: 30, path: "/"});
                //         $.cookie("lazyppp", "", { expires: 0, path: "/"});
                //         document.location = location.protocol + "//" + location.host + location.pathname;;
                //     } else {
                //         $.cookie("products_per_page", "", { expires: 0, path: "/"});
                //         $.cookie("lazyppp", "1", { expires: 30, path: "/"});
                //         document.location = $(this).data("href");
                //     }
                //     return false;
                // });
                
                $(".radio", ".sbSort").change(function () {
                    $("a[data-name='" + this.value + "']", ".sort__type").click();
                });
                $(".products__gallery").brazzersCarousel();
                $("img.lazy").lazyload({ event: "lazyload" });

                if ($.fn.lazyLoad) {
                    var paging = $(".lazyloading-paging");
                    if (!paging.length) {
                        return;
                    }

                    var times = parseInt(paging.data("times"), 10);
                    var link_text = paging.data("linkText") || "Load more";
                    var loading_str = paging.data("loading-str") || "Loading...";

                    // check need to initialize lazy-loading
                    var current = paging.find("li.selected");
                    if (current.children("a").text() != "1") {
                        return;
                    }
                    paging.hide();
                    var win = $(window);

                    // prevent previous launched lazy-loading
                    win.lazyLoad('stop');

                    // check need to initialize lazy-loading
                    var next = current.next();
                    if (next.length) {
                        win.lazyLoad({
                            container: "#product-list .products",
                            load: function () {
                                win.lazyLoad("sleep");

                                var paging = $(".lazyloading-paging").hide();

                                // determine actual current and next item for getting actual url
                                var current = paging.find("li.selected");
                                var next = current.next();
                                var url = next.find("a").attr("href");
                                if (!url) {
                                    win.lazyLoad("stop");
                                    return;
                                }

                                var product_list = $("#product-list .products");
                                var loading = paging.parent().find(".loading").parent();
                                if (!loading.length) {
                                    loading = $("<div><i class='icon16 loading'></i>"+loading_str+"</div>").insertBefore(paging);
                                }

                                loading.show();
                                $.get(url, function (html) {
                                    var tmp = $("<div></div>").html(html);
                                    if ($.Retina) {
                                        tmp.find("#product-list .products img").retina();
                                    }

                                    product_list.append(tmp.find("#product-list .products").children());
                                    var tmp_paging = tmp.find(".lazyloading-paging").hide();
                                    paging.replaceWith(tmp_paging);
                                    paging = tmp_paging;

                                    times -= 1;

                                    // check need to stop lazy-loading
                                    var current = paging.find("li.selected");
                                    var next = current.next();
                                    if (next.length) {
                                        if (!isNaN(times) && times <= 0) {
                                            win.lazyLoad("sleep");
                                            if (!$(".lazyloading-load-more").length) {
                                                $("<a href='#' class='lazyloading-load-more'>" + link_text + "</a>").insertAfter(paging)
                                                    .click(function () {
                                                        loading.show();
                                                        times = 1;      // one more time
                                                        win.lazyLoad("wake");
                                                        win.lazyLoad("force");
                                                        return false;
                                                    });
                                            }
                                        } else {
                                            win.lazyLoad("wake");
                                        }
                                    } else {
                                        win.lazyLoad("stop");
                                        $(".lazyloading-load-more").hide();
                                    }

                                    loading.hide();
                                    tmp.remove();
                                    $(".products__gallery:not(.brazzers-daddy)").brazzersCarousel();
                                    $("img.lazy").lazyload({ event: "lazyload" });
                                });
                            }
                        });
                    }
                }

                var $subcates_toggle = $("#subcatsToggle")
                $("#subcatsCollapse").on("hidden.bs.collapse", function () {
                    $subcates_toggle.html($subcates_toggle.data("shown"));
                }).on("shown.bs.collapse", function () {
                    $subcates_toggle.html($subcates_toggle.data("hidden"));
                });
            }
        }
    }();

    $(function () {
        $(".tooltip-top").tooltip({ container: "body" });
        $(".tooltip-bottom").tooltip({ container: "body", placement: "bottom" });
        $(".tooltip-left").tooltip({ container: "body", placement: "left" });
        $(".tooltip-right").tooltip({ container: "body", placement: "right" });

        $(".scroll-to").on("click", function () {
            var target = $(this).data("target");
            if (target === "undefined" || !$(target).length) { return false; }
            var top = $(target).offset().top;
            $("html, body").animate({
                scrollTop: top
            }, 400);
            return false;
        });

        $(".demo__switch, #demo_overlay").on("click", function () {
            $("#demo").toggleClass("demo-open");
            $("#demo_overlay").toggleClass("demo-open");
            return false;
        });

        $("a[data-setting]").on("click", function () {
            $("a[data-setting='" + $(this).data("setting") + "']").removeClass("active");
            $(this).addClass("active");

            $.cookie($(this).data("setting"), $(this).data("value"), { expires: 1, path: '/' });
            location.reload();
        });

        $("#sales").on("hidden.bs.collapse", function () {
            $.cookie("sales", 1, { expires: 7, path: "/"});
        });

        var scrollPos = 0;
        $(window).scroll(function () {
            var curScrollPos = $(this).scrollTop();
            if (curScrollPos > scrollPos) {
                // scrolling down
                $("#headerMobile").removeClass("affix");
            } else {
                // scrolling up
                $("#headerMobile").addClass("affix");
            }
            scrollPos = curScrollPos;
        });

        $("#mailer-subscribe-form input.charset").val(document.charset || document.characterSet);
        $("#mailer-subscribe-form").submit(function() {
            var form = $(this);

            var email_input = form.find('.form-control');
            var email_submit = form.find('input[type="submit"]');
            if (!email_input.val()) {
                email_input.addClass('error');
                return false;
            } else {
                email_input.removeClass('error');
            }

            email_submit.hide();
            email_input.after('<i class="spinner"></i>');

            $('#mailer-subscribe-iframe').load(function() {
                $('#mailer-subscribe-form').hide();
                $('#mailer-subscribe-iframe').hide();
                $('#mailer-subscribe-thankyou').show();
            });
        });
    });
}(window.WA_THEME = window.WA_THEME || {}, jQuery));

var fMessages = (function ($) {
    var $container = $("#messages"),
        item,
        timer = null,
        cfg = $("#config").data();

    function getItem (data) {
        var url = typeof data.url !== "undefined" ? data.url : "javascript:void(0)";
        return "<div class='messages__item'>" + data.action + " <a href='" + url + "' class='messages__link'>" + data.target + "</a><a href='#' class='messages__cancel'>" + $container.data("cancel")+ "</a></div>";
    }

    return {
        init: function () {
            if ($container.length == 0) { return false; }

            var that = this;

            $(window).on("messageAdd", function (e, data) {
                if (data.class == "js-compare-remove" && $(".js-compare").length) {
                    data.url = $(".js-compare").attr("href");
                }

                var itemHTML = getItem(data);
                item = $(itemHTML).prependTo($container);
                item.find(".messages__cancel").data("product", data.id).attr("data-product", data.id).addClass(data.class);
                clearTimeout(timer);
                that.showContainer();
                timer = setTimeout(function () {
                    that.hideContainer();
                }, 3000);
            });

            $container.on("click",".js-cart-remove",function() {
                var $msgItem = $(this).closest(".messages__item"),
                    cartId = $(this).data("id");
                $.post(cfg.cart + "delete/", {html: 1, id: cartId}, function (response) {
                    if (response.status === "ok") {
                        $(window).trigger("updateCart", response.data);
                        $msgItem.remove();
                    }
                }, "json");
                return false;
            });

            $container.hover(function () {
                clearTimeout(timer);
            }, function () {
                timer = setTimeout(function () {
                    that.hideContainer();
                }, 3000);
            });
        },
        hideContainer: function () {
            $container.removeClass("is-open");
            $container.html("");
        },
        showContainer: function () {
            $container.addClass("is-open");
        }
    };
}(jQuery));

var fCart = (function ($) {
    var container = $(".flyingCart"),
        timer,
        cfg = $("#config").data();

    return {
        init: function () {
            if (container.length == 0) { return false; }

            var that = this,
                parent = container.closest("li");

            parent.hover(function () {
                that.show_fCart();
            }, function () {
                that.hide_fCart();
            });

            container.on("click", ".flyingCart__delete", function () {
                var sku_id = $(this).closest(".row").data("skuid");
                $.post(cfg.cart + "delete/", {html: 1, id: sku_id}, function (response) {
                    if (response.status === "ok") {
                        that.remove_fCart_item(sku_id);

                        // Изменяем индикаторы корзины
                        $(window).trigger("updateCart", response.data);

                        if (response.data.count == 0) {
                            container.fadeOut().addClass("is-empty");
                        }
                    }
                }, "json");
                return false;
            });

            $(window).on("fCart_process", function (e, data) {
                if (cfg.cart === "undefinded") { return false; }

                var product_data = $(".js-product-data[data-id='" + data.product_id + "']").data(),
                    fCart_item = container.find(".row[data-skuid='" + data.sku_id + "']"),
                    product_count = parseInt(data.qty, 10) || 1;

                if (fCart_item.length) {
                    that.update_fCart_item(fCart_item, parseInt(product_data.price, 10), product_count);
                } else {
                    product_data.sku_id = data.sku_id;
                    that.add_fCart_item(product_data, product_count);
                }
            });
        },
        show_fCart: function () {
            if (container.hasClass("is-empty")) { return false; }
            clearTimeout(timer);
            if (container.is(":animated")) { return false; }
            container.fadeIn();
        },
        hide_fCart: function () {
            timer = setTimeout(function () {
                container.fadeOut();
            }, 1000);
        },
        add_fCart_item: function (productData, count) {
            var item = $("#flying_cart_template .row").clone();

            item.data("skuid", productData.sku_id).attr("data-skuid", productData.sku_id)
            .find("img").attr({ "src": productData.image96, "alt": productData.name }).end()
            .find(".flyingCart__name").html(productData.name).end()
            .find(".flyingCart__price").html(this.currency_format(productData.price * count, 1, WA_THEME.currency)).end()
            .find(".flyingCart__count").html(count).end();

            container.removeClass("is-empty").find(".flyingCart__content").prepend(item);
        },
        remove_fCart_item: function (skuId) {
            var item = container.find(".row[data-skuid='" + skuId + "']");
            item.animate({ opacity: 0 }, "slow", function () {
                item.remove();
            });
        },
        update_fCart_item: function (item, price, count) {
            var qty = item.find(".flyingCart__count");
            qty.html(parseInt(qty.html(), 10) + count);
            item.find(".flyingCart__price").html(this.currency_format(parseInt(qty.html(), 10) * price, 1, WA_THEME.currency));
        },
        currency_format: function (number, no_html, currency) {
            var i, j, kw, kd, km;
            var decimals = currency.frac_digits;
            var dec_point = currency.decimal_point;
            var thousands_sep = currency.thousands_sep;

            if( isNaN(decimals = Math.abs(decimals)) ){
                decimals = 2;
            }
            if( dec_point == undefined ){
                dec_point = ",";
            }
            if( thousands_sep == undefined ){
                thousands_sep = ".";
            }

            i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

            if( (j = i.length) > 3 ){
                j = j % 3;
            } else{
                j = 0;
            }

            km = (j ? i.substr(0, j) + thousands_sep : "");
            kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
            kd = (decimals && (number - i) ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

            var number = km + kw + kd;
            var s = (no_html!=1) ? currency.sign : currency.sign_html;
            if (!currency.sign_position) {
                return s + currency.sign_delim + number;
            } else {
                return number + currency.sign_delim + s;
            }
        }
    }
}(jQuery));

var pcHeader = (function ($) {
    var timer,
        md_breakpont = 992;

    function fix_dropdowns() {
        $(".navbar-categories .dropdown-menu, .sbNav .dropdown-menu").each(function () {
            $(this).removeClass("drowdown-menu-reversed");
            if ($(this).offset().left + $(this).outerWidth() > $(window).width()) {
                $(this).addClass("drowdown-menu-reversed");
            }
        });
    }

    return {
        init: function () {
            var $w = $(window);
            if ($w.width() < md_breakpont) { return false; }

            fix_dropdowns();

            $(window).on("resize", function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fix_dropdowns();
                }, 100);
            })
        }
    };
}(jQuery));

$(document).ready( function() {
    fMessages.init();
    fCart.init();
    pcHeader.init();
});
