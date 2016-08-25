/**
 *
 */
/* (function($) { */
$.layout = {
    /*
     * #/list[:query][:offset?]/item/tab/?param1=value2
     */
    path: {
        'list': null, /* apps|plugins|themes */
        'query': null, /* all|app=shop|top related to */
        'item': null, /* item id */
        'tab': null,
        'raw': null,
        'filter': {}
        /* main */
    },
    options: {
        default_list: 'featured',
        default_query: {},
        title: 'Installer',
        debug: true,
        duration: 500,
        animation: false,
        inline_query: ['commercial', 'sort']

    },
    $sidebar: null,
    $list: null,
    queue: [],
    time: {
        start: new Date(),
        /**
         * @return int
         */
        interval: function (relative) {
            var d = new Date();
            return (parseFloat(d - this.start) / 1000.0 - (parseFloat(relative) || 0)).toFixed(3);
        }
    },

    handlers: {
        list: {
            related: ['query', 'filter'],
            parent: null,
            child: 'item'
        },
        item: {
            parent: 'list'
        },
        tab: {}
    },

    window: {
        title: 'Installer',
        suffix: '',
        setTitle: function (title) {
            document.title = title || this.title + ' — ' + this.suffix;
        },
        getTitle: function () {
            return document.title;
        },
        updateTitle: function (container_id) {
            if (this.titles[container_id]) {
                this.setTitle(this.titles[container_id]);
            } else {
                this.titles[container_id] = this.getTitle();
            }
        },
        titles: {}
    },

    init: function (options) {
        $.extend(this.options, options);
        this.path.list = window.location.href.match(/\/\?/) ? '' : '';
        this.window.setTitle();
        this.initRouting();
    },
    initRouting: function () {
        var self = this;
        if (typeof($.History) != "undefined") {
            $.History.bind(function () {
                $.layout.dispatch();
            });
        } else {
            this.error('Ajax history failed', 'jQuery extension History required');
        }
        $.wa.errorHandler = function (xhr) {
            return self.helper.ajaxErrorHandler(xhr);
        };
        var hash = window.location.hash;
        if (hash === '#/' || hash === '#' || !hash) {
            $.wa.setHash('#/' + this.options.default_list + '/');
        } else {
            $.wa.setHash(hash);
        }
    },

    /**
     *
     * @param {String} path
     * @return {{
     *  list:{String},
     *  query:{String},
     *  item:{String},
     *  tab:{String},
     *  tail:{String},
     *  raw:{String},
     *  filter:{}
     * }}
     */
    parsePath: function (path) {
        /**
         * /apps&filter1=value1&filter2=value2/
         * /apps&filter1=value1&filter2=value2/%app_id%/
         * /apps&filter1=value1&filter2=value2/%app_id%/tab/
         * /plugins&filter1=value1&filter2=value2/%parent/slug%/
         * /plugins&filter1=value1&filter2=value2/%parent/slug%/%pugin_id%/
         * /plugins&filter1=value1&filter2=value2/%parent/slug%/%pugin_id%/%tab%/
         * /themes&filter1=value1&filter2=value2/
         * /themes&filter1=value1&filter2=value2&slug=%parent%/
         * /themes&filter1=value1&filter2=value2/slug%/%theme_id%/%tab%/
         * /themes&filter1=value1&filter2=value2&slug=%parent%/slug%/%theme_id%/%tab%/
         */
        path = path.replace(/(^[^#]*#\/*|\/$)/g, '');
        path = path.replace(/^.*#\//, '').replace(/(^\/|\/$)/, '');
        var matches;
        matches = path.split('/');
        var param_regexp = /&?\b\w+\b=.*$/;
        var param_matches;
        var filter = {};
        for (var i = 0; i < matches.length; i++) {
            if ((param_matches = param_regexp.exec(matches[i])) && param_matches[0]) {
                filter = $.layout.helper.parseParams(param_matches[0], filter);
                matches[i] = matches[i].replace(param_regexp, '');
                if (!matches[i]) {
                    matches.splice(i + 1, 1);
                    --i;
                }
            }
        }

        var list = matches.shift().replace(/:.*$/, '') || ( window.location.href.match(/\/\?/) ? '' : this.options.default_list);
        var query = '';
        var item = false;
        var query_size;

        switch (list) {
            case 'featured':
                item = '';
                break;
            case 'apps':
                item = matches.shift() || '';
                break;
            case 'plugins':
                if (matches.length) {
                    query_size = (matches[0] == 'wa-plugins') ? 2 : 1;
                    query = matches.slice(0, query_size).join('/') || '';
                    matches = matches.slice(query_size);
                    if (item = matches.shift() || '') {
                        item = query + '/' + item;
                        // query = this.path.query;
                    }
                } else {
                    query = this.options.default_query.plugins;
                }
                break;
            case 'widgets':
                if (matches.length) {
                    query_size = (matches[0] == 'wa-plugins') ? 2 : 1;
                    query = matches.slice(0, query_size).join('/') || '';
                    matches = matches.slice(query_size);
                    if (item = matches.shift() || '') {
                        item = query + '/' + item;
                        // query = this.path.query;
                    }
                } else {
                    query = this.options.default_query.widgets;
                }
                break;
            case 'themes':
                query = '';
                item = matches.shift();
                break;
        }

        return {
            list: list,
            query: query,
            item: item,
            tab: matches.length ? matches.shift() || false : false,
            tail: matches.join('/') || '',
            raw: path,
            filter: filter
        };
    },

    /**
     *
     * @param {String} selector
     * @return {jQuery}
     */
    container: function (selector) {
        return this.$app.find('> div' + (selector ? '#' + selector : '') + '.content');
    },

    /**
     *
     * @param {Object|String} path
     */
    dispatch: function (path) {
        if (!this.$app) {
            this.$app = $('#wa-app');
        }
        if (!this.$sidebar) {
            this.$sidebar = this.$app.find('> div.sidebar:first');
        }
        if (path === undefined) {
            path = window.location.hash;
        }
        if (typeof(path) == 'string') {
            path = this.parsePath(path);
        }
        $.layout.trace('$.layout.dispatch started', [this.path, path.raw]);

        var queue = [];
        var Parent = null;
        var child;

        for (var subject in this.handlers) {
            /**
             *
             * @type {*|String}
             */
            var Subject = this.helper.ucfirst(subject);

            if (path[subject] != this.path[subject]) {
                $.layout.trace('$.layout.dispatch ' + subject + ': ', this.path[subject] + '→' + path[subject]);

                if (this.path[subject]) {
                    queue.unshift('blur' + Subject + this.helper.ucfirst(this.path[subject]));
                    queue.unshift('blur' + Subject);
                    if (Parent && (Parent != 'Tab')) {
                        queue.push('load' + Parent);
                    }
                }

                if (this.handlers[subject]['child']) {
                    child = this.handlers[subject]['child'];
                    if (path[child] && (path[child] != this.path[child])) {

                        this.updateRelated(subject, path);
                        $.layout.trace('$.layout.dispatch pass throw to child ' + child + ': ', this.path[child] + '→' + path[child]);
                        continue;
                    }
                }

                if (path[subject]) {
                    queue.push('load' + Subject);
                    queue.push('load' + Subject + this.helper.ucfirst(path[subject]));
                }
                break;
            } else {
                var changed = false;
                if (this.handlers[subject]['related']) {
                    var related = this.handlers[subject]['related'];

                    for (var i = 0; i < related.length; i++) {
                        var rel = related[i];

                        switch (typeof(path[rel])) {
                            case 'object':
                                if ($.param(this.path[rel]) != $.param(path[rel])) {
                                    $.layout.trace('$.layout.dispatch ' + rel + ': ', $.param(this.path[rel]) + '→' + $.param(path[rel]));
                                    queue.push('load' + Subject);
                                    changed = true;
                                }
                                break;
                            case 'string':
                                if (this.path[rel] != path[rel]) {
                                    $.layout.trace('$.layout.dispatch ' + rel + ': ', this.path[rel] + '→' + path[rel]);
                                    queue.push('load' + Subject);
                                    queue.push('load' + Subject + this.helper.ucfirst(path[subject]));
                                    changed = true;
                                }
                                break;
                        }
                        if (changed) {
                            break;
                        }

                    }
                }
            }
            Parent = Subject;
        }

        $.layout.trace('$.layout.dispatch complete with queue', queue.length);
        var name;
        while (name = queue.shift()) {
            $.layout.trace('$.layout.dispatch queue', name);
            // standard convention: if method return false than stop bubble up
            if (this.call(name, [path]) === false) {
                queue = [];
                return false;
            }
        }
    },

    updateRelated: function (subject, path) {
        this.path[subject] = path[subject];
        if (this.handlers[subject]['related']) {
            var related = this.handlers[subject]['related'];

            for (var i = 0; i < related.length; i++) {
                var rel = related[i];

                switch (typeof(path[rel])) {
                    case 'object':
                        if ($.param(this.path[rel]) != $.param(path[rel])) {
                            this.path[rel] = path[rel];
                        }
                        break;
                    case 'string':
                        if (this.path[rel] != path[rel]) {
                            this.path[rel] = path[rel];
                        }
                        break;
                }

            }
        }
    },

    call: function (name, args, callback) {
        var result = null;
        var callable = this.isCallable(name);
        args = args || [];
        $.layout.trace('$.layout.call', [name, args, callable]);
        if (callable) {
            try {
                result = this[name].apply(this, args);
            } catch (e) {
                $.layout.error("Error at method $.layout." + name + ". Original message: " + e.message, e);
            }
        }
        return result;
    },

    blurList: function () {
        this.$sidebar.find('li.selected').removeClass('selected');
        this.path.query = false;
        this.path.item = false;
        this.path.tab = false;
        this.container().find('form').unbind();
        if (this.options.animation) {
            this.container().html('<div class="block"><i class="icon16 loading"></i></div>');
            this.$app.find('div.content:not(:first)').remove();
        }
    },

    loadList: function (path) {
        var url = '?module=' + path.list;
        var self = this;
        if (path.query) {
            url += '&slug=' + path.query;
        }
        url = url.replace(/\\bsort=[^\\/&]+/, '');
        var filter;
        if (path.filter && (filter = decodeURIComponent($.param({'filter': path.filter})))) {
            var regexp;
            for (var i = 0; i < this.options.inline_query.length; i++) {
                regexp = new RegExp('&?\\bfilter\\[' + this.options.inline_query[i] + '\\]=[^&]+');
                filter = filter.replace(regexp, '');
            }
            if (filter.length) {
                url += '&' + filter;
            }
        }
        var id = this.helper.getListId(path);
        var $container = this.container(id);
        if ($container.length && ($container.html() != 'null') && ($container.html() != '')) {
            this.focusList(path);
            this.dispatch(path);
        } else {
            if (!$container.length) {
                this.$app.append('<div class="content left200px" id="' + id + '" style="display:none;"><i class="icon16 loading"></i></div>');
                $container = this.container(id);
            }
            $.layout.trace('$.layout.loadList', url);
            $.layout.loadContent(url, function () {
                self.focusList(path);
                self.dispatch(path);
            }, $container);
        }
    },


    focusList: function (path) {
        this.path.list = path.list;
        this.path.query = path.query;
        this.path.filter = path.filter;
        this.path.item = false;
        this.path.tab = false;

        path = path || this.path;
        var $body = $('body');
        $body.removeClass('i-apps i-themes i-plugins i-widgets i-featured');
        if (['apps', 'themes', 'plugins', 'widgets', 'featured'].indexOf(path.list) >= 0) {
            $body.addClass('i-' + path.list);
        }
        this.$app.find('> div.content:visible').hide();
        this.container(this.helper.getListId(path)).show();
        var filter = '';
        var query = '';
        var i, param, lists = [];
        if (path.query) {
            query = path.query;
            lists = path.query.split(',');
            for (i = 0; i < lists.length; i++) {
                lists[i] += '\\/';
            }
        } else {
            lists.push('')
        }

        if (path.filter) {
            for (param in path.filter) {
                if (path.filter.hasOwnProperty(param)) {
                    if (param == 'slug') {
                        query += '&' + param + '=' + path.filter[param];
                        lists = path.filter[param].split(',');
                    } else {
                        filter += '&' + param + '=' + path.filter[param];
                    }
                }
            }
        }
        this.$sidebar.show();
        this.$sidebar.find('li.selected').removeClass('selected');
        this.$sidebar.find('a[href^="\\.\\/\\#\\/' + path.list + '\\/"]').parent('li').addClass('selected selected375');

        var href = '\\#\\/' + path.list;
        var $list, $selected;


        $.layout.trace('$.layout.focusList', [filter, query]);
        var container_id = this.helper.getListId(path);
        this.window.updateTitle(container_id);

        var $container = this.container(container_id);
        this.$list = $container;

        //show/hide by internal filter fields
        $container.find('.js-inline-search:first').val('');
        this.filterList($container, path.filter);


        var self = this;
        /* update app filters */
        $container.find('.js-filters ul.js-query > li > ul > li.selected').removeClass('selected');
        $container.find('.js-filters ul.js-query > li > ul > li a').each(function () {
            self.helper.updateUrl($(this), [filter]);
        });

        var $query = $container.find('.js-filters ul.js-query:first');
        $selected = $container.find('.js-filters ul.js-query > li:first > a:first');
        $selected.find('> i.icon16, > img').remove();
        var name = [];
        var hint = '';

        /* update filters */
        var $filters = $container.find('.js-filters ul.js-filter');

        //update selected filter&sort
        var internal_filter;
        $filters.each(function () {
            var $scope = $(this);
            if (internal_filter = '' + $scope.data('filter')) {
                var re = new RegExp('&?(' + internal_filter + ')=[^&\/%]*', 'g');
                internal_filter = filter.match(re) || '';
                filter = filter.replace(re, '');
            } else {
                internal_filter = filter;
            }
            $scope.find('> li.selected').removeClass('selected');
            $scope.find('> li a').each(function () {
                self.helper.updateUrl($(this), [filter, query]);
            });
            $scope.find('> li a[data-href^="' + href + internal_filter + '"]:first').parent('li').addClass('selected');
        });

        for (i = 0; i < lists.length; i++) {
            //update icon of category
            //update selected list

            $list = $query.find('a[data-href^="' + href + '%filter%\\/' + lists[i] + '"]:first');

            if (!$list.length) {//themes case
                $list = $query.find('a[data-href^="' + href + '%filter%&slug=' + lists[i] + '\\/"]:first');
            }

            if (filter && !$list.length) {
                $list = $query.find('a[data-href^="' + href + filter + '%filter%\\/' + lists[i] + '"]:first');
            }

            if (!$list.length) {
                $list = $query.find('a[href="' + href + '"]:first');
            }


            if ($list.length) {
                //point category && apps menu
                $list.parent('li').addClass('selected');
                hint = $list.find('span.hint').text().replace(/(^\s+|\s+$)/g, '') || hint;

                name.push($list.text().replace(hint, '').replace(/(^\s+|\s+$)/g, ''));
                $selected.prepend($list.find('i.icon16, img').clone());
                $selected.attr('href', $list.attr('href'));
            }

        }

        this.helper.updateUrl($selected, [filter, query]);
        $selected.find('strong').text(name.join(', '));
        $selected.find('span.hint').text(hint ? ' ' + hint : '');


        $container.trigger($.Event('wa_focus_list'));

        /* update list links */
        $container.find('a.js-item-link[data-href^="\\#"]').each(function () {
            self.helper.updateUrl($(this), [filter, query]);
        });
    },

    filterList: function ($container, filter) {
        //TODO show|hide data
        //resort items
        var param, i;
        var sort = null;
        var params = {};
        var sort_field = 'sort';
        for (i = 0; i < $.layout.options.inline_query.length; i++) {
            param = $.layout.options.inline_query[i];
            if (param == 'sort') {
                sort = filter[param] || null;
            } else {
                params[param] = filter[param] || null;
                if (params[param] == 'true') {
                    params[param] = true;
                } else if (params[param] == 'false') {
                    params[param] = false;
                }
            }
        }

        if (sort) {
            switch (sort) {
                case 'new':
                    sort_field = 'sort-new';
                    break;
                default:
                    sort_field = 'sort';
                    break;

            }
        }

        $.layout.trace('$.layout.filterList', [sort_field, params]);
        //show-hide
        var $items_container = $container.find('ul.js-list-items');

        $items_container.each(function () {
            var $items_container_ = $(this);
            $items_container_.find('> li').each(function (index, el) {
                var data = {};
                var param;
                var $el = $(el);
                var matched = true;
                if (!filter['search'] && $el.data('hide')) {
                    matched = false;
                } else {
                    for (i = 0; i < $.layout.options.inline_query.length; i++) {
                        param = $.layout.options.inline_query[i];
                        if ((param != 'sort') && (params[param] !== null)) {
                            data[param] = $el.data('filter-' + param);
                            if (data[param] != params[param]) {
                                matched = false;
                                break;
                            }
                        }

                        if (matched && filter['search']) {
                            data['search'] = '' + $el.data('search');
                            matched = filter['search'].test(data['search']);
                        }
                    }
                }

                if (matched) {
                    $el.show();
                } else {
                    $el.hide();
                }
            }).sort(function (a, b) {
                var delta = parseInt($(b).data(sort_field)) - parseInt($(a).data(sort_field));
                delta = Math.max(-1, Math.min(1, delta));
                return delta;
            }).appendTo($items_container_);
        });

        //TODO resort visible items

    },

    searchList: function (search, $input) {
        var filter = this.path.filter;
        try {
            if (search) {
                filter['search'] = new RegExp(search, 'i');
                $.layout.trace('$.layout.searchList', search);
            }
            $input.removeClass('error').attr('title', '');
            this.filterList(this.$list, filter);
        } catch (ex) {
            $input.addClass('error').attr('title', ex.message);
        }
    },

    loadItem: function (path) {

        var url = '?module=' + path.list;
        url += '&action=info';
        url += '&slug=' + path.item;
        url += '&query=' + path.query;
        var id = this.helper.getItemId(path);
        if (path.filter) {
            //todo edition&vendor&filter workaround
            //add chunks to url and id
        }

        $.layout.trace('$.layout.loadItem', id);

        var $container = this.$app.find('> div#' + id);

        if (!$container.length && ($container.html() != 'null') && ($container.html() != '')) {
            var href = path.item.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
            var item_selector = '#wa-app > div.content:first a[href*="\\/' + href + '\\/"]:first';
            var $item = $(item_selector).parents('li');
            //put item name as content before it loaded
            var html = $item.length ? $item.html() : (!this.options.animation ? '<i class="icon16 loading"></i>' : '');
            $.layout.trace('$.layout.loadItem item.html()', [$item.html(), $item]);

            this.$app.find('> div.content:last').after('<div class="content left200px" id="' + id + '" style="display:none;">' + html + (this.options.animation ? '<i class="icon16 loading"></i>' : '')
                + '</div>');
            $container = this.$app.find('> div#' + id);
            $container.find('a').contents().unwrap();
            $.layout.trace('$.layout.loadList', url);

            var self = this;
            $.layout.loadContent(url, function () {
                self.path.item = path.item;
                // self.path.filter = path.filter;
                self.path.tab = false;
                self.focusItem(path, $container);
                self.dispatch(path);
            }, $container);
        } else {
            this.path.item = path.item;
            this.focusItem(path, $container);
            this.dispatch(path);
        }

    },

    loadTab: function (path) {
        this.path.tab = path.tab;
        var id = this.helper.getItemId(path);
        //todo edition&vendor&filter workaround
        //add chunks to url and id
        var $container = this.container(id);
        $container.find('section').hide();
        var $nav = $container.find('nav:first > ul:first');
        $nav.find('li.selected').removeClass('selected');
        if (path.tab) {
            $container.find('div.i-screenshots:first').hide();
            if ($nav.find('> li').length == 1) {
                $nav.find('> li').show();
            }
        } else {
            $container.find('div.i-screenshots:first').show();
            if ($nav.find('> li').length == 1) {
                $nav.find('> li').hide();
            }
        }
        var item = path.item;
        if ((path.list == 'plugins') && (!path.item.match(/^wa-plugins\//))) {
            item = item.replace(/\//, '/' + path.list + '/');
        }
        id = '#tab-' + (item + '-' + (path.tab || 'info')).replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
        //tab-pocketlists-info
        var href = path.item + '/';
        if (path.tab) {
            href += path.tab + '/';
        }
        href = href.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
        $nav.find('a[href$="' + href + '"]').parents('li').addClass('selected');
        $container.find(id).show();
    },
    blurTab: function (path) {
        this.path.tab = false;
        this.loadTab(path);
    },
    blurItem: function (path) {
        var self = this;
        this.$app.find('> div.content').hide();
        var $content = this.$app.find('> div.content:first');

        this.$sidebar.show();
        if (this.options.animation) {
            $content.css('margin-left', '0px');
        }
        $content.show();
        if (this.options.animation) {
            self.$sidebar.animate({
                'width': '200px'
            }, this.options.duration).queue(function () {
                $(this).dequeue();
            });

            $content.animate({
                'margin-left': '200px'
            }, this.options.duration);
        } else {
            self.$sidebar.css({
                'width': '200px'
            });
            $content.css({
                'margin-left': '200px'
            });
        }
        var $body = $('body');
        $body.removeClass($body.attr('class')).addClass('i-' + path.list);
        $body = $('html');
        $body.removeClass($body.attr('class'));

        this.blurTab(this.path);
        this.path.tab = null;
        this.path.item = null;
    },
    focusItem: function (path, $container) {
        var self = this;
        $.layout.trace('$.layout.focusItem', path);
        this.$app.find('> div.content:visible').hide();

        var container_id = this.helper.getItemId(path);
        this.window.updateTitle(container_id);

        if (this.options.animation) {
            self.$sidebar.show().animate({
                'width': '0px'
            }, this.options.duration).queue(function () {
                $(this).hide();
                $(this).dequeue();
            });
        } else {
            self.$sidebar.hide();
        }
        if (this.options.animation) {
            $container.show().animate({
                'margin-left': '0px'
            }, this.options.duration).queue(function () {
                $(this).dequeue();
            });
        } else {
            $container.show().css({
                'margin-left': '0px'
            });
        }

        var $body = $('body');
        $body.removeClass('i-apps i-themes i-plugins i-widgets i-featured');
        if (['apps', 'themes', 'plugins', 'widgets', 'featured'].indexOf(path.list) >= 0) {
            $body.addClass('i-' + path.list);
        }

        $body.addClass(this.premium.getClass());


        if (this.path.filter) {
            var filter = '';
            for (var param in this.path.filter) {
                if (this.path.filter.hasOwnProperty(param)) {
                    if (param != 'slug') {
                        filter += '&' + param + '=' + this.path.filter[param];
                    }
                }
            }
            $container.find('a.js-item-link[data-href^="\\#"]').each(function () {
                self.helper.updateUrl($(this), (self.path.list == 'themes' ) ? [self.path.query, filter] : [filter, self.path.query]);
            });
        }

        $container.on('click', 'a.js-action', function () {
            return self.click($(this));
        });


    },

    showScreenshot: function ($el) {
        var $img = $el.find('img:first');
        $el.parents('ul').find('> li.selected').removeClass('selected');
        var $big_img = $el.parents('.i-screenshots').find('#current img:first');
        $big_img.attr('src', $img.data('src'));
        $el.parent('li').addClass('selected');
        return false;
    },

    showLicense: function ($el) {
        $el.parents('div.value:first').find('div.dialog:first').show();
    },

    hideLicense: function ($el) {
        $el.parents('div.dialog:first').hide();
    },

    /**
     * Handle js section interactions
     *
     * @param {jQuery} $el
     * @return {Boolean}
     */
    click: function ($el) {
        var args = $el.attr('href').replace(/.*#\//, '').replace(/\/$/, '').split('/');
        var method = $.layout.getMethod(args, this);

        if (method.name) {
            $.layout.trace('$.layout.click', method);
            if (!$el.hasClass('js-confirm') || confirm($el.data('confirm-text') || $el.attr('title') || 'Are you sure?')) {
                method.params.push($el);
                this[method.name].apply(this, method.params);
            }
        } else {
            $.layout.error('Not found js handler for link', [method, $el])
        }
        return false;
    },

    load: function (path) {
        var $container = this.container();
        if (true || !$container.length || ($container.data('product-id') != path.id)) {
            var self = this;
            var url = '?module=' + path.list;
            $.layout.trace('$.layout.load', url);
            this.$sidebar.find('li.selected').removeClass('selected');
            $.layout.loadContent(url, function () {
                self.path.list = path.list;
                var href = path.list.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
                self.$sidebar.find('a[href="\\#\\/' + href + '\\/"]').parent('li').addClass('selected');
                self.dispatch(path);
            }, this.container(this.helper.getListId(path)));
        }
    },

    loadContent: function (url, callback, $container) {
        var r = Math.random();
        this.random = r;
        var self = this;
        $.layout.trace('$.layout.loadContent', [url, $container]);
        $.get(url, function (result) {
            if (!$container && (self.random != r)) {
                // too late: user clicked something else.
                return;
            }
            $container = $container || self.container();
            if (result) {
                $container.html(result);
                $('html, body').animate({
                    scrollTop: 0
                }, 200);
                $container.trigger($.Event('wa_load_list'));
                if ((self.random == r) && (typeof(callback) == 'function')) {
                    try {
                        $container.find('.js-inline-search:first').val('').on('change keyup', function () {
                            var $input = $(this);
                            self.searchList($input.val() || null, $input);
                        });
                        callback();
                    } catch (e) {
                        $.layout.error('$.layout.loadContent callback error: ' + e.message, e);
                    }
                }
            }
        });
    },

    onLoad: function () {
        $('#s-settings-content').on('click', 'a.js-action', function () {
            return self.click($(this));
        });
    },

    /**
     * @param {Array} args
     * @param {object} scope
     * @param {String} name
     * @return {{name:{String},params:{Array}}}
     */
    getMethod: function (args, scope, name) {
        var chunk, callable;
        var method = {
            'name': false,
            'params': []
        };
        if (args.length) {
            $.layout.trace('$.getMethod', args);
            name = name || args.shift();
            while (chunk = args.shift()) {
                name += chunk.substr(0, 1).toUpperCase() + chunk.substr(1);
                callable = (typeof(scope[name]) == 'function');
                $.layout.trace('$.getMethod try', [name, callable, args]);
                if (callable === true) {
                    method.name = name;
                    method.params = args.slice(0);
                }
            }
        }
        return method;
    },

    /**
     * Debug trace helper
     *
     * @param {String} message
     * @param {} data
     */
    trace: function (message, data) {
        var timestamp = null;
        if (this.options.debug && console) {
            timestamp = this.time.interval();
            console.log(timestamp + ' ' + message, data);
        }
        return timestamp;
    },

    /**
     * Handler error messages
     *
     * @param {String} message
     * @param {Object} data
     */
    error: function (message, data) {
        if (console) {
            console.error(message, data);
        }
    },
    isCallable: function (name) {
        return (typeof(this[name]) == 'function');
    },
    premium: {
        classes: {},
        setClass: function (path, css_class) {
            this.classes[path] = css_class;
        },
        getClass: function () {
            return this.classes[this.path()] || '';
        },
        path: function () {
            return $.layout.path.list + ':' + $.layout.path.item;
        }

    },
    helper: {
        updateUrl: function ($el, filter) {
            var href = '' + $el.data('href');
            if (href) {
                var internal_filter = '' + $el.data('filter');
                var re;
                if (internal_filter.length) {
                    re = new RegExp('&(' + internal_filter + ')=[^&\/%]*', 'g');
                } else {
                    re = new RegExp('');
                }

                var map = [
                    new RegExp('%filter%'),
                    new RegExp('%query%'),
                    new RegExp('%sort%')
                ];

                for (var i = 0; i < filter.length; i++) {
                    if (filter[i] != undefined) {
                        href = href.replace(map[i], filter[i].replace(re, ''));
                    }
                }
                $el.attr('href', href.replace(/%\w+%/g, '').replace(/[&\/]+\//g, '/').replace(/([&\/])\1+/g, '$1'));
            }
        },
        getItemId: function (path) {
            return 'ajax-item-' + this.replace(path.list) + '-' + this.replace(path.item);
        },
        getListId: function (path) {
            var filter = '';
            if (path.filter && (filter = decodeURIComponent($.param({'filter': path.filter})))) {
                var regexp;
                for (var i = 0; i < $.layout.options.inline_query.length; i++) {
                    regexp = new RegExp('&?\\bfilter\\[' + $.layout.options.inline_query[i] + '\\]=[^&\/]+');
                    filter = filter.replace(regexp, '');
                }
            }


            var id = 'ajax-list-' + this.replace(path.list)
                + '-' + this.replace(path.query || '')
                + this.replace('' + filter);
            return id;
        },
        replace: function (string) {
            return ('' + (string || '')).replace(/\//g, '-').replace(/,/g, '_').replace(/[^\w_\-]+/g, '');
        },

        /**
         * @param {String} params_string
         * @param {object} params
         * @return {object}
         */
        parseParams: function (params_string, params) {
            params_string = ('' + params_string).replace(/^&/, '');
            params = params || {};
            if (!params_string) {
                return params;
            }
            var p = params_string.split('&');
            for (var i = 0; i < p.length; i++) {
                var t = p[i].split('=');
                params[t[0]] = t.length > 1 ? t[1] : '';
            }
            return params;
        },
        /**
         * @param {String} string
         * @return {String}
         */
        ucfirst: function (string) {
            return string ? (string.substr(0, 1).toUpperCase() + string.substr(1)) : '';
        },
        ajaxErrorHandler: function (xhr) {
            if ((xhr.status === 403) || (xhr.status === 404)) {
                var text = $(xhr.responseText);
                $.layout.error(text, xhr.status);
                if (text.find('.dialog-content').length) {
                    text = $('<div class="block double-padded"></div>').append(text.find('.dialog-content *'));

                } else {
                    text = $('<div class="block double-padded"></div>').append(text.find(':not(style)'));
                }
                $("#s-content").empty().append(text);
                return false;
            }
            return true;
        },
        submit: function (form, event) {
            var $form = $(form);
            $form.find(':submit').attr('disabled', true).after('<i class="icon16 loading"></i>');
            try {
                var d = new Date();
                var url = $form.attr('action') + '&_=' + d.getMilliseconds();
                $.layout.trace('$.layout.submit', url);
                $.ajax(url, {
                    'data': $form.serialize(),
                    'type': 'POST',
                    'success': function (data) {
                        $.layout.blurList();
                        $.layout.container().html(data);
                        $('html, body').animate({
                            scrollTop: 0
                        }, 200);
                        $.layout.focusList();
                    },
                    'error': function (jqXHR, textStatus, errorThrown) {
                        $.layout.error('Error at $.layout.submit', errorThrown);
                    }
                });
            } catch (e) {

            }
            return false;
        }
    }
};
/* }); */


// variable for event touch data
var UserTouch = (function () {

    var min_touch_length = 5,
        touch_is_vertical,
        finger_place_x_start,
        finger_place_y_start,
        finger_place_x_end,
        finger_place_y_end,
        touch_delta_x,
        touch_delta_y,
        time_start,
        time_end,
        element;

    var on_touch_start = function (event) {
        finger_place_x_start = event.touches[0].pageX;
        finger_place_y_start = event.touches[0].pageY;
        finger_place_x_end = null;
        finger_place_y_end = null;
        touch_delta_x = null;
        touch_delta_y = null;
        touch_is_vertical = false,
            time_start = ( new Date() ).getTime(),
            time_end = false;

        UserTouch = {
            offsetStart: {
                top: finger_place_y_start,
                left: finger_place_x_start
            },
            offsetEnd: {
                top: false,
                left: false
            },
            offsetDelta: {
                x: false,
                y: false
            },
            orientation: {
                x: false,
                y: false
            },
            touchTime: false
        };

        element.addEventListener("touchmove", on_touch_move, false);
        element.addEventListener("touchend", on_touch_end, false);
    };

    var on_touch_move = function (event) {
        time_end = (new Date()).getTime();
        finger_place_x_end = event.touches[0].pageX;
        finger_place_y_end = event.touches[0].pageY;
        touch_delta_x = finger_place_x_end - finger_place_x_start;
        touch_delta_y = finger_place_y_end - finger_place_y_start;

        var is_horizontal = ( Math.abs(touch_delta_x) > Math.abs(touch_delta_y) && Math.abs(touch_delta_x) > min_touch_length );
        if (is_horizontal) {
            event.preventDefault();
        }

        UserTouch.offsetEnd = {
            top: finger_place_y_end,
            left: finger_place_x_end
        };

        UserTouch.offsetDelta = {
            x: touch_delta_x,
            y: touch_delta_y
        };

        if (Math.abs(touch_delta_y) > min_touch_length) {
            if (touch_delta_y < 0) {
                UserTouch.orientation.y = "top";
            } else {
                UserTouch.orientation.y = "bottom";
            }
        }

        if (Math.abs(touch_delta_x) > min_touch_length) {
            if (touch_delta_x < 0) {
                UserTouch.orientation.x = "left";
            } else {
                UserTouch.orientation.x = "right";
            }
        }

        UserTouch.touchTime = (time_end - time_start);
    };

    var on_touch_end = function () {
        // отключаем обработчики
        element.removeEventListener("touchmove", on_touch_move);
        element.removeEventListener("touchend", on_touch_end);
    };

    var bindEvents = function () {
        element = document.body;
        element.addEventListener("touchstart", on_touch_start, false);
    };

    document.addEventListener("DOMContentLoaded", function () {
        bindEvents();
    });

    return {
        offsetStart: {
            top: false,
            left: false
        },
        offsetEnd: {
            top: false,
            left: false
        },
        offsetDelta: {
            x: false,
            y: false
        },
        orientation: {
            x: false,
            y: false
        },
        touchTime: false
    };

})();

var SectionSlider = (function ($) {

    var storage = {
        hiddenClass: "is-hidden"
    };

    SectionSlider = function (options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$slider = that.$wrapper.find(".i-list-wrapper");
        that.$slides = that.$slider.find(".i-item-wrapper");
        that.$controls = that.$wrapper.find(".i-controls-wrapper");

        // VARS
        that.slide_width = that.$slides.first().outerWidth(true);
        that.slide_count = that.$slides.length;
        that.slider_width = that.$slider.outerWidth();
        that.slider_max_width = that.slide_count * that.slide_width;
        that.slide_move = that.getSlideMove();

        // DYNAMIC VARS
        that.slide_left = 0;
        that.offset = 0;
        that.timeout = 0;
        that.is_mobile = false;

        // INIT
        that.initSlider();
    };

    SectionSlider.prototype.initSlider = function () {
        var that = this;

        that.initControls();

        that.bindEvents();
    };

    SectionSlider.prototype.bindEvents = function () {
        var that = this,
            $wrapper = that.$wrapper,
            slider = that.$slider.get(0);

        $wrapper.on("click", ".show-before-item", function () {
            that.moveSlider("left");
            return false;
        });

        $wrapper.on("click", ".show-next-item", function () {
            that.moveSlider("right");
            return false;
        });

        // For resize
        $(window).resize(function () {
            if (that.$wrapper.length && !that.is_mobile) {
                clearTimeout(that.timeout);

                that.timeout = setTimeout(function () {
                    that.reInitializing();
                }, 2000);
            }
        });

        window.addEventListener("orientationchange", function () {
            that.reInitializing();
        });

        slider.addEventListener("touchstart", function () {
            if (!that.is_mobile) {
                that.is_mobile = true;
            }
        }, false);

        slider.addEventListener("touchend", function () {
            that.onTouchEnd();
        }, false);

    };

    SectionSlider.prototype.onTouchEnd = function () {
        var that = this,
            min_width = 50,
            $beforeLink = that.$wrapper.find(".show-before-item"),
            $nextLink = that.$wrapper.find(".show-next-item");

        if (Math.abs(UserTouch.offsetDelta['x']) > min_width) {

            if (UserTouch.orientation.x == "right") {
                $beforeLink.trigger("click");
            }

            if (UserTouch.orientation.x == "left") {
                $nextLink.trigger("click");
            }
        }
    };

    SectionSlider.prototype.moveSlider = function (type) {
        var that = this,
            slide_move = that.slide_move,
            offset;

        // Left offset
        if (type == "left") {
            if (that.slide_left >= slide_move) {
                that.slide_left -= slide_move;
            } else {
                that.slide_left = 0;
            }
        }

        // Right offset
        if (type == "right") {

            // If the number of slides more shift
            if (that.slide_count > slide_move) {

                // If end of right
                if (that.slide_left < that.slide_count - slide_move) {
                    that.slide_left += slide_move;
                } else {
                    that.slide_left = that.slide_count - slide_move;
                }

            }
        }

        offset = that.slide_left * that.slide_width;

        // Fix for right corner
        if (that.slider_width > ( that.slider_max_width - offset )) {
            offset = that.slider_max_width - that.slider_width;
        }

        // Fix for right corner
        if (that.slide_left > 0 && type == "left" && offset == that.offset) {
            that.moveSlider(type);
            return false;
        }

        that.$slider.css({
            left: -(offset)
        });

        that.offset = offset;
    };

    SectionSlider.prototype.reInitializing = function () {
        var that = this;

        that.slide_width = that.$slides.first().outerWidth(true);
        that.slider_width = that.$slider.outerWidth();
        that.slider_max_width = that.slide_count * that.slide_width;
        that.slide_move = that.getSlideMove();
        that.slide_left = 0;
        that.offset = 0;

        that.$slider.css({left: 0});

        that.initControls();
    };

    SectionSlider.prototype.initControls = function () {
        var that = this;

        if (that.slide_count <= 1 || that.slider_width > that.slider_max_width) {
            that.$controls.addClass(storage.hiddenClass);
        } else {
            that.$controls.removeClass(storage.hiddenClass);
        }
    };

    // Calculate how many slides move
    SectionSlider.prototype.getSlideMove = function () {
        var that = this,
            move;

        move = Math.round(that.slider_width / that.slide_width);

        return (move > 1) ? move : 1;
    };

    return SectionSlider;

})(jQuery);